import { DIRECTIONS, opposite } from './Maze.js';
import { COLORS, addGlow } from './Visuals.js';

const GHOSTS = Object.freeze({
  blinky: { color: 0xff345f, name: 'BLINK', role: 'Hunter' },
  pinky: { color: 0xff4fd8, name: 'PINK', role: 'Ambusher' },
  inky: { color: 0x00eaff, name: 'INK', role: 'Flanker' },
  clyde: { color: 0xffb347, name: 'CLYDE', role: 'Roamer' }
});

function manhattan(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function ahead(tile, dir, amount) {
  return { x: tile.x + dir.x * amount, y: tile.y + dir.y * amount };
}

export class Ghost {
  constructor(scene, maze, tileToWorld, identity, spawn, scatterTile, options = {}) {
    this.scene = scene;
    this.maze = maze;
    this.tileToWorld = tileToWorld;
    this.identity = identity;
    this.meta = GHOSTS[identity];
    this.tile = { ...spawn };
    this.home = { ...maze.homeTile };
    this.scatterTile = { ...scatterTile };
    this.currentDir = DIRECTIONS.LEFT;
    this.targetTile = null;
    this.progress = 0;
    this.state = 'scatter';
    this.baseSpeed = options.baseSpeed ?? 154;
    this.frozenUntil = 0;
    this.frightenedUntil = 0;
    this.pendingState = null;
    this.randomPhase = Math.random() * 10;

    const p = tileToWorld(spawn);
    this.aura = scene.add.image(p.x, p.y, 'ghost-aura').setTint(this.meta.color).setBlendMode('ADD').setAlpha(0.28);
    this.sprite = scene.add.image(p.x, p.y, 'cyber-ghost').setTint(this.meta.color);
    addGlow(this.sprite, this.meta.color, 3.8, 12);
    try { this.sprite.setLighting?.(true); } catch {}
    scene.tweens.add({
      targets: this.aura,
      scale: { from: 0.92, to: 1.25 },
      alpha: { from: 0.18, to: 0.46 },
      duration: 900 + Math.random() * 350,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  setState(state, until = 0) {
    if (this.state === 'eaten' && state !== 'eaten') {
      this.pendingState = state;
      return;
    }
    const changed = this.state !== state;
    this.state = state;
    if (state === 'frightened') this.frightenedUntil = until;
    if (changed && this.currentDir !== DIRECTIONS.NONE) this.currentDir = opposite(this.currentDir);
    this.refreshVisual();
  }

  freeze(until) {
    this.frozenUntil = Math.max(this.frozenUntil, until);
  }

  markEaten() {
    this.state = 'eaten';
    this.targetTile = null;
    this.sprite.setTint(COLORS.white).setAlpha(0.42);
    this.aura.setTint(COLORS.white).setAlpha(0.12);
  }

  refreshVisual() {
    if (this.state === 'frightened') {
      this.sprite.setTint(COLORS.violet).setAlpha(1);
      this.aura.setTint(0x9f7aea).setAlpha(0.42);
    } else if (this.state === 'eaten') {
      this.sprite.setTint(COLORS.white).setAlpha(0.42);
      this.aura.setTint(COLORS.white).setAlpha(0.12);
    } else {
      this.sprite.setTint(this.meta.color).setAlpha(1);
      this.aura.setTint(this.meta.color).setAlpha(0.28);
    }
  }

  computeTarget(ctx) {
    const player = ctx.player;
    if (this.state === 'eaten') return this.home;
    if (this.state === 'scatter') return this.scatterTile;
    if (this.state === 'frightened') return null;

    if (this.identity === 'blinky') return { ...player.tile };
    if (this.identity === 'pinky') return ahead(player.tile, player.direction, 4);
    if (this.identity === 'inky') {
      const pivot = ahead(player.tile, player.direction, 2);
      const b = ctx.blinky?.tile ?? player.tile;
      return { x: pivot.x * 2 - b.x, y: pivot.y * 2 - b.y };
    }
    if (this.identity === 'clyde') {
      return manhattan(this.tile, player.tile) > 8 ? { ...player.tile } : this.scatterTile;
    }
    return player.tile;
  }

  chooseDirection(ctx) {
    const neighbors = this.maze.neighbors(this.tile);
    if (!neighbors.length) {
      this.currentDir = DIRECTIONS.NONE;
      return;
    }

    const reverse = opposite(this.currentDir);
    let candidates = neighbors.filter((n) => !(n.dir.x === reverse.x && n.dir.y === reverse.y));
    if (!candidates.length) candidates = neighbors;

    if (this.state === 'frightened') {
      const playerTile = ctx.player.tile;
      candidates.sort((a, b) => manhattan(b.tile, playerTile) - manhattan(a.tile, playerTile));
      const pick = candidates[Math.min(candidates.length - 1, Math.floor((Math.sin(this.scene.time.now * 0.013 + this.randomPhase) + 1) * 0.5 * candidates.length))];
      this.currentDir = pick?.dir ?? candidates[0].dir;
      return;
    }

    const target = this.computeTarget(ctx) ?? ctx.player.tile;
    candidates.sort((a, b) => {
      const da = (a.tile.x - target.x) ** 2 + (a.tile.y - target.y) ** 2;
      const db = (b.tile.x - target.x) ** 2 + (b.tile.y - target.y) ** 2;
      if (da !== db) return da - db;
      return ['up', 'left', 'down', 'right'].indexOf(a.dir.name) - ['up', 'left', 'down', 'right'].indexOf(b.dir.name);
    });
    this.currentDir = candidates[0].dir;
  }

  update(deltaMs, ctx) {
    const now = this.scene.time.now;
    if (now < this.frozenUntil) {
      const pulse = 0.58 + Math.sin(now * 0.025) * 0.24;
      this.sprite.setAlpha(pulse);
      return false;
    }
    if (this.state !== 'eaten' && this.state === 'frightened' && now >= this.frightenedUntil) {
      this.setState(ctx.globalGhostState || 'chase');
    }
    if (this.state === 'frightened' && this.frightenedUntil - now < 1800) {
      const flash = Math.floor(now / 130) % 2 === 0;
      this.sprite.setTint(flash ? COLORS.white : COLORS.violet);
    }

    if (!this.targetTile) {
      this.chooseDirection(ctx);
      if (this.currentDir !== DIRECTIONS.NONE && this.maze.canMove(this.tile, this.currentDir)) {
        this.targetTile = this.maze.nextTile(this.tile, this.currentDir);
        this.progress = 0;
      }
    }
    if (!this.targetTile) return false;

    const from = this.tileToWorld(this.tile);
    const to = this.tileToWorld(this.targetTile);
    if (Math.abs(this.targetTile.x - this.tile.x) > 1) {
      this.tile = { ...this.targetTile };
      this.targetTile = null;
      this.setWorld(to.x, to.y);
      return true;
    }

    const factor = this.state === 'frightened' ? 0.66 : this.state === 'eaten' ? 1.75 : 1;
    const tileDistance = Math.max(1, Math.hypot(to.x - from.x, to.y - from.y));
    this.progress += (this.baseSpeed * factor * (deltaMs / 1000)) / tileDistance;
    if (this.progress >= 1) {
      this.tile = { ...this.targetTile };
      this.targetTile = null;
      this.progress = 0;
      this.setWorld(to.x, to.y);
      if (this.state === 'eaten' && manhattan(this.tile, this.home) === 0) {
        this.state = this.pendingState || ctx.globalGhostState || 'chase';
        this.pendingState = null;
        this.refreshVisual();
      }
      return true;
    }

    this.setWorld(from.x + (to.x - from.x) * this.progress, from.y + (to.y - from.y) * this.progress);
    return false;
  }

  setWorld(x, y) {
    this.sprite.setPosition(x, y);
    this.aura.setPosition(x, y);
  }

  worldPosition() {
    return { x: this.sprite.x, y: this.sprite.y };
  }

  destroy() {
    this.aura?.destroy();
    this.sprite?.destroy();
  }
}
