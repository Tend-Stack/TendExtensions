import { MAX_INPUT_CHARS, buildSegments, runRegex } from '../lib/regex-guard.js';
import { checkbox, debounce, el, textInput, textarea } from '../ui/dom.js';
import { panelShell, statusLine } from '../ui/parts.js';

const FLAGS = [
  ['i', 'Ignore case'],
  ['m', 'Multiline'],
  ['s', 'Dot matches newline'],
  ['u', 'Unicode'],
];
const MAX_ROWS = 100;

export function createRegexPanel(ctx) {
  const pattern = textInput({ placeholder: '(\\w+)@(\\w+)\\.com', label: 'Pattern' });
  const text = textarea({ rows: 6, placeholder: 'Test text', label: 'Test text' });
  const status = statusLine();
  const preview = el('pre', { class: 'dt-output is-mono dt-hl', attrs: { tabindex: '0', 'aria-label': 'Highlighted matches' } });
  const table = el('div', { class: 'dt-col' });
  const flags = new Set();
  const counter = el('span', { class: 'dt-hint' });

  const flagBoxes = FLAGS.map(([flag, label]) => {
    const box = checkbox(`${flag}  ${label}`, flags.has(flag), (on) => {
      if (on) flags.add(flag); else flags.delete(flag);
      update();
      ctx.changed();
    });
    return { flag, ...box };
  });

  function update() {
    table.replaceChildren();
    counter.textContent = `${text.value.length.toLocaleString('en-US')} / ${MAX_INPUT_CHARS.toLocaleString('en-US')} characters`;
    const subject = text.value;
    const r = runRegex(pattern.value, [...flags].join(''), subject);
    if (!r.ok) {
      preview.textContent = subject;
      status.set(r.message, 'error');
      return;
    }
    if (!pattern.value) { preview.textContent = subject; status.clear(); return; }
    const segments = buildSegments(subject, r.matches);
    preview.replaceChildren(...segments.map((s) => {
      if (s.match < 0) return document.createTextNode(s.text);
      const cls = s.group ? `dt-m dt-g${(s.group - 1) % 4}` : `dt-m dt-m${s.match % 2}`;
      return el('mark', { class: cls, text: s.text });
    }));
    const n = r.matches.length;
    status.set(`${n}${r.truncated ? '+' : ''} match${n === 1 ? '' : 'es'}${r.truncated ? ' (stopped at 1,000)' : ''}`, n ? 'ok' : 'info');
    const head = el('div', { class: 'dt-block-head' }, [el('span', { class: 'dt-label', text: 'Matches' })]);
    const rows = r.matches.slice(0, MAX_ROWS).map((m, i) => {
      const groupLines = m.groups.map((g) => el('div', { class: 'dt-group' }, [
        el('span', { class: `dt-chip dt-g${(g.number - 1) % 4}`, text: g.name ? `${g.number} ${g.name}` : String(g.number) }),
        el('code', { class: 'is-mono', text: g.text === null ? '(did not participate)' : g.text === '' ? '(empty)' : g.text }),
      ]));
      return el('div', { class: 'dt-match' }, [
        el('div', { class: 'dt-row' }, [
          el('span', { class: 'dt-row-name', text: `#${i + 1} at ${m.index}` }),
          el('code', { class: 'dt-row-value is-mono', text: m.text === '' ? '(empty match)' : m.text }),
        ]),
        ...groupLines,
      ]);
    });
    table.replaceChildren(head, ...rows);
    if (r.matches.length > MAX_ROWS) table.appendChild(el('div', { class: 'dt-hint', text: `Showing the first ${MAX_ROWS} of ${r.matches.length}.` }));
  }

  const live = debounce(update, 120);
  pattern.addEventListener('input', () => { live(); ctx.changed(); });
  text.addEventListener('input', () => { live(); ctx.changed(); });

  const element = panelShell('regex', 'Regex', [
    el('div', { class: 'dt-col' }, [
      el('div', { class: 'dt-block-head' }, [el('span', { class: 'dt-label', text: 'Pattern (JavaScript syntax, global)' })]),
      pattern,
      el('div', { class: 'dt-toolbar' }, flagBoxes.map((b) => b.element)),
    ]),
    el('div', { class: 'dt-grid' }, [
      el('div', { class: 'dt-col' }, [
        el('div', { class: 'dt-block-head' }, [el('span', { class: 'dt-label', text: 'Test text' }), counter]),
        text,
        status.element,
      ]),
      el('div', { class: 'dt-col' }, [
        el('div', { class: 'dt-block-head' }, [el('span', { class: 'dt-label', text: 'Highlighted' })]),
        preview,
      ]),
    ]),
    table,
  ]);

  return {
    id: 'regex',
    title: 'Regex',
    element,
    focus: () => pattern.focus(),
    getState: () => ({ pattern: pattern.value, text: text.value.slice(0, MAX_INPUT_CHARS), flags: [...flags].join('') }),
    setState(state) {
      if (typeof state?.pattern === 'string') pattern.value = state.pattern;
      if (typeof state?.text === 'string') text.value = state.text;
      if (typeof state?.flags === 'string') {
        flags.clear();
        for (const f of state.flags) if (FLAGS.some(([k]) => k === f)) flags.add(f);
        for (const b of flagBoxes) b.input.checked = flags.has(b.flag);
      }
      update();
    },
    destroy: () => live.cancel(),
  };
}
