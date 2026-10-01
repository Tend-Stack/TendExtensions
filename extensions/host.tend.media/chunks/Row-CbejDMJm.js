import { $ as e, A as t, E as n, F as r, H as i, I as a, J as o, K as s, R as c, W as l, X as u, Z as d, at as f, ct as p, dt as m, ft as h, lt as g, mt as _, ot as v, rt as y, t as b, tt as x, ut as S, w as C, z as w } from "./Cover-CFUQKa8h.js";
import { n as T, t as E } from "./Icon-CkCATa2J.js";
import { n as D } from "./model.svelte-A0MofO8E.js";
//#region src/widgets/List.svelte
var O = o("<div><!></div>"), k = {
	hash: "svelte-1ry98wx",
	code: ".list.svelte-1ry98wx {flex:1;min-height:0;display:grid;grid-template-columns:1fr;align-content:start;overflow:clip;margin:0 -4px;}.list.wide.svelte-1ry98wx {grid-template-columns:1fr 1fr;column-gap:8px;}"
};
function A(t, i) {
	c(t, k);
	let o = C(i, "rowHeight", 3, 42), l = C(i, "gap", 3, 2), u = g(0), d = S(() => Math.max(1, Math.floor((e(u) + l()) / (o() + l()))) * (i.wide ? 2 : 1));
	var f = O();
	let m, h;
	var v = y(f);
	w(v, () => i.children, () => e(d)), _(f), x(() => {
		m = a(f, 1, "list svelte-1ry98wx", null, m, { wide: i.wide }), h = r(f, "", h, {
			"row-gap": `${l() ?? ""}px`,
			"grid-auto-rows": `${o() ?? ""}px`
		});
	}), n(f, "clientHeight", (e) => p(u, e)), s(t, f);
}
//#endregion
//#region src/widgets/Row.svelte
var j = o("<span class=\"meta svelte-1ucxs4t\"><span class=\"bar svelte-1ucxs4t\"><span class=\"svelte-1ucxs4t\"></span></span> </span>"), M = o("<span class=\"meta svelte-1ucxs4t\"> </span>"), N = o("<button><span class=\"art svelte-1ucxs4t\"><!> <span class=\"hover svelte-1ucxs4t\" aria-hidden=\"true\"><!></span></span> <span class=\"text svelte-1ucxs4t\"><span class=\"title svelte-1ucxs4t\"> </span> <!></span></button>"), P = {
	hash: "svelte-1ucxs4t",
	code: ".row.svelte-1ucxs4t {height:100%;display:flex;align-items:center;gap:9px;width:100%;padding:4px 6px 4px 4px;margin:0;border:0;border-radius:10px;background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer;transition:background .12s ease;}.row.svelte-1ucxs4t:hover:not(:disabled), .row.svelte-1ucxs4t:focus-visible {background:var(--w-hover);outline:none;}.row.svelte-1ucxs4t:focus-visible {box-shadow:0 0 0 2px var(--w-accent);}.row.svelte-1ucxs4t:disabled {cursor:default;}.art.svelte-1ucxs4t {position:relative;flex:none;display:grid;}.hover.svelte-1ucxs4t {position:absolute;inset:0;border-radius:8px;display:grid;place-items:center;color:#fff;background:rgba(4, 12, 9, .55);opacity:0;transition:opacity .12s ease;}.row.svelte-1ucxs4t:hover:not(:disabled) .hover:where(.svelte-1ucxs4t), .row.svelte-1ucxs4t:focus-visible .hover:where(.svelte-1ucxs4t), .row.playing.svelte-1ucxs4t .hover:where(.svelte-1ucxs4t) {opacity:1;}.row.playing.svelte-1ucxs4t .hover:where(.svelte-1ucxs4t) {color:var(--w-accent);background:rgba(4, 12, 9, .6);}.text.svelte-1ucxs4t {flex:1;display:flex;flex-direction:column;gap:2px;min-width:0;}.title.svelte-1ucxs4t {font-size:12px;font-weight:650;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.row.playing.svelte-1ucxs4t .title:where(.svelte-1ucxs4t) {color:var(--w-accent);}.meta.svelte-1ucxs4t {display:flex;align-items:center;gap:6px;font-size:10.5px;color:var(--w-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.bar.svelte-1ucxs4t {flex:0 0 34px;height:3px;border-radius:2px;background:var(--w-faint);overflow:hidden;}.bar.svelte-1ucxs4t span:where(.svelte-1ucxs4t) {display:block;height:100%;background:var(--w-accent);}"
};
function F(e, n) {
	h(n, !0), c(e, P);
	let o = C(n, "pct", 3, null), u = C(n, "playing", 3, !1), p = C(n, "disabled", 3, !1);
	var g = N();
	let S;
	var w = y(g), O = y(w);
	b(O, {
		get hue() {
			return n.hue;
		},
		get art() {
			return n.art;
		},
		get mark() {
			return n.mark;
		},
		size: 34,
		radius: 8,
		font: 10
	});
	var k = v(O, 2), A = y(k), F = (e) => {
		D(e, {});
	}, I = (e) => {
		E(e, {
			get d() {
				return T.play;
			},
			size: 13
		});
	};
	i(A, (e) => {
		u() ? e(F) : e(I, -1);
	}), _(k), _(w);
	var L = v(w, 2), R = y(L), z = f(R, !0), B = v(R, 2), V = (e) => {
		var t = j(), i = y(t), a = y(i);
		let c;
		_(i);
		var u = v(i, 1, !0);
		_(t), x(() => {
			c = r(a, "", c, { width: `${o() ?? ""}%` }), l(u, n.meta);
		}), s(e, t);
	}, H = (e) => {
		var t = M(), r = f(t, !0);
		x(() => l(r, n.meta)), s(e, t);
	};
	i(B, (e) => {
		o() === null ? e(H, -1) : e(V);
	}), _(L), _(g), x(() => {
		S = a(g, 1, "row svelte-1ucxs4t", null, S, { playing: u() }), g.disabled = p(), t(g, "aria-label", `${u() ? "Playing" : "Play"} ${n.title ?? ""}`), t(g, "title", n.title), l(z, n.title);
	}), d("click", g, function(...e) {
		n.onplay?.apply(this, e);
	}), s(e, g), m();
}
u(["click"]);
//#endregion
export { A as n, F as t };
