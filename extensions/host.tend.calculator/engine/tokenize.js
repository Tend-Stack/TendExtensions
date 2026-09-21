/* Tokenizer for the calculator's expression language.
 *
 * Hand-written because the grammar is tiny and a scanner we own can
 * normalise the pretty glyphs the keypad emits (×, ÷, −, π, √, x², x³)
 * into the plain ASCII the parser reasons about. That keeps the parser
 * free of presentation concerns.
 */

/** Errors carry the offset of the offending character so the UI can
 *  underline it instead of just saying "syntax error". */
export class CalcError extends Error {
  constructor(message, position = null) {
    super(message);
    this.name = 'CalcError';
    this.position = position;
  }
}

export const TOKEN = {
  NUMBER: 'number',
  NAME: 'name',
  OPERATOR: 'operator',
  LPAREN: 'lparen',
  RPAREN: 'rparen',
  COMMA: 'comma',
  END: 'end',
};

/** Keypad glyph -> parser operator. */
const GLYPH_OPERATORS = new Map([
  ['×', '*'], ['·', '*'], ['⋅', '*'], ['∗', '*'],
  ['÷', '/'], ['∕', '/'],
  ['−', '-'], ['–', '-'], ['—', '-'], ['﹣', '-'],
  ['＋', '+'],
  ['^', '^'], ['**', '^'],
]);

/** Glyph -> named constant or function the parser already knows. */
const GLYPH_NAMES = new Map([
  ['π', 'pi'], ['Π', 'pi'], ['τ', 'tau'], ['φ', 'phi'],
  ['√', 'sqrt'], ['∛', 'cbrt'],
]);

/** Superscript glyphs become an explicit power with a literal exponent. */
const SUPERSCRIPT_POWERS = new Map([['²', 2], ['³', 3], ['⁴', 4]]);

const ASCII_OPERATORS = new Set(['+', '-', '*', '/', '^', '%', '!']);

function isDigit(ch) {
  return ch >= '0' && ch <= '9';
}

function isNameStart(ch) {
  return /[A-Za-z_]/.test(ch);
}

function isNamePart(ch) {
  return /[A-Za-z0-9_]/.test(ch);
}

/** Scan `source` into a flat token list ending with an END token. */
export function tokenize(source) {
  const text = String(source ?? '');
  const tokens = [];
  let i = 0;

  const push = (type, value, start) => {
    tokens.push({ type, value, position: start });
  };

  while (i < text.length) {
    const ch = text[i];

    if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') { i += 1; continue; }

    if (isDigit(ch) || (ch === '.' && isDigit(text[i + 1]))) {
      const start = i;
      while (i < text.length && isDigit(text[i])) i += 1;
      if (text[i] === '.') {
        i += 1;
        while (i < text.length && isDigit(text[i])) i += 1;
      }
      if (text[i] === 'e' || text[i] === 'E') {
        // Only consume the exponent when it is actually well formed;
        // otherwise `2e` should read as 2 × e (Euler's number).
        let j = i + 1;
        if (text[j] === '+' || text[j] === '-') j += 1;
        if (isDigit(text[j])) {
          j += 1;
          while (j < text.length && isDigit(text[j])) j += 1;
          i = j;
        }
      }
      const raw = text.slice(start, i);
      const value = Number(raw);
      if (!Number.isFinite(value)) throw new CalcError(`"${raw}" is not a number`, start);
      push(TOKEN.NUMBER, value, start);
      continue;
    }

    if (SUPERSCRIPT_POWERS.has(ch)) {
      push(TOKEN.OPERATOR, '^', i);
      push(TOKEN.NUMBER, SUPERSCRIPT_POWERS.get(ch), i);
      i += 1;
      continue;
    }

    if (GLYPH_NAMES.has(ch)) {
      push(TOKEN.NAME, GLYPH_NAMES.get(ch), i);
      i += 1;
      continue;
    }

    if (GLYPH_OPERATORS.has(ch)) {
      push(TOKEN.OPERATOR, GLYPH_OPERATORS.get(ch), i);
      i += 1;
      continue;
    }

    if (isNameStart(ch)) {
      const start = i;
      while (i < text.length && isNamePart(text[i])) i += 1;
      push(TOKEN.NAME, text.slice(start, i).toLowerCase(), start);
      continue;
    }

    if (ch === '(' || ch === '[') { push(TOKEN.LPAREN, '(', i); i += 1; continue; }
    if (ch === ')' || ch === ']') { push(TOKEN.RPAREN, ')', i); i += 1; continue; }
    if (ch === ',' || ch === ';') { push(TOKEN.COMMA, ',', i); i += 1; continue; }

    if (text.startsWith('**', i)) { push(TOKEN.OPERATOR, '^', i); i += 2; continue; }
    if (text.startsWith('<<', i)) { push(TOKEN.OPERATOR, '<<', i); i += 2; continue; }
    if (text.startsWith('>>', i)) { push(TOKEN.OPERATOR, '>>', i); i += 2; continue; }

    if (ASCII_OPERATORS.has(ch)) { push(TOKEN.OPERATOR, ch, i); i += 1; continue; }

    throw new CalcError(`Unexpected character "${ch}"`, i);
  }

  push(TOKEN.END, null, text.length);
  return tokens;
}

/** Split a multi-expression input on top-level commas, semicolons and
 *  newlines. Separators nested inside parentheses (function arguments)
 *  are left alone, which is what lets `max(1,2)` survive a "list". */
export function splitExpressions(source) {
  const text = String(source ?? '');
  const parts = [];
  let depth = 0;
  let current = '';
  for (const ch of text) {
    if (ch === '(' || ch === '[') depth += 1;
    else if (ch === ')' || ch === ']') depth = Math.max(0, depth - 1);
    if (depth === 0 && (ch === ',' || ch === ';' || ch === '\n')) {
      parts.push(current);
      current = '';
      continue;
    }
    current += ch;
  }
  parts.push(current);
  return parts.map((part) => part.trim()).filter((part) => part.length > 0);
}
