/* Currency conversion from a USER-SUPPLIED rate table.
 *
 * There is no live rate here and there cannot be: the panel's CSP
 * forbids third-party origins and the extension host API exposes no
 * HTTP. Rather than pretend, the table ships as a dated seed the user
 * edits or replaces by pasting `CODE=rate` lines or a two-column CSV.
 * Every readout carries the table's own "as of" date so a stale number
 * is visibly stale instead of quietly wrong.
 *
 * Rates are expressed as "units of CODE per 1 unit of the base" (USD),
 * which is how every published table is shaped, so a pasted row needs
 * no arithmetic before it is stored.
 */

export const BASE_CODE = 'USD';

/** Seed table. Indicative mid-market figures recorded on this date;
 *  they are a starting point to edit, not a quote. */
export const SEED_AS_OF = '2026-09-20';

export const SEED_RATES = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.78,
  JPY: 152,
  CHF: 0.88,
  CAD: 1.36,
  AUD: 1.5,
  NZD: 1.64,
  CNY: 7.15,
  HKD: 7.82,
  SGD: 1.34,
  INR: 83.5,
  KRW: 1345,
  MXN: 17.2,
  BRL: 5.45,
  ARS: 980,
  CLP: 945,
  COP: 4050,
  DOP: 59.5,
  ZAR: 18.4,
  SEK: 10.6,
  NOK: 10.8,
  DKK: 6.86,
  PLN: 3.98,
  CZK: 23.2,
  HUF: 360,
  TRY: 33.5,
  ILS: 3.72,
  AED: 3.6725,
  SAR: 3.75,
  THB: 35.4,
  PHP: 56.5,
  IDR: 15600,
  MYR: 4.65,
  VND: 24800,
  NGN: 1550,
  EGP: 48.5,
  KES: 129,
  UAH: 41.2,
  RON: 4.57,
};

export const DEFAULT_TABLE = Object.freeze({
  base: BASE_CODE,
  asOf: SEED_AS_OF,
  source: 'seed',
  rates: { ...SEED_RATES },
});

const CODE_PATTERN = /^[A-Z]{2,6}$/;

/** Parse pasted rates. Accepts `EUR=0.92`, `EUR 0.92`, `EUR:0.92`,
 *  `EUR,0.92` and a CSV with an optional header row. Returns the valid
 *  rows plus the rejected lines so the UI can show both. */
export function parseRateText(text) {
  const rates = {};
  const invalid = [];
  for (const rawLine of String(text ?? '').split(/[\n\r]+/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const match = line.match(/^([A-Za-z]{2,6})\s*[=:,\t ]\s*(-?[\d.eE+]+)\s*$/);
    if (!match) {
      // A CSV header ("code,rate") is expected, not an error worth showing.
      if (!/^[A-Za-z ,;\t"']+$/.test(line)) invalid.push(line);
      continue;
    }
    const code = match[1].toUpperCase();
    const rate = Number(match[2]);
    if (!CODE_PATTERN.test(code) || !Number.isFinite(rate) || rate <= 0) {
      invalid.push(line);
      continue;
    }
    rates[code] = rate;
  }
  return { rates, invalid };
}

/** Merge parsed rows into an existing table, keeping the base at 1. */
export function mergeRates(table, rates, asOf) {
  const next = {
    base: table?.base ?? BASE_CODE,
    asOf: asOf || table?.asOf || SEED_AS_OF,
    source: 'user',
    rates: { ...(table?.rates ?? {}), ...rates },
  };
  next.rates[next.base] = 1;
  return next;
}

/** Sanity-check a table loaded from storage before trusting it. */
export function normalizeTable(value) {
  if (!value || typeof value !== 'object' || typeof value.rates !== 'object') {
    return { ...DEFAULT_TABLE, rates: { ...SEED_RATES } };
  }
  const base = CODE_PATTERN.test(String(value.base ?? '')) ? String(value.base) : BASE_CODE;
  const rates = {};
  for (const [code, rate] of Object.entries(value.rates)) {
    const upper = String(code).toUpperCase();
    const numeric = Number(rate);
    if (CODE_PATTERN.test(upper) && Number.isFinite(numeric) && numeric > 0) rates[upper] = numeric;
  }
  if (!Object.keys(rates).length) return { ...DEFAULT_TABLE, rates: { ...SEED_RATES } };
  rates[base] = rates[base] ?? 1;
  return {
    base,
    asOf: typeof value.asOf === 'string' && value.asOf ? value.asOf : SEED_AS_OF,
    source: value.source === 'user' ? 'user' : 'seed',
    rates,
  };
}

/** Cross-rate through the table's base. Returns NaN when either code
 *  is missing so the UI can name the one it does not have. */
export function convertCurrency(table, fromCode, toCode, amount) {
  const rates = table?.rates ?? {};
  const from = rates[String(fromCode ?? '').toUpperCase()];
  const to = rates[String(toCode ?? '').toUpperCase()];
  if (!Number.isFinite(from) || !Number.isFinite(to) || !Number.isFinite(amount)) return NaN;
  if (from === 0) return NaN;
  return (amount / from) * to;
}

/** Sorted currency codes, base first, for the pickers. */
export function listCodes(table) {
  const base = table?.base ?? BASE_CODE;
  const codes = Object.keys(table?.rates ?? {}).sort();
  return [base, ...codes.filter((code) => code !== base)];
}

/** Render the table back into the paste format so "export" and
 *  "import" are the same text. */
export function serializeRates(table) {
  const base = table?.base ?? BASE_CODE;
  const lines = [`# rates per 1 ${base}, as of ${table?.asOf ?? SEED_AS_OF}`];
  for (const code of Object.keys(table?.rates ?? {}).sort()) {
    lines.push(`${code}=${table.rates[code]}`);
  }
  return lines.join('\n');
}
