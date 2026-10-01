import { $ as e, B as t, C as n, H as r, K as i, d as a, dt as o, ft as s, ht as c, it as l, q as u, ut as d } from "../chunks/Cover-CFUQKa8h.js";
import { i as f, r as p, t as m } from "../chunks/model.svelte-A0MofO8E.js";
import { t as h } from "../chunks/Hint-DzWqDMB2.js";
import { n as g, t as _ } from "../chunks/Row-CbejDMJm.js";
//#region src/widgets/NewEpisodesWidget.svelte
function v(f, v) {
	s(v, !0);
	let y = new m(v.host, !0);
	n(() => y.start());
	let b = d(() => y.size === "wide"), x = d(() => y.fresh.map((e) => e.id));
	p(f, {
		get size() {
			return y.size;
		},
		label: "New from your shows",
		get count() {
			return y.fresh.length;
		},
		children: (n, o) => {
			var s = u(), f = l(s), p = (e) => {
				h(e, { text: "Checking your shows…" });
			}, m = (e) => {
				h(e, {
					text: "Follow shows in TEND Media and their new episodes land here.",
					action: "Find shows",
					onaction: () => y.open()
				});
			}, v = (e) => {
				h(e, { text: "OndaCast could not be reached. Trying again soon." });
			}, S = (e) => {
				h(e, { text: "You're all caught up." });
			}, C = (n) => {
				g(n, {
					get wide() {
						return e(b);
					},
					children: (n, r = c) => {
						var o = u(), s = l(o);
						t(s, 17, () => y.fresh.slice(0, r()), (e) => e.id, (t, n) => {
							{
								let r = d(() => [e(n).sub, a(e(n).date)].filter(Boolean).join(" · ")), i = d(() => y.playing(e(n))), o = d(() => !y.canControl && !y.preview);
								_(t, {
									get hue() {
										return e(n).hue;
									},
									get mark() {
										return e(n).mark;
									},
									get art() {
										return e(n).art;
									},
									get title() {
										return e(n).title;
									},
									get meta() {
										return e(r);
									},
									get playing() {
										return e(i);
									},
									get disabled() {
										return e(o);
									},
									onplay: () => y.send({
										type: "play-episode",
										show: e(n).show,
										id: e(n).id,
										list: e(x)
									})
								});
							}
						}), i(n, o);
					},
					$$slots: { default: !0 }
				});
			};
			r(f, (e) => {
				!y.ready || y.freshStatus === "loading" && !y.fresh.length ? e(p) : y.followed.length ? y.freshStatus === "error" && !y.fresh.length ? e(v, 2) : y.fresh.length ? e(C, -1) : e(S, 3) : e(m, 1);
			}), i(n, s);
		},
		$$slots: { default: !0 }
	}), o();
}
//#endregion
//#region src/widgets/new-episodes.ts
var y = f(v);
//#endregion
export { y as default };
