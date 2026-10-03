/* Strict JSON parsing with exact error positions.
 *
 * `JSON.parse` words its errors differently in every engine and only some
 * of them carry a position, so this module parses on its own. That also
 * lets the formatter keep numbers exactly as typed (12345678901234567890
 * survives, JSON.parse would round it) and keep duplicate keys.
 *
 * Pure: no DOM, no host. Positions are UTF-16 offsets; line and column
 * are 1-based.
 */

const MAX_DEPTH = 400;
const NUMBER = /-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?/y;

/** 1-based line and column of an offset in `text`. */
export function locate(text, index) {
  const end = Math.max(0, Math.min(index, text.length));
  let line = 1;
  let lineStart = 0;
  for (let i = 0; i < end; i += 1) {
    if (text.charCodeAt(i) === 10) {
      line += 1;
      lineStart = i + 1;
    }
  }
  return { line, column: end - lineStart + 1 };
}

class JsonError extends Error {
  constructor(message, index) {
    super(message);
    this.index = index;
  }
}

function describeChar(ch) {
  if (ch === undefined) return 'end of input';
  if (ch === '\n') return 'a line break';
  if (ch === '\t') return 'a tab';
  return `'${ch}'`;
}

function parseValue(src, pos, depth) {
  if (depth > MAX_DEPTH) throw new JsonError('Nesting is too deep', pos);
  const ch = src[pos];
  if (ch === '{') return parseObject(src, pos, depth);
  if (ch === '[') return parseArray(src, pos, depth);
  if (ch === '"') return parseString(src, pos);
  if (ch === '-' || (ch >= '0' && ch <= '9')) return parseNumber(src, pos);
  for (const word of ['true', 'false', 'null']) {
    if (src.startsWith(word, pos)) {
      const next = src[pos + word.length];
      if (next === undefined || !/[A-Za-z0-9_$]/.test(next)) {
        return { node: { t: 'lit', raw: word }, end: pos + word.length };
      }
    }
  }
  if (ch === undefined) throw new JsonError('Unexpected end of input, expected a value', pos);
  throw new JsonError(`Unexpected ${describeChar(ch)}, expected a value`, pos);
}

function skipSpace(src, pos) {
  let i = pos;
  while (i < src.length) {
    const c = src.charCodeAt(i);
    if (c === 32 || c === 10 || c === 13 || c === 9) i += 1;
    else break;
  }
  return i;
}

function parseNumber(src, pos) {
  NUMBER.lastIndex = pos;
  const match = NUMBER.exec(src);
  if (!match) {
    const after = src[pos + 1];
    throw new JsonError(`Invalid number, unexpected ${describeChar(after)} after '-'`, pos + 1);
  }
  const end = pos + match[0].length;
  const next = src[end];
  if (next !== undefined && /[0-9.eE+\-]/.test(next)) {
    throw new JsonError(`Invalid number, unexpected ${describeChar(next)}`, end);
  }
  return { node: { t: 'lit', raw: match[0] }, end };
}

function parseString(src, pos) {
  let i = pos + 1;
  while (i < src.length) {
    const c = src[i];
    if (c === '"') {
      const raw = src.slice(pos, i + 1);
      return { node: { t: 'str', raw, value: JSON.parse(raw) }, end: i + 1 };
    }
    if (c === '\\') {
      const e = src[i + 1];
      if (e === 'u') {
        if (!/^[0-9a-fA-F]{4}$/.test(src.slice(i + 2, i + 6))) {
          throw new JsonError('Invalid \\u escape, expected four hex digits', i);
        }
        i += 6;
        continue;
      }
      if (e === undefined || !'"\\/bfnrt'.includes(e)) {
        throw new JsonError(`Invalid escape sequence \\${e ?? ''}`, i);
      }
      i += 2;
      continue;
    }
    if (c.charCodeAt(0) < 0x20) {
      throw new JsonError('Unescaped control character in a string', i);
    }
    i += 1;
  }
  throw new JsonError('Unterminated string', pos);
}

function parseArray(src, pos, depth) {
  const items = [];
  let i = skipSpace(src, pos + 1);
  if (src[i] === ']') return { node: { t: 'arr', items }, end: i + 1 };
  for (;;) {
    const item = parseValue(src, i, depth + 1);
    items.push(item.node);
    i = skipSpace(src, item.end);
    if (src[i] === ',') {
      const after = skipSpace(src, i + 1);
      if (src[after] === ']') throw new JsonError('Trailing comma is not allowed', i);
      i = after;
      continue;
    }
    if (src[i] === ']') return { node: { t: 'arr', items }, end: i + 1 };
    throw new JsonError(`Expected ',' or ']' but found ${describeChar(src[i])}`, i);
  }
}

function parseObject(src, pos, depth) {
  const members = [];
  let i = skipSpace(src, pos + 1);
  if (src[i] === '}') return { node: { t: 'obj', members }, end: i + 1 };
  for (;;) {
    if (src[i] !== '"') {
      const hint = src[i] === '}' ? 'Trailing comma is not allowed' : `Expected a property name in double quotes but found ${describeChar(src[i])}`;
      throw new JsonError(hint, i);
    }
    const key = parseString(src, i);
    i = skipSpace(src, key.end);
    if (src[i] !== ':') throw new JsonError(`Expected ':' after the property name but found ${describeChar(src[i])}`, i);
    i = skipSpace(src, i + 1);
    const value = parseValue(src, i, depth + 1);
    members.push({ key: key.node, value: value.node });
    i = skipSpace(src, value.end);
    if (src[i] === ',') {
      const comma = i;
      i = skipSpace(src, i + 1);
      if (src[i] === '}') throw new JsonError('Trailing comma is not allowed', comma);
      continue;
    }
    if (src[i] === '}') return { node: { t: 'obj', members }, end: i + 1 };
    throw new JsonError(`Expected ',' or '}' but found ${describeChar(src[i])}`, i);
  }
}

/** Parse `text`. Returns `{ ok: true, ast }` or
 *  `{ ok: false, error: { message, index, line, column } }`. */
export function parseJson(text) {
  const src = String(text ?? '');
  try {
    const start = skipSpace(src, 0);
    if (start >= src.length) throw new JsonError('Nothing to parse, the input is empty', 0);
    const result = parseValue(src, start, 0);
    const rest = skipSpace(src, result.end);
    if (rest < src.length) {
      throw new JsonError(`Unexpected content after the JSON value: ${describeChar(src[rest])}`, rest);
    }
    return { ok: true, ast: result.node };
  } catch (error) {
    if (!(error instanceof JsonError)) throw error;
    return { ok: false, error: { message: error.message, index: error.index, ...locate(src, error.index) } };
  }
}

function compareKeys(a, b) {
  if (a.key.value < b.key.value) return -1;
  if (a.key.value > b.key.value) return 1;
  return 0;
}

function sortNode(node) {
  if (node.t === 'arr') return { t: 'arr', items: node.items.map(sortNode) };
  if (node.t === 'obj') {
    const members = node.members.map((m) => ({ key: m.key, value: sortNode(m.value) }));
    members.sort(compareKeys);
    return { t: 'obj', members };
  }
  return node;
}

/** `indent` is a number of spaces, 'tab', or 0/'' for minified output. */
function render(node, unit, level) {
  if (node.t === 'lit' || node.t === 'str') return node.raw;
  const items = node.t === 'arr' ? node.items : node.members;
  const [open, close] = node.t === 'arr' ? ['[', ']'] : ['{', '}'];
  if (items.length === 0) return open + close;
  const pieces = items.map((item) => (node.t === 'arr'
    ? render(item, unit, level + 1)
    : `${item.key.raw}:${unit ? ' ' : ''}${render(item.value, unit, level + 1)}`));
  if (!unit) return open + pieces.join(',') + close;
  const pad = unit.repeat(level + 1);
  return `${open}\n${pieces.map((p) => pad + p).join(',\n')}\n${unit.repeat(level)}${close}`;
}

function indentUnit(indent) {
  if (indent === 'tab') return '\t';
  const n = Number(indent);
  return Number.isInteger(n) && n > 0 ? ' '.repeat(Math.min(n, 8)) : '';
}

export function formatJson(text, options = {}) {
  const parsed = parseJson(text);
  if (!parsed.ok) return parsed;
  const ast = options.sortKeys ? sortNode(parsed.ast) : parsed.ast;
  return { ok: true, text: render(ast, indentUnit(options.indent ?? 2), 0) };
}

export function minifyJson(text, options = {}) {
  const parsed = parseJson(text);
  if (!parsed.ok) return parsed;
  const ast = options.sortKeys ? sortNode(parsed.ast) : parsed.ast;
  return { ok: true, text: render(ast, '', 0) };
}

/** One-line error text such as "Line 3, column 5: Trailing comma is not allowed". */
export function describeError(error) {
  return `Line ${error.line}, column ${error.column}: ${error.message}`;
}
