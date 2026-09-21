/* Calculator — schema-2 extension, native ESM, no bundler.
 *
 * `activate(host)` is the panel's hook: it installs the scoped
 * stylesheet once and returns `{ mount, unmount }`. `mount(container)`
 * builds the shell — a mode switcher, the active mode's panel, and a
 * slide-in history tape — inside the fixed tool window the manifest
 * asks for. Nothing here resizes the window or goes full screen.
 *
 * Layout of the source:
 *   engine/      tokenizer, Pratt parser, AST evaluator, formatting,
 *                fixed-width integer maths, statistics, finance
 *   converters/  offline unit tables and the user-owned rate table
 *   modes/       one module per mode, each returning a small object
 *                with { element, handleKey, resultText, load, destroy }
 *   ui/          DOM helpers, the stylesheet, clipboard, history tape
 *   store.js     write-behind cache over host.storage
 *
 * Every mode is created lazily the first time it is selected, so
 * opening the calculator costs one keypad, not seven.
 */
import { ensureStyles } from './ui/styles.js';
import { el, segmented } from './ui/dom.js';
import { copyText } from './ui/clipboard.js';
import { createTape, HISTORY_KEY } from './ui/history.js';
import { createStore } from './store.js';
import { ANGLE_MODES } from './engine/evaluate.js';
import { createStandardMode } from './modes/standard.js';
import { createScientificMode } from './modes/scientific.js';
import { createGraphingMode } from './modes/graphing.js';
import { createProgrammerMode } from './modes/programmer.js';
import { createStatisticsMode } from './modes/statistics.js';
import { createFinancialMode } from './modes/financial.js';
import { createConvertersMode, CURRENCY_KEY } from './modes/converters.js';

const PREFS_KEY = 'prefs.v1';
/** Keys big enough to deserve their own storage entry rather than
 *  riding along in the preferences blob. */
const RAW_KEYS = new Set([HISTORY_KEY, CURRENCY_KEY]);

const MODES = [
  { id: 'standard', label: 'Std', title: 'Standard', create: createStandardMode },
  { id: 'scientific', label: 'Sci', title: 'Scientific', create: createScientificMode },
  { id: 'graphing', label: 'Graph', title: 'Graphing', create: createGraphingMode },
  { id: 'programmer', label: 'Prog', title: 'Programmer', create: createProgrammerMode },
  { id: 'statistics', label: 'Stats', title: 'Statistics', create: createStatisticsMode },
  { id: 'financial', label: 'Fin', title: 'Financial', create: createFinancialMode },
  { id: 'converters', label: 'Conv', title: 'Converters', create: createConvertersMode },
];

export default function activate(host) {
  ensureStyles();

  const store = createStore(host);
  let prefs = {};
  let activeId = 'standard';
  let active = null;
  const built = new Map();

  let root = null;
  let bodyEl = null;
  let switcher = null;
  let tape = null;
  let tapeButton = null;
  let keydownHandler = null;

  /** Preferences are one storage key; only the tape and the rate table
   *  get their own, because only they can grow. */
  const prefStore = {
    peek(key, fallback) {
      if (RAW_KEYS.has(key)) return store.peek(key, fallback);
      return Object.prototype.hasOwnProperty.call(prefs, key) ? prefs[key] : fallback;
    },
    set(key, value) {
      if (RAW_KEYS.has(key)) { store.set(key, value); return; }
      prefs = { ...prefs, [key]: value };
      store.set(PREFS_KEY, prefs);
    },
    load(key, fallback) {
      if (RAW_KEYS.has(key)) return store.load(key, fallback);
      return Promise.resolve(prefStore.peek(key, fallback));
    },
  };

  const ctx = {
    host,
    store: prefStore,
    copy: copyText,
    getAns: () => Number(prefStore.peek('ans', 0)) || 0,
    setAns(value) {
      if (Number.isFinite(value)) prefStore.set('ans', value);
    },
    getMemory: () => {
      const stored = prefStore.peek('memory', null);
      return typeof stored === 'number' ? stored : null;
    },
    setMemory(value) {
      prefStore.set('memory', typeof value === 'number' && Number.isFinite(value) ? value : null);
    },
    getAngle: () => {
      const stored = prefStore.peek('angle', 'deg');
      return ANGLE_MODES.includes(stored) ? stored : 'deg';
    },
    setAngle(value) {
      if (ANGLE_MODES.includes(value)) prefStore.set('angle', value);
    },
    commit(entry) {
      tape?.push(entry);
    },
  };

  function modeFor(id) {
    if (built.has(id)) return built.get(id);
    const spec = MODES.find((item) => item.id === id) ?? MODES[0];
    const instance = spec.create(ctx);
    instance.title = spec.title;
    built.set(spec.id, instance);
    return instance;
  }

  function selectMode(id, options = {}) {
    const next = modeFor(id);
    if (active === next) return;
    activeId = next.id;
    bodyEl.replaceChildren(next.element, tape.element);
    active = next;
    switcher.select(activeId);
    prefStore.set('mode', activeId);
    next.refresh?.();
    next.activate?.();
    if (id === 'converters') next.hydrate?.();
    if (options.focus !== false) next.focus?.();
  }

  /** Load a tape entry into whichever mode can accept it. */
  function useEntry(entry, what) {
    tape.close();
    active?.load?.(entry, what);
    active?.refresh?.();
  }

  function buildShell() {
    switcher = segmented(
      MODES.map((mode) => ({ id: mode.id, label: mode.label, title: mode.title })),
      activeId,
      (id) => selectMode(id),
      'Calculator mode',
    );
    tapeButton = el('button', {
      class: 'calc-icon-button',
      text: '☰',
      attrs: {
        type: 'button', 'aria-label': 'Toggle history tape',
        title: 'History (Ctrl+H)', 'aria-pressed': 'false',
      },
      on: { click: () => tape.toggle() },
    });
    bodyEl = el('div', { class: 'calc-body' });
    root = el('div', {
      class: `calc-root ${host.theme?.isDark === false ? 'is-light' : 'is-dark'}`,
      attrs: { role: 'application', 'aria-label': 'Calculator' },
    }, [
      el('div', { class: 'calc-toolbar' }, [switcher.element, tapeButton]),
      bodyEl,
    ]);
  }

  async function copyActiveResult() {
    const text = active?.resultText?.() ?? '';
    if (!text) return;
    const ok = await copyText(text);
    tapeButton.title = ok ? 'Copied the result' : 'Copy was refused';
    setTimeout(() => { tapeButton.title = 'History (Ctrl+H)'; }, 1500);
  }

  function onKeydown(event) {
    if (!root || !root.isConnected) return;
    const accel = event.ctrlKey || event.metaKey;

    if (accel && !event.altKey) {
      if (event.key.toLowerCase() === 'h') { event.preventDefault(); tape.toggle(); return; }
      if (event.key.toLowerCase() === 'c' && !window.getSelection()?.toString()) {
        event.preventDefault();
        copyActiveResult();
        return;
      }
      const index = Number(event.key);
      if (Number.isInteger(index) && index >= 1 && index <= MODES.length) {
        event.preventDefault();
        selectMode(MODES[index - 1].id);
        return;
      }
      return;
    }

    if (event.key === 'Escape' && tape.isOpen()) { event.preventDefault(); tape.close(); return; }

    const target = event.target;
    const typing = target instanceof HTMLInputElement
      || target instanceof HTMLTextAreaElement
      || target instanceof HTMLSelectElement;
    // Space and Enter belong to whatever button has focus.
    if ((event.key === 'Enter' || event.key === ' ') && target instanceof HTMLButtonElement) return;
    if (typing && !(event.key === 'Escape')) return;
    if (event.key.startsWith('Arrow') && target instanceof HTMLButtonElement) return;

    if (active?.handleKey?.(event)) event.preventDefault();
  }

  return {
    async mount(container) {
      buildShell();
      container.replaceChildren(root);

      prefs = await store.load(PREFS_KEY, {});
      if (!prefs || typeof prefs !== 'object') prefs = {};

      tape = createTape({
        store: prefStore,
        onUse: useEntry,
        onToggle: (open) => tapeButton.setAttribute('aria-pressed', String(open)),
      });
      await tape.hydrate();

      const saved = prefStore.peek('mode', 'standard');
      activeId = MODES.some((mode) => mode.id === saved) ? saved : 'standard';
      switcher.select(activeId);
      selectMode(activeId, { focus: false });

      keydownHandler = onKeydown;
      window.addEventListener('keydown', keydownHandler);
    },
    unmount() {
      if (keydownHandler) {
        window.removeEventListener('keydown', keydownHandler);
        keydownHandler = null;
      }
      for (const instance of built.values()) instance.destroy?.();
      built.clear();
      active = null;
      store.flushNow();
    },
  };
}
