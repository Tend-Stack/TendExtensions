/* Locale-aware date helpers. Everything here works in local wall-clock
 * time (no UTC conversion) — a calendar shows the day the user's clock
 * says it is, not the day UTC says it is. Dates are plain `Date`
 * objects; events persist their start/end as local ISO-ish strings
 * (see `toLocalISO` / `parseLocal`) so a stored event survives a
 * browser's timezone changing without silently shifting a day.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

export function getLocale() {
  try {
    return (typeof navigator !== 'undefined' && navigator.language) || 'en-US';
  } catch {
    return 'en-US';
  }
}

/** First day of the week as a JS `getDay()` index (0 = Sunday … 6 =
 *  Saturday). Prefers the platform's real locale data (Intl.Locale's
 *  `weekInfo`, shipped in modern Chromium/Firefox) and falls back to a
 *  short table of Sunday-start locales, then Monday (the ISO-8601 /
 *  most-of-the-world default) for everything else. */
export function localeWeekStart(locale) {
  try {
    const info = new Intl.Locale(locale).weekInfo || new Intl.Locale(locale).getWeekInfo?.();
    if (info && Number.isInteger(info.firstDay)) {
      // weekInfo.firstDay is ISO 1=Monday..7=Sunday; convert to getDay().
      return info.firstDay % 7;
    }
  } catch {
    /* Intl.Locale / weekInfo not available — fall through. */
  }
  const region = (locale || '').split('-')[1]?.toUpperCase();
  const sundayFirst = new Set(['US', 'CA', 'MX', 'JP', 'KR', 'BR', 'PH', 'IL', 'AU']);
  return region && sundayFirst.has(region) ? 0 : 1;
}

/** Whether the locale's default clock is 12-hour. */
export function localeIsHour12(locale) {
  try {
    const hourCycle = new Intl.DateTimeFormat(locale, { hour: 'numeric' }).resolvedOptions().hourCycle;
    return hourCycle === 'h11' || hourCycle === 'h12';
  } catch {
    return true;
  }
}

export function monthNames(locale, style = 'long') {
  const fmt = new Intl.DateTimeFormat(locale, { month: style, timeZone: 'UTC' });
  return Array.from({ length: 12 }, (_, i) => fmt.format(new Date(Date.UTC(2000, i, 1))));
}

/** Weekday names ordered starting at `weekStart` (0 = Sunday). */
export function weekdayNames(locale, weekStart, style = 'short') {
  const fmt = new Intl.DateTimeFormat(locale, { weekday: style, timeZone: 'UTC' });
  // 2000-01-02 was a Sunday.
  return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(Date.UTC(2000, 0, 2 + ((weekStart + i) % 7)))));
}

export function formatMonthYear(date, locale) {
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(date);
}

export function formatFullDate(date, locale) {
  return new Intl.DateTimeFormat(locale, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(date);
}

/** Shorter than `formatFullDate` — used for the Day view's header
 *  title, which shares a row with the nav buttons and the view
 *  switcher and shouldn't force it to wrap at the tool window's
 *  default width. */
export function formatDayTitle(date, locale) {
  return new Intl.DateTimeFormat(locale, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }).format(date);
}

/** "Sep 21 – 27, 2026" / "Aug 31 – Sep 6, 2026" — prefers the
 *  platform's locale-aware range formatter and falls back to a manual
 *  join for engines that lack it. */
export function formatWeekRange(start, end, locale) {
  const opts = { month: 'short', day: 'numeric', year: 'numeric' };
  try {
    const fmt = new Intl.DateTimeFormat(locale, opts);
    if (typeof fmt.formatRange === 'function') return fmt.formatRange(start, end);
  } catch {
    /* fall through */
  }
  const fmt = new Intl.DateTimeFormat(locale, opts);
  return `${fmt.format(start)} – ${fmt.format(end)}`;
}

export function formatDayHeading(date, locale) {
  return new Intl.DateTimeFormat(locale, { weekday: 'short', month: 'short', day: 'numeric' }).format(date);
}

export function formatTime(date, locale, hour12) {
  return new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit', hour12 }).format(date);
}

export function formatHourLabel(hour, locale, hour12) {
  const d = new Date(2000, 0, 1, hour, 0);
  return new Intl.DateTimeFormat(locale, { hour: 'numeric', hour12 }).format(d);
}

export function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

export function addMonths(date, n) {
  const d = new Date(date.getFullYear(), date.getMonth() + n, 1);
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(date.getDate(), lastDay));
  return d;
}

export function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function startOfWeek(date, weekStart) {
  const d = startOfDay(date);
  const diff = (d.getDay() - weekStart + 7) % 7;
  return addDays(d, -diff);
}

/** The 6x7 (or 5x7) grid of days a month view shows, including the
 *  leading/trailing days from adjacent months. */
export function monthGridDays(monthDate, weekStart) {
  const first = startOfMonth(monthDate);
  const gridStart = startOfWeek(first, weekStart);
  const next = addMonths(first, 1);
  const lastOfMonth = addDays(next, -1);
  const lastDiff = (weekStart + 6 - lastOfMonth.getDay() + 7) % 7;
  const gridEnd = addDays(lastOfMonth, lastDiff);
  const days = [];
  for (let d = gridStart; d <= gridEnd; d = addDays(d, 1)) days.push(d);
  return days;
}

/** ISO-8601 week number (always Monday-anchored, independent of the
 *  user's chosen week start — that's what "week number" conventionally
 *  means even to Sunday-start calendars). */
export function isoWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / DAY_MS + 1) / 7);
}

/** Local wall-clock ISO-ish string, sortable and timezone-stable:
 *  "2026-09-22" for a date-only value, "2026-09-22T14:30" for a
 *  date+time value. */
export function toLocalISO(date, withTime = true) {
  const pad = (n) => String(n).padStart(2, '0');
  const base = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  if (!withTime) return base;
  return `${base}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** Inverse of `toLocalISO` — always returns a local `Date`. */
export function parseLocal(value) {
  if (!value) return null;
  const [datePart, timePart] = String(value).split('T');
  const [y, m, d] = datePart.split('-').map(Number);
  if (!y || !m || !d) return null;
  if (!timePart) return new Date(y, m - 1, d);
  const [hh, mm] = timePart.split(':').map(Number);
  return new Date(y, m - 1, d, hh || 0, mm || 0);
}

export function minutesBetween(a, b) {
  return Math.round((b - a) / 60000);
}

/** The next whole-hour boundary strictly after `now` (1.4.0): 14:23 ->
 *  15:00, and 14:00:00.000 exactly -> 15:00 too, since it's the *next*
 *  hour, not the current one. Used to seed a new event's default start
 *  time so a freshly created event is timed, not all-day, by default. */
export function nextFullHour(now = new Date()) {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0, 0, 0);
}

/** 1.4.0's "new events are timed by default" rule as a pure function:
 *  a month-cell or "+ New event" click on `day` seeds the next full
 *  hour from `now` if `day` is today, or 09:00 otherwise, with a
 *  one-hour duration. Kept DOM-free (index.js is not) so it's directly
 *  unit-tested. */
export function defaultTimedSeedForDay(day, now = new Date()) {
  const start = isSameDay(day, now) ? nextFullHour(now) : new Date(day.getFullYear(), day.getMonth(), day.getDate(), 9, 0);
  return { start, end: new Date(start.getTime() + 60 * 60000), allDay: false };
}

/** Whether the editor's Start/End time inputs should be enabled — the
 *  1.4.0 rule that "All day" disables and dims them rather than hiding
 *  them, expressed as a pure predicate so the rule itself (not just
 *  the DOM side effect) is unit-tested. */
export function timeFieldsEnabled(allDay) {
  return !allDay;
}
