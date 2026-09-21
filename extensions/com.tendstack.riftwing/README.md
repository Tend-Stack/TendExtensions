# Riftwing: Skybound

A high-speed tend.host arcade extension from TEND STACK LLC. Riftwing uses
tend.host Runtime API 1 and the locally bundled Phaser 4 engine for smooth,
60 FPS play, hidden-window pausing, deterministic teardown, and runtime
performance telemetry.

## Controls

- **Space**, **Up Arrow**, click, or tap: flap
- **Space on Game Over**: restart immediately
- **Escape**: return to the main menu
- **Left / Right**: change character in the menu
- **A / D**: change world in the menu

## Game modes

- **Adventure** — escalating levels, rotating worlds, collectibles, perks, milestone caches, XP and coins.
- **Pure Flight** — clean endless precision gameplay without pickup clutter.
- **Chaos** — moving gates, tighter spacing and faster level escalation.

## Level heat meter

During each run, the top HUD includes a live level-completion meter. It shows gates remaining, fills with acceleration-limited, time-based motion spread across almost the entire flight to the next gate, shifts from cyan and green through yellow, orange, and red, accelerates its animated streaks near completion, enters a spark-filled **Final Burn** state for the last gates, and briefly ignites when the level is cleared.

## Progression

The profile stores best scores, coins, XP, player level, selected character/world/perk, cumulative quest progress and daily supplies through the scoped tend.host storage API.

## Performance and packaging

This package targets extension schema 2 and declares the `phaser@3` shared
runtime module. The host owns game creation, visibility pause/resume, target
frame rate, and renderer teardown. High-frequency HUD graphics are throttled,
unchanged text is not repainted, and transient game objects remain bounded.

It mounts as a fixed 460 × 700 tool window. The in-game expand control can
promote that window to full screen through the runtime display API.

## v3.1.1 meter refinement

The meter no longer consumes a large score segment immediately. Fill velocity now ramps up and down with a strict speed cap, each earned gate is drawn across nearly one obstacle interval, the first pixels appear continuously without a minimum-width pop, and level completion reaches 100% before the burn hold begins.

## v3.1.2 passage-safety audit

The procedural gate generator now creates a connected flight corridor instead of selecting unrelated vertical positions. Consecutive openings are limited by the available flight time, gap size, difficulty physics and moving-gate travel. Gate motion is tied to horizontal progress, so Slow-Mo cannot shift an opening to a different position at arrival. Late-game speed has a mode-aware cap and a minimum gate-to-gate time, Chaos gaps retain a safe floor, and the stronger Expert/Nightmare flap presets use tighter route-shift limits. Perks remain helpful rewards, but ordinary generated passages no longer require a random perk to be physically passable.


## v3.1.3 non-blocking announcements

Wide center-screen gameplay cards were replaced by a queued, narrow vertical glass toast on the far-right edge. Level completion, Final Burn, milestone caches, power-ups, shield saves and Phoenix revives now use a semi-transparent notification that keeps the bird and flight corridor visible. The toast slides in briefly, never captures input, limits its backlog, and is cleaned up immediately if the run ends. Compact contextual feedback such as Perfect and Near Miss remains near the bird because it does not obscure the route.

## v3.1.4 bottom announcement dock

The right-edge vertical notification was replaced by a shallow 326 × 56 glass dock centered just above the ground line. Announcements now enter vertically from below, remain semi-transparent so scenery and obstacle silhouettes stay visible, and leave the bird and active gate opening unobstructed. Level completion, Final Burn, milestone caches, power-ups, shield rescues and Phoenix revives all use this bottom notification system.

## v4.0.0 Riftwing relaunch

- Rebranded with an independent TEND STACK LLC identity.
- Migrated from direct vendor loading to tend.host Runtime API 1.
- Added runtime-controlled 60 FPS policy, pause-when-hidden, cleanup, and
  full-screen focus.
- Reduced per-frame HUD draw work and repeated text updates.
- Preserved eight worlds, nine pilots, four flight classes, route-safe
  procedural challenges, power cores, contracts, progression, and rewards.

## v4.0.1 fullscreen scaling

- Fullscreen now preserves the complete 460 × 700 playfield with
  aspect-ratio-safe letterboxing instead of enlarging and cropping the game.

## v4.0.2 fullscreen keyboard focus

- Entering fullscreen now transfers keyboard focus to the game surface so
  Space flaps normally instead of reactivating the fullscreen control.
