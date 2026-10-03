import { describe, expect, test } from 'bun:test';
import { describeInstant, isoWithOffset, parseTimestampInput, relativeTime } from '../../../extensions/host.tend.devtools/lib/timestamp.js';

describe('parseTimestampInput', () => {
  test('auto detects seconds and milliseconds', () => {
    expect(parseTimestampInput('1700000000')).toEqual({ ok: true, ms: 1700000000000, interpretedAs: 'seconds' });
    expect(parseTimestampInput('1700000000123')).toEqual({ ok: true, ms: 1700000000123, interpretedAs: 'milliseconds' });
  });

  test('explicit unit overrides detection', () => {
    expect(parseTimestampInput('1700000000', 'ms').ms).toBe(1700000000);
    expect(parseTimestampInput('99999999999999', 's').ok).toBe(false);
  });

  test('fractional seconds and negatives', () => {
    expect(parseTimestampInput('1.5').ms).toBe(1500);
    expect(parseTimestampInput('-86400').ms).toBe(-86400000);
  });

  test('ISO dates, with and without offset', () => {
    expect(parseTimestampInput('2026-10-03T12:00:00Z')).toMatchObject({ ok: true, ms: Date.UTC(2026, 9, 3, 12), interpretedAs: 'date' });
    expect(parseTimestampInput('2026-10-03T12:00:00+02:00').ms).toBe(Date.UTC(2026, 9, 3, 10));
  });

  test('garbage and out-of-range values are refused', () => {
    expect(parseTimestampInput('').ok).toBe(false);
    expect(parseTimestampInput('tomorrow-ish').ok).toBe(false);
    expect(parseTimestampInput('99999999999999999999', 'ms').error).toContain('range');
  });
});

describe('describeInstant', () => {
  const ms = Date.UTC(2026, 9, 3, 12, 30, 15, 42);
  const now = Date.UTC(2026, 9, 3, 12, 30, 15, 42) + 5 * 60000;

  test('gives every representation for a fixed offset', () => {
    const d = describeInstant(ms, { offsetMinutes: -240, nowMs: now });
    expect(d.seconds).toBe(1791030615);
    expect(d.milliseconds).toBe(ms);
    expect(d.iso).toBe('2026-10-03T12:30:15.042Z');
    expect(d.localIso).toBe('2026-10-03T08:30:15.042-04:00');
    expect(d.utc).toBe('Sat, 03 Oct 2026 12:30:15 GMT');
    expect(d.relative).toBe('5 minutes ago');
  });

  test('offset formatting for half-hour and east-of-UTC zones', () => {
    expect(isoWithOffset(0, 330)).toBe('1970-01-01T05:30:00.000+05:30');
    expect(isoWithOffset(0, 0)).toBe('1970-01-01T00:00:00.000+00:00');
  });

  test('negative instants floor toward the past', () => {
    expect(describeInstant(-1, { offsetMinutes: 0, nowMs: 0 }).seconds).toBe(-1);
  });

  test('relative wording', () => {
    expect(relativeTime(0)).toBe('now');
    expect(relativeTime(30)).toBe('in 30 seconds');
    expect(relativeTime(-1)).toBe('1 second ago');
    expect(relativeTime(86400 * 400)).toBe('in 1 year');
  });
});
