import { createArcade, requestAnimationFrame, cancelAnimationFrame } from './arcade-kit.js';

const STYLE_ID = 'tend-ext-peggle-odyssey-v3';
const BALL_R = 5;
const PEG_R = 7;
const GRAVITY = 0.24;
const SHOOTER_Y = 54;
const BASE_BUCKET_W = 78;
const BUCKET_H = 13;
const BASE_BUCKET_SPEED = 1.8;
const MAX_COLS = 9;
const ROWS = 14;
const PEG_DX = 38;
const PEG_DY = 30;
const DEFAULT_BALLS = 10;
const CAMPAIGN_LEVELS = 45;

const WORLDS = [
  { name: 'Aurora Atrium', accent: '#60A5FA', accent2: '#8B5CF6', bg1: '#071223', bg2: '#0B1530' },
  { name: 'Solar Garden', accent: '#F59E0B', accent2: '#F97316', bg1: '#16101f', bg2: '#291724' },
  { name: 'Crystal Tides', accent: '#22D3EE', accent2: '#3B82F6', bg1: '#08182b', bg2: '#0b2334' },
  { name: 'Obsidian Echo', accent: '#A78BFA', accent2: '#EC4899', bg1: '#130d21', bg2: '#1b1230' },
  { name: 'Verdant Circuit', accent: '#34D399', accent2: '#22C55E', bg1: '#091a17', bg2: '#102b24' }
];

const PATTERNS = [
  ['....BB...', '...BOOB..', '..BBBBBB.', '.BBOPOOB.', 'BBBBGBBBB', 'BBOBBOBBO', 'BBBBBBBBB', 'BOBOOOBOB', 'BBBBPBBBB', '.BBBBBBB.', '..BOOOOB.', '..BBBBBB.', '...BPPB..', '....BB...'],
  ['...B.B...', '..BBBBB..', '.BOPGPB..', 'BBBBBBBB.', 'BOBOOOBOB', 'BBBBBBBBB', 'BBPBBBGBB', 'BOOOPOOOB', 'BBBBBBBBB', 'BBGBBBBPP', '.BOOOOOB.', '..BBBBBB.', '...BOOB..', '....BB...'],
  ['....BB...', '..BOOO.B.', '.BBBBBBBB', 'BOPBBBPOB', 'BBBBBBBBB', 'BBOBGBBOB', 'BBBBBBBBB', 'BOOOBBOOB', 'BBBBBBBBB', 'BOBBPBBBO', 'BBBBBBBBB', '.BBBBBBB.', '..BOOOOB.', '....BB...'],
  ['...BBB...', '..BOOOB..', '.BBBBBBB.', 'BOBPBPGOB', 'BBBBBBBBB', 'BBOOOOOBB', 'BBBBBBBBB', 'BBPBBBBPB', 'BOBOGBOBO', 'BBBBBBBBB', '.BOOOOOB.', '..BBBBB..', '...B.B...', '....B....'],
  ['....BB...', '...BBBB..', '..BPOOPB.', '.BBBBBBBB', 'BBOOOOGOB', 'BBBBBBBBB', 'BBPBBBBPB', 'BOOOBBOOB', 'BBBBBBBBB', 'BBGBBBBGB', '.BPOOOOP.', '..BBBBBB.', '...BOOB..', '....BB...'],
  ['....BB...', '..BBBBB..', '.BOOOOOB.', 'BBBBBBBBB', 'BOPBBBBPB', 'BBBBGBBBB', 'BOBBOBBOB', 'BBOOOOOBB', 'BBBBBBBBB', 'BPBBBBBBP', '.BBBBBBB.', '..BOOOOB.', '...BBBB..', '....BB...']
];

function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = [
    '@keyframes pgFadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}',
    '@keyframes pgPulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.03);opacity:.88}}',
    '@keyframes pgFloat{0%{opacity:0;transform:translateY(0)}10%{opacity:1}100%{opacity:0;transform:translateY(-28px)}}',
    '.pg-root{width:100%;height:100%;display:flex;flex-direction:column;overflow:hidden;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;background:radial-gradient(circle at 20% 0%,rgba(96,165,250,.12),transparent 35%),linear-gradient(180deg,#07101e 0%,#081120 50%,#090f1a 100%);color:#E5EDF7;position:relative;user-select:none;-webkit-user-select:none}',
    '.pg-top{padding:10px 12px 8px;border-bottom:1px solid rgba(255,255,255,.06);background:linear-gradient(180deg,rgba(8,13,27,.96),rgba(8,13,27,.82));backdrop-filter:blur(8px);position:relative;z-index:3}',
    '.pg-head{display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:12px;align-items:center}',
    '.pg-stage{display:flex;align-items:center;gap:10px;min-width:0}',
    '.pg-stage-back,.pg-iconbtn{width:44px;height:44px;border-radius:14px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.05);color:#E5EDF7;display:grid;place-items:center;font-size:22px;cursor:pointer;transition:transform .12s ease,background .12s ease,border-color .12s ease;flex-shrink:0}',
    '.pg-stage-back:hover,.pg-iconbtn:hover{background:rgba(255,255,255,.09);border-color:rgba(255,255,255,.16)}',
    '.pg-stage-copy{min-width:0}',
    '.pg-stage-copy b{display:block;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.pg-stage-copy small{display:block;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#8EA1C1;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px}',
    '.pg-stats{display:flex;gap:8px;align-items:stretch;flex-wrap:nowrap}',
    '.pg-stat{min-width:82px;padding:6px 10px;border-radius:12px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.07);text-align:center}',
    '.pg-stat small{display:block;font-size:9px;letter-spacing:1.6px;text-transform:uppercase;color:#8090AC;font-weight:800}',
    '.pg-stat b{display:block;font-size:20px;font-weight:900;margin-top:2px;font-variant-numeric:tabular-nums}',
    '.pg-stat.score b{color:#FBBF24}.pg-stat.balls b{color:#60A5FA}.pg-stat.left b{color:#F97316}.pg-stat.fever b{color:#A78BFA}',
    '.pg-actions{display:flex;gap:8px}',
    '.pg-progress{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:10px;margin-top:10px}',
    '.pg-card{padding:8px 10px;border-radius:14px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.075);min-width:0}',
    '.pg-cardhead{display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:11px;font-weight:800;color:#E5EDF7}',
    '.pg-cardhead span:last-child{color:#B6C2D8;font-variant-numeric:tabular-nums}',
    '.pg-meter{position:relative;height:10px;border-radius:999px;background:rgba(255,255,255,.08);overflow:hidden;margin-top:6px}',
    '.pg-fill{position:absolute;left:0;top:0;bottom:0;border-radius:999px;background:linear-gradient(90deg,#22D3EE,#60A5FA,#8B5CF6)}',
    '.pg-stagefill{background:linear-gradient(90deg,#f59e0b,#f97316)}',
    '.pg-canvas-wrap{flex:1;min-height:0;position:relative;padding:12px;display:flex;flex-direction:column;gap:10px}',
    '.pg-play{flex:1;min-height:0;position:relative;border-radius:26px;border:1px solid rgba(255,255,255,.08);background:linear-gradient(180deg,rgba(8,18,44,.96),rgba(7,16,38,.98));overflow:hidden;box-shadow:inset 0 1px 0 rgba(255,255,255,.03)}',
    '.pg-canvas{display:block;width:100%;height:100%}',
    '.pg-bottom{display:grid;grid-template-columns:minmax(0,1fr) repeat(3,minmax(110px,1fr));gap:10px}',
    '.pg-bottom .pg-card{padding:10px 12px}',
    '.pg-tool{display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;min-height:68px}',
    '.pg-tool b{font-size:18px;color:#E5EDF7}.pg-tool small{font-size:11px;color:#7F8CA8;font-weight:600;margin-top:2px}',
    '.pg-tool.lock{opacity:.52}',
    '.pg-float{position:absolute;pointer-events:none;font-size:14px;font-weight:900;animation:pgFloat .9s ease-out forwards;text-shadow:0 0 12px currentColor}',
    '.pg-overlay{position:absolute;inset:0;background:rgba(4,7,16,.78);backdrop-filter:blur(9px);display:flex;align-items:center;justify-content:center;z-index:10;padding:16px;animation:pgFadeIn .2s ease}',
    '.pg-modal{max-width:360px;width:100%;border-radius:22px;padding:20px;background:linear-gradient(180deg,#151D38,#10182F);border:1px solid rgba(255,255,255,.1);box-shadow:0 22px 50px rgba(0,0,0,.55)}',
    '.pg-modal h2{margin:0;font-size:23px;font-weight:950;color:#fff}.pg-modal p{margin:6px 0 0;color:#A8B4C9;font-size:13px;line-height:1.45}',
    '.pg-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin:14px 0}',
    '.pg-mini{padding:9px;border-radius:12px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06)}',
    '.pg-mini small{display:block;font-size:9px;letter-spacing:1.2px;text-transform:uppercase;color:#8CA0BE;font-weight:800}',
    '.pg-mini b{display:block;font-size:18px;margin-top:2px;font-weight:900}',
    '.pg-stars{display:flex;justify-content:center;gap:5px;margin:8px 0 4px;font-size:24px}',
    '.pg-stars .off{opacity:.2}',
    '.pg-btnrow{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:12px}',
    '.pg-btn{border:none;border-radius:12px;padding:11px 18px;font:700 13px system-ui;cursor:pointer;transition:transform .12s ease,opacity .12s ease}',
    '.pg-btn:hover{transform:translateY(-1px)}',
    '.pg-btn.pri{background:linear-gradient(135deg,#8B5CF6,#3B82F6);color:#fff;box-shadow:0 12px 24px rgba(59,130,246,.25)}',
    '.pg-btn.sec{background:rgba(255,255,255,.06);color:#DCE7F8;border:1px solid rgba(255,255,255,.1)}',
    '.pg-helpbox{font-size:12px;line-height:1.55;color:#D2DCEC}.pg-helpbox h3{margin:10px 0 4px;font-size:11px;letter-spacing:1.4px;text-transform:uppercase;color:#8CA0BE}',
    '.pg-toast{position:absolute;left:50%;bottom:88px;transform:translateX(-50%);padding:10px 14px;border-radius:999px;background:rgba(15,23,42,.8);border:1px solid rgba(255,255,255,.08);font-size:12px;font-weight:800;color:#DCE7F8;z-index:8;opacity:0;pointer-events:none;transition:opacity .18s ease,transform .18s ease}',
    '.pg-toast.show{opacity:1;transform:translateX(-50%) translateY(-4px)}',
    '@media (min-width:880px) and (min-height:700px){.pg-root.desktop .pg-canvas-wrap{padding:14px 16px 14px}.pg-root.desktop .pg-top{padding:12px 16px 10px}.pg-root.desktop .pg-head{grid-template-columns:minmax(0,1fr) auto auto}.pg-root.desktop .pg-progress{grid-template-columns:repeat(3,minmax(0,1fr))}.pg-root.desktop .pg-bottom{grid-template-columns:220px repeat(3,minmax(130px,1fr))}.pg-root.desktop .pg-stage-copy b{font-size:18px}.pg-root.desktop .pg-stage-copy small{font-size:11px}}',
    '@media (max-width:760px){.pg-head{grid-template-columns:minmax(0,1fr) auto}.pg-actions{grid-column:2}.pg-stats{grid-column:1/-1;overflow:auto;padding-bottom:2px}.pg-stat{min-width:72px}.pg-progress{grid-template-columns:1fr}.pg-bottom{grid-template-columns:1fr 1fr}.pg-bottom .pg-card:first-child{grid-column:1/-1}.pg-stage-back,.pg-iconbtn{width:40px;height:40px;border-radius:12px}}'
  ].join('');
  document.head.appendChild(s);
}

function el(tag, cls, html) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (html != null) node.innerHTML = html;
  return node;
}

function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function rnd(min, max) { return Math.random() * (max - min) + min; }
function dist(x1, y1, x2, y2) { const dx = x2 - x1, dy = y2 - y1; return Math.sqrt(dx * dx + dy * dy); }
function worldForLevel(level) { return WORLDS[Math.floor((level - 1) / 9) % WORLDS.length]; }

export default function activate(host) {
  const arcade = createArcade(host, {
    name: 'Peggle Odyssey: Arc Light',
    icon: '🔮',
    subtitle: 'Arcade ricochet with fever shots, burst pegs, and skill rankings',
    modes: [
      { id: 'campaign', name: 'Campaign', icon: '🎯', desc: '45 designed and generated stages', unlock: 1 },
      { id: 'precision', name: 'Precision', icon: '◎', desc: 'Fewer balls, better star rewards', unlock: 3 },
      { id: 'fever', name: 'Fever', icon: '🔥', desc: 'Build fever fast and cash out giant shots', unlock: 6 }
    ],
    perks: [
      { id: 'balls', name: 'Extra Ball', icon: '+1', desc: 'Start every stage with one more shot', unlock: 1 },
      { id: 'bucket', name: 'Wide Bucket', icon: '⌄', desc: 'Catch bucket becomes noticeably wider', unlock: 3 },
      { id: 'multiball', name: 'Lucky Split', icon: '✦', desc: 'Orange and burst pegs can split your shot', unlock: 5 }
    ],
    missions: [
      { event: 'peg', target: 280, title: 'Peg Sweeper', detail: 'Hit 280 pegs', icon: '🔵', reward: 90 },
      { event: 'orange', target: 85, title: 'Orange Fever', detail: 'Clear 85 orange pegs', icon: '🟠', reward: 105 },
      { event: 'burst', target: 15, title: 'Burst Artist', detail: 'Trigger 15 burst pegs', icon: '💥', reward: 120 },
      { event: 'level', target: 6, title: 'Stage Climber', detail: 'Clear six stages', icon: '🏆', reward: 135 }
    ]
  });

  ensureStyles();

  let root, topEl, wrapEl, canvasEl, ctx, resizeObs, toastEl;
  let cw = 440, ch = 560, bucketX = 220, bucketSpeed = BASE_BUCKET_SPEED;
  let pegs = [], balls = [], particles = [], popups = [];
  let score = 0, best = 0, level = 1, ballsRemaining = DEFAULT_BALLS;
  let orangeLeft = 0, orangeTotal = 0, targetScore = 0, catches = 0;
  let gameState = 'aiming', animId = null, lastTime = 0, aimAngle = Math.PI / 2;
  let aimPreviewDistance = 180;
  let aimPointX = 0, aimPointY = SHOOTER_Y + 180;
  let activeMode = 'campaign', activePerk = 'balls', currentWorld = WORLDS[0];
  let fever = 0, shotHits = 0, shotOrange = 0, shotStyle = 0, shotsTaken = 0;
  let overlayEl = null, pointerActive = false;
  let stageStars = {}, totalStars = 0;
  let ui = {};

  arcade.ready.then(() => {
    activeMode = arcade.mode().id;
    activePerk = arcade.perk().id;
  });

  Promise.all([
    host.storage.get('peggle_best').catch(() => 0),
    host.storage.get('peggle_stars').catch(() => ({}))
  ]).then(([b, stars]) => {
    best = typeof b === 'number' ? b : 0;
    stageStars = stars && typeof stars === 'object' ? stars : {};
    totalStars = Object.values(stageStars).reduce((a, b2) => a + (b2 || 0), 0);
    updateDom();
  });

  function saveProgress() {
    host.storage.set('peggle_best', best).catch(() => {});
    host.storage.set('peggle_stars', stageStars).catch(() => {});
  }

  function currentBallLimit() {
    return (activeMode === 'precision' ? 7 : activeMode === 'fever' ? 12 : DEFAULT_BALLS) + (activePerk === 'balls' ? 1 : 0);
  }

  function buildLevelPattern(lvl) {
    if (lvl <= PATTERNS.length) return PATTERNS[lvl - 1].slice();
    const pattern = [];
    for (let r = 0; r < ROWS; r++) {
      let row = '';
      for (let c = 0; c < MAX_COLS; c++) {
        let char = '.';
        const wave = Math.sin((c + lvl * 0.6) * 0.72) + Math.cos((r - lvl * 0.35) * 0.88);
        if (wave > 0.95) char = 'O';
        else if (wave > 0.4) char = 'B';
        else if (wave > 0.15) char = 'P';
        else if (wave > -0.15) char = 'G';
        if ((r + c + lvl) % 11 === 0) char = 'O';
        if ((r * 2 + c + lvl) % 17 === 0) char = 'P';
        if ((r + c) % 7 === 0 && r > 1) char = char === '.' ? 'B' : char;
        if ((c === 0 || c === MAX_COLS - 1) && (r % 3 === 0)) char = '.';
        row += char;
      }
      pattern.push(row);
    }
    return pattern;
  }

  function fieldMetrics() {
    const sidePad = Math.max(24, Math.min(42, cw * 0.055));
    const usableWidth = Math.max(180, cw - sidePad * 2);
    const pegDx = Math.min(PEG_DX, usableWidth / (MAX_COLS - 0.5));
    const startX = (cw - pegDx * (MAX_COLS - 0.5)) / 2;
    const bucketY = ch - 44;
    const startY = SHOOTER_Y + 58;
    const bottomY = Math.max(startY + 40, bucketY - 38);
    const pegDy = Math.min(PEG_DY, Math.max(12, (bottomY - startY) / Math.max(1, ROWS - 1)));
    return { pegDx, pegDy, startX, startY, bucketY, bottomY };
  }

  function pegPosition(peg) {
    const metrics = fieldMetrics();
    const offsetX = peg.row % 2 === 0 ? 0 : metrics.pegDx / 2;
    peg.x = metrics.startX + peg.col * metrics.pegDx + offsetX;
    peg.y = metrics.startY + peg.row * metrics.pegDy;
  }

  function relayoutPegs() {
    pegs.forEach(pegPosition);
  }

  function generatePegs(lvl) {
    currentWorld = worldForLevel(lvl);
    const pattern = buildLevelPattern(lvl);
    pegs = [];
    orangeLeft = 0;
    orangeTotal = 0;
    pattern.forEach((rowStr, row) => {
      for (let col = 0; col < Math.min(MAX_COLS, rowStr.length); col++) {
        const ch = rowStr[col];
        if (ch === '.') continue;
        const map = ch === 'O' ? 'orange' : ch === 'G' ? 'green' : ch === 'P' ? 'burst' : 'blue';
        const peg = { row, col, char: ch, type: map, alive: true, x: 0, y: 0, hitAnim: 0 };
        pegPosition(peg);
        pegs.push(peg);
        if (peg.type === 'orange') { orangeLeft++; orangeTotal++; }
      }
    });
    if (orangeTotal < 10) {
      const extras = pegs.filter(p => p.type === 'blue').slice(0, Math.min(6, pegs.length));
      extras.forEach(p => { p.type = 'orange'; p.char = 'O'; orangeLeft++; orangeTotal++; });
    }
    targetScore = orangeTotal * 900 + pegs.length * 90 + lvl * 420 + (activeMode === 'precision' ? 600 : 0);
  }

  function spawnBall(x, y, vx, vy) {
    const ball = { x, y, vx, vy, alive: true, trail: [] };
    balls.push(ball);
    return ball;
  }

  function addPopup(x, y, text, color = '#FBBF24') {
    popups.push({ x, y, text, color, life: 1, decay: 0.014 });
  }

  function spawnParticles(x, y, color, count = 12, spread = 1) {
    for (let i = 0; i < count; i++) {
      const ang = Math.random() * Math.PI * 2;
      const sp = rnd(1.5, 4.5) * spread;
      particles.push({ x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, life: 1, decay: rnd(0.018, 0.04), color, size: rnd(2, 3.4) });
    }
  }

  function showToast(text) {
    if (!toastEl) return;
    toastEl.textContent = text;
    toastEl.classList.add('show');
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(() => toastEl.classList.remove('show'), 1200);
  }

  function triggerBurst(ball, peg) {
    let cleared = 0;
    pegs.forEach(other => {
      if (!other.alive || other === peg) return;
      const d = dist(peg.x, peg.y, other.x, other.y);
      if (d <= 60) {
        other.alive = false;
        other.hitAnim = 1;
        cleared++;
        if (other.type === 'orange') orangeLeft--;
        awardPeg(other, true);
      }
    });
    score += 400 * Math.max(1, cleared);
    fever = clamp(fever + 12, 0, 100);
    addPopup(peg.x, peg.y - 12, 'BURST', '#A78BFA');
    spawnParticles(peg.x, peg.y, '#A78BFA', 22, 1.6);
    arcade.record('burst', 1);
    if (activePerk === 'multiball' && Math.random() < 0.12 && balls.length < 8) {
      spawnBall(ball.x, ball.y, -ball.vx * 0.88, ball.vy * 0.86 - 1.5);
      showToast('Lucky split');
    }
  }

  function awardPeg(peg, fromBurst = false) {
    let points = 100;
    let color = '#3B82F6';
    if (peg.type === 'orange') {
      points = 1000;
      color = '#F97316';
      arcade.record('orange', 1);
    } else if (peg.type === 'green') {
      points = 250;
      color = '#34D399';
    } else if (peg.type === 'burst') {
      points = 350;
      color = '#A78BFA';
    }
    const feverMult = 1 + fever * 0.012;
    const shotMult = 1 + Math.min(shotHits * 0.06, 0.9);
    const total = Math.round(points * feverMult * shotMult * (activeMode === 'precision' ? 1.18 : 1));
    score += total;
    shotStyle += total;
    fever = clamp(fever + (peg.type === 'orange' ? 8 : peg.type === 'green' ? 10 : peg.type === 'burst' ? 14 : 4), 0, 100);
    addPopup(peg.x, peg.y, '+' + total, color);
    spawnParticles(peg.x, peg.y, color, fromBurst ? 8 : 10);
    arcade.record('peg', 1);
  }

  function checkPegCollision(ball) {
    for (let i = pegs.length - 1; i >= 0; i--) {
      const p = pegs[i];
      if (!p.alive) continue;
      const d = dist(ball.x, ball.y, p.x, p.y);
      if (d < BALL_R + PEG_R) {
        p.alive = false;
        p.hitAnim = 1;
        shotHits++;
        if (p.type === 'orange') { orangeLeft--; shotOrange++; }
        awardPeg(p, false);
        if (p.type === 'green') {
          if (balls.length < 7) {
            spawnBall(ball.x, ball.y, -Math.abs(ball.vx) * 0.92 || -4.8, -Math.abs(ball.vy) * 0.75 - 2.2);
            spawnBall(ball.x, ball.y, Math.abs(ball.vx) * 0.92 || 4.8, -Math.abs(ball.vy) * 0.75 - 1.8);
            addPopup(p.x, p.y - 12, 'MULTI', '#34D399');
          }
        } else if (p.type === 'burst') {
          triggerBurst(ball, p);
        } else if (p.type === 'orange' && activePerk === 'multiball' && Math.random() < 0.07 && balls.length < 8) {
          spawnBall(ball.x, ball.y, -ball.vx * 0.85 || -4.5, ball.vy * 0.8 - 1);
        }

        const dx = ball.x - p.x, dy = ball.y - p.y;
        const nd = Math.max(Math.sqrt(dx * dx + dy * dy), 0.001);
        const nx = dx / nd, ny = dy / nd;
        const dot = ball.vx * nx + ball.vy * ny;
        ball.vx -= 2 * dot * nx;
        ball.vy -= 2 * dot * ny;
        ball.vx += rnd(-0.35, 0.35);
        ball.vy += rnd(-0.35, 0.35);
        ball.x = p.x + nx * (BALL_R + PEG_R + 0.4);
        ball.y = p.y + ny * (BALL_R + PEG_R + 0.4);

        if (orangeLeft <= 0) {
          completeLevel();
          return true;
        }
      }
    }
    return false;
  }

  function checkBucket(ball) {
    const bucketW = BASE_BUCKET_W * (activePerk === 'bucket' ? 1.4 : 1) * (fever >= 88 ? 1.15 : 1);
    const by = fieldMetrics().bucketY;
    if (ball.y >= by - BALL_R && ball.y <= by + BUCKET_H + BALL_R) {
      if (ball.x >= bucketX - bucketW / 2 - BALL_R && ball.x <= bucketX + bucketW / 2 + BALL_R) {
        ball.alive = false;
        ballsRemaining++;
        catches++;
        score += 900 + Math.round(fever * 8);
        addPopup(bucketX, by - 10, 'FREE BALL', '#22C55E');
        spawnParticles(bucketX, by + 3, '#22C55E', 16, 1.1);
        showToast('Bucket catch');
      }
    }
  }

  function removeDeadBalls() {
    balls = balls.filter(b => {
      if (!b.alive) return false;
      if (b.y > ch + BALL_R + 6) { b.alive = false; return false; }
      if (b.y < -40 && b.vy < 0 && balls.length > 1) { b.alive = false; return false; }
      return true;
    });
  }

  function computeStars() {
    const clear = 18;
    const scoreRatio = Math.min(score / targetScore, 1.8);
    const scorePts = Math.round(scoreRatio / 1.8 * 32);
    const efficiencyPts = Math.round((ballsRemaining / currentBallLimit()) * 28);
    const stylePts = Math.min(14, catches * 4 + (shotHits >= 10 ? 4 : 0) + (shotOrange >= 4 ? 4 : 0));
    const feverPts = Math.round((fever / 100) * 8);
    const total = clear + scorePts + efficiencyPts + stylePts + feverPts;
    let stars = total >= 92 ? 5 : total >= 78 ? 4 : total >= 60 ? 3 : total >= 43 ? 2 : 1;
    if (stars === 5 && !(scoreRatio >= 1.18 && ballsRemaining >= 2 && catches >= 1)) stars = 4;
    return { stars, total, scorePts, efficiencyPts, stylePts, feverPts };
  }

  function showOverlay(title, sub, opts) {
    if (overlayEl) overlayEl.remove();
    overlayEl = el('div', 'pg-overlay');
    const modal = el('div', 'pg-modal');
    const body = opts && opts.body ? opts.body : '';
    modal.innerHTML = '<h2>' + title + '</h2><p>' + sub + '</p>' + body + '<div class="pg-btnrow"></div>';
    const row = modal.querySelector('.pg-btnrow');
    (opts.buttons || []).forEach(btn => {
      const b = el('button', 'pg-btn ' + (btn.kind || 'sec')); b.textContent = btn.label;
      b.addEventListener('click', () => { if (overlayEl) overlayEl.remove(); overlayEl = null; btn.onClick(); });
      row.appendChild(b);
    });
    overlayEl.appendChild(modal);
    root.appendChild(overlayEl);
  }

  function completeLevel() {
    gameState = 'levelcomplete';
    arcade.record('level', 1);
    const result = computeStars();
    const prev = stageStars[level] || 0;
    if (result.stars > prev) {
      stageStars[level] = result.stars;
      totalStars += result.stars - prev;
      saveProgress();
    }
    if (score > best) { best = score; saveProgress(); }
    const nextLevel = level + 1;
    const isLast = activeMode === 'campaign' && level >= CAMPAIGN_LEVELS;
    updateDom();
    showOverlay(
      'Stage ' + level + ' Cleared',
      currentWorld.name + ' • ' + (result.stars === 5 ? 'Legendary' : result.stars === 4 ? 'Masterful' : result.stars === 3 ? 'Excellent' : result.stars === 2 ? 'Solid' : 'Clear'),
      {
        body:
          '<div class="pg-stars">' + Array.from({ length: 5 }, (_, i) => '<span class="' + (i < result.stars ? '' : 'off') + '">★</span>').join('') + '</div>' +
          '<div class="pg-grid">' +
          '<div class="pg-mini"><small>Score</small><b>' + score.toLocaleString() + '</b></div>' +
          '<div class="pg-mini"><small>Target</small><b>' + targetScore.toLocaleString() + '</b></div>' +
          '<div class="pg-mini"><small>Balls Left</small><b>' + ballsRemaining + '</b></div>' +
          '<div class="pg-mini"><small>Catches</small><b>' + catches + '</b></div>' +
          '</div>',
        buttons: isLast ? [
          { label: 'New Run', kind: 'pri', onClick: () => resetGame() },
          { label: 'Replay Stage', kind: 'sec', onClick: () => startLevel(level) }
        ] : [
          { label: 'Next Stage', kind: 'pri', onClick: () => startLevel(nextLevel) },
          { label: 'Replay', kind: 'sec', onClick: () => startLevel(level) }
        ]
      }
    );
  }

  function gameOver() {
    gameState = 'gameover';
    if (score > best) { best = score; saveProgress(); }
    arcade.record('fail', 1);
    arcade.record('score', score);
    updateDom();
    showOverlay('Run Ended', 'Out of balls. Build fever, catch the bucket, and clear all orange pegs.', {
      body: '<div class="pg-grid">' +
        '<div class="pg-mini"><small>Score</small><b>' + score.toLocaleString() + '</b></div>' +
        '<div class="pg-mini"><small>Best</small><b>' + best.toLocaleString() + '</b></div>' +
        '<div class="pg-mini"><small>Stage</small><b>' + level + '</b></div>' +
        '<div class="pg-mini"><small>Orange Left</small><b>' + orangeLeft + '</b></div>' +
        '</div>',
      buttons: [
        { label: 'Try Again', kind: 'pri', onClick: () => startLevel(level) },
        { label: 'New Run', kind: 'sec', onClick: () => resetGame() }
      ]
    });
  }

  function showHelp() {
    showOverlay('How to Play', 'Ricochet into orange pegs, build fever, and hunt high-star clears.', {
      body: '<div class="pg-helpbox">' +
        '<h3>Goal</h3><p>Clear every <b style="color:#F97316">orange peg</b> to finish the stage. Score above the target and conserve balls for better stars.</p>' +
        '<h3>Peg Types</h3><p><b style="color:#3B82F6">Blue</b> score points. <b style="color:#F97316">Orange</b> are mandatory. <b style="color:#34D399">Green</b> split your shot. <b style="color:#A78BFA">Burst</b> pegs explode nearby pegs.</p>' +
        '<h3>Controls</h3><p>Move the pointer to aim and click or tap to fire. Catch a ball in the bucket for a free shot.</p>' +
        '<h3>Stars</h3><p>High score ratio, spare balls, bucket catches, and strong fever play all improve your rating.</p>' +
        '</div>',
      buttons: [{ label: 'Got it', kind: 'pri', onClick: () => {} }]
    });
  }

  function resizeCanvas() {
    if (!wrapEl) return;
    const rect = wrapEl.getBoundingClientRect();
    cw = Math.max(320, Math.round(rect.width));
    ch = Math.max(360, Math.round(rect.height));
    canvasEl.width = cw * (window.devicePixelRatio || 1);
    canvasEl.height = ch * (window.devicePixelRatio || 1);
    canvasEl.style.width = cw + 'px';
    canvasEl.style.height = ch + 'px';
    ctx.setTransform(window.devicePixelRatio || 1, 0, 0, window.devicePixelRatio || 1, 0, 0);
    bucketX = clamp(bucketX || cw / 2, 54, cw - 54);
    relayoutPegs();
    root.classList.toggle('desktop', rect.width >= 860 && rect.height >= 620);
  }

  function drawBackground() {
    const grad = ctx.createLinearGradient(0, 0, 0, ch);
    grad.addColorStop(0, currentWorld.bg1);
    grad.addColorStop(1, currentWorld.bg2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, cw, ch);

    ctx.fillStyle = 'rgba(255,255,255,.08)';
    for (let i = 0; i < 28; i++) {
      const x = ((i * 91) % cw);
      const y = ((i * 147) % ch);
      ctx.fillRect(x, y, 2.4, 2.4);
    }

    const glow = ctx.createRadialGradient(cw * 0.5, ch * 0.15, 10, cw * 0.5, ch * 0.15, ch * 0.55);
    glow.addColorStop(0, currentWorld.accent + '33');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, cw, ch);
  }

  function drawAimGuide() {
    if (gameState !== 'aiming') return;
    const sx = cw / 2, sy = SHOOTER_Y;
    const speed = activeMode === 'precision' ? 10.6 : 10.2;
    const barrelLen = 18;
    const ox = sx + Math.cos(aimAngle) * barrelLen;
    const oy = sy + Math.sin(aimAngle) * barrelLen;
    let x = ox, y = oy;
    let vx = Math.cos(aimAngle) * speed;
    let vy = Math.sin(aimAngle) * speed;

    const pts = [{ x: ox, y: oy, t: 0 }];
    const maxSteps = 72;
    const guideLength = clamp(aimPreviewDistance * 1.02, 30, Math.min(ch * 0.88, 380));
    let travelled = 0;

    for (let i = 0; i < maxSteps; i++) {
      vy += GRAVITY * 0.82;
      const px = x, py = y;
      x += vx * 0.92;
      y += vy * 0.92;

      if (x - BALL_R <= 0) {
        x = BALL_R;
        vx = Math.abs(vx) * 0.72;
      }
      if (x + BALL_R >= cw) {
        x = cw - BALL_R;
        vx = -Math.abs(vx) * 0.72;
      }
      if (y - BALL_R <= 0) {
        y = BALL_R;
        vy = Math.abs(vy) * 0.32;
      }

      travelled += Math.hypot(x - px, y - py);
      pts.push({ x, y, t: Math.min(1, travelled / guideLength) });
      if (travelled >= guideLength || y > ch * 0.9) break;
    }

    ctx.save();

    // Barrel and socket: this is the unmistakable trajectory origin.
    ctx.translate(sx, sy);
    ctx.rotate(aimAngle);
    ctx.shadowColor = currentWorld.accent;
    ctx.shadowBlur = 16;
    ctx.fillStyle = 'rgba(214,242,255,.96)';
    ctx.beginPath();
    ctx.roundRect(5, -6, 16, 12, 6);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = currentWorld.accent;
    ctx.lineWidth = 1.6;
    ctx.stroke();
    ctx.fillStyle = currentWorld.accent;
    ctx.beginPath();
    ctx.arc(barrelLen, 0, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    const end = pts[Math.min(pts.length - 1, 10)] || { x: ox, y: oy + 100 };
    const beam = ctx.createLinearGradient(ox, oy, end.x, end.y);
    beam.addColorStop(0, currentWorld.accent);
    beam.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.globalAlpha = 0.22;
    ctx.strokeStyle = beam;
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    pts.slice(1).forEach(pt => ctx.lineTo(pt.x, pt.y));
    ctx.stroke();
    ctx.globalAlpha = 1;

    pts.forEach((pt, i) => {
      const alpha = 0.98 - pt.t * 0.78;
      const radius = 4.8 - pt.t * 2.5;
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, Math.max(1.35, radius), 0, Math.PI * 2);
      ctx.fill();
      if (i === pts.length - 1) {
        ctx.strokeStyle = 'rgba(96,165,250,.9)';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2);
        ctx.stroke();
      }
    });
    ctx.restore();
  }

  function drawShooter() {
    const sx = cw / 2, sy = SHOOTER_Y;
    ctx.save();
    ctx.shadowColor = currentWorld.accent;
    ctx.shadowBlur = 20;
    ctx.fillStyle = 'rgba(255,255,255,.11)';
    ctx.beginPath(); ctx.arc(sx, sy, 13, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = currentWorld.accent;
    ctx.beginPath(); ctx.arc(sx, sy, 7.2, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();
    drawAimGuide();
  }

  function drawPeg(peg) {
    const color = peg.type === 'orange' ? '#F97316' : peg.type === 'green' ? '#34D399' : peg.type === 'burst' ? '#A78BFA' : '#3B82F6';
    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = peg.type === 'orange' ? 18 : peg.type === 'burst' ? 16 : 10;
    const pulse = peg.hitAnim > 0 ? 1 + peg.hitAnim * 0.18 : 1;
    ctx.translate(peg.x, peg.y);
    ctx.scale(pulse, pulse);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, 0, PEG_R, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255,255,255,.35)';
    ctx.beginPath();
    ctx.arc(-1.7, -1.7, PEG_R * 0.35, 0, Math.PI * 2);
    ctx.fill();
    if (peg.type === 'burst') {
      ctx.strokeStyle = 'rgba(255,255,255,.65)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(-3.5, 0); ctx.lineTo(3.5, 0); ctx.moveTo(0, -3.5); ctx.lineTo(0, 3.5);
      ctx.stroke();
    }
    ctx.restore();
    peg.hitAnim = Math.max(0, peg.hitAnim - 0.06);
  }

  function drawPegs() { pegs.forEach(p => p.alive && drawPeg(p)); }

  function drawBalls() {
    balls.forEach(ball => {
      ball.trail.forEach((t, idx) => {
        ctx.save();
        ctx.globalAlpha = (idx + 1) / ball.trail.length * 0.3;
        ctx.fillStyle = '#E5EDF7';
        ctx.beginPath(); ctx.arc(t.x, t.y, BALL_R * 0.9, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });
      ctx.save();
      ctx.shadowColor = '#FFFFFF';
      ctx.shadowBlur = 18;
      const grad = ctx.createRadialGradient(ball.x - 1, ball.y - 1, 0, ball.x, ball.y, BALL_R + 1.5);
      grad.addColorStop(0, '#FFFFFF');
      grad.addColorStop(0.6, '#F2F6FC');
      grad.addColorStop(1, '#A9B5C9');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(96,165,250,.85)';
      ctx.lineWidth = 1.25;
      ctx.beginPath(); ctx.arc(ball.x, ball.y, BALL_R + 0.6, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    });
  }

  function drawParticles() {
    particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    });
  }

  function drawPopups() {
    popups.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.shadowColor = p.color; ctx.shadowBlur = 12;
      ctx.fillStyle = p.color;
      ctx.font = '900 14px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(p.text, p.x, p.y);
      ctx.restore();
    });
  }

  function drawBucket() {
    const width = BASE_BUCKET_W * (activePerk === 'bucket' ? 1.4 : 1) * (fever >= 88 ? 1.15 : 1);
    const y = fieldMetrics().bucketY;
    ctx.save();
    ctx.shadowColor = currentWorld.accent2;
    ctx.shadowBlur = 18;
    ctx.fillStyle = 'rgba(255,255,255,.06)';
    ctx.fillRect(bucketX - width / 2, y, width, BUCKET_H);
    ctx.strokeStyle = currentWorld.accent2;
    ctx.lineWidth = 1.6;
    ctx.strokeRect(bucketX - width / 2, y, width, BUCKET_H);
    ctx.restore();
  }

  function drawBallIndicators() {
    const hiddenBalls = balls.filter(ball => ball.alive && (ball.y < 26 || ball.y > ch - 18 || ball.x < 8 || ball.x > cw - 8));
    if (!hiddenBalls.length) return;
    hiddenBalls.forEach((ball, index) => {
      const ix = clamp(ball.x, 26, cw - 26);
      const iy = clamp(ball.y < 26 ? 22 : ball.y > ch - 18 ? ch - 22 : ball.y, 22, ch - 22);
      ctx.save();
      ctx.globalAlpha = 0.94;
      ctx.fillStyle = 'rgba(96,165,250,.16)';
      ctx.beginPath(); ctx.arc(ix, iy, 11, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(96,165,250,.95)';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(ix, iy, 11, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 10px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(index + 1), ix, iy + 0.5);
      ctx.restore();
    });
  }

  function render() {
    if (!ctx) return;
    ctx.clearRect(0, 0, cw, ch);
    drawBackground();
    drawBucket();
    drawPegs();
    drawParticles();
    drawBalls();
    drawBallIndicators();
    drawPopups();
    drawShooter();
  }

  function update(dt) {
    if (gameState !== 'playing') return;

    bucketX += bucketSpeed * dt;
    const width = BASE_BUCKET_W * (activePerk === 'bucket' ? 1.4 : 1) * (fever >= 88 ? 1.15 : 1);
    if (bucketX < width / 2 + 12) { bucketX = width / 2 + 12; bucketSpeed = Math.abs(bucketSpeed); }
    if (bucketX > cw - width / 2 - 12) { bucketX = cw - width / 2 - 12; bucketSpeed = -Math.abs(bucketSpeed); }

    balls.forEach(ball => {
      if (!ball.alive) return;
      ball.vy += GRAVITY * dt;
      ball.x += ball.vx * dt;
      ball.y += ball.vy * dt;
      ball.trail.push({ x: ball.x, y: ball.y });
      if (ball.trail.length > 7) ball.trail.shift();

      if (ball.x - BALL_R <= 0) { ball.x = BALL_R; ball.vx = Math.abs(ball.vx) * 0.72; }
      if (ball.x + BALL_R >= cw) { ball.x = cw - BALL_R; ball.vx = -Math.abs(ball.vx) * 0.72; }
      if (ball.y - BALL_R <= 0) { ball.y = BALL_R; ball.vy = Math.abs(ball.vy) * 0.32; }
      const mag = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
      if (mag > 12.4) { ball.vx = ball.vx / mag * 12.4; ball.vy = ball.vy / mag * 12.4; }
      if (checkPegCollision(ball)) return;
      checkBucket(ball);
    });

    removeDeadBalls();

    if (balls.length === 0 && gameState === 'playing') {
      if (ballsRemaining <= 0) gameOver();
      else {
        gameState = 'aiming';
        fever = clamp(fever - 7, 0, 100);
        updateDom();
      }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx * dt; p.y += p.vy * dt; p.life -= p.decay * dt;
      if (p.life <= 0) particles.splice(i, 1);
    }
    for (let i = popups.length - 1; i >= 0; i--) {
      const p = popups[i];
      p.y -= 1.15 * dt; p.life -= p.decay * dt;
      if (p.life <= 0) popups.splice(i, 1);
    }
  }

  function loop(t) {
    animId = requestAnimationFrame(loop);
    if (!lastTime) lastTime = t;
    const dt = Math.min(3, (t - lastTime) / 16.667);
    lastTime = t;
    update(dt);
    render();
  }

  function startLoop() { stopLoop(); lastTime = 0; animId = requestAnimationFrame(loop); }
  function stopLoop() { if (animId) { cancelAnimationFrame(animId); animId = null; } }

  function updateDom() {
    if (!root) return;
    ui.stageName.textContent = 'Stage ' + level;
    ui.stageWorld.textContent = currentWorld.name;
    ui.score.textContent = score.toLocaleString();
    ui.balls.textContent = ballsRemaining;
    ui.left.textContent = orangeLeft;
    ui.fever.textContent = Math.round(fever) + '%';
    ui.goalLabel.textContent = score.toLocaleString() + ' / ' + targetScore.toLocaleString();
    ui.goalFill.style.width = Math.min(100, score / targetScore * 100) + '%';
    ui.orangeLabel.textContent = (orangeTotal - orangeLeft) + ' / ' + orangeTotal;
    ui.orangeFill.style.width = (orangeTotal ? (orangeTotal - orangeLeft) / orangeTotal * 100 : 0) + '%';
    ui.feverLabel.textContent = Math.round(fever) + '%';
    ui.feverFill.style.width = fever + '%';
    ui.bestStar.textContent = '★ ' + totalStars;
    ui.bestScore.textContent = best.toLocaleString();
    ui.tool1.classList.toggle('lock', fever < 35);
    ui.tool2.classList.toggle('lock', fever < 60);
    ui.tool3.classList.toggle('lock', fever < 100);
  }

  function startLevel(lvl) {
    level = clamp(lvl, 1, activeMode === 'campaign' ? CAMPAIGN_LEVELS : 999);
    currentWorld = worldForLevel(level);
    balls = []; particles = []; popups = [];
    ballsRemaining = currentBallLimit();
    catches = 0; fever = activeMode === 'fever' ? 20 : 0; shotHits = 0; shotOrange = 0; shotStyle = 0; shotsTaken = 0;
    gameState = 'aiming';
    bucketX = cw / 2; bucketSpeed = BASE_BUCKET_SPEED * (Math.random() > 0.5 ? 1 : -1) * (activeMode === 'fever' ? 1.18 : 1);
    generatePegs(level);
    updateDom();
    render();
  }

  function resetGame() {
    activeMode = arcade.mode().id;
    activePerk = arcade.perk().id;
    score = 0;
    startLevel(1);
    arcade.record('start', 1);
    showToast(activeMode.toUpperCase() + ' • ' + activePerk);
    startLoop();
  }

  function shoot() {
    if (gameState !== 'aiming' || ballsRemaining <= 0) return;
    const speed = activeMode === 'precision' ? 10.6 : 10.2;
    const barrelLen = 18;
    const ox = cw / 2 + Math.cos(aimAngle) * barrelLen;
    const oy = SHOOTER_Y + Math.sin(aimAngle) * barrelLen;
    spawnBall(ox, oy, Math.cos(aimAngle) * speed, Math.sin(aimAngle) * speed);
    ballsRemaining--;
    shotsTaken++;
    shotHits = 0; shotOrange = 0; shotStyle = 0;
    gameState = 'playing';
    updateDom();
  }

  function setAimFromPoint(clientX, clientY) {
    const rect = canvasEl.getBoundingClientRect();
    const scaleX = cw / Math.max(1, rect.width);
    const scaleY = ch / Math.max(1, rect.height);
    aimPointX = clamp((clientX - rect.left) * scaleX, 0, cw);
    aimPointY = clamp((clientY - rect.top) * scaleY, 0, ch);
    const dx = aimPointX - cw / 2;
    const dy = aimPointY - SHOOTER_Y;
    aimPreviewDistance = Math.max(22, Math.hypot(dx, dy));
    aimAngle = Math.atan2(dy, dx);
  }

  function onPointerMove(e) { setAimFromPoint(e.clientX, e.clientY); }
  function onPointerDown(e) { pointerActive = true; setAimFromPoint(e.clientX, e.clientY); }
  function onPointerUp(e) { if (pointerActive) { setAimFromPoint(e.clientX, e.clientY); shoot(); } pointerActive = false; }

  return {
    mount(container) {
      container.innerHTML = '';
      root = el('div', 'pg-root');
      container.appendChild(root);
      arcade.mount(root, container);

      root.innerHTML = [
        '<div class="pg-top">',
          '<div class="pg-head">',
            '<div class="pg-stage">',
              '<button class="pg-stage-back" data-restart title="New run">↺</button>',
              '<div class="pg-stage-copy"><b data-stage>Stage 1</b><small data-world>Aurora Atrium</small></div>',
            '</div>',
            '<div class="pg-stats">',
              '<div class="pg-stat score"><small>Score</small><b data-score>0</b></div>',
              '<div class="pg-stat balls"><small>Balls</small><b data-balls>10</b></div>',
              '<div class="pg-stat left"><small>Orange</small><b data-left>0</b></div>',
              '<div class="pg-stat fever"><small>Fever</small><b data-fever>0%</b></div>',
            '</div>',
            '<div class="pg-actions">',
              '<button class="pg-iconbtn" data-help title="Help">?</button>',
            '</div>',
          '</div>',
          '<div class="pg-progress">',
            '<div class="pg-card"><div class="pg-cardhead"><span>Stage target</span><span data-goal-label>0 / 0</span></div><div class="pg-meter"><div class="pg-fill pg-stagefill" data-goal-fill></div></div></div>',
            '<div class="pg-card"><div class="pg-cardhead"><span>Orange pegs</span><span data-orange-label>0 / 0</span></div><div class="pg-meter"><div class="pg-fill" data-orange-fill></div></div></div>',
            '<div class="pg-card"><div class="pg-cardhead"><span>Arc fever</span><span data-fever-label>0%</span></div><div class="pg-meter"><div class="pg-fill" data-fever-fill></div></div></div>',
          '</div>',
        '</div>',
        '<div class="pg-canvas-wrap">',
          '<div class="pg-play"><canvas class="pg-canvas"></canvas><div class="pg-toast"></div></div>',
          '<div class="pg-bottom">',
            '<div class="pg-card"><div class="pg-cardhead"><span>Run stats</span><span data-best-star>★ 0</span></div><div style="display:flex;justify-content:space-between;gap:10px;margin-top:6px;font-size:12px;color:#AAB8CD"><span>Best score</span><b data-best-score style="color:#E5EDF7;font-size:14px">0</b></div></div>',
            '<div class="pg-card pg-tool lock" data-tool1><b>Sonic</b><small>35 fever • bigger bucket</small></div>',
            '<div class="pg-card pg-tool lock" data-tool2><b>Split</b><small>60 fever • next shot splits</small></div>',
            '<div class="pg-card pg-tool lock" data-tool3><b>Fever</b><small>100 fever • double points</small></div>',
          '</div>',
        '</div>'
      ].join('');

      topEl = root.querySelector('.pg-top');
      wrapEl = root.querySelector('.pg-play');
      canvasEl = root.querySelector('.pg-canvas');
      toastEl = root.querySelector('.pg-toast');
      ctx = canvasEl.getContext('2d');
      ui = {
        stageName: root.querySelector('[data-stage]'),
        stageWorld: root.querySelector('[data-world]'),
        score: root.querySelector('[data-score]'),
        balls: root.querySelector('[data-balls]'),
        left: root.querySelector('[data-left]'),
        fever: root.querySelector('[data-fever]'),
        goalLabel: root.querySelector('[data-goal-label]'),
        goalFill: root.querySelector('[data-goal-fill]'),
        orangeLabel: root.querySelector('[data-orange-label]'),
        orangeFill: root.querySelector('[data-orange-fill]'),
        feverLabel: root.querySelector('[data-fever-label]'),
        feverFill: root.querySelector('[data-fever-fill]'),
        bestStar: root.querySelector('[data-best-star]'),
        bestScore: root.querySelector('[data-best-score]'),
        tool1: root.querySelector('[data-tool1]'),
        tool2: root.querySelector('[data-tool2]'),
        tool3: root.querySelector('[data-tool3]')
      };

      root.querySelector('[data-help]').addEventListener('click', showHelp);
      root.querySelector('[data-restart]').addEventListener('click', () => showOverlay('Restart run?', 'Start the current mode again from Stage 1.', { buttons: [
        { label: 'Cancel', kind: 'sec', onClick: () => {} },
        { label: 'Restart', kind: 'pri', onClick: () => resetGame() }
      ] }));

      canvasEl.addEventListener('pointermove', onPointerMove, { passive: true });
      canvasEl.addEventListener('pointerdown', onPointerDown);
      canvasEl.addEventListener('pointerup', onPointerUp);
      canvasEl.addEventListener('pointercancel', () => { pointerActive = false; });
      canvasEl.addEventListener('pointerleave', () => { if (pointerActive) pointerActive = false; });

      resizeObs = new ResizeObserver(() => resizeCanvas());
      resizeObs.observe(wrapEl);
      resizeCanvas();
      resetGame();
    },
    unmount() {
      arcade.cleanup();
      stopLoop();
      if (resizeObs) resizeObs.disconnect();
      if (canvasEl) {
        canvasEl.removeEventListener('pointermove', onPointerMove);
        canvasEl.removeEventListener('pointerdown', onPointerDown);
        canvasEl.removeEventListener('pointerup', onPointerUp);
      }
    }
  };
}
