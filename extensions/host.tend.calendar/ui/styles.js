/* One scoped stylesheet, injected once per panel session.
 *
 * Colours derive from the panel's own theme tokens (--color-base-100,
 * --color-base-content, --color-primary) via color-mix, the same
 * approach the calculator uses, so light and dark both get real
 * contrast without a second hand-tuned palette. The `is-dark` /
 * `is-light` class from host.theme only adjusts the handful of places
 * where a fixed alpha reads differently on each side.
 *
 * Everything is namespaced under .cal-root; nothing leaks into the
 * shell.
 */

const STYLE_ID = 'tend-ext-calendar-styles';

const CSS = `
.cal-root {
  --cal-fg: var(--color-base-content, #e6eef7);
  --cal-bg: var(--color-base-100, #0b1016);
  --cal-accent: var(--color-primary, #38bdf8);
  --cal-accent-fg: var(--color-primary-content, #04111a);
  --cal-line: color-mix(in oklab, var(--cal-fg) 14%, transparent);
  --cal-soft: color-mix(in oklab, var(--cal-fg) 6%, transparent);
  --cal-softer: color-mix(in oklab, var(--cal-fg) 4%, transparent);
  --cal-muted: color-mix(in oklab, var(--cal-fg) 60%, transparent);
  --cal-radius: 10px;
  --cal-touch: 32px;
  position: relative;
  height: 100%;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 8px;
  padding: 10px;
  box-sizing: border-box;
  overflow: hidden;
  color: var(--cal-fg);
  font-family: inherit;
  font-feature-settings: "tnum" 1;
  font-variant-numeric: tabular-nums;
}
@media (pointer: coarse) { .cal-root { --cal-touch: 44px; } }
/* 1.3.0 replaced every <select> with the calendar's own dropdown (see
 * ui/dropdown.js) because native select popups are UA/OS-rendered and
 * can't be reliably themed. The date/time inputs' native pickers are
 * the one popup still native (out of scope for that swap) — they still
 * take the OS/browser's default colour scheme unless told otherwise,
 * which renders white-on-white against dark panel tokens. Setting
 * color-scheme on the root keeps those pickers following the
 * calendar's own theme instead of the page's. */
.cal-root.is-dark { color-scheme: dark; }
.cal-root.is-light { color-scheme: light; }
.cal-root.is-light { --cal-soft: color-mix(in oklab, var(--cal-fg) 5%, transparent); }
.cal-root *, .cal-root *::before, .cal-root *::after { box-sizing: border-box; }
.cal-root button, .cal-root input, .cal-root select, .cal-root textarea { font-family: inherit; }
.cal-root :focus-visible { outline: 2px solid var(--cal-accent); outline-offset: 2px; border-radius: 6px; }

/* ---- header ---- */
.cal-header { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; min-width: 0; }
.cal-nav-group { display: flex; align-items: center; gap: 3px; flex: 0 0 auto; }
.cal-btn {
  min-height: var(--cal-touch); min-width: var(--cal-touch); padding: 0 9px;
  background: var(--cal-softer); color: var(--cal-fg);
  border: 1px solid var(--cal-line); border-radius: 999px;
  font-size: 13px; font-weight: 600; cursor: pointer;
  display: inline-flex; align-items: center; justify-content: center; gap: 4px;
  transition: background 120ms ease, color 120ms ease, transform 80ms ease;
}
.cal-btn:hover { background: var(--cal-soft); }
.cal-btn:active { transform: scale(0.97); }
.cal-btn.is-icon { padding: 0; font-size: 15px; }
.cal-btn.is-accent { background: var(--cal-accent); color: var(--cal-accent-fg); border-color: transparent; }
.cal-btn.is-accent:hover { filter: brightness(1.06); }
.cal-title-btn {
  flex: 1 1 auto; min-width: 0; text-align: left;
  background: transparent; border: 0; color: var(--cal-fg);
  font-size: 15.5px; font-weight: 700; padding: 6px 7px; border-radius: 8px;
  cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.cal-title-btn:hover { background: var(--cal-soft); }
.cal-header-spacer { flex: 1 1 auto; min-width: 4px; }
.cal-segmented {
  flex: 0 0 auto; display: grid; grid-auto-flow: column; gap: 2px; padding: 2px;
  background: var(--cal-softer); border: 1px solid var(--cal-line); border-radius: 999px;
}
.cal-segment {
  border: 0; background: transparent; color: var(--cal-muted);
  font-size: 12px; font-weight: 600; padding: 6px 8px; border-radius: 999px; cursor: pointer;
  min-height: var(--cal-touch); white-space: nowrap;
  transition: background 120ms ease, color 120ms ease;
}
.cal-segment:hover { color: var(--cal-fg); background: var(--cal-soft); }
.cal-segment[aria-selected="true"] { background: var(--cal-accent); color: var(--cal-accent-fg); }

/* ---- body / views ---- */
.cal-body { position: relative; min-height: 0; display: grid; }
.cal-view { min-height: 0; display: grid; }

/* ---- month view ---- */
.cal-month { grid-template-rows: auto minmax(0, 1fr); gap: 4px; min-height: 0; }
.cal-weekday-row, .cal-month-grid { display: grid; }
.cal-weekday-row { grid-auto-flow: column; padding: 0 1px; }
.cal-weekday-row.has-weeknum { grid-template-columns: 28px repeat(7, 1fr); }
.cal-weekday-row:not(.has-weeknum) { grid-template-columns: repeat(7, 1fr); }
.cal-weekday-cell { text-align: center; font-size: 10.5px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; color: var(--cal-muted); padding: 4px 0; }
.cal-month-grid { grid-auto-rows: minmax(0, 1fr); gap: 3px; min-height: 0; overflow: hidden; }
.cal-month-row { display: grid; gap: 3px; min-height: 0; }
.cal-month-row.has-weeknum { grid-template-columns: 28px repeat(7, 1fr); }
.cal-month-row:not(.has-weeknum) { grid-template-columns: repeat(7, 1fr); }
.cal-weeknum { display: flex; align-items: flex-start; justify-content: center; font-size: 10px; color: var(--cal-muted); padding-top: 4px; }
.cal-day-cell {
  min-height: 0; min-width: 0; display: flex; flex-direction: column; gap: 2px;
  background: var(--cal-softer); border: 1px solid var(--cal-line); border-radius: 8px;
  padding: 4px; cursor: pointer; text-align: left; color: inherit;
  overflow: hidden; transition: background 120ms ease, border-color 120ms ease;
}
.cal-day-cell:hover { background: var(--cal-soft); }
.cal-day-cell.is-outside { opacity: 0.42; }
.cal-day-cell.is-today .cal-day-num { background: var(--cal-accent); color: var(--cal-accent-fg); }
.cal-day-cell.is-focused { border-color: var(--cal-accent); }
.cal-day-num {
  width: 20px; height: 20px; border-radius: 999px; display: inline-flex;
  align-items: center; justify-content: center; font-size: 11.5px; font-weight: 700; flex: 0 0 auto;
}
.cal-day-chips { display: flex; flex-direction: column; gap: 2px; min-height: 0; overflow: hidden; }
.cal-chip {
  display: flex; align-items: center; gap: 4px; padding: 1px 5px; border-radius: 5px;
  font-size: 10.5px; line-height: 1.5; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  background: color-mix(in oklab, var(--chip-color, var(--cal-accent)) 20%, transparent);
  color: var(--cal-fg); border: 0; cursor: pointer; text-align: left; width: 100%; font-family: inherit;
}
.cal-chip:hover { background: color-mix(in oklab, var(--chip-color, var(--cal-accent)) 32%, transparent); }
.cal-chip-dot { width: 6px; height: 6px; border-radius: 999px; background: var(--chip-color, var(--cal-accent)); flex: 0 0 auto; }
.cal-chip-time { color: var(--cal-muted); flex: 0 0 auto; }
.cal-chip-title { overflow: hidden; text-overflow: ellipsis; }
.cal-more-btn { background: transparent; border: 0; color: var(--cal-muted); font-size: 10px; padding: 0 5px; cursor: pointer; text-align: left; font-family: inherit; }
.cal-more-btn:hover { color: var(--cal-fg); }

/* ---- week / day view ---- */
.cal-time-view { grid-template-rows: auto minmax(0, 1fr); gap: 0; min-height: 0; }
.cal-time-header { display: grid; border-bottom: 1px solid var(--cal-line); }
.cal-time-header-label { flex: 0 0 auto; }
.cal-time-daycol-head { text-align: center; padding: 4px 2px; }
.cal-time-daycol-head .cal-dow { font-size: 10px; text-transform: uppercase; letter-spacing: 0.04em; color: var(--cal-muted); }
.cal-time-daycol-head .cal-dom {
  font-size: 14px; font-weight: 700; width: 24px; height: 24px; border-radius: 999px;
  display: inline-flex; align-items: center; justify-content: center; margin-top: 1px;
}
.cal-time-daycol-head.is-today .cal-dom { background: var(--cal-accent); color: var(--cal-accent-fg); }
.cal-allday-row { display: grid; border-bottom: 1px solid var(--cal-line); min-height: 20px; }
.cal-allday-cell { padding: 2px; display: flex; flex-direction: column; gap: 2px; border-left: 1px solid var(--cal-line); }
.cal-allday-cell:first-child, .cal-time-col-label { border-left: 0; }
.cal-scroll-area { min-height: 0; overflow-y: auto; overscroll-behavior: contain; position: relative; }
.cal-scroll-area::-webkit-scrollbar { width: 8px; }
.cal-scroll-area::-webkit-scrollbar-thumb { background: var(--cal-line); border-radius: 8px; }
.cal-hours-grid { display: grid; position: relative; }
.cal-hour-row { display: grid; border-top: 1px solid var(--cal-line); }
.cal-hour-row:first-child { border-top: 0; }
.cal-hour-label { font-size: 10px; color: var(--cal-muted); padding: 2px 6px 0 0; text-align: right; transform: translateY(-6px); }
.cal-hour-cell { border-left: 1px solid var(--cal-line); position: relative; cursor: pointer; }
.cal-hour-cell:hover { background: var(--cal-softer); }
.cal-day-col { position: relative; }
.cal-now-line { position: absolute; left: 0; right: 0; height: 2px; background: #f87171; pointer-events: none; z-index: 3; }
.cal-now-line::before { content: ''; position: absolute; left: -4px; top: -3px; width: 8px; height: 8px; border-radius: 999px; background: #f87171; }
.cal-time-block {
  position: absolute; left: 2px; right: 2px; border-radius: 6px; padding: 2px 5px; overflow: hidden;
  background: color-mix(in oklab, var(--chip-color, var(--cal-accent)) 30%, var(--cal-bg));
  border-left: 3px solid var(--chip-color, var(--cal-accent));
  font-size: 10.5px; line-height: 1.3; cursor: pointer; text-align: left; color: inherit; font-family: inherit;
  z-index: 2;
}
.cal-time-block:hover { filter: brightness(1.08); }
.cal-time-block .cal-block-title { font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cal-time-block .cal-block-time { color: var(--cal-muted); font-size: 9.5px; }
.cal-drag-preview {
  position: absolute; left: 2px; right: 2px; border-radius: 6px;
  background: color-mix(in oklab, var(--cal-accent) 35%, transparent);
  border: 1px dashed var(--cal-accent); pointer-events: none; z-index: 4;
}

/* ---- agenda view ---- */
.cal-agenda { min-height: 0; overflow-y: auto; padding-right: 2px; }
.cal-agenda-group { margin-bottom: 10px; }
.cal-agenda-heading {
  font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;
  color: var(--cal-muted); padding: 4px 2px; position: sticky; top: 0; background: var(--cal-bg);
}
.cal-agenda-heading.is-today { color: var(--cal-accent); }
.cal-agenda-item {
  display: flex; align-items: center; gap: 8px; padding: 7px 8px; border-radius: 8px;
  background: var(--cal-softer); border: 1px solid var(--cal-line); margin-bottom: 4px;
  cursor: pointer; width: 100%; text-align: left; color: inherit; font-family: inherit;
  min-height: var(--cal-touch);
}
.cal-agenda-item:hover { background: var(--cal-soft); }
.cal-agenda-dot { width: 8px; height: 8px; border-radius: 999px; background: var(--chip-color, var(--cal-accent)); flex: 0 0 auto; }
.cal-agenda-time { font-size: 11px; color: var(--cal-muted); flex: 0 0 auto; min-width: 62px; }
.cal-agenda-main { min-width: 0; flex: 1 1 auto; }
.cal-agenda-title { font-size: 13px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cal-agenda-location { font-size: 11px; color: var(--cal-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cal-agenda-empty { padding: 24px 8px; text-align: center; color: var(--cal-muted); font-size: 13px; }

/* ---- dialogs ---- */
.cal-dialog-overlay {
  position: absolute; inset: 0; z-index: 20; display: flex; align-items: center; justify-content: center;
  background: color-mix(in oklab, black 45%, transparent); padding: 16px;
}
.cal-dialog-overlay.is-hidden { display: none; }
.cal-dialog-panel {
  background: var(--cal-bg); border: 1px solid var(--cal-line); border-radius: 14px;
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.35); padding: 16px; width: min(420px, 100%);
  max-height: 100%; overflow-y: auto; display: grid; gap: 12px;
}
.cal-dialog-panel.is-wide { width: min(560px, 100%); }
.cal-dialog-title { margin: 0; font-size: 15px; font-weight: 700; }
.cal-field { display: grid; gap: 4px; min-width: 0; }
.cal-field-label { font-size: 11px; color: var(--cal-muted); font-weight: 600; }
.cal-input, .cal-dropdown-trigger, .cal-textarea {
  width: 100%; min-width: 0; min-height: var(--cal-touch); box-sizing: border-box;
  background: var(--cal-softer); color: var(--cal-fg);
  border: 1px solid var(--cal-line); border-radius: 8px;
  padding: 6px 9px; font-size: 13px; font-family: inherit;
}
/* The date/time inputs are the one native popup left (a date picker is
 * out of scope for 1.3.0's dropdown swap) — color-scheme above gets
 * Firefox and Chromium's calendar/clock popups the rest of the way for
 * free, but the picker *glyph* Chromium/Edge draw inside the field is a
 * fixed dark-on-transparent icon that goes invisible against a dark
 * field; invert it in dark mode only. */
.cal-root.is-dark input[type="date"]::-webkit-calendar-picker-indicator,
.cal-root.is-dark input[type="time"]::-webkit-calendar-picker-indicator {
  filter: invert(1) brightness(1.6);
}
.cal-textarea { resize: vertical; min-height: 56px; line-height: 1.45; }
.cal-input:focus, .cal-textarea:focus { border-color: var(--cal-accent); outline: none; }
.cal-dropdown-trigger:focus-visible { border-color: var(--cal-accent); }

/* ---- dropdown (1.3.0 — replaces native <select>) ---- */
.cal-dropdown { position: relative; width: 100%; min-width: 0; }
.cal-dropdown-trigger { display: flex; align-items: center; justify-content: space-between; gap: 8px; text-align: left; cursor: pointer; }
.cal-dropdown-label { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cal-dropdown-chevron {
  flex: 0 0 auto; width: 7px; height: 7px; margin-top: -2px;
  border-right: 1.5px solid var(--cal-muted); border-bottom: 1.5px solid var(--cal-muted);
  transform: rotate(45deg); transition: transform 120ms ease;
}
.cal-dropdown.is-open .cal-dropdown-chevron { transform: rotate(-135deg); margin-top: 2px; }
/* Absolute within .cal-dropdown (its own positioned ancestor), never
 * against the viewport — the calendar runs in a fixed-size tool window
 * and the menu has to stay inside it; dropdown.js flips this to open
 * upward (.is-flipped) when the window doesn't have room below. */
.cal-dropdown-menu {
  position: absolute; left: 0; right: 0; top: calc(100% + 4px); z-index: 5;
  margin: 0; padding: 4px; display: grid; gap: 1px;
  max-height: 240px; overflow-y: auto;
  background: var(--cal-bg); border: 1px solid var(--cal-line); border-radius: var(--cal-radius);
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.35);
}
.cal-dropdown-menu.is-hidden { display: none; }
.cal-dropdown-menu.is-flipped { top: auto; bottom: calc(100% + 4px); }
.cal-dropdown-option {
  display: flex; align-items: center; gap: 6px; min-height: var(--cal-touch);
  padding: 6px 8px; border-radius: 6px; cursor: pointer; font-size: 13px; color: var(--cal-fg);
  font-feature-settings: "tnum" 1; font-variant-numeric: tabular-nums;
}
.cal-dropdown-option:hover, .cal-dropdown-option.is-active { background: var(--cal-softer); }
.cal-dropdown-option.is-selected { color: var(--cal-accent); font-weight: 600; }
.cal-dropdown-option-check { flex: 0 0 auto; width: 13px; text-align: center; font-size: 11px; color: var(--cal-accent); opacity: 0; }
.cal-dropdown-option.is-selected .cal-dropdown-option-check { opacity: 1; }
.cal-dropdown-option-label { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
/* The chevron's rotate transition is already covered by the file's
 * closing prefers-reduced-motion block (1ms transition-duration on
 * every .cal-root descendant), so it needs no rule of its own here. */

.cal-row { display: grid; gap: 8px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
.cal-stack { display: grid; gap: 8px; }
/* 1.5.0: Start/End are one bar split into two equal halves, date then
 * time, sharing the row's full width with a small gap. Flex, not grid:
 * when the time half is hidden (all-day), the date half should reclaim
 * its space rather than sit in a half-empty grid track. Below ~420px —
 * the same width the (non-wide) dialog panel itself caps at — the
 * halves stack instead, date above time, still full width each. */
.cal-time-inputs { display: flex; gap: 6px; min-width: 0; }
.cal-time-inputs > * { flex: 1 1 0; min-width: 0; }
@media (max-width: 420px) {
  .cal-time-inputs { flex-direction: column; }
}
/* Date/Time sub-labels inside each Start/End row (1.4.0). The Time half
 * is disabled and removed from layout (not just dimmed) while "All day"
 * is checked (1.5.0), so Date takes the full bar with no empty gap. */
.cal-time-input-group { display: grid; gap: 3px; min-width: 0; }
.cal-time-input-sublabel { font-size: 9.5px; color: var(--cal-muted); text-transform: uppercase; letter-spacing: .03em; }
.cal-time-input-group.is-hidden { display: none; }
.cal-field-error { font-size: 11.5px; color: #f87171; }
.cal-root.is-light .cal-field-error { color: #b91c1c; }
.cal-field-error.is-hidden { display: none; }
.cal-check-row { display: flex; align-items: center; gap: 7px; font-size: 12.5px; min-height: var(--cal-touch); }
.cal-check-row input { width: 17px; height: 17px; accent-color: var(--cal-accent); }
.cal-swatches { display: flex; gap: 6px; flex-wrap: wrap; }
.cal-swatch {
  width: var(--cal-touch); height: var(--cal-touch); border-radius: 999px; cursor: pointer;
  background: var(--swatch-color); border: 2px solid transparent; display: grid; place-items: center;
}
.cal-swatch[aria-pressed="true"] { border-color: var(--cal-fg); }
.cal-swatch-check { color: white; font-size: 13px; opacity: 0; }
.cal-swatch[aria-pressed="true"] .cal-swatch-check { opacity: 1; }
/* The action row sits 16px below the last field (12px panel gap + 4px
 * here) and its own buttons keep an 8px rhythm — the same numbers the
 * panel's own sheets use (frontend/src/lib/shell/HomeCanvas.svelte's
 * .sheet-form/.sheet-actions). Buttons are right-aligned like those
 * sheets; a destructive action (Delete) is pinned to the opposite edge
 * with the flex auto-margin trick rather than a separate row, so it
 * stays reachable but visually separated from Cancel/Save. */
.cal-dialog-actions { display: flex; align-items: center; justify-content: flex-end; gap: 8px; flex-wrap: wrap; margin-top: 4px; }
.cal-dialog-actions .is-danger { margin-right: auto; }
.cal-btn.is-danger { color: #f87171; }
.cal-root.is-light .cal-btn.is-danger { color: #b91c1c; }

/* ---- settings sheet ---- */
.cal-settings-section { display: grid; gap: 8px; }
.cal-settings-section h3 { margin: 4px 0 0; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: var(--cal-muted); }
.cal-integration-list { display: grid; gap: 6px; }
.cal-integration-item {
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
  padding: 8px 10px; border-radius: 8px; background: var(--cal-softer); border: 1px solid var(--cal-line);
  opacity: 0.72;
}
.cal-integration-name { font-size: 12.5px; font-weight: 600; }
.cal-integration-reason { font-size: 10.5px; color: var(--cal-muted); }
.cal-settings-actions { display: flex; gap: 8px; flex-wrap: wrap; }
.cal-settings-hint { font-size: 10.5px; color: var(--cal-muted); }

/* ---- reminders (event editor) ---- */
.cal-reminders-list { display: grid; gap: 8px; }
.cal-reminder-row {
  display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
  padding: 6px; border-radius: 8px; background: var(--cal-softer); border: 1px solid var(--cal-line);
}
.cal-reminder-preset { flex: 1 1 140px; min-width: 120px; }
.cal-reminder-custom { display: flex; gap: 6px; flex: 1 1 100%; }
.cal-reminder-custom .cal-input { width: 100%; max-width: 72px; }
.cal-reminder-custom .cal-dropdown { flex: 1 1 auto; }
.cal-reminder-channels { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.cal-reminder-channel { display: flex; align-items: center; gap: 4px; font-size: 11.5px; white-space: nowrap; }
.cal-reminder-channel input { width: 15px; height: 15px; accent-color: var(--cal-accent); }
.cal-reminder-channel.is-disabled { color: var(--cal-muted); }
.cal-reminder-hint { font-size: 9.5px; color: var(--cal-muted); flex-basis: 100%; }
.cal-reminder-remove { margin-left: auto; }
.cal-reminders-unsupported { font-size: 11px; color: var(--cal-muted); padding: 8px; border-radius: 8px; background: var(--cal-softer); border: 1px dashed var(--cal-line); }

/* ---- ICS import preview ---- */
.cal-import-summary { margin: 0; font-size: 13px; }
.cal-import-notes { margin: 0; padding-left: 18px; display: grid; gap: 4px; font-size: 11.5px; color: var(--cal-muted); max-height: 160px; overflow-y: auto; }

/* ---- month/year picker ---- */
.cal-picker-nav { display: flex; align-items: center; justify-content: space-between; }
.cal-picker-year { font-size: 14px; font-weight: 700; }
.cal-picker-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
.cal-picker-month {
  min-height: var(--cal-touch); border-radius: 8px; border: 1px solid var(--cal-line);
  background: var(--cal-softer); color: var(--cal-fg); font-size: 12.5px; cursor: pointer;
}
.cal-picker-month:hover { background: var(--cal-soft); }
.cal-picker-month[aria-current="true"] { background: var(--cal-accent); color: var(--cal-accent-fg); border-color: transparent; }

@media (prefers-reduced-motion: reduce) {
  .cal-root *, .cal-root *::before, .cal-root *::after {
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
