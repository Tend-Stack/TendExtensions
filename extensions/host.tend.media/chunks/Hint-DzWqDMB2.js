import { H as e, J as t, K as n, R as r, W as i, X as a, Z as o, at as s, mt as c, ot as l, rt as u, tt as d, w as f } from "./Cover-CFUQKa8h.js";
//#region src/widgets/Hint.svelte
var p = t("<button class=\"svelte-o1ksdo\"> </button>"), m = t("<div class=\"hint svelte-o1ksdo\"><span> </span> <!></div>"), h = {
	hash: "svelte-o1ksdo",
	code: ".hint.svelte-o1ksdo {flex:1;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;gap:8px;font-size:11.5px;color:var(--w-muted);}button.svelte-o1ksdo {height:28px;padding:0 12px;border-radius:14px;border:1px solid var(--w-faint);background:transparent;color:var(--w-fg);font:inherit;font-size:11.5px;font-weight:600;cursor:pointer;}button.svelte-o1ksdo:hover {border-color:var(--w-accent);color:var(--w-accent);}button.svelte-o1ksdo:focus-visible {outline:2px solid var(--w-accent);outline-offset:2px;}"
};
function g(t, a) {
	r(t, h);
	let g = f(a, "action", 3, "");
	var _ = m(), v = u(_), y = s(v, !0), b = l(v, 2), x = (e) => {
		var t = p(), r = s(t, !0);
		d(() => i(r, g())), o("click", t, function(...e) {
			a.onaction?.apply(this, e);
		}), n(e, t);
	};
	e(b, (e) => {
		g() && a.onaction && e(x);
	}), c(_), d(() => i(y, a.text)), n(t, _);
}
a(["click"]);
//#endregion
export { g as t };
