function mulberry32(seed) {
  let a = seed >>> 0;
  return function rand() {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const DIRECTIONS = Object.freeze({
  LEFT: Object.freeze({ x: -1, y: 0, name: 'left' }),
  RIGHT: Object.freeze({ x: 1, y: 0, name: 'right' }),
  UP: Object.freeze({ x: 0, y: -1, name: 'up' }),
  DOWN: Object.freeze({ x: 0, y: 1, name: 'down' }),
  NONE: Object.freeze({ x: 0, y: 0, name: 'none' })
});

export const DIR_LIST = [DIRECTIONS.LEFT, DIRECTIONS.UP, DIRECTIONS.RIGHT, DIRECTIONS.DOWN];

export function opposite(dir) {
  if (!dir) return DIRECTIONS.NONE;
  if (dir.x === -1) return DIRECTIONS.RIGHT;
  if (dir.x === 1) return DIRECTIONS.LEFT;
  if (dir.y === -1) return DIRECTIONS.DOWN;
  if (dir.y === 1) return DIRECTIONS.UP;
  return DIRECTIONS.NONE;
}

export function tileKey(tile) {
  return `${tile.x},${tile.y}`;
}

export class MazeModel {
  constructor(level = 1, cols = 31, rows = 21) {
    this.level = level;
    this.cols = cols;
    this.rows = rows;
    this.tunnelRow = Math.floor(rows / 2);
    this.seed = 0xC0FFEE + level * 7919;
    this.rand = mulberry32(this.seed);
    this.grid = Array.from({ length: rows }, () => Array(cols).fill(1));
    this.generate();
  }

  generate() {
    const stack = [{ x: 1, y: 1 }];
    this.grid[1][1] = 0;
    const steps = [
      { x: 2, y: 0 },
      { x: -2, y: 0 },
      { x: 0, y: 2 },
      { x: 0, y: -2 }
    ];

    while (stack.length) {
      const current = stack[stack.length - 1];
      const shuffled = [...steps].sort(() => this.rand() - 0.5);
      let carved = false;
      for (const step of shuffled) {
        const nx = current.x + step.x;
        const ny = current.y + step.y;
        if (nx <= 0 || nx >= this.cols - 1 || ny <= 0 || ny >= this.rows - 1) continue;
        if (this.grid[ny][nx] === 0) continue;
        this.grid[current.y + step.y / 2][current.x + step.x / 2] = 0;
        this.grid[ny][nx] = 0;
        stack.push({ x: nx, y: ny });
        carved = true;
        break;
      }
      if (!carved) stack.pop();
    }

    // Add controlled loops so enemies can flank rather than only follow tree corridors.
    for (let y = 2; y < this.rows - 2; y++) {
      for (let x = 2; x < this.cols - 2; x++) {
        if (this.grid[y][x] !== 1 || this.rand() > 0.115 + this.level * 0.01) continue;
        const horizontal = this.grid[y][x - 1] === 0 && this.grid[y][x + 1] === 0;
        const vertical = this.grid[y - 1][x] === 0 && this.grid[y + 1][x] === 0;
        if (horizontal || vertical) this.grid[y][x] = 0;
      }
    }

    const cx = Math.floor(this.cols / 2);
    const cy = this.tunnelRow;

    // Central cyber-core / ghost bay. The open footprint keeps AI movement deterministic.
    for (let y = cy - 2; y <= cy + 2; y++) {
      for (let x = cx - 4; x <= cx + 4; x++) this.grid[y][x] = 0;
    }
    for (let y = cy - 4; y <= cy + 4; y++) this.grid[y][cx] = 0;

    // Horizontal warp tunnel.
    for (let x = 0; x < this.cols; x++) {
      if (x < 3 || x > this.cols - 4) this.grid[cy][x] = 0;
    }

    // Guaranteed player launch lane.
    const playerY = this.rows - 4;
    for (let x = cx - 2; x <= cx + 2; x++) this.grid[playerY][x] = 0;
    for (let y = cy + 2; y <= playerY; y++) this.grid[y][cx] = 0;

    this.playerSpawn = { x: cx, y: playerY };
    this.homeTile = { x: cx, y: cy };
    this.ghostSpawns = [
      { x: cx, y: cy - 1 },
      { x: cx - 2, y: cy },
      { x: cx + 2, y: cy },
      { x: cx, y: cy + 1 }
    ];

    this.powerTiles = [
      this.findNearestFloor({ x: 2, y: 2 }),
      this.findNearestFloor({ x: this.cols - 3, y: 2 }),
      this.findNearestFloor({ x: 2, y: this.rows - 3 }),
      this.findNearestFloor({ x: this.cols - 3, y: this.rows - 3 })
    ];

    this.specialTiles = [
      this.findNearestFloor({ x: Math.floor(this.cols * 0.25), y: Math.floor(this.rows * 0.5) }),
      this.findNearestFloor({ x: Math.floor(this.cols * 0.75), y: Math.floor(this.rows * 0.5) })
    ];
  }

  isInside(x, y) {
    return x >= 0 && x < this.cols && y >= 0 && y < this.rows;
  }

  isWalkable(x, y) {
    if (y === this.tunnelRow && (x < 0 || x >= this.cols)) return true;
    return this.isInside(x, y) && this.grid[y][x] === 0;
  }

  normalizeTile(tile) {
    let x = tile.x;
    if (tile.y === this.tunnelRow) {
      if (x < 0) x = this.cols - 1;
      if (x >= this.cols) x = 0;
    }
    return { x, y: tile.y };
  }

  nextTile(tile, dir) {
    return this.normalizeTile({ x: tile.x + dir.x, y: tile.y + dir.y });
  }

  canMove(tile, dir) {
    const rawX = tile.x + dir.x;
    const rawY = tile.y + dir.y;
    return this.isWalkable(rawX, rawY);
  }

  neighbors(tile) {
    return DIR_LIST
      .filter((dir) => this.canMove(tile, dir))
      .map((dir) => ({ dir, tile: this.nextTile(tile, dir) }));
  }

  isHomeRegion(tile) {
    const cx = Math.floor(this.cols / 2);
    return Math.abs(tile.x - cx) <= 4 && Math.abs(tile.y - this.tunnelRow) <= 2;
  }

  floorTiles() {
    const out = [];
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        if (this.grid[y][x] === 0) out.push({ x, y });
      }
    }
    return out;
  }

  findNearestFloor(target) {
    let best = null;
    let bestD = Infinity;
    for (const tile of this.floorTiles()) {
      if (this.isHomeRegion(tile)) continue;
      const d = Math.abs(tile.x - target.x) + Math.abs(tile.y - target.y);
      if (d < bestD) {
        bestD = d;
        best = tile;
      }
    }
    return best || { x: 1, y: 1 };
  }
}
