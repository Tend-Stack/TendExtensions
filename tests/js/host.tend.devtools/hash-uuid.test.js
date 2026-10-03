import { describe, expect, test } from 'bun:test';
import { ALGORITHMS, bytesToHex, digestAll, digestHex } from '../../../extensions/host.tend.devtools/lib/hash.js';
import { MAX_COUNT, clampCount, generateUuids, uuidFromBytes } from '../../../extensions/host.tend.devtools/lib/uuid.js';

describe('hash', () => {
  test('known digests of "abc"', async () => {
    expect(await digestHex('SHA-1', 'abc')).toBe('a9993e364706816aba3e25717850c26c9cd0d89d');
    expect(await digestHex('SHA-256', 'abc')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  });

  test('digestAll covers every algorithm in order and hashes UTF-8', async () => {
    const all = await digestAll('é');
    expect(all.map((d) => d.algorithm)).toEqual(ALGORITHMS);
    expect(all[1].hex).toHaveLength(64);
    expect(all[3].hex).toHaveLength(128);
  });

  test('rejects an unknown algorithm and a missing subtle', async () => {
    await expect(digestHex('MD5', 'x')).rejects.toThrow('Unsupported');
    await expect(digestHex('SHA-1', 'x', null)).rejects.toThrow('unavailable');
  });

  test('bytesToHex pads', () => {
    expect(bytesToHex([0, 15, 255])).toBe('000fff');
  });
});

describe('uuid', () => {
  const V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

  test('count is clamped to 1..50', () => {
    expect(clampCount(0)).toBe(1);
    expect(clampCount(500)).toBe(MAX_COUNT);
    expect(clampCount('7.9')).toBe(7);
    expect(clampCount('x')).toBe(1);
    expect(generateUuids(500)).toHaveLength(50);
  });

  test('generates distinct valid v4 ids', () => {
    const ids = generateUuids(50);
    expect(ids.every((id) => V4.test(id))).toBe(true);
    expect(new Set(ids).size).toBe(50);
  });

  test('fallback from getRandomValues sets version and variant bits', () => {
    const fake = { getRandomValues: (a) => a.fill(0xff) };
    expect(generateUuids(1, { crypto: fake })[0]).toBe('ffffffff-ffff-4fff-bfff-ffffffffffff');
    expect(uuidFromBytes(new Uint8Array(16))).toBe('00000000-0000-4000-8000-000000000000');
  });

  test('options: uppercase and no hyphens', () => {
    const [id] = generateUuids(1, { uppercase: true, hyphens: false });
    expect(id).toMatch(/^[0-9A-F]{32}$/);
  });

  test('no random source is an error', () => {
    expect(() => generateUuids(1, { crypto: {} })).toThrow('random');
  });
});
