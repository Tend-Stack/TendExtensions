# TEND Media

Radio stations, podcasts and audiobooks from [OndaCast](https://ondacast.com), inside Tend.

- **Listen now:** continue where you left off, stations on air, new episodes from your shows.
- **Radio:** live stations by genre, with the song on air.
- **Podcasts:** browse, subscribe, play next, queue, mark as played.
- **Audiobooks:** LibriVox classics with chapters, bookmarks and time left at your speed.
- **Player:** −15/+30, chapter skip, per-show speed, sleep timer (minutes, end of chapter, end of the current radio show), transcripts, volume, OS media keys.
- **Clip to Notes:** saves the last 30 seconds, with its transcript, as a note in TEND Notes.
- **Narrow window:** a compact now-playing view that shares the same state.

## Permissions

| Permission | Why |
|---|---|
| `ondacast` | Read OndaCast's public catalog through the panel. Nothing about you is sent to OndaCast; audio plays from the publisher's own address. |
| `storage` | Keep your subscriptions, queue, progress, speeds and bookmarks on the panel, keyed by your user id. |
| `documents.read`, `documents.write` | Find a notebook and create a note when you press Clip to Notes. TEND Media never reads or changes existing notes. |

`index.js` is a build of the Svelte source; see the source repository named in the pull request that added it.
