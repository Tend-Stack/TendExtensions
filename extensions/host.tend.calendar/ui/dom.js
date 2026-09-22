/* Tiny DOM helpers, same shape as the calculator's `ui/dom.js`. No
 * framework; `text` always goes through textContent so nothing here
 * can turn user-typed event titles or notes into markup. */

/** Create an element. `options` accepts class/text/attrs/dataset/
 *  style/on, and `children` is appended in order. */
export function el(tag, options = {}, children = []) {
  const node = document.createElement(tag);
  if (options.class) node.className = options.class;
  if (options.text !== undefined) node.textContent = String(options.text);
  if (options.attrs) {
    for (const [key, value] of Object.entries(options.attrs)) {
      if (value === null || value === undefined || value === false) continue;
      node.setAttribute(key, value === true ? '' : String(value));
    }
  }
  if (options.dataset) {
    for (const [key, value] of Object.entries(options.dataset)) {
      if (value !== null && value !== undefined) node.dataset[key] = String(value);
    }
  }
  if (options.style) {
    for (const [key, value] of Object.entries(options.style)) {
      if (value === null || value === undefined) continue;
      if (key.startsWith('--')) node.style.setProperty(key, String(value));
      else node.style[key] = value;
    }
  }
  if (options.on) {
    for (const [event, handler] of Object.entries(options.on)) node.addEventListener(event, handler);
  }
  for (const child of [].concat(children)) {
    if (child === null || child === undefined || child === false) continue;
    node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
  }
  return node;
}

export function button(spec) {
  return el('button', {
    class: spec.class ?? 'cal-btn',
    text: spec.text,
    attrs: { type: 'button', 'aria-label': spec.aria ?? spec.text, title: spec.title ?? null },
    on: spec.on,
  });
}

export function clear(node) {
  node.replaceChildren();
  return node;
}

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/** A modal overlay with a focus trap, Escape-to-close, and
 *  click-outside-to-close. Returns `{ element, open(), close(), isOpen() }`.
 *  `render(body)` builds the panel's contents once. */
export function createDialog({ label, onClose, render }) {
  let lastFocus = null;
  const panel = el('div', { class: 'cal-dialog-panel', attrs: { role: 'dialog', 'aria-modal': 'true', 'aria-label': label } });
  const overlay = el('div', {
    class: 'cal-dialog-overlay',
    attrs: { tabindex: '-1' },
    on: {
      mousedown: (event) => { if (event.target === overlay) close(); },
      keydown: (event) => {
        if (event.key === 'Escape') { event.preventDefault(); close(); return; }
        if (event.key !== 'Tab') return;
        const focusable = [...panel.querySelectorAll(FOCUSABLE)].filter((n) => n.offsetParent !== null);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      },
    },
  }, [panel]);
  overlay.classList.add('is-hidden');

  function open(body) {
    clear(panel);
    lastFocus = document.activeElement;
    render(panel, body);
    overlay.classList.remove('is-hidden');
    requestAnimationFrame(() => {
      const focusable = panel.querySelector(FOCUSABLE);
      (focusable ?? panel).focus?.();
    });
  }

  function close() {
    if (overlay.classList.contains('is-hidden')) return;
    overlay.classList.add('is-hidden');
    onClose?.();
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  }

  return { element: overlay, open, close, isOpen: () => !overlay.classList.contains('is-hidden') };
}
