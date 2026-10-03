import { MAX_COUNT, MIN_COUNT, clampCount, generateUuids } from '../lib/uuid.js';
import { button, checkbox, el, field, textInput } from '../ui/dom.js';
import { copyButton } from '../ui/clipboard.js';
import { panelShell, statusLine } from '../ui/parts.js';

export function createUuidPanel(ctx) {
  const count = textInput({ type: 'number', min: MIN_COUNT, max: MAX_COUNT, mono: false, label: 'How many' });
  count.value = '1';
  const list = el('ol', { class: 'dt-uuids', attrs: { 'aria-label': 'Generated UUIDs' } });
  const status = statusLine();
  let ids = [];
  let uppercase = false;
  let hyphens = true;

  function generate() {
    const n = clampCount(count.value);
    count.value = String(n);
    try {
      ids = generateUuids(n, { uppercase, hyphens });
    } catch (error) {
      status.set(error.message, 'error');
      return;
    }
    list.replaceChildren(...ids.map((id) => el('li', { class: 'dt-uuid' }, [
      el('code', { class: 'dt-row-value is-mono', text: id }),
      copyButton(() => id),
    ])));
    status.set(`${n} UUID v4${n === 1 ? '' : 's'} generated with crypto.randomUUID`, 'ok');
    ctx.changed();
  }

  const upperBox = checkbox('Uppercase', false, (v) => { uppercase = v; generate(); });
  const hyphenBox = checkbox('Hyphens', true, (v) => { hyphens = v; generate(); });
  count.addEventListener('change', generate);
  count.addEventListener('keydown', (event) => { if (event.key === 'Enter') { event.preventDefault(); generate(); } });

  const element = panelShell('uuid', 'UUID', [
    el('div', { class: 'dt-toolbar' }, [
      field('How many (1 to 50)', count),
      upperBox.element,
      hyphenBox.element,
    ]),
    el('div', { class: 'dt-toolbar' }, [
      button('Generate', generate, { primary: true }),
      copyButton(() => ids.join('\n'), 'Copy all'),
    ]),
    status.element,
    list,
  ]);

  return {
    id: 'uuid',
    title: 'UUID',
    element,
    focus: () => count.focus(),
    getState: () => ({ count: count.value, uppercase, hyphens }),
    setState(state) {
      if (state?.count !== undefined) count.value = String(clampCount(state.count));
      uppercase = Boolean(state?.uppercase);
      hyphens = state?.hyphens !== false;
      upperBox.input.checked = uppercase;
      hyphenBox.input.checked = hyphens;
      generate();
    },
  };
}
