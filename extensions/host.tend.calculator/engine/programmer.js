/* Fixed-width integer arithmetic for the programmer mode.
 *
 * Everything is BigInt, including the 8/16/32-bit words. Doing 64-bit
 * work with doubles loses the low bits above 2^53, and mixing two
 * numeric types by word size would mean two code paths and two sets of
 * bugs. BigInt costs nothing at keypad speeds.
 *
 * The stored value is always the RAW word (unsigned, already masked).
 * `signed` is a display and division concern, not a storage concern —
 * that is what two's complement means.
 */
import { CalcError } from './tokenize.js';

export const WORD_SIZES = [8, 16, 32, 64];
export const BASES = [
  { id: 'hex', radix: 16, label: 'HEX' },
  { id: 'dec', radix: 10, label: 'DEC' },
  { id: 'oct', radix: 8, label: 'OCT' },
  { id: 'bin', radix: 2, label: 'BIN' },
];

const DIGITS = '0123456789ABCDEF';

export function maskFor(bits) {
  return (1n << BigInt(bits)) - 1n;
}

/** Reduce any BigInt to the raw bit pattern of a `bits`-wide word. */
export function toWord(value, bits) {
  const mask = maskFor(bits);
  return ((BigInt(value) % (mask + 1n)) + mask + 1n) & mask;
}

/** Interpret a raw word as a signed two's complement integer. */
export function toSigned(word, bits) {
  const raw = toWord(word, bits);
  const limit = 1n << BigInt(bits - 1);
  return raw >= limit ? raw - (1n << BigInt(bits)) : raw;
}

/** The value the DEC readout shows for the current signedness. */
export function displayValue(word, bits, signed) {
  return signed ? toSigned(word, bits) : toWord(word, bits);
}

/** Render a raw word in one of the four bases. HEX/OCT/BIN always show
 *  the bit pattern; only DEC honours the two's complement toggle. */
export function formatInBase(word, radix, bits, signed = false) {
  const raw = toWord(word, bits);
  if (radix === 10) return displayValue(raw, bits, signed).toString(10);
  return raw.toString(radix).toUpperCase();
}

/** Group a rendered word for readability: nibbles for binary, pairs of
 *  bytes for hex, threes for decimal. */
export function groupForBase(text, radix) {
  if (radix === 10) {
    const negative = text.startsWith('-');
    const body = negative ? text.slice(1) : text;
    return (negative ? '-' : '') + body.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  const size = radix === 2 ? 4 : radix === 16 ? 4 : 3;
  const pattern = new RegExp(`\\B(?=([0-9A-F]{${size}})+$)`, 'g');
  return text.replace(pattern, ' ');
}

/** Parse user text in a base into a raw word. Rejects out-of-range
 *  digits rather than silently dropping them. */
export function parseInBase(text, radix, bits, signed = false) {
  const cleaned = String(text ?? '').trim().replace(/[\s,_]/g, '').toUpperCase();
  if (!cleaned || cleaned === '-') return 0n;
  const negative = cleaned.startsWith('-');
  const body = negative ? cleaned.slice(1) : cleaned;
  if (negative && (radix !== 10 || !signed)) {
    throw new CalcError('Negative input needs DEC with two’s complement on');
  }
  const allowed = DIGITS.slice(0, radix);
  let value = 0n;
  for (const ch of body) {
    const digit = allowed.indexOf(ch);
    if (digit < 0) throw new CalcError(`"${ch}" is not a valid digit in base ${radix}`);
    value = value * BigInt(radix) + BigInt(digit);
  }
  return toWord(negative ? -value : value, bits);
}

/** True when the value needed masking to fit the word — the UI shows a
 *  quiet "truncated to N bits" hint instead of lying about the result. */
export function overflows(value, bits) {
  const raw = BigInt(value);
  return raw < 0n ? toSigned(toWord(raw, bits), bits) !== raw : toWord(raw, bits) !== raw;
}

export function bitwise(op, a, b, bits) {
  const x = toWord(a, bits);
  const y = toWord(b, bits);
  switch (op) {
    case 'and': return toWord(x & y, bits);
    case 'or': return toWord(x | y, bits);
    case 'xor': return toWord(x ^ y, bits);
    case 'nand': return toWord(~(x & y), bits);
    case 'nor': return toWord(~(x | y), bits);
    default: throw new CalcError(`Unknown bitwise operation "${op}"`);
  }
}

export function notWord(a, bits) {
  return toWord(~toWord(a, bits), bits);
}

/** `shl`/`shr` are logical; `sar` keeps the sign bit (arithmetic). */
export function shift(op, value, amount, bits) {
  const word = toWord(value, bits);
  const by = BigInt(Math.max(0, Number(amount)));
  if (by >= BigInt(bits)) {
    if (op === 'sar') return toSigned(word, bits) < 0n ? maskFor(bits) : 0n;
    return 0n;
  }
  switch (op) {
    case 'shl': return toWord(word << by, bits);
    case 'shr': return toWord(word >> by, bits);
    case 'sar': return toWord(toSigned(word, bits) >> by, bits);
    default: throw new CalcError(`Unknown shift "${op}"`);
  }
}

export function rotate(op, value, amount, bits) {
  const word = toWord(value, bits);
  const width = BigInt(bits);
  const by = ((BigInt(Math.max(0, Number(amount))) % width) + width) % width;
  if (by === 0n) return word;
  if (op === 'rol') return toWord((word << by) | (word >> (width - by)), bits);
  if (op === 'ror') return toWord((word >> by) | (word << (width - by)), bits);
  throw new CalcError(`Unknown rotate "${op}"`);
}

/** Integer arithmetic that stays inside the word. */
export function arithmetic(op, a, b, bits, signed = false) {
  const x = signed ? toSigned(a, bits) : toWord(a, bits);
  const y = signed ? toSigned(b, bits) : toWord(b, bits);
  switch (op) {
    case 'add': return toWord(x + y, bits);
    case 'sub': return toWord(x - y, bits);
    case 'mul': return toWord(x * y, bits);
    case 'div':
      if (y === 0n) throw new CalcError('Cannot divide by zero');
      return toWord(x / y, bits);
    case 'mod':
      if (y === 0n) throw new CalcError('Cannot divide by zero');
      return toWord(x % y, bits);
    default: throw new CalcError(`Unknown operation "${op}"`);
  }
}

/** LSB-first array of 0/1 for the bit-toggle grid. */
export function bitsOf(value, bits) {
  const word = toWord(value, bits);
  const out = new Array(bits);
  for (let i = 0; i < bits; i += 1) out[i] = Number((word >> BigInt(i)) & 1n);
  return out;
}

export function toggleBit(value, index, bits) {
  if (index < 0 || index >= bits) return toWord(value, bits);
  return toWord(toWord(value, bits) ^ (1n << BigInt(index)), bits);
}

/** How many bits are set — useful and one line. */
export function popCount(value, bits) {
  return bitsOf(value, bits).reduce((total, bit) => total + bit, 0);
}
