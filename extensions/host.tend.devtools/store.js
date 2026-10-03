/* Write-behind cache over `host.storage`: one key, coalesced writes.
 *
 * Every `set` on the host store is a network round trip, and the tools
 * save on each keystroke, so writes are batched on a short timer.
 * Failures are swallowed on purpose: a developer tool that stops working
 * because a preference did not persist would be a worse tool.
 */

const FLUSH_DELAY_MS = 600;
export const STATE_KEY = 'state.v1';

export function createStore(host) {
  let timer = null;
  let pending;
  let hasPending = false;

  function flush() {
    timer = null;
    if (!hasPending) return;
    const value = pending;
    hasPending = false;
    pending = undefined;
    Promise.resolve()
      .then(() => host.storage.set(STATE_KEY, value))
      .catch(() => { /* storage is best effort */ });
  }

  return {
    async load(fallback) {
      try {
        const stored = await host.storage.get(STATE_KEY);
        return stored === null || stored === undefined ? fallback : stored;
      } catch (error) {
        return fallback;
      }
    },
    save(value) {
      pending = value;
      hasPending = true;
      if (timer === null) timer = setTimeout(flush, FLUSH_DELAY_MS);
    },
    flushNow() {
      if (timer !== null) clearTimeout(timer);
      flush();
    },
  };
}
