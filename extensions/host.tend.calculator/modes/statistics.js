/* Statistics mode.
 *
 * Two inputs on one screen: a single-column dataset for the summary and
 * an `x y` per line dataset for the regression. They are separate boxes
 * because mixing them means guessing what the user meant, and a
 * statistics tool that guesses is worse than one that asks.
 */
import { parseDataset, parsePairs, summarize, linearRegression } from '../engine/statistics.js';
import { formatNumber } from '../engine/format.js';
import { el, clear, copyButton, readout } from '../ui/dom.js';

const SAMPLE = '12, 15, 15, 18, 21, 24, 30';

function show(value) {
  return Number.isFinite(value) ? formatNumber(value) : '—';
}

export function createStatisticsMode(ctx) {
  let summaryText = '';

  const valuesInput = el('textarea', {
    class: 'calc-textarea',
    attrs: {
      rows: '3', spellcheck: 'false', 'aria-label': 'Dataset values',
      placeholder: `Paste or type values — ${SAMPLE}`,
    },
    on: { input: () => render() },
  });

  const pairsInput = el('textarea', {
    class: 'calc-textarea',
    attrs: {
      rows: '3', spellcheck: 'false', 'aria-label': 'Paired data, x and y per line',
      placeholder: '1 2\n2 4.1\n3 5.9',
    },
    on: { input: () => render() },
  });

  const summaryEl = el('div', { attrs: { 'aria-live': 'polite' } });
  const regressionEl = el('div', { attrs: { 'aria-live': 'polite' } });
  const warningEl = el('p', { class: 'calc-error', style: { textAlign: 'left' } });

  const root = el('div', { class: 'calc-mode is-stacked calc-scroll' }, [
    el('div', { class: 'calc-stack' }, [
      el('section', { class: 'calc-section' }, [
        el('h3', { text: 'Dataset' }),
        valuesInput,
        el('div', { class: 'calc-chiprow' }, [
          el('button', {
            class: 'calc-chip', text: 'Commit to tape',
            attrs: { type: 'button', 'aria-label': 'Commit the summary to history' },
            on: { click: commit },
          }),
          copyButton(() => summaryText, ctx.copy, 'Copy summary'),
          el('button', {
            class: 'calc-chip', text: 'Clear',
            attrs: { type: 'button', 'aria-label': 'Clear the dataset' },
            on: { click: () => { valuesInput.value = ''; render(); } },
          }),
        ]),
        warningEl,
        summaryEl,
      ]),
      el('section', { class: 'calc-section' }, [
        el('h3', { text: 'Linear regression (x y per line)' }),
        pairsInput,
        regressionEl,
      ]),
      el('p', {
        class: 'calc-note',
        text: 'Quartiles use linear interpolation (the Excel QUARTILE.INC / NumPy default). Sample statistics divide by n−1, population statistics by n.',
      }),
    ]),
  ]);

  function render() {
    const { values, invalid } = parseDataset(valuesInput.value);
    warningEl.textContent = invalid.length ? `Ignored: ${invalid.slice(0, 5).join(', ')}` : '';
    clear(summaryEl);
    const stats = summarize(values);
    if (!stats) {
      summaryText = '';
      summaryEl.appendChild(el('p', { class: 'calc-hint', text: 'Enter at least one value.' }));
    } else {
      const rows = [
        ['n', show(stats.n)],
        ['Sum', show(stats.sum)],
        ['Mean', show(stats.mean), 'strong'],
        ['Median', show(stats.median)],
        ['Mode', stats.modes.length ? stats.modes.map((value) => formatNumber(value)).join(', ') : 'none'],
        ['Min / Max', `${show(stats.min)} / ${show(stats.max)}`],
        ['Range', show(stats.range)],
        ['Q1 / Q2 / Q3', `${show(stats.q1)} / ${show(stats.q2)} / ${show(stats.q3)}`],
        ['IQR', show(stats.iqr)],
        ['σ (population)', show(stats.stdDevPopulation)],
        ['s (sample)', show(stats.stdDevSample)],
        ['σ² (population)', show(stats.variancePopulation)],
        ['s² (sample)', show(stats.varianceSample)],
      ];
      summaryEl.appendChild(readout(rows));
      summaryText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
    }

    clear(regressionEl);
    const { pairs, invalid: badPairs } = parsePairs(pairsInput.value);
    const model = linearRegression(pairs);
    if (!model) {
      regressionEl.appendChild(el('p', {
        class: 'calc-hint',
        text: pairs.length ? 'Need at least two points with different x values.' : 'Enter pairs to fit a line.',
      }));
    } else {
      regressionEl.appendChild(readout([
        ['Fit', `y = ${formatNumber(model.slope)}x ${model.intercept < 0 ? '−' : '+'} ${formatNumber(Math.abs(model.intercept))}`, 'strong'],
        ['Slope', show(model.slope)],
        ['Intercept', show(model.intercept)],
        ['r', show(model.r)],
        ['r²', show(model.r2)],
        ['n', show(model.n)],
      ]));
    }
    if (badPairs.length) {
      regressionEl.appendChild(el('p', { class: 'calc-error', style: { textAlign: 'left' }, text: `Ignored: ${badPairs.slice(0, 3).join(' · ')}` }));
    }
  }

  function commit() {
    const { values } = parseDataset(valuesInput.value);
    const stats = summarize(values);
    if (!stats) return;
    ctx.setAns(stats.mean);
    ctx.commit({
      mode: 'Statistics',
      expression: `n=${stats.n} mean, sd`,
      result: `${formatNumber(stats.mean)} ± ${formatNumber(stats.stdDevSample)}`,
    });
  }

  render();

  return {
    id: 'statistics',
    label: 'Statistics',
    element: root,
    focus() { valuesInput.focus(); },
    handleKey(event) {
      // The textareas own every key while focused; nothing else here
      // has a shortcut worth stealing.
      return event.target === valuesInput || event.target === pairsInput;
    },
    resultText: () => summaryText,
    load(entry, what) {
      valuesInput.value = what === 'result' ? String(entry.result) : String(entry.expression);
      render();
    },
    refresh: render,
    destroy() {},
  };
}
