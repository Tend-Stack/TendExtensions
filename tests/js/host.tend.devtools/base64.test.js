import { describe, expect, test } from 'bun:test';
import { base64ToBytes, bytesToBase64, decodeText, encodeText } from '../../../extensions/host.tend.devtools/lib/base64.js';

describe('base64 text', () => {
  test('known vectors', () => {
    expect(encodeText('')).toBe('');
    expect(encodeText('f')).toBe('Zg==');
    expect(encodeText('fo')).toBe('Zm8=');
    expect(encodeText('foo')).toBe('Zm9v');
    expect(encodeText('foobar')).toBe('Zm9vYmFy');
  });

  test('UTF-8 round trip, including emoji and combining marks', () => {
    for (const text of ['héllo wörld', '日本語のテキスト', '😀👍🏽', 'á', 'line\nbreak\ttab']) {
      expect(decodeText(encodeText(text))).toEqual({ ok: true, text });
      expect(decodeText(encodeText(text, { urlSafe: true })).text).toBe(text);
    }
  });

  test('URL-safe alphabet drops padding and swaps + /', () => {
    const bytes = new Uint8Array([0xfb, 0xff, 0xfe]);
    expect(bytesToBase64(bytes)).toBe('+//+');
    expect(bytesToBase64(bytes, { urlSafe: true })).toBe('-__-');
    expect(bytesToBase64(new Uint8Array([0xfb]), { urlSafe: true })).toBe('-w');
    expect(bytesToBase64(new Uint8Array([0xfb]))).toBe('+w==');
  });

  test('decoding accepts both alphabets, whitespace and missing padding', () => {
    expect(decodeText('Zm9v\nYmFy').text).toBe('foobar');
    expect(decodeText('Zm8').text).toBe('fo');
    expect(decodeText('Zg').text).toBe('f');
    expect([...base64ToBytes('-__-').bytes]).toEqual([0xfb, 0xff, 0xfe]);
  });

  test('rejects bad characters, padding and lengths with a reason', () => {
    expect(decodeText('Zm9v!').error).toContain('position 5');
    expect(decodeText('Z=g').ok).toBe(false);
    expect(decodeText('Zg===').ok).toBe(false);
    expect(decodeText('Zm9vY').error).toContain('length');
  });

  test('bytes that are not UTF-8 are reported, not replaced', () => {
    const r = decodeText(bytesToBase64(new Uint8Array([0xff, 0xfe, 0xfd])));
    expect(r.ok).toBe(false);
    expect(r.error).toContain('UTF-8');
  });
});
