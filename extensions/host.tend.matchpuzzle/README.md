# Match Puzzle: Odyssey 2.1.1

A fixed-size tend.host match-puzzle extension aligned with Extension Runtime API 1.


## 2.1.1 — typography and layout repair

- Rebuilt Play Style cards with explicit header, reward, description, and unlock regions so shared panel styles cannot collapse the text into one line.
- Rebuilt perk cards with separate icon/rank, title, and description rows.
- Split section headings from their metadata instead of relying on adjacent generic spans.
- Reworked the five-star result breakdown into a two-column grid with separate labels, values, and denominators.
- Added tabular numeric rendering and no-wrap handling to compact rank, coin, score, XP, and rating values.
- Verified the home screen, active game HUD, perk grid, and result report at 500x700 desktop and 390x844 mobile sizes.

## 2.1.0 — five-star mastery and Flow Pressure

### Five-star performance rating

The old three-star rule looked only at the percentage of moves left, which made many very different runs receive the same maximum rating. The new 100-point model awards one to five stars from five visible categories:

- Completion: every successful clear receives the base score.
- Efficiency: moves remaining compared with the actual starting move count, including Long Haul.
- Mastery: score earned above the level's required score before the end-of-level move bonus.
- Skill: strongest cascade and productive power-gem use.
- Tempo: clean swaps in Relaxed mode, or Flow and pressure discipline in Pulse/Surge.

Five stars require an exceptional run rather than merely finishing with a few moves remaining. Best stars are stored per level, and replaying a level only increases the persistent star total when a previous record is improved.

### Play styles

- **Relaxed** — no response timer and standard rewards.
- **Pulse** — after 7.6 seconds without a valid move, a visible five-second warning begins. Fast play builds Flow and grants +15% rewards.
- **Surge** — unlocked at Rank 4; pressure arrives sooner, Flow bonuses are stronger, and rewards increase by 35%.

The response clock pauses during cascades, overlays, host pauses, and hidden-panel suspension. A valid move resets the window. Boosters reset pressure without granting Flow.

When a warning expires, entropy applies a recoverable consequence: it drains Core charge, crystallizes one playable gem, or removes score. Repeated expirations can consume one move only while enough moves remain, so pressure cannot create an immediate unwinnable failure.

### Flow

Valid moves made before the warning phase build a five-step Flow streak. Flow increases match scoring and Core charge. Moving during the warning prevents the entropy strike but reduces Flow, creating a risk/reward rhythm without using a conventional always-running level timer.

## Existing highlights

- Reliable 4+, 5+, T, and L resolution with explicit special-gem materialization.
- Line gems, blast gems, color prisms, and special-to-special swaps.
- Score, collection, frost, power-gem, and cascade objectives.
- Six persistent perks and three charged boosters.
- Daily challenges, coins, XP, ranks, and saved progression.
- Fixed 500×700 desktop panel with host-owned immersive mobile full screen.

## Runtime API 1

- Declares `runtime.kind: "game"`, `modules: []`, `pauseWhenHidden: true`, and 60 FPS.
- Uses `host.runtime.timers` for delayed work and the pressure loop.
- Uses runtime pause/resume and cleanup hooks.
- Uses `host.runtime.display.toggleFullscreen()` only from explicit user actions.
- Keeps the lightweight DOM/CSS board instead of loading an unnecessary engine module.
