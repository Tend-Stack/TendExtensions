/* SHA digests through crypto.subtle (hex output). Pure apart from the
 * injectable `subtle`, which defaults to the platform's.
 */

export const ALGORITHMS = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];

export function bytesToHex(bytes) {
  let out = '';
  for (const b of new Uint8Array(bytes)) out += b.toString(16).padStart(2, '0');
  return out;
}

export async function digestHex(algorithm, text, subtle = globalThis.crypto?.subtle) {
  if (!ALGORITHMS.includes(algorithm)) throw new Error(`Unsupported algorithm ${algorithm}`);
  if (!subtle) throw new Error('crypto.subtle is unavailable (it needs a secure context, https or localhost)');
  const data = new TextEncoder().encode(String(text ?? ''));
  return bytesToHex(await subtle.digest(algorithm, data));
}

/** All four digests of `text`, in a fixed order. */
export async function digestAll(text, subtle = globalThis.crypto?.subtle) {
  return Promise.all(ALGORITHMS.map(async (algorithm) => ({ algorithm, hex: await digestHex(algorithm, text, subtle) })));
}
