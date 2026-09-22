// Pure-module tests for extensions/host.tend.calendar/ui/dropdown-logic.js
// — the keyboard/open-close state machine behind ui/dropdown.js (1.3.0's
// replacement for native <select>). No DOM: these are plain functions
// over `{ value, label }[]` option lists and `{ open, activeIndex }`
// state. Run with `bun test tests/js` from the repo root.
import { describe, expect, test } from 'bun:test';
import {
  clampIndex,
  indexOfValue,
  moveIndex,
  reduceDropdown,
  typeAheadIndex,
} from '../../../extensions/host.tend.calendar/ui/dropdown-logic.js';

const OPTIONS = [
  { value: 'month', label: 'Month' },
  { value: 'week', label: 'Week' },
  { value: 'day', label: 'Day' },
  { value: 'agenda', label: 'Agenda' },
];

describe('indexOfValue', () => {
  test('finds the matching option', () => {
    expect(indexOfValue(OPTIONS, 'day')).toBe(2);
    expect(indexOfValue(OPTIONS, 'month')).toBe(0);
  });

  test('returns -1 for a value not present, or an empty list', () => {
    expect(indexOfValue(OPTIONS, 'year')).toBe(-1);
    expect(indexOfValue([], 'month')).toBe(-1);
  });
});

describe('clampIndex', () => {
  test('leaves an in-range index alone', () => {
    expect(clampIndex(OPTIONS, 2)).toBe(2);
  });

  test('clamps below 0 to 0, and past the end to the last index', () => {
    expect(clampIndex(OPTIONS, -1)).toBe(0);
    expect(clampIndex(OPTIONS, -50)).toBe(0);
    expect(clampIndex(OPTIONS, 4)).toBe(3);
    expect(clampIndex(OPTIONS, 99)).toBe(3);
  });

  test('an empty list always clamps to -1', () => {
    expect(clampIndex([], 0)).toBe(-1);
    expect(clampIndex([], 5)).toBe(-1);
  });
});

describe('moveIndex', () => {
  test('ArrowDown/ArrowUp move by one', () => {
    expect(moveIndex(OPTIONS, 0, 'ArrowDown')).toBe(1);
    expect(moveIndex(OPTIONS, 1, 'ArrowUp')).toBe(0);
  });

  test('ArrowDown wraps from the last option to the first', () => {
    expect(moveIndex(OPTIONS, 3, 'ArrowDown')).toBe(0);
  });

  test('ArrowUp wraps from the first option to the last', () => {
    expect(moveIndex(OPTIONS, 0, 'ArrowUp')).toBe(3);
  });

  test('Home jumps to the first option, End to the last, from anywhere', () => {
    expect(moveIndex(OPTIONS, 2, 'Home')).toBe(0);
    expect(moveIndex(OPTIONS, 0, 'End')).toBe(3);
    expect(moveIndex(OPTIONS, 1, 'End')).toBe(3);
  });

  test('an unrelated key returns the clamped index unchanged', () => {
    expect(moveIndex(OPTIONS, 2, 'Escape')).toBe(2);
    expect(moveIndex(OPTIONS, -5, 'Escape')).toBe(0);
  });

  test('an empty list always moves to -1', () => {
    expect(moveIndex([], 0, 'ArrowDown')).toBe(-1);
  });
});

describe('typeAheadIndex', () => {
  test('matches a label prefix, case-insensitively', () => {
    expect(typeAheadIndex(OPTIONS, -1, 'd')).toBe(2); // Day
    expect(typeAheadIndex(OPTIONS, -1, 'D')).toBe(2);
    expect(typeAheadIndex(OPTIONS, -1, 'we')).toBe(1); // Week
  });

  test('searches forward from just after fromIndex and wraps around once', () => {
    // Two options start with "M"/"m" isn't the case here, but two share
    // no prefix — use a list with a repeated leading letter to prove
    // the forward-then-wrap order.
    const options = [
      { value: 'a', label: 'Monday' },
      { value: 'b', label: 'Month' },
      { value: 'c', label: 'Tuesday' },
    ];
    expect(typeAheadIndex(options, 0, 'mo')).toBe(1); // next match after index 0
    expect(typeAheadIndex(options, 1, 'mo')).toBe(0); // wraps back to index 0
  });

  test('returns -1 when nothing matches, or the query/list is empty', () => {
    expect(typeAheadIndex(OPTIONS, -1, 'z')).toBe(-1);
    expect(typeAheadIndex(OPTIONS, -1, '')).toBe(-1);
    expect(typeAheadIndex([], -1, 'd')).toBe(-1);
  });
});

describe('reduceDropdown — open/close transitions', () => {
  const closed = { open: false, activeIndex: -1 };

  test('Toggle opens a closed dropdown, seeded on the current value', () => {
    const { state, commit, closeOnly } = reduceDropdown(closed, 'Toggle', OPTIONS, 'day');
    expect(state).toEqual({ open: true, activeIndex: 2 });
    expect(commit).toBeNull();
    expect(closeOnly).toBe(false);
  });

  test('Enter, Space, ArrowDown and ArrowUp all open a closed dropdown too', () => {
    for (const key of ['Enter', ' ', 'ArrowDown', 'ArrowUp']) {
      const { state } = reduceDropdown(closed, key, OPTIONS, 'week');
      expect(state).toEqual({ open: true, activeIndex: 1 });
    }
  });

  test('opening with a value not in the options seeds index 0', () => {
    const { state } = reduceDropdown(closed, 'Toggle', OPTIONS, 'nope');
    expect(state.activeIndex).toBe(0);
  });

  test('an unrelated key on a closed dropdown is a no-op', () => {
    const result = reduceDropdown(closed, 'a', OPTIONS, 'day');
    expect(result).toEqual({ state: closed, commit: null, closeOnly: false });
  });

  test('ArrowDown/ArrowUp/Home/End move the active option while open', () => {
    const open = { open: true, activeIndex: 1 };
    expect(reduceDropdown(open, 'ArrowDown', OPTIONS).state).toEqual({ open: true, activeIndex: 2 });
    expect(reduceDropdown(open, 'ArrowUp', OPTIONS).state).toEqual({ open: true, activeIndex: 0 });
    expect(reduceDropdown(open, 'Home', OPTIONS).state).toEqual({ open: true, activeIndex: 0 });
    expect(reduceDropdown(open, 'End', OPTIONS).state).toEqual({ open: true, activeIndex: 3 });
  });

  test('movement wraps at the ends while open', () => {
    expect(reduceDropdown({ open: true, activeIndex: 3 }, 'ArrowDown', OPTIONS).state.activeIndex).toBe(0);
    expect(reduceDropdown({ open: true, activeIndex: 0 }, 'ArrowUp', OPTIONS).state.activeIndex).toBe(3);
  });

  test('Enter/Space commit the active option and close', () => {
    const open = { open: true, activeIndex: 2 };
    const { state, commit, closeOnly } = reduceDropdown(open, 'Enter', OPTIONS);
    expect(state).toEqual({ open: false, activeIndex: 2 });
    expect(commit).toEqual({ value: 'day', label: 'Day' });
    expect(closeOnly).toBe(false);
    expect(reduceDropdown(open, ' ', OPTIONS).commit).toEqual({ value: 'day', label: 'Day' });
  });

  test('Escape closes without committing', () => {
    const { state, commit } = reduceDropdown({ open: true, activeIndex: 1 }, 'Escape', OPTIONS);
    expect(state).toEqual({ open: false, activeIndex: 1 });
    expect(commit).toBeNull();
  });

  test('Tab closes without committing and flags closeOnly', () => {
    const { state, commit, closeOnly } = reduceDropdown({ open: true, activeIndex: 1 }, 'Tab', OPTIONS);
    expect(state).toEqual({ open: false, activeIndex: 1 });
    expect(commit).toBeNull();
    expect(closeOnly).toBe(true);
  });

  test('Toggle while open closes without committing', () => {
    const { state, commit } = reduceDropdown({ open: true, activeIndex: 1 }, 'Toggle', OPTIONS);
    expect(state).toEqual({ open: false, activeIndex: 1 });
    expect(commit).toBeNull();
  });

  test('an unrelated key while open leaves state untouched', () => {
    const open = { open: true, activeIndex: 2 };
    const result = reduceDropdown(open, 'a', OPTIONS);
    expect(result).toEqual({ state: open, commit: null, closeOnly: false });
  });
});
