/* The create/edit event dialog. One form covers both create and edit —
 * `open({ event })` edits, `open({ date })` / `open({ start, end })`
 * creates, prefilled from wherever the user clicked or dragged. */
import { el, createDialog } from './dom.js';
import { COLORS, RECURRENCE_OPTIONS, normalizeEvent } from '../model.js';
import { toLocalISO, parseLocal } from '../date-utils.js';

const RECURRENCE_LABELS = { none: 'Does not repeat', daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly' };

export function createEventEditor({ onSave, onDelete }) {
  let draft = null;
  let editingId = null;
  let els = {};

  function buildBody() {
    els.title = el('input', { class: 'cal-input', attrs: { type: 'text', maxlength: '200', 'aria-label': 'Title', placeholder: 'Add a title' } });
    els.allDay = el('input', { attrs: { type: 'checkbox' } });
    els.startDate = el('input', { class: 'cal-input', attrs: { type: 'date' } });
    els.startTime = el('input', { class: 'cal-input', attrs: { type: 'time' } });
    els.endDate = el('input', { class: 'cal-input', attrs: { type: 'date' } });
    els.endTime = el('input', { class: 'cal-input', attrs: { type: 'time' } });
    els.location = el('input', { class: 'cal-input', attrs: { type: 'text', maxlength: '200', placeholder: 'Add a location' } });
    els.notes = el('textarea', { class: 'cal-textarea', attrs: { maxlength: '2000', placeholder: 'Notes' } });
    els.recurrence = el(
      'select',
      { class: 'cal-select', attrs: { 'aria-label': 'Repeat' } },
      RECURRENCE_OPTIONS.map((id) => el('option', { text: RECURRENCE_LABELS[id], attrs: { value: id } })),
    );
    els.swatchWrap = el('div', { class: 'cal-swatches', attrs: { role: 'radiogroup', 'aria-label': 'Colour' } });
    els.swatches = new Map();
    for (const color of COLORS) {
      const swatch = el(
        'button',
        {
          class: 'cal-swatch',
          style: { '--swatch-color': color.hex },
          attrs: { type: 'button', role: 'radio', 'aria-checked': 'false', 'aria-label': color.id, title: color.id },
          on: { click: () => selectColor(color.id) },
        },
        [el('span', { class: 'cal-swatch-check', text: '✓' })],
      );
      els.swatches.set(color.id, swatch);
      els.swatchWrap.appendChild(swatch);
    }
    els.deleteBtn = el('button', {
      class: 'cal-btn is-danger',
      text: 'Delete',
      attrs: { type: 'button' },
      on: { click: () => { if (editingId) { onDelete(editingId); dialog.close(); } } },
    });
    els.cancelBtn = el('button', { class: 'cal-btn', text: 'Cancel', attrs: { type: 'button' }, on: { click: () => dialog.close() } });
    els.saveBtn = el('button', { class: 'cal-btn is-accent', text: 'Save', attrs: { type: 'button' }, on: { click: save } });
    els.title2 = el('h2', { class: 'cal-dialog-title', text: 'New event' });
    // Start and End stack vertically rather than sit side by side: a
    // date input plus a time input already needs the dialog's full
    // width to stay readable, so a 2-up layout here would squeeze both
    // into illegibly narrow boxes.
    els.timeRow = el('div', { class: 'cal-stack' }, [
      wrapField('Start', el('div', { class: 'cal-time-inputs' }, [els.startDate, els.startTime])),
      wrapField('End', el('div', { class: 'cal-time-inputs' }, [els.endDate, els.endTime])),
    ]);

    els.allDay.addEventListener('change', () => applyAllDayVisibility());

    return el('div', {}, [
      els.title2,
      wrapField('Title', els.title),
      el('label', { class: 'cal-check-row' }, [els.allDay, 'All day']),
      els.timeRow,
      wrapField('Colour', els.swatchWrap),
      wrapField('Repeat', els.recurrence),
      wrapField('Location', els.location),
      wrapField('Notes', els.notes),
      el('div', { class: 'cal-dialog-actions' }, [
        els.deleteBtn,
        el('div', { class: 'cal-dialog-actions-right' }, [els.cancelBtn, els.saveBtn]),
      ]),
    ]);
  }

  function wrapField(label, control) {
    return el('label', { class: 'cal-field' }, [el('span', { class: 'cal-field-label', text: label }), control]);
  }

  function selectColor(id) {
    draft.color = id;
    for (const [colorId, node] of els.swatches) node.setAttribute('aria-pressed', String(colorId === id));
    for (const [colorId, node] of els.swatches) node.setAttribute('aria-checked', String(colorId === id));
  }

  function applyAllDayVisibility() {
    const allDay = els.allDay.checked;
    els.startTime.style.display = allDay ? 'none' : '';
    els.endTime.style.display = allDay ? 'none' : '';
  }

  const dialog = createDialog({
    label: 'Event details',
    render: (panel) => panel.appendChild(buildBody()),
  });

  function fillForm() {
    els.title2.textContent = editingId ? 'Edit event' : 'New event';
    els.title.value = draft.title;
    els.allDay.checked = draft.allDay;
    const start = parseLocal(draft.start);
    const end = parseLocal(draft.end);
    els.startDate.value = toLocalISO(start, false);
    els.endDate.value = toLocalISO(end, false);
    els.startTime.value = pad2(start.getHours()) + ':' + pad2(start.getMinutes());
    els.endTime.value = pad2(end.getHours()) + ':' + pad2(end.getMinutes());
    els.location.value = draft.location;
    els.notes.value = draft.notes;
    els.recurrence.value = draft.recurrence;
    selectColor(draft.color);
    els.deleteBtn.style.display = editingId ? '' : 'none';
    applyAllDayVisibility();
  }

  function pad2(n) { return String(n).padStart(2, '0'); }

  function readForm() {
    const allDay = els.allDay.checked;
    const startDate = els.startDate.value || toLocalISO(new Date(), false);
    const endDate = els.endDate.value || startDate;
    const start = allDay ? `${startDate}` : `${startDate}T${els.startTime.value || '09:00'}`;
    const end = allDay ? `${endDate}` : `${endDate}T${els.endTime.value || '10:00'}`;
    return normalizeEvent({
      ...draft,
      title: els.title.value.trim(),
      allDay,
      start,
      end,
      location: els.location.value.trim(),
      notes: els.notes.value.trim(),
      recurrence: els.recurrence.value,
      color: draft.color,
    });
  }

  function save() {
    const event = readForm();
    if (!event.title) { els.title.focus(); return; }
    if (parseLocal(event.end) < parseLocal(event.start)) {
      const start = parseLocal(event.start);
      event.end = event.allDay ? event.start : toLocalISO(new Date(start.getTime() + 30 * 60000), true);
    }
    onSave(event, editingId);
    dialog.close();
  }

  return {
    element: dialog.element,
    isOpen: dialog.isOpen,
    close: dialog.close,
    openForCreate(seed = {}) {
      editingId = null;
      draft = normalizeEvent(seed);
      dialog.open();
      fillForm();
    },
    openForEdit(event) {
      editingId = event.id;
      draft = { ...event };
      dialog.open();
      fillForm();
    },
  };
}
