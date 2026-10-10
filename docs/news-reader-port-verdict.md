# News reader extension: port or scratch? (verdict, 2026-10-10)

Paths: OC = `OndaCast/_OndaCast/OndaCast`, P = `tend.host/local/int-installer-v0111`, M = `tend.host/local/src-tend-media`.
Feasibility only. This is not a build plan. Anything marked *guess* was not checked in code.

## Invariants the design must hold
- Extensions run inside the panel page with no iframe and share the session (P `docs/how-to/extension-network.md` §8). Article HTML in the DOM can therefore attack the panel itself.
- No extension names an arbitrary outbound URL without consent, the SSRF policy (`outbound_policy.go`) and an audit row.
- A user's subscriptions and read state are theirs. `host.storage` is keyed per extension, not per user (`SetExtensionStorage(extID,key,value)`; M `src/host.ts` says "keys carry the user id"), so other users' code paths can read them.
- Refresh cost scales with the number of distinct feeds, not with users × feeds × open tabs.

## 1. Verdict: port the client, rebuild the engine
| Layer | Reuse | Why |
|---|---|---|
| UI components (10 files, 2768 lines) | ~55 % | Reader, ArticleList, ProvidersRail, AddFeedDialog, ImportExportMenu and NewsMobile are Svelte 5, the same version M builds with. Drop MiniPlayer and the chassis ties. Remove the fake likes/dislikes/followers (OC `Reader.svelte:564`, `data/news.ts:21,72`). |
| `news.css` (1683 lines, global) | ~20 % | 303 lines carry hard-coded colours, and the only `var(--` used is `--led-amber` (31 uses). The layout grid and typography survive. The palette moves to panel tokens (`--color-base-100`, `--color-base-content`, as calendar `ui/styles.js:18` does), scoped per component with `css:'injected'`. |
| Store `news.svelte.ts` (893 lines) | ~40 % | The read/saved/later/history/folders model and the runes structure survive. The 21 localStorage call sites, the article cache and the seed-vs-proxy facade are replaced by the server API. |
| OPML `opml.ts` | ~90 % | It is pure, uses the browser DOMParser and runs client-side. Only the types and the import target change. |
| ID hash (FNV-1a, `news-convert.ts:14`) | algorithm only | IDs must be minted server-side so they match across devices. It is about 10 lines of Go. |
| Parser `parser.ts` (fast-xml-parser) | 0 % code, kept as spec | Rewritten in Go. Its RSS/Atom field mapping becomes test fixtures. It has no JSON Feed support today. |
| Readability `reader-extract.ts` | 0 % code, kept as spec | The paywall phrase list is reusable. Its regex `scrubHtml` (line 70) is NOT acceptable for in-page `{@html}` (`Reader.svelte:520`). An allow-list sanitizer is required. |
| Seed providers (54 `feedUrl`s, 9 categories) | ~30 % | Reused as an optional "suggested feeds" list. Every URL needs re-checking, and the social fields go. |

Overall: roughly 35 % of OC's code carries over. Building from scratch would throw away the hardest part to get right, the reading UX, so this is a partial port.

## 2. The engine (the crux): option (a), a panel-side `feeds` capability
Facts that rule out (d) client-only and (b) extending `network.fetch`:
- The rate limit is 10 calls per minute per session across all extensions, and it is fixed (`extensions_network.go:67`, doc §6). Refreshing 50 feeds takes at least 5 minutes and starves every other extension.
- The daily quota defaults to 200 per user per extension, and it is spent before the request. That allows 4 refreshes a day of 50 feeds, before any article is opened.
- Consent is per (extension, user, host). 50 hosts mean 50 prompts, and an OPML import becomes a prompt storm.
- The allowed types are text/calendar, application/json, text/plain, text/xml and application/xml (`:86-94`). `application/rss+xml`, `application/atom+xml` and `text/html` (needed for readability and feed discovery) all fail with `not_allowed_type`.
- Nothing refreshes while the window is closed, there is no unread count for a widget, and there is no multi-device state.

Widening `network.fetch` (b) would turn a narrow text fetch into a general HTML proxy for every extension. That is the wrong blast radius. A companion container (c) adds a deploy unit, auth and a second SSRF boundary, and it is unavailable on SaaS tenants without app hosting (*guess*). Reusing the retired `news.ondacast.com` worker is a dead dependency and would leak subscriptions to a third party.

**(a) follows a precedent that already exists.** `extensions_ondacast.go` (1248 lines) is a typed panel capability behind a permission. It caches, normalises, and uses `outboundPolicy` (`outbound_policy.go:123,290`). The shelf preview already fetches and parses `text/html` panel-side (`shelf.go:78`), and the panel runs 11 background tickers. Shape:
- **Tables:** `feed_sources` (one row per normalised URL, shared across users, with ETag/Last-Modified, next_fetch_at and error backoff), `feed_items` (source_id, item_id, fields, pruned by age and count), `feed_subscriptions` (user_id, source_id, folder, limit) and `feed_item_state` (user_id, item_id, read/saved/later/reaction).
- **Scheduler:** one ticker refreshes distinct sources that are due, with a minimum interval of 15–30 min, conditional GET and an exponential backoff on error. It uses `outboundPolicy` with its own content-type allow-list for feeds plus `text/html` for discovery and extraction only.
- **Quotas:** count subscriptions per user (cap ~300), refresh-now (cooldown), and readability extractions per user per day. Calls are not counted.
- **Consent:** the subscribe call is the consent. The panel draws a confirm in its own chrome (the same queue as `network-consent`) naming the host or hosts. OPML import gets one confirm listing N hosts.
- **Code location:** Go. `encoding/xml` is a hand parser porting `parser.ts`; the alternative `mmcdole/gofeed` is a new dependency. Extraction uses `go-shiori/go-readability` plus `microcosm-cc/bluemonday` (both new deps; only `golang.org/x/net` is in go.mod). Sanitising happens server-side, so the client never receives unsafe HTML.
- **Image privacy:** remote `<img>` tags in articles leak the reader's IP to publishers. Either rewrite them to a panel image proxy or strip them to the feed thumbnail only (operator decision 3).
- **Host shim:** add `host.feeds.{subscriptions,subscribe,unsubscribe,items,article,state,refresh,importOpml}` in `ExtensionMount.svelte` next to `ondacast:` (line ~932). Add the `feeds` permission to `KNOWN_PERMISSIONS` (TendExtensions `tools/build.py:54`) and to the panel's manifest rules.

## 3. What must adapt
- **Build:** copy M's layout: a separate source repo with Svelte 5.57 + Vite 8 lib mode, `css:'injected'`, one entry per widget, output `index.js`, `chunks/` and `widgets/` (M `vite.config.ts`). The prebuilt bundle goes into `extensions/<id>/`. The media bundle is 386 KB. No extension bundle budget was found in `tools/build.py`, so set one, for example ≤250 KB.
- **Storage:** server tables replace localStorage for the core state. Use `host.storage` only for UI prefs (column widths, view mode). The handler has no per-value size cap (`extensions.go:640-664`), but values must not hold article caches.
- **Mount:** `shell-app` (like media, ~1080×720, minSize ~360×420). The 3-column layout collapses to OC's NewsMobile list → reader flow below ~768 px. OC's ticker-on-top panel layout goes.
- **Theme:** use the `host.theme` snapshot (`isDark`) and panel CSS tokens. Fallbacks may stay hex. The parity of the "newsprint" reader background is an operator choice.
- **i18n:** the host exposes no locale. Calendar and media use `navigator.language` + `Intl` only, and no extension ships catalogs (grep of calendar/media). Spanish therefore needs a small catalog inside the extension, or a new `host.locale` (decision 4).
- **Listen:** `host.mascot.exec(text)` makes Sprout say a string (`mascot-control.ts:59`). Whether that is suited to a 2,000-word article (chunking, stop, the TTS voice from "sprout: add local voice") is a *guess* and needs a probe. Keep `speechSynthesis` as the fallback.
- **Widgets:** "Headlines" (small/wide, unread count + top 3) and possibly "Saved for later", served from `host.feeds.items`. This only works because the state lives server-side.
- **Remove:** MiniPlayer, nowPlaying, chassis mode switching and the social counts. Podcast audio in feeds is handed off to TEND Media via `mediaSession` or dropped (decision 5).

## 4. Rough size (packages, by layer)
| # | Package | Agent | Effort |
|---|---|---|---|
| 1 | Plan: feeds capability contract + migration + threat model | architect | S |
| 2 | Go: tables/migration, scheduler, parser, discovery, quotas, endpoints, tests (`-race`) | builder | L (largest; ~1.5× ondacast.go) |
| 3 | Go: readability + bluemonday + image policy, tests with hostile fixtures | builder | M |
| 4 | Panel: `host.feeds` shim, subscribe confirm in chrome, `feeds` permission, Settings row | builder | S–M |
| 5 | Extension scaffold + store port onto `host.feeds` + OPML, bun tests | builder | M |
| 6 | UI port + CSS retokenise + mobile layout, Playwright on desktop-1440/mobile-390 | builder | L |
| 7 | Headlines widget(s) + previews | builder | S |
| 8 | Translations (if decision 4 = yes) | scribe | S |

**Risks:**
- XSS through extracted HTML into the panel origin. This is the top risk, and only package 3's sanitizer closes it.
- Shared-source refresh load on SaaS multi-tenant hosts (*guess*: per-tenant processes multiply fetches).
- Feed URL tokens in DB rows (do not log query strings, matching the `network` audit rule).
- The new Go dependencies' licences and maintenance.
- Packages 2 and 6 each risk passing 250 tool calls, so split them early.

## 5. Operator decisions
1. Engine: approve a panel-side `feeds` capability (a) and its new permission. The alternative is accepting a degraded client-only reader with a handful of feeds.
2. Scope: is background refresh needed while the panel is closed, and what is the minimum refresh interval (15 or 30 min)?
3. Images in articles: proxy through the panel (privacy, more server load), strip to the thumbnail only, or load directly (leaks IP)?
4. i18n: ship en/es inside the extension, or first add `host.locale` for all extensions?
5. Extras: keep "Listen" via Sprout, hand podcast enclosures to TEND Media, and ship the 54 suggested feeds? Each one is optional scope.
