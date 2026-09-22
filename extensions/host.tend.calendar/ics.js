/* RFC 5545 (iCalendar) import/export, scoped to what the calendar's own
 * model can represent. Pure functions — no host, no DOM, no network —
 * covered by `tests/js/host.tend.calendar/ics.test.js` under `bun test`.
 *
 * Times: an event's stored start/end are local wall-clock strings with
 * no timezone (see date-utils.js). Export therefore always writes
 * *floating* local date-times (no `Z`, no `TZID`) for timed events and
 * `VALUE=DATE` for all-day ones. Import treats a floating time and a
 * `TZID`-qualified time identically — both become the browser's local
 * wall-clock time — and only a trailing `Z` (UTC) gets a real
 * conversion. That's a deliberate simplification: the model has no
 * concept of "this event's timezone", so a `TZID` value is the closest
 * thing to floating time it can round-trip.
 *
 * RRULE: only FREQ=DAILY/WEEKLY/MONTHLY with INTERVAL=1 and no
 * COUNT/UNTIL maps onto the model's simple, endless recurrence
 * (RECURRENCE_OPTIONS in model.js). Anything richer (YEARLY, an
 * interval other than 1, a COUNT or an UNTIL) is imported as a single
 * occurrence — `icsEventToModel` returns a `recurrenceNote` explaining
 * why, for the import preview dialog to show; it is never silently
 * dropped.
 */
import { addDays, parseLocal, toLocalISO } from './date-utils.js';

const CRLF = '\r\n';
const FOLD_LIMIT = 74; // characters per physical line before a continuation

// ---------- line folding ----------

/** RFC 5545 §3.1 line folding: no physical line over ~75 octets: split
 *  and continue on the next line indented by one space. Byte-precise
 *  folding isn't attempted (ASCII-safe fold point only) — good enough
 *  for the plain-text fields this module writes, and it round-trips
 *  with `unfoldLines` below regardless. */
export function foldLine(line) {
  if (line.length <= FOLD_LIMIT) return line;
  let out = line.slice(0, FOLD_LIMIT);
  let rest = line.slice(FOLD_LIMIT);
  const continuationTake = FOLD_LIMIT - 1; // one column spent on the leading space
  while (rest.length) {
    out += CRLF + ' ' + rest.slice(0, continuationTake);
    rest = rest.slice(continuationTake);
  }
  return out;
}

/** Inverse of `foldLine` across a whole document: a line starting with
 *  a space or tab is a continuation of the previous logical line. */
export function unfoldLines(text) {
  const rawLines = String(text).replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  const out = [];
  for (const line of rawLines) {
    if ((line.startsWith(' ') || line.startsWith('\t')) && out.length) out[out.length - 1] += line.slice(1);
    else if (line.length) out.push(line);
  }
  return out;
}

// ---------- text escaping (RFC 5545 §3.3.11) ----------

export function escapeText(value) {
  return String(value ?? '').replace(/[\\;,\n]/g, (ch) => (ch === '\n' ? '\\n' : `\\${ch}`));
}

export function unescapeText(value) {
  return String(value ?? '').replace(/\\(.)/g, (_, ch) => {
    if (ch === 'n' || ch === 'N') return '\n';
    return ch;
  });
}

// ---------- date/time values ----------

function pad2(n) { return String(n).padStart(2, '0'); }

export function formatICSDateOnly(date) {
  return `${date.getFullYear()}${pad2(date.getMonth() + 1)}${pad2(date.getDate())}`;
}

export function formatICSDateTimeFloating(date) {
  return `${formatICSDateOnly(date)}T${pad2(date.getHours())}${pad2(date.getMinutes())}${pad2(date.getSeconds())}`;
}

export function formatICSDateTimeUTC(date) {
  return `${date.getUTCFullYear()}${pad2(date.getUTCMonth() + 1)}${pad2(date.getUTCDate())}`
    + `T${pad2(date.getUTCHours())}${pad2(date.getUTCMinutes())}${pad2(date.getUTCSeconds())}Z`;
}

/** Parse a DTSTART/DTEND value into `{ date, allDay }`. `allDay` when
 *  `VALUE=DATE` or the value has no time part. A trailing `Z` is UTC
 *  (converted to local); a `TZID` param or a bare floating value is
 *  treated as local wall-clock time (see the module doc comment). */
export function parseICSDateValue(value, params = {}) {
  const raw = String(value).trim();
  if (params.VALUE === 'DATE' || /^\d{8}$/.test(raw)) {
    const y = Number(raw.slice(0, 4)), m = Number(raw.slice(4, 6)), d = Number(raw.slice(6, 8));
    if (!y || !m || !d) return null;
    return { date: new Date(y, m - 1, d), allDay: true };
  }
  const m = raw.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z)?$/);
  if (!m) return null;
  const [, y, mo, d, hh, mi, ss, z] = m;
  if (z) return { date: new Date(Date.UTC(+y, +mo - 1, +d, +hh, +mi, +ss)), allDay: false };
  return { date: new Date(+y, +mo - 1, +d, +hh, +mi, +ss), allDay: false };
}

// ---------- RRULE (a small subset) ----------

function parseRRule(value) {
  const out = {};
  for (const part of String(value).split(';')) {
    const eq = part.indexOf('=');
    if (eq === -1) continue;
    out[part.slice(0, eq).toUpperCase()] = part.slice(eq + 1);
  }
  return {
    freq: out.FREQ ?? null,
    interval: out.INTERVAL ? Number(out.INTERVAL) : 1,
    count: out.COUNT ? Number(out.COUNT) : null,
    until: out.UNTIL || null,
  };
}

const SIMPLE_FREQ = { daily: 'DAILY', weekly: 'WEEKLY', monthly: 'MONTHLY' };

/** RRULE object (or null, for "does not repeat") → the model's
 *  `recurrence` + an optional explanatory note when it can't be
 *  represented exactly. */
export function mapRRuleToRecurrence(rrule) {
  if (!rrule || !rrule.freq) return { recurrence: 'none', recurrenceNote: null };
  const simple = { DAILY: 'daily', WEEKLY: 'weekly', MONTHLY: 'monthly' }[rrule.freq];
  const interval = rrule.interval ?? 1;
  if (simple && interval === 1 && !rrule.count && !rrule.until) {
    return { recurrence: simple, recurrenceNote: null };
  }
  const bits = [rrule.freq];
  if (interval !== 1) bits.push(`every ${interval}`);
  if (rrule.count) bits.push(`${rrule.count} times`);
  if (rrule.until) bits.push(`until ${rrule.until}`);
  return {
    recurrence: 'none',
    recurrenceNote: `Recurrence (${bits.join(', ')}) isn't supported — imported as a single occurrence.`,
  };
}

// ---------- VALARM TRIGGER ----------

const DURATION_RE = /^([+-]?)P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/i;

/** `TRIGGER` value/params → minutes before the event start, or `null`
 *  when it isn't a simple "before start" duration (an absolute
 *  DATE-TIME trigger, or one relative to the event end). */
function parseTriggerMinutes(value, params = {}) {
  if (params.VALUE === 'DATE-TIME') return null;
  if ((params.RELATED || 'START').toUpperCase() === 'END') return null;
  const m = String(value).trim().match(DURATION_RE);
  if (!m) return null;
  if (m[2] === undefined && m[3] === undefined && m[4] === undefined && m[5] === undefined) return null;
  // RFC 5545 §3.3.6: no sign or a leading "+" both mean positive
  // (after start); only an explicit "-" means before start, which is
  // the only direction a reminder offset can represent.
  const sign = m[1] === '-' ? -1 : 1;
  const days = Number(m[2] || 0), hours = Number(m[3] || 0), mins = Number(m[4] || 0), secs = Number(m[5] || 0);
  const totalMinutes = days * 1440 + hours * 60 + mins + Math.round(secs / 60);
  const signed = sign * totalMinutes;
  return signed > 0 ? null : -signed;
}

// ---------- line-level parsing ----------

function parseLine(line) {
  let i = 0;
  let inQuotes = false;
  while (i < line.length) {
    const ch = line[i];
    if (ch === '"') inQuotes = !inQuotes;
    else if (ch === ':' && !inQuotes) break;
    i++;
  }
  const head = line.slice(0, i);
  const value = line.slice(i + 1);
  const parts = head.split(';');
  const name = parts[0].toUpperCase();
  const params = {};
  for (const part of parts.slice(1)) {
    const eq = part.indexOf('=');
    if (eq === -1) continue;
    const key = part.slice(0, eq).toUpperCase();
    let val = part.slice(eq + 1);
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    params[key] = val;
  }
  return { name, params, value };
}

/** Parse an .ics document's VEVENTs. Never throws on a malformed
 *  component — a VEVENT missing DTSTART is skipped and reported in
 *  `errors` so one bad event doesn't fail the whole import. */
export function parseICS(text) {
  const lines = unfoldLines(text);
  const events = [];
  const errors = [];
  let cur = null;
  let inAlarm = false;
  let alarmTrigger;
  for (const raw of lines) {
    const { name, params, value } = parseLine(raw);
    if (name === 'BEGIN' && value === 'VEVENT') {
      cur = { uid: null, summary: '', location: '', description: '', dtstart: null, dtend: null, rrule: null, valarms: [] };
      continue;
    }
    if (name === 'END' && value === 'VEVENT') {
      if (cur) {
        if (!cur.dtstart) errors.push(`Skipped a VEVENT with no DTSTART${cur.uid ? ` (uid ${cur.uid})` : ''}.`);
        else events.push(cur);
      }
      cur = null;
      continue;
    }
    if (!cur) continue;
    if (name === 'BEGIN' && value === 'VALARM') { inAlarm = true; alarmTrigger = undefined; continue; }
    if (name === 'END' && value === 'VALARM') {
      if (alarmTrigger != null) cur.valarms.push({ offsetMinutes: alarmTrigger });
      inAlarm = false;
      continue;
    }
    if (inAlarm) {
      if (name === 'TRIGGER') alarmTrigger = parseTriggerMinutes(value, params);
      continue;
    }
    switch (name) {
      case 'UID': cur.uid = value.trim() || null; break;
      case 'SUMMARY': cur.summary = unescapeText(value); break;
      case 'LOCATION': cur.location = unescapeText(value); break;
      case 'DESCRIPTION': cur.description = unescapeText(value); break;
      case 'DTSTART': cur.dtstart = parseICSDateValue(value, params); break;
      case 'DTEND': cur.dtend = parseICSDateValue(value, params); break;
      case 'RRULE': cur.rrule = parseRRule(value); break;
      default: break;
    }
  }
  return { events, errors };
}

/** One parsed VEVENT → a draft compatible with `model.js#normalizeEvent`
 *  (plus `recurrenceNote`, which normalizeEvent ignores — it's for the
 *  import preview dialog only, never persisted). All-day DTEND is
 *  RFC 5545's *exclusive* "day after the last day"; the model stores
 *  an *inclusive* last day, so it's shifted back by one here — the
 *  same convention `model.js#occurrencesInRange` documents on the way
 *  back out. */
export function icsEventToModel(vevent) {
  const allDay = vevent.dtstart.allDay;
  const startDate = vevent.dtstart.date;
  let endDate = vevent.dtend ? vevent.dtend.date : (allDay ? startDate : new Date(startDate.getTime() + 3600000));
  if (allDay) {
    endDate = addDays(endDate, -1);
    if (endDate < startDate) endDate = startDate;
  } else if (endDate < startDate) {
    endDate = startDate;
  }
  const { recurrence, recurrenceNote } = mapRRuleToRecurrence(vevent.rrule);
  const reminders = vevent.valarms
    .filter((a) => a.offsetMinutes != null)
    .map((a) => ({ offsetMinutes: a.offsetMinutes, channels: ['panel'] }));
  return {
    title: vevent.summary || '',
    location: vevent.location || '',
    notes: vevent.description || '',
    allDay,
    start: toLocalISO(startDate, !allDay),
    end: toLocalISO(endDate, !allDay),
    recurrence,
    recurrenceNote,
    reminders,
    source: 'ics-import',
    icsUid: vevent.uid || null,
  };
}

// ---------- export ----------

function buildLine(name, params, value) {
  const paramStr = Object.entries(params || {}).filter(([, v]) => v != null && v !== '').map(([k, v]) => `${k}=${v}`).join(';');
  return foldLine(`${paramStr ? `${name};${paramStr}` : name}:${value}`);
}

function buildDtLines(name, date, allDay) {
  return allDay ? [buildLine(name, { VALUE: 'DATE' }, formatICSDateOnly(date))] : [buildLine(name, {}, formatICSDateTimeFloating(date))];
}

/** All events → an RFC 5545 document (CRLF line endings, folded). Each
 *  event's UID is its original `icsUid` when it has one (a
 *  previously-imported event keeps the external calendar's identity),
 *  otherwise its own `id`. */
export function serializeICS(events, options = {}) {
  const prodId = options.prodId || '-//tend.host//Calendar 1.2.0//EN';
  const now = options.now || new Date();
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', buildLine('PRODID', {}, prodId), 'CALSCALE:GREGORIAN'];
  for (const event of events) {
    const start = parseLocal(event.start);
    const end = parseLocal(event.end);
    if (!start || !end) continue;
    lines.push('BEGIN:VEVENT');
    lines.push(buildLine('UID', {}, event.icsUid || event.id));
    lines.push(buildLine('DTSTAMP', {}, formatICSDateTimeUTC(now)));
    lines.push(...buildDtLines('DTSTART', start, event.allDay));
    lines.push(...buildDtLines('DTEND', event.allDay ? addDays(end, 1) : end, event.allDay));
    if (event.title) lines.push(buildLine('SUMMARY', {}, escapeText(event.title)));
    if (event.location) lines.push(buildLine('LOCATION', {}, escapeText(event.location)));
    if (event.notes) lines.push(buildLine('DESCRIPTION', {}, escapeText(event.notes)));
    const freq = SIMPLE_FREQ[event.recurrence];
    if (freq) lines.push(buildLine('RRULE', {}, `FREQ=${freq}`));
    for (const reminder of event.reminders || []) {
      lines.push('BEGIN:VALARM');
      lines.push(buildLine('ACTION', {}, 'DISPLAY'));
      lines.push(buildLine('DESCRIPTION', {}, escapeText(event.title || 'Reminder')));
      lines.push(buildLine('TRIGGER', {}, `-PT${reminder.offsetMinutes}M`));
      lines.push('END:VALARM');
    }
    lines.push('END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return lines.join(CRLF) + CRLF;
}
