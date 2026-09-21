/* Graphing mode.
 *
 * One canvas, devicePixelRatio-aware, drawn from ASTs that are parsed
 * once per edit and then sampled per pixel column. Panning is a
 * viewport translation and zooming is a viewport scale about the
 * pointer, so neither re-parses anything.
 *
 * Discontinuities (tan, 1/x) are handled by breaking the stroke when a
 * sample is non-finite or when the step between two samples exceeds the
 * visible height — otherwise an asymptote draws as a vertical line that
 * looks like part of the curve.
 */
import { parse, variablesOf } from '../engine/parser.js';
import { evaluate } from '../engine/evaluate.js';
import { formatNumber } from '../engine/format.js';
import { splitExpressions } from '../engine/tokenize.js';
import { el, clear } from '../ui/dom.js';
import { SERIES_COLORS } from '../ui/styles.js';

const DEFAULT_VIEW = { minX: -10, maxX: 10, minY: -6.5, maxY: 6.5 };
const MIN_SPAN = 1e-9;
const MAX_SPAN = 1e12;

/** Choose a grid step of 1, 2 or 5 × 10^n that gives ~8 lines. */
export function niceStep(span, target = 8) {
  const raw = span / Math.max(1, target);
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const normalized = raw / magnitude;
  const step = normalized >= 5 ? 5 : normalized >= 2 ? 2 : 1;
  return step * magnitude;
}

export function createGraphingMode(ctx) {
  let view = { ...DEFAULT_VIEW };
  let series = [];
  let raf = null;
  let trace = null;
  let width = 0;
  let height = 0;

  const canvas = el('canvas', { class: 'calc-canvas', attrs: { 'aria-label': 'Plot' } });
  const traceBox = el('div', { class: 'calc-trace', attrs: { hidden: true } });
  const wrap = el('div', { class: 'calc-canvas-wrap' }, [canvas, traceBox]);
  const legend = el('div', { class: 'calc-legend' });
  const errorEl = el('p', { class: 'calc-error', attrs: { role: 'status' }, style: { textAlign: 'left' } });

  const input = el('textarea', {
    class: 'calc-textarea',
    attrs: {
      rows: '2', spellcheck: 'false',
      'aria-label': 'Expressions in x, one per line or separated by commas',
      placeholder: 'sin(x), x^2/4 - 3',
    },
    on: { input: () => { compile(); schedule(); } },
  });

  const controls = el('div', { class: 'calc-chiprow' }, [
    chip('−', 'Zoom out', () => zoomBy(1.25)),
    chip('+', 'Zoom in', () => zoomBy(0.8)),
    chip('Reset', 'Reset the view', () => { view = { ...DEFAULT_VIEW }; schedule(); }),
    chip('Fit y', 'Fit the vertical range to the plotted values', fitY),
  ]);

  function chip(label, aria, onClick) {
    return el('button', {
      class: 'calc-chip', text: label,
      attrs: { type: 'button', 'aria-label': aria, title: aria },
      on: { click: onClick },
    });
  }

  const root = el('div', { class: 'calc-mode' }, [
    el('div', { class: 'calc-stack' }, [input, errorEl, controls]),
    el('div', { class: 'calc-stack', style: { gridTemplateRows: 'minmax(0, 1fr) auto', minHeight: '0' } }, [wrap, legend]),
  ]);

  function compile() {
    const parts = splitExpressions(input.value);
    const next = [];
    const problems = [];
    parts.forEach((source, index) => {
      try {
        const ast = parse(source);
        const free = [...variablesOf(ast)].filter((name) => name !== 'x');
        if (free.length) throw new Error(`"${free[0]}" is not a known value`);
        next.push({ source, ast, color: SERIES_COLORS[index % SERIES_COLORS.length] });
      } catch (problem) {
        problems.push(`${source}: ${problem.message}`);
      }
    });
    series = next;
    errorEl.textContent = problems.join(' · ');
    renderLegend();
  }

  function renderLegend() {
    clear(legend);
    for (const item of series) {
      legend.appendChild(el('span', {}, [
        el('i', { class: 'calc-swatch', style: { background: item.color } }),
        el('span', { text: item.source }),
      ]));
    }
  }

  function sample(ast, x) {
    try {
      const value = evaluate(ast, { angle: ctx.getAngle(), vars: { x, ans: ctx.getAns() } });
      return Number.isFinite(value) ? value : NaN;
    } catch (problem) {
      return NaN;
    }
  }

  function toScreenX(x) { return ((x - view.minX) / (view.maxX - view.minX)) * width; }
  function toScreenY(y) { return height - ((y - view.minY) / (view.maxY - view.minY)) * height; }
  function toWorldX(px) { return view.minX + (px / width) * (view.maxX - view.minX); }
  function toWorldY(py) { return view.minY + ((height - py) / height) * (view.maxY - view.minY); }

  function resize() {
    const ratio = Math.min(3, window.devicePixelRatio || 1);
    const box = wrap.getBoundingClientRect();
    width = Math.max(1, Math.floor(box.width));
    height = Math.max(1, Math.floor(box.height));
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    const context = canvas.getContext('2d');
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function schedule() {
    if (raf !== null) return;
    raf = requestAnimationFrame(() => { raf = null; draw(); });
  }

  function styleOf(name, fallback) {
    const value = getComputedStyle(root).getPropertyValue(name).trim();
    return value || fallback;
  }

  function draw() {
    resize();
    const context = canvas.getContext('2d');
    const fg = styleOf('--calc-fg', '#e6eef7');
    const line = styleOf('--calc-line', 'rgba(255,255,255,0.16)');
    context.clearRect(0, 0, width, height);

    const stepX = niceStep(view.maxX - view.minX);
    const stepY = niceStep(view.maxY - view.minY);
    context.lineWidth = 1;
    context.font = '10px system-ui, sans-serif';
    context.strokeStyle = line;
    context.fillStyle = fg;
    context.globalAlpha = 0.55;

    for (let x = Math.ceil(view.minX / stepX) * stepX; x <= view.maxX; x += stepX) {
      const px = Math.round(toScreenX(x)) + 0.5;
      context.beginPath();
      context.moveTo(px, 0);
      context.lineTo(px, height);
      context.stroke();
    }
    for (let y = Math.ceil(view.minY / stepY) * stepY; y <= view.maxY; y += stepY) {
      const py = Math.round(toScreenY(y)) + 0.5;
      context.beginPath();
      context.moveTo(0, py);
      context.lineTo(width, py);
      context.stroke();
    }

    // Axes sit on top of the grid at full strength.
    context.globalAlpha = 1;
    context.strokeStyle = fg;
    const axisY = Math.round(toScreenY(0)) + 0.5;
    const axisX = Math.round(toScreenX(0)) + 0.5;
    context.beginPath();
    context.moveTo(0, axisY); context.lineTo(width, axisY);
    context.moveTo(axisX, 0); context.lineTo(axisX, height);
    context.stroke();

    context.globalAlpha = 0.75;
    context.textAlign = 'center';
    context.textBaseline = 'top';
    for (let x = Math.ceil(view.minX / stepX) * stepX; x <= view.maxX; x += stepX) {
      if (Math.abs(x) < stepX / 2) continue;
      const py = Math.min(height - 12, Math.max(2, axisY + 3));
      context.fillText(formatNumber(x, { significant: 6 }), toScreenX(x), py);
    }
    context.textAlign = 'right';
    context.textBaseline = 'middle';
    for (let y = Math.ceil(view.minY / stepY) * stepY; y <= view.maxY; y += stepY) {
      if (Math.abs(y) < stepY / 2) continue;
      const px = Math.min(width - 3, Math.max(24, axisX - 4));
      context.fillText(formatNumber(y, { significant: 6 }), px, toScreenY(y));
    }

    context.globalAlpha = 1;
    context.lineWidth = 1.8;
    context.lineJoin = 'round';
    const breakAt = (view.maxY - view.minY) * 2;
    for (const item of series) {
      context.strokeStyle = item.color;
      context.beginPath();
      let pen = false;
      let previous = NaN;
      for (let px = 0; px <= width; px += 1) {
        const value = sample(item.ast, toWorldX(px));
        if (!Number.isFinite(value)) { pen = false; previous = NaN; continue; }
        const jumped = Number.isFinite(previous) && Math.abs(value - previous) > breakAt;
        const py = toScreenY(value);
        if (!pen || jumped) context.moveTo(px, py);
        else context.lineTo(px, py);
        pen = true;
        previous = value;
      }
      context.stroke();
    }

    if (trace) {
      context.fillStyle = trace.color;
      context.beginPath();
      context.arc(toScreenX(trace.x), toScreenY(trace.y), 3.5, 0, Math.PI * 2);
      context.fill();
    }
  }

  function fitY() {
    if (!series.length) return;
    let low = Infinity;
    let high = -Infinity;
    for (const item of series) {
      for (let px = 0; px <= width; px += 2) {
        const value = sample(item.ast, toWorldX(px));
        if (!Number.isFinite(value)) continue;
        low = Math.min(low, value);
        high = Math.max(high, value);
      }
    }
    if (!Number.isFinite(low) || !Number.isFinite(high) || low === high) return;
    const pad = (high - low) * 0.1;
    view = { ...view, minY: low - pad, maxY: high + pad };
    schedule();
  }

  function zoomAt(factor, centreX, centreY) {
    const spanX = (view.maxX - view.minX) * factor;
    const spanY = (view.maxY - view.minY) * factor;
    if (spanX < MIN_SPAN || spanX > MAX_SPAN) return;
    const ratioX = (centreX - view.minX) / (view.maxX - view.minX);
    const ratioY = (centreY - view.minY) / (view.maxY - view.minY);
    view = {
      minX: centreX - spanX * ratioX,
      maxX: centreX + spanX * (1 - ratioX),
      minY: centreY - spanY * ratioY,
      maxY: centreY + spanY * (1 - ratioY),
    };
    schedule();
  }

  function zoomBy(factor) {
    zoomAt(factor, (view.minX + view.maxX) / 2, (view.minY + view.maxY) / 2);
  }

  let dragging = null;
  const pointers = new Map();

  canvas.addEventListener('pointerdown', (event) => {
    canvas.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId, { x: event.offsetX, y: event.offsetY });
    if (pointers.size === 1) dragging = { x: event.offsetX, y: event.offsetY, view: { ...view } };
  });

  canvas.addEventListener('pointermove', (event) => {
    if (pointers.has(event.pointerId)) pointers.set(event.pointerId, { x: event.offsetX, y: event.offsetY });
    if (pointers.size === 2) { pinch(); return; }
    if (dragging) {
      const dx = ((event.offsetX - dragging.x) / width) * (dragging.view.maxX - dragging.view.minX);
      const dy = ((event.offsetY - dragging.y) / height) * (dragging.view.maxY - dragging.view.minY);
      view = {
        minX: dragging.view.minX - dx,
        maxX: dragging.view.maxX - dx,
        minY: dragging.view.minY + dy,
        maxY: dragging.view.maxY + dy,
      };
      schedule();
      return;
    }
    updateTrace(event.offsetX);
  });

  let pinchStart = null;
  function pinch() {
    const [a, b] = [...pointers.values()];
    const distance = Math.hypot(a.x - b.x, a.y - b.y);
    const midX = toWorldX((a.x + b.x) / 2);
    const midY = toWorldY((a.y + b.y) / 2);
    if (!pinchStart) { pinchStart = distance; return; }
    if (distance <= 0) return;
    zoomAt(pinchStart / distance, midX, midY);
    pinchStart = distance;
  }

  function endPointer(event) {
    pointers.delete(event.pointerId);
    if (pointers.size < 2) pinchStart = null;
    if (pointers.size === 0) dragging = null;
  }
  canvas.addEventListener('pointerup', endPointer);
  canvas.addEventListener('pointercancel', endPointer);
  canvas.addEventListener('pointerleave', (event) => {
    endPointer(event);
    trace = null;
    traceBox.hidden = true;
    schedule();
  });

  canvas.addEventListener('wheel', (event) => {
    event.preventDefault();
    const factor = event.deltaY > 0 ? 1.12 : 0.89;
    zoomAt(factor, toWorldX(event.offsetX), toWorldY(event.offsetY));
  }, { passive: false });

  function updateTrace(px) {
    if (!series.length) { traceBox.hidden = true; trace = null; return; }
    const x = toWorldX(px);
    const item = series[0];
    const y = sample(item.ast, x);
    if (!Number.isFinite(y)) { traceBox.hidden = true; trace = null; schedule(); return; }
    trace = { x, y, color: item.color };
    traceBox.hidden = false;
    traceBox.textContent = `x ${formatNumber(x, { significant: 6 })}   y ${formatNumber(y, { significant: 6 })}`;
    schedule();
  }

  const observer = new ResizeObserver(() => schedule());
  observer.observe(wrap);

  compile();

  return {
    id: 'graphing',
    label: 'Graphing',
    element: root,
    focus() { input.focus(); },
    activate() { schedule(); },
    handleKey(event) {
      if (event.target === input) return true;
      const steps = { ArrowLeft: [-0.08, 0], ArrowRight: [0.08, 0], ArrowUp: [0, 0.08], ArrowDown: [0, -0.08] };
      const step = steps[event.key];
      if (step) {
        const spanX = view.maxX - view.minX;
        const spanY = view.maxY - view.minY;
        view = {
          minX: view.minX + spanX * step[0], maxX: view.maxX + spanX * step[0],
          minY: view.minY + spanY * step[1], maxY: view.maxY + spanY * step[1],
        };
        schedule();
        return true;
      }
      if (event.key === '+' || event.key === '=') { zoomBy(0.8); return true; }
      if (event.key === '-') { zoomBy(1.25); return true; }
      if (event.key === '0') { view = { ...DEFAULT_VIEW }; schedule(); return true; }
      return false;
    },
    resultText: () => (trace ? `x = ${formatNumber(trace.x)}, y = ${formatNumber(trace.y)}` : input.value),
    load(entry, what) {
      input.value = what === 'result' ? String(entry.result) : String(entry.expression);
      compile();
      schedule();
    },
    refresh: schedule,
    destroy() {
      observer.disconnect();
      if (raf !== null) cancelAnimationFrame(raf);
    },
  };
}
