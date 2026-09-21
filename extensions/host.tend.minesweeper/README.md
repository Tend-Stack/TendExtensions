# Minesweeper Odyssey: Deep Signal

A logic-first modern Minesweeper campaign for tend.host Runtime API 1.

## What changed

- 60-mission Expedition across six sectors.
- No-guess campaign generation checked by deterministic deduction rules.
- Classic Scout, Operator, Expert, and Frontier fields.
- Deep Field survival waves with hesitation pressure.
- Hidden data caches, logic-chain objectives, ranks, stars, daily missions, achievements, and persistent progression.
- Defuse Shield, Pulse Scanner, and Chain Reactor perks.
- Earned Sonar, Defuse, and Sweep tools powered by Signal Charge.
- Rare five-star mastery based on speed, precision, logic chains, and complete cache recovery.
- Click, right-click, double-click/chord, long-press, mobile Reveal/Flag modes, and keyboard controls.
- Container-aware fixed panel, laptop full-screen, and mobile edge-to-edge layouts.

## tend.host integration

The extension declares `runtime.kind: "game"` and uses Runtime API 1 for lifecycle-aware timers, pause/resume behavior, cleanup, and host-owned full screen. It does not request Phaser because the grid renderer is lightweight DOM/CSS.

Desktop uses a fixed 500 × 720 tool window. Mobile can enter the host-owned immersive surface and hide tend.host chrome.

## Controls

- Click/tap: reveal
- Right-click, Shift-click, long-press, or Flag mode: flag
- Click a revealed numbered cell: chord its neighbors when flags match the clue
- Arrow keys / WASD: move cursor
- Enter / Space: reveal or chord
- F: flag
- H: logic hint


## v3.0.1 corrective release

- Mission retries now generate a fresh no-guess field and fresh data-cache placement.
- The keyboard cursor is hidden until keyboard navigation is actually used.
- Detonations reveal the complete minefield and always open the result/retry screen.
- Data caches use a one-time recovery pulse instead of blinking forever.
- Desktop fullscreen expands into medium or wide arcade layouts instead of forcing the native 500 x 720 surface.
- Timers now use Runtime API 1 ownership for deterministic pause and cleanup.

## v3.0.2 interaction-state correction

- The minefield now updates existing cell nodes in place instead of rebuilding the entire grid after every action.
- Revealed areas remain visually stable and no longer replay covered/reveal animations during unrelated moves.
- Pressing revealed clues no longer scales or flashes the tile surface.
- Pointer interaction releases focus immediately; keyboard cursor focus remains available only through keyboard navigation.
- Recovered data caches use a compact corner badge instead of covering clue numbers.
- Cache recovery animation is isolated to the badge rather than flashing the complete tile.
