import { COLORS } from '../Visuals.js';

export function createBootScene(Phaser) {
  return class BootScene extends Phaser.Scene {
    constructor() { super('Boot'); }

    create() {
      const make = (key, w, h, draw) => {
        const g = this.add.graphics();
        draw(g, w, h);
        g.generateTexture(key, w, h);
        g.destroy();
      };

      make('cyber-orb', 64, 64, (g) => {
        g.fillStyle(0x002b38, 0.35); g.fillCircle(32, 32, 29);
        g.fillStyle(COLORS.cyan, 0.18); g.fillCircle(32, 32, 24);
        g.fillStyle(COLORS.cyan, 0.35); g.fillCircle(32, 32, 18);
        g.fillStyle(0xbfffff, 0.95); g.fillCircle(32, 32, 10);
        g.fillStyle(0xffffff, 1); g.fillCircle(28, 27, 4);
      });
      make('orb-ring', 84, 84, (g) => {
        g.lineStyle(3, COLORS.cyan, 0.8); g.strokeCircle(42, 42, 32);
        g.lineStyle(1, COLORS.magenta, 0.65); g.strokeCircle(42, 42, 38);
        for (let i = 0; i < 8; i++) {
          const a = i * Math.PI / 4;
          g.lineStyle(2, i % 2 ? COLORS.magenta : COLORS.cyan, 0.8);
          g.beginPath();
          g.moveTo(42 + Math.cos(a) * 34, 42 + Math.sin(a) * 34);
          g.lineTo(42 + Math.cos(a) * 39, 42 + Math.sin(a) * 39);
          g.strokePath();
        }
      });
      make('cyber-ghost', 58, 58, (g) => {
        g.fillStyle(0xffffff, 1);
        g.fillRoundedRect(8, 11, 42, 33, 18);
        g.fillTriangle(8, 38, 8, 50, 18, 42);
        g.fillTriangle(18, 42, 28, 51, 36, 42);
        g.fillTriangle(34, 42, 50, 50, 50, 38);
        g.fillStyle(0x09111f, 1); g.fillCircle(22, 27, 5); g.fillCircle(37, 27, 5);
        g.fillStyle(0xffffff, 1); g.fillCircle(23, 26, 2); g.fillCircle(38, 26, 2);
        g.lineStyle(1.5, 0x09111f, 0.65);
        g.beginPath(); g.moveTo(16, 35); g.lineTo(25, 35); g.lineTo(31, 31); g.lineTo(43, 31); g.strokePath();
      });
      make('ghost-aura', 86, 86, (g) => {
        g.fillStyle(0xffffff, 0.06); g.fillCircle(43, 43, 40);
        g.fillStyle(0xffffff, 0.09); g.fillCircle(43, 43, 31);
        g.fillStyle(0xffffff, 0.14); g.fillCircle(43, 43, 22);
      });
      make('spark', 12, 12, (g) => {
        g.fillStyle(0xffffff, 0.15); g.fillCircle(6, 6, 6);
        g.fillStyle(0xffffff, 0.95); g.fillCircle(6, 6, 2.1);
      });
      this.scene.start('Menu');
    }
  };
}
