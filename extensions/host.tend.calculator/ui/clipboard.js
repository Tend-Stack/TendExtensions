/* Clipboard and download helpers.
 *
 * `navigator.clipboard` needs a secure context and a user gesture; both
 * hold inside the panel, but a hardened browser can still refuse. The
 * fallback puts the text in a selected, read-only input the user can
 * copy by hand — a visible "here it is, press Ctrl+C" beats a silent
 * no-op.
 *
 * Downloads use a same-origin Blob URL, which the panel's CSP permits
 * (blob: is allowed) and which needs no server round trip.
 */
import { el } from './dom.js';

export async function copyText(text) {
  const value = String(text ?? '');
  if (!value) return false;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch (error) {
    // Fall through to the manual path below.
  }
  return copyBySelection(value);
}

/** Last resort: a temporary selected field plus the legacy copy
 *  command. Returns false when even that is refused, so the caller can
 *  tell the user to copy manually. */
function copyBySelection(value) {
  const field = el('textarea', {
    class: 'calc-copy-fallback',
    attrs: { readonly: true, 'aria-hidden': 'true', tabindex: '-1' },
  });
  field.value = value;
  document.body.appendChild(field);
  field.select();
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch (error) {
    ok = false;
  }
  field.remove();
  return ok;
}

/** Trigger a download of `text` as `filename`. */
export function downloadText(filename, text, mime = 'text/plain;charset=utf-8') {
  const blob = new Blob([String(text ?? '')], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = el('a', { attrs: { href: url, download: filename } });
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  // Revoke on the next tick; revoking synchronously races the download
  // in some browsers.
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/** CSV escaping that survives commas, quotes and newlines. */
export function csvCell(value) {
  const text = String(value ?? '');
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function csvRows(rows) {
  return rows.map((row) => row.map(csvCell).join(',')).join('\n');
}
