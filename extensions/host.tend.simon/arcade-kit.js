/* tend.host Arcade Runtime Kit — Runtime API 1 */
let runtime = null;
let paused = false;
let nextRafToken = 1;
let nextTimeoutToken = 1000000;
const rafRecords = new Map();
const timeoutRecords = new Map();
let removePause = null;
let removeResume = null;
let removeCleanup = null;

function bindRuntime(nextRuntime) {
  if (runtime === nextRuntime) return;
  runtime = nextRuntime || null;
  paused = Boolean(runtime?.lifecycle?.paused);
  if (!runtime) return;
  removePause = runtime.lifecycle.onPause(() => {
    paused = true;
    for (const rec of rafRecords.values()) {
      if (rec.id != null) runtime.timers.cancelAnimationFrame(rec.id);
      rec.id = null;
    }
    const now=Date.now();
    for(const rec of timeoutRecords.values()){
      if(rec.id!=null)runtime.timers.clearTimeout(rec.id);
      rec.remaining=Math.max(0,rec.remaining-(now-rec.started));rec.id=null;
    }
  });
  removeResume = runtime.lifecycle.onResume(() => {
    paused = false;
    for (const rec of rafRecords.values()) if (rec.id == null) scheduleRaf(rec);
    for(const rec of timeoutRecords.values())if(rec.id==null)scheduleTimeout(rec);
  });
  removeCleanup = runtime.lifecycle.onCleanup(() => {
    for (const rec of rafRecords.values()) if (rec.id != null) runtime.timers.cancelAnimationFrame(rec.id);
    for(const rec of timeoutRecords.values())if(rec.id!=null)runtime.timers.clearTimeout(rec.id);
    rafRecords.clear();timeoutRecords.clear();
  });
}

function scheduleRaf(rec) {
  if (!runtime || paused || rec.cancelled || rec.id != null) return;
  rec.id = runtime.timers.requestAnimationFrame((time) => {
    rec.id = null;
    if (rec.cancelled) return;
    rafRecords.delete(rec.token);
    rec.fn(time);
  });
}

function scheduleTimeout(rec){
  if(!runtime||paused||rec.cancelled||rec.id!=null)return;
  rec.started=Date.now();
  rec.id=runtime.timers.setTimeout(()=>{rec.id=null;timeoutRecords.delete(rec.token);if(!rec.cancelled)rec.fn(...rec.args);},Math.max(0,rec.remaining));
}

export function setTimeout(fn, delay, ...args) {
  if(!runtime)return window.setTimeout(fn,delay,...args);
  const token=nextTimeoutToken++;
  const rec={token,fn,args,remaining:Math.max(0,Number.isFinite(delay)?delay:0),started:Date.now(),id:null,cancelled:false};
  timeoutRecords.set(token,rec);scheduleTimeout(rec);return token;
}
export function clearTimeout(token) {
  if(!runtime){window.clearTimeout(token);return;}
  const rec=timeoutRecords.get(token);if(!rec)return;
  rec.cancelled=true;if(rec.id!=null)runtime.timers.clearTimeout(rec.id);timeoutRecords.delete(token);
}
export function setInterval(fn, delay, ...args) {
  if (runtime) return runtime.timers.setInterval(() => fn(...args), delay);
  return window.setInterval(fn, delay, ...args);
}
export function clearInterval(id) {
  if (runtime) runtime.timers.clearInterval(id); else window.clearInterval(id);
}
export function requestAnimationFrame(fn) {
  if (!runtime) return window.requestAnimationFrame(fn);
  const token = nextRafToken++;
  const rec = { token, fn, id: null, cancelled: false };
  rafRecords.set(token, rec);
  scheduleRaf(rec);
  return token;
}
export function cancelAnimationFrame(token) {
  if (!runtime) { window.cancelAnimationFrame(token); return; }
  const rec = rafRecords.get(token);
  if (!rec) return;
  rec.cancelled = true;
  if (rec.id != null) runtime.timers.cancelAnimationFrame(rec.id);
  rafRecords.delete(token);
}

const KIT_STYLE_ID = 'tend-arcade-runtime-kit-v2';
function ensureKitStyles() {
  if (document.getElementById(KIT_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = KIT_STYLE_ID;
  style.textContent = `
.tend-arcade-root{font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif!important;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
.tend-arcade-root button{font-family:inherit}
.tend-arcade-controls{position:absolute;right:10px;bottom:10px;z-index:900;display:flex;gap:7px;pointer-events:none}
.tend-arcade-control{pointer-events:auto;width:36px;height:36px;border-radius:12px;border:1px solid rgba(255,255,255,.13);background:rgba(2,6,23,.68);backdrop-filter:blur(14px);color:#cbd5e1;display:grid;place-items:center;cursor:pointer;font-size:17px;font-weight:900;box-shadow:0 10px 26px rgba(0,0,0,.28),inset 0 1px rgba(255,255,255,.08);transition:transform .16s,background .16s,color .16s,border-color .16s}
.tend-arcade-control:hover{transform:translateY(-2px);background:rgba(30,41,59,.9);color:#fff;border-color:rgba(103,232,249,.45)}
.tend-arcade-control[data-kind="fullscreen"]{color:#67e8f9}
.tend-arcade-control[data-kind="hub"]{color:#fbbf24}
.tend-arcade-hub{position:absolute;inset:0;z-index:1500;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(2,6,23,.72);backdrop-filter:blur(14px);animation:ta-fade .18s ease}
.tend-arcade-card{width:min(390px,100%);max-height:min(620px,calc(100% - 8px));overflow:auto;border-radius:22px;border:1px solid rgba(255,255,255,.12);background:linear-gradient(160deg,rgba(20,28,52,.98),rgba(8,12,28,.98));box-shadow:0 30px 90px rgba(0,0,0,.66),inset 0 1px rgba(255,255,255,.08);color:#f8fafc;padding:18px;scrollbar-width:thin;scrollbar-color:rgba(148,163,184,.28) transparent}
.tend-arcade-head{display:flex;align-items:center;gap:12px;margin-bottom:15px}.tend-arcade-emblem{width:48px;height:48px;border-radius:15px;display:grid;place-items:center;font-size:23px;background:linear-gradient(145deg,#22d3ee,#8b5cf6 55%,#ec4899);box-shadow:0 14px 34px rgba(99,102,241,.3);flex:0 0 auto}.tend-arcade-headcopy{flex:1;min-width:0}.tend-arcade-headcopy b{display:block;font-size:18px}.tend-arcade-headcopy span{display:block;margin-top:3px;color:#94a3b8;font-size:11px}.tend-arcade-close{width:34px;height:34px;border-radius:11px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:#cbd5e1;cursor:pointer;font-size:20px}
.tend-arcade-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-bottom:14px}.tend-arcade-stat{padding:10px 8px;border-radius:13px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.035);text-align:center}.tend-arcade-stat small{display:block;color:#64748b;font-size:8px;text-transform:uppercase;letter-spacing:1px;font-weight:800}.tend-arcade-stat b{display:block;margin-top:3px;font-size:17px;font-variant-numeric:tabular-nums}
.tend-arcade-section{margin-top:13px}.tend-arcade-section-title{display:flex;justify-content:space-between;gap:8px;margin-bottom:7px;color:#94a3b8;font-size:9px;text-transform:uppercase;letter-spacing:1.4px;font-weight:900}
.tend-arcade-options{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}.tend-arcade-option{position:relative;min-height:74px;padding:9px 7px;border-radius:13px;border:1px solid rgba(255,255,255,.08);background:rgba(15,23,42,.72);color:#94a3b8;text-align:left;cursor:pointer}.tend-arcade-option strong{display:block;color:#e2e8f0;font-size:10px}.tend-arcade-option span{display:block;margin-top:4px;font-size:8px;line-height:1.3}.tend-arcade-option.selected{border-color:#67e8f9;background:linear-gradient(145deg,rgba(8,145,178,.24),rgba(76,29,149,.22));box-shadow:0 0 18px rgba(34,211,238,.11)}.tend-arcade-option:disabled{opacity:.42;cursor:not-allowed}.tend-arcade-lock{position:absolute;right:6px;top:5px;color:#fbbf24;font-size:7px;font-style:normal}
.tend-arcade-mission{padding:12px;border-radius:14px;border:1px solid rgba(34,211,238,.18);background:linear-gradient(110deg,rgba(8,47,73,.45),rgba(30,41,59,.48))}.tend-arcade-mission-row{display:flex;align-items:center;gap:10px}.tend-arcade-mission-icon{width:40px;height:40px;border-radius:12px;display:grid;place-items:center;background:rgba(34,211,238,.12);font-size:20px}.tend-arcade-mission-copy{flex:1;min-width:0}.tend-arcade-mission-copy b{display:block;font-size:11px}.tend-arcade-mission-copy span{display:block;margin-top:2px;color:#94a3b8;font-size:9px}.tend-arcade-reward{color:#fbbf24;font-size:11px;font-weight:900}.tend-arcade-track{height:6px;margin-top:9px;border-radius:6px;background:rgba(255,255,255,.07);overflow:hidden}.tend-arcade-track i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#22d3ee,#8b5cf6,#ec4899);transition:width .35s}
.tend-arcade-note{margin-top:12px;color:#64748b;font-size:9px;line-height:1.45;text-align:center}.tend-arcade-toast{position:absolute;left:50%;bottom:56px;z-index:1600;transform:translate(-50%,18px);opacity:0;width:min(330px,calc(100% - 24px));padding:10px 13px;border-radius:14px;border:1px solid rgba(255,255,255,.12);background:rgba(4,9,24,.84);backdrop-filter:blur(14px);box-shadow:0 16px 40px rgba(0,0,0,.38);display:flex;align-items:center;gap:10px;color:#f8fafc;pointer-events:none;transition:opacity .2s,transform .24s}.tend-arcade-toast.show{opacity:1;transform:translate(-50%,0)}.tend-arcade-toast i{font-style:normal;font-size:20px}.tend-arcade-toast b{display:block;font-size:10px}.tend-arcade-toast span{display:block;margin-top:2px;color:#94a3b8;font-size:8px}
.tend-arcade-pressure{position:absolute;left:50%;top:8px;z-index:850;transform:translateX(-50%);width:min(300px,calc(100% - 100px));pointer-events:none;opacity:0;transition:opacity .2s}.tend-arcade-pressure.active{opacity:1}.tend-arcade-pressure-label{display:flex;justify-content:space-between;font-size:8px;color:#fda4af;font-weight:900;text-transform:uppercase;letter-spacing:1px}.tend-arcade-pressure-track{height:6px;margin-top:4px;border-radius:6px;background:rgba(255,255,255,.08);overflow:hidden}.tend-arcade-pressure-track i{display:block;height:100%;background:linear-gradient(90deg,#fbbf24,#fb7185,#ef4444);transition:width .1s linear}
@keyframes ta-fade{from{opacity:0}to{opacity:1}}
@media(max-width:767px){.tend-arcade-controls{right:max(10px,env(safe-area-inset-right));bottom:max(10px,env(safe-area-inset-bottom))}.tend-arcade-control{width:40px;height:40px}.tend-arcade-card{max-height:calc(100dvh - 24px);padding:16px}.tend-arcade-options{grid-template-columns:1fr}.tend-arcade-option{min-height:58px}.tend-arcade-root{padding-bottom:env(safe-area-inset-bottom)}}
@media(min-width:768px){.tend-arcade-control[data-kind="fullscreen"]{display:none}}
`;
  document.head.appendChild(style);
}

const dayKey = () => new Date().toISOString().slice(0, 10);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rankFromXp = (xp) => Math.max(1, Math.floor(Math.sqrt(Math.max(0, xp) / 180)) + 1);

export function createArcade(host, config = {}) {
  if (!host?.runtime || host.runtime.api !== 1 || host.runtime.kind !== 'game') {
    throw new Error(`${config.name || 'This game'} requires tend.host Extension Runtime API 1.`);
  }
  bindRuntime(host.runtime);
  ensureKitStyles();
  const storageKey = `arcade_profile_v2_${config.id || host.id}`;
  const modes = config.modes?.length ? config.modes : [{ id: 'classic', name: 'Classic', desc: 'Original rules', unlock: 1 }];
  const perks = config.perks?.length ? config.perks : [{ id: 'steady', name: 'Steady Hand', desc: 'Balanced play', unlock: 1 }];
  const missions = config.missions?.length ? config.missions : [{ event: 'score', target: 1000, title: 'Score Hunter', detail: 'Earn 1,000 points', icon: '★', reward: 60 }];
  const profile = { xp: 0, rank: 1, coins: 0, streak: 0, bestStreak: 0, selectedMode: modes[0].id, selectedPerk: perks[0].id, totals: {}, achievements: {}, daily: null };
  let root = null;
  let container = null;
  let shell = null;
  let layoutControl = null;
  let oldLayoutDisplay = '';
  let header = null;
  let controls = null;
  let hub = null;
  let toast = null;
  let toastTimer = null;
  let changeHandler = null;
  let pressure = null;
  let pressureTimer = null;
  let pressureState = null;
  let legacyFullscreenObserver = null;
  let cleaned = false;

  const ready = host.storage.get(storageKey).then((data) => {
    if (data && typeof data === 'object') {
      Object.assign(profile, data);
      profile.totals = data.totals && typeof data.totals === 'object' ? data.totals : {};
      profile.achievements = data.achievements && typeof data.achievements === 'object' ? data.achievements : {};
    }
    profile.rank = rankFromXp(profile.xp);
    if (!modes.some((m) => m.id === profile.selectedMode && profile.rank >= (m.unlock || 1))) profile.selectedMode = modes[0].id;
    if (!perks.some((p) => p.id === profile.selectedPerk && profile.rank >= (p.unlock || 1))) profile.selectedPerk = perks[0].id;
    normalizeDaily();
    return profile;
  }).catch(() => { normalizeDaily(); return profile; });

  function normalizeDaily() {
    const date = dayKey();
    if (!profile.daily || profile.daily.date !== date) {
      const seed = [...date + (config.id || host.id)].reduce((a, c) => (a * 33 + c.charCodeAt(0)) >>> 0, 5381);
      const mission = missions[seed % missions.length];
      profile.daily = { date, event: mission.event, target: mission.target, progress: 0, title: mission.title, detail: mission.detail, icon: mission.icon || '◆', reward: mission.reward || 60, claimed: false };
      save();
    }
  }

  function save() { host.storage.set(storageKey, profile).catch(() => {}); }
  function mode() { return modes.find((m) => m.id === profile.selectedMode) || modes[0]; }
  function perk() { return perks.find((p) => p.id === profile.selectedPerk) || perks[0]; }
  function isMode(id) { return profile.selectedMode === id; }
  function hasPerk(id) { return profile.selectedPerk === id; }
  function reward(xp = 0, coins = 0) {
    const oldRank = profile.rank;
    profile.xp += Math.max(0, Math.round(xp));
    profile.coins += Math.max(0, Math.round(coins));
    profile.rank = rankFromXp(profile.xp);
    save();
    if (profile.rank > oldRank) showToast('⬆', `Rank ${profile.rank} reached`, 'New challenges or perks may now be available.');
  }

  function record(event, amount = 1, meta = {}) {
    amount = Number.isFinite(amount) ? amount : 1;
    profile.totals[event] = (profile.totals[event] || 0) + amount;
    if (event === 'win' || event === 'level') {
      profile.streak += amount;
      profile.bestStreak = Math.max(profile.bestStreak, profile.streak);
      reward(30 * amount, 8 * amount);
    } else if (event === 'fail') {
      profile.streak = 0;
    } else if (event === 'score') {
      reward(Math.min(20, amount / 100), 0);
    } else if (event === 'combo') {
      reward(Math.min(12, amount), Math.floor(amount / 3));
    }
    normalizeDaily();
    const daily = profile.daily;
    if (!daily.claimed && daily.event === event) {
      daily.progress = clamp(daily.progress + amount, 0, daily.target);
      if (daily.progress >= daily.target) {
        daily.claimed = true;
        profile.coins += daily.reward;
        showToast('✓', 'Daily challenge complete', `+${daily.reward} arcade coins`);
      }
    }
    if (meta.achievement && !profile.achievements[meta.achievement]) {
      profile.achievements[meta.achievement] = true;
      profile.coins += meta.coins || 25;
      showToast('🏆', meta.title || 'Achievement unlocked', meta.detail || `+${meta.coins || 25} coins`);
    }
    save();
    if (hub) renderHub();
  }

  function setupShell() {
    shell = container?.closest?.('.tend-floating-window') || null;
    if (!shell) return;
    layoutControl = shell.querySelector('.window-layout-controls');
    if (layoutControl) { oldLayoutDisplay = layoutControl.style.display; layoutControl.style.display = 'none'; }
    header = shell.querySelector('[data-window-chrome]');
    header?.addEventListener('dblclick', stopExpand, true);
  }
  function stopExpand(event) { event.preventDefault(); event.stopImmediatePropagation(); }
  function restoreShell() {
    if (layoutControl) layoutControl.style.display = oldLayoutDisplay;
    header?.removeEventListener('dblclick', stopExpand, true);
    shell = null; layoutControl = null; header = null;
  }

  function mount(nextRoot, nextContainer) {
    root = nextRoot; container = nextContainer;
    if (!root) return;
    root.classList.add('tend-arcade-root');
    const hideLegacyFullscreen = () => root.querySelectorAll('[title="Fullscreen"],[title="Full screen"],[aria-label="Fullscreen"]').forEach((node) => { if (!node.classList.contains('tend-arcade-control')) node.style.display = 'none'; });
    hideLegacyFullscreen();
    legacyFullscreenObserver = new MutationObserver(hideLegacyFullscreen);
    legacyFullscreenObserver.observe(root, { childList: true, subtree: true });
    setupShell();
    controls = document.createElement('div'); controls.className = 'tend-arcade-controls';
    const full = document.createElement('button'); full.className = 'tend-arcade-control'; full.dataset.kind = 'fullscreen'; full.type = 'button'; full.title = 'Full screen'; full.setAttribute('aria-label', 'Play full screen'); full.textContent = '⛶';
    full.addEventListener('click', async () => { full.disabled = true; try { await host.runtime.display.toggleFullscreen(); } finally { full.disabled = false; } });
    const hq = document.createElement('button'); hq.className = 'tend-arcade-control'; hq.dataset.kind = 'hub'; hq.type = 'button'; hq.title = 'Arcade challenges'; hq.setAttribute('aria-label', 'Open arcade challenges'); hq.textContent = '🏆'; hq.addEventListener('click', openHub);
    controls.append(full, hq); root.appendChild(controls);
  }

  function openHub() {
    if (!root || hub) return;
    hub = document.createElement('div'); hub.className = 'tend-arcade-hub';
    hub.addEventListener('click', (event) => { if (event.target === hub) closeHub(); });
    root.appendChild(hub); renderHub();
  }
  function closeHub() { hub?.remove(); hub = null; }
  function renderHub() {
    if (!hub) return;
    normalizeDaily();
    const daily = profile.daily;
    const pct = clamp((daily.progress / daily.target) * 100, 0, 100);
    hub.innerHTML = `<div class="tend-arcade-card"><div class="tend-arcade-head"><div class="tend-arcade-emblem">${config.icon || '🎮'}</div><div class="tend-arcade-headcopy"><b>${config.name || 'Arcade Challenge'}</b><span>${config.subtitle || 'Progress, perks, and daily missions'}</span></div><button class="tend-arcade-close" type="button" aria-label="Close">×</button></div><div class="tend-arcade-stats"><div class="tend-arcade-stat"><small>Rank</small><b>${profile.rank}</b></div><div class="tend-arcade-stat"><small>Coins</small><b style="color:#fbbf24">◆ ${profile.coins}</b></div><div class="tend-arcade-stat"><small>Best streak</small><b style="color:#67e8f9">${profile.bestStreak}</b></div></div><div class="tend-arcade-section"><div class="tend-arcade-section-title"><span>Game mode</span><span>${mode().name}</span></div><div class="tend-arcade-options">${modes.map((m) => `<button class="tend-arcade-option ${m.id === profile.selectedMode ? 'selected' : ''}" data-mode="${m.id}" ${(m.unlock || 1) > profile.rank ? 'disabled' : ''}><strong>${m.icon || '◆'} ${m.name}</strong><span>${m.desc || ''}</span>${(m.unlock || 1) > profile.rank ? `<i class="tend-arcade-lock">R${m.unlock}</i>` : ''}</button>`).join('')}</div></div><div class="tend-arcade-section"><div class="tend-arcade-section-title"><span>Active perk</span><span>${perk().name}</span></div><div class="tend-arcade-options">${perks.map((p) => `<button class="tend-arcade-option ${p.id === profile.selectedPerk ? 'selected' : ''}" data-perk="${p.id}" ${(p.unlock || 1) > profile.rank ? 'disabled' : ''}><strong>${p.icon || '✦'} ${p.name}</strong><span>${p.desc || ''}</span>${(p.unlock || 1) > profile.rank ? `<i class="tend-arcade-lock">R${p.unlock}</i>` : ''}</button>`).join('')}</div></div><div class="tend-arcade-section"><div class="tend-arcade-section-title"><span>Daily challenge</span><span>${daily.claimed ? 'Complete' : `${Math.floor(daily.progress)}/${daily.target}`}</span></div><div class="tend-arcade-mission"><div class="tend-arcade-mission-row"><div class="tend-arcade-mission-icon">${daily.icon}</div><div class="tend-arcade-mission-copy"><b>${daily.title}</b><span>${daily.detail}</span></div><div class="tend-arcade-reward">${daily.claimed ? '✓' : `◆ ${daily.reward}`}</div></div><div class="tend-arcade-track"><i style="width:${pct}%"></i></div></div></div><div class="tend-arcade-note">Mode and perk changes apply to the next run or level. Progress is saved to this game’s scoped tend.host storage.</div></div>`;
    hub.querySelector('.tend-arcade-close').addEventListener('click', closeHub);
    hub.querySelectorAll('[data-mode]').forEach((button) => button.addEventListener('click', () => { if (button.disabled) return; profile.selectedMode = button.dataset.mode; save(); renderHub(); changeHandler?.({ mode: mode(), perk: perk() }); }));
    hub.querySelectorAll('[data-perk]').forEach((button) => button.addEventListener('click', () => { if (button.disabled) return; profile.selectedPerk = button.dataset.perk; save(); renderHub(); changeHandler?.({ mode: mode(), perk: perk() }); }));
  }

  function showToast(icon, title, detail) {
    if (!root) return;
    if (!toast) { toast = document.createElement('div'); toast.className = 'tend-arcade-toast'; root.appendChild(toast); }
    toast.innerHTML = `<i>${icon}</i><div><b>${title}</b><span>${detail || ''}</span></div>`;
    toast.classList.remove('show'); void toast.offsetWidth; toast.classList.add('show');
    if (toastTimer != null) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast?.classList.remove('show'), 2400);
  }

  function startPressure(options = {}) {
    stopPressure();
    if (!root || !options.enabled) return;
    const grace = options.grace || 8000;
    const countdown = options.countdown || 4000;
    pressureState = { grace, countdown, remaining: grace, warning: false, onExpire: options.onExpire || (() => {}) };
    pressure = document.createElement('div'); pressure.className = 'tend-arcade-pressure'; pressure.innerHTML = '<div class="tend-arcade-pressure-label"><span>Flow pressure</span><b>Ready</b></div><div class="tend-arcade-pressure-track"><i style="width:100%"></i></div>'; root.appendChild(pressure);
    pressureTimer = setInterval(() => {
      if (paused || !pressureState) return;
      pressureState.remaining -= 100;
      if (!pressureState.warning && pressureState.remaining <= 0) { pressureState.warning = true; pressureState.remaining = countdown; pressure.classList.add('active'); }
      if (pressureState.warning) {
        const pct = clamp((pressureState.remaining / countdown) * 100, 0, 100);
        pressure.querySelector('i').style.width = `${pct}%`;
        pressure.querySelector('b').textContent = `${Math.max(0, pressureState.remaining / 1000).toFixed(1)}s`;
        if (pressureState.remaining <= 0) { pressureState.onExpire(); resetPressure(); }
      }
    }, 100);
  }
  function resetPressure() {
    if (!pressureState) return;
    pressureState.warning = false; pressureState.remaining = pressureState.grace;
    pressure?.classList.remove('active');
    const fill = pressure?.querySelector('i'); if (fill) fill.style.width = '100%';
  }
  function stopPressure() {
    if (pressureTimer != null) clearInterval(pressureTimer);
    pressureTimer = null; pressureState = null; pressure?.remove(); pressure = null;
  }

  function onChange(fn) { changeHandler = fn; return () => { if (changeHandler === fn) changeHandler = null; }; }
  function cleanup() {
    if (cleaned) return; cleaned = true;
    stopPressure(); closeHub();
    if (toastTimer != null) clearTimeout(toastTimer);
    legacyFullscreenObserver?.disconnect(); legacyFullscreenObserver = null;
    controls?.remove(); toast?.remove();
    restoreShell();
    removePause?.(); removeResume?.(); removeCleanup?.();
  }
  host.runtime.lifecycle.onCleanup(cleanup);

  return Object.freeze({ ready, profile, mount, cleanup, record, reward, mode, perk, isMode, hasPerk, showToast, openHub, closeHub, startPressure, resetPressure, stopPressure, onChange, save });
}
