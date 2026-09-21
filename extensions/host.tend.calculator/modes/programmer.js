/* Programmer mode.
 *
 * Deliberately NOT expression-based: hex/oct/bin literals in a
 * double-precision parser would silently lose the low bits of a 64-bit
 * word. This mode is a two-operand machine over BigInt words, which is
 * the only representation that is exact at every supported width.
 *
 * The four base readouts are always live and always agree, because they
 * are four renderings of one stored word rather than four states.
 */
import {
  BASES, WORD_SIZES, arithmetic, bitwise, bitsOf, formatInBase, groupForBase,
  notWord, parseInBase, popCount, rotate, shift, toWord, displayValue,
} from '../engine/programmer.js';
import { el, keypad, clear, copyButton } from '../ui/dom.js';

const OP_LABELS = {
  add: '+', sub: '−', mul: '×', div: '÷', mod: 'mod',
  and: 'AND', or: 'OR', xor: 'XOR', nand: 'NAND', nor: 'NOR',
  shl: 'Lsh', shr: 'Rsh', sar: 'Ash', rol: 'RoL', ror: 'RoR',
};

const BINARY_OPS = new Set(Object.keys(OP_LABELS));

const LAYOUT = [
  [
    { key: 'op:and', label: 'AND', variant: 'fn' },
    { key: 'op:or', label: 'OR', variant: 'fn' },
    { key: 'op:xor', label: 'XOR', variant: 'fn' },
    { key: 'act:not', label: 'NOT', variant: 'fn' },
    { key: 'act:back', label: '⌫', variant: 'fn', aria: 'Backspace' },
    { key: 'act:clear', label: 'C', variant: 'fn', aria: 'Clear' },
  ],
  [
    { key: 'op:shl', label: 'Lsh', variant: 'fn', aria: 'Shift left' },
    { key: 'op:shr', label: 'Rsh', variant: 'fn', aria: 'Logical shift right' },
    { key: 'op:sar', label: 'Ash', variant: 'fn', aria: 'Arithmetic shift right' },
    { key: 'op:rol', label: 'RoL', variant: 'fn', aria: 'Rotate left' },
    { key: 'op:ror', label: 'RoR', variant: 'fn', aria: 'Rotate right' },
    { key: 'op:mod', label: 'mod', variant: 'fn', aria: 'Modulo' },
  ],
  [
    { key: 'd:A', label: 'A' }, { key: 'd:B', label: 'B' },
    { key: 'd:7', label: '7' }, { key: 'd:8', label: '8' }, { key: 'd:9', label: '9' },
    { key: 'op:div', label: '÷', variant: 'op', aria: 'Divide' },
  ],
  [
    { key: 'd:C', label: 'C' }, { key: 'd:D', label: 'D' },
    { key: 'd:4', label: '4' }, { key: 'd:5', label: '5' }, { key: 'd:6', label: '6' },
    { key: 'op:mul', label: '×', variant: 'op', aria: 'Multiply' },
  ],
  [
    { key: 'd:E', label: 'E' }, { key: 'd:F', label: 'F' },
    { key: 'd:1', label: '1' }, { key: 'd:2', label: '2' }, { key: 'd:3', label: '3' },
    { key: 'op:sub', label: '−', variant: 'op', aria: 'Subtract' },
  ],
  [
    { key: 'act:nand', label: 'NAND', variant: 'fn' },
    { key: 'act:nor', label: 'NOR', variant: 'fn' },
    { key: 'd:0', label: '0' },
    { key: 'act:negate', label: '±', variant: 'fn', aria: 'Negate' },
    { key: 'act:eq', label: '=', variant: 'eq', aria: 'Equals' },
    { key: 'op:add', label: '+', variant: 'op', aria: 'Add' },
  ],
];

export function createProgrammerMode(ctx) {
  let bits = ctx.store.peek('prog.bits', 32);
  let signed = ctx.store.peek('prog.signed', true) !== false;
  let base = ctx.store.peek('prog.base', 'dec');
  let value = 0n;
  let entry = '';
  let acc = null;
  let pending = null;
  let error = '';

  const baseRows = new Map();
  const basesEl = el('div', { class: 'calc-bases', attrs: { role: 'group', 'aria-label': 'Base readouts' } });
  for (const item of BASES) {
    const valueEl = el('span', { class: 'calc-base-value', text: '0' });
    const row = el('button', {
      class: 'calc-base-row',
      attrs: { type: 'button', 'aria-selected': String(item.id === base), 'aria-label': `${item.label} readout` },
      on: { click: () => setBase(item.id) },
    }, [el('span', { class: 'calc-base-tag', text: item.label }), valueEl]);
    baseRows.set(item.id, { row, valueEl, radix: item.radix });
    basesEl.appendChild(row);
  }

  const errorEl = el('p', { class: 'calc-error', attrs: { role: 'status' } });
  const statsEl = el('p', { class: 'calc-hint' });

  const wordChips = new Map();
  const wordRow = el('div', { class: 'calc-chiprow' }, [
    ...WORD_SIZES.map((size) => {
      const chip = el('button', {
        class: 'calc-chip', text: `${size}`,
        attrs: { type: 'button', 'aria-pressed': String(size === bits), 'aria-label': `${size} bit word` },
        on: { click: () => setBits(size) },
      });
      wordChips.set(size, chip);
      return chip;
    }),
    el('span', { class: 'calc-hint', text: 'bit' }),
    el('button', {
      class: 'calc-chip', text: "two's complement",
      attrs: { type: 'button', 'aria-pressed': String(signed), 'aria-label': "Two's complement signed display" },
      dataset: { role: 'signed' },
      on: { click: () => setSigned(!signed) },
    }),
    copyButton(() => currentText(), ctx.copy),
  ]);

  const bitsEl = el('div', { class: 'calc-bits', attrs: { role: 'group', 'aria-label': 'Bit toggles' } });
  const keysHost = el('div', { class: 'calc-keys' });

  const root = el('div', { class: 'calc-mode' }, [
    el('div', { class: 'calc-stack' }, [
      el('div', { class: 'calc-display', attrs: { 'aria-live': 'polite', 'aria-label': 'Base readouts' } }, [basesEl, errorEl]),
      wordRow,
      bitsEl,
      statsEl,
    ]),
    keysHost,
  ]);

  function radixOf(id) {
    return BASES.find((item) => item.id === id)?.radix ?? 10;
  }

  function currentValue() {
    if (!entry) return value;
    try {
      return parseInBase(entry, radixOf(base), bits, signed);
    } catch (problem) {
      return value;
    }
  }

  function currentText() {
    return formatInBase(currentValue(), radixOf(base), bits, signed);
  }

  function renderBits() {
    clear(bitsEl);
    const columns = Math.min(16, bits);
    bitsEl.style.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;
    const list = bitsOf(currentValue(), bits);
    // Painted most-significant first so the grid reads like the binary
    // readout above it.
    for (let index = bits - 1; index >= 0; index -= 1) {
      bitsEl.appendChild(el('button', {
        class: 'calc-bit',
        text: String(list[index]),
        attrs: {
          type: 'button',
          'aria-pressed': String(list[index] === 1),
          'aria-label': `Bit ${index}`,
          title: `Bit ${index}`,
        },
        on: { click: () => flipBit(index) },
      }));
    }
  }

  function paint() {
    const shown = currentValue();
    for (const [id, entryRow] of baseRows) {
      entryRow.valueEl.textContent = groupForBase(formatInBase(shown, entryRow.radix, bits, signed), entryRow.radix);
      entryRow.valueEl.scrollLeft = entryRow.valueEl.scrollWidth;
      entryRow.row.setAttribute('aria-selected', String(id === base));
    }
    errorEl.textContent = error;
    statsEl.textContent = `${bits}-bit · ${popCount(shown, bits)} bits set · ${pending ? `pending ${OP_LABELS[pending]}` : 'ready'}`;
    for (const [size, chip] of wordChips) chip.setAttribute('aria-pressed', String(size === bits));
    wordRow.querySelector('[data-role="signed"]').setAttribute('aria-pressed', String(signed));
    renderBits();
  }

  function setBase(next) {
    // Committing the typed digits before switching keeps the value
    // stable across the change of notation.
    value = currentValue();
    entry = '';
    base = next;
    ctx.store.set('prog.base', next);
    paint();
  }

  function setBits(next) {
    value = toWord(currentValue(), next);
    entry = '';
    bits = next;
    ctx.store.set('prog.bits', next);
    paint();
  }

  function setSigned(next) {
    signed = next;
    ctx.store.set('prog.signed', next);
    entry = '';
    paint();
  }

  function flipBit(index) {
    value = toWord(currentValue() ^ (1n << BigInt(index)), bits);
    entry = '';
    error = '';
    paint();
  }

  function digit(ch) {
    const radix = radixOf(base);
    const allowed = '0123456789ABCDEF'.slice(0, radix);
    if (!allowed.includes(ch)) {
      error = `"${ch}" is not a digit in ${base.toUpperCase()}`;
      paint();
      return;
    }
    const next = (entry === '0' ? '' : entry) + ch;
    try {
      parseInBase(next, radix, bits, signed);
    } catch (problem) {
      return;
    }
    entry = next;
    error = '';
    paint();
  }

  function applyPending(right) {
    if (pending === null || acc === null) return right;
    if (BINARY_OPS.has(pending)) {
      if (['and', 'or', 'xor', 'nand', 'nor'].includes(pending)) return bitwise(pending, acc, right, bits);
      if (['shl', 'shr', 'sar'].includes(pending)) return shift(pending, acc, Number(right), bits);
      if (['rol', 'ror'].includes(pending)) return rotate(pending, acc, Number(right), bits);
      return arithmetic(pending, acc, right, bits, signed);
    }
    return right;
  }

  function operator(op) {
    const right = currentValue();
    try {
      value = pending === null ? right : applyPending(right);
    } catch (problem) {
      error = problem.message;
      paint();
      return;
    }
    acc = value;
    pending = op;
    entry = '';
    error = '';
    paint();
  }

  function equals() {
    if (pending === null) return;
    const right = currentValue();
    const leftText = formatInBase(acc, radixOf(base), bits, signed);
    const rightText = formatInBase(right, radixOf(base), bits, signed);
    try {
      value = applyPending(right);
    } catch (problem) {
      error = problem.message;
      paint();
      return;
    }
    ctx.commit({
      mode: 'Programmer',
      expression: `${leftText} ${OP_LABELS[pending]} ${rightText} (${base.toUpperCase()}, ${bits}-bit)`,
      result: formatInBase(value, radixOf(base), bits, signed),
    });
    ctx.setAns(Number(displayValue(value, bits, signed)));
    pending = null;
    acc = null;
    entry = '';
    error = '';
    paint();
  }

  function action(name) {
    switch (name) {
      case 'eq': return equals();
      case 'clear':
        value = 0n; entry = ''; acc = null; pending = null; error = ''; return paint();
      case 'back':
        if (entry) entry = entry.slice(0, -1);
        else value = 0n;
        return paint();
      case 'not':
        value = notWord(currentValue(), bits); entry = ''; return paint();
      case 'nand': case 'nor':
        return operator(name);
      case 'negate':
        value = toWord(-displayValue(currentValue(), bits, true), bits); entry = ''; return paint();
      default: return undefined;
    }
  }

  function dispatch(keyId) {
    const separator = keyId.indexOf(':');
    const kind = keyId.slice(0, separator);
    const payload = keyId.slice(separator + 1);
    if (kind === 'd') return digit(payload);
    if (kind === 'op') return operator(payload);
    if (kind === 'act') return action(payload);
    return undefined;
  }

  clear(keysHost);
  const grid = keypad(LAYOUT, 6, { label: 'Programmer keypad' });
  grid.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-key]');
    if (button) dispatch(button.dataset.key);
  });
  keysHost.appendChild(grid);
  paint();

  return {
    id: 'programmer',
    label: 'Programmer',
    element: root,
    handleKey(event) {
      const upper = event.key.toUpperCase();
      if (/^[0-9A-F]$/.test(upper)) { digit(upper); return true; }
      if (event.key === 'Enter' || event.key === '=') { equals(); return true; }
      if (event.key === 'Backspace') { action('back'); return true; }
      if (event.key === 'Escape') { action('clear'); return true; }
      const ops = { '+': 'add', '-': 'sub', '*': 'mul', '/': 'div', '&': 'and', '|': 'or', '^': 'xor' };
      if (ops[event.key]) { operator(ops[event.key]); return true; }
      return false;
    },
    resultText: () => currentText(),
    load(entry_, what) {
      const text = what === 'result' ? String(entry_.result) : String(entry_.expression);
      try {
        value = parseInBase(text.split(/\s/)[0], radixOf(base), bits, signed);
        entry = '';
        error = '';
      } catch (problem) {
        error = 'That entry is not valid in this base';
      }
      paint();
    },
    refresh: paint,
    destroy() {},
  };
}
