/* Month view: a 7-column grid, today highlighted, adjacent-month days
 * dimmed, up to 3 event chips per day plus a "+N more" overflow. */
import { el, clear } from '../ui/dom.js';
import { addMonths, formatTime, isSameDay, isoWeekNumber, monthGridDays, startOfDay, weekdayNames } from '../date-utils.js';
import { COLORS, expandRange } from '../model.js';

const MAX_CHIPS = 3;

export function createMonthView(ctx) {
  const element = el('div', { class: 'cal-view cal-month' });
  const weekdayRow = el('div', { class: 'cal-weekday-row' });
  const grid = el('div', { class: 'cal-month-grid' });
  element.append(weekdayRow, grid);

  let anchor = new Date();
  const cells = [];

  grid.addEventListener('keydown', (event) => {
    const columns = 7;
    const deltas = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: columns, ArrowUp: -columns };
    const delta = deltas[event.key];
    if (delta === undefined) return;
    const index = cells.indexOf(document.activeElement);
    if (index < 0) return;
    const next = index + delta;
    if (next < 0 || next >= cells.length) return;
    event.preventDefault();
    cells[next].focus();
  });

  function colorHex(id) {
    return COLORS.find((c) => c.id === id)?.hex ?? COLORS[0].hex;
  }

  function render(date) {
    anchor = date;
    const prefs = ctx.getPrefs();
    const today = startOfDay(new Date());
    const days = monthGridDays(anchor, prefs.weekStart);
    const monthIndex = anchor.getMonth();

    const hasWeeknum = prefs.showWeekNumbers;
    weekdayRow.className = `cal-weekday-row${hasWeeknum ? ' has-weeknum' : ''}`;
    clear(weekdayRow);
    if (hasWeeknum) weekdayRow.appendChild(el('span'));
    for (const name of weekdayNames(ctx.locale, prefs.weekStart)) {
      weekdayRow.appendChild(el('div', { class: 'cal-weekday-cell', text: name }));
    }

    clear(grid);
    cells.length = 0;
    const rangeStart = days[0];
    const rangeEnd = new Date(days[days.length - 1].getFullYear(), days[days.length - 1].getMonth(), days[days.length - 1].getDate() + 1);
    const occurrences = expandRange(ctx.getEvents(), rangeStart, rangeEnd);

    for (let row = 0; row < days.length; row += 7) {
      const rowEl = el('div', { class: `cal-month-row${hasWeeknum ? ' has-weeknum' : ''}` });
      if (hasWeeknum) rowEl.appendChild(el('div', { class: 'cal-weeknum', text: String(isoWeekNumber(days[row])) }));
      for (let i = row; i < row + 7; i++) {
        const day = days[i];
        rowEl.appendChild(buildDayCell(day, monthIndex, today, occurrences, prefs));
      }
      grid.appendChild(rowEl);
    }
  }

  function buildDayCell(day, monthIndex, today, occurrences, prefs) {
    const isOutside = day.getMonth() !== monthIndex;
    const isToday = isSameDay(day, today);
    const dayEvents = occurrences.filter((occ) => occ.start < dayEnd(day) && occ.end > startOfDay(day));

    const chips = el('div', { class: 'cal-day-chips' });
    for (const occ of dayEvents.slice(0, MAX_CHIPS)) {
      chips.appendChild(el('button', {
        class: 'cal-chip',
        style: { '--chip-color': colorHex(occ.event.color) },
        attrs: { type: 'button', title: occ.event.title },
        on: { click: (e) => { e.stopPropagation(); ctx.onEdit(occ.event); } },
      }, [
        el('span', { class: 'cal-chip-dot' }),
        occ.event.allDay ? null : el('span', { class: 'cal-chip-time', text: formatTime(occ.start, ctx.locale, prefs.hour12) }),
        el('span', { class: 'cal-chip-title', text: occ.event.title || '(No title)' }),
      ]));
    }
    if (dayEvents.length > MAX_CHIPS) {
      chips.appendChild(el('button', {
        class: 'cal-more-btn',
        text: `+${dayEvents.length - MAX_CHIPS} more`,
        attrs: { type: 'button' },
        on: { click: (e) => { e.stopPropagation(); ctx.onOpenDay(day); } },
      }));
    }

    const cell = el('div', {
      class: `cal-day-cell${isOutside ? ' is-outside' : ''}${isToday ? ' is-today' : ''}`,
      attrs: {
        role: 'gridcell', tabindex: '0',
        'aria-label': day.toDateString() + (isToday ? ', today' : ''),
      },
      on: {
        click: () => ctx.onCreate({ date: day, allDay: true }),
        keydown: (event) => {
          if (event.key === 'Enter') { event.preventDefault(); ctx.onOpenDay(day); }
        },
      },
    }, [
      el('span', { class: 'cal-day-num', text: String(day.getDate()) }),
      chips,
    ]);
    cells.push(cell);
    return cell;
  }

  function dayEnd(day) {
    return new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1);
  }

  return {
    element,
    render,
    focus() {
      const todayCell = cells.find((c) => c.classList.contains('is-today'));
      (todayCell ?? cells[0])?.focus();
    },
    next: () => addMonths(anchor, 1),
    prev: () => addMonths(anchor, -1),
    destroy() {},
  };
}
