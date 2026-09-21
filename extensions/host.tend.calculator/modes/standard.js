/* Standard mode — the default, and the one that has to keep behaving
 * exactly as it always did.
 *
 * What changed under the hood: the four-function accumulator is gone
 * and the expression engine drives the display, so the top line now
 * shows `5 + 3 × 2` while the bottom line shows the live result. What
 * did not change: the key layout, the memory cell, CE/C/⌫/±/%/1÷x/x²/√,
 * repeat-`=`, and the keyboard shortcuts.
 */
import { createExpressionMode } from './expression-mode.js';

const LAYOUT = [
  [
    { key: 'txt:%', label: '%', variant: 'fn', aria: 'Percent' },
    { key: 'act:clearentry', label: 'CE', variant: 'fn', aria: 'Clear entry' },
    { key: 'act:clear', label: 'C', variant: 'fn', aria: 'Clear all' },
    { key: 'act:back', label: '⌫', variant: 'fn', aria: 'Backspace' },
  ],
  [
    { key: 'wrap:recip', html: '1/<i>x</i>', variant: 'fn', aria: 'Reciprocal' },
    { key: 'wrap:sqr', html: '<i>x</i><sup>2</sup>', variant: 'fn', aria: 'Square' },
    { key: 'wrap:sqrt', html: '√<i>x</i>', variant: 'fn', aria: 'Square root' },
    { key: 'op:/', label: '÷', variant: 'op', aria: 'Divide' },
  ],
  [
    { key: 'd:7', label: '7' }, { key: 'd:8', label: '8' }, { key: 'd:9', label: '9' },
    { key: 'op:*', label: '×', variant: 'op', aria: 'Multiply' },
  ],
  [
    { key: 'd:4', label: '4' }, { key: 'd:5', label: '5' }, { key: 'd:6', label: '6' },
    { key: 'op:-', label: '−', variant: 'op', aria: 'Subtract' },
  ],
  [
    { key: 'd:1', label: '1' }, { key: 'd:2', label: '2' }, { key: 'd:3', label: '3' },
    { key: 'op:+', label: '+', variant: 'op', aria: 'Add' },
  ],
  [
    { key: 'act:negate', label: '±', variant: 'fn', aria: 'Negate' },
    { key: 'd:0', label: '0' },
    { key: 'txt:.', label: '.', aria: 'Decimal point' },
    { key: 'act:eq', label: '=', variant: 'eq', aria: 'Equals' },
  ],
];

export function createStandardMode(ctx) {
  return createExpressionMode(ctx, {
    id: 'standard',
    label: 'Standard',
    columns: 4,
    memory: true,
    layout: () => LAYOUT,
  });
}
