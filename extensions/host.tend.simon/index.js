import { createArcade, setTimeout, clearTimeout, setInterval, clearInterval } from './arcade-kit.js';

const STYLE_ID = 'tend-simon-neural-pulse-v3';
const PROFILE_KEY = 'simon_neural_profile_v3';
const MAX_SESSIONS = 60;

const PADS = [
  { id: 'red', name: 'Ember', symbol: 'Prism', key: '1', freq: 329.63, color: '#fb5470', deep: '#9f1239', glow: 'rgba(251,84,112,.72)' },
  { id: 'blue', name: 'Tide', symbol: 'Kite', key: '2', freq: 277.18, color: '#38bdf8', deep: '#075985', glow: 'rgba(56,189,248,.72)' },
  { id: 'green', name: 'Pulse', symbol: 'Orb', key: '3', freq: 440, color: '#34d399', deep: '#047857', glow: 'rgba(52,211,153,.72)' },
  { id: 'gold', name: 'Spark', symbol: 'Tile', key: '4', freq: 659.25, color: '#fbbf24', deep: '#b45309', glow: 'rgba(251,191,36,.72)' }
];

const CIRCUITS = [
  { name: 'Signal Garden', tag: 'Foundations', desc: 'Build clean visual and tonal recall.', accent: '#38bdf8', icon: '◈' },
  { name: 'Pattern Forge', tag: 'Chunking', desc: 'Longer patterns reward grouping and rhythm.', accent: '#a78bfa', icon: '✦' },
  { name: 'Tempo Core', tag: 'Speed', desc: 'Playback accelerates while accuracy still matters.', accent: '#f472b6', icon: '◉' },
  { name: 'Reverse Lab', tag: 'Working memory', desc: 'Recall the same signal in reverse order.', accent: '#34d399', icon: '↶' },
  { name: 'Phase Matrix', tag: 'Flexibility', desc: 'Pad positions shift between selected rounds.', accent: '#fbbf24', icon: '⌘' },
  { name: 'Neural Storm', tag: 'Mastery', desc: 'Speed, shifting positions, and tighter lives combine.', accent: '#fb7185', icon: '⚡' }
];

const DEFAULT_PROFILE = {
  version: 3,
  currentSession: 1,
  bestSession: 1,
  sessionStars: {},
  bestSequence: 0,
  bestScore: 0,
  totalRounds: 0,
  totalInputs: 0,
  totalTrainingMs: 0,
  flawlessRuns: 0
};

function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
@keyframes sn-screen-in{from{opacity:0;transform:translateY(12px) scale(.985)}to{opacity:1;transform:none}}
@keyframes sn-pad-lit{0%{filter:brightness(1);transform:scale(1)}35%{filter:brightness(1.9);transform:scale(1.055)}100%{filter:brightness(1);transform:scale(1)}}
@keyframes sn-core-pulse{0%,100%{box-shadow:0 0 0 8px rgba(99,102,241,.08),0 0 34px rgba(99,102,241,.22)}50%{box-shadow:0 0 0 13px rgba(99,102,241,.04),0 0 52px rgba(99,102,241,.38)}}
@keyframes sn-wrong{0%,100%{transform:translateX(0)}25%{transform:translateX(-7px)}75%{transform:translateX(7px)}}
@keyframes sn-flow{0%{opacity:0;transform:translate(-50%,4px) scale(.7)}25%{opacity:1}100%{opacity:0;transform:translate(-50%,-35px) scale(1.08)}}
@keyframes sn-shift{0%{opacity:.35;transform:scale(.96)}100%{opacity:1;transform:none}}
.sn-root{container-type:inline-size;container-name:simon;width:100%;height:100%;min-width:0;min-height:100%;flex:1 1 auto;position:relative;overflow:hidden;background:radial-gradient(circle at 16% -5%,rgba(56,189,248,.15),transparent 32%),radial-gradient(circle at 92% 12%,rgba(168,85,247,.15),transparent 31%),linear-gradient(180deg,#070b18 0%,#0a1022 55%,#070b16 100%);color:#f8fafc;font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;user-select:none;-webkit-user-select:none;isolation:isolate}
.sn-root::before{content:"";position:absolute;inset:0;pointer-events:none;opacity:.28;background-image:radial-gradient(circle at 20% 30%,rgba(255,255,255,.65) 0 1px,transparent 1.6px),radial-gradient(circle at 75% 58%,rgba(255,255,255,.42) 0 1px,transparent 1.6px),radial-gradient(circle at 40% 82%,rgba(255,255,255,.3) 0 1px,transparent 1.6px);background-size:79px 83px,103px 91px,127px 109px}
.sn-root *{box-sizing:border-box}.sn-root button{font:inherit}.sn-screen{position:absolute;inset:0;width:100%;height:100%;z-index:2;display:flex;flex-direction:column;min-width:0;min-height:0;animation:sn-screen-in .26s cubic-bezier(.22,.72,.16,1)}
.sn-menu{padding:18px;overflow:auto;scrollbar-width:thin;scrollbar-color:rgba(148,163,184,.24) transparent;gap:12px}
.sn-brand{display:flex;align-items:center;justify-content:space-between;gap:12px;flex:0 0 auto}.sn-logo{display:flex;align-items:center;gap:11px;min-width:0}.sn-logo-mark{width:50px;height:50px;border-radius:17px;display:grid;grid-template-columns:1fr 1fr;gap:4px;padding:9px;background:linear-gradient(145deg,#172554,#312e81);border:1px solid rgba(255,255,255,.15);box-shadow:0 14px 38px rgba(59,130,246,.22),inset 0 1px rgba(255,255,255,.18)}.sn-logo-mark i{border-radius:50%;box-shadow:0 0 12px currentColor}.sn-logo-mark i:nth-child(1){background:#fb5470;color:#fb5470}.sn-logo-mark i:nth-child(2){background:#38bdf8;color:#38bdf8}.sn-logo-mark i:nth-child(3){background:#34d399;color:#34d399}.sn-logo-mark i:nth-child(4){background:#fbbf24;color:#fbbf24}.sn-title{font-size:24px;font-weight:950;letter-spacing:-.7px;white-space:nowrap}.sn-kicker{margin-top:4px;color:#91a0b9;font-size:9px;letter-spacing:1.8px;text-transform:uppercase;font-weight:850}.sn-profile{display:flex;gap:6px}.sn-chip{min-width:58px;padding:7px 9px;border-radius:12px;border:1px solid rgba(255,255,255,.08);background:rgba(15,23,42,.63);text-align:center}.sn-chip small{display:block;color:#64748b;font-size:7px;text-transform:uppercase;letter-spacing:1px;font-weight:850}.sn-chip b{display:block;margin-top:2px;font-size:14px;font-variant-numeric:tabular-nums}
.sn-hero{position:relative;overflow:hidden;border:1px solid rgba(255,255,255,.1);border-radius:21px;padding:16px;background:linear-gradient(145deg,rgba(30,41,75,.75),rgba(15,23,42,.52));box-shadow:0 22px 58px rgba(0,0,0,.32);flex:0 0 auto}.sn-session-row{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}.sn-session-tag{color:#67e8f9;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;font-weight:900}.sn-session-name{margin-top:4px;font-size:27px;font-weight:950;letter-spacing:-.7px}.sn-session-desc{margin-top:7px;max-width:310px;color:#9aa8bd;font-size:10.5px;line-height:1.5}.sn-session-orb{width:68px;height:68px;border-radius:50%;display:grid;place-items:center;flex:0 0 auto;font-size:25px;font-weight:950;background:radial-gradient(circle at 33% 24%,#fff 0 4%,#60a5fa 8%,#6366f1 48%,#312e81);box-shadow:0 0 0 9px rgba(99,102,241,.08),0 0 34px rgba(99,102,241,.44)}
.sn-objectives{display:flex;gap:7px;flex-wrap:wrap;margin-top:13px}.sn-pill{padding:7px 10px;border-radius:999px;background:rgba(2,6,23,.42);border:1px solid rgba(255,255,255,.075);font-size:9px;color:#cbd5e1;font-weight:800}.sn-path{display:grid;grid-template-columns:repeat(10,1fr);gap:5px;margin-top:14px}.sn-path i{height:7px;border-radius:999px;background:rgba(255,255,255,.07)}.sn-path i.done{background:linear-gradient(90deg,#22d3ee,#6366f1)}.sn-path i.current{background:linear-gradient(90deg,#f472b6,#fbbf24);box-shadow:0 0 12px rgba(244,114,182,.42)}.sn-play{width:100%;min-height:50px;margin-top:13px;border:1px solid rgba(255,255,255,.14);border-radius:15px;color:#fff;cursor:pointer;font-weight:950;text-transform:uppercase;letter-spacing:1px;background:linear-gradient(115deg,#ec4899,#8b5cf6 52%,#2563eb);box-shadow:0 13px 32px rgba(99,102,241,.3),inset 0 1px rgba(255,255,255,.22);transition:transform .16s,filter .16s}.sn-play:hover{transform:translateY(-1px);filter:brightness(1.08)}
.sn-menu-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}.sn-menu-card{min-width:0;padding:12px;border-radius:16px;border:1px solid rgba(255,255,255,.075);background:rgba(15,23,42,.55)}.sn-menu-card-head{display:flex;justify-content:space-between;gap:8px;color:#64748b;font-size:8px;text-transform:uppercase;letter-spacing:1.15px;font-weight:900}.sn-menu-card strong{display:block;margin-top:7px;font-size:13px}.sn-menu-card p{margin:4px 0 0;color:#7f8ca2;font-size:8.5px;line-height:1.42}.sn-secondary{width:100%;min-height:34px;margin-top:9px;border-radius:10px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.045);color:#cbd5e1;cursor:pointer;font-size:9px;font-weight:850}.sn-session-nav{display:flex;align-items:center;gap:8px;margin-top:8px}.sn-session-nav button{width:38px;height:38px;border-radius:11px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.045);color:#cbd5e1;cursor:pointer;font-weight:900}.sn-session-nav div{flex:1;text-align:center}.sn-session-nav small{display:block;color:#64748b;font-size:7px;text-transform:uppercase;letter-spacing:1px;font-weight:850}.sn-session-nav b{display:block;margin-top:2px;font-size:15px}.sn-daily{display:flex;align-items:center;gap:10px;padding:11px;border-radius:15px;border:1px solid rgba(34,211,238,.16);background:linear-gradient(110deg,rgba(8,47,73,.44),rgba(15,23,42,.55))}.sn-daily-icon{width:39px;height:39px;border-radius:12px;display:grid;place-items:center;background:rgba(34,211,238,.12);font-size:18px}.sn-daily-copy{flex:1;min-width:0}.sn-daily-copy b{display:block;font-size:11px}.sn-daily-copy span{display:block;margin-top:2px;color:#94a3b8;font-size:8.5px}.sn-daily-reward{color:#fbbf24;font-size:10px;font-weight:900}
.sn-game{padding:8px;gap:6px}.sn-top{flex:0 0 auto;padding:8px 9px;border:1px solid rgba(255,255,255,.09);border-radius:16px;background:rgba(9,14,31,.78);backdrop-filter:blur(14px);box-shadow:0 8px 26px rgba(0,0,0,.22)}.sn-top-row{display:flex;align-items:center;gap:7px}.sn-icon-btn{width:34px;height:34px;border-radius:10px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.05);color:#cbd5e1;cursor:pointer;display:grid;place-items:center;font-weight:900;flex:0 0 auto}.sn-level-info{min-width:88px}.sn-level-info b{display:block;font-size:11px}.sn-level-info span{display:block;margin-top:3px;color:#64748b;font-size:7px;text-transform:uppercase;letter-spacing:.9px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sn-stats{display:flex;flex:1;justify-content:center;min-width:0}.sn-stat{min-width:55px;padding:0 6px;text-align:center;border-left:1px solid rgba(255,255,255,.06)}.sn-stat small{display:block;color:#64748b;font-size:6.5px;text-transform:uppercase;letter-spacing:.9px;font-weight:850}.sn-stat b{display:block;margin-top:2px;font-size:15px;font-variant-numeric:tabular-nums}.sn-lives{display:flex;gap:3px;margin-left:4px}.sn-life{width:7px;height:7px;border-radius:50%;background:#334155}.sn-life.on{background:#fb7185;box-shadow:0 0 8px rgba(251,113,133,.6)}.sn-progress{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:7px}.sn-progress-card{padding:6px 8px;border-radius:10px;border:1px solid rgba(255,255,255,.055);background:rgba(255,255,255,.032)}.sn-progress-line{display:flex;justify-content:space-between;gap:6px;color:#94a3b8;font-size:7px;font-weight:850}.sn-progress-line b{color:#e2e8f0}.sn-track{height:5px;margin-top:5px;border-radius:999px;background:rgba(255,255,255,.06);overflow:hidden}.sn-track i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#22d3ee,#8b5cf6,#ec4899);transition:width .28s}
.sn-main{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;position:relative}.sn-board-wrap{width:min(100%,calc(100dvh - 250px));max-width:440px;aspect-ratio:1;position:relative;padding:11px;border-radius:31px;border:1px solid rgba(255,255,255,.09);background:radial-gradient(circle at 50% 50%,rgba(99,102,241,.16),rgba(8,14,33,.72) 51%,rgba(2,6,23,.95));box-shadow:0 30px 75px rgba(0,0,0,.45),inset 0 1px rgba(255,255,255,.06)}.sn-board{width:100%;height:100%;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:13px;position:relative;animation:sn-shift .25s ease}.sn-pad{position:relative;border:0;cursor:pointer;overflow:hidden;color:#fff;transition:transform .12s,filter .12s,opacity .12s;touch-action:manipulation;-webkit-tap-highlight-color:transparent;box-shadow:inset 0 2px rgba(255,255,255,.23),inset 0 -12px 22px rgba(0,0,0,.25),0 13px 28px rgba(0,0,0,.34)}.sn-pad:nth-child(1){border-radius:100% 24% 24% 24%}.sn-pad:nth-child(2){border-radius:24% 100% 24% 24%}.sn-pad:nth-child(3){border-radius:24% 24% 24% 100%}.sn-pad:nth-child(4){border-radius:24% 24% 100% 24%}.sn-pad::before{content:"";position:absolute;inset:0;background:linear-gradient(145deg,rgba(255,255,255,.23),transparent 42%)}.sn-pad::after{content:"";position:absolute;inset:9%;border:1px solid rgba(255,255,255,.12);border-radius:inherit}.sn-pad:hover:not(:disabled){filter:brightness(1.12);transform:translateY(-2px)}.sn-pad:active:not(:disabled){transform:scale(.975)}.sn-pad:disabled{cursor:default;filter:saturate(.72) brightness(.73)}.sn-pad.lit{animation:sn-pad-lit .4s ease;filter:brightness(1.72);box-shadow:0 0 45px var(--glow),0 0 85px var(--glow),inset 0 2px rgba(255,255,255,.48),inset 0 -8px 20px rgba(0,0,0,.14);z-index:4}.sn-pad.wrong{animation:sn-wrong .28s ease;filter:grayscale(.15) brightness(1.55)}.sn-pad-content{position:absolute;inset:0;display:grid;place-items:center;align-content:center;gap:8px;z-index:2}.sn-pad-glyph{width:clamp(54px,18cqw,92px);height:clamp(54px,18cqw,92px);display:block;filter:drop-shadow(0 8px 20px rgba(0,0,0,.24))}.sn-pad-glyph svg{width:100%;height:100%;display:block}.sn-pad-glyph .metal{fill:#f8fafc}.sn-pad-glyph .edge{fill:rgba(255,255,255,.72)}.sn-pad-glyph .soft{fill:rgba(255,255,255,.24)}.sn-pad-glyph .outline{stroke:rgba(255,255,255,.6);stroke-width:2;fill:none;stroke-linejoin:round}.sn-pad-glyph .ring{stroke:rgba(255,255,255,.72);stroke-width:5;fill:none}.sn-pad-glyph .ring-soft{stroke:rgba(255,255,255,.25);stroke-width:2;fill:none}.sn-pad-name{font-size:8px;letter-spacing:1.5px;text-transform:uppercase;font-weight:900;opacity:.64}.sn-core{position:absolute;left:50%;top:50%;z-index:12;width:31%;aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;display:grid;place-items:center;padding:9px;text-align:center;background:radial-gradient(circle at 35% 25%,#26345d,#111a37 52%,#070b19);border:2px solid rgba(255,255,255,.13);box-shadow:0 0 0 8px rgba(99,102,241,.08),0 0 34px rgba(99,102,241,.22);animation:sn-core-pulse 2.4s ease-in-out infinite;pointer-events:none}.sn-core-ring{position:absolute;inset:7px;border-radius:50%;background:conic-gradient(#22d3ee var(--progress,0%),rgba(255,255,255,.055) 0);mask:radial-gradient(farthest-side,transparent calc(100% - 5px),#000 0)}.sn-core-copy{position:relative;z-index:2}.sn-core-copy b{display:block;font-size:clamp(14px,3.5cqw,22px)}.sn-core-copy span{display:block;margin-top:2px;color:#94a3b8;font-size:clamp(6px,1.6cqw,9px);text-transform:uppercase;letter-spacing:.8px;font-weight:850}.sn-response{position:absolute;left:50%;bottom:-21px;transform:translateX(-50%);width:62%;height:7px;border-radius:999px;background:rgba(255,255,255,.07);overflow:hidden;opacity:0;transition:opacity .16s}.sn-response.active{opacity:1}.sn-response i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#22d3ee,#fbbf24,#fb7185);transition:width .05s linear}.sn-flow-pop{position:absolute;left:50%;top:45%;z-index:30;pointer-events:none;font-size:25px;font-weight:950;color:#fff;text-shadow:0 0 20px #8b5cf6,0 3px 10px rgba(0,0,0,.7);animation:sn-flow .8s ease forwards}
.sn-bottom{flex:0 0 auto;display:grid;grid-template-columns:minmax(0,1.3fr) repeat(2,minmax(0,1fr));gap:6px}.sn-focus{padding:8px;border-radius:13px;border:1px solid rgba(34,211,238,.13);background:rgba(8,47,73,.24)}.sn-focus-line{display:flex;justify-content:space-between;gap:6px;color:#67e8f9;font-size:7px;text-transform:uppercase;letter-spacing:.9px;font-weight:900}.sn-tool{min-width:0;padding:7px 5px;border-radius:13px;border:1px solid rgba(255,255,255,.08);background:rgba(15,23,42,.64);color:#94a3b8;cursor:pointer;text-align:center}.sn-tool:disabled{opacity:.4;cursor:not-allowed}.sn-tool b{display:block;color:#e2e8f0;font-size:8px}.sn-tool span{display:block;margin-top:3px;font-size:6.5px}.sn-side{display:none}.sn-overlay{position:absolute;inset:0;z-index:1400;display:grid;place-items:center;padding:14px;background:rgba(2,6,23,.75);backdrop-filter:blur(14px)}.sn-modal{width:min(430px,100%);max-height:calc(100% - 8px);overflow:auto;padding:20px;border-radius:23px;border:1px solid rgba(255,255,255,.12);background:linear-gradient(160deg,rgba(22,31,58,.98),rgba(8,12,28,.98));box-shadow:0 30px 90px rgba(0,0,0,.65),inset 0 1px rgba(255,255,255,.08)}.sn-modal-icon{width:58px;height:58px;margin:0 auto 10px;border-radius:18px;display:grid;place-items:center;font-size:27px;background:linear-gradient(145deg,#22d3ee,#8b5cf6,#ec4899)}.sn-modal h2{text-align:center;margin:0;font-size:24px}.sn-modal>p{text-align:center;margin:7px auto 0;color:#94a3b8;font-size:10px;line-height:1.5;max-width:350px}.sn-stars{text-align:center;margin:13px 0 8px;font-size:30px;letter-spacing:5px;color:#fbbf24;text-shadow:0 0 18px rgba(251,191,36,.44)}.sn-breakdown{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin:11px 0}.sn-breakdown div{padding:9px 5px;border-radius:11px;border:1px solid rgba(255,255,255,.06);background:rgba(255,255,255,.035);text-align:center}.sn-breakdown small{display:block;color:#64748b;font-size:7px;text-transform:uppercase;letter-spacing:.8px;font-weight:850}.sn-breakdown b{display:block;margin-top:3px;font-size:14px}.sn-actions{display:flex;gap:8px;margin-top:14px}.sn-actions button{flex:1;min-height:42px;border-radius:13px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.05);color:#cbd5e1;cursor:pointer;font-weight:900;font-size:10px}.sn-actions button.primary{background:linear-gradient(115deg,#ec4899,#8b5cf6,#2563eb);color:#fff}.sn-help-copy{text-align:left!important}.sn-help-copy h3{margin:13px 0 4px;color:#c084fc;font-size:10px;text-transform:uppercase;letter-spacing:1px}.sn-help-copy p,.sn-help-copy li{color:#cbd5e1;font-size:9px;line-height:1.55}.sn-help-copy ul{padding-left:18px;margin:4px 0}.sn-paused{display:none;position:absolute;inset:0;z-index:1000;place-items:center;background:rgba(2,6,23,.68);backdrop-filter:blur(8px);font-size:20px;font-weight:950;text-transform:uppercase;letter-spacing:2px}.sn-root.is-paused .sn-paused{display:grid}
@container simon (max-width:430px){.sn-menu{padding:13px;gap:9px}.sn-title{font-size:20px}.sn-profile{gap:4px}.sn-chip{min-width:48px;padding:6px}.sn-hero{padding:13px}.sn-session-name{font-size:22px}.sn-session-orb{width:58px;height:58px;font-size:21px}.sn-menu-grid{grid-template-columns:1fr}.sn-game{padding:5px;padding-bottom:max(58px,env(safe-area-inset-bottom));gap:4px}.sn-top{padding:6px}.sn-stat{min-width:42px;padding:0 4px}.sn-stat b{font-size:13px}.sn-level-info{min-width:70px}.sn-main{align-items:flex-start;padding-top:3px}.sn-board-wrap{width:min(100%,calc(100dvh - 254px));padding:7px;border-radius:24px}.sn-board{gap:8px}.sn-response{bottom:-14px}.sn-bottom{grid-template-columns:1.2fr 1fr 1fr;gap:4px}.sn-focus{padding:6px}.sn-tool{padding:6px 2px}.sn-pad-name{display:none}}
@container simon (min-width:900px) and (min-height:650px){.sn-menu{display:grid;grid-template-columns:minmax(420px,650px) minmax(300px,390px);grid-template-rows:auto 1fr auto;justify-content:center;align-content:center;column-gap:22px;padding:26px 34px}.sn-brand{grid-column:1/-1}.sn-hero{grid-column:1;grid-row:2;padding:24px;display:flex;flex-direction:column;justify-content:center}.sn-session-name{font-size:40px}.sn-session-desc{font-size:13px;max-width:450px}.sn-session-orb{width:96px;height:96px;font-size:34px}.sn-path{margin-top:22px}.sn-play{margin-top:auto;min-height:56px}.sn-menu-side{grid-column:2;grid-row:2;display:flex;flex-direction:column;gap:11px}.sn-menu-grid{grid-template-columns:1fr}.sn-daily{grid-column:1/-1}.sn-game{display:grid;grid-template-columns:230px minmax(520px,690px) 220px;grid-template-rows:auto minmax(0,1fr);grid-template-areas:"top top top" "left board right";justify-content:center;align-content:center;gap:12px;padding:16px 22px}.sn-top{grid-area:top;max-width:1150px;width:100%;justify-self:center}.sn-main{grid-area:board}.sn-board-wrap{width:min(100%,72vh);max-width:660px}.sn-bottom{grid-area:right;display:flex;flex-direction:column;align-self:center}.sn-focus{padding:13px}.sn-tool{min-height:72px;display:grid;place-items:center}.sn-tool b{font-size:11px}.sn-tool span{font-size:8px}.sn-side{display:flex;grid-area:left;align-self:center;flex-direction:column;gap:10px}.sn-side-card{padding:14px;border-radius:17px;border:1px solid rgba(255,255,255,.08);background:rgba(15,23,42,.62)}.sn-side-card small{display:block;color:#64748b;font-size:8px;text-transform:uppercase;letter-spacing:1.1px;font-weight:900}.sn-side-card b{display:block;margin-top:4px;font-size:17px}.sn-side-card p{margin:6px 0 0;color:#8492a7;font-size:9px;line-height:1.45}}
.sn-root.sn-wide .sn-game{display:grid!important;grid-template-columns:minmax(180px,230px) minmax(420px,690px) minmax(180px,220px)!important;grid-template-rows:auto minmax(0,1fr)!important;grid-template-areas:"top top top" "left board right"!important;justify-content:center;align-content:center;gap:12px;padding:16px 22px}.sn-root.sn-wide .sn-top{grid-area:top;max-width:1150px;width:100%;justify-self:center}.sn-root.sn-wide .sn-main{grid-area:board;min-width:0;min-height:0}.sn-root.sn-wide .sn-board-wrap{width:min(100%,72vh);max-width:660px;min-width:360px}.sn-root.sn-wide .sn-bottom{grid-area:right;display:flex;flex-direction:column;align-self:center}.sn-root.sn-wide .sn-focus{padding:13px}.sn-root.sn-wide .sn-tool{min-height:72px;display:grid;place-items:center}.sn-root.sn-wide .sn-tool b{font-size:11px}.sn-root.sn-wide .sn-tool span{font-size:8px}.sn-root.sn-wide .sn-side{display:flex;grid-area:left;align-self:center;flex-direction:column;gap:10px}.sn-root.sn-wide .sn-side-card{padding:14px;border-radius:17px;border:1px solid rgba(255,255,255,.08);background:rgba(15,23,42,.62)}.sn-root.sn-wide .sn-side-card small{display:block;color:#64748b;font-size:8px;text-transform:uppercase;letter-spacing:1.1px;font-weight:900}.sn-root.sn-wide .sn-side-card b{display:block;margin-top:4px;font-size:17px}.sn-root.sn-wide .sn-side-card p{margin:6px 0 0;color:#8492a7;font-size:9px;line-height:1.45}.sn-root.sn-panel .sn-game{display:flex!important;flex-direction:column!important}.sn-root.sn-panel .sn-side{display:none!important}.sn-root.sn-panel .sn-main{flex:1!important;min-height:0!important}.sn-root.sn-panel .sn-board-wrap{width:min(100%,calc(100% - 6px),calc(100dvh - 250px));max-width:440px}.sn-root.sn-mobile .sn-game{display:flex!important;flex-direction:column!important;padding:5px;padding-bottom:max(58px,env(safe-area-inset-bottom));gap:4px}.sn-root.sn-mobile .sn-side{display:none!important}.sn-root.sn-mobile .sn-main{align-items:flex-start;padding-top:3px}.sn-root.sn-mobile .sn-board-wrap{width:min(100%,calc(100dvh - 254px));max-width:440px;padding:7px;border-radius:24px}
`;
  document.head.appendChild(style);
}

function el(tag, cls, html) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (html != null) node.innerHTML = html;
  return node;
}

function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
function rankFromXp(xp) { return Math.max(1, Math.floor(Math.sqrt(Math.max(0, xp) / 180)) + 1); }
function shuffled(values) {
  const copy = values.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function sessionConfig(session) {
  const circuitIndex = Math.min(CIRCUITS.length - 1, Math.floor((session - 1) / 10));
  const circuit = CIRCUITS[circuitIndex];
  const local = (session - 1) % 10;
  const targetRounds = Math.min(18, 5 + Math.floor((session - 1) / 4));
  const playbackInterval = Math.max(270, 690 - (session - 1) * 6 - circuitIndex * 12);
  const flashDuration = Math.max(165, playbackInterval * .53);
  const responseWindow = Math.max(1450, 3900 - (session - 1) * 28);
  return {
    session,
    circuitIndex,
    circuit,
    local,
    targetRounds,
    playbackInterval,
    flashDuration,
    responseWindow,
    shiftPads: session >= 41,
    shiftEvery: session >= 51 ? 1 : 2,
    lives: session >= 51 ? 2 : 3,
    parResponse: Math.max(520, 1450 - session * 11),
    phaseLabel: session >= 51 ? 'Neural Storm' : session >= 41 ? 'Phase Shift' : session >= 31 ? 'Reverse Ready' : session >= 21 ? 'Tempo Training' : session >= 11 ? 'Pattern Chunking' : 'Foundation'
  };
}

export default function activate(host) {
  ensureStyles();
  const arcade = createArcade(host, {
    id: 'simon-neural-pulse',
    name: 'Simon Odyssey: Neural Pulse',
    icon: '🧠',
    subtitle: 'Adaptive recall, focus timing, and daily brain training',
    modes: [
      { id: 'classic', name: 'Classic Flow', icon: '♪', desc: 'Repeat the growing sequence in order', unlock: 1 },
      { id: 'reverse', name: 'Reverse Recall', icon: '↶', desc: 'Repeat every pattern backward', unlock: 3 },
      { id: 'pulse', name: 'Focus Pulse', icon: '⚡', desc: 'A response timer tests fast recall', unlock: 5 }
    ],
    perks: [
      { id: 'encore', name: 'Encore', icon: '↻', desc: 'Replay one full sequence each session', unlock: 1 },
      { id: 'shield', name: 'Focus Shield', icon: '◉', desc: 'Forgive one wrong input', unlock: 3 },
      { id: 'calm', name: 'Calm Tempo', icon: '◷', desc: 'Slightly slower playback with lower score', unlock: 5 }
    ],
    missions: [
      { event: 'step', target: 140, title: 'Signal Keeper', detail: 'Repeat 140 signals', icon: '♪', reward: 85 },
      { event: 'round', target: 28, title: 'Round Runner', detail: 'Complete 28 rounds', icon: '◉', reward: 105 },
      { event: 'perfect', target: 8, title: 'Perfect Recall', detail: 'Finish eight flawless rounds', icon: '✦', reward: 125 },
      { event: 'win', target: 3, title: 'Circuit Climber', detail: 'Clear three training sessions', icon: '🏆', reward: 140 }
    ]
  });

  const profile = structuredClone(DEFAULT_PROFILE);
  const runtimeTimers = host.runtime.timers;
  let root = null;
  let layoutObserver = null;
  let layoutFrame = 0;
  let screen = 'loading';
  let config = sessionConfig(1);
  let sequence = [];
  let inputIndex = 0;
  let round = 0;
  let score = 0;
  let lives = 3;
  let state = 'idle';
  let combo = 0;
  let bestCombo = 0;
  let mistakes = 0;
  let completedInputs = 0;
  let responseTotal = 0;
  let responseCount = 0;
  let lastInputAt = 0;
  let roundMistakes = 0;
  let replayUsed = false;
  let shieldUsed = false;
  let aidsUsed = 0;
  let focus = 0;
  let currentOrder = PADS.map(p => p.id);
  let audio = null;
  let pending = new Set();
  let responseInterval = null;
  let responseRemaining = 0;
  let responseMax = 0;
  let lastInputElapsed = 0;
  let sessionStartedAt = 0;
  let pausedClassRemove = null;
  let resumedClassRemove = null;
  let arcadeChangeRemove = null;

  const schedule = (fn, delay) => {
    let id;
    id = setTimeout(() => { pending.delete(id); fn(); }, delay);
    pending.add(id);
    return id;
  };
  const clearScheduled = () => {
    for (const id of pending) clearTimeout(id);
    pending.clear();
  };
  const stopResponseTimer = () => {
    if (responseInterval != null) clearInterval(responseInterval);
    responseInterval = null;
    responseRemaining = 0;
    responseMax = 0;
    updateResponseUi();
  };
  const resetStateTimers = () => { clearScheduled(); stopResponseTimer(); };

  function syncResponsiveLayout() {
    if (!root) return;
    const rect = root.getBoundingClientRect();
    const width = Math.max(0, rect.width);
    const height = Math.max(0, rect.height);
    const mobile = width <= 430;
    const wide = width >= 900 && height >= 650;
    root.classList.toggle('sn-wide', wide);
    root.classList.toggle('sn-panel', !wide && !mobile);
    root.classList.toggle('sn-mobile', mobile);
    root.style.setProperty('--sn-live-width', `${Math.max(1, width)}px`);
    root.style.setProperty('--sn-live-height', `${Math.max(1, height)}px`);
  }

  function scheduleResponsiveLayout() {
    if (layoutFrame) window.cancelAnimationFrame(layoutFrame);
    layoutFrame = window.requestAnimationFrame(() => {
      layoutFrame = 0;
      syncResponsiveLayout();
      window.requestAnimationFrame(syncResponsiveLayout);
    });
  }

  function initAudio() {
    if (audio) return audio;
    try { audio = new (window.AudioContext || window.webkitAudioContext)(); }
    catch { audio = null; }
    return audio;
  }

  function tone(pad, duration = .16, wrong = false) {
    const ctx = initAudio();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = wrong ? 'sawtooth' : 'sine';
    osc.frequency.setValueAtTime(wrong ? 145 : pad.freq, now);
    gain.gain.setValueAtTime(wrong ? .06 : .08, now);
    gain.gain.exponentialRampToValueAtTime(.001, now + duration);
    osc.connect(gain); gain.connect(ctx.destination); osc.start(now); osc.stop(now + duration);
  }

  async function loadProfile() {
    try {
      const saved = await host.storage.get(PROFILE_KEY);
      if (saved && typeof saved === 'object') Object.assign(profile, saved);
    } catch { /* defaults */ }
    try {
      const oldHigh = await host.storage.get('simon_high');
      if (typeof oldHigh === 'number') profile.bestSequence = Math.max(profile.bestSequence || 0, oldHigh);
    } catch { /* optional migration */ }
    profile.currentSession = clamp(Number(profile.currentSession) || 1, 1, MAX_SESSIONS);
    profile.bestSession = clamp(Number(profile.bestSession) || 1, 1, MAX_SESSIONS);
    if (!profile.sessionStars || typeof profile.sessionStars !== 'object') profile.sessionStars = {};
  }

  function saveProfile() { host.storage.set(PROFILE_KEY, profile).catch(() => {}); }
  function totalStars() { return Object.values(profile.sessionStars).reduce((sum, value) => sum + (Number(value) || 0), 0); }
  function activeMode() { return arcade.mode(); }
  function activePerk() { return arcade.perk(); }

  function nextSignal() {
    const last = sequence[sequence.length - 1];
    const secondLast = sequence[sequence.length - 2];
    let choices = PADS.map(p => p.id);
    if (last === secondLast && last) choices = choices.filter(id => id !== last);
    return choices[Math.floor(Math.random() * choices.length)];
  }

  function expectedSequence() {
    return activeMode().id === 'reverse' ? sequence.slice().reverse() : sequence;
  }

  function playbackInterval() {
    const perkScale = activePerk().id === 'calm' ? 1.16 : 1;
    const pulseScale = activeMode().id === 'pulse' ? .92 : 1;
    return Math.round(config.playbackInterval * perkScale * pulseScale);
  }

  function renderMenu() {
    resetStateTimers();
    screen = 'menu';
    config = sessionConfig(profile.currentSession);
    const daily = arcade.profile.daily || { title: 'Brain training', detail: 'Complete today’s challenge', reward: 0, claimed: false };
    const mode = activeMode();
    const perk = activePerk();
    const selectedStars = profile.sessionStars[profile.currentSession] || 0;
    const pathStart = Math.floor((profile.currentSession - 1) / 10) * 10 + 1;
    root.innerHTML = '';
    const menu = el('div', 'sn-screen sn-menu');
    menu.innerHTML = `
      <div class="sn-brand">
        <div class="sn-logo"><div class="sn-logo-mark"><i></i><i></i><i></i><i></i></div><div><div class="sn-title">Simon Odyssey</div><div class="sn-kicker">Neural Pulse Training</div></div></div>
        <div class="sn-profile"><div class="sn-chip"><small>Rank</small><b>${arcade.profile.rank}</b></div><div class="sn-chip"><small>Stars</small><b style="color:#fbbf24">★ ${totalStars()}</b></div></div>
      </div>
      <section class="sn-hero">
        <div class="sn-session-row"><div><div class="sn-session-tag">Session ${profile.currentSession} · ${config.circuit.tag}</div><div class="sn-session-name">${config.circuit.name}</div><div class="sn-session-desc">${config.circuit.desc} Reach round ${config.targetRounds} to stabilize this neural circuit.</div></div><div class="sn-session-orb">${profile.currentSession}</div></div>
        <div class="sn-objectives"><span class="sn-pill">◉ ${config.targetRounds} rounds</span><span class="sn-pill">◷ ${Math.round(config.playbackInterval)} ms tempo</span><span class="sn-pill">● ${config.lives} lives</span>${config.shiftPads ? '<span class="sn-pill">⌘ shifting pads</span>' : ''}</div>
        ${selectedStars ? `<div class="sn-stars" style="font-size:18px;text-align:left;margin:12px 0 0">${'★'.repeat(selectedStars)}<span style="opacity:.18">${'★'.repeat(5 - selectedStars)}</span></div>` : ''}
        <div class="sn-path">${Array.from({length:10},(_,i)=>{const n=pathStart+i;return `<i class="${n < profile.currentSession ? 'done' : n === profile.currentSession ? 'current' : ''}"></i>`;}).join('')}</div>
        <button class="sn-play" data-action="play">Begin session ${profile.currentSession}</button>
      </section>
      <div class="sn-menu-side">
        <div class="sn-menu-grid">
          <div class="sn-menu-card"><div class="sn-menu-card-head"><span>Training mode</span><b>${mode.icon}</b></div><strong>${mode.name}</strong><p>${mode.desc}</p><button class="sn-secondary" data-action="hub">Modes & perks</button></div>
          <div class="sn-menu-card"><div class="sn-menu-card-head"><span>Active perk</span><b>${perk.icon}</b></div><strong>${perk.name}</strong><p>${perk.desc}</p><button class="sn-secondary" data-action="hub">Change loadout</button></div>
        </div>
        <div class="sn-menu-card"><div class="sn-menu-card-head"><span>Training navigator</span><b>${profile.bestSession}/${MAX_SESSIONS}</b></div><div class="sn-session-nav"><button data-action="previous" aria-label="Previous session">‹</button><div><small>Selected session</small><b>${profile.currentSession}</b></div><button data-action="next" aria-label="Next session">›</button></div></div>
        <div class="sn-menu-card"><div class="sn-menu-card-head"><span>Brain records</span><b>Personal</b></div><strong>${profile.bestSequence} signals</strong><p>Best score ${profile.bestScore.toLocaleString()} · ${profile.flawlessRuns} flawless clears</p></div>
      </div>
      <div class="sn-daily"><div class="sn-daily-icon">${daily.icon || '✦'}</div><div class="sn-daily-copy"><b>${daily.title || 'Daily challenge'}</b><span>${daily.detail || 'Train today'}</span></div><div class="sn-daily-reward">${daily.claimed ? '✓' : `◆ ${daily.reward || 0}`}</div></div>`;
    root.appendChild(menu);
    menu.querySelector('[data-action="play"]').addEventListener('click', startSession);
    menu.querySelectorAll('[data-action="hub"]').forEach(button => button.addEventListener('click', () => arcade.openHub()));
    menu.querySelector('[data-action="previous"]').addEventListener('click', () => { profile.currentSession = Math.max(1, profile.currentSession - 1); saveProfile(); renderMenu(); });
    menu.querySelector('[data-action="next"]').addEventListener('click', () => { profile.currentSession = Math.min(profile.bestSession, profile.currentSession + 1); saveProfile(); renderMenu(); });
  }

  function padGlyphMarkup(pad) {
    if (pad.id === 'red') return `<span class="sn-pad-glyph" aria-hidden="true"><svg viewBox="0 0 100 100" role="presentation"><path class="soft" d="M50 11 79 66H21z"/><path class="metal" d="M50 22 71 60H29z"/><path class="edge" d="M50 28 64 54H36z"/><path class="outline" d="M50 18 74 62H26z"/></svg></span>`;
    if (pad.id === 'blue') return `<span class="sn-pad-glyph" aria-hidden="true"><svg viewBox="0 0 100 100" role="presentation"><path class="soft" d="M50 14 79 50 50 86 21 50z"/><path class="metal" d="M50 23 69 50 50 77 31 50z"/><path class="edge" d="M50 30 62 50 50 70 38 50z"/><path class="outline" d="M50 18 74 50 50 82 26 50z"/></svg></span>`;
    if (pad.id === 'green') return `<span class="sn-pad-glyph" aria-hidden="true"><svg viewBox="0 0 100 100" role="presentation"><circle class="soft" cx="50" cy="50" r="34"/><circle class="metal" cx="50" cy="50" r="26"/><circle class="edge" cx="50" cy="50" r="12"/><circle class="ring-soft" cx="50" cy="50" r="35"/><circle class="ring" cx="50" cy="50" r="25"/></svg></span>`;
    return `<span class="sn-pad-glyph" aria-hidden="true"><svg viewBox="0 0 100 100" role="presentation"><rect class="soft" x="20" y="20" width="60" height="60" rx="8"/><rect class="metal" x="28" y="28" width="44" height="44" rx="5"/><rect class="edge" x="36" y="36" width="28" height="28" rx="3"/><rect class="outline" x="24" y="24" width="52" height="52" rx="7"/></svg></span>`;
  }

  function renderGame() {
    root.innerHTML = '';
    const game = el('div', 'sn-screen sn-game');
    game.innerHTML = `
      <div class="sn-top">
        <div class="sn-top-row"><button class="sn-icon-btn" data-action="menu" aria-label="Return to menu">‹</button><div class="sn-level-info"><b>Session ${config.session}</b><span>${config.circuit.name}</span></div><div class="sn-stats"><div class="sn-stat"><small>Score</small><b id="sn-score">0</b></div><div class="sn-stat"><small>Round</small><b id="sn-round" style="color:#fbbf24">1</b></div><div class="sn-stat"><small>Chain</small><b id="sn-chain" style="color:#c084fc">0</b></div></div><div class="sn-lives" id="sn-lives"></div><button class="sn-icon-btn" data-action="help" aria-label="How to play">?</button></div>
        <div class="sn-progress"><div class="sn-progress-card"><div class="sn-progress-line"><b>Training path</b><span id="sn-round-progress">0/${config.targetRounds}</span></div><div class="sn-track"><i id="sn-round-fill" style="width:0%"></i></div></div><div class="sn-progress-card"><div class="sn-progress-line"><b>Focus</b><span id="sn-focus-label">0%</span></div><div class="sn-track"><i id="sn-focus-fill" style="width:0%"></i></div></div></div>
      </div>
      <aside class="sn-side"><div class="sn-side-card"><small>Mode</small><b>${activeMode().name}</b><p>${activeMode().desc}</p></div><div class="sn-side-card"><small>Perk</small><b>${activePerk().name}</b><p>${activePerk().desc}</p></div><div class="sn-side-card"><small>Objective</small><b>Round ${config.targetRounds}</b><p>${config.phaseLabel}</p></div></aside>
      <main class="sn-main"><div class="sn-board-wrap"><div class="sn-board" id="sn-board"></div><div class="sn-core"><div class="sn-core-ring" id="sn-core-ring"></div><div class="sn-core-copy"><b id="sn-core-title">Ready</b><span id="sn-core-sub">Watch the pulse</span></div></div><div class="sn-response" id="sn-response"><i id="sn-response-fill" style="width:100%"></i></div></div></main>
      <div class="sn-bottom"><div class="sn-focus"><div class="sn-focus-line"><span>Neural focus</span><b id="sn-focus-bottom">0%</b></div><div class="sn-track"><i id="sn-focus-fill-bottom" style="width:0%"></i></div></div><button class="sn-tool" data-action="encore"><b>↻ Encore</b><span>Replay sequence</span></button><button class="sn-tool" data-action="restart"><b>⟳ Restart</b><span>Start session over</span></button></div>
      <div class="sn-paused">Paused</div>`;
    root.appendChild(game);
    const board = game.querySelector('#sn-board');
    for (const id of currentOrder) board.appendChild(createPad(id));
    game.querySelector('[data-action="menu"]').addEventListener('click', renderMenu);
    game.querySelector('[data-action="help"]').addEventListener('click', showHelp);
    game.querySelector('[data-action="restart"]').addEventListener('click', () => startSession());
    game.querySelector('[data-action="encore"]').addEventListener('click', useEncore);
    updateGameUi();
  }

  function createPad(id) {
    const pad = PADS.find(item => item.id === id);
    const button = el('button', 'sn-pad');
    button.type = 'button';
    button.dataset.pad = id;
    button.style.background = `linear-gradient(145deg,${pad.color},${pad.deep})`;
    button.style.setProperty('--glow', pad.glow);
    button.innerHTML = `<span class="sn-pad-content">${padGlyphMarkup(pad)}<span class="sn-pad-name">${pad.name} · ${pad.key}</span></span>`;
    button.addEventListener('pointerdown', event => { event.preventDefault(); handleInput(id, button); });
    button.addEventListener('click', event => { event.preventDefault(); button.blur(); });
    return button;
  }

  function padElement(id) { return root?.querySelector(`[data-pad="${id}"]`) || null; }
  function setPadsEnabled(enabled) { root?.querySelectorAll('.sn-pad').forEach(button => { button.disabled = !enabled; }); }

  function lightPad(id, duration, wrong = false) {
    const pad = PADS.find(item => item.id === id);
    const button = padElement(id);
    if (!pad || !button) return;
    button.classList.remove('lit', 'wrong');
    void button.offsetWidth;
    button.classList.add(wrong ? 'wrong' : 'lit');
    tone(pad, Math.max(.11, duration / 1000), wrong);
    schedule(() => button.classList.remove('lit', 'wrong'), duration);
  }

  function setCore(title, subtitle) {
    const titleEl = root?.querySelector('#sn-core-title');
    const subEl = root?.querySelector('#sn-core-sub');
    if (titleEl) titleEl.textContent = title;
    if (subEl) subEl.textContent = subtitle;
  }

  function updateGameUi() {
    if (screen !== 'game') return;
    const scoreEl = root.querySelector('#sn-score');
    const roundEl = root.querySelector('#sn-round');
    const chainEl = root.querySelector('#sn-chain');
    if (scoreEl) scoreEl.textContent = score.toLocaleString();
    if (roundEl) roundEl.textContent = Math.min(round, config.targetRounds);
    if (chainEl) chainEl.textContent = bestCombo ? `${combo}×` : combo;
    const livesEl = root.querySelector('#sn-lives');
    if (livesEl) livesEl.innerHTML = Array.from({length:config.lives},(_,i)=>`<i class="sn-life ${i < lives ? 'on' : ''}"></i>`).join('');
    const pct = clamp(((round - 1) / config.targetRounds) * 100, 0, 100);
    const roundProgress = root.querySelector('#sn-round-progress');
    const roundFill = root.querySelector('#sn-round-fill');
    if (roundProgress) roundProgress.textContent = `${Math.max(0, round - 1)}/${config.targetRounds}`;
    if (roundFill) roundFill.style.width = `${pct}%`;
    for (const selector of ['#sn-focus-label','#sn-focus-bottom']) { const node = root.querySelector(selector); if (node) node.textContent = `${Math.round(focus)}%`; }
    for (const selector of ['#sn-focus-fill','#sn-focus-fill-bottom']) { const node = root.querySelector(selector); if (node) node.style.width = `${focus}%`; }
    const ring = root.querySelector('#sn-core-ring');
    if (ring) ring.style.setProperty('--progress', `${sequence.length ? inputIndex / sequence.length * 100 : 0}%`);
    const encore = root.querySelector('[data-action="encore"]');
    if (encore) {
      const available = activePerk().id === 'encore' && !replayUsed && (state === 'input' || state === 'playback');
      encore.disabled = !available;
      encore.querySelector('span').textContent = activePerk().id !== 'encore' ? 'Select Encore perk' : replayUsed ? 'Already used' : 'Replay sequence';
    }
  }

  function startSession() {
    resetStateTimers();
    screen = 'game';
    config = sessionConfig(profile.currentSession);
    sequence = [nextSignal()];
    inputIndex = 0;
    round = 1;
    score = 0;
    lives = config.lives;
    state = 'idle';
    combo = 0;
    bestCombo = 0;
    mistakes = 0;
    completedInputs = 0;
    responseTotal = 0;
    responseCount = 0;
    lastInputAt = 0;
    roundMistakes = 0;
    replayUsed = false;
    shieldUsed = false;
    aidsUsed = 0;
    focus = 0;
    currentOrder = PADS.map(item => item.id);
    sessionStartedAt = Date.now();
    renderGame();
    arcade.record('start', 1);
    setCore(`Session ${config.session}`, 'Prepare');
    schedule(playCurrentSequence, 650);
  }

  function maybeShiftPads() {
    if (!config.shiftPads || round <= 1 || (round - 1) % config.shiftEvery !== 0) return;
    let next = shuffled(currentOrder);
    while (next.every((id, index) => id === currentOrder[index])) next = shuffled(currentOrder);
    currentOrder = next;
    const board = root.querySelector('#sn-board');
    board.innerHTML = '';
    for (const id of currentOrder) board.appendChild(createPad(id));
    board.style.animation = 'none';
    void board.offsetWidth;
    board.style.animation = '';
    arcade.showToast('⌘', 'Phase shift', 'The colors changed position. Follow the signal, not the location.');
  }

  function playCurrentSequence() {
    resetStateTimers();
    state = 'playback';
    setPadsEnabled(false);
    stopResponseTimer();
    maybeShiftPads();
    setCore('Watch', `${sequence.length} signal${sequence.length === 1 ? '' : 's'}`);
    updateGameUi();
    const interval = playbackInterval();
    const flash = Math.max(145, Math.round(config.flashDuration * (activePerk().id === 'calm' ? 1.1 : 1)));
    let index = 0;
    const step = () => {
      if (state !== 'playback') return;
      if (index >= sequence.length) {
        schedule(beginInput, Math.max(180, interval * .42));
        return;
      }
      lightPad(sequence[index], flash);
      index++;
      schedule(step, interval);
    };
    schedule(step, 250);
  }

  function beginInput() {
    state = 'input';
    inputIndex = 0;
    lastInputAt = performance.now();
    setPadsEnabled(true);
    setCore(activeMode().id === 'reverse' ? 'Reverse' : 'Your turn', `${expectedSequence().length} inputs`);
    startResponseTimer();
    updateGameUi();
  }

  function startResponseTimer() {
    stopResponseTimer();
    if (activeMode().id !== 'pulse') return;
    responseMax = config.responseWindow;
    responseRemaining = responseMax;
    lastInputElapsed = 0;
    const response = root.querySelector('#sn-response');
    response?.classList.add('active');
    responseInterval = setInterval(() => {
      if (state !== 'input') return;
      responseRemaining -= 50;
      lastInputElapsed += 50;
      updateResponseUi();
      if (responseRemaining <= 0) handleMistake(null, true);
    }, 50);
  }

  function resetResponseWindow() {
    if (activeMode().id !== 'pulse') return;
    responseRemaining = Math.max(1150, config.responseWindow - inputIndex * 60);
    responseMax = responseRemaining;
    lastInputElapsed = 0;
    updateResponseUi();
  }

  function updateResponseUi() {
    const response = root?.querySelector('#sn-response');
    const fill = root?.querySelector('#sn-response-fill');
    if (!response || !fill) return;
    const active = activeMode().id === 'pulse' && state === 'input';
    response.classList.toggle('active', active);
    fill.style.width = active && responseMax ? `${clamp(responseRemaining / responseMax * 100, 0, 100)}%` : '100%';
  }

  function handleInput(id, button) {
    if (state !== 'input') return;
    button?.blur();
    const expected = expectedSequence()[inputIndex];
    if (id !== expected) {
      handleMistake(id, false);
      return;
    }
    const pad = PADS.find(item => item.id === id);
    const now = performance.now();
    if (lastInputAt > 0) {
      responseTotal += Math.max(0, now - lastInputAt);
      responseCount++;
    }
    lastInputAt = now;
    lightPad(id, 230);
    completedInputs++;
    combo++;
    bestCombo = Math.max(bestCombo, combo);
    const speedBonus = activeMode().id === 'pulse' && responseMax ? Math.round(80 * clamp(responseRemaining / responseMax, 0, 1)) : 35;
    const modeBonus = activeMode().id === 'reverse' ? 45 : activeMode().id === 'pulse' ? 55 : 20;
    const calmScale = activePerk().id === 'calm' ? .88 : 1;
    score += Math.round((90 + round * 8 + combo * 6 + speedBonus + modeBonus) * calmScale);
    focus = clamp(focus + 3 + Math.min(combo, 8) * .35, 0, 100);
    inputIndex++;
    arcade.record('step', 1);
    resetResponseWindow();
    updateGameUi();
    if (inputIndex >= sequence.length) completeRound();
  }

  function handleMistake(id, timeout) {
    if (state !== 'input') return;
    stopResponseTimer();
    state = 'feedback';
    setPadsEnabled(false);
    mistakes++;
    roundMistakes++;
    combo = 0;
    focus = clamp(focus - 18, 0, 100);
    if (id) lightPad(id, 300, true);
    else tone(PADS[0], .25, true);

    if (activePerk().id === 'shield' && !shieldUsed) {
      shieldUsed = true;
      aidsUsed++;
      setCore('Shielded', 'Signal restored');
      arcade.showToast('◉', 'Focus Shield', 'The mistake was forgiven.');
      schedule(playCurrentSequence, 650);
      updateGameUi();
      return;
    }

    lives--;
    setCore(timeout ? 'Too slow' : 'Signal lost', `${lives} ${lives === 1 ? 'life' : 'lives'} left`);
    updateGameUi();
    if (lives <= 0) {
      schedule(failSession, 650);
      return;
    }
    schedule(playCurrentSequence, 850);
  }

  function completeRound() {
    stopResponseTimer();
    state = 'feedback';
    setPadsEnabled(false);
    round++;
    profile.totalRounds++;
    profile.totalInputs += sequence.length;
    profile.bestSequence = Math.max(profile.bestSequence, sequence.length);
    arcade.record('round', 1);
    if (roundMistakes === 0) arcade.record('perfect', 1);
    const perfectRound = roundMistakes === 0 && combo >= sequence.length;
    if (perfectRound) {
      focus = clamp(focus + 8, 0, 100);
      showFlow(`Perfect +${Math.round(sequence.length * 20)}`);
      score += sequence.length * 20;
    }
    setCore('Correct', `${sequence.length} signals held`);
    updateGameUi();

    if (round > config.targetRounds) {
      schedule(completeSession, 700);
      return;
    }
    roundMistakes = 0;
    sequence.push(nextSignal());
    schedule(playCurrentSequence, 750);
  }

  function showFlow(text) {
    const main = root.querySelector('.sn-main');
    const pop = el('div', 'sn-flow-pop');
    pop.textContent = text;
    main.appendChild(pop);
    schedule(() => pop.remove(), 850);
  }

  function useEncore() {
    if (activePerk().id !== 'encore' || replayUsed || (state !== 'input' && state !== 'playback')) return;
    replayUsed = true;
    aidsUsed++;
    arcade.showToast('↻', 'Encore used', 'The current sequence will play again.');
    playCurrentSequence();
  }

  function rating() {
    const completion = 20;
    const totalAttempts = Math.max(1, completedInputs + mistakes);
    const accuracyRatio = completedInputs / totalAttempts;
    const accuracy = Math.round(accuracyRatio * 30);
    const avgResponse = responseCount ? responseTotal / responseCount : config.parResponse * (activeMode().id === 'pulse' ? 1.15 : .95);
    const speedRatio = clamp(1 - (avgResponse - config.parResponse * .7) / (config.parResponse * 1.2), 0, 1);
    const speed = Math.round(speedRatio * 25);
    const consistency = Math.round(clamp(bestCombo / Math.max(1, completedInputs), 0, 1) * 15);
    const independence = aidsUsed === 0 && !shieldUsed ? 10 : aidsUsed <= 1 ? 5 : 0;
    const total = completion + accuracy + speed + consistency + independence;
    let stars = total >= 92 ? 5 : total >= 78 ? 4 : total >= 60 ? 3 : total >= 43 ? 2 : 1;
    if (stars === 5 && !(mistakes === 0 && aidsUsed === 0 && avgResponse <= config.parResponse * .9 && bestCombo >= completedInputs * .72)) stars = 4;
    return { total, stars, accuracy, speed, consistency, independence, avgResponse: Math.round(avgResponse) };
  }

  function completeSession() {
    resetStateTimers();
    state = 'complete';
    const result = rating();
    const previous = Number(profile.sessionStars[config.session]) || 0;
    if (result.stars > previous) profile.sessionStars[config.session] = result.stars;
    profile.bestSession = Math.max(profile.bestSession, Math.min(MAX_SESSIONS, config.session + 1));
    profile.bestScore = Math.max(profile.bestScore, score);
    profile.totalTrainingMs += Date.now() - sessionStartedAt;
    if (mistakes === 0 && aidsUsed === 0) profile.flawlessRuns++;
    saveProfile();
    arcade.record('win', 1, config.session === 20 ? { achievement: 'simon_neural_20', title: 'Pattern Architect', detail: 'Cleared 20 Neural Pulse sessions.', coins: 90 } : {});
    showResult(true, result);
  }

  function failSession() {
    resetStateTimers();
    state = 'failed';
    profile.bestSequence = Math.max(profile.bestSequence, sequence.length);
    profile.bestScore = Math.max(profile.bestScore, score);
    profile.totalTrainingMs += Date.now() - sessionStartedAt;
    saveProfile();
    arcade.record('fail', 1);
    arcade.record('score', score);
    showResult(false, null);
  }

  function showResult(completed, result) {
    const overlay = el('div', 'sn-overlay');
    const stars = completed ? `${'★'.repeat(result.stars)}<span style="opacity:.18">${'★'.repeat(5 - result.stars)}</span>` : '◇';
    overlay.innerHTML = `<div class="sn-modal"><div class="sn-modal-icon">${completed ? '🧠' : '◌'}</div><h2>${completed ? 'Circuit stabilized' : 'Signal interrupted'}</h2><p>${completed ? `${config.circuit.name} complete. Higher ratings require clean recall, fast responses, and no assistance.` : `You reached round ${Math.max(1, round - 1)}. Your records and daily progress are saved.`}</p><div class="sn-stars">${stars}</div>${completed ? `<div class="sn-breakdown"><div><small>Accuracy</small><b>${result.accuracy}/30</b></div><div><small>Speed</small><b>${result.speed}/25</b></div><div><small>Consistency</small><b>${result.consistency}/15</b></div></div>` : ''}<div class="sn-breakdown"><div><small>Score</small><b>${score.toLocaleString()}</b></div><div><small>Best chain</small><b style="color:#c084fc">${bestCombo}</b></div><div><small>Mistakes</small><b style="color:#fbbf24">${mistakes}</b></div></div><div class="sn-actions"><button data-action="menu">Menu</button><button class="primary" data-action="again">${completed && config.session < MAX_SESSIONS ? 'Next session' : 'Train again'}</button></div></div>`;
    root.appendChild(overlay);
    overlay.querySelector('[data-action="menu"]').addEventListener('click', renderMenu);
    overlay.querySelector('[data-action="again"]').addEventListener('click', () => {
      if (completed && config.session < MAX_SESSIONS) profile.currentSession = Math.min(profile.bestSession, config.session + 1);
      saveProfile();
      startSession();
    });
  }

  function showHelp() {
    const wasRunning = screen === 'game' && (state === 'playback' || state === 'input' || state === 'feedback');
    if (wasRunning) {
      resetStateTimers();
      state = 'help';
      setPadsEnabled(false);
    }
    const overlay = el('div', 'sn-overlay');
    overlay.innerHTML = `<div class="sn-modal"><div class="sn-modal-icon">?</div><h2>How to train</h2><div class="sn-help-copy"><h3>Classic Simon</h3><p>Watch the four pads and repeat the growing sequence. Distinct emblems and tones reinforce the colors.</p><h3>Training modes</h3><ul><li><b>Classic Flow:</b> repeat in order.</li><li><b>Reverse Recall:</b> enter the pattern backward.</li><li><b>Focus Pulse:</b> respond before the timer empties.</li></ul><h3>Advanced circuits</h3><p>Later sessions move the pads between rounds. The signal color and emblem remain the same, so remember the pattern rather than the location.</p><h3>Five stars</h3><p>Legendary ratings require a flawless, unassisted run with fast reactions and a strong uninterrupted chain.</p></div><div class="sn-actions"><button class="primary" data-action="close">Got it</button></div></div>`;
    root.appendChild(overlay);
    overlay.querySelector('[data-action="close"]').addEventListener('click', () => {
      overlay.remove();
      if (wasRunning) schedule(playCurrentSequence, 250);
    });
  }

  function onKeyDown(event) {
    if (screen !== 'game' || state !== 'input' || event.ctrlKey || event.altKey || event.metaKey) return;
    const map = { '1':'red','2':'blue','3':'green','4':'gold', q:'red', w:'blue', a:'green', s:'gold', ArrowUp:'red', ArrowRight:'blue', ArrowLeft:'green', ArrowDown:'gold' };
    const id = map[event.key] || map[event.key.toLowerCase?.()];
    if (!id) return;
    event.preventDefault();
    handleInput(id, padElement(id));
  }

  return {
    mount(container) {
      container.innerHTML = '';
      root = el('div', 'sn-root');
      container.appendChild(root);
      arcade.mount(root, container);
      layoutObserver = new ResizeObserver(scheduleResponsiveLayout);
      layoutObserver.observe(root);
      document.addEventListener('fullscreenchange', scheduleResponsiveLayout);
      window.addEventListener('resize', scheduleResponsiveLayout);
      scheduleResponsiveLayout();
      root.innerHTML = '<div class="sn-screen" style="display:grid;place-items:center"><div style="text-align:center"><div class="sn-logo-mark" style="margin:auto"><i></i><i></i><i></i><i></i></div><p style="font-size:10px;letter-spacing:2px;color:#94a3b8;font-weight:900">CALIBRATING NEURAL PULSE</p></div></div><div class="sn-paused">Paused</div>';
      window.addEventListener('keydown', onKeyDown);
      pausedClassRemove = host.runtime.lifecycle.onPause(() => root?.classList.add('is-paused'));
      resumedClassRemove = host.runtime.lifecycle.onResume(() => root?.classList.remove('is-paused'));
      arcadeChangeRemove = arcade.onChange(() => { if (screen === 'menu') renderMenu(); else arcade.showToast('✦', 'Loadout saved', 'The new mode or perk applies to the next session.'); });
      Promise.all([arcade.ready, loadProfile()]).then(renderMenu);
    },
    unmount() {
      resetStateTimers();
      window.removeEventListener('keydown', onKeyDown);
      arcadeChangeRemove?.();
      pausedClassRemove?.();
      resumedClassRemove?.();
      if (audio) { audio.close().catch(() => {}); audio = null; }
      layoutObserver?.disconnect();
      layoutObserver = null;
      if (layoutFrame) window.cancelAnimationFrame(layoutFrame);
      layoutFrame = 0;
      document.removeEventListener('fullscreenchange', scheduleResponsiveLayout);
      window.removeEventListener('resize', scheduleResponsiveLayout);
      arcade.cleanup();
    }
  };
}
