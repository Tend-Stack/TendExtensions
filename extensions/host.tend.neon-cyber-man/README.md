# Neon Cyber-Man for tend.host

A production-oriented, procedural Phaser 4 maze-chase extension designed for the tend.host schema-2 game runtime.

## Runtime

- Phaser 4.2.1 host module: `phaser@4`
- ES modules, no build step inside the extension ZIP
- 1280×720 responsive canvas with `Phaser.Scale.FIT`
- WebGL renderer, Arcade Physics enabled, max 8 dynamic lights
- No external images, fonts, audio, APIs, CDNs, or network dependencies
- Persistent progression uses `host.storage` (permission-scoped tend.host storage), not `localStorage`

## Architecture

- `index.js` — tend.host extension entry point / lifecycle integration
- `src/GameConfig.js` — Phaser config and scene assembly
- `src/Player.js` — forgiving buffered tile movement, corner grace, instant reversal, dash state, trail and glow
- `src/Ghost.js` — ghost finite state machine and identity-specific target logic
- `src/ChallengeManager.js` — combo scoring, timed objectives, reward calculation
- `src/Maze.js` — seeded procedural maze generation and grid navigation
- `src/AudioManager.js` — synthesized Web Audio sound effects
- `src/RuntimeContext.js` — host storage/profile/runtime context
- `src/Visuals.js` — Phaser 4 filters, panels, buttons, visual helpers
- `src/scenes/BootScene.js` — procedural texture generation
- `src/scenes/MainMenuScene.js` — level select, upgrades, trails, profile
- `src/scenes/GameScene.js` — gameplay loop, HUD, lighting, power-ups, collisions
- `src/scenes/GameOverScene.js` — run summary and replay flow

## Gameplay

### Movement

- Keyboard: arrows or WASD
- Touch: swipe anywhere over the game field
- Input buffering queues turns before intersections
- Corner grace accepts slightly-late perpendicular turns instead of missing the intersection
- Smooth instant 180° reversal in corridors
- `P` / `Esc`: pause

### Cyber-entity AI

- **Blink** — direct player targeting
- **Pink** — targets four tiles ahead
- **Ink** — vector flank using Blink and the player's projected position
- **Clyde** — chases outside eight tiles and retreats when close
- FSM states: Scatter → Chase → Frightened → Eaten/Return

### Power systems

- **Overclock** — map power nodes automatically trigger vulnerable enemies
- **Dash Surge** — collect a capsule, then press Shift or tap the module; speed boost + collision immunity
- **EMP Blast** — collect a capacitor, then press E or tap the module; freezes hostile entities

### Progression

- Cyber-Chips are earned from score, dynamic challenges, gems, and level clears
- Velocity Core: +5% movement speed per upgrade
- EMP Capacitor: +1 second EMP duration per upgrade
- Unlockable cyan / magenta / lime trail skins
- Best score, chips, upgrades, level unlocks, totals, and achievements persist through `host.storage`

## Installation requirement

This extension intentionally declares `runtime.modules: ["phaser@4"]`. The current tend.host main branch only accepts `phaser@3`, so install the host Phaser 4 runtime support first. See `HOST-PHASER4-INTEGRATION.md`.

Once host support is deployed, upload `neon-cyber-man-v1.0.1.zip` through the normal tend.host extension installer.
