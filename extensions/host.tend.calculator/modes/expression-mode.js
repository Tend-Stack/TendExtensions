/* Shared engine-backed editor behind Standard and Scientific mode.
 *
 * Both modes are the same thing with a different keypad: an editable
 * expression string, a live result underneath, and `=` to commit. The
 * only real work is the small set of edits a calculator keypad performs
 * on a text expression — replace the trailing number, wrap the trailing
 * operand in a function, flip its sign — which is why they live here
 * once rather than twice.
 *
 * The expression is stored in plain ASCII and only prettified for
 * display, so what we hand the parser is always what the user built.
 */
import { parse } from '../engine/parser.js';
import { evaluate, CalcError } from '../engine/evaluate.js';
import { formatNumber, groupDigits } from '../engine/format.js';
import { el, keypad, clear } from '../ui/dom.js';

const PRETTY = new Map([['*', ' × '], ['/', ' ÷ '], ['+', ' + '], ['-', ' − '], ['^', '^']]);
const TRAILING_NUMBER = /(\d+\.?\d*(?:[eE][+-]?\d+)?)$/;
const OPERATOR_TAIL = /[-+*/^]\s*$/;
/** Characters the user may type straight into the expression. */
const TYPEABLE = /^[0-9a-zA-Z.+\-*/^%!(),π√²³]$/;

function prettify(expression) {
  let out = '';
  for (let i = 0; i < expression.length; i += 1) {
    const ch = expression[i];
    const mapped = PRETTY.get(ch);
    if (!mapped) { out += ch; continue; }
    if (ch === '-' || ch === '+') {
      // A sign that follows nothing, an operator or an open paren is
      // unary and hugs its operand: `(−5)`, not `( − 5)`.
      const previous = expression.slice(0, i).replace(/\s+$/, '').slice(-1);
      const unary = previous === '' || '(+-*/^,'.includes(previous);
      out += unary ? (ch === '-' ? '\u2212' : '+') : mapped;
      continue;
    }
    out += mapped;
  }
  return out.replace(/\s{2,}/g, ' ');
}

/** Index where the trailing operand starts: a closing group walks back
 *  to its opening paren (taking any function name with it), otherwise
 *  it is the trailing number. Returns -1 when there is no operand. */
function trailingOperandStart(expression) {
  if (!expression) return -1;
  const last = expression[expression.length - 1];
  if (last === ')') {
    let depth = 0;
    for (let i = expression.length - 1; i >= 0; i -= 1) {
      const ch = expression[i];
      if (ch === ')') depth += 1;
      else if (ch === '(') {
        depth -= 1;
        if (depth === 0) {
          const head = expression.slice(0, i).match(/[A-Za-z]+$/);
          return head ? i - head[0].length : i;
        }
      }
    }
    return -1;
  }
  const match = expression.match(TRAILING_NUMBER);
  if (match) return expression.length - match[1].length;
  const name = expression.match(/[A-Za-z]+$/);
  if (name) return expression.length - name[0].length;
  return -1;
}

export function createExpressionMode(ctx, config) {
  let expression = '';
  let error = '';
  let lastValue = 0;
  let justEvaluated = false;
  let repeatTail = '';
  let shifted = false;

  const expressionEl = el('div', { class: 'calc-expression', attrs: { 'aria-hidden': 'true' } });
  const valueEl = el('div', { class: 'calc-value', text: '0', dataset: { len: 1 } });
  const errorEl = el('p', { class: 'calc-error', attrs: { role: 'status' } });
  const display = el('div', {
    class: 'calc-display',
    attrs: { 'aria-live': 'polite', 'aria-label': 'Display' },
  }, [expressionEl, valueEl, errorEl]);

  const memoryButtons = new Map();
  const memoryRow = config.memory === false ? null : el('div', {
    class: 'calc-memrow', attrs: { role: 'group', 'aria-label': 'Memory' },
  }, ['MC', 'MR', 'M+', 'M−', 'MS'].map((label, index) => {
    const id = ['mc', 'mr', 'madd', 'msub', 'ms'][index];
    const button = el('button', {
      class: 'calc-mem',
      text: label,
      attrs: { type: 'button', 'aria-label': `Memory ${['clear', 'recall', 'add', 'subtract', 'store'][index]}` },
      dataset: { key: `act:${id}` },
      on: { click: () => dispatch(`act:${id}`) },
    });
    memoryButtons.set(id, button);
    return button;
  }));

  const keysHost = el('div', { class: 'calc-keys' });
  const header = config.header ? config.header(api()) : null;
  const root = el('div', { class: 'calc-mode' }, [
    el('div', { class: 'calc-stack' }, [header, memoryRow, display].filter(Boolean)),
    keysHost,
  ]);

  function currentText() {
    return expression;
  }

  function liveValue() {
    if (!expression.trim()) return { value: 0, ok: true };
    try {
      return { value: evaluate(parse(expression), scope()), ok: true };
    } catch (problem) {
      return { value: null, ok: false, problem };
    }
  }

  function scope() {
    return { angle: ctx.getAngle(), vars: { ans: ctx.getAns() } };
  }

  function paint() {
    expressionEl.textContent = prettify(expression) || ' ';
    // Keep the tail of a long expression in view by scrolling rather
    // than by flipping direction to rtl: rtl reorders trailing
    // operators and parentheses, which is worse than a scrollbar.
    expressionEl.scrollLeft = expressionEl.scrollWidth;
    const live = liveValue();
    const shown = live.ok
      ? groupDigits(formatNumber(live.value))
      : groupDigits(formatNumber(lastValue));
    valueEl.textContent = shown;
    valueEl.dataset.len = String(shown.replace(/[^0-9]/g, '').length || 1);
    valueEl.classList.toggle('is-overflow', shown.length > 18);
    errorEl.textContent = error;
    const hasMemory = ctx.getMemory() !== null;
    memoryButtons.get('mc')?.toggleAttribute('disabled', !hasMemory);
    memoryButtons.get('mr')?.toggleAttribute('disabled', !hasMemory);
    if (config.onPaint) config.onPaint({ shifted, expression });
  }

  function setExpression(next, options = {}) {
    expression = next;
    if (!options.keepError) error = '';
    if (!options.keepRepeat) { justEvaluated = false; repeatTail = ''; }
    paint();
  }

  function insert(text) {
    if (justEvaluated && /^[0-9.]/.test(text)) setExpression(text);
    else setExpression(expression + text);
  }

  function insertOperator(op) {
    if (!expression) {
      // Starting with an operator continues from the last answer, the
      // way a desk calculator continues from its accumulator.
      setExpression(`${formatNumber(ctx.getAns())}${op}`);
      return;
    }
    if (OPERATOR_TAIL.test(expression)) {
      setExpression(expression.replace(OPERATOR_TAIL, op));
      return;
    }
    setExpression(expression + op);
  }

  function clearAll() {
    lastValue = 0;
    setExpression('');
  }

  /** CE drops the trailing operand only; C drops everything. */
  function clearEntry() {
    const start = trailingOperandStart(expression);
    setExpression(start < 0 ? '' : expression.slice(0, start));
  }

  function backspace() {
    if (justEvaluated) { clearAll(); return; }
    setExpression(expression.slice(0, -1));
  }

  function negate() {
    const wrapped = expression.match(/\(-([^()]+)\)$/);
    if (wrapped) {
      setExpression(expression.slice(0, wrapped.index) + wrapped[1]);
      return;
    }
    const start = trailingOperandStart(expression);
    if (start < 0) {
      setExpression(`(-${formatNumber(ctx.getAns())})`);
      return;
    }
    const operand = expression.slice(start);
    setExpression(`${expression.slice(0, start)}(-${operand})`);
  }

  /** Wrap the trailing operand: `sqrt` -> sqrt(x), `sqr` -> (x)^2,
   *  `recip` -> 1/(x), `fact` -> (x)!. Nothing to wrap means wrap the
   *  whole expression, which is what the user means on a long line. */
  function wrapOperand(kind) {
    const source = expression.trim();
    if (!source) {
      const seed = formatNumber(ctx.getAns());
      setExpression(applyWrap(kind, seed));
      return;
    }
    const start = trailingOperandStart(source);
    if (start < 0) return;
    const operand = source.slice(start);
    setExpression(source.slice(0, start) + applyWrap(kind, operand));
  }

  function applyWrap(kind, operand) {
    const needsParens = !/^[\w.]+$/.test(operand) && !/^\(.*\)$/.test(operand);
    const safe = needsParens ? `(${operand})` : operand;
    switch (kind) {
      case 'sqr': return `${safe}^2`;
      case 'cube': return `${safe}^3`;
      case 'recip': return `1/${safe}`;
      case 'fact': return `${safe}!`;
      case 'tenpow': return `10^${safe}`;
      case 'epow': return `e^${safe}`;
      case 'twopow': return `2^${safe}`;
      default: return `${kind}(${operand})`;
    }
  }

  function equals() {
    const source = justEvaluated && repeatTail ? expression + repeatTail : expression;
    if (!source.trim()) return;
    let value;
    try {
      value = evaluate(parse(source), scope());
    } catch (problem) {
      error = problem instanceof CalcError ? problem.message : 'That expression is not valid';
      paint();
      return;
    }
    const tail = source.match(/([-+*/^])([^-+*/^]+)$/);
    repeatTail = tail ? tail[0] : '';
    lastValue = value;
    ctx.setAns(value);
    const text = formatNumber(value);
    ctx.commit({ mode: config.label, expression: prettify(source), result: text });
    expression = text;
    justEvaluated = true;
    error = '';
    paint();
  }

  async function memory(kind) {
    const live = liveValue();
    const value = live.ok ? live.value : lastValue;
    switch (kind) {
      case 'mc': ctx.setMemory(null); break;
      case 'mr': {
        const stored = ctx.getMemory();
        if (stored === null) return;
        insert(formatNumber(stored));
        return;
      }
      case 'madd': ctx.setMemory((ctx.getMemory() ?? 0) + value); break;
      case 'msub': ctx.setMemory((ctx.getMemory() ?? 0) - value); break;
      case 'ms': ctx.setMemory(value); break;
      default: break;
    }
    paint();
  }

  function dispatch(keyId) {
    if (!keyId) return;
    const separator = keyId.indexOf(':');
    const kind = separator < 0 ? keyId : keyId.slice(0, separator);
    const value = separator < 0 ? '' : keyId.slice(separator + 1);
    switch (kind) {
      case 'd': return insert(value);
      case 'txt': return insert(value);
      case 'fn': return insert(`${value}(`);
      case 'op': return insertOperator(value);
      case 'wrap': return wrapOperand(value);
      case 'act': return action(value);
      default: return undefined;
    }
  }

  function action(name) {
    switch (name) {
      case 'eq': return equals();
      case 'clear': return clearAll();
      case 'clearentry': return clearEntry();
      case 'back': return backspace();
      case 'negate': return negate();
      case 'ans': return insert('ans');
      case 'shift': return setShift(!shifted);
      case 'mc': case 'mr': case 'madd': case 'msub': case 'ms':
        return memory(name);
      default:
        return config.onAction ? config.onAction(name, api()) : undefined;
    }
  }

  function setShift(next) {
    shifted = next;
    renderKeys();
    paint();
  }

  function renderKeys() {
    clear(keysHost);
    const rows = config.layout({ shifted });
    const grid = keypad(rows, config.columns, { label: `${config.label} keypad` });
    grid.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-key]');
      if (!button) return;
      dispatch(button.dataset.key);
      if (shifted && !button.dataset.key.endsWith(':shift')) setShift(false);
    });
    keysHost.appendChild(grid);
  }

  function pulse(keyId) {
    const button = keysHost.querySelector(`button[data-key="${keyId}"]`);
    if (!button) return;
    button.classList.add('is-pressed');
    setTimeout(() => button.classList.remove('is-pressed'), 90);
  }

  function handleKey(event) {
    const { key } = event;
    if (key === 'Enter' || key === '=') { equals(); pulse('act:eq'); return true; }
    if (key === 'Escape') { clearAll(); return true; }
    if (key === 'Delete') { clearEntry(); return true; }
    if (key === 'Backspace') { backspace(); return true; }
    if (key === 'F9') { negate(); return true; }
    if (key.length === 1 && TYPEABLE.test(key)) {
      if (/[-+*/^]/.test(key)) insertOperator(key);
      else insert(key);
      pulse(/[0-9]/.test(key) ? `d:${key}` : `txt:${key}`);
      return true;
    }
    return false;
  }

  function api() {
    return {
      insert,
      setExpression,
      dispatch,
      repaint: paint,
      getExpression: currentText,
      getValue: () => (liveValue().ok ? liveValue().value : lastValue),
    };
  }

  renderKeys();
  paint();

  return {
    id: config.id,
    label: config.label,
    element: root,
    handleKey,
    resultText: () => valueEl.textContent,
    load(entry, what) {
      if (what === 'result') setExpression(String(entry.result).replace(/,/g, ''));
      else setExpression(String(entry.expression).replace(/[×·]/g, '*').replace(/[÷]/g, '/').replace(/[−–]/g, '-').replace(/\s+/g, ''));
    },
    refresh: paint,
    destroy() { /* no listeners outside the subtree */ },
  };
}
