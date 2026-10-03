/* Base64 for text, UTF-8 safe, standard or URL-safe alphabet.
 *
 * Hand-rolled over Uint8Array so behaviour is identical in every engine
 * (atob/btoa only speak Latin-1 and throw engine-specific errors).
 */

const STANDARD = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const URL_SAFE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

export function bytesToBase64(bytes, options = {}) {
  const alphabet = options.urlSafe ? URL_SAFE : STANDARD;
  const pad = options.pad ?? !options.urlSafe;
  let out = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const a = bytes[i];
    const b = bytes[i + 1];
    const c = bytes[i + 2];
    const n = (a << 16) | ((b ?? 0) << 8) | (c ?? 0);
    out += alphabet[(n >> 18) & 63] + alphabet[(n >> 12) & 63];
    out += b === undefined ? (pad ? '=' : '') : alphabet[(n >> 6) & 63];
    out += c === undefined ? (pad ? '=' : '') : alphabet[n & 63];
  }
  return out;
}

/** Decode either alphabet, ignoring whitespace and tolerating missing
 *  padding. Returns `{ ok: true, bytes }` or `{ ok: false, error }`. */
export function base64ToBytes(input) {
  let text = String(input ?? '').replace(/\s+/g, '');
  const firstPad = text.indexOf('=');
  if (firstPad !== -1) {
    if (!/^=+$/.test(text.slice(firstPad)) || text.length - firstPad > 2) {
      return { ok: false, error: 'Padding "=" is only allowed at the end, at most twice' };
    }
    text = text.slice(0, firstPad);
  }
  const bad = text.search(/[^A-Za-z0-9+/_-]/);
  if (bad !== -1) {
    return { ok: false, error: `Character '${text[bad]}' at position ${bad + 1} is not part of the Base64 alphabet` };
  }
  if (text.length % 4 === 1) {
    return { ok: false, error: 'The length is not valid for Base64 (one stray character at the end)' };
  }
  const bytes = new Uint8Array(Math.floor((text.length * 3) / 4));
  let acc = 0;
  let bits = 0;
  let o = 0;
  for (const ch of text) {
    const v = ch === '-' ? 62 : ch === '_' ? 63 : STANDARD.indexOf(ch);
    acc = (acc << 6) | v;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      bytes[o] = (acc >> bits) & 255;
      o += 1;
    }
    acc &= (1 << bits) - 1;
  }
  return { ok: true, bytes };
}

export function encodeText(text, options = {}) {
  return bytesToBase64(new TextEncoder().encode(String(text ?? '')), options);
}

/** Decode Base64 into a UTF-8 string. Bytes that are not valid UTF-8 are
 *  reported rather than silently replaced. */
export function decodeText(input) {
  const raw = base64ToBytes(input);
  if (!raw.ok) return raw;
  try {
    return { ok: true, text: new TextDecoder('utf-8', { fatal: true }).decode(raw.bytes) };
  } catch (error) {
    return { ok: false, error: 'The decoded bytes are not valid UTF-8 text (this may be binary data)' };
  }
}
