/* The event model: shape, defaults, and recurrence expansion.
 *
 * An event's `source` is `'local'` (created in the calendar) or
 * `'ics-import'` (brought in through Settings → Import & export, 1.2.0).
 * The field exists so a future integration (Google Calendar, an iCal
 * subscription, panel-generated events) can add rows with a different
 * `source` and the views, the editor's read-only affordances, and
 * storage schema never need to migrate — they already branch on it.
 * `icsUid` carries the original VEVENT UID for an imported event so a
 * re-import can update it in place instead of duplicating it; it's
 * `null` for everything else.
 */
import { addDays, addMonths, parseLocal, toLocalISO } from './date-utils.js';

const DAY_MS = 24 * 60 * 60 * 1000;

/* The `host.storage` key events live under — shared by the main window
 * (index.js) and the Upcoming shelf widget (widgets/upcoming.js) so
 * both read the exact same array. */
export const EVENTS_KEY = 'events.v1';

export const COLORS = [
  { id: 'sky', hex: '#38bdf8' },
  { id: 'violet', hex: '#a78bfa' },
  { id: 'rose', hex: '#fb7185' },
  { id: 'amber', hex: '#fbbf24' },
  { id: 'green', hex: '#4ade80' },
  { id: 'slate', hex: '#94a3b8' },
];

export const RECURRENCE_OPTIONS = ['none', 'daily', 'weekly', 'monthly'];
export const SOURCES = ['local', 'ics-import'];
export const REMINDER_CHANNELS = ['panel', 'email', 'sound']; // 'sound', 1.3.0

export function createId() {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  } catch { /* fall through */ }
  return `ev-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

function normalizeReminderEntry(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const offsetMinutes = Number(raw.offsetMinutes);
  if (!Number.isFinite(offsetMinutes) || offsetMinutes < 0) return null;
  const channelsRaw = Array.isArray(raw.channels) ? raw.channels : ['panel'];
  const channels = REMINDER_CHANNELS.filter((c) => channelsRaw.includes(c));
  return { offsetMinutes: Math.round(offsetMinutes), channels: channels.length ? channels : ['panel'] };
}

/** Validate + de-duplicate (by offset) a stored or freshly-edited
 *  reminders array. An event with no `reminders` field at all (every
 *  event created before 1.2.0) normalizes to `[]` — no migration step
 *  needed beyond this function running on load. */
export function normalizeReminders(raw) {
  if (!Array.isArray(raw)) return [];
  const seen = new Set();
  const out = [];
  for (const entry of raw) {
    const normalized = normalizeReminderEntry(entry);
    if (!normalized || seen.has(normalized.offsetMinutes)) continue;
    seen.add(normalized.offsetMinutes);
    out.push(normalized);
  }
  return out.sort((a, b) => a.offsetMinutes - b.offsetMinutes);
}

/** Fill in anything missing/invalid on a stored or freshly-created
 *  event so the rest of the extension never has to guard for it. */
export function normalizeEvent(raw) {
  const now = new Date();
  const startStr = typeof raw?.start === 'string' ? raw.start : toLocalISO(now, false);
  const start = parseLocal(startStr) ?? now;
  const allDay = raw?.allDay !== false && (raw?.allDay === true || !String(raw?.start ?? '').includes('T'));
  const fallbackEnd = allDay ? start : new Date(start.getTime() + 60 * 60000);
  const endStr = typeof raw?.end === 'string' ? raw.end : toLocalISO(fallbackEnd, !allDay);
  let end = parseLocal(endStr) ?? fallbackEnd;
  if (end < start) end = fallbackEnd;
  return {
    id: typeof raw?.id === 'string' && raw.id ? raw.id : createId(),
    title: typeof raw?.title === 'string' ? raw.title : '',
    start: toLocalISO(start, !allDay),
    end: toLocalISO(end, !allDay),
    allDay,
    color: COLORS.some((c) => c.id === raw?.color) ? raw.color : COLORS[0].id,
    location: typeof raw?.location === 'string' ? raw.location : '',
    notes: typeof raw?.notes === 'string' ? raw.notes : '',
    recurrence: RECURRENCE_OPTIONS.includes(raw?.recurrence) ? raw.recurrence : 'none',
    reminders: normalizeReminders(raw?.reminders),
    source: SOURCES.includes(raw?.source) ? raw.source : 'local',
    icsUid: typeof raw?.icsUid === 'string' && raw.icsUid ? raw.icsUid : null,
    createdAt: typeof raw?.createdAt === 'number' ? raw.createdAt : Date.now(),
    updatedAt: Date.now(),
  };
}

function stepFor(recurrence) {
  if (recurrence === 'daily') return (d, n) => addDays(d, n);
  if (recurrence === 'weekly') return (d, n) => addDays(d, n * 7);
  if (recurrence === 'monthly') return (d, n) => addMonths(d, n);
  return null;
}

/** All occurrences of one event that overlap [rangeStart, rangeEnd).
 *  Non-recurring events yield at most one occurrence. Recurring events
 *  walk forward from a nearby anchor (never from the epoch) so a
 *  yearly-scale recurrence on a wide agenda window stays cheap.
 *
 *  An all-day event's stored `end` is the *last covered day*
 *  (inclusive — what a date picker naturally produces: a one-day
 *  event has start === end). Day-membership math wants an exclusive
 *  boundary instead, so it's normalized to "start of the day after"
 *  right here, once, rather than in every view that filters by day. */
export function occurrencesInRange(event, rangeStart, rangeEnd) {
  const start = parseLocal(event.start);
  const endRaw = parseLocal(event.end);
  if (!start || !endRaw) return [];
  const end = event.allDay ? addDays(endRaw, 1) : endRaw;
  const durationMs = Math.max(0, end - start);
  const out = [];

  const step = stepFor(event.recurrence);
  if (!step) {
    if (start < rangeEnd && end >= rangeStart) out.push({ event, start, end, occursAt: 0 });
    return out;
  }

  // Find an anchor index close to rangeStart without walking from n=0
  // one step at a time for a years-old daily/weekly event.
  let lo = 0;
  while (step(start, lo) < rangeStart) {
    const jump = Math.max(1, Math.floor((rangeStart - step(start, lo)) / (event.recurrence === 'monthly' ? 30 * DAY_MS : event.recurrence === 'weekly' ? 7 * DAY_MS : DAY_MS)));
    lo += jump;
  }
  lo = Math.max(0, lo - 2);

  const MAX_OCCURRENCES = 400;
  for (let n = lo; n < lo + MAX_OCCURRENCES; n++) {
    const occStart = step(start, n);
    if (occStart >= rangeEnd) break;
    const occEnd = new Date(occStart.getTime() + durationMs);
    if (occEnd >= rangeStart) out.push({ event, start: occStart, end: occEnd, occursAt: n });
  }
  return out;
}

/** Expand a list of events over a range and sort for display: all-day
 *  first, then by start time. */
export function expandRange(events, rangeStart, rangeEnd) {
  const out = [];
  for (const event of events) out.push(...occurrencesInRange(event, rangeStart, rangeEnd));
  out.sort((a, b) => {
    if (a.event.allDay !== b.event.allDay) return a.event.allDay ? -1 : 1;
    return a.start - b.start;
  });
  return out;
}
