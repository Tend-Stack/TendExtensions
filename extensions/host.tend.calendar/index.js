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
import { createImportPreview } from './ui/import-preview.js';
import { createMonthView } from './views/month.js';
import { createWeekView } from './views/week.js';
import { createDayView } from './views/day.js';
import { createAgendaView } from './views/agenda.js';
import { EVENTS_KEY, normalizeEvent } from './model.js';
import { computeAllReminderRows, idsToCancel } from './reminders.js';
import { parseICS, serializeICS, icsEventToModel } from './ics.js';
import {
  addDays, formatDayTitle, formatFullDate, formatMonthYear, formatTime, formatWeekRange,
  getLocale, localeIsHour12, localeWeekStart, startOfDay, startOfWeek, toLocalISO,
} from './date-utils.js';

const PREFS_KEY = 'prefs.v1';
const REMINDER_REFRESH_MS = 60 * 60 * 1000; // hourly, while the window is open
const REMINDER_BATCH_SIZE = 200; // host.reminders.schedule's own per-call cap

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
  let importPreview = null;
  let keydownHandler = null;
  let reminderRefreshTimer = null;

  // `host.reminders` is a newer host API (see the package's reminders
  // permission); an older panel simply won't have it. Every call below
  // is wrapped so a missing or throwing host.reminders degrades to "no
  // reminders", never a broken calendar.
  const remindersSupported = !!(
    host.reminders
    && typeof host.reminders.schedule === 'function'
    && typeof host.reminders.cancel === 'function'
    && typeof host.reminders.list === 'function'
    && typeof host.reminders.capabilities === 'function'
  );
  let reminderCapabilities = { panel: true, email: false, sound: false };

  async function loadReminderCapabilities() {
    if (!remindersSupported) return reminderCapabilities;
    try { reminderCapabilities = await host.reminders.capabilities(); } catch { /* keep the safe default */ }
    return reminderCapabilities;
  }

  /** `#/shell/ext%3A<id>` — the shell-app hash form the panel's router
   *  (frontend/src/lib/router.svelte.ts) resolves to an extension
   *  window, built from `extEntryId()`'s `ext:<id>` scheme
   *  (frontend/src/lib/shell/extensions-store.svelte.ts). Read from
   *  `host.id` rather than hard-coding the manifest id so this keeps
   *  working if the extension is ever renamed. */
  function extensionUrl() {
    return `#/shell/${encodeURIComponent(`ext:${host.id}`)}`;
  }

  function reminderPayload(row) {
    const { event, occurrenceStart } = row;
    const whenText = event.allDay
      ? formatFullDate(occurrenceStart, locale)
      : `${formatFullDate(occurrenceStart, locale)} · ${formatTime(occurrenceStart, locale, getPrefs().hour12)}`;
    return {
      id: row.id,
      at: row.at.toISOString(),
      title: event.title || 'Untitled event',
      body: event.location ? `${whenText} · ${event.location}` : whenText,
      channels: row.channels,
      url: extensionUrl(),
    };
  }

  async function scheduleRows(rows) {
    if (!remindersSupported || !rows.length) return;
    const items = rows.map(reminderPayload);
    for (let i = 0; i < items.length; i += REMINDER_BATCH_SIZE) {
      try { await host.reminders.schedule(items.slice(i, i + REMINDER_BATCH_SIZE)); } catch { /* best effort */ }
    }
  }

  async function cancelIds(ids) {
    if (!remindersSupported || !ids.length) return;
    try { await host.reminders.cancel(ids); } catch { /* best effort */ }
  }

  /** Diff `prevRows` (the schedule computed just before an edit,
   *  delete, or import) against the schedule the current `events`
   *  produce now: cancel whatever fell out, (re)schedule the rest.
   *  Called after every write so a removed reminder — or a whole
   *  deleted event — stops firing. */
  async function reconcileReminders(prevRows) {
    if (!remindersSupported) return;
    const nextRows = computeAllReminderRows(events);
    await cancelIds(idsToCancel(prevRows.map((r) => r.id), nextRows.map((r) => r.id)));
    await scheduleRows(nextRows);
  }

  /** Startup / hourly reconcile: compare the host's own `list()` (the
   *  ground truth of what's actually scheduled, including anything
   *  orphaned by a change made while the window was closed) against
   *  what the current events say should exist. */
  async function reconcileWithHost() {
    if (!remindersSupported) return;
    const nextRows = computeAllReminderRows(events);
    const nextIds = new Set(nextRows.map((r) => r.id));
    let hostList = [];
    try { hostList = await host.reminders.list(); } catch { hostList = []; }
    const orphanIds = hostList.map((r) => r.id).filter((id) => !nextIds.has(id));
    await cancelIds(orphanIds);
    await scheduleRows(nextRows);
  }

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
    const prevRows = remindersSupported ? computeAllReminderRows(events) : [];
    const normalized = normalizeEvent(event);
    const idx = editingId ? events.findIndex((e) => e.id === editingId) : -1;
    if (idx >= 0) { normalized.id = editingId; events[idx] = normalized; }
    else events.push(normalized);
    persistEvents();
    renderActive();
    void reconcileReminders(prevRows);
  }

  function deleteEvent(id) {
    const prevRows = remindersSupported ? computeAllReminderRows(events) : [];
    events = events.filter((e) => e.id !== id);
    persistEvents();
    renderActive();
    void reconcileReminders(prevRows);
  }

  /** All events, as an RFC 5545 document, downloaded via a Blob link —
   *  no network involved. */
  function exportICS() {
    const text = serializeICS(events, { now: new Date() });
    const blob = new Blob([text], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = el('a', { attrs: { href: url, download: 'calendar.ics' } });
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  /** Parse the chosen .ics file and open the confirm dialog — nothing
   *  is written to storage (or scheduled) until the user confirms. */
  async function importICSFile(file) {
    const text = await file.text();
    const { events: vevents, errors } = parseICS(text);
    const drafts = vevents.map(icsEventToModel);
    const newCount = drafts.filter((d) => !events.some((e) => e.icsUid && e.icsUid === d.icsUid)).length;
    const updateCount = drafts.length - newCount;
    const notes = [
      ...drafts.filter((d) => d.recurrenceNote).map((d) => `${d.title || 'Untitled event'}: ${d.recurrenceNote}`),
      ...errors,
    ];
    importPreview.open({ total: drafts.length, newCount, updateCount, notes, drafts });
  }

  /** Merge confirmed import drafts into `events`: an existing event
   *  whose `icsUid` matches is updated in place (keeps its internal
   *  `id`, so any reminders already scheduled against it are replaced
   *  rather than duplicated); everything else is added new. */
  function applyImport({ drafts }) {
    if (!drafts.length) return;
    const prevRows = remindersSupported ? computeAllReminderRows(events) : [];
    for (const draft of drafts) {
      const existingIdx = draft.icsUid ? events.findIndex((e) => e.icsUid === draft.icsUid) : -1;
      const normalized = normalizeEvent(draft);
      if (existingIdx >= 0) { normalized.id = events[existingIdx].id; events[existingIdx] = normalized; }
      else events.push(normalized);
    }
    persistEvents();
    renderActive();
    void reconcileReminders(prevRows);
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
    if (editor.isOpen() || picker.isOpen() || settings.isOpen() || importPreview.isOpen()) return;
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

      await loadReminderCapabilities();

      editor = createEventEditor({
        onSave: upsertEvent,
        onDelete: deleteEvent,
        remindersSupported,
        getReminderCapabilities: () => reminderCapabilities,
      });
      picker = createMonthYearPicker({
        locale,
        onPick: (year, month) => { currentDate = new Date(year, month, 1); renderActive(); },
      });
      settings = createSettingsSheet({
        getPrefs: getRawPrefs,
        onChange: (patch) => { prefs = { ...prefs, ...patch }; persistPrefs(); renderActive(); },
        onExportICS: exportICS,
        onImportFile: importICSFile,
      });
      importPreview = createImportPreview({ onConfirm: applyImport });
      root.append(editor.element, picker.element, settings.element, importPreview.element);

      switchView(getPrefs().defaultView, { focus: false });

      // Reminders opened before the window closed may be stale (an
      // event edited elsewhere, a series that's rolled into a new
      // occurrence window) — reconcile once now, then hourly while the
      // window stays open, per the package brief.
      void reconcileWithHost();
      reminderRefreshTimer = setInterval(() => { void reconcileWithHost(); }, REMINDER_REFRESH_MS);

      keydownHandler = onKeydown;
      window.addEventListener('keydown', keydownHandler);
    },
    unmount() {
      if (keydownHandler) { window.removeEventListener('keydown', keydownHandler); keydownHandler = null; }
      if (reminderRefreshTimer !== null) { clearInterval(reminderRefreshTimer); reminderRefreshTimer = null; }
      for (const view of Object.values(views)) view.destroy?.();
      store.flushNow();
    },
  };
}
