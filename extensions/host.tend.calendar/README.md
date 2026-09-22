# Calendar extension (schema 2)

A modern month, week, day and agenda calendar for tend.host, built to
be the panel's default calendar — native ESM, no bundler, no iframe,
no external network. Events live locally through `host.storage`.

## Views

- **Month** (default): a 7-column grid, today highlighted with a ring,
  adjacent-month days dimmed, up to 3 event chips per day plus a
  "+N more" overflow that opens the day.
- **Week** / **Day**: an all-day row plus a scrollable 24-hour grid
  with a live "now" line and side-by-side layout for overlapping
  events.
- **Agenda**: a scrolling list of upcoming events grouped by day,
  starting from the header's current date.

The header's Today / previous / next / title (click to jump to any
month and year) and the view switcher work the same way in every view;
"New event" opens the editor prefilled for whatever the active view
considers a sensible default (an all-day event on the visible day for
Month/Agenda, a 9am hour for Week/Day).

## Creating and editing events

- **Month**: click an empty day to create an all-day event there;
  click a chip to edit it.
- **Week / Day**: click a time slot for a default one-hour event, or
  drag to set the exact range; click a block to edit it.
- **Agenda**: click an item to edit it.

The editor covers title, all-day toggle, start/end date and time, one
of six preset colours, location, notes, and a simple recurrence
(none / daily / weekly / monthly — no end date; recurring events edit
as a whole series). Delete removes the event (and, for a recurring
one, the whole series).

## Keyboard

| Keys | Action |
| --- | --- |
| Arrow keys | Move the focused day (Month grid) or day column (Week/Day header) |
| `Enter` | Open the focused day in Day view |
| `T` | Jump to today |
| `N` | New event |
| `1` `2` `3` `4` | Switch to Month / Week / Day / Agenda |
| `Escape` | Close the open dialog |

Shortcuts are ignored while a text field has focus or a dialog is
open; a dialog itself traps Tab and closes on Escape or a click
outside it.

## Settings

A gear button opens a settings sheet: default view, week start
(from your locale, or forced Monday/Sunday), 12/24-hour clock (from
your locale, or forced), and a "show week numbers" toggle for the
month grid. An **Integrations** section lists what's planned
(Google Calendar, iCal subscriptions, panel-generated events) as
clearly labelled, inert placeholders — no live wiring yet.

## Storage keys

| Key | Shape |
| --- | --- |
| `events.v1` | array of normalized event objects (see `model.js`) |
| `prefs.v1` | `{ defaultView, weekStart, clock, showWeekNumbers }` |

## How integrations will plug in

Every event already carries a `source` field (`'local'` today). A
future integration adds events with a different `source` — the views,
the editor's read-only affordances for non-local events, and the
storage schema are designed so that lands without a migration.

## Files

```
extension.json        manifest, schema 2
index.js              activate(host): header, view switching, keyboard, dialogs
store.js              write-behind cache over host.storage
date-utils.js          Intl-only date/locale helpers (no hard-coded names)
model.js               event shape, colours, recurrence expansion
ui/dom.js               element helper + the modal dialog/focus-trap
ui/styles.js            the one scoped stylesheet (panel theme tokens)
ui/event-editor.js      create/edit event dialog
ui/month-year-picker.js the header title's jump-to-month dialog
ui/settings-sheet.js    preferences + the Integrations placeholder
views/month.js          month grid
views/time-grid.js      shared hour-grid renderer behind week/day
views/week.js           7-day time grid
views/day.js            1-day time grid
views/agenda.js         upcoming list grouped by day
icon.svg               rounded-square gradient icon
```
