// Riftwing: Skybound — TEND STACK LLC / tend.host Runtime API 1 game extension.
// Procedural Phaser 4 sky-runner with world progression, perks and rewards.

var FUO_STYLE_ID = 'fuo-extension-style';
var GAME_W = 460;
var GAME_H = 664;
var GROUND_H = 54;
var PLAYER_X = 106;
var PLAYER_W = 42;
var PLAYER_H = 32;
var GATE_W = 70;
var STORAGE_KEY = 'riftwing_skybound_profile';

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function choose(list) { return list[rand(0, list.length - 1)]; }
function hex(value) { return '#' + value.toString(16).padStart(6, '0'); }
function mixColor(a, b, t) {
  t = clamp(t, 0, 1);
  var ar = (a >> 16) & 255, ag = (a >> 8) & 255, ab = a & 255;
  var br = (b >> 16) & 255, bg = (b >> 8) & 255, bb = b & 255;
  return (Math.round(ar + (br - ar) * t) << 16) |
    (Math.round(ag + (bg - ag) * t) << 8) |
    Math.round(ab + (bb - ab) * t);
}
function levelHeatColor(ratio) {
  ratio = clamp(ratio, 0, 1);
  if (ratio < .34) return mixColor(0x22d3ee, 0x4ade80, ratio / .34);
  if (ratio < .64) return mixColor(0x4ade80, 0xfacc15, (ratio - .34) / .30);
  if (ratio < .84) return mixColor(0xfacc15, 0xfb923c, (ratio - .64) / .20);
  return mixColor(0xfb923c, 0xef4444, (ratio - .84) / .16);
}
function todayKey() {
  var d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function xpForNext(level) { return 90 + level * 42; }

var WORLDS = [
  {
    id: 'neo', name: 'Neon City', subtitle: 'Skyscrapers above the rain', unlock: 1,
    skyTop: 0x030712, skyBottom: 0x0f2851, far: 0x112b46, near: 0x064e3b,
    glow: 0x34d399, accent: 0x38bdf8, ground: 0x071a22, obstacle: 'tower'
  },
  {
    id: 'sunset', name: 'Sunset Harbor', subtitle: 'Golden towers over the sea', unlock: 3,
    skyTop: 0x30124a, skyBottom: 0xf97316, far: 0x7c2d12, near: 0x431407,
    glow: 0xfbbf24, accent: 0xfb7185, ground: 0x3f1d18, obstacle: 'lighthouse'
  },
  {
    id: 'crystal', name: 'Crystal Caverns', subtitle: 'A luminous underground kingdom', unlock: 6,
    skyTop: 0x07152e, skyBottom: 0x1e1b4b, far: 0x312e81, near: 0x172554,
    glow: 0xa78bfa, accent: 0x67e8f9, ground: 0x0f172a, obstacle: 'crystal'
  },
  {
    id: 'sky', name: 'Sky Temple', subtitle: 'Ruins floating beyond the clouds', unlock: 9,
    skyTop: 0x075985, skyBottom: 0x7dd3fc, far: 0x0c4a6e, near: 0x155e75,
    glow: 0xfef3c7, accent: 0xbae6fd, ground: 0x164e63, obstacle: 'temple'
  },
  {
    id: 'ember', name: 'Ember Forge', subtitle: 'Machinery at the heart of a volcano', unlock: 12,
    skyTop: 0x1c0704, skyBottom: 0x7f1d1d, far: 0x451a03, near: 0x3f0d0d,
    glow: 0xfb923c, accent: 0xfde047, ground: 0x27120a, obstacle: 'forge'
  },
  {
    id: 'ocean', name: 'Abyssal Reef', subtitle: 'Ancient gates beneath the waves', unlock: 16,
    skyTop: 0x020617, skyBottom: 0x075985, far: 0x0c4a6e, near: 0x083344,
    glow: 0x22d3ee, accent: 0x5eead4, ground: 0x042f2e, obstacle: 'coral'
  },
  {
    id: 'haunt', name: 'Haunted Moon', subtitle: 'A midnight flight through lost ruins', unlock: 20,
    skyTop: 0x09090b, skyBottom: 0x312e81, far: 0x27203c, near: 0x18112b,
    glow: 0xc4b5fd, accent: 0xf8fafc, ground: 0x15111f, obstacle: 'haunt'
  },
  {
    id: 'rift', name: 'Galactic Rift', subtitle: 'The final route between dimensions', unlock: 26,
    skyTop: 0x020617, skyBottom: 0x2e1065, far: 0x312e81, near: 0x1e1b4b,
    glow: 0xe879f9, accent: 0x60a5fa, ground: 0x0d0b23, obstacle: 'rift'
  }
];

var CHARACTERS = [
  { id: 'pip', name: 'Pip Nova', title: 'Balanced ace', unlock: 1, main: 0xfbbf24, wing: 0xf97316, trim: 0xfef3c7, trait: 'No modifiers' },
  { id: 'ember', name: 'Emberwing', title: 'Solar sprinter', unlock: 2, main: 0xf97316, wing: 0xef4444, trim: 0xfde68a, trait: '+5% coin rewards' },
  { id: 'frost', name: 'Frostbyte', title: 'Ice wyvern', unlock: 4, main: 0x60a5fa, wing: 0x2563eb, trim: 0xe0f2fe, trait: 'Slow effects last longer' },
  { id: 'mecha', name: 'Mecha Finch', title: 'Precision machine', unlock: 7, main: 0x38bdf8, wing: 0x0e7490, trim: 0xcffafe, trait: 'Slightly smaller hitbox' },
  { id: 'ghost', name: 'Wisp', title: 'Moonlit spirit', unlock: 10, main: 0xf8fafc, wing: 0xa78bfa, trim: 0xe9d5ff, trait: 'Phase pickups appear more' },
  { id: 'ufo', name: 'Orbit', title: 'Gravity rebel', unlock: 14, main: 0xc084fc, wing: 0x7c3aed, trim: 0xe9d5ff, trait: 'Softer gravity' },
  { id: 'dragon', name: 'Skyfang', title: 'Ancient guardian', unlock: 18, main: 0x22c55e, wing: 0x15803d, trim: 0xfef08a, trait: 'Start with brief shield' },
  { id: 'chroma', name: 'Chroma', title: 'Prismatic legend', unlock: 25, main: 0xf472b6, wing: 0x8b5cf6, trim: 0xfef3c7, trait: 'Perfects pay double' },
  { id: 'royal', name: 'Aurelius', title: 'Crowned champion', unlock: 32, main: 0xfacc15, wing: 0xa16207, trim: 0xffffff, trait: '+10% XP rewards' }
];

var DIFFICULTIES = [
  { id: 'chill', name: 'Chill', gap: 190, speed: 158, gravity: 650, flap: -330, ramp: 0.018, color: 0x22c55e, reward: 0.75 },
  { id: 'arcade', name: 'Arcade', gap: 158, speed: 208, gravity: 850, flap: -375, ramp: 0.028, color: 0xfbbf24, reward: 1 },
  { id: 'expert', name: 'Expert', gap: 132, speed: 262, gravity: 1040, flap: -420, ramp: 0.04, color: 0xf97316, reward: 1.35 },
  { id: 'nightmare', name: 'Nightmare', gap: 108, speed: 328, gravity: 1260, flap: -468, ramp: 0.055, color: 0xef4444, reward: 1.8 }
];

var MODES = [
  { id: 'adventure', name: 'Adventure', desc: 'Worlds, perks and rewards', color: 0x38bdf8 },
  { id: 'classic', name: 'Classic', desc: 'Pure endless flight', color: 0x22c55e },
  { id: 'chaos', name: 'Chaos', desc: 'Moving gates and faster levels', color: 0xe879f9 }
];

var LOADOUTS = [
  { id: 'guardian', name: 'Guardian', icon: '◆', desc: 'Start every run with one shield', unlock: 1, color: 0x60a5fa },
  { id: 'magnet', name: 'Star Magnet', icon: '✦', desc: 'Pull nearby coins and stars toward you', unlock: 3, color: 0xfbbf24 },
  { id: 'feather', name: 'Featherweight', icon: '⌁', desc: '8% softer gravity and smoother falls', unlock: 5, color: 0x22c55e },
  { id: 'lucky', name: 'Lucky Orbit', icon: '☘', desc: 'Power capsules appear more often', unlock: 8, color: 0x34d399 },
  { id: 'mini', name: 'Tiny Hero', icon: '↘', desc: 'Begin smaller for the first 12 gates', unlock: 11, color: 0xa78bfa },
  { id: 'phoenix', name: 'Phoenix Core', icon: '♨', desc: 'Revive once with a rescue burst', unlock: 15, color: 0xfb7185 },
  { id: 'bounty', name: 'Bounty Hunter', icon: '★', desc: '+25% coins from perfect gates', unlock: 19, color: 0xf97316 },
  { id: 'overdrive', name: 'Overdrive', icon: '⚡', desc: 'Begin with double score for 8 seconds', unlock: 24, color: 0xef4444 }
];

var PICKUPS = [
  { id: 'shield', name: 'Shield', icon: '◆', color: 0x60a5fa, duration: 0 },
  { id: 'slow', name: 'Time Warp', icon: '◷', color: 0xa78bfa, duration: 6000 },
  { id: 'mini', name: 'Mini', icon: '↘', color: 0x22c55e, duration: 9000 },
  { id: 'double', name: 'Double Score', icon: '×2', color: 0xf97316, duration: 8500 },
  { id: 'phase', name: 'Phase', icon: '◌', color: 0xe879f9, duration: 4500 },
  { id: 'magnet', name: 'Magnet', icon: '✦', color: 0xfbbf24, duration: 8000 },
  { id: 'feather', name: 'Feather', icon: '⌁', color: 0x5eead4, duration: 8000 },
  { id: 'pulse', name: 'Pulse', icon: '⚡', color: 0xef4444, duration: 0 },
  { id: 'jackpot', name: 'Star Cache', icon: '★', color: 0xfacc15, duration: 0 },
  { id: 'revive', name: 'Revive', icon: '♨', color: 0xfb7185, duration: 0 }
];

function worldById(id) { return WORLDS.find(function (w) { return w.id === id; }) || WORLDS[0]; }
function charById(id) { return CHARACTERS.find(function (c) { return c.id === id; }) || CHARACTERS[0]; }
function diffById(id) { return DIFFICULTIES.find(function (d) { return d.id === id; }) || DIFFICULTIES[1]; }
function modeById(id) { return MODES.find(function (m) { return m.id === id; }) || MODES[0]; }
function loadoutById(id) { return LOADOUTS.find(function (p) { return p.id === id; }) || LOADOUTS[0]; }

function defaultProfile() {
  return {
    version: 3,
    best: 0,
    bests: {},
    coins: 0,
    xp: 0,
    level: 1,
    totalGates: 0,
    totalCoins: 0,
    totalPerfects: 0,
    games: 0,
    selectedChar: 'pip',
    selectedWorld: 'neo',
    difficulty: 'arcade',
    mode: 'adventure',
    loadout: 'guardian',
    questTier: 0,
    lastDaily: '',
    pendingDaily: 0
  };
}

function mergeProfile(raw) {
  var base = defaultProfile();
  if (!raw || typeof raw !== 'object') return base;
  Object.keys(base).forEach(function (k) {
    if (raw[k] !== undefined && raw[k] !== null) base[k] = raw[k];
  });
  if (!base.bests || typeof base.bests !== 'object') base.bests = {};
  return base;
}

function saveProfile(storage, profile) {
  return storage.set(STORAGE_KEY, JSON.stringify(profile)).catch(function () {});
}

function ensureStyle() {
  if (document.getElementById(FUO_STYLE_ID)) return;
  var style = document.createElement('style');
  style.id = FUO_STYLE_ID;
  style.textContent =
    '.fuo-root{position:relative;width:100%;height:100%;overflow:hidden;background:#020617;isolation:isolate;user-select:none;-webkit-user-select:none;touch-action:none}' +
    '.fuo-root canvas{display:block!important;position:absolute!important;max-width:none!important;max-height:none!important;outline:0}' +
    '.fuo-loader{position:absolute;inset:0;z-index:50;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 50% 35%,#132d51 0,#050b18 46%,#020617 100%);font-family:Inter,ui-sans-serif,system-ui,sans-serif}' +
    '.fuo-loader-card{width:260px;padding:28px 24px;border:1px solid rgba(125,211,252,.22);border-radius:24px;background:rgba(3,7,18,.74);box-shadow:0 25px 70px rgba(0,0,0,.45);backdrop-filter:blur(18px);text-align:center}' +
    '.fuo-loader-mark{font-size:13px;font-weight:900;letter-spacing:.2em;color:#67e8f9}' +
    '.fuo-loader-title{margin-top:7px;font-size:26px;font-weight:950;letter-spacing:-.04em;color:#fff}' +
    '.fuo-loader-sub{margin-top:5px;font-size:11px;color:#64748b}' +
    '.fuo-loader-track{height:5px;margin-top:22px;overflow:hidden;border-radius:999px;background:rgba(255,255,255,.08)}' +
    '.fuo-loader-fill{height:100%;width:0;border-radius:inherit;background:linear-gradient(90deg,#22d3ee,#a78bfa,#f472b6);transition:width .18s ease}' +
    '.fuo-loader-error{font-size:13px;line-height:1.45;color:#fca5a5}';
  document.head.appendChild(style);
}

function lockWindowChrome(container) {
  var root = container.closest && container.closest('.tend-floating-window');
  if (!root) return function () {};
  var layout = root.querySelector('.window-layout-controls');
  var previousDisplay = layout ? layout.style.display : '';
  if (layout) layout.style.display = 'none';
  var header = root.querySelector('[data-window-chrome]');
  var stopExpand = function (event) {
    event.preventDefault();
    event.stopPropagation();
    if (event.stopImmediatePropagation) event.stopImmediatePropagation();
  };
  if (header) header.addEventListener('dblclick', stopExpand, true);
  return function () {
    if (layout) layout.style.display = previousDisplay;
    if (header) header.removeEventListener('dblclick', stopExpand, true);
  };
}

// ── Synth audio ─────────────────────────────────────────────
var audioCtx = null;
function initAudio() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
  }
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume().catch(function () {});
}
function tone(freq, duration, type, volume, delay, endFreq) {
  if (!audioCtx) return;
  var start = audioCtx.currentTime + (delay || 0);
  var osc = audioCtx.createOscillator();
  var gain = audioCtx.createGain();
  osc.type = type || 'sine';
  osc.frequency.setValueAtTime(freq, start);
  if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, start + duration);
  gain.gain.setValueAtTime(volume || 0.05, start);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
  osc.connect(gain); gain.connect(audioCtx.destination);
  osc.start(start); osc.stop(start + duration);
}
var sfx = {
  flap: function () { tone(430, .07, 'sine', .055, 0, 680); },
  point: function () { tone(780, .06, 'triangle', .07); tone(1040, .08, 'triangle', .055, .045); },
  perfect: function () { [660, 880, 1108].forEach(function (f, i) { tone(f, .12, 'sine', .06, i * .05); }); },
  coin: function () { tone(1050, .05, 'triangle', .08); tone(1450, .08, 'triangle', .055, .04); },
  power: function () { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, .14, 'sine', .055, i * .055); }); },
  hit: function () { tone(220, .18, 'sawtooth', .07, 0, 110); },
  die: function () { tone(310, .15, 'sawtooth', .06, 0, 180); tone(150, .3, 'triangle', .05, .11, 70); },
  level: function () { [523, 659, 784, 1047, 1319].forEach(function (f, i) { tone(f, .16, 'sine', .055, i * .06); }); },
  menu: function () { tone(520, .05, 'sine', .035); },
  select: function () { tone(660, .08, 'sine', .06); tone(880, .1, 'sine', .05, .05); },
  chest: function () { [392, 523, 659, 784, 1047].forEach(function (f, i) { tone(f, .2, 'triangle', .06, i * .07); }); },
  finalBurn: function () { tone(420, .11, 'sawtooth', .035, 0, 760); tone(840, .14, 'triangle', .045, .08, 1260); }
};

// ── Drawing helpers ─────────────────────────────────────────
function roundedPanel(scene, x, y, w, h, fill, alpha, stroke, strokeAlpha, radius) {
  var g = scene.add.graphics();
  g.fillStyle(fill, alpha === undefined ? 1 : alpha);
  g.fillRoundedRect(x - w / 2, y - h / 2, w, h, radius || 16);
  if (stroke !== undefined) {
    g.lineStyle(1, stroke, strokeAlpha === undefined ? 1 : strokeAlpha);
    g.strokeRoundedRect(x - w / 2, y - h / 2, w, h, radius || 16);
  }
  return g;
}

function makeButton(scene, x, y, w, h, label, opts) {
  opts = opts || {};
  var container = scene.add.container(x, y);
  var bg = scene.add.graphics();
  function draw(active) {
    bg.clear();
    var fill = active ? (opts.hover || opts.fill || 0x22c55e) : (opts.fill || 0x1e293b);
    bg.fillStyle(fill, opts.alpha === undefined ? 1 : opts.alpha);
    bg.fillRoundedRect(-w / 2, -h / 2, w, h, opts.radius || 13);
    if (opts.stroke !== undefined) {
      bg.lineStyle(opts.strokeWidth || 1, opts.stroke, active ? .95 : (opts.strokeAlpha || .55));
      bg.strokeRoundedRect(-w / 2, -h / 2, w, h, opts.radius || 13);
    }
  }
  draw(false);
  var txt = scene.add.text(0, 0, label, {
    fontFamily: 'Inter, system-ui, sans-serif', fontSize: (opts.fontSize || 14) + 'px',
    fontStyle: opts.bold === false ? 'normal' : 'bold', color: opts.textColor || '#ffffff'
  }).setOrigin(.5);
  container.add([bg, txt]);
  container.setSize(w, h).setInteractive({ useHandCursor: true });
  container.on('pointerover', function () { draw(true); container.setScale(1.025); });
  container.on('pointerout', function () { draw(false); container.setScale(1); });
  container.on('pointerdown', function () { container.setScale(.97); });
  container.on('pointerup', function () { container.setScale(1.025); if (opts.onClick) opts.onClick(); });
  return { container: container, bg: bg, text: txt, draw: draw };
}

function gradientSky(scene, world) {
  var g = scene.add.graphics().setDepth(0);
  var steps = 24;
  for (var i = 0; i < steps; i++) {
    g.fillStyle(mixColor(world.skyTop, world.skyBottom, i / (steps - 1)), 1);
    g.fillRect(0, Math.floor(i * GAME_H / steps), GAME_W, Math.ceil(GAME_H / steps) + 1);
  }
  return g;
}

function drawCharacter(g, id, phase, cx, cy, scale) {
  var ch = charById(id); scale = scale || 1;
  var wingY = [cy - 12 * scale, cy - 3 * scale, cy + 7 * scale][phase % 3];
  if (id === 'ufo') {
    g.fillStyle(0x22d3ee, .18); g.fillEllipse(cx, cy + 16 * scale, 54 * scale, 18 * scale);
    g.fillStyle(0x64748b, 1); g.fillEllipse(cx, cy + 5 * scale, 54 * scale, 18 * scale);
    g.fillStyle(0xcbd5e1, 1); g.fillEllipse(cx, cy + 1 * scale, 48 * scale, 13 * scale);
    g.fillStyle(ch.main, .95); g.fillEllipse(cx, cy - 7 * scale, 31 * scale, 23 * scale);
    g.fillStyle(0xe0f2fe, .45); g.fillEllipse(cx - 5 * scale, cy - 10 * scale, 12 * scale, 7 * scale);
    [0xef4444, 0x22c55e, 0xfbbf24].forEach(function (c, i) {
      g.fillStyle(c, phase === i ? 1 : .3); g.fillCircle(cx + (i - 1) * 14 * scale, cy + 7 * scale, 3 * scale);
    });
    return;
  }
  if (id === 'ghost') {
    g.fillStyle(ch.wing, .2); g.fillEllipse(cx - 17 * scale, wingY, 28 * scale, 10 * scale);
    g.fillStyle(ch.main, .78); g.fillCircle(cx + 4 * scale, cy - 5 * scale, 17 * scale);
    g.fillStyle(ch.main, .72); g.fillEllipse(cx, cy + 8 * scale, 39 * scale, 31 * scale);
    g.fillStyle(0x111827, 1);
    g.fillCircle(cx - 11 * scale, cy + 20 * scale, 6 * scale);
    g.fillCircle(cx, cy + 22 * scale, 6 * scale);
    g.fillCircle(cx + 11 * scale, cy + 20 * scale, 6 * scale);
    g.fillStyle(0x1e293b, 1); g.fillCircle(cx, cy - 6 * scale, 5 * scale); g.fillCircle(cx + 12 * scale, cy - 6 * scale, 5 * scale);
    g.fillStyle(0xffffff, 1); g.fillCircle(cx + 1 * scale, cy - 8 * scale, 2 * scale); g.fillCircle(cx + 13 * scale, cy - 8 * scale, 2 * scale);
    return;
  }
  if (id === 'dragon') {
    g.fillStyle(ch.wing, .9);
    g.fillTriangle(cx - 8 * scale, cy, cx - 31 * scale, wingY - 5 * scale, cx - 4 * scale, cy + 10 * scale);
    g.fillTriangle(cx - 20 * scale, wingY, cx - 30 * scale, wingY + 13 * scale, cx - 7 * scale, cy + 3 * scale);
    g.fillStyle(ch.main, 1); g.fillEllipse(cx - 2 * scale, cy + 3 * scale, 42 * scale, 28 * scale);
    g.fillStyle(ch.main, 1); g.fillEllipse(cx + 16 * scale, cy - 7 * scale, 27 * scale, 19 * scale);
    g.fillStyle(0xfacc15, 1);
    g.fillTriangle(cx + 8 * scale, cy - 16 * scale, cx + 13 * scale, cy - 26 * scale, cx + 18 * scale, cy - 15 * scale);
    g.fillStyle(0xffffff, 1); g.fillCircle(cx + 21 * scale, cy - 10 * scale, 4 * scale);
    g.fillStyle(0x052e16, 1); g.fillCircle(cx + 22 * scale, cy - 10 * scale, 2 * scale);
    g.fillStyle(0xf97316, 1); g.fillTriangle(cx + 27 * scale, cy - 7 * scale, cx + 36 * scale, cy - 2 * scale, cx + 27 * scale, cy + 2 * scale);
    return;
  }
  if (id === 'chroma') {
    var rainbow = [0xef4444, 0xf97316, 0xfacc15, 0x22c55e, 0x38bdf8, 0xa78bfa];
    rainbow.forEach(function (c, i) {
      g.fillStyle(c, .9); g.fillEllipse(cx - 18 * scale - i * scale, wingY + i * scale, (27 - i * 2) * scale, 9 * scale);
    });
    for (var j = rainbow.length - 1; j >= 0; j--) {
      g.fillStyle(rainbow[j], 1); g.fillEllipse(cx, cy + 3 * scale, (43 - j * 2) * scale, (29 - j) * scale);
    }
    g.fillStyle(0xffffff, 1); g.fillCircle(cx + 17 * scale, cy - 7 * scale, 6 * scale);
    g.fillStyle(0x111827, 1); g.fillCircle(cx + 19 * scale, cy - 7 * scale, 3 * scale);
    g.fillStyle(0xf43f5e, 1); g.fillTriangle(cx + 24 * scale, cy - 5 * scale, cx + 34 * scale, cy, cx + 24 * scale, cy + 5 * scale);
    return;
  }

  // Wing and tail
  g.fillStyle(ch.wing, .95);
  g.fillEllipse(cx - 18 * scale, wingY, 27 * scale, 11 * scale);
  g.fillTriangle(cx - 9 * scale, cy - 1 * scale, cx - 30 * scale, wingY + 2 * scale, cx - 6 * scale, cy + 10 * scale);
  g.fillStyle(ch.trim, .55);
  g.fillTriangle(cx - 18 * scale, cy + 3 * scale, cx - 31 * scale, cy + 12 * scale, cx - 14 * scale, cy + 12 * scale);

  // Body + subtle shade
  g.fillStyle(ch.main, 1); g.fillEllipse(cx, cy + 3 * scale, 43 * scale, 29 * scale);
  g.fillStyle(ch.trim, .22); g.fillEllipse(cx + 5 * scale, cy + 8 * scale, 27 * scale, 10 * scale);
  g.fillStyle(ch.main, 1); g.fillCircle(cx + 16 * scale, cy - 7 * scale, 15 * scale);

  if (id === 'frost') {
    g.fillStyle(0xe0f2fe, .8);
    g.fillTriangle(cx - 5 * scale, cy - 11 * scale, cx, cy - 22 * scale, cx + 4 * scale, cy - 10 * scale);
    g.fillTriangle(cx + 6 * scale, cy - 10 * scale, cx + 10 * scale, cy - 20 * scale, cx + 14 * scale, cy - 9 * scale);
  }
  if (id === 'mecha') {
    g.lineStyle(2 * scale, 0x0f172a, .8); g.strokeEllipse(cx, cy + 3 * scale, 43 * scale, 29 * scale);
    g.fillStyle(0x22d3ee, .8); g.fillRect(cx - 7 * scale, cy + 1 * scale, 13 * scale, 3 * scale);
    g.fillStyle(0xef4444, .9); g.fillCircle(cx - 10 * scale, cy + 3 * scale, 2 * scale);
  }
  if (id === 'royal') {
    g.fillStyle(0xfde047, 1);
    g.fillTriangle(cx + 6 * scale, cy - 20 * scale, cx + 10 * scale, cy - 29 * scale, cx + 14 * scale, cy - 20 * scale);
    g.fillTriangle(cx + 13 * scale, cy - 20 * scale, cx + 18 * scale, cy - 31 * scale, cx + 22 * scale, cy - 18 * scale);
  }

  // Eye, visor, beak
  g.fillStyle(0xffffff, 1); g.fillCircle(cx + 20 * scale, cy - 10 * scale, 5.3 * scale);
  g.fillStyle(0x0f172a, 1); g.fillCircle(cx + 21 * scale, cy - 10 * scale, 2.8 * scale);
  g.fillStyle(0xffffff, 1); g.fillCircle(cx + 22 * scale, cy - 11 * scale, 1 * scale);
  if (id === 'mecha') { g.lineStyle(2 * scale, 0x67e8f9, .9); g.lineBetween(cx + 10 * scale, cy - 12 * scale, cx + 27 * scale, cy - 11 * scale); }
  g.fillStyle(id === 'frost' ? 0x93c5fd : 0xf97316, 1);
  g.fillTriangle(cx + 28 * scale, cy - 7 * scale, cx + 39 * scale, cy - 1 * scale, cx + 28 * scale, cy + 3 * scale);
}

function drawPickupTexture(g, pickup) {
  g.fillStyle(pickup.color, .16); g.fillCircle(24, 24, 22);
  g.lineStyle(3, pickup.color, .85); g.strokeCircle(24, 24, 17);
  g.lineStyle(1, 0xffffff, .5); g.strokeCircle(24, 24, 22);
  g.fillStyle(0xffffff, .92); g.fillCircle(24, 24, 6);
}

function drawGate(g, world, topH, gapTop, gapBottom, groundY, danger) {
  var w = GATE_W;
  var primary = danger ? 0x7f1d1d : world.near;
  var edge = danger ? 0xef4444 : world.glow;
  var accent = danger ? 0xf97316 : world.accent;
  var x = -w / 2;
  var topCapY = gapTop - 22;
  var botCapY = gapBottom;

  function bodyRect(y, h) {
    g.fillStyle(0x000000, .22); g.fillRoundedRect(x + 5, y + 5, w, h, 8);
    g.fillStyle(primary, 1); g.fillRoundedRect(x, y, w, h, 8);
    g.fillStyle(edge, .17); g.fillRect(x + 7, y + 4, 8, Math.max(0, h - 8));
    g.lineStyle(1, edge, .55); g.strokeRoundedRect(x, y, w, h, 8);
  }

  if (world.obstacle === 'crystal') {
    g.fillStyle(primary, 1); g.fillRect(x + 8, 0, w - 16, topH - 12);
    g.fillStyle(edge, .85);
    g.fillTriangle(x, gapTop, x + 22, gapTop - 45, x + 34, gapTop);
    g.fillTriangle(x + 22, gapTop, x + 48, gapTop - 58, x + 60, gapTop);
    g.fillTriangle(x + 45, gapTop, x + 68, gapTop - 38, x + w, gapTop);
    g.fillStyle(primary, 1); g.fillRect(x + 8, gapBottom + 12, w - 16, groundY - gapBottom - 12);
    g.fillStyle(edge, .85);
    g.fillTriangle(x, gapBottom, x + 18, gapBottom + 43, x + 34, gapBottom);
    g.fillTriangle(x + 22, gapBottom, x + 46, gapBottom + 58, x + 59, gapBottom);
    g.fillTriangle(x + 46, gapBottom, x + 67, gapBottom + 39, x + w, gapBottom);
    g.lineStyle(2, accent, .45); g.lineBetween(x + 18, 8, x + 32, topH - 30); g.lineBetween(x + 50, gapBottom + 28, x + 35, groundY - 10);
    return;
  }

  if (world.obstacle === 'coral') {
    bodyRect(0, Math.max(0, topCapY)); bodyRect(gapBottom + 22, Math.max(0, groundY - gapBottom - 22));
    g.fillStyle(primary, 1); g.fillRoundedRect(x - 8, topCapY, w + 16, 24, 10); g.fillRoundedRect(x - 8, botCapY, w + 16, 24, 10);
    g.fillStyle(edge, .9);
    for (var c = 0; c < 5; c++) {
      g.fillCircle(x + 7 + c * 15, gapTop - 8 - (c % 2) * 5, 5);
      g.fillCircle(x + 7 + c * 15, gapBottom + 8 + (c % 2) * 5, 5);
    }
    g.lineStyle(3, accent, .38); g.strokeCircle(0, topH * .45, 13); g.strokeCircle(0, gapBottom + (groundY - gapBottom) * .55, 15);
    return;
  }

  if (world.obstacle === 'temple') {
    bodyRect(0, Math.max(0, topCapY)); bodyRect(gapBottom + 22, Math.max(0, groundY - gapBottom - 22));
    g.fillStyle(primary, 1); g.fillRect(x - 10, topCapY, w + 20, 22); g.fillRect(x - 10, botCapY, w + 20, 22);
    g.fillStyle(edge, .5);
    for (var t = 0; t < 4; t++) { g.fillRect(x + 5 + t * 17, topCapY + 5, 10, 4); g.fillRect(x + 5 + t * 17, botCapY + 13, 10, 4); }
    g.lineStyle(2, accent, .45); g.strokeCircle(0, topH * .55, 11); g.strokeCircle(0, gapBottom + (groundY - gapBottom) * .45, 11);
    return;
  }

  if (world.obstacle === 'forge') {
    bodyRect(0, Math.max(0, topCapY)); bodyRect(gapBottom + 22, Math.max(0, groundY - gapBottom - 22));
    g.fillStyle(0x111827, 1); g.fillRoundedRect(x - 9, topCapY, w + 18, 24, 7); g.fillRoundedRect(x - 9, botCapY, w + 18, 24, 7);
    g.lineStyle(3, edge, .85); g.lineBetween(x - 2, gapTop - 5, x + w + 2, gapTop - 5); g.lineBetween(x - 2, gapBottom + 5, x + w + 2, gapBottom + 5);
    g.fillStyle(accent, .8);
    for (var b = 0; b < 4; b++) { g.fillCircle(x + 8 + b * 18, topCapY + 12, 3); g.fillCircle(x + 8 + b * 18, botCapY + 12, 3); }
    return;
  }

  if (world.obstacle === 'haunt') {
    bodyRect(0, Math.max(0, topCapY)); bodyRect(gapBottom + 22, Math.max(0, groundY - gapBottom - 22));
    g.fillStyle(primary, 1);
    g.fillTriangle(x - 8, gapTop - 2, 0, gapTop - 35, x + w + 8, gapTop - 2);
    g.fillTriangle(x - 8, gapBottom + 2, 0, gapBottom + 35, x + w + 8, gapBottom + 2);
    g.lineStyle(2, edge, .55); g.strokeCircle(0, topH * .55, 13); g.strokeCircle(0, gapBottom + (groundY - gapBottom) * .45, 13);
    g.fillStyle(accent, .6); g.fillCircle(0, topH * .55, 4); g.fillCircle(0, gapBottom + (groundY - gapBottom) * .45, 4);
    return;
  }

  if (world.obstacle === 'rift') {
    bodyRect(0, Math.max(0, topCapY)); bodyRect(gapBottom + 22, Math.max(0, groundY - gapBottom - 22));
    g.fillStyle(primary, 1); g.fillRoundedRect(x - 10, topCapY, w + 20, 24, 12); g.fillRoundedRect(x - 10, botCapY, w + 20, 24, 12);
    g.lineStyle(4, edge, .9); g.lineBetween(x - 5, gapTop - 5, x + w + 5, gapTop - 5); g.lineBetween(x - 5, gapBottom + 5, x + w + 5, gapBottom + 5);
    g.lineStyle(2, accent, .4);
    for (var r = 0; r < 4; r++) { g.strokeCircle(0, topH * .55, 8 + r * 6); g.strokeCircle(0, gapBottom + (groundY - gapBottom) * .45, 8 + r * 6); }
    return;
  }

  // Tower / lighthouse default
  bodyRect(0, Math.max(0, topCapY)); bodyRect(gapBottom + 22, Math.max(0, groundY - gapBottom - 22));
  g.fillStyle(primary, 1); g.fillRoundedRect(x - 9, topCapY, w + 18, 24, 7); g.fillRoundedRect(x - 9, botCapY, w + 18, 24, 7);
  g.lineStyle(2, edge, .65); g.lineBetween(x - 5, gapTop - 4, x + w + 5, gapTop - 4); g.lineBetween(x - 5, gapBottom + 4, x + w + 5, gapBottom + 4);
  if (world.obstacle === 'lighthouse') {
    g.fillStyle(accent, .5);
    for (var l = 0; l < 5; l++) { g.fillRect(x + 6, 10 + l * 34, w - 12, 7); g.fillRect(x + 6, groundY - 20 - l * 34, w - 12, 7); }
  } else {
    g.fillStyle(edge, .32);
    for (var y = 16; y < topCapY - 10; y += 28) { g.fillRoundedRect(x + 13, y, 13, 10, 3); g.fillRoundedRect(x + 43, y, 13, 10, 3); }
    for (var y2 = gapBottom + 38; y2 < groundY - 10; y2 += 28) { g.fillRoundedRect(x + 13, y2, 13, 10, 3); g.fillRoundedRect(x + 43, y2, 13, 10, 3); }
  }
}

function createBootScene(P) {
  return new P.Class({
    Extends: P.Scene,
    initialize: function Boot() { P.Scene.call(this, 'Boot'); },
    create: function () {
      var dot = this.make.graphics({ add: false }); dot.fillStyle(0xffffff, 1); dot.fillCircle(3, 3, 3); dot.generateTexture('fuo-dot', 6, 6); dot.destroy();
      var coin = this.make.graphics({ add: false });
      coin.fillStyle(0xfacc15, .18); coin.fillCircle(18, 18, 17); coin.lineStyle(3, 0xfacc15, .9); coin.strokeCircle(18, 18, 12); coin.fillStyle(0xfef08a, 1); coin.fillCircle(18, 18, 5); coin.generateTexture('fuo-coin', 36, 36); coin.destroy();
      var star = this.make.graphics({ add: false });
      star.fillStyle(0x67e8f9, .18); star.fillCircle(18, 18, 17); star.lineStyle(2, 0x67e8f9, .9); star.strokeCircle(18, 18, 12); star.fillStyle(0xffffff, 1);
      var pts = []; for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5; var rr = i % 2 ? 4 : 9; pts.push({ x: 18 + Math.cos(a) * rr, y: 18 + Math.sin(a) * rr }); }
      star.beginPath(); star.moveTo(pts[0].x, pts[0].y); for (var s = 1; s < pts.length; s++) star.lineTo(pts[s].x, pts[s].y); star.closePath(); star.fillPath(); star.generateTexture('fuo-star', 36, 36); star.destroy();
      var shield = this.make.graphics({ add: false }); shield.lineStyle(3, 0x60a5fa, .95); shield.strokeCircle(32, 32, 25); shield.lineStyle(2, 0x93c5fd, .4); shield.strokeCircle(32, 32, 31); shield.generateTexture('fuo-shield', 64, 64); shield.destroy();
      var cg = this.make.graphics({ add: false });
      CHARACTERS.forEach(function (ch) {
        for (var ph = 0; ph < 3; ph++) { cg.clear(); drawCharacter(cg, ch.id, ph, 34, 30, 1); cg.generateTexture('fuo-char-' + ch.id + '-' + ph, 72, 60); }
      });
      cg.destroy();
      PICKUPS.forEach(function (p) {
        var pg = this.make.graphics({ add: false }); drawPickupTexture(pg, p); pg.generateTexture('fuo-pick-' + p.id, 48, 48); pg.destroy();
      }, this);
      this.scene.start('Menu');
    }
  });
}

function createWorldLayers(scene, world, depthBase) {
  depthBase = depthBase || 0;
  var items = [];
  items.push(gradientSky(scene, world).setDepth(depthBase));

  // Celestial focal point
  var celestial = scene.add.graphics().setDepth(depthBase + 1);
  celestial.fillStyle(world.glow, .08); celestial.fillCircle(GAME_W * .77, 112, 78);
  celestial.fillStyle(world.glow, .15); celestial.fillCircle(GAME_W * .77, 112, 53);
  celestial.fillStyle(world.accent, .7); celestial.fillCircle(GAME_W * .77, 112, 31);
  if (world.id === 'haunt') { celestial.fillStyle(world.skyTop, 1); celestial.fillCircle(GAME_W * .79, 103, 27); }
  items.push(celestial);

  var stars = [];
  var starCount = world.id === 'sunset' || world.id === 'sky' ? 24 : 64;
  for (var i = 0; i < starCount; i++) {
    var st = scene.add.circle(rand(0, GAME_W), rand(12, GAME_H - 150), Math.random() * 1.4 + .35, 0xffffff, Math.random() * .42 + .08).setDepth(depthBase + 1);
    stars.push(st); items.push(st);
    if (Math.random() > .7) scene.tweens.add({ targets: st, alpha: .02, duration: rand(1400, 4000), yoyo: true, repeat: -1 });
  }

  // Far skyline / mountains
  var far = scene.add.graphics().setDepth(depthBase + 2);
  far.fillStyle(world.far, .78);
  var fx = -25;
  while (fx < GAME_W + 50) {
    var fw = rand(40, 78), fh = rand(70, 170);
    if (world.id === 'crystal' || world.id === 'ember') {
      far.fillTriangle(fx, GAME_H - GROUND_H, fx + fw / 2, GAME_H - GROUND_H - fh, fx + fw, GAME_H - GROUND_H);
    } else if (world.id === 'sky') {
      far.fillEllipse(fx + fw / 2, GAME_H - 115 - rand(0, 40), fw * 1.5, 22);
    } else {
      far.fillRoundedRect(fx, GAME_H - GROUND_H - fh, fw, fh, 5);
      if (world.id === 'neo' || world.id === 'sunset') {
        far.fillStyle(world.glow, .12);
        for (var wy = GAME_H - GROUND_H - fh + 12; wy < GAME_H - GROUND_H - 12; wy += 20) {
          if (Math.random() > .25) { far.fillRect(fx + 9, wy, 7, 5); far.fillRect(fx + 25, wy, 7, 5); }
        }
        far.fillStyle(world.far, .78);
      }
    }
    fx += fw + rand(4, 13);
  }
  items.push(far);

  var near = scene.add.graphics().setDepth(depthBase + 3);
  near.fillStyle(world.near, .96);
  var nx = -20;
  while (nx < GAME_W + 50) {
    var nw = rand(48, 88), nh = rand(45, 115);
    if (world.id === 'ocean') {
      near.fillEllipse(nx + nw / 2, GAME_H - GROUND_H + 8, nw, nh);
      near.fillStyle(world.accent, .17); near.fillCircle(nx + nw * .45, GAME_H - GROUND_H - nh * .45, 8); near.fillStyle(world.near, .96);
    } else if (world.id === 'haunt') {
      near.fillTriangle(nx, GAME_H - GROUND_H, nx + nw / 2, GAME_H - GROUND_H - nh, nx + nw, GAME_H - GROUND_H);
    } else {
      near.fillRoundedRect(nx, GAME_H - GROUND_H - nh, nw, nh + 4, 7);
    }
    nx += nw + rand(5, 12);
  }
  items.push(near);

  var haze = scene.add.rectangle(GAME_W / 2, GAME_H - 95, GAME_W, 120, world.glow, .055).setDepth(depthBase + 4);
  items.push(haze);
  return { items: items, stars: stars, far: far, near: near, sky: items[0] };
}

function questFor(profile) {
  var tier = profile.questTier || 0;
  var type = tier % 3;
  var stage = Math.floor(tier / 3) + 1;
  if (type === 0) return { type: 'gates', label: 'Fly through ' + (20 + stage * 10) + ' gates', target: 20 + stage * 10, current: profile.totalGates || 0, reward: 50 + stage * 15 };
  if (type === 1) return { type: 'coins', label: 'Collect ' + (30 + stage * 15) + ' coins', target: 30 + stage * 15, current: profile.totalCoins || 0, reward: 65 + stage * 15 };
  return { type: 'perfects', label: 'Hit ' + (6 + stage * 3) + ' perfect gates', target: 6 + stage * 3, current: profile.totalPerfects || 0, reward: 80 + stage * 20 };
}

function createMenuScene(P, storage, profile, display) {
  return new P.Class({
    Extends: P.Scene,
    initialize: function Menu() { P.Scene.call(this, 'Menu'); },
    create: function () {
      var self = this;
      this.charIndex = Math.max(0, CHARACTERS.findIndex(function (c) { return c.id === profile.selectedChar; }));
      this.worldIndex = Math.max(0, WORLDS.findIndex(function (w) { return w.id === profile.selectedWorld; }));
      this.diffIndex = Math.max(0, DIFFICULTIES.findIndex(function (d) { return d.id === profile.difficulty; }));
      this.modeIndex = Math.max(0, MODES.findIndex(function (m) { return m.id === profile.mode; }));
      this.loadoutIndex = Math.max(0, LOADOUTS.findIndex(function (p) { return p.id === profile.loadout; }));
      this.layers = createWorldLayers(this, WORLDS[this.worldIndex], 0);
      this.cameras.main.fadeIn(220, 0, 0, 0);

      // Darkened glass veil for legibility
      this.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, 0x020617, .24).setDepth(5);

      // Top status rail
      roundedPanel(this, GAME_W / 2, 26, 418, 38, 0x020617, .62, 0xffffff, .1, 13).setDepth(10);
      this.levelText = this.add.text(36, 26, 'LV ' + profile.level, { fontFamily: 'Inter, system-ui', fontSize: '12px', fontStyle: 'bold', color: '#e2e8f0' }).setOrigin(0, .5).setDepth(11);
      this.add.text(117, 26, 'XP', { fontFamily: 'Inter, system-ui', fontSize: '9px', fontStyle: 'bold', color: '#64748b' }).setOrigin(0, .5).setDepth(11);
      var need = xpForNext(profile.level); var xpRatio = clamp(profile.xp / need, 0, 1);
      var xpBg = this.add.graphics().setDepth(11); xpBg.fillStyle(0xffffff, .08); xpBg.fillRoundedRect(137, 22, 118, 8, 4); xpBg.fillStyle(0x38bdf8, .9); xpBg.fillRoundedRect(137, 22, 118 * xpRatio, 8, 4);
      this.add.text(356, 26, '◆ ' + profile.coins, { fontFamily: 'Inter, system-ui', fontSize: '12px', fontStyle: 'bold', color: '#fde047' }).setOrigin(0, .5).setDepth(11);

      // Brand
      this.add.text(GAME_W / 2, 72, 'RIFTWING', { fontFamily: 'Inter, system-ui', fontSize: '31px', fontStyle: 'bold', color: '#ffffff', stroke: '#071425', strokeThickness: 5 }).setOrigin(.5).setDepth(11);
      this.add.text(GAME_W / 2, 99, 'S K Y B O U N D', { fontFamily: 'Inter, system-ui', fontSize: '10px', fontStyle: 'bold', letterSpacing: 5, color: '#67e8f9' }).setOrigin(.5).setDepth(11);
      var expand = this.add.text(432, 68, '⛶', { fontFamily: 'system-ui, sans-serif', fontSize: '22px', fontStyle: 'bold', color: '#a5f3fc' }).setOrigin(1, 0).setDepth(15).setInteractive({ useHandCursor: true });
      expand.setData('label', 'Expand Riftwing');
      expand.on('pointerdown', function () { display.toggleFullscreen().catch(function () {}); });

      // Character showcase
      roundedPanel(this, GAME_W / 2, 171, 356, 112, 0x020617, .57, 0xffffff, .1, 24).setDepth(10);
      this.charImage = this.add.image(GAME_W / 2, 157, 'fuo-char-' + CHARACTERS[this.charIndex].id + '-1').setScale(1.48).setDepth(12);
      this.tweens.add({ targets: this.charImage, y: 150, duration: 950, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      var left = makeButton(this, 82, 163, 38, 42, '‹', { fill: 0x0f172a, hover: 0x1e3a5f, stroke: 0x38bdf8, fontSize: 27, onClick: function () { self._navChar(-1); } }); left.container.setDepth(13);
      var right = makeButton(this, 378, 163, 38, 42, '›', { fill: 0x0f172a, hover: 0x1e3a5f, stroke: 0x38bdf8, fontSize: 27, onClick: function () { self._navChar(1); } }); right.container.setDepth(13);
      this.charName = this.add.text(GAME_W / 2, 205, '', { fontFamily: 'Inter, system-ui', fontSize: '16px', fontStyle: 'bold', color: '#ffffff' }).setOrigin(.5).setDepth(13);
      this.charTrait = this.add.text(GAME_W / 2, 226, '', { fontFamily: 'Inter, system-ui', fontSize: '10px', color: '#94a3b8' }).setOrigin(.5).setDepth(13);

      // World card
      this.worldPanel = roundedPanel(this, GAME_W / 2, 275, 398, 70, 0x07111f, .82, 0x38bdf8, .24, 18).setDepth(10);
      this.worldDot = this.add.circle(55, 275, 20, WORLDS[this.worldIndex].glow, .3).setDepth(11);
      this.worldDot2 = this.add.circle(55, 275, 10, WORLDS[this.worldIndex].accent, .88).setDepth(12);
      this.worldName = this.add.text(86, 260, '', { fontFamily: 'Inter, system-ui', fontSize: '14px', fontStyle: 'bold', color: '#ffffff' }).setOrigin(0, .5).setDepth(12);
      this.worldSub = this.add.text(86, 281, '', { fontFamily: 'Inter, system-ui', fontSize: '10px', color: '#94a3b8' }).setOrigin(0, .5).setDepth(12);
      this.worldLock = this.add.text(86, 299, '', { fontFamily: 'Inter, system-ui', fontSize: '9px', fontStyle: 'bold', color: '#fb7185' }).setOrigin(0, .5).setDepth(12);
      var worldPrev = makeButton(this, 357, 275, 32, 36, '‹', { fill: 0x0f172a, hover: 0x1e293b, stroke: 0x64748b, fontSize: 22, onClick: function () { self._navWorld(-1); } }); worldPrev.container.setDepth(13);
      var worldNext = makeButton(this, 397, 275, 32, 36, '›', { fill: 0x0f172a, hover: 0x1e293b, stroke: 0x64748b, fontSize: 22, onClick: function () { self._navWorld(1); } }); worldNext.container.setDepth(13);

      // Mode selector
      this.add.text(31, 327, 'MODE', { fontFamily: 'Inter, system-ui', fontSize: '9px', fontStyle: 'bold', letterSpacing: 2, color: '#64748b' }).setDepth(12);
      this.modeButtons = [];
      MODES.forEach(function (mode, i) {
        var btn = makeButton(self, 92 + i * 139, 351, 126, 39, mode.name, { fill: 0x0f172a, hover: mode.color, stroke: mode.color, textColor: '#cbd5e1', fontSize: 11, onClick: function () { self._setMode(i); } });
        btn.container.setDepth(12); self.modeButtons.push(btn);
      });

      // Difficulty selector
      this.add.text(31, 386, 'FLIGHT CLASS', { fontFamily: 'Inter, system-ui', fontSize: '9px', fontStyle: 'bold', letterSpacing: 2, color: '#64748b' }).setDepth(12);
      this.diffButtons = [];
      DIFFICULTIES.forEach(function (diff, i) {
        var btn = makeButton(self, 67 + i * 109, 410, 96, 34, diff.name, { fill: 0x0f172a, hover: diff.color, stroke: diff.color, textColor: '#cbd5e1', fontSize: 10, onClick: function () { self._setDiff(i); } });
        btn.container.setDepth(12); self.diffButtons.push(btn);
      });

      // Perk/loadout card
      roundedPanel(this, GAME_W / 2, 462, 398, 58, 0x020617, .7, 0xffffff, .1, 16).setDepth(10);
      this.perkIcon = this.add.text(50, 461, '', { fontFamily: 'Inter, system-ui', fontSize: '23px', fontStyle: 'bold', color: '#ffffff' }).setOrigin(.5).setDepth(12);
      this.perkName = this.add.text(79, 450, '', { fontFamily: 'Inter, system-ui', fontSize: '12px', fontStyle: 'bold', color: '#ffffff' }).setOrigin(0, .5).setDepth(12);
      this.perkDesc = this.add.text(79, 470, '', { fontFamily: 'Inter, system-ui', fontSize: '9px', color: '#94a3b8' }).setOrigin(0, .5).setDepth(12);
      this.perkLock = this.add.text(79, 486, '', { fontFamily: 'Inter, system-ui', fontSize: '8px', fontStyle: 'bold', color: '#fb7185' }).setOrigin(0, .5).setDepth(12);
      var perkPrev = makeButton(this, 356, 462, 31, 34, '‹', { fill: 0x0f172a, hover: 0x312e81, stroke: 0xa78bfa, fontSize: 20, onClick: function () { self._navPerk(-1); } }); perkPrev.container.setDepth(13);
      var perkNext = makeButton(this, 397, 462, 31, 34, '›', { fill: 0x0f172a, hover: 0x312e81, stroke: 0xa78bfa, fontSize: 20, onClick: function () { self._navPerk(1); } }); perkNext.container.setDepth(13);

      // Play button
      this.playButton = makeButton(this, GAME_W / 2, 528, 248, 54, 'START FLIGHT', { fill: 0x22c55e, hover: 0x4ade80, textColor: '#052e16', fontSize: 18, radius: 17, onClick: function () { self._start(); } });
      this.playButton.container.setDepth(13);
      this.tweens.add({ targets: this.playButton.container, scaleX: 1.025, scaleY: 1.025, duration: 800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

      // Quest / reward strip
      var q = questFor(profile); var qProgress = clamp(q.current / q.target, 0, 1);
      roundedPanel(this, GAME_W / 2, 590, 398, 66, 0x020617, .74, 0xffffff, .1, 16).setDepth(10);
      this.add.text(38, 573, 'SKYBOUND CONTRACT', { fontFamily: 'Inter, system-ui', fontSize: '8px', fontStyle: 'bold', letterSpacing: 2, color: '#67e8f9' }).setDepth(12);
      this.add.text(38, 590, q.label, { fontFamily: 'Inter, system-ui', fontSize: '10px', fontStyle: 'bold', color: '#e2e8f0' }).setDepth(12);
      this.add.text(389, 590, '◆ ' + q.reward, { fontFamily: 'Inter, system-ui', fontSize: '10px', fontStyle: 'bold', color: '#fde047' }).setOrigin(1, 0).setDepth(12);
      var qg = this.add.graphics().setDepth(12); qg.fillStyle(0xffffff, .08); qg.fillRoundedRect(38, 610, 350, 7, 4); qg.fillStyle(0x22d3ee, .85); qg.fillRoundedRect(38, 610, 350 * qProgress, 7, 4);
      this.add.text(392, 608, Math.min(q.current, q.target) + '/' + q.target, { fontFamily: 'Inter, system-ui', fontSize: '8px', color: '#94a3b8' }).setOrigin(1, 1).setDepth(12);

      this.add.text(GAME_W / 2, 644, 'SPACE / CLICK / TAP  •  ESC RETURNS TO MENU', { fontFamily: 'Inter, system-ui', fontSize: '8px', fontStyle: 'bold', letterSpacing: 1, color: '#64748b' }).setOrigin(.5).setDepth(12);

      this.input.keyboard.on('keydown-LEFT', function () { self._navChar(-1); });
      this.input.keyboard.on('keydown-RIGHT', function () { self._navChar(1); });
      this.input.keyboard.on('keydown-A', function () { self._navWorld(-1); });
      this.input.keyboard.on('keydown-D', function () { self._navWorld(1); });
      this.input.keyboard.on('keydown-SPACE', function () { self._start(); });
      this.input.keyboard.on('keydown-ENTER', function () { self._start(); });
      this._refreshAll();

      if (profile.pendingDaily > 0) {
        this.time.delayedCall(280, function () { self._toast('DAILY SUPPLY', '+' + profile.pendingDaily + ' coins added', 0xfacc15); profile.pendingDaily = 0; saveProfile(storage, profile); });
      }
    },
    _toast: function (title, sub, color) {
      var box = roundedPanel(this, GAME_W / 2, 110, 270, 56, 0x020617, .94, color, .65, 16).setDepth(60);
      var t = this.add.text(GAME_W / 2, 101, title, { fontFamily: 'Inter, system-ui', fontSize: '12px', fontStyle: 'bold', color: hex(color) }).setOrigin(.5).setDepth(61);
      var s = this.add.text(GAME_W / 2, 121, sub, { fontFamily: 'Inter, system-ui', fontSize: '9px', color: '#cbd5e1' }).setOrigin(.5).setDepth(61);
      this.tweens.add({ targets: [box, t, s], y: '-=8', alpha: 0, delay: 1900, duration: 420, onComplete: function () { box.destroy(); t.destroy(); s.destroy(); } });
    },
    _refreshAll: function () { this._refreshChar(); this._refreshWorld(); this._refreshMode(); this._refreshDiff(); this._refreshPerk(); },
    _navChar: function (dir) { sfx.menu(); this.charIndex = (this.charIndex + dir + CHARACTERS.length) % CHARACTERS.length; this._refreshChar(); },
    _navWorld: function (dir) { sfx.menu(); this.worldIndex = (this.worldIndex + dir + WORLDS.length) % WORLDS.length; this._refreshWorld(true); },
    _navPerk: function (dir) { sfx.menu(); this.loadoutIndex = (this.loadoutIndex + dir + LOADOUTS.length) % LOADOUTS.length; this._refreshPerk(); },
    _setMode: function (idx) { sfx.menu(); this.modeIndex = idx; this._refreshMode(); },
    _setDiff: function (idx) { sfx.menu(); this.diffIndex = idx; this._refreshDiff(); },
    _refreshChar: function () {
      var ch = CHARACTERS[this.charIndex], unlocked = profile.level >= ch.unlock;
      this.charImage.setTexture('fuo-char-' + ch.id + '-1').setAlpha(unlocked ? 1 : .25);
      this.charName.setText(ch.name + '  •  ' + ch.title).setColor(unlocked ? '#ffffff' : '#64748b');
      this.charTrait.setText(unlocked ? ch.trait : 'LOCKED — reach player level ' + ch.unlock).setColor(unlocked ? '#94a3b8' : '#fb7185');
    },
    _refreshWorld: function (rebuild) {
      var w = WORLDS[this.worldIndex], unlocked = profile.level >= w.unlock;
      this.worldName.setText(w.name).setColor(unlocked ? '#ffffff' : '#64748b');
      this.worldSub.setText(w.subtitle);
      this.worldLock.setText(unlocked ? '' : 'LOCKED — player level ' + w.unlock);
      this.worldDot.setFillStyle(w.glow, .3); this.worldDot2.setFillStyle(w.accent, unlocked ? .88 : .25);
      if (rebuild) {
        this.layers.items.forEach(function (o) { if (o && o.destroy) o.destroy(); });
        this.layers = createWorldLayers(this, w, 0);
        this.children.bringToTop(this.worldPanel);
      }
    },
    _refreshMode: function () {
      this.modeButtons.forEach(function (btn, i) {
        var m = MODES[i], selected = i === this.modeIndex;
        btn.bg.clear(); btn.bg.fillStyle(selected ? m.color : 0x0f172a, selected ? .96 : .92); btn.bg.fillRoundedRect(-63, -19.5, 126, 39, 13); btn.bg.lineStyle(1, m.color, selected ? .95 : .42); btn.bg.strokeRoundedRect(-63, -19.5, 126, 39, 13); btn.text.setColor(selected ? '#07111f' : '#cbd5e1');
      }, this);
    },
    _refreshDiff: function () {
      this.diffButtons.forEach(function (btn, i) {
        var d = DIFFICULTIES[i], selected = i === this.diffIndex;
        btn.bg.clear(); btn.bg.fillStyle(selected ? d.color : 0x0f172a, selected ? .96 : .92); btn.bg.fillRoundedRect(-48, -17, 96, 34, 11); btn.bg.lineStyle(1, d.color, selected ? .95 : .4); btn.bg.strokeRoundedRect(-48, -17, 96, 34, 11); btn.text.setColor(selected ? '#07111f' : '#cbd5e1');
      }, this);
    },
    _refreshPerk: function () {
      var perk = LOADOUTS[this.loadoutIndex], unlocked = profile.level >= perk.unlock;
      this.perkIcon.setText(perk.icon).setColor(unlocked ? hex(perk.color) : '#475569');
      this.perkName.setText(perk.name).setColor(unlocked ? '#ffffff' : '#64748b');
      this.perkDesc.setText(perk.desc);
      this.perkLock.setText(unlocked ? '' : 'Unlocks at level ' + perk.unlock);
    },
    _start: function () {
      initAudio();
      var ch = CHARACTERS[this.charIndex], w = WORLDS[this.worldIndex], perk = LOADOUTS[this.loadoutIndex];
      if (profile.level < ch.unlock) { this.cameras.main.shake(160, .006); this._toast('CHARACTER LOCKED', 'Reach player level ' + ch.unlock, 0xfb7185); return; }
      if (profile.level < w.unlock) { this.cameras.main.shake(160, .006); this._toast('WORLD LOCKED', 'Reach player level ' + w.unlock, 0xfb7185); return; }
      if (profile.level < perk.unlock) { this.cameras.main.shake(160, .006); this._toast('PERK LOCKED', 'Reach player level ' + perk.unlock, 0xfb7185); return; }
      profile.selectedChar = ch.id; profile.selectedWorld = w.id; profile.difficulty = DIFFICULTIES[this.diffIndex].id; profile.mode = MODES[this.modeIndex].id; profile.loadout = perk.id;
      saveProfile(storage, profile);
      sfx.select();
      this.cameras.main.fadeOut(180, 0, 0, 0);
      var self = this;
      this.time.delayedCall(190, function () { self.scene.start('Game', { charId: ch.id, worldId: w.id, diffId: profile.difficulty, modeId: profile.mode, loadoutId: perk.id }); });
    }
  });
}

function createGameScene(P, storage, profile) {
  return new P.Class({
    Extends: P.Scene,
    initialize: function Game() { P.Scene.call(this, 'Game'); },
    init: function (data) {
      data = data || {};
      this.char = charById(data.charId || profile.selectedChar);
      this.startWorld = worldById(data.worldId || profile.selectedWorld);
      this.diff = diffById(data.diffId || profile.difficulty);
      this.mode = modeById(data.modeId || profile.mode);
      this.loadout = loadoutById(data.loadoutId || profile.loadout);
    },
    create: function () {
      var self = this;
      this.score = 0; this.runCoins = 0; this.runStars = 0; this.perfects = 0; this.nearMisses = 0;
      this.started = false; this.dead = false; this.gameOverVisible = false; this.pauseInput = false;
      this.playerY = GAME_H * .43; this.velocity = 0; this.playerScale = 1; this.wingPhase = 1; this.wingClock = 0;
      this.speed = this.diff.speed; this.distance = 0; this.spawnEvery = this.mode.id === 'chaos' ? 182 : 208;
      // Endless progression still needs a human-playable reaction window. The
      // cap preserves the intended late-game pressure without allowing gate
      // intervals to collapse toward zero as levels continue indefinitely.
      this.speedCap = Math.min(this.diff.speed + (this.mode.id === 'chaos' ? 250 : 180), this.mode.id === 'chaos' ? 580 : 520);
      this.gates = []; this.collectibles = []; this.pickups = []; this.runLevel = 1;
      // Route-aware generation keeps consecutive openings physically connected.
      // A minimum center-to-center flight time prevents late-game speed from
      // compressing passages into an input window no player can react to.
      this.minGateInterval = this.mode.id === 'chaos' ? .44 : .50;
      if (this.diff.id === 'nightmare') this.minGateInterval += .04;
      this.lastGateRouteCenter = this.playerY;
      this.routeWavePhase = Math.random() * Math.PI * 2;
      this.levelSpan = this.mode.id === 'chaos' ? 7 : 9;
      this.levelMeterDisplay = 0; this.levelMeterVelocity = 0; this.levelMeterHold = 0; this.levelMeterWasHolding = false;
      this.levelMeterLastRender = -1000; this.effectHudText = '';
      this.levelMeterSparkClock = 0; this.levelMeterUrgent = false;
      // Non-blocking gameplay announcements. Important events are queued into a
      // shallow translucent dock just above the ground, keeping the bird and the
      // active gate opening unobstructed while remaining easy to notice.
      this.announcementQueue = []; this.announcementActive = false; this.announcementKey = ''; this.announcementCard = null;
      this.world = this.startWorld; this.worldCursor = Math.max(0, WORLDS.findIndex(function (w) { return w.id === self.startWorld.id; }));
      this.shields = 0; this.phaseTimer = 0; this.slowTimer = 0; this.miniTimer = 0; this.doubleTimer = 0; this.magnetTimer = 0; this.featherTimer = 0;
      this.reviveReady = this.loadout.id === 'phoenix'; this.overdriveUsed = false; this.rescueCooldown = 0;
      this.combo = 0; this.bestCombo = 0; this.gatesSpawned = 0; this.nextPickup = this.loadout.id === 'lucky' ? rand(3, 5) : rand(5, 8);
      this.nextChest = 10;

      this.bg = createWorldLayers(this, this.world, 0);
      this.worldTint = this.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, 0xffffff, 0).setDepth(4);
      this.ground = this.add.graphics().setDepth(18);
      this._drawGround();

      this.player = this.add.image(PLAYER_X, this.playerY, 'fuo-char-' + this.char.id + '-1').setDepth(25);
      this.shieldRing = this.add.image(PLAYER_X, this.playerY, 'fuo-shield').setDepth(26).setAlpha(0);
      this.trail = [];

      // HUD glass rail + animated level heat meter
      roundedPanel(this, GAME_W / 2, 33, 420, 50, 0x020617, .62, 0xffffff, .1, 14).setDepth(40);
      this.levelHud = this.add.text(29, 25, 'LEVEL 1 · 9 LEFT', { fontFamily: 'Inter, system-ui', fontSize: '9px', fontStyle: 'bold', color: '#67e8f9' }).setOrigin(0, .5).setDepth(43);
      this.scoreHud = this.add.text(GAME_W / 2, 27, '0', { fontFamily: 'Inter, system-ui', fontSize: '25px', fontStyle: 'bold', color: '#ffffff', stroke: '#020617', strokeThickness: 4 }).setOrigin(.5).setDepth(43);
      this.coinHud = this.add.text(431, 25, '◆ 0', { fontFamily: 'Inter, system-ui', fontSize: '11px', fontStyle: 'bold', color: '#fde047' }).setOrigin(1, .5).setDepth(43);
      this.levelMeterGlow = this.add.graphics().setDepth(41);
      this.levelMeterGfx = this.add.graphics().setDepth(42);
      this.levelMeterTip = this.add.circle(29, 50, 4, 0x22d3ee, 0).setDepth(44);
      this.worldHud = this.add.text(GAME_W / 2, 66, this.world.name.toUpperCase(), { fontFamily: 'Inter, system-ui', fontSize: '8px', fontStyle: 'bold', letterSpacing: 2, color: '#94a3b8' }).setOrigin(.5).setDepth(41);
      this._updateLevelMeter(0, 16);

      this.effectHud = this.add.text(GAME_W / 2, GAME_H - 74, '', { fontFamily: 'Inter, system-ui', fontSize: '9px', fontStyle: 'bold', color: '#e2e8f0', stroke: '#020617', strokeThickness: 3 }).setOrigin(.5).setDepth(42);
      this.startCard = roundedPanel(this, GAME_W / 2, GAME_H * .55, 294, 82, 0x020617, .82, this.world.glow, .42, 20).setDepth(40);
      this.startTitle = this.add.text(GAME_W / 2, GAME_H * .55 - 14, 'READY FOR TAKEOFF?', { fontFamily: 'Inter, system-ui', fontSize: '15px', fontStyle: 'bold', color: '#ffffff' }).setOrigin(.5).setDepth(41);
      this.startSub = this.add.text(GAME_W / 2, GAME_H * .55 + 13, 'SPACE / CLICK / TAP TO FLAP', { fontFamily: 'Inter, system-ui', fontSize: '9px', fontStyle: 'bold', letterSpacing: 1, color: '#67e8f9' }).setOrigin(.5).setDepth(41);

      this._applyLoadout();
      this.input.on('pointerdown', function (pointer, over) {
        if (self.gameOverVisible && over && over.length) return;
        self._action();
      });
      this.input.keyboard.on('keydown-SPACE', function () { self._action(); });
      this.input.keyboard.on('keydown-UP', function () { self._action(); });
      this.input.keyboard.on('keydown-ESC', function () { if (!self.pauseInput) self.scene.start('Menu'); });
      this.cameras.main.fadeIn(180, 0, 0, 0);
    },
    _applyLoadout: function () {
      if (this.loadout.id === 'guardian') this.shields = 1;
      if (this.loadout.id === 'mini') this.miniTimer = 999999;
      if (this.loadout.id === 'overdrive') { this.doubleTimer = 8000; this.overdriveUsed = true; }
      if (this.char.id === 'dragon') this.shields = Math.max(this.shields, 1);
    },
    _drawGround: function () {
      this.ground.clear();
      this.ground.fillStyle(0x000000, .32); this.ground.fillRect(0, GAME_H - GROUND_H - 4, GAME_W, GROUND_H + 4);
      this.ground.fillStyle(this.world.ground, 1); this.ground.fillRect(0, GAME_H - GROUND_H, GAME_W, GROUND_H);
      this.ground.fillStyle(this.world.glow, .65); this.ground.fillRect(0, GAME_H - GROUND_H, GAME_W, 4);
      this.ground.fillStyle(this.world.accent, .12);
      for (var i = 0; i < 16; i++) this.ground.fillRect(i * 33 - 8, GAME_H - 36 + (i % 2) * 8, 22, 3);
    },
    _updateLevelMeter: function (time, delta) {
      var x = 29, y = 47, width = 402, height = 7;
      var completedAt = (this.runLevel - 1) * this.levelSpan;
      var localScore = clamp(this.score - completedAt, 0, this.levelSpan);
      var target = localScore / this.levelSpan;
      var celebrating = this.levelMeterHold > 0;

      if (celebrating) {
        // Finish the last slice visibly instead of snapping the meter to 100%.
        target = 1;
      } else if (this.levelMeterWasHolding) {
        this.levelMeterWasHolding = false;
        this.levelMeterDisplay = 0;
        this.levelMeterVelocity = 0;
      }

      // Time-based, acceleration-limited fill. Each scored gate is absorbed
      // across nearly the full travel time to the next gate, eliminating the
      // old chunky score-step jump while keeping the meter honest (never ahead).
      var meterDt = Math.min(delta, 50) / 1000;
      var meterGap = target - this.levelMeterDisplay;
      var maxMeterSpeed = celebrating ? .4 : .18;
      var desiredMeterVelocity = clamp(meterGap * 3.2, -maxMeterSpeed, maxMeterSpeed);
      var meterAcceleration = celebrating ? 1.35 : 1.1;
      var velocityDelta = clamp(desiredMeterVelocity - this.levelMeterVelocity, -meterAcceleration * meterDt, meterAcceleration * meterDt);
      this.levelMeterVelocity += velocityDelta;

      var meterStep = this.levelMeterVelocity * meterDt;
      if ((meterGap >= 0 && meterStep >= meterGap) || (meterGap <= 0 && meterStep <= meterGap)) {
        this.levelMeterDisplay = target;
        this.levelMeterVelocity = 0;
      } else {
        this.levelMeterDisplay += meterStep;
      }

      // Hold the full burning meter briefly only after it actually reaches 100%.
      if (celebrating && this.levelMeterDisplay >= .998) {
        this.levelMeterDisplay = 1;
        this.levelMeterVelocity = 0;
        this.levelMeterHold = Math.max(0, this.levelMeterHold - delta);
      }

      var ratio = clamp(this.levelMeterDisplay, 0, 1);
      var fillWidth = width * ratio;
      var heat = levelHeatColor(ratio);
      var pulse = ratio >= .72 ? .5 + Math.sin(time * (.012 + ratio * .01)) * .22 : .34;

      // The old package rebuilt dozens of tiny meter segments on every game
      // frame. The physics remain 60 FPS, while this decorative HUD is capped
      // at 30 FPS to keep the renderer focused on input, gates and collision.
      if (time - this.levelMeterLastRender < 33) return;
      this.levelMeterLastRender = time;

      this.levelMeterGlow.clear();
      this.levelMeterGlow.fillStyle(heat, ratio > 0 ? .11 + ratio * .16 + pulse * .05 : 0);
      if (fillWidth > .5) this.levelMeterGlow.fillRoundedRect(x - 3, y - 3, fillWidth + 7, height + 6, 7);

      this.levelMeterGfx.clear();
      this.levelMeterGfx.fillStyle(0xffffff, .075);
      this.levelMeterGfx.fillRoundedRect(x, y, width, height, height / 2);
      this.levelMeterGfx.lineStyle(1, 0xffffff, .08);
      this.levelMeterGfx.strokeRoundedRect(x, y, width, height, height / 2);

      if (fillWidth > 0) {
        var segment = 7;
        for (var sx = 0; sx < fillWidth; sx += segment) {
          var segmentWidth = Math.min(segment + 1, fillWidth - sx);
          var segmentRatio = clamp((sx + segmentWidth) / width, 0, 1);
          this.levelMeterGfx.fillStyle(levelHeatColor(segmentRatio), .96);
          this.levelMeterGfx.fillRect(x + sx, y + 1, segmentWidth, height - 2);
        }
        var streakOffset = (time * .055) % 18;
        this.levelMeterGfx.fillStyle(0xffffff, .15 + pulse * .08);
        for (var stripe = -18 + streakOffset; stripe < fillWidth; stripe += 18) {
          this.levelMeterGfx.fillRect(x + stripe, y + 1, 3, height - 2);
        }
      }

      var tipX = x + fillWidth;
      this.levelMeterTip.setPosition(tipX, y + height / 2).setFillStyle(heat, 1);
      this.levelMeterTip.setAlpha(fillWidth > .5 ? .65 + pulse * .35 : 0).setScale(1 + ratio * .55 + pulse * .18);

      var left = Math.max(0, this.levelSpan - localScore);
      if (celebrating) {
        this.levelHud.setText('LEVEL ' + Math.max(1, this.runLevel - 1) + ' CLEARED!').setColor('#ffffff');
      } else if (target >= .72) {
        this.levelHud.setText('FINAL BURN · ' + left + (left === 1 ? ' GATE LEFT' : ' GATES LEFT')).setColor('#fb923c');
      } else {
        this.levelHud.setText('LEVEL ' + this.runLevel + ' · ' + left + ' LEFT').setColor(hex(levelHeatColor(target)));
      }

      if (!celebrating && target >= .72 && !this.levelMeterUrgent) {
        this.levelMeterUrgent = true;
        sfx.finalBurn();
        this._announce('FINAL BURN', left + (left === 1 ? ' GATE LEFT' : ' GATES LEFT'), 'Finish the level', 0xfb923c, '🔥', 'final-burn-' + this.runLevel);
      } else if (!celebrating && target < .28) {
        this.levelMeterUrgent = false;
      }

      if (this.started && !this.dead && (target >= .58 || celebrating)) {
        this.levelMeterSparkClock -= delta;
        var interval = celebrating ? 34 : Math.max(42, 150 - target * 110);
        if (this.levelMeterSparkClock <= 0) {
          this.levelMeterSparkClock = interval;
          var sparkColor = celebrating && Math.random() > .5 ? 0xffffff : heat;
          var spark = this.add.circle(tipX + rand(-5, 5), y + rand(-1, 5), rand(1, 3), sparkColor, .85).setDepth(45);
          this.tweens.add({
            targets: spark,
            x: spark.x + rand(-8, 8),
            y: spark.y - rand(8, 19),
            alpha: 0,
            scale: .15,
            duration: rand(280, 520),
            ease: 'Quad.easeOut',
            onComplete: function () { spark.destroy(); }
          });
        }
      }
    },
    _action: function () {
      initAudio();
      if (this.gameOverVisible) { this._restart(); return; }
      if (this.dead || this.pauseInput) return;
      if (!this.started) {
        this.started = true;
        if (this.startCard) { this.startCard.destroy(); this.startTitle.destroy(); this.startSub.destroy(); this.startCard = this.startTitle = this.startSub = null; }
      }
      var gravityMod = this.loadout.id === 'feather' || this.featherTimer > 0 || this.char.id === 'ufo' ? .92 : 1;
      this.velocity = this.diff.flap * (this.miniTimer > 0 ? .9 : 1) / Math.sqrt(gravityMod);
      sfx.flap(); this._burst(PLAYER_X - 18, this.playerY + 8, this.world.glow, 5, 110, 280);
    },
    update: function (time, delta) {
      if (this.dead) return;
      this._updateLevelMeter(time, delta);
      var dt = Math.min(delta, 34) / 1000;
      this.wingClock += delta;
      if (this.wingClock > 90) { this.wingClock = 0; this.wingPhase = (this.wingPhase + 1) % 3; this.player.setTexture('fuo-char-' + this.char.id + '-' + this.wingPhase); }

      if (this.started) {
        var gravityFactor = (this.loadout.id === 'feather' || this.featherTimer > 0 || this.char.id === 'ufo') ? .92 : 1;
        this.velocity += this.diff.gravity * gravityFactor * dt;
        this.playerY += this.velocity * dt;
      } else {
        this.playerY = GAME_H * .43 + Math.sin(time * .004) * 6;
      }

      var miniActive = this.miniTimer > 0;
      this.playerScale = miniActive ? .68 : 1;
      var angle = clamp(this.velocity * .075, -28, 72);
      this.player.setPosition(PLAYER_X, this.playerY).setAngle(angle).setScale(this.playerScale);
      this.shieldRing.setPosition(PLAYER_X, this.playerY).setScale(this.playerScale).setAlpha(this.shields > 0 ? .6 + Math.sin(time * .016) * .25 : 0);

      if (this.started) {
        var speedFactor = this.slowTimer > 0 ? .56 : 1;
        var move = this.speed * speedFactor * dt;
        this.distance += move;
        var gateSpacing = this._currentGateSpacing();
        if (this.distance >= gateSpacing) { this.distance -= gateSpacing; this._spawnGate(); }
        this._moveBackground(move);
        this._moveGates(move, time);
        this._moveCollectibles(move, delta);
        this.speed = Math.min(this.speedCap, this.speed + this.diff.ramp * dt);
      }
      this._tickEffects(delta);
      this._updateEffectHud();
      if (this._checkCollision()) this._takeHit();
    },
    _moveBackground: function (move) {
      // Procedural layers are static graphics; subtle camera scroll illusion comes from particles and ground streaks.
      this.ground.x = 0;
    },
    _tickEffects: function (delta) {
      if (this.phaseTimer > 0) this.phaseTimer -= delta;
      if (this.slowTimer > 0) this.slowTimer -= delta;
      if (this.doubleTimer > 0) this.doubleTimer -= delta;
      if (this.magnetTimer > 0) this.magnetTimer -= delta;
      if (this.featherTimer > 0) this.featherTimer -= delta;
      if (this.rescueCooldown > 0) this.rescueCooldown -= delta;
      if (this.miniTimer > 0 && this.miniTimer < 900000) this.miniTimer -= delta;
      if (this.loadout.id === 'mini' && this.score >= 12 && this.miniTimer > 900000) this.miniTimer = 0;
    },
    _updateEffectHud: function () {
      var tags = [];
      if (this.shields > 0) tags.push('◆ SHIELD');
      if (this.phaseTimer > 0) tags.push('◌ PHASE');
      if (this.slowTimer > 0) tags.push('◷ SLOW');
      if (this.doubleTimer > 0) tags.push('×2 SCORE');
      if (this.magnetTimer > 0 || this.loadout.id === 'magnet') tags.push('✦ MAGNET');
      if (this.featherTimer > 0 || this.loadout.id === 'feather') tags.push('⌁ LIGHT');
      if (this.reviveReady) tags.push('♨ REVIVE');
      var text = tags.join('   ');
      if (text !== this.effectHudText) {
        this.effectHudText = text;
        this.effectHud.setText(text);
      }
    },
    _currentGateSpacing: function () {
      return Math.max(this.spawnEvery, this.speed * this.minGateInterval);
    },
    _spawnGate: function () {
      var levelPressure = Math.min(34, (this.runLevel - 1) * 3);
      var gap = Math.max(90, this.diff.gap - levelPressure);
      if (this.mode.id === 'classic') gap = this.diff.gap;
      if (this.mode.id === 'chaos') gap = Math.max(84, gap - rand(0, 12));

      var minCenter = 100 + gap / 2;
      var maxCenter = GAME_H - GROUND_H - 76 - gap / 2;
      var moving = (this.mode.id === 'chaos' && this.gatesSpawned > 1) || (this.runLevel >= 4 && Math.random() < .22);
      var gateSpacing = this._currentGateSpacing();
      var gateInterval = gateSpacing / Math.max(1, this.speed);

      // The safe route is based on both available flight time and opening size.
      // This keeps the path lively at low levels while preventing ceiling-to-floor
      // jumps once the game becomes fast and the gaps become tight.
      var routeLimit = clamp(
        gateInterval * Math.abs(this.diff.flap) * .28,
        32,
        Math.min(82, gap * .46)
      );
      // Nightmare's stronger flap impulse needs a steadier route through its
      // narrow late-game openings; speed and motion still provide the challenge.
      if (this.diff.id === 'expert') routeLimit = Math.min(routeLimit, 50);
      if (this.diff.id === 'nightmare') routeLimit = Math.min(routeLimit, 32);
      var maxAmplitude = Math.floor(Math.min(30, gap * .22, routeLimit * .55));
      var amplitude = moving && maxAmplitude >= 10 ? rand(10, maxAmplitude) : 0;
      if (amplitude === 0) moving = false;

      var spawnX = GAME_W + GATE_W / 2 + 12;
      // Motion follows horizontal travel rather than wall-clock time. Slow-Mo can
      // therefore never alter where the opening will be when it reaches the bird.
      var phase = this.routeWavePhase + this.gatesSpawned * .52;
      var passageTravel = spawnX - PLAYER_X;
      var passageOffset = moving ? Math.sin(passageTravel * .006 + phase) * amplitude : 0;

      // Keep the full oscillation inside the safe vertical play region.
      var baseMin = minCenter + amplitude;
      var baseMax = maxCenter - amplitude;
      if (baseMin > baseMax) {
        amplitude = 0; moving = false; passageOffset = 0;
        baseMin = minCenter; baseMax = maxCenter;
      }

      // Choose the actual opening center at the moment it crosses the player.
      // Consecutive route centers can never differ by more than routeLimit.
      var routeMin = baseMin + passageOffset;
      var routeMax = baseMax + passageOffset;
      var routeLow = Math.max(routeMin, this.lastGateRouteCenter - routeLimit);
      var routeHigh = Math.min(routeMax, this.lastGateRouteCenter + routeLimit);

      if (routeLow > routeHigh && amplitude > 0) {
        amplitude = 0; moving = false; passageOffset = 0;
        baseMin = minCenter; baseMax = maxCenter;
        routeMin = baseMin; routeMax = baseMax;
        routeLow = Math.max(routeMin, this.lastGateRouteCenter - routeLimit);
        routeHigh = Math.min(routeMax, this.lastGateRouteCenter + routeLimit);
      }

      var routeCenter;
      if (this.gatesSpawned === 0) {
        var firstLow = Math.max(routeMin, this.playerY - Math.min(68, routeLimit));
        var firstHigh = Math.min(routeMax, this.playerY + Math.min(68, routeLimit));
        var firstMinInt = Math.ceil(firstLow), firstMaxInt = Math.floor(firstHigh);
        routeCenter = firstMinInt <= firstMaxInt ? rand(firstMinInt, firstMaxInt) : clamp(this.playerY, routeMin, routeMax);
      } else {
        var routeMinInt = Math.ceil(routeLow), routeMaxInt = Math.floor(routeHigh);
        routeCenter = routeMinInt <= routeMaxInt ? rand(routeMinInt, routeMaxInt) : clamp(this.lastGateRouteCenter, routeMin, routeMax);
      }

      var center = routeCenter - passageOffset;
      var top = center - gap / 2, bottom = center + gap / 2;
      var danger = this.mode.id === 'chaos' && Math.random() < .18;
      var g = this.add.graphics().setDepth(12);
      drawGate(g, this.world, top, top, bottom, GAME_H - GROUND_H, danger);
      g.x = spawnX;
      var gate = {
        gfx: g, x: g.x, spawnX: spawnX, center: center, baseCenter: center,
        routeCenter: routeCenter, gap: gap, scored: false, moving: moving,
        amp: amplitude, phase: phase, danger: danger, world: this.world
      };
      this.gates.push(gate); this.gatesSpawned++;
      this.lastGateRouteCenter = routeCenter;

      // Rewards between gates
      if (this.gatesSpawned % 2 === 0 && this.mode.id !== 'classic') this._spawnCoinLine(g.x + gateSpacing * .48, routeCenter, rand(2, 4));
      if (this.gatesSpawned >= this.nextPickup && this.mode.id !== 'classic') {
        this.nextPickup += this.loadout.id === 'lucky' ? rand(4, 6) : rand(6, 9);
        this._spawnPickup(g.x + gateSpacing * .58, routeCenter);
      }
    },
    _spawnCoinLine: function (x, y, count) {
      for (var i = 0; i < count; i++) {
        var img = this.add.image(x + i * 28, y + Math.sin(i * 1.4) * 18, i === count - 1 && Math.random() > .7 ? 'fuo-star' : 'fuo-coin').setScale(.72).setDepth(17);
        this.collectibles.push({ img: img, x: img.x, y: img.y, kind: img.texture.key === 'fuo-star' ? 'star' : 'coin', bob: Math.random() * 5 });
      }
    },
    _spawnPickup: function (x, y) {
      var pool = PICKUPS.slice();
      if (this.char.id === 'ghost') pool.push(PICKUPS.find(function (p) { return p.id === 'phase'; }));
      if (this.reviveReady) pool = pool.filter(function (p) { return p.id !== 'revive'; });
      var p = choose(pool);
      var img = this.add.image(x, y, 'fuo-pick-' + p.id).setDepth(18).setScale(.9);
      var label = this.add.text(x, y, p.icon, { fontFamily: 'Inter, system-ui', fontSize: p.icon.length > 1 ? '10px' : '15px', fontStyle: 'bold', color: '#ffffff' }).setOrigin(.5).setDepth(19);
      this.tweens.add({ targets: [img, label], scaleX: 1.02, scaleY: 1.02, duration: 520, yoyo: true, repeat: -1 });
      this.pickups.push({ pickup: p, img: img, label: label, x: x, y: y, bob: Math.random() * 6 });
    },
    _moveGates: function (move, time) {
      for (var i = this.gates.length - 1; i >= 0; i--) {
        var gate = this.gates[i]; gate.x -= move; gate.gfx.x = gate.x;
        if (gate.moving) {
          var offset = Math.sin((gate.spawnX - gate.x) * .006 + gate.phase) * gate.amp;
          gate.center = gate.baseCenter + offset; gate.gfx.y = offset;
        }
        if (!gate.scored && gate.x + GATE_W / 2 < PLAYER_X) { gate.scored = true; this._scoreGate(gate); }
        if (gate.x < -GATE_W - 30) { gate.gfx.destroy(); this.gates.splice(i, 1); }
      }
    },
    _moveCollectibles: function (move, delta) {
      var magnet = this.loadout.id === 'magnet' || this.magnetTimer > 0;
      for (var i = this.collectibles.length - 1; i >= 0; i--) {
        var c = this.collectibles[i]; c.x -= move; c.bob += delta * .003;
        var cy = c.y + Math.sin(c.bob) * 5;
        var dx = PLAYER_X - c.x, dy = this.playerY - cy;
        if (magnet && Math.sqrt(dx * dx + dy * dy) < 125) { c.x += dx * .055; c.y += dy * .055; }
        c.img.setPosition(c.x, cy).setAngle(c.img.angle + delta * .06);
        if (Math.abs(dx) < 29 && Math.abs(dy) < 26) { this._collectReward(c); this.collectibles.splice(i, 1); continue; }
        if (c.x < -30) { c.img.destroy(); this.collectibles.splice(i, 1); }
      }
      for (var j = this.pickups.length - 1; j >= 0; j--) {
        var p = this.pickups[j]; p.x -= move; p.bob += delta * .003; var py = p.y + Math.sin(p.bob) * 8;
        p.img.setPosition(p.x, py); p.label.setPosition(p.x, py);
        if (Math.abs(PLAYER_X - p.x) < 31 && Math.abs(this.playerY - py) < 30) { this._collectPickup(p); this.pickups.splice(j, 1); continue; }
        if (p.x < -35) { p.img.destroy(); p.label.destroy(); this.pickups.splice(j, 1); }
      }
    },
    _collectReward: function (item) {
      var amount = item.kind === 'star' ? 3 : 1;
      if (this.char.id === 'ember') amount = Math.ceil(amount * 1.05);
      this.runCoins += amount; if (item.kind === 'star') this.runStars++;
      this.coinHud.setText('◆ ' + this.runCoins); sfx.coin();
      this._burst(item.x, item.y, item.kind === 'star' ? 0x67e8f9 : 0xfacc15, 8, 80, 300); item.img.destroy();
    },
    _collectPickup: function (orb) {
      var p = orb.pickup; sfx.power(); this._burst(orb.x, orb.y, p.color, 13, 100, 420);
      orb.img.destroy(); orb.label.destroy();
      if (p.id === 'shield') this.shields++;
      else if (p.id === 'slow') this.slowTimer = this.char.id === 'frost' ? 8200 : p.duration;
      else if (p.id === 'mini') this.miniTimer = p.duration;
      else if (p.id === 'double') this.doubleTimer = p.duration;
      else if (p.id === 'phase') this.phaseTimer = p.duration;
      else if (p.id === 'magnet') this.magnetTimer = p.duration;
      else if (p.id === 'feather') this.featherTimer = p.duration;
      else if (p.id === 'pulse') this._pulseBlast();
      else if (p.id === 'jackpot') { this.runCoins += 15; this.coinHud.setText('◆ ' + this.runCoins); }
      else if (p.id === 'revive') this.reviveReady = true;
      this._announce('POWER-UP', p.name.toUpperCase(), this._pickupDetail(p), p.color, p.icon || '✦', 'pickup-' + p.id);
    },
    _pulseBlast: function () {
      var beam = this.add.rectangle(GAME_W / 2, this.playerY, GAME_W, 10, 0xef4444, .9).setDepth(30);
      this.tweens.add({ targets: beam, scaleY: 4, alpha: 0, duration: 380, onComplete: function () { beam.destroy(); } });
      var removed = 0;
      for (var i = this.gates.length - 1; i >= 0 && removed < 2; i--) {
        if (this.gates[i].x > PLAYER_X) { this._burst(this.gates[i].x, this.gates[i].center, 0xef4444, 18, 160, 520); this.gates[i].gfx.destroy(); this.gates.splice(i, 1); removed++; this.score += this.doubleTimer > 0 ? 2 : 1; }
      }
      this.scoreHud.setText(String(this.score));
      this._syncRunLevel();
      this.cameras.main.shake(180, .006);
    },
    _scoreGate: function (gate) {
      var mult = this.doubleTimer > 0 ? 2 : 1;
      this.score += mult; this.scoreHud.setText(String(this.score));
      this.tweens.add({ targets: this.scoreHud, scaleX: 1.35, scaleY: 1.35, duration: 80, yoyo: true });
      var dist = Math.abs(this.playerY - gate.center), edge = gate.gap / 2 - (PLAYER_H * this.playerScale) / 2;
      if (dist < 16) {
        this.perfects++; this.combo++; this.bestCombo = Math.max(this.bestCombo, this.combo);
        var bonus = this.char.id === 'chroma' ? 4 : 2;
        if (this.loadout.id === 'bounty') bonus = Math.ceil(bonus * 1.25);
        this.runCoins += bonus; this.coinHud.setText('◆ ' + this.runCoins); sfx.perfect();
        this._floatingText(PLAYER_X + 52, this.playerY - 35, 'PERFECT ×' + this.combo + '  +' + bonus + '◆', '#fde047', 11);
        this._burst(PLAYER_X + 10, this.playerY, this.world.glow, 10, 90, 360);
      } else if (edge - dist < 12) {
        this.nearMisses++; this.combo = 0; this.runCoins += 1; this.coinHud.setText('◆ ' + this.runCoins); sfx.perfect();
        this._floatingText(PLAYER_X + 48, this.playerY - 32, 'NEAR MISS  +1◆', '#fb7185', 10);
      } else { this.combo = 0; sfx.point(); }

      if (this.score >= this.nextChest && this.mode.id !== 'classic') {
        this.nextChest += 10; this._rewardChest();
      }
      this._syncRunLevel();
    },
    _syncRunLevel: function () {
      var nextLevel = Math.floor(this.score / this.levelSpan) + 1;
      if (nextLevel > this.runLevel) this._levelUp(nextLevel);
    },
    _rewardChest: function () {
      var reward = 10 + this.runLevel * 2; this.runCoins += reward; this.coinHud.setText('◆ ' + this.runCoins); sfx.chest();
      this._announce('MILESTONE CACHE', '+' + reward + '◆', 'Reward secured', 0x67e8f9, '◆', 'cache-' + this.nextChest);
      this.cameras.main.flash(160, 34, 211, 238, false);
      if (Math.random() > .55) this.shields++;
    },
    _levelUp: function (level) {
      this.runLevel = level; sfx.level();
      if (this.mode.id !== 'classic') {
        var unlockedWorlds = WORLDS.filter(function (w) { return profile.level >= w.unlock; });
        var currentInUnlocked = unlockedWorlds.findIndex(function (w) { return w.id === this.world.id; }, this);
        this.world = unlockedWorlds[(currentInUnlocked + 1) % unlockedWorlds.length];
        this._changeWorld(this.world);
      }
      this.levelMeterHold = 430; this.levelMeterWasHolding = true; this.levelMeterUrgent = false;
      this.speed = Math.min(this.speedCap, this.speed + (this.mode.id === 'chaos' ? 18 : 10));
      this.spawnEvery = Math.max(156, this.spawnEvery - 4);
      this._levelBanner();
    },
    _changeWorld: function (world) {
      var old = this.bg;
      this.bg = createWorldLayers(this, world, 0);
      old.items.forEach(function (o) { if (o && o.destroy) o.destroy(); });
      this.worldHud.setText(world.name.toUpperCase()).setColor(hex(world.accent)); this._drawGround();
      this.worldTint.setFillStyle(world.glow, .18).setAlpha(.6);
      this.tweens.add({ targets: this.worldTint, alpha: 0, duration: 650 });
    },
    _pickupDetail: function (p) {
      if (p.id === 'shield') return 'One impact protected';
      if (p.id === 'slow') return 'Time slowed briefly';
      if (p.id === 'mini') return 'Smaller collision profile';
      if (p.id === 'double') return 'Double gate score';
      if (p.id === 'phase') return 'Temporary collision phase';
      if (p.id === 'magnet') return 'Nearby rewards attracted';
      if (p.id === 'feather') return 'Lighter flight physics';
      if (p.id === 'pulse') return 'Forward gates cleared';
      if (p.id === 'jackpot') return 'Bonus coins collected';
      if (p.id === 'revive') return 'One recovery armed';
      return 'Perk activated';
    },
    _announce: function (eyebrow, title, detail, accent, icon, key) {
      key = key || (eyebrow + '-' + title);
      if (this.announcementActive && this.announcementKey === key) return;
      for (var i = 0; i < this.announcementQueue.length; i++) {
        if (this.announcementQueue[i].key === key) return;
      }
      // Keep the system informative without allowing a long backlog after a
      // burst of rewards. Critical progress and rescue messages are retained
      // ahead of ordinary pickup notifications.
      var entry = { eyebrow: eyebrow, title: title, detail: detail, accent: accent, icon: icon, key: key };
      var priority = /LEVEL|FINAL|RESCUE|REVIVE/.test(eyebrow);
      if (priority) this.announcementQueue.unshift(entry); else this.announcementQueue.push(entry);
      if (this.announcementQueue.length > 3) this.announcementQueue.pop();
      this._showNextAnnouncement();
    },
    _showNextAnnouncement: function () {
      if (this.announcementActive || !this.announcementQueue.length || this.dead) return;
      var self = this;
      var item = this.announcementQueue.shift();
      this.announcementActive = true; this.announcementKey = item.key;

      // The announcement lives in the lowest safe visual zone: a wide, shallow
      // glass dock just above the ground. Entering from below avoids sweeping over
      // the bird or an approaching passage, and the low-opacity surface leaves the
      // scenery and lower obstacle silhouette visible behind it.
      var cardW = 326, cardH = 56;
      var targetX = GAME_W / 2, targetY = GAME_H - GROUND_H - cardH / 2 - 8;
      var card = this.add.container(targetX, targetY + cardH + 24).setDepth(57).setAlpha(0);
      this.announcementCard = card;
      var shadow = this.add.graphics();
      shadow.fillStyle(0x020617, .16); shadow.fillRoundedRect(-cardW / 2 + 2, -cardH / 2 + 4, cardW, cardH, 17);
      var bg = this.add.graphics();
      bg.fillStyle(0x020617, .56); bg.fillRoundedRect(-cardW / 2, -cardH / 2, cardW, cardH, 17);
      bg.lineStyle(1, item.accent, .38); bg.strokeRoundedRect(-cardW / 2, -cardH / 2, cardW, cardH, 17);
      bg.fillStyle(item.accent, .9); bg.fillRoundedRect(-cardW / 2 + 13, -cardH / 2 + 5, cardW - 26, 3, 2);
      bg.fillStyle(item.accent, .12); bg.fillCircle(-132, 2, 18);
      bg.lineStyle(1, item.accent, .3); bg.strokeCircle(-132, 2, 18);

      var iconText = this.add.text(-132, 2, item.icon || '✦', {
        fontFamily: 'Inter, system-ui', fontSize: '15px', fontStyle: 'bold', color: hex(item.accent)
      }).setOrigin(.5);
      var eyebrowText = this.add.text(-103, -15, item.eyebrow, {
        fontFamily: 'Inter, system-ui', fontSize: '7px', fontStyle: 'bold', letterSpacing: 1.25, color: hex(item.accent),
        align: 'left', wordWrap: { width: 214, useAdvancedWrap: true }
      }).setOrigin(0, .5);
      var titleText = this.add.text(-103, 1, item.title, {
        fontFamily: 'Inter, system-ui', fontSize: '11px', fontStyle: 'bold', color: '#ffffff', align: 'left',
        wordWrap: { width: 214, useAdvancedWrap: true }
      }).setOrigin(0, .5);
      var detailText = this.add.text(-103, 18, item.detail || '', {
        fontFamily: 'Inter, system-ui', fontSize: '7px', color: '#cbd5e1', align: 'left',
        wordWrap: { width: 214, useAdvancedWrap: true }
      }).setOrigin(0, .5);
      card.add([shadow, bg, iconText, eyebrowText, titleText, detailText]);

      this.tweens.add({
        targets: card, y: targetY, alpha: .96, duration: 190, ease: 'Cubic.easeOut',
        onComplete: function () {
          self.tweens.add({
            targets: card, y: targetY + 10, alpha: 0, delay: 980, duration: 240, ease: 'Cubic.easeIn',
            onComplete: function () {
              card.destroy(true); self.announcementCard = null; self.announcementActive = false; self.announcementKey = '';
              self._showNextAnnouncement();
            }
          });
        }
      });
    },
    _levelBanner: function () {
      var cleared = Math.max(1, this.runLevel - 1);
      this._announce('LEVEL ' + cleared + ' CLEARED', 'LEVEL ' + this.runLevel, this.world.name.toUpperCase(), this.world.glow, '✦', 'level-' + this.runLevel);
    },
    _floatingText: function (x, y, text, color, size) {
      var t = this.add.text(x, y, text, { fontFamily: 'Inter, system-ui', fontSize: (size || 11) + 'px', fontStyle: 'bold', color: color, stroke: '#020617', strokeThickness: 3 }).setOrigin(.5).setDepth(50);
      this.tweens.add({ targets: t, y: y - 35, alpha: 0, duration: 820, onComplete: function () { t.destroy(); } });
    },
    _burst: function (x, y, color, count, spread, duration) {
      for (var i = 0; i < count; i++) {
        var p = this.add.circle(x, y, rand(2, 5), color, Math.random() * .6 + .35).setDepth(34);
        var ang = Math.random() * Math.PI * 2, dist = Math.random() * spread + spread * .2;
        this.tweens.add({ targets: p, x: x + Math.cos(ang) * dist, y: y + Math.sin(ang) * dist, alpha: 0, scale: .1, duration: rand(duration * .65, duration), ease: 'Quad.easeOut', onComplete: function () { p.destroy(); } });
      }
    },
    _checkCollision: function () {
      if (!this.started || this.phaseTimer > 0 || this.rescueCooldown > 0) return false;
      var hw = (this.char.id === 'mecha' ? PLAYER_W * .43 : PLAYER_W * .48) * this.playerScale;
      var hh = PLAYER_H * .43 * this.playerScale;
      if (this.playerY - hh <= 0 || this.playerY + hh >= GAME_H - GROUND_H) return true;
      for (var i = 0; i < this.gates.length; i++) {
        var g = this.gates[i];
        if (PLAYER_X + hw > g.x - GATE_W / 2 && PLAYER_X - hw < g.x + GATE_W / 2) {
          if (this.playerY - hh < g.center - g.gap / 2 || this.playerY + hh > g.center + g.gap / 2) return true;
        }
      }
      return false;
    },
    _takeHit: function () {
      if (this.shields > 0) {
        this.shields--; this.rescueCooldown = 850; this.velocity = -240; sfx.hit(); this.cameras.main.flash(180, 96, 165, 250, false); this.cameras.main.shake(130, .008); this._announce('RESCUE', 'SHIELD SAVED YOU', 'Keep flying', 0x93c5fd, '🛡', 'shield-save'); return;
      }
      if (this.reviveReady) {
        this.reviveReady = false; this.rescueCooldown = 1500; this.playerY = GAME_H * .42; this.velocity = -260; this.phaseTimer = 2400;
        for (var i = this.gates.length - 1; i >= 0; i--) { if (Math.abs(this.gates[i].x - PLAYER_X) < 150) { this.gates[i].gfx.destroy(); this.gates.splice(i, 1); } }
        sfx.level(); this.cameras.main.flash(360, 251, 113, 133, false); this._burst(PLAYER_X, this.playerY, 0xfb7185, 24, 150, 600); this._announce('REVIVE', 'PHOENIX RETURN', 'Phase protection active', 0xfb7185, '🔥', 'phoenix-revive'); return;
      }
      this._die();
    },
    _die: function () {
      if (this.dead) return;
      this.dead = true;
      this.announcementQueue.length = 0;
      if (this.announcementCard) { this.tweens.killTweensOf(this.announcementCard); this.announcementCard.destroy(true); this.announcementCard = null; }
      this.announcementActive = false; this.announcementKey = '';
      sfx.die(); this.cameras.main.shake(320, .016); this.cameras.main.flash(210, 239, 68, 68, false);
      this._burst(PLAYER_X, this.playerY, this.char.main, 20, 130, 520); this.player.setAlpha(0); this.shieldRing.setAlpha(0);
      var summary = this._commitRun();
      this.time.delayedCall(520, function () { this._showGameOver(summary); }, null, this);
    },
    _commitRun: function () {
      var oldLevel = profile.level; var oldBest = profile.best || 0;
      var key = this.diff.id + '_' + this.mode.id + '_' + this.char.id;
      profile.best = Math.max(profile.best || 0, this.score);
      profile.bests[key] = Math.max(profile.bests[key] || 0, this.score);
      profile.games = (profile.games || 0) + 1;
      profile.totalGates = (profile.totalGates || 0) + this.score;
      profile.totalCoins = (profile.totalCoins || 0) + this.runCoins;
      profile.totalPerfects = (profile.totalPerfects || 0) + this.perfects;
      var coinReward = Math.floor(this.score * .35 * this.diff.reward) + this.runCoins;
      if (this.char.id === 'ember') coinReward = Math.ceil(coinReward * 1.05);
      var xpReward = Math.floor((this.score * 7 + this.perfects * 5 + this.nearMisses * 2) * this.diff.reward);
      if (this.char.id === 'royal') xpReward = Math.ceil(xpReward * 1.1);
      profile.coins += coinReward; profile.xp += xpReward;
      var leveled = 0;
      while (profile.xp >= xpForNext(profile.level)) { profile.xp -= xpForNext(profile.level); profile.level++; leveled++; }
      var q = questFor(profile), questReward = 0;
      if (q.current >= q.target) { questReward = q.reward; profile.coins += questReward; profile.questTier = (profile.questTier || 0) + 1; }
      saveProfile(storage, profile);
      return { oldBest: oldBest, newBest: this.score > oldBest, coinReward: coinReward, xpReward: xpReward, leveled: leveled, oldLevel: oldLevel, questReward: questReward };
    },
    _rankForScore: function () {
      if (this.score >= 75) return { name: 'MYTHIC', color: 0xe879f9, icon: '✦' };
      if (this.score >= 45) return { name: 'DIAMOND', color: 0x67e8f9, icon: '◆' };
      if (this.score >= 25) return { name: 'GOLD', color: 0xfacc15, icon: '★' };
      if (this.score >= 12) return { name: 'SILVER', color: 0xcbd5e1, icon: '●' };
      return { name: 'BRONZE', color: 0xfb923c, icon: '●' };
    },
    _showGameOver: function (summary) {
      var self = this; this.gameOverVisible = true; this.pauseInput = true;
      this.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, 0x020617, .78).setDepth(70);
      roundedPanel(this, GAME_W / 2, GAME_H / 2, 382, 510, 0x07111f, .98, 0xffffff, .14, 26).setDepth(71);
      var rank = this._rankForScore();
      this.add.circle(GAME_W / 2, 124, 44, rank.color, .13).setDepth(72);
      this.add.circle(GAME_W / 2, 124, 31, rank.color, .26).setDepth(72);
      this.add.text(GAME_W / 2, 115, rank.icon, { fontFamily: 'Inter, system-ui', fontSize: '28px', fontStyle: 'bold', color: hex(rank.color) }).setOrigin(.5).setDepth(73);
      this.add.text(GAME_W / 2, 151, rank.name + ' FLIGHT', { fontFamily: 'Inter, system-ui', fontSize: '10px', fontStyle: 'bold', letterSpacing: 2, color: hex(rank.color) }).setOrigin(.5).setDepth(73);
      this.add.text(GAME_W / 2, 181, summary.newBest ? 'NEW PERSONAL BEST' : 'FLIGHT COMPLETE', { fontFamily: 'Inter, system-ui', fontSize: '22px', fontStyle: 'bold', color: summary.newBest ? '#4ade80' : '#ffffff' }).setOrigin(.5).setDepth(73);

      // Score cards
      roundedPanel(this, 137, 239, 142, 82, 0x0f172a, .9, 0xffffff, .08, 16).setDepth(72);
      roundedPanel(this, 323, 239, 142, 82, 0x0f172a, .9, 0xffffff, .08, 16).setDepth(72);
      this.add.text(137, 218, 'SCORE', { fontFamily: 'Inter, system-ui', fontSize: '9px', fontStyle: 'bold', letterSpacing: 2, color: '#64748b' }).setOrigin(.5).setDepth(73);
      this.add.text(137, 250, String(this.score), { fontFamily: 'Inter, system-ui', fontSize: '34px', fontStyle: 'bold', color: '#fde047' }).setOrigin(.5).setDepth(73);
      this.add.text(323, 218, 'BEST', { fontFamily: 'Inter, system-ui', fontSize: '9px', fontStyle: 'bold', letterSpacing: 2, color: '#64748b' }).setOrigin(.5).setDepth(73);
      this.add.text(323, 250, String(profile.best), { fontFamily: 'Inter, system-ui', fontSize: '34px', fontStyle: 'bold', color: summary.newBest ? '#4ade80' : '#38bdf8' }).setOrigin(.5).setDepth(73);

      // Stats matrix
      var stats = [
        ['PERFECT GATES', String(this.perfects), '#fde047'],
        ['BEST COMBO', '×' + this.bestCombo, '#f472b6'],
        ['COINS EARNED', '+' + summary.coinReward + '◆', '#facc15'],
        ['XP EARNED', '+' + summary.xpReward, '#67e8f9']
      ];
      stats.forEach(function (st, i) {
        var x = i % 2 === 0 ? 132 : 328, y = 314 + Math.floor(i / 2) * 58;
        self.add.text(x, y - 10, st[0], { fontFamily: 'Inter, system-ui', fontSize: '8px', fontStyle: 'bold', letterSpacing: 1, color: '#64748b' }).setOrigin(.5).setDepth(73);
        self.add.text(x, y + 12, st[1], { fontFamily: 'Inter, system-ui', fontSize: '16px', fontStyle: 'bold', color: st[2] }).setOrigin(.5).setDepth(73);
      });

      // Progress card
      roundedPanel(this, GAME_W / 2, 432, 328, 68, 0x0f172a, .9, summary.leveled ? 0x4ade80 : 0x38bdf8, .28, 16).setDepth(72);
      var levelText = summary.leveled ? 'LEVEL UP!  ' + summary.oldLevel + ' → ' + profile.level : 'PLAYER LEVEL ' + profile.level;
      this.add.text(68, 416, levelText, { fontFamily: 'Inter, system-ui', fontSize: '10px', fontStyle: 'bold', color: summary.leveled ? '#4ade80' : '#e2e8f0' }).setDepth(73);
      var ratio = clamp(profile.xp / xpForNext(profile.level), 0, 1), pg = this.add.graphics().setDepth(73); pg.fillStyle(0xffffff, .08); pg.fillRoundedRect(68, 440, 324, 8, 4); pg.fillStyle(summary.leveled ? 0x4ade80 : 0x38bdf8, .92); pg.fillRoundedRect(68, 440, 324 * ratio, 8, 4);
      this.add.text(392, 455, profile.xp + ' / ' + xpForNext(profile.level) + ' XP', { fontFamily: 'Inter, system-ui', fontSize: '8px', color: '#94a3b8' }).setOrigin(1, .5).setDepth(73);
      if (summary.questReward > 0) this.add.text(GAME_W / 2, 477, 'CONTRACT COMPLETE  +' + summary.questReward + '◆', { fontFamily: 'Inter, system-ui', fontSize: '9px', fontStyle: 'bold', color: '#fde047' }).setOrigin(.5).setDepth(73);

      var again = makeButton(this, 148, 533, 182, 50, 'FLY AGAIN', { fill: 0x22c55e, hover: 0x4ade80, textColor: '#052e16', fontSize: 15, radius: 16, onClick: function () { self._restart(); } }); again.container.setDepth(74);
      var menu = makeButton(this, 337, 533, 132, 50, 'MENU', { fill: 0x1e293b, hover: 0x334155, stroke: 0x64748b, textColor: '#e2e8f0', fontSize: 13, radius: 16, onClick: function () { self.scene.start('Menu'); } }); menu.container.setDepth(74);
      this.add.text(GAME_W / 2, 579, 'PRESS SPACE TO FLY AGAIN', { fontFamily: 'Inter, system-ui', fontSize: '9px', fontStyle: 'bold', letterSpacing: 1, color: '#67e8f9' }).setOrigin(.5).setDepth(74);
      this.add.text(GAME_W / 2, 607, this.world.name + '  •  ' + this.diff.name + '  •  ' + this.loadout.name, { fontFamily: 'Inter, system-ui', fontSize: '9px', color: '#64748b' }).setOrigin(.5).setDepth(74);
      this.pauseInput = false;
    },
    _restart: function () {
      if (!this.gameOverVisible) return;
      this.gameOverVisible = false; sfx.select();
      this.cameras.main.fadeOut(160, 0, 0, 0);
      var self = this;
      this.time.delayedCall(170, function () { self.scene.restart({ charId: self.char.id, worldId: self.startWorld.id, diffId: self.diff.id, modeId: self.mode.id, loadoutId: self.loadout.id }); });
    }
  });
}

function createGame(parent, storage, profile, runtimeModule, display) {
  var P = runtimeModule.Phaser;
  return runtimeModule.createGame({
    type: P.AUTO,
    width: GAME_W,
    height: GAME_H,
    parent: parent,
    backgroundColor: '#020617',
    transparent: false,
    scene: [createBootScene(P), createMenuScene(P, storage, profile, display), createGameScene(P, storage, profile)],
    render: { antialias: true, pixelArt: false, roundPixels: false },
    scale: {
      // Preserve the complete portrait playfield when the host enters
      // fullscreen. Fill-and-crop scaling hides one axis, which
      // can hide menu controls and gameplay HUD on landscape displays.
      mode: P.Scale.FIT,
      autoCenter: P.Scale.CENTER_BOTH,
      width: GAME_W,
      height: GAME_H
    },
    input: { keyboard: true, activePointers: 2 },
    audio: { noAudio: true }
  });
}

export default function activate(host) {
  if (!host.runtime) throw new Error('Riftwing requires tend.host Runtime API 1.');
  ensureStyle();
  var profile = defaultProfile();
  var ready = host.storage.get(STORAGE_KEY).then(function (raw) {
    if (typeof raw === 'string') {
      try { profile = mergeProfile(JSON.parse(raw)); } catch (e) { profile = defaultProfile(); }
    } else if (raw && typeof raw === 'object') profile = mergeProfile(raw);
    var today = todayKey();
    if (profile.lastDaily !== today) {
      profile.lastDaily = today; profile.pendingDaily = 25; profile.coins += 25;
      return saveProfile(host.storage, profile);
    }
  }).catch(function () {});

  var game = null;
  var gameRoot = null;
  var focusGameInput = null;
  var syncFullscreenFocus = null;
  var unlockChrome = function () {};
  var loaderTimer = null;
  var loaderDelay = null;

  return {
    mount: async function (container) {
      container.innerHTML = '';
      container.style.cssText = 'position:relative;width:100%;height:100%;min-width:0;min-height:0;overflow:hidden;background:#020617;padding:0;margin:0;';
      unlockChrome = lockWindowChrome(container);
      var root = document.createElement('div'); root.className = 'fuo-root'; root.tabIndex = -1; container.appendChild(root);
      gameRoot = root;
      focusGameInput = function () { try { root.focus({ preventScroll: true }); } catch (e) {} };
      syncFullscreenFocus = function () {
        if (document.fullscreenElement && document.fullscreenElement.contains(root)) focusGameInput();
      };
      root.addEventListener('pointerdown', focusGameInput, true);
      document.addEventListener('fullscreenchange', syncFullscreenFocus);
      var loader = document.createElement('div'); loader.className = 'fuo-loader';
      loader.innerHTML = '<div class="fuo-loader-card"><div class="fuo-loader-mark">TEND STACK ARCADE</div><div class="fuo-loader-title">Riftwing</div><div class="fuo-loader-sub">Opening the Skybound rifts…</div><div class="fuo-loader-track"><div class="fuo-loader-fill"></div></div></div>';
      root.appendChild(loader);
      var fill = loader.querySelector('.fuo-loader-fill'), progress = 0;
      loaderTimer = host.runtime.timers.setInterval(function () { progress = Math.min(90, progress + rand(4, 10)); if (fill) fill.style.width = progress + '%'; }, 90);
      try {
        var results = await Promise.all([ready, host.runtime.require('phaser@4')]);
        var runtimeModule = results[1];
        if (loaderTimer) { host.runtime.timers.clearInterval(loaderTimer); loaderTimer = null; }
        if (fill) fill.style.width = '100%';
        loaderDelay = host.runtime.timers.setTimeout(function () {
          loaderDelay = null;
          if (!root.isConnected) return;
          loader.remove();
          game = createGame(root, host.storage, profile, runtimeModule, host.runtime.display);
        }, 180);
      } catch (error) {
        if (loaderTimer) { host.runtime.timers.clearInterval(loaderTimer); loaderTimer = null; }
        loader.innerHTML = '<div class="fuo-loader-card"><div class="fuo-loader-error"><strong>Riftwing could not start.</strong><br>Update tend.host and verify Runtime API 1.</div></div>';
        console.error('Riftwing: Skybound failed to load', error);
      }
    },
    unmount: function () {
      if (loaderTimer) { host.runtime.timers.clearInterval(loaderTimer); loaderTimer = null; }
      if (loaderDelay) { host.runtime.timers.clearTimeout(loaderDelay); loaderDelay = null; }
      // Runtime API 1 owns Phaser teardown; dropping our reference prevents a
      // second destroy while still making remount state explicit.
      game = null;
      if (gameRoot && focusGameInput) gameRoot.removeEventListener('pointerdown', focusGameInput, true);
      if (syncFullscreenFocus) document.removeEventListener('fullscreenchange', syncFullscreenFocus);
      gameRoot = null; focusGameInput = null; syncFullscreenFocus = null;
      unlockChrome(); unlockChrome = function () {};
      if (audioCtx) { audioCtx.close().catch(function () {}); audioCtx = null; }
    }
  };
}
