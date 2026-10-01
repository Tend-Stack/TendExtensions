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
var h = 1024, g = 2048, _ = 4096, v = 8192, y = 16384, b = 32768, x = 1 << 25, S = 65536, ee = 1 << 19, te = 1 << 20, ne = 1 << 25, re = 65536, ie = 1 << 21, ae = 1 << 22, oe = 1 << 23, se = Symbol("$state"), ce = Symbol("component"), le = Symbol("legacy props"), ue = Symbol(""), de = Symbol("attributes"), fe = Symbol("class"), pe = Symbol("style"), me = Symbol("text"), he = Symbol("form reset"), ge = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), _e = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml"), ve = {}, C = Symbol("uninitialized"), ye = "http://www.w3.org/1999/xhtml";
function be() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function xe(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function Se() {
	console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function Ce() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/hydration.js
var w = !1;
function we(e) {
	w = e;
}
var T;
function E(e) {
	if (e === null) throw xe(), ve;
	return T = e;
}
function Te() {
	return E(/* @__PURE__ */ R(T));
}
function Ee(e) {
	if (w) {
		if (/* @__PURE__ */ R(T) !== null) throw xe(), ve;
		T = e;
	}
}
function De(e = 1) {
	if (w) {
		for (var t = e, n = T; t--;) n = /* @__PURE__ */ R(n);
		T = n;
	}
}
function Oe(e = !0) {
	for (var t = 0, n = T;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ R(n);
		e && n.remove(), n = i;
	}
}
function ke(e) {
	if (!e || e.nodeType !== 8) throw xe(), ve;
	return e.data;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/equality.js
function Ae(e) {
	return e === this.v;
}
function je(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function Me(e) {
	return !je(e, this.v);
}
function Ne(e) {
	throw Error("https://svelte.dev/e/lifecycle_outside_component");
}
//#endregion
//#region node_modules/svelte/src/internal/client/errors.js
function Pe() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function Fe(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function Ie(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function Le() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function Re(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function ze() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Be(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function Ve() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function He() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function Ue() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function We() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
//#endregion
//#region node_modules/svelte/src/internal/client/context.js
var D = null;
function Ge(e) {
	D = e;
}
function Ke(e, t = !1, n) {
	D = {
		p: D,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: G,
		l: null
	};
}
function qe(e) {
	var t = D, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) _n(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, D = t.p, Je(e);
}
function Je(e = {}) {
	return i(e, ce, { value: !0 }), e;
}
function Ye() {
	return !0;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
var Xe = [];
function Ze() {
	var e = Xe;
	Xe = [], f(e);
}
function O(e) {
	if (Xe.length === 0 && !Et) {
		var t = Xe;
		queueMicrotask(() => {
			t === Xe && Ze();
		});
	}
	Xe.push(e);
}
function Qe() {
	for (; Xe.length > 0;) Ze();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/status.js
var $e = ~(g | _ | h);
function k(e, t) {
	e.f = e.f & $e | t;
}
function et(e) {
	e.f & 512 || e.deps === null ? k(e, h) : k(e, _);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function tt(e) {
	if (e !== null) for (let t of e) t.f & 2 && t.f & 65536 && (t.f ^= re, tt(t.deps));
}
function nt(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), tt(e.deps), k(e, h);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/store.js
var rt = !1;
function it(e) {
	var t = rt;
	try {
		return rt = !1, [e(), rt];
	} finally {
		rt = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/misc.js
var at = !1;
function ot() {
	at || (at = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[he]?.();
		});
	}, { capture: !0 }));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function st(e) {
	var t = H, n = G;
	W(null), K(null);
	try {
		return e();
	} finally {
		W(t), K(n);
	}
}
function ct(e, t, n, r = n) {
	e.addEventListener(t, () => st(n));
	let i = e[he];
	e[he] = i ? () => {
		i(), r(!0);
	} : () => r(!0), ot();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/async.js
function lt(e, t, n, r) {
	let i = Ye() ? pt : _t;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = G, c = ut(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				z(e, s);
			}
			dt();
		}
	}
	var d = ft();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ ht(e))).then(u).catch((e) => z(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), dt();
	}) : f();
}
function ut() {
	var e = G, t = H, n = D, r = A;
	return function(i = !0) {
		K(e), W(t), Ge(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function dt(e = !0) {
	K(null), W(null), Ge(null), e && A?.deactivate();
}
function ft() {
	var e = G, t = e.b, n = A, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function pt(e) {
	var t = 2 | g;
	return G !== null && (G.f |= ee), {
		ctx: D,
		deps: null,
		effects: null,
		equals: Ae,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: C,
		wv: 0,
		parent: G,
		ac: null
	};
}
var mt = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function ht(e, t, n) {
	let r = G;
	r === null && Pe();
	var i = void 0, a = Vt(C), o = !H, s = /* @__PURE__ */ new Set();
	return bn(() => {
		var t = G, n = p();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== ge && n.reject(e);
			}).finally(dt);
		} catch (e) {
			n.reject(e), dt();
		}
		var c = A;
		if (o) {
			if (t.f & 32768) var l = ft();
			if (r.b?.is_rendered()) c.async_deriveds.get(t)?.reject(mt);
			else for (let e of s.values()) e.reject(mt);
			s.add(n), c.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), s.delete(n), t !== mt && (c.activate(), t ? (a.f |= oe, Ut(a, t)) : (a.f & 8388608 && (a.f ^= oe), Ut(a, e)), c.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), hn(() => {
		for (let e of s) e.reject(mt);
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
function gt(e) {
	let t = /* @__PURE__ */ pt(e);
	return Rn(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function _t(e) {
	let t = /* @__PURE__ */ pt(e);
	return t.equals = Me, t;
}
function vt(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) V(t[n]);
	}
}
function yt(e) {
	var t, n = G, r = e.parent;
	if (!In && r !== null && e.v !== C && r.f & 24576) return be(), e.v;
	K(r);
	try {
		e.f &= ~re, vt(e), t = qn(e);
	} finally {
		K(n);
	}
	return t;
}
function bt(e) {
	var t = yt(e);
	if (!e.equals(t) && (e.wv = Wn(), (!A?.is_fork || e.deps === null) && (A === null ? e.v = t : (A.capture(e, t, !0), wt?.capture(e, t, !0)), e.deps === null))) {
		k(e, h);
		return;
	}
	In || (j === null ? et(e) : (mn() || A?.is_fork) && j.set(e, t));
}
function xt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && st(() => {
		t.ac.abort(ge), t.ac = null;
	}), t.fn !== null && (t.teardown = d), Xn(t, 0), Tn(t));
}
function St(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && Zn(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var Ct = null, A = null, wt = null, j = null, Tt = null, Et = !1, Dt = !1, Ot = null, kt = null, At = 0, jt = 1, Mt = class e {
	id = jt++;
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
		Ct === null ? Ct = this : (Ct.#n = this, this.#t = Ct), Ct = this;
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
			for (var r of n.d) k(r, g), t(r);
			for (r of n.m) k(r, _), t(r);
		}
		this.#p.add(e);
	}
	#g() {
		this.#e = !0, At++ > 1e3 && (this.#x(), Pt());
		for (let e of this.#u) this.#d.delete(e), k(e, g), this.schedule(e);
		for (let e of this.#d) k(e, _), this.schedule(e);
		let t = this.#c;
		this.#c = [], this.apply();
		var n = Ot = [], r = [], i = kt = [];
		for (let e of t) try {
			this.#_(e, n, r);
		} catch (t) {
			throw Rt(e), this.#h() || this.discard(), t;
		}
		if (A = null, i.length > 0) {
			var a = e.ensure();
			for (let e of i) a.schedule(e);
		}
		if (Ot = null, kt = null, this.#h()) {
			this.#b(r), this.#b(n);
			for (let [e, t] of this.#f) Lt(e, t);
			i.length > 0 && A.#g();
			return;
		}
		let o = this.#v();
		if (o) {
			this.#b(r), this.#b(n), o.#y(this);
			return;
		}
		this.#u.clear(), this.#d.clear();
		for (let e of this.#r) e(this);
		this.#r.clear(), wt = this, Ft(r), Ft(n), wt = null, this.#s?.resolve();
		var s = A;
		if (this.#a === 0 && (this.#c.length === 0 || s !== null) && this.#x(), this.#c.length > 0) {
			if (s !== null) {
				let e = s;
				e.#c.push(...this.#c.filter((t) => !e.#c.includes(t)));
			} else s = this;
		}
		s !== null && (N.clear(), s.#g());
	}
	#_(e, t, n) {
		e.f ^= h;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= h : i & 4 ? t.push(r) : Gn(r) && (i & 16 && this.#d.add(r), Zn(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), k(i, g), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#x(), A = this, this.#g();
	}
	#b(e) {
		for (var t = 0; t < e.length; t += 1) nt(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== C && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), j?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		A = this;
	}
	deactivate() {
		A = null, j = null;
	}
	flush() {
		try {
			Dt = !0, A = this, this.#g();
		} finally {
			At = 0, Tt = null, Ot = null, kt = null, Dt = !1, A = null, j = null, N.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(mt);
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
		this.#m || (this.#m = !0, O(() => {
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
		if (A === null) {
			let t = A = new e();
			!Dt && !Et && O(() => {
				t.#e || t.flush();
			});
		}
		return A;
	}
	apply() {
		j = null;
	}
	schedule(e) {
		if (Tt = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		for (var t = e; t.parent !== null;) {
			t = t.parent;
			var n = t.f;
			if (Ot !== null && t === G && (H === null || !(H.f & 2))) return;
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
			e === null || (e.#n = t), t === null ? Ct = e : t.#t = e, this.linked = !1;
		}
	}
};
function Nt(e) {
	var t = Et;
	Et = !0;
	try {
		var n;
		for (e && (A !== null && !A.is_fork && A.flush(), n = e());;) {
			if (Qe(), A === null) return n;
			A.flush();
		}
	} finally {
		Et = t;
	}
}
function Pt() {
	try {
		ze();
	} catch (e) {
		z(e, Tt);
	}
}
var M = null;
function Ft(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && Gn(r) && (M = /* @__PURE__ */ new Set(), Zn(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && On(r), M?.size > 0)) {
				N.clear();
				for (let e of M) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) M.has(n) && (M.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || Zn(n);
					}
				}
				M.clear();
			}
		}
		M = null;
	}
}
function It(e) {
	A.schedule(e);
}
function Lt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), k(e, h);
		for (var n = e.first; n !== null;) Lt(n, t), n = n.next;
	}
}
function Rt(e) {
	k(e, h);
	for (var t = e.first; t !== null;) Rt(t), t = t.next;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
var zt = /* @__PURE__ */ new Set(), N = /* @__PURE__ */ new Map(), Bt = !1;
function Vt(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: Ae,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function P(e, t) {
	let n = Vt(e, t);
	return Rn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function Ht(e, t = !1, n = !0) {
	let r = Vt(e);
	return t || (r.equals = Me), r;
}
function F(e, t, n = !1) {
	return H !== null && (!U || H.f & 131072) && Ye() && H.f & 4325394 && (q === null || !q.has(e)) && Ue(), Ut(e, n ? qt(t) : t, kt);
}
function Ut(e, t, n = null) {
	if (!e.equals(t)) {
		In ? N.set(e, t) : N.has(e) || N.set(e, e.v);
		var r = Mt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && yt(t), j === null && et(t);
		}
		e.wv = Wn(), Kt(e, g, n), Ye() && G !== null && G.f & 1024 && !(G.f & 96) && (X === null ? zn([e]) : X.push(e)), !r.is_fork && zt.size > 0 && !Bt && Wt();
	}
	return t;
}
function Wt() {
	Bt = !1;
	for (let e of zt) {
		e.f & 1024 && k(e, _);
		let t;
		try {
			t = Gn(e);
		} catch {
			t = !0;
		}
		t && Zn(e);
	}
	zt.clear();
}
function Gt(e) {
	F(e, e.v + 1);
}
function Kt(e, t, n) {
	var r = e.reactions;
	if (r !== null) for (var i = Ye(), a = r.length, o = 0; o < a; o++) {
		var s = r[o], c = s.f;
		if (i || s !== G) {
			var l = (c & g) === 0;
			if (l && k(s, t), c & 131072) zt.add(s);
			else if (c & 2) {
				var u = s;
				j?.delete(u), c & 65536 || (c & 512 && (G === null || !(G.f & 2097152)) && (s.f |= re), Kt(u, _, n));
			} else if (l) {
				var d = s;
				c & 16 && M !== null && M.add(d), n === null ? It(d) : n.push(d);
			}
		}
	}
}
function qt(t) {
	if (typeof t != "object" || !t || se in t || ce in t) return t;
	let n = l(t);
	if (n !== s && n !== c) return t;
	var r = /* @__PURE__ */ new Map(), i = e(t), o = /* @__PURE__ */ P(0), u = null, d = Hn, f = (e) => {
		if (Hn === d) return e();
		var t = H, n = Hn;
		W(null), Un(d);
		var r = e();
		return W(t), Un(n), r;
	};
	return i && r.set("length", /* @__PURE__ */ P(t.length, u)), new Proxy(t, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && Ve();
			var i = r.get(t);
			return i === void 0 ? f(() => {
				var e = /* @__PURE__ */ P(n.value, u);
				return r.set(t, e), e;
			}) : F(i, n.value, !0), !0;
		},
		deleteProperty(e, t) {
			var n = r.get(t);
			if (n === void 0) {
				if (t in e) {
					let e = f(() => /* @__PURE__ */ P(C, u));
					r.set(t, e), Gt(o);
				}
			} else F(n, C), Gt(o);
			return !0;
		},
		get(e, n, i) {
			if (n === se) return t;
			var o = r.get(n), s = n in e;
			if (o === void 0 && (!s || a(e, n)?.writable) && (o = f(() => /* @__PURE__ */ P(qt(s ? e[n] : C), u)), r.set(n, o)), o !== void 0) {
				var c = Z(o);
				return c === C ? void 0 : c;
			}
			return Reflect.get(e, n, i);
		},
		getOwnPropertyDescriptor(e, t) {
			var n = Reflect.getOwnPropertyDescriptor(e, t);
			if (n && "value" in n) {
				var i = r.get(t);
				i && (n.value = Z(i));
			} else if (n === void 0) {
				var a = r.get(t), o = a?.v;
				if (a !== void 0 && o !== C) return {
					enumerable: !0,
					configurable: !0,
					value: o,
					writable: !0
				};
			}
			return n;
		},
		has(e, t) {
			if (t === se) return !0;
			var n = r.get(t), i = n !== void 0 && n.v !== C || Reflect.has(e, t);
			return (n !== void 0 || G !== null && (!i || a(e, t)?.writable)) && (n === void 0 && (n = f(() => /* @__PURE__ */ P(i ? qt(e[t]) : C, u)), r.set(t, n)), Z(n) === C) ? !1 : i;
		},
		set(e, t, n, s) {
			var c = r.get(t), l = t in e;
			if (i && t === "length") for (var d = n; d < c.v; d += 1) {
				var p = r.get(d + "");
				p === void 0 ? d in e && (p = f(() => /* @__PURE__ */ P(C, u)), r.set(d + "", p)) : F(p, C);
			}
			if (c === void 0) (!l || a(e, t)?.writable) && (c = f(() => /* @__PURE__ */ P(void 0, u)), F(c, qt(n)), r.set(t, c));
			else {
				l = c.v !== C;
				var m = f(() => qt(n));
				F(c, m);
			}
			var h = Reflect.getOwnPropertyDescriptor(e, t);
			if (h?.set && h.set.call(s, n), !l) {
				if (i && typeof t == "string") {
					var g = r.get("length"), _ = Number(t);
					Number.isInteger(_) && _ >= g.v && F(g, _ + 1);
				}
				Gt(o);
			}
			return !0;
		},
		ownKeys(e) {
			Z(o);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = r.get(e);
				return t === void 0 || t.v !== C;
			});
			for (var [n, i] of r) i.v !== C && !(n in e) && t.push(n);
			return t;
		},
		setPrototypeOf() {
			He();
		}
	});
}
function Jt(e) {
	try {
		if (typeof e == "object" && e && se in e) return e[se];
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
		Qt = a(t, "firstChild").get, $t = a(t, "nextSibling").get, u(e) && (e[fe] = void 0, e[de] = null, e[pe] = void 0, e.__e = void 0), u(n) && (n[me] = void 0);
	}
}
function I(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function L(e) {
	return Qt.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function R(e) {
	return $t.call(e);
}
function tn(e, t) {
	if (!w) return /* @__PURE__ */ L(e);
	var n = /* @__PURE__ */ L(T);
	if (n === null) n = T.appendChild(I());
	else if (t && n.nodeType !== 3) {
		var r = I();
		return n?.before(r), E(r), r;
	}
	return t && ln(n), E(n), n;
}
function nn(e, t = !1) {
	if (!w) {
		var n = /* @__PURE__ */ L(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ R(n) : n;
	}
	if (t) {
		if (T?.nodeType !== 3) {
			var r = I();
			return T?.before(r), E(r), r;
		}
		ln(T);
	}
	return T;
}
function rn(e, t = !1) {
	if (!w) return /* @__PURE__ */ L(e);
	var n = tn(e, t);
	return Ee(e), n;
}
function an(e, t = 1, n = !1) {
	let r = w ? T : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ R(r);
	if (!w) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = I();
			return r === null ? i?.after(a) : r.before(a), E(a), a;
		}
		ln(r);
	}
	return E(r), r;
}
function on(e) {
	e.textContent = "";
}
function sn() {
	return !1;
}
function cn(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function ln(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
function un(e) {
	var t = G;
	if (t === null) return H.f |= oe, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	z(e, t);
}
function z(e, t) {
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
	G === null && (H === null && Re(e), Le()), In && Ie(e);
}
function fn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function pn(e, t) {
	var n = G;
	n !== null && n.f & 8192 && (e |= v);
	var r = {
		ctx: D,
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
	A?.register_created_effect(r);
	var i = r;
	if (e & 4) Ot === null ? Mt.ensure().schedule(r) : Ot.push(r);
	else if (t !== null) {
		try {
			Zn(r);
		} catch (e) {
			throw V(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= S));
	}
	if (i !== null && (i.parent = n, n !== null && fn(i, n), H !== null && H.f & 2 && !(e & 64))) {
		var a = H;
		(a.effects ??= []).push(i);
	}
	return r;
}
function mn() {
	return H !== null && !U;
}
function hn(e) {
	let t = pn(8, null);
	return k(t, h), t.teardown = e, t;
}
function gn(e) {
	dn("$effect");
	var t = G.f;
	if (!H && t & 32 && D !== null && !D.i) {
		var n = D;
		(n.e ??= []).push(e);
	} else return _n(e);
}
function _n(e) {
	return pn(4 | te, e);
}
function vn(e) {
	Mt.ensure();
	let t = pn(64 | ee, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? kn(t, () => {
			V(t), n(void 0);
		}) : (V(t), n(void 0));
	});
}
function yn(e) {
	return pn(4, e);
}
function bn(e) {
	return pn(ae | ee, e);
}
function xn(e, t = 0) {
	return pn(8 | t, e);
}
function Sn(e, t = [], n = [], r = []) {
	lt(r, t, n, (t) => {
		pn(8, () => {
			e(...t.map(Z));
		});
	});
}
function Cn(e, t = 0) {
	return pn(16 | t, e);
}
function B(e) {
	return pn(32 | ee, e);
}
function wn(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = In, r = H;
		Ln(!0), W(null);
		try {
			t.call(null);
		} catch (t) {
			z(t, e.parent);
		} finally {
			Ln(n), W(r);
		}
	}
}
function Tn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && st(() => {
			e.abort(ge);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : V(n, t), n = r;
	}
}
function En(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || V(t), t = n;
	}
}
function V(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Dn(e.nodes.start, e.nodes.end), n = !0), e.f |= x, Tn(e, t && !n), Xn(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	wn(e), e.f ^= x, e.f |= y;
	var i = e.parent;
	i !== null && i.first !== null && On(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Dn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ R(e);
		e.remove(), e = n;
	}
}
function On(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function kn(e, t, n = !0) {
	var r = [];
	e.f |= 256, An(e, r, !0);
	var i = () => {
		n && V(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function An(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= v;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				An(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function jn(e) {
	e.f &= -257, Mn(e, !0);
}
function Mn(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= v, e.f & 1024 || (k(e, g), Mt.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			Mn(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function Nn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ R(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var Pn = null, Fn = !1, In = !1;
function Ln(e) {
	In = e;
}
var H = null, U = !1;
function W(e) {
	H = e;
}
var G = null;
function K(e) {
	G = e;
}
var q = null;
function Rn(e) {
	H !== null && (q ??= /* @__PURE__ */ new Set()).add(e);
}
var J = null, Y = 0, X = null;
function zn(e) {
	X = e;
}
var Bn = 1, Vn = 0, Hn = Vn;
function Un(e) {
	Hn = e;
}
function Wn() {
	return ++Bn;
}
function Gn(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 2 && (e.f &= ~re), t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (Gn(a) && bt(a), a.wv > e.wv) return !0;
		}
		t & 512 && j === null && k(e, h);
	}
	return !1;
}
function Kn(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(q !== null && q.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? Kn(a, t, !1) : t === a && (n ? k(a, g) : a.f & 1024 && k(a, _), It(a));
	}
}
function qn(e) {
	var t = J, n = Y, r = X, i = H, a = q, o = D, s = U, c = Hn, l = e.f;
	J = null, Y = 0, X = null, H = l & 96 ? null : e, q = null, Ge(e.ctx), U = !1, Hn = ++Vn, e.ac !== null && (st(() => {
		e.ac.abort(ge);
	}), e.ac = null);
	try {
		e.f |= ie;
		var u = e.fn, d = u();
		e.f |= b;
		var f = Jn(e);
		if (Ye() && X !== null && !U && f !== null && !(e.f & 6146)) for (var p = 0; p < X.length; p++) Kn(X[p], e);
		if (i !== null && i !== e) {
			if (Vn++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = Vn;
			if (t !== null) for (let e of t) e.rv = Vn;
			X !== null && (r === null ? r = X : r.push(...X));
		}
		return e.f & 8388608 && (e.f ^= oe), d;
	} catch (t) {
		return Jn(e), un(t);
	} finally {
		e.f ^= ie, J = t, Y = n, X = r, H = i, q = a, Ge(o), U = s, Hn = c;
	}
}
function Jn(e) {
	var t = e.deps, n = A?.is_fork;
	if (J !== null) {
		var r;
		if (n || Xn(e, Y), t !== null && Y > 0) for (t.length = Y + J.length, r = 0; r < J.length; r++) t[Y + r] = J[r];
		else e.deps = t = J;
		if (mn() && e.f & 512) for (r = Y; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && Y < t.length && (Xn(e, Y), t.length = Y);
	return t;
}
function Yn(e, r) {
	let i = r.reactions;
	if (i !== null) {
		var a = t.call(i, e);
		if (a !== -1) {
			var o = i.length - 1;
			o === 0 ? i = r.reactions = null : (i[a] = i[o], i.pop());
		}
	}
	if (i === null && r.f & 2 && (J === null || !n.call(J, r))) {
		var s = r;
		s.f & 512 && (s.f ^= 512, s.f &= ~re), s.v !== C && et(s), s.ac !== null && st(() => {
			s.ac.abort(ge), s.ac = null, k(s, g);
		}), xt(s), Xn(s, 0);
	}
}
function Xn(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) Yn(e, n[r]);
}
function Zn(e) {
	var t = e.f;
	if (!(t & 16384)) {
		k(e, h);
		var n = G, r = Fn;
		G = e, Fn = !(t & 96);
		try {
			t & 16777232 ? En(e) : Tn(e), wn(e);
			var i = qn(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = Bn;
		} finally {
			Fn = r, G = n;
		}
	}
}
async function Qn() {
	await Promise.resolve(), Nt();
}
function Z(e) {
	var t = !!(e.f & 2);
	if (Pn?.add(e), H !== null && !U && !(G !== null && G.f & 16384) && (q === null || !q.has(e))) {
		var r = H.deps;
		if (H.f & 2097152) e.rv < Vn && (e.rv = Vn, J === null && r !== null && r[Y] === e ? Y++ : J === null ? J = [e] : J.push(e));
		else {
			H.deps ??= [], n.call(H.deps, e) || H.deps.push(e);
			var i = e.reactions;
			i === null ? e.reactions = [H] : n.call(i, H) || i.push(H);
		}
	}
	if (In && N.has(e)) return N.get(e);
	if (t) {
		var a = e;
		if (In) {
			var o = a.v;
			return (!(a.f & 1024) && a.reactions !== null || er(a)) && (o = yt(a)), N.set(a, o), o;
		}
		var s = !(a.f & 512) && !U && H !== null && (Fn || !!(H.f & 512)), c = (a.f & b) === 0;
		Gn(a) && (s && (a.f |= 512), bt(a)), s && !c && (St(a), $n(a));
	}
	if (j?.has(e)) return j.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function $n(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (St(t), $n(t));
}
function er(e) {
	if (e.v === C) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (N.has(t) || t.f & 2 && er(t)) return !0;
	return !1;
}
function tr(e) {
	var t = U;
	try {
		return U = !0, e();
	} finally {
		U = t;
	}
}
function nr(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (se in e) rr(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && se in n && rr(n);
		}
	}
}
function rr(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			rr(e[n], t);
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
var ir = ["touchstart", "touchmove"];
function ar(e) {
	return ir.includes(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dev/css.js
var or = Symbol("events"), sr = /* @__PURE__ */ new Set(), cr = /* @__PURE__ */ new Set();
function lr(e) {
	if (!w) return;
	e.removeAttribute("onload"), e.removeAttribute("onerror");
	let t = e.__e;
	t !== void 0 && (e.__e = void 0, queueMicrotask(() => {
		e.isConnected && e.dispatchEvent(t);
	}));
}
function ur(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || gr.call(t, e), !e.cancelBubble) return st(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? O(() => {
		t.addEventListener(e, i, r);
	}) : t.addEventListener(e, i, r), i;
}
function dr(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = ur(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && hn(() => {
		t.removeEventListener(e, o, a);
	});
}
function fr(e, t, n) {
	(t[or] ??= {})[e] = n;
}
function pr(e) {
	for (var t = 0; t < e.length; t++) sr.add(e[t]);
	for (var n of cr) n(e);
}
var mr = null, hr = !1;
function gr(e) {
	var t = this, n = t.ownerDocument, r = e.type, a = e.composedPath?.() || [], o = a[0] || e.target;
	mr = e, hr || (hr = !0, setTimeout(() => {
		hr = !1, mr = null;
	}));
	var s = 0, c = mr === e && e[or];
	if (c) {
		var l = a.indexOf(c);
		if (l !== -1 && (t === document || t === window)) {
			e[or] = t;
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
		var d = H, f = G;
		W(null), K(null);
		try {
			for (var p, m = []; o !== null && o !== t;) {
				try {
					var h = o[or]?.[r];
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
			e[or] = t, delete e.currentTarget, W(d), K(f);
		}
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/reconciler.js
var _r = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function vr(e) {
	return _r?.createHTML(e) ?? e;
}
function yr(e) {
	var t = cn("template");
	return t.innerHTML = vr(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
function Q(e, t) {
	var n = G;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function br(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i, a = !e.startsWith("<!>");
	return () => {
		if (w) return Q(T, null), T;
		i === void 0 && (i = yr(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ L(i)));
		var t = r || Zt ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ L(t), s = t.lastChild;
			Q(o, s);
		} else Q(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function xr(e, t, n = "svg") {
	var r = !e.startsWith("<!>"), i = !!(t & 1), a = `<${n}>${r ? e : "<!>" + e}</${n}>`, o;
	return () => {
		if (w) return Q(T, null), T;
		if (!o) {
			var e = /* @__PURE__ */ L(yr(a));
			if (i) for (o = document.createDocumentFragment(); /* @__PURE__ */ L(e);) o.appendChild(/* @__PURE__ */ L(e));
			else o = /* @__PURE__ */ L(e);
		}
		var t = o.cloneNode(!0);
		if (i) {
			var n = /* @__PURE__ */ L(t), r = t.lastChild;
			Q(n, r);
		} else Q(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Sr(e, t) {
	return /* @__PURE__ */ xr(e, t, "svg");
}
function Cr(e = "") {
	if (!w) {
		var t = I(e + "");
		return Q(t, t), t;
	}
	var n = T;
	return n.nodeType === 3 ? ln(n) : (n.before(n = I()), E(n)), Q(n, n), n;
}
function wr() {
	if (w) return Q(T, null), T;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = I();
	return e.append(t, n), Q(t, n), e;
}
function Tr(e, t) {
	if (w) {
		var n = G;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = T), Te();
		return;
	}
	e !== null && e.before(t);
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function Er(e) {
	let t = 0, n = Vt(0), r;
	return () => {
		mn() && (Z(n), xn(() => (t === 0 && (r = tr(() => e(() => Gt(n)))), t += 1, () => {
			O(() => {
				--t, t === 0 && (r?.(), r = void 0, Gt(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var Dr = S | ee;
function Or(e, t, n, r) {
	new kr(e, t, n, r);
}
var kr = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = w ? T : null;
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
	#h = Er(() => (this.#m = Vt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = G;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = G.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = Cn(() => {
			if (w) {
				let e = this.#t;
				Te();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, Dr), w && (this.#e = T);
	}
	#g() {
		try {
			this.#a = B(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		O(r), t && (this.#s = B(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			if (t) {
				Ce();
				return;
			}
			t = !0, n && We(), this.#s !== null && kn(this.#s, () => {
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
					z(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = B(() => e(this.#e)), O(() => {
			var e = this.#c = document.createDocumentFragment(), t = I(), n = !1;
			if (e.append(t), this.#a = this.#S(() => {
				try {
					return B(() => this.#r(t));
				} catch (e) {
					try {
						this.error(e), n = !0;
					} catch (e) {
						z(e, this.#i.parent);
					}
					return null;
				}
			}), this.#a === null) {
				this.#c = null, n && this.#x(A);
				return;
			}
			this.#u === 0 && (this.#e.before(e), this.#c = null, kn(this.#o, () => {
				this.#o = null;
			}), this.#x(A));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = B(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				Nn(this.#a, e);
				let t = this.#n.pending;
				this.#o = B(() => t(this.#e));
			} else this.#x(A);
		} catch (e) {
			this.error(e);
		}
	}
	#x(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		nt(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#S(e) {
		var t = G, n = H, r = D;
		K(this.#i), W(this.#i), Ge(this.#i.ctx);
		try {
			return Mt.ensure(), e();
		} finally {
			K(t), W(n), Ge(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && kn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, O(() => {
			this.#d = !1, this.#m && Ut(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), Z(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		A?.is_fork ? (this.#a && A.skip_effect(this.#a), this.#o && A.skip_effect(this.#o), this.#s && A.skip_effect(this.#s), A.oncommit(() => {
			this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (V(this.#a), null), this.#o &&= (V(this.#o), null), this.#s &&= (V(this.#s), null), w && (E(this.#t), De(), E(Oe()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return B(() => {
						var r = G;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return z(e, this.#i.parent), null;
				}
			}));
		};
		O(() => {
			var t;
			try {
				t = this.transform_error(e);
			} catch (e) {
				z(e, this.#i && this.#i.parent);
				return;
			}
			typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => z(e, this.#i && this.#i.parent)) : n(t);
		});
	}
};
function Ar(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[me] ??= e.nodeValue) && (e[me] = n, e.nodeValue = `${n}`);
}
function jr(e, t) {
	return Nr(e, t);
}
var Mr = /* @__PURE__ */ new Map();
function Nr(e, { target: t, anchor: n, props: i = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	en();
	var l = void 0, u = vn(() => {
		var s = n ?? t.appendChild(I());
		Or(s, { pending: () => {} }, (t) => {
			Ke({});
			var n = D;
			if (o && (n.c = o), a && (i.$$events = a), w && Q(t, null), l = e(t, i) || Je(), w && (G.nodes.end = T, T === null || T.nodeType !== 8 || T.data !== "]")) throw xe(), ve;
			qe();
		}, c);
		var u = /* @__PURE__ */ new Set(), d = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!u.has(r)) {
					u.add(r);
					var i = ar(r);
					for (let e of [t, document]) {
						var a = Mr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Mr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, gr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return d(r(sr)), cr.add(d), () => {
			for (var e of u) for (let n of [t, document]) {
				var r = Mr.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, gr), r.delete(e), r.size === 0 && Mr.delete(n)) : r.set(e, i);
			}
			cr.delete(d), s !== n && s.parentNode?.removeChild(s);
		};
	});
	return Pr.set(l, u), l;
}
var Pr = /* @__PURE__ */ new WeakMap();
function Fr(e, t) {
	let n = Pr.get(e);
	return n ? (Pr.delete(e), n(t)) : Promise.resolve();
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/branches.js
var Ir = class {
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
			if (n) jn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (jn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (V(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						Nn(r, t), t.append(I()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else V(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), kn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (V(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = A, r = sn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) {
			if (r) {
				var i = document.createDocumentFragment(), a = I();
				i.append(a), this.#n.set(e, {
					effect: B(() => t(a)),
					fragment: i
				});
			} else this.#t.set(e, B(() => t(this.anchor)));
		}
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else w && (this.anchor = T), this.#a(n);
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/if.js
function Lr(e, t, n = !1) {
	var r;
	w && (r = T, Te());
	var i = new Ir(e), a = n ? S : 0;
	function o(e, t) {
		if (w) {
			var n = ke(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Oe();
				E(a), i.anchor = a, we(!1), i.ensure(e, t), we(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	Cn(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/key.js
var Rr = Symbol("NaN");
function zr(e, t, n) {
	w && Te();
	var r = new Ir(e), i = !Ye();
	Cn(() => {
		var e = t();
		e !== e && (e = Rr), i && typeof e == "object" && e && (e = {}), r.ensure(e, n);
	});
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/each.js
function Br(e, t) {
	return t;
}
function Vr(e, t, n) {
	for (var i = [], a = t.length, o, s = t.length, c = 0; c < a; c++) {
		let n = t[c];
		kn(n, () => {
			if (o) {
				if (o.pending.delete(n), o.done.add(n), o.pending.size === 0) {
					var t = e.outrogroups;
					Hr(e, r(o.done)), t.delete(o), t.size === 0 && (e.outrogroups = null);
				}
			} else --s;
		}, !1);
	}
	if (s === 0) {
		var l = i.length === 0 && n !== null && e.pending.size === 0;
		if (l) {
			var u = n, d = u.parentNode;
			on(d), d.append(u), e.items.clear();
		}
		Hr(e, t, !l);
	} else o = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(o);
}
function Hr(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= ne, Nn(a, document.createDocumentFragment())) : V(t[i], n);
	}
}
var Ur;
function Wr(t, n, i, a, o, s = null) {
	var c = t, l = /* @__PURE__ */ new Map();
	if (n & 4) {
		var u = t;
		c = w ? E(/* @__PURE__ */ L(u)) : u.appendChild(I());
	}
	w && Te();
	var d = null, f = /* @__PURE__ */ _t(() => {
		var t = i();
		return e(t) ? t : t == null ? [] : r(t);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, Kr(v, p, c, n, a), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= ne, Jr(d, null, c)) : jn(d) : kn(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: Cn(() => {
			p = Z(f);
			var e = p.length;
			let t = !1;
			w && ke(c) === "[!" != (e === 0) && (c = Oe(), E(c), we(!1), t = !0);
			for (var r = /* @__PURE__ */ new Set(), u = A, v = sn(), y = 0; y < e; y += 1) {
				w && T.nodeType === 8 && T.data === "]" && (c = T, t = !0, we(!1));
				var b = p[y], x = a(b, y), S = h ? null : l.get(x);
				S ? (S.v && Ut(S.v, b), S.i && Ut(S.i, y), v && u.unskip_effect(S.e)) : (S = qr(l, h ? c : Ur ??= I(), b, x, y, o, n, i), h || (S.e.f |= ne), l.set(x, S)), r.add(x);
			}
			if (e === 0 && s && !d && (h ? d = B(() => s(c)) : (d = B(() => s(Ur ??= I())), d.f |= ne)), e > r.size && Fe("", "", ""), w && e > 0 && E(Oe()), !h) {
				if (m.set(u, r), v) {
					for (let [e, t] of l) r.has(e) || u.skip_effect(t.e);
					u.oncommit(g), u.ondiscard(_);
				} else g(u);
			}
			t && we(!0), Z(f);
		}),
		flags: n,
		items: l,
		pending: m,
		outrogroups: null,
		fallback: d
	};
	h = !1, w && (c = T);
}
function Gr(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function Kr(e, t, n, i, a) {
	var o = !!(i & 8), s = t.length, c = e.items, l = Gr(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (o) for (v = 0; v < s; v += 1) h = t[v], g = a(h, v), _ = c.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < s; v += 1) {
		if (h = t[v], g = a(h, v), _ = c.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (jn(_), o && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) {
			if (_.f ^= ne, _ === l) Jr(_, null, n);
			else {
				var y = d ? d.next : l;
				_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), Yr(e, d, _), Yr(e, _, y), Jr(_, y, n), d = _, p = [], m = [], l = Gr(d.next);
				continue;
			}
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], ee = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) Jr(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					Yr(e, S.prev, ee.next), Yr(e, d, S), Yr(e, ee, b), l = b, d = ee, --v, p = [], m = [];
				} else u.delete(_), Jr(_, l, n), Yr(e, _.prev, _.next), Yr(e, _, d === null ? e.effect.first : d.next), Yr(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = Gr(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = Gr(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (Hr(e, r(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var te = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || te.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && te.push(l), l = Gr(l.next);
		var re = te.length;
		if (re > 0) {
			var ie = i & 4 && s === 0 ? n : null;
			if (o) {
				for (v = 0; v < re; v += 1) te[v].nodes?.a?.measure();
				for (v = 0; v < re; v += 1) te[v].nodes?.a?.fix();
			}
			Vr(e, te, ie);
		}
	}
	o && O(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function qr(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Vt(n) : /* @__PURE__ */ Ht(n, !1, !1) : null, l = o & 2 ? Vt(i) : null;
	return {
		v: c,
		i: l,
		e: B(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function Jr(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ R(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function Yr(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/snippet.js
function Xr(e, t, ...n) {
	var r = new Ir(e);
	Cn(() => {
		let e = t() ?? null;
		r.ensure(e, e && ((t) => e(t, ...n)));
	}, S);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/css.js
function Zr(e, t) {
	yn(() => {
		e = G?.parent?.nodes?.start ?? e;
		var n = e.getRootNode(), r = n.host ? n : n.head ?? n.ownerDocument.head;
		if (!r.querySelector("#" + t.hash)) {
			let e = cn("style");
			e.id = t.hash, e.textContent = t.code, r.appendChild(e);
		}
	});
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/actions.js
function Qr(e, t, n) {
	yn(() => {
		var r = tr(() => t(e, n?.()) || {});
		if (n && r?.update) {
			var i = !1, a = {};
			xn(() => {
				var e = n();
				nr(e), i && je(a, e) && (a = e, r.update(e));
			}), i = !0;
		}
		if (r?.destroy) return () => r.destroy();
	});
}
//#endregion
//#region node_modules/svelte/src/internal/shared/attributes.js
var $r = [..." 	\n\r\f\xA0\v﻿"];
function ei(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || $r.includes(r[o - 1])) && (s === r.length || $r.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
function ti(e, t = !1) {
	var n = t ? " !important;" : ";", r = "";
	for (var i of Object.keys(e)) {
		var a = e[i];
		a != null && a !== "" && (r += " " + i + ": " + a + n);
	}
	return r;
}
function ni(e) {
	return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function ri(e, t) {
	if (t) {
		var n = "", r, i;
		if (Array.isArray(t) ? (r = t[0], i = t[1]) : r = t, e) {
			e = String(e).replaceAll(/\/\*.*?\*\//g, "").trim();
			var a = !1, o = 0, s = !1, c = [];
			r && c.push(...Object.keys(r).map(ni)), i && c.push(...Object.keys(i).map(ni));
			var l = 0, u = -1;
			let t = e.length;
			for (var d = 0; d < t; d++) {
				var f = e[d];
				if (s ? f === "/" && e[d - 1] === "*" && (s = !1) : a ? a === f && (a = !1) : f === "/" && e[d + 1] === "*" ? s = !0 : f === "\"" || f === "'" ? a = f : f === "(" ? o++ : f === ")" && o--, !s && a === !1 && o === 0) {
					if (f === ":" && u === -1) u = d;
					else if (f === ";" || d === t - 1) {
						if (u !== -1) {
							var p = ni(e.substring(l, u).trim());
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
		return r && (n += ti(r)), i && (n += ti(i, !0)), n = n.trim(), n === "" ? null : n;
	}
	return e == null ? null : String(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/class.js
function ii(e, t, n, r, i, a) {
	var o = e[fe];
	if (w || o !== n || o === void 0) {
		var s = ei(n, r, a);
		(!w || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[fe] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/style.js
function ai(e, t = {}, n, r) {
	for (var i in n) {
		var a = n[i];
		t[i] !== a && (n[i] == null ? e.style.removeProperty(i) : e.style.setProperty(i, a, r));
	}
}
function oi(e, t, n, r) {
	var i = e[pe];
	if (w || i !== t) {
		var a = ri(t, r);
		(!w || a !== e.getAttribute("style")) && (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[pe] = t;
	} else r && (Array.isArray(r) ? (ai(e, n?.[0], r[0]), ai(e, n?.[1], r[1], "important")) : ai(e, n, r));
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function si(e, t) {
	t ? e.hasAttribute("selected") || e.setAttribute("selected", "") : e.removeAttribute("selected");
}
function ci(t, n) {
	var r = t.__defaultValue, i = t.multiple, a = i ? r ?? [] : null;
	if (!i || e(a)) {
		var o = t.selectedIndex, s = n && i ? new Set(t.selectedOptions) : null;
		for (var c of t.options) {
			var l = fi(c);
			si(c, i ? a.includes(l) : Yt(l, r));
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
function li(t, n, r = !1) {
	if (t.multiple) {
		if (n == null) return;
		if (!e(n)) return Se();
		for (var i of t.options) i.selected = n.includes(fi(i));
		return;
	}
	for (i of t.options) if (Yt(fi(i), n)) {
		i.selected = !0;
		return;
	}
	(!r || n !== void 0) && (t.selectedIndex = -1);
}
function ui(e) {
	var t = new MutationObserver((t) => {
		t.every(pi) || ("__defaultValue" in e && ci(e, !1), "__value" in e && li(e, e.__value));
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
function di(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet(), i = !0;
	ct(e, "change", (t) => {
		var i = t ? "[selected]" : ":checked", a;
		if (e.multiple) a = [].map.call(e.querySelectorAll(i), fi);
		else {
			var o = e.querySelector(i) ?? e.querySelector("option:not([disabled])");
			a = o && fi(o);
		}
		n(a), e.__value = a, A !== null && r.add(A);
	}), yn(() => {
		var a = t();
		if (e === document.activeElement) {
			var o = A;
			if (r.has(o)) return;
		}
		if (li(e, a, i), i && a === void 0) {
			var s = e.querySelector(":checked");
			s !== null && (a = fi(s), n(a));
		}
		e.__value = a, i = !1;
	});
}
function fi(e) {
	return "__value" in e ? e.__value : e.value;
}
function pi(e) {
	if (e.target.closest("selectedcontent") !== null) return !0;
	if (e.type === "childList") {
		var t = [...e.addedNodes, ...e.removedNodes];
		return t.length > 0 && t.every((e) => e.nodeName === "SELECTEDCONTENT");
	}
	return !1;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attributes.js
var mi = Symbol("is custom element"), hi = Symbol("is html"), gi = _e ? "link" : "LINK", _i = _e ? "progress" : "PROGRESS";
function vi(e) {
	if (w) {
		var t = !1, n = () => {
			if (!t) {
				if (t = !0, e.hasAttribute("value")) {
					var n = e.value;
					xi(e, "value", null), e.value = n;
				}
				if (e.hasAttribute("checked")) {
					var r = e.checked;
					xi(e, "checked", null), e.checked = r;
				}
			}
		};
		e[he] = n, O(n), ot();
	}
}
function yi(e, t) {
	var n = Si(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === _i) && (e.value = t ?? "");
}
function bi(e, t) {
	var n = Si(e);
	n.checked !== (n.checked = t ?? void 0) && (e.checked = t);
}
function xi(e, t, n, r) {
	var i = Si(e);
	w && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === gi) || i[t] !== (i[t] = n) && (t === "loading" && (e[ue] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && wi(e).has(t) ? e[t] = n : e.setAttribute(t, n));
}
function Si(e) {
	return e[de] ??= {
		[mi]: e.nodeName.includes("-"),
		[hi]: e.namespaceURI === ye
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
	ct(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = Di(e) ? Oi(a) : a, n(a), A !== null && r.add(A), await Qn(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (w && e.defaultValue !== e.value || tr(t) == null && e.value) && (n(Di(e) ? Oi(e.value) : e.value), A !== null && r.add(A)), xn(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = A;
			if (r.has(i)) return;
		}
		Di(e) && n === Oi(e.value) || (e.type !== "date" || n || e.value) && n !== e.value && (e.value = n ?? "");
	});
}
function Ei(e, t, n = t) {
	ct(e, "change", (t) => {
		n(t ? e.defaultChecked : e.checked);
	}), (w && e.defaultChecked !== e.checked || tr(t) == null) && n(e.checked), xn(() => {
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
var ki = /* @__PURE__ */ new class e {
	#e = /* @__PURE__ */ new WeakMap();
	#t;
	#n;
	static entries = /* @__PURE__ */ new WeakMap();
	constructor(e) {
		this.#n = e;
	}
	observe(e, t) {
		var n = this.#e.get(e) || /* @__PURE__ */ new Set();
		return n.add(t), this.#e.set(e, n), this.#r().observe(e, this.#n), () => {
			var n = this.#e.get(e);
			n.delete(t), n.size === 0 && (this.#e.delete(e), this.#t.unobserve(e));
		};
	}
	#r() {
		return this.#t ??= new ResizeObserver((t) => {
			for (var n of t) {
				e.entries.set(n.target, n);
				for (var r of this.#e.get(n.target) || []) r(n);
			}
		});
	}
}({ box: "border-box" });
function Ai(e, t, n) {
	var r = ki.observe(e, () => n(e[t]));
	yn(() => (tr(() => n(e[t])), r));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function ji(e, t) {
	return e === t || e?.[se] === t;
}
function Mi(e = Je(), t, n, r) {
	var i = D.r, a = G;
	return yn(() => {
		var o, s;
		return xn(() => {
			o = s, s = r?.() || [], tr(() => {
				ji(n(...s), e) || (t(e, ...s), o && ji(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && ji(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function Ni(e, t, n, r) {
	var i = !0, o = !!(n & 8), s = !!(n & 16), c = r, l = !0, u = void 0, d = () => s && i ? (u ??= /* @__PURE__ */ pt(r), Z(u)) : (l && (l = !1, c = s ? tr(r) : r), c);
	let f;
	if (o) {
		var p = se in e || le in e;
		f = a(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	o ? [m, h] = it(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && Be(t), f(m)));
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
	var v = !1, y = (n & 1 ? pt : _t)(() => (v = !1, g()));
	o && Z(y);
	var b = G;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? Z(y) : i && o ? qt(e) : e;
			return F(y, n), v = !0, c !== void 0 && (c = n), e;
		}
		return In && v || b.f & 16384 ? y.v : Z(y);
	});
}
function Pi(e) {
	D === null && Ne("onMount"), gn(() => {
		let t = tr(e);
		if (typeof t == "function") return t;
	});
}
//#endregion
//#region node_modules/svelte/src/internal/disclose-version.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
//#endregion
//#region src/catalog.ts
var Fi = {
	podcast: "Podcast",
	book: "Audiobook",
	radio: "Radio"
}, Ii = (e) => e.type !== "radio", Li = (e) => e.type === "podcast" ? `show:${e.show}` : e.id, Ri = [
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
], zi = (e) => Ri[e] ?? String(e + 1), Bi = (e) => {
	let t = 0;
	for (let n of e) t = t * 31 + n.charCodeAt(0) >>> 0;
	return t % 360;
}, Vi = (e) => {
	let t = e.replace(/^(the|a|an|el|la|los|las|o|os|as)\s+/i, "").split(/[\s:·\-–—]+/).filter((e) => /[\p{L}\p{N}]/u.test(e));
	return (t.length > 1 ? t[0][0] + t[1][0] : (t[0] ?? "?").slice(0, 2)).toUpperCase();
}, $ = (e) => typeof e == "string" ? e : "", Hi = (e) => typeof e == "number" && Number.isFinite(e) ? e : 0, Ui = (e) => {
	let t = $(e);
	return t.startsWith("https://") ? t : "";
}, Wi = (e) => Array.isArray(e) ? e.filter((e) => !!e && typeof e == "object") : [], Gi = (e, t = /* @__PURE__ */ new Date()) => {
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
function Ki(e) {
	let t = $(e.id), n = $(e.name), r = Ui(e.stream_url);
	if (!t || !n || !r || e.playable === !1) return null;
	let i = [$(e.city), $(e.region) || $(e.country)].filter(Boolean).join(", "), a = $(e.genre).split(/[,/]/)[0]?.trim() || "Radio";
	return {
		id: `st:${t}`,
		type: "radio",
		stationId: t,
		title: n,
		url: r,
		genre: a,
		sub: [i || $(e.country), a].filter(Boolean).join(" · "),
		onair: "Live",
		hue: Bi(t),
		mark: Vi(n),
		art: Ui(e.logo_url) || void 0
	};
}
function qi(e) {
	let t = $(e.slug), n = $(e.title);
	return !t || !n ? null : {
		slug: t,
		id: $(e.id),
		title: n,
		author: $(e.author),
		desc: $(e.description),
		art: Ui(e.image_url) || void 0,
		hue: Bi(t),
		mark: Vi(n),
		category: $(e.category),
		episodes: Hi(e.episode_count)
	};
}
function Ji(e, t) {
	let n = $(e.id), r = Ui(e.audio_url), i = $(e.title);
	return !n || !r || !i ? null : {
		id: `ep:${n}`,
		type: "podcast",
		show: t.slug,
		slug: $(e.slug),
		title: i,
		sub: t.title,
		url: r,
		dur: Hi(e.duration),
		date: $(e.published_at),
		desc: $(e.description),
		chapters: [],
		hue: t.hue,
		mark: t.mark,
		art: Ui(e.image_url) || t.art
	};
}
function Yi(e) {
	let t = $(e.slug), n = $(e.title);
	if (!t || !n) return null;
	let r = 0, i = Wi(e.chapters).flatMap((e) => {
		let t = Ui(e.audio_url);
		if (!t) return [];
		let n = {
			start: r,
			title: $(e.title) || `Chapter ${Hi(e.section)}`,
			dur: Hi(e.duration),
			url: t,
			section: Hi(e.section)
		};
		return r += n.dur ?? 0, [n];
	}), a = i.length && i.every((e) => e.dur) ? r : Hi(e.duration), o = $(e.authors);
	return {
		id: `book:${t}`,
		type: "book",
		slug: t,
		title: n,
		sub: o || "Audiobook",
		dur: a,
		desc: $(e.description),
		chapters: i,
		loaded: i.length > 0,
		hue: Bi(t),
		mark: Vi(n),
		art: Ui(e.cover_url) || void 0
	};
}
var Xi = (e) => Wi(e.lines).map((e) => ({
	t: Hi(e.start),
	who: $(e.speaker),
	text: $(e.text)
})).filter((e) => e.text), Zi = (e) => e && typeof e == "object" ? e : {}, Qi = (e, t) => Wi(Zi(e)[t]);
//#endregion
//#region src/library.ts
function $i(e) {
	let t = String(e.user?.id ?? "local"), n = `state_${t.replace(/[^A-Za-z0-9_-]/g, "_")}`;
	return {
		storageKey: n,
		legacyKey: `state:${t}`,
		localKey: `tend-media:${n}`
	};
}
var ea = (e) => e && typeof e == "object" && e.v === 1 ? e : null;
async function ta(e) {
	let { storageKey: t, legacyKey: n, localKey: r } = $i(e), i = null;
	try {
		e.storage && (i = ea(await e.storage.get(t)) ?? ea(await e.storage.get(n)));
	} catch {}
	let a = null;
	try {
		a = ea(JSON.parse(localStorage.getItem(r) ?? "null"));
	} catch {}
	return i ? a && (a.savedAt ?? 0) > (i.savedAt ?? 0) ? a : i : a;
}
//#endregion
//#region src/format.ts
var na = (e) => `linear-gradient(145deg, oklch(0.6 0.1 ${e}), oklch(0.32 0.06 ${e}))`, ra = (e) => {
	let t = Math.max(0, Math.round(e)), n = Math.floor(t / 3600), r = Math.floor(t % 3600 / 60), i = t % 60;
	return n ? `${n}:${String(r).padStart(2, "0")}:${String(i).padStart(2, "0")}` : `${r}:${String(i).padStart(2, "0")}`;
}, ia = (e) => {
	let t = Math.max(0, e), n = Math.floor(t / 3600), r = Math.round(t % 3600 / 60);
	return n ? `${n}h ${r}m` : `${r} min`;
}, aa = (e = /* @__PURE__ */ new Date()) => {
	let t = e.getHours();
	return t < 5 ? "Good evening" : t < 12 ? "Good morning" : t < 18 ? "Good afternoon" : "Good evening";
}, oa = (e, t = Date.now()) => {
	let n = e ? Date.parse(e) : NaN;
	if (Number.isNaN(n)) return "";
	let r = Math.round((t - n) / 6e4);
	return r < 1 ? "just now" : r < 60 ? `${r} min ago` : r < 1440 ? `${Math.round(r / 60)} h ago` : new Date(n).toLocaleDateString();
}, sa = /* @__PURE__ */ br("<img alt=\"\" loading=\"lazy\" decoding=\"async\" referrerpolicy=\"no-referrer\" class=\"svelte-2fjyqn\"/>"), ca = /* @__PURE__ */ br("<div><!></div>"), la = {
	hash: "svelte-2fjyqn",
	code: ".cover.svelte-2fjyqn {flex:none;display:grid;place-items:center;overflow:hidden;font-family:ui-monospace, Menlo, monospace;font-weight:600;color:rgba(255, 255, 255, .75);}.cover.fill.svelte-2fjyqn {flex:1;}img.svelte-2fjyqn {width:100%;height:100%;object-fit:cover;display:block;}"
};
function ua(e, t) {
	Ke(t, !0), Zr(e, la);
	let n = Ni(t, "radius", 3, 8), r = Ni(t, "mark", 3, ""), i = Ni(t, "font", 3, 11), a = Ni(t, "fill", 3, !1), o = /* @__PURE__ */ P(!1);
	gn(() => {
		t.art, F(o, !1);
	});
	var s = ca();
	let c, l;
	var u = tn(s), d = (e) => {
		var n = wr();
		zr(nn(n), () => t.art, (e) => {
			var n = sa();
			Sn(() => xi(n, "src", t.art)), dr("error", n, () => F(o, !0)), lr(n), Tr(e, n);
		}), Tr(e, n);
	}, f = (e) => {
		var t = Cr();
		Sn(() => Ar(t, r())), Tr(e, t);
	};
	Lr(u, (e) => {
		t.art && !Z(o) ? e(d) : e(f, -1);
	}), Ee(s), Sn((e) => {
		c = ii(s, 1, "cover svelte-2fjyqn", null, c, { fill: a() }), l = oi(s, "", l, {
			width: a() ? "100%" : `${t.size}px`,
			height: a() ? "100%" : `${t.size}px`,
			"border-radius": `${n() ?? ""}px`,
			background: e,
			"font-size": `${i() ?? ""}px`
		});
	}, [() => na(t.hue)]), Tr(e, s), qe();
}
//#endregion
export { Z as $, xi as A, Wr as B, Pi as C, Ei as D, Ai as E, oi as F, Fr as G, Lr as H, ii as I, br as J, Tr as K, Qr as L, yi as M, di as N, Ti as O, ui as P, dr as Q, Zr as R, Ki as S, Mi as T, jr as U, Br as V, Ar as W, pr as X, Sr as Y, fr as Z, Li as _, ia as a, rn as at, Xi as b, ta as c, F as ct, Gi as d, qe as dt, yn as et, Bi as f, Ke as ft, zi as g, m as gt, Vi as h, d as ht, aa as i, nn as it, bi as j, vi as k, Fi as l, P as lt, Qi as m, Ee as mt, oa as n, gn as nt, ea as o, an as ot, Ii as p, De as pt, wr as q, ra as r, tn as rt, $i as s, qt as st, ua as t, Sn as tt, Zi as u, gt as ut, Yi as v, Ni as w, qi as x, Ji as y, Xr as z };
