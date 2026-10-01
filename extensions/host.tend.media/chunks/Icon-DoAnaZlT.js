import { A as e, H as t, K as n, Y as r, at as i, it as a, q as o, tt as s, w as c } from "./Cover-CgtzAtR8.js";
//#region src/icons.ts
var l = {
	play: "M8 5v14l11-7z",
	pause: "M7 5h4v14H7zM13 5h4v14h-4z",
	stop: "M6.5 6.5h11v11h-11z",
	prev: "M18 6l-8.5 6L18 18zM6 6h2v12H6z",
	next: "M6 6l8.5 6L6 18zM16 6h2v12h-2z",
	search: "M11 4a7 7 0 1 0 0 14a7 7 0 1 0 0-14zM20 20l-4-4",
	playNext: "M4 6h11M4 12h11M4 18h7M17 14l4 3-4 3z",
	plus: "M12 5v14M5 12h14",
	check: "M5 12l5 5 9-10",
	close: "M6 6l12 12M18 6L6 18",
	moon: "M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z",
	clip: "M6 3h9l4 4v14H6zM9 12h7M9 16h5",
	volume: "M4 9h4l5-4v14l-5-4H4zM16 9a4 4 0 0 1 0 6",
	muted: "M4 9h4l5-4v14l-5-4H4zM16 9l5 6M21 9l-5 6",
	home: "M4 11l8-7 8 7v9h-5v-6H9v6H4z",
	radio: "M4 9h16v11H4zM8 4l10 5M8 14.5h.01M13 13h4M13 16h4",
	podcast: "M12 3a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3zM6 11a6 6 0 0 0 12 0M12 17v4",
	book: "M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h10",
	heart: "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z",
	library: "M5 4v16M9 4v16M13 5l4 15M4 20h16",
	gear: "M12 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6zM19 12l2-1-1-3-2 .3-1.3-1.3.3-2-3-1-1 2h-2l-1-2-3 1 .3 2L6 7.3l-2-.3-1 3 2 1v2l-2 1 1 3 2-.3 1.3 1.3-.3 2 3 1 1-2h2l1 2 3-1-.3-2 1.3-1.3 2 .3 1-3-2-1z",
	keyboard: "M3 7h18v10H3zM7 11h.01M11 11h.01M15 11h.01M8 14h8",
	grip: "M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01",
	up: "M6 15l6-6 6 6",
	down: "M6 9l6 6 6-6",
	clock: "M12 4a8 8 0 1 0 0 16a8 8 0 1 0 0-16zM12 8v4l3 2",
	repeat: "M17 3l3 3-3 3M4 11V9a3 3 0 0 1 3-3h13M7 21l-3-3 3-3M20 13v2a3 3 0 0 1-3 3H4",
	shuffle: "M16 4h4v4M4 20L20 4M20 16v4h-4M15 15l5 5M4 4l5 5",
	list: "M8 6h12M8 12h12M8 18h8M4 6h.01M4 12h.01M4 18h.01",
	trash: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3",
	flame: "M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3-1-5 1-8.5z"
}, u = r("<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path></path></svg>"), d = r("<svg viewBox=\"0 0 24 24\" fill=\"currentColor\" aria-hidden=\"true\"><path></path></svg>");
function f(r, l) {
	let f = c(l, "size", 3, 16), p = c(l, "stroke", 3, 0);
	var m = o(), h = a(m), g = (t) => {
		var r = u(), a = i(r);
		s(() => {
			e(r, "width", f()), e(r, "height", f()), e(r, "stroke-width", p()), e(a, "d", l.d);
		}), n(t, r);
	}, _ = (t) => {
		var r = d(), a = i(r);
		s(() => {
			e(r, "width", f()), e(r, "height", f()), e(a, "d", l.d);
		}), n(t, r);
	};
	t(h, (e) => {
		p() ? e(g) : e(_, -1);
	}), n(r, m);
}
//#endregion
export { l as n, f as t };
