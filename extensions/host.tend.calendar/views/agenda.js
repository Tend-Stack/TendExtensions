/* Agenda: a scrolling list of upcoming events grouped by day, starting
 * from the anchor date. Today/prev/next shift the window by a week,
 * same as the other views, so the header's navigation stays
 * predictable no matter which view is active. */
import { el, clear } from '../ui/dom.js';
import { addDays, formatDayHeading, formatTime, isSameDay, startOfDay } from '../date-utils.js';
import { COLORS, expandRange } from '../model.js';

const WINDOW_DAYS = 60;

function colorHex(id) {
  return COLORS.find((c) => c.id === id)?.hex ?? COLORS[0].hex;
}

export function createAgendaView(ctx) {
  const element = el('div', { class: 'cal-view cal-agenda' });
  let anchor = new Date();
  const items = [];

  function render(date) {
    anchor = date;
    clear(element);
    items.length = 0;
    const today = startOfDay(new Date());
    const start = startOfDay(anchor);
    const end = addDays(start, WINDOW_DAYS);
    const occurrences = expandRange(ctx.getEvents(), start, end);
    if (!occurrences.length) {
      element.appendChild(el('div', { class: 'cal-agenda-empty', text: 'No upcoming events.' }));
      return;
    }
    const byDay = new Map();
    for (const occ of occurrences) {
      const key = startOfDay(occ.start).toDateString();
      if (!byDay.has(key)) byDay.set(key, []);
      byDay.get(key).push(occ);
    }
    const sortedDays = [...byDay.keys()].map((k) => new Date(k)).sort((a, b) => a - b);
    for (const day of sortedDays) {
      const group = el('div', { class: 'cal-agenda-group' });
      group.appendChild(el('div', { class: `cal-agenda-heading${isSameDay(day, today) ? ' is-today' : ''}`, text: formatDayHeading(day, ctx.locale) }));
      for (const occ of byDay.get(day.toDateString())) {
        const item = el('button', {
          class: 'cal-agenda-item',
          attrs: { type: 'button' },
          on: { click: () => ctx.onEdit(occ.event) },
        }, [
          el('span', { class: 'cal-agenda-dot', style: { '--chip-color': colorHex(occ.event.color) } }),
          el('span', { class: 'cal-agenda-time', text: occ.event.allDay ? 'All day' : formatTime(occ.start, ctx.locale, ctx.getPrefs().hour12) }),
          el('span', { class: 'cal-agenda-main' }, [
            el('div', { class: 'cal-agenda-title', text: occ.event.title || '(No title)' }),
            occ.event.location ? el('div', { class: 'cal-agenda-location', text: occ.event.location }) : null,
          ]),
        ]);
        items.push(item);
        group.appendChild(item);
      }
      element.appendChild(group);
    }
  }

  return {
    element,
    render,
    focus() { items[0]?.focus(); },
    next: () => addDays(anchor, 7),
    prev: () => addDays(anchor, -7),
    destroy() {},
  };
}
