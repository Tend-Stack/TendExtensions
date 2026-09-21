# Changelog

## 1.0.1 — Responsive Turning

- Added an 1100 ms directional input buffer for intentional pre-turns.
- Added a 38% tile corner-grace window so slightly late left/right inputs still pivot at the intersection.
- Buffered turns now commit immediately at tile centers instead of waiting an extra update tick.
- Added smooth mid-lane 180° reversals with no positional snap.
- Consumes successful buffered input so stale commands cannot trigger at a later intersection.

## 1.0.0

- Initial Neon Cyber-Man release.
