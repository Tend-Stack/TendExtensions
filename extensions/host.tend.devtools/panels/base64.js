import { decodeText, encodeText } from '../lib/base64.js';
import { button, checkbox, debounce, el, segmented, textarea } from '../ui/dom.js';
import { outputBox, panelShell, statusLine } from '../ui/parts.js';

export function createBase64Panel(ctx) {
  const input = textarea({ rows: 8, placeholder: 'Text to encode, or Base64 to decode', label: 'Base64 input' });
  const output = outputBox('Result');
  const status = statusLine();
  let mode = 'encode';
  let urlSafe = false;

  const modeSeg = segmented(
    [{ value: 'encode', label: 'Encode' }, { value: 'decode', label: 'Decode' }],
    mode,
    (v) => { mode = v; update(); ctx.changed(); },
    'Direction',
  );
  const safe = checkbox('URL-safe (- _, no padding)', false, (v) => { urlSafe = v; update(); ctx.changed(); });

  function update() {
    safe.input.disabled = mode === 'decode';
    if (!input.value) { output.set(''); status.clear(); return; }
    if (mode === 'encode') {
      output.set(encodeText(input.value, { urlSafe }));
      status.set(`${new TextEncoder().encode(input.value).length} bytes encoded`, 'ok');
      return;
    }
    const r = decodeText(input.value);
    if (r.ok) { output.set(r.text); status.set('Decoded as UTF-8 text', 'ok'); }
    else { output.set(''); status.set(r.error, 'error'); }
  }
  const live = debounce(update, 80);
  input.addEventListener('input', () => { live(); ctx.changed(); });

  const swap = button('Use result as input', () => {
    const next = output.get();
    if (!next) return;
    input.value = next;
    mode = mode === 'encode' ? 'decode' : 'encode';
    modeSeg.select(mode);
    update();
    ctx.changed();
    input.focus();
  });

  const element = panelShell('base64', 'Base64', [
    el('div', { class: 'dt-toolbar' }, [modeSeg.element, safe.element]),
    el('div', { class: 'dt-grid' }, [
      el('div', { class: 'dt-col' }, [
        el('div', { class: 'dt-block-head' }, [el('span', { class: 'dt-label', text: 'Input' })]),
        input,
        el('div', { class: 'dt-toolbar' }, [swap]),
      ]),
      el('div', { class: 'dt-col' }, [output.element, status.element]),
    ]),
  ]);

  return {
    id: 'base64',
    title: 'Base64',
    element,
    focus: () => input.focus(),
    getState: () => ({ input: input.value, mode, urlSafe }),
    setState(state) {
      if (typeof state?.input === 'string') input.value = state.input;
      if (state?.mode === 'encode' || state?.mode === 'decode') { mode = state.mode; modeSeg.select(mode); }
      urlSafe = Boolean(state?.urlSafe);
      safe.input.checked = urlSafe;
      update();
    },
    destroy: () => live.cancel(),
  };
}
