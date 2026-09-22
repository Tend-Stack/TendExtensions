/* Preferences, a placeholder Integrations section, and (1.2.0) the
 * working Import & export controls. Google Calendar and iCal
 * subscriptions stay "coming soon" placeholders — no network, no live
 * wiring — while .ics import/export works today entirely offline;
 * they're kept in separate sections so the two aren't mistaken for the
 * same feature. */
import { el, createDialog } from './dom.js';

const VIEW_OPTIONS = [
  { value: 'month', label: 'Month' },
  { value: 'week', label: 'Week' },
  { value: 'day', label: 'Day' },
  { value: 'agenda', label: 'Agenda' },
];
const WEEK_START_OPTIONS = [
  { value: 'locale', label: 'From your locale' },
  { value: '1', label: 'Monday' },
  { value: '0', label: 'Sunday' },
];
const CLOCK_OPTIONS = [
  { value: 'locale', label: 'From your locale' },
  { value: '12', label: '12-hour' },
  { value: '24', label: '24-hour' },
];
const INTEGRATIONS = [
  { name: 'Google Calendar', reason: 'coming soon' },
  { name: 'iCal subscriptions', reason: 'coming soon' },
  { name: 'Panel events', reason: 'coming soon' },
];

function optionList(options, value) {
  return options.map((opt) => el('option', { text: opt.label, attrs: { value: opt.value, selected: opt.value === value || null } }));
}

export function createSettingsSheet({ getPrefs, onChange, onExportICS, onImportFile }) {
  let els = {};

  function buildBody() {
    const prefs = getPrefs();
    els.defaultView = el('select', { class: 'cal-select', attrs: { 'aria-label': 'Default view' } }, optionList(VIEW_OPTIONS, prefs.defaultView));
    els.weekStart = el('select', { class: 'cal-select', attrs: { 'aria-label': 'Week starts on' } }, optionList(WEEK_START_OPTIONS, prefs.weekStart));
    els.clock = el('select', { class: 'cal-select', attrs: { 'aria-label': 'Clock' } }, optionList(CLOCK_OPTIONS, prefs.clock));
    els.weekNumbers = el('input', { attrs: { type: 'checkbox' } });
    els.weekNumbers.checked = !!prefs.showWeekNumbers;

    for (const [select, key] of [[els.defaultView, 'defaultView'], [els.weekStart, 'weekStart'], [els.clock, 'clock']]) {
      select.addEventListener('change', () => onChange({ [key]: select.value }));
    }
    els.weekNumbers.addEventListener('change', () => onChange({ showWeekNumbers: els.weekNumbers.checked }));

    els.exportBtn = el('button', {
      class: 'cal-btn',
      text: 'Export calendar (.ics)',
      attrs: { type: 'button' },
      on: { click: () => onExportICS?.() },
    });
    els.importInput = el('input', {
      attrs: { type: 'file', accept: '.ics,text/calendar' },
      style: { display: 'none' },
    });
    els.importBtn = el('button', {
      class: 'cal-btn',
      text: 'Import calendar (.ics)',
      attrs: { type: 'button' },
      on: { click: () => els.importInput.click() },
    });
    els.importInput.addEventListener('change', () => {
      const file = els.importInput.files?.[0];
      els.importInput.value = '';
      if (file) onImportFile?.(file);
    });

    return el('div', {}, [
      el('h2', { class: 'cal-dialog-title', text: 'Settings' }),
      el('div', { class: 'cal-settings-section' }, [
        el('h3', { text: 'Preferences' }),
        field('Default view', els.defaultView),
        field('Week starts on', els.weekStart),
        field('Clock', els.clock),
        el('label', { class: 'cal-check-row' }, [els.weekNumbers, 'Show week numbers']),
      ]),
      el('div', { class: 'cal-settings-section' }, [
        el('h3', { text: 'Integrations' }),
        el('div', { class: 'cal-integration-list' }, INTEGRATIONS.map((item) => el('div', { class: 'cal-integration-item' }, [
          el('span', { class: 'cal-integration-name', text: item.name }),
          el('span', { class: 'cal-integration-reason', text: item.reason }),
        ]))),
      ]),
      el('div', { class: 'cal-settings-section' }, [
        el('h3', { text: 'Import & export' }),
        el('div', { class: 'cal-settings-hint', text: 'Works offline, right now — a one-time .ics file, not a live subscription.' }),
        el('div', { class: 'cal-settings-actions' }, [els.exportBtn, els.importBtn, els.importInput]),
      ]),
      el('div', { class: 'cal-dialog-actions' }, [
        el('button', { class: 'cal-btn is-accent', text: 'Done', attrs: { type: 'button' }, on: { click: () => dialog.close() } }),
      ]),
    ]);
  }

  function field(label, control) {
    return el('label', { class: 'cal-field' }, [el('span', { class: 'cal-field-label', text: label }), control]);
  }

  const dialog = createDialog({ label: 'Calendar settings', render: (panel) => panel.appendChild(buildBody()) });

  return { element: dialog.element, close: dialog.close, isOpen: dialog.isOpen, open: () => dialog.open() };
}
