import {
  createArcade,
  requestAnimationFrame,
  cancelAnimationFrame
} from './arcade-kit.js';

const STYLE_ID = 'tend-snake-neon-wilds-v3';
const PROFILE_KEY = 'snake_neon_wilds_profile_v3';
const GRID = 22;
const CAMPAIGN_STAGES = 60;
const GAME_MODES = [
  { id: 'classic', name: 'Classic Growth', icon: '∞', desc: 'Grow without limit, accelerate, and clear rotating run challenges', unlock: 1 },
  { id: 'expedition', name: 'Expedition Missions', icon: '◇', desc: 'A 60-mission campaign with designed objectives and evolving arenas', unlock: 1 },
  { id: 'predator', name: 'Predator Run', icon: '◆', desc: 'A faster survival variant with extra moving sentries', unlock: 6 }
];
const CLASSIC_CHALLENGES = [
  { id: 'length', metric: 'length', title: 'Long Game', detail: 'Reach length {target}', icon: '↗', base: 14, step: 2, reward: 18 },
  { id: 'combo', metric: 'combo', title: 'Chain Hunter', detail: 'Build a {target}× food chain', icon: '×', base: 4, step: 1, reward: 20 },
  { id: 'score', metric: 'score', title: 'Score Surge', detail: 'Score {target} points', icon: '◆', base: 22, step: 6, reward: 22 },
  { id: 'gold', metric: 'gold', title: 'Golden Diet', detail: 'Eat {target} golden food', icon: '★', base: 2, step: 1, reward: 24 },
  { id: 'powers', metric: 'powers', title: 'Wild Energy', detail: 'Activate {target} powers', icon: '⚡', base: 2, step: 1, reward: 26 },
  { id: 'portals', metric: 'portals', title: 'Gate Runner', detail: 'Cross {target} phase gates', icon: '◈', base: 3, step: 1, reward: 28, minTier: 4 }
];
const DIRS = {
  up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 }
};

const WORLDS = [
  { name: 'Verdant Grid', accent: '#34d399', accent2: '#22d3ee', bg: '#07181a', feature: 'Pure routes and combo food' },
  { name: 'Phase Garden', accent: '#60a5fa', accent2: '#8b5cf6', bg: '#08152a', feature: 'Linked phase gates bend the route' },
  { name: 'Pulse Foundry', accent: '#f59e0b', accent2: '#fb7185', bg: '#1b1117', feature: 'Barriers switch on a visible rhythm' },
  { name: 'Sentry Vale', accent: '#a78bfa', accent2: '#38bdf8', bg: '#130d25', feature: 'Patrolling drones cross open lanes' },
  { name: 'Echo Ruins', accent: '#f472b6', accent2: '#22c55e', bg: '#190d1f', feature: 'Fragile trails briefly become hazards' },
  { name: 'Neon Wilds', accent: '#fbbf24', accent2: '#22d3ee', bg: '#171407', feature: 'Every system combines at full speed' }
];

const DEFAULT_PROFILE = {
  currentStage: 1,
  bestStage: 1,
  stageStars: {},
  bestScore: 0,
  bestLength: 3,
  classicBestScore: 0,
  classicBestLength: 3,
  classicRuns: 0,
  classicChallenges: 0,
  classicChallengeStreak: 0,
  classicBestStreak: 0,
  endlessBest: 0,
  attempts: {},
  totalFood: 0,
  totalShards: 0
};

function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
function key(x, y) { return `${x},${y}`; }
function same(a, b) { return a && b && a.x === b.x && a.y === b.y; }
function opposite(a, b) { return a && b && a.x === -b.x && a.y === -b.y; }
function distance(a, b) { return Math.abs(a.x - b.x) + Math.abs(a.y - b.y); }
function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html != null) node.innerHTML = html;
  return node;
}
function seeded(seed) {
  let s = seed >>> 0;
  return () => {
    s += 0x6D2B79F5;
    let t = s;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function shuffle(list, random) {
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
function worldForStage(stage) { return WORLDS[Math.floor((stage - 1) / 10) % WORLDS.length]; }
function normalizeModeId(id) { return id === 'endless' ? 'classic' : (id || 'classic'); }
function isClassicMode(id) { return normalizeModeId(id) === 'classic'; }
function modeDefinition(id) { return GAME_MODES.find(item => item.id === normalizeModeId(id)) || GAME_MODES[0]; }
function classicTierForLength(length) { return clamp(1 + Math.floor((Math.max(3, length) - 3) / 5), 1, 60); }
function classicChallengeFor(tier, runNumber) {
  const available = CLASSIC_CHALLENGES.filter(item => !item.minTier || tier >= item.minTier);
  const source = available[Math.abs((tier * 7 + runNumber * 3) % available.length)];
  const level = Math.max(0, Math.floor((tier - 1) / 4));
  const target = source.base + source.step * level;
  return { ...source, target, detail: source.detail.replace('{target}', target), completed: false };
}
function stageConfig(stage, mode) {
  const normalizedMode = normalizeModeId(mode);
  const classic = normalizedMode === 'classic';
  const world = worldForStage(stage);
  const goal = classic ? 999 : Math.min(24, 7 + Math.floor(stage * 0.34));
  const speed = classic ? 145 : clamp(150 - stage * 1.35 - (normalizedMode === 'predator' ? 16 : 0), 62, 150);
  const shardGoal = stage >= 6 && !classic ? 1 + Math.floor((stage - 6) / 15) : 0;
  const portalGoal = stage >= 12 && !classic ? Math.min(4, 1 + Math.floor((stage - 12) / 12)) : 0;
  const comboGoal = stage >= 4 && !classic ? Math.min(8, 2 + Math.floor(stage / 12)) : 0;
  return {
    stage,
    world,
    title: classic ? 'Classic Growth' : `Mission ${stage}`,
    subtitle: classic ? 'Eat, grow, accelerate, and survive as long as possible.' : world.feature,
    foodGoal: goal,
    shardGoal,
    portalGoal,
    comboGoal,
    speed,
    obstacleCount: classic ? Math.min(26, Math.max(0, Math.floor((stage - 2) * 0.55))) : Math.min(48, Math.max(0, Math.floor((stage - 2) * 0.7))),
    pulseCount: classic ? (stage >= 6 ? Math.min(10, 2 + Math.floor((stage - 6) * 0.28)) : 0) : (stage >= 11 ? Math.min(18, 4 + Math.floor((stage - 11) * 0.45)) : 0),
    sentryCount: classic ? (stage >= 12 ? Math.min(3, 1 + Math.floor((stage - 12) / 14)) : 0) : (stage >= 21 ? Math.min(5, 1 + Math.floor((stage - 21) / 9)) : 0),
    portalPairs: classic ? (stage >= 4 ? 1 : 0) : (stage >= 7 ? Math.min(2, 1 + Math.floor((stage - 7) / 24)) : 0),
    fragileCount: classic ? (stage >= 16 ? Math.min(10, 3 + Math.floor((stage - 16) * 0.25)) : 0) : (stage >= 31 ? Math.min(18, 4 + Math.floor((stage - 31) * 0.5)) : 0),
    wrap: normalizedMode === 'predator' || (!classic && stage % 9 === 0),
    mode: normalizedMode
  };
}

function ensureStyles() {
  let style = document.getElementById(STYLE_ID);
  if (!style) {
    style = document.createElement('style');
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }
  style.textContent = `
@keyframes nw-screen{from{opacity:0;transform:translateY(12px) scale(.99)}to{opacity:1;transform:none}}
@keyframes nw-pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.13);opacity:.78}}
@keyframes nw-toast{0%{opacity:0;transform:translate(-50%,18px)}15%,78%{opacity:1;transform:translate(-50%,0)}100%{opacity:0;transform:translate(-50%,8px)}}
@keyframes nw-pop{0%{opacity:0;transform:translate(-50%,-30%) scale(.65)}25%{opacity:1;transform:translate(-50%,-50%) scale(1.1)}100%{opacity:0;transform:translate(-50%,-82%) scale(1)}}
.nw-root{container-type:inline-size;width:100%;height:100%;min-width:0;min-height:0;position:relative;overflow:hidden;background:radial-gradient(circle at 15% -8%,rgba(52,211,153,.14),transparent 34%),radial-gradient(circle at 93% 8%,rgba(56,189,248,.12),transparent 30%),linear-gradient(180deg,#07101b,#081120 55%,#060b14);color:#f8fafc;font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;user-select:none;-webkit-user-select:none;isolation:isolate}
.nw-root::before{content:"";position:absolute;inset:0;pointer-events:none;opacity:.24;background-image:radial-gradient(circle at 20% 30%,rgba(255,255,255,.6) 0 1px,transparent 1.5px),radial-gradient(circle at 70% 55%,rgba(255,255,255,.35) 0 1px,transparent 1.5px);background-size:83px 91px,113px 107px}
.nw-root *{box-sizing:border-box}.nw-root button{font:inherit}.nw-screen{position:absolute;inset:0;display:flex;flex-direction:column;min-width:0;min-height:0;animation:nw-screen .25s ease}
.nw-menu{padding:14px 16px 13px;overflow-y:auto;overflow-x:hidden;gap:10px;scrollbar-width:thin;scrollbar-color:rgba(148,163,184,.25) transparent}.nw-brand{display:flex;align-items:center;justify-content:space-between;gap:12px}.nw-logo{display:flex;align-items:center;gap:11px}.nw-logo-mark{width:52px;height:52px;border-radius:17px;display:grid;place-items:center;background:linear-gradient(145deg,#34d399,#22d3ee 55%,#3b82f6);box-shadow:0 14px 36px rgba(34,211,238,.24),inset 0 1px rgba(255,255,255,.3)}.nw-logo-mark svg{width:34px;height:34px}.nw-title{font-size:25px;font-weight:950;letter-spacing:-.7px}.nw-kicker{margin-top:4px;color:#8ca0b9;font-size:9px;letter-spacing:2px;text-transform:uppercase;font-weight:850}.nw-profile{display:flex;gap:7px}.nw-chip{min-width:62px;padding:7px 9px;border-radius:13px;border:1px solid rgba(255,255,255,.08);background:rgba(15,23,42,.66);text-align:center}.nw-chip small{display:block;color:#718099;font-size:7px;letter-spacing:1.2px;text-transform:uppercase;font-weight:850}.nw-chip b{display:block;margin-top:2px;font-size:15px}
.nw-hero{padding:14px 15px;border-radius:22px;border:1px solid rgba(255,255,255,.1);background:linear-gradient(145deg,rgba(26,42,69,.77),rgba(10,19,37,.65));box-shadow:0 24px 58px rgba(0,0,0,.32);overflow:hidden;position:relative}.nw-hero-line{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}.nw-stage-tag{color:#67e8f9;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;font-weight:900}.nw-stage-name{font-size:29px;font-weight:950;margin-top:3px;letter-spacing:-.8px}.nw-stage-desc{margin-top:7px;color:#9aabc1;font-size:10.5px;line-height:1.45;max-width:300px}.nw-stage-orb{width:70px;height:70px;border-radius:50%;display:grid;place-items:center;font-size:25px;font-weight:950;background:radial-gradient(circle at 34% 25%,#fff 0 4%,var(--accent) 7%,var(--accent2) 55%,#0f172a);box-shadow:0 0 0 9px rgba(34,211,238,.08),0 0 35px color-mix(in srgb,var(--accent) 40%,transparent)}.nw-objectives{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px}.nw-pill{padding:7px 10px;border-radius:999px;border:1px solid rgba(255,255,255,.08);background:rgba(2,6,23,.42);font-size:9px;color:#cbd5e1;font-weight:800}.nw-preview{height:118px;margin-top:10px;border-radius:18px;border:1px solid rgba(255,255,255,.07);position:relative;overflow:hidden;background:radial-gradient(circle at 50% 48%,rgba(34,211,238,.11),rgba(4,9,20,.88) 62%)}.nw-preview-grid{position:absolute;inset:12px;display:grid;grid-template-columns:repeat(11,1fr);grid-template-rows:repeat(7,1fr);gap:4px;opacity:.95}.nw-preview-cell{border-radius:5px;background:rgba(255,255,255,.025)}.nw-preview-snake{background:linear-gradient(145deg,#6ee7b7,#10b981);box-shadow:0 0 10px rgba(52,211,153,.42)}.nw-preview-food{background:radial-gradient(circle at 35% 28%,#fff,#fb7185 28%,#be123c);box-shadow:0 0 14px rgba(251,113,133,.65)}.nw-preview-wall{background:linear-gradient(145deg,#334155,#111827);border:1px solid rgba(148,163,184,.24)}.nw-preview-portal{border:2px solid #60a5fa;background:rgba(96,165,250,.12);box-shadow:0 0 14px rgba(96,165,250,.5)}
.nw-play{width:100%;min-height:48px;margin-top:10px;border:1px solid rgba(255,255,255,.14);border-radius:15px;color:#fff;cursor:pointer;font-weight:950;text-transform:uppercase;letter-spacing:1.1px;background:linear-gradient(115deg,#10b981,#06b6d4 55%,#3b82f6);box-shadow:0 13px 32px rgba(6,182,212,.24),inset 0 1px rgba(255,255,255,.22)}.nw-mode-tabs{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;gap:8px!important;padding:6px!important;border:1px solid rgba(103,232,249,.14)!important;border-radius:18px!important;background:linear-gradient(145deg,rgba(2,6,23,.78),rgba(15,23,42,.62))!important;box-shadow:inset 0 1px rgba(255,255,255,.035)!important}.nw-mode-tab{appearance:none!important;-webkit-appearance:none!important;width:100%!important;min-width:0!important;min-height:58px!important;display:grid!important;grid-template-columns:36px minmax(0,1fr) 20px!important;align-items:center!important;gap:8px!important;padding:8px 9px!important;border:1px solid rgba(255,255,255,.075)!important;border-radius:13px!important;background:rgba(255,255,255,.035)!important;color:#91a1b8!important;cursor:pointer!important;text-align:left!important;text-transform:none!important;letter-spacing:0!important;box-shadow:none!important;transition:transform .15s ease,border-color .15s ease,background .15s ease,color .15s ease!important}.nw-mode-tab:hover{transform:translateY(-1px)!important;border-color:rgba(103,232,249,.24)!important;background:rgba(255,255,255,.055)!important}.nw-mode-tab.active{color:#f0fdfa!important;border-color:rgba(45,212,191,.48)!important;background:linear-gradient(120deg,rgba(16,185,129,.22),rgba(6,182,212,.15))!important;box-shadow:inset 0 0 0 1px rgba(103,232,249,.08),0 8px 22px rgba(6,182,212,.09)!important}.nw-mode-icon{width:36px;height:36px;border-radius:11px;display:grid;place-items:center;background:rgba(15,23,42,.72);border:1px solid rgba(255,255,255,.08);font-size:18px;font-weight:950;color:#67e8f9}.nw-mode-tab.active .nw-mode-icon{background:linear-gradient(145deg,rgba(16,185,129,.42),rgba(6,182,212,.34));color:#ecfeff;border-color:rgba(103,232,249,.3)}.nw-mode-copy{min-width:0;display:block}.nw-mode-copy b{display:block;font-size:10.5px;line-height:1.15;font-weight:950;color:inherit;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.nw-mode-copy small{display:block;margin-top:3px;font-size:7.5px;line-height:1.2;color:#708199;font-weight:750;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.nw-mode-tab.active .nw-mode-copy small{color:#9ccfd1}.nw-mode-check{width:18px;height:18px;border-radius:50%;display:grid;place-items:center;border:1px solid rgba(255,255,255,.12);color:transparent;font-size:10px;font-weight:950}.nw-mode-tab.active .nw-mode-check{color:#052e2b;background:#5eead4;border-color:#99f6e4}.nw-menu-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}.nw-card{min-width:0;border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:12px;background:rgba(15,23,42,.58)}.nw-card-head{display:flex;align-items:center;justify-content:space-between;color:#6f819c;font-size:8px;letter-spacing:1.3px;text-transform:uppercase;font-weight:900}.nw-card strong{display:block;margin-top:7px;font-size:14px}.nw-card p{margin:4px 0 0;color:#8392a7;font-size:9px;line-height:1.42}.nw-secondary{width:100%;min-height:34px;margin-top:9px;border-radius:10px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.045);color:#cbd5e1;cursor:pointer;font-size:9px;font-weight:850}.nw-stage-nav{display:flex;align-items:center;gap:8px}.nw-stage-nav button{width:38px;height:38px;border-radius:11px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.045);color:#e2e8f0;cursor:pointer;font-size:18px}.nw-stage-nav div{flex:1;text-align:center}.nw-stage-nav small{display:block;color:#687791;font-size:7px;text-transform:uppercase;letter-spacing:1px;font-weight:850}.nw-stage-nav b{display:block;margin-top:2px;font-size:15px}.nw-daily{display:flex;align-items:center;gap:11px;padding:11px 12px;border-radius:16px;border:1px solid rgba(34,211,238,.16);background:linear-gradient(110deg,rgba(8,47,73,.45),rgba(15,23,42,.58))}.nw-daily-icon{width:42px;height:42px;border-radius:13px;display:grid;place-items:center;background:rgba(34,211,238,.12);color:#67e8f9}.nw-daily-copy{flex:1;min-width:0}.nw-daily-copy b{display:block;font-size:11px}.nw-daily-copy span{display:block;margin-top:2px;color:#94a3b8;font-size:9px}.nw-daily em{font-style:normal;color:#fbbf24;font-size:10px;font-weight:900}
.nw-game{padding:8px;gap:6px}.nw-top{flex:0 0 auto;border:1px solid rgba(255,255,255,.09);border-radius:16px;padding:8px 9px;background:rgba(7,13,28,.78);backdrop-filter:blur(14px)}.nw-top-row{display:flex;align-items:center;gap:7px}.nw-icon-btn{width:34px;height:34px;border-radius:10px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.05);color:#cbd5e1;cursor:pointer;display:grid;place-items:center;font-weight:900;flex:0 0 auto}.nw-level-info{min-width:88px}.nw-level-info b{display:block;font-size:12px}.nw-level-info span{display:block;margin-top:3px;color:#64748b;font-size:7px;text-transform:uppercase;letter-spacing:.9px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.nw-stats{display:flex;flex:1;justify-content:center;min-width:0}.nw-stat{min-width:55px;padding:0 6px;text-align:center;border-left:1px solid rgba(255,255,255,.06)}.nw-stat small{display:block;color:#64748b;font-size:6.5px;text-transform:uppercase;letter-spacing:.9px;font-weight:850}.nw-stat b{display:block;margin-top:2px;font-size:15px;font-variant-numeric:tabular-nums}.nw-progress{display:flex;gap:5px;margin-top:7px}.nw-progress-card{flex:1;min-width:0;padding:5px 7px;border-radius:9px;border:1px solid rgba(255,255,255,.055);background:rgba(255,255,255,.033)}.nw-progress-line{display:flex;justify-content:space-between;gap:5px;font-size:7px;color:#94a3b8;font-weight:800}.nw-progress-line b{color:#e2e8f0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.nw-track{height:4px;margin-top:4px;border-radius:4px;background:rgba(255,255,255,.055);overflow:hidden}.nw-track i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#34d399,#22d3ee,#8b5cf6);transition:width .3s}
.nw-charge{display:flex;align-items:center;gap:8px;padding:7px 9px;border-radius:12px;border:1px solid rgba(34,211,238,.1);background:rgba(8,47,73,.22)}.nw-charge span{font-size:7px;text-transform:uppercase;letter-spacing:1px;color:#67e8f9;font-weight:900}.nw-charge .nw-track{flex:1;margin:0;height:7px}.nw-charge b{min-width:34px;text-align:right;font-size:8px;color:#c4b5fd}.nw-main{flex:1;min-height:0;display:flex;align-items:center;justify-content:center}.nw-board-shell{position:relative;width:min(100%,calc(100dvh - 242px));max-width:620px;aspect-ratio:1;border-radius:22px;padding:8px;background:linear-gradient(145deg,rgba(22,39,65,.9),rgba(4,10,24,.98));border:1px solid rgba(255,255,255,.1);box-shadow:0 28px 70px rgba(0,0,0,.48),0 0 55px rgba(34,211,238,.08),inset 0 1px rgba(255,255,255,.08)}.nw-canvas{display:block;width:100%;height:100%;border-radius:16px;touch-action:none}.nw-side{display:none}.nw-bottom{display:grid;grid-template-columns:minmax(0,1.25fr) repeat(3,minmax(0,1fr));gap:6px}.nw-tool{min-width:0;padding:8px 4px;border-radius:13px;border:1px solid rgba(255,255,255,.08);background:rgba(15,23,42,.64);color:#94a3b8;text-align:center;cursor:pointer}.nw-tool:disabled{opacity:.42;cursor:not-allowed}.nw-tool b{display:block;font-size:8px;color:#e2e8f0}.nw-tool span{display:block;margin-top:3px;font-size:6.5px}.nw-swipe{position:absolute;left:50%;bottom:12px;z-index:12;transform:translateX(-50%);display:none;grid-template-columns:42px 42px 42px;grid-template-rows:42px 42px 42px;gap:5px}.nw-dpad{border-radius:12px;border:1px solid rgba(255,255,255,.12);background:rgba(3,9,24,.72);color:#f8fafc;display:grid;place-items:center;font-size:18px;backdrop-filter:blur(8px)}.nw-dpad.up{grid-column:2;grid-row:1}.nw-dpad.left{grid-column:1;grid-row:2}.nw-dpad.right{grid-column:3;grid-row:2}.nw-dpad.down{grid-column:2;grid-row:3}.nw-toast{position:absolute;left:50%;bottom:76px;z-index:1200;transform:translateX(-50%);padding:10px 13px;border-radius:999px;background:rgba(4,9,24,.86);border:1px solid rgba(255,255,255,.1);font-size:9px;font-weight:850;pointer-events:none;animation:nw-toast 1.5s ease forwards}.nw-pop{position:absolute;z-index:20;left:50%;top:50%;pointer-events:none;font-size:25px;font-weight:950;color:#fff;text-shadow:0 0 22px #22d3ee,0 3px 10px rgba(0,0,0,.7);animation:nw-pop .82s ease forwards}.nw-overlay{position:absolute;inset:0;z-index:1400;display:grid;place-items:center;padding:14px;background:rgba(2,6,23,.77);backdrop-filter:blur(14px)}.nw-modal{width:min(420px,100%);max-height:calc(100% - 8px);overflow:auto;padding:20px;border-radius:23px;border:1px solid rgba(255,255,255,.12);background:linear-gradient(160deg,rgba(22,31,58,.98),rgba(8,12,28,.98));box-shadow:0 30px 90px rgba(0,0,0,.65),inset 0 1px rgba(255,255,255,.08)}.nw-modal h2{text-align:center;margin:0;font-size:24px}.nw-modal>p{text-align:center;margin:7px auto 0;color:#94a3b8;font-size:10px;line-height:1.5;max-width:340px}.nw-stars{text-align:center;margin:13px 0 8px;font-size:30px;letter-spacing:5px;color:#fbbf24}.nw-breakdown{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin:11px 0}.nw-breakdown div{padding:9px 5px;border-radius:11px;border:1px solid rgba(255,255,255,.06);background:rgba(255,255,255,.035);text-align:center}.nw-breakdown small{display:block;color:#64748b;font-size:7px;text-transform:uppercase;letter-spacing:.8px;font-weight:850}.nw-breakdown b{display:block;margin-top:3px;font-size:14px}.nw-actions{display:flex;gap:8px;margin-top:14px}.nw-actions button{flex:1;min-height:42px;border-radius:13px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.05);color:#cbd5e1;cursor:pointer;font-weight:900;font-size:10px}.nw-actions button.primary{background:linear-gradient(115deg,#10b981,#06b6d4,#3b82f6);color:#fff}.nw-help{text-align:left!important}.nw-help h3{margin:12px 0 4px;color:#67e8f9;font-size:10px;text-transform:uppercase;letter-spacing:1px}.nw-help p,.nw-help li{color:#cbd5e1;font-size:9px;line-height:1.55}.nw-paused{display:none;position:absolute;inset:0;z-index:1000;place-items:center;background:rgba(2,6,23,.68);backdrop-filter:blur(8px);font-size:20px;font-weight:950;text-transform:uppercase;letter-spacing:2px}.nw-root.is-paused .nw-paused{display:grid}
@container (max-width:620px){.nw-brand{margin-bottom:1px}.nw-stage-name{font-size:25px}.nw-stage-desc{margin-top:5px}.nw-stage-orb{width:60px;height:60px;font-size:22px}.nw-pill{padding:6px 8px}.nw-preview{height:108px}.nw-menu-side{display:block}.nw-menu-grid{gap:7px}.nw-card{padding:10px}.nw-card p{display:none}.nw-secondary{margin-top:7px}.nw-daily{padding:9px 10px}.nw-daily-icon{width:36px;height:36px}}
@container (max-width:430px){.nw-menu{padding:13px;gap:10px}.nw-logo-mark{width:45px;height:45px}.nw-title{font-size:21px}.nw-profile{gap:4px}.nw-chip{min-width:50px;padding:6px}.nw-stage-name{font-size:23px}.nw-preview{height:145px}.nw-menu-grid{grid-template-columns:1fr}.nw-game{padding:5px;padding-bottom:max(58px,env(safe-area-inset-bottom));gap:4px}.nw-top{padding:6px}.nw-stat{min-width:42px;padding:0 4px}.nw-stat b{font-size:13px}.nw-level-info{min-width:68px}.nw-progress{gap:3px}.nw-progress-card{padding:4px}.nw-board-shell{width:min(100%,calc(100dvh - 245px));padding:5px;border-radius:18px}.nw-bottom{grid-template-columns:1.25fr repeat(3,1fr);gap:4px}.nw-tool{padding:6px 2px}.nw-swipe{display:grid}.nw-board-shell{margin-bottom:52px}}
@container (min-width:900px) and (min-height:650px){.nw-menu{display:grid;grid-template-columns:minmax(420px,650px) minmax(330px,410px);grid-template-rows:auto 1fr auto;justify-content:center;align-content:center;column-gap:22px;padding:28px 38px}.nw-brand{grid-column:1/-1}.nw-hero{grid-column:1;grid-row:2;padding:24px;display:flex;flex-direction:column;justify-content:center}.nw-stage-name{font-size:39px}.nw-stage-desc{font-size:13px;max-width:430px}.nw-stage-orb{width:92px;height:92px;font-size:32px}.nw-preview{flex:1;min-height:250px}.nw-play{min-height:56px;margin-top:16px}.nw-menu-side{grid-column:2;grid-row:2;display:flex;flex-direction:column;gap:11px}.nw-menu-grid{grid-template-columns:1fr}.nw-daily{grid-column:1/-1}.nw-game{display:grid;grid-template-columns:220px minmax(520px,700px) 210px;grid-template-rows:auto auto minmax(0,1fr);grid-template-areas:"top top top" "charge charge charge" "side board tools";justify-content:center;align-content:center;gap:10px;padding:14px 20px}.nw-top{grid-area:top;max-width:1150px;width:100%;justify-self:center}.nw-charge{grid-area:charge;max-width:1150px;width:100%;justify-self:center}.nw-main{grid-area:board}.nw-board-shell{width:min(100%,72vh);max-width:700px}.nw-side{display:flex;grid-area:side;align-self:center;flex-direction:column;gap:10px}.nw-side-card{padding:13px;border-radius:16px;border:1px solid rgba(255,255,255,.08);background:rgba(15,23,42,.62)}.nw-side-card small{display:block;color:#64748b;font-size:8px;text-transform:uppercase;letter-spacing:1.1px;font-weight:900}.nw-side-card b{display:block;margin-top:4px;font-size:17px}.nw-side-card p{margin:6px 0 0;color:#8492a7;font-size:9px;line-height:1.45}.nw-bottom{grid-area:tools;display:flex;flex-direction:column;align-self:center}.nw-tool{min-height:66px;display:grid;place-items:center}.nw-tool b{font-size:11px}.nw-tool span{font-size:8px}}
.nw-root.is-wide .nw-menu{display:grid;grid-template-columns:minmax(420px,650px) minmax(330px,410px);grid-template-rows:auto 1fr auto;justify-content:center;align-content:center;column-gap:22px;padding:24px 32px}.nw-root.is-wide .nw-brand{grid-column:1/-1}.nw-root.is-wide .nw-hero{grid-column:1;grid-row:2;padding:22px;display:flex;flex-direction:column;justify-content:center}.nw-root.is-wide .nw-stage-name{font-size:37px}.nw-root.is-wide .nw-stage-desc{font-size:12px;max-width:430px}.nw-root.is-wide .nw-stage-orb{width:88px;height:88px;font-size:31px}.nw-root.is-wide .nw-preview{flex:1;min-height:220px;height:auto}.nw-root.is-wide .nw-play{min-height:54px;margin-top:14px}.nw-root.is-wide .nw-menu-side{grid-column:2;grid-row:2;display:flex;flex-direction:column;gap:10px}.nw-root.is-wide .nw-menu-grid{grid-template-columns:1fr}.nw-root.is-wide .nw-daily{grid-column:1/-1}.nw-root.is-wide .nw-game{display:grid;grid-template-columns:210px minmax(480px,620px) 200px;grid-template-rows:auto auto minmax(0,1fr);grid-template-areas:"top top top" "charge charge charge" "side board tools";justify-content:center;align-content:center;gap:10px;padding:10px 18px}.nw-root.is-wide .nw-top{grid-area:top;max-width:1080px;width:100%;justify-self:center}.nw-root.is-wide>.nw-screen>.nw-charge{grid-area:charge;max-width:1080px;width:100%;justify-self:center}.nw-root.is-wide .nw-main{grid-area:board}.nw-root.is-wide .nw-board-shell{width:min(100%,66vh);max-width:620px}.nw-root.is-wide .nw-side{display:flex;grid-area:side;align-self:center;flex-direction:column;gap:9px}.nw-root.is-wide .nw-side-card{padding:12px;border-radius:15px;border:1px solid rgba(255,255,255,.08);background:rgba(15,23,42,.62)}.nw-root.is-wide .nw-side-card small{display:block;color:#64748b;font-size:8px;text-transform:uppercase;letter-spacing:1.1px;font-weight:900}.nw-root.is-wide .nw-side-card b{display:block;margin-top:4px;font-size:16px}.nw-root.is-wide .nw-side-card p{margin:5px 0 0;color:#8492a7;font-size:8.5px;line-height:1.42}.nw-root.is-wide .nw-bottom{grid-area:tools;display:flex;flex-direction:column;align-self:center}.nw-root.is-wide .nw-bottom>.nw-charge{display:none}.nw-root.is-wide .nw-tool{min-height:62px;display:grid;place-items:center}.nw-root.is-wide .nw-tool b{font-size:10px}.nw-root.is-wide .nw-tool span{font-size:7.5px}
`;
}

class SnakeEngine {
  constructor(config, seed, perkId) {
    this.config = config;
    this.random = seeded(seed);
    this.perkId = perkId;
    this.reset();
  }
  reset() {
    const c = Math.floor(GRID / 2);
    this.snake = [{ x: c, y: c }, { x: c - 1, y: c }, { x: c - 2, y: c }];
    this.direction = DIRS.right;
    this.pending = DIRS.right;
    this.food = null;
    this.pickup = null;
    this.score = 0;
    this.foodEaten = 0;
    this.shards = 0;
    this.portalsUsed = 0;
    this.goldEaten = 0;
    this.rushEaten = 0;
    this.powersUsed = 0;
    this.combo = 0;
    this.bestCombo = 0;
    this.lastFoodTick = -999;
    this.tickCount = 0;
    this.alive = true;
    this.paused = false;
    this.grow = 0;
    this.charge = this.perkId === 'magnet' ? 18 : 0;
    this.phaseShield = this.perkId === 'shield';
    this.rescuesUsed = 0;
    this.overdriveTicks = 0;
    this.classicMilestones = new Set();
    this.freezeTicks = 0;
    this.obstacles = new Set();
    this.pulseCells = new Set();
    this.fragile = new Map();
    this.portals = [];
    this.sentries = [];
    this.generateArena();
    this.spawnFood();
    this.spawnPickup();
  }
  inside(x, y) { return x >= 0 && y >= 0 && x < GRID && y < GRID; }
  wrapCell(cell) {
    if (!this.config.wrap) return cell;
    return { x: (cell.x + GRID) % GRID, y: (cell.y + GRID) % GRID };
  }
  snakeSet(ignoreTail = false) {
    const set = new Set();
    const end = this.snake.length - (ignoreTail && this.grow === 0 ? 1 : 0);
    for (let i = 0; i < end; i++) set.add(key(this.snake[i].x, this.snake[i].y));
    return set;
  }
  pulseActive() { return this.freezeTicks <= 0 && Math.floor(this.tickCount / 5) % 2 === 0; }
  blocked(x, y, ignoreTail = false) {
    if (!this.inside(x, y) && !this.config.wrap) return true;
    const cell = this.wrapCell({ x, y });
    const k = key(cell.x, cell.y);
    if (this.snakeSet(ignoreTail).has(k)) return true;
    if (this.obstacles.has(k)) return true;
    if (this.pulseActive() && this.pulseCells.has(k)) return true;
    if (this.fragile.has(k) && this.fragile.get(k) > 0) return true;
    for (const s of this.sentries) if (s.x === cell.x && s.y === cell.y) return true;
    return false;
  }
  safeForArena(x, y) {
    const center = Math.floor(GRID / 2);
    if (Math.abs(x - center) <= 4 && Math.abs(y - center) <= 4) return false;
    return !this.obstacles.has(key(x, y)) && !this.pulseCells.has(key(x, y));
  }
  randomEmpty(excludeFood = true) {
    const occupied = this.snakeSet();
    for (const k of this.obstacles) occupied.add(k);
    for (const k of this.pulseCells) occupied.add(k);
    for (const p of this.portals) occupied.add(key(p.x, p.y));
    for (const s of this.sentries) occupied.add(key(s.x, s.y));
    if (excludeFood && this.food) occupied.add(key(this.food.x, this.food.y));
    if (excludeFood && this.pickup) occupied.add(key(this.pickup.x, this.pickup.y));
    const cells = [];
    for (let y = 0; y < GRID; y++) for (let x = 0; x < GRID; x++) if (!occupied.has(key(x, y))) cells.push({ x, y });
    return cells.length ? cells[Math.floor(this.random() * cells.length)] : null;
  }
  generateArena() {
    const random = this.random;
    const candidates = [];
    for (let y = 1; y < GRID - 1; y++) for (let x = 1; x < GRID - 1; x++) if (this.safeForArena(x, y)) candidates.push({ x, y });
    for (const cell of shuffle(candidates, random).slice(0, this.config.obstacleCount)) this.obstacles.add(key(cell.x, cell.y));
    const pulseCandidates = candidates.filter(c => !this.obstacles.has(key(c.x, c.y)));
    for (const cell of shuffle(pulseCandidates, random).slice(0, this.config.pulseCount)) this.pulseCells.add(key(cell.x, cell.y));
    const fragCandidates = pulseCandidates.filter(c => !this.pulseCells.has(key(c.x, c.y)));
    for (const cell of shuffle(fragCandidates, random).slice(0, this.config.fragileCount)) this.fragile.set(key(cell.x, cell.y), 0);
    const startHead = this.snake[0];
    const farFromStart = cell => cell && distance(cell, startHead) > 6;
    for (let i = 0; i < this.config.portalPairs; i++) {
      let a = null, b = null;
      for (let tries = 0; tries < 40 && !a; tries++) { const candidate = this.randomEmpty(false); if (farFromStart(candidate)) a = candidate; }
      for (let tries = 0; tries < 40 && !b; tries++) { const candidate = this.randomEmpty(false); if (farFromStart(candidate) && a && distance(a, candidate) > 8) b = candidate; }
      if (a && b) this.portals.push({ a, b, color: i });
    }
    for (let i = 0; i < this.config.sentryCount; i++) {
      let spot = null;
      for (let tries = 0; tries < 50 && !spot; tries++) { const candidate = this.randomEmpty(false); if (farFromStart(candidate)) spot = candidate; }
      if (!spot) continue;
      const horizontal = random() > .5;
      this.sentries.push({ x: spot.x, y: spot.y, dx: horizontal ? 1 : 0, dy: horizontal ? 0 : 1, phase: Math.floor(random() * 5) });
    }
  }
  spawnFood() {
    const spot = this.randomEmpty();
    if (!spot) return false;
    const roll = this.random();
    const goldChance = this.perkId === 'magnet' ? .22 : .12;
    this.food = { ...spot, type: roll < goldChance ? 'gold' : roll < goldChance + .06 ? 'rush' : 'normal' };
    return true;
  }
  spawnPickup() {
    if (this.pickup || this.config.shardGoal <= 0 || this.shards >= this.config.shardGoal) return;
    const spot = this.randomEmpty();
    if (spot) this.pickup = { ...spot, type: 'shard' };
  }
  setDirection(next) {
    if (!next || opposite(next, this.direction)) return false;
    this.pending = next;
    return true;
  }
  portalExit(cell) {
    for (const pair of this.portals) {
      if (same(cell, pair.a)) return pair.b;
      if (same(cell, pair.b)) return pair.a;
    }
    return null;
  }
  moveSentries() {
    if (this.freezeTicks > 0) return;
    for (const s of this.sentries) {
      const sentryStride = this.perkId === 'time' ? 3 : 2;
      if ((this.tickCount + s.phase) % sentryStride !== 0) continue;
      let nx = s.x + s.dx, ny = s.y + s.dy;
      if (!this.inside(nx, ny) || this.obstacles.has(key(nx, ny)) || this.pulseCells.has(key(nx, ny))) {
        s.dx *= -1; s.dy *= -1; nx = s.x + s.dx; ny = s.y + s.dy;
      }
      if (this.inside(nx, ny)) { s.x = nx; s.y = ny; }
    }
  }
  usePhase() {
    if (this.charge < 35 || !this.alive) return false;
    this.charge -= 35;
    this.phaseShield = true;
    this.powersUsed++;
    return true;
  }
  useOverdrive() {
    if (this.charge < 60 || !this.alive) return false;
    this.charge -= 60;
    this.overdriveTicks = 18;
    this.powersUsed++;
    return true;
  }
  useFreeze() {
    if (this.charge < 100 || !this.alive) return false;
    this.charge = 0;
    this.freezeTicks = 22;
    this.powersUsed++;
    return true;
  }
  resolveCollision(cell) {
    if (!this.blocked(cell.x, cell.y, true)) return { cell, rescued: false };
    if (this.phaseShield) {
      this.phaseShield = false;
      this.rescuesUsed++;
      const k = key(cell.x, cell.y);
      this.obstacles.delete(k);
      this.pulseCells.delete(k);
      this.fragile.delete(k);
      this.sentries = this.sentries.filter(s => key(s.x, s.y) !== k);
      if (this.snakeSet(true).has(k)) {
        const dirs = shuffle(Object.values(DIRS), this.random);
        for (const dir of dirs) {
          const alt = this.wrapCell({ x: this.snake[0].x + dir.x, y: this.snake[0].y + dir.y });
          if (!this.blocked(alt.x, alt.y, true)) return { cell: alt, rescued: true };
        }
      }
      return { cell: this.wrapCell(cell), rescued: true };
    }
    return null;
  }
  tick() {
    if (!this.alive || this.paused) return { type: 'idle' };
    this.tickCount++;
    if (!opposite(this.pending, this.direction)) this.direction = this.pending;
    this.moveSentries();
    for (const [k, value] of this.fragile) if (value > 0) this.fragile.set(k, value - 1);
    if (this.overdriveTicks > 0) this.overdriveTicks--;
    if (this.freezeTicks > 0) this.freezeTicks--;
    let next = this.wrapCell({ x: this.snake[0].x + this.direction.x, y: this.snake[0].y + this.direction.y });
    const resolved = this.resolveCollision(next);
    if (!resolved) { this.alive = false; return { type: 'death' }; }
    next = resolved.cell;
    let usedPortal = false;
    const exit = this.portalExit(next);
    if (exit && !this.blocked(exit.x, exit.y, true)) { next = { ...exit }; this.portalsUsed++; usedPortal = true; }
    this.snake.unshift(next);
    const fragileKey = key(next.x, next.y);
    if (this.fragile.has(fragileKey) && this.fragile.get(fragileKey) === 0) this.fragile.set(fragileKey, 7);
    let event = resolved.rescued ? 'rescue' : usedPortal ? 'portal' : 'move';
    if (this.food && same(next, this.food)) {
      const quick = this.tickCount - this.lastFoodTick <= 18;
      this.combo = quick ? this.combo + 1 : 1;
      this.bestCombo = Math.max(this.bestCombo, this.combo);
      this.lastFoodTick = this.tickCount;
      const base = this.food.type === 'gold' ? 4 : this.food.type === 'rush' ? 2 : 1;
      const mult = 1 + Math.floor((this.combo - 1) / 3) + (this.overdriveTicks > 0 ? 1 : 0);
      this.score += base * mult;
      this.foodEaten++;
      if (this.food.type === 'gold') this.goldEaten++;
      if (this.food.type === 'rush') this.rushEaten++;
      this.grow += this.food.type === 'gold' ? 2 : 1;
      this.charge = clamp(this.charge + 10 + Math.min(12, this.combo * 2), 0, 100);
      event = this.food.type === 'gold' ? 'gold' : this.food.type === 'rush' ? 'rush' : 'food';
      this.spawnFood();
      this.spawnPickup();
    }
    if (this.pickup && same(next, this.pickup)) {
      this.shards++;
      this.score += 5;
      this.charge = clamp(this.charge + 25, 0, 100);
      this.pickup = null;
      this.spawnPickup();
      event = 'shard';
    }
    if (this.grow > 0) this.grow--; else this.snake.pop();
    return { type: event, rescued: resolved.rescued, portal: usedPortal };
  }
  objectivesComplete() {
    return this.foodEaten >= this.config.foodGoal && this.shards >= this.config.shardGoal && this.portalsUsed >= this.config.portalGoal && this.bestCombo >= this.config.comboGoal;
  }
}

export { SnakeEngine, stageConfig, seeded };

export default function activate(host) {
  const arcade = createArcade(host, {
    name: 'Snake Odyssey: Neon Wilds',
    icon: '◉',
    subtitle: 'Classic endless growth plus 60 mission-based precision challenges',
    modes: GAME_MODES,
    perks: [
      { id: 'shield', name: 'Phase Skin', icon: '◌', desc: 'Begin with one collision rescue', unlock: 1 },
      { id: 'magnet', name: 'Charge Seed', icon: '◎', desc: 'Start with charge and more golden food', unlock: 3 },
      { id: 'time', name: 'Time Weaver', icon: '◷', desc: 'Slower pulse cycles and sentry motion', unlock: 5 }
    ],
    missions: [
      { event: 'classic_challenge', target: 3, title: 'Classic Mastery', detail: 'Clear 3 Classic run challenges', icon: '∞', reward: 120 },
      { event: 'food', target: 100, title: 'Wild Hunger', detail: 'Eat 100 food', icon: '◆', reward: 90 },
      { event: 'portal', target: 20, title: 'Phase Traveler', detail: 'Use 20 gates', icon: '◈', reward: 110 },
      { event: 'shard', target: 18, title: 'Signal Collector', detail: 'Recover 18 shards', icon: '✦', reward: 120 },
      { event: 'level', target: 6, title: 'World Serpent', detail: 'Clear six missions', icon: '◉', reward: 140 }
    ]
  });
  ensureStyles();
  const runtimeTimers = host.runtime.timers;
  const profile = structuredClone(DEFAULT_PROFILE);
  let root = null, canvas = null, ctx = null, resizeObserver = null, layoutObserver = null;
  let game = null, config = null, timer = null, raf = null, screen = 'menu';
  let activeModeId = 'classic', activePerkId = 'shield';
  let classicChallenge = null, classicChallengeCompleted = false;
  let overlay = null, ui = {}, lastFrame = 0, elapsed = 0;
  let canvasW = 500, canvasH = 500, boardRect = { x: 0, y: 0, size: 500, cell: 22 };
  let touchStart = null, removePause = null, removeResume = null;
  let audioCtx = null, audioUnlocked = false;

  arcade.ready.then(() => {
    if (arcade.profile.selectedMode === 'endless') { arcade.profile.selectedMode = 'classic'; arcade.save(); }
    activeModeId = normalizeModeId(arcade.mode()?.id);
    activePerkId = arcade.perk()?.id || 'shield';
  });
  arcade.onChange(state => {
    activeModeId = normalizeModeId(state?.mode?.id || arcade.mode()?.id);
    activePerkId = state?.perk?.id || arcade.perk()?.id || 'shield';
    if (screen === 'menu') renderMenu();
    else arcade.showToast('↻', 'Loadout saved', 'The new mode and perk apply to the next run.');
  });

  function saveProfile() { host.storage.set(PROFILE_KEY, profile).catch(() => {}); }
  async function loadProfile() {
    try {
      const saved = await host.storage.get(PROFILE_KEY);
      if (saved && typeof saved === 'object') Object.assign(profile, saved);
    } catch {}
    if (!profile.stageStars || typeof profile.stageStars !== 'object') profile.stageStars = {};
    if (!profile.attempts || typeof profile.attempts !== 'object') profile.attempts = {};
    profile.currentStage = clamp(Number(profile.currentStage) || 1, 1, CAMPAIGN_STAGES);
    profile.bestStage = clamp(Number(profile.bestStage) || 1, 1, CAMPAIGN_STAGES);
    profile.classicBestScore = Math.max(0, Number(profile.classicBestScore) || Number(profile.endlessBest) || 0);
    profile.classicBestLength = Math.max(3, Number(profile.classicBestLength) || Number(profile.bestLength) || 3);
    profile.classicRuns = Math.max(0, Number(profile.classicRuns) || 0);
    profile.classicChallenges = Math.max(0, Number(profile.classicChallenges) || 0);
    profile.classicChallengeStreak = Math.max(0, Number(profile.classicChallengeStreak) || 0);
    profile.classicBestStreak = Math.max(profile.classicChallengeStreak, Number(profile.classicBestStreak) || 0);
  }
  function clearTimerLoop() {
    if (timer != null) { runtimeTimers.clearTimeout(timer); timer = null; }
    if (raf != null) { cancelAnimationFrame(raf); raf = null; }
  }
  function scheduleTick() {
    if (!game || !game.alive || game.paused || screen !== 'game') return;
    const modifier = activePerkId === 'time' ? 1.12 : 1;
    const chargeSlow = game.freezeTicks > 0 ? 1.45 : 1;
    const growthRamp = isClassicMode(config?.mode) ? clamp(1 - Math.floor(Math.max(0, game.snake.length - 3) / 5) * .055, .48, 1) : 1;
    const delay = config.speed * modifier * chargeSlow * growthRamp;
    timer = runtimeTimers.setTimeout(() => {
      timer = null;
      const result = game.tick();
      handleTickResult(result);
      if (game && game.alive && !game.paused && screen === 'game') scheduleTick();
    }, delay);
  }
  function showToast(text) {
    const node = el('div', 'nw-toast', text);
    root.appendChild(node);
    runtimeTimers.setTimeout(() => node.remove(), 1500);
  }
  function showPop(text) {
    const old = root.querySelector('.nw-pop'); if (old) old.remove();
    const node = el('div', 'nw-pop', text); root.appendChild(node);
    runtimeTimers.setTimeout(() => node.remove(), 850);
  }
  function mode() { return modeDefinition(activeModeId); }
  function perk() { return arcade.perk() || { id:'shield', name:'Phase Skin', icon:'◌', desc:'Begin with one collision rescue' }; }
  function daily() {
    return arcade.profile.daily || { icon:'◆', title:'Wild Hunger', detail:'Eat 100 food', reward:90, claimed:false };
  }

  function unlockAudio() {
    if (!audioCtx) {
      try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch { audioCtx = null; }
    }
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
    audioUnlocked = Boolean(audioCtx);
    return audioCtx;
  }
  function soundVoice(freq, duration=.07, type='sine', volume=.05, delay=0, endFreq=null) {
    const ac = audioUnlocked ? audioCtx : null;
    if (!ac) return;
    const start = ac.currentTime + Math.max(0, delay);
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(Math.max(30, freq), start);
    if (endFreq) osc.frequency.exponentialRampToValueAtTime(Math.max(30, endFreq), start + duration);
    gain.gain.setValueAtTime(Math.max(.0001, volume), start);
    gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
    osc.connect(gain); gain.connect(ac.destination);
    osc.start(start); osc.stop(start + duration + .015);
  }
  const sfx = {
    start() { unlockAudio(); [392,523,659].forEach((f,i)=>soundVoice(f,.12,'triangle',.055,i*.07)); },
    turn() { soundVoice(230,.035,'square',.018,0,280); },
    food(combo=1) { const base=460+Math.min(combo,8)*35; soundVoice(base,.075,'triangle',.055); soundVoice(base*1.5,.08,'sine',.035,.045); },
    gold() { [523,659,784,1047].forEach((f,i)=>soundVoice(f,.11,'sine',.055,i*.045)); },
    rush() { soundVoice(720,.06,'sawtooth',.035,0,1180); soundVoice(980,.08,'triangle',.035,.035); },
    shard() { [760,980,1320].forEach((f,i)=>soundVoice(f,.095,'sine',.05,i*.04)); },
    portal() { soundVoice(230,.18,'sine',.045,0,880); soundVoice(920,.12,'triangle',.04,.08,360); },
    rescue() { [330,440,660,880].forEach((f,i)=>soundVoice(f,.11,'triangle',.05,i*.045)); },
    power(type) { const map={phase:[420,630,840],overdrive:[520,780,1040,1380],freeze:[920,690,460]}; (map[type]||[520,780]).forEach((f,i)=>soundVoice(f,.1,type==='freeze'?'sine':'triangle',.05,i*.045)); },
    warning() { soundVoice(180,.09,'square',.028,0,120); },
    death() { [320,250,190,135,90].forEach((f,i)=>soundVoice(f,.16,'sawtooth',.045,i*.075)); },
    complete() { [392,523,659,784,1047,1319].forEach((f,i)=>soundVoice(f,.13,'triangle',.055,i*.06)); },
    milestone() { [440,554,659,880].forEach((f,i)=>soundVoice(f,.1,'triangle',.05,i*.045)); },
    challenge() { [523,659,784,1047,1319].forEach((f,i)=>soundVoice(f,.12,'sine',.055,i*.05)); },
    pause() { soundVoice(300,.06,'sine',.035); },
    resume() { soundVoice(300,.06,'sine',.035); soundVoice(450,.07,'sine',.035,.05); }
  };

  function previewMarkup(stage) {
    const cells = [];
    for (let i = 0; i < 77; i++) cells.push('<i class="nw-preview-cell"></i>');
    const indexes = [36,37,38,39,40,51,52];
    indexes.forEach(i => cells[i] = '<i class="nw-preview-cell nw-preview-snake"></i>');
    cells[27] = '<i class="nw-preview-cell nw-preview-food"></i>';
    if (stage >= 7) { cells[13] = '<i class="nw-preview-cell nw-preview-portal"></i>'; cells[63] = '<i class="nw-preview-cell nw-preview-portal"></i>'; }
    if (stage >= 11) [9,10,20,21,54,65].forEach(i => cells[i] = '<i class="nw-preview-cell nw-preview-wall"></i>');
    return cells.join('');
  }
  function objectivePills(cfg) {
    if (isClassicMode(cfg.mode)) {
      const challenge = classicChallengeFor(cfg.stage, profile.classicRuns + 1);
      return [`∞ Grow without limit`, `${challenge.icon} ${challenge.detail}`, `↗ Best length ${profile.classicBestLength}`].map(text => `<span class="nw-pill">${text}</span>`).join('');
    }
    const list = [`◆ ${cfg.foodGoal} food`];
    if (cfg.shardGoal) list.push(`✦ ${cfg.shardGoal} shard${cfg.shardGoal > 1 ? 's' : ''}`);
    if (cfg.portalGoal) list.push(`◈ ${cfg.portalGoal} gate${cfg.portalGoal > 1 ? 's' : ''}`);
    if (cfg.comboGoal) list.push(`×${cfg.comboGoal} chain`);
    return list.map(text => `<span class="nw-pill">${text}</span>`).join('');
  }
  function renderMenu() {
    screen = 'menu'; clearTimerLoop();
    if (resizeObserver) { resizeObserver.disconnect(); resizeObserver = null; }
    const classicTier = classicTierForLength(profile.classicBestLength);
    const cfg = stageConfig(isClassicMode(activeModeId) ? classicTier : profile.currentStage, activeModeId);
    const world = cfg.world;
    const currentMode = mode();
    const currentPerk = perk();
    const dailyMission = daily();
    root.innerHTML = '';
    const menu = el('div', 'nw-screen nw-menu');
    menu.style.setProperty('--accent', world.accent); menu.style.setProperty('--accent2', world.accent2);
    menu.innerHTML = `
      <div class="nw-brand"><div class="nw-logo"><div class="nw-logo-mark"><svg viewBox="0 0 64 64" aria-hidden="true"><path d="M10 39c5-16 20-24 34-18 9 4 13 13 8 20-5 8-18 6-23 0-4-5-2-12 5-14" fill="none" stroke="#ecfdf5" stroke-width="7" stroke-linecap="round"/><path d="M44 21c9-1 16 4 17 11-4 4-9 6-15 5" fill="#d1fae5"/><circle cx="54" cy="29" r="2.2" fill="#052e2b"/><path d="m61 33 4-2m-4 2 4 2" stroke="#fb7185" stroke-width="1.5" stroke-linecap="round"/></svg></div><div><div class="nw-title">Snake Odyssey</div><div class="nw-kicker">Neon Wilds</div></div></div><div class="nw-profile"><div class="nw-chip"><small>Best</small><b>${profile.bestScore}</b></div><div class="nw-chip"><small>Stars</small><b style="color:#fbbf24">★ ${Object.values(profile.stageStars).reduce((a,b)=>a+(b||0),0)}</b></div></div></div>
      <div class="nw-mode-tabs" role="group" aria-label="Choose game type"><button type="button" class="nw-mode-tab ${isClassicMode(activeModeId)?'active':''}" data-mode-select="classic" aria-pressed="${isClassicMode(activeModeId)}"><span class="nw-mode-icon">∞</span><span class="nw-mode-copy"><b>Classic Growth</b><small>Endless snake & challenges</small></span><span class="nw-mode-check">✓</span></button><button type="button" class="nw-mode-tab ${activeModeId==='expedition'?'active':''}" data-mode-select="expedition" aria-pressed="${activeModeId==='expedition'}"><span class="nw-mode-icon">◇</span><span class="nw-mode-copy"><b>Expedition</b><small>60 designed missions</small></span><span class="nw-mode-check">✓</span></button></div>
      <section class="nw-hero"><div class="nw-hero-line"><div><div class="nw-stage-tag">${isClassicMode(activeModeId) ? `Classic tier ${cfg.stage}` : `${currentMode.name} · World ${Math.floor((cfg.stage-1)/10)+1}`}</div><div class="nw-stage-name">${isClassicMode(activeModeId) ? 'Endless Serpent' : world.name}</div><div class="nw-stage-desc">${cfg.subtitle}</div></div><div class="nw-stage-orb">${isClassicMode(activeModeId) ? profile.classicBestLength : profile.currentStage}</div></div><div class="nw-objectives">${objectivePills(cfg)}</div><button class="nw-play" data-action="play">${isClassicMode(activeModeId) ? 'Start Classic Growth' : activeModeId === 'expedition' ? `Play mission ${profile.currentStage}` : `Start ${currentMode.name}`}</button><div class="nw-preview"><div class="nw-preview-grid">${previewMarkup(cfg.stage)}</div></div></section>
      <div class="nw-menu-side"><div class="nw-menu-grid"><div class="nw-card"><div class="nw-card-head"><span>Game mode</span><b>${currentMode.icon}</b></div><strong>${currentMode.name}</strong><p>${currentMode.desc}</p><button class="nw-secondary" data-action="arcade">Modes & perks</button></div><div class="nw-card"><div class="nw-card-head"><span>Active perk</span><b>${currentPerk.icon}</b></div><strong>${currentPerk.name}</strong><p>${currentPerk.desc}</p><button class="nw-secondary" data-action="arcade">Change loadout</button></div></div>${isClassicMode(activeModeId) ? `<div class="nw-card"><div class="nw-card-head"><span>Classic records</span><b>∞</b></div><div class="nw-stage-nav"><div><small>Best length</small><b>${profile.classicBestLength}</b></div><div><small>Best score</small><b>${profile.classicBestScore}</b></div><div><small>Challenge streak</small><b>${profile.classicChallengeStreak}</b></div></div></div>` : `<div class="nw-card"><div class="nw-card-head"><span>Campaign navigator</span><b>${profile.bestStage}/${CAMPAIGN_STAGES}</b></div><div class="nw-stage-nav"><button data-action="previous">‹</button><div><small>Selected mission</small><b>${profile.currentStage}</b></div><button data-action="next">›</button></div></div></div>`}</div>
      <div class="nw-daily"><div class="nw-daily-icon">${dailyMission.icon}</div><div class="nw-daily-copy"><b>${dailyMission.title}</b><span>${dailyMission.detail}</span></div><em>${dailyMission.claimed ? '✓' : `◆ ${dailyMission.reward}`}</em></div>`;
    root.appendChild(menu);
    menu.querySelectorAll('[data-mode-select]').forEach(button => button.addEventListener('click', () => {
      const nextMode = button.dataset.modeSelect;
      arcade.profile.selectedMode = nextMode;
      arcade.save();
      activeModeId = nextMode;
      renderMenu();
    }));
    menu.querySelector('[data-action="play"]').addEventListener('click', () => { sfx.start(); startRun(); });
    menu.querySelectorAll('[data-action="arcade"]').forEach(btn => btn.addEventListener('click', () => arcade.openHub()));
    menu.querySelector('[data-action="previous"]')?.addEventListener('click', () => { profile.currentStage = Math.max(1, profile.currentStage - 1); saveProfile(); renderMenu(); });
    menu.querySelector('[data-action="next"]')?.addEventListener('click', () => { profile.currentStage = Math.min(profile.bestStage, profile.currentStage + 1); saveProfile(); renderMenu(); });
  }

  function runSeed(stage) {
    const attempt = (profile.attempts[stage] || 0) + 1;
    profile.attempts[stage] = attempt; saveProfile();
    return stage * 104729 + attempt * 7919 + 33811;
  }
  function startRun() {
    screen = 'game'; clearTimerLoop();
    if (resizeObserver) { resizeObserver.disconnect(); resizeObserver = null; }
    activeModeId = normalizeModeId(arcade.mode()?.id); activePerkId = arcade.perk()?.id || 'shield';
    const stage = isClassicMode(activeModeId) ? classicTierForLength(profile.classicBestLength) : profile.currentStage;
    config = stageConfig(stage, activeModeId);
    classicChallenge = isClassicMode(activeModeId) ? classicChallengeFor(stage, profile.classicRuns + 1) : null;
    classicChallengeCompleted = false;
    if (isClassicMode(activeModeId)) profile.classicRuns++;
    if (activeModeId === 'predator') config.sentryCount += 2;
    game = new SnakeEngine(config, runSeed(stage), activePerkId);
    elapsed = 0; lastFrame = performance.now();
    renderGame(); scheduleTick(); startRenderLoop(); arcade.record('start',1);
  }
  function exitRunToMenu() {
    if (game && game.alive && isClassicMode(config?.mode) && !classicChallengeCompleted) {
      profile.classicChallengeStreak = 0;
      saveProfile();
    }
    renderMenu();
  }
  function renderGame() {
    root.innerHTML = '';
    const view = el('div', 'nw-screen nw-game');
    view.innerHTML = `
      <div class="nw-top"><div class="nw-top-row"><button class="nw-icon-btn" data-action="menu">‹</button><div class="nw-level-info"><b>${isClassicMode(config.mode) ? 'Classic Growth' : `Mission ${config.stage}`}</b><span>${config.world.name}</span></div><div class="nw-stats"><div class="nw-stat"><small>Score</small><b id="nw-score">0</b></div><div class="nw-stat"><small>Length</small><b id="nw-length" style="color:#34d399">3</b></div><div class="nw-stat"><small>Chain</small><b id="nw-combo" style="color:#c084fc">0×</b></div></div><button class="nw-icon-btn" data-action="pause">Ⅱ</button><button class="nw-icon-btn" data-action="help">?</button></div><div class="nw-progress" id="nw-objectives"></div></div>
      <div class="nw-charge"><span>Wild charge</span><div class="nw-track"><i id="nw-charge-fill"></i></div><b id="nw-charge-label">0%</b></div>
      <aside class="nw-side"><div class="nw-side-card"><small>World system</small><b>${config.world.name}</b><p>${config.subtitle}</p></div><div class="nw-side-card"><small>Mode</small><b>${mode().name}</b><p>${mode().desc}</p></div><div class="nw-side-card"><small>Perk</small><b>${perk().name}</b><p>${perk().desc}</p></div></aside>
      <main class="nw-main"><div class="nw-board-shell"><canvas class="nw-canvas" id="nw-canvas"></canvas><div class="nw-swipe"><button class="nw-dpad up" data-dir="up">↑</button><button class="nw-dpad left" data-dir="left">←</button><button class="nw-dpad right" data-dir="right">→</button><button class="nw-dpad down" data-dir="down">↓</button></div></div></main>
      <div class="nw-bottom"><div class="nw-charge"><span>Wild charge</span><div class="nw-track"><i id="nw-charge-fill-bottom"></i></div><b id="nw-charge-label-bottom">0%</b></div><button class="nw-tool" data-tool="phase"><b>◌ Phase</b><span>35 charge</span></button><button class="nw-tool" data-tool="overdrive"><b>⚡ Overdrive</b><span>60 charge</span></button><button class="nw-tool" data-tool="freeze"><b>❄ Freeze</b><span>100 charge</span></button></div>
      <div class="nw-paused">Paused</div>`;
    root.appendChild(view);
    canvas = view.querySelector('#nw-canvas'); ctx = canvas.getContext('2d');
    ui = {
      score:view.querySelector('#nw-score'), length:view.querySelector('#nw-length'), combo:view.querySelector('#nw-combo'), objectives:view.querySelector('#nw-objectives'),
      chargeFill:view.querySelector('#nw-charge-fill'), chargeLabel:view.querySelector('#nw-charge-label'), chargeFillBottom:view.querySelector('#nw-charge-fill-bottom'), chargeLabelBottom:view.querySelector('#nw-charge-label-bottom')
    };
    view.querySelector('[data-action="menu"]').addEventListener('click', exitRunToMenu);
    view.querySelector('[data-action="pause"]').addEventListener('click', togglePause);
    view.querySelector('[data-action="help"]').addEventListener('click', showHelp);
    view.querySelectorAll('[data-dir]').forEach(btn => btn.addEventListener('pointerdown', e => { e.preventDefault(); setDirection(btn.dataset.dir); }));
    view.querySelector('[data-tool="phase"]').addEventListener('click', () => useTool('phase'));
    view.querySelector('[data-tool="overdrive"]').addEventListener('click', () => useTool('overdrive'));
    view.querySelector('[data-tool="freeze"]').addEventListener('click', () => useTool('freeze'));
    canvas.addEventListener('pointerdown', onTouchStart); canvas.addEventListener('pointerup', onTouchEnd);
    resizeObserver = new ResizeObserver(resizeCanvas); resizeObserver.observe(canvas.parentElement); resizeCanvas(); updateUi();
  }
  function resizeCanvas() {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvasW = Math.max(280, Math.round(rect.width));
    canvasH = Math.max(280, Math.round(rect.height));
    const nextWidth = Math.round(canvasW * dpr);
    const nextHeight = Math.round(canvasH * dpr);
    if (canvas.width !== nextWidth) canvas.width = nextWidth;
    if (canvas.height !== nextHeight) canvas.height = nextHeight;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const size = Math.min(canvasW, canvasH);
    boardRect = { x:(canvasW-size)/2, y:(canvasH-size)/2, size, cell:size/GRID };
  }
  function classicChallengeProgress() {
    if (!game || !classicChallenge) return 0;
    if (classicChallenge.metric === 'length') return game.snake.length;
    if (classicChallenge.metric === 'combo') return game.bestCombo;
    if (classicChallenge.metric === 'score') return game.score;
    if (classicChallenge.metric === 'gold') return game.goldEaten;
    if (classicChallenge.metric === 'powers') return game.powersUsed;
    if (classicChallenge.metric === 'portals') return game.portalsUsed;
    return 0;
  }
  function nextClassicMilestone() {
    if (!game) return 10;
    return Math.max(10, Math.ceil((game.snake.length + 1) / 5) * 5);
  }
  function checkClassicRewards() {
    if (!game || !isClassicMode(config?.mode)) return;
    const milestone = Math.floor(game.snake.length / 5) * 5;
    if (milestone >= 10 && !game.classicMilestones.has(milestone)) {
      game.classicMilestones.add(milestone);
      const bonus = milestone * 2;
      game.score += bonus;
      game.charge = clamp(game.charge + 18, 0, 100);
      sfx.milestone();
      showPop(`LENGTH ${milestone} · +${bonus}`);
    }
    if (!classicChallengeCompleted && classicChallengeProgress() >= classicChallenge.target) {
      classicChallengeCompleted = true;
      classicChallenge.completed = true;
      game.score += classicChallenge.reward;
      game.charge = clamp(game.charge + 30, 0, 100);
      profile.classicChallenges++;
      profile.classicChallengeStreak++;
      profile.classicBestStreak = Math.max(profile.classicBestStreak, profile.classicChallengeStreak);
      arcade.record('classic_challenge', 1);
      sfx.challenge();
      showPop(`CHALLENGE +${classicChallenge.reward}`);
      showToast(`${classicChallenge.title} complete · charge boosted`);
      saveProfile();
    }
  }

  function objectiveHtml(label, value, target) {
    const pct = target ? clamp(value/target*100,0,100) : 100;
    return `<div class="nw-progress-card"><div class="nw-progress-line"><b>${label}</b><span>${value}/${target}</span></div><div class="nw-track"><i style="width:${pct}%"></i></div></div>`;
  }
  function updateUi() {
    if (!game || screen !== 'game') return;
    ui.score.textContent = game.score; ui.length.textContent = game.snake.length; ui.combo.textContent = `${game.combo}×`;
    const objectiveParts = [];
    if (isClassicMode(config?.mode)) {
      const progress = Math.min(classicChallengeProgress(), classicChallenge?.target || 1);
      objectiveParts.push(objectiveHtml(`${classicChallenge?.icon || '∞'} ${classicChallenge?.title || 'Classic challenge'}`, progress, classicChallenge?.target || 1));
      objectiveParts.push(objectiveHtml('↗ Next length reward', game.snake.length, nextClassicMilestone()));
    } else {
      objectiveParts.push(objectiveHtml('◆ Food', Math.min(game.foodEaten,config.foodGoal),config.foodGoal));
      if (config.shardGoal) objectiveParts.push(objectiveHtml('✦ Shards',game.shards,config.shardGoal));
      if (config.portalGoal) objectiveParts.push(objectiveHtml('◈ Gates',game.portalsUsed,config.portalGoal));
      if (config.comboGoal) objectiveParts.push(objectiveHtml('× Chain',Math.min(game.bestCombo,config.comboGoal),config.comboGoal));
    }
    ui.objectives.innerHTML = objectiveParts.join('');
    [ui.chargeFill,ui.chargeFillBottom].forEach(i=>i.style.width=`${game.charge}%`); [ui.chargeLabel,ui.chargeLabelBottom].forEach(i=>i.textContent=`${Math.round(game.charge)}%`);
    root.querySelector('[data-tool="phase"]').disabled = game.charge < 35; root.querySelector('[data-tool="overdrive"]').disabled = game.charge < 60; root.querySelector('[data-tool="freeze"]').disabled = game.charge < 100;
  }
  function handleTickResult(result) {
    if (!game) return;
    if (result.type === 'death') { sfx.death(); completeRun(false); return; }
    if (result.type === 'food' || result.type === 'gold' || result.type === 'rush') {
      arcade.record('food',1); arcade.record('score',game.score); profile.totalFood++; saveProfile();
      if (result.type === 'gold') sfx.gold(); else if (result.type === 'rush') sfx.rush(); else sfx.food(game.combo);
      showPop(result.type === 'gold' ? 'GOLD +4' : result.type === 'rush' ? 'RUSH +2' : `CHAIN ${game.combo}×`);
    }
    if (result.type === 'shard') { sfx.shard(); arcade.record('shard',1); profile.totalShards++; saveProfile(); showPop('SHARD +5'); }
    if (result.portal) { sfx.portal(); arcade.record('portal',1); showToast('Phase gate crossed'); }
    if (result.rescued) { sfx.rescue(); showToast('Phase Skin prevented a crash'); }
    checkClassicRewards();
    updateUi();
    if (!isClassicMode(config?.mode) && game.objectivesComplete()) { sfx.complete(); completeRun(true); }
  }
  function setDirection(name) {
    if (!game || !DIRS[name]) return;
    unlockAudio();
    const before = game.pending || game.direction;
    const accepted = game.setDirection(DIRS[name]);
    if (accepted !== false && !same(before, DIRS[name])) sfx.turn();
  }
  function togglePause() {
    if (!game || !game.alive) return;
    unlockAudio();
    game.paused = !game.paused;
    root.classList.toggle('is-paused',game.paused);
    clearTimerLoop();
    if (game.paused) sfx.pause();
    else { sfx.resume(); scheduleTick(); startRenderLoop(); }
  }
  function useTool(type) {
    if (!game) return; let used=false;
    if (type==='phase') used=game.usePhase(); if (type==='overdrive') used=game.useOverdrive(); if (type==='freeze') used=game.useFreeze();
    if (used) { unlockAudio(); sfx.power(type); showToast(type==='phase'?'Phase Skin armed':type==='overdrive'?'Overdrive active':'Hazards frozen'); updateUi(); }
  }
  function rating() {
    const clear=20; const efficiency=Math.round(clamp((config.foodGoal/(Math.max(1,game.tickCount/8)))*18,0,28)); const mastery=Math.round(clamp(game.score/(config.foodGoal*2.4)*27,0,27)); const skill=Math.round(clamp(game.bestCombo/8*15 + game.portalsUsed*1.5 + game.shards*2,0,20)); const precision=Math.max(0,5-game.rescuesUsed*3);
    const total=clear+efficiency+mastery+skill+precision; let stars=total>=92?5:total>=78?4:total>=60?3:total>=42?2:1;
    if(stars===5 && !(game.bestCombo>=5 && game.score>=config.foodGoal*2 && game.tickCount<config.foodGoal*16)) stars=4;
    return {stars,total,efficiency,mastery,skill};
  }
  function completeRun(won) {
    clearTimerLoop(); if (!game) return; game.alive=false;
    const score=game.score, length=game.snake.length;
    profile.bestScore=Math.max(profile.bestScore,score); profile.bestLength=Math.max(profile.bestLength,length);
    if (isClassicMode(config?.mode)) {
      profile.classicBestScore=Math.max(profile.classicBestScore,score);
      profile.classicBestLength=Math.max(profile.classicBestLength,length);
      profile.endlessBest=Math.max(profile.endlessBest,score);
      if (!classicChallengeCompleted) profile.classicChallengeStreak=0;
      arcade.record('score',score); arcade.record('fail',1);
      saveProfile();
      overlay=el('div','nw-overlay');
      overlay.innerHTML=`<div class="nw-modal"><h2>Classic run complete</h2><p>Your serpent reached length <b>${length}</b>. Every five-length milestone increases the reward pressure, while the next run rotates to a fresh challenge.</p><div class="nw-breakdown"><div><small>Score</small><b>${score}</b></div><div><small>Length</small><b>${length}</b></div><div><small>Best chain</small><b>${game.bestCombo}×</b></div></div><div class="nw-breakdown"><div><small>Run challenge</small><b>${classicChallengeCompleted?'Cleared':'Missed'}</b></div><div><small>Best length</small><b>${profile.classicBestLength}</b></div><div><small>Challenge streak</small><b>${profile.classicChallengeStreak}</b></div></div><div class="nw-actions"><button data-action="menu">Menu</button><button class="primary" data-action="again">Grow again</button></div></div>`;
      root.appendChild(overlay); overlay.querySelector('[data-action="menu"]').addEventListener('click',renderMenu); overlay.querySelector('[data-action="again"]').addEventListener('click',startRun);
      return;
    }
    let result={stars:0,total:0,efficiency:0,mastery:0,skill:0};
    if(won){ result=rating(); const prev=profile.stageStars[config.stage]||0; if(result.stars>prev) profile.stageStars[config.stage]=result.stars; profile.bestStage=Math.min(CAMPAIGN_STAGES,Math.max(profile.bestStage,config.stage+1)); profile.currentStage=Math.min(CAMPAIGN_STAGES,config.stage+1); arcade.record('level',1); arcade.record('win',1); }
    else arcade.record('fail',1);
    saveProfile();
    overlay=el('div','nw-overlay'); overlay.innerHTML=`<div class="nw-modal"><h2>${won?'Mission stabilized':'Signal lost'}</h2><p>${won?'You mastered the arena objectives. Higher stars demand tighter routes, stronger chains, and less assistance.':'The wilds closed around the serpent. Try a safer route or different perk.'}</p>${won?`<div class="nw-stars">${'★'.repeat(result.stars)}<span style="opacity:.18">${'★'.repeat(5-result.stars)}</span></div>`:''}<div class="nw-breakdown"><div><small>Score</small><b>${score}</b></div><div><small>Length</small><b>${length}</b></div><div><small>Best chain</small><b>${game.bestCombo}×</b></div></div>${won?`<div class="nw-breakdown"><div><small>Efficiency</small><b>${result.efficiency}/28</b></div><div><small>Mastery</small><b>${result.mastery}/27</b></div><div><small>Skill</small><b>${result.skill}/20</b></div></div>`:''}<div class="nw-actions"><button data-action="menu">Menu</button><button class="primary" data-action="again">${won?'Next mission':'Try again'}</button></div></div>`;
    root.appendChild(overlay); overlay.querySelector('[data-action="menu"]').addEventListener('click',renderMenu); overlay.querySelector('[data-action="again"]').addEventListener('click',startRun);
  }

  function showHelp() {
    const wasPaused=game?.paused; if(game){game.paused=true;clearTimerLoop();}
    const node=el('div','nw-overlay'); node.innerHTML=`<div class="nw-modal"><h2>How to survive</h2><div class="nw-help"><h3>Classic Growth</h3><p>Classic is the main endless mode: eat, grow longer, accelerate every few length levels, clear a rotating run challenge, and claim milestone bonuses every five segments.</p><h3>Expedition Missions</h3><p>Switch modes from the Arcade hub to play the 60-stage objective campaign.</p><p>Steer with Arrow keys, WASD, swipe, or the mobile direction pad. Never reverse directly into your own body.</p><h3>Modern hazards</h3><ul><li><b>Phase gates</b> teleport the head across the arena.</li><li><b>Pulse barriers</b> switch between safe and solid on a visible rhythm.</li><li><b>Sentries</b> patrol fixed lanes.</li><li><b>Fragile cells</b> become blocked briefly after you cross them.</li></ul><h3>Wild charge</h3><p>Food and shards charge Phase Skin, Overdrive, and Freeze abilities.</p><h3>Rewards</h3><p>Classic challenges award score and Wild Charge immediately. Expedition ratings reward fast objective completion, long chains, high score, and clean routing.</p></div><div class="nw-actions"><button class="primary" data-action="close">Got it</button></div></div>`;
    root.appendChild(node); node.querySelector('[data-action="close"]').addEventListener('click',()=>{node.remove();if(game&&!wasPaused){game.paused=false;scheduleTick();startRenderLoop();}});
  }
  const GAME_KEYS = new Set([
    'ArrowUp','ArrowDown','ArrowLeft','ArrowRight',
    'KeyW','KeyA','KeyS','KeyD','Space','KeyP'
  ]);
  function consumeGameKey(event) {
    if (screen !== 'game' || !GAME_KEYS.has(event.code)) return false;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    return true;
  }
  function onKey(event) {
    if (!consumeGameKey(event)) return;
    const map={ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down',ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right'};
    if(map[event.code]) setDirection(map[event.code]);
    else if(event.code==='Space'||event.code==='KeyP') togglePause();
  }
  function onKeyUp(event) { consumeGameKey(event); }
  function onTouchStart(event){touchStart={x:event.clientX,y:event.clientY};}
  function onTouchEnd(event){if(!touchStart)return;const dx=event.clientX-touchStart.x,dy=event.clientY-touchStart.y;touchStart=null;if(Math.abs(dx)<18&&Math.abs(dy)<18)return;setDirection(Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up'));}

  function draw() {
    if (!ctx || !game) return;
    const {x,y,size,cell}=boardRect; ctx.clearRect(0,0,canvasW,canvasH);
    const bg=ctx.createLinearGradient(0,0,0,canvasH); bg.addColorStop(0,config.world.bg); bg.addColorStop(1,'#040914'); ctx.fillStyle=bg; ctx.fillRect(0,0,canvasW,canvasH);
    ctx.fillStyle='rgba(255,255,255,.025)'; for(let r=0;r<GRID;r++)for(let c=0;c<GRID;c++){ctx.fillRect(x+c*cell+1,y+r*cell+1,Math.max(1,cell-2),Math.max(1,cell-2));}
    for(const k of game.obstacles){const [cx,cy]=k.split(',').map(Number);drawCell(cx,cy,'wall');}
    for(const k of game.pulseCells){const [cx,cy]=k.split(',').map(Number);drawCell(cx,cy,game.pulseActive()?'pulse-on':'pulse-off');}
    for(const [k,t] of game.fragile){const [cx,cy]=k.split(',').map(Number);drawCell(cx,cy,t>0?'fragile-on':'fragile');}
    game.portals.forEach((pair,i)=>{drawPortal(pair.a,i);drawPortal(pair.b,i);});
    game.sentries.forEach(s=>drawSentry(s));
    if(game.food) drawFood(game.food); if(game.pickup) drawPickup(game.pickup);
    for(let i=game.snake.length-1;i>=0;i--) drawSnakePart(game.snake[i],i===0,i,game.snake.length);
    if(game.config.wrap){ctx.strokeStyle='rgba(34,211,238,.28)';ctx.lineWidth=2;ctx.strokeRect(x+1,y+1,size-2,size-2);}
  }
  function drawCell(cx,cy,type){const {x,y,cell}=boardRect,px=x+cx*cell,py=y+cy*cell,pad=Math.max(1.5,cell*.1);ctx.save();if(type==='wall'){ctx.fillStyle='#263449';ctx.strokeStyle='rgba(148,163,184,.35)';}else if(type==='pulse-on'){ctx.fillStyle='rgba(251,113,133,.72)';ctx.strokeStyle='#fb7185';ctx.shadowColor='#fb7185';ctx.shadowBlur=10;}else if(type==='pulse-off'){ctx.fillStyle='rgba(251,113,133,.08)';ctx.strokeStyle='rgba(251,113,133,.28)';}else if(type==='fragile-on'){ctx.fillStyle='rgba(244,114,182,.48)';ctx.strokeStyle='#f472b6';}else{ctx.fillStyle='rgba(244,114,182,.08)';ctx.strokeStyle='rgba(244,114,182,.24)';}ctx.lineWidth=1;roundRect(ctx,px+pad,py+pad,cell-pad*2,cell-pad*2,cell*.18);ctx.fill();ctx.stroke();ctx.restore();}
  function roundRect(context,x,y,w,h,r){r=Math.min(r,w/2,h/2);context.beginPath();context.moveTo(x+r,y);context.arcTo(x+w,y,x+w,y+h,r);context.arcTo(x+w,y+h,x,y+h,r);context.arcTo(x,y+h,x,y,r);context.arcTo(x,y,x+w,y,r);context.closePath();}
  function center(cellPos){return{x:boardRect.x+(cellPos.x+.5)*boardRect.cell,y:boardRect.y+(cellPos.y+.5)*boardRect.cell};}
  function drawPortal(pos,index){const p=center(pos),r=boardRect.cell*.34;ctx.save();ctx.strokeStyle=index===0?'#60a5fa':'#c084fc';ctx.lineWidth=Math.max(2,boardRect.cell*.1);ctx.shadowColor=ctx.strokeStyle;ctx.shadowBlur=12;ctx.beginPath();ctx.arc(p.x,p.y,r,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=.35;ctx.beginPath();ctx.arc(p.x,p.y,r*.55,0,Math.PI*2);ctx.stroke();ctx.restore();}
  function drawSentry(s){const p=center(s),r=boardRect.cell*.28;ctx.save();ctx.translate(p.x,p.y);ctx.rotate((game.tickCount+s.phase)*.35);ctx.fillStyle='#fbbf24';ctx.shadowColor='#fbbf24';ctx.shadowBlur=10;ctx.beginPath();for(let i=0;i<8;i++){const a=i*Math.PI/4,rr=i%2===0?r:r*.45;ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}ctx.closePath();ctx.fill();ctx.restore();}
  function drawFood(food){const p=center(food),r=boardRect.cell*(food.type==='gold'?.33:.28);ctx.save();const color=food.type==='gold'?'#fbbf24':food.type==='rush'?'#22d3ee':'#fb7185';ctx.shadowColor=color;ctx.shadowBlur=14;ctx.fillStyle=color;ctx.beginPath();ctx.arc(p.x,p.y,r,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(255,255,255,.7)';ctx.beginPath();ctx.arc(p.x-r*.28,p.y-r*.28,r*.22,0,Math.PI*2);ctx.fill();ctx.restore();}
  function drawPickup(pickup){const p=center(pickup),r=boardRect.cell*.31;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(Math.PI/4);ctx.fillStyle='#67e8f9';ctx.shadowColor='#67e8f9';ctx.shadowBlur=15;ctx.fillRect(-r,-r,r*2,r*2);ctx.fillStyle='rgba(255,255,255,.75)';ctx.fillRect(-r*.35,-r*.35,r*.7,r*.7);ctx.restore();}
  function drawSnakePart(part,head,index,total){const p=center(part),r=boardRect.cell*(head?.39:.34);ctx.save();const t=index/Math.max(1,total-1);const color=head?'#a7f3d0':`hsl(${155+t*38} 72% ${55-t*14}%)`;ctx.fillStyle=color;ctx.shadowColor=head?'#34d399':'rgba(34,197,94,.45)';ctx.shadowBlur=head?16:6;roundRect(ctx,p.x-r,p.y-r,r*2,r*2,r*.45);ctx.fill();if(head){ctx.shadowBlur=0;ctx.fillStyle='#052e2b';const eye=boardRect.cell*.07;const offset=boardRect.cell*.12;const dir=game.direction;if(dir.x!==0){ctx.beginPath();ctx.arc(p.x+dir.x*offset,p.y-offset,eye,0,Math.PI*2);ctx.arc(p.x+dir.x*offset,p.y+offset,eye,0,Math.PI*2);ctx.fill();}else{ctx.beginPath();ctx.arc(p.x-offset,p.y+dir.y*offset,eye,0,Math.PI*2);ctx.arc(p.x+offset,p.y+dir.y*offset,eye,0,Math.PI*2);ctx.fill();}}ctx.restore();}
  function startRenderLoop(){if(raf!=null)return;const frame=t=>{raf=requestAnimationFrame(frame);if(lastFrame){elapsed+=(t-lastFrame)/1000;}lastFrame=t;draw();};raf=requestAnimationFrame(frame);}

  return {
    async mount(container) {
      root = el('div','nw-root'); root.tabIndex = 0; container.innerHTML=''; container.appendChild(root); arcade.mount(root,container);
      root.addEventListener('pointerdown', () => root.focus({ preventScroll: true }));
      layoutObserver = new ResizeObserver(() => {
        const rect = root.getBoundingClientRect();
        root.classList.toggle('is-wide', rect.width >= 980 && rect.height >= 650);
        root.classList.toggle('is-mobile', rect.width <= 430);
      });
      layoutObserver.observe(root);
      await Promise.all([loadProfile(), arcade.ready]);
      if (arcade.profile.selectedMode === 'endless') { arcade.profile.selectedMode = 'classic'; arcade.save(); }
      activeModeId = normalizeModeId(arcade.mode()?.id);
      activePerkId = arcade.perk()?.id || 'shield';
      renderMenu();
      window.addEventListener('keydown',onKey,true);
      window.addEventListener('keyup',onKeyUp,true);
      removePause=host.runtime.lifecycle.onPause(()=>{if(game&&screen==='game'&&!game.paused){game.paused=true;root.classList.add('is-paused');clearTimerLoop();}});
      removeResume=host.runtime.lifecycle.onResume(()=>{if(game&&screen==='game'&&game.alive){game.paused=false;root.classList.remove('is-paused');scheduleTick();startRenderLoop();}});
    },
    unmount() {
      clearTimerLoop(); if(resizeObserver)resizeObserver.disconnect(); if(layoutObserver)layoutObserver.disconnect(); window.removeEventListener('keydown',onKey,true); window.removeEventListener('keyup',onKeyUp,true); if(removePause)removePause(); if(removeResume)removeResume(); if(audioCtx){audioCtx.close().catch(()=>{});audioCtx=null;audioUnlocked=false;} arcade.cleanup();
    }
  };
}
