import { createArcade, setTimeout, clearTimeout, setInterval, clearInterval, requestAnimationFrame, cancelAnimationFrame } from './arcade-kit.js';
var CK_MODE='empire';
var CK_PERK='tap';
var STYLE_ID='tend-ext-cookie-styles-v220';

var UPGRADES=[
  {id:'cursor',name:'Cursor',icon:'\uD83D\uDC46',baseCost:10,cps:0.1,desc:'A humble cursor to click cookies for you.'},
  {id:'grandma',name:'Grandma',icon:'\uD83D\uDC75',baseCost:50,cps:0.5,desc:'A nice grandma to bake more cookies.'},
  {id:'farm',name:'Farm',icon:'\uD83C\uDF3E',baseCost:200,cps:2,desc:'Grows cookie plants from the richest soil.'},
  {id:'mine',name:'Mine',icon:'\u26CF\uFE0F',baseCost:1000,cps:8,desc:'Digs deep underground for cookie ore.'},
  {id:'factory',name:'Factory',icon:'\uD83C\uDFED',baseCost:5000,cps:30,desc:'Mass-produces cookies on an assembly line.'},
  {id:'bank',name:'Bank',icon:'\uD83C\uDFE6',baseCost:25000,cps:100,desc:'Generates cookies from interest and investments.'},
  {id:'temple',name:'Temple',icon:'\uD83D\uDED5',baseCost:100000,cps:400,desc:'Ancient temple that conjures cookies from the ether.'},
  {id:'wizard',name:'Wizard Tower',icon:'\uD83E\uDDD9',baseCost:500000,cps:1500,desc:'Wizards transmute base materials into pure cookies.'},
  {id:'ship',name:'Spaceship',icon:'\uD83D\uDE80',baseCost:2000000,cps:6000,desc:'Harvests cookie dough from distant planets.'},
  {id:'portal',name:'Portal',icon:'\uD83C\uDF10',baseCost:10000000,cps:25000,desc:'Opens a portal to the cookie dimension.'},
  {id:'time',name:'Time Machine',icon:'\u23F0',baseCost:50000000,cps:100000,desc:'Brings cookies back from the past. Paradox-free.'},
  {id:'alchemy',name:'Alchemy Lab',icon:'\u2697\uFE0F',baseCost:200000000,cps:400000,desc:'Turns lead into cookies through arcane science.'}
];

var CLICK_TIERS=[
  {cost:100,mult:2,name:'Silver Fingers'},
  {cost:1000,mult:5,name:'Gold Fingers'},
  {cost:10000,mult:10,name:'Platinum Fingers'},
  {cost:100000,mult:50,name:'Diamond Fingers'},
  {cost:1000000,mult:100,name:'Mithril Fingers'},
  {cost:10000000,mult:500,name:'Adamantium Fingers'},
  {cost:100000000,mult:1000,name:'Cookie God Fingers'}
];

function ensureStyles(){
  if(document.getElementById(STYLE_ID))return;
  var s=document.createElement('style');s.id=STYLE_ID;
  s.textContent=[
    '@keyframes cookieSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}',
    '@keyframes ckCpsShimmer{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}',
    '@keyframes ckBounce{0%{transform:scale(1)}30%{transform:scale(.92)}60%{transform:scale(1.08)}100%{transform:scale(1)}}',
    '@keyframes ckBounceSmall{0%{transform:scale(1)}30%{transform:scale(.96)}60%{transform:scale(1.04)}100%{transform:scale(1)}}',
    '@keyframes ckFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}',
    '@keyframes ckSparkle{0%{opacity:1;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(var(--ck-dx),var(--ck-dy)) scale(0)}}',
    '@keyframes ckShimmer{0%,100%{opacity:0}50%{opacity:.4}}',
    '@keyframes ckFadeIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}',
    '@keyframes ckFadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}',
    '@keyframes ckFloatNum{0%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-36px)}}',
    '@keyframes ckGoldenPulse{0%,100%{box-shadow:0 0 20px rgba(251,191,36,.15),0 0 40px rgba(251,191,36,.05)}50%{box-shadow:0 0 35px rgba(251,191,36,.35),0 0 70px rgba(251,191,36,.15)}}',
    '.ck-r{width:100%;height:100%;display:flex;flex-direction:column;overflow:hidden;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;user-select:none;-webkit-user-select:none;background:linear-gradient(160deg,#0B0E1A 0%,#0F1422 30%,#0A0F1E 60%,#0d0f1f 100%);color:#E2E8F0;position:relative}',
    '.ck-top{display:flex;align-items:center;gap:10px;padding:10px 12px;flex-shrink:0;border-bottom:1px solid rgba(255,255,255,.06);background:linear-gradient(180deg,rgba(255,255,255,.04),rgba(255,255,255,.01))}',
    '.ck-top-title{font-size:18px;font-weight:900;background:linear-gradient(135deg,#F97316,#FBBF24,#F59E0B);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;letter-spacing:.5px;flex:1}',
    '.ck-top-stat{text-align:center;padding:3px 10px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);border-radius:8px;min-width:50px}',
    '.ck-top-stat-l{font-size:7px;text-transform:uppercase;letter-spacing:1px;color:#64748B;font-weight:700}',
    '.ck-top-stat-v{font-size:15px;font-weight:900;font-variant-numeric:tabular-nums;color:#FBBF24;line-height:1.1}',
    '.ck-main{flex:1;display:flex;gap:0;min-height:0;position:relative}',
    '.ck-left{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;position:relative;overflow:hidden;min-width:0;background:radial-gradient(ellipse at center,rgba(251,191,36,.04) 0%,transparent 60%);box-shadow:inset 0 0 40px rgba(251,191,36,.06)}',
    '.ck-cookie-wrap{position:relative;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:10px}',
    '.ck-cookie-outer{position:relative;border-radius:50%;display:flex;align-items:center;justify-content:center;animation:ckGoldenPulse 3s ease-in-out infinite}',
    '.ck-cookie-outer.bouncing{animation:none}',
    '.ck-cookie-outer.clicking{animation:none}',
    '.ck-cookie{font-size:88px;line-height:1;filter:drop-shadow(0 6px 16px rgba(0,0,0,.4)) drop-shadow(0 0 16px rgba(251,191,36,.5)) drop-shadow(0 0 32px rgba(251,191,36,.2));transition:transform .08s ease,filter .15s ease;position:relative;z-index:1;cursor:pointer}',
    '.ck-cookie:hover{transform:scale(1.04);filter:drop-shadow(0 8px 20px rgba(0,0,0,.5)) drop-shadow(0 0 22px rgba(251,191,36,.7)) drop-shadow(0 0 40px rgba(251,191,36,.3)) brightness(1.08)}',
    '.ck-cookie:active{transform:scale(.94)}',
    '.ck-shimmer{position:absolute;top:10%;left:15%;width:45%;height:25%;background:linear-gradient(135deg,rgba(255,255,255,0),rgba(255,255,255,.25),rgba(255,255,255,0));border-radius:50%;pointer-events:none;z-index:2;animation:ckShimmer 2.5s ease-in-out infinite}',
    '.ck-left-stats{display:flex;gap:6px;flex-wrap:wrap;justify-content:center}',
    '.ck-ls{text-align:center;padding:3px 8px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.05);border-radius:6px}',
    '.ck-ls-l{font-size:6px;text-transform:uppercase;letter-spacing:1px;color:#64748B;font-weight:600}',
    '.ck-ls-v{font-size:12px;font-weight:800;color:#FBBF24;font-variant-numeric:tabular-nums}',
    '.ck-right{width:210px;flex-shrink:0;display:flex;flex-direction:column;border-left:1px solid rgba(255,255,255,.06);background:rgba(0,0,0,.15);overflow-y:auto;overflow-x:hidden}',
    '.ck-shop-title{font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#64748B;font-weight:700;padding:10px 10px 6px;position:sticky;top:0;background:linear-gradient(180deg,#0F1422 60%,transparent);z-index:2;margin:0}',
    '.ck-shop-item{display:flex;align-items:center;gap:7px;padding:8px 10px;border-bottom:1px solid rgba(255,255,255,.03);transition:background .2s,transform .15s,box-shadow .2s;position:relative}',
    '.ck-shop-item:hover{background:rgba(255,255,255,.05);transform:translateX(2px);box-shadow:0 4px 16px rgba(0,0,0,.3)}',
    '.ck-shop-item.locked{opacity:.4;pointer-events:none}',
    '.ck-shop-icon{width:26px;height:26px;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0;border-radius:6px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.06)}',
    '.ck-shop-info{flex:1;min-width:0}',
    '.ck-shop-name{font-size:10px;font-weight:700;color:#E2E8F0;line-height:1.2}',
    '.ck-shop-cost{font-size:9px;color:#94A3B8;line-height:1.2}',
    '.ck-shop-cps{font-size:9px;color:#FBBF24;font-weight:700;line-height:1.2}',
    '.ck-shop-count{font-size:10px;font-weight:800;color:#F97316;min-width:20px;text-align:right}',
    '.ck-shop-buy{width:50px;padding:4px 6px;border-radius:6px;border:1px solid rgba(251,191,36,.3);background:linear-gradient(135deg,rgba(251,146,60,.15),rgba(251,191,36,.1));color:#FBBF24;font-weight:700;font-size:9px;cursor:pointer;font-family:inherit;transition:all .12s;letter-spacing:.3px;flex-shrink:0}',
    '.ck-shop-buy:hover{transform:translateY(-1px);border-color:rgba(251,191,36,.5);background:linear-gradient(135deg,rgba(251,146,60,.25),rgba(251,191,36,.18))}',
    '.ck-shop-buy:active{transform:scale(.94)}',
    '.ck-tooltip{position:absolute;bottom:calc(100% + 4px);left:50%;transform:translateX(-50%);background:rgba(15,23,42,.98);border:1px solid rgba(255,255,255,.12);color:#E2E8F0;padding:6px 10px;border-radius:8px;font-size:10px;white-space:nowrap;pointer-events:none;z-index:10;animation:ckFadeIn .15s ease;box-shadow:0 8px 24px rgba(0,0,0,.5);max-width:160px;white-space:normal;line-height:1.4}',
    '.ck-crumb-wrap{position:absolute;inset:0;pointer-events:none;z-index:5;overflow:visible}',
    '.ck-crumb{position:absolute;font-size:14px;pointer-events:none;animation:ckSparkle .55s ease-out forwards}',
    '.ck-float-num{position:absolute;font-size:20px;font-weight:900;color:#FBBF24;pointer-events:none;animation:ckFloatNum .8s ease-out forwards;text-shadow:0 0 12px rgba(251,191,36,.7),0 0 24px rgba(251,191,36,.4);z-index:10}',
    '.ck-right::-webkit-scrollbar{width:4px}',
    '.ck-right::-webkit-scrollbar-track{background:transparent}',
    '.ck-right::-webkit-scrollbar-thumb{background:rgba(255,255,255,.08);border-radius:2px}',
    '.ck-right::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,.14)}',
      '.ck-cookie{width:118px;height:118px;font-size:0;border-radius:50%;background:radial-gradient(circle at 32% 25%,#fcd38a 0 8%,#d98a3b 38%,#9a4f1f 72%,#6b3215 100%);border:4px solid rgba(255,220,150,.3);box-shadow:inset -10px -12px 24px rgba(70,25,5,.32),inset 8px 8px 18px rgba(255,235,185,.24),0 14px 30px rgba(0,0,0,.38),0 0 35px rgba(251,191,36,.32)}.ck-cookie i{position:absolute;width:13px;height:13px;border-radius:48% 52% 45% 55%;background:radial-gradient(circle at 30% 25%,#5b2a13,#2b1208 75%);box-shadow:inset 2px 2px 2px rgba(255,255,255,.08)}.ck-cookie i:nth-child(1){left:26%;top:22%}.ck-cookie i:nth-child(2){left:60%;top:18%;transform:rotate(25deg)}.ck-cookie i:nth-child(3){left:48%;top:46%}.ck-cookie i:nth-child(4){left:20%;top:58%;transform:rotate(-20deg)}.ck-cookie i:nth-child(5){left:68%;top:62%}.ck-cookie i:nth-child(6){left:45%;top:76%;transform:rotate(35deg)}.ck-ascend{margin-top:8px;padding:9px 18px;border-radius:11px;background:linear-gradient(135deg,#8b5cf6,#ec4899);color:#fff;border:1px solid rgba(255,255,255,.14);font-weight:850;cursor:pointer;box-shadow:0 10px 24px rgba(139,92,246,.25);flex:0 0 auto}.ck-left{padding:8px}.ck-right{overscroll-behavior:contain}.ck-shop-buy{min-height:28px}@media(min-width:768px){.tend-floating-window.tend-game-focus .tend-arcade-root.ck-r{width:min(1040px,calc(100dvw - 48px))!important;height:min(820px,calc(100dvh - 48px))!important}.tend-floating-window.tend-game-focus .ck-right{width:420px}.tend-floating-window.tend-game-focus .ck-cookie{width:190px;height:190px}.tend-floating-window.tend-game-focus .ck-shop-item{padding:11px 14px}.tend-floating-window.tend-game-focus .ck-shop-icon{width:38px;height:38px;font-size:21px}.tend-floating-window.tend-game-focus .ck-shop-name{font-size:13px}.tend-floating-window.tend-game-focus .ck-shop-cost,.tend-floating-window.tend-game-focus .ck-shop-cps{font-size:11px}.tend-floating-window.tend-game-focus .ck-shop-buy{width:76px;font-size:11px}}@media(max-width:767px){.ck-top{padding:max(8px,env(safe-area-inset-top)) 8px 8px;gap:5px;flex-wrap:wrap}.ck-top-title{width:100%;font-size:16px}.ck-top-stat{min-width:0;flex:1;padding:4px 5px}.ck-main{flex-direction:column}.ck-left{flex:0 0 42%;min-height:230px}.ck-right{width:100%;flex:1;border-left:0;border-top:1px solid rgba(255,255,255,.07)}.ck-cookie{width:92px;height:92px}.ck-cookie-wrap{padding:3px}.ck-ascend{margin-top:3px;padding:7px 14px}.ck-shop-title{padding:8px 10px 5px}.ck-shop-item{padding:7px 9px}.ck-shop-buy{width:58px}.ck-left-stats{gap:4px}.ck-ls{padding:3px 6px}}',
    '.ck-right{padding-bottom:58px}.ck-shop-item{min-height:52px}.ck-shop-buy{display:flex;align-items:center;justify-content:center;white-space:nowrap}.ck-ascend{min-height:40px;display:flex;align-items:center;justify-content:center;white-space:nowrap}@media(min-width:768px){.tend-floating-window.tend-game-focus .tend-arcade-root.ck-r{width:min(1060px,calc(100dvw - 48px))!important;height:min(760px,calc(100dvh - 48px))!important}.tend-floating-window.tend-game-focus .ck-main{padding:14px;gap:14px}.tend-floating-window.tend-game-focus .ck-left{border:1px solid rgba(255,255,255,.07);border-radius:18px;background:radial-gradient(circle at 50% 42%,rgba(251,191,36,.12),rgba(15,23,42,.48) 65%)}.tend-floating-window.tend-game-focus .ck-right{width:min(440px,43%);border:1px solid rgba(255,255,255,.07);border-radius:18px;overflow-y:auto}.tend-floating-window.tend-game-focus .ck-top{padding:13px 18px}.tend-floating-window.tend-game-focus .ck-top-title{font-size:23px}.tend-floating-window.tend-game-focus .ck-top-stat{min-width:110px;padding:7px 14px}.tend-floating-window.tend-game-focus .ck-top-stat-v{font-size:20px}.tend-floating-window.tend-game-focus .ck-ascend{font-size:13px;padding:11px 22px}}@media(max-width:767px){.ck-right{padding-bottom:calc(66px + env(safe-area-inset-bottom))}.ck-shop-item{min-height:50px}.ck-shop-buy{min-width:62px}.ck-main{min-height:0}.ck-left{min-height:220px}.ck-top-stat-v{font-size:14px!important}.ck-top-title{flex:0 0 100%;width:100%!important;text-align:center;font-size:15px;white-space:nowrap}.ck-r>.tend-arcade-controls{right:auto;left:max(10px,env(safe-area-inset-left))}}',
].join('');
  document.head.appendChild(s);
}

function el(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html)e.innerHTML=html;return e}

function fmtNum(n){
  if(n<0)return'-'+fmtNum(-n);
  if(n<1000)return Math.floor(n).toString();
  if(n<1e6)return(n/1e3).toFixed(2).replace(/\.?0+$/,'')+'K';
  if(n<1e9)return(n/1e6).toFixed(2).replace(/\.?0+$/,'')+'M';
  if(n<1e12)return(n/1e9).toFixed(2).replace(/\.?0+$/,'')+'B';
  return(n/1e12).toFixed(2).replace(/\.?0+$/,'')+'T';
}

function fmtLong(n){
  if(n<0)return'-'+fmtLong(-n);
  if(n<1000)return Math.floor(n).toFixed(1).replace(/\.0$/,'');
  if(n<1e6)return(n/1e3).toFixed(2).replace(/\.?0+$/,'')+' thousand';
  if(n<1e9)return(n/1e6).toFixed(2).replace(/\.?0+$/,'')+' million';
  if(n<1e12)return(n/1e9).toFixed(2).replace(/\.?0+$/,'')+' billion';
  return(n/1e12).toFixed(2).replace(/\.?0+$/,'')+' trillion';
}

function GameState(){
  this.cookies=0;
  this.totalEarned=0;
  this.cps=0;
  this.clicks=0;
  this.clickPower=1;
  this.clickTier=0;
  this.upgrades={};
  for(var i=0;i<UPGRADES.length;i++)this.upgrades[UPGRADES[i].id]=0;
  this.lastTime=Date.now();this.crumbs=0;this.goldenClicks=0;
}

GameState.prototype.getCost=function(upgrade){
  var owned=this.upgrades[upgrade.id]||0;
  return Math.floor(upgrade.baseCost*Math.pow(1.15,owned));
};

GameState.prototype.computeCPS=function(){
  var total=0;
  for(var i=0;i<UPGRADES.length;i++)total+=(this.upgrades[UPGRADES[i].id]||0)*UPGRADES[i].cps;
  return total*(1+this.crumbs*.05)*(CK_MODE==='idle'?1.18:1);
};

GameState.prototype.buy=function(upgrade){
  var cost=this.getCost(upgrade);
  if(this.cookies>=cost){
    this.cookies-=cost;
    this.upgrades[upgrade.id]=(this.upgrades[upgrade.id]||0)+1;
    this.cps=this.computeCPS();
    return true;
  }
  return false;
};

GameState.prototype.buyClickTier=function(){
  if(this.clickTier>=CLICK_TIERS.length)return false;
  var tier=CLICK_TIERS[this.clickTier];
  if(this.cookies>=tier.cost){
    this.cookies-=tier.cost;
    this.clickPower=tier.mult;
    this.clickTier++;
    return true;
  }
  return false;
};

GameState.prototype.nextClickTier=function(){
  if(this.clickTier>=CLICK_TIERS.length)return null;
  return CLICK_TIERS[this.clickTier];
};

GameState.prototype.addCookies=function(amount){
  var a=Math.max(0,amount);
  this.cookies+=a;
  this.totalEarned+=a;
};

GameState.prototype.click=function(){
  var mult=(CK_MODE==='frenzy'?2.2:CK_MODE==='idle'?.75:1)*(CK_PERK==='tap'?1.35:1);
  this.addCookies(this.clickPower*mult);
  this.clicks++;
};

GameState.prototype.tick=function(now){
  var dt=(now-this.lastTime)/1000;
  if(dt>0){
    var earned=this.cps*dt;
    this.addCookies(earned);
  }
  this.lastTime=now;
};

GameState.prototype.serialize=function(){
  return{
    cookies:this.cookies,
    totalEarned:this.totalEarned,
    cps:this.cps,
    clicks:this.clicks,
    clickPower:this.clickPower,
    clickTier:this.clickTier,
    upgrades:this.upgrades,
    lastTime:this.lastTime,
    crumbs:this.crumbs,
    goldenClicks:this.goldenClicks
  };
};

GameState.prototype.deserialize=function(data){
  if(!data||typeof data!=='object')return;
  this.cookies=typeof data.cookies==='number'?data.cookies:0;
  this.totalEarned=typeof data.totalEarned==='number'?data.totalEarned:this.cookies;
  this.cps=typeof data.cps==='number'?data.cps:0;
  this.clicks=typeof data.clicks==='number'?data.clicks:0;
  this.clickPower=typeof data.clickPower==='number'?data.clickPower:1;
  this.clickTier=typeof data.clickTier==='number'?data.clickTier:0;this.crumbs=typeof data.crumbs==='number'?data.crumbs:0;this.goldenClicks=typeof data.goldenClicks==='number'?data.goldenClicks:0;
  if(data.upgrades&&typeof data.upgrades==='object'){
    for(var i=0;i<UPGRADES.length;i++){
      var id=UPGRADES[i].id;
      this.upgrades[id]=typeof data.upgrades[id]==='number'?data.upgrades[id]:0;
    }
  }
  var savedTime=typeof data.lastTime==='number'?data.lastTime:Date.now();
  var dt=(Date.now()-savedTime)/1000;
  var offlineCap=(CK_PERK==='offline'?259200:CK_MODE==='idle'?172800:86400);
  if(dt>0&&dt<offlineCap&&this.cps>0){
    var offline=this.cps*dt*(CK_PERK==='offline'?1.35:1);
    this.addCookies(offline);
  }
  this.lastTime=Date.now();
  this.cps=this.computeCPS();
};

export default function activate(host){
  const arcade = createArcade(host, {"name":"Cookie Empire Odyssey","icon":"🍪","subtitle":"Idle progression, prestige, golden events, and quests","modes":[{"id":"empire","name":"Empire","icon":"🏛","desc":"Balanced idle and active production","unlock":1},{"id":"frenzy","name":"Frenzy","icon":"⚡","desc":"Active clicking produces larger bursts","unlock":3},{"id":"idle","name":"Idle","icon":"☾","desc":"Stronger offline gains, softer clicks","unlock":5}],"perks":[{"id":"tap","name":"Power Tap","icon":"☝","desc":"Click power grows faster","unlock":1},{"id":"golden","name":"Golden Oven","icon":"✦","desc":"Golden cookies appear more often","unlock":3},{"id":"offline","name":"Night Shift","icon":"☾","desc":"Improved offline production cap","unlock":6}],"missions":[{"event":"click","target":250,"title":"Cookie Storm","detail":"Click 250 times","icon":"🍪","reward":75},{"event":"buy","target":30,"title":"Factory Builder","detail":"Purchase 30 upgrades","icon":"🏭","reward":100},{"event":"score","target":100000,"title":"Sweet Fortune","detail":"Bake 100,000 cookies","icon":"◆","reward":120}]});

  ensureStyles();
  var root=null,game=null,audio=null,tickTimer=null,saveTimer=null;
  var crumbWrap=null,cookieEl=null,cookieOuter=null,cookieTop=null,cpsEl=null,clickEl=null;
  var shopEl=null,clickShopEl=null,bouncing=false;
  var activeMode='empire',activePerk='tap',goldenTimer=null,goldenNode=null,removeArcadeChange=null;
  arcade.ready.then(function(){activeMode=arcade.mode().id;activePerk=arcade.perk().id;CK_MODE=activeMode;CK_PERK=activePerk;});

  var CRUMBS=['\uD83C\uDF6A','\u2728','\uD83C\uDF6A','\u2B50','\uD83C\uDF6A','\u2728','\uD83C\uDF6A'];

  function initA(){if(!audio)try{audio=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}
  function resA(){if(audio&&audio.state==='suspended')audio.resume()}
  function tone(f,d,t,v){
    if(!audio)return;resA();
    try{
      var o=audio.createOscillator(),g=audio.createGain();
      o.type=t||'sine';o.frequency.setValueAtTime(f,audio.currentTime);
      g.gain.setValueAtTime(v||.06,audio.currentTime);
      g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+d);
      o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+d);
    }catch(e){}
  }
  function sfxClick(){
    var f=[380,420,460];
    var rf=f[Math.floor(Math.random()*f.length)];
    tone(rf,.06,'sine',.04);
  }
  function sfxBuy(){
    tone(523,.06,'triangle',.06);
    setTimeout(function(){tone(659,.06,'triangle',.06)},40);
    setTimeout(function(){tone(784,.09,'triangle',.07)},80);
  }
  function sfxBigBuy(){
    tone(523,.08,'triangle',.08);
    setTimeout(function(){tone(659,.08,'triangle',.08)},50);
    setTimeout(function(){tone(784,.08,'triangle',.08)},100);
    setTimeout(function(){tone(1047,.12,'triangle',.1)},150);
  }

  function spawnCrumbs(rect,mx,my){
    if(!crumbWrap)return;
    var cx=rect.left+rect.width/2,cy=rect.top+rect.height/2;
    var count=4+Math.floor(Math.random()*5);
    for(var i=0;i<count;i++){
      var cr=document.createElement('span');cr.className='ck-crumb';
      cr.textContent=CRUMBS[Math.floor(Math.random()*CRUMBS.length)];
      var angle=Math.random()*Math.PI*2;
      var dist=30+Math.random()*50;
      var dx=Math.cos(angle)*dist,dy=Math.sin(angle)*dist-15;
      var delay=Math.random()*.08;
      cr.style.cssText='left:'+(cx-7)+'px;top:'+(cy-7)+'px;--ck-dx:'+dx+'px;--ck-dy:'+dy+'px;animation-delay:'+delay+'s;font-size:'+(12+Math.random()*8)+'px';
      crumbWrap.appendChild(cr);
      setTimeout(function(){if(cr.parentNode)cr.remove()},550+delay*1000);
    }
  }

  function spawnFloatNum(x,y,text){
    if(!root)return;
    var fn=document.createElement('span');fn.className='ck-float-num';
    fn.textContent=text;
    fn.style.cssText='left:'+(x-25)+'px;top:'+(y-10)+'px';
    root.appendChild(fn);
    setTimeout(function(){if(fn.parentNode)fn.remove()},800);
  }

  function doClick(e){
    initA();sfxClick();
    game.click();arcade.record('click',1);arcade.record('score',game.clickPower);
    var rect=cookieEl.getBoundingClientRect();
    var parentRect=cookieEl.parentElement.getBoundingClientRect();
    spawnCrumbs(rect);
    var shown=game.clickPower*(activeMode==='frenzy'?2.2:activeMode==='idle'?.75:1)*(activePerk==='tap'?1.35:1);spawnFloatNum(e.clientX-parentRect.left,e.clientY-parentRect.top,'+'+fmtNum(shown));
    if(cookieOuter){
      cookieOuter.classList.remove('clicking');
      void cookieOuter.offsetWidth;
      cookieOuter.classList.add('clicking');
      cookieOuter.style.animation='none';
      cookieOuter.offsetHeight;
      cookieOuter.style.animation='ckBounceSmall .15s ease';
    }
    updUI();
  }

  function buyUpgrade(upgrade){
    var cost=game.getCost(upgrade);
    if(game.cookies>=cost){
      initA();
      var owned=game.upgrades[upgrade.id]||0;
      game.buy(upgrade);arcade.record('buy',1);
      if(owned>=10)sfxBigBuy();else sfxBuy();
      updUI();
    }
  }

  function buyClickUpgrade(){
    var tier=game.nextClickTier();
    if(!tier)return;
    if(game.cookies>=tier.cost){
      initA();sfxBigBuy();
      game.buyClickTier();arcade.record('buy',1);
      updUI();
    }
  }

  function scheduleGolden(){
    if(goldenTimer)clearTimeout(goldenTimer);
    var base=activePerk==='golden'?13000:23000;
    goldenTimer=setTimeout(spawnGolden,base+Math.random()*9000);
  }

  function spawnGolden(){
    if(!root||goldenNode){scheduleGolden();return}
    goldenNode=el('button','ck-golden','✦');goldenNode.title='Golden cookie';
    goldenNode.style.cssText='position:absolute;z-index:80;width:62px;height:62px;border-radius:50%;border:2px solid rgba(255,255,255,.65);background:radial-gradient(circle at 35% 25%,#fff7b2,#fbbf24 35%,#f97316 72%,#7c2d12);color:white;font-size:28px;box-shadow:0 0 28px rgba(251,191,36,.9),0 0 64px rgba(249,115,22,.45);cursor:pointer;left:'+(12+Math.random()*72)+'%;top:'+(15+Math.random()*58)+'%;transform:translate(-50%,-50%);animation:ckBounce 1s ease-in-out infinite';
    goldenNode.addEventListener('click',function(){initA();var prize=Math.max(77,game.cps*45,game.clickPower*70);game.addCookies(prize);game.goldenClicks++;arcade.record('golden',1,{achievement:game.goldenClicks===10?'golden_10':null,title:'Golden baker',detail:'Collected ten golden cookies.',coins:60});arcade.record('score',prize);arcade.showToast('✦','Golden cookie','+'+fmtNum(prize)+' cookies');goldenNode.remove();goldenNode=null;updUI();scheduleGolden()});
    root.appendChild(goldenNode);setTimeout(function(){if(goldenNode){goldenNode.remove();goldenNode=null;scheduleGolden()}},6500);
  }

  function prestige(){
    var gain=Math.floor(Math.sqrt(game.totalEarned/1000000));
    if(gain<1)return arcade.showToast('◆','Prestige locked','Bake at least 1 million total cookies.');
    if(!confirm('Ascend the bakery for '+gain+' permanent crumbs? Current cookies and buildings reset.'))return;
    var crumbs=game.crumbs+gain;game=new GameState();game.crumbs=crumbs;game.cps=game.computeCPS();arcade.reward(gain*40,gain*8);arcade.showToast('🏛','Bakery ascended','+'+gain+' crumbs · permanent +'+(gain*5)+'% production');updUI();saveGame();
  }

  function renderShop(){
    if(!shopEl)return;
    var html='<div class="ck-shop-title">\uD83C\uDF6A Buildings</div>';
    for(var i=0;i<UPGRADES.length;i++){
      var up=UPGRADES[i];
      var cost=game.getCost(up);
      var owned=game.upgrades[up.id]||0;
      var canAfford=game.cookies>=cost;
      html+='<div class="ck-shop-item'+(canAfford?'':' locked')+'">'
        +'<div class="ck-shop-icon">'+up.icon+'</div>'
        +'<div class="ck-shop-info">'
        +'<div class="ck-shop-name">'+up.name+'</div>'
        +'<div class="ck-shop-cps">+'+fmtNum(up.cps)+' CPS</div>'
        +'<div class="ck-shop-cost">\uD83C\uDF6A '+fmtNum(cost)+'</div>'
        +'</div>'
        +'<div class="ck-shop-count" title="'+up.desc+'">'+owned+'</div>'
        +'<button class="ck-shop-buy" data-buy="'+up.id+'">Buy</button>'
        +'</div>';
    }
    var nextTier=game.nextClickTier();
    html+='<div class="ck-shop-title">\u2728 Click Power x'+game.clickPower+'</div>';
    if(nextTier){
      html+='<div class="ck-shop-item'+(game.cookies>=nextTier.cost?'':' locked')+'">'
        +'<div class="ck-shop-icon">\uD83D\uDC46</div>'
        +'<div class="ck-shop-info">'
        +'<div class="ck-shop-name">'+nextTier.name+'</div>'
        +'<div class="ck-shop-cps">Click x'+nextTier.mult+'</div>'
        +'<div class="ck-shop-cost">\uD83C\uDF6A '+fmtNum(nextTier.cost)+'</div>'
        +'</div>'
        +'<button class="ck-shop-buy" style="background:linear-gradient(135deg,rgba(168,85,247,.25),rgba(139,92,246,.15));border-color:rgba(168,85,247,.4);color:#C084FC" data-buy-click="1">Upgrade</button>'
        +'</div>';
    }else{
      html+='<div class="ck-shop-item" style="opacity:.3">'
        +'<div class="ck-shop-icon">\u2728</div>'
        +'<div class="ck-shop-info"><div class="ck-shop-name">Maximum Power!</div></div>'
        +'</div>';
    }
    shopEl.innerHTML=html;

    var buyBtns=shopEl.querySelectorAll('[data-buy]');
    for(var j=0;j<buyBtns.length;j++){
      buyBtns[j].addEventListener('click',function(e){
        e.stopPropagation();
        var id=this.getAttribute('data-buy');
        for(var k=0;k<UPGRADES.length;k++)if(UPGRADES[k].id===id){buyUpgrade(UPGRADES[k]);return}
      });
    }
    var clickBtn=shopEl.querySelector('[data-buy-click]');
    if(clickBtn)clickBtn.addEventListener('click',function(e){e.stopPropagation();buyClickUpgrade()});
  }

  function updUI(){
    if(!root)return;
    var ct=root.querySelector('#ck-cookie-total');
    if(ct)ct.textContent=fmtNum(game.cookies);
    var ce=root.querySelector('#ck-cps');
    if(ce)ce.textContent=fmtNum(game.cps)+'/s';
    var cl=root.querySelector('#ck-clicks');
    if(cl)cl.textContent=fmtNum(game.clicks);
    var cr=root.querySelector('#ck-crumbs');if(cr)cr.textContent=game.crumbs;
    var te=root.querySelector('#ck-total-ern');
    if(te)te.textContent=fmtNum(game.totalEarned);
    renderShop();
  }

  function tickLoop(){
    if(!game||!root)return;
    game.tick(Date.now());
    updUI();
  }

  function saveGame(){
    if(!game)return;
    host.storage.set('cookie_save',game.serialize()).catch(function(){});
  }

  function loadGame(){
    host.storage.get('cookie_save').then(function(data){
      game.deserialize(data);CK_MODE=arcade.mode().id;CK_PERK=arcade.perk().id;game.cps=game.computeCPS();updUI();scheduleGolden();
    }).catch(function(){});
  }

  removeArcadeChange=arcade.onChange(function(){
    activeMode=arcade.mode().id;activePerk=arcade.perk().id;CK_MODE=activeMode;CK_PERK=activePerk;
    if(game){game.cps=game.computeCPS();scheduleGolden();updUI();arcade.showToast('✓','Bakery plan applied',arcade.mode().name+' · '+arcade.perk().name)}
    arcade.closeHub();
  });

  return{
    mount:function(container){
      container.innerHTML='';
      root=el('div','ck-r');container.appendChild(root);
      arcade.mount(root, container);
      root.style.position='relative';

      var topBar=el('div','ck-top');
      topBar.innerHTML=''
        +'<span class="ck-top-title">\uD83C\uDF6A Cookie Clicker</span>'
        +'<div class="ck-top-stat"><div class="ck-top-stat-l">Cookies</div><div class="ck-top-stat-v" id="ck-cookie-total" style="font-size:18px">0</div></div>'
        +'<div class="ck-top-stat"><div class="ck-top-stat-l">Crumbs</div><div class="ck-top-stat-v" id="ck-crumbs" style="color:#c084fc">0</div></div>'
        +'<div class="ck-top-stat"><div class="ck-top-stat-l">Per Second</div><div class="ck-top-stat-v" id="ck-cps" style="background:linear-gradient(270deg,#F97316,#FBBF24,#22C55E);background-size:300% 300%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:ckCpsShimmer 3s ease infinite">0/s</div></div>';
      root.appendChild(topBar);

      var mainArea=el('div','ck-main');

      var leftSide=el('div','ck-left');
      var cookieWrap=el('div','ck-cookie-wrap');
      cookieOuter=el('div','ck-cookie-outer');
      cookieEl=el('div','ck-cookie','<i></i><i></i><i></i><i></i><i></i><i></i>');
      var shimmer=el('div','ck-shimmer');
      cookieOuter.appendChild(cookieEl);
      cookieOuter.appendChild(shimmer);
      cookieWrap.appendChild(cookieOuter);
      leftSide.appendChild(cookieWrap);

      var leftStats=el('div','ck-left-stats');
      leftStats.innerHTML=''
        +'<div class="ck-ls"><div class="ck-ls-l">Clicks</div><div class="ck-ls-v" id="ck-clicks">0</div></div>'
        +'<div class="ck-ls"><div class="ck-ls-l">All Time</div><div class="ck-ls-v" id="ck-total-ern">0</div></div>';
      leftSide.appendChild(leftStats);var ascend=el('button','ck-ascend','Ascend Empire');ascend.addEventListener('click',prestige);leftSide.appendChild(ascend);

      crumbWrap=el('div','ck-crumb-wrap');
      leftSide.appendChild(crumbWrap);

      mainArea.appendChild(leftSide);

      var rightSide=el('div','ck-right');
      shopEl=el('div');shopEl.style.cssText='flex:1';
      rightSide.appendChild(shopEl);
      mainArea.appendChild(rightSide);

      root.appendChild(mainArea);

      cookieEl.addEventListener('mousedown',function(e){e.preventDefault();doClick(e)});
      cookieEl.addEventListener('touchstart',function(e){e.preventDefault();doClick(e.touches[0])});

      activeMode=arcade.mode().id;activePerk=arcade.perk().id;CK_MODE=activeMode;CK_PERK=activePerk;game=new GameState();arcade.record('start',1);loadGame();

      tickTimer=setInterval(tickLoop,100);
      saveTimer=setInterval(saveGame,10000);
    },
    unmount:function(){removeArcadeChange?.();arcade.cleanup();
      if(tickTimer)clearInterval(tickTimer);
      if(saveTimer)clearInterval(saveTimer);if(goldenTimer)clearTimeout(goldenTimer);if(goldenNode)goldenNode.remove();
      saveGame();if(audio){audio.close().catch(function(){});audio=null}
    }
  };
}
