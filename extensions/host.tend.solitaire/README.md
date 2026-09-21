# Solitaire Odyssey: Starlight Circuit

A modern tend.host Klondike experience built around familiar card strategy, shorter mission sessions, daily seeded deals, score chains, collectible card-back rewards, and tactical powers.

## Main modes

- Classic Flow: a complete traditional Klondike deal with Draw One or Draw Three rules, rotating challenges, personal records, hidden Starlight cards, Momentum scoring, and powers.
- Odyssey Chapters: 36 focused missions across six visual worlds. Objectives include revealing hidden cards, building foundations, clearing columns, sustaining strategic chains, recovering star cards, and completing crown deals.
- Pulse Rush: a five-minute score attack. Clearing a deal immediately launches another while the timer continues.
- Daily Crown: a date-seeded deal and objective with a once-per-day reward.

## Modern systems

- Productive moves build Momentum and a score multiplier up to x5.
- Three hidden Starlight cards per deal grant score and power charge when revealed.
- Rewind, Hint, and Auto Lift consume fair resources rather than solving the game.
- Deep Rewind, Oracle Lens, and Star Current perks support different play styles.
- Journey stars unlock Solar Ember, Velvet Orbit, and Aurora Crown card backs.
- Arcade ranks, coins, achievements, streaks, and daily contracts persist through Runtime API 1 storage.

## Controls

- Drag a card or valid run with smooth lift, motion, tilt, snap, and return animations.
- Tap a card, then tap a destination for mobile-friendly play.
- Double-click a top card to send it to its matching foundation.
- Z: Rewind
- H: Hint
- A: Auto Lift
- N: Start a new run

The extension contains no remote assets and uses synthesized Web Audio feedback after the first user interaction.

## Progression clarity

- Classic Flow and Odyssey Chapters are available immediately.
- Pulse Rush unlocks at Arcade Rank 4.
- Oracle Lens unlocks at Rank 3 and Star Current unlocks at Rank 5.
- Locked options show their required rank directly in the custom menu.
- Starlight cards are always placed in genuinely hidden stock or covered tableau positions.



## v3.0.1

- Added fluid physical card dragging with eased pointer following.
- Card stacks lift together while preserving tableau spacing.
- Horizontal movement adds a subtle natural tilt.
- Valid moves snap into their destination with a soft landing.
- Invalid moves glide back to their original pile.
- Added reduced-motion support and runtime-aware animation cleanup.
