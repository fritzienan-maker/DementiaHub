// ════════════════════════════════════════════════════════════
// CONFIG
// ════════════════════════════════════════════════════════════
const CFG = {
  // API key is NOT here — it lives in Vercel env vars (GHL_API_KEY).
  // All GHL calls go through /api/ghl via window.DHAPI.
  locationId:        'Idf9v4q6aqh5KhzXip6e',
  accessKey:         'admin123',
  elevenLabsAgentId: 'agent_7801kkd50dzsez4tfv4qme5mn6br', // ← replace with your ElevenLabs Conversational AI agent ID
};

const STAFF_LIST = ['Case Manager Wibiz','DementiaSG Admin','Helpline Staff Wibiz','Read-only Analyst Wibiz','Unassigned'];
const ROLES      = ['Case Manager Wibiz','DementiaSG Admin','Helpline Staff Wibiz','Read-only Analyst Wibiz'];
const CASE_STATUSES = [
  'New - Untriaged',
  'Self-Serve Resolved',
  'Needs Staff - Awaiting Contact',
  'Escalation \u2013 No Staff Available',
  'In Progress',
  'Callback Scheduled',
  'Scheduled / Follow Up',
  'Referred / Redirected',
  'Closed - Resolved',
  'Closed - Unreachable',
  'Urgent - Immediate Action',
];
// Which full statuses map to the simplified 'resolved' / 'triaged' display buckets
const _RESOLVED_STATUSES = new Set(['Self-Serve Resolved','Closed - Resolved','Closed - Unreachable','Referred / Redirected']);
const _TRIAGED_STATUSES  = new Set(['In Progress','Needs Staff - Awaiting Contact','Callback Scheduled','Scheduled / Follow Up','Escalation \u2013 No Staff Available']);

// ── Role helpers ──────────────────────────────────────────────
function currentRole(){ return getCurrentStaff()?.staffRole || ''; }
function isCaseManager(){ return currentRole() === 'Case Manager Wibiz'; }

// roleAccessControl: filter enriched cases for current role.
// Case Manager sees all; others see only cases assigned to their role.
function roleAccessControl(enrichedList){
  if(isCaseManager()) return enrichedList;
  const role = currentRole();
  return enrichedList.filter(o => o.assignedTo === role || o.assignedTo === 'Unassigned');
}

// ════════════════════════════════════════════════════════════
// STATE
// ════════════════════════════════════════════════════════════
let ghlOpps      = null;  // null=loading
let activeFilter = 'all';
let searchQuery  = '';
let sortCol      = 'updated';
let sortDir      = 'desc';
let activeChatIdx = 0;
let selectedCaseId = null; // tracks which case detail panel is open
let assignments  = JSON.parse(localStorage.getItem('dsg_assignments') || '{}');
let callbacks    = JSON.parse(localStorage.getItem('dsg_callbacks') || '[]');
let caseStatuses = JSON.parse(localStorage.getItem('dsg_case_statuses') || '{}');
let caseNotes    = JSON.parse(localStorage.getItem('dsg_case_notes') || '{}');
let cbStatuses   = JSON.parse(localStorage.getItem('dsg_cb_statuses') || '{}'); // oppId → {done,ts}

// ════════════════════════════════════════════════════════════
// AUTH
// ════════════════════════════════════════════════════════════
function isAuth(){ return sessionStorage.getItem('dsg_auth')==='1'; }

function doLogin(key, staffRole){
  if(key !== CFG.accessKey) return false;
  // Use role as display name since we no longer collect a separate name
  DHUserContext.saveStaffSession(staffRole, staffRole);
  DHUserContext.configureGHLWidget(DHUserContext.getStaffContext());
  return true;
}

function doLogout(){
  DHUserContext.clearStaffSession();
  ghlOpps = null;
  render();
}

function getCurrentStaff(){
  return DHUserContext.getStaffContext();
}

// ════════════════════════════════════════════════════════════
// ROUTING
// ════════════════════════════════════════════════════════════
function getView(){ return location.hash.replace('#','')||'overview'; }
window.addEventListener('hashchange', () => { selectedCaseId = null; render(); });

// ════════════════════════════════════════════════════════════
// GHL API — proxied securely via /api/ghl (DHAPI)
// ════════════════════════════════════════════════════════════

async function fetchGHL(){
  try{
    ghlOpps = await DHAPI.getOpportunities(50);
    console.log('[fetchGHL] Loaded', ghlOpps.length, 'opportunities');
  }catch(e){ ghlOpps=[]; console.warn('[fetchGHL]', e.message); }
  render();
}

async function syncNoteToGHL(contactId, text){
  return DHAPI.addNote(contactId, text);
}

// ════════════════════════════════════════════════════════════
// DATA ENRICHMENT
// ════════════════════════════════════════════════════════════
const CRIT_KW  = ['urgent','critical','emergency','fall','missing','wander','danger','immediate','acute','assault','suicid','harm'];
const WARN_KW  = ['anxious','distress','confused','upset','worried','agitated','unsafe','concern'];
const CAT_MAP  = {
  'Safety':   ['fall','missing','wander','danger','harm','suicid','assault'],
  'Medical':  ['medical','health','doctor','hospital','medication','pain','ill'],
  'Emotional':['anxiety','distress','depress','grief','upset','agitated'],
  'Admin':    ['grant','subsidy','cara','registration','form','paperwork'],
  'Resource': ['resource','centre','facility','service','referral'],
};
const INTENT_MAP = {
  'Emergency':         ['urgent','emergency','critical','immediate'],
  'Seeking Help':      ['help','assist','support','need'],
  'Information':       ['info','resource','find','where','what','how'],
  'Follow-up':         ['follow','update','status','check'],
  'Complaint':         ['complaint','issue','problem'],
};

function enrich(op, idx){
  const txt = ((op.name||'')+' '+(op.pipelineStageName||'')).toLowerCase();
  const hrs  = (Date.now()-new Date(op.updatedAt||op.createdAt).getTime())/3600000;

  let urgency = 'low';
  if(CRIT_KW.some(k=>txt.includes(k))||hrs>72) urgency='critical';
  else if(WARN_KW.some(k=>txt.includes(k))||hrs>24) urgency='medium';

  let category = 'General';
  for(const [cat,kws] of Object.entries(CAT_MAP)){
    if(kws.some(k=>txt.includes(k))){ category=cat; break; }
  }

  let intent = 'General Inquiry';
  for(const [int,kws] of Object.entries(INTENT_MAP)){
    if(kws.some(k=>txt.includes(k))){ intent=int; break; }
  }

  let sla = 'ok';
  if(hrs>4) sla='breach'; else if(hrs>2) sla='warn';

  const caseId = 'C-'+String(op.id||idx).replace(/[^a-z0-9]/gi,'').slice(-6).toUpperCase();
  const assignedTo = assignments[op.id] || 'Unassigned';

  // Normalize display status — local override takes priority, then GHL pipeline
  const localStatus = caseStatuses[op.id];
  let displayStatus = 'new';
  if (localStatus) {
    if      (_RESOLVED_STATUSES.has(localStatus)) displayStatus = 'resolved';
    else if (_TRIAGED_STATUSES.has(localStatus))  displayStatus = 'triaged';
    else if (localStatus === 'Urgent - Immediate Action') displayStatus = 'critical';
    else {
      // Legacy values stored before CASE_STATUSES was introduced
      const ls = localStatus.toLowerCase().replace(/\s+/g,'');
      if      (ls === 'resolved')                          displayStatus = 'resolved';
      else if (ls === 'inprogress' || ls === 'triaged')    displayStatus = 'triaged';
    }
  } else {
    const stage = (op.pipelineStageName || '').toLowerCase();
    const ghlSt = (op.status || '').toLowerCase();
    if      (ghlSt === 'won' || ghlSt === 'lost')       displayStatus = 'resolved';
    else if (/triage|progress|active|contact|open/i.test(stage)) displayStatus = 'triaged';
  }

  // Due-soon: high/critical unresolved, OR callback pending
  const cbEntry = cbStatuses[op.id];
  const dueSoon = displayStatus !== 'resolved' && (
    urgency === 'critical' || urgency === 'high' ||
    (cbEntry && !cbEntry.done)
  );

  // Display name: prefer contact name, fall back to phone, then caseId
  const displayName = op.contact?.name || op.contact?.phone || caseId;

  return {...op, urgency, category, intent, sla, caseId, hrs, assignedTo, displayStatus, dueSoon, displayName};
}

// ════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════
function esc(v){ return String(v||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function fmtDate(iso){ return iso ? new Date(iso).toLocaleString('en-SG',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}) : '—'; }
function fmtShort(iso){ if(!iso)return'—'; const d=new Date(iso); return d.toLocaleTimeString('en-SG',{hour:'2-digit',minute:'2-digit'})+' · '+d.toLocaleDateString('en-SG',{month:'short',day:'numeric'}); }
function today(){ return new Date().toLocaleDateString('en-SG',{weekday:'long',year:'numeric',month:'long',day:'numeric'}); }
function timeAgo(iso){ if(!iso)return'—'; const h=(Date.now()-new Date(iso).getTime())/3600000; if(h<1)return Math.round(h*60)+'m ago'; if(h<24)return Math.round(h)+'h ago'; return Math.round(h/24)+'d ago'; }

function getHandovers(){ return JSON.parse(localStorage.getItem('dsg_handovers')||'[]'); }
function saveHandover(text){
  const staff = getCurrentStaff();
  const notes = getHandovers();
  notes.unshift({
    staff_id:      staff?.userId      || 'unknown',
    staff_name:    staff?.name        || 'Staff Member',
    staff_role:    staff?.staffRole   || '',
    note_content:  text,
    created_at:    new Date().toISOString(),
  });
  localStorage.setItem('dsg_handovers', JSON.stringify(notes.slice(0, 30)));
}
function getMessages(id){ return JSON.parse(localStorage.getItem('dsg_msg_'+id)||'[]'); }
function addMessage(id,msg){
  const msgs=getMessages(id); msgs.push(msg);
  localStorage.setItem('dsg_msg_'+id,JSON.stringify(msgs.slice(-60)));
}

// ════════════════════════════════════════════════════════════
// RENDER ENTRY
// ════════════════════════════════════════════════════════════
function render(){
  const app=document.getElementById('app');
  if(!isAuth()){ app.innerHTML=renderLogin(); document.getElementById('loginForm').addEventListener('submit',handleLogin); return; }
  app.innerHTML=renderShell(getView());
  // Re-open case detail if it was open before this re-render
  if(selectedCaseId) openCaseDetail(selectedCaseId);
}

function handleLogin(e){
  e.preventDefault();
  const key      = document.getElementById('accessKey').value;
  const staffRole= document.getElementById('staffRole').value;
  if(!staffRole){ document.getElementById('loginError').textContent='Please select your role.'; document.getElementById('loginError').classList.remove('hidden'); return; }
  if(doLogin(key, staffRole)){ fetchGHL(); startAutoRefresh(30000); render(); }
  else { document.getElementById('loginError').textContent='Incorrect access key.'; document.getElementById('loginError').classList.remove('hidden'); }
}

// ════════════════════════════════════════════════════════════
// LOGIN
// ════════════════════════════════════════════════════════════
function renderLogin(){
  const roleOptions = ROLES.map(r => `<option value="${esc(r)}">${esc(r)}</option>`).join('');
  return `
  <div class="dh-auth-bg">
    <div class="dh-auth-card">
      <div class="text-center mb-7">
        <div class="text-4xl mb-3">🏥</div>
        <h1 class="text-2xl font-black text-slate-900 mb-1">AI Command Center</h1>
        <p class="text-slate-500 text-sm font-medium">Staff access — DementiaHub</p>
      </div>
      <div id="loginError" class="hidden rounded-2xl px-4 py-3 text-sm font-semibold mb-4 bg-red-50 text-red-700 border border-red-200">Incorrect access key.</div>
      <form id="loginForm" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Role</label>
          <select id="staffRole" class="dh-select w-full" required>
            <option value="">— Select your role —</option>
            ${roleOptions}
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Access Key</label>
          <input id="accessKey" type="password" placeholder="Enter access key" class="dh-input font-mono tracking-widest" autocomplete="current-password" required>
        </div>
        <button type="submit" class="dh-btn dh-btn-primary w-full justify-center py-3 mt-2">Unlock Dashboard →</button>
      </form>
    </div>
  </div>`;
}

// ════════════════════════════════════════════════════════════
// SHELL
// ════════════════════════════════════════════════════════════
function renderShell(activeV){
  // Handover section only visible to Case Manager
  const canHandover = isCaseManager();

  // Redirect if non-Case Manager tries to access handover directly
  if(activeV === 'handover' && !canHandover){
    location.hash = 'overview';
    return renderShell('overview');
  }

  const nav = [
    {section:'Monitor'},
    {view:'overview', icon:'📊', label:'Overview'},
    {view:'cases',    icon:'📂', label:'Case Management'},
    ...(canHandover ? [{section:'Operations'},{view:'handover', icon:'🛡️', label:'Staff Handover'}] : []),
  ];
  const navHtml = nav.map(n => {
    if(n.section) return `<div class="dh-nav-section">${n.section}</div>`;
    return `<a class="dh-nav-link${activeV===n.view?' active':''}" href="#${n.view}"><span>${n.icon}</span><span>${n.label}</span></a>`;
  }).join('');

  const mobIcons = nav.filter(n=>n.view).map(n=>`<a href="#${n.view}" class="text-lg ${activeV===n.view?'text-white':'text-white/50'}">${n.icon}</a>`).join('');

  // Apply role-based visibility: Case Manager sees all, others see their assigned cases
  const allEnriched = (ghlOpps||[]).map(enrich);
  const enriched    = roleAccessControl(allEnriched);
  const critCount   = enriched.filter(o=>o.urgency==='critical').length;

  let content='';
  if(activeV==='overview') content=renderOverview(enriched);
  else if(activeV==='cases') content=renderCases(enriched);
  else if(activeV==='handover') content=renderHandover();

  return `
  <div class="dh-mob-bar">
    <img src="${CFG.logo}" class="h-8 brightness-0 invert" alt="Logo">
    <div class="flex gap-3">${mobIcons}<span onclick="doLogout()" class="text-red-400 text-lg cursor-pointer">↩</span></div>
  </div>

  <div class="dh-sidebar">
    <img src="${CFG.logo}" class="h-8 mb-8 brightness-0 invert" alt="Logo">
    ${(()=>{
      const staff = getCurrentStaff();
      const init  = staff ? staff.name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase() : 'S';
      const name  = staff ? esc(staff.name)      : 'Staff Member';
      const role  = staff ? esc(staff.staffRole) : 'Admin';
      return `<div class="flex items-center gap-3 mb-6 p-3 bg-white/10 rounded-2xl">
        <div class="w-9 h-9 rounded-full bg-[#006D77] flex items-center justify-center font-black text-white text-sm">${init}</div>
        <div class="flex-1 min-w-0">
          <p class="text-white font-bold text-sm leading-tight truncate">${name}</p>
          <p class="text-white/40 text-[10px] font-semibold uppercase tracking-wider">${role}</p>
        </div>
        ${critCount ? `<span class="bg-red-500 text-white text-[9px] font-black rounded-full w-5 h-5 flex items-center justify-center flash flex-shrink-0">${critCount}</span>` : ''}
      </div>`;
    })()}
    <nav class="flex-1 space-y-0.5">${navHtml}</nav>
    <div class="pt-5 border-t border-white/10 space-y-0.5">
      <a onclick="fetchGHL()" class="dh-nav-link text-white/40 hover:text-white"><span>🔄</span><span>Refresh Data</span></a>
      <a onclick="doLogout()" class="dh-nav-link" style="color:rgba(248,113,113,.7)"><span>↩</span><span>Logout</span></a>
    </div>
    <div class="pt-3 text-white/15 text-[9px] font-black uppercase tracking-widest text-center">AI Command Center v4.0</div>
  </div>

  <div class="dh-main">
    <div class="dh-content">${content}</div>
    <footer style="margin-left:0;padding:18px 32px;border-top:1px solid #f1f5f9;background:#fff;display:flex;align-items:center;justify-content:center;gap:24px;">
      <a href="https://dementiahub.wibiz.ai/home" style="color:#006D77;font-size:13px;font-weight:700;text-decoration:none;display:flex;align-items:center;gap:6px;">📚 Knowledge Base</a>
      <span style="color:#e2e8f0;">|</span>
      <span style="color:#94a3b8;font-size:12px;">DementiaHub AI Command Center</span>
    </footer>
  </div>

  <!-- Voice AI Widget Container (ElevenLabs goes here) -->
  <div id="voice-ai-widget" style="position:fixed;bottom:24px;right:28px;z-index:200;"></div>

  <!-- Global Note Modal -->
  <div id="noteModal" class="hidden fixed inset-0 bg-[#003D44]/60 backdrop-blur-md z-50 flex items-center justify-center p-6">
    <div class="bg-white w-full max-w-md rounded-[2rem] p-8 shadow-2xl">
      <h2 class="text-xl font-black text-slate-900 mb-1">📝 Add Case Note</h2>
      <p class="text-xs text-slate-400 font-bold uppercase tracking-widest mb-5">Syncing to: <span id="modalName" class="text-teal-600">Contact</span></p>
      <textarea id="noteText" class="dh-input resize-none h-32 mb-3" placeholder="Describe the care update…"></textarea>
      <div id="noteErr" class="hidden text-xs text-red-600 font-semibold mb-3"></div>
      <div class="flex gap-3">
        <button id="noteBtn" onclick="submitNote()" class="dh-btn dh-btn-primary flex-1 justify-center">Sync to GHL</button>
        <button onclick="closeNoteModal()" class="dh-btn dh-btn-ghost px-5">Cancel</button>
      </div>
    </div>
  </div>

  <!-- Modal Root for dynamic modals -->
  <div id="modal-root"></div>`;
}

// ════════════════════════════════════════════════════════════
// ① OVERVIEW — Analytics + Safety + SLA
// ════════════════════════════════════════════════════════════
function renderOverview(enriched){
  const loading  = ghlOpps===null;
  const total    = enriched.length;
  const critical = enriched.filter(o=>o.urgency==='critical').length;
  const today_ct = enriched.filter(o=>{ if(!o.createdAt)return false; return (Date.now()-new Date(o.createdAt).getTime())<86400000; }).length;
  const breached = enriched.filter(o=>o.sla==='breach').length;
  // Use displayStatus so local overrides (staff marking resolved) are counted
  const resolved = enriched.filter(o=>o.displayStatus==='resolved').length;

  // ── 🚨 Safety Banner ─────────────────────────────────────
  const safetyOps = enriched.filter(o=>o.urgency==='critical');
  const safetyBanner = safetyOps.length ? `
    <div class="safety-banner">
      <span class="text-2xl flash">🚨</span>
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-1">
          <p class="font-black text-red-800 text-sm">SAFETY ALERT — ${safetyOps.length} Critical Case${safetyOps.length>1?'s':''} Require Immediate Attention</p>
        </div>
        <div class="flex flex-wrap gap-2 mt-2">
          ${safetyOps.slice(0,4).map(o=>`
            <div class="flex items-center gap-2 bg-white border border-red-200 rounded-xl px-3 py-1.5">
              <span class="badge badge-critical flash">${esc(o.caseId)}</span>
              <span class="text-xs font-bold text-red-800">${esc((o.contact?.name||'Unknown').split(' ')[0])}</span>
              <span class="text-[10px] text-red-500">${timeAgo(o.updatedAt)}</span>
              <button onclick="openAIModal(${enriched.indexOf(o)})" class="dh-btn dh-btn-danger dh-btn-sm ml-1">AI Insight</button>
            </div>`).join('')}
          ${safetyOps.length>4?`<span class="text-xs text-red-600 font-bold self-center">+${safetyOps.length-4} more</span>`:''}
        </div>
      </div>
      <a href="#cases" onclick="setFilter('critical')" class="dh-btn dh-btn-danger flex-shrink-0">View All Critical →</a>
    </div>` : '';

  // ── 📈 Analytics Cards ────────────────────────────────────
  const active_ct  = enriched.filter(o=>o.displayStatus!=='resolved').length;
  const due_soon_ct = enriched.filter(o=>o.dueSoon&&o.displayStatus!=='resolved').length;
  const pending_cb  = Object.values(cbStatuses).filter(c=>!c.done).length + callbacks.length;
  const statsData = [
    {icon:'📅',label:'Calls Today',     val:loading?'…':today_ct,    bg:'bg-blue-50',   color:'#3b82f6'},
    {icon:'📂',label:'Active Cases',    val:loading?'…':active_ct,   bg:'bg-purple-50', color:'#8b5cf6'},
    {icon:'🚨',label:'High Priority',   val:loading?'…':critical,    bg:'bg-red-50',    color:'#ef4444'},
    {icon:'⏰',label:'Due Soon',        val:loading?'…':due_soon_ct, bg:'bg-orange-50', color:'#f97316'},
    {icon:'📞',label:'Pending Callbacks',val:loading?'…':pending_cb, bg:'bg-yellow-50', color:'#d97706'},
    {icon:'✅',label:'Resolved',         val:loading?'…':resolved,    bg:'bg-green-50',  color:'#10b981'},
  ];
  const statsHtml = statsData.map(s=>`
    <div class="dh-stat-card">
      <div class="dh-stat-icon ${s.bg}">${s.icon}</div>
      <div>
        <p class="text-2xl font-black" style="color:${s.color}">${s.val}</p>
        <p class="text-xs text-slate-500 font-semibold mt-0.5 leading-tight">${s.label}</p>
      </div>
    </div>`).join('');

  // ── 📊 SLA Widgets ────────────────────────────────────────
  const slaOk = enriched.filter(o=>o.sla==='ok').length;
  const slaWarn = enriched.filter(o=>o.sla==='warn').length;
  const slaBreach = enriched.filter(o=>o.sla==='breach').length;
  const slaHtml = `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="sla-card sla-ok">
        <div class="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-lg flex-shrink-0">✅</div>
        <div><p class="text-xl font-black text-green-700">${loading?'…':slaOk}</p><p class="text-xs font-bold text-green-600">On Track (≤2h)</p></div>
        <div class="ml-auto w-2 h-10 bg-green-200 rounded-full overflow-hidden flex flex-col justify-end"><div style="height:${total?Math.round(slaOk/total*100):0}%;background:#16a34a;" class="rounded-full transition-all"></div></div>
      </div>
      <div class="sla-card sla-warn">
        <div class="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center text-lg flex-shrink-0">⚠️</div>
        <div><p class="text-xl font-black text-yellow-700">${loading?'…':slaWarn}</p><p class="text-xs font-bold text-yellow-600">Due Soon (2–4h)</p></div>
        <div class="ml-auto w-2 h-10 bg-yellow-200 rounded-full overflow-hidden flex flex-col justify-end"><div style="height:${total?Math.round(slaWarn/total*100):0}%;background:#d97706;" class="rounded-full transition-all"></div></div>
      </div>
      <div class="sla-card sla-breach">
        <div class="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-lg flex-shrink-0 ${slaBreach?'flash':''}">🔴</div>
        <div><p class="text-xl font-black text-red-700">${loading?'…':slaBreach}</p><p class="text-xs font-bold text-red-600">SLA Breached (>4h)</p></div>
        <div class="ml-auto w-2 h-10 bg-red-200 rounded-full overflow-hidden flex flex-col justify-end"><div style="height:${total?Math.round(slaBreach/total*100):0}%;background:#dc2626;" class="rounded-full transition-all"></div></div>
      </div>
    </div>`;

  // ── Pipeline Preview — respects Quick View filter ─────────
  const _24h = 86400000;
  let pipelineRows = enriched;
  if      (activeFilter==='critical')   pipelineRows=enriched.filter(o=>o.urgency==='critical');
  else if (activeFilter==='untriaged')  pipelineRows=enriched.filter(o=>o.displayStatus==='new');
  else if (activeFilter==='needs_staff') pipelineRows=enriched.filter(o=>o.assignedTo==='Unassigned'&&o.displayStatus!=='resolved');
  else if (activeFilter==='sla_breach') pipelineRows=enriched.filter(o=>o.sla==='breach');
  else if (activeFilter==='resolved')   pipelineRows=enriched.filter(o=>o.displayStatus==='resolved');
  else if (activeFilter==='new')        pipelineRows=enriched.filter(o=>(Date.now()-new Date(o.createdAt||0).getTime())<_24h);

  const topRows = pipelineRows.slice(0,6).map((op,i)=>`
    <tr>
      <td><span class="badge ${op.urgency==='critical'?'badge-critical':op.urgency==='medium'?'badge-medium':'badge-low'}">${op.urgency}</span></td>
      <td><p class="font-bold text-slate-800 text-sm">${esc(op.contact?.name||'Visitor')}</p><p class="text-[10px] text-slate-400">${esc(op.caseId)}</p></td>
      <td class="truncate-cell text-xs text-slate-600">${esc(op.name||'—')}</td>
      <td><span class="badge badge-sla-${op.sla}">${op.sla==='ok'?'On Track':op.sla==='warn'?'Due Soon':'Breached'}</span></td>
      <td class="text-[10px] text-slate-500 whitespace-nowrap">${timeAgo(op.updatedAt)}</td>
      <td>
        <div class="flex gap-1.5">
          <button onclick="openAIModal(${i})" class="dh-btn dh-btn-ghost dh-btn-sm">🤖 AI</button>
          <button onclick="openModal(${i})" class="dh-btn dh-btn-ghost dh-btn-sm">📝</button>
        </div>
      </td>
    </tr>`).join('') || `<tr><td colspan="6" class="text-center py-10"><div class="text-4xl mb-2">📭</div><p class="text-slate-400 text-sm">No pipeline data.</p></td></tr>`;

  // ── Callbacks Panel ───────────────────────────────────────
  const cbList = callbacks.slice(0,4).map(cb=>`
    <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
      <span class="text-lg">📞</span>
      <div class="flex-1 min-w-0">
        <p class="font-bold text-slate-800 text-sm truncate">${esc(cb.name)}</p>
        <p class="text-[10px] text-slate-400">${esc(cb.time)} · ${esc(cb.staff||'Unassigned')}</p>
      </div>
      <button onclick="removeCallback('${cb.id}')" class="dh-btn dh-btn-ghost dh-btn-sm text-slate-400">✓ Done</button>
    </div>`).join('') || `<p class="text-center text-slate-400 text-sm py-4">No callbacks scheduled.</p>`;

  return `
    <div class="flex justify-between items-start mb-6 flex-wrap gap-3">
      <div>
        <h1 class="text-2xl font-black text-slate-900">AI Command Center</h1>
        <p class="text-slate-400 text-sm mt-0.5">${today()}</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
          <span class="w-2 h-2 bg-emerald-500 rounded-full dh-pulse"></span>
          <span class="text-emerald-700 font-bold text-xs">${loading?'Connecting…':'GHL Live'}</span>
        </div>
        <button onclick="fetchGHL()" class="dh-btn dh-btn-ghost dh-btn-sm">🔄 Refresh</button>
      </div>
    </div>

    ${safetyBanner}

    <!-- Analytics Cards -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">${statsHtml}</div>

    <!-- SLA Widgets -->
    ${slaHtml}

    <!-- Smart Filter Bar — filters overview pipeline inline, no redirect -->
    <div class="filter-bar">
      <span class="text-xs font-bold text-slate-400 self-center mr-1">Quick View:</span>
      <button class="flt-btn danger ${activeFilter==='critical'?'active':''}" onclick="setFilter('critical')">🚨 Safety Priority</button>
      <button class="flt-btn ${activeFilter==='untriaged'?'active':''}" onclick="setFilter('untriaged')">📋 Untriaged</button>
      <button class="flt-btn ${activeFilter==='needs_staff'?'active':''}" onclick="setFilter('needs_staff')">👤 Needs Staff</button>
      <button class="flt-btn ${activeFilter==='sla_breach'?'active':''}" onclick="setFilter('sla_breach')">⏰ SLA Breached</button>
      <button class="flt-btn ${activeFilter==='all'?'active':''}" onclick="setFilter('all')">🔄 Reset</button>
    </div>

    <!-- Pipeline + Callbacks -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div class="lg:col-span-2 dh-card">
        <div class="flex justify-between items-center mb-4">
          <div><p class="section-title">Live Pipeline</p><p class="section-sub">Top 6 from GoHighLevel</p></div>
          <a href="#cases" class="dh-btn dh-btn-ghost dh-btn-sm">Full View →</a>
        </div>
        ${loading ? `<div class="py-8 text-center"><div class="spinner mx-auto mb-3"></div><p class="text-slate-400 text-sm">Loading GHL data…</p></div>` : `
        <div class="overflow-x-auto">
          <table class="dh-table">
            <thead><tr><th>Urgency</th><th>Caregiver</th><th>Case</th><th>SLA</th><th>Updated</th><th></th></tr></thead>
            <tbody>${topRows}</tbody>
          </table>
        </div>`}
      </div>
      <div class="space-y-4">
        <div class="dh-card">
          <div class="flex justify-between items-center mb-3">
            <p class="section-title">📞 Callbacks (ElevenLabs)</p>
            <span class="text-[10px] font-bold text-violet-600 bg-violet-50 px-2 py-1 rounded-lg">AI-sourced</span>
          </div>
          <div class="space-y-2">${cbList}</div>
        </div>
        <div class="dh-card" style="background:linear-gradient(135deg,#003D44,#006D77);border:none;">
          <p class="text-white/60 text-[10px] font-black uppercase tracking-wider mb-1">Status Breakdown</p>
          ${[['Open',enriched.filter(o=>o.displayStatus!=='resolved').length,'#60a5fa'],['Critical',critical,'#f87171'],['Resolved',resolved,'#34d399']].map(([l,v,c])=>{
            const pct=total?Math.round(v/total*100):0;
            return `<div class="mb-2"><div class="flex justify-between text-[10px] font-bold text-white/70 mb-1"><span>${l}</span><span>${v}</span></div>
              <div class="h-1.5 bg-white/20 rounded-full"><div style="width:${pct}%;background:${c};height:100%;border-radius:4px;"></div></div></div>`;
          }).join('')}
          <a href="#cases" class="mt-3 block text-center py-2 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-xl transition">Open Case Manager →</a>
        </div>
      </div>
    </div>`;
}

// ════════════════════════════════════════════════════════════
// ② CASE MANAGEMENT
// ════════════════════════════════════════════════════════════
function renderCases(enriched){
  const loading = ghlOpps===null;

  // Apply search + filter
  const _24h = 24 * 3600000; // milliseconds in 24 hours
  let filtered = enriched;
  if      (activeFilter==='new')        filtered=enriched.filter(o=>(Date.now()-new Date(o.createdAt||0).getTime())<_24h);
  else if (activeFilter==='triaged')    filtered=enriched.filter(o=>o.displayStatus==='triaged');
  else if (activeFilter==='due_soon')   filtered=enriched.filter(o=>o.dueSoon && o.displayStatus!=='resolved');
  else if (activeFilter==='resolved')   filtered=enriched.filter(o=>o.displayStatus==='resolved');
  else if (activeFilter==='critical')   filtered=enriched.filter(o=>o.urgency==='critical');
  else if (activeFilter==='untriaged')  filtered=enriched.filter(o=>o.displayStatus==='new');
  else if (activeFilter==='needs_staff') filtered=enriched.filter(o=>o.assignedTo==='Unassigned'&&o.displayStatus!=='resolved');
  else if (activeFilter==='sla_breach') filtered=enriched.filter(o=>o.sla==='breach');

  if(searchQuery){
    const q=searchQuery.toLowerCase();
    filtered=filtered.filter(o=>(o.contact?.name||'').toLowerCase().includes(q)||(o.name||'').toLowerCase().includes(q)||(o.caseId||'').toLowerCase().includes(q));
  }

  // Sort
  filtered=[...filtered].sort((a,b)=>{
    let av,bv;
    if(sortCol==='urgency'){ const u={critical:0,medium:1,low:2}; av=u[a.urgency]||2;bv=u[b.urgency]||2; }
    else if(sortCol==='name'){ av=(a.contact?.name||'').toLowerCase();bv=(b.contact?.name||'').toLowerCase(); }
    else if(sortCol==='sla'){ const s={breach:0,warn:1,ok:2}; av=s[a.sla]||2;bv=s[b.sla]||2; }
    else{ av=new Date(a.updatedAt||0);bv=new Date(b.updatedAt||0); }
    if(av<bv)return sortDir==='asc'?-1:1;
    if(av>bv)return sortDir==='asc'?1:-1;
    return 0;
  });

  const sortIcon=(col)=>sortCol===col?(sortDir==='asc'?'↑':'↓'):'↕';

  let rows='';
  if(loading){
    rows=`<tr><td colspan="8" class="text-center py-12"><div class="spinner mx-auto mb-3"></div><p class="text-slate-400 text-sm">Loading cases from GHL…</p></td></tr>`;
  } else if(!filtered.length){
    rows=`<tr><td colspan="8"><div class="text-center py-12"><div class="text-4xl mb-3">📭</div><p class="text-slate-400 font-semibold text-sm">No cases match this filter.</p><button class="dh-btn dh-btn-ghost dh-btn-sm mt-3" onclick="setFilter('all');searchQuery='';render()">Clear Filters</button></div></td></tr>`;
  } else {
    rows=filtered.map((op,i)=>{
      const origIdx=(ghlOpps||[]).findIndex(o=>o.id===op.id);
      const urgBadge=`<span class="badge badge-${op.urgency==='high'?'high':op.urgency}">${op.urgency==='critical'?'🔴 ':op.urgency==='high'?'🟠 ':op.urgency==='medium'?'🟡 ':'🟢 '}${op.urgency}</span>`;
      const cbDone  = cbStatuses[op.id]?.done;
      const cbBadge = op.cbRequired===false ? '<span class="badge badge-no">No</span>'
        : cbDone ? `<span class="badge badge-completed">✓ Done</span>`
        : '<span class="badge badge-pending">Pending</span>';
      const consentBadge = op.consent===false ? '<span class="badge badge-no">No</span>' : '<span class="badge badge-yes">Yes</span>';
      const _storedStatus = caseStatuses[op.id] || '';
      const statusLabel = _storedStatus && CASE_STATUSES.includes(_storedStatus)
        ? _storedStatus.replace(' - ',' ').replace(' / ',' / ').replace(' \u2013 ',' – ')
        : (op.displayStatus==='resolved'?'Closed - Resolved':op.displayStatus==='triaged'?'In Progress':'New - Untriaged');
      const statusClass = op.displayStatus==='resolved'?'badge-resolved'
        :op.displayStatus==='critical'?'badge-urgent'
        :op.displayStatus==='triaged'?'badge-inprogress':'badge-new';
      const callDate = op.createdAt ? fmtDate(op.createdAt) : '—';
      return `
        <tr id="row-${op.id}" style="${op.urgency==='critical'?'background:#fff8f8;cursor:pointer;':'cursor:pointer;'}transition:opacity .25s;" onclick="openCaseDetail('${op.id}')">
          <td>
            <p class="font-bold text-slate-800 text-sm leading-tight">${esc(op.displayName)}</p>
            <p class="text-[10px] text-slate-400">${op.contact?.name && op.contact?.phone ? esc(op.contact.phone) : ''}</p>
            <p class="font-mono text-[9px] text-slate-300 mt-0.5">${esc(op.caseId)}</p>
          </td>
          <td class="text-[10px] text-slate-500 whitespace-nowrap">${callDate}</td>
          <td>${urgBadge}</td>
          <td><span class="badge ${statusClass}">${esc(statusLabel)}</span></td>
          <td>${cbBadge}</td>
          <td>${consentBadge}</td>
          <td onclick="event.stopPropagation()">
            <select class="dh-select text-[11px]" style="padding:4px 8px;" onchange="assignStaff('${op.id}',this.value)">
              ${STAFF_LIST.map(s=>`<option ${op.assignedTo===s?'selected':''}>${esc(s)}</option>`).join('')}
            </select>
          </td>
          <td onclick="event.stopPropagation()">
            <div class="flex gap-1.5 flex-wrap justify-end">
              <button onclick="openCaseDetail('${op.id}')" class="dh-btn dh-btn-primary dh-btn-sm">View →</button>
              <button onclick="openEscalateModal(${origIdx})" class="dh-btn dh-btn-warn dh-btn-sm" title="Escalate">🚨</button>
            </div>
          </td>
        </tr>`;
    }).join('');
  }

  return `
    <div class="flex justify-between items-start mb-5 flex-wrap gap-3">
      <div>
        <h1 class="text-2xl font-black text-slate-900">📂 Case Management</h1>
        <p class="text-slate-400 text-sm mt-0.5">${loading?'Loading…':filtered.length+' cases shown of '+enriched.length+' total'}</p>
      </div>
      <div class="flex gap-2 flex-wrap">
        <div class="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2">
          <span class="text-slate-400 text-sm">🔍</span>
          <input type="text" placeholder="Search cases…" value="${esc(searchQuery)}" oninput="searchQuery=this.value;render()" class="outline-none text-sm bg-transparent w-40 placeholder:text-slate-400">
        </div>
        <button onclick="setFilter('all');searchQuery='';render()" class="dh-btn dh-btn-ghost">↺ Reset Filters</button>
        <button onclick="fetchGHL()" class="dh-btn dh-btn-ghost">🔄 Refresh</button>
      </div>
    </div>

    <!-- Status Filter Bar -->
    <div class="filter-bar">
      <button class="flt-btn ${activeFilter==='all'?'active':''}" onclick="setFilter('all')">All (${enriched.length})</button>
      <button class="flt-btn ${activeFilter==='new'?'active':''}" onclick="setFilter('new')">🆕 New 24h (${enriched.filter(o=>(Date.now()-new Date(o.createdAt||0).getTime())<86400000).length})</button>
      <button class="flt-btn ${activeFilter==='triaged'?'active':''}" onclick="setFilter('triaged')">📋 Triaged (${enriched.filter(o=>o.displayStatus==='triaged').length})</button>
      <button class="flt-btn ${activeFilter==='due_soon'?'active':''}" onclick="setFilter('due_soon')">⏰ Due Soon (${enriched.filter(o=>o.dueSoon&&o.displayStatus!=='resolved').length})</button>
      <button class="flt-btn ${activeFilter==='resolved'?'active':''}" onclick="setFilter('resolved')">✅ Resolved (${enriched.filter(o=>o.displayStatus==='resolved').length})</button>
      <button class="flt-btn danger ${activeFilter==='critical'?'active':''}" onclick="setFilter('critical')">🚨 Critical (${enriched.filter(o=>o.urgency==='critical').length})</button>
    </div>

    <div class="dh-card overflow-x-auto">
      <table class="dh-table" style="min-width:820px;">
        <thead><tr>
          <th onclick="toggleSort('name')" class="cursor-pointer">Caller ${sortIcon('name')}</th>
          <th onclick="toggleSort('updated')" class="cursor-pointer">Call Date ${sortIcon('updated')}</th>
          <th onclick="toggleSort('urgency')" class="cursor-pointer">Urgency ${sortIcon('urgency')}</th>
          <th>Status</th>
          <th>Callback</th>
          <th>Consent</th>
          <th>Assigned Staff</th>
          <th class="text-right">Actions</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

// ════════════════════════════════════════════════════════════
// ③ OMNICHANNEL CHAT
// ════════════════════════════════════════════════════════════
function renderChat(enriched){
  const loading = ghlOpps===null;
  const op = enriched[activeChatIdx] || null;
  const chatId = op?.id || 'demo';
  const msgs = getMessages(chatId);

  const contactList = enriched.length
    ? enriched.slice(0,12).map((o,i)=>`
        <div onclick="activeChatIdx=${i};render()" class="flex items-center gap-3 p-3 rounded-xl cursor-pointer ${activeChatIdx===i?'bg-teal-50 border border-teal-200':'hover:bg-slate-50 border border-transparent'}">
          <div class="w-9 h-9 rounded-full bg-gradient-to-br from-[#006D77] to-[#003D44] flex items-center justify-center text-white font-black text-sm flex-shrink-0">${(o.contact?.name||'?')[0].toUpperCase()}</div>
          <div class="flex-1 min-w-0">
            <p class="font-bold text-slate-800 text-sm truncate">${esc(o.contact?.name||'Unknown')}</p>
            <p class="text-[10px] text-slate-400 truncate">${esc(o.name||'—')}</p>
          </div>
          <span class="badge badge-${o.urgency} flex-shrink-0 text-[9px]">${o.urgency}</span>
        </div>`).join('')
    : `<p class="text-center text-slate-400 text-sm py-6">No contacts loaded.</p>`;

  const msgHtml = msgs.length
    ? msgs.map(m=>`
        <div class="flex flex-col ${m.role==='staff'?'items-end':'items-start'} mb-3">
          <p class="msg-label ${m.role==='staff'?'text-right':''}">${m.role==='ai'?'🤖 AI':m.role==='staff'?'👤 Staff':'👥 Caregiver'}</p>
          <div class="msg-bubble msg-${m.role}">${esc(m.text)}</div>
          <p class="text-[9px] text-slate-300 mt-1">${fmtShort(m.ts)}</p>
        </div>`).join('')
    : `<div class="flex flex-col items-center justify-center h-full opacity-40"><div class="text-5xl mb-3">💬</div><p class="text-slate-500 font-semibold text-sm">No messages yet. Start the conversation.</p></div>`;

  // AI suggested reply
  const aiSuggestion = op ? `I understand you're concerned about ${(op.contact?.name||'your loved one').split(' ')[0]}. I can connect you with our ${op.category==='Medical'?'medical team':'care coordinator'} right away. Can you tell me more about the current situation?` : '';

  return `
    <div class="mb-5">
      <h1 class="text-2xl font-black text-slate-900">💬 Omnichannel Chat</h1>
      <p class="text-slate-400 text-sm mt-0.5">Manage conversations across all channels</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-5" style="height:calc(100vh - 200px);min-height:500px;">
      <!-- Contact List -->
      <div class="dh-card overflow-y-auto" style="padding:16px;">
        <div class="mb-3"><input type="text" placeholder="Search contacts…" class="dh-input" style="font-size:12px;padding:8px 12px;"></div>
        ${loading ? '<div class="text-center py-8"><div class="spinner mx-auto"></div></div>' : contactList}
      </div>

      <!-- Chat Window -->
      <div class="lg:col-span-2 dh-card flex flex-col" style="padding:0;overflow:hidden;">
        <!-- Header -->
        <div class="flex items-center gap-3 p-4 border-b border-slate-100">
          ${op ? `
            <div class="w-9 h-9 rounded-full bg-gradient-to-br from-[#006D77] to-[#003D44] flex items-center justify-center text-white font-black text-sm">${(op.contact?.name||'?')[0].toUpperCase()}</div>
            <div>
              <p class="font-bold text-slate-800 text-sm">${esc(op.contact?.name||'Contact')}</p>
              <p class="text-[10px] text-slate-400">${esc(op.caseId)} · ${esc(op.category)}</p>
            </div>
            <div class="ml-auto flex gap-2">
              <span class="badge badge-${op.urgency}">${op.urgency}</span>
              ${op.contact?.phone?`<a href="tel:${esc(op.contact.phone)}" class="dh-btn dh-btn-ghost dh-btn-sm">📞</a>`:''}
            </div>` : `<p class="text-slate-400 text-sm">Select a contact</p>`}
        </div>
        <!-- Messages -->
        <div id="chatMsgs" class="flex-1 overflow-y-auto p-4 flex flex-col" style="min-height:0;">
          ${msgHtml}
        </div>
        <!-- Input -->
        <div class="p-4 border-t border-slate-100">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Reply as:</span>
            <button id="replyModeBtn" onclick="toggleReplyMode()" class="dh-btn dh-btn-ghost dh-btn-sm" id="replyMode">🤖 AI Reply</button>
          </div>
          <div class="flex gap-2">
            <textarea id="chatInput" rows="2" class="dh-input resize-none flex-1 text-sm" placeholder="${op?'Type a message to '+esc((op.contact?.name||'contact').split(' ')[0])+'…':'Select a contact first'}"></textarea>
            <button onclick="sendChatMsg()" class="dh-btn dh-btn-primary px-4 self-end">Send →</button>
          </div>
          ${aiSuggestion && op ? `
            <div class="mt-2 p-2.5 bg-green-50 border border-green-200 rounded-xl">
              <p class="text-[10px] font-bold text-green-700 mb-1">🤖 AI Suggestion:</p>
              <p class="text-xs text-green-800">${esc(aiSuggestion)}</p>
              <button onclick="useAISuggestion()" class="dh-btn dh-btn-ghost dh-btn-sm mt-2" style="color:#16a34a;border-color:#bbf7d0;">Use This Reply</button>
            </div>` : ''}
        </div>
      </div>

      <!-- AI Panel (Voice + Insights) -->
      <div class="dh-card overflow-y-auto flex flex-col gap-4" style="padding:16px;">

        <!-- ElevenLabs Voice Widget — context-aware for current staff + case -->
        ${(()=>{
          const staffCtx = DHUserContext.getStaffContext();
          const baseVars = staffCtx ? DHUserContext.buildElevenLabsVars(staffCtx) : {};
          const caseVars = op ? {
            case_id:      op.caseId      || '',
            contact_name: (op.contact?.name || '').split(' ')[0],
            urgency:      op.urgency      || '',
            category:     op.category     || '',
            intent:       op.intent       || '',
          } : {};
          const elVars = JSON.stringify({ ...baseVars, ...caseVars });
          const brief  = op
            ? `Briefed on case <strong>${esc(op.caseId)}</strong> — ${esc(op.contact?.name||'Unknown')}`
            : 'Ask anything about case management';
          return `
            <div class="p-3 bg-violet-50 border border-violet-100 rounded-2xl">
              <p class="text-[10px] font-black text-violet-700 uppercase tracking-widest mb-1">🎙️ Voice AI — Staff</p>
              <p class="text-xs text-violet-500 mb-3">${brief}</p>
              <elevenlabs-convai
                id="dh-el-widget-staff"
                agent-id="${esc(CFG.elevenLabsAgentId)}"
                dynamic-variables='${elVars}'
                style="width:100%;">
              </elevenlabs-convai>
            </div>`;
        })()}

        <!-- Case AI Insights -->
        ${op ? renderAIPanelInline(op, (ghlOpps||[]).findIndex(o=>o.id===op.id)) : '<div class="text-center py-4 text-slate-400"><div class="text-3xl mb-2">🤖</div><p class="text-sm font-semibold">Select a case for AI insights.</p></div>'}
      </div>
    </div>`;
}

// ════════════════════════════════════════════════════════════
// ④ HANDOVER (enhanced)
// ════════════════════════════════════════════════════════════
function renderHandover(){
  return `
    <div class="mb-5">
      <h1 class="text-2xl font-black text-slate-900">🛡️ Staff Handover</h1>
      <p class="text-slate-400 text-sm mt-0.5">Shift transitions, assignments, and internal notes</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div class="space-y-5">
        <!-- Staff Assignment -->
        <div class="dh-card">
          <p class="section-title mb-1">👥 Staff Assignment</p>
          <p class="section-sub mb-4">Reassign cases to staff members</p>
          <div class="space-y-3">
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Case ID</label>
              <input id="assignCaseId" class="dh-input" placeholder="Enter Case ID (e.g. C-ABC123)" style="font-family:monospace;">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Assign To</label>
              <select id="assignStaffSel" class="dh-select w-full">
                ${STAFF_LIST.map(s=>`<option>${esc(s)}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Internal Note</label>
              <textarea id="assignNote" rows="3" class="dh-input resize-none" placeholder="Reason for assignment or context…"></textarea>
            </div>
            <button onclick="saveAssignment()" class="dh-btn dh-btn-primary w-full justify-center">Save Assignment</button>
          </div>
        </div>

        <!-- Post Handover Note -->
        <div class="dh-card">
          <p class="section-title mb-1">📋 Post Handover Note</p>
          <p class="section-sub mb-4">Record shift transitions for the care team</p>
          <div class="space-y-3">
            <textarea id="handoverNote" rows="5" placeholder="Describe care updates, urgent flags, or shift context…" class="dh-input resize-none"></textarea>
            <button onclick="submitHandover()" class="dh-btn dh-btn-primary w-full justify-center">Publish to Shift Feed</button>
          </div>
        </div>
      </div>

      <!-- Handover Feed -->
      <div class="dh-card">
        <p class="section-title mb-1">📜 Handover Feed</p>
        <p class="section-sub mb-4">Recent shift notes from the team</p>
        <div id="handoverList" class="space-y-3 max-h-[600px] overflow-y-auto pr-1">
          ${renderHandoverList()}
        </div>
      </div>
    </div>`;
}

function renderHandoverList(){
  const notes=getHandovers();
  if(!notes.length) return `<div class="text-center py-8 text-slate-400"><div class="text-4xl mb-2">📝</div><p class="text-sm font-semibold">No handover notes yet.</p></div>`;
  return notes.map(h=>`
    <div class="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
      <div class="flex justify-between items-center mb-1.5">
        <div>
          <p class="text-[10px] font-black text-teal-700 uppercase tracking-wider">${esc(h.staff_name)}</p>
          ${h.staff_role ? `<p class="text-[9px] text-slate-400 font-bold uppercase tracking-wide">${esc(h.staff_role)}</p>` : ''}
        </div>
        <p class="text-[10px] text-slate-400 font-bold">${fmtShort(h.created_at)}</p>
      </div>
      <p class="text-sm text-slate-600 leading-relaxed font-medium italic">"${esc(h.note_content)}"</p>
    </div>`).join('');
}

// ════════════════════════════════════════════════════════════
// 🤖 AI INSIGHTS (inline panel)
// ════════════════════════════════════════════════════════════
function renderAIPanelInline(op, origIdx){
  const enriched = enrich(op, origIdx);
  const confidence = 72 + Math.floor((op.id||'').charCodeAt(0)%22);
  const safetyFlag = enriched.urgency==='critical';
  const kbArticle = {Safety:'Home Safety & Fall Prevention',Medical:'Medication Management for Dementia',Emotional:'Managing Behavioural Changes',Admin:'CARA Registration Guide',Resource:'SG Dementia Resources Directory'}[enriched.category]||'Understanding Dementia';
  const recAction = {critical:'Escalate immediately — assign senior staff and notify family.',medium:'Schedule follow-up call within 2 hours. Monitor for changes.',low:'Standard response — review at next shift check-in.'}[enriched.urgency];
  return `
    <p class="section-title mb-3">🤖 AI Case Summary</p>
    <div class="space-y-2.5">
      <div class="p-2.5 bg-slate-50 rounded-xl"><p class="text-[10px] font-black text-slate-400 uppercase mb-0.5">WHO</p><p class="text-sm font-bold text-slate-800">${esc(op.contact?.name||'Unknown')}</p></div>
      <div class="p-2.5 bg-slate-50 rounded-xl"><p class="text-[10px] font-black text-slate-400 uppercase mb-0.5">WHAT</p><p class="text-sm font-bold text-slate-800">${esc(op.name||'—')}</p></div>
      <div class="p-2.5 rounded-xl ${enriched.urgency==='critical'?'bg-red-50':'bg-slate-50'}"><p class="text-[10px] font-black text-slate-400 uppercase mb-0.5">URGENCY</p><span class="badge badge-${enriched.urgency}">${enriched.urgency.toUpperCase()}</span></div>
      <div class="p-2.5 rounded-xl ${safetyFlag?'bg-red-50':'bg-green-50'}"><p class="text-[10px] font-black text-slate-400 uppercase mb-0.5">SAFETY</p><p class="text-xs font-bold ${safetyFlag?'text-red-700':'text-green-700'}">${safetyFlag?'⚠️ Safety concern detected':'✅ No immediate concern'}</p></div>
      <div class="p-2.5 bg-blue-50 rounded-xl"><p class="text-[10px] font-black text-slate-400 uppercase mb-0.5">ACTION</p><p class="text-xs font-bold text-blue-800">${recAction}</p></div>
    </div>
    <div class="divider"></div>
    <p class="text-[10px] font-black text-slate-400 uppercase mb-1">KB Article</p>
    <p class="text-xs font-bold text-teal-700 mb-3">📚 ${esc(kbArticle)}</p>
    <p class="text-[10px] font-black text-slate-400 uppercase mb-1">Confidence</p>
    <div class="flex items-center gap-2 mb-3">
      <div class="flex-1 h-2 bg-slate-100 rounded-full"><div style="width:${confidence}%;background:#006D77;" class="h-full rounded-full"></div></div>
      <span class="text-xs font-black text-[#006D77]">${confidence}%</span>
    </div>
    <button onclick="openModal(${origIdx})" class="dh-btn dh-btn-primary w-full justify-center dh-btn-sm">📝 Use AI Suggestion</button>`;
}

// ════════════════════════════════════════════════════════════
// MODALS
// ════════════════════════════════════════════════════════════
let activeOppIdx = null;

function openModal(idx){
  activeOppIdx=idx;
  const op=ghlOpps?.[idx];
  document.getElementById('modalName').innerText=op?.contact?.name||'Contact';
  document.getElementById('noteErr').classList.add('hidden');
  document.getElementById('noteText').value='';
  document.getElementById('noteModal').classList.remove('hidden');
}
function closeNoteModal(){ document.getElementById('noteModal').classList.add('hidden'); }

async function submitNote(){
  const text=document.getElementById('noteText').value.trim();
  const btn=document.getElementById('noteBtn');
  const err=document.getElementById('noteErr');
  if(!text){ err.innerText='Please type a note.'; err.classList.remove('hidden'); return; }
  const op=ghlOpps?.[activeOppIdx];
  const cid=op?.contact?.id;
  if(!cid){ err.innerText='No contact ID for this case.'; err.classList.remove('hidden'); return; }
  btn.innerHTML='<span class="spinner"></span> Syncing…'; btn.disabled=true; err.classList.add('hidden');
  try{ await syncNoteToGHL(cid,text); closeNoteModal(); alert('Note synced to GHL!'); }
  catch(e){ err.innerText='Failed: '+e.message; err.classList.remove('hidden'); }
  finally{ btn.innerHTML='Sync to GHL'; btn.disabled=false; }
}

function openAIModal(idx){
  const op = ghlOpps?.[idx]; if(!op) return;
  const enriched = enrich(op,idx);
  const confidence = 72+Math.floor((op.id||'').charCodeAt(0)%22);
  const safetyFlag = enriched.urgency==='critical';
  const recAction = {critical:'Escalate immediately — assign senior staff and notify family.',medium:'Schedule follow-up call within 2 hours.',low:'Standard response — review at next shift check-in.'}[enriched.urgency];
  const suggestedReply = `Hello ${(op.contact?.name||'').split(' ')[0]||'there'}, thank you for reaching out to DementiaHub. I can see your case has been flagged as ${enriched.urgency} priority. ${safetyFlag?'A senior care coordinator has been alerted and will contact you within 30 minutes.':'One of our care specialists will be in touch with you shortly.'}`;

  document.getElementById('modal-root').innerHTML=`
    <div class="modal-overlay" onclick="if(event.target===this)closeAIModal()">
      <div class="modal-box" style="max-width:560px;">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#006D77] to-[#003D44] flex items-center justify-center text-xl">🤖</div>
          <div><h2 class="text-lg font-black text-slate-900">AI Case Insight</h2><p class="text-xs text-slate-400">${esc(enriched.caseId)} · Confidence: ${confidence}%</p></div>
          <button onclick="closeAIModal()" class="ml-auto dh-btn dh-btn-ghost dh-btn-sm">✕ Close</button>
        </div>
        <div class="grid grid-cols-2 gap-3 mb-4">
          <div class="p-3 bg-slate-50 rounded-xl"><p class="text-[10px] font-black text-slate-400 uppercase mb-1">WHO</p><p class="text-sm font-bold text-slate-800">${esc(op.contact?.name||'Unknown')}</p></div>
          <div class="p-3 bg-slate-50 rounded-xl"><p class="text-[10px] font-black text-slate-400 uppercase mb-1">WHAT</p><p class="text-sm font-bold text-slate-800 truncate">${esc(op.name||'—')}</p></div>
          <div class="p-3 rounded-xl ${enriched.urgency==='critical'?'bg-red-50':'bg-slate-50'}"><p class="text-[10px] font-black text-slate-400 uppercase mb-1">URGENCY</p><span class="badge badge-${enriched.urgency}">${enriched.urgency.toUpperCase()}</span></div>
          <div class="p-3 rounded-xl ${safetyFlag?'bg-red-50':'bg-green-50'}"><p class="text-[10px] font-black text-slate-400 uppercase mb-1">SAFETY</p><p class="text-xs font-bold ${safetyFlag?'text-red-700':'text-green-700'}">${safetyFlag?'⚠️ Concern detected':'✅ Clear'}</p></div>
        </div>
        <div class="p-3 bg-blue-50 rounded-xl mb-4">
          <p class="text-[10px] font-black text-blue-400 uppercase mb-1">Recommended Action</p>
          <p class="text-sm font-bold text-blue-800">${recAction}</p>
        </div>
        <div class="mb-4">
          <p class="text-[10px] font-black text-slate-400 uppercase mb-2">Suggested Response (editable)</p>
          <textarea id="aiReplyText" class="dh-input resize-none h-24 text-sm">${esc(suggestedReply)}</textarea>
        </div>
        <div class="flex gap-3">
          <button onclick="useAISuggestionFromModal(${idx})" class="dh-btn dh-btn-primary flex-1 justify-center">✓ Use AI Suggestion</button>
          <button onclick="openEscalateModal(${idx})" class="dh-btn dh-btn-warn flex-shrink-0">🚨 Escalate</button>
          <button onclick="closeAIModal()" class="dh-btn dh-btn-ghost flex-shrink-0">Cancel</button>
        </div>
      </div>
    </div>`;
}
function closeAIModal(){ document.getElementById('modal-root').innerHTML=''; }

function openEscalateModal(idx){
  const op=ghlOpps?.[idx]; if(!op) return;
  document.getElementById('modal-root').innerHTML=`
    <div class="modal-overlay" onclick="if(event.target===this)document.getElementById('modal-root').innerHTML=''">
      <div class="modal-box" style="max-width:440px;">
        <h2 class="text-lg font-black text-red-700 mb-1">🚨 Escalate Case</h2>
        <p class="text-sm text-slate-500 mb-5">${esc(op.contact?.name||'Contact')} · ${esc(enrich(op,idx).caseId)}</p>
        <div class="space-y-3">
          <div>
            <label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Escalation Type</label>
            <select id="escType" class="dh-select w-full">
              <option>Missing Person</option>
              <option>Self-Harm Risk</option>
              <option>Medical Emergency</option>
              <option>Caregiver Distress</option>
              <option>Violence / Safety</option>
              <option>Other Critical</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Assign To</label>
            <select id="escStaff" class="dh-select w-full">${STAFF_LIST.filter(s=>s!=='Unassigned').map(s=>`<option>${esc(s)}</option>`).join('')}</select>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Notes</label>
            <textarea id="escNote" rows="3" class="dh-input resize-none" placeholder="Describe the situation…"></textarea>
          </div>
        </div>
        <div class="flex gap-3 mt-5">
          <button onclick="submitEscalation(${idx})" class="dh-btn dh-btn-danger flex-1 justify-center font-black">🚨 Confirm Escalation</button>
          <button onclick="document.getElementById('modal-root').innerHTML=''" class="dh-btn dh-btn-ghost">Cancel</button>
        </div>
      </div>
    </div>`;
}

function openCallbackForm(){
  document.getElementById('modal-root').innerHTML=`
    <div class="modal-overlay" onclick="if(event.target===this)document.getElementById('modal-root').innerHTML=''">
      <div class="modal-box" style="max-width:420px;">
        <h2 class="text-lg font-black text-slate-900 mb-5">📞 Schedule Callback</h2>
        <div class="space-y-3">
          <div><label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Contact Name</label><input id="cbName" class="dh-input" placeholder="Caregiver name"></div>
          <div class="grid grid-cols-2 gap-3">
            <div><label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Date</label><input id="cbDate" class="dh-input" type="date" min="${new Date().toISOString().split('T')[0]}"></div>
            <div><label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Time</label><input id="cbTime" class="dh-input" type="time" value="10:00"></div>
          </div>
          <div><label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Assign To</label><select id="cbStaff" class="dh-select w-full">${STAFF_LIST.map(s=>`<option>${esc(s)}</option>`).join('')}</select></div>
        </div>
        <div class="flex gap-3 mt-5">
          <button onclick="saveCallback()" class="dh-btn dh-btn-primary flex-1 justify-center">Schedule →</button>
          <button onclick="document.getElementById('modal-root').innerHTML=''" class="dh-btn dh-btn-ghost">Cancel</button>
        </div>
      </div>
    </div>`;
}

// ════════════════════════════════════════════════════════════
// ACTIONS
// ════════════════════════════════════════════════════════════
function setFilter(f){ activeFilter=f; render(); }
function toggleSort(col){ if(sortCol===col) sortDir=sortDir==='asc'?'desc':'asc'; else{sortCol=col;sortDir='asc';} render(); }

function assignStaff(oppId, staffName){
  assignments[oppId]=staffName;
  localStorage.setItem('dsg_assignments',JSON.stringify(assignments));
}

function saveAssignment(){
  const cid=document.getElementById('assignCaseId').value.trim();
  const staff=document.getElementById('assignStaffSel').value;
  const note=document.getElementById('assignNote').value.trim();
  if(!cid){ alert('Please enter a Case ID.'); return; }
  const op=(ghlOpps||[]).find(o=>enrich(o,0).caseId===cid.toUpperCase());
  if(op){ assignments[op.id]=staff; localStorage.setItem('dsg_assignments',JSON.stringify(assignments)); }
  if(note) saveHandover(`Assigned ${cid} to ${staff}. ${note}`);
  document.getElementById('assignCaseId').value='';
  document.getElementById('assignNote').value='';
  render();
}

function submitHandover(){
  const note=document.getElementById('handoverNote').value.trim();
  if(!note){ alert('Please write a note.'); return; }
  saveHandover(note);
  document.getElementById('handoverNote').value='';
  document.getElementById('handoverList').innerHTML=renderHandoverList();
}

function resolveCase(id){
  if(!confirm('Close this case?')) return;
  const row=document.getElementById('row-'+id);
  if(row){ row.style.transition='all .4s'; row.style.opacity='.15'; row.style.transform='translateX(20px)'; setTimeout(()=>row.remove(),400); }
}

function submitEscalation(idx){
  const op=ghlOpps?.[idx]; if(!op)return;
  const type=document.getElementById('escType').value;
  const staff=document.getElementById('escStaff').value;
  const note=document.getElementById('escNote').value.trim();
  assignments[op.id]=staff;
  localStorage.setItem('dsg_assignments',JSON.stringify(assignments));
  saveHandover(`🚨 ESCALATION — ${enrich(op,idx).caseId} · Type: ${type} · Assigned: ${staff}${note?' · '+note:''}`);
  document.getElementById('modal-root').innerHTML='';
  alert(`Case escalated to ${staff} as "${type}".`);
  render();
}

function saveCallback(){
  const name=document.getElementById('cbName').value.trim();
  const date=document.getElementById('cbDate').value;
  const time=document.getElementById('cbTime').value;
  const staff=document.getElementById('cbStaff').value;
  if(!name||!date||!time){ alert('Please fill all fields.'); return; }
  callbacks.unshift({id:Date.now().toString(),name,time:date+' '+time,staff,created:new Date().toISOString()});
  localStorage.setItem('dsg_callbacks',JSON.stringify(callbacks.slice(0,20)));
  document.getElementById('modal-root').innerHTML='';
  render();
}

function removeCallback(id){
  callbacks=callbacks.filter(c=>c.id!==id);
  localStorage.setItem('dsg_callbacks',JSON.stringify(callbacks));
  render();
}

let replyIsAI=true;
function toggleReplyMode(){
  replyIsAI=!replyIsAI;
  const btn=document.getElementById('replyModeBtn');
  if(btn) btn.innerHTML=replyIsAI?'🤖 AI Reply':'👤 Human Reply';
}

function sendChatMsg(){
  const input  = document.getElementById('chatInput');
  if(!input || !input.value.trim()) return;
  const op     = (ghlOpps||[])[activeChatIdx];
  const chatId = op?.id || 'demo';
  const staff  = getCurrentStaff();
  const msg    = {
    role:       replyIsAI ? 'ai' : 'staff',
    text:       input.value.trim(),
    ts:         new Date().toISOString(),
    sender_id:  staff?.userId   || 'unknown',
    sender_name:staff?.name     || 'Staff Member',
  };
  addMessage(chatId, msg);
  // Log to user conversation history keyed by staff userId
  if (staff) DHUserContext.storeConversationEvent(DHUserContext.getStaffContext(), {
    type:        'chat_message_sent',
    channel:     'omnichannel',
    case_id:     op?.id     || null,
    contact_name:op?.contact?.name || null,
    preview:     msg.text.slice(0, 80),
  });
  input.value = '';
  render();
  setTimeout(()=>{ const el=document.getElementById('chatMsgs'); if(el) el.scrollTop=el.scrollHeight; },50);
}

function useAISuggestion(){
  const op=(ghlOpps||[])[activeChatIdx];
  const suggestion=`Hello ${(op?.contact?.name||'').split(' ')[0]||'there'}, thank you for reaching out to DementiaHub. One of our care specialists will be in touch shortly.`;
  const input=document.getElementById('chatInput');
  if(input) input.value=suggestion;
}

function useAISuggestionFromModal(idx){
  const text=document.getElementById('aiReplyText')?.value;
  const op=ghlOpps?.[idx];
  if(op&&text){
    addMessage(op.id,{role:'ai',text,ts:new Date().toISOString()});
    closeAIModal();
    location.hash='chat';
    activeChatIdx=idx;
    render();
  }
}

// ════════════════════════════════════════════════════════════
// TRANSCRIPT RENDERER
// ════════════════════════════════════════════════════════════
function renderTranscript(transcriptData){
  if(!transcriptData || (typeof transcriptData==='string' && !transcriptData.trim())){
    return '<p class="text-slate-400 text-sm italic text-center py-6">No transcript available for this call.</p>';
  }

  // Try to parse as JSON array (ElevenLabs structured format)
  let parsed = null;
  if(typeof transcriptData==='string'){
    try{ parsed = JSON.parse(transcriptData); }catch(e){}
  } else if(Array.isArray(transcriptData)){
    parsed = transcriptData;
  }

  if(Array.isArray(parsed) && parsed.length){
    return parsed.map(entry => {
      const role = (entry.role || entry.speaker || '').toLowerCase();
      const text = entry.message || entry.text || entry.content || '';
      const isAgent = role.includes('agent') || role.includes('assistant') || role.includes('ai') || role.includes('bot');
      const label = isAgent ? 'Agent' : 'Caller';
      const bg    = isAgent ? 'bg-blue-50 border-blue-100' : 'bg-slate-50 border-slate-200';
      const lc    = isAgent ? 'text-blue-700' : 'text-slate-500';
      const ts    = entry.timestamp || entry.time_in_call_secs != null ? ` · ${typeof entry.time_in_call_secs==='number' ? Math.floor(entry.time_in_call_secs)+'s' : fmtShort(entry.timestamp)}` : '';
      return `<div class="p-3 rounded-xl border ${bg} mb-2">
        <p class="text-[10px] font-black uppercase tracking-wide ${lc} mb-1">[${label}]${ts}</p>
        <p class="text-sm text-slate-700 leading-relaxed">${esc(text)}</p>
      </div>`;
    }).join('');
  }

  // Plain text — detect [Agent]: / [Caller]: labels or just format as plain
  const lines = String(transcriptData).split('\n');
  const hasLabels = lines.some(l=>/^\[?(agent|caller|ai|user|human|caregiver)\]?[:：]/i.test(l.trim()));
  if(hasLabels){
    return lines.map(line => {
      if(!line.trim()) return '';
      const agentM  = line.match(/^\[?(agent|ai|bot|assistant)\]?[:：]\s*/i);
      const callerM = line.match(/^\[?(caller|user|human|caregiver)\]?[:：]\s*/i);
      if(agentM){
        return `<div class="p-3 rounded-xl border bg-blue-50 border-blue-100 mb-2">
          <p class="text-[10px] font-black uppercase tracking-wide text-blue-700 mb-1">[Agent]</p>
          <p class="text-sm text-slate-700 leading-relaxed">${esc(line.slice(agentM[0].length))}</p>
        </div>`;
      } else if(callerM){
        return `<div class="p-3 rounded-xl border bg-slate-50 border-slate-200 mb-2">
          <p class="text-[10px] font-black uppercase tracking-wide text-slate-500 mb-1">[Caller]</p>
          <p class="text-sm text-slate-700 leading-relaxed">${esc(line.slice(callerM[0].length))}</p>
        </div>`;
      }
      return `<p class="text-sm text-slate-600 leading-relaxed py-1 px-1">${esc(line)}</p>`;
    }).filter(Boolean).join('');
  }

  // Fallback: plain pre-formatted text
  return `<p class="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">${esc(String(transcriptData))}</p>`;
}

// ════════════════════════════════════════════════════════════
// CASE DETAIL PANEL
// ════════════════════════════════════════════════════════════
function openCaseDetail(oppId){
  selectedCaseId = oppId;
  const idx = (ghlOpps||[]).findIndex(o=>o.id===oppId);
  if(idx<0) return;
  const op  = enrich(ghlOpps[idx], idx);
  // Normalize legacy status values to the canonical CASE_STATUSES list
  const _rawStatus = caseStatuses[oppId] || '';
  const _legacyMap = {'New':'New - Untriaged','In Progress':'In Progress','Resolved':'Closed - Resolved','Triaged':'In Progress'};
  const csKey = CASE_STATUSES.includes(_rawStatus) ? _rawStatus : (_legacyMap[_rawStatus] || 'New - Untriaged');
  const cbDone   = cbStatuses[oppId]?.done;
  const cbTs     = cbStatuses[oppId]?.ts;
  const notes    = caseNotes[oppId] || '';
  const confidence = 72+Math.floor((op.id||'').charCodeAt(0)%22);
  const safetyFlag = op.urgency==='critical';
  const recAction  = {critical:'Escalate immediately — assign senior staff and notify family.',medium:'Schedule follow-up call within 2 hours. Monitor for changes.',low:'Standard response — review at next shift check-in.',high:'Priority response — follow up within 1 hour.'}[op.urgency] || 'Review case details.';
  const kbArticle  = {Safety:'Home Safety & Fall Prevention',Medical:'Medication Management for Dementia',Emotional:'Managing Behavioural Changes',Admin:'CARA Registration Guide',Resource:'SG Dementia Resources Directory'}[op.category]||'Understanding Dementia';

  const aiSummary  = op.ai_summary  || op.name || `AI analysis: Caller ${esc(op.contact?.name||'Unknown')} reported a ${op.urgency}-priority concern related to ${op.category}. Intent detected: ${op.intent}.`;

  document.getElementById('modal-root').innerHTML=`
  <div class="case-detail-overlay" id="caseDetailOverlay" onclick="if(event.target===this)closeCaseDetail()">
    <div class="case-detail-panel" onclick="event.stopPropagation()">
      <!-- Header -->
      <div class="case-detail-header">
        <div class="flex items-center gap-3 mb-3">
          <button onclick="closeCaseDetail()" class="text-white/60 hover:text-white text-xl leading-none">←</button>
          <div class="flex-1">
            <p class="text-white/60 text-[10px] font-black uppercase tracking-widest">Case Detail</p>
            <h2 class="text-white font-black text-lg leading-tight">${esc(op.contact?.name||'Unknown Caller')}</h2>
          </div>
          <span class="badge badge-${op.urgency==='high'?'high':op.urgency} text-xs">${op.urgency==='critical'?'🔴 ':op.urgency==='high'?'🟠 ':op.urgency==='medium'?'🟡 ':'🟢 '}${op.urgency.toUpperCase()}</span>
        </div>
        <div class="flex flex-wrap gap-2">
          <span class="bg-white/15 text-white text-[10px] font-bold px-3 py-1 rounded-full">${esc(op.caseId)}</span>
          <span class="bg-white/15 text-white text-[10px] font-bold px-3 py-1 rounded-full">📅 ${fmtDate(op.createdAt)}</span>
          <span class="bg-white/15 text-white text-[10px] font-bold px-3 py-1 rounded-full">${esc(op.category)}</span>
          <span class="bg-white/15 text-white text-[10px] font-bold px-3 py-1 rounded-full">${esc(op.intent)}</span>
        </div>
      </div>

      <!-- Caller Info -->
      <div class="cd-section">
        <p class="cd-label">Caller Information</p>
        <div class="grid grid-cols-2 gap-3">
          <div class="p-3 bg-slate-50 rounded-xl">
            <p class="text-[10px] font-black text-slate-400 uppercase mb-1">Phone</p>
            <p class="text-sm font-bold text-slate-800">${esc(op.contact?.phone||'—')}</p>
          </div>
          <div class="p-3 bg-slate-50 rounded-xl">
            <p class="text-[10px] font-black text-slate-400 uppercase mb-1">Email</p>
            <p class="text-sm font-bold text-slate-800 truncate">${esc(op.contact?.email||'—')}</p>
          </div>
          <div class="p-3 rounded-xl ${cbDone?'bg-green-50':'bg-yellow-50'}">
            <p class="text-[10px] font-black text-slate-400 uppercase mb-1">Callback</p>
            ${cbDone
              ? `<p class="text-xs font-bold text-green-700">✓ Completed · ${fmtShort(cbTs)}</p>`
              : `<div class="flex items-center gap-2"><span class="badge badge-pending">Pending</span><button onclick="markCallbackDone('${oppId}')" class="dh-btn dh-btn-primary dh-btn-sm">Mark Called</button></div>`}
          </div>
          <div class="p-3 bg-slate-50 rounded-xl">
            <p class="text-[10px] font-black text-slate-400 uppercase mb-1">Consent</p>
            <span class="badge badge-yes">Yes</span>
          </div>
        </div>
      </div>

      <!-- AI Insights -->
      <div class="cd-section">
        <p class="cd-label mb-3">AI Insights</p>
        <div class="space-y-3">
          <div class="ai-insight-box ai-summary">
            <p class="text-[10px] font-black text-green-700 uppercase mb-1">🤖 AI Summary</p>
            <p class="text-sm text-green-900 font-medium leading-relaxed">${esc(aiSummary)}</p>
          </div>
          <div class="ai-insight-box ai-intent">
            <p class="text-[10px] font-black text-blue-700 uppercase mb-1">🎯 Detected Intent</p>
            <p class="text-sm font-bold text-blue-900">${esc(op.intent)} · <span class="font-normal text-blue-700">${esc(op.category)}</span></p>
          </div>
          <div class="ai-insight-box ${safetyFlag?'ai-critical-action':'ai-action'}">
            <p class="text-[10px] font-black ${safetyFlag?'text-red-700':'text-violet-700'} uppercase mb-1">⚡ Recommended Action</p>
            <p class="text-sm font-bold ${safetyFlag?'text-red-900':'text-violet-900'}">${recAction}</p>
          </div>
          <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <div class="flex-1"><p class="text-[10px] font-black text-slate-400 uppercase mb-1">AI Confidence</p>
              <div class="flex items-center gap-2"><div class="flex-1 h-2 bg-slate-200 rounded-full"><div style="width:${confidence}%;background:#006D77;" class="h-full rounded-full"></div></div><span class="text-xs font-black text-teal-700">${confidence}%</span></div>
            </div>
            <div class="text-right"><p class="text-[10px] font-black text-slate-400 uppercase mb-1">KB Article</p><p class="text-xs font-bold text-teal-700">📚 ${esc(kbArticle)}</p></div>
          </div>
        </div>
      </div>

      <!-- Transcript -->
      <div class="cd-section">
        <p class="cd-label mb-2">Full Call Transcript</p>
        <div class="transcript-box">${renderTranscript(op.transcript || op.description)}</div>
      </div>

      <!-- Staff Action Panel -->
      <div class="cd-section">
        <p class="cd-label mb-3">Staff Actions</p>
        <div class="space-y-3">
          <div>
            <label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Case Status</label>
            <select id="cdStatus" class="dh-select w-full">
              ${CASE_STATUSES.map(s=>`<option ${csKey===s?'selected':''}>${esc(s)}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Assign To</label>
            <select id="cdAssign" class="dh-select w-full">
              ${STAFF_LIST.map(s=>`<option ${op.assignedTo===s?'selected':''}>${esc(s)}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Case Notes</label>
            <textarea id="cdNotes" rows="4" class="dh-input resize-none" placeholder="Add notes about this case…">${esc(notes)}</textarea>
          </div>
          <div id="cdSaveMsg" class="hidden text-xs font-bold text-green-700 bg-green-50 rounded-xl px-3 py-2">✓ Saved successfully</div>
          <div class="flex gap-3">
            <button onclick="saveCaseAction('${oppId}',${idx})" class="dh-btn dh-btn-primary flex-1 justify-center">Save Updates</button>
            <button onclick="openEscalateModal(${idx})" class="dh-btn dh-btn-warn">🚨 Escalate</button>
            <button onclick="openModal(${idx})" class="dh-btn dh-btn-ghost">📝 GHL Note</button>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

function closeCaseDetail(){ selectedCaseId = null; document.getElementById('modal-root').innerHTML=''; }

function updateCaseStatus(oppId, status){
  caseStatuses[oppId] = status;
  localStorage.setItem('dsg_case_statuses', JSON.stringify(caseStatuses));
  const resolvedCount = Object.values(caseStatuses).filter(s=>_RESOLVED_STATUSES.has(s)).length;
  console.log('[updateCaseStatus]', oppId, '→', status, '| resolved total:', resolvedCount);
}

function saveCaseAction(oppId, idx){
  const status = document.getElementById('cdStatus').value;
  const assign = document.getElementById('cdAssign').value;
  const notes  = document.getElementById('cdNotes').value.trim();

  updateCaseStatus(oppId, status);
  assignments[oppId] = assign;
  if(notes) caseNotes[oppId] = notes;
  localStorage.setItem('dsg_assignments', JSON.stringify(assignments));
  localStorage.setItem('dsg_case_notes',  JSON.stringify(caseNotes));

  // Refresh panel only — avoids full re-render which would close the panel
  openCaseDetail(oppId);
  // Show save confirmation in the freshly rendered panel
  setTimeout(() => {
    const msg = document.getElementById('cdSaveMsg');
    if(msg){ msg.classList.remove('hidden'); setTimeout(()=>msg.classList.add('hidden'),2500); }
  }, 0);
}

function markCallbackDone(oppId){
  cbStatuses[oppId] = { done: true, ts: new Date().toISOString() };
  localStorage.setItem('dsg_cb_statuses', JSON.stringify(cbStatuses));
  openCaseDetail(oppId); // refresh panel
}

// ════════════════════════════════════════════════════════════
// AUTO-REFRESH
// ════════════════════════════════════════════════════════════
let _refreshTimer = null;
function startAutoRefresh(intervalMs = 30000){
  if(_refreshTimer) clearInterval(_refreshTimer);
  _refreshTimer = setInterval(()=>{ if(isAuth()) fetchGHL(); }, intervalMs);
}

// ════════════════════════════════════════════════════════════
// INIT
// ════════════════════════════════════════════════════════════
render();
if(isAuth()){ fetchGHL(); startAutoRefresh(30000); }
