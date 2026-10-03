import { describe, expect, test } from 'bun:test';
import { decodeJwt, readTimeClaims } from '../../../extensions/host.tend.devtools/lib/jwt.js';
import { bytesToBase64 } from '../../../extensions/host.tend.devtools/lib/base64.js';

const enc = (obj) => bytesToBase64(new TextEncoder().encode(JSON.stringify(obj)), { urlSafe: true });
const token = (header, payload, sig = 'c2ln') => [enc(header), enc(payload), sig].join('.');
const NOW = Date.UTC(2026, 9, 3, 12, 0, 0);
const sec = (ms) => ms / 1000;

describe('decodeJwt', () => {
  test('decodes header and payload and never claims verification', () => {
    const r = decodeJwt(token({ alg: 'HS256', typ: 'JWT' }, { sub: '42', name: 'Zoë' }), NOW);
    expect(r.ok).toBe(true);
    expect(r.algorithm).toBe('HS256');
    expect(r.payload).toEqual({ sub: '42', name: 'Zoë' });
    expect(r.hasSignature).toBe(true);
    expect(r.notice).toContain('NOT verified');
    expect(r.status).toBe('no-expiry');
  });

  test('accepts a Bearer prefix, whitespace and an unsigned token', () => {
    const t = token({ alg: 'none' }, { a: 1 }, '');
    const r = decodeJwt('Bearer ' + t.slice(0, 5) + '\n' + t.slice(5), NOW);
    expect(r.ok).toBe(true);
    expect(r.hasSignature).toBe(false);
  });

  test('exp in the past is expired, in the future is within window', () => {
    const past = decodeJwt(token({}, { exp: sec(NOW) - 3600 }), NOW);
    expect(past.expired).toBe(true);
    expect(past.status).toBe('expired');
    expect(past.claims[0]).toMatchObject({ name: 'exp', iso: '2026-10-03T11:00:00.000Z', relative: '1 hour ago' });
    const future = decodeJwt(token({}, { exp: sec(NOW) + 86400 * 2 }), NOW);
    expect(future.expired).toBe(false);
    expect(future.status).toBe('within-window');
    expect(future.claims[0].relative).toBe('in 2 days');
  });

  test('exp equal to now counts as expired (RFC 7519: now must be before exp)', () => {
    expect(readTimeClaims({ exp: sec(NOW) }, NOW).expired).toBe(true);
  });

  test('nbf in the future is not yet valid; iat is listed', () => {
    const r = readTimeClaims({ nbf: sec(NOW) + 60, iat: sec(NOW) - 60 }, NOW);
    expect(r.notYetValid).toBe(true);
    expect(r.status).toBe('not-yet-valid');
    expect(r.claims.map((c) => c.name)).toEqual(['nbf', 'iat']);
  });

  test('a non-numeric exp is flagged, not trusted', () => {
    const r = readTimeClaims({ exp: '2026-01-01' }, NOW);
    expect(r.claims[0].valid).toBe(false);
    expect(r.expired).toBe(null);
  });

  test('malformed tokens explain themselves', () => {
    expect(decodeJwt('', NOW).ok).toBe(false);
    expect(decodeJwt('abc', NOW).error).toContain('two or three');
    expect(decodeJwt('a.b.c.d.e', NOW).error).toContain('JWE');
    expect(decodeJwt('!!.e30.x', NOW).error).toContain('header');
    expect(decodeJwt(enc({}) + '.' + bytesToBase64(new TextEncoder().encode('nope'), { urlSafe: true }), NOW).error).toContain('payload is not valid JSON');
    expect(decodeJwt(enc([1]) + '.' + enc({}), NOW).error).toContain('JSON object');
  });
});
