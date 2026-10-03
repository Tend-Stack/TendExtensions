import { describeInstant, parseTimestampInput } from '../lib/timestamp.js';
import { button, debounce, el, segmented, textInput } from '../ui/dom.js';
import { panelShell, statusLine, valueRow } from '../ui/parts.js';

const UNITS = [
  { value: 'auto', label: 'Auto' },
  { value: 's', label: 'Seconds' },
  { value: 'ms', label: 'Milliseconds' },
];

export function createTimestampPanel(ctx) {
  const input = textInput({ placeholder: '1790000000, 1790000000000 or 2026-10-03T12:00:00Z', label: 'Unix time or date' });
  const status = statusLine();
  const rows = el('div', { class: 'dt-col' });
  let unit = 'auto';
  let ticker = null;

  const unitSeg = segmented(UNITS, unit, (v) => { unit = v; update(); ctx.changed(); }, 'Numeric unit');

  function update() {
    rows.replaceChildren();
    if (!input.value.trim()) { status.clear(); return; }
    const r = parseTimestampInput(input.value, unit);
    if (!r.ok) { status.set(r.error, 'error'); return; }
    const d = describeInstant(r.ms, {
      formatLocal: (date) => date.toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'long' }),
    });
    status.set(`Read as ${r.interpretedAs === 'date' ? 'a date' : r.interpretedAs}`, 'ok');
    rows.append(
      valueRow('Unix seconds', String(d.seconds)),
      valueRow('Unix milliseconds', String(d.milliseconds)),
      valueRow('ISO 8601 (UTC)', d.iso),
      valueRow('ISO 8601 (local)', d.localIso),
      valueRow('Local', d.local, { mono: false }),
      valueRow('UTC', d.utc, { mono: false }),
      valueRow('Relative', d.relative, { mono: false }),
    );
  }

  function setNow() {
    input.value = String(Math.floor(Date.now() / 1000));
    unit = 's';
    unitSeg.select(unit);
    update();
    ctx.changed();
    input.focus();
  }

  const live = debounce(update, 60);
  input.addEventListener('input', () => { live(); ctx.changed(); });
  input.addEventListener('keydown', (event) => { if (event.key === 'Enter') { event.preventDefault(); live.flush(); } });

  const nowLine = el('div', { class: 'dt-now', attrs: { 'aria-hidden': 'true' } });
  function tick() {
    nowLine.textContent = `Now: ${Math.floor(Date.now() / 1000)} s | ${Date.now()} ms`;
  }

  const element = panelShell('timestamp', 'Timestamp', [
    el('div', { class: 'dt-toolbar' }, [nowLine]),
    el('div', { class: 'dt-col' }, [
      el('div', { class: 'dt-block-head' }, [el('span', { class: 'dt-label', text: 'Unix time or date' })]),
      input,
      el('div', { class: 'dt-toolbar' }, [unitSeg.element, button('Now', setNow, { primary: true })]),
      status.element,
    ]),
    rows,
  ]);

  return {
    id: 'timestamp',
    title: 'Timestamp',
    element,
    focus: () => input.focus(),
    getState: () => ({ input: input.value, unit }),
    setState(state) {
      if (typeof state?.input === 'string') input.value = state.input;
      if (UNITS.some((u) => u.value === state?.unit)) { unit = state.unit; unitSeg.select(unit); }
      update();
    },
    /** The "now" line only ticks while this tab is visible. */
    activate() {
      tick();
      if (ticker === null) ticker = setInterval(tick, 1000);
      update();
    },
    deactivate() {
      if (ticker !== null) { clearInterval(ticker); ticker = null; }
    },
    destroy() {
      live.cancel();
      if (ticker !== null) { clearInterval(ticker); ticker = null; }
    },
  };
}
