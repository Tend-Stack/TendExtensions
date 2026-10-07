import { $ as e, A as t, B as n, C as r, E as i, H as a, I as o, J as s, K as c, R as l, W as u, X as d, Z as f, at as p, ct as m, dt as h, ft as g, it as _, lt as v, mt as y, ot as b, q as x, rt as S, t as C, tt as w, ut as T } from "../chunks/Cover-CFUQKa8h.js";
import { i as E, n as D, r as O, t as k } from "../chunks/model.svelte-A0MofO8E.js";
import { t as A } from "../chunks/Hint-DzWqDMB2.js";
//#region src/widgets/StationsWidget.svelte
var j = s("<span class=\"live svelte-1qvohh8\" aria-hidden=\"true\"><!></span>"), M = s("<button><span class=\"logo svelte-1qvohh8\"><!> <!></span> <span class=\"name svelte-1qvohh8\"> </span></button>"), N = s("<div></div>"), P = {
	hash: "svelte-1qvohh8",
	code: ".grid.svelte-1qvohh8 {flex:1;min-height:0;display:grid;grid-template-columns:repeat(3, minmax(0, 1fr));grid-auto-rows:66px;gap:6px 4px;overflow:clip;align-content:start;}.grid.wide.svelte-1qvohh8 {grid-template-columns:repeat(6, minmax(0, 1fr));}.tile.svelte-1qvohh8 {display:flex;flex-direction:column;align-items:center;gap:4px;padding:3px 2px;border:0;border-radius:10px;background:transparent;color:inherit;font:inherit;cursor:pointer;transition:background .12s ease;}.tile.svelte-1qvohh8:hover:not(:disabled), .tile.svelte-1qvohh8:focus-visible {background:var(--w-hover);outline:none;}.tile.svelte-1qvohh8:focus-visible {box-shadow:0 0 0 2px var(--w-accent);}.tile.svelte-1qvohh8:disabled {cursor:default;}.logo.svelte-1qvohh8 {position:relative;display:grid;border-radius:11px;transition:transform .12s ease;}.tile.svelte-1qvohh8:hover:not(:disabled) .logo:where(.svelte-1qvohh8) {transform:translateY(-1px);}.tile.on.svelte-1qvohh8 .logo:where(.svelte-1qvohh8) {box-shadow:0 0 0 2px var(--w-accent), 0 4px 14px color-mix(in srgb, var(--w-accent) 40%, transparent);}.live.svelte-1qvohh8 {position:absolute;inset:0;border-radius:11px;display:grid;place-items:center;color:var(--w-accent);background:rgba(4, 12, 9, .55);}.name.svelte-1qvohh8 {max-width:100%;font-size:9.5px;font-weight:600;color:var(--w-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.tile.on.svelte-1qvohh8 .name:where(.svelte-1qvohh8) {color:var(--w-accent);}"
};
function F(s, d) {
	g(d, !0), l(s, P);
	let E = new k(d.host);
	r(() => E.start());
	let F = T(() => E.size === "wide"), I = T(() => E.stations), L = v(0), R = T(() => Math.max(1, Math.floor((e(L) + 6) / 72))), z = T(() => e(I).list.slice(0, e(R) * (e(F) ? 6 : 3)));
	{
		let r = T(() => e(I).favorites ? "Favorite stations" : "Recent stations");
		O(s, {
			get size() {
				return E.size;
			},
			get label() {
				return e(r);
			},
			children: (r, s) => {
				var l = x(), d = _(l), h = (e) => {
					A(e, { text: "" });
				}, g = (e) => {
					A(e, {
						text: "Tap ♥ on a station in Tend Player to keep it one tap away.",
						action: "Find stations",
						onaction: () => E.open()
					});
				}, v = (r) => {
					var s = N();
					let l;
					n(s, 21, () => e(z), (e) => e.id, (n, r) => {
						let i = T(() => E.playing(e(r)));
						var s = M();
						let l;
						var d = S(s), m = S(d);
						C(m, {
							get hue() {
								return e(r).hue;
							},
							get art() {
								return e(r).art;
							},
							get mark() {
								return e(r).mark;
							},
							size: 42,
							radius: 11,
							font: 11
						});
						var h = b(m, 2), g = (e) => {
							var t = j(), n = S(t);
							D(n, {}), y(t), c(e, t);
						};
						a(h, (t) => {
							e(i) && t(g);
						}), y(d);
						var _ = b(d, 2), v = p(_, !0);
						y(s), w(() => {
							l = o(s, 1, "tile svelte-1qvohh8", null, l, { on: e(i) }), s.disabled = !E.canControl && !E.preview, t(s, "aria-label", `${e(i) ? "Stop" : "Play"} ${e(r).title ?? ""}`), t(s, "title", e(r).title), u(v, e(r).title);
						}), f("click", s, () => E.send(e(i) ? { type: "toggle" } : {
							type: "play-item",
							id: e(r).id
						})), c(n, s);
					}), y(s), w(() => l = o(s, 1, "grid svelte-1qvohh8", null, l, { wide: e(F) })), i(s, "clientHeight", (e) => m(L, e)), c(r, s);
				};
				a(d, (t) => {
					E.ready ? e(I).list.length ? t(v, -1) : t(g, 1) : t(h);
				}), c(r, l);
			},
			$$slots: { default: !0 }
		});
	}
	h();
}
d(["click"]);
//#endregion
//#region src/widgets/stations.ts
var I = E(F);
//#endregion
export { I as default };
