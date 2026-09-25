/* The create/edit event dialog. One form covers both create and edit —
 * `open({ event })` edits, `open({ date })` / `open({ start, end })`
 * creates, prefilled from wherever the user clicked or dragged.
 *
 * `remindersSupported` and `getReminderCapabilities` (from index.js,
 * ultimately from `host.reminders`) drive the Reminders field: absent
 * host support disables the whole field with an explanatory hint;
 * present-but-no-email disables the Email checkbox per reminder with
 * its own hint, same as the package brief's "wrap every host call so a
 * panel without host.reminders degrades gracefully" rule.
 */
import { el, clear, createDialog } from './dom.js';
import { createDropdown } from './dropdown.js';
import { COLORS, RECURRENCE_OPTIONS, normalizeEvent } from '../model.js';
import { toLocalISO, parseLocal, minutesBetween, timeFieldsEnabled } from '../date-utils.js';
import { REMINDER_PRESETS, CUSTOM_UNITS, customOffsetMinutes, guessCustomOffset, reminderChannelsFromSelection } from '../reminders.js';

const RECURRENCE_LABELS = { none: 'Does not repeat', daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly' };
const DEFAULT_REMINDER_OFFSET = 15;

export function createEventEditor({ onSave, onDelete, remindersSupported = false, getReminderCapabilities }) {
  let draft = null;
  let editingId = null;
  let els = {};
  // Duration (minutes) between start and end, preserved when the start
  // moves so a 30-minute meeting stays 30 minutes when it's dragged to
  // a new time (1.4.0); recomputed whenever End is edited directly.
  let durationMinutes = 60;

  function capabilities() {
    return getReminderCapabilities ? getReminderCapabilities() : { panel: true, email: false, sound: false };
  }

  function buildReminderRow(reminder, index) {
    const isPreset = REMINDER_PRESETS.some((p) => p.offsetMinutes === reminder.offsetMinutes);
    const presetOptions = [
      ...REMINDER_PRESETS.map((p) => ({ value: String(p.offsetMinutes), label: p.label })),
      { value: 'custom', label: 'Custom…' },
    ];
    const presetDropdown = createDropdown({
      options: presetOptions,
      value: isPreset ? String(reminder.offsetMinutes) : 'custom',
      ariaLabel: 'Reminder time',
      onChange: () => {
        customWrap.style.display = presetDropdown.value === 'custom' ? '' : 'none';
        commit();
      },
    });
    presetDropdown.element.classList.add('cal-reminder-preset');

    const guess = guessCustomOffset(reminder.offsetMinutes);
    const customAmount = el('input', {
      class: 'cal-input',
      attrs: { type: 'number', min: '1', max: '999', 'aria-label': 'Custom reminder amount' },
    });
    customAmount.value = String(guess.amount);
    const customUnitDropdown = createDropdown({
      options: CUSTOM_UNITS.map((u) => ({ value: u, label: u })),
      value: guess.unit,
      ariaLabel: 'Custom reminder unit',
      onChange: commit,
    });
    const customWrap = el('div', { class: 'cal-reminder-custom' }, [customAmount, customUnitDropdown.element]);
    customWrap.style.display = isPreset ? 'none' : '';

    const caps = capabilities();
    const panelCheck = el('input', { attrs: { type: 'checkbox' } });
    panelCheck.checked = reminder.channels.includes('panel');
    const emailCheck = el('input', { attrs: { type: 'checkbox' } });
    emailCheck.checked = reminder.channels.includes('email') && caps.email;
    emailCheck.disabled = !caps.email;
    // Sound (1.3.0): omitted entirely on a panel that doesn't report the
    // capability (older panel, or `capabilities()` simply not returning
    // it — treated the same as `false`), unlike Email's shown-but-
    // disabled treatment above.
    const soundCheck = caps.sound ? el('input', { attrs: { type: 'checkbox' } }) : null;
    if (soundCheck) soundCheck.checked = reminder.channels.includes('sound');

    const removeBtn = el('button', {
      class: 'cal-btn is-icon cal-reminder-remove',
      text: '✕',
      attrs: { type: 'button', 'aria-label': 'Remove reminder' },
      on: { click: () => { draft.reminders.splice(index, 1); renderReminders(); } },
    });

    function commit() {
      const offsetMinutes = presetDropdown.value === 'custom'
        ? (customOffsetMinutes(customAmount.value, customUnitDropdown.value) ?? reminder.offsetMinutes)
        : Number(presetDropdown.value);
      const channels = reminderChannelsFromSelection({
        panel: panelCheck.checked,
        email: emailCheck.checked && caps.email,
        sound: !!soundCheck?.checked && caps.sound,
      });
      draft.reminders[index] = { offsetMinutes, channels };
    }
    customAmount.addEventListener('input', commit);
    panelCheck.addEventListener('change', commit);
    emailCheck.addEventListener('change', commit);
    if (soundCheck) soundCheck.addEventListener('change', commit);

    const emailLabel = el(
      'label',
      { class: `cal-reminder-channel${caps.email ? '' : ' is-disabled'}` },
      [emailCheck, 'Email'],
    );
    const channelsRow = el('div', { class: 'cal-reminder-channels' }, [
      el('label', { class: 'cal-reminder-channel' }, [panelCheck, 'Panel']),
      emailLabel,
      soundCheck ? el('label', { class: 'cal-reminder-channel' }, [soundCheck, 'Sound']) : null,
      !caps.email ? el('span', { class: 'cal-reminder-hint', text: 'Set up email in Settings → Notifications' }) : null,
    ]);

    return el('div', { class: 'cal-reminder-row' }, [presetDropdown.element, customWrap, channelsRow, removeBtn]);
  }

  function renderReminders() {
    if (!els.remindersList) return;
    clear(els.remindersList);
    for (let i = 0; i < draft.reminders.length; i++) els.remindersList.appendChild(buildReminderRow(draft.reminders[i], i));
  }

  function addReminder() {
    draft.reminders.push({ offsetMinutes: DEFAULT_REMINDER_OFFSET, channels: ['panel'] });
    renderReminders();
  }

  function buildRemindersField() {
    if (!remindersSupported) {
      return wrapField('Reminders', el('div', { class: 'cal-reminders-unsupported', text: 'Reminders need panel update' }));
    }
    els.remindersList = el('div', { class: 'cal-reminders-list' });
    els.addReminderBtn = el('button', {
      class: 'cal-btn',
      text: '+ Add reminder',
      attrs: { type: 'button' },
      on: { click: addReminder },
    });
    return wrapField('Reminders', el('div', {}, [els.remindersList, els.addReminderBtn]));
  }

  function buildBody() {
    els.title = el('input', { class: 'cal-input', attrs: { type: 'text', maxlength: '200', 'aria-label': 'Title', placeholder: 'Add a title' } });
    els.allDay = el('input', { attrs: { type: 'checkbox' } });
    els.startDate = el('input', { class: 'cal-input', attrs: { type: 'date' } });
    els.startTime = el('input', { class: 'cal-input', attrs: { type: 'time' } });
    els.endDate = el('input', { class: 'cal-input', attrs: { type: 'date' } });
    els.endTime = el('input', { class: 'cal-input', attrs: { type: 'time' } });
    els.location = el('input', { class: 'cal-input', attrs: { type: 'text', maxlength: '200', placeholder: 'Add a location' } });
    els.notes = el('textarea', { class: 'cal-textarea', attrs: { maxlength: '2000', placeholder: 'Notes' } });
    els.recurrence = createDropdown({
      options: RECURRENCE_OPTIONS.map((id) => ({ value: id, label: RECURRENCE_LABELS[id] })),
      value: 'none',
      ariaLabel: 'Repeat',
    });
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
    // into illegibly narrow boxes. Each input gets its own "Date" /
    // "Time" label (1.4.0) so Time reads clearly next to Date instead
    // of being an unlabelled second box.
    els.startTimeGroup = timeInputGroup('Time', els.startTime);
    els.endTimeGroup = timeInputGroup('Time', els.endTime);
    els.timeError = el('div', { class: 'cal-field-error is-hidden', attrs: { role: 'alert' } });
    els.timeRow = el('div', { class: 'cal-stack' }, [
      wrapField('Start', el('div', { class: 'cal-time-inputs' }, [timeInputGroup('Date', els.startDate), els.startTimeGroup])),
      wrapField('End', el('div', { class: 'cal-time-inputs' }, [timeInputGroup('Date', els.endDate), els.endTimeGroup])),
      els.timeError,
    ]);

    els.allDay.addEventListener('change', () => applyAllDayVisibility());
    els.startDate.addEventListener('change', keepEndDurationOnStartChange);
    els.startTime.addEventListener('change', keepEndDurationOnStartChange);
    els.endDate.addEventListener('change', recomputeDurationFromEnd);
    els.endTime.addEventListener('change', recomputeDurationFromEnd);

    return el('div', {}, [
      els.title2,
      wrapField('Title', els.title),
      el('label', { class: 'cal-check-row' }, [els.allDay, 'All day']),
      els.timeRow,
      wrapField('Colour', els.swatchWrap),
      wrapField('Repeat', els.recurrence.element),
      buildRemindersField(),
      wrapField('Location', els.location),
      wrapField('Notes', els.notes),
      el('div', { class: 'cal-dialog-actions' }, [els.deleteBtn, els.cancelBtn, els.saveBtn]),
    ]);
  }

  function wrapField(label, control) {
    return el('label', { class: 'cal-field' }, [el('span', { class: 'cal-field-label', text: label }), control]);
  }

  /** One Date-or-Time input plus its own small visible label (1.4.0) —
   *  "Time" now reads clearly beside "Date" instead of being an
   *  unlabelled second box next to it. */
  function timeInputGroup(label, input) {
    return el('label', { class: 'cal-time-input-group' }, [el('span', { class: 'cal-time-input-sublabel', text: label }), input]);
  }

  function currentStart() {
    return parseLocal(`${els.startDate.value}T${els.startTime.value || '00:00'}`);
  }
  function currentEnd() {
    return parseLocal(`${els.endDate.value}T${els.endTime.value || '00:00'}`);
  }

  /** Start moved (date or time): shift End by the preserved duration
   *  so a 30-minute event dragged to a new time stays 30 minutes. */
  function keepEndDurationOnStartChange() {
    const start = currentStart();
    if (!start) return;
    const end = new Date(start.getTime() + durationMinutes * 60000);
    els.endDate.value = toLocalISO(end, false);
    els.endTime.value = pad2(end.getHours()) + ':' + pad2(end.getMinutes());
    hideTimeError();
  }

  /** End edited directly: remember its new duration relative to Start
   *  (only when it's still after Start — an in-progress edit that's
   *  briefly before Start doesn't discard the last good duration). */
  function recomputeDurationFromEnd() {
    const start = currentStart();
    const end = currentEnd();
    if (start && end && end > start) durationMinutes = minutesBetween(start, end);
    hideTimeError();
  }

  function showTimeError(message) {
    els.timeError.textContent = message;
    els.timeError.classList.remove('is-hidden');
  }
  function hideTimeError() {
    els.timeError.classList.add('is-hidden');
  }

  function selectColor(id) {
    draft.color = id;
    for (const [colorId, node] of els.swatches) node.setAttribute('aria-pressed', String(colorId === id));
    for (const [colorId, node] of els.swatches) node.setAttribute('aria-checked', String(colorId === id));
  }

  // 1.4.0: the time fields stay visible when "All day" is on — disabled
  // and dimmed, not hidden, so the option a person is missing (time of
  // day) is still discoverable rather than disappearing outright.
  function applyAllDayVisibility() {
    const enabled = timeFieldsEnabled(els.allDay.checked);
    els.startTime.disabled = !enabled;
    els.endTime.disabled = !enabled;
    els.startTimeGroup.classList.toggle('is-disabled', !enabled);
    els.endTimeGroup.classList.toggle('is-disabled', !enabled);
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
    durationMinutes = minutesBetween(start, end);
    if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) durationMinutes = 60;
    hideTimeError();
    els.location.value = draft.location;
    els.notes.value = draft.notes;
    els.recurrence.setValue(draft.recurrence);
    selectColor(draft.color);
    renderReminders();
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
      reminders: draft.reminders,
    });
  }

  function save() {
    const event = readForm();
    if (!event.title) { els.title.focus(); return; }
    // 1.4.0: refuse End-before-Start with a message rather than
    // silently nudging End forward — a person who sees an end time
    // move on its own after clicking Save has no idea what happened.
    if (parseLocal(event.end) < parseLocal(event.start)) {
      showTimeError('End must be after start.');
      (event.allDay ? els.endDate : els.endTime).focus();
      return;
    }
    hideTimeError();
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
      draft = { ...event, reminders: event.reminders.map((r) => ({ offsetMinutes: r.offsetMinutes, channels: [...r.channels] })) };
      dialog.open();
      fillForm();
    },
  };
}
