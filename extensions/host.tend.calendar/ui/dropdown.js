/* The calendar's own accessible dropdown — replaces every native
 * <select> (1.3.0). Native select *popups* are UA/OS-rendered and
 * cannot be reliably themed (macOS ignores <option> colours outright;
 * Chromium/Firefox on Linux vary) — 1.2.0's color-scheme + <option>
 * colour approach still left the popup unreadable on a real browser.
 * This widget is ordinary DOM styled with the calendar's own --cal-*
 * tokens instead, so nothing depends on how the browser paints a popup.
 *
 * A single focusable trigger (`role="combobox"`) plus a `role="listbox"`
 * of `role="option"` rows; the active row is tracked with
 * `aria-activedescendant` rather than moving DOM focus into the list,
 * same pattern the ARIA APG uses for a "select-only" combobox. Keyboard
 * and open/close state transitions live in ./dropdown-logic.js as plain
 * functions so they're unit-tested without a DOM; this module owns the
 * elements, event wiring and menu positioning.
 */
import { el, clear } from './dom.js';
import { indexOfValue, clampIndex, typeAheadIndex, reduceDropdown } from './dropdown-logic.js';

let uid = 0;
function nextId(prefix) {
  uid += 1;
  return `${prefix}-${uid}`;
}

const NAV_KEYS = new Set(['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' ']);
const TYPEAHEAD_RESET_MS = 700;

export function createDropdown({ options, value, onChange, ariaLabel, id }) {
  let opts = options.slice();
  let current = value;
  let state = { open: false, activeIndex: clampIndex(opts, indexOfValue(opts, current)) };
  let typeBuffer = '';
  let typeTimer = null;
  let docListenerAttached = false;

  const baseId = id ?? nextId('cal-dropdown');
  const menuId = `${baseId}-listbox`;

  const label = el('span', { class: 'cal-dropdown-label' });
  const chevron = el('span', { class: 'cal-dropdown-chevron', attrs: { 'aria-hidden': 'true' } });
  const trigger = el('button', {
    class: 'cal-dropdown-trigger',
    attrs: {
      type: 'button',
      id: `${baseId}-trigger`,
      role: 'combobox',
      'aria-haspopup': 'listbox',
      'aria-expanded': 'false',
      'aria-controls': menuId,
      'aria-label': ariaLabel ?? null,
    },
    on: { click: () => transition('Toggle'), keydown: onKeyDown },
  }, [label, chevron]);
  const menu = el('div', {
    class: 'cal-dropdown-menu is-hidden',
    attrs: { role: 'listbox', id: menuId, tabindex: '-1' },
  });
  const wrap = el('div', { class: 'cal-dropdown' }, [trigger, menu]);

  function onDocMouseDown(event) {
    if (wrap.contains(event.target)) return;
    applyState({ open: false, activeIndex: state.activeIndex });
  }

  function renderOptions() {
    clear(menu);
    opts.forEach((opt, i) => {
      const row = el('div', {
        class: `cal-dropdown-option${opt.value === current ? ' is-selected' : ''}`,
        attrs: { role: 'option', id: `${baseId}-option-${i}`, 'aria-selected': String(opt.value === current) },
        on: {
          mousedown: (event) => event.preventDefault(),
          mouseenter: () => setActive(i, false),
          click: () => applyCommit(opt),
        },
      }, [
        el('span', { class: 'cal-dropdown-option-check', text: '✓', attrs: { 'aria-hidden': 'true' } }),
        el('span', { class: 'cal-dropdown-option-label', text: opt.label }),
      ]);
      menu.appendChild(row);
    });
    syncActiveClasses();
  }

  function syncActiveClasses() {
    const rows = menu.children;
    for (let i = 0; i < rows.length; i++) rows[i].classList.toggle('is-active', i === state.activeIndex);
  }

  function updateLabel() {
    const found = opts.find((opt) => opt.value === current);
    label.textContent = found ? found.label : '';
  }

  function setActive(index, scroll = true) {
    state = { ...state, activeIndex: clampIndex(opts, index) };
    syncActiveClasses();
    const activeRow = menu.children[state.activeIndex];
    if (activeRow) {
      trigger.setAttribute('aria-activedescendant', activeRow.id);
      if (scroll) activeRow.scrollIntoView({ block: 'nearest' });
    }
  }

  function positionMenu() {
    menu.classList.remove('is-flipped');
    const root = wrap.closest('.cal-root');
    const boundary = (root ?? document.body).getBoundingClientRect();
    const triggerRect = trigger.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();
    const spaceBelow = boundary.bottom - triggerRect.bottom;
    const spaceAbove = triggerRect.top - boundary.top;
    if (menuRect.height > spaceBelow && spaceAbove > spaceBelow) menu.classList.add('is-flipped');
  }

  function applyState(next) {
    const wasOpen = state.open;
    state = next;
    if (state.open && !wasOpen) {
      menu.classList.remove('is-hidden');
      wrap.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      positionMenu();
      if (!docListenerAttached) { document.addEventListener('mousedown', onDocMouseDown, true); docListenerAttached = true; }
    }
    if (!state.open && wasOpen) {
      menu.classList.add('is-hidden');
      menu.classList.remove('is-flipped');
      wrap.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.removeAttribute('aria-activedescendant');
      resetTypeAhead();
      if (docListenerAttached) { document.removeEventListener('mousedown', onDocMouseDown, true); docListenerAttached = false; }
    }
    syncActiveClasses();
    if (state.open) {
      const activeRow = menu.children[state.activeIndex];
      if (activeRow) { trigger.setAttribute('aria-activedescendant', activeRow.id); activeRow.scrollIntoView({ block: 'nearest' }); }
    }
  }

  function applyCommit(option) {
    applyState({ open: false, activeIndex: state.activeIndex });
    if (!option) return;
    if (option.value !== current) {
      current = option.value;
      updateLabel();
      renderOptions();
      onChange?.(current);
    }
    trigger.focus();
  }

  function transition(key) {
    const { state: next, commit, closeOnly } = reduceDropdown(state, key, opts, current);
    if (commit) { applyCommit(commit); return; }
    applyState(next);
    if (key === 'Escape' && !next.open) trigger.focus();
    if (closeOnly) { /* Tab: focus is already moving on; nothing to restore */ }
  }

  function resetTypeAhead() {
    typeBuffer = '';
    if (typeTimer) { clearTimeout(typeTimer); typeTimer = null; }
  }

  function handleTypeAhead(char) {
    if (typeTimer) clearTimeout(typeTimer);
    typeBuffer += char.toLowerCase();
    const anchor = typeBuffer.length > 1 ? -1 : state.activeIndex;
    const idx = typeAheadIndex(opts, anchor, typeBuffer);
    if (idx !== -1) applyState({ open: true, activeIndex: idx });
    typeTimer = setTimeout(resetTypeAhead, TYPEAHEAD_RESET_MS);
  }

  function onKeyDown(event) {
    const key = event.key;
    if (key === 'Tab') { transition('Tab'); return; }
    if (NAV_KEYS.has(key)) { event.preventDefault(); transition(key); return; }
    if (key === 'Escape') {
      // Only claim Escape while open — and stop it there, so it closes
      // this dropdown instead of bubbling into a containing dialog's
      // own Escape-to-close (dom.js's createDialog).
      if (!state.open) return;
      event.preventDefault();
      event.stopPropagation();
      transition('Escape');
      return;
    }
    if (state.open && key.length === 1 && /\S/.test(key)) {
      event.preventDefault();
      handleTypeAhead(key);
    }
  }

  renderOptions();
  updateLabel();

  const api = {
    element: wrap,
    setValue(v) {
      current = v;
      state = { ...state, activeIndex: clampIndex(opts, indexOfValue(opts, current)) };
      updateLabel();
      renderOptions();
    },
    setOptions(list) {
      opts = list.slice();
      state = { ...state, activeIndex: clampIndex(opts, indexOfValue(opts, current)) };
      updateLabel();
      renderOptions();
    },
    destroy() {
      if (docListenerAttached) { document.removeEventListener('mousedown', onDocMouseDown, true); docListenerAttached = false; }
      resetTypeAhead();
    },
  };
  Object.defineProperty(api, 'value', { get: () => current, enumerable: true });
  return api;
}
