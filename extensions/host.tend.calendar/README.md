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
of six preset colours, location, notes, a simple recurrence
(none / daily / weekly / monthly — no end date; recurring events edit
as a whole series), and reminders (below). Delete removes the event
(and, for a recurring one, the whole series).

## Reminders (1.2.0)

The editor's **Reminders** field adds one or more reminders per event,
each a preset (at time of event, 5/15 minutes, 1/12 hours, 1/3 days
before) or a custom amount + unit, with Panel and Email channel
checkboxes (Panel on by default; Email is disabled with a "Set up
email in Settings → Notifications" hint until the panel reports an
SMTP adapter is configured). Reminders fire server-side through the
panel's `host.reminders` API — the panel, not the browser tab, has to
be reachable, not this window.

- **Non-recurring events** schedule their one reminder per configured
  entry.
- **Recurring events** schedule the next 8 occurrences within 90 days;
  the window refreshes when the calendar window opens and every hour
  it stays open, so a daily/weekly series keeps reminders scheduled
  further out without needing to reopen the window.
- Every scheduled reminder has a deterministic id (`<eventId>:<offset>`,
  or `<eventId>:<offset>:<occurrence>` for a recurring one) so
  `host.reminders.schedule()` upserts it in place instead of
  duplicating it on every save, and editing, deleting, or removing a
  reminder cancels exactly the ids that fell out.
- On startup the calendar reconciles against `host.reminders.list()`
  and cancels anything the host still has scheduled that no longer
  matches a local event or reminder (an orphan from an edit made while
  the window was closed, or from before an event was deleted).
- A reminder's notification opens the calendar itself — the same
  `#/shell/ext:host.tend.calendar` hash the panel's own shelf/dock use
  to open this extension's window.

Requires the `notifications` permission and a panel new enough to
expose `host.reminders`. On an older panel the field shows itself
disabled with "Reminders need panel update" instead of silently
dropping what you type — nothing about the rest of the calendar
depends on it.

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
month grid. An **Integrations** section lists what's still planned
(Google Calendar, iCal subscriptions, panel-generated events) as
clearly labelled, inert "coming soon" placeholders — no live network
wiring. A separate **Import & export** section (1.2.0) holds the
working, offline .ics file import/export described below — kept apart
from Integrations so a one-time file isn't mistaken for a live
subscription.

## ICS import and export (1.2.0)

Both directions work entirely offline (`extensions/host.tend.calendar/ics.js`,
a small RFC 5545 implementation — no network permission needed or
requested).

- **Export** builds a `.ics` covering every event (`VEVENT` with `UID`,
  `DTSTART`/`DTEND` — `DATE` values for all-day, floating local
  `DATE-TIME` for timed — `SUMMARY`, `LOCATION`, `DESCRIPTION`, an
  `RRULE` for the simple recurrences, and a `VALARM` per reminder) and
  downloads it as `calendar.ics` via a Blob link.
- **Import** accepts a `.ics` file, parses its `VEVENT`s (folded lines;
  `DATE` and `DATE-TIME` values with or without `TZID` — floating and
  `TZID` times are both treated as local, a trailing `Z` as UTC;
  `SUMMARY`/`LOCATION`/`DESCRIPTION`; `VALARM` `TRIGGER` offsets become
  reminders), then shows a preview dialog (a count of new vs. updated
  events, plus a note for anything that couldn't be mapped exactly)
  before writing anything. `RRULE FREQ=DAILY/WEEKLY/MONTHLY` with
  `INTERVAL=1` and no `COUNT`/`UNTIL` maps onto the calendar's simple
  recurrence; anything richer (`YEARLY`, another interval, a `COUNT` or
  `UNTIL`) imports as a single occurrence with an explanatory note
  rather than being silently dropped or misrepresented.
- Imported events keep `source: 'ics-import'` and their original `UID`
  (`icsUid`); re-importing the same file (or an updated one) updates
  those events in place by UID instead of duplicating them.

## Widget

The **Upcoming** shelf widget (schema-2 `widgets` block, added in 1.1.0)
puts a read-only glance at your calendar on the shelf, next to the
clock and server cards. It reads the same `events.v1` storage key the
main window writes — there's no separate copy of the data, and
anything you add here shows up in the widget within 60 seconds (or
immediately the next time its tab becomes visible).

- **Small**: today's weekday and day number, and the next 3 events
  (time or "All day", a colour dot, the title).
- **Wide**: a 7-day strip (today highlighted, a dot on days with an
  event) alongside the next 5 events.
- An empty calendar shows "No upcoming events" instead of a blank
  card.

The card has no controls — clicking an event does nothing today, since
widgets don't have a navigation API yet. The widget gallery's preview
renders fixed sample events and never touches storage.

## Storage keys

| Key | Shape |
| --- | --- |
| `events.v1` | array of normalized event objects (see `model.js`), each carrying `reminders`, `source` and `icsUid` since 1.2.0 |
| `prefs.v1` | `{ defaultView, weekStart, clock, showWeekNumbers }` |

Reminders themselves are not stored under a separate key — they live
on each event (`reminders: [{ offsetMinutes, channels }]`) and are
scheduled through `host.reminders`, which is the system of record for
*when* a reminder fires; the calendar only reconciles against it.

## How integrations plug in

Every event carries a `source` field: `'local'` (created here) or
`'ics-import'` (1.2.0, brought in through Settings → Import & export)
today, with `icsUid` set only for the latter. A future live
integration (Google Calendar, an iCal subscription, panel-generated
events) adds events with another `source` — the views and the storage
schema are designed so that lands without a migration; a dedicated
read-only affordance for non-local events in the editor is still
planned; the Integrations section of Settings names what's coming.

## Permissions

| Permission | Why |
| --- | --- |
| `storage` | Events and preferences persist through `host.storage`. |
| `notifications` (1.2.0) | Reminders are scheduled through `host.reminders`, gated behind this permission. |

## Files

```
extension.json        manifest, schema 2
index.js              activate(host): header, view switching, keyboard, dialogs, reminders sync, ICS glue
store.js              write-behind cache over host.storage
date-utils.js          Intl-only date/locale helpers (no hard-coded names)
model.js               event shape, colours, recurrence expansion
reminders.js            reminder presets, offset maths, ids, schedule computation (pure)
ics.js                  RFC 5545 import/export (pure)
ui/dom.js               element helper + the modal dialog/focus-trap
ui/styles.js            the one scoped stylesheet (panel theme tokens)
ui/event-editor.js      create/edit event dialog, incl. the Reminders field
ui/month-year-picker.js the header title's jump-to-month dialog
ui/settings-sheet.js    preferences, the Integrations placeholder, Import & export
ui/import-preview.js    the ICS import confirm dialog
views/month.js          month grid
views/time-grid.js      shared hour-grid renderer behind week/day
views/week.js           7-day time grid
views/day.js            1-day time grid
views/agenda.js         upcoming list grouped by day
icon.svg               rounded-square gradient icon
widgets/upcoming.js           the Upcoming shelf widget
widgets/upcoming-preview.svg  its widget-gallery preview image
```

Unit tests for `reminders.js` and `ics.js` live outside this folder
(`tools/build.py` ships every file it finds here) at
`tests/js/host.tend.calendar/*.test.js` — run with `bun test tests/js`
from the repo root.
