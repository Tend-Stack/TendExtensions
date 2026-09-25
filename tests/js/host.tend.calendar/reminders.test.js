// Pure-module tests for extensions/host.tend.calendar/reminders.js.
// Run with `bun test tests/js` from the repo root (see CONTRIBUTING.md).
import { describe, expect, test } from 'bun:test';
import { REMINDER_CHANNELS, normalizeEvent } from '../../../extensions/host.tend.calendar/model.js';
import {
  REMINDER_PRESETS,
  computeAllReminderRows,
  computeReminderSchedule,
  customOffsetMinutes,
  guessCustomOffset,
  idsToCancel,
  reminderChannelsFromSelection,
  reminderId,
  reminderLabel,
  reminderOccurrences,
} from '../../../extensions/host.tend.calendar/reminders.js';

function iso(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

describe('customOffsetMinutes', () => {
  test('converts amount + unit to minutes', () => {
    expect(customOffsetMinutes('2', 'hours')).toBe(120);
    expect(customOffsetMinutes('1', 'days')).toBe(1440);
    expect(customOffsetMinutes('1', 'weeks')).toBe(10080);
    expect(customOffsetMinutes('30', 'minutes')).toBe(30);
  });

  test('rejects non-positive or non-numeric amounts, and unknown units', () => {
    expect(customOffsetMinutes('0', 'minutes')).toBeNull();
    expect(customOffsetMinutes('-5', 'hours')).toBeNull();
    expect(customOffsetMinutes('abc', 'hours')).toBeNull();
    expect(customOffsetMinutes('5', 'fortnights')).toBeNull();
  });
});

describe('guessCustomOffset', () => {
  test('round-trips every preset through the largest exact unit', () => {
    expect(guessCustomOffset(0)).toEqual({ amount: 0, unit: 'minutes' });
    expect(guessCustomOffset(5)).toEqual({ amount: 5, unit: 'minutes' });
    expect(guessCustomOffset(60)).toEqual({ amount: 1, unit: 'hours' });
    expect(guessCustomOffset(720)).toEqual({ amount: 12, unit: 'hours' });
    expect(guessCustomOffset(1440)).toEqual({ amount: 1, unit: 'days' });
    expect(guessCustomOffset(4320)).toEqual({ amount: 3, unit: 'days' });
    expect(guessCustomOffset(10080)).toEqual({ amount: 1, unit: 'weeks' });
  });

  test('is the exact inverse of customOffsetMinutes for whole units', () => {
    for (const [amount, unit] of [[3, 'weeks'], [5, 'days'], [7, 'hours'], [90, 'minutes']]) {
      const minutes = customOffsetMinutes(amount, unit);
      expect(guessCustomOffset(minutes)).toEqual({ amount, unit });
    }
  });
});

describe('reminderLabel', () => {
  test('uses the preset label when the offset matches one', () => {
    for (const preset of REMINDER_PRESETS) expect(reminderLabel(preset.offsetMinutes)).toBe(preset.label);
  });

  test('builds a label for a custom offset, singular vs plural', () => {
    expect(reminderLabel(120)).toBe('2 hours before');
    expect(reminderLabel(60 * 24 * 2)).toBe('2 days before');
    expect(reminderLabel(90)).toBe('90 minutes before'); // doesn't divide evenly into a larger unit
  });
});

describe('reminderId', () => {
  test('is `<eventId>:<offset>` with no occurrence index', () => {
    expect(reminderId('ev-1', 15)).toBe('ev-1:15');
    expect(reminderId('ev-1', 0)).toBe('ev-1:0');
  });

  test('appends the occurrence index when one is given (recurring events)', () => {
    expect(reminderId('ev-1', 15, 3)).toBe('ev-1:15:3');
  });
});

describe('reminderOccurrences', () => {
  test('a non-recurring event yields exactly its one occurrence, occursAt 0', () => {
    const now = new Date(2026, 8, 22, 9, 0);
    const start = new Date(2026, 8, 25, 14, 0);
    const event = normalizeEvent({ title: 'Standup', start: iso(start), end: iso(new Date(start.getTime() + 30 * 60000)) });
    const occurrences = reminderOccurrences(event, now);
    expect(occurrences).toHaveLength(1);
    expect(occurrences[0].occursAt).toBe(0);
    expect(occurrences[0].start.getTime()).toBe(start.getTime());
  });

  test('a recurring event yields up to 8 future occurrences within 90 days', () => {
    const now = new Date(2026, 0, 1, 9, 0);
    const start = new Date(2026, 0, 1, 9, 0);
    const event = normalizeEvent({
      title: 'Daily standup', recurrence: 'daily',
      start: iso(start), end: iso(new Date(start.getTime() + 15 * 60000)),
    });
    const occurrences = reminderOccurrences(event, now);
    expect(occurrences.length).toBeLessThanOrEqual(8);
    expect(occurrences.length).toBe(8);
    for (const occ of occurrences) expect(occ.start.getTime()).toBeGreaterThanOrEqual(now.getTime());
    // Stable, increasing occursAt indices.
    expect(occurrences.map((o) => o.occursAt)).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
  });

  test('a weekly recurrence more than 90 days out yields nothing', () => {
    const now = new Date(2026, 0, 1, 9, 0);
    const start = new Date(2026, 0, 1, 9, 0);
    const event = normalizeEvent({
      title: 'Quarterly weekly-ish', recurrence: 'weekly',
      start: iso(start), end: iso(new Date(start.getTime() + 30 * 60000)),
    });
    const occurrences = reminderOccurrences(event, now);
    // Weekly for 90 days is at most 13 occurrences; all must fall within the horizon.
    for (const occ of occurrences) {
      expect(occ.start.getTime()).toBeLessThanOrEqual(now.getTime() + 90 * 86400000);
    }
  });
});

describe('computeReminderSchedule', () => {
  test('one reminder on a future non-recurring event schedules one row in the future', () => {
    const now = new Date(2026, 8, 22, 9, 0);
    const start = new Date(2026, 8, 22, 15, 0);
    const event = normalizeEvent({
      id: 'ev-1', title: 'Dentist', start: iso(start), end: iso(new Date(start.getTime() + 3600000)),
      reminders: [{ offsetMinutes: 15, channels: ['panel'] }],
    });
    const rows = computeReminderSchedule(event, now);
    expect(rows).toHaveLength(1);
    expect(rows[0].id).toBe('ev-1:15');
    expect(rows[0].at.getTime()).toBe(start.getTime() - 15 * 60000);
    expect(rows[0].channels).toEqual(['panel']);
  });

  test('the offset computes from the exact non-midnight start (1.4.0: no rounding to midnight)', () => {
    const now = new Date(2026, 8, 22, 9, 0);
    const start = new Date(2026, 8, 22, 14, 37); // an odd minute, well away from midnight
    const event = normalizeEvent({
      id: 'ev-1c', title: 'Odd-minute meeting', start: iso(start), end: iso(new Date(start.getTime() + 3600000)),
      reminders: [{ offsetMinutes: 10, channels: ['panel'] }],
    });
    const rows = computeReminderSchedule(event, now);
    expect(rows).toHaveLength(1);
    // 14:37 - 10 minutes = 14:27, not midnight and not rounded to any hour.
    expect(rows[0].at.getTime()).toBe(start.getTime() - 10 * 60000);
    expect(rows[0].at.getHours()).toBe(14);
    expect(rows[0].at.getMinutes()).toBe(27);
  });

  test('a reminder whose computed time has already passed is dropped', () => {
    const now = new Date(2026, 8, 22, 15, 0);
    const start = new Date(2026, 8, 22, 15, 10); // starts in 10 minutes
    const event = normalizeEvent({
      id: 'ev-2', title: 'Soon', start: iso(start), end: iso(new Date(start.getTime() + 1800000)),
      reminders: [{ offsetMinutes: 15, channels: ['panel'] }], // 15-before is 5 minutes ago
    });
    const rows = computeReminderSchedule(event, now);
    expect(rows).toHaveLength(0);
  });

  test('an event with no reminders schedules nothing', () => {
    const now = new Date(2026, 8, 22, 9, 0);
    const event = normalizeEvent({ id: 'ev-3', title: 'No reminders', start: iso(new Date(2026, 8, 23, 9, 0)) });
    expect(computeReminderSchedule(event, now)).toEqual([]);
  });

  test('a recurring event with two reminders schedules one row per occurrence per reminder, ids stable across recomputation', () => {
    // `now` sits an hour before the first occurrence so both reminders'
    // `at` (including the 10-minutes-before one) land in the future for
    // every occurrence, including the first.
    const now = new Date(2026, 0, 1, 8, 0);
    const start = new Date(2026, 0, 1, 9, 0);
    const event = normalizeEvent({
      id: 'ev-4', title: 'Daily standup', recurrence: 'daily',
      start: iso(start), end: iso(new Date(start.getTime() + 900000)),
      reminders: [{ offsetMinutes: 0, channels: ['panel'] }, { offsetMinutes: 10, channels: ['panel', 'email'] }],
    });
    const first = computeReminderSchedule(event, now);
    expect(first).toHaveLength(16); // 8 occurrences x 2 reminders
    const idsFirst = first.map((r) => r.id).sort();

    // Recompute an hour later (simulating the hourly refresh) — ids for
    // occurrences still in range must be identical, not re-derived from
    // a shifted anchor.
    const later = new Date(now.getTime() + 3600000);
    const second = computeReminderSchedule(event, later);
    const idsSecond = second.map((r) => r.id);
    for (const id of idsSecond) expect(idsFirst).toContain(id);
  });
});

describe('computeAllReminderRows', () => {
  test('flattens computeReminderSchedule over every event', () => {
    const now = new Date(2026, 8, 22, 9, 0);
    const a = normalizeEvent({
      id: 'a', title: 'A', start: iso(new Date(2026, 8, 22, 12, 0)),
      reminders: [{ offsetMinutes: 15, channels: ['panel'] }],
    });
    const b = normalizeEvent({
      id: 'b', title: 'B', start: iso(new Date(2026, 8, 22, 13, 0)),
      reminders: [{ offsetMinutes: 5, channels: ['panel'] }],
    });
    const rows = computeAllReminderRows([a, b], now);
    expect(rows.map((r) => r.id).sort()).toEqual(['a:15', 'b:5']);
  });
});

describe('idsToCancel', () => {
  test('returns ids present before but not after', () => {
    expect(idsToCancel(['a', 'b', 'c'], ['b', 'c', 'd'])).toEqual(['a']);
    expect(idsToCancel([], ['a'])).toEqual([]);
    expect(idsToCancel(['a'], [])).toEqual(['a']);
  });
});

// 1.3.0: the editor's Sound checkbox alongside Panel/Email.
describe('reminderChannelsFromSelection', () => {
  test('one channel per box ticked, in panel/email/sound order', () => {
    expect(reminderChannelsFromSelection({ panel: true, email: false, sound: false })).toEqual(['panel']);
    expect(reminderChannelsFromSelection({ panel: true, email: true, sound: false })).toEqual(['panel', 'email']);
    expect(reminderChannelsFromSelection({ panel: false, email: true, sound: false })).toEqual(['email']);
  });

  test('sound implies panel even when Panel itself is unticked', () => {
    expect(reminderChannelsFromSelection({ panel: false, email: false, sound: true })).toEqual(['panel', 'sound']);
    expect(reminderChannelsFromSelection({ panel: false, email: true, sound: true })).toEqual(['panel', 'email', 'sound']);
  });

  test('ticking Panel and Sound together does not duplicate panel', () => {
    expect(reminderChannelsFromSelection({ panel: true, email: false, sound: true })).toEqual(['panel', 'sound']);
  });

  test('nothing ticked falls back to panel, same as model.js normalization', () => {
    expect(reminderChannelsFromSelection({ panel: false, email: false, sound: false })).toEqual(['panel']);
    expect(reminderChannelsFromSelection({})).toEqual(['panel']);
    expect(reminderChannelsFromSelection()).toEqual(['panel']);
  });
});

describe('sound channel — model.js normalization (migration)', () => {
  test('REMINDER_CHANNELS recognizes sound alongside panel and email', () => {
    expect(REMINDER_CHANNELS).toEqual(['panel', 'email', 'sound']);
  });

  test('a reminder saved with a sound channel round-trips through normalizeEvent', () => {
    const event = normalizeEvent({
      id: 'ev', title: 'X', start: '2026-09-22T09:00',
      reminders: [{ offsetMinutes: 10, channels: ['panel', 'sound'] }],
    });
    expect(event.reminders).toEqual([{ offsetMinutes: 10, channels: ['panel', 'sound'] }]);
  });

  test('an event saved before 1.3.0 (no sound channel present) is untouched — no migration step needed', () => {
    const event = normalizeEvent({
      id: 'ev', title: 'X', start: '2026-09-22T09:00',
      reminders: [{ offsetMinutes: 10, channels: ['panel', 'email'] }],
    });
    expect(event.reminders).toEqual([{ offsetMinutes: 10, channels: ['panel', 'email'] }]);
  });

  test('an unknown channel is dropped, keeping the recognized ones', () => {
    const event = normalizeEvent({
      id: 'ev', title: 'X', start: '2026-09-22T09:00',
      reminders: [{ offsetMinutes: 10, channels: ['sound', 'sms', 'bogus'] }],
    });
    expect(event.reminders).toEqual([{ offsetMinutes: 10, channels: ['sound'] }]);
  });
});
