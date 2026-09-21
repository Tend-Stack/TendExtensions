/* One scoped stylesheet, injected once per panel session.
 *
 * Colours derive from the panel's own theme tokens (--color-base-100,
 * --color-base-content, --color-primary) via color-mix, so light and
 * dark both get real contrast without two hand-tuned palettes. The
 * `is-dark` / `is-light` class from host.theme only adjusts the few
 * places where a fixed alpha reads differently on each side.
 *
 * Everything is namespaced under .calc-root; nothing leaks into the
 * shell.
 */

const STYLE_ID = 'tend-ext-calculator-styles';

const CSS = `
.calc-root {
  --calc-fg: var(--color-base-content, #e6eef7);
  --calc-bg: var(--color-base-100, #0b1016);
  --calc-accent: var(--color-primary, #34d399);
  --calc-accent-fg: var(--color-primary-content, #04111a);
  --calc-line: color-mix(in oklab, var(--calc-fg) 16%, transparent);
  --calc-soft: color-mix(in oklab, var(--calc-fg) 7%, transparent);
  --calc-softer: color-mix(in oklab, var(--calc-fg) 4%, transparent);
  --calc-muted: color-mix(in oklab, var(--calc-fg) 62%, transparent);
  --calc-radius: 10px;
  --calc-gap: 6px;
  position: relative;
  height: 100%;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 8px;
  padding: 10px;
  box-sizing: border-box;
  overflow: hidden;
  color: var(--calc-fg);
  font-family: inherit;
  font-feature-settings: "tnum" 1;
  font-variant-numeric: tabular-nums;
}
.calc-root.is-light { --calc-soft: color-mix(in oklab, var(--calc-fg) 6%, transparent); }
.calc-root *, .calc-root *::before, .calc-root *::after { box-sizing: border-box; }
.calc-root button { font-family: inherit; }
.calc-root :focus-visible {
  outline: 2px solid var(--calc-accent);
  outline-offset: 2px;
  border-radius: 6px;
}

/* ---- top toolbar ---- */
.calc-toolbar { display: flex; gap: 6px; align-items: stretch; min-width: 0; }
.calc-segmented {
  flex: 1 1 auto; min-width: 0;
  display: grid; gap: 2px; padding: 2px;
  background: var(--calc-softer);
  border: 1px solid var(--calc-line);
  border-radius: 999px;
}
.calc-segment {
  border: 0; background: transparent; color: var(--calc-muted);
  font-size: 10.5px; font-weight: 600; letter-spacing: 0.02em;
  padding: 5px 2px; border-radius: 999px; cursor: pointer;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  transition: background 120ms ease, color 120ms ease;
}
.calc-segment:hover { color: var(--calc-fg); background: var(--calc-soft); }
.calc-segment[aria-selected="true"] {
  background: var(--calc-accent); color: var(--calc-accent-fg);
}
.calc-icon-button {
  flex: 0 0 auto;
  min-width: 34px; padding: 0 8px;
  background: var(--calc-softer); color: var(--calc-muted);
  border: 1px solid var(--calc-line); border-radius: 999px;
  font-size: 13px; cursor: pointer;
  transition: background 120ms ease, color 120ms ease;
}
.calc-icon-button:hover { background: var(--calc-soft); color: var(--calc-fg); }
.calc-icon-button[aria-pressed="true"] { background: var(--calc-accent); color: var(--calc-accent-fg); border-color: transparent; }
.calc-icon-button.is-small { min-width: 26px; padding: 2px 6px; font-size: 12px; }

/* ---- mode body ---- */
.calc-body { position: relative; min-height: 0; display: grid; }
.calc-mode {
  min-height: 0; display: grid; gap: 8px;
  grid-template-rows: auto minmax(0, 1fr);
}
.calc-mode.is-stacked { grid-template-rows: auto; align-content: start; overflow-y: auto; }
.calc-scroll { min-height: 0; overflow-y: auto; overscroll-behavior: contain; }
.calc-scroll::-webkit-scrollbar { width: 8px; }
.calc-scroll::-webkit-scrollbar-thumb { background: var(--calc-line); border-radius: 8px; }

/* ---- display ---- */
.calc-display {
  background: var(--calc-softer);
  border: 1px solid var(--calc-line);
  border-radius: 14px;
  padding: 10px 12px;
  display: flex; flex-direction: column; gap: 2px;
  text-align: right;
  min-height: 78px;
}
.calc-expression {
  font-size: 14px; color: var(--calc-muted);
  min-height: 18px; line-height: 1.3;
  overflow-x: auto; white-space: nowrap; text-align: right;
  scrollbar-width: none;
}
.calc-expression::-webkit-scrollbar { height: 0; }
.calc-value {
  font-size: 34px; font-weight: 300; line-height: 1.12;
  letter-spacing: -0.01em; word-break: break-all;
}
.calc-value[data-len="10"], .calc-value[data-len="11"], .calc-value[data-len="12"] { font-size: 29px; }
.calc-value[data-len="13"], .calc-value[data-len="14"], .calc-value[data-len="15"] { font-size: 24px; }
.calc-value[data-len="16"], .calc-value[data-len="17"] { font-size: 21px; }
.calc-value.is-overflow { font-size: 18px; }
.calc-error {
  font-size: 12px; color: #f87171; min-height: 15px; text-align: right;
}
.calc-root.is-light .calc-error { color: #b91c1c; }
.calc-hint { font-size: 11px; color: var(--calc-muted); }

/* ---- keys ---- */
.calc-grid { display: grid; gap: var(--calc-gap); grid-auto-rows: minmax(34px, 1fr); min-height: 0; }
.calc-key {
  background: var(--calc-soft); color: var(--calc-fg);
  border: 1px solid transparent; border-radius: var(--calc-radius);
  font-size: 17px; font-weight: 500; cursor: pointer;
  user-select: none; -webkit-user-select: none;
  display: flex; align-items: center; justify-content: center;
  transition: transform 80ms ease, background 120ms ease;
  padding: 0 2px; min-width: 0;
}
.calc-key i { font-style: italic; font-weight: 400; }
.calc-key sup, .calc-key sub { font-size: 0.66em; }
.calc-key:hover { background: color-mix(in oklab, var(--calc-fg) 12%, transparent); }
.calc-key:active, .calc-key.is-pressed { transform: scale(0.96); }
.calc-key.fn { background: var(--calc-softer); color: var(--calc-muted); font-size: 14px; }
.calc-key.fn:hover { color: var(--calc-fg); }
.calc-key.op {
  background: color-mix(in oklab, var(--calc-accent) 18%, transparent);
  color: var(--calc-accent); font-size: 18px;
}
.calc-key.op:hover { background: color-mix(in oklab, var(--calc-accent) 30%, transparent); }
.calc-key.eq { background: var(--calc-accent); color: var(--calc-accent-fg); font-weight: 600; }
.calc-key.is-armed { background: var(--calc-accent); color: var(--calc-accent-fg); }
.calc-key[disabled] { opacity: 0.38; cursor: default; }
.calc-key.is-shifted { color: var(--calc-accent); }

.calc-memrow { display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px; }
.calc-mem {
  background: transparent; color: var(--calc-muted); border: 0;
  padding: 5px 0; border-radius: 8px; font-size: 11px; cursor: pointer;
}
.calc-mem:hover:not([disabled]) { background: var(--calc-soft); color: var(--calc-fg); }
.calc-mem[disabled] { opacity: 0.35; cursor: default; }

/* ---- form controls ---- */
.calc-field { display: grid; gap: 3px; min-width: 0; }
.calc-field-label { font-size: 11px; color: var(--calc-muted); }
.calc-field-input { display: flex; align-items: center; gap: 4px; min-width: 0; }
.calc-field-suffix { font-size: 11px; color: var(--calc-muted); flex: 0 0 auto; }
.calc-input, .calc-select, .calc-textarea {
  width: 100%; min-width: 0;
  background: var(--calc-softer); color: var(--calc-fg);
  border: 1px solid var(--calc-line); border-radius: 8px;
  padding: 6px 8px; font-size: 13px; font-family: inherit;
}
.calc-textarea { resize: none; line-height: 1.45; font-size: 13px; }
.calc-input:focus, .calc-select:focus, .calc-textarea:focus { border-color: var(--calc-accent); outline: none; }
.calc-select option { background: var(--calc-bg); color: var(--calc-fg); }
.calc-row { display: grid; gap: 8px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
.calc-row.is-three { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.calc-stack { display: grid; gap: 8px; align-content: start; }
.calc-chip {
  background: var(--calc-soft); color: var(--calc-fg);
  border: 1px solid var(--calc-line); border-radius: 999px;
  padding: 4px 10px; font-size: 11px; cursor: pointer; white-space: nowrap;
}
.calc-chip:hover { background: color-mix(in oklab, var(--calc-fg) 13%, transparent); }
.calc-chip.is-danger { color: #f87171; }
.calc-root.is-light .calc-chip.is-danger { color: #b91c1c; }
.calc-chip[aria-pressed="true"] { background: var(--calc-accent); color: var(--calc-accent-fg); border-color: transparent; }
.calc-chiprow { display: flex; flex-wrap: wrap; gap: 5px; align-items: center; }
.calc-section {
  border: 1px solid var(--calc-line); border-radius: 12px;
  padding: 9px; display: grid; gap: 7px; background: var(--calc-softer);
}
.calc-section h3 { margin: 0; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: var(--calc-muted); }
.calc-note { font-size: 10.5px; line-height: 1.45; color: var(--calc-muted); margin: 0; }

/* ---- readouts ---- */
.calc-readout { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 2px 10px; margin: 0; font-size: 12.5px; }
.calc-readout dt { color: var(--calc-muted); }
.calc-readout dd { margin: 0; text-align: right; word-break: break-all; }
.calc-readout dd.is-strong { font-weight: 600; color: var(--calc-accent); }

/* ---- programmer ---- */
.calc-bases { display: grid; gap: 3px; }
.calc-base-row {
  display: grid; grid-template-columns: 34px minmax(0, 1fr);
  align-items: center; gap: 8px;
  padding: 3px 6px; border-radius: 8px; cursor: pointer;
  background: transparent; border: 1px solid transparent; color: inherit;
  text-align: left; font-family: inherit;
}
.calc-base-row:hover { background: var(--calc-soft); }
.calc-base-row[aria-selected="true"] { background: var(--calc-soft); border-color: var(--calc-line); }
.calc-base-tag { font-size: 10px; font-weight: 700; color: var(--calc-muted); letter-spacing: 0.06em; }
.calc-base-value { font-size: 15px; text-align: right; overflow-x: auto; white-space: nowrap; scrollbar-width: none; }
.calc-base-value::-webkit-scrollbar { height: 0; }
.calc-bits { display: grid; grid-template-columns: repeat(8, minmax(0, 1fr)); gap: 2px; }
.calc-bit {
  aspect-ratio: 1 / 1; min-height: 0; padding: 0;
  background: var(--calc-softer); color: var(--calc-muted);
  border: 1px solid var(--calc-line); border-radius: 4px;
  font-size: 10px; cursor: pointer; line-height: 1;
}
.calc-bit[aria-pressed="true"] { background: var(--calc-accent); color: var(--calc-accent-fg); border-color: transparent; }

/* ---- graph ---- */
.calc-canvas-wrap { position: relative; min-height: 0; border: 1px solid var(--calc-line); border-radius: 12px; overflow: hidden; background: var(--calc-softer); }
.calc-canvas { display: block; width: 100%; height: 100%; touch-action: none; cursor: crosshair; }
.calc-trace {
  position: absolute; left: 6px; bottom: 6px;
  background: color-mix(in oklab, var(--calc-bg) 82%, transparent);
  border: 1px solid var(--calc-line); border-radius: 8px;
  padding: 3px 7px; font-size: 11px; pointer-events: none;
}
.calc-legend { display: flex; flex-wrap: wrap; gap: 8px; font-size: 11px; color: var(--calc-muted); }
.calc-legend span { display: inline-flex; align-items: center; gap: 4px; }
.calc-swatch { width: 10px; height: 3px; border-radius: 2px; display: inline-block; }

/* ---- amortization table ---- */
.calc-table { width: 100%; border-collapse: collapse; font-size: 11.5px; }
.calc-table th, .calc-table td { padding: 3px 5px; text-align: right; white-space: nowrap; }
.calc-table th { position: sticky; top: 0; background: var(--calc-bg); color: var(--calc-muted); font-weight: 600; font-size: 10.5px; }
.calc-table tbody tr:nth-child(odd) { background: var(--calc-softer); }

/* ---- history tape ---- */
.calc-tape {
  position: absolute; inset: 0 0 0 auto;
  width: min(72%, 300px);
  display: grid; grid-template-rows: auto minmax(0, 1fr) auto;
  background: color-mix(in oklab, var(--calc-bg) 94%, var(--calc-fg));
  border-left: 1px solid var(--calc-line);
  border-radius: 12px 0 0 12px;
  box-shadow: -12px 0 28px rgba(0, 0, 0, 0.28);
  transform: translateX(102%);
  visibility: hidden;
  transition: transform 220ms ease, visibility 220ms;
  z-index: 5;
}
.calc-tape.is-open { transform: translateX(0); visibility: visible; }
.calc-tape-head { display: flex; align-items: center; justify-content: space-between; gap: 6px; padding: 8px 8px 4px; }
.calc-tape-title { margin: 0; font-size: 12px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: var(--calc-muted); }
.calc-tape-list { overflow-y: auto; padding: 0 8px; display: grid; gap: 5px; align-content: start; }
.calc-tape-empty { margin: 0; padding: 10px; font-size: 11.5px; color: var(--calc-muted); }
.calc-tape-row { display: grid; gap: 1px; padding: 5px 6px; border-radius: 8px; background: var(--calc-softer); }
.calc-tape-meta { display: flex; justify-content: space-between; font-size: 9.5px; color: var(--calc-muted); text-transform: uppercase; letter-spacing: 0.05em; }
.calc-tape-bottom { display: flex; align-items: center; justify-content: space-between; gap: 6px; }
.calc-tape-expr, .calc-tape-result {
  background: transparent; border: 0; color: inherit; cursor: pointer;
  text-align: right; padding: 0; font-family: inherit;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 100%;
}
.calc-tape-expr { font-size: 11.5px; color: var(--calc-muted); }
.calc-tape-result { font-size: 15px; font-weight: 500; flex: 1 1 auto; }
.calc-tape-expr:hover, .calc-tape-result:hover { color: var(--calc-accent); }
.calc-tape-foot { display: flex; gap: 5px; justify-content: flex-end; padding: 6px 8px 8px; border-top: 1px solid var(--calc-line); }

.calc-copy-fallback { position: fixed; left: -9999px; top: 0; opacity: 0; }

@media (prefers-reduced-motion: reduce) {
  .calc-root *, .calc-root *::before, .calc-root *::after {
    transition-duration: 1ms !important;
    animation-duration: 1ms !important;
  }
}
`;

export function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = CSS;
  document.head.appendChild(style);
}

/** Plot colours, picked to stay legible on both themes. */
export const SERIES_COLORS = ['#34d399', '#60a5fa', '#f472b6', '#fbbf24', '#a78bfa', '#fb7185'];
