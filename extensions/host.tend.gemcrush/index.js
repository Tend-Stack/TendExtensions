import {
  createArcade,
  setTimeout,
  clearTimeout,
  requestAnimationFrame,
  cancelAnimationFrame,
} from './arcade-kit.js';

const STYLE_ID = 'tend-gem-crush-riftfall-v3';
const PROFILE_KEY = 'gem_crush_riftfall_profile_v3';
const ROWS = 8;
const COLS = 8;
const MAX_STAGE = 80;
const TYPE_META = [
  { id: 0, name: 'Ruby', glyph: '◆', className: 'ruby' },
  { id: 1, name: 'Sapphire', glyph: '◇', className: 'sapphire' },
  { id: 2, name: 'Emerald', glyph: '⬢', className: 'emerald' },
  { id: 3, name: 'Sunstone', glyph: '✦', className: 'sunstone' },
  { id: 4, name: 'Amethyst', glyph: '⬟', className: 'amethyst' },
  { id: 5, name: 'Moonstone', glyph: '●', className: 'moonstone' },
];
const WORLDS = [
  ['Prism Harbor', 'Wake the sleeping color engines.', '#22d3ee'],
  ['Velvet Caverns', 'Break crystal seals below the city.', '#a855f7'],
  ['Solar Foundry', 'Forge power gems beneath a molten sky.', '#f59e0b'],
  ['Emerald Wilds', 'Cleanse the rifts spreading through the canopy.', '#34d399'],
  ['Astral Bazaar', 'Trade speed for impossible cascades.', '#ec4899'],
  ['Moonlit Archive', 'Solve the ancient collection contracts.', '#818cf8'],
  ['Crown of Storms', 'Survive unstable boards and chained powers.', '#38bdf8'],
  ['The Final Rift', 'Seal the void before it consumes every color.', '#fb7185'],
];
const POWER_LABELS = {
  hline: 'Row Ray',
  vline: 'Column Ray',
  bomb: 'Nova Gem',
  prism: 'Prism Core',
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const keyOf = (row, col) => `${row},${col}`;
const parseKey = (key) => {
  const [row, col] = key.split(',').map(Number);
  return { row, col };
};
const formatNumber = (value) => Math.max(0, Math.round(value)).toLocaleString('en-US');

function createSeededRandom(seed) {
  let state = (Number(seed) || 1) >>> 0;
  return () => {
    state += 0x6D2B79F5;
    let value = state;
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}

const element = (tag, className, html = '') => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html) node.innerHTML = html;
  return node;
};

function buildStage(stageNumber, modeId = 'campaign') {
  const stage = clamp(Math.floor(stageNumber || 1), 1, MAX_STAGE);
  const worldIndex = Math.floor((stage - 1) / 10);
  const world = WORLDS[worldIndex] || WORLDS[WORLDS.length - 1];
  const chapterStage = ((stage - 1) % 10) + 1;
  const types = stage < 16 ? 5 : 6;
  const baseMoves = Math.max(22, 32 - Math.floor(stage / 8));
  const scoreTarget = Math.round((950 + stage * 95 + worldIndex * 220) / 50) * 50;
  const objectives = [{ kind: 'score', target: scoreTarget, label: 'Score', icon: '★' }];

  if (stage >= 3) {
    const type = (stage + worldIndex * 2) % types;
    objectives.push({
      kind: 'collect',
      type,
      target: 12 + Math.floor(stage * 0.4),
      label: TYPE_META[type].name,
      icon: TYPE_META[type].glyph,
    });
  }
  if (stage >= 6 && stage % 3 !== 1) {
    objectives.push({
      kind: 'frost',
      target: Math.min(21, 4 + Math.floor(stage * 0.22)),
      label: 'Crystal seals',
      icon: '❄',
    });
  }
  if (stage >= 11 && stage % 4 !== 0) {
    objectives.push({
      kind: 'rift',
      target: Math.min(16, 3 + Math.floor(stage * 0.16)),
      label: 'Rifts sealed',
      icon: '◉',
    });
  }
  if (stage >= 8 && (stage % 4 === 0 || objectives.length < 3)) {
    objectives.push({
      kind: 'power',
      target: 2 + Math.floor(stage / 20),
      label: 'Power activations',
      icon: '✦',
    });
  }
  if (stage >= 13 && stage % 5 === 0) {
    objectives.push({
      kind: 'cascade',
      target: Math.min(6, 2 + Math.floor(stage / 20)),
      label: 'Cascade depth',
      icon: '×',
    });
  }

  const trimmed = objectives.slice(0, stage >= 30 ? 4 : 3);
  if (modeId === 'rush') {
    return {
      modeId,
      stage,
      worldIndex,
      world,
      chapterStage,
      types,
      moves: Infinity,
      seconds: 92,
      title: 'Rift Rush',
      subtitle: 'Ninety seconds. Every cascade restores the clock.',
      objectives: [{ kind: 'score', target: scoreTarget * 2, label: 'Rush score', icon: '⚡' }],
      frostCount: Math.min(10, Math.floor(stage / 4)),
      riftCount: Math.min(8, Math.floor(stage / 6)),
      difficulty: 1 + stage / 32,
    };
  }
  if (modeId === 'endless') {
    return {
      modeId,
      stage,
      worldIndex,
      world,
      chapterStage,
      types: 6,
      moves: 28,
      seconds: Infinity,
      title: 'Infinite Rift',
      subtitle: 'Complete each wave to earn moves and deepen the corruption.',
      objectives: [{ kind: 'score', target: scoreTarget, label: 'Wave score', icon: '∞' }],
      frostCount: Math.min(24, 4 + Math.floor(stage * 0.32)),
      riftCount: Math.min(20, 3 + Math.floor(stage * 0.27)),
      difficulty: 1 + stage / 24,
    };
  }

  return {
    modeId,
    stage,
    worldIndex,
    world,
    chapterStage,
    types,
    moves: baseMoves,
    seconds: Infinity,
    title: `${world[0]} · ${chapterStage}`,
    subtitle: world[1],
    objectives: trimmed,
    frostCount: stage >= 6 ? Math.min(23, 5 + Math.floor(stage * 0.24)) : 0,
    riftCount: stage >= 11 ? Math.min(18, 4 + Math.floor(stage * 0.18)) : 0,
    difficulty: 1 + stage / 36,
  };
}

function calculateRating(run, stageConfig, completed) {
  if (!completed) {
    return {
      stars: 0,
      total: 0,
      completion: 0,
      efficiency: 0,
      mastery: 0,
      skill: 0,
      precision: 0,
      label: 'Unfinished',
    };
  }

  const scoreObjective = stageConfig.objectives.find((objective) => objective.kind === 'score');
  const target = scoreObjective?.target || Math.max(1, run.score);
  const scoreRatio = clamp(run.score / target, 0, 2.5);
  const remainingRatio = Number.isFinite(stageConfig.moves)
    ? clamp(run.moves / Math.max(1, run.startMoves), 0, 1)
    : clamp(run.time / Math.max(1, run.startTime), 0, 1);

  // Clearing the stage guarantees one star, but only 20 of the 100 points.
  // The old system granted 30 points before judging performance, which made
  // five-star results far too common.
  const completion = 20;

  // Efficiency starts contributing after 8% of the move/time budget remains
  // and reaches its maximum at 50%. This prevents a routine clear with only a
  // few spare moves from receiving nearly full efficiency credit.
  const efficiency = Math.round(clamp((remainingRatio - 0.08) / 0.42, 0, 1) * 30);

  // Meeting the score objective is the baseline. Full mastery now requires
  // roughly 2.4x the target instead of the previous 1.9x ceiling.
  const mastery = Math.round(clamp((scoreRatio - 1) / 1.4, 0, 1) * 25);

  // Deep cascades and deliberate power use share 20 points. A common 2x
  // cascade or one incidental power contributes only a small amount.
  const cascadeScore = clamp((run.bestCascade - 1) / 5, 0, 1) * 12;
  const powerScore = clamp(run.powers / 8, 0, 1) * 8;
  const skill = Math.round(cascadeScore + powerScore);

  // Invalid swaps now matter. Clean play receives all five precision points;
  // repeated mistakes gradually remove them.
  const precision = Math.round(Math.max(0, 5 - Math.min(5, run.invalid * 1.25)));
  const total = Math.round(completion + efficiency + mastery + skill + precision);

  // Legendary has both a score threshold and hard performance gates. This
  // keeps five stars exceptional even when random cascades inflate the score.
  const legendary = total >= 92
    && remainingRatio >= 0.28
    && scoreRatio >= 1.6
    && run.invalid <= 1
    && (run.bestCascade >= 3 || run.powers >= 3);

  const stars = legendary ? 5 : total >= 78 ? 4 : total >= 60 ? 3 : total >= 42 ? 2 : 1;
  const labels = ['Rift Clear', 'Focused', 'Brilliant', 'Masterful', 'Legendary'];
  return {
    stars,
    total,
    completion,
    efficiency,
    mastery,
    skill,
    precision,
    label: labels[stars - 1],
  };
}

class BoardCore {
  constructor(rows = ROWS, cols = COLS, types = 5, rng = Math.random) {
    this.rows = rows;
    this.cols = cols;
    this.types = types;
    this.grid = [];
    this.frost = [];
    this.rifts = [];
    this.nextId = 1;
    this.rng = typeof rng === 'function' ? rng : Math.random;
  }

  gem(type, power = null, flags = {}) {
    return {
      id: this.nextId++,
      type,
      power,
      isNew: Boolean(flags.isNew),
      forged: Boolean(flags.forged),
    };
  }

  rand(min, max) { return Math.floor(this.rng() * (max - min + 1)) + min; }
  shuffle(values) {
    const copy = values.slice();
    for (let index = copy.length - 1; index > 0; index--) {
      const target = Math.floor(this.rng() * (index + 1));
      [copy[index], copy[target]] = [copy[target], copy[index]];
    }
    return copy;
  }
  snapshot() {
    return {
      rows: this.rows,
      cols: this.cols,
      types: this.types,
      grid: this.grid.map((row) => row.map((gem) => gem ? { type: gem.type, power: gem.power } : null)),
      frost: this.frost.map((row) => row.slice()),
      rifts: this.rifts.map((row) => row.slice()),
    };
  }

  generate(stageConfig, perkId = 'time') {
    this.types = stageConfig.types;
    let attempts = 0;
    do {
      attempts++;
      this.grid = Array.from({ length: this.rows }, () => Array(this.cols).fill(null));
      for (let row = 0; row < this.rows; row++) {
        for (let col = 0; col < this.cols; col++) {
          let type;
          do { type = this.rand(0, this.types - 1); }
          while (this.wouldMatch(row, col, type));
          this.grid[row][col] = this.gem(type, null, { isNew: true });
        }
      }
    } while (!this.hasValidMove() && attempts < 120);

    this.frost = Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
    this.rifts = Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
    const positions = this.shuffle(Array.from({ length: this.rows * this.cols }, (_, index) => index));
    let cursor = 0;
    for (let index = 0; index < stageConfig.frostCount; index++) {
      const value = positions[cursor++ % positions.length];
      const row = Math.floor(value / this.cols);
      const col = value % this.cols;
      this.frost[row][col] = stageConfig.stage > 35 && index % 5 === 0 ? 2 : 1;
    }
    for (let index = 0; index < stageConfig.riftCount; index++) {
      const value = positions[cursor++ % positions.length];
      const row = Math.floor(value / this.cols);
      const col = value % this.cols;
      this.rifts[row][col] = stageConfig.stage > 52 && index % 4 === 0 ? 2 : 1;
    }
    if (perkId === 'special') {
      const row = this.rand(1, this.rows - 2);
      const col = this.rand(1, this.cols - 2);
      this.grid[row][col].power = 'prism';
      this.grid[row][col].forged = true;
    }
  }

  wouldMatch(row, col, type) {
    if (col >= 2 && this.grid[row][col - 1]?.type === type && this.grid[row][col - 2]?.type === type) return true;
    if (row >= 2 && this.grid[row - 1]?.[col]?.type === type && this.grid[row - 2]?.[col]?.type === type) return true;
    return false;
  }

  swap(a, b) {
    [this.grid[a.row][a.col], this.grid[b.row][b.col]] = [this.grid[b.row][b.col], this.grid[a.row][a.col]];
  }

  findMatches(preferredAnchor = null) {
    const matched = new Set();
    const horizontal = [];
    const vertical = [];

    for (let row = 0; row < this.rows; row++) {
      let start = 0;
      for (let col = 1; col <= this.cols; col++) {
        const same = col < this.cols && this.grid[row][col]?.type === this.grid[row][col - 1]?.type;
        if (same) continue;
        const length = col - start;
        if (length >= 3) {
          horizontal.push({ row, start, length, type: this.grid[row][start].type });
          for (let index = start; index < col; index++) matched.add(keyOf(row, index));
        }
        start = col;
      }
    }

    for (let col = 0; col < this.cols; col++) {
      let start = 0;
      for (let row = 1; row <= this.rows; row++) {
        const same = row < this.rows && this.grid[row][col]?.type === this.grid[row - 1][col]?.type;
        if (same) continue;
        const length = row - start;
        if (length >= 3) {
          vertical.push({ col, start, length, type: this.grid[start][col].type });
          for (let index = start; index < row; index++) matched.add(keyOf(index, col));
        }
        start = row;
      }
    }

    const specialMap = new Map();
    const priority = { hline: 1, vline: 1, bomb: 2, prism: 3 };
    const putSpecial = (row, col, type, power) => {
      const key = keyOf(row, col);
      const current = specialMap.get(key);
      if (!current || priority[power] > priority[current.power]) specialMap.set(key, { row, col, type, power });
    };
    const chooseAnchor = (cells) => {
      if (preferredAnchor && cells.some((cell) => cell.row === preferredAnchor.row && cell.col === preferredAnchor.col)) return preferredAnchor;
      return cells[Math.floor(cells.length / 2)];
    };

    for (const hRun of horizontal) {
      const cells = Array.from({ length: hRun.length }, (_, index) => ({ row: hRun.row, col: hRun.start + index }));
      const anchor = chooseAnchor(cells);
      if (hRun.length >= 5) putSpecial(anchor.row, anchor.col, hRun.type, 'prism');
      else if (hRun.length === 4) putSpecial(anchor.row, anchor.col, hRun.type, 'hline');
    }
    for (const vRun of vertical) {
      const cells = Array.from({ length: vRun.length }, (_, index) => ({ row: vRun.start + index, col: vRun.col }));
      const anchor = chooseAnchor(cells);
      if (vRun.length >= 5) putSpecial(anchor.row, anchor.col, vRun.type, 'prism');
      else if (vRun.length === 4) putSpecial(anchor.row, anchor.col, vRun.type, 'vline');
    }
    for (const hRun of horizontal) {
      for (const vRun of vertical) {
        const intersects = vRun.start <= hRun.row && hRun.row < vRun.start + vRun.length
          && hRun.start <= vRun.col && vRun.col < hRun.start + hRun.length;
        if (intersects) putSpecial(hRun.row, vRun.col, hRun.type, 'bomb');
      }
    }

    return { matched, horizontal, vertical, specialMap };
  }

  specialCombo(a, b) {
    const first = this.grid[a.row][a.col];
    const second = this.grid[b.row][b.col];
    if (!first?.power || !second?.power) return null;
    const remove = new Set([keyOf(a.row, a.col), keyOf(b.row, b.col)]);
    const addRow = (row) => { for (let col = 0; col < this.cols; col++) remove.add(keyOf(row, col)); };
    const addCol = (col) => { for (let row = 0; row < this.rows; row++) remove.add(keyOf(row, col)); };
    const addRadius = (center, radius) => {
      for (let row = center.row - radius; row <= center.row + radius; row++) {
        for (let col = center.col - radius; col <= center.col + radius; col++) {
          if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) remove.add(keyOf(row, col));
        }
      }
    };

    if (first.power === 'prism' && second.power === 'prism') {
      for (let row = 0; row < this.rows; row++) for (let col = 0; col < this.cols; col++) remove.add(keyOf(row, col));
    } else if (first.power === 'prism' || second.power === 'prism') {
      const target = first.power === 'prism' ? second : first;
      for (let row = 0; row < this.rows; row++) {
        for (let col = 0; col < this.cols; col++) if (this.grid[row][col]?.type === target.type) remove.add(keyOf(row, col));
      }
    } else if (first.power === 'bomb' && second.power === 'bomb') {
      addRadius(a, 3); addRadius(b, 3);
    } else if (first.power === 'bomb' || second.power === 'bomb') {
      for (let offset = -1; offset <= 1; offset++) {
        addRow(clamp(a.row + offset, 0, this.rows - 1));
        addCol(clamp(b.col + offset, 0, this.cols - 1));
      }
    } else {
      addRow(a.row); addRow(b.row); addCol(a.col); addCol(b.col);
    }
    return { remove, label: 'Power fusion' };
  }

  expandSpecials(removeSet, prismTargetType = null) {
    const activated = [];
    const processed = new Set();
    let changed = true;
    while (changed) {
      changed = false;
      for (const key of Array.from(removeSet)) {
        if (processed.has(key)) continue;
        const { row, col } = parseKey(key);
        const gem = this.grid[row]?.[col];
        if (!gem?.power) continue;
        processed.add(key);
        activated.push({ row, col, power: gem.power });
        const additions = [];
        if (gem.power === 'hline') for (let x = 0; x < this.cols; x++) additions.push(keyOf(row, x));
        if (gem.power === 'vline') for (let y = 0; y < this.rows; y++) additions.push(keyOf(y, col));
        if (gem.power === 'bomb') {
          for (let y = row - 2; y <= row + 2; y++) for (let x = col - 2; x <= col + 2; x++) {
            if (y >= 0 && y < this.rows && x >= 0 && x < this.cols) additions.push(keyOf(y, x));
          }
        }
        if (gem.power === 'prism') {
          const targetType = prismTargetType ?? gem.type;
          for (let y = 0; y < this.rows; y++) for (let x = 0; x < this.cols; x++) {
            if (this.grid[y][x]?.type === targetType) additions.push(keyOf(y, x));
          }
        }
        for (const addition of additions) {
          if (!removeSet.has(addition)) { removeSet.add(addition); changed = true; }
        }
      }
    }
    return activated;
  }

  clear(removeSet) {
    const removed = [];
    let frostHits = 0;
    let riftHits = 0;
    for (const key of removeSet) {
      const { row, col } = parseKey(key);
      const gem = this.grid[row]?.[col];
      if (!gem) continue;
      removed.push({ row, col, type: gem.type, power: gem.power });
      this.grid[row][col] = null;
      if (this.frost[row][col] > 0) { this.frost[row][col]--; frostHits++; }
      if (this.rifts[row][col] > 0) { this.rifts[row][col]--; riftHits++; }
    }
    return { removed, frostHits, riftHits };
  }

  collapseAndFill() {
    for (let col = 0; col < this.cols; col++) {
      let write = this.rows - 1;
      for (let row = this.rows - 1; row >= 0; row--) {
        const gem = this.grid[row][col];
        if (!gem) continue;
        this.grid[write][col] = gem;
        if (write !== row) this.grid[row][col] = null;
        write--;
      }
      while (write >= 0) {
        this.grid[write][col] = this.gem(this.rand(0, this.types - 1), null, { isNew: true });
        write--;
      }
    }
  }

  forgeSpecial(special) {
    if (!special) return;
    this.grid[special.row][special.col] = this.gem(special.type, special.power, { forged: true });
  }

  hasValidMove() {
    return Boolean(this.findHint());
  }

  findHint() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        for (const [dr, dc] of [[0, 1], [1, 0]]) {
          const other = { row: row + dr, col: col + dc };
          if (other.row >= this.rows || other.col >= this.cols) continue;
          const a = { row, col };
          const ga = this.grid[a.row][a.col];
          const gb = this.grid[other.row][other.col];
          if (ga?.power && gb?.power) return [a, other];
          this.swap(a, other);
          const valid = this.findMatches(other).matched.size > 0;
          this.swap(a, other);
          if (valid) return [a, other];
        }
      }
    }
    return null;
  }

  shuffleUntilPlayable() {
    const layers = [];
    for (let row = 0; row < this.rows; row++) for (let col = 0; col < this.cols; col++) layers.push(this.grid[row][col]);
    for (let attempt = 0; attempt < 180; attempt++) {
      const mixed = this.shuffle(layers);
      let index = 0;
      for (let row = 0; row < this.rows; row++) for (let col = 0; col < this.cols; col++) {
        this.grid[row][col] = mixed[index++];
        this.grid[row][col].isNew = true;
        this.grid[row][col].forged = false;
      }
      if (this.findMatches().matched.size === 0 && this.hasValidMove()) return true;
    }
    return false;
  }

  mostCommonType() {
    const counts = Array(this.types).fill(0);
    for (let row = 0; row < this.rows; row++) for (let col = 0; col < this.cols; col++) counts[this.grid[row][col].type]++;
    let best = 0;
    for (let index = 1; index < counts.length; index++) if (counts[index] > counts[best]) best = index;
    return best;
  }
}

function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
@keyframes gc-screen-in{from{opacity:0;transform:translateY(12px) scale(.985)}to{opacity:1;transform:none}}
@keyframes gc-gem-new{0%{opacity:0;transform:translateY(-65%) scale(.72)}70%{opacity:1;transform:translateY(4%) scale(1.06)}100%{opacity:1;transform:none}}
@keyframes gc-gem-clear{to{opacity:0;transform:scale(.1) rotate(18deg);filter:brightness(2.6)}}
@keyframes gc-forge{0%{transform:scale(.1) rotate(-90deg);filter:brightness(3)}55%{transform:scale(1.24) rotate(8deg);filter:brightness(1.7)}100%{transform:none;filter:none}}
@keyframes gc-hint{0%,100%{transform:scale(1)}50%{transform:scale(1.12);box-shadow:0 0 0 3px rgba(255,255,255,.86),0 0 26px rgba(103,232,249,.68)}}
@keyframes gc-flow{0%{opacity:0;transform:translate(-50%,-30%) scale(.55)}25%{opacity:1;transform:translate(-50%,-50%) scale(1.15)}100%{opacity:0;transform:translate(-50%,-115%) scale(.92)}}
@keyframes gc-rift-pulse{0%,100%{opacity:.55}50%{opacity:1}}
@keyframes gc-shimmer{0%{transform:translateX(-130%)}100%{transform:translateX(260%)}}
@keyframes gc-modal{from{opacity:0;transform:translateY(12px) scale(.96)}to{opacity:1;transform:none}}
.gc-root{width:100%;height:100%;min-width:0;min-height:0;position:relative;container-type:size;container-name:gemcrush;overflow:hidden;color:#f8fafc;font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;background:radial-gradient(circle at 12% -8%,rgba(34,211,238,.18),transparent 34%),radial-gradient(circle at 92% 16%,rgba(168,85,247,.18),transparent 32%),linear-gradient(180deg,#070914,#0b1022 54%,#070914);user-select:none;-webkit-user-select:none;isolation:isolate}
.gc-root::before{content:"";position:absolute;inset:0;pointer-events:none;opacity:.34;background-image:radial-gradient(circle at 12% 18%,rgba(255,255,255,.58) 0 1px,transparent 1.4px),radial-gradient(circle at 73% 39%,rgba(255,255,255,.36) 0 1px,transparent 1.4px),radial-gradient(circle at 39% 81%,rgba(255,255,255,.28) 0 1px,transparent 1.4px);background-size:71px 79px,89px 83px,109px 101px}
.gc-root *{box-sizing:border-box}.gc-root button{font:inherit}.gc-app{position:absolute;inset:0;min-width:0;min-height:0}.gc-screen{position:absolute;inset:0;z-index:2;animation:gc-screen-in .28s cubic-bezier(.22,.72,.16,1)}
.gc-menu{padding:18px;overflow:auto;scrollbar-width:thin;scrollbar-color:rgba(148,163,184,.22) transparent;display:flex;flex-direction:column;gap:12px}
.gc-brand{display:flex;align-items:center;justify-content:space-between;gap:12px}.gc-logo{display:flex;align-items:center;gap:11px;min-width:0}.gc-logo-mark{width:50px;height:50px;border-radius:17px;display:grid;place-items:center;font-size:27px;background:conic-gradient(from 210deg,#22d3ee,#3b82f6,#8b5cf6,#ec4899,#f59e0b,#34d399,#22d3ee);box-shadow:0 14px 40px rgba(99,102,241,.32),inset 0 1px rgba(255,255,255,.28);border:1px solid rgba(255,255,255,.18)}.gc-title{font-size:25px;font-weight:950;letter-spacing:-.75px;line-height:1}.gc-kicker{margin-top:5px;color:#94a3b8;font-size:9px;letter-spacing:1.8px;text-transform:uppercase;font-weight:850}.gc-profile{display:flex;gap:6px}.gc-profile-chip{min-width:54px;padding:7px 8px;border:1px solid rgba(255,255,255,.09);border-radius:12px;background:rgba(15,23,42,.68);text-align:center}.gc-profile-chip small{display:block;color:#64748b;font-size:7px;text-transform:uppercase;letter-spacing:1px;font-weight:850}.gc-profile-chip b{display:block;margin-top:2px;font-size:14px;font-variant-numeric:tabular-nums}
.gc-hero{position:relative;overflow:hidden;border:1px solid rgba(255,255,255,.11);border-radius:22px;padding:17px;background:linear-gradient(145deg,rgba(23,37,67,.84),rgba(13,18,39,.72));box-shadow:0 22px 60px rgba(0,0,0,.34),inset 0 1px rgba(255,255,255,.07)}.gc-hero::after{content:"";position:absolute;inset:-70% auto auto -18%;width:52%;height:210%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.08),transparent);transform:rotate(18deg);animation:gc-shimmer 7s linear infinite;pointer-events:none}.gc-world-line{display:flex;align-items:center;justify-content:space-between;gap:12px}.gc-world-copy{min-width:0}.gc-world-tag{font-size:9px;text-transform:uppercase;letter-spacing:1.5px;color:#67e8f9;font-weight:900}.gc-world-name{margin-top:4px;font-size:25px;font-weight:950;letter-spacing:-.6px}.gc-world-desc{margin-top:6px;color:#94a3b8;font-size:10.5px;line-height:1.45;max-width:310px}.gc-stage-orb{width:68px;height:68px;border-radius:50%;display:grid;place-items:center;flex:0 0 auto;font-size:24px;font-weight:950;background:radial-gradient(circle at 32% 23%,#fff 0 5%,#67e8f9 7%,#6366f1 48%,#312e81);box-shadow:0 0 0 8px rgba(99,102,241,.09),0 0 38px rgba(99,102,241,.46)}
.gc-objective-preview{display:flex;gap:7px;flex-wrap:wrap;margin-top:13px}.gc-pill{display:flex;align-items:center;gap:6px;padding:7px 9px;border-radius:999px;border:1px solid rgba(255,255,255,.08);background:rgba(2,6,23,.45);font-size:9px;color:#cbd5e1;font-weight:800}.gc-pill i{font-style:normal;color:#67e8f9}.gc-primary{width:100%;min-height:48px;border:1px solid rgba(255,255,255,.14);border-radius:15px;color:#fff;cursor:pointer;font-weight:950;text-transform:uppercase;letter-spacing:1.1px;background:linear-gradient(115deg,#ec4899,#8b5cf6 52%,#2563eb);box-shadow:0 13px 32px rgba(99,102,241,.3),inset 0 1px rgba(255,255,255,.22);transition:transform .16s,filter .16s}.gc-primary:hover{transform:translateY(-1px);filter:brightness(1.08)}.gc-primary:active{transform:scale(.985)}
.gc-menu-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}.gc-menu-card{min-width:0;border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:11px;background:rgba(15,23,42,.58)}.gc-menu-card-head{display:flex;align-items:center;justify-content:space-between;gap:8px}.gc-menu-card-head span{font-size:8px;text-transform:uppercase;letter-spacing:1.25px;color:#64748b;font-weight:900}.gc-menu-card-head b{font-size:9px;color:#67e8f9}.gc-menu-card strong{display:block;margin-top:7px;font-size:13px}.gc-menu-card p{margin:4px 0 0;color:#7f8da4;font-size:8.5px;line-height:1.4}.gc-secondary{width:100%;margin-top:8px;min-height:32px;border-radius:10px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.045);color:#cbd5e1;cursor:pointer;font-size:9px;font-weight:850}.gc-secondary:hover{background:rgba(255,255,255,.08);color:#fff}.gc-stage-nav{display:flex;align-items:center;gap:7px}.gc-stage-nav button{width:34px;height:34px;border-radius:11px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.045);color:#cbd5e1;cursor:pointer;font-weight:900}.gc-stage-nav div{flex:1;text-align:center}.gc-stage-nav small{display:block;color:#64748b;font-size:7px;text-transform:uppercase;letter-spacing:1px;font-weight:850}.gc-stage-nav b{display:block;margin-top:2px;font-size:14px}

.gc-hero-visual{display:none}.gc-rift-preview{position:relative;min-height:190px;border-radius:18px;border:1px solid rgba(255,255,255,.07);background:radial-gradient(circle at 50% 50%,rgba(99,102,241,.18),rgba(8,15,35,.48) 48%,rgba(2,6,23,.08) 72%);overflow:hidden}.gc-rift-preview::before,.gc-rift-preview::after{content:"";position:absolute;left:50%;top:50%;border-radius:50%;border:1px solid rgba(103,232,249,.2);transform:translate(-50%,-50%)}.gc-rift-preview::before{width:150px;height:150px;box-shadow:0 0 45px rgba(99,102,241,.2),inset 0 0 35px rgba(168,85,247,.18)}.gc-rift-preview::after{width:92px;height:92px;border-color:rgba(244,114,182,.28);box-shadow:0 0 28px rgba(236,72,153,.24)}.gc-rift-core{position:absolute;left:50%;top:50%;width:62px;height:62px;border-radius:50%;transform:translate(-50%,-50%);display:grid;place-items:center;font-size:26px;background:conic-gradient(#22d3ee,#6366f1,#a855f7,#ec4899,#f59e0b,#34d399,#22d3ee);box-shadow:0 0 36px rgba(99,102,241,.5);z-index:3}.gc-rift-core::after{content:"✧";width:48px;height:48px;border-radius:50%;display:grid;place-items:center;background:#11162f}.gc-orbit-gem{position:absolute;width:28px;height:28px;display:grid;place-items:center;border-radius:9px;color:#fff;font-size:12px;font-weight:950;box-shadow:0 8px 18px rgba(0,0,0,.34),inset 0 1px rgba(255,255,255,.35)}.gc-orbit-gem.one{left:16%;top:18%;background:linear-gradient(145deg,#ff8ca0,#ef3158)}.gc-orbit-gem.two{right:15%;top:20%;background:linear-gradient(145deg,#8de7ff,#1f9cf0);transform:rotate(45deg)}.gc-orbit-gem.three{left:20%;bottom:16%;background:linear-gradient(145deg,#8ef0c7,#1fbf7c);clip-path:polygon(24% 3%,76% 3%,98% 50%,76% 97%,24% 97%,2% 50%)}.gc-orbit-gem.four{right:18%;bottom:14%;background:linear-gradient(145deg,#e4bdff,#a34df0);clip-path:polygon(50% 0,90% 24%,100% 70%,50% 100%,0 70%,10% 24%)}.gc-world-progress{margin-top:10px;padding:10px 12px;border-radius:13px;border:1px solid rgba(255,255,255,.07);background:rgba(2,6,23,.34)}.gc-world-progress-line{display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:8px;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;font-weight:900}.gc-world-progress-line b{color:#67e8f9}.gc-route{display:grid;grid-template-columns:repeat(10,1fr);gap:5px;margin-top:9px}.gc-route i{height:8px;border-radius:999px;background:rgba(255,255,255,.07);box-shadow:inset 0 1px rgba(255,255,255,.05)}.gc-route i.done{background:linear-gradient(90deg,#22d3ee,#6366f1)}.gc-route i.current{background:linear-gradient(90deg,#ec4899,#f59e0b);box-shadow:0 0 12px rgba(236,72,153,.45)}
.gc-daily{display:flex;align-items:center;gap:10px;border:1px solid rgba(34,211,238,.16);background:linear-gradient(110deg,rgba(8,47,73,.46),rgba(15,23,42,.58));border-radius:15px;padding:10px 11px}.gc-daily-icon{width:39px;height:39px;border-radius:12px;display:grid;place-items:center;background:rgba(34,211,238,.12);border:1px solid rgba(103,232,249,.2);font-size:18px}.gc-daily-copy{flex:1;min-width:0}.gc-daily-copy b{display:block;font-size:10px}.gc-daily-copy span{display:block;margin-top:2px;color:#94a3b8;font-size:8px}.gc-daily-reward{color:#fbbf24;font-size:10px;font-weight:900}
.gc-game{padding:8px;display:grid;grid-template-rows:auto auto minmax(0,1fr) auto;gap:6px}.gc-top{border:1px solid rgba(255,255,255,.09);border-radius:16px;padding:8px 9px;background:rgba(9,14,31,.78);backdrop-filter:blur(14px);box-shadow:0 8px 26px rgba(0,0,0,.22)}.gc-top-row{display:flex;align-items:center;gap:7px}.gc-icon-btn{width:32px;height:32px;border-radius:10px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.05);color:#cbd5e1;cursor:pointer;display:grid;place-items:center;font-weight:900;flex:0 0 auto}.gc-level-info{min-width:82px}.gc-level-info b{display:block;font-size:11px}.gc-level-info span{display:block;margin-top:3px;color:#64748b;font-size:7px;text-transform:uppercase;letter-spacing:.9px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.gc-stats{display:flex;flex:1;justify-content:center;min-width:0}.gc-stat{min-width:54px;padding:0 6px;text-align:center;border-left:1px solid rgba(255,255,255,.06)}.gc-stat small{display:block;color:#64748b;font-size:6.5px;text-transform:uppercase;letter-spacing:.9px;font-weight:850}.gc-stat b{display:block;margin-top:2px;font-size:15px;font-variant-numeric:tabular-nums}.gc-objectives{display:flex;align-items:stretch;gap:5px;margin-top:7px;width:100%}.gc-objective{flex:1 1 0;min-width:0;padding:5px 6px;border:1px solid rgba(255,255,255,.055);border-radius:9px;background:rgba(255,255,255,.033)}.gc-objective-line{display:flex;align-items:center;justify-content:space-between;gap:4px;font-size:7px;color:#94a3b8;font-weight:800}.gc-objective-line b{color:#e2e8f0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.gc-objective-track{height:4px;margin-top:4px;border-radius:4px;background:rgba(255,255,255,.055);overflow:hidden}.gc-objective-track i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#22d3ee,#8b5cf6,#ec4899);transition:width .32s}.gc-rift-meter{display:flex;align-items:center;gap:8px;padding:6px 8px;border:1px solid rgba(34,211,238,.1);border-radius:12px;background:rgba(8,47,73,.22)}.gc-rift-meter span{font-size:7px;text-transform:uppercase;letter-spacing:1px;color:#67e8f9;font-weight:900}.gc-meter-track{flex:1;height:7px;border-radius:7px;background:rgba(255,255,255,.07);overflow:hidden}.gc-meter-track i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#22d3ee,#8b5cf6,#ec4899);box-shadow:0 0 12px rgba(34,211,238,.34);transition:width .3s}.gc-rift-meter b{min-width:34px;text-align:right;font-size:8px;color:#c4b5fd}
.gc-content{min-height:0;display:flex;align-items:center;justify-content:center}.gc-board-shell{position:relative;width:min(100%,calc(100dvh - 260px));max-width:590px;aspect-ratio:1;border-radius:21px;padding:8px;background:linear-gradient(145deg,rgba(27,39,72,.88),rgba(6,10,26,.96));border:1px solid rgba(255,255,255,.1);box-shadow:0 28px 70px rgba(0,0,0,.48),0 0 55px rgba(99,102,241,.1),inset 0 1px rgba(255,255,255,.08)}.gc-board-shell::before{content:"";position:absolute;inset:8px;border-radius:15px;pointer-events:none;background:radial-gradient(circle at 50% 50%,rgba(99,102,241,.07),transparent 65%)}.gc-board{position:relative;width:100%;height:100%;display:grid;grid-template-columns:repeat(8,1fr);grid-template-rows:repeat(8,1fr);gap:4px}.gc-cell{position:relative;min-width:0;min-height:0;border:0;padding:0;border-radius:13px;background:rgba(255,255,255,.025);cursor:pointer;touch-action:none;overflow:visible}.gc-cell:nth-child(odd){background:rgba(255,255,255,.038)}.gc-cell:focus-visible{outline:2px solid #67e8f9;outline-offset:1px}.gc-cell.selected{box-shadow:0 0 0 2px rgba(255,255,255,.86),0 0 20px rgba(103,232,249,.46);z-index:6}.gc-cell.hint{animation:gc-hint .72s ease-in-out 2;z-index:5}.gc-cell.clearing .gc-gem{animation:gc-gem-clear .22s ease-in forwards}.gc-cell.forged .gc-gem{animation:gc-forge .52s cubic-bezier(.22,.86,.28,1)}.gc-cell.new .gc-gem{animation:gc-gem-new .34s cubic-bezier(.22,.72,.16,1)}
.gc-layer{position:absolute;inset:3px;border-radius:11px;pointer-events:none}.gc-layer.rift{z-index:0;border:1px solid rgba(192,132,252,.44);background:repeating-radial-gradient(circle at 50% 50%,rgba(88,28,135,.56) 0 2px,rgba(30,27,75,.25) 3px 7px);box-shadow:inset 0 0 14px rgba(168,85,247,.5);animation:gc-rift-pulse 1.7s ease-in-out infinite}.gc-layer.rift.two{border-color:rgba(244,114,182,.6);box-shadow:inset 0 0 18px rgba(236,72,153,.6)}.gc-layer.frost{z-index:4;border:2px solid rgba(186,230,253,.56);background:linear-gradient(145deg,rgba(224,242,254,.25),rgba(56,189,248,.08));box-shadow:inset 0 0 12px rgba(186,230,253,.36);clip-path:polygon(4% 13%,31% 2%,50% 12%,73% 3%,96% 22%,91% 53%,99% 78%,74% 96%,42% 89%,16% 98%,2% 70%,9% 42%)}.gc-layer.frost.two::after{content:"";position:absolute;inset:5px;border:1px solid rgba(255,255,255,.58);clip-path:inherit}
.gc-gem{position:absolute;inset:10%;z-index:2;display:grid;place-items:center;filter:drop-shadow(0 8px 8px rgba(0,0,0,.42));transition:transform .14s,filter .14s}.gc-cell:hover .gc-gem{transform:translateY(-2px) scale(1.04);filter:drop-shadow(0 10px 10px rgba(0,0,0,.52)) brightness(1.08)}.gc-gem::before{content:"";position:absolute;inset:0;background:var(--gem);clip-path:var(--shape);border-radius:var(--radius,0);box-shadow:inset 0 3px 0 rgba(255,255,255,.34),inset 0 -5px 8px rgba(0,0,0,.24),0 0 16px var(--glow)}.gc-gem::after{content:"";position:absolute;inset:13% 18% 48%;background:linear-gradient(160deg,rgba(255,255,255,.8),rgba(255,255,255,.08));clip-path:var(--shape);border-radius:inherit;opacity:.55}.gc-gem.ruby{--gem:linear-gradient(145deg,#ff9aa7,#ff3159 48%,#a30d32);--glow:rgba(255,49,89,.52);--shape:polygon(50% 100%,7% 54%,7% 27%,26% 9%,50% 23%,74% 9%,93% 27%,93% 54%)}.gc-gem.sapphire{--gem:linear-gradient(145deg,#b8efff,#26b9ff 48%,#0758bb);--glow:rgba(38,185,255,.52);--shape:polygon(50% 0,96% 50%,50% 100%,4% 50%)}.gc-gem.emerald{--gem:linear-gradient(145deg,#a7f3d0,#25d68f 48%,#08764f);--glow:rgba(37,214,143,.5);--shape:polygon(24% 3%,76% 3%,98% 50%,76% 97%,24% 97%,2% 50%)}.gc-gem.sunstone{--gem:linear-gradient(145deg,#fff1a8,#ffbd24 48%,#d56a05);--glow:rgba(255,189,36,.52);--shape:polygon(50% 0,61% 31%,95% 20%,72% 49%,100% 67%,65% 66%,62% 100%,47% 70%,20% 94%,30% 60%,0 42%,35% 39%)}.gc-gem.amethyst{--gem:linear-gradient(145deg,#ead7ff,#b75cff 48%,#6120a9);--glow:rgba(183,92,255,.56);--shape:polygon(50% 0,90% 24%,100% 70%,50% 100%,0 70%,10% 24%)}.gc-gem.moonstone{--gem:radial-gradient(circle at 32% 24%,#fff 0 5%,#b5c8ff 15%,#6e7cff 52%,#312e81);--glow:rgba(129,140,248,.56);--shape:circle(48%);--radius:50%}.gc-gem-glyph{position:relative;z-index:3;color:rgba(255,255,255,.58);font-size:clamp(10px,2.2vw,18px);font-weight:950;text-shadow:0 1px 2px rgba(0,0,0,.3)}.gc-power{position:absolute;z-index:5;inset:15%;display:grid;place-items:center;border-radius:50%;border:2px solid rgba(255,255,255,.88);color:#fff;font-size:clamp(10px,2.3vw,20px);font-weight:950;text-shadow:0 1px 4px #000;box-shadow:0 0 18px rgba(255,255,255,.72),inset 0 0 14px rgba(255,255,255,.22)}.gc-power.prism{inset:6%;border:0;background:conic-gradient(#22d3ee,#6366f1,#a855f7,#ec4899,#f59e0b,#34d399,#22d3ee);padding:4px;animation:gc-rift-pulse 1s ease-in-out infinite}.gc-power.prism::after{content:"✧";width:100%;height:100%;border-radius:50%;display:grid;place-items:center;background:#11152d;color:#fff}.gc-power.hline::after{content:"↔"}.gc-power.vline::after{content:"↕"}.gc-power.bomb::after{content:"✹"}
.gc-flow-pop{position:absolute;left:50%;top:50%;z-index:25;pointer-events:none;font-size:26px;font-weight:950;color:#fff;text-shadow:0 0 22px #a855f7,0 3px 10px rgba(0,0,0,.72);animation:gc-flow .85s ease forwards}.gc-boosters{display:grid;grid-template-columns:minmax(0,1.35fr) repeat(3,minmax(0,1fr));gap:6px}.gc-charge{padding:8px;border-radius:13px;border:1px solid rgba(34,211,238,.13);background:rgba(8,47,73,.24)}.gc-charge-line{display:flex;justify-content:space-between;gap:6px;font-size:7px;text-transform:uppercase;letter-spacing:.9px;color:#67e8f9;font-weight:900}.gc-charge-track{height:6px;margin-top:6px;border-radius:6px;background:rgba(255,255,255,.07);overflow:hidden}.gc-charge-track i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#22d3ee,#8b5cf6,#ec4899);transition:width .3s}.gc-booster{min-width:0;padding:7px 4px;border-radius:13px;border:1px solid rgba(255,255,255,.08);background:rgba(15,23,42,.64);color:#94a3b8;cursor:pointer;text-align:center}.gc-booster:not(:disabled):hover{border-color:rgba(103,232,249,.42);color:#fff}.gc-booster:disabled{opacity:.42;cursor:not-allowed}.gc-booster b{display:block;font-size:8px;color:#e2e8f0}.gc-booster span{display:block;margin-top:3px;font-size:6.5px}.gc-booster.active{border-color:#fbbf24;color:#fbbf24;box-shadow:0 0 18px rgba(251,191,36,.14)}
.gc-side{display:none}.gc-overlay{position:absolute;inset:0;z-index:1400;display:grid;place-items:center;padding:14px;background:rgba(2,6,23,.75);backdrop-filter:blur(14px)}.gc-modal{width:min(420px,100%);max-height:calc(100% - 8px);overflow:auto;padding:20px;border-radius:23px;border:1px solid rgba(255,255,255,.12);background:linear-gradient(160deg,rgba(22,31,58,.98),rgba(8,12,28,.98));box-shadow:0 30px 90px rgba(0,0,0,.65),inset 0 1px rgba(255,255,255,.08);animation:gc-modal .24s ease}.gc-modal-icon{width:58px;height:58px;margin:0 auto 10px;border-radius:18px;display:grid;place-items:center;font-size:28px;background:linear-gradient(145deg,#22d3ee,#8b5cf6,#ec4899);box-shadow:0 15px 38px rgba(99,102,241,.3)}.gc-modal h2{text-align:center;margin:0;font-size:24px;letter-spacing:-.5px}.gc-modal>p{text-align:center;margin:7px auto 0;color:#94a3b8;font-size:10px;line-height:1.5;max-width:340px}.gc-stars{text-align:center;margin:13px 0 8px;font-size:30px;letter-spacing:5px;color:#fbbf24;text-shadow:0 0 18px rgba(251,191,36,.44)}.gc-rating-score{text-align:center;font-size:9px;color:#64748b}.gc-rating-score b{color:#fff;font-size:20px;margin-right:3px}.gc-breakdown{display:grid;grid-template-columns:repeat(auto-fit,minmax(62px,1fr));gap:6px;margin:11px 0}.gc-breakdown div{padding:9px 5px;border-radius:11px;border:1px solid rgba(255,255,255,.06);background:rgba(255,255,255,.035);text-align:center}.gc-breakdown small{display:block;color:#64748b;font-size:7px;text-transform:uppercase;letter-spacing:.8px;font-weight:850}.gc-breakdown b{display:block;margin-top:3px;font-size:14px}.gc-actions{display:flex;gap:8px;margin-top:14px}.gc-actions button{flex:1;min-height:42px;border-radius:13px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.05);color:#cbd5e1;cursor:pointer;font-weight:900;font-size:10px}.gc-actions button.primary{background:linear-gradient(115deg,#ec4899,#8b5cf6,#2563eb);color:#fff}.gc-help-copy{text-align:left!important}.gc-help-copy h3{margin:13px 0 4px;color:#c084fc;font-size:10px;text-transform:uppercase;letter-spacing:1px}.gc-help-copy p,.gc-help-copy li{color:#cbd5e1;font-size:9px;line-height:1.55}.gc-help-copy ul{padding-left:18px;margin:4px 0}.gc-paused{display:none;position:absolute;inset:0;z-index:1000;place-items:center;background:rgba(2,6,23,.68);backdrop-filter:blur(8px);font-size:20px;font-weight:950;text-transform:uppercase;letter-spacing:2px}.gc-root.is-paused .gc-paused{display:grid}
@container gemcrush (max-width:420px){.gc-menu{padding:13px;gap:9px}.gc-logo-mark{width:43px;height:43px}.gc-title{font-size:21px}.gc-profile-chip{min-width:47px;padding:6px}.gc-hero{padding:13px}.gc-world-name{font-size:21px}.gc-world-desc{max-width:250px}.gc-stage-orb{width:57px;height:57px;font-size:20px}.gc-menu-grid{grid-template-columns:1fr}.gc-game{padding:5px;padding-bottom:max(56px,env(safe-area-inset-bottom));gap:4px;grid-template-rows:auto auto auto auto;align-content:start}.gc-content{align-items:flex-start;padding-top:3px}.gc-top{padding:6px}.gc-stat{min-width:42px;padding:0 4px}.gc-stat b{font-size:13px}.gc-level-info{min-width:66px}.gc-objectives{gap:3px}.gc-objective{padding:4px}.gc-board-shell{width:min(100%,calc(100dvh - 246px));padding:5px;border-radius:17px}.gc-board{gap:3px}.gc-cell{border-radius:10px}.gc-boosters{grid-template-columns:1.25fr repeat(3,1fr);gap:4px}.gc-charge{padding:6px}.gc-booster{padding:6px 2px}}
@container gemcrush (min-width:900px) and (min-height:650px){.gc-menu{display:grid;grid-template-columns:minmax(0,760px);grid-template-rows:auto auto auto auto;justify-content:center;align-content:start;row-gap:14px;padding:28px 26px 24px}.gc-brand,.gc-hero,.gc-menu-side,.gc-daily{grid-column:1}.gc-hero{align-self:stretch;padding:22px;display:flex;flex-direction:column;justify-content:center}.gc-world-name{font-size:38px}.gc-world-desc{font-size:13px;max-width:430px}.gc-stage-orb{width:92px;height:92px;font-size:32px}.gc-objective-preview{margin-top:22px}.gc-hero-visual{display:block;min-height:220px;margin:18px 0}.gc-primary{margin-top:16px;min-height:56px}.gc-menu-side{display:flex;flex-direction:column;gap:12px}.gc-menu-grid{grid-template-columns:1fr 1fr;gap:12px}.gc-menu-card{padding:14px}.gc-stage-nav button{width:40px;height:40px}.gc-daily{margin-top:2px}.gc-game{grid-template-columns:240px minmax(500px,690px) 220px;grid-template-rows:auto minmax(0,1fr);grid-template-areas:"top top top" "left board right";justify-content:center;align-content:center;gap:12px;padding:16px 22px}.gc-top{grid-area:top;max-width:1150px;width:100%;justify-self:center}.gc-rift-meter{display:none}.gc-content{grid-area:board}.gc-board-shell{width:min(100%,72vh);max-width:690px}.gc-boosters{grid-area:right;display:flex;flex-direction:column;align-self:center}.gc-charge{padding:13px}.gc-booster{min-height:68px;display:grid;place-items:center}.gc-booster b{font-size:11px}.gc-booster span{font-size:8px}.gc-side{display:flex;grid-area:left;align-self:center;flex-direction:column;gap:10px}.gc-side-card{padding:14px;border-radius:17px;border:1px solid rgba(255,255,255,.08);background:rgba(15,23,42,.62)}.gc-side-card small{display:block;color:#64748b;font-size:8px;text-transform:uppercase;letter-spacing:1.1px;font-weight:900}.gc-side-card b{display:block;margin-top:4px;font-size:17px}.gc-side-card p{margin:6px 0 0;color:#8492a7;font-size:9px;line-height:1.45}.gc-side .gc-rift-meter{display:flex}.gc-objectives{display:flex}}
`;
  document.head.appendChild(style);
}

export { BoardCore, buildStage, calculateRating, createSeededRandom };

export default function activate(host) {
  ensureStyles();
  const arcade = createArcade(host, {
    id: 'gem-crush-riftfall',
    name: 'Gem Crush Odyssey',
    icon: '💎',
    subtitle: 'An 80-stage rift campaign built around powers, cascades, and mastery',
    modes: [
      { id: 'campaign', name: 'Campaign', icon: '◆', desc: 'Eighty objective-driven stages', unlock: 1 },
      { id: 'rush', name: 'Rift Rush', icon: '⚡', desc: 'Ninety-second score attack', unlock: 3 },
      { id: 'endless', name: 'Infinite Rift', icon: '∞', desc: 'Escalating waves and corruption', unlock: 6 },
    ],
    perks: [
      { id: 'time', name: 'Time Shard', icon: '◷', desc: '+3 campaign moves or +10 rush seconds', unlock: 1 },
      { id: 'special', name: 'Prism Seed', icon: '✦', desc: 'Begin with a forged Prism Core', unlock: 3 },
      { id: 'combo', name: 'Cascade Bank', icon: '×2', desc: 'Cascades score 25% more and charge faster', unlock: 5 },
    ],
    missions: [
      { event: 'gem', target: 240, title: 'Gem Collector', detail: 'Clear 240 gems', icon: '💎', reward: 95 },
      { event: 'combo', target: 42, title: 'Cascade Artist', detail: 'Build 42 cascade points', icon: '✦', reward: 115 },
      { event: 'level', target: 5, title: 'Rift Walker', detail: 'Complete five stages', icon: '🌀', reward: 130 },
    ],
  });

  const runtime = host.runtime;
  const profile = {
    version: 3,
    currentStage: 1,
    bestStage: 1,
    stageStars: {},
    bestRush: 0,
    endlessWave: 1,
    totalStars: 0,
  };
  let root = null;
  let appLayer = null;
  let board = null;
  let stageConfig = null;
  let modeId = 'campaign';
  let perkId = 'time';
  let selected = null;
  let hintCells = [];
  let busy = false;
  let hammerMode = false;
  let currentScreen = 'menu';
  let resizeObserver = null;
  let hintTimer = null;
  let countdownTimer = null;
  let paused = false;
  let audio = null;
  let pointerStart = null;
  let suppressClickUntil = 0;
  let screenToken = 0;
  const pendingTimers = new Set();
  const run = {
    score: 0,
    moves: 0,
    startMoves: 0,
    time: 0,
    startTime: 0,
    charge: 0,
    cascade: 0,
    bestCascade: 0,
    powers: 0,
    frost: 0,
    rifts: 0,
    collected: Array(TYPE_META.length).fill(0),
    invalid: 0,
    wave: 1,
  };

  const schedule = (fn, delay) => {
    const token = screenToken;
    let id = null;
    id = setTimeout(() => {
      pendingTimers.delete(id);
      if (token === screenToken) fn();
    }, delay);
    pendingTimers.add(id);
    return id;
  };
  const wait = (delay) => new Promise((resolve) => schedule(resolve, delay));
  const clearScheduled = () => {
    for (const id of pendingTimers) clearTimeout(id);
    pendingTimers.clear();
  };
  const advanceScreen = () => {
    screenToken++;
    clearScheduled();
    if (countdownTimer != null) cancelAnimationFrame(countdownTimer);
    countdownTimer = null;
    if (hintTimer != null) clearTimeout(hintTimer);
    hintTimer = null;
    busy = false;
    selected = null;
    hintCells = [];
    hammerMode = false;
  };

  function initAudio() {
    if (audio) return audio;
    try { audio = new (window.AudioContext || window.webkitAudioContext)(); }
    catch { audio = null; }
    return audio;
  }
  function tone(frequency, duration = .08, type = 'sine', volume = .045, delay = 0) {
    const context = initAudio();
    if (!context) return;
    if (context.state === 'suspended') context.resume().catch(() => {});
    const now = context.currentTime + delay;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(.001, now + duration);
    oscillator.connect(gain); gain.connect(context.destination);
    oscillator.start(now); oscillator.stop(now + duration);
  }
  const sfx = {
    select: () => tone(720, .045, 'sine', .035),
    swap: () => { tone(360, .055, 'triangle', .035); tone(620, .07, 'triangle', .03, .03); },
    fail: () => { tone(210, .11, 'sawtooth', .025); tone(165, .12, 'sawtooth', .02, .05); },
    match: (cascade) => { const base = 500 + Math.min(cascade, 7) * 72; tone(base, .08, 'sine', .045); tone(base * 1.25, .09, 'triangle', .035, .045); },
    power: () => { tone(580, .08, 'square', .035); tone(900, .1, 'triangle', .045, .04); tone(1260, .12, 'sine', .04, .085); },
    win: () => [523, 659, 784, 1047, 1319].forEach((frequency, index) => tone(frequency, .16, 'sine', .06, index * .07)),
    lose: () => [330, 260, 200, 145].forEach((frequency, index) => tone(frequency, .22, 'triangle', .04, index * .1)),
  };

  function saveProfile() {
    profile.totalStars = Object.values(profile.stageStars).reduce((sum, value) => sum + Number(value || 0), 0);
    host.storage.set(PROFILE_KEY, profile).catch(() => {});
  }
  async function loadProfile() {
    try {
      const data = await host.storage.get(PROFILE_KEY);
      if (data && typeof data === 'object') Object.assign(profile, data);
    } catch { /* fresh profile */ }
    profile.currentStage = clamp(Number(profile.currentStage) || 1, 1, MAX_STAGE);
    profile.bestStage = clamp(Number(profile.bestStage) || 1, 1, MAX_STAGE);
    if (!profile.stageStars || typeof profile.stageStars !== 'object') profile.stageStars = {};
    profile.totalStars = Object.values(profile.stageStars).reduce((sum, value) => sum + Number(value || 0), 0);
  }

  function objectiveProgress(objective) {
    if (objective.kind === 'score') return run.score;
    if (objective.kind === 'collect') return run.collected[objective.type] || 0;
    if (objective.kind === 'frost') return run.frost;
    if (objective.kind === 'rift') return run.rifts;
    if (objective.kind === 'power') return run.powers;
    if (objective.kind === 'cascade') return run.bestCascade;
    return 0;
  }
  function objectiveComplete(objective) { return objectiveProgress(objective) >= objective.target; }
  function allObjectivesComplete() { return stageConfig.objectives.every(objectiveComplete); }
  function objectivePreview(objective) {
    const label = objective.kind === 'score' ? formatNumber(objective.target) : objective.target;
    return `<div class="gc-pill"><i>${objective.icon}</i><span>${objective.label}</span><b>${label}</b></div>`;
  }

  function renderMenu() {
    advanceScreen();
    currentScreen = 'menu';
    modeId = arcade.mode().id;
    perkId = arcade.perk().id;
    stageConfig = buildStage(profile.currentStage, modeId);
    const world = stageConfig.world;
    const selectedStars = Number(profile.stageStars[profile.currentStage] || 0);
    appLayer.innerHTML = '';
    const menu = element('div', 'gc-screen gc-menu');
    const mode = arcade.mode();
    const perk = arcade.perk();
    menu.innerHTML = `
      <div class="gc-brand">
        <div class="gc-logo"><div class="gc-logo-mark">◆</div><div><div class="gc-title">Gem Crush</div><div class="gc-kicker">Riftfall Odyssey</div></div></div>
        <div class="gc-profile"><div class="gc-profile-chip"><small>Rank</small><b>${arcade.profile.rank}</b></div><div class="gc-profile-chip"><small>Stars</small><b style="color:#fbbf24">★ ${profile.totalStars}</b></div></div>
      </div>
      <section class="gc-hero">
        <div class="gc-world-line"><div class="gc-world-copy"><div class="gc-world-tag">${mode.name} · World ${stageConfig.worldIndex + 1}</div><div class="gc-world-name">${stageConfig.title}</div><div class="gc-world-desc">${stageConfig.subtitle}</div></div><div class="gc-stage-orb">${modeId === 'campaign' ? profile.currentStage : mode.icon}</div></div>
        <div class="gc-objective-preview">${stageConfig.objectives.map(objectivePreview).join('')}</div>
        ${modeId === 'campaign' && selectedStars ? `<div class="gc-stars" style="font-size:18px;text-align:left;margin:13px 0 0">${'★'.repeat(selectedStars)}<span style="opacity:.18">${'★'.repeat(5 - selectedStars)}</span></div>` : ''}
        <div class="gc-hero-visual"><div class="gc-rift-preview"><span class="gc-orbit-gem one">◆</span><span class="gc-orbit-gem two">◇</span><span class="gc-orbit-gem three">⬢</span><span class="gc-orbit-gem four">⬟</span><div class="gc-rift-core"></div></div><div class="gc-world-progress"><div class="gc-world-progress-line"><span>World route</span><b>${stageConfig.chapterStage}/10</b></div><div class="gc-route">${Array.from({length:10},(_,index)=>`<i class="${index + 1 < stageConfig.chapterStage ? 'done' : index + 1 === stageConfig.chapterStage ? 'current' : ''}"></i>`).join('')}</div></div></div>
        <button class="gc-primary" data-action="play">${modeId === 'campaign' ? `Play stage ${profile.currentStage}` : `Start ${mode.name}`}</button>
      </section>
      <div class="gc-menu-side">
        <div class="gc-menu-grid">
          <div class="gc-menu-card"><div class="gc-menu-card-head"><span>Game mode</span><b>${mode.icon}</b></div><strong>${mode.name}</strong><p>${mode.desc}</p><button class="gc-secondary" data-action="arcade">Modes & perks</button></div>
          <div class="gc-menu-card"><div class="gc-menu-card-head"><span>Active perk</span><b>${perk.icon}</b></div><strong>${perk.name}</strong><p>${perk.desc}</p><button class="gc-secondary" data-action="arcade">Change loadout</button></div>
        </div>
        <div class="gc-menu-card"><div class="gc-menu-card-head"><span>Campaign navigator</span><b>${profile.bestStage}/${MAX_STAGE}</b></div><div class="gc-stage-nav"><button data-action="previous" aria-label="Previous stage">‹</button><div><small>Selected stage</small><b>${profile.currentStage}</b></div><button data-action="next" aria-label="Next stage">›</button></div></div>
      </div>
      <div class="gc-daily"><div class="gc-daily-icon">${arcade.profile.daily?.icon || '💎'}</div><div class="gc-daily-copy"><b>${arcade.profile.daily?.title || 'Daily challenge'}</b><span>${arcade.profile.daily?.detail || 'Keep playing to earn arcade coins.'}</span></div><div class="gc-daily-reward">${arcade.profile.daily?.claimed ? '✓' : `◆ ${arcade.profile.daily?.reward || 0}`}</div></div>`;
    appLayer.appendChild(menu);
    menu.querySelector('[data-action="play"]').addEventListener('click', startRun);
    menu.querySelectorAll('[data-action="arcade"]').forEach((button) => button.addEventListener('click', arcade.openHub));
    menu.querySelector('[data-action="previous"]').addEventListener('click', () => {
      profile.currentStage = Math.max(1, profile.currentStage - 1); saveProfile(); sfx.select(); renderMenu();
    });
    menu.querySelector('[data-action="next"]').addEventListener('click', () => {
      profile.currentStage = Math.min(profile.bestStage, profile.currentStage + 1); saveProfile(); sfx.select(); renderMenu();
    });
  }

  function resetRun() {
    const moveBonus = perkId === 'time' && modeId !== 'rush' ? 3 : 0;
    const timeBonus = perkId === 'time' && modeId === 'rush' ? 10 : 0;
    run.score = 0;
    run.moves = Number.isFinite(stageConfig.moves) ? stageConfig.moves + moveBonus : Infinity;
    run.startMoves = run.moves;
    run.time = Number.isFinite(stageConfig.seconds) ? stageConfig.seconds + timeBonus : Infinity;
    run.startTime = run.time;
    run.charge = 0;
    run.cascade = 0;
    run.bestCascade = 0;
    run.powers = 0;
    run.frost = 0;
    run.rifts = 0;
    run.collected = Array(TYPE_META.length).fill(0);
    run.invalid = 0;
    run.wave = modeId === 'endless' ? Math.max(1, profile.endlessWave || 1) : 1;
  }

  function startRun() {
    advanceScreen();
    currentScreen = 'game';
    modeId = arcade.mode().id;
    perkId = arcade.perk().id;
    const stageNumber = modeId === 'campaign' ? profile.currentStage : modeId === 'endless' ? Math.max(1, profile.endlessWave || 1) : profile.bestStage;
    stageConfig = buildStage(stageNumber, modeId);
    const runSeed = modeId === 'campaign' ? stageConfig.stage * 7919 + 32027 : Date.now() ^ (stageConfig.stage * 104729);
    board = new BoardCore(ROWS, COLS, stageConfig.types, createSeededRandom(runSeed));
    board.generate(stageConfig, perkId);
    resetRun();
    arcade.record('start', 1);
    renderGame();
    startCountdown();
  }

  function renderGame() {
    appLayer.innerHTML = '';
    const game = element('div', 'gc-screen gc-game');
    game.innerHTML = `
      <div class="gc-top">
        <div class="gc-top-row"><button class="gc-icon-btn" data-action="menu" aria-label="Return to menu">‹</button><div class="gc-level-info"><b>${modeId === 'campaign' ? `Stage ${stageConfig.stage}` : stageConfig.title}</b><span>${stageConfig.world[0]}</span></div><div class="gc-stats"><div class="gc-stat"><small>Score</small><b id="gc-score">0</b></div><div class="gc-stat"><small>${modeId === 'rush' ? 'Time' : 'Moves'}</small><b id="gc-limit" style="color:#fbbf24">0</b></div><div class="gc-stat"><small>Flow</small><b id="gc-flow" style="color:#c084fc">1×</b></div></div><button class="gc-icon-btn" data-action="hint" aria-label="Show hint">✧</button><button class="gc-icon-btn" data-action="help" aria-label="How to play">?</button></div>
        <div class="gc-objectives" id="gc-objectives"></div>
      </div>
      <div class="gc-rift-meter"><span>Rift charge</span><div class="gc-meter-track"><i id="gc-meter-top" style="width:0%"></i></div><b id="gc-charge-top">0%</b></div>
      <aside class="gc-side"><div class="gc-side-card"><small>Current contract</small><b>${stageConfig.title}</b><p>${stageConfig.subtitle}</p></div><div class="gc-side-card"><small>Best cascade</small><b id="gc-side-cascade">1×</b><p>Chain automatic matches to multiply score and recharge boosters.</p></div><div class="gc-rift-meter"><span>Rift charge</span><div class="gc-meter-track"><i id="gc-meter-side" style="width:0%"></i></div><b id="gc-charge-side">0%</b></div></aside>
      <div class="gc-content"><div class="gc-board-shell"><div class="gc-board" id="gc-board" role="grid" aria-label="Gem Crush board"></div></div></div>
      <div class="gc-boosters"><div class="gc-charge"><div class="gc-charge-line"><span>Rift charge</span><b id="gc-charge">0%</b></div><div class="gc-charge-track"><i id="gc-meter" style="width:0%"></i></div></div><button class="gc-booster" data-booster="hammer"><b>🔨 Hammer</b><span>35 charge</span></button><button class="gc-booster" data-booster="shuffle"><b>⟳ Shuffle</b><span>50 charge</span></button><button class="gc-booster" data-booster="nova"><b>✹ Nova</b><span>100 charge</span></button></div>
      <div class="gc-paused">Paused</div>`;
    appLayer.appendChild(game);
    bindGameEvents(game);
    renderBoard(true);
    updateUi();
  }

  function bindGameEvents(game) {
    game.querySelector('[data-action="menu"]').addEventListener('click', () => { if (!busy) renderMenu(); });
    game.querySelector('[data-action="hint"]').addEventListener('click', showHint);
    game.querySelector('[data-action="help"]').addEventListener('click', showHelp);
    game.querySelectorAll('[data-booster]').forEach((button) => button.addEventListener('click', () => useBooster(button.dataset.booster)));
    const boardNode = game.querySelector('#gc-board');
    boardNode.addEventListener('click', (event) => {
      if (performance.now() < suppressClickUntil) return;
      const cell = event.target.closest('[data-row]');
      if (!cell) return;
      handleCell(Number(cell.dataset.row), Number(cell.dataset.col));
    });
    boardNode.addEventListener('pointerdown', (event) => {
      const cell = event.target.closest('[data-row]');
      if (!cell) return;
      pointerStart = { row: Number(cell.dataset.row), col: Number(cell.dataset.col), x: event.clientX, y: event.clientY };
    });
    boardNode.addEventListener('pointerup', (event) => {
      if (!pointerStart || busy) { pointerStart = null; return; }
      const dx = event.clientX - pointerStart.x;
      const dy = event.clientY - pointerStart.y;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) { pointerStart = null; return; }
      const target = { row: pointerStart.row, col: pointerStart.col };
      if (Math.abs(dx) > Math.abs(dy)) target.col += dx > 0 ? 1 : -1;
      else target.row += dy > 0 ? 1 : -1;
      const source = { row: pointerStart.row, col: pointerStart.col };
      pointerStart = null;
      suppressClickUntil = performance.now() + 320;
      if (target.row >= 0 && target.row < ROWS && target.col >= 0 && target.col < COLS) attemptSwap(source, target);
    });
  }

  function gemHtml(gem) {
    const meta = TYPE_META[gem.type];
    const power = gem.power ? `<span class="gc-power ${gem.power}" title="${POWER_LABELS[gem.power]}"></span>` : '';
    return `<span class="gc-gem ${meta.className}"><span class="gc-gem-glyph">${meta.glyph}</span>${power}</span>`;
  }

  function renderBoard(animateNew = false, clearing = new Set()) {
    const node = root.querySelector('#gc-board');
    if (!node || !board) return;
    node.innerHTML = '';
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const gem = board.grid[row][col];
        const classes = ['gc-cell'];
        if (selected?.row === row && selected?.col === col) classes.push('selected');
        if (hintCells.some((cell) => cell.row === row && cell.col === col)) classes.push('hint');
        if (clearing.has(keyOf(row, col))) classes.push('clearing');
        if (gem?.forged) classes.push('forged');
        if (animateNew && gem?.isNew) classes.push('new');
        const cell = element('button', classes.join(' '));
        cell.type = 'button'; cell.dataset.row = row; cell.dataset.col = col;
        cell.setAttribute('role', 'gridcell');
        cell.setAttribute('aria-label', `${TYPE_META[gem.type].name}${gem.power ? `, ${POWER_LABELS[gem.power]}` : ''}`);
        const rift = board.rifts[row][col] ? `<span class="gc-layer rift ${board.rifts[row][col] > 1 ? 'two' : ''}"></span>` : '';
        const frost = board.frost[row][col] ? `<span class="gc-layer frost ${board.frost[row][col] > 1 ? 'two' : ''}"></span>` : '';
        cell.innerHTML = `${rift}${gemHtml(gem)}${frost}`;
        node.appendChild(cell);
        gem.isNew = false; gem.forged = false;
      }
    }
  }

  function objectiveHtml(objective) {
    const progress = objectiveProgress(objective);
    const pct = clamp(progress / objective.target * 100, 0, 100);
    const value = objective.kind === 'score' ? formatNumber(progress) : Math.floor(progress);
    const target = objective.kind === 'score' ? formatNumber(objective.target) : objective.target;
    return `<div class="gc-objective"><div class="gc-objective-line"><b>${objective.icon} ${objective.label}</b><span>${value}/${target}</span></div><div class="gc-objective-track"><i style="width:${pct}%"></i></div></div>`;
  }

  function updateUi() {
    const score = root.querySelector('#gc-score');
    const limit = root.querySelector('#gc-limit');
    const flow = root.querySelector('#gc-flow');
    const objectives = root.querySelector('#gc-objectives');
    if (score) score.textContent = formatNumber(run.score);
    if (limit) {
      limit.textContent = modeId === 'rush' ? `${Math.ceil(run.time)}s` : Number.isFinite(run.moves) ? run.moves : '∞';
      limit.style.color = modeId === 'rush' && run.time <= 12 ? '#fb7185' : '#fbbf24';
    }
    if (flow) flow.textContent = `${Math.max(1, run.cascade)}×`;
    if (objectives) objectives.innerHTML = stageConfig.objectives.map(objectiveHtml).join('');
    const charge = clamp(run.charge, 0, 100);
    ['gc-meter', 'gc-meter-top', 'gc-meter-side'].forEach((id) => { const meter = root.querySelector(`#${id}`); if (meter) meter.style.width = `${charge}%`; });
    ['gc-charge', 'gc-charge-top', 'gc-charge-side'].forEach((id) => { const label = root.querySelector(`#${id}`); if (label) label.textContent = `${Math.floor(charge)}%`; });
    const side = root.querySelector('#gc-side-cascade'); if (side) side.textContent = `${Math.max(1, run.bestCascade)}×`;
    root.querySelectorAll('[data-booster]').forEach((button) => {
      const cost = button.dataset.booster === 'hammer' ? 35 : button.dataset.booster === 'shuffle' ? 50 : 100;
      button.disabled = busy || run.charge < cost;
      button.classList.toggle('active', button.dataset.booster === 'hammer' && hammerMode);
    });
  }

  function handleCell(row, col) {
    if (busy || paused || currentScreen !== 'game') return;
    initAudio();
    if (hammerMode) { useHammer(row, col); return; }
    if (!selected) {
      selected = { row, col }; sfx.select(); renderBoard(); return;
    }
    const source = selected;
    if (source.row === row && source.col === col) { selected = null; renderBoard(); return; }
    const target = { row, col };
    if (Math.abs(source.row - row) + Math.abs(source.col - col) !== 1) {
      selected = target; sfx.select(); renderBoard(); return;
    }
    selected = null;
    hintCells = [];
    attemptSwap(source, target);
  }

  async function attemptSwap(a, b) {
    if (busy || paused) return;
    busy = true; selected = null; sfx.swap();
    const first = board.grid[a.row][a.col];
    const second = board.grid[b.row][b.col];
    const combo = board.specialCombo(a, b);
    board.swap(a, b);
    renderBoard();
    await wait(120);

    if (combo) {
      spendMove();
      run.cascade = 1;
      await resolveRemoval(combo.remove, new Map(), second?.type ?? first?.type, combo.label);
      await resolveCascades();
      return finishMove();
    }

    const result = board.findMatches(b);
    if (!result.matched.size) {
      board.swap(a, b);
      run.invalid++;
      sfx.fail();
      renderBoard();
      await wait(120);
      busy = false; updateUi(); return;
    }

    spendMove();
    run.cascade = 1;
    await resolveRemoval(result.matched, result.specialMap, first?.power === 'prism' ? second.type : second?.power === 'prism' ? first.type : null);
    await resolveCascades();
    finishMove();
  }

  function spendMove() {
    if (Number.isFinite(run.moves)) run.moves = Math.max(0, run.moves - 1);
  }

  async function resolveRemoval(baseSet, specialMap = new Map(), prismTargetType = null, announcement = '') {
    const removeSet = new Set(baseSet);
    const activated = board.expandSpecials(removeSet, prismTargetType);
    const clearing = new Set(removeSet);
    renderBoard(false, clearing);
    if (activated.length) { run.powers += activated.length; sfx.power(); arcade.record('power', activated.length); }
    else sfx.match(run.cascade);
    if (announcement) arcade.showToast('✦', announcement, `${removeSet.size} gems destabilized`);
    if (run.cascade > 1) showFlowPop(run.cascade);
    await wait(235);

    const specials = specialMap.size ? Array.from(specialMap.values()) : [];
    const result = board.clear(removeSet);
    for (const removed of result.removed) run.collected[removed.type]++;
    run.frost += result.frostHits;
    run.rifts += result.riftHits;
    const base = result.removed.length * 65;
    const multiplier = 1 + Math.max(0, run.cascade - 1) * .42;
    const perkMultiplier = perkId === 'combo' ? 1.25 : 1;
    const score = Math.round(base * multiplier * perkMultiplier + activated.length * 180);
    run.score += score;
    const chargeGain = result.removed.length * (perkId === 'combo' ? 1.45 : 1.15) + activated.length * 6;
    run.charge = clamp(run.charge + chargeGain, 0, 100);
    run.bestCascade = Math.max(run.bestCascade, run.cascade);
    arcade.record('gem', result.removed.length);
    arcade.record('combo', run.cascade);
    arcade.record('score', score);
    if (modeId === 'rush') run.time = Math.min(run.startTime + 25, run.time + Math.min(4.5, result.removed.length * .12 + Math.max(0, run.cascade - 1) * .7));

    board.collapseAndFill();
    for (const special of specials) board.forgeSpecial(special);
    renderBoard(true);
    updateUi();
    await wait(285);
  }

  async function resolveCascades() {
    while (true) {
      const result = board.findMatches();
      if (!result.matched.size) break;
      run.cascade++;
      await resolveRemoval(result.matched, result.specialMap);
    }
    if (!board.hasValidMove()) {
      board.shuffleUntilPlayable();
      renderBoard(true);
      arcade.showToast('⟳', 'Rift reshuffled', 'A fresh legal route has formed.');
      await wait(240);
    }
  }

  function finishMove() {
    busy = false;
    updateUi();
    if (allObjectivesComplete()) {
      if (modeId === 'campaign') return completeCampaignStage();
      if (modeId === 'endless') return completeEndlessWave();
    }
    if ((Number.isFinite(run.moves) && run.moves <= 0) || (modeId === 'rush' && run.time <= 0)) return failRun();
  }

  function showFlowPop(cascade) {
    const shell = root.querySelector('.gc-board-shell');
    if (!shell) return;
    const node = element('div', 'gc-flow-pop');
    node.textContent = `${cascade}× CASCADE`;
    shell.appendChild(node);
    schedule(() => node.remove(), 850);
  }

  function showHint() {
    if (busy || !board) return;
    const hint = board.findHint();
    if (!hint) return;
    hintCells = hint.map((cell) => ({ ...cell }));
    renderBoard();
    sfx.select();
    if (hintTimer != null) clearTimeout(hintTimer);
    hintTimer = schedule(() => { hintCells = []; renderBoard(); }, 1900);
  }

  function useBooster(kind) {
    if (busy) return;
    if (kind === 'hammer') {
      if (run.charge < 35) return;
      hammerMode = !hammerMode;
      arcade.showToast('🔨', hammerMode ? 'Hammer armed' : 'Hammer cancelled', hammerMode ? 'Select one gem or seal to shatter.' : 'No charge was spent.');
      updateUi();
      return;
    }
    if (kind === 'shuffle' && run.charge >= 50) {
      run.charge -= 50; board.shuffleUntilPlayable(); renderBoard(true); updateUi(); sfx.power();
      arcade.showToast('⟳', 'Board remixed', 'Every route has been rebuilt.');
      return;
    }
    if (kind === 'nova' && run.charge >= 100) {
      run.charge = 0; busy = true; run.cascade = 1;
      const type = board.mostCommonType();
      const set = new Set();
      for (let row = 0; row < ROWS; row++) for (let col = 0; col < COLS; col++) if (board.grid[row][col].type === type) set.add(keyOf(row, col));
      resolveRemoval(set, new Map(), null, `${TYPE_META[type].name} Nova`).then(resolveCascades).then(finishMove);
    }
  }

  async function useHammer(row, col) {
    if (run.charge < 35 || busy) return;
    hammerMode = false; run.charge -= 35; busy = true; run.cascade = 1; sfx.power();
    await resolveRemoval(new Set([keyOf(row, col)]), new Map(), null, 'Hammer strike');
    await resolveCascades();
    finishMove();
  }

  function startCountdown() {
    if (modeId !== 'rush') return;
    const token = screenToken;
    let last = performance.now();
    const tick = (time) => {
      if (token !== screenToken || currentScreen !== 'game') return;
      const delta = Math.min(.25, (time - last) / 1000); last = time;
      if (!paused && !busy) {
        run.time = Math.max(0, run.time - delta);
        updateUi();
        if (run.time <= 0) { failRun(); return; }
      }
      countdownTimer = requestAnimationFrame(tick);
    };
    countdownTimer = requestAnimationFrame(tick);
  }

  function completeCampaignStage() {
    if (currentScreen !== 'game') return;
    currentScreen = 'result'; busy = true; sfx.win(); arcade.record('level', 1);
    const rating = calculateRating(run, stageConfig, true);
    const previous = Number(profile.stageStars[stageConfig.stage] || 0);
    profile.stageStars[stageConfig.stage] = Math.max(previous, rating.stars);
    profile.bestStage = Math.max(profile.bestStage, Math.min(MAX_STAGE, stageConfig.stage + 1));
    profile.currentStage = Math.min(MAX_STAGE, stageConfig.stage + 1);
    saveProfile();
    showResult(true, rating);
  }

  function completeEndlessWave() {
    run.wave++;
    profile.endlessWave = Math.max(profile.endlessWave || 1, run.wave);
    run.moves += 12;
    stageConfig = buildStage(run.wave, 'endless');
    stageConfig.objectives[0].target += run.score;
    board.frost = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    board.rifts = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    const positions = board.shuffle(Array.from({ length: ROWS * COLS }, (_, index) => index));
    for (let index = 0; index < stageConfig.frostCount; index++) board.frost[Math.floor(positions[index] / COLS)][positions[index] % COLS] = 1;
    for (let index = 0; index < stageConfig.riftCount; index++) board.rifts[Math.floor(positions[(index + 17) % positions.length] / COLS)][positions[(index + 17) % positions.length] % COLS] = 1;
    arcade.record('level', 1); saveProfile(); renderGame(); updateUi();
    arcade.showToast('∞', `Wave ${run.wave}`, '+12 moves · corruption increased');
  }

  function failRun() {
    if (currentScreen !== 'game') return;
    currentScreen = 'result'; busy = true; sfx.lose(); arcade.record('fail', 1);
    if (modeId === 'rush') { profile.bestRush = Math.max(profile.bestRush || 0, run.score); saveProfile(); }
    showResult(false, calculateRating(run, stageConfig, false));
  }

  function showResult(completed, rating) {
    const overlay = element('div', 'gc-overlay');
    const stars = completed ? `${'★'.repeat(rating.stars)}<span style="opacity:.18">${'★'.repeat(5 - rating.stars)}</span>` : '◇';
    overlay.innerHTML = `<div class="gc-modal"><div class="gc-modal-icon">${completed ? '🏆' : '◈'}</div><h2>${completed ? rating.label : modeId === 'rush' ? 'Time collapsed' : 'Rift unresolved'}</h2><p>${completed ? `${stageConfig.title} is stable. Higher ratings require spare moves, score mastery, deep cascades, and useful powers.` : 'The run ended, but your best score and arcade progress are still saved.'}</p><div class="gc-stars">${stars}</div>${completed ? `<div class="gc-rating-score"><b>${rating.total}</b>/100 performance</div><div class="gc-breakdown"><div><small>Clear</small><b>${rating.completion}/20</b></div><div><small>Efficiency</small><b>${rating.efficiency}/30</b></div><div><small>Mastery</small><b>${rating.mastery}/25</b></div><div><small>Skill</small><b>${rating.skill}/20</b></div><div><small>Precision</small><b>${rating.precision}/5</b></div></div>` : ''}<div class="gc-breakdown"><div><small>Score</small><b>${formatNumber(run.score)}</b></div><div><small>Best flow</small><b style="color:#c084fc">${Math.max(1, run.bestCascade)}×</b></div><div><small>Powers</small><b style="color:#67e8f9">${run.powers}</b></div></div><div class="gc-actions"><button data-action="menu">Menu</button><button class="primary" data-action="again">${completed && modeId === 'campaign' ? 'Next stage' : 'Play again'}</button></div></div>`;
    appLayer.appendChild(overlay);
    overlay.querySelector('[data-action="menu"]').addEventListener('click', renderMenu);
    overlay.querySelector('[data-action="again"]').addEventListener('click', startRun);
  }

  function showHelp() {
    if (root.querySelector('.gc-overlay')) return;
    const overlay = element('div', 'gc-overlay');
    overlay.innerHTML = `<div class="gc-modal"><div class="gc-modal-icon">💎</div><h2>How Gem Crush works</h2><div class="gc-help-copy"><h3>Match and forge</h3><p>Swap adjacent gems to form lines of three or more. Every original matched gem clears. A newly forged power gem then appears with its own birth animation—nothing is accidentally left behind.</p><h3>Power gems</h3><ul><li>Four gems forge a Row Ray or Column Ray.</li><li>Five gems forge a Prism Core that clears one color.</li><li>T and L formations forge a Nova Gem.</li><li>Swap two power gems together to fuse their effects.</li></ul><h3>Rift contracts</h3><p>Campaign stages mix score, color collection, crystal seals, rifts, power activation, and cascade objectives. Clearing a gem over a seal damages the layer beneath it.</p><h3>Boosters</h3><p>Matches charge Hammer, Shuffle, and Nova. Boosters do not spend a move, but they must be earned during the run.</p></div><div class="gc-actions"><button class="primary" data-action="close">Got it</button></div></div>`;
    appLayer.appendChild(overlay);
    overlay.querySelector('[data-action="close"]').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (event) => { if (event.target === overlay) overlay.remove(); });
  }

  const removeArcadeChange = arcade.onChange(() => {
    if (currentScreen === 'menu') renderMenu();
    else arcade.showToast('◆', 'Loadout saved', 'Mode and perk apply to the next run.');
  });
  const removePause = runtime.lifecycle.onPause(() => { paused = true; root?.classList.add('is-paused'); });
  const removeResume = runtime.lifecycle.onResume(() => { paused = false; root?.classList.remove('is-paused'); });

  return {
    async mount(container) {
      await Promise.all([arcade.ready, loadProfile()]);
      root = element('div', 'gc-root');
      container.innerHTML = '';
      container.style.cssText = 'width:100%;height:100%;min-width:0;min-height:0;overflow:hidden;background:#070914;';
      container.appendChild(root);
      appLayer = element('div', 'gc-app');
      root.appendChild(appLayer);
      arcade.mount(root, container);
      renderMenu();
      if (window.ResizeObserver) {
        resizeObserver = new ResizeObserver(() => {
          if (currentScreen === 'game') requestAnimationFrame(() => renderBoard());
        });
        resizeObserver.observe(container);
      }
    },
    async unmount() {
      advanceScreen();
      removeArcadeChange?.(); removePause?.(); removeResume?.();
      resizeObserver?.disconnect(); resizeObserver = null;
      if (audio) { try { await audio.close(); } catch { /* ignore */ } audio = null; }
      arcade.cleanup();
      root = null; appLayer = null; board = null;
    },
  };
}
