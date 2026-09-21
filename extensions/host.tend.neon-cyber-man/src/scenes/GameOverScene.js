import { getContext, setSelectedLevel } from '../RuntimeContext.js';
import { COLORS, button, formatScore, neonText, roundedPanel } from '../Visuals.js';
import { audio } from '../AudioManager.js';

export function createGameOverScene(Phaser) {
  return class GameOverScene extends Phaser.Scene {
    constructor() { super('GameOver'); }

    init(data) { this.summary = data || getContext().runSummary || {}; }

    create() {
      const s = this.summary;
      const profile = getContext().profile;
      this.cameras.main.setBackgroundColor(COLORS.bg);
      const g = this.add.graphics();
      for (let i = 0; i < 95; i++) {
        g.fillStyle(i % 3 ? COLORS.cyan : COLORS.magenta, 0.08 + Math.random() * 0.22);
        g.fillCircle(Math.random() * 1280, Math.random() * 720, Math.random() * 1.5 + 0.3);
      }
      roundedPanel(this, 245, 62, 790, 596, { fill: 0x07111d, fillAlpha: 0.97, stroke: 0x244258, accent: s.levelComplete ? COLORS.cyan : COLORS.red, radius: 28 });
      neonText(this, 640, 112, s.levelComplete ? 'SECTOR PURGED' : 'SIGNAL LOST', 15, s.levelComplete ? COLORS.cyan : COLORS.red, { bold: true, origin: 0.5, letterSpacing: 3 });
      neonText(this, 640, 158, s.levelComplete ? 'GRID DOMINATED' : 'RUN TERMINATED', 40, COLORS.white, { bold: true, origin: 0.5, shadowColor: s.levelComplete ? COLORS.cyan : COLORS.magenta, shadowBlur: 22 });
      neonText(this, 640, 198, `SECTOR 0${s.level || 1} // ${s.levelComplete ? 'CLEAR' : 'INCOMPLETE'}`, 11, 0x8094a7, { bold: true, origin: 0.5, letterSpacing: 1.8, shadow: false });

      const stats = [
        ['SCORE', formatScore(s.score), COLORS.amber],
        ['CYBER-CHIPS', `+${formatScore(s.chipsEarned)}`, COLORS.cyan],
        ['GHOSTS EATEN', String(s.ghostsEaten || 0), COLORS.magenta],
        ['MAX CHAIN', `×${s.maxMultiplier || 1}`, COLORS.lime]
      ];
      stats.forEach((item, i) => {
        const x = 394 + (i % 2) * 330;
        const y = 278 + Math.floor(i / 2) * 104;
        this.add.rectangle(x + 80, y, 286, 78, 0x0a1825, 0.96).setStrokeStyle(1, 0x263f52, 0.65);
        neonText(this, x - 42, y - 20, item[0], 9, 0x6c8194, { bold: true, letterSpacing: 1.3, shadow: false });
        neonText(this, x - 42, y + 3, item[1], 23, item[2], { bold: true, shadowBlur: 11 });
      });

      const completed = Array.isArray(s.objectives) ? s.objectives : [];
      neonText(this, 330, 465, 'OBJECTIVES', 10, 0x72879a, { bold: true, letterSpacing: 1.5, shadow: false });
      neonText(this, 330, 490, completed.length ? `${completed.length}/3 complete · rewards deposited` : 'No dynamic objectives completed this run', 11, completed.length ? COLORS.lime : 0x697b8d, { bold: true, shadow: false });
      neonText(this, 330, 520, `BANK ${formatScore(profile.chips)} ◈    ·    BEST ${formatScore(profile.bestScore)}`, 10, 0x8296a8, { bold: true, shadow: false });

      button(this, 516, 590, 230, 52, 'RUN AGAIN', {
        fill: 0x102a38, stroke: COLORS.cyan, fontSize: 13,
        onClick: () => { audio.unlock(); this.scene.start('Game', { level: s.level || 1 }); }
      });
      button(this, 764, 590, 230, 52, 'ARCADE MENU', {
        fill: 0x171322, stroke: COLORS.magenta, fontSize: 13,
        onClick: () => { setSelectedLevel(Math.min(profile.highestLevel || 1, s.level || 1)); this.scene.start('Menu'); }
      });
      this.input.keyboard?.once('keydown-ENTER', () => this.scene.start('Game', { level: s.level || 1 }));
    }
  };
}
