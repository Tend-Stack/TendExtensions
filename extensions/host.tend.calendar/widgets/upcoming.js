/* Upcoming — the calendar's first shelf widget.
 *
 * Same `activate(host)` contract as the main window (index.js), just
 * mounted into a fixed-size shelf card instead of the tool window.
 * `host` is the extension's normal host — same permission checks, same
 * storage namespace — plus `host.widget = { id, size, preview }`.
 *
 * Reuses the main window's own modules rather than re-implementing any
 * of it:
 *   - model.js    EVENTS_KEY (the exact storage key index.js writes),
 *                 COLORS, expandRange/occurrencesInRange (recurrence
 *                 expansion) and normalizeEvent (used only to build the
 *                 preview's sample data through the same defaulting
 *                 logic real events get).
 *   - date-utils.js locale-aware day/time formatting.
 *   - ui/dom.js   the `el()` element helper.
 *
 * Layout:
 *   small — today's weekday + day number, and the next 3 events.
 *   wide  — a 7-day strip (today highlighted, a dot on days that have
 *           at least one event) on the left, the next 5 events on the
 *           right.
 *
 * The card is read-only: nothing here is clickable (widgets have no
 * navigation API yet), so there are no touch targets to size — the
 * 44px rule the main window's ui/styles.js applies to its buttons
 * doesn't apply to a card with no controls.
 *
 * Refresh: once on mount, then every 60s and whenever the tab regains
 * visibility, so a card left open overnight still says "Today" the
 * next morning. In preview mode (`host.widget.preview`) neither timer
 * runs and storage is never touched — a fixed set of sample events is
 * shown instead, built through the same `normalizeEvent` real events
 * go through.
 */
import { el } from '../ui/dom.js';
import { COLORS, EVENTS_KEY, expandRange, normalizeEvent } from '../model.js';
import {
  addDays, formatTime, getLocale, localeIsHour12, startOfDay, toLocalISO,
} from '../date-utils.js';

const STYLE_ID = 'tend-ext-calendar-widget-styles';
const REFRESH_MS = 60_000;
const LOOKAHEAD_DAYS = 60;

const CSS = `
.cal-widget-root {
  --cw-fg: var(--color-base-content, #e6eef7);
  --cw-accent: var(--color-primary, #38bdf8);
  --cw-accent-fg: var(--color-primary-content, #04111a);
  --cw-muted: color-mix(in oklab, var(--cw-fg) 58%, transparent);
  --cw-line: color-mix(in oklab, var(--cw-fg) 14%, transparent);
  height: 100%;
  min-height: 0;
  display: grid;
  align-items: center;
  color: var(--cw-fg);
  font-family: inherit;
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum" 1;
  overflow: hidden;
}
.cal-widget-root * { box-sizing: border-box; min-width: 0; }
.cal-widget-root.is-small { grid-template-columns: auto 1fr; gap: 12px; }
.cal-widget-root.is-wide { grid-template-columns: 46px 1fr; gap: 14px; }

.cal-widget-today { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px; }
.cal-widget-weekday { font-size: 10px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; color: var(--cw-muted); }
.cal-widget-daynum { font-size: 27px; font-weight: 700; line-height: 1; }

.cal-widget-list { display: flex; flex-direction: column; gap: 6px; min-height: 0; overflow: hidden; }
.cal-widget-row { display: flex; align-items: baseline; gap: 6px; min-width: 0; }
.cal-widget-dot { width: 7px; height: 7px; border-radius: 999px; flex: 0 0 auto; align-self: center; background: var(--row-color, var(--cw-accent)); }
.cal-widget-time { flex: 0 0 auto; font-size: 10.5px; color: var(--cw-muted); white-space: nowrap; }
.cal-widget-title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; font-weight: 600; }

.cal-widget-strip { height: 100%; display: flex; flex-direction: column; justify-content: space-between; padding: 2px 0; }
.cal-widget-strip-day { display: flex; align-items: center; gap: 5px; line-height: 1; }
.cal-widget-strip-num {
  width: 16px; height: 16px; border-radius: 999px; flex: 0 0 auto;
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 9.5px; font-weight: 700; color: var(--cw-muted);
}
.cal-widget-strip-day.is-today .cal-widget-strip-num { background: var(--cw-accent); color: var(--cw-accent-fg); }
.cal-widget-strip-dow { font-size: 9px; text-transform: uppercase; letter-spacing: .02em; color: var(--cw-muted); }
.cal-widget-strip-day.is-today .cal-widget-strip-dow { color: var(--cw-fg); font-weight: 700; }
.cal-widget-strip-dot { width: 4px; height: 4px; border-radius: 999px; background: var(--cw-accent); flex: 0 0 auto; }

.cal-widget-empty { height: 100%; display: grid; align-content: center; justify-items: start; gap: 3px; }
.cal-widget-empty-title { font-size: 13px; font-weight: 600; }
.cal-widget-empty-hint { font-size: 11px; color: var(--cw-muted); }

@media (prefers-reduced-motion: reduce) {
  .cal-widget-root *, .cal-widget-root *::before, .cal-widget-root *::after {
    transition-duration: 1ms !important;
    animation-duration: 1ms !important;
  }
}
`;

function ensureWidgetStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = CSS;
  document.head.appendChild(style);
}

function colorHex(id) {
  return COLORS.find((c) => c.id === id)?.hex ?? COLORS[0].hex;
}

/** `null` for today, `'Tomorrow'`, or a short weekday name — used to
 *  tag a row when an upcoming event isn't today, since the list can
 *  span many days. */
function dayTag(date, now, locale) {
  const diffDays = Math.round((startOfDay(date) - startOfDay(now)) / 86_400_000);
  if (diffDays === 0) return null;
  if (diffDays === 1) return 'Tomorrow';
  return new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date);
}

function rowLabel(occurrence, now, locale, hour12) {
  const tag = dayTag(occurrence.start, now, locale);
  const time = occurrence.event.allDay ? 'All day' : formatTime(occurrence.start, locale, hour12);
  return tag ? `${tag} · ${time}` : time;
}

/** The next `limit` occurrences from `now` onward (recurrence expanded
 *  via model.js), in plain chronological order — same-day all-day
 *  events sort before same-day timed ones because their local-midnight
 *  `start` naturally comes first. */
function upcomingOccurrences(events, now, limit) {
  const rangeStart = startOfDay(now);
  const rangeEnd = addDays(rangeStart, LOOKAHEAD_DAYS);
  return expandRange(events, rangeStart, rangeEnd)
    .filter((occurrence) => occurrence.end >= now)
    .sort((a, b) => a.start - b.start)
    .slice(0, limit);
}

/** Fixed, representative sample events for the widget gallery preview
 *  — built through the same `normalizeEvent` real events go through,
 *  anchored to today so the preview always looks current. Never reads
 *  or writes storage. */
function sampleEvents(now) {
  const at = (offsetDays, hour, minute) => new Date(
    now.getFullYear(), now.getMonth(), now.getDate() + offsetDays, hour, minute,
  );
  const timed = (offsetDays, hour, minute, title, color, durationMin = 60) => {
    const start = at(offsetDays, hour, minute);
    const end = new Date(start.getTime() + durationMin * 60_000);
    return normalizeEvent({
      title, color, allDay: false, start: toLocalISO(start, true), end: toLocalISO(end, true),
    });
  };
  const allDay = (offsetDays, title, color) => {
    const day = toLocalISO(at(offsetDays, 0, 0), false);
    return normalizeEvent({ title, color, allDay: true, start: day, end: day });
  };
  return [
    timed(0, 14, 0, 'Team sync', 'sky'),
    allDay(0, 'Product launch', 'amber'),
    timed(1, 9, 0, 'Dentist appointment', 'rose'),
    timed(2, 18, 30, 'Dinner with Sam', 'violet'),
    allDay(4, 'Quarterly planning', 'green'),
  ];
}

function buildToday(now, locale) {
  const weekday = new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(now);
  return el('div', { class: 'cal-widget-today' }, [
    el('div', { class: 'cal-widget-weekday', text: weekday }),
    el('div', { class: 'cal-widget-daynum', text: String(now.getDate()) }),
  ]);
}

/** A vertical 7-day strip starting today, today highlighted, with a
 *  small dot under any day that has at least one occurrence in that
 *  window (recurrence-expanded, same helper the event list uses). */
function buildStrip(now, events, locale) {
  const start = startOfDay(now);
  const daysWithEvents = new Set(
    expandRange(events, start, addDays(start, 7)).map((o) => startOfDay(o.start).getTime()),
  );
  const strip = el('div', { class: 'cal-widget-strip' });
  for (let i = 0; i < 7; i++) {
    const day = addDays(start, i);
    const isToday = i === 0;
    strip.appendChild(el('div', { class: `cal-widget-strip-day${isToday ? ' is-today' : ''}` }, [
      el('span', { class: 'cal-widget-strip-num', text: String(day.getDate()) }),
      el('span', { class: 'cal-widget-strip-dow', text: new Intl.DateTimeFormat(locale, { weekday: 'narrow' }).format(day) }),
      daysWithEvents.has(day.getTime()) ? el('span', { class: 'cal-widget-strip-dot', attrs: { 'aria-hidden': 'true' } }) : null,
    ]));
  }
  return strip;
}

function buildEmpty() {
  return el('div', { class: 'cal-widget-empty' }, [
    el('div', { class: 'cal-widget-empty-title', text: 'No upcoming events' }),
    el('div', { class: 'cal-widget-empty-hint', text: 'Events you add in Calendar show up here.' }),
  ]);
}

function buildList(upcoming, now, locale, hour12) {
  if (!upcoming.length) return buildEmpty();
  const list = el('div', { class: 'cal-widget-list' });
  for (const occurrence of upcoming) {
    list.appendChild(el('div', {
      class: 'cal-widget-row',
      style: { '--row-color': colorHex(occurrence.event.color) },
    }, [
      el('span', { class: 'cal-widget-dot', attrs: { 'aria-hidden': 'true' } }),
      el('span', { class: 'cal-widget-time', text: rowLabel(occurrence, now, locale, hour12) }),
      el('span', { class: 'cal-widget-title', text: occurrence.event.title || 'Untitled event' }),
    ]));
  }
  return list;
}

export default function activate(host) {
  ensureWidgetStyles();
  const locale = getLocale();
  const preview = host.widget?.preview === true;
  const size = host.widget?.size === 'wide' ? 'wide' : 'small';

  let containerEl = null;
  let timer = null;
  let visibilityHandler = null;
  let destroyed = false;

  async function loadEvents() {
    if (preview) return sampleEvents(new Date());
    try {
      const raw = await host.storage.get(EVENTS_KEY);
      return (Array.isArray(raw) ? raw : []).map(normalizeEvent);
    } catch {
      return [];
    }
  }

  function render(events, now) {
    if (!containerEl) return;
    const hour12 = localeIsHour12(locale);
    const limit = size === 'wide' ? 5 : 3;
    const upcoming = upcomingOccurrences(events, now, limit);
    const root = el('div', { class: `cal-widget-root is-${size}` }, size === 'wide'
      ? [buildStrip(now, events, locale), buildList(upcoming, now, locale, hour12)]
      : [buildToday(now, locale), buildList(upcoming, now, locale, hour12)]);
    containerEl.replaceChildren(root);
  }

  async function refresh() {
    if (destroyed) return;
    const now = new Date();
    const events = await loadEvents();
    if (destroyed) return;
    render(events, now);
  }

  return {
    async mount(container) {
      containerEl = container;
      await refresh();
      if (!preview) {
        timer = setInterval(refresh, REFRESH_MS);
        visibilityHandler = () => { if (document.visibilityState === 'visible') refresh(); };
        document.addEventListener('visibilitychange', visibilityHandler);
      }
    },
    unmount() {
      destroyed = true;
      if (timer !== null) clearInterval(timer);
      if (visibilityHandler) document.removeEventListener('visibilitychange', visibilityHandler);
      containerEl?.replaceChildren();
      containerEl = null;
    },
  };
}
