// Pure-module tests for extensions/host.tend.calendar/date-utils.js's
// 1.4.0 "timed by default" helpers. Run with `bun test tests/js` from
// the repo root (see CONTRIBUTING.md).
import { describe, expect, test } from 'bun:test';
import {
  defaultTimedSeedForDay,
  nextFullHour,
  timeFieldsEnabled,
} from '../../../extensions/host.tend.calendar/date-utils.js';

describe('nextFullHour', () => {
  test('rounds up to the next hour boundary', () => {
    const now = new Date(2026, 8, 22, 14, 23, 10);
    const next = nextFullHour(now);
    expect(next).toEqual(new Date(2026, 8, 22, 15, 0, 0, 0));
  });

  test('exactly on the hour still advances to the next one (it is "next", not "current")', () => {
    const now = new Date(2026, 8, 22, 14, 0, 0, 0);
    expect(nextFullHour(now)).toEqual(new Date(2026, 8, 22, 15, 0, 0, 0));
  });

  test('rolls over midnight into the next day', () => {
    const now = new Date(2026, 8, 22, 23, 40);
    expect(nextFullHour(now)).toEqual(new Date(2026, 8, 23, 0, 0, 0, 0));
  });
});

describe('defaultTimedSeedForDay', () => {
  test('today seeds the next full hour from now with a one-hour duration, not all-day', () => {
    const now = new Date(2026, 8, 22, 9, 15);
    const seed = defaultTimedSeedForDay(new Date(2026, 8, 22), now);
    expect(seed.allDay).toBe(false);
    expect(seed.start).toEqual(new Date(2026, 8, 22, 10, 0, 0, 0));
    expect(seed.end.getTime() - seed.start.getTime()).toBe(60 * 60000);
  });

  test('a non-today date seeds 09:00 regardless of the current time', () => {
    const now = new Date(2026, 8, 22, 17, 50);
    const seed = defaultTimedSeedForDay(new Date(2026, 8, 25), now);
    expect(seed.allDay).toBe(false);
    expect(seed.start).toEqual(new Date(2026, 8, 25, 9, 0, 0, 0));
    expect(seed.end).toEqual(new Date(2026, 8, 25, 10, 0, 0, 0));
  });
});

describe('timeFieldsEnabled', () => {
  test('enabled when the event is not all-day', () => {
    expect(timeFieldsEnabled(false)).toBe(true);
  });

  test('disabled (dimmed, not hidden, in the editor) when All day is checked', () => {
    expect(timeFieldsEnabled(true)).toBe(false);
  });
});
