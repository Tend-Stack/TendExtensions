# tend.host Phaser 4.2.1 Runtime Integration

The current tend.host runtime deliberately owns engine resolution. Extensions declare a module id and cannot select a CDN or arbitrary URL. That is the right architecture; Phaser 4 should be added as a second host module rather than replacing Phaser 3.

## 1. Install Phaser 4 in the frontend

The repository's frontend uses Bun.

```bash
cd frontend
bun add phaser@4.2.1
```

Do **not** remove the existing `/vendor/phaser.min.js` Phaser 3 asset. Existing extensions still request `phaser@3`.

## 2. Allow `phaser@4` in backend manifest validation

File: `backend/app/services/extensions.py`

Change:

```py
KNOWN_RUNTIME_MODULES = {"phaser@3"}
```

to:

```py
KNOWN_RUNTIME_MODULES = {"phaser@3", "phaser@4"}
```

Add/update tests so schema-2 manifests requesting `phaser@4` are accepted, while unknown module ids still fail.

## 3. Expose Phaser 4 in the frontend runtime

File: `frontend/src/lib/extensions/runtime.ts`

Keep the existing Phaser 3 loader untouched. Phaser 3 currently populates `window.Phaser` from `/vendor/phaser.min.js`; using that same global for Phaser 4 would create a major-version collision.

Instead, dynamically import the installed Phaser 4 ESM package into its own promise:

```ts
let phaser4Promise: Promise<any> | null = null;

async function loadPhaser4(): Promise<any> {
  if (!phaser4Promise) {
    phaser4Promise = import('phaser')
      .then((module) => module.default ?? module)
      .catch((error) => {
        phaser4Promise = null;
        throw error;
      });
  }
  return phaser4Promise;
}
```

Broaden the runtime module type so its id is:

```ts
id: 'phaser@3' | 'phaser@4'
```

Add a typed overload:

```ts
require(moduleId: 'phaser@3' | 'phaser@4'): Promise<PhaserRuntimeModule>;
```

Then add a `phaser@4` branch in `requireModule` using the same host-owned lifecycle wrapper used by Phaser 3:

```ts
if (moduleId === 'phaser@4') {
  const Phaser = await loadPhaser4();
  if (this.destroyed) throw new Error('This extension runtime session is closed.');

  const createGame = (config: Record<string, unknown>) => {
    if (this.destroyed) throw new Error('This extension runtime session is closed.');
    const suppliedFps = (
      config.fps && typeof config.fps === 'object'
        ? config.fps as Record<string, unknown>
        : {}
    );
    const game = new Phaser.Game({
      ...config,
      fps: { ...suppliedFps, target: this.manifest.targetFps },
    });

    this.games.add(game);
    const pauseGame = () => {
      game.loop?.sleep?.();
      game.scene?.pause?.();
    };
    const resumeGame = () => {
      game.scene?.resume?.();
      game.loop?.wake?.();
    };
    const removePause = this.addHandler(this.pauseHandlers, pauseGame);
    const removeResume = this.addHandler(this.resumeHandlers, resumeGame);
    this.addCleanup(() => {
      removePause();
      removeResume();
      this.games.delete(game);
      game.destroy(true);
    });
    if (this.pausedState) pauseGame();
    return game;
  };

  return Object.freeze({
    id: 'phaser@4' as const,
    version: String(Phaser.VERSION ?? '4'),
    Phaser,
    createGame,
  });
}
```

A future cleanup can factor the duplicate game-lifecycle wrapper into a shared helper, but keeping the first Phaser 4 patch minimal lowers regression risk.

## 4. Verify

From `frontend`:

```bash
bun run check
bun run build
```

Run backend extension tests as your normal repository workflow requires. Then install the Neon Cyber-Man ZIP. Its manifest should be accepted and `host.runtime.require('phaser@4')` should resolve Phaser 4.2.1.

## Why coexist instead of replace?

- Existing Tetris and Flappy Bird packages currently request `phaser@3`.
- Schema-2 runtime modules are intentionally explicit and versioned.
- ESM-loading Phaser 4 avoids overwriting the Phaser 3 `window.Phaser` global.
- New games can migrate independently without forcing a synchronized rewrite of every installed game.
