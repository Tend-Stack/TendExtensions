const STORAGE_KEY = 'neon_cyber_man_profile_v1';

const DEFAULT_PROFILE = Object.freeze({
  version: 1,
  bestScore: 0,
  chips: 0,
  highestLevel: 1,
  upgrades: { speed: 0, emp: 0 },
  trailSkin: 'cyan',
  unlockedTrails: ['cyan'],
  achievements: {},
  totalRuns: 0,
  totalPellets: 0,
  totalGhostsEaten: 0
});

let context = {
  host: null,
  Phaser: null,
  phaserRuntime: null,
  profile: structuredClone(DEFAULT_PROFILE),
  selectedLevel: 1,
  runSummary: null
};

function sanitizeProfile(value) {
  const raw = value && typeof value === 'object' ? value : {};
  const upgrades = raw.upgrades && typeof raw.upgrades === 'object' ? raw.upgrades : {};
  return {
    ...structuredClone(DEFAULT_PROFILE),
    ...raw,
    upgrades: {
      speed: Math.max(0, Math.min(5, Number(upgrades.speed) || 0)),
      emp: Math.max(0, Math.min(5, Number(upgrades.emp) || 0))
    },
    unlockedTrails: Array.isArray(raw.unlockedTrails) && raw.unlockedTrails.length
      ? [...new Set(raw.unlockedTrails.filter((v) => typeof v === 'string'))]
      : ['cyan'],
    achievements: raw.achievements && typeof raw.achievements === 'object' ? { ...raw.achievements } : {}
  };
}

export async function loadProfile(storage) {
  try {
    const saved = await storage.get(STORAGE_KEY);
    context.profile = sanitizeProfile(saved);
  } catch {
    context.profile = structuredClone(DEFAULT_PROFILE);
  }
  return context.profile;
}

export async function saveProfile() {
  if (!context.host?.storage) return;
  context.profile = sanitizeProfile(context.profile);
  await context.host.storage.set(STORAGE_KEY, context.profile);
}

export function configureRuntime({ host, Phaser, phaserRuntime }) {
  context.host = host;
  context.Phaser = Phaser;
  context.phaserRuntime = phaserRuntime;
}

export function getContext() {
  return context;
}

export function mutateProfile(mutator) {
  const copy = sanitizeProfile(context.profile);
  mutator(copy);
  context.profile = sanitizeProfile(copy);
  return context.profile;
}

export function setSelectedLevel(level) {
  const max = Math.max(1, Math.min(3, context.profile.highestLevel || 1));
  context.selectedLevel = Math.max(1, Math.min(max, Number(level) || 1));
}

export function setRunSummary(summary) {
  context.runSummary = summary;
}
