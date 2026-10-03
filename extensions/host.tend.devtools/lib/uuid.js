/* UUID v4 generation. Pure; the random source is injectable. */

export const MIN_COUNT = 1;
export const MAX_COUNT = 50;

export function clampCount(value) {
  const n = Math.trunc(Number(value));
  if (!Number.isFinite(n)) return MIN_COUNT;
  return Math.min(MAX_COUNT, Math.max(MIN_COUNT, n));
}

/** RFC 4122 v4 from 16 random bytes. */
export function uuidFromBytes(bytes) {
  const b = Uint8Array.from(bytes);
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const hex = [...b].map((x) => x.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function generateUuids(count, options = {}) {
  const cryptoObj = options.crypto ?? globalThis.crypto;
  const n = clampCount(count);
  const list = [];
  for (let i = 0; i < n; i += 1) {
    let id;
    if (typeof cryptoObj?.randomUUID === 'function') {
      id = cryptoObj.randomUUID();
    } else if (typeof cryptoObj?.getRandomValues === 'function') {
      id = uuidFromBytes(cryptoObj.getRandomValues(new Uint8Array(16)));
    } else {
      throw new Error('No secure random source is available');
    }
    if (options.hyphens === false) id = id.replace(/-/g, '');
    if (options.uppercase) id = id.toUpperCase();
    list.push(id);
  }
  return list;
}
