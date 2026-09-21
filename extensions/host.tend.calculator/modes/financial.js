/* Financial mode.
 *
 * A calculator rather than a spreadsheet: labelled fields with their
 * units, one result block per tool, and a scrollable amortization
 * schedule that stays inside the fixed panel. Every result block is
 * copyable as plain text, because the next thing anyone does with a
 * loan number is paste it somewhere.
 */
import {
  amortizationSchedule, cagr, compoundInterest, loanPayment,
  percentChange, roi, simpleInterest, tipSplit,
} from '../engine/finance.js';
import { formatFixed, formatNumber } from '../engine/format.js';
import { el, clear, copyButton, field, readout, segmented } from '../ui/dom.js';

const TOOLS = [
  { id: 'loan', label: 'Loan' },
  { id: 'interest', label: 'Interest' },
  { id: 'tip', label: 'Tip' },
  { id: 'growth', label: 'Growth' },
];

function money(value) {
  return Number.isFinite(value) ? formatFixed(value, 2) : '—';
}

export function createFinancialMode(ctx) {
  let tool = ctx.store.peek('fin.tool', 'loan');
  let resultText = '';

  const body = el('div', { class: 'calc-stack' });
  const resultsEl = el('div', { attrs: { 'aria-live': 'polite' } });
  const scheduleEl = el('div', { class: 'calc-scroll', style: { maxHeight: '190px' } });

  const picker = segmented(TOOLS, tool, (next) => {
    tool = next;
    ctx.store.set('fin.tool', next);
    picker.select(next);
    build();
  }, 'Financial tool');

  const root = el('div', { class: 'calc-mode is-stacked calc-scroll' }, [
    el('div', { class: 'calc-stack' }, [picker.element, body, resultsEl, scheduleEl]),
  ]);

  const inputs = new Map();

  function numberField(name, label, value, suffix, step) {
    const created = field({
      name, label, value, suffix, type: 'number', step: step ?? 'any',
      on: { input: () => compute() },
    });
    inputs.set(name, created.input);
    return created.element;
  }

  function readNumber(name, fallback = 0) {
    const raw = inputs.get(name)?.value ?? '';
    const value = Number(raw);
    return Number.isFinite(value) ? value : fallback;
  }

  function build() {
    inputs.clear();
    clear(body);
    clear(scheduleEl);
    if (tool === 'loan') {
      body.appendChild(el('div', { class: 'calc-row' }, [
        numberField('principal', 'Loan amount', 250000, ''),
        numberField('rate', 'Annual rate', 6.25, '%'),
      ]));
      body.appendChild(el('div', { class: 'calc-row' }, [
        numberField('years', 'Term', 30, 'years'),
        numberField('extra', 'Extra / month', 0, ''),
      ]));
    } else if (tool === 'interest') {
      body.appendChild(el('div', { class: 'calc-row' }, [
        numberField('principal', 'Principal', 10000, ''),
        numberField('rate', 'Annual rate', 5, '%'),
      ]));
      body.appendChild(el('div', { class: 'calc-row is-three' }, [
        numberField('years', 'Years', 10, ''),
        numberField('periods', 'Compounds / yr', 12, ''),
        numberField('contribution', 'Added / period', 0, ''),
      ]));
    } else if (tool === 'tip') {
      body.appendChild(el('div', { class: 'calc-row is-three' }, [
        numberField('bill', 'Bill', 84.5, ''),
        numberField('tip', 'Tip', 18, '%'),
        numberField('people', 'Split', 2, 'ways'),
      ]));
    } else {
      body.appendChild(el('div', { class: 'calc-row is-three' }, [
        numberField('initial', 'Initial', 10000, ''),
        numberField('final', 'Final', 18500, ''),
        numberField('years', 'Years', 5, ''),
      ]));
    }
    compute();
  }

  function compute() {
    clear(resultsEl);
    clear(scheduleEl);
    let rows = [];
    if (tool === 'loan') {
      const principal = readNumber('principal');
      const rate = readNumber('rate');
      const months = Math.round(readNumber('years') * 12);
      const extra = readNumber('extra');
      const schedule = amortizationSchedule({ principal, annualRatePercent: rate, months });
      const payment = schedule.payment;
      rows = [
        ['Monthly payment', money(payment), 'strong'],
        ['With extra', money(payment + extra)],
        ['Total interest', money(schedule.totalInterest)],
        ['Total paid', money(schedule.totalPaid)],
        ['Payments', Number.isFinite(payment) ? String(months) : '—'],
      ];
      if (extra > 0) rows.push(['Payoff with extra', `${formatNumber(payoffMonths(principal, rate, payment + extra))} months`]);
      renderSchedule(schedule);
    } else if (tool === 'interest') {
      const principal = readNumber('principal');
      const rate = readNumber('rate');
      const years = readNumber('years');
      const periods = Math.max(1, Math.round(readNumber('periods', 12)));
      const contribution = readNumber('contribution');
      const compound = compoundInterest({
        principal, annualRatePercent: rate, years, compoundsPerYear: periods, contribution,
      });
      const simple = simpleInterest({ principal, annualRatePercent: rate, years });
      rows = [
        ['Compound total', money(compound.total), 'strong'],
        ['Compound interest', money(compound.interest)],
        ['Invested', money(compound.invested)],
        ['Simple total', money(simple.total)],
        ['Simple interest', money(simple.interest)],
        ['Effective annual', `${formatFixed(compound.effectiveRate * 100, 3)}%`],
      ];
    } else if (tool === 'tip') {
      const result = tipSplit({
        bill: readNumber('bill'), tipPercent: readNumber('tip'), people: readNumber('people', 1),
      });
      rows = [
        ['Per person', money(result.perPerson), 'strong'],
        ['Tip', money(result.tip)],
        ['Total', money(result.total)],
        ['Tip per person', money(result.tipPerPerson)],
        ['Splitting', `${result.people} ways`],
      ];
    } else {
      const initial = readNumber('initial');
      const finalValue = readNumber('final');
      const years = readNumber('years');
      const returnOnInvestment = roi({ initial, final: finalValue });
      rows = [
        ['ROI', Number.isFinite(returnOnInvestment.percent) ? `${formatFixed(returnOnInvestment.percent, 2)}%` : '—', 'strong'],
        ['Gain', money(returnOnInvestment.gain)],
        ['CAGR', Number.isFinite(cagr({ initial, final: finalValue, years })) ? `${formatFixed(cagr({ initial, final: finalValue, years }), 3)}%` : '—'],
        ['Percent change', Number.isFinite(percentChange(initial, finalValue)) ? `${formatFixed(percentChange(initial, finalValue), 2)}%` : '—'],
        ['Multiple', initial ? `${formatNumber(finalValue / initial)}×` : '—'],
      ];
    }
    resultsEl.appendChild(readout(rows));
    resultText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
    resultsEl.appendChild(el('div', { class: 'calc-chiprow', style: { justifyContent: 'flex-end' } }, [
      copyButton(() => resultText, ctx.copy),
      el('button', {
        class: 'calc-chip', text: 'To tape',
        attrs: { type: 'button', 'aria-label': 'Commit this result to history' },
        on: {
          click: () => {
            ctx.commit({ mode: 'Financial', expression: `${tool}: ${rows[0][0]}`, result: rows[0][1] });
            const numeric = Number(String(rows[0][1]).replace(/[^0-9.-]/g, ''));
            if (Number.isFinite(numeric)) ctx.setAns(numeric);
          },
        },
      }),
    ]));
  }

  /** How many payments a larger instalment actually needs. Closed form
   *  so a 40-year term does not become a loop. */
  function payoffMonths(principal, annualRatePercent, payment) {
    const rate = annualRatePercent / 100 / 12;
    if (!(payment > 0)) return NaN;
    if (rate === 0) return Math.ceil(principal / payment);
    if (payment <= principal * rate) return Infinity;
    return Math.ceil(-Math.log(1 - (principal * rate) / payment) / Math.log(1 + rate));
  }

  function renderSchedule(schedule) {
    if (!schedule.rows.length) return;
    const table = el('table', { class: 'calc-table', attrs: { 'aria-label': 'Amortization schedule' } }, [
      el('thead', {}, [el('tr', {}, ['#', 'Payment', 'Interest', 'Principal', 'Balance']
        .map((label) => el('th', { text: label, attrs: { scope: 'col' } })))]),
      el('tbody', {}, schedule.rows.map((row) => el('tr', {}, [
        el('td', { text: String(row.period) }),
        el('td', { text: money(row.payment) }),
        el('td', { text: money(row.interest) }),
        el('td', { text: money(row.principal) }),
        el('td', { text: money(row.balance) }),
      ]))),
    ]);
    scheduleEl.appendChild(table);
    if (schedule.truncated) {
      scheduleEl.appendChild(el('p', { class: 'calc-note', text: 'Schedule truncated to the first 600 payments.' }));
    }
  }

  build();

  return {
    id: 'financial',
    label: 'Financial',
    element: root,
    handleKey(event) { return event.target instanceof HTMLInputElement; },
    resultText: () => resultText,
    load() { /* financial inputs are structured; history does not map onto them */ },
    refresh: compute,
    destroy() {},
  };
}
