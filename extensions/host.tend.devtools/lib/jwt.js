/* JWT decoding. This NEVER verifies a signature: it only reads the
 * header and payload, which anyone can do. A token that decodes here
 * may still be forged. Pure.
 */
import { base64ToBytes } from './base64.js';
import { isoWithOffset, relativeTime } from './timestamp.js';

const DATE_CLAIMS = [
  ['exp', 'Expires'],
  ['nbf', 'Not before'],
  ['iat', 'Issued at'],
];

function decodePart(part, label) {
  const bytes = base64ToBytes(part);
  if (!bytes.ok) return { ok: false, error: `The ${label} is not valid Base64URL: ${bytes.error}` };
  let json;
  try {
    json = new TextDecoder('utf-8', { fatal: true }).decode(bytes.bytes);
  } catch (error) {
    return { ok: false, error: `The ${label} is not valid UTF-8` };
  }
  let value;
  try {
    value = JSON.parse(json);
  } catch (error) {
    return { ok: false, error: `The ${label} is not valid JSON` };
  }
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return { ok: false, error: `The ${label} must be a JSON object` };
  }
  return { ok: true, value };
}

/** Describe the time claims against `nowMs`. */
export function readTimeClaims(payload, nowMs) {
  const claims = [];
  for (const [name, label] of DATE_CLAIMS) {
    if (!(name in payload)) continue;
    const value = payload[name];
    if (typeof value !== 'number' || !Number.isFinite(value) || Math.abs(value * 1000) > 8.64e15) {
      claims.push({ name, label, seconds: null, valid: false, text: `Not a numeric date: ${JSON.stringify(value)}` });
      continue;
    }
    const ms = value * 1000;
    claims.push({
      name,
      label,
      seconds: value,
      valid: true,
      iso: new Date(ms).toISOString(),
      localIso: isoWithOffset(ms, -new Date(ms).getTimezoneOffset()),
      relative: relativeTime(value - nowMs / 1000),
    });
  }
  const exp = claims.find((c) => c.name === 'exp' && c.valid);
  const nbf = claims.find((c) => c.name === 'nbf' && c.valid);
  const nowSeconds = nowMs / 1000;
  const expired = exp ? nowSeconds >= exp.seconds : null;
  const notYetValid = nbf ? nowSeconds < nbf.seconds : null;
  let status = 'no-expiry';
  if (expired) status = 'expired';
  else if (notYetValid) status = 'not-yet-valid';
  else if (exp) status = 'within-window';
  return { claims, expired, notYetValid, status };
}

const STATUS_TEXT = {
  expired: 'Expired',
  'not-yet-valid': 'Not valid yet',
  'within-window': 'Within its validity window (time claims only)',
  'no-expiry': 'No exp claim, it never expires by its own claims',
};

export const SIGNATURE_NOTICE = 'The signature is NOT verified. Anyone can read a JWT, and this tool cannot tell you whether it is genuine.';

/** Decode `token` (a leading "Bearer " is ignored). */
export function decodeJwt(token, nowMs = Date.now()) {
  const text = String(token ?? '').trim().replace(/^bearer\s+/i, '').replace(/\s+/g, '');
  if (!text) return { ok: false, error: 'Paste a JWT to decode' };
  const parts = text.split('.');
  if (parts.length === 5) return { ok: false, error: 'This looks like an encrypted token (JWE) with five parts; its contents cannot be read without the key' };
  if (parts.length < 2 || parts.length > 3) return { ok: false, error: `A JWT has two or three dot-separated parts; this has ${parts.length}` };
  const header = decodePart(parts[0], 'header');
  if (!header.ok) return header;
  const payload = decodePart(parts[1], 'payload');
  if (!payload.ok) return payload;
  const time = readTimeClaims(payload.value, nowMs);
  return {
    ok: true,
    header: header.value,
    payload: payload.value,
    headerText: JSON.stringify(header.value, null, 2),
    payloadText: JSON.stringify(payload.value, null, 2),
    algorithm: typeof header.value.alg === 'string' ? header.value.alg : null,
    signature: parts[2] ?? '',
    hasSignature: Boolean(parts[2]),
    claims: time.claims,
    expired: time.expired,
    notYetValid: time.notYetValid,
    status: time.status,
    statusText: STATUS_TEXT[time.status],
    notice: SIGNATURE_NOTICE,
  };
}
