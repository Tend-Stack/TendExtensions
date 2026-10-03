import { describeError, formatJson, minifyJson, parseJson } from '../lib/json-tools.js';
import { button, checkbox, debounce, el, segmented, textarea } from '../ui/dom.js';
import { outputBox, panelShell, statusLine } from '../ui/parts.js';

const INDENTS = [
  { value: '2', label: '2 spaces' },
  { value: '4', label: '4 spaces' },
  { value: 'tab', label: 'Tab' },
];

export function createJsonPanel(ctx) {
  const input = textarea({ rows: 12, placeholder: '{"paste": "JSON here"}', label: 'JSON input' });
  const output = outputBox('Result');
  const status = statusLine();
  let indent = '2';
  let sortKeys = false;
  let lastError = null;

  const indentSeg = segmented(INDENTS, indent, (v) => { indent = v; ctx.changed(); }, 'Indent');
  const sort = checkbox('Sort keys', false, (v) => { sortKeys = v; ctx.changed(); });

  function show(result, okText) {
    if (result.ok) {
      lastError = null;
      output.set(result.text ?? '');
      status.set(okText, 'ok');
    } else {
      lastError = result.error;
      // The result must describe the current input; never leave an older
      // valid output next to an error.
      output.set('');
      status.set(describeError(result.error), 'error');
    }
    goTo.element.hidden = !lastError;
  }

  const goTo = { element: button('Go to error', () => {
    if (!lastError) return;
    input.focus();
    input.setSelectionRange(lastError.index, Math.min(input.value.length, lastError.index + 1));
  }, { class: 'is-small' }) };
  goTo.element.hidden = true;

  const run = (fn, okText) => () => show(fn(input.value, { indent, sortKeys }), okText);
  const doFormat = run(formatJson, 'Formatted');
  const doMinify = run(minifyJson, 'Minified');
  const validate = () => {
    const r = parseJson(input.value);
    if (r.ok) { lastError = null; status.set('Valid JSON', 'ok'); goTo.element.hidden = true; }
    else show(r);
  };
  const liveValidate = debounce(() => {
    if (!input.value.trim()) { status.clear(); goTo.element.hidden = true; lastError = null; return; }
    validate();
  }, 250);

  input.addEventListener('input', () => { liveValidate(); ctx.changed(); });
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) { event.preventDefault(); doFormat(); }
  });

  const element = panelShell('json', 'JSON', [
    el('div', { class: 'dt-grid' }, [
      el('div', { class: 'dt-col' }, [
        el('div', { class: 'dt-block-head' }, [el('span', { class: 'dt-label', text: 'Input' })]),
        input,
        el('div', { class: 'dt-toolbar' }, [
          button('Format', doFormat, { primary: true, title: 'Format (Ctrl+Enter)' }),
          button('Minify', doMinify),
          button('Validate', validate),
          button('Clear', () => { input.value = ''; output.set(''); status.clear(); goTo.element.hidden = true; ctx.changed(); input.focus(); }),
        ]),
        el('div', { class: 'dt-toolbar' }, [indentSeg.element, sort.element]),
        el('div', { class: 'dt-toolbar' }, [status.element, goTo.element]),
      ]),
      el('div', { class: 'dt-col' }, [output.element]),
    ]),
  ]);

  return {
    id: 'json',
    title: 'JSON',
    element,
    focus: () => input.focus(),
    getState: () => ({ input: input.value, indent, sortKeys }),
    setState(state) {
      if (typeof state?.input === 'string') input.value = state.input;
      if (INDENTS.some((i) => i.value === state?.indent)) { indent = state.indent; indentSeg.select(indent); }
      sortKeys = Boolean(state?.sortKeys);
      sort.input.checked = sortKeys;
      if (input.value.trim()) validate();
    },
    destroy: () => liveValidate.cancel(),
  };
}
