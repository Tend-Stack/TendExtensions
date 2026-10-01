//#region node_modules/svelte/src/internal/shared/utils.js
var e = Array.isArray, t = Array.prototype.indexOf, n = Array.prototype.includes, r = Array.from, i = Object.defineProperty, a = Object.getOwnPropertyDescriptor, o = Object.getOwnPropertyDescriptors, s = Object.prototype, c = Array.prototype, l = Object.getPrototypeOf, u = Object.isExtensible, d = () => {};
function f(e) {
	for (var t = 0; t < e.length; t++) e[t]();
}
function p() {
	var e, t;
	return {
		promise: new Promise((n, r) => {
			e = n, t = r;
		}),
		resolve: e,
		reject: t
	};
}
function m(e, t) {
	if (Array.isArray(e)) return e;
	if (t === void 0 || !(Symbol.iterator in e)) return Array.from(e);
	let n = [];
	for (let r of e) if (n.push(r), n.length === t) break;
	return n;
}
var h = 1024, g = 2048, _ = 4096, v = 8192, y = 16384, b = 32768, x = 1 << 25, S = 65536, C = 1 << 19, w = 1 << 20, T = 1 << 25, E = 65536, ee = 1 << 21, te = 1 << 22, ne = 1 << 23, re = Symbol("$state"), ie = Symbol("component"), ae = Symbol("legacy props"), oe = Symbol(""), se = Symbol("attributes"), ce = Symbol("class"), le = Symbol("style"), ue = Symbol("text"), de = Symbol("form reset"), fe = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), pe = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml"), me = {}, he = Symbol("uninitialized"), ge = "http://www.w3.org/1999/xhtml";
function _e() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function ve(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function ye() {
	console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function be() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/hydration.js
var D = !1;
function xe(e) {
	D = e;
}
var O;
function Se(e) {
	if (e === null) throw ve(), me;
	return O = e;
}
function Ce() {
	return Se(/* @__PURE__ */ rn(O));
}
function k(e) {
	if (D) {
		if (/* @__PURE__ */ rn(O) !== null) throw ve(), me;
		O = e;
	}
}
function A(e = 1) {
	if (D) {
		for (var t = e, n = O; t--;) n = /* @__PURE__ */ rn(n);
		O = n;
	}
}
function we(e = !0) {
	for (var t = 0, n = O;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ rn(n);
		e && n.remove(), n = i;
	}
}
function Te(e) {
	if (!e || e.nodeType !== 8) throw ve(), me;
	return e.data;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/equality.js
function Ee(e) {
	return e === this.v;
}
function De(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function Oe(e) {
	return !De(e, this.v);
}
function ke(e) {
	throw Error("https://svelte.dev/e/lifecycle_outside_component");
}
//#endregion
//#region node_modules/svelte/src/internal/client/errors.js
function Ae() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function je(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function Me(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function Ne() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function Pe(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function Fe() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Ie(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function Le() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Re() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function ze() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Be() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
//#endregion
//#region node_modules/svelte/src/internal/client/context.js
var Ve = null;
function He(e) {
	Ve = e;
}
function Ue(e, t = !1, n) {
	Ve = {
		p: Ve,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: H,
		l: null
	};
}
function We(e) {
	var t = Ve, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) _n(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, Ve = t.p, Ge(e);
}
function Ge(e = {}) {
	return i(e, ie, { value: !0 }), e;
}
function Ke() {
	return !0;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
var qe = [];
function Je() {
	var e = qe;
	qe = [], f(e);
}
function Ye(e) {
	if (qe.length === 0 && !Tt) {
		var t = qe;
		queueMicrotask(() => {
			t === qe && Je();
		});
	}
	qe.push(e);
}
function Xe() {
	for (; qe.length > 0;) Je();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/status.js
var Ze = ~(g | _ | h);
function Qe(e, t) {
	e.f = e.f & Ze | t;
}
function $e(e) {
	e.f & 512 || e.deps === null ? Qe(e, h) : Qe(e, _);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function et(e) {
	if (e !== null) for (let t of e) t.f & 2 && t.f & 65536 && (t.f ^= E, et(t.deps));
}
function tt(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), et(e.deps), Qe(e, h);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/store.js
var nt = !1;
function rt(e) {
	var t = nt;
	try {
		return nt = !1, [e(), nt];
	} finally {
		nt = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/misc.js
var it = !1;
function at() {
	it || (it = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[de]?.();
		});
	}, { capture: !0 }));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function ot(e) {
	var t = V, n = H;
	Bn(null), Vn(null);
	try {
		return e();
	} finally {
		Bn(t), Vn(n);
	}
}
function st(e, t, n, r = n) {
	e.addEventListener(t, () => ot(n));
	let i = e[de];
	e[de] = i ? () => {
		i(), r(!0);
	} : () => r(!0), at();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/async.js
function ct(e, t, n, r) {
	let i = Ke() ? ft : ht;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = H, c = lt(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				un(e, s);
			}
			ut();
		}
	}
	var d = dt();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ mt(e))).then(u).catch((e) => un(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), ut();
	}) : f();
}
function lt() {
	var e = H, t = V, n = Ve, r = M;
	return function(i = !0) {
		Vn(e), Bn(t), He(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function ut(e = !0) {
	Vn(null), Bn(null), He(null), e && M?.deactivate();
}
function dt() {
	var e = H, t = e.b, n = M, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function ft(e) {
	var t = 2 | g;
	return H !== null && (H.f |= C), {
		ctx: Ve,
		deps: null,
		effects: null,
		equals: Ee,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: he,
		wv: 0,
		parent: H,
		ac: null
	};
}
var pt = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function mt(e, t, n) {
	let r = H;
	r === null && Ae();
	var i = void 0, a = Ht(he), o = !V, s = /* @__PURE__ */ new Set();
	return bn(() => {
		var t = H, n = p();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== fe && n.reject(e);
			}).finally(ut);
		} catch (e) {
			n.reject(e), ut();
		}
		var c = M;
		if (o) {
			if (t.f & 32768) var l = dt();
			if (r.b?.is_rendered()) c.async_deriveds.get(t)?.reject(pt);
			else for (let e of s.values()) e.reject(pt);
			s.add(n), c.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), s.delete(n), t !== pt && (c.activate(), t ? (a.f |= ne, Wt(a, t)) : (a.f & 8388608 && (a.f ^= ne), Wt(a, e)), c.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), hn(() => {
		for (let e of s) e.reject(pt);
	}), new Promise((e) => {
		function t(n) {
			function r() {
				n === i ? e(a) : t(i);
			}
			n.then(r, r);
		}
		t(i);
	});
}
/*#__NO_SIDE_EFFECTS__*/
function j(e) {
	let t = /* @__PURE__ */ ft(e);
	return Un(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function ht(e) {
	let t = /* @__PURE__ */ ft(e);
	return t.equals = Oe, t;
}
function gt(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) Dn(t[n]);
	}
}
function _t(e) {
	var t, n = H, r = e.parent;
	if (!Ln && r !== null && e.v !== he && r.f & 24576) return _e(), e.v;
	Vn(r);
	try {
		e.f &= ~E, gt(e), t = tr(e);
	} finally {
		Vn(n);
	}
	return t;
}
function vt(e) {
	var t = _t(e);
	if (!e.equals(t) && (e.wv = Qn(), (!M?.is_fork || e.deps === null) && (M === null ? e.v = t : (M.capture(e, t, !0), St?.capture(e, t, !0)), e.deps === null))) {
		Qe(e, h);
		return;
	}
	Ln || (Ct === null ? $e(e) : (mn() || M?.is_fork) && Ct.set(e, t));
}
function yt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && ot(() => {
		t.ac.abort(fe), t.ac = null;
	}), t.fn !== null && (t.teardown = d), ir(t, 0), Tn(t));
}
function bt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && ar(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var xt = null, M = null, St = null, Ct = null, wt = null, Tt = !1, Et = !1, Dt = null, Ot = null, kt = 0, At = 1, jt = class e {
	id = At++;
	#e = !1;
	linked = !0;
	#t = null;
	#n = null;
	async_deriveds = /* @__PURE__ */ new Map();
	current = /* @__PURE__ */ new Map();
	previous = /* @__PURE__ */ new Map();
	#r = /* @__PURE__ */ new Set();
	#i = /* @__PURE__ */ new Set();
	#a = 0;
	#o = /* @__PURE__ */ new Map();
	#s = null;
	#c = [];
	#l = [];
	#u = /* @__PURE__ */ new Set();
	#d = /* @__PURE__ */ new Set();
	#f = /* @__PURE__ */ new Map();
	#p = /* @__PURE__ */ new Set();
	is_fork = !1;
	#m = !1;
	constructor() {
		xt === null ? xt = this : (xt.#n = this, this.#t = xt), xt = this;
	}
	#h() {
		if (this.is_fork) return !0;
		for (let n of this.#o.keys()) {
			for (var e = n, t = !1; e.parent !== null;) {
				if (this.#f.has(e)) {
					t = !0;
					break;
				}
				e = e.parent;
			}
			if (!t) return !0;
		}
		return !1;
	}
	skip_effect(e) {
		this.#f.has(e) || this.#f.set(e, {
			d: [],
			m: []
		}), this.#p.delete(e);
	}
	unskip_effect(e, t = (e) => this.schedule(e)) {
		var n = this.#f.get(e);
		if (n) {
			this.#f.delete(e);
			for (var r of n.d) Qe(r, g), t(r);
			for (r of n.m) Qe(r, _), t(r);
		}
		this.#p.add(e);
	}
	#g() {
		this.#e = !0, kt++ > 1e3 && (this.#x(), Nt());
		for (let e of this.#u) this.#d.delete(e), Qe(e, g), this.schedule(e);
		for (let e of this.#d) Qe(e, _), this.schedule(e);
		let t = this.#c;
		this.#c = [], this.apply();
		var n = Dt = [], r = [], i = Ot = [];
		for (let e of t) try {
			this.#_(e, n, r);
		} catch (t) {
			throw Rt(e), this.#h() || this.discard(), t;
		}
		if (M = null, i.length > 0) {
			var a = e.ensure();
			for (let e of i) a.schedule(e);
		}
		if (Dt = null, Ot = null, this.#h()) {
			this.#b(r), this.#b(n);
			for (let [e, t] of this.#f) Lt(e, t);
			i.length > 0 && M.#g();
			return;
		}
		let o = this.#v();
		if (o) {
			this.#b(r), this.#b(n), o.#y(this);
			return;
		}
		this.#u.clear(), this.#d.clear();
		for (let e of this.#r) e(this);
		this.#r.clear(), St = this, Ft(r), Ft(n), St = null, this.#s?.resolve();
		var s = M;
		if (this.#a === 0 && (this.#c.length === 0 || s !== null) && this.#x(), this.#c.length > 0) {
			if (s !== null) {
				let e = s;
				e.#c.push(...this.#c.filter((t) => !e.#c.includes(t)));
			} else s = this;
		}
		s !== null && (Bt.clear(), s.#g());
	}
	#_(e, t, n) {
		e.f ^= h;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= h : i & 4 ? t.push(r) : $n(r) && (i & 16 && this.#d.add(r), ar(r));
				var o = r.first;
				if (o !== null) {
					r = o;
					continue;
				}
			}
			for (; r !== null;) {
				var s = r.next;
				if (s !== null) {
					r = s;
					break;
				}
				r = r.parent;
			}
		}
	}
	#v() {
		for (var e = this.#t; e !== null;) {
			if (!e.is_fork) {
				for (let [t, [, n]] of this.current) if (e.current.has(t) && !n) return e;
			}
			e = e.#t;
		}
		return null;
	}
	#y(e) {
		for (let [t, n] of e.current) !this.previous.has(t) && e.previous.has(t) && this.previous.set(t, e.previous.get(t)), this.current.set(t, n);
		for (let [t, n] of e.async_deriveds) {
			let e = this.async_deriveds.get(t);
			e && n.promise.then(e.resolve).catch(e.reject);
		}
		e.async_deriveds.clear(), this.transfer_effects(e.#u, e.#d);
		let t = (e) => {
			var n = e.reactions;
			if (n !== null && !(e.f & 2 && !(e.f & 6144))) for (let e of n) {
				var r = e.f;
				if (r & 2) t(e);
				else {
					var i = e;
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), Qe(i, g), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#x(), M = this, this.#g();
	}
	#b(e) {
		for (var t = 0; t < e.length; t += 1) tt(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== he && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), Ct?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		M = this;
	}
	deactivate() {
		M = null, Ct = null;
	}
	flush() {
		try {
			Et = !0, M = this, this.#g();
		} finally {
			kt = 0, wt = null, Dt = null, Ot = null, Et = !1, M = null, Ct = null, Bt.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(pt);
		this.#x(), this.#s?.resolve();
	}
	register_created_effect(e) {
		this.#l.push(e);
	}
	increment(e, t) {
		if (this.#a += 1, e) {
			let e = this.#o.get(t) ?? 0;
			this.#o.set(t, e + 1);
		}
	}
	decrement(e, t) {
		if (--this.#a, e) {
			let e = this.#o.get(t) ?? 0;
			e === 1 ? this.#o.delete(t) : this.#o.set(t, e - 1);
		}
		this.#m || (this.#m = !0, Ye(() => {
			this.#m = !1, this.linked && this.flush();
		}));
	}
	transfer_effects(e, t) {
		for (let t of e) this.#u.add(t);
		for (let e of t) this.#d.add(e);
		e.clear(), t.clear();
	}
	oncommit(e) {
		this.#r.add(e);
	}
	ondiscard(e) {
		this.#i.add(e);
	}
	settled() {
		return (this.#s ??= p()).promise;
	}
	static ensure() {
		if (M === null) {
			let t = M = new e();
			!Et && !Tt && Ye(() => {
				t.#e || t.flush();
			});
		}
		return M;
	}
	apply() {
		Ct = null;
	}
	schedule(e) {
		if (wt = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		for (var t = e; t.parent !== null;) {
			t = t.parent;
			var n = t.f;
			if (Dt !== null && t === H && (V === null || !(V.f & 2))) return;
			if (n & 96) {
				if (!(n & 1024)) return;
				t.f ^= h;
			}
		}
		this.#c.push(t);
	}
	#x() {
		if (this.linked) {
			var e = this.#t, t = this.#n;
			e === null || (e.#n = t), t === null ? xt = e : t.#t = e, this.linked = !1;
		}
	}
};
function Mt(e) {
	var t = Tt;
	Tt = !0;
	try {
		var n;
		for (e && (M !== null && !M.is_fork && M.flush(), n = e());;) {
			if (Xe(), M === null) return n;
			M.flush();
		}
	} finally {
		Tt = t;
	}
}
function Nt() {
	try {
		Fe();
	} catch (e) {
		un(e, wt);
	}
}
var Pt = null;
function Ft(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && $n(r) && (Pt = /* @__PURE__ */ new Set(), ar(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && kn(r), Pt?.size > 0)) {
				Bt.clear();
				for (let e of Pt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Pt.has(n) && (Pt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || ar(n);
					}
				}
				Pt.clear();
			}
		}
		Pt = null;
	}
}
function It(e) {
	M.schedule(e);
}
function Lt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), Qe(e, h);
		for (var n = e.first; n !== null;) Lt(n, t), n = n.next;
	}
}
function Rt(e) {
	Qe(e, h);
	for (var t = e.first; t !== null;) Rt(t), t = t.next;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
var zt = /* @__PURE__ */ new Set(), Bt = /* @__PURE__ */ new Map(), Vt = !1;
function Ht(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: Ee,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function N(e, t) {
	let n = Ht(e, t);
	return Un(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function Ut(e, t = !1, n = !0) {
	let r = Ht(e);
	return t || (r.equals = Oe), r;
}
function P(e, t, n = !1) {
	return V !== null && (!zn || V.f & 131072) && Ke() && V.f & 4325394 && (Hn === null || !Hn.has(e)) && ze(), Wt(e, n ? F(t) : t, Ot);
}
function Wt(e, t, n = null) {
	if (!e.equals(t)) {
		Ln ? Bt.set(e, t) : Bt.has(e) || Bt.set(e, e.v);
		var r = jt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && _t(t), Ct === null && $e(t);
		}
		e.wv = Qn(), qt(e, g, n), Ke() && H !== null && H.f & 1024 && !(H.f & 96) && (Kn === null ? qn([e]) : Kn.push(e)), !r.is_fork && zt.size > 0 && !Vt && Gt();
	}
	return t;
}
function Gt() {
	Vt = !1;
	for (let e of zt) {
		e.f & 1024 && Qe(e, _);
		let t;
		try {
			t = $n(e);
		} catch {
			t = !0;
		}
		t && ar(e);
	}
	zt.clear();
}
function Kt(e) {
	P(e, e.v + 1);
}
function qt(e, t, n) {
	var r = e.reactions;
	if (r !== null) for (var i = Ke(), a = r.length, o = 0; o < a; o++) {
		var s = r[o], c = s.f;
		if (i || s !== H) {
			var l = (c & g) === 0;
			if (l && Qe(s, t), c & 131072) zt.add(s);
			else if (c & 2) {
				var u = s;
				Ct?.delete(u), c & 65536 || (c & 512 && (H === null || !(H.f & 2097152)) && (s.f |= E), qt(u, _, n));
			} else if (l) {
				var d = s;
				c & 16 && Pt !== null && Pt.add(d), n === null ? It(d) : n.push(d);
			}
		}
	}
}
function F(t) {
	if (typeof t != "object" || !t || re in t || ie in t) return t;
	let n = l(t);
	if (n !== s && n !== c) return t;
	var r = /* @__PURE__ */ new Map(), i = e(t), o = /* @__PURE__ */ N(0), u = null, d = Xn, f = (e) => {
		if (Xn === d) return e();
		var t = V, n = Xn;
		Bn(null), Zn(d);
		var r = e();
		return Bn(t), Zn(n), r;
	};
	return i && r.set("length", /* @__PURE__ */ N(t.length, u)), new Proxy(t, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && Le();
			var i = r.get(t);
			return i === void 0 ? f(() => {
				var e = /* @__PURE__ */ N(n.value, u);
				return r.set(t, e), e;
			}) : P(i, n.value, !0), !0;
		},
		deleteProperty(e, t) {
			var n = r.get(t);
			if (n === void 0) {
				if (t in e) {
					let e = f(() => /* @__PURE__ */ N(he, u));
					r.set(t, e), Kt(o);
				}
			} else P(n, he), Kt(o);
			return !0;
		},
		get(e, n, i) {
			if (n === re) return t;
			var o = r.get(n), s = n in e;
			if (o === void 0 && (!s || a(e, n)?.writable) && (o = f(() => /* @__PURE__ */ N(F(s ? e[n] : he), u)), r.set(n, o)), o !== void 0) {
				var c = U(o);
				return c === he ? void 0 : c;
			}
			return Reflect.get(e, n, i);
		},
		getOwnPropertyDescriptor(e, t) {
			var n = Reflect.getOwnPropertyDescriptor(e, t);
			if (n && "value" in n) {
				var i = r.get(t);
				i && (n.value = U(i));
			} else if (n === void 0) {
				var a = r.get(t), o = a?.v;
				if (a !== void 0 && o !== he) return {
					enumerable: !0,
					configurable: !0,
					value: o,
					writable: !0
				};
			}
			return n;
		},
		has(e, t) {
			if (t === re) return !0;
			var n = r.get(t), i = n !== void 0 && n.v !== he || Reflect.has(e, t);
			return (n !== void 0 || H !== null && (!i || a(e, t)?.writable)) && (n === void 0 && (n = f(() => /* @__PURE__ */ N(i ? F(e[t]) : he, u)), r.set(t, n)), U(n) === he) ? !1 : i;
		},
		set(e, t, n, s) {
			var c = r.get(t), l = t in e;
			if (i && t === "length") for (var d = n; d < c.v; d += 1) {
				var p = r.get(d + "");
				p === void 0 ? d in e && (p = f(() => /* @__PURE__ */ N(he, u)), r.set(d + "", p)) : P(p, he);
			}
			if (c === void 0) (!l || a(e, t)?.writable) && (c = f(() => /* @__PURE__ */ N(void 0, u)), P(c, F(n)), r.set(t, c));
			else {
				l = c.v !== he;
				var m = f(() => F(n));
				P(c, m);
			}
			var h = Reflect.getOwnPropertyDescriptor(e, t);
			if (h?.set && h.set.call(s, n), !l) {
				if (i && typeof t == "string") {
					var g = r.get("length"), _ = Number(t);
					Number.isInteger(_) && _ >= g.v && P(g, _ + 1);
				}
				Kt(o);
			}
			return !0;
		},
		ownKeys(e) {
			U(o);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = r.get(e);
				return t === void 0 || t.v !== he;
			});
			for (var [n, i] of r) i.v !== he && !(n in e) && t.push(n);
			return t;
		},
		setPrototypeOf() {
			Re();
		}
	});
}
function Jt(e) {
	try {
		if (typeof e == "object" && e && re in e) return e[re];
	} catch {}
	return e;
}
function Yt(e, t) {
	return Object.is(Jt(e), Jt(t));
}
var Xt, Zt, Qt, $t;
function en() {
	if (Xt === void 0) {
		Xt = window, Zt = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		Qt = a(t, "firstChild").get, $t = a(t, "nextSibling").get, u(e) && (e[ce] = void 0, e[se] = null, e[le] = void 0, e.__e = void 0), u(n) && (n[ue] = void 0);
	}
}
function tn(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function nn(e) {
	return Qt.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function rn(e) {
	return $t.call(e);
}
function I(e, t) {
	if (!D) return /* @__PURE__ */ nn(e);
	var n = /* @__PURE__ */ nn(O);
	if (n === null) n = O.appendChild(tn());
	else if (t && n.nodeType !== 3) {
		var r = tn();
		return n?.before(r), Se(r), r;
	}
	return t && cn(n), Se(n), n;
}
function L(e, t = !1) {
	if (!D) {
		var n = /* @__PURE__ */ nn(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ rn(n) : n;
	}
	if (t) {
		if (O?.nodeType !== 3) {
			var r = tn();
			return O?.before(r), Se(r), r;
		}
		cn(O);
	}
	return O;
}
function R(e, t = !1) {
	if (!D) return /* @__PURE__ */ nn(e);
	var n = I(e, t);
	return k(e), n;
}
function z(e, t = 1, n = !1) {
	let r = D ? O : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ rn(r);
	if (!D) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = tn();
			return r === null ? i?.after(a) : r.before(a), Se(a), a;
		}
		cn(r);
	}
	return Se(r), r;
}
function an(e) {
	e.textContent = "";
}
function on() {
	return !1;
}
function sn(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function cn(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
function ln(e) {
	var t = H;
	if (t === null) return V.f |= ne, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	un(e, t);
}
function un(e, t) {
	if (!(t !== null && t.f & 16384)) {
		for (; t !== null;) {
			if (t.f & 128 && !(t.f & 33570816)) {
				if (!(t.f & 32768)) throw e;
				try {
					t.b.error(e);
					return;
				} catch (t) {
					e = t;
				}
			}
			t = t.parent;
		}
		throw e;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/effects.js
function dn(e) {
	H === null && (V === null && Pe(e), Ne()), Ln && Me(e);
}
function fn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function pn(e, t) {
	var n = H;
	n !== null && n.f & 8192 && (e |= v);
	var r = {
		ctx: Ve,
		deps: null,
		nodes: null,
		f: e | g | 512,
		first: null,
		fn: t,
		last: null,
		next: null,
		parent: n,
		b: n && n.b,
		prev: null,
		teardown: null,
		wv: 0,
		ac: null
	};
	M?.register_created_effect(r);
	var i = r;
	if (e & 4) Dt === null ? jt.ensure().schedule(r) : Dt.push(r);
	else if (t !== null) {
		try {
			ar(r);
		} catch (e) {
			throw Dn(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= S));
	}
	if (i !== null && (i.parent = n, n !== null && fn(i, n), V !== null && V.f & 2 && !(e & 64))) {
		var a = V;
		(a.effects ??= []).push(i);
	}
	return r;
}
function mn() {
	return V !== null && !zn;
}
function hn(e) {
	let t = pn(8, null);
	return Qe(t, h), t.teardown = e, t;
}
function gn(e) {
	dn("$effect");
	var t = H.f;
	if (!V && t & 32 && Ve !== null && !Ve.i) {
		var n = Ve;
		(n.e ??= []).push(e);
	} else return _n(e);
}
function _n(e) {
	return pn(4 | w, e);
}
function vn(e) {
	jt.ensure();
	let t = pn(64 | C, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? An(t, () => {
			Dn(t), n(void 0);
		}) : (Dn(t), n(void 0));
	});
}
function yn(e) {
	return pn(4, e);
}
function bn(e) {
	return pn(te | C, e);
}
function xn(e, t = 0) {
	return pn(8 | t, e);
}
function B(e, t = [], n = [], r = []) {
	ct(r, t, n, (t) => {
		pn(8, () => {
			e(...t.map(U));
		});
	});
}
function Sn(e, t = 0) {
	return pn(16 | t, e);
}
function Cn(e) {
	return pn(32 | C, e);
}
function wn(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = Ln, r = V;
		Rn(!0), Bn(null);
		try {
			t.call(null);
		} catch (t) {
			un(t, e.parent);
		} finally {
			Rn(n), Bn(r);
		}
	}
}
function Tn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && ot(() => {
			e.abort(fe);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : Dn(n, t), n = r;
	}
}
function En(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || Dn(t), t = n;
	}
}
function Dn(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (On(e.nodes.start, e.nodes.end), n = !0), e.f |= x, Tn(e, t && !n), ir(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	wn(e), e.f ^= x, e.f |= y;
	var i = e.parent;
	i !== null && i.first !== null && kn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function On(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ rn(e);
		e.remove(), e = n;
	}
}
function kn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function An(e, t, n = !0) {
	var r = [];
	e.f |= 256, jn(e, r, !0);
	var i = () => {
		n && Dn(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function jn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= v;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				jn(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Mn(e) {
	e.f &= -257, Nn(e, !0);
}
function Nn(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= v, e.f & 1024 || (Qe(e, g), jt.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			Nn(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function Pn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ rn(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var Fn = null, In = !1, Ln = !1;
function Rn(e) {
	Ln = e;
}
var V = null, zn = !1;
function Bn(e) {
	V = e;
}
var H = null;
function Vn(e) {
	H = e;
}
var Hn = null;
function Un(e) {
	V !== null && (Hn ??= /* @__PURE__ */ new Set()).add(e);
}
var Wn = null, Gn = 0, Kn = null;
function qn(e) {
	Kn = e;
}
var Jn = 1, Yn = 0, Xn = Yn;
function Zn(e) {
	Xn = e;
}
function Qn() {
	return ++Jn;
}
function $n(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 2 && (e.f &= ~E), t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if ($n(a) && vt(a), a.wv > e.wv) return !0;
		}
		t & 512 && Ct === null && Qe(e, h);
	}
	return !1;
}
function er(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(Hn !== null && Hn.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? er(a, t, !1) : t === a && (n ? Qe(a, g) : a.f & 1024 && Qe(a, _), It(a));
	}
}
function tr(e) {
	var t = Wn, n = Gn, r = Kn, i = V, a = Hn, o = Ve, s = zn, c = Xn, l = e.f;
	Wn = null, Gn = 0, Kn = null, V = l & 96 ? null : e, Hn = null, He(e.ctx), zn = !1, Xn = ++Yn, e.ac !== null && (ot(() => {
		e.ac.abort(fe);
	}), e.ac = null);
	try {
		e.f |= ee;
		var u = e.fn, d = u();
		e.f |= b;
		var f = nr(e);
		if (Ke() && Kn !== null && !zn && f !== null && !(e.f & 6146)) for (var p = 0; p < Kn.length; p++) er(Kn[p], e);
		if (i !== null && i !== e) {
			if (Yn++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = Yn;
			if (t !== null) for (let e of t) e.rv = Yn;
			Kn !== null && (r === null ? r = Kn : r.push(...Kn));
		}
		return e.f & 8388608 && (e.f ^= ne), d;
	} catch (t) {
		return nr(e), ln(t);
	} finally {
		e.f ^= ee, Wn = t, Gn = n, Kn = r, V = i, Hn = a, He(o), zn = s, Xn = c;
	}
}
function nr(e) {
	var t = e.deps, n = M?.is_fork;
	if (Wn !== null) {
		var r;
		if (n || ir(e, Gn), t !== null && Gn > 0) for (t.length = Gn + Wn.length, r = 0; r < Wn.length; r++) t[Gn + r] = Wn[r];
		else e.deps = t = Wn;
		if (mn() && e.f & 512) for (r = Gn; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && Gn < t.length && (ir(e, Gn), t.length = Gn);
	return t;
}
function rr(e, r) {
	let i = r.reactions;
	if (i !== null) {
		var a = t.call(i, e);
		if (a !== -1) {
			var o = i.length - 1;
			o === 0 ? i = r.reactions = null : (i[a] = i[o], i.pop());
		}
	}
	if (i === null && r.f & 2 && (Wn === null || !n.call(Wn, r))) {
		var s = r;
		s.f & 512 && (s.f ^= 512, s.f &= ~E), s.v !== he && $e(s), s.ac !== null && ot(() => {
			s.ac.abort(fe), s.ac = null, Qe(s, g);
		}), yt(s), ir(s, 0);
	}
}
function ir(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) rr(e, n[r]);
}
function ar(e) {
	var t = e.f;
	if (!(t & 16384)) {
		Qe(e, h);
		var n = H, r = In;
		H = e, In = !(t & 96);
		try {
			t & 16777232 ? En(e) : Tn(e), wn(e);
			var i = tr(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = Jn;
		} finally {
			In = r, H = n;
		}
	}
}
async function or() {
	await Promise.resolve(), Mt();
}
function U(e) {
	var t = !!(e.f & 2);
	if (Fn?.add(e), V !== null && !zn && !(H !== null && H.f & 16384) && (Hn === null || !Hn.has(e))) {
		var r = V.deps;
		if (V.f & 2097152) e.rv < Yn && (e.rv = Yn, Wn === null && r !== null && r[Gn] === e ? Gn++ : Wn === null ? Wn = [e] : Wn.push(e));
		else {
			V.deps ??= [], n.call(V.deps, e) || V.deps.push(e);
			var i = e.reactions;
			i === null ? e.reactions = [V] : n.call(i, V) || i.push(V);
		}
	}
	if (Ln && Bt.has(e)) return Bt.get(e);
	if (t) {
		var a = e;
		if (Ln) {
			var o = a.v;
			return (!(a.f & 1024) && a.reactions !== null || cr(a)) && (o = _t(a)), Bt.set(a, o), o;
		}
		var s = !(a.f & 512) && !zn && V !== null && (In || !!(V.f & 512)), c = (a.f & b) === 0;
		$n(a) && (s && (a.f |= 512), vt(a)), s && !c && (bt(a), sr(a));
	}
	if (Ct?.has(e)) return Ct.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function sr(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (bt(t), sr(t));
}
function cr(e) {
	if (e.v === he) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Bt.has(t) || t.f & 2 && cr(t)) return !0;
	return !1;
}
function lr(e) {
	var t = zn;
	try {
		return zn = !0, e();
	} finally {
		zn = t;
	}
}
function ur(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (re in e) dr(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && re in n && dr(n);
		}
	}
}
function dr(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			dr(e[n], t);
		} catch {}
		let n = l(e);
		if (n !== Object.prototype && n !== Array.prototype && n !== Map.prototype && n !== Set.prototype && n !== Date.prototype) {
			let t = o(n);
			for (let n in t) {
				let r = t[n].get;
				if (r) try {
					r.call(e);
				} catch {}
			}
		}
	}
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var fr = ["touchstart", "touchmove"];
function pr(e) {
	return fr.includes(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dev/css.js
var mr = Symbol("events"), hr = /* @__PURE__ */ new Set(), gr = /* @__PURE__ */ new Set();
function _r(e) {
	if (!D) return;
	e.removeAttribute("onload"), e.removeAttribute("onerror");
	let t = e.__e;
	t !== void 0 && (e.__e = void 0, queueMicrotask(() => {
		e.isConnected && e.dispatchEvent(t);
	}));
}
function vr(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || Cr.call(t, e), !e.cancelBubble) return ot(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? Ye(() => {
		t.addEventListener(e, i, r);
	}) : t.addEventListener(e, i, r), i;
}
function yr(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = vr(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && hn(() => {
		t.removeEventListener(e, o, a);
	});
}
function W(e, t, n) {
	(t[mr] ??= {})[e] = n;
}
function br(e) {
	for (var t = 0; t < e.length; t++) hr.add(e[t]);
	for (var n of gr) n(e);
}
var xr = null, Sr = !1;
function Cr(e) {
	var t = this, n = t.ownerDocument, r = e.type, a = e.composedPath?.() || [], o = a[0] || e.target;
	xr = e, Sr || (Sr = !0, setTimeout(() => {
		Sr = !1, xr = null;
	}));
	var s = 0, c = xr === e && e[mr];
	if (c) {
		var l = a.indexOf(c);
		if (l !== -1 && (t === document || t === window)) {
			e[mr] = t;
			return;
		}
		var u = a.indexOf(t);
		if (u === -1) return;
		l <= u && (s = l);
	}
	if (o = a[s] || e.target, o !== t) {
		i(e, "currentTarget", {
			configurable: !0,
			get() {
				return o || n;
			}
		});
		var d = V, f = H;
		Bn(null), Vn(null);
		try {
			for (var p, m = []; o !== null && o !== t;) {
				try {
					var h = o[mr]?.[r];
					h != null && (!o.disabled || e.target === o) && h.call(o, e);
				} catch (e) {
					p ? m.push(e) : p = e;
				}
				if (e.cancelBubble) break;
				s++, o = s < a.length ? a[s] : null;
			}
			if (p) {
				for (let e of m) queueMicrotask(() => {
					throw e;
				});
				throw p;
			}
		} finally {
			e[mr] = t, delete e.currentTarget, Bn(d), Vn(f);
		}
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/reconciler.js
var wr = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function Tr(e) {
	return wr?.createHTML(e) ?? e;
}
function Er(e) {
	var t = sn("template");
	return t.innerHTML = Tr(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
function Dr(e, t) {
	var n = H;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function G(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i, a = !e.startsWith("<!>");
	return () => {
		if (D) return Dr(O, null), O;
		i === void 0 && (i = Er(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ nn(i)));
		var t = r || Zt ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ nn(t), s = t.lastChild;
			Dr(o, s);
		} else Dr(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Or(e, t, n = "svg") {
	var r = !e.startsWith("<!>"), i = !!(t & 1), a = `<${n}>${r ? e : "<!>" + e}</${n}>`, o;
	return () => {
		if (D) return Dr(O, null), O;
		if (!o) {
			var e = /* @__PURE__ */ nn(Er(a));
			if (i) for (o = document.createDocumentFragment(); /* @__PURE__ */ nn(e);) o.appendChild(/* @__PURE__ */ nn(e));
			else o = /* @__PURE__ */ nn(e);
		}
		var t = o.cloneNode(!0);
		if (i) {
			var n = /* @__PURE__ */ nn(t), r = t.lastChild;
			Dr(n, r);
		} else Dr(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function kr(e, t) {
	return /* @__PURE__ */ Or(e, t, "svg");
}
function Ar(e = "") {
	if (!D) {
		var t = tn(e + "");
		return Dr(t, t), t;
	}
	var n = O;
	return n.nodeType === 3 ? cn(n) : (n.before(n = tn()), Se(n)), Dr(n, n), n;
}
function jr() {
	if (D) return Dr(O, null), O;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = tn();
	return e.append(t, n), Dr(t, n), e;
}
function K(e, t) {
	if (D) {
		var n = H;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = O), Ce();
		return;
	}
	e !== null && e.before(t);
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function Mr(e) {
	let t = 0, n = Ht(0), r;
	return () => {
		mn() && (U(n), xn(() => (t === 0 && (r = lr(() => e(() => Kt(n)))), t += 1, () => {
			Ye(() => {
				--t, t === 0 && (r?.(), r = void 0, Kt(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var Nr = S | C;
function Pr(e, t, n, r) {
	new Fr(e, t, n, r);
}
var Fr = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = D ? O : null;
	#n;
	#r;
	#i;
	#a = null;
	#o = null;
	#s = null;
	#c = null;
	#l = 0;
	#u = 0;
	#d = !1;
	#f = /* @__PURE__ */ new Set();
	#p = /* @__PURE__ */ new Set();
	#m = null;
	#h = Mr(() => (this.#m = Ht(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = H;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = H.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = Sn(() => {
			if (D) {
				let e = this.#t;
				Ce();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, Nr), D && (this.#e = O);
	}
	#g() {
		try {
			this.#a = Cn(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		Ye(r), t && (this.#s = Cn(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			if (t) {
				be();
				return;
			}
			t = !0, n && Be(), this.#s !== null && An(this.#s, () => {
				this.#s = null;
			}), this.#S(() => {
				this.#b();
			});
		};
		return {
			reset: r,
			invoke_onerror: () => {
				try {
					n = !0, this.#n.onerror?.(e, r), n = !1;
				} catch (e) {
					un(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = Cn(() => e(this.#e)), Ye(() => {
			var e = this.#c = document.createDocumentFragment(), t = tn(), n = !1;
			if (e.append(t), this.#a = this.#S(() => {
				try {
					return Cn(() => this.#r(t));
				} catch (e) {
					try {
						this.error(e), n = !0;
					} catch (e) {
						un(e, this.#i.parent);
					}
					return null;
				}
			}), this.#a === null) {
				this.#c = null, n && this.#x(M);
				return;
			}
			this.#u === 0 && (this.#e.before(e), this.#c = null, An(this.#o, () => {
				this.#o = null;
			}), this.#x(M));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = Cn(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				Pn(this.#a, e);
				let t = this.#n.pending;
				this.#o = Cn(() => t(this.#e));
			} else this.#x(M);
		} catch (e) {
			this.error(e);
		}
	}
	#x(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		tt(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#S(e) {
		var t = H, n = V, r = Ve;
		Vn(this.#i), Bn(this.#i), He(this.#i.ctx);
		try {
			return jt.ensure(), e();
		} finally {
			Vn(t), Bn(n), He(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && An(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, Ye(() => {
			this.#d = !1, this.#m && Wt(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), U(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		M?.is_fork ? (this.#a && M.skip_effect(this.#a), this.#o && M.skip_effect(this.#o), this.#s && M.skip_effect(this.#s), M.oncommit(() => {
			this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (Dn(this.#a), null), this.#o &&= (Dn(this.#o), null), this.#s &&= (Dn(this.#s), null), D && (Se(this.#t), A(), Se(we()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return Cn(() => {
						var r = H;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return un(e, this.#i.parent), null;
				}
			}));
		};
		Ye(() => {
			var t;
			try {
				t = this.transform_error(e);
			} catch (e) {
				un(e, this.#i && this.#i.parent);
				return;
			}
			typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => un(e, this.#i && this.#i.parent)) : n(t);
		});
	}
};
function q(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[ue] ??= e.nodeValue) && (e[ue] = n, e.nodeValue = `${n}`);
}
function Ir(e, t) {
	return Rr(e, t);
}
var Lr = /* @__PURE__ */ new Map();
function Rr(e, { target: t, anchor: n, props: i = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	en();
	var l = void 0, u = vn(() => {
		var s = n ?? t.appendChild(tn());
		Pr(s, { pending: () => {} }, (t) => {
			Ue({});
			var n = Ve;
			if (o && (n.c = o), a && (i.$$events = a), D && Dr(t, null), l = e(t, i) || Ge(), D && (H.nodes.end = O, O === null || O.nodeType !== 8 || O.data !== "]")) throw ve(), me;
			We();
		}, c);
		var u = /* @__PURE__ */ new Set(), d = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!u.has(r)) {
					u.add(r);
					var i = pr(r);
					for (let e of [t, document]) {
						var a = Lr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Lr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Cr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return d(r(hr)), gr.add(d), () => {
			for (var e of u) for (let n of [t, document]) {
				var r = Lr.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, Cr), r.delete(e), r.size === 0 && Lr.delete(n)) : r.set(e, i);
			}
			gr.delete(d), s !== n && s.parentNode?.removeChild(s);
		};
	});
	return zr.set(l, u), l;
}
var zr = /* @__PURE__ */ new WeakMap();
function Br(e, t) {
	let n = zr.get(e);
	return n ? (zr.delete(e), n(t)) : Promise.resolve();
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/branches.js
var Vr = class {
	anchor;
	#e = /* @__PURE__ */ new Map();
	#t = /* @__PURE__ */ new Map();
	#n = /* @__PURE__ */ new Map();
	#r = /* @__PURE__ */ new Set();
	#i = !0;
	constructor(e, t = !0) {
		this.anchor = e, this.#i = t;
	}
	#a = (e) => {
		if (this.#e.has(e)) {
			var t = this.#e.get(e), n = this.#t.get(t);
			if (n) Mn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (Mn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (Dn(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						Pn(r, t), t.append(tn()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else Dn(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), An(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (Dn(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = M, r = on();
		if (t && !this.#t.has(e) && !this.#n.has(e)) {
			if (r) {
				var i = document.createDocumentFragment(), a = tn();
				i.append(a), this.#n.set(e, {
					effect: Cn(() => t(a)),
					fragment: i
				});
			} else this.#t.set(e, Cn(() => t(this.anchor)));
		}
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else D && (this.anchor = O), this.#a(n);
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/if.js
function J(e, t, n = !1) {
	var r;
	D && (r = O, Ce());
	var i = new Vr(e), a = n ? S : 0;
	function o(e, t) {
		if (D) {
			var n = Te(r);
			if (e !== parseInt(n.substring(1))) {
				var a = we();
				Se(a), i.anchor = a, xe(!1), i.ensure(e, t), xe(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	Sn(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/key.js
var Hr = Symbol("NaN");
function Ur(e, t, n) {
	D && Ce();
	var r = new Vr(e), i = !Ke();
	Sn(() => {
		var e = t();
		e !== e && (e = Hr), i && typeof e == "object" && e && (e = {}), r.ensure(e, n);
	});
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/each.js
function Wr(e, t) {
	return t;
}
function Gr(e, t, n) {
	for (var i = [], a = t.length, o, s = t.length, c = 0; c < a; c++) {
		let n = t[c];
		An(n, () => {
			if (o) {
				if (o.pending.delete(n), o.done.add(n), o.pending.size === 0) {
					var t = e.outrogroups;
					Kr(e, r(o.done)), t.delete(o), t.size === 0 && (e.outrogroups = null);
				}
			} else --s;
		}, !1);
	}
	if (s === 0) {
		var l = i.length === 0 && n !== null && e.pending.size === 0;
		if (l) {
			var u = n, d = u.parentNode;
			an(d), d.append(u), e.items.clear();
		}
		Kr(e, t, !l);
	} else o = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(o);
}
function Kr(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= T, Pn(a, document.createDocumentFragment())) : Dn(t[i], n);
	}
}
var qr;
function Y(t, n, i, a, o, s = null) {
	var c = t, l = /* @__PURE__ */ new Map();
	if (n & 4) {
		var u = t;
		c = D ? Se(/* @__PURE__ */ nn(u)) : u.appendChild(tn());
	}
	D && Ce();
	var d = null, f = /* @__PURE__ */ ht(() => {
		var t = i();
		return e(t) ? t : t == null ? [] : r(t);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, Yr(v, p, c, n, a), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= T, Zr(d, null, c)) : Mn(d) : An(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: Sn(() => {
			p = U(f);
			var e = p.length;
			let t = !1;
			D && Te(c) === "[!" != (e === 0) && (c = we(), Se(c), xe(!1), t = !0);
			for (var r = /* @__PURE__ */ new Set(), u = M, v = on(), y = 0; y < e; y += 1) {
				D && O.nodeType === 8 && O.data === "]" && (c = O, t = !0, xe(!1));
				var b = p[y], x = a(b, y), S = h ? null : l.get(x);
				S ? (S.v && Wt(S.v, b), S.i && Wt(S.i, y), v && u.unskip_effect(S.e)) : (S = Xr(l, h ? c : qr ??= tn(), b, x, y, o, n, i), h || (S.e.f |= T), l.set(x, S)), r.add(x);
			}
			if (e === 0 && s && !d && (h ? d = Cn(() => s(c)) : (d = Cn(() => s(qr ??= tn())), d.f |= T)), e > r.size && je("", "", ""), D && e > 0 && Se(we()), !h) {
				if (m.set(u, r), v) {
					for (let [e, t] of l) r.has(e) || u.skip_effect(t.e);
					u.oncommit(g), u.ondiscard(_);
				} else g(u);
			}
			t && xe(!0), U(f);
		}),
		flags: n,
		items: l,
		pending: m,
		outrogroups: null,
		fallback: d
	};
	h = !1, D && (c = O);
}
function Jr(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function Yr(e, t, n, i, a) {
	var o = !!(i & 8), s = t.length, c = e.items, l = Jr(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (o) for (v = 0; v < s; v += 1) h = t[v], g = a(h, v), _ = c.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < s; v += 1) {
		if (h = t[v], g = a(h, v), _ = c.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (Mn(_), o && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) {
			if (_.f ^= T, _ === l) Zr(_, null, n);
			else {
				var y = d ? d.next : l;
				_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), Qr(e, d, _), Qr(e, _, y), Zr(_, y, n), d = _, p = [], m = [], l = Jr(d.next);
				continue;
			}
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], C = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) Zr(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					Qr(e, S.prev, C.next), Qr(e, d, S), Qr(e, C, b), l = b, d = C, --v, p = [], m = [];
				} else u.delete(_), Zr(_, l, n), Qr(e, _.prev, _.next), Qr(e, _, d === null ? e.effect.first : d.next), Qr(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = Jr(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = Jr(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (Kr(e, r(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var w = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || w.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && w.push(l), l = Jr(l.next);
		var E = w.length;
		if (E > 0) {
			var ee = i & 4 && s === 0 ? n : null;
			if (o) {
				for (v = 0; v < E; v += 1) w[v].nodes?.a?.measure();
				for (v = 0; v < E; v += 1) w[v].nodes?.a?.fix();
			}
			Gr(e, w, ee);
		}
	}
	o && Ye(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function Xr(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Ht(n) : /* @__PURE__ */ Ut(n, !1, !1) : null, l = o & 2 ? Ht(i) : null;
	return {
		v: c,
		i: l,
		e: Cn(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function Zr(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ rn(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function Qr(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/css.js
function $r(e, t) {
	yn(() => {
		e = H?.parent?.nodes?.start ?? e;
		var n = e.getRootNode(), r = n.host ? n : n.head ?? n.ownerDocument.head;
		if (!r.querySelector("#" + t.hash)) {
			let e = sn("style");
			e.id = t.hash, e.textContent = t.code, r.appendChild(e);
		}
	});
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/actions.js
function ei(e, t, n) {
	yn(() => {
		var r = lr(() => t(e, n?.()) || {});
		if (n && r?.update) {
			var i = !1, a = {};
			xn(() => {
				var e = n();
				ur(e), i && De(a, e) && (a = e, r.update(e));
			}), i = !0;
		}
		if (r?.destroy) return () => r.destroy();
	});
}
//#endregion
//#region node_modules/svelte/src/internal/shared/attributes.js
var ti = [..." 	\n\r\f\xA0\v﻿"];
function ni(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || ti.includes(r[o - 1])) && (s === r.length || ti.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
function ri(e, t = !1) {
	var n = t ? " !important;" : ";", r = "";
	for (var i of Object.keys(e)) {
		var a = e[i];
		a != null && a !== "" && (r += " " + i + ": " + a + n);
	}
	return r;
}
function ii(e) {
	return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function ai(e, t) {
	if (t) {
		var n = "", r, i;
		if (Array.isArray(t) ? (r = t[0], i = t[1]) : r = t, e) {
			e = String(e).replaceAll(/\/\*.*?\*\//g, "").trim();
			var a = !1, o = 0, s = !1, c = [];
			r && c.push(...Object.keys(r).map(ii)), i && c.push(...Object.keys(i).map(ii));
			var l = 0, u = -1;
			let t = e.length;
			for (var d = 0; d < t; d++) {
				var f = e[d];
				if (s ? f === "/" && e[d - 1] === "*" && (s = !1) : a ? a === f && (a = !1) : f === "/" && e[d + 1] === "*" ? s = !0 : f === "\"" || f === "'" ? a = f : f === "(" ? o++ : f === ")" && o--, !s && a === !1 && o === 0) {
					if (f === ":" && u === -1) u = d;
					else if (f === ";" || d === t - 1) {
						if (u !== -1) {
							var p = ii(e.substring(l, u).trim());
							if (!c.includes(p)) {
								f !== ";" && d++;
								var m = e.substring(l, d).trim();
								n += " " + m + ";";
							}
						}
						l = d + 1, u = -1;
					}
				}
			}
		}
		return r && (n += ri(r)), i && (n += ri(i, !0)), n = n.trim(), n === "" ? null : n;
	}
	return e == null ? null : String(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/class.js
function X(e, t, n, r, i, a) {
	var o = e[ce];
	if (D || o !== n || o === void 0) {
		var s = ni(n, r, a);
		(!D || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[ce] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/style.js
function oi(e, t = {}, n, r) {
	for (var i in n) {
		var a = n[i];
		t[i] !== a && (n[i] == null ? e.style.removeProperty(i) : e.style.setProperty(i, a, r));
	}
}
function si(e, t, n, r) {
	var i = e[le];
	if (D || i !== t) {
		var a = ai(t, r);
		(!D || a !== e.getAttribute("style")) && (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[le] = t;
	} else r && (Array.isArray(r) ? (oi(e, n?.[0], r[0]), oi(e, n?.[1], r[1], "important")) : oi(e, n, r));
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function ci(e, t) {
	t ? e.hasAttribute("selected") || e.setAttribute("selected", "") : e.removeAttribute("selected");
}
function li(t, n) {
	var r = t.__defaultValue, i = t.multiple, a = i ? r ?? [] : null;
	if (!i || e(a)) {
		var o = t.selectedIndex, s = n && i ? new Set(t.selectedOptions) : null;
		for (var c of t.options) {
			var l = pi(c);
			ci(c, i ? a.includes(l) : Yt(l, r));
		}
		if (n) {
			if (s !== null) for (c of t.options) {
				var u = s.has(c);
				c.selected !== u && (c.selected = u);
			}
			else t.selectedIndex !== o && (t.selectedIndex = o);
		}
	}
}
function ui(t, n, r = !1) {
	if (t.multiple) {
		if (n == null) return;
		if (!e(n)) return ye();
		for (var i of t.options) i.selected = n.includes(pi(i));
		return;
	}
	for (i of t.options) if (Yt(pi(i), n)) {
		i.selected = !0;
		return;
	}
	(!r || n !== void 0) && (t.selectedIndex = -1);
}
function di(e) {
	var t = new MutationObserver((t) => {
		t.every(mi) || ("__defaultValue" in e && li(e, !1), "__value" in e && ui(e, e.__value));
	});
	t.observe(e, {
		childList: !0,
		subtree: !0,
		attributes: !0,
		attributeFilter: ["value"]
	}), hn(() => {
		t.disconnect();
	});
}
function fi(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet(), i = !0;
	st(e, "change", (t) => {
		var i = t ? "[selected]" : ":checked", a;
		if (e.multiple) a = [].map.call(e.querySelectorAll(i), pi);
		else {
			var o = e.querySelector(i) ?? e.querySelector("option:not([disabled])");
			a = o && pi(o);
		}
		n(a), e.__value = a, M !== null && r.add(M);
	}), yn(() => {
		var a = t();
		if (e === document.activeElement) {
			var o = M;
			if (r.has(o)) return;
		}
		if (ui(e, a, i), i && a === void 0) {
			var s = e.querySelector(":checked");
			s !== null && (a = pi(s), n(a));
		}
		e.__value = a, i = !1;
	});
}
function pi(e) {
	return "__value" in e ? e.__value : e.value;
}
function mi(e) {
	if (e.target.closest("selectedcontent") !== null) return !0;
	if (e.type === "childList") {
		var t = [...e.addedNodes, ...e.removedNodes];
		return t.length > 0 && t.every((e) => e.nodeName === "SELECTEDCONTENT");
	}
	return !1;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attributes.js
var hi = Symbol("is custom element"), gi = Symbol("is html"), _i = pe ? "link" : "LINK", vi = pe ? "progress" : "PROGRESS";
function yi(e) {
	if (D) {
		var t = !1, n = () => {
			if (!t) {
				if (t = !0, e.hasAttribute("value")) {
					var n = e.value;
					Z(e, "value", null), e.value = n;
				}
				if (e.hasAttribute("checked")) {
					var r = e.checked;
					Z(e, "checked", null), e.checked = r;
				}
			}
		};
		e[de] = n, Ye(n), at();
	}
}
function bi(e, t) {
	var n = Si(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === vi) && (e.value = t ?? "");
}
function xi(e, t) {
	var n = Si(e);
	n.checked !== (n.checked = t ?? void 0) && (e.checked = t);
}
function Z(e, t, n, r) {
	var i = Si(e);
	D && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === _i) || i[t] !== (i[t] = n) && (t === "loading" && (e[oe] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && wi(e).has(t) ? e[t] = n : e.setAttribute(t, n));
}
function Si(e) {
	return e[se] ??= {
		[hi]: e.nodeName.includes("-"),
		[gi]: e.namespaceURI === ge
	};
}
var Ci = /* @__PURE__ */ new Map();
function wi(e) {
	var t = e.getAttribute("is") || e.nodeName, n = Ci.get(t);
	if (n) return n;
	Ci.set(t, n = /* @__PURE__ */ new Set());
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var s in r = o(i), r) r[s].set && s !== "innerHTML" && s !== "textContent" && s !== "innerText" && n.add(s);
		i = l(i);
	}
	return n;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function Ti(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet();
	st(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = Di(e) ? Oi(a) : a, n(a), M !== null && r.add(M), await or(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (D && e.defaultValue !== e.value || lr(t) == null && e.value) && (n(Di(e) ? Oi(e.value) : e.value), M !== null && r.add(M)), xn(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = M;
			if (r.has(i)) return;
		}
		Di(e) && n === Oi(e.value) || (e.type !== "date" || n || e.value) && n !== e.value && (e.value = n ?? "");
	});
}
function Ei(e, t, n = t) {
	st(e, "change", (t) => {
		n(t ? e.defaultChecked : e.checked);
	}), (D && e.defaultChecked !== e.checked || lr(t) == null) && n(e.checked), xn(() => {
		e.checked = !!t();
	});
}
function Di(e) {
	var t = e.type;
	return t === "number" || t === "range";
}
function Oi(e) {
	return e === "" ? null : +e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function ki(e, t) {
	return e === t || e?.[re] === t;
}
function Ai(e = Ge(), t, n, r) {
	var i = Ve.r, a = H;
	return yn(() => {
		var o, s;
		return xn(() => {
			o = s, s = r?.() || [], lr(() => {
				ki(n(...s), e) || (t(e, ...s), o && ki(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && ki(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function ji(e, t, n, r) {
	var i = !0, o = !!(n & 8), s = !!(n & 16), c = r, l = !0, u = void 0, d = () => s && i ? (u ??= /* @__PURE__ */ ft(r), U(u)) : (l && (l = !1, c = s ? lr(r) : r), c);
	let f;
	if (o) {
		var p = re in e || ae in e;
		f = a(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	o ? [m, h] = rt(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && Ie(t), f(m)));
	var g = i ? () => {
		var n = e[t];
		return n === void 0 ? d() : (l = !0, n);
	} : () => {
		var n = e[t];
		return n !== void 0 && (c = void 0), n === void 0 ? c : n;
	};
	if (i && !(n & 4)) return g;
	if (f) {
		var _ = e.$$legacy;
		return (function(e, t) {
			return arguments.length > 0 ? ((!i || !t || _ || h) && f(t ? g() : e), e) : g();
		});
	}
	var v = !1, y = (n & 1 ? ft : ht)(() => (v = !1, g()));
	o && U(y);
	var b = H;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? U(y) : i && o ? F(e) : e;
			return P(y, n), v = !0, c !== void 0 && (c = n), e;
		}
		return Ln && v || b.f & 16384 ? y.v : U(y);
	});
}
function Mi(e) {
	Ve === null && ke("onMount"), gn(() => {
		let t = lr(e);
		if (typeof t == "function") return t;
	});
}
//#endregion
//#region node_modules/svelte/src/internal/disclose-version.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
//#endregion
//#region src/catalog.ts
var Ni = {
	podcast: "Podcast",
	book: "Audiobook",
	radio: "Radio"
}, Pi = (e) => e.type !== "radio", Fi = (e) => e.type === "podcast" ? `show:${e.show}` : e.id, Ii = [
	"I",
	"II",
	"III",
	"IV",
	"V",
	"VI",
	"VII",
	"VIII",
	"IX",
	"X",
	"XI",
	"XII",
	"XIII",
	"XIV",
	"XV",
	"XVI",
	"XVII",
	"XVIII",
	"XIX",
	"XX"
], Li = (e) => Ii[e] ?? String(e + 1), Ri = (e) => {
	let t = 0;
	for (let n of e) t = t * 31 + n.charCodeAt(0) >>> 0;
	return t % 360;
}, zi = (e) => {
	let t = e.replace(/^(the|a|an|el|la|los|las|o|os|as)\s+/i, "").split(/[\s:·\-–—]+/).filter((e) => /[\p{L}\p{N}]/u.test(e));
	return (t.length > 1 ? t[0][0] + t[1][0] : (t[0] ?? "?").slice(0, 2)).toUpperCase();
}, Bi = (e) => typeof e == "string" ? e : "", Vi = (e) => typeof e == "number" && Number.isFinite(e) ? e : 0, Hi = (e) => {
	let t = Bi(e);
	return t.startsWith("https://") ? t : "";
}, Ui = (e) => Array.isArray(e) ? e.filter((e) => !!e && typeof e == "object") : [], Wi = (e, t = /* @__PURE__ */ new Date()) => {
	let n = new Date(e);
	if (!e || Number.isNaN(n.getTime())) return "";
	let r = Math.floor((new Date(t.toDateString()).getTime() - new Date(n.toDateString()).getTime()) / 864e5);
	return r <= 0 ? "Today" : r === 1 ? "Yesterday" : n.toLocaleDateString(void 0, r > 300 ? {
		month: "short",
		day: "numeric",
		year: "numeric"
	} : {
		month: "short",
		day: "numeric"
	});
};
function Gi(e) {
	let t = Bi(e.id), n = Bi(e.name), r = Hi(e.stream_url);
	if (!t || !n || !r || e.playable === !1) return null;
	let i = [Bi(e.city), Bi(e.region) || Bi(e.country)].filter(Boolean).join(", "), a = Bi(e.genre).split(/[,/]/)[0]?.trim() || "Radio";
	return {
		id: `st:${t}`,
		type: "radio",
		stationId: t,
		title: n,
		url: r,
		genre: a,
		sub: [i || Bi(e.country), a].filter(Boolean).join(" · "),
		onair: "Live",
		hue: Ri(t),
		mark: zi(n),
		art: Hi(e.logo_url) || void 0
	};
}
function Ki(e) {
	let t = Bi(e.slug), n = Bi(e.title);
	return !t || !n ? null : {
		slug: t,
		id: Bi(e.id),
		title: n,
		author: Bi(e.author),
		desc: Bi(e.description),
		art: Hi(e.image_url) || void 0,
		hue: Ri(t),
		mark: zi(n),
		category: Bi(e.category),
		episodes: Vi(e.episode_count)
	};
}
function qi(e, t) {
	let n = Bi(e.id), r = Hi(e.audio_url), i = Bi(e.title);
	return !n || !r || !i ? null : {
		id: `ep:${n}`,
		type: "podcast",
		show: t.slug,
		slug: Bi(e.slug),
		title: i,
		sub: t.title,
		url: r,
		dur: Vi(e.duration),
		date: Bi(e.published_at),
		desc: Bi(e.description),
		chapters: [],
		hue: t.hue,
		mark: t.mark,
		art: Hi(e.image_url) || t.art
	};
}
function Ji(e) {
	let t = Bi(e.slug), n = Bi(e.title);
	if (!t || !n) return null;
	let r = 0, i = Ui(e.chapters).flatMap((e) => {
		let t = Hi(e.audio_url);
		if (!t) return [];
		let n = {
			start: r,
			title: Bi(e.title) || `Chapter ${Vi(e.section)}`,
			dur: Vi(e.duration),
			url: t,
			section: Vi(e.section)
		};
		return r += n.dur ?? 0, [n];
	}), a = i.length && i.every((e) => e.dur) ? r : Vi(e.duration), o = Bi(e.authors);
	return {
		id: `book:${t}`,
		type: "book",
		slug: t,
		title: n,
		sub: o || "Audiobook",
		dur: a,
		desc: Bi(e.description),
		chapters: i,
		loaded: i.length > 0,
		hue: Ri(t),
		mark: zi(n),
		art: Hi(e.cover_url) || void 0
	};
}
var Yi = (e) => Ui(e.lines).map((e) => ({
	t: Vi(e.start),
	who: Bi(e.speaker),
	text: Bi(e.text)
})).filter((e) => e.text), Xi = (e) => e && typeof e == "object" ? e : {}, Zi = (e, t) => Ui(Xi(e)[t]), Qi = class {
	el = null;
	src = "";
	live = !1;
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
		this.src = e, r.preload = n ? "none" : "auto", r.src = e, t > 0 && r.addEventListener("loadedmetadata", () => {
			this.src === e && (r.currentTime = t);
		}, { once: !0 });
	}
	seek(e) {
		this.el && this.src && !this.live && (this.el.readyState >= 1 ? this.el.currentTime = e : this.el.addEventListener("loadedmetadata", () => {
			this.el && (this.el.currentTime = e);
		}, { once: !0 }));
	}
	apply(e) {
		let t = this.el;
		t && this.src && (t.playbackRate = this.live ? 1 : e.rate, t.defaultPlaybackRate = t.playbackRate, t.volume = Math.min(1, Math.max(0, e.volume)), e.playing && t.paused ? (this.live && t.currentTime > 0 && (t.src = this.src), t.play().catch((e) => {
			e?.name !== "AbortError" && this.onError(e?.name === "NotAllowedError" ? "Press play to start audio." : "This audio could not be played.");
		})) : !e.playing && !t.paused && t.pause());
	}
	stop() {
		this.el && (this.el.pause(), this.el.removeAttribute("src"), this.el.load(), this.src = "");
	}
	destroy() {
		this.stop(), this.el = null;
	}
}, $i = (e) => `linear-gradient(145deg, oklch(0.6 0.1 ${e}), oklch(0.32 0.06 ${e}))`, ea = (e) => {
	let t = Math.max(0, Math.round(e)), n = Math.floor(t / 3600), r = Math.floor(t % 3600 / 60), i = t % 60;
	return n ? `${n}:${String(r).padStart(2, "0")}:${String(i).padStart(2, "0")}` : `${r}:${String(i).padStart(2, "0")}`;
}, ta = (e) => {
	let t = Math.max(0, e), n = Math.floor(t / 3600), r = Math.round(t % 3600 / 60);
	return n ? `${n}h ${r}m` : `${r} min`;
}, na = (e = /* @__PURE__ */ new Date()) => {
	let t = e.getHours();
	return t < 5 ? "Good evening" : t < 12 ? "Good morning" : t < 18 ? "Good afternoon" : "Good evening";
}, ra = (e, t = Date.now()) => {
	let n = e ? Date.parse(e) : NaN;
	if (Number.isNaN(n)) return "";
	let r = Math.round((t - n) / 6e4);
	return r < 1 ? "just now" : r < 60 ? `${r} min ago` : r < 1440 ? `${Math.round(r / 60)} h ago` : new Date(n).toLocaleDateString();
}, ia = (e, t, n) => (e ?? []).reduce((e, r, i) => n(r) <= t ? i : e, e?.length ? 0 : -1), aa = (e, t) => ia(e, t, (e) => e.start), oa = (e, t) => [t, ...e.filter((e) => e !== t)], sa = (e, t) => e.filter((e) => e !== t);
function ca(e, t, n, r, i, a = 50) {
	let o = e.filter((e) => !t.includes(e) && e !== r), s = n.indexOf(r), c = s < 0 ? n : [...n.slice(s + 1), ...n.slice(0, s)], l = [...new Set(c)].filter((e) => e !== r && !o.includes(e) && !i(e)).slice(0, a);
	return {
		queue: [...o, ...l],
		auto: l
	};
}
function la(e, t, n) {
	let r = e.filter((e) => e !== n), i = r.findIndex((e) => t.includes(e) && e !== n);
	return i < 0 ? [...r, n] : [
		...r.slice(0, i),
		n,
		...r.slice(i)
	];
}
var ua = (e, t) => {
	let n = Math.max(0, aa(e, t));
	return {
		index: n,
		offset: Math.max(0, t - (e[n]?.start ?? 0))
	};
}, da = (e, t) => Object.fromEntries(Object.entries(e).sort((e, t) => t[1].at - e[1].at).slice(0, t)), fa = (e, t) => {
	let n = aa(e, t);
	return n < 0 ? 0 : t - e[n].start > 3 ? e[n].start : e[n - 1]?.start ?? 0;
};
function pa(e, t, n = 1, r = n * e.speed) {
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
var ma = (e, t, n) => Math.max(0, e - t) / n, ha = (e) => typeof e == "number" && e < 60 ? Math.max(0, e / 60) : 1, ga = (e) => `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`;
function _a(e, t, n, r, i = 120) {
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
var va = (e) => (e?.radio ?? 0) + (e?.podcast ?? 0) + (e?.book ?? 0);
function ya(e, t = /* @__PURE__ */ new Date()) {
	let n = [], r = {
		radio: 0,
		podcast: 0,
		book: 0
	};
	for (let i = 6; i >= 0; i--) {
		let a = new Date(t.getFullYear(), t.getMonth(), t.getDate() - i), o = ga(a), s = e[o];
		n.push({
			key: o,
			label: a.toLocaleDateString(void 0, { weekday: "short" }),
			seconds: va(s)
		});
		for (let e of [
			"radio",
			"podcast",
			"book"
		]) r[e] += s?.[e] ?? 0;
	}
	let i = 0;
	for (let n = 0; n < 366; n++) if (va(e[ga(new Date(t.getFullYear(), t.getMonth(), t.getDate() - n))]) >= 60) i++;
	else if (n > 0 || i > 0) break;
	return {
		days: n,
		byKind: r,
		total: r.radio + r.podcast + r.book,
		streak: i
	};
}
var ba = (e, t, n, r = 60) => [{
	id: t,
	at: n
}, ...e.filter((e) => e.id !== t)].slice(0, r);
function xa(e, t, n) {
	let r = e.filter((e) => e !== t);
	if (r.length === e.length) return e;
	let i = Math.max(0, Math.min(r.length, n));
	return [
		...r.slice(0, i),
		t,
		...r.slice(i)
	];
}
var Sa = (e) => e < 3e4 ? 0 : e < 3e5 ? 3 : e < 36e5 ? 10 : 20, Ca = [
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
], wa = [
	{
		label: "All",
		slugs: []
	},
	{
		label: "True Crime",
		slugs: ["true-crime"]
	},
	{
		label: "Comedy",
		slugs: ["comedy"]
	},
	{
		label: "News",
		slugs: [
			"news",
			"news-politics",
			"politics",
			"daily-news"
		]
	},
	{
		label: "Society & Culture",
		slugs: ["society-culture", "society"]
	},
	{
		label: "Business",
		slugs: [
			"business",
			"business-news",
			"entrepreneurship"
		]
	},
	{
		label: "Sports",
		slugs: ["sports", "sports-recreation"]
	},
	{
		label: "Health & Fitness",
		slugs: ["health-fitness", "health"]
	},
	{
		label: "Education",
		slugs: ["education"]
	},
	{
		label: "History",
		slugs: ["history"]
	},
	{
		label: "Science",
		slugs: ["science", "science-medicine"]
	},
	{
		label: "Technology",
		slugs: ["technology"]
	},
	{
		label: "TV & Film",
		slugs: ["tv-film"]
	},
	{
		label: "Arts",
		slugs: ["arts"]
	},
	{
		label: "Music",
		slugs: ["music"]
	},
	{
		label: "Fiction",
		slugs: ["fiction"]
	},
	{
		label: "Kids & Family",
		slugs: ["kids-family"]
	},
	{
		label: "Religion & Spirituality",
		slugs: [
			"religion-spirituality",
			"christianity",
			"religion"
		]
	},
	{
		label: "Leisure",
		slugs: ["leisure", "games-hobbies"]
	}
], Ta = {
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
}, Ea = {
	back: 15,
	fwd: 30,
	smartRewind: !0,
	continuous: !0,
	repeat: "off",
	autoFill: !0
}, Da = [
	5,
	10,
	15,
	30
], Oa = [
	10,
	15,
	30,
	45,
	60
], ka = {
	intro: 0,
	outro: 0,
	autoQueue: !1
}, Aa = [
	0,
	10,
	15,
	30,
	45,
	60,
	90
], ja = [
	0,
	10,
	15,
	30,
	60
], Ma = [
	.8,
	1,
	1.1,
	1.2,
	1.4,
	1.6,
	1.8,
	2
], Na = [
	5,
	15,
	30,
	45,
	60,
	90
], Pa = 200, Fa = class {
	#e = /* @__PURE__ */ N(F({}));
	get items() {
		return U(this.#e);
	}
	set items(e) {
		P(this.#e, e, !0);
	}
	#t = /* @__PURE__ */ N(F({}));
	get shows() {
		return U(this.#t);
	}
	set shows(e) {
		P(this.#t, e, !0);
	}
	#n = /* @__PURE__ */ N(F({}));
	get showEpisodes() {
		return U(this.#n);
	}
	set showEpisodes(e) {
		P(this.#n, e, !0);
	}
	#r = /* @__PURE__ */ N(F({}));
	get epOrder() {
		return U(this.#r);
	}
	set epOrder(e) {
		P(this.#r, e, !0);
	}
	#i = /* @__PURE__ */ N("all");
	get epFilter() {
		return U(this.#i);
	}
	set epFilter(e) {
		P(this.#i, e, !0);
	}
	#a = /* @__PURE__ */ N("");
	get epQuery() {
		return U(this.#a);
	}
	set epQuery(e) {
		P(this.#a, e, !0);
	}
	#o = /* @__PURE__ */ N(F({}));
	get showPrefs() {
		return U(this.#o);
	}
	set showPrefs(e) {
		P(this.#o, e, !0);
	}
	#s = /* @__PURE__ */ N(F([]));
	get autoQueued() {
		return U(this.#s);
	}
	set autoQueued(e) {
		P(this.#s, e, !0);
	}
	#c = /* @__PURE__ */ N(F([]));
	get playlists() {
		return U(this.#c);
	}
	set playlists(e) {
		P(this.#c, e, !0);
	}
	#l = /* @__PURE__ */ N(F([]));
	get upAuto() {
		return U(this.#l);
	}
	set upAuto(e) {
		P(this.#l, e, !0);
	}
	#u = /* @__PURE__ */ N("");
	get upFrom() {
		return U(this.#u);
	}
	set upFrom(e) {
		P(this.#u, e, !0);
	}
	#d = /* @__PURE__ */ N(F([]));
	get trending() {
		return U(this.#d);
	}
	set trending(e) {
		P(this.#d, e, !0);
	}
	#f = /* @__PURE__ */ N("idle");
	get radioStatus() {
		return U(this.#f);
	}
	set radioStatus(e) {
		P(this.#f, e, !0);
	}
	#p = /* @__PURE__ */ N(F({
		slugs: [],
		cursor: null,
		status: "idle"
	}));
	get podcastBrowse() {
		return U(this.#p);
	}
	set podcastBrowse(e) {
		P(this.#p, e, !0);
	}
	#m = /* @__PURE__ */ N("All");
	get podGenre() {
		return U(this.#m);
	}
	set podGenre(e) {
		P(this.#m, e, !0);
	}
	#h = /* @__PURE__ */ N(F({}));
	get podGenreLists() {
		return U(this.#h);
	}
	set podGenreLists(e) {
		P(this.#h, e, !0);
	}
	#g = /* @__PURE__ */ N(F({
		ids: [],
		cursor: null,
		status: "idle"
	}));
	get bookBrowse() {
		return U(this.#g);
	}
	set bookBrowse(e) {
		P(this.#g, e, !0);
	}
	#_ = /* @__PURE__ */ N(F([]));
	get newEpisodes() {
		return U(this.#_);
	}
	set newEpisodes(e) {
		P(this.#_, e, !0);
	}
	#v = /* @__PURE__ */ N("idle");
	get newStatus() {
		return U(this.#v);
	}
	set newStatus(e) {
		P(this.#v, e, !0);
	}
	#y = /* @__PURE__ */ N(F({}));
	get bookStatus() {
		return U(this.#y);
	}
	set bookStatus(e) {
		P(this.#y, e, !0);
	}
	#b = /* @__PURE__ */ N(F({}));
	get transcripts() {
		return U(this.#b);
	}
	set transcripts(e) {
		P(this.#b, e, !0);
	}
	#x = /* @__PURE__ */ N(F({
		q: "",
		hits: [],
		status: "idle"
	}));
	get search() {
		return U(this.#x);
	}
	set search(e) {
		P(this.#x, e, !0);
	}
	#S = /* @__PURE__ */ N(F({
		ids: [],
		page: 0,
		more: !1,
		total: 0,
		status: "idle"
	}));
	get stationHits() {
		return U(this.#S);
	}
	set stationHits(e) {
		P(this.#S, e, !0);
	}
	#C = /* @__PURE__ */ N(F({}));
	get radioLists() {
		return U(this.#C);
	}
	set radioLists(e) {
		P(this.#C, e, !0);
	}
	#w = /* @__PURE__ */ N(F({}));
	get nowPlaying() {
		return U(this.#w);
	}
	set nowPlaying(e) {
		P(this.#w, e, !0);
	}
	supported = !0;
	#T = /* @__PURE__ */ N("home");
	get tab() {
		return U(this.#T);
	}
	set tab(e) {
		P(this.#T, e, !0);
	}
	#E = /* @__PURE__ */ N(null);
	get showSlug() {
		return U(this.#E);
	}
	set showSlug(e) {
		P(this.#E, e, !0);
	}
	#D = /* @__PURE__ */ N(null);
	get bookId() {
		return U(this.#D);
	}
	set bookId(e) {
		P(this.#D, e, !0);
	}
	#O = /* @__PURE__ */ N("All");
	get genre() {
		return U(this.#O);
	}
	set genre(e) {
		P(this.#O, e, !0);
	}
	#k = /* @__PURE__ */ N("");
	get query() {
		return U(this.#k);
	}
	set query(e) {
		P(this.#k, e, !0);
	}
	#A = /* @__PURE__ */ N("onair");
	get rtab() {
		return U(this.#A);
	}
	set rtab(e) {
		P(this.#A, e, !0);
	}
	#j = /* @__PURE__ */ N(null);
	get pop() {
		return U(this.#j);
	}
	set pop(e) {
		P(this.#j, e, !0);
	}
	#M = /* @__PURE__ */ N(null);
	get popItem() {
		return U(this.#M);
	}
	set popItem(e) {
		P(this.#M, e, !0);
	}
	#N = /* @__PURE__ */ N(!1);
	get shortcuts() {
		return U(this.#N);
	}
	set shortcuts(e) {
		P(this.#N, e, !0);
	}
	#P = /* @__PURE__ */ N("all");
	get libKind() {
		return U(this.#P);
	}
	set libKind(e) {
		P(this.#P, e, !0);
	}
	#F = /* @__PURE__ */ N("recent");
	get libSort() {
		return U(this.#F);
	}
	set libSort(e) {
		P(this.#F, e, !0);
	}
	#I = /* @__PURE__ */ N("");
	get libQuery() {
		return U(this.#I);
	}
	set libQuery(e) {
		P(this.#I, e, !0);
	}
	#L = /* @__PURE__ */ N(null);
	get toast() {
		return U(this.#L);
	}
	set toast(e) {
		P(this.#L, e, !0);
	}
	#R = /* @__PURE__ */ N(null);
	get now() {
		return U(this.#R);
	}
	set now(e) {
		P(this.#R, e, !0);
	}
	#z = /* @__PURE__ */ N(0);
	get pos() {
		return U(this.#z);
	}
	set pos(e) {
		P(this.#z, e, !0);
	}
	#B = /* @__PURE__ */ N(!1);
	get playing() {
		return U(this.#B);
	}
	set playing(e) {
		P(this.#B, e, !0);
	}
	#V = /* @__PURE__ */ N(!1);
	get buffering() {
		return U(this.#V);
	}
	set buffering(e) {
		P(this.#V, e, !0);
	}
	#H = /* @__PURE__ */ N(!1);
	get loadingItem() {
		return U(this.#H);
	}
	set loadingItem(e) {
		P(this.#H, e, !0);
	}
	#U = /* @__PURE__ */ N(1);
	get speed() {
		return U(this.#U);
	}
	set speed(e) {
		P(this.#U, e, !0);
	}
	#W = /* @__PURE__ */ N(F({}));
	get speeds() {
		return U(this.#W);
	}
	set speeds(e) {
		P(this.#W, e, !0);
	}
	#G = /* @__PURE__ */ N(F([]));
	get queue() {
		return U(this.#G);
	}
	set queue(e) {
		P(this.#G, e, !0);
	}
	#K = /* @__PURE__ */ N(F({}));
	get progress() {
		return U(this.#K);
	}
	set progress(e) {
		P(this.#K, e, !0);
	}
	#q = /* @__PURE__ */ N(F({}));
	get played() {
		return U(this.#q);
	}
	set played(e) {
		P(this.#q, e, !0);
	}
	#J = /* @__PURE__ */ N(F({}));
	get subscribed() {
		return U(this.#J);
	}
	set subscribed(e) {
		P(this.#J, e, !0);
	}
	#Y = /* @__PURE__ */ N(F({}));
	get bookmarks() {
		return U(this.#Y);
	}
	set bookmarks(e) {
		P(this.#Y, e, !0);
	}
	#X = /* @__PURE__ */ N(F([]));
	get recentStations() {
		return U(this.#X);
	}
	set recentStations(e) {
		P(this.#X, e, !0);
	}
	#Z = /* @__PURE__ */ N(F({}));
	get favorites() {
		return U(this.#Z);
	}
	set favorites(e) {
		P(this.#Z, e, !0);
	}
	#Q = /* @__PURE__ */ N(F({}));
	get saved() {
		return U(this.#Q);
	}
	set saved(e) {
		P(this.#Q, e, !0);
	}
	#$ = /* @__PURE__ */ N(F({}));
	get addedAt() {
		return U(this.#$);
	}
	set addedAt(e) {
		P(this.#$, e, !0);
	}
	#ee = /* @__PURE__ */ N(F([]));
	get history() {
		return U(this.#ee);
	}
	set history(e) {
		P(this.#ee, e, !0);
	}
	#te = /* @__PURE__ */ N(F({}));
	get stats() {
		return U(this.#te);
	}
	set stats(e) {
		P(this.#te, e, !0);
	}
	#ne = /* @__PURE__ */ N(F({ ...Ea }));
	get prefs() {
		return U(this.#ne);
	}
	set prefs(e) {
		P(this.#ne, e, !0);
	}
	#re = /* @__PURE__ */ N(null);
	get sleep() {
		return U(this.#re);
	}
	set sleep(e) {
		P(this.#re, e, !0);
	}
	#ie = /* @__PURE__ */ N(.8);
	get volume() {
		return U(this.#ie);
	}
	set volume(e) {
		P(this.#ie, e, !0);
	}
	#ae = /* @__PURE__ */ N(!1);
	get muted() {
		return U(this.#ae);
	}
	set muted(e) {
		P(this.#ae, e, !0);
	}
	#oe = /* @__PURE__ */ N(!1);
	get restored() {
		return U(this.#oe);
	}
	set restored(e) {
		P(this.#oe, e, !0);
	}
	host;
	api;
	storageKey;
	legacyKey;
	localKey;
	restoreTries = 0;
	#se = /* @__PURE__ */ N(!1);
	get storageError() {
		return U(this.#se);
	}
	set storageError(e) {
		P(this.#se, e, !0);
	}
	engine = new Qi();
	timers = [];
	toastTimer;
	saveTimer;
	searchTimer;
	searchSeq = 0;
	pendingPlay = 0;
	lastSaved = 0;
	pausedAt = 0;
	loadedId = null;
	constructor(e) {
		this.host = e, this.api = e.ondacast, this.supported = !!e.ondacast;
		let t = String(e.user?.id ?? "local");
		this.storageKey = `state_${t.replace(/[^A-Za-z0-9_-]/g, "_")}`, this.legacyKey = `state:${t}`, this.localKey = `tend-media:${this.storageKey}`, this.engine.onEnded = () => this.ended(), this.engine.onError = (e) => {
			this.playing = !1, this.buffering = !1, this.say(e), this.sync();
		}, this.engine.onBuffering = (e) => {
			this.buffering = e && this.playing;
		};
	}
	async start() {
		this.timers.push(setInterval(() => this.tick(), 1e3)), this.timers.push(setInterval(() => this.refreshNowPlaying(), 2e4)), await this.restore(), this.supported && (this.loadHome(), this.sync(!0));
	}
	destroy() {
		for (let e of this.timers) clearInterval(e);
		if (this.timers = [], clearTimeout(this.toastTimer), clearTimeout(this.searchTimer), clearTimeout(this.saveTimer), this.saveTimer = void 0, this.engine.destroy(), !this.restored) return Promise.resolve();
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
		return e && Pi(e) ? e.chapters : [];
	}
	get chapIdx() {
		return aa(this.chapters, this.pos);
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
		return e ? ia(e.lines, this.pos, (e) => e.t) : -1;
	}
	get kindLabel() {
		let e = this.item;
		return e ? e.type === "radio" ? "● LIVE RADIO" : Ni[e.type].toUpperCase() : "";
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
		return e ? Ta[e.type] : ["queue"];
	}
	get activeRtab() {
		let e = this.rightTabs;
		return e.includes(this.rtab) ? this.rtab : e[0];
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
			...ka,
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
		let e = this.item && Pi(this.item) ? { [this.item.id]: {
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
		return ya(this.stats);
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
		this.queue = xa(this.queue, e, t), this.scheduleSave();
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
		return t && Pi(t) && (t.dur || this.progress[e]?.dur) || 0;
	}
	speedFor(e) {
		let t = this.items[e];
		return !t || t.type === "radio" ? 1 : this.speeds[Fi(t)] ?? 1;
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
		return n ? ta(n) : "";
	}
	leftOf(e) {
		let t = this.items[e], n = this.progressOf(e), r = this.durOf(e);
		return t ? t.type === "radio" ? "Live now" : this.isDone(e) ? "Played" : r ? n > 5 ? `${ta((r - n) / this.speedFor(e))} left` : ta(r) : n > 5 ? `${ea(n)} in` : "" : "";
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
				let e = Zi(await this.api.stations.trending(30), "stations").map(Gi).filter((e) => !!e);
				this.remember(e), this.trending = e.map((e) => e.id), this.radioStatus = "ready";
			} catch {
				this.radioStatus = "error";
			}
		}
	}
	async loadStations(e = this.genre, t = !1) {
		let n = this.api, r = Ca.find((t) => t.label === e), i = this.radioLists[e];
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
			let e = [], i = o.page + 1, s = null, c = !1, l = (e) => Zi(e, "stations").map(Gi).filter((e) => !!e);
			if (!r.slugs.length) {
				if (n.stations.browse) {
					let r = Xi(await n.stations.browse(t ? o.cursor ?? void 0 : void 0));
					e = l(r), s = typeof r.next_cursor == "string" && r.next_cursor ? r.next_cursor : null, c = !!s;
				} else e = l(await n.stations.trending(30));
			} else if (n.stations.genre) {
				let t = await Promise.all(r.slugs.map((e) => n.stations.genre(e, i).catch(() => null)));
				if (t.every((e) => e === null)) throw Error("genre unavailable");
				let a = t.map(l);
				for (let t = 0; a.some((e) => t < e.length); t++) for (let n of a) n[t] && e.push(n[t]);
				c = t.some((e) => Xi(e).has_more === !0);
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
		let n = Xi(await this.api.podcasts.get(e, t)), r = Ki(Xi(n.podcast));
		if (!r) throw Error("missing show");
		let i = Zi(n, "episodes").map((e) => qi(e, r)).filter((e) => !!e);
		this.shows = {
			...this.shows,
			[e]: r
		}, this.subscribed[e] && (this.subscribed = {
			...this.subscribed,
			[e]: r
		}), this.remember(i);
		let a = Xi(n.pagination);
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
				let t = Xi(await this.api.podcasts.list({
					sort: "last-episode",
					limit: 24,
					cursor: e ? this.podcastBrowse.cursor ?? void 0 : void 0
				})), n = Zi(t, "podcasts").map(Ki).filter((e) => !!e);
				this.shows = {
					...this.shows,
					...Object.fromEntries(n.map((e) => [e.slug, e]))
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
		let t = this.api, n = wa.find((t) => t.label === e);
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
		let o = a.flatMap((e) => Zi(e, "podcasts").map(Ki).filter((e) => !!e));
		this.shows = {
			...this.shows,
			...Object.fromEntries(o.map((e) => [e.slug, e]))
		}, r({
			slugs: [...new Set(o.map((e) => e.slug))],
			status: "ready"
		});
	}
	async loadBookBrowse(e = !1) {
		if (!(!this.api || this.bookBrowse.status === "loading" || e && !this.bookBrowse.cursor)) {
			this.bookBrowse.status = "loading";
			try {
				let t = Xi(await this.api.audiobooks.list({
					limit: 24,
					cursor: e ? this.bookBrowse.cursor ?? void 0 : void 0
				})), n = Zi(t, "audiobooks").map(Ji).filter((e) => !!e);
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
			let t = Ji(Xi(Xi(await this.api.audiobooks.get(n)).audiobook));
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
			this.newEpisodes = [], this.newStatus = "ready";
			return;
		}
		this.newStatus = "loading";
		let t = {};
		await Promise.all(e.map(async (e) => {
			try {
				let n = await this.fetchShowPage(e, 1);
				t[e] = n.eps.slice(0, 3).map((e) => e.id), !this.showEpisodes[e] && (this.epOrder[e] ?? "new") === "new" && (this.showEpisodes = {
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
		}));
		let n = e.flatMap((e) => t[e] ?? []).map((e) => this.items[e]).filter((e) => e?.type === "podcast");
		this.newEpisodes = n.sort((e, t) => (t.date || "").localeCompare(e.date || "")).slice(0, 8).map((e) => e.id), this.newStatus = Object.keys(t).length ? "ready" : "error";
		let r = e.filter((e) => this.showPrefsOf(e).autoQueue).flatMap((e) => t[e] ?? []).filter((e) => !this.isDone(e) && !this.progressOf(e) && e !== this.now && !this.queue.includes(e) && !this.autoQueued.includes(e));
		if (r.length) {
			for (let e of r) this.queue = la(this.queue, this.upAuto, e);
			this.autoQueued = [...this.autoQueued, ...r].slice(-300), this.say(r.length === 1 ? "A new episode was added to Up next" : `${r.length} new episodes were added to Up next`), this.scheduleSave();
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
				let i = Xi(n), a = Yi(i).map((e) => ({
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
			let t = Xi(await this.api.stations.nowPlaying(e.stationId)), n = (e) => {
				let t = typeof e.title == "string" && e.title !== "Live broadcast" ? e.title : "", n = typeof e.artwork_url == "string" && e.artwork_url.startsWith("https://") ? e.artwork_url : void 0;
				return {
					title: t,
					artist: typeof e.artist == "string" ? e.artist : "",
					art: n,
					at: typeof e.played_at == "string" ? e.played_at : void 0
				};
			}, r = Zi(t, "recent").map(n).filter((e) => e.title), i = this.nowPlaying[e.stationId], a = {
				...n(t),
				recent: r
			};
			this.nowPlaying = {
				...this.nowPlaying,
				[e.stationId]: a
			}, (i?.title !== a.title || i?.art !== a.art) && this.mediaSession(!0);
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
				let e = Zi(await this.api.search(t, "all"), "results");
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
				let t = Xi(await r.stations.search(e, 20, i.page + 1));
				if (n !== this.searchSeq) return;
				let a = Zi(t, "stations").map(Gi).filter((e) => !!e);
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
			let t = Gi(Xi(await this.api?.stations.get(e.id)));
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
		this.showSlug !== e && (this.epFilter = "all", this.epQuery = ""), this.showSlug = e, this.tab = "pod", this.query = "", this.search = {
			q: "",
			hits: [],
			status: "idle"
		}, this.showEpisodes[e]?.status !== "ready" && this.loadShow(e);
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
		e && e.type !== "radio" && (this.progress = da({
			...this.progress,
			[e.id]: {
				pos: Math.round(this.pos),
				dur: this.durOf(e.id),
				at: Date.now()
			}
		}, Pa));
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
		if (this.pos = Pi(n) && n.dur && r >= n.dur - 5 ? 0 : r, n.type === "podcast" && this.pos < 1) {
			let e = this.showPrefsOf(n.show).intro;
			e && (!n.dur || e < n.dur - 30) && (this.pos = e);
		}
		this.queue = sa(this.queue, e), this.upAuto = this.upAuto.filter((t) => t !== e), this.speed = this.speedFor(e), n.type === "radio" && (this.recentStations = [e, ...this.recentStations.filter((t) => t !== e)].slice(0, 6)), Ta[n.type].includes(this.rtab) || (this.rtab = Ta[n.type][0]), this.history = ba(this.history, e, Date.now()), this.playing = !0, this.sync(!0), n.type === "radio" && this.refreshNowPlaying(), this.rtab === "trans" && this.loadTranscript(), this.scheduleSave();
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
			else if (Pi(e) && this.prefs.smartRewind && this.pausedAt) {
				let e = Sa(Date.now() - this.pausedAt);
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
		e && Pi(e) && this.seekTo(fa(e.chapters, this.pos));
	}
	skip(e) {
		let t = this.item;
		if (!t || !Pi(t)) return;
		let n = this.durOf(t.id);
		this.seekTo(Math.max(0, n ? Math.min(n, this.pos + e) : this.pos + e));
	}
	seekTo(e) {
		let t = this.item;
		if (t && Pi(t)) {
			if (this.pos = e, t.type === "book") {
				let { index: n, offset: r } = ua(t.chapters, e), i = t.chapters[n];
				i?.url && this.engine.load(i.url, r);
			} else this.engine.seek(e);
			this.sync();
		}
	}
	seekFraction(e) {
		let t = this.item;
		if (!t || !Pi(t)) return;
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
			let t = aa(e.chapters, this.pos + 1), n = e.chapters[t + 1];
			if (n?.url) {
				this.pos = n.start, this.sleep === "chapter" && (this.sleep = null, this.playing = !1, this.say("Sleep timer: paused at end of chapter")), this.engine.load(n.url, 0), this.sync(), this.rtab === "trans" && this.loadTranscript();
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
		Pi(t) && this.engine.active && (n = (t.type === "book" ? t.chapters[ua(t.chapters, this.pos).index]?.start ?? 0 : 0) + this.engine.time - this.pos, (n < 0 || n > 10) && (n = 0)), t.type === "podcast" && !t.dur && this.engine.duration && (this.items = {
			...this.items,
			[t.id]: {
				...t,
				dur: Math.round(this.engine.duration)
			}
		});
		let r = Pi(t) ? this.durOf(t.id) || 2 ** 53 - 1 : 0, i = pa({
			pos: this.pos,
			speed: this.speed,
			sleep: this.sleep
		}, Pi(t) ? {
			dur: r,
			chapters: t.type === "book" ? [] : t.chapters
		} : null, e, n);
		if (this.pos = i.ended ? this.pos : i.pos, this.sleep = i.sleep, this.playing = i.playing, i.reason === "timer" && this.say("Sleep timer ended. Sweet dreams."), i.reason === "chapter" && this.say("Sleep timer: paused at end of chapter"), this.sync(), this.playing && (this.stats = _a(this.stats, ga(/* @__PURE__ */ new Date()), t.type, e)), this.playing && t.type === "podcast") {
			let e = this.showPrefsOf(t.show).outro, n = this.durOf(t.id);
			if (e && n > e + 30 && this.pos >= n - e) {
				this.ended();
				return;
			}
		}
		Date.now() - this.lastSaved > 1e4 && (this.lastSaved = Date.now(), Pi(t) && this.saveCurrent(), this.scheduleSave());
	}
	playNext(e) {
		this.queue = oa(this.queue, e), this.upAuto = this.upAuto.filter((t) => t !== e), this.say(`Playing next: ${this.items[e]?.title ?? ""}`), this.scheduleSave();
	}
	addToQueue(e) {
		this.queue = la(this.queue, this.upAuto, e), this.upAuto = this.upAuto.filter((t) => t !== e), this.say("Added to queue"), this.scheduleSave();
	}
	removeFromQueue(e) {
		this.queue = sa(this.queue, e), this.upAuto = this.upAuto.filter((t) => t !== e), this.scheduleSave();
	}
	playFrom(e, t, n) {
		if (e === this.now && this.item) {
			this.play(e);
			return;
		}
		if (this.prefs.autoFill && this.items[e]?.type === "podcast") {
			let r = ca(this.queue, this.upAuto, t.filter((e) => this.items[e]), e, (e) => this.isDone(e));
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
			[Fi(t)]: e
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
		let n = Pi(e), r = n ? this.pos : 0, i = Math.max(0, r - 30), a = this.transcript?.lines ?? [], o = n ? a.filter((e, t) => e.t <= r && (a[t + 1]?.t ?? Infinity) > i) : [], s = e.type === "radio" ? this.songOf(e.stationId) : "", c = /* @__PURE__ */ new Date(), l = e.type === "radio" && s || e.title, u = [
			`# ${l}`,
			"",
			`- **Source:** ${e.type === "radio" ? `${e.title} (live radio)` : e.sub}`,
			n ? `- **Clip:** ${ea(i)}–${ea(r)}` : `- **Heard at:** ${c.toLocaleString()}`,
			"- **Saved from:** TEND Media",
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
				this.say("Set up a notebook in TEND Notes to save clips");
				return;
			}
			let a = c.toISOString().slice(0, 16).replace("T", " ").replace(":", "."), o = l.replace(/[\\/:*?"<>|#]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 80) || "Clip";
			await t.create({
				libraryId: n.id,
				name: `Clip ${a} ${o}.md`,
				content: u
			}), this.say(e.type === "radio" ? `Clipped “${l}” to TEND Notes` : `Clip ${ea(i)}–${ea(r)} saved to TEND Notes`);
		} catch {
			this.say("Install TEND Notes to save clips");
		}
	}
	bookmark(e = this.bookId ?? "") {
		let t = this.items[e], n = t?.type === "book" ? t : null;
		if (!n) return;
		let r = this.progressOf(n.id), i = aa(n.chapters, r), a = i >= 0 ? `Chapter ${Li(i)} · ${ea(r - n.chapters[i].start)}` : ea(r);
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
					let { index: e, offset: n } = ua(t.chapters, this.pos), r = t.chapters[e];
					r?.url ? this.engine.load(r.url, n) : this.loadedId = null;
				}
			}
			this.engine.apply({
				playing: this.playing,
				rate: this.live ? 1 : this.speed,
				volume: this.muted ? 0 : this.volume * ha(this.sleep)
			}), this.mediaSession(e);
		}
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
			album: `TEND Media · ${Ni[n.type]}`,
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
		}), a("seekbackward", n.type === "radio" ? null : () => this.skip(-15)), a("seekforward", n.type === "radio" ? null : () => this.skip(30)), a("nexttrack", () => this.next()), a("previoustrack", n.type === "radio" ? null : () => this.previous());
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
			podGenre: this.podGenre
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
			return Ia(JSON.parse(localStorage.getItem(this.localKey) ?? "null"));
		} catch {
			return null;
		}
	}
	async restore() {
		let e = null, t = !0;
		if (this.host.storage) try {
			e = Ia(await this.host.storage.get(this.storageKey)) ?? Ia(await this.host.storage.get(this.legacyKey));
		} catch {
			t = !1;
		}
		let n = this.readLocal(), r = e && n ? (n.savedAt ?? 0) > (e.savedAt ?? 0) ? n : e : e ?? n;
		if (!t && !r) {
			this.storageError || this.say("Could not load your library yet. Changes are not saved until it loads."), this.storageError = !0, this.restoreTries++ < 6 ? setTimeout(() => void this.restore(), 5e3 * this.restoreTries) : this.say("Your library could not be loaded. Reopen TEND Media to try again.");
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
		}, this.history = (e.history ?? []).filter((e) => this.items[e.id]), this.stats = e.stats ?? {}, this.addedAt = e.addedAt ?? {}, this.showPrefs = e.showPrefs ?? {}, this.autoQueued = e.autoQueued ?? [], this.playlists = e.playlists ?? [], this.upAuto = (e.upAuto ?? []).filter((e) => this.queue.includes(e)), this.upFrom = this.upAuto.length ? e.upFrom ?? "" : "", e.podGenre && wa.some((t) => t.label === e.podGenre) && (this.podGenre = e.podGenre), this.prefs = {
			...Ea,
			...e.prefs ?? {}
		}, e.now && this.items[e.now] && !this.now && (this.now = e.now, this.pos = e.pos ?? 0, this.speed = this.speedFor(e.now));
		let t = this.item;
		t?.type === "book" && this.ensureBook(t.id), Object.keys(this.subscribed).length && this.loadNewEpisodes();
	}
}, Ia = (e) => e && typeof e == "object" && e.v === 1 ? e : null, Q = {
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
}, La = /* @__PURE__ */ kr("<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path></path></svg>"), Ra = /* @__PURE__ */ kr("<svg viewBox=\"0 0 24 24\" fill=\"currentColor\" aria-hidden=\"true\"><path></path></svg>");
function $(e, t) {
	let n = ji(t, "size", 3, 16), r = ji(t, "stroke", 3, 0);
	var i = jr(), a = L(i), o = (e) => {
		var i = La(), a = R(i);
		B(() => {
			Z(i, "width", n()), Z(i, "height", n()), Z(i, "stroke-width", r()), Z(a, "d", t.d);
		}), K(e, i);
	}, s = (e) => {
		var r = Ra(), i = R(r);
		B(() => {
			Z(r, "width", n()), Z(r, "height", n()), Z(i, "d", t.d);
		}), K(e, r);
	};
	J(a, (e) => {
		r() ? e(o) : e(s, -1);
	}), K(e, i);
}
//#endregion
//#region src/components/TopBar.svelte
var za = /* @__PURE__ */ G("<header class=\"bar svelte-1h259us\"><span class=\"by svelte-1h259us\">Powered by OndaCast</span> <div class=\"spacer svelte-1h259us\"></div> <label class=\"search svelte-1h259us\"><!> <input type=\"search\" placeholder=\"Search stations, shows, books\" aria-label=\"Search stations, shows and books\" class=\"svelte-1h259us\"/></label> <button class=\"gear svelte-1h259us\" data-pop=\"\" aria-haspopup=\"dialog\" aria-label=\"Playback preferences\" title=\"Playback preferences\"><!></button></header>"), Ba = {
	hash: "svelte-1h259us",
	code: ".bar.svelte-1h259us {height:36px;flex:none;display:flex;align-items:center;gap:10px;padding:0 14px;background:var(--tm-panel-surface);border-bottom:1px solid var(--tm-fg-6);}.by.svelte-1h259us {font-size:11px;color:var(--tm-muted);}.spacer.svelte-1h259us {flex:1;}.gear.svelte-1h259us {width:26px;height:26px;border:0;border-radius:7px;background:none;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;}.gear.svelte-1h259us:hover, .gear[aria-expanded='true'].svelte-1h259us {background:var(--tm-fg-8);color:var(--tm-fg);}.search.svelte-1h259us {display:flex;align-items:center;gap:8px;height:24px;padding:0 10px;border-radius:7px;background:var(--tm-fg-6);width:220px;box-sizing:border-box;color:var(--tm-muted);}.search.svelte-1h259us:focus-within {box-shadow:0 0 0 1px var(--tm-accent);}input.svelte-1h259us {flex:1;min-width:0;border:0;background:none;outline:none;color:var(--tm-fg);font:inherit;font-size:11.5px;padding:0;}input.svelte-1h259us::placeholder {color:var(--tm-muted);opacity:1;}input.svelte-1h259us::-webkit-search-cancel-button {display:none;}"
};
function Va(e, t) {
	Ue(t, !0), $r(e, Ba);
	var n = za(), r = z(I(n), 4), i = I(r);
	$(i, {
		get d() {
			return Q.search;
		},
		size: 13,
		stroke: 2
	});
	var a = z(i, 2);
	yi(a), k(r);
	var o = z(r, 2);
	$(I(o), {
		get d() {
			return Q.gear;
		},
		size: 15,
		stroke: 1.6
	}), k(o), k(n), B(() => {
		bi(a, t.store.query), Z(o, "aria-expanded", t.store.pop === "prefs");
	}), W("input", a, (e) => t.store.setQuery(e.currentTarget.value)), W("keydown", a, (e) => {
		e.key === "Escape" && t.store.setQuery("");
	}), W("click", o, () => t.store.togglePop("prefs")), K(e, n), We();
}
br([
	"input",
	"keydown",
	"click"
]);
//#endregion
//#region src/components/Cover.svelte
var Ha = /* @__PURE__ */ G("<img alt=\"\" loading=\"lazy\" decoding=\"async\" referrerpolicy=\"no-referrer\" class=\"svelte-2fjyqn\"/>"), Ua = /* @__PURE__ */ G("<div><!></div>"), Wa = {
	hash: "svelte-2fjyqn",
	code: ".cover.svelte-2fjyqn {flex:none;display:grid;place-items:center;overflow:hidden;font-family:ui-monospace, Menlo, monospace;font-weight:600;color:rgba(255, 255, 255, .75);}.cover.fill.svelte-2fjyqn {flex:1;}img.svelte-2fjyqn {width:100%;height:100%;object-fit:cover;display:block;}"
};
function Ga(e, t) {
	Ue(t, !0), $r(e, Wa);
	let n = ji(t, "radius", 3, 8), r = ji(t, "mark", 3, ""), i = ji(t, "font", 3, 11), a = ji(t, "fill", 3, !1), o = /* @__PURE__ */ N(!1);
	gn(() => {
		t.art, P(o, !1);
	});
	var s = Ua();
	let c, l;
	var u = I(s), d = (e) => {
		var n = jr();
		Ur(L(n), () => t.art, (e) => {
			var n = Ha();
			B(() => Z(n, "src", t.art)), yr("error", n, () => P(o, !0)), _r(n), K(e, n);
		}), K(e, n);
	}, f = (e) => {
		var t = Ar();
		B(() => q(t, r())), K(e, t);
	};
	J(u, (e) => {
		t.art && !U(o) ? e(d) : e(f, -1);
	}), k(s), B((e) => {
		c = X(s, 1, "cover svelte-2fjyqn", null, c, { fill: a() }), l = si(s, "", l, {
			width: a() ? "100%" : `${t.size}px`,
			height: a() ? "100%" : `${t.size}px`,
			"border-radius": `${n() ?? ""}px`,
			background: e,
			"font-size": `${i() ?? ""}px`
		});
	}, [() => $i(t.hue)]), K(e, s), We();
}
//#endregion
//#region src/components/Sidebar.svelte
var Ka = /* @__PURE__ */ G("<span class=\"count svelte-181dlmc\"> </span>"), qa = /* @__PURE__ */ G("<button><!><span class=\"label svelte-181dlmc\"> </span> <!></button>"), Ja = /* @__PURE__ */ G("<span class=\"eq svelte-181dlmc\" aria-hidden=\"true\"><i class=\"svelte-181dlmc\"></i><i class=\"svelte-181dlmc\"></i><i class=\"svelte-181dlmc\"></i></span>"), Ya = /* @__PURE__ */ G("<button><!> <span class=\"title svelte-181dlmc\"> </span> <!></button>"), Xa = /* @__PURE__ */ G("<div class=\"heading svelte-181dlmc\">Favorite stations</div> <!>", 1), Za = /* @__PURE__ */ G("<nav class=\"side svelte-181dlmc\" aria-label=\"TEND Media\"><!> <!> <div class=\"spacer svelte-181dlmc\"></div> <button class=\"keys svelte-181dlmc\"><!>Keyboard shortcuts<kbd class=\"svelte-181dlmc\">?</kbd></button></nav>"), Qa = {
	hash: "svelte-181dlmc",
	code: ".side.svelte-181dlmc {width:188px;flex:none;padding:18px 12px;display:flex;flex-direction:column;gap:2px;border-right:1px solid var(--tm-fg-6);box-sizing:border-box;overflow:auto;}.tab.svelte-181dlmc {display:flex;align-items:center;gap:11px;height:36px;flex:none;padding:0 10px;border:0;border-radius:9px;background:transparent;color:var(--tm-fg);font-size:13px;font-weight:500;cursor:pointer;text-align:left;}.tab.svelte-181dlmc:hover {background:var(--tm-fg-6);}.tab.on.svelte-181dlmc {background:var(--tm-accent-12);color:var(--tm-accent);}.heading.svelte-181dlmc {margin:22px 10px 8px;font-size:10.5px;letter-spacing:1px;text-transform:uppercase;color:var(--tm-muted);}.show.svelte-181dlmc {display:flex;align-items:center;gap:10px;padding:6px 10px;font-size:12.5px;color:var(--tm-fg);border:0;border-radius:8px;background:none;cursor:pointer;text-align:left;}.show.svelte-181dlmc:hover {background:var(--tm-fg-4);}.show.on.svelte-181dlmc {background:var(--tm-fg-6);}.title.svelte-181dlmc {flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.label.svelte-181dlmc {flex:1;}.count.svelte-181dlmc {font-size:10px;font-weight:700;min-width:18px;height:18px;padding:0 5px;border-radius:9px;display:grid;place-items:center;background:var(--tm-accent);color:var(--tm-on-accent);}.eq.svelte-181dlmc {display:flex;align-items:flex-end;gap:2px;height:12px;flex:none;}.eq.svelte-181dlmc i:where(.svelte-181dlmc) {width:3px;background:var(--tm-accent);border-radius:1px; animation: svelte-181dlmc-eq 1s ease-in-out infinite;}.eq.svelte-181dlmc i:where(.svelte-181dlmc):nth-child(2) {animation-delay:-.3s;}.eq.svelte-181dlmc i:where(.svelte-181dlmc):nth-child(3) {animation-delay:-.6s;}\n  @keyframes svelte-181dlmc-eq { 0%, 100% { height: 4px; } 50% { height: 12px; } }\n  @media (prefers-reduced-motion: reduce) {.eq.svelte-181dlmc i:where(.svelte-181dlmc) { animation: none;height:8px;} }.keys.svelte-181dlmc {display:flex;align-items:center;gap:8px;padding:8px 10px;border:0;border-radius:9px;background:none;color:var(--tm-muted);font-size:11.5px;cursor:pointer;text-align:left;}.keys.svelte-181dlmc:hover {background:var(--tm-fg-6);color:var(--tm-fg);}kbd.svelte-181dlmc {margin-left:auto;font:600 10px ui-monospace, Menlo, monospace;padding:1px 6px;border-radius:4px;border:1px solid var(--tm-fg-16);}.spacer.svelte-181dlmc {flex:1;min-height:12px;}"
};
function $a(e, t) {
	Ue(t, !0), $r(e, Qa);
	let n = ji(t, "store", 7), r = [
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
	], i = /* @__PURE__ */ j(() => Object.values(n().favorites).sort((e, t) => n().lastPlayed(t.id) - n().lastPlayed(e.id)).slice(0, 6)), a = /* @__PURE__ */ j(() => Object.keys(n().subscribed).reduce((e, t) => e + n().newCount(t), 0));
	var o = Za(), s = I(o);
	Y(s, 17, () => r, Wr, (e, t) => {
		var r = /* @__PURE__ */ j(() => m(U(t), 3));
		let i = () => U(r)[0], o = () => U(r)[1], s = () => U(r)[2];
		var c = qa();
		let l;
		var u = I(c);
		$(u, {
			get d() {
				return s();
			},
			size: 17,
			stroke: 1.7
		});
		var d = z(u), f = R(d, !0), p = z(d, 2), h = (e) => {
			var t = Ka(), n = R(t, !0);
			B(() => {
				Z(t, "aria-label", `${U(a) ?? ""} new episodes`), q(n, U(a));
			}), K(e, t);
		};
		J(p, (e) => {
			i() === "mine" && U(a) && e(h);
		}), k(c), B(() => {
			l = X(c, 1, "tab svelte-181dlmc", null, l, { on: n().tab === i() && !n().query }), Z(c, "aria-current", n().tab === i() && !n().query ? "page" : void 0), q(f, o());
		}), W("click", c, () => {
			n().tab = i(), n().setQuery(""), i() === "pod" && (n().showSlug = null), i() === "book" && (n().bookId = null);
		}), K(e, c);
	});
	var c = z(s, 2), l = (e) => {
		var t = Xa();
		Y(z(L(t), 2), 17, () => U(i), (e) => e.id, (e, t) => {
			let r = /* @__PURE__ */ j(() => n().isPlaying(U(t).id));
			var i = Ya();
			let a;
			var o = I(i);
			Ga(o, {
				get hue() {
					return U(t).hue;
				},
				get art() {
					return U(t).art;
				},
				size: 26,
				radius: 6,
				font: 9,
				get mark() {
					return U(t).mark;
				}
			});
			var s = z(o, 2), c = R(s, !0), l = z(s, 2), u = (e) => {
				K(e, Ja());
			};
			J(l, (e) => {
				U(r) && e(u);
			}), k(i), B(() => {
				a = X(i, 1, "show svelte-181dlmc", null, a, { on: U(t).id === n().now }), Z(i, "aria-label", `${U(r) ? "Stop" : "Play"} ${U(t).title ?? ""}`), q(c, U(t).title);
			}), W("click", i, () => U(r) ? n().stop() : n().play(U(t).id)), K(e, i);
		}), K(e, t);
	};
	J(c, (e) => {
		U(i).length && e(l);
	});
	var u = z(c, 4);
	$(I(u), {
		get d() {
			return Q.keyboard;
		},
		size: 14,
		stroke: 1.7
	}), A(2), k(u), k(o), W("click", u, () => n().shortcuts = !0), K(e, o), We();
}
br(["click"]);
//#endregion
//#region src/focus.ts
function eo(e) {
	e.isConnected ? e.focus() : requestAnimationFrame(() => e.focus());
}
//#endregion
//#region src/components/ItemMenu.svelte
var to = /* @__PURE__ */ G("<button role=\"menuitem\" class=\"svelte-8mcf8g\"><!>Play next</button> <button role=\"menuitem\" class=\"svelte-8mcf8g\"><!>Add to Up next</button>", 1), no = /* @__PURE__ */ G("<span class=\"in svelte-8mcf8g\">Added</span>"), ro = /* @__PURE__ */ G("<button role=\"menuitem\" class=\"svelte-8mcf8g\"><!><span class=\"nm svelte-8mcf8g\"> </span><!></button>"), io = /* @__PURE__ */ G("<form class=\"newform svelte-8mcf8g\"><input maxlength=\"80\" placeholder=\"Playlist name\" aria-label=\"New playlist name\" class=\"svelte-8mcf8g\"/> <button type=\"submit\" class=\"svelte-8mcf8g\">Create</button></form>"), ao = /* @__PURE__ */ G("<button role=\"menuitem\" class=\"svelte-8mcf8g\"><!>New playlist…</button>"), oo = /* @__PURE__ */ G("<div role=\"menu\"><!> <div class=\"sep svelte-8mcf8g\">Add to playlist</div> <!> <!> <div class=\"rule svelte-8mcf8g\"></div> <button role=\"menuitem\" class=\"svelte-8mcf8g\"><!> </button></div>"), so = /* @__PURE__ */ G("<span class=\"anchor svelte-8mcf8g\"><button class=\"dots svelte-8mcf8g\" data-pop=\"\" aria-haspopup=\"menu\">•••</button> <!></span>"), co = {
	hash: "svelte-8mcf8g",
	code: ".anchor.svelte-8mcf8g {position:relative;display:inline-flex;flex:none;}.dots.svelte-8mcf8g {width:30px;height:28px;border:0;border-radius:7px;background:transparent;color:var(--tm-muted);cursor:pointer;font-size:11px;letter-spacing:1px;}.dots.svelte-8mcf8g:hover, .dots[aria-expanded='true'].svelte-8mcf8g {background:var(--tm-fg-8);color:var(--tm-fg);}.menu.svelte-8mcf8g {right:0;top:32px;width:230px;padding:6px;z-index:8;}.menu.left.svelte-8mcf8g {left:0;right:auto;}.menu.svelte-8mcf8g button:where(.svelte-8mcf8g) {display:flex;align-items:center;gap:9px;width:100%;height:32px;padding:0 10px;border:0;border-radius:8px;background:none;color:var(--tm-fg);font-size:12px;cursor:pointer;text-align:left;}.menu.svelte-8mcf8g button:where(.svelte-8mcf8g):hover:not(:disabled) {background:var(--tm-fg-8);}.menu.svelte-8mcf8g button:where(.svelte-8mcf8g):disabled {opacity:.55;cursor:default;}.nm.svelte-8mcf8g {flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.in.svelte-8mcf8g {font-size:10.5px;color:var(--tm-accent);}.sep.svelte-8mcf8g {font-size:10px;letter-spacing:.8px;text-transform:uppercase;color:var(--tm-muted);padding:8px 10px 4px;}.rule.svelte-8mcf8g {height:1px;background:var(--tm-fg-8);margin:4px 0;}.newform.svelte-8mcf8g {display:flex;gap:6px;padding:4px 6px;}.newform.svelte-8mcf8g input:where(.svelte-8mcf8g) {flex:1;min-width:0;height:28px;padding:0 8px;border-radius:7px;border:1px solid var(--tm-fg-14);background:var(--tm-fg-4);color:var(--tm-fg);font:inherit;font-size:12px;outline:none;}.newform.svelte-8mcf8g input:where(.svelte-8mcf8g):focus {border-color:var(--tm-accent);}.newform.svelte-8mcf8g button:where(.svelte-8mcf8g) {width:auto;height:28px;padding:0 10px;border-radius:7px;background:var(--tm-accent);color:var(--tm-on-accent);font-weight:650;justify-content:center;}.newform.svelte-8mcf8g button:where(.svelte-8mcf8g):hover {background:var(--tm-accent);}"
};
function lo(e, t) {
	Ue(t, !0), $r(e, co);
	let n = ji(t, "store", 7), r = ji(t, "align", 3, "right"), i = /* @__PURE__ */ j(() => n().items[t.id]), a = /* @__PURE__ */ j(() => n().pop === "item" && n().popItem === t.id), o = /* @__PURE__ */ j(() => n().isDone(t.id)), s = /* @__PURE__ */ j(() => t.id === n().now), c = /* @__PURE__ */ N(!1), l = /* @__PURE__ */ N(""), u = () => {
		n().pop = null, n().popItem = null, P(c, !1);
	};
	function d() {
		let e = {
			id: `pl:${Date.now().toString(36)}`,
			name: U(l).trim().slice(0, 80) || U(i)?.title.slice(0, 40) || "My playlist",
			ids: [t.id],
			at: Date.now()
		};
		n().playlists = [e, ...n().playlists], n().say(`Saved to “${e.name}”`), n().scheduleSave(), u();
	}
	var f = jr(), p = L(f), m = (e) => {
		var f = so(), p = I(f), m = z(p, 2), h = (e) => {
			var i = oo();
			let a;
			var f = I(i), p = (e) => {
				var r = to(), i = L(r);
				$(I(i), {
					get d() {
						return Q.playNext;
					},
					size: 13,
					stroke: 1.8
				}), A(), k(i);
				var a = z(i, 2);
				$(I(a), {
					get d() {
						return Q.plus;
					},
					size: 13,
					stroke: 1.8
				}), A(), k(a), W("click", i, () => {
					n().playNext(t.id), u();
				}), W("click", a, () => {
					n().addToQueue(t.id), u();
				}), K(e, r);
			};
			J(f, (e) => {
				U(s) || e(p);
			});
			var m = z(f, 4);
			Y(m, 17, () => n().playlists, (e) => e.id, (e, r) => {
				var i = ro(), a = I(i);
				$(a, {
					get d() {
						return Q.list;
					},
					size: 13,
					stroke: 1.8
				});
				var o = z(a), s = R(o, !0), c = z(o), l = (e) => {
					K(e, no());
				}, d = /* @__PURE__ */ j(() => U(r).ids.includes(t.id));
				J(c, (e) => {
					U(d) && e(l);
				}), k(i), B((e) => {
					i.disabled = e, q(s, U(r).name);
				}, [() => U(r).ids.includes(t.id)]), W("click", i, () => {
					n().addToPlaylist(U(r).id, t.id), u();
				}), K(e, i);
			});
			var h = z(m, 2), g = (e) => {
				var t = io(), n = I(t);
				yi(n), ei(n, (e) => eo?.(e)), yn(() => Ti(n, () => U(l), (e) => P(l, e))), A(2), k(t), yr("submit", t, (e) => {
					e.preventDefault(), d();
				}), W("keydown", n, (e) => {
					e.key === "Escape" && (e.stopPropagation(), P(c, !1));
				}), K(e, t);
			}, _ = (e) => {
				var t = ao();
				$(I(t), {
					get d() {
						return Q.plus;
					},
					size: 13,
					stroke: 1.8
				}), A(), k(t), W("click", t, () => {
					P(c, !0), P(l, "");
				}), K(e, t);
			};
			J(h, (e) => {
				U(c) ? e(g) : e(_, -1);
			});
			var v = z(h, 4), y = I(v);
			$(y, {
				get d() {
					return Q.check;
				},
				size: 13,
				stroke: 2
			});
			var b = z(y, 1, !0);
			k(v), k(i), B(() => {
				a = X(i, 1, "tm-pop menu svelte-8mcf8g", null, a, { left: r() === "left" }), q(b, U(o) ? "Mark as unplayed" : "Mark as played");
			}), W("click", v, () => {
				n().togglePlayed(t.id), u();
			}), K(e, i);
		};
		J(m, (e) => {
			U(a) && e(h);
		}), k(f), B(() => {
			Z(p, "aria-expanded", U(a)), Z(p, "aria-label", `More for ${U(i).title ?? ""}`);
		}), W("click", p, (e) => {
			e.stopPropagation(), n().openItemMenu(t.id), P(c, !1);
		}), K(e, f);
	};
	J(p, (e) => {
		U(i) && U(i).type !== "radio" && e(m);
	}), K(e, f), We();
}
br(["click", "keydown"]);
//#endregion
//#region src/components/ItemRow.svelte
var uo = /* @__PURE__ */ G("<button class=\"icon svelte-ee3n05\" title=\"Play next\"><!></button> <button class=\"icon svelte-ee3n05\" title=\"Add to queue\"><!></button>", 1), fo = /* @__PURE__ */ G("<div><!> <div class=\"text svelte-ee3n05\"><div> </div> <div class=\"meta svelte-ee3n05\"> </div></div> <!> <!> <button class=\"play svelte-ee3n05\"><!></button></div>"), po = {
	hash: "svelte-ee3n05",
	code: ".row.svelte-ee3n05 {display:flex;align-items:center;gap:14px;padding:10px 8px;border-radius:10px;}.row.svelte-ee3n05:hover {background:var(--tm-fg-5);}.row.cur.svelte-ee3n05 {background:var(--tm-accent-8);}.text.svelte-ee3n05 {flex:1;min-width:0;}.title.svelte-ee3n05 {font-size:13px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.cur.svelte-ee3n05 .title:where(.svelte-ee3n05) {color:var(--tm-accent);}.title.done.svelte-ee3n05 {color:var(--tm-muted);}.meta.svelte-ee3n05 {font-size:11.5px;color:var(--tm-muted);margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.icon.svelte-ee3n05 {width:32px;height:32px;flex:none;border:0;border-radius:8px;background:transparent;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;}.icon.svelte-ee3n05:hover {background:var(--tm-fg-8);color:var(--tm-fg);}.play.svelte-ee3n05 {width:34px;height:34px;flex:none;border:0;border-radius:17px;background:var(--tm-accent);color:var(--tm-on-accent);cursor:pointer;display:grid;place-items:center;}"
};
function mo(e, t) {
	Ue(t, !0), $r(e, po);
	let n = ji(t, "from", 3, ""), r = /* @__PURE__ */ j(() => t.store.items[t.id]), i = /* @__PURE__ */ j(() => t.id === t.store.now), a = /* @__PURE__ */ j(() => U(r) ? U(r).type === "podcast" ? [
		U(r).sub,
		Wi(U(r).date),
		t.store.lenOf(t.id)
	].filter(Boolean).join(" · ") : U(r).type === "radio" ? `${Ni.radio} · ${U(r).sub}` : `${Ni.book} · ${U(r).sub}` : "");
	var o = jr(), s = L(o), c = (e) => {
		var o = fo();
		let s;
		var c = I(o);
		Ga(c, {
			get hue() {
				return U(r).hue;
			},
			get art() {
				return U(r).art;
			},
			get mark() {
				return U(r).mark;
			},
			size: 44
		});
		var l = z(c, 2), u = I(l);
		let d;
		var f = R(u, !0), p = R(z(u, 2), !0);
		k(l);
		var m = z(l, 2), h = (e) => {
			var n = uo(), i = L(n);
			$(I(i), {
				get d() {
					return Q.playNext;
				},
				stroke: 1.8
			}), k(i);
			var a = z(i, 2);
			$(I(a), {
				get d() {
					return Q.plus;
				},
				stroke: 1.8
			}), k(a), B(() => {
				Z(i, "aria-label", `Play next: ${U(r).title ?? ""}`), Z(a, "aria-label", `Add to queue: ${U(r).title ?? ""}`);
			}), W("click", i, () => t.store.playNext(t.id)), W("click", a, () => t.store.addToQueue(t.id)), K(e, n);
		};
		J(m, (e) => {
			U(r).type !== "radio" && !U(i) && e(h);
		});
		var g = z(m, 2), _ = (e) => {
			lo(e, {
				get store() {
					return t.store;
				},
				get id() {
					return t.id;
				}
			});
		};
		J(g, (e) => {
			U(r).type !== "radio" && e(_);
		});
		var v = z(g, 2), y = I(v);
		{
			let e = /* @__PURE__ */ j(() => t.store.isPlaying(t.id) ? U(r).type === "radio" ? Q.stop : Q.pause : Q.play);
			$(y, {
				get d() {
					return U(e);
				},
				size: 14
			});
		}
		k(v), k(o), B((e, t) => {
			s = X(o, 1, "row svelte-ee3n05", null, s, { cur: U(i) }), d = X(u, 1, "title svelte-ee3n05", null, d, { done: e }), q(f, U(r).title), q(p, U(a)), Z(v, "aria-label", `${t ?? ""} ${U(r).title ?? ""}`);
		}, [() => !U(i) && t.store.isDone(t.id), () => t.store.isPlaying(t.id) ? U(r).type === "radio" ? "Stop" : "Pause" : "Play"]), W("click", v, () => t.store.isPlaying(t.id) && U(r).type === "radio" ? t.store.stop() : t.list ? t.store.playFrom(t.id, t.list, n()) : t.store.play(t.id)), K(e, o);
	};
	J(s, (e) => {
		U(r) && e(c);
	}), K(e, o), We();
}
br(["click"]);
//#endregion
//#region src/components/Status.svelte
var ho = /* @__PURE__ */ G("<div class=\"line svelte-hcghuu\" role=\"status\"><span class=\"spin svelte-hcghuu\" aria-hidden=\"true\"></span>Loading…</div>"), go = /* @__PURE__ */ G("<button class=\"svelte-hcghuu\">Try again</button>"), _o = /* @__PURE__ */ G("<div class=\"line svelte-hcghuu\" role=\"alert\"> <!></div>"), vo = /* @__PURE__ */ G("<div class=\"line svelte-hcghuu\"> </div>"), yo = {
	hash: "svelte-hcghuu",
	code: ".line.svelte-hcghuu {display:flex;align-items:center;gap:10px;padding:18px 8px;font-size:12.5px;color:var(--tm-muted);}button.svelte-hcghuu {border:0;background:none;color:var(--tm-accent);font-size:12.5px;cursor:pointer;padding:0;}.spin.svelte-hcghuu {width:14px;height:14px;border-radius:50%;border:2px solid var(--tm-fg-16);border-top-color:var(--tm-accent); animation: svelte-hcghuu-spin .8s linear infinite;}\n  @keyframes svelte-hcghuu-spin { to { transform: rotate(360deg); } }\n  @media (prefers-reduced-motion: reduce) {.spin.svelte-hcghuu { animation: none;} }"
};
function bo(e, t) {
	$r(e, yo);
	let n = ji(t, "empty", 3, ""), r = ji(t, "error", 3, "OndaCast could not be reached.");
	var i = jr(), a = L(i), o = (e) => {
		K(e, ho());
	}, s = (e) => {
		var n = _o(), i = I(n, !0), a = z(i), o = (e) => {
			var n = go();
			W("click", n, function(...e) {
				t.retry?.apply(this, e);
			}), K(e, n);
		};
		J(a, (e) => {
			t.retry && e(o);
		}), k(n), B(() => q(i, r())), K(e, n);
	}, c = (e) => {
		var t = vo(), r = R(t, !0);
		B(() => q(r, n())), K(e, t);
	};
	J(a, (e) => {
		t.status === "loading" ? e(o) : t.status === "error" ? e(s, 1) : n() && e(c, 2);
	}), K(e, i);
}
br(["click"]);
//#endregion
//#region src/components/HomeView.svelte
var xo = /* @__PURE__ */ G("<button class=\"card svelte-oxdkf2\"><!> <span class=\"ctext svelte-oxdkf2\"><span class=\"kind svelte-oxdkf2\"> </span> <span class=\"ctitle svelte-oxdkf2\"> </span> <span class=\"bar svelte-oxdkf2\"><span class=\"svelte-oxdkf2\"></span></span> <span class=\"left svelte-oxdkf2\"> </span></span></button>"), So = /* @__PURE__ */ G("<div class=\"continue svelte-oxdkf2\"></div>"), Co = /* @__PURE__ */ G("<div class=\"start svelte-oxdkf2\"><button class=\"svelte-oxdkf2\">Tune in to live radio</button> <button class=\"svelte-oxdkf2\">Find a podcast</button> <button class=\"svelte-oxdkf2\">Start an audiobook</button></div>"), wo = /* @__PURE__ */ G("<button><span class=\"banner svelte-oxdkf2\"><!><span class=\"live svelte-oxdkf2\"><i class=\"svelte-oxdkf2\"></i>LIVE</span></span> <span class=\"stext svelte-oxdkf2\"><span class=\"stitle svelte-oxdkf2\"> </span><span class=\"song svelte-oxdkf2\"> </span></span></button>"), To = /* @__PURE__ */ G("<div class=\"onair svelte-oxdkf2\"></div>"), Eo = /* @__PURE__ */ G("<h1 class=\"h1 svelte-oxdkf2\"> </h1> <p class=\"lede svelte-oxdkf2\">Pick up where you left off across radio, podcasts and books.</p> <!> <div class=\"section svelte-oxdkf2\"><h2 class=\"svelte-oxdkf2\">On air now</h2><button class=\"link svelte-oxdkf2\">All stations</button></div> <!> <h2 class=\"h2 svelte-oxdkf2\">New from your shows</h2> <!>", 1), Do = {
	hash: "svelte-oxdkf2",
	code: ".h1.svelte-oxdkf2 {font-size:26px;font-weight:650;letter-spacing:-.5px;margin:0;}.lede.svelte-oxdkf2 {font-size:13px;color:var(--tm-muted);margin:4px 0 0;}.continue.svelte-oxdkf2 {display:grid;grid-template-columns:repeat(3, minmax(0, 1fr));gap:12px;margin-top:20px;}.card.svelte-oxdkf2 {display:flex;gap:12px;padding:12px;border:0;border-radius:14px;background:var(--tm-fg-4);color:inherit;cursor:pointer;align-items:center;text-align:left;font:inherit;}.card.svelte-oxdkf2:hover {background:var(--tm-fg-8);}.ctext.svelte-oxdkf2 {min-width:0;flex:1;display:flex;flex-direction:column;gap:4px;}.kind.svelte-oxdkf2 {font-size:10px;letter-spacing:.8px;text-transform:uppercase;color:var(--tm-accent);font-weight:600;}.ctitle.svelte-oxdkf2 {font-size:13px;font-weight:600;line-height:1.25;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.bar.svelte-oxdkf2 {height:3px;border-radius:2px;background:var(--tm-fg-10);margin-top:3px;display:block;}.bar.svelte-oxdkf2 span:where(.svelte-oxdkf2) {display:block;height:3px;border-radius:2px;background:var(--tm-accent);}.left.svelte-oxdkf2 {font-size:11px;color:var(--tm-muted);}.start.svelte-oxdkf2 {display:flex;flex-wrap:wrap;gap:8px;margin-top:18px;}.start.svelte-oxdkf2 button:where(.svelte-oxdkf2) {height:34px;padding:0 16px;border-radius:17px;border:1px solid var(--tm-fg-14);background:var(--tm-fg-4);color:var(--tm-fg);font-size:12.5px;font-weight:600;cursor:pointer;}.start.svelte-oxdkf2 button:where(.svelte-oxdkf2):hover {border-color:var(--tm-accent);}.section.svelte-oxdkf2 {display:flex;align-items:baseline;justify-content:space-between;margin:28px 0 12px;}h2.svelte-oxdkf2 {font-size:15px;font-weight:650;margin:0;}.h2.svelte-oxdkf2 {margin:28px 0 8px;}.link.svelte-oxdkf2 {border:0;background:none;color:var(--tm-accent);font-size:12px;cursor:pointer;padding:0;}.onair.svelte-oxdkf2 {display:grid;grid-template-columns:repeat(4, minmax(0, 1fr));gap:12px;}.station.svelte-oxdkf2 {border:0;padding:0;border-radius:14px;overflow:hidden;background:var(--tm-fg-4);color:inherit;cursor:pointer;text-align:left;font:inherit;display:flex;flex-direction:column;}.station.svelte-oxdkf2:hover {background:var(--tm-fg-8);}.station.cur.svelte-oxdkf2 {box-shadow:inset 0 0 0 1px var(--tm-accent);}.banner.svelte-oxdkf2 {height:78px;display:flex;width:100%;position:relative;}.live.svelte-oxdkf2 {position:absolute;left:10px;top:10px;display:inline-flex;align-items:center;gap:5px;font-size:9.5px;font-weight:700;letter-spacing:.8px;padding:3px 7px;border-radius:20px;background:rgba(0, 0, 0, .45);color:#fff;}.live.svelte-oxdkf2 i:where(.svelte-oxdkf2) {width:5px;height:5px;border-radius:3px;background:var(--tm-live);}.stext.svelte-oxdkf2 {padding:10px 12px 12px;display:flex;flex-direction:column;min-width:0;}.stitle.svelte-oxdkf2 {font-size:12.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.song.svelte-oxdkf2 {font-size:11px;color:var(--tm-muted);margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}"
};
function Oo(e, t) {
	Ue(t, !0), $r(e, Do);
	let n = ji(t, "store", 7);
	var r = Eo(), i = L(r), a = R(i, !0), o = z(i, 4), s = (e) => {
		var t = So();
		Y(t, 20, () => n().continueIds, (e) => e, (e, t) => {
			let r = /* @__PURE__ */ j(() => n().items[t]);
			var i = xo(), a = I(i);
			Ga(a, {
				get hue() {
					return U(r).hue;
				},
				get art() {
					return U(r).art;
				},
				size: 58,
				radius: 10,
				get mark() {
					return U(r).mark;
				}
			});
			var o = z(a, 2), s = I(o), c = R(s, !0), l = z(s, 2), u = R(l, !0), d = z(l, 2), f = I(d);
			let p;
			k(d);
			var m = R(z(d, 2), !0);
			k(o), k(i), B((e, t, n) => {
				Z(i, "aria-label", `${e ?? ""} ${U(r).title ?? ""}`), q(c, Ni[U(r).type]), q(u, U(r).title), p = si(f, "", p, { width: t }), q(m, n);
			}, [
				() => n().isPlaying(t) ? "Pause" : "Continue",
				() => `${n().pctOf(t) ?? ""}%`,
				() => n().leftOf(t)
			]), W("click", i, () => n().play(t)), K(e, i);
		}), k(t), K(e, t);
	}, c = (e) => {
		var t = Co(), r = I(t), i = z(r, 2), a = z(i, 2);
		k(t), W("click", r, () => n().tab = "radio"), W("click", i, () => {
			n().tab = "pod", n().showSlug = null;
		}), W("click", a, () => {
			n().tab = "book", n().bookId = null;
		}), K(e, t);
	};
	J(o, (e) => {
		n().continueIds.length ? e(s) : e(c, -1);
	});
	var l = z(o, 2), u = z(I(l));
	k(l);
	var d = z(l, 2), f = (e) => {
		var t = To();
		Y(t, 20, () => n().onAirIds, (e) => e, (e, t) => {
			let r = /* @__PURE__ */ j(() => n().items[t]);
			var i = wo();
			let a;
			var o = I(i);
			Ga(I(o), {
				get hue() {
					return U(r).hue;
				},
				get art() {
					return U(r).art;
				},
				fill: !0,
				radius: 0,
				get mark() {
					return U(r).mark;
				},
				font: 18
			}), A(), k(o);
			var s = z(o, 2), c = I(s), l = R(c, !0), u = R(z(c), !0);
			k(s), k(i), B((e, o) => {
				a = X(i, 1, "station svelte-oxdkf2", null, a, { cur: t === n().now }), Z(i, "aria-label", `${e ?? ""} ${U(r).title ?? ""}`), q(l, U(r).title), q(u, o);
			}, [() => n().isPlaying(t) ? "Pause" : "Play", () => U(r).type === "radio" ? n().songOf(U(r).stationId) ? `♪ ${n().songOf(U(r).stationId)}` : U(r).sub : ""]), W("click", i, () => n().play(t)), K(e, i);
		}), k(t), K(e, t);
	}, p = (e) => {
		bo(e, {
			get status() {
				return n().radioStatus;
			},
			retry: () => n().loadRadio(),
			empty: "No stations are on air right now."
		});
	};
	J(d, (e) => {
		n().onAirIds.length ? e(f) : e(p, -1);
	}), Y(z(d, 4), 16, () => n().newEpisodes, (e) => e, (e, t) => {
		mo(e, {
			get store() {
				return n();
			},
			get id() {
				return t;
			},
			get list() {
				return n().newEpisodes;
			},
			from: "your new episodes"
		});
	}, (e) => {
		bo(e, {
			get status() {
				return n().newStatus;
			},
			retry: () => n().loadNewEpisodes(),
			empty: "Subscribe to shows in Podcasts and their new episodes land here."
		});
	}), B((e) => q(a, e), [() => na()]), W("click", u, () => n().tab = "radio"), K(e, r), We();
}
br(["click"]);
//#endregion
//#region src/components/FavButton.svelte
var ko = /* @__PURE__ */ G("<button><!></button>"), Ao = {
	hash: "svelte-18vgx0d",
	code: ".fav.svelte-18vgx0d {width:32px;height:32px;flex:none;padding:0;border:0;border-radius:50%;background:transparent;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;transition:color .15s, transform .15s, background .15s;}.fav.svelte-18vgx0d:hover {color:var(--tm-fg);background:var(--tm-fg-8);}.fav.on.svelte-18vgx0d {color:var(--tm-live);}.fav.on.svelte-18vgx0d:hover {color:var(--tm-live);}.fav.solid.svelte-18vgx0d {background:rgba(0, 0, 0, .4);color:#fff;}.fav.solid.on.svelte-18vgx0d {color:var(--tm-live);}.fav.svelte-18vgx0d:active {transform:scale(.9);}\n  @media (prefers-reduced-motion: reduce) {.fav.svelte-18vgx0d {transition:none;} }"
};
function jo(e, t) {
	Ue(t, !0), $r(e, Ao);
	let n = ji(t, "size", 3, 16), r = ji(t, "solid", 3, !1), i = /* @__PURE__ */ j(() => t.store.items[t.id]), a = /* @__PURE__ */ j(() => t.store.isFavorite(t.id)), o = /* @__PURE__ */ j(() => U(i) ? U(i).type === "radio" ? U(a) ? "Remove from favorite stations" : "Add to favorite stations" : U(i).type === "book" ? U(a) ? "Remove from My Media" : "Save to My Media" : U(a) ? `Unsubscribe from ${U(i).sub}` : `Subscribe to ${U(i).sub}` : "");
	var s = jr(), c = L(s), l = (e) => {
		var i = ko();
		let s;
		var c = I(i);
		{
			let e = /* @__PURE__ */ j(() => U(a) ? 0 : 1.8);
			$(c, {
				get d() {
					return Q.heart;
				},
				get size() {
					return n();
				},
				get stroke() {
					return U(e);
				}
			});
		}
		k(i), B(() => {
			s = X(i, 1, "fav svelte-18vgx0d", null, s, {
				on: U(a),
				solid: r()
			}), Z(i, "aria-pressed", U(a)), Z(i, "aria-label", U(o)), Z(i, "title", U(o));
		}), W("click", i, (e) => {
			e.stopPropagation(), t.store.toggleFavorite(t.id);
		}), K(e, i);
	};
	J(c, (e) => {
		U(i) && e(l);
	}), K(e, s), We();
}
br(["click"]);
//#endregion
//#region src/components/WeekCard.svelte
var Mo = /* @__PURE__ */ G("<span class=\"streak svelte-155zco6\"><!> </span>"), No = /* @__PURE__ */ G("<span class=\"tip svelte-155zco6\"> </span>"), Po = /* @__PURE__ */ G("<div class=\"col svelte-155zco6\" role=\"presentation\"><span class=\"track svelte-155zco6\"><span></span> <!></span> <span> </span></div>"), Fo = /* @__PURE__ */ G("<div class=\"svelte-155zco6\"><dt class=\"svelte-155zco6\"> </dt><dd class=\"svelte-155zco6\"> </dd></div>"), Io = /* @__PURE__ */ G("<tr><th scope=\"row\"> </th><td> </td></tr>"), Lo = /* @__PURE__ */ G("<section class=\"week svelte-155zco6\" aria-label=\"Your listening this week\"><div class=\"hero svelte-155zco6\"><span class=\"eyebrow svelte-155zco6\">Your week</span> <strong class=\"svelte-155zco6\"> </strong> <span class=\"sub svelte-155zco6\">listened in the last 7 days</span> <!></div> <div class=\"chart svelte-155zco6\" role=\"img\" aria-label=\"Minutes listened per day, last seven days\"></div> <dl class=\"split svelte-155zco6\"></dl> <table class=\"sr svelte-155zco6\"><caption>Minutes listened per day</caption><tbody></tbody></table></section>"), Ro = {
	hash: "svelte-155zco6",
	code: ".week.svelte-155zco6 {display:grid;grid-template-columns:minmax(150px, 1fr) minmax(200px, 1.6fr) minmax(130px, 1fr);grid-template-areas:'hero chart split';gap:14px 22px;align-items:center;padding:18px 20px;border-radius:16px;background:linear-gradient(135deg, var(--tm-accent-12), var(--tm-fg-4));border:1px solid var(--tm-fg-7);}.hero.svelte-155zco6 {grid-area:hero;display:flex;flex-direction:column;gap:2px;min-width:0;}.eyebrow.svelte-155zco6 {font-size:10.5px;letter-spacing:1px;text-transform:uppercase;color:var(--tm-accent);font-weight:650;}strong.svelte-155zco6 {font-size:30px;font-weight:700;letter-spacing:-.6px;line-height:1.1;}.sub.svelte-155zco6 {font-size:11.5px;color:var(--tm-muted);}.streak.svelte-155zco6 {display:inline-flex;align-items:center;gap:5px;margin-top:8px;width:fit-content;font-size:11px;font-weight:650;padding:3px 9px;border-radius:20px;background:var(--tm-fg-8);}.chart.svelte-155zco6 {grid-area:chart;display:grid;grid-template-columns:repeat(7, 1fr);gap:8px;height:120px;padding-top:24px;box-sizing:border-box;align-items:end;}.col.svelte-155zco6 {position:relative;display:flex;flex-direction:column;align-items:center;gap:6px;height:100%;}.track.svelte-155zco6 {position:relative;flex:1;width:100%;max-width:22px;display:flex;align-items:flex-end;justify-content:center;border-bottom:1px solid var(--tm-fg-12);}.bar.svelte-155zco6 {display:block;width:100%;border-radius:4px 4px 0 0;background:color-mix(in srgb, var(--tm-accent) 55%, transparent);}.bar.today.svelte-155zco6 {background:var(--tm-accent);}.day.svelte-155zco6 {font-size:10px;color:var(--tm-muted);}.day.today.svelte-155zco6 {color:var(--tm-fg);font-weight:650;}.tip.svelte-155zco6 {position:absolute;left:50%;transform:translateX(-50%);white-space:nowrap;font-size:11px;padding:4px 8px;border-radius:6px;background:var(--tm-fg);color:var(--tm-bg);pointer-events:none;z-index:2;}.split.svelte-155zco6 {grid-area:split;margin:0;display:grid;gap:8px;}.split.svelte-155zco6 div:where(.svelte-155zco6) {display:flex;justify-content:space-between;gap:10px;font-size:12px;}dt.svelte-155zco6 {color:var(--tm-muted);}dd.svelte-155zco6 {margin:0;font-weight:600;font-variant-numeric:tabular-nums;}.sr.svelte-155zco6 {position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;}\n  /* Medium widths: hero and split on the left, chart on the right. */\n  @container (max-width: 760px) {.week.svelte-155zco6 {grid-template-columns:minmax(150px, 1fr) minmax(180px, 1.3fr);grid-template-areas:'hero chart' 'split chart';align-items:start;}.split.svelte-155zco6 {gap:5px;} }\n  @container (max-width: 420px) {.week.svelte-155zco6 {grid-template-columns:1fr;grid-template-areas:'hero' 'chart' 'split';} }"
};
function zo(e, t) {
	Ue(t, !0), $r(e, Ro);
	let n = /* @__PURE__ */ j(() => t.store.week), r = /* @__PURE__ */ j(() => Math.max(60, ...U(n).days.map((e) => e.seconds))), i = (e) => e < 60 ? e ? "<1 min" : "0 min" : ta(e), a = [
		["radio", "Radio"],
		["podcast", "Podcasts"],
		["book", "Audiobooks"]
	], o = /* @__PURE__ */ N(-1);
	var s = Lo(), c = I(s), l = z(I(c), 2), u = R(l, !0), d = z(l, 4), f = (e) => {
		var t = Mo(), r = I(t);
		$(r, {
			get d() {
				return Q.flame;
			},
			size: 13,
			stroke: 1.8
		});
		var i = z(r);
		k(t), B(() => q(i, `${U(n).streak ?? ""}-day streak`)), K(e, t);
	};
	J(d, (e) => {
		U(n).streak > 1 && e(f);
	}), k(c);
	var p = z(c, 2);
	Y(p, 23, () => U(n).days, (e) => e.key, (e, t, n) => {
		let a = /* @__PURE__ */ j(() => U(t).seconds ? Math.max(4, U(t).seconds / U(r) * 100) : 0);
		var s = Po(), c = I(s), l = I(c);
		let u, d;
		var f = z(l, 2), p = (e) => {
			var n = No();
			let r;
			var o = R(n);
			B((e) => {
				r = si(n, "", r, { bottom: `calc(${U(a) ?? ""}% + 6px)` }), q(o, `${U(t).label ?? ""} · ${e ?? ""}`);
			}, [() => i(U(t).seconds)]), K(e, n);
		};
		J(f, (e) => {
			U(o) === U(n) && e(p);
		}), k(c);
		var m = z(c, 2);
		let h;
		var g = R(m, !0);
		k(s), B((e) => {
			u = X(l, 1, "bar svelte-155zco6", null, u, { today: U(n) === 6 }), d = si(l, "", d, { height: `${U(a) ?? ""}%` }), h = X(m, 1, "day svelte-155zco6", null, h, { today: U(n) === 6 }), q(g, e);
		}, [() => U(t).label.slice(0, 2)]), yr("pointerenter", s, () => P(o, U(n), !0)), yr("pointerleave", s, () => P(o, -1)), K(e, s);
	}), k(p);
	var h = z(p, 2);
	Y(h, 21, () => a, ([e, t]) => e, (e, t) => {
		var r = /* @__PURE__ */ j(() => m(U(t), 2));
		let a = () => U(r)[0], o = () => U(r)[1];
		var s = Fo(), c = I(s), l = R(c, !0), u = R(z(c), !0);
		k(s), B((e) => {
			q(l, o()), q(u, e);
		}, [() => i(U(n).byKind[a()])]), K(e, s);
	}), k(h);
	var g = z(h, 2), _ = z(I(g));
	Y(_, 21, () => U(n).days, (e) => e.key, (e, t) => {
		var n = Io(), r = I(n), i = R(r, !0), a = R(z(r), !0);
		k(n), B((e) => {
			q(i, U(t).label), q(a, e);
		}, [() => Math.round(U(t).seconds / 60)]), K(e, n);
	}), k(_), k(g), k(s), B((e) => q(u, e), [() => i(U(n).total)]), K(e, s), We();
}
//#endregion
//#region src/components/MyMediaView.svelte
var Bo = /* @__PURE__ */ G("<button> <span class=\"n svelte-ube16v\"> </span></button>"), Vo = /* @__PURE__ */ G("<div class=\"welcome svelte-ube16v\"><div class=\"wicon svelte-ube16v\"><!></div> <h2 class=\"svelte-ube16v\">Your library starts here</h2> <p class=\"svelte-ube16v\">Tap the heart on a station to keep it here, subscribe to shows, and save audiobooks. Everything you play is remembered, with your place in every episode and book.</p> <div class=\"cta svelte-ube16v\"><button class=\"svelte-ube16v\">Find stations</button> <button class=\"svelte-ube16v\">Browse podcasts</button> <button class=\"svelte-ube16v\">Browse audiobooks</button></div></div>"), Ho = /* @__PURE__ */ G("<button class=\"rcard svelte-ube16v\"><!> <span class=\"rtext svelte-ube16v\"><span class=\"kind svelte-ube16v\"> </span> <span class=\"rtitle svelte-ube16v\"> </span> <span class=\"prog svelte-ube16v\"><span class=\"svelte-ube16v\"></span></span> <span class=\"meta svelte-ube16v\"> </span></span> <span class=\"rplay svelte-ube16v\"><!></span></button>"), Uo = /* @__PURE__ */ G("<section class=\"svelte-ube16v\"><div class=\"sh svelte-ube16v\"><h2 class=\"svelte-ube16v\">Continue listening</h2><span class=\"svelte-ube16v\"> </span></div> <div class=\"resume svelte-ube16v\"></div></section>"), Wo = /* @__PURE__ */ G("<form><input class=\"rename svelte-ube16v\" maxlength=\"80\" aria-label=\"Playlist name\"/></form>"), Go = /* @__PURE__ */ G("<button class=\"plname svelte-ube16v\" title=\"Rename\"> </button>"), Ko = /* @__PURE__ */ G("<div><!> <button class=\"pltitle svelte-ube16v\"> <small class=\"svelte-ube16v\"> </small></button> <button class=\"plrm svelte-ube16v\"><!></button></div>"), qo = /* @__PURE__ */ G("<p class=\"none svelte-ube16v\">This playlist is empty. Use ••• on any episode or book to add to it.</p>"), Jo = /* @__PURE__ */ G("<div class=\"plitems svelte-ube16v\"></div>"), Yo = /* @__PURE__ */ G("<div><div class=\"plhead svelte-ube16v\"><button class=\"mosaic svelte-ube16v\"><!> <span class=\"mplay svelte-ube16v\"><!></span></button> <div class=\"pltext svelte-ube16v\"><!> <span class=\"plmeta svelte-ube16v\"> </span></div> <button class=\"plbtn primary svelte-ube16v\"><!>Play</button> <button class=\"plbtn svelte-ube16v\" title=\"Shuffle\"><!></button> <button class=\"plbtn svelte-ube16v\"><!></button> <button><!></button></div> <!></div>"), Xo = /* @__PURE__ */ G("<section class=\"svelte-ube16v\"><div class=\"sh svelte-ube16v\"><h2 class=\"svelte-ube16v\">Playlists</h2><span class=\"svelte-ube16v\"> </span></div> <div class=\"pls svelte-ube16v\"></div></section>"), Zo = /* @__PURE__ */ G("<button class=\"all svelte-ube16v\">See all</button>"), Qo = /* @__PURE__ */ G("<div><button class=\"tbody svelte-ube16v\"><span class=\"banner svelte-ube16v\"><!> <span class=\"live svelte-ube16v\"><i class=\"svelte-ube16v\"></i>LIVE</span> <span class=\"tplay svelte-ube16v\"><!></span></span> <span class=\"ttext svelte-ube16v\"><span class=\"ttitle svelte-ube16v\"> </span><span class=\"tsub svelte-ube16v\"> </span></span></button> <span class=\"tfav svelte-ube16v\"><!></span></div>"), $o = /* @__PURE__ */ G("<div class=\"tiles svelte-ube16v\"></div>"), es = /* @__PURE__ */ G("<button class=\"link svelte-ube16v\">Find stations</button>"), ts = /* @__PURE__ */ G("<p class=\"none svelte-ube16v\"> <!></p>"), ns = /* @__PURE__ */ G("<section class=\"svelte-ube16v\"><div class=\"sh svelte-ube16v\"><h2 class=\"svelte-ube16v\">Favorite stations</h2><span class=\"svelte-ube16v\"> </span><!></div> <!></section>"), rs = /* @__PURE__ */ G("<span class=\"badge svelte-ube16v\"> </span>"), is = /* @__PURE__ */ G("<button class=\"card svelte-ube16v\"><span class=\"art svelte-ube16v\"><!><!></span> <span class=\"ctitle svelte-ube16v\"> </span> <span class=\"csub svelte-ube16v\"> </span></button>"), as = /* @__PURE__ */ G("<div class=\"cards svelte-ube16v\"></div>"), os = /* @__PURE__ */ G("<button class=\"link svelte-ube16v\">Browse podcasts</button>"), ss = /* @__PURE__ */ G("<section class=\"svelte-ube16v\"><div class=\"sh svelte-ube16v\"><h2 class=\"svelte-ube16v\">Your shows</h2><span class=\"svelte-ube16v\"> </span><!></div> <!></section>"), cs = /* @__PURE__ */ G("<span class=\"bprog svelte-ube16v\"><span class=\"svelte-ube16v\"></span></span>"), ls = /* @__PURE__ */ G("<div class=\"bwrap svelte-ube16v\"><button class=\"card svelte-ube16v\"><span class=\"art tall svelte-ube16v\"><!> <!></span> <span class=\"ctitle svelte-ube16v\"> </span> <span> </span></button> <span class=\"bfav svelte-ube16v\"><!></span></div>"), us = /* @__PURE__ */ G("<div class=\"cards books svelte-ube16v\"></div>"), ds = /* @__PURE__ */ G("<button class=\"link svelte-ube16v\">Browse audiobooks</button>"), fs = /* @__PURE__ */ G("<section class=\"svelte-ube16v\"><div class=\"sh svelte-ube16v\"><h2 class=\"svelte-ube16v\">Audiobooks</h2><span class=\"svelte-ube16v\"> </span><!></div> <!></section>"), ps = /* @__PURE__ */ G("<div><!> <button class=\"htext svelte-ube16v\"><span class=\"htitle svelte-ube16v\"> </span> <span class=\"hmeta svelte-ube16v\"> </span></button> <!> <!> <button class=\"hplay svelte-ube16v\"><!></button></div>"), ms = /* @__PURE__ */ G("<section class=\"svelte-ube16v\"><div class=\"sh svelte-ube16v\"><h2 class=\"svelte-ube16v\">Recently played</h2><span class=\"svelte-ube16v\"> </span><button class=\"all svelte-ube16v\">Clear history</button></div> <div class=\"hist svelte-ube16v\"></div></section>"), hs = /* @__PURE__ */ G("<!> <!> <!> <!> <!> <!>", 1), gs = /* @__PURE__ */ G("<div class=\"head svelte-ube16v\"><div><h1 class=\"h1 svelte-ube16v\">My Media</h1> <p class=\"lede svelte-ube16v\">Your stations, shows and books, and everything you have been listening to.</p></div> <label class=\"filter svelte-ube16v\"><!> <input type=\"search\" placeholder=\"Filter your library\" aria-label=\"Filter your library\" class=\"svelte-ube16v\"/></label></div> <!> <div class=\"bar svelte-ube16v\"><div class=\"kinds svelte-ube16v\" role=\"group\" aria-label=\"Show\"></div> <label class=\"sort svelte-ube16v\">Sort <select aria-label=\"Sort\" class=\"svelte-ube16v\"><option>Recently played</option><option>Recently added</option><option>Title A–Z</option></select></label></div> <!>", 1), _s = {
	hash: "svelte-ube16v",
	code: ".head.svelte-ube16v {display:flex;align-items:flex-end;justify-content:space-between;gap:16px;margin-bottom:18px;}.h1.svelte-ube16v {font-size:26px;font-weight:650;letter-spacing:-.5px;margin:0;}.lede.svelte-ube16v {font-size:13px;color:var(--tm-muted);margin:4px 0 0;}.filter.svelte-ube16v {display:flex;align-items:center;gap:8px;height:30px;padding:0 12px;border-radius:9px;background:var(--tm-fg-6);color:var(--tm-muted);width:220px;flex:none;}.filter.svelte-ube16v:focus-within {box-shadow:0 0 0 1px var(--tm-accent);}.filter.svelte-ube16v input:where(.svelte-ube16v) {flex:1;min-width:0;border:0;background:none;outline:none;color:var(--tm-fg);font:inherit;font-size:12px;}.bar.svelte-ube16v {display:flex;align-items:center;justify-content:space-between;gap:12px;margin:20px 0 4px;flex-wrap:wrap;}.kinds.svelte-ube16v {display:flex;gap:8px;flex-wrap:wrap;}.chip.svelte-ube16v {height:30px;padding:0 12px 0 14px;border-radius:15px;border:1px solid var(--tm-fg-16);background:transparent;color:var(--tm-fg);font-size:12px;font-weight:500;cursor:pointer;display:flex;align-items:center;gap:7px;}.chip.svelte-ube16v .n:where(.svelte-ube16v) {font-size:10.5px;min-width:18px;padding:1px 6px;border-radius:10px;background:var(--tm-fg-8);font-variant-numeric:tabular-nums;}.chip.on.svelte-ube16v {border-color:var(--tm-accent);background:var(--tm-accent);color:var(--tm-on-accent);}.chip.on.svelte-ube16v .n:where(.svelte-ube16v) {background:color-mix(in srgb, var(--tm-on-accent) 18%, transparent);}.sort.svelte-ube16v {display:flex;align-items:center;gap:8px;font-size:12px;color:var(--tm-muted);}select.svelte-ube16v {height:30px;border-radius:8px;border:1px solid var(--tm-fg-14);background:var(--tm-panel);color:var(--tm-fg);font:inherit;font-size:12px;padding:0 8px;}section.svelte-ube16v {margin-top:24px;}.sh.svelte-ube16v {display:flex;align-items:baseline;gap:8px;margin-bottom:12px;}.sh.svelte-ube16v h2:where(.svelte-ube16v) {font-size:15px;font-weight:650;margin:0;}.sh.svelte-ube16v > span:where(.svelte-ube16v) {font-size:11px;color:var(--tm-muted);font-variant-numeric:tabular-nums;}.all.svelte-ube16v, .link.svelte-ube16v {margin-left:auto;border:0;background:none;color:var(--tm-accent);font-size:12px;cursor:pointer;padding:0;font:inherit;font-size:12px;}.link.svelte-ube16v {margin-left:4px;}.none.svelte-ube16v {font-size:12.5px;color:var(--tm-muted);margin:0;padding:14px 16px;border-radius:12px;background:var(--tm-fg-4);}.resume.svelte-ube16v {display:grid;grid-template-columns:repeat(auto-fill, minmax(240px, 1fr));gap:10px;}.rcard.svelte-ube16v {display:flex;align-items:center;gap:12px;padding:10px;border:0;border-radius:14px;background:var(--tm-fg-4);color:inherit;cursor:pointer;text-align:left;font:inherit;}.rcard.svelte-ube16v:hover {background:var(--tm-fg-8);}.rtext.svelte-ube16v {flex:1;min-width:0;display:flex;flex-direction:column;gap:3px;}.kind.svelte-ube16v {font-size:9.5px;letter-spacing:.8px;text-transform:uppercase;color:var(--tm-accent);font-weight:650;}.rtitle.svelte-ube16v {font-size:12.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.prog.svelte-ube16v, .bprog.svelte-ube16v {display:block;height:3px;border-radius:2px;background:var(--tm-fg-10);}.prog.svelte-ube16v span:where(.svelte-ube16v), .bprog.svelte-ube16v span:where(.svelte-ube16v) {display:block;height:3px;border-radius:2px;background:var(--tm-accent);}.meta.svelte-ube16v {font-size:11px;color:var(--tm-muted);}.rplay.svelte-ube16v {width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:var(--tm-accent);color:var(--tm-on-accent);flex:none;}.tiles.svelte-ube16v {display:grid;grid-template-columns:repeat(auto-fill, minmax(150px, 1fr));gap:12px;}.tile.svelte-ube16v {position:relative;border-radius:14px;overflow:hidden;background:var(--tm-fg-4);}.tile.svelte-ube16v:hover {background:var(--tm-fg-8);}.tile.cur.svelte-ube16v {box-shadow:inset 0 0 0 1px var(--tm-accent);}.tbody.svelte-ube16v {display:flex;flex-direction:column;width:100%;border:0;padding:0;background:none;color:inherit;cursor:pointer;text-align:left;font:inherit;}.banner.svelte-ube16v {height:86px;display:flex;width:100%;position:relative;}.live.svelte-ube16v {position:absolute;left:8px;top:8px;display:inline-flex;align-items:center;gap:5px;font-size:9px;font-weight:700;letter-spacing:.8px;padding:3px 7px;border-radius:20px;background:rgba(0, 0, 0, .45);color:#fff;}.live.svelte-ube16v i:where(.svelte-ube16v) {width:5px;height:5px;border-radius:3px;background:var(--tm-live);}.tplay.svelte-ube16v {position:absolute;right:8px;bottom:8px;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:var(--tm-accent);color:var(--tm-on-accent);box-shadow:0 6px 16px rgba(0, 0, 0, .35);opacity:0;transform:translateY(4px);transition:opacity .15s, transform .15s;}.tile.svelte-ube16v:hover .tplay:where(.svelte-ube16v), .tile.cur.svelte-ube16v .tplay:where(.svelte-ube16v), .tbody.svelte-ube16v:focus-visible .tplay:where(.svelte-ube16v) {opacity:1;transform:none;}.tfav.svelte-ube16v {position:absolute;right:6px;top:6px;}.ttext.svelte-ube16v {padding:9px 11px 11px;display:flex;flex-direction:column;min-width:0;}.ttitle.svelte-ube16v {font-size:12.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.tsub.svelte-ube16v {font-size:11px;color:var(--tm-muted);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.cards.svelte-ube16v {display:grid;grid-template-columns:repeat(auto-fill, minmax(124px, 1fr));gap:16px;}.card.svelte-ube16v {display:flex;flex-direction:column;gap:3px;border:0;padding:0;background:none;color:inherit;cursor:pointer;text-align:left;font:inherit;min-width:0;width:100%;}.art.svelte-ube16v {position:relative;display:flex;aspect-ratio:1;border-radius:12px;overflow:hidden;box-shadow:0 10px 24px rgba(0, 0, 0, .28);margin-bottom:6px;transition:transform .15s;}.art.tall.svelte-ube16v {aspect-ratio:.72;border-radius:5px 10px 10px 5px;}.card.svelte-ube16v:hover .art:where(.svelte-ube16v) {transform:translateY(-2px);}.badge.svelte-ube16v {position:absolute;left:8px;top:8px;font-size:10px;font-weight:700;padding:3px 8px;border-radius:20px;background:var(--tm-accent);color:var(--tm-on-accent);}.bprog.svelte-ube16v {position:absolute;left:8px;right:8px;bottom:8px;background:rgba(0, 0, 0, .45);}.ctitle.svelte-ube16v {font-size:12.5px;font-weight:600;line-height:1.3;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical;}.csub.svelte-ube16v {font-size:11px;color:var(--tm-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.csub.done.svelte-ube16v {color:var(--tm-accent);}.bwrap.svelte-ube16v {position:relative;}.bfav.svelte-ube16v {position:absolute;right:6px;top:6px;}.hist.svelte-ube16v {display:flex;flex-direction:column;}.hrow.svelte-ube16v {display:flex;align-items:center;gap:12px;padding:8px;border-radius:10px;}.hrow.svelte-ube16v:hover {background:var(--tm-fg-5);}.hrow.cur.svelte-ube16v {background:var(--tm-accent-8);}.htext.svelte-ube16v {flex:1;min-width:0;display:flex;flex-direction:column;border:0;padding:0;background:none;color:inherit;cursor:pointer;text-align:left;font:inherit;}.htitle.svelte-ube16v {font-size:12.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.hmeta.svelte-ube16v {font-size:11px;color:var(--tm-muted);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.hplay.svelte-ube16v {width:30px;height:30px;flex:none;border:0;border-radius:50%;background:var(--tm-fg-8);color:var(--tm-fg);cursor:pointer;display:grid;place-items:center;}.hplay.svelte-ube16v:hover {background:var(--tm-accent);color:var(--tm-on-accent);}.pls.svelte-ube16v {display:grid;gap:8px;}.pl.svelte-ube16v {border-radius:14px;background:var(--tm-fg-4);}.pl.open.svelte-ube16v {background:var(--tm-fg-6);}.plhead.svelte-ube16v {display:flex;align-items:center;gap:10px;padding:10px;}.mosaic.svelte-ube16v {position:relative;width:52px;height:52px;flex:none;border:0;padding:0;border-radius:10px;overflow:hidden;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;background:var(--tm-fg-8);cursor:pointer;}.mosaic.svelte-ube16v > .cover {width:100% !important;height:100% !important;}.mplay.svelte-ube16v {position:absolute;inset:0;display:grid;place-items:center;background:rgba(0, 0, 0, .45);color:#fff;opacity:0;transition:opacity .15s;}.mosaic.svelte-ube16v:hover .mplay:where(.svelte-ube16v), .mosaic.svelte-ube16v:focus-visible .mplay:where(.svelte-ube16v) {opacity:1;}.pltext.svelte-ube16v {flex:1;min-width:0;display:flex;flex-direction:column;gap:2px;}.plname.svelte-ube16v {border:0;padding:0;background:none;color:var(--tm-fg);font:inherit;font-size:13px;font-weight:650;text-align:left;cursor:text;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.rename.svelte-ube16v {width:100%;height:26px;padding:0 8px;border-radius:7px;border:1px solid var(--tm-accent);background:var(--tm-fg-4);color:var(--tm-fg);font:inherit;font-size:13px;outline:none;}.plmeta.svelte-ube16v {font-size:11px;color:var(--tm-muted);}.plbtn.svelte-ube16v {height:30px;min-width:30px;padding:0 8px;border:0;border-radius:8px;background:var(--tm-fg-6);color:var(--tm-fg);cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;font-size:12px;font-weight:600;flex:none;}.plbtn.svelte-ube16v:hover {background:var(--tm-fg-12);}.plbtn.primary.svelte-ube16v {background:var(--tm-accent);color:var(--tm-on-accent);padding:0 12px;}.plbtn.danger.svelte-ube16v {background:color-mix(in srgb, var(--tm-live) 25%, transparent);color:var(--tm-live);}.plitems.svelte-ube16v {padding:0 10px 10px 72px;display:flex;flex-direction:column;}.plrow.svelte-ube16v {display:flex;align-items:center;gap:10px;padding:5px 6px;border-radius:8px;}.plrow.svelte-ube16v:hover {background:var(--tm-fg-5);}.plrow.cur.svelte-ube16v .pltitle:where(.svelte-ube16v) {color:var(--tm-accent);}.pltitle.svelte-ube16v {flex:1;min-width:0;display:flex;flex-direction:column;border:0;padding:0;background:none;color:var(--tm-fg);font:inherit;font-size:12px;font-weight:600;text-align:left;cursor:pointer;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}.pltitle.svelte-ube16v small:where(.svelte-ube16v) {font-size:10.5px;font-weight:400;color:var(--tm-muted);}.plrm.svelte-ube16v {width:24px;height:24px;border:0;border-radius:6px;background:none;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;}.plrm.svelte-ube16v:hover {background:var(--tm-fg-8);color:var(--tm-fg);}.welcome.svelte-ube16v {margin-top:26px;padding:34px 28px;border-radius:18px;text-align:center;background:var(--tm-fg-4);border:1px dashed var(--tm-fg-14);}.wicon.svelte-ube16v {width:54px;height:54px;margin:0 auto 12px;border-radius:16px;display:grid;place-items:center;background:var(--tm-accent-12);color:var(--tm-accent);}.welcome.svelte-ube16v h2:where(.svelte-ube16v) {font-size:17px;margin:0;}.welcome.svelte-ube16v p:where(.svelte-ube16v) {font-size:12.5px;color:var(--tm-muted);max-width:440px;margin:8px auto 0;line-height:1.55;}.cta.svelte-ube16v {display:flex;justify-content:center;flex-wrap:wrap;gap:8px;margin-top:18px;}.cta.svelte-ube16v button:where(.svelte-ube16v) {height:32px;padding:0 16px;border-radius:16px;border:1px solid var(--tm-fg-14);background:var(--tm-panel);color:var(--tm-fg);font-size:12px;font-weight:600;cursor:pointer;}.cta.svelte-ube16v button:where(.svelte-ube16v):hover {border-color:var(--tm-accent);}\n  @media (prefers-reduced-motion: reduce) {.art.svelte-ube16v, .tplay.svelte-ube16v {transition:none;} }"
};
function vs(e, t) {
	Ue(t, !0), $r(e, _s);
	let n = ji(t, "store", 7), r = [
		["all", "All"],
		["radio", "Radio"],
		["podcast", "Podcasts"],
		["book", "Audiobooks"]
	], i = /* @__PURE__ */ j(() => n().libraryCounts), a = (e) => e === "all" ? U(i).radio + U(i).podcast + U(i).book : U(i)[e], o = /* @__PURE__ */ j(() => n().libQuery.trim().toLowerCase()), s = (...e) => !U(o) || e.some((e) => e.toLowerCase().includes(U(o))), c = (e) => n().libKind === "all" || n().libKind === e, l = (e) => n().libKind === "all" ? e.slice(0, 8) : e, u = /* @__PURE__ */ j(() => {
		let e = {};
		for (let t of n().history) {
			let r = n().items[t.id];
			r?.type === "podcast" && (e[r.show] = Math.max(e[r.show] ?? 0, t.at));
		}
		return e;
	});
	function d(e, t, r, i) {
		let a = n().libSort;
		return [...e].sort((e, o) => a === "title" ? r(e).localeCompare(r(o)) : a === "added" ? (n().addedAt[t(o)] ?? 0) - (n().addedAt[t(e)] ?? 0) : i(o) - i(e) || (n().addedAt[t(o)] ?? 0) - (n().addedAt[t(e)] ?? 0));
	}
	let f = /* @__PURE__ */ j(() => d(Object.values(n().favorites).map((e) => n().items[e.id] ?? e).filter((e) => s(e.title, e.sub)), (e) => e.id, (e) => e.title, (e) => n().lastPlayed(e.id))), p = /* @__PURE__ */ j(() => d(Object.values(n().subscribed).filter((e) => s(e.title, e.author)), (e) => `show:${e.slug}`, (e) => e.title, (e) => U(u)[e.slug] ?? 0)), h = /* @__PURE__ */ j(() => d(n().libraryBooks.filter((e) => s(e.title, e.sub)), (e) => e.id, (e) => e.title, (e) => n().lastPlayed(e.id))), g = /* @__PURE__ */ j(() => n().inProgress.filter((e) => {
		let t = n().items[e];
		return c(t.type) && s(t.title, t.sub);
	})), _ = /* @__PURE__ */ j(() => n().history.filter((e) => {
		let t = n().items[e.id];
		return t && c(t.type) && s(t.title, t.sub);
	})), v = /* @__PURE__ */ j(() => a("all") === 0 && !n().history.length && !n().inProgress.length && !n().playlists.length), y = /* @__PURE__ */ j(() => n().playlists.filter((e) => s(e.name, ...e.ids.map((e) => n().items[e]?.title ?? "")))), b = /* @__PURE__ */ N(null), x = /* @__PURE__ */ N(null), S = /* @__PURE__ */ N(""), C = /* @__PURE__ */ N(null);
	function w(e) {
		if (n().played[e.id]) return {
			pct: 100,
			label: "Finished"
		};
		let t = n().progressOf(e.id), r = n().durOf(e.id);
		return t > 5 && r ? {
			pct: Math.min(100, Math.round(t / r * 100)),
			label: `${ta((r - t) / n().speedFor(e.id))} left`
		} : {
			pct: 0,
			label: "Not started"
		};
	}
	let T = (e) => {
		n().libKind = e;
	};
	var E = gs(), ee = L(E), te = z(I(ee), 2), ne = I(te);
	$(ne, {
		get d() {
			return Q.search;
		},
		size: 13,
		stroke: 2
	});
	var re = z(ne, 2);
	yi(re), k(te), k(ee);
	var ie = z(ee, 2);
	zo(ie, { get store() {
		return n();
	} });
	var ae = z(ie, 2), oe = I(ae);
	Y(oe, 21, () => r, ([e, t]) => e, (e, t) => {
		var r = /* @__PURE__ */ j(() => m(U(t), 2));
		let i = () => U(r)[0], o = () => U(r)[1];
		var s = Bo();
		let c;
		var l = I(s, !0), u = R(z(l), !0);
		k(s), B((e) => {
			c = X(s, 1, "chip svelte-ube16v", null, c, { on: n().libKind === i() }), Z(s, "aria-pressed", n().libKind === i()), q(l, o()), q(u, e);
		}, [() => a(i())]), W("click", s, () => n().libKind = i()), K(e, s);
	}), k(oe);
	var se = z(oe, 2), ce = z(I(se)), le = I(ce);
	le.value = le.__value = "recent";
	var ue = z(le);
	ue.value = ue.__value = "added";
	var de = z(ue);
	de.value = de.__value = "title", k(ce), di(ce), k(se), k(ae);
	var fe = z(ae, 2), pe = (e) => {
		var t = Vo(), r = I(t);
		$(I(r), {
			get d() {
				return Q.library;
			},
			size: 26,
			stroke: 1.6
		}), k(r);
		var i = z(r, 6), a = I(i), o = z(a, 2), s = z(o, 2);
		k(i), k(t), W("click", a, () => n().tab = "radio"), W("click", o, () => {
			n().tab = "pod", n().showSlug = null;
		}), W("click", s, () => {
			n().tab = "book", n().bookId = null;
		}), K(e, t);
	}, me = (e) => {
		var t = hs(), r = L(t), i = (e) => {
			var t = Uo(), r = I(t), i = R(z(I(r)), !0);
			k(r);
			var a = z(r, 2);
			Y(a, 20, () => l(U(g)), (e) => e, (e, t) => {
				let r = /* @__PURE__ */ j(() => n().items[t]);
				var i = Ho(), a = I(i);
				Ga(a, {
					get hue() {
						return U(r).hue;
					},
					get art() {
						return U(r).art;
					},
					size: 52,
					radius: 9,
					get mark() {
						return U(r).mark;
					}
				});
				var o = z(a, 2), s = I(o), c = R(s, !0), l = z(s, 2), u = R(l, !0), d = z(l, 2), f = I(d);
				let p;
				k(d);
				var m = R(z(d, 2), !0);
				k(o);
				var h = z(o, 2), g = I(h);
				{
					let e = /* @__PURE__ */ j(() => n().isPlaying(t) ? Q.pause : Q.play);
					$(g, {
						get d() {
							return U(e);
						},
						size: 13
					});
				}
				k(h), k(i), B((e, t, n) => {
					Z(i, "aria-label", `${e ?? ""} ${U(r).title ?? ""}`), q(c, Ni[U(r).type]), q(u, U(r).title), p = si(f, "", p, { width: t }), q(m, n);
				}, [
					() => n().isPlaying(t) ? "Pause" : "Resume",
					() => `${n().pctOf(t) ?? ""}%`,
					() => n().leftOf(t)
				]), W("click", i, () => n().play(t)), K(e, i);
			}), k(a), k(t), B(() => q(i, U(g).length)), K(e, t);
		};
		J(r, (e) => {
			U(g).length && e(i);
		});
		var a = z(r, 2), s = (e) => {
			var t = Xo(), r = I(t), i = R(z(I(r)), !0);
			k(r);
			var a = z(r, 2);
			Y(a, 21, () => U(y), (e) => e.id, (e, t) => {
				let r = /* @__PURE__ */ j(() => U(t).ids.map((e) => n().items[e]).filter(Boolean)), i = /* @__PURE__ */ j(() => n().playlistDuration(U(t)));
				var a = Yo();
				let o;
				var s = I(a), c = I(s), l = I(c);
				Y(l, 17, () => U(r).slice(0, 4), (e) => e.id, (e, t) => {
					Ga(e, {
						get hue() {
							return U(t).hue;
						},
						get art() {
							return U(t).art;
						},
						fill: !0,
						radius: 0,
						get mark() {
							return U(t).mark;
						},
						font: 8
					});
				});
				var u = z(l, 2);
				$(I(u), {
					get d() {
						return Q.play;
					},
					size: 14
				}), k(u), k(c);
				var d = z(c, 2), f = I(d), p = (e) => {
					var r = Wo(), i = I(r);
					yi(i), ei(i, (e) => eo?.(e)), yn(() => Ti(i, () => U(S), (e) => P(S, e))), k(r), yr("submit", r, (e) => {
						e.preventDefault(), n().renamePlaylist(U(t).id, U(S)), P(x, null);
					}), yr("blur", i, () => {
						n().renamePlaylist(U(t).id, U(S)), P(x, null);
					}), W("keydown", i, (e) => {
						e.key === "Escape" && (e.stopPropagation(), P(x, null));
					}), K(e, r);
				}, m = (e) => {
					var n = Go(), r = R(n, !0);
					B(() => q(r, U(t).name)), W("click", n, () => {
						P(x, U(t).id, !0), P(S, U(t).name, !0);
					}), K(e, n);
				};
				J(f, (e) => {
					U(x) === U(t).id ? e(p) : e(m, -1);
				});
				var h = R(z(f, 2));
				k(d);
				var g = z(d, 2);
				$(I(g), {
					get d() {
						return Q.play;
					},
					size: 12
				}), A(), k(g);
				var _ = z(g, 2);
				$(I(_), {
					get d() {
						return Q.shuffle;
					},
					size: 13,
					stroke: 1.8
				}), k(_);
				var v = z(_, 2), y = I(v);
				{
					let e = /* @__PURE__ */ j(() => U(b) === U(t).id ? Q.up : Q.down);
					$(y, {
						get d() {
							return U(e);
						},
						size: 13,
						stroke: 2
					});
				}
				k(v);
				var w = z(v, 2);
				let T;
				$(I(w), {
					get d() {
						return Q.trash;
					},
					size: 13,
					stroke: 1.8
				}), k(w), k(s);
				var E = z(s, 2), ee = (e) => {
					var i = Jo();
					Y(i, 21, () => U(r), (e) => e.id, (e, r) => {
						var i = Ko();
						let a;
						var o = I(i);
						Ga(o, {
							get hue() {
								return U(r).hue;
							},
							get art() {
								return U(r).art;
							},
							size: 30,
							radius: 6,
							get mark() {
								return U(r).mark;
							},
							font: 8
						});
						var s = z(o, 2), c = I(s, !0), l = R(z(c));
						k(s);
						var u = z(s, 2);
						$(I(u), {
							get d() {
								return Q.close;
							},
							size: 11,
							stroke: 2
						}), k(u), k(i), B((e) => {
							a = X(i, 1, "plrow svelte-ube16v", null, a, { cur: U(r).id === n().now }), q(c, U(r).title), q(l, `${Ni[U(r).type] ?? ""}${e ?? ""}`), Z(u, "aria-label", `Remove ${U(r).title ?? ""} from ${U(t).name ?? ""}`);
						}, [() => n().lenOf(U(r).id) ? ` · ${n().lenOf(U(r).id)}` : ""]), W("click", s, () => n().play(U(r).id)), W("click", u, () => n().removeFromPlaylist(U(t).id, U(r).id)), K(e, i);
					}, (e) => {
						K(e, qo());
					}), k(i), K(e, i);
				};
				J(E, (e) => {
					U(b) === U(t).id && e(ee);
				}), k(a), B((e) => {
					o = X(a, 1, "pl svelte-ube16v", null, o, { open: U(b) === U(t).id }), Z(c, "aria-label", `Play ${U(t).name ?? ""}`), q(h, `${U(r).length ?? ""} item${U(r).length === 1 ? "" : "s"}${e ?? ""}`), Z(_, "aria-label", `Shuffle ${U(t).name ?? ""}`), Z(v, "aria-expanded", U(b) === U(t).id), Z(v, "aria-label", `${U(b) === U(t).id ? "Hide" : "Show"} items in ${U(t).name ?? ""}`), T = X(w, 1, "plbtn svelte-ube16v", null, T, { danger: U(C) === U(t).id }), Z(w, "aria-label", U(C) === U(t).id ? `Confirm delete ${U(t).name}` : `Delete ${U(t).name}`), Z(w, "title", U(C) === U(t).id ? "Click again to delete" : "Delete playlist");
				}, [() => U(i) ? ` · ${ta(U(i))}` : ""]), W("click", c, () => n().playPlaylist(U(t).id)), W("click", g, () => n().playPlaylist(U(t).id)), W("click", _, () => n().playPlaylist(U(t).id, !0)), W("click", v, () => P(b, U(b) === U(t).id ? null : U(t).id, !0)), W("click", w, () => {
					U(C) === U(t).id ? (n().deletePlaylist(U(t).id), P(C, null)) : P(C, U(t).id, !0);
				}), yr("blur", w, () => {
					U(C) === U(t).id && P(C, null);
				}), K(e, a);
			}), k(a), k(t), B(() => q(i, U(y).length)), K(e, t);
		};
		J(a, (e) => {
			n().libKind === "all" && U(y).length && e(s);
		});
		var u = z(a, 2), d = (e) => {
			var t = ns(), r = I(t), i = z(I(r)), a = R(i, !0), s = z(i), c = (e) => {
				var t = Zo();
				W("click", t, () => T("radio")), K(e, t);
			};
			J(s, (e) => {
				n().libKind === "all" && U(f).length > 8 && e(c);
			}), k(r);
			var u = z(r, 2), d = (e) => {
				var t = $o();
				Y(t, 21, () => l(U(f)), (e) => e.id, (e, t) => {
					let r = /* @__PURE__ */ j(() => n().isPlaying(U(t).id)), i = /* @__PURE__ */ j(() => n().songOf(U(t).stationId));
					var a = Qo();
					let o;
					var s = I(a), c = I(s), l = I(c);
					Ga(l, {
						get hue() {
							return U(t).hue;
						},
						get art() {
							return U(t).art;
						},
						fill: !0,
						radius: 0,
						get mark() {
							return U(t).mark;
						},
						font: 18
					});
					var u = z(l, 4), d = I(u);
					{
						let e = /* @__PURE__ */ j(() => U(r) ? Q.stop : Q.play);
						$(d, {
							get d() {
								return U(e);
							},
							size: 14
						});
					}
					k(u), k(c);
					var f = z(c, 2), p = I(f), m = R(p, !0), h = R(z(p), !0);
					k(f), k(s);
					var g = z(s, 2);
					jo(I(g), {
						get store() {
							return n();
						},
						get id() {
							return U(t).id;
						},
						size: 14,
						solid: !0
					}), k(g), k(a), B(() => {
						o = X(a, 1, "tile svelte-ube16v", null, o, { cur: U(t).id === n().now }), Z(s, "aria-label", `${U(r) ? "Stop" : "Play"} ${U(t).title ?? ""}`), q(m, U(t).title), q(h, U(i) ? `♪ ${U(i)}` : U(t).sub);
					}), W("click", s, () => U(r) ? n().stop() : n().play(U(t).id)), K(e, a);
				}), k(t), K(e, t);
			}, p = (e) => {
				var t = ts(), r = I(t), i = z(r), a = (e) => {
					var t = es();
					W("click", t, () => n().tab = "radio"), K(e, t);
				};
				J(i, (e) => {
					U(o) || e(a);
				}), k(t), B(() => q(r, `${U(o) ? "No favorite stations match." : "Tap ♥ on any station to keep it here."} `)), K(e, t);
			};
			J(u, (e) => {
				U(f).length ? e(d) : e(p, -1);
			}), k(t), B(() => q(a, U(f).length)), K(e, t);
		}, m = /* @__PURE__ */ j(() => c("radio"));
		J(u, (e) => {
			U(m) && e(d);
		});
		var v = z(u, 2), E = (e) => {
			var t = ss(), r = I(t), i = z(I(r)), a = R(i, !0), s = z(i), c = (e) => {
				var t = Zo();
				W("click", t, () => T("podcast")), K(e, t);
			};
			J(s, (e) => {
				n().libKind === "all" && U(p).length > 8 && e(c);
			}), k(r);
			var u = z(r, 2), d = (e) => {
				var t = as();
				Y(t, 21, () => l(U(p)), (e) => e.slug, (e, t) => {
					let r = /* @__PURE__ */ j(() => n().newCount(U(t).slug));
					var i = is(), a = I(i), o = I(a);
					Ga(o, {
						get hue() {
							return U(t).hue;
						},
						get art() {
							return U(t).art;
						},
						fill: !0,
						radius: 0,
						get mark() {
							return U(t).mark;
						},
						font: 18
					});
					var s = z(o), c = (e) => {
						var t = rs(), n = R(t);
						B(() => q(n, `${U(r) ?? ""} new`)), K(e, t);
					};
					J(s, (e) => {
						U(r) && e(c);
					}), k(a);
					var l = z(a, 2), u = R(l, !0), d = R(z(l, 2), !0);
					k(i), B(() => {
						q(u, U(t).title), q(d, U(t).author || U(t).category || "Podcast");
					}), W("click", i, () => n().openShow(U(t).slug)), K(e, i);
				}), k(t), K(e, t);
			}, f = (e) => {
				var t = ts(), r = I(t), i = z(r), a = (e) => {
					var t = os();
					W("click", t, () => {
						n().tab = "pod", n().showSlug = null;
					}), K(e, t);
				};
				J(i, (e) => {
					U(o) || e(a);
				}), k(t), B(() => q(r, `${U(o) ? "No shows match." : "Subscribe to a show and its new episodes come to you."} `)), K(e, t);
			};
			J(u, (e) => {
				U(p).length ? e(d) : e(f, -1);
			}), k(t), B(() => q(a, U(p).length)), K(e, t);
		}, ee = /* @__PURE__ */ j(() => c("podcast"));
		J(v, (e) => {
			U(ee) && e(E);
		});
		var te = z(v, 2), ne = (e) => {
			var t = fs(), r = I(t), i = z(I(r)), a = R(i, !0), s = z(i), c = (e) => {
				var t = Zo();
				W("click", t, () => T("book")), K(e, t);
			};
			J(s, (e) => {
				n().libKind === "all" && U(h).length > 8 && e(c);
			}), k(r);
			var u = z(r, 2), d = (e) => {
				var t = us();
				Y(t, 21, () => l(U(h)), (e) => e.id, (e, t) => {
					let r = /* @__PURE__ */ j(() => w(U(t)));
					var i = ls(), a = I(i), o = I(a), s = I(o);
					Ga(s, {
						get hue() {
							return U(t).hue;
						},
						get art() {
							return U(t).art;
						},
						fill: !0,
						radius: 0,
						get mark() {
							return U(t).mark;
						},
						font: 18
					});
					var c = z(s, 2), l = (e) => {
						var t = cs(), n = I(t);
						let i;
						k(t), B(() => i = si(n, "", i, { width: `${U(r).pct ?? ""}%` })), K(e, t);
					};
					J(c, (e) => {
						U(r).pct && e(l);
					}), k(o);
					var u = z(o, 2), d = R(u, !0), f = z(u, 2);
					let p;
					var m = R(f, !0);
					k(a);
					var h = z(a, 2);
					jo(I(h), {
						get store() {
							return n();
						},
						get id() {
							return U(t).id;
						},
						size: 13,
						solid: !0
					}), k(h), k(i), B(() => {
						q(d, U(t).title), p = X(f, 1, "csub svelte-ube16v", null, p, { done: U(r).pct === 100 }), q(m, U(r).pct === 100 ? "✓ Finished" : U(r).label);
					}), W("click", a, () => n().openBook(U(t).id)), K(e, i);
				}), k(t), K(e, t);
			}, f = (e) => {
				var t = ts(), r = I(t), i = z(r), a = (e) => {
					var t = ds();
					W("click", t, () => {
						n().tab = "book", n().bookId = null;
					}), K(e, t);
				};
				J(i, (e) => {
					U(o) || e(a);
				}), k(t), B(() => q(r, `${U(o) ? "No audiobooks match." : "Save a book, or start one, and it shows up here with your place."} `)), K(e, t);
			};
			J(u, (e) => {
				U(h).length ? e(d) : e(f, -1);
			}), k(t), B(() => q(a, U(h).length)), K(e, t);
		}, re = /* @__PURE__ */ j(() => c("book"));
		J(te, (e) => {
			U(re) && e(ne);
		});
		var ie = z(te, 2), ae = (e) => {
			var t = ms(), r = I(t), i = z(I(r)), a = R(i, !0), o = z(i);
			k(r);
			var s = z(r, 2);
			Y(s, 21, () => l(U(_)), (e) => e.id, (e, t) => {
				let r = /* @__PURE__ */ j(() => n().items[U(t).id]);
				var i = ps();
				let a;
				var o = I(i);
				Ga(o, {
					get hue() {
						return U(r).hue;
					},
					get art() {
						return U(r).art;
					},
					size: 38,
					radius: 8,
					get mark() {
						return U(r).mark;
					},
					font: 10
				});
				var s = z(o, 2), c = I(s), l = R(c, !0), u = R(z(c, 2));
				k(s);
				var d = z(s, 2);
				jo(d, {
					get store() {
						return n();
					},
					get id() {
						return U(t).id;
					},
					size: 14
				});
				var f = z(d, 2);
				lo(f, {
					get store() {
						return n();
					},
					get id() {
						return U(t).id;
					}
				});
				var p = z(f, 2), m = I(p);
				{
					let e = /* @__PURE__ */ j(() => n().isPlaying(U(t).id) ? U(r).type === "radio" ? Q.stop : Q.pause : Q.play);
					$(m, {
						get d() {
							return U(e);
						},
						size: 12
					});
				}
				k(p), k(i), B((e, o, s) => {
					a = X(i, 1, "hrow svelte-ube16v", null, a, { cur: U(t).id === n().now }), q(l, U(r).title), q(u, `${Ni[U(r).type] ?? ""} · ${e ?? ""} · ${o ?? ""}`), Z(p, "aria-label", `${s ?? ""} ${U(r).title ?? ""}`);
				}, [
					() => U(r).type === "radio" ? U(r).sub : n().leftOf(U(t).id) || U(r).sub,
					() => ra(new Date(U(t).at).toISOString()),
					() => n().isPlaying(U(t).id) ? U(r).type === "radio" ? "Stop" : "Pause" : "Play"
				]), W("click", s, () => n().play(U(t).id)), W("click", p, () => n().isPlaying(U(t).id) && U(r).type === "radio" ? n().stop() : n().play(U(t).id)), K(e, i);
			}), k(s), k(t), B(() => q(a, U(_).length)), W("click", o, () => n().clearHistory()), K(e, t);
		};
		J(ie, (e) => {
			U(_).length && e(ae);
		}), K(e, t);
	};
	J(fe, (e) => {
		U(v) ? e(pe) : e(me, -1);
	}), Ti(re, () => n().libQuery, (e) => n().libQuery = e), fi(ce, () => n().libSort, (e) => n().libSort = e), K(e, E), We();
}
br(["click", "keydown"]);
//#endregion
//#region src/components/RadioView.svelte
var ys = /* @__PURE__ */ G("<button> </button>"), bs = /* @__PURE__ */ G("<div class=\"song svelte-1c0iuue\"> </div>"), xs = /* @__PURE__ */ G("<div><!> <div class=\"text svelte-1c0iuue\"><div class=\"title svelte-1c0iuue\"> </div> <div class=\"sub svelte-1c0iuue\"> </div> <!></div> <!> <button class=\"play svelte-1c0iuue\"><!></button></div>"), Ss = /* @__PURE__ */ G("<button class=\"more svelte-1c0iuue\">Show more stations</button>"), Cs = /* @__PURE__ */ G("<h1 class=\"h1 svelte-1c0iuue\">Radio</h1> <p class=\"lede svelte-1c0iuue\">Live stations from OndaCast, most listened first. Search above for any station by name, city or genre.</p> <div class=\"genres svelte-1c0iuue\" role=\"group\" aria-label=\"Genre\"></div> <div class=\"grid svelte-1c0iuue\"></div> <!> <!>", 1), ws = {
	hash: "svelte-1c0iuue",
	code: ".h1.svelte-1c0iuue {font-size:26px;font-weight:650;letter-spacing:-.5px;margin:0;}.lede.svelte-1c0iuue {font-size:13px;color:var(--tm-muted);margin:4px 0 0;}.genres.svelte-1c0iuue {display:flex;flex-wrap:wrap;gap:8px;margin-top:18px;}.chip.svelte-1c0iuue {height:30px;padding:0 14px;border-radius:15px;border:1px solid var(--tm-fg-16);background:transparent;color:var(--tm-fg);font-size:12px;font-weight:500;cursor:pointer;}.chip.on.svelte-1c0iuue {border-color:var(--tm-accent);background:var(--tm-accent);color:var(--tm-on-accent);}.grid.svelte-1c0iuue {display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));gap:10px;margin-top:18px;}.row.svelte-1c0iuue {display:flex;align-items:center;gap:10px;padding:12px;border-radius:14px;min-width:0;}.row.svelte-1c0iuue:hover {background:var(--tm-fg-7);}.row.cur.svelte-1c0iuue {background:var(--tm-accent-8);}.text.svelte-1c0iuue {flex:1;min-width:0;}.title.svelte-1c0iuue {font-size:13.5px;font-weight:600;line-height:1.3;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical;overflow-wrap:anywhere;}.cur.svelte-1c0iuue .title:where(.svelte-1c0iuue) {color:var(--tm-accent);}.sub.svelte-1c0iuue {font-size:11.5px;color:var(--tm-muted);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.song.svelte-1c0iuue {font-size:11.5px;margin-top:5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;opacity:.85;}.more.svelte-1c0iuue {display:block;margin:18px auto 0;height:32px;padding:0 18px;border-radius:16px;border:1px solid var(--tm-fg-14);background:transparent;color:var(--tm-fg);font-size:12px;cursor:pointer;}.more.svelte-1c0iuue:hover {background:var(--tm-fg-6);}.play.svelte-1c0iuue {width:36px;height:36px;border:0;border-radius:18px;background:var(--tm-accent);color:var(--tm-on-accent);cursor:pointer;display:grid;place-items:center;flex:none;}"
};
function Ts(e, t) {
	Ue(t, !0), $r(e, ws);
	let n = ji(t, "store", 7), r = /* @__PURE__ */ j(() => n().stationList);
	gn(() => {
		n().radioStatus === "idle" && n().loadRadio();
	}), gn(() => {
		U(r).status === "idle" && n().loadStations(n().genre);
	});
	var i = Cs(), a = z(L(i), 4);
	Y(a, 21, () => Ca, (e) => e.label, (e, t) => {
		var r = ys();
		let i;
		var a = R(r, !0);
		B(() => {
			i = X(r, 1, "chip svelte-1c0iuue", null, i, { on: n().genre === U(t).label }), Z(r, "aria-pressed", n().genre === U(t).label), q(a, U(t).label);
		}), W("click", r, () => n().genre = U(t).label), K(e, r);
	}), k(a);
	var o = z(a, 2);
	Y(o, 21, () => n().stations, (e) => e.id, (e, t) => {
		let r = /* @__PURE__ */ j(() => n().songOf(U(t).stationId)), i = /* @__PURE__ */ j(() => n().isPlaying(U(t).id));
		var a = xs();
		let o;
		var s = I(a);
		Ga(s, {
			get hue() {
				return U(t).hue;
			},
			get art() {
				return U(t).art;
			},
			size: 56,
			radius: 12,
			get mark() {
				return U(t).mark;
			},
			font: 12
		});
		var c = z(s, 2), l = I(c), u = R(l, !0), d = z(l, 2), f = R(d, !0), p = z(d, 2), m = (e) => {
			var t = bs(), n = R(t);
			B(() => q(n, `♪ ${U(r) ?? ""}`)), K(e, t);
		};
		J(p, (e) => {
			U(r) && e(m);
		}), k(c);
		var h = z(c, 2);
		jo(h, {
			get store() {
				return n();
			},
			get id() {
				return U(t).id;
			}
		});
		var g = z(h, 2), _ = I(g);
		{
			let e = /* @__PURE__ */ j(() => U(i) ? Q.stop : Q.play);
			$(_, {
				get d() {
					return U(e);
				},
				size: 14
			});
		}
		k(g), k(a), B(() => {
			o = X(a, 1, "row svelte-1c0iuue", null, o, { cur: U(t).id === n().now }), q(u, U(t).title), q(f, U(t).sub), Z(g, "aria-label", `${U(i) ? "Stop" : "Play"} ${U(t).title ?? ""}`);
		}), W("click", g, () => U(i) ? n().stop() : n().play(U(t).id)), K(e, a);
	}), k(o);
	var s = z(o, 2), c = (e) => {
		var t = Ss();
		W("click", t, () => n().loadStations(n().genre, !0)), K(e, t);
	};
	J(s, (e) => {
		U(r).more && U(r).status === "ready" && e(c);
	});
	var l = z(s, 2), u = (e) => {
		{
			let t = /* @__PURE__ */ j(() => U(r).status === "idle" ? "loading" : U(r).status);
			bo(e, {
				get status() {
					return U(t);
				},
				retry: () => n().loadStations(n().genre, U(r).ids.length > 0),
				empty: "No stations in this genre right now."
			});
		}
	};
	J(l, (e) => {
		(!n().stations.length || U(r).status === "loading" || U(r).status === "error") && e(u);
	}), K(e, i), We();
}
br(["click"]);
//#endregion
//#region src/components/Grid.svelte
var Es = /* @__PURE__ */ G("<button class=\"card svelte-1cebjac\"><span><!></span> <span class=\"title svelte-1cebjac\"> </span> <span class=\"sub svelte-1cebjac\"> </span></button>"), Ds = /* @__PURE__ */ G("<div class=\"grid svelte-1cebjac\"></div>"), Os = {
	hash: "svelte-1cebjac",
	code: ".grid.svelte-1cebjac {display:grid;grid-template-columns:repeat(auto-fill, minmax(118px, 1fr));gap:16px 14px;margin-top:16px;}.card.svelte-1cebjac {display:flex;flex-direction:column;gap:3px;padding:0;border:0;background:none;color:inherit;text-align:left;cursor:pointer;font:inherit;min-width:0;}.art.svelte-1cebjac {display:flex;aspect-ratio:1;border-radius:12px;overflow:hidden;box-shadow:0 10px 24px rgba(0, 0, 0, .28);margin-bottom:6px;transition:transform .15s;}.art.tall.svelte-1cebjac {aspect-ratio:0.72;}.card.svelte-1cebjac:hover .art:where(.svelte-1cebjac) {transform:translateY(-2px);}.title.svelte-1cebjac {font-size:12.5px;font-weight:600;line-height:1.25;display:-webkit-box;-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}.sub.svelte-1cebjac {font-size:11px;color:var(--tm-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}\n  @media (prefers-reduced-motion: reduce) {.art.svelte-1cebjac {transition:none;} }"
};
function ks(e, t) {
	Ue(t, !0), $r(e, Os);
	let n = ji(t, "tall", 3, !1);
	var r = Ds();
	Y(r, 21, () => t.cards, (e) => e.key, (e, r) => {
		var i = Es(), a = I(i);
		let o;
		Ga(I(a), {
			get hue() {
				return U(r).hue;
			},
			get art() {
				return U(r).art;
			},
			get mark() {
				return U(r).mark;
			},
			fill: !0,
			radius: 12,
			font: 18
		}), k(a);
		var s = z(a, 2), c = R(s, !0), l = R(z(s, 2), !0);
		k(i), B(() => {
			o = X(a, 1, "art svelte-1cebjac", null, o, { tall: n() }), q(c, U(r).title), q(l, U(r).sub);
		}), W("click", i, () => t.open(U(r).key)), K(e, i);
	}), k(r), K(e, r), We();
}
br(["click"]);
//#endregion
//#region src/components/PodcastView.svelte
var As = /* @__PURE__ */ G("<button> </button>"), js = /* @__PURE__ */ G("<div class=\"genres svelte-1phe8yx\" role=\"group\" aria-label=\"Category\"></div>"), Ms = /* @__PURE__ */ G("<b class=\"svelte-1phe8yx\"> </b>"), Ns = /* @__PURE__ */ G("<button class=\"chipshow svelte-1phe8yx\"><!><span class=\"svelte-1phe8yx\"> </span><!></button>"), Ps = /* @__PURE__ */ G("<div class=\"strip svelte-1phe8yx\" aria-label=\"Your shows\"></div>"), Fs = /* @__PURE__ */ G("<button class=\"more svelte-1phe8yx\">Show more</button>"), Is = /* @__PURE__ */ G("<h1 class=\"h1 svelte-1phe8yx\">Podcasts</h1> <p class=\"lede svelte-1phe8yx\"> </p> <!> <!> <!> <!> <!>", 1), Ls = /* @__PURE__ */ G("<div class=\"author svelte-1phe8yx\"> </div>"), Rs = /* @__PURE__ */ G("<div class=\"tm-pop pop svelte-1phe8yx\" role=\"dialog\"><div class=\"ptitle svelte-1phe8yx\"> </div> <div class=\"plabel svelte-1phe8yx\">Skip intro</div> <div class=\"opts svelte-1phe8yx\"></div> <div class=\"plabel svelte-1phe8yx\">Skip outro</div> <div class=\"opts svelte-1phe8yx\"></div> <div class=\"plabel svelte-1phe8yx\">Speed for this show</div> <div class=\"opts svelte-1phe8yx\"></div> <label class=\"trow svelte-1phe8yx\"><span class=\"svelte-1phe8yx\"><b class=\"svelte-1phe8yx\">Add new episodes to Up next</b><small class=\"svelte-1phe8yx\">When this show publishes, its new episodes queue up for you.</small></span> <input type=\"checkbox\" role=\"switch\" class=\"svelte-1phe8yx\"/></label></div>"), zs = /* @__PURE__ */ G("<div class=\"hero svelte-1phe8yx\"><div class=\"art svelte-1phe8yx\"><!></div> <div class=\"info svelte-1phe8yx\"><div class=\"eyebrow svelte-1phe8yx\"> </div> <h1 class=\"svelte-1phe8yx\"> </h1> <!> <p class=\"desc svelte-1phe8yx\"> </p> <div class=\"actions svelte-1phe8yx\"><button class=\"primary svelte-1phe8yx\"><!>Latest episode</button> <button> </button> <span class=\"anchor svelte-1phe8yx\"><button class=\"sub icon svelte-1phe8yx\" data-pop=\"\" aria-haspopup=\"dialog\" title=\"Show settings\" aria-label=\"Show settings\"><!>Settings</button> <!></span></div></div></div>"), Bs = /* @__PURE__ */ G("<div class=\"tm-pop menu svelte-1phe8yx\" role=\"menu\"><button role=\"menuitem\" class=\"svelte-1phe8yx\"><!>Play unplayed</button> <button role=\"menuitem\" class=\"svelte-1phe8yx\"><!>Queue unplayed</button> <button role=\"menuitem\" class=\"svelte-1phe8yx\"><!>Mark all as played</button> <button role=\"menuitem\" class=\"svelte-1phe8yx\"><!>Mark all as unplayed</button></div>"), Vs = /* @__PURE__ */ G("<button> <span class=\"svelte-1phe8yx\"> </span></button>"), Hs = /* @__PURE__ */ G("<span class=\"loaded svelte-1phe8yx\"> </span>"), Us = /* @__PURE__ */ G("<div class=\"prog svelte-1phe8yx\"><span class=\"bar svelte-1phe8yx\"><span class=\"svelte-1phe8yx\"></span></span><span class=\"left svelte-1phe8yx\"> </span></div>"), Ws = /* @__PURE__ */ G("<p class=\"notes svelte-1phe8yx\"> </p>"), Gs = /* @__PURE__ */ G("<button class=\"notes-toggle svelte-1phe8yx\"> </button> <!>", 1), Ks = /* @__PURE__ */ G("<span class=\"eq svelte-1phe8yx\" aria-hidden=\"true\"><i class=\"svelte-1phe8yx\"></i><i class=\"svelte-1phe8yx\"></i><i class=\"svelte-1phe8yx\"></i></span>"), qs = /* @__PURE__ */ G("<span class=\"nowtag svelte-1phe8yx\"><!>Now playing</span>"), Js = /* @__PURE__ */ G("<button class=\"pill svelte-1phe8yx\">Play next</button> <button class=\"pill svelte-1phe8yx\">Queue</button>", 1), Ys = /* @__PURE__ */ G("<div><button class=\"playbtn svelte-1phe8yx\"><!></button> <div class=\"text svelte-1phe8yx\"><div class=\"date svelte-1phe8yx\"> </div> <div> </div> <!> <!></div> <!> <!> <button><!></button></div>"), Xs = /* @__PURE__ */ G("<button class=\"more svelte-1phe8yx\"> </button>"), Zs = /* @__PURE__ */ G("<button class=\"back svelte-1phe8yx\">‹ All podcasts</button> <!> <div class=\"listhead svelte-1phe8yx\"><span class=\"lt svelte-1phe8yx\">Episodes</span> <div class=\"seg svelte-1phe8yx\" role=\"group\" aria-label=\"Order\"><button>Newest</button> <button>Oldest</button></div> <span class=\"spacer svelte-1phe8yx\"></span> <label class=\"find svelte-1phe8yx\"><!><input type=\"search\" placeholder=\"Find an episode\" aria-label=\"Find an episode\" class=\"svelte-1phe8yx\"/></label> <span class=\"anchor svelte-1phe8yx\"><button class=\"more-btn svelte-1phe8yx\" data-pop=\"\" aria-haspopup=\"menu\" aria-label=\"Episode actions\">•••</button> <!></span></div> <div class=\"filters svelte-1phe8yx\" role=\"group\" aria-label=\"Filter episodes\"><!> <!></div> <!> <!> <!>", 1), Qs = {
	hash: "svelte-1phe8yx",
	code: ".genres.svelte-1phe8yx {display:flex;flex-wrap:wrap;gap:8px;margin:18px 0 6px;}.chip.svelte-1phe8yx {height:30px;padding:0 14px;border-radius:15px;border:1px solid var(--tm-fg-16);background:transparent;color:var(--tm-fg);font-size:12px;font-weight:500;cursor:pointer;}.chip.svelte-1phe8yx:hover {border-color:var(--tm-accent);}.chip.on.svelte-1phe8yx {border-color:var(--tm-accent);background:var(--tm-accent);color:var(--tm-on-accent);}.h1.svelte-1phe8yx {font-size:26px;font-weight:650;letter-spacing:-.5px;margin:0;}.lede.svelte-1phe8yx {font-size:13px;color:var(--tm-muted);margin:4px 0 0;}.more.svelte-1phe8yx {display:block;margin:16px auto 0;height:32px;padding:0 18px;border-radius:16px;border:1px solid var(--tm-fg-14);background:transparent;color:var(--tm-fg);font-size:12px;cursor:pointer;}.back.svelte-1phe8yx {border:0;background:none;color:var(--tm-muted);font-size:12px;cursor:pointer;padding:0;margin:-8px 0 14px;}.back.svelte-1phe8yx:hover {color:var(--tm-fg);}.hero.svelte-1phe8yx {display:flex;gap:22px;align-items:flex-end;}.art.svelte-1phe8yx {border-radius:16px;box-shadow:0 18px 40px rgba(0, 0, 0, .35);flex:none;}.info.svelte-1phe8yx {flex:1;min-width:0;}.eyebrow.svelte-1phe8yx {font-size:10.5px;letter-spacing:1px;text-transform:uppercase;color:var(--tm-accent);font-weight:600;}h1.svelte-1phe8yx {font-size:28px;font-weight:700;letter-spacing:-.6px;margin:4px 0 0;line-height:1.15;}.author.svelte-1phe8yx {font-size:12.5px;margin-top:4px;}.desc.svelte-1phe8yx {font-size:12.5px;color:var(--tm-muted);margin:4px 0 0;text-wrap:pretty;display:-webkit-box;-webkit-line-clamp:3;line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;}.actions.svelte-1phe8yx {display:flex;gap:8px;margin-top:14px;flex-wrap:wrap;}.actions.svelte-1phe8yx button:where(.svelte-1phe8yx) {height:34px;border-radius:17px;cursor:pointer;}.primary.svelte-1phe8yx {padding:0 16px;border:0;background:var(--tm-accent);color:var(--tm-on-accent);font-size:12.5px;font-weight:650;display:flex;align-items:center;gap:7px;}.primary.svelte-1phe8yx:disabled {opacity:.5;cursor:default;}.sub.svelte-1phe8yx {padding:0 16px;border:1px solid var(--tm-fg-18);background:transparent;color:var(--tm-fg);font-size:12.5px;font-weight:600;}.sub.on.svelte-1phe8yx {border-color:var(--tm-accent);background:var(--tm-accent-12);}.listhead.svelte-1phe8yx {display:flex;align-items:center;gap:10px;margin:26px 0 8px;font-size:12px;color:var(--tm-muted);flex-wrap:wrap;}.lt.svelte-1phe8yx {color:var(--tm-fg);font-weight:650;font-size:14px;}.seg.svelte-1phe8yx {display:flex;padding:2px;border-radius:9px;background:var(--tm-fg-6);}.seg.svelte-1phe8yx button:where(.svelte-1phe8yx) {height:26px;padding:0 12px;border:0;border-radius:7px;background:none;color:var(--tm-muted);font-size:11.5px;font-weight:600;cursor:pointer;}.seg.svelte-1phe8yx button.on:where(.svelte-1phe8yx) {background:var(--tm-panel);color:var(--tm-fg);box-shadow:0 1px 3px rgba(0, 0, 0, .25);}.find.svelte-1phe8yx {display:flex;align-items:center;gap:6px;height:28px;padding:0 10px;border-radius:8px;background:var(--tm-fg-6);width:180px;}.find.svelte-1phe8yx:focus-within {box-shadow:0 0 0 1px var(--tm-accent);}.find.svelte-1phe8yx input:where(.svelte-1phe8yx) {flex:1;min-width:0;border:0;background:none;outline:none;color:var(--tm-fg);font:inherit;font-size:12px;}.anchor.svelte-1phe8yx {position:relative;display:inline-flex;}.more-btn.svelte-1phe8yx {width:30px;height:28px;border:0;border-radius:8px;background:var(--tm-fg-6);color:var(--tm-fg);cursor:pointer;font-size:11px;letter-spacing:1px;}.more-btn.svelte-1phe8yx:hover, .more-btn[aria-expanded='true'].svelte-1phe8yx {background:var(--tm-fg-12);}.menu.svelte-1phe8yx {right:0;top:34px;width:210px;padding:6px;}.menu.svelte-1phe8yx button:where(.svelte-1phe8yx) {display:flex;align-items:center;gap:9px;width:100%;height:32px;padding:0 10px;border:0;border-radius:8px;background:none;color:var(--tm-fg);font-size:12px;cursor:pointer;text-align:left;}.menu.svelte-1phe8yx button:where(.svelte-1phe8yx):hover {background:var(--tm-fg-8);}.pop.svelte-1phe8yx {left:0;top:40px;width:380px;max-width:calc(100cqw - 40px);}.ptitle.svelte-1phe8yx {font-size:13px;font-weight:650;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.plabel.svelte-1phe8yx {font-size:11px;color:var(--tm-muted);margin:12px 0 6px;}.opts.svelte-1phe8yx {display:flex;flex-wrap:wrap;gap:5px;}.opt.svelte-1phe8yx {min-width:38px;height:28px;padding:0 8px;border:0;border-radius:7px;background:var(--tm-fg-6);color:var(--tm-fg);font-size:11px;font-weight:600;cursor:pointer;font-variant-numeric:tabular-nums;}.opt.svelte-1phe8yx:hover {background:var(--tm-fg-10);}.opt.sel.svelte-1phe8yx {background:var(--tm-accent);color:var(--tm-on-accent);}.trow.svelte-1phe8yx {display:flex;align-items:center;gap:12px;margin-top:14px;cursor:pointer;}.trow.svelte-1phe8yx span:where(.svelte-1phe8yx) {flex:1;display:flex;flex-direction:column;gap:2px;font-size:12px;}.trow.svelte-1phe8yx small:where(.svelte-1phe8yx) {font-size:11px;color:var(--tm-muted);line-height:1.35;}.trow.svelte-1phe8yx input:where(.svelte-1phe8yx) {appearance:none;width:34px;height:20px;flex:none;border-radius:10px;background:var(--tm-fg-16);position:relative;cursor:pointer;margin:0;}.trow.svelte-1phe8yx input:where(.svelte-1phe8yx)::after {content:'';position:absolute;top:3px;left:3px;width:14px;height:14px;border-radius:50%;background:var(--tm-fg);transition:transform .15s;}.trow.svelte-1phe8yx input:where(.svelte-1phe8yx):checked {background:var(--tm-accent);}.trow.svelte-1phe8yx input:where(.svelte-1phe8yx):checked::after {transform:translateX(14px);background:var(--tm-on-accent);}.sub.icon.svelte-1phe8yx {display:flex;align-items:center;gap:6px;}.filters.svelte-1phe8yx {display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-bottom:4px;}.fchip.svelte-1phe8yx {height:26px;padding:0 10px;border-radius:13px;border:1px solid var(--tm-fg-14);background:transparent;color:var(--tm-fg);font-size:11.5px;cursor:pointer;display:flex;align-items:center;gap:6px;}.fchip.svelte-1phe8yx span:where(.svelte-1phe8yx) {font-size:10px;color:var(--tm-muted);font-variant-numeric:tabular-nums;}.fchip.on.svelte-1phe8yx {background:var(--tm-accent-14);border-color:var(--tm-accent);color:var(--tm-accent);}.fchip.on.svelte-1phe8yx span:where(.svelte-1phe8yx) {color:inherit;}.loaded.svelte-1phe8yx {font-size:11px;color:var(--tm-muted);margin-left:4px;}.notes-toggle.svelte-1phe8yx {border:0;padding:0;margin-top:6px;background:none;color:var(--tm-accent);font-size:11.5px;cursor:pointer;}.notes.svelte-1phe8yx {font-size:12px;line-height:1.55;color:var(--tm-muted);margin:6px 0 0;white-space:pre-line;max-width:640px;}.strip.svelte-1phe8yx {display:flex;gap:8px;overflow-x:auto;margin-top:16px;padding-bottom:4px;scrollbar-width:thin;}.chipshow.svelte-1phe8yx {display:flex;align-items:center;gap:8px;height:40px;padding:0 12px 0 6px;flex:none;border:1px solid var(--tm-fg-10);border-radius:12px;background:var(--tm-fg-4);color:var(--tm-fg);font-size:12px;font-weight:600;cursor:pointer;max-width:240px;}.chipshow.svelte-1phe8yx:hover {border-color:var(--tm-accent);}.chipshow.svelte-1phe8yx span:where(.svelte-1phe8yx) {overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.chipshow.svelte-1phe8yx b:where(.svelte-1phe8yx) {font-size:10px;min-width:18px;height:18px;padding:0 5px;border-radius:9px;display:grid;place-items:center;background:var(--tm-accent);color:var(--tm-on-accent);}.spacer.svelte-1phe8yx {flex:1;}.ep.svelte-1phe8yx {display:flex;align-items:center;gap:14px;padding:14px 8px;border-top:1px solid var(--tm-fg-6);}.ep.cur.svelte-1phe8yx {background:var(--tm-accent-8);}.playbtn.svelte-1phe8yx {width:36px;height:36px;border-radius:18px;border:1px solid var(--tm-fg-18);background:transparent;color:var(--tm-fg);cursor:pointer;display:grid;place-items:center;flex:none;}.playbtn.svelte-1phe8yx:hover {background:var(--tm-accent);color:var(--tm-on-accent);border-color:var(--tm-accent);}.text.svelte-1phe8yx {flex:1;min-width:0;}.date.svelte-1phe8yx {font-size:11px;color:var(--tm-muted);}.title.svelte-1phe8yx {font-size:13.5px;font-weight:600;margin-top:2px;}.cur.svelte-1phe8yx .title:where(.svelte-1phe8yx) {color:var(--tm-accent);}.title.done.svelte-1phe8yx {color:var(--tm-muted);}.prog.svelte-1phe8yx {display:flex;align-items:center;gap:8px;margin-top:6px;}.bar.svelte-1phe8yx {width:70px;height:3px;border-radius:2px;background:var(--tm-fg-10);display:block;}.bar.svelte-1phe8yx span:where(.svelte-1phe8yx) {display:block;height:3px;border-radius:2px;background:var(--tm-accent);}.left.svelte-1phe8yx {font-size:11px;color:var(--tm-muted);}.nowtag.svelte-1phe8yx {display:flex;align-items:center;gap:7px;font-size:11.5px;font-weight:650;color:var(--tm-accent);flex:none;padding:0 6px;}.eq.svelte-1phe8yx {display:flex;align-items:flex-end;gap:2px;height:12px;}.eq.svelte-1phe8yx i:where(.svelte-1phe8yx) {width:3px;background:var(--tm-accent);border-radius:1px; animation: svelte-1phe8yx-eq 1s ease-in-out infinite;}.eq.svelte-1phe8yx i:where(.svelte-1phe8yx):nth-child(2) {animation-delay:-.3s;}.eq.svelte-1phe8yx i:where(.svelte-1phe8yx):nth-child(3) {animation-delay:-.6s;}\n  @keyframes svelte-1phe8yx-eq { 0%, 100% { height: 4px; } 50% { height: 12px; } }\n  @media (prefers-reduced-motion: reduce) {.eq.svelte-1phe8yx i:where(.svelte-1phe8yx) { animation: none;height:8px;} }.pill.svelte-1phe8yx {height:28px;padding:0 10px;border:0;border-radius:7px;background:var(--tm-fg-6);color:var(--tm-fg);font-size:11.5px;cursor:pointer;flex:none;}.pill.svelte-1phe8yx:hover {background:var(--tm-fg-12);}.mark.svelte-1phe8yx {width:28px;height:28px;border:0;border-radius:7px;background:transparent;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;flex:none;}.mark.done.svelte-1phe8yx {color:var(--tm-accent);}.mark.svelte-1phe8yx:hover {background:var(--tm-fg-8);}"
};
function $s(e, t) {
	Ue(t, !0), $r(e, Qs);
	let n = ji(t, "store", 7), r = /* @__PURE__ */ j(() => n().show), i = /* @__PURE__ */ j(() => !!U(r) && !!n().subscribed[U(r).slug]), a = /* @__PURE__ */ j(() => n().showSlug ? n().showEpisodes[n().showSlug] : void 0), o = /* @__PURE__ */ j(() => n().showSlug ? n().epOrder[n().showSlug] ?? "new" : "new"), s = /* @__PURE__ */ j(() => U(r) ? n().showPrefsOf(U(r).slug) : null), c = /* @__PURE__ */ j(() => U(r) ? n().speeds[`show:${U(r).slug}`] ?? 1 : 1), l = /* @__PURE__ */ j(() => n().podGenre === "All" ? null : n().podGenreList), u = /* @__PURE__ */ j(() => (U(l) ? U(l).slugs : n().podcastBrowse.slugs).map((e) => n().shows[e]).filter(Boolean).map((e) => ({
		key: e.slug,
		title: e.title,
		sub: e.author || e.category,
		hue: e.hue,
		mark: e.mark,
		art: e.art
	}))), d = /* @__PURE__ */ j(() => Object.values(n().subscribed)), f = /* @__PURE__ */ j(() => n().allEpisodes), p = /* @__PURE__ */ j(() => [...U(f)].sort((e, t) => (t.date || "").localeCompare(e.date || ""))[0]), h = /* @__PURE__ */ j(() => {
		let e = {
			all: U(f).length,
			unplayed: 0,
			progress: 0,
			played: 0
		};
		for (let t of U(f)) e[n().episodeState(t.id)]++;
		return e;
	}), g = [
		["all", "All"],
		["unplayed", "Unplayed"],
		["progress", "In progress"],
		["played", "Played"]
	], _ = /* @__PURE__ */ N(F({}));
	gn(() => {
		!n().showSlug && n().podcastBrowse.status === "idle" && n().loadPodcastBrowse();
	}), gn(() => {
		!n().showSlug && U(l)?.status === "idle" && n().loadPodcastGenre();
	});
	let v = (e) => n().playFrom(e, (n().episodes.length ? n().episodes : U(f)).map((e) => e.id), U(r)?.title ?? "this show"), y = (e) => e ? `${e}s` : "Off";
	function b(e) {
		if (!U(r)) return;
		n().speeds = {
			...n().speeds,
			[`show:${U(r).slug}`]: e
		};
		let t = n().item;
		t?.type === "podcast" && t.show === U(r).slug ? n().setSpeed(e) : n().scheduleSave();
	}
	var x = jr(), S = L(x), C = (e) => {
		var t = Is(), r = z(L(t), 2), i = R(r), a = z(r, 2), o = (e) => {
			var t = js();
			Y(t, 21, () => wa, (e) => e.label, (e, t) => {
				var r = As();
				let i;
				var a = R(r, !0);
				B(() => {
					i = X(r, 1, "chip svelte-1phe8yx", null, i, { on: n().podGenre === U(t).label }), Z(r, "aria-pressed", n().podGenre === U(t).label), q(a, U(t).label);
				}), W("click", r, () => {
					n().podGenre = U(t).label, n().scheduleSave();
				}), K(e, r);
			}), k(t), K(e, t);
		};
		J(a, (e) => {
			n().podcastGenres && e(o);
		});
		var s = z(a, 2), c = (e) => {
			var t = Ps();
			Y(t, 21, () => U(d), (e) => e.slug, (e, t) => {
				let r = /* @__PURE__ */ j(() => n().newCount(U(t).slug));
				var i = Ns(), a = I(i);
				Ga(a, {
					get hue() {
						return U(t).hue;
					},
					get art() {
						return U(t).art;
					},
					size: 28,
					radius: 7,
					font: 9,
					get mark() {
						return U(t).mark;
					}
				});
				var o = z(a), s = R(o, !0), c = z(o), l = (e) => {
					var t = Ms(), n = R(t, !0);
					B(() => q(n, U(r))), K(e, t);
				};
				J(c, (e) => {
					U(r) && e(l);
				}), k(i), B(() => q(s, U(t).title)), W("click", i, () => n().openShow(U(t).slug)), K(e, i);
			}), k(t), K(e, t);
		};
		J(s, (e) => {
			U(d).length && e(c);
		});
		var f = z(s, 2);
		ks(f, {
			get cards() {
				return U(u);
			},
			open: (e) => n().openShow(e)
		});
		var p = z(f, 2), m = (e) => {
			{
				let t = /* @__PURE__ */ j(() => U(l).status === "idle" ? "loading" : U(l).status);
				bo(e, {
					get status() {
						return U(t);
					},
					retry: () => n().loadPodcastGenre(),
					empty: "No shows in this category right now."
				});
			}
		}, h = (e) => {
			bo(e, {
				get status() {
					return n().podcastBrowse.status;
				},
				retry: () => n().loadPodcastBrowse()
			});
		};
		J(p, (e) => {
			U(l) ? e(m) : e(h, -1);
		});
		var g = z(p, 2), _ = (e) => {
			var t = Fs();
			W("click", t, () => n().loadPodcastBrowse(!0)), K(e, t);
		};
		J(g, (e) => {
			!U(l) && n().podcastBrowse.cursor && n().podcastBrowse.status === "ready" && e(_);
		}), B(() => q(i, `${U(l) ? `The most popular ${n().podGenre} shows on OndaCast.` : "Recently updated shows on OndaCast."} Subscribe and new episodes land in Listen now.`)), K(e, t);
	}, w = (e) => {
		var t = Zs(), l = L(t), u = z(l, 2), d = (e) => {
			var t = zs(), a = I(t);
			Ga(I(a), {
				get hue() {
					return U(r).hue;
				},
				get art() {
					return U(r).art;
				},
				size: 132,
				radius: 16,
				get mark() {
					return U(r).mark;
				},
				font: 20
			}), k(a);
			var o = z(a, 2), l = I(o), u = R(l), d = z(l, 2), m = R(d, !0), h = z(d, 2), g = (e) => {
				var t = Ls(), n = R(t, !0);
				B(() => q(n, U(r).author)), K(e, t);
			};
			J(h, (e) => {
				U(r).author && e(g);
			});
			var _ = z(h, 2), v = R(_, !0), x = z(_, 2), S = I(x);
			$(I(S), {
				get d() {
					return Q.play;
				},
				size: 12
			}), A(), k(S);
			var C = z(S, 2);
			let w;
			var T = R(C, !0), E = z(C, 2), ee = I(E);
			$(I(ee), {
				get d() {
					return Q.gear;
				},
				size: 14,
				stroke: 1.6
			}), A(), k(ee);
			var te = z(ee, 2), ne = (e) => {
				var t = Rs(), a = I(t), o = R(a, !0), l = z(a, 4);
				Y(l, 21, () => Aa, Wr, (e, t) => {
					var i = As();
					let a;
					var o = R(i, !0);
					B((e) => {
						a = X(i, 1, "opt svelte-1phe8yx", null, a, { sel: U(s).intro === U(t) }), q(o, e);
					}, [() => y(U(t))]), W("click", i, () => n().setShowPref(U(r).slug, "intro", U(t))), K(e, i);
				}), k(l);
				var u = z(l, 4);
				Y(u, 21, () => ja, Wr, (e, t) => {
					var i = As();
					let a;
					var o = R(i, !0);
					B((e) => {
						a = X(i, 1, "opt svelte-1phe8yx", null, a, { sel: U(s).outro === U(t) }), q(o, e);
					}, [() => y(U(t))]), W("click", i, () => n().setShowPref(U(r).slug, "outro", U(t))), K(e, i);
				}), k(u);
				var d = z(u, 4);
				Y(d, 21, () => Ma, Wr, (e, t) => {
					var n = As();
					let r;
					var i = R(n);
					B((e) => {
						r = X(n, 1, "opt svelte-1phe8yx", null, r, { sel: U(c) === U(t) }), q(i, `${e ?? ""}×`);
					}, [() => U(t).toFixed(1)]), W("click", n, () => b(U(t))), K(e, n);
				}), k(d);
				var f = z(d, 2), p = z(I(f), 2);
				yi(p), k(f), k(t), B(() => {
					Z(t, "aria-label", `Settings for ${U(r).title ?? ""}`), q(o, U(r).title), xi(p, U(s).autoQueue);
				}), W("change", p, (e) => {
					n().setShowPref(U(r).slug, "autoQueue", e.currentTarget.checked), e.currentTarget.checked && !U(i) && n().toggleSubscribe(U(r).slug);
				}), K(e, t);
			};
			J(te, (e) => {
				n().pop === "show" && U(s) && e(ne);
			}), k(E), k(x), k(o), k(t), B(() => {
				q(u, `Podcast${U(r).category ? ` · ${U(r).category}` : ""}`), q(m, U(r).title), q(v, U(r).desc), S.disabled = !U(p), w = X(C, 1, "sub svelte-1phe8yx", null, w, { on: U(i) }), Z(C, "aria-pressed", U(i)), q(T, U(i) ? "Subscribed" : "Subscribe"), Z(ee, "aria-expanded", n().pop === "show");
			}), W("click", S, () => U(p) && n().playFrom(U(p).id, [...U(f)].sort((e, t) => (t.date || "").localeCompare(e.date || "")).map((e) => e.id), U(r).title)), W("click", C, () => n().toggleSubscribe(U(r).slug)), W("click", ee, () => n().togglePop("show")), K(e, t);
		};
		J(u, (e) => {
			U(r) && e(d);
		});
		var x = z(u, 2), S = z(I(x), 2), C = I(S);
		let w;
		var T = z(C, 2);
		let E;
		k(S);
		var ee = z(S, 4), te = I(ee);
		$(te, {
			get d() {
				return Q.search;
			},
			size: 12,
			stroke: 2
		});
		var ne = z(te);
		yi(ne), k(ee);
		var re = z(ee, 2), ie = I(re), ae = z(ie, 2), oe = (e) => {
			var t = Bs(), i = I(t);
			$(I(i), {
				get d() {
					return Q.play;
				},
				size: 12
			}), A(), k(i);
			var a = z(i, 2);
			$(I(a), {
				get d() {
					return Q.plus;
				},
				size: 12,
				stroke: 2
			}), A(), k(a);
			var o = z(a, 2);
			$(I(o), {
				get d() {
					return Q.check;
				},
				size: 12,
				stroke: 2
			}), A(), k(o);
			var s = z(o, 2);
			$(I(s), {
				get d() {
					return Q.clock;
				},
				size: 12,
				stroke: 2
			}), A(), k(s), k(t), W("click", i, () => {
				n().pop = null, n().queueUnplayed(!0);
			}), W("click", a, () => {
				n().pop = null, n().queueUnplayed(!1);
			}), W("click", o, () => {
				n().pop = null, n().markShow(U(r).slug, !0);
			}), W("click", s, () => {
				n().pop = null, n().markShow(U(r).slug, !1);
			}), K(e, t);
		};
		J(ae, (e) => {
			n().pop === "epmenu" && U(r) && e(oe);
		}), k(re), k(x);
		var se = z(x, 2), ce = I(se);
		Y(ce, 17, () => g, ([e, t]) => e, (e, t) => {
			var r = /* @__PURE__ */ j(() => m(U(t), 2));
			let i = () => U(r)[0], a = () => U(r)[1];
			var o = Vs();
			let s;
			var c = I(o, !0), l = R(z(c), !0);
			k(o), B(() => {
				s = X(o, 1, "fchip svelte-1phe8yx", null, s, { on: n().epFilter === i() }), Z(o, "aria-pressed", n().epFilter === i()), q(c, a()), q(l, U(h)[i()]);
			}), W("click", o, () => n().epFilter = i()), K(e, o);
		});
		var le = z(ce, 2), ue = (e) => {
			var t = Hs(), n = R(t);
			B(() => q(n, `${U(f).length ?? ""} loaded`)), K(e, t);
		};
		J(le, (e) => {
			U(a)?.hasNext && e(ue);
		}), k(se);
		var de = z(se, 2);
		Y(de, 17, () => n().episodes, (e) => e.id, (e, t) => {
			let r = /* @__PURE__ */ j(() => n().isDone(U(t).id));
			var i = Ys();
			let a;
			var o = I(i), s = I(o);
			{
				let e = /* @__PURE__ */ j(() => n().isPlaying(U(t).id) ? Q.pause : Q.play);
				$(s, {
					get d() {
						return U(e);
					},
					size: 13
				});
			}
			k(o);
			var c = z(o, 2), l = I(c), u = R(l, !0), d = z(l, 2);
			let f;
			var p = R(d, !0), m = z(d, 2), h = (e) => {
				var i = Us(), a = I(i), o = I(a);
				let s;
				k(a);
				var c = R(z(a), !0);
				k(i), B((e, t) => {
					s = si(o, "", s, { width: e }), q(c, t);
				}, [() => `${(U(r) ? 100 : n().pctOf(U(t).id)) ?? ""}%`, () => n().leftOf(U(t).id)]), K(e, i);
			}, g = /* @__PURE__ */ j(() => n().progressOf(U(t).id) > 5 || U(r));
			J(m, (e) => {
				U(g) && e(h);
			});
			var y = z(m, 2), b = (e) => {
				var n = Gs(), r = L(n), i = R(r, !0), a = z(r, 2), o = (e) => {
					var n = Ws(), r = R(n, !0);
					B(() => q(r, U(t).desc)), K(e, n);
				};
				J(a, (e) => {
					U(_)[U(t).id] && e(o);
				}), B(() => {
					Z(r, "aria-expanded", !!U(_)[U(t).id]), q(i, U(_)[U(t).id] ? "Hide show notes" : "Show notes");
				}), W("click", r, () => P(_, {
					...U(_),
					[U(t).id]: !U(_)[U(t).id]
				}, !0)), K(e, n);
			};
			J(y, (e) => {
				U(t).desc && e(b);
			}), k(c);
			var x = z(c, 2), S = (e) => {
				var t = qs(), r = I(t), i = (e) => {
					K(e, Ks());
				};
				J(r, (e) => {
					n().playing && e(i);
				}), A(), k(t), K(e, t);
			}, C = (e) => {
				var r = Js(), i = L(r), a = z(i, 2);
				W("click", i, () => n().playNext(U(t).id)), W("click", a, () => n().addToQueue(U(t).id)), K(e, r);
			};
			J(x, (e) => {
				U(t).id === n().now ? e(S) : e(C, -1);
			});
			var w = z(x, 2);
			lo(w, {
				get store() {
					return n();
				},
				get id() {
					return U(t).id;
				}
			});
			var T = z(w, 2);
			let E;
			$(I(T), {
				get d() {
					return Q.check;
				},
				size: 15,
				stroke: 2
			}), k(T), k(i), B((e, s) => {
				a = X(i, 1, "ep svelte-1phe8yx", null, a, { cur: U(t).id === n().now }), Z(o, "aria-label", `${e ?? ""} ${U(t).title ?? ""}`), q(u, s), f = X(d, 1, "title svelte-1phe8yx", null, f, { done: U(r) && U(t).id !== n().now }), q(p, U(t).title), E = X(T, 1, "mark svelte-1phe8yx", null, E, { done: U(r) }), Z(T, "title", U(r) ? "Mark as unplayed" : "Mark as played"), Z(T, "aria-label", U(r) ? "Mark as unplayed" : "Mark as played"), Z(T, "aria-pressed", U(r));
			}, [() => n().isPlaying(U(t).id) ? "Pause" : "Play", () => [Wi(U(t).date), n().lenOf(U(t).id)].filter(Boolean).join(" · ")]), W("click", o, () => v(U(t).id)), W("click", T, () => n().togglePlayed(U(t).id)), K(e, i);
		});
		var fe = z(de, 2);
		{
			let e = /* @__PURE__ */ j(() => U(a)?.status ?? "loading"), t = /* @__PURE__ */ j(() => U(a)?.status === "ready" && !n().episodes.length ? U(f).length ? "No episodes match. Change the filter or load more." : "This show has no playable episodes yet." : "");
			bo(fe, {
				get status() {
					return U(e);
				},
				retry: () => n().showSlug && n().loadShow(n().showSlug, (U(a)?.ids.length ?? 0) > 0),
				get empty() {
					return U(t);
				}
			});
		}
		var pe = z(fe, 2), me = (e) => {
			var t = Xs(), r = R(t, !0);
			B(() => q(r, U(o) === "new" ? "Older episodes" : "Newer episodes")), W("click", t, () => n().showSlug && n().loadShow(n().showSlug, !0)), K(e, t);
		};
		J(pe, (e) => {
			U(a)?.hasNext && U(a).status === "ready" && e(me);
		}), B(() => {
			Z(C, "aria-pressed", U(o) === "new"), w = X(C, 1, "svelte-1phe8yx", null, w, { on: U(o) === "new" }), Z(T, "aria-pressed", U(o) === "old"), E = X(T, 1, "svelte-1phe8yx", null, E, { on: U(o) === "old" }), Z(ie, "aria-expanded", n().pop === "epmenu");
		}), W("click", l, () => n().showSlug = null), W("click", C, () => U(r) && n().setEpisodeOrder(U(r).slug, "new")), W("click", T, () => U(r) && n().setEpisodeOrder(U(r).slug, "old")), Ti(ne, () => n().epQuery, (e) => n().epQuery = e), W("click", ie, () => n().togglePop("epmenu")), K(e, t);
	};
	J(S, (e) => {
		n().showSlug ? e(w, -1) : e(C);
	}), K(e, x), We();
}
br(["click", "change"]);
//#endregion
//#region src/components/BookView.svelte
var ec = /* @__PURE__ */ G("<span class=\"sbar svelte-965svo\"><span class=\"svelte-965svo\"></span></span>"), tc = /* @__PURE__ */ G("<button class=\"shelfitem svelte-965svo\"><span class=\"scover svelte-965svo\"><!></span> <span class=\"stext svelte-965svo\"><span class=\"stitle svelte-965svo\"> </span><span class=\"smeta svelte-965svo\"> </span> <!></span></button>"), nc = /* @__PURE__ */ G("<div class=\"shelf svelte-965svo\"></div>"), rc = /* @__PURE__ */ G("<button class=\"more svelte-965svo\">Show more</button>"), ic = /* @__PURE__ */ G("<h1 class=\"h1 svelte-965svo\">Audiobooks</h1> <p class=\"lede svelte-965svo\">Public-domain classics read by LibriVox volunteers, via OndaCast.</p> <!> <!> <!> <!>", 1), ac = /* @__PURE__ */ G("<div class=\"prog svelte-965svo\"><span class=\"bar svelte-965svo\"><span class=\"svelte-965svo\"></span></span><span class=\"left svelte-965svo\"> </span></div>"), oc = /* @__PURE__ */ G("<div class=\"where svelte-965svo\"> </div>"), sc = /* @__PURE__ */ G("<div class=\"tm-pop menu svelte-965svo\" role=\"menu\"><button role=\"menuitem\" class=\"svelte-965svo\"><!> </button> <button role=\"menuitem\" class=\"svelte-965svo\"><!>Start over</button></div>"), cc = /* @__PURE__ */ G("<button class=\"link svelte-965svo\"> </button>"), lc = /* @__PURE__ */ G("<p> </p> <!>", 1), uc = /* @__PURE__ */ G("<form class=\"noteform svelte-965svo\"><input maxlength=\"500\" placeholder=\"Add a note\" class=\"svelte-965svo\"/> <button type=\"submit\" class=\"svelte-965svo\">Save</button></form>"), dc = /* @__PURE__ */ G("<button class=\"note svelte-965svo\"> </button>"), fc = /* @__PURE__ */ G("<button class=\"addnote svelte-965svo\">Add a note</button>"), pc = /* @__PURE__ */ G("<div class=\"mrow svelte-965svo\"><div class=\"mbody svelte-965svo\"><button class=\"mjump svelte-965svo\"> <span class=\"svelte-965svo\"> </span></button> <!></div> <button class=\"rm svelte-965svo\"><!></button></div>"), mc = /* @__PURE__ */ G("<h2 class=\"svelte-965svo\">Bookmarks</h2> <!>", 1), hc = /* @__PURE__ */ G("<label class=\"find svelte-965svo\"><!><input type=\"search\" placeholder=\"Find a chapter\" aria-label=\"Find a chapter\" class=\"svelte-965svo\"/></label>"), gc = /* @__PURE__ */ G("<label class=\"hide svelte-965svo\"><input type=\"checkbox\" class=\"svelte-965svo\"/>Hide finished</label>"), _c = /* @__PURE__ */ G("<button><span class=\"n svelte-965svo\"> </span> <span class=\"title svelte-965svo\"> </span> <span class=\"state svelte-965svo\"> </span></button>"), vc = /* @__PURE__ */ G("<div class=\"hero svelte-965svo\"><div class=\"cover svelte-965svo\"><!></div> <div class=\"info svelte-965svo\"><div class=\"eyebrow svelte-965svo\">Audiobook · Public domain</div> <h1 class=\"svelte-965svo\"> </h1> <p class=\"sub svelte-965svo\"> </p> <!> <!> <div class=\"actions svelte-965svo\"><button class=\"primary svelte-965svo\"><!> </button> <button><!> </button> <button class=\"ghost svelte-965svo\">Add bookmark</button> <span class=\"anchor svelte-965svo\"><button class=\"ghost dots svelte-965svo\" data-pop=\"\" aria-haspopup=\"menu\" aria-label=\"More actions\">•••</button> <!></span></div></div></div> <!> <!> <div class=\"chead svelte-965svo\"><h2 class=\"svelte-965svo\">Chapters</h2> <span class=\"spacer svelte-965svo\"></span> <!> <!></div> <!>", 1), yc = /* @__PURE__ */ G("<button class=\"back svelte-965svo\">‹ All audiobooks</button> <!> <!>", 1), bc = {
	hash: "svelte-965svo",
	code: ".h1.svelte-965svo {font-size:26px;font-weight:650;letter-spacing:-.5px;margin:0;}.lede.svelte-965svo {font-size:13px;color:var(--tm-muted);margin:4px 0 0;}.more.svelte-965svo {display:block;margin:16px auto 0;height:32px;padding:0 18px;border-radius:16px;border:1px solid var(--tm-fg-14);background:transparent;color:var(--tm-fg);font-size:12px;cursor:pointer;}.back.svelte-965svo {border:0;background:none;color:var(--tm-muted);font-size:12px;cursor:pointer;padding:0;margin:-8px 0 14px;}.back.svelte-965svo:hover {color:var(--tm-fg);}.hero.svelte-965svo {display:flex;gap:24px;}.cover.svelte-965svo {width:120px;height:176px;border-radius:6px 12px 12px 6px;flex:none;overflow:hidden;display:flex;box-shadow:0 18px 40px rgba(0, 0, 0, .4), inset 6px 0 0 rgba(0, 0, 0, .18);}.info.svelte-965svo {flex:1;min-width:0;padding-top:6px;}.eyebrow.svelte-965svo {font-size:10.5px;letter-spacing:1px;text-transform:uppercase;color:var(--tm-accent);font-weight:600;}h1.svelte-965svo {font-size:28px;font-weight:700;letter-spacing:-.6px;margin:4px 0 0;line-height:1.15;}.sub.svelte-965svo {font-size:13px;color:var(--tm-muted);margin:4px 0 0;}.prog.svelte-965svo {display:flex;align-items:center;gap:10px;margin-top:16px;}.bar.svelte-965svo {flex:1;max-width:260px;height:4px;border-radius:2px;background:var(--tm-fg-10);display:block;}.bar.svelte-965svo span:where(.svelte-965svo) {display:block;height:4px;border-radius:2px;background:var(--tm-accent);}.left.svelte-965svo {font-size:12px;}.actions.svelte-965svo {display:flex;gap:8px;margin-top:16px;flex-wrap:wrap;}.where.svelte-965svo {font-size:11.5px;color:var(--tm-muted);margin-top:6px;}.anchor.svelte-965svo {position:relative;display:inline-flex;}.dots.svelte-965svo {width:38px;justify-content:center;letter-spacing:1px;padding:0 !important;}.menu.svelte-965svo {left:0;top:40px;width:210px;padding:6px;}.menu.svelte-965svo button:where(.svelte-965svo) {display:flex;align-items:center;gap:9px;width:100%;height:32px;padding:0 10px;border:0;border-radius:8px;background:none;color:var(--tm-fg);font-size:12px;cursor:pointer;text-align:left;}.menu.svelte-965svo button:where(.svelte-965svo):hover {background:var(--tm-fg-8);}.desc.svelte-965svo {font-size:12.5px;line-height:1.6;color:var(--tm-muted);margin:20px 0 0;max-width:720px;display:-webkit-box;-webkit-line-clamp:3;line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;}.desc.open.svelte-965svo {display:block;}.link.svelte-965svo {border:0;background:none;padding:0;color:var(--tm-accent);font-size:12px;cursor:pointer;margin-top:4px;}.mbody.svelte-965svo {flex:1;min-width:0;}.note.svelte-965svo, .addnote.svelte-965svo {display:block;border:0;background:none;padding:0 8px 9px;text-align:left;font:inherit;font-size:12px;cursor:pointer;}.note.svelte-965svo {color:var(--tm-fg);font-style:italic;}.addnote.svelte-965svo {color:var(--tm-muted);}.addnote.svelte-965svo:hover {color:var(--tm-accent);}.noteform.svelte-965svo {display:flex;gap:6px;padding:0 8px 9px;}.noteform.svelte-965svo input:where(.svelte-965svo) {flex:1;min-width:0;height:28px;padding:0 8px;border-radius:7px;border:1px solid var(--tm-fg-14);background:var(--tm-fg-4);color:var(--tm-fg);font:inherit;font-size:12px;outline:none;}.noteform.svelte-965svo input:where(.svelte-965svo):focus {border-color:var(--tm-accent);}.noteform.svelte-965svo button:where(.svelte-965svo) {height:28px;padding:0 12px;border:0;border-radius:7px;background:var(--tm-accent);color:var(--tm-on-accent);font-size:11.5px;font-weight:650;cursor:pointer;}.chead.svelte-965svo {display:flex;align-items:center;gap:10px;margin:26px 0 6px;}.chead.svelte-965svo h2:where(.svelte-965svo) {margin:0;}.spacer.svelte-965svo {flex:1;}.find.svelte-965svo {display:flex;align-items:center;gap:6px;height:28px;padding:0 10px;border-radius:8px;background:var(--tm-fg-6);width:170px;color:var(--tm-muted);}.find.svelte-965svo input:where(.svelte-965svo) {flex:1;min-width:0;border:0;background:none;outline:none;color:var(--tm-fg);font:inherit;font-size:12px;}.hide.svelte-965svo {display:flex;align-items:center;gap:6px;font-size:12px;color:var(--tm-muted);cursor:pointer;}.hide.svelte-965svo input:where(.svelte-965svo) {accent-color:var(--tm-accent);}.shelf.svelte-965svo {display:flex;gap:10px;overflow-x:auto;margin-top:16px;padding-bottom:4px;scrollbar-width:thin;}.shelfitem.svelte-965svo {display:flex;gap:10px;align-items:center;flex:none;width:230px;padding:8px;border:1px solid var(--tm-fg-10);border-radius:12px;background:var(--tm-fg-4);color:inherit;cursor:pointer;text-align:left;font:inherit;}.shelfitem.svelte-965svo:hover {border-color:var(--tm-accent);}.scover.svelte-965svo {width:36px;height:52px;border-radius:3px 6px 6px 3px;overflow:hidden;display:flex;flex:none;}.stext.svelte-965svo {flex:1;min-width:0;display:flex;flex-direction:column;gap:3px;}.stitle.svelte-965svo {font-size:12px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.smeta.svelte-965svo {font-size:10.5px;color:var(--tm-muted);}.sbar.svelte-965svo {display:block;height:3px;border-radius:2px;background:var(--tm-fg-10);}.sbar.svelte-965svo span:where(.svelte-965svo) {display:block;height:3px;border-radius:2px;background:var(--tm-accent);}.actions.svelte-965svo button:where(.svelte-965svo) {height:34px;border-radius:17px;cursor:pointer;}.actions.svelte-965svo button:where(.svelte-965svo):disabled {opacity:.5;cursor:default;}.primary.svelte-965svo {padding:0 16px;border:0;background:var(--tm-accent);color:var(--tm-on-accent);font-size:12.5px;font-weight:650;display:flex;align-items:center;gap:7px;}.ghost.saved.svelte-965svo {color:var(--tm-live);border-color:color-mix(in srgb, var(--tm-live) 40%, transparent);}.ghost.svelte-965svo {display:flex;align-items:center;gap:6px;padding:0 14px;border:1px solid var(--tm-fg-14);background:transparent;color:var(--tm-fg);font-size:12px;}h2.svelte-965svo {font-size:14px;font-weight:600;margin:26px 0 6px;}.mrow.svelte-965svo {align-items:flex-start;}.mrow.svelte-965svo {display:flex;align-items:center;border-top:1px solid var(--tm-fg-6);}.mjump.svelte-965svo {flex:1;width:100%;display:flex;justify-content:space-between;gap:12px;padding:9px 8px;border:0;background:none;color:var(--tm-fg);font:inherit;font-size:12.5px;cursor:pointer;text-align:left;}.mjump.svelte-965svo span:where(.svelte-965svo) {color:var(--tm-muted);font-size:11px;}.mjump.svelte-965svo:hover {background:var(--tm-fg-4);}.rm.svelte-965svo {width:26px;height:26px;border:0;background:none;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;border-radius:6px;}.rm.svelte-965svo:hover {color:var(--tm-fg);background:var(--tm-fg-8);}.chap.svelte-965svo {display:flex;align-items:center;gap:14px;width:100%;padding:10px 8px;border:0;border-top:1px solid var(--tm-fg-6);background:transparent;color:var(--tm-fg);cursor:pointer;text-align:left;font:inherit;}.chap.svelte-965svo:hover {background:var(--tm-fg-4);}.chap.cur.svelte-965svo {background:var(--tm-accent-7);}.n.svelte-965svo {width:30px;flex:none;font:500 11px ui-monospace, Menlo, monospace;color:var(--tm-muted);}.title.svelte-965svo {flex:1;font-size:13px;min-width:0;}.cur.svelte-965svo .title:where(.svelte-965svo) {color:var(--tm-accent);}.done.svelte-965svo .title:where(.svelte-965svo) {color:var(--tm-muted);}.state.svelte-965svo {font-size:11px;color:var(--tm-muted);flex:none;}"
};
function xc(e, t) {
	Ue(t, !0), $r(e, bc);
	let n = ji(t, "store", 7), r = /* @__PURE__ */ j(() => n().book), i = /* @__PURE__ */ j(() => U(r) ? n().progressOf(U(r).id) : 0), a = /* @__PURE__ */ j(() => U(r) ? n().speedFor(U(r).id) : 1), o = /* @__PURE__ */ j(() => U(r) ? Math.max(0, aa(U(r).chapters, U(i))) : 0), s = /* @__PURE__ */ j(() => !!U(r) && n().isPlaying(U(r).id)), c = /* @__PURE__ */ j(() => U(r) ? n().bookmarks[U(r).id] ?? [] : []), l = /* @__PURE__ */ j(() => n().bookBrowse.ids.map((e) => n().items[e]).filter(Boolean).map((e) => ({
		key: e.id,
		title: e.title,
		sub: e.sub,
		hue: e.hue,
		mark: e.mark,
		art: e.art
	}))), u = /* @__PURE__ */ j(() => n().libraryBooks.filter((e) => !n().played[e.id] && n().progressOf(e.id) > 5).concat(n().item?.type === "book" && !n().libraryBooks.some((e) => e.id === n().now) && n().pos > 5 ? [n().item] : [])), d = /* @__PURE__ */ j(() => Object.values(n().saved).filter((e) => !U(u).some((t) => t.id === e.id)).map((e) => n().items[e.id] ?? e)), f = /* @__PURE__ */ j(() => !!U(r) && !!n().played[U(r).id]), p = /* @__PURE__ */ j(() => U(r) && U(r).chapters.length ? Math.max(0, U(r).chapters[U(o)].start + b(U(o)) - U(i)) : 0), m = /* @__PURE__ */ N(!1), h = /* @__PURE__ */ N(""), g = /* @__PURE__ */ N(!1), _ = /* @__PURE__ */ N(null), v = /* @__PURE__ */ N(""), y = /* @__PURE__ */ j(() => U(r) ? U(r).chapters.map((e, t) => ({
		c: e,
		i: t
	})).filter(({ c: e, i: t }) => (!U(m) || t >= U(o)) && (!U(h).trim() || e.title.toLowerCase().includes(U(h).trim().toLowerCase()))) : []);
	function b(e) {
		return U(r) ? U(r).chapters[e].dur || (U(r).chapters[e + 1]?.start ?? U(r).dur) - U(r).chapters[e].start : 0;
	}
	gn(() => {
		!n().bookId && n().bookBrowse.status === "idle" && n().loadBookBrowse();
	});
	function x(e) {
		U(r) && n().jumpTo(U(r).id, e);
	}
	var S = jr(), C = L(S), w = (e) => {
		var t = ic(), r = z(L(t), 4), i = (e) => {
			var t = nc();
			Y(t, 21, () => [...U(u), ...U(d)], (e) => e.id, (e, t) => {
				let r = /* @__PURE__ */ j(() => n().durOf(U(t).id) ? Math.round(n().progressOf(U(t).id) / n().durOf(U(t).id) * 100) : 0);
				var i = tc(), a = I(i);
				Ga(I(a), {
					get hue() {
						return U(t).hue;
					},
					get art() {
						return U(t).art;
					},
					fill: !0,
					radius: 0,
					get mark() {
						return U(t).mark;
					},
					font: 12
				}), k(a);
				var o = z(a, 2), s = I(o), c = R(s, !0), l = z(s), u = R(l, !0), d = z(l, 2), f = (e) => {
					var t = ec(), n = I(t);
					let i;
					k(t), B(() => i = si(n, "", i, { width: `${U(r) ?? ""}%` })), K(e, t);
				};
				J(d, (e) => {
					U(r) > 0 && e(f);
				}), k(o), k(i), B((e) => {
					q(c, U(t).title), q(u, e);
				}, [() => U(r) > 0 ? `${U(r)}% · ${n().leftOf(U(t).id)}` : "Saved"]), W("click", i, () => n().openBook(U(t).id)), K(e, i);
			}), k(t), K(e, t);
		};
		J(r, (e) => {
			(U(u).length || U(d).length) && e(i);
		});
		var a = z(r, 2);
		ks(a, {
			get cards() {
				return U(l);
			},
			tall: !0,
			open: (e) => n().openBook(e)
		});
		var o = z(a, 2);
		bo(o, {
			get status() {
				return n().bookBrowse.status;
			},
			retry: () => n().loadBookBrowse()
		});
		var s = z(o, 2), c = (e) => {
			var t = rc();
			W("click", t, () => n().loadBookBrowse(!0)), K(e, t);
		};
		J(s, (e) => {
			n().bookBrowse.cursor && n().bookBrowse.status === "ready" && e(c);
		}), K(e, t);
	}, T = (e) => {
		var t = yc(), l = L(t), u = z(l, 2), d = (e) => {
			var t = vc(), l = L(t), u = I(l);
			Ga(I(u), {
				get hue() {
					return U(r).hue;
				},
				get art() {
					return U(r).art;
				},
				fill: !0,
				radius: 0,
				get mark() {
					return U(r).mark;
				},
				font: 22
			}), k(u);
			var d = z(u, 2), S = z(I(d), 2), C = R(S, !0), w = z(S, 2), T = R(w, !0), E = z(w, 2), ee = (e) => {
				var t = ac(), n = I(t), o = I(n);
				let s;
				k(n);
				var c = R(z(n), !0);
				k(t), B((e, t) => {
					s = si(o, "", s, { width: e }), q(c, t);
				}, [() => `${U(f) ? 100 : Math.round(U(i) / U(r).dur * 100)}%`, () => U(f) ? "Finished" : `${ta((U(r).dur - U(i)) / U(a))} left at ${U(a).toFixed(1)}×`]), K(e, t);
			};
			J(E, (e) => {
				U(r).dur && e(ee);
			});
			var te = z(E, 2), ne = (e) => {
				var t = oc(), n = R(t);
				B((e, t) => q(n, `Chapter ${e ?? ""} of ${U(r).chapters.length ?? ""} · ${t ?? ""} left in this chapter`), [() => Li(U(o)), () => ta(U(p) / U(a))]), K(e, t);
			};
			J(te, (e) => {
				U(r).chapters.length && U(i) > 5 && !U(f) && e(ne);
			});
			var re = z(te, 2), ie = I(re), ae = I(ie);
			{
				let e = /* @__PURE__ */ j(() => U(s) ? Q.pause : Q.play);
				$(ae, {
					get d() {
						return U(e);
					},
					size: 12
				});
			}
			var oe = z(ae, 1, !0);
			k(ie);
			var se = z(ie, 2);
			let ce;
			var le = I(se);
			{
				let e = /* @__PURE__ */ j(() => n().isFavorite(U(r).id) ? 0 : 1.8);
				$(le, {
					get d() {
						return Q.heart;
					},
					size: 12,
					get stroke() {
						return U(e);
					}
				});
			}
			var ue = z(le, 1, !0);
			k(se);
			var de = z(se, 2), fe = z(de, 2), pe = I(fe), me = z(pe, 2), he = (e) => {
				var t = sc(), i = I(t), a = I(i);
				$(a, {
					get d() {
						return Q.check;
					},
					size: 12,
					stroke: 2
				});
				var o = z(a, 1, !0);
				k(i);
				var s = z(i, 2);
				$(I(s), {
					get d() {
						return Q.prev;
					},
					size: 12
				}), A(), k(s), k(t), B(() => q(o, U(f) ? "Mark as not finished" : "Mark as finished")), W("click", i, () => {
					n().pop = null, n().markBook(U(r).id, !U(f));
				}), W("click", s, () => {
					n().pop = null, n().restartBook(U(r).id);
				}), K(e, t);
			};
			J(me, (e) => {
				n().pop === "epmenu" && e(he);
			}), k(fe), k(re), k(d), k(l);
			var ge = z(l, 2), _e = (e) => {
				var t = lc(), n = L(t);
				let i;
				var a = R(n, !0), o = z(n, 2), s = (e) => {
					var t = cc(), n = R(t, !0);
					B(() => q(n, U(g) ? "Less" : "More")), W("click", t, () => P(g, !U(g))), K(e, t);
				};
				J(o, (e) => {
					U(r).desc.length > 220 && e(s);
				}), B(() => {
					i = X(n, 1, "desc svelte-965svo", null, i, { open: U(g) }), q(a, U(r).desc);
				}), K(e, t);
			};
			J(ge, (e) => {
				U(r).desc && e(_e);
			});
			var ve = z(ge, 2), ye = (e) => {
				var t = mc();
				Y(z(L(t), 2), 17, () => U(c), (e) => e.at, (e, t) => {
					var i = pc(), a = I(i), o = I(a), s = I(o, !0), c = R(z(s), !0);
					k(o);
					var l = z(o, 2), u = (e) => {
						var i = uc(), a = I(i);
						yi(a), ei(a, (e) => eo?.(e)), yn(() => Ti(a, () => U(v), (e) => P(v, e))), A(2), k(i), B(() => Z(a, "aria-label", `Note for ${U(t).label ?? ""}`)), yr("submit", i, (e) => {
							e.preventDefault(), n().setBookmarkNote(U(r).id, U(t).at, U(v)), P(_, null);
						}), W("keydown", a, (e) => {
							e.key === "Escape" && (e.stopPropagation(), P(_, null));
						}), K(e, i);
					}, d = (e) => {
						var n = dc(), r = R(n, !0);
						B(() => q(r, U(t).note)), W("click", n, () => {
							P(_, U(t).at, !0), P(v, U(t).note ?? "", !0);
						}), K(e, n);
					}, f = (e) => {
						var n = fc();
						W("click", n, () => {
							P(_, U(t).at, !0), P(v, "");
						}), K(e, n);
					};
					J(l, (e) => {
						U(_) === U(t).at ? e(u) : U(t).note ? e(d, 1) : e(f, -1);
					}), k(a);
					var p = z(a, 2);
					$(I(p), {
						get d() {
							return Q.close;
						},
						size: 12,
						stroke: 2
					}), k(p), k(i), B((e) => {
						q(s, U(t).label), q(c, e), Z(p, "aria-label", `Remove bookmark ${U(t).label ?? ""}`);
					}, [() => new Date(U(t).at).toLocaleDateString()]), W("click", o, () => x(U(t).pos)), W("click", p, () => n().removeBookmark(U(r).id, U(t).at)), K(e, i);
				}), K(e, t);
			};
			J(ve, (e) => {
				U(c).length && e(ye);
			});
			var be = z(ve, 2), D = z(I(be), 4), xe = (e) => {
				var t = hc(), n = I(t);
				$(n, {
					get d() {
						return Q.search;
					},
					size: 12,
					stroke: 2
				});
				var r = z(n);
				yi(r), k(t), Ti(r, () => U(h), (e) => P(h, e)), K(e, t);
			};
			J(D, (e) => {
				U(r).chapters.length > 12 && e(xe);
			});
			var O = z(D, 2), Se = (e) => {
				var t = gc(), n = I(t);
				yi(n), A(), k(t), Ei(n, () => U(m), (e) => P(m, e)), K(e, t);
			};
			J(O, (e) => {
				U(o) > 0 && e(Se);
			}), k(be), Y(z(be, 2), 17, () => U(y), ({ c: e, i: t }) => t, (e, t) => {
				let n = () => U(t).c, r = () => U(t).i;
				var a = _c();
				let s;
				var c = I(a), l = R(c, !0), u = z(c, 2), d = R(u, !0), f = R(z(u, 2), !0);
				k(a), B((e, t) => {
					s = X(a, 1, "chap svelte-965svo", null, s, {
						cur: r() === U(o) && U(i) > 0,
						done: r() < U(o)
					}), q(l, e), q(d, n().title), q(f, t);
				}, [() => Li(r()), () => r() < U(o) ? "Finished" : r() === U(o) && U(i) > 0 && b(r()) ? `${Math.min(100, Math.round((U(i) - n().start) / b(r()) * 100))}%` : b(r()) ? ta(b(r())) : ""]), W("click", a, () => x(n().start)), K(e, a);
			}), B((e, t, a, o) => {
				q(C, U(r).title), q(T, U(r).sub), ie.disabled = !U(r).chapters.length, q(oe, e), ce = X(se, 1, "ghost svelte-965svo", null, ce, { saved: t }), Z(se, "aria-pressed", a), q(ue, o), de.disabled = U(i) <= 0, Z(pe, "aria-expanded", n().pop === "epmenu");
			}, [
				() => U(s) ? "Pause" : U(i) > 5 ? `Resume chapter ${Li(U(o))}` : "Start listening",
				() => n().isFavorite(U(r).id),
				() => n().isFavorite(U(r).id),
				() => n().isFavorite(U(r).id) ? "In My Media" : "Save to My Media"
			]), W("click", ie, () => n().play(U(r).id)), W("click", se, () => n().toggleFavorite(U(r).id)), W("click", de, () => n().bookmark()), W("click", pe, () => n().togglePop("epmenu")), K(e, t);
		};
		J(u, (e) => {
			U(r) && e(d);
		});
		var S = z(u, 2), C = (e) => {
			{
				let t = /* @__PURE__ */ j(() => n().bookStatus[n().bookId] ?? "loading");
				bo(e, {
					get status() {
						return U(t);
					},
					retry: () => n().bookId && n().ensureBook(n().bookId),
					empty: "This audiobook has no playable chapters yet."
				});
			}
		};
		J(S, (e) => {
			U(r)?.chapters.length || e(C);
		}), W("click", l, () => n().bookId = null), K(e, t);
	};
	J(C, (e) => {
		n().bookId ? e(T, -1) : e(w);
	}), K(e, S), We();
}
br(["click", "keydown"]);
//#endregion
//#region src/components/SearchView.svelte
var Sc = /* @__PURE__ */ G("<div class=\"srow svelte-1occquv\"><button class=\"row svelte-1occquv\"><!> <span class=\"text svelte-1occquv\"><span class=\"title svelte-1occquv\"> </span><span class=\"meta svelte-1occquv\"> </span></span> <span class=\"act svelte-1occquv\"><!> </span></button> <span class=\"sfav svelte-1occquv\"><!></span></div>"), Cc = /* @__PURE__ */ G("<button class=\"more svelte-1occquv\">More stations</button>"), wc = /* @__PURE__ */ G("<h2 class=\"svelte-1occquv\">Shows and books</h2>"), Tc = /* @__PURE__ */ G("<h2 class=\"svelte-1occquv\"> </h2> <div class=\"list svelte-1occquv\"></div> <!> <!> <!>", 1), Ec = /* @__PURE__ */ G("<button class=\"row svelte-1occquv\"><!> <span class=\"text svelte-1occquv\"><span class=\"title svelte-1occquv\"> </span><span class=\"meta svelte-1occquv\"> </span></span> <span class=\"act svelte-1occquv\"> </span></button>"), Dc = /* @__PURE__ */ G("<h1 class=\"h1 svelte-1occquv\"> </h1> <!> <div class=\"list svelte-1occquv\"></div> <!>", 1), Oc = {
	hash: "svelte-1occquv",
	code: ".h1.svelte-1occquv {font-size:22px;font-weight:650;letter-spacing:-.4px;margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.list.svelte-1occquv {margin-top:14px;}.row.svelte-1occquv {display:flex;align-items:center;gap:14px;width:100%;padding:10px 8px;border:0;border-radius:10px;background:none;color:inherit;text-align:left;cursor:pointer;font:inherit;}.row.svelte-1occquv:hover {background:var(--tm-fg-5);}.srow.svelte-1occquv {display:flex;align-items:center;}.srow.svelte-1occquv .row:where(.svelte-1occquv) {flex:1;min-width:0;}.sfav.svelte-1occquv {flex:none;margin-left:4px;}.text.svelte-1occquv {flex:1;min-width:0;display:flex;flex-direction:column;}.title.svelte-1occquv {font-size:13px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.meta.svelte-1occquv {font-size:11.5px;color:var(--tm-muted);margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.act.svelte-1occquv {font-size:11.5px;color:var(--tm-accent);flex:none;display:flex;align-items:center;gap:5px;}h2.svelte-1occquv {font-size:13px;font-weight:650;margin:18px 0 0;color:var(--tm-muted);}.more.svelte-1occquv {display:block;margin:10px auto 4px;height:30px;padding:0 16px;border-radius:15px;border:1px solid var(--tm-fg-14);background:transparent;color:var(--tm-fg);font-size:12px;cursor:pointer;}"
};
function kc(e, t) {
	Ue(t, !0), $r(e, Oc);
	let n = {
		station: "Radio",
		podcast: "Podcast",
		audiobook: "Audiobook"
	}, r = {
		station: "Play",
		podcast: "Open",
		audiobook: "Open"
	}, i = /* @__PURE__ */ j(() => t.store.stationHits.ids.map((e) => t.store.items[e]).filter((e) => e?.type === "radio")), a = /* @__PURE__ */ j(() => t.store.stationHits.status !== "idle"), o = /* @__PURE__ */ j(() => t.store.search.status === "ready" && !t.store.search.hits.length && (!U(a) || t.store.stationHits.status === "ready" && !U(i).length));
	var s = Dc(), c = L(s), l = R(c), u = z(c, 2), d = (e) => {
		var n = Tc(), r = L(n), a = R(r), o = z(r, 2);
		Y(o, 21, () => U(i), (e) => e.id, (e, n) => {
			let r = /* @__PURE__ */ j(() => t.store.isPlaying(U(n).id));
			var i = Sc(), a = I(i), o = I(a);
			Ga(o, {
				get hue() {
					return U(n).hue;
				},
				get art() {
					return U(n).art;
				},
				get mark() {
					return U(n).mark;
				},
				size: 44
			});
			var s = z(o, 2), c = I(s), l = R(c, !0), u = R(z(c), !0);
			k(s);
			var d = z(s, 2), f = I(d);
			{
				let e = /* @__PURE__ */ j(() => U(r) ? Q.stop : Q.play);
				$(f, {
					get d() {
						return U(e);
					},
					size: 12
				});
			}
			var p = z(f, 1, !0);
			k(d), k(a);
			var m = z(a, 2);
			jo(I(m), {
				get store() {
					return t.store;
				},
				get id() {
					return U(n).id;
				},
				size: 14
			}), k(m), k(i), B(() => {
				q(l, U(n).title), q(u, U(n).sub), q(p, U(r) ? "Stop" : "Play");
			}), W("click", a, () => U(r) ? t.store.stop() : t.store.play(U(n).id)), K(e, i);
		}), k(o);
		var s = z(o, 2), c = (e) => {
			var n = Cc();
			W("click", n, () => t.store.loadStationHits(t.store.search.q, !0)), K(e, n);
		};
		J(s, (e) => {
			t.store.stationHits.more && t.store.stationHits.status === "ready" && e(c);
		});
		var l = z(s, 2), u = (e) => {
			bo(e, {
				get status() {
					return t.store.stationHits.status;
				},
				retry: () => t.store.loadStationHits(t.store.search.q, U(i).length > 0)
			});
		};
		J(l, (e) => {
			(t.store.stationHits.status === "loading" || t.store.stationHits.status === "error") && e(u);
		});
		var d = z(l, 2), f = (e) => {
			K(e, wc());
		};
		J(d, (e) => {
			t.store.search.hits.length && e(f);
		}), B((e) => q(a, `Stations${e ?? ""}`), [() => t.store.stationHits.total ? ` · ${t.store.stationHits.total.toLocaleString()}` : ""]), K(e, n);
	};
	J(u, (e) => {
		U(a) && e(d);
	});
	var f = z(u, 2);
	Y(f, 21, () => t.store.search.hits, (e) => e.kind + e.id, (e, i) => {
		var a = Ec(), o = I(a);
		{
			let e = /* @__PURE__ */ j(() => Ri(U(i).slug || U(i).id)), t = /* @__PURE__ */ j(() => zi(U(i).title));
			Ga(o, {
				get hue() {
					return U(e);
				},
				get art() {
					return U(i).art;
				},
				get mark() {
					return U(t);
				},
				size: 44
			});
		}
		var s = z(o, 2), c = I(s), l = R(c, !0), u = R(z(c));
		k(s);
		var d = R(z(s, 2), !0);
		k(a), B(() => {
			q(l, U(i).title), q(u, `${n[U(i).kind] ?? ""}${U(i).subtitle ? ` · ${U(i).subtitle}` : ""}`), q(d, r[U(i).kind]);
		}), W("click", a, () => t.store.openHit(U(i))), K(e, a);
	}), k(f);
	var p = z(f, 2);
	{
		let e = /* @__PURE__ */ j(() => t.store.search.status === "idle" ? "loading" : t.store.search.status), n = /* @__PURE__ */ j(() => U(o) ? "Nothing matches. Try a station, show, book or author." : "");
		bo(p, {
			get status() {
				return U(e);
			},
			retry: () => t.store.setQuery(t.store.query),
			get empty() {
				return U(n);
			}
		});
	}
	B((e) => q(l, `Results for “${e ?? ""}”`), [() => t.store.query.trim()]), K(e, s), We();
}
br(["click"]);
//#endregion
//#region src/components/NowPlaying.svelte
var Ac = /* @__PURE__ */ G("<div class=\"blank svelte-1b7bd5u\"></div>"), jc = /* @__PURE__ */ G("<span class=\"kind svelte-1b7bd5u\"> </span>"), Mc = /* @__PURE__ */ G("<div class=\"prog svelte-1b7bd5u\" aria-label=\"Progress\"><span class=\"bar svelte-1b7bd5u\"><span class=\"svelte-1b7bd5u\"></span></span> <span class=\"pct svelte-1b7bd5u\"> </span></div>"), Nc = /* @__PURE__ */ G("<span class=\"badge svelte-1b7bd5u\"> </span>"), Pc = /* @__PURE__ */ G("<button role=\"tab\"> <!></button>"), Fc = /* @__PURE__ */ G("<div class=\"tabs svelte-1b7bd5u\" role=\"tablist\"></div>"), Ic = /* @__PURE__ */ G("<button class=\"q svelte-1b7bd5u\"><!> <span class=\"qtext svelte-1b7bd5u\"><span class=\"qtitle svelte-1b7bd5u\"> </span><span class=\"qmeta svelte-1b7bd5u\"> </span></span></button>"), Lc = /* @__PURE__ */ G("<h3 class=\"svelte-1b7bd5u\">Continue listening</h3> <!>", 1), Rc = /* @__PURE__ */ G("<div class=\"empty svelte-1b7bd5u\">Choose a station, an episode or a book. What you are listening to shows here.</div> <!>", 1), zc = /* @__PURE__ */ G("<span class=\"ontext svelte-1b7bd5u\"><span class=\"qtitle svelte-1b7bd5u\"> </span><span class=\"qmeta svelte-1b7bd5u\"> </span></span>"), Bc = /* @__PURE__ */ G("<span class=\"ontext svelte-1b7bd5u\"><span class=\"qtitle svelte-1b7bd5u\"> </span><span class=\"qmeta svelte-1b7bd5u\">This station does not publish song titles right now.</span></span>"), Vc = /* @__PURE__ */ G("<dt class=\"svelte-1b7bd5u\">From</dt><dd class=\"svelte-1b7bd5u\"> </dd>", 1), Hc = /* @__PURE__ */ G("<div class=\"q track svelte-1b7bd5u\"><!> <span class=\"qtext svelte-1b7bd5u\"><span class=\"qtitle svelte-1b7bd5u\"> </span><span class=\"qmeta svelte-1b7bd5u\"> </span></span></div>"), Uc = /* @__PURE__ */ G("<h3 class=\"svelte-1b7bd5u\">Recently played</h3> <!>", 1), Wc = /* @__PURE__ */ G("<div class=\"onair svelte-1b7bd5u\"><span class=\"dot svelte-1b7bd5u\" aria-hidden=\"true\"></span> <!></div> <h3 class=\"svelte-1b7bd5u\">Station</h3> <dl class=\"facts svelte-1b7bd5u\"><dt class=\"svelte-1b7bd5u\">Genre</dt><dd class=\"svelte-1b7bd5u\"> </dd> <!></dl> <!>", 1), Gc = /* @__PURE__ */ G("<form class=\"plform svelte-1b7bd5u\"><input maxlength=\"80\" placeholder=\"Playlist name\" aria-label=\"Playlist name\" class=\"svelte-1b7bd5u\"/> <button type=\"submit\" class=\"svelte-1b7bd5u\">Save</button></form>"), Kc = /* @__PURE__ */ G("<div class=\"qbar svelte-1b7bd5u\"><button class=\"svelte-1b7bd5u\"><!>Shuffle</button> <button class=\"svelte-1b7bd5u\"><!>Save as playlist</button> <button class=\"svelte-1b7bd5u\"><!>Clear</button></div> <!>", 1), qc = /* @__PURE__ */ G("<small class=\"svelte-1b7bd5u\">after your picks</small>"), Jc = /* @__PURE__ */ G("<div class=\"qfrom svelte-1b7bd5u\"><span class=\"svelte-1b7bd5u\"> </span><!></div>"), Yc = /* @__PURE__ */ G("<div role=\"listitem\" draggable=\"true\"><span class=\"grip svelte-1b7bd5u\" aria-hidden=\"true\"><!></span> <!> <button class=\"qtext svelte-1b7bd5u\"><span class=\"qtitle svelte-1b7bd5u\"> </span><span class=\"qmeta svelte-1b7bd5u\"> </span></button> <span class=\"moves svelte-1b7bd5u\"><button class=\"mv svelte-1b7bd5u\"><!></button> <button class=\"mv svelte-1b7bd5u\"><!></button></span> <button class=\"rm svelte-1b7bd5u\"><!></button></div>"), Xc = /* @__PURE__ */ G("<!> <!>", 1), Zc = /* @__PURE__ */ G("<div class=\"empty svelte-1b7bd5u\">Queue is empty. Use Play next or Queue on any episode, or play one from a show to queue the rest.</div>"), Qc = /* @__PURE__ */ G("<button><span class=\"t svelte-1b7bd5u\"> </span> <span class=\"ctitle svelte-1b7bd5u\"> </span> <span class=\"cstate svelte-1b7bd5u\"> </span></button>"), $c = /* @__PURE__ */ G("<div class=\"empty svelte-1b7bd5u\"> </div>"), el = /* @__PURE__ */ G("<div class=\"q svelte-1b7bd5u\"><button class=\"qtext svelte-1b7bd5u\"><span class=\"qtitle svelte-1b7bd5u\"> </span><span class=\"qmeta svelte-1b7bd5u\"> </span></button> <button class=\"rm svelte-1b7bd5u\"><!></button></div>"), tl = /* @__PURE__ */ G("<div class=\"empty svelte-1b7bd5u\">No bookmarks yet. Your place is saved automatically; bookmarks keep moments you want to return to.</div>"), nl = /* @__PURE__ */ G("<button class=\"add svelte-1b7bd5u\"><!>Bookmark this moment</button> <!>", 1), rl = /* @__PURE__ */ G("<dt class=\"svelte-1b7bd5u\">Length</dt><dd class=\"svelte-1b7bd5u\"> </dd>", 1), il = /* @__PURE__ */ G("<dt class=\"svelte-1b7bd5u\">Chapters</dt><dd class=\"svelte-1b7bd5u\"> </dd>", 1), al = /* @__PURE__ */ G("<dl class=\"facts svelte-1b7bd5u\"><dt class=\"svelte-1b7bd5u\">Author</dt><dd class=\"svelte-1b7bd5u\"> </dd> <!> <!> <dt class=\"svelte-1b7bd5u\">Narration</dt><dd class=\"svelte-1b7bd5u\">LibriVox volunteers</dd></dl>"), ol = /* @__PURE__ */ G("<dt class=\"svelte-1b7bd5u\">Published</dt><dd class=\"svelte-1b7bd5u\"> </dd>", 1), sl = /* @__PURE__ */ G("<dl class=\"facts svelte-1b7bd5u\"><dt class=\"svelte-1b7bd5u\">Show</dt><dd class=\"svelte-1b7bd5u\"><button class=\"link svelte-1b7bd5u\"> </button></dd> <!> <!></dl>"), cl = /* @__PURE__ */ G("<p class=\"desc svelte-1b7bd5u\"> </p>"), ll = /* @__PURE__ */ G("<!> <!> <!>", 1), ul = /* @__PURE__ */ G("<button><span class=\"who svelte-1b7bd5u\"> </span> </button>"), dl = /* @__PURE__ */ G("<div></div>"), fl = /* @__PURE__ */ G("<aside class=\"aside svelte-1b7bd5u\" aria-label=\"Now playing\"><div class=\"top svelte-1b7bd5u\"><div><!> <!></div> <div class=\"trow svelte-1b7bd5u\"><div class=\"ttext svelte-1b7bd5u\"><div class=\"title svelte-1b7bd5u\"> </div><div class=\"sub svelte-1b7bd5u\"> </div></div> <!></div> <!></div> <!> <div class=\"body svelte-1b7bd5u\" role=\"tabpanel\"><!></div></aside>"), pl = {
	hash: "svelte-1b7bd5u",
	code: ".aside.svelte-1b7bd5u {width:300px;flex:none;background:var(--tm-panel-surface);display:flex;flex-direction:column;min-height:0;}.top.svelte-1b7bd5u {padding:20px 20px 14px;}.art.svelte-1b7bd5u {width:100%;aspect-ratio:1.45;border-radius:14px;position:relative;overflow:hidden;display:flex;box-shadow:0 14px 36px rgba(0, 0, 0, .35);}.blank.svelte-1b7bd5u {flex:1;background:var(--tm-fg-6);}.kind.svelte-1b7bd5u {position:absolute;left:12px;top:12px;font-size:9.5px;font-weight:700;letter-spacing:.8px;padding:3px 8px;border-radius:20px;background:rgba(0, 0, 0, .45);color:#fff;}.trow.svelte-1b7bd5u {display:flex;align-items:flex-start;gap:6px;}.ttext.svelte-1b7bd5u {flex:1;min-width:0;}.trow.svelte-1b7bd5u .fav {margin-top:10px;}.title.svelte-1b7bd5u {font-size:15px;font-weight:650;margin-top:14px;line-height:1.3;text-wrap:pretty;display:-webkit-box;-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}.sub.svelte-1b7bd5u {font-size:12px;color:var(--tm-muted);margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.tabs.svelte-1b7bd5u {display:flex;gap:0;padding:0 10px;border-bottom:1px solid var(--tm-fg-7);overflow-x:auto;scrollbar-width:none;}.tabs.svelte-1b7bd5u button:where(.svelte-1b7bd5u) {flex:none;display:flex;align-items:center;gap:4px;height:34px;padding:0 5px;border:0;background:none;color:var(--tm-muted);font-size:11px;font-weight:600;white-space:nowrap;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;}.badge.svelte-1b7bd5u {font-size:9.5px;min-width:15px;height:15px;padding:0 4px;border-radius:8px;display:grid;place-items:center;background:var(--tm-fg-10);color:var(--tm-fg);}.tabs.svelte-1b7bd5u button.on:where(.svelte-1b7bd5u) {color:var(--tm-fg);border-bottom-color:var(--tm-accent);}.body.svelte-1b7bd5u {flex:1;min-height:0;overflow:auto;padding:8px 12px 12px;}.q.svelte-1b7bd5u {display:flex;align-items:center;gap:10px;padding:7px 8px;border-radius:9px;}.q.svelte-1b7bd5u:hover {background:var(--tm-fg-5);}.qtext.svelte-1b7bd5u {flex:1;min-width:0;display:flex;flex-direction:column;border:0;padding:0;background:none;color:inherit;text-align:left;cursor:pointer;font:inherit;}.track.svelte-1b7bd5u .qtext:where(.svelte-1b7bd5u) {cursor:default;}.qtitle.svelte-1b7bd5u {font-size:12px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.qmeta.svelte-1b7bd5u {font-size:11px;color:var(--tm-muted);margin-top:2px;}.qbar.svelte-1b7bd5u {display:flex;gap:4px;padding:2px 0 8px;}.qbar.svelte-1b7bd5u button:where(.svelte-1b7bd5u) {display:flex;align-items:center;gap:5px;height:26px;padding:0 8px;border:0;border-radius:7px;background:var(--tm-fg-6);color:var(--tm-fg);font-size:11px;cursor:pointer;}.qbar.svelte-1b7bd5u button:where(.svelte-1b7bd5u):hover:not(:disabled) {background:var(--tm-fg-10);}.qbar.svelte-1b7bd5u button:where(.svelte-1b7bd5u):disabled {opacity:.4;cursor:default;}.plform.svelte-1b7bd5u {display:flex;gap:6px;padding:0 0 8px;}.plform.svelte-1b7bd5u input:where(.svelte-1b7bd5u) {flex:1;min-width:0;height:28px;padding:0 8px;border-radius:7px;border:1px solid var(--tm-fg-14);background:var(--tm-fg-4);color:var(--tm-fg);font:inherit;font-size:12px;outline:none;}.plform.svelte-1b7bd5u input:where(.svelte-1b7bd5u):focus {border-color:var(--tm-accent);}.plform.svelte-1b7bd5u button:where(.svelte-1b7bd5u) {height:28px;padding:0 12px;border:0;border-radius:7px;background:var(--tm-accent);color:var(--tm-on-accent);font-size:11.5px;font-weight:650;cursor:pointer;}.drag.svelte-1b7bd5u {cursor:grab;}.drag.dragging.svelte-1b7bd5u {opacity:.4;}.drag.over.svelte-1b7bd5u {box-shadow:inset 0 2px 0 var(--tm-accent);}.grip.svelte-1b7bd5u {color:var(--tm-muted);opacity:.5;display:grid;flex:none;margin-right:-4px;}.moves.svelte-1b7bd5u {display:flex;flex-direction:column;opacity:0;flex:none;}.q.svelte-1b7bd5u:hover .moves:where(.svelte-1b7bd5u), .moves.svelte-1b7bd5u:focus-within {opacity:1;}.mv.svelte-1b7bd5u {width:20px;height:14px;border:0;padding:0;background:none;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;}.mv.svelte-1b7bd5u:hover:not(:disabled) {color:var(--tm-fg);}.mv.svelte-1b7bd5u:disabled {opacity:.3;cursor:default;}.rm.svelte-1b7bd5u {width:24px;height:24px;border:0;background:none;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;flex:none;border-radius:6px;}.rm.svelte-1b7bd5u:hover {color:var(--tm-fg);background:var(--tm-fg-8);}.qfrom.svelte-1b7bd5u {display:flex;align-items:baseline;gap:6px;padding:10px 6px 4px;font-size:10.5px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--tm-muted);}.qfrom.svelte-1b7bd5u span:where(.svelte-1b7bd5u) {overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0;}.qfrom.svelte-1b7bd5u small:where(.svelte-1b7bd5u) {flex:none;font-weight:500;text-transform:none;letter-spacing:0;}.empty.svelte-1b7bd5u {padding:24px 8px;font-size:12px;color:var(--tm-muted);text-align:center;}.art.book.svelte-1b7bd5u {aspect-ratio:0.8;width:62%;margin:0 auto;border-radius:6px 12px 12px 6px;}.prog.svelte-1b7bd5u {display:flex;align-items:center;gap:10px;margin-top:10px;}.bar.svelte-1b7bd5u {flex:1;height:4px;border-radius:2px;background:var(--tm-fg-10);display:block;}.bar.svelte-1b7bd5u span:where(.svelte-1b7bd5u) {display:block;height:4px;border-radius:2px;background:var(--tm-accent);}.pct.svelte-1b7bd5u {font-size:11px;color:var(--tm-muted);flex:none;}h3.svelte-1b7bd5u {font-size:11px;font-weight:650;letter-spacing:.6px;text-transform:uppercase;color:var(--tm-muted);margin:16px 8px 6px;}.onair.svelte-1b7bd5u {display:flex;align-items:center;gap:10px;padding:10px 8px;border-radius:10px;background:var(--tm-accent-8);}.dot.svelte-1b7bd5u {width:8px;height:8px;border-radius:50%;background:var(--tm-live);flex:none;box-shadow:0 0 0 3px color-mix(in srgb, var(--tm-live) 25%, transparent);}.ontext.svelte-1b7bd5u {min-width:0;display:flex;flex-direction:column;}.facts.svelte-1b7bd5u {display:grid;grid-template-columns:auto 1fr;gap:6px 12px;margin:8px 8px 0;font-size:12px;}.facts.svelte-1b7bd5u dt:where(.svelte-1b7bd5u) {color:var(--tm-muted);}.facts.svelte-1b7bd5u dd:where(.svelte-1b7bd5u) {margin:0;min-width:0;overflow:hidden;text-overflow:ellipsis;}.link.svelte-1b7bd5u {border:0;padding:0;background:none;color:var(--tm-accent);font:inherit;cursor:pointer;text-align:left;}.desc.svelte-1b7bd5u {font-size:12px;line-height:1.55;color:var(--tm-muted);margin:12px 8px 0;white-space:pre-line;}.add.svelte-1b7bd5u {display:flex;align-items:center;justify-content:center;gap:6px;width:100%;height:32px;margin:4px 0 8px;border:1px dashed var(--tm-fg-16);border-radius:9px;background:none;color:var(--tm-fg);font:inherit;font-size:12px;cursor:pointer;}.add.svelte-1b7bd5u:hover {background:var(--tm-fg-5);}button.q.svelte-1b7bd5u {width:100%;border:0;background:none;color:inherit;cursor:pointer;text-align:left;font:inherit;}.q.svelte-1b7bd5u .qtext:where(.svelte-1b7bd5u) {display:flex;flex-direction:column;}.ctitle.svelte-1b7bd5u {flex:1;min-width:0;}.cstate.svelte-1b7bd5u {font-size:11px;color:var(--tm-muted);flex:none;}.chap.done.svelte-1b7bd5u .ctitle:where(.svelte-1b7bd5u) {color:var(--tm-muted);}.chap.svelte-1b7bd5u {display:flex;gap:10px;width:100%;padding:8px;border:0;border-radius:8px;background:transparent;color:var(--tm-fg);cursor:pointer;text-align:left;font:inherit;font-size:12.5px;}.chap.svelte-1b7bd5u:hover {background:var(--tm-fg-5);}.chap.cur.svelte-1b7bd5u {background:var(--tm-accent-8);color:var(--tm-accent);}.t.svelte-1b7bd5u {font:500 11px ui-monospace, Menlo, monospace;color:var(--tm-muted);width:52px;flex:none;padding-top:1px;}.line.svelte-1b7bd5u {display:block;width:100%;padding:7px 8px;border:0;border-radius:8px;background:transparent;cursor:pointer;text-align:left;font:inherit;font-size:13px;line-height:1.5;color:var(--tm-fg-45);}.line.svelte-1b7bd5u:hover {background:var(--tm-fg-4);}.line.cur.svelte-1b7bd5u {color:var(--tm-fg);background:var(--tm-accent-8);}.who.svelte-1b7bd5u {display:block;font:500 10px ui-monospace, Menlo, monospace;color:var(--tm-muted);margin-bottom:2px;}"
};
function ml(e, t) {
	Ue(t, !0), $r(e, pl);
	let n = ji(t, "store", 7), r = /* @__PURE__ */ j(() => n().item), i = /* @__PURE__ */ j(() => n().activeRtab), a = /* @__PURE__ */ j(() => U(r)?.type === "radio" ? n().nowPlaying[U(r).stationId] : void 0), o = /* @__PURE__ */ j(() => U(r)?.type === "book" ? U(r) : null), s = /* @__PURE__ */ j(() => U(o) ? n().bookmarks[U(o).id] ?? [] : []), c = /* @__PURE__ */ j(() => U(r) ? n().durOf(U(r).id) : 0), l = /* @__PURE__ */ j(() => n().continueIds.filter((e) => e !== n().now)), u = {
		onair: "On air",
		queue: "Up next",
		chaps: "Chapters",
		trans: "Transcript",
		marks: "Bookmarks",
		about: "About"
	}, d = (e) => e === "queue" ? n().queue.length : e === "marks" ? U(s).length : 0, f = /* @__PURE__ */ j(() => U(a)?.art || U(r)?.art), p = /* @__PURE__ */ j(() => U(a)?.title || U(r)?.title || "Nothing playing"), m = /* @__PURE__ */ j(() => U(r) ? U(r).type === "radio" ? U(a)?.title ? [U(a).artist, U(r).title].filter(Boolean).join(" · ") : U(r).sub : U(r).type === "book" && U(r).chapters.length > 1 && n().chapIdx >= 0 ? `${U(r).sub} · Chapter ${Li(n().chapIdx)}` : U(r).sub : "Pick a station, episode or book."), h = /* @__PURE__ */ j(() => n().transcript?.lines ?? []), g = /* @__PURE__ */ N(void 0), _ = /* @__PURE__ */ N(null), v = /* @__PURE__ */ N(!1), y = /* @__PURE__ */ N(""), b = /* @__PURE__ */ N(-1);
	function x(e) {
		U(_) && n().moveQueue(U(_), e), P(_, null), P(b, -1);
	}
	let S = (e) => {
		if (!U(r) || !Pi(U(r))) return 0;
		let t = U(r).chapters[e];
		return t.dur || (U(r).chapters[e + 1]?.start ?? U(c)) - t.start;
	};
	gn(() => {
		U(i) === "trans" && n().transcriptKey && n().loadTranscript();
	}), gn(() => {
		let e = n().lineIdx;
		U(i) !== "trans" || e < 0 || U(g)?.querySelectorAll(".line")[e]?.scrollIntoView({
			block: "nearest",
			behavior: "smooth"
		});
	});
	let C = /* @__PURE__ */ j(() => {
		let e = n().transcript;
		return U(r) ? !e || e.state === "loading" ? "Loading transcript…" : e.state === "queued" || e.state === "running" ? "OndaCast is preparing a transcript. Check back in a few minutes." : e.state === "error" ? "The transcript could not be loaded." : "No transcript for this item yet." : "Nothing is playing.";
	});
	var w = fl(), T = I(w), E = I(T);
	let ee;
	var te = I(E), ne = (e) => {
		Ga(e, {
			get hue() {
				return U(r).hue;
			},
			get art() {
				return U(f);
			},
			fill: !0,
			radius: 0,
			get mark() {
				return U(r).mark;
			},
			font: 26
		});
	}, re = (e) => {
		K(e, Ac());
	};
	J(te, (e) => {
		U(r) ? e(ne) : e(re, -1);
	});
	var ie = z(te, 2), ae = (e) => {
		var t = jc(), r = R(t, !0);
		B(() => q(r, n().kindLabel)), K(e, t);
	};
	J(ie, (e) => {
		U(r) && e(ae);
	}), k(E);
	var oe = z(E, 2), se = I(oe), ce = I(se), le = R(ce, !0), ue = R(z(ce), !0);
	k(se);
	var de = z(se, 2), fe = (e) => {
		jo(e, {
			get store() {
				return n();
			},
			get id() {
				return U(r).id;
			},
			size: 18
		});
	};
	J(de, (e) => {
		U(r) && e(fe);
	}), k(oe);
	var pe = z(oe, 2), me = (e) => {
		var t = Mc(), r = I(t), i = I(r);
		let a;
		k(r);
		var o = R(z(r, 2));
		k(t), B((e, t, n) => {
			a = si(i, "", a, { width: e }), q(o, `${t ?? ""}% · ${n ?? ""} left`);
		}, [
			() => `${Math.min(100, Math.round(n().pos / U(c) * 100))}%`,
			() => Math.min(100, Math.round(n().pos / U(c) * 100)),
			() => ta((U(c) - n().pos) / n().speed)
		]), K(e, t);
	}, he = /* @__PURE__ */ j(() => U(r) && Pi(U(r)) && U(c));
	J(pe, (e) => {
		U(he) && e(me);
	}), k(T);
	var ge = z(T, 2), _e = (e) => {
		var t = Fc();
		Y(t, 20, () => n().rightTabs, (e) => e, (e, t) => {
			var r = Pc();
			let a;
			var o = I(r, !0), s = z(o), c = (e) => {
				var n = Nc(), r = R(n, !0);
				B((e) => q(r, e), [() => d(t)]), K(e, n);
			}, l = /* @__PURE__ */ j(() => d(t));
			J(s, (e) => {
				U(l) && e(c);
			}), k(r), B(() => {
				Z(r, "aria-selected", U(i) === t), a = X(r, 1, "svelte-1b7bd5u", null, a, { on: U(i) === t }), q(o, u[t]);
			}), W("click", r, () => n().rtab = t), K(e, r);
		}), k(t), K(e, t);
	};
	J(ge, (e) => {
		U(r) && e(_e);
	});
	var ve = z(ge, 2), ye = I(ve), be = (e) => {
		var t = Rc(), r = z(L(t), 2), i = (e) => {
			var t = Lc();
			Y(z(L(t), 2), 16, () => U(l), (e) => e, (e, t) => {
				let r = /* @__PURE__ */ j(() => n().items[t]);
				var i = jr(), a = L(i), o = (e) => {
					var i = Ic(), a = I(i);
					Ga(a, {
						get hue() {
							return U(r).hue;
						},
						get art() {
							return U(r).art;
						},
						get mark() {
							return U(r).mark;
						},
						size: 34,
						radius: 7,
						font: 9
					});
					var o = z(a, 2), s = I(o), c = R(s, !0), l = R(z(s));
					k(o), k(i), B((e) => {
						q(c, U(r).title), q(l, `${Ni[U(r).type] ?? ""} · ${e ?? ""}`);
					}, [() => n().leftOf(t)]), W("click", i, () => n().play(t)), K(e, i);
				};
				J(a, (e) => {
					U(r) && e(o);
				}), K(e, i);
			}), K(e, t);
		};
		J(r, (e) => {
			U(l).length && e(i);
		}), K(e, t);
	}, D = (e) => {
		var t = Wc(), n = L(t), i = z(I(n), 2), o = (e) => {
			var t = zc(), n = I(t), i = R(n, !0), o = R(z(n), !0);
			k(t), B(() => {
				q(i, U(a).title), q(o, U(a).artist || U(r).title);
			}), K(e, t);
		}, s = (e) => {
			var t = Bc(), n = R(I(t), !0);
			A(), k(t), B(() => q(n, U(r).title)), K(e, t);
		};
		J(i, (e) => {
			U(a)?.title ? e(o) : e(s, -1);
		}), k(n);
		var c = z(n, 4), l = z(I(c)), u = R(l, !0), d = z(l, 2), f = (e) => {
			var t = Vc(), n = R(z(L(t)), !0);
			B((e) => q(n, e), [() => U(r).sub.split(" · ")[0]]), K(e, t);
		};
		J(d, (e) => {
			U(r).sub && e(f);
		}), k(c);
		var p = z(c, 2), m = (e) => {
			var t = Uc();
			Y(z(L(t), 2), 17, () => U(a).recent, Wr, (e, t) => {
				var n = Hc(), i = I(n);
				{
					let e = /* @__PURE__ */ j(() => U(t).title.slice(0, 2).toUpperCase());
					Ga(i, {
						get hue() {
							return U(r).hue;
						},
						get art() {
							return U(t).art;
						},
						get mark() {
							return U(e);
						},
						size: 34,
						radius: 7,
						font: 9
					});
				}
				var a = z(i, 2), o = I(a), s = R(o, !0), c = R(z(o), !0);
				k(a), k(n), B((e) => {
					q(s, U(t).title), q(c, e);
				}, [() => [U(t).artist, ra(U(t).at)].filter(Boolean).join(" · ")]), K(e, n);
			}), K(e, t);
		};
		J(p, (e) => {
			U(a)?.recent.length && e(m);
		}), B(() => q(u, U(r).genre)), K(e, t);
	}, xe = (e) => {
		var t = Xc(), i = L(t), a = (e) => {
			var t = Kc(), r = L(t), i = I(r);
			$(I(i), {
				get d() {
					return Q.shuffle;
				},
				size: 12,
				stroke: 1.8
			}), A(), k(i);
			var a = z(i, 2);
			$(I(a), {
				get d() {
					return Q.list;
				},
				size: 12,
				stroke: 1.8
			}), A(), k(a);
			var o = z(a, 2);
			$(I(o), {
				get d() {
					return Q.trash;
				},
				size: 12,
				stroke: 1.8
			}), A(), k(o), k(r);
			var s = z(r, 2), c = (e) => {
				var t = Gc(), r = I(t);
				yi(r), ei(r, (e) => eo?.(e)), yn(() => Ti(r, () => U(y), (e) => P(y, e))), A(2), k(t), yr("submit", t, (e) => {
					e.preventDefault(), n().saveQueueAsPlaylist(U(y)) && P(v, !1);
				}), W("keydown", r, (e) => {
					e.key === "Escape" && (e.stopPropagation(), P(v, !1));
				}), K(e, t);
			};
			J(s, (e) => {
				U(v) && e(c);
			}), B(() => {
				i.disabled = n().queue.length < 2, Z(a, "aria-expanded", U(v)), o.disabled = !n().queue.length;
			}), W("click", i, () => n().shuffleQueue()), W("click", a, () => {
				P(v, !U(v)), P(y, "");
			}), W("click", o, () => n().clearQueue()), K(e, t);
		};
		J(i, (e) => {
			(n().queue.length || U(r) && U(r).type !== "radio") && e(a);
		}), Y(z(i, 2), 18, () => n().queue, (e) => e, (e, t, r) => {
			let i = /* @__PURE__ */ j(() => n().items[t]);
			var a = Xc(), o = L(a), s = (e) => {
				var t = Jc(), i = I(t), a = R(i), o = z(i), s = (e) => {
					K(e, qc());
				};
				J(o, (e) => {
					U(r) > 0 && e(s);
				}), k(t), B(() => q(a, `Up next from ${(n().upFrom || "your list") ?? ""}`)), K(e, t);
			}, c = /* @__PURE__ */ j(() => U(i) && n().isAuto(t) && (U(r) === 0 || !n().isAuto(n().queue[U(r) - 1])));
			J(o, (e) => {
				U(c) && e(s);
			});
			var l = z(o, 2), u = (e) => {
				var a = Yc();
				let o;
				var s = I(a);
				$(I(s), {
					get d() {
						return Q.grip;
					},
					size: 14,
					stroke: 2.4
				}), k(s);
				var c = z(s, 2);
				Ga(c, {
					get hue() {
						return U(i).hue;
					},
					get art() {
						return U(i).art;
					},
					get mark() {
						return U(i).mark;
					},
					size: 34,
					radius: 7,
					font: 9
				});
				var l = z(c, 2), u = I(l), d = R(u, !0), f = R(z(u));
				k(l);
				var p = z(l, 2), m = I(p);
				$(I(m), {
					get d() {
						return Q.up;
					},
					size: 11,
					stroke: 2.2
				}), k(m);
				var h = z(m, 2);
				$(I(h), {
					get d() {
						return Q.down;
					},
					size: 11,
					stroke: 2.2
				}), k(h), k(p);
				var g = z(p, 2);
				$(I(g), {
					get d() {
						return Q.close;
					},
					size: 12,
					stroke: 2
				}), k(g), k(a), B((e) => {
					o = X(a, 1, "q drag svelte-1b7bd5u", null, o, {
						dragging: U(_) === t,
						over: U(b) === U(r) && U(_) !== t
					}), q(d, U(i).title), q(f, `${Ni[U(i).type] ?? ""}${e ?? ""}`), Z(m, "aria-label", `Move ${U(i).title ?? ""} up`), m.disabled = U(r) === 0, Z(h, "aria-label", `Move ${U(i).title ?? ""} down`), h.disabled = U(r) === n().queue.length - 1, Z(g, "aria-label", `Remove ${U(i).title ?? ""} from queue`);
				}, [() => n().lenOf(t) ? ` · ${n().lenOf(t)}` : ""]), yr("dragstart", a, (e) => {
					P(_, t, !0), e.dataTransfer?.setData("text/plain", t);
				}), yr("dragover", a, (e) => {
					e.preventDefault(), P(b, U(r), !0);
				}), yr("dragleave", a, () => {
					U(b) === U(r) && P(b, -1);
				}), yr("drop", a, (e) => {
					e.preventDefault(), x(U(r));
				}), yr("dragend", a, () => {
					P(_, null), P(b, -1);
				}), W("click", l, () => n().play(t)), W("click", m, () => n().moveQueue(t, U(r) - 1)), W("click", h, () => n().moveQueue(t, U(r) + 1)), W("click", g, () => n().removeFromQueue(t)), K(e, a);
			};
			J(l, (e) => {
				U(i) && e(u);
			}), K(e, a);
		}, (e) => {
			K(e, Zc());
		}), K(e, t);
	}, O = (e) => {
		var t = jr(), i = L(t), a = (e) => {
			var t = jr();
			Y(L(t), 17, () => U(r).chapters, Wr, (e, t, i) => {
				let a = /* @__PURE__ */ j(() => S(i)), o = /* @__PURE__ */ j(() => i === n().chapIdx);
				var s = Qc();
				let c;
				var l = I(s), u = R(l, !0), d = z(l, 2), f = R(d, !0), p = R(z(d, 2), !0);
				k(s), B((e, r) => {
					c = X(s, 1, "chap svelte-1b7bd5u", null, c, {
						cur: U(o),
						done: i < n().chapIdx
					}), q(u, e), q(f, U(t).title), q(p, r);
				}, [() => U(r).type === "book" ? Li(i) : ea(U(t).start), () => i < n().chapIdx ? "Done" : U(o) && U(a) ? `${Math.min(100, Math.round((n().pos - U(t).start) / U(a) * 100))}%` : U(a) ? ta(U(a)) : ""]), W("click", s, () => n().seekTo(U(t).start)), K(e, s);
			}), K(e, t);
		}, o = /* @__PURE__ */ j(() => Pi(U(r)) && U(r).chapters.length), s = (e) => {
			var t = $c(), n = R(t, !0);
			B(() => q(n, U(r).type === "book" ? "Loading chapters…" : "This episode has no chapters.")), K(e, t);
		};
		J(i, (e) => {
			U(o) ? e(a) : e(s, -1);
		}), K(e, t);
	}, Se = (e) => {
		var t = nl(), r = L(t);
		$(I(r), {
			get d() {
				return Q.plus;
			},
			size: 12,
			stroke: 2
		}), A(), k(r), Y(z(r, 2), 17, () => U(s), (e) => e.at, (e, t) => {
			var r = el(), i = I(r), a = I(i), s = R(a, !0), c = R(z(a), !0);
			k(i);
			var l = z(i, 2);
			$(I(l), {
				get d() {
					return Q.close;
				},
				size: 12,
				stroke: 2
			}), k(l), k(r), B((e) => {
				q(s, U(t).label), q(c, e), Z(l, "aria-label", `Remove bookmark ${U(t).label ?? ""}`);
			}, [() => new Date(U(t).at).toLocaleString()]), W("click", i, () => n().jumpTo(U(o).id, U(t).pos)), W("click", l, () => n().removeBookmark(U(o).id, U(t).at)), K(e, r);
		}, (e) => {
			K(e, tl());
		}), W("click", r, () => n().bookmark(U(o).id)), K(e, t);
	}, Ce = (e) => {
		var t = ll(), i = L(t), a = (e) => {
			var t = al(), n = z(I(t)), i = R(n, !0), a = z(n, 2), o = (e) => {
				var t = rl(), n = R(z(L(t)), !0);
				B((e) => q(n, e), [() => ta(U(r).dur)]), K(e, t);
			};
			J(a, (e) => {
				U(r).dur && e(o);
			});
			var s = z(a, 2), c = (e) => {
				var t = il(), n = R(z(L(t)), !0);
				B(() => q(n, U(r).chapters.length)), K(e, t);
			};
			J(s, (e) => {
				U(r).chapters.length && e(c);
			}), A(3), k(t), B(() => q(i, U(r).sub)), K(e, t);
		}, o = (e) => {
			var t = sl(), i = z(I(t)), a = I(i), o = R(a, !0);
			k(i);
			var s = z(i, 2), l = (e) => {
				var t = ol(), n = R(z(L(t)), !0);
				B((e) => q(n, e), [() => new Date(U(r).date).toLocaleDateString()]), K(e, t);
			};
			J(s, (e) => {
				U(r).date && e(l);
			});
			var u = z(s, 2), d = (e) => {
				var t = rl(), n = R(z(L(t)), !0);
				B((e) => q(n, e), [() => ta(U(c))]), K(e, t);
			};
			J(u, (e) => {
				U(c) && e(d);
			}), k(t), B(() => q(o, U(r).sub)), W("click", a, () => n().openShow(U(r).show)), K(e, t);
		};
		J(i, (e) => {
			U(r).type === "book" ? e(a) : U(r).type === "podcast" && e(o, 1);
		});
		var s = z(i, 2), u = (e) => {
			var t = cl(), n = R(t, !0);
			B(() => q(n, U(r).desc)), K(e, t);
		}, d = /* @__PURE__ */ j(() => Pi(U(r)) && U(r).desc);
		J(s, (e) => {
			U(d) && e(u);
		});
		var f = z(s, 2), p = (e) => {
			var t = Lc();
			Y(z(L(t), 2), 16, () => U(l), (e) => e, (e, t) => {
				let r = /* @__PURE__ */ j(() => n().items[t]);
				var i = jr(), a = L(i), o = (e) => {
					var i = Ic(), a = I(i);
					Ga(a, {
						get hue() {
							return U(r).hue;
						},
						get art() {
							return U(r).art;
						},
						get mark() {
							return U(r).mark;
						},
						size: 34,
						radius: 7,
						font: 9
					});
					var o = z(a, 2), s = I(o), c = R(s, !0), l = R(z(s));
					k(o), k(i), B((e) => {
						q(c, U(r).title), q(l, `${Ni[U(r).type] ?? ""} · ${e ?? ""}`);
					}, [() => n().leftOf(t)]), W("click", i, () => n().play(t)), K(e, i);
				};
				J(a, (e) => {
					U(r) && e(o);
				}), K(e, i);
			}), K(e, t);
		};
		J(f, (e) => {
			U(l).length && e(p);
		}), K(e, t);
	}, we = (e) => {
		var t = dl();
		Y(t, 21, () => U(h), Wr, (e, t, r) => {
			var i = ul();
			let a;
			var o = I(i), s = R(o), c = z(o, 1, !0);
			k(i), B((e) => {
				a = X(i, 1, "line svelte-1b7bd5u", null, a, { cur: r === n().lineIdx }), q(s, `${U(t).who ? `${U(t).who} · ` : ""}${e ?? ""}`), q(c, U(t).text);
			}, [() => ea(U(t).t)]), W("click", i, () => n().seekTo(U(t).t)), K(e, i);
		}, (e) => {
			var t = $c(), n = R(t, !0);
			B(() => q(n, U(C))), K(e, t);
		}), k(t), Ai(t, (e) => P(g, e), () => U(g)), K(e, t);
	};
	J(ye, (e) => {
		U(r) ? U(i) === "onair" && U(r).type === "radio" ? e(D, 1) : U(i) === "queue" ? e(xe, 2) : U(i) === "chaps" ? e(O, 3) : U(i) === "marks" && U(o) ? e(Se, 4) : U(i) === "about" ? e(Ce, 5) : U(i) === "trans" && e(we, 6) : e(be);
	}), k(ve), k(w), B(() => {
		ee = X(E, 1, "art svelte-1b7bd5u", null, ee, { book: U(r)?.type === "book" }), q(le, U(p)), q(ue, U(m));
	}), K(e, w), We();
}
br(["click", "keydown"]);
//#endregion
//#region src/components/SeekBar.svelte
var hl = /* @__PURE__ */ G("<div class=\"tick svelte-qmop01\"></div>"), gl = /* @__PURE__ */ G("<div role=\"slider\" aria-label=\"Playback position\"><div class=\"track svelte-qmop01\"><div class=\"fill svelte-qmop01\"></div> <!></div></div>"), _l = {
	hash: "svelte-qmop01",
	code: ".seek.svelte-qmop01 {flex:1;display:flex;align-items:center;cursor:pointer;border-radius:4px;}.seek.live.svelte-qmop01 {cursor:default;}.seek.svelte-qmop01:focus-visible {outline:2px solid var(--tm-accent);outline-offset:2px;}.track.svelte-qmop01 {flex:1;height:4px;border-radius:2px;background:var(--tm-fg-12);position:relative;}.fill.svelte-qmop01 {position:absolute;left:0;top:0;bottom:0;border-radius:2px;background:var(--tm-accent);}.live.svelte-qmop01 .fill:where(.svelte-qmop01) {opacity:.55;}.tick.svelte-qmop01 {position:absolute;top:-1px;width:2px;height:6px;background:var(--tm-panel-surface);}"
};
function vl(e, t) {
	Ue(t, !0), $r(e, _l);
	let n = ji(t, "height", 3, 14), r = ji(t, "ticks", 3, !1), i = /* @__PURE__ */ j(() => t.store.item), a = /* @__PURE__ */ j(() => U(i) ? t.store.durOf(U(i).id) : 0), o = /* @__PURE__ */ j(() => !!U(i) && Pi(U(i)) && U(a) > 0), s = /* @__PURE__ */ j(() => U(i) ? Pi(U(i)) ? U(a) ? Math.min(100, t.store.pos / U(a) * 100) : 0 : 100 : 0), c = /* @__PURE__ */ j(() => r() && U(i) && Pi(U(i)) && U(a) ? U(i).chapters.slice(1).map((e) => e.start / U(a) * 100) : []);
	function l(e) {
		if (!U(o)) return;
		let n = e.currentTarget.getBoundingClientRect();
		t.store.seekFraction((e.clientX - n.left) / n.width);
	}
	function u(e) {
		if (!U(o)) return;
		let n = {
			ArrowLeft: -15,
			ArrowRight: 30,
			PageDown: -60,
			PageUp: 60
		}[e.key];
		n ? (e.preventDefault(), t.store.skip(n)) : e.key === "Home" ? (e.preventDefault(), t.store.seekFraction(0)) : e.key === "End" && (e.preventDefault(), t.store.seekFraction(1));
	}
	var d = gl();
	let f;
	Z(d, "aria-valuemin", 0), Z(d, "aria-valuemax", 100);
	let p;
	var m = I(d), h = I(m);
	let g;
	Y(z(h, 2), 17, () => U(c), Wr, (e, t) => {
		var n = hl();
		let r;
		B(() => r = si(n, "", r, { left: `${U(t) ?? ""}%` })), K(e, n);
	}), k(m), k(d), B((e, t) => {
		f = X(d, 1, "seek svelte-qmop01", null, f, { live: !U(o) }), Z(d, "tabindex", U(o) ? 0 : -1), Z(d, "aria-disabled", !U(o)), Z(d, "aria-valuenow", e), Z(d, "aria-valuetext", t), p = si(d, "", p, { height: `${n() ?? ""}px` }), g = si(h, "", g, { width: `${U(s) ?? ""}%` });
	}, [() => Math.round(U(s)), () => U(o) ? `${ea(t.store.pos)} of ${ea(U(a))}` : "Live"]), W("click", d, l), W("keydown", d, u), K(e, d), We();
}
br(["click", "keydown"]);
//#endregion
//#region src/components/SleepPopover.svelte
var yl = /* @__PURE__ */ G("<button> </button>"), bl = /* @__PURE__ */ G("<div class=\"tm-pop\" role=\"dialog\" aria-label=\"Sleep timer\"><div class=\"title svelte-1mpzphw\">Sleep timer</div> <div class=\"hint svelte-1mpzphw\">Audio fades out over the last minute.</div> <div class=\"grid svelte-1mpzphw\"></div> <button> </button> <button class=\"off svelte-1mpzphw\">Turn off</button></div>"), xl = {
	hash: "svelte-1mpzphw",
	code: ".title.svelte-1mpzphw {font-size:13px;font-weight:650;}.hint.svelte-1mpzphw {font-size:11px;color:var(--tm-muted);margin-top:2px;}.grid.svelte-1mpzphw {display:grid;grid-template-columns:repeat(3, 1fr);gap:6px;margin-top:12px;}.opt.svelte-1mpzphw {height:34px;border-radius:9px;border:0;background:var(--tm-fg-6);color:var(--tm-fg);font-size:12px;font-weight:600;cursor:pointer;}.opt.svelte-1mpzphw:hover {background:var(--tm-fg-10);}.opt.sel.svelte-1mpzphw {background:var(--tm-accent);color:var(--tm-on-accent);}.wide.svelte-1mpzphw {width:100%;margin-top:6px;}.off.svelte-1mpzphw {width:100%;height:30px;margin-top:6px;border:0;background:none;color:var(--tm-muted);font-size:12px;cursor:pointer;}.off.svelte-1mpzphw:hover {color:var(--tm-fg);}"
};
function Sl(e, t) {
	Ue(t, !0), $r(e, xl);
	let n = (e) => typeof t.store.sleep == "number" && Math.ceil(t.store.sleep / 60) === e;
	var r = bl(), i = z(I(r), 4);
	Y(i, 21, () => Na, Wr, (e, r) => {
		var i = yl();
		let a;
		var o = R(i);
		B((e) => {
			a = X(i, 1, "opt svelte-1mpzphw", null, a, { sel: e }), q(o, `${U(r) ?? ""} min`);
		}, [() => n(U(r))]), W("click", i, () => t.store.setSleepMinutes(U(r))), K(e, i);
	}), k(i);
	var a = z(i, 2);
	let o;
	var s = R(a, !0), c = z(a, 2);
	k(r), B(() => {
		si(r, t.pos), o = X(a, 1, "opt wide svelte-1mpzphw", null, o, { sel: t.store.sleep === "chapter" }), q(s, t.store.live ? "End of current show" : t.store.chapters.length > 1 ? "End of chapter" : "End of episode");
	}), W("click", a, () => t.store.sleepAtEnd()), W("click", c, () => t.store.sleepOff()), K(e, r), We();
}
br(["click"]);
//#endregion
//#region src/components/SpeedPopover.svelte
var Cl = /* @__PURE__ */ G("<button> </button>"), wl = /* @__PURE__ */ G("<div class=\"tm-pop\" role=\"dialog\" aria-label=\"Playback speed\"><div class=\"head svelte-1xvntbg\"><span class=\"title svelte-1xvntbg\">Playback speed</span><span class=\"now svelte-1xvntbg\"> </span></div> <div class=\"hint svelte-1xvntbg\"> </div> <div class=\"grid svelte-1xvntbg\"></div></div>"), Tl = {
	hash: "svelte-1xvntbg",
	code: ".head.svelte-1xvntbg {display:flex;align-items:baseline;justify-content:space-between;}.title.svelte-1xvntbg {font-size:13px;font-weight:650;}.now.svelte-1xvntbg {font:600 12px ui-monospace, Menlo, monospace;color:var(--tm-accent);}.hint.svelte-1xvntbg {font-size:11px;color:var(--tm-muted);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.grid.svelte-1xvntbg {display:grid;grid-template-columns:repeat(4, 1fr);gap:6px;margin-top:12px;}.opt.svelte-1xvntbg {height:32px;border-radius:9px;border:0;background:var(--tm-fg-6);color:var(--tm-fg);font:600 11.5px ui-monospace, Menlo, monospace;cursor:pointer;}.opt.svelte-1xvntbg:hover {background:var(--tm-fg-10);}.opt.sel.svelte-1xvntbg {background:var(--tm-accent);color:var(--tm-on-accent);}"
};
function El(e, t) {
	Ue(t, !0), $r(e, Tl);
	var n = wl(), r = I(n), i = R(z(I(r)));
	k(r);
	var a = z(r, 2), o = R(a), s = z(a, 2);
	Y(s, 21, () => Ma, Wr, (e, n) => {
		var r = Cl();
		let i;
		var a = R(r);
		B((e) => {
			i = X(r, 1, "opt svelte-1xvntbg", null, i, { sel: t.store.speed === U(n) }), q(a, `${e ?? ""}×`);
		}, [() => U(n).toFixed(1)]), W("click", r, () => t.store.setSpeed(U(n))), K(e, r);
	}), k(s), k(n), B((e) => {
		si(n, t.pos), q(i, `${e ?? ""}×`), q(o, `Remembered for ${t.store.speedScope ?? ""}.`);
	}, [() => t.store.speed.toFixed(1)]), K(e, n), We();
}
br(["click"]);
//#endregion
//#region src/components/PlayerBar.svelte
var Dl = /* @__PURE__ */ G("<div class=\"thumb svelte-y66ne\"></div>"), Ol = /* @__PURE__ */ G("<span class=\"live svelte-y66ne\">LIVE</span>"), kl = /* @__PURE__ */ G("<span class=\"time r svelte-y66ne\"> </span>"), Al = /* @__PURE__ */ G("<span class=\"one svelte-y66ne\">1</span>"), jl = /* @__PURE__ */ G("<footer class=\"bar svelte-y66ne\"><div class=\"now svelte-y66ne\"><!> <div class=\"ntext svelte-y66ne\"><div class=\"ntitle svelte-y66ne\"> </div><div class=\"nsub svelte-y66ne\"> </div></div> <!></div> <div class=\"center svelte-y66ne\"><div class=\"controls svelte-y66ne\"><button class=\"skipc svelte-y66ne\" aria-label=\"Previous chapter\"><!></button> <button class=\"jump svelte-y66ne\"> </button> <button><!></button> <button class=\"jump svelte-y66ne\"> </button> <button class=\"skipc svelte-y66ne\" aria-label=\"Next in queue\"><!></button></div> <div class=\"timeline svelte-y66ne\"><span class=\"time l svelte-y66ne\"> </span> <!> <!></div></div> <div class=\"tools svelte-y66ne\"><button><!><!></button> <button data-pop=\"\" aria-haspopup=\"dialog\"> </button> <button data-pop=\"\" title=\"Sleep timer\" aria-haspopup=\"dialog\"><!> </button> <button class=\"clip svelte-y66ne\" title=\"Clip to Notes\"><!></button> <div class=\"vol svelte-y66ne\"><button class=\"mute svelte-y66ne\"><!></button> <div class=\"vtrack svelte-y66ne\" role=\"slider\" tabindex=\"0\" aria-label=\"Volume\"><div class=\"vfill svelte-y66ne\"></div></div></div></div> <!> <!></footer>"), Ml = {
	hash: "svelte-y66ne",
	code: ".bar.svelte-y66ne {height:84px;flex:none;display:flex;align-items:center;gap:18px;padding:0 18px;background:var(--tm-panel-surface);border-top:1px solid var(--tm-fg-7);position:relative;}.now.svelte-y66ne {width:240px;display:flex;align-items:center;gap:11px;min-width:0;flex:none;}.thumb.svelte-y66ne {width:46px;height:46px;border-radius:9px;flex:none;background:var(--tm-fg-6);}.ntext.svelte-y66ne {min-width:0;flex:1;}.ntitle.svelte-y66ne {font-size:12.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.nsub.svelte-y66ne {font-size:11px;color:var(--tm-muted);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.center.svelte-y66ne {flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;gap:6px;}.controls.svelte-y66ne {display:flex;align-items:center;justify-content:center;gap:14px;}button.svelte-y66ne:disabled {opacity:.35;cursor:default;}.skipc.svelte-y66ne {width:30px;height:30px;border:0;background:none;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;}.skipc.svelte-y66ne:hover:not(:disabled) {color:var(--tm-fg);}.jump.svelte-y66ne {width:32px;height:32px;border:0;background:none;color:var(--tm-fg);cursor:pointer;font:600 10.5px ui-monospace, Menlo, monospace;border-radius:16px;}.jump.svelte-y66ne:hover:not(:disabled) {background:var(--tm-fg-8);}.pp.svelte-y66ne {width:50px;height:50px;flex:none;padding:0;border:0;border-radius:50%;background:var(--tm-fg);color:var(--tm-bg);cursor:pointer;display:grid;place-items:center;position:relative;transition:transform .1s;}\n  /* The play triangle's visual centre sits left of its box. */.pp.paused.svelte-y66ne svg {transform:translateX(1.5px);}.pp.svelte-y66ne:hover:not(:disabled) {filter:brightness(1.12);transform:scale(1.04);}.pp.svelte-y66ne:active:not(:disabled) {transform:scale(.96);}.pp.busy.svelte-y66ne::after {content:'';position:absolute;inset:-4px;border-radius:50%;border:2px solid transparent;border-top-color:var(--tm-accent); animation: svelte-y66ne-spin .9s linear infinite;}\n  @keyframes svelte-y66ne-spin { to { transform: rotate(360deg); } }\n  @media (prefers-reduced-motion: reduce) {.pp.svelte-y66ne {transition:none;}.pp.busy.svelte-y66ne::after { animation: none;border-color:var(--tm-accent);} }.timeline.svelte-y66ne {display:flex;align-items:center;gap:10px;width:100%;max-width:440px;}.time.svelte-y66ne {font:500 10.5px ui-monospace, Menlo, monospace;color:var(--tm-muted);width:52px;flex:none;}.time.l.svelte-y66ne {text-align:right;}.live.svelte-y66ne {width:52px;height:20px;flex:none;display:grid;place-items:center;border-radius:10px;background:var(--tm-live);color:#fff;font-size:9.5px;font-weight:700;letter-spacing:.8px;}.tools.svelte-y66ne {width:240px;flex:none;display:flex;align-items:center;justify-content:flex-end;gap:6px;}.repeat.svelte-y66ne {position:relative;height:30px;width:32px;border:0;border-radius:8px;background:transparent;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;}.repeat.svelte-y66ne:hover:not(:disabled) {background:var(--tm-fg-10);color:var(--tm-fg);}.repeat.on.svelte-y66ne {color:var(--tm-accent);}.one.svelte-y66ne {position:absolute;right:3px;bottom:3px;min-width:11px;height:11px;border-radius:6px;background:var(--tm-accent);color:var(--tm-on-accent);font:700 8px/11px system-ui, sans-serif;text-align:center;}.speed.svelte-y66ne {height:30px;min-width:44px;padding:0 8px;border:0;border-radius:8px;background:transparent;color:var(--tm-fg);font:600 11.5px ui-monospace, Menlo, monospace;cursor:pointer;}.speed.on.svelte-y66ne {background:var(--tm-accent-14);}.sleep.svelte-y66ne {height:30px;padding:0 8px;border:0;border-radius:8px;background:transparent;color:var(--tm-fg);cursor:pointer;display:flex;align-items:center;gap:5px;font:600 11px ui-monospace, Menlo, monospace;}.sleep.on.svelte-y66ne {background:var(--tm-accent-14);color:var(--tm-accent);}.speed.svelte-y66ne:hover:not(:disabled), .sleep.svelte-y66ne:hover:not(:disabled), .clip.svelte-y66ne:hover:not(:disabled) {background:var(--tm-fg-10);}.clip.svelte-y66ne {height:30px;width:32px;border:0;border-radius:8px;background:transparent;color:var(--tm-fg);cursor:pointer;display:grid;place-items:center;}.vol.svelte-y66ne {display:flex;align-items:center;gap:6px;margin-left:4px;color:var(--tm-muted);}.mute.svelte-y66ne {border:0;background:none;padding:0;color:inherit;cursor:pointer;display:grid;place-items:center;}.mute.svelte-y66ne:hover {color:var(--tm-fg);}.vtrack.svelte-y66ne {width:64px;height:12px;display:flex;align-items:center;cursor:pointer;position:relative;background:linear-gradient(var(--tm-fg-12), var(--tm-fg-12)) center / 100% 4px no-repeat;border-radius:2px;}.vfill.svelte-y66ne {height:4px;border-radius:2px;background:var(--tm-fg);}.vtrack.svelte-y66ne:focus-visible {outline:2px solid var(--tm-accent);outline-offset:2px;}"
};
function Nl(e, t) {
	Ue(t, !0), $r(e, Ml);
	let n = /* @__PURE__ */ j(() => t.store.item), r = /* @__PURE__ */ j(() => !!U(n) && Pi(U(n))), i = /* @__PURE__ */ j(() => U(n) ? t.store.durOf(U(n).id) : 0), a = /* @__PURE__ */ j(() => typeof t.store.sleep == "number" ? ea(t.store.sleep) : t.store.sleep === "chapter" ? "End" : ""), o = /* @__PURE__ */ j(() => t.store.buffering || t.store.loadingItem), s = /* @__PURE__ */ j(() => U(n)?.type === "radio" ? t.store.nowPlaying[U(n).stationId] : void 0), c = /* @__PURE__ */ j(() => t.store.playing ? t.store.live ? "Stop" : "Pause" : "Play"), l = /* @__PURE__ */ j(() => t.store.playing ? t.store.live ? Q.stop : Q.pause : Q.play);
	function u(e) {
		let n = e.currentTarget.getBoundingClientRect();
		t.store.setVolume((e.clientX - n.left) / n.width);
	}
	function d(e) {
		let n = {
			ArrowLeft: -.1,
			ArrowDown: -.1,
			ArrowRight: .1,
			ArrowUp: .1
		}[e.key];
		n && (e.preventDefault(), t.store.setVolume(t.store.volume + n));
	}
	var f = jl(), p = I(f), m = I(p), h = (e) => {
		{
			let t = /* @__PURE__ */ j(() => U(s)?.art || U(n).art);
			Ga(e, {
				get hue() {
					return U(n).hue;
				},
				get art() {
					return U(t);
				},
				get mark() {
					return U(n).mark;
				},
				size: 46,
				radius: 9
			});
		}
	}, g = (e) => {
		K(e, Dl());
	};
	J(m, (e) => {
		U(n) ? e(h) : e(g, -1);
	});
	var _ = z(m, 2), v = I(_), y = R(v, !0), b = R(z(v), !0);
	k(_);
	var x = z(_, 2), S = (e) => {
		jo(e, {
			get store() {
				return t.store;
			},
			get id() {
				return U(n).id;
			}
		});
	};
	J(x, (e) => {
		U(n) && e(S);
	}), k(p);
	var C = z(p, 2), w = I(C), T = I(w);
	$(I(T), { get d() {
		return Q.prev;
	} }), k(T);
	var E = z(T, 2), ee = R(E), te = z(E, 2);
	let ne;
	$(I(te), {
		get d() {
			return U(l);
		},
		size: 22
	}), k(te);
	var re = z(te, 2), ie = R(re), ae = z(re, 2);
	$(I(ae), { get d() {
		return Q.next;
	} }), k(ae), k(w);
	var oe = z(w, 2), se = I(oe), ce = R(se, !0), le = z(se, 2);
	vl(le, {
		get store() {
			return t.store;
		},
		ticks: !0
	});
	var ue = z(le, 2), de = (e) => {
		K(e, Ol());
	}, fe = (e) => {
		var n = kl(), r = R(n, !0);
		B((e) => q(r, e), [() => U(i) ? `−${ea(ma(U(i), t.store.pos, t.store.speed))}` : ""]), K(e, n);
	};
	J(ue, (e) => {
		U(n) && !U(r) ? e(de) : e(fe, -1);
	}), k(oe), k(C);
	var pe = z(C, 2), me = I(pe);
	let he;
	var ge = I(me);
	$(ge, {
		get d() {
			return Q.repeat;
		},
		size: 15,
		stroke: 1.8
	});
	var _e = z(ge), ve = (e) => {
		K(e, Al());
	};
	J(_e, (e) => {
		t.store.prefs.repeat === "one" && e(ve);
	}), k(me);
	var ye = z(me, 2);
	let be;
	var D = R(ye), xe = z(ye, 2);
	let O;
	var Se = I(xe);
	$(Se, {
		get d() {
			return Q.moon;
		},
		size: 15,
		stroke: 1.8
	});
	var Ce = z(Se, 1, !0);
	k(xe);
	var A = z(xe, 2);
	$(I(A), {
		get d() {
			return Q.clip;
		},
		size: 15,
		stroke: 1.8
	}), k(A);
	var we = z(A, 2), Te = I(we), Ee = I(Te);
	{
		let e = /* @__PURE__ */ j(() => t.store.muted ? Q.muted : Q.volume);
		$(Ee, {
			get d() {
				return U(e);
			},
			size: 15,
			stroke: 1.8
		});
	}
	k(Te);
	var De = z(Te, 2);
	Z(De, "aria-valuemin", 0), Z(De, "aria-valuemax", 100);
	var Oe = I(De);
	let ke;
	k(De), k(we), k(pe);
	var Ae = z(pe, 2), je = (e) => {
		Sl(e, {
			get store() {
				return t.store;
			},
			pos: "right:60px;bottom:74px"
		});
	};
	J(Ae, (e) => {
		t.store.pop === "sleep" && e(je);
	});
	var Me = z(Ae, 2), Ne = (e) => {
		El(e, {
			get store() {
				return t.store;
			},
			pos: "right:110px;bottom:74px"
		});
	};
	J(Me, (e) => {
		t.store.pop === "speed" && e(Ne);
	}), k(f), B((e, i, l, u, d) => {
		q(y, U(s)?.title || U(n)?.title || "Nothing playing"), q(b, e), T.disabled = !U(r), Z(E, "aria-label", `Back ${t.store.prefs.back ?? ""} seconds`), E.disabled = !U(r), q(ee, `−${t.store.prefs.back ?? ""}`), ne = X(te, 1, "pp svelte-y66ne", null, ne, {
			busy: U(o),
			paused: !t.store.playing
		}), Z(te, "aria-label", U(c)), Z(te, "title", U(c)), te.disabled = !U(n), Z(re, "aria-label", `Forward ${t.store.prefs.fwd ?? ""} seconds`), re.disabled = !U(r), q(ie, `+${t.store.prefs.fwd ?? ""}`), ae.disabled = !t.store.queue.length, q(ce, i), he = X(me, 1, "repeat svelte-y66ne", null, he, { on: t.store.prefs.repeat !== "off" }), me.disabled = !U(n) || t.store.live, Z(me, "aria-pressed", t.store.prefs.repeat !== "off"), Z(me, "aria-label", t.store.prefs.repeat === "off" ? "Repeat is off" : t.store.prefs.repeat === "all" ? "Repeat all" : "Repeat one"), Z(me, "title", t.store.prefs.repeat === "off" ? "Repeat: off" : t.store.prefs.repeat === "all" ? "Repeat: all" : "Repeat: one"), be = X(ye, 1, "speed svelte-y66ne", null, be, { on: t.store.speed !== 1 && U(r) }), ye.disabled = !U(n), Z(ye, "aria-expanded", t.store.pop === "speed"), Z(ye, "aria-label", `Playback speed ${l ?? ""}×`), q(D, `${u ?? ""}×`), O = X(xe, 1, "sleep svelte-y66ne", null, O, { on: !!t.store.sleep }), xe.disabled = !U(n), Z(xe, "aria-expanded", t.store.pop === "sleep"), Z(xe, "aria-label", `Sleep timer${U(a) ? `: ${U(a)}` : ""}`), q(Ce, U(a)), Z(A, "aria-label", U(r) ? "Clip the last 30 seconds to Notes" : "Save what is playing to Notes"), A.disabled = !U(n), Z(Te, "aria-label", t.store.muted ? "Unmute" : "Mute"), Z(De, "aria-valuenow", d), ke = si(Oe, "", ke, { width: `${(t.store.muted ? 0 : t.store.volume) * 100}%` });
	}, [
		() => U(n) ? U(s)?.title ? [U(s).artist, U(n).title].filter(Boolean).join(" · ") : t.store.subtitle : "Choose something to listen to",
		() => U(n) ? U(r) ? ea(t.store.pos) : "On air" : "",
		() => t.store.speed.toFixed(1),
		() => U(r) ? t.store.speed.toFixed(1) : "1.0",
		() => Math.round((t.store.muted ? 0 : t.store.volume) * 100)
	]), W("click", T, () => t.store.previous()), W("click", E, () => t.store.skip(-t.store.prefs.back)), W("click", te, () => t.store.toggle()), W("click", re, () => t.store.skip(t.store.prefs.fwd)), W("click", ae, () => t.store.next()), W("click", me, () => t.store.cycleRepeat()), W("click", ye, () => t.store.togglePop("speed")), W("click", xe, () => t.store.togglePop("sleep")), W("click", A, () => t.store.clip()), W("click", Te, () => t.store.toggleMute()), W("click", De, u), W("keydown", De, d), K(e, f), We();
}
br(["click", "keydown"]);
//#endregion
//#region src/components/MiniPlayer.svelte
var Pl = /* @__PURE__ */ G("<div class=\"blank svelte-1jla3sy\"></div>"), Fl = /* @__PURE__ */ G("<span class=\"kind svelte-1jla3sy\"> </span>"), Il = /* @__PURE__ */ G("<div class=\"chapter svelte-1jla3sy\"><span class=\"svelte-1jla3sy\">Chapter</span><br/> </div>"), Ll = /* @__PURE__ */ G("<span class=\"liveword svelte-1jla3sy\">LIVE</span>"), Rl = /* @__PURE__ */ G("<span> </span>"), zl = /* @__PURE__ */ G("<span class=\"one svelte-1jla3sy\">1</span>"), Bl = /* @__PURE__ */ G("<div class=\"sleepnote svelte-1jla3sy\"> </div>"), Vl = /* @__PURE__ */ G("<button class=\"svelte-1jla3sy\">Clip to Notes</button>"), Hl = /* @__PURE__ */ G("<button class=\"q svelte-1jla3sy\"><!> <span class=\"qtext svelte-1jla3sy\"><span class=\"qtitle svelte-1jla3sy\"> </span><span class=\"qmeta svelte-1jla3sy\"> </span></span></button>"), Ul = /* @__PURE__ */ G("<div class=\"empty svelte-1jla3sy\">Widen the panel to browse radio, podcasts and audiobooks.</div>"), Wl = /* @__PURE__ */ G("<div class=\"mini svelte-1jla3sy\"><div class=\"head svelte-1jla3sy\"><span class=\"np svelte-1jla3sy\">Now playing</span><span class=\"spacer svelte-1jla3sy\"></span><span class=\"by svelte-1jla3sy\">OndaCast</span></div> <div class=\"player svelte-1jla3sy\"><div class=\"art svelte-1jla3sy\"><!> <!> <!></div> <div class=\"trow svelte-1jla3sy\"><div class=\"title svelte-1jla3sy\"> </div><!></div> <div class=\"sub svelte-1jla3sy\"> </div> <div class=\"seek svelte-1jla3sy\"><!></div> <div class=\"times svelte-1jla3sy\"><span> </span> <!></div> <div class=\"controls svelte-1jla3sy\"><button class=\"chipbtn svelte-1jla3sy\" data-pop=\"\" aria-haspopup=\"dialog\"> </button> <button class=\"jump svelte-1jla3sy\"> </button> <button><!></button> <button class=\"jump svelte-1jla3sy\"> </button> <button><!><!></button> <button data-pop=\"\" aria-haspopup=\"dialog\" aria-label=\"Sleep timer\"><!></button></div> <!> <!> <!></div> <div class=\"upnext svelte-1jla3sy\"><div class=\"uphead svelte-1jla3sy\"><span class=\"svelte-1jla3sy\"> </span><!></div> <!></div></div>"), Gl = {
	hash: "svelte-1jla3sy",
	code: ".mini.svelte-1jla3sy {height:100%;container-type:size;display:flex;flex-direction:column;background:var(--tm-surface);}.head.svelte-1jla3sy {height:36px;flex:none;display:flex;align-items:center;gap:8px;padding:0 14px;background:var(--tm-panel-surface);}.by.svelte-1jla3sy {font-size:11px;color:var(--tm-muted);}.spacer.svelte-1jla3sy {flex:1;}.np.svelte-1jla3sy {font-size:12px;font-weight:600;}.player.svelte-1jla3sy {padding:22px 22px 0;position:relative;flex:none;}.art.svelte-1jla3sy {width:min(100%, 48cqh);aspect-ratio:1;margin:0 auto;border-radius:18px;overflow:hidden;display:flex;position:relative;box-shadow:0 24px 50px rgba(0, 0, 0, .45);}.blank.svelte-1jla3sy {flex:1;background:var(--tm-fg-6);}.kind.svelte-1jla3sy {position:absolute;left:14px;top:14px;font-size:9.5px;font-weight:700;letter-spacing:.8px;padding:3px 8px;border-radius:20px;background:rgba(0, 0, 0, .45);color:#fff;}.chapter.svelte-1jla3sy {position:absolute;left:14px;bottom:14px;max-width:70%;padding:8px 10px;border-radius:10px;background:rgba(0, 0, 0, .5);color:#fff;font-size:11.5px;line-height:1.3;}.chapter.svelte-1jla3sy span:where(.svelte-1jla3sy) {opacity:.7;}.trow.svelte-1jla3sy {display:flex;align-items:flex-start;gap:6px;margin-top:18px;}.trow.svelte-1jla3sy .title:where(.svelte-1jla3sy) {margin-top:0;flex:1;min-width:0;}.title.svelte-1jla3sy {font-size:17px;font-weight:650;margin-top:18px;line-height:1.3;text-wrap:pretty;display:-webkit-box;-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}.sub.svelte-1jla3sy {font-size:12.5px;color:var(--tm-muted);margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.seek.svelte-1jla3sy {display:flex;margin-top:14px;}.times.svelte-1jla3sy {display:flex;justify-content:space-between;font:500 10.5px ui-monospace, Menlo, monospace;color:var(--tm-muted);margin-top:2px;}.liveword.svelte-1jla3sy {color:var(--tm-live);font-weight:700;}.controls.svelte-1jla3sy {display:flex;align-items:center;justify-content:space-between;margin-top:10px;}button.svelte-1jla3sy:disabled {opacity:.35;cursor:default;}.chipbtn.svelte-1jla3sy {width:44px;height:30px;border:0;border-radius:8px;background:var(--tm-fg-6);color:var(--tm-fg);font:600 11px ui-monospace, Menlo, monospace;cursor:pointer;display:grid;place-items:center;}.repeat.svelte-1jla3sy {position:relative;height:30px;width:32px;border:0;border-radius:8px;background:transparent;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;}.repeat.svelte-1jla3sy:hover:not(:disabled) {background:var(--tm-fg-10);color:var(--tm-fg);}.repeat.on.svelte-1jla3sy {color:var(--tm-accent);}.one.svelte-1jla3sy {position:absolute;right:3px;bottom:3px;min-width:11px;height:11px;border-radius:6px;background:var(--tm-accent);color:var(--tm-on-accent);font:700 8px/11px system-ui, sans-serif;text-align:center;}.sleep.svelte-1jla3sy {background:transparent;}.sleep.on.svelte-1jla3sy {background:var(--tm-accent-14);color:var(--tm-accent);}.jump.svelte-1jla3sy {width:40px;height:40px;border:0;border-radius:20px;background:none;color:var(--tm-fg);font:600 11px ui-monospace, Menlo, monospace;cursor:pointer;}.jump.svelte-1jla3sy:hover:not(:disabled) {background:var(--tm-fg-8);}.pp.svelte-1jla3sy {width:58px;height:58px;flex:none;padding:0;border:0;border-radius:50%;background:var(--tm-accent);color:var(--tm-on-accent);cursor:pointer;display:grid;place-items:center;position:relative;}.pp.paused.svelte-1jla3sy svg {transform:translateX(1.5px);}.pp.busy.svelte-1jla3sy::after {content:'';position:absolute;inset:-5px;border-radius:50%;border:2px solid transparent;border-top-color:var(--tm-accent); animation: svelte-1jla3sy-spin .9s linear infinite;}\n  @keyframes svelte-1jla3sy-spin { to { transform: rotate(360deg); } }\n  @media (prefers-reduced-motion: reduce) {.pp.busy.svelte-1jla3sy::after { animation: none;} }.sleepnote.svelte-1jla3sy {text-align:center;font-size:11px;color:var(--tm-accent);margin-top:6px;}.upnext.svelte-1jla3sy {flex:1;min-height:0;margin-top:16px;background:var(--tm-panel-surface);border-radius:18px 18px 0 0;padding:14px 12px;overflow:auto;}.uphead.svelte-1jla3sy {display:flex;align-items:baseline;justify-content:space-between;padding:0 8px 6px;}.uphead.svelte-1jla3sy span:where(.svelte-1jla3sy) {font-size:13px;font-weight:650;}.uphead.svelte-1jla3sy button:where(.svelte-1jla3sy) {border:0;background:none;color:var(--tm-accent);font-size:11.5px;cursor:pointer;padding:0;}.q.svelte-1jla3sy {display:flex;align-items:center;gap:10px;width:100%;padding:7px 8px;border:0;border-radius:9px;background:none;color:inherit;cursor:pointer;text-align:left;font:inherit;}.q.svelte-1jla3sy:hover {background:var(--tm-fg-5);}.qtext.svelte-1jla3sy {flex:1;min-width:0;display:flex;flex-direction:column;}.qtitle.svelte-1jla3sy {font-size:12.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.qmeta.svelte-1jla3sy {font-size:11px;color:var(--tm-muted);margin-top:2px;}.empty.svelte-1jla3sy {padding:20px 8px;font-size:12px;color:var(--tm-muted);text-align:center;}"
};
function Kl(e, t) {
	Ue(t, !0), $r(e, Gl);
	let n = /* @__PURE__ */ j(() => t.store.item), r = /* @__PURE__ */ j(() => !!U(n) && Pi(U(n))), i = /* @__PURE__ */ j(() => U(n) ? t.store.durOf(U(n).id) : 0), a = /* @__PURE__ */ j(() => U(n) && Pi(U(n)) && U(n).chapters.length > 1 && t.store.chapIdx >= 0 ? U(n).chapters[t.store.chapIdx].title : ""), o = /* @__PURE__ */ j(() => typeof t.store.sleep == "number" ? ea(t.store.sleep) : t.store.sleep === "chapter" ? "end of chapter" : ""), s = /* @__PURE__ */ j(() => U(n)?.type === "radio" ? t.store.nowPlaying[U(n).stationId] : void 0), c = /* @__PURE__ */ j(() => [...t.store.continueIds, ...t.store.onAirIds].filter((e) => e !== t.store.now).slice(0, 6));
	var l = Wl(), u = z(I(l), 2), d = I(u), f = I(d), p = (e) => {
		{
			let t = /* @__PURE__ */ j(() => U(s)?.art || U(n).art);
			Ga(e, {
				get hue() {
					return U(n).hue;
				},
				get art() {
					return U(t);
				},
				fill: !0,
				radius: 0,
				get mark() {
					return U(n).mark;
				},
				font: 40
			});
		}
	}, m = (e) => {
		K(e, Pl());
	};
	J(f, (e) => {
		U(n) ? e(p) : e(m, -1);
	});
	var h = z(f, 2), g = (e) => {
		var n = Fl(), r = R(n, !0);
		B(() => q(r, t.store.kindLabel)), K(e, n);
	};
	J(h, (e) => {
		U(n) && e(g);
	});
	var _ = z(h, 2), v = (e) => {
		var t = Il(), n = z(I(t), 2, !0);
		k(t), B(() => q(n, U(a))), K(e, t);
	};
	J(_, (e) => {
		U(a) && e(v);
	}), k(d);
	var y = z(d, 2), b = I(y), x = R(b, !0), S = z(b), C = (e) => {
		jo(e, {
			get store() {
				return t.store;
			},
			get id() {
				return U(n).id;
			},
			size: 18
		});
	};
	J(S, (e) => {
		U(n) && e(C);
	}), k(y);
	var w = z(y, 2), T = R(w, !0), E = z(w, 2);
	vl(I(E), {
		get store() {
			return t.store;
		},
		height: 16
	}), k(E);
	var ee = z(E, 2), te = I(ee), ne = R(te, !0), re = z(te, 2), ie = (e) => {
		K(e, Ll());
	}, ae = (e) => {
		var n = Rl(), r = R(n, !0);
		B((e) => q(r, e), [() => U(i) ? `−${ea(ma(U(i), t.store.pos, t.store.speed))}` : ""]), K(e, n);
	};
	J(re, (e) => {
		U(n) && !U(r) ? e(ie) : e(ae, -1);
	}), k(ee);
	var oe = z(ee, 2), se = I(oe), ce = R(se), le = z(se, 2), ue = R(le), de = z(le, 2);
	let fe;
	var pe = I(de);
	{
		let e = /* @__PURE__ */ j(() => t.store.playing ? t.store.live ? Q.stop : Q.pause : Q.play);
		$(pe, {
			get d() {
				return U(e);
			},
			size: 24
		});
	}
	k(de);
	var me = z(de, 2), he = R(me), ge = z(me, 2);
	let _e;
	var ve = I(ge);
	$(ve, {
		get d() {
			return Q.repeat;
		},
		size: 15,
		stroke: 1.8
	});
	var ye = z(ve), be = (e) => {
		K(e, zl());
	};
	J(ye, (e) => {
		t.store.prefs.repeat === "one" && e(be);
	}), k(ge);
	var D = z(ge, 2);
	let xe;
	$(I(D), {
		get d() {
			return Q.moon;
		},
		size: 15,
		stroke: 1.8
	}), k(D), k(oe);
	var O = z(oe, 2), Se = (e) => {
		var t = Bl(), n = R(t);
		B(() => q(n, `Sleep timer · ${U(o) ?? ""}`)), K(e, t);
	};
	J(O, (e) => {
		t.store.sleep && e(Se);
	});
	var Ce = z(O, 2), A = (e) => {
		Sl(e, {
			get store() {
				return t.store;
			},
			pos: "right:16px;left:16px;width:auto;top:120px"
		});
	};
	J(Ce, (e) => {
		t.store.pop === "sleep" && e(A);
	});
	var we = z(Ce, 2), Te = (e) => {
		El(e, {
			get store() {
				return t.store;
			},
			pos: "right:16px;left:16px;width:auto;top:120px"
		});
	};
	J(we, (e) => {
		t.store.pop === "speed" && e(Te);
	}), k(u);
	var Ee = z(u, 2), De = I(Ee), Oe = I(De), ke = R(Oe, !0), Ae = z(Oe), je = (e) => {
		var n = Vl();
		W("click", n, () => t.store.clip()), K(e, n);
	};
	J(Ae, (e) => {
		U(n) && e(je);
	}), k(De), Y(z(De, 2), 16, () => t.store.queue.length ? t.store.queue : U(c), (e) => e, (e, n) => {
		let r = /* @__PURE__ */ j(() => t.store.items[n]);
		var i = jr(), a = L(i), o = (e) => {
			var i = Hl(), a = I(i);
			Ga(a, {
				get hue() {
					return U(r).hue;
				},
				get art() {
					return U(r).art;
				},
				get mark() {
					return U(r).mark;
				},
				size: 36,
				font: 9
			});
			var o = z(a, 2), s = I(o), c = R(s, !0), l = R(z(s));
			k(o), k(i), B((e) => {
				q(c, U(r).title), q(l, `${Ni[U(r).type] ?? ""}${e ?? ""}`);
			}, [() => t.store.lenOf(n) ? ` · ${t.store.lenOf(n)}` : ""]), W("click", i, () => t.store.play(n)), K(e, i);
		};
		J(a, (e) => {
			U(r) && e(o);
		}), K(e, i);
	}, (e) => {
		K(e, Ul());
	}), k(Ee), k(l), B((e, i, a, o) => {
		q(x, U(s)?.title || U(n)?.title || "Nothing playing"), q(T, e), q(ne, i), se.disabled = !U(r), Z(se, "aria-expanded", t.store.pop === "speed"), Z(se, "aria-label", `Playback speed ${a ?? ""}×`), q(ce, `${o ?? ""}×`), le.disabled = !U(r), Z(le, "aria-label", `Back ${t.store.prefs.back ?? ""} seconds`), q(ue, `−${t.store.prefs.back ?? ""}`), fe = X(de, 1, "pp svelte-1jla3sy", null, fe, {
			busy: t.store.buffering || t.store.loadingItem,
			paused: !t.store.playing
		}), de.disabled = !U(n), Z(de, "aria-label", t.store.playing ? t.store.live ? "Stop" : "Pause" : "Play"), me.disabled = !U(r), Z(me, "aria-label", `Forward ${t.store.prefs.fwd ?? ""} seconds`), q(he, `+${t.store.prefs.fwd ?? ""}`), _e = X(ge, 1, "repeat svelte-1jla3sy", null, _e, { on: t.store.prefs.repeat !== "off" }), ge.disabled = !U(n) || t.store.live, Z(ge, "aria-pressed", t.store.prefs.repeat !== "off"), Z(ge, "aria-label", t.store.prefs.repeat === "off" ? "Repeat is off" : t.store.prefs.repeat === "all" ? "Repeat all" : "Repeat one"), Z(ge, "title", t.store.prefs.repeat === "off" ? "Repeat: off" : t.store.prefs.repeat === "all" ? "Repeat: all" : "Repeat: one"), xe = X(D, 1, "chipbtn sleep svelte-1jla3sy", null, xe, { on: !!t.store.sleep }), D.disabled = !U(n), Z(D, "aria-expanded", t.store.pop === "sleep"), q(ke, t.store.queue.length ? "Up next" : "Recent");
	}, [
		() => U(n) ? U(s)?.title ? [U(s).artist, U(n).title].filter(Boolean).join(" · ") : t.store.subtitle : "Widen the panel to browse, or pick from below.",
		() => U(n) ? U(r) ? ea(t.store.pos) : "On air" : "",
		() => t.store.speed.toFixed(1),
		() => U(r) ? t.store.speed.toFixed(1) : "1.0"
	]), W("click", se, () => t.store.togglePop("speed")), W("click", le, () => t.store.skip(-t.store.prefs.back)), W("click", de, () => t.store.toggle()), W("click", me, () => t.store.skip(t.store.prefs.fwd)), W("click", ge, () => t.store.cycleRepeat()), W("click", D, () => t.store.togglePop("sleep")), K(e, l), We();
}
br(["click"]);
//#endregion
//#region src/components/PrefsPopover.svelte
var ql = /* @__PURE__ */ G("<button> </button>"), Jl = /* @__PURE__ */ G("<div class=\"tm-pop\" role=\"dialog\" aria-label=\"Playback preferences\"><div class=\"title svelte-1dgvwbx\">Playback</div> <div class=\"label svelte-1dgvwbx\">Skip back</div> <div class=\"row svelte-1dgvwbx\" role=\"group\" aria-label=\"Skip back\"></div> <div class=\"label svelte-1dgvwbx\">Skip forward</div> <div class=\"row svelte-1dgvwbx\" role=\"group\" aria-label=\"Skip forward\"></div> <label class=\"toggle-row svelte-1dgvwbx\"><span class=\"svelte-1dgvwbx\"><b>Smart rewind</b><small class=\"svelte-1dgvwbx\">Replay a few seconds when you resume after a break.</small></span> <input type=\"checkbox\" role=\"switch\" class=\"svelte-1dgvwbx\"/></label> <label class=\"toggle-row svelte-1dgvwbx\"><span class=\"svelte-1dgvwbx\"><b>Fill Up next automatically</b><small class=\"svelte-1dgvwbx\">Playing from a show or New from your shows queues its other unplayed episodes. Your own Play next and Queue picks always come first.</small></span> <input type=\"checkbox\" role=\"switch\" class=\"svelte-1dgvwbx\"/></label> <label class=\"toggle-row svelte-1dgvwbx\"><span class=\"svelte-1dgvwbx\"><b>Continuous play</b><small class=\"svelte-1dgvwbx\">When an episode or book ends, play what is up next, or the show's next episode.</small></span> <input type=\"checkbox\" role=\"switch\" class=\"svelte-1dgvwbx\"/></label> <div class=\"foot svelte-1dgvwbx\"><button class=\"link svelte-1dgvwbx\">Keyboard shortcuts</button> <button class=\"link danger svelte-1dgvwbx\">Clear history</button></div></div>"), Yl = {
	hash: "svelte-1dgvwbx",
	code: ".title.svelte-1dgvwbx {font-size:13px;font-weight:650;}.label.svelte-1dgvwbx {font-size:11px;color:var(--tm-muted);margin:12px 0 6px;}.row.svelte-1dgvwbx {display:flex;gap:5px;}.opt.svelte-1dgvwbx {flex:1;height:30px;border-radius:8px;border:0;background:var(--tm-fg-6);color:var(--tm-fg);font-size:11.5px;font-weight:600;cursor:pointer;font-variant-numeric:tabular-nums;}.opt.svelte-1dgvwbx:hover {background:var(--tm-fg-10);}.opt.sel.svelte-1dgvwbx {background:var(--tm-accent);color:var(--tm-on-accent);}.toggle-row.svelte-1dgvwbx {display:flex;align-items:center;gap:12px;margin-top:12px;cursor:pointer;}.toggle-row.svelte-1dgvwbx span:where(.svelte-1dgvwbx) {flex:1;display:flex;flex-direction:column;gap:2px;font-size:12px;}.toggle-row.svelte-1dgvwbx small:where(.svelte-1dgvwbx) {font-size:11px;color:var(--tm-muted);line-height:1.35;}input[type=checkbox].svelte-1dgvwbx {appearance:none;width:34px;height:20px;flex:none;border-radius:10px;background:var(--tm-fg-16);position:relative;cursor:pointer;transition:background .15s;margin:0;}input[type=checkbox].svelte-1dgvwbx::after {content:'';position:absolute;top:3px;left:3px;width:14px;height:14px;border-radius:50%;background:var(--tm-fg);transition:transform .15s;}input[type=checkbox].svelte-1dgvwbx:checked {background:var(--tm-accent);}input[type=checkbox].svelte-1dgvwbx:checked::after {transform:translateX(14px);background:var(--tm-on-accent);}input[type=checkbox].svelte-1dgvwbx:focus-visible {outline:2px solid var(--tm-accent);outline-offset:2px;}.foot.svelte-1dgvwbx {display:flex;justify-content:space-between;margin-top:14px;padding-top:10px;border-top:1px solid var(--tm-fg-8);}.link.svelte-1dgvwbx {border:0;background:none;padding:0;color:var(--tm-accent);font-size:11.5px;cursor:pointer;}.link.danger.svelte-1dgvwbx {color:var(--tm-muted);}.link.danger.svelte-1dgvwbx:hover:not(:disabled) {color:var(--tm-live);}.link.svelte-1dgvwbx:disabled {opacity:.4;cursor:default;}\n  @media (prefers-reduced-motion: reduce) {input[type=checkbox].svelte-1dgvwbx, input[type=checkbox].svelte-1dgvwbx::after {transition:none;} }"
};
function Xl(e, t) {
	Ue(t, !0), $r(e, Yl);
	let n = ji(t, "store", 7);
	var r = Jl(), i = z(I(r), 4);
	Y(i, 21, () => Da, Wr, (e, t) => {
		var r = ql();
		let i;
		var a = R(r);
		B(() => {
			i = X(r, 1, "opt svelte-1dgvwbx", null, i, { sel: n().prefs.back === U(t) }), Z(r, "aria-pressed", n().prefs.back === U(t)), q(a, `${U(t) ?? ""}s`);
		}), W("click", r, () => n().setPref("back", U(t))), K(e, r);
	}), k(i);
	var a = z(i, 4);
	Y(a, 21, () => Oa, Wr, (e, t) => {
		var r = ql();
		let i;
		var a = R(r);
		B(() => {
			i = X(r, 1, "opt svelte-1dgvwbx", null, i, { sel: n().prefs.fwd === U(t) }), Z(r, "aria-pressed", n().prefs.fwd === U(t)), q(a, `${U(t) ?? ""}s`);
		}), W("click", r, () => n().setPref("fwd", U(t))), K(e, r);
	}), k(a);
	var o = z(a, 2), s = z(I(o), 2);
	yi(s), k(o);
	var c = z(o, 2), l = z(I(c), 2);
	yi(l), k(c);
	var u = z(c, 2), d = z(I(u), 2);
	yi(d), k(u);
	var f = z(u, 2), p = I(f), m = z(p, 2);
	k(f), k(r), B(() => {
		si(r, t.pos), xi(s, n().prefs.smartRewind), xi(l, n().prefs.autoFill), xi(d, n().prefs.continuous), m.disabled = !n().history.length;
	}), W("change", s, (e) => n().setPref("smartRewind", e.currentTarget.checked)), W("change", l, (e) => n().setPref("autoFill", e.currentTarget.checked)), W("change", d, (e) => n().setPref("continuous", e.currentTarget.checked)), W("click", p, () => {
		n().pop = null, n().shortcuts = !0;
	}), W("click", m, () => n().clearHistory()), K(e, r), We();
}
br(["click", "change"]);
//#endregion
//#region src/components/ShortcutsSheet.svelte
var Zl = /* @__PURE__ */ G("<span class=\"to svelte-jfujii\">–</span>"), Ql = /* @__PURE__ */ G("<kbd class=\"svelte-jfujii\"> </kbd>"), $l = /* @__PURE__ */ G("<div class=\"svelte-jfujii\"><dt class=\"svelte-jfujii\"></dt><dd class=\"svelte-jfujii\"> </dd></div>"), eu = /* @__PURE__ */ G("<div class=\"scrim svelte-jfujii\" role=\"presentation\"><div class=\"sheet svelte-jfujii\" role=\"dialog\" aria-modal=\"true\" aria-label=\"Keyboard shortcuts\" tabindex=\"-1\"><div class=\"head svelte-jfujii\"><h2 class=\"svelte-jfujii\">Keyboard shortcuts</h2><button class=\"x svelte-jfujii\" aria-label=\"Close\">✕</button></div> <dl class=\"svelte-jfujii\"></dl></div></div>"), tu = {
	hash: "svelte-jfujii",
	code: ".scrim.svelte-jfujii {position:absolute;inset:0;z-index:20;background:rgba(0, 0, 0, .5);display:grid;place-items:center;padding:20px;}.sheet.svelte-jfujii {width:min(460px, 100%);max-height:100%;overflow:auto;padding:20px 22px;border-radius:16px;background:var(--tm-pop);border:1px solid var(--tm-fg-10);box-shadow:0 30px 70px rgba(0, 0, 0, .55);outline:none;}.head.svelte-jfujii {display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}h2.svelte-jfujii {font-size:15px;margin:0;}.x.svelte-jfujii {width:28px;height:28px;border:0;border-radius:8px;background:none;color:var(--tm-muted);cursor:pointer;}.x.svelte-jfujii:hover {background:var(--tm-fg-8);color:var(--tm-fg);}dl.svelte-jfujii {margin:0;display:grid;gap:2px;}dl.svelte-jfujii div:where(.svelte-jfujii) {display:flex;align-items:center;gap:14px;padding:7px 0;border-top:1px solid var(--tm-fg-6);}dt.svelte-jfujii {width:120px;flex:none;display:flex;align-items:center;gap:4px;}dd.svelte-jfujii {margin:0;font-size:12.5px;}kbd.svelte-jfujii {font:600 11px ui-monospace, Menlo, monospace;min-width:22px;text-align:center;padding:3px 6px;border-radius:6px;background:var(--tm-fg-8);border:1px solid var(--tm-fg-14);border-bottom-width:2px;}.to.svelte-jfujii {color:var(--tm-muted);}"
};
function nu(e, t) {
	Ue(t, !0), $r(e, tu);
	let n = ji(t, "store", 7), r = /* @__PURE__ */ j(() => [
		[["Space"], "Play or pause (stop for live radio)"],
		[["←"], `Back ${n().prefs.back} seconds`],
		[["→"], `Forward ${n().prefs.fwd} seconds`],
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
	]), i = /* @__PURE__ */ N(void 0);
	gn(() => {
		U(i)?.focus();
	});
	var a = eu(), o = I(a), s = I(o), c = z(I(s));
	k(s);
	var l = z(s, 2);
	Y(l, 21, () => U(r), ([e, t]) => t, (e, t) => {
		var n = /* @__PURE__ */ j(() => m(U(t), 2));
		let r = () => U(n)[0], i = () => U(n)[1];
		var a = $l(), o = I(a);
		Y(o, 21, r, Wr, (e, t) => {
			var n = jr(), r = L(n), i = (e) => {
				K(e, Zl());
			}, a = (e) => {
				var n = Ql(), r = R(n, !0);
				B(() => q(r, U(t))), K(e, n);
			};
			J(r, (e) => {
				U(t) === "–" ? e(i) : e(a, -1);
			}), K(e, n);
		}), k(o);
		var s = R(z(o), !0);
		k(a), B(() => q(s, i())), K(e, a);
	}), k(l), k(o), Ai(o, (e) => P(i, e), () => U(i)), k(a), W("click", a, () => n().shortcuts = !1), W("click", o, (e) => e.stopPropagation()), W("keydown", o, (e) => {
		e.key === "Escape" && (e.stopPropagation(), n().shortcuts = !1);
	}), W("click", c, () => n().shortcuts = !1), K(e, a), We();
}
br(["click", "keydown"]);
//#endregion
//#region src/App.svelte
var ru = /* @__PURE__ */ G("<div class=\"unsupported svelte-1n46o8q\"><strong class=\"svelte-1n46o8q\">Update Tend to use TEND Media.</strong><p>This panel does not provide the OndaCast catalog capability yet. Updating Tend adds it.</p></div>"), iu = /* @__PURE__ */ G("<!> <div class=\"middle svelte-1n46o8q\"><!> <main class=\"svelte-1n46o8q\"><!></main> <!></div> <!>", 1), au = /* @__PURE__ */ G("<div role=\"status\"> </div>"), ou = /* @__PURE__ */ G("<div class=\"tend-media svelte-1n46o8q\" tabindex=\"-1\"><!> <!> <!> <!></div>"), su = {
	hash: "svelte-1n46o8q",
	code: ".tend-media.svelte-1n46o8q {\n    /* Live Tend theme tokens with the TEND Notes dark palette as fallback. */--tm-bg: var(--color-base-100, #151b19);--tm-panel: var(--color-base-200, #1d2622);--tm-fg: var(--color-base-content, #d8e3df);--tm-accent: var(--color-primary, #66b798);--tm-on-accent: var(--color-primary-content, #071a13);--tm-muted: color-mix(in srgb, var(--tm-fg) 64%, var(--tm-bg));--tm-brand: #0f766e;--tm-live: #ff6b6b;--tm-fg-4: color-mix(in srgb, var(--tm-fg) 4.5%, transparent);--tm-fg-5: color-mix(in srgb, var(--tm-fg) 5%, transparent);--tm-fg-6: color-mix(in srgb, var(--tm-fg) 6%, transparent);--tm-fg-7: color-mix(in srgb, var(--tm-fg) 7%, transparent);--tm-fg-8: color-mix(in srgb, var(--tm-fg) 8%, transparent);--tm-fg-10: color-mix(in srgb, var(--tm-fg) 10%, transparent);--tm-fg-12: color-mix(in srgb, var(--tm-fg) 12%, transparent);--tm-fg-14: color-mix(in srgb, var(--tm-fg) 14%, transparent);--tm-fg-16: color-mix(in srgb, var(--tm-fg) 16%, transparent);--tm-fg-18: color-mix(in srgb, var(--tm-fg) 18%, transparent);--tm-fg-45: color-mix(in srgb, var(--tm-fg) 45%, transparent);--tm-accent-7: color-mix(in srgb, var(--tm-accent) 7%, transparent);--tm-accent-8: color-mix(in srgb, var(--tm-accent) 8%, transparent);--tm-accent-12: color-mix(in srgb, var(--tm-accent) 12%, transparent);--tm-accent-14: color-mix(in srgb, var(--tm-accent) 14%, transparent);--tm-pop: color-mix(in srgb, var(--tm-fg) 3.5%, var(--tm-panel));\n    /* The panel's window glass: --tend-panel-surface-alpha is 0% for a glass\n       window and 100% for a solid one. The main surface follows it exactly;\n       bars and side panels keep a light tint so the layout still reads. */--tm-alpha: var(--tend-panel-surface-alpha, 100%);--tm-surface: color-mix(in srgb, var(--tm-bg) var(--tm-alpha), transparent);--tm-panel-surface: color-mix(in srgb, var(--tm-panel) max(var(--tm-alpha), 45%), transparent);position:relative;height:100%;width:100%;overflow:hidden;display:flex;flex-direction:column;background:var(--tm-surface);color:var(--tm-fg);font-family:system-ui, -apple-system, \"Segoe UI\", sans-serif;font-size:13px;-webkit-font-smoothing:antialiased;outline:none;}.tend-media.svelte-1n46o8q * {box-sizing:border-box;}.tend-media.svelte-1n46o8q button {font-family:inherit;}.tend-media.svelte-1n46o8q button:focus-visible {outline:2px solid var(--tm-accent);outline-offset:2px;}.tend-media.svelte-1n46o8q .tm-pop {position:absolute;width:250px;padding:14px;border-radius:14px;z-index:5;background:var(--tm-pop);border:1px solid var(--tm-fg-10);box-shadow:0 20px 50px rgba(0, 0, 0, .5);}.toast.low.svelte-1n46o8q {bottom:20px;}.unsupported.svelte-1n46o8q {margin:auto;max-width:360px;text-align:center;padding:24px;font-size:13px;color:var(--tm-muted);}.unsupported.svelte-1n46o8q strong:where(.svelte-1n46o8q) {display:block;color:var(--tm-fg);font-size:15px;margin-bottom:6px;}.middle.svelte-1n46o8q {flex:1;min-height:0;display:flex;}main.svelte-1n46o8q {flex:1;min-width:0;overflow:auto;padding:26px 28px 28px;container-type:inline-size;}.toast.svelte-1n46o8q {position:absolute;left:50%;bottom:96px;transform:translateX(-50%);padding:10px 16px;border-radius:10px;background:var(--tm-fg);color:var(--tm-bg);font-size:12.5px;font-weight:600;box-shadow:0 12px 30px rgba(0, 0, 0, .4);z-index:6;white-space:nowrap;max-width:calc(100% - 32px);overflow:hidden;text-overflow:ellipsis;}"
};
function cu(e, t) {
	Ue(t, !0), $r(e, su);
	let n = ji(t, "narrow", 7, !1), r = new Fa(t.host), i = /* @__PURE__ */ N(void 0);
	Mi(() => (r.start(), () => r.destroy())), gn(() => {
		r.tab, r.showSlug, r.bookId, r.libKind, U(i)?.scrollTo(0, 0);
	});
	function a(e) {
		n(e);
	}
	function o() {
		return r.destroy();
	}
	let s = (e) => e instanceof HTMLElement && (e.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.tagName)), c = [
		"home",
		"mine",
		"radio",
		"pod",
		"book"
	];
	function l(e) {
		if (e.key === "Escape" && r.pop) {
			r.pop = null, r.popItem = null, e.stopPropagation();
			return;
		}
		if (s(e.target) || e.metaKey || e.ctrlKey || e.altKey || r.shortcuts) return;
		let t = e.target instanceof HTMLElement ? e.target : null, i = t?.closest("button,[role=slider],select,a"), a = r.item, o = () => {
			e.preventDefault(), e.stopPropagation();
		};
		switch (e.key) {
			case " ":
				i || (o(), r.live && r.playing ? r.stop() : r.toggle());
				return;
			case "ArrowLeft":
				if (t?.closest("[role=slider]")) return;
				o(), e.shiftKey ? r.previous() : r.skip(-r.prefs.back);
				return;
			case "ArrowRight":
				if (t?.closest("[role=slider]")) return;
				o(), e.shiftKey ? r.next() : r.skip(r.prefs.fwd);
				return;
			case "ArrowUp":
				if (t?.closest("[role=slider],select")) return;
				o(), r.setVolume(r.volume + .1);
				return;
			case "ArrowDown":
				if (t?.closest("[role=slider],select")) return;
				o(), r.setVolume(r.volume - .1);
				return;
			case "m":
			case "M":
				o(), r.toggleMute();
				return;
			case "r":
			case "R":
				a && a.type !== "radio" && (o(), r.cycleRepeat());
				return;
			case "f":
			case "F":
				a && (o(), r.toggleFavorite(a.id));
				return;
			case "b":
			case "B":
				a?.type === "book" && (o(), r.bookmark(a.id));
				return;
			case "/":
				o(), e.currentTarget.querySelector("header input[type=search]")?.focus();
				return;
			case "?":
				o(), r.shortcuts = !0;
				return;
		}
		/^[1-5]$/.test(e.key) && !n() && (o(), r.tab = c[Number(e.key) - 1], r.setQuery(""), r.tab === "pod" && (r.showSlug = null), r.tab === "book" && (r.bookId = null));
	}
	function u(e) {
		let t = e.target;
		r.pop && !t.closest(".tm-pop,[data-pop]") && (r.pop = null, r.popItem = null);
	}
	var d = {
		setNarrow: a,
		shutdown: o
	}, f = ou(), p = I(f), m = (e) => {
		K(e, ru());
	}, h = (e) => {
		Kl(e, { get store() {
			return r;
		} });
	}, g = (e) => {
		var t = iu(), n = L(t);
		Va(n, { get store() {
			return r;
		} });
		var a = z(n, 2), o = I(a);
		$a(o, { get store() {
			return r;
		} });
		var s = z(o, 2), c = I(s), l = (e) => {
			kc(e, { get store() {
				return r;
			} });
		}, u = /* @__PURE__ */ j(() => r.query.trim()), d = (e) => {
			Oo(e, { get store() {
				return r;
			} });
		}, f = (e) => {
			vs(e, { get store() {
				return r;
			} });
		}, p = (e) => {
			Ts(e, { get store() {
				return r;
			} });
		}, m = (e) => {
			$s(e, { get store() {
				return r;
			} });
		}, h = (e) => {
			xc(e, { get store() {
				return r;
			} });
		};
		J(c, (e) => {
			U(u) ? e(l) : r.tab === "home" ? e(d, 1) : r.tab === "mine" ? e(f, 2) : r.tab === "radio" ? e(p, 3) : r.tab === "pod" ? e(m, 4) : e(h, -1);
		}), k(s), Ai(s, (e) => P(i, e), () => U(i)), ml(z(s, 2), { get store() {
			return r;
		} }), k(a), Nl(z(a, 2), { get store() {
			return r;
		} }), K(e, t);
	};
	J(p, (e) => {
		r.supported ? n() ? e(h, 1) : e(g, -1) : e(m);
	});
	var _ = z(p, 2), v = (e) => {
		Xl(e, {
			get store() {
				return r;
			},
			pos: "right:12px;top:42px;width:290px"
		});
	};
	J(_, (e) => {
		r.pop === "prefs" && e(v);
	});
	var y = z(_, 2), b = (e) => {
		nu(e, { get store() {
			return r;
		} });
	};
	J(y, (e) => {
		r.shortcuts && e(b);
	});
	var x = z(y, 2), S = (e) => {
		var t = au();
		let i;
		var a = R(t, !0);
		B(() => {
			i = X(t, 1, "toast svelte-1n46o8q", null, i, { low: n() }), q(a, r.toast);
		}), K(e, t);
	};
	return J(x, (e) => {
		r.toast && e(S);
	}), k(f), W("keydown", f, l), W("pointerdown", f, u), K(e, f), We(d);
}
br(["keydown", "pointerdown"]);
//#endregion
//#region src/index.ts
var lu = 640;
function uu(e) {
	let t = null, n = null;
	async function r() {
		n?.disconnect(), n = null;
		let e = t;
		if (t = null, e) try {
			await e.shutdown();
		} finally {
			await Br(e);
		}
	}
	return e.onUnmount?.(r), {
		mount(i) {
			let a = i.shadowRoot ?? i.attachShadow({ mode: "open" }), o = document.createElement("div");
			return o.style.cssText = "height:100%;width:100%", a.replaceChildren(o), i.style.display = i.style.display || "block", t = Ir(cu, {
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
export { lu as NARROW_WIDTH, uu as activate };
