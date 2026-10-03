import { describe, expect, test } from 'bun:test';
import {
  BUDGET_MS, MAX_INPUT_CHARS, buildSegments, capturingGroups, hasNestedQuantifier, runRegex,
} from '../../../extensions/host.tend.devtools/lib/regex-guard.js';

describe('matching', () => {
  test('finds matches with groups, named groups and spans', () => {
    const r = runRegex('(?<key>\\w+)=(\\d+)', 'g', 'a=1, bb=22');
    expect(r.ok).toBe(true);
    expect(r.matches).toHaveLength(2);
    expect(r.matches[1]).toMatchObject({ index: 5, end: 10, text: 'bb=22' });
    expect(r.matches[1].groups).toEqual([
      { number: 1, name: 'key', text: 'bb', start: 5, end: 7 },
      { number: 2, name: null, text: '22', start: 8, end: 10 },
    ]);
  });

  test('always scans every match, even without the g flag', () => {
    expect(runRegex('a', '', 'aaa').matches).toHaveLength(3);
  });

  test('flags: i, m, s behave', () => {
    expect(runRegex('^b', 'im', 'a\nB').matches).toHaveLength(1);
    expect(runRegex('a.b', 's', 'a\nb').matches).toHaveLength(1);
    expect(runRegex('a.b', '', 'a\nb').matches).toHaveLength(0);
  });

  test('empty matches advance and terminate', () => {
    const r = runRegex('x*', 'g', 'abc');
    expect(r.ok).toBe(true);
    expect(r.matches).toHaveLength(4);
  });

  test('invalid patterns report the engine message', () => {
    const r = runRegex('(', 'g', 'x');
    expect(r).toMatchObject({ ok: false, reason: 'error' });
    expect(r.message.length).toBeGreaterThan(0);
    expect(runRegex('a', 'gg?', 'a').ok).toBe(true);
  });

  test('no pattern is an empty result', () => {
    expect(runRegex('', 'g', 'abc')).toEqual({ ok: true, matches: [], truncated: false });
  });

  test('match count is capped and says so', () => {
    const r = runRegex('a', 'g', 'a'.repeat(5000), { maxMatches: 100 });
    expect(r.matches).toHaveLength(100);
    expect(r.truncated).toBe(true);
  });
});

describe('guards', () => {
  test('text over the cap is refused before running anything', () => {
    const r = runRegex('a', 'g', 'a'.repeat(MAX_INPUT_CHARS + 1));
    expect(r).toMatchObject({ ok: false, reason: 'too-long' });
    expect(runRegex('a', 'g', 'a'.repeat(MAX_INPUT_CHARS)).ok).toBe(true);
  });

  test('catastrophic nested quantifiers stop at the probe, quickly', () => {
    const started = performance.now();
    const r = runRegex('(a+)+$', '', `${'a'.repeat(40)}!`);
    expect(r).toMatchObject({ ok: false, reason: 'too-slow' });
    expect(performance.now() - started).toBeLessThan(1000);
  });

  test('other classic traps are caught the same way', () => {
    for (const pattern of ['(a*)*b', '(\\w+\\s?)+$', '(.*a){12}x', '^(([a-z])+.)+[A-Z]([a-z])+$']) {
      const text = `${'a '.repeat(30)}!`;
      const r = runRegex(pattern, '', text);
      // Either flagged as too slow or finished inside the budget; never a hang.
      expect(r.ok || r.reason === 'too-slow').toBe(true);
    }
  });

  test('harmless nested groups with a delimiter still run', () => {
    const r = runRegex('(\\d+\\.)+\\d+', 'g', '10.0.0.1 and 192.168.1.20');
    expect(r.ok).toBe(true);
    expect(r.matches.map((m) => m.text)).toEqual(['10.0.0.1', '192.168.1.20']);
  });

  test('the budget is enforced between matches using the injected clock', () => {
    let t = 0;
    const now = () => { t += 20; return t; };
    const r = runRegex('a', 'g', 'aaaaaaaa', { now, budgetMs: BUDGET_MS });
    expect(r).toMatchObject({ ok: false, reason: 'too-slow' });
    expect(r.message).toContain('50 ms');
  });

  test('a run that finishes over budget is reported, not shown', () => {
    let t = 0;
    const now = () => { t += 60; return t; };
    expect(runRegex('a', 'g', 'a', { now }).reason).toBe('too-slow');
  });

  test('a fast run under a real clock passes', () => {
    expect(runRegex('\\d+', 'g', '1 22 333'.repeat(500)).ok).toBe(true);
  });
});

describe('pattern analysis', () => {
  test('nested quantifier detection', () => {
    for (const bad of ['(a+)+', '(a*)*', '(?:a+)*', '(a+){2,}', '((a+)b)+', '(\\w+\\s?)+']) {
      expect(hasNestedQuantifier(bad)).toBe(true);
    }
    for (const fine of ['a+b+', '(ab)+', '(a|b)*', '(a+)', '(a+){2}', '[(a+)+]', '\\(a+\\)+', '(a+)?', '(?<n>\\d{1,3})+']) {
      expect(hasNestedQuantifier(fine)).toBe(false);
    }
  });

  test('capturing group names, skipping lookarounds and non-capturing groups', () => {
    expect(capturingGroups('(a)(?:b)(?<x>c)(?=d)(?<!e)(?<y>f)([(])\\(z\\)')).toEqual([null, 'x', 'y', null]);
  });
});

describe('segments', () => {
  test('covers the whole text, innermost group wins', () => {
    const text = 'xx key=val yy';
    const r = runRegex('(\\w+)=(\\w+)', 'g', text);
    const segs = buildSegments(text, r.matches);
    expect(segs.map((s) => s.text).join('')).toBe(text);
    expect(segs.map((s) => [s.text, s.match, s.group])).toEqual([
      ['xx ', -1, 0], ['key', 0, 1], ['=', 0, 0], ['val', 0, 2], [' yy', -1, 0],
    ]);
  });

  test('adjacent matches and empty matches', () => {
    const text = 'aab';
    const segs = buildSegments(text, runRegex('a', 'g', text).matches);
    expect(segs.map((s) => [s.text, s.match])).toEqual([['a', 0], ['a', 1], ['b', -1]]);
    expect(buildSegments('abc', runRegex('x*', 'g', 'abc').matches).map((s) => s.match)).toEqual([-1]);
  });

  test('no matches gives a single plain segment', () => {
    expect(buildSegments('hello', [])).toEqual([{ text: 'hello', match: -1, group: 0 }]);
    expect(buildSegments('', [])).toEqual([]);
  });
});
