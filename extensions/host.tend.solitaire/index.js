import { createArcade, setTimeout, clearTimeout, setInterval, clearInterval, requestAnimationFrame, cancelAnimationFrame } from './arcade-kit.js';

const STYLE_ID = 'tend-solitaire-starlight-v3';
const SUITS = ['hearts', 'diamonds', 'clubs', 'spades'];
const SYMBOL = ['♥', '♦', '♣', '♠'];
const RANKS = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
const RED = new Set([0,1]);
const MODE_UNLOCK = { classic:1, journey:1, rush:4 };
const PERK_UNLOCK = { rewind:1, oracle:3, spark:5 };
const WORLDS = [
  { name:'Dawn Atrium', accent:'#22d3ee', accent2:'#8b5cf6' },
  { name:'Moon Gallery', accent:'#a78bfa', accent2:'#38bdf8' },
  { name:'Solar Archive', accent:'#fbbf24', accent2:'#fb7185' },
  { name:'Velvet Orbit', accent:'#f472b6', accent2:'#818cf8' },
  { name:'Aurora Crown', accent:'#34d399', accent2:'#22d3ee' },
  { name:'Starlight Vault', accent:'#f97316', accent2:'#e879f9' }
];
const clamp = (v,a,b) => Math.max(a,Math.min(b,v));

function ensureStyles(){
  let style = document.getElementById(STYLE_ID);
  if(!style){ style=document.createElement('style'); style.id=STYLE_ID; document.head.appendChild(style); }
  style.textContent = `
@keyframes soFade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes soPop{0%{transform:scale(.7);opacity:0}65%{transform:scale(1.08);opacity:1}100%{transform:scale(1);opacity:1}}
@keyframes soPulse{0%,100%{box-shadow:0 0 0 0 rgba(34,211,238,.18)}50%{box-shadow:0 0 0 10px rgba(34,211,238,0)}}
@keyframes soCardFlip{0%{transform:translateX(-50%) rotateY(90deg)}100%{transform:translateX(-50%) rotateY(0)}}
@keyframes soCardLand{0%{transform:translateX(-50%) translateY(-8px) scale(1.04)}100%{transform:translateX(-50%) translateY(0) scale(1)}}
@keyframes soStar{0%{transform:scale(.5) rotate(-25deg);opacity:0}60%{transform:scale(1.2) rotate(8deg);opacity:1}100%{transform:scale(1) rotate(0);opacity:1}}
@keyframes soShine{0%{transform:translateX(-120%) rotate(18deg)}100%{transform:translateX(240%) rotate(18deg)}}
.so-root{--accent:#22d3ee;--accent2:#8b5cf6;--card-w:58px;--card-h:82px;--card-off:22px;position:relative;width:100%;height:100%;overflow:hidden;color:#f8fafc;font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;background:radial-gradient(circle at 15% -10%,rgba(34,211,238,.18),transparent 34%),radial-gradient(circle at 95% 18%,rgba(139,92,246,.18),transparent 32%),linear-gradient(180deg,#07101f,#071528 58%,#050a15);user-select:none;-webkit-user-select:none;isolation:isolate;touch-action:none}
.so-root,.so-root *,.so-root *::before,.so-root *::after{box-sizing:border-box}
.so-root::before{content:"";position:absolute;inset:0;pointer-events:none;opacity:.28;background-image:radial-gradient(circle,rgba(255,255,255,.8) 0 1px,transparent 1.5px),radial-gradient(circle,rgba(255,255,255,.45) 0 1px,transparent 1.5px);background-size:97px 101px,137px 127px;background-position:12px 21px,53px 76px}
.so-stage{position:absolute;inset:0;z-index:2}.so-screen{position:absolute;inset:0;z-index:2;animation:soFade .25s ease}
.so-menu{overflow:auto;padding:18px 18px 76px;scrollbar-width:thin;scrollbar-color:rgba(148,163,184,.25) transparent}
.so-brand{display:flex;align-items:center;gap:13px}.so-emblem{width:62px;height:62px;border-radius:20px;display:grid;place-items:center;position:relative;overflow:hidden;background:linear-gradient(145deg,var(--accent),var(--accent2));box-shadow:0 18px 44px rgba(34,211,238,.18),inset 0 1px rgba(255,255,255,.45)}.so-emblem::after{content:"";position:absolute;width:24px;height:90px;background:rgba(255,255,255,.22);transform:translateX(-90px) rotate(18deg);animation:soShine 4.4s ease-in-out infinite}.so-emblem-cards{position:relative;width:38px;height:42px}.so-emblem-cards i{position:absolute;width:25px;height:35px;border-radius:6px;background:#fff;border:2px solid rgba(2,6,23,.16);box-shadow:0 5px 12px rgba(0,0,0,.2)}.so-emblem-cards i:nth-child(1){left:1px;top:5px;transform:rotate(-15deg)}.so-emblem-cards i:nth-child(2){right:1px;top:5px;transform:rotate(15deg)}.so-emblem-cards i:nth-child(3){left:7px;top:1px}.so-emblem-cards b{position:absolute;z-index:3;left:15px;top:10px;color:#ef4444;font-size:17px}
.so-brand-copy{flex:1;min-width:0}.so-brand-copy h1{margin:0;font-size:30px;letter-spacing:-1.3px;line-height:1;font-weight:950}.so-brand-copy p{margin:7px 0 0;color:#8da0bd;font-size:10px;letter-spacing:2.1px;text-transform:uppercase;font-weight:900}.so-menu-stats{display:flex;gap:7px}.so-menu-stat{min-width:63px;padding:9px 8px;border-radius:15px;border:1px solid rgba(255,255,255,.08);background:rgba(15,23,42,.62);text-align:center}.so-menu-stat small{display:block;color:#64748b;font-size:7px;letter-spacing:1.2px;text-transform:uppercase;font-weight:900}.so-menu-stat b{display:block;margin-top:3px;font-size:18px}
.so-mode-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:18px}.so-mode-card{min-height:94px;padding:12px;border:1px solid rgba(255,255,255,.08);border-radius:17px;background:rgba(15,23,42,.62);color:#94a3b8;text-align:left;cursor:pointer;transition:transform .16s,border-color .16s,background .16s}.so-mode-card:hover{transform:translateY(-2px);border-color:rgba(255,255,255,.18)}.so-mode-card.selected{border-color:var(--accent);background:linear-gradient(145deg,rgba(34,211,238,.15),rgba(139,92,246,.13));box-shadow:0 0 24px rgba(34,211,238,.09)}.so-mode-card.locked{opacity:.58;cursor:not-allowed}.so-mode-card.locked:hover{transform:none;border-color:rgba(255,255,255,.08)}.so-mode-card.locked .so-mode-check{width:auto;min-width:27px;padding:0 5px;border-radius:999px;color:#fbbf24;font-size:7px;font-style:normal}.so-mode-head{display:flex;align-items:center;justify-content:space-between;gap:7px}.so-mode-icon{font-size:22px}.so-mode-check{width:19px;height:19px;border-radius:50%;display:grid;place-items:center;border:1px solid rgba(255,255,255,.12);font-size:10px;color:transparent}.so-mode-card.selected .so-mode-check{background:var(--accent);color:#04111c;border-color:transparent}.so-mode-card strong{display:block;margin-top:7px;color:#f8fafc;font-size:11px}.so-mode-card span{display:block;margin-top:4px;font-size:8px;line-height:1.38}
.so-hero{position:relative;margin-top:12px;border:1px solid rgba(255,255,255,.09);border-radius:24px;padding:18px;overflow:hidden;background:radial-gradient(circle at 85% 18%,rgba(34,211,238,.18),transparent 34%),linear-gradient(145deg,rgba(23,37,68,.9),rgba(11,18,38,.9));box-shadow:0 24px 65px rgba(0,0,0,.3)}.so-hero::after{content:"";position:absolute;right:-24px;bottom:-35px;width:180px;height:180px;border-radius:50%;border:26px solid rgba(255,255,255,.025)}.so-eyebrow{color:var(--accent);font-size:9px;letter-spacing:1.7px;text-transform:uppercase;font-weight:950}.so-hero h2{margin:7px 0 0;font-size:28px;letter-spacing:-.8px}.so-hero p{max-width:360px;margin:7px 0 0;color:#9aaac1;font-size:11px;line-height:1.5}.so-hero-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}.so-tag{padding:6px 9px;border-radius:999px;border:1px solid rgba(255,255,255,.08);background:rgba(2,6,23,.35);font-size:8px;color:#cbd5e1;font-weight:800}.so-play{position:relative;z-index:2;width:100%;height:54px;margin-top:15px;border:0;border-radius:17px;background:linear-gradient(110deg,var(--accent),var(--accent2));color:#fff;font-size:15px;letter-spacing:1px;text-transform:uppercase;font-weight:950;cursor:pointer;box-shadow:0 15px 36px rgba(34,211,238,.18);transition:transform .16s,filter .16s}.so-play:hover{transform:translateY(-2px);filter:brightness(1.08)}
.so-journey-nav{display:flex;align-items:center;gap:9px;margin-top:12px}.so-nav-btn{width:36px;height:36px;border-radius:12px;border:1px solid rgba(255,255,255,.09);background:rgba(2,6,23,.38);color:#e2e8f0;cursor:pointer;font-size:18px}.so-chapter-copy{flex:1}.so-chapter-copy b{display:block;font-size:11px}.so-chapter-copy span{display:block;margin-top:2px;color:#8ea0b9;font-size:8px}
.so-menu-lower{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:11px}.so-panel{border:1px solid rgba(255,255,255,.08);border-radius:18px;padding:13px;background:rgba(8,14,30,.62)}.so-panel-head{display:flex;align-items:center;justify-content:space-between;gap:8px}.so-panel-head small{color:#64748b;font-size:8px;letter-spacing:1.4px;text-transform:uppercase;font-weight:900}.so-panel-head b{font-size:10px;color:var(--accent)}.so-choice-row{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:9px}.so-choice{min-height:54px;border-radius:12px;border:1px solid rgba(255,255,255,.07);background:rgba(15,23,42,.65);color:#8ea0b9;cursor:pointer;padding:7px;text-align:left}.so-choice strong{display:block;color:#e2e8f0;font-size:9px}.so-choice span{display:block;margin-top:3px;font-size:7px;line-height:1.25}.so-choice.selected{border-color:var(--accent);background:rgba(34,211,238,.1)}.so-choice.locked{opacity:.5;cursor:not-allowed}.so-daily{grid-column:1/-1;display:flex;align-items:center;gap:12px;cursor:pointer;color:inherit;text-align:left;width:100%}.so-daily-icon{width:44px;height:44px;border-radius:14px;display:grid;place-items:center;background:rgba(251,191,36,.12);color:#fbbf24;font-size:21px}.so-daily-copy{flex:1}.so-daily-copy b{display:block;font-size:11px}.so-daily-copy span{display:block;margin-top:3px;color:#8fa0b8;font-size:8px}.so-daily-reward{font-size:11px;color:#fbbf24;font-weight:900}
.so-game{display:flex;flex-direction:column;min-height:0}.so-game-head{position:relative;z-index:30;flex:0 0 auto;padding:10px 12px 8px;border-bottom:1px solid rgba(255,255,255,.07);background:rgba(4,9,22,.74);backdrop-filter:blur(14px)}.so-game-row{display:flex;align-items:center;gap:8px}.so-icon-btn{width:37px;height:37px;border-radius:12px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.045);color:#dbeafe;cursor:pointer;font-size:18px;display:grid;place-items:center}.so-contract{flex:1;min-width:0}.so-contract small{display:block;color:var(--accent);font-size:7px;letter-spacing:1.3px;text-transform:uppercase;font-weight:900}.so-contract b{display:block;margin-top:2px;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.so-contract span{display:block;margin-top:2px;color:#8ea0b8;font-size:8px}.so-game-stats{display:flex;gap:5px}.so-game-stat{min-width:53px;padding:6px 7px;border-radius:11px;border:1px solid rgba(255,255,255,.07);background:rgba(15,23,42,.65);text-align:center}.so-game-stat small{display:block;color:#64748b;font-size:6px;letter-spacing:1px;text-transform:uppercase;font-weight:900}.so-game-stat b{display:block;margin-top:2px;font-size:13px}.so-contract-track{height:6px;margin-top:7px;border-radius:999px;background:rgba(255,255,255,.07);overflow:hidden}.so-contract-track i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,var(--accent),var(--accent2));transition:width .25s}
.so-game-layout{flex:1;min-height:0;display:grid;grid-template-columns:minmax(0,1fr);position:relative}.so-side{display:none}.so-board-zone{min-width:0;min-height:0;display:flex;flex-direction:column;padding:8px 10px 8px}.so-piles{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:var(--pile-gap,5px);align-items:start;flex:0 0 auto}.so-pile{position:relative;width:var(--card-w);height:var(--card-h);justify-self:center;border-radius:10px;border:1.5px dashed rgba(255,255,255,.1);background:rgba(255,255,255,.018)}.so-pile.stock{cursor:pointer}.so-pile.stock:hover{border-color:rgba(255,255,255,.24)}.so-pile.waste{border-color:transparent;background:transparent}.so-pile.foundation{display:grid;place-items:center;color:rgba(255,255,255,.11);font-size:26px}.so-pile.foundation.ready{border-color:rgba(34,211,238,.6);box-shadow:0 0 20px rgba(34,211,238,.18)}.so-stock-count{position:absolute;right:-5px;top:-6px;z-index:15;min-width:19px;height:19px;padding:0 4px;border-radius:10px;display:grid;place-items:center;background:#0f172a;border:1px solid rgba(255,255,255,.15);font-size:7px;color:#cbd5e1;font-weight:900}.so-oracle{position:absolute;left:2px;right:2px;bottom:-14px;text-align:center;color:#67e8f9;font-size:6px;font-weight:900;white-space:nowrap}
.so-tableau{flex:1;min-height:0;display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:var(--pile-gap,5px);margin-top:10px}.so-col{position:relative;min-width:0;border-radius:11px}.so-col::before{content:"K";position:absolute;left:50%;top:0;transform:translateX(-50%);width:var(--card-w);height:var(--card-h);border-radius:10px;border:1.5px dashed rgba(255,255,255,.055);display:grid;place-items:center;color:rgba(255,255,255,.05);font-size:24px}.so-col.target::before,.so-pile.target{border-color:rgba(34,211,238,.72)!important;background:rgba(34,211,238,.08)!important;box-shadow:0 0 20px rgba(34,211,238,.18)}.so-col.bad::before,.so-pile.bad{border-color:rgba(251,113,133,.68)!important;background:rgba(251,113,133,.06)!important}
.so-card{position:absolute;left:50%;width:var(--card-w);height:var(--card-h);transform:translateX(-50%);border-radius:9px;box-shadow:0 3px 10px rgba(0,0,0,.42),0 0 0 1px rgba(255,255,255,.08);transition:box-shadow .16s,filter .16s,opacity .16s;touch-action:none;will-change:transform,opacity,filter}.so-card.face-down{background:linear-gradient(145deg,#263b73,#121d3c);border:1px solid rgba(255,255,255,.13)}.so-card.face-down::before{content:"";position:absolute;inset:4px;border-radius:6px;border:1px solid rgba(255,255,255,.1);background:radial-gradient(circle at center,rgba(34,211,238,.22),transparent 28%),repeating-linear-gradient(45deg,rgba(255,255,255,.035) 0 3px,transparent 3px 7px)}.so-root[data-theme="solar"] .so-card.face-down{background:linear-gradient(145deg,#7c2d12,#431407)}.so-root[data-theme="velvet"] .so-card.face-down{background:linear-gradient(145deg,#701a75,#312e81)}.so-root[data-theme="aurora"] .so-card.face-down{background:linear-gradient(145deg,#065f46,#164e63)}.so-card.face-up{background:linear-gradient(160deg,#fffdf7,#f2f5fb);border:1px solid rgba(15,23,42,.16);cursor:grab}.so-card.face-up:active{cursor:grabbing}.so-card.face-up:hover{z-index:800!important;box-shadow:0 8px 24px rgba(0,0,0,.55),0 0 18px rgba(34,211,238,.2)}.so-card.selected{filter:brightness(1.06);box-shadow:0 0 0 2px var(--accent),0 8px 22px rgba(0,0,0,.5);z-index:850!important}.so-card.drag-source{opacity:.16;filter:saturate(.72) brightness(.78)}.so-card.flip{animation:soCardFlip .25s ease}.so-card.land{animation:soCardLand .22s ease}.so-card-inner{position:absolute;inset:0;padding:5px 6px;display:flex;flex-direction:column}.so-card-corner{font-weight:950;line-height:.9;font-size:calc(var(--card-w) * .23)}.so-card-corner span{display:block}.so-card-pip{flex:1;display:grid;place-items:center;font-size:calc(var(--card-w) * .45)}.so-card.red{color:#dc2626}.so-card.black{color:#111827}.so-star-mark{position:absolute;right:4px;top:4px;width:15px;height:15px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(145deg,#fde68a,#f59e0b);color:#713f12;font-size:9px;box-shadow:0 0 12px rgba(251,191,36,.6);animation:soStar .28s ease}.so-ghost{position:fixed;left:0;top:0;z-index:2500;pointer-events:none;transform-origin:50% 18px;will-change:transform,filter,opacity;filter:drop-shadow(0 18px 22px rgba(0,0,0,.46)) drop-shadow(0 0 16px rgba(34,211,238,.16));opacity:.98}.so-ghost::before{content:"";position:absolute;left:8%;right:8%;top:7px;height:calc(var(--card-h) - 8px);border-radius:12px;background:rgba(255,255,255,.055);filter:blur(10px);transform:translateY(8px);z-index:-1}.so-ghost .so-card{position:relative;left:auto;transform:none!important;margin-top:calc(var(--card-off) * -1 + 4px);box-shadow:0 8px 20px rgba(0,0,0,.44),0 0 0 1px rgba(255,255,255,.12)}.so-ghost .so-card:first-child{margin-top:0}.so-root.so-is-dragging,.so-root.so-is-dragging *{cursor:grabbing!important}.so-drop-pulse{animation:soCardLand .22s cubic-bezier(.2,.8,.2,1)}@media (prefers-reduced-motion:reduce){.so-ghost{filter:drop-shadow(0 10px 16px rgba(0,0,0,.4))}.so-card,.so-ghost{transition-duration:.01ms!important}}
.so-bottom{position:relative;z-index:25;flex:0 0 auto;padding:8px 10px 10px;border-top:1px solid rgba(255,255,255,.06);background:rgba(4,9,22,.78);backdrop-filter:blur(14px);display:grid;grid-template-columns:1fr repeat(3,68px) 96px;gap:7px}.so-momentum{border:1px solid rgba(34,211,238,.17);border-radius:13px;padding:8px 10px;background:rgba(8,47,73,.28)}.so-meter-line{display:flex;justify-content:space-between;gap:8px;color:#67e8f9;font-size:7px;letter-spacing:1px;text-transform:uppercase;font-weight:900}.so-meter{height:7px;margin-top:6px;border-radius:999px;background:rgba(255,255,255,.07);overflow:hidden}.so-meter i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#22d3ee,#8b5cf6,#f59e0b);transition:width .22s}.so-power{border-radius:13px;border:1px solid rgba(255,255,255,.08);background:rgba(15,23,42,.68);color:#cbd5e1;cursor:pointer;padding:6px;text-align:center}.so-power b{display:block;font-size:11px}.so-power span{display:block;margin-top:2px;color:#71819b;font-size:6px}.so-power:disabled{opacity:.36;cursor:not-allowed}.so-power.ready{border-color:rgba(34,211,238,.45);color:#fff}.so-charge{color:#fbbf24!important}
.so-toast{position:absolute;left:50%;bottom:72px;z-index:2000;transform:translate(-50%,16px);opacity:0;padding:9px 14px;border-radius:13px;border:1px solid rgba(255,255,255,.12);background:rgba(4,9,24,.9);backdrop-filter:blur(14px);box-shadow:0 16px 40px rgba(0,0,0,.45);font-size:9px;font-weight:850;white-space:nowrap;pointer-events:none;transition:opacity .2s,transform .22s}.so-toast.show{opacity:1;transform:translate(-50%,0)}.so-float{position:absolute;z-index:1400;pointer-events:none;color:#fde68a;font-size:18px;font-weight:950;text-shadow:0 0 16px rgba(251,191,36,.6);animation:soFade .75s ease reverse forwards}
.so-overlay{position:absolute;inset:0;z-index:1800;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(2,6,23,.78);backdrop-filter:blur(14px)}.so-modal{width:min(390px,100%);max-height:calc(100% - 12px);overflow:auto;padding:20px;border-radius:23px;border:1px solid rgba(255,255,255,.12);background:linear-gradient(160deg,rgba(23,33,61,.98),rgba(8,13,29,.98));box-shadow:0 30px 90px rgba(0,0,0,.65);text-align:center}.so-modal-icon{width:64px;height:64px;margin:0 auto;border-radius:20px;display:grid;place-items:center;background:linear-gradient(145deg,var(--accent),var(--accent2));font-size:28px;box-shadow:0 18px 44px rgba(34,211,238,.17);animation:soPop .35s ease}.so-modal h2{margin:12px 0 0;font-size:25px}.so-modal p{margin:6px 0 0;color:#98a8bf;font-size:10px;line-height:1.5}.so-result-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:14px}.so-result{padding:10px 7px;border-radius:13px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.035)}.so-result small{display:block;color:#71819b;font-size:7px;text-transform:uppercase;letter-spacing:1px;font-weight:900}.so-result b{display:block;margin-top:4px;font-size:17px}.so-stars{margin-top:12px;color:#fbbf24;font-size:27px;letter-spacing:4px}.so-modal-actions{display:flex;gap:8px;margin-top:15px}.so-modal-actions button{flex:1;height:42px;border-radius:13px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.055);color:#dbeafe;font-weight:900;cursor:pointer}.so-modal-actions .primary{border:0;background:linear-gradient(110deg,var(--accent),var(--accent2));color:#fff}.so-help-copy{text-align:left;margin-top:12px;color:#b7c2d3;font-size:9px;line-height:1.55}.so-help-copy h3{margin:11px 0 3px;color:#fff;font-size:10px}.so-help-copy p{margin:0}
.so-wide .so-game-layout{grid-template-columns:210px minmax(560px,760px) 210px;justify-content:center;gap:12px;padding:10px 12px}.so-wide .so-side{display:flex;flex-direction:column;gap:9px}.so-wide .so-side-card{padding:13px;border-radius:17px;border:1px solid rgba(255,255,255,.08);background:rgba(8,14,30,.64)}.so-wide .so-side-card small{color:#64748b;font-size:7px;text-transform:uppercase;letter-spacing:1.3px;font-weight:900}.so-wide .so-side-card b{display:block;margin-top:5px;font-size:13px}.so-wide .so-side-card p{margin:5px 0 0;color:#8ea0b8;font-size:8px;line-height:1.45}.so-wide .so-board-zone{padding:0}.so-wide .so-bottom{grid-template-columns:1fr repeat(3,84px) 44px;padding-left:max(10px,calc((100% - 760px)/2));padding-right:max(10px,calc((100% - 760px)/2))}.so-wide .so-game-head{padding-left:max(12px,calc((100% - 1180px)/2));padding-right:max(12px,calc((100% - 1180px)/2))}
.so-mobile .so-menu{padding:12px 10px 78px}.so-mobile .so-brand-copy h1{font-size:23px}.so-mobile .so-emblem{width:50px;height:50px;border-radius:16px}.so-mobile .so-menu-stats{display:none}.so-mobile .so-mode-grid{grid-template-columns:1fr;gap:6px}.so-mobile .so-mode-card{min-height:61px;padding:9px}.so-mobile .so-mode-card span{max-width:260px}.so-mobile .so-hero{padding:14px}.so-mobile .so-hero h2{font-size:23px}.so-mobile .so-menu-lower{grid-template-columns:1fr}.so-mobile .so-choice-row{grid-template-columns:1fr 1fr 1fr}.so-mobile .so-game-head{padding:7px}.so-mobile .so-contract span{display:none}.so-mobile .so-game-stat{min-width:42px;padding:5px}.so-mobile .so-game-stat:nth-child(3){display:none}.so-mobile .so-board-zone{padding:6px 4px}.so-mobile .so-bottom{grid-template-columns:1fr repeat(3,50px) 92px;padding:7px 5px}.so-mobile .so-power{padding:4px}.so-mobile .so-power span{display:none}.so-mobile .so-result-grid{grid-template-columns:repeat(2,1fr)}
`;
}

function el(tag, cls, html){ const node=document.createElement(tag); if(cls)node.className=cls; if(html!==undefined)node.innerHTML=html; return node; }
function hashString(text){ let h=2166136261>>>0; for(let i=0;i<text.length;i++){ h^=text.charCodeAt(i); h=Math.imul(h,16777619); } return h>>>0; }
function rngFrom(seed){ let a=seed>>>0; return function(){ a+=0x6D2B79F5; let t=a; t=Math.imul(t^t>>>15,t|1); t^=t+Math.imul(t^t>>>7,t|61); return ((t^t>>>14)>>>0)/4294967296; }; }
function shuffleWith(deck, random){ const out=deck.slice(); for(let i=out.length-1;i>0;i--){ const j=Math.floor(random()*(i+1)); [out[i],out[j]]=[out[j],out[i]]; } return out; }
function createDeck(){ const deck=[]; let uid=1; for(let s=0;s<4;s++)for(let r=1;r<=13;r++)deck.push({uid:uid++,suit:s,rank:r,faceUp:false,star:false,starClaimed:false}); return deck; }
function cloneCards(arr){ return arr.map(c=>({...c})); }
function cloneState(state){ return {...state,stock:cloneCards(state.stock),waste:cloneCards(state.waste),foundations:state.foundations.map(cloneCards),tableau:state.tableau.map(cloneCards),challenge:{...state.challenge}}; }
function colorOf(card){ return RED.has(card.suit)?'red':'black'; }
function rankText(rank){ return RANKS[rank-1]; }
function foundationCount(state){ return state.foundations.reduce((n,p)=>n+p.length,0); }
function emptyColumns(state){ return state.tableau.reduce((n,p)=>n+(p.length===0?1:0),0); }
function canFoundation(state, card, index){ if(index!==card.suit)return false; const pile=state.foundations[index]; return pile.length===0?card.rank===1:pile[pile.length-1].rank+1===card.rank; }
function canTableau(column, card){ if(column.length===0)return card.rank===13; const top=column[column.length-1]; return top.faceUp&&colorOf(top)!==colorOf(card)&&top.rank===card.rank+1; }
function movableRun(column,index){ if(index<0||index>=column.length||!column[index].faceUp)return false; for(let i=index;i<column.length-1;i++){ const a=column[i],b=column[i+1]; if(!b.faceUp||colorOf(a)===colorOf(b)||a.rank!==b.rank+1)return false; } return true; }
function dateKey(){ return new Date().toISOString().slice(0,10); }
function formatTime(total){ const value=Math.max(0,Math.floor(total)); const m=Math.floor(value/60),s=value%60; return `${m}:${s<10?'0':''}${s}`; }

function journeyConfig(level){
  const world=WORLDS[Math.floor((level-1)/6)%WORLDS.length];
  const step=(level-1)%6;
  const tier=Math.floor((level-1)/6);
  const types=['flip','foundation','clear','combo','stars','win'];
  const type=types[step];
  let target=0,title='',detail='';
  if(type==='flip'){target=8+tier*2;title='Deep Reveal';detail=`Expose ${target} hidden tableau cards`;}
  if(type==='foundation'){target=14+tier*4;title='Foundation Run';detail=`Place ${target} cards into foundations`;}
  if(type==='clear'){target=Math.min(4,1+Math.floor(tier/2));title='Open the Table';detail=`Clear ${target} tableau column${target===1?'':'s'}`;}
  if(type==='combo'){target=5+tier;title='Constellation Chain';detail=`Reach a strategic chain of ${target}`;}
  if(type==='stars'){target=2+(tier>2?1:0);title='Star Recovery';detail=`Reveal ${target} hidden star cards`;}
  if(type==='win'){target=1;title='Crown Deal';detail='Clear the complete Klondike deal';}
  return {level,world,type,target,title,detail,reward:55+level*4,movePar:78+tier*10};
}
function rotatingClassicChallenge(seed){
  const list=[
    {type:'foundation',target:24,title:'Foundation Climb',detail:'Build 24 cards into the foundations'},
    {type:'flip',target:12,title:'Hidden Depths',detail:'Expose 12 face-down tableau cards'},
    {type:'clear',target:2,title:'Open Sky',detail:'Clear two tableau columns'},
    {type:'combo',target:7,title:'Perfect Rhythm',detail:'Build a seven-move strategic chain'},
    {type:'stars',target:3,title:'Starlight Hunt',detail:'Recover all three star cards'},
    {type:'score',target:1200,title:'Score Current',detail:'Reach 1,200 points in one deal'}
  ];
  return {...list[seed%list.length],reward:75};
}
function dailyChallenge(){
  const seed=hashString(dateKey()+'-solitaire-crown');
  const base=rotatingClassicChallenge(seed);
  const scale=base.type==='score'?1.4:base.type==='foundation'?1.25:base.type==='combo'?1.15:1;
  return {...base,target:Math.ceil(base.target*scale),title:'Daily Crown: '+base.title,reward:140,seed};
}

export default function activate(host){
  ensureStyles();
  const arcade=createArcade(host,{
    id:'solitaire-starlight',name:'Solitaire Odyssey: Starlight Circuit',icon:'♠',subtitle:'Modern Klondike, short missions, daily crowns, and momentum powers',
    modes:[
      {id:'classic',name:'Classic Flow',icon:'♠',desc:'Full traditional deal with modern rewards',unlock:1},
      {id:'journey',name:'Odyssey Chapters',icon:'✦',desc:'Short designed objectives across 36 chapters',unlock:1},
      {id:'rush',name:'Pulse Rush',icon:'⏱',desc:'Timed score attack with consecutive deals',unlock:4}
    ],
    perks:[
      {id:'rewind',name:'Deep Rewind',icon:'↶',desc:'Three score-free undos and deeper history',unlock:1},
      {id:'oracle',name:'Oracle Lens',icon:'◉',desc:'Preview the next three stock cards and receive free hints',unlock:3},
      {id:'spark',name:'Star Current',icon:'✦',desc:'Begin with Momentum and gain stronger star rewards',unlock:5}
    ],
    missions:[
      {event:'foundation',target:45,title:'Foundation Architect',detail:'Place 45 cards into foundations',icon:'A',reward:100},
      {event:'flip',target:22,title:'Deep Reader',detail:'Expose 22 hidden cards',icon:'◫',reward:90},
      {event:'challenge',target:2,title:'Contract Closer',detail:'Complete two Odyssey objectives',icon:'✓',reward:130},
      {event:'win',target:1,title:'Crown Sweep',detail:'Clear a complete deal',icon:'♛',reward:150}
    ]
  });

  let root=null,container=null,stage=null,screen='menu',state=null,profile=null,undoStack=[],selected=null,drag=null,dragFrame=0;
  let timerId=null,toastId=null,resizeObserver=null,removePause=null,removeResume=null,audio=null,runMode='classic',runFinished=false,suppressClickUntil=0,challengeRewardClaimed=false;
  const defaultProfile={journeyLevel:1,journeyUnlocked:1,journeyStars:{},bestScore:0,bestTime:0,wins:0,games:0,bestCombo:0,classicChallenges:0,classicChallengeStreak:0,bestChallengeStreak:0,selectedDraw:1,selectedTheme:'midnight',themes:['midnight'],dailyDate:'',dailyDone:false};

  function storageGet(){ return host.storage.get('solitaire_odyssey_starlight_v3').then(v=>({...defaultProfile,...(v&&typeof v==='object'?v:{})})).catch(()=>({...defaultProfile})); }
  function saveProfile(){ if(profile)host.storage.set('solitaire_odyssey_starlight_v3',profile).catch(()=>{}); }
  function syncThemes(){if(!profile)return;const total=Object.values(profile.journeyStars||{}).reduce((x,y)=>x+y,0);const unlocked=['midnight'];if(total>=12)unlocked.push('solar');if(total>=30)unlocked.push('velvet');if(total>=60)unlocked.push('aurora');profile.themes=unlocked;if(!unlocked.includes(profile.selectedTheme))profile.selectedTheme='midnight';}
  function cycleTheme(){syncThemes();const list=profile.themes||['midnight'];const index=list.indexOf(profile.selectedTheme);profile.selectedTheme=list[(index+1)%list.length];saveProfile();sound('ui');applyTheme();renderMenu();}
  function themeName(id){return id==='solar'?'Solar Ember':id==='velvet'?'Velvet Orbit':id==='aurora'?'Aurora Crown':'Midnight Grid';}
  function mode(){ return arcade.mode(); }
  function perk(){ return arcade.perk(); }
  function themeWorld(){
    if(profile?.selectedTheme==='solar')return WORLDS[2];
    if(profile?.selectedTheme==='velvet')return WORLDS[3];
    if(profile?.selectedTheme==='aurora')return WORLDS[4];
    return mode().id==='journey'?journeyConfig(profile?.journeyLevel||1).world:WORLDS[0];
  }
  function applyTheme(){ if(!root)return; const world=themeWorld(); root.style.setProperty('--accent',world.accent); root.style.setProperty('--accent2',world.accent2); root.dataset.theme=profile?.selectedTheme||'midnight'; }
  function tone(freq,duration=.08,type='sine',volume=.05,delay=0){
    if(!audio)return; if(audio.state==='suspended')audio.resume().catch(()=>{});
    const t=audio.currentTime+delay,o=audio.createOscillator(),g=audio.createGain(); o.type=type;o.frequency.setValueAtTime(freq,t);g.gain.setValueAtTime(Math.max(.001,volume),t);g.gain.exponentialRampToValueAtTime(.001,t+duration);o.connect(g);g.connect(audio.destination);o.start(t);o.stop(t+duration+.02);
  }
  function initAudio(){ if(audio)return; try{audio=new (window.AudioContext||window.webkitAudioContext)();}catch(e){} }
  function sound(name){ initAudio(); if(!audio)return;
    if(name==='ui'){tone(420,.045,'triangle',.035);}
    if(name==='draw'){tone(190,.045,'triangle',.025);tone(245,.045,'triangle',.018,.035);}
    if(name==='place'){tone(470,.05,'sine',.035);tone(620,.06,'sine',.025,.035);}
    if(name==='flip'){tone(620,.05,'triangle',.035);tone(910,.09,'sine',.025,.04);}
    if(name==='foundation'){tone(530,.08,'sine',.04);tone(690,.09,'sine',.035,.055);tone(880,.12,'triangle',.025,.11);}
    if(name==='star'){[660,880,1110,1320].forEach((f,i)=>tone(f,.16,'sine',.05,i*.055));}
    if(name==='charge'){tone(340,.08,'sawtooth',.025);tone(680,.16,'sine',.04,.07);}
    if(name==='invalid'){tone(145,.16,'sawtooth',.035);}
    if(name==='undo'){tone(530,.06,'triangle',.025);tone(330,.1,'sine',.03,.05);}
    if(name==='complete'){[392,523,659,784,1047].forEach((f,i)=>tone(f,.2,'sine',.055,i*.09));}
    if(name==='lose'){tone(260,.15,'triangle',.04);tone(190,.22,'sine',.035,.12);}
  }
  function toast(message,color='#fff'){ if(!root)return; const node=root.querySelector('.so-toast'); if(!node)return; clearTimeout(toastId);node.textContent=message;node.style.color=color;node.classList.add('show');toastId=setTimeout(()=>node.classList.remove('show'),1750); }
  function floatScore(text,x,y){ if(!root)return; const node=el('div','so-float',text);node.style.left=x+'px';node.style.top=y+'px';root.appendChild(node);setTimeout(()=>node.remove(),720); }

  function setMode(id){
    const need=MODE_UNLOCK[id]||1;
    if((arcade.profile?.rank||1)<need){sound('invalid');toast(`Reach Rank ${need} to unlock this mode`,'#fbbf24');return;}
    sound('ui');
    if(typeof arcade.selectMode==='function'&&!arcade.selectMode(id))return;
    runMode=id;applyTheme();renderMenu();
  }
  function setPerk(id){
    const need=PERK_UNLOCK[id]||1;
    if((arcade.profile?.rank||1)<need){sound('invalid');toast(`Reach Rank ${need} to unlock this perk`,'#fbbf24');return;}
    sound('ui');
    if(typeof arcade.selectPerk==='function'&&!arcade.selectPerk(id))return;
    renderMenu();
  }
  function currentChallenge(kind){
    if(kind==='journey')return journeyConfig(profile.journeyLevel);
    if(kind==='daily')return dailyChallenge();
    if(kind==='rush')return {type:'score',target:2600,title:'Pulse Target',detail:'Score 2,600 before the circuit closes',reward:110};
    return rotatingClassicChallenge(hashString(dateKey()+':'+profile.games));
  }
  function challengeValue(type){ if(!state)return 0; if(type==='foundation')return foundationCount(state);if(type==='flip')return state.flips;if(type==='clear')return state.maxEmpty;if(type==='combo')return state.bestCombo;if(type==='stars')return state.starsFound;if(type==='score')return state.score;if(type==='win')return state.winsThisRun;return 0; }
  function updateChallenge(event){
    if(!state)return;
    state.challenge.progress=challengeValue(state.challenge.type);
    if(state.challenge.progress>=state.challenge.target&&!state.challengeComplete){
      state.challenge.progress=state.challenge.target;state.challengeComplete=true;
      if(!challengeRewardClaimed){
        challengeRewardClaimed=true;const repeatDaily=runMode==="daily"&&profile.dailyDate===dateKey()&&profile.dailyDone;state.score+=state.challenge.reward*5;state.charges=clamp(state.charges+1,0,3);arcade.record("challenge",1);if(!repeatDaily)arcade.reward(35,state.challenge.reward);sound("complete");toast(repeatDaily?"Daily objective complete · practice run":"Objective complete · +"+state.challenge.reward+" coins","#fde68a");
        if(runMode==="classic"){profile.classicChallenges++;profile.classicChallengeStreak++;profile.bestChallengeStreak=Math.max(profile.bestChallengeStreak,profile.classicChallengeStreak);saveProfile();}
      }
      if(runMode==="journey"||runMode==="daily")setTimeout(()=>finishRun(true,"objective"),650);
    }
    updateGameUi();
  }
  function award(kind,base,anchor){
    if(!state||runFinished)return;
    state.combo=clamp(state.combo+1,0,15);state.bestCombo=Math.max(state.bestCombo,state.combo);profile.bestCombo=Math.max(profile.bestCombo,state.bestCombo);
    const mult=clamp(1+Math.floor(state.combo/3),1,5);const points=Math.round(base*mult);state.score+=points;state.momentum+=kind==='foundation'?16:kind==='flip'?14:kind==='clear'?18:8;
    if(state.momentum>=100){state.momentum-=70;state.charges=clamp(state.charges+1,0,3);sound('charge');toast('Star Charge ready','#67e8f9');}
    if(anchor){const r=root.getBoundingClientRect();floatScore('+'+points+(mult>1?' ×'+mult:''),anchor.x-r.left,anchor.y-r.top);}
    arcade.record('score',points);if(mult>=3)arcade.record('combo',mult);updateChallenge(kind);updateGameUi();
  }
  function softenCombo(){ if(!state)return;state.combo=Math.max(0,state.combo-1);state.momentum=Math.max(0,state.momentum-2);updateGameUi(); }

  function makeDeal(seed,preserve=false){
    const random=rngFrom(seed);let deck=shuffleWith(createDeck(),random);
    const previous=state;
    const draw=runMode==='rush'?1:profile.selectedDraw;
    state={
      stock:[],waste:[],foundations:[[],[],[],[]],tableau:[[],[],[],[],[],[],[]],drawCount:draw,recycleCount:0,maxRecycles:runMode==='journey'&&profile.journeyLevel>24?1:runMode==='rush'?1:99,
      score:preserve&&previous?previous.score:0,moves:preserve&&previous?previous.moves:0,elapsed:preserve&&previous?previous.elapsed:0,timeLeft:preserve&&previous?previous.timeLeft:(runMode==='rush'?300:0),combo:preserve&&previous?previous.combo:0,bestCombo:preserve&&previous?previous.bestCombo:0,momentum:preserve&&previous?previous.momentum:(perk().id==='spark'?38:0),charges:preserve&&previous?previous.charges:0,
      flips:preserve&&previous?previous.flips:0,starsFound:preserve&&previous?previous.starsFound:0,maxEmpty:preserve&&previous?previous.maxEmpty:0,foundationMoves:preserve&&previous?previous.foundationMoves:0,hintsUsed:preserve&&previous?previous.hintsUsed:0,undosUsed:preserve&&previous?previous.undosUsed:0,freeUndos:preserve&&previous?previous.freeUndos:(perk().id==='rewind'?3:0),winsThisRun:preserve&&previous?previous.winsThisRun:0,
      challenge:preserve&&previous?previous.challenge:{...currentChallenge(runMode),progress:0},challengeComplete:preserve&&previous?previous.challengeComplete:false,seed
    };
    for(let col=0;col<7;col++)for(let row=0;row<=col;row++){const card=deck.pop();card.faceUp=row===col;state.tableau[col].push(card);}
    state.stock=deck;
    const starCandidates=[...state.stock,...state.tableau.flat().filter(card=>!card.faceUp)];
    for(let i=0;i<3&&starCandidates.length;i++){
      const index=Math.floor(random()*starCandidates.length);
      starCandidates.splice(index,1)[0].star=true;
    }
    state.maxEmpty=emptyColumns(state);selected=null;undoStack=[];renderGameBoard();updateGameUi();
  }
  function startRun(kind){
    initAudio();sound('ui');runMode=kind||mode().id;runFinished=false;challengeRewardClaimed=false;screen='game';
    const seed=runMode==='daily'?dailyChallenge().seed:runMode==='journey'?hashString('journey:'+profile.journeyLevel+':starlight'):hashString(Date.now()+':'+Math.random());
    renderGame();makeDeal(seed,false);startTimer();profile.games++;saveProfile();arcade.record('start',1);
  }
  function startTimer(){ stopTimer();timerId=setInterval(()=>{ if(!state||runFinished)return;state.elapsed++;if(runMode==='rush'){state.timeLeft--;if(state.timeLeft<=0){state.timeLeft=0;updateGameUi();finishRun(false,'time');return;}}updateGameUi();},1000); }
  function stopTimer(){ if(timerId){clearInterval(timerId);timerId=null;} }

  function claimStar(card,anchor,silent=false){ if(!card?.star||card.starClaimed)return;card.starClaimed=true;state.starsFound++;state.score+=perk().id==='spark'?180:90;state.momentum=clamp(state.momentum+(perk().id==='spark'?48:28),0,120);if(!silent){sound('star');toast('Starlight card recovered','#fde68a');if(anchor){const rr=root.getBoundingClientRect();floatScore('✦ STAR',anchor.x-rr.left,anchor.y-rr.top);}}updateChallenge('stars'); }
  function exposeTop(column,anchor){ if(!column.length)return;const top=column[column.length-1];if(!top.faceUp){top.faceUp=true;state.flips++;sound('flip');claimStar(top,anchor);award('flip',35,anchor);arcade.record('flip',1);} }
  function pushUndo(){ if(!state)return;undoStack.push(cloneState(state));const cap=perk().id==='rewind'?140:45;if(undoStack.length>cap)undoStack.shift(); }
  function undo(){
    if(!state||!undoStack.length){toast('Nothing to rewind','#94a3b8');return;}
    if(state.freeUndos>0)state.freeUndos--;else if(state.charges>0)state.charges--;else state.score=Math.max(0,state.score-35);
    const keepElapsed=state.elapsed,keepTime=state.timeLeft,keepFree=state.freeUndos;state=undoStack.pop();state.elapsed=keepElapsed;state.timeLeft=keepTime;state.freeUndos=keepFree;state.undosUsed++;selected=null;sound('undo');renderGameBoard();updateGameUi();
  }
  function useHint(){
    if(!state)return;const hint=findHint();if(!hint){toast('No obvious move found','#94a3b8');sound('invalid');return;}
    if(perk().id!=='oracle'){if(state.charges<1){toast('Hint needs one Star Charge','#94a3b8');return;}state.charges--;}
    state.hintsUsed++;selected=hint.source;renderGameBoard();highlightTargets(hint.targets);toast(hint.text,'#67e8f9');updateGameUi();
  }
  function useAuto(){
    if(!state)return;if(state.charges<2){toast('Auto Lift needs two Star Charges','#94a3b8');return;}const moves=[];
    for(let c=0;c<7;c++){const col=state.tableau[c];if(col.length&&col[col.length-1].faceUp){const card=col[col.length-1];if(canFoundation(state,card,card.suit))moves.push({type:'tableau',pile:c,index:col.length-1,target:card.suit});}}
    if(state.waste.length){const card=state.waste[state.waste.length-1];if(canFoundation(state,card,card.suit))moves.push({type:'waste',pile:0,index:state.waste.length-1,target:card.suit});}
    if(!moves.length){toast('No safe foundation lift available','#94a3b8');return;}state.charges-=2;const move=moves[0];moveToFoundation(move.type,move.pile,move.target,true);updateGameUi();
  }

  function drawStock(){
    if(!state||runFinished)return;initAudio();if(state.stock.length===0){
      if(!state.waste.length)return;if(state.recycleCount>=state.maxRecycles){toast('No stock recycles remain','#fb7185');sound('invalid');return;}pushUndo();state.stock=state.waste.reverse();state.stock.forEach(c=>c.faceUp=false);state.waste=[];state.recycleCount++;state.moves++;softenCombo();sound('draw');renderGameBoard();updateGameUi();return;
    }
    pushUndo();const count=Math.min(state.drawCount,state.stock.length);for(let i=0;i<count;i++){const card=state.stock.pop();card.faceUp=true;state.waste.push(card);claimStar(card,null);}state.moves++;softenCombo();sound('draw');renderGameBoard();updateGameUi();
  }
  function moveTableau(from,index,to,anchor){
    const source=state.tableau[from],target=state.tableau[to];if(from===to||!movableRun(source,index)||!canTableau(target,source[index]))return false;pushUndo();const wasEmpty=target.length===0;const moving=source.splice(index);target.push(...moving);state.moves++;sound('place');award('tableau',18,anchor);exposeTop(source,anchor);updateEmptyColumns(anchor);renderGameBoard();updateGameUi();return true;
  }
  function moveWasteToTableau(to,anchor){ const target=state.tableau[to];if(!state.waste.length||!canTableau(target,state.waste[state.waste.length-1]))return false;pushUndo();const wasEmpty=target.length===0;target.push(state.waste.pop());state.moves++;sound('place');award('tableau',16,anchor);updateEmptyColumns(anchor);renderGameBoard();updateGameUi();return true; }
  function moveToFoundation(type,pile,target,auto=false,anchor){
    const source=type==='waste'?state.waste:state.tableau[pile];if(!source.length)return false;const card=source[source.length-1];if(!canFoundation(state,card,target))return false;pushUndo();source.pop();state.foundations[target].push(card);state.moves++;state.foundationMoves++;sound('foundation');award('foundation',45,anchor);arcade.record('foundation',1);if(type==='tableau'){exposeTop(source,anchor);updateEmptyColumns(anchor);}renderGameBoard();updateGameUi();checkDealClear();return true;
  }
  function updateEmptyColumns(anchor){ const empty=emptyColumns(state);if(empty>state.maxEmpty){state.maxEmpty=empty;award('clear',80,anchor);}updateChallenge('clear'); }
  function checkDealClear(){
    if(foundationCount(state)!==52)return;state.winsThisRun++;profile.wins++;arcade.record('win',1);profile.bestTime=profile.bestTime===0?state.elapsed:Math.min(profile.bestTime,state.elapsed);saveProfile();
    if(runMode==='rush'&&state.timeLeft>0){state.score+=1200;toast('Deal cleared · next circuit','#fde68a');sound('complete');setTimeout(()=>makeDeal(hashString(Date.now()+':rush:'+state.winsThisRun),true),850);return;}
    state.challenge.progress=state.challenge.target;state.challengeComplete=true;finishRun(true,'win');
  }

  function findHint(){
    if(state.waste.length){const card=state.waste[state.waste.length-1];if(canFoundation(state,card,card.suit))return{source:{type:'waste',pile:0,index:state.waste.length-1},targets:[{type:'foundation',pile:card.suit}],text:`Move ${rankText(card.rank)}${SYMBOL[card.suit]} to its foundation`};for(let t=0;t<7;t++)if(canTableau(state.tableau[t],card))return{source:{type:'waste',pile:0,index:state.waste.length-1},targets:[{type:'tableau',pile:t}],text:`Move the waste card to column ${t+1}`};}
    for(let c=0;c<7;c++){const col=state.tableau[c];if(!col.length)continue;const top=col[col.length-1];if(top.faceUp&&canFoundation(state,top,top.suit))return{source:{type:'tableau',pile:c,index:col.length-1},targets:[{type:'foundation',pile:top.suit}],text:`Move ${rankText(top.rank)}${SYMBOL[top.suit]} to its foundation`};for(let i=0;i<col.length;i++)if(movableRun(col,i))for(let t=0;t<7;t++)if(t!==c&&canTableau(state.tableau[t],col[i]))return{source:{type:'tableau',pile:c,index:i},targets:[{type:'tableau',pile:t}],text:`Move the run from column ${c+1} to ${t+1}`};}
    if(state.stock.length)return{source:null,targets:[{type:'stock',pile:0}],text:'Draw from the stock'};return null;
  }

  function cardMarkup(card){ const color=colorOf(card);return `<div class="so-card-inner"><div class="so-card-corner ${color}"><span>${rankText(card.rank)}</span><span>${SYMBOL[card.suit]}</span></div><div class="so-card-pip ${color}">${SYMBOL[card.suit]}</div>${card.star&&card.starClaimed?'<i class="so-star-mark">✦</i>':''}</div>`; }
  function makeCard(card,top,z,meta){ const node=el('div','so-card '+(card.faceUp?'face-up '+colorOf(card):'face-down'));node.style.top=top+'px';node.style.zIndex=z;node.dataset.type=meta.type;node.dataset.pile=meta.pile;node.dataset.index=meta.index;node.dataset.uid=card.uid;node.dataset.suit=card.suit;node.dataset.rank=card.rank;node.setAttribute('aria-label',card.faceUp?rankText(card.rank)+' of '+SUITS[card.suit]:'Face-down card');if(card.faceUp)node.innerHTML=cardMarkup(card);return node; }
  function renderGameBoard(){
    if(screen!=='game'||!root||!state)return;const piles=root.querySelector('#so-piles'),tableau=root.querySelector('#so-tableau');if(!piles||!tableau)return;piles.innerHTML='';tableau.innerHTML='';
    const stock=el('div','so-pile stock');stock.dataset.targetType='stock';stock.dataset.targetPile='0';if(state.stock.length){const back=makeCard(state.stock[state.stock.length-1],0,2,{type:'stock',pile:0,index:state.stock.length-1});stock.appendChild(back);stock.appendChild(el('span','so-stock-count',String(state.stock.length)));}else if(state.waste.length)stock.innerHTML='<div style="position:absolute;inset:0;display:grid;place-items:center;color:#64748b;font-size:24px">↻</div>';
    if(perk().id==='oracle'&&state.stock.length){const preview=state.stock.slice(-3).reverse().map(c=>rankText(c.rank)+SYMBOL[c.suit]).join(' · ');stock.appendChild(el('span','so-oracle',preview));}
    piles.appendChild(stock);
    const waste=el('div','so-pile waste');waste.dataset.targetType='waste';waste.dataset.targetPile='0';if(state.waste.length){const count=Math.min(state.drawCount,state.waste.length);for(let i=count-1;i>=0;i--){const index=state.waste.length-1-i,card=state.waste[index],node=makeCard(card,0,count-i,{type:'waste',pile:0,index});node.style.left=`calc(50% + ${(count-1-i)*5}px)`;waste.appendChild(node);}}piles.appendChild(waste);
    piles.appendChild(el('div',''));
    for(let f=0;f<4;f++){const slot=el('div','so-pile foundation',SYMBOL[f]);slot.dataset.targetType='foundation';slot.dataset.targetPile=f;if(state.foundations[f].length){const card=state.foundations[f][state.foundations[f].length-1];slot.innerHTML='';slot.appendChild(makeCard(card,0,2,{type:'foundation',pile:f,index:state.foundations[f].length-1}));}piles.appendChild(slot);}
    for(let c=0;c<7;c++){const col=el('div','so-col');col.dataset.targetType='tableau';col.dataset.targetPile=c;const cards=state.tableau[c];cards.forEach((card,i)=>{const node=makeCard(card,i*cardOffset(),i+1,{type:'tableau',pile:c,index:i});if(selected&&selected.type==='tableau'&&selected.pile===c&&i>=selected.index)node.classList.add('selected');col.appendChild(node);});tableau.appendChild(col);}
    bindBoardEvents();
  }
  function cardOffset(){ return parseFloat(getComputedStyle(root).getPropertyValue('--card-off'))||22; }
  function bindBoardEvents(){ const board=root.querySelector('#so-board-zone');if(!board)return;board.onpointerdown=onPointerDown;board.ondblclick=onDoubleClick;board.onclick=onBoardClick; }
  function clearTargets(){root?.querySelectorAll('.target,.bad').forEach(n=>n.classList.remove('target','bad'));}
  function highlightTargets(targets){clearTargets();(targets||[]).forEach(t=>{let node;if(t.type==='tableau')node=root.querySelector(`.so-col[data-target-pile="${t.pile}"]`);else if(t.type==='foundation')node=root.querySelector(`.so-pile.foundation[data-target-pile="${t.pile}"]`);else if(t.type==='stock')node=root.querySelector('.so-pile.stock');node?.classList.add('target');});}
  function legalTargets(source){ if(!source)return[];const card=source.type==='waste'?state.waste[source.index]:state.tableau[source.pile][source.index];if(!card)return[];const targets=[];for(let c=0;c<7;c++)if((source.type!=='tableau'||c!==source.pile)&&canTableau(state.tableau[c],card))targets.push({type:'tableau',pile:c});const sourcePile=source.type==='waste'?state.waste:state.tableau[source.pile];if(source.index===sourcePile.length-1&&canFoundation(state,card,card.suit))targets.push({type:'foundation',pile:card.suit});return targets; }
  function selectSource(source){selected=source;renderGameBoard();highlightTargets(legalTargets(source));}
  function onBoardClick(event){
    if(Date.now()<suppressClickUntil||drag?.moved)return;
    const card=event.target.closest(".so-card"),target=event.target.closest("[data-target-type]");
    if(target?.dataset.targetType==="stock"){drawStock();return;}
    if(selected&&target){
      const same=card&&card.dataset.type===selected.type&&+card.dataset.pile===selected.pile&&+card.dataset.index===selected.index;
      if(same){selected=null;clearTargets();renderGameBoard();return;}
      attemptSelected(target.dataset.targetType,+target.dataset.targetPile,event.clientX,event.clientY);return;
    }
    if(card){const type=card.dataset.type,pile=+card.dataset.pile,index=+card.dataset.index;if(type==="foundation"||type==="stock")return;if(type==="tableau"&&!movableRun(state.tableau[pile],index))return;if(type==="waste"&&index!==state.waste.length-1)return;selectSource({type,pile,index});return;}
    selected=null;clearTargets();renderGameBoard();
  }
  function attemptSelected(type,pile,x,y){let ok=false;const anchor={x,y};if(type==='tableau'){ok=selected.type==='tableau'?moveTableau(selected.pile,selected.index,pile,anchor):moveWasteToTableau(pile,anchor);}if(type==='foundation'){const sourcePile=selected.type==='waste'?state.waste:state.tableau[selected.pile];if(selected.index===sourcePile.length-1)ok=moveToFoundation(selected.type,selected.pile,pile,false,anchor);}if(!ok){sound('invalid');toast('That move does not fit','#fb7185');}selected=null;clearTargets();renderGameBoard();}
  function onDoubleClick(event){const card=event.target.closest('.so-card');if(!card||card.dataset.type==='foundation'||card.dataset.type==='stock')return;const type=card.dataset.type,pile=+card.dataset.pile,index=+card.dataset.index;const source=type==='waste'?state.waste:state.tableau[pile];if(index!==source.length-1)return;const target=source[index].suit;if(!moveToFoundation(type,pile,target,false,{x:event.clientX,y:event.clientY})){sound('invalid');toast('Foundation is not ready','#94a3b8');}}
  function onPointerDown(event){
    if(event.button!==0||drag)return;
    const card=event.target.closest('.so-card');
    if(!card||card.dataset.type==='stock'||card.dataset.type==='foundation'||card.classList.contains('face-down'))return;
    const type=card.dataset.type,pile=+card.dataset.pile,index=+card.dataset.index;
    if(type==='tableau'&&!movableRun(state.tableau[pile],index))return;
    if(type==='waste'&&index!==state.waste.length-1)return;
    const rect=card.getBoundingClientRect();
    drag={type,pile,index,startX:event.clientX,startY:event.clientY,moved:false,ghost:null,pointerId:event.pointerId,originRect:rect,grabX:event.clientX-rect.left,grabY:event.clientY-rect.top,currentX:rect.left,currentY:rect.top,targetX:rect.left,targetY:rect.top,lastPointerX:event.clientX,lastPointerY:event.clientY,tilt:0,settling:false};
    card.setPointerCapture?.(event.pointerId);
  }
  function startDragVisual(event){
    drag.moved=true;
    drag.ghost=buildGhost(drag);
    document.body.appendChild(drag.ghost);
    markDragSource(drag,true);
    root.classList.add('so-is-dragging');
    drag.targetX=event.clientX-drag.grabX;
    drag.targetY=event.clientY-drag.grabY;
    drag.currentX=drag.originRect.left;
    drag.currentY=drag.originRect.top;
    drag.ghost.style.transform=`translate3d(${drag.currentX}px,${drag.currentY}px,0) rotate(0deg) scale(.985)`;
    scheduleDragFrame();
  }
  function scheduleDragFrame(){
    if(dragFrame||!drag?.ghost||drag.settling)return;
    dragFrame=requestAnimationFrame(stepDragFrame);
  }
  function stepDragFrame(){
    dragFrame=0;
    if(!drag?.ghost||drag.settling)return;
    const ease=.34;
    drag.currentX+=(drag.targetX-drag.currentX)*ease;
    drag.currentY+=(drag.targetY-drag.currentY)*ease;
    drag.tilt+=(0-drag.tilt)*.22;
    const lift=1.025;
    drag.ghost.style.transform=`translate3d(${drag.currentX}px,${drag.currentY}px,0) rotate(${drag.tilt.toFixed(2)}deg) scale(${lift})`;
    if(Math.abs(drag.targetX-drag.currentX)>.15||Math.abs(drag.targetY-drag.currentY)>.15||Math.abs(drag.tilt)>.08)scheduleDragFrame();
  }
  function onPointerMove(event){
    if(!drag||drag.settling||event.pointerId!==drag.pointerId)return;
    const dx=event.clientX-drag.startX,dy=event.clientY-drag.startY;
    if(!drag.moved&&Math.hypot(dx,dy)>6)startDragVisual(event);
    if(!drag.moved)return;
    event.preventDefault();
    const vx=event.clientX-drag.lastPointerX;
    drag.lastPointerX=event.clientX;drag.lastPointerY=event.clientY;
    drag.targetX=event.clientX-drag.grabX;
    drag.targetY=event.clientY-drag.grabY;
    drag.tilt=clamp(vx*.42,-5.5,5.5);
    scheduleDragFrame();
    previewDrop(event.clientX,event.clientY);
  }
  function dropCoordinates(target,type,pile){
    const cardW=parseFloat(getComputedStyle(root).getPropertyValue('--card-w'))||58;
    if(type==='tableau'){
      const rect=target.getBoundingClientRect();
      return{x:rect.left+(rect.width-cardW)/2,y:rect.top+state.tableau[pile].length*cardOffset()};
    }
    const rect=target.getBoundingClientRect();
    return{x:rect.left+(rect.width-cardW)/2,y:rect.top};
  }
  function settleGhost(current,x,y,valid,done){
    current.settling=true;
    if(dragFrame){cancelAnimationFrame(dragFrame);dragFrame=0;}
    const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const duration=reduced?20:(valid?180:230);
    current.ghost.style.transition=`transform ${duration}ms cubic-bezier(.2,.82,.24,1), opacity ${duration}ms ease, filter ${duration}ms ease`;
    current.ghost.style.filter=valid?'drop-shadow(0 8px 12px rgba(0,0,0,.34))':'drop-shadow(0 12px 18px rgba(251,113,133,.22))';
    current.ghost.style.opacity=valid?'1':'.92';
    current.ghost.style.transform=`translate3d(${x}px,${y}px,0) rotate(0deg) scale(1)`;
    setTimeout(done,duration+18);
  }
  function finishDragVisual(current){
    current.ghost?.remove();
    markDragSource(current,false);
    root?.classList.remove('so-is-dragging');
    clearTargets();
    if(drag===current)drag=null;
  }
  function onPointerUp(event){
    if(!drag||event.pointerId!==drag.pointerId)return;
    const current=drag;
    if(!current.moved){drag=null;return;}
    event.preventDefault();
    suppressClickUntil=Date.now()+420;
    const target=document.elementFromPoint(event.clientX,event.clientY)?.closest?.('[data-target-type]');
    const targetType=target?.dataset.targetType;
    const targetPile=target?+target.dataset.targetPile:-1;
    const source={type:current.type,pile:current.pile,index:current.index};
    const legal=!!target&&legalTargets(source).some(t=>t.type===targetType&&t.pile===targetPile);
    if(legal){
      const end=dropCoordinates(target,targetType,targetPile);
      settleGhost(current,end.x,end.y,true,()=>{
        finishDragVisual(current);
        attemptSelectedFromDrag(current,targetType,targetPile,event.clientX,event.clientY);
        const landed=targetType==='tableau'?root?.querySelector(`.so-col[data-target-pile="${targetPile}"] .so-card:last-child`):root?.querySelector(`.so-pile.foundation[data-target-pile="${targetPile}"] .so-card`);
        landed?.classList.add('so-drop-pulse');
      });
    }else{
      sound('invalid');
      settleGhost(current,current.originRect.left,current.originRect.top,false,()=>finishDragVisual(current));
    }
  }
  function buildGhost(source){const ghost=el("div","so-ghost");const css=getComputedStyle(root);ghost.style.setProperty("--card-w",css.getPropertyValue("--card-w"));ghost.style.setProperty("--card-h",css.getPropertyValue("--card-h"));ghost.style.setProperty("--card-off",css.getPropertyValue("--card-off"));const cards=source.type==="waste"?[state.waste[source.index]]:state.tableau[source.pile].slice(source.index);cards.forEach((card,i)=>{const node=makeCard(card,0,i+1,{type:source.type,pile:source.pile,index:source.index+i});node.style.top="0";ghost.appendChild(node);});return ghost;}
  function markDragSource(source,on){if(!root)return;const selector=source.type==='waste'?`.so-card[data-type="waste"][data-index="${source.index}"]`:`.so-card[data-type="tableau"][data-pile="${source.pile}"]`;root.querySelectorAll(selector).forEach(node=>{if(source.type==='waste'||+node.dataset.index>=source.index)node.classList.toggle('drag-source',on);});}
  function previewDrop(x,y){clearTargets();const node=document.elementFromPoint(x,y)?.closest?.('[data-target-type]');if(!node)return;const source={type:drag.type,pile:drag.pile,index:drag.index};const ok=legalTargets(source).some(t=>t.type===node.dataset.targetType&&t.pile===+node.dataset.targetPile);node.classList.add(ok?'target':'bad');}
  function attemptSelectedFromDrag(source,type,pile,x,y){selected={type:source.type,pile:source.pile,index:source.index};attemptSelected(type,pile,x,y);}

  function updateGameUi(){
    if(screen!=='game'||!root||!state)return;const set=(id,value)=>{const n=root.querySelector(id);if(n)n.textContent=value;};set('#so-score',state.score.toLocaleString());set('#so-moves',state.moves);set('#so-time',runMode==='rush'?formatTime(state.timeLeft):formatTime(state.elapsed));set('#so-combo','×'+clamp(1+Math.floor(state.combo/3),1,5));set('#so-charge',state.charges+'/3');set('#so-momentum-label',Math.round(state.momentum)+'%');
    const momentum=root.querySelector('#so-momentum-fill');if(momentum)momentum.style.width=clamp(state.momentum,0,100)+'%';const progress=root.querySelector('#so-contract-fill');if(progress)progress.style.width=clamp(state.challenge.progress/state.challenge.target*100,0,100)+'%';set('#so-contract-progress',`${state.challenge.progress}/${state.challenge.target}`);
    const undo=root.querySelector('[data-action="undo"]'),hint=root.querySelector('[data-action="hint"]'),auto=root.querySelector('[data-action="auto"]');if(undo){undo.disabled=!undoStack.length;undo.classList.toggle('ready',undoStack.length>0);}if(hint){hint.disabled=perk().id!=='oracle'&&state.charges<1;hint.classList.toggle('ready',!hint.disabled);}if(auto){auto.disabled=state.charges<2;auto.classList.toggle('ready',!auto.disabled);}
  }

  function renderMenu(){
    if(!root||!profile)return;screen='menu';stopTimer();runMode=mode().id;applyTheme();const selectedMode=mode();const playerRank=arcade.profile?.rank||1;const j=journeyConfig(profile.journeyLevel);const daily=dailyChallenge();const modeCopy={classic:{eyebrow:'Classic reimagined',title:'Full-Deal Flow',desc:'Traditional Klondike with Momentum multipliers, hidden star cards, powers, records, and rotating run challenges.',tags:['Complete 52 cards','Draw '+profile.selectedDraw,'Personal records']},journey:{eyebrow:`Chapter ${profile.journeyLevel} · ${j.world.name}`,title:j.title,desc:j.detail+'. Finish focused objectives in shorter sessions and earn up to five stars.',tags:[`${Object.keys(profile.journeyStars).length}/36 cleared`,`Reward ${j.reward}`,`Par ${j.movePar} moves`]},rush:{eyebrow:'Five-minute circuit',title:'Pulse Rush',desc:'Score as fast as possible. Clear a deal and another launches instantly while the clock keeps running.',tags:['5:00 timer','Consecutive deals','High multiplier']}}[selectedMode.id];
    stage.innerHTML=`<section class="so-screen so-menu"><div class="so-brand"><div class="so-emblem"><span class="so-emblem-cards"><i></i><i></i><i></i><b>♥</b></span></div><div class="so-brand-copy"><h1>Solitaire Odyssey</h1><p>Starlight Circuit</p></div><div class="so-menu-stats"><div class="so-menu-stat"><small>Wins</small><b>${profile.wins}</b></div><div class="so-menu-stat"><small>Stars</small><b style="color:#fbbf24">★ ${Object.values(profile.journeyStars).reduce((a,b)=>a+b,0)}</b></div></div></div>
      <div class="so-mode-grid">${[
        ['classic','♠','Classic Flow','Full traditional deal'],['journey','✦','Odyssey Chapters','36 focused missions'],['rush','⏱','Pulse Rush','Five-minute score attack']
      ].map(([id,icon,title,desc])=>{const need=MODE_UNLOCK[id]||1,locked=playerRank<need;return `<button class="so-mode-card ${selectedMode.id===id?'selected':''} ${locked?'locked':''}" data-mode="${id}" aria-disabled="${locked}"><div class="so-mode-head"><i class="so-mode-icon">${icon}</i><i class="so-mode-check">${locked?'R'+need:'✓'}</i></div><strong>${title}</strong><span>${locked?'Unlock at Rank '+need:desc}</span></button>`;}).join('')}</div>
      <section class="so-hero"><div class="so-eyebrow">${modeCopy.eyebrow}</div><h2>${modeCopy.title}</h2><p>${modeCopy.desc}</p>${selectedMode.id==='journey'?`<div class="so-journey-nav"><button class="so-nav-btn" data-chapter="prev">‹</button><div class="so-chapter-copy"><b>Chapter ${profile.journeyLevel} of 36</b><span>${j.type==='win'?'Complete crown deal':j.detail}</span></div><button class="so-nav-btn" data-chapter="next">›</button></div>`:''}<div class="so-hero-tags">${modeCopy.tags.map(t=>`<span class="so-tag">${t}</span>`).join('')}</div><button class="so-play" data-play>Play ${selectedMode.name}</button></section>
      <div class="so-menu-lower"><section class="so-panel"><div class="so-panel-head"><small>Draw rule</small><b>${profile.selectedDraw===1?'Accessible':'Strategic'}</b></div><div class="so-choice-row"><button class="so-choice ${profile.selectedDraw===1?'selected':''}" data-draw="1"><strong>Draw One</strong><span>Every card available</span></button><button class="so-choice ${profile.selectedDraw===3?'selected':''}" data-draw="3"><strong>Draw Three</strong><span>Classic stock planning</span></button><button class="so-choice" data-theme-cycle><strong>${themeName(profile.selectedTheme)}</strong><span>${(profile.themes||["midnight"]).length} card backs</span></button></div></section>
      <section class="so-panel"><div class="so-panel-head"><small>Active perk</small><b>${perk().name}</b></div><div class="so-choice-row">${[{id:'rewind',n:'Rewind',d:'3 free undos'},{id:'oracle',n:'Oracle',d:'Preview stock'},{id:'spark',n:'Star Current',d:'Fast charge'}].map(p=>{const need=PERK_UNLOCK[p.id]||1,locked=playerRank<need;return `<button class="so-choice ${perk().id===p.id?'selected':''} ${locked?'locked':''}" data-perk="${p.id}" aria-disabled="${locked}"><strong>${p.n}${locked?' · R'+need:''}</strong><span>${locked?'Unlock through play':p.d}</span></button>`;}).join('')}</div></section>
      <button type="button" class="so-panel so-daily" data-daily><div class="so-daily-icon">♛</div><div class="so-daily-copy"><b>${daily.title}</b><span>${daily.detail} · Same seeded deal all day</span></div><div class="so-daily-reward">${profile.dailyDate===dateKey()&&profile.dailyDone?'✓ Complete':'◆ '+daily.reward}</div></button></div></section><div class="so-toast"></div>`;
    root.querySelectorAll('[data-mode]').forEach(btn=>btn.addEventListener('click',()=>setMode(btn.dataset.mode)));
    root.querySelectorAll('[data-perk]').forEach(btn=>btn.addEventListener('click',()=>setPerk(btn.dataset.perk)));
    root.querySelectorAll('[data-draw]').forEach(btn=>btn.addEventListener('click',()=>{profile.selectedDraw=+btn.dataset.draw;saveProfile();sound('ui');renderMenu();}));
    root.querySelector('[data-play]').addEventListener('click',()=>startRun(selectedMode.id));
    root.querySelector('[data-daily]').addEventListener('click',()=>startRun('daily'));
    root.querySelector('[data-theme-cycle]').addEventListener('click',cycleTheme);
    root.querySelectorAll('[data-chapter]').forEach(btn=>btn.addEventListener('click',()=>{const delta=btn.dataset.chapter==='next'?1:-1;profile.journeyLevel=clamp(profile.journeyLevel+delta,1,Math.min(36,profile.journeyUnlocked||1));saveProfile();sound('ui');renderMenu();}));
    applyLayout();
  }

  function renderGame(){
    applyTheme();const challenge=currentChallenge(runMode);stage.innerHTML=`<section class="so-screen so-game"><header class="so-game-head"><div class="so-game-row"><button class="so-icon-btn" data-action="menu" aria-label="Return to menu">‹</button><div class="so-contract"><small>${runMode==='daily'?'Daily Crown':runMode==='journey'?'Odyssey objective':runMode==='rush'?'Pulse target':'Classic challenge'}</small><b>${challenge.title}</b><span>${challenge.detail}</span></div><div class="so-game-stats"><div class="so-game-stat"><small>Score</small><b id="so-score">0</b></div><div class="so-game-stat"><small>Moves</small><b id="so-moves">0</b></div><div class="so-game-stat"><small>${runMode==='rush'?'Left':'Time'}</small><b id="so-time">0:00</b></div><div class="so-game-stat"><small>Chain</small><b id="so-combo">×1</b></div></div><button class="so-icon-btn" data-action="help" aria-label="How to play">?</button></div><div class="so-contract-track"><i id="so-contract-fill"></i></div><div style="display:flex;justify-content:flex-end;margin-top:2px;color:#71819b;font-size:7px;font-weight:900" id="so-contract-progress">0/${challenge.target}</div></header>
      <div class="so-game-layout"><aside class="so-side"><div class="so-side-card"><small>Mode</small><b>${runMode==='daily'?'Daily Crown':mode().name}</b><p>${challenge.detail}</p></div><div class="so-side-card"><small>Perk</small><b>${perk().name}</b><p>${perk().desc}</p></div><div class="so-side-card"><small>Starlight cards</small><b>Three per deal</b><p>Reveal hidden star cards to gain score, Momentum, and power charge.</p></div></aside><main class="so-board-zone" id="so-board-zone"><div class="so-piles" id="so-piles"></div><div class="so-tableau" id="so-tableau"></div></main><aside class="so-side"><div class="so-side-card"><small>Momentum</small><b>Strategic moves matter</b><p>Foundation moves, hidden-card reveals, and cleared columns build the multiplier. Cycling stock does not.</p></div><div class="so-side-card"><small>Controls</small><b>Drag or tap</b><p>Double-click a top card for foundation. Z rewinds, H hints, and A uses Auto Lift.</p></div><div class="so-side-card"><small>Current run</small><b id="so-side-charge">Build the circuit</b><p>Use charged powers only when the board is truly blocked.</p></div></aside></div>
      <footer class="so-bottom"><div class="so-momentum"><div class="so-meter-line"><span>Momentum · <b id="so-momentum-label">0%</b></span><span class="so-charge">✦ <b id="so-charge">0/3</b></span></div><div class="so-meter"><i id="so-momentum-fill"></i></div></div><button class="so-power" data-action="undo"><b>↶</b><span>Rewind</span></button><button class="so-power" data-action="hint"><b>✦</b><span>Hint</span></button><button class="so-power" data-action="auto"><b>»</b><span>Auto Lift</span></button></footer></section><div class="so-toast"></div>`;
    root.querySelector('[data-action="menu"]').addEventListener('click',()=>{sound('ui');renderMenu();});root.querySelector('[data-action="help"]').addEventListener('click',showHelp);root.querySelector('[data-action="undo"]').addEventListener('click',undo);root.querySelector('[data-action="hint"]').addEventListener('click',useHint);root.querySelector('[data-action="auto"]').addEventListener('click',useAuto);applyLayout();
  }

  function finishRun(success,reason){
    if(runFinished)return;runFinished=true;stopTimer();const stars=calculateStars(success);profile.bestScore=Math.max(profile.bestScore,state.score);if(success&&runMode==='journey'){const old=profile.journeyStars[profile.journeyLevel]||0;profile.journeyStars[profile.journeyLevel]=Math.max(old,stars);profile.journeyUnlocked=Math.min(36,Math.max(profile.journeyUnlocked||1,profile.journeyLevel+1));profile.journeyLevel=Math.min(profile.journeyUnlocked,profile.journeyLevel+1);}if(success&&runMode==='daily'){profile.dailyDate=dateKey();profile.dailyDone=true;}if(!success&&runMode==='classic'){profile.classicChallengeStreak=0;}syncThemes();saveProfile();if(success)sound('complete');else sound('lose');arcade.record(success?'level':'fail',1);arcade.record('score',state.score);
    const title=success?(reason==='win'?'Crown Cleared!':runMode==='journey'?'Chapter Complete!':runMode==='daily'?'Daily Crown Won!':'Objective Complete!'):(reason==='time'?'Circuit Closed':'Run Ended');const icon=success?'♛':'◇';const modal=el('div','so-overlay');modal.innerHTML=`<div class="so-modal"><div class="so-modal-icon">${icon}</div><h2>${title}</h2><p>${success?'Your choices built a clean Starlight circuit.':'Every deal trains pattern recognition. Carry the route into the next run.'}</p><div class="so-stars">${[1,2,3,4,5].map(n=>n<=stars?'★':'☆').join('')}</div><div class="so-result-grid"><div class="so-result"><small>Score</small><b style="color:#fbbf24">${state.score.toLocaleString()}</b></div><div class="so-result"><small>Moves</small><b>${state.moves}</b></div><div class="so-result"><small>Best chain</small><b>×${clamp(1+Math.floor(state.bestCombo/3),1,5)}</b></div><div class="so-result"><small>Time</small><b>${formatTime(state.elapsed)}</b></div><div class="so-result"><small>Stars found</small><b>${state.starsFound}/3</b></div><div class="so-result"><small>Charges used</small><b>${state.hintsUsed+state.undosUsed}</b></div></div><div class="so-modal-actions"><button data-result="menu">Menu</button><button class="primary" data-result="again">${runMode==='journey'&&success?'Next Chapter':'Play Again'}</button></div></div>`;stage.appendChild(modal);modal.querySelector('[data-result="menu"]').addEventListener('click',renderMenu);modal.querySelector('[data-result="again"]').addEventListener('click',()=>startRun(runMode==='daily'?'daily':mode().id));
  }
  function calculateStars(success){ if(!success)return Math.min(2,state.challengeComplete?2:1);let stars=2;if(state.challengeComplete)stars++;if(state.hintsUsed===0&&state.undosUsed<=1)stars++;const par=runMode==='journey'?journeyConfig(Math.max(1,profile.journeyLevel)).movePar:100;if(state.moves<=par&&state.bestCombo>=6)stars++;return clamp(stars,1,5); }
  function showHelp(){
    if(!root)return;const modal=el('div','so-overlay');modal.innerHTML=`<div class="so-modal"><div class="so-modal-icon">?</div><h2>How Starlight works</h2><div class="so-help-copy"><h3>Classic Klondike</h3><p>Build tableau cards downward in alternating colors. Move Aces through Kings into their matching suit foundations. Only Kings may enter empty columns.</p><h3>Modern Momentum</h3><p>Productive moves build a score multiplier and Star Charge. Drawing stock repeatedly lowers Momentum, so planning is rewarded more than cycling.</p><h3>Star cards</h3><p>Every deal hides three marked cards. Reveal them for score and charge bonuses. They remain ordinary playing cards.</p><h3>Powers</h3><p>Rewind restores an earlier board, Hint marks a legal move, and Auto Lift sends one safe visible card to its foundation. Powers preserve strategy; they never solve the deal automatically.</p><h3>Controls</h3><p>Drag cards, or tap a card and then its destination. Double-click a top card for foundation. Keyboard: Z Rewind, H Hint, A Auto Lift, N New run.</p></div><div class="so-modal-actions"><button class="primary" data-close>Got it</button></div></div>`;stage.appendChild(modal);modal.querySelector('[data-close]').addEventListener('click',()=>modal.remove());modal.addEventListener('click',e=>{if(e.target===modal)modal.remove();});
  }

  function applyLayout(){ if(!root||!container)return;const rect=container.getBoundingClientRect();const w=Math.max(320,rect.width),h=Math.max(420,rect.height);root.classList.toggle('so-wide',w>=1050&&h>=650);root.classList.toggle('so-mobile',w<500);const boardWidth=root.classList.contains('so-wide')?Math.min(760,w-460):w-20;const gap=w<430?3:w<600?5:7;const cardW=clamp(Math.floor((boardWidth-gap*6-8)/7),40,76);const cardH=Math.round(cardW*1.42);const gameHeader=w<500?84:94;const bottom=64;const boardH=Math.max(330,h-gameHeader-bottom-18);const maxStack=13;const offset=clamp(Math.floor((boardH-cardH-18)/(maxStack-1)),14,28);root.style.setProperty('--card-w',cardW+'px');root.style.setProperty('--card-h',cardH+'px');root.style.setProperty('--card-off',offset+'px');root.style.setProperty('--pile-gap',gap+'px');if(screen==='game')renderGameBoard(); }
  function onKey(event){ if(screen!=='game'||event.ctrlKey||event.metaKey||event.altKey)return;const key=event.key.toLowerCase();if(['z','h','a','n'].includes(key)){event.preventDefault();event.stopImmediatePropagation();if(key==='z')undo();if(key==='h')useHint();if(key==='a')useAuto();if(key==='n')startRun(runMode);}}

  return{
    async mount(nextContainer){
      container=nextContainer;root=el('div','so-root');stage=el('div','so-stage');root.appendChild(stage);container.innerHTML='';container.appendChild(root);arcade.mount(root,container);profile=await storageGet();if(profile.dailyDate!==dateKey())profile.dailyDone=false;syncThemes();await arcade.ready;arcade.onChange(()=>{if(screen==='menu'){runMode=arcade.mode().id;applyTheme();renderMenu();}});runMode=arcade.mode().id;applyTheme();renderMenu();resizeObserver=new ResizeObserver(applyLayout);resizeObserver.observe(container);window.addEventListener('pointermove',onPointerMove,true);window.addEventListener('pointerup',onPointerUp,true);window.addEventListener('keydown',onKey,true);removePause=host.runtime.lifecycle.onPause(()=>{stopTimer();});removeResume=host.runtime.lifecycle.onResume(()=>{if(screen==='game'&&!runFinished)startTimer();});
    },
    unmount(){stopTimer();clearTimeout(toastId);if(dragFrame){cancelAnimationFrame(dragFrame);dragFrame=0;}drag?.ghost?.remove();drag=null;resizeObserver?.disconnect();window.removeEventListener('pointermove',onPointerMove,true);window.removeEventListener('pointerup',onPointerUp,true);window.removeEventListener('keydown',onKey,true);removePause?.();removeResume?.();arcade.cleanup();if(audio){audio.close().catch(()=>{});audio=null;}root=null;stage=null;container=null;}
  };
}
