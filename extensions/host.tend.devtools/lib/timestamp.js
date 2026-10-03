/* Unix timestamp conversion and relative-time wording. Pure. */

const MAX_MS = 8.64e15;

/** Seconds below 1e11 (year 5138), milliseconds above it (after 1973). */
export const AUTO_THRESHOLD = 1e11;

export function relativeTime(deltaSeconds) {
  const abs = Math.abs(deltaSeconds);
  if (abs < 1) return 'now';
  const units = [
    ['year', 31557600],
    ['month', 2629800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
    ['second', 1],
  ];
  for (const [name, size] of units) {
    if (abs >= size) {
      const n = Math.floor(abs / size);
      const label = `${n} ${name}${n === 1 ? '' : 's'}`;
      return deltaSeconds > 0 ? `in ${label}` : `${label} ago`;
    }
  }
  return 'now';
}

/** Parse a number (seconds or milliseconds) or a date string.
 *  `unit` is 'auto', 's' or 'ms' and applies to numeric input only. */
export function parseTimestampInput(text, unit = 'auto') {
  const raw = String(text ?? '').trim();
  if (!raw) return { ok: false, error: 'Enter a unix time or a date' };
  let ms;
  let interpretedAs;
  if (/^[+-]?\d+(\.\d+)?$/.test(raw)) {
    const n = Number(raw);
    const asMs = unit === 'ms' || (unit !== 's' && Math.abs(n) >= AUTO_THRESHOLD);
    ms = Math.round(asMs ? n : n * 1000);
    interpretedAs = asMs ? 'milliseconds' : 'seconds';
  } else {
    ms = Date.parse(raw);
    interpretedAs = 'date';
    if (Number.isNaN(ms)) {
      return { ok: false, error: 'Not a unix time or a date this tool understands (ISO 8601 such as 2026-10-03T12:00:00Z always works)' };
    }
  }
  if (!Number.isFinite(ms) || Math.abs(ms) > MAX_MS) {
    return { ok: false, error: 'That moment is outside the range of dates JavaScript can represent' };
  }
  return { ok: true, ms, interpretedAs };
}

function pad(n, width = 2) {
  return String(Math.abs(n)).padStart(width, '0');
}

/** ISO 8601 with an explicit offset, e.g. 2026-10-03T08:00:00.000-04:00. */
export function isoWithOffset(ms, offsetMinutes) {
  const shifted = new Date(ms + offsetMinutes * 60000);
  const sign = offsetMinutes < 0 ? '-' : '+';
  const abs = Math.abs(offsetMinutes);
  return `${shifted.getUTCFullYear()}`.padStart(4, '0')
    + `-${pad(shifted.getUTCMonth() + 1)}-${pad(shifted.getUTCDate())}`
    + `T${pad(shifted.getUTCHours())}:${pad(shifted.getUTCMinutes())}:${pad(shifted.getUTCSeconds())}`
    + `.${pad(shifted.getUTCMilliseconds(), 3)}${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`;
}

/** Every representation of one instant. `offsetMinutes` is the local
 *  offset east of UTC (defaults to the browser's). */
export function describeInstant(ms, options = {}) {
  const date = new Date(ms);
  const offsetMinutes = options.offsetMinutes ?? -date.getTimezoneOffset();
  const nowMs = options.nowMs ?? Date.now();
  return {
    seconds: Math.floor(ms / 1000),
    milliseconds: ms,
    iso: date.toISOString(),
    utc: date.toUTCString(),
    localIso: isoWithOffset(ms, offsetMinutes),
    local: options.formatLocal ? options.formatLocal(date) : date.toString(),
    relative: relativeTime((ms - nowMs) / 1000),
  };
}
