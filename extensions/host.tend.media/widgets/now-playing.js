import { $ as e, A as t, C as n, F as r, H as i, I as a, J as o, K as s, R as c, W as l, X as u, Z as d, at as f, dt as p, f as m, ft as h, h as g, it as _, mt as v, ot as y, rt as b, t as ee, tt as x, ut as S } from "../chunks/Cover-CFUQKa8h.js";
import { n as C, t as w } from "../chunks/Icon-CkCATa2J.js";
import { i as T, n as te, r as E, t as D } from "../chunks/model.svelte-A0MofO8E.js";
//#region src/widgets/NowPlayingWidget.svelte
var O = o("<div class=\"glow svelte-zzopkn\" aria-hidden=\"true\"></div>"), k = o("<div class=\"empty svelte-zzopkn\"></div>"), A = o("<div class=\"empty svelte-zzopkn\"><b class=\"svelte-zzopkn\">Nothing playing</b> <span class=\"svelte-zzopkn\">Radio, podcasts and audiobooks from OndaCast.</span> <button class=\"open svelte-zzopkn\">Open Tend Player</button></div>"), j = o("<span class=\"live svelte-zzopkn\">● Live</span>"), M = o("<span> </span>"), ne = o("<span class=\"eqw svelte-zzopkn\"><!></span>"), re = o("<div class=\"line svelte-zzopkn\"> </div>"), ie = o("<div class=\"sub svelte-zzopkn\"> </div>"), ae = o("<div class=\"bar svelte-zzopkn\" aria-hidden=\"true\"><span class=\"svelte-zzopkn\"></span></div>"), oe = o("<span class=\"spacer svelte-zzopkn\"></span>"), N = o("<button class=\"ic svelte-zzopkn\" aria-label=\"Previous\"><!></button>"), se = o("<button class=\"ic svelte-zzopkn\" aria-label=\"Next\"><!></button>"), P = o("<div><button class=\"art svelte-zzopkn\" aria-label=\"Open Tend Player\" title=\"Open Tend Player\"><!></button> <div class=\"info svelte-zzopkn\"><div class=\"kind svelte-zzopkn\"><!> <!></div> <div class=\"source svelte-zzopkn\"> </div> <!> <!></div> <div class=\"foot svelte-zzopkn\"><!> <div class=\"ctrls svelte-zzopkn\"><!> <button class=\"pp svelte-zzopkn\"><!></button> <!></div></div></div>"), F = o("<!> <!>", 1), I = {
	hash: "svelte-zzopkn",
	code: ".glow.svelte-zzopkn {position:absolute;inset:-30%;background-size:cover;background-position:center;filter:blur(28px) saturate(1.3);opacity:.16;pointer-events:none;}.np.svelte-zzopkn {position:relative;flex:1;min-height:0;display:grid;grid-template-columns:auto 1fr;grid-template-rows:1fr auto;gap:8px 11px;align-items:center;}.np.wide.svelte-zzopkn {gap:6px 16px;}.np.wide.svelte-zzopkn .art:where(.svelte-zzopkn) {grid-row:1 / span 2;align-self:center;}.np.svelte-zzopkn .info:where(.svelte-zzopkn) {padding-right:26px;}.np.svelte-zzopkn:not(.wide) .foot:where(.svelte-zzopkn) {grid-column:1 / -1;}.art.svelte-zzopkn {padding:0;border:0;background:none;cursor:pointer;border-radius:12px;flex:none;box-shadow:0 6px 18px rgba(0, 0, 0, .28);}.art.svelte-zzopkn:focus-visible, button.svelte-zzopkn:focus-visible {outline:2px solid var(--w-accent);outline-offset:2px;}.info.svelte-zzopkn {flex:1;display:flex;flex-direction:column;justify-content:center;gap:2px;min-width:0;}.kind.svelte-zzopkn {display:flex;align-items:center;gap:6px;font-size:9.5px;font-weight:750;letter-spacing:.07em;text-transform:uppercase;color:var(--w-muted);}.live.svelte-zzopkn {color:var(--w-live);}.eqw.svelte-zzopkn {color:var(--w-accent);display:inline-flex;}.source.svelte-zzopkn {font-size:13px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.wide.svelte-zzopkn .source:where(.svelte-zzopkn) {font-size:15px;}.line.svelte-zzopkn {font-size:11.5px;color:var(--w-muted);display:-webkit-box;-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}.wide.svelte-zzopkn .line:where(.svelte-zzopkn) {font-size:12.5px;color:color-mix(in srgb, var(--w-fg) 78%, transparent);}.sub.svelte-zzopkn {font-size:11px;color:var(--w-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.foot.svelte-zzopkn {display:flex;align-items:center;gap:10px;}.bar.svelte-zzopkn {flex:1;height:3px;border-radius:2px;background:var(--w-faint);overflow:hidden;}.bar.svelte-zzopkn span:where(.svelte-zzopkn) {display:block;height:100%;background:var(--w-accent);border-radius:2px;}.spacer.svelte-zzopkn {flex:1;}.ctrls.svelte-zzopkn {display:flex;align-items:center;gap:4px;flex:none;}.pp.svelte-zzopkn {width:34px;height:34px;border-radius:50%;border:0;display:grid;place-items:center;background:var(--w-accent);color:var(--w-on-accent);cursor:pointer;box-shadow:0 4px 12px color-mix(in srgb, var(--w-accent) 35%, transparent);transition:transform .12s ease;}.pp.svelte-zzopkn:hover:not(:disabled) {transform:scale(1.06);}.ic.svelte-zzopkn {width:30px;height:30px;border-radius:50%;border:0;display:grid;place-items:center;background:transparent;color:var(--w-fg);cursor:pointer;}.ic.svelte-zzopkn:hover:not(:disabled) {background:var(--w-hover);}button.svelte-zzopkn:disabled {opacity:.45;cursor:default;}.empty.svelte-zzopkn {position:relative;flex:1;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;gap:4px;padding-right:26px;}.empty.svelte-zzopkn b:where(.svelte-zzopkn) {font-size:13px;}.empty.svelte-zzopkn span:where(.svelte-zzopkn) {font-size:11px;color:var(--w-muted);}.open.svelte-zzopkn {margin-top:6px;height:28px;padding:0 12px;border-radius:14px;border:1px solid var(--w-faint);background:transparent;color:var(--w-fg);font-size:11.5px;font-weight:600;cursor:pointer;}.open.svelte-zzopkn:hover:not(:disabled) {border-color:var(--w-accent);color:var(--w-accent);}"
};
function L(o, u) {
	h(u, !0), c(o, I);
	let T = new D(u.host);
	n(() => T.start());
	let L = S(() => T.now), R = S(() => e(L) ? null : T.last), ce = {
		radio: "Live radio",
		podcast: "Podcast",
		book: "Audiobook"
	}, z = S(() => e(L) ? e(L).kind : e(R) ? e(R).type : null), B = S(() => e(L) ? e(L).source || e(L).title : e(R) ? e(R).type === "podcast" ? e(R).sub : e(R).title : ""), V = S(() => e(L) ? e(L).title === e(B) ? "" : e(L).title : e(R) ? e(R).type === "podcast" ? e(R).title : e(R).sub : ""), H = S(() => e(L)?.subtitle ?? ""), U = S(() => e(L) ? e(L).artwork || e(L).fallbackArtwork || void 0 : e(R)?.art), W = S(() => e(R)?.hue ?? m(e(B) || "tend")), le = S(() => e(R)?.mark ?? g(e(B) || "Tend")), G = S(() => e(L)?.status === "playing" || e(L)?.status === "loading"), K = S(() => e(L) ? e(L).live : e(R)?.type === "radio"), q = S(() => e(L) ? e(L).progress : null), J = S(() => T.size === "wide");
	function ue() {
		e(L) ? T.send({ type: "toggle" }) : e(R) ? T.send({
			type: "play-item",
			id: e(R).id
		}) : T.open();
	}
	E(o, {
		get size() {
			return T.size;
		},
		children: (n, o) => {
			var c = F(), u = _(c), p = (t) => {
				var n = O();
				let i;
				x(() => i = r(n, "", i, { "background-image": `url('${e(U) ?? ""}')` })), s(t, n);
			};
			i(u, (t) => {
				e(U) && t(p);
			});
			var m = y(u, 2), h = (e) => {
				var t = k();
				s(e, t);
			}, g = (e) => {
				var t = A(), n = y(b(t), 4);
				v(t), x(() => n.disabled = T.preview), d("click", n, () => T.open()), s(e, t);
			}, E = (n) => {
				var o = P();
				let c;
				var u = b(o), p = b(u);
				{
					let t = S(() => e(J) ? 112 : 52), n = S(() => e(J) ? 14 : 10), r = S(() => e(J) ? 22 : 13);
					ee(p, {
						get hue() {
							return e(W);
						},
						get art() {
							return e(U);
						},
						get mark() {
							return e(le);
						},
						get size() {
							return e(t);
						},
						get radius() {
							return e(n);
						},
						get font() {
							return e(r);
						}
					});
				}
				v(u);
				var m = y(u, 2), h = b(m), g = b(h), _ = (e) => {
					var t = j();
					s(e, t);
				}, E = (t) => {
					var n = M(), r = f(n, !0);
					x(() => l(r, e(L) ? ce[e(z)] : "Continue")), s(t, n);
				};
				i(g, (t) => {
					e(K) && e(L) ? t(_) : e(z) && t(E, 1);
				});
				var D = y(g, 2), O = (t) => {
					var n = ne(), r = b(n);
					{
						let t = S(() => e(L)?.status === "playing");
						te(r, { get on() {
							return e(t);
						} });
					}
					v(n), s(t, n);
				};
				i(D, (t) => {
					e(G) && t(O);
				}), v(h);
				var k = y(h, 2), A = f(k, !0), F = y(k, 2), I = (n) => {
					var r = re(), i = f(r, !0);
					x(() => {
						t(r, "title", e(V)), l(i, e(V));
					}), s(n, r);
				};
				i(F, (t) => {
					e(V) && t(I);
				});
				var de = y(F, 2), fe = (t) => {
					var n = ie(), r = f(n, !0);
					x(() => l(r, e(H))), s(t, n);
				};
				i(de, (t) => {
					e(J) && e(H) && t(fe);
				}), v(m);
				var Y = y(m, 2), X = b(Y), pe = (t) => {
					var n = ae(), i = b(n);
					let a;
					v(n), x((e) => a = r(i, "", a, { width: e }), [() => `${Math.round(e(q) * 100)}%`]), s(t, n);
				}, me = (e) => {
					var t = oe();
					s(e, t);
				};
				i(X, (t) => {
					e(q) === null ? t(me, -1) : t(pe);
				});
				var Z = y(X, 2), Q = b(Z), he = (e) => {
					var t = N(), n = b(t);
					w(n, {
						get d() {
							return C.prev;
						},
						size: 15
					}), v(t), x(() => t.disabled = !T.canControl && !T.preview), d("click", t, () => T.send({ type: "previous" })), s(e, t);
				};
				i(Q, (t) => {
					e(J) && e(L) && !e(L).live && t(he);
				});
				var $ = y(Q, 2), ge = b($);
				{
					let t = S(() => e(G) ? e(K) ? C.stop : C.pause : C.play);
					w(ge, {
						get d() {
							return e(t);
						},
						size: 16
					});
				}
				v($);
				var _e = y($, 2), ve = (e) => {
					var t = se(), n = b(t);
					w(n, {
						get d() {
							return C.next;
						},
						size: 15
					}), v(t), x(() => t.disabled = !T.canControl && !T.preview), d("click", t, () => T.send({ type: "next" })), s(e, t);
				};
				i(_e, (t) => {
					e(L) && t(ve);
				}), v(Z), v(Y), v(o), x(() => {
					c = a(o, 1, "np svelte-zzopkn", null, c, { wide: e(J) }), t(k, "title", e(B)), l(A, e(B)), $.disabled = !T.canControl && !T.preview && !!(e(L) || e(R)), t($, "aria-label", e(G) ? e(K) ? "Stop" : "Pause" : e(L) ? "Play" : `Resume ${e(B)}`);
				}), d("click", u, () => T.open()), d("click", $, ue), s(n, o);
			};
			i(m, (t) => {
				T.ready ? e(z) ? t(E, -1) : t(g, 1) : t(h);
			}), s(n, c);
		},
		$$slots: { default: !0 }
	}), p();
}
u(["click"]);
//#endregion
//#region src/widgets/now-playing.ts
var R = T(L);
//#endregion
export { R as default };
