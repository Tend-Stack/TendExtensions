var STYLE_ID = 'tend-ext-wordle-styles';

var WORDS = ['about','above','abuse','actor','admit','adopt','adult','after','again','agent','agree','ahead','alarm','album','alien','align','alive','allow','alone','along','alter','among','angel','anger','angle','angry','apart','apple','apply','arena','argue','arise','aside','asset','avoid','award','aware','awful','badge','basic','beach','begin','being','below','bench','birth','black','blade','blame','blank','blast','blaze','bleed','blend','bless','blind','block','blood','bloom','board','bonus','booth','bound','brain','brand','brave','bread','break','breed','brick','brief','broad','brook','brown','brush','buddy','build','burst','buyer','cabin','candy','carry','catch','cause','chain','chair','charm','chart','chase','cheap','check','chest','chief','child','chill','chunk','claim','class','clean','clear','climb','cling','clock','close','cloud','coach','coast','color','comic','coral','cost','could','count','court','cover','craft','crane','crash','cream','crime','cross','crowd','crown','crush','curve','cycle','dance','death','delay','demon','depth','dirty','doubt','dozen','draft','drama','dream','dress','drift','drink','drive','dying','eager','early','earth','eight','elect','elite','empty','enemy','enjoy','enter','equal','error','essay','event','every','exact','exist','extra','faith','false','fault','favor','fence','fever','field','fight','final','first','fixed','flame','flash','fleet','flesh','float','flood','floor','flour','focus','force','forge','forth','forum','found','frame','frank','fraud','fresh','front','frost','fruit','fully','funny','ghost','giant','given','glass','globe','glory','going','grace','grain','grand','grant','grass','great','green','grief','gross','group','grown','guard','guess','guest','guide','happy','heart','heavy','hence','honor','horse','hotel','house','human','humor','ideal','image','imply','index','inner','issue','joint','joy','judge','jump','known','label','large','later','laugh','layer','learn','least','leave','legal','lemon','level','lever','light','limit','local','logic','loose','lower','lucky','lunch','lying','magic','major','march','match','maybe','mayor','media','mercy','merit','metal','might','minor','minus','mixed','model','money','month','moral','motor','mount','mouse','mouth','movie','music','naval','nerve','never','newly','night','noble','noise','north','noted','novel','nurse','occur','ocean','offer','often','olive','onion','opera','orbit','order','organ','other','outer','owner','oxide','paint','panel','panic','paper','party','pause','peace','phase','phone','photo','piano','piece','pilot','pitch','place','plain','plane','plant','plate','plaza','point','polar','pound','power','press','price','pride','prime','print','prior','prize','proof','proud','prove','proxy','pulse','pupil','queen','quick','quiet','quite','radar','radio','raise','range','rapid','ratio','reach','react','ready','rebel','refer','relax','rider','rifle','right','rival','river','robot','rocky','roman','rough','round','route','royal','ruler','rural','sadly','sauce','scale','scene','scope','score','seize','sense','serve','setup','seven','shade','shaft','shake','shall','shame','shape','share','shark','sharp','sheep','sheet','shelf','shell','shift','shine','shirt','shock','shoot','shore','short','shout','sight','since','sixth','sixty','skill','skull','slash','slave','sleep','slice','slide','slope','small','smart','smell','smile','smith','smoke','snake','solid','solve','sorry','sound','south','space','spare','spark','speak','speed','spend','spent','spine','split','spoke','sport','spray','squad','stack','staff','stage','stair','stake','stamp','stand','start','state','steam','steel','steep','steer','stem','stick','still','stock','stone','stood','store','storm','story','stove','stuff','style','sugar','suite','super','sweet','swing','sword','table','taste','teach','thank','theme','there','thick','thing','think','third','those','three','threw','throw','thumb','tiger','tight','tired','title','today','token','topic','total','touch','tough','tower','trace','track','trade','trail','train','trait','trash','treat','trend','trial','tribe','trick','tried','troop','truck','truly','trump','trunk','trust','truth','twice','uncle','under','undue','union','unity','until','upper','upset','urban','usage','usual','valid','value','video','virus','visit','vital','voice','voter','waste','watch','water','weave','wheel','where','which','while','white','whole','whose','woman','world','worry','worse','worst','worth','would','wound','write','wrong','yield','young','youth'];

var MAX_GUESSES = 6;
var WORD_LEN = 5;

function ensureStyles(){
  if(document.getElementById(STYLE_ID))return;
  var s=document.createElement('style');s.id=STYLE_ID;
  s.textContent=[
'@keyframes wdTileFlip{0%{transform:rotateX(0) scale(1)}50%{transform:rotateX(90deg) scale(1.05);background:#333;border-color:#333;color:transparent}100%{transform:rotateX(0) scale(1)}}',
'@keyframes wdTilePop{0%{transform:scale(1)}30%{transform:scale(1.18)}100%{transform:scale(1)}}',
'@keyframes wdTileBounce{0%{transform:translateY(0)}25%{transform:translateY(-8px)}50%{transform:translateY(0)}75%{transform:translateY(-4px)}100%{transform:translateY(0)}}',
'@keyframes wdShake{0%,100%{transform:translateX(0)}10%{transform:translateX(-6px)}30%{transform:translateX(6px)}50%{transform:translateX(-4px)}70%{transform:translateX(4px)}90%{transform:translateX(-2px)}}',
'@keyframes wdFadeIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}',
'@keyframes wdConfetti{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(600px) rotate(720deg);opacity:0}}',
'@keyframes wdKeyPress{0%{transform:scale(1)}50%{transform:scale(.92)}100%{transform:scale(1)}}',
'.wd-r{width:100%;height:100%;display:flex;flex-direction:column;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;user-select:none;-webkit-user-select:none;overflow:hidden;background:linear-gradient(180deg,#0B0E1A 0%,#0a0d1a 50%,#0d0f1f 100%);color:#E2E8F0;position:relative}',
'.wd-bar{display:flex;align-items:center;gap:8px;padding:10px 12px;flex-shrink:0}',
'.wd-title-block{flex:1}',
'.wd-title{font-size:24px;font-weight:900;margin:0;background:linear-gradient(135deg,#22c55e,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;letter-spacing:1px}',
'.wd-sub{font-size:10px;color:#64748B;font-weight:600;text-transform:uppercase;letter-spacing:1px}',
'.wd-help{width:32px;height:32px;border-radius:9px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:#94A3B8;cursor:pointer;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:15px;font-family:inherit;flex-shrink:0;transition:all .15s}',
'.wd-help:hover{background:rgba(255,255,255,.1);color:#fff;transform:translateY(-1px)}',
'.wd-board-wrap{flex:1;display:flex;align-items:center;justify-content:center;padding:8px;min-height:0}',
'.wd-board{display:grid;grid-template-rows:repeat(6,1fr);gap:6px;width:100%;max-width:320px}',
'.wd-row{display:grid;grid-template-columns:repeat(5,1fr);gap:6px}',
'.wd-tile{aspect-ratio:1;border:2px solid rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:900;text-transform:uppercase;transition:transform .1s,background .15s,border-color .15s,color .15s,box-shadow .15s;color:#fff;position:relative;border-radius:4px;background:rgba(255,255,255,.03)}',
'.wd-tile.filled{border-color:rgba(255,255,255,.25);background:rgba(255,255,255,.06)}',
'.wd-tile.green{background:#538D4E;border-color:#538D4E;color:#fff;box-shadow:0 0 14px rgba(34,197,94,.6),0 0 4px rgba(34,197,94,.9);filter:brightness(1.1)}',
'.wd-tile.yellow{background:#B59F3B;border-color:#B59F3B;color:#fff;box-shadow:0 0 14px rgba(251,191,36,.6),0 0 4px rgba(251,191,36,.9)}',
'.wd-tile.gray{background:#3A3A3C;border-color:#3A3A3C;color:#fff;box-shadow:inset 0 0 8px rgba(0,0,0,.4)}',
'.wd-tile.flip{animation:wdTileFlip .5s ease forwards}',
'.wd-tile.pop{animation:wdTilePop .15s ease}',
'.wd-tile.bounce{animation:wdTileBounce .4s ease}',
'.wd-tile.shake{animation:wdShake .5s ease}',
'.wd-kb{flex-shrink:0;padding:6px 4px 10px;display:flex;flex-direction:column;gap:5px;align-items:center}',
'.wd-kb-row{display:flex;gap:4px;justify-content:center}',
'.wd-key{min-width:28px;height:46px;border-radius:6px;border:none;background:rgba(255,255,255,.08);color:#E2E8F0;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;text-transform:uppercase;padding:0 6px;transition:all .1s;-webkit-tap-highlight-color:transparent}',
'.wd-key:hover{background:rgba(255,255,255,.18);transform:translateY(-2px);box-shadow:0 4px 12px rgba(0,0,0,.4)}',
'.wd-key:active{animation:wdKeyPress .1s ease}',
'.wd-key.wide{min-width:48px;font-size:11px;padding:0 10px}',
'.wd-key.green{background:#538D4E;color:#fff}',
'.wd-key.yellow{background:#B59F3B;color:#fff}',
'.wd-key.gray{background:#3A3A3C;color:#fff}',
'.wd-toast{position:absolute;top:60px;left:50%;transform:translateX(-50%) translateY(-20px);background:rgba(15,23,42,.95);border:1px solid rgba(255,255,255,.12);color:#fff;padding:8px 20px;border-radius:12px;font-weight:700;z-index:100;font-size:13px;pointer-events:none;opacity:0;transition:opacity .2s,transform .3s}',
'.wd-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}',
'.wd-overlay{position:absolute;inset:0;background:rgba(0,0,0,.75);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;z-index:50;padding:14px;animation:wdFadeIn .2s ease}',
'.wd-modal{background:linear-gradient(180deg,#1A1F35,#15192a);border:1px solid rgba(255,255,255,.1);border-radius:18px;padding:24px 22px;text-align:center;max-width:340px;width:100%;animation:wdFadeIn .3s ease;box-shadow:0 24px 60px rgba(0,0,0,.7)}',
'.wd-modal h2{font-size:22px;font-weight:900;margin:0 0 4px}',
'.wd-modal .wd-m-sub{color:#94A3B8;font-size:13px;margin:0 0 14px}',
'.wd-m-stats{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:6px;margin:8px 0 12px}',
'.wd-msi{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:8px 4px}',
'.wd-msil{font-size:9px;color:#94A3B8;font-weight:600;text-transform:uppercase;letter-spacing:1px}',
'.wd-msiv{font-size:22px;font-weight:900;color:#fff;margin-top:2px}',
'.wd-dist{text-align:left;margin:8px 0 14px}',
'.wd-dist-title{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#94A3B8;font-weight:700;margin-bottom:6px}',
'.wd-dist-row{display:flex;align-items:center;gap:6px;margin:3px 0;font-size:11px;color:#CBD5E1}',
'.wd-dist-num{font-weight:700;width:16px;text-align:right;color:#94A3B8}',
'.wd-dist-bar{flex:1;height:16px;border-radius:3px;min-width:4px;background:rgba(255,255,255,.08);position:relative;overflow:hidden}',
'.wd-dist-bar-inner{height:100%;border-radius:3px;background:linear-gradient(90deg,#22c55e,#4ade80);transition:width .4s ease}',
'.wd-dist-bar-inner.best{background:linear-gradient(90deg,#22c55e,#3b82f6)}',
'.wd-dist-count{font-weight:700;font-variant-numeric:tabular-nums;min-width:16px;text-align:right;font-size:11px}',
'.wd-mb{display:flex;gap:8px;justify-content:center}',
'.wd-mbtn{padding:9px 22px;border-radius:10px;border:none;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;transition:transform .15s}',
'.wd-mbtn:hover{transform:translateY(-1px)}',
'.wd-mbtn.pri{background:linear-gradient(135deg,#22c55e,#3b82f6);color:#fff;box-shadow:0 4px 18px rgba(34,197,94,.35)}',
'.wd-mbtn.sec{background:rgba(255,255,255,.06);color:#E2E8F0;border:1px solid rgba(255,255,255,.1)}',
'.wd-help-modal{position:absolute;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;z-index:50;padding:14px;animation:wdFadeIn .2s ease}',
'.wd-help-box{background:linear-gradient(180deg,#1A1F35,#15192a);border:1px solid rgba(255,255,255,.1);border-radius:18px;padding:20px;max-width:340px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.6)}',
'.wd-help-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}',
'.wd-help-title{font-size:18px;font-weight:800;color:#fff;margin:0;display:flex;align-items:center;gap:8px}',
'.wd-help-close{width:28px;height:28px;border-radius:8px;border:none;background:rgba(255,255,255,.06);color:#94A3B8;cursor:pointer;font-size:18px;line-height:1;font-family:inherit;transition:all .15s}',
'.wd-help-close:hover{background:rgba(255,255,255,.12);color:#fff}',
'.wd-help-body{font-size:13px;line-height:1.55;color:#CBD5E1}',
'.wd-help-body h3{font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#94A3B8;margin:14px 0 6px;font-weight:700}',
'.wd-help-body h3:first-child{margin-top:0}',
'.wd-help-body ul{margin:0;padding-left:18px}',
'.wd-help-body li{margin:3px 0}',
'.wd-example{display:flex;gap:6px;margin:8px 0;align-items:center;font-size:12px;color:#CBD5E1}',
'.wd-ex-tile{width:32px;height:32px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:16px;text-transform:uppercase}',
'.wd-confetti{position:absolute;top:-10px;width:8px;height:8px;border-radius:2px;pointer-events:none;z-index:200;animation:wdConfetti 2.2s ease-out forwards}',
'.wd-answer-reveal{font-size:18px;font-weight:900;color:#22c55e;letter-spacing:3px;text-transform:uppercase;margin:4px 0}'
  ].join('');
  document.head.appendChild(s);
}

function el(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html)e.innerHTML=html;return e}

function pickWord(){
  return WORDS[Math.floor(Math.random()*WORDS.length)];
}

function isValidWord(w){
  return WORDS.indexOf(w.toLowerCase())!==-1;
}

function checkGuess(guess,target){
  var result=[],targetChars=[],guessChars=[];
  for(var i=0;i<WORD_LEN;i++){
    guessChars.push(guess[i]);
    targetChars.push(target[i]);
    result.push({letter:guess[i],state:'gray'});
  }
  var used={};
  for(var i=0;i<WORD_LEN;i++){
    if(guessChars[i]===targetChars[i]){
      result[i].state='green';
      used[i]=true;
    }
  }
  for(var i=0;i<WORD_LEN;i++){
    if(result[i].state==='green') continue;
    for(var j=0;j<WORD_LEN;j++){
      if(!used[j]&&guessChars[i]===targetChars[j]){
        result[i].state='yellow';
        used[j]=true;
        break;
      }
    }
  }
  return result;
}

function makeConfetti(root){
  var colors=['#538D4E','#B59F3B','#22c55e','#3b82f6','#a855f7','#ec4899','#f97316'];
  for(var i=0;i<60;i++){
    var c=el('div','wd-confetti');
    c.style.left=(Math.random()*100)+'%';
    c.style.animationDelay=(Math.random()*1.2)+'s';
    c.style.animationDuration=(1.8+Math.random()*1.5)+'s';
    c.style.width=(5+Math.random()*8)+'px';
    c.style.height=(5+Math.random()*8)+'px';
    c.style.background=colors[Math.floor(Math.random()*colors.length)];
    c.style.borderRadius=Math.random()>.5?'50%':'2px';
    root.appendChild(c);
    setTimeout(function(ce){return function(){ce.remove()}}(c),3000);
  }
}

export default function activate(host){
  ensureStyles();
  var root=null,target='',guesses=[],gameOver=false,gameWon=false;
  var _fsHandler=null;
  var currentGuess='',audio=null,toastT=null,stats={played:0,won:0,streak:0,maxStreak:0,dist:{1:0,2:0,3:0,4:0,5:0,6:0}};

  host.storage.get('wordle_stats').then(function(v){if(v&&typeof v==='object'){stats=v;if(!stats.dist) stats.dist={1:0,2:0,3:0,4:0,5:0,6:0}}}).catch(function(){});

  function initA(){if(!audio) try{audio=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}
  function resA(){if(audio&&audio.state==='suspended') audio.resume()}
  function tone(f,d,t,v){if(!audio) return;resA();try{var o=audio.createOscillator(),g=audio.createGain();o.type=t||'sine';o.frequency.setValueAtTime(f,audio.currentTime);g.gain.setValueAtTime(v||.06,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+d);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+d)}catch(e){}}

  function sfxKey(){tone(440,.04,'sine',.04)}
  function sfxEnter(){tone(300,.06,'sine',.04);setTimeout(function(){tone(400,.06,'sine',.04)},40)}
  function sfxFlip(){tone(250,.08,'triangle',.03)}
  function sfxWin(){[523,659,784,1047].forEach(function(f,i){setTimeout(function(){tone(f,.2,'sine',.1)},i*120)})}
  function sfxLose(){tone(160,.3,'sawtooth',.05)}

  function toast(msg){
    var t=root.querySelector('.wd-toast');if(!t) return;
    clearTimeout(toastT);t.textContent=msg;t.classList.add('show');
    toastT=setTimeout(function(){t.classList.remove('show')},1800);
  }

  function renderBoard(){
    var board=root.querySelector('.wd-board');if(!board) return;
    board.innerHTML='';
    for(var r=0;r<MAX_GUESSES;r++){
      var row=el('div','wd-row');
      for(var c=0;c<WORD_LEN;c++){
        var tile=el('div','wd-tile');
        if(r<guesses.length){
          var g=guesses[r];tile.textContent=g[c].letter.toUpperCase();
          tile.classList.add(g[c].state);
        }else if(r===guesses.length){
          if(c<currentGuess.length){
            tile.textContent=currentGuess[c].toUpperCase();
            tile.classList.add('filled');
          }
        }
        tile.dataset.row=r;tile.dataset.col=c;
        row.appendChild(tile);
      }
      board.appendChild(row);
    }
  }

  function animateRow(rowIdx,result,callback){
    var tiles=root.querySelectorAll('.wd-tile[data-row="'+rowIdx+'"]');
    for(var i=0;i<tiles.length;i++){
      (function(tile,idx){
        setTimeout(function(){
          sfxFlip();
          tile.classList.add('flip');
          tile.dataset.flipState='mid';
          setTimeout(function(){
            tile.textContent=result[idx].letter.toUpperCase();
            tile.classList.add(result[idx].state);
            tile.classList.remove('filled');
            tile.dataset.flipState='done';
            if(idx===WORD_LEN-1&&callback) setTimeout(callback,200);
          },250);
        },idx*180);
      })(tiles[i],i);
    }
  }

  function animateWin(){
    var lastRow=guesses.length-1;
    var tiles=root.querySelectorAll('.wd-tile[data-row="'+lastRow+'"]');
    setTimeout(function(){
      for(var i=0;i<tiles.length;i++){
        (function(tile,idx){
          setTimeout(function(){tile.classList.add('bounce')},idx*80);
        })(tiles[i],i);
      }
    },400);
    makeConfetti(root);
  }

  function shakeRow(){
    var row=root.querySelector('.wd-row:nth-child('+(guesses.length+1)+')');
    if(row){
      row.classList.add('shake');
      setTimeout(function(){row.classList.remove('shake')},500);
    }
  }

  function updateKeyboard(){
    var used={};
    for(var i=0;i<guesses.length;i++){
      for(var j=0;j<WORD_LEN;j++){
        var g=guesses[i][j],prev=used[g.letter];
        if(!prev||prev==='gray'||(prev==='yellow'&&g.state==='green'))used[g.letter]=g.state;
      }
    }
    var keys=root.querySelectorAll('.wd-key');
    for(var i=0;i<keys.length;i++){
      var k=keys[i],l=k.dataset.key;
      if(l&&used[l]){
        k.classList.remove('green','yellow','gray');
        k.classList.add(used[l]);
      }
    }
  }

  function submitGuess(){
    if(currentGuess.length!==WORD_LEN) return;
    if(!isValidWord(currentGuess)){
      toast('Not in word list');
      shakeRow();
      return;
    }
    var result=checkGuess(currentGuess,target);
    guesses.push(result);
    currentGuess='';
    renderBoard();
    var rowIdx=guesses.length-1;
    animateRow(rowIdx,result,function(){
      updateKeyboard();
      if(result.every(function(r){return r.state==='green'})){
        gameWon=true;gameOver=true;
        stats.played++;stats.won++;
        stats.streak++;stats.maxStreak=Math.max(stats.maxStreak,stats.streak);
        stats.dist[guesses.length]=(stats.dist[guesses.length]||0)+1;
        saveStats();
        animateWin();
        setTimeout(function(){sfxWin();showEndModal(true)},600);
      }else if(guesses.length>=MAX_GUESSES){
        gameOver=true;
        stats.played++;stats.streak=0;
        saveStats();
        setTimeout(function(){sfxLose();showEndModal(false)},400);
      }
    });
  }

  function typeLetter(letter){
    if(gameOver) return;
    if(currentGuess.length<WORD_LEN){
      currentGuess+=letter.toLowerCase();
      sfxKey();
      renderBoard();
      var row=root.querySelector('.wd-row:nth-child('+(guesses.length+1)+')');
      if(row){
        var tiles=row.querySelectorAll('.wd-tile');
        var idx=currentGuess.length-1;
        if(tiles[idx]){tiles[idx].classList.add('pop');setTimeout(function(t){return function(){t.classList.remove('pop')}}(tiles[idx]),150)}
      }
    }
  }

  function deleteLetter(){
    if(gameOver) return;
    if(currentGuess.length>0){
      currentGuess=currentGuess.slice(0,-1);
      sfxKey();
      renderBoard();
    }
  }

  function onVirtualKey(key){
    initA();
    if(key==='enter'){sfxEnter();submitGuess()}
    else if(key==='backspace') deleteLetter();
    else typeLetter(key);
  }

  function showHelp(){
    var m=el('div','wd-help-modal'),b=el('div','wd-help-box');
    b.innerHTML=''
      +'<div class="wd-help-head"><h2 class="wd-help-title"><span style="font-size:22px">&#x1F3AE;</span> How to Play</h2><button class="wd-help-close" data-close>&times;</button></div>'
      +'<div class="wd-help-body">'
      +'<h3>Goal</h3><p>Guess the hidden 5-letter word in <b>6 tries</b> or less. Each guess must be a valid word.</p>'
      +'<h3>Color Clues</h3>'
      +'<div class="wd-example"><div class="wd-ex-tile" style="background:#538D4E;color:#fff">G</div><div class="wd-ex-tile" style="background:#B59F3B;color:#fff">R</div><div class="wd-ex-tile" style="background:#3A3A3C;color:#fff">E</div><span>Green=right spot, Yellow=wrong spot, Gray=not in word</span></div>'
      +'<h3>Controls</h3><ul><li>Type letters with your <b>keyboard</b> or tap the <b>on-screen keys</b>.</li><li><b>Enter</b> to submit, <b>Backspace</b> to delete.</li><li>Letter colors appear on the keyboard after each guess.</li></ul>'
      +'<h3>Tip</h3><p>Use green/yellow clues to narrow down possibilities. Letters can repeat!</p>'
      +'</div>';
    m.appendChild(b);
    function close(){m.remove();window.removeEventListener('keydown',kfn)}
    function kfn(e){if(e.key==='Escape') close()}
    m.addEventListener('click',function(e){if(e.target===m) close()});
    b.querySelector('[data-close]').addEventListener('click',close);
    window.addEventListener('keydown',kfn);
    root.appendChild(m);
  }

  function showEndModal(won){
    var m=el('div','wd-overlay'),winRate=stats.played>0?Math.round(stats.won/stats.played*100):0;
    var titleHtml=won?'<h2 style="color:#22c55e">You Win!</h2>':'<h2 style="color:#EF4444">Game Over</h2>';
    var subHtml='<p class="wd-m-sub">'+(won?'You got it in '+guesses.length+' '+(guesses.length===1?'try':'tries')+'!':'The word was <span class="wd-answer-reveal">'+target.toUpperCase()+'</span>')+'</p>';
    var distHtml='';
    if(Object.keys(stats.dist).length>0){
      var guessesPerLine=guesses.length;
      var maxDist=0;
      for(var k in stats.dist) if(stats.dist[k]>maxDist) maxDist=stats.dist[k];
      distHtml='<div class="wd-dist"><div class="wd-dist-title">Guess Distribution</div>';
      for(var i=1;i<=MAX_GUESSES;i++){
        var count=stats.dist[i]||0;
        var pct=maxDist>0?(count/maxDist*100):0;
        var best=(i===guessesPerLine&&won)?' best':'';
        distHtml+='<div class="wd-dist-row"><div class="wd-dist-num">'+i+'</div><div class="wd-dist-bar"><div class="wd-dist-bar-inner'+best+'" style="width:'+pct+'%"></div></div><div class="wd-dist-count">'+count+'</div></div>';
      }
      distHtml+='</div>';
    }
    m.innerHTML='<div class="wd-modal">'+titleHtml+subHtml
      +'<div class="wd-m-stats">'
      +  '<div class="wd-msi"><div class="wd-msil">Played</div><div class="wd-msiv">'+stats.played+'</div></div>'
      +  '<div class="wd-msi"><div class="wd-msil">Win %</div><div class="wd-msiv" style="color:#22c55e">'+winRate+'</div></div>'
      +  '<div class="wd-msi"><div class="wd-msil">Streak</div><div class="wd-msiv" style="color:#FBBF24">'+stats.streak+'</div></div>'
      +  '<div class="wd-msi"><div class="wd-msil">Max Streak</div><div class="wd-msiv" style="color:#F97316">'+stats.maxStreak+'</div></div>'
      +'</div>'
      +distHtml
      +'<div class="wd-mb"><button class="wd-mbtn pri" data-a="new">New Word</button></div></div>';
    root.appendChild(m);
    m.querySelector('[data-a="new"]').addEventListener('click',function(){newGame()});
  }

  function saveStats(){
    host.storage.set('wordle_stats',stats).catch(function(){});
  }

  function newGame(){
    target=pickWord();guesses=[];currentGuess='';gameOver=false;gameWon=false;
    var ov=root.querySelector('.wd-overlay');if(ov) ov.remove();
    var m=root.querySelector('.wd-help-modal');if(m) m.remove();
    var confetti=root.querySelectorAll('.wd-confetti');for(var i=0;i<confetti.length;i++) confetti[i].remove();
    var keys=root.querySelectorAll('.wd-key.green, .wd-key.yellow, .wd-key.gray');
    for(var i=0;i<keys.length;i++){keys[i].classList.remove('green','yellow','gray')}
    var rows=root.querySelectorAll('.wd-row');for(var i=0;i<rows.length;i++) rows[i].classList.remove('shake');
    renderBoard();
  }

  function onPhysicalKey(e){
    if(!root) return;
    if(e.ctrlKey||e.metaKey||e.altKey) return;
    initA();
    if(e.key==='Enter'){e.preventDefault();sfxEnter();submitGuess();return}
    if(e.key==='Backspace'){e.preventDefault();deleteLetter();return}
    if(/^[a-zA-Z]$/.test(e.key)&&e.key.length===1){
      e.preventDefault();typeLetter(e.key);
    }
  }

  var keyboardLayout=[
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['ENTER','Z','X','C','V','B','N','M','BACK']
  ];

  function buildKeyboard(kbEl){
    kbEl.innerHTML='';
    for(var r=0;r<keyboardLayout.length;r++){
      var row=el('div','wd-kb-row');
      for(var c=0;c<keyboardLayout[r].length;c++){
        var key=keyboardLayout[r][c];
        var keyEl=el('div','wd-key');
        if(key==='ENTER'){keyEl.textContent='Enter';keyEl.classList.add('wide');keyEl.dataset.key='enter'}
        else if(key==='BACK'){keyEl.textContent='\u232B';keyEl.classList.add('wide');keyEl.dataset.key='backspace'}
        else{keyEl.textContent=key;keyEl.dataset.key=key.toLowerCase()}
        keyEl.addEventListener('click',(function(k){return function(){onVirtualKey(k)}})(key.toLowerCase()));
        row.appendChild(keyEl);
      }
      kbEl.appendChild(row);
    }
  }

  return {
    mount:function(container){
      root=el('div','wd-r');container.innerHTML='';container.appendChild(root);
      root.style.position='relative';
      var _fsW=0,_fsH=0,_fsBtn=document.createElement('button');
      _fsBtn.innerHTML='⛶';_fsBtn.title='Fullscreen';
      _fsBtn.style.cssText='position:absolute;top:8px;right:8px;z-index:999;background:rgba(0,0,0,.3);border:1px solid rgba(255,255,255,.12);color:rgba(255,255,255,.35);border-radius:6px;cursor:pointer;font-size:16px;width:28px;height:28px;line-height:1;padding:0;font-family:inherit;transition:color .15s;display:flex;align-items:center;justify-content:center';
      _fsBtn.onmouseenter=function(){_fsBtn.style.color='rgba(255,255,255,.85)'};
      _fsBtn.onmouseleave=function(){_fsBtn.style.color='rgba(255,255,255,.35)'};
      _fsBtn.onclick=function(){
        var display=host.runtime&&host.runtime.display;if(!display)return;
        var request=display.toggleFullscreen();if(request&&request.catch)request.catch(function(){})
      };
      root.appendChild(_fsBtn);
      _fsHandler=function(){
        if(document.fullscreenElement&&_fsW&&_fsH){var sc=Math.min(screen.width/_fsW,screen.height/_fsH);container.style.display='flex';container.style.alignItems='center';container.style.justifyContent='center';container.style.background='#000';root.style.transform='scale('+sc+')';root.style.transformOrigin='center center';root.style.flexShrink='0';_fsBtn.innerHTML='⊡'}
        else{container.style.display='';container.style.alignItems='';container.style.justifyContent='';root.style.transform='';root.style.transformOrigin='';_fsBtn.innerHTML='⛶'}
      };
      document.addEventListener('fullscreenchange',_fsHandler);
      document.addEventListener('webkitfullscreenchange',_fsHandler);

      var bar=el('div','wd-bar');
      bar.innerHTML='<div class="wd-title-block"><h1 class="wd-title">Word Guess</h1><div class="wd-sub">6 tries to find the word</div></div>'
        +'<button class="wd-help" title="How to play" aria-label="Help">?</button>';
      root.appendChild(bar);

      var bw=el('div','wd-board-wrap');
      var board=el('div','wd-board');
      bw.appendChild(board);root.appendChild(bw);

      var kb=el('div','wd-kb');
      buildKeyboard(kb);root.appendChild(kb);

      root.appendChild(el('div','wd-toast'));

      bar.querySelector('.wd-help').addEventListener('click',showHelp);
      window.addEventListener('keydown',onPhysicalKey);

      newGame();
    },
    unmount:function(){
      if(_fsHandler){document.removeEventListener('fullscreenchange',_fsHandler);document.removeEventListener('webkitfullscreenchange',_fsHandler);_fsHandler=null}
      window.removeEventListener('keydown',onPhysicalKey);
    }
  };
}
