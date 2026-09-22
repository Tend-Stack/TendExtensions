/* Preferences + a placeholder Integrations section. Nothing here talks
 * to a network — the placeholders are clearly labelled and inert; they
 * exist so the layout doesn't need to change when a real integration
 * lands (the event model already carries a `source` field for it). */
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

export function createSettingsSheet({ getPrefs, onChange }) {
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
      el('div', { class: 'cal-dialog-actions' }, [
        el('span'),
        el('div', { class: 'cal-dialog-actions-right' }, [
          el('button', { class: 'cal-btn is-accent', text: 'Done', attrs: { type: 'button' }, on: { click: () => dialog.close() } }),
        ]),
      ]),
    ]);
  }

  function field(label, control) {
    return el('label', { class: 'cal-field' }, [el('span', { class: 'cal-field-label', text: label }), control]);
  }

  const dialog = createDialog({ label: 'Calendar settings', render: (panel) => panel.appendChild(buildBody()) });

  return { element: dialog.element, close: dialog.close, isOpen: dialog.isOpen, open: () => dialog.open() };
}
