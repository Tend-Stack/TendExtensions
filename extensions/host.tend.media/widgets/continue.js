import { $ as e, B as t, C as n, H as r, K as i, a, dt as o, ft as s, ht as c, it as l, q as u, ut as d } from "../chunks/Cover-CFUQKa8h.js";
import { i as f, r as p, t as m } from "../chunks/model.svelte-A0MofO8E.js";
import { t as h } from "../chunks/Hint-DzWqDMB2.js";
import { n as g, t as _ } from "../chunks/Row-DThy_A33.js";
//#region src/widgets/ContinueWidget.svelte
function v(f, v) {
	s(v, !0);
	let y = new m(v.host);
	n(() => y.start());
	let b = d(() => y.size === "wide"), x = d(() => y.continuing);
	p(f, {
		get size() {
			return y.size;
		},
		label: "Continue listening",
		children: (n, o) => {
			var s = u(), f = l(s), p = (e) => {
				h(e, { text: "" });
			}, m = (e) => {
				h(e, {
					text: "Start an episode or an audiobook and pick it up here, right where you left off.",
					action: "Open TEND Media",
					onaction: () => y.open()
				});
			}, v = (n) => {
				g(n, {
					get wide() {
						return e(b);
					},
					children: (n, r = c) => {
						var o = u(), s = l(o);
						t(s, 17, () => e(x).slice(0, r()), (e) => e.item.id, (t, n) => {
							{
								let r = d(() => e(n).left ? `${a(e(n).left)} left` : e(n).item.sub), i = d(() => y.playing(e(n).item)), o = d(() => !y.canControl && !y.preview);
								_(t, {
									get hue() {
										return e(n).item.hue;
									},
									get mark() {
										return e(n).item.mark;
									},
									get art() {
										return e(n).item.art;
									},
									get title() {
										return e(n).item.title;
									},
									get meta() {
										return e(r);
									},
									get pct() {
										return e(n).pct;
									},
									get playing() {
										return e(i);
									},
									get disabled() {
										return e(o);
									},
									onplay: () => y.send({
										type: "play-item",
										id: e(n).item.id
									})
								});
							}
						}), i(n, o);
					},
					$$slots: { default: !0 }
				});
			};
			r(f, (t) => {
				y.ready ? e(x).length ? t(v, -1) : t(m, 1) : t(p);
			}), i(n, s);
		},
		$$slots: { default: !0 }
	}), o();
}
//#endregion
//#region src/widgets/continue.ts
var y = f(v);
//#endregion
export { y as default };
