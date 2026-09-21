/* Number formatting for the calculator display.
 *
 * Two jobs that look like one:
 *   - `formatNumber` turns a JS double into the string the user reads.
 *     Doubles carry ~17 significant digits, but the last two are float
 *     noise (0.1 + 0.2 -> 0.30000000000000004). We round to 15
 *     significant digits FOR DISPLAY ONLY — the stored value keeps its
 *     full precision so chained arithmetic never compounds our rounding.
 *   - `groupDigits` adds thousands separators to an already-formatted
 *     string without touching an exponent or a fraction.
 */

/** Significant digits kept when rendering. 15 is the largest width at
 *  which every double round-trips without exposing binary noise. */
export const DISPLAY_SIGNIFICANT = 15;

/** Above this magnitude (or below its reciprocal) we switch to
 *  exponential notation rather than painting 20 zeroes. */
const EXP_HIGH = 1e16;
const EXP_LOW = 1e-6;

export const INFINITY_GLYPH = '∞';

function trimMantissa(text) {
  // "1.2300000000e+21" -> "1.23e+21"; "1.0000000000e+21" -> "1e+21"
  return text
    .replace(/(\.\d*?)0+e/, '$1e')
    .replace(/\.e/, 'e');
}

/** Render a double the way the display wants it. */
export function formatNumber(value, options = {}) {
  const significant = options.significant ?? DISPLAY_SIGNIFICANT;
  if (typeof value === 'bigint') return value.toString();
  if (typeof value !== 'number') return String(value);
  if (Number.isNaN(value)) return 'Not a number';
  if (!Number.isFinite(value)) return (value < 0 ? '-' : '') + INFINITY_GLYPH;
  if (value === 0) return '0';

  // Round away the float noise. Number() re-parses so JS picks the
  // shortest representation that maps back to the same double.
  const rounded = Number(value.toPrecision(significant));
  if (rounded === 0) return '0';
  const abs = Math.abs(rounded);

  if (abs >= EXP_HIGH || abs < EXP_LOW) {
    return trimMantissa(rounded.toExponential(Math.min(15, significant - 1)));
  }
  const plain = String(rounded);
  // String() itself flips to exponential below 1e-6; we already
  // excluded that range, so anything with an `e` here is a surprise.
  return plain.includes('e') ? trimMantissa(rounded.toExponential(significant - 1)) : plain;
}

/** Fixed-decimal rendering for money and percentages. */
export function formatFixed(value, decimals = 2) {
  if (typeof value !== 'number' || Number.isNaN(value)) return 'Not a number';
  if (!Number.isFinite(value)) return (value < 0 ? '-' : '') + INFINITY_GLYPH;
  return value.toFixed(decimals);
}

/** Insert `separator` every three digits of the integer part.
 *  Leaves exponents, fractions and non-numeric text alone. */
export function groupDigits(text, separator = ',') {
  if (typeof text !== 'string') return text;
  if (!/^-?\d+(\.\d+)?$/.test(text)) return text;
  const negative = text.startsWith('-');
  const body = negative ? text.slice(1) : text;
  const dot = body.indexOf('.');
  const whole = dot === -1 ? body : body.slice(0, dot);
  const rest = dot === -1 ? '' : body.slice(dot);
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  return (negative ? '-' : '') + grouped + rest;
}

/** Strip grouping separators so a grouped display value can be parsed. */
export function ungroupDigits(text) {
  return typeof text === 'string' ? text.replace(/,/g, '') : text;
}

/** Percent with a sensible number of decimals for finance readouts. */
export function formatPercent(value, decimals = 2) {
  return `${formatFixed(value, decimals)}%`;
}
