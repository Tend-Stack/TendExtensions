/* Calendar — schema-2 extension, native ESM, no bundler.
 *
 * `activate(host)` installs the scoped stylesheet once and returns
 * `{ mount, unmount } `. `mount(container)` builds the header (Today,
 * prev/next, a clickable title, the view switcher, New event and
 * Settings) plus whichever view is active inside the tool window the
 * manifest asks for.
 *
 * Layout of the source:
 *   date-utils.js  locale-aware date maths and formatting (Intl only)
 *   model.js       the event shape, colours, recurrence expansion
 *   store.js       write-behind cache over host.storage
 *   ui/            dialog/focus-trap helper, the stylesheet, the
 *                  event editor, the month/year picker, the settings
 *                  sheet
 *   views/         one module per view (month, the shared time grid
 *                  behind week/day, agenda)
 *
 * Views are created lazily the first time they're selected.
 */
import { ensureStyles } from './ui/styles.js';
import { el } from './ui/dom.js';
import { createStore } from './store.js';
import { createEventEditor } from './ui/event-editor.js';
import { createMonthYearPicker } from './ui/month-year-picker.js';
import { createSettingsSheet } from './ui/settings-sheet.js';
import { createMonthView } from './views/month.js';
import { createWeekView } from './views/week.js';
import { createDayView } from './views/day.js';
import { createAgendaView } from './views/agenda.js';
import { normalizeEvent } from './model.js';
import {
  addDays, formatDayTitle, formatMonthYear, formatWeekRange,
  getLocale, localeIsHour12, localeWeekStart, startOfDay, startOfWeek, toLocalISO,
} from './date-utils.js';

const EVENTS_KEY = 'events.v1';
const PREFS_KEY = 'prefs.v1';

const VIEW_META = [
  { id: 'month', label: 'Month', key: '1', factory: createMonthView },
  { id: 'week', label: 'Week', key: '2', factory: createWeekView },
  { id: 'day', label: 'Day', key: '3', factory: createDayView },
  { id: 'agenda', label: 'Agenda', key: '4', factory: createAgendaView },
];

export default function activate(host) {
  ensureStyles();
  const locale = getLocale();
  const store = createStore(host);

  let prefs = {};
  let events = [];
  let currentDate = startOfDay(new Date());
  let viewId = 'month';
  const views = {};
  let activeView = null;

  let root = null;
  let bodyEl = null;
  let titleBtn = null;
  let switcher = null;
  let editor = null;
  let picker = null;
  let settings = null;
  let keydownHandler = null;

  function getPrefs() {
    const weekStartPref = prefs.weekStart ?? 'locale';
    const clockPref = prefs.clock ?? 'locale';
    return {
      weekStart: weekStartPref === 'locale' ? localeWeekStart(locale) : Number(weekStartPref),
      hour12: clockPref === 'locale' ? localeIsHour12(locale) : clockPref === '12',
      showWeekNumbers: !!prefs.showWeekNumbers,
      defaultView: VIEW_META.some((v) => v.id === prefs.defaultView) ? prefs.defaultView : 'month',
    };
  }

  function getRawPrefs() {
    return {
      defaultView: prefs.defaultView ?? 'month',
      weekStart: prefs.weekStart ?? 'locale',
      clock: prefs.clock ?? 'locale',
      showWeekNumbers: !!prefs.showWeekNumbers,
    };
  }

  function persistPrefs() { store.set(PREFS_KEY, prefs); }
  function persistEvents() { store.set(EVENTS_KEY, events); }

  function upsertEvent(event, editingId) {
    const normalized = normalizeEvent(event);
    const idx = editingId ? events.findIndex((e) => e.id === editingId) : -1;
    if (idx >= 0) { normalized.id = editingId; events[idx] = normalized; }
    else events.push(normalized);
    persistEvents();
    renderActive();
  }

  function deleteEvent(id) {
    events = events.filter((e) => e.id !== id);
    persistEvents();
    renderActive();
  }

  /** Views hand back what the user clicked/dragged as plain Dates;
   *  turn that into the local-ISO seed the editor's model expects. */
  function seedToDraft(seed) {
    if (seed.date) {
      const iso = toLocalISO(seed.date, false);
      return { start: iso, end: iso, allDay: true };
    }
    return {
      start: toLocalISO(seed.start, !seed.allDay),
      end: toLocalISO(seed.end, !seed.allDay),
      allDay: !!seed.allDay,
    };
  }

  const ctx = {
    locale,
    getPrefs,
    getEvents: () => events,
    onCreate: (seed) => editor.openForCreate(seedToDraft(seed)),
    onEdit: (event) => editor.openForEdit(event),
    onOpenDay(date) { currentDate = startOfDay(date); switchView('day'); },
  };

  function ensureView(id) {
    if (views[id]) return views[id];
    const meta = VIEW_META.find((v) => v.id === id);
    const view = meta.factory(ctx);
    views[id] = view;
    view.startClock?.();
    return view;
  }

  function switchView(id, options = {}) {
    viewId = id;
    const view = ensureView(id);
    if (activeView !== view) {
      bodyEl.replaceChildren(view.element);
      activeView = view;
    }
    switcher.select(id);
    renderActive();
    if (options.focus !== false) activeView.focus?.();
  }

  function renderActive() {
    activeView?.render(currentDate);
    updateTitle();
  }

  function updateTitle() {
    const resolved = getPrefs();
    if (viewId === 'month') titleBtn.textContent = formatMonthYear(currentDate, locale);
    else if (viewId === 'day') titleBtn.textContent = formatDayTitle(currentDate, locale);
    else if (viewId === 'week') {
      const start = startOfWeek(currentDate, resolved.weekStart);
      titleBtn.textContent = formatWeekRange(start, addDays(start, 6), locale);
    } else titleBtn.textContent = 'Agenda';
  }

  function goToday() {
    currentDate = startOfDay(new Date());
    renderActive();
    activeView?.focus?.();
  }
  function goPrev() { currentDate = activeView.prev(); renderActive(); }
  function goNext() { currentDate = activeView.next(); renderActive(); }

  function defaultCreateSeed() {
    if (viewId === 'week' || viewId === 'day') {
      const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 9, 0);
      return { start, end: new Date(start.getTime() + 60 * 60000), allDay: false };
    }
    return { date: currentDate };
  }

  function buildHeader() {
    const prevBtn = el('button', { class: 'cal-btn is-icon', text: '‹', attrs: { type: 'button', 'aria-label': 'Previous' }, on: { click: goPrev } });
    const nextBtn = el('button', { class: 'cal-btn is-icon', text: '›', attrs: { type: 'button', 'aria-label': 'Next' }, on: { click: goNext } });
    const todayBtn = el('button', { class: 'cal-btn', text: 'Today', attrs: { type: 'button', title: 'Jump to today (T)' }, on: { click: goToday } });
    titleBtn = el('button', { class: 'cal-title-btn', attrs: { type: 'button', 'aria-label': 'Jump to a month' }, on: { click: () => picker.open(currentDate.getFullYear(), currentDate.getMonth()) } });

    const segWrap = el('div', { class: 'cal-segmented', attrs: { role: 'tablist', 'aria-label': 'View' } });
    const segButtons = new Map();
    for (const meta of VIEW_META) {
      const btn = el('button', {
        class: 'cal-segment',
        text: meta.label,
        attrs: { type: 'button', role: 'tab', title: `${meta.label} (${meta.key})`, 'aria-selected': String(meta.id === viewId) },
        on: { click: () => switchView(meta.id) },
      });
      segButtons.set(meta.id, btn);
      segWrap.appendChild(btn);
    }
    switcher = { select: (id) => { for (const [key, btn] of segButtons) btn.setAttribute('aria-selected', String(key === id)); } };

    const newBtn = el('button', { class: 'cal-btn is-accent', text: '+ New event', attrs: { type: 'button', title: 'New event (N)' }, on: { click: () => ctx.onCreate(defaultCreateSeed()) } });
    const settingsBtn = el('button', { class: 'cal-btn is-icon', text: '⚙', attrs: { type: 'button', 'aria-label': 'Settings' }, on: { click: () => settings.open() } });

    return el('div', { class: 'cal-header' }, [
      el('div', { class: 'cal-nav-group' }, [todayBtn, prevBtn, nextBtn]),
      titleBtn,
      el('div', { class: 'cal-header-spacer' }),
      segWrap,
      newBtn,
      settingsBtn,
    ]);
  }

  function onKeydown(event) {
    if (!root || !root.isConnected) return;
    if (editor.isOpen() || picker.isOpen() || settings.isOpen()) return;
    const target = event.target;
    const typing = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement;
    if (typing) return;

    if (event.key === 't' || event.key === 'T') { event.preventDefault(); goToday(); return; }
    if (event.key === 'n' || event.key === 'N') { event.preventDefault(); ctx.onCreate(defaultCreateSeed()); return; }
    const meta = VIEW_META.find((v) => v.key === event.key);
    if (meta) { event.preventDefault(); switchView(meta.id); }
  }

  return {
    async mount(container) {
      const header = buildHeader();
      bodyEl = el('div', { class: 'cal-body' });
      root = el('div', {
        class: `cal-root ${host.theme?.isDark === false ? 'is-light' : 'is-dark'}`,
        attrs: { role: 'application', 'aria-label': 'Calendar' },
      }, [header, bodyEl]);
      container.replaceChildren(root);

      const [loadedPrefs, loadedEvents] = await Promise.all([
        store.load(PREFS_KEY, {}),
        store.load(EVENTS_KEY, []),
      ]);
      prefs = loadedPrefs && typeof loadedPrefs === 'object' ? loadedPrefs : {};
      events = (Array.isArray(loadedEvents) ? loadedEvents : []).map(normalizeEvent);

      editor = createEventEditor({ onSave: upsertEvent, onDelete: deleteEvent });
      picker = createMonthYearPicker({
        locale,
        onPick: (year, month) => { currentDate = new Date(year, month, 1); renderActive(); },
      });
      settings = createSettingsSheet({
        getPrefs: getRawPrefs,
        onChange: (patch) => { prefs = { ...prefs, ...patch }; persistPrefs(); renderActive(); },
      });
      root.append(editor.element, picker.element, settings.element);

      switchView(getPrefs().defaultView, { focus: false });

      keydownHandler = onKeydown;
      window.addEventListener('keydown', keydownHandler);
    },
    unmount() {
      if (keydownHandler) { window.removeEventListener('keydown', keydownHandler); keydownHandler = null; }
      for (const view of Object.values(views)) view.destroy?.();
      store.flushNow();
    },
  };
}
