import { createArcade, setTimeout, clearTimeout, setInterval, clearInterval, requestAnimationFrame, cancelAnimationFrame } from './arcade-kit.js';
var STYLE_ID = 'tend-ext-memory-styles-v220';

function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return;
  var s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = [
'@keyframes mmGrad{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}',
'@keyframes mmEnter{from{opacity:0;transform:scale(.3) rotateY(180deg)}to{opacity:1;transform:scale(1) rotateY(0)}}',
'@keyframes mmBounce{0%{transform:scale(1)}25%{transform:scale(1.15)}55%{transform:scale(.95)}100%{transform:scale(1)}}',
'@keyframes mmShake{0%,100%{transform:rotateY(180deg) translateX(0)}20%{transform:rotateY(180deg) translateX(-5px)}40%{transform:rotateY(180deg) translateX(5px)}60%{transform:rotateY(180deg) translateX(-3px)}80%{transform:rotateY(180deg) translateX(3px)}}',
'@keyframes mmPop{0%{transform:scale(.4);opacity:0}100%{transform:scale(1);opacity:1}}',
'@keyframes mmConfetti{0%{transform:translateY(-15px) rotate(0) scale(1);opacity:1}85%{opacity:1}100%{transform:translateY(120vh) rotate(var(--r,720deg)) scale(.6);opacity:0}}',
'@keyframes mmPulse{0%,100%{transform:scale(1);opacity:.7}50%{transform:scale(1.12);opacity:1}}',
'@keyframes mmPart{0%{opacity:1;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(var(--tx),var(--ty)) scale(0)}}',
'@keyframes mmFade{from{opacity:0}to{opacity:1}}',
'.mm-r{width:100%;height:100%;display:flex;flex-direction:column;overflow:hidden;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;user-select:none;-webkit-user-select:none;background:linear-gradient(180deg,#0B0E1A 0%,#0a0d1a 50%,#0d0f1f 100%);color:#E2E8F0;position:relative}',
'.mm-screen{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:14px;text-align:center}',
'.mm-screen.hidden{display:none}',
'.mm-hero-icon{font-size:42px;animation:mmPulse 2.4s ease-in-out infinite;margin-bottom:6px}',
'.mm-hero-title{font-size:34px;font-weight:900;margin:0;background:linear-gradient(135deg,#4FC3F7,#66BB6A,#FFD54F,#FF6B9D,#A855F7);background-size:300% 300%;animation:mmGrad 5s ease infinite;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;letter-spacing:1px}',
'.mm-hero-sub{font-size:13px;color:#94A3B8;max-width:280px;margin:6px 0 18px;line-height:1.4}',
'.mm-dfs{display:grid;grid-template-columns:1fr 1fr;gap:8px;width:100%;max-width:280px;margin-bottom:14px}',
'.mm-df{padding:9px 8px;border-radius:12px;border:2px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03);cursor:pointer;font-weight:700;font-size:11px;transition:all .2s;font-family:inherit;color:#E2E8F0;text-align:left;display:flex;align-items:center;gap:10px}',
'.mm-df:hover{transform:translateY(-1px);background:rgba(255,255,255,.06)}',
'.mm-df .dl{display:block;font-size:13px;font-weight:800}',
'.mm-df .dd{display:block;font-size:9px;color:#94A3B8;font-weight:600;text-transform:uppercase;letter-spacing:1px}',
'.mm-df .di{font-size:18px;line-height:1}',
'.mm-df.sel{border-color:rgba(168,85,247,.6);background:linear-gradient(135deg,rgba(168,85,247,.18),rgba(236,72,153,.12));box-shadow:0 0 14px rgba(168,85,247,.3)}',
'.mm-start{padding:13px 44px;border-radius:14px;border:none;background:linear-gradient(135deg,#A855F7,#EC4899);color:#fff;font-size:16px;font-weight:900;cursor:pointer;font-family:inherit;letter-spacing:2px;box-shadow:0 0 30px rgba(168,85,247,.35),0 8px 24px rgba(0,0,0,.4);transition:all .2s}',
'.mm-start:hover{transform:scale(1.05);box-shadow:0 0 50px rgba(168,85,247,.5)}',
'.mm-best{font-size:11px;color:#FBBF24;font-weight:700;margin-top:14px}',
'.mm-game{position:absolute;inset:0;display:flex;flex-direction:column;padding:8px;gap:6px;overflow:hidden}',
'.mm-bar{display:flex;align-items:center;gap:6px;padding:8px;background:linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.08);border-radius:14px;flex-shrink:0;backdrop-filter:blur(6px)}',
'.mm-stats{display:flex;gap:4px;flex:1}',
'.mm-stat{flex:1;text-align:center;padding:2px 4px;position:relative;display:flex;align-items:center;justify-content:center;gap:5px}',
'.mm-stat:not(:last-child)::after{content:"";position:absolute;right:-2px;top:18%;height:64%;width:1px;background:rgba(255,255,255,.06)}',
'.mm-si-icon{width:22px;height:22px;border-radius:6px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;flex-shrink:0}',
'.mm-si-icon.mv{background:linear-gradient(135deg,#4FC3F7,#0288D1)}',
'.mm-si-icon.mt{background:linear-gradient(135deg,#22C55E,#16A34A)}',
'.mm-si-icon.tm{background:linear-gradient(135deg,#FBBF24,#D97706)}',
'.mm-si-icon.sc{background:linear-gradient(135deg,#EC4899,#DB2777)}',
'.mm-st-text{display:flex;flex-direction:column;align-items:flex-start;line-height:1.05}',
'.mm-st-label{font-size:8px;text-transform:uppercase;letter-spacing:1.4px;color:#64748B;font-weight:700}',
'.mm-st-val{font-size:14px;font-weight:900;font-variant-numeric:tabular-nums;color:#fff}',
'.mm-help{width:32px;height:32px;border-radius:9px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:#94A3B8;cursor:pointer;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:15px;transition:all .15s;font-family:inherit;flex-shrink:0}',
'.mm-help:hover{background:rgba(255,255,255,.1);color:#fff;transform:translateY(-1px)}',
'.mm-grid-wrap{flex:1;display:flex;align-items:center;justify-content:center;min-height:0;width:100%}',
'.mm-grid{display:grid;gap:8px;width:100%;height:100%;max-width:100%;max-height:100%}',
'.mm-card{perspective:900px;cursor:pointer;aspect-ratio:1;min-width:0;min-height:0}',
'.mm-ci{width:100%;height:100%;position:relative;transform-style:preserve-3d;transition:transform .5s cubic-bezier(.34,1.56,.64,1);border-radius:12px}',
'.mm-card.fl .mm-ci,.mm-card.ma .mm-ci{transform:rotateY(180deg)}',
'.mm-cf{position:absolute;width:100%;height:100%;backface-visibility:hidden;-webkit-backface-visibility:hidden;border-radius:12px;display:flex;align-items:center;justify-content:center}',
'.mm-cb{background:linear-gradient(135deg,#1f2937,#0f172a);border:1px solid rgba(255,255,255,.08);box-shadow:inset 0 1px 4px rgba(255,255,255,.05),0 4px 14px rgba(0,0,0,.35);overflow:hidden;color:#fff}',
'.mm-cb-dots{position:absolute;inset:0;opacity:.18;background:radial-gradient(circle,rgba(168,85,247,.4) 2px,transparent 2px);background-size:14px 14px}',
'.mm-cb-q{font-size:clamp(14px,3vw,24px);color:rgba(168,85,247,.85);z-index:1;text-shadow:0 0 12px rgba(168,85,247,.4);font-weight:900}',
'.mm-cfr{background:linear-gradient(135deg,#fff,#f1f5f9);transform:rotateY(180deg);box-shadow:0 4px 14px rgba(0,0,0,.4);border:2px solid rgba(255,255,255,.4)}',
'.mm-emoji{font-size:clamp(20px,5vw,42px);line-height:1}',
'.mm-card:not(.fl):not(.ma):hover .mm-ci{transform:scale(1.06) rotateY(8deg)}',
'.mm-card.ma .mm-cfr{border-color:#22C55E;box-shadow:0 0 22px rgba(34,197,94,.6),0 4px 14px rgba(0,0,0,.3)}',
'.mm-card.ma{animation:mmBounce .5s ease;pointer-events:none}',
'.mm-card.sk .mm-ci{animation:mmShake .4s ease}',
'.mm-card.entering{opacity:0;animation:mmEnter .4s cubic-bezier(.34,1.56,.64,1) forwards}',
'.mm-ctrls{display:flex;gap:6px;flex-shrink:0}',
'.mm-ctrl{flex:1;padding:8px 14px;border-radius:10px;border:1px solid;font-weight:700;font-size:11px;cursor:pointer;font-family:inherit;transition:all .15s;letter-spacing:.5px}',
'.mm-ctrl:hover{transform:translateY(-1px)}',
'.mm-ctrl.pri{border-color:#A855F7;color:#fff;background:linear-gradient(135deg,rgba(168,85,247,.2),rgba(236,72,153,.15))}',
'.mm-ctrl.sec{border-color:rgba(255,255,255,.1);color:#94A3B8;background:rgba(255,255,255,.03)}',
'.mm-part{position:absolute;pointer-events:none;z-index:50;border-radius:50%;animation:mmPart .7s ease-out forwards}',
'.mm-conf{position:absolute;top:-15px;z-index:60;pointer-events:none;border-radius:2px;animation:mmConfetti linear forwards}',
'.mm-vic{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:18px;position:relative;overflow:hidden}',
'.mm-vm{background:linear-gradient(180deg,#1A1F35,#15192a);border:1px solid rgba(255,255,255,.1);border-radius:20px;padding:24px 22px;text-align:center;max-width:340px;width:100%;animation:mmPop .5s cubic-bezier(.34,1.56,.64,1);box-shadow:0 24px 60px rgba(0,0,0,.7);position:relative;overflow:hidden}',
'.mm-vm::before{content:"";position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#4FC3F7,#66BB6A,#FFD54F,#EC4899,#A855F7)}',
'.mm-vt{font-size:24px;font-weight:900;margin:0 0 4px;background:linear-gradient(135deg,#FBBF24,#F59E0B);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}',
'.mm-vs{color:#94A3B8;font-weight:600;margin:0;font-size:13px}',
'.mm-vst{font-size:32px;margin:6px 0;display:flex;gap:8px;justify-content:center}',
'.mm-vsa{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:8px 0 14px}',
'.mm-vsi{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:8px}',
'.mm-vsl{font-size:10px;color:#94A3B8;font-weight:600;text-transform:uppercase;letter-spacing:1px}',
'.mm-vsv{font-size:18px;font-weight:900;color:#fff;margin-top:2px}',
'.mm-vb{display:flex;gap:8px;justify-content:center;margin-top:6px}',
'.mm-vbtn{padding:9px 22px;border-radius:10px;border:none;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;transition:transform .15s}',
'.mm-vbtn:hover{transform:translateY(-1px)}',
'.mm-vbtn.pri{background:linear-gradient(135deg,#A855F7,#EC4899);color:#fff;box-shadow:0 4px 18px rgba(168,85,247,.35)}',
'.mm-vbtn.sec{background:rgba(255,255,255,.06);color:#E2E8F0;border:1px solid rgba(255,255,255,.1)}',
'.mm-toast{position:absolute;bottom:14px;left:50%;transform:translateX(-50%) translateY(60px);background:rgba(15,23,42,.95);border:1px solid rgba(255,255,255,.08);color:#fff;padding:8px 16px;border-radius:10px;font-weight:700;z-index:100;transition:transform .4s cubic-bezier(.34,1.56,.64,1);white-space:nowrap;font-size:12px}',
'.mm-toast.show{transform:translateX(-50%) translateY(0)}',
'.mm-help-modal{position:absolute;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;z-index:50;padding:14px;animation:mmFade .2s ease}',
'.mm-help-box{background:linear-gradient(180deg,#1A1F35,#15192a);border:1px solid rgba(255,255,255,.1);border-radius:18px;padding:20px;max-width:340px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.6);animation:mmPop .3s cubic-bezier(.34,1.56,.64,1)}',
'.mm-help-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}',
'.mm-help-title{font-size:18px;font-weight:800;color:#fff;margin:0;display:flex;align-items:center;gap:8px}',
'.mm-help-close{width:28px;height:28px;border-radius:8px;border:none;background:rgba(255,255,255,.06);color:#94A3B8;cursor:pointer;font-size:18px;line-height:1;font-family:inherit;transition:all .15s}',
'.mm-help-close:hover{background:rgba(255,255,255,.12);color:#fff}',
'.mm-help-body{font-size:13px;line-height:1.55;color:#CBD5E1}',
'.mm-help-body h3{font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#94A3B8;margin:14px 0 6px;font-weight:700}',
'.mm-help-body h3:first-child{margin-top:0}',
'.mm-help-body ul{margin:0;padding-left:18px}',
'.mm-help-body li{margin:3px 0}',
    '.mm-stage-nav{width:100%;max-width:280px;display:grid;grid-template-columns:38px 1fr 38px;align-items:center;gap:8px;margin:0 0 10px}.mm-stage-nav button{height:36px;border-radius:11px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:#fff;font-size:22px;cursor:pointer}.mm-stage-nav div{display:flex;flex-direction:column;padding:6px 10px;border-radius:11px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.07)}.mm-stage-nav small{font-size:8px;color:#64748b;text-transform:uppercase;letter-spacing:1px}.mm-stage-nav b{font-size:13px;margin-top:2px}.mm-grid-wrap{overflow:hidden;padding:2px}.mm-grid{flex:none;max-width:100%!important;max-height:100%!important;aspect-ratio:var(--mm-cols)/var(--mm-rows)}.mm-card{aspect-ratio:auto!important;min-height:0}.mm-ci{border-radius:clamp(7px,1.8vw,12px)}@media(min-width:768px){.tend-floating-window.tend-game-focus .tend-arcade-root.mm-r{width:min(760px,calc(100dvw - 40px))!important;height:min(900px,calc(100dvh - 40px))!important}.tend-floating-window.tend-game-focus .mm-grid{max-width:680px!important;max-height:720px!important}.tend-floating-window.tend-game-focus .mm-emoji{font-size:clamp(24px,4.2vw,48px)}}@media(max-width:767px){.mm-game{padding:max(6px,env(safe-area-inset-top)) 6px max(8px,env(safe-area-inset-bottom))}.mm-grid{gap:5px}.mm-ctrl{padding:9px 8px}.mm-dfs{grid-template-columns:1fr 1fr;max-width:340px}.mm-screen{justify-content:flex-start;overflow:auto;padding-top:18px}.mm-hero-icon{font-size:34px}.mm-hero-title{font-size:29px}}',
].join('');
  document.head.appendChild(s);
}

var EMOJIS = ['🐶','🐱','🐰','🦊','🐻','🐼','🐸','🦁','🐯','🐮','🐷','🦄','🐝','🌟','🍎','🍕','🎈','🚀','🎯','🎨','🍰','🌈','🎵','🎪','🦋','🐢','🐙','🦀','🦉','🦔'];
var DIFFS = {
  easy:   {cols:4, rows:3, pairs:6,  label:'Easy',   tag:'4×3',  icon:'🟢'},
  medium: {cols:4, rows:4, pairs:8,  label:'Medium', tag:'4×4',  icon:'🔵'},
  hard:   {cols:5, rows:4, pairs:10, label:'Hard',   tag:'5×4',  icon:'🟠'},
  expert: {cols:6, rows:4, pairs:12, label:'Expert', tag:'6×4',  icon:'🔴'},
  master: {cols:6, rows:5, pairs:15, label:'Master', tag:'6×5',  icon:'🟣'},
  insane: {cols:7, rows:6, pairs:21, label:'Insane', tag:'7×6',  icon:'⚫'}
};

function shuffle(a){a=[].concat(a);for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t}return a}

export default function activate(host) {
  const arcade = createArcade(host, {"name":"Memory Match Odyssey","icon":"🧠","subtitle":"A 50-stage memory campaign with modifiers and streaks","modes":[{"id":"campaign","name":"Campaign","icon":"▦","desc":"Progressive boards and stage modifiers","unlock":1},{"id":"blitz","name":"Blitz","icon":"⚡","desc":"Faster clock and richer combo rewards","unlock":3},{"id":"mist","name":"Memory Mist","icon":"☁","desc":"Matched positions occasionally shift","unlock":6}],"perks":[{"id":"preview","name":"Quick Preview","icon":"◉","desc":"Longer opening card preview","unlock":1},{"id":"grace","name":"Combo Grace","icon":"🔥","desc":"Keep combos alive longer","unlock":3},{"id":"hint","name":"Echo Hint","icon":"✦","desc":"One free pair pulse per stage","unlock":5}],"missions":[{"event":"pair","target":60,"title":"Pair Finder","detail":"Match 60 pairs","icon":"🧠","reward":80},{"event":"combo","target":30,"title":"Perfect Recall","detail":"Build 30 combo points","icon":"🔥","reward":100},{"event":"level","target":6,"title":"Memory Trail","detail":"Clear six stages","icon":"🏁","reward":120}]});

  ensureStyles();
  var diff='easy', cards=[], flipped=[], matched=0, total=6, moves=0, score=0, combo=0, sec=0, timer=null, locked=false, started=false, audio=null, best={}, root=null, toastT=null;
  var campaignStage=1,activeMode='campaign',activePerk='preview',hintUsed=false,hintUses=1,countdown=0;
  var gridObserver=null,removeArcadeChange=null;

  removeArcadeChange=arcade.onChange(function(){
    activeMode=arcade.mode().id;activePerk=arcade.perk().id;
    arcade.closeHub();hero();
  });

  function initA(){if(!audio)try{audio=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}
  function resA(){if(audio&&audio.state==='suspended')audio.resume()}
  function tone(f,d,t,v){if(!audio)return;resA();var o=audio.createOscillator(),g=audio.createGain();o.type=t||'sine';o.frequency.setValueAtTime(f,audio.currentTime);g.gain.setValueAtTime(v||.12,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+d);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+d)}
  function sfxFlip(){tone(1200,.08,'sine',.1)}
  function sfxMatch(){[523,659,784].forEach(function(f,i){setTimeout(function(){tone(f,.18,'sine',.15)},i*100)})}
  function sfxCombo(){[784,988,1175].forEach(function(f,i){setTimeout(function(){tone(f,.12,'sine',.15)},i*60)})}
  function sfxNo(){tone(350,.2,'triangle',.1);setTimeout(function(){tone(180,.15,'triangle',.08)},80)}
  function sfxWin(){[523,587,659,784,880,1047].forEach(function(f,i){setTimeout(function(){tone(f,.25,'triangle',.12)},i*90)})}
  function fmt(s){return Math.floor(s/60)+':'+(s%60<10?'0':'')+s%60}
  // 5-star rating based on moves-per-pair (m/p). 1.0 = perfect (every flip
  // was a match). Brackets get tighter at the top so 5 stars feels earned.
  //   5★: r <= 1.1   (near-perfect)
  //   4★: r <= 1.4
  //   3★: r <= 1.8
  //   2★: r <= 2.3
  //   1★: anything else
  function stars(m,p){var r=m/p;if(r<=1.1)return 5;if(r<=1.4)return 4;if(r<=1.8)return 3;if(r<=2.3)return 2;return 1}
  function starHTML(n){var h='';for(var i=0;i<5;i++)h+='<span style="opacity:'+(i<n?1:.2)+';color:'+(i<n?'#FBBF24':'#475569')+';text-shadow:'+(i<n?'0 0 16px rgba(251,191,36,.7)':'none')+'">★</span>';return h}
  function getB(d){return best[d]||null}
  function saveB(d,v){var c=best[d];if(!c||v.score>c.score){best[d]=v;host.storage.set('bestScores',best).catch(function(){})}}
  function toast(msg,col){var t=root.querySelector('.mm-toast');if(!t)return;clearTimeout(toastT);t.textContent=msg;t.style.color=col||'#fff';t.classList.add('show');toastT=setTimeout(function(){t.classList.remove('show')},1800)}

  function showHelp(){
    var modal=document.createElement('div');modal.className='mm-help-modal';
    var box=document.createElement('div');box.className='mm-help-box';
    box.innerHTML=''
      +'<div class="mm-help-head">'
      +  '<h2 class="mm-help-title"><span>🧠</span> How to Play</h2>'
      +  '<button class="mm-help-close" data-close>&times;</button>'
      +'</div>'
      +'<div class="mm-help-body">'
      +  '<h3>Goal</h3>'
      +  '<p>Find every pair of matching cards in as few moves and as little time as possible.</p>'
      +  '<h3>How to Play</h3>'
      +  '<ul>'
      +    '<li>Click a card to flip it.</li>'
      +    '<li>Click another card to try to match.</li>'
      +    '<li>Match keeps both cards face-up. Mismatch flips both back.</li>'
      +    '<li>Match every pair to win.</li>'
      +  '</ul>'
      +  '<h3>Scoring</h3>'
      +  '<ul>'
      +    '<li>Each match: <b>100 points</b>.</li>'
      +    '<li>Consecutive matches build a combo &mdash; bigger combos = bigger bonuses.</li>'
      +    '<li>Time bonus and efficiency bonus added at the end.</li>'
      +  '</ul>'
      +  '<h3>Difficulty</h3>'
      +  '<p>Easy starts at 6 pairs; Master and Insane scale up to 15 and 21 pairs. Resize the window to fit the bigger boards.</p>'
      +'</div>';
    modal.appendChild(box);
    function close(){modal.remove()}
    modal.addEventListener('click',function(e){if(e.target===modal)close()});
    box.querySelector('[data-close]').addEventListener('click',close);
    function onKey(e){if(e.key==='Escape'){close();window.removeEventListener('keydown',onKey)}}
    window.addEventListener('keydown',onKey);
    root.appendChild(modal);
  }

  function particles(el){
    var r=el.getBoundingClientRect(),rr=root.getBoundingClientRect();
    var cx=r.left-rr.left+r.width/2,cy=r.top-rr.top+r.height/2;
    var cols=['#FBBF24','#EC4899','#22C55E','#4FC3F7','#A855F7','#F97316'];
    for(var i=0;i<10;i++){
      var p=document.createElement('div');p.className='mm-part';
      var sz=4+Math.random()*6;var a=(Math.PI*2/10)*i+Math.random()*.3;var d=30+Math.random()*45;
      p.style.width=sz+'px';p.style.height=sz+'px';p.style.left=cx+'px';p.style.top=cy+'px';
      p.style.background=cols[Math.floor(Math.random()*cols.length)];
      p.style.setProperty('--tx',Math.cos(a)*d+'px');p.style.setProperty('--ty',Math.sin(a)*d+'px');
      root.appendChild(p);(function(e){setTimeout(function(){e.remove()},800)})(p);
    }
  }

  function confetti(){
    var cols=['#FBBF24','#EC4899','#22C55E','#4FC3F7','#A855F7','#F97316'];
    for(var i=0;i<40;i++){
      var c=document.createElement('div');c.className='mm-conf';
      var w=5+Math.random()*6,h=8+Math.random()*10;
      c.style.width=w+'px';c.style.height=h+'px';c.style.left=Math.random()*100+'%';
      c.style.background=cols[Math.floor(Math.random()*cols.length)];
      var dur=2+Math.random()*2;c.style.animationDuration=dur+'s';c.style.animationDelay=Math.random()*1.5+'s';
      c.style.setProperty('--r',(360+Math.random()*720)+'deg');
      root.appendChild(c);(function(e,d){setTimeout(function(){e.remove()},(d+2)*1000)})(c,dur);
    }
  }

  function stageDiff(){var order=['easy','medium','hard','expert','master','insane'];return order[Math.min(order.length-1,Math.floor((campaignStage-1)/8))];}

  function stopGridObserver(){if(gridObserver){gridObserver.disconnect();gridObserver=null}}
  function fitGrid(gridWrap,grid,cfg){
    if(!gridWrap||!grid||!cfg)return;
    var rect=gridWrap.getBoundingClientRect();
    if(rect.width<20||rect.height<20)return;
    var gap=rect.width<520?5:8;
    var availW=Math.max(160,rect.width-4),availH=Math.max(150,rect.height-4);
    var ratio=cfg.cols/cfg.rows,w=availW,h=w/ratio;
    if(h>availH){h=availH;w=h*ratio}
    grid.style.gap=gap+'px';grid.style.width=Math.floor(w)+'px';grid.style.height=Math.floor(h)+'px';
  }

  function hero(){
    stopGridObserver();
    if(timer){clearInterval(timer);timer=null}
    root.innerHTML='';
    activeMode=arcade.mode().id;activePerk=arcade.perk().id;if(activeMode==='campaign')diff=stageDiff();var b=getB(diff);
    var h=document.createElement('div');h.className='mm-screen';
    var diffsHtml='';
    Object.keys(DIFFS).forEach(function(k){
      var d=DIFFS[k];
      diffsHtml+='<button class="mm-df'+(diff===k?' sel':'')+'" data-d="'+k+'">'
        +'<span class="di">'+d.icon+'</span>'
        +'<span class="mm-df-tx"><span class="dl">'+d.label+'</span><span class="dd">'+d.tag+' &middot; '+d.pairs+' pairs</span></span>'
        +'</button>';
    });
    h.innerHTML='<div class="mm-hero-icon">🧠</div>'
      +'<h1 class="mm-hero-title">Memory Match</h1>'
      +'<p class="mm-hero-sub">50-stage memory campaign · '+activeMode.toUpperCase()+' · Stage '+campaignStage+'</p>'
      +(activeMode==='campaign'?'<div class="mm-stage-nav"><button data-stage="prev" aria-label="Previous stage">‹</button><div><small>Campaign stage</small><b>'+campaignStage+' / 50</b></div><button data-stage="next" aria-label="Next stage">›</button></div>':'')
      +'<div class="mm-dfs" role="radiogroup">'+diffsHtml+'</div>'
      +'<button class="mm-start">PLAY STAGE '+campaignStage+'</button><button class="mm-start" data-hq style="margin-top:8px;background:rgba(255,255,255,.06);box-shadow:none;font-size:11px">MODES & PERKS</button>'
      +(b?'<div class="mm-best">Best: '+b.score+' pts</div>':'')
      +'<div class="mm-toast"></div>';
    root.appendChild(h);
    h.querySelectorAll('.mm-df').forEach(function(btn){
      btn.addEventListener('click',function(){diff=btn.dataset.d;initA();sfxFlip();if(activeMode==='campaign'){var order=['easy','medium','hard','expert','master','insane'];var band=order.indexOf(diff);campaignStage=Math.min(50,band*8+1);host.storage.set('memory_campaign_stage',campaignStage).catch(function(){});}hero()});
    });
    h.querySelector('.mm-start').addEventListener('click',function(){play()});h.querySelector('[data-hq]').addEventListener('click',function(){arcade.openHub()});h.querySelectorAll('[data-stage]').forEach(function(btn){btn.addEventListener('click',function(){campaignStage=Math.max(1,Math.min(50,campaignStage+(btn.dataset.stage==='next'?1:-1)));host.storage.set('memory_campaign_stage',campaignStage).catch(function(){});hero()})});
  }

  function play(){
    stopGridObserver();
    initA();activeMode=arcade.mode().id;activePerk=arcade.perk().id;if(activeMode==='campaign')diff=stageDiff();var cfg=DIFFS[diff];
    total=cfg.pairs;matched=0;moves=0;score=0;combo=0;sec=0;flipped=[];locked=false;started=false;hintUsed=false;hintUses=activePerk==='hint'?3:1;countdown=activeMode==='blitz'?Math.max(35,100-cfg.pairs*2):0;arcade.record('start',1);
    if(timer){clearInterval(timer);timer=null}
    var ch=shuffle(EMOJIS).slice(0,cfg.pairs);cards=shuffle(ch.concat(ch));

    root.innerHTML='';
    var g=document.createElement('div');g.className='mm-game';

    var bar=document.createElement('div');bar.className='mm-bar';
    bar.innerHTML=''
      +'<div class="mm-stats">'
      +  '<div class="mm-stat"><div class="mm-si-icon mv">👆</div><div class="mm-st-text"><span class="mm-st-label">Moves</span><span class="mm-st-val" data-r="mv">0</span></div></div>'
      +  '<div class="mm-stat"><div class="mm-si-icon mt">✓</div><div class="mm-st-text"><span class="mm-st-label">Pairs</span><span class="mm-st-val" data-r="mt">0/'+cfg.pairs+'</span></div></div>'
      +  '<div class="mm-stat"><div class="mm-si-icon tm">⏱</div><div class="mm-st-text"><span class="mm-st-label">Time</span><span class="mm-st-val" data-r="tm">0:00</span></div></div>'
      +  '<div class="mm-stat"><div class="mm-si-icon sc">★</div><div class="mm-st-text"><span class="mm-st-label">Score</span><span class="mm-st-val" data-r="sc">0</span></div></div>'
      +'</div>'
      +'<button class="mm-help" title="How to play" aria-label="Help">?</button>';

    var gridWrap=document.createElement('div');gridWrap.className='mm-grid-wrap';
    var grid=document.createElement('div');grid.className='mm-grid';
    grid.style.gridTemplateColumns='repeat('+cfg.cols+',1fr)';
    grid.style.gridTemplateRows='repeat('+cfg.rows+',1fr)';grid.style.aspectRatio=cfg.cols+'/'+cfg.rows;grid.style.setProperty('--mm-cols',cfg.cols);grid.style.setProperty('--mm-rows',cfg.rows);
    grid.setAttribute('role','grid');
    cards.forEach(function(e,i){
      var c=document.createElement('div');c.className='mm-card entering';
      c.dataset.i=i;c.dataset.e=e;c.style.animationDelay=(i*30)+'ms';
      c.setAttribute('role','button');c.setAttribute('tabindex','0');c.setAttribute('aria-label','Card '+(i+1));
      c.innerHTML='<div class="mm-ci"><div class="mm-cf mm-cb"><div class="mm-cb-dots"></div><span class="mm-cb-q">?</span></div><div class="mm-cf mm-cfr"><span class="mm-emoji">'+e+'</span></div></div>';
      grid.appendChild(c);
    });
    gridWrap.appendChild(grid);

    var ctrls=document.createElement('div');ctrls.className='mm-ctrls';
    ctrls.innerHTML=''
      +'<button class="mm-ctrl sec" data-a="menu">Menu</button><button class="mm-ctrl sec" data-a="hint">Hint <span data-hints>'+hintUses+'</span></button>'
      +'<button class="mm-ctrl pri" data-a="restart">Restart</button>';

    var toastEl=document.createElement('div');toastEl.className='mm-toast';

    g.appendChild(bar);g.appendChild(gridWrap);g.appendChild(ctrls);
    root.appendChild(g);root.appendChild(toastEl);
    var scheduleFit=function(){requestAnimationFrame(function(){fitGrid(gridWrap,grid,cfg)})};
    scheduleFit();
    if(typeof ResizeObserver==='function'){gridObserver=new ResizeObserver(scheduleFit);gridObserver.observe(gridWrap)}else{window.addEventListener('resize',scheduleFit,{once:true})}

    grid.querySelectorAll('.mm-card').forEach(function(c){
      c.addEventListener('click',function(){click(c)});
      c.addEventListener('keydown',function(ev){if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();click(c)}});
    });
    ctrls.querySelector('[data-a="restart"]').addEventListener('click',function(){play()});ctrls.querySelector('[data-a="hint"]').addEventListener('click',function(){if(locked&&!started)return toast('Opening preview is still active','#67e8f9');if(hintUses<=0)return toast('No hints remaining','#fbbf24');var hidden=Array.from(grid.querySelectorAll('.mm-card:not(.ma):not(.fl)'));if(hidden.length<2)return;var first=hidden[Math.floor(Math.random()*hidden.length)],mate=hidden.find(function(x){return x!==first&&x.dataset.e===first.dataset.e});if(!mate)return;hintUses--;hintUsed=true;var count=ctrls.querySelector('[data-hints]');if(count)count.textContent=hintUses;first.classList.add('fl');mate.classList.add('fl');setTimeout(function(){first.classList.remove('fl');mate.classList.remove('fl')},activePerk==='hint'?1500:950);});
    ctrls.querySelector('[data-a="menu"]').addEventListener('click',function(){hero()});
    bar.querySelector('.mm-help').addEventListener('click',showHelp);if(activePerk==='preview'){locked=true;setTimeout(function(){grid.querySelectorAll('.mm-card').forEach(function(c){c.classList.add('fl')});setTimeout(function(){grid.querySelectorAll('.mm-card').forEach(function(c){c.classList.remove('fl')});locked=false},activeMode==='blitz'?700:1200)},200);}
  }

  function click(c){
    if(locked||c.classList.contains('fl')||c.classList.contains('ma')||flipped.length>=2||flipped.indexOf(c)>=0)return;
    if(!started){started=true;if(timer)clearInterval(timer);sec=0;timer=setInterval(function(){sec++;var el=root.querySelector('[data-r="tm"]');if(activeMode==='blitz'){countdown--;if(el)el.textContent=countdown+'s';if(countdown<=0){clearInterval(timer);timer=null;arcade.record('fail',1);toast('Time expired','#fb7185');setTimeout(hero,900)}}else if(el)el.textContent=fmt(sec)},1000)}
    initA();sfxFlip();c.classList.add('fl');c.setAttribute('aria-label','Card '+(parseInt(c.dataset.i,10)+1)+', '+c.dataset.e);flipped.push(c);
    if(flipped.length===2){
      moves++;upd();var a=flipped[0],b=flipped[1];
      if(a.dataset.e===b.dataset.e){
        locked=true;combo++;
        var bon=combo>=2?combo*50:0,ms=100+bon;
        score+=ms;matched++;arcade.record('pair',1);arcade.record('combo',combo);
        setTimeout(function(){
          a.classList.add('ma');b.classList.add('ma');
          sfxMatch();particles(a);particles(b);
          if(combo>=2){sfxCombo();toast(combo+'x Combo! +'+ms,'#FBBF24')}
          flipped=[];locked=false;upd();
          if(activeMode==='mist'&&matched%3===0){var un=Array.from(root.querySelectorAll('.mm-grid .mm-card:not(.ma):not(.fl)'));for(var mi=un.length-1;mi>0;mi--){var mj=Math.floor(Math.random()*(mi+1));var tmp=un[mi].style.order;un[mi].style.order=un[mj].style.order||mj;un[mj].style.order=tmp||mi;}toast('Memory mist shifted the field','#c084fc');}if(matched===total){if(timer){clearInterval(timer);timer=null}setTimeout(win,500)}
        },350);
      } else {
        combo=activePerk==='grace'?Math.max(0,combo-1):0;locked=true;sfxNo();
        setTimeout(function(){
          a.classList.add('sk');b.classList.add('sk');
          setTimeout(function(){
            a.classList.remove('fl','sk');b.classList.remove('fl','sk');
            a.setAttribute('aria-label','Card '+(parseInt(a.dataset.i,10)+1));
            b.setAttribute('aria-label','Card '+(parseInt(b.dataset.i,10)+1));
            flipped=[];locked=false;
          },450);
        },600);
      }
    }
  }

  function upd(){var m=root.querySelector('[data-r="mv"]'),p=root.querySelector('[data-r="mt"]'),s=root.querySelector('[data-r="sc"]');if(m)m.textContent=moves;if(p)p.textContent=matched+'/'+total;if(s)s.textContent=score}

  function win(){
    arcade.record('level',1);arcade.record('win',1);var tb=Math.max(0,300-sec*2),eb=Math.max(0,(total*3-moves)*25);score+=tb+eb;
    var st=stars(moves,total),nb=!getB(diff)||score>getB(diff).score;
    saveB(diff,{score:score,moves:moves,time:sec});if(activeMode==='campaign'){campaignStage=Math.min(50,campaignStage+1);host.storage.set('memory_campaign_stage',campaignStage).catch(function(){});}
    root.innerHTML='';
    var v=document.createElement('div');v.className='mm-vic';
    v.innerHTML='<div class="mm-vm">'
      +'<h2 class="mm-vt">'+(nb?'New Record!':'You Won!')+'</h2>'
      +'<p class="mm-vs">'+(nb?'New personal best!':'All pairs matched!')+'</p>'
      +'<div class="mm-vst">'+starHTML(st)+'</div>'
      +'<div class="mm-vsa">'
      +  '<div class="mm-vsi"><div class="mm-vsl">Moves</div><div class="mm-vsv">'+moves+'</div></div>'
      +  '<div class="mm-vsi"><div class="mm-vsl">Time</div><div class="mm-vsv">'+fmt(sec)+'</div></div>'
      +  '<div class="mm-vsi"><div class="mm-vsl">Score</div><div class="mm-vsv" style="color:#EC4899">'+score+'</div></div>'
      +  '<div class="mm-vsi"><div class="mm-vsl">Best</div><div class="mm-vsv" style="color:#FBBF24">'+(getB(diff)?getB(diff).score:score)+'</div></div>'
      +'</div>'
      +'<div class="mm-vb">'
      +  '<button class="mm-vbtn sec" data-a="menu">Menu</button>'
      +  '<button class="mm-vbtn pri" data-a="replay">'+(activeMode==='campaign'?'Next Stage':'Play Again')+'</button>'
      +'</div></div><div class="mm-toast"></div>';
    root.appendChild(v);sfxWin();confetti();
    v.querySelector('[data-a="menu"]').addEventListener('click',function(){hero()});
    v.querySelector('[data-a="replay"]').addEventListener('click',function(){play()});
  }

  return {
    mount: function(container){
      root=document.createElement('div');root.className='mm-r';
      container.innerHTML='';container.appendChild(root);
      arcade.mount(root, container);
      Promise.all([host.storage.get('bestScores').catch(function(){}),host.storage.get('memory_campaign_stage').catch(function(){}) ,arcade.ready]).then(function(v){if(v[0]&&typeof v[0]==='object')best=v[0];if(typeof v[1]==='number')campaignStage=Math.max(1,Math.min(50,v[1]));activeMode=arcade.mode().id;activePerk=arcade.perk().id;hero()});
    },
    unmount: function(){stopGridObserver();removeArcadeChange?.();arcade.cleanup();if(timer){clearInterval(timer);timer=null};if(audio){audio.close().catch(function(){});audio=null}}
  };
}
