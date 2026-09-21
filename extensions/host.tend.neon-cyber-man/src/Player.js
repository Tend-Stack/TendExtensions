import { DIRECTIONS } from './Maze.js';
import { COLORS, addGlow } from './Visuals.js';

const INPUT_BUFFER_MS = 1100;
const CORNER_GRACE_PROGRESS = 0.38;

function sameDirection(a, b) {
  return Boolean(a && b && a.x === b.x && a.y === b.y);
}

function oppositeDirection(a, b) {
  return Boolean(a && b && a.x === -b.x && a.y === -b.y);
}

export class Player {
  constructor(scene, maze, tileToWorld, spawn, options = {}) {
    this.scene = scene;
    this.maze = maze;
    this.tileToWorld = tileToWorld;
    this.tile = { ...spawn };
    this.currentDir = DIRECTIONS.NONE;
    this.bufferedDir = DIRECTIONS.NONE;
    this.bufferedAt = -Infinity;
    this.targetTile = null;
    this.progress = 0;
    this.baseSpeed = (options.baseSpeed ?? 188) * (1 + (options.speedUpgrade ?? 0) * 0.05);
    this.dashUntil = 0;
    this.disabledUntil = 0;
    this.lastMovingAt = scene.time.now;
    this.trailColor = options.trailColor ?? COLORS.cyan;

    const p = tileToWorld(spawn);
    this.ring = scene.add.image(p.x, p.y, 'orb-ring').setBlendMode('ADD').setAlpha(0.58);
    this.sprite = scene.add.image(p.x, p.y, 'cyber-orb').setBlendMode('ADD');
    addGlow(this.sprite, this.trailColor, 4.8, 14);
    try { this.sprite.setLighting?.(true); } catch {}

    this.trail = scene.add.particles(p.x, p.y, 'spark', {
      lifespan: { min: 220, max: 420 },
      speed: { min: 6, max: 34 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.8, end: 0 },
      alpha: { start: 0.8, end: 0 },
      tint: this.trailColor,
      frequency: 24,
      quantity: 1,
      blendMode: 'ADD'
    });

    scene.tweens.add({
      targets: this.ring,
      alpha: { from: 0.26, to: 0.72 },
      scale: { from: 0.9, to: 1.13 },
      duration: 720,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  get direction() {
    return this.currentDir;
  }

  get moving() {
    return this.currentDir !== DIRECTIONS.NONE || this.targetTile != null;
  }

  get dashActive() {
    return this.scene.time.now < this.dashUntil;
  }

  get invulnerable() {
    return this.dashActive || this.scene.time.now < this.disabledUntil;
  }

  queueDirection(dir) {
    if (!dir || dir === DIRECTIONS.NONE) return;
    this.bufferedDir = dir;
    this.bufferedAt = this.scene.time.now;

    // Arcade-style turn assist: if a direction arrives just after we crossed
    // a tile center, allow a tiny correction back to that center and pivot.
    // At 26 px tiles this is < 10 px, so it feels responsive rather than like
    // a visible teleport. It removes the frustrating one-tile "missed turn".
    this.tryCornerGraceTurn();
  }

  tryCornerGraceTurn() {
    if (!this.targetTile || this.currentDir === DIRECTIONS.NONE) return false;
    if (sameDirection(this.bufferedDir, this.currentDir)) return false;

    // Reverse instantly and smoothly in a normal corridor. Swapping the
    // segment endpoints and mirroring progress preserves the exact world
    // position, so there is no snap or one-tile delay.
    if (oppositeDirection(this.bufferedDir, this.currentDir)) {
      const wraps = Math.abs(this.targetTile.x - this.tile.x) > 1;
      if (!wraps) {
        const previousTile = this.tile;
        this.tile = { ...this.targetTile };
        this.targetTile = { ...previousTile };
        this.currentDir = this.bufferedDir;
        this.progress = 1 - this.progress;
        this.bufferedDir = DIRECTIONS.NONE;
        return true;
      }
      return false;
    }

    if (this.progress > CORNER_GRACE_PROGRESS) return false;
    if (!this.maze.canMove(this.tile, this.bufferedDir)) return false;

    const center = this.tileToWorld(this.tile);
    this.currentDir = this.bufferedDir;
    this.targetTile = this.maze.nextTile(this.tile, this.currentDir);
    this.progress = 0;
    this.setWorld(center.x, center.y);
    this.bufferedDir = DIRECTIONS.NONE;
    return true;
  }

  activateDash(durationMs = 3600) {
    this.dashUntil = Math.max(this.dashUntil, this.scene.time.now + durationMs);
    this.scene.tweens.add({ targets: this.sprite, scaleX: 1.45, scaleY: 1.45, duration: 100, yoyo: true, repeat: 1 });
  }

  disableBriefly(durationMs = 900) {
    this.disabledUntil = Math.max(this.disabledUntil, this.scene.time.now + durationMs);
  }

  reset(spawn) {
    this.tile = { ...spawn };
    this.currentDir = DIRECTIONS.NONE;
    this.bufferedDir = DIRECTIONS.NONE;
    this.bufferedAt = -Infinity;
    this.targetTile = null;
    this.progress = 0;
    const p = this.tileToWorld(spawn);
    this.setWorld(p.x, p.y);
  }

  hasFreshBufferedDirection() {
    if (this.bufferedDir === DIRECTIONS.NONE) return false;
    if (this.scene.time.now - this.bufferedAt <= INPUT_BUFFER_MS) return true;
    this.bufferedDir = DIRECTIONS.NONE;
    return false;
  }

  chooseNextDirection() {
    if (this.hasFreshBufferedDirection() && this.maze.canMove(this.tile, this.bufferedDir)) {
      this.currentDir = this.bufferedDir;
      // Consume the intent once it has successfully produced a turn. The
      // current direction persists on its own, while stale input cannot cause
      // an unexpected turn several intersections later.
      this.bufferedDir = DIRECTIONS.NONE;
    }

    if (this.currentDir !== DIRECTIONS.NONE && this.maze.canMove(this.tile, this.currentDir)) {
      this.targetTile = this.maze.nextTile(this.tile, this.currentDir);
      this.progress = 0;
      return;
    }

    this.currentDir = DIRECTIONS.NONE;
    this.targetTile = null;
  }

  update(deltaMs) {
    this.ring.rotation += deltaMs * 0.0015;
    this.sprite.rotation -= deltaMs * 0.0007;

    if (this.scene.time.now < this.disabledUntil) return false;

    // Re-evaluate a fresh perpendicular input during the first part of a tile.
    // This also covers input that arrived between Phaser update ticks.
    if (this.hasFreshBufferedDirection()) this.tryCornerGraceTurn();

    if (!this.targetTile) this.chooseNextDirection();
    if (!this.targetTile) return false;

    const from = this.tileToWorld(this.tile);
    const to = this.tileToWorld(this.targetTile);
    const wraps = Math.abs(this.targetTile.x - this.tile.x) > 1;
    if (wraps) {
      this.tile = { ...this.targetTile };
      this.targetTile = null;
      this.progress = 0;
      this.setWorld(to.x, to.y);
      return true;
    }

    const speed = this.baseSpeed * (this.dashActive ? 1.58 : 1);
    const tileDistance = Math.max(1, Math.hypot(to.x - from.x, to.y - from.y));
    this.progress += (speed * (deltaMs / 1000)) / tileDistance;
    if (this.progress >= 1) {
      this.tile = { ...this.targetTile };
      this.targetTile = null;
      this.progress = 0;
      this.setWorld(to.x, to.y);
      this.lastMovingAt = this.scene.time.now;

      // Commit a buffered corner immediately at the tile center rather than
      // waiting a whole additional frame to decide the next segment.
      this.chooseNextDirection();
      return true;
    }

    const x = from.x + (to.x - from.x) * this.progress;
    const y = from.y + (to.y - from.y) * this.progress;
    this.setWorld(x, y);
    this.lastMovingAt = this.scene.time.now;
    return false;
  }

  setWorld(x, y) {
    this.sprite.setPosition(x, y);
    this.ring.setPosition(x, y);
    if (this.trail) this.trail.setPosition(x, y);
  }

  worldPosition() {
    return { x: this.sprite.x, y: this.sprite.y };
  }

  destroy() {
    this.trail?.destroy();
    this.ring?.destroy();
    this.sprite?.destroy();
  }
}
