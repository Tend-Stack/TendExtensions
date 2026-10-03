import { decodeUrlText, encodeUrlText, parseUrl } from '../lib/url-tools.js';
import { checkbox, debounce, el, segmented, textarea } from '../ui/dom.js';
import { outputBox, panelShell, statusLine, valueRow } from '../ui/parts.js';

const MODES = [
  { value: 'encode', label: 'Encode' },
  { value: 'decode', label: 'Decode' },
  { value: 'parse', label: 'Parse' },
];
const PART_LABELS = [
  ['href', 'Full URL'], ['origin', 'Origin'], ['protocol', 'Scheme'], ['username', 'User'], ['password', 'Password'],
  ['hostname', 'Host'], ['port', 'Port'], ['pathname', 'Path'], ['search', 'Query string'], ['hash', 'Fragment'],
];

export function createUrlPanel(ctx) {
  const input = textarea({ rows: 6, placeholder: 'Text or a URL', label: 'URL input' });
  const output = outputBox('Result');
  const status = statusLine();
  const details = el('div', { class: 'dt-col' });
  let mode = 'encode';
  let full = false;

  const modeSeg = segmented(MODES, mode, (v) => { mode = v; update(); ctx.changed(); }, 'Mode');
  const wholeUrl = checkbox('Whole URL (keep : / ? # & =)', false, (v) => { full = v; update(); ctx.changed(); });

  function renderParse(r) {
    const rows = PART_LABELS
      .filter(([key]) => key === 'href' || r.parts[key] !== '')
      .map(([key, label]) => valueRow(label, r.parts[key]));
    const children = [el('div', { class: 'dt-block-head' }, [el('span', { class: 'dt-label', text: 'Parts' })]), ...rows];
    children.push(el('div', { class: 'dt-block-head' }, [el('span', { class: 'dt-label', text: `Query parameters (${r.params.length})` })]));
    if (r.params.length === 0) children.push(el('div', { class: 'dt-hint', text: 'This URL has no query parameters.' }));
    for (const p of r.params) children.push(valueRow(p.key === '' ? '(no name)' : p.key, p.value));
    details.replaceChildren(...children);
  }

  function update() {
    safeToggle();
    details.replaceChildren();
    if (!input.value.trim()) { output.set(''); status.clear(); outputWrap.hidden = mode === 'parse'; return; }
    outputWrap.hidden = mode === 'parse';
    if (mode === 'parse') {
      const r = parseUrl(input.value);
      if (!r.ok) { status.set(r.error, 'error'); return; }
      status.set(r.assumedScheme ? 'No scheme given, read as https://' : 'Parsed', r.assumedScheme ? 'info' : 'ok');
      renderParse(r);
      return;
    }
    const r = mode === 'encode' ? encodeUrlText(input.value, { full }) : decodeUrlText(input.value, { full });
    if (r.ok) { output.set(r.text); status.set(mode === 'encode' ? 'Encoded' : 'Decoded', 'ok'); }
    else { output.set(''); status.set(r.error, 'error'); }
  }
  function safeToggle() { wholeUrl.input.disabled = mode === 'parse'; }
  const live = debounce(update, 80);
  input.addEventListener('input', () => { live(); ctx.changed(); });

  const outputWrap = el('div', { class: 'dt-col' }, [output.element]);
  const element = panelShell('url', 'URL', [
    el('div', { class: 'dt-toolbar' }, [modeSeg.element, wholeUrl.element]),
    el('div', { class: 'dt-grid' }, [
      el('div', { class: 'dt-col' }, [
        el('div', { class: 'dt-block-head' }, [el('span', { class: 'dt-label', text: 'Input' })]),
        input,
        status.element,
      ]),
      el('div', { class: 'dt-col' }, [outputWrap, details]),
    ]),
  ]);

  return {
    id: 'url',
    title: 'URL',
    element,
    focus: () => input.focus(),
    getState: () => ({ input: input.value, mode, full }),
    setState(state) {
      if (typeof state?.input === 'string') input.value = state.input;
      if (MODES.some((m) => m.value === state?.mode)) { mode = state.mode; modeSeg.select(mode); }
      full = Boolean(state?.full);
      wholeUrl.input.checked = full;
      update();
    },
    destroy: () => live.cancel(),
  };
}
