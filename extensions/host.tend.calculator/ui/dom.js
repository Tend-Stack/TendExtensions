/* Tiny DOM helpers.
 *
 * No framework and no template strings holding user data: `text` always
 * goes through textContent, and the only `html` values in this
 * extension are author-written literals for superscripts (x², 10ˣ).
 */

/** Create an element. `options` accepts class/text/html/attrs/dataset/
 *  style/on, and `children` is appended in order. */
export function el(tag, options = {}, children = []) {
  const node = document.createElement(tag);
  if (options.class) node.className = options.class;
  if (options.text !== undefined) node.textContent = String(options.text);
  if (options.html !== undefined) node.innerHTML = options.html;
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
  if (options.style) Object.assign(node.style, options.style);
  if (options.on) {
    for (const [event, handler] of Object.entries(options.on)) {
      node.addEventListener(event, handler);
    }
  }
  for (const child of [].concat(children)) {
    if (child === null || child === undefined || child === false) continue;
    node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
  }
  return node;
}

/** A keypad button. `spec.label` may be plain text or `spec.html` for
 *  the few labels that need a superscript. */
export function key(spec) {
  const classes = ['calc-key'];
  if (spec.variant) classes.push(spec.variant);
  if (spec.class) classes.push(spec.class);
  return el('button', {
    class: classes.join(' '),
    text: spec.html ? undefined : spec.label,
    html: spec.html,
    attrs: {
      type: 'button',
      'aria-label': spec.aria ?? spec.label ?? spec.key,
      title: spec.title ?? null,
      style: spec.span ? `grid-column: span ${spec.span}` : null,
    },
    dataset: { key: spec.key },
  });
}

/** Build a keypad grid from rows of button specs. */
export function keypad(rows, columns, options = {}) {
  const grid = el('div', {
    class: `calc-grid ${options.class ?? ''}`.trim(),
    attrs: { role: 'group', 'aria-label': options.label ?? 'Keypad' },
    style: { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` },
    dataset: { columns },
  });
  for (const row of rows) {
    for (const spec of row) {
      if (!spec) continue;
      grid.appendChild(key(spec));
    }
  }
  attachGridNavigation(grid, columns);
  return grid;
}

/** Arrow-key roving focus across a keypad. Column count comes from the
 *  layout rather than geometry, so a spanning key simply lands on its
 *  own index and the walk stays predictable. */
export function attachGridNavigation(grid, columns) {
  grid.addEventListener('keydown', (event) => {
    const deltas = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: columns, ArrowUp: -columns };
    const delta = deltas[event.key];
    if (delta === undefined) return;
    const buttons = [...grid.querySelectorAll('button:not([disabled])')];
    const index = buttons.indexOf(document.activeElement);
    if (index < 0) return;
    const next = index + delta;
    if (next < 0 || next >= buttons.length) return;
    event.preventDefault();
    buttons[next].focus();
  });
}

/** Segmented control. Returns the element plus a setter so the caller
 *  can reflect state changes that did not come from a click. */
export function segmented(options, value, onChange, ariaLabel = 'Options') {
  const root = el('div', {
    class: 'calc-segmented',
    attrs: { role: 'tablist', 'aria-label': ariaLabel },
    style: { gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` },
  });
  const buttons = new Map();
  for (const option of options) {
    const button = el('button', {
      class: 'calc-segment',
      text: option.label,
      attrs: {
        type: 'button',
        role: 'tab',
        title: option.title ?? option.label,
        'aria-label': option.aria ?? option.title ?? option.label,
        'aria-selected': String(option.id === value),
      },
      dataset: { value: option.id },
      on: { click: () => onChange(option.id) },
    });
    buttons.set(option.id, button);
    root.appendChild(button);
  }
  return {
    element: root,
    select(next) {
      for (const [id, button] of buttons) button.setAttribute('aria-selected', String(id === next));
    },
  };
}

/** Labelled input row used by the financial and converter modes. */
export function field(spec) {
  const input = el('input', {
    class: 'calc-input',
    attrs: {
      type: spec.type ?? 'text',
      inputmode: spec.inputmode ?? (spec.type === 'number' ? 'decimal' : null),
      step: spec.step ?? null,
      min: spec.min ?? null,
      placeholder: spec.placeholder ?? null,
      'aria-label': spec.label,
      id: spec.id ?? null,
    },
    dataset: { field: spec.name },
  });
  if (spec.value !== undefined) input.value = String(spec.value);
  if (spec.on) {
    for (const [event, handler] of Object.entries(spec.on)) input.addEventListener(event, handler);
  }
  const wrap = el('label', { class: 'calc-field' }, [
    el('span', { class: 'calc-field-label', text: spec.label }),
    el('span', { class: 'calc-field-input' }, [
      input,
      spec.suffix ? el('span', { class: 'calc-field-suffix', text: spec.suffix }) : null,
    ]),
  ]);
  return { element: wrap, input };
}

/** Native select built from `{ value, label }` options. */
export function select(spec) {
  const node = el('select', {
    class: 'calc-select',
    attrs: { 'aria-label': spec.label, id: spec.id ?? null },
    dataset: { field: spec.name ?? null },
  });
  setSelectOptions(node, spec.options, spec.value);
  if (spec.on) {
    for (const [event, handler] of Object.entries(spec.on)) node.addEventListener(event, handler);
  }
  if (spec.label && spec.showLabel !== false) {
    return {
      element: el('label', { class: 'calc-field' }, [
        el('span', { class: 'calc-field-label', text: spec.label }),
        node,
      ]),
      input: node,
    };
  }
  return { element: node, input: node };
}

export function setSelectOptions(node, options, value) {
  node.replaceChildren();
  for (const option of options) {
    node.appendChild(el('option', { text: option.label, attrs: { value: option.value } }));
  }
  if (value !== undefined) node.value = String(value);
}

/** Small "Copy" button wired to a text provider. */
export function copyButton(getText, copy, label = 'Copy') {
  return el('button', {
    class: 'calc-chip',
    text: label,
    attrs: { type: 'button', 'aria-label': `${label} result` },
    on: {
      click: async (event) => {
        const button = event.currentTarget;
        const ok = await copy(getText());
        button.textContent = ok ? 'Copied' : 'Select & copy';
        setTimeout(() => { button.textContent = label; }, 1400);
      },
    },
  });
}

/** Two-column readout list: label on the left, value on the right. */
export function readout(rows) {
  const list = el('dl', { class: 'calc-readout' });
  for (const [label, value, variant] of rows) {
    list.appendChild(el('dt', { text: label }));
    list.appendChild(el('dd', { class: variant ? `is-${variant}` : null, text: value }));
  }
  return list;
}

export function clear(node) {
  node.replaceChildren();
  return node;
}
