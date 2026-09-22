/* Pure, DOM-free logic behind ui/dropdown.js — the calendar's own
 * accessible replacement for <select> (1.3.0; see README for why native
 * popups were dropped). Kept separate so the option-matching, keyboard
 * navigation and open/close transitions are unit-testable without a
 * browser (tests/js/host.tend.calendar/dropdown-logic.test.js).
 *
 * `options` is always the flat `{ value, label }[]` list dropdown.js
 * renders as `role="option"` rows. `state` is `{ open, activeIndex }`.
 */

/** Index of the option whose `value` matches, or -1 if none/none given. */
export function indexOfValue(options, value) {
  if (!options.length) return -1;
  return options.findIndex((opt) => opt.value === value);
}

/** Clamp an index into [0, options.length - 1]; an empty list is always -1. */
export function clampIndex(options, index) {
  if (!options.length) return -1;
  if (index < 0) return 0;
  if (index > options.length - 1) return options.length - 1;
  return index;
}

/** Move `index` for one of the navigation keys. ArrowDown/ArrowUp wrap
 *  (a list of options is a ring); Home/End jump without wrapping; any
 *  other key returns the clamped index unchanged. */
export function moveIndex(options, index, key) {
  if (!options.length) return -1;
  const last = options.length - 1;
  const base = clampIndex(options, index);
  switch (key) {
    case 'ArrowDown': return base >= last ? 0 : base + 1;
    case 'ArrowUp': return base <= 0 ? last : base - 1;
    case 'Home': return 0;
    case 'End': return last;
    default: return base;
  }
}

/** Type-ahead: the index of the next option whose label starts with
 *  `query` (case-insensitive), searching forward from just after
 *  `fromIndex` and wrapping around once so it also matches at or before
 *  `fromIndex`. Returns -1 when nothing matches or `query` is empty. */
export function typeAheadIndex(options, fromIndex, query) {
  if (!options.length || !query) return -1;
  const needle = query.toLowerCase();
  const n = options.length;
  const anchor = fromIndex >= 0 ? fromIndex : -1;
  for (let step = 1; step <= n; step++) {
    const idx = ((anchor + step) % n + n) % n;
    if (String(options[idx].label).toLowerCase().startsWith(needle)) return idx;
  }
  return -1;
}

const OPEN_KEYS = new Set(['Enter', ' ', 'ArrowDown', 'ArrowUp']);
const MOVE_KEYS = new Set(['ArrowDown', 'ArrowUp', 'Home', 'End']);

/** The dropdown's open/close + active-option state machine. `key` is a
 *  DOM `KeyboardEvent.key` value, or the synthetic `'Toggle'` a trigger
 *  click sends. `selectedValue` seeds `activeIndex` when a closed
 *  dropdown opens (so opening starts on the current selection, not
 *  always the first row).
 *
 *  Returns `{ state, commit, closeOnly }`:
 *   - `state` is the next `{ open, activeIndex }`.
 *   - `commit` is the option to select (`{ value, label }`) when Enter/
 *     Space is pressed on an open dropdown, else `null`.
 *   - `closeOnly` is true for Tab: close without the caller re-focusing
 *     the trigger, since focus is already moving on by itself. */
export function reduceDropdown(state, key, options, selectedValue) {
  if (!state.open) {
    if (key === 'Toggle' || OPEN_KEYS.has(key)) {
      const seed = clampIndex(options, indexOfValue(options, selectedValue));
      return { state: { open: true, activeIndex: seed }, commit: null, closeOnly: false };
    }
    return { state, commit: null, closeOnly: false };
  }

  if (MOVE_KEYS.has(key)) {
    return { state: { open: true, activeIndex: moveIndex(options, state.activeIndex, key) }, commit: null, closeOnly: false };
  }
  if (key === 'Enter' || key === ' ') {
    const option = options[state.activeIndex] ?? null;
    return { state: { open: false, activeIndex: state.activeIndex }, commit: option, closeOnly: false };
  }
  if (key === 'Escape' || key === 'Toggle') {
    return { state: { open: false, activeIndex: state.activeIndex }, commit: null, closeOnly: false };
  }
  if (key === 'Tab') {
    return { state: { open: false, activeIndex: state.activeIndex }, commit: null, closeOnly: true };
  }
  return { state, commit: null, closeOnly: false };
}
