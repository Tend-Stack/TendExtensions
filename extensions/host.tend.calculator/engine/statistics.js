/* Descriptive statistics and simple linear regression.
 *
 * Pure functions over plain arrays so the whole module is testable
 * without a DOM. Quartiles use the linear-interpolation ("inclusive")
 * method — the one Excel's QUARTILE.INC and NumPy's default percentile
 * agree on — and the UI says so, because quartile conventions differ
 * and a number without its convention is not an answer.
 */

/** Pull numbers out of free text: newlines, commas, spaces, tabs. */
export function parseDataset(text) {
  const values = [];
  const invalid = [];
  for (const token of String(text ?? '').split(/[\s,;]+/)) {
    if (!token) continue;
    const value = Number(token);
    if (Number.isFinite(value)) values.push(value);
    else invalid.push(token);
  }
  return { values, invalid };
}

/** Pull `x y` / `x,y` pairs, one per line, for the regression. */
export function parsePairs(text) {
  const pairs = [];
  const invalid = [];
  for (const rawLine of String(text ?? '').split(/[\n;]+/)) {
    const line = rawLine.trim();
    if (!line) continue;
    const parts = line.split(/[\s,\t]+/).filter(Boolean);
    const x = Number(parts[0]);
    const y = Number(parts[1]);
    if (parts.length >= 2 && Number.isFinite(x) && Number.isFinite(y)) pairs.push({ x, y });
    else invalid.push(line);
  }
  return { pairs, invalid };
}

/** Linear-interpolation percentile over a sorted copy. */
export function percentile(values, fraction) {
  if (!values.length) return NaN;
  const sorted = [...values].sort((a, b) => a - b);
  if (sorted.length === 1) return sorted[0];
  const position = fraction * (sorted.length - 1);
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (position - lower);
}

export function median(values) {
  return percentile(values, 0.5);
}

/** Every value that ties for the highest count. Returns [] when every
 *  value is unique — "no mode" is a real answer, not an empty cell. */
export function modes(values) {
  const counts = new Map();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  let best = 0;
  for (const count of counts.values()) best = Math.max(best, count);
  if (best <= 1) return [];
  return [...counts.entries()]
    .filter(([, count]) => count === best)
    .map(([value]) => value)
    .sort((a, b) => a - b);
}

/** Summarise a dataset. Sample statistics need n >= 2 and report NaN
 *  below that rather than pretending a single point has spread. */
export function summarize(values) {
  const n = values.length;
  if (!n) return null;
  const sum = values.reduce((total, value) => total + value, 0);
  const mean = sum / n;
  const squaredError = values.reduce((total, value) => total + (value - mean) ** 2, 0);
  const variancePopulation = squaredError / n;
  const varianceSample = n > 1 ? squaredError / (n - 1) : NaN;
  const sorted = [...values].sort((a, b) => a - b);
  const q1 = percentile(sorted, 0.25);
  const q2 = percentile(sorted, 0.5);
  const q3 = percentile(sorted, 0.75);
  return {
    n,
    sum,
    mean,
    median: q2,
    modes: modes(values),
    min: sorted[0],
    max: sorted[n - 1],
    range: sorted[n - 1] - sorted[0],
    variancePopulation,
    varianceSample,
    stdDevPopulation: Math.sqrt(variancePopulation),
    stdDevSample: n > 1 ? Math.sqrt(varianceSample) : NaN,
    q1,
    q2,
    q3,
    iqr: q3 - q1,
    sumSquares: values.reduce((total, value) => total + value * value, 0),
  };
}

/** Ordinary least squares y = slope·x + intercept, plus Pearson r.
 *  Returns null when the x values have no spread (a vertical line has
 *  no slope, and reporting Infinity would be worse than saying so). */
export function linearRegression(pairs) {
  const n = pairs.length;
  if (n < 2) return null;
  let sumX = 0;
  let sumY = 0;
  for (const { x, y } of pairs) { sumX += x; sumY += y; }
  const meanX = sumX / n;
  const meanY = sumY / n;
  let sxx = 0;
  let syy = 0;
  let sxy = 0;
  for (const { x, y } of pairs) {
    sxx += (x - meanX) ** 2;
    syy += (y - meanY) ** 2;
    sxy += (x - meanX) * (y - meanY);
  }
  if (sxx === 0) return null;
  const slope = sxy / sxx;
  const intercept = meanY - slope * meanX;
  const r = syy === 0 ? (sxy === 0 ? 1 : 0) : sxy / Math.sqrt(sxx * syy);
  return { n, slope, intercept, r, r2: r * r, meanX, meanY };
}
