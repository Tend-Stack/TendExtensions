import { describe, expect, test } from 'bun:test';
import { decodeUrlText, encodeUrlText, parseUrl } from '../../../extensions/host.tend.devtools/lib/url-tools.js';

describe('encode and decode', () => {
  test('component encoding escapes reserved characters', () => {
    expect(encodeUrlText('a b&c=d/é').text).toBe('a%20b%26c%3Dd%2F%C3%A9');
    expect(encodeUrlText('https://x.test/a b?q=é', { full: true }).text).toBe('https://x.test/a%20b?q=%C3%A9');
  });

  test('round trip', () => {
    const text = 'ключ=значение & 😀';
    expect(decodeUrlText(encodeUrlText(text).text).text).toBe(text);
  });

  test('a stray percent is located', () => {
    const r = decodeUrlText('100%');
    expect(r.ok).toBe(false);
    expect(r.error).toContain('position 4');
    expect(decodeUrlText('%E0%A4%A').ok).toBe(false);
    expect(decodeUrlText('%FF').error).toContain('UTF-8');
  });

  test('lone surrogates cannot be encoded', () => {
    expect(encodeUrlText('\ud800').ok).toBe(false);
  });
});

describe('parseUrl', () => {
  test('splits every part and decodes parameters', () => {
    const r = parseUrl('https://user:pw@example.com:8080/a/b%20c?x=1&y=two+words&x=3#frag');
    expect(r.ok).toBe(true);
    expect(r.assumedScheme).toBe(false);
    expect(r.parts).toMatchObject({
      protocol: 'https:', username: 'user', password: 'pw', hostname: 'example.com', port: '8080',
      host: 'example.com:8080', pathname: '/a/b%20c', hash: '#frag', origin: 'https://example.com:8080',
    });
    expect(r.params).toEqual([
      { key: 'x', value: '1' }, { key: 'y', value: 'two words' }, { key: 'x', value: '3' },
    ]);
  });

  test('a value with no scheme is read as https and says so', () => {
    const r = parseUrl('example.com/path?q=1');
    expect(r.ok).toBe(true);
    expect(r.assumedScheme).toBe(true);
    expect(r.parts.hostname).toBe('example.com');
    expect(parseUrl('localhost:3000/x').parts.port).toBe('3000');
  });

  test('mailto keeps its scheme', () => {
    const r = parseUrl('mailto:a@b.test?subject=hi');
    expect(r.assumedScheme).toBe(false);
    expect(r.parts.protocol).toBe('mailto:');
  });

  test('empty and invalid input', () => {
    expect(parseUrl('  ').ok).toBe(false);
    expect(parseUrl('http://').ok).toBe(false);
  });
});
