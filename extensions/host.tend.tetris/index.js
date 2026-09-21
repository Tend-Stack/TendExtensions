import { createArcade, setTimeout, clearTimeout, setInterval, clearInterval, requestAnimationFrame, cancelAnimationFrame } from './arcade-kit-v310.js';
var STYLE_ID='tend-tetris-ultra-style';
var TET_PERK='shield',TET_ARCADE=null;
function ensureStyle(){
  if(document.getElementById(STYLE_ID))return;
  var s=document.createElement('style');s.id=STYLE_ID;
  s.textContent='.tet-wrap{width:100%;height:100%;min-height:0;background:radial-gradient(circle at 50% 20%,#12203a 0,#070b18 38%,#02040b 100%);display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative;outline:none;touch-action:none;user-select:none;-webkit-user-select:none}'
    +'.tet-wrap canvas{display:block;position:absolute!important;left:50%!important;top:50%!important;transform:translate(-50%,-50%)!important;margin:0!important;max-width:100%;max-height:100%;filter:drop-shadow(0 28px 55px rgba(0,0,0,.58));touch-action:none}'
    +'.tet-wrap .tend-arcade-controls{top:10px!important;right:10px!important;bottom:auto!important;left:auto!important}'
    +'.tet-wrap .tend-arcade-hub{padding:0!important;align-items:stretch!important;justify-content:stretch!important;background:radial-gradient(circle at 22% 18%,rgba(6,182,212,.12),transparent 34%),radial-gradient(circle at 84% 82%,rgba(168,85,247,.13),transparent 38%),#060810!important}'
    +'.tet-wrap .tend-arcade-card{width:100%!important;height:100%!important;max-height:none!important;overflow-x:hidden!important;overflow-y:auto!important;scrollbar-gutter:stable;scrollbar-width:thin;scrollbar-color:#a855f7 rgba(15,23,42,.72);border:0!important;border-radius:0!important;box-shadow:none!important;background:linear-gradient(150deg,rgba(13,22,42,.92),rgba(4,8,20,.98))!important;padding:clamp(20px,3.2vw,44px)!important;display:grid!important;grid-template-columns:minmax(0,1.12fr) minmax(300px,.88fr)!important;grid-template-rows:auto auto auto auto auto auto auto!important;align-content:start!important;gap:clamp(12px,1.5vh,20px) clamp(18px,2.5vw,32px)!important}'
    +'.tet-wrap .tend-arcade-card::-webkit-scrollbar{width:11px}.tet-wrap .tend-arcade-card::-webkit-scrollbar-track{background:linear-gradient(180deg,rgba(6,182,212,.08),rgba(99,102,241,.1),rgba(236,72,153,.08));border-radius:999px;margin:14px 0}.tet-wrap .tend-arcade-card::-webkit-scrollbar-thumb{background:linear-gradient(180deg,#22d3ee 0%,#6366f1 46%,#a855f7 72%,#ec4899 100%);border:2px solid transparent;background-clip:padding-box;border-radius:999px;box-shadow:0 0 14px rgba(168,85,247,.55)}.tet-wrap .tend-arcade-card::-webkit-scrollbar-thumb:hover{background:linear-gradient(180deg,#67e8f9,#818cf8 46%,#c084fc 72%,#f472b6);background-clip:padding-box}'
    +'.tet-wrap .tend-arcade-head{grid-column:1/-1!important;margin:0!important;padding-bottom:14px!important;border-bottom:1px solid rgba(148,163,184,.13)}'
    +'.tet-wrap .tend-arcade-headcopy:before{content:"ARCADE PROFILE";display:block;margin-bottom:4px;color:#67e8f9;font-size:9px;font-weight:900;letter-spacing:2px}'
    +'.tet-wrap .tend-arcade-stats{grid-column:1/-1!important;margin:0!important;gap:10px!important;grid-template-columns:repeat(4,minmax(0,1fr))!important}'
    +'.tet-wrap .tend-arcade-stat{padding:clamp(12px,1.5vw,18px)!important;min-height:clamp(62px,8vh,82px)!important}'
    +'.tet-wrap .tend-arcade-launch{display:none;grid-column:1/-1;grid-row:3;align-items:center;justify-content:space-between;gap:18px;padding:15px 18px;border:1px solid rgba(99,102,241,.38);border-radius:18px;background:linear-gradient(115deg,rgba(37,45,101,.62),rgba(22,27,66,.72));box-shadow:0 18px 42px rgba(15,23,42,.32)}'
    +'.tet-wrap.tetris-home .tend-arcade-launch{display:flex}'
    +'.tet-wrap .tend-arcade-launch small{display:block;color:#67e8f9;font-size:8px;font-weight:900;letter-spacing:2px}'
    +'.tet-wrap .tend-arcade-launch b{display:block;margin-top:4px;color:#fff;font-size:17px}.tet-wrap .tend-arcade-launch span{display:block;margin-top:3px;color:#94a3b8;font-size:10px}'
    +'.tet-wrap .tend-arcade-play{min-width:210px;height:48px;padding:0 22px;border:1px solid rgba(255,255,255,.34);border-radius:14px;background:linear-gradient(105deg,#4f46e5,#7c3aed 62%,#db2777);color:#fff;font-size:12px;font-weight:900;letter-spacing:1px;cursor:pointer;box-shadow:0 14px 34px rgba(99,102,241,.35);transition:transform .16s,filter .16s}.tet-wrap .tend-arcade-play:hover{transform:translateY(-2px);filter:brightness(1.12)}'
    +'.tet-wrap.tetris-home .tend-arcade-controls,.tet-wrap.tetris-home .tend-arcade-close{display:none!important}'
    +'.tet-wrap.tetris-home .tend-arcade-head{flex-direction:column!important;justify-content:center!important;gap:10px!important;text-align:center!important}.tet-wrap.tetris-home .tend-arcade-headcopy{flex:none!important}.tet-wrap.tetris-home .tend-arcade-headcopy span{text-align:center!important}'
    +'.tet-wrap.tetris-home .tend-arcade-emblem{width:64px;height:64px;border-radius:19px;font-size:30px}'
    +'.tet-wrap.tetris-home .tend-arcade-headcopy:before{content:"NEON BLOCK ODYSSEY";color:#67e8f9}'
    +'.tet-wrap.tetris-home .tend-arcade-headcopy b{font-size:clamp(30px,4vw,48px);line-height:.96;letter-spacing:2px;color:#fff;text-shadow:0 0 12px #6366f1,0 0 30px rgba(168,85,247,.8)}'
    +'.tet-wrap .tend-arcade-section{margin:0!important;min-width:0}'
    +'.tet-wrap .tend-arcade-modes{grid-column:1/-1!important;grid-row:4!important;padding:clamp(14px,1.7vw,22px)!important;border:1px solid rgba(103,232,249,.13);border-radius:18px;background:rgba(7,16,31,.54)}'
    +'.tet-wrap .tend-arcade-daily{grid-column:1/-1!important;grid-row:5!important;padding:clamp(14px,1.7vw,22px)!important;border:1px solid rgba(251,191,36,.13);border-radius:18px;background:rgba(23,17,18,.4)}'
    +'.tet-wrap .tend-arcade-perks{grid-column:1/-1!important;grid-row:6!important;padding:clamp(14px,1.7vw,22px)!important;border:1px solid rgba(168,85,247,.15);border-radius:18px;background:rgba(12,14,35,.56)}'
    +'.tet-wrap .tend-arcade-modes .tend-arcade-options{grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:10px!important}'
    +'.tet-wrap .tend-arcade-perks .tend-arcade-options{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:8px!important}'
    +'.tet-wrap .tend-arcade-option{min-height:clamp(66px,8.5vh,88px)!important;padding:clamp(11px,1.3vw,16px)!important}.tet-wrap .tend-arcade-option strong{font-size:clamp(11px,1.2vw,14px)!important}.tet-wrap .tend-arcade-option span{font-size:clamp(9px,1vw,11px)!important}'
    +'.tet-wrap .tend-arcade-note{grid-column:1/-1!important;grid-row:7!important;margin:0!important;padding-top:2px!important}'
    +'.tet-wrap.tetris-home .tend-arcade-note:before{content:"← ↓ →  MOVE   ·   Z / X  ROTATE   ·   SPACE  DROP   ·   C  HOLD   ·   P  PAUSE";display:block;margin-bottom:6px;color:#64748b;font-size:9px;font-weight:900;letter-spacing:1px}'
    +'@media(max-width:900px){.tet-wrap .tend-arcade-modes .tend-arcade-options{grid-template-columns:repeat(3,minmax(0,1fr))!important}}'
    +'@media(max-width:700px),(max-height:720px){.tet-wrap .tend-arcade-card{display:block!important;overflow-x:hidden!important;overflow-y:auto!important;padding:16px!important}.tet-wrap .tend-arcade-stats{grid-template-columns:repeat(2,minmax(0,1fr))!important}.tet-wrap .tend-arcade-stats,.tet-wrap .tend-arcade-section,.tet-wrap .tend-arcade-launch{margin-bottom:14px!important}.tet-wrap .tend-arcade-launch{align-items:stretch;flex-direction:column}.tet-wrap .tend-arcade-play{width:100%;min-width:0}.tet-wrap .tend-arcade-modes,.tet-wrap .tend-arcade-perks,.tet-wrap .tend-arcade-daily{padding:13px!important}.tet-wrap .tend-arcade-modes .tend-arcade-options,.tet-wrap .tend-arcade-perks .tend-arcade-options{grid-template-columns:1fr!important}.tet-wrap .tend-arcade-card::-webkit-scrollbar{width:8px}}'
    +'.tet-load{position:absolute;inset:0;background:#060810;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;z-index:10}'
    +'.tet-load-txt{font-family:system-ui;font-size:12px;font-weight:700;color:#475569;letter-spacing:3px}'
    +'.tet-load-bar{width:180px;height:3px;background:rgba(255,255,255,.07);border-radius:2px;overflow:hidden}'
    +'.tet-load-fill{height:100%;background:linear-gradient(90deg,#6366f1,#a855f7);border-radius:2px;transition:width .2s;width:0}';
  document.head.appendChild(s);
}

function loadPhaser(host){
  if(!host.runtime)throw new Error('This game needs tend.host Runtime API 1');
  return host.runtime.require('phaser@4');
}
function formatRunTime(ms){
  var seconds=Math.max(0,ms||0)/1000;
  return Math.floor(seconds/60)+':'+(seconds%60).toFixed(2).padStart(5,'0');
}
function focusGameRoot(root){
  if(!root||!root.isConnected)return;
  try{root.focus({preventScroll:true})}catch(e){try{root.focus()}catch(ignore){}}
}

// ── AUDIO ────────────────────────────────────────────────────────────────────
var audioCtx=null;
function initAudio(){if(!audioCtx)try{audioCtx=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}
function resumeAudio(){if(audioCtx&&audioCtx.state==='suspended')audioCtx.resume()}
function tone(freq,dur,type,vol,delay){
  if(!audioCtx)return;resumeAudio();
  var t=audioCtx.currentTime+(delay||0);
  var o=audioCtx.createOscillator(),g=audioCtx.createGain();
  o.type=type||'sine';o.frequency.value=freq;
  g.gain.setValueAtTime(vol||0.07,t);
  g.gain.exponentialRampToValueAtTime(0.001,t+dur);
  o.connect(g);g.connect(audioCtx.destination);
  o.start(t);o.stop(t+dur);
}
var sfx={
  move:function(){tone(210,.04,'square',.03)},
  rotate:function(){tone(440,.06,'sine',.05);tone(660,.04,'sine',.03,.02)},
  drop:function(){tone(130,.08,'triangle',.1);tone(80,.12,'triangle',.07,.04)},
  hold:function(){tone(523,.1,'sine',.06);tone(392,.07,'sine',.04,.06)},
  clear:function(n){[262,330,392,523].slice(0,n).forEach(function(f,i){tone(f,.18,'sine',.1,i*.06)})},
  tetris:function(){[523,659,784,1047,1319].forEach(function(f,i){tone(f,.22,'sine',.12,i*.08)})},
  tspin:function(){[392,523,659,784].forEach(function(f,i){tone(f,.2,'triangle',.1,i*.07)})},
  levelUp:function(){[523,659,784,1047,1319,1568].forEach(function(f,i){tone(f,.18,'sine',.1,i*.07)})},
  power:function(){[523,659,784,1047].forEach(function(f,i){tone(f,.15,'sine',.1,i*.05)});[1047,784].forEach(function(f,i){tone(f,.12,'sine',.07,.25+i*.05)})},
  gameOver:function(){[400,350,300,250,200,150].forEach(function(f,i){tone(f,.25,'sawtooth',.06,i*.12)})},
  combo:function(n){var b=280+n*90;tone(b,.12,'sine',.08);tone(b*1.5,.1,'sine',.06,.08)}
};

// ── TETRIS LOGIC ─────────────────────────────────────────────────────────────
var COLS=10,ROWS=20;
var PIECE_TYPES='IOTSZJL';
var TETROS={
  I:{cells:[[0,1],[1,1],[2,1],[3,1]],color:0x06B6D4},
  O:{cells:[[0,0],[1,0],[0,1],[1,1]],color:0xEAB308},
  T:{cells:[[1,0],[0,1],[1,1],[2,1]],color:0xA855F7},
  S:{cells:[[1,0],[2,0],[0,1],[1,1]],color:0x22C55E},
  Z:{cells:[[0,0],[1,0],[1,1],[2,1]],color:0xEF4444},
  J:{cells:[[0,0],[0,1],[1,1],[2,1]],color:0x3B82F6},
  L:{cells:[[2,0],[0,1],[1,1],[2,1]],color:0xF97316},
  G:{cells:[],color:0x475569}
};
var ROTATIONS={
  I:[
    [[0,1],[1,1],[2,1],[3,1]],[[2,0],[2,1],[2,2],[2,3]],
    [[0,2],[1,2],[2,2],[3,2]],[[1,0],[1,1],[1,2],[1,3]]
  ],
  O:[
    [[1,0],[2,0],[1,1],[2,1]],[[1,0],[2,0],[1,1],[2,1]],
    [[1,0],[2,0],[1,1],[2,1]],[[1,0],[2,0],[1,1],[2,1]]
  ],
  T:[
    [[1,0],[0,1],[1,1],[2,1]],[[1,0],[1,1],[2,1],[1,2]],
    [[0,1],[1,1],[2,1],[1,2]],[[1,0],[0,1],[1,1],[1,2]]
  ],
  S:[
    [[1,0],[2,0],[0,1],[1,1]],[[1,0],[1,1],[2,1],[2,2]],
    [[1,1],[2,1],[0,2],[1,2]],[[0,0],[0,1],[1,1],[1,2]]
  ],
  Z:[
    [[0,0],[1,0],[1,1],[2,1]],[[2,0],[1,1],[2,1],[1,2]],
    [[0,1],[1,1],[1,2],[2,2]],[[1,0],[0,1],[1,1],[0,2]]
  ],
  J:[
    [[0,0],[0,1],[1,1],[2,1]],[[1,0],[2,0],[1,1],[1,2]],
    [[0,1],[1,1],[2,1],[2,2]],[[1,0],[1,1],[0,2],[1,2]]
  ],
  L:[
    [[2,0],[0,1],[1,1],[2,1]],[[1,0],[1,1],[1,2],[2,2]],
    [[0,1],[1,1],[2,1],[0,2]],[[0,0],[1,0],[1,1],[1,2]]
  ]
};
var BASIC_KICKS=[[0,0],[-1,0],[1,0],[-2,0],[2,0],[0,-1],[-1,-1],[1,-1],[0,1]];
var I_KICKS=[[0,0],[-2,0],[2,0],[-1,0],[1,0],[0,-1],[0,1],[-2,-1],[2,-1]];

function TetrisGame(){this._reset()}
TetrisGame.prototype={
  _reset:function(mode){
    this.board=[];for(var r=0;r<ROWS;r++){this.board[r]=[];for(var c=0;c<COLS;c++)this.board[r][c]=null}
    this.score=0;this.level=1;this.lines=0;this.combo=-1;this.b2b=0;
    this.over=false;this.paused=false;
    this.hold=null;this.holdUsed=false;
    this.mode=mode||'classic';
    this.timeLeft=120000;
    this.elapsed=0;this.completed=false;this.piecesLocked=0;this.riftPressure=0;
    this.power=null;this.powerTimer=0;this.shield=false;this.perkQueue=[];
    this.bag=this._makeBag();this.nextBag=this._makeBag();
    this.next=[this._pop(),this._pop(),this._pop()];
    this.cur=null;this.lastAction=null;
    this._spawn();
  },
  start:function(mode){this._reset(mode)},
  _makeBag:function(){
    var b=PIECE_TYPES.split('');
    for(var i=b.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=b[i];b[i]=b[j];b[j]=t}
    return b;
  },
  _pop:function(){
    if(!this.bag.length){this.bag=this.nextBag;this.nextBag=this._makeBag()}
    return this.bag.pop();
  },
  _spawn:function(){
    var type=this.next.shift();this.next.push(this._pop());
    var cells=ROTATIONS[type][0].map(function(c){return[c[0],c[1]]});
    this.cur={type:type,cells:cells,x:3,y:-1,rot:0};
    this.holdUsed=false;this.lastAction=null;
    if(!this._valid(cells,3,-1)){
      if(this.mode==='zen'){
        this.board.splice(0,2);
        this.board.unshift([null,null,null,null,null,null,null,null,null,null]);
        this.board.unshift([null,null,null,null,null,null,null,null,null,null]);
      }else{this.over=true}
    }
  },
  _valid:function(cells,x,y){
    for(var i=0;i<cells.length;i++){
      var nx=x+cells[i][0],ny=y+cells[i][1];
      if(nx<0||nx>=COLS||ny>=ROWS)return false;
      if(ny<0)continue;
      if(this.board[ny]&&this.board[ny][nx]!=null)return false;
    }
    return true;
  },
  tryRotate:function(dir){
    if(this.cur.type==='O'){this.lastAction='rotate';return true}
    var next=(this.cur.rot+(dir===1?1:3))%4;
    var rotated=ROTATIONS[this.cur.type][next];
    var kicks=this.cur.type==='I'?I_KICKS:BASIC_KICKS;
    for(var i=0;i<kicks.length;i++){
      var kx=kicks[i][0],ky=kicks[i][1];
      if(this._valid(rotated,this.cur.x+kx,this.cur.y+ky)){
        this.cur.cells=rotated.map(function(c){return[c[0],c[1]]});this.cur.x+=kx;this.cur.y+=ky;
        this.cur.rot=next;
        this.lastAction='rotate';return true;
      }
    }
    return false;
  },
  moveLeft:function(){if(this._valid(this.cur.cells,this.cur.x-1,this.cur.y)){this.cur.x--;this.lastAction='move';return true}return false},
  moveRight:function(){if(this._valid(this.cur.cells,this.cur.x+1,this.cur.y)){this.cur.x++;this.lastAction='move';return true}return false},
  moveDown:function(){if(this._valid(this.cur.cells,this.cur.x,this.cur.y+1)){this.cur.y++;this.lastAction='move';return true}return false},
  hardDrop:function(){var d=0;while(this._valid(this.cur.cells,this.cur.x,this.cur.y+1)){this.cur.y++;d++}this.score+=d*2;return d},
  ghostY:function(){var gy=this.cur.y;while(this._valid(this.cur.cells,this.cur.x,gy+1))gy++;return gy},
  doHold:function(){
    if(this.holdUsed)return false;
    var cur=this.cur.type;
    if(this.hold){this.cur={type:this.hold,cells:ROTATIONS[this.hold][0].map(function(c){return[c[0],c[1]]}),x:3,y:-1,rot:0}}
    else{this._spawn()}
    this.hold=cur;this.holdUsed=true;return true;
  },
  isTSpin:function(){
    if(this.cur.type!=='T'||this.lastAction!=='rotate')return false;
    var corners=[[0,0],[2,0],[0,2],[2,2]],filled=0;
    for(var i=0;i<corners.length;i++){
      var nx=this.cur.x+corners[i][0],ny=this.cur.y+corners[i][1];
      if(nx<0||nx>=COLS||ny<0||ny>=ROWS||(this.board[ny]&&this.board[ny][nx]!=null))filled++;
    }
    return filled>=3;
  },
  place:function(){
    var isTSpin=this.isTSpin();
    for(var i=0;i<this.cur.cells.length;i++){
      var nx=this.cur.x+this.cur.cells[i][0],ny=this.cur.y+this.cur.cells[i][1];
      if(ny>=0)this.board[ny][nx]=this.cur.type;
    }
    var clearRows=[];
    for(var r=ROWS-1;r>=0;r--){
      var full=true;for(var c=0;c<COLS;c++)if(!this.board[r][c]){full=false;break}
      if(full)clearRows.push(r);
    }
    var clearData=[];for(var ci=0;ci<clearRows.length;ci++)clearData.push(this.board[clearRows[ci]].slice());
    var n=clearRows.length;
    // Filter-based removal keeps indices stable regardless of how many rows clear at once.
    if(n>0){
      this.board=this.board.filter(function(_,idx){return clearRows.indexOf(idx)===-1});
      while(this.board.length<ROWS)this.board.unshift([null,null,null,null,null,null,null,null,null,null]);
    }
    var pts=0,b2b=false;
    if(n>0||isTSpin){
      this.combo++;
      var isB2B=this.b2b>0&&(n>=4||isTSpin);
      if(n>=4||isTSpin)this.b2b++;else this.b2b=0;
      var base=isTSpin?[400,800,1200,1600][Math.min(n,3)]:[0,100,300,500,800][Math.min(n,4)];
      pts=Math.round((base*this.level*(isB2B?1.5:1)+50*Math.max(0,this.combo)*this.level)*(TET_PERK==='combo'?1.25:1));
      if(this.power==='2x')pts*=2;else if(this.power==='fever')pts*=3;
      this.score+=pts;b2b=isB2B;
    }else{this.combo=-1;this.b2b=0}
    this.lines+=n;this.piecesLocked++;
    var newLevel=1+Math.floor(this.lines/10);
    var levelUp=newLevel>this.level;if(levelUp)this.level=newLevel;
    var riftRise=0;
    if(this.mode==='rift'){
      if(n>=2)this.riftPressure=Math.max(0,this.riftPressure-2*n);
      else this.riftPressure++;
      if(this.riftPressure>=6){this.riftPressure=0;this._addGarbage();riftRise=1}
    }
    if(this.mode==='sprint'&&this.lines>=40)this.completed=true;
    var result={lines:n,score:pts,b2b:b2b,isTSpin:isTSpin,levelUp:levelUp,combo:this.combo,clearRows:clearRows,clearData:clearData,riftRise:riftRise,completed:this.completed};
    this._spawn();
    if(this.over&&this.shield){
      this.over=false;this.shield=false;
      for(var q=0;q<4;q++)this.board[q]=[null,null,null,null,null,null,null,null,null,null];
      result.shieldUsed=true;
    }
    return result;
  },
  _addGarbage:function(){
    var overflow=this.board[0].some(function(cell){return cell!=null});
    this.board.shift();
    var hole=Math.floor(Math.random()*COLS),row=[];
    for(var c=0;c<COLS;c++)row.push(c===hole?null:'G');
    this.board.push(row);
    if(overflow)this.over=true;
  },
  tickPower:function(dt){
    if(this.powerTimer>0){this.powerTimer-=dt;if(this.powerTimer<=0){this.power=null;this.powerTimer=0}}
  },
  activatePower:function(type){
    if(type==='slow'){this.power='slow';this.powerTimer=8000}
    else if(type==='2x'){this.power='2x';this.powerTimer=12000}
    else if(type==='nuke'){
      for(var r=ROWS-1;r>=ROWS-4;r--)this.board[r]=[null,null,null,null,null,null,null,null,null,null];
      var clean=[];
      for(var i=0;i<this.board.length;i++){var hasCell=false;for(var j=0;j<COLS;j++)if(this.board[i][j]!=null){hasCell=true;break}if(hasCell)clean.push(this.board[i])}
      while(clean.length<ROWS)clean.unshift([null,null,null,null,null,null,null,null,null,null]);
      this.board=clean;
    }
    else if(type==='shield'){this.shield=true}
    else if(type==='fever'){this.power='fever';this.powerTimer=15000}
    else if(type==='laser'){
      var lcnts=[];for(var lr=0;lr<ROWS;lr++){var lcc2=0;for(var lcc=0;lcc<COLS;lcc++)if(this.board[lr][lcc])lcc2++;if(lcc2>0)lcnts.push({r:lr,cnt:lcc2})}
      lcnts.sort(function(a,b){return b.cnt-a.cnt});
      var lrm=lcnts.slice(0,3).map(function(x){return x.r});
      this.board=this.board.filter(function(_,idx){return lrm.indexOf(idx)===-1});
      while(this.board.length<ROWS)this.board.unshift([null,null,null,null,null,null,null,null,null,null]);
    }
  },
  get dropInterval(){var base=Math.max(50,800-(this.level-1)*65);return this.power==='slow'?base*2.5:base}
};

function createInputBridge(display){
  var bridge={scene:null,left:false,right:false,down:false,leftPressed:false,rightPressed:false};
  bridge.press=function(name){
    if(name==='left'&&!bridge.left)bridge.leftPressed=true;
    if(name==='right'&&!bridge.right)bridge.rightPressed=true;
    bridge[name]=true;
  };
  bridge.release=function(name){bridge[name]=false};
  bridge.consume=function(name){var key=name+'Pressed',value=!!bridge[key];bridge[key]=false;return value};
  bridge.clear=function(){bridge.left=false;bridge.right=false;bridge.down=false;bridge.leftPressed=false;bridge.rightPressed=false};
  bridge.install=function(root){
    root.tabIndex=0;root.setAttribute('role','application');root.setAttribute('aria-label','Tetris game. Use arrow keys to move, up or X to rotate, Z to rotate left, space to hard drop, C to hold, P to pause, and F for full screen.');
    function focused(){return root.isConnected&&(root.contains(document.activeElement)||document.fullscreenElement!=null)}
    function keydown(event){
      var scene=bridge.scene;if(!scene||!focused())return;
      var code=event.code;
      if(['ArrowLeft','ArrowRight','ArrowDown','ArrowUp','Space','KeyA','KeyD','KeyS','KeyW','KeyX','KeyZ','KeyC','ShiftLeft','ShiftRight','KeyP','Escape','KeyF'].indexOf(code)<0)return;
      event.preventDefault();event.stopPropagation();
      if(code==='ArrowLeft'||code==='KeyA')bridge.press('left');
      else if(code==='ArrowRight'||code==='KeyD')bridge.press('right');
      else if(code==='ArrowDown'||code==='KeyS')bridge.press('down');
      else if(!event.repeat&&(code==='ArrowUp'||code==='KeyW'||code==='KeyX'))scene._rotate(1);
      else if(!event.repeat&&code==='KeyZ')scene._rotate(-1);
      else if(!event.repeat&&code==='Space')scene._hardDrop();
      else if(!event.repeat&&(code==='KeyC'||code==='ShiftLeft'||code==='ShiftRight'))scene._hold();
      else if(!event.repeat&&(code==='KeyP'||code==='Escape'))scene._togglePause();
      else if(!event.repeat&&code==='KeyF')display.toggleFullscreen().catch(function(){});
    }
    function keyup(event){
      if(event.code==='ArrowLeft'||event.code==='KeyA')bridge.release('left');
      else if(event.code==='ArrowRight'||event.code==='KeyD')bridge.release('right');
      else if(event.code==='ArrowDown'||event.code==='KeyS')bridge.release('down');
    }
    function focus(){focusGameRoot(root)}
    window.addEventListener('keydown',keydown,true);window.addEventListener('keyup',keyup,true);window.addEventListener('blur',bridge.clear);
    root.addEventListener('pointerdown',focus);setTimeout(focus,0);
    return function(){window.removeEventListener('keydown',keydown,true);window.removeEventListener('keyup',keyup,true);window.removeEventListener('blur',bridge.clear);root.removeEventListener('pointerdown',focus);bridge.clear();bridge.scene=null};
  };
  return bridge;
}

// ── PHASER GAME ───────────────────────────────────────────────────────────────
function createGame(el,storage,bestRef,phaserRuntime,arcade,display,inputBridge){
  var Phaser=phaserRuntime.Phaser;
  var W=540,H=760,CELL=29;
  var BX=125,BY=62; // board origin
  var RX=425;
  var LX=12;

  function drawBlock(g,x,y,sz,color,alpha){
    alpha=alpha===undefined?1:alpha;
    var s=sz-2;
    g.fillStyle(color,alpha*0.13);
    g.fillRoundedRect(x,y,sz,sz,4);
    g.fillStyle(color,alpha);
    g.fillRoundedRect(x+1,y+1,s,s,3);
    g.fillStyle(0xffffff,alpha*0.22);
    g.fillRoundedRect(x+2,y+2,s-2,Math.max(2,Math.floor(s*0.36)),2);
    g.fillStyle(0x000000,alpha*0.28);
    g.fillRoundedRect(x+1,y+Math.ceil(s*0.72)+1,s,Math.floor(s*0.28)+1,{bl:3,br:3,tl:0,tr:0});
  }
  function drawGhost(g,x,y,sz,color){
    g.lineStyle(1.5,color,0.32);
    g.strokeRoundedRect(x+1,y+1,sz-2,sz-2,3);
  }

  var BootScene=new Phaser.Class({Extends:Phaser.Scene,
    initialize:function(){Phaser.Scene.call(this,'Boot')},
    create:function(){this.scene.start('Menu')}
  });

  var MenuScene=new Phaser.Class({Extends:Phaser.Scene,
    initialize:function(){Phaser.Scene.call(this,'Menu')},
    create:function(){
      this.add.rectangle(0,0,W,H,0x060810).setOrigin(0);
      var self=this;
      el.dataset.tetrisBest=String(bestRef.value||0);
      el.classList.add('tetris-home');
      var launch=function(event){
        var selected=(event&&event.detail&&event.detail.mode)||arcade.mode().id;
        initAudio();sfx.power();arcade.closeHub();
        focusGameRoot(el);
        self.cameras.main.fade(180,0,0,0);
        self.time.delayedCall(190,function(){self.scene.start('Game',{mode:selected});requestAnimationFrame(function(){focusGameRoot(el)})});
      };
      el.addEventListener('tend-tetris-play',launch);
      this.events.once('shutdown',function(){el.removeEventListener('tend-tetris-play',launch);el.classList.remove('tetris-home')});
      arcade.openHub();
      this.cameras.main.fadeIn(300,0,0,0);
    },
    _bg:function(){
      for(var i=0;i<30;i++){
        var s=this.add.circle(Phaser.Math.Between(0,W),Phaser.Math.Between(0,H),Math.random()*1.5+0.3,0xffffff,Math.random()*0.45+0.1);
      }
      var blobCols=[0x6366f1,0xa855f7,0x06b6d4,0xec4899];
      for(var j=0;j<4;j++){
        var b=this.add.circle(Phaser.Math.Between(60,W-60),Phaser.Math.Between(100,H-100),Phaser.Math.Between(50,120),blobCols[j],0.055);
        this.tweens.add({targets:b,scaleX:1.4,scaleY:0.7,alpha:0.022,duration:Phaser.Math.Between(4000,9000),yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
      }
    },
    _fsBtn:function(){
      var btn=this.add.text(W-12,10,'⛶',{fontSize:'20px',color:'#334155'}).setOrigin(1,0).setInteractive({useHandCursor:true}).setDepth(200);
      btn.on('pointerover',function(){btn.setColor('#64748b')});
      btn.on('pointerout',function(){btn.setColor('#334155')});
      btn.on('pointerdown',function(){display.toggleFullscreen().catch(function(){});});
    }
  });

  var GameScene=new Phaser.Class({Extends:Phaser.Scene,
    initialize:function(){Phaser.Scene.call(this,'Game')},
    init:function(data){this.gameMode=(data&&data.mode)||'classic'},
    create:function(){
      var self=this;
      this.tetris=new TetrisGame();
      this.tetris.start(this.gameMode);
      TET_PERK=arcade.perk().id;if(TET_PERK==='shield')this.tetris.shield=true;

      // bg
      this.add.rectangle(0,0,W,H,0x060810).setOrigin(0);
      this._bg();

      // Complete playfield frame: a soft outer glow, solid shell, then the grid.
      this.add.rectangle(BX+COLS*CELL/2,BY+ROWS*CELL/2,COLS*CELL+14,ROWS*CELL+14,0x6366f1,0.08).setStrokeStyle(1,0x6366f1,0.16);
      this.add.rectangle(BX+COLS*CELL/2,BY+ROWS*CELL/2,COLS*CELL+6,ROWS*CELL+6,0x02050d,0.98).setStrokeStyle(2,0x4f5fd7,0.42);
      this.add.text(BX+COLS*CELL/2,BY-18,'PLAYFIELD',{fontSize:'8px',fontFamily:'system-ui',fontStyle:'bold',color:'#53627d',letterSpacing:2}).setOrigin(0.5);
      this.add.rectangle(BX-1,BY-1,COLS*CELL+2,ROWS*CELL+2,0x000000,0.55).setOrigin(0).setStrokeStyle(1,0x6366f1,0.18);

      // grid lines
      var gg=this.add.graphics();
      gg.lineStyle(1,0x6366f1,0.05);
      for(var c=1;c<COLS;c++)gg.lineBetween(BX+c*CELL,BY,BX+c*CELL,BY+ROWS*CELL);
      for(var r=1;r<ROWS;r++)gg.lineBetween(BX,BY+r*CELL,BX+COLS*CELL,BY+r*CELL);

      // render graphics layers
      this.gBoard=this.add.graphics();
      this.gGhost=this.add.graphics();
      this.gPiece=this.add.graphics();
      this.gHold=this.add.graphics();
      this.gNext=this.add.graphics();

      // particles
      var pg=this.make.graphics({x:0,y:0,add:false});
      pg.fillStyle(0xffffff,1);pg.fillCircle(3,3,3);
      pg.generateTexture('pt',6,6);pg.destroy();
      this.emitter=this.add.particles(0,0,'pt',{speed:{min:65,max:230},angle:{min:0,max:360},scale:{start:1.2,end:0},lifespan:{min:320,max:720},gravityY:290,quantity:0,emitting:false});
      // per-piece-color emitters for cell-accurate explosions
      this.colorEmitters={};
      var eSelf=this;
      ['I','O','T','S','Z','J','L'].forEach(function(type){
        var eg=eSelf.make.graphics({x:0,y:0,add:false});
        eg.fillStyle(TETROS[type].color,1);eg.fillCircle(4,4,4);
        var tn='pt_'+type;eg.generateTexture(tn,8,8);eg.destroy();
        eSelf.colorEmitters[type]=eSelf.add.particles(0,0,tn,{
          speed:{min:80,max:260},angle:{min:0,max:360},
          scale:{start:1.4,end:0},lifespan:{min:260,max:660},
          gravityY:280,quantity:0,emitting:false
        });
      });
      this._feverOverlay=this.add.rectangle(BX,BY,COLS*CELL,ROWS*CELL,0xff4400,0).setOrigin(0).setDepth(1);

      // HUD
      this._createHUD();

      // state
      this.dropAcc=0;this.lockTimer=0;this.isLocking=false;this.lockMoves=0;
      this.dasL=0;this.dasR=0;
      this._comboTxt=null;this.overlay=null;this.ending=false;

      inputBridge.scene=this;
      focusGameRoot(el);
      requestAnimationFrame(function(){focusGameRoot(el)});
      this.events.once('shutdown',function(){
        if(inputBridge.scene===self)inputBridge.scene=null;
        inputBridge.clear();
      });
      this._createTouchControls();

      this._renderAll();
      this.cameras.main.fadeIn(280,0,0,0);
    },
    _bg:function(){
      for(var i=0;i<22;i++){
        var s=this.add.circle(Phaser.Math.Between(0,W),Phaser.Math.Between(0,H),Math.random()*1.2+0.3,0xffffff,Math.random()*0.3+0.08);
      }
      var blobCols=[0x6366f1,0xa855f7,0x06b6d4,0xec4899];
      for(var j=0;j<4;j++){
        var b=this.add.circle(Phaser.Math.Between(40,W-40),Phaser.Math.Between(60,H-60),Phaser.Math.Between(40,100),blobCols[j],0.05);
        this.tweens.add({targets:b,scaleX:1.5,scaleY:0.7,alpha:0.02,duration:Phaser.Math.Between(5000,11000),yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
      }
    },
    _createHUD:function(){
      var lbl=function(scene,x,y,t){return scene.add.text(x,y,t,{fontSize:'8px',fontFamily:'system-ui',color:'#475569',fontStyle:'bold'})};
      var val=function(scene,x,y,t,c,sz){return scene.add.text(x,y,t,{fontSize:(sz||16)+'px',fontFamily:'system-ui',fontStyle:'bold',color:c||'#ffffff'})};
      var s=this;
      var panel=function(x,y,w,h,accent){
        s.add.rectangle(x,y,w,h,0x07101f,0.88).setOrigin(0).setStrokeStyle(1,0x223550,0.82);
        s.add.rectangle(x+10,y,w-20,2,accent,0.72).setOrigin(0);
      };

      panel(7,53,110,148,0x06b6d4);
      panel(7,212,110,112,0x3b82f6);
      panel(7,335,110,115,0x22c55e);
      panel(423,53,110,236,0xa855f7);
      panel(423,300,110,54,0x6366f1);
      panel(423,365,110,90,0xec4899);

      // === LEFT ===
      lbl(s,17,63,'SCORE');
      this.hudScore=val(s,17,74,'0','#fbbf24',15);
      lbl(s,17,102,'LEVEL');
      this.hudLevel=val(s,17,113,'1','#22c55e',15);
      lbl(s,17,141,'LINES');
      this.hudLines=val(s,17,152,'0','#3b82f6',15);
      lbl(s,17,177,'BEST');
      this.hudBest=val(s,17,187,bestRef.value>0?bestRef.value.toLocaleString():'0','#a855f7',11);

      lbl(s,17,222,'HOLD');
      s.add.rectangle(19,239,86,68,0x000000,0.45).setOrigin(0).setStrokeStyle(1,0x334155,0.72);

      lbl(s,17,345,'POWER');
      this.powerBg=s.add.rectangle(19,364,86,30,0x000000,0.45).setOrigin(0).setStrokeStyle(1,0x334155,0.58);
      this.powerBar=s.add.rectangle(20,365,0,6,0x6366f1,1).setOrigin(0);
      this.hudPower=s.add.text(62,380,'NONE',{fontSize:'9px',fontFamily:'system-ui',fontStyle:'bold',color:'#475569'}).setOrigin(0.5);
      this.hudShield=s.add.text(17,412,'🛡️ SHIELD',{fontSize:'9px',fontFamily:'system-ui',color:'#06b6d4',fontStyle:'bold'}).setAlpha(0);

      // === RIGHT ===
      lbl(s,433,63,'NEXT QUEUE');
      s.add.rectangle(432,81,62,62,0x000000,0.45).setOrigin(0).setStrokeStyle(1,0x334155,0.72);
      s.add.rectangle(437,154,52,52,0x000000,0.42).setOrigin(0).setStrokeStyle(1,0x334155,0.5);
      s.add.rectangle(437,217,52,52,0x000000,0.42).setOrigin(0).setStrokeStyle(1,0x334155,0.5);

      var modeCol={classic:'#6366f1',sprint:'#06b6d4',blitz:'#ef4444',rift:'#ec4899',zen:'#22c55e'}[this.gameMode]||'#6366f1';
      lbl(s,433,310,'MODE');
      s.add.text(478,333,this.gameMode.toUpperCase(),{fontSize:'10px',fontFamily:'system-ui',fontStyle:'bold',color:modeCol,letterSpacing:2}).setOrigin(0.5);

      if(this.gameMode==='blitz'||this.gameMode==='sprint'){
        lbl(s,433,374,'TIME');
        this.hudTime=s.add.text(478,392,this.gameMode==='blitz'?'2:00':'0:00.0',{fontSize:'14px',fontFamily:'system-ui',fontStyle:'bold',color:modeCol}).setOrigin(0.5);
      }

      var chainY=(this.gameMode==='blitz'||this.gameMode==='sprint')?420:384;
      lbl(s,433,chainY,'B2B');
      this.hudB2B=val(s,433,chainY+12,'0','#f97316',13);
      lbl(s,484,chainY,'COMBO');
      this.hudCombo=val(s,484,chainY+12,'0','#ec4899',13);

      s.add.text(BX+COLS*CELL/2,BY+ROWS*CELL+10,'Space drop · C hold · P pause · F full screen',{fontSize:'9px',fontFamily:'system-ui',color:'#334155'}).setOrigin(0.5,0);
    },
    _fsBtn:function(){
      var btn=this.add.text(W-12,8,'⛶',{fontSize:'20px',color:'#1e293b'}).setOrigin(1,0).setInteractive({useHandCursor:true}).setDepth(200);
      btn.on('pointerover',function(){btn.setColor('#475569')});
      btn.on('pointerout',function(){btn.setColor('#1e293b')});
      btn.on('pointerdown',function(){display.toggleFullscreen().catch(function(){});});
    },
    _createTouchControls:function(){
      var self=this,y=718;
      function button(x,w,label,color,down,up){
        var bg=self.add.rectangle(x,y,w,48,0x071525,0.94).setStrokeStyle(1,color,0.78).setInteractive({useHandCursor:true}).setDepth(40);
        self.add.text(x,y,label,{fontSize:(label==='DROP'||label==='HOLD')?'10px':'17px',fontFamily:'system-ui',fontStyle:'bold',color:'#e6faff'}).setOrigin(0.5).setDepth(41);
        bg.on('pointerdown',function(pointer){
          if(pointer&&pointer.event&&pointer.event.preventDefault)pointer.event.preventDefault();
          bg.setFillStyle(color,0.28);down();
        });
        function release(){bg.setFillStyle(0x071525,0.9);if(up)up()}
        bg.on('pointerup',release);bg.on('pointerout',release);bg.on('pointerupoutside',release);
      }
      self.add.text(104,678,'MOVE / SOFT DROP',{fontSize:'8px',fontFamily:'system-ui',fontStyle:'bold',color:'#55758b',letterSpacing:1}).setOrigin(0.5).setDepth(41);
      self.add.text(365,678,'ACTIONS',{fontSize:'8px',fontFamily:'system-ui',fontStyle:'bold',color:'#725f91',letterSpacing:1}).setOrigin(0.5).setDepth(41);
      button(42,58,'◀',0x06b6d4,function(){inputBridge.press('left')},function(){inputBridge.release('left')});
      button(104,58,'▼',0x06b6d4,function(){inputBridge.press('down')},function(){inputBridge.release('down')});
      button(166,58,'▶',0x06b6d4,function(){inputBridge.press('right')},function(){inputBridge.release('right')});
      button(248,72,'HOLD',0x22c55e,function(){self._hold()});
      button(333,82,'↻',0xa855f7,function(){self._rotate(1)});
      button(455,100,'DROP',0xf97316,function(){self._hardDrop()});
    },
    _rotate:function(dir){
      var t=this.tetris;if(t.over||t.paused)return;
      initAudio();if(t.tryRotate(dir)){sfx.rotate();this._resetLock();this._renderPiece()}
    },
    _hold:function(){
      var t=this.tetris;if(t.over||t.paused)return;
      initAudio();if(t.doHold()){sfx.hold();this._renderAll()}
    },
    _hardDrop:function(){
      var t=this.tetris;if(t.over||t.paused)return;
      initAudio();sfx.drop();t.hardDrop();this._doLock();
    },
    _togglePause:function(){
      var t=this.tetris;if(t.over)return;
      t.paused=!t.paused;
      if(t.paused)this._showPause();else this._hidePause();
    },
    _showPause:function(){
      if(this.overlay)return;
      var self=this;
      this.overlay=this.add.container(W/2,H/2).setDepth(100);
      var bg=this.add.rectangle(0,0,W,H,0x000000,0.72).setInteractive();
      var box=this.add.rectangle(0,0,220,178,0x0b1120,1).setStrokeStyle(1,0x6366f1,0.7);
      var t1=this.add.text(0,-44,'PAUSED',{fontSize:'30px',fontFamily:'system-ui',fontStyle:'bold',color:'#fff'}).setOrigin(0.5);
      var t2=this.add.text(0,-4,'Press P to resume',{fontSize:'11px',fontFamily:'system-ui',color:'#64748b'}).setOrigin(0.5);
      var r1=this.add.rectangle(0,38,150,38,0x6366f1,0.9).setInteractive({useHandCursor:true}).setStrokeStyle(1,0x818cf8,0.7);
      var r1t=this.add.text(0,38,'RESUME',{fontSize:'13px',fontFamily:'system-ui',fontStyle:'bold',color:'#fff'}).setOrigin(0.5);
      var r2=this.add.rectangle(0,82,150,32,0x1e293b,1).setInteractive({useHandCursor:true}).setStrokeStyle(1,0x334155,0.5);
      var r2t=this.add.text(0,82,'QUIT TO MENU',{fontSize:'11px',fontFamily:'system-ui',color:'#94a3b8'}).setOrigin(0.5);
      r1.on('pointerdown',function(){self._togglePause()});
      r2.on('pointerdown',function(){self.scene.start('Menu')});
      this.overlay.add([bg,box,t1,t2,r1,r1t,r2,r2t]);
      this.overlay.setAlpha(0);
      this.tweens.add({targets:this.overlay,alpha:1,duration:180});
    },
    _hidePause:function(){
      var self=this;
      if(!this.overlay)return;
      this.tweens.add({targets:this.overlay,alpha:0,duration:150,onComplete:function(){self.overlay.destroy();self.overlay=null}});
    },
    _resetLock:function(){if(this.isLocking&&this.lockMoves<15){this.lockTimer=0;this.lockMoves++}},
    _doLock:function(){
      this.isLocking=false;this.lockTimer=0;this.lockMoves=0;this.dropAcc=0;
      var t=this.tetris;
      // Place the piece immediately — no deferred callback so the game loop
      // can never get stuck waiting for an animation that silently failed.
      var result=t.place();
      sfx.drop();
      if(result.lines>0||result.isTSpin){
        // Visual flash animation — purely cosmetic, never blocks game logic.
        if(result.clearRows&&result.clearRows.length>0)this._animClear(result.clearRows,result.clearData);
        if(result.lines>=4)sfx.tetris();
        else if(result.isTSpin)sfx.tspin();
        else sfx.clear(result.lines);
        var shakeAmt=result.lines>=4?0.013:0.005;
        this.cameras.main.shake(result.lines>=4?280:150,shakeAmt);
        this._flashBoard(result.lines>=4?0xfbbf24:0xffffff);
        this._scorePopup(result);
        if(result.combo>0){sfx.combo(result.combo);this._comboText(result.combo)}
        this._burst(result.lines||1,result.isTSpin);
        if(result.levelUp){sfx.levelUp();this._levelUpFx()}
        arcade.record('line',result.lines);arcade.record('score',result.score);if(result.combo>0)arcade.record('combo',result.combo);if(result.lines>=4)arcade.record('tetris',1,{achievement:this.tetris.b2b>=3?'tetris-b2b3':'',title:'Back-to-back engine',detail:'Built a three-chain difficult-clear streak',coins:90});
        var perkChance=(result.lines>=4?1.0:result.lines===3?0.60:result.lines===2?0.32:0)*(TET_PERK==='fortune'?1.55:1);
        if(perkChance>0&&Math.random()<perkChance){
          var pTypes=['slow','2x','nuke','shield','fever','laser'];
          var pt=pTypes[Math.floor(Math.random()*pTypes.length)];
          t.activatePower(pt);sfx.power();
          this._powerNotice(pt);
        }
      }
      if(result.riftRise){
        this.cameras.main.shake(240,0.012);
        this.cameras.main.flash(180,236,72,153,false);
        this._powerNotice('rift');
      }
      if(result.shieldUsed){this.cameras.main.flash(300,6,182,212,false)}
      this._renderAll();this._updateHUD();
      if(result.completed)this._gameOver(true);
      else if(t.over)this._gameOver(false);
    },
    _animClear:function(rows,clearData){
      var n=rows.length;
      // particles-per-cell scales with lines cleared: 1L=2, 2L=4, 3L=6, 4L=10
      var ppc=n>=4?10:n===3?6:n===2?4:2;
      var fg=this.add.graphics().setDepth(12);
      for(var i=0;i<rows.length;i++){
        var r=rows[i];
        var rd=clearData?clearData[i]:null;
        for(var c=0;c<COLS;c++){
          fg.fillStyle(0xffffff,0.92);fg.fillRoundedRect(BX+c*CELL+1,BY+r*CELL+1,CELL-2,CELL-2,3);
          var ctype=rd&&rd[c]?rd[c]:null;
          var em=ctype&&this.colorEmitters&&this.colorEmitters[ctype]?this.colorEmitters[ctype]:this.emitter;
          try{em.setPosition(BX+c*CELL+CELL/2,BY+r*CELL+CELL/2);em.explode(ppc)}catch(e){}
        }
      }
      this.tweens.add({targets:fg,alpha:0,duration:300+n*60,onComplete:function(){fg.destroy()}});
    },
    _burst:function(lines,tSpin){
      var cols=[0xfbbf24,0xa855f7,0x06b6d4,0x22c55e,0xef4444,0xec4899];
      var count=tSpin?2:lines;
      for(var i=0;i<count;i++){
        try{
          this.emitter.setPosition(BX+Phaser.Math.Between(0,COLS*CELL),BY+Phaser.Math.Between(ROWS*CELL/4,ROWS*CELL*3/4));
          this.emitter.explode(lines*12);
        }catch(e){}
      }
    },
    _flashBoard:function(color){
      var f=this.add.rectangle(BX,BY,COLS*CELL,ROWS*CELL,color,0.27).setOrigin(0).setDepth(6);
      this.tweens.add({targets:f,alpha:0,duration:220,onComplete:function(){f.destroy()}});
    },
    _scorePopup:function(result){
      var txt='';
      if(result.lines>=4)txt='TETRIS!';
      else if(result.isTSpin&&result.lines>0)txt='T-SPIN '+result.lines+'!';
      else if(result.isTSpin)txt='T-SPIN!';
      else if(result.lines>0)txt=result.lines+' LINE'+(result.lines>1?'S':'')+'!';
      if(result.b2b)txt='B2B '+txt;
      if(result.score>0)txt+=result.score>0?' +'+result.score.toLocaleString():'';
      if(!txt)return;
      var color=result.lines>=4?'#fbbf24':result.isTSpin?'#a855f7':result.b2b?'#f97316':'#22c55e';
      var pop=this.add.text(BX+COLS*CELL/2,BY+ROWS*CELL*0.45,txt,{fontSize:result.lines>=4?'18px':'13px',fontFamily:'system-ui',fontStyle:'bold',color:color,stroke:'#000000',strokeThickness:3}).setOrigin(0.5).setDepth(22);
      this.tweens.add({targets:pop,y:pop.y-62,alpha:0,duration:920,ease:'Power2',onComplete:function(){pop.destroy()}});
    },
    _comboText:function(n){
      var old=this._comboTxt;if(old){old.destroy();this._comboTxt=null}
      var t=this.add.text(RX+33,BY+ROWS*CELL*0.5,n+'×\nCOMBO',{fontSize:'14px',fontFamily:'system-ui',fontStyle:'bold',color:'#ec4899',align:'center',stroke:'#000',strokeThickness:2}).setOrigin(0.5).setDepth(22);
      this._comboTxt=t;
      this.tweens.add({targets:t,scaleX:1.3,scaleY:1.3,duration:120,yoyo:true});
      var self=this;
      this.time.delayedCall(1200,function(){if(self._comboTxt===t){t.destroy();self._comboTxt=null}});
    },
    _levelUpFx:function(){
      var lv=this.tetris.level;
      var t=this.add.text(W/2,H/2,'LEVEL '+lv+'!',{fontSize:'40px',fontFamily:'system-ui',fontStyle:'bold',color:'#fff',stroke:'#6366f1',strokeThickness:4,shadow:{color:'#a855f7',blur:30,fill:true}}).setOrigin(0.5).setDepth(52);
      this.tweens.add({targets:t,scaleX:1.5,scaleY:1.5,alpha:0,duration:900,ease:'Power2',onComplete:function(){t.destroy()}});
      this.cameras.main.flash(400,60,50,150,false);
    },
    _powerNotice:function(type){
      var info={slow:['⚡ SLOW-MO!','#06b6d4'],'2x':['⭐ 2× SCORE!','#fbbf24'],nuke:['💥 NUKE!','#ef4444'],shield:['🛡️ SHIELD!','#6366f1'],fever:['🔥 FEVER! ×3','#f97316'],laser:['🔦 LASER!','#ec4899'],rift:['◇ THE RIFT RISES','#ec4899']};
      var label=(info[type]||['⭐ POWER UP!','#fff'])[0];
      var col=(info[type]||['⭐ POWER UP!','#fff'])[1];
      var n=this.add.text(BX+COLS*CELL/2,BY+ROWS*CELL/2,label,{
        fontSize:'22px',fontFamily:'system-ui',fontStyle:'bold',
        color:col,stroke:'#000000',strokeThickness:4,
        backgroundColor:'#000000bb',padding:{x:14,y:8}
      }).setOrigin(0.5).setDepth(40).setScale(0.4).setAlpha(0);
      this.tweens.add({targets:n,scaleX:1,scaleY:1,alpha:1,duration:180,ease:'Back.Out'});
      this.tweens.add({targets:n,y:n.y-60,alpha:0,duration:1600,delay:700,onComplete:function(){n.destroy()}});
    },
    _updateHUD:function(){
      var t=this.tetris;
      this.hudScore.setText(t.score.toLocaleString());
      this.hudLevel.setText(t.level.toString());
      this.hudLines.setText(t.lines.toString());
      var best=Math.max(t.score,bestRef.value);
      this.hudBest.setText(best.toLocaleString());
      if(t.score>bestRef.value){bestRef.value=t.score;el.dataset.tetrisBest=String(bestRef.value);storage.set('tetris_best',t.score).catch(function(){})}
      this.hudB2B.setText(t.b2b.toString());
      this.hudCombo.setText(Math.max(0,t.combo).toString());
      // power hud
      var pwrMap={slow:['SLOW-MO',0x06b6d4,8000],'2x':['2X SCORE',0xfbbf24,12000],fever:['FEVER ×3',0xf97316,15000]};
      if(t.power&&pwrMap[t.power]){
        var pi=pwrMap[t.power];
        var hexStr='#'+pi[1].toString(16).padStart(6,'0');
        this.hudPower.setText(pi[0]).setColor(hexStr);
        this.powerBg.setStrokeStyle(1,pi[1],0.8);
        this.powerBar.setSize(80*(t.powerTimer/pi[2]),6).setFillStyle(pi[1]);
      }else if(t.shield){
        this.hudPower.setText('SHIELD').setColor('#06b6d4');
        this.powerBg.setStrokeStyle(1,0x06b6d4,0.8);
        this.powerBar.setSize(0,6);
        this.hudShield.setAlpha(0.85);
      }else{
        this.hudPower.setText('NONE').setColor('#475569');
        this.powerBg.setStrokeStyle(1,0x334155,0.5);
        this.powerBar.setSize(0,6);
        this.hudShield.setAlpha(0);
      }
    },
    _renderAll:function(){this._renderBoard();this._renderPiece();this._renderNext();this._renderHold()},
    _renderBoard:function(){
      this.gBoard.clear();
      var b=this.tetris.board;
      for(var r=0;r<ROWS;r++)for(var c=0;c<COLS;c++)
        if(b[r][c])drawBlock(this.gBoard,BX+c*CELL,BY+r*CELL,CELL,TETROS[b[r][c]].color);
    },
    _renderPiece:function(){
      this.gGhost.clear();this.gPiece.clear();
      var t=this.tetris;if(!t.cur||t.over)return;
      var col=TETROS[t.cur.type].color,gy=t.ghostY();
      if(gy!==t.cur.y){
        for(var i=0;i<t.cur.cells.length;i++){
          var nx=t.cur.x+t.cur.cells[i][0],ny=gy+t.cur.cells[i][1];
          if(nx>=0&&nx<COLS&&ny>=0&&ny<ROWS)drawGhost(this.gGhost,BX+nx*CELL,BY+ny*CELL,CELL,col);
        }
      }
      for(var j=0;j<t.cur.cells.length;j++){
        var nx2=t.cur.x+t.cur.cells[j][0],ny2=t.cur.y+t.cur.cells[j][1];
        if(nx2>=0&&nx2<COLS&&ny2>=0&&ny2<ROWS)drawBlock(this.gPiece,BX+nx2*CELL,BY+ny2*CELL,CELL,col,1);
      }
    },
    _renderNext:function(){
      this.gNext.clear();
      var t=this.tetris;
      var configs=[{x:432,y:81,sz:62,csz:18},{x:437,y:154,sz:52,csz:15},{x:437,y:217,sz:52,csz:15}];
      for(var i=0;i<Math.min(3,t.next.length);i++){
        var type=t.next[i],cells=TETROS[type].cells,col2=TETROS[type].color;
        var cfg=configs[i];
        var maxCX=0,maxCY=0;
        for(var k=0;k<cells.length;k++){if(cells[k][0]>maxCX)maxCX=cells[k][0];if(cells[k][1]>maxCY)maxCY=cells[k][1]}
        var ox=cfg.x+(cfg.sz-((maxCX+1)*cfg.csz))/2;
        var oy=cfg.y+(cfg.sz-((maxCY+1)*cfg.csz))/2;
        for(var m=0;m<cells.length;m++)drawBlock(this.gNext,ox+cells[m][0]*cfg.csz,oy+cells[m][1]*cfg.csz,cfg.csz,col2);
      }
    },
    _renderHold:function(){
      this.gHold.clear();
      var t=this.tetris;if(!t.hold)return;
      var cells=TETROS[t.hold].cells,col=TETROS[t.hold].color,csz=18;
      var maxCX=0,maxCY=0;
      for(var k=0;k<cells.length;k++){if(cells[k][0]>maxCX)maxCX=cells[k][0];if(cells[k][1]>maxCY)maxCY=cells[k][1]}
      var ox=19+(86-((maxCX+1)*csz))/2;
      var oy=239+(68-((maxCY+1)*csz))/2;
      for(var m=0;m<cells.length;m++)drawBlock(this.gHold,ox+cells[m][0]*csz,oy+cells[m][1]*csz,csz,col,t.holdUsed?0.32:1);
    },
    update:function(time,delta){
      var t=this.tetris;
      if(t.over||t.paused)return;

      t.elapsed+=delta;

      // blitz
      if(t.mode==='blitz'){
        t.timeLeft-=delta;
        if(t.timeLeft<=0){t.timeLeft=0;this._gameOver();return}
        if(this.hudTime){
          var secs=Math.ceil(t.timeLeft/1000);
          this.hudTime.setText(Math.floor(secs/60)+':'+(secs%60).toString().padStart(2,'0'));
          this.hudTime.setColor(t.timeLeft<20000?'#ff4444':'#ef4444');
          this.hudTime.setAlpha(t.timeLeft<10000&&Math.floor(time/500)%2?0.45:1);
        }
      }
      if(t.mode==='sprint'&&this.hudTime){
        var sprintSeconds=t.elapsed/1000;
        this.hudTime.setText(Math.floor(sprintSeconds/60)+':'+(sprintSeconds%60).toFixed(1).padStart(4,'0'));
      }

      t.tickPower(delta);
      if(this._feverOverlay)this._feverOverlay.setAlpha(t.power==='fever'?0.04+0.04*Math.sin(time*0.007):0);

      // DAS left
      var lDown=inputBridge.left||inputBridge.leftPressed;
      var rDown=inputBridge.right||inputBridge.rightPressed;
      var sDown=inputBridge.down;
      if(lDown){
        if(inputBridge.consume('left')){
          if(t.moveLeft()){sfx.move();this._resetLock();this._renderPiece()}this.dasL=0;
        }else{
          this.dasL+=delta;
          if(this.dasL>=170){this.dasL=170-50;if(t.moveLeft()){sfx.move();this._resetLock();this._renderPiece()}}
        }
      }else{this.dasL=0}
      // DAS right
      if(rDown){
        if(inputBridge.consume('right')){
          if(t.moveRight()){sfx.move();this._resetLock();this._renderPiece()}this.dasR=0;
        }else{
          this.dasR+=delta;
          if(this.dasR>=170){this.dasR=170-50;if(t.moveRight()){sfx.move();this._resetLock();this._renderPiece()}}
        }
      }else{this.dasR=0}

      // drop
      this.dropAcc+=delta*(sDown?8:1);
      if(this.dropAcc>=t.dropInterval){
        this.dropAcc=0;
        if(!t.moveDown()){
          if(!this.isLocking){this.isLocking=true;this.lockTimer=0;this.lockMoves=0}
        }else{
          this.isLocking=false;this.lockTimer=0;
          if(sDown)sfx.move();
        }
        this._renderPiece();
      }

      // lock delay
      if(this.isLocking){
        this.lockTimer+=delta;
        if(this.lockTimer>=500)this._doLock();
      }

    },
    _gameOver:function(completed){
      if(this.ending)return;this.ending=true;
      var self=this,t=this.tetris;t.over=true;arcade.record(completed?'complete':'fail',1);arcade.record('score',t.score);
      if(completed)sfx.levelUp();else sfx.gameOver();
      if(t.score>bestRef.value){bestRef.value=t.score;el.dataset.tetrisBest=String(bestRef.value);storage.set('tetris_best',t.score).catch(function(){})}
      this.time.delayedCall(600,function(){
        self.scene.start('GameOver',{score:t.score,level:t.level,lines:t.lines,mode:self.gameMode,best:bestRef.value,completed:!!completed,time:t.elapsed});
      });
    }
  });

  var GameOverScene=new Phaser.Class({Extends:Phaser.Scene,
    initialize:function(){Phaser.Scene.call(this,'GameOver')},
    init:function(d){this.d=d||{}},
    create:function(){
      var self=this,d=this.d;
      this.add.rectangle(0,0,W,H,0x060810).setOrigin(0);
      for(var i=0;i<65;i++)this.add.circle(Phaser.Math.Between(0,W),Phaser.Math.Between(0,H),Math.random()*1.3+0.3,0xffffff,Math.random()*0.3+0.08);
      // nebula
      var blobCols=[0x6366f1,0xa855f7,0x06b6d4,0xec4899];
      for(var j=0;j<3;j++){
        var b=this.add.circle(Phaser.Math.Between(60,W-60),Phaser.Math.Between(100,H-100),Phaser.Math.Between(40,100),blobCols[j],0.05);
        this.tweens.add({targets:b,scaleX:1.4,scaleY:0.7,alpha:0.02,duration:Phaser.Math.Between(4000,9000),yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
      }
      this.cameras.main.fadeIn(350,0,0,0);

      this.add.rectangle(W/2,H/2,450,650,0x07101f,0.9).setStrokeStyle(1,0x304868,0.72);
      this.add.rectangle(W/2,56,390,3,0x6366f1,0.75);

      var isBlitz=d.mode==='blitz';
      var titleTxt=d.completed?'SPRINT CLEAR!':(isBlitz?"TIME'S UP!":'GAME OVER');
      var titleCol=d.completed?'#22d3ee':(isBlitz?'#fbbf24':'#ef4444');
      this.add.text(W/2,112,titleTxt,{fontSize:'40px',fontFamily:'system-ui',fontStyle:'bold',color:titleCol,stroke:'#000',strokeThickness:3,shadow:{color:titleCol,blur:22,fill:true}}).setOrigin(0.5);

      var isNew=(d.score>=d.best&&d.score>0);
      if(isNew){
        var nb=this.add.text(W/2,165,'✨ NEW BEST!',{fontSize:'15px',fontFamily:'system-ui',fontStyle:'bold',color:'#fbbf24'}).setOrigin(0.5);
        this.tweens.add({targets:nb,scaleX:1.1,scaleY:1.1,duration:700,yoyo:true,repeat:-1});
      }

      var stats=[
        {l:'SCORE',v:(d.score||0).toLocaleString(),c:'#fbbf24'},
        {l:d.mode==='sprint'?'TIME':'BEST',v:d.mode==='sprint'?formatRunTime(d.time||0):(d.best||0).toLocaleString(),c:'#a855f7'},
        {l:'LEVEL',v:(d.level||1).toString(),c:'#22c55e'},
        {l:'LINES',v:(d.lines||0).toString(),c:'#3b82f6'}
      ];
      for(var si=0;si<stats.length;si++){
        var col=si%2,row=Math.floor(si/2);
        var sx=158+col*224,sy=255+row*100;
        var sc=Phaser.Display.Color.HexStringToColor(stats[si].c);
        this.add.rectangle(sx,sy,196,80,0x0b1120,1).setStrokeStyle(1,sc.color,0.38);
        this.add.text(sx,sy-20,stats[si].l,{fontSize:'9px',fontFamily:'system-ui',fontStyle:'bold',color:'#475569',letterSpacing:2}).setOrigin(0.5);
        var vt=this.add.text(sx,sy+5,stats[si].v,{fontSize:'24px',fontFamily:'system-ui',fontStyle:'bold',color:stats[si].c}).setOrigin(0.5).setAlpha(0);
        (function(v,delay){self.tweens.add({targets:v,alpha:1,duration:400,delay:delay})})(vt,si*110);
      }

      var pa=this.add.rectangle(W/2,500,250,54,0x6366f1,0.9).setStrokeStyle(1,0x818cf8,0.7).setInteractive({useHandCursor:true});
      var pat=this.add.text(W/2,500,'PLAY AGAIN',{fontSize:'15px',fontFamily:'system-ui',fontStyle:'bold',color:'#fff'}).setOrigin(0.5);
      pa.on('pointerover',function(){self.tweens.add({targets:[pa,pat],scaleX:1.04,scaleY:1.04,duration:100})});
      pa.on('pointerout',function(){self.tweens.add({targets:[pa,pat],scaleX:1,scaleY:1,duration:100})});
      pa.on('pointerdown',function(){
        initAudio();sfx.power();
        self.cameras.main.fade(200,0,0,0);
        self.time.delayedCall(200,function(){self.scene.start('Game',{mode:d.mode})});
      });

      var mb=this.add.rectangle(W/2,565,250,40,0x1e293b,1).setStrokeStyle(1,0x334155,0.5).setInteractive({useHandCursor:true});
      var mbt=this.add.text(W/2,565,'MAIN MENU',{fontSize:'12px',fontFamily:'system-ui',color:'#94a3b8'}).setOrigin(0.5);
      mb.on('pointerdown',function(){self.cameras.main.fade(200,0,0,0);self.time.delayedCall(200,function(){self.scene.start('Menu')})});

      [pa,pat,mb,mbt].forEach(function(o){if(o.setAlpha)o.setAlpha(0)});
      this.tweens.add({targets:[pa,pat,mb,mbt],alpha:1,duration:400,delay:560});

      this.add.text(W/2,635,(d.mode||'classic').toUpperCase()+' · '+(d.lines||0)+' LINES CLEARED',{fontSize:'10px',fontFamily:'system-ui',fontStyle:'bold',color:'#64748b',letterSpacing:2}).setOrigin(0.5);

    }
  });

  return phaserRuntime.createGame({
    type:Phaser.AUTO,
    width:W,height:H,
    resolution:Math.min(window.devicePixelRatio||1,1.5),
    backgroundColor:'#060810',
    parent:el,
    scene:[BootScene,MenuScene,GameScene,GameOverScene],
    render:{antialias:true,pixelArt:false,roundPixels:true,powerPreference:'high-performance'},
    scale:{
      mode:Phaser.Scale.FIT,
      autoCenter:Phaser.Scale.CENTER_BOTH,
      width:W,height:H
    },
    input:{keyboard:false,activePointers:3}
  });
}

// ── EXTENSION ENTRY POINT ────────────────────────────────────────────────────
export default function activate(host){
  const arcade = createArcade(host, {"name":"Tetris","icon":"▦","subtitle":"The classic, rebuilt with neon precision and Rift challenges","modes":[{"id":"classic","name":"Marathon","icon":"▦","desc":"Classic endless mastery","unlock":1},{"id":"sprint","name":"40-Line Sprint","icon":"⏱","desc":"Clear forty lines against the clock","unlock":1},{"id":"blitz","name":"Blitz","icon":"⚡","desc":"Two-minute score attack","unlock":2},{"id":"rift","name":"Rift","icon":"◇","desc":"Garbage rises when your clears slow down","unlock":4},{"id":"zen","name":"Zen","icon":"∞","desc":"No hard top-out pressure","unlock":5}],"perks":[{"id":"shield","name":"Top-Out Shield","icon":"🛡","desc":"One emergency board rescue","unlock":1},{"id":"combo","name":"Combo Bank","icon":"×2","desc":"Stronger consecutive-clear rewards","unlock":3},{"id":"fortune","name":"Power Fortune","icon":"✦","desc":"More frequent perk drops","unlock":5}],"missions":[{"event":"line","target":80,"title":"Line Architect","detail":"Clear 80 lines","icon":"▦","reward":90},{"event":"combo","target":35,"title":"Combo Engine","detail":"Build 35 combo points","icon":"🔥","reward":105},{"event":"tetris","target":8,"title":"Four-Line Master","detail":"Score eight Tetrises","icon":"🏆","reward":130}]});

  ensureStyle();TET_ARCADE=arcade;TET_PERK=arcade.perk().id;arcade.onChange(function(state){TET_PERK=state.perk.id;arcade.showToast('↻','Tetris rules updated','Mode and perk apply to the next run.');});
  var bestRef={value:0};
  var loaded=host.storage.get('tetris_best').then(function(v){if(typeof v==='number')bestRef.value=v}).catch(function(){});
  var gameInst=null;
  var inputBridge=createInputBridge(host.runtime.display),removeInput=function(){};

  return{
    mount:function(el){
      el.innerHTML='';
      el.style.cssText='background:#060810;overflow:hidden;width:100%;height:100%;';
      var wrap=document.createElement('div');
      wrap.className='tet-wrap';
      el.appendChild(wrap);
      removeInput=inputBridge.install(wrap);
      arcade.mount(wrap, el);
      // Keep the arcade profile launcher clear of touch controls at every
      // responsive breakpoint. Inline priority also beats the kit's mobile
      // safe-area rule, which otherwise returns it to the lower-right corner.
      var arcadeControls=wrap.querySelector('.tend-arcade-controls');
      if(arcadeControls){
        arcadeControls.style.setProperty('top','10px','important');
        arcadeControls.style.setProperty('right','10px','important');
        arcadeControls.style.setProperty('bottom','auto','important');
        arcadeControls.style.setProperty('left','auto','important');
      }
      var profileButton=wrap.querySelector('[data-kind="hub"]');
      if(profileButton){
        profileButton.title='Arcade profile, perks, and daily challenge';
        profileButton.setAttribute('aria-label','Open arcade profile, perks, and daily challenge');
      }

      var loadDiv=document.createElement('div');
      loadDiv.className='tet-load';
      loadDiv.innerHTML='<div class="tet-load-txt">LOADING TETRIS</div><div class="tet-load-bar"><div class="tet-load-fill" id="tet-lf"></div></div>';
      wrap.appendChild(loadDiv);

      var p=0;
      var iv=setInterval(function(){
        p=Math.min(p+7,88);
        var f=document.getElementById('tet-lf');
        if(f)f.style.width=p+'%';
      },80);

      Promise.all([loaded,loadPhaser(host)]).then(function(results){
        clearInterval(iv);
        var f=document.getElementById('tet-lf');if(f)f.style.width='100%';
        setTimeout(function(){
          loadDiv.remove();
          gameInst=createGame(wrap,host.storage,bestRef,results[1],arcade,host.runtime.display,inputBridge);
        },220);
      }).catch(function(err){
        clearInterval(iv);
        loadDiv.innerHTML='<div style="color:#ef4444;font-family:system-ui;padding:20px;text-align:center;font-size:13px">Could not load Phaser.js<br><small style="color:#64748b">The local tend.host Phaser runtime is unavailable</small></div>';
        console.error('Tetris: Phaser load failed',err);
      });
    },
    unmount:function(){removeInput();arcade.cleanup();
      if(gameInst&&gameInst.destroy)gameInst.destroy(true);
      gameInst=null;
      if(audioCtx){audioCtx.close().catch(function(){});audioCtx=null}
    }
  };
}
