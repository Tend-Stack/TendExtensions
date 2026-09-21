import { getContext, mutateProfile, saveProfile, setSelectedLevel } from '../RuntimeContext.js';
import { COLORS, button, css, formatScore, neonText, roundedPanel } from '../Visuals.js';
import { audio } from '../AudioManager.js';

const LEVELS = [
  { n: 1, name: 'NEXUS ZERO', seed: 'SYNTH DISTRICT', color: COLORS.cyan },
  { n: 2, name: 'AFTERGLOW', seed: 'MAGENTA VAULT', color: COLORS.magenta },
  { n: 3, name: 'BLACK ICE', seed: 'VOID CIRCUIT', color: COLORS.violet }
];
const TRAILS = [
  { id: 'cyan', name: 'ION CYAN', color: COLORS.cyan, cost: 0 },
  { id: 'magenta', name: 'HOT PINK', color: COLORS.magenta, cost: 140 },
  { id: 'lime', name: 'TOXIC LIME', color: COLORS.lime, cost: 220 }
];

export function createMainMenuScene(Phaser) {
  return class MainMenuScene extends Phaser.Scene {
    constructor() { super('Menu'); }

    create() {
      const ctx = getContext();
      const profile = ctx.profile;
      this.cameras.main.setBackgroundColor(COLORS.bg);
      this.drawBackdrop();
      roundedPanel(this, 34, 30, 1212, 660, { fill: 0x06101b, fillAlpha: 0.88, stroke: 0x173953, accent: COLORS.cyan, radius: 26 });

      neonText(this, 78, 72, 'TEND.HOST // ARCADE GRID', 12, COLORS.cyan, { bold: true, letterSpacing: 3, shadowBlur: 8 });
      const title = neonText(this, 78, 108, 'NEON CYBER-MAN', 48, COLORS.white, { bold: true, letterSpacing: 2, shadowColor: COLORS.magenta, shadowBlur: 24 });
      this.tweens.add({ targets: title, alpha: { from: 0.84, to: 1 }, duration: 1100, yoyo: true, repeat: -1 });
      neonText(this, 80, 165, 'OUTRUN THE HUNTERS. BREAK THE GRID. OWN THE NIGHT.', 13, 0x91a6bd, { bold: true, letterSpacing: 1.2, shadow: false });

      this.drawShowcase();
      this.drawProfile(profile);
      this.drawLevels(profile);
      this.drawUpgrades(profile);

      button(this, 956, 620, 240, 54, 'ENTER THE GRID', {
        fill: 0x102d3d, stroke: COLORS.cyan, fontSize: 15, onClick: () => this.startGame()
      });
      button(this, 108, 620, 155, 40, 'FULLSCREEN', {
        fill: 0x0d1828, stroke: 0x32506b, color: 0x9db5c9, fontSize: 11,
        onClick: () => ctx.host?.runtime?.display?.toggleFullscreen?.()
      });
      button(this, 283, 620, 120, 40, audio.muted ? 'SOUND OFF' : 'SOUND ON', {
        fill: 0x0d1828, stroke: 0x32506b, color: 0x9db5c9, fontSize: 11,
        onClick: () => { audio.toggleMute(); this.scene.restart(); }
      });

      this.input.keyboard?.on('keydown-ENTER', () => this.startGame());
      this.input.once('pointerdown', () => audio.unlock());
    }

    drawBackdrop() {
      const g = this.add.graphics();
      for (let y = 0; y < 720; y += 36) {
        g.lineStyle(1, 0x0c2638, 0.28); g.lineBetween(0, y, 1280, y);
      }
      for (let x = 0; x < 1280; x += 44) {
        g.lineStyle(1, 0x1b1430, 0.22); g.lineBetween(x, 0, x, 720);
      }
      for (let i = 0; i < 80; i++) {
        g.fillStyle(i % 3 ? COLORS.cyan : COLORS.magenta, 0.12 + Math.random() * 0.2);
        g.fillCircle(Math.random() * 1280, Math.random() * 720, Math.random() * 1.4 + 0.3);
      }
    }

    drawShowcase() {
      const y = 230;
      const orb = this.add.image(151, y, 'cyber-orb').setScale(1.18).setBlendMode('ADD');
      const ring = this.add.image(151, y, 'orb-ring').setScale(1.16).setBlendMode('ADD');
      this.tweens.add({ targets: ring, rotation: Math.PI * 2, duration: 6000, repeat: -1 });
      const colors = [0xff345f, 0xff4fd8, 0x00eaff, 0xffb347];
      colors.forEach((color, i) => {
        const ghost = this.add.image(255 + i * 77, y + Math.sin(i) * 10, 'cyber-ghost').setTint(color).setScale(0.82);
        this.tweens.add({ targets: ghost, y: ghost.y + 12, duration: 900 + i * 120, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      });
      neonText(this, 80, 282, '4 adaptive cyber-entities · buffered grid movement · dynamic light & filter FX', 11, 0x6f8297, { shadow: false });
    }

    drawProfile(profile) {
      roundedPanel(this, 690, 66, 500, 116, { fill: 0x071522, stroke: 0x1e415b, radius: 18 });
      const items = [
        ['BEST SCORE', formatScore(profile.bestScore), COLORS.amber],
        ['CYBER-CHIPS', formatScore(profile.chips), COLORS.cyan],
        ['RUNS', String(profile.totalRuns || 0), COLORS.magenta]
      ];
      items.forEach((item, i) => {
        const x = 735 + i * 150;
        neonText(this, x, 91, item[0], 9, 0x60758b, { bold: true, letterSpacing: 1.4, shadow: false });
        neonText(this, x, 117, item[1], 23, item[2], { bold: true, shadowBlur: 12 });
      });
    }

    drawLevels(profile) {
      neonText(this, 80, 330, 'SECTOR SELECT', 11, COLORS.cyan, { bold: true, letterSpacing: 2 });
      LEVELS.forEach((level, i) => {
        const x = 80 + i * 198;
        const unlocked = level.n <= (profile.highestLevel || 1);
        const selected = getContext().selectedLevel === level.n;
        const panel = this.add.rectangle(x + 88, 390, 176, 92, selected ? 0x10273a : 0x091522, 0.98)
          .setStrokeStyle(selected ? 2 : 1, unlocked ? level.color : 0x314254, selected ? 0.95 : 0.55);
        if (unlocked) panel.setInteractive({ useHandCursor: true }).on('pointerdown', () => { setSelectedLevel(level.n); audio.unlock(); this.scene.restart(); });
        neonText(this, x + 14, 362, unlocked ? `0${level.n}` : 'LOCK', 10, unlocked ? level.color : 0x506071, { bold: true, shadow: false });
        neonText(this, x + 14, 385, level.name, 14, unlocked ? COLORS.white : 0x506071, { bold: true, shadowColor: level.color, shadowBlur: 8 });
        neonText(this, x + 14, 410, level.seed, 9, 0x687d91, { bold: true, shadow: false });
      });
    }

    drawUpgrades(profile) {
      neonText(this, 690, 222, 'UPGRADES & TRAILS', 11, COLORS.magenta, { bold: true, letterSpacing: 2 });
      roundedPanel(this, 690, 250, 500, 302, { fill: 0x08111d, stroke: 0x342445, radius: 18 });
      this.upgradeRow(716, 277, 'VELOCITY CORE', `+${(profile.upgrades.speed || 0) * 5}% movement speed`, profile.upgrades.speed || 0, 5, 85, 'speed');
      this.upgradeRow(716, 352, 'EMP CAPACITOR', `+${profile.upgrades.emp || 0}s EMP duration`, profile.upgrades.emp || 0, 5, 100, 'emp');
      neonText(this, 716, 434, 'TRAIL SKINS', 9, 0x72869a, { bold: true, letterSpacing: 1.5, shadow: false });
      TRAILS.forEach((trail, i) => {
        const unlocked = profile.unlockedTrails.includes(trail.id);
        const selected = profile.trailSkin === trail.id;
        const x = 716 + i * 146;
        const box = this.add.rectangle(x + 61, 489, 126, 72, selected ? 0x122738 : 0x0b1723, 1)
          .setStrokeStyle(selected ? 2 : 1, trail.color, selected ? 0.95 : 0.38)
          .setInteractive({ useHandCursor: true });
        this.add.circle(x + 24, 474, 6, trail.color, 1);
        neonText(this, x + 39, 465, trail.name, 9, unlocked ? COLORS.white : 0x6d7b89, { bold: true, shadow: false });
        neonText(this, x + 39, 486, unlocked ? (selected ? 'EQUIPPED' : 'EQUIP') : `${trail.cost} CHIPS`, 8, unlocked ? trail.color : COLORS.amber, { bold: true, shadow: false });
        box.on('pointerdown', async () => {
          audio.unlock();
          if (!unlocked && profile.chips < trail.cost) return;
          mutateProfile((p) => {
            if (!p.unlockedTrails.includes(trail.id)) { p.chips -= trail.cost; p.unlockedTrails.push(trail.id); }
            p.trailSkin = trail.id;
          });
          await saveProfile().catch(() => {});
          this.scene.restart();
        });
      });
    }

    upgradeRow(x, y, title, detail, level, max, baseCost, key) {
      neonText(this, x, y, title, 13, COLORS.white, { bold: true, shadow: false });
      neonText(this, x, y + 23, detail, 9, 0x708398, { shadow: false });
      neonText(this, x + 292, y + 2, `${level}/${max}`, 11, key === 'speed' ? COLORS.cyan : COLORS.magenta, { bold: true, shadow: false });
      const cost = baseCost + level * 45;
      if (level < max) {
        button(this, x + 391, y + 14, 126, 34, `UPGRADE ${cost}`, {
          fill: 0x101d2c, stroke: key === 'speed' ? COLORS.cyan : COLORS.magenta, fontSize: 9,
          onClick: async () => {
            audio.unlock();
            const p = getContext().profile;
            if (p.chips < cost) return;
            mutateProfile((next) => { next.chips -= cost; next.upgrades[key] = Math.min(max, next.upgrades[key] + 1); });
            await saveProfile().catch(() => {});
            this.scene.restart();
          }
        });
      } else neonText(this, x + 340, y + 14, 'MAXED', 10, COLORS.lime, { bold: true, shadow: false });
    }

    startGame() {
      audio.unlock();
      audio.gameStart();
      this.cameras.main.fadeOut(180, 0, 0, 0);
      this.time.delayedCall(190, () => this.scene.start('Game', { level: getContext().selectedLevel || 1 }));
    }
  };
}
