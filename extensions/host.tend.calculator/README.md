# Calculator extension (schema 2)

A seven-mode calculator for tend.host and the reference implementation
for v2 native ESM extensions — runs in-process, no iframe, no bundler,
no dependencies, real host API for storage and theme.

## Build & install

From the repo root:

```bash
python3 extensions/extensions/build.py extensions/extensions/calculator
```

This computes SHA-256 integrity hashes for **every** JS file in the
package (including the files under `engine/`, `converters/`, `modes/`
and `ui/`), rewrites the manifest's `integrity` map, and emits
`calculator.zip` next to the source folder. Never hand-edit the
`integrity` map — the installer recomputes and compares it, and a
stale hash fails the install.

To ship it as a bundled default, copy the ZIP over
`backend/app/default_extensions/host.tend.calculator.zip` and update the
version pin in `backend/tests/test_extensions.py`. To install it by
hand: **Settings → Extensions → Upload an extension**, pick
`calculator.zip`.

## Modes

The mode switcher sits at the top of the window; the active mode
persists via `host.storage`. Every mode is laid out for the fixed
460 × 700 panel the manifest declares — nothing resizes the window and
nothing goes full screen.

| Mode | What it does |
| --- | --- |
| **Standard** (default) | The familiar keypad — chaining, repeat `=`, CE/C/⌫/±/%, `1/x`, `x²`, `√x`, memory `MS/M+/M−/MR/MC` — now driven by the expression engine, so the top line shows `5 + 3 × 2` and the live result sits underneath. |
| **Scientific** | Trigonometry and inverses, hyperbolics, `ln`/`log`/`log₂`/`exp`, `xʸ`/`x²`/`x³`/`10ˣ`/`eˣ`, roots, factorial, `\|x\|`, `mod`, π, e, parentheses, a Deg/Rad/Grad toggle, a 2nd-function shift, `Ans` and memory. |
| **Graphing** | One or more expressions in `x` (comma, semicolon or newline separated) plotted on a devicePixelRatio-aware canvas with drag-to-pan, wheel/pinch/±-button zoom, labelled grid, hover trace, fit-y and reset-view. |
| **Programmer** | Simultaneous HEX/DEC/OCT/BIN readouts, 8/16/32/64-bit words (BigInt throughout, exact at 64 bits), a two's complement toggle, AND/OR/XOR/NOT/NAND/NOR, logical and arithmetic shifts, rotates, and a bit-toggle grid for the current word. |
| **Statistics** | Paste or type a dataset and get n, sum, mean, median, mode, min/max, range, quartiles, IQR, and both sample and population variance and standard deviation; a second box takes `x y` pairs and fits a line with slope, intercept, r and r². |
| **Financial** | Loan/mortgage payment with a scrollable amortization schedule, simple and compound interest with contributions, tip split, ROI, CAGR and percent change. Every result block is copyable. |
| **Converters** | Offline tables for length, mass, temperature, area, volume, speed, data, time and energy, plus a currency converter backed by an editable rate table. |

### About the currency rates

The panel's CSP forbids third-party origins and the extension host API
exposes no HTTP, so there is no live rate and the extension does not
attempt one. What ships is a dated seed table you own: paste
`CODE=rate` lines or a two-column CSV to replace or extend it, set the
"as of" date yourself, and export the table back out in the same
format. Every readout states the date and whether the numbers are the
built-in seed or your own. **Rates are user-supplied, not live.**

## History tape

Every committed calculation (mode, expression, result, timestamp) lands
on the tape, which slides in over the keypad inside the same window.
Entries are capped at 500 and persist via `host.storage`. Click an
expression or a result to load it back into the active mode, copy a
single line, clear everything, or export the tape as text or CSV (a
same-origin Blob and an `<a download>` — no server round trip).

## Keyboard

| Keys | Action |
| --- | --- |
| digits, `.`, `+ - * /`, `( )`, `^`, `%`, `!`, letters | Typed straight into the expression |
| `Enter` / `=` | Evaluate and commit to the tape |
| `Escape` | Clear all (or close the tape when it is open) |
| `Delete` | Clear the trailing entry |
| `Backspace` | Delete the last character |
| `F9` | Negate |
| `Ctrl/⌘ + C` | Copy the current result |
| `Ctrl/⌘ + H` | Toggle the history tape |
| `Ctrl/⌘ + 1…7` | Switch mode |
| arrow keys | Move between keypad buttons |

Every button is focusable with a visible focus ring and an
`aria-label`; the display region is `aria-live="polite"`.

## How it works

- `extension.json` declares schema 2, names the JS entry as
  `ui.module`, pins `ui.size` and `ui.maxSize` to the one panel size
  every mode is designed for, and carries `permissions: ["storage"]`
  because the calculator persists preferences, memory, the tape and the
  rate table. It declares nothing else — `host.notify` is not used.
- `index.js` exports a default `activate(host)` that the panel calls
  after dynamic-importing the module. It returns `{ mount, unmount }`;
  the shell calls `mount(container)` with a real DOM element and
  `unmount()` on route change.
- Modes are created lazily, so opening the calculator builds one
  keypad rather than seven.
- Storage writes are coalesced behind a short timer and the small
  preferences live in one key, so switching mode does not cost a
  network round trip per keystroke.

## Files

```
extension.json        manifest, schema 2
index.js              activate(host): shell, mode switching, keyboard
store.js              write-behind cache over host.storage
engine/tokenize.js    scanner + glyph normalisation + list splitting
engine/parser.js      Pratt parser -> AST (precedence, implicit ×, calls)
engine/evaluate.js    AST evaluator, angle modes, gamma/factorial
engine/format.js      display formatting and digit grouping
engine/programmer.js  BigInt fixed-width integer maths
engine/statistics.js  descriptive statistics and linear regression
engine/finance.js     loans, interest, tips, ROI, CAGR
converters/units.js   offline unit tables
converters/currency.js user-owned rate table
ui/styles.js          the one scoped stylesheet
ui/dom.js             element, keypad, segmented and field helpers
ui/clipboard.js       copy with fallback, Blob downloads, CSV escaping
ui/history.js         the history tape
modes/*.js            one module per mode
icon.svg              square home-grid icon
```

## Tests

The pure-logic modules are covered by `bun:test` in the frontend
package, importing the shipped files directly so the tests cannot drift
from what the panel loads:

```bash
cd frontend && bun test tests/calculator-*.test.ts
```
