# TEND Media

Radio stations, podcasts and audiobooks from [OndaCast](https://ondacast.com), inside Tend.

- **Listen now:** continue where you left off, stations on air, new episodes from your shows.
- **Radio:** every OndaCast station, by listeners or by genre (Country, Latin, Rock, Pop, Hip-Hop, Easy Listening, Talk & News), with the song on air, its artwork and recently played tracks. **Near me** lists the stations around you, nearest first, with distances and Play nearest (your location is rounded to about a kilometre and never stored).
- **My Media:** favorite stations, subscribed shows (with new-episode counts), saved and in-progress audiobooks, and recently played, filtered by kind, sorted and searchable, plus a Your week listening summary.
- **Now playing panel:** follows what is playing: the station and song for radio; queue, chapters, transcript and details for podcasts; chapters with progress, bookmarks and Continue listening for books.
- **Podcasts:** browse, subscribe, play next, queue, mark as played; episodes newest or oldest first, filtered by unplayed / in progress / played; per-show skip intro and outro, speed, and auto-add new episodes to Up next.
- **Audiobooks:** LibriVox classics with chapters, bookmarks with notes, chapter progress, mark as finished and start over, and time left at your speed.
- **Player:** adjustable skip back/forward, smart rewind after a pause, continuous play, keyboard shortcuts (press ?), a reorderable queue, playlists, repeat one or all, shuffle, chapter skip, per-show speed, sleep timer (minutes, end of chapter, end of the current radio show), transcripts, volume, OS media keys.
- **Top bar:** what is playing (artwork, station/show/book and song/episode/chapter) appears in the panel's top bar with play/pause, and keeps playing while the window is minimized.
- **Sprout:** ask him to play a show ("the latest Morbid"), a named episode, an audiobook (it resumes) or a station ("something for coding"). When a show you follow publishes a new episode he offers it once: "There's a new episode of … Want me to play it?"
- **Shelf widgets:** Now playing, New episodes from your shows, Continue listening and Favorite stations, small or wide. Tap one to play it.
- **Clip to Notes:** saves the last 30 seconds, with its transcript, as a note in TEND Notes.
- **Narrow window:** a compact now-playing view that shares the same state.

## Permissions

| Permission | Why |
|---|---|
| `ondacast` | Read OndaCast's public catalog through the panel, and use the panel's media session (top bar, Sprout, widgets). Nothing about you is sent to OndaCast; audio plays from the publisher's own address. |
| `storage` | Keep your subscriptions, queue, progress, speeds and bookmarks on the panel, keyed by your user id. |
| `documents.read`, `documents.write` | Find a notebook and create a note when you press Clip to Notes. TEND Media never reads or changes existing notes. |

`index.js`, `widgets/` and `chunks/` are a build of the Svelte source in `Rubirosa/Tend-Media` on the project's Gitea.
