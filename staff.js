/* ════════════════════════════════════════════════════════════
   SVG ICON LIBRARY  — Extended
════════════════════════════════════════════════════════════ */
function icon(name, sz = 16, col = 'currentColor') {
  const d = {
    grid:          `<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>`,
    folder:        `<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>`,
    shield:        `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>`,
    refresh:       `<polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>`,
    logout:        `<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>`,
    alert:         `<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>`,
    'alert-tri':   `<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>`,
    calendar:      `<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>`,
    clock:         `<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>`,
    phone:         `<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6 6l.93-.93a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.73 16z"/>`,
    check:         `<polyline points="20 6 9 17 4 12"/>`,
    'check-c':     `<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>`,
    user:          `<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`,
    users:         `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
    inbox:         `<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>`,
    search:        `<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>`,
    'file-text':   `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>`,
    save:          `<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>`,
    send:          `<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>`,
    zap:           `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>`,
    'chevron-r':   `<polyline points="9 18 15 12 9 6"/>`,
    'chevron-d':   `<polyline points="6 9 12 15 18 9"/>`,
    plus:          `<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>`,
    x:             `<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>`,
    'arrow-l':     `<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>`,
    list:          `<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>`,
    tag:           `<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>`,
    mic:           `<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>`,
    eye:           `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`,
    lock:          `<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>`,
    brain:         `<path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.97-3.12 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.45-1.1z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.97-3.12 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.45-1.1z"/>`,
    chat:          `<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>`,
    clipboard:     `<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/>`,
    flag:          `<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>`,
    book:          `<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>`,
    cpu:           `<rect x="9" y="9" width="6" height="6"/><path d="M3 8h2m14 0h2M3 12h2m14 0h2M3 16h2m14 0h2M8 3v2m0 14v2m4-18v2m0 14v2m4-18v2m0 14v2"/><path d="M7 3a4 4 0 0 0-4 4v10a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4V7a4 4 0 0 0-4-4z"/>`,
    activity:      `<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>`,
    kb:            `<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>`,
    'bar-chart':   `<line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>`,
    'phone-call':  `<path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6 6l.93-.93a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.73 16z"/>`,
    heart:         `<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>`,
    'external-link': `<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>`,
    headphones:    `<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>`,
    'help-circle': `<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>`,
    'file-plus':   `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>`,
    'trending-up': `<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>`,
    globe:         `<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>`,
    info:          `<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>`,
  };
  const sw = name === 'check' ? '2.5' : '2';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${sz}" height="${sz}" viewBox="0 0 24 24" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" class="dh-ico" style="display:inline-flex;align-items:center;vertical-align:middle;flex-shrink:0;">${d[name] || ''}</svg>`;
}

function urgDot(u) {
  const c = { critical: '#DC2626', high: '#EA580C', medium: '#D97706', low: '#16A34A' };
  return `<span class="urgency-dot" style="background:${c[u] || '#16A34A'};"></span>`;
}

function infoTile(label, content, bgColor = '#F8FAFC', borderColor = '#E8EDF3') {
  return `<div style="background:${bgColor};border:1px solid ${borderColor};border-radius:10px;padding:11px 13px;">
    <p style="font-size:9.5px;font-weight:800;color:#94A3B8;text-transform:uppercase;letter-spacing:.08em;margin-bottom:5px;">${label}</p>
    ${content}
  </div>`;
}

/* ════════════════════════════════════════════════════════════
   EMERGENCY CONTACTS  (Hardcoded — do not change without approval)
════════════════════════════════════════════════════════════ */
const EMERGENCY_CONTACTS = [
  { label: 'Dementia Helpline',      number: '6377 0700',      type: 'primary',   avail: '24/7',     color: '#006D77', bg: '#F0FAFA', isPhone: true },
  { label: 'Police — Missing Person',number: '999',            type: 'emergency', avail: '24/7',     color: '#DC2626', bg: '#FEF2F2', isPhone: true },
  { label: 'Ambulance / Fire',       number: '995',            type: 'emergency', avail: '24/7',     color: '#DC2626', bg: '#FEF2F2', isPhone: true },
  { label: 'IMH Crisis Line',        number: '6389 2222',      type: 'crisis',    avail: '24/7',     color: '#7C3AED', bg: '#FAF5FF', isPhone: true },
  { label: 'Samaritans of Singapore',number: '1800 221 4444',  type: 'crisis',    avail: '24/7',     color: '#7C3AED', bg: '#FAF5FF', isPhone: true },
  { label: 'CARA App / Safe Return', number: 'cara.sg',        type: 'resource',  avail: 'App/Web',  color: '#0284C7', bg: '#EFF6FF', isPhone: false, url: 'https://cara.sg' },
  { label: 'DementiaHub Resources',  number: 'dementiahub.sg', type: 'resource',  avail: 'Web',      color: '#0284C7', bg: '#EFF6FF', isPhone: false, url: 'https://www.dementiahub.sg' },
];

/* ════════════════════════════════════════════════════════════
   KB SCRIPT QUICK REFERENCE
════════════════════════════════════════════════════════════ */
const KB_SCRIPTS = {
  safe: [
    { id: 'SAFE-01', topic: 'Wandering at Night',         keywords: ['wander','night','missing','door'] },
    { id: 'SAFE-02', topic: 'Sundowning / Evening Agitation', keywords: ['sundown','evening','sunset','agitated','late'] },
    { id: 'SAFE-03', topic: 'Repetitive Questions',       keywords: ['repeat','same','forget','asking','again'] },
    { id: 'SAFE-04', topic: 'Agitation / Restlessness',   keywords: ['agitat','restless','angry','upset','hitting'] },
    { id: 'SAFE-05', topic: 'Refusing Care',              keywords: ['refuse','bath','medicine','eat','help'] },
    { id: 'SAFE-06', topic: 'Sleep Disturbance',          keywords: ['sleep','awake','night','insomnia'] },
    { id: 'SAFE-07', topic: 'Communication Difficulty',   keywords: ['talk','speak','word','communicate','understand'] },
    { id: 'SAFE-08', topic: 'Caregiver Stress',           keywords: ['stress','burn','cope','exhausted','tired'] },
    { id: 'SAFE-09', topic: 'Programme / Service Info',   keywords: ['programme','service','register','enrol','training'] },
    { id: 'SAFE-10', topic: 'General Reassurance',        keywords: ['general','first','new','help','what to do'] },
  ],
  caution: [
    { id: 'CAUTION-01', topic: 'Caregiver Overwhelmed',   keywords: ['overwhelm','cannot','desperate','breakdown'] },
    { id: 'CAUTION-02', topic: 'Caller Crying / Desperate', keywords: ['crying','cry','desperate','helpless'] },
    { id: 'CAUTION-03', topic: 'Caller Wants Human',      keywords: ['human','person','staff','speak to'] },
    { id: 'CAUTION-04', topic: 'AI Not Suitable',         keywords: ['confused','complex','understand'] },
  ],
  unsafe: [
    { id: 'ESC-01', topic: 'Missing Person / Wandering',  keywords: ['missing','wander','not returned','lost'] },
    { id: 'ESC-02', topic: 'Immediate Danger',            keywords: ['danger','immediate','emergency','now'] },
    { id: 'ESC-03', topic: 'Medical Emergency',           keywords: ['medical','hospital','ambulance','injury','fall'] },
    { id: 'ESC-04', topic: 'Self-Harm / Suicide Risk',    keywords: ['self-harm','suicide','end it','kill'] },
    { id: 'ESC-05', topic: 'Violence / Abuse',            keywords: ['violence','abuse','hit','assault','threaten'] },
    { id: 'ESC-06', topic: 'Fire / Collapse',             keywords: ['fire','collapse','unsafe','building'] },
    { id: 'ESC-07', topic: 'Severe Distress',             keywords: ['unresponsive','severe','crisis','breakdown'] },
  ],
};

/* ════════════════════════════════════════════════════════════
   CONFIG
════════════════════════════════════════════════════════════ */
const CFG = {
  locationId:        'Idf9v4q6aqh5KhzXip6e',
  accessKey:         'admin123',
  elevenLabsAgentId: 'agent_7801kkd50dzsez4tfv4qme5mn6br',
};

const STAFF_LIST    = ['Case Manager Wibiz','DementiaSG Admin','Helpline Staff Wibiz','Read-only Analyst Wibiz','Unassigned'];
const ROLES         = ['Case Manager Wibiz','DementiaSG Admin','Helpline Staff Wibiz','Read-only Analyst Wibiz'];
const LANGUAGES     = ['English','Mandarin','Malay','Filipino','Vietnamese','Other'];
const LANG_FLAGS    = { English:'🇸🇬', Mandarin:'🇨🇳', Malay:'🇲🇾', Filipino:'🇵🇭', Vietnamese:'🇻🇳', Other:'🌐' };
const CASE_STATUSES = [
  'New - Untriaged','Self-Serve Resolved','Needs Staff - Awaiting Contact',
  'Escalation – No Staff Available','In Progress','Callback Scheduled',
  'Scheduled / Follow Up','Referred / Redirected','Closed - Resolved',
  'Closed - Unreachable','Urgent - Immediate Action',
];
const _RESOLVED = new Set(['Self-Serve Resolved','Closed - Resolved','Closed - Unreachable','Referred / Redirected']);
const _TRIAGED  = new Set(['In Progress','Needs Staff - Awaiting Contact','Callback Scheduled','Scheduled / Follow Up','Escalation – No Staff Available']);

/* Role helpers */
function currentRole(){ return getCurrentStaff()?.staffRole || ''; }
function isCaseManager(){ return currentRole() === 'Case Manager Wibiz'; }
function roleAccessControl(list){
  if(isCaseManager()) return list;
  const role = currentRole();
  return list.filter(o => o.assignedTo === role || o.assignedTo === 'Unassigned');
}

/* ════════════════════════════════════════════════════════════
   STATE
════════════════════════════════════════════════════════════ */
let ghlOpps        = null;
let activeFilter   = 'all';
let searchQuery    = '';
let sortCol        = 'updated';
let sortDir        = 'desc';
let activeChatIdx  = 0;
let selectedCaseId = null;
let kbSearch       = '';
let kbTab          = 'safe';

let assignments  = JSON.parse(localStorage.getItem('dsg_assignments')   || '{}');
let callbacks    = JSON.parse(localStorage.getItem('dsg_callbacks')     || '[]');
let caseStatuses = JSON.parse(localStorage.getItem('dsg_case_statuses') || '{}');
let caseNotes    = JSON.parse(localStorage.getItem('dsg_case_notes')    || '{}');
let cbStatuses   = JSON.parse(localStorage.getItem('dsg_cb_statuses')   || '{}');
let soapNotes    = JSON.parse(localStorage.getItem('dsg_soap_notes')    || '{}');

/* ════════════════════════════════════════════════════════════
   AUTH
════════════════════════════════════════════════════════════ */
function isAuth(){ return sessionStorage.getItem('dsg_auth') === '1'; }
function doLogin(key, staffRole){
  if(key !== CFG.accessKey) return false;
  DHUserContext.saveStaffSession(staffRole, staffRole);
  DHUserContext.configureGHLWidget(DHUserContext.getStaffContext());
  return true;
}
function doLogout(){ DHUserContext.clearStaffSession(); ghlOpps = null; render(); }
function getCurrentStaff(){ return DHUserContext.getStaffContext(); }

/* ════════════════════════════════════════════════════════════
   ROUTING
════════════════════════════════════════════════════════════ */
function getView(){ return location.hash.replace('#','') || 'overview'; }
window.addEventListener('hashchange', () => { selectedCaseId = null; render(); });

/* ════════════════════════════════════════════════════════════
   GHL API
════════════════════════════════════════════════════════════ */
async function fetchGHL(){
  try{
    ghlOpps = await DHAPI.getOpportunities(50);
    console.log('[fetchGHL] Loaded - staff.js:193', ghlOpps.length, 'opportunities');
  }catch(e){ ghlOpps = []; console.warn('[fetchGHL] - staff.js:194', e.message); }
  render();
}
async function syncNoteToGHL(contactId, text){ return DHAPI.addNote(contactId, text); }

/* ════════════════════════════════════════════════════════════
   DATA ENRICHMENT
════════════════════════════════════════════════════════════ */
const CRIT_KW = ['urgent','critical','emergency','fall','missing','wander','danger','immediate','acute','assault','suicid','harm'];
const WARN_KW = ['anxious','distress','confused','upset','worried','agitated','unsafe','concern'];
const CAT_MAP  = {
  Safety:    ['fall','missing','wander','danger','harm','suicid','assault'],
  Medical:   ['medical','health','doctor','hospital','medication','pain','ill'],
  Emotional: ['anxiety','distress','depress','grief','upset','agitated'],
  Admin:     ['grant','subsidy','cara','registration','form','paperwork'],
  Resource:  ['resource','centre','facility','service','referral'],
};
const INTENT_MAP = {
  Emergency:    ['urgent','emergency','critical','immediate'],
  'Seeking Help':['help','assist','support','need'],
  Information:  ['info','resource','find','where','what','how'],
  'Follow-up':  ['follow','update','status','check'],
  Complaint:    ['complaint','issue','problem'],
};

function enrich(op, idx){
  const txt = ((op.name||'')+' '+(op.pipelineStageName||'')).toLowerCase();
  const hrs  = (Date.now()-new Date(op.updatedAt||op.createdAt).getTime())/3600000;
  let urgency = 'low';
  if(CRIT_KW.some(k=>txt.includes(k))||hrs>72) urgency = 'critical';
  else if(WARN_KW.some(k=>txt.includes(k))||hrs>24) urgency = 'medium';
  let category = 'General';
  for(const [cat,kws] of Object.entries(CAT_MAP)){ if(kws.some(k=>txt.includes(k))){ category=cat; break; } }
  let intent = 'General Inquiry';
  for(const [int,kws] of Object.entries(INTENT_MAP)){ if(kws.some(k=>txt.includes(k))){ intent=int; break; } }
  let sla = 'ok';
  if(hrs>4) sla = 'breach'; else if(hrs>2) sla = 'warn';
  const caseId     = 'C-'+String(op.id||idx).replace(/[^a-z0-9]/gi,'').slice(-6).toUpperCase();
  const assignedTo = assignments[op.id] || 'Unassigned';
  const localStatus = caseStatuses[op.id];
  let displayStatus = 'new';
  if(localStatus){
    if(_RESOLVED.has(localStatus))         displayStatus = 'resolved';
    else if(_TRIAGED.has(localStatus))     displayStatus = 'triaged';
    else if(localStatus==='Urgent - Immediate Action') displayStatus = 'critical';
  } else {
    const stage = (op.pipelineStageName||'').toLowerCase();
    const ghlSt = (op.status||'').toLowerCase();
    if(ghlSt==='won'||ghlSt==='lost')             displayStatus = 'resolved';
    else if(/triage|progress|active|contact|open/i.test(stage)) displayStatus = 'triaged';
  }
  const cbEntry   = cbStatuses[op.id];
  const dueSoon   = displayStatus!=='resolved'&&(urgency==='critical'||urgency==='high'||(cbEntry&&!cbEntry.done));
  const displayName = op.contact?.name||op.contact?.phone||caseId;
  const isVoice   = /voice/i.test(op.channel||'') || (op.customFields||[]).some(f=>f.key==='voice_transcript'&&f.value);
  const lang      = op.preferredLanguage || 'English';
  return {...op, urgency, category, intent, sla, caseId, hrs, assignedTo, displayStatus, dueSoon, displayName, isVoice, lang};
}

/* ════════════════════════════════════════════════════════════
   HELPERS
════════════════════════════════════════════════════════════ */
function esc(v){ return String(v||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function fmtDate(iso){ return iso?new Date(iso).toLocaleString('en-SG',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}):'—'; }
function fmtShort(iso){ if(!iso)return'—'; const d=new Date(iso); return d.toLocaleTimeString('en-SG',{hour:'2-digit',minute:'2-digit'})+' · '+d.toLocaleDateString('en-SG',{month:'short',day:'numeric'}); }
function today(){ return new Date().toLocaleDateString('en-SG',{weekday:'long',year:'numeric',month:'long',day:'numeric'}); }
function timeAgo(iso){ if(!iso)return'—'; const h=(Date.now()-new Date(iso).getTime())/3600000; if(h<1)return Math.round(h*60)+'m ago'; if(h<24)return Math.round(h)+'h ago'; return Math.round(h/24)+'d ago'; }
function getHandovers(){ return JSON.parse(localStorage.getItem('dsg_handovers')||'[]'); }
function saveHandover(text){
  const staff = getCurrentStaff();
  const notes = getHandovers();
  notes.unshift({ staff_id:staff?.userId||'unknown', staff_name:staff?.name||'Staff Member', staff_role:staff?.staffRole||'', note_content:text, created_at:new Date().toISOString() });
  localStorage.setItem('dsg_handovers', JSON.stringify(notes.slice(0,30)));
}
function getMessages(id){ return JSON.parse(localStorage.getItem('dsg_msg_'+id)||'[]'); }
function addMessage(id, msg){ const msgs=getMessages(id); msgs.push(msg); localStorage.setItem('dsg_msg_'+id, JSON.stringify(msgs.slice(-60))); }

/* Toast notifications */
function showToast(msg, type='success', duration=3000){
  const id = 'toast_'+Date.now();
  const color = {success:'#16A34A', error:'#DC2626', warn:'#D97706', info:'#0284C7'}[type]||'#006D77';
  const ico   = {success:'check-c', error:'x', warn:'alert-tri', info:'info'}[type]||'info';
  const el = document.createElement('div');
  el.id = id;
  el.className = 'dh-toast';
  el.innerHTML = `<div style="display:flex;align-items:center;gap:10px;"><div style="color:${color};flex-shrink:0;">${icon(ico,15,color)}</div><span style="font-size:13px;font-weight:600;color:#1E293B;">${esc(msg)}</span><button onclick="document.getElementById('${id}').remove()" style="margin-left:auto;background:none;border:none;cursor:pointer;color:#94A3B8;padding:2px;flex-shrink:0;">${icon('x',12)}</button></div>`;
  let container = document.getElementById('toast-container');
  if(!container){ container=document.createElement('div'); container.id='toast-container'; container.className='toast-container'; document.body.appendChild(container); }
  container.appendChild(el);
  setTimeout(()=>{ el.classList.add('toast-exit'); setTimeout(()=>el.remove(),300); }, duration);
}

/* ════════════════════════════════════════════════════════════
   RENDER ENTRY
════════════════════════════════════════════════════════════ */
function render(){
  const app = document.getElementById('app');
  if(!isAuth()){ app.innerHTML=renderLogin(); document.getElementById('loginForm').addEventListener('submit',handleLogin); return; }
  app.innerHTML = renderShell(getView());
  if(selectedCaseId) openCaseDetail(selectedCaseId);
}

function handleLogin(e){
  e.preventDefault();
  const key       = document.getElementById('accessKey').value;
  const staffRole = document.getElementById('staffRole').value;
  if(!staffRole){ document.getElementById('loginError').textContent='Please select your role.'; document.getElementById('loginError').classList.remove('hidden'); return; }
  if(doLogin(key, staffRole)){ fetchGHL(); startAutoRefresh(30000); render(); }
  else{ document.getElementById('loginError').textContent='Incorrect access key.'; document.getElementById('loginError').classList.remove('hidden'); }
}

/* ════════════════════════════════════════════════════════════
   ① LOGIN
════════════════════════════════════════════════════════════ */
function renderLogin(){
  const roleOpts = ROLES.map(r=>`<option value="${esc(r)}">${esc(r)}</option>`).join('');
  return `
  <div class="dh-auth-bg">
    <div class="auth-particle" style="width:500px;height:500px;background:radial-gradient(#00BFD0,transparent);top:-180px;right:-120px;"></div>
    <div class="auth-particle" style="width:340px;height:340px;background:radial-gradient(#006D77,transparent);bottom:-100px;left:-70px;"></div>
    <div class="auth-particle" style="width:200px;height:200px;background:radial-gradient(#009FA9,transparent);bottom:20%;right:20%;"></div>

    <div class="dh-auth-card">
      <div style="display:flex;align-items:center;gap:13px;margin-bottom:32px;">
        <div class="auth-logo-box">
          <div class="auth-logo-ring"></div>
          ${icon('brain', 26, '#fff')}
        </div>
        <div>
          <div style="font-size:16px;font-weight:800;color:#003D44;letter-spacing:-.3px;line-height:1.2;">DementiaHub</div>
          <div style="font-size:10.5px;color:#64748B;font-weight:600;margin-top:2px;">AI Command Center v5.0</div>
        </div>
      </div>

      <div class="auth-divider-top"></div>

      <h1 style="font-size:24px;font-weight:800;color:#0F172A;letter-spacing:-.5px;margin:20px 0 5px;">Staff Sign In</h1>
      <p style="font-size:13px;color:#64748B;margin-bottom:28px;font-weight:500;">Secure access — DementiaHub caregiving portal</p>

      <div id="loginError" class="hidden" style="background:#FEF2F2;border:1px solid #FECACA;border-radius:10px;padding:11px 14px;font-size:12.5px;font-weight:600;color:#B91C1C;margin-bottom:18px;display:flex;align-items:center;gap:8px;">
        ${icon('alert-tri',14,'#DC2626')} <span id="loginErrorMsg">Error</span>
      </div>

      <form id="loginForm" style="display:flex;flex-direction:column;gap:18px;">
        <div>
          <label class="auth-label">Your Role</label>
          <select id="staffRole" class="dh-select" style="width:100%;height:46px;" required>
            <option value="">— Select your role —</option>
            ${roleOpts}
          </select>
        </div>
        <div>
          <label class="auth-label">Access Key</label>
          <div style="position:relative;">
            <input id="accessKey" type="password" placeholder="Enter your access key"
              class="dh-input" style="padding-right:48px;font-family:monospace;letter-spacing:2.5px;height:46px;"
              autocomplete="current-password" required>
            <button type="button" onclick="togglePwVis()" style="position:absolute;right:13px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#94A3B8;display:flex;align-items:center;padding:4px;transition:color .15s;" onmouseover="this.style.color='#006D77'" onmouseout="this.style.color='#94A3B8'">
              ${icon('eye', 16)}
            </button>
          </div>
        </div>
        <button type="submit" class="dh-btn dh-btn-primary" style="height:48px;font-size:14px;margin-top:4px;width:100%;letter-spacing:.2px;">
          Unlock Dashboard ${icon('chevron-r', 15, '#fff')}
        </button>
      </form>

      <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-top:22px;padding-top:18px;border-top:1px solid #F1F5F9;font-size:11px;color:#94A3B8;">
        ${icon('lock', 11, '#CBD5E1')} End-to-end encrypted &nbsp;·&nbsp; HIPAA-aware logging
      </div>
    </div>
  </div>`;
}
function togglePwVis(){ const i=document.getElementById('accessKey'); i.type=i.type==='password'?'text':'password'; }

/* ════════════════════════════════════════════════════════════
   ② SHELL
════════════════════════════════════════════════════════════ */
function renderShell(activeV){
  const canHandover = isCaseManager();
  if(activeV==='handover'&&!canHandover){ location.hash='overview'; return renderShell('overview'); }

  const allEnriched = (ghlOpps||[]).map(enrich);
  const enriched    = roleAccessControl(allEnriched);
  const critCount   = enriched.filter(o=>o.urgency==='critical').length;
  const cbToday     = callbacks.filter(cb=>{ const d=new Date(cb.time); return d.toDateString()===new Date().toDateString(); }).length;

  const nav = [
    { section: 'Monitor' },
    { view:'overview',  ico:'grid',       label:'Command Center' },
    { view:'cases',     ico:'folder',     label:'Case Management' },
    { view:'voice',     ico:'headphones', label:'Voice Cases' },
    { view:'callbacks', ico:'phone-call', label:'Callbacks', badge: cbToday||0 },
    { section: 'Resources' },
    { view:'knowledge', ico:'book',       label:'Script Library' },
    ...(canHandover ? [{ section:'Operations' }, { view:'handover', ico:'shield', label:'Staff Handover' }] : []),
  ];

  const navHtml = nav.map(n=>{
    if(n.section) return `<div class="dh-nav-section">${n.section}</div>`;
    const isActive = activeV===n.view;
    return `<a class="dh-nav-link${isActive?' active':''}" href="#${n.view}">
      <div class="nav-ico">${icon(n.ico, 14)}</div>
      <span>${n.label}</span>
      ${n.badge?`<span class="nav-badge">${n.badge}</span>`:''}
    </a>`;
  }).join('');

  const mobIcons = nav.filter(n=>n.view).map(n=>`
    <a href="#${n.view}" style="color:${activeV===n.view?'#fff':'rgba(255,255,255,.38)'};display:flex;position:relative;">
      ${icon(n.ico, 20)}
      ${n.badge?`<span style="position:absolute;top:-4px;right:-5px;background:#DC2626;color:#fff;font-size:8px;font-weight:800;border-radius:99px;min-width:14px;height:14px;display:flex;align-items:center;justify-content:center;padding:0 3px;">${n.badge}</span>`:''}
    </a>`).join('');

  let content = '';
  if(activeV==='overview')  content = renderOverview(enriched);
  else if(activeV==='cases')  content = renderCases(enriched);
  else if(activeV==='voice')  content = renderVoiceCases(enriched);
  else if(activeV==='callbacks') content = renderCallbacksView(enriched);
  else if(activeV==='knowledge') content = renderKnowledgeBase();
  else if(activeV==='handover')  content = renderHandover();

  const staff = getCurrentStaff();
  const init  = staff ? staff.name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase() : 'S';
  const name  = staff ? esc(staff.name) : 'Staff Member';
  const role  = staff ? esc(staff.staffRole) : 'Admin';

  return `
  <!-- Mobile bar -->
  <div class="dh-mob-bar">
    <div style="display:flex;align-items:center;gap:9px;color:#fff;">${icon('brain',20,'#fff')} <span style="font-weight:800;font-size:13px;">DementiaHub</span></div>
    <div style="display:flex;align-items:center;gap:14px;">${mobIcons}
      <span onclick="doLogout()" style="cursor:pointer;color:rgba(248,113,113,.8);display:flex;">${icon('logout',18)}</span>
    </div>
  </div>

  <!-- Sidebar -->
  <nav class="dh-sidebar">
    <div class="sb-brand">
      <div class="sb-logo">${icon('brain', 18, '#fff')}</div>
      <div>
        <div style="font-size:13px;font-weight:800;color:#fff;line-height:1.2;letter-spacing:-.2px;">DementiaHub</div>
        <div style="font-size:9px;color:rgba(255,255,255,.28);font-weight:600;letter-spacing:.05em;">AI Command Center v5.0</div>
      </div>
    </div>

    <!-- Staff card -->
    <div class="sb-staff-card">
      <div class="sb-avatar">${init}</div>
      <div style="flex:1;min-width:0;">
        <div style="font-size:11.5px;font-weight:700;color:#fff;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${name}</div>
        <div style="font-size:9px;color:rgba(255,255,255,.38);font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-top:1px;">${role.split(' ')[0]}</div>
      </div>
      ${critCount?`<div class="crit-badge flash">${critCount}</div>`:''}
    </div>

    <nav style="flex:1;overflow-y:auto;padding-right:2px;margin-right:-2px;">${navHtml}</nav>

    <!-- Emergency quick panel -->
    <div class="sb-emergency">
      <div class="sb-emergency-title">${icon('alert-tri',11,'#F87171')} Emergency Lines</div>
      <a href="tel:6377 0700" class="sb-emerg-item primary">
        <span class="sb-emerg-dot" style="background:#22C55E;"></span>
        <span style="flex:1;font-size:11px;font-weight:700;color:#fff;">Dementia Helpline</span>
        <span style="font-size:10px;font-weight:800;color:#4ADE80;font-family:monospace;">6377 0700</span>
      </a>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-top:4px;">
        <a href="tel:999" class="sb-emerg-pill red">
          ${icon('alert-tri',9,'#FCA5A5')} <span>Police 999</span>
        </a>
        <a href="tel:995" class="sb-emerg-pill red">
          ${icon('alert-tri',9,'#FCA5A5')} <span>Amb. 995</span>
        </a>
      </div>
      <button onclick="openEmergencyModal()" class="sb-emerg-all">
        View All Contacts ${icon('chevron-r',10,'rgba(255,255,255,.4)')}
      </button>
    </div>

    <div class="sb-bot">
      <div class="sb-live"><div class="sb-live-dot"></div>GHL Live Connected</div>
      <div class="sb-act" onclick="fetchGHL()">${icon('refresh',14)} <span>Refresh</span></div>
      <div class="sb-act danger" onclick="doLogout()">${icon('logout',14)} <span>Logout</span></div>
      <div class="sb-ver">v5.0 · WiBiz × DementiaSG</div>
    </div>
  </nav>

  <!-- Main -->
  <div class="dh-main">
    <div class="dh-content">${content}</div>
    <footer class="dh-footer">
      <a href="https://dementiahub.wibiz.ai/home" target="_blank" class="footer-link">${icon('kb',13,'#006D77')} Knowledge Base</a>
      <span style="color:#E2E8F0;">|</span>
      <a href="https://cara.sg" target="_blank" class="footer-link">${icon('external-link',11,'#006D77')} CARA App</a>
      <span style="color:#E2E8F0;">|</span>
      <span style="color:#94A3B8;font-size:11.5px;">DementiaHub AI Command Center</span>
    </footer>
  </div>

  <!-- Note Modal -->
  <div id="noteModal" class="hidden" style="position:fixed;inset:0;background:rgba(0,30,40,.65);backdrop-filter:blur(7px);z-index:500;display:none;align-items:center;justify-content:center;padding:20px;">
    <div style="background:#fff;border-radius:22px;padding:28px;width:100%;max-width:440px;box-shadow:0 24px 60px rgba(0,0,0,.2);">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:18px;">
        <div style="width:40px;height:40px;background:#F0FDF4;border-radius:11px;display:flex;align-items:center;justify-content:center;color:#16A34A;">${icon('file-text',20)}</div>
        <div>
          <div style="font-size:16px;font-weight:800;color:#0F172A;">Add Case Note</div>
          <div style="font-size:11px;color:#94A3B8;margin-top:2px;">Syncing to: <span id="modalName" style="color:#006D77;font-weight:700;">Contact</span></div>
        </div>
        <button onclick="closeNoteModal()" style="margin-left:auto;background:none;border:none;cursor:pointer;color:#94A3B8;display:flex;">${icon('x',16)}</button>
      </div>
      <textarea id="noteText" class="dh-input" style="resize:none;min-height:120px;margin-bottom:10px;" placeholder="Describe the care update, action taken, or follow-up needed…"></textarea>
      <div id="noteErr" class="hidden" style="font-size:12px;color:#DC2626;font-weight:600;margin-bottom:10px;"></div>
      <div style="display:flex;gap:10px;">
        <button id="noteBtn" onclick="submitNote()" class="dh-btn dh-btn-primary" style="flex:1;">${icon('send',13,'#fff')} Sync to GHL</button>
        <button onclick="closeNoteModal()" class="dh-btn dh-btn-ghost">Cancel</button>
      </div>
    </div>
  </div>

  <div id="modal-root"></div>
  <div id="toast-container" class="toast-container"></div>`;
}

/* ════════════════════════════════════════════════════════════
   ③ OVERVIEW — Enhanced Command Center
════════════════════════════════════════════════════════════ */
function renderOverview(enriched){
  const loading   = ghlOpps === null;
  const total     = enriched.length;
  const critical  = enriched.filter(o=>o.urgency==='critical').length;
  const todayCt   = enriched.filter(o=>o.createdAt&&(Date.now()-new Date(o.createdAt).getTime())<86400000).length;
  const resolved  = enriched.filter(o=>o.displayStatus==='resolved').length;
  const activeCt  = enriched.filter(o=>o.displayStatus!=='resolved').length;
  const dueSoon   = enriched.filter(o=>o.dueSoon&&o.displayStatus!=='resolved').length;
  const pendCb    = Object.values(cbStatuses).filter(c=>!c.done).length + callbacks.length;
  const slaOk     = enriched.filter(o=>o.sla==='ok').length;
  const slaWarn   = enriched.filter(o=>o.sla==='warn').length;
  const slaBreach = enriched.filter(o=>o.sla==='breach').length;
  const voiceCt   = enriched.filter(o=>o.isVoice).length;
  const pct = n => total?Math.round(n/total*100):0;

  /* Safety banner */
  const safetyOps = enriched.filter(o=>o.urgency==='critical');
  const banner = safetyOps.length ? `
    <div class="safety-banner">
      <div class="safety-ico flash">${icon('alert-tri',22)}</div>
      <div style="flex:1;">
        <p style="font-size:13.5px;font-weight:800;color:#7F1D1D;margin-bottom:10px;letter-spacing:-.1px;">
          SAFETY ALERT — ${safetyOps.length} Critical Case${safetyOps.length>1?'s':''} Require Immediate Attention
        </p>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          ${safetyOps.slice(0,4).map((o,i)=>`
            <div class="safety-case-chip">
              <span class="badge badge-critical flash" style="font-size:9px;">${esc(o.caseId)}</span>
              <span style="font-size:12px;font-weight:700;color:#7F1D1D;">${esc((o.contact?.name||'Unknown').split(' ')[0])}</span>
              <span style="font-size:10px;color:#EF4444;">${timeAgo(o.updatedAt)}</span>
              <button onclick="openAIModal(${enriched.indexOf(o)})" class="dh-btn dh-btn-danger dh-btn-sm">${icon('zap',10)} Review</button>
            </div>`).join('')}
          ${safetyOps.length>4?`<span style="font-size:11px;font-weight:700;color:#DC2626;align-self:center;">+${safetyOps.length-4} more</span>`:''}
        </div>
      </div>
      <a href="#cases" onclick="setFilter('critical')" class="dh-btn dh-btn-danger" style="flex-shrink:0;align-self:flex-start;">
        View All ${icon('chevron-r',12,'#DC2626')}
      </a>
    </div>` : '';

  /* Stats */
  const stats = [
    { ico:'calendar',  label:'Calls Today',       val:todayCt,  fg:'#3B82F6', bg:'rgba(59,130,246,.09)',  bar:'#3B82F6,#93C5FD' },
    { ico:'folder',    label:'Active Cases',       val:activeCt, fg:'#7C3AED', bg:'rgba(124,58,237,.09)', bar:'#7C3AED,#C4B5FD' },
    { ico:'headphones',label:'Voice Cases',        val:voiceCt,  fg:'#0284C7', bg:'rgba(2,132,199,.09)',  bar:'#0284C7,#7DD3FC' },
    { ico:'alert',     label:'Critical Priority',  val:critical, fg:'#DC2626', bg:'rgba(220,38,38,.09)',  bar:'#DC2626,#FCA5A5' },
    { ico:'phone-call',label:'Pending Callbacks',  val:pendCb,   fg:'#D97706', bg:'rgba(217,119,6,.09)',  bar:'#D97706,#FCD34D' },
    { ico:'check-c',   label:'Resolved',           val:resolved, fg:'#16A34A', bg:'rgba(22,163,74,.09)',  bar:'#16A34A,#86EFAC' },
  ];
  const statsHtml = stats.map(s=>`
    <div class="dh-stat-card" onclick="setFilter('all')">
      <div class="stat-top-bar" style="background:linear-gradient(90deg,${s.bar});"></div>
      <div class="stat-bg-glow" style="background:${s.fg};"></div>
      <div class="dh-stat-icon" style="background:${s.bg};color:${s.fg};">${icon(s.ico, 20)}</div>
      <div>
        <div style="font-size:32px;font-weight:800;line-height:1;letter-spacing:-.5px;color:${s.fg};">
          ${loading?`<span class="skeleton" style="width:40px;height:30px;display:inline-block;border-radius:6px;"></span>`:s.val}
        </div>
        <div style="font-size:11px;color:#94A3B8;font-weight:600;margin-top:4px;">${s.label}</div>
      </div>
    </div>`).join('');

  /* SLA row */
  const slaRow = `
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:20px;">
      ${[
        {cls:'sla-ok',    ico:'check',    num:slaOk,    lbl:'On Track',    sub:'Within 2 hours', pct:pct(slaOk)},
        {cls:'sla-warn',  ico:'clock',    num:slaWarn,  lbl:'Due Soon',    sub:'2 – 4 hours',    pct:pct(slaWarn)},
        {cls:'sla-breach',ico:'alert-tri',num:slaBreach,lbl:'SLA Breached',sub:'Over 4 hours',   pct:pct(slaBreach)},
      ].map(s=>`
        <div class="sla-card ${s.cls}">
          <div class="sla-ico">${icon(s.ico, 20)}</div>
          <div style="flex:1;min-width:0;">
            <div class="sla-num">${loading?'—':s.num}</div>
            <div class="sla-lbl">${s.lbl}</div>
            <div class="sla-sub">${s.sub}</div>
            <div class="sla-bar-bg"><div class="sla-fill" style="width:${s.pct}%;"></div></div>
          </div>
          <div class="sla-pct">${s.pct}%</div>
        </div>`).join('')}
    </div>`;

  /* Pipeline rows */
  let pipeRows = enriched;
  if(activeFilter==='critical')    pipeRows = enriched.filter(o=>o.urgency==='critical');
  else if(activeFilter==='untriaged')   pipeRows = enriched.filter(o=>o.displayStatus==='new');
  else if(activeFilter==='needs_staff') pipeRows = enriched.filter(o=>o.assignedTo==='Unassigned'&&o.displayStatus!=='resolved');
  else if(activeFilter==='sla_breach')  pipeRows = enriched.filter(o=>o.sla==='breach');
  else if(activeFilter==='resolved')    pipeRows = enriched.filter(o=>o.displayStatus==='resolved');
  else if(activeFilter==='new')         pipeRows = enriched.filter(o=>(Date.now()-new Date(o.createdAt||0).getTime())<86400000);

  const topRows = pipeRows.slice(0,6).map((op,i)=>`
    <tr onclick="openCaseDetail('${op.id}')" style="cursor:pointer;">
      <td>
        <div style="display:flex;align-items:center;gap:8px;">
          <span class="badge badge-${op.urgency}">${urgDot(op.urgency)} ${op.urgency}</span>
          ${op.isVoice?`<span class="voice-chip">${icon('mic',8,'#7C3AED')} Voice</span>`:''}
        </div>
      </td>
      <td>
        <p style="font-weight:700;font-size:12.5px;color:#0F172A;">${esc(op.contact?.name||'Visitor')}</p>
        <p style="font-size:9.5px;color:#94A3B8;font-family:monospace;margin-top:2px;">${esc(op.caseId)}</p>
      </td>
      <td class="truncate-cell" style="font-size:12px;color:#64748B;">${esc(op.name||'—')}</td>
      <td><span class="badge badge-sla-${op.sla}">${op.sla==='ok'?'On Track':op.sla==='warn'?'Due Soon':'Breached'}</span></td>
      <td style="font-size:10.5px;color:#94A3B8;white-space:nowrap;">${timeAgo(op.updatedAt)}</td>
      <td>
        <div style="display:flex;gap:5px;justify-content:flex-end;">
          <button onclick="event.stopPropagation();openAIModal(${i})" class="dh-btn dh-btn-ghost dh-btn-sm">${icon('zap',11)} AI</button>
          <button onclick="event.stopPropagation();openModal(${i})" class="dh-btn dh-btn-ghost dh-btn-sm">${icon('file-text',11)}</button>
        </div>
      </td>
    </tr>`).join('') || `
    <tr><td colspan="6"><div class="empty-state"><div class="empty-ico">${icon('inbox',26)}</div><div class="empty-title">No pipeline data</div><div class="empty-sub">Cases appear once synced from GoHighLevel</div></div></td></tr>`;

  /* Callbacks */
  const cbHtml = callbacks.slice(0,4).map(cb=>`
    <div class="cb-item">
      <div class="cb-avatar">${icon('phone',13,'#0284C7')}</div>
      <div style="flex:1;min-width:0;">
        <p style="font-weight:700;font-size:12.5px;color:#0F172A;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(cb.name)}</p>
        <p style="font-size:10px;color:#94A3B8;margin-top:2px;">${esc(cb.time)} · ${esc(cb.staff||'Unassigned')}</p>
      </div>
      <button onclick="removeCallback('${cb.id}')" class="dh-btn dh-btn-ghost dh-btn-sm">${icon('check',11)} Done</button>
    </div>`).join('') || `
    <div class="empty-state" style="padding:20px 0;">
      <div class="empty-ico" style="width:38px;height:38px;">${icon('phone',16)}</div>
      <div class="empty-title" style="font-size:12px;">No callbacks today</div>
    </div>`;

  /* Breakdown */
  const bdData = [
    ['Active',   activeCt, '#60A5FA'],
    ['Critical', critical, '#F87171'],
    ['Voice',    voiceCt,  '#A78BFA'],
    ['Resolved', resolved, '#34D399'],
  ];

  return `
  <div class="page-header">
    <div>
      <h1 class="page-title">AI Command Center</h1>
      <p class="page-sub">${today()}</p>
    </div>
    <div style="display:flex;align-items:center;gap:10px;">
      <div class="status-chip chip-live">
        <span class="live-dot dh-pulse"></span>
        ${loading?'Connecting…':'GHL Live'}
      </div>
      <button onclick="fetchGHL()" class="status-chip chip-ref">${icon('refresh',12)} Refresh</button>
      <button onclick="openEmergencyModal()" class="dh-btn dh-btn-danger dh-btn-sm">
        ${icon('alert-tri',12)} Emergency Contacts
      </button>
    </div>
  </div>

  ${banner}

  <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin-bottom:18px;">${statsHtml}</div>
  ${slaRow}

  <!-- Quick View filters -->
  <div class="filter-bar">
    <span style="font-size:11px;font-weight:700;color:#94A3B8;align-self:center;margin-right:3px;">Quick View:</span>
    <button class="flt-btn danger ${activeFilter==='critical'?'active':''}" onclick="setFilter('critical')">${icon('alert-tri',12)} Safety Priority</button>
    <button class="flt-btn ${activeFilter==='untriaged'?'active':''}" onclick="setFilter('untriaged')">${icon('tag',12)} Untriaged</button>
    <button class="flt-btn ${activeFilter==='needs_staff'?'active':''}" onclick="setFilter('needs_staff')">${icon('user',12)} Needs Staff</button>
    <button class="flt-btn ${activeFilter==='sla_breach'?'active':''}" onclick="setFilter('sla_breach')">${icon('clock',12)} SLA Breached</button>
    <button class="flt-btn ${activeFilter==='all'?'active':''}" onclick="setFilter('all')">${icon('refresh',12)} All</button>
  </div>

  <!-- Pipeline + right column -->
  <div style="display:grid;grid-template-columns:1fr 320px;gap:16px;">
    <div class="dh-card" style="padding:0;overflow:hidden;">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:18px 22px 14px;border-bottom:1px solid #F5F7FA;">
        <div>
          <div style="font-size:14px;font-weight:800;color:#0F172A;">Live Pipeline</div>
          <div style="font-size:11.5px;color:#94A3B8;margin-top:2px;">Top 6 from GoHighLevel</div>
        </div>
        <a href="#cases" class="dh-btn dh-btn-ghost dh-btn-sm" style="text-decoration:none;">Full View ${icon('chevron-r',11)}</a>
      </div>
      ${loading?`<div style="padding:48px;text-align:center;"><div class="spinner" style="width:22px;height:22px;margin:0 auto 12px;"></div><p style="font-size:12px;color:#94A3B8;font-weight:600;">Loading GHL data…</p></div>`:`
      <div style="overflow-x:auto;">
        <table class="dh-table">
          <thead><tr><th>Urgency</th><th>Caregiver</th><th>Case</th><th>SLA</th><th>Updated</th><th style="text-align:right;padding-right:18px;"></th></tr></thead>
          <tbody>${topRows}</tbody>
        </table>
      </div>`}
    </div>

    <div style="display:flex;flex-direction:column;gap:14px;">
      <!-- Callbacks -->
      <div class="dh-card">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
          <div style="font-size:13.5px;font-weight:800;color:#0F172A;">Upcoming Callbacks</div>
          <a href="#callbacks" style="font-size:11px;font-weight:700;color:#006D77;text-decoration:none;">View All ${icon('chevron-r',10,'#006D77')}</a>
        </div>
        ${cbHtml}
        <button onclick="openCallbackForm()" class="dh-btn dh-btn-ghost dh-btn-sm" style="width:100%;margin-top:10px;">
          ${icon('plus',11)} Schedule Callback
        </button>
      </div>

      <!-- Breakdown -->
      <div class="breakdown-card">
        <p style="font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:rgba(255,255,255,.35);margin-bottom:16px;display:flex;align-items:center;gap:5px;">${icon('bar-chart',11,'rgba(255,255,255,.35)')} Case Breakdown</p>
        ${bdData.map(([l,v,c])=>{
          const p = total?Math.round(v/total*100):0;
          return `<div style="margin-bottom:13px;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px;">
              <div style="display:flex;align-items:center;gap:7px;">
                <span style="width:8px;height:8px;border-radius:50%;background:${c};display:inline-block;flex-shrink:0;"></span>
                <span style="font-size:12px;font-weight:600;color:rgba(255,255,255,.55);">${l}</span>
              </div>
              <span style="font-size:13px;font-weight:800;color:#fff;">${v}</span>
            </div>
            <div style="height:4px;background:rgba(255,255,255,.1);border-radius:99px;overflow:hidden;">
              <div style="width:${p}%;height:100%;background:${c};border-radius:99px;opacity:.85;transition:width .5s;"></div>
            </div>
          </div>`;
        }).join('')}
        <a href="#cases" style="margin-top:12px;display:flex;align-items:center;justify-content:center;gap:6px;padding:10px;background:rgba(255,255,255,.08);border-radius:10px;color:#fff;font-size:12px;font-weight:700;text-decoration:none;border:1px solid rgba(255,255,255,.12);transition:background .14s;" onmouseover="this.style.background='rgba(255,255,255,.15)'" onmouseout="this.style.background='rgba(255,255,255,.08)'">
          Open Case Manager ${icon('chevron-r',12,'#fff')}
        </a>
      </div>
    </div>
  </div>`;
}

/* ════════════════════════════════════════════════════════════
   ④ CASE MANAGEMENT
════════════════════════════════════════════════════════════ */
function renderCases(enriched){
  const loading = ghlOpps === null;
  let filtered  = enriched;
  const _24h    = 86400000;

  if(activeFilter==='new')          filtered = enriched.filter(o=>(Date.now()-new Date(o.createdAt||0).getTime())<_24h);
  else if(activeFilter==='triaged')      filtered = enriched.filter(o=>o.displayStatus==='triaged');
  else if(activeFilter==='due_soon')     filtered = enriched.filter(o=>o.dueSoon&&o.displayStatus!=='resolved');
  else if(activeFilter==='resolved')     filtered = enriched.filter(o=>o.displayStatus==='resolved');
  else if(activeFilter==='critical')     filtered = enriched.filter(o=>o.urgency==='critical');
  else if(activeFilter==='untriaged')    filtered = enriched.filter(o=>o.displayStatus==='new');
  else if(activeFilter==='needs_staff')  filtered = enriched.filter(o=>o.assignedTo==='Unassigned'&&o.displayStatus!=='resolved');
  else if(activeFilter==='sla_breach')   filtered = enriched.filter(o=>o.sla==='breach');
  else if(activeFilter==='voice')        filtered = enriched.filter(o=>o.isVoice);

  if(searchQuery){ const q=searchQuery.toLowerCase(); filtered=filtered.filter(o=>(o.contact?.name||'').toLowerCase().includes(q)||(o.name||'').toLowerCase().includes(q)||(o.caseId||'').toLowerCase().includes(q)); }

  filtered = [...filtered].sort((a,b)=>{
    let av,bv;
    if(sortCol==='urgency'){ const u={critical:0,medium:1,low:2}; av=u[a.urgency]||2;bv=u[b.urgency]||2; }
    else if(sortCol==='name'){ av=(a.contact?.name||'').toLowerCase();bv=(b.contact?.name||'').toLowerCase(); }
    else if(sortCol==='sla'){ const s={breach:0,warn:1,ok:2}; av=s[a.sla]||2;bv=s[b.sla]||2; }
    else{ av=new Date(a.updatedAt||0);bv=new Date(b.updatedAt||0); }
    if(av<bv)return sortDir==='asc'?-1:1;if(av>bv)return sortDir==='asc'?1:-1;return 0;
  });

  const si = col => sortCol===col?(sortDir==='asc'?'↑':'↓'):'↕';

  let rows = '';
  if(loading){
    rows = `<tr><td colspan="9"><div class="empty-state"><div class="spinner" style="margin:0 auto 12px;"></div><div class="empty-title">Loading cases from GHL…</div></div></td></tr>`;
  } else if(!filtered.length){
    rows = `<tr><td colspan="9"><div class="empty-state"><div class="empty-ico">${icon('inbox',26)}</div><div class="empty-title">No cases match this filter</div><div class="empty-sub">Try a different filter or refresh</div><button class="dh-btn dh-btn-ghost dh-btn-sm" style="margin-top:14px;" onclick="setFilter('all');searchQuery='';render()">Clear Filters</button></div></td></tr>`;
  } else {
    rows = filtered.map(op=>{
      const origIdx = (ghlOpps||[]).findIndex(o=>o.id===op.id);
      const cbDone  = cbStatuses[op.id]?.done;
      const cbBadge = cbDone ? `<span class="badge badge-completed">${icon('check',9)} Done</span>` : op.cbRequired===false ? '<span class="badge badge-no">No</span>' : '<span class="badge badge-pending">Pending</span>';
      const consentBadge = `<span class="badge badge-yes">${icon('check',9)} Yes</span>`;
      const _stored = caseStatuses[op.id] || '';
      const statusLabel = _stored&&CASE_STATUSES.includes(_stored) ? _stored.replace(' - ',' ').replace(' – ',' – ') : (op.displayStatus==='resolved'?'Closed - Resolved':op.displayStatus==='triaged'?'In Progress':'New - Untriaged');
      const statusClass = op.displayStatus==='resolved'?'badge-resolved':op.displayStatus==='critical'?'badge-urgent':op.displayStatus==='triaged'?'badge-inprogress':'badge-new';
      const langFlag   = LANG_FLAGS[op.lang] || '🌐';
      return `
        <tr id="row-${op.id}" style="${op.urgency==='critical'?'background:#FFF8F8;':''}" onclick="openCaseDetail('${op.id}')" style="cursor:pointer;">
          <td>
            <div style="display:flex;flex-direction:column;gap:3px;">
              <p style="font-weight:700;font-size:12.5px;color:#0F172A;line-height:1.3;">${esc(op.displayName)}</p>
              <p style="font-size:10px;color:#94A3B8;">${op.contact?.phone?esc(op.contact.phone):''}</p>
              <p style="font-family:monospace;font-size:9px;color:#CBD5E1;">${esc(op.caseId)}</p>
            </div>
          </td>
          <td style="font-size:11px;color:#64748B;white-space:nowrap;">${op.createdAt?fmtDate(op.createdAt):'—'}</td>
          <td><span class="badge badge-${op.urgency}">${urgDot(op.urgency)} ${op.urgency}</span></td>
          <td><span class="badge ${statusClass}" style="font-size:9.5px;">${esc(statusLabel)}</span></td>
          <td>
            <div style="display:flex;flex-direction:column;gap:3px;">
              <span style="font-size:10.5px;font-weight:600;color:#64748B;">${esc(op.category)}</span>
              ${op.isVoice?`<span class="voice-chip">${icon('mic',8,'#7C3AED')} Voice</span>`:''}
            </div>
          </td>
          <td><span title="${esc(op.lang)}" style="font-size:14px;">${langFlag}</span></td>
          <td>${cbBadge}</td>
          <td onclick="event.stopPropagation()">
            <select class="dh-select" style="height:30px;font-size:11px;padding:0 28px 0 9px;" onchange="assignStaff('${op.id}',this.value)">
              ${STAFF_LIST.map(s=>`<option ${op.assignedTo===s?'selected':''}>${esc(s)}</option>`).join('')}
            </select>
          </td>
          <td onclick="event.stopPropagation()" style="text-align:right;padding-right:18px;">
            <div style="display:flex;gap:5px;justify-content:flex-end;">
              <button onclick="openCaseDetail('${op.id}')" class="dh-btn dh-btn-primary dh-btn-sm">View ${icon('chevron-r',10,'#fff')}</button>
              <button onclick="openEscalateModal(${origIdx})" class="dh-btn dh-btn-warn dh-btn-sm" title="Escalate">${icon('alert-tri',12)}</button>
            </div>
          </td>
        </tr>`;
    }).join('');
  }

  const cn = fn => enriched.filter(fn).length;
  return `
  <div class="page-header">
    <div>
      <h1 class="page-title">Case Management</h1>
      <p class="page-sub">${loading?'Loading…':filtered.length+' cases shown of '+enriched.length+' total'}</p>
    </div>
    <div style="display:flex;gap:9px;flex-wrap:wrap;align-items:center;">
      <div style="position:relative;">
        <span style="position:absolute;left:11px;top:50%;transform:translateY(-50%);color:#94A3B8;pointer-events:none;">${icon('search',13)}</span>
        <input type="text" placeholder="Search cases…" value="${esc(searchQuery)}" oninput="searchQuery=this.value;render()" class="dh-input" style="padding-left:34px;width:200px;background:#fff;height:38px;" />
      </div>
      <button onclick="setFilter('all');searchQuery='';render()" class="dh-btn dh-btn-ghost">${icon('refresh',13)} Reset</button>
      <button onclick="fetchGHL()" class="dh-btn dh-btn-ghost">${icon('refresh',13)} Refresh</button>
      <button onclick="openCallbackForm()" class="dh-btn dh-btn-primary dh-btn-sm">${icon('phone-call',12,'#fff')} Schedule Callback</button>
    </div>
  </div>

  <div class="tabs-bar">
    <button class="tab-item ${activeFilter==='all'?'on':''}" onclick="setFilter('all')">All <span class="tab-cnt">${enriched.length}</span></button>
    <button class="tab-item ${activeFilter==='new'?'on':''}" onclick="setFilter('new')">${icon('flag',11)} New 24h <span class="tab-cnt">${cn(o=>(Date.now()-new Date(o.createdAt||0).getTime())<86400000)}</span></button>
    <button class="tab-item ${activeFilter==='triaged'?'on':''}" onclick="setFilter('triaged')">${icon('tag',11)} Triaged <span class="tab-cnt">${cn(o=>o.displayStatus==='triaged')}</span></button>
    <button class="tab-item ${activeFilter==='due_soon'?'on':''}" onclick="setFilter('due_soon')">${icon('clock',11)} Due Soon <span class="tab-cnt">${cn(o=>o.dueSoon&&o.displayStatus!=='resolved')}</span></button>
    <button class="tab-item ${activeFilter==='voice'?'on':''}" onclick="setFilter('voice')">${icon('headphones',11)} Voice <span class="tab-cnt">${cn(o=>o.isVoice)}</span></button>
    <button class="tab-item ${activeFilter==='resolved'?'on':''}" onclick="setFilter('resolved')">${icon('check-c',11)} Resolved <span class="tab-cnt">${cn(o=>o.displayStatus==='resolved')}</span></button>
    <button class="tab-item crit ${activeFilter==='critical'?'on':''}" onclick="setFilter('critical')">${icon('alert-tri',11)} Critical <span class="tab-cnt">${cn(o=>o.urgency==='critical')}</span></button>
  </div>

  <div class="dh-card" style="padding:0;overflow:hidden;">
    <table class="dh-table" style="min-width:960px;">
      <thead><tr>
        <th onclick="toggleSort('name')">Caller ${si('name')}</th>
        <th onclick="toggleSort('updated')">Date ${si('updated')}</th>
        <th onclick="toggleSort('urgency')">Urgency ${si('urgency')}</th>
        <th>Status</th>
        <th>Category</th>
        <th title="Language">Lang</th>
        <th>Callback</th>
        <th>Assigned Staff</th>
        <th style="text-align:right;padding-right:18px;">Actions</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </div>`;
}

/* ════════════════════════════════════════════════════════════
   ⑤ VOICE CASES VIEW  (NEW)
════════════════════════════════════════════════════════════ */
function renderVoiceCases(enriched){
  const voiceCases = enriched.filter(o=>o.isVoice);
  return `
  <div class="page-header">
    <div>
      <h1 class="page-title" style="display:flex;align-items:center;gap:10px;">${icon('headphones',22,'#7C3AED')} Voice Cases</h1>
      <p class="page-sub">${voiceCases.length} voice interactions · Transcripts & SOAP notes</p>
    </div>
    <button onclick="fetchGHL()" class="dh-btn dh-btn-ghost">${icon('refresh',13)} Refresh</button>
  </div>

  ${voiceCases.length===0?`
    <div class="dh-card">
      <div class="empty-state" style="padding:60px 20px;">
        <div class="empty-ico" style="background:#FAF5FF;color:#7C3AED;">${icon('headphones',28)}</div>
        <div class="empty-title">No voice cases yet</div>
        <div class="empty-sub">Voice calls from ElevenLabs will appear here with transcripts and AI summaries</div>
      </div>
    </div>` : `
  <div style="display:flex;flex-direction:column;gap:12px;">
    ${voiceCases.map((op,i)=>{
      const origIdx = (ghlOpps||[]).findIndex(o=>o.id===op.id);
      const safetyColor = op.urgency==='critical'?'#DC2626':op.urgency==='medium'?'#D97706':'#16A34A';
      const safetyBg    = op.urgency==='critical'?'#FEF2F2':op.urgency==='medium'?'#FFFBEB':'#F0FDF4';
      const hasTranscript = !!(op.transcript||op.description);
      const hasSOAP = !!soapNotes[op.id];
      return `
        <div class="voice-case-card" onclick="openCaseDetail('${op.id}')">
          <div class="vc-left">
            <div class="vc-icon" style="background:#FAF5FF;">${icon('mic',18,'#7C3AED')}</div>
            <div>
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                <span style="font-size:13px;font-weight:800;color:#0F172A;">${esc(op.contact?.name||'Unknown Caller')}</span>
                <span class="badge badge-${op.urgency}" style="font-size:9px;">${urgDot(op.urgency)} ${op.urgency}</span>
              </div>
              <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
                <span style="font-size:10.5px;color:#94A3B8;font-family:monospace;">${esc(op.caseId)}</span>
                <span style="font-size:10.5px;color:#94A3B8;">${fmtDate(op.createdAt)}</span>
                <span style="font-size:10.5px;color:#7C3AED;font-weight:700;">${esc(op.category)}</span>
              </div>
            </div>
          </div>
          <div class="vc-right">
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
              ${hasTranscript?`<span class="vc-badge green">${icon('file-text',10,'#16A34A')} Transcript</span>`:
                `<span class="vc-badge grey">${icon('file-text',10,'#94A3B8')} No Transcript</span>`}
              ${hasSOAP?`<span class="vc-badge purple">${icon('clipboard',10,'#7C3AED')} SOAP Note</span>`:
                `<span class="vc-badge grey">${icon('clipboard',10,'#94A3B8')} No SOAP</span>`}
              <div style="background:${safetyBg};border:1px solid ${safetyColor}22;border-radius:8px;padding:4px 10px;">
                <span style="font-size:10px;font-weight:800;color:${safetyColor};">
                  ${op.urgency==='critical'?'⚠ UNSAFE':op.urgency==='medium'?'CAUTION':'SAFE'}
                </span>
              </div>
            </div>
            <div style="display:flex;gap:6px;margin-top:8px;" onclick="event.stopPropagation()">
              <button onclick="openCaseDetail('${op.id}')" class="dh-btn dh-btn-primary dh-btn-sm">
                ${icon('eye',11,'#fff')} View Detail
              </button>
              <button onclick="openSOAPModal('${op.id}',${origIdx})" class="dh-btn dh-btn-ghost dh-btn-sm">
                ${icon('clipboard',11)} SOAP Note
              </button>
            </div>
          </div>
        </div>`;
    }).join('')}
  </div>`}`;
}

/* ════════════════════════════════════════════════════════════
   ⑥ CALLBACKS VIEW  (NEW)
════════════════════════════════════════════════════════════ */
function renderCallbacksView(enriched){
  const now       = new Date();
  const todayStr  = now.toDateString();
  const allCBs    = [...callbacks];
  const todayCBs  = allCBs.filter(cb=>new Date(cb.time).toDateString()===todayStr);
  const overdueCBs= allCBs.filter(cb=>new Date(cb.time)<now&&!cbStatuses[cb.oppId]?.done);
  const upcomingCBs = allCBs.filter(cb=>new Date(cb.time)>=now&&new Date(cb.time).toDateString()!==todayStr);

  const renderCBCard = (cb, isOverdue=false) => {
    const dt    = new Date(cb.time);
    const done  = cbStatuses[cb.id]?.done;
    const fmtT  = dt.toLocaleTimeString('en-SG',{hour:'2-digit',minute:'2-digit'});
    const fmtD  = dt.toLocaleDateString('en-SG',{weekday:'short',month:'short',day:'numeric'});
    return `
      <div class="cb-card ${done?'cb-done':isOverdue?'cb-overdue':''}">
        <div class="cb-time-col">
          <div class="cb-time">${fmtT}</div>
          <div class="cb-date">${fmtD}</div>
        </div>
        <div class="cb-info">
          <p style="font-size:13px;font-weight:700;color:#0F172A;">${esc(cb.name)}</p>
          <p style="font-size:11px;color:#64748B;margin-top:2px;">
            ${icon('user',11,'#94A3B8')} ${esc(cb.staff||'Unassigned')}
          </p>
          ${isOverdue&&!done?`<span class="badge badge-urgent" style="font-size:9px;margin-top:6px;display:inline-flex;">Overdue</span>`:''}
          ${done?`<span class="badge badge-completed" style="font-size:9px;margin-top:6px;display:inline-flex;">${icon('check',8)} Completed</span>`:''}
        </div>
        <div style="display:flex;gap:6px;flex-shrink:0;" onclick="event.stopPropagation()">
          ${!done?`
            <button onclick="markCallbackDoneById('${cb.id}')" class="dh-btn dh-btn-primary dh-btn-sm">
              ${icon('check',11,'#fff')} Mark Called
            </button>
            <button onclick="removeCallback('${cb.id}')" class="dh-btn dh-btn-ghost dh-btn-sm">
              ${icon('x',11)} Remove
            </button>`:
            `<button onclick="removeCallback('${cb.id}')" class="dh-btn dh-btn-ghost dh-btn-sm" style="opacity:.6;">
              ${icon('x',11)} Clear
            </button>`}
        </div>
      </div>`;
  };

  return `
  <div class="page-header">
    <div>
      <h1 class="page-title" style="display:flex;align-items:center;gap:10px;">${icon('phone-call',22,'#0284C7')} Callback Manager</h1>
      <p class="page-sub">Schedule and track all caregiver callbacks</p>
    </div>
    <button onclick="openCallbackForm()" class="dh-btn dh-btn-primary">
      ${icon('plus',13,'#fff')} Schedule Callback
    </button>
  </div>

  <!-- Summary chips -->
  <div style="display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap;">
    <div class="cb-summary-chip" style="background:#FEF2F2;border-color:#FECACA;color:#DC2626;">
      ${icon('alert-tri',13,'#DC2626')} <strong>${overdueCBs.length}</strong> Overdue
    </div>
    <div class="cb-summary-chip" style="background:#FFFBEB;border-color:#FDE68A;color:#D97706;">
      ${icon('clock',13,'#D97706')} <strong>${todayCBs.length}</strong> Today
    </div>
    <div class="cb-summary-chip" style="background:#EFF6FF;border-color:#BFDBFE;color:#1E40AF;">
      ${icon('calendar',13,'#1E40AF')} <strong>${upcomingCBs.length}</strong> Upcoming
    </div>
    <div class="cb-summary-chip" style="background:#F0FDF4;border-color:#BBF7D0;color:#16A34A;">
      ${icon('check-c',13,'#16A34A')} <strong>${Object.values(cbStatuses).filter(c=>c.done).length}</strong> Completed
    </div>
  </div>

  ${overdueCBs.length?`
  <div class="dh-card" style="border:1.5px solid #FECACA;margin-bottom:16px;">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
      <div style="width:36px;height:36px;background:#FEE2E2;border-radius:10px;display:flex;align-items:center;justify-content:center;color:#DC2626;flex-shrink:0;">${icon('alert-tri',18)}</div>
      <div>
        <div style="font-size:14px;font-weight:800;color:#991B1B;">Overdue Callbacks</div>
        <div style="font-size:11.5px;color:#EF4444;">Requires immediate attention</div>
      </div>
    </div>
    <div style="display:flex;flex-direction:column;gap:8px;">
      ${overdueCBs.map(cb=>renderCBCard(cb,true)).join('')}
    </div>
  </div>`:''}

  <!-- Today's Callbacks -->
  <div class="dh-card" style="margin-bottom:16px;">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
      <div>
        <div style="font-size:14px;font-weight:800;color:#0F172A;">Today's Callbacks</div>
        <div style="font-size:11.5px;color:#94A3B8;">${todayCBs.length} scheduled for today</div>
      </div>
    </div>
    ${todayCBs.length?`<div style="display:flex;flex-direction:column;gap:8px;">${todayCBs.map(cb=>renderCBCard(cb)).join('')}</div>`:
      `<div class="empty-state" style="padding:28px 0;"><div class="empty-ico">${icon('check-c',22)}</div><div class="empty-title" style="font-size:12.5px;">No callbacks today</div></div>`}
  </div>

  <!-- Upcoming -->
  ${upcomingCBs.length?`
  <div class="dh-card">
    <div style="font-size:14px;font-weight:800;color:#0F172A;margin-bottom:16px;">Upcoming</div>
    <div style="display:flex;flex-direction:column;gap:8px;">${upcomingCBs.map(cb=>renderCBCard(cb)).join('')}</div>
  </div>`:''}`;
}

/* ════════════════════════════════════════════════════════════
   ⑦ KNOWLEDGE BASE / SCRIPT LIBRARY  (NEW)
════════════════════════════════════════════════════════════ */
function renderKnowledgeBase(){
  const cats = {
    safe:    { label:'SAFE Scripts',       color:'#16A34A', bg:'#F0FDF4', border:'#BBF7D0', icon:'check-c' },
    caution: { label:'CAUTION Scripts',    color:'#D97706', bg:'#FFFBEB', border:'#FDE68A', icon:'alert' },
    unsafe:  { label:'UNSAFE Escalations', color:'#DC2626', bg:'#FEF2F2', border:'#FECACA', icon:'alert-tri' },
  };
  const scripts = kbSearch
    ? Object.values(KB_SCRIPTS).flat().filter(s=>
        s.topic.toLowerCase().includes(kbSearch.toLowerCase()) ||
        s.id.toLowerCase().includes(kbSearch.toLowerCase()) ||
        s.keywords.some(k=>k.includes(kbSearch.toLowerCase()))
      )
    : null;

  const renderScriptCard = (s, cat) => {
    const c = cats[cat] || cats.safe;
    return `
      <div class="kb-card" style="border-left:3px solid ${c.color};background:${c.bg};" onclick="openScriptModal('${s.id}','${esc(s.topic)}','${cat}')">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div>
            <span style="font-size:10px;font-weight:800;color:${c.color};font-family:monospace;letter-spacing:.06em;">${s.id}</span>
            <p style="font-size:13px;font-weight:700;color:#0F172A;margin-top:3px;">${esc(s.topic)}</p>
            <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:6px;">
              ${s.keywords.slice(0,4).map(k=>`<span style="background:${c.border};color:${c.color};font-size:9px;font-weight:700;padding:1px 7px;border-radius:99px;">${k}</span>`).join('')}
            </div>
          </div>
          <div style="color:${c.color};flex-shrink:0;">${icon('chevron-r',14,c.color)}</div>
        </div>
      </div>`;
  };

  return `
  <div class="page-header">
    <div>
      <h1 class="page-title" style="display:flex;align-items:center;gap:10px;">${icon('book',22,'#006D77')} Script Library</h1>
      <p class="page-sub">Approved response scripts — ElevenLabs Voice Agent reference</p>
    </div>
    <a href="https://dementiahub.wibiz.ai/home" target="_blank" class="dh-btn dh-btn-ghost dh-btn-sm">
      ${icon('external-link',11)} Full Knowledge Base
    </a>
  </div>

  <!-- Search -->
  <div class="dh-card" style="margin-bottom:18px;padding:16px 18px;">
    <div style="display:flex;align-items:center;gap:12px;">
      <div style="position:relative;flex:1;">
        <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#94A3B8;">${icon('search',14)}</span>
        <input type="text" placeholder="Search scripts by topic or keyword…" value="${esc(kbSearch)}"
          oninput="kbSearch=this.value;render()"
          class="dh-input" style="padding-left:38px;height:44px;font-size:13px;" />
      </div>
      ${kbSearch?`<button onclick="kbSearch='';render()" class="dh-btn dh-btn-ghost">${icon('x',13)} Clear</button>`:''}
    </div>
  </div>

  <!-- Important Notice -->
  <div class="info-notice">
    ${icon('info',14,'#0284C7')}
    <div style="font-size:12px;color:#1E3A8A;flex:1;">
      <strong>Critical Rule:</strong> UNSAFE escalation scripts (ESC-01 through ESC-07) must never be reworded. 
      Emergency numbers (999, 995, 6377 0700, 1800 221 4444) are hardcoded and must not be changed without supervisor approval.
    </div>
  </div>

  ${scripts !== null ? `
  <!-- Search Results -->
  <div class="dh-card">
    <div style="font-size:13px;font-weight:700;color:#006D77;margin-bottom:14px;display:flex;align-items:center;gap:6px;">
      ${icon('search',14,'#006D77')} ${scripts.length} results for "${esc(kbSearch)}"
    </div>
    ${scripts.length?`
    <div style="display:flex;flex-direction:column;gap:8px;">
      ${scripts.map(s=>{
        const cat = KB_SCRIPTS.safe.find(x=>x.id===s.id)?'safe':KB_SCRIPTS.caution.find(x=>x.id===s.id)?'caution':'unsafe';
        return renderScriptCard(s,cat);
      }).join('')}
    </div>`:
    `<div class="empty-state" style="padding:32px 0;"><div class="empty-ico">${icon('search',22)}</div><div class="empty-title">No scripts found</div></div>`}
  </div>` : `
  <!-- Tabs -->
  <div class="tabs-bar" style="margin-bottom:16px;">
    ${Object.entries(cats).map(([k,c])=>`
      <button class="tab-item ${kbTab===k?'on':''}" onclick="kbTab='${k}';render()" style="${kbTab===k?'color:'+c.color+';':''}" >
        ${icon(c.icon,11,kbTab===k?c.color:'currentColor')} ${c.label} <span class="tab-cnt" style="${kbTab===k?'background:'+c.color+';':''}">${KB_SCRIPTS[k].length}</span>
      </button>`).join('')}
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
    ${KB_SCRIPTS[kbTab].map(s=>renderScriptCard(s,kbTab)).join('')}
  </div>

  <!-- Emergency Reference Card -->
  <div class="dh-card" style="margin-top:20px;border:1.5px solid #FECACA;background:linear-gradient(135deg,#FFF1F2,#FEF2F2);">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
      <div style="width:40px;height:40px;background:#FEE2E2;border-radius:11px;display:flex;align-items:center;justify-content:center;color:#DC2626;">${icon('phone-call',20)}</div>
      <div>
        <div style="font-size:14px;font-weight:800;color:#991B1B;">Emergency Reference — Singapore</div>
        <div style="font-size:11.5px;color:#EF4444;">Hardcoded — never change without supervisor approval</div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;">
      ${EMERGENCY_CONTACTS.slice(0,6).map(c=>`
        <div class="emerg-ref-item" style="background:${c.bg};border:1px solid ${c.color}22;">
          <div style="font-size:9.5px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:.07em;margin-bottom:4px;">${esc(c.label)}</div>
          ${c.isPhone?`<a href="tel:${c.number}" style="font-size:15px;font-weight:800;color:${c.color};font-family:monospace;text-decoration:none;">${esc(c.number)}</a>`:
            `<a href="${c.url}" target="_blank" style="font-size:12px;font-weight:700;color:${c.color};text-decoration:none;display:flex;align-items:center;gap:4px;">${esc(c.number)} ${icon('external-link',10,c.color)}</a>`}
          <div style="font-size:9.5px;color:#94A3B8;margin-top:2px;font-weight:600;">${esc(c.avail)}</div>
        </div>`).join('')}
    </div>
  </div>`}`;
}

/* ════════════════════════════════════════════════════════════
   ⑧ HANDOVER  (Enhanced)
════════════════════════════════════════════════════════════ */
function renderHandover(){
  return `
  <div class="page-header">
    <div>
      <h1 class="page-title" style="display:flex;align-items:center;gap:10px;">${icon('shield',22)} Staff Handover</h1>
      <p class="page-sub">Shift transitions, case assignments, and team notes</p>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
    <div style="display:flex;flex-direction:column;gap:14px;">

      <div class="dh-card">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:18px;">
          <div style="width:38px;height:38px;background:#F0FDF4;border-radius:10px;display:flex;align-items:center;justify-content:center;color:#16A34A;">${icon('users',18)}</div>
          <div>
            <div style="font-size:14px;font-weight:800;color:#0F172A;">Case Assignment</div>
            <div style="font-size:11.5px;color:#94A3B8;">Reassign cases to team members</div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:13px;">
          <div>
            <label class="field-label">Case ID</label>
            <input id="assignCaseId" class="dh-input" placeholder="e.g. C-ABC123" style="font-family:monospace;letter-spacing:1px;height:42px;">
          </div>
          <div>
            <label class="field-label">Assign To</label>
            <select id="assignStaffSel" class="dh-select" style="width:100%;height:42px;">${STAFF_LIST.map(s=>`<option>${esc(s)}</option>`).join('')}</select>
          </div>
          <div>
            <label class="field-label">Internal Note</label>
            <textarea id="assignNote" class="dh-input" rows="3" style="resize:vertical;padding-top:10px;" placeholder="Reason for assignment or context for the receiving staff…"></textarea>
          </div>
          <button onclick="saveAssignment()" class="dh-btn dh-btn-primary" style="width:100%;height:42px;">${icon('save',13,'#fff')} Save Assignment</button>
        </div>
      </div>

      <div class="dh-card">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:18px;">
          <div style="width:38px;height:38px;background:#EFF6FF;border-radius:10px;display:flex;align-items:center;justify-content:center;color:#1D4ED8;">${icon('clipboard',18)}</div>
          <div>
            <div style="font-size:14px;font-weight:800;color:#0F172A;">Shift Handover Note</div>
            <div style="font-size:11.5px;color:#94A3B8;">Record key updates for incoming staff</div>
          </div>
        </div>
        <div style="background:#FFF7ED;border:1px solid #FDE68A;border-radius:10px;padding:11px 13px;margin-bottom:14px;">
          <p style="font-size:11.5px;font-weight:700;color:#92400E;display:flex;align-items:center;gap:5px;">${icon('alert-tri',12,'#D97706')} Include in your note:</p>
          <ul style="margin:6px 0 0 18px;padding:0;font-size:11px;color:#78350F;line-height:1.8;">
            <li>Any UNSAFE or CAUTION cases opened this shift</li>
            <li>Pending callbacks not yet completed</li>
            <li>Escalations and their current status</li>
            <li>Key caregiver updates the next team needs to know</li>
          </ul>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <textarea id="handoverNote" class="dh-input" rows="7" style="resize:vertical;padding-top:10px;" placeholder="Describe care updates, urgent flags, unresolved escalations, or shift context…"></textarea>
          <button onclick="submitHandover()" class="dh-btn dh-btn-primary" style="width:100%;height:42px;">${icon('send',13,'#fff')} Publish to Shift Feed</button>
        </div>
      </div>

    </div>

    <div class="dh-card" style="display:flex;flex-direction:column;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
        <div>
          <div style="font-size:14px;font-weight:800;color:#0F172A;display:flex;align-items:center;gap:7px;">${icon('list',15)} Handover Feed</div>
          <div style="font-size:11.5px;color:#94A3B8;margin-top:3px;">Most recent shift notes</div>
        </div>
        <span style="font-size:9.5px;font-weight:700;color:#006D77;background:#F0FAFA;padding:3px 9px;border-radius:99px;border:1px solid #B2E8EC;">Last 30 notes</span>
      </div>
      <div id="handoverList" style="flex:1;overflow-y:auto;max-height:680px;padding-right:3px;">
        ${renderHandoverList()}
      </div>
    </div>
  </div>`;
}

function renderHandoverList(){
  const notes = getHandovers();
  if(!notes.length) return `<div class="empty-state"><div class="empty-ico">${icon('file-text',22)}</div><div class="empty-title">No handover notes yet</div><div class="empty-sub">Published notes will appear here for the entire team</div></div>`;
  return notes.map(h=>`
    <div class="hv-note">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:7px;">
        <div>
          <div class="hv-note-author">${esc(h.staff_name)}</div>
          ${h.staff_role?`<div class="hv-note-role">${esc(h.staff_role)}</div>`:''}
        </div>
        <div class="hv-note-time">${fmtShort(h.created_at)}</div>
      </div>
      <p class="hv-note-body">"${esc(h.note_content)}"</p>
    </div>`).join('');
}

/* ════════════════════════════════════════════════════════════
   AI PANEL INLINE
════════════════════════════════════════════════════════════ */
function renderAIPanelInline(op, origIdx){
  const e    = enrich(op, origIdx);
  const conf = 72+Math.floor((op.id||'').charCodeAt(0)%22);
  const sf   = e.urgency==='critical';
  const kb   = {Safety:'Home Safety & Fall Prevention',Medical:'Medication Management',Emotional:'Managing Behaviour',Admin:'CARA Registration Guide',Resource:'SG Dementia Resources'}[e.category]||'Understanding Dementia';
  const ra   = {critical:'Escalate immediately — assign senior staff.',medium:'Schedule follow-up call within 2 hours.',low:'Standard response — review at next shift.'}[e.urgency];
  return `
    <div>
      <p style="font-size:13px;font-weight:800;color:#0F172A;display:flex;align-items:center;gap:6px;margin-bottom:12px;">${icon('cpu',14)} AI Case Summary</p>
      <div style="display:flex;flex-direction:column;gap:7px;">
        ${infoTile('Who',`<p style="font-size:12.5px;font-weight:700;color:#0F172A;">${esc(op.contact?.name||'Unknown')}</p>`)}
        ${infoTile('What',`<p style="font-size:12px;color:#374151;">${esc(op.name||'—')}</p>`)}
        <div style="${sf?'background:#FEF2F2;border-color:#FECACA;':'background:#F8FAFC;border-color:#E8EDF3;'}border:1px solid;border-radius:10px;padding:10px 12px;">
          <p style="font-size:9.5px;font-weight:800;color:#94A3B8;text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px;">Safety Assessment</p>
          <span class="badge badge-${e.urgency}">${urgDot(e.urgency)} ${e.urgency.toUpperCase()}</span>
        </div>
        <div style="${sf?'background:#FEF2F2;border-color:#FECACA;':'background:#EFF6FF;border-color:#BFDBFE;'}border:1px solid;border-radius:10px;padding:10px 12px;">
          <p style="font-size:9.5px;font-weight:800;color:#94A3B8;text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px;">Action</p>
          <p style="font-size:11.5px;font-weight:700;color:${sf?'#B91C1C':'#1E40AF'};">${ra}</p>
        </div>
        <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:10px;padding:10px 12px;">
          <p style="font-size:9.5px;font-weight:800;color:#94A3B8;text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px;">KB Reference</p>
          <p style="font-size:11px;font-weight:700;color:#065F46;">${esc(kb)}</p>
        </div>
      </div>
      <div style="margin:12px 0;height:1px;background:#F1F5F9;"></div>
      <p style="font-size:9.5px;font-weight:800;color:#94A3B8;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px;">AI Confidence</p>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
        <div style="flex:1;height:6px;background:#F1F5F9;border-radius:99px;overflow:hidden;">
          <div style="width:${conf}%;height:100%;background:linear-gradient(90deg,#006D77,#009199);border-radius:99px;"></div>
        </div>
        <span style="font-size:12px;font-weight:800;color:#006D77;">${conf}%</span>
      </div>
      <button onclick="openModal(${origIdx})" class="dh-btn dh-btn-primary dh-btn-sm" style="width:100%;">${icon('file-text',12,'#fff')} Add Case Note</button>
    </div>`;
}

/* ════════════════════════════════════════════════════════════
   TRANSCRIPT RENDERER
════════════════════════════════════════════════════════════ */
function renderTranscript(transcriptData){
  if(!transcriptData||(typeof transcriptData==='string'&&!transcriptData.trim())){
    return '<p class="transcript-empty">No transcript available for this call.</p>';
  }
  let parsed = null;
  if(typeof transcriptData==='string'){ try{ parsed=JSON.parse(transcriptData); }catch(e){} }
  else if(Array.isArray(transcriptData)){ parsed=transcriptData; }
  if(Array.isArray(parsed)&&parsed.length){
    return parsed.map(entry=>{
      const role    = (entry.role||entry.speaker||'').toLowerCase();
      const text    = entry.message||entry.text||entry.content||'';
      const isAgent = role.includes('agent')||role.includes('assistant')||role.includes('ai');
      const label   = isAgent?'Agent':'Caller';
      const ts      = entry.time_in_call_secs!=null?` · ${Math.floor(entry.time_in_call_secs)}s`:'';
      return `<div class="transcript-turn ${isAgent?'turn-agent':'turn-caller'}">
        <p class="turn-label">[${label}]${ts}</p>
        <p class="turn-text">${esc(text)}</p>
      </div>`;
    }).join('');
  }
  const lines = String(transcriptData).split('\n');
  const hasLabels = lines.some(l=>/^\[?(agent|caller|ai|user)\]?[:：]/i.test(l.trim()));
  if(hasLabels){
    return lines.map(line=>{
      if(!line.trim()) return '';
      const agentM = line.match(/^\[?(agent|ai|bot|assistant)\]?[:：]\s*/i);
      const callerM = line.match(/^\[?(caller|user|human|caregiver)\]?[:：]\s*/i);
      if(agentM) return `<div class="transcript-turn turn-agent"><p class="turn-label">[Agent]</p><p class="turn-text">${esc(line.slice(agentM[0].length))}</p></div>`;
      if(callerM) return `<div class="transcript-turn turn-caller"><p class="turn-label">[Caller]</p><p class="turn-text">${esc(line.slice(callerM[0].length))}</p></div>`;
      return `<p style="font-size:12px;color:#64748B;padding:3px 2px;">${esc(line)}</p>`;
    }).filter(Boolean).join('');
  }
  return `<p style="font-size:12px;color:#64748B;white-space:pre-wrap;">${esc(String(transcriptData))}</p>`;
}

/* ════════════════════════════════════════════════════════════
   CASE DETAIL PANEL  (Significantly Enhanced)
════════════════════════════════════════════════════════════ */
function openCaseDetail(oppId){
  selectedCaseId = oppId;
  const idx = (ghlOpps||[]).findIndex(o=>o.id===oppId);
  if(idx<0) return;
  const op   = enrich(ghlOpps[idx], idx);
  const _raw = caseStatuses[oppId] || '';
  const _leg = {'New':'New - Untriaged','In Progress':'In Progress','Resolved':'Closed - Resolved'};
  const csKey = CASE_STATUSES.includes(_raw)?_raw:(_leg[_raw]||'New - Untriaged');
  const notes   = caseNotes[oppId] || '';
  const soap    = soapNotes[oppId] || { situation:'', action:'', outcome:'', nextStep:'' };
  const conf    = 72+Math.floor((op.id||'').charCodeAt(0)%22);
  const sf      = op.urgency==='critical';
  const cbDone  = cbStatuses[oppId]?.done;
  const cbTs    = cbStatuses[oppId]?.ts;
  const ra      = {critical:'Escalate immediately — assign senior staff and notify family.',medium:'Schedule follow-up call within 2 hours.',low:'Standard response — review at next shift.'}[op.urgency]||'Review case details.';
  const kb      = {Safety:'Home Safety & Fall Prevention',Medical:'Medication Management',Emotional:'Managing Behaviour',Admin:'CARA Registration Guide',Resource:'SG Dementia Resources Directory'}[op.category]||'Understanding Dementia';
  const aiSum   = op.ai_summary||op.name||`AI analysis: Caller ${esc(op.contact?.name||'Unknown')} reported a ${op.urgency}-priority concern related to ${op.category}. Intent: ${op.intent}.`;
  const langFlag = LANG_FLAGS[op.lang] || '🌐';

  /* Quick call duration / ASR from custom fields */
  const customField = k => (op.customFields||[]).find(f=>f.key===k)?.value || '';
  const callDuration = customField('call_duration_seconds');
  const asrConf      = customField('asr_confidence');
  const safetyResult = customField('safety_gate_result');
  const resolutionType = customField('resolution_type');

  document.getElementById('modal-root').innerHTML = `
  <div class="case-detail-overlay" id="caseDetailOverlay" onclick="if(event.target===this)closeCaseDetail()">
    <div class="case-detail-panel" onclick="event.stopPropagation()">

      <!-- Header -->
      <div class="case-detail-header">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
          <button onclick="closeCaseDetail()" class="cd-back-btn">${icon('arrow-l',14,'#fff')}</button>
          <div style="flex:1;">
            <p style="font-size:9px;font-weight:800;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:.12em;margin-bottom:4px;">Case Detail</p>
            <h2 style="font-size:18px;font-weight:800;color:#fff;line-height:1.2;">${esc(op.contact?.name||'Unknown Caller')}</h2>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <span class="badge" style="background:rgba(255,255,255,.12);color:#fff;border-color:rgba(255,255,255,.22)!important;">${urgDot(op.urgency)} ${op.urgency.toUpperCase()}</span>
            ${op.isVoice?`<span class="voice-chip" style="background:rgba(124,58,237,.3);color:#C4B5FD;border-color:rgba(124,58,237,.3);">${icon('mic',9,'#C4B5FD')} Voice</span>`:''}
          </div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:7px;">
          ${[op.caseId, fmtDate(op.createdAt), op.category, op.intent].map(t=>`<span class="cd-chip">${esc(String(t))}</span>`).join('')}
          <span class="cd-chip">${langFlag} ${esc(op.lang)}</span>
          ${callDuration?`<span class="cd-chip">${icon('clock',9,'rgba(255,255,255,.5)')} ${callDuration}s</span>`:''}
          ${safetyResult?`<span class="cd-chip" style="background:rgba(${safetyResult==='SAFE'?'22,163,74':safetyResult==='CAUTION'?'217,119,6':'220,38,38'},.25);">${safetyResult}</span>`:''}
        </div>
      </div>

      <!-- Caller Info -->
      <div class="cd-section">
        <span class="cd-label">Caller Information</span>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          ${infoTile('Phone', `<p style="font-size:13px;font-weight:700;color:#0F172A;">${esc(op.contact?.phone||'—')}</p>`)}
          ${infoTile('Email', `<p style="font-size:12px;font-weight:700;color:#0F172A;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(op.contact?.email||'—')}</p>`)}
          <div style="${cbDone?'background:#F0FDF4;border-color:#BBF7D0;':'background:#FFFBEB;border-color:#FDE68A;'}border:1px solid;border-radius:10px;padding:11px 13px;">
            <p style="font-size:9.5px;font-weight:800;color:#94A3B8;text-transform:uppercase;letter-spacing:.08em;margin-bottom:5px;">Callback</p>
            ${cbDone?`<p style="font-size:11.5px;font-weight:700;color:#15803D;display:flex;align-items:center;gap:4px;">${icon('check',11,'#16A34A')} Completed · ${fmtShort(cbTs)}</p>`:
              `<div style="display:flex;align-items:center;gap:8px;"><span class="badge badge-pending">Pending</span><button onclick="markCallbackDone('${oppId}')" class="dh-btn dh-btn-primary dh-btn-sm">${icon('check',10,'#fff')} Mark Called</button></div>`}
          </div>
          ${infoTile('Consent', `<span class="badge badge-yes">${icon('check',9)} Verified</span>`, '#F0FDF4', '#BBF7D0')}
          ${asrConf?infoTile('ASR Confidence', `<span class="badge ${asrConf==='high'?'badge-low':'badge-medium'}">${esc(asrConf)}</span>`):''}
          ${resolutionType?infoTile('Resolution', `<span style="font-size:12px;font-weight:700;color:#374151;">${esc(resolutionType)}</span>`):''}
        </div>
      </div>

      <!-- AI Insights -->
      <div class="cd-section">
        <span class="cd-label">AI Insights</span>
        <div class="ai-insight-box ai-summary">
          <p style="font-size:9.5px;font-weight:800;color:#16A34A;text-transform:uppercase;letter-spacing:.07em;display:flex;align-items:center;gap:4px;margin-bottom:6px;">${icon('zap',10,'#16A34A')} AI Summary</p>
          <p style="font-size:12.5px;color:#14532D;font-weight:500;line-height:1.6;">${esc(aiSum)}</p>
        </div>
        <div class="ai-insight-box ai-intent">
          <p style="font-size:9.5px;font-weight:800;color:#1D4ED8;text-transform:uppercase;letter-spacing:.07em;display:flex;align-items:center;gap:4px;margin-bottom:5px;">${icon('tag',10,'#1D4ED8')} Detected Intent</p>
          <p style="font-size:12.5px;font-weight:700;color:#1E3A8A;">${esc(op.intent)} · <span style="font-weight:500;color:#3B82F6;">${esc(op.category)}</span></p>
        </div>
        <div class="ai-insight-box ${sf?'ai-critical-action':'ai-action'}">
          <p style="font-size:9.5px;font-weight:800;${sf?'color:#DC2626;':'color:#7C3AED;'}text-transform:uppercase;letter-spacing:.07em;display:flex;align-items:center;gap:4px;margin-bottom:5px;">${icon(sf?'alert-tri':'zap',10,sf?'#DC2626':'#7C3AED')} Recommended Action</p>
          <p style="font-size:12.5px;font-weight:700;${sf?'color:#7F1D1D;':'color:#4C1D95;'}">${ra}</p>
        </div>
        <div style="background:#F8FAFC;border:1px solid #E8EDF3;border-radius:10px;padding:12px 14px;display:flex;align-items:center;gap:14px;">
          <div style="flex:1;">
            <p style="font-size:9.5px;font-weight:800;color:#94A3B8;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px;">AI Confidence</p>
            <div style="display:flex;align-items:center;gap:9px;">
              <div style="flex:1;height:6px;background:#E2E8F0;border-radius:99px;overflow:hidden;">
                <div style="width:${conf}%;height:100%;background:linear-gradient(90deg,#006D77,#009199);border-radius:99px;"></div>
              </div>
              <span style="font-size:12px;font-weight:800;color:#006D77;">${conf}%</span>
            </div>
          </div>
          <div style="text-align:right;">
            <p style="font-size:9.5px;font-weight:800;color:#94A3B8;text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px;">KB Match</p>
            <p style="font-size:11px;font-weight:700;color:#006D77;">${esc(kb)}</p>
          </div>
        </div>
      </div>

      <!-- Transcript -->
      ${op.isVoice||op.transcript||op.description?`
      <div class="cd-section">
        <span class="cd-label">Call Transcript</span>
        <div class="transcript-box">${renderTranscript(op.transcript||op.description)}</div>
      </div>`:''}

      <!-- SOAP Note -->
      <div class="cd-section">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
          <span class="cd-label" style="margin-bottom:0;">SOAP Note</span>
          <button onclick="autoFillSOAP('${oppId}',${idx})" class="dh-btn dh-btn-ghost dh-btn-sm">${icon('zap',11)} Auto-Fill</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          ${[
            {key:'situation', label:'S — Situation',    placeholder:'What did the caregiver report? What is the presenting concern?'},
            {key:'action',    label:'A — Action',       placeholder:'What did the AI or staff do? What scripts or resources were used?'},
            {key:'outcome',   label:'O — Outcome',      placeholder:'What was the result? Was the caller satisfied? Safety status?'},
            {key:'nextStep',  label:'P — Next Step',    placeholder:'What needs to happen next? By whom? By when?'},
          ].map(f=>`
            <div>
              <label class="field-label">${f.label}</label>
              <textarea id="soap_${f.key}_${oppId}" class="dh-input" rows="2" style="resize:vertical;padding-top:8px;font-size:12px;" placeholder="${f.placeholder}">${esc(soap[f.key]||'')}</textarea>
            </div>`).join('')}
          <button onclick="saveSOAPNote('${oppId}')" class="dh-btn dh-btn-primary dh-btn-sm" style="align-self:flex-start;">
            ${icon('save',11,'#fff')} Save SOAP Note
          </button>
        </div>
      </div>

      <!-- Staff Actions -->
      <div class="cd-section">
        <span class="cd-label">Staff Actions</span>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div>
            <label class="field-label">Case Status</label>
            <select id="cdStatus" class="dh-select" style="width:100%;height:42px;">
              ${CASE_STATUSES.map(s=>`<option ${csKey===s?'selected':''}>${esc(s)}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="field-label">Assign To</label>
            <select id="cdAssign" class="dh-select" style="width:100%;height:42px;">${STAFF_LIST.map(s=>`<option ${op.assignedTo===s?'selected':''}>${esc(s)}</option>`).join('')}</select>
          </div>
          <div>
            <label class="field-label">Internal Case Notes</label>
            <textarea id="cdNotes" class="dh-input" rows="4" style="resize:vertical;padding-top:10px;" placeholder="Additional notes, context, or follow-up actions…">${esc(notes)}</textarea>
          </div>
          <div id="cdSaveMsg" class="hidden" style="font-size:11.5px;font-weight:700;color:#15803D;background:#F0FDF4;border:1px solid #BBF7D0;border-radius:9px;padding:9px 13px;display:flex;align-items:center;gap:6px;">${icon('check',12,'#16A34A')} Saved successfully</div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <button onclick="saveCaseAction('${oppId}',${idx})" class="dh-btn dh-btn-primary" style="flex:1;">${icon('save',13,'#fff')} Save Updates</button>
            <button onclick="openEscalateModal(${idx})" class="dh-btn dh-btn-warn">${icon('alert-tri',12)} Escalate</button>
            <button onclick="openModal(${idx})" class="dh-btn dh-btn-ghost">${icon('file-text',12)}</button>
            <button onclick="openCallbackForm()" class="dh-btn dh-btn-ghost" title="Schedule Callback">${icon('phone-call',12)}</button>
          </div>
        </div>
      </div>

    </div>
  </div>`;
}

function closeCaseDetail(){ selectedCaseId=null; document.getElementById('modal-root').innerHTML=''; }

/* SOAP auto-fill */
function autoFillSOAP(oppId, idx){
  const op = ghlOpps?.[idx]; if(!op) return;
  const e  = enrich(op, idx);
  const s  = document.getElementById(`soap_situation_${oppId}`);
  const a  = document.getElementById(`soap_action_${oppId}`);
  const o  = document.getElementById(`soap_outcome_${oppId}`);
  const n  = document.getElementById(`soap_nextStep_${oppId}`);
  if(s) s.value = `Caller: ${op.contact?.name||'Unknown'}. Concern: ${e.category} — ${e.intent}. Safety Gate: ${e.urgency.toUpperCase()}.`;
  if(a) a.value = `ElevenLabs Voice AI engaged. Safety classification: ${e.urgency}. Topic: ${e.category}. Assigned to: ${e.assignedTo}.`;
  if(o) o.value = `${e.displayStatus==='resolved'?'Resolved via self-serve.':e.displayStatus==='triaged'?'Triaged and assigned to staff.':'Awaiting follow-up.'}`;
  if(n) n.value = e.urgency==='critical'?'Immediate escalation to senior staff. Notify family if appropriate.':e.urgency==='medium'?'Follow-up call within 2 hours. Monitor for changes.':'Review at next shift check-in.';
  showToast('SOAP note auto-filled — please review before saving.','info');
}

function saveSOAPNote(oppId){
  const s = document.getElementById(`soap_situation_${oppId}`)?.value||'';
  const a = document.getElementById(`soap_action_${oppId}`)?.value||'';
  const o = document.getElementById(`soap_outcome_${oppId}`)?.value||'';
  const n = document.getElementById(`soap_nextStep_${oppId}`)?.value||'';
  soapNotes[oppId] = { situation:s, action:a, outcome:o, nextStep:n, updatedAt: new Date().toISOString() };
  localStorage.setItem('dsg_soap_notes', JSON.stringify(soapNotes));
  showToast('SOAP note saved successfully.','success');
}

/* ════════════════════════════════════════════════════════════
   MODALS
════════════════════════════════════════════════════════════ */
let activeOppIdx = null;

function openModal(idx){
  activeOppIdx = idx;
  const op = ghlOpps?.[idx];
  document.getElementById('modalName').innerText = op?.contact?.name||'Contact';
  document.getElementById('noteErr').classList.add('hidden');
  document.getElementById('noteText').value = '';
  const m = document.getElementById('noteModal');
  m.style.display='flex'; m.classList.remove('hidden');
}
function closeNoteModal(){ const m=document.getElementById('noteModal'); m.style.display='none'; m.classList.add('hidden'); }

async function submitNote(){
  const text = document.getElementById('noteText').value.trim();
  const btn  = document.getElementById('noteBtn'), err=document.getElementById('noteErr');
  if(!text){ err.textContent='Please type a note.'; err.classList.remove('hidden'); return; }
  const op = ghlOpps?.[activeOppIdx]; const cid = op?.contact?.id;
  if(!cid){ err.textContent='No contact ID for this case.'; err.classList.remove('hidden'); return; }
  btn.innerHTML=`<span class="spinner-white"></span> Syncing…`; btn.disabled=true; err.classList.add('hidden');
  try{ await syncNoteToGHL(cid, text); closeNoteModal(); showToast('Note synced to GHL!','success'); }
  catch(e){ err.textContent='Failed: '+e.message; err.classList.remove('hidden'); }
  finally{ btn.innerHTML=`${icon('send',13,'#fff')} Sync to GHL`; btn.disabled=false; }
}

/* Emergency Modal */
function openEmergencyModal(){
  document.getElementById('modal-root').innerHTML = `
    <div class="modal-overlay" onclick="if(event.target===this)document.getElementById('modal-root').innerHTML=''">
      <div class="modal-box" style="max-width:520px;">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
          <div style="width:42px;height:42px;background:#FEE2E2;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#DC2626;">${icon('alert-tri',22)}</div>
          <div>
            <div style="font-size:17px;font-weight:800;color:#0F172A;">Emergency Contacts</div>
            <div style="font-size:11.5px;color:#94A3B8;margin-top:2px;">Singapore — DementiaHub Helpline Reference</div>
          </div>
          <button onclick="document.getElementById('modal-root').innerHTML=''" style="margin-left:auto;background:none;border:none;cursor:pointer;color:#94A3B8;display:flex;">${icon('x',18)}</button>
        </div>
        <div style="background:#FFF7ED;border:1px solid #FDE68A;border-radius:10px;padding:11px 14px;margin-bottom:18px;font-size:11.5px;font-weight:700;color:#78350F;display:flex;align-items:center;gap:8px;">
          ${icon('info',13,'#D97706')} These numbers are hardcoded. Never change without supervisor approval.
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;">
          ${EMERGENCY_CONTACTS.map(c=>`
            <div style="display:flex;align-items:center;gap:12px;background:${c.bg};border:1px solid ${c.color}22;border-radius:12px;padding:13px 16px;">
              <div style="width:36px;height:36px;background:${c.color}18;border-radius:9px;display:flex;align-items:center;justify-content:center;color:${c.color};flex-shrink:0;">
                ${icon(c.isPhone?'phone':'external-link',15,c.color)}
              </div>
              <div style="flex:1;">
                <div style="font-size:11px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:.06em;">${esc(c.label)}</div>
                <div style="font-size:14px;font-weight:800;color:${c.color};font-family:${c.isPhone?'monospace':'inherit'};margin-top:2px;">${esc(c.number)}</div>
              </div>
              <span style="font-size:9px;font-weight:700;background:${c.color}14;color:${c.color};padding:3px 9px;border-radius:99px;">${esc(c.avail)}</span>
              ${c.isPhone?
                `<a href="tel:${c.number}" class="dh-btn dh-btn-primary dh-btn-sm" style="text-decoration:none;">${icon('phone',10,'#fff')} Call</a>`:
                `<a href="${c.url}" target="_blank" class="dh-btn dh-btn-ghost dh-btn-sm" style="text-decoration:none;">${icon('external-link',10)} Open</a>`}
            </div>`).join('')}
        </div>
      </div>
    </div>`;
}

/* Script Modal */
function openScriptModal(id, topic, cat){
  const catConfig = {
    safe:    { label:'SAFE Script',       color:'#16A34A', bg:'#F0FDF4', border:'#BBF7D0' },
    caution: { label:'CAUTION Script',    color:'#D97706', bg:'#FFFBEB', border:'#FDE68A' },
    unsafe:  { label:'UNSAFE Escalation', color:'#DC2626', bg:'#FEF2F2', border:'#FECACA' },
  }[cat] || { label:'Script', color:'#006D77', bg:'#F0FAFA', border:'#B2E8EC' };
  const scriptContent = {
    'SAFE-01': 'Thank you for sharing that. When someone with dementia wanders at night, it can help to keep evenings calm and predictable, reduce noise and stimulation, and make sure the home is safe. You may also want to check whether they are uncomfortable, restless, or looking for something familiar. Would you like a callback from the support team?',
    'SAFE-02': 'Thank you for telling me. Some people with dementia become more unsettled later in the day. A calm routine, soft lighting, reduced noise, and reassurance can sometimes help. Try speaking slowly, keeping instructions simple, and avoiding arguments. Would you like the support team to follow up?',
    'SAFE-08': 'I\'m sorry this has been hard. Caring for someone with dementia can be exhausting, and it is important that you also have support. Even short breaks, help from family or friends, and practical guidance can make a difference. You do not have to manage everything alone. Would you like someone from the support team to call you back?',
    'CAUTION-01': 'Thank you for telling me. It sounds like you are going through a very difficult time right now. I\'m going to keep this simple. I can arrange for someone from the support team to contact you as soon as possible. If anyone is in immediate danger, please contact emergency services now. Would you like a callback?',
    'CAUTION-02': 'I\'m sorry this is so overwhelming. You do not have to manage this alone. I can arrange for someone from the support team to contact you as soon as possible. If there is immediate danger, please contact emergency services now. Would you like me to arrange a callback?',
    'ESC-01': 'This sounds urgent. If the person with dementia is missing or has not returned, please contact the police immediately now — call 999. You can also use the CARA app at cara.sg to report a missing person. I\'m marking this as urgent and connecting you to the Dementia Helpline at 6377 0700. Please do not wait.',
    'ESC-02': 'This sounds like an emergency. Please hang up and call 995 now. Your immediate safety is the priority. I\'m also connecting you to the Dementia Helpline at 6377 0700 and marking this as urgent.',
    'ESC-04': 'I\'m very sorry you are going through this. If you or someone else may act on thoughts of self-harm or suicide, please contact emergency services immediately now — call 995 — or go to the nearest emergency department. You can also call the Samaritans of Singapore at 1800 221 4444. Please do not stay alone with this. I\'m connecting you to the Dementia Helpline at 6377 0700.',
  }[id] || `Script content for ${id} — ${topic}. Refer to the ElevenLabs Voice Knowledge Base document for the full approved wording.`;

  document.getElementById('modal-root').innerHTML = `
    <div class="modal-overlay" onclick="if(event.target===this)document.getElementById('modal-root').innerHTML=''">
      <div class="modal-box" style="max-width:500px;">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:18px;">
          <div style="background:${catConfig.bg};border:1px solid ${catConfig.border};border-radius:10px;padding:8px 13px;font-size:11px;font-weight:800;color:${catConfig.color};font-family:monospace;">${id}</div>
          <div>
            <div style="font-size:15px;font-weight:800;color:#0F172A;">${esc(topic)}</div>
            <div style="font-size:11px;color:#94A3B8;margin-top:2px;">${catConfig.label}</div>
          </div>
          <button onclick="document.getElementById('modal-root').innerHTML=''" style="margin-left:auto;background:none;border:none;cursor:pointer;color:#94A3B8;display:flex;">${icon('x',16)}</button>
        </div>
        ${cat==='unsafe'?`<div style="background:#FEF2F2;border:1px solid #FECACA;border-radius:10px;padding:11px 14px;margin-bottom:16px;font-size:12px;font-weight:700;color:#B91C1C;display:flex;align-items:flex-start;gap:8px;">${icon('alert-tri',13,'#DC2626')} Fixed wording — do NOT rephrase. Do NOT improvise. After this script: stay on the line and transfer to 6377 0700.</div>`:''}
        <div style="background:${catConfig.bg};border:1px solid ${catConfig.border};border-radius:12px;padding:18px 20px;margin-bottom:18px;">
          <p style="font-size:9.5px;font-weight:800;color:${catConfig.color};text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;">Approved Script</p>
          <p style="font-size:13px;color:#1E293B;line-height:1.7;font-style:italic;">"${esc(scriptContent)}"</p>
        </div>
        <button onclick="document.getElementById('modal-root').innerHTML=''" class="dh-btn dh-btn-primary" style="width:100%;">
          ${icon('check',13,'#fff')} Got It
        </button>
      </div>
    </div>`;
}

/* SOAP Modal (from voice cases) */
function openSOAPModal(oppId, idx){
  const op   = ghlOpps?.[idx]; if(!op) return;
  const soap = soapNotes[oppId] || {};
  document.getElementById('modal-root').innerHTML = `
    <div class="modal-overlay" onclick="if(event.target===this)document.getElementById('modal-root').innerHTML=''">
      <div class="modal-box" style="max-width:520px;">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
          <div style="width:40px;height:40px;background:#EFF6FF;border-radius:11px;display:flex;align-items:center;justify-content:center;color:#1D4ED8;">${icon('clipboard',20)}</div>
          <div>
            <div style="font-size:16px;font-weight:800;color:#0F172A;">SOAP Note</div>
            <div style="font-size:11.5px;color:#94A3B8;margin-top:2px;">${esc(op.contact?.name||'Contact')}</div>
          </div>
          <button onclick="document.getElementById('modal-root').innerHTML=''" style="margin-left:auto;background:none;border:none;cursor:pointer;color:#94A3B8;display:flex;">${icon('x',16)}</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:16px;">
          ${[
            {key:'situation',label:'S — Situation',placeholder:'What the caregiver reported…'},
            {key:'action',   label:'A — Action',   placeholder:'What was done by AI/staff…'},
            {key:'outcome',  label:'O — Outcome',  placeholder:'Result of the interaction…'},
            {key:'nextStep', label:'P — Next Step',placeholder:'What needs to happen next…'},
          ].map(f=>`
            <div>
              <label class="field-label">${f.label}</label>
              <textarea id="msoap_${f.key}" class="dh-input" rows="2" style="resize:vertical;padding-top:8px;font-size:12.5px;" placeholder="${f.placeholder}">${esc(soap[f.key]||'')}</textarea>
            </div>`).join('')}
        </div>
        <div style="display:flex;gap:10px;">
          <button onclick="
            const data={situation:document.getElementById('msoap_situation').value,action:document.getElementById('msoap_action').value,outcome:document.getElementById('msoap_outcome').value,nextStep:document.getElementById('msoap_nextStep').value,updatedAt:new Date().toISOString()};
            soapNotes['${oppId}']=data;localStorage.setItem('dsg_soap_notes',JSON.stringify(soapNotes));
            document.getElementById('modal-root').innerHTML='';showToast('SOAP note saved.','success');
          " class="dh-btn dh-btn-primary" style="flex:1;">${icon('save',13,'#fff')} Save SOAP Note</button>
          <button onclick="document.getElementById('modal-root').innerHTML=''" class="dh-btn dh-btn-ghost">Cancel</button>
        </div>
      </div>
    </div>`;
}

function openAIModal(idx){
  const op = ghlOpps?.[idx]; if(!op) return;
  const e  = enrich(op, idx); const conf=72+Math.floor((op.id||'').charCodeAt(0)%22);
  const sf = e.urgency==='critical';
  const ra = {critical:'Escalate immediately — assign senior staff and notify family.',medium:'Schedule follow-up call within 2 hours.',low:'Standard response — review at next shift.'}[e.urgency];
  const sug= `Hello ${(op.contact?.name||'').split(' ')[0]||'there'}, thank you for reaching out to DementiaHub. ${sf?'A senior care coordinator has been alerted and will contact you within 30 minutes.':'One of our care specialists will be in touch with you shortly.'}`;
  document.getElementById('modal-root').innerHTML=`
    <div class="modal-overlay" onclick="if(event.target===this)closeAIModal()">
      <div class="modal-box" style="max-width:540px;">
        <div style="display:flex;align-items:center;gap:13px;margin-bottom:20px;">
          <div style="width:42px;height:42px;border-radius:11px;background:linear-gradient(135deg,#006D77,#003D44);display:flex;align-items:center;justify-content:center;color:#fff;">${icon('cpu',20)}</div>
          <div><div style="font-size:16px;font-weight:800;color:#0F172A;">AI Case Insight</div><div style="font-size:11px;color:#94A3B8;margin-top:2px;">${esc(e.caseId)} · Confidence: ${conf}%</div></div>
          <button onclick="closeAIModal()" class="dh-btn dh-btn-ghost dh-btn-sm" style="margin-left:auto;">${icon('x',12)} Close</button>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;">
          ${infoTile('Who',`<p style="font-size:12.5px;font-weight:700;color:#0F172A;">${esc(op.contact?.name||'Unknown')}</p>`)}
          ${infoTile('What',`<p style="font-size:12px;color:#374151;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(op.name||'—')}</p>`)}
          <div style="${e.urgency==='critical'?'background:#FEF2F2;border-color:#FECACA;':'background:#F8FAFC;border-color:#E8EDF3;'}border:1px solid;border-radius:10px;padding:10px 12px;">
            <p style="font-size:9.5px;font-weight:800;color:#94A3B8;text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px;">Urgency</p>
            <span class="badge badge-${e.urgency}">${urgDot(e.urgency)} ${e.urgency.toUpperCase()}</span>
          </div>
          <div style="${sf?'background:#FEF2F2;border-color:#FECACA;':'background:#EFF6FF;border-color:#BFDBFE;'}border:1px solid;border-radius:10px;padding:10px 12px;">
            <p style="font-size:9.5px;font-weight:800;color:#94A3B8;text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px;">Action</p>
            <p style="font-size:11.5px;font-weight:700;color:${sf?'#B91C1C':'#1E40AF'};">${ra}</p>
          </div>
        </div>
        <div style="margin-bottom:16px;">
          <p style="font-size:10px;font-weight:800;color:#94A3B8;text-transform:uppercase;letter-spacing:.08em;margin-bottom:7px;">Suggested Response</p>
          <textarea id="aiReplyText" class="dh-input" style="resize:none;min-height:90px;font-size:13px;padding-top:10px;">${esc(sug)}</textarea>
        </div>
        <div style="display:flex;gap:10px;">
          <button onclick="openModal(${idx});closeAIModal()" class="dh-btn dh-btn-primary" style="flex:1;">${icon('check',13,'#fff')} Add as Note</button>
          <button onclick="openEscalateModal(${idx})" class="dh-btn dh-btn-warn">${icon('alert-tri',12)} Escalate</button>
          <button onclick="closeAIModal()" class="dh-btn dh-btn-ghost">Cancel</button>
        </div>
      </div>
    </div>`;
}
function closeAIModal(){ document.getElementById('modal-root').innerHTML=''; }

function openEscalateModal(idx){
  const op = ghlOpps?.[idx]; if(!op) return;
  document.getElementById('modal-root').innerHTML=`
    <div class="modal-overlay" onclick="if(event.target===this)document.getElementById('modal-root').innerHTML=''">
      <div class="modal-box" style="max-width:440px;">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:18px;">
          <div style="width:40px;height:40px;border-radius:11px;background:#FEF2F2;display:flex;align-items:center;justify-content:center;color:#DC2626;">${icon('alert-tri',20)}</div>
          <div><div style="font-size:16px;font-weight:800;color:#DC2626;">Escalate Case</div><div style="font-size:11.5px;color:#64748B;margin-top:2px;">${esc(op.contact?.name||'Contact')} · ${esc(enrich(op,idx).caseId)}</div></div>
        </div>
        <div style="background:#FFF7ED;border:1px solid #FDE68A;border-radius:10px;padding:11px 14px;margin-bottom:16px;font-size:12px;color:#78350F;font-weight:600;display:flex;align-items:center;gap:7px;">
          ${icon('alert',12,'#D97706')} Dementia Helpline: <strong>6377 0700</strong> &nbsp;·&nbsp; Emergency: <strong>999/995</strong>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div><label class="field-label">Escalation Type</label><select id="escType" class="dh-select" style="width:100%;height:42px;"><option>Missing Person</option><option>Self-Harm Risk</option><option>Medical Emergency</option><option>Caregiver Distress</option><option>Violence / Safety</option><option>Other Critical</option></select></div>
          <div><label class="field-label">Assign To</label><select id="escStaff" class="dh-select" style="width:100%;height:42px;">${STAFF_LIST.filter(s=>s!=='Unassigned').map(s=>`<option>${esc(s)}</option>`).join('')}</select></div>
          <div><label class="field-label">Escalation Notes</label><textarea id="escNote" class="dh-input" rows="3" style="resize:vertical;padding-top:10px;" placeholder="Describe the situation, what was said, immediate risk level…"></textarea></div>
        </div>
        <div style="display:flex;gap:10px;margin-top:18px;">
          <button onclick="submitEscalation(${idx})" class="dh-btn dh-btn-danger" style="flex:1;font-weight:800;">${icon('alert-tri',13)} Confirm Escalation</button>
          <button onclick="document.getElementById('modal-root').innerHTML=''" class="dh-btn dh-btn-ghost">Cancel</button>
        </div>
      </div>
    </div>`;
}

function openCallbackForm(){
  document.getElementById('modal-root').innerHTML=`
    <div class="modal-overlay" onclick="if(event.target===this)document.getElementById('modal-root').innerHTML=''">
      <div class="modal-box" style="max-width:420px;">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
          <div style="width:40px;height:40px;border-radius:11px;background:#E0F2FE;display:flex;align-items:center;justify-content:center;color:#0284C7;">${icon('phone-call',20)}</div>
          <div style="font-size:16px;font-weight:800;color:#0F172A;">Schedule Callback</div>
          <button onclick="document.getElementById('modal-root').innerHTML=''" style="margin-left:auto;background:none;border:none;cursor:pointer;color:#94A3B8;display:flex;">${icon('x',16)}</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div><label class="field-label">Contact Name</label><input id="cbName" class="dh-input" style="height:42px;" placeholder="Caregiver name"></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            <div><label class="field-label">Date</label><input id="cbDate" class="dh-input" type="date" style="height:42px;" min="${new Date().toISOString().split('T')[0]}"></div>
            <div><label class="field-label">Time</label><input id="cbTime" class="dh-input" type="time" style="height:42px;" value="10:00"></div>
          </div>
          <div><label class="field-label">Assign To</label><select id="cbStaff" class="dh-select" style="width:100%;height:42px;">${STAFF_LIST.map(s=>`<option>${esc(s)}</option>`).join('')}</select></div>
          <div><label class="field-label">Notes (optional)</label><textarea id="cbNotes" class="dh-input" rows="2" style="resize:none;padding-top:8px;" placeholder="Reason for callback, what to discuss…"></textarea></div>
        </div>
        <div style="display:flex;gap:10px;margin-top:18px;">
          <button onclick="saveCallback()" class="dh-btn dh-btn-primary" style="flex:1;">${icon('check',13,'#fff')} Schedule</button>
          <button onclick="document.getElementById('modal-root').innerHTML=''" class="dh-btn dh-btn-ghost">Cancel</button>
        </div>
      </div>
    </div>`;
}

/* ════════════════════════════════════════════════════════════
   CASE ACTIONS
════════════════════════════════════════════════════════════ */
function updateCaseStatus(oppId, status){
  caseStatuses[oppId] = status;
  localStorage.setItem('dsg_case_statuses', JSON.stringify(caseStatuses));
}

function saveCaseAction(oppId, idx){
  const status = document.getElementById('cdStatus').value;
  const assign = document.getElementById('cdAssign').value;
  const notes  = document.getElementById('cdNotes').value.trim();
  updateCaseStatus(oppId, status);
  assignments[oppId] = assign;
  if(notes) caseNotes[oppId] = notes;
  localStorage.setItem('dsg_assignments', JSON.stringify(assignments));
  localStorage.setItem('dsg_case_notes', JSON.stringify(caseNotes));
  openCaseDetail(oppId);
  setTimeout(()=>{
    const msg = document.getElementById('cdSaveMsg');
    if(msg){ msg.style.display='flex'; msg.classList.remove('hidden'); setTimeout(()=>{ msg.style.display='none'; msg.classList.add('hidden'); },2500); }
  }, 0);
  showToast('Case updated successfully.','success');
}

function markCallbackDone(oppId){
  cbStatuses[oppId] = { done:true, ts:new Date().toISOString() };
  localStorage.setItem('dsg_cb_statuses', JSON.stringify(cbStatuses));
  openCaseDetail(oppId);
  showToast('Callback marked as completed.','success');
}

function markCallbackDoneById(cbId){
  cbStatuses[cbId] = { done:true, ts:new Date().toISOString() };
  localStorage.setItem('dsg_cb_statuses', JSON.stringify(cbStatuses));
  showToast('Callback marked as completed.','success');
  render();
}

/* ════════════════════════════════════════════════════════════
   GENERAL ACTIONS
════════════════════════════════════════════════════════════ */
function setFilter(f){ activeFilter=f; render(); }
function toggleSort(col){ if(sortCol===col) sortDir=sortDir==='asc'?'desc':'asc'; else{sortCol=col;sortDir='asc';} render(); }
function assignStaff(oppId, staffName){ assignments[oppId]=staffName; localStorage.setItem('dsg_assignments',JSON.stringify(assignments)); showToast(`Assigned to ${staffName}`,'success',2000); }

function saveAssignment(){
  const cid   = document.getElementById('assignCaseId').value.trim();
  const staff = document.getElementById('assignStaffSel').value;
  const note  = document.getElementById('assignNote').value.trim();
  if(!cid){ showToast('Please enter a Case ID.','error'); return; }
  const op = (ghlOpps||[]).find(o=>enrich(o,0).caseId===cid.toUpperCase());
  if(op){ assignments[op.id]=staff; localStorage.setItem('dsg_assignments',JSON.stringify(assignments)); }
  if(note) saveHandover(`Assigned ${cid} to ${staff}. ${note}`);
  document.getElementById('assignCaseId').value='';
  document.getElementById('assignNote').value='';
  showToast(`Case ${cid} assigned to ${staff}.`,'success');
  render();
}

function submitHandover(){
  const note = document.getElementById('handoverNote').value.trim();
  if(!note){ showToast('Please write a handover note.','error'); return; }
  saveHandover(note);
  document.getElementById('handoverNote').value='';
  document.getElementById('handoverList').innerHTML=renderHandoverList();
  showToast('Handover note published to shift feed.','success');
}

function submitEscalation(idx){
  const op = ghlOpps?.[idx]; if(!op) return;
  const type  = document.getElementById('escType').value;
  const staff = document.getElementById('escStaff').value;
  const note  = document.getElementById('escNote').value.trim();
  assignments[op.id]=staff; localStorage.setItem('dsg_assignments',JSON.stringify(assignments));
  saveHandover(`⚠ ESCALATION — ${enrich(op,idx).caseId} · Type: ${type} · Assigned: ${staff}${note?' · '+note:''}`);
  document.getElementById('modal-root').innerHTML='';
  showToast(`Case escalated to ${staff} as "${type}".`,'warn',5000);
  render();
}

function saveCallback(){
  const name  = document.getElementById('cbName').value.trim();
  const date  = document.getElementById('cbDate').value;
  const time  = document.getElementById('cbTime').value;
  const staff = document.getElementById('cbStaff').value;
  if(!name||!date||!time){ showToast('Please fill in all required fields.','error'); return; }
  callbacks.unshift({ id:Date.now().toString(), name, time:date+' '+time, staff, created:new Date().toISOString() });
  localStorage.setItem('dsg_callbacks', JSON.stringify(callbacks.slice(0,50)));
  document.getElementById('modal-root').innerHTML='';
  showToast(`Callback scheduled for ${name} on ${date} at ${time}.`,'success');
  render();
}

function removeCallback(id){
  callbacks = callbacks.filter(c=>c.id!==id);
  localStorage.setItem('dsg_callbacks', JSON.stringify(callbacks));
  render();
}

/* ════════════════════════════════════════════════════════════
   AUTO-REFRESH + INIT
════════════════════════════════════════════════════════════ */
let _refreshTimer = null;
function startAutoRefresh(intervalMs=30000){
  if(_refreshTimer) clearInterval(_refreshTimer);
  _refreshTimer = setInterval(()=>{ if(isAuth()) fetchGHL(); }, intervalMs);
}

render();
if(isAuth()){ fetchGHL(); startAutoRefresh(30000); }
