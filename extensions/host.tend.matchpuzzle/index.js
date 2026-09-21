const STYLE_ID = 'tend-ext-match-odyssey-styles';
const ROWS = 8;
const COLS = 8;
const NUM_TYPES = 6;
const PROFILE_KEY = 'matchPuzzle_profile_v2';
const LEGACY_BEST_KEY = 'matchPuzzle_best';

const GEM_TYPES = [
  { name: 'Ruby', main: '#ef476f', light: '#ffb3c1', dark: '#9d174d', glyph: '●' },
  { name: 'Sapphire', main: '#3a86ff', light: '#93c5fd', dark: '#1d4ed8', glyph: '◆' },
  { name: 'Emerald', main: '#22c55e', light: '#86efac', dark: '#15803d', glyph: '▲' },
  { name: 'Solar', main: '#fbbf24', light: '#fef08a', dark: '#a16207', glyph: '★' },
  { name: 'Amethyst', main: '#a855f7', light: '#d8b4fe', dark: '#7e22ce', glyph: '⬢' },
  { name: 'Ember', main: '#f97316', light: '#fdba74', dark: '#c2410c', glyph: '■' },
];

const PERKS = [
  { id: 'extra_moves', name: 'Long Haul', icon: '＋', unlock: 1, desc: '+3 moves every level' },
  { id: 'lucky_line', name: 'Spark Starter', icon: '↔', unlock: 2, desc: 'Begin with a line gem' },
  { id: 'combo_bank', name: 'Combo Bank', icon: '×2', unlock: 4, desc: 'Cascades begin at 2×' },
  { id: 'prism_seed', name: 'Prism Seed', icon: '◉', unlock: 6, desc: 'Begin with a color prism' },
  { id: 'second_chance', name: 'Second Wind', icon: '↻', unlock: 8, desc: '+2 moves once when empty' },
  { id: 'frost_breaker', name: 'Heat Core', icon: '☀', unlock: 10, desc: 'Power gems break extra frost' },
];

const TEMPO_MODES = [
  { id: 'relaxed', name: 'Relaxed', icon: '∞', unlock: 1, graceMs: 0, countdownMs: 0, reward: 1, flowBonus: 0, desc: 'No response pressure · standard rewards' },
  { id: 'pulse', name: 'Pulse', icon: '◷', unlock: 1, graceMs: 7600, countdownMs: 5000, reward: 1.15, flowBonus: .04, desc: 'Build Flow before the warning pulse · +15% rewards' },
  { id: 'surge', name: 'Surge', icon: '⚡', unlock: 4, graceMs: 5200, countdownMs: 3800, reward: 1.35, flowBonus: .06, desc: 'Faster pressure and stronger entropy · +35% rewards' },
];

const DEFAULT_PROFILE = {
  version: 3,
  bestLevel: 1,
  currentLevel: 1,
  coins: 0,
  xp: 0,
  rank: 1,
  totalStars: 0,
  levelStars: {},
  selectedPerk: 'extra_moves',
  selectedTempo: 'relaxed',
  bestCombo: 0,
  totalCleared: 0,
  totalPowers: 0,
  daily: { date: '', kind: 'clear', progress: 0, claimed: false },
};

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function coordKey(r, c) { return r + ',' + c; }
function parseCoord(key) { const p = key.split(','); return { r: Number(p[0]), c: Number(p[1]) }; }
function shuffled(input) {
  const out = input.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = out[i]; out[i] = out[j]; out[j] = t;
  }
  return out;
}
function element(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html !== undefined) node.innerHTML = html;
  return node;
}
function todayKey() { return new Date().toISOString().slice(0, 10); }
function rankFromXp(xp) { return Math.max(1, Math.floor(Math.sqrt(Math.max(0, xp) / 140)) + 1); }
function xpForRank(rank) { return Math.max(0, (rank - 1) * (rank - 1) * 140); }
function formatNumber(v) { return Math.round(v).toLocaleString('en-US'); }

function makeDaily(profile) {
  const date = todayKey();
  if (profile.daily && profile.daily.date === date) return profile.daily;
  const seed = Number(date.replaceAll('-', '')) || 1;
  const kinds = ['clear', 'powers', 'combo'];
  return { date, kind: kinds[seed % kinds.length], progress: 0, claimed: false };
}

function dailyDefinition(daily) {
  if (daily.kind === 'powers') return { title: 'Power Engineer', detail: 'Activate 10 power gems', target: 10, reward: 90, icon: '✦' };
  if (daily.kind === 'combo') return { title: 'Cascade Hunter', detail: 'Reach a 5× cascade', target: 5, reward: 85, icon: '⚡' };
  return { title: 'Gem Collector', detail: 'Clear 140 gems', target: 140, reward: 75, icon: '◆' };
}

function buildLevel(level) {
  const tier = Math.floor((level - 1) / 5);
  const theme = level % 5;
  const moves = clamp(25 - Math.floor(level / 5), 18, 25);
  // Score growth flattens after the early campaign. Later difficulty comes
  // from layered objectives and board mechanics rather than impossible math.
  const scoreTarget = Math.round((650 + Math.min(level, 36) * 150 + Math.max(0, level - 36) * 35 + tier * 60) / 50) * 50;
  const objectives = [{ kind: 'score', target: scoreTarget, icon: '★', label: 'Score' }];
  let frost = 0;

  if (level >= 2 && theme === 2) {
    const type = (level + 1) % NUM_TYPES;
    objectives.push({ kind: 'collect', type, target: clamp(13 + tier * 2, 13, 24), icon: GEM_TYPES[type].glyph, label: GEM_TYPES[type].name });
  } else if (level >= 3 && theme === 3) {
    frost = clamp(6 + tier, 6, 12);
    objectives.push({ kind: 'frost', target: frost, icon: '❄', label: 'Frost' });
  } else if (level >= 4 && theme === 4) {
    objectives.push({ kind: 'powers', target: clamp(2 + Math.floor(tier / 2), 2, 5), icon: '✦', label: 'Power gems' });
  } else if (level >= 5 && theme === 0) {
    objectives.push({ kind: 'combo', target: clamp(3 + Math.floor(tier / 3), 3, 5), icon: '⚡', label: 'Best cascade' });
  }

  return {
    level,
    title: theme === 0 ? 'Prism Trial' : theme === 3 ? 'Frozen Vault' : theme === 4 ? 'Power Circuit' : theme === 2 ? 'Color Hunt' : 'Score Sprint',
    moves,
    scoreTarget,
    objectives,
    frost,
    frostLayers: level >= 12 ? 2 : 1,
    rewardCoins: 28 + level * 4,
    rewardXp: 50 + level * 12,
  };
}

function calculateRating(run, config, tempoMode) {
  const startMoves = Math.max(1, run.startMoves || config.moves || 1);
  const moveRatio = clamp(Math.max(0, run.moves) / startMoves, 0, 1);
  const scoreRatio = Math.max(0, run.score) / Math.max(1, config.scoreTarget);
  const completion = 25;
  const efficiency = clamp(moveRatio / .55, 0, 1) * 30;
  const mastery = clamp((scoreRatio - 1) / .5, 0, 1) * 20;
  const cascadeSkill = clamp((Math.max(1, run.bestCombo) - 1) / 4, 0, 1) * 10;
  const powerSkill = clamp(run.powers / 4, 0, 1) * 5;
  const tempoScore = tempoMode.id === 'relaxed'
    ? clamp(10 - (run.invalidSwaps || 0) * 1.5, 4, 10)
    : clamp(6 - (run.tempoStrikes || 0) * 2, 0, 6) + clamp((run.bestFlow || 0) / 5, 0, 1) * 4;
  const total = Math.round((completion + efficiency + mastery + cascadeSkill + powerSkill + tempoScore) * 10) / 10;
  const stars = total >= 92 ? 5 : total >= 78 ? 4 : total >= 62 ? 3 : total >= 45 ? 2 : 1;
  const labels = ['Clear', 'Focused', 'Brilliant', 'Masterful', 'Legendary'];
  return {
    total,
    stars,
    label: labels[stars - 1],
    moveRatio,
    scoreRatio,
    efficiency: Math.round(efficiency),
    mastery: Math.round(mastery),
    skill: Math.round(cascadeSkill + powerSkill),
    tempo: Math.round(tempoScore),
  };
}

function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
@keyframes mo-fade-in{from{opacity:0}to{opacity:1}}
@keyframes mo-screen-in{from{opacity:0;transform:translateY(14px) scale(.985)}to{opacity:1;transform:none}}
@keyframes mo-gem-in{0%{opacity:0;transform:translateY(-22px) scale(.75)}65%{opacity:1;transform:translateY(3px) scale(1.06)}100%{opacity:1;transform:none}}
@keyframes mo-gem-pop{0%{opacity:1;transform:scale(1)}45%{opacity:1;transform:scale(1.28) rotate(4deg)}100%{opacity:0;transform:scale(.05) rotate(-14deg)}}
@keyframes mo-special-birth{0%{filter:brightness(3);transform:scale(.2) rotate(-90deg)}55%{filter:brightness(1.8);transform:scale(1.2) rotate(8deg)}100%{filter:brightness(1);transform:none}}
@keyframes mo-selected{0%,100%{transform:scale(1.05);box-shadow:0 0 0 2px rgba(255,255,255,.85),0 0 18px rgba(255,255,255,.32)}50%{transform:scale(1.12);box-shadow:0 0 0 3px rgba(255,255,255,1),0 0 28px rgba(255,255,255,.58)}}
@keyframes mo-combo{0%{opacity:0;transform:translate(-50%,-50%) scale(.5)}35%{opacity:1;transform:translate(-50%,-50%) scale(1.15)}100%{opacity:0;transform:translate(-50%,-75%) scale(1)}}
@keyframes mo-float{0%{opacity:0;transform:translateY(8px) scale(.8)}20%{opacity:1}100%{opacity:0;transform:translateY(-36px) scale(1.1)}}
@keyframes mo-toast{0%{opacity:0;transform:translate(-50%,24px)}12%,80%{opacity:1;transform:translate(-50%,0)}100%{opacity:0;transform:translate(-50%,8px)}}
@keyframes mo-shimmer{0%{transform:translateX(-120%)}100%{transform:translateX(260%)}}
@keyframes mo-confetti{0%{opacity:1;transform:translate3d(0,-10px,0) rotate(0)}100%{opacity:0;transform:translate3d(var(--drift),115vh,0) rotate(var(--spin))}}
@keyframes mo-energy{0%,100%{box-shadow:0 0 8px rgba(34,211,238,.22)}50%{box-shadow:0 0 20px rgba(34,211,238,.62)}}
@keyframes mo-frost-hit{0%{filter:brightness(1)}50%{filter:brightness(3)}100%{filter:brightness(1)}}
@keyframes mo-pressure-pulse{0%,100%{box-shadow:0 0 0 rgba(251,113,133,0)}50%{box-shadow:0 0 18px rgba(251,113,133,.45)}}
@keyframes mo-flow-pop{0%{transform:scale(.82)}55%{transform:scale(1.14)}100%{transform:none}}
.mo-root{width:100%;height:100%;min-width:0;min-height:0;overflow:hidden;position:relative;display:flex;flex-direction:column;background:radial-gradient(circle at 18% -5%,rgba(168,85,247,.18),transparent 35%),radial-gradient(circle at 90% 12%,rgba(14,165,233,.15),transparent 30%),linear-gradient(180deg,#090b17 0%,#0c1022 54%,#090b16 100%);color:#f8fafc;font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;user-select:none;-webkit-user-select:none;touch-action:manipulation;isolation:isolate}
.mo-root::before{content:"";position:absolute;inset:0;pointer-events:none;opacity:.32;background-image:radial-gradient(circle at 16% 22%,rgba(255,255,255,.55) 0 1px,transparent 1.5px),radial-gradient(circle at 72% 38%,rgba(255,255,255,.38) 0 1px,transparent 1.5px),radial-gradient(circle at 42% 74%,rgba(255,255,255,.3) 0 1px,transparent 1.5px);background-size:73px 79px,91px 87px,107px 101px}
.mo-root *{box-sizing:border-box}
.mo-root button{font:inherit}
.mo-screen{position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;min-width:0;min-height:0;animation:mo-screen-in .28s cubic-bezier(.22,.72,.16,1)}
.mo-menu{padding:18px 18px 14px;overflow-y:auto;overflow-x:hidden;align-items:center;scrollbar-width:thin;scrollbar-color:rgba(148,163,184,.25) transparent}
.mo-brand{width:100%;display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px;flex:0 0 auto}
.mo-logo{display:flex;align-items:center;gap:11px;text-align:left}
.mo-logo-mark{width:48px;height:48px;border-radius:16px;display:grid;place-items:center;font-size:25px;background:linear-gradient(145deg,#ec4899,#8b5cf6 54%,#2563eb);border:1px solid rgba(255,255,255,.2);box-shadow:0 14px 40px rgba(139,92,246,.32),inset 0 1px rgba(255,255,255,.25)}
.mo-title{font-weight:950;font-size:24px;letter-spacing:-.8px;line-height:1}
.mo-kicker{margin-top:5px;color:#94a3b8;font-size:10px;letter-spacing:2px;text-transform:uppercase;font-weight:800}
.mo-profile{display:flex;align-items:center;gap:6px}
.mo-chip{min-width:54px;padding:7px 8px;border:1px solid rgba(255,255,255,.09);border-radius:12px;background:rgba(15,23,42,.66);backdrop-filter:blur(12px);text-align:center}
.mo-chip-label{font-size:8px;text-transform:uppercase;letter-spacing:1.2px;color:#64748b;font-weight:800}
.mo-chip-value{font-size:14px;font-weight:900;margin-top:1px;font-variant-numeric:tabular-nums;white-space:nowrap}
.mo-hero{width:100%;flex:0 0 auto;border:1px solid rgba(255,255,255,.11);border-radius:20px;background:linear-gradient(145deg,rgba(30,41,59,.72),rgba(15,23,42,.52));backdrop-filter:blur(18px);padding:15px 16px 14px;position:relative;overflow:hidden;box-shadow:0 20px 54px rgba(0,0,0,.3)}
.mo-hero::after{content:"";position:absolute;inset:-60% auto auto -10%;width:54%;height:180%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.08),transparent);transform:rotate(18deg);animation:mo-shimmer 6s linear infinite;pointer-events:none}
.mo-level-row{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}
.mo-level-tag{font-size:10px;color:#67e8f9;letter-spacing:1.6px;text-transform:uppercase;font-weight:900}
.mo-level-name{font-size:25px;font-weight:950;letter-spacing:-.65px;margin-top:3px}
.mo-level-copy{font-size:10.5px;line-height:1.42;color:#94a3b8;margin-top:6px;max-width:300px}
.mo-level-orb{width:62px;height:62px;border-radius:50%;display:grid;place-items:center;font-size:24px;font-weight:950;background:radial-gradient(circle at 34% 25%,#fff 0 5%,#f472b6 7%,#8b5cf6 52%,#312e81);box-shadow:0 0 0 8px rgba(139,92,246,.08),0 0 34px rgba(139,92,246,.5)}
.mo-objectives-preview{display:flex;gap:7px;flex-wrap:wrap;margin-top:12px}
.mo-objective-pill{display:flex;align-items:center;gap:6px;padding:7px 9px;border-radius:999px;background:rgba(2,6,23,.45);border:1px solid rgba(255,255,255,.08);font-size:10px;color:#cbd5e1;font-weight:750}
.mo-play-wrap{width:100%;flex:0 0 auto;padding-top:9px;position:relative;z-index:4}.mo-play{width:100%;min-height:46px;margin:0;border:1px solid rgba(255,255,255,.14);border-radius:15px;padding:11px 18px;color:white;cursor:pointer;font-weight:950;letter-spacing:1.15px;text-transform:uppercase;background:linear-gradient(115deg,#ec4899,#8b5cf6 52%,#2563eb);box-shadow:0 12px 30px rgba(139,92,246,.3),inset 0 1px rgba(255,255,255,.22);transition:transform .16s,filter .16s;display:flex;align-items:center;justify-content:center;gap:10px;position:relative;overflow:hidden}.mo-play::after{content:"›";font-size:22px;line-height:1;transform:translateY(-1px)}
.mo-play:hover{transform:translateY(-1px);filter:brightness(1.08)}
.mo-play:active{transform:scale(.985)}
.mo-tempo-modes{width:100%;display:grid;grid-template-columns:1fr;gap:8px}
.mo-tempo-mode{position:relative;min-height:74px;border:1px solid rgba(255,255,255,.08);border-radius:15px;padding:10px 11px;background:rgba(15,23,42,.55);color:#94a3b8;cursor:pointer;text-align:left;transition:transform .16s,border-color .16s,background .16s,opacity .16s;overflow:hidden;display:flex;flex-direction:column;gap:5px}
.mo-tempo-mode:hover:not(:disabled){transform:translateY(-2px);border-color:rgba(34,211,238,.45)}
.mo-tempo-mode.selected{color:#fff;border-color:#22d3ee;background:linear-gradient(145deg,rgba(8,145,178,.28),rgba(30,41,59,.72));box-shadow:0 0 20px rgba(34,211,238,.13)}
.mo-tempo-mode:disabled{cursor:not-allowed;opacity:.5}
.mo-tempo-head{display:flex;align-items:center;justify-content:space-between;gap:10px;width:100%}
.mo-tempo-name{display:flex;align-items:center;gap:7px;font-size:13px;font-weight:950;color:currentColor}
.mo-tempo-name i{font-style:normal;font-size:16px;color:#67e8f9}
.mo-tempo-copy{display:block;font-size:10px;line-height:1.4;color:#8ea0b7;max-width:100%}.mo-tempo-mode.selected .mo-tempo-copy{color:#d0deea}
.mo-tempo-reward,.mo-tempo-unlock{flex:0 0 auto;font-style:normal;font-size:9px;line-height:1;color:#fbbf24;background:rgba(146,64,14,.28);border:1px solid rgba(251,191,36,.18);border-radius:999px;padding:4px 7px;font-weight:900;white-space:nowrap}
.mo-section-title{width:100%;display:flex;align-items:flex-end;justify-content:space-between;gap:10px;margin:13px 0 8px;color:#74839a;font-weight:900}
.mo-section-title-main{font-size:10px;letter-spacing:1.5px;text-transform:uppercase}
.mo-section-title-meta{font-size:9px;letter-spacing:.3px;text-transform:none;color:#9fb0c5;text-align:right}
.mo-perks{width:100%;display:grid;grid-template-columns:repeat(2,1fr);gap:8px}
.mo-perk{position:relative;min-height:102px;border:1px solid rgba(255,255,255,.08);border-radius:15px;padding:10px 11px;background:rgba(15,23,42,.58);color:#94a3b8;cursor:pointer;text-align:left;transition:transform .16s,border-color .16s,background .16s,opacity .16s;display:flex;flex-direction:column;align-items:flex-start;justify-content:flex-start;overflow:hidden;gap:6px}
.mo-perk:hover:not(:disabled){transform:translateY(-2px);border-color:rgba(192,132,252,.55)}
.mo-perk.selected{color:#fff;border-color:#c084fc;background:linear-gradient(145deg,rgba(126,34,206,.38),rgba(30,41,59,.7));box-shadow:0 0 22px rgba(168,85,247,.18),inset 0 1px rgba(255,255,255,.08)}.mo-perk.selected::after{content:"✓";position:absolute;left:7px;top:6px;width:16px;height:16px;border-radius:999px;display:grid;place-items:center;background:#a855f7;color:white;font-size:9px;font-weight:950}
.mo-perk:disabled{cursor:not-allowed;opacity:.62;filter:saturate(.5)}
.mo-perk-top{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;width:100%}
.mo-perk-icon{width:32px;height:32px;margin:0;border-radius:10px;display:grid;place-items:center;font-size:14px;font-weight:950;background:rgba(255,255,255,.08);flex:0 0 auto}
.mo-perk-name{display:block;width:100%;font-size:12px;font-weight:900;line-height:1.2;color:currentColor}
.mo-perk-desc{display:block;width:100%;font-size:9px;line-height:1.45;margin-top:0;color:#7c8ba2;max-width:none}.mo-perk.selected .mo-perk-desc{color:#dbe6f2}.mo-perk:disabled .mo-perk-desc{color:#5b677c}
.mo-lock{flex:0 0 auto;font-size:8px;line-height:1;color:#fbbf24;background:rgba(146,64,14,.28);border:1px solid rgba(251,191,36,.18);border-radius:999px;padding:4px 6px;font-style:normal;font-weight:900;white-space:nowrap}
.mo-quest{width:100%;display:flex;align-items:center;gap:10px;border:1px solid rgba(34,211,238,.16);background:linear-gradient(110deg,rgba(8,47,73,.46),rgba(15,23,42,.58));border-radius:15px;padding:10px 11px}
.mo-quest-icon{width:38px;height:38px;flex:0 0 auto;border-radius:12px;display:grid;place-items:center;background:rgba(34,211,238,.12);border:1px solid rgba(103,232,249,.22);color:#67e8f9;font-size:18px}
.mo-quest-copy{flex:1;min-width:0;text-align:left}
.mo-quest-name{font-size:11px;font-weight:900}
.mo-quest-detail{font-size:9px;color:#94a3b8;margin-top:2px}
.mo-mini-progress{height:5px;border-radius:5px;background:rgba(255,255,255,.06);overflow:hidden;margin-top:6px}
.mo-mini-progress>i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#22d3ee,#8b5cf6);transition:width .4s}
.mo-quest-reward{font-size:10px;font-weight:900;color:#fbbf24;white-space:nowrap}
.mo-game{padding:8px;gap:6px}
.mo-topbar{flex:0 0 auto;border:1px solid rgba(255,255,255,.09);border-radius:15px;padding:8px 9px;background:rgba(10,15,31,.74);backdrop-filter:blur(14px);box-shadow:0 8px 24px rgba(0,0,0,.2)}
.mo-top-row{display:flex;align-items:center;gap:7px}
.mo-back,.mo-help,.mo-fullscreen{width:32px;height:32px;border-radius:10px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.05);color:#cbd5e1;cursor:pointer;display:grid;place-items:center;font-weight:900}
.mo-fullscreen{font-size:16px;color:#67e8f9;transition:background .16s,color .16s,transform .16s}.mo-screen .mo-fullscreen{display:none}
.mo-fullscreen:hover{background:rgba(34,211,238,.12);color:#fff;transform:translateY(-1px)}
.mo-level-info{min-width:72px;text-align:left}
.mo-level-info b{display:block;font-size:12px;line-height:1}
.mo-level-info span{display:block;font-size:8px;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-top:3px;font-weight:800}
.mo-stat-row{display:flex;flex:1;justify-content:center;min-width:0}
.mo-stat{min-width:58px;text-align:center;padding:0 7px;border-left:1px solid rgba(255,255,255,.06)}
.mo-stat small{display:block;color:#64748b;font-size:7px;letter-spacing:1px;text-transform:uppercase;font-weight:800}
.mo-stat strong{display:block;font-size:17px;line-height:1.1;margin-top:2px;font-variant-numeric:tabular-nums}
.mo-objectives{display:flex;gap:5px;margin-top:7px;overflow:hidden}
.mo-objective{flex:1;min-width:0;position:relative;border-radius:9px;padding:5px 7px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.055)}
.mo-objective-line{display:flex;justify-content:space-between;gap:5px;font-size:8px;font-weight:800;color:#94a3b8}
.mo-objective-line b{color:#e2e8f0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mo-objective-track{height:4px;background:rgba(255,255,255,.055);border-radius:4px;overflow:hidden;margin-top:4px}
.mo-objective-track i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#22d3ee,#a855f7,#ec4899);transition:width .34s ease-out}
.mo-tempo-hud{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:7px;margin-top:6px;padding:5px 7px;border-radius:9px;background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.05);transition:border-color .18s,background .18s}
.mo-tempo-hud.urgent{border-color:rgba(251,113,133,.45);background:rgba(127,29,29,.18);animation:mo-pressure-pulse .8s ease-in-out infinite}
.mo-tempo-status{min-width:64px;font-size:7px;letter-spacing:.9px;text-transform:uppercase;color:#67e8f9;font-weight:950;white-space:nowrap}
.mo-tempo-track{height:5px;border-radius:999px;background:rgba(255,255,255,.06);overflow:hidden}.mo-tempo-track i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#22d3ee,#8b5cf6);transition:width .12s linear,background .18s}
.mo-tempo-hud.urgent .mo-tempo-track i{background:linear-gradient(90deg,#fbbf24,#f97316,#fb7185)}
.mo-flow{min-width:49px;text-align:right;font-size:7px;color:#94a3b8;font-weight:900;letter-spacing:.7px}.mo-flow.hot{color:#fbbf24;animation:mo-flow-pop .25s ease-out}
.mo-board-shell{position:relative;flex:1;min-height:0;display:flex;align-items:center;justify-content:center}
.mo-board{width:min(100%,calc(100vh - 206px));max-width:466px;aspect-ratio:1;display:grid;grid-template-columns:repeat(8,1fr);gap:3px;padding:7px;border-radius:18px;background:linear-gradient(145deg,rgba(15,23,42,.97),rgba(2,6,23,.96));border:1px solid rgba(255,255,255,.08);box-shadow:0 24px 60px rgba(0,0,0,.46),inset 0 1px rgba(255,255,255,.05);position:relative;overflow:hidden}
.mo-board::before{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(120deg,rgba(255,255,255,.03),transparent 35%,transparent 65%,rgba(139,92,246,.05))}
.mo-gem{position:relative;aspect-ratio:1;border:0;border-radius:11px;cursor:pointer;display:grid;place-items:center;color:rgba(255,255,255,.72);font-weight:950;overflow:hidden;transition:transform .14s,filter .14s,box-shadow .14s;box-shadow:inset 0 1px rgba(255,255,255,.34),inset 0 -5px 9px rgba(0,0,0,.2),0 3px 7px rgba(0,0,0,.28);outline:none}
.mo-gem:hover{transform:scale(1.06);filter:brightness(1.1);z-index:3}
.mo-gem:focus-visible{box-shadow:0 0 0 3px #fff,0 0 0 5px #8b5cf6}
.mo-gem::before{content:"";position:absolute;left:15%;top:7%;width:65%;height:34%;border-radius:50%;background:linear-gradient(180deg,rgba(255,255,255,.5),rgba(255,255,255,.04));transform:rotate(-8deg)}
.mo-gem::after{content:"";position:absolute;inset:1px;border-radius:10px;border:1px solid rgba(255,255,255,.16);pointer-events:none}
.mo-glyph{font-size:clamp(12px,3.2vw,20px);text-shadow:0 2px 5px rgba(0,0,0,.35);z-index:1;pointer-events:none}
.mo-gem.new{animation:mo-gem-in .34s cubic-bezier(.22,.72,.16,1)}
.mo-gem.removing{animation:mo-gem-pop .3s ease-in forwards;pointer-events:none}
.mo-gem.created{animation:mo-special-birth .48s cubic-bezier(.22,.72,.16,1)}
.mo-gem.selected{animation:mo-selected .72s ease-in-out infinite;z-index:5}
.mo-special-ring{position:absolute;inset:4px;border:2px solid rgba(255,255,255,.9);border-radius:8px;z-index:2;pointer-events:none;box-shadow:0 0 13px rgba(255,255,255,.72),inset 0 0 13px rgba(255,255,255,.38)}
.mo-special-icon{position:absolute;z-index:3;font-size:19px;color:#fff;text-shadow:0 0 8px #fff,0 2px 5px rgba(0,0,0,.6);pointer-events:none}
.mo-gem.power-prism{background:conic-gradient(from 30deg,#ec4899,#fbbf24,#22c55e,#22d3ee,#3b82f6,#a855f7,#ec4899)!important;animation:mo-energy 1.2s ease-in-out infinite}
.mo-frost{position:absolute;inset:0;z-index:4;border-radius:10px;pointer-events:none;border:2px solid rgba(186,230,253,.74);background:linear-gradient(135deg,rgba(224,242,254,.42),rgba(56,189,248,.1));box-shadow:inset 0 0 12px rgba(224,242,254,.58),0 0 10px rgba(56,189,248,.3)}
.mo-frost::before,.mo-frost::after{content:"";position:absolute;background:rgba(255,255,255,.66);height:1px;left:14%;right:14%;top:49%;transform:rotate(35deg)}
.mo-frost::after{transform:rotate(-47deg)}
.mo-frost.two{border-width:3px;background:linear-gradient(135deg,rgba(224,242,254,.6),rgba(14,165,233,.18))}
.mo-board.hit-frost{animation:mo-frost-hit .25s}
.mo-combo{position:absolute;left:50%;top:47%;z-index:20;pointer-events:none;font-size:27px;font-weight:950;letter-spacing:-1px;color:#fff;text-shadow:0 0 22px #a855f7,0 3px 10px rgba(0,0,0,.75);animation:mo-combo .8s ease forwards}
.mo-float{position:absolute;z-index:19;pointer-events:none;color:#fde68a;font-size:16px;font-weight:950;text-shadow:0 0 14px rgba(251,191,36,.75),0 2px 5px rgba(0,0,0,.7);animation:mo-float .8s ease forwards}
.mo-boosters{flex:0 0 auto;display:grid;grid-template-columns:1.2fr repeat(3,1fr);gap:5px}
.mo-energy-card{border:1px solid rgba(34,211,238,.14);border-radius:12px;background:rgba(8,47,73,.35);padding:6px 8px;display:flex;flex-direction:column;justify-content:center}
.mo-energy-label{display:flex;justify-content:space-between;font-size:8px;color:#67e8f9;text-transform:uppercase;letter-spacing:1px;font-weight:900}
.mo-energy-track{height:5px;border-radius:5px;background:rgba(255,255,255,.07);overflow:hidden;margin-top:4px}
.mo-energy-track i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#22d3ee,#8b5cf6,#ec4899);transition:width .35s}
.mo-booster{border-radius:12px;border:1px solid rgba(255,255,255,.08);background:rgba(15,23,42,.68);color:#cbd5e1;min-height:42px;padding:5px;cursor:pointer;transition:transform .15s,border-color .15s,background .15s;position:relative}
.mo-booster:hover:not(:disabled){transform:translateY(-1px);border-color:rgba(103,232,249,.45);background:rgba(30,41,59,.82)}
.mo-booster:disabled{opacity:.34;cursor:not-allowed}
.mo-booster.active{border-color:#fbbf24;background:rgba(120,53,15,.45);color:#fef3c7}
.mo-booster b{display:block;font-size:9px}
.mo-booster span{display:block;font-size:7px;color:#64748b;margin-top:2px}
.mo-toast{position:absolute;left:50%;bottom:60px;z-index:40;width:min(330px,calc(100% - 24px));min-height:48px;border-radius:14px;border:1px solid rgba(255,255,255,.12);background:rgba(8,15,30,.73);backdrop-filter:blur(18px);box-shadow:0 15px 45px rgba(0,0,0,.36);padding:8px 12px;display:flex;align-items:center;gap:10px;pointer-events:none;animation:mo-toast 2s ease forwards}
.mo-toast-icon{width:30px;height:30px;flex:0 0 auto;border-radius:10px;display:grid;place-items:center;background:rgba(168,85,247,.17);color:#d8b4fe;font-weight:950}
.mo-toast b{display:block;font-size:10px;text-transform:uppercase;letter-spacing:1px}
.mo-toast span{display:block;font-size:9px;color:#94a3b8;margin-top:2px}
.mo-overlay{position:absolute;inset:0;z-index:60;display:grid;place-items:center;padding:16px;background:rgba(2,6,23,.72);backdrop-filter:blur(12px);animation:mo-fade-in .2s}
.mo-modal{width:min(360px,100%);border-radius:22px;border:1px solid rgba(255,255,255,.12);background:linear-gradient(160deg,rgba(30,41,59,.96),rgba(8,12,25,.98));box-shadow:0 30px 90px rgba(0,0,0,.62);padding:20px;text-align:center;animation:mo-screen-in .32s cubic-bezier(.22,.72,.16,1)}
.mo-modal-icon{width:66px;height:66px;margin:0 auto 10px;border-radius:22px;display:grid;place-items:center;font-size:31px;background:linear-gradient(145deg,rgba(236,72,153,.28),rgba(139,92,246,.3));border:1px solid rgba(255,255,255,.15);box-shadow:0 0 36px rgba(139,92,246,.23)}
.mo-modal h2{font-size:24px;margin:0;font-weight:950;letter-spacing:-.5px}
.mo-modal p{font-size:11px;line-height:1.45;color:#94a3b8;margin:7px auto 13px}
.mo-stars{font-size:29px;letter-spacing:7px;color:#fbbf24;text-shadow:0 0 18px rgba(251,191,36,.48);margin-bottom:12px}
.mo-rating-score{font-size:10px;color:#cbd5e1;font-weight:900;margin:-5px 0 8px}.mo-rating-score b{color:#67e8f9;font-size:14px}
.mo-rating-breakdown{display:grid;grid-template-columns:repeat(2,1fr);gap:6px;margin:8px 0 12px}.mo-rating-part{padding:8px 9px;border-radius:10px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.055);text-align:left}.mo-rating-part small{display:block;font-size:8px;text-transform:uppercase;letter-spacing:.8px;color:#64748b;font-weight:900}.mo-rating-part b{display:block;font-size:15px;line-height:1.1;margin-top:4px;color:#e2e8f0;font-variant-numeric:tabular-nums}.mo-rating-part b span{font-size:11px;color:#94a3b8;margin-left:2px}
.mo-results{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin:10px 0 14px}
.mo-result{padding:9px 5px;border-radius:11px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06)}
.mo-result small{display:block;font-size:7px;text-transform:uppercase;letter-spacing:1px;color:#64748b;font-weight:800}
.mo-result b{display:block;font-size:15px;line-height:1.15;margin-top:3px;font-variant-numeric:tabular-nums}
.mo-actions{display:flex;gap:7px}
.mo-btn{flex:1;border-radius:12px;border:1px solid rgba(255,255,255,.1);padding:10px 11px;font-weight:900;font-size:11px;cursor:pointer;color:#e2e8f0;background:rgba(255,255,255,.05)}
.mo-btn.primary{border:0;color:#fff;background:linear-gradient(115deg,#ec4899,#8b5cf6,#2563eb);box-shadow:0 8px 24px rgba(139,92,246,.3)}
.mo-help-body{text-align:left;max-height:55vh;overflow:auto;padding-right:3px}
.mo-help-body h3{font-size:11px;color:#c084fc;text-transform:uppercase;letter-spacing:1.2px;margin:12px 0 4px}
.mo-help-body p,.mo-help-body li{font-size:10px;line-height:1.5;color:#94a3b8}
.mo-help-body ul{padding-left:18px;margin:5px 0}
.mo-pause{position:absolute;inset:0;z-index:100;display:none;place-items:center;background:rgba(2,6,23,.64);backdrop-filter:blur(8px);pointer-events:none}
.mo-pause b{font-size:18px;letter-spacing:2px;text-transform:uppercase}
.mo-root.runtime-paused .mo-pause{display:grid}
.mo-confetti{position:absolute;z-index:80;top:-12px;border-radius:2px;pointer-events:none;animation:mo-confetti linear forwards}
@media(max-width:767px){
  .mo-menu{padding:calc(12px + env(safe-area-inset-top)) 10px calc(12px + env(safe-area-inset-bottom))}
  .mo-screen .mo-fullscreen{display:grid}
  .mo-brand{margin-bottom:10px}
  .mo-logo-mark{width:44px;height:44px;border-radius:14px}
  .mo-title{font-size:22px}
  .mo-chip{min-width:50px;padding:6px 7px}
  .mo-hero{padding:14px;border-radius:18px}
  .mo-play-wrap{padding-top:8px}
  .mo-play{min-height:44px}
  .mo-perk{min-height:100px}
  .mo-tempo-mode{min-height:70px}
  .mo-game{padding:6px 6px calc(6px + env(safe-area-inset-bottom));gap:5px}
  .mo-board{width:min(100%,calc(100dvh - 232px));max-width:none;border-radius:14px;padding:5px;gap:2px}
  .mo-gem{border-radius:9px}
  .mo-topbar{border-radius:12px;padding:6px}
  .mo-stat{min-width:48px;padding-inline:5px}
  .mo-stat strong{font-size:15px}
  .mo-level-info{min-width:60px}
  .mo-boosters{grid-template-columns:1.2fr repeat(3,1fr)}
  .mo-toast{bottom:calc(57px + env(safe-area-inset-bottom))}
}
@media(max-width:390px){
  .mo-top-row{gap:4px}
  .mo-back,.mo-help,.mo-fullscreen{width:28px;height:28px;border-radius:9px}
  .mo-level-info{min-width:44px}
  .mo-level-info span{display:none}
  .mo-stat{min-width:39px;padding-inline:3px}
  .mo-stat strong{font-size:14px}
  .mo-perks{grid-template-columns:repeat(2,1fr)}
  .mo-tempo-mode{min-height:54px}
  .mo-menu{overflow-y:auto}
  .mo-brand{align-items:flex-start}
  .mo-title{font-size:21px}
  .mo-logo-mark{width:42px;height:42px}
  .mo-objectives{gap:3px}
  .mo-objective{padding-inline:5px}
}
@media(prefers-reduced-motion:reduce){.mo-root *{animation-duration:1ms!important;transition-duration:1ms!important}}
`;
  document.head.appendChild(style);
}

class BoardCore {
  constructor(rows = ROWS, cols = COLS) {
    this.rows = rows;
    this.cols = cols;
    this.grid = [];
    this.blockers = [];
    this.nextId = 1;
  }

  gem(type, power = null, flags = {}) {
    return { id: this.nextId++, type, power, isNew: Boolean(flags.isNew), created: Boolean(flags.created) };
  }

  generate(config, selectedPerk) {
    let attempts = 0;
    do {
      this.grid = [];
      for (let r = 0; r < this.rows; r++) {
        this.grid[r] = [];
        for (let c = 0; c < this.cols; c++) {
          let type;
          let guard = 0;
          do { type = randInt(0, NUM_TYPES - 1); guard++; }
          while (this.wouldCreateMatch(r, c, type) && guard < 40);
          this.grid[r][c] = this.gem(type);
        }
      }
      attempts++;
    } while (!this.hasValidMove() && attempts < 60);

    this.blockers = Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
    if (config.frost > 0) {
      const cells = shuffled(Array.from({ length: this.rows * this.cols }, (_, i) => i));
      for (let i = 0; i < Math.min(config.frost, cells.length); i++) {
        const r = Math.floor(cells[i] / this.cols);
        const c = cells[i] % this.cols;
        this.blockers[r][c] = config.frostLayers;
      }
    }

    if (selectedPerk === 'lucky_line') {
      this.placeRandomSpecial(Math.random() > .5 ? 'hline' : 'vline');
    } else if (selectedPerk === 'prism_seed') {
      this.placeRandomSpecial('prism');
    }
  }

  wouldCreateMatch(r, c, type) {
    if (c >= 2 && this.grid[r]?.[c - 1]?.type === type && this.grid[r]?.[c - 2]?.type === type) return true;
    if (r >= 2 && this.grid[r - 1]?.[c]?.type === type && this.grid[r - 2]?.[c]?.type === type) return true;
    return false;
  }

  placeRandomSpecial(power) {
    for (let guard = 0; guard < 40; guard++) {
      const r = randInt(0, this.rows - 1);
      const c = randInt(0, this.cols - 1);
      if (this.grid[r][c] && !this.grid[r][c].power) {
        this.grid[r][c].power = power;
        this.grid[r][c].created = true;
        return { r, c };
      }
    }
    return null;
  }

  swap(a, b) {
    const tmp = this.grid[a.r][a.c];
    this.grid[a.r][a.c] = this.grid[b.r][b.c];
    this.grid[b.r][b.c] = tmp;
  }

  findMatches(preferred = []) {
    const matched = new Set();
    const horizontal = [];
    const vertical = [];

    for (let r = 0; r < this.rows; r++) {
      let start = 0;
      for (let c = 1; c <= this.cols; c++) {
        const same = c < this.cols && this.grid[r][c] && this.grid[r][c - 1] && this.grid[r][c].type === this.grid[r][c - 1].type;
        if (same) continue;
        const length = c - start;
        if (length >= 3) {
          const cells = [];
          for (let x = start; x < c; x++) { matched.add(coordKey(r, x)); cells.push({ r, c: x }); }
          horizontal.push({ orientation: 'h', r, start, length, cells, type: this.grid[r][start].type });
        }
        start = c;
      }
    }

    for (let c = 0; c < this.cols; c++) {
      let start = 0;
      for (let r = 1; r <= this.rows; r++) {
        const same = r < this.rows && this.grid[r][c] && this.grid[r - 1][c] && this.grid[r][c].type === this.grid[r - 1][c].type;
        if (same) continue;
        const length = r - start;
        if (length >= 3) {
          const cells = [];
          for (let y = start; y < r; y++) { matched.add(coordKey(y, c)); cells.push({ r: y, c }); }
          vertical.push({ orientation: 'v', c, start, length, cells, type: this.grid[start][c].type });
        }
        start = r;
      }
    }

    const specials = new Map();
    const priority = { hline: 1, vline: 1, bomb: 2, prism: 3 };
    const setSpecial = (r, c, power, type) => {
      const k = coordKey(r, c);
      const existing = specials.get(k);
      if (!existing || priority[power] > priority[existing.power]) specials.set(k, { r, c, power, type });
    };
    const preferredCell = (run) => {
      for (const p of preferred) if (run.cells.some((cell) => cell.r === p.r && cell.c === p.c)) return p;
      return run.cells[Math.floor((run.cells.length - 1) / 2)];
    };

    for (const h of horizontal) {
      for (const v of vertical) {
        if (h.r >= v.start && h.r < v.start + v.length && v.c >= h.start && v.c < h.start + h.length) {
          setSpecial(h.r, v.c, 'bomb', h.type);
        }
      }
    }
    for (const run of horizontal.concat(vertical)) {
      if (run.length >= 5) {
        const p = preferredCell(run); setSpecial(p.r, p.c, 'prism', run.type);
      } else if (run.length === 4) {
        const p = preferredCell(run); setSpecial(p.r, p.c, run.orientation === 'h' ? 'hline' : 'vline', run.type);
      }
    }

    return { matched, specials, horizontal, vertical };
  }

  specialSwapSet(a, b) {
    const ga = this.grid[a.r]?.[a.c];
    const gb = this.grid[b.r]?.[b.c];
    if (!ga || !gb) return null;
    if (!ga.power && !gb.power) return null;
    const out = new Set([coordKey(a.r, a.c), coordKey(b.r, b.c)]);

    if (ga.power === 'prism' && gb.power === 'prism') {
      for (let r = 0; r < this.rows; r++) for (let c = 0; c < this.cols; c++) out.add(coordKey(r, c));
      return out;
    }
    if (ga.power === 'prism' || gb.power === 'prism') {
      const target = ga.power === 'prism' ? gb.type : ga.type;
      for (let r = 0; r < this.rows; r++) for (let c = 0; c < this.cols; c++) if (this.grid[r][c]?.type === target) out.add(coordKey(r, c));
      return out;
    }
    if (ga.power && gb.power) return out;
    return null;
  }

  expandPowerEffects(removeSet) {
    const activated = new Set();
    let changed = true;
    while (changed) {
      changed = false;
      for (const k of Array.from(removeSet)) {
        if (activated.has(k)) continue;
        const { r, c } = parseCoord(k);
        const gem = this.grid[r]?.[c];
        if (!gem?.power) continue;
        activated.add(k);
        const add = [];
        if (gem.power === 'hline') for (let x = 0; x < this.cols; x++) add.push(coordKey(r, x));
        if (gem.power === 'vline') for (let y = 0; y < this.rows; y++) add.push(coordKey(y, c));
        if (gem.power === 'bomb') {
          for (let dr = -2; dr <= 2; dr++) for (let dc = -2; dc <= 2; dc++) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) add.push(coordKey(nr, nc));
          }
        }
        if (gem.power === 'prism') {
          for (let y = 0; y < this.rows; y++) for (let x = 0; x < this.cols; x++) if (this.grid[y][x]?.type === gem.type) add.push(coordKey(y, x));
        }
        for (const key of add) if (!removeSet.has(key)) { removeSet.add(key); changed = true; }
      }
    }
    return activated;
  }

  removeCollapseFill(removeSet, specialMap) {
    const removed = [];
    for (const k of removeSet) {
      const { r, c } = parseCoord(k);
      const gem = this.grid[r]?.[c];
      if (gem) removed.push({ r, c, type: gem.type, power: gem.power });
      this.grid[r][c] = null;
    }

    this.applyGravity();
    this.fillEmpty();

    for (const special of specialMap.values()) {
      this.grid[special.r][special.c] = this.gem(special.type, special.power, { created: true });
    }
    return removed;
  }

  applyGravity() {
    for (let c = 0; c < this.cols; c++) {
      let write = this.rows - 1;
      for (let r = this.rows - 1; r >= 0; r--) {
        if (!this.grid[r][c]) continue;
        if (write !== r) { this.grid[write][c] = this.grid[r][c]; this.grid[r][c] = null; }
        write--;
      }
      while (write >= 0) { this.grid[write][c] = null; write--; }
    }
  }

  fillEmpty() {
    for (let c = 0; c < this.cols; c++) {
      for (let r = 0; r < this.rows; r++) {
        if (!this.grid[r][c]) this.grid[r][c] = this.gem(randInt(0, NUM_TYPES - 1), null, { isNew: true });
      }
    }
  }

  hasValidMove() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (c + 1 < this.cols) {
          const a = { r, c }, b = { r, c: c + 1 };
          if (this.grid[r][c]?.power === 'prism' || this.grid[r][c + 1]?.power === 'prism') return true;
          this.swap(a, b); const valid = this.findMatches().matched.size > 0; this.swap(a, b); if (valid) return true;
        }
        if (r + 1 < this.rows) {
          const a = { r, c }, b = { r: r + 1, c };
          if (this.grid[r][c]?.power === 'prism' || this.grid[r + 1][c]?.power === 'prism') return true;
          this.swap(a, b); const valid = this.findMatches().matched.size > 0; this.swap(a, b); if (valid) return true;
        }
      }
    }
    return false;
  }

  shuffleUntilPlayable() {
    const gems = [];
    for (let r = 0; r < this.rows; r++) for (let c = 0; c < this.cols; c++) gems.push(this.grid[r][c]);
    for (let attempt = 0; attempt < 100; attempt++) {
      const mixed = shuffled(gems);
      let i = 0;
      for (let r = 0; r < this.rows; r++) for (let c = 0; c < this.cols; c++) {
        this.grid[r][c] = mixed[i++];
        this.grid[r][c].isNew = true;
        this.grid[r][c].created = false;
      }
      if (this.findMatches().matched.size === 0 && this.hasValidMove()) return true;
    }
    return false;
  }

  mostCommonType() {
    const counts = Array(NUM_TYPES).fill(0);
    for (let r = 0; r < this.rows; r++) for (let c = 0; c < this.cols; c++) if (this.grid[r][c]) counts[this.grid[r][c].type]++;
    let best = 0;
    for (let i = 1; i < counts.length; i++) if (counts[i] > counts[best]) best = i;
    return best;
  }
}

export { BoardCore, buildLevel, calculateRating, TEMPO_MODES };

export default function activate(host) {
  ensureStyles();
  if (!host.runtime || host.runtime.api !== 1 || host.runtime.kind !== 'game') {
    throw new Error('Match Puzzle: Odyssey requires tend.host Extension Runtime API 1 as a game.');
  }
  const runtime = host.runtime;
  const runtimeTimers = runtime.timers;
  const profile = structuredClone(DEFAULT_PROFILE);
  let root = null;
  let board = null;
  let levelConfig = null;
  let selected = null;
  let screenVersion = 0;
  let busy = false;
  let paused = false;
  let hammerMode = false;
  let toastNode = null;
  let currentAudio = null;
  let shellWindow = null;
  let layoutControl = null;
  let previousLayoutDisplay = '';
  let headerNode = null;
  let profileLoaded = false;
  let pressureInterval = null;
  const pending = new Set();
  const removalVisuals = new Set();
  const run = {
    score: 0,
    moves: 0,
    energy: 0,
    combo: 0,
    bestCombo: 0,
    matched: 0,
    powers: 0,
    frost: 0,
    collected: Array(NUM_TYPES).fill(0),
    secondChanceUsed: false,
    startMoves: 0,
    invalidSwaps: 0,
    flow: 0,
    bestFlow: 0,
    tempoStrikes: 0,
    responseRemaining: 0,
    pressureRemaining: 0,
    pressureActive: false,
  };

  const setTimer = (fn, delay) => {
    const token = screenVersion;
    let id;
    const wrapped = () => { pending.delete(id); if (token === screenVersion) fn(); };
    id = runtimeTimers.setTimeout(wrapped, delay);
    pending.add(id);
    return id;
  };
  const clearTimer = (id) => {
    runtimeTimers.clearTimeout(id);
    pending.delete(id);
  };
  const clearTimers = () => { for (const id of Array.from(pending)) clearTimer(id); pending.clear(); };
  const stopPressureLoop = () => { if (pressureInterval !== null) { runtimeTimers.clearInterval(pressureInterval); pressureInterval = null; } };
  const advanceScreen = () => { screenVersion++; clearTimers(); stopPressureLoop(); removalVisuals.clear(); busy = false; selected = null; hammerMode = false; };

  function bindFullscreen(scope) {
    const button = scope?.querySelector('[data-action="fullscreen"]');
    if (!button) return;
    button.addEventListener('click', async () => {
      if (button.disabled) return;
      button.disabled = true;
      button.setAttribute('aria-busy', 'true');
      try {
        await runtime.display.toggleFullscreen();
      } catch {
        showToast('⛶', 'Full screen unavailable', 'Use the gamepad control in the panel title bar.');
      } finally {
        button.disabled = false;
        button.removeAttribute('aria-busy');
      }
    });
  }

  function mergeProfile(data) {
    if (!data || typeof data !== 'object') return;
    for (const key of Object.keys(DEFAULT_PROFILE)) {
      if (key === 'daily') continue;
      if (data[key] !== undefined) profile[key] = data[key];
    }
    if (data.daily && typeof data.daily === 'object') profile.daily = data.daily;
    profile.rank = rankFromXp(profile.xp);
    profile.currentLevel = Math.max(1, Number(profile.currentLevel) || 1);
    profile.bestLevel = Math.max(1, Number(profile.bestLevel) || 1);
    if (!profile.levelStars || typeof profile.levelStars !== 'object') profile.levelStars = {};
    if (!PERKS.some((p) => p.id === profile.selectedPerk && profile.rank >= p.unlock)) profile.selectedPerk = 'extra_moves';
    if (!TEMPO_MODES.some((m) => m.id === profile.selectedTempo && profile.rank >= m.unlock)) profile.selectedTempo = 'relaxed';
    profile.version = 3;
  }

  async function loadProfile() {
    try { mergeProfile(await host.storage.get(PROFILE_KEY)); }
    catch { /* use defaults */ }
    try {
      const legacy = await host.storage.get(LEGACY_BEST_KEY);
      if (typeof legacy === 'number' && legacy + 1 > profile.bestLevel) {
        profile.bestLevel = legacy + 1;
        profile.currentLevel = Math.max(profile.currentLevel, profile.bestLevel);
      }
    } catch { /* optional migration */ }
    profile.daily = makeDaily(profile);
    profileLoaded = true;
  }

  function saveProfile() {
    profile.rank = rankFromXp(profile.xp);
    host.storage.set(PROFILE_KEY, profile).catch(() => {});
  }

  function setupShell(container) {
    shellWindow = container.closest('.tend-floating-window');
    if (!shellWindow) return;
    shellWindow.classList.add('match-odyssey-fixed-game');
    layoutControl = shellWindow.querySelector('.window-layout-controls');
    if (layoutControl) {
      previousLayoutDisplay = layoutControl.style.display;
      layoutControl.style.display = 'none';
    }
    headerNode = shellWindow.querySelector('[data-window-chrome]');
    headerNode?.addEventListener('dblclick', stopHeaderExpand, true);
  }

  function stopHeaderExpand(event) { event.preventDefault(); event.stopImmediatePropagation(); }

  function restoreShell() {
    if (layoutControl) layoutControl.style.display = previousLayoutDisplay;
    headerNode?.removeEventListener('dblclick', stopHeaderExpand, true);
    shellWindow?.classList.remove('match-odyssey-fixed-game');
    layoutControl = null; headerNode = null; shellWindow = null;
  }

  function initAudio() {
    if (currentAudio) return currentAudio;
    try { currentAudio = new (window.AudioContext || window.webkitAudioContext)(); }
    catch { currentAudio = null; }
    return currentAudio;
  }

  function tone(freq, duration = .08, type = 'sine', volume = .055, delay = 0) {
    const ctx = initAudio(); if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.type = type; osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(volume, now); gain.gain.exponentialRampToValueAtTime(.001, now + duration);
    osc.connect(gain); gain.connect(ctx.destination); osc.start(now); osc.stop(now + duration);
  }

  const sfx = {
    select: () => tone(760, .045, 'sine', .04),
    swap: () => { tone(390, .06, 'triangle', .04); tone(620, .07, 'triangle', .035, .035); },
    fail: () => { tone(220, .11, 'sawtooth', .035); tone(170, .11, 'sawtooth', .025, .06); },
    match: (combo) => { const f = 520 + Math.min(combo, 8) * 65; tone(f, .08, 'sine', .055); tone(f * 1.25, .09, 'triangle', .04, .05); },
    power: () => { tone(620, .08, 'square', .04); tone(930, .1, 'triangle', .05, .045); tone(1260, .12, 'sine', .05, .09); },
    level: () => [523,659,784,1047].forEach((f, i) => tone(f, .15, 'sine', .06, i * .07)),
    over: () => [360,300,245,190].forEach((f, i) => tone(f, .2, 'triangle', .04, i * .1)),
    booster: () => { tone(780, .08, 'triangle', .05); tone(1175, .12, 'sine', .055, .05); },
  };

  function perk() { return PERKS.find((p) => p.id === profile.selectedPerk) || PERKS[0]; }
  function tempo() { return TEMPO_MODES.find((m) => m.id === profile.selectedTempo) || TEMPO_MODES[0]; }

  function objectiveValue(objective) {
    if (objective.kind === 'score') return run.score;
    if (objective.kind === 'collect') return run.collected[objective.type] || 0;
    if (objective.kind === 'frost') return run.frost;
    if (objective.kind === 'powers') return run.powers;
    if (objective.kind === 'combo') return run.bestCombo;
    return 0;
  }

  function objectivesComplete() { return levelConfig.objectives.every((o) => objectiveValue(o) >= o.target); }

  function objectiveHtml(objective, preview = false) {
    const value = preview ? 0 : objectiveValue(objective);
    if (preview) return `<span class="mo-objective-pill"><b>${objective.icon}</b>${objective.label}: ${formatNumber(objective.target)}</span>`;
    const pct = clamp((value / objective.target) * 100, 0, 100);
    return `<div class="mo-objective"><div class="mo-objective-line"><b>${objective.icon} ${objective.label}</b><span>${formatNumber(Math.min(value, objective.target))}/${formatNumber(objective.target)}</span></div><div class="mo-objective-track"><i style="width:${pct}%"></i></div></div>`;
  }

  function dailyProgressValue() {
    if (profile.daily.kind === 'powers') return profile.totalPowers;
    if (profile.daily.kind === 'combo') return profile.bestCombo;
    return profile.totalCleared;
  }

  function normalizeDailyBaseline() {
    // Daily progress is intentionally session/day scoped. Lifetime totals are
    // stored separately and must never auto-complete a fresh daily challenge.
  }

  function updateDaily(delta = {}) {
    const daily = profile.daily;
    const def = dailyDefinition(daily);
    if (daily.claimed) return;
    if (daily.kind === 'clear') daily.progress = Math.min(def.target, daily.progress + (delta.cleared || 0));
    if (daily.kind === 'powers') daily.progress = Math.min(def.target, daily.progress + (delta.powers || 0));
    if (daily.kind === 'combo') daily.progress = Math.max(daily.progress, delta.combo || 0);
    if (daily.progress >= def.target && !daily.claimed) {
      daily.claimed = true; profile.coins += def.reward; showToast(def.icon, 'Daily challenge complete', '+' + def.reward + ' coins added');
    }
  }

  function showToast(icon, title, detail) {
    toastNode?.remove();
    const toast = element('div', 'mo-toast', `<div class="mo-toast-icon">${icon}</div><div><b>${title}</b><span>${detail || ''}</span></div>`);
    root?.appendChild(toast); toastNode = toast;
    setTimer(() => { if (toast === toastNode) toastNode = null; toast.remove(); }, 2050);
  }

  function resetTempoWindow() {
    const mode = tempo();
    run.pressureActive = false;
    run.responseRemaining = mode.graceMs;
    run.pressureRemaining = mode.countdownMs;
    updateTempoUi();
  }

  function registerTempoMove() {
    const mode = tempo();
    if (mode.id === 'relaxed') return;
    if (run.pressureActive) run.flow = Math.max(0, run.flow - 1);
    else run.flow = Math.min(5, run.flow + 1);
    run.bestFlow = Math.max(run.bestFlow, run.flow);
    resetTempoWindow();
  }

  function registerTempoAction() {
    if (tempo().id !== 'relaxed') resetTempoWindow();
  }

  function addEntropyFrost() {
    if (!board) return false;
    const candidates = [];
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      if (board.grid[r][c] && board.blockers[r][c] === 0) candidates.push({ r, c });
    }
    if (!candidates.length) return false;
    const cell = candidates[randInt(0, candidates.length - 1)];
    board.blockers[cell.r][cell.c] = 1;
    renderBoard();
    return true;
  }

  function applyTempoStrike() {
    const mode = tempo();
    run.tempoStrikes++;
    run.flow = 0;
    let detail = '';
    const drain = mode.id === 'surge' ? 25 : 15;
    if (run.energy >= drain) {
      run.energy -= drain;
      detail = drain + '% Core charge drained';
    } else if (addEntropyFrost()) {
      detail = 'Entropy crystallized one gem';
    } else {
      run.score = Math.max(0, run.score - 120);
      detail = '120 score lost to entropy';
    }
    const moveCadence = mode.id === 'surge' ? 2 : 3;
    if (run.tempoStrikes % moveCadence === 0 && run.moves > 4) {
      run.moves--;
      detail += ' · 1 move consumed';
    }
    sfx.fail();
    showToast(mode.icon, mode.name + ' pressure hit', detail);
    resetTempoWindow();
    updateUi();
  }

  function updateTempoUi() {
    const hud = root?.querySelector('#mo-tempo-hud');
    if (!hud) return;
    const mode = tempo();
    const label = hud.querySelector('#mo-tempo-status');
    const fill = hud.querySelector('#mo-tempo-fill');
    const flow = hud.querySelector('#mo-flow');
    if (mode.id === 'relaxed') {
      hud.classList.remove('urgent');
      if (label) label.textContent = 'Relaxed mode';
      if (fill) fill.style.width = '100%';
      if (flow) { flow.textContent = 'NO PRESSURE'; flow.classList.remove('hot'); }
      return;
    }
    hud.classList.toggle('urgent', run.pressureActive);
    const total = run.pressureActive ? mode.countdownMs : mode.graceMs;
    const remaining = run.pressureActive ? run.pressureRemaining : run.responseRemaining;
    const pct = clamp((remaining / Math.max(1, total)) * 100, 0, 100);
    if (fill) fill.style.width = pct + '%';
    if (label) label.textContent = run.pressureActive ? 'Move · ' + Math.max(0, remaining / 1000).toFixed(1) + 's' : mode.name + ' flow';
    if (flow) {
      flow.textContent = 'FLOW ' + run.flow + '/5';
      flow.classList.toggle('hot', run.flow >= 3);
    }
  }

  function startPressureLoop() {
    stopPressureLoop();
    const mode = tempo();
    resetTempoWindow();
    if (mode.id === 'relaxed') return;
    pressureInterval = runtimeTimers.setInterval(() => {
      if (!root?.querySelector('#mo-board') || paused || busy || root.querySelector('.mo-overlay')) return;
      if (run.pressureActive) {
        run.pressureRemaining -= 100;
        if (run.pressureRemaining <= 0) applyTempoStrike();
      } else {
        run.responseRemaining -= 100;
        if (run.responseRemaining <= 0) {
          run.pressureActive = true;
          run.pressureRemaining = mode.countdownMs;
          showToast(mode.icon, 'Pressure rising', 'Make a valid move before entropy hits');
        }
      }
      updateTempoUi();
    }, 100);
  }

  function renderMenu() {
    advanceScreen();
    levelConfig = buildLevel(profile.currentLevel);
    normalizeDailyBaseline();
    const daily = dailyDefinition(profile.daily);
    const dailyPct = clamp((profile.daily.progress / daily.target) * 100, 0, 100);
    root.innerHTML = '';
    const menu = element('div', 'mo-screen mo-menu');
    menu.innerHTML = `
      <div class="mo-brand">
        <div class="mo-logo"><div class="mo-logo-mark">◆</div><div><div class="mo-title">Match Puzzle</div><div class="mo-kicker">Odyssey Edition</div></div></div>
        <div class="mo-profile"><div class="mo-chip"><div class="mo-chip-label">Rank</div><div class="mo-chip-value">${profile.rank}</div></div><div class="mo-chip"><div class="mo-chip-label">Coins</div><div class="mo-chip-value" style="color:#fbbf24">◆ ${profile.coins}</div></div><button class="mo-fullscreen" data-action="fullscreen" aria-label="Toggle full screen" title="Full screen">⛶</button></div>
      </div>
      <section class="mo-hero">
        <div class="mo-level-row"><div><div class="mo-level-tag">Continue · Level ${profile.currentLevel}</div><div class="mo-level-name">${levelConfig.title}</div><div class="mo-level-copy">Complete every objective before the move counter reaches zero. Build special gems, chain cascades, and charge your boosters.</div></div><div class="mo-level-orb">${profile.currentLevel}</div></div>
        <div class="mo-objectives-preview">${levelConfig.objectives.map((o) => objectiveHtml(o, true)).join('')}</div>
      </section>
      <div class="mo-play-wrap"><button class="mo-play" data-action="play">Continue level ${profile.currentLevel}</button></div>
      <div class="mo-section-title"><span class="mo-section-title-main">Play style</span><span class="mo-section-title-meta">${tempo().name} · ${Math.round(tempo().reward * 100)}% rewards</span></div>
      <div class="mo-tempo-modes">${TEMPO_MODES.map((m) => `<button class="mo-tempo-mode ${profile.selectedTempo === m.id ? 'selected' : ''}" data-tempo="${m.id}" ${profile.rank < m.unlock ? 'disabled' : ''}><span class="mo-tempo-head"><b class="mo-tempo-name"><i>${m.icon}</i>${m.name}</b>${profile.rank < m.unlock ? `<em class="mo-tempo-unlock">R${m.unlock}</em>` : `<span class="mo-tempo-reward">${Math.round(m.reward * 100)}%</span>`}</span><span class="mo-tempo-copy">${m.desc}</span></button>`).join('')}</div>
      <div class="mo-section-title"><span class="mo-section-title-main">Choose one perk</span><span class="mo-section-title-meta">Rank ${profile.rank}</span></div>
      <div class="mo-perks">${PERKS.map((p) => `<button class="mo-perk ${profile.selectedPerk === p.id ? 'selected' : ''}" data-perk="${p.id}" ${profile.rank < p.unlock ? 'disabled' : ''}><span class="mo-perk-top"><span class="mo-perk-icon">${p.icon}</span>${profile.rank < p.unlock ? `<i class="mo-lock">R${p.unlock}</i>` : ''}</span><span class="mo-perk-name">${p.name}</span><span class="mo-perk-desc">${p.desc}</span></button>`).join('')}</div>
      <div class="mo-section-title"><span class="mo-section-title-main">Daily challenge</span><span class="mo-section-title-meta">${profile.daily.claimed ? 'Completed' : 'Resets daily'}</span></div>
      <div class="mo-quest"><div class="mo-quest-icon">${daily.icon}</div><div class="mo-quest-copy"><div class="mo-quest-name">${daily.title}</div><div class="mo-quest-detail">${daily.detail}</div><div class="mo-mini-progress"><i style="width:${dailyPct}%"></i></div></div><div class="mo-quest-reward">${profile.daily.claimed ? '✓' : '◆ ' + daily.reward}</div></div>`;
    root.appendChild(menu);
    bindFullscreen(menu);
    menu.querySelector('[data-action="play"]').addEventListener('click', startLevel);
    menu.addEventListener('click', (event) => {
      const button = event.target.closest('[data-perk]');
      if (!button || button.disabled) return;
      profile.selectedPerk = button.dataset.perk; saveProfile(); sfx.select(); renderMenu();
    });
    menu.addEventListener('click', (event) => {
      const button = event.target.closest('[data-tempo]');
      if (!button || button.disabled) return;
      profile.selectedTempo = button.dataset.tempo; saveProfile(); sfx.select(); renderMenu();
    });
  }

  function resetRun() {
    run.score = 0; run.moves = levelConfig.moves + (profile.selectedPerk === 'extra_moves' ? 3 : 0); run.startMoves = run.moves; run.energy = 0;
    run.combo = 0; run.bestCombo = 0; run.matched = 0; run.powers = 0; run.frost = 0;
    run.collected = Array(NUM_TYPES).fill(0); run.secondChanceUsed = false; run.invalidSwaps = 0;
    run.flow = 0; run.bestFlow = 0; run.tempoStrikes = 0; run.responseRemaining = 0; run.pressureRemaining = 0; run.pressureActive = false;
  }

  function startLevel() {
    advanceScreen();
    levelConfig = buildLevel(profile.currentLevel);
    board = new BoardCore(); board.generate(levelConfig, profile.selectedPerk); resetRun();
    root.innerHTML = '';
    const game = element('div', 'mo-screen mo-game');
    game.innerHTML = `
      <div class="mo-topbar">
        <div class="mo-top-row"><button class="mo-back" data-action="menu" aria-label="Menu">‹</button><div class="mo-level-info"><b>Level ${levelConfig.level}</b><span>${levelConfig.title}</span></div><div class="mo-stat-row"><div class="mo-stat"><small>Score</small><strong id="mo-score">0</strong></div><div class="mo-stat"><small>Moves</small><strong id="mo-moves" style="color:#fbbf24">${run.moves}</strong></div><div class="mo-stat"><small>Combo</small><strong id="mo-combo" style="color:#c084fc">1×</strong></div></div><button class="mo-fullscreen" data-action="fullscreen" aria-label="Toggle full screen" title="Full screen">⛶</button><button class="mo-help" data-action="help" aria-label="Help">?</button></div>
        <div class="mo-objectives" id="mo-objectives"></div>
        <div class="mo-tempo-hud" id="mo-tempo-hud"><span class="mo-tempo-status" id="mo-tempo-status"></span><div class="mo-tempo-track"><i id="mo-tempo-fill" style="width:100%"></i></div><b class="mo-flow" id="mo-flow"></b></div>
      </div>
      <div class="mo-board-shell"><div class="mo-board" id="mo-board" role="grid" aria-label="Match puzzle board"></div></div>
      <div class="mo-boosters"><div class="mo-energy-card"><div class="mo-energy-label"><span>Core charge</span><b id="mo-energy-label">0%</b></div><div class="mo-energy-track"><i id="mo-energy-fill" style="width:0%"></i></div></div><button class="mo-booster" data-booster="hammer"><b>🔨 Hammer</b><span>35 charge</span></button><button class="mo-booster" data-booster="shuffle"><b>⟳ Shuffle</b><span>55 charge</span></button><button class="mo-booster" data-booster="nova"><b>✹ Nova</b><span>100 charge</span></button></div>
      <div class="mo-pause"><b>Paused</b></div>`;
    root.appendChild(game);
    updateUi(); renderBoard(true);

    bindFullscreen(game);
    game.querySelector('[data-action="menu"]').addEventListener('click', renderMenu);
    game.querySelector('[data-action="help"]').addEventListener('click', showHelp);
    game.querySelector('.mo-board').addEventListener('click', onBoardClick);
    game.querySelector('.mo-boosters').addEventListener('click', onBoosterClick);
    showToast(perk().icon, perk().name + ' equipped', perk().desc);
    startPressureLoop();
  }

  function powerIcon(power) {
    if (power === 'hline') return '↔';
    if (power === 'vline') return '↕';
    if (power === 'bomb') return '✦';
    if (power === 'prism') return '◉';
    return '';
  }

  function renderBoard(initial = false) {
    const grid = root.querySelector('#mo-board'); if (!grid || !board) return;
    const html = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const gem = board.grid[r][c];
        if (!gem) { html.push('<span></span>'); continue; }
        const color = GEM_TYPES[gem.type];
        const k = coordKey(r, c);
        const classes = ['mo-gem'];
        if (selected && selected.r === r && selected.c === c) classes.push('selected');
        if (removalVisuals.has(k)) classes.push('removing');
        if ((initial && gem.isNew) || gem.isNew) classes.push('new');
        if (gem.created) classes.push('created');
        if (gem.power) classes.push('power-' + gem.power);
        const background = gem.power === 'prism' ? '' : `background:linear-gradient(145deg,${color.light},${color.main} 43%,${color.dark})`;
        const special = gem.power ? `<span class="mo-special-ring"></span><span class="mo-special-icon">${powerIcon(gem.power)}</span>` : '';
        const frost = board.blockers[r][c] > 0 ? `<span class="mo-frost ${board.blockers[r][c] > 1 ? 'two' : ''}"></span>` : '';
        html.push(`<button class="${classes.join(' ')}" style="${background}" data-r="${r}" data-c="${c}" role="gridcell" aria-label="${color.name}${gem.power ? ' ' + gem.power : ''}"><span class="mo-glyph">${color.glyph}</span>${special}${frost}</button>`);
        gem.isNew = false; gem.created = false;
      }
    }
    grid.innerHTML = html.join('');
  }

  function updateUi() {
    if (!root || !levelConfig) return;
    const score = root.querySelector('#mo-score'); const moves = root.querySelector('#mo-moves'); const combo = root.querySelector('#mo-combo');
    if (score) score.textContent = formatNumber(run.score);
    if (moves) { moves.textContent = run.moves; moves.style.color = run.moves <= 3 ? '#fb7185' : '#fbbf24'; }
    if (combo) combo.textContent = Math.max(1, run.combo) + '×';
    const objectives = root.querySelector('#mo-objectives'); if (objectives) objectives.innerHTML = levelConfig.objectives.map((o) => objectiveHtml(o)).join('');
    const energyFill = root.querySelector('#mo-energy-fill'); const energyLabel = root.querySelector('#mo-energy-label');
    if (energyFill) energyFill.style.width = run.energy + '%'; if (energyLabel) energyLabel.textContent = run.energy + '%';
    for (const button of root.querySelectorAll('[data-booster]')) {
      const cost = button.dataset.booster === 'hammer' ? 35 : button.dataset.booster === 'shuffle' ? 55 : 100;
      button.disabled = busy || run.energy < cost;
      button.classList.toggle('active', button.dataset.booster === 'hammer' && hammerMode);
    }
    updateTempoUi();
  }

  function onBoardClick(event) {
    const button = event.target.closest('.mo-gem');
    if (!button || busy || paused) return;
    const cell = { r: Number(button.dataset.r), c: Number(button.dataset.c) };
    initAudio();
    if (hammerMode) { useHammer(cell); return; }
    if (!selected) { selected = cell; sfx.select(); renderBoard(); return; }
    if (selected.r === cell.r && selected.c === cell.c) { selected = null; renderBoard(); return; }
    const distance = Math.abs(selected.r - cell.r) + Math.abs(selected.c - cell.c);
    if (distance !== 1) { selected = cell; sfx.select(); renderBoard(); return; }
    const origin = selected; selected = null; attemptSwap(origin, cell);
  }

  function attemptSwap(a, b) {
    busy = true; board.swap(a, b); sfx.swap(); renderBoard();
    setTimer(() => {
      const specialSet = board.specialSwapSet(a, b);
      const result = board.findMatches([b, a]);
      if (!specialSet && result.matched.size === 0) {
        run.invalidSwaps++; board.swap(a, b); sfx.fail(); renderBoard(); busy = false; updateUi(); showToast('↔', 'No match', 'That swap does not create a line'); return;
      }
      registerTempoMove();
      run.moves--; run.combo = profile.selectedPerk === 'combo_bank' ? 1 : 0;
      if (specialSet) resolveRemoval(specialSet, new Map(), () => afterMove(), true);
      else resolveMatches([b, a], afterMove);
    }, 155);
  }

  function resolveMatches(preferred, done) {
    const result = board.findMatches(preferred);
    if (result.matched.size === 0) { done(); return; }
    resolveRemoval(result.matched, result.specials, () => {
      setTimer(() => resolveMatches([], done), 180);
    });
  }

  function resolveRemoval(baseSet, specialMap, done, forcedPower = false) {
    run.combo++;
    run.bestCombo = Math.max(run.bestCombo, run.combo);
    const removeSet = new Set(baseSet);
    const activated = board.expandPowerEffects(removeSet);
    if (forcedPower && activated.size === 0) {
      for (const k of baseSet) {
        const { r, c } = parseCoord(k); const gem = board.grid[r]?.[c];
        if (gem?.power) activated.add(k);
      }
    }
    const multiplier = Math.min(10, run.combo);
    let points = 0;
    let frostHits = 0;
    const collectedDelta = Array(NUM_TYPES).fill(0);
    for (const k of removeSet) {
      const { r, c } = parseCoord(k); const gem = board.grid[r]?.[c];
      if (gem) { points += 12; collectedDelta[gem.type]++; }
      if (board.blockers[r][c] > 0) {
        const damage = profile.selectedPerk === 'frost_breaker' && activated.size > 0 ? 2 : 1;
        const before = board.blockers[r][c]; board.blockers[r][c] = Math.max(0, before - damage);
        if (before > 0 && board.blockers[r][c] === 0) { run.frost++; frostHits++; }
      }
    }
    const flowMultiplier = 1 + run.flow * tempo().flowBonus;
    points = Math.round((points * multiplier + activated.size * 75 + specialMap.size * 100) * flowMultiplier);
    run.score += points; run.matched += removeSet.size; run.powers += activated.size;
    for (let i = 0; i < NUM_TYPES; i++) { run.collected[i] += collectedDelta[i]; profile.totalCleared += collectedDelta[i]; }
    profile.totalPowers += activated.size; profile.bestCombo = Math.max(profile.bestCombo, run.combo);
    run.energy = clamp(run.energy + Math.round(removeSet.size * 2.1 + activated.size * 10 + Math.max(0, run.combo - 1) * 5 + run.flow), 0, 100);
    updateDaily({ cleared: removeSet.size, powers: activated.size, combo: run.combo });
    removalVisuals.clear(); for (const k of removeSet) removalVisuals.add(k);
    renderBoard(); updateUi(); sfx.match(run.combo); if (activated.size > 0 || specialMap.size > 0) sfx.power();
    showScoreFloat(points); if (run.combo > 1) showCombo(run.combo);
    if (frostHits) root.querySelector('#mo-board')?.classList.add('hit-frost');

    setTimer(() => {
      const removed = board.removeCollapseFill(removeSet, specialMap);
      removalVisuals.clear(); renderBoard(); updateUi();
      if (specialMap.size) showToast('✦', specialMap.size > 1 ? 'Power gems created' : 'Power gem created', 'Every matched gem cleared; a new special materialized');
      done(removed);
    }, 305);
  }

  function afterMove() {
    run.combo = 0; busy = false; updateUi(); saveProfile();
    if (objectivesComplete()) { levelComplete(); return; }
    if (run.moves <= 0) {
      if (profile.selectedPerk === 'second_chance' && !run.secondChanceUsed) {
        run.secondChanceUsed = true; run.moves = 2; updateUi(); showToast('↻', 'Second Wind', 'Two emergency moves restored'); return;
      }
      gameOver(); return;
    }
    if (!board.hasValidMove()) {
      board.shuffleUntilPlayable(); renderBoard(true); showToast('⟳', 'Board reshuffled', 'No legal moves were available');
    }
  }

  function showCombo(value) {
    const shell = root.querySelector('.mo-board-shell'); if (!shell) return;
    const node = element('div', 'mo-combo', `${value}× CASCADE`); shell.appendChild(node); setTimer(() => node.remove(), 820);
  }

  function showScoreFloat(points) {
    const shell = root.querySelector('.mo-board-shell'); if (!shell) return;
    const node = element('div', 'mo-float', '+' + formatNumber(points)); node.style.left = randInt(28, 66) + '%'; node.style.top = randInt(26, 62) + '%'; shell.appendChild(node); setTimer(() => node.remove(), 840);
  }

  function onBoosterClick(event) {
    const button = event.target.closest('[data-booster]'); if (!button || button.disabled || busy || paused) return;
    const action = button.dataset.booster;
    if (action === 'hammer') { hammerMode = !hammerMode; updateUi(); showToast('🔨', hammerMode ? 'Hammer armed' : 'Hammer cancelled', hammerMode ? 'Tap one gem to remove it' : 'No charge spent'); return; }
    if (action === 'shuffle') {
      registerTempoAction(); run.energy -= 55; board.shuffleUntilPlayable(); sfx.booster(); renderBoard(true); updateUi(); showToast('⟳', 'Board remixed', 'A fresh set of legal moves is ready'); return;
    }
    if (action === 'nova') useNova();
  }

  function useHammer(cell) {
    if (run.energy < 35 || busy) { hammerMode = false; updateUi(); return; }
    hammerMode = false; registerTempoAction(); run.energy -= 35; busy = true; sfx.booster();
    resolveRemoval(new Set([coordKey(cell.r, cell.c)]), new Map(), () => {
      setTimer(() => resolveMatches([], () => {
        run.combo = 0; busy = false; updateUi();
        if (objectivesComplete()) { levelComplete(); return; }
        if (!board.hasValidMove()) { board.shuffleUntilPlayable(); renderBoard(true); showToast('⟳', 'Board reshuffled', 'Hammer left no legal swaps'); }
      }), 160);
    });
  }

  function useNova() {
    if (run.energy < 100 || busy) return;
    registerTempoAction(); run.energy = 0; busy = true; const type = board.mostCommonType(); const set = new Set();
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) if (board.grid[r][c]?.type === type) set.add(coordKey(r, c));
    sfx.booster(); showToast('✹', 'Core Nova', 'Every ' + GEM_TYPES[type].name + ' gem is detonating');
    resolveRemoval(set, new Map(), () => { setTimer(() => resolveMatches([], () => { run.combo = 0; busy = false; updateUi(); if (objectivesComplete()) levelComplete(); }), 180); }, true);
  }

  function levelComplete() {
    if (busy && root.querySelector('.mo-overlay')) return;
    busy = true; sfx.level();
    stopPressureLoop();
    const rating = calculateRating(run, levelConfig, tempo());
    const bonus = Math.max(0, run.moves) * 35;
    run.score += bonus;
    const stars = rating.stars;
    const rewardMultiplier = tempo().reward;
    const coins = Math.round((levelConfig.rewardCoins + stars * 7) * rewardMultiplier);
    const xp = Math.round((levelConfig.rewardXp + stars * 12) * rewardMultiplier);
    profile.coins += coins; profile.xp += xp;
    const levelKey = String(levelConfig.level);
    const previousStars = Number(profile.levelStars[levelKey]) || 0;
    if (stars > previousStars) profile.totalStars += stars - previousStars;
    profile.levelStars[levelKey] = Math.max(previousStars, stars);
    profile.bestLevel = Math.max(profile.bestLevel, profile.currentLevel + 1); profile.currentLevel++;
    const oldRank = profile.rank; profile.rank = rankFromXp(profile.xp); saveProfile();
    const overlay = element('div', 'mo-overlay');
    overlay.innerHTML = `<div class="mo-modal"><div class="mo-modal-icon">🏆</div><h2>${rating.label} clear</h2><p>${levelConfig.title} completed in ${tempo().name} mode. Stars now measure efficiency, score mastery, cascades, power use, and tempo discipline.</p><div class="mo-stars">${'★'.repeat(stars)}<span style="opacity:.18">${'★'.repeat(5 - stars)}</span></div><div class="mo-rating-score"><b>${rating.total}</b>/100 performance</div><div class="mo-rating-breakdown"><div class="mo-rating-part"><small>Efficiency</small><b>${rating.efficiency}<span>/30</span></b></div><div class="mo-rating-part"><small>Mastery</small><b>${rating.mastery}<span>/20</span></b></div><div class="mo-rating-part"><small>Skill</small><b>${rating.skill}<span>/15</span></b></div><div class="mo-rating-part"><small>Tempo</small><b>${rating.tempo}<span>/10</span></b></div></div><div class="mo-results"><div class="mo-result"><small>Score</small><b>${formatNumber(run.score)}</b></div><div class="mo-result"><small>Coins</small><b style="color:#fbbf24">+${coins}</b></div><div class="mo-result"><small>XP</small><b style="color:#67e8f9">+${xp}</b></div></div>${profile.rank > oldRank ? `<p style="color:#c084fc;font-weight:900">Rank ${profile.rank} reached — a new perk or mode may be available.</p>` : ''}<div class="mo-actions"><button class="mo-btn" data-action="menu">Menu</button><button class="mo-btn primary" data-action="next">Next level</button></div></div>`;
    root.appendChild(overlay); spawnConfetti();
    overlay.querySelector('[data-action="menu"]').addEventListener('click', renderMenu);
    overlay.querySelector('[data-action="next"]').addEventListener('click', startLevel);
  }

  function gameOver() {
    stopPressureLoop(); busy = true; sfx.over(); saveProfile();
    const overlay = element('div', 'mo-overlay');
    const objectiveSummary = levelConfig.objectives.map((o) => `${o.label} ${Math.min(objectiveValue(o), o.target)}/${o.target}`).join(' · ');
    overlay.innerHTML = `<div class="mo-modal"><div class="mo-modal-icon">◇</div><h2>Out of moves</h2><p>${objectiveSummary}</p><div class="mo-results"><div class="mo-result"><small>Score</small><b>${formatNumber(run.score)}</b></div><div class="mo-result"><small>Best combo</small><b style="color:#c084fc">${run.bestCombo}×</b></div><div class="mo-result"><small>${tempo().id === 'relaxed' ? 'Power gems' : 'Pressure hits'}</small><b style="color:#fbbf24">${tempo().id === 'relaxed' ? run.powers : run.tempoStrikes}</b></div></div><div class="mo-actions"><button class="mo-btn" data-action="menu">Menu</button><button class="mo-btn primary" data-action="retry">Retry level</button></div></div>`;
    root.appendChild(overlay);
    overlay.querySelector('[data-action="menu"]').addEventListener('click', renderMenu);
    overlay.querySelector('[data-action="retry"]').addEventListener('click', startLevel);
  }

  function showHelp() {
    const overlay = element('div', 'mo-overlay');
    overlay.innerHTML = `<div class="mo-modal"><div class="mo-modal-icon">?</div><h2>How to play</h2><div class="mo-help-body"><h3>Match and move</h3><p>Tap two adjacent gems. Invalid swaps return without spending a move. Complete every objective shown above the board.</p><h3>Special gems</h3><ul><li><b>Four in a row:</b> creates a line gem after all four matched gems clear.</li><li><b>Five in a row:</b> creates a color prism.</li><li><b>T or L formation:</b> creates a large blast gem.</li><li>Swap two special gems to combine their effects.</li></ul><h3>Five-star rating</h3><p>One star means the level was cleared. Higher stars require moves remaining, score above the objective, strong cascades, useful power gems, and clean tempo play. Five stars are intentionally exceptional.</p><h3>Pulse and Surge</h3><p>These optional play styles wait for hesitation, then start a visible warning countdown. A valid move resets the pulse and builds Flow for score and Core-charge bonuses. Let it expire and entropy drains charge, crystallizes a gem, or occasionally consumes a move. Relaxed mode has no response timer.</p><h3>Core boosters</h3><p>Matches charge the meter. Hammer removes one gem, Shuffle rebuilds the move map, and Nova clears the most common color.</p><h3>Full screen</h3><p>Tap the ⛶ control inside the game or use the gamepad control in the panel title bar. Runtime API 1 asks the tend.host shell to enter its safe edge-to-edge game surface, including the mobile fallback that hides the main header.</p></div><div class="mo-actions"><button class="mo-btn primary" data-action="close">Got it</button></div></div>`;
    root.appendChild(overlay);
    overlay.querySelector('[data-action="close"]').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (event) => { if (event.target === overlay) overlay.remove(); });
  }

  function spawnConfetti() {
    const colors = ['#ec4899','#a855f7','#3b82f6','#22d3ee','#22c55e','#fbbf24','#f97316'];
    for (let i = 0; i < 30; i++) {
      const node = element('i', 'mo-confetti');
      node.style.left = randInt(0, 100) + '%'; node.style.width = randInt(4, 8) + 'px'; node.style.height = randInt(7, 13) + 'px';
      node.style.background = colors[i % colors.length]; node.style.setProperty('--drift', randInt(-70, 70) + 'px'); node.style.setProperty('--spin', randInt(360, 1100) + 'deg');
      node.style.animationDuration = (1.6 + Math.random() * 1.7) + 's'; node.style.animationDelay = (Math.random() * .7) + 's'; root.appendChild(node);
      setTimer(() => node.remove(), 4000);
    }
  }

  function onPause() { paused = true; root?.classList.add('runtime-paused'); }
  function onResume() { paused = false; root?.classList.remove('runtime-paused'); }
  const removePause = runtime.lifecycle.onPause(onPause);
  const removeResume = runtime.lifecycle.onResume(onResume);
  const removeCleanup = runtime.lifecycle.onCleanup(() => cleanup());

  function cleanup() {
    advanceScreen(); restoreShell(); root?.remove(); root = null; board = null;
    removePause?.(); removeResume?.(); removeCleanup?.();
    if (currentAudio) { currentAudio.close().catch(() => {}); currentAudio = null; }
  }

  return {
    async mount(container) {
      setupShell(container);
      root = element('div', 'mo-root'); container.innerHTML = ''; container.style.cssText = 'width:100%;height:100%;overflow:hidden;background:#090b17;'; container.appendChild(root);
      root.innerHTML = '<div class="mo-screen" style="display:grid;place-items:center"><div style="text-align:center"><div class="mo-logo-mark" style="margin:auto">◆</div><p style="font-size:11px;letter-spacing:2px;color:#94a3b8;font-weight:900">PREPARING ODYSSEY</p></div></div><div class="mo-pause"><b>Paused</b></div>';
      if (!profileLoaded) await loadProfile();
      if (root) renderMenu();
    },
    unmount() { cleanup(); },
  };
}
