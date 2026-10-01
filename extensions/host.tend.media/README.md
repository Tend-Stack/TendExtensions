# TEND Media

Radio stations, podcasts and audiobooks from [OndaCast](https://ondacast.com), inside Tend.

- **Listen now:** continue where you left off, stations on air, new episodes from your shows.
- **Radio:** every OndaCast station, by listeners or by genre (Country, Latin, Rock, Pop, Hip-Hop, Easy Listening, Talk & News), with the song on air, its artwork and recently played tracks.
- **My Media:** favorite stations, subscribed shows (with new-episode counts), saved and in-progress audiobooks, and recently played, filtered by kind, sorted and searchable, plus a Your week listening summary.
- **Now playing panel:** follows what is playing: the station and song for radio; queue, chapters, transcript and details for podcasts; chapters with progress, bookmarks and Continue listening for books.
- **Podcasts:** browse, subscribe, play next, queue, mark as played; episodes newest or oldest first, filtered by unplayed / in progress / played; per-show skip intro and outro, speed, and auto-add new episodes to Up next.
- **Audiobooks:** LibriVox classics with chapters, bookmarks with notes, chapter progress, mark as finished and start over, and time left at your speed.
- **Player:** adjustable skip back/forward, smart rewind after a pause, continuous play, keyboard shortcuts (press ?), a reorderable queue, playlists, repeat one or all, shuffle, chapter skip, per-show speed, sleep timer (minutes, end of chapter, end of the current radio show), transcripts, volume, OS media keys.
- **Clip to Notes:** saves the last 30 seconds, with its transcript, as a note in TEND Notes.
- **Narrow window:** a compact now-playing view that shares the same state.

## Permissions

| Permission | Why |
|---|---|
| `ondacast` | Read OndaCast's public catalog through the panel. Nothing about you is sent to OndaCast; audio plays from the publisher's own address. |
| `storage` | Keep your subscriptions, queue, progress, speeds and bookmarks on the panel, keyed by your user id. |
| `documents.read`, `documents.write` | Find a notebook and create a note when you press Clip to Notes. TEND Media never reads or changes existing notes. |

`index.js` is a build of the Svelte source in `Rubirosa/Tend-Media` on the project's Gitea.
