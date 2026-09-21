export const COLORS = Object.freeze({
  bg: 0x05070d,
  panel: 0x08111e,
  panel2: 0x0a1726,
  cyan: 0x00f3ff,
  magenta: 0xff007f,
  violet: 0x8b5cf6,
  lime: 0x7cff6b,
  amber: 0xffc857,
  red: 0xff3b5c,
  white: 0xf4fbff,
  muted: 0x6f8199,
  grid: 0x16304a
});

export function css(color) {
  return `#${Number(color).toString(16).padStart(6, '0')}`;
}

export function addGlow(target, color, outerStrength = 3.4, distance = 12) {
  try {
    if (typeof target?.enableFilters !== 'function') return null;
    target.enableFilters();
    const list = target.filters?.external;
    const glow = list?.addGlow?.(color, outerStrength, 0, 1, false, 7, distance);
    glow?.setPaddingOverride?.(null);
    return glow ?? null;
  } catch {
    return null;
  }
}

export function addCameraGlow(camera, color = COLORS.cyan) {
  try {
    const glow = camera?.filters?.external?.addGlow?.(color, 0.35, 0, 1, false, 3, 6);
    return glow ?? null;
  } catch {
    return null;
  }
}

export function neonText(scene, x, y, text, size = 20, color = COLORS.white, options = {}) {
  const obj = scene.add.text(x, y, text, {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: `${size}px`,
    fontStyle: options.bold ? 'bold' : 'normal',
    color: css(color),
    align: options.align || 'left',
    letterSpacing: options.letterSpacing ?? 0,
    stroke: options.stroke ? css(options.stroke) : undefined,
    strokeThickness: options.strokeThickness ?? 0,
    shadow: options.shadow === false ? undefined : {
      color: css(options.shadowColor ?? color),
      blur: options.shadowBlur ?? Math.max(4, size * 0.45),
      fill: true,
      offsetX: 0,
      offsetY: 0
    }
  });
  if (options.origin != null) obj.setOrigin(options.origin);
  if (options.originX != null || options.originY != null) obj.setOrigin(options.originX ?? 0, options.originY ?? 0);
  if (options.alpha != null) obj.setAlpha(options.alpha);
  return obj;
}

export function roundedPanel(scene, x, y, w, h, options = {}) {
  const g = scene.add.graphics();
  const radius = options.radius ?? 18;
  const fill = options.fill ?? COLORS.panel;
  const fillAlpha = options.fillAlpha ?? 0.92;
  const stroke = options.stroke ?? COLORS.grid;
  const strokeAlpha = options.strokeAlpha ?? 0.85;
  g.fillStyle(fill, fillAlpha);
  g.fillRoundedRect(x, y, w, h, radius);
  g.lineStyle(options.strokeWidth ?? 1, stroke, strokeAlpha);
  g.strokeRoundedRect(x, y, w, h, radius);
  if (options.accent) {
    g.lineStyle(2, options.accent, 0.8);
    g.beginPath();
    g.moveTo(x + radius, y + 1);
    g.lineTo(x + Math.min(w * 0.42, 170), y + 1);
    g.strokePath();
  }
  return g;
}

export function button(scene, x, y, w, h, label, options = {}) {
  const container = scene.add.container(x, y);
  const base = scene.add.rectangle(0, 0, w, h, options.fill ?? 0x10243a, options.alpha ?? 0.96)
    .setStrokeStyle(options.strokeWidth ?? 1, options.stroke ?? COLORS.cyan, options.strokeAlpha ?? 0.7)
    .setInteractive({ useHandCursor: true });
  const text = neonText(scene, 0, 0, label, options.fontSize ?? 14, options.color ?? COLORS.white, {
    bold: true,
    origin: 0.5,
    shadowColor: options.stroke ?? COLORS.cyan,
    shadowBlur: 8,
    letterSpacing: options.letterSpacing ?? 1
  });
  container.add([base, text]);
  container.base = base;
  container.label = text;
  base.on('pointerover', () => scene.tweens.add({ targets: container, scaleX: 1.025, scaleY: 1.025, duration: 110 }));
  base.on('pointerout', () => scene.tweens.add({ targets: container, scaleX: 1, scaleY: 1, duration: 110 }));
  base.on('pointerdown', () => options.onClick?.());
  return container;
}

export function formatScore(value) {
  return Math.max(0, Math.floor(Number(value) || 0)).toLocaleString('en-US');
}

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
