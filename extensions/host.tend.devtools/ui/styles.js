/* One scoped stylesheet, injected once per panel session.
 *
 * Colours derive from the panel's own theme tokens (--color-base-100,
 * --color-base-content, --color-primary) through color-mix, so light and
 * dark both keep real contrast without two hand-tuned palettes.
 * Everything is namespaced under .dt-root; nothing leaks into the shell.
 * Layout answers to the window's own width (a container query), not the
 * viewport, because the tool window is resizable.
 */

const STYLE_ID = 'tend-ext-devtools-styles';

const CSS = `
.dt-root {
  --dt-fg: var(--color-base-content, #e6eef7);
  --dt-bg: var(--color-base-100, #0b1016);
  --dt-accent: var(--color-primary, #34d399);
  --dt-accent-fg: var(--color-primary-content, #04111a);
  --dt-line: color-mix(in oklab, var(--dt-fg) 16%, transparent);
  --dt-soft: color-mix(in oklab, var(--dt-fg) 7%, transparent);
  --dt-softer: color-mix(in oklab, var(--dt-fg) 4%, transparent);
  --dt-muted: color-mix(in oklab, var(--dt-fg) 66%, transparent);
  --dt-ok: color-mix(in oklab, #22c55e 80%, var(--dt-fg));
  --dt-err: color-mix(in oklab, #ef4444 82%, var(--dt-fg));
  --dt-info: var(--dt-muted);
  --dt-mark: color-mix(in oklab, var(--dt-accent) 32%, transparent);
  --dt-mark-alt: color-mix(in oklab, #f59e0b 34%, transparent);
  --dt-radius: 10px;
  container-type: inline-size;
  container-name: dt;
  position: relative;
  height: 100%;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 8px;
  padding: 10px;
  box-sizing: border-box;
  overflow: hidden;
  color: var(--dt-fg);
  font-family: inherit;
  font-size: 13px;
  line-height: 1.4;
}
.dt-root.is-dark { color-scheme: dark; }
.dt-root.is-light { color-scheme: light; --dt-ok: color-mix(in oklab, #15803d 85%, var(--dt-fg)); --dt-err: color-mix(in oklab, #b91c1c 85%, var(--dt-fg)); }
.dt-root *, .dt-root *::before, .dt-root *::after { box-sizing: border-box; }
.dt-root :focus-visible { outline: 2px solid var(--dt-accent); outline-offset: 2px; border-radius: 6px; }
.dt-root [hidden] { display: none !important; }

/* ---- tab strip ---- */
.dt-tabs {
  display: flex; gap: 4px; padding: 3px; min-width: 0;
  overflow-x: auto; scrollbar-width: thin;
  background: var(--dt-softer); border: 1px solid var(--dt-line); border-radius: 999px;
}
.dt-tab {
  flex: 0 0 auto; border: 0; background: transparent; color: var(--dt-muted);
  font: inherit; font-size: 12px; font-weight: 600; padding: 6px 12px; border-radius: 999px;
  cursor: pointer; white-space: nowrap; transition: background 120ms ease, color 120ms ease;
}
.dt-tab:hover { color: var(--dt-fg); background: var(--dt-soft); }
.dt-tab[aria-selected="true"] { background: var(--dt-accent); color: var(--dt-accent-fg); }

/* ---- panel ---- */
.dt-body { min-height: 0; overflow: auto; padding-right: 2px; }
.dt-panel { display: grid; gap: 10px; align-content: start; outline: none; }
.dt-title { margin: 0; font-size: 15px; font-weight: 700; }
.dt-grid { display: grid; gap: 12px; grid-template-columns: minmax(0, 1fr); }
.dt-col { display: grid; gap: 6px; align-content: start; min-width: 0; }
@container dt (min-width: 640px) {
  .dt-grid { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
}
.dt-toolbar { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; min-width: 0; }
.dt-block { display: grid; gap: 4px; min-width: 0; }
.dt-block-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 26px; }
.dt-label { font-size: 11px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; color: var(--dt-muted); }
.dt-hint { font-size: 12px; color: var(--dt-muted); }
.dt-field { display: grid; gap: 4px; }

/* ---- controls ---- */
.dt-textarea, .dt-input, .dt-select, .dt-output {
  width: 100%; min-width: 0; color: inherit; background: var(--dt-softer);
  border: 1px solid var(--dt-line); border-radius: var(--dt-radius);
  padding: 8px 10px; font: inherit;
}
.dt-textarea { resize: vertical; min-height: 96px; }
.dt-input[type="number"] { width: 90px; }
.is-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace; font-size: 12.5px; }
.dt-output {
  margin: 0; min-height: 96px; max-height: 340px; overflow: auto;
  white-space: pre-wrap; overflow-wrap: anywhere; user-select: text;
}
.dt-btn {
  border: 1px solid var(--dt-line); background: var(--dt-soft); color: var(--dt-fg);
  font: inherit; font-size: 12.5px; font-weight: 600; padding: 7px 14px; min-height: 34px;
  border-radius: 999px; cursor: pointer;
  display: inline-flex; align-items: center; justify-content: center; line-height: 1.2;
}
.dt-btn:hover { background: color-mix(in oklab, var(--dt-fg) 12%, transparent); }
.dt-btn.is-primary { background: var(--dt-accent); color: var(--dt-accent-fg); border-color: transparent; }
.dt-btn.is-small { padding: 3px 10px; min-height: 26px; font-size: 11.5px; }
.dt-check { display: inline-flex; align-items: center; gap: 6px; font-size: 12.5px; cursor: pointer; min-height: 28px; }
.dt-check input { accent-color: var(--dt-accent); width: 16px; height: 16px; }
.dt-check input:disabled + span { opacity: 0.5; }
.dt-seg { display: inline-flex; gap: 2px; padding: 2px; border: 1px solid var(--dt-line); border-radius: 999px; background: var(--dt-softer); max-width: 100%; }
.dt-seg-btn { border: 0; background: transparent; color: var(--dt-muted); font: inherit; font-size: 12px; font-weight: 600; padding: 5px 12px; border-radius: 999px; cursor: pointer; white-space: nowrap; }
.dt-seg-btn[aria-checked="true"] { background: var(--dt-accent); color: var(--dt-accent-fg); }

/* ---- messages ---- */
.dt-status { min-height: 18px; font-size: 12.5px; overflow-wrap: anywhere; flex: 1 1 auto; }
.dt-status.is-ok { color: var(--dt-ok); }
.dt-status.is-error { color: var(--dt-err); font-weight: 600; }
.dt-status.is-info { color: var(--dt-info); }
.dt-banner {
  padding: 8px 12px; border-radius: var(--dt-radius); font-size: 12.5px; font-weight: 600;
  border: 1px solid color-mix(in oklab, #f59e0b 55%, transparent);
  background: color-mix(in oklab, #f59e0b 14%, transparent);
}

/* ---- key / value rows ---- */
.dt-row {
  display: grid; grid-template-columns: minmax(84px, 130px) minmax(0, 1fr) auto; gap: 8px; align-items: center;
  padding: 4px 0; border-bottom: 1px solid var(--dt-soft);
}
.dt-row-name { font-size: 12px; color: var(--dt-muted); }
.dt-row-value { overflow-wrap: anywhere; user-select: text; }
.dt-row-value.is-empty { color: var(--dt-muted); font-style: italic; }
.dt-now { font-size: 12px; color: var(--dt-muted); font-variant-numeric: tabular-nums; }
.dt-uuids { list-style: none; margin: 0; padding: 0; display: grid; gap: 2px; }
.dt-uuid { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 3px 0; border-bottom: 1px solid var(--dt-soft); }

/* ---- regex ---- */
.dt-hl { min-height: 140px; }
.dt-m { color: inherit; border-radius: 3px; }
.dt-m0 { background: var(--dt-mark); }
.dt-m1 { background: var(--dt-mark-alt); }
.dt-g0 { background: color-mix(in oklab, #3b82f6 55%, transparent); }
.dt-g1 { background: color-mix(in oklab, #ec4899 50%, transparent); }
.dt-g2 { background: color-mix(in oklab, #22c55e 50%, transparent); }
.dt-g3 { background: color-mix(in oklab, #a855f7 52%, transparent); }
.dt-match { display: grid; gap: 2px; padding-bottom: 4px; }
.dt-group { display: flex; align-items: baseline; gap: 8px; padding-left: 12px; font-size: 12px; overflow-wrap: anywhere; }
.dt-chip { flex: 0 0 auto; font-size: 11px; font-weight: 700; padding: 1px 8px; border-radius: 999px; }

@container dt (max-width: 480px) {
  .dt-root { padding: 8px; }
  .dt-row { grid-template-columns: minmax(0, 1fr) auto; }
  .dt-row-name { grid-column: 1 / -1; }
  .dt-tab { padding: 6px 10px; }
}
@media (prefers-reduced-motion: reduce) {
  .dt-root * { transition: none !important; }
}
`;

export function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = CSS;
  document.head.appendChild(style);
}
