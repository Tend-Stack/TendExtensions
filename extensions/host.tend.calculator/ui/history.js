/* The history tape.
 *
 * A slide-in panel INSIDE the tool window, not a second window and not
 * a resize: the manifest pins the window to one size, so the tape
 * overlays the keypad and slides back out. `prefers-reduced-motion`
 * turns the slide into an instant swap.
 *
 * Entries are capped at 500. The cap is enforced on write rather than
 * on read so the stored value can never grow past the host's 1 MB
 * per-key ceiling.
 */
import { el, clear } from './dom.js';
import { copyText, downloadText, csvRows } from './clipboard.js';

export const HISTORY_KEY = 'history.v1';
export const HISTORY_LIMIT = 500;

function timestamp(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString(undefined, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

/** Drop anything that does not look like an entry we wrote. */
export function normalizeEntries(value) {
  if (!Array.isArray(value)) return [];
  const out = [];
  for (const item of value) {
    if (!item || typeof item !== 'object') continue;
    const expression = String(item.expression ?? '').slice(0, 400);
    const result = String(item.result ?? '').slice(0, 200);
    if (!expression && !result) continue;
    out.push({
      id: String(item.id ?? `${out.length}-${item.at ?? 0}`),
      mode: String(item.mode ?? 'standard').slice(0, 24),
      expression,
      result,
      at: Number(item.at) || Date.now(),
    });
  }
  return out.slice(0, HISTORY_LIMIT);
}

export function entriesToText(entries) {
  return entries
    .map((entry) => `${timestamp(entry.at)}\t${entry.mode}\t${entry.expression} = ${entry.result}`)
    .join('\n');
}

export function entriesToCsv(entries) {
  return csvRows([
    ['timestamp', 'mode', 'expression', 'result'],
    ...entries.map((entry) => [new Date(entry.at).toISOString(), entry.mode, entry.expression, entry.result]),
  ]);
}

/**
 * @param {object} options
 * @param {(entry: object, what: 'expression'|'result') => void} options.onUse
 */
export function createTape({ store, onUse, onToggle }) {
  let entries = [];
  let open = false;

  const list = el('div', { class: 'calc-tape-list', attrs: { role: 'list' } });
  const empty = el('p', {
    class: 'calc-tape-empty',
    text: 'Nothing yet. Press = and the calculation lands here.',
  });

  const panel = el('aside', {
    class: 'calc-tape',
    attrs: { 'aria-label': 'History tape', 'aria-hidden': 'true' },
  }, [
    el('header', { class: 'calc-tape-head' }, [
      el('h2', { class: 'calc-tape-title', text: 'History' }),
      el('button', {
        class: 'calc-icon-button',
        text: '✕',
        attrs: { type: 'button', 'aria-label': 'Close history' },
        on: { click: () => api.close() },
      }),
    ]),
    list,
    empty,
    el('footer', { class: 'calc-tape-foot' }, [
      el('button', {
        class: 'calc-chip', text: 'Text',
        attrs: { type: 'button', 'aria-label': 'Export history as text' },
        on: { click: () => downloadText('calculator-history.txt', entriesToText(entries)) },
      }),
      el('button', {
        class: 'calc-chip', text: 'CSV',
        attrs: { type: 'button', 'aria-label': 'Export history as CSV' },
        on: { click: () => downloadText('calculator-history.csv', entriesToCsv(entries), 'text/csv;charset=utf-8') },
      }),
      el('button', {
        class: 'calc-chip is-danger', text: 'Clear',
        attrs: { type: 'button', 'aria-label': 'Clear all history' },
        on: { click: () => api.clear() },
      }),
    ]),
  ]);

  function render() {
    clear(list);
    empty.hidden = entries.length > 0;
    for (const entry of entries) {
      list.appendChild(el('div', { class: 'calc-tape-row', attrs: { role: 'listitem' } }, [
        el('div', { class: 'calc-tape-meta' }, [
          el('span', { class: 'calc-tape-mode', text: entry.mode }),
          el('span', { class: 'calc-tape-time', text: timestamp(entry.at) }),
        ]),
        el('button', {
          class: 'calc-tape-expr',
          text: entry.expression,
          attrs: { type: 'button', title: 'Load this expression', 'aria-label': `Load expression ${entry.expression}` },
          on: { click: () => onUse(entry, 'expression') },
        }),
        el('div', { class: 'calc-tape-bottom' }, [
          el('button', {
            class: 'calc-tape-result',
            text: `= ${entry.result}`,
            attrs: { type: 'button', title: 'Load this result', 'aria-label': `Load result ${entry.result}` },
            on: { click: () => onUse(entry, 'result') },
          }),
          el('button', {
            class: 'calc-icon-button is-small',
            text: '⧉',
            attrs: { type: 'button', title: 'Copy line', 'aria-label': `Copy ${entry.expression} = ${entry.result}` },
            on: {
              click: async (event) => {
                const button = event.currentTarget;
                const ok = await copyText(`${entry.expression} = ${entry.result}`);
                button.textContent = ok ? '✓' : '!';
                setTimeout(() => { button.textContent = '⧉'; }, 1200);
              },
            },
          }),
        ]),
      ]));
    }
  }

  const api = {
    element: panel,
    async hydrate() {
      entries = normalizeEntries(await store.load(HISTORY_KEY, []));
      render();
    },
    push(entry) {
      const record = {
        id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
        mode: entry.mode,
        expression: String(entry.expression ?? '').slice(0, 400),
        result: String(entry.result ?? '').slice(0, 200),
        at: Date.now(),
      };
      entries = [record, ...entries].slice(0, HISTORY_LIMIT);
      store.set(HISTORY_KEY, entries);
      render();
      return record;
    },
    clear() {
      entries = [];
      store.set(HISTORY_KEY, entries);
      render();
    },
    get entries() { return entries; },
    isOpen() { return open; },
    open() {
      if (open) return;
      open = true;
      panel.setAttribute('aria-hidden', 'false');
      // `visibility: hidden` (not the hidden attribute) keeps the panel
      // out of the tab order while still letting the slide animate.
      panel.classList.add('is-open');
      onToggle?.(true);
    },
    close() {
      if (!open) return;
      open = false;
      panel.classList.remove('is-open');
      panel.setAttribute('aria-hidden', 'true');
      onToggle?.(false);
    },
    toggle() {
      if (open) api.close(); else api.open();
    },
  };

  return api;
}
