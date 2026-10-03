/* Tiny DOM helpers. No framework, no HTML strings: `text` always goes
 * through textContent, so user data can never become markup. */

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
  if (options.on) {
    for (const [event, handler] of Object.entries(options.on)) node.addEventListener(event, handler);
  }
  for (const child of [].concat(children)) {
    if (child === null || child === undefined || child === false) continue;
    node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
  }
  return node;
}

let uid = 0;
export function nextId(prefix = 'dt') {
  uid += 1;
  return `${prefix}-${uid}`;
}

export function debounce(fn, ms) {
  let timer = null;
  const wrapped = (...args) => {
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(() => { timer = null; fn(...args); }, ms);
  };
  wrapped.cancel = () => { if (timer !== null) { clearTimeout(timer); timer = null; } };
  wrapped.flush = (...args) => { wrapped.cancel(); fn(...args); };
  return wrapped;
}

/** A labelled control wrapper. */
export function field(label, control, hint) {
  const id = nextId('dt-f');
  if (control.id === '') control.id = id;
  return el('div', { class: 'dt-field' }, [
    el('label', { class: 'dt-label', text: label, attrs: { for: control.id } }),
    control,
    hint ? el('div', { class: 'dt-hint', text: hint }) : null,
  ]);
}

export function button(label, onClick, options = {}) {
  return el('button', {
    class: `dt-btn${options.primary ? ' is-primary' : ''}${options.class ? ` ${options.class}` : ''}`,
    text: label,
    attrs: { type: 'button', title: options.title ?? null, 'aria-label': options.aria ?? null },
    on: { click: onClick },
  });
}

export function textarea(options = {}) {
  return el('textarea', {
    class: `dt-textarea${options.mono === false ? '' : ' is-mono'}`,
    attrs: {
      rows: options.rows ?? 8,
      placeholder: options.placeholder ?? null,
      readonly: options.readonly ?? false,
      spellcheck: 'false',
      autocomplete: 'off',
      autocapitalize: 'off',
      autocorrect: 'off',
      'aria-label': options.label ?? null,
    },
  });
}

export function textInput(options = {}) {
  return el('input', {
    class: `dt-input${options.mono === false ? '' : ' is-mono'}`,
    attrs: {
      type: options.type ?? 'text',
      placeholder: options.placeholder ?? null,
      spellcheck: 'false',
      autocomplete: 'off',
      autocapitalize: 'off',
      min: options.min ?? null,
      max: options.max ?? null,
      'aria-label': options.label ?? null,
    },
  });
}

export function checkbox(label, checked, onChange) {
  const input = el('input', { attrs: { type: 'checkbox' }, on: { change: () => onChange(input.checked) } });
  input.checked = Boolean(checked);
  const wrap = el('label', { class: 'dt-check' }, [input, el('span', { text: label })]);
  return { element: wrap, input };
}

export function select(options, value, onChange, label) {
  const node = el('select', {
    class: 'dt-select',
    attrs: { 'aria-label': label ?? null },
    on: { change: () => onChange(node.value) },
  }, options.map((o) => el('option', { text: o.label, attrs: { value: o.value } })));
  node.value = value;
  return node;
}

/** A pill-shaped single choice (role=radiogroup). */
export function segmented(options, value, onChange, label) {
  const buttons = new Map();
  const root = el('div', { class: 'dt-seg', attrs: { role: 'radiogroup', 'aria-label': label } });
  function select(id, notify) {
    for (const [key, node] of buttons) {
      node.setAttribute('aria-checked', String(key === id));
      node.tabIndex = key === id ? 0 : -1;
    }
    if (notify) onChange(id);
  }
  for (const option of options) {
    const node = el('button', {
      class: 'dt-seg-btn',
      text: option.label,
      attrs: { type: 'button', role: 'radio', 'aria-checked': 'false' },
      on: { click: () => select(option.value, true) },
    });
    buttons.set(option.value, node);
    root.appendChild(node);
  }
  root.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    const ids = options.map((o) => o.value);
    const current = ids.findIndex((id) => buttons.get(id).getAttribute('aria-checked') === 'true');
    const step = event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 1;
    const nextId = ids[(current + step + ids.length) % ids.length];
    event.preventDefault();
    select(nextId, true);
    buttons.get(nextId).focus();
  });
  select(value, false);
  return { element: root, select: (id) => select(id, false), get: () => options.find((o) => buttons.get(o.value).getAttribute('aria-checked') === 'true')?.value };
}
