/* Clipboard helper. navigator.clipboard needs a secure context and a
 * user gesture; both hold in the panel, but a hardened browser can still
 * refuse, so there is a selected-textarea fallback.
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
    // Fall through to the manual path.
  }
  const field = el('textarea', { attrs: { readonly: true, 'aria-hidden': 'true', tabindex: '-1', style: 'position:fixed;left:-9999px;top:0' } });
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

/** A small "Copy" button that reads its text lazily and confirms in place. */
export function copyButton(getText, label = 'Copy') {
  let timer = null;
  const node = el('button', {
    class: 'dt-btn is-small',
    text: label,
    attrs: { type: 'button', 'aria-label': `${label} to clipboard` },
    on: {
      async click() {
        const ok = await copyText(getText());
        node.textContent = ok ? 'Copied' : getText() ? 'Copy refused' : 'Nothing to copy';
        if (timer !== null) clearTimeout(timer);
        timer = setTimeout(() => { node.textContent = label; timer = null; }, 1400);
      },
    },
  });
  return node;
}
