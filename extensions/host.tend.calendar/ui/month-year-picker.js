/* The dialog the header title opens: pick any month of any year in a
 * couple of clicks instead of clicking "next" forty times. */
import { el, createDialog } from './dom.js';
import { monthNames } from '../date-utils.js';

export function createMonthYearPicker({ locale, onPick }) {
  let year = new Date().getFullYear();
  let month = new Date().getMonth();
  let els = {};

  function buildBody() {
    const names = monthNames(locale, 'short');
    els.yearLabel = el('span', { class: 'cal-picker-year', text: String(year) });
    els.grid = el('div', { class: 'cal-picker-grid', attrs: { role: 'group', 'aria-label': 'Month' } });
    els.buttons = names.map((name, index) => el('button', {
      class: 'cal-picker-month',
      text: name,
      attrs: { type: 'button', 'aria-current': String(index === month) },
      on: { click: () => { onPick(year, index); dialog.close(); } },
    }));
    for (const b of els.buttons) els.grid.appendChild(b);
    const nav = el('div', { class: 'cal-picker-nav' }, [
      el('button', { class: 'cal-btn is-icon', text: '‹', attrs: { type: 'button', 'aria-label': 'Previous year' }, on: { click: () => shiftYear(-1) } }),
      els.yearLabel,
      el('button', { class: 'cal-btn is-icon', text: '›', attrs: { type: 'button', 'aria-label': 'Next year' }, on: { click: () => shiftYear(1) } }),
    ]);
    return el('div', {}, [el('h2', { class: 'cal-dialog-title', text: 'Jump to month' }), nav, els.grid]);
  }

  function shiftYear(delta) {
    year += delta;
    els.yearLabel.textContent = String(year);
  }

  const dialog = createDialog({ label: 'Jump to month', render: (panel) => panel.appendChild(buildBody()) });

  return {
    element: dialog.element,
    close: dialog.close,
    isOpen: dialog.isOpen,
    open(currentYear, currentMonth) {
      year = currentYear;
      month = currentMonth;
      dialog.open();
    },
  };
}
