import { $ as e, G as t, H as n, I as r, J as i, K as a, R as o, U as s, W as c, at as l, c as u, ct as d, f, h as p, lt as m, m as h, mt as g, ot as _, rt as v, st as y, tt as b, u as x, w as S, x as C, y as w, z as T } from "./Cover-CgtzAtR8.js";
//#region src/widgets/mount.ts
function E(e) {
	return function(n) {
		let r = null;
		async function i() {
			let e = r;
			r = null, e && await t(e);
		}
		return n.onUnmount?.(i), {
			mount(t) {
				let a = t.shadowRoot ?? t.attachShadow({ mode: "open" }), o = document.createElement("div");
				return o.style.cssText = "height:100%;width:100%", a.replaceChildren(o), t.style.display = t.style.display || "block", t.style.height = t.style.height || "100%", r = s(e, {
					target: o,
					props: { host: n }
				}), { unmount: i };
			},
			unmount: i
		};
	};
}
//#endregion
//#region src/widgets/Card.svelte
var D = i("<span class=\"count svelte-e09zir\"> </span>"), O = i("<div class=\"head svelte-e09zir\"><span class=\"label svelte-e09zir\"> </span><!></div>"), k = i("<div><!> <div class=\"body svelte-e09zir\"><!></div></div>"), A = {
	hash: "svelte-e09zir",
	code: ".w.svelte-e09zir {--w-fg: var(--color-base-content, #d8e3df);--w-bg: var(--color-base-100, #151b19);--w-accent: var(--color-primary, #66b798);--w-on-accent: var(--color-primary-content, #071a13);--w-muted: color-mix(in srgb, var(--w-fg) 60%, transparent);--w-faint: color-mix(in srgb, var(--w-fg) 12%, transparent);--w-hover: color-mix(in srgb, var(--w-fg) 7%, transparent);--w-live: #ff6b6b;height:100%;min-height:0;display:flex;flex-direction:column;gap:7px;color:var(--w-fg);font-family:inherit;font-size:12px;line-height:1.3;overflow:clip;position:relative;box-sizing:border-box;}.w.svelte-e09zir * {box-sizing:border-box;min-width:0;}\n  /* The shelf's own ••• menu lives in the top-right corner: keep it clear. */.head.svelte-e09zir {display:flex;align-items:center;gap:6px;padding-right:30px;flex:none;}.label.svelte-e09zir {font-size:9.5px;font-weight:750;letter-spacing:.08em;text-transform:uppercase;color:var(--w-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.count.svelte-e09zir {font-size:9.5px;font-weight:750;min-width:17px;height:17px;padding:0 5px;border-radius:9px;display:grid;place-items:center;background:var(--w-accent);color:var(--w-on-accent);}.body.svelte-e09zir {flex:1;min-height:0;display:flex;flex-direction:column;}\n  @media (prefers-reduced-motion: reduce) {.w.svelte-e09zir * {animation-duration:1ms !important;transition-duration:1ms !important;}\n  }"
};
function j(e, t) {
	o(e, A);
	let i = S(t, "label", 3, ""), s = S(t, "count", 3, 0);
	var u = k();
	let d;
	var f = v(u), p = (e) => {
		var t = O(), r = v(t), o = l(r, !0), u = _(r), d = (e) => {
			var t = D(), n = l(t, !0);
			b(() => c(n, s())), a(e, t);
		};
		n(u, (e) => {
			s() && e(d);
		}), g(t), b(() => c(o, i())), a(e, t);
	};
	n(f, (e) => {
		i() && e(p);
	});
	var m = _(f, 2), h = v(m);
	T(h, () => t.children), g(m), g(u), b(() => d = r(u, 1, "w svelte-e09zir", null, d, { wide: t.size === "wide" })), a(e, u);
}
//#endregion
//#region src/widgets/Eq.svelte
var M = i("<span aria-hidden=\"true\"><i class=\"svelte-ckvpzr\"></i><i class=\"svelte-ckvpzr\"></i><i class=\"svelte-ckvpzr\"></i></span>"), N = {
	hash: "svelte-ckvpzr",
	code: ".eq.svelte-ckvpzr {display:inline-flex;align-items:flex-end;gap:2px;height:10px;}.eq.svelte-ckvpzr i:where(.svelte-ckvpzr) {width:2.5px;height:40%;border-radius:1px;background:currentColor;}.eq.on.svelte-ckvpzr i:where(.svelte-ckvpzr) { animation: svelte-ckvpzr-eq .9s ease-in-out infinite alternate;}.eq.on.svelte-ckvpzr i:where(.svelte-ckvpzr):nth-child(2) {animation-delay:-.3s;}.eq.on.svelte-ckvpzr i:where(.svelte-ckvpzr):nth-child(3) {animation-delay:-.6s;}\n  @keyframes svelte-ckvpzr-eq { from { height: 25%; } to { height: 100%; } }"
};
function P(e, t) {
	o(e, N);
	let n = S(t, "on", 3, !0);
	var i = M();
	let s;
	b(() => s = r(i, 1, "eq svelte-ckvpzr", null, s, { on: n() })), a(e, i);
}
//#endregion
//#region src/widgets/samples.ts
var F = (e) => (/* @__PURE__ */ new Date(Date.now() - e * 864e5)).toISOString(), I = (e, t, n) => ({
	id: e,
	title: t,
	sub: n,
	hue: f(e),
	mark: p(t)
}), L = (e, t, n) => ({
	slug: e,
	id: e,
	title: t,
	author: n,
	desc: "",
	hue: f(e),
	mark: p(t),
	category: "Podcast",
	episodes: 0
}), R = (e, t, n, r, i) => ({
	...I(e, n, t.title),
	type: "podcast",
	show: t.slug,
	slug: e,
	url: "https://example.invalid/a.mp3",
	dur: r,
	date: i,
	chapters: []
}), z = (e, t, n) => ({
	...I(`st:${e}`, t, n),
	type: "radio",
	stationId: e,
	url: "https://example.invalid/s",
	onair: "",
	genre: n
}), B = (e, t, n, r) => ({
	...I(`book:${e}`, t, n),
	type: "book",
	slug: e,
	dur: r,
	chapters: [],
	loaded: !1
}), V = L("night-shift-science", "Night Shift Science", "Night Shift"), H = L("slow-signals", "Slow Signals", "Marta Ruiz"), U = L("the-long-field", "The Long Field", "Ana Prado"), W = [
	R("n1", V, "Sleep, memory, and the 3 a.m. brain", 1980, F(0)),
	R("n2", H, "The quiet economics of attention", 2410, F(1)),
	R("n3", U, "Seed banks and the long view", 2150, F(2)),
	R("n4", H, "Cities that listen", 2230, F(4)),
	R("n5", V, "Why we dream in stories", 1760, F(6)),
	R("n6", U, "Rain, finally", 1890, F(8))
], G = [
	z("kexp", "KEXP 90.3", "Indie"),
	z("fip", "FIP", "Eclectic"),
	z("jazz24", "Jazz24", "Jazz"),
	z("soma", "SomaFM Groove Salad", "Ambient"),
	z("nts", "NTS 1", "Eclectic"),
	z("bbc6", "BBC 6 Music", "Alternative"),
	z("radio-paradise", "Radio Paradise", "Eclectic"),
	z("kcrw", "KCRW", "Public radio")
], K = B("pride-and-prejudice", "Pride and Prejudice", "Jane Austen", 41700), q = B("the-time-machine", "The Time Machine", "H. G. Wells", 12600), J = R("p1", H, "Ep. 141: Cities that listen", 2230, F(7)), Y = {
	v: 1,
	now: G[0].id,
	pos: 0,
	queue: [],
	speeds: {},
	volume: .8,
	progress: {
		[K.id]: {
			pos: 15500,
			dur: 41700,
			at: Date.now() - 36e5
		},
		[J.id]: {
			pos: 1300,
			dur: 2230,
			at: Date.now() - 72e5
		},
		[q.id]: {
			pos: 2600,
			dur: 12600,
			at: Date.now() - 864e5
		}
	},
	played: {},
	bookmarks: {},
	recentStations: G.map((e) => e.id),
	subscribed: {
		[V.slug]: V,
		[H.slug]: H,
		[U.slug]: U
	},
	items: {
		...Object.fromEntries(G.map((e) => [e.id, e])),
		[K.id]: K,
		[q.id]: q,
		[J.id]: J
	},
	favorites: Object.fromEntries(G.map((e) => [e.id, e])),
	saved: {
		[K.id]: K,
		[q.id]: q
	}
}, X = {
	kind: "radio",
	source: "KEXP 90.3",
	title: "Blue in Green",
	subtitle: "Miles Davis",
	artwork: null,
	fallbackArtwork: null,
	status: "playing",
	live: !0,
	progress: null
}, Z = 6e4, Q = 18e5, $ = class {
	host;
	wantsNew;
	#e = m(null);
	get lib() {
		return e(this.#e);
	}
	set lib(e) {
		d(this.#e, e, !0);
	}
	#t = m(null);
	get now() {
		return e(this.#t);
	}
	set now(e) {
		d(this.#t, e, !0);
	}
	#n = m(y([]));
	get fresh() {
		return e(this.#n);
	}
	set fresh(e) {
		d(this.#n, e, !0);
	}
	#r = m("idle");
	get freshStatus() {
		return e(this.#r);
	}
	set freshStatus(e) {
		d(this.#r, e, !0);
	}
	#i = m(!1);
	get ready() {
		return e(this.#i);
	}
	set ready(e) {
		d(this.#i, e, !0);
	}
	preview;
	size;
	canControl;
	stops = [];
	constructor(e, t = !1) {
		this.host = e, this.wantsNew = t, this.preview = e.widget?.preview === !0, this.size = e.widget?.size === "wide" ? "wide" : "small", this.canControl = !!e.mediaSession && !this.preview;
	}
	start() {
		if (this.preview) return this.lib = Y, this.now = X, this.fresh = W, this.freshStatus = "ready", this.ready = !0, () => {};
		let e = this.host.mediaSession;
		if (e) try {
			this.now = e.current();
			let t = "";
			this.stops.push(e.watch((e) => {
				this.now = e;
				let n = e ? `${e.kind}|${e.source}|${e.title}|${e.status}` : "";
				n !== t && (t = n, this.reload(), setTimeout(() => void this.reload(), 2500));
			}));
		} catch {}
		this.reload();
		let t = setInterval(() => void this.reload(), Z), n = this.wantsNew ? setInterval(() => void this.loadNew(), Q) : null;
		return this.stops.push(() => {
			clearInterval(t), n && clearInterval(n);
		}), () => {
			for (let e of this.stops.splice(0)) e();
		};
	}
	followedKey = "";
	async reload() {
		this.lib = await u(this.host) ?? this.lib, this.ready = !0;
		let e = this.followed.map((e) => e.slug).sort().join(",");
		this.wantsNew && e !== this.followedKey && (this.followedKey = e, this.loadNew());
	}
	item(e) {
		let t = this.lib;
		return t ? t.items[e] ?? t.favorites?.[e] ?? t.saved?.[e] : void 0;
	}
	isDone(e) {
		let t = this.lib;
		if (!t) return !1;
		let n = t.progress[e];
		return !!t.played[e] || !!n?.dur && n.pos >= n.dur - 5;
	}
	get continuing() {
		let e = this.lib;
		return e ? Object.entries(e.progress).filter(([t, n]) => n.pos > 5 && (!n.dur || n.pos < n.dur - 5) && !e.played[t]).sort((e, t) => t[1].at - e[1].at).flatMap(([e, t]) => {
			let n = this.item(e);
			if (!n || n.type === "radio") return [];
			let r = t.dur || ("dur" in n ? n.dur : 0) || 0;
			return [{
				item: n,
				pct: r ? Math.min(100, Math.round(t.pos / r * 100)) : 0,
				left: r ? Math.max(0, r - t.pos) : 0
			}];
		}) : [];
	}
	get stations() {
		let e = this.lib;
		if (!e) return {
			list: [],
			favorites: !0
		};
		let t = Object.values(e.favorites ?? {});
		return t.length ? {
			list: t,
			favorites: !0
		} : {
			list: e.recentStations.map((t) => e.items[t]).filter((e) => e?.type === "radio"),
			favorites: !1
		};
	}
	get followed() {
		return Object.values(this.lib?.subscribed ?? {});
	}
	get last() {
		let e = this.lib;
		if (!e) return null;
		let t = e.now ?? e.history?.[0]?.id;
		return t ? this.item(t) ?? null : null;
	}
	playing(e) {
		let t = this.now;
		return !t || !e || t.status === "paused" || t.status === "error" ? !1 : e.type === "radio" ? t.kind === "radio" && t.source === e.title : e.type === "podcast" ? t.kind === "podcast" && t.title === e.title : t.kind === "book" && t.source === e.title;
	}
	async loadNew() {
		let e = this.host.ondacast, t = this.followed.slice(0, 8);
		if (!e || !t.length) {
			this.fresh = [], this.freshStatus = "ready";
			return;
		}
		this.freshStatus !== "ready" && (this.freshStatus = "loading");
		let n = await Promise.all(t.map(async (t) => {
			try {
				let n = x(await e.podcasts.get(t.slug, 1)), r = C(x(n.podcast)) ?? t;
				return h(n, "episodes").map((e) => w(e, r)).filter((e) => !!e).slice(0, 3);
			} catch {
				return null;
			}
		}));
		if (n.every((e) => e === null)) {
			this.freshStatus = "error";
			return;
		}
		let r = this.lib;
		this.fresh = n.flat().filter((e) => !!e).filter((e) => !this.isDone(e.id) && !r?.progress[e.id]?.pos).sort((e, t) => (t.date || "").localeCompare(e.date || "")).slice(0, 6), this.freshStatus = "ready";
	}
	send(e) {
		this.canControl && this.host.mediaSession.send(e).catch(() => void 0);
	}
	open() {
		if (!this.preview) try {
			this.host.mediaSession?.open?.();
		} catch {}
	}
};
//#endregion
export { E as i, P as n, j as r, $ as t };
