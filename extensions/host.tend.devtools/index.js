/* Developer Tools: schema-2 native ESM extension, no bundler, no network.
 *
 * `activate(host)` installs the scoped stylesheet once and returns
 * `{ mount, unmount }`. `mount(container)` builds a tab strip and the
 * active tool inside the tool window the manifest asks for.
 *
 * Layout of the source:
 *   lib/      pure helpers (no DOM, no host), covered by tests/js
 *   panels/   one module per tool, each returning
 *             { id, title, element, focus, getState, setState, ... }
 *   ui/       DOM helpers, shared blocks, clipboard, the stylesheet
 *   store.js  write-behind cache over host.storage
 *
 * Tools are built the first time their tab is shown. Only the last tool
 * and the options and inputs of each tool are stored; JWTs and the text
 * being hashed are credentials and are never written.
 */
import { ensureStyles } from './ui/styles.js';
import { el } from './ui/dom.js';
import { createStore } from './store.js';
import { createJsonPanel } from './panels/json.js';
import { createBase64Panel } from './panels/base64.js';
import { createUrlPanel } from './panels/url.js';
import { createJwtPanel } from './panels/jwt.js';
import { createHashPanel } from './panels/hash.js';
import { createUuidPanel } from './panels/uuid.js';
import { createTimestampPanel } from './panels/timestamp.js';
import { createRegexPanel } from './panels/regex.js';

const TOOLS = [
  { id: 'json', label: 'JSON', create: createJsonPanel },
  { id: 'base64', label: 'Base64', create: createBase64Panel },
  { id: 'url', label: 'URL', create: createUrlPanel },
  { id: 'jwt', label: 'JWT', create: createJwtPanel },
  { id: 'hash', label: 'Hash', create: createHashPanel },
  { id: 'uuid', label: 'UUID', create: createUuidPanel },
  { id: 'timestamp', label: 'Timestamp', create: createTimestampPanel },
  { id: 'regex', label: 'Regex', create: createRegexPanel },
];

/** Keep one tool's saved text from growing the stored blob without bound. */
const MAX_SAVED_CHARS = 50000;

function trimState(state) {
  const out = {};
  for (const [key, value] of Object.entries(state ?? {})) {
    out[key] = typeof value === 'string' && value.length > MAX_SAVED_CHARS ? value.slice(0, MAX_SAVED_CHARS) : value;
  }
  return out;
}

export default function activate(host) {
  ensureStyles();
  const store = createStore(host);
  const built = new Map();
  let saved = { tool: 'json', tools: {} };
  let activeId = null;
  let root = null;
  let tabList = null;
  let body = null;
  let keydownHandler = null;
  const tabs = new Map();

  function persist() {
    const tools = { ...saved.tools };
    for (const [id, panel] of built) tools[id] = trimState(panel.getState());
    saved = { tool: activeId ?? saved.tool, tools };
    store.save(saved);
  }

  const ctx = { changed: persist };

  function panelFor(id) {
    if (built.has(id)) return built.get(id);
    const spec = TOOLS.find((t) => t.id === id) ?? TOOLS[0];
    const panel = spec.create(ctx);
    built.set(spec.id, panel);
    const state = saved.tools?.[spec.id];
    if (state && typeof state === 'object') panel.setState(state);
    else panel.setState({});
    return panel;
  }

  function select(id, options = {}) {
    const spec = TOOLS.find((t) => t.id === id) ?? TOOLS[0];
    if (activeId === spec.id && body.firstChild) return;
    if (activeId) built.get(activeId)?.deactivate?.();
    activeId = spec.id;
    const panel = panelFor(spec.id);
    body.replaceChildren(panel.element);
    body.scrollTop = 0;
    for (const [key, tab] of tabs) {
      const on = key === spec.id;
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
      if (on) tab.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
    }
    panel.activate?.();
    if (options.focus) panel.focus?.();
    persist();
  }

  function buildShell() {
    tabList = el('div', { class: 'dt-tabs', attrs: { role: 'tablist', 'aria-label': 'Developer tools' } });
    TOOLS.forEach((tool, index) => {
      const tab = el('button', {
        class: 'dt-tab',
        text: tool.label,
        attrs: {
          type: 'button', role: 'tab', id: `dt-tab-${tool.id}`, 'aria-controls': `dt-panel-${tool.id}`,
          'aria-selected': 'false', title: `${tool.label} (Alt+${index + 1})`,
        },
        on: { click: () => select(tool.id) },
      });
      tabs.set(tool.id, tab);
      tabList.appendChild(tab);
    });
    tabList.addEventListener('keydown', (event) => {
      const ids = TOOLS.map((t) => t.id);
      const at = ids.indexOf(activeId);
      let next = null;
      if (event.key === 'ArrowRight') next = ids[(at + 1) % ids.length];
      else if (event.key === 'ArrowLeft') next = ids[(at - 1 + ids.length) % ids.length];
      else if (event.key === 'Home') next = ids[0];
      else if (event.key === 'End') next = ids[ids.length - 1];
      if (!next) return;
      event.preventDefault();
      select(next);
      tabs.get(next).focus();
    });
    body = el('div', { class: 'dt-body' });
    root = el('div', {
      class: `dt-root ${host.theme?.isDark === false ? 'is-light' : 'is-dark'}`,
      attrs: { role: 'application', 'aria-label': 'Developer Tools' },
    }, [tabList, body]);
  }

  function onKeydown(event) {
    if (!root || !root.isConnected) return;
    if (!event.altKey || event.ctrlKey || event.metaKey) return;
    const index = Number(event.key);
    if (Number.isInteger(index) && index >= 1 && index <= TOOLS.length) {
      event.preventDefault();
      select(TOOLS[index - 1].id, { focus: true });
    }
  }

  return {
    async mount(container) {
      buildShell();
      container.replaceChildren(root);
      const stored = await store.load({});
      if (stored && typeof stored === 'object') {
        saved = { tool: typeof stored.tool === 'string' ? stored.tool : 'json', tools: stored.tools && typeof stored.tools === 'object' ? stored.tools : {} };
      }
      const first = TOOLS.some((t) => t.id === saved.tool) ? saved.tool : 'json';
      select(first);
      keydownHandler = onKeydown;
      window.addEventListener('keydown', keydownHandler);
    },
    unmount() {
      if (keydownHandler) {
        window.removeEventListener('keydown', keydownHandler);
        keydownHandler = null;
      }
      persist();
      store.flushNow();
      for (const panel of built.values()) { panel.deactivate?.(); panel.destroy?.(); }
      built.clear();
      tabs.clear();
      activeId = null;
    },
  };
}
