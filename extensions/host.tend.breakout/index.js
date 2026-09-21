import { createArcade, setTimeout, clearTimeout, setInterval, clearInterval, requestAnimationFrame, cancelAnimationFrame } from './arcade-kit.js';
var STYLE_ID = 'tend-ext-breakout-styles-v220';
var BRICK_COLS = 10; var BRICK_ROWS = 7; var BRICK_PAD = 3;
var BRICK_GAP = 2; var BALL_R = 7;
var BASE_SPEED = 4; var PADDLE_W = 96; var PADDLE_H = 14;
var POWERUP_SIZE = 18; var POWERUP_SPEED = 1.5; var POWERUP_CHANCE = 0.1;
var LASER_SPEED = 8; var LASER_INT = 500;

var BRICK_COLORS = ['#EF4444','#F97316','#FBBF24','#22C55E','#06B6D4','#3B82F6','#8B5CF6'];
var BRICK_SCORES = [70,60,50,40,30,20,10];
var BRICK_HPS = [1,1,2,2,3,3,3];

var PATTERNS = [
  [10,10,10,10,10,10,10],
  [5,10,5,10,5,10,5],
  [0,0,4,8,4,0,0],
  [2,4,6,8,10,10,10],
  [10,10,10,10,6,3,1],
  [0,2,4,6,8,10,10],
  [8,10,8,10,8,10,8]
];

var PU_TYPES = ['multiball','wide','slow','life','laser'];
var PU_WEIGHTS = [20,25,20,15,20];
var PU_LABELS = ['\u00D73','\u2194','\u00BD','\u2665','\u26A1'];
var PU_COLORS = ['#FBBF24','#3B82F6','#22C55E','#EF4444','#8B5CF6'];

function ensureStyles(){
  if(document.getElementById(STYLE_ID)) return;
  var s=document.createElement('style'); s.id=STYLE_ID;
  s.textContent=[
    '@keyframes bkFadeIn{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}',
    '@keyframes bkPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.2)}}',
    '@keyframes bkShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-2px)}75%{transform:translateX(2px)}}',
    '@keyframes bkFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}',
    '@keyframes bkPop{0%{transform:scale(.2);opacity:0}60%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}',
    '@keyframes bkGlow{0%,100%{box-shadow:0 0 6px rgba(255,255,255,.2)}50%{box-shadow:0 0 14px rgba(255,255,255,.45)}}',
    '.bk-r{width:100%;height:100%;display:flex;flex-direction:column;overflow:hidden;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;user-select:none;-webkit-user-select:none;background:radial-gradient(ellipse at 50% 0%,#0f1530 0%,#070910 60%,#020305 100%);color:#E2E8F0;position:relative}',
    '.bk-bar{display:flex;align-items:center;gap:6px;padding:8px 10px;flex-shrink:0;border-bottom:1px solid rgba(255,255,255,.06)}',
    '.bk-stat{text-align:center;padding:4px 10px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);border-radius:8px;min-width:44px}',
    '.bk-stat-l{font-size:8px;text-transform:uppercase;letter-spacing:1.2px;color:#64748B;font-weight:700}',
    '.bk-stat-v{font-size:16px;font-weight:900;font-variant-numeric:tabular-nums;line-height:1.1}',
    '.bk-stat-v.sc{color:#FBBF24}',
    '.bk-stat-v.lv{color:#8B5CF6}',
    '.bk-stat-v.bs{color:#F97316}',
    '.bk-lives{display:flex;gap:1px;font-size:14px;letter-spacing:1px}',
    '.bk-help{width:28px;height:28px;border-radius:7px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:#94A3B8;cursor:pointer;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:14px;font-family:inherit;flex-shrink:0;margin-left:auto;transition:all .15s}',
    '.bk-help:hover{background:rgba(255,255,255,.1);color:#fff}',
    '.bk-game{flex:1;position:relative;overflow:hidden;min-height:0;background:rgba(255,255,255,.015);cursor:none}',
    '.bk-paddle{position:absolute;height:'+PADDLE_H+'px;background:linear-gradient(180deg,rgba(255,255,255,.98),rgba(200,220,255,.8));border-radius:7px;box-shadow:0 0 16px rgba(99,102,241,.6),0 0 32px rgba(99,102,241,.2),0 2px 8px rgba(0,0,0,.3);z-index:10;transition:width .2s,left .02s}',
    '.bk-ball{position:absolute;width:'+(BALL_R*2)+'px;height:'+(BALL_R*2)+'px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#fff,#e2e8f0);box-shadow:0 0 14px rgba(255,255,255,.9),0 0 28px rgba(99,102,241,.6);z-index:10}',
    '.bk-brick{position:absolute;border-radius:3px;z-index:5;border:1px solid rgba(255,255,255,.15)}',
    '.bk-brick[data-hp="3"]{opacity:.95;box-shadow:0 0 6px rgba(255,255,255,.15),0 1px 3px rgba(0,0,0,.3)}',
    '.bk-brick[data-hp="2"]{opacity:.82;box-shadow:inset 0 0 0 1px rgba(0,0,0,.2),0 0 4px rgba(255,255,255,.1)}',
    '.bk-brick[data-hp="1"]{opacity:.58;box-shadow:inset 0 0 0 1px rgba(0,0,0,.3);background-size:6px 6px;background-position:0 0,3px 3px;background-repeat:repeat}',
    '.bk-pu-wrap{position:absolute;inset:0;z-index:8;pointer-events:none}',
    '.bk-pu{position:absolute;width:'+POWERUP_SIZE+'px;height:'+POWERUP_SIZE+'px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:900;border:1.5px solid rgba(255,255,255,.3);animation:bkFloat 1.2s ease-in-out infinite;pointer-events:none;box-shadow:0 0 8px rgba(255,255,255,.15)}',
    '.bk-laser-wrap{position:absolute;inset:0;z-index:9;pointer-events:none}',
    '.bk-laser{position:absolute;width:3px;height:12px;border-radius:2px;background:linear-gradient(180deg,#FBBF24,#F97316);box-shadow:0 0 6px #FBBF24,0 0 12px rgba(251,191,36,.4);pointer-events:none}',
    '.bk-overlay{position:absolute;inset:0;background:rgba(2,2,12,.8);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;z-index:60;padding:14px;animation:bkFadeIn .25s ease}',
    '.bk-modal{background:linear-gradient(180deg,#1A1F35,#15192a);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:22px 20px;text-align:center;max-width:280px;width:100%;box-shadow:0 20px 50px rgba(0,0,0,.6)}',
    '.bk-modal h2{font-size:20px;font-weight:900;margin:0 0 4px}',
    '.bk-modal .bk-m-sub{color:#94A3B8;font-size:12px;margin:0 0 12px}',
    '.bk-m-stats{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:6px 0 12px}',
    '.bk-msi{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);border-radius:8px;padding:6px}',
    '.bk-msil{font-size:9px;color:#94A3B8;font-weight:600;text-transform:uppercase;letter-spacing:1px}',
    '.bk-msiv{font-size:16px;font-weight:900;color:#fff;margin-top:1px}',
    '.bk-msiv.rec{color:#FBBF24}',
    '.bk-mb{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}',
    '.bk-mbtn{padding:9px 20px;border-radius:9px;border:none;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .15s;letter-spacing:.3px}',
    '.bk-mbtn:hover{transform:translateY(-1px)}',
    '.bk-mbtn.pri{background:linear-gradient(135deg,#3B82F6,#8B5CF6);color:#fff;box-shadow:0 4px 16px rgba(59,130,246,.4)}',
    '.bk-mbtn.sec{background:rgba(255,255,255,.06);color:#E2E8F0;border:1px solid rgba(255,255,255,.1)}',
    '.bk-help-modal{position:absolute;inset:0;background:rgba(2,2,12,.78);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;z-index:50;padding:14px;animation:bkFadeIn .2s ease}',
    '.bk-help-box{background:linear-gradient(180deg,#1A1F35,#15192a);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:18px;max-width:320px;width:100%;box-shadow:0 16px 50px rgba(0,0,0,.55)}',
    '.bk-help-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}',
    '.bk-help-title{font-size:16px;font-weight:800;color:#fff;margin:0}',
    '.bk-help-close{width:26px;height:26px;border-radius:7px;border:none;background:rgba(255,255,255,.06);color:#94A3B8;cursor:pointer;font-size:16px;line-height:1;font-family:inherit;transition:all .15s}',
    '.bk-help-close:hover{background:rgba(255,255,255,.12);color:#fff}',
    '.bk-help-body{font-size:12px;line-height:1.5;color:#CBD5E1}',
    '.bk-help-body h3{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#94A3B8;margin:12px 0 4px;font-weight:700}',
    '.bk-help-body h3:first-child{margin-top:0}',
    '.bk-help-body ul{margin:0;padding-left:16px}',
    '.bk-help-body li{margin:2px 0}',
    '.bk-help-body .bk-pu-dot{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:4px;vertical-align:middle}',
    '.bk-pause{position:absolute;inset:0;background:rgba(2,2,12,.55);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;z-index:40;font-size:44px;font-weight:900;color:rgba(255,255,255,.2);animation:bkFadeIn .15s ease}',
    '.bk-ready-text{position:absolute;top:40%;left:50%;transform:translate(-50%,-50%);font-size:14px;font-weight:700;color:rgba(255,255,255,.35);z-index:15;pointer-events:none;animation:bkPulse 1.5s ease-in-out infinite}',
      '.bk-r{background:radial-gradient(circle at 50% -10%,rgba(99,102,241,.22),transparent 34%),radial-gradient(circle at 18% 64%,rgba(6,182,212,.10),transparent 30%),linear-gradient(180deg,#070a17,#03050d)}.bk-bar{min-height:54px;background:rgba(5,9,24,.82);backdrop-filter:blur(14px);padding:8px 12px}.bk-game{margin:0 8px 8px;border-radius:16px;border:1px solid rgba(255,255,255,.08);box-shadow:inset 0 0 80px rgba(0,0,0,.36),0 18px 48px rgba(0,0,0,.3);background:linear-gradient(180deg,rgba(15,23,42,.5),rgba(2,6,23,.72))}.bk-brick{border-radius:6px!important;box-shadow:inset 0 1px rgba(255,255,255,.28),0 4px 9px rgba(0,0,0,.3)!important}.bk-paddle{height:16px!important;background:linear-gradient(90deg,#22d3ee,#818cf8 48%,#ec4899)!important;border:1px solid rgba(255,255,255,.72);box-shadow:0 0 18px rgba(99,102,241,.75),0 0 44px rgba(34,211,238,.25)!important}.bk-ball{background:radial-gradient(circle at 30% 25%,#fff,#bfdbfe 48%,#818cf8)!important}@media(min-width:768px){.tend-floating-window.tend-game-focus .tend-arcade-root.bk-r{width:min(1120px,calc(100dvw - 48px))!important;height:min(900px,calc(100dvh - 48px))!important}.tend-floating-window.tend-game-focus .bk-bar{padding:10px 18px}.tend-floating-window.tend-game-focus .bk-stat{min-width:90px;padding:6px 14px}.tend-floating-window.tend-game-focus .bk-stat-v{font-size:20px}.tend-floating-window.tend-game-focus .bk-game{margin:0 14px 14px}}@media(max-width:767px){.bk-bar{padding:max(7px,env(safe-area-inset-top)) 7px 7px}.bk-stat{padding:3px 5px;min-width:0;flex:1}.bk-stat-l{font-size:7px}.bk-stat-v{font-size:14px}.bk-game{margin:0 5px max(5px,env(safe-area-inset-bottom));border-radius:12px}}',
].join('');
  document.head.appendChild(s);
}

function el(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html)e.innerHTML=html;return e}

function Game(){
  this.balls=[];this.powerups=[];this.lasers=[];this.bricks=[];
  this.score=0;this.lives=3;this.level=1;this.effects={wide:0,slow:0,laser:0};this.combo=0;this.bestCombo=0;this.shieldUsed=false;
  this.ballSpeed=BASE_SPEED;this.lastLaser=0;this.paused=false;
}

export default function activate(host){
  const arcade = createArcade(host, {"name":"Breakout Odyssey","icon":"🧱","subtitle":"Campaign bricks, bosses, perks, and fever chains","modes":[{"id":"campaign","name":"Campaign","icon":"▦","desc":"40 escalating stages and boss walls","unlock":1},{"id":"blitz","name":"Blitz","icon":"⚡","desc":"Fast balls and score pressure","unlock":3},{"id":"endless","name":"Endless","icon":"∞","desc":"Procedural walls until the last life","unlock":6}],"perks":[{"id":"wide","name":"Wide Start","icon":"↔","desc":"Begin with a wider paddle","unlock":1},{"id":"shield","name":"Floor Shield","icon":"🛡","desc":"Save the first missed ball","unlock":3},{"id":"fortune","name":"Power Magnet","icon":"✦","desc":"More frequent power drops","unlock":5}],"missions":[{"event":"brick","target":180,"title":"Wall Breaker","detail":"Destroy 180 bricks","icon":"🧱","reward":90},{"event":"level","target":5,"title":"Stage Runner","detail":"Clear five stages","icon":"🏁","reward":120},{"event":"combo","target":35,"title":"Fever Chain","detail":"Build 35 combo points","icon":"🔥","reward":100}]});

  ensureStyles();
  var root=null,gameEl=null,puWrap=null,laserWrap=null,brickWrap=null;
  var paddleEl=null,ballsWrap=null;
  var game=null,best=0,audio=null,animId=null,lastTime=0;
  var keys={}; var paddleX=0; var ballLaunched=false;
  var gameState='ready'; var readyTimer=null;
  var ballEls={}; var brickEls={};
  var activeMode='campaign',activePerk='wide';
  var resizeObserver=null,removeArcadeChange=null,lastLayoutW=0,lastLayoutH=0;
  arcade.ready.then(function(){activeMode=arcade.mode().id;activePerk=arcade.perk().id;});

  host.storage.get('breakout_best').then(function(v){if(typeof v==='number')best=v}).catch(function(){});

  function initA(){if(!audio) try{audio=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}
  function resA(){if(audio&&audio.state==='suspended') audio.resume()}
  function tone(f,d,t,v){if(!audio) return;resA();try{
    var o=audio.createOscillator(),g=audio.createGain();
    o.type=t||'sine';o.frequency.setValueAtTime(f,audio.currentTime);
    g.gain.setValueAtTime(v||.06,audio.currentTime);
    g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+d);
    o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+d);
  }catch(e){}}

  function sfxBounce(){tone(440,.06,'sine',.04)}
  function sfxBrickHit(){tone(180,.07,'triangle',.05);setTimeout(function(){tone(120,.08,'triangle',.03)},35)}
  function sfxPowerup(){tone(600,.06,'sine',.06);setTimeout(function(){tone(900,.06,'sine',.06)},50);setTimeout(function(){tone(1200,.08,'sine',.05)},100)}
  function sfxLoseLife(){tone(200,.12,'sawtooth',.04);setTimeout(function(){tone(140,.18,'sawtooth',.03)},70);setTimeout(function(){tone(80,.22,'sawtooth',.03)},160)}
  function sfxLevelUp(){tone(440,.08,'triangle',.06);setTimeout(function(){tone(660,.08,'triangle',.06)},70);setTimeout(function(){tone(880,.08,'triangle',.06)},140);setTimeout(function(){tone(1100,.12,'triangle',.07)},210)}
  function sfxGameOver(){tone(260,.1,'sawtooth',.04);setTimeout(function(){tone(200,.12,'sawtooth',.03)},100);setTimeout(function(){tone(150,.15,'sawtooth',.03)},200);setTimeout(function(){tone(100,.25,'sawtooth',.03)},300)}
  function sfxLaser(){tone(800,.04,'square',.03)}

  function updUI(){
    var se=root.querySelector('#bk-score'); if(se) se.textContent=game.score;
    var be=root.querySelector('#bk-best'); if(be) be.textContent=Math.max(game.score,best);
    var le=root.querySelector('#bk-level'); if(le) le.textContent=game.level;
    var he=root.querySelector('#bk-lives');
    if(he){he.innerHTML='';for(var i=0;i<game.lives;i++)he.appendChild(el('span','','\u2665'))}
    if(game.score>best){best=game.score;host.storage.set('breakout_best',best).catch(function(){})}
  }

  function getPaddleW(){var base=(activePerk==='wide'?PADDLE_W*1.28:PADDLE_W);return game.effects.wide>Date.now()?base*1.7:base}

  function spawnBall(x,y,dx,dy){
    var b={x:x||(getPaddleW()/2),y:y||0,dx:dx||0,dy:dy||0,speed:game.ballSpeed,id:'b'+Date.now()+Math.random()};
    game.balls.push(b); return b;
  }

  function launchBall(b){
    var sp=game.ballSpeed;
    var angle=(Math.random()-.5)*0.6-1.5;
    b.dx=Math.sin(angle)*sp; b.dy=Math.cos(angle)*sp;
    if(Math.abs(b.dx)<1) b.dx=(Math.random()>.5?1:-1)*sp*.5;
    var mag=Math.sqrt(b.dx*b.dx+b.dy*b.dy);
    b.dx=b.dx/mag*sp; b.dy=b.dy/mag*sp;
  }

  function calcBallAngle(ball,paddleCenter,paddleHalfW){
    var rel=(ball.x-paddleCenter)/paddleHalfW;
    rel=Math.max(-1,Math.min(1,rel));
    var ang=rel*1.1;
    var sp=ball.speed;
    ball.dx=Math.sin(ang)*sp; ball.dy=-Math.abs(Math.cos(ang)*sp);
    var mag=Math.sqrt(ball.dx*ball.dx+ball.dy*ball.dy);
    ball.dx=ball.dx/mag*sp; ball.dy=ball.dy/mag*sp;
  }

  function getBrickLayout(){
    var gw=gameEl.offsetWidth,gh=gameEl.offsetHeight;
    var bw=(gw-BRICK_PAD*2-BRICK_GAP*(BRICK_COLS-1))/BRICK_COLS;
    var bh=Math.max(16,Math.min(26,(gh*.45-BRICK_PAD*2-BRICK_GAP*(BRICK_ROWS-1))/BRICK_ROWS));
    var topOff=BRICK_PAD+4;
    return{gw:gw,gh:gh,bw:bw,bh:bh,topOff:topOff};
  }

  function createBricks(lvl){
    var lo=getBrickLayout();
    var pat=PATTERNS[(lvl-1)%PATTERNS.length].slice();
    if(lvl>PATTERNS.length){pat=[];for(var pr=0;pr<BRICK_ROWS;pr++){var wave=Math.sin((lvl+pr)*1.17);pat.push(Math.max(3,Math.min(10,Math.round(6+wave*3+(pr%2)))));}}
    game.bricks=[];
    brickWrap.innerHTML=''; brickEls={};
    for(var r=0;r<BRICK_ROWS;r++){
      var cnt=pat[r];
      var start=Math.floor((BRICK_COLS-cnt)/2);
      for(var c=0;c<cnt;c++){
        var col=start+c;
        var x=BRICK_PAD+col*(lo.bw+BRICK_GAP);
        var y=lo.topOff+r*(lo.bh+BRICK_GAP);
        var hp=BRICK_HPS[Math.min(r,BRICK_HPS.length-1)]+(lvl%5===0&&r<2?2:0)+Math.floor(Math.max(0,lvl-12)/10);
        var clr=BRICK_COLORS[Math.min(r,BRICK_COLORS.length-1)];
        var brick={x:x,y:y,w:lo.bw,h:lo.bh,hp:hp,maxHp:hp,color:clr,row:r,col:col,el:null,alive:true,boss:lvl%5===0&&r<2};
        var be=document.createElement('div'); be.className='bk-brick';
        be.setAttribute('data-hp',hp);
        be.style.left=x+'px'; be.style.top=y+'px';
        be.style.width=lo.bw+'px'; be.style.height=lo.bh+'px';
        be.style.background=brick.boss?'linear-gradient(135deg,#ef4444,#7c3aed)':clr;if(brick.boss)be.style.boxShadow='0 0 12px rgba(239,68,68,.55)';
        brick.el=be; brickEls[brick.x+','+brick.y]=brick;
        brickWrap.appendChild(be);
        game.bricks.push(brick);
      }
    }
  }

  function layoutGame(){
    if(!gameEl||!game)return;
    var nw=gameEl.offsetWidth,nh=gameEl.offsetHeight;if(nw<50||nh<100)return;
    var sx=lastLayoutW?nw/lastLayoutW:1,sy=lastLayoutH?nh/lastLayoutH:1;
    if(lastLayoutW&&lastLayoutH){
      paddleX*=sx;
      game.balls.forEach(function(b){b.x*=sx;b.y*=sy});
      game.powerups.forEach(function(p){p.x*=sx;p.y*=sy});
      game.lasers.forEach(function(l){l.x*=sx;l.y*=sy});
    }
    lastLayoutW=nw;lastLayoutH=nh;
    var lo=getBrickLayout();
    game.bricks.forEach(function(bk){
      bk.x=BRICK_PAD+bk.col*(lo.bw+BRICK_GAP);bk.y=lo.topOff+bk.row*(lo.bh+BRICK_GAP);bk.w=lo.bw;bk.h=lo.bh;
      if(bk.el){bk.el.style.left=bk.x+'px';bk.el.style.top=bk.y+'px';bk.el.style.width=bk.w+'px';bk.el.style.height=bk.h+'px'}
    });
    paddleX=Math.max(getPaddleW()/2,Math.min(nw-getPaddleW()/2,paddleX||nw/2));
    renderPaddle();renderBalls();renderPowerups();renderLasers();
  }

  function spawnPowerup(x,y){
    var r=Math.random()*100; var acc=0;
    for(var i=0;i<PU_TYPES.length;i++){acc+=PU_WEIGHTS[i]; if(r<=acc){var type=PU_TYPES[i];break}}
    if(!type) type='wide';
    game.powerups.push({type:type,x:x,y:y,vy:POWERUP_SPEED,el:null});
  }

  function applyPowerup(type){arcade.record('power',1);arcade.showToast('✦','Power collected',type.toUpperCase().replace('MULTIBALL','MULTI BALL'));
    if(type==='multiball'){
      var existing=game.balls.slice();
      for(var i=0;i<existing.length&&game.balls.length<6;i++){
        var b=existing[i];
        var ang=Math.atan2(b.dy,b.dx);
        for(var j=0;j<2&&game.balls.length<6;j++){
          var off=(j===0?0.6:-0.6);
          var nb=spawnBall(b.x,b.y,0,0);
          nb.speed=b.speed; nb.dx=Math.sin(ang+off)*b.speed; nb.dy=Math.cos(ang+off)*b.speed;
        }
      }
    }else if(type==='wide'){
      game.effects.wide=Date.now()+15000;
    }else if(type==='slow'){
      game.effects.slow=Date.now()+10000;
    }else if(type==='life'){
      game.lives=Math.min(game.lives+1,9);
    }else if(type==='laser'){
      game.effects.laser=Date.now()+10000;
    }
  }

  function checkBrickCollision(ball){
    var live=getPaddleW();
    for(var i=0;i<game.bricks.length;i++){
      var bk=game.bricks[i]; if(!bk.alive) continue;
      var clx=Math.max(bk.x,Math.min(ball.x,bk.x+bk.w));
      var cly=Math.max(bk.y,Math.min(ball.y,bk.y+bk.h));
      var dx=ball.x-clx,dy=ball.y-cly;
      if(dx*dx+dy*dy<=BALL_R*BALL_R){
        bk.hp--;
        if(bk.hp<=0){
          bk.alive=false;
          if(bk.el){bk.el.remove();bk.el=null}
          var brickPts=BRICK_SCORES[Math.min(bk.row,BRICK_SCORES.length-1)]*(1+Math.min(1.5,game.combo*.05));game.score+=Math.round(brickPts);game.combo++;game.bestCombo=Math.max(game.bestCombo,game.combo);arcade.record('brick',1);arcade.record('combo',game.combo);
          if(Math.random()<(activePerk==='fortune'?POWERUP_CHANCE*1.8:POWERUP_CHANCE)) spawnPowerup(bk.x+bk.w/2,bk.y+bk.h/2);
        }else{
          bk.el.setAttribute('data-hp',bk.hp);
          if(bk.hp===1){bk.el.style.backgroundImage='repeating-linear-gradient(45deg,transparent,transparent 2px,rgba(0,0,0,.3) 2px,rgba(0,0,0,.3) 4px)'}
        }
        sfxBrickHit();
        var overlapL=(ball.x+BALL_R)-bk.x;
        var overlapR=(bk.x+bk.w)-(ball.x-BALL_R);
        var overlapT=(ball.y+BALL_R)-bk.y;
        var overlapB=(bk.y+bk.h)-(ball.y-BALL_R);
        var minO=Math.min(overlapL,overlapR,overlapT,overlapB);
        if(minO===overlapL||minO===overlapR) ball.dx=-ball.dx;
        else ball.dy=-ball.dy;
        return true;
      }
    }
    return false;
  }

  function renderBalls(){
    var ids={}; for(var i=0;i<game.balls.length;i++) ids[game.balls[i].id]=true;
    var toRemove=[];
    for(var key in ballEls){if(!ids[key]){ballEls[key].remove();toRemove.push(key)}}
    for(var k=0;k<toRemove.length;k++) delete ballEls[toRemove[k]];
    for(var i=0;i<game.balls.length;i++){
      var b=game.balls[i];
      var be=ballEls[b.id];
      if(!be){be=document.createElement('div');be.className='bk-ball';ballsWrap.appendChild(be);ballEls[b.id]=be}
      be.style.left=(b.x-BALL_R)+'px'; be.style.top=(b.y-BALL_R)+'px';
    }
  }

  function renderPowerups(){
    puWrap.innerHTML='';
    for(var i=0;i<game.powerups.length;i++){
      var p=game.powerups[i];
      var pe=document.createElement('div'); pe.className='bk-pu';
      var idx=PU_TYPES.indexOf(p.type);
      pe.style.background=PU_COLORS[idx]||'#FBBF24';
      pe.textContent=PU_LABELS[idx]||'?';
      pe.style.left=(p.x-POWERUP_SIZE/2)+'px'; pe.style.top=p.y+'px';
      puWrap.appendChild(pe); p.el=pe;
    }
  }

  function renderLasers(){
    laserWrap.innerHTML='';
    for(var i=0;i<game.lasers.length;i++){
      var l=game.lasers[i];
      var le=document.createElement('div'); le.className='bk-laser';
      le.style.left=(l.x-1.5)+'px'; le.style.top=l.y+'px';
      laserWrap.appendChild(le);
    }
  }

  function renderPaddle(){
    var pw=getPaddleW();
    paddleEl.style.width=pw+'px';
    paddleEl.style.left=paddleX+'px';
    paddleEl.style.bottom='14px';
    paddleEl.style.transform='translateX(-50%)';
    if(game.effects.wide>Date.now()) paddleEl.style.boxShadow='0 0 14px rgba(59,130,246,.5),0 2px 8px rgba(0,0,0,.3)';
    else paddleEl.style.boxShadow='0 0 10px rgba(255,255,255,.25),0 2px 8px rgba(0,0,0,.3)';
  }

  function updateEffects(){
    var now=Date.now();
    if(game.effects.slow&&now>game.effects.slow) game.effects.slow=0;
    if(game.effects.wide&&now>game.effects.wide) game.effects.wide=0;
    if(game.effects.laser&&now>game.effects.laser) game.effects.laser=0;
    game.ballSpeed=(game.effects.slow>now?BASE_SPEED*.5:BASE_SPEED)+game.level*.25;
  }

  function checkAllBricksDestroyed(){
    for(var i=0;i<game.bricks.length;i++) if(game.bricks[i].alive) return false;
    return true;
  }

  function levelComplete(){
    gameState='levelcomplete'; stopLoop(); sfxLevelUp();arcade.record('level',1,{achievement:game.level===10?'breakout_10':null,title:'Ten-stage breaker',detail:'Cleared ten Breakout stages.',coins:80});
    showOverlay('Level '+game.level+' Complete!','All bricks destroyed.','#22C55E',[
      {text:(game.level>=40&&activeMode==='campaign'?'Enter Endless':'Next Level '+(game.level+1)),cls:'pri',act:function(){hideOverlay();game.level++;startLevel(game.level)}}
    ]);
  }

  function gameOverOverlay(){
    arcade.record('fail',1);gameState='gameover'; stopLoop(); sfxGameOver();
    showOverlay('Game Over',best===game.score&&game.score>0?'New High Score!':'Final score','#EF4444',[
      {text:'New Game',cls:'pri',act:function(){hideOverlay();resetGame()}}
    ]);
  }

  function showOverlay(title,sub,clr,buttons){
    var ov=el('div','bk-overlay');
    var md=el('div','bk-modal');
    md.innerHTML='<h2 style="color:'+clr+'">'+title+'</h2>'
      +'<p class="bk-m-sub">'+sub+'</p>'
      +'<div class="bk-m-stats">'
      +'<div class="bk-msi"><div class="bk-msil">Score</div><div class="bk-msiv">'+game.score+'</div></div>'
      +'<div class="bk-msi"><div class="bk-msil">Best</div><div class="bk-msiv'+(best===game.score?' rec':'')+'">'+Math.max(game.score,best)+'</div></div>'
      +'<div class="bk-msi"><div class="bk-msil">Level</div><div class="bk-msiv" style="color:#8B5CF6">'+game.level+'</div></div>'
      +'<div class="bk-msi"><div class="bk-msil">Lives</div><div class="bk-msiv">'+game.lives+'</div></div>'
      +'</div><div class="bk-mb"></div>';
    var mb=md.querySelector('.bk-mb');
    for(var i=0;i<buttons.length;i++){
      var btn=el('button','bk-mbtn '+buttons[i].cls); btn.textContent=buttons[i].text;
      btn.addEventListener('click',buttons[i].act); mb.appendChild(btn);
    }
    ov.appendChild(md); root.appendChild(ov);
  }

  function hideOverlay(){
    var ov=root.querySelector('.bk-overlay'); if(ov) ov.remove();
  }

  function showPause(){
    var p=el('div','bk-pause'); p.textContent='PAUSED'; p.id='bk-pause';
    root.appendChild(p);
  }

  function hidePause(){
    var p=root.querySelector('#bk-pause'); if(p) p.remove();
  }

  function showReadyHint(){
    var h=root.querySelector('#bk-ready-hint'); if(!h){
      h=el('div','bk-ready-text'); h.id='bk-ready-hint'; h.textContent='Click or press Space to launch';
      root.appendChild(h);
    }
  }

  function hideReadyHint(){
    var h=root.querySelector('#bk-ready-hint'); if(h) h.remove();
  }

  function showHelp(){
    var ov=el('div','bk-help-modal'),bx=el('div','bk-help-box');
    bx.innerHTML='<div class="bk-help-head"><h2 class="bk-help-title">How to Play</h2><button class="bk-help-close" data-close>&times;</button></div>'
      +'<div class="bk-help-body">'
      +'<h3>Goal</h3><p>Bounce the ball off your paddle to destroy all the bricks. Clear the board to advance levels!</p>'
      +'<h3>Controls</h3><ul><li><b>Mouse / Touch</b> \u2014 Move paddle left and right</li><li><b>Arrow Keys / A/D</b> \u2014 Move paddle</li><li><b>Space / P</b> \u2014 Pause or launch ball</li></ul>'
      +'<h3>Bricks</h3><p>Bricks have 1\u20133 hit points. Top rows are worth more points but have fewer HP. Cracked bricks need more hits.</p>'
      +'<h3>Power-ups</h3><ul>'
      +'<li><span class="bk-pu-dot" style="background:#FBBF24"></span><b>Multi-ball</b> '+"\u2014"+' Split into multiple balls</li>'
      +'<li><span class="bk-pu-dot" style="background:#3B82F6"></span><b>Wide Paddle</b> '+"\u2014"+' Double width for 15s</li>'
      +'<li><span class="bk-pu-dot" style="background:#22C55E"></span><b>Slow Ball</b> '+"\u2014"+' Half speed for 10s</li>'
      +'<li><span class="bk-pu-dot" style="background:#EF4444"></span><b>Extra Life</b> '+"\u2014"+' +1 life (max 9)</li>'
      +'<li><span class="bk-pu-dot" style="background:#8B5CF6"></span><b>Laser</b> '+"\u2014"+' Paddle shoots lasers for 10s</li>'
      +'</ul></div>';
    ov.appendChild(bx);
    function close(){ov.remove();window.removeEventListener('keydown',kfn)}
    function kfn(e){if(e.key==='Escape') close()}
    ov.addEventListener('click',function(e){if(e.target===ov) close()});
    bx.querySelector('[data-close]').addEventListener('click',close);
    window.addEventListener('keydown',kfn);
    root.appendChild(ov);
  }

  function resetGame(){
    activeMode=arcade.mode().id;activePerk=arcade.perk().id;game=new Game();if(activeMode==='blitz')game.lives=2;if(activePerk==='wide')game.effects.wide=Date.now()+12000; ballLaunched=false; gameState='ready';
    brickWrap.innerHTML=''; brickEls={};
    for(var k in ballEls){ballEls[k].remove()} ballEls={};
    lastTime=0; keys={};
    lastLayoutW=gameEl.offsetWidth;lastLayoutH=gameEl.offsetHeight;startLevel(1);renderPaddle();updUI();arcade.record('start',1);arcade.showToast('▦',activeMode.toUpperCase(),activePerk.replace(/_/g,' ')+' perk active');
    restartReady();
    startLoop();
  }

  function startLevel(lvl){
    game.level=lvl; game.balls=[]; game.powerups=[]; game.lasers=[]; ballLaunched=false;
    game.ballSpeed=BASE_SPEED+lvl*.25+(activeMode==='blitz'?1.25:0);
    createBricks(lvl);
    var gw=gameEl.offsetWidth;
    if(!paddleX||paddleX<getPaddleW()/2||paddleX>gw-getPaddleW()/2) paddleX=gw/2;
    var b=spawnBall(paddleX,0,0,0);
    ballEls={}; renderBalls(); renderPowerups(); renderLasers(); renderPaddle(); updUI();
    restartReady();
  }

  function restartReady(){
    ballLaunched=false; gameState='ready';
    if(readyTimer) clearTimeout(readyTimer);
    showReadyHint();
    readyTimer=setTimeout(function(){
      if(gameState==='ready'&&!ballLaunched){
        hideReadyHint();
        ballLaunched=true; gameState='playing';
        var b=game.balls[0]; if(b){b.x=paddleX;b.y=gameEl.offsetHeight-32-BALL_R;launchBall(b)}
      }
    },1000);
  }

  function loseBall(ball){
    var idx=game.balls.indexOf(ball); if(idx>=0) game.balls.splice(idx,1);
    if(ballEls[ball.id]){ballEls[ball.id].remove();delete ballEls[ball.id]}
    if(game.balls.length===0){
      if(activePerk==='shield'&&!game.shieldUsed){game.shieldUsed=true;arcade.showToast('🛡','Floor shield','The lost ball was recovered.');}
      else {sfxLoseLife(); game.lives--;}
      game.combo=0;
      if(game.lives<=0){gameOverOverlay(); updUI(); return}
      var b=spawnBall(paddleX,0,0,0);
      updUI(); renderBalls(); restartReady();
    }else{
      updUI();
    }
  }

  function gameLoop(time){
    animId=requestAnimationFrame(gameLoop);
    if(gameState==='gameover'||gameState==='levelcomplete'||gameState==='paused'){lastTime=time; return}
    if(gameState==='ready'){
      var b0=game.balls[0]; if(b0){b0.x=paddleX;b0.y=gameEl.offsetHeight-32-BALL_R}
      renderBalls(); renderPaddle(); updUI();
      lastTime=time; return;
    }
    if(!lastTime) lastTime=time;
    var dt=(time-lastTime)/16.667; if(dt>3) dt=3; lastTime=time;
    updateEffects();

    var pw=getPaddleW(),phw=pw/2;
    var gh=gameEl.offsetHeight,gw=gameEl.offsetWidth;
    var py=gh-14-PADDLE_H;

    if(keys.ArrowLeft||keys.a||keys.A) paddleX-=6*dt;
    if(keys.ArrowRight||keys.d||keys.D) paddleX+=6*dt;
    paddleX=Math.max(phw,Math.min(gw-phw,paddleX));

    var bs=game.ballSpeed*dt;
    for(var i=game.balls.length-1;i>=0;i--){
      var bl=game.balls[i];
      bl.speed=bs/dt;
      bl.x+=bl.dx*dt; bl.y+=bl.dy*dt;
      if(bl.x-BALL_R<=0){bl.x=BALL_R;bl.dx=Math.abs(bl.dx);sfxBounce()}
      if(bl.x+BALL_R>=gw){bl.x=gw-BALL_R;bl.dx=-Math.abs(bl.dx);sfxBounce()}
      if(bl.y-BALL_R<=0){bl.y=BALL_R;bl.dy=Math.abs(bl.dy);sfxBounce()}
      if(bl.y>gh+BALL_R){loseBall(bl); continue}
      if(bl.y+BALL_R>=py&&bl.x>=paddleX-phw&&bl.x<=paddleX+phw){
        bl.y=py-BALL_R;
        calcBallAngle(bl,paddleX,phw);game.combo=Math.max(0,game.combo-2);sfxBounce();
      }
      var sp=(game.effects.slow>Date.now()?BASE_SPEED*.5:BASE_SPEED)+game.level*.25;
      var mag=Math.sqrt(bl.dx*bl.dx+bl.dy*bl.dy);
      if(mag>0){bl.dx=bl.dx/mag*sp;bl.dy=bl.dy/mag*sp}
      checkBrickCollision(bl);
      if(checkAllBricksDestroyed()){levelComplete(); return}
    }

    for(var i=game.powerups.length-1;i>=0;i--){
      var pu=game.powerups[i];
      pu.y+=pu.vy*dt;
      if(pu.y>gh){game.powerups.splice(i,1);continue}
      var pux=pu.x,puy=pu.y+12;
      if(puy>=py-6&&puy<=py+6+PADDLE_H&&pux>=paddleX-phw-6&&pux<=paddleX+phw+6){
        sfxPowerup(); applyPowerup(pu.type); game.powerups.splice(i,1);
      }
    }

    if(game.effects.laser>Date.now()){
      if(!game.lastLaser||time-game.lastLaser>=LASER_INT){
        game.lastLaser=time;
        game.lasers.push({x:paddleX,y:py-10});
        sfxLaser();
      }
    }
    for(var i=game.lasers.length-1;i>=0;i--){
      var lr=game.lasers[i];
      lr.y-=LASER_SPEED*dt;
      if(lr.y<-10){game.lasers.splice(i,1);continue}
      for(var j=0;j<game.bricks.length;j++){
        var bk=game.bricks[j]; if(!bk.alive) continue;
        if(lr.x>=bk.x&&lr.x<=bk.x+bk.w&&lr.y>=bk.y&&lr.y<=bk.y+bk.h){
          bk.hp--;
          game.lasers.splice(i,1);
          if(bk.hp<=0){
            bk.alive=false; if(bk.el){bk.el.remove();bk.el=null}
            var brickPts=BRICK_SCORES[Math.min(bk.row,BRICK_SCORES.length-1)]*(1+Math.min(1.5,game.combo*.05));game.score+=Math.round(brickPts);game.combo++;game.bestCombo=Math.max(game.bestCombo,game.combo);arcade.record('brick',1);arcade.record('combo',game.combo);
            if(Math.random()<(activePerk==='fortune'?POWERUP_CHANCE*1.8:POWERUP_CHANCE)) spawnPowerup(bk.x+bk.w/2,bk.y+bk.h/2);
            sfxBrickHit();
          }else{
            bk.el.setAttribute('data-hp',bk.hp);
            if(bk.hp===1) bk.el.style.backgroundImage='repeating-linear-gradient(45deg,transparent,transparent 2px,rgba(0,0,0,.3) 2px,rgba(0,0,0,.3) 4px)';
            sfxBrickHit();
          }
          if(checkAllBricksDestroyed()){levelComplete(); return}
          break;
        }
      }
    }

    renderBalls(); renderPaddle(); renderPowerups(); renderLasers(); updUI();
  }

  function startLoop(){
    stopLoop(); lastTime=0; animId=requestAnimationFrame(gameLoop);
  }

  function stopLoop(){if(animId){cancelAnimationFrame(animId);animId=null}}

  function togglePause(){
    if(gameState==='gameover'||gameState==='levelcomplete') return;
    if(gameState==='paused'){gameState='playing';hidePause();startLoop()}
    else if(gameState==='playing'){gameState='paused';showPause();stopLoop()
    }else if(gameState==='ready'){gameState='paused';showPause();if(readyTimer){clearTimeout(readyTimer);readyTimer=null};stopLoop()}
  }

  function launchFromReady(){
    if(gameState!=='ready') return;
    if(readyTimer){clearTimeout(readyTimer);readyTimer=null}
    hideReadyHint();
    ballLaunched=true; gameState='playing';
    var b=game.balls[0]; if(b){b.x=paddleX;b.y=gameEl.offsetHeight-32-BALL_R;launchBall(b)}
    startLoop();
  }

  function onKeyDown(e){
    if(!game||gameState==='gameover'||gameState==='levelcomplete') return;
    if(e.key===' '||e.key==='Spacebar'||e.key==='p'||e.key==='P'){
      e.preventDefault();
      if(gameState==='ready'){launchFromReady();return}
      if(gameState==='paused'){togglePause();return}
      togglePause();return;
    }
    if(gameState==='paused') return;
    if(e.key==='ArrowLeft'||e.key==='ArrowRight'||e.key==='a'||e.key==='A'||e.key==='d'||e.key==='D'){
      keys[e.key]=true; e.preventDefault();
    }
  }

  function onKeyUp(e){keys[e.key]=false}

  function onMouse(e){
    if(!game||gameState==='gameover'||gameState==='levelcomplete') return;
    if(gameState==='ready'){initA();launchFromReady();return}
    if(gameState==='paused') return;
    var rect=gameEl.getBoundingClientRect();
    paddleX=e.clientX-rect.left;
  }

  function onTouch(e){
    if(!game||gameState==='gameover'||gameState==='levelcomplete') return;
    if(gameState==='ready'){initA();launchFromReady();return}
    if(gameState==='paused') return;
    var rect=gameEl.getBoundingClientRect();
    paddleX=e.touches[0].clientX-rect.left;
    e.preventDefault();
  }

  removeArcadeChange=arcade.onChange(function(){
    activeMode=arcade.mode().id;activePerk=arcade.perk().id;arcade.closeHub();
    if(root){resetGame()}
  });

  return {
    mount:function(container){
      container.innerHTML='';
      root=el('div','bk-r'); container.appendChild(root);
      arcade.mount(root, container);
      root.style.position = 'relative';

      var bar=el('div','bk-bar');
      bar.innerHTML=''
        +'<div class="bk-stat"><div class="bk-stat-l">Score</div><div class="bk-stat-v sc" id="bk-score">0</div></div>'
        +'<div class="bk-stat"><div class="bk-stat-l">Lives</div><div class="bk-lives bk-stat-v" id="bk-lives" style="color:#EF4444">\u2665\u2665\u2665</div></div>'
        +'<div class="bk-stat"><div class="bk-stat-l">Level</div><div class="bk-stat-v lv" id="bk-level">1</div></div>'
        +'<div class="bk-stat"><div class="bk-stat-l">Best</div><div class="bk-stat-v bs" id="bk-best">0</div></div>'
        +'<button class="bk-help" title="How to play" aria-label="Help">?</button>';
      root.appendChild(bar);

      gameEl=el('div','bk-game'); root.appendChild(gameEl);

      brickWrap=el('div'); brickWrap.style.cssText='position:absolute;inset:0;z-index:5;pointer-events:none';
      gameEl.appendChild(brickWrap);

      puWrap=el('div','bk-pu-wrap'); gameEl.appendChild(puWrap);
      laserWrap=el('div','bk-laser-wrap'); gameEl.appendChild(laserWrap);
      ballsWrap=el('div'); ballsWrap.style.cssText='position:absolute;inset:0;z-index:10;pointer-events:none';
      gameEl.appendChild(ballsWrap);

      paddleEl=el('div','bk-paddle'); gameEl.appendChild(paddleEl);

      bar.querySelector('.bk-help').addEventListener('click',showHelp);

      gameEl.addEventListener('mousemove',onMouse,{passive:true});
      gameEl.addEventListener('click',function(e){
        if(gameState==='gameover'||gameState==='levelcomplete') return;
        if(gameState==='ready'){initA();launchFromReady();return}
      });
      gameEl.addEventListener('touchmove',onTouch,{passive:false});
      gameEl.addEventListener('touchstart',function(e){
        if(gameState==='ready'){initA();launchFromReady()}
      });
      window.addEventListener('keydown',onKeyDown);
      window.addEventListener('keyup',onKeyUp);

      game=new Game();
      resetGame();
      if(typeof ResizeObserver==='function'){resizeObserver=new ResizeObserver(function(){requestAnimationFrame(layoutGame)});resizeObserver.observe(gameEl)}
      else window.addEventListener('resize',layoutGame);
    },
    unmount:function(){if(resizeObserver){resizeObserver.disconnect();resizeObserver=null}else window.removeEventListener('resize',layoutGame);removeArcadeChange?.();arcade.cleanup();
      stopLoop(); if(readyTimer) clearTimeout(readyTimer);
      window.removeEventListener('keydown',onKeyDown);
      window.removeEventListener('keyup',onKeyUp);if(audio){audio.close().catch(function(){});audio=null}
    }
  };
}
