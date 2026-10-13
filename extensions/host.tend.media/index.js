import { $ as e, A as t, B as n, C as r, D as i, F as a, G as o, H as s, I as c, J as l, K as u, L as d, M as f, N as p, O as m, P as h, Q as g, R as _, S as v, T as y, U as b, V as x, W as S, X as C, Z as w, _ as T, a as E, at as D, b as O, ct as k, d as ee, dt as A, et as te, f as ne, ft as j, g as M, gt as re, h as N, ht as ie, i as P, it as F, j as ae, k as oe, l as se, lt as I, m as L, mt as R, n as ce, nt as z, o as B, ot as V, p as H, pt as U, q as le, r as W, rt as G, s as ue, st as K, t as q, tt as J, u as Y, ut as X, v as de, w as Z, x as fe, y as pe } from "./chunks/Cover-CFUQKa8h.js";
import { n as Q, t as $ } from "./chunks/Icon-CkCATa2J.js";
//#region src/engine.ts
var me = class {
	el = null;
	src = "";
	live = !1;
	pendingSeek = !1;
	onEnded = () => {};
	onError = (e) => {};
	onBuffering = (e) => {};
	get active() {
		return !!this.el && !!this.src;
	}
	get time() {
		return this.el?.currentTime ?? 0;
	}
	get duration() {
		let e = this.el?.duration ?? NaN;
		return Number.isFinite(e) ? e : 0;
	}
	get url() {
		return this.src;
	}
	get settled() {
		return !!this.el && !!this.src && this.el.readyState >= 1 && !this.el.seeking && !this.pendingSeek;
	}
	element() {
		if (this.el) return this.el;
		let e = new Audio();
		e.preload = "auto", e.addEventListener("ended", () => this.onEnded()), e.addEventListener("error", () => {
			this.src && this.onError("This audio could not be played. The publisher may be offline.");
		}), e.addEventListener("waiting", () => this.onBuffering(!0)), e.addEventListener("stalled", () => this.onBuffering(!0));
		for (let t of [
			"playing",
			"canplay",
			"pause"
		]) e.addEventListener(t, () => this.onBuffering(!1));
		return this.el = e, e;
	}
	load(e, t = 0, n = !1) {
		let r = this.element();
		if (this.live = n, e === this.src) {
			!n && Math.abs(r.currentTime - t) > 1 && this.seek(t);
			return;
		}
		this.src = e, r.preload = n ? "none" : "auto", r.src = e, this.pendingSeek = t > 0, t > 0 && r.addEventListener("loadedmetadata", () => {
			this.src === e && (r.currentTime = t), this.pendingSeek = !1;
		}, { once: !0 });
	}
	seek(e) {
		this.el && this.src && !this.live && (this.el.readyState >= 1 ? this.el.currentTime = e : (this.pendingSeek = !0, this.el.addEventListener("loadedmetadata", () => {
			this.el && (this.el.currentTime = e), this.pendingSeek = !1;
		}, { once: !0 })));
	}
	apply(e) {
		let t = this.el;
		t && this.src && (t.playbackRate = this.live ? 1 : e.rate, t.defaultPlaybackRate = t.playbackRate, t.volume = Math.min(1, Math.max(0, e.volume)), e.playing && t.paused ? (this.live && t.currentTime > 0 && (t.src = this.src), t.play().catch((e) => {
			e?.name !== "AbortError" && this.onError(e?.name === "NotAllowedError" ? "Press play to start audio." : "This audio could not be played.");
		})) : !e.playing && !t.paused && t.pause());
	}
	stop() {
		this.el && (this.el.pause(), this.el.removeAttribute("src"), this.el.load(), this.src = "", this.pendingSeek = !1);
	}
	destroy() {
		this.stop(), this.el = null;
	}
}, he = [
	{
		label: "All",
		slugs: []
	},
	{
		label: "Country",
		slugs: ["country"]
	},
	{
		label: "Latin",
		slugs: ["latin"]
	},
	{
		label: "Rock",
		slugs: ["rock"]
	},
	{
		label: "Pop",
		slugs: ["pop"]
	},
	{
		label: "Hip-Hop",
		slugs: ["hip-hop"]
	},
	{
		label: "Easy Listening",
		slugs: ["easy"]
	},
	{
		label: "Talk & News",
		slugs: ["talk", "news"]
	}
], ge = [
	{
		label: "All",
		slugs: [],
		group: "top"
	},
	{
		label: "True Crime",
		slugs: ["true-crime"],
		group: "top"
	},
	{
		label: "Comedy",
		slugs: ["comedy"],
		group: "top"
	},
	{
		label: "News",
		slugs: [
			"news",
			"news-politics",
			"politics",
			"daily-news"
		],
		group: "top"
	},
	{
		label: "Society & Culture",
		slugs: ["society-culture", "society"],
		group: "top"
	},
	{
		label: "Business",
		slugs: [
			"business",
			"business-news",
			"entrepreneurship"
		],
		group: "top"
	},
	{
		label: "Sports",
		slugs: ["sports", "sports-recreation"],
		group: "top"
	},
	{
		label: "Education",
		slugs: ["education"],
		group: "learn"
	},
	{
		label: "History",
		slugs: ["history"],
		group: "learn"
	},
	{
		label: "Science",
		slugs: ["science", "science-medicine"],
		group: "learn"
	},
	{
		label: "Technology",
		slugs: ["technology"],
		group: "learn"
	},
	{
		label: "TV & Film",
		slugs: ["tv-film"],
		group: "stories"
	},
	{
		label: "Fiction",
		slugs: ["fiction"],
		group: "stories"
	},
	{
		label: "Arts",
		slugs: ["arts"],
		group: "stories"
	},
	{
		label: "Music",
		slugs: ["music"],
		group: "stories"
	},
	{
		label: "Health & Fitness",
		slugs: ["health-fitness", "health"],
		group: "life"
	},
	{
		label: "Kids & Family",
		slugs: ["kids-family"],
		group: "life"
	},
	{
		label: "Religion & Spirituality",
		slugs: [
			"religion-spirituality",
			"christianity",
			"religion"
		],
		group: "life"
	},
	{
		label: "Leisure",
		slugs: ["leisure", "games-hobbies"],
		group: "life"
	}
], _e = [
	{
		id: "top",
		label: "Popular"
	},
	{
		id: "learn",
		label: "Learn"
	},
	{
		id: "stories",
		label: "Stories & culture"
	},
	{
		id: "life",
		label: "Life"
	}
], ve = (e, t, n) => (e ?? []).reduce((e, r, i) => n(r) <= t ? i : e, e?.length ? 0 : -1), ye = (e, t) => ve(e, t, (e) => e.start), be = (e, t) => [t, ...e.filter((e) => e !== t)], xe = (e, t) => e.filter((e) => e !== t);
function Se(e, t, n, r, i, a = 50) {
	let o = e.filter((e) => !t.includes(e) && e !== r), s = n.indexOf(r), c = s < 0 ? n : [...n.slice(s + 1), ...n.slice(0, s)], l = [...new Set(c)].filter((e) => e !== r && !o.includes(e) && !i(e)).slice(0, a);
	return {
		queue: [...o, ...l],
		auto: l
	};
}
function Ce(e, t, n) {
	let r = e.filter((e) => e !== n), i = r.findIndex((e) => t.includes(e) && e !== n);
	return i < 0 ? [...r, n] : [
		...r.slice(0, i),
		n,
		...r.slice(i)
	];
}
var we = (e, t) => {
	let n = Math.max(0, ye(e, t));
	return {
		index: n,
		offset: Math.max(0, t - (e[n]?.start ?? 0))
	};
};
function Te(e, t, n) {
	let r = e[t];
	if (!r || !(n > 0)) return {
		chapters: e,
		delta: 0
	};
	let i = e[t + 1], a = n - (r.dur ?? (i ? i.start - r.start : n));
	return Math.abs(a) < 2 ? {
		chapters: e,
		delta: 0
	} : {
		chapters: e.map((e, r) => r < t ? e : r === t ? {
			...e,
			dur: n
		} : {
			...e,
			start: e.start + a
		}),
		delta: a
	};
}
var Ee = (e, t) => Object.fromEntries(Object.entries(e).sort((e, t) => t[1].at - e[1].at).slice(0, t)), De = (e, t) => {
	let n = ye(e, t);
	return n < 0 ? 0 : t - e[n].start > 3 ? e[n].start : e[n - 1]?.start ?? 0;
}, Oe = (e, t, n, r) => e === "previous" ? {
	kind: "seek",
	to: Math.max(0, t - r)
} : n > 0 && t + r >= n - 1 ? { kind: "next" } : {
	kind: "seek",
	to: n > 0 ? Math.min(n, t + r) : t + r
};
function ke(e, t, n = 1, r = n * e.speed) {
	let i = e.pos;
	if (t) {
		let n = Math.min(t.dur, e.pos + r);
		if (e.sleep === "chapter") {
			let r = t.chapters.find((t) => t.start > e.pos);
			if (r && n >= r.start) return {
				pos: r.start,
				playing: !1,
				sleep: null,
				ended: !1,
				reason: "chapter"
			};
		}
		if (n >= t.dur) return {
			pos: t.dur,
			playing: !0,
			sleep: e.sleep,
			ended: !0
		};
		i = n;
	}
	return typeof e.sleep == "number" ? e.sleep <= n ? {
		pos: i,
		playing: !1,
		sleep: null,
		ended: !1,
		reason: "timer"
	} : {
		pos: i,
		playing: !0,
		sleep: e.sleep - n,
		ended: !1
	} : {
		pos: i,
		playing: !0,
		sleep: e.sleep,
		ended: !1
	};
}
var Ae = (e, t, n) => Math.max(0, e - t) / n, je = (e) => typeof e == "number" && e < 60 ? Math.max(0, e / 60) : 1, Me = (e) => `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`;
function Ne(e, t, n, r, i = 120) {
	let a = e[t] ?? {}, o = {
		...e,
		[t]: {
			...a,
			[n]: (a[n] ?? 0) + r
		}
	}, s = Object.keys(o).sort();
	for (let e of s.slice(0, Math.max(0, s.length - i))) delete o[e];
	return o;
}
var Pe = (e) => (e?.radio ?? 0) + (e?.podcast ?? 0) + (e?.book ?? 0);
function Fe(e, t = /* @__PURE__ */ new Date()) {
	let n = [], r = {
		radio: 0,
		podcast: 0,
		book: 0
	};
	for (let i = 6; i >= 0; i--) {
		let a = new Date(t.getFullYear(), t.getMonth(), t.getDate() - i), o = Me(a), s = e[o];
		n.push({
			key: o,
			label: a.toLocaleDateString(void 0, { weekday: "short" }),
			seconds: Pe(s)
		});
		for (let e of [
			"radio",
			"podcast",
			"book"
		]) r[e] += s?.[e] ?? 0;
	}
	let i = 0;
	for (let n = 0; n < 366; n++) if (Pe(e[Me(new Date(t.getFullYear(), t.getMonth(), t.getDate() - n))]) >= 60) i++;
	else if (n > 0 || i > 0) break;
	return {
		days: n,
		byKind: r,
		total: r.radio + r.podcast + r.book,
		streak: i
	};
}
var Ie = (e, t, n, r = 60) => [{
	id: t,
	at: n
}, ...e.filter((e) => e.id !== t)].slice(0, r);
function Le(e, t, n) {
	let r = e.filter((e) => e !== t);
	if (r.length === e.length) return e;
	let i = Math.max(0, Math.min(r.length, n));
	return [
		...r.slice(0, i),
		t,
		...r.slice(i)
	];
}
var Re = (e) => e < 3e4 ? 0 : e < 3e5 ? 3 : e < 36e5 ? 10 : 20;
function ze(e) {
	let t = e.trim().replace(/\s+/g, " ");
	if (!t) return [];
	let n = t.toLowerCase();
	return /\b(cod(?:e|ing)|programming|focus|concentrat(?:e|ing|ion)|study(?:ing)?|while i work|work music)\b/.test(n) ? [
		"lofi",
		"ambient",
		"instrumental"
	] : /\b(sleep|sleeping|relax(?:ing)?|calm|chill)\b/.test(n) ? [
		"ambient",
		"chillout",
		"relax"
	] : /\b(workout|gym|running|run|exercise)\b/.test(n) ? [
		"dance",
		"edm",
		"hits"
	] : [t];
}
var Be = /\b(play|put|on|the|a|an|latest|newest|new|last|episode|episodes|ep|podcast|show|audiobook|audio book|book|of|from|please|me|some|listen|to|start|resume|continue|read)\b/g;
function Ve(e) {
	return e.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").replace(Be, " ").replace(/\s+/g, " ").trim();
}
var He = (e) => e.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
function Ue(e, t) {
	let n = He(e), r = Ve(t);
	return !n || r.length < 3 ? !1 : n.includes(r) || r.includes(n);
}
function We(e, t, n) {
	let r = new Set(He(n).split(" ")), i = Ve(t).split(" ").filter((e) => e.length >= 3 && !r.has(e));
	return i.length ? e.find((e) => {
		let t = He(e.title);
		return i.every((e) => t.includes(e));
	}) ?? null : null;
}
function Ge(e, t = 3) {
	let n = (Ve(e) || He(e)).split(" ").filter(Boolean), r = [];
	for (let e = n.length; e > 0 && r.length < t; e--) r.push(n.slice(0, e).join(" "));
	return r;
}
function Ke(e, t) {
	let n = He(e), r = Ve(t) || He(t);
	return !n || !r ? 0 : n === r ? 3 : r.includes(n) ? 2 : +!!n.includes(r);
}
function qe(e, t) {
	return e ? {
		...e,
		...t,
		desc: t.desc || e.desc,
		author: t.author || e.author,
		category: t.category || e.category,
		episodes: t.episodes || e.episodes,
		art: t.art || e.art
	} : t;
}
function Je(e, t, n, r = null, i = 3, a = 8) {
	return Object.values(e).flatMap((e) => e.filter((e) => e === r || !n(e)).slice(0, i)).sort((e, n) => (t(n) || "").localeCompare(t(e) || "")).slice(0, a);
}
var Ye = /\b(local|nearby|near\s+(?:me|here|by)|closest|nearest|around\s+here|in\s+my\s+(?:area|city|town))\b/gi, Xe = /\b(a|an|the|some|my|station|stations|radio|fm|am|play|put|on)\b/gi;
function Ze(e) {
	return {
		local: new RegExp(Ye.source, "i").test(e),
		rest: e.replace(Ye, " ").replace(Xe, " ").replace(/[^\p{L}\p{N}' ]+/gu, " ").replace(/\s+/g, " ").trim()
	};
}
var Qe = (e) => /[-_](US|GB|LR|MM)\b/i.test(e);
function $e(e, t) {
	if (e == null || !Number.isFinite(e) || e < 0) return "";
	let n = t ? e * .621371 : e, r = t ? "mi" : "km";
	return n < 1 ? `<1 ${r}` : `${n < 10 ? Math.round(n * 10) / 10 : Math.round(n)} ${r}`;
}
//#endregion
//#region src/sprout.ts
var et = 864e5, tt = 5500, nt = (e, t) => typeof e == "string" ? e.replace(/\s+/g, " ").trim().slice(0, t) : "", rt = (e, t, n, r) => typeof e == "number" && Number.isFinite(e) ? Math.min(n, Math.max(t, Math.floor(e))) : r, it = (e) => e.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""), at = {
	tech: "technology",
	technology: "technology",
	crime: "true-crime",
	hiphop: "hip-hop",
	rap: "hip-hop",
	hip: "hip-hop",
	sport: "sports",
	"easy-listening": "easy",
	jazz: "easy",
	"talk-and-news": "news"
};
function ot(e, t) {
	let n = it(t);
	if (!n) return null;
	let r = at[n] ?? n, i = e.find((e) => e.slugs.length && (it(e.label) === n || e.slugs.includes(r)));
	return i ? i.slugs : null;
}
var st = (e) => {
	let t;
	return {
		p: new Promise((n) => {
			t = setTimeout(n, e);
		}),
		cancel: () => clearTimeout(t)
	};
};
function ct(e, t) {
	let n = e[t];
	if (!Array.isArray(n)) return e;
	for (; n.length && JSON.stringify(e).length > tt;) n.pop();
	return e;
}
async function lt(e) {
	if (!e.followed()) return "none_followed";
	let t = e.waitMs ?? 4e3, n = e.pool(), r = e.now() - n.at > 6e5, i = n.status === "idle" || n.status !== "loading" && r ? e.refreshPool().catch(() => void 0) : null, a = Date.now() + t;
	if (i) {
		let e = st(t);
		await Promise.race([i, e.p]), e.cancel();
	}
	for (; e.pool().status === "loading" && Date.now() < a;) await st(40).p;
	let o = e.pool().status;
	if (o === "loading") return "loading";
	if (o === "error" && !e.fresh(1).length) throw Error("catalog unavailable");
	return "ready";
}
async function ut(e, t) {
	let n = rt(t.limit, 1, 20, 8), r = await lt(e);
	if (r === "none_followed") return {
		status: r,
		episodes: [],
		total: 0
	};
	let i = e.fresh(60), a = e.now();
	return ct({
		status: r,
		episodes: i.slice(0, n).map((t) => {
			let n = Date.parse(t.date);
			return {
				id: t.id,
				show: nt(t.sub, 60),
				title: nt(t.title, 100),
				published: t.date.slice(0, 10),
				...Number.isFinite(n) ? { age_days: Math.max(0, Math.floor((a - n) / et)) } : {},
				started: e.started(t.id)
			};
		}),
		total: i.length
	}, "episodes");
}
var dt = (e, t, n, r) => ({
	id: e,
	kind: t,
	title: nt(n, 80),
	subtitle: nt(r, 80)
});
async function ft(e, t) {
	let n = (e) => L(e, "stations").map(v).filter((e) => !!e);
	if (!e.stations.genre) return n(await e.stations.search(t[0].replace(/-/g, " "), 10, 1));
	let r = await Promise.all(t.map((t) => e.stations.genre(t, 1).catch(() => null)));
	if (r.every((e) => e === null)) throw Error("genre unavailable");
	let i = r.map(n), a = [];
	for (let e = 0; i.some((t) => e < t.length); e++) for (let t of i) t[e] && a.push(t[e]);
	return a;
}
async function pt(e, t, n, r) {
	let i = (e) => L(e, "stations").map(v).filter((e) => !!e), a = [], o = !n && r ? ot(he, r) : null, s = n || (o ? "" : r);
	if (o) a = await ft(t, o);
	else if (s) {
		for (let e of ze(s)) if (a = i(await t.stations.search(e, 10, 1)), a.length) break;
	} else a = i(await t.stations.trending(10));
	let c = a.slice(0, 10);
	return e.remember(c), c.map((e) => dt(e.id, "station", e.title, e.sub));
}
async function mt(e, t, n) {
	let r = (e) => L(e, "podcasts").map(fe).filter((e) => !!e), i = [], a = !t && n ? ot(ge, n) : null, o = t || (a ? "" : n);
	if (a && e.podcasts.genre) {
		let t = await Promise.all(a.map((t) => e.podcasts.genre(t).catch(() => null)));
		if (t.every((e) => e === null)) throw Error("genre unavailable");
		i = t.flatMap(r).map((e) => ({
			slug: e.slug,
			title: e.title,
			sub: [e.author, e.category].filter(Boolean).join(" · ")
		}));
	} else i = o || a ? L(await e.search(o || a.join(" "), "podcasts"), "results").filter((e) => e.type === void 0 || e.type === "podcast").map((e) => ({
		slug: nt(e.slug, 120),
		title: nt(e.title, 120),
		sub: nt(e.subtitle, 120)
	})).filter((e) => e.slug && e.title) : r(await e.podcasts.list({
		sort: "last-episode",
		limit: 10
	})).map((e) => ({
		slug: e.slug,
		title: e.title,
		sub: [e.author, e.category].filter(Boolean).join(" · ")
	}));
	let s = /* @__PURE__ */ new Set();
	return i.filter((e) => !s.has(e.slug) && !!s.add(e.slug)).slice(0, 10).map((e) => dt(`show:${e.slug}`, "podcast", e.title, e.sub));
}
async function ht(e, t, n) {
	let r = t || n, i;
	return i = r ? L(await e.search(r, "audiobooks"), "results").map((e) => ({
		slug: nt(e.slug, 120),
		title: nt(e.title, 120),
		sub: nt(e.subtitle, 120)
	})).filter((e) => e.slug && e.title) : L(await e.audiobooks.list({ limit: 10 }), "audiobooks").map(de).filter((e) => !!e).map((e) => ({
		slug: e.slug,
		title: e.title,
		sub: e.sub
	})), i.slice(0, 10).map((e) => dt(`book:${e.slug}`, "audiobook", e.title, e.sub));
}
async function gt(e, t) {
	let n = e.api;
	if (!n) throw Error("no catalog");
	let r = t.kind === "station" || t.kind === "podcast" || t.kind === "audiobook" ? t.kind : null;
	if (!r) return {
		status: "bad_kind",
		results: [],
		total: 0
	};
	let i = nt(t.query, 120), a = nt(t.category, 60), o = r === "station" ? await pt(e, n, i, a) : r === "podcast" ? await mt(n, i, a) : await ht(n, i, a);
	return ct({
		status: o.length ? "ok" : "empty",
		kind: r,
		results: o,
		total: o.length
	}, "results");
}
var _t = {
	podcast: "podcast",
	radio: "station",
	book: "audiobook"
};
async function vt(e, t) {
	let n = nt(t.id, 120), r = t.queue === "new_episodes" ? "new_episodes" : "none";
	if (!n) return { status: "unknown_id" };
	let i = e.current();
	if (i && i.id === n) return i.playing || await e.toggle(), {
		status: "playing",
		kind: _t[i.kind],
		title: nt(i.title, 100),
		source: nt(i.source, 80),
		queued: 0
	};
	if (n.startsWith("show:")) {
		let t = await e.playShow(n.slice(5)).catch(() => ({
			ok: !1,
			queued: 0
		}));
		return t.ok ? yt(e, t.queued) : { status: "unavailable" };
	}
	if (!e.item(n) && n.startsWith("ep:") && e.followed() && await lt(e).catch(() => void 0), !e.item(n) && n.startsWith("st:") && e.api) try {
		let t = v(Y(await e.api.stations.get(n.slice(3))));
		t && e.remember([t]);
	} catch {}
	let a = e.item(n);
	if (!a && !n.startsWith("book:")) return { status: "unknown_id" };
	let o;
	r === "new_episodes" && a?.type === "podcast" && (o = [n, ...e.fresh(60).map((e) => e.id).filter((e) => e !== n)].slice(0, 12));
	let s = await e.playItem(n, o);
	return s.ok ? yt(e, s.queued) : { status: "unavailable" };
}
function yt(e, t) {
	let n = e.current();
	return {
		status: "playing",
		kind: n ? _t[n.kind] : "",
		title: nt(n?.title, 100),
		source: nt(n?.source, 80),
		queued: t
	};
}
async function bt(e, t) {
	let n = t.action;
	if (n !== "pause" && n !== "resume" && n !== "next" && n !== "previous" && n !== "stop") return { status: "bad_action" };
	let r = e.current();
	if (!r) return n === "resume" && await e.resumeLast() ? xt(e, n) : {
		status: "nothing_playing",
		action: n
	};
	switch (n) {
		case "pause":
		case "stop":
			r.playing && (r.kind === "radio" ? e.stop() : await e.toggle());
			break;
		case "resume":
			r.playing || await e.toggle();
			break;
		case "next":
			e.next();
			break;
		case "previous": e.previous();
	}
	return xt(e, n);
}
function xt(e, t) {
	let n = e.current();
	return {
		status: "done",
		action: t,
		playing: !!n?.playing,
		title: nt(n?.title, 100)
	};
}
function St(e) {
	let t = (e) => e && typeof e == "object" ? e : {};
	return {
		new_episodes: async (n) => ut(e, t(n)),
		search: async (n) => gt(e, t(n)),
		play: async (n) => vt(e, t(n)),
		control: async (n) => bt(e, t(n))
	};
}
//#endregion
//#region src/store.svelte.ts
var Ct = "Near me", wt = {
	radio: ["onair", "queue"],
	podcast: [
		"queue",
		"chaps",
		"trans",
		"about"
	],
	book: [
		"chaps",
		"marks",
		"trans",
		"about"
	]
}, Tt = {
	back: 15,
	fwd: 30,
	smartRewind: !0,
	continuous: !0,
	repeat: "off",
	autoFill: !0,
	headsetSkip: !0
}, Et = [
	5,
	10,
	15,
	30
], Dt = [
	10,
	15,
	30,
	45,
	60
], Ot = {
	intro: 0,
	outro: 0,
	autoQueue: !1
}, kt = [
	0,
	10,
	15,
	30,
	45,
	60,
	90
], At = [
	0,
	10,
	15,
	30,
	60
], jt = [
	.8,
	1,
	1.1,
	1.2,
	1.4,
	1.6,
	1.8,
	2
], Mt = [
	5,
	15,
	30,
	45,
	60,
	90
], Nt = 200, Pt = class {
	#e = I(K({}));
	get items() {
		return e(this.#e);
	}
	set items(e) {
		k(this.#e, e, !0);
	}
	#t = I(K({}));
	get shows() {
		return e(this.#t);
	}
	set shows(e) {
		k(this.#t, e, !0);
	}
	#n = I(K({}));
	get showEpisodes() {
		return e(this.#n);
	}
	set showEpisodes(e) {
		k(this.#n, e, !0);
	}
	#r = I(K({}));
	get epOrder() {
		return e(this.#r);
	}
	set epOrder(e) {
		k(this.#r, e, !0);
	}
	#i = I("all");
	get epFilter() {
		return e(this.#i);
	}
	set epFilter(e) {
		k(this.#i, e, !0);
	}
	#a = I("");
	get epQuery() {
		return e(this.#a);
	}
	set epQuery(e) {
		k(this.#a, e, !0);
	}
	#o = I(K({}));
	get showPrefs() {
		return e(this.#o);
	}
	set showPrefs(e) {
		k(this.#o, e, !0);
	}
	#s = I(K([]));
	get autoQueued() {
		return e(this.#s);
	}
	set autoQueued(e) {
		k(this.#s, e, !0);
	}
	#c = I(K([]));
	get playlists() {
		return e(this.#c);
	}
	set playlists(e) {
		k(this.#c, e, !0);
	}
	#l = I(K([]));
	get upAuto() {
		return e(this.#l);
	}
	set upAuto(e) {
		k(this.#l, e, !0);
	}
	#u = I("");
	get upFrom() {
		return e(this.#u);
	}
	set upFrom(e) {
		k(this.#u, e, !0);
	}
	#d = I(K([]));
	get trending() {
		return e(this.#d);
	}
	set trending(e) {
		k(this.#d, e, !0);
	}
	#f = I("idle");
	get radioStatus() {
		return e(this.#f);
	}
	set radioStatus(e) {
		k(this.#f, e, !0);
	}
	#p = I(K({
		slugs: [],
		cursor: null,
		status: "idle"
	}));
	get podcastBrowse() {
		return e(this.#p);
	}
	set podcastBrowse(e) {
		k(this.#p, e, !0);
	}
	#m = I(!1);
	get showAbout() {
		return e(this.#m);
	}
	set showAbout(e) {
		k(this.#m, e, !0);
	}
	#h = I("All");
	get podGenre() {
		return e(this.#h);
	}
	set podGenre(e) {
		k(this.#h, e, !0);
	}
	#g = I(K({}));
	get podGenreLists() {
		return e(this.#g);
	}
	set podGenreLists(e) {
		k(this.#g, e, !0);
	}
	#_ = I(K({
		ids: [],
		cursor: null,
		status: "idle"
	}));
	get bookBrowse() {
		return e(this.#_);
	}
	set bookBrowse(e) {
		k(this.#_, e, !0);
	}
	#v = I(K({}));
	get newPool() {
		return e(this.#v);
	}
	set newPool(e) {
		k(this.#v, e, !0);
	}
	#y = I("idle");
	get newStatus() {
		return e(this.#y);
	}
	set newStatus(e) {
		k(this.#y, e, !0);
	}
	newAt = 0;
	sproutOff = null;
	#b = I(K({}));
	get bookStatus() {
		return e(this.#b);
	}
	set bookStatus(e) {
		k(this.#b, e, !0);
	}
	#x = I(K({}));
	get transcripts() {
		return e(this.#x);
	}
	set transcripts(e) {
		k(this.#x, e, !0);
	}
	#S = I(K({
		q: "",
		hits: [],
		status: "idle"
	}));
	get search() {
		return e(this.#S);
	}
	set search(e) {
		k(this.#S, e, !0);
	}
	#C = I(K({
		ids: [],
		page: 0,
		more: !1,
		total: 0,
		status: "idle"
	}));
	get stationHits() {
		return e(this.#C);
	}
	set stationHits(e) {
		k(this.#C, e, !0);
	}
	#w = I(K({}));
	get radioLists() {
		return e(this.#w);
	}
	set radioLists(e) {
		k(this.#w, e, !0);
	}
	#T = I(K({
		status: "idle",
		ids: [],
		dist: {},
		place: ""
	}));
	get near() {
		return e(this.#T);
	}
	set near(e) {
		k(this.#T, e, !0);
	}
	#E = I(K({}));
	get nowPlaying() {
		return e(this.#E);
	}
	set nowPlaying(e) {
		k(this.#E, e, !0);
	}
	supported = !0;
	#D = I("home");
	get tab() {
		return e(this.#D);
	}
	set tab(e) {
		k(this.#D, e, !0);
	}
	#O = I(null);
	get showSlug() {
		return e(this.#O);
	}
	set showSlug(e) {
		k(this.#O, e, !0);
	}
	#k = I(null);
	get bookId() {
		return e(this.#k);
	}
	set bookId(e) {
		k(this.#k, e, !0);
	}
	#A = I("All");
	get genre() {
		return e(this.#A);
	}
	set genre(e) {
		k(this.#A, e, !0);
	}
	#j = I("");
	get query() {
		return e(this.#j);
	}
	set query(e) {
		k(this.#j, e, !0);
	}
	#M = I("onair");
	get rtab() {
		return e(this.#M);
	}
	set rtab(e) {
		k(this.#M, e, !0);
	}
	#N = I(null);
	get pop() {
		return e(this.#N);
	}
	set pop(e) {
		k(this.#N, e, !0);
	}
	#P = I(null);
	get popItem() {
		return e(this.#P);
	}
	set popItem(e) {
		k(this.#P, e, !0);
	}
	#F = I(!1);
	get shortcuts() {
		return e(this.#F);
	}
	set shortcuts(e) {
		k(this.#F, e, !0);
	}
	#I = I("all");
	get libKind() {
		return e(this.#I);
	}
	set libKind(e) {
		k(this.#I, e, !0);
	}
	#L = I("recent");
	get libSort() {
		return e(this.#L);
	}
	set libSort(e) {
		k(this.#L, e, !0);
	}
	#R = I("");
	get libQuery() {
		return e(this.#R);
	}
	set libQuery(e) {
		k(this.#R, e, !0);
	}
	#z = I(null);
	get toast() {
		return e(this.#z);
	}
	set toast(e) {
		k(this.#z, e, !0);
	}
	#B = I(null);
	get now() {
		return e(this.#B);
	}
	set now(e) {
		k(this.#B, e, !0);
	}
	#V = I(0);
	get pos() {
		return e(this.#V);
	}
	set pos(e) {
		k(this.#V, e, !0);
	}
	#H = I(!1);
	get playing() {
		return e(this.#H);
	}
	set playing(e) {
		k(this.#H, e, !0);
	}
	#U = I(!1);
	get buffering() {
		return e(this.#U);
	}
	set buffering(e) {
		k(this.#U, e, !0);
	}
	#W = I(!1);
	get loadingItem() {
		return e(this.#W);
	}
	set loadingItem(e) {
		k(this.#W, e, !0);
	}
	#G = I(1);
	get speed() {
		return e(this.#G);
	}
	set speed(e) {
		k(this.#G, e, !0);
	}
	#K = I(K({}));
	get speeds() {
		return e(this.#K);
	}
	set speeds(e) {
		k(this.#K, e, !0);
	}
	#q = I(K([]));
	get queue() {
		return e(this.#q);
	}
	set queue(e) {
		k(this.#q, e, !0);
	}
	#J = I(K({}));
	get progress() {
		return e(this.#J);
	}
	set progress(e) {
		k(this.#J, e, !0);
	}
	#Y = I(K({}));
	get played() {
		return e(this.#Y);
	}
	set played(e) {
		k(this.#Y, e, !0);
	}
	#X = I(K({}));
	get subscribed() {
		return e(this.#X);
	}
	set subscribed(e) {
		k(this.#X, e, !0);
	}
	#Z = I(K({}));
	get bookmarks() {
		return e(this.#Z);
	}
	set bookmarks(e) {
		k(this.#Z, e, !0);
	}
	#Q = I(K([]));
	get recentStations() {
		return e(this.#Q);
	}
	set recentStations(e) {
		k(this.#Q, e, !0);
	}
	#$ = I(K({}));
	get favorites() {
		return e(this.#$);
	}
	set favorites(e) {
		k(this.#$, e, !0);
	}
	#ee = I(K({}));
	get saved() {
		return e(this.#ee);
	}
	set saved(e) {
		k(this.#ee, e, !0);
	}
	#te = I(K({}));
	get addedAt() {
		return e(this.#te);
	}
	set addedAt(e) {
		k(this.#te, e, !0);
	}
	#ne = I(K([]));
	get history() {
		return e(this.#ne);
	}
	set history(e) {
		k(this.#ne, e, !0);
	}
	#re = I(K({}));
	get stats() {
		return e(this.#re);
	}
	set stats(e) {
		k(this.#re, e, !0);
	}
	#ie = I(K({ ...Tt }));
	get prefs() {
		return e(this.#ie);
	}
	set prefs(e) {
		k(this.#ie, e, !0);
	}
	#ae = I(null);
	get sleep() {
		return e(this.#ae);
	}
	set sleep(e) {
		k(this.#ae, e, !0);
	}
	#oe = I(.8);
	get volume() {
		return e(this.#oe);
	}
	set volume(e) {
		k(this.#oe, e, !0);
	}
	#se = I(!1);
	get muted() {
		return e(this.#se);
	}
	set muted(e) {
		k(this.#se, e, !0);
	}
	#ce = I(!1);
	get restored() {
		return e(this.#ce);
	}
	set restored(e) {
		k(this.#ce, e, !0);
	}
	host;
	api;
	storageKey;
	legacyKey;
	localKey;
	restoreTries = 0;
	#le = I(!1);
	get storageError() {
		return e(this.#le);
	}
	set storageError(e) {
		k(this.#le, e, !0);
	}
	engine = new me();
	timers = [];
	toastTimer;
	saveTimer;
	searchTimer;
	searchSeq = 0;
	pendingPlay = 0;
	lastSaved = 0;
	pausedAt = 0;
	loadedId = null;
	fileIdx = 0;
	ducked = !1;
	sessionOff = null;
	sessionKey = "";
	#ue = I(K([]));
	get suggested() {
		return e(this.#ue);
	}
	set suggested(e) {
		k(this.#ue, e, !0);
	}
	constructor(e) {
		this.host = e, this.api = e.ondacast, this.supported = !!e.ondacast;
		let t = ue(e);
		this.storageKey = t.storageKey, this.legacyKey = t.legacyKey, this.localKey = t.localKey, this.engine.onEnded = () => this.ended(), this.engine.onError = (e) => {
			this.playing = !1, this.buffering = !1, this.say(e), this.sync();
		}, this.engine.onBuffering = (e) => {
			this.buffering = e && this.playing;
		};
	}
	async start() {
		if (this.timers.push(setInterval(() => this.tick(), 1e3)), this.timers.push(setInterval(() => this.refreshNowPlaying(), 2e4)), await this.restore(), !this.supported) return;
		this.loadHome(), this.sync(!0);
		let e = this.host.mediaSession;
		if (e && !this.host.widget) {
			try {
				this.sessionOff = e.onCommand((e) => this.command(e));
			} catch {}
			this.publishSession();
		}
		if (this.host.sprout?.provide && !this.host.widget) try {
			this.sproutOff = this.host.sprout.provide(St(this.sproutPort()));
		} catch {}
		this.timers.push(setInterval(() => void this.loadNewEpisodes(), 18e5));
	}
	destroy() {
		for (let e of this.timers) clearInterval(e);
		this.timers = [], clearTimeout(this.toastTimer), clearTimeout(this.searchTimer), clearTimeout(this.saveTimer), this.saveTimer = void 0, this.engine.destroy(), this.sessionOff?.(), this.sessionOff = null;
		try {
			this.sproutOff?.();
		} catch {}
		this.sproutOff = null;
		try {
			this.host.mediaSession?.set(null);
		} catch {}
		if (!this.restored) return Promise.resolve();
		this.saveCurrent();
		let e = this.persist();
		return this.restored = !1, e;
	}
	get item() {
		return this.now ? this.items[this.now] ?? null : null;
	}
	get live() {
		return this.item?.type === "radio";
	}
	get chapters() {
		let e = this.item;
		return e && H(e) ? e.chapters : [];
	}
	get chapIdx() {
		return ye(this.chapters, this.pos);
	}
	get transcriptKey() {
		let e = this.item;
		if (!e || e.type === "radio") return null;
		if (e.type === "podcast") return e.id;
		let t = e.chapters[this.chapIdx];
		return t?.section ? `${e.id}:${t.section}` : null;
	}
	get transcript() {
		let e = this.transcriptKey;
		return e ? this.transcripts[e] ?? null : null;
	}
	get lineIdx() {
		let e = this.transcript;
		return e ? ve(e.lines, this.pos, (e) => e.t) : -1;
	}
	get kindLabel() {
		let e = this.item;
		return e ? e.type === "radio" ? "● LIVE RADIO" : se[e.type].toUpperCase() : "";
	}
	get subtitle() {
		let e = this.item;
		return e ? (e.type, e.sub) : "";
	}
	songOf(e) {
		let t = this.nowPlaying[e];
		return t?.title ? t.artist ? `${t.title} · ${t.artist}` : t.title : "";
	}
	get rightTabs() {
		let e = this.item;
		return e ? wt[e.type] : ["queue"];
	}
	get activeRtab() {
		let e = this.rightTabs;
		return e.includes(this.rtab) ? this.rtab : e[0];
	}
	get newEpisodes() {
		return Je(this.newPool, (e) => {
			let t = this.items[e];
			return t?.type === "podcast" ? t.date : "";
		}, (e) => this.isDone(e) || this.progressOf(e) > 5, this.now);
	}
	get show() {
		return this.showSlug ? this.shows[this.showSlug] ?? this.subscribed[this.showSlug] ?? null : null;
	}
	get allEpisodes() {
		return ((this.showSlug ? this.showEpisodes[this.showSlug] : null)?.ids ?? []).map((e) => this.items[e]).filter((e) => e?.type === "podcast");
	}
	episodeState(e) {
		return this.isDone(e) ? "played" : this.progressOf(e) > 5 ? "progress" : "unplayed";
	}
	get episodes() {
		let e = this.epQuery.trim().toLowerCase();
		return this.allEpisodes.filter((t) => (this.epFilter === "all" || this.episodeState(t.id) === this.epFilter) && (!e || t.title.toLowerCase().includes(e) || (t.desc ?? "").toLowerCase().includes(e)));
	}
	showPrefsOf(e) {
		return {
			...Ot,
			...this.showPrefs[e] ?? {}
		};
	}
	get book() {
		let e = this.bookId ? this.items[this.bookId] : null;
		return e?.type === "book" ? e : null;
	}
	get speedScope() {
		let e = this.item;
		return e ? e.type === "podcast" ? e.sub : e.title : "";
	}
	get continueIds() {
		let e = this.item && H(this.item) ? { [this.item.id]: {
			pos: this.pos,
			dur: this.durOf(this.item.id),
			at: 2 ** 53 - 1
		} } : {};
		return Object.entries({
			...this.progress,
			...e
		}).filter(([e, t]) => this.items[e] && !this.played[e] && t.pos > 5 && (!t.dur || t.pos < t.dur - 5)).sort((e, t) => t[1].at - e[1].at).map(([e]) => e).slice(0, 3);
	}
	get onAirIds() {
		return [.../* @__PURE__ */ new Set([
			...Object.keys(this.favorites),
			...this.recentStations,
			...this.trending
		])].filter((e) => this.items[e]).slice(0, 4);
	}
	isFavorite(e) {
		let t = this.items[e];
		return t ? t.type === "radio" ? !!this.favorites[e] : t.type === "book" ? !!this.saved[e] : !!this.subscribed[t.show] : !1;
	}
	toggleFavorite(e = this.now ?? "") {
		let t = this.items[e];
		if (!t) return;
		if (t.type === "podcast") {
			this.toggleSubscribe(t.show);
			return;
		}
		let n = !this.isFavorite(e);
		if (t.type === "radio") {
			let r = { ...this.favorites };
			n ? r[e] = t : delete r[e], this.favorites = r, this.say(n ? `${t.title} added to your favorite stations` : `${t.title} removed from favorites`);
		} else {
			let r = { ...this.saved };
			n ? r[e] = {
				...t,
				chapters: [],
				loaded: !1,
				desc: void 0
			} : delete r[e], this.saved = r, this.say(n ? "Saved to My Media" : "Removed from My Media");
		}
		this.addedAt = n ? {
			...this.addedAt,
			[e]: Date.now()
		} : Object.fromEntries(Object.entries(this.addedAt).filter(([t]) => t !== e)), this.scheduleSave();
	}
	lastPlayed(e) {
		return this.history.find((t) => t.id === e)?.at ?? this.progress[e]?.at ?? 0;
	}
	get inProgress() {
		return Object.entries(this.progress).filter(([e, t]) => this.items[e] && !this.played[e] && t.pos > 5 && (!t.dur || t.pos < t.dur - 5)).sort((e, t) => t[1].at - e[1].at).map(([e]) => e);
	}
	get libraryBooks() {
		return [.../* @__PURE__ */ new Set([
			...Object.keys(this.saved),
			...Object.keys(this.progress).filter((e) => e.startsWith("book:")),
			...Object.keys(this.played).filter((e) => e.startsWith("book:") && this.played[e])
		])].map((e) => this.items[e]?.type === "book" ? this.items[e] : this.saved[e]).filter((e) => !!e);
	}
	newCount(e) {
		return this.newEpisodes.filter((t) => {
			let n = this.items[t];
			return n?.type === "podcast" && n.show === e && !this.isDone(t) && !this.progressOf(t);
		}).length;
	}
	get week() {
		return Fe(this.stats);
	}
	get libraryCounts() {
		return {
			radio: Object.keys(this.favorites).length,
			podcast: Object.keys(this.subscribed).length,
			book: this.libraryBooks.length
		};
	}
	clearHistory() {
		this.history = [], this.say("Listening history cleared"), this.scheduleSave();
	}
	moveQueue(e, t) {
		this.queue = Le(this.queue, e, t), this.scheduleSave();
	}
	isAuto(e) {
		return this.upAuto.includes(e);
	}
	cycleRepeat() {
		let e = this.prefs.repeat === "off" ? "all" : this.prefs.repeat === "all" ? "one" : "off";
		this.setPref("repeat", e), this.say(e === "off" ? "Repeat off" : e === "all" ? "Repeat all: Up next loops" : "Repeat one: this plays again");
	}
	openItemMenu(e) {
		let t = this.pop === "item" && this.popItem === e;
		this.pop = t ? null : "item", this.popItem = t ? null : e;
	}
	shuffleQueue() {
		let e = [...this.queue];
		for (let t = e.length - 1; t > 0; t--) {
			let n = Math.floor(Math.random() * (t + 1));
			[e[t], e[n]] = [e[n], e[t]];
		}
		this.queue = e, this.say("Up next shuffled"), this.scheduleSave();
	}
	clearQueue() {
		this.queue = [], this.upAuto = [], this.say("Up next cleared"), this.scheduleSave();
	}
	saveQueueAsPlaylist(e) {
		let t = [.../* @__PURE__ */ new Set([...this.item && this.item.type !== "radio" ? [this.item.id] : [], ...this.queue])].filter((e) => this.items[e] && this.items[e].type !== "radio");
		if (!t.length) return this.say("Add episodes or books to Up next first"), null;
		let n = {
			id: `pl:${Date.now().toString(36)}`,
			name: e.trim().slice(0, 80) || "My playlist",
			ids: t,
			at: Date.now()
		};
		return this.playlists = [n, ...this.playlists], this.say(`Saved “${n.name}” with ${t.length} item${t.length === 1 ? "" : "s"}`), this.scheduleSave(), n;
	}
	addToPlaylist(e, t) {
		this.playlists = this.playlists.map((n) => n.id === e && !n.ids.includes(t) ? {
			...n,
			ids: [...n.ids, t]
		} : n), this.say("Added to playlist"), this.scheduleSave();
	}
	removeFromPlaylist(e, t) {
		this.playlists = this.playlists.map((n) => n.id === e ? {
			...n,
			ids: n.ids.filter((e) => e !== t)
		} : n), this.scheduleSave();
	}
	renamePlaylist(e, t) {
		this.playlists = this.playlists.map((n) => n.id === e ? {
			...n,
			name: t.trim().slice(0, 80) || n.name
		} : n), this.scheduleSave();
	}
	deletePlaylist(e) {
		this.playlists = this.playlists.filter((t) => t.id !== e), this.say("Playlist deleted"), this.scheduleSave();
	}
	playPlaylist(e, t = !1) {
		let n = (this.playlists.find((t) => t.id === e)?.ids ?? []).filter((e) => this.items[e]);
		if (!n.length) {
			this.say("This playlist is empty");
			return;
		}
		if (t) for (let e = n.length - 1; e > 0; e--) {
			let t = Math.floor(Math.random() * (e + 1));
			[n[e], n[t]] = [n[t], n[e]];
		}
		let [r, ...i] = n;
		this.queue = i, this.upAuto = [], this.play(r);
	}
	playlistDuration(e) {
		return e.ids.reduce((e, t) => e + this.durOf(t), 0);
	}
	setPref(e, t) {
		this.prefs = {
			...this.prefs,
			[e]: t
		}, this.scheduleSave();
	}
	get stationList() {
		return this.radioLists[this.genre] ?? {
			ids: [],
			page: 0,
			cursor: null,
			more: !1,
			status: "idle"
		};
	}
	get stations() {
		return this.stationList.ids.map((e) => this.items[e]).filter((e) => e?.type === "radio");
	}
	progressOf(e) {
		return e === this.now ? this.pos : this.progress[e]?.pos ?? 0;
	}
	durOf(e) {
		let t = this.items[e];
		return t && H(t) && (t.dur || this.progress[e]?.dur) || 0;
	}
	speedFor(e) {
		let t = this.items[e];
		return !t || t.type === "radio" ? 1 : this.speeds[T(t)] ?? 1;
	}
	isDone(e) {
		let t = this.durOf(e);
		return !!this.played[e] || t > 0 && this.progressOf(e) >= t - 5;
	}
	isPlaying(e) {
		return e === this.now && this.playing;
	}
	pctOf(e) {
		let t = this.durOf(e);
		return this.items[e]?.type === "radio" ? 100 : t ? Math.min(100, Math.round(this.progressOf(e) / t * 100)) : 0;
	}
	lenOf(e) {
		let t = this.items[e];
		if (!t) return "";
		if (t.type === "radio") return "Live";
		let n = this.durOf(e);
		return n ? E(n) : "";
	}
	leftOf(e) {
		let t = this.items[e], n = this.progressOf(e), r = this.durOf(e);
		return t ? t.type === "radio" ? "Live now" : this.isDone(e) ? "Played" : r ? n > 5 ? `${E((r - n) / this.speedFor(e))} left` : E(r) : n > 5 ? `${W(n)} in` : "" : "";
	}
	remember(e) {
		if (!e.length) return;
		let t = { ...this.items };
		for (let n of e) {
			let e = t[n.id];
			t[n.id] = e?.type === "book" && e.loaded && n.type === "book" && !n.loaded ? e : n;
		}
		this.items = t;
	}
	async loadHome() {
		await Promise.all([this.loadRadio(), this.loadNewEpisodes()]);
	}
	async loadRadio() {
		if (this.api && this.radioStatus !== "loading") {
			this.radioStatus = "loading";
			try {
				let e = L(await this.api.stations.trending(30), "stations").map(v).filter((e) => !!e);
				this.remember(e), this.trending = e.map((e) => e.id), this.radioStatus = "ready";
			} catch {
				this.radioStatus = "error";
			}
		}
	}
	get nearbySupported() {
		return !!this.api?.stations.nearby && typeof navigator < "u" && !!navigator.geolocation;
	}
	get nearStations() {
		return this.near.ids.map((e) => this.items[e]).filter((e) => e?.type === "radio");
	}
	position() {
		return new Promise((e, t) => navigator.geolocation.getCurrentPosition((t) => e({
			lat: t.coords.latitude,
			lng: t.coords.longitude
		}), t, {
			enableHighAccuracy: !1,
			maximumAge: 9e5,
			timeout: 15e3
		}));
	}
	async loadNearby() {
		let e = this.api;
		if (!e?.stations.nearby || !this.nearbySupported) return this.near = {
			...this.near,
			status: "unsupported"
		}, !1;
		if (this.near.status === "locating" || this.near.status === "loading") return !1;
		this.near = {
			...this.near,
			status: "locating"
		};
		let t;
		try {
			t = await this.position();
		} catch (e) {
			return this.near = {
				...this.near,
				status: e?.code === 1 ? "denied" : "error"
			}, !1;
		}
		this.near = {
			...this.near,
			status: "loading"
		};
		try {
			let n = (e) => Math.round(e * 100) / 100, r = Y(await e.stations.nearby(n(t.lat), n(t.lng))), i = [], a = {};
			for (let e of L(r, "stations")) {
				let t = v(e);
				if (!t || t.id in a) continue;
				let n = e.distance_km;
				i.push(t), a[t.id] = typeof n == "number" && Number.isFinite(n) ? n : null;
			}
			this.remember(i);
			let o = Y(r.place), s = (e) => typeof e == "string" ? e.trim() : "";
			return this.near = {
				status: "ready",
				ids: i.map((e) => e.id),
				dist: a,
				place: [s(o.city), s(o.state) || s(o.country)].filter(Boolean).join(", ")
			}, i.length > 0;
		} catch {
			return this.near = {
				...this.near,
				status: "error"
			}, !1;
		}
	}
	nearestStation(e = []) {
		let t = this.nearStations;
		return e.length ? t.find((t) => e.some((e) => [
			t.title,
			t.genre,
			t.sub
		].join(" ").toLowerCase().includes(e))) ?? null : t[0] ?? null;
	}
	async loadStations(e = this.genre, t = !1) {
		let n = this.api, r = he.find((t) => t.label === e), i = this.radioLists[e];
		if (!n || !r || i?.status === "loading" || t && !i?.more) return;
		let a = (t) => {
			this.radioLists = {
				...this.radioLists,
				[e]: t
			};
		}, o = t && i ? i : {
			ids: [],
			page: 0,
			cursor: null,
			more: !1,
			status: "idle"
		};
		a({
			...o,
			status: "loading"
		});
		try {
			let e = [], i = o.page + 1, s = null, c = !1, l = (e) => L(e, "stations").map(v).filter((e) => !!e);
			if (!r.slugs.length) {
				if (n.stations.browse) {
					let r = Y(await n.stations.browse(t ? o.cursor ?? void 0 : void 0));
					e = l(r), s = typeof r.next_cursor == "string" && r.next_cursor ? r.next_cursor : null, c = !!s;
				} else e = l(await n.stations.trending(30));
			} else if (n.stations.genre) {
				let t = await Promise.all(r.slugs.map((e) => n.stations.genre(e, i).catch(() => null)));
				if (t.every((e) => e === null)) throw Error("genre unavailable");
				let a = t.map(l);
				for (let t = 0; a.some((e) => t < e.length); t++) for (let n of a) n[t] && e.push(n[t]);
				c = t.some((e) => Y(e).has_more === !0);
			} else {
				let t = r.slugs.map((e) => e.replace("-", " "));
				e = l(await n.stations.trending(30)).filter((e) => t.some((t) => e.genre.toLowerCase().includes(t)));
			}
			this.remember(e), a({
				ids: [.../* @__PURE__ */ new Set([...o.ids, ...e.map((e) => e.id)])],
				page: i,
				cursor: s,
				more: c,
				status: "ready"
			});
		} catch {
			a({
				...o,
				status: "error"
			});
		}
	}
	async fetchShowPage(e, t) {
		let n = Y(await this.api.podcasts.get(e, t)), r = fe(Y(n.podcast));
		if (!r) throw Error("missing show");
		let i = L(n, "episodes").map((e) => pe(e, r)).filter((e) => !!e);
		this.shows = {
			...this.shows,
			[e]: qe(this.shows[e], r)
		}, this.subscribed[e] && (this.subscribed = {
			...this.subscribed,
			[e]: qe(this.subscribed[e], r)
		}), this.remember(i);
		let a = Y(n.pagination);
		return {
			eps: i,
			totalPages: typeof a.total_pages == "number" && a.total_pages > 0 ? a.total_pages : t,
			hasNext: a.has_next === !0
		};
	}
	async loadShow(e, t = !1) {
		if (!this.api) return;
		let n = this.showEpisodes[e], r = this.epOrder[e] ?? "new";
		if (n?.status === "loading" || t && (!n || !n.hasNext)) return;
		let i = t && n ? n : {
			ids: [],
			page: 0,
			totalPages: n?.totalPages ?? 0,
			hasNext: !1,
			order: r,
			status: "loading"
		}, a = (t) => {
			this.showEpisodes = {
				...this.showEpisodes,
				[e]: t
			};
		};
		a({
			...i,
			status: "loading"
		});
		try {
			let n, o, s = i.totalPages, c;
			if (r === "new") {
				n = t ? i.page + 1 : 1;
				let r = await this.fetchShowPage(e, n);
				o = r.eps, s = r.totalPages, c = r.hasNext;
			} else s ||= (await this.fetchShowPage(e, 1)).totalPages, n = t ? i.page - 1 : s, o = (await this.fetchShowPage(e, n)).eps.slice().reverse(), c = n > 1;
			a({
				ids: [.../* @__PURE__ */ new Set([...i.ids, ...o.map((e) => e.id)])],
				page: n,
				totalPages: s,
				hasNext: c,
				order: r,
				status: "ready"
			});
		} catch {
			a({
				...i,
				status: "error"
			});
		}
	}
	nextInShow(e, t) {
		let n = this.showEpisodes[t]?.ids ?? [], r = n.indexOf(e);
		return r < 0 ? null : n.slice(r + 1).find((e) => !this.isDone(e)) ?? null;
	}
	setEpisodeOrder(e, t) {
		(this.epOrder[e] ?? "new") !== t && (this.epOrder = {
			...this.epOrder,
			[e]: t
		}, this.loadShow(e));
	}
	setShowPref(e, t, n) {
		this.showPrefs = {
			...this.showPrefs,
			[e]: {
				...this.showPrefsOf(e),
				[t]: n
			}
		}, t === "autoQueue" && n && this.loadNewEpisodes(), this.scheduleSave();
	}
	markShow(e, t) {
		let n = this.showEpisodes[e]?.ids ?? [], r = { ...this.played };
		for (let e of n) r[e] = t;
		this.played = r, t || (this.progress = Object.fromEntries(Object.entries(this.progress).filter(([e]) => !n.includes(e)))), this.say(t ? `Marked ${n.length} episodes as played` : `Marked ${n.length} episodes as unplayed`), this.scheduleSave();
	}
	queueUnplayed(e) {
		let t = this.episodes.filter((e) => !this.isDone(e.id) && e.id !== this.now).map((e) => e.id);
		if (!t.length) {
			this.say("No unplayed episodes here");
			return;
		}
		let [n, ...r] = t;
		this.upAuto = this.upAuto.filter((e) => !t.includes(e)), e ? (this.queue = [...r, ...this.queue.filter((e) => !t.includes(e))], this.play(n)) : this.queue = [...this.queue.filter((e) => !t.includes(e)), ...t], this.say(e ? `Playing ${t.length} unplayed episodes` : `${t.length} episodes added to Up next`), this.scheduleSave();
	}
	async loadPodcastBrowse(e = !1) {
		if (!(!this.api || this.podcastBrowse.status === "loading" || e && !this.podcastBrowse.cursor)) {
			this.podcastBrowse.status = "loading";
			try {
				let t = Y(await this.api.podcasts.list({
					sort: "last-episode",
					limit: 24,
					cursor: e ? this.podcastBrowse.cursor ?? void 0 : void 0
				})), n = L(t, "podcasts").map(fe).filter((e) => !!e);
				this.shows = {
					...this.shows,
					...Object.fromEntries(n.map((e) => [e.slug, qe(this.shows[e.slug], e)]))
				}, this.podcastBrowse = {
					slugs: [.../* @__PURE__ */ new Set([...e ? this.podcastBrowse.slugs : [], ...n.map((e) => e.slug)])],
					cursor: typeof t.next_cursor == "string" ? t.next_cursor : null,
					status: "ready"
				};
			} catch {
				this.podcastBrowse.status = "error";
			}
		}
	}
	get podcastGenres() {
		return !!this.api?.podcasts.genre;
	}
	get podGenreList() {
		return this.podGenreLists[this.podGenre] ?? {
			slugs: [],
			status: "idle"
		};
	}
	async loadPodcastGenre(e = this.podGenre) {
		let t = this.api, n = ge.find((t) => t.label === e);
		if (!t?.podcasts.genre || !n?.slugs.length || this.podGenreLists[e]?.status === "loading") return;
		let r = (t) => {
			this.podGenreLists = {
				...this.podGenreLists,
				[e]: t
			};
		}, i = this.podGenreLists[e]?.slugs ?? [];
		r({
			slugs: i,
			status: "loading"
		});
		let a = await Promise.all(n.slugs.map((e) => t.podcasts.genre(e).catch(() => null)));
		if (a.every((e) => e === null)) {
			r({
				slugs: i,
				status: "error"
			});
			return;
		}
		let o = a.flatMap((e) => L(e, "podcasts").map(fe).filter((e) => !!e));
		this.shows = {
			...this.shows,
			...Object.fromEntries(o.map((e) => [e.slug, qe(this.shows[e.slug], e)]))
		}, r({
			slugs: [...new Set(o.map((e) => e.slug))],
			status: "ready"
		});
	}
	async loadBookBrowse(e = !1) {
		if (!(!this.api || this.bookBrowse.status === "loading" || e && !this.bookBrowse.cursor)) {
			this.bookBrowse.status = "loading";
			try {
				let t = Y(await this.api.audiobooks.list({
					limit: 24,
					cursor: e ? this.bookBrowse.cursor ?? void 0 : void 0
				})), n = L(t, "audiobooks").map(de).filter((e) => !!e);
				this.remember(n), this.bookBrowse = {
					ids: [.../* @__PURE__ */ new Set([...e ? this.bookBrowse.ids : [], ...n.map((e) => e.id)])],
					cursor: typeof t.next_cursor == "string" ? t.next_cursor : null,
					status: "ready"
				};
			} catch {
				this.bookBrowse.status = "error";
			}
		}
	}
	async ensureBook(e) {
		let t = this.items[e], n = t?.type === "book" ? t.slug : e.startsWith("book:") ? e.slice(5) : "";
		if (!this.api || !n) return null;
		if (t?.type === "book" && t.loaded) return t;
		this.bookStatus = {
			...this.bookStatus,
			[e]: "loading"
		};
		try {
			let t = de(Y(Y(await this.api.audiobooks.get(n)).audiobook));
			if (!t) throw Error("missing book");
			return this.remember([t]), this.bookStatus = {
				...this.bookStatus,
				[e]: "ready"
			}, t;
		} catch {
			return this.bookStatus = {
				...this.bookStatus,
				[e]: "error"
			}, null;
		}
	}
	async loadNewEpisodes() {
		if (!this.api) return;
		let e = Object.keys(this.subscribed).slice(0, 12);
		if (!e.length) {
			this.newPool = {}, this.newStatus = "ready";
			return;
		}
		this.newStatus = "loading";
		let t = {};
		await Promise.all(e.map(async (e) => {
			try {
				let n = await this.fetchShowPage(e, 1);
				t[e] = n.eps.map((e) => e.id), !this.showEpisodes[e] && (this.epOrder[e] ?? "new") === "new" && (this.showEpisodes = {
					...this.showEpisodes,
					[e]: {
						ids: n.eps.map((e) => e.id),
						page: 1,
						totalPages: n.totalPages,
						hasNext: n.hasNext,
						order: "new",
						status: "ready"
					}
				});
			} catch {}
		})), this.newPool = Object.fromEntries(e.map((e) => [e, t[e] ?? this.newPool[e] ?? []])), this.newStatus = Object.keys(t).length ? "ready" : "error", this.newAt = Date.now(), this.suggestNewEpisode();
		let n = e.filter((e) => this.showPrefsOf(e).autoQueue).flatMap((e) => (t[e] ?? []).slice(0, 3)).filter((e) => !this.isDone(e) && !this.progressOf(e) && e !== this.now && !this.queue.includes(e) && !this.autoQueued.includes(e));
		if (n.length) {
			for (let e of n) this.queue = Ce(this.queue, this.upAuto, e);
			this.autoQueued = [...this.autoQueued, ...n].slice(-300), this.say(n.length === 1 ? "A new episode was added to Up next" : `${n.length} new episodes were added to Up next`), this.scheduleSave();
		}
	}
	async loadTranscript() {
		let e = this.item, t = this.transcriptKey;
		if (this.api && e && t && !this.transcripts[t]) {
			this.transcripts = {
				...this.transcripts,
				[t]: {
					state: "loading",
					lines: []
				}
			};
			try {
				let n, r = 0;
				if (e.type === "podcast") n = await this.api.podcasts.transcript(e.show, e.slug);
				else if (e.type === "book") {
					let t = e.chapters[this.chapIdx];
					r = t.start, n = await this.api.audiobooks.transcript(e.slug, t.section ?? this.chapIdx + 1);
				}
				let i = Y(n), a = O(i).map((e) => ({
					...e,
					t: e.t + r
				}));
				this.transcripts = {
					...this.transcripts,
					[t]: {
						state: typeof i.state == "string" ? i.state : "unavailable",
						lines: a
					}
				};
			} catch {
				this.transcripts = {
					...this.transcripts,
					[t]: {
						state: "error",
						lines: []
					}
				};
			}
		}
	}
	async refreshNowPlaying() {
		let e = this.item;
		if (this.api && e?.type === "radio" && this.playing) try {
			let t = Y(await this.api.stations.nowPlaying(e.stationId)), n = (e) => {
				let t = typeof e.title == "string" && e.title !== "Live broadcast" ? e.title : "", n = typeof e.artwork_url == "string" && e.artwork_url.startsWith("https://") ? e.artwork_url : void 0;
				return {
					title: t,
					artist: typeof e.artist == "string" ? e.artist : "",
					art: n,
					at: typeof e.played_at == "string" ? e.played_at : void 0
				};
			}, r = L(t, "recent").map(n).filter((e) => e.title), i = this.nowPlaying[e.stationId], a = {
				...n(t),
				recent: r
			};
			this.nowPlaying = {
				...this.nowPlaying,
				[e.stationId]: a
			}, this.publishSession(), (i?.title !== a.title || i?.art !== a.art) && this.mediaSession(!0);
		} catch {}
	}
	setQuery(e) {
		this.query = e, clearTimeout(this.searchTimer);
		let t = e.trim();
		if (t.length < 2 || !this.api) {
			this.search = {
				q: t,
				hits: [],
				status: "idle"
			}, this.stationHits = {
				ids: [],
				page: 0,
				more: !1,
				total: 0,
				status: "idle"
			};
			return;
		}
		this.search = {
			...this.search,
			q: t,
			status: "loading"
		};
		let n = ++this.searchSeq, r = !!this.api.stations.search && !!this.api.stations.browse;
		this.searchTimer = setTimeout(async () => {
			r && this.loadStationHits(t, !1, n);
			try {
				let e = L(await this.api.search(t, "all"), "results");
				if (n !== this.searchSeq) return;
				let i = e.flatMap((e) => {
					let t = e.type;
					return t !== "station" && t !== "podcast" && t !== "audiobook" || t === "station" && r ? [] : [{
						kind: t,
						id: String(e.id ?? ""),
						slug: String(e.slug ?? ""),
						title: String(e.title ?? ""),
						subtitle: String(e.subtitle ?? ""),
						art: typeof e.image_url == "string" && e.image_url ? e.image_url : void 0
					}];
				});
				this.search = {
					q: t,
					hits: i,
					status: "ready"
				};
			} catch {
				n === this.searchSeq && (this.search = {
					q: t,
					hits: [],
					status: "error"
				});
			}
		}, 300);
	}
	async loadStationHits(e = this.search.q, t = !1, n = this.searchSeq) {
		let r = this.api;
		if (!r || e.length < 2 || this.stationHits.status === "loading" && t) return;
		let i = t ? this.stationHits : {
			ids: [],
			page: 0,
			more: !1,
			total: 0,
			status: "idle"
		};
		if (!t || i.more) {
			this.stationHits = {
				...i,
				status: "loading"
			};
			try {
				let t = Y(await r.stations.search(e, 20, i.page + 1));
				if (n !== this.searchSeq) return;
				let a = L(t, "stations").map(v).filter((e) => !!e);
				this.remember(a), this.stationHits = {
					ids: [.../* @__PURE__ */ new Set([...i.ids, ...a.map((e) => e.id)])],
					page: i.page + 1,
					more: t.has_more === !0,
					total: typeof t.total == "number" ? t.total : 0,
					status: "ready"
				};
			} catch {
				n === this.searchSeq && (this.stationHits = {
					...i,
					status: "error"
				});
			}
		}
	}
	async openHit(e) {
		if (e.kind === "podcast") {
			this.openShow(e.slug);
			return;
		}
		if (e.kind === "audiobook") {
			this.openBook(`book:${e.slug}`);
			return;
		}
		let t = `st:${e.id}`;
		if (!this.items[t]) try {
			let t = v(Y(await this.api?.stations.get(e.id)));
			if (!t) {
				this.say("This station has no secure stream right now.");
				return;
			}
			this.remember([t]);
		} catch {
			this.say("This station is unavailable right now.");
			return;
		}
		this.play(t);
	}
	openShow(e) {
		this.showSlug !== e && (this.epFilter = "all", this.epQuery = "", this.showAbout = !1), this.showSlug = e, this.tab = "pod", this.query = "", this.search = {
			q: "",
			hits: [],
			status: "idle"
		}, this.showEpisodes[e]?.status === "ready" ? !this.show?.desc && this.api && this.fetchShowPage(e, 1).catch(() => void 0) : this.loadShow(e);
	}
	openBook(e) {
		this.bookId = e, this.tab = "book", this.query = "", this.search = {
			q: "",
			hits: [],
			status: "idle"
		}, this.ensureBook(e);
	}
	saveCurrent() {
		let e = this.item;
		e && e.type !== "radio" && (this.progress = Ee({
			...this.progress,
			[e.id]: {
				pos: Math.round(this.pos),
				dur: this.durOf(e.id),
				at: Date.now()
			}
		}, Nt));
	}
	async play(e) {
		if (e === this.now && this.item) {
			this.toggle();
			return;
		}
		let t = ++this.pendingPlay, n = this.items[e];
		if (!n) return;
		if (n.type === "book" && !n.loaded) {
			this.loadingItem = !0;
			let r = await this.ensureBook(e);
			if (this.loadingItem = !1, t !== this.pendingPlay) return;
			if (!r || !r.chapters.length) {
				this.say("This audiobook has no playable chapters yet.");
				return;
			}
			n = r;
		}
		this.saveCurrent(), this.now = e;
		let r = this.progress[e]?.pos ?? 0;
		if (this.pos = H(n) && n.dur && r >= n.dur - 5 ? 0 : r, n.type === "podcast" && this.pos < 1) {
			let e = this.showPrefsOf(n.show).intro;
			e && (!n.dur || e < n.dur - 30) && (this.pos = e);
		}
		this.queue = xe(this.queue, e), this.upAuto = this.upAuto.filter((t) => t !== e), this.speed = this.speedFor(e), n.type === "radio" && (this.recentStations = [e, ...this.recentStations.filter((t) => t !== e)].slice(0, 6)), wt[n.type].includes(this.rtab) || (this.rtab = wt[n.type][0]), this.history = Ie(this.history, e, Date.now()), this.playing = !0, this.sync(!0), n.type === "radio" && this.refreshNowPlaying(), this.rtab === "trans" && this.loadTranscript(), this.scheduleSave();
	}
	stop() {
		this.item && (this.playing = !1, this.pausedAt = Date.now(), this.sync());
	}
	async toggle() {
		let e = this.item;
		if (e) {
			if (!this.playing && e.type === "book" && !e.loaded) {
				this.loadingItem = !0;
				let t = await this.ensureBook(e.id);
				if (this.loadingItem = !1, !t?.chapters.length) {
					this.say("This audiobook is unavailable right now.");
					return;
				}
			}
			if (this.playing = !this.playing, !this.playing) this.saveCurrent(), this.pausedAt = Date.now();
			else if (H(e) && this.prefs.smartRewind && this.pausedAt) {
				let e = Re(Date.now() - this.pausedAt);
				e && this.pos > e && this.seekTo(this.pos - e);
			}
			this.sync(), this.scheduleSave();
		}
	}
	next() {
		this.saveCurrent(), this.queue.length ? this.play(this.queue[0]) : (this.playing = !1, this.sync());
	}
	previous() {
		let e = this.item;
		e && H(e) && this.seekTo(De(e.chapters, this.pos));
	}
	mediaKey(e) {
		let t = this.item;
		if (!t || !H(t) || !this.prefs.headsetSkip) {
			e === "next" ? this.next() : this.previous();
			return;
		}
		let n = Oe(e, this.pos, this.durOf(t.id), e === "next" ? this.prefs.fwd : this.prefs.back);
		n.kind === "next" ? this.next() : this.seekTo(n.to);
	}
	skip(e) {
		let t = this.item;
		if (!t || !H(t)) return;
		let n = this.durOf(t.id);
		this.seekTo(Math.max(0, n ? Math.min(n, this.pos + e) : this.pos + e));
	}
	seekTo(e) {
		let t = this.item;
		if (t && H(t)) {
			if (this.pos = e, t.type === "book") {
				let { index: n, offset: r } = we(t.chapters, e), i = t.chapters[n];
				i?.url && (this.fileIdx = n, this.engine.load(i.url, r));
			} else this.engine.seek(e);
			this.sync();
		}
	}
	seekFraction(e) {
		let t = this.item;
		if (!t || !H(t)) return;
		let n = this.durOf(t.id);
		n && this.seekTo(Math.round(Math.min(1, Math.max(0, e)) * n));
	}
	ended() {
		let e = this.item;
		if (!e) return;
		if (e.type !== "radio" && this.prefs.repeat === "one") {
			this.seekTo(0), this.playing = !0, this.sync();
			return;
		}
		if (e.type === "radio") {
			this.playing = !1, this.say("The station stopped broadcasting."), this.sync();
			return;
		}
		if (e.type === "book") {
			let t = e.chapters[this.fileIdx]?.url === this.engine.url ? this.fileIdx : ye(e.chapters, this.pos + 1), n = e.chapters[t + 1];
			if (n?.url) {
				this.pos = n.start, this.fileIdx = t + 1, this.sleep === "chapter" && (this.sleep = null, this.playing = !1, this.say("Sleep timer: paused at end of chapter")), this.engine.load(n.url, 0), this.sync(), this.rtab === "trans" && this.loadTranscript();
				return;
			}
		}
		if (this.sleep === "chapter") {
			this.sleep = null, this.playing = !1, this.sync();
			return;
		}
		if (this.played = {
			...this.played,
			[e.id]: !0
		}, this.pos = this.durOf(e.id) || this.pos, this.prefs.repeat === "all") {
			this.played = {
				...this.played,
				[e.id]: !1
			}, this.progress = {
				...this.progress,
				[e.id]: {
					pos: 0,
					dur: this.durOf(e.id),
					at: Date.now()
				}
			}, this.queue = [...this.queue.filter((t) => t !== e.id), e.id], this.next();
			return;
		}
		if (!this.prefs.continuous) {
			this.saveCurrent(), this.playing = !1, this.sync();
			return;
		}
		let t = !this.queue.length && e.type === "podcast" ? this.nextInShow(e.id, e.show) : null;
		t ? (this.saveCurrent(), this.play(t)) : this.next();
	}
	tick(e = 1) {
		if (!this.playing || this.buffering) return;
		let t = this.item;
		if (!t) return;
		let n;
		if (H(t) && this.engine.active) {
			let e = this.fitToAudio(t), r = e.type === "book" ? e.chapters[this.fileIdx]?.start ?? 0 : 0;
			n = this.engine.settled ? r + this.engine.time - this.pos : 0;
		}
		let r = H(t) ? this.durOf(t.id) || 2 ** 53 - 1 : 0, i = ke({
			pos: this.pos,
			speed: this.speed,
			sleep: this.sleep
		}, H(t) ? {
			dur: r,
			chapters: t.type === "book" ? [] : t.chapters
		} : null, e, n);
		if (this.pos = i.ended ? this.pos : i.pos, this.sleep = i.sleep, this.playing = i.playing, i.reason === "timer" && this.say("Sleep timer ended. Sweet dreams."), i.reason === "chapter" && this.say("Sleep timer: paused at end of chapter"), this.sync(), this.playing && (this.stats = Ne(this.stats, Me(/* @__PURE__ */ new Date()), t.type, e)), this.playing && t.type === "podcast") {
			let e = this.showPrefsOf(t.show).outro, n = this.durOf(t.id);
			if (e && n > e + 30 && this.pos >= n - e) {
				this.ended();
				return;
			}
		}
		Date.now() - this.lastSaved > 1e4 && (this.lastSaved = Date.now(), H(t) && this.saveCurrent(), this.scheduleSave());
	}
	fitToAudio(e) {
		let t = this.engine.settled ? this.engine.duration : 0;
		if (!t) return e;
		let n = e;
		if (e.type === "podcast") Math.abs(t - (e.dur || 0)) >= 2 && (n = {
			...e,
			dur: Math.round(t)
		});
		else if (e.chapters[this.fileIdx]?.url === this.engine.url) {
			let { chapters: r, delta: i } = Te(e.chapters, this.fileIdx, t);
			i && (n = {
				...e,
				chapters: r,
				dur: e.dur ? Math.max(0, e.dur + i) : e.dur
			});
		}
		return n !== e && (this.items = {
			...this.items,
			[e.id]: n
		}), n;
	}
	playNext(e) {
		this.queue = be(this.queue, e), this.upAuto = this.upAuto.filter((t) => t !== e), this.say(`Playing next: ${this.items[e]?.title ?? ""}`), this.scheduleSave();
	}
	addToQueue(e) {
		this.queue = Ce(this.queue, this.upAuto, e), this.upAuto = this.upAuto.filter((t) => t !== e), this.say("Added to queue"), this.scheduleSave();
	}
	removeFromQueue(e) {
		this.queue = xe(this.queue, e), this.upAuto = this.upAuto.filter((t) => t !== e), this.scheduleSave();
	}
	playFrom(e, t, n) {
		if (e === this.now && this.item) {
			this.play(e);
			return;
		}
		if (this.prefs.autoFill && this.items[e]?.type === "podcast") {
			let r = Se(this.queue, this.upAuto, t.filter((e) => this.items[e]), e, (e) => this.isDone(e));
			this.queue = r.queue, this.upAuto = r.auto, this.upFrom = r.auto.length ? n : "";
		}
		this.play(e);
	}
	togglePlayed(e) {
		let t = this.isDone(e);
		this.played = {
			...this.played,
			[e]: !t
		}, t && (this.progress = Object.fromEntries(Object.entries(this.progress).filter(([t]) => t !== e))), this.say(t ? "Marked as unplayed" : "Marked as played"), this.scheduleSave();
	}
	toggleSubscribe(e) {
		let t = this.shows[e] ?? this.subscribed[e];
		if (!t) return;
		let n = !!this.subscribed[e], r = { ...this.subscribed };
		n ? delete r[e] : r[e] = t, this.subscribed = r, this.addedAt = n ? Object.fromEntries(Object.entries(this.addedAt).filter(([t]) => t !== `show:${e}`)) : {
			...this.addedAt,
			[`show:${e}`]: Date.now()
		}, this.say(n ? `Unsubscribed from ${t.title}` : "Subscribed. New episodes land in Listen now"), this.scheduleSave(), this.loadNewEpisodes();
	}
	togglePop(e) {
		if (e === "speed" && this.live) {
			this.say("Speed is fixed for live radio");
			return;
		}
		this.pop = this.pop === e ? null : e;
	}
	setSpeed(e) {
		this.speed = e;
		let t = this.item;
		t && !this.live && (this.speeds = {
			...this.speeds,
			[T(t)]: e
		}), this.sync(), this.scheduleSave();
	}
	setSleepMinutes(e) {
		this.sleep = e * 60, this.pop = null, this.say(`Sleep timer set for ${e} minutes`), this.sync();
	}
	sleepAtEnd(e = /* @__PURE__ */ new Date()) {
		if (this.pop = null, this.live) {
			let t = 3600 - (e.getMinutes() * 60 + e.getSeconds());
			this.sleep = t, this.say(`Will pause when this show ends, in ${Math.ceil(t / 60)} min`);
		} else this.sleep = "chapter", this.say(this.chapters.length > 1 ? "Will pause at the end of this chapter" : "Will pause at the end of this episode");
		this.sync();
	}
	sleepOff() {
		this.sleep = null, this.pop = null, this.sync();
	}
	setVolume(e) {
		this.volume = Math.min(1, Math.max(0, e)), this.muted = !1, this.sync(), this.scheduleSave();
	}
	toggleMute() {
		this.muted = !this.muted, this.sync();
	}
	async clip() {
		let e = this.item;
		if (!e) return;
		let t = this.host.documents;
		if (!t?.version) {
			this.say("Update Tend to save clips to Notes");
			return;
		}
		let n = H(e), r = n ? this.pos : 0, i = Math.max(0, r - 30), a = this.transcript?.lines ?? [], o = n ? a.filter((e, t) => e.t <= r && (a[t + 1]?.t ?? Infinity) > i) : [], s = e.type === "radio" ? this.songOf(e.stationId) : "", c = /* @__PURE__ */ new Date(), l = e.type === "radio" && s || e.title, u = [
			`# ${l}`,
			"",
			`- **Source:** ${e.type === "radio" ? `${e.title} (live radio)` : e.sub}`,
			n ? `- **Clip:** ${W(i)}–${W(r)}` : `- **Heard at:** ${c.toLocaleString()}`,
			"- **Saved from:** Tend Player",
			"",
			...o.length ? [
				"## Transcript",
				"",
				...o.map((e) => `> ${e.who ? `**${e.who}:** ` : ""}${e.text}`),
				""
			] : []
		].join("\n");
		try {
			let n = (await t.libraries()).find((e) => e.canCreate !== !1);
			if (!n) {
				this.say("Set up a notebook in Tend Notes to save clips");
				return;
			}
			let a = c.toISOString().slice(0, 16).replace("T", " ").replace(":", "."), o = l.replace(/[\\/:*?"<>|#]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 80) || "Clip";
			await t.create({
				libraryId: n.id,
				name: `Clip ${a} ${o}.md`,
				content: u
			}), this.say(e.type === "radio" ? `Clipped “${l}” to Tend Notes` : `Clip ${W(i)}–${W(r)} saved to Tend Notes`);
		} catch {
			this.say("Install Tend Notes to save clips");
		}
	}
	bookmark(e = this.bookId ?? "") {
		let t = this.items[e], n = t?.type === "book" ? t : null;
		if (!n) return;
		let r = this.progressOf(n.id), i = ye(n.chapters, r), a = i >= 0 ? `Chapter ${M(i)} · ${W(r - n.chapters[i].start)}` : W(r);
		this.bookmarks = {
			...this.bookmarks,
			[n.id]: [{
				pos: Math.round(r),
				at: Date.now(),
				label: a
			}, ...this.bookmarks[n.id] ?? []].slice(0, 50)
		}, this.say(`Bookmark saved at ${a}`), this.scheduleSave();
	}
	setBookmarkNote(e, t, n) {
		this.bookmarks = {
			...this.bookmarks,
			[e]: (this.bookmarks[e] ?? []).map((e) => e.at === t ? {
				...e,
				note: n.trim().slice(0, 500) || void 0
			} : e)
		}, this.scheduleSave();
	}
	markBook(e, t) {
		this.played = {
			...this.played,
			[e]: t
		}, t && this.now === e && (this.playing = !1, this.sync()), this.say(t ? "Marked as finished" : "Marked as not finished"), this.scheduleSave();
	}
	async restartBook(e) {
		this.played = {
			...this.played,
			[e]: !1
		}, this.progress = {
			...this.progress,
			[e]: {
				pos: 0,
				dur: this.durOf(e),
				at: Date.now()
			}
		}, this.now === e ? this.seekTo(0) : await this.play(e), this.say("Starting from the beginning"), this.scheduleSave();
	}
	removeBookmark(e, t) {
		this.bookmarks = {
			...this.bookmarks,
			[e]: (this.bookmarks[e] ?? []).filter((e) => e.at !== t)
		}, this.scheduleSave();
	}
	async jumpTo(e, t) {
		this.now === e ? this.seekTo(t) : (this.progress = {
			...this.progress,
			[e]: {
				pos: t,
				dur: this.durOf(e),
				at: Date.now()
			}
		}, await this.play(e));
	}
	say(e) {
		clearTimeout(this.toastTimer), this.toast = e, this.toastTimer = setTimeout(() => this.toast = null, 2600);
	}
	sync(e = !1) {
		let t = this.item;
		if (t) {
			if (e || this.loadedId !== t.id) {
				if (this.loadedId = t.id, t.type === "radio") this.engine.load(t.url, 0, !0);
				else if (t.type === "podcast") this.engine.load(t.url, this.pos);
				else {
					let { index: e, offset: n } = we(t.chapters, this.pos), r = t.chapters[e];
					r?.url ? (this.fileIdx = e, this.engine.load(r.url, n)) : this.loadedId = null;
				}
			}
			this.engine.apply({
				playing: this.playing,
				rate: this.live ? 1 : this.speed,
				volume: this.muted ? 0 : this.volume * je(this.sleep) * (this.ducked ? .2 : 1)
			}), this.mediaSession(e), this.publishSession();
		}
	}
	sessionRecord() {
		let e = this.item;
		if (!e) return null;
		let t = this.loadingItem || this.playing && this.buffering ? "loading" : this.playing ? "playing" : "paused", n = (e) => e && e.startsWith("https://") ? e : null;
		if (e.type === "radio") {
			let r = this.nowPlaying[e.stationId];
			return {
				kind: "radio",
				source: e.title,
				title: r?.title || "",
				subtitle: r?.title ? r.artist || "" : e.genre || "",
				artwork: n(r?.art) ?? n(e.art),
				fallbackArtwork: n(e.art),
				status: t,
				live: !0,
				progress: null
			};
		}
		let r = this.durOf(e.id), i = r ? Math.min(1, Math.max(0, this.pos / r)) : null;
		if (e.type === "podcast") {
			let r = this.shows[e.show] ?? this.subscribed[e.show];
			return {
				kind: "podcast",
				source: e.sub || r?.title || "",
				title: e.title,
				subtitle: "",
				artwork: n(e.art) ?? n(r?.art),
				fallbackArtwork: n(r?.art),
				status: t,
				live: !1,
				progress: i
			};
		}
		let a = e.chapters[this.chapIdx];
		return {
			kind: "book",
			source: e.title,
			title: a?.title || e.sub,
			subtitle: a ? e.sub : "",
			artwork: n(e.art),
			fallbackArtwork: null,
			status: t,
			live: !1,
			progress: i
		};
	}
	publishSession() {
		let e = this.host.mediaSession;
		if (!e || this.host.widget || !this.sessionOff) return;
		let t = this.sessionRecord(), n = t ? JSON.stringify({
			...t,
			progress: t.progress === null ? null : Math.round(t.progress * 100)
		}) : "";
		if (n !== this.sessionKey) {
			this.sessionKey = n;
			try {
				e.set(t);
			} catch {}
		}
	}
	sproutPort() {
		return {
			api: this.api,
			now: () => Date.now(),
			followed: () => Object.keys(this.subscribed).length,
			pool: () => ({
				status: this.newStatus,
				at: this.newAt
			}),
			refreshPool: () => this.loadNewEpisodes(),
			fresh: (e) => Je(this.newPool, (e) => {
				let t = this.items[e];
				return t?.type === "podcast" ? t.date : "";
			}, (e) => this.isDone(e) || this.progressOf(e) > 5, this.now, 3, e).map((e) => this.items[e]).filter((e) => e?.type === "podcast"),
			started: (e) => this.isDone(e) || this.progressOf(e) > 5,
			item: (e) => this.items[e],
			remember: (e) => this.remember(e),
			current: () => {
				let e = this.item;
				return e ? {
					id: e.id,
					kind: e.type === "radio" ? "radio" : e.type === "book" ? "book" : "podcast",
					title: e.title,
					source: e.sub,
					playing: this.playing
				} : null;
			},
			playItem: async (e, t) => ({
				ok: await this.command({
					type: "play-item",
					id: e,
					list: t,
					from: "your new episodes"
				}) === !0,
				queued: t ? this.upAuto.length : 0
			}),
			playShow: async (e) => ({
				ok: await this.playFromShow(e, this.shows[e]?.title ?? e, "", "podcast"),
				queued: this.upAuto.length
			}),
			toggle: () => this.toggle(),
			stop: () => this.stop(),
			next: () => this.next(),
			previous: () => this.previous(),
			resumeLast: () => this.playMediaFor("", "any")
		};
	}
	async command(e) {
		let t = (e) => typeof e == "string" ? e : "";
		switch (e.type) {
			case "toggle": return this.item ? (this.item.type === "radio" && this.playing ? this.stop() : await this.toggle(), !0) : !1;
			case "next": return this.next(), !0;
			case "previous": return this.previous(), !0;
			case "duck": return this.ducked = e.active === !0, this.sync(), !0;
			case "play-radio": return this.playRadioFor(t(e.query));
			case "play-media": return this.playMediaFor(t(e.query), t(e.kind) || "any");
			case "play-item": {
				let n = t(e.id);
				if (!this.items[n] && n.startsWith("book:") && await this.ensureBook(n), !this.items[n]) return !1;
				let r = Array.isArray(e.list) ? e.list.filter((e) => typeof e == "string") : null;
				return r?.length && this.items[n].type === "podcast" ? this.playFrom(n, r, t(e.from) || "your list") : await this.ensurePlaying(n), !0;
			}
			case "play-episode": return this.playShowEpisode(t(e.show), t(e.id), Array.isArray(e.list) ? e.list.filter((e) => typeof e == "string") : null);
			default: return;
		}
	}
	async ensurePlaying(e) {
		if (e === this.now && this.item) {
			this.playing || await this.toggle();
			return;
		}
		await this.play(e);
	}
	async playShowEpisode(e, t, n = null) {
		if (!this.items[t] && e && this.api) try {
			await this.fetchShowPage(e, 1);
		} catch {
			return !1;
		}
		if (this.items[t]?.type !== "podcast") return !1;
		let r = (n ?? []).filter((e) => this.items[e]?.type === "podcast"), i = r.length > 1 ? r : this.newEpisodes.includes(t) ? this.newEpisodes : [t];
		return this.playFrom(t, i, i.length > 1 ? "your new episodes" : this.items[t].sub), !0;
	}
	async playRadioFor(e) {
		let t = this.api;
		if (!t) return !1;
		let n = e.trim();
		if (!n) {
			if (this.item?.type === "radio") return await this.ensurePlaying(this.item.id), !0;
			this.trending.length || await this.loadRadio();
			let e = [
				...this.recentStations,
				...Object.keys(this.favorites),
				...this.trending
			].find((e) => this.items[e]?.type === "radio");
			return e ? (await this.ensurePlaying(e), !0) : !1;
		}
		let r = Ze(n);
		if (r.local && this.nearbySupported) {
			(this.near.status !== "ready" || !this.near.ids.length) && await this.loadNearby();
			let e = this.nearestStation(r.rest.toLowerCase().split(" ").filter((e) => e.length > 1));
			if (e) return await this.ensurePlaying(e.id), !0;
			if (!r.rest) return !1;
		}
		for (let e of ze(r.local && r.rest ? r.rest : n)) try {
			let n = L(await t.stations.search(e, 20, 1), "stations").map(v).filter((e) => !!e);
			if (n.length) return this.remember(n), await this.ensurePlaying(n[0].id), !0;
		} catch {}
		let i = n.toLowerCase(), a = [...Object.values(this.favorites), ...this.recentStations.map((e) => this.items[e])].find((e) => e?.type === "radio" && [
			e.title,
			e.sub,
			e.genre
		].join(" ").toLowerCase().includes(i));
		return a ? (await this.ensurePlaying(a.id), !0) : !1;
	}
	async playMediaFor(e, t) {
		let n = this.api;
		if (!n) return !1;
		if (t === "radio") return this.playRadioFor(e);
		let r = e.trim();
		if (!r) {
			if (this.item) return await this.ensurePlaying(this.item.id), !0;
			let e = this.continueIds[0] ?? this.history[0]?.id;
			return !e || !this.items[e] ? !1 : (await this.ensurePlaying(e), !0);
		}
		let i = t === "any" || t === "podcast" || t === "episode", a = t === "any" || t === "audiobook", o = i ? Object.values(this.subscribed).find((e) => Ue(e.title, r)) : void 0;
		if (o) return this.playFromShow(o.slug, o.title, r, t);
		let s = a ? this.libraryBooks.find((e) => Ue(e.title, r)) : void 0;
		if (s) return await this.ensurePlaying(s.id), !0;
		let c = t === "audiobook" ? "audiobooks" : i && t !== "any" ? "podcasts" : "all", l = [];
		for (let e of Ge(r)) {
			try {
				l = L(await n.search(e, c), "results");
			} catch {
				return !1;
			}
			if (l = l.filter((e) => e.type === "podcast" ? i : e.type === "audiobook" ? a : t === "any"), l.length) break;
		}
		l = l.map((e, t) => ({
			h: e,
			i: t,
			s: Ke(String(e.title ?? ""), r)
		})).sort((e, t) => t.s - e.s || e.i - t.i).map((e) => e.h);
		for (let e of l) {
			let o = typeof e.slug == "string" ? e.slug : "", s = typeof e.title == "string" ? e.title : "";
			if (e.type === "podcast" && i && o) return this.playFromShow(o, s, r, t);
			if (e.type === "audiobook" && a && o) {
				let e = await this.ensureBook(`book:${o}`);
				if (!e?.chapters.length) continue;
				return await this.ensurePlaying(e.id), !0;
			}
			if (e.type === "station" && t === "any" && typeof e.id == "string") try {
				let t = v(Y(await n.stations.get(e.id)));
				if (!t) continue;
				return this.remember([t]), await this.ensurePlaying(t.id), !0;
			} catch {
				continue;
			}
		}
		return !1;
	}
	async playFromShow(e, t, n, r) {
		let i;
		try {
			i = (await this.fetchShowPage(e, 1)).eps;
		} catch {
			return !1;
		}
		if (!i.length) return !1;
		let a = We(i, n, t);
		if (r === "episode" && !a) return !1;
		let o = a ?? i[0];
		return this.playFrom(o.id, i.map((e) => e.id), this.shows[e]?.title || t), !0;
	}
	lastSuggested = 0;
	suggestNewEpisode() {
		let e = this.host.mediaSession?.suggest;
		if (!e || this.host.widget || Date.now() - this.lastSuggested < 9e5) return;
		let t = Date.now() - 2592e5, n = this.newEpisodes.find((e) => {
			let n = this.items[e];
			return n?.type === "podcast" && e !== this.now && !this.isDone(e) && !this.progressOf(e) && !this.suggested.includes(e) && Date.parse(n.date || "") > t;
		}), r = n ? this.items[n] : null;
		if (!n || r?.type !== "podcast") return;
		let i = this.subscribed[r.show] ?? this.shows[r.show];
		try {
			e.call(this.host.mediaSession, {
				kind: "new-episode",
				id: n,
				group: r.show,
				source: i?.title || r.sub,
				title: r.title,
				artwork: r.art?.startsWith("https://") ? r.art : null,
				command: {
					type: "play-episode",
					show: r.show,
					id: n
				}
			}) && (this.lastSuggested = Date.now(), this.suggested = [n, ...this.suggested].slice(0, 200), this.scheduleSave());
		} catch {}
	}
	mediaSession(e) {
		let t = typeof navigator < "u" ? navigator.mediaSession : void 0;
		if (!t || typeof MediaMetadata > "u" || (t.playbackState = this.playing ? "playing" : "paused", !e && t.metadata)) return;
		let n = this.item;
		if (!n) return;
		let r = n.type === "radio" ? this.nowPlaying[n.stationId] : void 0, i = r?.art || n.art;
		t.metadata = new MediaMetadata({
			title: r?.title || n.title,
			artist: r?.title ? [r.artist, n.title].filter(Boolean).join(" · ") : n.sub,
			album: `Tend Player · ${se[n.type]}`,
			artwork: i ? [{ src: i }] : []
		});
		let a = (e, n) => {
			try {
				t.setActionHandler(e, n);
			} catch {}
		};
		a("play", () => {
			this.playing = !0, this.sync();
		}), a("pause", () => {
			this.playing = !1, this.sync();
		}), a("seekbackward", n.type === "radio" ? null : () => this.skip(-this.prefs.back)), a("seekforward", n.type === "radio" ? null : () => this.skip(this.prefs.fwd)), a("nexttrack", () => this.mediaKey("next")), a("previoustrack", n.type === "radio" ? null : () => this.mediaKey("previous"));
	}
	scheduleSave() {
		this.restored && (clearTimeout(this.saveTimer), this.saveTimer = setTimeout(() => {
			this.saveTimer = void 0, this.persist();
		}, 1500));
	}
	snapshot() {
		let e = /* @__PURE__ */ new Set([
			...this.queue,
			...Object.keys(this.progress),
			...this.recentStations,
			...this.history.map((e) => e.id),
			...this.playlists.flatMap((e) => e.ids),
			...this.now ? [this.now] : []
		]), t = {};
		for (let n of e) {
			let e = this.items[n];
			e && (t[n] = e.type === "book" ? {
				...e,
				chapters: [],
				loaded: !1,
				desc: void 0
			} : e.type === "podcast" ? {
				...e,
				desc: void 0
			} : e);
		}
		return {
			v: 1,
			now: this.now,
			pos: Math.round(this.pos),
			queue: this.queue,
			speeds: this.speeds,
			volume: this.volume,
			progress: this.progress,
			played: this.played,
			subscribed: this.subscribed,
			bookmarks: this.bookmarks,
			recentStations: this.recentStations,
			items: t,
			favorites: this.favorites,
			saved: this.saved,
			addedAt: this.addedAt,
			history: this.history,
			stats: this.stats,
			prefs: this.prefs,
			showPrefs: this.showPrefs,
			autoQueued: this.autoQueued,
			playlists: this.playlists,
			upAuto: this.upAuto,
			upFrom: this.upFrom,
			podGenre: this.podGenre,
			suggested: this.suggested
		};
	}
	async persist() {
		if (!this.restored) return;
		let e = JSON.parse(JSON.stringify({
			...this.snapshot(),
			savedAt: Date.now()
		}));
		try {
			localStorage.setItem(this.localKey, JSON.stringify(e));
		} catch {}
		try {
			this.host.storage && await this.host.storage.set(this.storageKey, e);
		} catch {}
	}
	readLocal() {
		try {
			return B(JSON.parse(localStorage.getItem(this.localKey) ?? "null"));
		} catch {
			return null;
		}
	}
	async restore() {
		let e = null, t = !0;
		if (this.host.storage) try {
			e = B(await this.host.storage.get(this.storageKey)) ?? B(await this.host.storage.get(this.legacyKey));
		} catch {
			t = !1;
		}
		let n = this.readLocal(), r = e && n ? (n.savedAt ?? 0) > (e.savedAt ?? 0) ? n : e : e ?? n;
		if (!t && !r) {
			this.storageError || this.say("Could not load your library yet. Changes are not saved until it loads."), this.storageError = !0, this.restoreTries++ < 6 ? setTimeout(() => void this.restore(), 5e3 * this.restoreTries) : this.say("Your library could not be loaded. Reopen Tend Player to try again.");
			return;
		}
		this.storageError = !1, r && this.apply(r), this.restored = !0, r && (r !== e || !e?.savedAt) && this.persist();
	}
	apply(e) {
		this.items = {
			...e.items,
			...this.items
		}, this.progress = e.progress ?? {}, this.played = e.played ?? {}, this.subscribed = e.subscribed ?? {}, this.bookmarks = e.bookmarks ?? {}, this.speeds = e.speeds ?? {}, this.recentStations = (e.recentStations ?? []).filter((e) => this.items[e]), this.queue = (e.queue ?? []).filter((e) => this.items[e]), this.volume = typeof e.volume == "number" ? e.volume : .8, this.favorites = e.favorites ?? {}, this.saved = e.saved ?? {}, this.items = {
			...this.favorites,
			...this.saved,
			...this.items
		}, this.history = (e.history ?? []).filter((e) => this.items[e.id]), this.stats = e.stats ?? {}, this.addedAt = e.addedAt ?? {}, this.showPrefs = e.showPrefs ?? {}, this.autoQueued = e.autoQueued ?? [], this.playlists = e.playlists ?? [], this.upAuto = (e.upAuto ?? []).filter((e) => this.queue.includes(e)), this.upFrom = this.upAuto.length ? e.upFrom ?? "" : "", this.suggested = Array.isArray(e.suggested) ? e.suggested.filter((e) => typeof e == "string").slice(0, 200) : [], e.podGenre && ge.some((t) => t.label === e.podGenre) && (this.podGenre = e.podGenre), this.prefs = {
			...Tt,
			...e.prefs ?? {}
		}, e.now && this.items[e.now] && !this.now && (this.now = e.now, this.pos = e.pos ?? 0, this.speed = this.speedFor(e.now));
		let t = this.item;
		t?.type === "book" && this.ensureBook(t.id), Object.keys(this.subscribed).length && this.loadNewEpisodes();
	}
}, Ft = l("<header class=\"bar svelte-1h259us\"><span class=\"by svelte-1h259us\">Powered by OndaCast</span> <div class=\"spacer svelte-1h259us\"></div> <label class=\"search svelte-1h259us\"><!> <input type=\"search\" placeholder=\"Search stations, shows, books\" aria-label=\"Search stations, shows and books\" class=\"svelte-1h259us\"/></label> <button class=\"gear svelte-1h259us\" data-pop=\"\" aria-haspopup=\"dialog\" aria-label=\"Playback preferences\" title=\"Playback preferences\"><!></button></header>"), It = {
	hash: "svelte-1h259us",
	code: ".bar.svelte-1h259us {height:36px;flex:none;display:flex;align-items:center;gap:10px;padding:0 14px;background:var(--tm-panel-surface);border-bottom:1px solid var(--tm-fg-6);}.by.svelte-1h259us {font-size:11px;color:var(--tm-muted);}.spacer.svelte-1h259us {flex:1;}.gear.svelte-1h259us {width:26px;height:26px;border:0;border-radius:7px;background:none;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;}.gear.svelte-1h259us:hover, .gear[aria-expanded='true'].svelte-1h259us {background:var(--tm-fg-8);color:var(--tm-fg);}.search.svelte-1h259us {display:flex;align-items:center;gap:8px;height:24px;padding:0 10px;border-radius:7px;background:var(--tm-fg-6);width:220px;box-sizing:border-box;color:var(--tm-muted);}.search.svelte-1h259us:focus-within {box-shadow:0 0 0 1px var(--tm-accent);}input.svelte-1h259us {flex:1;min-width:0;border:0;background:none;outline:none;color:var(--tm-fg);font:inherit;font-size:11.5px;padding:0;}input.svelte-1h259us::placeholder {color:var(--tm-muted);opacity:1;}input.svelte-1h259us::-webkit-search-cancel-button {display:none;}"
};
function Lt(e, n) {
	j(n, !0), _(e, It);
	var r = Ft(), i = V(G(r), 4), a = G(i);
	$(a, {
		get d() {
			return Q.search;
		},
		size: 13,
		stroke: 2
	});
	var o = V(a, 2);
	oe(o), R(i);
	var s = V(i, 2), c = G(s);
	$(c, {
		get d() {
			return Q.gear;
		},
		size: 15,
		stroke: 1.6
	}), R(s), R(r), J(() => {
		f(o, n.store.query), t(s, "aria-expanded", n.store.pop === "prefs");
	}), w("input", o, (e) => n.store.setQuery(e.currentTarget.value)), w("keydown", o, (e) => {
		e.key === "Escape" && n.store.setQuery("");
	}), w("click", s, () => n.store.togglePop("prefs")), u(e, r), A();
}
C([
	"input",
	"keydown",
	"click"
]);
//#endregion
//#region src/components/Sidebar.svelte
var Rt = l("<span class=\"count svelte-181dlmc\"> </span>"), zt = l("<button><!><span class=\"label svelte-181dlmc\"> </span> <!></button>"), Bt = l("<span class=\"eq svelte-181dlmc\" aria-hidden=\"true\"><i class=\"svelte-181dlmc\"></i><i class=\"svelte-181dlmc\"></i><i class=\"svelte-181dlmc\"></i></span>"), Vt = l("<button><!> <span class=\"title svelte-181dlmc\"> </span> <!></button>"), Ht = l("<div class=\"heading svelte-181dlmc\">Favorite stations</div> <!>", 1), Ut = l("<nav class=\"side svelte-181dlmc\" aria-label=\"Tend Player\"><!> <!> <div class=\"spacer svelte-181dlmc\"></div> <button class=\"keys svelte-181dlmc\"><!>Keyboard shortcuts<kbd class=\"svelte-181dlmc\">?</kbd></button></nav>"), Wt = {
	hash: "svelte-181dlmc",
	code: ".side.svelte-181dlmc {width:188px;flex:none;padding:18px 12px;display:flex;flex-direction:column;gap:2px;border-right:1px solid var(--tm-fg-6);box-sizing:border-box;overflow:auto;}.tab.svelte-181dlmc {display:flex;align-items:center;gap:11px;height:36px;flex:none;padding:0 10px;border:0;border-radius:9px;background:transparent;color:var(--tm-fg);font-size:13px;font-weight:500;cursor:pointer;text-align:left;}.tab.svelte-181dlmc:hover {background:var(--tm-fg-6);}.tab.on.svelte-181dlmc {background:var(--tm-accent-12);color:var(--tm-accent);}.heading.svelte-181dlmc {margin:22px 10px 8px;font-size:10.5px;letter-spacing:1px;text-transform:uppercase;color:var(--tm-muted);}.show.svelte-181dlmc {display:flex;align-items:center;gap:10px;padding:6px 10px;font-size:12.5px;color:var(--tm-fg);border:0;border-radius:8px;background:none;cursor:pointer;text-align:left;}.show.svelte-181dlmc:hover {background:var(--tm-fg-4);}.show.on.svelte-181dlmc {background:var(--tm-fg-6);}.title.svelte-181dlmc {flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.label.svelte-181dlmc {flex:1;}.count.svelte-181dlmc {font-size:10px;font-weight:700;min-width:18px;height:18px;padding:0 5px;border-radius:9px;display:grid;place-items:center;background:var(--tm-accent);color:var(--tm-on-accent);}.eq.svelte-181dlmc {display:flex;align-items:flex-end;gap:2px;height:12px;flex:none;}.eq.svelte-181dlmc i:where(.svelte-181dlmc) {width:3px;background:var(--tm-accent);border-radius:1px; animation: svelte-181dlmc-eq 1s ease-in-out infinite;}.eq.svelte-181dlmc i:where(.svelte-181dlmc):nth-child(2) {animation-delay:-.3s;}.eq.svelte-181dlmc i:where(.svelte-181dlmc):nth-child(3) {animation-delay:-.6s;}\n  @keyframes svelte-181dlmc-eq { 0%, 100% { height: 4px; } 50% { height: 12px; } }\n  @media (prefers-reduced-motion: reduce) {.eq.svelte-181dlmc i:where(.svelte-181dlmc) { animation: none;height:8px;} }.keys.svelte-181dlmc {display:flex;align-items:center;gap:8px;padding:8px 10px;border:0;border-radius:9px;background:none;color:var(--tm-muted);font-size:11.5px;cursor:pointer;text-align:left;}.keys.svelte-181dlmc:hover {background:var(--tm-fg-6);color:var(--tm-fg);}kbd.svelte-181dlmc {margin-left:auto;font:600 10px ui-monospace, Menlo, monospace;padding:1px 6px;border-radius:4px;border:1px solid var(--tm-fg-16);}.spacer.svelte-181dlmc {flex:1;min-height:12px;}"
};
function Gt(r, i) {
	j(i, !0), _(r, Wt);
	let a = Z(i, "store", 7), o = [
		[
			"home",
			"Listen now",
			Q.home
		],
		[
			"mine",
			"My Media",
			Q.library
		],
		[
			"radio",
			"Radio",
			Q.radio
		],
		[
			"pod",
			"Podcasts",
			Q.podcast
		],
		[
			"book",
			"Audiobooks",
			Q.book
		]
	], l = X(() => Object.values(a().favorites).sort((e, t) => a().lastPlayed(t.id) - a().lastPlayed(e.id)).slice(0, 6)), d = X(() => Object.keys(a().subscribed).reduce((e, t) => e + a().newCount(t), 0));
	var f = Ut(), p = G(f);
	n(p, 17, () => o, x, (n, r) => {
		var i = X(() => re(e(r), 3));
		let o = () => e(i)[0], l = () => e(i)[1], f = () => e(i)[2];
		var p = zt();
		let m;
		var h = G(p);
		$(h, {
			get d() {
				return f();
			},
			size: 17,
			stroke: 1.7
		});
		var g = V(h), _ = D(g, !0), v = V(g, 2), y = (n) => {
			var r = Rt(), i = D(r, !0);
			J(() => {
				t(r, "aria-label", `${e(d) ?? ""} new episodes`), S(i, e(d));
			}), u(n, r);
		};
		s(v, (t) => {
			o() === "mine" && e(d) && t(y);
		}), R(p), J(() => {
			m = c(p, 1, "tab svelte-181dlmc", null, m, { on: a().tab === o() && !a().query }), t(p, "aria-current", a().tab === o() && !a().query ? "page" : void 0), S(_, l());
		}), w("click", p, () => {
			a().tab = o(), a().setQuery(""), o() === "pod" && (a().showSlug = null), o() === "book" && (a().bookId = null);
		}), u(n, p);
	});
	var m = V(p, 2), h = (r) => {
		var i = Ht(), o = V(F(i), 2);
		n(o, 17, () => e(l), (e) => e.id, (n, r) => {
			let i = X(() => a().isPlaying(e(r).id));
			var o = Vt();
			let l;
			var d = G(o);
			q(d, {
				get hue() {
					return e(r).hue;
				},
				get art() {
					return e(r).art;
				},
				size: 26,
				radius: 6,
				font: 9,
				get mark() {
					return e(r).mark;
				}
			});
			var f = V(d, 2), p = D(f, !0), m = V(f, 2), h = (e) => {
				var t = Bt();
				u(e, t);
			};
			s(m, (t) => {
				e(i) && t(h);
			}), R(o), J(() => {
				l = c(o, 1, "show svelte-181dlmc", null, l, { on: e(r).id === a().now }), t(o, "aria-label", `${e(i) ? "Stop" : "Play"} ${e(r).title ?? ""}`), S(p, e(r).title);
			}), w("click", o, () => e(i) ? a().stop() : a().play(e(r).id)), u(n, o);
		}), u(r, i);
	};
	s(m, (t) => {
		e(l).length && t(h);
	});
	var g = V(m, 4), v = G(g);
	$(v, {
		get d() {
			return Q.keyboard;
		},
		size: 14,
		stroke: 1.7
	}), U(2), R(g), R(f), w("click", g, () => a().shortcuts = !0), u(r, f), A();
}
C(["click"]);
//#endregion
//#region src/focus.ts
function Kt(e) {
	e.isConnected ? e.focus() : requestAnimationFrame(() => e.focus());
}
//#endregion
//#region src/components/ItemMenu.svelte
var qt = l("<button role=\"menuitem\" class=\"svelte-8mcf8g\"><!>Go to show</button> <div class=\"rule svelte-8mcf8g\"></div>", 1), Jt = l("<button role=\"menuitem\" class=\"svelte-8mcf8g\"><!>Go to book</button> <div class=\"rule svelte-8mcf8g\"></div>", 1), Yt = l("<button role=\"menuitem\" class=\"svelte-8mcf8g\"><!>Play next</button> <button role=\"menuitem\" class=\"svelte-8mcf8g\"><!>Add to Up next</button>", 1), Xt = l("<span class=\"in svelte-8mcf8g\">Added</span>"), Zt = l("<button role=\"menuitem\" class=\"svelte-8mcf8g\"><!><span class=\"nm svelte-8mcf8g\"> </span><!></button>"), Qt = l("<form class=\"newform svelte-8mcf8g\"><input maxlength=\"80\" placeholder=\"Playlist name\" aria-label=\"New playlist name\" class=\"svelte-8mcf8g\"/> <button type=\"submit\" class=\"svelte-8mcf8g\">Create</button></form>"), $t = l("<button role=\"menuitem\" class=\"svelte-8mcf8g\"><!>New playlist…</button>"), en = l("<div role=\"menu\"><!> <!> <div class=\"sep svelte-8mcf8g\">Add to playlist</div> <!> <!> <div class=\"rule svelte-8mcf8g\"></div> <button role=\"menuitem\" class=\"svelte-8mcf8g\"><!> </button></div>"), tn = l("<span class=\"anchor svelte-8mcf8g\"><button class=\"dots svelte-8mcf8g\" data-pop=\"\" aria-haspopup=\"menu\">•••</button> <!></span>"), nn = {
	hash: "svelte-8mcf8g",
	code: ".anchor.svelte-8mcf8g {position:relative;display:inline-flex;flex:none;}.dots.svelte-8mcf8g {width:30px;height:28px;border:0;border-radius:7px;background:transparent;color:var(--tm-muted);cursor:pointer;font-size:11px;letter-spacing:1px;}.dots.svelte-8mcf8g:hover, .dots[aria-expanded='true'].svelte-8mcf8g {background:var(--tm-fg-8);color:var(--tm-fg);}.menu.svelte-8mcf8g {right:0;top:32px;width:230px;padding:6px;z-index:8;}.menu.left.svelte-8mcf8g {left:0;right:auto;}.menu.svelte-8mcf8g button:where(.svelte-8mcf8g) {display:flex;align-items:center;gap:9px;width:100%;height:32px;padding:0 10px;border:0;border-radius:8px;background:none;color:var(--tm-fg);font-size:12px;cursor:pointer;text-align:left;}.menu.svelte-8mcf8g button:where(.svelte-8mcf8g):hover:not(:disabled) {background:var(--tm-fg-8);}.menu.svelte-8mcf8g button:where(.svelte-8mcf8g):disabled {opacity:.55;cursor:default;}.nm.svelte-8mcf8g {flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.in.svelte-8mcf8g {font-size:10.5px;color:var(--tm-accent);}.sep.svelte-8mcf8g {font-size:10px;letter-spacing:.8px;text-transform:uppercase;color:var(--tm-muted);padding:8px 10px 4px;}.rule.svelte-8mcf8g {height:1px;background:var(--tm-fg-8);margin:4px 0;}.newform.svelte-8mcf8g {display:flex;gap:6px;padding:4px 6px;}.newform.svelte-8mcf8g input:where(.svelte-8mcf8g) {flex:1;min-width:0;height:28px;padding:0 8px;border-radius:7px;border:1px solid var(--tm-fg-14);background:var(--tm-fg-4);color:var(--tm-fg);font:inherit;font-size:12px;outline:none;}.newform.svelte-8mcf8g input:where(.svelte-8mcf8g):focus {border-color:var(--tm-accent);}.newform.svelte-8mcf8g button:where(.svelte-8mcf8g) {width:auto;height:28px;padding:0 10px;border-radius:7px;background:var(--tm-accent);color:var(--tm-on-accent);font-weight:650;justify-content:center;}.newform.svelte-8mcf8g button:where(.svelte-8mcf8g):hover {background:var(--tm-accent);}"
};
function rn(r, i) {
	j(i, !0), _(r, nn);
	let a = Z(i, "store", 7), o = Z(i, "align", 3, "right"), l = X(() => a().items[i.id]), f = X(() => a().pop === "item" && a().popItem === i.id), p = X(() => a().isDone(i.id)), h = X(() => i.id === a().now), v = I(!1), y = I(""), b = () => {
		a().pop = null, a().popItem = null, k(v, !1);
	};
	function x() {
		let t = {
			id: `pl:${Date.now().toString(36)}`,
			name: e(y).trim().slice(0, 80) || e(l)?.title.slice(0, 40) || "My playlist",
			ids: [i.id],
			at: Date.now()
		};
		a().playlists = [t, ...a().playlists], a().say(`Saved to “${t.name}”`), a().scheduleSave(), b();
	}
	var C = le(), T = F(C), E = (r) => {
		var _ = tn(), C = G(_), T = V(C, 2), E = (t) => {
			var r = en();
			let f;
			var _ = G(r), C = (t) => {
				var n = qt(), r = F(n), i = G(r);
				$(i, {
					get d() {
						return Q.podcast;
					},
					size: 13,
					stroke: 1.8
				}), U(), R(r), U(2), w("click", r, () => {
					b(), a().openShow(e(l).show);
				}), u(t, n);
			}, T = (e) => {
				var t = Jt(), n = F(t), r = G(n);
				$(r, {
					get d() {
						return Q.book;
					},
					size: 13,
					stroke: 1.8
				}), U(), R(n), U(2), w("click", n, () => {
					b(), a().openBook(i.id);
				}), u(e, t);
			};
			s(_, (t) => {
				e(l).type === "podcast" && (a().tab !== "pod" || a().showSlug !== e(l).show) ? t(C) : e(l).type === "book" && (a().tab !== "book" || a().bookId !== i.id) && t(T, 1);
			});
			var E = V(_, 2), O = (e) => {
				var t = Yt(), n = F(t), r = G(n);
				$(r, {
					get d() {
						return Q.playNext;
					},
					size: 13,
					stroke: 1.8
				}), U(), R(n);
				var o = V(n, 2), s = G(o);
				$(s, {
					get d() {
						return Q.plus;
					},
					size: 13,
					stroke: 1.8
				}), U(), R(o), w("click", n, () => {
					a().playNext(i.id), b();
				}), w("click", o, () => {
					a().addToQueue(i.id), b();
				}), u(e, t);
			};
			s(E, (t) => {
				e(h) || t(O);
			});
			var ee = V(E, 4);
			n(ee, 17, () => a().playlists, (e) => e.id, (t, n) => {
				var r = Zt(), o = G(r);
				$(o, {
					get d() {
						return Q.list;
					},
					size: 13,
					stroke: 1.8
				});
				var c = V(o), l = D(c, !0), d = V(c), f = (e) => {
					var t = Xt();
					u(e, t);
				}, p = X(() => e(n).ids.includes(i.id));
				s(d, (t) => {
					e(p) && t(f);
				}), R(r), J((t) => {
					r.disabled = t, S(l, e(n).name);
				}, [() => e(n).ids.includes(i.id)]), w("click", r, () => {
					a().addToPlaylist(e(n).id, i.id), b();
				}), u(t, r);
			});
			var A = V(ee, 2), ne = (t) => {
				var n = Qt(), r = G(n);
				oe(r), d(r, (e) => Kt?.(e)), te(() => m(r, () => e(y), (e) => k(y, e))), U(2), R(n), g("submit", n, (e) => {
					e.preventDefault(), x();
				}), w("keydown", r, (e) => {
					e.key === "Escape" && (e.stopPropagation(), k(v, !1));
				}), u(t, n);
			}, j = (e) => {
				var t = $t(), n = G(t);
				$(n, {
					get d() {
						return Q.plus;
					},
					size: 13,
					stroke: 1.8
				}), U(), R(t), w("click", t, () => {
					k(v, !0), k(y, "");
				}), u(e, t);
			};
			s(A, (t) => {
				e(v) ? t(ne) : t(j, -1);
			});
			var M = V(A, 4), re = G(M);
			$(re, {
				get d() {
					return Q.check;
				},
				size: 13,
				stroke: 2
			});
			var N = V(re, 1, !0);
			R(M), R(r), J(() => {
				f = c(r, 1, "tm-pop menu svelte-8mcf8g", null, f, { left: o() === "left" }), S(N, e(p) ? "Mark as unplayed" : "Mark as played");
			}), w("click", M, () => {
				a().togglePlayed(i.id), b();
			}), u(t, r);
		};
		s(T, (t) => {
			e(f) && t(E);
		}), R(_), J(() => {
			t(C, "aria-expanded", e(f)), t(C, "aria-label", `More for ${e(l).title ?? ""}`);
		}), w("click", C, (e) => {
			e.stopPropagation(), a().openItemMenu(i.id), k(v, !1);
		}), u(r, _);
	};
	s(T, (t) => {
		e(l) && e(l).type !== "radio" && t(E);
	}), u(r, C), A();
}
C(["click", "keydown"]);
//#endregion
//#region src/components/ItemRow.svelte
var an = l("<button class=\"icon svelte-ee3n05\" title=\"Play next\"><!></button> <button class=\"icon svelte-ee3n05\" title=\"Add to queue\"><!></button>", 1), on = l("<div><!> <div class=\"text svelte-ee3n05\"><div> </div> <div class=\"meta svelte-ee3n05\"> </div></div> <!> <!> <button class=\"play svelte-ee3n05\"><!></button></div>"), sn = {
	hash: "svelte-ee3n05",
	code: ".row.svelte-ee3n05 {display:flex;align-items:center;gap:14px;padding:10px 8px;border-radius:10px;}.row.svelte-ee3n05:hover {background:var(--tm-fg-5);}.row.cur.svelte-ee3n05 {background:var(--tm-accent-8);}.text.svelte-ee3n05 {flex:1;min-width:0;}.title.svelte-ee3n05 {font-size:13px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.cur.svelte-ee3n05 .title:where(.svelte-ee3n05) {color:var(--tm-accent);}.title.done.svelte-ee3n05 {color:var(--tm-muted);}.meta.svelte-ee3n05 {font-size:11.5px;color:var(--tm-muted);margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.icon.svelte-ee3n05 {width:32px;height:32px;flex:none;border:0;border-radius:8px;background:transparent;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;}.icon.svelte-ee3n05:hover {background:var(--tm-fg-8);color:var(--tm-fg);}.play.svelte-ee3n05 {width:34px;height:34px;flex:none;border:0;border-radius:17px;background:var(--tm-accent);color:var(--tm-on-accent);cursor:pointer;display:grid;place-items:center;}"
};
function cn(n, r) {
	j(r, !0), _(n, sn);
	let i = Z(r, "from", 3, ""), a = X(() => r.store.items[r.id]), o = X(() => r.id === r.store.now), l = X(() => e(a) ? e(a).type === "podcast" ? [
		e(a).sub,
		ee(e(a).date),
		r.store.lenOf(r.id)
	].filter(Boolean).join(" · ") : e(a).type === "radio" ? `${se.radio} · ${e(a).sub}` : `${se.book} · ${e(a).sub}` : "");
	var d = le(), f = F(d), p = (n) => {
		var d = on();
		let f;
		var p = G(d);
		q(p, {
			get hue() {
				return e(a).hue;
			},
			get art() {
				return e(a).art;
			},
			get mark() {
				return e(a).mark;
			},
			size: 44
		});
		var m = V(p, 2), h = G(m);
		let g;
		var _ = D(h, !0), v = V(h, 2), y = D(v, !0);
		R(m);
		var b = V(m, 2), x = (n) => {
			var i = an(), o = F(i), s = G(o);
			$(s, {
				get d() {
					return Q.playNext;
				},
				stroke: 1.8
			}), R(o);
			var c = V(o, 2), l = G(c);
			$(l, {
				get d() {
					return Q.plus;
				},
				stroke: 1.8
			}), R(c), J(() => {
				t(o, "aria-label", `Play next: ${e(a).title ?? ""}`), t(c, "aria-label", `Add to queue: ${e(a).title ?? ""}`);
			}), w("click", o, () => r.store.playNext(r.id)), w("click", c, () => r.store.addToQueue(r.id)), u(n, i);
		};
		s(b, (t) => {
			e(a).type !== "radio" && !e(o) && t(x);
		});
		var C = V(b, 2), T = (e) => {
			rn(e, {
				get store() {
					return r.store;
				},
				get id() {
					return r.id;
				}
			});
		};
		s(C, (t) => {
			e(a).type !== "radio" && t(T);
		});
		var E = V(C, 2), O = G(E);
		{
			let t = X(() => r.store.isPlaying(r.id) ? e(a).type === "radio" ? Q.stop : Q.pause : Q.play);
			$(O, {
				get d() {
					return e(t);
				},
				size: 14
			});
		}
		R(E), R(d), J((n, r) => {
			f = c(d, 1, "row svelte-ee3n05", null, f, { cur: e(o) }), g = c(h, 1, "title svelte-ee3n05", null, g, { done: n }), S(_, e(a).title), S(y, e(l)), t(E, "aria-label", `${r ?? ""} ${e(a).title ?? ""}`);
		}, [() => !e(o) && r.store.isDone(r.id), () => r.store.isPlaying(r.id) ? e(a).type === "radio" ? "Stop" : "Pause" : "Play"]), w("click", E, () => r.store.isPlaying(r.id) && e(a).type === "radio" ? r.store.stop() : r.list ? r.store.playFrom(r.id, r.list, i()) : r.store.play(r.id)), u(n, d);
	};
	s(f, (t) => {
		e(a) && t(p);
	}), u(n, d), A();
}
C(["click"]);
//#endregion
//#region src/components/Status.svelte
var ln = l("<div class=\"line svelte-hcghuu\" role=\"status\"><span class=\"spin svelte-hcghuu\" aria-hidden=\"true\"></span>Loading…</div>"), un = l("<button class=\"svelte-hcghuu\">Try again</button>"), dn = l("<div class=\"line svelte-hcghuu\" role=\"alert\"> <!></div>"), fn = l("<div class=\"line svelte-hcghuu\"> </div>"), pn = {
	hash: "svelte-hcghuu",
	code: ".line.svelte-hcghuu {display:flex;align-items:center;gap:10px;padding:18px 8px;font-size:12.5px;color:var(--tm-muted);}button.svelte-hcghuu {border:0;background:none;color:var(--tm-accent);font-size:12.5px;cursor:pointer;padding:0;}.spin.svelte-hcghuu {width:14px;height:14px;border-radius:50%;border:2px solid var(--tm-fg-16);border-top-color:var(--tm-accent); animation: svelte-hcghuu-spin .8s linear infinite;}\n  @keyframes svelte-hcghuu-spin { to { transform: rotate(360deg); } }\n  @media (prefers-reduced-motion: reduce) {.spin.svelte-hcghuu { animation: none;} }"
};
function mn(e, t) {
	_(e, pn);
	let n = Z(t, "empty", 3, ""), r = Z(t, "error", 3, "OndaCast could not be reached.");
	var i = le(), a = F(i), o = (e) => {
		var t = ln();
		u(e, t);
	}, c = (e) => {
		var n = dn(), i = G(n, !0), a = V(i), o = (e) => {
			var n = un();
			w("click", n, function(...e) {
				t.retry?.apply(this, e);
			}), u(e, n);
		};
		s(a, (e) => {
			t.retry && e(o);
		}), R(n), J(() => S(i, r())), u(e, n);
	}, l = (e) => {
		var t = fn(), r = D(t, !0);
		J(() => S(r, n())), u(e, t);
	};
	s(a, (e) => {
		t.status === "loading" ? e(o) : t.status === "error" ? e(c, 1) : n() && e(l, 2);
	}), u(e, i);
}
C(["click"]);
//#endregion
//#region src/components/HomeView.svelte
var hn = l("<button class=\"card svelte-oxdkf2\"><!> <span class=\"ctext svelte-oxdkf2\"><span class=\"kind svelte-oxdkf2\"> </span> <span class=\"ctitle svelte-oxdkf2\"> </span> <span class=\"bar svelte-oxdkf2\"><span class=\"svelte-oxdkf2\"></span></span> <span class=\"left svelte-oxdkf2\"> </span></span></button>"), gn = l("<div class=\"continue svelte-oxdkf2\"></div>"), _n = l("<div class=\"start svelte-oxdkf2\"><button class=\"svelte-oxdkf2\">Tune in to live radio</button> <button class=\"svelte-oxdkf2\">Find a podcast</button> <button class=\"svelte-oxdkf2\">Start an audiobook</button></div>"), vn = l("<button><span class=\"banner svelte-oxdkf2\"><!><span class=\"live svelte-oxdkf2\"><i class=\"svelte-oxdkf2\"></i>LIVE</span></span> <span class=\"stext svelte-oxdkf2\"><span class=\"stitle svelte-oxdkf2\"> </span><span class=\"song svelte-oxdkf2\"> </span></span></button>"), yn = l("<div class=\"onair svelte-oxdkf2\"></div>"), bn = l("<h1 class=\"h1 svelte-oxdkf2\"> </h1> <p class=\"lede svelte-oxdkf2\">Pick up where you left off across radio, podcasts and books.</p> <!> <div class=\"section svelte-oxdkf2\"><h2 class=\"svelte-oxdkf2\">On air now</h2><button class=\"link svelte-oxdkf2\">All stations</button></div> <!> <h2 class=\"h2 svelte-oxdkf2\">New from your shows</h2> <!>", 1), xn = {
	hash: "svelte-oxdkf2",
	code: ".h1.svelte-oxdkf2 {font-size:26px;font-weight:650;letter-spacing:-.5px;margin:0;}.lede.svelte-oxdkf2 {font-size:13px;color:var(--tm-muted);margin:4px 0 0;}.continue.svelte-oxdkf2 {display:grid;grid-template-columns:repeat(3, minmax(0, 1fr));gap:12px;margin-top:20px;}.card.svelte-oxdkf2 {display:flex;gap:12px;padding:12px;border:0;border-radius:14px;background:var(--tm-fg-4);color:inherit;cursor:pointer;align-items:center;text-align:left;font:inherit;}.card.svelte-oxdkf2:hover {background:var(--tm-fg-8);}.ctext.svelte-oxdkf2 {min-width:0;flex:1;display:flex;flex-direction:column;gap:4px;}.kind.svelte-oxdkf2 {font-size:10px;letter-spacing:.8px;text-transform:uppercase;color:var(--tm-accent);font-weight:600;}.ctitle.svelte-oxdkf2 {font-size:13px;font-weight:600;line-height:1.25;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.bar.svelte-oxdkf2 {height:3px;border-radius:2px;background:var(--tm-fg-10);margin-top:3px;display:block;}.bar.svelte-oxdkf2 span:where(.svelte-oxdkf2) {display:block;height:3px;border-radius:2px;background:var(--tm-accent);}.left.svelte-oxdkf2 {font-size:11px;color:var(--tm-muted);}.start.svelte-oxdkf2 {display:flex;flex-wrap:wrap;gap:8px;margin-top:18px;}.start.svelte-oxdkf2 button:where(.svelte-oxdkf2) {height:34px;padding:0 16px;border-radius:17px;border:1px solid var(--tm-fg-14);background:var(--tm-fg-4);color:var(--tm-fg);font-size:12.5px;font-weight:600;cursor:pointer;}.start.svelte-oxdkf2 button:where(.svelte-oxdkf2):hover {border-color:var(--tm-accent);}.section.svelte-oxdkf2 {display:flex;align-items:baseline;justify-content:space-between;margin:28px 0 12px;}h2.svelte-oxdkf2 {font-size:15px;font-weight:650;margin:0;}.h2.svelte-oxdkf2 {margin:28px 0 8px;}.link.svelte-oxdkf2 {border:0;background:none;color:var(--tm-accent);font-size:12px;cursor:pointer;padding:0;}.onair.svelte-oxdkf2 {display:grid;grid-template-columns:repeat(4, minmax(0, 1fr));gap:12px;}.station.svelte-oxdkf2 {border:0;padding:0;border-radius:14px;overflow:hidden;background:var(--tm-fg-4);color:inherit;cursor:pointer;text-align:left;font:inherit;display:flex;flex-direction:column;}.station.svelte-oxdkf2:hover {background:var(--tm-fg-8);}.station.cur.svelte-oxdkf2 {box-shadow:inset 0 0 0 1px var(--tm-accent);}.banner.svelte-oxdkf2 {height:78px;display:flex;width:100%;position:relative;}.live.svelte-oxdkf2 {position:absolute;left:10px;top:10px;display:inline-flex;align-items:center;gap:5px;font-size:9.5px;font-weight:700;letter-spacing:.8px;padding:3px 7px;border-radius:20px;background:rgba(0, 0, 0, .45);color:#fff;}.live.svelte-oxdkf2 i:where(.svelte-oxdkf2) {width:5px;height:5px;border-radius:3px;background:var(--tm-live);}.stext.svelte-oxdkf2 {padding:10px 12px 12px;display:flex;flex-direction:column;min-width:0;}.stitle.svelte-oxdkf2 {font-size:12.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.song.svelte-oxdkf2 {font-size:11px;color:var(--tm-muted);margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}"
};
function Sn(r, i) {
	j(i, !0), _(r, xn);
	let o = Z(i, "store", 7);
	var l = bn(), d = F(l), f = D(d, !0), p = V(d, 4), m = (r) => {
		var i = gn();
		n(i, 20, () => o().continueIds, (e) => e, (n, r) => {
			let i = X(() => o().items[r]);
			var s = hn(), c = G(s);
			q(c, {
				get hue() {
					return e(i).hue;
				},
				get art() {
					return e(i).art;
				},
				size: 58,
				radius: 10,
				get mark() {
					return e(i).mark;
				}
			});
			var l = V(c, 2), d = G(l), f = D(d, !0), p = V(d, 2), m = D(p, !0), h = V(p, 2), g = G(h);
			let _;
			R(h);
			var v = V(h, 2), y = D(v, !0);
			R(l), R(s), J((n, r, o) => {
				t(s, "aria-label", `${n ?? ""} ${e(i).title ?? ""}`), S(f, se[e(i).type]), S(m, e(i).title), _ = a(g, "", _, { width: r }), S(y, o);
			}, [
				() => o().isPlaying(r) ? "Pause" : "Continue",
				() => `${o().pctOf(r) ?? ""}%`,
				() => o().leftOf(r)
			]), w("click", s, () => o().play(r)), u(n, s);
		}), R(i), u(r, i);
	}, h = (e) => {
		var t = _n(), n = G(t), r = V(n, 2), i = V(r, 2);
		R(t), w("click", n, () => o().tab = "radio"), w("click", r, () => {
			o().tab = "pod", o().showSlug = null;
		}), w("click", i, () => {
			o().tab = "book", o().bookId = null;
		}), u(e, t);
	};
	s(p, (e) => {
		o().continueIds.length ? e(m) : e(h, -1);
	});
	var g = V(p, 2), v = V(G(g));
	R(g);
	var y = V(g, 2), b = (r) => {
		var i = yn();
		n(i, 20, () => o().onAirIds, (e) => e, (n, r) => {
			let i = X(() => o().items[r]);
			var a = vn();
			let s;
			var l = G(a), d = G(l);
			q(d, {
				get hue() {
					return e(i).hue;
				},
				get art() {
					return e(i).art;
				},
				fill: !0,
				radius: 0,
				get mark() {
					return e(i).mark;
				},
				font: 18
			}), U(), R(l);
			var f = V(l, 2), p = G(f), m = D(p, !0), h = V(p), g = D(h, !0);
			R(f), R(a), J((n, l) => {
				s = c(a, 1, "station svelte-oxdkf2", null, s, { cur: r === o().now }), t(a, "aria-label", `${n ?? ""} ${e(i).title ?? ""}`), S(m, e(i).title), S(g, l);
			}, [() => o().isPlaying(r) ? "Pause" : "Play", () => e(i).type === "radio" ? o().songOf(e(i).stationId) ? `♪ ${o().songOf(e(i).stationId)}` : e(i).sub : ""]), w("click", a, () => o().play(r)), u(n, a);
		}), R(i), u(r, i);
	}, x = (e) => {
		mn(e, {
			get status() {
				return o().radioStatus;
			},
			retry: () => o().loadRadio(),
			empty: "No stations are on air right now."
		});
	};
	s(y, (e) => {
		o().onAirIds.length ? e(b) : e(x, -1);
	});
	var C = V(y, 4);
	n(C, 16, () => o().newEpisodes, (e) => e, (e, t) => {
		cn(e, {
			get store() {
				return o();
			},
			get id() {
				return t;
			},
			get list() {
				return o().newEpisodes;
			},
			from: "your new episodes"
		});
	}, (e) => {
		mn(e, {
			get status() {
				return o().newStatus;
			},
			retry: () => o().loadNewEpisodes(),
			empty: "Subscribe to shows in Podcasts and their new episodes land here."
		});
	}), J((e) => S(f, e), [() => P()]), w("click", v, () => o().tab = "radio"), u(r, l), A();
}
C(["click"]);
//#endregion
//#region src/components/FavButton.svelte
var Cn = l("<button><!></button>"), wn = {
	hash: "svelte-18vgx0d",
	code: ".fav.svelte-18vgx0d {width:32px;height:32px;flex:none;padding:0;border:0;border-radius:50%;background:transparent;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;transition:color .15s, transform .15s, background .15s;}.fav.svelte-18vgx0d:hover {color:var(--tm-fg);background:var(--tm-fg-8);}.fav.on.svelte-18vgx0d {color:var(--tm-live);}.fav.on.svelte-18vgx0d:hover {color:var(--tm-live);}.fav.solid.svelte-18vgx0d {background:rgba(0, 0, 0, .4);color:#fff;}.fav.solid.on.svelte-18vgx0d {color:var(--tm-live);}.fav.svelte-18vgx0d:active {transform:scale(.9);}\n  @media (prefers-reduced-motion: reduce) {.fav.svelte-18vgx0d {transition:none;} }"
};
function Tn(n, r) {
	j(r, !0), _(n, wn);
	let i = Z(r, "size", 3, 16), a = Z(r, "solid", 3, !1), o = X(() => r.store.items[r.id]), l = X(() => r.store.isFavorite(r.id)), d = X(() => e(o) ? e(o).type === "radio" ? e(l) ? "Remove from favorite stations" : "Add to favorite stations" : e(o).type === "book" ? e(l) ? "Remove from My Media" : "Save to My Media" : e(l) ? `Unsubscribe from ${e(o).sub}` : `Subscribe to ${e(o).sub}` : "");
	var f = le(), p = F(f), m = (n) => {
		var o = Cn();
		let s;
		var f = G(o);
		{
			let t = X(() => e(l) ? 0 : 1.8);
			$(f, {
				get d() {
					return Q.heart;
				},
				get size() {
					return i();
				},
				get stroke() {
					return e(t);
				}
			});
		}
		R(o), J(() => {
			s = c(o, 1, "fav svelte-18vgx0d", null, s, {
				on: e(l),
				solid: a()
			}), t(o, "aria-pressed", e(l)), t(o, "aria-label", e(d)), t(o, "title", e(d));
		}), w("click", o, (e) => {
			e.stopPropagation(), r.store.toggleFavorite(r.id);
		}), u(n, o);
	};
	s(p, (t) => {
		e(o) && t(m);
	}), u(n, f), A();
}
C(["click"]);
//#endregion
//#region src/components/WeekCard.svelte
var En = l("<span class=\"streak svelte-155zco6\"><!> </span>"), Dn = l("<span class=\"tip svelte-155zco6\"> </span>"), On = l("<div class=\"col svelte-155zco6\" role=\"presentation\"><span class=\"track svelte-155zco6\"><span></span> <!></span> <span> </span></div>"), kn = l("<div class=\"svelte-155zco6\"><dt class=\"svelte-155zco6\"> </dt><dd class=\"svelte-155zco6\"> </dd></div>"), An = l("<tr><th scope=\"row\"> </th><td> </td></tr>"), jn = l("<section class=\"week svelte-155zco6\" aria-label=\"Your listening this week\"><div class=\"hero svelte-155zco6\"><span class=\"eyebrow svelte-155zco6\">Your week</span> <strong class=\"svelte-155zco6\"> </strong> <span class=\"sub svelte-155zco6\">listened in the last 7 days</span> <!></div> <div class=\"chart svelte-155zco6\" role=\"img\" aria-label=\"Minutes listened per day, last seven days\"></div> <dl class=\"split svelte-155zco6\"></dl> <table class=\"sr svelte-155zco6\"><caption>Minutes listened per day</caption><tbody></tbody></table></section>"), Mn = {
	hash: "svelte-155zco6",
	code: ".week.svelte-155zco6 {display:grid;grid-template-columns:minmax(150px, 1fr) minmax(200px, 1.6fr) minmax(130px, 1fr);grid-template-areas:'hero chart split';gap:14px 22px;align-items:center;padding:18px 20px;border-radius:16px;background:linear-gradient(135deg, var(--tm-accent-12), var(--tm-fg-4));border:1px solid var(--tm-fg-7);}.hero.svelte-155zco6 {grid-area:hero;display:flex;flex-direction:column;gap:2px;min-width:0;}.eyebrow.svelte-155zco6 {font-size:10.5px;letter-spacing:1px;text-transform:uppercase;color:var(--tm-accent);font-weight:650;}strong.svelte-155zco6 {font-size:30px;font-weight:700;letter-spacing:-.6px;line-height:1.1;}.sub.svelte-155zco6 {font-size:11.5px;color:var(--tm-muted);}.streak.svelte-155zco6 {display:inline-flex;align-items:center;gap:5px;margin-top:8px;width:fit-content;font-size:11px;font-weight:650;padding:3px 9px;border-radius:20px;background:var(--tm-fg-8);}.chart.svelte-155zco6 {grid-area:chart;display:grid;grid-template-columns:repeat(7, 1fr);gap:8px;height:120px;padding-top:24px;box-sizing:border-box;align-items:end;}.col.svelte-155zco6 {position:relative;display:flex;flex-direction:column;align-items:center;gap:6px;height:100%;}.track.svelte-155zco6 {position:relative;flex:1;width:100%;max-width:22px;display:flex;align-items:flex-end;justify-content:center;border-bottom:1px solid var(--tm-fg-12);}.bar.svelte-155zco6 {display:block;width:100%;border-radius:4px 4px 0 0;background:color-mix(in srgb, var(--tm-accent) 55%, transparent);}.bar.today.svelte-155zco6 {background:var(--tm-accent);}.day.svelte-155zco6 {font-size:10px;color:var(--tm-muted);}.day.today.svelte-155zco6 {color:var(--tm-fg);font-weight:650;}.tip.svelte-155zco6 {position:absolute;left:50%;transform:translateX(-50%);white-space:nowrap;font-size:11px;padding:4px 8px;border-radius:6px;background:var(--tm-fg);color:var(--tm-bg);pointer-events:none;z-index:2;}.split.svelte-155zco6 {grid-area:split;margin:0;display:grid;gap:8px;}.split.svelte-155zco6 div:where(.svelte-155zco6) {display:flex;justify-content:space-between;gap:10px;font-size:12px;}dt.svelte-155zco6 {color:var(--tm-muted);}dd.svelte-155zco6 {margin:0;font-weight:600;font-variant-numeric:tabular-nums;}.sr.svelte-155zco6 {position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;}\n  /* Medium widths: hero and split on the left, chart on the right. */\n  @container (max-width: 760px) {.week.svelte-155zco6 {grid-template-columns:minmax(150px, 1fr) minmax(180px, 1.3fr);grid-template-areas:'hero chart' 'split chart';align-items:start;}.split.svelte-155zco6 {gap:5px;} }\n  @container (max-width: 420px) {.week.svelte-155zco6 {grid-template-columns:1fr;grid-template-areas:'hero' 'chart' 'split';} }"
};
function Nn(t, r) {
	j(r, !0), _(t, Mn);
	let i = X(() => r.store.week), o = X(() => Math.max(60, ...e(i).days.map((e) => e.seconds))), l = (e) => e < 60 ? e ? "<1 min" : "0 min" : E(e), d = [
		["radio", "Radio"],
		["podcast", "Podcasts"],
		["book", "Audiobooks"]
	], f = I(-1);
	var p = jn(), m = G(p), h = V(G(m), 2), v = D(h, !0), y = V(h, 4), b = (t) => {
		var n = En(), r = G(n);
		$(r, {
			get d() {
				return Q.flame;
			},
			size: 13,
			stroke: 1.8
		});
		var a = V(r);
		R(n), J(() => S(a, `${e(i).streak ?? ""}-day streak`)), u(t, n);
	};
	s(y, (t) => {
		e(i).streak > 1 && t(b);
	}), R(m);
	var x = V(m, 2);
	n(x, 23, () => e(i).days, (e) => e.key, (t, n, r) => {
		let i = X(() => e(n).seconds ? Math.max(4, e(n).seconds / e(o) * 100) : 0);
		var d = On(), p = G(d), m = G(p);
		let h, _;
		var v = V(m, 2), y = (t) => {
			var r = Dn();
			let o;
			var s = D(r);
			J((t) => {
				o = a(r, "", o, { bottom: `calc(${e(i) ?? ""}% + 6px)` }), S(s, `${e(n).label ?? ""} · ${t ?? ""}`);
			}, [() => l(e(n).seconds)]), u(t, r);
		};
		s(v, (t) => {
			e(f) === e(r) && t(y);
		}), R(p);
		var b = V(p, 2);
		let x;
		var C = D(b, !0);
		R(d), J((t) => {
			h = c(m, 1, "bar svelte-155zco6", null, h, { today: e(r) === 6 }), _ = a(m, "", _, { height: `${e(i) ?? ""}%` }), x = c(b, 1, "day svelte-155zco6", null, x, { today: e(r) === 6 }), S(C, t);
		}, [() => e(n).label.slice(0, 2)]), g("pointerenter", d, () => k(f, e(r), !0)), g("pointerleave", d, () => k(f, -1)), u(t, d);
	}), R(x);
	var C = V(x, 2);
	n(C, 21, () => d, ([e, t]) => e, (t, n) => {
		var r = X(() => re(e(n), 2));
		let a = () => e(r)[0], o = () => e(r)[1];
		var s = kn(), c = G(s), d = D(c, !0), f = V(c), p = D(f, !0);
		R(s), J((e) => {
			S(d, o()), S(p, e);
		}, [() => l(e(i).byKind[a()])]), u(t, s);
	}), R(C);
	var w = V(C, 2), T = V(G(w));
	n(T, 21, () => e(i).days, (e) => e.key, (t, n) => {
		var r = An(), i = G(r), a = D(i, !0), o = V(i), s = D(o, !0);
		R(r), J((t) => {
			S(a, e(n).label), S(s, t);
		}, [() => Math.round(e(n).seconds / 60)]), u(t, r);
	}), R(T), R(w), R(p), J((e) => S(v, e), [() => l(e(i).total)]), u(t, p), A();
}
//#endregion
//#region src/components/MyMediaView.svelte
var Pn = l("<button> <span class=\"n svelte-ube16v\"> </span></button>"), Fn = l("<div class=\"welcome svelte-ube16v\"><div class=\"wicon svelte-ube16v\"><!></div> <h2 class=\"svelte-ube16v\">Your library starts here</h2> <p class=\"svelte-ube16v\">Tap the heart on a station to keep it here, subscribe to shows, and save audiobooks. Everything you play is remembered, with your place in every episode and book.</p> <div class=\"cta svelte-ube16v\"><button class=\"svelte-ube16v\">Find stations</button> <button class=\"svelte-ube16v\">Browse podcasts</button> <button class=\"svelte-ube16v\">Browse audiobooks</button></div></div>"), In = l("<button class=\"rcard svelte-ube16v\"><!> <span class=\"rtext svelte-ube16v\"><span class=\"kind svelte-ube16v\"> </span> <span class=\"rtitle svelte-ube16v\"> </span> <span class=\"prog svelte-ube16v\"><span class=\"svelte-ube16v\"></span></span> <span class=\"meta svelte-ube16v\"> </span></span> <span class=\"rplay svelte-ube16v\"><!></span></button>"), Ln = l("<section class=\"svelte-ube16v\"><div class=\"sh svelte-ube16v\"><h2 class=\"svelte-ube16v\">Continue listening</h2><span class=\"svelte-ube16v\"> </span></div> <div class=\"resume svelte-ube16v\"></div></section>"), Rn = l("<form><input class=\"rename svelte-ube16v\" maxlength=\"80\" aria-label=\"Playlist name\"/></form>"), zn = l("<button class=\"plname svelte-ube16v\" title=\"Rename\"> </button>"), Bn = l("<div><!> <button class=\"pltitle svelte-ube16v\"> <small class=\"svelte-ube16v\"> </small></button> <button class=\"plrm svelte-ube16v\"><!></button></div>"), Vn = l("<p class=\"none svelte-ube16v\">This playlist is empty. Use ••• on any episode or book to add to it.</p>"), Hn = l("<div class=\"plitems svelte-ube16v\"></div>"), Un = l("<div><div class=\"plhead svelte-ube16v\"><button class=\"mosaic svelte-ube16v\"><!> <span class=\"mplay svelte-ube16v\"><!></span></button> <div class=\"pltext svelte-ube16v\"><!> <span class=\"plmeta svelte-ube16v\"> </span></div> <button class=\"plbtn primary svelte-ube16v\"><!>Play</button> <button class=\"plbtn svelte-ube16v\" title=\"Shuffle\"><!></button> <button class=\"plbtn svelte-ube16v\"><!></button> <button><!></button></div> <!></div>"), Wn = l("<section class=\"svelte-ube16v\"><div class=\"sh svelte-ube16v\"><h2 class=\"svelte-ube16v\">Playlists</h2><span class=\"svelte-ube16v\"> </span></div> <div class=\"pls svelte-ube16v\"></div></section>"), Gn = l("<button class=\"all svelte-ube16v\">See all</button>"), Kn = l("<div><button class=\"tbody svelte-ube16v\"><span class=\"banner svelte-ube16v\"><!> <span class=\"live svelte-ube16v\"><i class=\"svelte-ube16v\"></i>LIVE</span> <span class=\"tplay svelte-ube16v\"><!></span></span> <span class=\"ttext svelte-ube16v\"><span class=\"ttitle svelte-ube16v\"> </span><span class=\"tsub svelte-ube16v\"> </span></span></button> <span class=\"tfav svelte-ube16v\"><!></span></div>"), qn = l("<div class=\"tiles svelte-ube16v\"></div>"), Jn = l("<button class=\"link svelte-ube16v\">Find stations</button>"), Yn = l("<p class=\"none svelte-ube16v\"> <!></p>"), Xn = l("<section class=\"svelte-ube16v\"><div class=\"sh svelte-ube16v\"><h2 class=\"svelte-ube16v\">Favorite stations</h2><span class=\"svelte-ube16v\"> </span><!></div> <!></section>"), Zn = l("<span class=\"badge svelte-ube16v\"> </span>"), Qn = l("<button class=\"card svelte-ube16v\"><span class=\"art svelte-ube16v\"><!><!></span> <span class=\"ctitle svelte-ube16v\"> </span> <span class=\"csub svelte-ube16v\"> </span></button>"), $n = l("<div class=\"cards svelte-ube16v\"></div>"), er = l("<button class=\"link svelte-ube16v\">Browse podcasts</button>"), tr = l("<section class=\"svelte-ube16v\"><div class=\"sh svelte-ube16v\"><h2 class=\"svelte-ube16v\">Your shows</h2><span class=\"svelte-ube16v\"> </span><!></div> <!></section>"), nr = l("<span class=\"bprog svelte-ube16v\"><span class=\"svelte-ube16v\"></span></span>"), rr = l("<div class=\"bwrap svelte-ube16v\"><button class=\"card svelte-ube16v\"><span class=\"art tall svelte-ube16v\"><!> <!></span> <span class=\"ctitle svelte-ube16v\"> </span> <span> </span></button> <span class=\"bfav svelte-ube16v\"><!></span></div>"), ir = l("<div class=\"cards books svelte-ube16v\"></div>"), ar = l("<button class=\"link svelte-ube16v\">Browse audiobooks</button>"), or = l("<section class=\"svelte-ube16v\"><div class=\"sh svelte-ube16v\"><h2 class=\"svelte-ube16v\">Audiobooks</h2><span class=\"svelte-ube16v\"> </span><!></div> <!></section>"), sr = l("<div><!> <button class=\"htext svelte-ube16v\"><span class=\"htitle svelte-ube16v\"> </span> <span class=\"hmeta svelte-ube16v\"> </span></button> <!> <!> <button class=\"hplay svelte-ube16v\"><!></button></div>"), cr = l("<section class=\"svelte-ube16v\"><div class=\"sh svelte-ube16v\"><h2 class=\"svelte-ube16v\">Recently played</h2><span class=\"svelte-ube16v\"> </span><button class=\"all svelte-ube16v\">Clear history</button></div> <div class=\"hist svelte-ube16v\"></div></section>"), lr = l("<!> <!> <!> <!> <!> <!>", 1), ur = l("<div class=\"head svelte-ube16v\"><div><h1 class=\"h1 svelte-ube16v\">My Media</h1> <p class=\"lede svelte-ube16v\">Your stations, shows and books, and everything you have been listening to.</p></div> <label class=\"filter svelte-ube16v\"><!> <input type=\"search\" placeholder=\"Filter your library\" aria-label=\"Filter your library\" class=\"svelte-ube16v\"/></label></div> <!> <div class=\"bar svelte-ube16v\"><div class=\"kinds svelte-ube16v\" role=\"group\" aria-label=\"Show\"></div> <label class=\"sort svelte-ube16v\">Sort <select aria-label=\"Sort\" class=\"svelte-ube16v\"><option>Recently played</option><option>Recently added</option><option>Title A–Z</option></select></label></div> <!>", 1), dr = {
	hash: "svelte-ube16v",
	code: ".head.svelte-ube16v {display:flex;align-items:flex-end;justify-content:space-between;gap:16px;margin-bottom:18px;}.h1.svelte-ube16v {font-size:26px;font-weight:650;letter-spacing:-.5px;margin:0;}.lede.svelte-ube16v {font-size:13px;color:var(--tm-muted);margin:4px 0 0;}.filter.svelte-ube16v {display:flex;align-items:center;gap:8px;height:30px;padding:0 12px;border-radius:9px;background:var(--tm-fg-6);color:var(--tm-muted);width:220px;flex:none;}.filter.svelte-ube16v:focus-within {box-shadow:0 0 0 1px var(--tm-accent);}.filter.svelte-ube16v input:where(.svelte-ube16v) {flex:1;min-width:0;border:0;background:none;outline:none;color:var(--tm-fg);font:inherit;font-size:12px;}.bar.svelte-ube16v {display:flex;align-items:center;justify-content:space-between;gap:12px;margin:20px 0 4px;flex-wrap:wrap;}.kinds.svelte-ube16v {display:flex;gap:8px;flex-wrap:wrap;}.chip.svelte-ube16v {height:30px;padding:0 12px 0 14px;border-radius:15px;border:1px solid var(--tm-fg-16);background:transparent;color:var(--tm-fg);font-size:12px;font-weight:500;cursor:pointer;display:flex;align-items:center;gap:7px;}.chip.svelte-ube16v .n:where(.svelte-ube16v) {font-size:10.5px;min-width:18px;padding:1px 6px;border-radius:10px;background:var(--tm-fg-8);font-variant-numeric:tabular-nums;}.chip.on.svelte-ube16v {border-color:var(--tm-accent);background:var(--tm-accent);color:var(--tm-on-accent);}.chip.on.svelte-ube16v .n:where(.svelte-ube16v) {background:color-mix(in srgb, var(--tm-on-accent) 18%, transparent);}.sort.svelte-ube16v {display:flex;align-items:center;gap:8px;font-size:12px;color:var(--tm-muted);}select.svelte-ube16v {height:30px;border-radius:8px;border:1px solid var(--tm-fg-14);background:var(--tm-panel);color:var(--tm-fg);font:inherit;font-size:12px;padding:0 8px;}section.svelte-ube16v {margin-top:24px;}.sh.svelte-ube16v {display:flex;align-items:baseline;gap:8px;margin-bottom:12px;}.sh.svelte-ube16v h2:where(.svelte-ube16v) {font-size:15px;font-weight:650;margin:0;}.sh.svelte-ube16v > span:where(.svelte-ube16v) {font-size:11px;color:var(--tm-muted);font-variant-numeric:tabular-nums;}.all.svelte-ube16v, .link.svelte-ube16v {margin-left:auto;border:0;background:none;color:var(--tm-accent);font-size:12px;cursor:pointer;padding:0;font:inherit;font-size:12px;}.link.svelte-ube16v {margin-left:4px;}.none.svelte-ube16v {font-size:12.5px;color:var(--tm-muted);margin:0;padding:14px 16px;border-radius:12px;background:var(--tm-fg-4);}.resume.svelte-ube16v {display:grid;grid-template-columns:repeat(auto-fill, minmax(240px, 1fr));gap:10px;}.rcard.svelte-ube16v {display:flex;align-items:center;gap:12px;padding:10px;border:0;border-radius:14px;background:var(--tm-fg-4);color:inherit;cursor:pointer;text-align:left;font:inherit;}.rcard.svelte-ube16v:hover {background:var(--tm-fg-8);}.rtext.svelte-ube16v {flex:1;min-width:0;display:flex;flex-direction:column;gap:3px;}.kind.svelte-ube16v {font-size:9.5px;letter-spacing:.8px;text-transform:uppercase;color:var(--tm-accent);font-weight:650;}.rtitle.svelte-ube16v {font-size:12.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.prog.svelte-ube16v, .bprog.svelte-ube16v {display:block;height:3px;border-radius:2px;background:var(--tm-fg-10);}.prog.svelte-ube16v span:where(.svelte-ube16v), .bprog.svelte-ube16v span:where(.svelte-ube16v) {display:block;height:3px;border-radius:2px;background:var(--tm-accent);}.meta.svelte-ube16v {font-size:11px;color:var(--tm-muted);}.rplay.svelte-ube16v {width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:var(--tm-accent);color:var(--tm-on-accent);flex:none;}.tiles.svelte-ube16v {display:grid;grid-template-columns:repeat(auto-fill, minmax(150px, 1fr));gap:12px;}.tile.svelte-ube16v {position:relative;border-radius:14px;overflow:hidden;background:var(--tm-fg-4);}.tile.svelte-ube16v:hover {background:var(--tm-fg-8);}.tile.cur.svelte-ube16v {box-shadow:inset 0 0 0 1px var(--tm-accent);}.tbody.svelte-ube16v {display:flex;flex-direction:column;width:100%;border:0;padding:0;background:none;color:inherit;cursor:pointer;text-align:left;font:inherit;}.banner.svelte-ube16v {height:86px;display:flex;width:100%;position:relative;}.live.svelte-ube16v {position:absolute;left:8px;top:8px;display:inline-flex;align-items:center;gap:5px;font-size:9px;font-weight:700;letter-spacing:.8px;padding:3px 7px;border-radius:20px;background:rgba(0, 0, 0, .45);color:#fff;}.live.svelte-ube16v i:where(.svelte-ube16v) {width:5px;height:5px;border-radius:3px;background:var(--tm-live);}.tplay.svelte-ube16v {position:absolute;right:8px;bottom:8px;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:var(--tm-accent);color:var(--tm-on-accent);box-shadow:0 6px 16px rgba(0, 0, 0, .35);opacity:0;transform:translateY(4px);transition:opacity .15s, transform .15s;}.tile.svelte-ube16v:hover .tplay:where(.svelte-ube16v), .tile.cur.svelte-ube16v .tplay:where(.svelte-ube16v), .tbody.svelte-ube16v:focus-visible .tplay:where(.svelte-ube16v) {opacity:1;transform:none;}.tfav.svelte-ube16v {position:absolute;right:6px;top:6px;}.ttext.svelte-ube16v {padding:9px 11px 11px;display:flex;flex-direction:column;min-width:0;}.ttitle.svelte-ube16v {font-size:12.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.tsub.svelte-ube16v {font-size:11px;color:var(--tm-muted);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.cards.svelte-ube16v {display:grid;grid-template-columns:repeat(auto-fill, minmax(124px, 1fr));gap:16px;}.card.svelte-ube16v {display:flex;flex-direction:column;gap:3px;border:0;padding:0;background:none;color:inherit;cursor:pointer;text-align:left;font:inherit;min-width:0;width:100%;}.art.svelte-ube16v {position:relative;display:flex;aspect-ratio:1;border-radius:12px;overflow:hidden;box-shadow:0 10px 24px rgba(0, 0, 0, .28);margin-bottom:6px;transition:transform .15s;}.art.tall.svelte-ube16v {aspect-ratio:.72;border-radius:5px 10px 10px 5px;}.card.svelte-ube16v:hover .art:where(.svelte-ube16v) {transform:translateY(-2px);}.badge.svelte-ube16v {position:absolute;left:8px;top:8px;font-size:10px;font-weight:700;padding:3px 8px;border-radius:20px;background:var(--tm-accent);color:var(--tm-on-accent);}.bprog.svelte-ube16v {position:absolute;left:8px;right:8px;bottom:8px;background:rgba(0, 0, 0, .45);}.ctitle.svelte-ube16v {font-size:12.5px;font-weight:600;line-height:1.3;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical;}.csub.svelte-ube16v {font-size:11px;color:var(--tm-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.csub.done.svelte-ube16v {color:var(--tm-accent);}.bwrap.svelte-ube16v {position:relative;}.bfav.svelte-ube16v {position:absolute;right:6px;top:6px;}.hist.svelte-ube16v {display:flex;flex-direction:column;}.hrow.svelte-ube16v {display:flex;align-items:center;gap:12px;padding:8px;border-radius:10px;}.hrow.svelte-ube16v:hover {background:var(--tm-fg-5);}.hrow.cur.svelte-ube16v {background:var(--tm-accent-8);}.htext.svelte-ube16v {flex:1;min-width:0;display:flex;flex-direction:column;border:0;padding:0;background:none;color:inherit;cursor:pointer;text-align:left;font:inherit;}.htitle.svelte-ube16v {font-size:12.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.hmeta.svelte-ube16v {font-size:11px;color:var(--tm-muted);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.hplay.svelte-ube16v {width:30px;height:30px;flex:none;border:0;border-radius:50%;background:var(--tm-fg-8);color:var(--tm-fg);cursor:pointer;display:grid;place-items:center;}.hplay.svelte-ube16v:hover {background:var(--tm-accent);color:var(--tm-on-accent);}.pls.svelte-ube16v {display:grid;gap:8px;}.pl.svelte-ube16v {border-radius:14px;background:var(--tm-fg-4);}.pl.open.svelte-ube16v {background:var(--tm-fg-6);}.plhead.svelte-ube16v {display:flex;align-items:center;gap:10px;padding:10px;}.mosaic.svelte-ube16v {position:relative;width:52px;height:52px;flex:none;border:0;padding:0;border-radius:10px;overflow:hidden;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;background:var(--tm-fg-8);cursor:pointer;}.mosaic.svelte-ube16v > .cover {width:100% !important;height:100% !important;}.mplay.svelte-ube16v {position:absolute;inset:0;display:grid;place-items:center;background:rgba(0, 0, 0, .45);color:#fff;opacity:0;transition:opacity .15s;}.mosaic.svelte-ube16v:hover .mplay:where(.svelte-ube16v), .mosaic.svelte-ube16v:focus-visible .mplay:where(.svelte-ube16v) {opacity:1;}.pltext.svelte-ube16v {flex:1;min-width:0;display:flex;flex-direction:column;gap:2px;}.plname.svelte-ube16v {border:0;padding:0;background:none;color:var(--tm-fg);font:inherit;font-size:13px;font-weight:650;text-align:left;cursor:text;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.rename.svelte-ube16v {width:100%;height:26px;padding:0 8px;border-radius:7px;border:1px solid var(--tm-accent);background:var(--tm-fg-4);color:var(--tm-fg);font:inherit;font-size:13px;outline:none;}.plmeta.svelte-ube16v {font-size:11px;color:var(--tm-muted);}.plbtn.svelte-ube16v {height:30px;min-width:30px;padding:0 8px;border:0;border-radius:8px;background:var(--tm-fg-6);color:var(--tm-fg);cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;font-size:12px;font-weight:600;flex:none;}.plbtn.svelte-ube16v:hover {background:var(--tm-fg-12);}.plbtn.primary.svelte-ube16v {background:var(--tm-accent);color:var(--tm-on-accent);padding:0 12px;}.plbtn.danger.svelte-ube16v {background:color-mix(in srgb, var(--tm-live) 25%, transparent);color:var(--tm-live);}.plitems.svelte-ube16v {padding:0 10px 10px 72px;display:flex;flex-direction:column;}.plrow.svelte-ube16v {display:flex;align-items:center;gap:10px;padding:5px 6px;border-radius:8px;}.plrow.svelte-ube16v:hover {background:var(--tm-fg-5);}.plrow.cur.svelte-ube16v .pltitle:where(.svelte-ube16v) {color:var(--tm-accent);}.pltitle.svelte-ube16v {flex:1;min-width:0;display:flex;flex-direction:column;border:0;padding:0;background:none;color:var(--tm-fg);font:inherit;font-size:12px;font-weight:600;text-align:left;cursor:pointer;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}.pltitle.svelte-ube16v small:where(.svelte-ube16v) {font-size:10.5px;font-weight:400;color:var(--tm-muted);}.plrm.svelte-ube16v {width:24px;height:24px;border:0;border-radius:6px;background:none;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;}.plrm.svelte-ube16v:hover {background:var(--tm-fg-8);color:var(--tm-fg);}.welcome.svelte-ube16v {margin-top:26px;padding:34px 28px;border-radius:18px;text-align:center;background:var(--tm-fg-4);border:1px dashed var(--tm-fg-14);}.wicon.svelte-ube16v {width:54px;height:54px;margin:0 auto 12px;border-radius:16px;display:grid;place-items:center;background:var(--tm-accent-12);color:var(--tm-accent);}.welcome.svelte-ube16v h2:where(.svelte-ube16v) {font-size:17px;margin:0;}.welcome.svelte-ube16v p:where(.svelte-ube16v) {font-size:12.5px;color:var(--tm-muted);max-width:440px;margin:8px auto 0;line-height:1.55;}.cta.svelte-ube16v {display:flex;justify-content:center;flex-wrap:wrap;gap:8px;margin-top:18px;}.cta.svelte-ube16v button:where(.svelte-ube16v) {height:32px;padding:0 16px;border-radius:16px;border:1px solid var(--tm-fg-14);background:var(--tm-panel);color:var(--tm-fg);font-size:12px;font-weight:600;cursor:pointer;}.cta.svelte-ube16v button:where(.svelte-ube16v):hover {border-color:var(--tm-accent);}\n  @media (prefers-reduced-motion: reduce) {.art.svelte-ube16v, .tplay.svelte-ube16v {transition:none;} }"
};
function fr(r, i) {
	j(i, !0), _(r, dr);
	let o = Z(i, "store", 7), l = [
		["all", "All"],
		["radio", "Radio"],
		["podcast", "Podcasts"],
		["book", "Audiobooks"]
	], f = X(() => o().libraryCounts), v = (t) => t === "all" ? e(f).radio + e(f).podcast + e(f).book : e(f)[t], y = X(() => o().libQuery.trim().toLowerCase()), b = (...t) => !e(y) || t.some((t) => t.toLowerCase().includes(e(y))), x = (e) => o().libKind === "all" || o().libKind === e, C = (e) => o().libKind === "all" ? e.slice(0, 8) : e, T = X(() => {
		let e = {};
		for (let t of o().history) {
			let n = o().items[t.id];
			n?.type === "podcast" && (e[n.show] = Math.max(e[n.show] ?? 0, t.at));
		}
		return e;
	});
	function O(e, t, n, r) {
		let i = o().libSort;
		return [...e].sort((e, a) => i === "title" ? n(e).localeCompare(n(a)) : i === "added" ? (o().addedAt[t(a)] ?? 0) - (o().addedAt[t(e)] ?? 0) : r(a) - r(e) || (o().addedAt[t(a)] ?? 0) - (o().addedAt[t(e)] ?? 0));
	}
	let ee = X(() => O(Object.values(o().favorites).map((e) => o().items[e.id] ?? e).filter((e) => b(e.title, e.sub)), (e) => e.id, (e) => e.title, (e) => o().lastPlayed(e.id))), ne = X(() => O(Object.values(o().subscribed).filter((e) => b(e.title, e.author)), (e) => `show:${e.slug}`, (e) => e.title, (t) => e(T)[t.slug] ?? 0)), M = X(() => O(o().libraryBooks.filter((e) => b(e.title, e.sub)), (e) => e.id, (e) => e.title, (e) => o().lastPlayed(e.id))), N = X(() => o().inProgress.filter((e) => {
		let t = o().items[e];
		return x(t.type) && b(t.title, t.sub);
	})), ie = X(() => o().history.filter((e) => {
		let t = o().items[e.id];
		return t && x(t.type) && b(t.title, t.sub);
	})), P = X(() => v("all") === 0 && !o().history.length && !o().inProgress.length && !o().playlists.length), ae = X(() => o().playlists.filter((e) => b(e.name, ...e.ids.map((e) => o().items[e]?.title ?? "")))), L = I(null), z = I(null), B = I(""), H = I(null);
	function le(e) {
		if (o().played[e.id]) return {
			pct: 100,
			label: "Finished"
		};
		let t = o().progressOf(e.id), n = o().durOf(e.id);
		return t > 5 && n ? {
			pct: Math.min(100, Math.round(t / n * 100)),
			label: `${E((n - t) / o().speedFor(e.id))} left`
		} : {
			pct: 0,
			label: "Not started"
		};
	}
	let W = (e) => {
		o().libKind = e;
	};
	var ue = ur(), K = F(ue), Y = V(G(K), 2), de = G(Y);
	$(de, {
		get d() {
			return Q.search;
		},
		size: 13,
		stroke: 2
	});
	var fe = V(de, 2);
	oe(fe), R(Y), R(K);
	var pe = V(K, 2);
	Nn(pe, { get store() {
		return o();
	} });
	var me = V(pe, 2), he = G(me);
	n(he, 21, () => l, ([e, t]) => e, (n, r) => {
		var i = X(() => re(e(r), 2));
		let a = () => e(i)[0], s = () => e(i)[1];
		var l = Pn();
		let d;
		var f = G(l, !0), p = V(f), m = D(p, !0);
		R(l), J((e) => {
			d = c(l, 1, "chip svelte-ube16v", null, d, { on: o().libKind === a() }), t(l, "aria-pressed", o().libKind === a()), S(f, s()), S(m, e);
		}, [() => v(a())]), w("click", l, () => o().libKind = a()), u(n, l);
	}), R(he);
	var ge = V(he, 2), _e = V(G(ge)), ve = G(_e);
	ve.value = ve.__value = "recent";
	var ye = V(ve);
	ye.value = ye.__value = "added";
	var be = V(ye);
	be.value = be.__value = "title", R(_e), h(_e), R(ge), R(me);
	var xe = V(me, 2), Se = (e) => {
		var t = Fn(), n = G(t), r = G(n);
		$(r, {
			get d() {
				return Q.library;
			},
			size: 26,
			stroke: 1.6
		}), R(n);
		var i = V(n, 6), a = G(i), s = V(a, 2), c = V(s, 2);
		R(i), R(t), w("click", a, () => o().tab = "radio"), w("click", s, () => {
			o().tab = "pod", o().showSlug = null;
		}), w("click", c, () => {
			o().tab = "book", o().bookId = null;
		}), u(e, t);
	}, Ce = (r) => {
		var i = lr(), l = F(i), f = (r) => {
			var i = Ln(), s = G(i), c = V(G(s)), l = D(c, !0);
			R(s);
			var d = V(s, 2);
			n(d, 20, () => C(e(N)), (e) => e, (n, r) => {
				let i = X(() => o().items[r]);
				var s = In(), c = G(s);
				q(c, {
					get hue() {
						return e(i).hue;
					},
					get art() {
						return e(i).art;
					},
					size: 52,
					radius: 9,
					get mark() {
						return e(i).mark;
					}
				});
				var l = V(c, 2), d = G(l), f = D(d, !0), p = V(d, 2), m = D(p, !0), h = V(p, 2), g = G(h);
				let _;
				R(h);
				var v = V(h, 2), y = D(v, !0);
				R(l);
				var b = V(l, 2), x = G(b);
				{
					let t = X(() => o().isPlaying(r) ? Q.pause : Q.play);
					$(x, {
						get d() {
							return e(t);
						},
						size: 13
					});
				}
				R(b), R(s), J((n, r, o) => {
					t(s, "aria-label", `${n ?? ""} ${e(i).title ?? ""}`), S(f, se[e(i).type]), S(m, e(i).title), _ = a(g, "", _, { width: r }), S(y, o);
				}, [
					() => o().isPlaying(r) ? "Pause" : "Resume",
					() => `${o().pctOf(r) ?? ""}%`,
					() => o().leftOf(r)
				]), w("click", s, () => o().play(r)), u(n, s);
			}), R(d), R(i), J(() => S(l, e(N).length)), u(r, i);
		};
		s(l, (t) => {
			e(N).length && t(f);
		});
		var p = V(l, 2), h = (r) => {
			var i = Wn(), a = G(i), l = V(G(a)), f = D(l, !0);
			R(a);
			var p = V(a, 2);
			n(p, 21, () => e(ae), (e) => e.id, (r, i) => {
				let a = X(() => e(i).ids.map((e) => o().items[e]).filter(Boolean)), l = X(() => o().playlistDuration(e(i)));
				var f = Un();
				let p;
				var h = G(f), _ = G(h), v = G(_);
				n(v, 17, () => e(a).slice(0, 4), (e) => e.id, (t, n) => {
					q(t, {
						get hue() {
							return e(n).hue;
						},
						get art() {
							return e(n).art;
						},
						fill: !0,
						radius: 0,
						get mark() {
							return e(n).mark;
						},
						font: 8
					});
				});
				var y = V(v, 2), b = G(y);
				$(b, {
					get d() {
						return Q.play;
					},
					size: 14
				}), R(y), R(_);
				var x = V(_, 2), C = G(x), T = (t) => {
					var n = Rn(), r = G(n);
					oe(r), d(r, (e) => Kt?.(e)), te(() => m(r, () => e(B), (e) => k(B, e))), R(n), g("submit", n, (t) => {
						t.preventDefault(), o().renamePlaylist(e(i).id, e(B)), k(z, null);
					}), g("blur", r, () => {
						o().renamePlaylist(e(i).id, e(B)), k(z, null);
					}), w("keydown", r, (e) => {
						e.key === "Escape" && (e.stopPropagation(), k(z, null));
					}), u(t, n);
				}, O = (t) => {
					var n = zn(), r = D(n, !0);
					J(() => S(r, e(i).name)), w("click", n, () => {
						k(z, e(i).id, !0), k(B, e(i).name, !0);
					}), u(t, n);
				};
				s(C, (t) => {
					e(z) === e(i).id ? t(T) : t(O, -1);
				});
				var ee = V(C, 2), A = D(ee);
				R(x);
				var ne = V(x, 2), j = G(ne);
				$(j, {
					get d() {
						return Q.play;
					},
					size: 12
				}), U(), R(ne);
				var M = V(ne, 2), re = G(M);
				$(re, {
					get d() {
						return Q.shuffle;
					},
					size: 13,
					stroke: 1.8
				}), R(M);
				var N = V(M, 2), ie = G(N);
				{
					let t = X(() => e(L) === e(i).id ? Q.up : Q.down);
					$(ie, {
						get d() {
							return e(t);
						},
						size: 13,
						stroke: 2
					});
				}
				R(N);
				var P = V(N, 2);
				let F;
				var ae = G(P);
				$(ae, {
					get d() {
						return Q.trash;
					},
					size: 13,
					stroke: 1.8
				}), R(P), R(h);
				var I = V(h, 2), ce = (r) => {
					var s = Hn();
					n(s, 21, () => e(a), (e) => e.id, (n, r) => {
						var a = Bn();
						let s;
						var l = G(a);
						q(l, {
							get hue() {
								return e(r).hue;
							},
							get art() {
								return e(r).art;
							},
							size: 30,
							radius: 6,
							get mark() {
								return e(r).mark;
							},
							font: 8
						});
						var d = V(l, 2), f = G(d, !0), p = V(f), m = D(p);
						R(d);
						var h = V(d, 2), g = G(h);
						$(g, {
							get d() {
								return Q.close;
							},
							size: 11,
							stroke: 2
						}), R(h), R(a), J((n) => {
							s = c(a, 1, "plrow svelte-ube16v", null, s, { cur: e(r).id === o().now }), S(f, e(r).title), S(m, `${se[e(r).type] ?? ""}${n ?? ""}`), t(h, "aria-label", `Remove ${e(r).title ?? ""} from ${e(i).name ?? ""}`);
						}, [() => o().lenOf(e(r).id) ? ` · ${o().lenOf(e(r).id)}` : ""]), w("click", d, () => o().play(e(r).id)), w("click", h, () => o().removeFromPlaylist(e(i).id, e(r).id)), u(n, a);
					}, (e) => {
						var t = Vn();
						u(e, t);
					}), R(s), u(r, s);
				};
				s(I, (t) => {
					e(L) === e(i).id && t(ce);
				}), R(f), J((n) => {
					p = c(f, 1, "pl svelte-ube16v", null, p, { open: e(L) === e(i).id }), t(_, "aria-label", `Play ${e(i).name ?? ""}`), S(A, `${e(a).length ?? ""} item${e(a).length === 1 ? "" : "s"}${n ?? ""}`), t(M, "aria-label", `Shuffle ${e(i).name ?? ""}`), t(N, "aria-expanded", e(L) === e(i).id), t(N, "aria-label", `${e(L) === e(i).id ? "Hide" : "Show"} items in ${e(i).name ?? ""}`), F = c(P, 1, "plbtn svelte-ube16v", null, F, { danger: e(H) === e(i).id }), t(P, "aria-label", e(H) === e(i).id ? `Confirm delete ${e(i).name}` : `Delete ${e(i).name}`), t(P, "title", e(H) === e(i).id ? "Click again to delete" : "Delete playlist");
				}, [() => e(l) ? ` · ${E(e(l))}` : ""]), w("click", _, () => o().playPlaylist(e(i).id)), w("click", ne, () => o().playPlaylist(e(i).id)), w("click", M, () => o().playPlaylist(e(i).id, !0)), w("click", N, () => k(L, e(L) === e(i).id ? null : e(i).id, !0)), w("click", P, () => {
					e(H) === e(i).id ? (o().deletePlaylist(e(i).id), k(H, null)) : k(H, e(i).id, !0);
				}), g("blur", P, () => {
					e(H) === e(i).id && k(H, null);
				}), u(r, f);
			}), R(p), R(i), J(() => S(f, e(ae).length)), u(r, i);
		};
		s(p, (t) => {
			o().libKind === "all" && e(ae).length && t(h);
		});
		var _ = V(p, 2), v = (r) => {
			var i = Xn(), a = G(i), l = V(G(a)), d = D(l, !0), f = V(l), p = (e) => {
				var t = Gn();
				w("click", t, () => W("radio")), u(e, t);
			};
			s(f, (t) => {
				o().libKind === "all" && e(ee).length > 8 && t(p);
			}), R(a);
			var m = V(a, 2), h = (r) => {
				var i = qn();
				n(i, 21, () => C(e(ee)), (e) => e.id, (n, r) => {
					let i = X(() => o().isPlaying(e(r).id)), a = X(() => o().songOf(e(r).stationId));
					var s = Kn();
					let l;
					var d = G(s), f = G(d), p = G(f);
					q(p, {
						get hue() {
							return e(r).hue;
						},
						get art() {
							return e(r).art;
						},
						fill: !0,
						radius: 0,
						get mark() {
							return e(r).mark;
						},
						font: 18
					});
					var m = V(p, 4), h = G(m);
					{
						let t = X(() => e(i) ? Q.stop : Q.play);
						$(h, {
							get d() {
								return e(t);
							},
							size: 14
						});
					}
					R(m), R(f);
					var g = V(f, 2), _ = G(g), v = D(_, !0), y = V(_), b = D(y, !0);
					R(g), R(d);
					var x = V(d, 2);
					Tn(G(x), {
						get store() {
							return o();
						},
						get id() {
							return e(r).id;
						},
						size: 14,
						solid: !0
					}), R(x), R(s), J(() => {
						l = c(s, 1, "tile svelte-ube16v", null, l, { cur: e(r).id === o().now }), t(d, "aria-label", `${e(i) ? "Stop" : "Play"} ${e(r).title ?? ""}`), S(v, e(r).title), S(b, e(a) ? `♪ ${e(a)}` : e(r).sub);
					}), w("click", d, () => e(i) ? o().stop() : o().play(e(r).id)), u(n, s);
				}), R(i), u(r, i);
			}, g = (t) => {
				var n = Yn(), r = G(n), i = V(r), a = (e) => {
					var t = Jn();
					w("click", t, () => o().tab = "radio"), u(e, t);
				};
				s(i, (t) => {
					e(y) || t(a);
				}), R(n), J(() => S(r, `${e(y) ? "No favorite stations match." : "Tap ♥ on any station to keep it here."} `)), u(t, n);
			};
			s(m, (t) => {
				e(ee).length ? t(h) : t(g, -1);
			}), R(i), J(() => S(d, e(ee).length)), u(r, i);
		}, b = X(() => x("radio"));
		s(_, (t) => {
			e(b) && t(v);
		});
		var T = V(_, 2), O = (t) => {
			var r = tr(), i = G(r), a = V(G(i)), c = D(a, !0), l = V(a), d = (e) => {
				var t = Gn();
				w("click", t, () => W("podcast")), u(e, t);
			};
			s(l, (t) => {
				o().libKind === "all" && e(ne).length > 8 && t(d);
			}), R(i);
			var f = V(i, 2), p = (t) => {
				var r = $n();
				n(r, 21, () => C(e(ne)), (e) => e.slug, (t, n) => {
					let r = X(() => o().newCount(e(n).slug));
					var i = Qn(), a = G(i), c = G(a);
					q(c, {
						get hue() {
							return e(n).hue;
						},
						get art() {
							return e(n).art;
						},
						fill: !0,
						radius: 0,
						get mark() {
							return e(n).mark;
						},
						font: 18
					});
					var l = V(c), d = (t) => {
						var n = Zn(), i = D(n);
						J(() => S(i, `${e(r) ?? ""} new`)), u(t, n);
					};
					s(l, (t) => {
						e(r) && t(d);
					}), R(a);
					var f = V(a, 2), p = D(f, !0), m = V(f, 2), h = D(m, !0);
					R(i), J(() => {
						S(p, e(n).title), S(h, e(n).author || e(n).category || "Podcast");
					}), w("click", i, () => o().openShow(e(n).slug)), u(t, i);
				}), R(r), u(t, r);
			}, m = (t) => {
				var n = Yn(), r = G(n), i = V(r), a = (e) => {
					var t = er();
					w("click", t, () => {
						o().tab = "pod", o().showSlug = null;
					}), u(e, t);
				};
				s(i, (t) => {
					e(y) || t(a);
				}), R(n), J(() => S(r, `${e(y) ? "No shows match." : "Subscribe to a show and its new episodes come to you."} `)), u(t, n);
			};
			s(f, (t) => {
				e(ne).length ? t(p) : t(m, -1);
			}), R(r), J(() => S(c, e(ne).length)), u(t, r);
		}, A = X(() => x("podcast"));
		s(T, (t) => {
			e(A) && t(O);
		});
		var j = V(T, 2), re = (t) => {
			var r = or(), i = G(r), l = V(G(i)), d = D(l, !0), f = V(l), p = (e) => {
				var t = Gn();
				w("click", t, () => W("book")), u(e, t);
			};
			s(f, (t) => {
				o().libKind === "all" && e(M).length > 8 && t(p);
			}), R(i);
			var m = V(i, 2), h = (t) => {
				var r = ir();
				n(r, 21, () => C(e(M)), (e) => e.id, (t, n) => {
					let r = X(() => le(e(n)));
					var i = rr(), l = G(i), d = G(l), f = G(d);
					q(f, {
						get hue() {
							return e(n).hue;
						},
						get art() {
							return e(n).art;
						},
						fill: !0,
						radius: 0,
						get mark() {
							return e(n).mark;
						},
						font: 18
					});
					var p = V(f, 2), m = (t) => {
						var n = nr(), i = G(n);
						let o;
						R(n), J(() => o = a(i, "", o, { width: `${e(r).pct ?? ""}%` })), u(t, n);
					};
					s(p, (t) => {
						e(r).pct && t(m);
					}), R(d);
					var h = V(d, 2), g = D(h, !0), _ = V(h, 2);
					let v;
					var y = D(_, !0);
					R(l);
					var b = V(l, 2);
					Tn(G(b), {
						get store() {
							return o();
						},
						get id() {
							return e(n).id;
						},
						size: 13,
						solid: !0
					}), R(b), R(i), J(() => {
						S(g, e(n).title), v = c(_, 1, "csub svelte-ube16v", null, v, { done: e(r).pct === 100 }), S(y, e(r).pct === 100 ? "✓ Finished" : e(r).label);
					}), w("click", l, () => o().openBook(e(n).id)), u(t, i);
				}), R(r), u(t, r);
			}, g = (t) => {
				var n = Yn(), r = G(n), i = V(r), a = (e) => {
					var t = ar();
					w("click", t, () => {
						o().tab = "book", o().bookId = null;
					}), u(e, t);
				};
				s(i, (t) => {
					e(y) || t(a);
				}), R(n), J(() => S(r, `${e(y) ? "No audiobooks match." : "Save a book, or start one, and it shows up here with your place."} `)), u(t, n);
			};
			s(m, (t) => {
				e(M).length ? t(h) : t(g, -1);
			}), R(r), J(() => S(d, e(M).length)), u(t, r);
		}, P = X(() => x("book"));
		s(j, (t) => {
			e(P) && t(re);
		});
		var I = V(j, 2), ue = (r) => {
			var i = cr(), a = G(i), s = V(G(a)), l = D(s, !0), d = V(s);
			R(a);
			var f = V(a, 2);
			n(f, 21, () => C(e(ie)), (e) => e.id, (n, r) => {
				let i = X(() => o().items[e(r).id]);
				var a = sr();
				let s;
				var l = G(a);
				q(l, {
					get hue() {
						return e(i).hue;
					},
					get art() {
						return e(i).art;
					},
					size: 38,
					radius: 8,
					get mark() {
						return e(i).mark;
					},
					font: 10
				});
				var d = V(l, 2), f = G(d), p = D(f, !0), m = V(f, 2), h = D(m);
				R(d);
				var g = V(d, 2);
				Tn(g, {
					get store() {
						return o();
					},
					get id() {
						return e(r).id;
					},
					size: 14
				});
				var _ = V(g, 2);
				rn(_, {
					get store() {
						return o();
					},
					get id() {
						return e(r).id;
					}
				});
				var v = V(_, 2), y = G(v);
				{
					let t = X(() => o().isPlaying(e(r).id) ? e(i).type === "radio" ? Q.stop : Q.pause : Q.play);
					$(y, {
						get d() {
							return e(t);
						},
						size: 12
					});
				}
				R(v), R(a), J((n, l, u) => {
					s = c(a, 1, "hrow svelte-ube16v", null, s, { cur: e(r).id === o().now }), S(p, e(i).title), S(h, `${se[e(i).type] ?? ""} · ${n ?? ""} · ${l ?? ""}`), t(v, "aria-label", `${u ?? ""} ${e(i).title ?? ""}`);
				}, [
					() => e(i).type === "radio" ? e(i).sub : o().leftOf(e(r).id) || e(i).sub,
					() => ce(new Date(e(r).at).toISOString()),
					() => o().isPlaying(e(r).id) ? e(i).type === "radio" ? "Stop" : "Pause" : "Play"
				]), w("click", d, () => o().play(e(r).id)), w("click", v, () => o().isPlaying(e(r).id) && e(i).type === "radio" ? o().stop() : o().play(e(r).id)), u(n, a);
			}), R(f), R(i), J(() => S(l, e(ie).length)), w("click", d, () => o().clearHistory()), u(r, i);
		};
		s(I, (t) => {
			e(ie).length && t(ue);
		}), u(r, i);
	};
	s(xe, (t) => {
		e(P) ? t(Se) : t(Ce, -1);
	}), m(fe, () => o().libQuery, (e) => o().libQuery = e), p(_e, () => o().libSort, (e) => o().libSort = e), u(r, ue), A();
}
C(["click", "keydown"]);
//#endregion
//#region src/components/RadioView.svelte
var pr = l("<span class=\"dist svelte-1c0iuue\"> </span>"), mr = l("<div class=\"song svelte-1c0iuue\"> </div>"), hr = l("<div><!> <div class=\"text svelte-1c0iuue\"><div class=\"title svelte-1c0iuue\"> </div> <div class=\"sub svelte-1c0iuue\"><!> </div> <!></div> <!> <button class=\"play svelte-1c0iuue\"><!></button></div>"), gr = l("<button title=\"Stations near you, nearest first\"><!> </button>"), _r = l("<button> </button>"), vr = l("<div class=\"nearhead svelte-1c0iuue\"><span class=\"pinmark svelte-1c0iuue\"><!></span> <div class=\"where svelte-1c0iuue\"><b class=\"svelte-1c0iuue\"> </b><small class=\"svelte-1c0iuue\"> </small></div> <button class=\"again svelte-1c0iuue\" aria-label=\"Find stations near me again\" title=\"Update my location\"><!></button> <button class=\"playnear svelte-1c0iuue\"><!>Play nearest</button></div> <div class=\"grid svelte-1c0iuue\"></div>", 1), yr = l("<div class=\"line svelte-1c0iuue\" role=\"status\"><span class=\"spin svelte-1c0iuue\" aria-hidden=\"true\"></span>Finding where you are…</div>"), br = l("<div class=\"line svelte-1c0iuue\" role=\"alert\">Location is off for this panel. Allow it in your browser's site settings, then <button class=\"svelte-1c0iuue\">try again</button>.</div>"), xr = l("<div class=\"line svelte-1c0iuue\">This browser can't share a location, so stations near you can't be found.</div>"), Sr = l("<div class=\"line svelte-1c0iuue\"> <button class=\"svelte-1c0iuue\">Try again</button></div>"), Cr = l("<button class=\"more svelte-1c0iuue\">Show more stations</button>"), wr = l("<div class=\"grid svelte-1c0iuue\"></div> <!> <!>", 1), Tr = l("<h1 class=\"h1 svelte-1c0iuue\">Radio</h1> <p class=\"lede svelte-1c0iuue\">Live stations from OndaCast, most listened first. Search above for any station by name, city or genre.</p> <div class=\"genres svelte-1c0iuue\" role=\"group\" aria-label=\"Genre\"><!> <!></div> <!>", 1), Er = {
	hash: "svelte-1c0iuue",
	code: ".h1.svelte-1c0iuue {font-size:26px;font-weight:650;letter-spacing:-.5px;margin:0;}.lede.svelte-1c0iuue {font-size:13px;color:var(--tm-muted);margin:4px 0 0;}.genres.svelte-1c0iuue {display:flex;flex-wrap:wrap;gap:8px;margin-top:18px;}.chip.svelte-1c0iuue {height:30px;padding:0 14px;border-radius:15px;border:1px solid var(--tm-fg-16);background:transparent;color:var(--tm-fg);font-size:12px;font-weight:500;cursor:pointer;}.chip.on.svelte-1c0iuue {border-color:var(--tm-accent);background:var(--tm-accent);color:var(--tm-on-accent);}.chip.near.svelte-1c0iuue {display:inline-flex;align-items:center;gap:5px;padding:0 13px 0 10px;}.chip.near.svelte-1c0iuue:not(.on) {color:var(--tm-accent);border-color:color-mix(in srgb, var(--tm-accent) 45%, transparent);}.nearhead.svelte-1c0iuue {display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-top:18px;padding:10px 10px 10px 12px;border-radius:14px;border:1px solid var(--tm-fg-7);}.pinmark.svelte-1c0iuue {width:32px;height:32px;border-radius:16px;display:grid;place-items:center;flex:none;color:var(--tm-accent);background:var(--tm-accent-8);}.where.svelte-1c0iuue {flex:1;min-width:150px;display:flex;flex-direction:column;gap:1px;}.where.svelte-1c0iuue b:where(.svelte-1c0iuue) {color:var(--tm-fg);font-size:13px;font-weight:650;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.where.svelte-1c0iuue small:where(.svelte-1c0iuue) {color:var(--tm-muted);font-size:11.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.again.svelte-1c0iuue {width:30px;height:30px;border-radius:15px;border:0;background:transparent;color:var(--tm-muted);display:grid;place-items:center;cursor:pointer;flex:none;}.again.svelte-1c0iuue:hover {background:var(--tm-fg-7);color:var(--tm-fg);}.playnear.svelte-1c0iuue {display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 14px;border-radius:15px;border:0;background:var(--tm-accent);color:var(--tm-on-accent);font-size:12px;font-weight:600;cursor:pointer;flex:none;}.grid.svelte-1c0iuue {display:grid;grid-template-columns:repeat(auto-fill, minmax(min(100%, 250px), 1fr));gap:10px;margin-top:18px;}.nearhead.svelte-1c0iuue + .grid:where(.svelte-1c0iuue) {margin-top:10px;}.row.svelte-1c0iuue {display:flex;align-items:center;gap:10px;padding:12px;border-radius:14px;min-width:0;}.row.svelte-1c0iuue:hover {background:var(--tm-fg-7);}.row.cur.svelte-1c0iuue {background:var(--tm-accent-8);}.text.svelte-1c0iuue {flex:1;min-width:0;}.title.svelte-1c0iuue {font-size:13.5px;font-weight:600;line-height:1.3;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical;overflow-wrap:anywhere;}.cur.svelte-1c0iuue .title:where(.svelte-1c0iuue) {color:var(--tm-accent);}.sub.svelte-1c0iuue {font-size:11.5px;color:var(--tm-muted);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.dist.svelte-1c0iuue {display:inline-block;margin-right:6px;padding:0 6px;border-radius:6px;background:var(--tm-fg-7);color:var(--tm-fg);font-weight:600;font-size:10.5px;line-height:16px;font-variant-numeric:tabular-nums;}.song.svelte-1c0iuue {font-size:11.5px;margin-top:5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;opacity:.85;}.more.svelte-1c0iuue {display:block;margin:18px auto 0;height:32px;padding:0 18px;border-radius:16px;border:1px solid var(--tm-fg-14);background:transparent;color:var(--tm-fg);font-size:12px;cursor:pointer;}.more.svelte-1c0iuue:hover {background:var(--tm-fg-6);}.play.svelte-1c0iuue {width:36px;height:36px;border:0;border-radius:18px;background:var(--tm-accent);color:var(--tm-on-accent);cursor:pointer;display:grid;place-items:center;flex:none;}.line.svelte-1c0iuue {display:flex;flex-wrap:wrap;align-items:center;gap:6px;padding:18px 8px;font-size:12.5px;color:var(--tm-muted);}.line.svelte-1c0iuue button:where(.svelte-1c0iuue) {border:0;background:none;color:var(--tm-accent);font-size:12.5px;cursor:pointer;padding:0;}.spin.svelte-1c0iuue {width:14px;height:14px;margin-right:4px;border-radius:50%;border:2px solid var(--tm-fg-16);border-top-color:var(--tm-accent); animation: svelte-1c0iuue-spin .8s linear infinite;}\n  @keyframes svelte-1c0iuue-spin { to { transform: rotate(360deg); } }\n  @media (prefers-reduced-motion: reduce) {.spin.svelte-1c0iuue { animation: none;} }"
};
function Dr(r, i) {
	j(i, !0), _(r, Er);
	let a = (n, r = ie, i = ie) => {
		let a = X(() => o().songOf(r().stationId)), l = X(() => o().isPlaying(r().id));
		var d = hr();
		let f;
		var p = G(d);
		q(p, {
			get hue() {
				return r().hue;
			},
			get art() {
				return r().art;
			},
			size: 56,
			radius: 12,
			get mark() {
				return r().mark;
			},
			font: 12
		});
		var m = V(p, 2), h = G(m), g = D(h, !0), _ = V(h, 2), v = G(_), y = (e) => {
			var t = pr(), n = D(t, !0);
			J(() => S(n, i())), u(e, t);
		};
		s(v, (e) => {
			i() && e(y);
		});
		var b = V(v, 1, !0);
		R(_);
		var x = V(_, 2), C = (t) => {
			var n = mr(), r = D(n);
			J(() => S(r, `♪ ${e(a) ?? ""}`)), u(t, n);
		};
		s(x, (t) => {
			e(a) && t(C);
		}), R(m);
		var T = V(m, 2);
		Tn(T, {
			get store() {
				return o();
			},
			get id() {
				return r().id;
			}
		});
		var E = V(T, 2), O = G(E);
		{
			let t = X(() => e(l) ? Q.stop : Q.play);
			$(O, {
				get d() {
					return e(t);
				},
				size: 14
			});
		}
		R(E), R(d), J(() => {
			f = c(d, 1, "row svelte-1c0iuue", null, f, { cur: r().id === o().now }), S(g, r().title), S(b, r().sub), t(E, "aria-label", `${e(l) ? "Stop" : "Play"} ${r().title ?? ""}`);
		}), w("click", E, () => e(l) ? o().stop() : o().play(r().id)), u(n, d);
	}, o = Z(i, "store", 7), l = X(() => o().stationList), d = X(() => o().genre === Ct), f = X(() => o().near), p = Qe(typeof navigator < "u" ? navigator.language : "");
	z(() => {
		o().radioStatus === "idle" && o().loadRadio();
	}), z(() => {
		!e(d) && e(l).status === "idle" && o().loadStations(o().genre);
	});
	function m() {
		(e(d) || e(f).status !== "ready") && o().loadNearby(), o().genre = Ct;
	}
	function h() {
		let e = o().nearestStation();
		e && o().play(e.id);
	}
	var g = Tr(), v = V(F(g), 4), y = G(v), b = (n) => {
		var r = gr();
		let i;
		var a = G(r);
		$(a, {
			get d() {
				return Q.pin;
			},
			size: 13
		});
		var o = V(a, 1, !0);
		R(r), J(() => {
			i = c(r, 1, "chip near svelte-1c0iuue", null, i, { on: e(d) }), t(r, "aria-pressed", e(d)), S(o, Ct);
		}), w("click", r, m), u(n, r);
	};
	s(y, (e) => {
		o().nearbySupported && e(b);
	});
	var x = V(y, 2);
	n(x, 17, () => he, (e) => e.label, (n, r) => {
		var i = _r();
		let a;
		var s = D(i, !0);
		J(() => {
			a = c(i, 1, "chip svelte-1c0iuue", null, a, { on: o().genre === e(r).label }), t(i, "aria-pressed", o().genre === e(r).label), S(s, e(r).label);
		}), w("click", i, () => o().genre = e(r).label), u(n, i);
	}), R(v);
	var C = V(v, 2), T = (t) => {
		var r = le(), i = F(r), c = (t) => {
			var r = vr(), i = F(r), s = G(i), c = G(s);
			$(c, {
				get d() {
					return Q.pin;
				},
				size: 15
			}), R(s);
			var l = V(s, 2), d = G(l), m = D(d, !0), g = V(d), _ = D(g);
			R(l);
			var v = V(l, 2), y = G(v);
			$(y, {
				get d() {
					return Q.refresh;
				},
				size: 16
			}), R(v);
			var b = V(v, 2), x = G(b);
			$(x, {
				get d() {
					return Q.play;
				},
				size: 12
			}), U(), R(b), R(i);
			var C = V(i, 2);
			n(C, 21, () => o().nearStations, (e) => e.id, (t, n) => {
				{
					let r = X(() => $e(e(f).dist[e(n).id], p));
					a(t, () => e(n), () => e(r));
				}
			}), R(C), J(() => {
				S(m, e(f).place ? `Near ${e(f).place}` : "Near you"), S(_, `${e(f).ids.length ?? ""} stations, nearest first`);
			}), w("click", v, () => o().loadNearby()), w("click", b, h), u(t, r);
		}, l = (e) => {
			var t = yr();
			u(e, t);
		}, d = (e) => {
			var t = br(), n = V(G(t));
			U(), R(t), w("click", n, () => o().loadNearby()), u(e, t);
		}, m = (e) => {
			var t = xr();
			u(e, t);
		}, g = (t) => {
			var n = Sr(), r = G(n), i = V(r);
			R(n), J(() => S(r, `No stations found ${e(f).place ? `near ${e(f).place}` : "near you"} yet. `)), w("click", i, () => o().loadNearby()), u(t, n);
		}, _ = (t) => {
			{
				let n = X(() => e(f).status === "idle" ? "loading" : e(f).status);
				mn(t, {
					get status() {
						return e(n);
					},
					retry: () => o().loadNearby(),
					error: "Stations near you could not be found."
				});
			}
		};
		s(i, (t) => {
			e(f).status === "ready" && e(f).ids.length ? t(c) : e(f).status === "locating" ? t(l, 1) : e(f).status === "denied" ? t(d, 2) : e(f).status === "unsupported" ? t(m, 3) : e(f).status === "ready" ? t(g, 4) : t(_, -1);
		}), u(t, r);
	}, E = (t) => {
		var r = wr(), i = F(r);
		n(i, 21, () => o().stations, (e) => e.id, (t, n) => {
			a(t, () => e(n), () => "");
		}), R(i);
		var c = V(i, 2), d = (e) => {
			var t = Cr();
			w("click", t, () => o().loadStations(o().genre, !0)), u(e, t);
		};
		s(c, (t) => {
			e(l).more && e(l).status === "ready" && t(d);
		});
		var f = V(c, 2), p = (t) => {
			{
				let n = X(() => e(l).status === "idle" ? "loading" : e(l).status);
				mn(t, {
					get status() {
						return e(n);
					},
					retry: () => o().loadStations(o().genre, e(l).ids.length > 0),
					empty: "No stations in this genre right now."
				});
			}
		};
		s(f, (t) => {
			(!o().stations.length || e(l).status === "loading" || e(l).status === "error") && t(p);
		}), u(t, r);
	};
	s(C, (t) => {
		e(d) ? t(T) : t(E, -1);
	}), u(r, g), A();
}
C(["click"]);
//#endregion
//#region src/components/Grid.svelte
var Or = l("<button class=\"card svelte-1cebjac\"><span><!></span> <span class=\"title svelte-1cebjac\"> </span> <span class=\"sub svelte-1cebjac\"> </span></button>"), kr = l("<div class=\"grid svelte-1cebjac\"></div>"), Ar = {
	hash: "svelte-1cebjac",
	code: ".grid.svelte-1cebjac {display:grid;grid-template-columns:repeat(auto-fill, minmax(118px, 1fr));gap:16px 14px;margin-top:16px;}.card.svelte-1cebjac {display:flex;flex-direction:column;gap:3px;padding:0;border:0;background:none;color:inherit;text-align:left;cursor:pointer;font:inherit;min-width:0;}.art.svelte-1cebjac {display:flex;aspect-ratio:1;border-radius:12px;overflow:hidden;box-shadow:0 10px 24px rgba(0, 0, 0, .28);margin-bottom:6px;transition:transform .15s;}.art.tall.svelte-1cebjac {aspect-ratio:0.72;}.card.svelte-1cebjac:hover .art:where(.svelte-1cebjac) {transform:translateY(-2px);}.title.svelte-1cebjac {font-size:12.5px;font-weight:600;line-height:1.25;display:-webkit-box;-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}.sub.svelte-1cebjac {font-size:11px;color:var(--tm-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}\n  @media (prefers-reduced-motion: reduce) {.art.svelte-1cebjac {transition:none;} }"
};
function jr(t, r) {
	j(r, !0), _(t, Ar);
	let i = Z(r, "tall", 3, !1);
	var a = kr();
	n(a, 21, () => r.cards, (e) => e.key, (t, n) => {
		var a = Or(), o = G(a);
		let s;
		var l = G(o);
		q(l, {
			get hue() {
				return e(n).hue;
			},
			get art() {
				return e(n).art;
			},
			get mark() {
				return e(n).mark;
			},
			fill: !0,
			radius: 12,
			font: 18
		}), R(o);
		var d = V(o, 2), f = D(d, !0), p = V(d, 2), m = D(p, !0);
		R(a), J(() => {
			s = c(o, 1, "art svelte-1cebjac", null, s, { tall: i() }), S(f, e(n).title), S(m, e(n).sub);
		}), w("click", a, () => r.open(e(n).key)), u(t, a);
	}), R(a), u(t, a), A();
}
C(["click"]);
//#endregion
//#region src/components/PodcastView.svelte
var Mr = l("<button> </button>"), Nr = l("<div class=\"catgroup svelte-1phe8yx\"><div class=\"catlabel svelte-1phe8yx\"> </div> <div class=\"catlist svelte-1phe8yx\"></div></div>"), Pr = l("<div class=\"tm-pop catpop svelte-1phe8yx\" role=\"dialog\" aria-label=\"All categories\"></div>"), Fr = l("<div class=\"genrebar svelte-1phe8yx\"><div class=\"genres svelte-1phe8yx\" role=\"group\" aria-label=\"Category\"></div> <span class=\"anchor svelte-1phe8yx\"><button data-pop=\"\" aria-haspopup=\"dialog\">More<span class=\"caret svelte-1phe8yx\" aria-hidden=\"true\">▾</span></button> <!></span></div>"), Ir = l("<b class=\"svelte-1phe8yx\"> </b>"), Lr = l("<button class=\"chipshow svelte-1phe8yx\"><!><span class=\"svelte-1phe8yx\"> </span><!></button>"), Rr = l("<div class=\"strip svelte-1phe8yx\" aria-label=\"Your shows\"></div>"), zr = l("<button class=\"more svelte-1phe8yx\">Show more</button>"), Br = l("<h1 class=\"h1 svelte-1phe8yx\">Podcasts</h1> <p class=\"lede svelte-1phe8yx\"> </p> <!> <!> <!> <!> <!>", 1), Vr = l("<div class=\"author svelte-1phe8yx\"> </div>"), Hr = l("<p class=\"desc svelte-1phe8yx\"> </p>"), Ur = l("<div class=\"tm-pop pop svelte-1phe8yx\" role=\"dialog\"><div class=\"ptitle svelte-1phe8yx\"> </div> <div class=\"plabel svelte-1phe8yx\">Skip intro</div> <div class=\"opts svelte-1phe8yx\"></div> <div class=\"plabel svelte-1phe8yx\">Skip outro</div> <div class=\"opts svelte-1phe8yx\"></div> <div class=\"plabel svelte-1phe8yx\">Speed for this show</div> <div class=\"opts svelte-1phe8yx\"></div> <label class=\"trow svelte-1phe8yx\"><span class=\"svelte-1phe8yx\"><b class=\"svelte-1phe8yx\">Add new episodes to Up next</b><small class=\"svelte-1phe8yx\">When this show publishes, its new episodes queue up for you.</small></span> <input type=\"checkbox\" role=\"switch\" class=\"svelte-1phe8yx\"/></label></div>"), Wr = l("<div class=\"svelte-1phe8yx\"><dt class=\"svelte-1phe8yx\">Host</dt><dd class=\"svelte-1phe8yx\"> </dd></div>"), Gr = l("<div class=\"svelte-1phe8yx\"><dt class=\"svelte-1phe8yx\">Category</dt><dd class=\"svelte-1phe8yx\"> </dd></div>"), Kr = l("<div class=\"svelte-1phe8yx\"><dt class=\"svelte-1phe8yx\">Episodes</dt><dd class=\"svelte-1phe8yx\"> </dd></div>"), qr = l("<div class=\"svelte-1phe8yx\"><dt class=\"svelte-1phe8yx\">Latest</dt><dd class=\"svelte-1phe8yx\"> </dd></div>"), Jr = l("<div class=\"svelte-1phe8yx\"><dt class=\"svelte-1phe8yx\">Language</dt><dd class=\"svelte-1phe8yx\"> </dd></div>"), Yr = l("<section class=\"about svelte-1phe8yx\" id=\"show-about\"><div class=\"about-text svelte-1phe8yx\"><div class=\"about-h svelte-1phe8yx\">About the show</div> <p class=\"svelte-1phe8yx\"> </p></div> <dl class=\"facts svelte-1phe8yx\"><!> <!> <!> <!> <!> <div class=\"svelte-1phe8yx\"><dt class=\"svelte-1phe8yx\">You</dt><dd class=\"svelte-1phe8yx\"> </dd></div></dl> <button class=\"about-close svelte-1phe8yx\" aria-label=\"Close About\"><!></button></section>"), Xr = l("<div class=\"hero svelte-1phe8yx\"><div class=\"art svelte-1phe8yx\"><!></div> <div class=\"info svelte-1phe8yx\"><div class=\"eyebrow svelte-1phe8yx\"> </div> <h1 class=\"svelte-1phe8yx\"> </h1> <!> <!> <div class=\"actions svelte-1phe8yx\"><button class=\"primary svelte-1phe8yx\"><!>Latest episode</button> <button> </button> <button aria-controls=\"show-about\"><!>About</button> <span class=\"anchor svelte-1phe8yx\"><button class=\"sub icon svelte-1phe8yx\" data-pop=\"\" aria-haspopup=\"dialog\" title=\"Show settings\" aria-label=\"Show settings\"><!>Settings</button> <!></span></div></div></div> <!>", 1), Zr = l("<div class=\"tm-pop menu svelte-1phe8yx\" role=\"menu\"><button role=\"menuitem\" class=\"svelte-1phe8yx\"><!>Play unplayed</button> <button role=\"menuitem\" class=\"svelte-1phe8yx\"><!>Queue unplayed</button> <button role=\"menuitem\" class=\"svelte-1phe8yx\"><!>Mark all as played</button> <button role=\"menuitem\" class=\"svelte-1phe8yx\"><!>Mark all as unplayed</button></div>"), Qr = l("<button> <span class=\"svelte-1phe8yx\"> </span></button>"), $r = l("<span class=\"loaded svelte-1phe8yx\"> </span>"), ei = l("<div class=\"prog svelte-1phe8yx\"><span class=\"bar svelte-1phe8yx\"><span class=\"svelte-1phe8yx\"></span></span><span class=\"left svelte-1phe8yx\"> </span></div>"), ti = l("<p class=\"notes svelte-1phe8yx\"> </p>"), ni = l("<button class=\"notes-toggle svelte-1phe8yx\"> </button> <!>", 1), ri = l("<span class=\"eq svelte-1phe8yx\" aria-hidden=\"true\"><i class=\"svelte-1phe8yx\"></i><i class=\"svelte-1phe8yx\"></i><i class=\"svelte-1phe8yx\"></i></span>"), ii = l("<span class=\"nowtag svelte-1phe8yx\"><!>Now playing</span>"), ai = l("<button class=\"pill svelte-1phe8yx\">Play next</button> <button class=\"pill svelte-1phe8yx\">Queue</button>", 1), oi = l("<div><button class=\"playbtn svelte-1phe8yx\"><!></button> <div class=\"text svelte-1phe8yx\"><div class=\"date svelte-1phe8yx\"> </div> <div> </div> <!> <!></div> <!> <!> <button><!></button></div>"), si = l("<button class=\"more svelte-1phe8yx\"> </button>"), ci = l("<button class=\"back svelte-1phe8yx\">‹ All podcasts</button> <!> <div class=\"listhead svelte-1phe8yx\"><span class=\"lt svelte-1phe8yx\">Episodes</span> <div class=\"seg svelte-1phe8yx\" role=\"group\" aria-label=\"Order\"><button>Newest</button> <button>Oldest</button></div> <span class=\"spacer svelte-1phe8yx\"></span> <label class=\"find svelte-1phe8yx\"><!><input type=\"search\" placeholder=\"Find an episode\" aria-label=\"Find an episode\" class=\"svelte-1phe8yx\"/></label> <span class=\"anchor svelte-1phe8yx\"><button class=\"more-btn svelte-1phe8yx\" data-pop=\"\" aria-haspopup=\"menu\" aria-label=\"Episode actions\">•••</button> <!></span></div> <div class=\"filters svelte-1phe8yx\" role=\"group\" aria-label=\"Filter episodes\"><!> <!></div> <!> <!> <!>", 1), li = {
	hash: "svelte-1phe8yx",
	code: ".genrebar.svelte-1phe8yx {display:flex;align-items:center;gap:6px;margin:16px 0 4px;}\n  /* One row: it scrolls sideways on a narrow window instead of wrapping. */.genres.svelte-1phe8yx {flex:1;min-width:0;display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;mask-image:linear-gradient(90deg, #000 calc(100% - 28px), transparent);padding-right:24px;}.genres.svelte-1phe8yx::-webkit-scrollbar {display:none;}.chip.svelte-1phe8yx {flex:none;height:28px;padding:0 12px;border-radius:14px;border:1px solid var(--tm-fg-16);background:transparent;color:var(--tm-fg);font-size:12px;font-weight:500;cursor:pointer;}.chip.svelte-1phe8yx:hover {border-color:var(--tm-accent);}.chip.on.svelte-1phe8yx {border-color:var(--tm-accent);background:var(--tm-accent);color:var(--tm-on-accent);}.more-genres.svelte-1phe8yx {display:inline-flex;align-items:center;gap:5px;}.more-genres.open.svelte-1phe8yx {border-color:var(--tm-accent);color:var(--tm-accent);}.caret.svelte-1phe8yx {font-size:9px;opacity:.7;}.tm-pop.catpop.svelte-1phe8yx {right:0;top:34px;width:min(380px, calc(100vw - 48px));padding:12px 14px 14px;z-index:9;display:grid;gap:12px;}.catgroup.svelte-1phe8yx {display:grid;gap:6px;}.catlabel.svelte-1phe8yx {font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--tm-muted);}.catlist.svelte-1phe8yx {display:flex;flex-wrap:wrap;gap:4px;}.cat.svelte-1phe8yx {height:26px;padding:0 10px;border:0;border-radius:13px;background:var(--tm-fg-6);color:var(--tm-fg);font-size:12px;cursor:pointer;}.cat.svelte-1phe8yx:hover {background:var(--tm-fg-10);}.cat.on.svelte-1phe8yx {background:var(--tm-accent);color:var(--tm-on-accent);}.about.svelte-1phe8yx {position:relative;display:grid;gap:14px;margin-top:18px;padding:16px 18px;border-radius:14px;background:var(--tm-fg-4);border:1px solid var(--tm-fg-8);}.about-h.svelte-1phe8yx {font-size:10.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--tm-muted);margin-bottom:6px;}.about-text.svelte-1phe8yx p:where(.svelte-1phe8yx) {margin:0;font-size:12.5px;line-height:1.6;color:color-mix(in srgb, var(--tm-fg) 86%, transparent);white-space:pre-line;max-height:150px;overflow:auto;padding-right:22px;max-width:72ch;}.facts.svelte-1phe8yx {margin:0;display:grid;grid-template-columns:repeat(auto-fill, minmax(110px, 1fr));gap:10px 16px;padding-top:12px;border-top:1px solid var(--tm-fg-8);}.facts.svelte-1phe8yx div:where(.svelte-1phe8yx) {display:grid;gap:1px;}.facts.svelte-1phe8yx dt:where(.svelte-1phe8yx) {font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--tm-muted);}.facts.svelte-1phe8yx dd:where(.svelte-1phe8yx) {margin:0;font-size:12.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.about-close.svelte-1phe8yx {position:absolute;top:10px;right:10px;width:24px;height:24px;border:0;border-radius:12px;display:grid;place-items:center;background:transparent;color:var(--tm-muted);cursor:pointer;}.about-close.svelte-1phe8yx:hover {background:var(--tm-fg-8);color:var(--tm-fg);}.h1.svelte-1phe8yx {font-size:26px;font-weight:650;letter-spacing:-.5px;margin:0;}.lede.svelte-1phe8yx {font-size:13px;color:var(--tm-muted);margin:4px 0 0;}.more.svelte-1phe8yx {display:block;margin:16px auto 0;height:32px;padding:0 18px;border-radius:16px;border:1px solid var(--tm-fg-14);background:transparent;color:var(--tm-fg);font-size:12px;cursor:pointer;}.back.svelte-1phe8yx {border:0;background:none;color:var(--tm-muted);font-size:12px;cursor:pointer;padding:0;margin:-8px 0 14px;}.back.svelte-1phe8yx:hover {color:var(--tm-fg);}.hero.svelte-1phe8yx {display:flex;gap:22px;align-items:flex-end;}.art.svelte-1phe8yx {border-radius:16px;box-shadow:0 18px 40px rgba(0, 0, 0, .35);flex:none;}.info.svelte-1phe8yx {flex:1;min-width:0;}.eyebrow.svelte-1phe8yx {font-size:10.5px;letter-spacing:1px;text-transform:uppercase;color:var(--tm-accent);font-weight:600;}h1.svelte-1phe8yx {font-size:28px;font-weight:700;letter-spacing:-.6px;margin:4px 0 0;line-height:1.15;}.author.svelte-1phe8yx {font-size:12.5px;margin-top:4px;}.desc.svelte-1phe8yx {font-size:12.5px;color:var(--tm-muted);margin:4px 0 0;text-wrap:pretty;display:-webkit-box;-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}.actions.svelte-1phe8yx {display:flex;gap:8px;margin-top:14px;flex-wrap:wrap;}.actions.svelte-1phe8yx button:where(.svelte-1phe8yx) {height:34px;border-radius:17px;cursor:pointer;}.primary.svelte-1phe8yx {padding:0 16px;border:0;background:var(--tm-accent);color:var(--tm-on-accent);font-size:12.5px;font-weight:650;display:flex;align-items:center;gap:7px;}.primary.svelte-1phe8yx:disabled {opacity:.5;cursor:default;}.sub.svelte-1phe8yx {padding:0 16px;border:1px solid var(--tm-fg-18);background:transparent;color:var(--tm-fg);font-size:12.5px;font-weight:600;}.sub.on.svelte-1phe8yx {border-color:var(--tm-accent);background:var(--tm-accent-12);}.listhead.svelte-1phe8yx {display:flex;align-items:center;gap:10px;margin:26px 0 8px;font-size:12px;color:var(--tm-muted);flex-wrap:wrap;}.lt.svelte-1phe8yx {color:var(--tm-fg);font-weight:650;font-size:14px;}.seg.svelte-1phe8yx {display:flex;padding:2px;border-radius:9px;background:var(--tm-fg-6);}.seg.svelte-1phe8yx button:where(.svelte-1phe8yx) {height:26px;padding:0 12px;border:0;border-radius:7px;background:none;color:var(--tm-muted);font-size:11.5px;font-weight:600;cursor:pointer;}.seg.svelte-1phe8yx button.on:where(.svelte-1phe8yx) {background:var(--tm-panel);color:var(--tm-fg);box-shadow:0 1px 3px rgba(0, 0, 0, .25);}.find.svelte-1phe8yx {display:flex;align-items:center;gap:6px;height:28px;padding:0 10px;border-radius:8px;background:var(--tm-fg-6);width:180px;}.find.svelte-1phe8yx:focus-within {box-shadow:0 0 0 1px var(--tm-accent);}.find.svelte-1phe8yx input:where(.svelte-1phe8yx) {flex:1;min-width:0;border:0;background:none;outline:none;color:var(--tm-fg);font:inherit;font-size:12px;}.anchor.svelte-1phe8yx {position:relative;display:inline-flex;}.more-btn.svelte-1phe8yx {width:30px;height:28px;border:0;border-radius:8px;background:var(--tm-fg-6);color:var(--tm-fg);cursor:pointer;font-size:11px;letter-spacing:1px;}.more-btn.svelte-1phe8yx:hover, .more-btn[aria-expanded='true'].svelte-1phe8yx {background:var(--tm-fg-12);}.menu.svelte-1phe8yx {right:0;top:34px;width:210px;padding:6px;}.menu.svelte-1phe8yx button:where(.svelte-1phe8yx) {display:flex;align-items:center;gap:9px;width:100%;height:32px;padding:0 10px;border:0;border-radius:8px;background:none;color:var(--tm-fg);font-size:12px;cursor:pointer;text-align:left;}.menu.svelte-1phe8yx button:where(.svelte-1phe8yx):hover {background:var(--tm-fg-8);}.pop.svelte-1phe8yx {left:0;top:40px;width:380px;max-width:calc(100cqw - 40px);}.ptitle.svelte-1phe8yx {font-size:13px;font-weight:650;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.plabel.svelte-1phe8yx {font-size:11px;color:var(--tm-muted);margin:12px 0 6px;}.opts.svelte-1phe8yx {display:flex;flex-wrap:wrap;gap:5px;}.opt.svelte-1phe8yx {min-width:38px;height:28px;padding:0 8px;border:0;border-radius:7px;background:var(--tm-fg-6);color:var(--tm-fg);font-size:11px;font-weight:600;cursor:pointer;font-variant-numeric:tabular-nums;}.opt.svelte-1phe8yx:hover {background:var(--tm-fg-10);}.opt.sel.svelte-1phe8yx {background:var(--tm-accent);color:var(--tm-on-accent);}.trow.svelte-1phe8yx {display:flex;align-items:center;gap:12px;margin-top:14px;cursor:pointer;}.trow.svelte-1phe8yx span:where(.svelte-1phe8yx) {flex:1;display:flex;flex-direction:column;gap:2px;font-size:12px;}.trow.svelte-1phe8yx small:where(.svelte-1phe8yx) {font-size:11px;color:var(--tm-muted);line-height:1.35;}.trow.svelte-1phe8yx input:where(.svelte-1phe8yx) {appearance:none;width:34px;height:20px;flex:none;border-radius:10px;background:var(--tm-fg-16);position:relative;cursor:pointer;margin:0;}.trow.svelte-1phe8yx input:where(.svelte-1phe8yx)::after {content:'';position:absolute;top:3px;left:3px;width:14px;height:14px;border-radius:50%;background:var(--tm-fg);transition:transform .15s;}.trow.svelte-1phe8yx input:where(.svelte-1phe8yx):checked {background:var(--tm-accent);}.trow.svelte-1phe8yx input:where(.svelte-1phe8yx):checked::after {transform:translateX(14px);background:var(--tm-on-accent);}.sub.icon.svelte-1phe8yx {display:flex;align-items:center;gap:6px;}.filters.svelte-1phe8yx {display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-bottom:4px;}.fchip.svelte-1phe8yx {height:26px;padding:0 10px;border-radius:13px;border:1px solid var(--tm-fg-14);background:transparent;color:var(--tm-fg);font-size:11.5px;cursor:pointer;display:flex;align-items:center;gap:6px;}.fchip.svelte-1phe8yx span:where(.svelte-1phe8yx) {font-size:10px;color:var(--tm-muted);font-variant-numeric:tabular-nums;}.fchip.on.svelte-1phe8yx {background:var(--tm-accent-14);border-color:var(--tm-accent);color:var(--tm-accent);}.fchip.on.svelte-1phe8yx span:where(.svelte-1phe8yx) {color:inherit;}.loaded.svelte-1phe8yx {font-size:11px;color:var(--tm-muted);margin-left:4px;}.notes-toggle.svelte-1phe8yx {border:0;padding:0;margin-top:6px;background:none;color:var(--tm-accent);font-size:11.5px;cursor:pointer;}.notes.svelte-1phe8yx {font-size:12px;line-height:1.55;color:var(--tm-muted);margin:6px 0 0;white-space:pre-line;max-width:640px;}.strip.svelte-1phe8yx {display:flex;gap:8px;overflow-x:auto;margin-top:16px;padding-bottom:4px;scrollbar-width:thin;}.chipshow.svelte-1phe8yx {display:flex;align-items:center;gap:8px;height:40px;padding:0 12px 0 6px;flex:none;border:1px solid var(--tm-fg-10);border-radius:12px;background:var(--tm-fg-4);color:var(--tm-fg);font-size:12px;font-weight:600;cursor:pointer;max-width:240px;}.chipshow.svelte-1phe8yx:hover {border-color:var(--tm-accent);}.chipshow.svelte-1phe8yx span:where(.svelte-1phe8yx) {overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.chipshow.svelte-1phe8yx b:where(.svelte-1phe8yx) {font-size:10px;min-width:18px;height:18px;padding:0 5px;border-radius:9px;display:grid;place-items:center;background:var(--tm-accent);color:var(--tm-on-accent);}.spacer.svelte-1phe8yx {flex:1;}.ep.svelte-1phe8yx {display:flex;align-items:center;gap:14px;padding:14px 8px;border-top:1px solid var(--tm-fg-6);}.ep.cur.svelte-1phe8yx {background:var(--tm-accent-8);}.playbtn.svelte-1phe8yx {width:36px;height:36px;border-radius:18px;border:1px solid var(--tm-fg-18);background:transparent;color:var(--tm-fg);cursor:pointer;display:grid;place-items:center;flex:none;}.playbtn.svelte-1phe8yx:hover {background:var(--tm-accent);color:var(--tm-on-accent);border-color:var(--tm-accent);}.text.svelte-1phe8yx {flex:1;min-width:0;}.date.svelte-1phe8yx {font-size:11px;color:var(--tm-muted);}.title.svelte-1phe8yx {font-size:13.5px;font-weight:600;margin-top:2px;}.cur.svelte-1phe8yx .title:where(.svelte-1phe8yx) {color:var(--tm-accent);}.title.done.svelte-1phe8yx {color:var(--tm-muted);}.prog.svelte-1phe8yx {display:flex;align-items:center;gap:8px;margin-top:6px;}.bar.svelte-1phe8yx {width:70px;height:3px;border-radius:2px;background:var(--tm-fg-10);display:block;}.bar.svelte-1phe8yx span:where(.svelte-1phe8yx) {display:block;height:3px;border-radius:2px;background:var(--tm-accent);}.left.svelte-1phe8yx {font-size:11px;color:var(--tm-muted);}.nowtag.svelte-1phe8yx {display:flex;align-items:center;gap:7px;font-size:11.5px;font-weight:650;color:var(--tm-accent);flex:none;padding:0 6px;}.eq.svelte-1phe8yx {display:flex;align-items:flex-end;gap:2px;height:12px;}.eq.svelte-1phe8yx i:where(.svelte-1phe8yx) {width:3px;background:var(--tm-accent);border-radius:1px; animation: svelte-1phe8yx-eq 1s ease-in-out infinite;}.eq.svelte-1phe8yx i:where(.svelte-1phe8yx):nth-child(2) {animation-delay:-.3s;}.eq.svelte-1phe8yx i:where(.svelte-1phe8yx):nth-child(3) {animation-delay:-.6s;}\n  @keyframes svelte-1phe8yx-eq { 0%, 100% { height: 4px; } 50% { height: 12px; } }\n  @media (prefers-reduced-motion: reduce) {.eq.svelte-1phe8yx i:where(.svelte-1phe8yx) { animation: none;height:8px;} }.pill.svelte-1phe8yx {height:28px;padding:0 10px;border:0;border-radius:7px;background:var(--tm-fg-6);color:var(--tm-fg);font-size:11.5px;cursor:pointer;flex:none;}.pill.svelte-1phe8yx:hover {background:var(--tm-fg-12);}.mark.svelte-1phe8yx {width:28px;height:28px;border:0;border-radius:7px;background:transparent;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;flex:none;}.mark.done.svelte-1phe8yx {color:var(--tm-accent);}.mark.svelte-1phe8yx:hover {background:var(--tm-fg-8);}"
};
function ui(r, i) {
	j(i, !0), _(r, li);
	let o = Z(i, "store", 7), l = X(() => o().show), d = X(() => !!e(l) && !!o().subscribed[e(l).slug]), f = X(() => o().showSlug ? o().showEpisodes[o().showSlug] : void 0), p = X(() => o().showSlug ? o().epOrder[o().showSlug] ?? "new" : "new"), h = X(() => e(l) ? o().showPrefsOf(e(l).slug) : null), g = X(() => e(l) ? o().speeds[`show:${e(l).slug}`] ?? 1 : 1), v = X(() => o().podGenre === "All" ? null : o().podGenreList), y = X(() => ge.filter((e) => e.group === "top" || e.label === o().podGenre));
	function b(e) {
		o().podGenre = e, o().pop = null, o().scheduleSave();
	}
	let C = {
		en: "English",
		es: "Spanish",
		pt: "Portuguese",
		fr: "French",
		de: "German",
		it: "Italian"
	}, T = X(() => (e(v) ? e(v).slugs : o().podcastBrowse.slugs).map((e) => o().shows[e]).filter(Boolean).map((e) => ({
		key: e.slug,
		title: e.title,
		sub: e.author || e.category,
		hue: e.hue,
		mark: e.mark,
		art: e.art
	}))), E = X(() => Object.values(o().subscribed)), O = X(() => o().allEpisodes), te = X(() => [...e(O)].sort((e, t) => (t.date || "").localeCompare(e.date || ""))[0]), ne = X(() => {
		let t = {
			all: e(O).length,
			unplayed: 0,
			progress: 0,
			played: 0
		};
		for (let n of e(O)) t[o().episodeState(n.id)]++;
		return t;
	}), M = [
		["all", "All"],
		["unplayed", "Unplayed"],
		["progress", "In progress"],
		["played", "Played"]
	], N = I(K({}));
	z(() => {
		!o().showSlug && o().podcastBrowse.status === "idle" && o().loadPodcastBrowse();
	}), z(() => {
		!o().showSlug && e(v)?.status === "idle" && o().loadPodcastGenre();
	});
	let ie = (t) => o().playFrom(t, (o().episodes.length ? o().episodes : e(O)).map((e) => e.id), e(l)?.title ?? "this show"), P = (e) => e ? `${e}s` : "Off";
	function se(t) {
		if (!e(l)) return;
		o().speeds = {
			...o().speeds,
			[`show:${e(l).slug}`]: t
		};
		let n = o().item;
		n?.type === "podcast" && n.show === e(l).slug ? o().setSpeed(t) : o().scheduleSave();
	}
	var L = le(), ce = F(L), B = (r) => {
		var i = Br(), a = V(F(i), 2), l = D(a), d = V(a, 2), f = (r) => {
			var i = Fr(), a = G(i);
			n(a, 21, () => e(y), (e) => e.label, (n, r) => {
				var i = Mr();
				let a;
				var s = D(i, !0);
				J(() => {
					a = c(i, 1, "chip svelte-1phe8yx", null, a, { on: o().podGenre === e(r).label }), t(i, "aria-pressed", o().podGenre === e(r).label), S(s, e(r).label);
				}), w("click", i, () => b(e(r).label)), u(n, i);
			}), R(a);
			var l = V(a, 2), d = G(l);
			let f;
			var p = V(d, 2), m = (r) => {
				var i = Pr();
				n(i, 21, () => _e, (e) => e.id, (r, i) => {
					var a = Nr(), s = G(a), l = D(s, !0), d = V(s, 2);
					n(d, 21, () => ge.filter((t) => t.group === e(i).id && t.slugs.length), (e) => e.label, (n, r) => {
						var i = Mr();
						let a;
						var s = D(i, !0);
						J(() => {
							a = c(i, 1, "cat svelte-1phe8yx", null, a, { on: o().podGenre === e(r).label }), t(i, "aria-pressed", o().podGenre === e(r).label), S(s, e(r).label);
						}), w("click", i, () => b(e(r).label)), u(n, i);
					}), R(d), R(a), J(() => S(l, e(i).label)), u(r, a);
				}), R(i), u(r, i);
			};
			s(p, (e) => {
				o().pop === "genres" && e(m);
			}), R(l), R(i), J(() => {
				f = c(d, 1, "chip more-genres svelte-1phe8yx", null, f, { open: o().pop === "genres" }), t(d, "aria-expanded", o().pop === "genres");
			}), w("click", d, () => o().togglePop("genres")), u(r, i);
		};
		s(d, (e) => {
			o().podcastGenres && e(f);
		});
		var p = V(d, 2), m = (t) => {
			var r = Rr();
			n(r, 21, () => e(E), (e) => e.slug, (t, n) => {
				let r = X(() => o().newCount(e(n).slug));
				var i = Lr(), a = G(i);
				q(a, {
					get hue() {
						return e(n).hue;
					},
					get art() {
						return e(n).art;
					},
					size: 28,
					radius: 7,
					font: 9,
					get mark() {
						return e(n).mark;
					}
				});
				var c = V(a), l = D(c, !0), d = V(c), f = (t) => {
					var n = Ir(), i = D(n, !0);
					J(() => S(i, e(r))), u(t, n);
				};
				s(d, (t) => {
					e(r) && t(f);
				}), R(i), J(() => S(l, e(n).title)), w("click", i, () => o().openShow(e(n).slug)), u(t, i);
			}), R(r), u(t, r);
		};
		s(p, (t) => {
			e(E).length && t(m);
		});
		var h = V(p, 2);
		jr(h, {
			get cards() {
				return e(T);
			},
			open: (e) => o().openShow(e)
		});
		var g = V(h, 2), _ = (t) => {
			{
				let n = X(() => e(v).status === "idle" ? "loading" : e(v).status);
				mn(t, {
					get status() {
						return e(n);
					},
					retry: () => o().loadPodcastGenre(),
					empty: "No shows in this category right now."
				});
			}
		}, x = (e) => {
			mn(e, {
				get status() {
					return o().podcastBrowse.status;
				},
				retry: () => o().loadPodcastBrowse()
			});
		};
		s(g, (t) => {
			e(v) ? t(_) : t(x, -1);
		});
		var C = V(g, 2), O = (e) => {
			var t = zr();
			w("click", t, () => o().loadPodcastBrowse(!0)), u(e, t);
		};
		s(C, (t) => {
			!e(v) && o().podcastBrowse.cursor && o().podcastBrowse.status === "ready" && t(O);
		}), J(() => S(l, `${e(v) ? `The most popular ${o().podGenre} shows on OndaCast.` : "Recently updated shows on OndaCast."} Subscribe and new episodes land in Listen now.`)), u(r, i);
	}, H = (r) => {
		var i = ci(), _ = F(i), v = V(_, 2), y = (r) => {
			var i = Xr(), a = F(i), f = G(a), p = G(f);
			q(p, {
				get hue() {
					return e(l).hue;
				},
				get art() {
					return e(l).art;
				},
				size: 132,
				radius: 16,
				get mark() {
					return e(l).mark;
				},
				font: 20
			}), R(f);
			var m = V(f, 2), _ = G(m), v = D(_), y = V(_, 2), b = D(y, !0), T = V(y, 2), E = (t) => {
				var n = Vr(), r = D(n, !0);
				J(() => S(r, e(l).author)), u(t, n);
			};
			s(T, (t) => {
				e(l).author && t(E);
			});
			var k = V(T, 2), A = (t) => {
				var n = Hr(), r = D(n, !0);
				J(() => S(r, e(l).desc)), u(t, n);
			};
			s(k, (t) => {
				e(l).desc && t(A);
			});
			var j = V(k, 2), M = G(j), re = G(M);
			$(re, {
				get d() {
					return Q.play;
				},
				size: 12
			}), U(), R(M);
			var N = V(M, 2);
			let ie;
			var I = D(N, !0), L = V(N, 2);
			let ce;
			var z = G(L);
			$(z, {
				get d() {
					return Q.info;
				},
				size: 14,
				stroke: 1.7
			}), U(), R(L);
			var B = V(L, 2), H = G(B), le = G(H);
			$(le, {
				get d() {
					return Q.gear;
				},
				size: 14,
				stroke: 1.6
			}), U(), R(H);
			var W = V(H, 2), ue = (r) => {
				var i = Ur(), a = G(i), s = D(a, !0), f = V(a, 4);
				n(f, 21, () => kt, x, (t, n) => {
					var r = Mr();
					let i;
					var a = D(r, !0);
					J((t) => {
						i = c(r, 1, "opt svelte-1phe8yx", null, i, { sel: e(h).intro === e(n) }), S(a, t);
					}, [() => P(e(n))]), w("click", r, () => o().setShowPref(e(l).slug, "intro", e(n))), u(t, r);
				}), R(f);
				var p = V(f, 4);
				n(p, 21, () => At, x, (t, n) => {
					var r = Mr();
					let i;
					var a = D(r, !0);
					J((t) => {
						i = c(r, 1, "opt svelte-1phe8yx", null, i, { sel: e(h).outro === e(n) }), S(a, t);
					}, [() => P(e(n))]), w("click", r, () => o().setShowPref(e(l).slug, "outro", e(n))), u(t, r);
				}), R(p);
				var m = V(p, 4);
				n(m, 21, () => jt, x, (t, n) => {
					var r = Mr();
					let i;
					var a = D(r);
					J((t) => {
						i = c(r, 1, "opt svelte-1phe8yx", null, i, { sel: e(g) === e(n) }), S(a, `${t ?? ""}×`);
					}, [() => e(n).toFixed(1)]), w("click", r, () => se(e(n))), u(t, r);
				}), R(m);
				var _ = V(m, 2), v = V(G(_), 2);
				oe(v), R(_), R(i), J(() => {
					t(i, "aria-label", `Settings for ${e(l).title ?? ""}`), S(s, e(l).title), ae(v, e(h).autoQueue);
				}), w("change", v, (t) => {
					o().setShowPref(e(l).slug, "autoQueue", t.currentTarget.checked), t.currentTarget.checked && !e(d) && o().toggleSubscribe(e(l).slug);
				}), u(r, i);
			};
			s(W, (t) => {
				o().pop === "show" && e(h) && t(ue);
			}), R(B), R(j), R(m), R(a);
			var K = V(a, 2), Y = (n) => {
				var r = Yr(), i = G(r), a = V(G(i), 2), c = D(a, !0);
				R(i);
				var f = V(i, 2), p = G(f), m = (t) => {
					var n = Wr(), r = V(G(n)), i = D(r, !0);
					R(n), J(() => S(i, e(l).author)), u(t, n);
				};
				s(p, (t) => {
					e(l).author && t(m);
				});
				var h = V(p, 2), g = (t) => {
					var n = Gr(), r = V(G(n)), i = D(r, !0);
					R(n), J(() => S(i, e(l).category)), u(t, n);
				};
				s(h, (t) => {
					e(l).category && t(g);
				});
				var _ = V(h, 2), v = (t) => {
					var n = Kr(), r = V(G(n)), i = D(r, !0);
					R(n), J((e) => S(i, e), [() => (e(l).episodes || e(O).length).toLocaleString()]), u(t, n);
				};
				s(_, (t) => {
					(e(l).episodes || e(O).length) && t(v);
				});
				var y = V(_, 2), b = (t) => {
					var n = qr(), r = V(G(n)), i = D(r, !0);
					R(n), J((e) => S(i, e), [() => ee(e(te).date)]), u(t, n);
				};
				s(y, (t) => {
					e(te) && t(b);
				});
				var x = V(y, 2), T = (t) => {
					var n = Jr(), r = V(G(n)), i = D(r, !0);
					R(n), J((e) => S(i, e), [() => C[e(l).language.slice(0, 2).toLowerCase()] ?? e(l).language.toUpperCase()]), u(t, n);
				};
				s(x, (t) => {
					e(l).language && t(T);
				});
				var E = V(x, 2), k = V(G(E)), A = D(k);
				R(E), R(f);
				var j = V(f, 2), M = G(j);
				$(M, {
					get d() {
						return Q.close;
					},
					size: 12,
					stroke: 2
				}), R(j), R(r), J(() => {
					t(r, "aria-label", `About ${e(l).title ?? ""}`), S(c, e(l).desc || "The publisher has not written a description for this show."), S(A, `${e(d) ? "Following" : "Not following"}${e(ne).played ? ` · ${e(ne).played} played` : ""}`);
				}), w("click", j, () => o().showAbout = !1), u(n, r);
			};
			s(K, (e) => {
				o().showAbout && e(Y);
			}), J(() => {
				S(v, `Podcast${e(l).category ? ` · ${e(l).category}` : ""}`), S(b, e(l).title), M.disabled = !e(te), ie = c(N, 1, "sub svelte-1phe8yx", null, ie, { on: e(d) }), t(N, "aria-pressed", e(d)), S(I, e(d) ? "Subscribed" : "Subscribe"), ce = c(L, 1, "sub icon svelte-1phe8yx", null, ce, { on: o().showAbout }), t(L, "aria-expanded", o().showAbout), t(H, "aria-expanded", o().pop === "show");
			}), w("click", M, () => e(te) && o().playFrom(e(te).id, [...e(O)].sort((e, t) => (t.date || "").localeCompare(e.date || "")).map((e) => e.id), e(l).title)), w("click", N, () => o().toggleSubscribe(e(l).slug)), w("click", L, () => o().showAbout = !o().showAbout), w("click", H, () => o().togglePop("show")), u(r, i);
		};
		s(v, (t) => {
			e(l) && t(y);
		});
		var b = V(v, 2), T = V(G(b), 2), E = G(T);
		let A;
		var j = V(E, 2);
		let I;
		R(T);
		var L = V(T, 4), ce = G(L);
		$(ce, {
			get d() {
				return Q.search;
			},
			size: 12,
			stroke: 2
		});
		var z = V(ce);
		oe(z), R(L);
		var B = V(L, 2), H = G(B), le = V(H, 2), W = (t) => {
			var n = Zr(), r = G(n), i = G(r);
			$(i, {
				get d() {
					return Q.play;
				},
				size: 12
			}), U(), R(r);
			var a = V(r, 2), s = G(a);
			$(s, {
				get d() {
					return Q.plus;
				},
				size: 12,
				stroke: 2
			}), U(), R(a);
			var c = V(a, 2), d = G(c);
			$(d, {
				get d() {
					return Q.check;
				},
				size: 12,
				stroke: 2
			}), U(), R(c);
			var f = V(c, 2), p = G(f);
			$(p, {
				get d() {
					return Q.clock;
				},
				size: 12,
				stroke: 2
			}), U(), R(f), R(n), w("click", r, () => {
				o().pop = null, o().queueUnplayed(!0);
			}), w("click", a, () => {
				o().pop = null, o().queueUnplayed(!1);
			}), w("click", c, () => {
				o().pop = null, o().markShow(e(l).slug, !0);
			}), w("click", f, () => {
				o().pop = null, o().markShow(e(l).slug, !1);
			}), u(t, n);
		};
		s(le, (t) => {
			o().pop === "epmenu" && e(l) && t(W);
		}), R(B), R(b);
		var ue = V(b, 2), K = G(ue);
		n(K, 17, () => M, ([e, t]) => e, (n, r) => {
			var i = X(() => re(e(r), 2));
			let a = () => e(i)[0], s = () => e(i)[1];
			var l = Qr();
			let d;
			var f = G(l, !0), p = V(f), m = D(p, !0);
			R(l), J(() => {
				d = c(l, 1, "fchip svelte-1phe8yx", null, d, { on: o().epFilter === a() }), t(l, "aria-pressed", o().epFilter === a()), S(f, s()), S(m, e(ne)[a()]);
			}), w("click", l, () => o().epFilter = a()), u(n, l);
		});
		var Y = V(K, 2), de = (t) => {
			var n = $r(), r = D(n);
			J(() => S(r, `${e(O).length ?? ""} loaded`)), u(t, n);
		};
		s(Y, (t) => {
			e(f)?.hasNext && t(de);
		}), R(ue);
		var Z = V(ue, 2);
		n(Z, 17, () => o().episodes, (e) => e.id, (n, r) => {
			let i = X(() => o().isDone(e(r).id));
			var l = oi();
			let d;
			var f = G(l), p = G(f);
			{
				let t = X(() => o().isPlaying(e(r).id) ? Q.pause : Q.play);
				$(p, {
					get d() {
						return e(t);
					},
					size: 13
				});
			}
			R(f);
			var m = V(f, 2), h = G(m), g = D(h, !0), _ = V(h, 2);
			let v;
			var y = D(_, !0), b = V(_, 2), x = (t) => {
				var n = ei(), s = G(n), c = G(s);
				let l;
				R(s);
				var d = V(s), f = D(d, !0);
				R(n), J((e, t) => {
					l = a(c, "", l, { width: e }), S(f, t);
				}, [() => `${(e(i) ? 100 : o().pctOf(e(r).id)) ?? ""}%`, () => o().leftOf(e(r).id)]), u(t, n);
			}, C = X(() => o().progressOf(e(r).id) > 5 || e(i));
			s(b, (t) => {
				e(C) && t(x);
			});
			var T = V(b, 2), E = (n) => {
				var i = ni(), a = F(i), o = D(a, !0), c = V(a, 2), l = (t) => {
					var n = ti(), i = D(n, !0);
					J(() => S(i, e(r).desc)), u(t, n);
				};
				s(c, (t) => {
					e(N)[e(r).id] && t(l);
				}), J(() => {
					t(a, "aria-expanded", !!e(N)[e(r).id]), S(o, e(N)[e(r).id] ? "Hide show notes" : "Show notes");
				}), w("click", a, () => k(N, {
					...e(N),
					[e(r).id]: !e(N)[e(r).id]
				}, !0)), u(n, i);
			};
			s(T, (t) => {
				e(r).desc && t(E);
			}), R(m);
			var O = V(m, 2), A = (e) => {
				var t = ii(), n = G(t), r = (e) => {
					var t = ri();
					u(e, t);
				};
				s(n, (e) => {
					o().playing && e(r);
				}), U(), R(t), u(e, t);
			}, te = (t) => {
				var n = ai(), i = F(n), a = V(i, 2);
				w("click", i, () => o().playNext(e(r).id)), w("click", a, () => o().addToQueue(e(r).id)), u(t, n);
			};
			s(O, (t) => {
				e(r).id === o().now ? t(A) : t(te, -1);
			});
			var ne = V(O, 2);
			rn(ne, {
				get store() {
					return o();
				},
				get id() {
					return e(r).id;
				}
			});
			var j = V(ne, 2);
			let M;
			var re = G(j);
			$(re, {
				get d() {
					return Q.check;
				},
				size: 15,
				stroke: 2
			}), R(j), R(l), J((n, a) => {
				d = c(l, 1, "ep svelte-1phe8yx", null, d, { cur: e(r).id === o().now }), t(f, "aria-label", `${n ?? ""} ${e(r).title ?? ""}`), S(g, a), v = c(_, 1, "title svelte-1phe8yx", null, v, { done: e(i) && e(r).id !== o().now }), S(y, e(r).title), M = c(j, 1, "mark svelte-1phe8yx", null, M, { done: e(i) }), t(j, "title", e(i) ? "Mark as unplayed" : "Mark as played"), t(j, "aria-label", e(i) ? "Mark as unplayed" : "Mark as played"), t(j, "aria-pressed", e(i));
			}, [() => o().isPlaying(e(r).id) ? "Pause" : "Play", () => [ee(e(r).date), o().lenOf(e(r).id)].filter(Boolean).join(" · ")]), w("click", f, () => ie(e(r).id)), w("click", j, () => o().togglePlayed(e(r).id)), u(n, l);
		});
		var fe = V(Z, 2);
		{
			let t = X(() => e(f)?.status ?? "loading"), n = X(() => e(f)?.status === "ready" && !o().episodes.length ? e(O).length ? "No episodes match. Change the filter or load more." : "This show has no playable episodes yet." : "");
			mn(fe, {
				get status() {
					return e(t);
				},
				retry: () => o().showSlug && o().loadShow(o().showSlug, (e(f)?.ids.length ?? 0) > 0),
				get empty() {
					return e(n);
				}
			});
		}
		var pe = V(fe, 2), me = (t) => {
			var n = si(), r = D(n, !0);
			J(() => S(r, e(p) === "new" ? "Older episodes" : "Newer episodes")), w("click", n, () => o().showSlug && o().loadShow(o().showSlug, !0)), u(t, n);
		};
		s(pe, (t) => {
			e(f)?.hasNext && e(f).status === "ready" && t(me);
		}), J(() => {
			t(E, "aria-pressed", e(p) === "new"), A = c(E, 1, "svelte-1phe8yx", null, A, { on: e(p) === "new" }), t(j, "aria-pressed", e(p) === "old"), I = c(j, 1, "svelte-1phe8yx", null, I, { on: e(p) === "old" }), t(H, "aria-expanded", o().pop === "epmenu");
		}), w("click", _, () => o().showSlug = null), w("click", E, () => e(l) && o().setEpisodeOrder(e(l).slug, "new")), w("click", j, () => e(l) && o().setEpisodeOrder(e(l).slug, "old")), m(z, () => o().epQuery, (e) => o().epQuery = e), w("click", H, () => o().togglePop("epmenu")), u(r, i);
	};
	s(ce, (e) => {
		o().showSlug ? e(H, -1) : e(B);
	}), u(r, L), A();
}
C(["click", "change"]);
//#endregion
//#region src/components/BookView.svelte
var di = l("<span class=\"sbar svelte-965svo\"><span class=\"svelte-965svo\"></span></span>"), fi = l("<button class=\"shelfitem svelte-965svo\"><span class=\"scover svelte-965svo\"><!></span> <span class=\"stext svelte-965svo\"><span class=\"stitle svelte-965svo\"> </span><span class=\"smeta svelte-965svo\"> </span> <!></span></button>"), pi = l("<div class=\"shelf svelte-965svo\"></div>"), mi = l("<button class=\"more svelte-965svo\">Show more</button>"), hi = l("<h1 class=\"h1 svelte-965svo\">Audiobooks</h1> <p class=\"lede svelte-965svo\">Public-domain classics read by LibriVox volunteers, via OndaCast.</p> <!> <!> <!> <!>", 1), gi = l("<div class=\"prog svelte-965svo\"><span class=\"bar svelte-965svo\"><span class=\"svelte-965svo\"></span></span><span class=\"left svelte-965svo\"> </span></div>"), _i = l("<div class=\"where svelte-965svo\"> </div>"), vi = l("<div class=\"tm-pop menu svelte-965svo\" role=\"menu\"><button role=\"menuitem\" class=\"svelte-965svo\"><!> </button> <button role=\"menuitem\" class=\"svelte-965svo\"><!>Start over</button></div>"), yi = l("<button class=\"link svelte-965svo\"> </button>"), bi = l("<p> </p> <!>", 1), xi = l("<form class=\"noteform svelte-965svo\"><input maxlength=\"500\" placeholder=\"Add a note\" class=\"svelte-965svo\"/> <button type=\"submit\" class=\"svelte-965svo\">Save</button></form>"), Si = l("<button class=\"note svelte-965svo\"> </button>"), Ci = l("<button class=\"addnote svelte-965svo\">Add a note</button>"), wi = l("<div class=\"mrow svelte-965svo\"><div class=\"mbody svelte-965svo\"><button class=\"mjump svelte-965svo\"> <span class=\"svelte-965svo\"> </span></button> <!></div> <button class=\"rm svelte-965svo\"><!></button></div>"), Ti = l("<h2 class=\"svelte-965svo\">Bookmarks</h2> <!>", 1), Ei = l("<label class=\"find svelte-965svo\"><!><input type=\"search\" placeholder=\"Find a chapter\" aria-label=\"Find a chapter\" class=\"svelte-965svo\"/></label>"), Di = l("<label class=\"hide svelte-965svo\"><input type=\"checkbox\" class=\"svelte-965svo\"/>Hide finished</label>"), Oi = l("<button><span class=\"n svelte-965svo\"> </span> <span class=\"title svelte-965svo\"> </span> <span class=\"state svelte-965svo\"> </span></button>"), ki = l("<div class=\"hero svelte-965svo\"><div class=\"cover svelte-965svo\"><!></div> <div class=\"info svelte-965svo\"><div class=\"eyebrow svelte-965svo\">Audiobook · Public domain</div> <h1 class=\"svelte-965svo\"> </h1> <p class=\"sub svelte-965svo\"> </p> <!> <!> <div class=\"actions svelte-965svo\"><button class=\"primary svelte-965svo\"><!> </button> <button><!> </button> <button class=\"ghost svelte-965svo\">Add bookmark</button> <span class=\"anchor svelte-965svo\"><button class=\"ghost dots svelte-965svo\" data-pop=\"\" aria-haspopup=\"menu\" aria-label=\"More actions\">•••</button> <!></span></div></div></div> <!> <!> <div class=\"chead svelte-965svo\"><h2 class=\"svelte-965svo\">Chapters</h2> <span class=\"spacer svelte-965svo\"></span> <!> <!></div> <!>", 1), Ai = l("<button class=\"back svelte-965svo\">‹ All audiobooks</button> <!> <!>", 1), ji = {
	hash: "svelte-965svo",
	code: ".h1.svelte-965svo {font-size:26px;font-weight:650;letter-spacing:-.5px;margin:0;}.lede.svelte-965svo {font-size:13px;color:var(--tm-muted);margin:4px 0 0;}.more.svelte-965svo {display:block;margin:16px auto 0;height:32px;padding:0 18px;border-radius:16px;border:1px solid var(--tm-fg-14);background:transparent;color:var(--tm-fg);font-size:12px;cursor:pointer;}.back.svelte-965svo {border:0;background:none;color:var(--tm-muted);font-size:12px;cursor:pointer;padding:0;margin:-8px 0 14px;}.back.svelte-965svo:hover {color:var(--tm-fg);}.hero.svelte-965svo {display:flex;gap:24px;}.cover.svelte-965svo {width:120px;height:176px;border-radius:6px 12px 12px 6px;flex:none;overflow:hidden;display:flex;box-shadow:0 18px 40px rgba(0, 0, 0, .4), inset 6px 0 0 rgba(0, 0, 0, .18);}.info.svelte-965svo {flex:1;min-width:0;padding-top:6px;}.eyebrow.svelte-965svo {font-size:10.5px;letter-spacing:1px;text-transform:uppercase;color:var(--tm-accent);font-weight:600;}h1.svelte-965svo {font-size:28px;font-weight:700;letter-spacing:-.6px;margin:4px 0 0;line-height:1.15;}.sub.svelte-965svo {font-size:13px;color:var(--tm-muted);margin:4px 0 0;}.prog.svelte-965svo {display:flex;align-items:center;gap:10px;margin-top:16px;}.bar.svelte-965svo {flex:1;max-width:260px;height:4px;border-radius:2px;background:var(--tm-fg-10);display:block;}.bar.svelte-965svo span:where(.svelte-965svo) {display:block;height:4px;border-radius:2px;background:var(--tm-accent);}.left.svelte-965svo {font-size:12px;}.actions.svelte-965svo {display:flex;gap:8px;margin-top:16px;flex-wrap:wrap;}.where.svelte-965svo {font-size:11.5px;color:var(--tm-muted);margin-top:6px;}.anchor.svelte-965svo {position:relative;display:inline-flex;}.dots.svelte-965svo {width:38px;justify-content:center;letter-spacing:1px;padding:0 !important;}.menu.svelte-965svo {left:0;top:40px;width:210px;padding:6px;}.menu.svelte-965svo button:where(.svelte-965svo) {display:flex;align-items:center;gap:9px;width:100%;height:32px;padding:0 10px;border:0;border-radius:8px;background:none;color:var(--tm-fg);font-size:12px;cursor:pointer;text-align:left;}.menu.svelte-965svo button:where(.svelte-965svo):hover {background:var(--tm-fg-8);}.desc.svelte-965svo {font-size:12.5px;line-height:1.6;color:var(--tm-muted);margin:20px 0 0;max-width:720px;display:-webkit-box;-webkit-line-clamp:3;line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;}.desc.open.svelte-965svo {display:block;}.link.svelte-965svo {border:0;background:none;padding:0;color:var(--tm-accent);font-size:12px;cursor:pointer;margin-top:4px;}.mbody.svelte-965svo {flex:1;min-width:0;}.note.svelte-965svo, .addnote.svelte-965svo {display:block;border:0;background:none;padding:0 8px 9px;text-align:left;font:inherit;font-size:12px;cursor:pointer;}.note.svelte-965svo {color:var(--tm-fg);font-style:italic;}.addnote.svelte-965svo {color:var(--tm-muted);}.addnote.svelte-965svo:hover {color:var(--tm-accent);}.noteform.svelte-965svo {display:flex;gap:6px;padding:0 8px 9px;}.noteform.svelte-965svo input:where(.svelte-965svo) {flex:1;min-width:0;height:28px;padding:0 8px;border-radius:7px;border:1px solid var(--tm-fg-14);background:var(--tm-fg-4);color:var(--tm-fg);font:inherit;font-size:12px;outline:none;}.noteform.svelte-965svo input:where(.svelte-965svo):focus {border-color:var(--tm-accent);}.noteform.svelte-965svo button:where(.svelte-965svo) {height:28px;padding:0 12px;border:0;border-radius:7px;background:var(--tm-accent);color:var(--tm-on-accent);font-size:11.5px;font-weight:650;cursor:pointer;}.chead.svelte-965svo {display:flex;align-items:center;gap:10px;margin:26px 0 6px;}.chead.svelte-965svo h2:where(.svelte-965svo) {margin:0;}.spacer.svelte-965svo {flex:1;}.find.svelte-965svo {display:flex;align-items:center;gap:6px;height:28px;padding:0 10px;border-radius:8px;background:var(--tm-fg-6);width:170px;color:var(--tm-muted);}.find.svelte-965svo input:where(.svelte-965svo) {flex:1;min-width:0;border:0;background:none;outline:none;color:var(--tm-fg);font:inherit;font-size:12px;}.hide.svelte-965svo {display:flex;align-items:center;gap:6px;font-size:12px;color:var(--tm-muted);cursor:pointer;}.hide.svelte-965svo input:where(.svelte-965svo) {accent-color:var(--tm-accent);}.shelf.svelte-965svo {display:flex;gap:10px;overflow-x:auto;margin-top:16px;padding-bottom:4px;scrollbar-width:thin;}.shelfitem.svelte-965svo {display:flex;gap:10px;align-items:center;flex:none;width:230px;padding:8px;border:1px solid var(--tm-fg-10);border-radius:12px;background:var(--tm-fg-4);color:inherit;cursor:pointer;text-align:left;font:inherit;}.shelfitem.svelte-965svo:hover {border-color:var(--tm-accent);}.scover.svelte-965svo {width:36px;height:52px;border-radius:3px 6px 6px 3px;overflow:hidden;display:flex;flex:none;}.stext.svelte-965svo {flex:1;min-width:0;display:flex;flex-direction:column;gap:3px;}.stitle.svelte-965svo {font-size:12px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.smeta.svelte-965svo {font-size:10.5px;color:var(--tm-muted);}.sbar.svelte-965svo {display:block;height:3px;border-radius:2px;background:var(--tm-fg-10);}.sbar.svelte-965svo span:where(.svelte-965svo) {display:block;height:3px;border-radius:2px;background:var(--tm-accent);}.actions.svelte-965svo button:where(.svelte-965svo) {height:34px;border-radius:17px;cursor:pointer;}.actions.svelte-965svo button:where(.svelte-965svo):disabled {opacity:.5;cursor:default;}.primary.svelte-965svo {padding:0 16px;border:0;background:var(--tm-accent);color:var(--tm-on-accent);font-size:12.5px;font-weight:650;display:flex;align-items:center;gap:7px;}.ghost.saved.svelte-965svo {color:var(--tm-live);border-color:color-mix(in srgb, var(--tm-live) 40%, transparent);}.ghost.svelte-965svo {display:flex;align-items:center;gap:6px;padding:0 14px;border:1px solid var(--tm-fg-14);background:transparent;color:var(--tm-fg);font-size:12px;}h2.svelte-965svo {font-size:14px;font-weight:600;margin:26px 0 6px;}.mrow.svelte-965svo {align-items:flex-start;}.mrow.svelte-965svo {display:flex;align-items:center;border-top:1px solid var(--tm-fg-6);}.mjump.svelte-965svo {flex:1;width:100%;display:flex;justify-content:space-between;gap:12px;padding:9px 8px;border:0;background:none;color:var(--tm-fg);font:inherit;font-size:12.5px;cursor:pointer;text-align:left;}.mjump.svelte-965svo span:where(.svelte-965svo) {color:var(--tm-muted);font-size:11px;}.mjump.svelte-965svo:hover {background:var(--tm-fg-4);}.rm.svelte-965svo {width:26px;height:26px;border:0;background:none;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;border-radius:6px;}.rm.svelte-965svo:hover {color:var(--tm-fg);background:var(--tm-fg-8);}.chap.svelte-965svo {display:flex;align-items:center;gap:14px;width:100%;padding:10px 8px;border:0;border-top:1px solid var(--tm-fg-6);background:transparent;color:var(--tm-fg);cursor:pointer;text-align:left;font:inherit;}.chap.svelte-965svo:hover {background:var(--tm-fg-4);}.chap.cur.svelte-965svo {background:var(--tm-accent-7);}.n.svelte-965svo {width:30px;flex:none;font:500 11px ui-monospace, Menlo, monospace;color:var(--tm-muted);}.title.svelte-965svo {flex:1;font-size:13px;min-width:0;}.cur.svelte-965svo .title:where(.svelte-965svo) {color:var(--tm-accent);}.done.svelte-965svo .title:where(.svelte-965svo) {color:var(--tm-muted);}.state.svelte-965svo {font-size:11px;color:var(--tm-muted);flex:none;}"
};
function Mi(r, o) {
	j(o, !0), _(r, ji);
	let l = Z(o, "store", 7), f = X(() => l().book), p = X(() => e(f) ? l().progressOf(e(f).id) : 0), h = X(() => e(f) ? l().speedFor(e(f).id) : 1), v = X(() => e(f) ? Math.max(0, ye(e(f).chapters, e(p))) : 0), y = X(() => !!e(f) && l().isPlaying(e(f).id)), b = X(() => e(f) ? l().bookmarks[e(f).id] ?? [] : []), x = X(() => l().bookBrowse.ids.map((e) => l().items[e]).filter(Boolean).map((e) => ({
		key: e.id,
		title: e.title,
		sub: e.sub,
		hue: e.hue,
		mark: e.mark,
		art: e.art
	}))), C = X(() => l().libraryBooks.filter((e) => !l().played[e.id] && l().progressOf(e.id) > 5).concat(l().item?.type === "book" && !l().libraryBooks.some((e) => e.id === l().now) && l().pos > 5 ? [l().item] : [])), T = X(() => Object.values(l().saved).filter((t) => !e(C).some((e) => e.id === t.id)).map((e) => l().items[e.id] ?? e)), O = X(() => !!e(f) && !!l().played[e(f).id]), ee = X(() => e(f) && e(f).chapters.length ? Math.max(0, e(f).chapters[e(v)].start + se(e(v)) - e(p)) : 0), ne = I(!1), re = I(""), N = I(!1), ie = I(null), P = I(""), ae = X(() => e(f) ? e(f).chapters.map((e, t) => ({
		c: e,
		i: t
	})).filter(({ c: t, i: n }) => (!e(ne) || n >= e(v)) && (!e(re).trim() || t.title.toLowerCase().includes(e(re).trim().toLowerCase()))) : []);
	function se(t) {
		return e(f) ? e(f).chapters[t].dur || (e(f).chapters[t + 1]?.start ?? e(f).dur) - e(f).chapters[t].start : 0;
	}
	z(() => {
		!l().bookId && l().bookBrowse.status === "idle" && l().loadBookBrowse();
	});
	function L(t) {
		e(f) && l().jumpTo(e(f).id, t);
	}
	var ce = le(), B = F(ce), H = (t) => {
		var r = hi(), i = V(F(r), 4), o = (t) => {
			var r = pi();
			n(r, 21, () => [...e(C), ...e(T)], (e) => e.id, (t, n) => {
				let r = X(() => l().durOf(e(n).id) ? Math.round(l().progressOf(e(n).id) / l().durOf(e(n).id) * 100) : 0);
				var i = fi(), o = G(i), c = G(o);
				q(c, {
					get hue() {
						return e(n).hue;
					},
					get art() {
						return e(n).art;
					},
					fill: !0,
					radius: 0,
					get mark() {
						return e(n).mark;
					},
					font: 12
				}), R(o);
				var d = V(o, 2), f = G(d), p = D(f, !0), m = V(f), h = D(m, !0), g = V(m, 2), _ = (t) => {
					var n = di(), i = G(n);
					let o;
					R(n), J(() => o = a(i, "", o, { width: `${e(r) ?? ""}%` })), u(t, n);
				};
				s(g, (t) => {
					e(r) > 0 && t(_);
				}), R(d), R(i), J((t) => {
					S(p, e(n).title), S(h, t);
				}, [() => e(r) > 0 ? `${e(r)}% · ${l().leftOf(e(n).id)}` : "Saved"]), w("click", i, () => l().openBook(e(n).id)), u(t, i);
			}), R(r), u(t, r);
		};
		s(i, (t) => {
			(e(C).length || e(T).length) && t(o);
		});
		var c = V(i, 2);
		jr(c, {
			get cards() {
				return e(x);
			},
			tall: !0,
			open: (e) => l().openBook(e)
		});
		var d = V(c, 2);
		mn(d, {
			get status() {
				return l().bookBrowse.status;
			},
			retry: () => l().loadBookBrowse()
		});
		var f = V(d, 2), p = (e) => {
			var t = mi();
			w("click", t, () => l().loadBookBrowse(!0)), u(e, t);
		};
		s(f, (e) => {
			l().bookBrowse.cursor && l().bookBrowse.status === "ready" && e(p);
		}), u(t, r);
	}, W = (r) => {
		var o = Ai(), _ = F(o), x = V(_, 2), C = (r) => {
			var o = ki(), _ = F(o), x = G(_), C = G(x);
			q(C, {
				get hue() {
					return e(f).hue;
				},
				get art() {
					return e(f).art;
				},
				fill: !0,
				radius: 0,
				get mark() {
					return e(f).mark;
				},
				font: 22
			}), R(x);
			var T = V(x, 2), A = V(G(T), 2), j = D(A, !0), I = V(A, 2), ce = D(I, !0), z = V(I, 2), B = (t) => {
				var n = gi(), r = G(n), i = G(r);
				let o;
				R(r);
				var s = V(r), c = D(s, !0);
				R(n), J((e, t) => {
					o = a(i, "", o, { width: e }), S(c, t);
				}, [() => `${e(O) ? 100 : Math.round(e(p) / e(f).dur * 100)}%`, () => e(O) ? "Finished" : `${E((e(f).dur - e(p)) / e(h))} left at ${e(h).toFixed(1)}×`]), u(t, n);
			};
			s(z, (t) => {
				e(f).dur && t(B);
			});
			var H = V(z, 2), le = (t) => {
				var n = _i(), r = D(n);
				J((t, n) => S(r, `Chapter ${t ?? ""} of ${e(f).chapters.length ?? ""} · ${n ?? ""} left in this chapter`), [() => M(e(v)), () => E(e(ee) / e(h))]), u(t, n);
			};
			s(H, (t) => {
				e(f).chapters.length && e(p) > 5 && !e(O) && t(le);
			});
			var W = V(H, 2), ue = G(W), K = G(ue);
			{
				let t = X(() => e(y) ? Q.pause : Q.play);
				$(K, {
					get d() {
						return e(t);
					},
					size: 12
				});
			}
			var Y = V(K, 1, !0);
			R(ue);
			var de = V(ue, 2);
			let Z;
			var fe = G(de);
			{
				let t = X(() => l().isFavorite(e(f).id) ? 0 : 1.8);
				$(fe, {
					get d() {
						return Q.heart;
					},
					size: 12,
					get stroke() {
						return e(t);
					}
				});
			}
			var pe = V(fe, 1, !0);
			R(de);
			var me = V(de, 2), he = V(me, 2), ge = G(he), _e = V(ge, 2), ve = (t) => {
				var n = vi(), r = G(n), i = G(r);
				$(i, {
					get d() {
						return Q.check;
					},
					size: 12,
					stroke: 2
				});
				var a = V(i, 1, !0);
				R(r);
				var o = V(r, 2), s = G(o);
				$(s, {
					get d() {
						return Q.prev;
					},
					size: 12
				}), U(), R(o), R(n), J(() => S(a, e(O) ? "Mark as not finished" : "Mark as finished")), w("click", r, () => {
					l().pop = null, l().markBook(e(f).id, !e(O));
				}), w("click", o, () => {
					l().pop = null, l().restartBook(e(f).id);
				}), u(t, n);
			};
			s(_e, (e) => {
				l().pop === "epmenu" && e(ve);
			}), R(he), R(W), R(T), R(_);
			var ye = V(_, 2), be = (t) => {
				var n = bi(), r = F(n);
				let i;
				var a = D(r, !0), o = V(r, 2), l = (t) => {
					var n = yi(), r = D(n, !0);
					J(() => S(r, e(N) ? "Less" : "More")), w("click", n, () => k(N, !e(N))), u(t, n);
				};
				s(o, (t) => {
					e(f).desc.length > 220 && t(l);
				}), J(() => {
					i = c(r, 1, "desc svelte-965svo", null, i, { open: e(N) }), S(a, e(f).desc);
				}), u(t, n);
			};
			s(ye, (t) => {
				e(f).desc && t(be);
			});
			var xe = V(ye, 2), Se = (r) => {
				var i = Ti(), a = V(F(i), 2);
				n(a, 17, () => e(b), (e) => e.at, (n, r) => {
					var i = wi(), a = G(i), o = G(a), c = G(o, !0), p = V(c), h = D(p, !0);
					R(o);
					var _ = V(o, 2), v = (n) => {
						var i = xi(), a = G(i);
						oe(a), d(a, (e) => Kt?.(e)), te(() => m(a, () => e(P), (e) => k(P, e))), U(2), R(i), J(() => t(a, "aria-label", `Note for ${e(r).label ?? ""}`)), g("submit", i, (t) => {
							t.preventDefault(), l().setBookmarkNote(e(f).id, e(r).at, e(P)), k(ie, null);
						}), w("keydown", a, (e) => {
							e.key === "Escape" && (e.stopPropagation(), k(ie, null));
						}), u(n, i);
					}, y = (t) => {
						var n = Si(), i = D(n, !0);
						J(() => S(i, e(r).note)), w("click", n, () => {
							k(ie, e(r).at, !0), k(P, e(r).note ?? "", !0);
						}), u(t, n);
					}, b = (t) => {
						var n = Ci();
						w("click", n, () => {
							k(ie, e(r).at, !0), k(P, "");
						}), u(t, n);
					};
					s(_, (t) => {
						e(ie) === e(r).at ? t(v) : e(r).note ? t(y, 1) : t(b, -1);
					}), R(a);
					var x = V(a, 2), C = G(x);
					$(C, {
						get d() {
							return Q.close;
						},
						size: 12,
						stroke: 2
					}), R(x), R(i), J((n) => {
						S(c, e(r).label), S(h, n), t(x, "aria-label", `Remove bookmark ${e(r).label ?? ""}`);
					}, [() => new Date(e(r).at).toLocaleDateString()]), w("click", o, () => L(e(r).pos)), w("click", x, () => l().removeBookmark(e(f).id, e(r).at)), u(n, i);
				}), u(r, i);
			};
			s(xe, (t) => {
				e(b).length && t(Se);
			});
			var Ce = V(xe, 2), we = V(G(Ce), 4), Te = (t) => {
				var n = Ei(), r = G(n);
				$(r, {
					get d() {
						return Q.search;
					},
					size: 12,
					stroke: 2
				});
				var i = V(r);
				oe(i), R(n), m(i, () => e(re), (e) => k(re, e)), u(t, n);
			};
			s(we, (t) => {
				e(f).chapters.length > 12 && t(Te);
			});
			var Ee = V(we, 2), De = (t) => {
				var n = Di(), r = G(n);
				oe(r), U(), R(n), i(r, () => e(ne), (e) => k(ne, e)), u(t, n);
			};
			s(Ee, (t) => {
				e(v) > 0 && t(De);
			}), R(Ce);
			var Oe = V(Ce, 2);
			n(Oe, 17, () => e(ae), ({ c: e, i: t }) => t, (t, n) => {
				let r = () => e(n).c, i = () => e(n).i;
				var a = Oi();
				let o;
				var s = G(a), l = D(s, !0), d = V(s, 2), f = D(d, !0), m = V(d, 2), h = D(m, !0);
				R(a), J((t, n) => {
					o = c(a, 1, "chap svelte-965svo", null, o, {
						cur: i() === e(v) && e(p) > 0,
						done: i() < e(v)
					}), S(l, t), S(f, r().title), S(h, n);
				}, [() => M(i()), () => i() < e(v) ? "Finished" : i() === e(v) && e(p) > 0 && se(i()) ? `${Math.min(100, Math.round((e(p) - r().start) / se(i()) * 100))}%` : se(i()) ? E(se(i())) : ""]), w("click", a, () => L(r().start)), u(t, a);
			}), J((n, r, i, a) => {
				S(j, e(f).title), S(ce, e(f).sub), ue.disabled = !e(f).chapters.length, S(Y, n), Z = c(de, 1, "ghost svelte-965svo", null, Z, { saved: r }), t(de, "aria-pressed", i), S(pe, a), me.disabled = e(p) <= 0, t(ge, "aria-expanded", l().pop === "epmenu");
			}, [
				() => e(y) ? "Pause" : e(p) > 5 ? `Resume chapter ${M(e(v))}` : "Start listening",
				() => l().isFavorite(e(f).id),
				() => l().isFavorite(e(f).id),
				() => l().isFavorite(e(f).id) ? "In My Media" : "Save to My Media"
			]), w("click", ue, () => l().play(e(f).id)), w("click", de, () => l().toggleFavorite(e(f).id)), w("click", me, () => l().bookmark()), w("click", ge, () => l().togglePop("epmenu")), u(r, o);
		};
		s(x, (t) => {
			e(f) && t(C);
		});
		var T = V(x, 2), A = (t) => {
			{
				let n = X(() => l().bookStatus[l().bookId] ?? "loading");
				mn(t, {
					get status() {
						return e(n);
					},
					retry: () => l().bookId && l().ensureBook(l().bookId),
					empty: "This audiobook has no playable chapters yet."
				});
			}
		};
		s(T, (t) => {
			e(f)?.chapters.length || t(A);
		}), w("click", _, () => l().bookId = null), u(r, o);
	};
	s(B, (e) => {
		l().bookId ? e(W, -1) : e(H);
	}), u(r, ce), A();
}
C(["click", "keydown"]);
//#endregion
//#region src/components/SearchView.svelte
var Ni = l("<div class=\"srow svelte-1occquv\"><button class=\"row svelte-1occquv\"><!> <span class=\"text svelte-1occquv\"><span class=\"title svelte-1occquv\"> </span><span class=\"meta svelte-1occquv\"> </span></span> <span class=\"act svelte-1occquv\"><!> </span></button> <span class=\"sfav svelte-1occquv\"><!></span></div>"), Pi = l("<button class=\"more svelte-1occquv\">More stations</button>"), Fi = l("<h2 class=\"svelte-1occquv\">Shows and books</h2>"), Ii = l("<h2 class=\"svelte-1occquv\"> </h2> <div class=\"list svelte-1occquv\"></div> <!> <!> <!>", 1), Li = l("<button class=\"row svelte-1occquv\"><!> <span class=\"text svelte-1occquv\"><span class=\"title svelte-1occquv\"> </span><span class=\"meta svelte-1occquv\"> </span></span> <span class=\"act svelte-1occquv\"> </span></button>"), Ri = l("<h1 class=\"h1 svelte-1occquv\"> </h1> <!> <div class=\"list svelte-1occquv\"></div> <!>", 1), zi = {
	hash: "svelte-1occquv",
	code: ".h1.svelte-1occquv {font-size:22px;font-weight:650;letter-spacing:-.4px;margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.list.svelte-1occquv {margin-top:14px;}.row.svelte-1occquv {display:flex;align-items:center;gap:14px;width:100%;padding:10px 8px;border:0;border-radius:10px;background:none;color:inherit;text-align:left;cursor:pointer;font:inherit;}.row.svelte-1occquv:hover {background:var(--tm-fg-5);}.srow.svelte-1occquv {display:flex;align-items:center;}.srow.svelte-1occquv .row:where(.svelte-1occquv) {flex:1;min-width:0;}.sfav.svelte-1occquv {flex:none;margin-left:4px;}.text.svelte-1occquv {flex:1;min-width:0;display:flex;flex-direction:column;}.title.svelte-1occquv {font-size:13px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.meta.svelte-1occquv {font-size:11.5px;color:var(--tm-muted);margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.act.svelte-1occquv {font-size:11.5px;color:var(--tm-accent);flex:none;display:flex;align-items:center;gap:5px;}h2.svelte-1occquv {font-size:13px;font-weight:650;margin:18px 0 0;color:var(--tm-muted);}.more.svelte-1occquv {display:block;margin:10px auto 4px;height:30px;padding:0 16px;border-radius:15px;border:1px solid var(--tm-fg-14);background:transparent;color:var(--tm-fg);font-size:12px;cursor:pointer;}"
};
function Bi(t, r) {
	j(r, !0), _(t, zi);
	let i = {
		station: "Radio",
		podcast: "Podcast",
		audiobook: "Audiobook"
	}, a = {
		station: "Play",
		podcast: "Open",
		audiobook: "Open"
	}, o = X(() => r.store.stationHits.ids.map((e) => r.store.items[e]).filter((e) => e?.type === "radio")), c = X(() => r.store.stationHits.status !== "idle"), l = X(() => r.store.search.status === "ready" && !r.store.search.hits.length && (!e(c) || r.store.stationHits.status === "ready" && !e(o).length));
	var d = Ri(), f = F(d), p = D(f), m = V(f, 2), h = (t) => {
		var i = Ii(), a = F(i), c = D(a), l = V(a, 2);
		n(l, 21, () => e(o), (e) => e.id, (t, n) => {
			let i = X(() => r.store.isPlaying(e(n).id));
			var a = Ni(), o = G(a), s = G(o);
			q(s, {
				get hue() {
					return e(n).hue;
				},
				get art() {
					return e(n).art;
				},
				get mark() {
					return e(n).mark;
				},
				size: 44
			});
			var c = V(s, 2), l = G(c), d = D(l, !0), f = V(l), p = D(f, !0);
			R(c);
			var m = V(c, 2), h = G(m);
			{
				let t = X(() => e(i) ? Q.stop : Q.play);
				$(h, {
					get d() {
						return e(t);
					},
					size: 12
				});
			}
			var g = V(h, 1, !0);
			R(m), R(o);
			var _ = V(o, 2);
			Tn(G(_), {
				get store() {
					return r.store;
				},
				get id() {
					return e(n).id;
				},
				size: 14
			}), R(_), R(a), J(() => {
				S(d, e(n).title), S(p, e(n).sub), S(g, e(i) ? "Stop" : "Play");
			}), w("click", o, () => e(i) ? r.store.stop() : r.store.play(e(n).id)), u(t, a);
		}), R(l);
		var d = V(l, 2), f = (e) => {
			var t = Pi();
			w("click", t, () => r.store.loadStationHits(r.store.search.q, !0)), u(e, t);
		};
		s(d, (e) => {
			r.store.stationHits.more && r.store.stationHits.status === "ready" && e(f);
		});
		var p = V(d, 2), m = (t) => {
			mn(t, {
				get status() {
					return r.store.stationHits.status;
				},
				retry: () => r.store.loadStationHits(r.store.search.q, e(o).length > 0)
			});
		};
		s(p, (e) => {
			(r.store.stationHits.status === "loading" || r.store.stationHits.status === "error") && e(m);
		});
		var h = V(p, 2), g = (e) => {
			var t = Fi();
			u(e, t);
		};
		s(h, (e) => {
			r.store.search.hits.length && e(g);
		}), J((e) => S(c, `Stations${e ?? ""}`), [() => r.store.stationHits.total ? ` · ${r.store.stationHits.total.toLocaleString()}` : ""]), u(t, i);
	};
	s(m, (t) => {
		e(c) && t(h);
	});
	var g = V(m, 2);
	n(g, 21, () => r.store.search.hits, (e) => e.kind + e.id, (t, n) => {
		var o = Li(), s = G(o);
		{
			let t = X(() => ne(e(n).slug || e(n).id)), r = X(() => N(e(n).title));
			q(s, {
				get hue() {
					return e(t);
				},
				get art() {
					return e(n).art;
				},
				get mark() {
					return e(r);
				},
				size: 44
			});
		}
		var c = V(s, 2), l = G(c), d = D(l, !0), f = V(l), p = D(f);
		R(c);
		var m = V(c, 2), h = D(m, !0);
		R(o), J(() => {
			S(d, e(n).title), S(p, `${i[e(n).kind] ?? ""}${e(n).subtitle ? ` · ${e(n).subtitle}` : ""}`), S(h, a[e(n).kind]);
		}), w("click", o, () => r.store.openHit(e(n))), u(t, o);
	}), R(g);
	var v = V(g, 2);
	{
		let t = X(() => r.store.search.status === "idle" ? "loading" : r.store.search.status), n = X(() => e(l) ? "Nothing matches. Try a station, show, book or author." : "");
		mn(v, {
			get status() {
				return e(t);
			},
			retry: () => r.store.setQuery(r.store.query),
			get empty() {
				return e(n);
			}
		});
	}
	J((e) => S(p, `Results for “${e ?? ""}”`), [() => r.store.query.trim()]), u(t, d), A();
}
C(["click"]);
//#endregion
//#region src/components/NowPlaying.svelte
var Vi = l("<div class=\"blank svelte-1b7bd5u\"></div>"), Hi = l("<span class=\"kind svelte-1b7bd5u\"> </span>"), Ui = l("<div class=\"prog svelte-1b7bd5u\" aria-label=\"Progress\"><span class=\"bar svelte-1b7bd5u\"><span class=\"svelte-1b7bd5u\"></span></span> <span class=\"pct svelte-1b7bd5u\"> </span></div>"), Wi = l("<span class=\"badge svelte-1b7bd5u\"> </span>"), Gi = l("<button role=\"tab\"> <!></button>"), Ki = l("<div class=\"tabs svelte-1b7bd5u\" role=\"tablist\"></div>"), qi = l("<button class=\"q svelte-1b7bd5u\"><!> <span class=\"qtext svelte-1b7bd5u\"><span class=\"qtitle svelte-1b7bd5u\"> </span><span class=\"qmeta svelte-1b7bd5u\"> </span></span></button>"), Ji = l("<h3 class=\"svelte-1b7bd5u\">Continue listening</h3> <!>", 1), Yi = l("<div class=\"empty svelte-1b7bd5u\">Choose a station, an episode or a book. What you are listening to shows here.</div> <!>", 1), Xi = l("<span class=\"ontext svelte-1b7bd5u\"><span class=\"qtitle svelte-1b7bd5u\"> </span><span class=\"qmeta svelte-1b7bd5u\"> </span></span>"), Zi = l("<span class=\"ontext svelte-1b7bd5u\"><span class=\"qtitle svelte-1b7bd5u\"> </span><span class=\"qmeta svelte-1b7bd5u\">This station does not publish song titles right now.</span></span>"), Qi = l("<dt class=\"svelte-1b7bd5u\">From</dt><dd class=\"svelte-1b7bd5u\"> </dd>", 1), $i = l("<div class=\"q track svelte-1b7bd5u\"><!> <span class=\"qtext svelte-1b7bd5u\"><span class=\"qtitle svelte-1b7bd5u\"> </span><span class=\"qmeta svelte-1b7bd5u\"> </span></span></div>"), ea = l("<h3 class=\"svelte-1b7bd5u\">Recently played</h3> <!>", 1), ta = l("<div class=\"onair svelte-1b7bd5u\"><span class=\"dot svelte-1b7bd5u\" aria-hidden=\"true\"></span> <!></div> <h3 class=\"svelte-1b7bd5u\">Station</h3> <dl class=\"facts svelte-1b7bd5u\"><dt class=\"svelte-1b7bd5u\">Genre</dt><dd class=\"svelte-1b7bd5u\"> </dd> <!></dl> <!>", 1), na = l("<form class=\"plform svelte-1b7bd5u\"><input maxlength=\"80\" placeholder=\"Playlist name\" aria-label=\"Playlist name\" class=\"svelte-1b7bd5u\"/> <button type=\"submit\" class=\"svelte-1b7bd5u\">Save</button></form>"), ra = l("<div class=\"qbar svelte-1b7bd5u\"><button class=\"svelte-1b7bd5u\"><!>Shuffle</button> <button class=\"svelte-1b7bd5u\"><!>Save as playlist</button> <button class=\"svelte-1b7bd5u\"><!>Clear</button></div> <!>", 1), ia = l("<small class=\"svelte-1b7bd5u\">after your picks</small>"), aa = l("<div class=\"qfrom svelte-1b7bd5u\"><span class=\"svelte-1b7bd5u\"> </span><!></div>"), oa = l("<div role=\"listitem\" draggable=\"true\"><span class=\"grip svelte-1b7bd5u\" aria-hidden=\"true\"><!></span> <!> <button class=\"qtext svelte-1b7bd5u\"><span class=\"qtitle svelte-1b7bd5u\"> </span><span class=\"qmeta svelte-1b7bd5u\"> </span></button> <span class=\"moves svelte-1b7bd5u\"><button class=\"mv svelte-1b7bd5u\"><!></button> <button class=\"mv svelte-1b7bd5u\"><!></button></span> <button class=\"rm svelte-1b7bd5u\"><!></button></div>"), sa = l("<!> <!>", 1), ca = l("<div class=\"empty svelte-1b7bd5u\">Queue is empty. Use Play next or Queue on any episode, or play one from a show to queue the rest.</div>"), la = l("<button><span class=\"t svelte-1b7bd5u\"> </span> <span class=\"ctitle svelte-1b7bd5u\"> </span> <span class=\"cstate svelte-1b7bd5u\"> </span></button>"), ua = l("<div class=\"empty svelte-1b7bd5u\"> </div>"), da = l("<div class=\"q svelte-1b7bd5u\"><button class=\"qtext svelte-1b7bd5u\"><span class=\"qtitle svelte-1b7bd5u\"> </span><span class=\"qmeta svelte-1b7bd5u\"> </span></button> <button class=\"rm svelte-1b7bd5u\"><!></button></div>"), fa = l("<div class=\"empty svelte-1b7bd5u\">No bookmarks yet. Your place is saved automatically; bookmarks keep moments you want to return to.</div>"), pa = l("<button class=\"add svelte-1b7bd5u\"><!>Bookmark this moment</button> <!>", 1), ma = l("<dt class=\"svelte-1b7bd5u\">Length</dt><dd class=\"svelte-1b7bd5u\"> </dd>", 1), ha = l("<dt class=\"svelte-1b7bd5u\">Chapters</dt><dd class=\"svelte-1b7bd5u\"> </dd>", 1), ga = l("<dl class=\"facts svelte-1b7bd5u\"><dt class=\"svelte-1b7bd5u\">Author</dt><dd class=\"svelte-1b7bd5u\"> </dd> <!> <!> <dt class=\"svelte-1b7bd5u\">Narration</dt><dd class=\"svelte-1b7bd5u\">LibriVox volunteers</dd></dl>"), _a = l("<dt class=\"svelte-1b7bd5u\">Published</dt><dd class=\"svelte-1b7bd5u\"> </dd>", 1), va = l("<dl class=\"facts svelte-1b7bd5u\"><dt class=\"svelte-1b7bd5u\">Show</dt><dd class=\"svelte-1b7bd5u\"><button class=\"link svelte-1b7bd5u\"> </button></dd> <!> <!></dl>"), ya = l("<p class=\"desc svelte-1b7bd5u\"> </p>"), ba = l("<!> <!> <!>", 1), xa = l("<button><span class=\"who svelte-1b7bd5u\"> </span> </button>"), Sa = l("<div></div>"), Ca = l("<aside class=\"aside svelte-1b7bd5u\" aria-label=\"Now playing\"><div class=\"top svelte-1b7bd5u\"><div><!> <!></div> <div class=\"trow svelte-1b7bd5u\"><div class=\"ttext svelte-1b7bd5u\"><div class=\"title svelte-1b7bd5u\"> </div><div class=\"sub svelte-1b7bd5u\"> </div></div> <!></div> <!></div> <!> <div class=\"body svelte-1b7bd5u\" role=\"tabpanel\"><!></div></aside>"), wa = {
	hash: "svelte-1b7bd5u",
	code: ".aside.svelte-1b7bd5u {width:300px;flex:none;background:var(--tm-panel-surface);display:flex;flex-direction:column;min-height:0;}.top.svelte-1b7bd5u {padding:20px 20px 14px;}.art.svelte-1b7bd5u {width:100%;aspect-ratio:1.45;border-radius:14px;position:relative;overflow:hidden;display:flex;box-shadow:0 14px 36px rgba(0, 0, 0, .35);}.blank.svelte-1b7bd5u {flex:1;background:var(--tm-fg-6);}.kind.svelte-1b7bd5u {position:absolute;left:12px;top:12px;font-size:9.5px;font-weight:700;letter-spacing:.8px;padding:3px 8px;border-radius:20px;background:rgba(0, 0, 0, .45);color:#fff;}.trow.svelte-1b7bd5u {display:flex;align-items:flex-start;gap:6px;}.ttext.svelte-1b7bd5u {flex:1;min-width:0;}.trow.svelte-1b7bd5u .fav {margin-top:10px;}.title.svelte-1b7bd5u {font-size:15px;font-weight:650;margin-top:14px;line-height:1.3;text-wrap:pretty;display:-webkit-box;-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}.sub.svelte-1b7bd5u {font-size:12px;color:var(--tm-muted);margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.tabs.svelte-1b7bd5u {display:flex;gap:0;padding:0 10px;border-bottom:1px solid var(--tm-fg-7);overflow-x:auto;scrollbar-width:none;}.tabs.svelte-1b7bd5u button:where(.svelte-1b7bd5u) {flex:none;display:flex;align-items:center;gap:4px;height:34px;padding:0 5px;border:0;background:none;color:var(--tm-muted);font-size:11px;font-weight:600;white-space:nowrap;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;}.badge.svelte-1b7bd5u {font-size:9.5px;min-width:15px;height:15px;padding:0 4px;border-radius:8px;display:grid;place-items:center;background:var(--tm-fg-10);color:var(--tm-fg);}.tabs.svelte-1b7bd5u button.on:where(.svelte-1b7bd5u) {color:var(--tm-fg);border-bottom-color:var(--tm-accent);}.body.svelte-1b7bd5u {flex:1;min-height:0;overflow:auto;padding:8px 12px 12px;}.q.svelte-1b7bd5u {display:flex;align-items:center;gap:10px;padding:7px 8px;border-radius:9px;}.q.svelte-1b7bd5u:hover {background:var(--tm-fg-5);}.qtext.svelte-1b7bd5u {flex:1;min-width:0;display:flex;flex-direction:column;border:0;padding:0;background:none;color:inherit;text-align:left;cursor:pointer;font:inherit;}.track.svelte-1b7bd5u .qtext:where(.svelte-1b7bd5u) {cursor:default;}.qtitle.svelte-1b7bd5u {font-size:12px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.qmeta.svelte-1b7bd5u {font-size:11px;color:var(--tm-muted);margin-top:2px;}.qbar.svelte-1b7bd5u {display:flex;gap:4px;padding:2px 0 8px;}.qbar.svelte-1b7bd5u button:where(.svelte-1b7bd5u) {display:flex;align-items:center;gap:5px;height:26px;padding:0 8px;border:0;border-radius:7px;background:var(--tm-fg-6);color:var(--tm-fg);font-size:11px;cursor:pointer;}.qbar.svelte-1b7bd5u button:where(.svelte-1b7bd5u):hover:not(:disabled) {background:var(--tm-fg-10);}.qbar.svelte-1b7bd5u button:where(.svelte-1b7bd5u):disabled {opacity:.4;cursor:default;}.plform.svelte-1b7bd5u {display:flex;gap:6px;padding:0 0 8px;}.plform.svelte-1b7bd5u input:where(.svelte-1b7bd5u) {flex:1;min-width:0;height:28px;padding:0 8px;border-radius:7px;border:1px solid var(--tm-fg-14);background:var(--tm-fg-4);color:var(--tm-fg);font:inherit;font-size:12px;outline:none;}.plform.svelte-1b7bd5u input:where(.svelte-1b7bd5u):focus {border-color:var(--tm-accent);}.plform.svelte-1b7bd5u button:where(.svelte-1b7bd5u) {height:28px;padding:0 12px;border:0;border-radius:7px;background:var(--tm-accent);color:var(--tm-on-accent);font-size:11.5px;font-weight:650;cursor:pointer;}.drag.svelte-1b7bd5u {cursor:grab;}.drag.dragging.svelte-1b7bd5u {opacity:.4;}.drag.over.svelte-1b7bd5u {box-shadow:inset 0 2px 0 var(--tm-accent);}.grip.svelte-1b7bd5u {color:var(--tm-muted);opacity:.5;display:grid;flex:none;margin-right:-4px;}.moves.svelte-1b7bd5u {display:flex;flex-direction:column;opacity:0;flex:none;}.q.svelte-1b7bd5u:hover .moves:where(.svelte-1b7bd5u), .moves.svelte-1b7bd5u:focus-within {opacity:1;}.mv.svelte-1b7bd5u {width:20px;height:14px;border:0;padding:0;background:none;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;}.mv.svelte-1b7bd5u:hover:not(:disabled) {color:var(--tm-fg);}.mv.svelte-1b7bd5u:disabled {opacity:.3;cursor:default;}.rm.svelte-1b7bd5u {width:24px;height:24px;border:0;background:none;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;flex:none;border-radius:6px;}.rm.svelte-1b7bd5u:hover {color:var(--tm-fg);background:var(--tm-fg-8);}.qfrom.svelte-1b7bd5u {display:flex;align-items:baseline;gap:6px;padding:10px 6px 4px;font-size:10.5px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--tm-muted);}.qfrom.svelte-1b7bd5u span:where(.svelte-1b7bd5u) {overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0;}.qfrom.svelte-1b7bd5u small:where(.svelte-1b7bd5u) {flex:none;font-weight:500;text-transform:none;letter-spacing:0;}.empty.svelte-1b7bd5u {padding:24px 8px;font-size:12px;color:var(--tm-muted);text-align:center;}.art.book.svelte-1b7bd5u {aspect-ratio:0.8;width:62%;margin:0 auto;border-radius:6px 12px 12px 6px;}.prog.svelte-1b7bd5u {display:flex;align-items:center;gap:10px;margin-top:10px;}.bar.svelte-1b7bd5u {flex:1;height:4px;border-radius:2px;background:var(--tm-fg-10);display:block;}.bar.svelte-1b7bd5u span:where(.svelte-1b7bd5u) {display:block;height:4px;border-radius:2px;background:var(--tm-accent);}.pct.svelte-1b7bd5u {font-size:11px;color:var(--tm-muted);flex:none;}h3.svelte-1b7bd5u {font-size:11px;font-weight:650;letter-spacing:.6px;text-transform:uppercase;color:var(--tm-muted);margin:16px 8px 6px;}.onair.svelte-1b7bd5u {display:flex;align-items:center;gap:10px;padding:10px 8px;border-radius:10px;background:var(--tm-accent-8);}.dot.svelte-1b7bd5u {width:8px;height:8px;border-radius:50%;background:var(--tm-live);flex:none;box-shadow:0 0 0 3px color-mix(in srgb, var(--tm-live) 25%, transparent);}.ontext.svelte-1b7bd5u {min-width:0;display:flex;flex-direction:column;}.facts.svelte-1b7bd5u {display:grid;grid-template-columns:auto 1fr;gap:6px 12px;margin:8px 8px 0;font-size:12px;}.facts.svelte-1b7bd5u dt:where(.svelte-1b7bd5u) {color:var(--tm-muted);}.facts.svelte-1b7bd5u dd:where(.svelte-1b7bd5u) {margin:0;min-width:0;overflow:hidden;text-overflow:ellipsis;}.link.svelte-1b7bd5u {border:0;padding:0;background:none;color:var(--tm-accent);font:inherit;cursor:pointer;text-align:left;}.desc.svelte-1b7bd5u {font-size:12px;line-height:1.55;color:var(--tm-muted);margin:12px 8px 0;white-space:pre-line;}.add.svelte-1b7bd5u {display:flex;align-items:center;justify-content:center;gap:6px;width:100%;height:32px;margin:4px 0 8px;border:1px dashed var(--tm-fg-16);border-radius:9px;background:none;color:var(--tm-fg);font:inherit;font-size:12px;cursor:pointer;}.add.svelte-1b7bd5u:hover {background:var(--tm-fg-5);}button.q.svelte-1b7bd5u {width:100%;border:0;background:none;color:inherit;cursor:pointer;text-align:left;font:inherit;}.q.svelte-1b7bd5u .qtext:where(.svelte-1b7bd5u) {display:flex;flex-direction:column;}.ctitle.svelte-1b7bd5u {flex:1;min-width:0;}.cstate.svelte-1b7bd5u {font-size:11px;color:var(--tm-muted);flex:none;}.chap.done.svelte-1b7bd5u .ctitle:where(.svelte-1b7bd5u) {color:var(--tm-muted);}.chap.svelte-1b7bd5u {display:flex;gap:10px;width:100%;padding:8px;border:0;border-radius:8px;background:transparent;color:var(--tm-fg);cursor:pointer;text-align:left;font:inherit;font-size:12.5px;}.chap.svelte-1b7bd5u:hover {background:var(--tm-fg-5);}.chap.cur.svelte-1b7bd5u {background:var(--tm-accent-8);color:var(--tm-accent);}.t.svelte-1b7bd5u {font:500 11px ui-monospace, Menlo, monospace;color:var(--tm-muted);width:52px;flex:none;padding-top:1px;}.line.svelte-1b7bd5u {display:block;width:100%;padding:7px 8px;border:0;border-radius:8px;background:transparent;cursor:pointer;text-align:left;font:inherit;font-size:13px;line-height:1.5;color:var(--tm-fg-45);}.line.svelte-1b7bd5u:hover {background:var(--tm-fg-4);}.line.cur.svelte-1b7bd5u {color:var(--tm-fg);background:var(--tm-accent-8);}.who.svelte-1b7bd5u {display:block;font:500 10px ui-monospace, Menlo, monospace;color:var(--tm-muted);margin-bottom:2px;}"
};
function Ta(r, i) {
	j(i, !0), _(r, wa);
	let o = Z(i, "store", 7), l = X(() => o().item), f = X(() => o().activeRtab), p = X(() => e(l)?.type === "radio" ? o().nowPlaying[e(l).stationId] : void 0), h = X(() => e(l)?.type === "book" ? e(l) : null), v = X(() => e(h) ? o().bookmarks[e(h).id] ?? [] : []), b = X(() => e(l) ? o().durOf(e(l).id) : 0), C = X(() => o().continueIds.filter((e) => e !== o().now)), T = {
		onair: "On air",
		queue: "Up next",
		chaps: "Chapters",
		trans: "Transcript",
		marks: "Bookmarks",
		about: "About"
	}, O = (t) => t === "queue" ? o().queue.length : t === "marks" ? e(v).length : 0, ee = X(() => e(p)?.art || e(l)?.art), ne = X(() => e(p)?.title || e(l)?.title || "Nothing playing"), re = X(() => e(l) ? e(l).type === "radio" ? e(p)?.title ? [e(p).artist, e(l).title].filter(Boolean).join(" · ") : e(l).sub : e(l).type === "book" && e(l).chapters.length > 1 && o().chapIdx >= 0 ? `${e(l).sub} · Chapter ${M(o().chapIdx)}` : e(l).sub : "Pick a station, episode or book."), N = X(() => o().transcript?.lines ?? []), ie = I(void 0), P = I(null), ae = I(!1), L = I(""), B = I(-1);
	function ue(t) {
		e(P) && o().moveQueue(e(P), t), k(P, null), k(B, -1);
	}
	let K = (t) => {
		if (!e(l) || !H(e(l))) return 0;
		let n = e(l).chapters[t];
		return n.dur || (e(l).chapters[t + 1]?.start ?? e(b)) - n.start;
	};
	z(() => {
		e(f) === "trans" && o().transcriptKey && o().loadTranscript();
	}), z(() => {
		let t = o().lineIdx;
		e(f) !== "trans" || t < 0 || e(ie)?.querySelectorAll(".line")[t]?.scrollIntoView({
			block: "nearest",
			behavior: "smooth"
		});
	});
	let Y = X(() => {
		let t = o().transcript;
		return e(l) ? !t || t.state === "loading" ? "Loading transcript…" : t.state === "queued" || t.state === "running" ? "OndaCast is preparing a transcript. Check back in a few minutes." : t.state === "error" ? "The transcript could not be loaded." : "No transcript for this item yet." : "Nothing is playing.";
	});
	var de = Ca(), fe = G(de), pe = G(fe);
	let me;
	var he = G(pe), ge = (t) => {
		q(t, {
			get hue() {
				return e(l).hue;
			},
			get art() {
				return e(ee);
			},
			fill: !0,
			radius: 0,
			get mark() {
				return e(l).mark;
			},
			font: 26
		});
	}, _e = (e) => {
		var t = Vi();
		u(e, t);
	};
	s(he, (t) => {
		e(l) ? t(ge) : t(_e, -1);
	});
	var ve = V(he, 2), ye = (e) => {
		var t = Hi(), n = D(t, !0);
		J(() => S(n, o().kindLabel)), u(e, t);
	};
	s(ve, (t) => {
		e(l) && t(ye);
	}), R(pe);
	var be = V(pe, 2), xe = G(be), Se = G(xe), Ce = D(Se, !0), we = V(Se), Te = D(we, !0);
	R(xe);
	var Ee = V(xe, 2), De = (t) => {
		Tn(t, {
			get store() {
				return o();
			},
			get id() {
				return e(l).id;
			},
			size: 18
		});
	};
	s(Ee, (t) => {
		e(l) && t(De);
	}), R(be);
	var Oe = V(be, 2), ke = (t) => {
		var n = Ui(), r = G(n), i = G(r);
		let s;
		R(r);
		var c = V(r, 2), l = D(c);
		R(n), J((e, t, n) => {
			s = a(i, "", s, { width: e }), S(l, `${t ?? ""}% · ${n ?? ""} left`);
		}, [
			() => `${Math.min(100, Math.round(o().pos / e(b) * 100))}%`,
			() => Math.min(100, Math.round(o().pos / e(b) * 100)),
			() => E((e(b) - o().pos) / o().speed)
		]), u(t, n);
	}, Ae = X(() => e(l) && H(e(l)) && e(b));
	s(Oe, (t) => {
		e(Ae) && t(ke);
	}), R(fe);
	var je = V(fe, 2), Me = (r) => {
		var i = Ki();
		n(i, 20, () => o().rightTabs, (e) => e, (n, r) => {
			var i = Gi();
			let a;
			var l = G(i, !0), d = V(l), p = (e) => {
				var t = Wi(), n = D(t, !0);
				J((e) => S(n, e), [() => O(r)]), u(e, t);
			}, m = X(() => O(r));
			s(d, (t) => {
				e(m) && t(p);
			}), R(i), J(() => {
				t(i, "aria-selected", e(f) === r), a = c(i, 1, "svelte-1b7bd5u", null, a, { on: e(f) === r }), S(l, T[r]);
			}), w("click", i, () => o().rtab = r), u(n, i);
		}), R(i), u(r, i);
	};
	s(je, (t) => {
		e(l) && t(Me);
	});
	var Ne = V(je, 2), Pe = G(Ne), Fe = (t) => {
		var r = Yi(), i = V(F(r), 2), a = (t) => {
			var r = Ji(), i = V(F(r), 2);
			n(i, 16, () => e(C), (e) => e, (t, n) => {
				let r = X(() => o().items[n]);
				var i = le(), a = F(i), c = (t) => {
					var i = qi(), a = G(i);
					q(a, {
						get hue() {
							return e(r).hue;
						},
						get art() {
							return e(r).art;
						},
						get mark() {
							return e(r).mark;
						},
						size: 34,
						radius: 7,
						font: 9
					});
					var s = V(a, 2), c = G(s), l = D(c, !0), d = V(c), f = D(d);
					R(s), R(i), J((t) => {
						S(l, e(r).title), S(f, `${se[e(r).type] ?? ""} · ${t ?? ""}`);
					}, [() => o().leftOf(n)]), w("click", i, () => o().play(n)), u(t, i);
				};
				s(a, (t) => {
					e(r) && t(c);
				}), u(t, i);
			}), u(t, r);
		};
		s(i, (t) => {
			e(C).length && t(a);
		}), u(t, r);
	}, Ie = (t) => {
		var r = ta(), i = F(r), a = V(G(i), 2), o = (t) => {
			var n = Xi(), r = G(n), i = D(r, !0), a = V(r), o = D(a, !0);
			R(n), J(() => {
				S(i, e(p).title), S(o, e(p).artist || e(l).title);
			}), u(t, n);
		}, c = (t) => {
			var n = Zi(), r = G(n), i = D(r, !0);
			U(), R(n), J(() => S(i, e(l).title)), u(t, n);
		};
		s(a, (t) => {
			e(p)?.title ? t(o) : t(c, -1);
		}), R(i);
		var d = V(i, 4), f = V(G(d)), m = D(f, !0), h = V(f, 2), g = (t) => {
			var n = Qi(), r = V(F(n)), i = D(r, !0);
			J((e) => S(i, e), [() => e(l).sub.split(" · ")[0]]), u(t, n);
		};
		s(h, (t) => {
			e(l).sub && t(g);
		}), R(d);
		var _ = V(d, 2), v = (t) => {
			var r = ea(), i = V(F(r), 2);
			n(i, 17, () => e(p).recent, x, (t, n) => {
				var r = $i(), i = G(r);
				{
					let t = X(() => e(n).title.slice(0, 2).toUpperCase());
					q(i, {
						get hue() {
							return e(l).hue;
						},
						get art() {
							return e(n).art;
						},
						get mark() {
							return e(t);
						},
						size: 34,
						radius: 7,
						font: 9
					});
				}
				var a = V(i, 2), o = G(a), s = D(o, !0), c = V(o), d = D(c, !0);
				R(a), R(r), J((t) => {
					S(s, e(n).title), S(d, t);
				}, [() => [e(n).artist, ce(e(n).at)].filter(Boolean).join(" · ")]), u(t, r);
			}), u(t, r);
		};
		s(_, (t) => {
			e(p)?.recent.length && t(v);
		}), J(() => S(m, e(l).genre)), u(t, r);
	}, Le = (r) => {
		var i = sa(), a = F(i), f = (n) => {
			var r = ra(), i = F(r), a = G(i), c = G(a);
			$(c, {
				get d() {
					return Q.shuffle;
				},
				size: 12,
				stroke: 1.8
			}), U(), R(a);
			var l = V(a, 2), f = G(l);
			$(f, {
				get d() {
					return Q.list;
				},
				size: 12,
				stroke: 1.8
			}), U(), R(l);
			var p = V(l, 2), h = G(p);
			$(h, {
				get d() {
					return Q.trash;
				},
				size: 12,
				stroke: 1.8
			}), U(), R(p), R(i);
			var _ = V(i, 2), v = (t) => {
				var n = na(), r = G(n);
				oe(r), d(r, (e) => Kt?.(e)), te(() => m(r, () => e(L), (e) => k(L, e))), U(2), R(n), g("submit", n, (t) => {
					t.preventDefault(), o().saveQueueAsPlaylist(e(L)) && k(ae, !1);
				}), w("keydown", r, (e) => {
					e.key === "Escape" && (e.stopPropagation(), k(ae, !1));
				}), u(t, n);
			};
			s(_, (t) => {
				e(ae) && t(v);
			}), J(() => {
				a.disabled = o().queue.length < 2, t(l, "aria-expanded", e(ae)), p.disabled = !o().queue.length;
			}), w("click", a, () => o().shuffleQueue()), w("click", l, () => {
				k(ae, !e(ae)), k(L, "");
			}), w("click", p, () => o().clearQueue()), u(n, r);
		};
		s(a, (t) => {
			(o().queue.length || e(l) && e(l).type !== "radio") && t(f);
		});
		var p = V(a, 2);
		n(p, 18, () => o().queue, (e) => e, (n, r, i) => {
			let a = X(() => o().items[r]);
			var l = sa(), d = F(l), f = (t) => {
				var n = aa(), r = G(n), a = D(r), c = V(r), l = (e) => {
					var t = ia();
					u(e, t);
				};
				s(c, (t) => {
					e(i) > 0 && t(l);
				}), R(n), J(() => S(a, `Up next from ${(o().upFrom || "your list") ?? ""}`)), u(t, n);
			}, p = X(() => e(a) && o().isAuto(r) && (e(i) === 0 || !o().isAuto(o().queue[e(i) - 1])));
			s(d, (t) => {
				e(p) && t(f);
			});
			var m = V(d, 2), h = (n) => {
				var s = oa();
				let l;
				var d = G(s), f = G(d);
				$(f, {
					get d() {
						return Q.grip;
					},
					size: 14,
					stroke: 2.4
				}), R(d);
				var p = V(d, 2);
				q(p, {
					get hue() {
						return e(a).hue;
					},
					get art() {
						return e(a).art;
					},
					get mark() {
						return e(a).mark;
					},
					size: 34,
					radius: 7,
					font: 9
				});
				var m = V(p, 2), h = G(m), _ = D(h, !0), v = V(h), y = D(v);
				R(m);
				var b = V(m, 2), x = G(b), C = G(x);
				$(C, {
					get d() {
						return Q.up;
					},
					size: 11,
					stroke: 2.2
				}), R(x);
				var T = V(x, 2), E = G(T);
				$(E, {
					get d() {
						return Q.down;
					},
					size: 11,
					stroke: 2.2
				}), R(T), R(b);
				var O = V(b, 2), ee = G(O);
				$(ee, {
					get d() {
						return Q.close;
					},
					size: 12,
					stroke: 2
				}), R(O), R(s), J((n) => {
					l = c(s, 1, "q drag svelte-1b7bd5u", null, l, {
						dragging: e(P) === r,
						over: e(B) === e(i) && e(P) !== r
					}), S(_, e(a).title), S(y, `${se[e(a).type] ?? ""}${n ?? ""}`), t(x, "aria-label", `Move ${e(a).title ?? ""} up`), x.disabled = e(i) === 0, t(T, "aria-label", `Move ${e(a).title ?? ""} down`), T.disabled = e(i) === o().queue.length - 1, t(O, "aria-label", `Remove ${e(a).title ?? ""} from queue`);
				}, [() => o().lenOf(r) ? ` · ${o().lenOf(r)}` : ""]), g("dragstart", s, (e) => {
					k(P, r, !0), e.dataTransfer?.setData("text/plain", r);
				}), g("dragover", s, (t) => {
					t.preventDefault(), k(B, e(i), !0);
				}), g("dragleave", s, () => {
					e(B) === e(i) && k(B, -1);
				}), g("drop", s, (t) => {
					t.preventDefault(), ue(e(i));
				}), g("dragend", s, () => {
					k(P, null), k(B, -1);
				}), w("click", m, () => o().play(r)), w("click", x, () => o().moveQueue(r, e(i) - 1)), w("click", T, () => o().moveQueue(r, e(i) + 1)), w("click", O, () => o().removeFromQueue(r)), u(n, s);
			};
			s(m, (t) => {
				e(a) && t(h);
			}), u(n, l);
		}, (e) => {
			var t = ca();
			u(e, t);
		}), u(r, i);
	}, Re = (t) => {
		var r = le(), i = F(r), a = (t) => {
			var r = le(), i = F(r);
			n(i, 17, () => e(l).chapters, x, (t, n, r) => {
				let i = X(() => K(r)), a = X(() => r === o().chapIdx);
				var s = la();
				let d;
				var f = G(s), p = D(f, !0), m = V(f, 2), h = D(m, !0), g = V(m, 2), _ = D(g, !0);
				R(s), J((t, i) => {
					d = c(s, 1, "chap svelte-1b7bd5u", null, d, {
						cur: e(a),
						done: r < o().chapIdx
					}), S(p, t), S(h, e(n).title), S(_, i);
				}, [() => e(l).type === "book" ? M(r) : W(e(n).start), () => r < o().chapIdx ? "Done" : e(a) && e(i) ? `${Math.min(100, Math.round((o().pos - e(n).start) / e(i) * 100))}%` : e(i) ? E(e(i)) : ""]), w("click", s, () => o().seekTo(e(n).start)), u(t, s);
			}), u(t, r);
		}, d = X(() => H(e(l)) && e(l).chapters.length), f = (t) => {
			var n = ua(), r = D(n, !0);
			J(() => S(r, e(l).type === "book" ? "Loading chapters…" : "This episode has no chapters.")), u(t, n);
		};
		s(i, (t) => {
			e(d) ? t(a) : t(f, -1);
		}), u(t, r);
	}, ze = (r) => {
		var i = pa(), a = F(i), s = G(a);
		$(s, {
			get d() {
				return Q.plus;
			},
			size: 12,
			stroke: 2
		}), U(), R(a);
		var c = V(a, 2);
		n(c, 17, () => e(v), (e) => e.at, (n, r) => {
			var i = da(), a = G(i), s = G(a), c = D(s, !0), l = V(s), d = D(l, !0);
			R(a);
			var f = V(a, 2), p = G(f);
			$(p, {
				get d() {
					return Q.close;
				},
				size: 12,
				stroke: 2
			}), R(f), R(i), J((n) => {
				S(c, e(r).label), S(d, n), t(f, "aria-label", `Remove bookmark ${e(r).label ?? ""}`);
			}, [() => new Date(e(r).at).toLocaleString()]), w("click", a, () => o().jumpTo(e(h).id, e(r).pos)), w("click", f, () => o().removeBookmark(e(h).id, e(r).at)), u(n, i);
		}, (e) => {
			var t = fa();
			u(e, t);
		}), w("click", a, () => o().bookmark(e(h).id)), u(r, i);
	}, Be = (t) => {
		var r = ba(), i = F(r), a = (t) => {
			var n = ga(), r = V(G(n)), i = D(r, !0), a = V(r, 2), o = (t) => {
				var n = ma(), r = V(F(n)), i = D(r, !0);
				J((e) => S(i, e), [() => E(e(l).dur)]), u(t, n);
			};
			s(a, (t) => {
				e(l).dur && t(o);
			});
			var c = V(a, 2), d = (t) => {
				var n = ha(), r = V(F(n)), i = D(r, !0);
				J(() => S(i, e(l).chapters.length)), u(t, n);
			};
			s(c, (t) => {
				e(l).chapters.length && t(d);
			}), U(3), R(n), J(() => S(i, e(l).sub)), u(t, n);
		}, c = (t) => {
			var n = va(), r = V(G(n)), i = G(r), a = D(i, !0);
			R(r);
			var c = V(r, 2), d = (t) => {
				var n = _a(), r = V(F(n)), i = D(r, !0);
				J((e) => S(i, e), [() => new Date(e(l).date).toLocaleDateString()]), u(t, n);
			};
			s(c, (t) => {
				e(l).date && t(d);
			});
			var f = V(c, 2), p = (t) => {
				var n = ma(), r = V(F(n)), i = D(r, !0);
				J((e) => S(i, e), [() => E(e(b))]), u(t, n);
			};
			s(f, (t) => {
				e(b) && t(p);
			}), R(n), J(() => S(a, e(l).sub)), w("click", i, () => o().openShow(e(l).show)), u(t, n);
		};
		s(i, (t) => {
			e(l).type === "book" ? t(a) : e(l).type === "podcast" && t(c, 1);
		});
		var d = V(i, 2), f = (t) => {
			var n = ya(), r = D(n, !0);
			J(() => S(r, e(l).desc)), u(t, n);
		}, p = X(() => H(e(l)) && e(l).desc);
		s(d, (t) => {
			e(p) && t(f);
		});
		var m = V(d, 2), h = (t) => {
			var r = Ji(), i = V(F(r), 2);
			n(i, 16, () => e(C), (e) => e, (t, n) => {
				let r = X(() => o().items[n]);
				var i = le(), a = F(i), c = (t) => {
					var i = qi(), a = G(i);
					q(a, {
						get hue() {
							return e(r).hue;
						},
						get art() {
							return e(r).art;
						},
						get mark() {
							return e(r).mark;
						},
						size: 34,
						radius: 7,
						font: 9
					});
					var s = V(a, 2), c = G(s), l = D(c, !0), d = V(c), f = D(d);
					R(s), R(i), J((t) => {
						S(l, e(r).title), S(f, `${se[e(r).type] ?? ""} · ${t ?? ""}`);
					}, [() => o().leftOf(n)]), w("click", i, () => o().play(n)), u(t, i);
				};
				s(a, (t) => {
					e(r) && t(c);
				}), u(t, i);
			}), u(t, r);
		};
		s(m, (t) => {
			e(C).length && t(h);
		}), u(t, r);
	}, Ve = (t) => {
		var r = Sa();
		n(r, 21, () => e(N), x, (t, n, r) => {
			var i = xa();
			let a;
			var s = G(i), l = D(s), d = V(s, 1, !0);
			R(i), J((t) => {
				a = c(i, 1, "line svelte-1b7bd5u", null, a, { cur: r === o().lineIdx }), S(l, `${e(n).who ? `${e(n).who} · ` : ""}${t ?? ""}`), S(d, e(n).text);
			}, [() => W(e(n).t)]), w("click", i, () => o().seekTo(e(n).t)), u(t, i);
		}, (t) => {
			var n = ua(), r = D(n, !0);
			J(() => S(r, e(Y))), u(t, n);
		}), R(r), y(r, (e) => k(ie, e), () => e(ie)), u(t, r);
	};
	s(Pe, (t) => {
		e(l) ? e(f) === "onair" && e(l).type === "radio" ? t(Ie, 1) : e(f) === "queue" ? t(Le, 2) : e(f) === "chaps" ? t(Re, 3) : e(f) === "marks" && e(h) ? t(ze, 4) : e(f) === "about" ? t(Be, 5) : e(f) === "trans" && t(Ve, 6) : t(Fe);
	}), R(Ne), R(de), J(() => {
		me = c(pe, 1, "art svelte-1b7bd5u", null, me, { book: e(l)?.type === "book" }), S(Ce, e(ne)), S(Te, e(re));
	}), u(r, de), A();
}
C(["click", "keydown"]);
//#endregion
//#region src/components/SeekBar.svelte
var Ea = l("<div class=\"tick svelte-qmop01\"></div>"), Da = l("<div role=\"slider\" aria-label=\"Playback position\"><div class=\"track svelte-qmop01\"><div class=\"fill svelte-qmop01\"></div> <!></div></div>"), Oa = {
	hash: "svelte-qmop01",
	code: ".seek.svelte-qmop01 {flex:1;display:flex;align-items:center;cursor:pointer;border-radius:4px;}.seek.live.svelte-qmop01 {cursor:default;}.seek.svelte-qmop01:focus-visible {outline:2px solid var(--tm-accent);outline-offset:2px;}.track.svelte-qmop01 {flex:1;height:4px;border-radius:2px;background:var(--tm-fg-12);position:relative;}.fill.svelte-qmop01 {position:absolute;left:0;top:0;bottom:0;border-radius:2px;background:var(--tm-accent);}.live.svelte-qmop01 .fill:where(.svelte-qmop01) {opacity:.55;}.tick.svelte-qmop01 {position:absolute;top:-1px;width:2px;height:6px;background:var(--tm-panel-surface);}"
};
function ka(r, i) {
	j(i, !0), _(r, Oa);
	let o = Z(i, "height", 3, 14), s = Z(i, "ticks", 3, !1), l = X(() => i.store.item), d = X(() => e(l) ? i.store.durOf(e(l).id) : 0), f = X(() => !!e(l) && H(e(l)) && e(d) > 0), p = X(() => e(l) ? H(e(l)) ? e(d) ? Math.min(100, i.store.pos / e(d) * 100) : 0 : 100 : 0), m = X(() => s() && e(l) && H(e(l)) && e(d) ? e(l).chapters.slice(1).map((t) => t.start / e(d) * 100) : []);
	function h(t) {
		if (!e(f)) return;
		let n = t.currentTarget.getBoundingClientRect();
		i.store.seekFraction((t.clientX - n.left) / n.width);
	}
	function g(t) {
		if (!e(f)) return;
		let n = {
			ArrowLeft: -15,
			ArrowRight: 30,
			PageDown: -60,
			PageUp: 60
		}[t.key];
		n ? (t.preventDefault(), i.store.skip(n)) : t.key === "Home" ? (t.preventDefault(), i.store.seekFraction(0)) : t.key === "End" && (t.preventDefault(), i.store.seekFraction(1));
	}
	var v = Da();
	let y;
	t(v, "aria-valuemin", 0), t(v, "aria-valuemax", 100);
	let b;
	var S = G(v), C = G(S);
	let T;
	var E = V(C, 2);
	n(E, 17, () => e(m), x, (t, n) => {
		var r = Ea();
		let i;
		J(() => i = a(r, "", i, { left: `${e(n) ?? ""}%` })), u(t, r);
	}), R(S), R(v), J((n, r) => {
		y = c(v, 1, "seek svelte-qmop01", null, y, { live: !e(f) }), t(v, "tabindex", e(f) ? 0 : -1), t(v, "aria-disabled", !e(f)), t(v, "aria-valuenow", n), t(v, "aria-valuetext", r), b = a(v, "", b, { height: `${o() ?? ""}px` }), T = a(C, "", T, { width: `${e(p) ?? ""}%` });
	}, [() => Math.round(e(p)), () => e(f) ? `${W(i.store.pos)} of ${W(e(d))}` : "Live"]), w("click", v, h), w("keydown", v, g), u(r, v), A();
}
C(["click", "keydown"]);
//#endregion
//#region src/components/SleepPopover.svelte
var Aa = l("<button> </button>"), ja = l("<div class=\"tm-pop\" role=\"dialog\" aria-label=\"Sleep timer\"><div class=\"title svelte-1mpzphw\">Sleep timer</div> <div class=\"hint svelte-1mpzphw\">Audio fades out over the last minute.</div> <div class=\"grid svelte-1mpzphw\"></div> <button> </button> <button class=\"off svelte-1mpzphw\">Turn off</button></div>"), Ma = {
	hash: "svelte-1mpzphw",
	code: ".title.svelte-1mpzphw {font-size:13px;font-weight:650;}.hint.svelte-1mpzphw {font-size:11px;color:var(--tm-muted);margin-top:2px;}.grid.svelte-1mpzphw {display:grid;grid-template-columns:repeat(3, 1fr);gap:6px;margin-top:12px;}.opt.svelte-1mpzphw {height:34px;border-radius:9px;border:0;background:var(--tm-fg-6);color:var(--tm-fg);font-size:12px;font-weight:600;cursor:pointer;}.opt.svelte-1mpzphw:hover {background:var(--tm-fg-10);}.opt.sel.svelte-1mpzphw {background:var(--tm-accent);color:var(--tm-on-accent);}.wide.svelte-1mpzphw {width:100%;margin-top:6px;}.off.svelte-1mpzphw {width:100%;height:30px;margin-top:6px;border:0;background:none;color:var(--tm-muted);font-size:12px;cursor:pointer;}.off.svelte-1mpzphw:hover {color:var(--tm-fg);}"
};
function Na(t, r) {
	j(r, !0), _(t, Ma);
	let i = (e) => typeof r.store.sleep == "number" && Math.ceil(r.store.sleep / 60) === e;
	var o = ja(), s = V(G(o), 4);
	n(s, 21, () => Mt, x, (t, n) => {
		var a = Aa();
		let o;
		var s = D(a);
		J((t) => {
			o = c(a, 1, "opt svelte-1mpzphw", null, o, { sel: t }), S(s, `${e(n) ?? ""} min`);
		}, [() => i(e(n))]), w("click", a, () => r.store.setSleepMinutes(e(n))), u(t, a);
	}), R(s);
	var l = V(s, 2);
	let d;
	var f = D(l, !0), p = V(l, 2);
	R(o), J(() => {
		a(o, r.pos), d = c(l, 1, "opt wide svelte-1mpzphw", null, d, { sel: r.store.sleep === "chapter" }), S(f, r.store.live ? "End of current show" : r.store.chapters.length > 1 ? "End of chapter" : "End of episode");
	}), w("click", l, () => r.store.sleepAtEnd()), w("click", p, () => r.store.sleepOff()), u(t, o), A();
}
C(["click"]);
//#endregion
//#region src/components/SpeedPopover.svelte
var Pa = l("<button> </button>"), Fa = l("<div class=\"tm-pop\" role=\"dialog\" aria-label=\"Playback speed\"><div class=\"head svelte-1xvntbg\"><span class=\"title svelte-1xvntbg\">Playback speed</span><span class=\"now svelte-1xvntbg\"> </span></div> <div class=\"hint svelte-1xvntbg\"> </div> <div class=\"grid svelte-1xvntbg\"></div></div>"), Ia = {
	hash: "svelte-1xvntbg",
	code: ".head.svelte-1xvntbg {display:flex;align-items:baseline;justify-content:space-between;}.title.svelte-1xvntbg {font-size:13px;font-weight:650;}.now.svelte-1xvntbg {font:600 12px ui-monospace, Menlo, monospace;color:var(--tm-accent);}.hint.svelte-1xvntbg {font-size:11px;color:var(--tm-muted);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.grid.svelte-1xvntbg {display:grid;grid-template-columns:repeat(4, 1fr);gap:6px;margin-top:12px;}.opt.svelte-1xvntbg {height:32px;border-radius:9px;border:0;background:var(--tm-fg-6);color:var(--tm-fg);font:600 11.5px ui-monospace, Menlo, monospace;cursor:pointer;}.opt.svelte-1xvntbg:hover {background:var(--tm-fg-10);}.opt.sel.svelte-1xvntbg {background:var(--tm-accent);color:var(--tm-on-accent);}"
};
function La(t, r) {
	j(r, !0), _(t, Ia);
	var i = Fa(), o = G(i), s = V(G(o)), l = D(s);
	R(o);
	var d = V(o, 2), f = D(d), p = V(d, 2);
	n(p, 21, () => jt, x, (t, n) => {
		var i = Pa();
		let a;
		var o = D(i);
		J((t) => {
			a = c(i, 1, "opt svelte-1xvntbg", null, a, { sel: r.store.speed === e(n) }), S(o, `${t ?? ""}×`);
		}, [() => e(n).toFixed(1)]), w("click", i, () => r.store.setSpeed(e(n))), u(t, i);
	}), R(p), R(i), J((e) => {
		a(i, r.pos), S(l, `${e ?? ""}×`), S(f, `Remembered for ${r.store.speedScope ?? ""}.`);
	}, [() => r.store.speed.toFixed(1)]), u(t, i), A();
}
C(["click"]);
//#endregion
//#region src/components/PlayerBar.svelte
var Ra = l("<div class=\"thumb svelte-y66ne\"></div>"), za = l("<span class=\"live svelte-y66ne\">LIVE</span>"), Ba = l("<span class=\"time r svelte-y66ne\"> </span>"), Va = l("<span class=\"one svelte-y66ne\">1</span>"), Ha = l("<footer class=\"bar svelte-y66ne\"><div class=\"now svelte-y66ne\"><!> <div class=\"ntext svelte-y66ne\"><div class=\"ntitle svelte-y66ne\"> </div><div class=\"nsub svelte-y66ne\"> </div></div> <!></div> <div class=\"center svelte-y66ne\"><div class=\"controls svelte-y66ne\"><button class=\"skipc svelte-y66ne\" aria-label=\"Previous chapter\"><!></button> <button class=\"jump svelte-y66ne\"> </button> <button><!></button> <button class=\"jump svelte-y66ne\"> </button> <button class=\"skipc svelte-y66ne\" aria-label=\"Next in queue\"><!></button></div> <div class=\"timeline svelte-y66ne\"><span class=\"time l svelte-y66ne\"> </span> <!> <!></div></div> <div class=\"tools svelte-y66ne\"><button><!><!></button> <button data-pop=\"\" aria-haspopup=\"dialog\"> </button> <button data-pop=\"\" title=\"Sleep timer\" aria-haspopup=\"dialog\"><!> </button> <button class=\"clip svelte-y66ne\" title=\"Clip to Notes\"><!></button> <div class=\"vol svelte-y66ne\"><button class=\"mute svelte-y66ne\"><!></button> <div class=\"vtrack svelte-y66ne\" role=\"slider\" tabindex=\"0\" aria-label=\"Volume\"><div class=\"vfill svelte-y66ne\"></div></div></div></div> <!> <!></footer>"), Ua = {
	hash: "svelte-y66ne",
	code: ".bar.svelte-y66ne {height:84px;flex:none;display:flex;align-items:center;gap:18px;padding:0 18px;background:var(--tm-panel-surface);border-top:1px solid var(--tm-fg-7);position:relative;}.now.svelte-y66ne {width:240px;display:flex;align-items:center;gap:11px;min-width:0;flex:none;}.thumb.svelte-y66ne {width:46px;height:46px;border-radius:9px;flex:none;background:var(--tm-fg-6);}.ntext.svelte-y66ne {min-width:0;flex:1;}.ntitle.svelte-y66ne {font-size:12.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.nsub.svelte-y66ne {font-size:11px;color:var(--tm-muted);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.center.svelte-y66ne {flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;gap:6px;}.controls.svelte-y66ne {display:flex;align-items:center;justify-content:center;gap:14px;}button.svelte-y66ne:disabled {opacity:.35;cursor:default;}.skipc.svelte-y66ne {width:30px;height:30px;border:0;background:none;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;}.skipc.svelte-y66ne:hover:not(:disabled) {color:var(--tm-fg);}.jump.svelte-y66ne {width:32px;height:32px;border:0;background:none;color:var(--tm-fg);cursor:pointer;font:600 10.5px ui-monospace, Menlo, monospace;border-radius:16px;}.jump.svelte-y66ne:hover:not(:disabled) {background:var(--tm-fg-8);}.pp.svelte-y66ne {width:50px;height:50px;flex:none;padding:0;border:0;border-radius:50%;background:var(--tm-fg);color:var(--tm-bg);cursor:pointer;display:grid;place-items:center;position:relative;transition:transform .1s;}\n  /* The play triangle's visual centre sits left of its box. */.pp.paused.svelte-y66ne svg {transform:translateX(1.5px);}.pp.svelte-y66ne:hover:not(:disabled) {filter:brightness(1.12);transform:scale(1.04);}.pp.svelte-y66ne:active:not(:disabled) {transform:scale(.96);}.pp.busy.svelte-y66ne::after {content:'';position:absolute;inset:-4px;border-radius:50%;border:2px solid transparent;border-top-color:var(--tm-accent); animation: svelte-y66ne-spin .9s linear infinite;}\n  @keyframes svelte-y66ne-spin { to { transform: rotate(360deg); } }\n  @media (prefers-reduced-motion: reduce) {.pp.svelte-y66ne {transition:none;}.pp.busy.svelte-y66ne::after { animation: none;border-color:var(--tm-accent);} }.timeline.svelte-y66ne {display:flex;align-items:center;gap:10px;width:100%;max-width:440px;}.time.svelte-y66ne {font:500 10.5px ui-monospace, Menlo, monospace;color:var(--tm-muted);width:52px;flex:none;}.time.l.svelte-y66ne {text-align:right;}.live.svelte-y66ne {width:52px;height:20px;flex:none;display:grid;place-items:center;border-radius:10px;background:var(--tm-live);color:#fff;font-size:9.5px;font-weight:700;letter-spacing:.8px;}.tools.svelte-y66ne {width:240px;flex:none;display:flex;align-items:center;justify-content:flex-end;gap:6px;}.repeat.svelte-y66ne {position:relative;height:30px;width:32px;border:0;border-radius:8px;background:transparent;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;}.repeat.svelte-y66ne:hover:not(:disabled) {background:var(--tm-fg-10);color:var(--tm-fg);}.repeat.on.svelte-y66ne {color:var(--tm-accent);}.one.svelte-y66ne {position:absolute;right:3px;bottom:3px;min-width:11px;height:11px;border-radius:6px;background:var(--tm-accent);color:var(--tm-on-accent);font:700 8px/11px system-ui, sans-serif;text-align:center;}.speed.svelte-y66ne {height:30px;min-width:44px;padding:0 8px;border:0;border-radius:8px;background:transparent;color:var(--tm-fg);font:600 11.5px ui-monospace, Menlo, monospace;cursor:pointer;}.speed.on.svelte-y66ne {background:var(--tm-accent-14);}.sleep.svelte-y66ne {height:30px;padding:0 8px;border:0;border-radius:8px;background:transparent;color:var(--tm-fg);cursor:pointer;display:flex;align-items:center;gap:5px;font:600 11px ui-monospace, Menlo, monospace;}.sleep.on.svelte-y66ne {background:var(--tm-accent-14);color:var(--tm-accent);}.speed.svelte-y66ne:hover:not(:disabled), .sleep.svelte-y66ne:hover:not(:disabled), .clip.svelte-y66ne:hover:not(:disabled) {background:var(--tm-fg-10);}.clip.svelte-y66ne {height:30px;width:32px;border:0;border-radius:8px;background:transparent;color:var(--tm-fg);cursor:pointer;display:grid;place-items:center;}.vol.svelte-y66ne {display:flex;align-items:center;gap:6px;margin-left:4px;color:var(--tm-muted);}.mute.svelte-y66ne {border:0;background:none;padding:0;color:inherit;cursor:pointer;display:grid;place-items:center;}.mute.svelte-y66ne:hover {color:var(--tm-fg);}.vtrack.svelte-y66ne {width:64px;height:12px;display:flex;align-items:center;cursor:pointer;position:relative;background:linear-gradient(var(--tm-fg-12), var(--tm-fg-12)) center / 100% 4px no-repeat;border-radius:2px;}.vfill.svelte-y66ne {height:4px;border-radius:2px;background:var(--tm-fg);}.vtrack.svelte-y66ne:focus-visible {outline:2px solid var(--tm-accent);outline-offset:2px;}"
};
function Wa(n, r) {
	j(r, !0), _(n, Ua);
	let i = X(() => r.store.item), o = X(() => !!e(i) && H(e(i))), l = X(() => e(i) ? r.store.durOf(e(i).id) : 0), d = X(() => typeof r.store.sleep == "number" ? W(r.store.sleep) : r.store.sleep === "chapter" ? "End" : ""), f = X(() => r.store.buffering || r.store.loadingItem), p = X(() => e(i)?.type === "radio" ? r.store.nowPlaying[e(i).stationId] : void 0), m = X(() => r.store.playing ? r.store.live ? "Stop" : "Pause" : "Play"), h = X(() => r.store.playing ? r.store.live ? Q.stop : Q.pause : Q.play);
	function g(e) {
		let t = e.currentTarget.getBoundingClientRect();
		r.store.setVolume((e.clientX - t.left) / t.width);
	}
	function v(e) {
		let t = {
			ArrowLeft: -.1,
			ArrowDown: -.1,
			ArrowRight: .1,
			ArrowUp: .1
		}[e.key];
		t && (e.preventDefault(), r.store.setVolume(r.store.volume + t));
	}
	var y = Ha(), b = G(y), x = G(b), C = (t) => {
		{
			let n = X(() => e(p)?.art || e(i).art);
			q(t, {
				get hue() {
					return e(i).hue;
				},
				get art() {
					return e(n);
				},
				get mark() {
					return e(i).mark;
				},
				size: 46,
				radius: 9
			});
		}
	}, T = (e) => {
		var t = Ra();
		u(e, t);
	};
	s(x, (t) => {
		e(i) ? t(C) : t(T, -1);
	});
	var E = V(x, 2), O = G(E), k = D(O, !0), ee = V(O), te = D(ee, !0);
	R(E);
	var ne = V(E, 2), M = (t) => {
		Tn(t, {
			get store() {
				return r.store;
			},
			get id() {
				return e(i).id;
			}
		});
	};
	s(ne, (t) => {
		e(i) && t(M);
	}), R(b);
	var re = V(b, 2), N = G(re), ie = G(N), P = G(ie);
	$(P, { get d() {
		return Q.prev;
	} }), R(ie);
	var F = V(ie, 2), ae = D(F), oe = V(F, 2);
	let se;
	var I = G(oe);
	$(I, {
		get d() {
			return e(h);
		},
		size: 22
	}), R(oe);
	var L = V(oe, 2), ce = D(L), z = V(L, 2), B = G(z);
	$(B, { get d() {
		return Q.next;
	} }), R(z), R(N);
	var U = V(N, 2), le = G(U), ue = D(le, !0), K = V(le, 2);
	ka(K, {
		get store() {
			return r.store;
		},
		ticks: !0
	});
	var Y = V(K, 2), de = (e) => {
		var t = za();
		u(e, t);
	}, Z = (t) => {
		var n = Ba(), i = D(n, !0);
		J((e) => S(i, e), [() => e(l) ? `−${W(Ae(e(l), r.store.pos, r.store.speed))}` : ""]), u(t, n);
	};
	s(Y, (t) => {
		e(i) && !e(o) ? t(de) : t(Z, -1);
	}), R(U), R(re);
	var fe = V(re, 2), pe = G(fe);
	let me;
	var he = G(pe);
	$(he, {
		get d() {
			return Q.repeat;
		},
		size: 15,
		stroke: 1.8
	});
	var ge = V(he), _e = (e) => {
		var t = Va();
		u(e, t);
	};
	s(ge, (e) => {
		r.store.prefs.repeat === "one" && e(_e);
	}), R(pe);
	var ve = V(pe, 2);
	let ye;
	var be = D(ve), xe = V(ve, 2);
	let Se;
	var Ce = G(xe);
	$(Ce, {
		get d() {
			return Q.moon;
		},
		size: 15,
		stroke: 1.8
	});
	var we = V(Ce, 1, !0);
	R(xe);
	var Te = V(xe, 2), Ee = G(Te);
	$(Ee, {
		get d() {
			return Q.clip;
		},
		size: 15,
		stroke: 1.8
	}), R(Te);
	var De = V(Te, 2), Oe = G(De), ke = G(Oe);
	{
		let t = X(() => r.store.muted ? Q.muted : Q.volume);
		$(ke, {
			get d() {
				return e(t);
			},
			size: 15,
			stroke: 1.8
		});
	}
	R(Oe);
	var je = V(Oe, 2);
	t(je, "aria-valuemin", 0), t(je, "aria-valuemax", 100);
	var Me = G(je);
	let Ne;
	R(je), R(De), R(fe);
	var Pe = V(fe, 2), Fe = (e) => {
		Na(e, {
			get store() {
				return r.store;
			},
			pos: "right:60px;bottom:74px"
		});
	};
	s(Pe, (e) => {
		r.store.pop === "sleep" && e(Fe);
	});
	var Ie = V(Pe, 2), Le = (e) => {
		La(e, {
			get store() {
				return r.store;
			},
			pos: "right:110px;bottom:74px"
		});
	};
	s(Ie, (e) => {
		r.store.pop === "speed" && e(Le);
	}), R(y), J((n, s, l, u, h) => {
		S(k, e(p)?.title || e(i)?.title || "Nothing playing"), S(te, n), ie.disabled = !e(o), t(F, "aria-label", `Back ${r.store.prefs.back ?? ""} seconds`), F.disabled = !e(o), S(ae, `−${r.store.prefs.back ?? ""}`), se = c(oe, 1, "pp svelte-y66ne", null, se, {
			busy: e(f),
			paused: !r.store.playing
		}), t(oe, "aria-label", e(m)), t(oe, "title", e(m)), oe.disabled = !e(i), t(L, "aria-label", `Forward ${r.store.prefs.fwd ?? ""} seconds`), L.disabled = !e(o), S(ce, `+${r.store.prefs.fwd ?? ""}`), z.disabled = !r.store.queue.length, S(ue, s), me = c(pe, 1, "repeat svelte-y66ne", null, me, { on: r.store.prefs.repeat !== "off" }), pe.disabled = !e(i) || r.store.live, t(pe, "aria-pressed", r.store.prefs.repeat !== "off"), t(pe, "aria-label", r.store.prefs.repeat === "off" ? "Repeat is off" : r.store.prefs.repeat === "all" ? "Repeat all" : "Repeat one"), t(pe, "title", r.store.prefs.repeat === "off" ? "Repeat: off" : r.store.prefs.repeat === "all" ? "Repeat: all" : "Repeat: one"), ye = c(ve, 1, "speed svelte-y66ne", null, ye, { on: r.store.speed !== 1 && e(o) }), ve.disabled = !e(i), t(ve, "aria-expanded", r.store.pop === "speed"), t(ve, "aria-label", `Playback speed ${l ?? ""}×`), S(be, `${u ?? ""}×`), Se = c(xe, 1, "sleep svelte-y66ne", null, Se, { on: !!r.store.sleep }), xe.disabled = !e(i), t(xe, "aria-expanded", r.store.pop === "sleep"), t(xe, "aria-label", `Sleep timer${e(d) ? `: ${e(d)}` : ""}`), S(we, e(d)), t(Te, "aria-label", e(o) ? "Clip the last 30 seconds to Notes" : "Save what is playing to Notes"), Te.disabled = !e(i), t(Oe, "aria-label", r.store.muted ? "Unmute" : "Mute"), t(je, "aria-valuenow", h), Ne = a(Me, "", Ne, { width: `${(r.store.muted ? 0 : r.store.volume) * 100}%` });
	}, [
		() => e(i) ? e(p)?.title ? [e(p).artist, e(i).title].filter(Boolean).join(" · ") : r.store.subtitle : "Choose something to listen to",
		() => e(i) ? e(o) ? W(r.store.pos) : "On air" : "",
		() => r.store.speed.toFixed(1),
		() => e(o) ? r.store.speed.toFixed(1) : "1.0",
		() => Math.round((r.store.muted ? 0 : r.store.volume) * 100)
	]), w("click", ie, () => r.store.previous()), w("click", F, () => r.store.skip(-r.store.prefs.back)), w("click", oe, () => r.store.toggle()), w("click", L, () => r.store.skip(r.store.prefs.fwd)), w("click", z, () => r.store.next()), w("click", pe, () => r.store.cycleRepeat()), w("click", ve, () => r.store.togglePop("speed")), w("click", xe, () => r.store.togglePop("sleep")), w("click", Te, () => r.store.clip()), w("click", Oe, () => r.store.toggleMute()), w("click", je, g), w("keydown", je, v), u(n, y), A();
}
C(["click", "keydown"]);
//#endregion
//#region src/components/MiniPlayer.svelte
var Ga = l("<div class=\"blank svelte-1jla3sy\"></div>"), Ka = l("<span class=\"kind svelte-1jla3sy\"> </span>"), qa = l("<div class=\"chapter svelte-1jla3sy\"><span class=\"svelte-1jla3sy\">Chapter</span><br/> </div>"), Ja = l("<span class=\"liveword svelte-1jla3sy\">LIVE</span>"), Ya = l("<span> </span>"), Xa = l("<span class=\"one svelte-1jla3sy\">1</span>"), Za = l("<div class=\"sleepnote svelte-1jla3sy\"> </div>"), Qa = l("<button class=\"svelte-1jla3sy\">Clip to Notes</button>"), $a = l("<button class=\"q svelte-1jla3sy\"><!> <span class=\"qtext svelte-1jla3sy\"><span class=\"qtitle svelte-1jla3sy\"> </span><span class=\"qmeta svelte-1jla3sy\"> </span></span></button>"), eo = l("<div class=\"empty svelte-1jla3sy\">Widen the panel to browse radio, podcasts and audiobooks.</div>"), to = l("<div class=\"mini svelte-1jla3sy\"><div class=\"head svelte-1jla3sy\"><span class=\"np svelte-1jla3sy\">Now playing</span><span class=\"spacer svelte-1jla3sy\"></span><span class=\"by svelte-1jla3sy\">OndaCast</span></div> <div class=\"player svelte-1jla3sy\"><div class=\"art svelte-1jla3sy\"><!> <!> <!></div> <div class=\"trow svelte-1jla3sy\"><div class=\"title svelte-1jla3sy\"> </div><!></div> <div class=\"sub svelte-1jla3sy\"> </div> <div class=\"seek svelte-1jla3sy\"><!></div> <div class=\"times svelte-1jla3sy\"><span> </span> <!></div> <div class=\"controls svelte-1jla3sy\"><button class=\"chipbtn svelte-1jla3sy\" data-pop=\"\" aria-haspopup=\"dialog\"> </button> <button class=\"jump svelte-1jla3sy\"> </button> <button><!></button> <button class=\"jump svelte-1jla3sy\"> </button> <button><!><!></button> <button data-pop=\"\" aria-haspopup=\"dialog\" aria-label=\"Sleep timer\"><!></button></div> <!> <!> <!></div> <div class=\"upnext svelte-1jla3sy\"><div class=\"uphead svelte-1jla3sy\"><span class=\"svelte-1jla3sy\"> </span><!></div> <!></div></div>"), no = {
	hash: "svelte-1jla3sy",
	code: ".mini.svelte-1jla3sy {height:100%;container-type:size;display:flex;flex-direction:column;background:var(--tm-surface);}.head.svelte-1jla3sy {height:36px;flex:none;display:flex;align-items:center;gap:8px;padding:0 14px;background:var(--tm-panel-surface);}.by.svelte-1jla3sy {font-size:11px;color:var(--tm-muted);}.spacer.svelte-1jla3sy {flex:1;}.np.svelte-1jla3sy {font-size:12px;font-weight:600;}.player.svelte-1jla3sy {padding:22px 22px 0;position:relative;flex:none;}.art.svelte-1jla3sy {width:min(100%, 48cqh);aspect-ratio:1;margin:0 auto;border-radius:18px;overflow:hidden;display:flex;position:relative;box-shadow:0 24px 50px rgba(0, 0, 0, .45);}.blank.svelte-1jla3sy {flex:1;background:var(--tm-fg-6);}.kind.svelte-1jla3sy {position:absolute;left:14px;top:14px;font-size:9.5px;font-weight:700;letter-spacing:.8px;padding:3px 8px;border-radius:20px;background:rgba(0, 0, 0, .45);color:#fff;}.chapter.svelte-1jla3sy {position:absolute;left:14px;bottom:14px;max-width:70%;padding:8px 10px;border-radius:10px;background:rgba(0, 0, 0, .5);color:#fff;font-size:11.5px;line-height:1.3;}.chapter.svelte-1jla3sy span:where(.svelte-1jla3sy) {opacity:.7;}.trow.svelte-1jla3sy {display:flex;align-items:flex-start;gap:6px;margin-top:18px;}.trow.svelte-1jla3sy .title:where(.svelte-1jla3sy) {margin-top:0;flex:1;min-width:0;}.title.svelte-1jla3sy {font-size:17px;font-weight:650;margin-top:18px;line-height:1.3;text-wrap:pretty;display:-webkit-box;-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}.sub.svelte-1jla3sy {font-size:12.5px;color:var(--tm-muted);margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.seek.svelte-1jla3sy {display:flex;margin-top:14px;}.times.svelte-1jla3sy {display:flex;justify-content:space-between;font:500 10.5px ui-monospace, Menlo, monospace;color:var(--tm-muted);margin-top:2px;}.liveword.svelte-1jla3sy {color:var(--tm-live);font-weight:700;}.controls.svelte-1jla3sy {display:flex;align-items:center;justify-content:space-between;margin-top:10px;}button.svelte-1jla3sy:disabled {opacity:.35;cursor:default;}.chipbtn.svelte-1jla3sy {width:44px;height:30px;border:0;border-radius:8px;background:var(--tm-fg-6);color:var(--tm-fg);font:600 11px ui-monospace, Menlo, monospace;cursor:pointer;display:grid;place-items:center;}.repeat.svelte-1jla3sy {position:relative;height:30px;width:32px;border:0;border-radius:8px;background:transparent;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;}.repeat.svelte-1jla3sy:hover:not(:disabled) {background:var(--tm-fg-10);color:var(--tm-fg);}.repeat.on.svelte-1jla3sy {color:var(--tm-accent);}.one.svelte-1jla3sy {position:absolute;right:3px;bottom:3px;min-width:11px;height:11px;border-radius:6px;background:var(--tm-accent);color:var(--tm-on-accent);font:700 8px/11px system-ui, sans-serif;text-align:center;}.sleep.svelte-1jla3sy {background:transparent;}.sleep.on.svelte-1jla3sy {background:var(--tm-accent-14);color:var(--tm-accent);}.jump.svelte-1jla3sy {width:40px;height:40px;border:0;border-radius:20px;background:none;color:var(--tm-fg);font:600 11px ui-monospace, Menlo, monospace;cursor:pointer;}.jump.svelte-1jla3sy:hover:not(:disabled) {background:var(--tm-fg-8);}.pp.svelte-1jla3sy {width:58px;height:58px;flex:none;padding:0;border:0;border-radius:50%;background:var(--tm-accent);color:var(--tm-on-accent);cursor:pointer;display:grid;place-items:center;position:relative;}.pp.paused.svelte-1jla3sy svg {transform:translateX(1.5px);}.pp.busy.svelte-1jla3sy::after {content:'';position:absolute;inset:-5px;border-radius:50%;border:2px solid transparent;border-top-color:var(--tm-accent); animation: svelte-1jla3sy-spin .9s linear infinite;}\n  @keyframes svelte-1jla3sy-spin { to { transform: rotate(360deg); } }\n  @media (prefers-reduced-motion: reduce) {.pp.busy.svelte-1jla3sy::after { animation: none;} }.sleepnote.svelte-1jla3sy {text-align:center;font-size:11px;color:var(--tm-accent);margin-top:6px;}.upnext.svelte-1jla3sy {flex:1;min-height:0;margin-top:16px;background:var(--tm-panel-surface);border-radius:18px 18px 0 0;padding:14px 12px;overflow:auto;}.uphead.svelte-1jla3sy {display:flex;align-items:baseline;justify-content:space-between;padding:0 8px 6px;}.uphead.svelte-1jla3sy span:where(.svelte-1jla3sy) {font-size:13px;font-weight:650;}.uphead.svelte-1jla3sy button:where(.svelte-1jla3sy) {border:0;background:none;color:var(--tm-accent);font-size:11.5px;cursor:pointer;padding:0;}.q.svelte-1jla3sy {display:flex;align-items:center;gap:10px;width:100%;padding:7px 8px;border:0;border-radius:9px;background:none;color:inherit;cursor:pointer;text-align:left;font:inherit;}.q.svelte-1jla3sy:hover {background:var(--tm-fg-5);}.qtext.svelte-1jla3sy {flex:1;min-width:0;display:flex;flex-direction:column;}.qtitle.svelte-1jla3sy {font-size:12.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.qmeta.svelte-1jla3sy {font-size:11px;color:var(--tm-muted);margin-top:2px;}.empty.svelte-1jla3sy {padding:20px 8px;font-size:12px;color:var(--tm-muted);text-align:center;}"
};
function ro(r, i) {
	j(i, !0), _(r, no);
	let a = X(() => i.store.item), o = X(() => !!e(a) && H(e(a))), l = X(() => e(a) ? i.store.durOf(e(a).id) : 0), d = X(() => e(a) && H(e(a)) && e(a).chapters.length > 1 && i.store.chapIdx >= 0 ? e(a).chapters[i.store.chapIdx].title : ""), f = X(() => typeof i.store.sleep == "number" ? W(i.store.sleep) : i.store.sleep === "chapter" ? "end of chapter" : ""), p = X(() => e(a)?.type === "radio" ? i.store.nowPlaying[e(a).stationId] : void 0), m = X(() => [...i.store.continueIds, ...i.store.onAirIds].filter((e) => e !== i.store.now).slice(0, 6));
	var h = to(), g = V(G(h), 2), v = G(g), y = G(v), b = (t) => {
		{
			let n = X(() => e(p)?.art || e(a).art);
			q(t, {
				get hue() {
					return e(a).hue;
				},
				get art() {
					return e(n);
				},
				fill: !0,
				radius: 0,
				get mark() {
					return e(a).mark;
				},
				font: 40
			});
		}
	}, x = (e) => {
		var t = Ga();
		u(e, t);
	};
	s(y, (t) => {
		e(a) ? t(b) : t(x, -1);
	});
	var C = V(y, 2), T = (e) => {
		var t = Ka(), n = D(t, !0);
		J(() => S(n, i.store.kindLabel)), u(e, t);
	};
	s(C, (t) => {
		e(a) && t(T);
	});
	var E = V(C, 2), O = (t) => {
		var n = qa(), r = V(G(n), 2, !0);
		R(n), J(() => S(r, e(d))), u(t, n);
	};
	s(E, (t) => {
		e(d) && t(O);
	}), R(v);
	var k = V(v, 2), ee = G(k), te = D(ee, !0), ne = V(ee), M = (t) => {
		Tn(t, {
			get store() {
				return i.store;
			},
			get id() {
				return e(a).id;
			},
			size: 18
		});
	};
	s(ne, (t) => {
		e(a) && t(M);
	}), R(k);
	var re = V(k, 2), N = D(re, !0), ie = V(re, 2);
	ka(G(ie), {
		get store() {
			return i.store;
		},
		height: 16
	}), R(ie);
	var P = V(ie, 2), ae = G(P), oe = D(ae, !0), I = V(ae, 2), L = (e) => {
		var t = Ja();
		u(e, t);
	}, ce = (t) => {
		var n = Ya(), r = D(n, !0);
		J((e) => S(r, e), [() => e(l) ? `−${W(Ae(e(l), i.store.pos, i.store.speed))}` : ""]), u(t, n);
	};
	s(I, (t) => {
		e(a) && !e(o) ? t(L) : t(ce, -1);
	}), R(P);
	var z = V(P, 2), B = G(z), U = D(B), ue = V(B, 2), K = D(ue), Y = V(ue, 2);
	let de;
	var Z = G(Y);
	{
		let t = X(() => i.store.playing ? i.store.live ? Q.stop : Q.pause : Q.play);
		$(Z, {
			get d() {
				return e(t);
			},
			size: 24
		});
	}
	R(Y);
	var fe = V(Y, 2), pe = D(fe), me = V(fe, 2);
	let he;
	var ge = G(me);
	$(ge, {
		get d() {
			return Q.repeat;
		},
		size: 15,
		stroke: 1.8
	});
	var _e = V(ge), ve = (e) => {
		var t = Xa();
		u(e, t);
	};
	s(_e, (e) => {
		i.store.prefs.repeat === "one" && e(ve);
	}), R(me);
	var ye = V(me, 2);
	let be;
	var xe = G(ye);
	$(xe, {
		get d() {
			return Q.moon;
		},
		size: 15,
		stroke: 1.8
	}), R(ye), R(z);
	var Se = V(z, 2), Ce = (t) => {
		var n = Za(), r = D(n);
		J(() => S(r, `Sleep timer · ${e(f) ?? ""}`)), u(t, n);
	};
	s(Se, (e) => {
		i.store.sleep && e(Ce);
	});
	var we = V(Se, 2), Te = (e) => {
		Na(e, {
			get store() {
				return i.store;
			},
			pos: "right:16px;left:16px;width:auto;top:120px"
		});
	};
	s(we, (e) => {
		i.store.pop === "sleep" && e(Te);
	});
	var Ee = V(we, 2), De = (e) => {
		La(e, {
			get store() {
				return i.store;
			},
			pos: "right:16px;left:16px;width:auto;top:120px"
		});
	};
	s(Ee, (e) => {
		i.store.pop === "speed" && e(De);
	}), R(g);
	var Oe = V(g, 2), ke = G(Oe), je = G(ke), Me = D(je, !0), Ne = V(je), Pe = (e) => {
		var t = Qa();
		w("click", t, () => i.store.clip()), u(e, t);
	};
	s(Ne, (t) => {
		e(a) && t(Pe);
	}), R(ke);
	var Fe = V(ke, 2);
	n(Fe, 16, () => i.store.queue.length ? i.store.queue : e(m), (e) => e, (t, n) => {
		let r = X(() => i.store.items[n]);
		var a = le(), o = F(a), c = (t) => {
			var a = $a(), o = G(a);
			q(o, {
				get hue() {
					return e(r).hue;
				},
				get art() {
					return e(r).art;
				},
				get mark() {
					return e(r).mark;
				},
				size: 36,
				font: 9
			});
			var s = V(o, 2), c = G(s), l = D(c, !0), d = V(c), f = D(d);
			R(s), R(a), J((t) => {
				S(l, e(r).title), S(f, `${se[e(r).type] ?? ""}${t ?? ""}`);
			}, [() => i.store.lenOf(n) ? ` · ${i.store.lenOf(n)}` : ""]), w("click", a, () => i.store.play(n)), u(t, a);
		};
		s(o, (t) => {
			e(r) && t(c);
		}), u(t, a);
	}, (e) => {
		var t = eo();
		u(e, t);
	}), R(Oe), R(h), J((n, r, s, l) => {
		S(te, e(p)?.title || e(a)?.title || "Nothing playing"), S(N, n), S(oe, r), B.disabled = !e(o), t(B, "aria-expanded", i.store.pop === "speed"), t(B, "aria-label", `Playback speed ${s ?? ""}×`), S(U, `${l ?? ""}×`), ue.disabled = !e(o), t(ue, "aria-label", `Back ${i.store.prefs.back ?? ""} seconds`), S(K, `−${i.store.prefs.back ?? ""}`), de = c(Y, 1, "pp svelte-1jla3sy", null, de, {
			busy: i.store.buffering || i.store.loadingItem,
			paused: !i.store.playing
		}), Y.disabled = !e(a), t(Y, "aria-label", i.store.playing ? i.store.live ? "Stop" : "Pause" : "Play"), fe.disabled = !e(o), t(fe, "aria-label", `Forward ${i.store.prefs.fwd ?? ""} seconds`), S(pe, `+${i.store.prefs.fwd ?? ""}`), he = c(me, 1, "repeat svelte-1jla3sy", null, he, { on: i.store.prefs.repeat !== "off" }), me.disabled = !e(a) || i.store.live, t(me, "aria-pressed", i.store.prefs.repeat !== "off"), t(me, "aria-label", i.store.prefs.repeat === "off" ? "Repeat is off" : i.store.prefs.repeat === "all" ? "Repeat all" : "Repeat one"), t(me, "title", i.store.prefs.repeat === "off" ? "Repeat: off" : i.store.prefs.repeat === "all" ? "Repeat: all" : "Repeat: one"), be = c(ye, 1, "chipbtn sleep svelte-1jla3sy", null, be, { on: !!i.store.sleep }), ye.disabled = !e(a), t(ye, "aria-expanded", i.store.pop === "sleep"), S(Me, i.store.queue.length ? "Up next" : "Recent");
	}, [
		() => e(a) ? e(p)?.title ? [e(p).artist, e(a).title].filter(Boolean).join(" · ") : i.store.subtitle : "Widen the panel to browse, or pick from below.",
		() => e(a) ? e(o) ? W(i.store.pos) : "On air" : "",
		() => i.store.speed.toFixed(1),
		() => e(o) ? i.store.speed.toFixed(1) : "1.0"
	]), w("click", B, () => i.store.togglePop("speed")), w("click", ue, () => i.store.skip(-i.store.prefs.back)), w("click", Y, () => i.store.toggle()), w("click", fe, () => i.store.skip(i.store.prefs.fwd)), w("click", me, () => i.store.cycleRepeat()), w("click", ye, () => i.store.togglePop("sleep")), u(r, h), A();
}
C(["click"]);
//#endregion
//#region src/components/PrefsPopover.svelte
var io = l("<button> </button>"), ao = l("<div class=\"tm-pop\" role=\"dialog\" aria-label=\"Playback preferences\"><div class=\"title svelte-1dgvwbx\">Playback</div> <div class=\"label svelte-1dgvwbx\">Skip back</div> <div class=\"row svelte-1dgvwbx\" role=\"group\" aria-label=\"Skip back\"></div> <div class=\"label svelte-1dgvwbx\">Skip forward</div> <div class=\"row svelte-1dgvwbx\" role=\"group\" aria-label=\"Skip forward\"></div> <label class=\"toggle-row svelte-1dgvwbx\"><span class=\"svelte-1dgvwbx\"><b>Headphone buttons skip</b><small class=\"svelte-1dgvwbx\"> </small></span> <input type=\"checkbox\" role=\"switch\" class=\"svelte-1dgvwbx\"/></label> <label class=\"toggle-row svelte-1dgvwbx\"><span class=\"svelte-1dgvwbx\"><b>Smart rewind</b><small class=\"svelte-1dgvwbx\">Replay a few seconds when you resume after a break.</small></span> <input type=\"checkbox\" role=\"switch\" class=\"svelte-1dgvwbx\"/></label> <label class=\"toggle-row svelte-1dgvwbx\"><span class=\"svelte-1dgvwbx\"><b>Fill Up next automatically</b><small class=\"svelte-1dgvwbx\">Playing from a show or New from your shows queues its other unplayed episodes. Your own Play next and Queue picks always come first.</small></span> <input type=\"checkbox\" role=\"switch\" class=\"svelte-1dgvwbx\"/></label> <label class=\"toggle-row svelte-1dgvwbx\"><span class=\"svelte-1dgvwbx\"><b>Continuous play</b><small class=\"svelte-1dgvwbx\">When an episode or book ends, play what is up next, or the show's next episode.</small></span> <input type=\"checkbox\" role=\"switch\" class=\"svelte-1dgvwbx\"/></label> <div class=\"foot svelte-1dgvwbx\"><button class=\"link svelte-1dgvwbx\">Keyboard shortcuts</button> <button class=\"link danger svelte-1dgvwbx\">Clear history</button></div></div>"), oo = {
	hash: "svelte-1dgvwbx",
	code: ".title.svelte-1dgvwbx {font-size:13px;font-weight:650;}.label.svelte-1dgvwbx {font-size:11px;color:var(--tm-muted);margin:12px 0 6px;}.row.svelte-1dgvwbx {display:flex;gap:5px;}.opt.svelte-1dgvwbx {flex:1;height:30px;border-radius:8px;border:0;background:var(--tm-fg-6);color:var(--tm-fg);font-size:11.5px;font-weight:600;cursor:pointer;font-variant-numeric:tabular-nums;}.opt.svelte-1dgvwbx:hover {background:var(--tm-fg-10);}.opt.sel.svelte-1dgvwbx {background:var(--tm-accent);color:var(--tm-on-accent);}.toggle-row.svelte-1dgvwbx {display:flex;align-items:center;gap:12px;margin-top:12px;cursor:pointer;}.toggle-row.svelte-1dgvwbx span:where(.svelte-1dgvwbx) {flex:1;display:flex;flex-direction:column;gap:2px;font-size:12px;}.toggle-row.svelte-1dgvwbx small:where(.svelte-1dgvwbx) {font-size:11px;color:var(--tm-muted);line-height:1.35;}input[type=checkbox].svelte-1dgvwbx {appearance:none;width:34px;height:20px;flex:none;border-radius:10px;background:var(--tm-fg-16);position:relative;cursor:pointer;transition:background .15s;margin:0;}input[type=checkbox].svelte-1dgvwbx::after {content:'';position:absolute;top:3px;left:3px;width:14px;height:14px;border-radius:50%;background:var(--tm-fg);transition:transform .15s;}input[type=checkbox].svelte-1dgvwbx:checked {background:var(--tm-accent);}input[type=checkbox].svelte-1dgvwbx:checked::after {transform:translateX(14px);background:var(--tm-on-accent);}input[type=checkbox].svelte-1dgvwbx:focus-visible {outline:2px solid var(--tm-accent);outline-offset:2px;}.foot.svelte-1dgvwbx {display:flex;justify-content:space-between;margin-top:14px;padding-top:10px;border-top:1px solid var(--tm-fg-8);}.link.svelte-1dgvwbx {border:0;background:none;padding:0;color:var(--tm-accent);font-size:11.5px;cursor:pointer;}.link.danger.svelte-1dgvwbx {color:var(--tm-muted);}.link.danger.svelte-1dgvwbx:hover:not(:disabled) {color:var(--tm-live);}.link.svelte-1dgvwbx:disabled {opacity:.4;cursor:default;}\n  @media (prefers-reduced-motion: reduce) {input[type=checkbox].svelte-1dgvwbx, input[type=checkbox].svelte-1dgvwbx::after {transition:none;} }"
};
function so(r, i) {
	j(i, !0), _(r, oo);
	let o = Z(i, "store", 7);
	var s = ao(), l = V(G(s), 4);
	n(l, 21, () => Et, x, (n, r) => {
		var i = io();
		let a;
		var s = D(i);
		J(() => {
			a = c(i, 1, "opt svelte-1dgvwbx", null, a, { sel: o().prefs.back === e(r) }), t(i, "aria-pressed", o().prefs.back === e(r)), S(s, `${e(r) ?? ""}s`);
		}), w("click", i, () => o().setPref("back", e(r))), u(n, i);
	}), R(l);
	var d = V(l, 4);
	n(d, 21, () => Dt, x, (n, r) => {
		var i = io();
		let a;
		var s = D(i);
		J(() => {
			a = c(i, 1, "opt svelte-1dgvwbx", null, a, { sel: o().prefs.fwd === e(r) }), t(i, "aria-pressed", o().prefs.fwd === e(r)), S(s, `${e(r) ?? ""}s`);
		}), w("click", i, () => o().setPref("fwd", e(r))), u(n, i);
	}), R(d);
	var f = V(d, 2), p = G(f), m = V(G(p)), h = D(m);
	R(p);
	var g = V(p, 2);
	oe(g), R(f);
	var v = V(f, 2), y = V(G(v), 2);
	oe(y), R(v);
	var b = V(v, 2), C = V(G(b), 2);
	oe(C), R(b);
	var T = V(b, 2), E = V(G(T), 2);
	oe(E), R(T);
	var O = V(T, 2), k = G(O), ee = V(k, 2);
	R(O), R(s), J(() => {
		a(s, i.pos), S(h, `On episodes and books, next and previous on headphones, car or keyboard media keys jump +${o().prefs.fwd ?? ""}s / −${o().prefs.back ?? ""}s. Next moves on to the next episode only near the end.`), ae(g, o().prefs.headsetSkip), ae(y, o().prefs.smartRewind), ae(C, o().prefs.autoFill), ae(E, o().prefs.continuous), ee.disabled = !o().history.length;
	}), w("change", g, (e) => o().setPref("headsetSkip", e.currentTarget.checked)), w("change", y, (e) => o().setPref("smartRewind", e.currentTarget.checked)), w("change", C, (e) => o().setPref("autoFill", e.currentTarget.checked)), w("change", E, (e) => o().setPref("continuous", e.currentTarget.checked)), w("click", k, () => {
		o().pop = null, o().shortcuts = !0;
	}), w("click", ee, () => o().clearHistory()), u(r, s), A();
}
C(["click", "change"]);
//#endregion
//#region src/components/ShortcutsSheet.svelte
var co = l("<span class=\"to svelte-jfujii\">–</span>"), lo = l("<kbd class=\"svelte-jfujii\"> </kbd>"), uo = l("<div class=\"svelte-jfujii\"><dt class=\"svelte-jfujii\"></dt><dd class=\"svelte-jfujii\"> </dd></div>"), fo = l("<div class=\"scrim svelte-jfujii\" role=\"presentation\"><div class=\"sheet svelte-jfujii\" role=\"dialog\" aria-modal=\"true\" aria-label=\"Keyboard shortcuts\" tabindex=\"-1\"><div class=\"head svelte-jfujii\"><h2 class=\"svelte-jfujii\">Keyboard shortcuts</h2><button class=\"x svelte-jfujii\" aria-label=\"Close\">✕</button></div> <dl class=\"svelte-jfujii\"></dl></div></div>"), po = {
	hash: "svelte-jfujii",
	code: ".scrim.svelte-jfujii {position:absolute;inset:0;z-index:20;background:rgba(0, 0, 0, .5);display:grid;place-items:center;padding:20px;}.sheet.svelte-jfujii {width:min(460px, 100%);max-height:100%;overflow:auto;padding:20px 22px;border-radius:16px;background:var(--tm-pop);border:1px solid var(--tm-fg-10);box-shadow:0 30px 70px rgba(0, 0, 0, .55);outline:none;}.head.svelte-jfujii {display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}h2.svelte-jfujii {font-size:15px;margin:0;}.x.svelte-jfujii {width:28px;height:28px;border:0;border-radius:8px;background:none;color:var(--tm-muted);cursor:pointer;}.x.svelte-jfujii:hover {background:var(--tm-fg-8);color:var(--tm-fg);}dl.svelte-jfujii {margin:0;display:grid;gap:2px;}dl.svelte-jfujii div:where(.svelte-jfujii) {display:flex;align-items:center;gap:14px;padding:7px 0;border-top:1px solid var(--tm-fg-6);}dt.svelte-jfujii {width:120px;flex:none;display:flex;align-items:center;gap:4px;}dd.svelte-jfujii {margin:0;font-size:12.5px;}kbd.svelte-jfujii {font:600 11px ui-monospace, Menlo, monospace;min-width:22px;text-align:center;padding:3px 6px;border-radius:6px;background:var(--tm-fg-8);border:1px solid var(--tm-fg-14);border-bottom-width:2px;}.to.svelte-jfujii {color:var(--tm-muted);}"
};
function mo(t, r) {
	j(r, !0), _(t, po);
	let i = Z(r, "store", 7), a = X(() => [
		[["Space"], "Play or pause (stop for live radio)"],
		[["←"], `Back ${i().prefs.back} seconds`],
		[["→"], `Forward ${i().prefs.fwd} seconds`],
		[["Shift", "←"], "Previous chapter"],
		[["Shift", "→"], "Next in queue"],
		[["↑", "↓"], "Volume up or down"],
		[["M"], "Mute"],
		[["R"], "Repeat: off, all, one"],
		[["F"], "Favorite or save what is playing"],
		[["B"], "Bookmark this moment (audiobooks)"],
		[["/"], "Search"],
		[[
			"1",
			"–",
			"5"
		], "Listen now, My Media, Radio, Podcasts, Audiobooks"],
		[["?"], "Show this list"]
	]), o = I(void 0);
	z(() => {
		e(o)?.focus();
	});
	var c = fo(), l = G(c), d = G(l), f = V(G(d));
	R(d);
	var p = V(d, 2);
	n(p, 21, () => e(a), ([e, t]) => t, (t, r) => {
		var i = X(() => re(e(r), 2));
		let a = () => e(i)[0], o = () => e(i)[1];
		var c = uo(), l = G(c);
		n(l, 21, a, x, (t, n) => {
			var r = le(), i = F(r), a = (e) => {
				var t = co();
				u(e, t);
			}, o = (t) => {
				var r = lo(), i = D(r, !0);
				J(() => S(i, e(n))), u(t, r);
			};
			s(i, (t) => {
				e(n) === "–" ? t(a) : t(o, -1);
			}), u(t, r);
		}), R(l);
		var d = V(l), f = D(d, !0);
		R(c), J(() => S(f, o())), u(t, c);
	}), R(p), R(l), y(l, (e) => k(o, e), () => e(o)), R(c), w("click", c, () => i().shortcuts = !1), w("click", l, (e) => e.stopPropagation()), w("keydown", l, (e) => {
		e.key === "Escape" && (e.stopPropagation(), i().shortcuts = !1);
	}), w("click", f, () => i().shortcuts = !1), u(t, c), A();
}
C(["click", "keydown"]);
//#endregion
//#region src/App.svelte
var ho = l("<div class=\"unsupported svelte-1n46o8q\"><strong class=\"svelte-1n46o8q\">Update Tend to use Tend Player.</strong><p>This panel does not provide the OndaCast catalog capability yet. Updating Tend adds it.</p></div>"), go = l("<!> <div class=\"middle svelte-1n46o8q\"><!> <main class=\"svelte-1n46o8q\"><!></main> <!></div> <!>", 1), _o = l("<div role=\"status\"> </div>"), vo = l("<div class=\"tend-media svelte-1n46o8q\" tabindex=\"-1\"><!> <!> <!> <!></div>"), yo = {
	hash: "svelte-1n46o8q",
	code: ".tend-media.svelte-1n46o8q {\n    /* Live Tend theme tokens with the Tend Notes dark palette as fallback. */--tm-bg: var(--color-base-100, #151b19);--tm-panel: var(--color-base-200, #1d2622);--tm-fg: var(--color-base-content, #d8e3df);--tm-accent: var(--color-primary, #66b798);--tm-on-accent: var(--color-primary-content, #071a13);--tm-muted: color-mix(in srgb, var(--tm-fg) 64%, var(--tm-bg));--tm-brand: #0f766e;--tm-live: #ff6b6b;--tm-fg-4: color-mix(in srgb, var(--tm-fg) 4.5%, transparent);--tm-fg-5: color-mix(in srgb, var(--tm-fg) 5%, transparent);--tm-fg-6: color-mix(in srgb, var(--tm-fg) 6%, transparent);--tm-fg-7: color-mix(in srgb, var(--tm-fg) 7%, transparent);--tm-fg-8: color-mix(in srgb, var(--tm-fg) 8%, transparent);--tm-fg-10: color-mix(in srgb, var(--tm-fg) 10%, transparent);--tm-fg-12: color-mix(in srgb, var(--tm-fg) 12%, transparent);--tm-fg-14: color-mix(in srgb, var(--tm-fg) 14%, transparent);--tm-fg-16: color-mix(in srgb, var(--tm-fg) 16%, transparent);--tm-fg-18: color-mix(in srgb, var(--tm-fg) 18%, transparent);--tm-fg-45: color-mix(in srgb, var(--tm-fg) 45%, transparent);--tm-accent-7: color-mix(in srgb, var(--tm-accent) 7%, transparent);--tm-accent-8: color-mix(in srgb, var(--tm-accent) 8%, transparent);--tm-accent-12: color-mix(in srgb, var(--tm-accent) 12%, transparent);--tm-accent-14: color-mix(in srgb, var(--tm-accent) 14%, transparent);--tm-pop: color-mix(in srgb, var(--tm-fg) 3.5%, var(--tm-panel));\n    /* The panel's window glass: --tend-panel-surface-alpha is 0% for a glass\n       window and 100% for a solid one. The main surface follows it exactly;\n       bars and side panels keep a light tint so the layout still reads. */--tm-alpha: var(--tend-panel-surface-alpha, 100%);--tm-surface: color-mix(in srgb, var(--tm-bg) var(--tm-alpha), transparent);--tm-panel-surface: color-mix(in srgb, var(--tm-panel) max(var(--tm-alpha), 45%), transparent);position:relative;height:100%;width:100%;overflow:hidden;display:flex;flex-direction:column;background:var(--tm-surface);color:var(--tm-fg);font-family:system-ui, -apple-system, \"Segoe UI\", sans-serif;font-size:13px;-webkit-font-smoothing:antialiased;outline:none;}.tend-media.svelte-1n46o8q * {box-sizing:border-box;}.tend-media.svelte-1n46o8q button {font-family:inherit;}.tend-media.svelte-1n46o8q button:focus-visible {outline:2px solid var(--tm-accent);outline-offset:2px;}.tend-media.svelte-1n46o8q .tm-pop {position:absolute;width:250px;padding:14px;border-radius:14px;z-index:5;background:var(--tm-pop);border:1px solid var(--tm-fg-10);box-shadow:0 20px 50px rgba(0, 0, 0, .5);}.toast.low.svelte-1n46o8q {bottom:20px;}.unsupported.svelte-1n46o8q {margin:auto;max-width:360px;text-align:center;padding:24px;font-size:13px;color:var(--tm-muted);}.unsupported.svelte-1n46o8q strong:where(.svelte-1n46o8q) {display:block;color:var(--tm-fg);font-size:15px;margin-bottom:6px;}.middle.svelte-1n46o8q {flex:1;min-height:0;display:flex;}main.svelte-1n46o8q {flex:1;min-width:0;overflow:auto;padding:26px 28px 28px;container-type:inline-size;}.toast.svelte-1n46o8q {position:absolute;left:50%;bottom:96px;transform:translateX(-50%);padding:10px 16px;border-radius:10px;background:var(--tm-fg);color:var(--tm-bg);font-size:12.5px;font-weight:600;box-shadow:0 12px 30px rgba(0, 0, 0, .4);z-index:6;white-space:nowrap;max-width:calc(100% - 32px);overflow:hidden;text-overflow:ellipsis;}"
};
function bo(t, n) {
	j(n, !0), _(t, yo);
	let i = Z(n, "narrow", 7, !1), a = new Pt(n.host), o = I(void 0);
	r(() => (a.start(), () => a.destroy())), z(() => {
		a.tab, a.showSlug, a.bookId, a.libKind, e(o)?.scrollTo(0, 0);
	});
	function l(e) {
		i(e);
	}
	function d() {
		return a.destroy();
	}
	let f = (e) => e instanceof HTMLElement && (e.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.tagName)), p = [
		"home",
		"mine",
		"radio",
		"pod",
		"book"
	];
	function m(e) {
		if (e.key === "Escape" && a.pop) {
			a.pop = null, a.popItem = null, e.stopPropagation();
			return;
		}
		if (f(e.target) || e.metaKey || e.ctrlKey || e.altKey || a.shortcuts) return;
		let t = e.target instanceof HTMLElement ? e.target : null, n = t?.closest("button,[role=slider],select,a"), r = a.item, o = () => {
			e.preventDefault(), e.stopPropagation();
		};
		switch (e.key) {
			case " ":
				n || (o(), a.live && a.playing ? a.stop() : a.toggle());
				return;
			case "ArrowLeft":
				if (t?.closest("[role=slider]")) return;
				o(), e.shiftKey ? a.previous() : a.skip(-a.prefs.back);
				return;
			case "ArrowRight":
				if (t?.closest("[role=slider]")) return;
				o(), e.shiftKey ? a.next() : a.skip(a.prefs.fwd);
				return;
			case "ArrowUp":
				if (t?.closest("[role=slider],select")) return;
				o(), a.setVolume(a.volume + .1);
				return;
			case "ArrowDown":
				if (t?.closest("[role=slider],select")) return;
				o(), a.setVolume(a.volume - .1);
				return;
			case "m":
			case "M":
				o(), a.toggleMute();
				return;
			case "r":
			case "R":
				r && r.type !== "radio" && (o(), a.cycleRepeat());
				return;
			case "f":
			case "F":
				r && (o(), a.toggleFavorite(r.id));
				return;
			case "b":
			case "B":
				r?.type === "book" && (o(), a.bookmark(r.id));
				return;
			case "/":
				o(), e.currentTarget.querySelector("header input[type=search]")?.focus();
				return;
			case "?":
				o(), a.shortcuts = !0;
				return;
		}
		/^[1-5]$/.test(e.key) && !i() && (o(), a.tab = p[Number(e.key) - 1], a.setQuery(""), a.tab === "pod" && (a.showSlug = null), a.tab === "book" && (a.bookId = null));
	}
	function h(e) {
		let t = e.target;
		a.pop && !t.closest(".tm-pop,[data-pop]") && (a.pop = null, a.popItem = null);
	}
	var g = {
		setNarrow: l,
		shutdown: d
	}, v = vo(), b = G(v), x = (e) => {
		var t = ho();
		u(e, t);
	}, C = (e) => {
		ro(e, { get store() {
			return a;
		} });
	}, T = (t) => {
		var n = go(), r = F(n);
		Lt(r, { get store() {
			return a;
		} });
		var i = V(r, 2), c = G(i);
		Gt(c, { get store() {
			return a;
		} });
		var l = V(c, 2), d = G(l), f = (e) => {
			Bi(e, { get store() {
				return a;
			} });
		}, p = X(() => a.query.trim()), m = (e) => {
			Sn(e, { get store() {
				return a;
			} });
		}, h = (e) => {
			fr(e, { get store() {
				return a;
			} });
		}, g = (e) => {
			Dr(e, { get store() {
				return a;
			} });
		}, _ = (e) => {
			ui(e, { get store() {
				return a;
			} });
		}, v = (e) => {
			Mi(e, { get store() {
				return a;
			} });
		};
		s(d, (t) => {
			e(p) ? t(f) : a.tab === "home" ? t(m, 1) : a.tab === "mine" ? t(h, 2) : a.tab === "radio" ? t(g, 3) : a.tab === "pod" ? t(_, 4) : t(v, -1);
		}), R(l), y(l, (e) => k(o, e), () => e(o)), Ta(V(l, 2), { get store() {
			return a;
		} }), R(i), Wa(V(i, 2), { get store() {
			return a;
		} }), u(t, n);
	};
	s(b, (e) => {
		a.supported ? i() ? e(C, 1) : e(T, -1) : e(x);
	});
	var E = V(b, 2), O = (e) => {
		so(e, {
			get store() {
				return a;
			},
			pos: "right:12px;top:42px;width:290px"
		});
	};
	s(E, (e) => {
		a.pop === "prefs" && e(O);
	});
	var ee = V(E, 2), te = (e) => {
		mo(e, { get store() {
			return a;
		} });
	};
	s(ee, (e) => {
		a.shortcuts && e(te);
	});
	var ne = V(ee, 2), M = (e) => {
		var t = _o();
		let n;
		var r = D(t, !0);
		J(() => {
			n = c(t, 1, "toast svelte-1n46o8q", null, n, { low: i() }), S(r, a.toast);
		}), u(e, t);
	};
	return s(ne, (e) => {
		a.toast && e(M);
	}), R(v), w("keydown", v, m), w("pointerdown", v, h), u(t, v), A(g);
}
C(["keydown", "pointerdown"]);
//#endregion
//#region src/index.ts
var xo = 640;
function So(e) {
	let t = null, n = null;
	async function r() {
		n?.disconnect(), n = null;
		let e = t;
		if (t = null, e) try {
			await e.shutdown();
		} finally {
			await o(e);
		}
	}
	return e.onUnmount?.(r), {
		mount(i) {
			let a = i.shadowRoot ?? i.attachShadow({ mode: "open" }), o = document.createElement("div");
			return o.style.cssText = "height:100%;width:100%", a.replaceChildren(o), i.style.display = i.style.display || "block", t = b(bo, {
				target: o,
				props: {
					host: e,
					narrow: i.clientWidth > 0 && i.clientWidth < 640
				}
			}), n = new ResizeObserver(([e]) => t?.setNarrow(e.contentRect.width < 640)), n.observe(i), { unmount: r };
		},
		unmount: r
	};
}
//#endregion
export { xo as NARROW_WIDTH, So as activate };
