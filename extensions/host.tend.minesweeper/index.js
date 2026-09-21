import { createArcade } from './arcade-kit.js';

const STYLE_ID = 'tend-mines-deep-signal-v3';
const PROFILE_KEY = 'minesweeper_deep_signal_profile_v3';
const LEGACY_BEST_KEY = 'minesweeper_best';
const LEGACY_CONTRACT_KEY = 'mines_contract';
const MAX_MISSION = 60;

const SECTORS = [
  { name: 'Echo Basin', tag: 'Sector I', accent: '#22d3ee', sub: 'Quiet training fields beneath the polar relay.' },
  { name: 'Cinder Array', tag: 'Sector II', accent: '#fb7185', sub: 'Hot signal pockets hide tightly packed charges.' },
  { name: 'Verdant Static', tag: 'Sector III', accent: '#34d399', sub: 'Overgrown grids reward careful chain deductions.' },
  { name: 'Violet Divide', tag: 'Sector IV', accent: '#c084fc', sub: 'Long-range boards demand clean flag discipline.' },
  { name: 'Solar Wreck', tag: 'Sector V', accent: '#fbbf24', sub: 'Damaged beacons create dense high-risk patterns.' },
  { name: 'Null Horizon', tag: 'Sector VI', accent: '#818cf8', sub: 'The final network tests complete logical mastery.' },
];

const CLASSIC_FIELDS = {
  scout: { id: 'scout', name: 'Scout', rows: 9, cols: 9, mines: 10, par: 65, icon: '◌', desc: '9 × 9 · 10 signals' },
  operator: { id: 'operator', name: 'Operator', rows: 12, cols: 12, mines: 22, par: 120, icon: '◇', desc: '12 × 12 · 22 signals' },
  expert: { id: 'expert', name: 'Expert', rows: 16, cols: 16, mines: 40, par: 210, icon: '⬡', desc: '16 × 16 · 40 signals' },
  frontier: { id: 'frontier', name: 'Frontier', rows: 16, cols: 24, mines: 70, par: 330, icon: '✦', desc: '24 × 16 · 70 signals' },
};

const DEFAULT_PROFILE = {
  version: 3,
  mission: 1,
  bestMission: 1,
  missionStars: {},
  classicField: 'scout',
  bestTimes: {},
  deepWave: 1,
  bestDeepWave: 1,
  totalCaches: 0,
  flawlessWins: 0,
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const keyOf = (r, c) => `${r}:${c}`;
const parseKey = (key) => {
  const [r, c] = key.split(':').map(Number);
  return { r, c };
};
const formatNumber = (value) => Math.max(0, Math.round(value || 0)).toLocaleString();
const formatTime = (seconds) => {
  seconds = Math.max(0, Math.floor(seconds || 0));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
};

function createSeededRandom(seed) {
  let state = (Number(seed) || 1) >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildMission(number, modeId = 'expedition') {
  const stage = Math.max(1, Math.floor(number || 1));
  if (modeId === 'classic') {
    const field = CLASSIC_FIELDS.scout;
    return {
      mission: stage,
      modeId,
      sectorIndex: 0,
      sector: SECTORS[0],
      title: 'Classic Signal Field',
      subtitle: 'Pure Minesweeper rules with a safe opening and no campaign modifiers.',
      rows: field.rows,
      cols: field.cols,
      mines: field.mines,
      par: field.par,
      cacheCount: 0,
      noGuess: false,
      objectives: [],
    };
  }
  if (modeId === 'deep') {
    const wave = stage;
    const tier = Math.min(5, Math.floor((wave - 1) / 4));
    const rows = [9, 10, 12, 14, 16, 16][tier];
    const cols = [9, 12, 14, 16, 18, 22][tier];
    const mines = Math.min(rows * cols - 10, [10, 17, 27, 39, 52, 68][tier] + Math.floor((wave - 1) * 0.9));
    return {
      mission: wave,
      modeId,
      sectorIndex: tier,
      sector: SECTORS[tier],
      title: `Deep Field · Wave ${wave}`,
      subtitle: 'Each clear opens a denser board. One mistake ends the descent.',
      rows,
      cols,
      mines,
      par: Math.round(rows * cols * 0.85 + mines * 1.8),
      cacheCount: Math.min(4, 1 + Math.floor(wave / 4)),
      noGuess: true,
      objectives: [{ type: 'clear', target: rows * cols - mines, label: 'Clear field', icon: '▦' }],
    };
  }

  const sectorIndex = Math.min(SECTORS.length - 1, Math.floor((stage - 1) / 10));
  const within = (stage - 1) % 10;
  const sizeTiers = [
    { rows: 9, cols: 9, mines: 10 },
    { rows: 10, cols: 12, mines: 17 },
    { rows: 12, cols: 14, mines: 27 },
    { rows: 14, cols: 16, mines: 39 },
    { rows: 16, cols: 18, mines: 52 },
    { rows: 16, cols: 22, mines: 66 },
  ];
  const tier = sizeTiers[sectorIndex];
  const mines = Math.min(tier.rows * tier.cols - 10, tier.mines + Math.floor(within * (sectorIndex > 2 ? 1.1 : 0.7)));
  const cacheCount = 1 + Math.floor(within / 3) + (sectorIndex >= 4 ? 1 : 0);
  const safe = tier.rows * tier.cols - mines;
  const par = Math.round(safe * (sectorIndex < 2 ? 0.82 : 0.9) + mines * 1.55 + within * 3);
  const objectives = [
    { type: 'clear', target: safe, label: 'Clear field', icon: '▦' },
    { type: 'cache', target: cacheCount, label: 'Data caches', icon: '◆' },
  ];
  if (stage >= 6) objectives.push({ type: 'chord', target: Math.min(5, 1 + Math.floor(stage / 15)), label: 'Logic chains', icon: '⌁' });
  if (stage >= 16 && stage % 3 === 1) objectives.push({ type: 'flag', target: Math.min(mines, 5 + Math.floor(stage / 4)), label: 'Confirmed flags', icon: '⚑' });
  return {
    mission: stage,
    modeId,
    sectorIndex,
    sector: SECTORS[sectorIndex],
    title: `${SECTORS[sectorIndex].name} · ${within + 1}`,
    subtitle: SECTORS[sectorIndex].sub,
    rows: tier.rows,
    cols: tier.cols,
    mines,
    par,
    cacheCount,
    noGuess: true,
    objectives,
  };
}

function calculateRating(run, config, completed = true) {
  if (!completed) return { stars: 0, total: 0, clear: 0, speed: 0, precision: 0, logic: 0, caches: 0, label: 'Unresolved' };
  const clearScore = 20;
  const timeRatio = run.seconds / Math.max(1, config.par);
  const speedScore = Math.round(clamp((1.34 - timeRatio) / 0.84, 0, 1) * 30);
  const precisionPenalty = run.misflags * 4 + run.mineHits * 10 + run.hints * 3 + run.scans * 5 + run.defuses * 7;
  const precisionScore = Math.max(0, 20 - precisionPenalty);
  const chordTarget = Math.max(2, Math.round(config.mines / 12));
  const chainPart = clamp(run.chords / chordTarget, 0, 1) * 11;
  const streakPart = clamp(run.bestStreak / 10, 0, 1) * 9;
  const logicScore = Math.round(chainPart + streakPart);
  const cacheScore = config.cacheCount ? Math.round(clamp(run.caches / config.cacheCount, 0, 1) * 10) : 10;
  const total = clearScore + speedScore + precisionScore + logicScore + cacheScore;
  let stars = total >= 78 ? 4 : total >= 60 ? 3 : total >= 42 ? 2 : 1;
  const legendary = total >= 92
    && run.seconds <= config.par * 0.75
    && run.mineHits === 0
    && run.misflags === 0
    && run.scans === 0
    && run.hints === 0
    && run.defuses === 0
    && run.caches >= config.cacheCount
    && (run.chords >= 2 || run.bestStreak >= 8);
  if (legendary) stars = 5;
  const labels = ['Unresolved', 'Cleared', 'Focused', 'Brilliant', 'Masterful', 'Legendary'];
  return {
    stars,
    total,
    clear: clearScore,
    speed: speedScore,
    precision: precisionScore,
    logic: logicScore,
    caches: cacheScore,
    label: labels[stars],
  };
}

class BoardCore {
  constructor(rows, cols, mines, rng = Math.random) {
    this.rows = rows;
    this.cols = cols;
    this.mineCount = mines;
    this.rng = rng;
    this.generated = false;
    this.cells = [];
    this.reset();
  }

  reset() {
    this.generated = false;
    this.cells = Array.from({ length: this.rows }, () => Array.from({ length: this.cols }, () => ({
      mine: false,
      clue: 0,
      revealed: false,
      flagged: false,
      cache: false,
      cacheSeen: false,
      scanned: false,
      exploded: false,
    })));
  }

  neighbors(r, c) {
    const result = [];
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) result.push({ r: nr, c: nc });
    }
    return result;
  }

  randomIndex(length) {
    return Math.floor(this.rng() * length);
  }

  generate(firstR, firstC, { cacheCount = 0, noGuess = true, maxAttempts = 180 } = {}) {
    let lastLayout = null;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      this.reset();
      const forbidden = new Set([keyOf(firstR, firstC)]);
      for (const item of this.neighbors(firstR, firstC)) forbidden.add(keyOf(item.r, item.c));
      const candidates = [];
      for (let r = 0; r < this.rows; r++) for (let c = 0; c < this.cols; c++) {
        if (!forbidden.has(keyOf(r, c))) candidates.push({ r, c });
      }
      for (let i = candidates.length - 1; i > 0; i--) {
        const j = this.randomIndex(i + 1);
        [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
      }
      for (let i = 0; i < this.mineCount; i++) this.cells[candidates[i].r][candidates[i].c].mine = true;
      this.computeClues();
      lastLayout = this.snapshotLayout();
      if (!noGuess || this.canSolveFrom(firstR, firstC)) {
        this.placeCaches(cacheCount, firstR, firstC);
        this.generated = true;
        return { logical: true, attempts: attempt + 1 };
      }
    }
    this.restoreLayout(lastLayout);
    this.placeCaches(cacheCount, firstR, firstC);
    this.generated = true;
    return { logical: false, attempts: maxAttempts };
  }

  snapshotLayout() {
    return this.cells.map((row) => row.map((cell) => ({ mine: cell.mine, clue: cell.clue })));
  }

  restoreLayout(layout) {
    this.reset();
    if (!layout) return;
    for (let r = 0; r < this.rows; r++) for (let c = 0; c < this.cols; c++) {
      this.cells[r][c].mine = layout[r][c].mine;
      this.cells[r][c].clue = layout[r][c].clue;
    }
  }

  computeClues() {
    for (let r = 0; r < this.rows; r++) for (let c = 0; c < this.cols; c++) {
      const cell = this.cells[r][c];
      cell.clue = cell.mine ? -1 : this.neighbors(r, c).filter((n) => this.cells[n.r][n.c].mine).length;
    }
  }

  placeCaches(count, firstR, firstC) {
    const safe = [];
    for (let r = 0; r < this.rows; r++) for (let c = 0; c < this.cols; c++) {
      const cell = this.cells[r][c];
      if (!cell.mine && !(r === firstR && c === firstC)) safe.push({ r, c });
    }
    for (let i = safe.length - 1; i > 0; i--) {
      const j = this.randomIndex(i + 1);
      [safe[i], safe[j]] = [safe[j], safe[i]];
    }
    for (let i = 0; i < Math.min(count, safe.length); i++) this.cells[safe[i].r][safe[i].c].cache = true;
  }

  revealFlood(r, c, revealedSet = null) {
    const queue = [{ r, c }];
    const opened = [];
    const seen = new Set();
    while (queue.length) {
      const current = queue.shift();
      const key = keyOf(current.r, current.c);
      if (seen.has(key)) continue;
      seen.add(key);
      const cell = this.cells[current.r][current.c];
      if (!cell || cell.flagged || cell.revealed || cell.mine) continue;
      cell.revealed = true;
      opened.push(current);
      if (revealedSet) revealedSet.add(key);
      if (cell.clue === 0) {
        for (const n of this.neighbors(current.r, current.c)) {
          const neighbor = this.cells[n.r][n.c];
          if (!neighbor.mine && !neighbor.flagged && !neighbor.revealed) queue.push(n);
        }
      }
    }
    return opened;
  }

  reveal(r, c) {
    const cell = this.cells[r]?.[c];
    if (!cell || cell.revealed || cell.flagged) return { opened: [], mine: false, caches: 0 };
    if (cell.mine) {
      cell.revealed = true;
      cell.exploded = true;
      return { opened: [{ r, c }], mine: true, caches: 0 };
    }
    const opened = this.revealFlood(r, c);
    const caches = opened.filter((p) => this.cells[p.r][p.c].cache).length;
    return { opened, mine: false, caches };
  }

  toggleFlag(r, c) {
    const cell = this.cells[r]?.[c];
    if (!cell || cell.revealed) return false;
    cell.flagged = !cell.flagged;
    return cell.flagged;
  }

  chord(r, c) {
    const cell = this.cells[r]?.[c];
    if (!cell || !cell.revealed || cell.clue <= 0) return { opened: [], mine: false, caches: 0 };
    const neighbors = this.neighbors(r, c);
    const flags = neighbors.filter((n) => this.cells[n.r][n.c].flagged).length;
    if (flags !== cell.clue) return { opened: [], mine: false, caches: 0 };
    const opened = [];
    let caches = 0;
    let hit = null;
    for (const n of neighbors) {
      const next = this.cells[n.r][n.c];
      if (next.flagged || next.revealed) continue;
      const result = this.reveal(n.r, n.c);
      opened.push(...result.opened);
      caches += result.caches;
      if (result.mine && !hit) hit = n;
    }
    return { opened, mine: Boolean(hit), hit, caches };
  }

  counts() {
    let revealed = 0;
    let flags = 0;
    let correctFlags = 0;
    let caches = 0;
    for (let r = 0; r < this.rows; r++) for (let c = 0; c < this.cols; c++) {
      const cell = this.cells[r][c];
      if (cell.revealed && !cell.mine) revealed++;
      if (cell.flagged) {
        flags++;
        if (cell.mine) correctFlags++;
      }
      if (cell.revealed && cell.cache) caches++;
    }
    return { revealed, flags, correctFlags, caches, safe: this.rows * this.cols - this.mineCount };
  }

  complete() {
    return this.counts().revealed >= this.rows * this.cols - this.mineCount;
  }

  revealMines() {
    for (let r = 0; r < this.rows; r++) for (let c = 0; c < this.cols; c++) {
      if (this.cells[r][c].mine) this.cells[r][c].revealed = true;
    }
  }

  findDeterministicMove() {
    const known = this.logicStepFromCurrent();
    if (known.safe.size) return { type: 'safe', ...parseKey(known.safe.values().next().value) };
    if (known.mines.size) return { type: 'mine', ...parseKey(known.mines.values().next().value) };
    return null;
  }

  logicStepFromCurrent() {
    const revealed = new Set();
    const flagged = new Set();
    for (let r = 0; r < this.rows; r++) for (let c = 0; c < this.cols; c++) {
      const cell = this.cells[r][c];
      if (cell.revealed && !cell.mine) revealed.add(keyOf(r, c));
      if (cell.flagged) flagged.add(keyOf(r, c));
    }
    return this.deduce(revealed, flagged);
  }

  canSolveFrom(firstR, firstC) {
    const revealed = new Set();
    const flagged = new Set();
    this.simulateFlood(firstR, firstC, revealed);
    let loops = 0;
    while (loops++ < this.rows * this.cols * 3) {
      const deduction = this.deduce(revealed, flagged);
      if (!deduction.safe.size && !deduction.mines.size) break;
      for (const key of deduction.mines) flagged.add(key);
      for (const key of deduction.safe) {
        const { r, c } = parseKey(key);
        this.simulateFlood(r, c, revealed);
      }
      if (revealed.size >= this.rows * this.cols - this.mineCount) return true;
    }
    return revealed.size >= this.rows * this.cols - this.mineCount;
  }

  simulateFlood(r, c, revealed) {
    const queue = [{ r, c }];
    while (queue.length) {
      const current = queue.shift();
      const key = keyOf(current.r, current.c);
      if (revealed.has(key)) continue;
      const cell = this.cells[current.r][current.c];
      if (!cell || cell.mine) continue;
      revealed.add(key);
      if (cell.clue === 0) for (const n of this.neighbors(current.r, current.c)) queue.push(n);
    }
  }

  deduce(revealed, flagged) {
    const safe = new Set();
    const mines = new Set();
    const constraints = [];
    for (const key of revealed) {
      const { r, c } = parseKey(key);
      const cell = this.cells[r][c];
      if (!cell || cell.clue <= 0) continue;
      const unknown = [];
      let knownMines = 0;
      for (const n of this.neighbors(r, c)) {
        const nk = keyOf(n.r, n.c);
        if (flagged.has(nk)) knownMines++;
        else if (!revealed.has(nk)) unknown.push(nk);
      }
      if (!unknown.length) continue;
      const remaining = cell.clue - knownMines;
      if (remaining === 0) unknown.forEach((item) => safe.add(item));
      else if (remaining === unknown.length) unknown.forEach((item) => mines.add(item));
      if (remaining >= 0 && remaining <= unknown.length) constraints.push({ set: new Set(unknown), mines: remaining });
    }
    for (let i = 0; i < constraints.length; i++) for (let j = 0; j < constraints.length; j++) {
      if (i === j) continue;
      const a = constraints[i];
      const b = constraints[j];
      if (a.set.size >= b.set.size) continue;
      let subset = true;
      for (const item of a.set) if (!b.set.has(item)) { subset = false; break; }
      if (!subset) continue;
      const diff = [...b.set].filter((item) => !a.set.has(item));
      const remaining = b.mines - a.mines;
      if (remaining === 0) diff.forEach((item) => safe.add(item));
      else if (remaining === diff.length) diff.forEach((item) => mines.add(item));
    }
    for (const item of mines) safe.delete(item);
    for (const item of safe) mines.delete(item);
    return { safe, mines };
  }

  randomSafeHidden() {
    const options = [];
    for (let r = 0; r < this.rows; r++) for (let c = 0; c < this.cols; c++) {
      const cell = this.cells[r][c];
      if (!cell.mine && !cell.revealed && !cell.flagged) options.push({ r, c });
    }
    return options.length ? options[this.randomIndex(options.length)] : null;
  }

  randomHiddenMine() {
    const options = [];
    for (let r = 0; r < this.rows; r++) for (let c = 0; c < this.cols; c++) {
      const cell = this.cells[r][c];
      if (cell.mine && !cell.revealed && !cell.flagged) options.push({ r, c });
    }
    return options.length ? options[this.randomIndex(options.length)] : null;
  }

  sweepArea(centerR, centerC) {
    const opened = [];
    let caches = 0;
    for (let r = centerR - 1; r <= centerR + 1; r++) for (let c = centerC - 1; c <= centerC + 1; c++) {
      if (r < 0 || r >= this.rows || c < 0 || c >= this.cols) continue;
      const cell = this.cells[r][c];
      if (cell.mine || cell.flagged || cell.revealed) continue;
      const result = this.reveal(r, c);
      opened.push(...result.opened);
      caches += result.caches;
    }
    return { opened, caches };
  }
}

function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
@keyframes ms3-screen{from{opacity:0;transform:translateY(12px) scale(.988)}to{opacity:1;transform:none}}
@keyframes ms3-cell-in{0%{opacity:0;transform:scale(.72)}65%{opacity:1;transform:scale(1.06)}100%{opacity:1;transform:none}}
@keyframes ms3-reveal{0%{transform:scale(.82);filter:brightness(1.8)}100%{transform:none;filter:none}}
@keyframes ms3-flag{0%{transform:translateY(7px) scale(.5);opacity:0}70%{transform:translateY(-2px) scale(1.12);opacity:1}100%{transform:none;opacity:1}}
@keyframes ms3-blast{0%{transform:scale(.7);filter:brightness(3)}45%{transform:scale(1.2);filter:brightness(2)}100%{transform:scale(1);filter:none}}
@keyframes ms3-cache{0%,100%{transform:scale(1);box-shadow:0 0 7px rgba(34,211,238,.28)}50%{transform:scale(1.22);box-shadow:0 0 16px rgba(34,211,238,.82)}}
@keyframes ms3-radar{to{transform:rotate(360deg)}}
@keyframes ms3-pulse{0%,100%{opacity:.32;transform:scale(.9)}50%{opacity:.8;transform:scale(1.04)}}
@keyframes ms3-float{0%{opacity:0;transform:translate(-50%,8px) scale(.8)}18%{opacity:1}100%{opacity:0;transform:translate(-50%,-34px) scale(1.08)}}
@keyframes ms3-shake{0%,100%{transform:none}20%{transform:translateX(-4px)}40%{transform:translateX(4px)}60%{transform:translateX(-3px)}80%{transform:translateX(2px)}}
.ms3-root{container:minefield/size;width:100%;height:100%;min-width:0;min-height:0;overflow:hidden;position:relative;background:radial-gradient(circle at 18% -8%,rgba(34,211,238,.15),transparent 34%),radial-gradient(circle at 92% 8%,rgba(139,92,246,.16),transparent 32%),linear-gradient(180deg,#060b17,#091127 52%,#060a15);font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;color:#f8fafc;user-select:none;-webkit-user-select:none;touch-action:manipulation;isolation:isolate}
.ms3-root::before{content:"";position:absolute;inset:0;pointer-events:none;opacity:.26;background-image:radial-gradient(circle at 17% 23%,rgba(255,255,255,.55) 0 1px,transparent 1.6px),radial-gradient(circle at 74% 37%,rgba(255,255,255,.36) 0 1px,transparent 1.5px),radial-gradient(circle at 41% 78%,rgba(255,255,255,.28) 0 1px,transparent 1.5px);background-size:79px 83px,97px 91px,113px 107px}
.ms3-root *{box-sizing:border-box}.ms3-root button{font:inherit}.ms3-screen{position:absolute;inset:0;z-index:2;min-width:0;min-height:0;animation:ms3-screen .28s cubic-bezier(.22,.72,.16,1)}
.ms3-menu{display:flex;flex-direction:column;gap:12px;padding:18px;overflow:auto;scrollbar-width:thin;scrollbar-color:rgba(148,163,184,.23) transparent}
.ms3-brand{display:flex;align-items:center;justify-content:space-between;gap:12px;flex:0 0 auto}.ms3-logo{display:flex;align-items:center;gap:11px;min-width:0;text-align:left}.ms3-logo-mark{width:50px;height:50px;border-radius:16px;display:grid;place-items:center;position:relative;background:linear-gradient(145deg,#22d3ee,#2563eb 52%,#8b5cf6);border:1px solid rgba(255,255,255,.22);box-shadow:0 15px 42px rgba(37,99,235,.3),inset 0 1px rgba(255,255,255,.28)}.ms3-logo-mark::before{content:"";width:24px;height:24px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 5px rgba(255,255,255,.12)}.ms3-logo-mark::after{content:"";position:absolute;width:3px;height:19px;background:#fff;left:50%;top:6px;transform-origin:50% 19px;animation:ms3-radar 3.2s linear infinite}.ms3-title{font-size:24px;font-weight:950;letter-spacing:-.75px;line-height:1}.ms3-kicker{margin-top:5px;color:#94a3b8;font-size:9px;letter-spacing:2px;text-transform:uppercase;font-weight:850}.ms3-profile{display:flex;align-items:center;gap:6px}.ms3-profile-chip{min-width:54px;padding:7px 8px;border:1px solid rgba(255,255,255,.09);border-radius:12px;background:rgba(15,23,42,.66);text-align:center}.ms3-profile-chip small{display:block;color:#64748b;font-size:7px;text-transform:uppercase;letter-spacing:1.1px;font-weight:900}.ms3-profile-chip b{display:block;margin-top:2px;font-size:14px}
.ms3-hero{border:1px solid rgba(255,255,255,.1);border-radius:22px;padding:16px;background:linear-gradient(145deg,rgba(20,35,66,.82),rgba(11,17,38,.68));box-shadow:0 22px 62px rgba(0,0,0,.34);overflow:hidden;position:relative}.ms3-hero::after{content:"";position:absolute;right:-60px;top:-70px;width:190px;height:190px;border-radius:50%;border:1px solid rgba(34,211,238,.12);box-shadow:0 0 0 28px rgba(99,102,241,.04),0 0 0 57px rgba(168,85,247,.025);pointer-events:none}.ms3-mission-row{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;position:relative;z-index:2}.ms3-sector-tag{font-size:9px;color:#67e8f9;text-transform:uppercase;letter-spacing:1.55px;font-weight:900}.ms3-mission-name{font-size:26px;font-weight:950;letter-spacing:-.6px;margin-top:4px}.ms3-mission-copy{max-width:305px;margin-top:6px;color:#94a3b8;font-size:10.5px;line-height:1.45}.ms3-orb{width:68px;height:68px;flex:0 0 auto;border-radius:50%;display:grid;place-items:center;font-size:23px;font-weight:950;background:radial-gradient(circle at 33% 24%,#fff 0 5%,#67e8f9 7%,#2563eb 53%,#312e81);box-shadow:0 0 0 8px rgba(37,99,235,.09),0 0 35px rgba(34,211,238,.38)}.ms3-objective-preview{display:flex;flex-wrap:wrap;gap:7px;margin-top:13px;position:relative;z-index:2}.ms3-pill{display:flex;align-items:center;gap:6px;padding:7px 9px;border-radius:999px;background:rgba(2,6,23,.46);border:1px solid rgba(255,255,255,.08);font-size:9px;color:#cbd5e1;font-weight:800}.ms3-pill i{font-style:normal;color:#67e8f9}.ms3-radar-preview{display:none;min-height:190px;margin-top:15px;border-radius:18px;border:1px solid rgba(255,255,255,.07);position:relative;overflow:hidden;background:radial-gradient(circle at 50% 50%,rgba(34,211,238,.13),rgba(8,15,35,.48) 45%,rgba(2,6,23,.14) 72%)}.ms3-radar-preview::before,.ms3-radar-preview::after{content:"";position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);border-radius:50%;border:1px solid rgba(103,232,249,.2)}.ms3-radar-preview::before{width:160px;height:160px;box-shadow:inset 0 0 42px rgba(34,211,238,.1)}.ms3-radar-preview::after{width:96px;height:96px}.ms3-sweep{position:absolute;left:50%;top:50%;width:2px;height:78px;background:linear-gradient(#67e8f9,transparent);transform-origin:50% 0;animation:ms3-radar 3.6s linear infinite}.ms3-node{position:absolute;width:20px;height:20px;border-radius:7px;border:1px solid rgba(255,255,255,.25);background:linear-gradient(145deg,#334155,#111827);box-shadow:0 6px 16px rgba(0,0,0,.3)}.ms3-node.mine{border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff 0 4%,#fb7185 8%,#ef4444 42%,#7f1d1d);box-shadow:0 0 18px rgba(239,68,68,.4)}.ms3-node.a{left:18%;top:24%}.ms3-node.b{right:19%;top:22%}.ms3-node.c{left:27%;bottom:18%}.ms3-node.d{right:24%;bottom:17%}.ms3-node.e{left:48%;top:48%}.ms3-primary{width:100%;min-height:48px;margin-top:12px;border-radius:15px;border:1px solid rgba(255,255,255,.15);background:linear-gradient(115deg,#22d3ee,#2563eb 52%,#8b5cf6);color:#fff;cursor:pointer;font-weight:950;text-transform:uppercase;letter-spacing:1.15px;box-shadow:0 13px 34px rgba(37,99,235,.3),inset 0 1px rgba(255,255,255,.22);position:relative;z-index:3}.ms3-primary:hover{filter:brightness(1.08);transform:translateY(-1px)}.ms3-primary:active{transform:scale(.985)}
.ms3-menu-side{display:flex;flex-direction:column;gap:9px}.ms3-menu-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}.ms3-card{min-width:0;padding:11px;border-radius:16px;border:1px solid rgba(255,255,255,.08);background:rgba(15,23,42,.58)}.ms3-card-head{display:flex;align-items:center;justify-content:space-between;gap:8px}.ms3-card-head span{color:#64748b;font-size:8px;text-transform:uppercase;letter-spacing:1.2px;font-weight:900}.ms3-card-head b{color:#67e8f9;font-size:10px}.ms3-card strong{display:block;margin-top:7px;font-size:13px}.ms3-card p{margin:4px 0 0;color:#7f8da4;font-size:8.5px;line-height:1.4}.ms3-secondary{width:100%;min-height:32px;margin-top:8px;border-radius:10px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.045);color:#cbd5e1;cursor:pointer;font-size:9px;font-weight:850}.ms3-secondary:hover{background:rgba(255,255,255,.08);color:#fff}.ms3-mission-nav{display:flex;align-items:center;gap:7px}.ms3-mission-nav button{width:35px;height:35px;border-radius:11px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.045);color:#cbd5e1;cursor:pointer;font-weight:950}.ms3-mission-nav div{flex:1;text-align:center}.ms3-mission-nav small{display:block;color:#64748b;font-size:7px;text-transform:uppercase;letter-spacing:1px;font-weight:850}.ms3-mission-nav b{display:block;margin-top:2px;font-size:14px}.ms3-field-options{display:grid;grid-template-columns:repeat(4,1fr);gap:5px;margin-top:8px}.ms3-field{min-width:0;padding:7px 3px;border-radius:9px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.03);color:#64748b;cursor:pointer;font-size:7px;font-weight:850}.ms3-field.selected{border-color:#67e8f9;color:#fff;background:rgba(8,145,178,.18)}.ms3-daily{display:flex;align-items:center;gap:10px;padding:10px 11px;border-radius:15px;border:1px solid rgba(34,211,238,.17);background:linear-gradient(110deg,rgba(8,47,73,.45),rgba(15,23,42,.58))}.ms3-daily-icon{width:39px;height:39px;border-radius:12px;display:grid;place-items:center;background:rgba(34,211,238,.12);border:1px solid rgba(103,232,249,.2);font-size:18px}.ms3-daily-copy{flex:1;min-width:0}.ms3-daily-copy b{display:block;font-size:11px}.ms3-daily-copy span{display:block;margin-top:2px;color:#94a3b8;font-size:9px}.ms3-daily-reward{color:#fbbf24;font-size:10px;font-weight:900}
.ms3-game{display:grid;grid-template-rows:auto auto minmax(0,1fr) auto;gap:6px;padding:8px}.ms3-top{border:1px solid rgba(255,255,255,.09);border-radius:16px;padding:8px 9px;background:rgba(8,14,31,.8);backdrop-filter:blur(14px);box-shadow:0 8px 26px rgba(0,0,0,.22)}.ms3-top-row{display:flex;align-items:center;gap:7px}.ms3-icon-btn{width:32px;height:32px;flex:0 0 auto;border-radius:10px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.05);color:#cbd5e1;cursor:pointer;display:grid;place-items:center;font-weight:950}.ms3-level{min-width:90px;text-align:left}.ms3-level b{display:block;font-size:11px}.ms3-level span{display:block;margin-top:3px;color:#64748b;font-size:7px;text-transform:uppercase;letter-spacing:.9px;font-weight:850;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ms3-stats{display:flex;flex:1;justify-content:center;min-width:0}.ms3-stat{min-width:51px;padding:0 6px;text-align:center;border-left:1px solid rgba(255,255,255,.06)}.ms3-stat small{display:block;color:#64748b;font-size:6.5px;text-transform:uppercase;letter-spacing:.9px;font-weight:850}.ms3-stat b{display:block;margin-top:2px;font-size:15px;font-variant-numeric:tabular-nums}.ms3-objectives{display:flex;align-items:stretch;gap:5px;width:100%;margin-top:7px}.ms3-objective{flex:1 1 0;min-width:0;padding:5px 6px;border:1px solid rgba(255,255,255,.055);border-radius:9px;background:rgba(255,255,255,.033)}.ms3-objective-line{display:flex;align-items:center;justify-content:space-between;gap:4px;color:#94a3b8;font-size:7px;font-weight:800}.ms3-objective-line b{color:#e2e8f0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ms3-objective-track{height:4px;margin-top:4px;border-radius:4px;background:rgba(255,255,255,.06);overflow:hidden}.ms3-objective-track i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#22d3ee,#2563eb,#8b5cf6);transition:width .3s}
.ms3-signal{display:flex;align-items:center;gap:8px;padding:6px 9px;border:1px solid rgba(34,211,238,.11);border-radius:12px;background:rgba(8,47,73,.22)}.ms3-signal span{font-size:7px;color:#67e8f9;text-transform:uppercase;letter-spacing:1px;font-weight:900}.ms3-signal-track{flex:1;height:7px;border-radius:7px;background:rgba(255,255,255,.07);overflow:hidden}.ms3-signal-track i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#22d3ee,#2563eb,#8b5cf6);box-shadow:0 0 12px rgba(34,211,238,.3);transition:width .3s}.ms3-signal b{min-width:34px;text-align:right;font-size:8px;color:#c4b5fd}
.ms3-content{min-width:0;min-height:0;max-width:100%;overflow:hidden;display:flex;align-items:center;justify-content:center}.ms3-board-shell{position:relative;min-width:0;max-width:100%;max-height:100%;padding:7px;border-radius:20px;border:1px solid rgba(255,255,255,.1);background:linear-gradient(145deg,rgba(24,38,70,.9),rgba(5,9,24,.98));box-shadow:0 28px 70px rgba(0,0,0,.48),0 0 52px rgba(34,211,238,.08),inset 0 1px rgba(255,255,255,.08)}.ms3-board-shell.shake{animation:ms3-shake .42s ease}.ms3-board{display:grid;gap:3px;width:100%;height:100%;position:relative}.ms3-cell{position:relative;min-width:0;min-height:0;border:0;padding:0;border-radius:clamp(3px,1.4cqw,10px);cursor:pointer;overflow:hidden;background:linear-gradient(145deg,rgba(33,48,82,.96),rgba(15,23,42,.98));box-shadow:inset 0 1px rgba(255,255,255,.08),0 2px 5px rgba(0,0,0,.24);color:#e2e8f0;display:grid;place-items:center;font-weight:950;font-size:clamp(8px,2.3cqw,19px);touch-action:none;animation:ms3-cell-in .24s ease both}.ms3-cell:hover:not(.revealed){filter:brightness(1.12);transform:translateY(-1px);z-index:3}.ms3-cell:active:not(.revealed){transform:scale(.97);filter:brightness(1.06)}.ms3-cell.revealed{cursor:default;background:linear-gradient(145deg,rgba(9,20,38,.94),rgba(8,15,30,.98));box-shadow:inset 0 0 0 1px rgba(255,255,255,.025);animation:ms3-reveal .2s ease}.ms3-cell.cursor{outline:2px solid #67e8f9;outline-offset:-2px;z-index:4}.ms3-cell.hint{outline:2px solid #fbbf24;box-shadow:0 0 18px rgba(251,191,36,.45);z-index:5}.ms3-cell.mine-hit{background:radial-gradient(circle,#fb7185,#ef4444 48%,#7f1d1d);animation:ms3-blast .48s ease;box-shadow:0 0 24px rgba(239,68,68,.62)}.ms3-cell.cache{box-shadow:inset 0 0 0 1px rgba(34,211,238,.2),0 0 10px rgba(34,211,238,.12)}.ms3-cell.cache-new{animation:none}.ms3-cell.cache::before{content:"◆";position:absolute;right:7%;top:7%;width:24%;aspect-ratio:1;border-radius:50%;display:grid;place-items:center;background:rgba(8,47,73,.92);border:1px solid rgba(103,232,249,.48);color:#67e8f9;font-size:38%;line-height:1;text-shadow:0 0 7px #22d3ee;z-index:4}.ms3-cell.cache-new::before{animation:ms3-cache .72s ease-in-out 2}.ms3-cell.flagged::after{content:"";width:34%;height:46%;background:linear-gradient(145deg,#fda4af,#ef4444);clip-path:polygon(12% 0,100% 18%,62% 52%,100% 68%,12% 82%);transform:translate(5%,-7%);filter:drop-shadow(0 0 6px rgba(239,68,68,.45));animation:ms3-flag .22s ease}.ms3-cell.flagged::before{content:"";position:absolute;width:5%;height:58%;background:#cbd5e1;left:40%;top:23%;border-radius:3px}.ms3-cell.mine::after{content:"";width:46%;height:46%;border-radius:50%;background:radial-gradient(circle at 33% 27%,#fff 0 5%,#fca5a5 8%,#ef4444 35%,#7f1d1d 74%);box-shadow:0 0 16px rgba(239,68,68,.55)}.ms3-cell.mine::before{content:"✦";position:absolute;color:#fda4af;font-size:74%;z-index:2}.ms3-cell.wrong{background:linear-gradient(145deg,rgba(127,29,29,.9),rgba(69,10,10,.96))}.ms3-cell.n1{color:#38bdf8}.ms3-cell.n2{color:#4ade80}.ms3-cell.n3{color:#fb7185}.ms3-cell.n4{color:#818cf8}.ms3-cell.n5{color:#f97316}.ms3-cell.n6{color:#2dd4bf}.ms3-cell.n7{color:#e879f9}.ms3-cell.n8{color:#cbd5e1}.ms3-cell.scanned::after{content:"";position:absolute;inset:10%;border-radius:50%;border:1px solid rgba(103,232,249,.7);animation:ms3-pulse .7s ease-in-out 2}
.ms3-float{position:absolute;z-index:20;left:50%;top:50%;pointer-events:none;color:#67e8f9;font-size:18px;font-weight:950;text-shadow:0 0 15px rgba(34,211,238,.65);animation:ms3-float .78s ease forwards}.ms3-bottom{display:grid;grid-template-columns:minmax(0,1.35fr) repeat(3,minmax(0,1fr));gap:6px}.ms3-charge{padding:8px;border-radius:13px;border:1px solid rgba(34,211,238,.13);background:rgba(8,47,73,.24)}.ms3-charge-line{display:flex;justify-content:space-between;gap:6px;color:#67e8f9;font-size:7px;text-transform:uppercase;letter-spacing:.9px;font-weight:900}.ms3-charge-track{height:6px;margin-top:6px;border-radius:6px;background:rgba(255,255,255,.07);overflow:hidden}.ms3-charge-track i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#22d3ee,#2563eb,#8b5cf6);transition:width .3s}.ms3-tool{min-width:0;padding:7px 4px;border-radius:13px;border:1px solid rgba(255,255,255,.08);background:rgba(15,23,42,.64);color:#94a3b8;cursor:pointer;text-align:center}.ms3-tool:not(:disabled):hover{border-color:rgba(103,232,249,.42);color:#fff}.ms3-tool:disabled{opacity:.42;cursor:not-allowed}.ms3-tool b{display:block;color:#e2e8f0;font-size:8px}.ms3-tool span{display:block;margin-top:3px;font-size:6.5px}.ms3-tool.active{border-color:#fbbf24;color:#fbbf24}.ms3-input-mode{display:none;grid-column:1/-1;grid-template-columns:1fr 1fr;gap:5px}.ms3-input-mode button{min-height:36px;border-radius:11px;border:1px solid rgba(255,255,255,.09);background:rgba(15,23,42,.65);color:#94a3b8;font-size:9px;font-weight:900}.ms3-input-mode button.active{border-color:#67e8f9;color:#fff;background:rgba(8,145,178,.2)}
.ms3-side{display:none}.ms3-side-card{padding:14px;border-radius:17px;border:1px solid rgba(255,255,255,.08);background:rgba(15,23,42,.62)}.ms3-side-card small{display:block;color:#64748b;font-size:8px;text-transform:uppercase;letter-spacing:1.1px;font-weight:900}.ms3-side-card b{display:block;margin-top:4px;font-size:17px}.ms3-side-card p{margin:6px 0 0;color:#8492a7;font-size:9px;line-height:1.45}.ms3-overlay{position:absolute;inset:0;z-index:1400;display:grid;place-items:center;padding:14px;background:rgba(2,6,23,.76);backdrop-filter:blur(14px)}.ms3-modal{width:min(430px,100%);max-height:calc(100% - 8px);overflow:auto;padding:20px;border-radius:23px;border:1px solid rgba(255,255,255,.12);background:linear-gradient(160deg,rgba(21,34,62,.98),rgba(7,11,26,.98));box-shadow:0 30px 90px rgba(0,0,0,.65),inset 0 1px rgba(255,255,255,.08)}.ms3-modal-icon{width:58px;height:58px;margin:0 auto 10px;border-radius:18px;display:grid;place-items:center;font-size:28px;background:linear-gradient(145deg,#22d3ee,#2563eb,#8b5cf6);box-shadow:0 15px 38px rgba(37,99,235,.3)}.ms3-modal h2{text-align:center;margin:0;font-size:24px;letter-spacing:-.5px}.ms3-modal>p{text-align:center;margin:7px auto 0;color:#94a3b8;font-size:10px;line-height:1.5;max-width:350px}.ms3-stars{text-align:center;margin:13px 0 8px;color:#fbbf24;font-size:30px;letter-spacing:5px;text-shadow:0 0 18px rgba(251,191,36,.45)}.ms3-rating{text-align:center;color:#64748b;font-size:9px}.ms3-rating b{color:#fff;font-size:20px;margin-right:3px}.ms3-breakdown{display:grid;grid-template-columns:repeat(5,1fr);gap:5px;margin:11px 0}.ms3-breakdown div{padding:8px 3px;border-radius:10px;border:1px solid rgba(255,255,255,.06);background:rgba(255,255,255,.035);text-align:center}.ms3-breakdown small{display:block;color:#64748b;font-size:6px;text-transform:uppercase;letter-spacing:.7px;font-weight:850}.ms3-breakdown b{display:block;margin-top:3px;font-size:12px}.ms3-actions{display:flex;gap:8px;margin-top:14px}.ms3-actions button{flex:1;min-height:42px;border-radius:13px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.05);color:#cbd5e1;cursor:pointer;font-weight:900;font-size:10px}.ms3-actions button.primary{background:linear-gradient(115deg,#22d3ee,#2563eb,#8b5cf6);color:#fff}.ms3-help{text-align:left!important}.ms3-help h3{margin:13px 0 4px;color:#67e8f9;font-size:10px;text-transform:uppercase;letter-spacing:1px}.ms3-help p,.ms3-help li{color:#cbd5e1;font-size:9px;line-height:1.55}.ms3-help ul{padding-left:18px;margin:4px 0}.ms3-paused{display:none;position:absolute;inset:0;z-index:1100;place-items:center;background:rgba(2,6,23,.68);backdrop-filter:blur(8px);font-size:20px;font-weight:950;text-transform:uppercase;letter-spacing:2px}.ms3-root.is-paused .ms3-paused{display:grid}
@container minefield (max-width:430px){.ms3-menu{padding:13px;gap:9px}.ms3-logo-mark{width:43px;height:43px}.ms3-title{font-size:21px}.ms3-profile-chip{min-width:47px;padding:6px}.ms3-hero{padding:13px}.ms3-mission-name{font-size:21px}.ms3-mission-copy{max-width:250px}.ms3-orb{width:57px;height:57px;font-size:20px}.ms3-menu-grid{grid-template-columns:1fr}.ms3-field-options{grid-template-columns:repeat(2,1fr)}.ms3-game{padding:5px;padding-bottom:max(57px,env(safe-area-inset-bottom));gap:4px;grid-template-rows:auto auto auto auto;align-content:start}.ms3-top{padding:6px}.ms3-level{min-width:66px}.ms3-stat{min-width:41px;padding:0 4px}.ms3-stat b{font-size:13px}.ms3-objectives{gap:3px}.ms3-objective{padding:4px}.ms3-content{align-items:flex-start;padding-top:2px}.ms3-board-shell{padding:5px;border-radius:17px}.ms3-board{gap:2px}.ms3-bottom{grid-template-columns:1.2fr repeat(3,1fr);gap:4px}.ms3-charge{padding:6px}.ms3-tool{padding:6px 2px}.ms3-input-mode{display:grid}.ms3-breakdown{grid-template-columns:repeat(3,1fr)}}
@container minefield (min-width:760px) and (max-width:1119px) and (min-height:620px){.ms3-menu{display:grid;grid-template-columns:minmax(0,720px);grid-template-rows:auto auto auto auto;justify-content:center;align-content:start;gap:14px;padding:24px}.ms3-brand,.ms3-hero,.ms3-menu-side,.ms3-daily{grid-column:1}.ms3-hero{padding:22px}.ms3-radar-preview{display:block;min-height:190px}.ms3-menu-grid{grid-template-columns:1fr 1fr}.ms3-game{grid-template-columns:minmax(0,1fr) 190px;grid-template-rows:auto auto minmax(0,1fr);grid-template-areas:"top top" "signal signal" "board right";gap:10px;padding:12px 16px}.ms3-top{grid-area:top}.ms3-signal{grid-area:signal}.ms3-content{grid-area:board}.ms3-bottom{grid-area:right;display:flex;flex-direction:column;justify-content:center;align-self:stretch}.ms3-charge{padding:11px}.ms3-tool{min-height:64px;display:grid;place-items:center}.ms3-input-mode{display:none}.ms3-side{display:none}.ms3-board-shell{max-width:100%;max-height:calc(100cqh - 155px)}}
@container minefield (min-width:1120px) and (min-height:650px){.ms3-menu{display:grid;grid-template-columns:minmax(430px,650px) minmax(330px,430px);grid-template-rows:auto 1fr auto;justify-content:center;align-content:center;column-gap:22px;padding:28px 38px}.ms3-brand{grid-column:1/-1}.ms3-hero{grid-column:1;grid-row:2;padding:24px;display:flex;flex-direction:column;justify-content:center}.ms3-mission-name{font-size:38px}.ms3-mission-copy{font-size:13px;max-width:430px}.ms3-orb{width:92px;height:92px;font-size:32px}.ms3-radar-preview{display:block;flex:1;min-height:220px}.ms3-primary{min-height:56px}.ms3-menu-side{grid-column:2;grid-row:2;justify-content:center}.ms3-menu-grid{grid-template-columns:1fr}.ms3-daily{grid-column:1/-1}.ms3-game{grid-template-columns:190px minmax(0,680px) 180px;grid-template-rows:auto minmax(0,1fr);grid-template-areas:"top top top" "left board right";justify-content:center;align-content:center;gap:12px;padding:14px 18px}.ms3-top{grid-area:top;max-width:1090px;width:100%;justify-self:center}.ms3-signal{display:none}.ms3-content{grid-area:board}.ms3-board-shell{max-width:680px;max-height:calc(100cqh - 145px)}.ms3-bottom{grid-area:right;display:flex;flex-direction:column;align-self:center}.ms3-charge{padding:12px}.ms3-tool{min-height:64px;display:grid;place-items:center}.ms3-tool b{font-size:10px}.ms3-tool span{font-size:8px}.ms3-input-mode{display:none}.ms3-side{display:flex;grid-area:left;align-self:center;flex-direction:column;gap:9px}.ms3-side .ms3-signal{display:flex}.ms3-objectives{gap:6px}}
`;
  document.head.appendChild(style);
}

export { BoardCore, buildMission, calculateRating, createSeededRandom };

export default function activate(host) {
  ensureStyles();
  if (!host.runtime || host.runtime.api !== 1 || host.runtime.kind !== 'game') {
    throw new Error('Minesweeper Odyssey requires tend.host Extension Runtime API 1 as a game.');
  }

  const arcade = createArcade(host, {
    id: 'deep-signal',
    name: 'Minesweeper Odyssey',
    icon: '◉',
    subtitle: 'Logic-first expeditions, signal tools, mastery ratings, and daily contracts',
    modes: [
      { id: 'expedition', name: 'Expedition', icon: '◉', desc: 'Sixty no-guess campaign missions', unlock: 1 },
      { id: 'classic', name: 'Classic', icon: '▦', desc: 'Traditional customizable fields', unlock: 1 },
      { id: 'deep', name: 'Deep Field', icon: '▼', desc: 'Escalating one-life survival waves', unlock: 5 },
    ],
    perks: [
      { id: 'shield', name: 'Defuse Shield', icon: '⬡', desc: 'Survive one mine, but lose precision credit', unlock: 1 },
      { id: 'scanner', name: 'Pulse Scanner', icon: '◉', desc: 'Begin with 35 signal charge and cheaper sonar', unlock: 3 },
      { id: 'chain', name: 'Chain Reactor', icon: '⌁', desc: 'Logic chords earn extra score and charge', unlock: 5 },
    ],
    missions: [
      { event: 'cell', target: 260, title: 'Field Survey', detail: 'Reveal 260 safe cells', icon: '▦', reward: 85 },
      { event: 'cache', target: 12, title: 'Data Recovery', detail: 'Recover 12 hidden caches', icon: '◆', reward: 105 },
      { event: 'chord', target: 18, title: 'Chain Analyst', detail: 'Trigger 18 logic chords', icon: '⌁', reward: 115 },
      { event: 'win', target: 4, title: 'Signal Specialist', detail: 'Clear four fields', icon: '🏆', reward: 130 },
    ],
  });

  const profile = structuredClone(DEFAULT_PROFILE);
  const runtime = host.runtime;
  let root = null;
  let container = null;
  let board = null;
  let config = null;
  let modeId = 'expedition';
  let perkId = 'shield';
  let screenToken = 0;
  let secondTimer = null;
  let cursor = { r: 0, c: 0 };
  let cursorVisible = false;
  let replayNonce = 0;
  let inputMode = 'reveal';
  let selectedSweep = false;
  let hintTimer = null;
  let audio = null;
  let removePause = null;
  let removeResume = null;
  let removeChange = null;
  let keyHandler = null;
  let touchState = null;
  let resizeHandler = null;
  const pending = new Set();
  const run = {
    seconds: 0,
    score: 0,
    charge: 0,
    streak: 0,
    bestStreak: 0,
    revealed: 0,
    flags: 0,
    correctFlags: 0,
    caches: 0,
    chords: 0,
    hints: 0,
    scans: 0,
    defuses: 0,
    mineHits: 0,
    misflags: 0,
    shieldUsed: false,
    started: false,
    completed: false,
    failed: false,
    generationLogical: true,
  };

  const setTimer = (fn, delay) => {
    const token = screenToken;
    let id;
    id = runtime.timers.setTimeout(() => {
      pending.delete(id);
      if (token === screenToken) fn();
    }, delay);
    pending.add(id);
    return id;
  };
  const clearTimer = (id) => {
    runtime.timers.clearTimeout(id);
    pending.delete(id);
  };
  const clearPending = () => {
    for (const id of [...pending]) clearTimer(id);
    pending.clear();
    if (hintTimer != null) { clearTimer(hintTimer); hintTimer = null; }
  };
  const stopClock = () => {
    if (secondTimer != null) runtime.timers.clearInterval(secondTimer);
    secondTimer = null;
  };
  const advanceScreen = () => {
    screenToken++;
    stopClock();
    clearPending();
    arcade.stopPressure();
    selectedSweep = false;
  };

  function initAudio() {
    if (audio) return audio;
    try { audio = new (window.AudioContext || window.webkitAudioContext)(); }
    catch { audio = null; }
    return audio;
  }
  function tone(freq, duration = .08, type = 'sine', volume = .05, delay = 0) {
    const ctx = initAudio();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    const start = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(volume, start);
    gain.gain.exponentialRampToValueAtTime(.001, start + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + duration);
  }
  const sfx = {
    tap: () => tone(620, .035, 'sine', .025),
    reveal: (count = 1) => { tone(360 + Math.min(8, count) * 24, .055, 'triangle', .035); },
    flag: () => { tone(760, .06, 'square', .035); tone(1040, .05, 'sine', .025, .045); },
    chord: () => { tone(480, .07, 'triangle', .045); tone(720, .08, 'sine', .04, .05); tone(960, .08, 'sine', .03, .1); },
    cache: () => { [660, 880, 1180].forEach((f, i) => tone(f, .1, 'sine', .05, i * .055)); },
    blast: () => { tone(110, .26, 'sawtooth', .1); tone(64, .38, 'sawtooth', .07, .08); },
    win: () => { [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, .16, 'sine', .08, i * .075)); },
    tool: () => { [520, 780, 1040].forEach((f, i) => tone(f, .1, 'triangle', .045, i * .045)); },
  };

  async function loadProfile() {
    try {
      const saved = await host.storage.get(PROFILE_KEY);
      if (saved && typeof saved === 'object') Object.assign(profile, saved);
    } catch { /* use defaults */ }
    try {
      const legacy = await host.storage.get(LEGACY_BEST_KEY);
      if (legacy && typeof legacy === 'object') profile.bestTimes = { ...legacy, ...profile.bestTimes };
    } catch { /* optional */ }
    try {
      const contract = await host.storage.get(LEGACY_CONTRACT_KEY);
      if (Number.isFinite(contract)) {
        profile.mission = Math.max(profile.mission, Math.min(MAX_MISSION, contract));
        profile.bestMission = Math.max(profile.bestMission, Math.min(MAX_MISSION, contract));
      }
    } catch { /* optional */ }
    profile.mission = clamp(Number(profile.mission) || 1, 1, MAX_MISSION);
    profile.bestMission = clamp(Number(profile.bestMission) || 1, 1, MAX_MISSION);
    if (!profile.missionStars || typeof profile.missionStars !== 'object') profile.missionStars = {};
    if (!CLASSIC_FIELDS[profile.classicField]) profile.classicField = 'scout';
  }

  function saveProfile() {
    host.storage.set(PROFILE_KEY, profile).catch(() => {});
  }

  function totalStars() {
    return Object.values(profile.missionStars).reduce((sum, value) => sum + (Number(value) || 0), 0);
  }

  function currentConfig() {
    modeId = arcade.mode().id;
    perkId = arcade.perk().id;
    if (modeId === 'classic') {
      const field = CLASSIC_FIELDS[profile.classicField];
      return {
        ...buildMission(1, 'classic'),
        title: `${field.name} Signal Field`,
        subtitle: `${field.desc}. Safe first reveal, traditional mine density.`,
        rows: field.rows,
        cols: field.cols,
        mines: field.mines,
        par: field.par,
        cacheCount: 0,
        objectives: [{ type: 'clear', target: field.rows * field.cols - field.mines, label: 'Clear field', icon: '▦' }],
      };
    }
    if (modeId === 'deep') return buildMission(profile.deepWave, 'deep');
    return buildMission(profile.mission, 'expedition');
  }

  function objectiveProgress(objective) {
    if (objective.type === 'clear') return run.revealed;
    if (objective.type === 'cache') return run.caches;
    if (objective.type === 'chord') return run.chords;
    if (objective.type === 'flag') return run.correctFlags;
    return 0;
  }

  function objectivePreview(objective) {
    return `<span class="ms3-pill"><i>${objective.icon}</i>${objective.label} ${objective.target}</span>`;
  }

  function renderMenu() {
    advanceScreen();
    config = currentConfig();
    root.innerHTML = '';
    const stars = modeId === 'expedition' ? Number(profile.missionStars[profile.mission] || 0) : 0;
    const mode = arcade.mode();
    const perk = arcade.perk();
    const daily = arcade.profile.daily || { icon: '◆', title: 'Daily signal', detail: 'Complete today’s field task', reward: 80, claimed: false };
    const screen = document.createElement('div');
    screen.className = 'ms3-screen ms3-menu';
    screen.innerHTML = `
      <div class="ms3-brand">
        <div class="ms3-logo"><div class="ms3-logo-mark"></div><div><div class="ms3-title">Minesweeper</div><div class="ms3-kicker">Deep Signal Odyssey</div></div></div>
        <div class="ms3-profile"><div class="ms3-profile-chip"><small>Rank</small><b>${arcade.profile.rank}</b></div><div class="ms3-profile-chip"><small>Stars</small><b style="color:#fbbf24">★ ${totalStars()}</b></div></div>
      </div>
      <section class="ms3-hero">
        <div class="ms3-mission-row"><div><div class="ms3-sector-tag">${mode.name} · ${config.sector.tag}</div><div class="ms3-mission-name">${config.title}</div><div class="ms3-mission-copy">${config.subtitle}</div></div><div class="ms3-orb">${modeId === 'expedition' ? profile.mission : mode.icon}</div></div>
        <div class="ms3-objective-preview">${config.objectives.map(objectivePreview).join('')}</div>
        ${stars ? `<div class="ms3-stars" style="text-align:left;font-size:18px;margin:12px 0 0">${'★'.repeat(stars)}<span style="opacity:.18">${'★'.repeat(5 - stars)}</span></div>` : ''}
        <div class="ms3-radar-preview"><div class="ms3-sweep"></div><i class="ms3-node a"></i><i class="ms3-node mine b"></i><i class="ms3-node c"></i><i class="ms3-node mine d"></i><i class="ms3-node e"></i></div>
        <button class="ms3-primary" data-action="play">${modeId === 'expedition' ? `Play mission ${profile.mission}` : modeId === 'deep' ? `Enter wave ${profile.deepWave}` : `Start ${CLASSIC_FIELDS[profile.classicField].name}`}</button>
      </section>
      <div class="ms3-menu-side">
        <div class="ms3-menu-grid">
          <div class="ms3-card"><div class="ms3-card-head"><span>Game mode</span><b>${mode.icon}</b></div><strong>${mode.name}</strong><p>${mode.desc}</p><button class="ms3-secondary" data-action="hub">Modes & perks</button></div>
          <div class="ms3-card"><div class="ms3-card-head"><span>Active perk</span><b>${perk.icon}</b></div><strong>${perk.name}</strong><p>${perk.desc}</p><button class="ms3-secondary" data-action="hub">Change loadout</button></div>
        </div>
        ${modeId === 'expedition' ? `<div class="ms3-card"><div class="ms3-card-head"><span>Expedition navigator</span><b>${profile.bestMission}/${MAX_MISSION}</b></div><div class="ms3-mission-nav"><button data-action="previous" aria-label="Previous mission">‹</button><div><small>Selected mission</small><b>${profile.mission}</b></div><button data-action="next" aria-label="Next mission">›</button></div></div>` : ''}
        ${modeId === 'classic' ? `<div class="ms3-card"><div class="ms3-card-head"><span>Classic field</span><b>${CLASSIC_FIELDS[profile.classicField].icon}</b></div><div class="ms3-field-options">${Object.values(CLASSIC_FIELDS).map((field) => `<button class="ms3-field ${field.id === profile.classicField ? 'selected' : ''}" data-field="${field.id}">${field.name}</button>`).join('')}</div></div>` : ''}
      </div>
      <div class="ms3-daily"><div class="ms3-daily-icon">${daily.icon}</div><div class="ms3-daily-copy"><b>${daily.title}</b><span>${daily.detail}</span></div><div class="ms3-daily-reward">${daily.claimed ? '✓' : `◆ ${daily.reward}`}</div></div>`;
    root.appendChild(screen);
    screen.querySelector('[data-action="play"]').addEventListener('click', startGame);
    screen.querySelectorAll('[data-action="hub"]').forEach((button) => button.addEventListener('click', arcade.openHub));
    screen.querySelector('[data-action="previous"]')?.addEventListener('click', () => {
      profile.mission = Math.max(1, profile.mission - 1);
      saveProfile();
      sfx.tap();
      renderMenu();
    });
    screen.querySelector('[data-action="next"]')?.addEventListener('click', () => {
      profile.mission = Math.min(profile.bestMission, profile.mission + 1);
      saveProfile();
      sfx.tap();
      renderMenu();
    });
    screen.querySelectorAll('[data-field]').forEach((button) => button.addEventListener('click', () => {
      profile.classicField = button.dataset.field;
      saveProfile();
      sfx.tap();
      renderMenu();
    }));
  }

  function resetRun() {
    Object.assign(run, {
      seconds: 0,
      score: 0,
      charge: perkId === 'scanner' ? 35 : 0,
      streak: 0,
      bestStreak: 0,
      revealed: 0,
      flags: 0,
      correctFlags: 0,
      caches: 0,
      chords: 0,
      hints: 0,
      scans: 0,
      defuses: 0,
      mineHits: 0,
      misflags: 0,
      shieldUsed: false,
      started: false,
      completed: false,
      failed: false,
      generationLogical: true,
    });
  }

  function startGame() {
    advanceScreen();
    config = currentConfig();
    replayNonce = (replayNonce + 1) >>> 0;
    const entropy = (Date.now() ^ Math.floor(Math.random() * 0x7fffffff) ^ Math.imul(replayNonce || 1, 0x9e3779b1)) >>> 0;
    const baseSeed = modeId === 'expedition'
      ? Math.imul(config.mission, 104729) + 73013
      : modeId === 'deep'
        ? Math.imul(profile.deepWave, 65537) + 41047
        : Math.imul(config.rows * config.cols + config.mines, 8191);
    const seed = (baseSeed ^ entropy) >>> 0;
    board = new BoardCore(config.rows, config.cols, config.mines, createSeededRandom(seed));
    resetRun();
    cursor = { r: 0, c: 0 };
    cursorVisible = false;
    inputMode = 'reveal';
    root.innerHTML = '';
    const screen = document.createElement('div');
    screen.className = 'ms3-screen ms3-game';
    screen.innerHTML = `
      <div class="ms3-top">
        <div class="ms3-top-row"><button class="ms3-icon-btn" data-action="menu" aria-label="Return to menu">‹</button><div class="ms3-level"><b>${modeId === 'expedition' ? `Mission ${config.mission}` : config.title}</b><span>${config.sector.name}</span></div><div class="ms3-stats"><div class="ms3-stat"><small>Score</small><b id="ms3-score">0</b></div><div class="ms3-stat"><small>Time</small><b id="ms3-time" style="color:#fbbf24">0:00</b></div><div class="ms3-stat"><small>Streak</small><b id="ms3-streak" style="color:#c084fc">0</b></div></div><button class="ms3-icon-btn" data-action="hint" aria-label="Logic hint">✧</button><button class="ms3-icon-btn" data-action="help" aria-label="How to play">?</button></div>
        <div class="ms3-objectives" id="ms3-objectives"></div>
      </div>
      <div class="ms3-signal"><span>Signal charge</span><div class="ms3-signal-track"><i id="ms3-signal-fill" style="width:${run.charge}%"></i></div><b id="ms3-signal-value">${run.charge}%</b></div>
      <div class="ms3-side">
        <div class="ms3-side-card"><small>Field</small><b>${config.cols} × ${config.rows}</b><p>${config.mines} hidden signals. The opening zone is always safe.</p></div>
        <div class="ms3-side-card"><small>Mission par</small><b>${formatTime(config.par)}</b><p>Five stars require a clean clear substantially under par.</p></div>
        <div class="ms3-side-card"><small>Logic status</small><b id="ms3-logic">Calibrating</b><p>Expedition fields are regenerated until deduction rules can solve them.</p></div>
        <div class="ms3-signal"><span>Signal charge</span><div class="ms3-signal-track"><i id="ms3-side-signal" style="width:${run.charge}%"></i></div><b id="ms3-side-value">${run.charge}%</b></div>
      </div>
      <div class="ms3-content"><div class="ms3-board-shell" id="ms3-shell"><div class="ms3-board" id="ms3-board" role="grid" aria-label="Minesweeper signal field"></div></div></div>
      <div class="ms3-bottom">
        <div class="ms3-charge"><div class="ms3-charge-line"><span>Signal charge</span><b id="ms3-charge-text">${run.charge}%</b></div><div class="ms3-charge-track"><i id="ms3-charge-fill" style="width:${run.charge}%"></i></div></div>
        <button class="ms3-tool" data-tool="sonar"><b>◉ Sonar</b><span>${perkId === 'scanner' ? 25 : 35} charge</span></button>
        <button class="ms3-tool" data-tool="defuse"><b>⬡ Defuse</b><span>60 charge</span></button>
        <button class="ms3-tool" data-tool="sweep"><b>✦ Sweep</b><span>100 charge</span></button>
        <div class="ms3-input-mode"><button class="active" data-input="reveal">Reveal</button><button data-input="flag">Flag</button></div>
      </div>
      <div class="ms3-paused">Signal paused</div>`;
    root.appendChild(screen);
    fitBoard();
    renderBoard(true);
    updateUi();
    screen.querySelector('[data-action="menu"]').addEventListener('click', renderMenu);
    screen.querySelector('[data-action="help"]').addEventListener('click', showHelp);
    screen.querySelector('[data-action="hint"]').addEventListener('click', useHint);
    screen.querySelectorAll('[data-tool]').forEach((button) => button.addEventListener('click', () => useTool(button.dataset.tool)));
    screen.querySelectorAll('[data-input]').forEach((button) => button.addEventListener('click', () => {
      inputMode = button.dataset.input;
      screen.querySelectorAll('[data-input]').forEach((item) => item.classList.toggle('active', item.dataset.input === inputMode));
      sfx.tap();
    }));
    bindKeyboard();
    requestAnimationFrame(() => fitBoard());
    setTimer(() => fitBoard(), 120);
  }

  function fitBoard() {
    if (!root || !board) return;
    const content = root.querySelector('.ms3-content');
    const shell = root.querySelector('#ms3-shell');
    if (!content || !shell) return;
    const rect = content.getBoundingClientRect();
    const rootWidth = Math.max(1, root.clientWidth);
    const rootHeight = Math.max(1, root.clientHeight);
    const ratio = config.cols / config.rows;
    const portrait = rootWidth <= 430;
    const availableWidth = portrait
      ? Math.max(210, rootWidth - 10)
      : Math.max(210, Math.min(rect.width || rootWidth, rootWidth - 10));
    const availableHeight = portrait
      ? Math.max(180, rootHeight - 250)
      : Math.max(180, Math.min(rect.height || rootHeight, rootHeight - 145));
    let width = availableWidth;
    let height = width / ratio;
    if (height > availableHeight) {
      height = availableHeight;
      width = height * ratio;
    }
    shell.style.width = `${Math.max(210, Math.floor(width))}px`;
    shell.style.height = `${Math.max(180, Math.floor(height))}px`;
  }

  function beginRun(firstR, firstC) {
    if (run.started) return;
    run.started = true;
    const generation = board.generate(firstR, firstC, { cacheCount: config.cacheCount, noGuess: config.noGuess });
    run.generationLogical = generation.logical;
    const logic = root.querySelector('#ms3-logic');
    if (logic) {
      logic.textContent = generation.logical ? 'No-guess verified' : 'Classic fallback';
      logic.style.color = generation.logical ? '#67e8f9' : '#fbbf24';
    }
    secondTimer = runtime.timers.setInterval(() => {
      if (run.completed || run.failed) return;
      run.seconds++;
      updateUi();
    }, 1000);
    if (modeId === 'deep') {
      arcade.startPressure({
        enabled: true,
        grace: Math.max(3800, 7600 - profile.deepWave * 90),
        countdown: 3500,
        onExpire: () => {
          run.seconds += 8;
          run.streak = 0;
          arcade.showToast('⚡', 'Signal interference', 'Eight seconds added and the logic streak was reset.');
          updateUi();
        },
      });
    }
  }

  function manualReveal(r, c, fromChord = false) {
    if (run.completed || run.failed) return;
    const cell = board.cells[r]?.[c];
    if (!cell || cell.revealed || cell.flagged) return;
    beginRun(r, c);
    const result = board.reveal(r, c);
    if (result.mine) {
      handleMine(r, c);
      return;
    }
    if (!result.opened.length) return;
    run.revealed += result.opened.length;
    run.caches += result.caches;
    run.streak += 1 + (fromChord ? 1 : 0);
    run.bestStreak = Math.max(run.bestStreak, run.streak);
    const chainBonus = perkId === 'chain' && fromChord ? 1.45 : 1;
    run.score += Math.round((result.opened.length * 12 + Math.max(0, result.opened.length - 1) * 3) * (1 + Math.min(1.5, run.streak * .04)) * chainBonus);
    run.charge = clamp(run.charge + Math.min(16, 3 + result.opened.length * .65 + (fromChord ? 7 : 0)), 0, 100);
    arcade.record('cell', result.opened.length);
    if (result.caches) {
      arcade.record('cache', result.caches);
      profile.totalCaches += result.caches;
      saveProfile();
      sfx.cache();
      arcade.showToast('◆', 'Data cache recovered', `${run.caches}/${config.cacheCount || run.caches} recovered`);
    } else sfx.reveal(result.opened.length);
    arcade.resetPressure();
    renderBoard();
    updateUi();
    checkCompletion();
  }

  function handleMine(r, c) {
    run.mineHits++;
    run.streak = 0;
    if (perkId === 'shield' && !run.shieldUsed) {
      run.shieldUsed = true;
      run.defuses++;
      const cell = board.cells[r][c];
      cell.revealed = false;
      cell.exploded = false;
      cell.flagged = true;
      run.flags++;
      run.correctFlags++;
      sfx.tool();
      arcade.showToast('⬡', 'Defuse shield', 'The signal was contained. Precision credit was reduced.');
      renderBoard();
      updateUi();
      return;
    }
    run.failed = true;
    stopClock();
    arcade.stopPressure();
    board.revealMines();
    sfx.blast();
    arcade.record('fail', 1);
    arcade.showToast('✹', 'Signal detonated', 'Field analysis complete. Choose Try again or return to the menu.');
    setTimer(() => showResults(false), 720);
    renderBoard();
    root.querySelector('#ms3-shell')?.classList.add('shake');
  }

  function toggleFlag(r, c) {
    if (run.completed || run.failed) return;
    const cell = board.cells[r]?.[c];
    if (!cell || cell.revealed) return;
    if (!run.started) { arcade.showToast('⚑', 'Calibrate the field first', 'Reveal one cell before placing flags.'); return; }
    const before = cell.flagged;
    board.toggleFlag(r, c);
    if (!before && cell.flagged) {
      run.flags++;
      run.streak++;
      run.score += 8;
      if (!cell.mine) run.misflags++;
    } else if (before && !cell.flagged) {
      run.flags = Math.max(0, run.flags - 1);
      run.streak = Math.max(0, run.streak - 1);
    }
    const counts = board.counts();
    run.correctFlags = counts.correctFlags;
    run.bestStreak = Math.max(run.bestStreak, run.streak);
    sfx.flag();
    arcade.resetPressure();
    renderBoard();
    updateUi();
  }

  function doChord(r, c) {
    if (run.completed || run.failed || !run.started) return;
    const result = board.chord(r, c);
    if (!result.opened.length) return;
    run.chords++;
    arcade.record('chord', 1);
    if (result.mine) {
      renderBoard();
      handleMine(result.hit.r, result.hit.c);
      return;
    }
    run.revealed += result.opened.length;
    run.caches += result.caches;
    run.streak += 2;
    run.bestStreak = Math.max(run.bestStreak, run.streak);
    run.score += Math.round((result.opened.length * 17 + 60) * (perkId === 'chain' ? 1.5 : 1));
    run.charge = clamp(run.charge + 10 + result.opened.length * .8 + (perkId === 'chain' ? 8 : 0), 0, 100);
    arcade.record('cell', result.opened.length);
    if (result.caches) {
      arcade.record('cache', result.caches);
      profile.totalCaches += result.caches;
      saveProfile();
      sfx.cache();
    } else sfx.chord();
    arcade.resetPressure();
    renderBoard();
    updateUi();
    showFloat(`CHAIN +${result.opened.length}`);
    checkCompletion();
  }

  function useHint() {
    if (!run.started || run.completed || run.failed) {
      arcade.showToast('✧', 'Start the field first', 'Reveal one cell before requesting a logic hint.');
      return;
    }
    const move = board.findDeterministicMove();
    if (!move) {
      arcade.showToast('✧', 'No immediate deduction', 'Use Sonar for a guaranteed safe reveal.');
      return;
    }
    run.hints++;
    const cell = root.querySelector(`.ms3-cell[data-r="${move.r}"][data-c="${move.c}"]`);
    if (cell) {
      cell.classList.add('hint');
      if (hintTimer != null) clearTimer(hintTimer);
      hintTimer = setTimer(() => cell.classList.remove('hint'), 1600);
    }
    arcade.showToast('✧', move.type === 'safe' ? 'Safe deduction' : 'Certain signal', move.type === 'safe' ? 'This cell can be revealed logically.' : 'This cell can be flagged logically.');
  }

  function useTool(tool) {
    if (!run.started || run.completed || run.failed) {
      arcade.showToast('◉', 'Field not active', 'Reveal one cell before using signal tools.');
      return;
    }
    if (tool === 'sonar') {
      const cost = perkId === 'scanner' ? 25 : 35;
      if (run.charge < cost) return arcade.showToast('◉', 'Not enough signal', `${cost} charge is required.`);
      const move = board.findDeterministicMove();
      const pick = move?.type === 'safe' ? { r: move.r, c: move.c } : board.randomSafeHidden();
      if (!pick) return;
      run.charge -= cost;
      run.scans++;
      board.cells[pick.r][pick.c].scanned = true;
      sfx.tool();
      manualReveal(pick.r, pick.c);
      return;
    }
    if (tool === 'defuse') {
      if (run.charge < 60) return arcade.showToast('⬡', 'Not enough signal', '60 charge is required.');
      const mine = board.randomHiddenMine();
      if (!mine) return;
      run.charge -= 60;
      run.defuses++;
      board.cells[mine.r][mine.c].flagged = true;
      run.flags++;
      run.correctFlags++;
      sfx.tool();
      arcade.showToast('⬡', 'Signal defused', 'One hidden mine was safely confirmed.');
      renderBoard();
      updateUi();
      return;
    }
    if (tool === 'sweep') {
      if (run.charge < 100) return arcade.showToast('✦', 'Not enough signal', 'Full charge is required.');
      selectedSweep = !selectedSweep;
      root.querySelector('[data-tool="sweep"]')?.classList.toggle('active', selectedSweep);
      arcade.showToast('✦', selectedSweep ? 'Sweep armed' : 'Sweep cancelled', selectedSweep ? 'Choose a revealed clue to scan its surrounding area.' : 'No charge was spent.');
    }
  }

  function applySweep(r, c) {
    const cell = board.cells[r]?.[c];
    if (!selectedSweep || !cell?.revealed || cell.mine) return false;
    selectedSweep = false;
    run.charge = 0;
    run.scans++;
    const result = board.sweepArea(r, c);
    run.revealed += result.opened.length;
    run.caches += result.caches;
    run.score += result.opened.length * 10;
    if (result.caches) {
      arcade.record('cache', result.caches);
      profile.totalCaches += result.caches;
      saveProfile();
    }
    sfx.tool();
    renderBoard();
    updateUi();
    showFloat(`SWEEP +${result.opened.length}`);
    checkCompletion();
    return true;
  }

  function checkCompletion() {
    if (!board.complete() || run.completed || run.failed) return;
    run.completed = true;
    stopClock();
    arcade.stopPressure();
    const counts = board.counts();
    run.correctFlags = counts.correctFlags;
    for (let r = 0; r < config.rows; r++) for (let c = 0; c < config.cols; c++) {
      const cell = board.cells[r][c];
      if (cell.mine && !cell.flagged) cell.flagged = true;
    }
    const rating = calculateRating(run, config, true);
    run.score += rating.total * 25;
    arcade.record('win', 1);
    arcade.record('score', run.score);
    if (run.mineHits === 0 && run.misflags === 0 && run.scans === 0 && run.hints === 0) {
      profile.flawlessWins++;
      arcade.record('flawless', 1, profile.flawlessWins === 5 ? { achievement: 'five_flawless', title: 'Untouchable Analyst', detail: 'Five flawless fields cleared', coins: 90 } : {});
    }
    if (modeId === 'expedition') {
      const oldStars = Number(profile.missionStars[config.mission] || 0);
      profile.missionStars[config.mission] = Math.max(oldStars, rating.stars);
      profile.bestMission = Math.max(profile.bestMission, Math.min(MAX_MISSION, config.mission + 1));
      profile.mission = Math.min(MAX_MISSION, config.mission + 1);
    } else if (modeId === 'deep') {
      profile.bestDeepWave = Math.max(profile.bestDeepWave, profile.deepWave);
      profile.deepWave++;
    } else {
      const field = profile.classicField;
      const current = profile.bestTimes[field];
      if (!current || run.seconds < current) profile.bestTimes[field] = run.seconds;
    }
    saveProfile();
    sfx.win();
    renderBoard();
    setTimer(() => showResults(true, rating), 450);
  }

  function updateUi() {
    if (!root || !board) return;
    const counts = board.counts();
    run.revealed = counts.revealed;
    run.flags = counts.flags;
    run.correctFlags = counts.correctFlags;
    run.caches = counts.caches;
    const setText = (selector, value) => { const node = root.querySelector(selector); if (node) node.textContent = value; };
    setText('#ms3-score', formatNumber(run.score));
    setText('#ms3-time', formatTime(run.seconds));
    setText('#ms3-streak', run.streak);
    setText('#ms3-signal-value', `${Math.round(run.charge)}%`);
    setText('#ms3-side-value', `${Math.round(run.charge)}%`);
    setText('#ms3-charge-text', `${Math.round(run.charge)}%`);
    ['#ms3-signal-fill', '#ms3-side-signal', '#ms3-charge-fill'].forEach((selector) => {
      const node = root.querySelector(selector);
      if (node) node.style.width = `${run.charge}%`;
    });
    const objectives = root.querySelector('#ms3-objectives');
    if (objectives) objectives.innerHTML = config.objectives.map((objective) => {
      const value = objectiveProgress(objective);
      const pct = clamp((value / objective.target) * 100, 0, 100);
      return `<div class="ms3-objective"><div class="ms3-objective-line"><b>${objective.icon} ${objective.label}</b><span>${Math.min(value, objective.target)}/${objective.target}</span></div><div class="ms3-objective-track"><i style="width:${pct}%"></i></div></div>`;
    }).join('');
    root.querySelectorAll('[data-tool]').forEach((button) => {
      const tool = button.dataset.tool;
      const cost = tool === 'sonar' ? (perkId === 'scanner' ? 25 : 35) : tool === 'defuse' ? 60 : 100;
      button.disabled = run.charge < cost || !run.started || run.completed || run.failed;
      if (tool === 'sweep') button.classList.toggle('active', selectedSweep);
    });
  }

  function bindCellButton(button, r, c) {
    button.type = 'button';
    button.className = 'ms3-cell';
    button.dataset.r = r;
    button.dataset.c = c;
    button.addEventListener('click', (event) => {
      cursorVisible = false;
      button.blur();
      initAudio();
      sfx.tap();
      const current = board.cells[r]?.[c];
      if (!current) return;
      if (applySweep(r, c)) return;
      if (inputMode === 'flag' || event.shiftKey) toggleFlag(r, c);
      else if (current.revealed) doChord(r, c);
      else manualReveal(r, c);
    });
    button.addEventListener('dblclick', (event) => {
      event.preventDefault();
      button.blur();
      doChord(r, c);
    });
    button.addEventListener('contextmenu', (event) => {
      cursorVisible = false;
      event.preventDefault();
      button.blur();
      initAudio();
      toggleFlag(r, c);
    });
    button.addEventListener('pointerdown', (event) => {
      if (event.pointerType !== 'touch') return;
      touchState = { r, c, x: event.clientX, y: event.clientY, id: setTimer(() => {
        touchState = null;
        toggleFlag(r, c);
        if (navigator.vibrate) navigator.vibrate(30);
      }, 470) };
    });
    const cancelTouch = (event) => {
      if (!touchState) return;
      if (Math.abs(event.clientX - touchState.x) > 12 || Math.abs(event.clientY - touchState.y) > 12) {
        clearTimer(touchState.id);
        touchState = null;
      }
    };
    button.addEventListener('pointermove', cancelTouch);
    button.addEventListener('pointerup', () => {
      button.blur();
      if (touchState) {
        clearTimer(touchState.id);
        touchState = null;
      }
    });
    button.addEventListener('pointercancel', () => {
      if (touchState) {
        clearTimer(touchState.id);
        touchState = null;
      }
    });
  }

  function paintCellButton(button, r, c, initial = false) {
    const cell = board.cells[r][c];
    if (initial) button.style.animationDelay = `${Math.min(260, (r + c) * 8)}ms`;
    else button.style.animationDelay = '';

    button.classList.toggle('revealed', Boolean(cell.revealed));
    button.classList.toggle('flagged', !cell.revealed && Boolean(cell.flagged));
    button.classList.toggle('mine', Boolean(cell.revealed && cell.mine));
    button.classList.toggle('mine-hit', Boolean(cell.revealed && cell.mine && cell.exploded));
    button.classList.toggle('wrong', Boolean(run.failed && cell.flagged && !cell.mine));
    button.classList.toggle('cursor', Boolean(cursorVisible && cursor.r === r && cursor.c === c));
    button.classList.toggle('scanned', Boolean(cell.scanned));
    button.classList.toggle('cache', Boolean(cell.revealed && !cell.mine && cell.cache));

    let showCacheBirth = false;
    if (cell.revealed && !cell.mine && cell.cache && !cell.cacheSeen) {
      cell.cacheSeen = true;
      showCacheBirth = true;
    }
    button.classList.toggle('cache-new', showCacheBirth);
    if (showCacheBirth) setTimer(() => button.classList.remove('cache-new'), 1500);

    for (let n = 1; n <= 8; n++) button.classList.toggle(`n${n}`, Boolean(cell.revealed && !cell.mine && cell.clue === n));
    button.textContent = cell.revealed && !cell.mine && cell.clue > 0 ? String(cell.clue) : '';

    const cellLabel = cell.revealed
      ? cell.mine
        ? 'Mine'
        : `${cell.clue ? `${cell.clue} adjacent mines` : 'Empty safe cell'}${cell.cache ? ', data cache recovered' : ''}`
      : cell.flagged ? 'Flagged cell' : 'Hidden cell';
    button.setAttribute('aria-label', cellLabel);
  }

  function renderBoard(initial = false) {
    const grid = root.querySelector('#ms3-board');
    if (!grid || !board) return;
    const expected = config.rows * config.cols;
    const needsBuild = initial
      || grid.children.length !== expected
      || grid.dataset.rows !== String(config.rows)
      || grid.dataset.cols !== String(config.cols);

    grid.style.gridTemplateColumns = `repeat(${config.cols},1fr)`;
    grid.style.gridTemplateRows = `repeat(${config.rows},1fr)`;

    if (needsBuild) {
      grid.innerHTML = '';
      grid.dataset.rows = String(config.rows);
      grid.dataset.cols = String(config.cols);
      const fragment = document.createDocumentFragment();
      for (let r = 0; r < config.rows; r++) for (let c = 0; c < config.cols; c++) {
        const button = document.createElement('button');
        bindCellButton(button, r, c);
        fragment.appendChild(button);
      }
      grid.appendChild(fragment);
    }

    for (let r = 0; r < config.rows; r++) for (let c = 0; c < config.cols; c++) {
      const index = r * config.cols + c;
      paintCellButton(grid.children[index], r, c, initial && needsBuild);
    }
  }

  function bindKeyboard() {
    if (keyHandler) window.removeEventListener('keydown', keyHandler);
    keyHandler = (event) => {
      if (!board || run.completed || run.failed || root.querySelector('.ms3-overlay')) return;
      let moved = false;
      if (event.key === 'ArrowUp' || event.key.toLowerCase() === 'w') { cursor.r = Math.max(0, cursor.r - 1); moved = true; }
      else if (event.key === 'ArrowDown' || event.key.toLowerCase() === 's') { cursor.r = Math.min(config.rows - 1, cursor.r + 1); moved = true; }
      else if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') { cursor.c = Math.max(0, cursor.c - 1); moved = true; }
      else if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') { cursor.c = Math.min(config.cols - 1, cursor.c + 1); moved = true; }
      else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const cell = board.cells[cursor.r][cursor.c];
        if (cell.revealed) doChord(cursor.r, cursor.c);
        else manualReveal(cursor.r, cursor.c);
      } else if (event.key.toLowerCase() === 'f') {
        event.preventDefault();
        toggleFlag(cursor.r, cursor.c);
      } else if (event.key.toLowerCase() === 'h') useHint();
      if (moved) {
        cursorVisible = true;
        event.preventDefault();
        renderBoard();
      }
    };
    window.addEventListener('keydown', keyHandler);
  }

  function showFloat(text) {
    const shell = root.querySelector('#ms3-shell');
    if (!shell) return;
    const node = document.createElement('div');
    node.className = 'ms3-float';
    node.textContent = text;
    shell.appendChild(node);
    setTimer(() => node.remove(), 800);
  }

  function showResults(completed, rating = null) {
    const overlay = document.createElement('div');
    overlay.className = 'ms3-overlay';
    const stars = completed ? `${'★'.repeat(rating.stars)}<span style="opacity:.18">${'★'.repeat(5 - rating.stars)}</span>` : '◇';
    overlay.innerHTML = `<div class="ms3-modal"><div class="ms3-modal-icon">${completed ? '🏆' : '✹'}</div><h2>${completed ? `${rating.label} clear` : 'Signal detonated'}</h2><p>${completed ? 'The field is stable. Higher mastery requires faster deduction, clean precision, complete cache recovery, and deliberate logic chains.' : 'The expedition ended at an active signal. Your progress and arcade totals remain saved.'}</p><div class="ms3-stars">${stars}</div>${completed ? `<div class="ms3-rating"><b>${rating.total}</b>/100 performance</div><div class="ms3-breakdown"><div><small>Clear</small><b>${rating.clear}/20</b></div><div><small>Speed</small><b>${rating.speed}/30</b></div><div><small>Precision</small><b>${rating.precision}/20</b></div><div><small>Logic</small><b>${rating.logic}/20</b></div><div><small>Caches</small><b>${rating.caches}/10</b></div></div>` : ''}<div class="ms3-breakdown" style="grid-template-columns:repeat(3,1fr)"><div><small>Time</small><b>${formatTime(run.seconds)}</b></div><div><small>Best streak</small><b style="color:#c084fc">${run.bestStreak}</b></div><div><small>Chords</small><b style="color:#67e8f9">${run.chords}</b></div></div><div class="ms3-actions"><button data-action="menu">Menu</button><button class="primary" data-action="again">${completed && modeId === 'expedition' ? 'Next mission' : completed && modeId === 'deep' ? 'Next wave' : 'Try again'}</button></div></div>`;
    root.appendChild(overlay);
    overlay.querySelector('[data-action="menu"]').addEventListener('click', renderMenu);
    overlay.querySelector('[data-action="again"]').addEventListener('click', startGame);
  }

  function showHelp() {
    const overlay = document.createElement('div');
    overlay.className = 'ms3-overlay';
    overlay.innerHTML = `<div class="ms3-modal"><div class="ms3-modal-icon">?</div><h2>Deep Signal manual</h2><div class="ms3-help"><h3>Classic deduction</h3><p>Reveal every safe cell. A number tells you how many mines touch that cell. Right-click, long-press, Shift-click, or use Flag mode to mark a signal.</p><h3>Logic chains</h3><p>Tap a revealed number after placing the exact number of neighboring flags. Every remaining neighbor opens at once. Clean chords build score, streak, and signal charge.</p><h3>No-guess expedition</h3><p>Campaign fields are regenerated and checked by a deduction solver before play. You should not need a blind guess to complete them.</p><h3>Signal tools</h3><ul><li><b>Sonar:</b> reveals one safe deduction or guaranteed safe cell.</li><li><b>Defuse:</b> safely confirms one mine.</li><li><b>Sweep:</b> reveals safe cells around a chosen revealed clue.</li></ul><h3>Five-star mastery</h3><p>Legendary clears require speed, no mistakes, no assistance, all caches, and meaningful chord or streak play. Simply winning cannot produce five stars.</p><h3>Keyboard</h3><p>Arrow keys or WASD move the cursor. Enter/Space reveals or chords. F flags. H requests a logic hint.</p></div><div class="ms3-actions"><button class="primary" data-action="close">Got it</button></div></div>`;
    root.appendChild(overlay);
    overlay.querySelector('[data-action="close"]').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (event) => { if (event.target === overlay) overlay.remove(); });
  }

  return {
    async mount(nextContainer) {
      container = nextContainer;
      container.innerHTML = '';
      container.style.cssText = 'width:100%;height:100%;min-width:0;min-height:0;overflow:hidden;background:#050915;';
      root = document.createElement('div');
      root.className = 'ms3-root auto-focus-target';
      root.tabIndex = 0;
      root.setAttribute('aria-label', 'Minesweeper Odyssey game');
      container.appendChild(root);
      arcade.mount(root, container);
      await Promise.all([arcade.ready, loadProfile()]);
      removeChange = arcade.onChange(() => { arcade.closeHub(); renderMenu(); });
      removePause = runtime.lifecycle.onPause(() => root?.classList.add('is-paused'));
      removeResume = runtime.lifecycle.onResume(() => root?.classList.remove('is-paused'));
      const observer = new ResizeObserver(() => fitBoard());
      observer.observe(root);
      resizeHandler = () => {
        requestAnimationFrame(() => fitBoard());
        setTimer(() => fitBoard(), 90);
      };
      window.addEventListener('resize', resizeHandler);
      window.visualViewport?.addEventListener('resize', resizeHandler);
      runtime.lifecycle.onCleanup(() => {
        observer.disconnect();
        if (resizeHandler) window.removeEventListener('resize', resizeHandler);
        if (resizeHandler) window.visualViewport?.removeEventListener('resize', resizeHandler);
      });
      renderMenu();
    },
    unmount() {
      advanceScreen();
      if (keyHandler) window.removeEventListener('keydown', keyHandler);
      if (resizeHandler) window.removeEventListener('resize', resizeHandler);
      if (resizeHandler) window.visualViewport?.removeEventListener('resize', resizeHandler);
      keyHandler = null;
      resizeHandler = null;
      removeChange?.();
      removePause?.();
      removeResume?.();
      arcade.cleanup();
      if (audio) audio.close().catch(() => {});
      audio = null;
      root = null;
      container = null;
    },
  };
}
