/* Reminder maths: presets, custom offsets, deterministic ids, and the
 * occurrence → schedule-row expansion. Everything here is pure (no
 * `host`, no DOM, no timers) so it's covered directly by
 * `tests/js/host.tend.calendar/reminders.test.js` under `bun test`; the
 * host-calling side (index.js) only turns these rows into
 * `host.reminders.schedule()` items and awaits them.
 */
import { occurrencesInRange } from './model.js';
import { parseLocal } from './date-utils.js';

export const REMINDER_PRESETS = [
  { offsetMinutes: 0, label: 'At time of event' },
  { offsetMinutes: 5, label: '5 minutes before' },
  { offsetMinutes: 15, label: '15 minutes before' },
  { offsetMinutes: 60, label: '1 hour before' },
  { offsetMinutes: 720, label: '12 hours before' },
  { offsetMinutes: 1440, label: '1 day before' },
  { offsetMinutes: 4320, label: '3 days before' },
];

export const CUSTOM_UNITS = ['minutes', 'hours', 'days', 'weeks'];
export const CUSTOM_UNIT_MINUTES = { minutes: 1, hours: 60, days: 1440, weeks: 10080 };

/** Amount + unit (the "Custom…" row) → offsetMinutes, or `null` when
 *  the amount isn't a usable positive number. */
export function customOffsetMinutes(amount, unit) {
  const n = Number(amount);
  const perUnit = CUSTOM_UNIT_MINUTES[unit];
  if (!Number.isFinite(n) || n <= 0 || !perUnit) return null;
  return Math.round(n * perUnit);
}

/** Inverse of `customOffsetMinutes`, for re-showing a non-preset offset
 *  in the amount/unit pair: picks the largest unit that divides evenly
 *  so "1 day before" round-trips as `{ amount: 1, unit: 'days' }`
 *  rather than `{ amount: 1440, unit: 'minutes' }`. */
export function guessCustomOffset(offsetMinutes) {
  for (const unit of ['weeks', 'days', 'hours']) {
    const perUnit = CUSTOM_UNIT_MINUTES[unit];
    if (offsetMinutes > 0 && offsetMinutes % perUnit === 0) return { amount: offsetMinutes / perUnit, unit };
  }
  return { amount: offsetMinutes, unit: 'minutes' };
}

/** Human label for any offset, preset or custom. */
export function reminderLabel(offsetMinutes) {
  const preset = REMINDER_PRESETS.find((p) => p.offsetMinutes === offsetMinutes);
  if (preset) return preset.label;
  const { amount, unit } = guessCustomOffset(offsetMinutes);
  const singularUnit = amount === 1 ? unit.slice(0, -1) : unit;
  return `${amount} ${singularUnit} before`;
}

/** Deterministic id for one scheduled reminder: `<eventId>:<offset>`
 *  for a non-recurring event (a single occurrence, so the offset alone
 *  disambiguates it), `<eventId>:<offset>:<occursAt>` for a recurring
 *  one, where `occursAt` is the same stable per-occurrence index
 *  `model.js#occurrencesInRange` produces — deviation from the literal
 *  `<eventId>:<offset>` form the package brief gives, needed because a
 *  recurring event schedules several future occurrences at once and
 *  `host.reminders.schedule` upserts by id. */
export function reminderId(eventId, offsetMinutes, occursAt = 0) {
  return occursAt ? `${eventId}:${offsetMinutes}:${occursAt}` : `${eventId}:${offsetMinutes}`;
}

const MAX_RECURRING_OCCURRENCES = 8;
const HORIZON_DAYS = 90;
const DAY_MS = 24 * 60 * 60 * 1000;

/** The occurrence(s) to schedule reminders against: the single
 *  occurrence of a non-recurring event (even if its start has already
 *  passed — `computeReminderSchedule` drops any reminder whose `at` is
 *  no longer in the future), or up to `MAX_RECURRING_OCCURRENCES`
 *  future occurrences within `HORIZON_DAYS` for a recurring one. */
export function reminderOccurrences(event, now = new Date()) {
  if (event.recurrence === 'none') {
    const start = parseLocal(event.start);
    const end = parseLocal(event.end);
    if (!start || !end) return [];
    return [{ event, start, end, occursAt: 0 }];
  }
  const rangeEnd = new Date(now.getTime() + HORIZON_DAYS * DAY_MS);
  return occurrencesInRange(event, now, rangeEnd)
    .filter((o) => o.start >= now)
    .slice(0, MAX_RECURRING_OCCURRENCES);
}

/** Every `{ id, at, offsetMinutes, channels, occursAt, occurrenceStart,
 *  event }` row to hand the host for one event — `at` is always in the
 *  future. No host/network access; index.js turns each row into a
 *  `host.reminders.schedule()` item (title/body/url) and calls it. */
export function computeReminderSchedule(event, now = new Date()) {
  if (!event.reminders?.length) return [];
  const occurrences = reminderOccurrences(event, now);
  const rows = [];
  for (const occ of occurrences) {
    for (const reminder of event.reminders) {
      const at = new Date(occ.start.getTime() - reminder.offsetMinutes * 60000);
      if (at < now) continue;
      rows.push({
        id: reminderId(event.id, reminder.offsetMinutes, occ.occursAt),
        at,
        offsetMinutes: reminder.offsetMinutes,
        channels: reminder.channels,
        occursAt: occ.occursAt,
        occurrenceStart: occ.start,
        event,
      });
    }
  }
  return rows;
}

/** `computeReminderSchedule` over every event, flattened. */
export function computeAllReminderRows(events, now = new Date()) {
  const rows = [];
  for (const event of events) rows.push(...computeReminderSchedule(event, now));
  return rows;
}

/** Ids present in `previousIds` but not `nextIds` — what to
 *  `host.reminders.cancel()` after an edit, a delete, or a reconcile. */
export function idsToCancel(previousIds, nextIds) {
  const next = new Set(nextIds);
  return previousIds.filter((id) => !next.has(id));
}
