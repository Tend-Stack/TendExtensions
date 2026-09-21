var STYLE_ID = 'tend-ext-sudoku-styles';

var DIFFICULTIES = [
  { key: 'easy', label: 'Easy', given: 40 },
  { key: 'medium', label: 'Medium', given: 32 },
  { key: 'hard', label: 'Hard', given: 28 },
  { key: 'expert', label: 'Expert', given: 24 }
];

function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return;
  var s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = [
    '@keyframes sdShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-3px)}40%{transform:translateX(3px)}60%{transform:translateX(-2px)}80%{transform:translateX(2px)}}',
    '@keyframes sdPop{0%{transform:scale(1)}30%{transform:scale(1.25)}100%{transform:scale(1)}}',
    '@keyframes sdFade{from{opacity:0}to{opacity:1}}',
    '@keyframes sdModalPop{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}',
    '@keyframes sdWin{0%{opacity:0;transform:scale(.8)}60%{opacity:1;transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}',
    '.sd-r{width:100%;height:100%;display:flex;flex-direction:column;overflow:hidden;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;user-select:none;-webkit-user-select:none;background:linear-gradient(180deg,#0B0E1A 0%,#0a0d1a 50%,#0d0f1f 100%);color:#E2E8F0;position:relative}',
    '.sd-top{flex-shrink:0;padding:10px 12px 6px;display:flex;align-items:center;gap:10px}',
    '.sd-diff{display:flex;gap:4px;flex:1}',
    '.sd-dp{padding:5px 10px;border-radius:20px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03);color:#94A3B8;font-size:10px;font-weight:700;cursor:pointer;font-family:inherit;text-transform:uppercase;letter-spacing:.6px;transition:all .15s;white-space:nowrap}',
    '.sd-dp:hover{background:rgba(255,255,255,.08);color:#E2E8F0}',
    '.sd-dp.active{border-color:#A855F7;background:linear-gradient(135deg,rgba(168,85,247,.2),rgba(236,72,153,.1));color:#C084FC}',
    '.sd-info{display:flex;align-items:center;gap:8px;flex-shrink:0}',
    '.sd-it{font-size:11px;font-variant-numeric:tabular-nums;color:#94A3B8;font-weight:600}',
    '.sd-it.err{color:#EF4444}',
    '.sd-help{width:28px;height:28px;border-radius:8px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:#94A3B8;cursor:pointer;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:13px;transition:all .15s;font-family:inherit;flex-shrink:0}',
    '.sd-help:hover{background:rgba(255,255,255,.1);color:#fff;transform:translateY(-1px)}',
    '.sd-board-w{flex:1;display:flex;align-items:center;justify-content:center;padding:6px 12px;min-height:0}',
    '.sd-board{display:grid;grid-template-columns:repeat(9,1fr);grid-template-rows:repeat(9,1fr);aspect-ratio:1;width:100%;max-height:100%;border:2px solid rgba(255,255,255,.15);border-radius:8px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,.5)}',
    '.sd-cell{display:flex;align-items:center;justify-content:center;font-weight:700;cursor:pointer;transition:background .15s,box-shadow .15s;position:relative;font-variant-numeric:tabular-nums;font-size:15px;border-right:1px solid rgba(255,255,255,.06);border-bottom:1px solid rgba(255,255,255,.06)}',
    '.sd-cell:nth-child(9n){border-right:none}',
    '.sd-cell:nth-child(n+73){border-bottom:none}',
    '.sd-cell:nth-child(3n){border-right:2px solid rgba(255,255,255,.2)}',
    '.sd-cell:nth-child(9n){border-right:none}',
    '.sd-cell:nth-child(n+19):nth-child(-n+27),.sd-cell:nth-child(n+46):nth-child(-n+54){border-bottom:2px solid rgba(255,255,255,.2)}',
    '.sd-cell.given{color:#64748B}',
    '.sd-cell.user{color:#E2E8F0}',
    '.sd-cell.wrong{color:#EF4444;animation:sdShake .4s ease}',
    '.sd-cell.selected{background:rgba(99,102,241,.25)!important;box-shadow:inset 0 0 0 2px rgba(99,102,241,.8);z-index:1}',
    '.sd-cell.same-num{background:rgba(59,130,246,.15)}',
    '.sd-cell.hl-zone{background:rgba(148,163,184,.06)}',
    '.sd-cell.conflict{color:#EF4444;box-shadow:inset 0 0 0 2px rgba(239,68,68,.8),0 0 8px rgba(239,68,68,.3)}',
    '.sd-cell.conflict::after{content:"";position:absolute;inset:0;background:rgba(239,68,68,.1);pointer-events:none}',
    '.sd-cell .sd-pc{display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(3,1fr);width:100%;height:100%;padding:1px}',
    '.sd-cell .sd-pm{font-size:7px;font-weight:500;color:#64748B;text-align:center;line-height:1;display:flex;align-items:center;justify-content:center}',
    '.sd-pad{flex-shrink:0;display:flex;gap:5px;padding:0 12px;justify-content:center}',
    '.sd-nbtn{flex:1;max-width:38px;aspect-ratio:1;border-radius:9px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);color:#E2E8F0;font-weight:700;font-size:15px;cursor:pointer;font-family:inherit;transition:all .12s;display:flex;align-items:center;justify-content:center}',
    '.sd-nbtn:hover{background:rgba(255,255,255,.1);transform:translateY(-1px);border-color:rgba(255,255,255,.2);box-shadow:0 0 10px rgba(168,85,247,.3)}',
    '.sd-nbtn:active{transform:scale(.95)}',
    '.sd-ctrls{flex-shrink:0;display:flex;gap:5px;padding:6px 12px 10px}',
    '.sd-cb{flex:1;padding:8px 10px;border-radius:10px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.03);color:#94A3B8;font-weight:700;font-size:10px;cursor:pointer;font-family:inherit;text-transform:uppercase;letter-spacing:.5px;transition:all .15s;display:flex;align-items:center;justify-content:center;gap:3px}',
    '.sd-cb:hover{background:rgba(255,255,255,.08);color:#E2E8F0}',
    '.sd-cb.active{border-color:#A855F7;background:rgba(168,85,247,.15);color:#C084FC}',
    '.sd-cb.pri{border-color:#A855F7;color:#fff;background:linear-gradient(135deg,rgba(168,85,247,.2),rgba(236,72,153,.15))}',
    '.sd-overlay{position:absolute;inset:0;background:rgba(0,0,0,.75);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;z-index:50;padding:14px;animation:sdFade .2s ease}',
    '.sd-modal{background:linear-gradient(180deg,#1A1F35,#15192a);border:1px solid rgba(255,255,255,.1);border-radius:18px;padding:22px 20px;text-align:center;max-width:310px;width:100%;animation:sdModalPop .35s ease;box-shadow:0 24px 60px rgba(0,0,0,.7)}',
    '.sd-modal.win-modal{animation:sdWin .45s ease}',
    '.sd-modal h2{font-size:26px;font-weight:900;margin:0 0 4px}',
    '.sd-m-sub{color:#94A3B8;font-size:12px;margin:0 0 12px}',
    '.sd-m-stats{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:8px 0 14px}',
    '.sd-msi{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:8px}',
    '.sd-msil{font-size:9px;color:#94A3B8;font-weight:600;text-transform:uppercase;letter-spacing:1px}',
    '.sd-msiv{font-size:17px;font-weight:900;color:#fff;margin-top:2px}',
    '.sd-mb{display:flex;gap:8px;justify-content:center}',
    '.sd-mbtn{padding:9px 20px;border-radius:10px;border:none;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;transition:transform .15s}',
    '.sd-mbtn:hover{transform:translateY(-1px)}',
    '.sd-mbtn.pri{background:linear-gradient(135deg,#A855F7,#EC4899);color:#fff;box-shadow:0 4px 18px rgba(168,85,247,.35)}',
    '.sd-mbtn.sec{background:rgba(255,255,255,.06);color:#E2E8F0;border:1px solid rgba(255,255,255,.1)}',
    '.sd-hm{position:absolute;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;z-index:50;padding:14px;animation:sdFade .2s ease}',
    '.sd-hb{background:linear-gradient(180deg,#1A1F35,#15192a);border:1px solid rgba(255,255,255,.1);border-radius:18px;padding:20px;max-width:340px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.6);animation:sdModalPop .3s ease}',
    '.sd-hh{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}',
    '.sd-ht{font-size:18px;font-weight:800;color:#fff;margin:0;display:flex;align-items:center;gap:8px}',
    '.sd-hc{width:28px;height:28px;border-radius:8px;border:none;background:rgba(255,255,255,.06);color:#94A3B8;cursor:pointer;font-size:18px;line-height:1;font-family:inherit;transition:all .15s}',
    '.sd-hc:hover{background:rgba(255,255,255,.12);color:#fff}',
    '.sd-hbody{font-size:13px;line-height:1.55;color:#CBD5E1}',
    '.sd-hbody h3{font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#94A3B8;margin:14px 0 6px;font-weight:700}',
    '.sd-hbody h3:first-child{margin-top:0}',
    '.sd-hbody ul{margin:0;padding-left:18px}',
    '.sd-hbody li{margin:3px 0}'
  ].join('');
  document.head.appendChild(s);
}

function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; }

function generateSolved() {
  var board = [];
  for (var r = 0; r < 9; r++) { board[r] = []; for (var c = 0; c < 9; c++) board[r][c] = 0; }

  function isValid(brd, r, c, n) {
    for (var x = 0; x < 9; x++) { if (brd[r][x] === n || brd[x][c] === n) return false; }
    var br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3;
    for (var rr = br; rr < br + 3; rr++) for (var cc = bc; cc < bc + 3; cc++) if (brd[rr][cc] === n) return false;
    return true;
  }

  function fill(brd) {
    for (var r = 0; r < 9; r++) for (var c = 0; c < 9; c++) {
      if (brd[r][c] === 0) {
        var nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        for (var i = nums.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = nums[i]; nums[i] = nums[j]; nums[j] = t; }
        for (var i = 0; i < 9; i++) { var n = nums[i]; if (isValid(brd, r, c, n)) { brd[r][c] = n; if (fill(brd)) return true; brd[r][c] = 0; } }
        return false;
      }
    }
    return true;
  }
  fill(board);
  return board;
}

function generatePuzzle(difficulty) {
  var solved = generateSolved();
  var puzzle = [];
  for (var r = 0; r < 9; r++) { puzzle[r] = []; for (var c = 0; c < 9; c++) puzzle[r][c] = solved[r][c]; }

  var positions = [];
  for (var r = 0; r < 9; r++) for (var c = 0; c < 9; c++) positions.push({ r: r, c: c, v: puzzle[r][c] });
  for (var i = positions.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = positions[i]; positions[i] = positions[j]; positions[j] = t; }

  var toRemove = 81 - DIFFICULTIES.find(function (d) { return d.key === difficulty; }).given;
  var removed = 0;
  for (var i = 0; i < positions.length && removed < toRemove; i++) {
    var pos = positions[i];
    puzzle[pos.r][pos.c] = 0;
    removed++;
  }
  return { puzzle: puzzle, solution: solved };
}

function formatTime(sec) {
  var m = Math.floor(sec / 60), s = sec % 60;
  return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
}

export default function activate(host) {
  ensureStyles();
  var root = null, difficulty = 'medium', puzzle = [], solution = [], userGrid = [], pencilMarks = [];
  var _fsHandler = null;
  var selection = null, errors = 0, seconds = 0, timer = null, timerStarted = false, complete = false;
  var bestTimes = {}, audio = null, pencilToggle = false;
  var undoStack = [], undoIdx = -1;
  var keyHandler = null;

  function initBoard() {
    for (var r = 0; r < 9; r++) {
      userGrid[r] = [];
      pencilMarks[r] = [];
      for (var c = 0; c < 9; c++) { userGrid[r][c] = 0; pencilMarks[r][c] = {}; }
    }
  }

  function initA() { if (!audio) try { audio = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} }
  function resA() { if (audio && audio.state === 'suspended') audio.resume(); }
  function tone(f, d, t, v) { if (!audio) return; resA(); var o = audio.createOscillator(), g = audio.createGain(); o.type = t || 'sine'; o.frequency.setValueAtTime(f, audio.currentTime); g.gain.setValueAtTime(v || .08, audio.currentTime); g.gain.exponentialRampToValueAtTime(.001, audio.currentTime + d); o.connect(g); g.connect(audio.destination); o.start(); o.stop(audio.currentTime + d); }
  function sfxCell() { tone(520, .06, 'sine', .06); }
  function sfxError() { tone(160, .2, 'sawtooth', .06); }
  function sfxErase() { tone(350, .05, 'sine', .04); }
  function sfxWin() { [523, 659, 784, 1047].forEach(function (f, i) { setTimeout(function () { tone(f, .2, 'sine', .1); }, i * 100); }); }

  function pushUndo(r, c, prevVal, prevMarks) {
    if (undoIdx < undoStack.length - 1) undoStack.length = undoIdx + 1;
    undoStack.push({ r: r, c: c, prevVal: prevVal, prevMarks: prevMarks ? JSON.parse(JSON.stringify(prevMarks)) : {} });
    undoIdx = undoStack.length - 1;
  }

  function undo() {
    while (undoIdx >= 0) {
      var act = undoStack[undoIdx];
      if (act.r !== undefined) {
        userGrid[act.r][act.c] = act.prevVal;
        pencilMarks[act.r][act.c] = act.prevMarks;
        undoIdx--;
        renderAll();
        return true;
      }
      undoIdx--;
    }
    return false;
  }

  function redo() {
    if (undoIdx < undoStack.length - 1) {
      undoIdx++;
      var act = undoStack[undoIdx];
      if (act.r !== undefined) {
        userGrid[act.r][act.c] = act.prevVal;
        pencilMarks[act.r][act.c] = act.prevMarks;
        renderAll();
        return true;
      }
    }
    return false;
  }

  function startTimer() {
    if (timerStarted || timer) return;
    timerStarted = true;
    timer = setInterval(function () { seconds++; var e = root.querySelector('#sd-time'); if (e) e.textContent = formatTime(seconds); }, 1000);
  }

  function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }

  function setCell(r, c, val) {
    if (puzzle[r][c] !== 0) return false;
    if (userGrid[r][c] === val) return false;
    var prevVal = userGrid[r][c], prevMarks = {};
    for (var k in pencilMarks[r][c]) prevMarks[k] = true;
    pushUndo(r, c, prevVal, prevMarks);
    userGrid[r][c] = val;
    pencilMarks[r][c] = {};
    if (val !== 0) startTimer();
    if (val === 0 || val === solution[r][c]) { sfxCell(); }
    else { errors++; sfxError(); }
    if (val !== 0 && checkComplete()) showWin();
    renderAll();
    return true;
  }

  function togglePencilMark(r, c, n) {
    if (puzzle[r][c] !== 0 || userGrid[r][c] !== 0) return;
    if (pencilMarks[r][c][n]) delete pencilMarks[r][c][n];
    else pencilMarks[r][c][n] = true;
    renderAll();
  }

  function eraseCell(r, c) {
    if (puzzle[r][c] !== 0 || userGrid[r][c] === 0 && Object.keys(pencilMarks[r][c]).length === 0) return;
    var prevVal = userGrid[r][c], prevMarks = {};
    for (var k in pencilMarks[r][c]) prevMarks[k] = true;
    pushUndo(r, c, prevVal, prevMarks);
    userGrid[r][c] = 0;
    pencilMarks[r][c] = {};
    sfxErase();
    renderAll();
  }

  function findConflicts() {
    var conflicts = {};
    for (var r = 0; r < 9; r++) for (var c = 0; c < 9; c++) {
      var v = userGrid[r][c] || puzzle[r][c];
      if (!v) continue;
      for (var cc = 0; cc < 9; cc++) if (cc !== c && (userGrid[r][cc] || puzzle[r][cc]) === v) { conflicts[r + ',' + c] = true; conflicts[r + ',' + cc] = true; }
      for (var rr = 0; rr < 9; rr++) if (rr !== r && (userGrid[rr][c] || puzzle[rr][c]) === v) { conflicts[r + ',' + c] = true; conflicts[rr + ',' + c] = true; }
      var br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3;
      for (var rr = br; rr < br + 3; rr++) for (var cc = bc; cc < bc + 3; cc++) if ((rr !== r || cc !== c) && (userGrid[rr][cc] || puzzle[rr][cc]) === v) { conflicts[r + ',' + c] = true; conflicts[rr + ',' + cc] = true; }
    }
    return conflicts;
  }

  function checkComplete() {
    for (var r = 0; r < 9; r++) for (var c = 0; c < 9; c++) { var v = userGrid[r][c] || puzzle[r][c]; if (!v || v !== solution[r][c]) return false; }
    return true;
  }

  function renderAll() {
    var boardEl = root.querySelector('.sd-board');
    if (!boardEl) return;
    var conflicts = findConflicts(), selectedNum = selection ? (userGrid[selection.r][selection.c] || puzzle[selection.r][selection.c]) : 0;
    boardEl.querySelectorAll('.sd-cell').forEach(function (cell, i) {
      var r = Math.floor(i / 9), c = i % 9;
      var giv = puzzle[r][c] !== 0, ug = userGrid[r][c];
      cell.className = 'sd-cell';
      cell.style.fontSize = '';
      if (giv) cell.classList.add('given');
      else if (ug && ug !== solution[r][c]) cell.classList.add('wrong');
      else if (ug) cell.classList.add('user');
      if (conflicts[r + ',' + c]) cell.classList.add('conflict');
      if (selection && selection.r === r && selection.c === c) cell.classList.add('selected');
      else if (selection && (selection.r === r || selection.c === c || (Math.floor(selection.r / 3) === Math.floor(r / 3) && Math.floor(selection.c / 3) === Math.floor(c / 3)))) cell.classList.add('hl-zone');
      if (selectedNum && !(selection && selection.r === r && selection.c === c) && (userGrid[r][c] || puzzle[r][c]) === selectedNum) cell.classList.add('same-num');
      cell.innerHTML = '';
      if (giv) { cell.textContent = puzzle[r][c]; }
      else if (ug) { cell.textContent = ug; }
      else if (Object.keys(pencilMarks[r][c]).length > 0) {
        var pc = document.createElement('div');
        pc.className = 'sd-pc';
        for (var n = 1; n <= 9; n++) { var pm = document.createElement('span'); pm.className = 'sd-pm'; if (pencilMarks[r][c][n]) pm.textContent = n; pc.appendChild(pm); }
        cell.appendChild(pc);
      }
    });
    updateInfo();
  }

  function updateInfo() {
    var errEl = root.querySelector('#sd-errs');
    if (errEl) errEl.textContent = errors;
    var timeEl = root.querySelector('#sd-time');
    if (timeEl) timeEl.textContent = formatTime(seconds);
  }

  function newGame(diff) {
    stopTimer();
    if (diff) difficulty = diff;
    var res = generatePuzzle(difficulty);
    puzzle = res.puzzle;
    solution = res.solution;
    initBoard();
    selection = null;
    errors = 0;
    seconds = 0;
    timerStarted = false;
    complete = false;
    undoStack = [];
    undoIdx = -1;
    updateInfo();
    var tEl = root.querySelector('#sd-time');
    if (tEl) tEl.textContent = formatTime(seconds);
    var eEl = root.querySelector('#sd-errs');
    if (eEl) eEl.textContent = '0';
    var dps = root.querySelectorAll('.sd-dp');
    dps.forEach(function (dp) { dp.classList.toggle('active', dp.dataset.diff === difficulty); });
    var ov = root.querySelector('.sd-overlay');
    if (ov) ov.remove();
    renderAll();
  }

  function showWin() {
    complete = true;
    stopTimer();
    sfxWin();
    var diffLabel = DIFFICULTIES.find(function (d) { return d.key === difficulty; }).label;
    var prev = bestTimes[difficulty] || Infinity;
    var isBest = seconds < prev;
    if (isBest) { bestTimes[difficulty] = seconds; host.storage.set('sudoku_best', bestTimes).catch(function () { }); }
    var bestTime = Math.min(seconds, prev);

    var m = el('div', 'sd-overlay');
    m.innerHTML = '<div class="sd-modal win-modal">'
      + '<h2 style="background:linear-gradient(135deg,#FBBF24,#F97316);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">' + (isBest ? 'Best Time!' : 'Puzzle Solved!') + '</h2>'
      + '<p class="sd-m-sub">' + diffLabel + ' difficulty</p>'
      + '<div class="sd-m-stats">'
      + '<div class="sd-msi"><div class="sd-msil">Time</div><div class="sd-msiv" style="color:#FBBF24">' + formatTime(seconds) + '</div></div>'
      + '<div class="sd-msi"><div class="sd-msil">Best</div><div class="sd-msiv" style="color:#A855F7">' + formatTime(bestTime) + '</div></div>'
      + '<div class="sd-msi"><div class="sd-msil">Errors</div><div class="sd-msiv" style="color:' + (errors ? '#EF4444' : '#FBBF24') + '">' + errors + '</div></div>'
      + '<div class="sd-msi"><div class="sd-msil">Difficulty</div><div class="sd-msiv" style="color:#C084FC">' + diffLabel + '</div></div>'
      + '</div><div class="sd-mb"><button class="sd-mbtn sec" data-a="close">Close</button><button class="sd-mbtn pri" data-a="new">New Game</button></div></div>';
    root.appendChild(m);
    m.querySelector('[data-a="close"]').addEventListener('click', function () { m.remove(); });
    m.querySelector('[data-a="new"]').addEventListener('click', function () { newGame(); });
  }

  function showHelp() {
    var m = el('div', 'sd-hm');
    m.innerHTML = '<div class="sd-hb">'
      + '<div class="sd-hh"><h2 class="sd-ht"><span>' + String.fromCharCode(10067) + '</span>How to Play</h2><button class="sd-hc" data-close>&times;</button></div>'
      + '<div class="sd-hbody">'
      + '<h3>Rules</h3><p>Fill every row, column, and <b>3' + String.fromCharCode(215) + '3 box</b> with digits 1-9. No repeats allowed.</p>'
      + '<h3>Controls</h3><ul>'
      + '<li><b>Click</b> a cell to select it, then press <b>1-9</b> or click the number pad.</li>'
      + '<li><b>Arrow keys</b> move the selection.</li>'
      + '<li><b>Backspace/Delete</b> or click the Erase button clears a cell.</li>'
      + '<li>Toggle <b>Pencil Marks</b> to add small candidate numbers. Press Shift+Number or use the number pad with pencil mode on.</li>'
      + '<li><b>Ctrl+Z</b> undo, <b>Ctrl+Y</b> redo.</li></ul>'
      + '<h3>Tips</h3><p>Pre-filled cells (gray) cannot be changed. Wrong entries show in <span style="color:#EF4444">red</span> with a shake. Conflicts with the same number in row, column, or box are highlighted.</p>'
      + '</div></div>';
    m.querySelector('[data-close]').addEventListener('click', function () { m.remove(); });
    m.addEventListener('click', function (e) { if (e.target === m) m.remove(); });
    function kfn(e) { if (e.key === 'Escape') { m.remove(); window.removeEventListener('keydown', kfn); } }
    window.addEventListener('keydown', kfn);
    root.appendChild(m);
  }

  function setupBoardListeners(boardEl) {
    boardEl.addEventListener('click', function (e) {
      var cell = e.target.closest('.sd-cell');
      if (!cell) return;
      var r = parseInt(cell.dataset.r), c = parseInt(cell.dataset.c);
      if (r !== selection.r || c !== selection.c) selection = { r: r, c: c };
      else selection = null;
      renderAll();
    });
  }

  function setSelectedCell(r, c) {
    if (r < 0 || r > 8 || c < 0 || c > 8) return;
    selection = { r: r, c: c };
    if (puzzle[r][c] !== 0) selection = null;
    renderAll();
  }

  function moveSelection(dr, dc) {
    if (!selection) {
      if (dr > 0 || dc > 0) { for (var r = 0; r < 9; r++) for (var c = 0; c < 9; c++) if (puzzle[r][c] === 0) { setSelectedCell(r, c); return; } }
      else { for (var r = 8; r >= 0; r--) for (var c = 8; c >= 0; c--) if (puzzle[r][c] === 0) { setSelectedCell(r, c); return; } }
      return;
    }
    var r = selection.r, c = selection.c;
    do {
      r += dr; c += dc;
      if (r < 0) r = 8; if (r > 8) r = 0; if (c < 0) c = 8; if (c > 8) c = 0;
      if (puzzle[r][c] === 0) { setSelectedCell(r, c); return; }
    } while (r !== selection.r || c !== selection.c);
  }

  return {
    mount: function (container) {
      root = el('div', 'sd-r');
      container.innerHTML = '';
      container.appendChild(root);
      root.style.position = 'relative';
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

      var top = el('div', 'sd-top');
      var diff = el('div', 'sd-diff');
      DIFFICULTIES.forEach(function (d) {
        var dp = el('button', 'sd-dp ' + (d.key === difficulty ? 'active' : ''), d.label);
        dp.dataset.diff = d.key;
        dp.addEventListener('click', function () { newGame(this.dataset.diff); });
        diff.appendChild(dp);
      });
      top.appendChild(diff);
      var info = el('div', 'sd-info');
      info.innerHTML = '<span class="sd-it" style="color:#FBBF24">' + String.fromCharCode(9200) + '</span><span class="sd-it" id="sd-time">00:00</span>'
        + '<span class="sd-it err" style="margin-left:6px">' + String.fromCharCode(10060) + '</span><span class="sd-it err" id="sd-errs">0</span>';
      top.appendChild(info);
      var helpBtn = el('button', 'sd-help', '?');
      helpBtn.addEventListener('click', showHelp);
      top.appendChild(helpBtn);
      root.appendChild(top);

      var bw = el('div', 'sd-board-w');
      var board = el('div', 'sd-board');
      for (var i = 0; i < 81; i++) { var cell = el('div', 'sd-cell'); cell.dataset.r = Math.floor(i / 9); cell.dataset.c = i % 9; board.appendChild(cell); }
      setupBoardListeners(board);
      bw.appendChild(board);
      root.appendChild(bw);

      var pad = el('div', 'sd-pad');
      for (var n = 1; n <= 9; n++) {
        (function (num) {
          var btn = el('button', 'sd-nbtn', '' + num);
          btn.addEventListener('click', function () {
            if (!selection) return;
            initA();
            if (pencilToggle) togglePencilMark(selection.r, selection.c, num);
            else setCell(selection.r, selection.c, num);
          });
          pad.appendChild(btn);
        })(n);
      }
      root.appendChild(pad);

      var ctrls = el('div', 'sd-ctrls');
      pencilToggle = false;
      var pencilBtn = el('button', 'sd-cb', String.fromCharCode(9998) + ' Pencil');
      pencilBtn.addEventListener('click', function () {
        pencilToggle = !pencilToggle;
        pencilBtn.classList.toggle('active', pencilToggle);
      });
      ctrls.appendChild(pencilBtn);
      var eraseBtn = el('button', 'sd-cb', String.fromCharCode(10006) + ' Erase');
      eraseBtn.addEventListener('click', function () { if (selection) { initA(); eraseCell(selection.r, selection.c); } });
      ctrls.appendChild(eraseBtn);
      var undoBtn = el('button', 'sd-cb', String.fromCharCode(8630) + ' Undo');
      undoBtn.addEventListener('click', undo);
      ctrls.appendChild(undoBtn);
      var newBtn = el('button', 'sd-cb pri', '+ New');
      newBtn.addEventListener('click', function () { newGame(); });
      ctrls.appendChild(newBtn);
      root.appendChild(ctrls);

      keyHandler = function (e) {
        if (e.ctrlKey && e.key === 'z') { e.preventDefault(); undo(); return; }
        if (e.ctrlKey && e.key === 'y') { e.preventDefault(); redo(); return; }
        if (e.key === 'Backspace' || e.key === 'Delete') { if (selection) { e.preventDefault(); initA(); eraseCell(selection.r, selection.c); } return; }
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          e.preventDefault();
          var dr = e.key === 'ArrowUp' ? -1 : e.key === 'ArrowDown' ? 1 : 0;
          var dc = e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowRight' ? 1 : 0;
          moveSelection(dr, dc);
          return;
        }
        if (e.key >= '1' && e.key <= '9') {
          if (complete) return;
          if (!selection) return;
          e.preventDefault();
          initA();
          var num = parseInt(e.key);
          if (e.shiftKey) togglePencilMark(selection.r, selection.c, num);
          else setCell(selection.r, selection.c, num);
        }
        if (e.key === 'Escape') { selection = null; renderAll(); }
      };
      document.addEventListener('keydown', keyHandler);

      host.storage.get('sudoku_best').then(function (v) { if (v && typeof v === 'object') bestTimes = v; }).catch(function () { });

      newGame();
    },
    unmount: function () {
      if(_fsHandler){document.removeEventListener('fullscreenchange',_fsHandler);document.removeEventListener('webkitfullscreenchange',_fsHandler);_fsHandler=null}
      if (keyHandler) document.removeEventListener('keydown', keyHandler); stopTimer();
    }
  };
}
