import { createArcade, setTimeout, clearTimeout, setInterval, clearInterval, requestAnimationFrame, cancelAnimationFrame } from './arcade-kit.js';
var STYLE_ID = 'tend-ext-2048-styles';
var SIZE = 4;
var TF_ACTIVE_PERK='golden';
var TF_ACTIVE_MODE='classic';

var TILE_COLORS = {
  2:{bg:'#eee4da',fg:'#776e65',s:'30px',glow:null},4:{bg:'#ede0c8',fg:'#776e65',s:'30px',glow:null},
  8:{bg:'#f2b179',fg:'#f9f6f2',s:'30px',glow:null},16:{bg:'#f59563',fg:'#f9f6f2',s:'30px',glow:null},
  32:{bg:'#f67c5f',fg:'#f9f6f2',s:'30px',glow:null},64:{bg:'#f65e3b',fg:'#f9f6f2',s:'30px',glow:null},
  128:{bg:'#edcf72',fg:'#f9f6f2',s:'26px',glow:'0 0 12px rgba(237,207,114,.7),0 0 24px rgba(237,207,114,.3)'},
  256:{bg:'#edcc61',fg:'#f9f6f2',s:'26px',glow:'0 0 14px rgba(237,204,97,.8),0 0 28px rgba(237,204,97,.4)'},
  512:{bg:'#edc850',fg:'#f9f6f2',s:'26px',glow:'0 0 16px rgba(237,200,80,.9),0 0 32px rgba(237,200,80,.5)'},
  1024:{bg:'#edc53f',fg:'#f9f6f2',s:'22px',glow:'0 0 18px rgba(237,197,63,1),0 0 36px rgba(237,197,63,.6),0 0 8px #fff'},
  2048:{bg:'#edc22e',fg:'#f9f6f2',s:'22px',glow:'0 0 22px rgba(237,194,46,1),0 0 44px rgba(237,194,46,.7),0 0 10px #fff'},
  4096:{bg:'#3c3a32',fg:'#f9f6f2',s:'20px',glow:'0 0 18px rgba(139,92,246,.9),0 0 36px rgba(139,92,246,.5)'},
  8192:{bg:'#3c3a32',fg:'#f9f6f2',s:'18px',glow:'0 0 20px rgba(236,72,153,.9),0 0 40px rgba(236,72,153,.5)'},
  16384:{bg:'#3c3a32',fg:'#f9f6f2',s:'16px',glow:'0 0 22px rgba(239,68,68,.9),0 0 44px rgba(239,68,68,.5)'}
};

function ensureStyles(){
  if(document.getElementById(STYLE_ID))return;
  var s=document.createElement('style');s.id=STYLE_ID;
  s.textContent=[
'@keyframes tfPop{0%{transform:scale(0);opacity:0}60%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}',
'@keyframes tfMerge{0%{transform:scale(1)}40%{transform:scale(1.3)}100%{transform:scale(1)}}',
'@keyframes tfFade{from{opacity:0}to{opacity:1}}',
'@keyframes tfPopModal{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}',
'.tfr{width:100%;height:100%;display:flex;flex-direction:column;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;user-select:none;-webkit-user-select:none;overflow:hidden;background:linear-gradient(180deg,#0B0E1A 0%,#0a0d1a 50%,#0d0f1f 100%);color:#E2E8F0;position:relative}',
'.tf-bar{display:flex;align-items:center;gap:8px;padding:10px 12px;flex-shrink:0}',
'.tf-title-block{flex:1}',
'.tf-title{font-size:32px;font-weight:900;margin:0;background:linear-gradient(135deg,#FBBF24,#F97316);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;letter-spacing:1px}',
'.tf-sub{font-size:11px;color:#64748B;font-weight:600;text-transform:uppercase;letter-spacing:1px}',
'.tf-score-box{text-align:right;padding:6px 12px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:10px;min-width:70px}',
'.tf-score-label{font-size:8px;text-transform:uppercase;letter-spacing:1.4px;color:#64748B;font-weight:700}',
'.tf-score-val{font-size:20px;font-weight:900;color:#FBBF24;font-variant-numeric:tabular-nums}',
'.tf-best-box{text-align:right;padding:6px 12px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.05);border-radius:10px;min-width:70px}',
'.tf-best-label{font-size:8px;text-transform:uppercase;letter-spacing:1.4px;color:#64748B;font-weight:700}',
'.tf-best-val{font-size:16px;font-weight:900;color:#F97316;font-variant-numeric:tabular-nums}',
'.tf-help{width:32px;height:32px;border-radius:9px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:#94A3B8;cursor:pointer;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:15px;transition:all .15s;font-family:inherit;flex-shrink:0}',
'.tf-help:hover{background:rgba(255,255,255,.1);color:#fff;transform:translateY(-1px)}',
'.tf-board-wrap{flex:1;display:flex;align-items:center;justify-content:center;padding:10px;min-height:0}',
'.tf-board{width:100%;height:100%;max-width:100%;max-height:100%;aspect-ratio:1;position:relative;border-radius:14px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.05);box-shadow:0 8px 32px rgba(0,0,0,.5),inset 0 0 40px rgba(0,0,0,.3),inset 0 2px 0 rgba(255,255,255,.04)}',
'.tf-bg{position:absolute;inset:8px;display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(4,1fr);gap:8px}',
'.tf-bc{border-radius:8px;background:rgba(255,255,255,.03)}',
'.tf-tiles{position:absolute;inset:8px}',
'.tf-tile{position:absolute;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:900;transition:left .1s ease,top .1s ease,box-shadow .15s cubic-bezier(.34,1.56,.64,1),transform .15s cubic-bezier(.34,1.56,.64,1);box-shadow:0 2px 8px rgba(0,0,0,.25)}',
'.tf-tile.new{animation:tfPop .22s ease}',
'.tf-tile.merged{animation:tfMerge .2s ease;z-index:2}',
'.tf-ctrls{display:flex;gap:6px;flex-shrink:0;padding:8px}',
'.tf-ctrl{flex:1;padding:8px 14px;border-radius:10px;border:1px solid;font-weight:700;font-size:11px;cursor:pointer;font-family:inherit;transition:all .15s;letter-spacing:.5px}',
'.tf-ctrl:hover{transform:translateY(-1px)}',
'.tf-ctrl.pri{border-color:#A855F7;color:#fff;background:linear-gradient(135deg,rgba(168,85,247,.2),rgba(236,72,153,.15))}',
'.tf-ctrl.sec{border-color:rgba(255,255,255,.1);color:#94A3B8;background:rgba(255,255,255,.03)}',
'.tf-overlay{position:absolute;inset:0;background:rgba(0,0,0,.75);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;z-index:50;padding:14px;animation:tfFade .2s ease}',
'.tf-modal{background:linear-gradient(180deg,#1A1F35,#15192a);border:1px solid rgba(255,255,255,.1);border-radius:18px;padding:24px 22px;text-align:center;max-width:320px;width:100%;animation:tfPopModal .35s ease;box-shadow:0 24px 60px rgba(0,0,0,.7)}',
'.tf-modal h2{font-size:24px;font-weight:900;margin:0 0 6px}',
'.tf-modal .tf-m-sub{color:#94A3B8;font-size:13px;margin:0 0 14px}',
'.tf-m-stats{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:8px 0 14px}',
'.tf-msi{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:8px}',
'.tf-msil{font-size:10px;color:#94A3B8;font-weight:600;text-transform:uppercase;letter-spacing:1px}',
'.tf-msiv{font-size:18px;font-weight:900;color:#fff;margin-top:2px}',
'.tf-mb{display:flex;gap:8px;justify-content:center}',
'.tf-mbtn{padding:9px 22px;border-radius:10px;border:none;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;transition:transform .15s}',
'.tf-mbtn:hover{transform:translateY(-1px)}',
'.tf-mbtn.pri{background:linear-gradient(135deg,#A855F7,#EC4899);color:#fff;box-shadow:0 4px 18px rgba(168,85,247,.35)}',
'.tf-mbtn.sec{background:rgba(255,255,255,.06);color:#E2E8F0;border:1px solid rgba(255,255,255,.1)}',
'.tf-toast{position:absolute;bottom:66px;left:50%;transform:translateX(-50%) translateY(60px);background:rgba(15,23,42,.95);border:1px solid rgba(255,255,255,.08);color:#fff;padding:8px 16px;border-radius:10px;font-weight:700;z-index:100;transition:transform .4s cubic-bezier(.34,1.56,.64,1);white-space:nowrap;font-size:12px}',
'.tf-toast.show{transform:translateX(-50%) translateY(0)}',
'.tf-help-modal{position:absolute;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;z-index:50;padding:14px;animation:tfFade .2s ease}',
'.tf-help-box{background:linear-gradient(180deg,#1A1F35,#15192a);border:1px solid rgba(255,255,255,.1);border-radius:18px;padding:20px;max-width:340px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.6);animation:tfPopModal .3s ease}',
'.tf-help-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}',
'.tf-help-title{font-size:18px;font-weight:800;color:#fff;margin:0;display:flex;align-items:center;gap:8px}',
'.tf-help-close{width:28px;height:28px;border-radius:8px;border:none;background:rgba(255,255,255,.06);color:#94A3B8;cursor:pointer;font-size:18px;line-height:1;font-family:inherit;transition:all .15s}',
'.tf-help-close:hover{background:rgba(255,255,255,.12);color:#fff}',
'.tf-help-body{font-size:13px;line-height:1.55;color:#CBD5E1}',
'.tf-help-body h3{font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#94A3B8;margin:14px 0 6px;font-weight:700}',
'.tf-help-body h3:first-child{margin-top:0}',
'.tf-help-body ul{margin:0;padding-left:18px}',
'.tf-help-body li{margin:3px 0}'
  ].join('');
  document.head.appendChild(s);
}

function el(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html)e.innerHTML=html;return e}

function Game(){
  this.grid=[];this.score=0;this.over=false;this.won=false;this.moves=0;this.target=2048;this.lastPoints=0;
  this.mergedPositions=null;this.spawnedPositions=null;
  for(var r=0;r<SIZE;r++){this.grid[r]=[];for(var c=0;c<SIZE;c++)this.grid[r][c]=0}
}
Game.prototype.serialize=function(){
  var g=[];for(var r=0;r<SIZE;r++)for(var c=0;c<SIZE;c++)g.push(this.grid[r][c]);
  return {grid:g,score:this.score,over:this.over,won:this.won,moves:this.moves,target:this.target||2048};
};
Game.prototype.restore=function(s){
  if(!s||!s.grid||s.grid.length!==SIZE*SIZE) return false;
  this.score=s.score||0;this.over=s.over||false;this.won=s.won||false;this.moves=s.moves||0;this.target=s.target||2048;
  for(var r=0;r<SIZE;r++) for(var c=0;c<SIZE;c++) this.grid[r][c]=s.grid[r*SIZE+c];
  return true;
};
Game.prototype.spawn=function(){
  var e=[];for(var r=0;r<SIZE;r++) for(var c=0;c<SIZE;c++) if(!this.grid[r][c]) e.push({r:r,c:c});
  if(!e.length) return null;
  var p=e[Math.floor(Math.random()*e.length)];
  var roll=Math.random();
  this.grid[p.r][p.c]=(TF_ACTIVE_PERK==='golden'&&roll>.965)?8:(roll<.9?2:4);return p;
};
Game.prototype.newGame=function(){
  for(var r=0;r<SIZE;r++) for(var c=0;c<SIZE;c++) this.grid[r][c]=0;
  this.score=0;this.over=false;this.won=false;this.moves=0;this.target=2048;this.lastPoints=0;
  this.spawn();this.spawn();
};
Game.prototype.canMove=function(){
  for(var r=0;r<SIZE;r++) for(var c=0;c<SIZE;c++){
    if(!this.grid[r][c]) return true;
    if(c<SIZE-1&&this.grid[r][c]===this.grid[r][c+1]) return true;
    if(r<SIZE-1&&this.grid[r][c]===this.grid[r+1][c]) return true;
  }
  return false;
};
Game.prototype.move=function(dir){
  this.mergedPositions=new Set();this.spawnedPositions=new Set();
  var old=[];for(var r=0;r<SIZE;r++){old[r]=[];for(var c=0;c<SIZE;c++)old[r][c]=this.grid[r][c]}
  var points=0;

  function slide(arr){
    var f=[];for(var i=0;i<arr.length;i++) if(arr[i].v) f.push(arr[i]);
    var out=[],i=0;
    while(i<f.length){
      if(i+1<f.length&&f[i].v===f[i+1].v){var mv=f[i].v*2;out.push({v:mv});points+=mv;i+=2}
      else{out.push({v:f[i].v});i++}
    }
    return out;
  }

  if(dir==='left'){
    for(var r=0;r<SIZE;r++){
      var a=[];for(var c=0;c<SIZE;c++) a.push({v:this.grid[r][c]});
      var res=slide(a);for(var c=0;c<SIZE;c++) this.grid[r][c]=c<res.length?res[c].v:0;
    }
  }else if(dir==='right'){
    for(var r=0;r<SIZE;r++){
      var a=[];for(var c=SIZE-1;c>=0;c--) a.push({v:this.grid[r][c]});
      var res=slide(a);for(var c=0;c<SIZE;c++) this.grid[r][SIZE-1-c]=c<res.length?res[c].v:0;
    }
  }else if(dir==='up'){
    for(var c=0;c<SIZE;c++){
      var a=[];for(var r=0;r<SIZE;r++) a.push({v:this.grid[r][c]});
      var res=slide(a);for(var r=0;r<SIZE;r++) this.grid[r][c]=r<res.length?res[r].v:0;
    }
  }else if(dir==='down'){
    for(var c=0;c<SIZE;c++){
      var a=[];for(var r=SIZE-1;r>=0;r--) a.push({v:this.grid[r][c]});
      var res=slide(a);for(var r=0;r<SIZE;r++) this.grid[SIZE-1-r][c]=r<res.length?res[r].v:0;
    }
  }

  var changed=false;
  for(var r=0;r<SIZE;r++) for(var c=0;c<SIZE;c++) if(this.grid[r][c]!==old[r][c]){changed=true;break}
  if(!changed) return false;

  this.lastPoints=points;this.score+=points;this.moves++;

  // Track merged positions by finding cells where val != old[r][c] and val > old[r][c] (new combined tile)
  for(var r=0;r<SIZE;r++) for(var c=0;c<SIZE;c++){
    if(this.grid[r][c]&&old[r][c]&&this.grid[r][c]>old[r][c]) this.mergedPositions.add(r+','+c);
    if(this.grid[r][c]&&this.grid[r][c]>=2048&&!this.won) this.won=true;
  }

  var sp=this.spawn(); if(sp) this.spawnedPositions.add(sp.r+','+sp.c);
  if(!this.canMove()) this.over=true;
  return true;
};
Game.prototype.maxTile=function(){
  var m=0;for(var r=0;r<SIZE;r++)for(var c=0;c<SIZE;c++) if(this.grid[r][c]>m) m=this.grid[r][c];return m;
};

function tilePos(r,c,bw,bh){
  var gap=8,p=8,cellW=(bw-p*2-gap*5)/4,cellH=(bh-p*2-gap*5)/4,cell=Math.min(cellW,cellH);
  var offXAll=(cell+gap)*4+gap,offYAll=(cell+gap)*4+gap;
  var offX=p+(bw-p*2-offXAll)/2,offY=p+(bh-p*2-offYAll)/2;
  return{left:offX+gap+(cell+gap)*c,top:offY+gap+(cell+gap)*r,w:cell,h:cell};
}

function makeTile(v,r,c,bw,bh){
  var d=el('div','tf-tile'),p=tilePos(r,c,bw,bh);
  d.style.width=p.w+'px';d.style.height=p.h+'px';d.style.left=p.left+'px';d.style.top=p.top+'px';
  var col=TILE_COLORS[v]||TILE_COLORS[16384];
  d.style.background=col.bg;d.style.color=col.fg;d.style.fontSize=col.s;
  if(col.glow) d.style.boxShadow=col.glow+',0 2px 8px rgba(0,0,0,.25)';
  d.textContent=v;d.dataset.r=r;d.dataset.c=c;d.dataset.v=v;
  return d;
}

export default function activate(host){
  const arcade = createArcade(host, {"name":"2048 Odyssey","icon":"⬡","subtitle":"Merge mastery across an endless target ladder","modes":[{"id":"classic","name":"Classic","icon":"◆","desc":"Pure 2048 with target milestones","unlock":1},{"id":"rush","name":"Rush","icon":"⚡","desc":"Hesitation spawns pressure tiles","unlock":2},{"id":"zen","name":"Zen","icon":"∞","desc":"Slower rewards with one recovery rewind","unlock":4}],"perks":[{"id":"golden","name":"Golden Spawn","icon":"✦","desc":"Small chance for a higher-value tile","unlock":1},{"id":"combo","name":"Merge Bank","icon":"×2","desc":"Consecutive merge turns score more","unlock":3},{"id":"rescue","name":"Second Grid","icon":"↶","desc":"One emergency rescue each run","unlock":6}],"missions":[{"event":"merge","target":80,"title":"Merge Architect","detail":"Create 80 merged tiles","icon":"⬡","reward":80},{"event":"score","target":12000,"title":"Number Hunter","detail":"Earn 12,000 score","icon":"★","reward":90},{"event":"target","target":2,"title":"Milestone Climber","detail":"Reach two target tiles","icon":"🏆","reward":110}]});

  ensureStyles();
  var root=null,game=null,best=0,tileEls={},tileLayer=null,toastT=null,audio=null;
  var history=[],mergeStreak=0,rescueUsed=false,lastTarget=2048;

  host.storage.get('2048_best').then(function(v){if(typeof v==='number') best=v}).catch(function(){});
  var saveP=host.storage.get('2048_save').catch(function(){});
  arcade.ready.then(function(){TF_ACTIVE_MODE=arcade.mode().id;TF_ACTIVE_PERK=arcade.perk().id;});
  arcade.onChange(function(){arcade.showToast('◆','Setup changed','New mode and perk apply on the next game.');});

  function initA(){if(!audio) try{audio=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}
  function resA(){if(audio&&audio.state==='suspended') audio.resume()}
  function tone(f,d,t,v){if(!audio) return;resA();var o=audio.createOscillator(),g=audio.createGain();o.type=t||'sine';o.frequency.setValueAtTime(f,audio.currentTime);g.gain.setValueAtTime(v||.08,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+d);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+d)}
  function sfxSlide(){tone(300,.05,'sine',.06)}
  function sfxMerge(){tone(600,.08,'triangle',.1);setTimeout(function(){tone(900,.08,'triangle',.08)},60)}
  function sfxWin(){[523,659,784,1047].forEach(function(f,i){setTimeout(function(){tone(f,.18,'sine',.12)},i*100)})}
  function sfxFail(){tone(180,.18,'sawtooth',.05)}
  function toast(msg,col){var t=root.querySelector('.tf-toast');if(!t) return;clearTimeout(toastT);t.textContent=msg;t.style.color=col||'#fff';t.classList.add('show');toastT=setTimeout(function(){t.classList.remove('show')},1800)}

  function showHelp(){
    var m=el('div','tf-help-modal'),b=el('div','tf-help-box');
    b.innerHTML=''
      +'<div class="tf-help-head"><h2 class="tf-help-title"><span>🔥</span> How to Play</h2><button class="tf-help-close" data-close>&times;</button></div>'
      +'<div class="tf-help-body">'
      +'<h3>Goal</h3><p>Reach the <b>2048 tile</b> by merging equal numbers. Keep going for higher scores!</p>'
      +'<h3>Controls</h3><ul><li><b>Arrow Keys</b> or <b>WASD</b> to slide tiles.</li><li><b>Swipe</b> on touch devices.</li><li>Tiles slide to the edge. Equal tiles merge into one.</li></ul>'
      +'<h3>Scoring</h3><p>Each merge adds the value of the new tile to your score. Higher tiles mean bigger points!</p>'
      +'</div>';
    m.appendChild(b);
    function close(){m.remove();window.removeEventListener('keydown',kfn)}
    function kfn(e){if(e.key==='Escape') close()}
    m.addEventListener('click',function(e){if(e.target===m) close()});
    b.querySelector('[data-close]').addEventListener('click',close);
    window.addEventListener('keydown',kfn);
    root.appendChild(m);
  }

  function renderTiles(){
    if(!tileLayer) return;
    var bw=tileLayer.clientWidth,bh=tileLayer.clientHeight;
    if(!bw||!bh) return;
    var seen={};
    for(var r=0;r<SIZE;r++) for(var c=0;c<SIZE;c++){
      var v=game.grid[r][c];if(!v) continue;
      var k=r+','+c;seen[k]=v;var tile=tileEls[k];
      if(!tile){
        tile=makeTile(v,r,c,bw,bh);
        if(game.spawnedPositions&&game.spawnedPositions.has(k)) tile.classList.add('new');
        tileLayer.appendChild(tile);tileEls[k]=tile;
      }else{
        var p=tilePos(r,c,bw,bh);
        tile.style.left=p.left+'px';tile.style.top=p.top+'px';
        tile.style.width=p.w+'px';tile.style.height=p.h+'px';
        var col=TILE_COLORS[v]||TILE_COLORS[16384];
        tile.style.background=col.bg;tile.style.color=col.fg;tile.style.fontSize=col.s;
        tile.style.boxShadow=col.glow?col.glow+',0 2px 8px rgba(0,0,0,.25)':'0 2px 8px rgba(0,0,0,.25)';
        tile.textContent=v;tile.dataset.v=v;
        if(game.mergedPositions&&game.mergedPositions.has(k)){
          tile.classList.add('merged');
          setTimeout(function(t){return function(){t.classList.remove('merged')}}(tile),250);
        }
        if(game.spawnedPositions&&game.spawnedPositions.has(k)){
          tile.classList.add('new');
          setTimeout(function(t){return function(){t.classList.remove('new')}}(tile),250);
        }
      }
    }
    for(var k in tileEls) if(!seen[k]){tileEls[k].remove();delete tileEls[k]}
  }

  function updateTargetHud(){var t=root&&root.querySelector('#tf-target');if(t)t.textContent=(game&&game.target)||2048;}

  function armPressure(){
    arcade.stopPressure();
    if(TF_ACTIVE_MODE==='rush')arcade.startPressure({enabled:true,grace:6500,countdown:3500,onExpire:function(){
      if(!game||game.over)return;var sp=game.spawn();game.score=Math.max(0,game.score-128);if(sp){if(!game.spawnedPositions)game.spawnedPositions=new Set();game.spawnedPositions.add(sp.r+','+sp.c);}renderTiles();updScore();arcade.showToast('⚡','Pressure tile','Hesitation spawned an extra tile and cost 128 score.');
    }});
  }

  function updScore(){
    var se=root.querySelector('#tf-score');if(se) se.textContent=game.score;
    var be=root.querySelector('#tf-best');if(be) be.textContent=Math.max(game.score,best);
    if(game.score>best){best=game.score;host.storage.set('2048_best',best).catch(function(){})}
    host.storage.set('2048_save',game.serialize()).catch(function(){});updateTargetHud();
  }

  function showWinModal(){
    var m=el('div','tf-overlay');
    m.innerHTML='<div class="tf-modal">'
      +'<h2 style="background:linear-gradient(135deg,#FBBF24,#F97316);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">You Win!</h2>'
      +'<p class="tf-m-sub">You reached '+game.target+'!</p>'
      +'<div class="tf-m-stats">'
      +  '<div class="tf-msi"><div class="tf-msil">Score</div><div class="tf-msiv" style="color:#FBBF24">'+game.score+'</div></div>'
      +  '<div class="tf-msi"><div class="tf-msil">Moves</div><div class="tf-msiv">'+game.moves+'</div></div>'
      +  '<div class="tf-msi"><div class="tf-msil">Max Tile</div><div class="tf-msiv" style="color:#F97316">'+game.maxTile()+'</div></div>'
      +  '<div class="tf-msi"><div class="tf-msil">Best</div><div class="tf-msiv" style="color:#A855F7">'+Math.max(game.score,best)+'</div></div>'
      +'</div>'
      +'<div class="tf-mb"><button class="tf-mbtn sec" data-a="quit">Quit</button><button class="tf-mbtn pri" data-a="continue">Continue</button></div></div>';
    root.appendChild(m);
    m.querySelector('[data-a="quit"]').addEventListener('click',function(){game.over=true;showGameOver()});
    m.querySelector('[data-a="continue"]').addEventListener('click',function(){m.remove()});
  }

  function showGameOver(){
    var m=el('div','tf-overlay');
    m.innerHTML='<div class="tf-modal">'
      +'<h2 style="color:#EF4444">Game Over</h2>'
      +'<p class="tf-m-sub">No more moves available</p>'
      +'<div class="tf-m-stats">'
      +  '<div class="tf-msi"><div class="tf-msil">Score</div><div class="tf-msiv" style="color:#FBBF24">'+game.score+'</div></div>'
      +  '<div class="tf-msi"><div class="tf-msil">Moves</div><div class="tf-msiv">'+game.moves+'</div></div>'
      +  '<div class="tf-msi"><div class="tf-msil">Max Tile</div><div class="tf-msiv" style="color:#F97316">'+game.maxTile()+'</div></div>'
      +  '<div class="tf-msi"><div class="tf-msil">Best</div><div class="tf-msiv" style="color:#A855F7">'+Math.max(game.score,best)+'</div></div>'
      +'</div>'
      +'<div class="tf-mb"><button class="tf-mbtn pri" data-a="new">New Game</button></div></div>';
    root.appendChild(m);
    m.querySelector('[data-a="new"]').addEventListener('click',function(){newGame()});
  }

  function doMove(dir){
    if(!game||game.over) return;
    initA();
    history.push(game.serialize());if(history.length>8)history.shift();
    var beforeScore=game.score,beforeTarget=game.target||2048;
    var changed=game.move(dir);
    renderTiles();
    if(!changed){history.pop();sfxFail();return}
    arcade.resetPressure();sfxSlide();
    var merged=game.mergedPositions?game.mergedPositions.size:0;
    if(merged>0){
      mergeStreak++;sfxMerge();arcade.record('merge',merged);arcade.record('combo',mergeStreak);
      if(TF_ACTIVE_PERK==='combo'&&mergeStreak>1){var bonus=Math.round((game.lastPoints||0)*Math.min(.75,(mergeStreak-1)*.15));game.score+=bonus;if(bonus)toast('MERGE BANK  +'+bonus,'#fbbf24');}
    }else mergeStreak=0;
    arcade.record('score',Math.max(0,game.score-beforeScore));
    if(game.maxTile()>=beforeTarget){
      game.won=true;lastTarget=beforeTarget;arcade.record('target',1,{achievement:beforeTarget>=4096?'tile_'+beforeTarget:null,title:beforeTarget+' tile forged',detail:'The target ladder continues.',coins:40});
      setTimeout(function(){sfxWin();showWinModal();game.target=beforeTarget*2;game.won=false;updateTargetHud()},350);
    }
    updScore();
    if(game.over){
      if(TF_ACTIVE_PERK==='rescue'&&!rescueUsed&&history.length){rescueUsed=true;game.restore(history.pop());game.over=false;game.spawn();renderTiles();updScore();arcade.showToast('↶','Second Grid activated','Your last playable board was restored.');}
      else setTimeout(function(){arcade.record('fail',1);showGameOver()},650);
    }
  }

  function newGame(){
    TF_ACTIVE_MODE=arcade.mode().id;TF_ACTIVE_PERK=arcade.perk().id;history=[];mergeStreak=0;rescueUsed=false;
    game=new Game();game.newGame();armPressure();arcade.record('start',1);
    for(var k in tileEls){tileEls[k].remove()}tileEls={};
    var m=root.querySelector('.tf-overlay');if(m) m.remove();
    renderTiles();updScore();
  }

  function handleResize(){
    if(!tileLayer) return;
    var bw=tileLayer.clientWidth,bh=tileLayer.clientHeight;if(!bw||!bh) return;
    for(var r=0;r<SIZE;r++) for(var c=0;c<SIZE;c++){
      var v=game.grid[r][c];if(!v) continue;
      var k=r+','+c,tile=tileEls[k];if(!tile) continue;
      var p=tilePos(r,c,bw,bh);
      tile.style.left=p.left+'px';tile.style.top=p.top+'px';
      tile.style.width=p.w+'px';tile.style.height=p.h+'px';
    }
  }

  var tsX=0,tsY=0;
  function ts(e){tsX=e.touches[0].clientX;tsY=e.touches[0].clientY}
  function te(e){
    var dx=e.changedTouches[0].clientX-tsX,dy=e.changedTouches[0].clientY-tsY;
    if(Math.abs(dx)<20&&Math.abs(dy)<20) return;
    if(Math.abs(dx)>Math.abs(dy)) doMove(dx>0?'right':'left');
    else doMove(dy>0?'down':'up');
  }

  function onKey(e){
    if(!game||game.over) return;
    var map={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down',a:'left',d:'right',w:'up',s:'down',A:'left',D:'right',W:'up',S:'down'};
    var dir=map[e.key];if(!dir) return;
    e.preventDefault();doMove(dir);
  }

  return {
    mount:function(container){
      root=el('div','tfr');container.innerHTML='';container.appendChild(root);
      arcade.mount(root, container);
      root.style.position = 'relative';

      var bar=el('div','tf-bar');
      bar.innerHTML='<div class="tf-title-block"><h1 class="tf-title">2048</h1><div class="tf-sub">Join the numbers</div></div>'
        +'<div class="tf-score-box"><div class="tf-score-label">Score</div><div class="tf-score-val" id="tf-score">0</div></div>'
        +'<div class="tf-best-box"><div class="tf-best-label">Target</div><div class="tf-best-val" id="tf-target" style="color:#67e8f9">2048</div></div>'
        +'<button class="tf-help" title="How to play" aria-label="Help">?</button>';
      root.appendChild(bar);

      var bw=el('div','tf-board-wrap');
      var board=el('div','tf-board');
      board.innerHTML='<div class="tf-bg">'+Array(16).fill('<div class="tf-bc"></div>').join('')+'</div><div class="tf-tiles"></div>';
      tileLayer=board.querySelector('.tf-tiles');
      bw.appendChild(board);root.appendChild(bw);

      var ctrls=el('div','tf-ctrls');
      ctrls.innerHTML='<button class="tf-ctrl sec" data-a="undo">Rewind</button><button class="tf-ctrl pri" data-a="new">New Game</button>';
      root.appendChild(ctrls);
      root.appendChild(el('div','tf-toast'));

      ctrls.querySelector('[data-a="new"]').addEventListener('click',function(){newGame()});
      ctrls.querySelector('[data-a="undo"]').addEventListener('click',function(){if(!game||!history.length)return toast('Nothing to rewind','#94a3b8');if(TF_ACTIVE_MODE!=='zen'&&TF_ACTIVE_PERK!=='rescue')return toast('Choose Zen or Second Grid','#fbbf24');game.restore(history.pop());game.over=false;renderTiles();updScore();arcade.resetPressure();toast('Board restored','#67e8f9');});
      bar.querySelector('.tf-help').addEventListener('click',showHelp);
      board.addEventListener('touchstart',ts,{passive:true});
      board.addEventListener('touchend',te,{passive:true});
      window.addEventListener('keydown',onKey);

      saveP.then(function(s){
        game=new Game();
        if(s&&typeof s==='object'&&game.restore(s)){renderTiles();updScore()}
        else newGame();
        armPressure();
      }).catch(function(){newGame()});

      if(window.ResizeObserver) new ResizeObserver(function(){handleResize()}).observe(tileLayer);
    },
    unmount:function(){arcade.cleanup();window.removeEventListener('keydown',onKey)}
  };
}