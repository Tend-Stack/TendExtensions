/* The confirm step Settings → Import & export shows before an .ics
 * import actually touches storage: a count (new vs. update) and any
 * per-event notes (an unmapped recurrence, a skipped malformed VEVENT).
 * `open(summary)` where `summary` is `{ total, newCount, updateCount,
 * notes, drafts }` — `drafts` is only handed back to `onConfirm`,
 * never rendered. */
import { el, createDialog } from './dom.js';

const MAX_NOTES_SHOWN = 8;

export function createImportPreview({ onConfirm }) {
  let pending = null;
  let els = {};

  function buildBody() {
    els.summary = el('p', { class: 'cal-import-summary' });
    els.notes = el('ul', { class: 'cal-import-notes' });
    els.cancelBtn = el('button', { class: 'cal-btn', text: 'Cancel', attrs: { type: 'button' }, on: { click: () => dialog.close() } });
    els.confirmBtn = el('button', {
      class: 'cal-btn is-accent',
      text: 'Import',
      attrs: { type: 'button' },
      on: { click: () => { const summary = pending; dialog.close(); if (summary) onConfirm(summary); } },
    });
    return el('div', {}, [
      el('h2', { class: 'cal-dialog-title', text: 'Import calendar' }),
      els.summary,
      els.notes,
      el('div', { class: 'cal-dialog-actions' }, [els.cancelBtn, els.confirmBtn]),
    ]);
  }

  const dialog = createDialog({ label: 'Import calendar', render: (panel) => panel.appendChild(buildBody()) });

  return {
    element: dialog.element,
    close: dialog.close,
    isOpen: dialog.isOpen,
    open(summary) {
      pending = summary;
      dialog.open();
      const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
      els.summary.textContent = summary.total
        ? `${plural(summary.total, 'event')} found — ${plural(summary.newCount, 'new event')}, ${plural(summary.updateCount, 'update')}.`
        : 'No events found in this file.';
      els.notes.replaceChildren();
      const shown = summary.notes.slice(0, MAX_NOTES_SHOWN);
      for (const note of shown) els.notes.appendChild(el('li', { text: note }));
      if (summary.notes.length > MAX_NOTES_SHOWN) {
        els.notes.appendChild(el('li', { text: `+ ${summary.notes.length - MAX_NOTES_SHOWN} more` }));
      }
      els.confirmBtn.disabled = summary.total === 0;
    },
  };
}
