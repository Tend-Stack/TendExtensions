/* Pratt (precedence-climbing) parser: tokens -> AST.
 *
 * Chosen over shunting-yard because the extras this calculator needs —
 * right-associative powers, prefix minus that binds looser than `^`,
 * postfix `!` and `%`, n-ary function calls, and implicit
 * multiplication — are each a two-line addition to a Pratt loop and a
 * special case in a shunting-yard operator stack.
 *
 * Binding powers:
 *     +  -              2   left
 *     *  /  mod         3   left   (implicit multiplication too)
 *     unary -  +        4   prefix (so -2^2 === -(2^2))
 *     ^                 5   right
 *     !  %              7   postfix
 */
import { CalcError, TOKEN, tokenize } from './tokenize.js';

const BINARY = new Map([
  ['+', { power: 2, right: false }],
  ['-', { power: 2, right: false }],
  ['*', { power: 3, right: false }],
  ['/', { power: 3, right: false }],
  ['mod', { power: 3, right: false }],
  ['^', { power: 5, right: true }],
]);

const IMPLICIT_POWER = 3;
const UNARY_POWER = 4;
const POSTFIX_POWER = 7;

/** Names that read as values rather than calls. */
export const CONSTANTS = new Set(['pi', 'e', 'tau', 'phi', 'ans', 'inf', 'infinity']);

/** Names the evaluator can apply. Arity is checked at parse time so a
 *  typo surfaces before any arithmetic runs. */
export const FUNCTION_ARITY = new Map([
  ['sin', [1, 1]], ['cos', [1, 1]], ['tan', [1, 1]],
  ['asin', [1, 1]], ['acos', [1, 1]], ['atan', [1, 1]],
  ['sinh', [1, 1]], ['cosh', [1, 1]], ['tanh', [1, 1]],
  ['asinh', [1, 1]], ['acosh', [1, 1]], ['atanh', [1, 1]],
  ['ln', [1, 1]], ['log', [1, 2]], ['log2', [1, 1]], ['log10', [1, 1]],
  ['exp', [1, 1]], ['sqrt', [1, 1]], ['cbrt', [1, 1]], ['root', [2, 2]],
  ['abs', [1, 1]], ['sign', [1, 1]],
  ['floor', [1, 1]], ['ceil', [1, 1]], ['round', [1, 2]], ['trunc', [1, 1]],
  ['min', [1, 64]], ['max', [1, 64]], ['sum', [1, 64]], ['avg', [1, 64]],
  ['pow', [2, 2]], ['mod', [2, 2]], ['hypot', [2, 64]], ['atan2', [2, 2]],
  ['gcd', [2, 64]], ['lcm', [2, 64]],
  ['fact', [1, 1]], ['ncr', [2, 2]], ['npr', [2, 2]],
  ['deg', [1, 1]], ['rad', [1, 1]],
]);

/** Tokens that can begin an operand — the test that drives implicit
 *  multiplication (`2pi`, `3(4+1)`, `(1+2)(3)`). */
function startsOperand(token) {
  return token.type === TOKEN.NUMBER || token.type === TOKEN.NAME || token.type === TOKEN.LPAREN;
}

class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.index = 0;
  }

  peek(offset = 0) {
    return this.tokens[Math.min(this.index + offset, this.tokens.length - 1)];
  }

  next() {
    const token = this.tokens[this.index];
    if (this.index < this.tokens.length - 1) this.index += 1;
    return token;
  }

  expect(type, message) {
    const token = this.peek();
    if (token.type !== type) throw new CalcError(message, token.position);
    return this.next();
  }

  parseExpression(minPower = 0) {
    let left = this.parsePrefix();

    for (;;) {
      const token = this.peek();

      if (token.type === TOKEN.OPERATOR && (token.value === '!' || token.value === '%')) {
        if (POSTFIX_POWER < minPower) break;
        this.next();
        left = { type: 'postfix', op: token.value, arg: left, position: token.position };
        continue;
      }

      let op = null;
      let implicit = false;
      if (token.type === TOKEN.OPERATOR && BINARY.has(token.value)) {
        op = token.value;
      } else if (token.type === TOKEN.NAME && token.value === 'mod') {
        op = 'mod';
      } else if (this.allowsImplicit(left, token)) {
        op = '*';
        implicit = true;
      }
      if (op === null) break;

      const rule = op === '*' && implicit
        ? { power: IMPLICIT_POWER, right: false }
        : BINARY.get(op);
      if (rule.power < minPower) break;
      if (!implicit) this.next();
      const nextMin = rule.right ? rule.power : rule.power + 1;
      const right = this.parseExpression(nextMin);
      left = { type: 'binary', op, left, right, implicit, position: token.position };
    }

    return left;
  }

  /** Implicit multiplication is deliberately narrow: a name or an open
   *  paren may follow any operand, and a bare number may only follow a
   *  closing paren. `2 3` stays an error, which is almost always a typo
   *  rather than an intent to multiply. */
  allowsImplicit(left, token) {
    if (!startsOperand(token)) return false;
    if (token.type === TOKEN.NAME) {
      if (token.value === 'mod') return false;
      return true;
    }
    if (token.type === TOKEN.LPAREN) return true;
    // A bare number may only follow a closed operand: `(1+2)3` is a
    // product, `2 3` is a typo.
    return left.type === 'group' || left.type === 'postfix' || left.type === 'call';
  }

  parsePrefix() {
    const token = this.peek();

    if (token.type === TOKEN.OPERATOR && (token.value === '-' || token.value === '+')) {
      this.next();
      const arg = this.parseExpression(UNARY_POWER);
      return token.value === '-'
        ? { type: 'unary', op: '-', arg, position: token.position }
        : arg;
    }

    if (token.type === TOKEN.NUMBER) {
      this.next();
      return { type: 'number', value: token.value, position: token.position };
    }

    if (token.type === TOKEN.LPAREN) {
      this.next();
      const inner = this.parseExpression(0);
      this.expect(TOKEN.RPAREN, 'Missing closing parenthesis');
      return { type: 'group', arg: inner, position: token.position };
    }

    if (token.type === TOKEN.NAME) {
      this.next();
      const name = token.value;
      if (FUNCTION_ARITY.has(name)) {
        const args = this.parseCallArguments(name, token.position);
        return { type: 'call', name, args, position: token.position };
      }
      if (CONSTANTS.has(name)) return { type: 'constant', name, position: token.position };
      return { type: 'variable', name, position: token.position };
    }

    if (token.type === TOKEN.RPAREN) {
      throw new CalcError('Unmatched closing parenthesis', token.position);
    }
    if (token.type === TOKEN.END) {
      throw new CalcError('Expression is incomplete', token.position);
    }
    throw new CalcError(`Unexpected "${token.value}"`, token.position);
  }

  parseCallArguments(name, position) {
    const [minArgs, maxArgs] = FUNCTION_ARITY.get(name);
    const args = [];
    if (this.peek().type === TOKEN.LPAREN) {
      this.next();
      if (this.peek().type !== TOKEN.RPAREN) {
        args.push(this.parseExpression(0));
        while (this.peek().type === TOKEN.COMMA) {
          this.next();
          args.push(this.parseExpression(0));
        }
      }
      this.expect(TOKEN.RPAREN, `Missing closing parenthesis after ${name}(`);
    } else if (minArgs === 1) {
      // `√9`, `sin 30` — a single-argument function may take the next
      // operand without parentheses, binding tighter than `*`.
      args.push(this.parseExpression(UNARY_POWER));
    } else {
      throw new CalcError(`${name}() needs parentheses`, position);
    }
    if (args.length < minArgs || args.length > maxArgs) {
      const expected = minArgs === maxArgs ? `${minArgs}` : `${minArgs} to ${maxArgs}`;
      throw new CalcError(`${name}() takes ${expected} argument(s), got ${args.length}`, position);
    }
    return args;
  }
}

/** Parse an expression string into an AST. Throws `CalcError`. */
export function parse(source) {
  const text = String(source ?? '').trim();
  if (!text) throw new CalcError('Expression is empty', 0);
  const parser = new Parser(tokenize(text));
  const ast = parser.parseExpression(0);
  const trailing = parser.peek();
  if (trailing.type === TOKEN.RPAREN) {
    throw new CalcError('Unmatched closing parenthesis', trailing.position);
  }
  if (trailing.type !== TOKEN.END) {
    throw new CalcError(`Unexpected "${trailing.value}"`, trailing.position);
  }
  return ast;
}

/** Collect the free variable names an AST reads (graphing uses this to
 *  reject an expression that is not actually a function of x). */
export function variablesOf(node, seen = new Set()) {
  if (!node || typeof node !== 'object') return seen;
  if (node.type === 'variable') seen.add(node.name);
  for (const key of ['arg', 'left', 'right']) {
    if (node[key]) variablesOf(node[key], seen);
  }
  if (Array.isArray(node.args)) node.args.forEach((arg) => variablesOf(arg, seen));
  return seen;
}

export { CalcError };
