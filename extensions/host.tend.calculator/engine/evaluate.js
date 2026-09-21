/* AST evaluator.
 *
 * Kept separate from the parser so the graphing mode can parse once and
 * then evaluate the same AST a few hundred times per frame with only
 * `x` changing — no re-tokenising in the sampling loop.
 *
 * Angle handling lives here rather than in the parser because Deg/Rad/
 * Grad is a runtime setting: the same AST must answer differently when
 * the user flips the toggle.
 */
import { CalcError } from './tokenize.js';
import { parse } from './parser.js';

export const ANGLE_MODES = ['deg', 'rad', 'grad'];

const DEG_PER_RAD = 180 / Math.PI;
const GRAD_PER_RAD = 200 / Math.PI;

const CONSTANT_VALUES = new Map([
  ['pi', Math.PI],
  ['tau', Math.PI * 2],
  ['e', Math.E],
  ['phi', (1 + Math.sqrt(5)) / 2],
  ['inf', Infinity],
  ['infinity', Infinity],
]);

/** Convert a user-facing angle into radians for the trig primitives. */
export function toRadians(value, angleMode) {
  if (angleMode === 'deg') return value / DEG_PER_RAD;
  if (angleMode === 'grad') return value / GRAD_PER_RAD;
  return value;
}

/** Convert a radian result back into the user's angle unit. */
export function fromRadians(value, angleMode) {
  if (angleMode === 'deg') return value * DEG_PER_RAD;
  if (angleMode === 'grad') return value * GRAD_PER_RAD;
  return value;
}

// Lanczos approximation, g = 7, n = 9. Gives ~15 significant digits,
// which is exactly the width the display shows.
const LANCZOS = [
  0.99999999999980993, 676.5203681218851, -1259.1392167224028,
  771.32342877765313, -176.61502916214059, 12.507343278686905,
  -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
];

export function gamma(z) {
  if (z < 0.5) {
    // Reflection formula keeps the series inside its convergent range.
    return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
  }
  const x = z - 1;
  let sum = LANCZOS[0];
  for (let i = 1; i < LANCZOS.length; i += 1) sum += LANCZOS[i] / (x + i);
  const t = x + LANCZOS.length - 1.5;
  return Math.sqrt(2 * Math.PI) * t ** (x + 0.5) * Math.exp(-t) * sum;
}

/** n! for non-negative integers (exact product up to 170!), and
 *  Γ(n+1) for everything else so `0.5!` still answers. */
export function factorial(n) {
  if (Number.isNaN(n)) return NaN;
  if (Number.isInteger(n)) {
    if (n < 0) throw new CalcError('Factorial needs a non-negative number');
    if (n > 170) return Infinity;
    let out = 1;
    for (let i = 2; i <= n; i += 1) out *= i;
    return out;
  }
  if (n < 0 && Number.isInteger(n)) throw new CalcError('Factorial needs a non-negative number');
  return gamma(n + 1);
}

function requireFinite(value, message) {
  if (!Number.isFinite(value)) throw new CalcError(message);
  return value;
}

export function gcd(a, b) {
  let x = Math.abs(Math.trunc(a));
  let y = Math.abs(Math.trunc(b));
  while (y) { const t = y; y = x % y; x = t; }
  return x;
}

export function lcm(a, b) {
  const divisor = gcd(a, b);
  return divisor === 0 ? 0 : Math.abs(Math.trunc(a) * Math.trunc(b)) / divisor;
}

function combinations(n, r) {
  if (r < 0 || r > n) return 0;
  let out = 1;
  const k = Math.min(r, n - r);
  for (let i = 1; i <= k; i += 1) out = (out * (n - k + i)) / i;
  return Math.round(out);
}

function permutations(n, r) {
  if (r < 0 || r > n) return 0;
  let out = 1;
  for (let i = 0; i < r; i += 1) out *= n - i;
  return out;
}

const FUNCTIONS = {
  sin: (a, ctx) => Math.sin(toRadians(a[0], ctx.angle)),
  cos: (a, ctx) => Math.cos(toRadians(a[0], ctx.angle)),
  tan: (a, ctx) => Math.tan(toRadians(a[0], ctx.angle)),
  asin: (a, ctx) => fromRadians(Math.asin(a[0]), ctx.angle),
  acos: (a, ctx) => fromRadians(Math.acos(a[0]), ctx.angle),
  atan: (a, ctx) => fromRadians(Math.atan(a[0]), ctx.angle),
  atan2: (a, ctx) => fromRadians(Math.atan2(a[0], a[1]), ctx.angle),
  sinh: (a) => Math.sinh(a[0]),
  cosh: (a) => Math.cosh(a[0]),
  tanh: (a) => Math.tanh(a[0]),
  asinh: (a) => Math.asinh(a[0]),
  acosh: (a) => Math.acosh(a[0]),
  atanh: (a) => Math.atanh(a[0]),
  ln: (a) => Math.log(a[0]),
  log: (a) => (a.length === 2 ? Math.log(a[0]) / Math.log(a[1]) : Math.log10(a[0])),
  log2: (a) => Math.log2(a[0]),
  log10: (a) => Math.log10(a[0]),
  exp: (a) => Math.exp(a[0]),
  sqrt: (a) => Math.sqrt(a[0]),
  cbrt: (a) => Math.cbrt(a[0]),
  root: (a) => (a[0] < 0 && Math.abs(a[1] % 2) === 1 ? -((-a[0]) ** (1 / a[1])) : a[0] ** (1 / a[1])),
  abs: (a) => Math.abs(a[0]),
  sign: (a) => Math.sign(a[0]),
  floor: (a) => Math.floor(a[0]),
  ceil: (a) => Math.ceil(a[0]),
  trunc: (a) => Math.trunc(a[0]),
  round: (a) => {
    const places = a.length === 2 ? Math.trunc(a[1]) : 0;
    const scale = 10 ** places;
    return Math.round(a[0] * scale) / scale;
  },
  min: (a) => Math.min(...a),
  max: (a) => Math.max(...a),
  sum: (a) => a.reduce((total, value) => total + value, 0),
  avg: (a) => a.reduce((total, value) => total + value, 0) / a.length,
  pow: (a) => a[0] ** a[1],
  mod: (a) => {
    if (a[1] === 0) throw new CalcError('Cannot divide by zero');
    return a[0] % a[1];
  },
  hypot: (a) => Math.hypot(...a),
  gcd: (a) => a.reduce((acc, value) => gcd(acc, value)),
  lcm: (a) => a.reduce((acc, value) => lcm(acc, value)),
  fact: (a) => factorial(a[0]),
  ncr: (a) => combinations(Math.trunc(a[0]), Math.trunc(a[1])),
  npr: (a) => permutations(Math.trunc(a[0]), Math.trunc(a[1])),
  deg: (a) => a[0] * DEG_PER_RAD,
  rad: (a) => a[0] / DEG_PER_RAD,
};

function isPercent(node) {
  return node && node.type === 'postfix' && node.op === '%';
}

function evalNode(node, ctx) {
  switch (node.type) {
    case 'number':
      return node.value;
    case 'group':
      return evalNode(node.arg, ctx);
    case 'constant': {
      if (node.name === 'ans') return Number(ctx.vars.ans ?? 0);
      return CONSTANT_VALUES.get(node.name) ?? NaN;
    }
    case 'variable': {
      if (!(node.name in ctx.vars)) {
        throw new CalcError(`"${node.name}" is not a known value`, node.position);
      }
      return Number(ctx.vars[node.name]);
    }
    case 'unary':
      return -evalNode(node.arg, ctx);
    case 'postfix': {
      const value = evalNode(node.arg, ctx);
      if (node.op === '!') return factorial(value);
      return value / 100;
    }
    case 'call': {
      const args = node.args.map((arg) => evalNode(arg, ctx));
      const fn = FUNCTIONS[node.name];
      if (!fn) throw new CalcError(`Unknown function "${node.name}"`, node.position);
      return fn(args, ctx);
    }
    case 'binary': {
      const left = evalNode(node.left, ctx);
      // Calculator-style percent: in `200 + 10%` the 10% is 10% OF the
      // left operand, not 0.1. In `200 * 10%` it is plainly 0.1. This
      // is the behaviour every desk calculator has shipped since the
      // 1970s and the one users are surprised to lose.
      if (isPercent(node.right) && (node.op === '+' || node.op === '-')) {
        const share = evalNode(node.right.arg, ctx) / 100;
        return node.op === '+' ? left + left * share : left - left * share;
      }
      const right = evalNode(node.right, ctx);
      switch (node.op) {
        case '+': return left + right;
        case '-': return left - right;
        case '*': return left * right;
        case '/':
          if (right === 0) throw new CalcError('Cannot divide by zero', node.position);
          return left / right;
        case 'mod':
          if (right === 0) throw new CalcError('Cannot divide by zero', node.position);
          return left % right;
        case '^': return left ** right;
        default: throw new CalcError(`Unknown operator "${node.op}"`, node.position);
      }
    }
    default:
      throw new CalcError('Malformed expression');
  }
}

/** Evaluate a parsed AST. `scope.angle` is one of ANGLE_MODES;
 *  `scope.vars` supplies `x`, `ans`, and anything else in play. */
export function evaluate(ast, scope = {}) {
  const ctx = {
    angle: ANGLE_MODES.includes(scope.angle) ? scope.angle : 'rad',
    vars: scope.vars ?? {},
  };
  const value = evalNode(ast, ctx);
  if (typeof value !== 'number') throw new CalcError('Expression did not produce a number');
  return value;
}

/** Parse + evaluate in one call, for everything that is not a plot. */
export function evaluateExpression(source, scope = {}) {
  return evaluate(parse(source), scope);
}

export { CalcError, requireFinite };
