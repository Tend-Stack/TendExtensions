/* Shared hour-grid renderer behind both the week and day views: an
 * all-day row plus a scrollable 24-hour grid with a "now" line,
 * click/drag-to-create, and side-by-side layout for overlapping
 * events. `dayCount` is the only real difference between week (7) and
 * day (1) — see views/week.js and views/day.js. */
import { el, clear } from '../ui/dom.js';
import { addDays, formatHourLabel, formatTime, isSameDay, startOfDay, startOfWeek, weekdayNames } from '../date-utils.js';
import { COLORS, expandRange } from '../model.js';

const HOUR_HEIGHT = 48;
const SNAP_MINUTES = 15;

function colorHex(id) {
  return COLORS.find((c) => c.id === id)?.hex ?? COLORS[0].hex;
}

/** Greedy column-packing for overlapping same-day events: sort by
 *  start, assign each to the first column whose last event has
 *  already ended, and group into clusters so unrelated events later
 *  in the day don't shrink to share columns with earlier ones. */
function layoutColumns(occurrences) {
  const sorted = [...occurrences].sort((a, b) => a.start - b.start || b.end - a.end);
  const results = [];
  let cluster = [];
  let clusterEnd = null;

  function flush() {
    if (!cluster.length) return;
    const columnEnds = [];
    const placed = [];
    for (const occ of cluster) {
      let col = columnEnds.findIndex((end) => end <= occ.start);
      if (col === -1) { col = columnEnds.length; columnEnds.push(occ.end); } else { columnEnds[col] = occ.end; }
      placed.push({ occ, col });
    }
    const cols = columnEnds.length;
    for (const p of placed) results.push({ ...p, cols });
    cluster = [];
    clusterEnd = null;
  }

  for (const occ of sorted) {
    if (clusterEnd !== null && occ.start >= clusterEnd) flush();
    cluster.push(occ);
    clusterEnd = clusterEnd === null ? occ.end : new Date(Math.max(clusterEnd, occ.end));
  }
  flush();
  return results;
}

export function createTimeGridView(ctx, { dayCount }) {
  const element = el('div', { class: 'cal-view cal-time-view' });
  const header = el('div', { class: 'cal-time-header' });
  const allDayRow = el('div', { class: 'cal-allday-row' });
  const scrollArea = el('div', { class: 'cal-scroll-area' });
  const hoursGrid = el('div', { class: 'cal-hours-grid' });
  scrollArea.appendChild(hoursGrid);
  element.append(header, allDayRow, scrollArea);

  let anchor = new Date();
  let days = [];
  let dayCols = [];
  let nowInterval = null;
  let scrolled = false;

  function gridTemplate() {
    return `52px repeat(${dayCount}, minmax(0, 1fr))`;
  }

  function render(date) {
    anchor = date;
    const prefs = ctx.getPrefs();
    const weekStart = dayCount === 7 ? startOfWeek(anchor, prefs.weekStart) : startOfDay(anchor);
    days = Array.from({ length: dayCount }, (_, i) => addDays(weekStart, i));
    const today = startOfDay(new Date());
    const dowNames = weekdayNames(ctx.locale, days[0].getDay(), 'short');

    header.style.gridTemplateColumns = gridTemplate();
    clear(header);
    header.appendChild(el('div', { class: 'cal-time-header-label' }));
    days.forEach((day, i) => {
      const isToday = isSameDay(day, today);
      header.appendChild(el('button', {
        class: `cal-btn is-icon cal-time-daycol-head${isToday ? ' is-today' : ''}`,
        style: { flexDirection: 'column', height: 'auto', minHeight: '0', borderRadius: '8px' },
        attrs: { type: 'button', 'aria-label': `Open ${day.toDateString()}` },
        on: {
          click: () => ctx.onOpenDay(day),
          keydown: (e) => moveHeaderFocus(e, i),
        },
      }, [
        el('div', { class: 'cal-dow', text: dowNames[i] ?? '' }),
        el('div', { class: 'cal-dom', text: String(day.getDate()) }),
      ]));
    });

    allDayRow.style.gridTemplateColumns = gridTemplate();
    clear(allDayRow);
    allDayRow.appendChild(el('div', { class: 'cal-time-col-label' }));
    const rangeStart = days[0];
    const rangeEnd = addDays(days[days.length - 1], 1);
    const occurrences = expandRange(ctx.getEvents(), rangeStart, rangeEnd);
    const allDayOccs = occurrences.filter((o) => o.event.allDay);
    const timedOccs = occurrences.filter((o) => !o.event.allDay);

    for (const day of days) {
      const cell = el('div', { class: 'cal-allday-cell' });
      for (const occ of allDayOccs.filter((o) => o.start < dayEnd(day) && o.end > day)) {
        cell.appendChild(el('button', {
          class: 'cal-chip', style: { '--chip-color': colorHex(occ.event.color) },
          attrs: { type: 'button', title: occ.event.title },
          on: { click: (e) => { e.stopPropagation(); ctx.onEdit(occ.event); } },
        }, [el('span', { class: 'cal-chip-dot' }), el('span', { class: 'cal-chip-title', text: occ.event.title || '(No title)' })]));
      }
      allDayRow.appendChild(cell);
    }

    clear(hoursGrid);
    hoursGrid.style.gridTemplateColumns = gridTemplate();
    hoursGrid.style.gridTemplateRows = `repeat(24, ${HOUR_HEIGHT}px)`;
    dayCols = [];

    for (let hour = 0; hour < 24; hour++) {
      hoursGrid.appendChild(el('div', { class: 'cal-hour-label', style: { gridColumn: '1', gridRow: String(hour + 1) }, text: hour === 0 ? '' : formatHourLabel(hour, ctx.locale, prefs.hour12) }));
    }
    days.forEach((day, dayIndex) => {
      const col = el('div', { class: 'cal-day-col', style: { gridColumn: String(dayIndex + 2), gridRow: `1 / span 24` } });
      for (let hour = 0; hour < 24; hour++) {
        col.appendChild(el('div', {
          class: 'cal-hour-cell', style: { position: 'absolute', left: 0, right: 0, top: `${hour * HOUR_HEIGHT}px`, height: `${HOUR_HEIGHT}px` },
          dataset: { hour },
        }));
      }
      col.style.position = 'relative';
      col.style.minHeight = `${24 * HOUR_HEIGHT}px`;
      attachDragCreate(col, day);
      hoursGrid.appendChild(col);
      dayCols.push(col);
    });
    // Grid lines under the hour cells so borders show even with absolutely
    // positioned children.
    for (let hour = 1; hour < 24; hour++) {
      hoursGrid.appendChild(el('div', { class: 'cal-hour-row', style: { gridColumn: `1 / span ${dayCount + 1}`, gridRow: String(hour + 1), pointerEvents: 'none' } }));
    }

    const grouped = new Map(days.map((day) => [day.toDateString(), []]));
    for (const occ of timedOccs) {
      for (const day of days) {
        if (occ.start < dayEnd(day) && occ.end > day) grouped.get(day.toDateString())?.push(occ);
      }
    }
    days.forEach((day, dayIndex) => {
      const dayOccs = grouped.get(day.toDateString()) ?? [];
      const placed = layoutColumns(dayOccs.map((o) => ({ ...o, start: clampToDay(o.start, day), end: clampToDay(o.end, day, true) })));
      for (const { occ, col: colIdx, cols } of placed) {
        const top = minutesFromMidnight(occ.start) / 60 * HOUR_HEIGHT;
        const height = Math.max(16, (minutesFromMidnight(occ.end) - minutesFromMidnight(occ.start)) / 60 * HOUR_HEIGHT);
        const width = 100 / cols;
        dayCols[dayIndex].appendChild(el('button', {
          class: 'cal-time-block',
          style: {
            '--chip-color': colorHex(occ.event.color),
            top: `${top}px`, height: `${height}px`,
            left: `calc(${colIdx * width}% + 2px)`, width: `calc(${width}% - 4px)`,
          },
          attrs: { type: 'button', title: occ.event.title },
          on: { click: (e) => { e.stopPropagation(); ctx.onEdit(occ.event); } },
        }, [
          el('div', { class: 'cal-block-title', text: occ.event.title || '(No title)' }),
          el('div', { class: 'cal-block-time', text: formatTime(occ.start, ctx.locale, prefs.hour12) }),
        ]));
      }
    });

    updateNowLine(today);
    if (!scrolled) {
      scrollArea.scrollTop = Math.max(0, 7 * HOUR_HEIGHT - 40);
      scrolled = true;
    }
  }

  function moveHeaderFocus(event, index) {
    if (event.key === 'Enter') return;
    const delta = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!delta) return;
    const next = header.querySelectorAll('.cal-time-daycol-head')[index + delta];
    if (next) { event.preventDefault(); next.focus(); }
  }

  function updateNowLine(today) {
    hoursGrid.querySelectorAll('.cal-now-line').forEach((n) => n.remove());
    const now = new Date();
    const todayIndex = days.findIndex((d) => isSameDay(d, now));
    if (todayIndex < 0) return;
    const top = minutesFromMidnight(now) / 60 * HOUR_HEIGHT;
    dayCols[todayIndex]?.appendChild(el('div', { class: 'cal-now-line', style: { top: `${top}px` } }));
  }

  function attachDragCreate(col, day) {
    let dragging = false;
    let startMinutes = 0;
    let preview = null;

    function minutesAtY(y) {
      const rect = col.getBoundingClientRect();
      const raw = ((y - rect.top) / HOUR_HEIGHT) * 60;
      return Math.max(0, Math.min(24 * 60, Math.round(raw / SNAP_MINUTES) * SNAP_MINUTES));
    }

    col.addEventListener('mousedown', (event) => {
      if (event.button !== 0) return;
      const onBackground = event.target === col || event.target.classList.contains('cal-hour-cell');
      if (!onBackground) return;
      dragging = true;
      startMinutes = minutesAtY(event.clientY);
      preview = el('div', { class: 'cal-drag-preview', style: { top: `${startMinutes / 60 * HOUR_HEIGHT}px`, height: `${SNAP_MINUTES / 60 * HOUR_HEIGHT}px` } });
      col.appendChild(preview);
      event.preventDefault();
    });
    window.addEventListener('mousemove', (event) => {
      if (!dragging || !preview) return;
      const current = minutesAtY(event.clientY);
      const top = Math.min(startMinutes, current);
      const bottom = Math.max(startMinutes, current);
      preview.style.top = `${top / 60 * HOUR_HEIGHT}px`;
      preview.style.height = `${Math.max(SNAP_MINUTES, bottom - top) / 60 * HOUR_HEIGHT}px`;
    });
    window.addEventListener('mouseup', (event) => {
      if (!dragging) return;
      dragging = false;
      const endMinutes = minutesAtY(event.clientY);
      preview?.remove();
      preview = null;
      const lo = Math.min(startMinutes, endMinutes);
      const hi = Math.max(startMinutes, Math.max(endMinutes, startMinutes + 60));
      const start = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, lo);
      const end = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, hi);
      ctx.onCreate({ start, end, allDay: false });
    });
  }

  function minutesFromMidnight(date) {
    return date.getHours() * 60 + date.getMinutes();
  }
  function clampToDay(date, day, isEnd = false) {
    const lo = startOfDay(day);
    const hi = dayEnd(day);
    if (date < lo) return isEnd ? lo : lo;
    if (date > hi) return hi;
    return date;
  }
  function dayEnd(day) {
    return new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1);
  }

  return {
    element,
    render,
    focus() {
      element.querySelector('.cal-time-daycol-head.is-today, .cal-time-daycol-head')?.focus();
    },
    next: () => addDays(anchor, dayCount),
    prev: () => addDays(anchor, -dayCount),
    destroy() {
      if (nowInterval) clearInterval(nowInterval);
    },
    startClock() {
      nowInterval = setInterval(() => updateNowLine(startOfDay(new Date())), 60000);
    },
  };
}
