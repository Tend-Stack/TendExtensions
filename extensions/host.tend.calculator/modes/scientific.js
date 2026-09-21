/* Scientific mode.
 *
 * Same editor as Standard with a wider keypad, an angle-unit toggle and
 * a 2nd-function shift. The shift only re-labels the two function rows:
 * shifting the digits would be novelty, not utility, and every shifted
 * key states its own aria-label so a screen reader never reports the
 * unshifted name.
 */
import { createExpressionMode } from './expression-mode.js';
import { el, segmented } from '../ui/dom.js';
import { ANGLE_MODES } from '../engine/evaluate.js';

const ANGLE_LABELS = { deg: 'DEG', rad: 'RAD', grad: 'GRAD' };

function functionRows(shifted) {
  if (!shifted) {
    return [
      [
        { key: 'wrap:sqr', html: '<i>x</i><sup>2</sup>', variant: 'fn', aria: 'Square' },
        { key: 'op:^', html: '<i>x</i><sup>y</sup>', variant: 'fn', aria: 'Power' },
        { key: 'wrap:tenpow', html: '10<sup>x</sup>', variant: 'fn', aria: 'Ten to the power of x' },
        { key: 'fn:log', label: 'log', variant: 'fn', aria: 'Base ten logarithm' },
        { key: 'fn:ln', label: 'ln', variant: 'fn', aria: 'Natural logarithm' },
      ],
      [
        { key: 'fn:sin', label: 'sin', variant: 'fn', aria: 'Sine' },
        { key: 'fn:cos', label: 'cos', variant: 'fn', aria: 'Cosine' },
        { key: 'fn:tan', label: 'tan', variant: 'fn', aria: 'Tangent' },
        { key: 'fn:sinh', label: 'sinh', variant: 'fn', aria: 'Hyperbolic sine' },
        { key: 'fn:cosh', label: 'cosh', variant: 'fn', aria: 'Hyperbolic cosine' },
      ],
    ];
  }
  return [
    [
      { key: 'wrap:cube', html: '<i>x</i><sup>3</sup>', variant: 'fn', class: 'is-shifted', aria: 'Cube' },
      { key: 'fn:root', html: '<sup>y</sup>√<i>x</i>', variant: 'fn', class: 'is-shifted', aria: 'Nth root' },
      { key: 'wrap:epow', html: '<i>e</i><sup>x</sup>', variant: 'fn', class: 'is-shifted', aria: 'e to the power of x' },
      { key: 'fn:log2', label: 'log₂', variant: 'fn', class: 'is-shifted', aria: 'Base two logarithm' },
      { key: 'fn:exp', label: 'exp', variant: 'fn', class: 'is-shifted', aria: 'Exponential' },
    ],
    [
      { key: 'fn:asin', html: 'sin<sup>-1</sup>', variant: 'fn', class: 'is-shifted', aria: 'Inverse sine' },
      { key: 'fn:acos', html: 'cos<sup>-1</sup>', variant: 'fn', class: 'is-shifted', aria: 'Inverse cosine' },
      { key: 'fn:atan', html: 'tan<sup>-1</sup>', variant: 'fn', class: 'is-shifted', aria: 'Inverse tangent' },
      { key: 'fn:tanh', label: 'tanh', variant: 'fn', class: 'is-shifted', aria: 'Hyperbolic tangent' },
      { key: 'fn:abs', html: '|<i>x</i>|', variant: 'fn', class: 'is-shifted', aria: 'Absolute value' },
    ],
  ];
}

function layout({ shifted }) {
  return [
    [
      { key: 'act:shift', label: '2nd', variant: 'fn', class: shifted ? 'is-armed' : '', aria: 'Second function shift' },
      { key: 'txt:(', label: '(', variant: 'fn', aria: 'Open parenthesis' },
      { key: 'txt:)', label: ')', variant: 'fn', aria: 'Close parenthesis' },
      { key: 'act:clear', label: 'C', variant: 'fn', aria: 'Clear all' },
      { key: 'act:back', label: '⌫', variant: 'fn', aria: 'Backspace' },
    ],
    ...functionRows(shifted),
    [
      { key: shifted ? 'fn:cbrt' : 'fn:sqrt', html: shifted ? '<sup>3</sup>√<i>x</i>' : '√<i>x</i>', variant: 'fn', aria: shifted ? 'Cube root' : 'Square root' },
      { key: 'd:7', label: '7' }, { key: 'd:8', label: '8' }, { key: 'd:9', label: '9' },
      { key: 'op:/', label: '÷', variant: 'op', aria: 'Divide' },
    ],
    [
      { key: 'wrap:fact', html: '<i>x</i>!', variant: 'fn', aria: 'Factorial' },
      { key: 'd:4', label: '4' }, { key: 'd:5', label: '5' }, { key: 'd:6', label: '6' },
      { key: 'op:*', label: '×', variant: 'op', aria: 'Multiply' },
    ],
    [
      { key: 'txt: mod ', label: 'mod', variant: 'fn', aria: 'Modulo' },
      { key: 'd:1', label: '1' }, { key: 'd:2', label: '2' }, { key: 'd:3', label: '3' },
      { key: 'op:-', label: '−', variant: 'op', aria: 'Subtract' },
    ],
    [
      { key: 'txt:pi', label: 'π', variant: 'fn', aria: 'Pi' },
      { key: 'd:0', label: '0' },
      { key: 'txt:.', label: '.', aria: 'Decimal point' },
      { key: 'act:negate', label: '±', variant: 'fn', aria: 'Negate' },
      { key: 'op:+', label: '+', variant: 'op', aria: 'Add' },
    ],
    [
      { key: 'txt:e', label: 'e', variant: 'fn', aria: "Euler's number" },
      { key: 'act:ans', label: 'Ans', variant: 'fn', aria: 'Last answer' },
      { key: 'txt:%', label: '%', variant: 'fn', aria: 'Percent' },
      { key: 'txt:,', label: ',', variant: 'fn', aria: 'Argument separator' },
      { key: 'act:eq', label: '=', variant: 'eq', aria: 'Equals' },
    ],
  ];
}

export function createScientificMode(ctx) {
  let angleControl = null;
  const mode = createExpressionMode(ctx, {
    id: 'scientific',
    label: 'Scientific',
    columns: 5,
    memory: true,
    layout,
    header: () => {
      angleControl = segmented(
        ANGLE_MODES.map((id) => ({ id, label: ANGLE_LABELS[id], title: `${ANGLE_LABELS[id]} angle unit` })),
        ctx.getAngle(),
        (next) => {
          ctx.setAngle(next);
          angleControl.select(next);
          mode.refresh();
        },
        'Angle unit',
      );
      return el('div', { class: 'calc-chiprow' }, [angleControl.element]);
    },
  });
  return mode;
}
