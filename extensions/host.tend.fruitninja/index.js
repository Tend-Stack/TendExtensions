import { createArcade, setTimeout, clearTimeout, setInterval, clearInterval, requestAnimationFrame, cancelAnimationFrame } from './arcade-kit.js';
var STYLE_ID = 'tend-ext-fruitninja-styles-v220';

var FRUIT_TYPES = [
  { name: 'watermelon', color: '#22C55E', innerColor: '#166534', highlight: '#EF4444', size: 28, weight: 1.3 },
  { name: 'orange', color: '#F97316', innerColor: '#C2410C', highlight: '#FED7AA', size: 22, weight: 1.1 },
  { name: 'apple', color: '#EF4444', innerColor: '#B91C1C', highlight: '#FEF08A', size: 20, weight: 1.0 },
  { name: 'strawberry', color: '#EC4899', innerColor: '#BE185D', highlight: '#FBCFE8', size: 17, weight: 0.9 },
  { name: 'banana', color: '#EAB308', innerColor: '#A16207', highlight: '#FEF9C3', size: 16, weight: 0.95 },
  { name: 'grape', color: '#A855F7', innerColor: '#7E22CE', highlight: '#DDD6FE', size: 15, weight: 0.85 }
];

var BOMB_COLOR = '#1F2937';
var BOMB_FUSE_COLOR = '#F97316';
var BOMB_SIZE = 22;
var GRAVITY = 0.5;
var SPAWN_MIN_INTERVAL = 650;
var SPAWN_MAX_INTERVAL = 1500;
var MIN_FRUITS_PER_WAVE = 3;
var MAX_FRUITS_PER_WAVE = 6;
var GAME_DURATION = 60;
var CRITICAL_RATIO = 0.35;
var COMBO_BONUS_3 = 3;
var COMBO_BONUS_5 = 5;
var CRITICAL_BONUS = 5;

function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return;
  var s = document.createElement('style'); s.id = STYLE_ID;
  s.textContent = [
    '@keyframes fnFadeIn{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}',
    '@keyframes fnPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}',
    '@keyframes fnFloatUp{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-40px)}}',
    '@keyframes fnShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-3px)}40%{transform:translateX(3px)}60%{transform:translateX(-2px)}80%{transform:translateX(2px)}}',
    '.fn-r{width:100%;height:100%;display:flex;flex-direction:column;overflow:hidden;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;user-select:none;-webkit-user-select:none;background:#0a0a0f;color:#E2E8F0;position:relative}',
    '.fn-canvas{position:absolute;inset:0;z-index:1}',
    '.fn-hud{position:absolute;top:0;left:0;right:0;display:flex;align-items:center;justify-content:space-between;padding:10px 14px;z-index:10;pointer-events:none;gap:6px}',
    '.fn-hud-item{background:rgba(0,0,0,.45);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:6px 12px;text-align:center;min-width:52px}',
    '.fn-hud-label{font-size:8px;text-transform:uppercase;letter-spacing:1.2px;color:#64748B;font-weight:700}',
    '.fn-hud-val{font-size:18px;font-weight:900;font-variant-numeric:tabular-nums;line-height:1.1;color:#fff}',
    '.fn-hud-val.co{color:#FBBF24}',
    '.fn-hud-val.bs{color:#F97316}',
    '.fn-hud-val.tm{color:#3B82F6}',
    '.fn-hud-combo{position:absolute;top:60px;left:50%;transform:translateX(-50%);font-size:14px;font-weight:800;color:#FBBF24;text-shadow:0 0 12px rgba(251,191,36,.5);z-index:10;pointer-events:none;animation:fnPulse .4s ease-in-out;letter-spacing:.5px}',
    '.fn-overlay{position:absolute;inset:0;background:rgba(0,0,0,.8);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;z-index:60;padding:14px;animation:fnFadeIn .25s ease}',
    '.fn-modal{background:linear-gradient(180deg,#1A1F35,#15192a);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:24px 20px;text-align:center;max-width:300px;width:100%;box-shadow:0 20px 50px rgba(0,0,0,.6)}',
    '.fn-modal h2{font-size:22px;font-weight:900;margin:0 0 4px}',
    '.fn-modal .fn-m-sub{color:#94A3B8;font-size:13px;margin:0 0 14px}',
    '.fn-m-stats{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:8px 0 14px}',
    '.fn-msi{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:8px}',
    '.fn-msil{font-size:10px;color:#94A3B8;font-weight:600;text-transform:uppercase;letter-spacing:1px}',
    '.fn-msiv{font-size:18px;font-weight:900;color:#fff;margin-top:2px}',
    '.fn-msiv.rec{color:#FBBF24}',
    '.fn-mb{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}',
    '.fn-mbtn{padding:10px 22px;border-radius:10px;border:none;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .15s;letter-spacing:.3px}',
    '.fn-mbtn:hover{transform:translateY(-1px)}',
    '.fn-mbtn.pri{background:linear-gradient(135deg,#EF4444,#F97316);color:#fff;box-shadow:0 4px 18px rgba(239,68,68,.4)}',
    '.fn-mbtn.sec{background:rgba(255,255,255,.06);color:#E2E8F0;border:1px solid rgba(255,255,255,.1)}',
    '.fn-mbtn.sm{padding:6px 14px;font-size:11px}',
    '.fn-mode-select{display:flex;gap:6px;justify-content:center;margin-bottom:14px}',
    '.fn-mode-btn{padding:8px 16px;border-radius:8px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);color:#94A3B8;cursor:pointer;font-size:12px;font-weight:700;font-family:inherit;transition:all .15s}',
    '.fn-mode-btn.sel{border-color:#F97316;background:rgba(249,115,22,.15);color:#F97316;box-shadow:0 0 8px rgba(249,115,22,.2)}',
    '.fn-mode-btn:hover{background:rgba(255,255,255,.08)}',
    '.fn-start-title{font-size:36px;font-weight:900;margin:0 0 4px;background:linear-gradient(135deg,#EF4444,#22C55E);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}',
    '.fn-start-sub{font-size:12px;color:#64748B;margin:0 0 18px;font-weight:600}',
    '.fn-help{position:absolute;top:10px;right:10px;width:30px;height:30px;border-radius:8px;border:1px solid rgba(255,255,255,.15);background:rgba(0,0,0,.45);color:#94A3B8;cursor:pointer;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:15px;font-family:inherit;z-index:15;transition:all .15s;backdrop-filter:blur(4px)}',
    '.fn-help:hover{background:rgba(255,255,255,.12);color:#fff}',
    '.fn-help-modal{position:absolute;inset:0;background:rgba(0,0,0,.75);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;z-index:50;padding:14px;animation:fnFadeIn .2s ease}',
    '.fn-help-box{background:linear-gradient(180deg,#1A1F35,#15192a);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:18px;max-width:320px;width:100%;box-shadow:0 16px 50px rgba(0,0,0,.55)}',
    '.fn-help-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}',
    '.fn-help-title{font-size:16px;font-weight:800;color:#fff;margin:0}',
    '.fn-help-close{width:26px;height:26px;border-radius:7px;border:none;background:rgba(255,255,255,.06);color:#94A3B8;cursor:pointer;font-size:16px;line-height:1;font-family:inherit;transition:all .15s}',
    '.fn-help-close:hover{background:rgba(255,255,255,.12);color:#fff}',
    '.fn-help-body{font-size:12px;line-height:1.5;color:#CBD5E1}',
    '.fn-help-body h3{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#94A3B8;margin:12px 0 4px;font-weight:700}',
    '.fn-help-body h3:first-child{margin-top:0}',
    '.fn-help-body ul{margin:0;padding-left:16px}',
    '.fn-help-body li{margin:2px 0}',
    '.fn-pause{position:absolute;inset:0;background:rgba(0,0,0,.55);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;z-index:40;font-size:48px;font-weight:900;color:rgba(255,255,255,.2);animation:fnFadeIn .15s ease}',
      '.fn-r{background:radial-gradient(circle at 50% 20%,rgba(20,83,45,.18),transparent 32%),linear-gradient(180deg,#07110d,#020605)}.fn-hud-item{background:rgba(3,12,8,.62);border-color:rgba(134,239,172,.13);box-shadow:0 8px 24px rgba(0,0,0,.2)}@media(min-width:768px){.tend-floating-window.tend-game-focus .tend-arcade-root.fn-r{width:min(1180px,calc(100dvw - 36px))!important;height:min(920px,calc(100dvh - 36px))!important}.tend-floating-window.tend-game-focus .fn-hud{padding:16px 22px}.tend-floating-window.tend-game-focus .fn-hud-item{min-width:100px;padding:8px 18px}.tend-floating-window.tend-game-focus .fn-hud-val{font-size:24px}}@media(max-width:767px){.fn-hud{padding:max(8px,env(safe-area-inset-top)) 8px 8px;gap:4px}.fn-hud-item{padding:5px 7px;min-width:0;flex:1}.fn-hud-val{font-size:16px}.fn-help{top:max(8px,env(safe-area-inset-top));right:8px}.fn-modal{max-height:calc(100dvh - 28px);overflow:auto}}',
].join('');
  document.head.appendChild(s);
}

function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e }

export default function activate(host) {
  const arcade = createArcade(host, {"name":"Fruit Slash Odyssey","icon":"🍉","subtitle":"Wave-based slicing with blades, bosses, and missions","modes":[{"id":"arcade","name":"Arcade","icon":"⚔","desc":"Timed waves, combos, and boss fruit","unlock":1},{"id":"survival","name":"Survival","icon":"❤","desc":"Three misses and rising bomb pressure","unlock":3},{"id":"zen","name":"Zen","icon":"☯","desc":"No bombs; chase perfect technique","unlock":5}],"perks":[{"id":"shield","name":"Bomb Guard","icon":"🛡","desc":"Survive the first bomb hit","unlock":1},{"id":"combo","name":"Combo Grace","icon":"🔥","desc":"Longer window between slices","unlock":3},{"id":"critical","name":"Sharp Edge","icon":"✦","desc":"More critical fruit cuts","unlock":6}],"missions":[{"event":"fruit","target":160,"title":"Juice Master","detail":"Slice 160 fruit","icon":"🍉","reward":90},{"event":"combo","target":45,"title":"Combo Chef","detail":"Build 45 combo points","icon":"🔥","reward":105},{"event":"level","target":6,"title":"Wave Rider","detail":"Clear six waves","icon":"🌊","reward":120}]});

  ensureStyles();
  var root = null, canvas = null, ctx = null;
  var renderScale=1,resizeObserver=null,removeArcadeChange=null;
  var bestScore = 0, audio = null, animId = null, lastTime = 0;
  var dpr = 1, cw = 0, ch = 0;
  var mode = 'timed';
  var gameState = 'start';
  var score = 0, best = 0, timeLeft = GAME_DURATION, timeElapsed = 0;
  var fruits = [], bombs = [], particles = [], scorePopups = [], trail = [], missedMarks = [];
  var spawnTimer = 0, spawnDelay = 1500, waveCount = 0, bombsSpawned = 0;
  var isSlashing = false, comboCount = 0, comboWindow = 0, maxCombo = 0, fruitsSlashed = 0;
  var shakeT = 0, shakeA = 0;
  var bombCount = 0;
  var lastTrailPoint = null;
  var stars = [];
  var activeMode='arcade',activePerk='shield',shieldUsed=false,misses=0,bosses=0;

  arcade.ready.then(function(){activeMode=arcade.mode().id;activePerk=arcade.perk().id;});

  host.storage.get('fruitninja_best').then(function (v) { if (typeof v === 'number') { bestScore = v; best = v } }).catch(function () { });

  function initA() { if (!audio) try { audio = new (window.AudioContext || window.webkitAudioContext)() } catch (e) { } }
  function resA() { if (audio && audio.state === 'suspended') audio.resume() }
  function tone(f, d, t, v) {
    if (!audio) return; resA(); try {
      var o = audio.createOscillator(), g = audio.createGain();
      o.type = t || 'sine'; o.frequency.setValueAtTime(f, audio.currentTime);
      g.gain.setValueAtTime(v || 0.07, audio.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + d);
      o.connect(g); g.connect(audio.destination); o.start(); o.stop(audio.currentTime + d);
    } catch (e) { }
  }
  function noise(dur, vol) {
    if (!audio) return; resA(); try {
      var buf = audio.createBuffer(1, audio.sampleRate * dur, audio.sampleRate);
      var data = buf.getChannelData(0);
      for (var i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * vol;
      var src = audio.createBufferSource(), g = audio.createGain();
      src.buffer = buf; g.gain.setValueAtTime(vol || 0.06, audio.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + dur);
      src.connect(g); g.connect(audio.destination); src.start(); src.stop(audio.currentTime + dur);
    } catch (e) { }
  }

  function sfxSlash() { noise(0.08, 0.06); tone(1200, 0.04, 'sine', 0.03); }
  function sfxFruitSplit() { tone(800, 0.06, 'triangle', 0.07); setTimeout(function () { tone(600, 0.08, 'triangle', 0.05) }, 30) }
  function sfxCombo() { tone(660, 0.05, 'sine', 0.06); setTimeout(function () { tone(880, 0.05, 'sine', 0.06) }, 60); setTimeout(function () { tone(1100, 0.08, 'sine', 0.06) }, 110) }
  function sfxCritical() { tone(900, 0.04, 'square', 0.05); setTimeout(function () { tone(1200, 0.06, 'square', 0.04) }, 40); setTimeout(function () { tone(1600, 0.06, 'square', 0.04) }, 80) }
  function sfxBombExplosion() { noise(0.3, 0.12); tone(80, 0.25, 'sawtooth', 0.08); tone(50, 0.35, 'sawtooth', 0.06); }
  function sfxFruitMiss() { tone(200, 0.1, 'sine', 0.03); }
  function sfxGameOver() { tone(200, 0.15, 'sawtooth', 0.04); setTimeout(function () { tone(140, 0.2, 'sawtooth', 0.03) }, 120); setTimeout(function () { tone(90, 0.3, 'sawtooth', 0.03) }, 260) }

  function resizeCanvas() {
    if (!canvas || !root) return;
    var rect = root.getBoundingClientRect();
    var oldW=cw||rect.width,oldH=ch||rect.height,oldScale=renderScale||1;
    dpr = window.devicePixelRatio || 1;
    cw = Math.max(1,rect.width); ch = Math.max(1,rect.height);
    renderScale=Math.max(.9,Math.min(1.7,Math.sqrt((cw*ch)/(480*680))));
    if(oldW>1&&oldH>1&&(Math.abs(oldW-cw)>1||Math.abs(oldH-ch)>1)){
      var sx=cw/oldW,sy=ch/oldH,ss=renderScale/oldScale;
      fruits.forEach(function(f){f.x*=sx;f.y*=sy;f.size*=ss;f.vx*=ss;f.vy*=ss});
      bombs.forEach(function(b){b.x*=sx;b.y*=sy;b.vx*=ss;b.vy*=ss});
      particles.forEach(function(p){p.x*=sx;p.y*=sy;p.vx*=ss;p.vy*=ss;p.radius*=ss});
      trail.forEach(function(p){p.x*=sx;p.y*=sy});
      scorePopups.forEach(function(p){p.x*=sx;p.y*=sy});
    }
    canvas.width = Math.round(cw * dpr); canvas.height = Math.round(ch * dpr);
    canvas.style.width = cw + 'px'; canvas.style.height = ch + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    generateStars();
  }

  function bombSize(){return BOMB_SIZE*renderScale}

  function generateStars() {
    stars = [];
    for (var i = 0; i < 50; i++) {
      stars.push({ x: Math.random() * cw, y: Math.random() * ch, r: Math.random() * 1.3 + 0.2, a: Math.random() * 0.3 + 0.1, flicker: Math.random() * 0.5 + 0.5 });
    }
  }

  function drawBackground() {
    var grad = ctx.createLinearGradient(0, 0, 0, ch);
    grad.addColorStop(0, '#07130e');
    grad.addColorStop(0.48, '#07100d');
    grad.addColorStop(1, '#020605');
    ctx.fillStyle = grad;ctx.fillRect(0,0,cw,ch);
    var aura=ctx.createRadialGradient(cw*.5,ch*.22,10,cw*.5,ch*.22,Math.max(cw,ch)*.58);
    aura.addColorStop(0,'rgba(251,146,60,.13)');aura.addColorStop(.42,'rgba(34,197,94,.055)');aura.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=aura;ctx.fillRect(0,0,cw,ch);
    ctx.fillStyle='rgba(251,191,36,.08)';ctx.beginPath();ctx.arc(cw*.5,ch*.18,Math.min(cw,ch)*.105,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='rgba(74,222,128,.055)';ctx.lineWidth=Math.max(8,14*renderScale);
    for(var bi=0;bi<7;bi++){var bx=(bi/6)*cw+Math.sin(bi*2.1)*20;ctx.beginPath();ctx.moveTo(bx,ch);ctx.quadraticCurveTo(bx+18,ch*.58,bx-8,ch*.05);ctx.stroke()}
    ctx.fillStyle='rgba(2,6,5,.72)';ctx.beginPath();ctx.moveTo(0,ch*.88);for(var mx=0;mx<=cw;mx+=Math.max(70,cw/10)){ctx.lineTo(mx,ch*(.82+.04*Math.sin(mx*.017)))}ctx.lineTo(cw,ch);ctx.lineTo(0,ch);ctx.fill();
    for (var i = 0; i < stars.length; i++) {var st=stars[i];ctx.fillStyle='rgba(253,230,138,'+(st.a*st.flicker*.48)+')';ctx.beginPath();ctx.arc(st.x,st.y,st.r,0,Math.PI*2);ctx.fill()}
  }

  function drawFruit(f) {
    var r=f.size, rot=f.rotation||0;
    ctx.save();ctx.translate(f.x,f.y);ctx.rotate(rot);ctx.shadowBlur=f.boss?26:14;ctx.shadowColor=f.type.color;ctx.lineJoin='round';
    function leaf(x,y,ang,scale){ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.scale(scale||1,scale||1);ctx.fillStyle='#3f9b45';ctx.beginPath();ctx.ellipse(0,0,8,4,0,0,Math.PI*2);ctx.fill();ctx.restore()}
    if(f.type.name==='watermelon'){
      var g=ctx.createRadialGradient(-r*.28,-r*.3,2,0,0,r*1.2);g.addColorStop(0,'#86efac');g.addColorStop(.5,'#22c55e');g.addColorStop(1,'#075b2a');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(0,0,r*1.08,r*.92,0,0,Math.PI*2);ctx.fill();ctx.save();ctx.clip();ctx.strokeStyle='rgba(5,70,35,.58)';ctx.lineWidth=3;for(var q=-2;q<=2;q++){ctx.beginPath();ctx.moveTo(q*r*.36,-r);ctx.quadraticCurveTo(q*r*.18,r*.1,q*r*.34,r);ctx.stroke()}ctx.restore();
    }else if(f.type.name==='orange'){
      var og=ctx.createRadialGradient(-r*.32,-r*.35,1,0,0,r);og.addColorStop(0,'#fed7aa');og.addColorStop(.28,'#fb923c');og.addColorStop(1,'#c2410c');ctx.fillStyle=og;ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(120,55,10,.28)';for(var oi=0;oi<18;oi++){var oa=oi*2.399,or=r*(.2+(oi%5)/7);ctx.beginPath();ctx.arc(Math.cos(oa)*or,Math.sin(oa)*or,1,0,Math.PI*2);ctx.fill()}leaf(3,-r+1,-.4,.8);
    }else if(f.type.name==='apple'){
      var ag=ctx.createLinearGradient(-r,-r,r,r);ag.addColorStop(0,'#fca5a5');ag.addColorStop(.42,'#ef4444');ag.addColorStop(1,'#991b1b');ctx.fillStyle=ag;ctx.beginPath();ctx.moveTo(0,-r*.72);ctx.bezierCurveTo(-r*.25,-r*1.05,-r*.92,-r*.78,-r*.88,-r*.08);ctx.bezierCurveTo(-r*.82,r*.72,-r*.28,r*1.03,0,r*.84);ctx.bezierCurveTo(r*.28,r*1.03,r*.82,r*.72,r*.88,-r*.08);ctx.bezierCurveTo(r*.92,-r*.78,r*.25,-r*1.05,0,-r*.72);ctx.fill();ctx.strokeStyle='#5b2b16';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,-r*.68);ctx.lineTo(2,-r*1.12);ctx.stroke();leaf(6,-r*.9,.25,.85);
    }else if(f.type.name==='strawberry'){
      var sg=ctx.createLinearGradient(0,-r,0,r);sg.addColorStop(0,'#fb7185');sg.addColorStop(1,'#be123c');ctx.fillStyle=sg;ctx.beginPath();ctx.moveTo(0,r);ctx.bezierCurveTo(-r*.9,r*.24,-r*.88,-r*.72,0,-r*.82);ctx.bezierCurveTo(r*.88,-r*.72,r*.9,r*.24,0,r);ctx.fill();ctx.fillStyle='#fde68a';for(var si=0;si<10;si++){var sy=-r*.45+(si%4)*r*.35,sx=((si*7)%5-2)*r*.25;ctx.beginPath();ctx.ellipse(sx,sy,1.2,2,.2,0,Math.PI*2);ctx.fill()}for(var li=0;li<5;li++)leaf(0,-r*.75,li*Math.PI*.4, .65);
    }else if(f.type.name==='banana'){
      ctx.strokeStyle='#facc15';ctx.lineWidth=r*.72;ctx.lineCap='round';ctx.beginPath();ctx.arc(-r*.15,-r*.05,r*.95,-.75,1.15);ctx.stroke();ctx.strokeStyle='#fde68a';ctx.lineWidth=r*.34;ctx.beginPath();ctx.arc(-r*.15,-r*.05,r*.95,-.75,1.15);ctx.stroke();ctx.fillStyle='#854d0e';ctx.beginPath();ctx.arc(r*.62,r*.72,2.4,0,Math.PI*2);ctx.fill();
    }else{
      var grapeR=r*.42;var pts=[[-.45,-.5],[0,-.65],[.45,-.5],[-.65,-.05],[-.2,-.05],[.25,-.05],[.65,-.05],[-.4,.38],[.08,.4],[.42,.36],[0,.78]];for(var gi=0;gi<pts.length;gi++){var gg=ctx.createRadialGradient(pts[gi][0]*r-grapeR*.25,pts[gi][1]*r-grapeR*.3,1,pts[gi][0]*r,pts[gi][1]*r,grapeR);gg.addColorStop(0,'#ddd6fe');gg.addColorStop(.28,'#a855f7');gg.addColorStop(1,'#581c87');ctx.fillStyle=gg;ctx.beginPath();ctx.arc(pts[gi][0]*r,pts[gi][1]*r,grapeR,0,Math.PI*2);ctx.fill()}leaf(2,-r*.9,-.5,.9);
    }
    ctx.fillStyle='rgba(255,255,255,.25)';ctx.beginPath();ctx.ellipse(-r*.28,-r*.35,r*.22,r*.12,-.6,0,Math.PI*2);ctx.fill();if(f.boss){ctx.strokeStyle='#fbbf24';ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,r*1.18,0,Math.PI*2);ctx.stroke()}ctx.restore();
  }

  function drawBomb(b) {
    var r = bombSize();
    ctx.save();
    ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 20;
    var grad = ctx.createRadialGradient(b.x - r * 0.3, b.y - r * 0.3, r * 0.05, b.x, b.y, r);
    grad.addColorStop(0, '#4B5563');
    grad.addColorStop(0.6, BOMB_COLOR);
    grad.addColorStop(1, '#030712');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(b.x, b.y, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#374151'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#111827';
    ctx.beginPath(); ctx.arc(b.x, b.y, r * 0.28, 0, Math.PI * 2); ctx.fill();
    var ftop = b.y - r - 2;
    ctx.strokeStyle = BOMB_FUSE_COLOR; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(b.x, b.y - r + 2);
    ctx.quadraticCurveTo(b.x + 4, ftop - 6, b.x - 2, ftop - 2);
    ctx.quadraticCurveTo(b.x - 4, ftop - 8, b.x + 1, ftop - 6);
    ctx.stroke();
    var sparkR = 4 + Math.sin(b.sparkPhase || 0) * 2;
    var sparkGrad = ctx.createRadialGradient(b.x - 2, ftop - 6, 0, b.x - 2, ftop - 6, sparkR);
    sparkGrad.addColorStop(0, '#FEF08A');
    sparkGrad.addColorStop(0.4, BOMB_FUSE_COLOR);
    sparkGrad.addColorStop(1, 'rgba(249,115,22,0)');
    ctx.fillStyle = sparkGrad;
    ctx.beginPath(); ctx.arc(b.x - 2, ftop - 6, sparkR, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function drawMissedMark(m) {
    ctx.save();
    ctx.globalAlpha = m.alpha;
    ctx.strokeStyle = 'rgba(239,68,68,' + m.alpha + ')';
    ctx.lineWidth = 2;
    ctx.beginPath();
    var s = m.size || 10;
    ctx.moveTo(m.x - s, m.y - s); ctx.lineTo(m.x + s, m.y + s);
    ctx.moveTo(m.x + s, m.y - s); ctx.lineTo(m.x - s, m.y + s);
    ctx.stroke();
    ctx.restore();
  }

  function spawnParticles(x, y, color, count, power) {
    for (var i = 0; i < count; i++) {
      var ang = Math.random() * Math.PI * 2;
      var spd = (Math.random() * 3 + 1) * (power || 1);
      particles.push({
        x: x, y: y, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd - 2,
        color: color, radius: Math.random() * 3 + 1.5, alpha: 1, life: 1
      });
    }
  }

  function addScorePopup(x, y, text, color) {
    scorePopups.push({ x: x, y: y, text: text, color: color || '#fff', alpha: 1, vy: -1.5 });
  }

  function spawnFruit(typeIdx) {
    var type = FRUIT_TYPES[typeIdx !== undefined ? typeIdx : Math.floor(Math.random() * FRUIT_TYPES.length)];
    var size=type.size*renderScale;
    var margin = size * 2;
    var x = margin + Math.random() * (cw - margin * 2);
    var vx = (Math.random() - 0.5) * 5;
    var vy = -(12 + Math.random() * 6) * (1 / type.weight)*renderScale;vx*=renderScale;
    return { x: x, y: ch + size, vx: vx, vy: vy, type: type, size: size, rotation: Math.random() * Math.PI,
      alive: true, wasSlashed: false, slashedByCombo: false, spawnTime: Date.now(),hp:1,boss:false };
  }

  function spawnBomb() {
    var bs=bombSize();
    var margin = bs * 2;
    var x = margin + Math.random() * (cw - margin * 2);
    var vx = (Math.random() - 0.5) * 5;
    var vy = -(12 + Math.random() * 6)*renderScale;vx*=renderScale;
    return { x: x, y: ch + bs, vx: vx, vy: vy, alive: true, sparkPhase: 0 };
  }

  function spawnWave() {
    var bonus=Math.min(3,Math.max(0,Math.floor((cw-600)/260)));
    var count = MIN_FRUITS_PER_WAVE + bonus + Math.floor(Math.random() * (MAX_FRUITS_PER_WAVE - MIN_FRUITS_PER_WAVE + 1));
    for (var i = 0; i < count; i++) fruits.push(spawnFruit());
    waveCount++;arcade.record('level',waveCount%5===0?1:0);
    if(waveCount%5===0){var boss=spawnFruit();boss.boss=true;boss.hp=3;boss.size*=1.65;boss.vy*=.8;fruits.push(boss);bosses++;arcade.showToast('👑','Boss fruit','Three clean cuts before it falls.');}
    if (activeMode!=='zen' && waveCount % (activeMode==='survival'?2:3) === 0 && bombsSpawned < 3 + waveCount / 2) {
      bombs.push(spawnBomb()); bombsSpawned++;
    }
  }

  function hitFruit(fruit, trailPoint) {
    if (!fruit.alive) return;
    if(fruit.hp>1){fruit.hp--;spawnParticles(fruit.x,fruit.y,'#fbbf24',12,1.2);addScorePopup(fruit.x,fruit.y,'BOSS '+fruit.hp+'','#fbbf24');sfxCritical();return;}
    fruit.alive = false;
    fruit.wasSlashed = true;
    fruitsSlashed++;arcade.record('fruit',1);
    var crit = false;
    var dx = fruit.x - trailPoint.x, dy = fruit.y - trailPoint.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < fruit.size * (activePerk==='critical'?CRITICAL_RATIO*1.45:CRITICAL_RATIO)) crit = true;
    spawnParticles(fruit.x, fruit.y, fruit.type.color, 18, crit ? 1.8 : 1);
    spawnParticles(fruit.x, fruit.y, fruit.type.highlight, 8, crit ? 1.5 : 1);
    if (crit) {
      spawnParticles(fruit.x, fruit.y, '#FBBF24', 12, 2);
      comboCount++;
      score += CRITICAL_BONUS;
      addScorePopup(fruit.x, fruit.y, '+5 CRIT', '#FBBF24');
      sfxCritical();
    } else {
      score++;
      addScorePopup(fruit.x, fruit.y, '+' + 1, '#fff');
      sfxFruitSplit();
    }
    comboWindow = activePerk==='combo'?720:400;arcade.record('combo',Math.max(1,comboCount));arcade.record('score',crit?CRITICAL_BONUS:1);
  }

  function hitBomb(bomb) {
    if (!bomb.alive) return;
    bomb.alive = false;
    bombCount++;if(activePerk==='shield'&&!shieldUsed){shieldUsed=true;spawnParticles(bomb.x,bomb.y,'#67e8f9',28,1.8);arcade.showToast('🛡','Bomb guard','The first bomb was neutralized.');return;}
    spawnParticles(bomb.x, bomb.y, BOMB_FUSE_COLOR, 30, 2);
    spawnParticles(bomb.x, bomb.y, '#EF4444', 20, 1.5);
    spawnParticles(bomb.x, bomb.y, '#111827', 15, 1);
    sfxBombExplosion();
    shakeT = 300;
    shakeA = 8;
    endGame();
  }

  function checkSlashCollisions() {
    if (trail.length < 2) return;
    for (var i = 0; i < trail.length; i++) {
      var tp = trail[i];
      for (var j = 0; j < fruits.length; j++) {
        var f = fruits[j];
        if (!f.alive || f.wasSlashed) continue;
        var dx = f.x - tp.x, dy = f.y - tp.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < f.size + 6) {
          f.slashedByCombo = true;
          hitFruit(f, tp);
        }
      }
      for (var k = 0; k < bombs.length; k++) {
        var b = bombs[k];
        if (!b.alive) continue;
        var bdx = b.x - tp.x, bdy = b.y - tp.y;
        if (Math.sqrt(bdx * bdx + bdy * bdy) < bombSize() + 4) {
          hitBomb(b);
          return;
        }
      }
    }
  }

  function update(dt) {
    var ndt = Math.min(dt / 16.667, 4);
    if (spawnTimer > 0) {
      spawnTimer -= dt;
    } else {
      spawnWave();
      spawnTimer = SPAWN_MIN_INTERVAL + Math.random() * (SPAWN_MAX_INTERVAL - SPAWN_MIN_INTERVAL);
    }
    for (var i = fruits.length - 1; i >= 0; i--) {
      var f = fruits[i];
      if (!f.alive && f.wasSlashed) continue;
      f.vy += GRAVITY * f.type.weight * ndt;
      f.x += f.vx * ndt;
      f.y += f.vy * ndt;
      f.rotation += 0.02 * ndt;
      if (!f.alive) {
        if (f.wasSlashed) {
          f.y += 1 * ndt;
          if (f.y > ch + 50) fruits.splice(i, 1);
        }
        continue;
      }
      if (f.y > ch + f.size + 20) {
        if (!f.wasSlashed && gameState === 'playing') {
          missedMarks.push({ x: f.x, y: ch - 20, alpha: 1, size: 8 });
          sfxFruitMiss();misses++;if(activeMode==='survival'&&misses>=3){arcade.showToast('✕','Three misses','The survival run is over.');endGame();return;}
        }
        fruits.splice(i, 1);
      }
    }
    for (var j = bombs.length - 1; j >= 0; j--) {
      var b = bombs[j];
      if (!b.alive) continue;
      b.vy += GRAVITY * ndt;
      b.x += b.vx * ndt;
      b.y += b.vy * ndt;
      b.sparkPhase = (b.sparkPhase || 0) + 0.08 * ndt;
      if (b.y > ch + bombSize() + 30) { bombs.splice(j, 1) }
    }
    for (var k = particles.length - 1; k >= 0; k--) {
      var p = particles[k];
      p.vy += GRAVITY * ndt * 0.8;
      p.x += p.vx * ndt;
      p.y += p.vy * ndt;
      p.life -= 0.015 * ndt;
      p.alpha = Math.max(0, p.life);
      if (p.life <= 0) particles.splice(k, 1);
    }
    for (var l = scorePopups.length - 1; l >= 0; l--) {
      var sp = scorePopups[l];
      sp.y += sp.vy * ndt;
      sp.alpha -= 0.012 * ndt;
      if (sp.alpha <= 0) scorePopups.splice(l, 1);
    }
    for (var m = missedMarks.length - 1; m >= 0; m--) {
      missedMarks[m].alpha -= 0.018 * ndt;
      if (missedMarks[m].alpha <= 0) missedMarks.splice(m, 1);
    }
    if (comboWindow > 0) {
      comboWindow -= dt;
      if (comboWindow <= 0) {
        if (comboCount >= 5) { score += comboCount * COMBO_BONUS_5; addScorePopup(cw / 2, ch / 2, '+' + (comboCount * COMBO_BONUS_5) + ' MEGA!', '#FBBF24'); sfxCombo() }
        else if (comboCount >= 3) { score += comboCount * COMBO_BONUS_3; addScorePopup(cw / 2, ch / 2, '+' + (comboCount * COMBO_BONUS_3) + ' COMBO', '#F97316'); sfxCombo() }
        if (comboCount > maxCombo) maxCombo = comboCount;
        comboCount = 0;
      }
    }
    if (shakeT > 0) { shakeT -= dt; if (shakeT < 0) shakeT = 0 }
    if (gameState === 'playing' && activeMode === 'arcade') {
      timeElapsed += dt;
      timeLeft = Math.max(0, GAME_DURATION - timeElapsed / 1000);
      if (timeLeft <= 0) endGame();
    }
  }

  function render() {
    ctx.save();
    if (shakeT > 0) {
      var sx = (Math.random() - 0.5) * shakeA * (shakeT / 300);
      var sy = (Math.random() - 0.5) * shakeA * (shakeT / 300);
      ctx.translate(sx, sy);
    }
    drawBackground();
    for (var i = 0; i < fruits.length; i++) {
      var f = fruits[i];
      if (f.wasSlashed && !f.alive) {
        var halfAlpha = 0.5;
        ctx.save(); ctx.globalAlpha = halfAlpha * 0.6;
        ctx.translate(f.x, f.y);
        ctx.rotate(f.rotation);
        ctx.fillStyle = f.type.color;
        ctx.beginPath(); ctx.arc(-4, 0, f.size * 0.7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(4, 0, f.size * 0.7, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
        continue;
      }
      if (!f.alive) continue;
      drawFruit(f);
    }
    for (var j = 0; j < bombs.length; j++) { if (bombs[j].alive) drawBomb(bombs[j]) }
    for (var k = 0; k < missedMarks.length; k++) { drawMissedMark(missedMarks[k]) }
    for (var p = 0; p < particles.length; p++) {
      var pt = particles[p];
      ctx.save();
      ctx.shadowColor = pt.color; ctx.shadowBlur = 8;
      ctx.fillStyle = 'rgba(' + parseInt(pt.color.slice(1, 3), 16) + ',' + parseInt(pt.color.slice(3, 5), 16) + ',' + parseInt(pt.color.slice(5, 7), 16) + ',' + pt.alpha + ')';
      ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    for (var tp = 0; tp < scorePopups.length; tp++) {
      var sp = scorePopups[tp];
      ctx.save(); ctx.globalAlpha = sp.alpha;
      ctx.font = 'bold 20px system-ui,sans-serif'; ctx.fillStyle = sp.color;
      ctx.textAlign = 'center'; ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 10;
      ctx.fillText(sp.text, sp.x, sp.y);
      ctx.restore();
    }
    if (trail.length > 1) {
      ctx.save();
      for (var ti = 0; ti < trail.length - 1; ti++) {
        var t0 = trail[ti], t1 = trail[ti + 1];
        var segAlpha = (trail.length - ti) / trail.length;
        ctx.shadowColor = '#ffffff'; ctx.shadowBlur = 20;
        ctx.strokeStyle = 'rgba(255,255,255,' + (segAlpha * 0.95) + ')';
        ctx.lineWidth = 3; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(t0.x, t0.y); ctx.lineTo(t1.x, t1.y); ctx.stroke();
        ctx.shadowColor = '#ff9632'; ctx.shadowBlur = 12;
        ctx.strokeStyle = 'rgba(255,150,50,' + (segAlpha * 0.6) + ')';
        ctx.lineWidth = segAlpha * 10;
        ctx.beginPath(); ctx.moveTo(t0.x, t0.y); ctx.lineTo(t1.x, t1.y); ctx.stroke();
      }
      ctx.restore();
    }
    ctx.restore();
  }

  function updHUD() {
    var se = root.querySelector('#fn-score'); if (se) se.textContent = score;
    var be = root.querySelector('#fn-best'); if (be) be.textContent = Math.max(score, best);
    var te = root.querySelector('#fn-time'); if (te) te.textContent = activeMode === 'arcade' ? Math.ceil(timeLeft) : (activeMode==='survival' ? (3-misses)+'♥' : 'ZEN');
    var ce = root.querySelector('#fn-combo');
    if (ce) {
      if (comboCount >= 5) { ce.textContent = 'MEGA COMBO x' + comboCount + '!'; ce.style.display = 'block' }
      else if (comboCount >= 3) { ce.textContent = 'COMBO x' + comboCount + '!'; ce.style.display = 'block' }
      else { ce.style.display = 'none' }
    }
    if (score > best) {
      best = score;
      bestScore = best;
      host.storage.set('fruitninja_best', best).catch(function () { });
    }
  }

  function endGame() {
    arcade.record('fail',1);arcade.record('score',score);gameState = 'gameOver';
    sfxGameOver();
    stopLoop();
    if (score > bestScore) { bestScore = score; host.storage.set('fruitninja_best', bestScore).catch(function () { }) }
    showGameOverOverlay();
  }

  function showGameOverOverlay() {
    var ov = el('div', 'fn-overlay');
    var isRec = score > 0 && score >= bestScore && bestScore > 0;
    ov.innerHTML = '<div class="fn-modal">'
      + '<h2 style="color:' + (bombCount > 0 ? '#EF4444' : '#22C55E') + '">' + (bombCount > 0 ? 'Boom! Game Over' : 'Time\'s Up!') + '</h2>'
      + '<p class="fn-m-sub">' + (isRec ? 'New High Score!' : (activeMode === 'arcade' ? '60 seconds complete!' : activeMode==='survival'?'Survival run ended':'Zen session complete')) + '</p>'
      + '<div class="fn-m-stats">'
      + '<div class="fn-msi"><div class="fn-msil">Score</div><div class="fn-msiv" style="color:#FBBF24">' + score + '</div></div>'
      + '<div class="fn-msi"><div class="fn-msil">Best</div><div class="fn-msiv' + (isRec ? ' rec' : '') + '" style="color:#F97316">' + Math.max(score, bestScore) + '</div></div>'
      + '<div class="fn-msi"><div class="fn-msil">Slashed</div><div class="fn-msiv" style="color:#22C55E">' + fruitsSlashed + '</div></div>'
      + '<div class="fn-msi"><div class="fn-msil">Max Combo</div><div class="fn-msiv" style="color:#A855F7">' + maxCombo + '</div></div>'
      + '</div><div class="fn-mb">'
      + '<button class="fn-mbtn pri" data-a="new">Play Again</button>'
      + '<button class="fn-mbtn sec" data-a="menu">Main Menu</button></div></div>';
    root.appendChild(ov);
    function close() { ov.remove(); window.removeEventListener('keydown', kfn) }
    function kfn(e) { if (e.key === 'Escape') close() }
    ov.addEventListener('click', function (e) { if (e.target === ov) close() });
    window.addEventListener('keydown', kfn);
    ov.querySelector('[data-a="new"]').addEventListener('click', function () { ov.remove(); startGame() });
    ov.querySelector('[data-a="menu"]').addEventListener('click', function () { ov.remove(); showStartScreen() });
  }

  function showStartScreen() {
    gameState = 'start';
    stopLoop();
    fruits = []; bombs = []; particles = []; scorePopups = []; trail = []; missedMarks = [];
    spawnTimer = 0; bombCount = 0;
    var ov = el('div', 'fn-overlay');
    ov.innerHTML = '<div class="fn-modal">'
      + '<h1 class="fn-start-title">Fruit Slash</h1>'
      + '<p class="fn-start-sub">Swipe to slice! Avoid the bombs.</p>'
      + '<div class="fn-mode-select"><button class="fn-mode-btn sel">'+activeMode.toUpperCase()+'</button><button class="fn-mode-btn" data-open-hq>Modes & perks</button></div>'
      + '<div class="fn-mb"><button class="fn-mbtn pri" data-a="play">Play</button></div>'
      + '<p style="font-size:10px;color:#64748B;margin-top:10px">Best Score: ' + bestScore + '</p></div>';
    root.appendChild(ov);
    function close() { ov.remove(); window.removeEventListener('keydown', kfn) }
    function kfn(e) { if (e.key === 'Escape') close() }
    ov.addEventListener('click', function (e) { if (e.target === ov) close() });
    window.addEventListener('keydown', kfn);
    var hqBtn=ov.querySelector('[data-open-hq]');if(hqBtn)hqBtn.addEventListener('click',function(){arcade.openHub()});
    ov.querySelector('[data-a="play"]').addEventListener('click', function () { ov.remove(); startGame() });
  }

  function startGame() {
    activeMode=arcade.mode().id;activePerk=arcade.perk().id;mode=activeMode==='arcade'?'timed':'freeplay';gameState = 'playing';
    score = 0; timeElapsed = 0; timeLeft = GAME_DURATION;
    fruits = []; bombs = []; particles = []; scorePopups = []; trail = []; missedMarks = [];
    comboCount = 0; maxCombo = 0; fruitsSlashed = 0; bombCount = 0;shieldUsed=false;misses=0;bosses=0;
    waveCount = 0; bombsSpawned = 0; spawnTimer = 500; comboWindow = 0;
    shakeT = 0; shakeA = 0; isSlashing = false;
    updHUD();
    initA();
    arcade.record('start',1);arcade.showToast('⚔',activeMode.toUpperCase(),activePerk+' perk active');startLoop();
  }

  function showHelp() {
    var ov = el('div', 'fn-help-modal'), bx = el('div', 'fn-help-box');
    bx.innerHTML = '<div class="fn-help-head"><h2 class="fn-help-title">How to Play</h2><button class="fn-help-close" data-close>&times;</button></div>'
      + '<div class="fn-help-body">'
      + '<h3>Goal</h3><p>Swipe across fruits to slice them before they fall off screen. Score as many points as you can!</p>'
      + '<h3>Controls</h3><ul><li><b>Drag / Swipe</b> across the screen to slash fruits.</li><li><b>Space / P</b> to pause and resume.</li></ul>'
      + '<h3>Scoring</h3><ul>'
      + '<li><b>+1</b> per fruit sliced</li>'
      + '<li><b>+3 bonus</b> per fruit in a 3+ combo</li>'
      + '<li><b>+5 bonus</b> per fruit in a 5+ mega combo</li>'
      + '<li><b>+5 CRIT</b> for a dead-center slash</li>'
      + '</ul>'
      + '<h3>Bombs</h3><p>Black bombs appear among fruits. Slashing a bomb ends the game immediately in all modes!</p>'
      + '<h3>Modes</h3><ul><li><b>Timed:</b> 60 seconds. Score fast!</li><li><b>Freeplay:</b> No time limit. Game over on bomb hit.</li></ul>'
      + '</div>';
    ov.appendChild(bx);
    function close() { ov.remove(); window.removeEventListener('keydown', kfn) }
    function kfn(e) { if (e.key === 'Escape') close() }
    ov.addEventListener('click', function (e) { if (e.target === ov) close() });
    bx.querySelector('[data-close]').addEventListener('click', close);
    window.addEventListener('keydown', kfn);
    root.appendChild(ov);
  }

  function gameLoop(time) {
    animId = requestAnimationFrame(gameLoop);
    if (gameState !== 'playing') { lastTime = time; return }
    if (!lastTime) lastTime = time;
    var dt = time - lastTime; lastTime = time;
    if (dt > 100) dt = 100;
    update(dt);
    for (var i = trail.length - 1; i >= 0; i--) {
      trail[i].age = (trail[i].age || 0) + dt;
      if (trail[i].age > 150) trail.splice(i, 1);
    }
    checkSlashCollisions();
    if (gameState === 'gameOver') return;
    render();
    updHUD();
  }

  function startLoop() { stopLoop(); lastTime = 0; animId = requestAnimationFrame(gameLoop) }
  function stopLoop() { if (animId) { cancelAnimationFrame(animId); animId = null } }

  function onMouseDown(e) {
    if (gameState !== 'playing') return;
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left, y = e.clientY - rect.top;
    isSlashing = true; comboCount = 0; comboWindow = 0;
    trail = [{ x: x, y: y, age: 0 }];
    lastTrailPoint = { x: x, y: y };
    sfxSlash();
    e.preventDefault();
  }

  function onMouseMove(e) {
    if (!isSlashing || gameState !== 'playing') return;
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left, y = e.clientY - rect.top;
    var dx = x - (lastTrailPoint ? lastTrailPoint.x : x), dy = y - (lastTrailPoint ? lastTrailPoint.y : y);
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      trail.push({ x: x, y: y, age: 0 });
      lastTrailPoint = { x: x, y: y };
    }
    e.preventDefault();
  }

  function onMouseUp(e) {
    isSlashing = false;
    lastTrailPoint = null;
  }

  function onTouchStart(e) {
    if (gameState !== 'playing') return;
    initA();
    var rect = canvas.getBoundingClientRect();
    var x = e.touches[0].clientX - rect.left, y = e.touches[0].clientY - rect.top;
    isSlashing = true; comboCount = 0; comboWindow = 0;
    trail = [{ x: x, y: y, age: 0 }];
    lastTrailPoint = { x: x, y: y };
    sfxSlash();
    e.preventDefault();
  }

  function onTouchMove(e) {
    if (!isSlashing || gameState !== 'playing') return;
    var rect = canvas.getBoundingClientRect();
    var x = e.touches[0].clientX - rect.left, y = e.touches[0].clientY - rect.top;
    var dx = x - (lastTrailPoint ? lastTrailPoint.x : x), dy = y - (lastTrailPoint ? lastTrailPoint.y : y);
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      trail.push({ x: x, y: y, age: 0 });
      lastTrailPoint = { x: x, y: y };
    }
    e.preventDefault();
  }

  function onTouchEnd(e) {
    isSlashing = false;
    lastTrailPoint = null;
  }

  function onKeyDown(e) {
    if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      if (gameState === 'start') {
        var so = root.querySelector('.fn-overlay');
        if (so) so.remove();
        startGame();
      }
      return;
    }
    if (e.key === 'Escape') {
      var hm = root.querySelector('.fn-help-modal');
      if (hm) { hm.querySelector('[data-close]').click(); return }
      var go = root.querySelector('.fn-overlay');
      if (go && gameState === 'gameOver') { go.remove(); showStartScreen(); return }
      if (gameState === 'start') {
        var so = root.querySelector('.fn-overlay');
        if (so) so.remove();
        return;
      }
    }
  }

  function onKeyPress(e) {
    if (e.key === ' ' || e.key === 'Spacebar') e.preventDefault();
  }

  function onResize() { resizeCanvas() }

  removeArcadeChange=arcade.onChange(function(){
    activeMode=arcade.mode().id;activePerk=arcade.perk().id;arcade.closeHub();
    if(gameState!=='playing'){showStartScreen()}else arcade.showToast('✓','Next run updated',arcade.mode().name+' · '+arcade.perk().name);
  });

  return {
    mount: function (container) {
      container.innerHTML = '';
      root = el('div', 'fn-r'); container.appendChild(root);
      arcade.mount(root, container);
      root.style.position = 'relative';

      canvas = document.createElement('canvas');
      canvas.className = 'fn-canvas';
      root.appendChild(canvas);
      ctx = canvas.getContext('2d');

      var hud = el('div', 'fn-hud');
      hud.innerHTML = '<div class="fn-hud-item"><div class="fn-hud-label">Score</div><div class="fn-hud-val co" id="fn-score">0</div></div>'
        + '<div class="fn-hud-item"><div class="fn-hud-label">Best</div><div class="fn-hud-val bs" id="fn-best">0</div></div>'
        + '<div class="fn-hud-item"><div class="fn-hud-label">Time</div><div class="fn-hud-val tm" id="fn-time">60</div></div>';
      root.appendChild(hud);

      var comboEl = el('div', 'fn-hud-combo'); comboEl.id = 'fn-combo'; comboEl.style.display = 'none';
      root.appendChild(comboEl);

      var helpBtn = el('button', 'fn-help', '?'); helpBtn.title = 'How to play';
      helpBtn.addEventListener('click', function (e) { e.stopPropagation(); showHelp() });
      root.appendChild(helpBtn);

      resizeCanvas();
      generateStars();

      canvas.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      canvas.addEventListener('touchstart', onTouchStart, { passive: false });
      canvas.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', onTouchEnd);
      window.addEventListener('keydown', onKeyDown);
      window.addEventListener('keypress', onKeyPress);
      window.addEventListener('resize', onResize);
      if(typeof ResizeObserver==='function'){resizeObserver=new ResizeObserver(function(){requestAnimationFrame(resizeCanvas)});resizeObserver.observe(root)}

      showStartScreen();
    },
    unmount: function () {if(resizeObserver){resizeObserver.disconnect();resizeObserver=null};removeArcadeChange?.();arcade.cleanup();
      stopLoop();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keypress', onKeyPress);
      window.removeEventListener('resize', onResize);if(audio){audio.close().catch(function(){});audio=null}
    }
  };
}
