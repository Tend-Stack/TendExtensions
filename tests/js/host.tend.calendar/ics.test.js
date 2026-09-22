// Pure-module tests for extensions/host.tend.calendar/ics.js.
// Run with `bun test tests/js` from the repo root (see CONTRIBUTING.md).
import { describe, expect, test } from 'bun:test';
import { normalizeEvent } from '../../../extensions/host.tend.calendar/model.js';
import {
  escapeText,
  foldLine,
  icsEventToModel,
  mapRRuleToRecurrence,
  parseICS,
  parseICSDateValue,
  serializeICS,
  unescapeText,
  unfoldLines,
} from '../../../extensions/host.tend.calendar/ics.js';

describe('line folding', () => {
  test('short lines pass through unchanged', () => {
    expect(foldLine('SUMMARY:short')).toBe('SUMMARY:short');
  });

  test('folds long lines and unfolds back to the exact original', () => {
    const long = `SUMMARY:${'x'.repeat(220)}`;
    const folded = foldLine(long);
    expect(folded).toContain('\r\n ');
    expect(folded.split('\r\n').every((line) => line.length <= 74 || line.startsWith(' '))).toBe(true);
    const [unfolded] = unfoldLines(folded);
    expect(unfolded).toBe(long);
  });

  test('unfoldLines joins a whole document\'s continuations, one logical line per property', () => {
    const doc = 'BEGIN:VCALENDAR\r\nSUMMARY:ab\r\n cd\r\n ef\r\nEND:VCALENDAR\r\n';
    expect(unfoldLines(doc)).toEqual(['BEGIN:VCALENDAR', 'SUMMARY:abcdef', 'END:VCALENDAR']);
  });
});

describe('text escaping', () => {
  test('escapes backslash, semicolon, comma and newline', () => {
    expect(escapeText('a; b, c\\d\ne')).toBe('a\\; b\\, c\\\\d\\ne');
  });

  test('unescapeText is the exact inverse of escapeText', () => {
    for (const value of ['plain', 'a; b, c\\d\ne', 'trailing\\', '\\n\\n', '']) {
      expect(unescapeText(escapeText(value))).toBe(value);
    }
  });
});

describe('parseICSDateValue', () => {
  test('VALUE=DATE and a bare 8-digit value are both all-day, local', () => {
    expect(parseICSDateValue('20260922', { VALUE: 'DATE' })).toEqual({ date: new Date(2026, 8, 22), allDay: true });
    expect(parseICSDateValue('20260922')).toEqual({ date: new Date(2026, 8, 22), allDay: true });
  });

  test('a trailing Z is UTC, converted to a local Date', () => {
    const { date, allDay } = parseICSDateValue('20260922T140000Z');
    expect(allDay).toBe(false);
    expect(date.getTime()).toBe(Date.UTC(2026, 8, 22, 14, 0, 0));
  });

  test('a floating value (no Z, no TZID) is treated as local wall-clock time', () => {
    const { date, allDay } = parseICSDateValue('20260922T140000');
    expect(allDay).toBe(false);
    expect(date).toEqual(new Date(2026, 8, 22, 14, 0, 0));
  });

  test('a TZID-qualified value is also treated as local wall-clock time (documented simplification)', () => {
    const { date } = parseICSDateValue('20260922T140000', { TZID: 'America/New_York' });
    expect(date).toEqual(new Date(2026, 8, 22, 14, 0, 0));
  });
});

describe('mapRRuleToRecurrence', () => {
  test('no RRULE maps to none, no note', () => {
    expect(mapRRuleToRecurrence(null)).toEqual({ recurrence: 'none', recurrenceNote: null });
  });

  test('FREQ=DAILY/WEEKLY/MONTHLY with interval 1 and no bound maps directly', () => {
    expect(mapRRuleToRecurrence({ freq: 'DAILY', interval: 1, count: null, until: null })).toEqual({ recurrence: 'daily', recurrenceNote: null });
    expect(mapRRuleToRecurrence({ freq: 'WEEKLY', interval: 1, count: null, until: null })).toEqual({ recurrence: 'weekly', recurrenceNote: null });
    expect(mapRRuleToRecurrence({ freq: 'MONTHLY', interval: 1, count: null, until: null })).toEqual({ recurrence: 'monthly', recurrenceNote: null });
  });

  test('YEARLY, an interval other than 1, a COUNT or an UNTIL all fall back to a single occurrence with a note', () => {
    for (const rrule of [
      { freq: 'YEARLY', interval: 1, count: null, until: null },
      { freq: 'DAILY', interval: 2, count: null, until: null },
      { freq: 'WEEKLY', interval: 1, count: 5, until: null },
      { freq: 'MONTHLY', interval: 1, count: null, until: '20261231T000000Z' },
    ]) {
      const { recurrence, recurrenceNote } = mapRRuleToRecurrence(rrule);
      expect(recurrence).toBe('none');
      expect(typeof recurrenceNote).toBe('string');
      expect(recurrenceNote.length).toBeGreaterThan(0);
    }
  });
});

describe('parseICS', () => {
  test('parses SUMMARY/LOCATION/DESCRIPTION, DTSTART/DTEND, a UID and a VALARM', () => {
    const doc = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      'UID:abc-123',
      'DTSTART:20260922T140000',
      'DTEND:20260922T150000',
      'SUMMARY:Team sync',
      'LOCATION:Room 4',
      'DESCRIPTION:Weekly catch-up',
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      'TRIGGER:-PT15M',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR',
      '',
    ].join('\r\n');
    const { events, errors } = parseICS(doc);
    expect(errors).toEqual([]);
    expect(events).toHaveLength(1);
    const [v] = events;
    expect(v.uid).toBe('abc-123');
    expect(v.summary).toBe('Team sync');
    expect(v.location).toBe('Room 4');
    expect(v.description).toBe('Weekly catch-up');
    expect(v.dtstart).toEqual({ date: new Date(2026, 8, 22, 14, 0, 0), allDay: false });
    expect(v.dtend).toEqual({ date: new Date(2026, 8, 22, 15, 0, 0), allDay: false });
    expect(v.valarms).toEqual([{ offsetMinutes: 15 }]);
  });

  test('skips a VEVENT missing DTSTART and reports it in errors, without failing the rest', () => {
    const doc = [
      'BEGIN:VCALENDAR',
      'BEGIN:VEVENT',
      'UID:no-start',
      'SUMMARY:Missing DTSTART',
      'END:VEVENT',
      'BEGIN:VEVENT',
      'UID:ok',
      'DTSTART:20260101T090000',
      'SUMMARY:Fine',
      'END:VEVENT',
      'END:VCALENDAR',
      '',
    ].join('\r\n');
    const { events, errors } = parseICS(doc);
    expect(events).toHaveLength(1);
    expect(events[0].uid).toBe('ok');
    expect(errors).toHaveLength(1);
  });

  test('unfolds a folded SUMMARY before parsing it', () => {
    const doc = [
      'BEGIN:VCALENDAR',
      'BEGIN:VEVENT',
      'UID:folded',
      'DTSTART:20260101T090000',
      'SUMMARY:one two\r\n  three',
      'END:VEVENT',
      'END:VCALENDAR',
      '',
    ].join('\r\n');
    const { events } = parseICS(doc);
    expect(events[0].summary).toBe('one two three');
  });

  test('a positive/unsigned TRIGGER (after start) is not imported as a reminder', () => {
    const doc = [
      'BEGIN:VCALENDAR',
      'BEGIN:VEVENT',
      'UID:after',
      'DTSTART:20260101T090000',
      'BEGIN:VALARM',
      'TRIGGER:PT15M',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR',
      '',
    ].join('\r\n');
    const { events } = parseICS(doc);
    expect(events[0].valarms).toEqual([]);
  });
});

describe('icsEventToModel', () => {
  test('maps a timed VEVENT with a simple RRULE straight onto the model', () => {
    const draft = icsEventToModel({
      uid: 'u1', summary: 'Standup', location: 'Zoom', description: 'Daily',
      dtstart: { date: new Date(2026, 0, 1, 9, 0), allDay: false },
      dtend: { date: new Date(2026, 0, 1, 9, 15), allDay: false },
      rrule: { freq: 'DAILY', interval: 1, count: null, until: null },
      valarms: [{ offsetMinutes: 10 }],
    });
    const event = normalizeEvent(draft);
    expect(event.title).toBe('Standup');
    expect(event.location).toBe('Zoom');
    expect(event.allDay).toBe(false);
    expect(event.recurrence).toBe('daily');
    expect(event.source).toBe('ics-import');
    expect(event.icsUid).toBe('u1');
    expect(event.reminders).toEqual([{ offsetMinutes: 10, channels: ['panel'] }]);
    expect(draft.recurrenceNote).toBeNull();
  });

  test('all-day DTEND is exclusive in ICS, inclusive in the model — shifted back one day', () => {
    // A 3-day all-day event: DTSTART 2026-01-01, DTEND 2026-01-04 (exclusive).
    const draft = icsEventToModel({
      uid: 'u2', summary: 'Offsite', location: '', description: '',
      dtstart: { date: new Date(2026, 0, 1), allDay: true },
      dtend: { date: new Date(2026, 0, 4), allDay: true },
      rrule: null,
      valarms: [],
    });
    expect(draft.start).toBe('2026-01-01');
    expect(draft.end).toBe('2026-01-03'); // last covered day, inclusive
  });

  test('an unsupported RRULE imports as a single occurrence with a note, never silently dropped', () => {
    const draft = icsEventToModel({
      uid: 'u3', summary: 'Anniversary', location: '', description: '',
      dtstart: { date: new Date(2026, 5, 1), allDay: true },
      dtend: null,
      rrule: { freq: 'YEARLY', interval: 1, count: null, until: null },
      valarms: [],
    });
    expect(draft.recurrence).toBe('none');
    expect(draft.recurrenceNote).toContain('YEARLY');
  });
});

describe('serializeICS + parseICS round-trip', () => {
  test('a timed event with a location, notes, recurrence and a reminder round-trips', () => {
    const original = normalizeEvent({
      id: 'ev-1', title: 'Team sync', location: 'Room 4', notes: 'Bring the roadmap',
      start: '2026-09-22T14:00', end: '2026-09-22T15:00', allDay: false, recurrence: 'weekly',
      reminders: [{ offsetMinutes: 15, channels: ['panel'] }],
    });
    const doc = serializeICS([original], { now: new Date(2026, 8, 1) });
    expect(doc.includes('\r\n')).toBe(true);
    const { events, errors } = parseICS(doc);
    expect(errors).toEqual([]);
    expect(events).toHaveLength(1);

    const draft = icsEventToModel(events[0]);
    const roundTripped = normalizeEvent(draft);
    expect(roundTripped.title).toBe(original.title);
    expect(roundTripped.location).toBe(original.location);
    expect(roundTripped.notes).toBe(original.notes);
    expect(roundTripped.start).toBe(original.start);
    expect(roundTripped.end).toBe(original.end);
    expect(roundTripped.recurrence).toBe(original.recurrence);
    expect(roundTripped.reminders).toEqual([{ offsetMinutes: 15, channels: ['panel'] }]);
    expect(roundTripped.icsUid).toBe(original.id); // no icsUid on export -> UID falls back to event.id
  });

  test('an all-day multi-day event round-trips its exact start/end', () => {
    const original = normalizeEvent({
      id: 'ev-2', title: 'Offsite', allDay: true, start: '2026-03-10', end: '2026-03-12',
    });
    const doc = serializeICS([original]);
    const { events } = parseICS(doc);
    const draft = icsEventToModel(events[0]);
    expect(draft.allDay).toBe(true);
    expect(draft.start).toBe('2026-03-10');
    expect(draft.end).toBe('2026-03-12');
  });

  test('a title long enough to fold still round-trips exactly', () => {
    const longTitle = 'A very long event title that will definitely need folding across more than one physical ICS line because it just keeps going';
    const original = normalizeEvent({ id: 'ev-3', title: longTitle, start: '2026-05-01T09:00', end: '2026-05-01T10:00' });
    const doc = serializeICS([original]);
    expect(doc).toContain('\r\n ');
    const { events } = parseICS(doc);
    expect(events[0].summary).toBe(longTitle);
  });

  test('a previously-imported event exports with its original icsUid, not its internal id', () => {
    const draft = icsEventToModel({
      uid: 'external-uid-1', summary: 'From another app', location: '', description: '',
      dtstart: { date: new Date(2026, 0, 1, 9, 0), allDay: false },
      dtend: { date: new Date(2026, 0, 1, 10, 0), allDay: false },
      rrule: null, valarms: [],
    });
    const event = normalizeEvent(draft);
    expect(event.icsUid).toBe('external-uid-1');
    const doc = serializeICS([event]);
    expect(doc).toContain('UID:external-uid-1');
    expect(doc).not.toContain(event.id);
  });
});
