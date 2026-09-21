# Gem Crush Odyssey — Riftfall Edition

A complete tend.host Runtime API 1 match-three campaign rebuilt for desktop panels, laptop fullscreen, and mobile immersive play.

## What changed in 3.0.0

- Replaced the old timed-score loop with an 80-stage objective campaign across eight visual worlds.
- Added Campaign, Rift Rush, and Infinite Rift modes.
- Added score, color collection, crystal-seal, rift, power-activation, and cascade objectives.
- Added persistent per-stage five-star ratings, campaign progress, total stars, best Rush score, and Endless wave progress.
- Added Hammer, Shuffle, and Nova boosters powered by an earned Rift Charge meter.
- Added Time Shard, Prism Seed, and Cascade Bank perks through the shared arcade progression hub.
- Added daily missions, ranks, coins, achievements, and persistent arcade progression.
- Added distinct faceted Ruby, Sapphire, Emerald, Sunstone, Amethyst, and Moonstone artwork.
- Added Row Ray, Column Ray, Nova Gem, and Prism Core powers plus special-to-special fusion rules.
- Added crystal and rift layers that live beneath gems, so every matched gem clears correctly while objectives remain logical.
- Added click, tap, swipe, hint, help, sound, birth, clearing, cascade, reshuffle, and forged-power feedback.
- Added a responsive three-zone laptop fullscreen layout and a compact mobile edge-to-edge layout.
- Added deterministic campaign board seeds and serializable board snapshots as groundwork for future shared challenges and multiplayer parity.

## Match logic

Every gem in a detected match is removed. Four-, five-, T-, and L-shaped formations then forge a brand-new special gem with a separate creation animation. The engine never preserves an ordinary matched gem as an accidental shortcut.

Generated boards contain no automatic starting matches and always include at least one legal move. Dead boards reshuffle without consuming a move.

## tend.host integration

- Schema 2 native ES module.
- Runtime API 1, `kind: game`.
- Runtime-managed timers, animation frames, visibility pause/resume, and cleanup.
- Host-owned fullscreen through `host.runtime.display`.
- Fixed 500 × 720 desktop panel with responsive fullscreen and mobile layouts.
- Scoped tend.host storage only; no external network access.

## Layout correction in 3.0.2

- Replaced viewport-width breakpoints with size-container breakpoints tied to the actual game surface.
- The fixed portrait panel no longer inherits the laptop fullscreen menu or three-column gameplay layout.
- The primary Play button remains visible near the top of the portrait menu.
- Gameplay objectives stay inside the HUD at panel, intermediate expanded, fullscreen, and mobile sizes.
- The wide three-zone arcade layout activates only when the game surface itself is wide enough.


## v3.0.4 rating rebalance

The five-star system now reserves Legendary ratings for exceptional runs. Completion contributes 20 points, with the remaining 80 earned through efficiency, score mastery, cascades/power usage, and precision. Five stars also require at least 28% of the move/time budget remaining, 1.6x the score target, no more than one invalid swap, and meaningful cascade or power play.
