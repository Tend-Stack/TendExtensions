/* Converters mode: offline units and a user-owned currency table.
 *
 * The currency side is honest about what it is. The panel's CSP blocks
 * third-party origins and the extension host API has no HTTP, so there
 * is no live rate to retrieve and no amount of UI polish would make one
 * appear. What the user gets instead is a table they own: a dated seed,
 * a paste box that accepts `CODE=rate` lines or a CSV, and a label that
 * says where the numbers came from.
 */
import { CATEGORIES, convert, getCategory } from '../converters/units.js';
import {
  DEFAULT_TABLE, convertCurrency, listCodes, mergeRates, normalizeTable,
  parseRateText, serializeRates,
} from '../converters/currency.js';
import { formatNumber, groupDigits } from '../engine/format.js';
import { el, clear, copyButton, select, setSelectOptions } from '../ui/dom.js';

export const CURRENCY_KEY = 'currency.table.v1';

export function createConvertersMode(ctx) {
  let categoryId = ctx.store.peek('conv.category', 'length');
  let fromId = ctx.store.peek('conv.from', 'm');
  let toId = ctx.store.peek('conv.to', 'ft');
  let table = normalizeTable(ctx.store.peek(CURRENCY_KEY, DEFAULT_TABLE));
  let currencyFrom = ctx.store.peek('conv.cur.from', 'USD');
  let currencyTo = ctx.store.peek('conv.cur.to', 'EUR');
  let unitResult = '';
  let currencyResult = '';

  // ---- unit converter ----
  const amountInput = el('input', {
    class: 'calc-input',
    attrs: { type: 'number', step: 'any', inputmode: 'decimal', 'aria-label': 'Amount to convert' },
    on: { input: () => renderUnits() },
  });
  amountInput.value = '1';

  const categorySelect = select({
    label: 'Category', showLabel: false,
    options: CATEGORIES.map((item) => ({ value: item.id, label: item.label })),
    value: categoryId,
    on: {
      change: (event) => {
        categoryId = event.target.value;
        const units = getCategory(categoryId).units;
        fromId = units[0].id;
        toId = units[Math.min(1, units.length - 1)].id;
        ctx.store.set('conv.category', categoryId);
        fillUnitSelects();
        renderUnits();
      },
    },
  });

  const fromSelect = select({
    label: 'From', showLabel: false, options: [], value: fromId,
    on: { change: (event) => { fromId = event.target.value; ctx.store.set('conv.from', fromId); renderUnits(); } },
  });
  const toSelect = select({
    label: 'To', showLabel: false, options: [], value: toId,
    on: { change: (event) => { toId = event.target.value; ctx.store.set('conv.to', toId); renderUnits(); } },
  });
  const unitOutput = el('div', { class: 'calc-value', style: { fontSize: '26px', textAlign: 'right' } , text: '—' });
  const unitDetail = el('p', { class: 'calc-hint', style: { textAlign: 'right' } });

  function fillUnitSelects() {
    const units = getCategory(categoryId)?.units ?? [];
    const options = units.map((unit) => ({ value: unit.id, label: unit.label }));
    setSelectOptions(fromSelect.input, options, fromId);
    setSelectOptions(toSelect.input, options, toId);
  }

  function swapUnits() {
    [fromId, toId] = [toId, fromId];
    ctx.store.set('conv.from', fromId);
    ctx.store.set('conv.to', toId);
    fillUnitSelects();
    renderUnits();
  }

  function renderUnits() {
    const amount = Number(amountInput.value);
    const value = convert(categoryId, fromId, toId, amount);
    unitResult = Number.isFinite(value) ? formatNumber(value) : '—';
    unitOutput.textContent = Number.isFinite(value) ? groupDigits(unitResult) : '—';
    const one = convert(categoryId, fromId, toId, 1);
    unitDetail.textContent = Number.isFinite(one) ? `1 ${fromId} = ${formatNumber(one)} ${toId}` : '';
  }

  // ---- currency converter ----
  const currencyAmount = el('input', {
    class: 'calc-input',
    attrs: { type: 'number', step: 'any', inputmode: 'decimal', 'aria-label': 'Amount to convert' },
    on: { input: () => renderCurrency() },
  });
  currencyAmount.value = '100';

  const currencyFromSelect = select({
    label: 'From currency', showLabel: false, options: [], value: currencyFrom,
    on: { change: (event) => { currencyFrom = event.target.value; ctx.store.set('conv.cur.from', currencyFrom); renderCurrency(); } },
  });
  const currencyToSelect = select({
    label: 'To currency', showLabel: false, options: [], value: currencyTo,
    on: { change: (event) => { currencyTo = event.target.value; ctx.store.set('conv.cur.to', currencyTo); renderCurrency(); } },
  });
  const currencyOutput = el('div', { class: 'calc-value', style: { fontSize: '26px', textAlign: 'right' }, text: '—' });
  const currencyDetail = el('p', { class: 'calc-hint', style: { textAlign: 'right' } });
  const ratesStatus = el('p', { class: 'calc-note' });
  const ratesError = el('p', { class: 'calc-error', style: { textAlign: 'left' } });

  const ratesInput = el('textarea', {
    class: 'calc-textarea',
    attrs: {
      rows: '3', spellcheck: 'false', 'aria-label': 'Paste exchange rates',
      placeholder: 'EUR=0.92\nGBP=0.78\nor paste a CODE,rate CSV',
    },
  });

  const asOfInput = el('input', {
    class: 'calc-input',
    attrs: { type: 'date', 'aria-label': 'Rates as of date' },
  });
  asOfInput.value = table.asOf;

  function fillCurrencySelects() {
    const options = listCodes(table).map((code) => ({ value: code, label: code }));
    if (!options.some((option) => option.value === currencyFrom)) currencyFrom = table.base;
    if (!options.some((option) => option.value === currencyTo)) currencyTo = options[1]?.value ?? table.base;
    setSelectOptions(currencyFromSelect.input, options, currencyFrom);
    setSelectOptions(currencyToSelect.input, options, currencyTo);
  }

  function renderCurrency() {
    const amount = Number(currencyAmount.value);
    const value = convertCurrency(table, currencyFrom, currencyTo, amount);
    currencyResult = Number.isFinite(value) ? formatNumber(value) : '—';
    currencyOutput.textContent = Number.isFinite(value) ? groupDigits(currencyResult) : '—';
    const one = convertCurrency(table, currencyFrom, currencyTo, 1);
    currencyDetail.textContent = Number.isFinite(one) ? `1 ${currencyFrom} = ${formatNumber(one)} ${currencyTo}` : 'Missing rate for one of these codes.';
    ratesStatus.textContent = `${Object.keys(table.rates).length} rates, base ${table.base}, as of ${table.asOf} — ${table.source === 'user' ? 'edited by you' : 'built-in seed'}. Rates are user-supplied, not live: the panel cannot reach any rate service.`;
  }

  function importRates() {
    const { rates, invalid } = parseRateText(ratesInput.value);
    if (!Object.keys(rates).length) {
      ratesError.textContent = 'No usable rows. Use one `CODE=rate` per line.';
      return;
    }
    table = normalizeTable(mergeRates(table, rates, asOfInput.value || table.asOf));
    ctx.store.set(CURRENCY_KEY, table);
    ratesError.textContent = invalid.length ? `Skipped ${invalid.length} line(s): ${invalid.slice(0, 3).join(' · ')}` : '';
    ratesInput.value = '';
    fillCurrencySelects();
    renderCurrency();
  }

  function resetRates() {
    table = normalizeTable(DEFAULT_TABLE);
    ctx.store.set(CURRENCY_KEY, table);
    asOfInput.value = table.asOf;
    ratesError.textContent = '';
    fillCurrencySelects();
    renderCurrency();
  }

  const root = el('div', { class: 'calc-mode is-stacked calc-scroll' }, [
    el('div', { class: 'calc-stack' }, [
      el('section', { class: 'calc-section' }, [
        el('h3', { text: 'Units' }),
        categorySelect.element,
        el('div', { class: 'calc-row' }, [fromSelect.element, toSelect.element]),
        el('div', { class: 'calc-row' }, [
          amountInput,
          el('div', { class: 'calc-chiprow', style: { justifyContent: 'flex-end' } }, [
            el('button', {
              class: 'calc-chip', text: '⇄ Swap',
              attrs: { type: 'button', 'aria-label': 'Swap the units' },
              on: { click: swapUnits },
            }),
            copyButton(() => unitResult, ctx.copy),
            el('button', {
              class: 'calc-chip', text: 'To tape',
              attrs: { type: 'button', 'aria-label': 'Commit this conversion to history' },
              on: {
                click: () => {
                  ctx.commit({ mode: 'Converter', expression: `${amountInput.value} ${fromId} → ${toId}`, result: unitResult });
                  const numeric = Number(unitResult);
                  if (Number.isFinite(numeric)) ctx.setAns(numeric);
                },
              },
            }),
          ]),
        ]),
        el('div', { attrs: { 'aria-live': 'polite' } }, [unitOutput, unitDetail]),
      ]),
      el('section', { class: 'calc-section' }, [
        el('h3', { text: 'Currency' }),
        el('div', { class: 'calc-row' }, [currencyFromSelect.element, currencyToSelect.element]),
        el('div', { class: 'calc-row' }, [
          currencyAmount,
          el('div', { class: 'calc-chiprow', style: { justifyContent: 'flex-end' } }, [
            copyButton(() => currencyResult, ctx.copy),
            el('button', {
              class: 'calc-chip', text: 'To tape',
              attrs: { type: 'button', 'aria-label': 'Commit this conversion to history' },
              on: {
                click: () => ctx.commit({
                  mode: 'Currency',
                  expression: `${currencyAmount.value} ${currencyFrom} → ${currencyTo} @ ${table.asOf}`,
                  result: currencyResult,
                }),
              },
            }),
          ]),
        ]),
        el('div', { attrs: { 'aria-live': 'polite' } }, [currencyOutput, currencyDetail]),
        ratesStatus,
      ]),
      el('section', { class: 'calc-section' }, [
        el('h3', { text: 'Rate table' }),
        ratesInput,
        el('div', { class: 'calc-row' }, [
          asOfInput,
          el('div', { class: 'calc-chiprow', style: { justifyContent: 'flex-end' } }, [
            el('button', {
              class: 'calc-chip', text: 'Import',
              attrs: { type: 'button', 'aria-label': 'Import the pasted rates' },
              on: { click: importRates },
            }),
            copyButton(() => serializeRates(table), ctx.copy, 'Export'),
            el('button', {
              class: 'calc-chip is-danger', text: 'Reset',
              attrs: { type: 'button', 'aria-label': 'Reset to the built-in seed rates' },
              on: { click: resetRates },
            }),
          ]),
        ]),
        ratesError,
        el('p', {
          class: 'calc-note',
          text: 'Rates are stored per user in this extension only. Enter them as units of the code per 1 unit of the base currency.',
        }),
      ]),
    ]),
  ]);

  fillUnitSelects();
  fillCurrencySelects();
  renderUnits();
  renderCurrency();

  return {
    id: 'converters',
    label: 'Converters',
    element: root,
    focus() { amountInput.focus(); },
    handleKey(event) {
      return event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement;
    },
    resultText: () => unitResult,
    load(entry, what) {
      const numeric = Number(String(what === 'result' ? entry.result : entry.expression).replace(/[^0-9.-]/g, ''));
      if (Number.isFinite(numeric)) { amountInput.value = String(numeric); renderUnits(); }
    },
    async hydrate() {
      table = normalizeTable(await ctx.store.load(CURRENCY_KEY, DEFAULT_TABLE));
      asOfInput.value = table.asOf;
      fillCurrencySelects();
      renderCurrency();
    },
    refresh() { renderUnits(); renderCurrency(); },
    destroy() {},
  };
}
