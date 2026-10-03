/* Shared building blocks for the tool panels. */
import { el } from './dom.js';
import { copyButton } from './clipboard.js';

/** A message line: `set('text', 'ok' | 'error' | 'info')`. */
export function statusLine() {
  const node = el('div', { class: 'dt-status', attrs: { role: 'status', 'aria-live': 'polite' } });
  return {
    element: node,
    set(text, kind = 'info') {
      node.textContent = text ?? '';
      node.className = `dt-status${text ? ` is-${kind}` : ''}`;
    },
    clear() { node.textContent = ''; node.className = 'dt-status'; },
  };
}

/** A read-only output with a heading and a Copy button. */
export function outputBox(label, options = {}) {
  const body = el('pre', { class: `dt-output${options.mono === false ? '' : ' is-mono'}`, attrs: { tabindex: '0', 'aria-label': label } });
  const root = el('div', { class: 'dt-block' }, [
    el('div', { class: 'dt-block-head' }, [
      el('span', { class: 'dt-label', text: label }),
      copyButton(() => body.textContent),
    ]),
    body,
  ]);
  return {
    element: root,
    set(text) { body.textContent = text ?? ''; },
    get: () => body.textContent,
  };
}

/** One "name  value  [Copy]" row in a key/value list. */
export function valueRow(name, value, options = {}) {
  const val = el('span', { class: `dt-row-value${options.mono === false ? '' : ' is-mono'}`, text: value === '' ? '(empty)' : value });
  if (value === '') val.classList.add('is-empty');
  return el('div', { class: 'dt-row' }, [
    el('span', { class: 'dt-row-name', text: name }),
    val,
    value === '' ? el('span') : copyButton(() => value),
  ]);
}

/** Title and body wrapper for a tool panel. */
export function panelShell(id, title, children) {
  return el('section', {
    class: 'dt-panel',
    attrs: { id: `dt-panel-${id}`, role: 'tabpanel', 'aria-labelledby': `dt-tab-${id}`, tabindex: '-1' },
  }, [el('h2', { class: 'dt-title', text: title }), ...children]);
}
