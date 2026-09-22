/* A small write-behind cache over `host.storage`.
 *
 * The host store is a server-side scoped KV: every `set` is a network
 * round trip. The calendar writes on nearly every interaction (create,
 * edit, delete an event; flip a preference), so writes are coalesced
 * per key on a short timer and reads are served from memory after the
 * first hydration. Failures are swallowed on purpose — a calendar that
 * stops working because a write did not land would be a worse
 * calendar than one that occasionally loses a millisecond of state.
 */

const FLUSH_DELAY_MS = 400;

export function createStore(host) {
  const cache = new Map();
  const pending = new Map();
  let timer = null;

  function flush() {
    timer = null;
    const writes = [...pending.entries()];
    pending.clear();
    for (const [key, value] of writes) {
      Promise.resolve()
        .then(() => (value === undefined ? host.storage.delete(key) : host.storage.set(key, value)))
        .catch(() => { /* storage is best effort */ });
    }
  }

  return {
    /** Read once from the host, then from memory. */
    async load(key, fallback) {
      if (cache.has(key)) return cache.get(key);
      let value = fallback;
      try {
        const stored = await host.storage.get(key);
        if (stored !== null && stored !== undefined) value = stored;
      } catch (error) {
        value = fallback;
      }
      cache.set(key, value);
      return value;
    },
    /** Synchronous read of an already-hydrated key. */
    peek(key, fallback) {
      return cache.has(key) ? cache.get(key) : fallback;
    },
    set(key, value) {
      cache.set(key, value);
      pending.set(key, value);
      if (timer === null) timer = setTimeout(flush, FLUSH_DELAY_MS);
    },
    /** Push everything queued right now (used on unmount). */
    flushNow() {
      if (timer !== null) clearTimeout(timer);
      flush();
    },
  };
}
