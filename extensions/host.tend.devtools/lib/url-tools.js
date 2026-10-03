/* URL helpers: percent-encoding and a readable breakdown of a URL.
 * Pure; relies only on the standard URL and URLSearchParams classes.
 */

/** Encode as a URL component (everything but A-Z a-z 0-9 - _ . ! ~ * ' ( ) )
 *  or, with `full`, as a whole URI that keeps :/?#[]@ and friends. */
export function encodeUrlText(text, options = {}) {
  const value = String(text ?? '');
  try {
    return { ok: true, text: options.full ? encodeURI(value) : encodeURIComponent(value) };
  } catch (error) {
    return { ok: false, error: 'The text contains an unpaired surrogate and cannot be encoded' };
  }
}

export function decodeUrlText(text, options = {}) {
  const value = String(text ?? '');
  try {
    return { ok: true, text: options.full ? decodeURI(value) : decodeURIComponent(value) };
  } catch (error) {
    const bad = value.search(/%(?![0-9a-fA-F]{2})/);
    return {
      ok: false,
      error: bad !== -1
        ? `Invalid percent escape at position ${bad + 1}`
        : 'The escapes do not form valid UTF-8 text',
    };
  }
}

/** Break a URL into parts and decoded query parameters. A value without a
 *  scheme is tried again as https://, and `assumedScheme` says so. */
export function parseUrl(input) {
  const raw = String(input ?? '').trim();
  if (!raw) return { ok: false, error: 'Enter a URL to parse' };
  const hasScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw) || /^(mailto|tel|data|urn|blob|file|javascript|about):/i.test(raw);
  // "localhost:3000" would parse as scheme "localhost:", which is never
  // what was meant, so only a scheme with "//" (or a known opaque one)
  // is taken as written; anything else gets https:// in front.
  const assumedScheme = !hasScheme;
  let url;
  try {
    url = new URL(assumedScheme ? `https://${raw.replace(/^\/\//, '')}` : raw);
  } catch (error) {
    return { ok: false, error: 'This is not a valid URL' };
  }
  const params = [...url.searchParams.entries()].map(([key, value]) => ({ key, value }));
  return {
    ok: true,
    assumedScheme,
    parts: {
      href: url.href,
      origin: url.origin === 'null' ? '' : url.origin,
      protocol: url.protocol,
      username: url.username,
      password: url.password,
      host: url.host,
      hostname: url.hostname,
      port: url.port,
      pathname: url.pathname,
      search: url.search,
      hash: url.hash,
    },
    params,
  };
}
