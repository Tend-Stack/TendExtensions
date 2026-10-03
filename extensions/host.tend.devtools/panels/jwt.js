import { SIGNATURE_NOTICE, decodeJwt } from '../lib/jwt.js';
import { debounce, el, textarea } from '../ui/dom.js';
import { outputBox, panelShell, statusLine, valueRow } from '../ui/parts.js';

const STATUS_KIND = { expired: 'error', 'not-yet-valid': 'error', 'within-window': 'ok', 'no-expiry': 'info' };

export function createJwtPanel(ctx) {
  const input = textarea({ rows: 6, placeholder: 'eyJhbGciOi...', label: 'JWT input' });
  const header = outputBox('Header');
  const payload = outputBox('Payload');
  const status = statusLine();
  const claims = el('div', { class: 'dt-col' });
  const signature = el('div', { class: 'dt-hint' });
  const results = el('div', { class: 'dt-grid' }, [
    el('div', { class: 'dt-col' }, [header.element, claims]),
    el('div', { class: 'dt-col' }, [payload.element, signature]),
  ]);
  results.hidden = true;

  function update() {
    claims.replaceChildren();
    signature.textContent = '';
    if (!input.value.trim()) { status.clear(); results.hidden = true; return; }
    const r = decodeJwt(input.value);
    if (!r.ok) { status.set(r.error, 'error'); results.hidden = true; return; }
    results.hidden = false;
    header.set(r.headerText);
    payload.set(r.payloadText);
    status.set(r.statusText, STATUS_KIND[r.status]);
    if (r.claims.length) {
      claims.appendChild(el('div', { class: 'dt-block-head' }, [el('span', { class: 'dt-label', text: 'Time claims' })]));
      for (const c of r.claims) {
        claims.appendChild(valueRow(
          `${c.label} (${c.name})`,
          c.valid ? `${c.iso} | ${c.relative}` : c.text,
        ));
        if (c.valid) claims.appendChild(valueRow('Local time', c.localIso));
      }
    }
    signature.textContent = r.hasSignature
      ? `Signature present (${r.signature.length} characters), not checked.${r.algorithm ? ` Declared algorithm: ${r.algorithm}.` : ''}`
      : 'No signature part (an unsigned token).';
  }
  const live = debounce(update, 80);
  input.addEventListener('input', () => live());

  const element = panelShell('jwt', 'JWT', [
    el('div', { class: 'dt-banner', text: SIGNATURE_NOTICE, attrs: { role: 'note' } }),
    el('div', { class: 'dt-col' }, [
      el('div', { class: 'dt-block-head' }, [el('span', { class: 'dt-label', text: 'Token' })]),
      input,
      status.element,
    ]),
    results,
  ]);

  return {
    id: 'jwt',
    title: 'JWT',
    element,
    focus: () => input.focus(),
    // Tokens are credentials: never written to storage.
    getState: () => ({}),
    setState() {},
    /** Re-evaluate expiry against the current time when the tab is shown. */
    activate: update,
    destroy: () => live.cancel(),
  };
}
