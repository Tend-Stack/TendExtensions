# Developer Tools extension (schema 2)

Eight everyday developer tools in one tool window. Native ESM, no bundler,
no dependencies, no network. The only permission is `storage`, used to
remember the last tool and what you typed.

## Tools

| Tab | What it does |
|---|---|
| JSON | Format, minify and validate. Errors give line and column and a "Go to error" button; optional sorted keys; 2, 4 or tab indent. Numbers are kept exactly as typed. |
| Base64 | Encode and decode text as UTF-8, with a URL-safe variant. Decoding accepts either alphabet and missing padding. |
| URL | Encode or decode a component or a whole URL, and parse a URL into its parts and decoded query parameters. |
| JWT | Decodes the header and payload and shows `exp`, `iat` and `nbf` as dates with whether the token is expired. It never verifies a signature and says so on screen. |
| Hash | SHA-1, SHA-256, SHA-384 and SHA-512 of text, hex output, through `crypto.subtle`. |
| UUID | Version 4 UUIDs through `crypto.randomUUID`, 1 to 50 at a time. |
| Timestamp | Unix seconds or milliseconds to ISO, local and relative time, and back. "Now" fills the current time. |
| Regex | Pattern, flags and test text with live highlighting of matches and capture groups. |

Every output has a Copy button. Keyboard: arrow keys, Home and End move
between tabs, Alt+1 to Alt+8 jump to a tool, Ctrl+Enter formats JSON.
The layout follows the window width and works down to about 390 px.

## Privacy

Nothing leaves the page. JWTs and the text being hashed are credentials
and are never written to storage; everything else (inputs, options and
the last tool) is stored in the extension's own scope.

## The regex guard

A JavaScript regular expression cannot be interrupted once it starts, so
the tester layers defences instead of promising a timeout: test text is
capped at 20 000 characters; patterns that repeat a group containing an
unbounded repeat (the `(a+)+` shape) are first probed on short inputs of
growing length and refused with "Too slow" if the time grows; matching
checks a 50 ms budget between matches; and a run that finishes over budget
is reported as too slow and its results are dropped. A pattern with a
hidden overlap such as `(a|aa)+$` can still slip through the pre-check;
the budget catches it afterwards.

## Source layout

- `lib/` pure helpers with no DOM or host access (`json-tools`, `base64`,
  `url-tools`, `jwt`, `hash`, `uuid`, `timestamp`, `regex-guard`). Their
  tests live in `tests/js/host.tend.devtools/` at the repository root.
- `panels/` one module per tool.
- `ui/` DOM helpers, shared blocks, clipboard and the scoped stylesheet.
- `store.js` write-behind cache over `host.storage`.

Build from the repository root with `python tools/build.py`; the build
recomputes the manifest's `integrity` map, so never edit it by hand.
