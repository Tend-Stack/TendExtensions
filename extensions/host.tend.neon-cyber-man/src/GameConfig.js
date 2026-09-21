import { createBootScene } from './scenes/BootScene.js';
import { createMainMenuScene } from './scenes/MainMenuScene.js';
import { createGameScene } from './scenes/GameScene.js';
import { createGameOverScene } from './scenes/GameOverScene.js';

export function createGameConfig(Phaser, parent) {
  const BootScene = createBootScene(Phaser);
  const MainMenuScene = createMainMenuScene(Phaser);
  const GameScene = createGameScene(Phaser);
  const GameOverScene = createGameOverScene(Phaser);

  return {
    type: Phaser.WEBGL,
    width: 1280,
    height: 720,
    resolution: Math.min(window.devicePixelRatio || 1, 2),
    parent,
    backgroundColor: '#05070d',
    scene: [BootScene, MainMenuScene, GameScene, GameOverScene],
    physics: {
      default: 'arcade',
      arcade: { debug: false, gravity: { x: 0, y: 0 } }
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 1280,
      height: 720
    },
    render: {
      antialias: true,
      pixelArt: false,
      roundPixels: false,
      powerPreference: 'high-performance'
    },
    input: { keyboard: true, activePointers: 3, touch: true },
    fps: { target: 60, smoothStep: true },
    maxLights: 8
  };
}
