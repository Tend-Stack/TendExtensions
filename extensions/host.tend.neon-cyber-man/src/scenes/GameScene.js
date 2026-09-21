import { getContext, mutateProfile, saveProfile, setRunSummary } from '../RuntimeContext.js';
import { MazeModel, DIRECTIONS, tileKey } from '../Maze.js';
import { Player } from '../Player.js';
import { Ghost } from '../Ghost.js';
import { ChallengeManager } from '../ChallengeManager.js';
import { COLORS, addGlow, button, css, formatScore, neonText, roundedPanel } from '../Visuals.js';
import { audio } from '../AudioManager.js';

const LEVEL_PALETTES = [
  { wall: COLORS.cyan, accent: COLORS.magenta, name: 'NEXUS ZERO' },
  { wall: COLORS.magenta, accent: COLORS.cyan, name: 'AFTERGLOW' },
  { wall: COLORS.violet, accent: COLORS.magenta, name: 'BLACK ICE' }
];

export function createGameScene(Phaser) {
  return class GameScene extends Phaser.Scene {
    constructor() { super('Game'); }

    init(data) {
      this.level = Math.max(1, Math.min(3, Number(data?.level) || 1));
    }

    create() {
      this.ctx = getContext();
      this.profile = this.ctx.profile;
      this.palette = LEVEL_PALETTES[this.level - 1];
      this.maze = new MazeModel(this.level);
      this.tileSize = 26;
      this.originX = 37;
      this.originY = 111;
      this.score = 0;
      this.lives = 3;
      this.dashCharges = 0;
      this.empCharges = 0;
      this.ghostsEaten = 0;
      this.pelletsEaten = 0;
      this.started = false;
      this.pausedByUser = false;
      this.ending = false;
      this.gemSpawned = false;
      this.secondSpecialSpawned = false;
      this.globalGhostState = 'scatter';
      this.ghostPhaseIndex = 0;
      this.ghostPhaseStartedAt = 0;
      this.ghostPhases = [
        { state: 'scatter', duration: 7000 },
        { state: 'chase', duration: 20000 },
        { state: 'scatter', duration: 7000 },
        { state: 'chase', duration: 20000 },
        { state: 'scatter', duration: 5000 },
        { state: 'chase', duration: Infinity }
      ];

      this.cameras.main.setBackgroundColor(COLORS.bg);
      this.drawBackdrop();
      this.drawHudShell();
      this.drawMaze();
      this.buildCollectibles();
      const topCount = [...this.pellets.values()].filter((p) => p.tile.y < 7).length;
      this.challenge = new ChallengeManager({ topSectorPellets: topCount });
      this.challenge.start(this.time.now);
      this.totalPelletsAtStart = this.pellets.size;

      this.createEntities();
      this.configureLights();
      this.configureInput();
      this.createAbilityButtons();
      this.refreshHud();
      this.startCountdown();

      this.events.once('shutdown', () => this.cleanup());
      this.events.once('destroy', () => this.cleanup());
    }

    tileToWorld = (tile) => ({
      x: this.originX + tile.x * this.tileSize + this.tileSize / 2,
      y: this.originY + tile.y * this.tileSize + this.tileSize / 2
    });

    drawBackdrop() {
      const g = this.add.graphics();
      g.fillStyle(COLORS.bg, 1); g.fillRect(0, 0, 1280, 720);
      for (let i = 0; i < 90; i++) {
        const color = i % 4 === 0 ? this.palette.accent : this.palette.wall;
        g.fillStyle(color, 0.08 + Math.random() * 0.2);
        g.fillCircle(Math.random() * 1280, Math.random() * 720, Math.random() * 1.3 + 0.3);
      }
      g.lineStyle(1, 0x102337, 0.24);
      for (let x = 0; x < 1280; x += 42) g.lineBetween(x, 0, x, 720);
      for (let y = 0; y < 720; y += 42) g.lineBetween(0, y, 1280, y);
    }

    drawHudShell() {
      roundedPanel(this, 24, 20, 1232, 72, { fill: 0x06101b, fillAlpha: 0.95, stroke: 0x17364b, accent: this.palette.wall, radius: 19 });
      neonText(this, 47, 39, `SECTOR 0${this.level} // ${this.palette.name}`, 10, this.palette.wall, { bold: true, letterSpacing: 2, shadow: false });
      this.scoreText = neonText(this, 47, 58, '000000', 24, COLORS.white, { bold: true, shadowColor: this.palette.wall, shadowBlur: 12 });
      this.multiplierText = neonText(this, 285, 54, 'CHAIN ×1', 13, COLORS.magenta, { bold: true, letterSpacing: 1, shadow: false });
      this.livesText = neonText(this, 466, 54, 'INTEGRITY ● ● ●', 12, COLORS.lime, { bold: true, shadow: false });
      this.progressText = neonText(this, 690, 54, 'GRID 0%', 12, 0x96a9bb, { bold: true, shadow: false });
      this.timeText = neonText(this, 841, 54, '00:00', 12, COLORS.cyan, { bold: true, shadow: false });
      this.chipText = neonText(this, 970, 54, `◈ ${formatScore(this.profile.chips)}`, 12, COLORS.amber, { bold: true, shadow: false });

      roundedPanel(this, 866, 111, 390, 547, { fill: 0x07111d, fillAlpha: 0.94, stroke: 0x20364a, accent: this.palette.accent, radius: 22 });
      neonText(this, 892, 136, 'TACTICAL UPLINK', 11, this.palette.accent, { bold: true, letterSpacing: 2 });
      neonText(this, 892, 160, 'Live objectives and cyber-modules', 10, 0x6f8193, { shadow: false });

      this.objectiveTexts = [];
      const labels = [
        ['SECTOR BREACH', 'Clear top sector ≤ 30s'],
        ['COLD CIRCUIT', 'Survive 45s without Overclock'],
        ['HYPER CHAIN', 'Reach a ×5 multiplier']
      ];
      labels.forEach((item, i) => {
        const y = 210 + i * 66;
        this.add.rectangle(1058, y + 10, 334, 53, 0x0a1825, 0.96).setStrokeStyle(1, 0x243b4f, 0.65);
        neonText(this, 907, y - 3, item[0], 10, COLORS.white, { bold: true, shadow: false });
        const status = neonText(this, 907, y + 18, item[1], 9, 0x708498, { shadow: false });
        const mark = neonText(this, 1204, y + 8, '○', 17, 0x465f75, { bold: true, origin: 0.5, shadow: false });
        this.objectiveTexts.push({ status, mark, id: ['top-sector', 'no-overclock', 'combo-x5'][i] });
      });

      neonText(this, 892, 414, 'CYBER-MODULES', 10, COLORS.cyan, { bold: true, letterSpacing: 1.6 });
      this.dashStatus = neonText(this, 906, 527, 'Collect a Dash Surge capsule', 9, 0x71879a, { shadow: false });
      this.empStatus = neonText(this, 906, 612, 'Collect an EMP capacitor', 9, 0x71879a, { shadow: false });
    }

    drawMaze() {
      const w = this.maze.cols * this.tileSize;
      const h = this.maze.rows * this.tileSize;
      roundedPanel(this, this.originX - 10, this.originY - 10, w + 20, h + 20, { fill: 0x030a12, fillAlpha: 0.98, stroke: 0x1c3448, radius: 18 });
      const g = this.add.graphics();
      for (let y = 0; y < this.maze.rows; y++) {
        for (let x = 0; x < this.maze.cols; x++) {
          if (this.maze.grid[y][x] !== 1) continue;
          const px = this.originX + x * this.tileSize;
          const py = this.originY + y * this.tileSize;
          g.fillStyle(0x07131e, 1); g.fillRect(px + 1, py + 1, this.tileSize - 2, this.tileSize - 2);
          const edgeColor = (x + y) % 7 === 0 ? this.palette.accent : this.palette.wall;
          g.lineStyle(1.25, edgeColor, 0.56);
          if (!this.maze.isWalkable(x, y - 1)) g.lineBetween(px + 3, py + 3, px + this.tileSize - 3, py + 3);
          if (!this.maze.isWalkable(x, y + 1)) g.lineBetween(px + 3, py + this.tileSize - 3, px + this.tileSize - 3, py + this.tileSize - 3);
          if (!this.maze.isWalkable(x - 1, y)) g.lineBetween(px + 3, py + 3, px + 3, py + this.tileSize - 3);
          if (!this.maze.isWalkable(x + 1, y)) g.lineBetween(px + this.tileSize - 3, py + 3, px + this.tileSize - 3, py + this.tileSize - 3);
        }
      }
      addGlow(g, this.palette.wall, 1.55, 7);
      this.wallGraphics = g;
      const core = this.tileToWorld(this.maze.homeTile);
      const coreRing = this.add.circle(core.x, core.y, 74, this.palette.accent, 0.025).setStrokeStyle(1, this.palette.accent, 0.34);
      this.tweens.add({ targets: coreRing, scale: { from: 0.88, to: 1.12 }, alpha: { from: 0.22, to: 0.04 }, duration: 1400, yoyo: true, repeat: -1 });
    }

    buildCollectibles() {
      this.pellets = new Map();
      this.powerups = new Map();
      this.specials = new Map();
      const reserved = new Set([
        tileKey(this.maze.playerSpawn),
        ...this.maze.ghostSpawns.map(tileKey),
        ...this.maze.powerTiles.map(tileKey),
        ...this.maze.specialTiles.map(tileKey)
      ]);
      for (const tile of this.maze.floorTiles()) {
        const key = tileKey(tile);
        if (reserved.has(key) || this.maze.isHomeRegion(tile)) continue;
        const p = this.tileToWorld(tile);
        const dot = this.add.circle(p.x, p.y, 2.35, 0xd7fbff, 0.82);
        this.pellets.set(key, { tile, obj: dot });
      }
      for (const tile of this.maze.powerTiles) {
        const p = this.tileToWorld(tile);
        const orb = this.add.circle(p.x, p.y, 7.2, COLORS.violet, 0.9).setStrokeStyle(2, COLORS.white, 0.8);
        addGlow(orb, COLORS.violet, 3.2, 10);
        this.tweens.add({ targets: orb, scale: { from: 0.78, to: 1.24 }, alpha: { from: 0.6, to: 1 }, duration: 620, yoyo: true, repeat: -1 });
        this.powerups.set(tileKey(tile), { tile, obj: orb, type: 'overclock' });
      }
      this.spawnSpecial(this.maze.specialTiles[0], 'dash');
      this.spawnSpecial(this.maze.specialTiles[1], 'emp');
    }

    spawnSpecial(tile, type) {
      if (!tile) return;
      const p = this.tileToWorld(tile);
      const color = type === 'dash' ? COLORS.cyan : COLORS.magenta;
      const container = this.add.container(p.x, p.y);
      const bg = this.add.circle(0, 0, 12, 0x091726, 0.96).setStrokeStyle(2, color, 0.9);
      const txt = neonText(this, 0, 0, type === 'dash' ? '»' : 'E', 13, color, { bold: true, origin: 0.5, shadowBlur: 10 });
      container.add([bg, txt]);
      this.tweens.add({ targets: container, rotation: type === 'dash' ? 0.18 : -0.18, duration: 900, yoyo: true, repeat: -1 });
      this.specials.set(tileKey(tile), { tile, obj: container, type });
    }

    createEntities() {
      const trail = { cyan: COLORS.cyan, magenta: COLORS.magenta, lime: COLORS.lime }[this.profile.trailSkin] || COLORS.cyan;
      this.player = new Player(this, this.maze, this.tileToWorld, this.maze.playerSpawn, {
        speedUpgrade: this.profile.upgrades.speed || 0,
        trailColor: trail,
        baseSpeed: 190 + (this.level - 1) * 4
      });
      const corners = [
        this.maze.findNearestFloor({ x: this.maze.cols - 2, y: 1 }),
        this.maze.findNearestFloor({ x: 1, y: 1 }),
        this.maze.findNearestFloor({ x: this.maze.cols - 2, y: this.maze.rows - 2 }),
        this.maze.findNearestFloor({ x: 1, y: this.maze.rows - 2 })
      ];
      const ids = ['blinky', 'pinky', 'inky', 'clyde'];
      this.ghosts = ids.map((id, i) => new Ghost(this, this.maze, this.tileToWorld, id, this.maze.ghostSpawns[i], corners[i], {
        baseSpeed: 148 + this.level * 8 + i * 1.5
      }));
      this.blinky = this.ghosts[0];
    }

    configureLights() {
      try {
        this.lights.enable();
        this.lights.setAmbientColor(0x1a2734);
        const p = this.player.worldPosition();
        this.playerLight = this.lights.addLight(p.x, p.y, 145, COLORS.cyan, 2.0, 18);
        this.ghostLights = this.ghosts.map((ghost) => {
          const p2 = ghost.worldPosition();
          return this.lights.addLight(p2.x, p2.y, 88, ghost.meta.color, 1.1, 12);
        });
      } catch {
        this.playerLight = null;
        this.ghostLights = [];
      }
    }

    configureInput() {
      this.keys = this.input.keyboard?.addKeys({
        up: 'W', down: 'S', left: 'A', right: 'D',
        up2: 'UP', down2: 'DOWN', left2: 'LEFT', right2: 'RIGHT',
        dash: 'SHIFT', emp: 'E', pause: 'P'
      });
      const bind = (code, dir) => this.input.keyboard?.on(`keydown-${code}`, () => this.player.queueDirection(dir));
      bind('W', DIRECTIONS.UP); bind('UP', DIRECTIONS.UP);
      bind('S', DIRECTIONS.DOWN); bind('DOWN', DIRECTIONS.DOWN);
      bind('A', DIRECTIONS.LEFT); bind('LEFT', DIRECTIONS.LEFT);
      bind('D', DIRECTIONS.RIGHT); bind('RIGHT', DIRECTIONS.RIGHT);
      this.input.keyboard?.on('keydown-SHIFT', () => this.activateDash());
      this.input.keyboard?.on('keydown-E', () => this.activateEmp());
      this.input.keyboard?.on('keydown-P', () => this.togglePause());
      this.input.keyboard?.on('keydown-ESC', () => this.togglePause());

      let start = null;
      this.input.on('pointerdown', (pointer) => { audio.unlock(); start = { x: pointer.x, y: pointer.y, t: this.time.now }; });
      this.input.on('pointerup', (pointer) => {
        if (!start) return;
        const dx = pointer.x - start.x, dy = pointer.y - start.y;
        start = null;
        if (Math.hypot(dx, dy) < 22) return;
        this.player.queueDirection(Math.abs(dx) > Math.abs(dy)
          ? (dx > 0 ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT)
          : (dy > 0 ? DIRECTIONS.DOWN : DIRECTIONS.UP));
      });
    }

    createAbilityButtons() {
      this.dashButton = button(this, 1055, 474, 300, 68, 'DASH SURGE  [SHIFT]', {
        fill: 0x092132, stroke: COLORS.cyan, color: COLORS.cyan, fontSize: 13, onClick: () => this.activateDash()
      });
      this.empButton = button(this, 1055, 560, 300, 68, 'EMP BLAST  [E]', {
        fill: 0x211127, stroke: COLORS.magenta, color: COLORS.magenta, fontSize: 13, onClick: () => this.activateEmp()
      });
      neonText(this, 906, 643, 'Swipe or WASD / arrows to move · P to pause', 9, 0x597087, { shadow: false });
    }

    startCountdown() {
      this.countdownText = neonText(this, this.originX + this.maze.cols * this.tileSize / 2, this.originY + this.maze.rows * this.tileSize / 2, '3', 76, COLORS.white, { bold: true, origin: 0.5, shadowColor: this.palette.wall, shadowBlur: 26 });
      let n = 3;
      this.time.addEvent({
        delay: 620,
        repeat: 3,
        callback: () => {
          n -= 1;
          if (n > 0) this.countdownText.setText(String(n));
          else if (n === 0) this.countdownText.setText('RUN');
          else {
            this.countdownText.destroy();
            this.started = true;
            this.ghostPhaseStartedAt = this.time.now;
            this.challenge.startedAt = this.time.now;
            this.consumeAtPlayerTile();
          }
        }
      });
    }

    update(time, delta) {
      if (!this.started || this.pausedByUser || this.ending) return;
      const dt = Math.min(40, delta);
      const arrived = this.player.update(dt);
      if (arrived) this.consumeAtPlayerTile();
      if (!this.player.moving && time - this.player.lastMovingAt > 380) this.challenge.resetCombo();

      this.updateGhostMode(time);
      const ghostCtx = { player: this.player, blinky: this.blinky, globalGhostState: this.globalGhostState };
      this.ghosts.forEach((ghost) => ghost.update(dt, ghostCtx));
      this.checkGhostCollisions();
      this.updateLights();
      this.challenge.update(time).forEach((objective) => this.achievementToast(objective));
      this.maybeSpawnGem();
      this.maybeSpawnSecondSpecial();
      this.refreshHud();
    }

    consumeAtPlayerTile() {
      const key = tileKey(this.player.tile);
      const pellet = this.pellets.get(key);
      if (pellet) {
        pellet.obj.destroy();
        this.pellets.delete(key);
        this.pelletsEaten += 1;
        const result = this.challenge.registerPellet({ now: this.time.now, topSector: pellet.tile.y < 7, moving: this.player.moving });
        this.addScore(result.points, this.player.sprite.x, this.player.sprite.y - 16, result.multiplier > 1);
        audio.pellet(result.multiplier);
        result.completed.forEach((objective) => this.achievementToast(objective));
        if (this.pellets.size === 0) this.finishRun(true);
      }

      const power = this.powerups.get(key);
      if (power) {
        power.obj.destroy(); this.powerups.delete(key); this.activateOverclock();
      }
      const special = this.specials.get(key);
      if (special) {
        special.obj.destroy(); this.specials.delete(key);
        if (special.type === 'dash') { this.dashCharges += 1; this.showToast('DASH SURGE ACQUIRED', 'Press SHIFT or tap the module'); }
        else { this.empCharges += 1; this.showToast('EMP CAPACITOR ACQUIRED', 'Press E or tap the module'); }
      }
      if (this.gem && key === tileKey(this.gem.tile)) {
        this.gem.obj.destroy();
        this.challenge.registerGem(18 + this.level * 4);
        this.addScore(750, this.player.sprite.x, this.player.sprite.y - 20, true);
        this.showToast('CYBER-GEM SECURED', `+${18 + this.level * 4} Cyber-Chips banked`);
        this.gem = null;
      }
    }

    addScore(points, x, y, dramatic = false) {
      this.score += points;
      const popup = neonText(this, x, y, `+${points}`, dramatic ? 15 : 11, dramatic ? COLORS.amber : COLORS.cyan, { bold: true, origin: 0.5, shadowBlur: 10 });
      this.tweens.add({ targets: popup, y: y - 28, alpha: 0, scaleX: dramatic ? 1.25 : 1, scaleY: dramatic ? 1.25 : 1, duration: 620, onComplete: () => popup.destroy() });
    }

    activateOverclock() {
      this.challenge.registerOverclock();
      const until = this.time.now + 8200;
      this.ghosts.forEach((ghost) => { if (ghost.state !== 'eaten') ghost.setState('frightened', until); });
      audio.power();
      this.cameras.main.shake(150, 0.006);
      this.flashMaze(COLORS.violet);
      this.showToast('OVERCLOCK ENGAGED', 'Cyber-entities are vulnerable for 8 seconds');
    }

    activateDash() {
      if (!this.started || this.pausedByUser || this.dashCharges <= 0 || this.player.dashActive) return;
      this.dashCharges -= 1;
      this.player.activateDash(3600);
      audio.dash();
      this.cameras.main.shake(90, 0.003);
      this.showToast('DASH SURGE', 'Velocity core boosted · collision immunity active');
    }

    activateEmp() {
      if (!this.started || this.pausedByUser || this.empCharges <= 0) return;
      this.empCharges -= 1;
      const duration = 3000 + (this.profile.upgrades.emp || 0) * 1000;
      const until = this.time.now + duration;
      this.ghosts.forEach((ghost) => { if (ghost.state !== 'eaten') ghost.freeze(until); });
      audio.emp();
      this.cameras.main.shake(180, 0.009);
      this.flashMaze(COLORS.magenta);
      this.showToast('EMP BLAST', `Hostiles frozen for ${(duration / 1000).toFixed(0)} seconds`);
    }

    updateGhostMode(now) {
      const phase = this.ghostPhases[this.ghostPhaseIndex];
      if (now - this.ghostPhaseStartedAt < phase.duration) return;
      this.ghostPhaseIndex = Math.min(this.ghostPhases.length - 1, this.ghostPhaseIndex + 1);
      this.ghostPhaseStartedAt = now;
      this.globalGhostState = this.ghostPhases[this.ghostPhaseIndex].state;
      this.ghosts.forEach((ghost) => {
        if (ghost.state !== 'frightened' && ghost.state !== 'eaten') ghost.setState(this.globalGhostState);
      });
    }

    checkGhostCollisions() {
      const p = this.player.worldPosition();
      for (const ghost of this.ghosts) {
        const g = ghost.worldPosition();
        if (Math.hypot(p.x - g.x, p.y - g.y) > 20) continue;
        if (ghost.state === 'eaten') continue;
        if (this.player.dashActive) continue;
        if (ghost.state === 'frightened') {
          ghost.markEaten();
          this.ghostsEaten += 1;
          const points = this.challenge.registerGhostEat();
          this.addScore(points, g.x, g.y - 18, true);
          audio.ghostEat(this.challenge.ghostChain);
          continue;
        }
        if (!this.player.invulnerable) this.damagePlayer();
        break;
      }
    }

    damagePlayer() {
      this.lives -= 1;
      audio.hit();
      this.cameras.main.shake(330, 0.02);
      this.cameras.main.flash(130, 255, 35, 90, false);
      this.player.disableBriefly(1200);
      if (this.lives <= 0) {
        this.time.delayedCall(420, () => this.finishRun(false));
        return;
      }
      this.started = false;
      this.time.delayedCall(700, () => {
        this.player.reset(this.maze.playerSpawn);
        this.ghosts.forEach((ghost, i) => {
          ghost.tile = { ...this.maze.ghostSpawns[i] };
          ghost.targetTile = null;
          ghost.progress = 0;
          ghost.setWorld(...Object.values(this.tileToWorld(ghost.tile)));
          if (ghost.state !== 'eaten') ghost.setState(this.globalGhostState);
        });
        this.started = true;
      });
    }

    maybeSpawnGem() {
      if (this.gemSpawned || this.pellets.size > this.totalPelletsAtStart * 0.62) return;
      this.gemSpawned = true;
      const candidates = this.maze.floorTiles().filter((t) => !this.maze.isHomeRegion(t) && !this.pellets.has(tileKey(t)) === false);
      const tile = candidates[Math.floor(candidates.length * 0.62)] || this.maze.findNearestFloor({ x: 4, y: this.maze.tunnelRow });
      const p = this.tileToWorld(tile);
      const obj = this.add.container(p.x, p.y);
      const diamond = this.add.polygon(0, 0, [0, -11, 10, 0, 0, 11, -10, 0], COLORS.amber, 0.92).setStrokeStyle(2, COLORS.white, 0.85);
      obj.add(diamond);
      addGlow(diamond, COLORS.amber, 3, 10);
      this.tweens.add({ targets: obj, rotation: Math.PI * 2, duration: 2600, repeat: -1 });
      this.gem = { tile, obj };
      this.showToast('CYBER-GEM DETECTED', 'A high-value signal has materialized in the maze');
    }

    maybeSpawnSecondSpecial() {
      if (this.secondSpecialSpawned || this.pellets.size > this.totalPelletsAtStart * 0.42) return;
      this.secondSpecialSpawned = true;
      const tile = this.maze.findNearestFloor({ x: this.maze.cols - 5, y: this.maze.rows - 5 });
      if (!this.specials.has(tileKey(tile))) this.spawnSpecial(tile, this.level % 2 === 0 ? 'dash' : 'emp');
    }

    updateLights() {
      const p = this.player.worldPosition();
      if (this.playerLight) { this.playerLight.x = p.x; this.playerLight.y = p.y; this.playerLight.intensity = this.player.dashActive ? 2.8 : 1.9; }
      this.ghostLights?.forEach((light, i) => {
        const pos = this.ghosts[i].worldPosition();
        light.x = pos.x; light.y = pos.y;
        light.intensity = this.ghosts[i].state === 'frightened' ? 1.8 : 1.0;
      });
    }

    refreshHud() {
      this.scoreText?.setText(formatScore(this.score).padStart(6, '0'));
      this.multiplierText?.setText(`CHAIN ×${this.challenge?.multiplier || 1}`);
      this.multiplierText?.setColor(css((this.challenge?.multiplier || 1) >= 4 ? COLORS.amber : COLORS.magenta));
      this.livesText?.setText(`INTEGRITY ${'● '.repeat(Math.max(0, this.lives)).trim()}`);
      const progress = this.totalPelletsAtStart ? Math.round((1 - this.pellets.size / this.totalPelletsAtStart) * 100) : 0;
      this.progressText?.setText(`GRID ${progress}%`);
      const elapsed = this.started ? this.challenge.elapsed(this.time.now) : 0;
      this.timeText?.setText(`${String(Math.floor(elapsed / 60000)).padStart(2, '0')}:${String(Math.floor(elapsed / 1000) % 60).padStart(2, '0')}`);
      this.dashStatus?.setText(this.dashCharges ? `${this.dashCharges} charge${this.dashCharges > 1 ? 's' : ''} ready` : (this.player?.dashActive ? 'SURGE ACTIVE' : 'Collect a Dash Surge capsule'));
      this.empStatus?.setText(this.empCharges ? `${this.empCharges} charge${this.empCharges > 1 ? 's' : ''} ready` : 'Collect an EMP capacitor');
      this.objectiveTexts?.forEach((row) => {
        const done = this.challenge?.completed.has(row.id);
        row.mark.setText(done ? '✓' : '○').setColor(css(done ? COLORS.lime : 0x465f75));
      });
    }

    achievementToast(objective) {
      if (!objective) return;
      audio.achievement();
      this.showToast(`ACHIEVEMENT // ${objective.title}`, `Objective complete · +${objective.reward} Cyber-Chips`);
    }

    showToast(title, detail) {
      this.toast?.destroy();
      const c = this.add.container(1060, 105).setDepth(1000).setAlpha(0);
      const bg = this.add.rectangle(0, 0, 350, 64, 0x081522, 0.97).setStrokeStyle(1, this.palette.accent, 0.85);
      const t1 = neonText(this, -158, -13, title, 10, COLORS.white, { bold: true, shadowColor: this.palette.accent, shadowBlur: 7 });
      const t2 = neonText(this, -158, 9, detail, 8, 0x8195a8, { shadow: false });
      c.add([bg, t1, t2]); this.toast = c;
      this.tweens.add({ targets: c, y: 134, alpha: 1, duration: 180, ease: 'Back.easeOut' });
      this.time.delayedCall(2400, () => { if (!c.active) return; this.tweens.add({ targets: c, x: 1320, alpha: 0, duration: 220, onComplete: () => c.destroy() }); });
    }

    flashMaze(color) {
      const flash = this.add.rectangle(this.originX + this.maze.cols * this.tileSize / 2, this.originY + this.maze.rows * this.tileSize / 2, this.maze.cols * this.tileSize, this.maze.rows * this.tileSize, color, 0.22).setDepth(900);
      this.tweens.add({ targets: flash, alpha: 0, duration: 420, onComplete: () => flash.destroy() });
    }

    togglePause() {
      if (this.ending || !this.started) return;
      this.pausedByUser = !this.pausedByUser;
      if (this.pausedByUser) {
        this.pauseOverlay = this.add.container(0, 0).setDepth(1200);
        const bg = this.add.rectangle(640, 360, 1280, 720, 0x02050a, 0.74).setInteractive();
        const title = neonText(this, 640, 326, 'GRID PAUSED', 34, COLORS.white, { bold: true, origin: 0.5, shadowColor: COLORS.cyan, shadowBlur: 20 });
        const hint = neonText(this, 640, 375, 'Press P or Escape to resume', 12, 0x8ea2b5, { origin: 0.5, shadow: false });
        this.pauseOverlay.add([bg, title, hint]);
      } else this.pauseOverlay?.destroy();
    }

    finishRun(levelComplete) {
      if (this.ending) return;
      this.ending = true;
      audio.gameOver();
      const chipsEarned = this.challenge.rewardChips(this.score) + (levelComplete ? 45 * this.level : 0);
      const snapshot = this.challenge.snapshot(this.time.now);
      const summary = {
        score: this.score,
        level: this.level,
        levelComplete,
        chipsEarned,
        pellets: this.pelletsEaten,
        ghostsEaten: this.ghostsEaten,
        objectives: snapshot.completed,
        maxMultiplier: snapshot.maxMultiplier,
        elapsedMs: snapshot.elapsedMs
      };
      mutateProfile((p) => {
        p.bestScore = Math.max(p.bestScore || 0, this.score);
        p.chips = Math.max(0, (p.chips || 0) + chipsEarned);
        p.totalRuns = (p.totalRuns || 0) + 1;
        p.totalPellets = (p.totalPellets || 0) + this.pelletsEaten;
        p.totalGhostsEaten = (p.totalGhostsEaten || 0) + this.ghostsEaten;
        if (levelComplete) p.highestLevel = Math.max(p.highestLevel || 1, Math.min(3, this.level + 1));
        snapshot.completed.forEach((id) => { p.achievements[id] = true; });
      });
      setRunSummary(summary);
      this.cameras.main.fadeOut(420, 0, 0, 0);
      saveProfile().catch(() => {}).finally(() => this.time.delayedCall(430, () => this.scene.start('GameOver', summary)));
    }

    cleanup() {
      this.player?.destroy();
      this.ghosts?.forEach((ghost) => ghost.destroy());
      this.player = null;
      this.ghosts = [];
    }
  };
}
