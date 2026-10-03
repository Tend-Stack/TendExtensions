import { digestAll } from '../lib/hash.js';
import { checkbox, debounce, el, textarea } from '../ui/dom.js';
import { outputBox, panelShell, statusLine } from '../ui/parts.js';

const ALGORITHMS = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];

export function createHashPanel(ctx) {
  const input = textarea({ rows: 6, placeholder: 'Text to hash (UTF-8)', label: 'Text to hash' });
  const status = statusLine();
  const boxes = new Map(ALGORITHMS.map((name) => [name, outputBox(name)]));
  let upper = false;
  let seq = 0;

  const uppercase = checkbox('Uppercase hex', false, (v) => { upper = v; update(); ctx.changed(); });

  async function update() {
    seq += 1;
    const mine = seq;
    let list;
    try {
      list = await digestAll(input.value);
    } catch (error) {
      if (mine === seq) status.set(error.message, 'error');
      return;
    }
    if (mine !== seq) return;
    for (const { algorithm, hex } of list) boxes.get(algorithm).set(upper ? hex.toUpperCase() : hex);
    status.set(`${new TextEncoder().encode(input.value).length} bytes hashed`, 'ok');
  }
  const live = debounce(update, 100);
  input.addEventListener('input', () => live());

  const element = panelShell('hash', 'Hash', [
    el('div', { class: 'dt-grid' }, [
      el('div', { class: 'dt-col' }, [
        el('div', { class: 'dt-block-head' }, [el('span', { class: 'dt-label', text: 'Input' })]),
        input,
        el('div', { class: 'dt-toolbar' }, [uppercase.element]),
        status.element,
      ]),
      el('div', { class: 'dt-col' }, [...boxes.values()].map((b) => b.element)),
    ]),
  ]);

  return {
    id: 'hash',
    title: 'Hash',
    element,
    focus: () => input.focus(),
    // The text may be a password or a secret: only the option is stored.
    getState: () => ({ upper }),
    setState(state) {
      upper = Boolean(state?.upper);
      uppercase.input.checked = upper;
      update();
    },
    destroy() { live.cancel(); seq += 1; },
  };
}
