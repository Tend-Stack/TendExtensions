/* Financial formulas.
 *
 * Every function takes and returns plain numbers and does no rounding:
 * rounding is a presentation decision and belongs next to the display.
 * The amortization schedule is the one exception — it settles the final
 * payment against the remaining balance so the schedule ends at exactly
 * zero instead of a few cents of drift.
 */

const MONTHS_PER_YEAR = 12;

function monthlyRate(annualRatePercent) {
  return annualRatePercent / 100 / MONTHS_PER_YEAR;
}

/** Level payment on an amortising loan. A 0% loan is principal/months,
 *  which the general formula cannot express (division by zero). */
export function loanPayment({ principal, annualRatePercent, months }) {
  if (!(principal > 0) || !(months > 0)) return NaN;
  const rate = monthlyRate(annualRatePercent);
  if (rate === 0) return principal / months;
  const growth = (1 + rate) ** months;
  return (principal * rate * growth) / (growth - 1);
}

/** Full period-by-period schedule. Cap the row count so a 30-year
 *  weekly schedule cannot lock the panel painting 1,560 rows. */
export function amortizationSchedule({ principal, annualRatePercent, months }, limit = 600) {
  const payment = loanPayment({ principal, annualRatePercent, months });
  if (!Number.isFinite(payment)) return { payment: NaN, rows: [], totalInterest: NaN, totalPaid: NaN };
  const rate = monthlyRate(annualRatePercent);
  const rows = [];
  let balance = principal;
  const count = Math.min(months, limit);
  for (let period = 1; period <= count; period += 1) {
    const interest = balance * rate;
    // The last row pays whatever is actually left, so rounding drift
    // never leaves a phantom balance behind.
    const isLast = period === months;
    const due = isLast ? balance + interest : payment;
    const principalPart = due - interest;
    balance = Math.max(0, balance - principalPart);
    rows.push({ period, payment: due, interest, principal: principalPart, balance });
  }
  // Totals come from the closed form, not from summing the rows, so a
  // truncated schedule still reports the true cost of the loan.
  const totalPaid = payment * months;
  return {
    payment,
    rows,
    truncated: months > count,
    totalInterest: totalPaid - principal,
    totalPaid,
  };
}

export function simpleInterest({ principal, annualRatePercent, years }) {
  const interest = principal * (annualRatePercent / 100) * years;
  return { interest, total: principal + interest };
}

/** Compound interest with optional level contributions at period end
 *  (the future value of an ordinary annuity). */
export function compoundInterest({
  principal,
  annualRatePercent,
  years,
  compoundsPerYear = 12,
  contribution = 0,
}) {
  const periods = compoundsPerYear * years;
  const rate = annualRatePercent / 100 / compoundsPerYear;
  const growth = (1 + rate) ** periods;
  const fromPrincipal = principal * growth;
  const fromContributions = rate === 0
    ? contribution * periods
    : contribution * ((growth - 1) / rate);
  const total = fromPrincipal + fromContributions;
  const invested = principal + contribution * periods;
  return { total, invested, interest: total - invested, periods, effectiveRate: growth ** (1 / Math.max(years, 1e-9)) - 1 };
}

export function tipSplit({ bill, tipPercent, people = 1 }) {
  const heads = Math.max(1, Math.trunc(people));
  const tip = bill * (tipPercent / 100);
  const total = bill + tip;
  return { tip, total, perPerson: total / heads, tipPerPerson: tip / heads, people: heads };
}

/** Return on investment as a percentage of the amount put in. */
export function roi({ initial, final: finalValue }) {
  if (initial === 0) return NaN;
  const gain = finalValue - initial;
  return { gain, percent: (gain / Math.abs(initial)) * 100 };
}

/** Compound annual growth rate. Undefined when the sign flips — you
 *  cannot take a real root of a negative ratio. */
export function cagr({ initial, final: finalValue, years }) {
  if (!(initial > 0) || !(finalValue > 0) || !(years > 0)) return NaN;
  return ((finalValue / initial) ** (1 / years) - 1) * 100;
}

export function percentChange(from, to) {
  if (from === 0) return NaN;
  return ((to - from) / Math.abs(from)) * 100;
}

/** Break-even months: how long a fixed monthly gain takes to repay a
 *  one-off cost. Small, but it is the question behind most ROI asks. */
export function breakEvenMonths({ upfront, monthlyGain }) {
  if (!(monthlyGain > 0)) return NaN;
  return upfront / monthlyGain;
}
