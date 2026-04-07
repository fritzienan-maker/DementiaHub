// ══════════════════════════════════════════════════════════════
// CONFIG
// ══════════════════════════════════════════════════════════════
const CFG = {
  // API key is NOT here — it lives in Vercel env vars (GHL_API_KEY).
  // All GHL calls go through /api/ghl via window.DHAPI.
  locationId: "Idf9v4q6aqh5KhzXip6e",
  elevenLabsAgentId: "YOUR_ELEVENLABS_AGENT_ID", // ← replace with your ElevenLabs Conversational AI agent ID
  logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23006D77' width='100' height='100'/%3E%3Ctext x='50' y='65' font-size='80' font-weight='bold' fill='white' text-anchor='middle'%3EDH%3C/text%3E%3C/svg%3E",
};

// ══════════════════════════════════════════════════════════════
// GHL STATE
// ══════════════════════════════════════════════════════════════
const S = {
  opps: null, // null=loading, []=empty, [...]=data
  convos: null,
  calendars: null,
  filter: "all", // all|new|triaged|due_soon|critical|resolved
  kbViewed: JSON.parse(localStorage.getItem("dh_kb_viewed") || "[]"),
  journalMood: "okay", // overwhelmed|tired|okay|hopeful|good
};

// ══════════════════════════════════════════════════════════════
// RESOURCES TAB STATE
// ══════════════════════════════════════════════════════════════
let resourceTab = localStorage.getItem("dh_resource_tab") || "emergency";

// ══════════════════════════════════════════════════════════════
// GHL API HELPERS — proxied securely via /api/ghl (DHAPI)
// ══════════════════════════════════════════════════════════════

async function loadGHLData() {
  try {
    const { opps, convos, calendars } = await DHAPI.loadDashboardData();
    S.opps = opps;
    S.convos = convos;
    S.calendars = calendars;
  } catch (e) {
    console.error("[loadGHLData]", e.message);
    S.opps = [];
    S.convos = [];
    S.calendars = [];
  }
  render();
}

async function postNote(contactId, noteText) {
  return DHAPI.addNote(contactId, noteText);
}

async function scheduleCallback(calendarId, contactId, startTime, endTime) {
  return DHAPI.scheduleAppointment(calendarId, contactId, startTime, endTime);
}

// ══════════════════════════════════════════════════════════════
// SAFETY & SLA LOGIC
// ══════════════════════════════════════════════════════════════
const CRITICAL_KEYWORDS = [
  "urgent",
  "critical",
  "emergency",
  "fall",
  "wander",
  "missing",
  "crisis",
  "acute",
  "unsafe",
  "danger",
  "immediate",
];

function isCritical(op) {
  const text = (
    (op.name || "") +
    " " +
    (op.pipelineStageName || "")
  ).toLowerCase();
  return CRITICAL_KEYWORDS.some((k) => text.includes(k));
}

function getSLA(op) {
  const hrs =
    (Date.now() - new Date(op.updatedAt || op.createdAt).getTime()) / 3600000;
  if (hrs < 24) return { label: "On Track", cls: "dh-badge-track", hrs };
  if (hrs < 48) return { label: "Due Soon", cls: "dh-badge-due", hrs };
  return { label: "Overdue", cls: "dh-badge-needs", hrs };
}

function getSafetyAlerts(opps) {
  return opps.filter((op) => isCritical(op) || getSLA(op).hrs >= 72);
}

// Normalize GHL opp to display status: 'new' | 'triaged' | 'resolved'
function getDisplayStatus(op) {
  const st = (op.status || "").toLowerCase();
  const stage = (op.pipelineStageName || "").toLowerCase();
  if (st === "won" || st === "lost") return "resolved";
  if (/triage|progress|active|contact|open/i.test(stage)) return "triaged";
  return "new";
}

// Due-soon: high urgency unresolved OR overdue SLA
function isDueSoon(op) {
  if (getDisplayStatus(op) === "resolved") return false;
  return isCritical(op) || getSLA(op).hrs >= 48;
}

function getFilteredOpps(opps) {
  switch (S.filter) {
    case "new":
      return opps.filter((op) => getDisplayStatus(op) === "new");
    case "triaged":
      return opps.filter((op) => getDisplayStatus(op) === "triaged");
    case "due_soon":
      return opps.filter((op) => isDueSoon(op));
    case "critical":
      return opps.filter((op) => isCritical(op));
    case "resolved":
      return opps.filter((op) => getDisplayStatus(op) === "resolved");
    case "open":
      return opps.filter((op) => getDisplayStatus(op) !== "resolved");
    case "overdue":
      return opps.filter((op) => getSLA(op).hrs >= 48);
    default:
      return opps;
  }
}

// ══════════════════════════════════════════════════════════════
// USER AUTH (localStorage + sessionStorage)
// ══════════════════════════════════════════════════════════════
function getUsers() {
  return JSON.parse(localStorage.getItem("dh_users") || "[]");
}
function saveUsers(u) {
  localStorage.setItem("dh_users", JSON.stringify(u));
}
function getCurrentUser() {
  const id = sessionStorage.getItem("dh_cg_uid");
  return id ? getUsers().find((u) => u.id === id) || null : null;
}
async function hashPass(p) {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(p),
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
async function registerUser(fullname, email, phone, pass, patientName) {
  const users = getUsers();
  if (users.find((u) => u.email === email))
    return { error: "Email already registered." };
  if (pass.length < 8)
    return { error: "Password must be at least 8 characters." };
  const user = {
    id: Date.now().toString(),
    fullname,
    email,
    phone,
    patientName: patientName || null,
    role: "caregiver",
    hash: await hashPass(pass),
    joinedAt: new Date().toISOString(),
  };
  users.push(user);
  saveUsers(users);
  sessionStorage.setItem("dh_cg_uid", user.id);
  // Pre-configure GHL widget with identity for this session
  DHUserContext.configureGHLWidget(DHUserContext.getCaregiverContext());
  return { ok: true, user };
}
async function loginUser(email, pass) {
  const user = getUsers().find((u) => u.email === email);
  if (!user || user.hash !== (await hashPass(pass)))
    return { error: "Invalid email or password." };
  sessionStorage.setItem("dh_cg_uid", user.id);
  // Pre-configure GHL widget identity for this session
  DHUserContext.configureGHLWidget(DHUserContext.getCaregiverContext());
  return { ok: true, user };
}
function logoutUser() {
  sessionStorage.removeItem("dh_cg_uid");
  S.opps = null;
  S.convos = null;
  S.calendars = null;
  location.hash = "";
  render();
}

// ══════════════════════════════════════════════════════════════
// ROUTING
// ══════════════════════════════════════════════════════════════
function getView() {
  return location.hash.replace("#", "") || "dashboard";
}
window.addEventListener("hashchange", render);

// ══════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════
function esc(v) {
  return String(v || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
function fmtDate(iso) {
  return iso
    ? new Date(iso).toLocaleDateString("en-SG", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";
}
function fmtTime(iso) {
  return iso
    ? new Date(iso).toLocaleString("en-SG", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";
}
function timeAgo(iso) {
  if (!iso) return "—";
  const hrs = (Date.now() - new Date(iso).getTime()) / 3600000;
  if (hrs < 1) return Math.round(hrs * 60) + "m ago";
  if (hrs < 24) return Math.round(hrs) + "h ago";
  return Math.round(hrs / 24) + "d ago";
}

// ══════════════════════════════════════════════════════════════
// RENDER ENTRY
// ══════════════════════════════════════════════════════════════
// Mount the ElevenLabs voice widget once — persists across navigations so
// the web component is never destroyed/recreated (which caused auto-opening).
function mountVoiceWidget() {
  if (document.getElementById("dh-voice-widget-root")) return; // already mounted
  const ctx = DHUserContext.getCaregiverContext();
  if (!ctx) return;
  const elVars = JSON.stringify(DHUserContext.buildElevenLabsVars(ctx));
  const root = document.createElement("div");
  root.id = "dh-voice-widget-root";
  // Positioned at the bottom of the left sidebar (265px wide, 18px side padding)
  root.style.cssText =
    "position:fixed;bottom:20px;left:18px;width:229px;z-index:200;";
  root.innerHTML = `<elevenlabs-convai
    id="dh-el-widget-caregiver"
    agent-id="${esc(CFG.elevenLabsAgentId)}"
    dynamic-variables='${elVars}'
    style="display:block;width:100%;">
  </elevenlabs-convai>`;
  document.body.appendChild(root);
}

function render() {
  const user = getCurrentUser();
  const app = document.getElementById("app");
  if (!user) {
    // Remove persistent widget when logged out
    const w = document.getElementById("dh-voice-widget-root");
    if (w) w.remove();
    const path = location.hash.replace("#", "");
    app.innerHTML = path === "register" ? renderRegister() : renderLogin();
    if (path === "register")
      document
        .getElementById("regForm")
        .addEventListener("submit", handleRegister);
    else
      document
        .getElementById("loginForm")
        .addEventListener("submit", handleLogin);
    return;
  }
  app.innerHTML = renderShell(user, getView());
  mountVoiceWidget();
}

// ══════════════════════════════════════════════════════════════
// AUTH SCREENS
// ══════════════════════════════════════════════════════════════
function renderLogin(msg) {
  return `<div class="dh-auth-bg"><div class="dh-auth-card">
    <div class="text-center mb-8">
      <img src="${CFG.logo}" class="h-12 mx-auto mb-6" alt="DementiaHub">
      <h1 class="text-2xl font-black text-slate-900 mb-1">Welcome Back</h1>
      <p class="text-slate-500 text-sm font-medium">Sign in to your Caregiver Portal</p>
    </div>
    ${msg ? `<div class="alert-error">${esc(msg)}</div>` : ""}
    <form id="loginForm" class="space-y-4">
      <div><label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Email</label>
        <input id="loginEmail" class="dh-input" type="email" required placeholder="your@email.com" autocomplete="email"></div>
      <div><label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Password</label>
        <input id="loginPass" class="dh-input" type="password" required placeholder="Your password" autocomplete="current-password"></div>
      <button type="submit" class="dh-btn-primary mt-2">Sign In →</button>
    </form>
    <p class="text-center text-sm text-slate-500 mt-6">New caregiver? <a href="#register" class="text-[#006D77] font-bold hover:underline">Register here</a></p>
  </div></div>`;
}
async function handleLogin(e) {
  e.preventDefault();
  const res = await loginUser(
    document.getElementById("loginEmail").value,
    document.getElementById("loginPass").value,
  );
  if (res.error) {
    document.getElementById("app").innerHTML = renderLogin(res.error);
    document
      .getElementById("loginForm")
      .addEventListener("submit", handleLogin);
  } else {
    location.hash = "dashboard";
    loadGHLData();
    render();
  }
}

function renderRegister(msg) {
  return `<div class="dh-auth-bg"><div class="dh-auth-card">
    <div class="text-center mb-8">
      <img src="${CFG.logo}" class="h-12 mx-auto mb-6" alt="DementiaHub">
      <h1 class="text-2xl font-black text-slate-900 mb-1">Create Account</h1>
      <p class="text-slate-500 text-sm font-medium">Join the DementiaHub Caregiver Network</p>
    </div>
    ${msg ? `<div class="alert-error">${esc(msg)}</div>` : ""}
    <form id="regForm" class="space-y-4">
      <div><label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Full Name</label>
        <input id="regName" class="dh-input" type="text" required placeholder="Jane Smith" autocomplete="name"></div>
      <div><label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Email</label>
        <input id="regEmail" class="dh-input" type="email" required placeholder="jane@example.com" autocomplete="email"></div>
      <div><label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Phone <span class="text-slate-400 font-normal normal-case">(optional)</span></label>
        <input id="regPhone" class="dh-input" type="tel" placeholder="+65 9XXX XXXX" autocomplete="tel"></div>
      <div><label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Name of person you care for <span class="text-slate-400 font-normal normal-case">(optional)</span></label>
        <input id="regPatient" class="dh-input" type="text" placeholder="e.g. Mum, Dad, Mary Tan" autocomplete="off"></div>
      <div><label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Password</label>
        <input id="regPass" class="dh-input" type="password" required placeholder="Min. 8 characters" minlength="8" autocomplete="new-password"></div>
      <button type="submit" class="dh-btn-primary mt-2">Create Account →</button>
    </form>
    <p class="text-center text-sm text-slate-500 mt-6">Already registered? <a href="#login" class="text-[#006D77] font-bold hover:underline">Sign in</a></p>
  </div></div>`;
}
async function handleRegister(e) {
  e.preventDefault();
  const res = await registerUser(
    document.getElementById("regName").value,
    document.getElementById("regEmail").value,
    document.getElementById("regPhone").value,
    document.getElementById("regPass").value,
    document.getElementById("regPatient").value,
  );
  if (res.error) {
    document.getElementById("app").innerHTML = renderRegister(res.error);
    document
      .getElementById("regForm")
      .addEventListener("submit", handleRegister);
  } else {
    location.hash = "dashboard";
    loadGHLData();
    render();
  }
}

// ══════════════════════════════════════════════════════════════
// SHELL (sidebar + main)
// ══════════════════════════════════════════════════════════════
function renderShell(user, activeV) {
  const init = (user.fullname || "U")[0].toUpperCase();
  const nav = [
    { view: "dashboard", icon: "🏠", label: "Dashboard" },
    { view: "resources", icon: "📚", label: "Resources" },
  ];
  const navLinks = nav
    .map(
      (n) =>
        `<a class="dh-nav-link${activeV === n.view ? " active" : ""}" href="#${n.view}"><span class="text-lg">${n.icon}</span><span>${n.label}</span></a>`,
    )
    .join("");
  const mobIcons = nav
    .map(
      (n) =>
        `<a href="#${n.view}" class="text-lg ${activeV === n.view ? "text-white" : "text-white/50"}">${n.icon}</a>`,
    )
    .join("");
  let content = "";
  if (activeV === "dashboard") content = renderDashboard(user);
  else if (activeV === "resources") content = renderResources();
  return `
    <div class="dh-mob-bar">
      <img src="${CFG.logo}" class="h-8 brightness-0 invert" alt="Logo">
      <div class="flex gap-4">${mobIcons}<span onclick="logoutUser()" class="text-red-400 text-lg cursor-pointer">↩</span></div>
    </div>
    <div class="dh-sidebar">
      <img src="${CFG.logo}" class="h-9 mb-8 brightness-0 invert" alt="Logo">
      <div class="flex items-center gap-3 mb-6 p-4 bg-white/10 rounded-2xl">
        <div class="w-10 h-10 rounded-full bg-[#006D77] flex items-center justify-center font-black text-white">${init}</div>
        <div><p class="text-white font-bold text-sm leading-tight">${esc(user.fullname)}</p>
          <p class="text-white/50 text-[10px] font-semibold uppercase tracking-wider">Caregiver</p></div>
      </div>
      <nav class="flex-1 space-y-1">${navLinks}</nav>
      <div class="pt-6 border-t border-white/10">
        <a class="dh-nav-link" style="color:rgba(248,113,113,.8)" onclick="logoutUser()"><span>↩</span><span>Logout</span></a>
      </div>
    </div>
    <div class="dh-main"><div class="dh-content">${content}</div></div>`;
}

// ══════════════════════════════════════════════════════════════
// 🏠 DASHBOARD — ALL 9 FEATURES
// ══════════════════════════════════════════════════════════════
function renderDashboard(user) {
  const opps = S.opps;
  const convos = S.convos;
  const loading = opps === null;
  const alerts = !loading ? getSafetyAlerts(opps) : [];

  // ── 🚦 Safety Alerts ─────────────────────────────────────
  let alertsHtml = "";
  if (!loading && alerts.length) {
    const criticalCount = alerts.filter((a) => isCritical(a)).length;
    const staleCount = alerts.filter((a) => !isCritical(a)).length;
    alertsHtml = `
      <div class="alert-banner alert-critical mb-5">
        <div class="text-2xl mt-0.5">🚨</div>
        <div class="flex-1">
          <p class="font-black text-red-800 text-sm mb-1">SAFETY ALERT — Immediate Attention Required</p>
          <p class="text-red-700 text-xs font-medium">
            ${criticalCount ? `<strong>${criticalCount} critical case${criticalCount > 1 ? "s" : ""}</strong> flagged with urgent keywords.` : ""}
            ${staleCount ? ` <strong>${staleCount} case${staleCount > 1 ? "s" : ""}</strong> not updated in 72+ hours.` : ""}
          </p>
          <div class="flex flex-wrap gap-2 mt-2">
            ${alerts
              .slice(0, 3)
              .map(
                (a) =>
                  `<span class="dh-badge dh-badge-critical">${esc((a.contact?.name || "Case").split(" ")[0])} · ${esc(a.name || "Unnamed").slice(0, 30)}</span>`,
              )
              .join("")}
          </div>
        </div>
        <button onclick="setFilter('critical')" class="dh-btn-primary dh-btn-sm" style="width:auto;white-space:nowrap;">View All</button>
      </div>`;
  }

  // ── 👤 Profile + 📊 Stats ─────────────────────────────────
  const profileHtml = `
    <div class="dh-card flex items-center gap-5">
      <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#006D77] to-[#003D44] flex items-center justify-center text-white font-black text-2xl flex-shrink-0">
        ${(user.fullname || "U")[0].toUpperCase()}
      </div>
      <div class="flex-1 min-w-0">
        <p class="font-black text-slate-900 text-lg leading-tight truncate">${esc(user.fullname)}</p>
        <p class="text-slate-500 text-xs font-semibold truncate mt-0.5">${esc(user.email)}</p>
        ${user.phone ? `<p class="text-slate-400 text-xs mt-0.5">${esc(user.phone)}</p>` : ""}
        <p class="text-[10px] text-teal-600 font-black uppercase tracking-wider mt-1.5">Member since ${fmtDate(user.joinedAt)}</p>
      </div>
      <span class="dh-badge dh-badge-track hidden md:inline">Active</span>
    </div>`;

  // ── 📔 Journal / Mood Check-in ───────────────────────────
  const journalKey = `dh_journal_${user.id}`;
  const journalEntries = JSON.parse(localStorage.getItem(journalKey) || "[]");
  const moodDefs = [
    { key: "overwhelmed", emoji: "😟", label: "Overwhelmed", color: "#f43f5e", ring: "#fecdd3" },
    { key: "tired",       emoji: "😔", label: "Tired",       color: "#8b5cf6", ring: "#ede9fe" },
    { key: "okay",        emoji: "😐", label: "Okay",        color: "#94a3b8", ring: "#e2e8f0" },
    { key: "hopeful",     emoji: "🙂", label: "Hopeful",     color: "#006D77", ring: "#ccfbf1" },
    { key: "good",        emoji: "😊", label: "Good",        color: "#16a34a", ring: "#dcfce7" },
  ];
  const patientName = user.patientName || "your loved one";

  const moodButtons = moodDefs.map(m => {
    const active = S.journalMood === m.key;
    return `
      <button onclick="setJournalMood('${m.key}')" class="flex flex-col items-center gap-1.5 focus:outline-none">
        <div class="w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all duration-150"
          style="border: 2px solid ${active ? m.color : '#e2e8f0'};
                 background: ${active ? m.ring : 'transparent'};
                 transform: ${active ? 'scale(1.12)' : 'scale(1)'};">
          ${m.emoji}
        </div>
        <span class="text-[10px] font-bold transition-colors" style="color:${active ? m.color : '#94a3b8'};">${m.label}</span>
      </button>`;
  }).join("");

  const recentEntries = journalEntries.slice(-5).reverse().map(e => {
    const md = moodDefs.find(m => m.key === e.mood) || moodDefs[2];
    return `
      <div class="flex items-start gap-3 py-3 border-t border-slate-100">
        <div class="w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0"
          style="background:${md.ring};">${md.emoji}</div>
        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-center mb-0.5">
            <span class="text-[10px] font-black uppercase tracking-wider" style="color:${md.color};">${md.label}</span>
            <span class="text-[10px] text-slate-400 font-semibold">${timeAgo(e.date)}</span>
          </div>
          ${e.note ? `<p class="text-xs text-slate-500 leading-relaxed line-clamp-2">${esc(e.note)}</p>` : `<p class="text-xs text-slate-300 italic">No note added.</p>`}
        </div>
      </div>`;
  }).join("");

  const journalHtml = `
    <div class="dh-card">
      <h3 class="font-black text-slate-800 mb-0.5">📔 How are YOU feeling right now?</h3>
      <p class="text-xs font-semibold mb-5" style="color:#006D77;">Check in with yourself — not just with ${esc(patientName)}.</p>
      <div class="flex justify-between mb-5">${moodButtons}</div>
      <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">What's on your mind? <span class="normal-case font-semibold text-slate-400">(private)</span></label>
      <textarea id="journalNote" class="dh-input resize-none mb-4" rows="3"
        placeholder="Vent freely here — this is just for you…"></textarea>
      <button onclick="saveJournalEntry('${user.id}')" id="journalSaveBtn" class="dh-btn-primary w-full"
        style="background:linear-gradient(135deg,#006D77,#003D44);">Save my check-in</button>
      <div id="journalSaveResult" class="mt-2 text-xs text-center font-semibold text-teal-600 hidden">✓ Check-in saved</div>
      ${journalEntries.length ? `
        <div class="mt-2">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0">Recent Check-ins</p>
          ${recentEntries}
        </div>` : ""}
    </div>`;

  // ── 💬 Conversation History ───────────────────────────────
  let convoItems = "";
  if (S.convos === null) {
    convoItems = `<div class="text-center py-6"><div class="spinner mx-auto mb-2"></div><p class="text-slate-400 text-xs">Loading conversations…</p></div>`;
  } else if (!S.convos.length) {
    convoItems = `<div class="text-center py-6"><div class="text-3xl mb-2">💬</div><p class="text-slate-400 text-sm font-semibold">No conversations yet.</p></div>`;
  } else {
    convoItems = S.convos
      .slice(0, 8)
      .map(
        (c) => `
      <div class="convo-item mb-2">
        <div class="flex justify-between items-start mb-1">
          <p class="font-bold text-slate-800 text-sm leading-tight">${esc(c.contactName || c.fullName || "Unknown Contact")}</p>
          <span class="text-[10px] text-slate-400 font-semibold ml-2 whitespace-nowrap">${timeAgo(c.lastMessageDate || c.dateUpdated)}</span>
        </div>
        <p class="text-xs text-slate-500 leading-relaxed line-clamp-1">${esc(c.lastMessageBody || c.snippet || "No preview available")}</p>
        <div class="flex gap-1.5 mt-2">
          ${c.unreadCount ? `<span class="dh-badge dh-badge-needs">${c.unreadCount} unread</span>` : ""}
          <span class="dh-badge" style="background:#f1f5f9;color:#64748b;">${esc(c.type || "SMS")}</span>
        </div>
      </div>`,
      )
      .join("");
  }

  const conversationsHtml = `
    <div class="dh-card">
      <h3 class="font-black text-slate-800 mb-4">💬 Conversation History</h3>
      <div class="max-h-80 overflow-y-auto pr-1">${convoItems}</div>
    </div>`;

  return `
    ${alertsHtml}
    <!-- Profile -->
    <div class="mb-6">${profileHtml}</div>
    <!-- Journal -->
    <div class="mb-5">${journalHtml}</div>
    <!-- Conversations -->
    <div class="mb-5">${conversationsHtml}</div>`;
}

// ══════════════════════════════════════════════════════════════
// DASHBOARD ACTIONS
// ══════════════════════════════════════════════════════════════
function setFilter(f) {
  S.filter = f;
  render();
}

function setJournalMood(mood) {
  S.journalMood = mood;
  // Preserve any note already typed before re-render
  const existingNote = document.getElementById("journalNote")?.value || "";
  render();
  const noteEl = document.getElementById("journalNote");
  if (noteEl && existingNote) noteEl.value = existingNote;
}

function saveJournalEntry(userId) {
  const noteEl = document.getElementById("journalNote");
  const note = noteEl ? noteEl.value.trim() : "";
  const key = `dh_journal_${userId}`;
  const entries = JSON.parse(localStorage.getItem(key) || "[]");
  entries.push({ id: Date.now().toString(), mood: S.journalMood, note, date: new Date().toISOString() });
  localStorage.setItem(key, JSON.stringify(entries));
  S.journalMood = "okay";
  render();
  // Flash confirmation
  const saved = document.getElementById("journalSaveResult");
  if (saved) {
    saved.classList.remove("hidden");
    setTimeout(() => saved.classList.add("hidden"), 3000);
  }
}

function markKBViewed(key) {
  if (!S.kbViewed.includes(key)) {
    S.kbViewed.push(key);
    localStorage.setItem("dh_kb_viewed", JSON.stringify(S.kbViewed));
    render();
  }
}

// Note Modal
let _noteOppIdx = null;
function openNoteModal(idx) {
  _noteOppIdx = idx;
  const op = idx !== null ? (S.opps || [])[idx] : null;
  const name = op?.contact?.name || "";
  document.getElementById("modal-root").innerHTML = `
    <div class="modal-overlay" onclick="if(event.target===this)closeModal()">
      <div class="modal-box">
        <h2 class="text-xl font-black text-slate-900 mb-1">📝 Add Case Note</h2>
        <p class="text-xs text-slate-500 font-bold uppercase tracking-widest mb-5">Syncing to: <span class="text-teal-600">${esc(name || "Select a case below")}</span></p>
        ${!name ? `<div class="mb-3"><label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Contact ID</label><input id="noteContactId" class="dh-input" placeholder="GHL Contact ID"></div>` : ""}
        <textarea id="noteText" class="dh-input resize-none h-32 mb-2" placeholder="Describe the care update or urgency…"></textarea>
        <div id="noteResult" class="mt-2"></div>
        <div class="flex gap-3 mt-4">
          <button id="noteBtn" onclick="submitNote()" class="dh-btn-primary dh-btn-sm flex-1" style="width:auto;">Sync to GHL</button>
          <button onclick="closeModal()" class="px-5 py-2.5 bg-slate-100 text-slate-500 rounded-xl font-bold text-sm hover:bg-slate-200 transition">Cancel</button>
        </div>
      </div>
    </div>`;
}

async function submitNote() {
  const noteText = document.getElementById("noteText").value.trim();
  const btn = document.getElementById("noteBtn");
  const resultEl = document.getElementById("noteResult");
  const op = _noteOppIdx !== null ? (S.opps || [])[_noteOppIdx] : null;
  const contactId =
    op?.contact?.id ||
    (document.getElementById("noteContactId")?.value || "").trim();

  if (!noteText) {
    resultEl.innerHTML = '<div class="alert-error">Please type a note.</div>';
    return;
  }
  if (!contactId) {
    resultEl.innerHTML = '<div class="alert-error">No contact ID found.</div>';
    return;
  }

  btn.innerHTML = '<span class="spinner"></span>';
  btn.disabled = true;
  try {
    await postNote(contactId, noteText);
    resultEl.innerHTML =
      '<div class="alert-success">✓ Note synced to GHL!</div>';
    document.getElementById("noteText").value = "";
    setTimeout(closeModal, 1500);
  } catch (e) {
    resultEl.innerHTML = `<div class="alert-error">Failed: ${esc(e.message)}</div>`;
  } finally {
    btn.innerHTML = "Sync to GHL";
    btn.disabled = false;
  }
}

// Callback Modal
let _cbOppIdx = null;
function openCallbackModal(idx) {
  _cbOppIdx = idx;
  const op = idx !== null ? (S.opps || [])[idx] : null;
  const name = op?.contact?.name || "";
  const cid = op?.contact?.id || "";
  const calOptions =
    S.calendars && S.calendars.length
      ? S.calendars
          .map((c) => `<option value="${esc(c.id)}">${esc(c.name)}</option>`)
          .join("")
      : '<option value="">No calendars loaded</option>';
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("modal-root").innerHTML = `
    <div class="modal-overlay" onclick="if(event.target===this)closeModal()">
      <div class="modal-box">
        <h2 class="text-xl font-black text-slate-900 mb-1">📅 Schedule Callback</h2>
        ${name ? `<p class="text-xs text-teal-600 font-bold uppercase tracking-wider mb-5">For: ${esc(name)}</p>` : '<p class="text-xs text-slate-400 mb-5">Select a contact and time</p>'}
        <div class="space-y-3">
          <div><label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Calendar</label>
            <select id="mcbCal" class="dh-select">${calOptions}</select></div>
          <div><label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Contact ID</label>
            <input id="mcbContact" class="dh-input" value="${esc(cid)}" placeholder="GHL Contact ID" style="font-size:12px;font-family:monospace;"></div>
          <div class="grid grid-cols-2 gap-3">
            <div><label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Date</label>
              <input id="mcbDate" class="dh-input" type="date" min="${today}" value="${today}"></div>
            <div><label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Time</label>
              <input id="mcbTime" class="dh-input" type="time" value="10:00"></div>
          </div>
        </div>
        <div id="cbModalResult" class="mt-3"></div>
        <div class="flex gap-3 mt-4">
          <button id="mcbBtn" onclick="submitCallbackModal()" class="dh-btn-primary dh-btn-sm flex-1" style="width:auto;">Book Callback</button>
          <button onclick="closeModal()" class="px-5 py-2.5 bg-slate-100 text-slate-500 rounded-xl font-bold text-sm hover:bg-slate-200 transition">Cancel</button>
        </div>
      </div>
    </div>`;
}

async function submitCallbackModal() {
  const calId = document.getElementById("mcbCal").value;
  const contactId = document.getElementById("mcbContact").value.trim();
  const date = document.getElementById("mcbDate").value;
  const time = document.getElementById("mcbTime").value;
  const btn = document.getElementById("mcbBtn");
  const resultEl = document.getElementById("cbModalResult");

  if (!calId || !contactId || !date || !time) {
    resultEl.innerHTML =
      '<div class="alert-error">Please fill all fields.</div>';
    return;
  }

  const startTime = new Date(date + "T" + time + ":00").toISOString();
  const endTime = new Date(
    new Date(startTime).getTime() + 30 * 60000,
  ).toISOString(); // 30min slot

  btn.innerHTML = '<span class="spinner"></span>';
  btn.disabled = true;
  try {
    await scheduleCallback(calId, contactId, startTime, endTime);
    resultEl.innerHTML =
      '<div class="alert-success">✓ Callback scheduled in GHL!</div>';
    setTimeout(closeModal, 1800);
  } catch (e) {
    resultEl.innerHTML = `<div class="alert-error">Failed: ${esc(e.message)}</div>`;
  } finally {
    btn.innerHTML = "Book Callback";
    btn.disabled = false;
  }
}

// Inline callback (dashboard panel)
async function submitCallback() {
  const calId = document.getElementById("cbCalendar")?.value;
  const contactId = document.getElementById("cbContactId")?.value?.trim();
  const date = document.getElementById("cbDate")?.value;
  const time = document.getElementById("cbTime")?.value;
  const btn = document.getElementById("cbBtn");
  const resultEl = document.getElementById("cbResult");
  if (!calId || !contactId || !date || !time) {
    resultEl.innerHTML =
      '<div class="alert-error">Please fill all fields.</div>';
    return;
  }
  const startTime = new Date(date + "T" + time + ":00").toISOString();
  const endTime = new Date(
    new Date(startTime).getTime() + 30 * 60000,
  ).toISOString();
  btn.innerHTML = '<span class="spinner mx-auto"></span>';
  btn.disabled = true;
  try {
    await scheduleCallback(calId, contactId, startTime, endTime);
    resultEl.innerHTML = '<div class="alert-success">✓ Callback booked!</div>';
    document.getElementById("cbContactId").value = "";
    document.getElementById("cbDate").value = "";
  } catch (e) {
    resultEl.innerHTML = `<div class="alert-error">Failed: ${esc(e.message)}</div>`;
  } finally {
    btn.innerHTML = "Book Callback →";
    btn.disabled = false;
  }
}

function closeModal() {
  document.getElementById("modal-root").innerHTML = "";
}

// ══════════════════════════════════════════════════════════════
// CHAT VIEW — GHL webchat + ElevenLabs voice, both context-aware
// ══════════════════════════════════════════════════════════════
function renderChat(user) {
  const ctx = DHUserContext.getCaregiverContext();
  const chatUrl = DHUserContext.buildGHLChatUrl(CFG.locationId, ctx);
  const elVars = ctx
    ? JSON.stringify(DHUserContext.buildElevenLabsVars(ctx))
    : "{}";
  const greeting = ctx
    ? `Welcome back, ${esc(ctx.firstName)}. ${ctx.patientName ? "Caring for <strong>" + esc(ctx.patientName) + "</strong>." : ""}`
    : "AI assistant is available 24/7 to help with caregiving questions.";

  // Log the chat session start
  if (ctx)
    DHUserContext.storeConversationEvent(ctx, {
      type: "chat_view_opened",
      channel: "ghl_webchat",
    });

  return `
    <div class="mb-6">
      <h1 class="text-3xl font-black text-slate-900">💬 AI Support</h1>
      <p class="text-slate-500 mt-1 font-medium">${greeting}</p>
    </div>

    <!-- ── Tab bar ──────────────────────────────────────────── -->
    <div class="flex gap-3 mb-5">
      <button onclick="showChatTab('text')"  id="tab-text"  class="filter-btn active">💬 Text Chat</button>
      <button onclick="showChatTab('voice')" id="tab-voice" class="filter-btn">🎙️ Voice AI</button>
    </div>

    <!-- ── GHL Text Chat ─────────────────────────────────────── -->
    <div id="chat-panel-text">
      <div class="dh-card">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 bg-emerald-500 rounded-full dh-pulse"></span>
            <span class="text-emerald-700 text-xs font-black uppercase tracking-widest">Chat — Online</span>
          </div>
          ${ctx ? `<span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Logged in as ${esc(ctx.name)}</span>` : ""}
        </div>
        <iframe id="ghl-chat-frame" src="${esc(chatUrl)}"
          style="width:100%;height:620px;border:none;border-radius:16px;display:block;"
          title="DementiaHub AI Chat" loading="lazy" allow="microphone camera"></iframe>
        <div class="mt-4 p-4 bg-amber-50 rounded-2xl border border-amber-100">
          <p class="text-amber-800 text-xs font-semibold">⚠️ General guidance only. For life-threatening emergencies, call <strong>995</strong>.</p>
        </div>
      </div>
    </div>

    <!-- ── ElevenLabs Voice AI ──────────────────────────────── -->
    <div id="chat-panel-voice" class="hidden">
      <div class="dh-card">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 bg-violet-500 rounded-full dh-pulse"></span>
            <span class="text-violet-700 text-xs font-black uppercase tracking-widest">Voice AI — Ready</span>
          </div>
          ${ctx ? `<span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Speaking as ${esc(ctx.name)}</span>` : ""}
        </div>

        <div class="flex flex-col items-center justify-center py-8 gap-6">
          <div class="text-center mb-2">
            <p class="font-black text-slate-800 text-lg mb-1">Talk to Your AI Care Assistant</p>
            <p class="text-slate-500 text-sm">Press the button below to start a voice conversation.${ctx?.patientName ? " I already know you're caring for <strong>" + esc(ctx.patientName) + "</strong>." : ""}</p>
          </div>

          <!-- ElevenLabs widget — dynamic-variables inject user context -->
          <elevenlabs-convai
            id="dh-el-widget-caregiver"
            agent-id="${esc(CFG.elevenLabsAgentId)}"
            dynamic-variables='${elVars}'
            style="width:100%;max-width:480px;">
          </elevenlabs-convai>
        </div>

        <div class="mt-4 p-4 bg-violet-50 rounded-2xl border border-violet-100">
          <p class="text-violet-800 text-xs font-semibold">🎙️ Your voice session is private. For emergencies, say <strong>"call 995"</strong> or end the call and dial directly.</p>
        </div>
      </div>
    </div>`;
}

function showChatTab(tab) {
  document
    .getElementById("chat-panel-text")
    .classList.toggle("hidden", tab !== "text");
  document
    .getElementById("chat-panel-voice")
    .classList.toggle("hidden", tab !== "voice");
  document
    .getElementById("tab-text")
    .classList.toggle("active", tab === "text");
  document
    .getElementById("tab-voice")
    .classList.toggle("active", tab === "voice");

  if (tab === "voice") {
    // Ensure ElevenLabs widget has the latest context (in case user data changed)
    const widget = document.getElementById("dh-el-widget-caregiver");
    const ctx = DHUserContext.getCaregiverContext();
    DHUserContext.injectElevenLabsVars(widget, ctx);
    if (ctx)
      DHUserContext.storeConversationEvent(ctx, {
        type: "voice_tab_opened",
        channel: "elevenlabs",
      });
  }
}

// ══════════════════════════════════════════════════════════════
// RESOURCES VIEW
// ══════════════════════════════════════════════════════════════
function openResourceLink(url) {
  if (url.startsWith("tel:")) {
    window.location.href = url;
  } else {
    window.open(url, "_blank");
  }
}

function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      const btn = event.target;
      const original = btn.textContent;
      btn.textContent = "✓ Copied!";
      btn.classList.add("bg-emerald-100", "text-emerald-600");
      btn.classList.remove("bg-slate-100", "text-slate-500");
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove("bg-emerald-100", "text-emerald-600");
        btn.classList.add("bg-slate-100", "text-slate-500");
      }, 2000);
    })
    .catch(() => alert("Failed to copy"));
}

window.setResourceTab = function(tab) {
  resourceTab = tab;
  localStorage.setItem("dh_resource_tab", tab);
  render();
};

function renderResources() {
  const emergency = [
    {
      icon: "🚑",
      name: "999 Emergency Line",
      text: "Life-threatening emergencies only",
      hours: "24/7",
      phone: "999",
      link: "tel:999",
      priority: "critical",
      color: "red",
    },
    {
      icon: "📞",
      name: "Dementia Singapore Helpline",
      text: "Dementia & caregiver advice",
      hours: "Mon-Fri 9am-6pm, Sat 9am-1pm",
      phone: "6377 0700",
      link: "tel:6377-0700",
      priority: "high",
      color: "teal",
    },
    {
      icon: "🏥",
      name: "AIC Hotline",
      text: "Care services & subsidy info",
      hours: "24/7",
      phone: "1800-650-6060",
      link: "tel:+6518006506060",
      priority: "medium",
      color: "blue",
    },
    {
      icon: "💉",
      name: "HPB Health Programs",
      text: "Senior wellness & prevention",
      hours: "24/7",
      phone: "1800-223-1313",
      link: "tel:1800-223-1313",
      priority: "medium",
      color: "emerald",
    },
  ];

  const sections = [
    {
      title: "🤝 Caregiver Support & Programs",
      desc: "Community programs and professional support",
      color: "purple",
      items: [
        {
          icon: "👥",
          name: "Caregiver Support Groups (CSG)",
          text: "Join peer support groups led by Dementia Singapore. Weekly meetings across Singapore.",
          link: "https://dementia.org.sg/csg/",
          tag: "Community",
          info: "Dementia Singapore",
        },
        {
          icon: "🎓",
          name: "Dementia Singapore Academy",
          text: "Training programs, workshops, and specialized care courses.",
          link: "https://dementia.org.sg/academy/",
          tag: "Training",
          info: "Free courses",
        },
        {
          icon: "💬",
          name: "Counselling for Caregivers",
          text: "Professional counselling with emotional support and coping strategies.",
          link: "https://www.dementiahub.sg/dementia/counselling-for-caregivers/",
          tag: "Wellness",
          info: "Personalized",
        },
        {
          icon: "🎵",
          name: "Dementia Social Club",
          text: "Recreational activities and social engagement events.",
          link: "https://dementia.org.sg/csn/",
          tag: "Activity",
          info: "Multiple locations",
        },
      ],
    },
    {
      title: "🛡️ Safety Tools & Technology",
      desc: "Digital companions and safety features",
      color: "blue",
      items: [
        {
          icon: "📱",
          name: "CARA — Digital Care Companion",
          text: "Free mobile app with Safe Return, missing person alerts, and resources.",
          link: "https://cara.sg/",
          tag: "Technology",
          info: "Free membership",
        },
        {
          icon: "🔍",
          name: "Safe Return Program",
          text: "Help identify and reunite wandering loved ones through CARA alerts.",
          link: "https://cara.sg/safe-return-guide/",
          tag: "Safety",
          info: "Community-powered",
        },
        {
          icon: "📚",
          name: "Dementia Hub Portal",
          text: "Singapore's comprehensive resource site with articles and services directory.",
          link: "https://www.dementiahub.sg/",
          tag: "Information",
          info: "Free access",
        },
      ],
    },
    {
      title: "📚 Education & Understanding",
      desc: "Learn about dementia and care strategies",
      color: "orange",
      items: [
        {
          icon: "🧠",
          name: "Dementia Stages & Signs",
          text: "Comprehensive guides on Early, Middle, and Late stage symptoms.",
          link: "https://www.dementiahub.sg/i-live-with-dementia/",
          tag: "Education",
          info: "Interactive",
        },
        {
          icon: "❤️",
          name: "Caregiver Burnout Recognition",
          text: "Identify warning signs and learn sustainable self-care practices.",
          link: "https://dementia.org.sg/about/",
          tag: "Wellbeing",
          info: "Expert guidance",
        },
        {
          icon: "🗣️",
          name: "Communication Strategies",
          text: "Evidence-based techniques for communicating with someone who has dementia.",
          link: "https://www.dementiahub.sg/my-loved-one-has-dementia/",
          tag: "Skills",
          info: "Video tutorials",
        },
        {
          icon: "📰",
          name: "Voice of Dementia Newsletter",
          text: "Monthly updates with caregiver tips, events, and medical insights.",
          link: "https://dementia.org.sg/vod/",
          tag: "Newsletter",
          info: "Free",
        },
      ],
    },
    {
      title: "🏥 Care Services & Locations",
      desc: "Singapore-wide services and care centers",
      color: "emerald",
      items: [
        {
          icon: "🏢",
          name: "New Horizon Centres",
          text: "Multi-purpose dementia care centers in Bukit Batok, Jurong Point, Tampines, Toa Payoh.",
          link: "https://dementia.org.sg/contact/",
          tag: "Service",
          info: "7:30am-6:30pm",
        },
        {
          icon: "💚",
          name: "Family of Wisdom Program",
          text: "Multi-generational dementia-inclusive engagement and family support.",
          link: "https://dementia.org.sg/contact/",
          tag: "Program",
          info: "Bendemeer",
        },
        {
          icon: "🎤",
          name: "Voices for Hope",
          text: "10-week caregiver advocacy and storytelling program.",
          link: "https://dementia.org.sg/contact/",
          tag: "Community",
          info: "Free",
        },
      ],
    },
    {
      title: "🌍 Practical Care Topics",
      desc: "Day-to-day caregiving advice and strategies",
      color: "cyan",
      items: [
        {
          icon: "🏠",
          name: "Home Safety for Dementia",
          text: "Checklist and tips to make your home safer for someone with dementia.",
          link: "https://www.dementiahub.sg/",
          tag: "Safety",
          info: "Practical",
        },
        {
          icon: "💊",
          name: "Medication & Health Management",
          text: "Guidance on medication adherence and working with healthcare providers.",
          link: "https://www.dementiahub.sg/",
          tag: "Medical",
          info: "Expert",
        },
        {
          icon: "🍽️",
          name: "Nutrition & Mealtime Support",
          text: "Tips on appetite changes and nutritious meal planning.",
          link: "https://www.dementiahub.sg/",
          tag: "Health",
          info: "Caregiver-focused",
        },
        {
          icon: "😴",
          name: "Sleep & Behavioral Management",
          text: "Strategies for managing sleep disturbances and challenging behaviors.",
          link: "https://www.dementiahub.sg/",
          tag: "Care",
          info: "Evidence-based",
        },
      ],
    },
  ];

  let html = `<div class="mb-8"><h1 class="text-3xl font-black text-slate-900">📚 Resources & Support</h1><p class="text-slate-500 mt-2 font-medium">Singapore comprehensive guides, helplines, and dementia care services for caregivers.</p></div>`;

  // ── EMERGENCY HELPLINES SECTION (prominent, user-friendly) ──
  html += `<div class="mb-8"><div class="mb-4"><h2 class="text-xl font-black text-slate-900 mb-1">🚨 Emergency Helplines</h2><p class="text-slate-500 text-sm font-medium">Quick access to urgent care & support. Tap any number to call immediately.</p></div><div class="grid grid-cols-1 md:grid-cols-2 gap-3">`;

  emergency.forEach((item) => {
    const colorMap = {
      red: {
        bg: "bg-red-50",
        border: "border-red-200",
        icon: "text-red-600",
        phone: "text-red-700",
        tag: "bg-red-100 text-red-700",
        hover: "hover:bg-red-100",
      },
      teal: {
        bg: "bg-teal-50",
        border: "border-teal-200",
        icon: "text-teal-600",
        phone: "text-teal-700",
        tag: "bg-teal-100 text-teal-700",
        hover: "hover:bg-teal-100",
      },
      blue: {
        bg: "bg-blue-50",
        border: "border-blue-200",
        icon: "text-blue-600",
        phone: "text-blue-700",
        tag: "bg-blue-100 text-blue-700",
        hover: "hover:bg-blue-100",
      },
      emerald: {
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        icon: "text-emerald-600",
        phone: "text-emerald-700",
        tag: "bg-emerald-100 text-emerald-700",
        hover: "hover:bg-emerald-100",
      },
    };
    const colors = colorMap[item.color];
    html += `
      <div class="dh-card ${colors.border} border-l-4 transition-all ${colors.hover} cursor-pointer group" onclick="openResourceLink('${esc(item.link)}')">
        <div class="flex items-start justify-between mb-3">
          <span class="text-3xl ${colors.icon}">${item.icon}</span>
          <span class="inline-block ${colors.tag} text-[8px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">${item.priority === "critical" ? "🚨 Critical" : item.priority === "high" ? "⚡ High Priority" : "📞 Regular"}</span>
        </div>
        <h3 class="font-black text-slate-800 mb-1 text-sm">${item.name}</h3>
        <p class="text-slate-500 text-xs font-medium mb-3">${item.text}</p>
        <div class="bg-white rounded-lg p-3 mb-3 border ${colors.border}">
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone Number</p>
          <p class="font-black ${colors.phone} text-2xl leading-none mb-2">${item.phone}</p>
          <p class="text-[10px] text-slate-500 font-semibold">Hours: ${item.hours}</p>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold ${colors.phone} group-hover:underline">📞 Tap to Call →</span>
          <button onclick="event.stopPropagation(); copyToClipboard('${esc(item.phone)}')" title="Copy number" class="text-[10px] px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 font-semibold transition">📋 Copy</button>
        </div>
      </div>`;
  });
  html += `</div></div>`;

  // ── COLOR SCHEMES FOR SECTIONS ──
  const colorSchemes = {
    purple: {bg: 'bg-purple-50', border: 'border-purple-200', icon: 'text-purple-600', link: 'text-purple-700', tag: 'bg-purple-100 text-purple-700', hover: 'hover:bg-purple-100', accent: 'text-purple-600'},
    blue: {bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-600', link: 'text-blue-700', tag: 'bg-blue-100 text-blue-700', hover: 'hover:bg-blue-100', accent: 'text-blue-600'},
    orange: {bg: 'bg-orange-50', border: 'border-orange-200', icon: 'text-orange-600', link: 'text-orange-700', tag: 'bg-orange-100 text-orange-700', hover: 'hover:bg-orange-100', accent: 'text-orange-600'},
    emerald: {bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'text-emerald-600', link: 'text-emerald-700', tag: 'bg-emerald-100 text-emerald-700', hover: 'hover:bg-emerald-100', accent: 'text-emerald-600'},
    cyan: {bg: 'bg-cyan-50', border: 'border-cyan-200', icon: 'text-cyan-600', link: 'text-cyan-700', tag: 'bg-cyan-100 text-cyan-700', hover: 'hover:bg-cyan-100', accent: 'text-cyan-600'},
  };

  // ── TAB NAVIGATION ──
  html += `<div class="mb-8">
    <div class="flex flex-wrap gap-2 mb-6 pb-4 border-b-2 border-slate-200">
      <button class="px-4 py-2 rounded-lg font-bold text-sm transition ${resourceTab === 'emergency' ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}" onclick="setResourceTab('emergency')">🆘 Quick Help</button>
      <button class="px-4 py-2 rounded-lg font-bold text-sm transition ${resourceTab === 'cara' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}" onclick="setResourceTab('cara')">📱 CARA Platform</button>
      <button class="px-4 py-2 rounded-lg font-bold text-sm transition ${resourceTab === 'dementiahub' ? 'bg-orange-600 text-white shadow-lg' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}" onclick="setResourceTab('dementiahub')">📚 DementiaHub</button>
      <button class="px-4 py-2 rounded-lg font-bold text-sm transition ${resourceTab === 'dementiasgt' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}" onclick="setResourceTab('dementiasgt')">🏥 Dementia SG</button>
    </div>
  </div>`;

  // ── TAB CONTENT ──
  if (resourceTab === 'emergency') {
    // Quick Help Tab - Critical resources for immediate needs
    html += sections.slice(0, 3).map(sec => {
      const colors = colorSchemes[sec.color] || colorSchemes.purple;
      return `<div class="mb-8">
        <div class="mb-5 pb-4 border-b-2 ${colors.border}">
          <h2 class="text-xl font-black ${colors.accent} mb-1">${sec.title}</h2>
          <p class="text-slate-500 text-sm font-medium">${sec.desc}</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${sec.items.map(item => {
            const urlDisplay = item.link.replace('https://', '').replace('http://', '').split('/')[0];
            return `
            <div class="dh-card ${colors.border} border-l-4 transition-all ${colors.hover} cursor-pointer group" onclick="openResourceLink('${esc(item.link)}')">
              <div class="flex items-start justify-between mb-3">
                <span class="text-3xl">${item.icon}</span>
                <span class="inline-block ${colors.tag} text-[8px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">${item.tag}</span>
              </div>
              <h3 class="font-black text-slate-800 mb-2 text-sm leading-snug">${item.name}</h3>
              <p class="text-slate-500 text-xs leading-relaxed mb-3">${item.text}</p>
              <div class="${colors.bg} rounded-lg p-3 mb-3 border ${colors.border}">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Details</p>
                <p class="text-[10px] text-slate-600 font-semibold mb-1">${item.info}</p>
                <p class="text-[10px] ${colors.link} font-bold truncate">↗ ${urlDisplay}</p>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold ${colors.link} group-hover:underline">Open →</span>
                <button onclick="event.stopPropagation(); copyToClipboard('${esc(item.link)}')" title="Copy link" class="text-[10px] px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 font-semibold transition">📋 Copy</button>
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>`;
    }).join('');
  } 
  else if (resourceTab === 'cara') {
    // CARA Tab - Digital platform features
    html += `
      <div class="mb-8">
        <div class="mb-5 pb-4 border-b-2 border-blue-200">
          <h2 class="text-2xl font-black text-blue-600 mb-2">📱 CARA — Digital Companion for Dementia Care</h2>
          <p class="text-slate-600 text-sm font-medium">Free lifestyle and community platform by Dementia Singapore. Available on iOS and Android.</p>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div class="dh-card bg-blue-50 border-2 border-blue-200">
            <h3 class="font-black text-blue-700 text-lg mb-3">🎯 About CARA</h3>
            <p class="text-slate-700 text-sm mb-4">CARA is an initiative by Dementia Singapore, supported by NCSS and AIC. It provides easy access for persons living with dementia and caregivers to connect to an ecosystem of digital solutions and community support.</p>
            <div class="space-y-2">
              <span class="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">✓ Free Membership</span>
              <span class="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full ml-2">✓ iOS & Android</span>
            </div>
          </div>
          <div class="dh-card bg-cyan-50 border-2 border-cyan-200">
            <h3 class="font-black text-cyan-700 text-lg mb-3">✨ Key Features</h3>
            <ul class="text-sm text-slate-700 space-y-2">
              <li>🛡️ <strong>Safe Return Program:</strong> Locate loved ones with dementia</li>
              <li>👥 <strong>Community Alerts:</strong> Notify network immediately</li>
              <li>🎁 <strong>Partner Rewards:</strong> Exclusive benefits from providers</li>
              <li>📚 <strong>Resources Hub:</strong> Professional dementia information</li>
            </ul>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="dh-card border-2 border-blue-100 hover:border-blue-300 transition">
            <h3 class="font-black text-slate-800 mb-3 text-base">🔍 Safe Return Program</h3>
            <p class="text-slate-600 text-sm mb-3">Community-powered safety net. Get alerts if a loved one goes missing and help reunite other families through the CARA network.</p>
            <button class="text-blue-600 font-bold text-sm hover:underline" onclick="openResourceLink('https://cara.sg/safe-return-guide/')">Learn More →</button>
          </div>
          <div class="dh-card border-2 border-blue-100 hover:border-blue-300 transition">
            <h3 class="font-black text-slate-800 mb-3 text-base">🤝 Partners Program</h3>
            <p class="text-slate-600 text-sm mb-3">Access exclusive rewards and offers from dementia-friendly businesses. Save money and make caregiving easier.</p>
            <button class="text-blue-600 font-bold text-sm hover:underline" onclick="openResourceLink('https://cara.sg/partners/')">Explore Partners →</button>
          </div>
        </div>
        
        <div class="dh-card border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 p-6">
          <h3 class="font-black text-blue-700 mb-3 text-lg">📲 Download CARA App Today</h3>
          <p class="text-slate-700 text-sm mb-4">Join thousands of families in Singapore using CARA to stay connected and safe. Your membership is completely free.</p>
          <div class="flex flex-wrap gap-3">
            <button onclick="openResourceLink('https://play.google.com/store/apps/details?id=com.embreo.carasg')" class="bg-green-500 text-white font-bold text-sm px-4 py-2 rounded-lg hover:bg-green-600 transition">📱 Google Play</button>
            <button onclick="openResourceLink('https://apps.apple.com/sg/app/cara-sg/id1553855834')" class="bg-gray-900 text-white font-bold text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition">🍎 App Store</button>
            <button onclick="openResourceLink('https://cara.sg/join-now/')" class="bg-blue-600 text-white font-bold text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition">🌐 Join Online</button>
          </div>
        </div>
      </div>`;
  }
  else if (resourceTab === 'dementiahub') {
    // DementiaHub Tab - Portal for different user types
    html += `
      <div class="mb-8">
        <div class="mb-5 pb-4 border-b-2 border-orange-200">
          <h2 class="text-2xl font-black text-orange-600 mb-2">📚 DementiaHub — Singapore's Comprehensive Resource Portal</h2>
          <p class="text-slate-600 text-sm font-medium">One-stop resource site with articles, guides, and practical advice. Browse by your role and situation:</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="dh-card border-2 border-orange-200 hover:border-orange-400 hover:shadow-lg transition cursor-pointer" onclick="openResourceLink('https://www.dementiahub.sg/i-live-with-dementia/')">
            <h3 class="font-black text-slate-800 mb-2 text-base">🧠 I Live with Dementia</h3>
            <p class="text-slate-600 text-sm mb-3">Resources for persons living with dementia. Learn about stages, signs, self-advocacy, maintaining independence, and staying active in the community.</p>
            <span class="text-orange-600 font-bold text-sm">Explore →</span>
          </div>
          
          <div class="dh-card border-2 border-orange-200 hover:border-orange-400 hover:shadow-lg transition cursor-pointer" onclick="openResourceLink('https://www.dementiahub.sg/my-loved-one-has-dementia/')">
            <h3 class="font-black text-slate-800 mb-2 text-base">❤️ My Loved One has Dementia</h3>
            <p class="text-slate-600 text-sm mb-3">Comprehensive guides for family caregivers. Communication tips, daily care routines, handling difficult behaviors, and managing health.</p>
            <span class="text-orange-600 font-bold text-sm">Explore →</span>
          </div>
          
          <div class="dh-card border-2 border-orange-200 hover:border-orange-400 hover:shadow-lg transition cursor-pointer" onclick="openResourceLink('https://www.dementiahub.sg/general-public/')">
            <h3 class="font-black text-slate-800 mb-2 text-base">👫 I Want to Play a Part</h3>
            <p class="text-slate-600 text-sm mb-3">For community members and volunteers. Learn how to create a dementia-inclusive environment and contribute to awareness.</p>
            <span class="text-orange-600 font-bold text-sm">Explore →</span>
          </div>
          
          <div class="dh-card border-2 border-orange-200 hover:border-orange-400 hover:shadow-lg transition cursor-pointer" onclick="openResourceLink('https://www.dementiahub.sg/care-professional/')">
            <h3 class="font-black text-slate-800 mb-2 text-base">👨‍⚕️ I am a Care Professional</h3>
            <p class="text-slate-600 text-sm mb-3">For healthcare workers and care professionals. Clinical insights, best practices, and professional resources.</p>
            <span class="text-orange-600 font-bold text-sm">Explore →</span>
          </div>
        </div>
        
        <div class="dh-card border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
          <h3 class="font-black text-slate-800 mb-3 text-base">💬 Professional Counselling for Caregivers</h3>
          <p class="text-slate-600 text-sm mb-4">Emotional support matters. Professional counsellors provide guidance, coping strategies, and personalized support for caregivers at every stage of the journey.</p>
          <button onclick="openResourceLink('https://www.dementiahub.sg/dementia/counselling-for-caregivers/')" class="bg-orange-600 text-white font-bold text-sm px-4 py-2 rounded-lg hover:bg-orange-700 transition">Learn More →</button>
        </div>
      </div>`;
  }
  else if (resourceTab === 'dementiasgt') {
    // Dementia Singapore Tab - Services directory and programs
    html += sections.slice(3).map(sec => {
      const colors = colorSchemes[sec.color] || colorSchemes.emerald;
      return `<div class="mb-8">
        <div class="mb-5 pb-4 border-b-2 ${colors.border}">
          <h2 class="text-xl font-black ${colors.accent} mb-1">${sec.title}</h2>
          <p class="text-slate-500 text-sm font-medium">${sec.desc}</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${sec.items.map(item => {
            const urlDisplay = item.link.replace('https://', '').replace('http://', '').split('/')[0];
            return `
            <div class="dh-card ${colors.border} border-l-4 transition-all ${colors.hover} cursor-pointer group" onclick="openResourceLink('${esc(item.link)}')">
              <div class="flex items-start justify-between mb-3">
                <span class="text-3xl">${item.icon}</span>
                <span class="inline-block ${colors.tag} text-[8px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">${item.tag}</span>
              </div>
              <h3 class="font-black text-slate-800 mb-2 text-sm leading-snug">${item.name}</h3>
              <p class="text-slate-500 text-xs leading-relaxed mb-3">${item.text}</p>
              <div class="${colors.bg} rounded-lg p-3 mb-3 border ${colors.border}">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Details</p>
                <p class="text-[10px] text-slate-600 font-semibold mb-1">${item.info}</p>
                <p class="text-[10px] ${colors.link} font-bold truncate">↗ ${urlDisplay}</p>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold ${colors.link} group-hover:underline">Open →</span>
                <button onclick="event.stopPropagation(); copyToClipboard('${esc(item.link)}')" title="Copy link" class="text-[10px] px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 font-semibold transition">📋 Copy</button>
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>`;
    }).join('');
    
    html += `<div class="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200">
      <h3 class="font-black text-emerald-900 mb-4 text-lg">🌍 About Dementia Singapore</h3>
      <p class="text-slate-700 text-sm mb-4">Dementia Singapore (formerly Alzheimer's Disease Association) is Singapore's leading specialist Social Service Agency in dementia care. We're dedicated to creating a dementia-inclusive society through Care Innovation, Advocacy, and Empowerment.</p>
      <div class="flex flex-wrap gap-3">
        <button onclick="openResourceLink('https://dementia.org.sg/volunteer/')" class="bg-emerald-600 text-white font-bold text-sm px-4 py-2 rounded-lg hover:bg-emerald-700 transition">✋ Volunteer</button>
        <button onclick="openResourceLink('https://dementia.org.sg/donate/')" class="bg-red-500 text-white font-bold text-sm px-4 py-2 rounded-lg hover:bg-red-600 transition">❤️ Donate</button>
        <button onclick="openResourceLink('https://dementia.org.sg/vod/')" class="bg-blue-600 text-white font-bold text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition">📰 Newsletter</button>
      </div>
    </div>`;
  }
  
  // ── CRISIS BANNER (shown in all tabs) ──
  html += `<div class="mt-8 p-6 bg-gradient-to-r from-red-50 via-orange-50 to-red-50 rounded-2xl border-2 border-red-200"><div class="flex items-start gap-4"><div class="text-3xl mt-1">🆘</div><div class="flex-1"><h3 class="font-black text-red-900 text-lg mb-1">Life-Threatening or Immediate Crisis?</h3><p class="text-red-800 text-sm font-semibold mb-3">Don't wait — call 999 immediately. Every second counts.</p><div class="grid grid-cols-1 md:grid-cols-2 gap-3"><div class="bg-white rounded-lg p-4 border border-red-200 cursor-pointer hover:bg-red-50 transition" onclick="openResourceLink('tel:999')"><p class="font-black text-red-700 text-2xl mb-1">🚑 999</p><p class="text-xs text-slate-500 font-semibold">Ambulance • Police • Fire</p></div><div class="bg-white rounded-lg p-4 border border-teal-200 cursor-pointer hover:bg-teal-50 transition" onclick="openResourceLink('tel:6377-0700')"><p class="font-black text-teal-700 text-lg mb-1">📞 6377 0700</p><p class="text-xs text-slate-500 font-semibold">Dementia Helpline • Mon-Fri 9-6pm</p></div></div></div></div></div>`;

  return html;
}

// ══════════════════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════════════════
render();
if (getCurrentUser()) loadGHLData();
