/* Regular expression runner with a safety net.
 *
 * A JavaScript regex cannot be interrupted once it is running, so this
 * cannot promise to stop every pathological pattern. It layers cheap
 * defences instead:
 *   1. input is capped at 20 000 characters;
 *   2. a pattern with nested unbounded quantifiers, the classic
 *      (a+)+ shape, is "suspect" and is first probed on short inputs of
 *      growing length: exponential growth shows up as a slow step long
 *      before it can freeze the page;
 *   3. matching checks the clock between matches against a 50 ms budget;
 *   4. a run that finishes but exceeded the budget is reported as too
 *      slow and its results are dropped.
 * A pattern with a hidden overlap such as (a|aa)+$ can still slip past
 * step 2; step 4 reports it afterwards.
 *
 * Pure: the clock is injectable so the budget is testable.
 */

export const MAX_INPUT_CHARS = 20000;
export const BUDGET_MS = 50;
export const MAX_MATCHES = 1000;
const PROBE_LENGTHS = [8, 10, 12, 14, 16, 18, 20, 22, 24];
const PROBE_STEP_MS = 8;
const VALID_FLAGS = 'dgimsuvy';

function skipClass(pattern, from) {
  let i = from + 1;
  while (i < pattern.length && pattern[i] !== ']') i += pattern[i] === '\\' ? 2 : 1;
  return i;
}

/** The quantifier starting at `i`: is it unbounded (* + {n,})? Returns
 *  { unbounded, length } or null when `i` is not a quantifier. */
function quantifierAt(pattern, i) {
  const ch = pattern[i];
  if (ch === '*' || ch === '+') return { unbounded: true };
  if (ch === '?') return { unbounded: false };
  if (ch === '{') {
    const m = /^\{(\d+)(,(\d*))?\}/.exec(pattern.slice(i));
    if (!m) return null;
    return { unbounded: m[2] !== undefined && m[3] === '' };
  }
  return null;
}

/** True when the pattern repeats a group that itself contains an
 *  unbounded repeat, such as (a+)+ or (\w+\s?)*. */
export function hasNestedQuantifier(pattern) {
  const stack = [];
  let unboundedHere = false;
  for (let i = 0; i < pattern.length; i += 1) {
    const ch = pattern[i];
    if (ch === '\\') { i += 1; continue; }
    if (ch === '[') { i = skipClass(pattern, i); continue; }
    if (ch === '(') {
      stack.push(unboundedHere);
      unboundedHere = false;
      continue;
    }
    if (ch === ')') {
      const inner = unboundedHere;
      unboundedHere = stack.length ? stack.pop() : false;
      const q = quantifierAt(pattern, i + 1);
      if (q?.unbounded) {
        if (inner) return true;
        unboundedHere = true;
      } else if (inner) {
        unboundedHere = true;
      }
      continue;
    }
    if (ch === '*' || ch === '+') unboundedHere = true;
    else if (ch === '{') {
      const q = quantifierAt(pattern, i);
      if (q?.unbounded) unboundedHere = true;
    }
  }
  return false;
}

/** Names of the capturing groups in order; `null` for unnamed ones.
 *  Index 0 of the result is group 1. */
export function capturingGroups(pattern) {
  const groups = [];
  for (let i = 0; i < pattern.length; i += 1) {
    const ch = pattern[i];
    if (ch === '\\') { i += 1; continue; }
    if (ch === '[') { i = skipClass(pattern, i); continue; }
    if (ch !== '(') continue;
    if (pattern[i + 1] !== '?') { groups.push(null); continue; }
    const named = /^\(\?<([A-Za-z_$][\w$]*)>/.exec(pattern.slice(i));
    if (named) groups.push(named[1]);
  }
  return groups;
}

function buildRegExp(pattern, flags) {
  let clean = '';
  for (const f of flags) if (VALID_FLAGS.includes(f) && !clean.includes(f)) clean += f;
  if (!clean.includes('g')) clean += 'g';
  if (clean.includes('y')) clean = clean.replace('y', '');
  try {
    return new RegExp(pattern, clean.includes('d') ? clean : `${clean}d`);
  } catch (error) {
    // Engines without the `d` flag reject it; a bad pattern fails again here.
    return new RegExp(pattern, clean);
  }
}

function probe(re, text, now) {
  const first = [...text.trim()][0] ?? 'a';
  for (const n of PROBE_LENGTHS) {
    for (const sample of [text.slice(0, n), first.repeat(n)]) {
      re.lastIndex = 0;
      const start = now();
      re.test(`${sample}\u0000`);
      if (now() - start > PROBE_STEP_MS) return false;
    }
  }
  return true;
}

function spanOf(m, index) {
  const span = m.indices?.[index];
  if (span) return { start: span[0], end: span[1] };
  if (index === 0) return { start: m.index, end: m.index + m[0].length };
  return null;
}

/** Run `pattern` with `flags` over `text`.
 *  Returns { ok: true, matches, truncated } or
 *  { ok: false, reason: 'error' | 'too-long' | 'too-slow', message }.
 *  Each match is { index, end, text, groups: [{ number, name, text, start, end }] }. */
export function runRegex(pattern, flags, text, options = {}) {
  const now = options.now ?? (() => performance.now());
  const budget = options.budgetMs ?? BUDGET_MS;
  const maxChars = options.maxChars ?? MAX_INPUT_CHARS;
  const maxMatches = options.maxMatches ?? MAX_MATCHES;
  const subject = String(text ?? '');
  if (subject.length > maxChars) {
    return { ok: false, reason: 'too-long', message: `The test text is over ${maxChars.toLocaleString('en-US')} characters (${subject.length.toLocaleString('en-US')}); shorten it to test live` };
  }
  if (!pattern) return { ok: true, matches: [], truncated: false };
  let re;
  try {
    re = buildRegExp(pattern, flags);
  } catch (error) {
    return { ok: false, reason: 'error', message: String(error.message).replace(/^Invalid regular expression: /, '') };
  }
  if (hasNestedQuantifier(pattern) && !probe(re, subject, now)) {
    return { ok: false, reason: 'too-slow', message: 'Too slow: nested repeats such as (a+)+ can take exponential time on this text. Rewrite the pattern to avoid them' };
  }
  const names = capturingGroups(pattern);
  const matches = [];
  let truncated = false;
  const start = now();
  re.lastIndex = 0;
  for (;;) {
    const m = re.exec(subject);
    if (!m) break;
    const groups = [];
    for (let g = 1; g < m.length; g += 1) {
      const span = spanOf(m, g);
      groups.push({
        number: g,
        name: names[g - 1] ?? null,
        text: m[g] ?? null,
        start: span ? span.start : null,
        end: span ? span.end : null,
      });
    }
    matches.push({ index: m.index, end: m.index + m[0].length, text: m[0], groups });
    if (m[0] === '') re.lastIndex += 1;
    if (matches.length >= maxMatches) { truncated = true; break; }
    if (re.lastIndex > subject.length) break;
    if (now() - start > budget) {
      return { ok: false, reason: 'too-slow', message: `Too slow: matching passed the ${budget} ms budget` };
    }
  }
  if (now() - start > budget) {
    return { ok: false, reason: 'too-slow', message: `Too slow: matching passed the ${budget} ms budget` };
  }
  return { ok: true, matches, truncated };
}

/** Split `text` into display segments. Each is
 *  { text, match: index or -1, group: group number or 0 } where `group`
 *  is the innermost capture group covering the segment. Empty matches
 *  have nothing to paint and are skipped. */
export function buildSegments(text, matches) {
  const spans = [];
  matches.forEach((m, matchIndex) => {
    if (m.end > m.index) spans.push({ start: m.index, end: m.end, match: matchIndex, group: 0 });
    for (const g of m.groups) {
      if (g.start !== null && g.end > g.start) spans.push({ start: g.start, end: g.end, match: matchIndex, group: g.number });
    }
  });
  spans.sort((x, y) => x.start - y.start);
  const points = new Set([0, text.length]);
  for (const sp of spans) { points.add(sp.start); points.add(sp.end); }
  const sorted = [...points].filter((p) => p >= 0 && p <= text.length).sort((x, y) => x - y);
  const segments = [];
  let active = [];
  let next = 0;
  for (let i = 0; i < sorted.length - 1; i += 1) {
    const from = sorted[i];
    const to = sorted[i + 1];
    while (next < spans.length && spans[next].start <= from) { active.push(spans[next]); next += 1; }
    active = active.filter((sp) => sp.end > from);
    let best = null;
    for (const sp of active) {
      // Innermost wins: the narrowest span, a group over its match.
      const width = sp.end - sp.start;
      if (!best || width < best.end - best.start || (width === best.end - best.start && sp.group > best.group)) best = sp;
    }
    segments.push({ text: text.slice(from, to), match: best ? best.match : -1, group: best ? best.group : 0 });
  }
  return segments;
}
