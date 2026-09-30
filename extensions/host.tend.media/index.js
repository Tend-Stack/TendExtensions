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
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/hydration.js
var w = !1;
function Ce(e) {
	w = e;
}
var T;
function we(e) {
	if (e === null) throw xe(), ve;
	return T = e;
}
function Te() {
	return we(/* @__PURE__ */ en(T));
}
function E(e) {
	if (w) {
		if (/* @__PURE__ */ en(T) !== null) throw xe(), ve;
		T = e;
	}
}
function Ee(e = 1) {
	if (w) {
		for (var t = e, n = T; t--;) n = /* @__PURE__ */ en(n);
		T = n;
	}
}
function De(e = !0) {
	for (var t = 0, n = T;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ en(n);
		e && n.remove(), n = i;
	}
}
function Oe(e) {
	if (!e || e.nodeType !== 8) throw xe(), ve;
	return e.data;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/equality.js
function ke(e) {
	return e === this.v;
}
function Ae(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function je(e) {
	return !Ae(e, this.v);
}
function Me(e) {
	throw Error("https://svelte.dev/e/lifecycle_outside_component");
}
//#endregion
//#region node_modules/svelte/src/internal/client/errors.js
function Ne() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function Pe(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function Fe(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function Ie() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function Le(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function Re() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function ze(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function Be() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Ve() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function He() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Ue() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
//#endregion
//#region node_modules/svelte/src/internal/client/context.js
var We = null;
function Ge(e) {
	We = e;
}
function Ke(e, t = !1, n) {
	We = {
		p: We,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: z,
		l: null
	};
}
function qe(e) {
	var t = We, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) mn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, We = t.p, Je(e);
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
function Qe(e) {
	if (Xe.length === 0 && !Tt) {
		var t = Xe;
		queueMicrotask(() => {
			t === Xe && Ze();
		});
	}
	Xe.push(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/status.js
var $e = ~(g | _ | h);
function D(e, t) {
	e.f = e.f & $e | t;
}
function et(e) {
	e.f & 512 || e.deps === null ? D(e, h) : D(e, _);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function tt(e) {
	if (e !== null) for (let t of e) t.f & 2 && t.f & 65536 && (t.f ^= re, tt(t.deps));
}
function nt(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), tt(e.deps), D(e, h);
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
	var t = R, n = z;
	Ln(null), Rn(null);
	try {
		return e();
	} finally {
		Ln(t), Rn(n);
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/async.js
function ct(e, t, n, r) {
	let i = Ye() ? ft : ht;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = z, c = lt(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				sn(e, s);
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
		Promise.all(n.map((e) => /* @__PURE__ */ mt(e))).then(u).catch((e) => sn(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), ut();
	}) : f();
}
function lt() {
	var e = z, t = R, n = We, r = k;
	return function(i = !0) {
		Rn(e), Ln(t), Ge(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function ut(e = !0) {
	Rn(null), Ln(null), Ge(null), e && k?.deactivate();
}
function dt() {
	var e = z, t = e.b, n = k, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function ft(e) {
	var t = 2 | g;
	return z !== null && (z.f |= ee), {
		ctx: We,
		deps: null,
		effects: null,
		equals: ke,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: C,
		wv: 0,
		parent: z,
		ac: null
	};
}
var pt = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function mt(e, t, n) {
	let r = z;
	r === null && Ne();
	var i = void 0, a = Vt(C), o = !R, s = /* @__PURE__ */ new Set();
	return _n(() => {
		var t = z, n = p();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== ge && n.reject(e);
			}).finally(ut);
		} catch (e) {
			n.reject(e), ut();
		}
		var c = k;
		if (o) {
			if (t.f & 32768) var l = dt();
			if (r.b?.is_rendered()) c.async_deriveds.get(t)?.reject(pt);
			else for (let e of s.values()) e.reject(pt);
			s.add(n), c.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), s.delete(n), t !== pt && (c.activate(), t ? (a.f |= oe, Ut(a, t)) : (a.f & 8388608 && (a.f ^= oe), Ut(a, e)), c.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), fn(() => {
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
function O(e) {
	let t = /* @__PURE__ */ ft(e);
	return Bn(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function ht(e) {
	let t = /* @__PURE__ */ ft(e);
	return t.equals = je, t;
}
function gt(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) wn(t[n]);
	}
}
function _t(e) {
	var t, n = z, r = e.parent;
	if (!Pn && r !== null && e.v !== C && r.f & 24576) return be(), e.v;
	Rn(r);
	try {
		e.f &= ~re, gt(e), t = Qn(e);
	} finally {
		Rn(n);
	}
	return t;
}
function vt(e) {
	var t = _t(e);
	if (!e.equals(t) && (e.wv = Yn(), (!k?.is_fork || e.deps === null) && (k === null ? e.v = t : (k.capture(e, t, !0), St?.capture(e, t, !0)), e.deps === null))) {
		D(e, h);
		return;
	}
	Pn || (Ct === null ? et(e) : (dn() || k?.is_fork) && Ct.set(e, t));
}
function yt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && st(() => {
		t.ac.abort(ge), t.ac = null;
	}), t.fn !== null && (t.teardown = d), tr(t, 0), Sn(t));
}
function bt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && nr(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var xt = null, k = null, St = null, Ct = null, wt = null, Tt = !1, Et = !1, Dt = null, Ot = null, kt = 0, At = 1, jt = class e {
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
			for (var r of n.d) D(r, g), t(r);
			for (r of n.m) D(r, _), t(r);
		}
		this.#p.add(e);
	}
	#g() {
		this.#e = !0, kt++ > 1e3 && (this.#x(), Mt());
		for (let e of this.#u) this.#d.delete(e), D(e, g), this.schedule(e);
		for (let e of this.#d) D(e, _), this.schedule(e);
		let t = this.#c;
		this.#c = [], this.apply();
		var n = Dt = [], r = [], i = Ot = [];
		for (let e of t) try {
			this.#_(e, n, r);
		} catch (t) {
			throw Lt(e), this.#h() || this.discard(), t;
		}
		if (k = null, i.length > 0) {
			var a = e.ensure();
			for (let e of i) a.schedule(e);
		}
		if (Dt = null, Ot = null, this.#h()) {
			this.#b(r), this.#b(n);
			for (let [e, t] of this.#f) It(e, t);
			i.length > 0 && k.#g();
			return;
		}
		let o = this.#v();
		if (o) {
			this.#b(r), this.#b(n), o.#y(this);
			return;
		}
		this.#u.clear(), this.#d.clear();
		for (let e of this.#r) e(this);
		this.#r.clear(), St = this, Pt(r), Pt(n), St = null, this.#s?.resolve();
		var s = k;
		if (this.#a === 0 && (this.#c.length === 0 || s !== null) && this.#x(), this.#c.length > 0) {
			if (s !== null) {
				let e = s;
				e.#c.push(...this.#c.filter((t) => !e.#c.includes(t)));
			} else s = this;
		}
		s !== null && (zt.clear(), s.#g());
	}
	#_(e, t, n) {
		e.f ^= h;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= h : i & 4 ? t.push(r) : Xn(r) && (i & 16 && this.#d.add(r), nr(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), D(i, g), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#x(), k = this, this.#g();
	}
	#b(e) {
		for (var t = 0; t < e.length; t += 1) nt(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== C && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), Ct?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		k = this;
	}
	deactivate() {
		k = null, Ct = null;
	}
	flush() {
		try {
			Et = !0, k = this, this.#g();
		} finally {
			kt = 0, wt = null, Dt = null, Ot = null, Et = !1, k = null, Ct = null, zt.clear();
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
		this.#m || (this.#m = !0, Qe(() => {
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
		if (k === null) {
			let t = k = new e();
			!Et && Qe(() => {
				t.#e || t.flush();
			});
		}
		return k;
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
			if (Dt !== null && t === z && (R === null || !(R.f & 2))) return;
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
function Mt() {
	try {
		Re();
	} catch (e) {
		sn(e, wt);
	}
}
var Nt = null;
function Pt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && Xn(r) && (Nt = /* @__PURE__ */ new Set(), nr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && En(r), Nt?.size > 0)) {
				zt.clear();
				for (let e of Nt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Nt.has(n) && (Nt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || nr(n);
					}
				}
				Nt.clear();
			}
		}
		Nt = null;
	}
}
function Ft(e) {
	k.schedule(e);
}
function It(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), D(e, h);
		for (var n = e.first; n !== null;) It(n, t), n = n.next;
	}
}
function Lt(e) {
	D(e, h);
	for (var t = e.first; t !== null;) Lt(t), t = t.next;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
var Rt = /* @__PURE__ */ new Set(), zt = /* @__PURE__ */ new Map(), Bt = !1;
function Vt(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: ke,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function A(e, t) {
	let n = Vt(e, t);
	return Bn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function Ht(e, t = !1, n = !0) {
	let r = Vt(e);
	return t || (r.equals = je), r;
}
function j(e, t, n = !1) {
	return R !== null && (!In || R.f & 131072) && Ye() && R.f & 4325394 && (zn === null || !zn.has(e)) && He(), Ut(e, n ? M(t) : t, Ot);
}
function Ut(e, t, n = null) {
	if (!e.equals(t)) {
		Pn ? zt.set(e, t) : zt.has(e) || zt.set(e, e.v);
		var r = jt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && _t(t), Ct === null && et(t);
		}
		e.wv = Yn(), Kt(e, g, n), Ye() && z !== null && z.f & 1024 && !(z.f & 96) && (Un === null ? Wn([e]) : Un.push(e)), !r.is_fork && Rt.size > 0 && !Bt && Wt();
	}
	return t;
}
function Wt() {
	Bt = !1;
	for (let e of Rt) {
		e.f & 1024 && D(e, _);
		let t;
		try {
			t = Xn(e);
		} catch {
			t = !0;
		}
		t && nr(e);
	}
	Rt.clear();
}
function Gt(e) {
	j(e, e.v + 1);
}
function Kt(e, t, n) {
	var r = e.reactions;
	if (r !== null) for (var i = Ye(), a = r.length, o = 0; o < a; o++) {
		var s = r[o], c = s.f;
		if (i || s !== z) {
			var l = (c & g) === 0;
			if (l && D(s, t), c & 131072) Rt.add(s);
			else if (c & 2) {
				var u = s;
				Ct?.delete(u), c & 65536 || (c & 512 && (z === null || !(z.f & 2097152)) && (s.f |= re), Kt(u, _, n));
			} else if (l) {
				var d = s;
				c & 16 && Nt !== null && Nt.add(d), n === null ? Ft(d) : n.push(d);
			}
		}
	}
}
function M(t) {
	if (typeof t != "object" || !t || se in t || ce in t) return t;
	let n = l(t);
	if (n !== s && n !== c) return t;
	var r = /* @__PURE__ */ new Map(), i = e(t), o = /* @__PURE__ */ A(0), u = null, d = qn, f = (e) => {
		if (qn === d) return e();
		var t = R, n = qn;
		Ln(null), Jn(d);
		var r = e();
		return Ln(t), Jn(n), r;
	};
	return i && r.set("length", /* @__PURE__ */ A(t.length, u)), new Proxy(t, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && Be();
			var i = r.get(t);
			return i === void 0 ? f(() => {
				var e = /* @__PURE__ */ A(n.value, u);
				return r.set(t, e), e;
			}) : j(i, n.value, !0), !0;
		},
		deleteProperty(e, t) {
			var n = r.get(t);
			if (n === void 0) {
				if (t in e) {
					let e = f(() => /* @__PURE__ */ A(C, u));
					r.set(t, e), Gt(o);
				}
			} else j(n, C), Gt(o);
			return !0;
		},
		get(e, n, i) {
			if (n === se) return t;
			var o = r.get(n), s = n in e;
			if (o === void 0 && (!s || a(e, n)?.writable) && (o = f(() => /* @__PURE__ */ A(M(s ? e[n] : C), u)), r.set(n, o)), o !== void 0) {
				var c = B(o);
				return c === C ? void 0 : c;
			}
			return Reflect.get(e, n, i);
		},
		getOwnPropertyDescriptor(e, t) {
			var n = Reflect.getOwnPropertyDescriptor(e, t);
			if (n && "value" in n) {
				var i = r.get(t);
				i && (n.value = B(i));
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
			return (n !== void 0 || z !== null && (!i || a(e, t)?.writable)) && (n === void 0 && (n = f(() => /* @__PURE__ */ A(i ? M(e[t]) : C, u)), r.set(t, n)), B(n) === C) ? !1 : i;
		},
		set(e, t, n, s) {
			var c = r.get(t), l = t in e;
			if (i && t === "length") for (var d = n; d < c.v; d += 1) {
				var p = r.get(d + "");
				p === void 0 ? d in e && (p = f(() => /* @__PURE__ */ A(C, u)), r.set(d + "", p)) : j(p, C);
			}
			if (c === void 0) (!l || a(e, t)?.writable) && (c = f(() => /* @__PURE__ */ A(void 0, u)), j(c, M(n)), r.set(t, c));
			else {
				l = c.v !== C;
				var m = f(() => M(n));
				j(c, m);
			}
			var h = Reflect.getOwnPropertyDescriptor(e, t);
			if (h?.set && h.set.call(s, n), !l) {
				if (i && typeof t == "string") {
					var g = r.get("length"), _ = Number(t);
					Number.isInteger(_) && _ >= g.v && j(g, _ + 1);
				}
				Gt(o);
			}
			return !0;
		},
		ownKeys(e) {
			B(o);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = r.get(e);
				return t === void 0 || t.v !== C;
			});
			for (var [n, i] of r) i.v !== C && !(n in e) && t.push(n);
			return t;
		},
		setPrototypeOf() {
			Ve();
		}
	});
}
var qt, Jt, Yt, Xt;
function Zt() {
	if (qt === void 0) {
		qt = window, Jt = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		Yt = a(t, "firstChild").get, Xt = a(t, "nextSibling").get, u(e) && (e[fe] = void 0, e[de] = null, e[pe] = void 0, e.__e = void 0), u(n) && (n[me] = void 0);
	}
}
function Qt(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function $t(e) {
	return Yt.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function en(e) {
	return Xt.call(e);
}
function N(e, t) {
	if (!w) return /* @__PURE__ */ $t(e);
	var n = /* @__PURE__ */ $t(T);
	if (n === null) n = T.appendChild(Qt());
	else if (t && n.nodeType !== 3) {
		var r = Qt();
		return n?.before(r), we(r), r;
	}
	return t && an(n), we(n), n;
}
function P(e, t = !1) {
	if (!w) {
		var n = /* @__PURE__ */ $t(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ en(n) : n;
	}
	if (t) {
		if (T?.nodeType !== 3) {
			var r = Qt();
			return T?.before(r), we(r), r;
		}
		an(T);
	}
	return T;
}
function F(e, t = !1) {
	if (!w) return /* @__PURE__ */ $t(e);
	var n = N(e, t);
	return E(e), n;
}
function I(e, t = 1, n = !1) {
	let r = w ? T : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ en(r);
	if (!w) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = Qt();
			return r === null ? i?.after(a) : r.before(a), we(a), a;
		}
		an(r);
	}
	return we(r), r;
}
function tn(e) {
	e.textContent = "";
}
function nn() {
	return !1;
}
function rn(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function an(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
function on(e) {
	var t = z;
	if (t === null) return R.f |= oe, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	sn(e, t);
}
function sn(e, t) {
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
function cn(e) {
	z === null && (R === null && Le(e), Ie()), Pn && Fe(e);
}
function ln(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function un(e, t) {
	var n = z;
	n !== null && n.f & 8192 && (e |= v);
	var r = {
		ctx: We,
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
	k?.register_created_effect(r);
	var i = r;
	if (e & 4) Dt === null ? jt.ensure().schedule(r) : Dt.push(r);
	else if (t !== null) {
		try {
			nr(r);
		} catch (e) {
			throw wn(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= S));
	}
	if (i !== null && (i.parent = n, n !== null && ln(i, n), R !== null && R.f & 2 && !(e & 64))) {
		var a = R;
		(a.effects ??= []).push(i);
	}
	return r;
}
function dn() {
	return R !== null && !In;
}
function fn(e) {
	let t = un(8, null);
	return D(t, h), t.teardown = e, t;
}
function pn(e) {
	cn("$effect");
	var t = z.f;
	if (!R && t & 32 && We !== null && !We.i) {
		var n = We;
		(n.e ??= []).push(e);
	} else return mn(e);
}
function mn(e) {
	return un(4 | te, e);
}
function hn(e) {
	jt.ensure();
	let t = un(64 | ee, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Dn(t, () => {
			wn(t), n(void 0);
		}) : (wn(t), n(void 0));
	});
}
function gn(e) {
	return un(4, e);
}
function _n(e) {
	return un(ae | ee, e);
}
function vn(e, t = 0) {
	return un(8 | t, e);
}
function L(e, t = [], n = [], r = []) {
	ct(r, t, n, (t) => {
		un(8, () => {
			e(...t.map(B));
		});
	});
}
function yn(e, t = 0) {
	return un(16 | t, e);
}
function bn(e) {
	return un(32 | ee, e);
}
function xn(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = Pn, r = R;
		Fn(!0), Ln(null);
		try {
			t.call(null);
		} catch (t) {
			sn(t, e.parent);
		} finally {
			Fn(n), Ln(r);
		}
	}
}
function Sn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && st(() => {
			e.abort(ge);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : wn(n, t), n = r;
	}
}
function Cn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || wn(t), t = n;
	}
}
function wn(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Tn(e.nodes.start, e.nodes.end), n = !0), e.f |= x, Sn(e, t && !n), tr(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	xn(e), e.f ^= x, e.f |= y;
	var i = e.parent;
	i !== null && i.first !== null && En(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Tn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ en(e);
		e.remove(), e = n;
	}
}
function En(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Dn(e, t, n = !0) {
	var r = [];
	e.f |= 256, On(e, r, !0);
	var i = () => {
		n && wn(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function On(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= v;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				On(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function kn(e) {
	e.f &= -257, An(e, !0);
}
function An(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= v, e.f & 1024 || (D(e, g), jt.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			An(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function jn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ en(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var Mn = null, Nn = !1, Pn = !1;
function Fn(e) {
	Pn = e;
}
var R = null, In = !1;
function Ln(e) {
	R = e;
}
var z = null;
function Rn(e) {
	z = e;
}
var zn = null;
function Bn(e) {
	R !== null && (zn ??= /* @__PURE__ */ new Set()).add(e);
}
var Vn = null, Hn = 0, Un = null;
function Wn(e) {
	Un = e;
}
var Gn = 1, Kn = 0, qn = Kn;
function Jn(e) {
	qn = e;
}
function Yn() {
	return ++Gn;
}
function Xn(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 2 && (e.f &= ~re), t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (Xn(a) && vt(a), a.wv > e.wv) return !0;
		}
		t & 512 && Ct === null && D(e, h);
	}
	return !1;
}
function Zn(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(zn !== null && zn.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? Zn(a, t, !1) : t === a && (n ? D(a, g) : a.f & 1024 && D(a, _), Ft(a));
	}
}
function Qn(e) {
	var t = Vn, n = Hn, r = Un, i = R, a = zn, o = We, s = In, c = qn, l = e.f;
	Vn = null, Hn = 0, Un = null, R = l & 96 ? null : e, zn = null, Ge(e.ctx), In = !1, qn = ++Kn, e.ac !== null && (st(() => {
		e.ac.abort(ge);
	}), e.ac = null);
	try {
		e.f |= ie;
		var u = e.fn, d = u();
		e.f |= b;
		var f = $n(e);
		if (Ye() && Un !== null && !In && f !== null && !(e.f & 6146)) for (var p = 0; p < Un.length; p++) Zn(Un[p], e);
		if (i !== null && i !== e) {
			if (Kn++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = Kn;
			if (t !== null) for (let e of t) e.rv = Kn;
			Un !== null && (r === null ? r = Un : r.push(...Un));
		}
		return e.f & 8388608 && (e.f ^= oe), d;
	} catch (t) {
		return $n(e), on(t);
	} finally {
		e.f ^= ie, Vn = t, Hn = n, Un = r, R = i, zn = a, Ge(o), In = s, qn = c;
	}
}
function $n(e) {
	var t = e.deps, n = k?.is_fork;
	if (Vn !== null) {
		var r;
		if (n || tr(e, Hn), t !== null && Hn > 0) for (t.length = Hn + Vn.length, r = 0; r < Vn.length; r++) t[Hn + r] = Vn[r];
		else e.deps = t = Vn;
		if (dn() && e.f & 512) for (r = Hn; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && Hn < t.length && (tr(e, Hn), t.length = Hn);
	return t;
}
function er(e, r) {
	let i = r.reactions;
	if (i !== null) {
		var a = t.call(i, e);
		if (a !== -1) {
			var o = i.length - 1;
			o === 0 ? i = r.reactions = null : (i[a] = i[o], i.pop());
		}
	}
	if (i === null && r.f & 2 && (Vn === null || !n.call(Vn, r))) {
		var s = r;
		s.f & 512 && (s.f ^= 512, s.f &= ~re), s.v !== C && et(s), s.ac !== null && st(() => {
			s.ac.abort(ge), s.ac = null, D(s, g);
		}), yt(s), tr(s, 0);
	}
}
function tr(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) er(e, n[r]);
}
function nr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		D(e, h);
		var n = z, r = Nn;
		z = e, Nn = !(t & 96);
		try {
			t & 16777232 ? Cn(e) : Sn(e), xn(e);
			var i = Qn(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = Gn;
		} finally {
			Nn = r, z = n;
		}
	}
}
function B(e) {
	var t = !!(e.f & 2);
	if (Mn?.add(e), R !== null && !In && !(z !== null && z.f & 16384) && (zn === null || !zn.has(e))) {
		var r = R.deps;
		if (R.f & 2097152) e.rv < Kn && (e.rv = Kn, Vn === null && r !== null && r[Hn] === e ? Hn++ : Vn === null ? Vn = [e] : Vn.push(e));
		else {
			R.deps ??= [], n.call(R.deps, e) || R.deps.push(e);
			var i = e.reactions;
			i === null ? e.reactions = [R] : n.call(i, R) || i.push(R);
		}
	}
	if (Pn && zt.has(e)) return zt.get(e);
	if (t) {
		var a = e;
		if (Pn) {
			var o = a.v;
			return (!(a.f & 1024) && a.reactions !== null || ir(a)) && (o = _t(a)), zt.set(a, o), o;
		}
		var s = !(a.f & 512) && !In && R !== null && (Nn || !!(R.f & 512)), c = (a.f & b) === 0;
		Xn(a) && (s && (a.f |= 512), vt(a)), s && !c && (bt(a), rr(a));
	}
	if (Ct?.has(e)) return Ct.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function rr(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (bt(t), rr(t));
}
function ir(e) {
	if (e.v === C) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (zt.has(t) || t.f & 2 && ir(t)) return !0;
	return !1;
}
function ar(e) {
	var t = In;
	try {
		return In = !0, e();
	} finally {
		In = t;
	}
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var or = ["touchstart", "touchmove"];
function sr(e) {
	return or.includes(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dev/css.js
var cr = Symbol("events"), lr = /* @__PURE__ */ new Set(), ur = /* @__PURE__ */ new Set();
function dr(e) {
	if (!w) return;
	e.removeAttribute("onload"), e.removeAttribute("onerror");
	let t = e.__e;
	t !== void 0 && (e.__e = void 0, queueMicrotask(() => {
		e.isConnected && e.dispatchEvent(t);
	}));
}
function fr(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || _r.call(t, e), !e.cancelBubble) return st(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? Qe(() => {
		t.addEventListener(e, i, r);
	}) : t.addEventListener(e, i, r), i;
}
function pr(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = fr(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && fn(() => {
		t.removeEventListener(e, o, a);
	});
}
function V(e, t, n) {
	(t[cr] ??= {})[e] = n;
}
function mr(e) {
	for (var t = 0; t < e.length; t++) lr.add(e[t]);
	for (var n of ur) n(e);
}
var hr = null, gr = !1;
function _r(e) {
	var t = this, n = t.ownerDocument, r = e.type, a = e.composedPath?.() || [], o = a[0] || e.target;
	hr = e, gr || (gr = !0, setTimeout(() => {
		gr = !1, hr = null;
	}));
	var s = 0, c = hr === e && e[cr];
	if (c) {
		var l = a.indexOf(c);
		if (l !== -1 && (t === document || t === window)) {
			e[cr] = t;
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
		var d = R, f = z;
		Ln(null), Rn(null);
		try {
			for (var p, m = []; o !== null && o !== t;) {
				try {
					var h = o[cr]?.[r];
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
			e[cr] = t, delete e.currentTarget, Ln(d), Rn(f);
		}
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/reconciler.js
var vr = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function yr(e) {
	return vr?.createHTML(e) ?? e;
}
function br(e) {
	var t = rn("template");
	return t.innerHTML = yr(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
function xr(e, t) {
	var n = z;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function H(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i, a = !e.startsWith("<!>");
	return () => {
		if (w) return xr(T, null), T;
		i === void 0 && (i = br(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ $t(i)));
		var t = r || Jt ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ $t(t), s = t.lastChild;
			xr(o, s);
		} else xr(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Sr(e, t, n = "svg") {
	var r = !e.startsWith("<!>"), i = !!(t & 1), a = `<${n}>${r ? e : "<!>" + e}</${n}>`, o;
	return () => {
		if (w) return xr(T, null), T;
		if (!o) {
			var e = /* @__PURE__ */ $t(br(a));
			if (i) for (o = document.createDocumentFragment(); /* @__PURE__ */ $t(e);) o.appendChild(/* @__PURE__ */ $t(e));
			else o = /* @__PURE__ */ $t(e);
		}
		var t = o.cloneNode(!0);
		if (i) {
			var n = /* @__PURE__ */ $t(t), r = t.lastChild;
			xr(n, r);
		} else xr(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Cr(e, t) {
	return /* @__PURE__ */ Sr(e, t, "svg");
}
function wr(e = "") {
	if (!w) {
		var t = Qt(e + "");
		return xr(t, t), t;
	}
	var n = T;
	return n.nodeType === 3 ? an(n) : (n.before(n = Qt()), we(n)), xr(n, n), n;
}
function Tr() {
	if (w) return xr(T, null), T;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = Qt();
	return e.append(t, n), xr(t, n), e;
}
function U(e, t) {
	if (w) {
		var n = z;
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
		dn() && (B(n), vn(() => (t === 0 && (r = ar(() => e(() => Gt(n)))), t += 1, () => {
			Qe(() => {
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
			var t = z;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = z.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = yn(() => {
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
			this.#a = bn(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		Qe(r), t && (this.#s = bn(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			if (t) {
				Se();
				return;
			}
			t = !0, n && Ue(), this.#s !== null && Dn(this.#s, () => {
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
					sn(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = bn(() => e(this.#e)), Qe(() => {
			var e = this.#c = document.createDocumentFragment(), t = Qt(), n = !1;
			if (e.append(t), this.#a = this.#S(() => {
				try {
					return bn(() => this.#r(t));
				} catch (e) {
					try {
						this.error(e), n = !0;
					} catch (e) {
						sn(e, this.#i.parent);
					}
					return null;
				}
			}), this.#a === null) {
				this.#c = null, n && this.#x(k);
				return;
			}
			this.#u === 0 && (this.#e.before(e), this.#c = null, Dn(this.#o, () => {
				this.#o = null;
			}), this.#x(k));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = bn(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				jn(this.#a, e);
				let t = this.#n.pending;
				this.#o = bn(() => t(this.#e));
			} else this.#x(k);
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
		var t = z, n = R, r = We;
		Rn(this.#i), Ln(this.#i), Ge(this.#i.ctx);
		try {
			return jt.ensure(), e();
		} finally {
			Rn(t), Ln(n), Ge(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && Dn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, Qe(() => {
			this.#d = !1, this.#m && Ut(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), B(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		k?.is_fork ? (this.#a && k.skip_effect(this.#a), this.#o && k.skip_effect(this.#o), this.#s && k.skip_effect(this.#s), k.oncommit(() => {
			this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (wn(this.#a), null), this.#o &&= (wn(this.#o), null), this.#s &&= (wn(this.#s), null), w && (we(this.#t), Ee(), we(De()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return bn(() => {
						var r = z;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return sn(e, this.#i.parent), null;
				}
			}));
		};
		Qe(() => {
			var t;
			try {
				t = this.transform_error(e);
			} catch (e) {
				sn(e, this.#i && this.#i.parent);
				return;
			}
			typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => sn(e, this.#i && this.#i.parent)) : n(t);
		});
	}
};
function W(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[me] ??= e.nodeValue) && (e[me] = n, e.nodeValue = `${n}`);
}
function Ar(e, t) {
	return Mr(e, t);
}
var jr = /* @__PURE__ */ new Map();
function Mr(e, { target: t, anchor: n, props: i = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	Zt();
	var l = void 0, u = hn(() => {
		var s = n ?? t.appendChild(Qt());
		Or(s, { pending: () => {} }, (t) => {
			Ke({});
			var n = We;
			if (o && (n.c = o), a && (i.$$events = a), w && xr(t, null), l = e(t, i) || Je(), w && (z.nodes.end = T, T === null || T.nodeType !== 8 || T.data !== "]")) throw xe(), ve;
			qe();
		}, c);
		var u = /* @__PURE__ */ new Set(), d = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!u.has(r)) {
					u.add(r);
					var i = sr(r);
					for (let e of [t, document]) {
						var a = jr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), jr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, _r, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return d(r(lr)), ur.add(d), () => {
			for (var e of u) for (let n of [t, document]) {
				var r = jr.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, _r), r.delete(e), r.size === 0 && jr.delete(n)) : r.set(e, i);
			}
			ur.delete(d), s !== n && s.parentNode?.removeChild(s);
		};
	});
	return Nr.set(l, u), l;
}
var Nr = /* @__PURE__ */ new WeakMap();
function Pr(e, t) {
	let n = Nr.get(e);
	return n ? (Nr.delete(e), n(t)) : Promise.resolve();
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/branches.js
var Fr = class {
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
			if (n) kn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (kn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (wn(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						jn(r, t), t.append(Qt()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else wn(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Dn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (wn(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = k, r = nn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) {
			if (r) {
				var i = document.createDocumentFragment(), a = Qt();
				i.append(a), this.#n.set(e, {
					effect: bn(() => t(a)),
					fragment: i
				});
			} else this.#t.set(e, bn(() => t(this.anchor)));
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
function G(e, t, n = !1) {
	var r;
	w && (r = T, Te());
	var i = new Fr(e), a = n ? S : 0;
	function o(e, t) {
		if (w) {
			var n = Oe(r);
			if (e !== parseInt(n.substring(1))) {
				var a = De();
				we(a), i.anchor = a, Ce(!1), i.ensure(e, t), Ce(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	yn(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/each.js
function Ir(e, t) {
	return t;
}
function Lr(e, t, n) {
	for (var i = [], a = t.length, o, s = t.length, c = 0; c < a; c++) {
		let n = t[c];
		Dn(n, () => {
			if (o) {
				if (o.pending.delete(n), o.done.add(n), o.pending.size === 0) {
					var t = e.outrogroups;
					Rr(e, r(o.done)), t.delete(o), t.size === 0 && (e.outrogroups = null);
				}
			} else --s;
		}, !1);
	}
	if (s === 0) {
		var l = i.length === 0 && n !== null && e.pending.size === 0;
		if (l) {
			var u = n, d = u.parentNode;
			tn(d), d.append(u), e.items.clear();
		}
		Rr(e, t, !l);
	} else o = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(o);
}
function Rr(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= ne, jn(a, document.createDocumentFragment())) : wn(t[i], n);
	}
}
var zr;
function K(t, n, i, a, o, s = null) {
	var c = t, l = /* @__PURE__ */ new Map();
	if (n & 4) {
		var u = t;
		c = w ? we(/* @__PURE__ */ $t(u)) : u.appendChild(Qt());
	}
	w && Te();
	var d = null, f = /* @__PURE__ */ ht(() => {
		var t = i();
		return e(t) ? t : t == null ? [] : r(t);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, Vr(v, p, c, n, a), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= ne, Ur(d, null, c)) : kn(d) : Dn(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: yn(() => {
			p = B(f);
			var e = p.length;
			let t = !1;
			w && Oe(c) === "[!" != (e === 0) && (c = De(), we(c), Ce(!1), t = !0);
			for (var r = /* @__PURE__ */ new Set(), u = k, v = nn(), y = 0; y < e; y += 1) {
				w && T.nodeType === 8 && T.data === "]" && (c = T, t = !0, Ce(!1));
				var b = p[y], x = a(b, y), S = h ? null : l.get(x);
				S ? (S.v && Ut(S.v, b), S.i && Ut(S.i, y), v && u.unskip_effect(S.e)) : (S = Hr(l, h ? c : zr ??= Qt(), b, x, y, o, n, i), h || (S.e.f |= ne), l.set(x, S)), r.add(x);
			}
			if (e === 0 && s && !d && (h ? d = bn(() => s(c)) : (d = bn(() => s(zr ??= Qt())), d.f |= ne)), e > r.size && Pe("", "", ""), w && e > 0 && we(De()), !h) {
				if (m.set(u, r), v) {
					for (let [e, t] of l) r.has(e) || u.skip_effect(t.e);
					u.oncommit(g), u.ondiscard(_);
				} else g(u);
			}
			t && Ce(!0), B(f);
		}),
		flags: n,
		items: l,
		pending: m,
		outrogroups: null,
		fallback: d
	};
	h = !1, w && (c = T);
}
function Br(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function Vr(e, t, n, i, a) {
	var o = !!(i & 8), s = t.length, c = e.items, l = Br(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (o) for (v = 0; v < s; v += 1) h = t[v], g = a(h, v), _ = c.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < s; v += 1) {
		if (h = t[v], g = a(h, v), _ = c.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (kn(_), o && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) {
			if (_.f ^= ne, _ === l) Ur(_, null, n);
			else {
				var y = d ? d.next : l;
				_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), Wr(e, d, _), Wr(e, _, y), Ur(_, y, n), d = _, p = [], m = [], l = Br(d.next);
				continue;
			}
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], ee = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) Ur(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					Wr(e, S.prev, ee.next), Wr(e, d, S), Wr(e, ee, b), l = b, d = ee, --v, p = [], m = [];
				} else u.delete(_), Ur(_, l, n), Wr(e, _.prev, _.next), Wr(e, _, d === null ? e.effect.first : d.next), Wr(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = Br(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = Br(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (Rr(e, r(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var te = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || te.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && te.push(l), l = Br(l.next);
		var re = te.length;
		if (re > 0) {
			var ie = i & 4 && s === 0 ? n : null;
			if (o) {
				for (v = 0; v < re; v += 1) te[v].nodes?.a?.measure();
				for (v = 0; v < re; v += 1) te[v].nodes?.a?.fix();
			}
			Lr(e, te, ie);
		}
	}
	o && Qe(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function Hr(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Vt(n) : /* @__PURE__ */ Ht(n, !1, !1) : null, l = o & 2 ? Vt(i) : null;
	return {
		v: c,
		i: l,
		e: bn(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function Ur(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ en(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function Wr(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/css.js
function q(e, t) {
	gn(() => {
		e = z?.parent?.nodes?.start ?? e;
		var n = e.getRootNode(), r = n.host ? n : n.head ?? n.ownerDocument.head;
		if (!r.querySelector("#" + t.hash)) {
			let e = rn("style");
			e.id = t.hash, e.textContent = t.code, r.appendChild(e);
		}
	});
}
//#endregion
//#region node_modules/svelte/src/internal/shared/attributes.js
var Gr = [..." 	\n\r\f\xA0\v﻿"];
function Kr(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || Gr.includes(r[o - 1])) && (s === r.length || Gr.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
function qr(e, t = !1) {
	var n = t ? " !important;" : ";", r = "";
	for (var i of Object.keys(e)) {
		var a = e[i];
		a != null && a !== "" && (r += " " + i + ": " + a + n);
	}
	return r;
}
function Jr(e) {
	return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function Yr(e, t) {
	if (t) {
		var n = "", r, i;
		if (Array.isArray(t) ? (r = t[0], i = t[1]) : r = t, e) {
			e = String(e).replaceAll(/\/\*.*?\*\//g, "").trim();
			var a = !1, o = 0, s = !1, c = [];
			r && c.push(...Object.keys(r).map(Jr)), i && c.push(...Object.keys(i).map(Jr));
			var l = 0, u = -1;
			let t = e.length;
			for (var d = 0; d < t; d++) {
				var f = e[d];
				if (s ? f === "/" && e[d - 1] === "*" && (s = !1) : a ? a === f && (a = !1) : f === "/" && e[d + 1] === "*" ? s = !0 : f === "\"" || f === "'" ? a = f : f === "(" ? o++ : f === ")" && o--, !s && a === !1 && o === 0) {
					if (f === ":" && u === -1) u = d;
					else if (f === ";" || d === t - 1) {
						if (u !== -1) {
							var p = Jr(e.substring(l, u).trim());
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
		return r && (n += qr(r)), i && (n += qr(i, !0)), n = n.trim(), n === "" ? null : n;
	}
	return e == null ? null : String(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/class.js
function J(e, t, n, r, i, a) {
	var o = e[fe];
	if (w || o !== n || o === void 0) {
		var s = Kr(n, r, a);
		(!w || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[fe] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/style.js
function Xr(e, t = {}, n, r) {
	for (var i in n) {
		var a = n[i];
		t[i] !== a && (n[i] == null ? e.style.removeProperty(i) : e.style.setProperty(i, a, r));
	}
}
function Zr(e, t, n, r) {
	var i = e[pe];
	if (w || i !== t) {
		var a = Yr(t, r);
		(!w || a !== e.getAttribute("style")) && (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[pe] = t;
	} else r && (Array.isArray(r) ? (Xr(e, n?.[0], r[0]), Xr(e, n?.[1], r[1], "important")) : Xr(e, n, r));
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attributes.js
var Qr = Symbol("is custom element"), $r = Symbol("is html"), ei = _e ? "link" : "LINK", ti = _e ? "progress" : "PROGRESS";
function ni(e) {
	if (w) {
		var t = !1, n = () => {
			if (!t) {
				if (t = !0, e.hasAttribute("value")) {
					var n = e.value;
					Y(e, "value", null), e.value = n;
				}
				if (e.hasAttribute("checked")) {
					var r = e.checked;
					Y(e, "checked", null), e.checked = r;
				}
			}
		};
		e[he] = n, Qe(n), ot();
	}
}
function ri(e, t) {
	var n = ii(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === ti) && (e.value = t ?? "");
}
function Y(e, t, n, r) {
	var i = ii(e);
	w && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === ei) || i[t] !== (i[t] = n) && (t === "loading" && (e[ue] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && oi(e).has(t) ? e[t] = n : e.setAttribute(t, n));
}
function ii(e) {
	return e[de] ??= {
		[Qr]: e.nodeName.includes("-"),
		[$r]: e.namespaceURI === ye
	};
}
var ai = /* @__PURE__ */ new Map();
function oi(e) {
	var t = e.getAttribute("is") || e.nodeName, n = ai.get(t);
	if (n) return n;
	ai.set(t, n = /* @__PURE__ */ new Set());
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var s in r = o(i), r) r[s].set && s !== "innerHTML" && s !== "textContent" && s !== "innerText" && n.add(s);
		i = l(i);
	}
	return n;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function si(e, t) {
	return e === t || e?.[se] === t;
}
function ci(e = Je(), t, n, r) {
	var i = We.r, a = z;
	return gn(() => {
		var o, s;
		return vn(() => {
			o = s, s = r?.() || [], ar(() => {
				si(n(...s), e) || (t(e, ...s), o && si(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && si(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function li(e, t, n, r) {
	var i = !0, o = !!(n & 8), s = !!(n & 16), c = r, l = !0, u = void 0, d = () => s && i ? (u ??= /* @__PURE__ */ ft(r), B(u)) : (l && (l = !1, c = s ? ar(r) : r), c);
	let f;
	if (o) {
		var p = se in e || le in e;
		f = a(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	o ? [m, h] = it(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && ze(t), f(m)));
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
	o && B(y);
	var b = z;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? B(y) : i && o ? M(e) : e;
			return j(y, n), v = !0, c !== void 0 && (c = n), e;
		}
		return Pn && v || b.f & 16384 ? y.v : B(y);
	});
}
function ui(e) {
	We === null && Me("onMount"), pn(() => {
		let t = ar(e);
		if (typeof t == "function") return t;
	});
}
//#endregion
//#region node_modules/svelte/src/internal/disclose-version.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
//#endregion
//#region src/catalog.ts
var di = {
	podcast: "Podcast",
	book: "Audiobook",
	radio: "Radio"
}, X = (e) => e.type !== "radio", fi = (e) => e.type === "podcast" ? `show:${e.show}` : e.id, pi = [
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
], mi = (e) => pi[e] ?? String(e + 1), hi = (e) => {
	let t = 0;
	for (let n of e) t = t * 31 + n.charCodeAt(0) >>> 0;
	return t % 360;
}, gi = (e) => {
	let t = e.replace(/^(the|a|an|el|la|los|las|o|os|as)\s+/i, "").split(/[\s:·\-–—]+/).filter((e) => /[\p{L}\p{N}]/u.test(e));
	return (t.length > 1 ? t[0][0] + t[1][0] : (t[0] ?? "?").slice(0, 2)).toUpperCase();
}, Z = (e) => typeof e == "string" ? e : "", _i = (e) => typeof e == "number" && Number.isFinite(e) ? e : 0, vi = (e) => {
	let t = Z(e);
	return t.startsWith("https://") ? t : "";
}, yi = (e) => Array.isArray(e) ? e.filter((e) => !!e && typeof e == "object") : [], bi = (e, t = /* @__PURE__ */ new Date()) => {
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
function xi(e) {
	let t = Z(e.id), n = Z(e.name), r = vi(e.stream_url);
	if (!t || !n || !r || e.playable === !1) return null;
	let i = [Z(e.city), Z(e.region) || Z(e.country)].filter(Boolean).join(", "), a = Z(e.genre).split(/[,/]/)[0]?.trim() || "Radio";
	return {
		id: `st:${t}`,
		type: "radio",
		stationId: t,
		title: n,
		url: r,
		genre: a,
		sub: [i || Z(e.country), a].filter(Boolean).join(" · "),
		onair: "Live",
		hue: hi(t),
		mark: gi(n),
		art: vi(e.logo_url) || void 0
	};
}
function Si(e) {
	let t = Z(e.slug), n = Z(e.title);
	return !t || !n ? null : {
		slug: t,
		id: Z(e.id),
		title: n,
		author: Z(e.author),
		desc: Z(e.description),
		art: vi(e.image_url) || void 0,
		hue: hi(t),
		mark: gi(n),
		category: Z(e.category),
		episodes: _i(e.episode_count)
	};
}
function Ci(e, t) {
	let n = Z(e.id), r = vi(e.audio_url), i = Z(e.title);
	return !n || !r || !i ? null : {
		id: `ep:${n}`,
		type: "podcast",
		show: t.slug,
		slug: Z(e.slug),
		title: i,
		sub: t.title,
		url: r,
		dur: _i(e.duration),
		date: Z(e.published_at),
		desc: Z(e.description),
		chapters: [],
		hue: t.hue,
		mark: t.mark,
		art: vi(e.image_url) || t.art
	};
}
function wi(e) {
	let t = Z(e.slug), n = Z(e.title);
	if (!t || !n) return null;
	let r = 0, i = yi(e.chapters).flatMap((e) => {
		let t = vi(e.audio_url);
		if (!t) return [];
		let n = {
			start: r,
			title: Z(e.title) || `Chapter ${_i(e.section)}`,
			dur: _i(e.duration),
			url: t,
			section: _i(e.section)
		};
		return r += n.dur ?? 0, [n];
	}), a = i.length && i.every((e) => e.dur) ? r : _i(e.duration), o = Z(e.authors);
	return {
		id: `book:${t}`,
		type: "book",
		slug: t,
		title: n,
		sub: o || "Audiobook",
		dur: a,
		desc: Z(e.description),
		chapters: i,
		loaded: i.length > 0,
		hue: hi(t),
		mark: gi(n),
		art: vi(e.cover_url) || void 0
	};
}
var Ti = (e) => yi(e.lines).map((e) => ({
	t: _i(e.start),
	who: Z(e.speaker),
	text: Z(e.text)
})).filter((e) => e.text), Ei = (e) => e && typeof e == "object" ? e : {}, Di = (e, t) => yi(Ei(e)[t]), Oi = class {
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
}, ki = (e) => `linear-gradient(145deg, oklch(0.6 0.1 ${e}), oklch(0.32 0.06 ${e}))`, Ai = (e) => {
	let t = Math.max(0, Math.round(e)), n = Math.floor(t / 3600), r = Math.floor(t % 3600 / 60), i = t % 60;
	return n ? `${n}:${String(r).padStart(2, "0")}:${String(i).padStart(2, "0")}` : `${r}:${String(i).padStart(2, "0")}`;
}, ji = (e) => {
	let t = Math.max(0, e), n = Math.floor(t / 3600), r = Math.round(t % 3600 / 60);
	return n ? `${n}h ${r}m` : `${r} min`;
}, Mi = (e = /* @__PURE__ */ new Date()) => {
	let t = e.getHours();
	return t < 5 ? "Good evening" : t < 12 ? "Good morning" : t < 18 ? "Good afternoon" : "Good evening";
}, Ni = (e, t, n) => (e ?? []).reduce((e, r, i) => n(r) <= t ? i : e, e?.length ? 0 : -1), Pi = (e, t) => Ni(e, t, (e) => e.start), Fi = (e, t) => [t, ...e.filter((e) => e !== t)], Ii = (e, t) => [...e.filter((e) => e !== t), t], Li = (e, t) => e.filter((e) => e !== t), Ri = (e, t) => {
	let n = Math.max(0, Pi(e, t));
	return {
		index: n,
		offset: Math.max(0, t - (e[n]?.start ?? 0))
	};
}, zi = (e, t) => Object.fromEntries(Object.entries(e).sort((e, t) => t[1].at - e[1].at).slice(0, t)), Bi = (e, t) => {
	let n = Pi(e, t);
	return n < 0 ? 0 : t - e[n].start > 3 ? e[n].start : e[n - 1]?.start ?? 0;
};
function Vi(e, t, n = 1, r = n * e.speed) {
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
var Hi = (e, t, n) => Math.max(0, e - t) / n, Ui = (e) => typeof e == "number" && e < 60 ? Math.max(0, e / 60) : 1, Wi = [
	.8,
	1,
	1.1,
	1.2,
	1.4,
	1.6,
	1.8,
	2
], Gi = [
	5,
	15,
	30,
	45,
	60,
	90
], Ki = 200, qi = class {
	#e = /* @__PURE__ */ A(M({}));
	get items() {
		return B(this.#e);
	}
	set items(e) {
		j(this.#e, e, !0);
	}
	#t = /* @__PURE__ */ A(M({}));
	get shows() {
		return B(this.#t);
	}
	set shows(e) {
		j(this.#t, e, !0);
	}
	#n = /* @__PURE__ */ A(M({}));
	get showEpisodes() {
		return B(this.#n);
	}
	set showEpisodes(e) {
		j(this.#n, e, !0);
	}
	#r = /* @__PURE__ */ A(M([]));
	get trending() {
		return B(this.#r);
	}
	set trending(e) {
		j(this.#r, e, !0);
	}
	#i = /* @__PURE__ */ A("idle");
	get radioStatus() {
		return B(this.#i);
	}
	set radioStatus(e) {
		j(this.#i, e, !0);
	}
	#a = /* @__PURE__ */ A(M({
		slugs: [],
		cursor: null,
		status: "idle"
	}));
	get podcastBrowse() {
		return B(this.#a);
	}
	set podcastBrowse(e) {
		j(this.#a, e, !0);
	}
	#o = /* @__PURE__ */ A(M({
		ids: [],
		cursor: null,
		status: "idle"
	}));
	get bookBrowse() {
		return B(this.#o);
	}
	set bookBrowse(e) {
		j(this.#o, e, !0);
	}
	#s = /* @__PURE__ */ A(M([]));
	get newEpisodes() {
		return B(this.#s);
	}
	set newEpisodes(e) {
		j(this.#s, e, !0);
	}
	#c = /* @__PURE__ */ A("idle");
	get newStatus() {
		return B(this.#c);
	}
	set newStatus(e) {
		j(this.#c, e, !0);
	}
	#l = /* @__PURE__ */ A(M({}));
	get bookStatus() {
		return B(this.#l);
	}
	set bookStatus(e) {
		j(this.#l, e, !0);
	}
	#u = /* @__PURE__ */ A(M({}));
	get transcripts() {
		return B(this.#u);
	}
	set transcripts(e) {
		j(this.#u, e, !0);
	}
	#d = /* @__PURE__ */ A(M({
		q: "",
		hits: [],
		status: "idle"
	}));
	get search() {
		return B(this.#d);
	}
	set search(e) {
		j(this.#d, e, !0);
	}
	#f = /* @__PURE__ */ A(M({}));
	get nowPlaying() {
		return B(this.#f);
	}
	set nowPlaying(e) {
		j(this.#f, e, !0);
	}
	supported = !0;
	#p = /* @__PURE__ */ A("home");
	get tab() {
		return B(this.#p);
	}
	set tab(e) {
		j(this.#p, e, !0);
	}
	#m = /* @__PURE__ */ A(null);
	get showSlug() {
		return B(this.#m);
	}
	set showSlug(e) {
		j(this.#m, e, !0);
	}
	#h = /* @__PURE__ */ A(null);
	get bookId() {
		return B(this.#h);
	}
	set bookId(e) {
		j(this.#h, e, !0);
	}
	#g = /* @__PURE__ */ A("All");
	get genre() {
		return B(this.#g);
	}
	set genre(e) {
		j(this.#g, e, !0);
	}
	#_ = /* @__PURE__ */ A("");
	get query() {
		return B(this.#_);
	}
	set query(e) {
		j(this.#_, e, !0);
	}
	#v = /* @__PURE__ */ A("queue");
	get rtab() {
		return B(this.#v);
	}
	set rtab(e) {
		j(this.#v, e, !0);
	}
	#y = /* @__PURE__ */ A(null);
	get pop() {
		return B(this.#y);
	}
	set pop(e) {
		j(this.#y, e, !0);
	}
	#b = /* @__PURE__ */ A(null);
	get toast() {
		return B(this.#b);
	}
	set toast(e) {
		j(this.#b, e, !0);
	}
	#x = /* @__PURE__ */ A(null);
	get now() {
		return B(this.#x);
	}
	set now(e) {
		j(this.#x, e, !0);
	}
	#S = /* @__PURE__ */ A(0);
	get pos() {
		return B(this.#S);
	}
	set pos(e) {
		j(this.#S, e, !0);
	}
	#C = /* @__PURE__ */ A(!1);
	get playing() {
		return B(this.#C);
	}
	set playing(e) {
		j(this.#C, e, !0);
	}
	#w = /* @__PURE__ */ A(!1);
	get buffering() {
		return B(this.#w);
	}
	set buffering(e) {
		j(this.#w, e, !0);
	}
	#T = /* @__PURE__ */ A(!1);
	get loadingItem() {
		return B(this.#T);
	}
	set loadingItem(e) {
		j(this.#T, e, !0);
	}
	#E = /* @__PURE__ */ A(1);
	get speed() {
		return B(this.#E);
	}
	set speed(e) {
		j(this.#E, e, !0);
	}
	#D = /* @__PURE__ */ A(M({}));
	get speeds() {
		return B(this.#D);
	}
	set speeds(e) {
		j(this.#D, e, !0);
	}
	#O = /* @__PURE__ */ A(M([]));
	get queue() {
		return B(this.#O);
	}
	set queue(e) {
		j(this.#O, e, !0);
	}
	#k = /* @__PURE__ */ A(M({}));
	get progress() {
		return B(this.#k);
	}
	set progress(e) {
		j(this.#k, e, !0);
	}
	#A = /* @__PURE__ */ A(M({}));
	get played() {
		return B(this.#A);
	}
	set played(e) {
		j(this.#A, e, !0);
	}
	#j = /* @__PURE__ */ A(M({}));
	get subscribed() {
		return B(this.#j);
	}
	set subscribed(e) {
		j(this.#j, e, !0);
	}
	#M = /* @__PURE__ */ A(M({}));
	get bookmarks() {
		return B(this.#M);
	}
	set bookmarks(e) {
		j(this.#M, e, !0);
	}
	#N = /* @__PURE__ */ A(M([]));
	get recentStations() {
		return B(this.#N);
	}
	set recentStations(e) {
		j(this.#N, e, !0);
	}
	#P = /* @__PURE__ */ A(null);
	get sleep() {
		return B(this.#P);
	}
	set sleep(e) {
		j(this.#P, e, !0);
	}
	#F = /* @__PURE__ */ A(.8);
	get volume() {
		return B(this.#F);
	}
	set volume(e) {
		j(this.#F, e, !0);
	}
	#I = /* @__PURE__ */ A(!1);
	get muted() {
		return B(this.#I);
	}
	set muted(e) {
		j(this.#I, e, !0);
	}
	#L = /* @__PURE__ */ A(!1);
	get restored() {
		return B(this.#L);
	}
	set restored(e) {
		j(this.#L, e, !0);
	}
	host;
	api;
	storageKey;
	engine = new Oi();
	timers = [];
	toastTimer;
	saveTimer;
	searchTimer;
	searchSeq = 0;
	pendingPlay = 0;
	loadedId = null;
	constructor(e) {
		this.host = e, this.api = e.ondacast, this.supported = !!e.ondacast, this.storageKey = `state:${e.user?.id ?? "local"}`, this.engine.onEnded = () => this.ended(), this.engine.onError = (e) => {
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
		clearTimeout(this.toastTimer), clearTimeout(this.searchTimer), this.saveTimer && (clearTimeout(this.saveTimer), this.persist()), this.engine.destroy();
	}
	get item() {
		return this.now ? this.items[this.now] ?? null : null;
	}
	get live() {
		return this.item?.type === "radio";
	}
	get chapters() {
		let e = this.item;
		return e && X(e) ? e.chapters : [];
	}
	get chapIdx() {
		return Pi(this.chapters, this.pos);
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
		return e ? Ni(e.lines, this.pos, (e) => e.t) : -1;
	}
	get kindLabel() {
		let e = this.item;
		return e ? e.type === "radio" ? "● LIVE RADIO" : di[e.type].toUpperCase() : "";
	}
	get subtitle() {
		let e = this.item;
		if (!e) return "";
		if (e.type !== "radio") return e.sub;
		let t = this.nowPlaying[e.stationId];
		return t ? `${e.sub} · ♪ ${t}` : e.sub;
	}
	get show() {
		return this.showSlug ? this.shows[this.showSlug] ?? this.subscribed[this.showSlug] ?? null : null;
	}
	get episodes() {
		return ((this.showSlug ? this.showEpisodes[this.showSlug] : null)?.ids ?? []).map((e) => this.items[e]).filter((e) => e?.type === "podcast");
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
		let e = this.item && X(this.item) ? { [this.item.id]: {
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
		return [.../* @__PURE__ */ new Set([...this.recentStations, ...this.trending])].filter((e) => this.items[e]).slice(0, 4);
	}
	get genres() {
		let e = /* @__PURE__ */ new Map();
		for (let t of this.trending) {
			let n = this.items[t];
			n?.type === "radio" && e.set(n.genre, (e.get(n.genre) ?? 0) + 1);
		}
		return ["All", ...[...e].sort((e, t) => t[1] - e[1]).map(([e]) => e).slice(0, 8)];
	}
	get stations() {
		return this.trending.map((e) => this.items[e]).filter((e) => e?.type === "radio" && (this.genre === "All" || e.genre === this.genre));
	}
	progressOf(e) {
		return e === this.now ? this.pos : this.progress[e]?.pos ?? 0;
	}
	durOf(e) {
		let t = this.items[e];
		return t && X(t) && (t.dur || this.progress[e]?.dur) || 0;
	}
	speedFor(e) {
		let t = this.items[e];
		return !t || t.type === "radio" ? 1 : this.speeds[fi(t)] ?? 1;
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
		return n ? ji(n) : "";
	}
	leftOf(e) {
		let t = this.items[e], n = this.progressOf(e), r = this.durOf(e);
		return t ? t.type === "radio" ? "Live now" : this.isDone(e) ? "Played" : r ? n > 5 ? `${ji((r - n) / this.speedFor(e))} left` : ji(r) : n > 5 ? `${Ai(n)} in` : "" : "";
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
				let e = Di(await this.api.stations.trending(30), "stations").map(xi).filter((e) => !!e);
				this.remember(e), this.trending = e.map((e) => e.id), this.radioStatus = "ready";
			} catch {
				this.radioStatus = "error";
			}
		}
	}
	async loadShow(e, t = 1) {
		if (!this.api) return;
		let n = this.showEpisodes[e];
		if (n?.status !== "loading") {
			this.showEpisodes = {
				...this.showEpisodes,
				[e]: {
					ids: t === 1 ? [] : n?.ids ?? [],
					page: t,
					hasNext: !1,
					status: "loading"
				}
			};
			try {
				let n = Ei(await this.api.podcasts.get(e, t)), r = Si(Ei(n.podcast));
				if (!r) throw Error("missing show");
				let i = Di(n, "episodes").map((e) => Ci(e, r)).filter((e) => !!e);
				this.shows = {
					...this.shows,
					[e]: r
				}, this.subscribed[e] && (this.subscribed = {
					...this.subscribed,
					[e]: r
				}), this.remember(i);
				let a = t === 1 ? [] : this.showEpisodes[e]?.ids ?? [];
				this.showEpisodes = {
					...this.showEpisodes,
					[e]: {
						ids: [.../* @__PURE__ */ new Set([...a, ...i.map((e) => e.id)])],
						page: t,
						hasNext: Ei(n.pagination).has_next === !0,
						status: "ready"
					}
				};
			} catch {
				this.showEpisodes = {
					...this.showEpisodes,
					[e]: {
						ids: n?.ids ?? [],
						page: n?.page ?? 1,
						hasNext: n?.hasNext ?? !1,
						status: "error"
					}
				};
			}
		}
	}
	async loadPodcastBrowse(e = !1) {
		if (!(!this.api || this.podcastBrowse.status === "loading" || e && !this.podcastBrowse.cursor)) {
			this.podcastBrowse.status = "loading";
			try {
				let t = Ei(await this.api.podcasts.list({
					sort: "last-episode",
					limit: 24,
					cursor: e ? this.podcastBrowse.cursor ?? void 0 : void 0
				})), n = Di(t, "podcasts").map(Si).filter((e) => !!e);
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
	async loadBookBrowse(e = !1) {
		if (!(!this.api || this.bookBrowse.status === "loading" || e && !this.bookBrowse.cursor)) {
			this.bookBrowse.status = "loading";
			try {
				let t = Ei(await this.api.audiobooks.list({
					limit: 24,
					cursor: e ? this.bookBrowse.cursor ?? void 0 : void 0
				})), n = Di(t, "audiobooks").map(wi).filter((e) => !!e);
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
			let t = wi(Ei(Ei(await this.api.audiobooks.get(n)).audiobook));
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
		this.newStatus = "loading", await Promise.all(e.map((e) => this.loadShow(e)));
		let t = e.flatMap((e) => (this.showEpisodes[e]?.ids ?? []).slice(0, 3)).map((e) => this.items[e]).filter((e) => e?.type === "podcast");
		this.newEpisodes = t.sort((e, t) => (t.date || "").localeCompare(e.date || "")).slice(0, 8).map((e) => e.id), this.newStatus = e.some((e) => this.showEpisodes[e]?.status === "ready") ? "ready" : "error";
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
				let i = Ei(n), a = Ti(i).map((e) => ({
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
			let t = Ei(await this.api.stations.nowPlaying(e.stationId)), n = typeof t.title == "string" ? t.title : "", r = typeof t.artist == "string" ? t.artist : "", i = n && n !== "Live broadcast" ? r ? `${n} · ${r}` : n : "";
			this.nowPlaying = {
				...this.nowPlaying,
				[e.stationId]: i
			}, this.mediaSession(!0);
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
			};
			return;
		}
		this.search = {
			...this.search,
			q: t,
			status: "loading"
		};
		let n = ++this.searchSeq;
		this.searchTimer = setTimeout(async () => {
			try {
				let e = Di(await this.api.search(t, "all"), "results");
				if (n !== this.searchSeq) return;
				let r = e.flatMap((e) => {
					let t = e.type;
					return t !== "station" && t !== "podcast" && t !== "audiobook" ? [] : [{
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
					hits: r,
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
			let t = xi(Ei(await this.api?.stations.get(e.id)));
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
		this.showSlug = e, this.tab = "pod", this.query = "", this.search = {
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
		e && e.type !== "radio" && (this.progress = zi({
			...this.progress,
			[e.id]: {
				pos: Math.round(this.pos),
				dur: this.durOf(e.id),
				at: Date.now()
			}
		}, Ki));
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
		this.pos = X(n) && n.dur && r >= n.dur - 5 ? 0 : r, this.queue = Li(this.queue, e), this.speed = this.speedFor(e), n.type === "radio" && (this.recentStations = [e, ...this.recentStations.filter((t) => t !== e)].slice(0, 6)), this.playing = !0, this.sync(!0), n.type === "radio" && this.refreshNowPlaying(), this.rtab === "trans" && this.loadTranscript(), this.scheduleSave();
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
			this.playing = !this.playing, this.playing || this.saveCurrent(), this.sync(), this.scheduleSave();
		}
	}
	next() {
		this.saveCurrent(), this.queue.length ? this.play(this.queue[0]) : (this.playing = !1, this.sync());
	}
	previous() {
		let e = this.item;
		e && X(e) && this.seekTo(Bi(e.chapters, this.pos));
	}
	skip(e) {
		let t = this.item;
		if (!t || !X(t)) return;
		let n = this.durOf(t.id);
		this.seekTo(Math.max(0, n ? Math.min(n, this.pos + e) : this.pos + e));
	}
	seekTo(e) {
		let t = this.item;
		if (t && X(t)) {
			if (this.pos = e, t.type === "book") {
				let { index: n, offset: r } = Ri(t.chapters, e), i = t.chapters[n];
				i?.url && this.engine.load(i.url, r);
			} else this.engine.seek(e);
			this.sync();
		}
	}
	seekFraction(e) {
		let t = this.item;
		if (!t || !X(t)) return;
		let n = this.durOf(t.id);
		n && this.seekTo(Math.round(Math.min(1, Math.max(0, e)) * n));
	}
	ended() {
		let e = this.item;
		if (e) {
			if (e.type === "radio") {
				this.playing = !1, this.say("The station stopped broadcasting."), this.sync();
				return;
			}
			if (e.type === "book") {
				let t = Pi(e.chapters, this.pos + 1), n = e.chapters[t + 1];
				if (n?.url) {
					this.pos = n.start, this.sleep === "chapter" && (this.sleep = null, this.playing = !1, this.say("Sleep timer: paused at end of chapter")), this.engine.load(n.url, 0), this.sync(), this.rtab === "trans" && this.loadTranscript();
					return;
				}
			}
			if (this.sleep === "chapter") {
				this.sleep = null, this.playing = !1, this.sync();
				return;
			}
			this.played = {
				...this.played,
				[e.id]: !0
			}, this.pos = this.durOf(e.id) || this.pos, this.next();
		}
	}
	tick(e = 1) {
		if (!this.playing || this.buffering) return;
		let t = this.item;
		if (!t) return;
		let n;
		X(t) && this.engine.active && (n = (t.type === "book" ? t.chapters[Ri(t.chapters, this.pos).index]?.start ?? 0 : 0) + this.engine.time - this.pos, (n < 0 || n > 10) && (n = 0)), t.type === "podcast" && !t.dur && this.engine.duration && (this.items = {
			...this.items,
			[t.id]: {
				...t,
				dur: Math.round(this.engine.duration)
			}
		});
		let r = X(t) ? this.durOf(t.id) || 2 ** 53 - 1 : 0, i = Vi({
			pos: this.pos,
			speed: this.speed,
			sleep: this.sleep
		}, X(t) ? {
			dur: r,
			chapters: t.type === "book" ? [] : t.chapters
		} : null, e, n);
		this.pos = i.ended ? this.pos : i.pos, this.sleep = i.sleep, this.playing = i.playing, i.reason === "timer" && this.say("Sleep timer ended. Sweet dreams."), i.reason === "chapter" && this.say("Sleep timer: paused at end of chapter"), this.sync(), Math.round(this.pos) % 15 == 0 && (this.saveCurrent(), this.scheduleSave());
	}
	playNext(e) {
		this.queue = Fi(this.queue, e), this.say(`Playing next: ${this.items[e]?.title ?? ""}`), this.scheduleSave();
	}
	addToQueue(e) {
		this.queue = Ii(this.queue, e), this.say("Added to queue"), this.scheduleSave();
	}
	removeFromQueue(e) {
		this.queue = Li(this.queue, e), this.scheduleSave();
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
		n ? delete r[e] : r[e] = t, this.subscribed = r, this.say(n ? `Unsubscribed from ${t.title}` : "Subscribed. New episodes land in Listen now"), this.scheduleSave(), this.loadNewEpisodes();
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
			[fi(t)]: e
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
		let n = X(e), r = n ? this.pos : 0, i = Math.max(0, r - 30), a = this.transcript?.lines ?? [], o = n ? a.filter((e, t) => e.t <= r && (a[t + 1]?.t ?? Infinity) > i) : [], s = e.type === "radio" ? this.nowPlaying[e.stationId] : "", c = /* @__PURE__ */ new Date(), l = e.type === "radio" && s || e.title, u = [
			`# ${l}`,
			"",
			`- **Source:** ${e.type === "radio" ? `${e.title} (live radio)` : e.sub}`,
			n ? `- **Clip:** ${Ai(i)}–${Ai(r)}` : `- **Heard at:** ${c.toLocaleString()}`,
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
			}), this.say(e.type === "radio" ? `Clipped “${l}” to TEND Notes` : `Clip ${Ai(i)}–${Ai(r)} saved to TEND Notes`);
		} catch {
			this.say("Install TEND Notes to save clips");
		}
	}
	bookmark() {
		let e = this.book;
		if (!e) return;
		let t = this.progressOf(e.id), n = Pi(e.chapters, t), r = n >= 0 ? `Chapter ${mi(n)} · ${Ai(t - e.chapters[n].start)}` : Ai(t);
		this.bookmarks = {
			...this.bookmarks,
			[e.id]: [{
				pos: Math.round(t),
				at: Date.now(),
				label: r
			}, ...this.bookmarks[e.id] ?? []].slice(0, 50)
		}, this.say(`Bookmark saved at ${r}`), this.scheduleSave();
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
					let { index: e, offset: n } = Ri(t.chapters, this.pos), r = t.chapters[e];
					r?.url ? this.engine.load(r.url, n) : this.loadedId = null;
				}
			}
			this.engine.apply({
				playing: this.playing,
				rate: this.live ? 1 : this.speed,
				volume: this.muted ? 0 : this.volume * Ui(this.sleep)
			}), this.mediaSession(e);
		}
	}
	mediaSession(e) {
		let t = typeof navigator < "u" ? navigator.mediaSession : void 0;
		if (!t || typeof MediaMetadata > "u" || (t.playbackState = this.playing ? "playing" : "paused", !e && t.metadata)) return;
		let n = this.item;
		if (!n) return;
		let r = n.type === "radio" ? this.nowPlaying[n.stationId] : "";
		t.metadata = new MediaMetadata({
			title: r || n.title,
			artist: r ? n.title : n.sub,
			album: `TEND Media · ${di[n.type]}`,
			artwork: n.art ? [{ src: n.art }] : []
		});
		let i = (e, n) => {
			try {
				t.setActionHandler(e, n);
			} catch {}
		};
		i("play", () => {
			this.playing = !0, this.sync();
		}), i("pause", () => {
			this.playing = !1, this.sync();
		}), i("seekbackward", n.type === "radio" ? null : () => this.skip(-15)), i("seekforward", n.type === "radio" ? null : () => this.skip(30)), i("nexttrack", () => this.next()), i("previoustrack", n.type === "radio" ? null : () => this.previous());
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
			items: t
		};
	}
	async persist() {
		let e = JSON.parse(JSON.stringify(this.snapshot()));
		try {
			this.host.storage ? await this.host.storage.set(this.storageKey, e) : localStorage.setItem(`tend-media:${this.storageKey}`, JSON.stringify(e));
		} catch {}
	}
	async restore() {
		let e = null;
		try {
			e = this.host.storage ? await this.host.storage.get(this.storageKey) : JSON.parse(localStorage.getItem(`tend-media:${this.storageKey}`) ?? "null");
		} catch {}
		let t = e && typeof e == "object" && e.v === 1 ? e : null;
		if (t) {
			this.items = {
				...t.items,
				...this.items
			}, this.progress = t.progress ?? {}, this.played = t.played ?? {}, this.subscribed = t.subscribed ?? {}, this.bookmarks = t.bookmarks ?? {}, this.speeds = t.speeds ?? {}, this.recentStations = (t.recentStations ?? []).filter((e) => this.items[e]), this.queue = (t.queue ?? []).filter((e) => this.items[e]), this.volume = typeof t.volume == "number" ? t.volume : .8, t.now && this.items[t.now] && (this.now = t.now, this.pos = t.pos ?? 0, this.speed = this.speedFor(t.now));
			let e = this.item;
			e?.type === "book" && this.ensureBook(e.id);
		}
		this.restored = !0;
	}
}, Q = {
	play: "M8 5v14l11-7z",
	pause: "M7 5h4v14H7zM13 5h4v14h-4z",
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
	book: "M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h10"
}, Ji = /* @__PURE__ */ Cr("<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path></path></svg>"), Yi = /* @__PURE__ */ Cr("<svg viewBox=\"0 0 24 24\" fill=\"currentColor\" aria-hidden=\"true\"><path></path></svg>");
function $(e, t) {
	let n = li(t, "size", 3, 16), r = li(t, "stroke", 3, 0);
	var i = Tr(), a = P(i), o = (e) => {
		var i = Ji(), a = F(i);
		L(() => {
			Y(i, "width", n()), Y(i, "height", n()), Y(i, "stroke-width", r()), Y(a, "d", t.d);
		}), U(e, i);
	}, s = (e) => {
		var r = Yi(), i = F(r);
		L(() => {
			Y(r, "width", n()), Y(r, "height", n()), Y(i, "d", t.d);
		}), U(e, r);
	};
	G(a, (e) => {
		r() ? e(o) : e(s, -1);
	}), U(e, i);
}
//#endregion
//#region src/components/TopBar.svelte
var Xi = /* @__PURE__ */ H("<header class=\"bar svelte-1h259us\"><div class=\"logo svelte-1h259us\"><svg width=\"11\" height=\"11\" viewBox=\"0 0 24 24\" fill=\"#f1f8ee\" aria-hidden=\"true\"><path></path></svg></div> <span class=\"name svelte-1h259us\">TEND Media</span> <span class=\"by svelte-1h259us\">· powered by OndaCast</span> <div class=\"spacer svelte-1h259us\"></div> <label class=\"search svelte-1h259us\"><!> <input type=\"search\" placeholder=\"Search stations, shows, books\" aria-label=\"Search stations, shows and books\" class=\"svelte-1h259us\"/></label></header>"), Zi = {
	hash: "svelte-1h259us",
	code: ".bar.svelte-1h259us {height:36px;flex:none;display:flex;align-items:center;gap:10px;padding:0 14px;background:var(--tm-panel);border-bottom:1px solid var(--tm-fg-6);}.logo.svelte-1h259us {width:18px;height:18px;border-radius:5px;background:var(--tm-brand);display:grid;place-items:center;}.name.svelte-1h259us {font-size:12px;font-weight:600;letter-spacing:.2px;}.by.svelte-1h259us {font-size:11px;color:var(--tm-muted);}.spacer.svelte-1h259us {flex:1;}.search.svelte-1h259us {display:flex;align-items:center;gap:8px;height:24px;padding:0 10px;border-radius:7px;background:var(--tm-fg-6);width:220px;box-sizing:border-box;color:var(--tm-muted);}.search.svelte-1h259us:focus-within {box-shadow:0 0 0 1px var(--tm-accent);}input.svelte-1h259us {flex:1;min-width:0;border:0;background:none;outline:none;color:var(--tm-fg);font:inherit;font-size:11.5px;padding:0;}input.svelte-1h259us::placeholder {color:var(--tm-muted);opacity:1;}input.svelte-1h259us::-webkit-search-cancel-button {display:none;}"
};
function Qi(e, t) {
	Ke(t, !0), q(e, Zi);
	var n = Xi(), r = N(n), i = F(N(r));
	E(r);
	var a = I(r, 8), o = N(a);
	$(o, {
		get d() {
			return Q.search;
		},
		size: 13,
		stroke: 2
	});
	var s = I(o, 2);
	ni(s), E(a), E(n), L(() => {
		Y(i, "d", Q.play), ri(s, t.store.query);
	}), V("input", s, (e) => t.store.setQuery(e.currentTarget.value)), V("keydown", s, (e) => {
		e.key === "Escape" && t.store.setQuery("");
	}), U(e, n), qe();
}
mr(["input", "keydown"]);
//#endregion
//#region src/components/Cover.svelte
var $i = /* @__PURE__ */ H("<img alt=\"\" loading=\"lazy\" decoding=\"async\" referrerpolicy=\"no-referrer\" class=\"svelte-2fjyqn\"/>"), ea = /* @__PURE__ */ H("<div><!></div>"), ta = {
	hash: "svelte-2fjyqn",
	code: ".cover.svelte-2fjyqn {flex:none;display:grid;place-items:center;overflow:hidden;font-family:ui-monospace, Menlo, monospace;font-weight:600;color:rgba(255, 255, 255, .75);}.cover.fill.svelte-2fjyqn {flex:1;}img.svelte-2fjyqn {width:100%;height:100%;object-fit:cover;display:block;}"
};
function na(e, t) {
	Ke(t, !0), q(e, ta);
	let n = li(t, "radius", 3, 8), r = li(t, "mark", 3, ""), i = li(t, "font", 3, 11), a = li(t, "fill", 3, !1), o = /* @__PURE__ */ A(!1);
	pn(() => {
		t.art, j(o, !1);
	});
	var s = ea();
	let c, l;
	var u = N(s), d = (e) => {
		var n = $i();
		L(() => Y(n, "src", t.art)), pr("error", n, () => j(o, !0)), dr(n), U(e, n);
	}, f = (e) => {
		var t = wr();
		L(() => W(t, r())), U(e, t);
	};
	G(u, (e) => {
		t.art && !B(o) ? e(d) : e(f, -1);
	}), E(s), L((e) => {
		c = J(s, 1, "cover svelte-2fjyqn", null, c, { fill: a() }), l = Zr(s, "", l, {
			width: a() ? "100%" : `${t.size}px`,
			height: a() ? "100%" : `${t.size}px`,
			"border-radius": `${n() ?? ""}px`,
			background: e,
			"font-size": `${i() ?? ""}px`
		});
	}, [() => ki(t.hue)]), U(e, s), qe();
}
//#endregion
//#region src/components/Sidebar.svelte
var ra = /* @__PURE__ */ H("<button><!> </button>"), ia = /* @__PURE__ */ H("<span class=\"dot svelte-181dlmc\" aria-label=\"New episodes\"></span>"), aa = /* @__PURE__ */ H("<button><!> <span class=\"title svelte-181dlmc\"> </span> <!></button>"), oa = /* @__PURE__ */ H("<div class=\"empty svelte-181dlmc\">Subscribe to a show to see it here.</div>"), sa = /* @__PURE__ */ H("<nav class=\"side svelte-181dlmc\" aria-label=\"TEND Media\"><!> <div class=\"heading svelte-181dlmc\">Your shows</div> <!> <div class=\"spacer svelte-181dlmc\"></div> <div class=\"tip svelte-181dlmc\"><b class=\"svelte-181dlmc\">Clips go to Notes.</b> Press the clip button to save the last 30 seconds, with its transcript, to TEND Notes.</div></nav>"), ca = {
	hash: "svelte-181dlmc",
	code: ".side.svelte-181dlmc {width:188px;flex:none;padding:18px 12px;display:flex;flex-direction:column;gap:2px;border-right:1px solid var(--tm-fg-6);box-sizing:border-box;overflow:auto;}.tab.svelte-181dlmc {display:flex;align-items:center;gap:11px;height:36px;flex:none;padding:0 10px;border:0;border-radius:9px;background:transparent;color:var(--tm-fg);font-size:13px;font-weight:500;cursor:pointer;text-align:left;}.tab.svelte-181dlmc:hover {background:var(--tm-fg-6);}.tab.on.svelte-181dlmc {background:var(--tm-accent-12);color:var(--tm-accent);}.heading.svelte-181dlmc {margin:22px 10px 8px;font-size:10.5px;letter-spacing:1px;text-transform:uppercase;color:var(--tm-muted);}.show.svelte-181dlmc {display:flex;align-items:center;gap:10px;padding:6px 10px;font-size:12.5px;color:var(--tm-fg);border:0;border-radius:8px;background:none;cursor:pointer;text-align:left;}.show.svelte-181dlmc:hover {background:var(--tm-fg-4);}.show.on.svelte-181dlmc {background:var(--tm-fg-6);}.title.svelte-181dlmc {flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.dot.svelte-181dlmc {width:6px;height:6px;border-radius:3px;background:var(--tm-accent);flex:none;}.empty.svelte-181dlmc {padding:6px 10px;font-size:11.5px;color:var(--tm-muted);}.spacer.svelte-181dlmc {flex:1;min-height:12px;}.tip.svelte-181dlmc {padding:12px 10px;border-radius:10px;background:var(--tm-accent-8);font-size:11.5px;line-height:1.45;color:var(--tm-muted);}.tip.svelte-181dlmc b:where(.svelte-181dlmc) {color:var(--tm-fg);font-weight:600;}"
};
function la(e, t) {
	Ke(t, !0), q(e, ca);
	let n = li(t, "store", 7), r = [
		[
			"home",
			"Listen now",
			Q.home
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
	], i = /* @__PURE__ */ O(() => Object.values(n().subscribed)), a = (e) => n().newEpisodes.some((t) => {
		let r = n().items[t];
		return r?.type === "podcast" && r.show === e && !n().isDone(t) && !n().progressOf(t);
	});
	var o = sa(), s = N(o);
	K(s, 17, () => r, Ir, (e, t) => {
		var r = /* @__PURE__ */ O(() => m(B(t), 3));
		let i = () => B(r)[0], a = () => B(r)[1], o = () => B(r)[2];
		var s = ra();
		let c;
		var l = N(s);
		$(l, {
			get d() {
				return o();
			},
			size: 17,
			stroke: 1.7
		});
		var u = I(l, 1, !0);
		E(s), L(() => {
			c = J(s, 1, "tab svelte-181dlmc", null, c, { on: n().tab === i() && !n().query }), Y(s, "aria-current", n().tab === i() && !n().query ? "page" : void 0), W(u, a());
		}), V("click", s, () => {
			n().tab = i(), n().setQuery(""), i() === "pod" && (n().showSlug = null), i() === "book" && (n().bookId = null);
		}), U(e, s);
	}), K(I(s, 4), 17, () => B(i), (e) => e.slug, (e, t) => {
		var r = aa();
		let i;
		var o = N(r);
		na(o, {
			get hue() {
				return B(t).hue;
			},
			get art() {
				return B(t).art;
			},
			size: 26,
			radius: 6,
			font: 9,
			get mark() {
				return B(t).mark;
			}
		});
		var s = I(o, 2), c = F(s, !0), l = I(s, 2), u = (e) => {
			U(e, ia());
		}, d = /* @__PURE__ */ O(() => a(B(t).id));
		G(l, (e) => {
			B(d) && e(u);
		}), E(r), L(() => {
			i = J(r, 1, "show svelte-181dlmc", null, i, { on: n().tab === "pod" && n().showSlug === B(t).slug }), W(c, B(t).title);
		}), V("click", r, () => n().openShow(B(t).slug)), U(e, r);
	}, (e) => {
		U(e, oa());
	}), Ee(4), E(o), U(e, o), qe();
}
mr(["click"]);
//#endregion
//#region src/components/ItemRow.svelte
var ua = /* @__PURE__ */ H("<button class=\"icon svelte-ee3n05\" title=\"Play next\"><!></button> <button class=\"icon svelte-ee3n05\" title=\"Add to queue\"><!></button>", 1), da = /* @__PURE__ */ H("<div><!> <div class=\"text svelte-ee3n05\"><div> </div> <div class=\"meta svelte-ee3n05\"> </div></div> <!> <button class=\"play svelte-ee3n05\"><!></button></div>"), fa = {
	hash: "svelte-ee3n05",
	code: ".row.svelte-ee3n05 {display:flex;align-items:center;gap:14px;padding:10px 8px;border-radius:10px;}.row.svelte-ee3n05:hover {background:var(--tm-fg-5);}.row.cur.svelte-ee3n05 {background:var(--tm-accent-8);}.text.svelte-ee3n05 {flex:1;min-width:0;}.title.svelte-ee3n05 {font-size:13px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.cur.svelte-ee3n05 .title:where(.svelte-ee3n05) {color:var(--tm-accent);}.title.done.svelte-ee3n05 {color:var(--tm-muted);}.meta.svelte-ee3n05 {font-size:11.5px;color:var(--tm-muted);margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.icon.svelte-ee3n05 {width:32px;height:32px;flex:none;border:0;border-radius:8px;background:transparent;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;}.icon.svelte-ee3n05:hover {background:var(--tm-fg-8);color:var(--tm-fg);}.play.svelte-ee3n05 {width:34px;height:34px;flex:none;border:0;border-radius:17px;background:var(--tm-accent);color:var(--tm-on-accent);cursor:pointer;display:grid;place-items:center;}"
};
function pa(e, t) {
	Ke(t, !0), q(e, fa);
	let n = /* @__PURE__ */ O(() => t.store.items[t.id]), r = /* @__PURE__ */ O(() => t.id === t.store.now), i = /* @__PURE__ */ O(() => B(n) ? B(n).type === "podcast" ? [
		B(n).sub,
		bi(B(n).date),
		t.store.lenOf(t.id)
	].filter(Boolean).join(" · ") : B(n).type === "radio" ? `${di.radio} · ${B(n).sub}` : `${di.book} · ${B(n).sub}` : "");
	var a = Tr(), o = P(a), s = (e) => {
		var a = da();
		let o;
		var s = N(a);
		na(s, {
			get hue() {
				return B(n).hue;
			},
			get art() {
				return B(n).art;
			},
			get mark() {
				return B(n).mark;
			},
			size: 44
		});
		var c = I(s, 2), l = N(c);
		let u;
		var d = F(l, !0), f = F(I(l, 2), !0);
		E(c);
		var p = I(c, 2), m = (e) => {
			var r = ua(), i = P(r);
			$(N(i), {
				get d() {
					return Q.playNext;
				},
				stroke: 1.8
			}), E(i);
			var a = I(i, 2);
			$(N(a), {
				get d() {
					return Q.plus;
				},
				stroke: 1.8
			}), E(a), L(() => {
				Y(i, "aria-label", `Play next: ${B(n).title ?? ""}`), Y(a, "aria-label", `Add to queue: ${B(n).title ?? ""}`);
			}), V("click", i, () => t.store.playNext(t.id)), V("click", a, () => t.store.addToQueue(t.id)), U(e, r);
		};
		G(p, (e) => {
			B(n).type !== "radio" && e(m);
		});
		var h = I(p, 2), g = N(h);
		{
			let e = /* @__PURE__ */ O(() => t.store.isPlaying(t.id) ? Q.pause : Q.play);
			$(g, {
				get d() {
					return B(e);
				},
				size: 14
			});
		}
		E(h), E(a), L((e, t) => {
			o = J(a, 1, "row svelte-ee3n05", null, o, { cur: B(r) }), u = J(l, 1, "title svelte-ee3n05", null, u, { done: e }), W(d, B(n).title), W(f, B(i)), Y(h, "aria-label", `${t ?? ""} ${B(n).title ?? ""}`);
		}, [() => !B(r) && t.store.isDone(t.id), () => t.store.isPlaying(t.id) ? "Pause" : "Play"]), V("click", h, () => t.store.play(t.id)), U(e, a);
	};
	G(o, (e) => {
		B(n) && e(s);
	}), U(e, a), qe();
}
mr(["click"]);
//#endregion
//#region src/components/Status.svelte
var ma = /* @__PURE__ */ H("<div class=\"line svelte-hcghuu\" role=\"status\"><span class=\"spin svelte-hcghuu\" aria-hidden=\"true\"></span>Loading…</div>"), ha = /* @__PURE__ */ H("<button class=\"svelte-hcghuu\">Try again</button>"), ga = /* @__PURE__ */ H("<div class=\"line svelte-hcghuu\" role=\"alert\"> <!></div>"), _a = /* @__PURE__ */ H("<div class=\"line svelte-hcghuu\"> </div>"), va = {
	hash: "svelte-hcghuu",
	code: ".line.svelte-hcghuu {display:flex;align-items:center;gap:10px;padding:18px 8px;font-size:12.5px;color:var(--tm-muted);}button.svelte-hcghuu {border:0;background:none;color:var(--tm-accent);font-size:12.5px;cursor:pointer;padding:0;}.spin.svelte-hcghuu {width:14px;height:14px;border-radius:50%;border:2px solid var(--tm-fg-16);border-top-color:var(--tm-accent); animation: svelte-hcghuu-spin .8s linear infinite;}\n  @keyframes svelte-hcghuu-spin { to { transform: rotate(360deg); } }\n  @media (prefers-reduced-motion: reduce) {.spin.svelte-hcghuu { animation: none;} }"
};
function ya(e, t) {
	q(e, va);
	let n = li(t, "empty", 3, ""), r = li(t, "error", 3, "OndaCast could not be reached.");
	var i = Tr(), a = P(i), o = (e) => {
		U(e, ma());
	}, s = (e) => {
		var n = ga(), i = N(n, !0), a = I(i), o = (e) => {
			var n = ha();
			V("click", n, function(...e) {
				t.retry?.apply(this, e);
			}), U(e, n);
		};
		G(a, (e) => {
			t.retry && e(o);
		}), E(n), L(() => W(i, r())), U(e, n);
	}, c = (e) => {
		var t = _a(), r = F(t, !0);
		L(() => W(r, n())), U(e, t);
	};
	G(a, (e) => {
		t.status === "loading" ? e(o) : t.status === "error" ? e(s, 1) : n() && e(c, 2);
	}), U(e, i);
}
mr(["click"]);
//#endregion
//#region src/components/HomeView.svelte
var ba = /* @__PURE__ */ H("<button class=\"card svelte-oxdkf2\"><!> <span class=\"ctext svelte-oxdkf2\"><span class=\"kind svelte-oxdkf2\"> </span> <span class=\"ctitle svelte-oxdkf2\"> </span> <span class=\"bar svelte-oxdkf2\"><span class=\"svelte-oxdkf2\"></span></span> <span class=\"left svelte-oxdkf2\"> </span></span></button>"), xa = /* @__PURE__ */ H("<div class=\"continue svelte-oxdkf2\"></div>"), Sa = /* @__PURE__ */ H("<div class=\"start svelte-oxdkf2\"><button class=\"svelte-oxdkf2\">Tune in to live radio</button> <button class=\"svelte-oxdkf2\">Find a podcast</button> <button class=\"svelte-oxdkf2\">Start an audiobook</button></div>"), Ca = /* @__PURE__ */ H("<button><span class=\"banner svelte-oxdkf2\"><!><span class=\"live svelte-oxdkf2\"><i class=\"svelte-oxdkf2\"></i>LIVE</span></span> <span class=\"stext svelte-oxdkf2\"><span class=\"stitle svelte-oxdkf2\"> </span><span class=\"song svelte-oxdkf2\"> </span></span></button>"), wa = /* @__PURE__ */ H("<div class=\"onair svelte-oxdkf2\"></div>"), Ta = /* @__PURE__ */ H("<h1 class=\"h1 svelte-oxdkf2\"> </h1> <p class=\"lede svelte-oxdkf2\">Pick up where you left off across radio, podcasts and books.</p> <!> <div class=\"section svelte-oxdkf2\"><h2 class=\"svelte-oxdkf2\">On air now</h2><button class=\"link svelte-oxdkf2\">All stations</button></div> <!> <h2 class=\"h2 svelte-oxdkf2\">New from your shows</h2> <!>", 1), Ea = {
	hash: "svelte-oxdkf2",
	code: ".h1.svelte-oxdkf2 {font-size:26px;font-weight:650;letter-spacing:-.5px;margin:0;}.lede.svelte-oxdkf2 {font-size:13px;color:var(--tm-muted);margin:4px 0 0;}.continue.svelte-oxdkf2 {display:grid;grid-template-columns:repeat(3, minmax(0, 1fr));gap:12px;margin-top:20px;}.card.svelte-oxdkf2 {display:flex;gap:12px;padding:12px;border:0;border-radius:14px;background:var(--tm-fg-4);color:inherit;cursor:pointer;align-items:center;text-align:left;font:inherit;}.card.svelte-oxdkf2:hover {background:var(--tm-fg-8);}.ctext.svelte-oxdkf2 {min-width:0;flex:1;display:flex;flex-direction:column;gap:4px;}.kind.svelte-oxdkf2 {font-size:10px;letter-spacing:.8px;text-transform:uppercase;color:var(--tm-accent);font-weight:600;}.ctitle.svelte-oxdkf2 {font-size:13px;font-weight:600;line-height:1.25;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.bar.svelte-oxdkf2 {height:3px;border-radius:2px;background:var(--tm-fg-10);margin-top:3px;display:block;}.bar.svelte-oxdkf2 span:where(.svelte-oxdkf2) {display:block;height:3px;border-radius:2px;background:var(--tm-accent);}.left.svelte-oxdkf2 {font-size:11px;color:var(--tm-muted);}.start.svelte-oxdkf2 {display:flex;flex-wrap:wrap;gap:8px;margin-top:18px;}.start.svelte-oxdkf2 button:where(.svelte-oxdkf2) {height:34px;padding:0 16px;border-radius:17px;border:1px solid var(--tm-fg-14);background:var(--tm-fg-4);color:var(--tm-fg);font-size:12.5px;font-weight:600;cursor:pointer;}.start.svelte-oxdkf2 button:where(.svelte-oxdkf2):hover {border-color:var(--tm-accent);}.section.svelte-oxdkf2 {display:flex;align-items:baseline;justify-content:space-between;margin:28px 0 12px;}h2.svelte-oxdkf2 {font-size:15px;font-weight:650;margin:0;}.h2.svelte-oxdkf2 {margin:28px 0 8px;}.link.svelte-oxdkf2 {border:0;background:none;color:var(--tm-accent);font-size:12px;cursor:pointer;padding:0;}.onair.svelte-oxdkf2 {display:grid;grid-template-columns:repeat(4, minmax(0, 1fr));gap:12px;}.station.svelte-oxdkf2 {border:0;padding:0;border-radius:14px;overflow:hidden;background:var(--tm-fg-4);color:inherit;cursor:pointer;text-align:left;font:inherit;display:flex;flex-direction:column;}.station.svelte-oxdkf2:hover {background:var(--tm-fg-8);}.station.cur.svelte-oxdkf2 {box-shadow:inset 0 0 0 1px var(--tm-accent);}.banner.svelte-oxdkf2 {height:78px;display:flex;width:100%;position:relative;}.live.svelte-oxdkf2 {position:absolute;left:10px;top:10px;display:inline-flex;align-items:center;gap:5px;font-size:9.5px;font-weight:700;letter-spacing:.8px;padding:3px 7px;border-radius:20px;background:rgba(0, 0, 0, .45);color:#fff;}.live.svelte-oxdkf2 i:where(.svelte-oxdkf2) {width:5px;height:5px;border-radius:3px;background:var(--tm-live);}.stext.svelte-oxdkf2 {padding:10px 12px 12px;display:flex;flex-direction:column;min-width:0;}.stitle.svelte-oxdkf2 {font-size:12.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.song.svelte-oxdkf2 {font-size:11px;color:var(--tm-muted);margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}"
};
function Da(e, t) {
	Ke(t, !0), q(e, Ea);
	let n = li(t, "store", 7);
	var r = Ta(), i = P(r), a = F(i, !0), o = I(i, 4), s = (e) => {
		var t = xa();
		K(t, 20, () => n().continueIds, (e) => e, (e, t) => {
			let r = /* @__PURE__ */ O(() => n().items[t]);
			var i = ba(), a = N(i);
			na(a, {
				get hue() {
					return B(r).hue;
				},
				get art() {
					return B(r).art;
				},
				size: 58,
				radius: 10,
				get mark() {
					return B(r).mark;
				}
			});
			var o = I(a, 2), s = N(o), c = F(s, !0), l = I(s, 2), u = F(l, !0), d = I(l, 2), f = N(d);
			let p;
			E(d);
			var m = F(I(d, 2), !0);
			E(o), E(i), L((e, t, n) => {
				Y(i, "aria-label", `${e ?? ""} ${B(r).title ?? ""}`), W(c, di[B(r).type]), W(u, B(r).title), p = Zr(f, "", p, { width: t }), W(m, n);
			}, [
				() => n().isPlaying(t) ? "Pause" : "Continue",
				() => `${n().pctOf(t) ?? ""}%`,
				() => n().leftOf(t)
			]), V("click", i, () => n().play(t)), U(e, i);
		}), E(t), U(e, t);
	}, c = (e) => {
		var t = Sa(), r = N(t), i = I(r, 2), a = I(i, 2);
		E(t), V("click", r, () => n().tab = "radio"), V("click", i, () => {
			n().tab = "pod", n().showSlug = null;
		}), V("click", a, () => {
			n().tab = "book", n().bookId = null;
		}), U(e, t);
	};
	G(o, (e) => {
		n().continueIds.length ? e(s) : e(c, -1);
	});
	var l = I(o, 2), u = I(N(l));
	E(l);
	var d = I(l, 2), f = (e) => {
		var t = wa();
		K(t, 20, () => n().onAirIds, (e) => e, (e, t) => {
			let r = /* @__PURE__ */ O(() => n().items[t]);
			var i = Ca();
			let a;
			var o = N(i);
			na(N(o), {
				get hue() {
					return B(r).hue;
				},
				get art() {
					return B(r).art;
				},
				fill: !0,
				radius: 0,
				get mark() {
					return B(r).mark;
				},
				font: 18
			}), Ee(), E(o);
			var s = I(o, 2), c = N(s), l = F(c, !0), u = F(I(c), !0);
			E(s), E(i), L((e) => {
				a = J(i, 1, "station svelte-oxdkf2", null, a, { cur: t === n().now }), Y(i, "aria-label", `${e ?? ""} ${B(r).title ?? ""}`), W(l, B(r).title), W(u, B(r).type === "radio" ? n().nowPlaying[B(r).stationId] ? `♪ ${n().nowPlaying[B(r).stationId]}` : B(r).sub : "");
			}, [() => n().isPlaying(t) ? "Pause" : "Play"]), V("click", i, () => n().play(t)), U(e, i);
		}), E(t), U(e, t);
	}, p = (e) => {
		ya(e, {
			get status() {
				return n().radioStatus;
			},
			retry: () => n().loadRadio(),
			empty: "No stations are on air right now."
		});
	};
	G(d, (e) => {
		n().onAirIds.length ? e(f) : e(p, -1);
	}), K(I(d, 4), 16, () => n().newEpisodes, (e) => e, (e, t) => {
		pa(e, {
			get store() {
				return n();
			},
			get id() {
				return t;
			}
		});
	}, (e) => {
		ya(e, {
			get status() {
				return n().newStatus;
			},
			retry: () => n().loadNewEpisodes(),
			empty: "Subscribe to shows in Podcasts and their new episodes land here."
		});
	}), L((e) => W(a, e), [() => Mi()]), V("click", u, () => n().tab = "radio"), U(e, r), qe();
}
mr(["click"]);
//#endregion
//#region src/components/RadioView.svelte
var Oa = /* @__PURE__ */ H("<button> </button>"), ka = /* @__PURE__ */ H("<div class=\"genres svelte-1c0iuue\" role=\"group\" aria-label=\"Genre\"></div>"), Aa = /* @__PURE__ */ H("<div class=\"song svelte-1c0iuue\"> </div>"), ja = /* @__PURE__ */ H("<div><!> <div class=\"text svelte-1c0iuue\"><div class=\"title svelte-1c0iuue\"> </div> <div class=\"sub svelte-1c0iuue\"> </div> <!></div> <button class=\"play svelte-1c0iuue\"><!></button></div>"), Ma = /* @__PURE__ */ H("<h1 class=\"h1 svelte-1c0iuue\">Radio</h1> <p class=\"lede svelte-1c0iuue\">Live stations from OndaCast. Search above for any station by name, city or genre.</p> <!> <div class=\"grid svelte-1c0iuue\"></div> <!>", 1), Na = {
	hash: "svelte-1c0iuue",
	code: ".h1.svelte-1c0iuue {font-size:26px;font-weight:650;letter-spacing:-.5px;margin:0;}.lede.svelte-1c0iuue {font-size:13px;color:var(--tm-muted);margin:4px 0 0;}.genres.svelte-1c0iuue {display:flex;flex-wrap:wrap;gap:8px;margin-top:18px;}.chip.svelte-1c0iuue {height:30px;padding:0 14px;border-radius:15px;border:1px solid var(--tm-fg-16);background:transparent;color:var(--tm-fg);font-size:12px;font-weight:500;cursor:pointer;}.chip.on.svelte-1c0iuue {border-color:var(--tm-accent);background:var(--tm-accent);color:var(--tm-on-accent);}.grid.svelte-1c0iuue {display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));gap:10px;margin-top:18px;}.row.svelte-1c0iuue {display:flex;align-items:center;gap:14px;padding:12px;border-radius:14px;min-width:0;}.row.svelte-1c0iuue:hover {background:var(--tm-fg-7);}.row.cur.svelte-1c0iuue {background:var(--tm-accent-8);}.text.svelte-1c0iuue {flex:1;min-width:0;}.title.svelte-1c0iuue {font-size:13.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.cur.svelte-1c0iuue .title:where(.svelte-1c0iuue) {color:var(--tm-accent);}.sub.svelte-1c0iuue {font-size:11.5px;color:var(--tm-muted);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.song.svelte-1c0iuue {font-size:11.5px;margin-top:5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;opacity:.85;}.play.svelte-1c0iuue {width:36px;height:36px;border:0;border-radius:18px;background:var(--tm-accent);color:var(--tm-on-accent);cursor:pointer;display:grid;place-items:center;flex:none;}"
};
function Pa(e, t) {
	Ke(t, !0), q(e, Na);
	let n = li(t, "store", 7);
	pn(() => {
		n().radioStatus === "idle" && n().loadRadio();
	});
	var r = Ma(), i = I(P(r), 4), a = (e) => {
		var t = ka();
		K(t, 21, () => n().genres, Ir, (e, t) => {
			var r = Oa();
			let i;
			var a = F(r, !0);
			L(() => {
				i = J(r, 1, "chip svelte-1c0iuue", null, i, { on: n().genre === B(t) }), Y(r, "aria-pressed", n().genre === B(t)), W(a, B(t));
			}), V("click", r, () => n().genre = B(t)), U(e, r);
		}), E(t), U(e, t);
	};
	G(i, (e) => {
		n().genres.length > 2 && e(a);
	});
	var o = I(i, 2);
	K(o, 21, () => n().stations, (e) => e.id, (e, t) => {
		let r = /* @__PURE__ */ O(() => n().nowPlaying[B(t).stationId]);
		var i = ja();
		let a;
		var o = N(i);
		na(o, {
			get hue() {
				return B(t).hue;
			},
			get art() {
				return B(t).art;
			},
			size: 56,
			radius: 12,
			get mark() {
				return B(t).mark;
			},
			font: 12
		});
		var s = I(o, 2), c = N(s), l = F(c, !0), u = I(c, 2), d = F(u, !0), f = I(u, 2), p = (e) => {
			var t = Aa(), n = F(t);
			L(() => W(n, `♪ ${B(r) ?? ""}`)), U(e, t);
		};
		G(f, (e) => {
			B(r) && e(p);
		}), E(s);
		var m = I(s, 2), h = N(m);
		{
			let e = /* @__PURE__ */ O(() => n().isPlaying(B(t).id) ? Q.pause : Q.play);
			$(h, {
				get d() {
					return B(e);
				},
				size: 14
			});
		}
		E(m), E(i), L((e) => {
			a = J(i, 1, "row svelte-1c0iuue", null, a, { cur: B(t).id === n().now }), W(l, B(t).title), W(d, B(t).sub), Y(m, "aria-label", `${e ?? ""} ${B(t).title ?? ""}`);
		}, [() => n().isPlaying(B(t).id) ? "Pause" : "Play"]), V("click", m, () => n().play(B(t).id)), U(e, i);
	}), E(o);
	var s = I(o, 2), c = (e) => {
		ya(e, {
			get status() {
				return n().radioStatus;
			},
			retry: () => n().loadRadio(),
			empty: "No stations in this genre right now."
		});
	};
	G(s, (e) => {
		n().stations.length || e(c);
	}), U(e, r), qe();
}
mr(["click"]);
//#endregion
//#region src/components/Grid.svelte
var Fa = /* @__PURE__ */ H("<button class=\"card svelte-1cebjac\"><span><!></span> <span class=\"title svelte-1cebjac\"> </span> <span class=\"sub svelte-1cebjac\"> </span></button>"), Ia = /* @__PURE__ */ H("<div class=\"grid svelte-1cebjac\"></div>"), La = {
	hash: "svelte-1cebjac",
	code: ".grid.svelte-1cebjac {display:grid;grid-template-columns:repeat(auto-fill, minmax(118px, 1fr));gap:16px 14px;margin-top:16px;}.card.svelte-1cebjac {display:flex;flex-direction:column;gap:3px;padding:0;border:0;background:none;color:inherit;text-align:left;cursor:pointer;font:inherit;min-width:0;}.art.svelte-1cebjac {display:flex;aspect-ratio:1;border-radius:12px;overflow:hidden;box-shadow:0 10px 24px rgba(0, 0, 0, .28);margin-bottom:6px;transition:transform .15s;}.art.tall.svelte-1cebjac {aspect-ratio:0.72;}.card.svelte-1cebjac:hover .art:where(.svelte-1cebjac) {transform:translateY(-2px);}.title.svelte-1cebjac {font-size:12.5px;font-weight:600;line-height:1.25;display:-webkit-box;-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}.sub.svelte-1cebjac {font-size:11px;color:var(--tm-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}\n  @media (prefers-reduced-motion: reduce) {.art.svelte-1cebjac {transition:none;} }"
};
function Ra(e, t) {
	Ke(t, !0), q(e, La);
	let n = li(t, "tall", 3, !1);
	var r = Ia();
	K(r, 21, () => t.cards, (e) => e.key, (e, r) => {
		var i = Fa(), a = N(i);
		let o;
		na(N(a), {
			get hue() {
				return B(r).hue;
			},
			get art() {
				return B(r).art;
			},
			get mark() {
				return B(r).mark;
			},
			fill: !0,
			radius: 12,
			font: 18
		}), E(a);
		var s = I(a, 2), c = F(s, !0), l = F(I(s, 2), !0);
		E(i), L(() => {
			o = J(a, 1, "art svelte-1cebjac", null, o, { tall: n() }), W(c, B(r).title), W(l, B(r).sub);
		}), V("click", i, () => t.open(B(r).key)), U(e, i);
	}), E(r), U(e, r), qe();
}
mr(["click"]);
//#endregion
//#region src/components/PodcastView.svelte
var za = /* @__PURE__ */ H("<button class=\"more svelte-1phe8yx\">Show more</button>"), Ba = /* @__PURE__ */ H("<h1 class=\"h1 svelte-1phe8yx\">Podcasts</h1> <p class=\"lede svelte-1phe8yx\">Recently updated shows on OndaCast. Subscribe and new episodes land in Listen now.</p> <!> <!> <!>", 1), Va = /* @__PURE__ */ H("<div class=\"author svelte-1phe8yx\"> </div>"), Ha = /* @__PURE__ */ H("<div class=\"hero svelte-1phe8yx\"><div class=\"art svelte-1phe8yx\"><!></div> <div class=\"info svelte-1phe8yx\"><div class=\"eyebrow svelte-1phe8yx\"> </div> <h1 class=\"svelte-1phe8yx\"> </h1> <!> <p class=\"desc svelte-1phe8yx\"> </p> <div class=\"actions svelte-1phe8yx\"><button class=\"primary svelte-1phe8yx\"><!>Latest episode</button> <button> </button></div></div></div>"), Ua = /* @__PURE__ */ H("<div class=\"prog svelte-1phe8yx\"><span class=\"bar svelte-1phe8yx\"><span class=\"svelte-1phe8yx\"></span></span><span class=\"left svelte-1phe8yx\"> </span></div>"), Wa = /* @__PURE__ */ H("<div><button class=\"playbtn svelte-1phe8yx\"><!></button> <div class=\"text svelte-1phe8yx\"><div class=\"date svelte-1phe8yx\"> </div> <div> </div> <!></div> <button class=\"pill svelte-1phe8yx\">Play next</button> <button class=\"pill svelte-1phe8yx\">Queue</button> <button><!></button></div>"), Ga = /* @__PURE__ */ H("<button class=\"more svelte-1phe8yx\">Older episodes</button>"), Ka = /* @__PURE__ */ H("<button class=\"back svelte-1phe8yx\">‹ All podcasts</button> <!> <div class=\"listhead svelte-1phe8yx\"><span class=\"svelte-1phe8yx\">Episodes</span><span class=\"spacer svelte-1phe8yx\"></span>Newest first</div> <!> <!> <!>", 1), qa = {
	hash: "svelte-1phe8yx",
	code: ".h1.svelte-1phe8yx {font-size:26px;font-weight:650;letter-spacing:-.5px;margin:0;}.lede.svelte-1phe8yx {font-size:13px;color:var(--tm-muted);margin:4px 0 0;}.more.svelte-1phe8yx {display:block;margin:16px auto 0;height:32px;padding:0 18px;border-radius:16px;border:1px solid var(--tm-fg-14);background:transparent;color:var(--tm-fg);font-size:12px;cursor:pointer;}.back.svelte-1phe8yx {border:0;background:none;color:var(--tm-muted);font-size:12px;cursor:pointer;padding:0;margin:-8px 0 14px;}.back.svelte-1phe8yx:hover {color:var(--tm-fg);}.hero.svelte-1phe8yx {display:flex;gap:22px;align-items:flex-end;}.art.svelte-1phe8yx {border-radius:16px;box-shadow:0 18px 40px rgba(0, 0, 0, .35);flex:none;}.info.svelte-1phe8yx {flex:1;min-width:0;}.eyebrow.svelte-1phe8yx {font-size:10.5px;letter-spacing:1px;text-transform:uppercase;color:var(--tm-accent);font-weight:600;}h1.svelte-1phe8yx {font-size:28px;font-weight:700;letter-spacing:-.6px;margin:4px 0 0;line-height:1.15;}.author.svelte-1phe8yx {font-size:12.5px;margin-top:4px;}.desc.svelte-1phe8yx {font-size:12.5px;color:var(--tm-muted);margin:4px 0 0;text-wrap:pretty;display:-webkit-box;-webkit-line-clamp:3;line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;}.actions.svelte-1phe8yx {display:flex;gap:8px;margin-top:14px;flex-wrap:wrap;}.actions.svelte-1phe8yx button:where(.svelte-1phe8yx) {height:34px;border-radius:17px;cursor:pointer;}.primary.svelte-1phe8yx {padding:0 16px;border:0;background:var(--tm-accent);color:var(--tm-on-accent);font-size:12.5px;font-weight:650;display:flex;align-items:center;gap:7px;}.primary.svelte-1phe8yx:disabled {opacity:.5;cursor:default;}.sub.svelte-1phe8yx {padding:0 16px;border:1px solid var(--tm-fg-18);background:transparent;color:var(--tm-fg);font-size:12.5px;font-weight:600;}.sub.on.svelte-1phe8yx {border-color:var(--tm-accent);background:var(--tm-accent-12);}.listhead.svelte-1phe8yx {display:flex;align-items:center;gap:6px;margin:26px 0 6px;font-size:12px;color:var(--tm-muted);}.listhead.svelte-1phe8yx span:where(.svelte-1phe8yx):first-child {color:var(--tm-fg);font-weight:600;font-size:14px;}.spacer.svelte-1phe8yx {flex:1;}.ep.svelte-1phe8yx {display:flex;align-items:center;gap:14px;padding:14px 8px;border-top:1px solid var(--tm-fg-6);}.ep.cur.svelte-1phe8yx {background:var(--tm-accent-8);}.playbtn.svelte-1phe8yx {width:36px;height:36px;border-radius:18px;border:1px solid var(--tm-fg-18);background:transparent;color:var(--tm-fg);cursor:pointer;display:grid;place-items:center;flex:none;}.playbtn.svelte-1phe8yx:hover {background:var(--tm-accent);color:var(--tm-on-accent);border-color:var(--tm-accent);}.text.svelte-1phe8yx {flex:1;min-width:0;}.date.svelte-1phe8yx {font-size:11px;color:var(--tm-muted);}.title.svelte-1phe8yx {font-size:13.5px;font-weight:600;margin-top:2px;}.cur.svelte-1phe8yx .title:where(.svelte-1phe8yx) {color:var(--tm-accent);}.title.done.svelte-1phe8yx {color:var(--tm-muted);}.prog.svelte-1phe8yx {display:flex;align-items:center;gap:8px;margin-top:6px;}.bar.svelte-1phe8yx {width:70px;height:3px;border-radius:2px;background:var(--tm-fg-10);display:block;}.bar.svelte-1phe8yx span:where(.svelte-1phe8yx) {display:block;height:3px;border-radius:2px;background:var(--tm-accent);}.left.svelte-1phe8yx {font-size:11px;color:var(--tm-muted);}.pill.svelte-1phe8yx {height:28px;padding:0 10px;border:0;border-radius:7px;background:var(--tm-fg-6);color:var(--tm-fg);font-size:11.5px;cursor:pointer;flex:none;}.pill.svelte-1phe8yx:hover {background:var(--tm-fg-12);}.mark.svelte-1phe8yx {width:28px;height:28px;border:0;border-radius:7px;background:transparent;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;flex:none;}.mark.done.svelte-1phe8yx {color:var(--tm-accent);}.mark.svelte-1phe8yx:hover {background:var(--tm-fg-8);}"
};
function Ja(e, t) {
	Ke(t, !0), q(e, qa);
	let n = li(t, "store", 7), r = /* @__PURE__ */ O(() => n().show), i = /* @__PURE__ */ O(() => !!B(r) && !!n().subscribed[B(r).slug]), a = /* @__PURE__ */ O(() => n().showSlug ? n().showEpisodes[n().showSlug] : void 0), o = /* @__PURE__ */ O(() => n().podcastBrowse.slugs.map((e) => n().shows[e]).filter(Boolean).map((e) => ({
		key: e.slug,
		title: e.title,
		sub: e.author || e.category,
		hue: e.hue,
		mark: e.mark,
		art: e.art
	})));
	pn(() => {
		!n().showSlug && n().podcastBrowse.status === "idle" && n().loadPodcastBrowse();
	});
	var s = Tr(), c = P(s), l = (e) => {
		var t = Ba(), r = I(P(t), 4);
		Ra(r, {
			get cards() {
				return B(o);
			},
			open: (e) => n().openShow(e)
		});
		var i = I(r, 2);
		ya(i, {
			get status() {
				return n().podcastBrowse.status;
			},
			retry: () => n().loadPodcastBrowse()
		});
		var a = I(i, 2), s = (e) => {
			var t = za();
			V("click", t, () => n().loadPodcastBrowse(!0)), U(e, t);
		};
		G(a, (e) => {
			n().podcastBrowse.cursor && n().podcastBrowse.status === "ready" && e(s);
		}), U(e, t);
	}, u = (e) => {
		var t = Ka(), o = P(t), s = I(o, 2), c = (e) => {
			var t = Ha(), a = N(t);
			na(N(a), {
				get hue() {
					return B(r).hue;
				},
				get art() {
					return B(r).art;
				},
				size: 132,
				radius: 16,
				get mark() {
					return B(r).mark;
				},
				font: 20
			}), E(a);
			var o = I(a, 2), s = N(o), c = F(s), l = I(s, 2), u = F(l, !0), d = I(l, 2), f = (e) => {
				var t = Va(), n = F(t, !0);
				L(() => W(n, B(r).author)), U(e, t);
			};
			G(d, (e) => {
				B(r).author && e(f);
			});
			var p = I(d, 2), m = F(p, !0), h = I(p, 2), g = N(h);
			$(N(g), {
				get d() {
					return Q.play;
				},
				size: 12
			}), Ee(), E(g);
			var _ = I(g, 2);
			let v;
			var y = F(_, !0);
			E(h), E(o), E(t), L(() => {
				W(c, `Podcast${B(r).category ? ` · ${B(r).category}` : ""}`), W(u, B(r).title), W(m, B(r).desc), g.disabled = !n().episodes.length, v = J(_, 1, "sub svelte-1phe8yx", null, v, { on: B(i) }), Y(_, "aria-pressed", B(i)), W(y, B(i) ? "Subscribed" : "Subscribe");
			}), V("click", g, () => n().episodes[0] && n().play(n().episodes[0].id)), V("click", _, () => n().toggleSubscribe(B(r).slug)), U(e, t);
		};
		G(s, (e) => {
			B(r) && e(c);
		});
		var l = I(s, 4);
		K(l, 17, () => n().episodes, (e) => e.id, (e, t) => {
			let r = /* @__PURE__ */ O(() => n().isDone(B(t).id));
			var i = Wa();
			let a;
			var o = N(i), s = N(o);
			{
				let e = /* @__PURE__ */ O(() => n().isPlaying(B(t).id) ? Q.pause : Q.play);
				$(s, {
					get d() {
						return B(e);
					},
					size: 13
				});
			}
			E(o);
			var c = I(o, 2), l = N(c), u = F(l, !0), d = I(l, 2);
			let f;
			var p = F(d, !0), m = I(d, 2), h = (e) => {
				var i = Ua(), a = N(i), o = N(a);
				let s;
				E(a);
				var c = F(I(a), !0);
				E(i), L((e, t) => {
					s = Zr(o, "", s, { width: e }), W(c, t);
				}, [() => `${(B(r) ? 100 : n().pctOf(B(t).id)) ?? ""}%`, () => n().leftOf(B(t).id)]), U(e, i);
			}, g = /* @__PURE__ */ O(() => n().progressOf(B(t).id) > 5 || B(r));
			G(m, (e) => {
				B(g) && e(h);
			}), E(c);
			var _ = I(c, 2), v = I(_, 2), y = I(v, 2);
			let b;
			$(N(y), {
				get d() {
					return Q.check;
				},
				size: 15,
				stroke: 2
			}), E(y), E(i), L((e, s) => {
				a = J(i, 1, "ep svelte-1phe8yx", null, a, { cur: B(t).id === n().now }), Y(o, "aria-label", `${e ?? ""} ${B(t).title ?? ""}`), W(u, s), f = J(d, 1, "title svelte-1phe8yx", null, f, { done: B(r) && B(t).id !== n().now }), W(p, B(t).title), b = J(y, 1, "mark svelte-1phe8yx", null, b, { done: B(r) }), Y(y, "title", B(r) ? "Mark as unplayed" : "Mark as played"), Y(y, "aria-label", B(r) ? "Mark as unplayed" : "Mark as played"), Y(y, "aria-pressed", B(r));
			}, [() => n().isPlaying(B(t).id) ? "Pause" : "Play", () => [bi(B(t).date), n().lenOf(B(t).id)].filter(Boolean).join(" · ")]), V("click", o, () => n().play(B(t).id)), V("click", _, () => n().playNext(B(t).id)), V("click", v, () => n().addToQueue(B(t).id)), V("click", y, () => n().togglePlayed(B(t).id)), U(e, i);
		});
		var u = I(l, 2);
		{
			let e = /* @__PURE__ */ O(() => B(a)?.status ?? "loading"), t = /* @__PURE__ */ O(() => B(a)?.status === "ready" && !n().episodes.length ? "This show has no playable episodes yet." : "");
			ya(u, {
				get status() {
					return B(e);
				},
				retry: () => n().showSlug && n().loadShow(n().showSlug),
				get empty() {
					return B(t);
				}
			});
		}
		var d = I(u, 2), f = (e) => {
			var t = Ga();
			V("click", t, () => n().showSlug && n().loadShow(n().showSlug, (B(a)?.page ?? 1) + 1)), U(e, t);
		};
		G(d, (e) => {
			B(a)?.hasNext && B(a).status === "ready" && e(f);
		}), V("click", o, () => n().showSlug = null), U(e, t);
	};
	G(c, (e) => {
		n().showSlug ? e(u, -1) : e(l);
	}), U(e, s), qe();
}
mr(["click"]);
//#endregion
//#region src/components/BookView.svelte
var Ya = /* @__PURE__ */ H("<button class=\"more svelte-965svo\">Show more</button>"), Xa = /* @__PURE__ */ H("<h1 class=\"h1 svelte-965svo\">Audiobooks</h1> <p class=\"lede svelte-965svo\">Public-domain classics read by LibriVox volunteers, via OndaCast.</p> <!> <!> <!>", 1), Za = /* @__PURE__ */ H("<div class=\"prog svelte-965svo\"><span class=\"bar svelte-965svo\"><span class=\"svelte-965svo\"></span></span><span class=\"left svelte-965svo\"> </span></div>"), Qa = /* @__PURE__ */ H("<div class=\"mrow svelte-965svo\"><button class=\"mjump svelte-965svo\"> <span class=\"svelte-965svo\"> </span></button> <button class=\"rm svelte-965svo\"><!></button></div>"), $a = /* @__PURE__ */ H("<h2 class=\"svelte-965svo\">Bookmarks</h2> <!>", 1), eo = /* @__PURE__ */ H("<button><span class=\"n svelte-965svo\"> </span> <span class=\"title svelte-965svo\"> </span> <span class=\"state svelte-965svo\"> </span></button>"), to = /* @__PURE__ */ H("<div class=\"hero svelte-965svo\"><div class=\"cover svelte-965svo\"><!></div> <div class=\"info svelte-965svo\"><div class=\"eyebrow svelte-965svo\">Audiobook · Public domain</div> <h1 class=\"svelte-965svo\"> </h1> <p class=\"sub svelte-965svo\"> </p> <!> <div class=\"actions svelte-965svo\"><button class=\"primary svelte-965svo\"><!> </button> <button class=\"ghost svelte-965svo\">Add bookmark</button></div></div></div> <!> <h2 class=\"svelte-965svo\">Chapters</h2> <!>", 1), no = /* @__PURE__ */ H("<button class=\"back svelte-965svo\">‹ All audiobooks</button> <!> <!>", 1), ro = {
	hash: "svelte-965svo",
	code: ".h1.svelte-965svo {font-size:26px;font-weight:650;letter-spacing:-.5px;margin:0;}.lede.svelte-965svo {font-size:13px;color:var(--tm-muted);margin:4px 0 0;}.more.svelte-965svo {display:block;margin:16px auto 0;height:32px;padding:0 18px;border-radius:16px;border:1px solid var(--tm-fg-14);background:transparent;color:var(--tm-fg);font-size:12px;cursor:pointer;}.back.svelte-965svo {border:0;background:none;color:var(--tm-muted);font-size:12px;cursor:pointer;padding:0;margin:-8px 0 14px;}.back.svelte-965svo:hover {color:var(--tm-fg);}.hero.svelte-965svo {display:flex;gap:24px;}.cover.svelte-965svo {width:120px;height:176px;border-radius:6px 12px 12px 6px;flex:none;overflow:hidden;display:flex;box-shadow:0 18px 40px rgba(0, 0, 0, .4), inset 6px 0 0 rgba(0, 0, 0, .18);}.info.svelte-965svo {flex:1;min-width:0;padding-top:6px;}.eyebrow.svelte-965svo {font-size:10.5px;letter-spacing:1px;text-transform:uppercase;color:var(--tm-accent);font-weight:600;}h1.svelte-965svo {font-size:28px;font-weight:700;letter-spacing:-.6px;margin:4px 0 0;line-height:1.15;}.sub.svelte-965svo {font-size:13px;color:var(--tm-muted);margin:4px 0 0;}.prog.svelte-965svo {display:flex;align-items:center;gap:10px;margin-top:16px;}.bar.svelte-965svo {flex:1;max-width:260px;height:4px;border-radius:2px;background:var(--tm-fg-10);display:block;}.bar.svelte-965svo span:where(.svelte-965svo) {display:block;height:4px;border-radius:2px;background:var(--tm-accent);}.left.svelte-965svo {font-size:12px;}.actions.svelte-965svo {display:flex;gap:8px;margin-top:16px;}.actions.svelte-965svo button:where(.svelte-965svo) {height:34px;border-radius:17px;cursor:pointer;}.actions.svelte-965svo button:where(.svelte-965svo):disabled {opacity:.5;cursor:default;}.primary.svelte-965svo {padding:0 16px;border:0;background:var(--tm-accent);color:var(--tm-on-accent);font-size:12.5px;font-weight:650;display:flex;align-items:center;gap:7px;}.ghost.svelte-965svo {padding:0 14px;border:1px solid var(--tm-fg-14);background:transparent;color:var(--tm-fg);font-size:12px;}h2.svelte-965svo {font-size:14px;font-weight:600;margin:26px 0 6px;}.mrow.svelte-965svo {display:flex;align-items:center;border-top:1px solid var(--tm-fg-6);}.mjump.svelte-965svo {flex:1;display:flex;justify-content:space-between;padding:9px 8px;border:0;background:none;color:var(--tm-fg);font:inherit;font-size:12.5px;cursor:pointer;text-align:left;}.mjump.svelte-965svo span:where(.svelte-965svo) {color:var(--tm-muted);font-size:11px;}.mjump.svelte-965svo:hover {background:var(--tm-fg-4);}.rm.svelte-965svo {width:26px;height:26px;border:0;background:none;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;border-radius:6px;}.rm.svelte-965svo:hover {color:var(--tm-fg);background:var(--tm-fg-8);}.chap.svelte-965svo {display:flex;align-items:center;gap:14px;width:100%;padding:10px 8px;border:0;border-top:1px solid var(--tm-fg-6);background:transparent;color:var(--tm-fg);cursor:pointer;text-align:left;font:inherit;}.chap.svelte-965svo:hover {background:var(--tm-fg-4);}.chap.cur.svelte-965svo {background:var(--tm-accent-7);}.n.svelte-965svo {width:30px;flex:none;font:500 11px ui-monospace, Menlo, monospace;color:var(--tm-muted);}.title.svelte-965svo {flex:1;font-size:13px;min-width:0;}.cur.svelte-965svo .title:where(.svelte-965svo) {color:var(--tm-accent);}.done.svelte-965svo .title:where(.svelte-965svo) {color:var(--tm-muted);}.state.svelte-965svo {font-size:11px;color:var(--tm-muted);flex:none;}"
};
function io(e, t) {
	Ke(t, !0), q(e, ro);
	let n = li(t, "store", 7), r = /* @__PURE__ */ O(() => n().book), i = /* @__PURE__ */ O(() => B(r) ? n().progressOf(B(r).id) : 0), a = /* @__PURE__ */ O(() => B(r) ? n().speedFor(B(r).id) : 1), o = /* @__PURE__ */ O(() => B(r) ? Math.max(0, Pi(B(r).chapters, B(i))) : 0), s = /* @__PURE__ */ O(() => !!B(r) && n().isPlaying(B(r).id)), c = /* @__PURE__ */ O(() => B(r) ? n().bookmarks[B(r).id] ?? [] : []), l = /* @__PURE__ */ O(() => n().bookBrowse.ids.map((e) => n().items[e]).filter(Boolean).map((e) => ({
		key: e.id,
		title: e.title,
		sub: e.sub,
		hue: e.hue,
		mark: e.mark,
		art: e.art
	}))), u = (e) => B(r) ? B(r).chapters[e].dur || (B(r).chapters[e + 1]?.start ?? B(r).dur) - B(r).chapters[e].start : 0;
	pn(() => {
		!n().bookId && n().bookBrowse.status === "idle" && n().loadBookBrowse();
	});
	function d(e) {
		B(r) && n().jumpTo(B(r).id, e);
	}
	var f = Tr(), p = P(f), m = (e) => {
		var t = Xa(), r = I(P(t), 4);
		Ra(r, {
			get cards() {
				return B(l);
			},
			tall: !0,
			open: (e) => n().openBook(e)
		});
		var i = I(r, 2);
		ya(i, {
			get status() {
				return n().bookBrowse.status;
			},
			retry: () => n().loadBookBrowse()
		});
		var a = I(i, 2), o = (e) => {
			var t = Ya();
			V("click", t, () => n().loadBookBrowse(!0)), U(e, t);
		};
		G(a, (e) => {
			n().bookBrowse.cursor && n().bookBrowse.status === "ready" && e(o);
		}), U(e, t);
	}, h = (e) => {
		var t = no(), l = P(t), f = I(l, 2), p = (e) => {
			var t = to(), l = P(t), f = N(l);
			na(N(f), {
				get hue() {
					return B(r).hue;
				},
				get art() {
					return B(r).art;
				},
				fill: !0,
				radius: 0,
				get mark() {
					return B(r).mark;
				},
				font: 22
			}), E(f);
			var p = I(f, 2), m = I(N(p), 2), h = F(m, !0), g = I(m, 2), _ = F(g, !0), v = I(g, 2), y = (e) => {
				var t = Za(), n = N(t), o = N(n);
				let s;
				E(n);
				var c = F(I(n));
				E(t), L((e, t, n) => {
					s = Zr(o, "", s, { width: e }), W(c, `${t ?? ""} left at ${n ?? ""}×`);
				}, [
					() => `${Math.round(B(i) / B(r).dur * 100)}%`,
					() => ji((B(r).dur - B(i)) / B(a)),
					() => B(a).toFixed(1)
				]), U(e, t);
			};
			G(v, (e) => {
				B(r).dur && e(y);
			});
			var b = I(v, 2), x = N(b), S = N(x);
			{
				let e = /* @__PURE__ */ O(() => B(s) ? Q.pause : Q.play);
				$(S, {
					get d() {
						return B(e);
					},
					size: 12
				});
			}
			var ee = I(S, 1, !0);
			E(x);
			var te = I(x, 2);
			E(b), E(p), E(l);
			var ne = I(l, 2), re = (e) => {
				var t = $a();
				K(I(P(t), 2), 17, () => B(c), (e) => e.at, (e, t) => {
					var i = Qa(), a = N(i), o = N(a, !0), s = F(I(o), !0);
					E(a);
					var c = I(a, 2);
					$(N(c), {
						get d() {
							return Q.close;
						},
						size: 12,
						stroke: 2
					}), E(c), E(i), L((e) => {
						W(o, B(t).label), W(s, e), Y(c, "aria-label", `Remove bookmark ${B(t).label ?? ""}`);
					}, [() => new Date(B(t).at).toLocaleDateString()]), V("click", a, () => d(B(t).pos)), V("click", c, () => n().removeBookmark(B(r).id, B(t).at)), U(e, i);
				}), U(e, t);
			};
			G(ne, (e) => {
				B(c).length && e(re);
			}), K(I(ne, 4), 17, () => B(r).chapters, Ir, (e, t, n) => {
				var r = eo();
				let a;
				var s = N(r), c = F(s, !0), l = I(s, 2), f = F(l, !0), p = F(I(l, 2), !0);
				E(r), L((e, s) => {
					a = J(r, 1, "chap svelte-965svo", null, a, {
						cur: n === B(o) && B(i) > 0,
						done: n < B(o)
					}), W(c, e), W(f, B(t).title), W(p, s);
				}, [() => mi(n), () => n < B(o) ? "Finished" : n === B(o) && B(i) > 0 && u(n) ? `${Math.min(100, Math.round((B(i) - B(t).start) / u(n) * 100))}%` : u(n) ? ji(u(n)) : ""]), V("click", r, () => d(B(t).start)), U(e, r);
			}), L((e) => {
				W(h, B(r).title), W(_, B(r).sub), x.disabled = !B(r).chapters.length, W(ee, e), te.disabled = B(i) <= 0;
			}, [() => B(s) ? "Pause" : B(i) > 5 ? `Resume chapter ${mi(B(o))}` : "Start listening"]), V("click", x, () => n().play(B(r).id)), V("click", te, () => n().bookmark()), U(e, t);
		};
		G(f, (e) => {
			B(r) && e(p);
		});
		var m = I(f, 2), h = (e) => {
			{
				let t = /* @__PURE__ */ O(() => n().bookStatus[n().bookId] ?? "loading");
				ya(e, {
					get status() {
						return B(t);
					},
					retry: () => n().bookId && n().ensureBook(n().bookId),
					empty: "This audiobook has no playable chapters yet."
				});
			}
		};
		G(m, (e) => {
			B(r)?.chapters.length || e(h);
		}), V("click", l, () => n().bookId = null), U(e, t);
	};
	G(p, (e) => {
		n().bookId ? e(h, -1) : e(m);
	}), U(e, f), qe();
}
mr(["click"]);
//#endregion
//#region src/components/SearchView.svelte
var ao = /* @__PURE__ */ H("<button class=\"row svelte-1occquv\"><!> <span class=\"text svelte-1occquv\"><span class=\"title svelte-1occquv\"> </span><span class=\"meta svelte-1occquv\"> </span></span> <span class=\"act svelte-1occquv\"> </span></button>"), oo = /* @__PURE__ */ H("<h1 class=\"h1 svelte-1occquv\"> </h1> <div class=\"list svelte-1occquv\"></div> <!>", 1), so = {
	hash: "svelte-1occquv",
	code: ".h1.svelte-1occquv {font-size:22px;font-weight:650;letter-spacing:-.4px;margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.list.svelte-1occquv {margin-top:14px;}.row.svelte-1occquv {display:flex;align-items:center;gap:14px;width:100%;padding:10px 8px;border:0;border-radius:10px;background:none;color:inherit;text-align:left;cursor:pointer;font:inherit;}.row.svelte-1occquv:hover {background:var(--tm-fg-5);}.text.svelte-1occquv {flex:1;min-width:0;display:flex;flex-direction:column;}.title.svelte-1occquv {font-size:13px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.meta.svelte-1occquv {font-size:11.5px;color:var(--tm-muted);margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.act.svelte-1occquv {font-size:11.5px;color:var(--tm-accent);flex:none;}"
};
function co(e, t) {
	Ke(t, !0), q(e, so);
	let n = {
		station: "Radio",
		podcast: "Podcast",
		audiobook: "Audiobook"
	}, r = {
		station: "Play",
		podcast: "Open",
		audiobook: "Open"
	};
	var i = oo(), a = P(i), o = F(a), s = I(a, 2);
	K(s, 21, () => t.store.search.hits, (e) => e.kind + e.id, (e, i) => {
		var a = ao(), o = N(a);
		{
			let e = /* @__PURE__ */ O(() => hi(B(i).slug || B(i).id)), t = /* @__PURE__ */ O(() => gi(B(i).title));
			na(o, {
				get hue() {
					return B(e);
				},
				get art() {
					return B(i).art;
				},
				get mark() {
					return B(t);
				},
				size: 44
			});
		}
		var s = I(o, 2), c = N(s), l = F(c, !0), u = F(I(c));
		E(s);
		var d = F(I(s, 2), !0);
		E(a), L(() => {
			W(l, B(i).title), W(u, `${n[B(i).kind] ?? ""}${B(i).subtitle ? ` · ${B(i).subtitle}` : ""}`), W(d, r[B(i).kind]);
		}), V("click", a, () => t.store.openHit(B(i))), U(e, a);
	}), E(s);
	var c = I(s, 2);
	{
		let e = /* @__PURE__ */ O(() => t.store.search.status === "idle" ? "loading" : t.store.search.status), n = /* @__PURE__ */ O(() => t.store.search.status === "ready" && !t.store.search.hits.length ? "Nothing matches. Try a station, show, book or author." : "");
		ya(c, {
			get status() {
				return B(e);
			},
			retry: () => t.store.setQuery(t.store.query),
			get empty() {
				return B(n);
			}
		});
	}
	L((e) => W(o, `Results for “${e ?? ""}”`), [() => t.store.query.trim()]), U(e, i), qe();
}
mr(["click"]);
//#endregion
//#region src/components/NowPlaying.svelte
var lo = /* @__PURE__ */ H("<div class=\"blank svelte-1b7bd5u\"></div>"), uo = /* @__PURE__ */ H("<span class=\"kind svelte-1b7bd5u\"> </span>"), fo = /* @__PURE__ */ H("<button role=\"tab\"> </button>"), po = /* @__PURE__ */ H("<div class=\"q svelte-1b7bd5u\"><!> <button class=\"qtext svelte-1b7bd5u\"><span class=\"qtitle svelte-1b7bd5u\"> </span><span class=\"qmeta svelte-1b7bd5u\"> </span></button> <button class=\"rm svelte-1b7bd5u\"><!></button></div>"), mo = /* @__PURE__ */ H("<div class=\"empty svelte-1b7bd5u\">Queue is empty. Use Play next or Queue on any episode.</div>"), ho = /* @__PURE__ */ H("<button><span class=\"t svelte-1b7bd5u\"> </span><span> </span></button>"), go = /* @__PURE__ */ H("<div class=\"empty svelte-1b7bd5u\"> </div>"), _o = /* @__PURE__ */ H("<button><span class=\"who svelte-1b7bd5u\"> </span> </button>"), vo = /* @__PURE__ */ H("<div></div>"), yo = /* @__PURE__ */ H("<aside class=\"aside svelte-1b7bd5u\" aria-label=\"Now playing\"><div class=\"top svelte-1b7bd5u\"><div class=\"art svelte-1b7bd5u\"><!> <!></div> <div class=\"title svelte-1b7bd5u\"> </div> <div class=\"sub svelte-1b7bd5u\"> </div></div> <div class=\"tabs svelte-1b7bd5u\" role=\"tablist\"></div> <div class=\"body svelte-1b7bd5u\" role=\"tabpanel\"><!></div></aside>"), bo = {
	hash: "svelte-1b7bd5u",
	code: ".aside.svelte-1b7bd5u {width:300px;flex:none;background:var(--tm-panel);display:flex;flex-direction:column;min-height:0;}.top.svelte-1b7bd5u {padding:20px 20px 14px;}.art.svelte-1b7bd5u {width:100%;aspect-ratio:1.45;border-radius:14px;position:relative;overflow:hidden;display:flex;box-shadow:0 14px 36px rgba(0, 0, 0, .35);}.blank.svelte-1b7bd5u {flex:1;background:var(--tm-fg-6);}.kind.svelte-1b7bd5u {position:absolute;left:12px;top:12px;font-size:9.5px;font-weight:700;letter-spacing:.8px;padding:3px 8px;border-radius:20px;background:rgba(0, 0, 0, .45);color:#fff;}.title.svelte-1b7bd5u {font-size:15px;font-weight:650;margin-top:14px;line-height:1.3;text-wrap:pretty;display:-webkit-box;-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}.sub.svelte-1b7bd5u {font-size:12px;color:var(--tm-muted);margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.tabs.svelte-1b7bd5u {display:flex;gap:4px;padding:0 16px;border-bottom:1px solid var(--tm-fg-7);}.tabs.svelte-1b7bd5u button:where(.svelte-1b7bd5u) {height:34px;padding:0 8px;border:0;background:none;color:var(--tm-muted);font-size:12px;font-weight:600;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;}.tabs.svelte-1b7bd5u button.on:where(.svelte-1b7bd5u) {color:var(--tm-fg);border-bottom-color:var(--tm-accent);}.body.svelte-1b7bd5u {flex:1;min-height:0;overflow:auto;padding:8px 12px 12px;}.q.svelte-1b7bd5u {display:flex;align-items:center;gap:10px;padding:7px 8px;border-radius:9px;}.q.svelte-1b7bd5u:hover {background:var(--tm-fg-5);}.qtext.svelte-1b7bd5u {flex:1;min-width:0;display:flex;flex-direction:column;border:0;padding:0;background:none;color:inherit;text-align:left;cursor:pointer;font:inherit;}.qtitle.svelte-1b7bd5u {font-size:12px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.qmeta.svelte-1b7bd5u {font-size:11px;color:var(--tm-muted);margin-top:2px;}.rm.svelte-1b7bd5u {width:24px;height:24px;border:0;background:none;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;flex:none;border-radius:6px;}.rm.svelte-1b7bd5u:hover {color:var(--tm-fg);background:var(--tm-fg-8);}.empty.svelte-1b7bd5u {padding:24px 8px;font-size:12px;color:var(--tm-muted);text-align:center;}.chap.svelte-1b7bd5u {display:flex;gap:10px;width:100%;padding:8px;border:0;border-radius:8px;background:transparent;color:var(--tm-fg);cursor:pointer;text-align:left;font:inherit;font-size:12.5px;}.chap.svelte-1b7bd5u:hover {background:var(--tm-fg-5);}.chap.cur.svelte-1b7bd5u {background:var(--tm-accent-8);color:var(--tm-accent);}.t.svelte-1b7bd5u {font:500 11px ui-monospace, Menlo, monospace;color:var(--tm-muted);width:52px;flex:none;padding-top:1px;}.line.svelte-1b7bd5u {display:block;width:100%;padding:7px 8px;border:0;border-radius:8px;background:transparent;cursor:pointer;text-align:left;font:inherit;font-size:13px;line-height:1.5;color:var(--tm-fg-45);}.line.svelte-1b7bd5u:hover {background:var(--tm-fg-4);}.line.cur.svelte-1b7bd5u {color:var(--tm-fg);background:var(--tm-accent-8);}.who.svelte-1b7bd5u {display:block;font:500 10px ui-monospace, Menlo, monospace;color:var(--tm-muted);margin-bottom:2px;}"
};
function xo(e, t) {
	Ke(t, !0), q(e, bo);
	let n = li(t, "store", 7), r = /* @__PURE__ */ O(() => n().item), i = /* @__PURE__ */ O(() => [
		["queue", `Up next · ${n().queue.length}`],
		["chaps", "Chapters"],
		["trans", "Transcript"]
	]), a = /* @__PURE__ */ O(() => n().transcript?.lines ?? []), o = /* @__PURE__ */ A(void 0);
	pn(() => {
		n().rtab === "trans" && n().transcriptKey && n().loadTranscript();
	}), pn(() => {
		let e = n().lineIdx;
		n().rtab !== "trans" || e < 0 || B(o)?.querySelectorAll(".line")[e]?.scrollIntoView({
			block: "nearest",
			behavior: "smooth"
		});
	});
	let s = /* @__PURE__ */ O(() => {
		let e = n().transcript;
		return B(r) ? B(r).type === "radio" ? "Live radio has no transcript." : !e || e.state === "loading" ? "Loading transcript…" : e.state === "queued" || e.state === "running" ? "OndaCast is preparing a transcript. Check back in a few minutes." : e.state === "error" ? "The transcript could not be loaded." : "No transcript for this item yet." : "Nothing is playing.";
	});
	var c = yo(), l = N(c), u = N(l), d = N(u), f = (e) => {
		na(e, {
			get hue() {
				return B(r).hue;
			},
			get art() {
				return B(r).art;
			},
			fill: !0,
			radius: 0,
			get mark() {
				return B(r).mark;
			},
			font: 26
		});
	}, p = (e) => {
		U(e, lo());
	};
	G(d, (e) => {
		B(r) ? e(f) : e(p, -1);
	});
	var h = I(d, 2), g = (e) => {
		var t = uo(), r = F(t, !0);
		L(() => W(r, n().kindLabel)), U(e, t);
	};
	G(h, (e) => {
		B(r) && e(g);
	}), E(u);
	var _ = I(u, 2), v = F(_, !0), y = F(I(_, 2), !0);
	E(l);
	var b = I(l, 2);
	K(b, 21, () => B(i), Ir, (e, t) => {
		var r = /* @__PURE__ */ O(() => m(B(t), 2));
		let i = () => B(r)[0], a = () => B(r)[1];
		var o = fo();
		let s;
		var c = F(o, !0);
		L(() => {
			Y(o, "aria-selected", n().rtab === i()), s = J(o, 1, "svelte-1b7bd5u", null, s, { on: n().rtab === i() }), W(c, a());
		}), V("click", o, () => n().rtab = i()), U(e, o);
	}), E(b);
	var x = I(b, 2), S = N(x), ee = (e) => {
		var t = Tr();
		K(P(t), 16, () => n().queue, (e) => e, (e, t) => {
			let r = /* @__PURE__ */ O(() => n().items[t]);
			var i = Tr(), a = P(i), o = (e) => {
				var i = po(), a = N(i);
				na(a, {
					get hue() {
						return B(r).hue;
					},
					get art() {
						return B(r).art;
					},
					get mark() {
						return B(r).mark;
					},
					size: 34,
					radius: 7,
					font: 9
				});
				var o = I(a, 2), s = N(o), c = F(s, !0), l = F(I(s));
				E(o);
				var u = I(o, 2);
				$(N(u), {
					get d() {
						return Q.close;
					},
					size: 12,
					stroke: 2
				}), E(u), E(i), L((e) => {
					W(c, B(r).title), W(l, `${di[B(r).type] ?? ""}${e ?? ""}`), Y(u, "aria-label", `Remove ${B(r).title ?? ""} from queue`);
				}, [() => n().lenOf(t) ? ` · ${n().lenOf(t)}` : ""]), V("click", o, () => n().play(t)), V("click", u, () => n().removeFromQueue(t)), U(e, i);
			};
			G(a, (e) => {
				B(r) && e(o);
			}), U(e, i);
		}, (e) => {
			U(e, mo());
		}), U(e, t);
	}, te = (e) => {
		var t = Tr(), i = P(t), a = (e) => {
			var t = Tr();
			K(P(t), 17, () => B(r).chapters, Ir, (e, t, r) => {
				var i = ho();
				let a;
				var o = N(i), s = F(o, !0), c = F(I(o), !0);
				E(i), L((e) => {
					a = J(i, 1, "chap svelte-1b7bd5u", null, a, { cur: r === n().chapIdx }), W(s, e), W(c, B(t).title);
				}, [() => Ai(B(t).start)]), V("click", i, () => n().seekTo(B(t).start)), U(e, i);
			}), U(e, t);
		}, o = /* @__PURE__ */ O(() => B(r) && X(B(r)) && B(r).chapters.length), s = (e) => {
			var t = go(), n = F(t, !0);
			L(() => W(n, B(r)?.type === "radio" ? "Live radio has no chapters." : B(r) ? "This episode has no chapters." : "Nothing is playing.")), U(e, t);
		};
		G(i, (e) => {
			B(o) ? e(a) : e(s, -1);
		}), U(e, t);
	}, ne = (e) => {
		var t = vo();
		K(t, 21, () => B(a), Ir, (e, t, r) => {
			var i = _o();
			let a;
			var o = N(i), s = F(o), c = I(o, 1, !0);
			E(i), L((e) => {
				a = J(i, 1, "line svelte-1b7bd5u", null, a, { cur: r === n().lineIdx }), W(s, `${B(t).who ? `${B(t).who} · ` : ""}${e ?? ""}`), W(c, B(t).text);
			}, [() => Ai(B(t).t)]), V("click", i, () => n().seekTo(B(t).t)), U(e, i);
		}, (e) => {
			var t = go(), n = F(t, !0);
			L(() => W(n, B(s))), U(e, t);
		}), E(t), ci(t, (e) => j(o, e), () => B(o)), U(e, t);
	};
	G(S, (e) => {
		n().rtab === "queue" ? e(ee) : n().rtab === "chaps" ? e(te, 1) : e(ne, -1);
	}), E(x), E(c), L(() => {
		W(v, B(r)?.title ?? "Nothing playing"), W(y, B(r) ? n().subtitle : "Pick a station, episode or book.");
	}), U(e, c), qe();
}
mr(["click"]);
//#endregion
//#region src/components/SeekBar.svelte
var So = /* @__PURE__ */ H("<div class=\"tick svelte-qmop01\"></div>"), Co = /* @__PURE__ */ H("<div role=\"slider\" aria-label=\"Playback position\"><div class=\"track svelte-qmop01\"><div class=\"fill svelte-qmop01\"></div> <!></div></div>"), wo = {
	hash: "svelte-qmop01",
	code: ".seek.svelte-qmop01 {flex:1;display:flex;align-items:center;cursor:pointer;border-radius:4px;}.seek.live.svelte-qmop01 {cursor:default;}.seek.svelte-qmop01:focus-visible {outline:2px solid var(--tm-accent);outline-offset:2px;}.track.svelte-qmop01 {flex:1;height:4px;border-radius:2px;background:var(--tm-fg-12);position:relative;}.fill.svelte-qmop01 {position:absolute;left:0;top:0;bottom:0;border-radius:2px;background:var(--tm-accent);}.live.svelte-qmop01 .fill:where(.svelte-qmop01) {opacity:.55;}.tick.svelte-qmop01 {position:absolute;top:-1px;width:2px;height:6px;background:var(--tm-panel);}"
};
function To(e, t) {
	Ke(t, !0), q(e, wo);
	let n = li(t, "height", 3, 14), r = li(t, "ticks", 3, !1), i = /* @__PURE__ */ O(() => t.store.item), a = /* @__PURE__ */ O(() => B(i) ? t.store.durOf(B(i).id) : 0), o = /* @__PURE__ */ O(() => !!B(i) && X(B(i)) && B(a) > 0), s = /* @__PURE__ */ O(() => B(i) ? X(B(i)) ? B(a) ? Math.min(100, t.store.pos / B(a) * 100) : 0 : 100 : 0), c = /* @__PURE__ */ O(() => r() && B(i) && X(B(i)) && B(a) ? B(i).chapters.slice(1).map((e) => e.start / B(a) * 100) : []);
	function l(e) {
		if (!B(o)) return;
		let n = e.currentTarget.getBoundingClientRect();
		t.store.seekFraction((e.clientX - n.left) / n.width);
	}
	function u(e) {
		if (!B(o)) return;
		let n = {
			ArrowLeft: -15,
			ArrowRight: 30,
			PageDown: -60,
			PageUp: 60
		}[e.key];
		n ? (e.preventDefault(), t.store.skip(n)) : e.key === "Home" ? (e.preventDefault(), t.store.seekFraction(0)) : e.key === "End" && (e.preventDefault(), t.store.seekFraction(1));
	}
	var d = Co();
	let f;
	Y(d, "aria-valuemin", 0), Y(d, "aria-valuemax", 100);
	let p;
	var m = N(d), h = N(m);
	let g;
	K(I(h, 2), 17, () => B(c), Ir, (e, t) => {
		var n = So();
		let r;
		L(() => r = Zr(n, "", r, { left: `${B(t) ?? ""}%` })), U(e, n);
	}), E(m), E(d), L((e, t) => {
		f = J(d, 1, "seek svelte-qmop01", null, f, { live: !B(o) }), Y(d, "tabindex", B(o) ? 0 : -1), Y(d, "aria-disabled", !B(o)), Y(d, "aria-valuenow", e), Y(d, "aria-valuetext", t), p = Zr(d, "", p, { height: `${n() ?? ""}px` }), g = Zr(h, "", g, { width: `${B(s) ?? ""}%` });
	}, [() => Math.round(B(s)), () => B(o) ? `${Ai(t.store.pos)} of ${Ai(B(a))}` : "Live"]), V("click", d, l), V("keydown", d, u), U(e, d), qe();
}
mr(["click", "keydown"]);
//#endregion
//#region src/components/SleepPopover.svelte
var Eo = /* @__PURE__ */ H("<button> </button>"), Do = /* @__PURE__ */ H("<div class=\"tm-pop\" role=\"dialog\" aria-label=\"Sleep timer\"><div class=\"title svelte-1mpzphw\">Sleep timer</div> <div class=\"hint svelte-1mpzphw\">Audio fades out over the last minute.</div> <div class=\"grid svelte-1mpzphw\"></div> <button> </button> <button class=\"off svelte-1mpzphw\">Turn off</button></div>"), Oo = {
	hash: "svelte-1mpzphw",
	code: ".title.svelte-1mpzphw {font-size:13px;font-weight:650;}.hint.svelte-1mpzphw {font-size:11px;color:var(--tm-muted);margin-top:2px;}.grid.svelte-1mpzphw {display:grid;grid-template-columns:repeat(3, 1fr);gap:6px;margin-top:12px;}.opt.svelte-1mpzphw {height:34px;border-radius:9px;border:0;background:var(--tm-fg-6);color:var(--tm-fg);font-size:12px;font-weight:600;cursor:pointer;}.opt.svelte-1mpzphw:hover {background:var(--tm-fg-10);}.opt.sel.svelte-1mpzphw {background:var(--tm-accent);color:var(--tm-on-accent);}.wide.svelte-1mpzphw {width:100%;margin-top:6px;}.off.svelte-1mpzphw {width:100%;height:30px;margin-top:6px;border:0;background:none;color:var(--tm-muted);font-size:12px;cursor:pointer;}.off.svelte-1mpzphw:hover {color:var(--tm-fg);}"
};
function ko(e, t) {
	Ke(t, !0), q(e, Oo);
	let n = (e) => typeof t.store.sleep == "number" && Math.ceil(t.store.sleep / 60) === e;
	var r = Do(), i = I(N(r), 4);
	K(i, 21, () => Gi, Ir, (e, r) => {
		var i = Eo();
		let a;
		var o = F(i);
		L((e) => {
			a = J(i, 1, "opt svelte-1mpzphw", null, a, { sel: e }), W(o, `${B(r) ?? ""} min`);
		}, [() => n(B(r))]), V("click", i, () => t.store.setSleepMinutes(B(r))), U(e, i);
	}), E(i);
	var a = I(i, 2);
	let o;
	var s = F(a, !0), c = I(a, 2);
	E(r), L(() => {
		Zr(r, t.pos), o = J(a, 1, "opt wide svelte-1mpzphw", null, o, { sel: t.store.sleep === "chapter" }), W(s, t.store.live ? "End of current show" : t.store.chapters.length > 1 ? "End of chapter" : "End of episode");
	}), V("click", a, () => t.store.sleepAtEnd()), V("click", c, () => t.store.sleepOff()), U(e, r), qe();
}
mr(["click"]);
//#endregion
//#region src/components/SpeedPopover.svelte
var Ao = /* @__PURE__ */ H("<button> </button>"), jo = /* @__PURE__ */ H("<div class=\"tm-pop\" role=\"dialog\" aria-label=\"Playback speed\"><div class=\"head svelte-1xvntbg\"><span class=\"title svelte-1xvntbg\">Playback speed</span><span class=\"now svelte-1xvntbg\"> </span></div> <div class=\"hint svelte-1xvntbg\"> </div> <div class=\"grid svelte-1xvntbg\"></div></div>"), Mo = {
	hash: "svelte-1xvntbg",
	code: ".head.svelte-1xvntbg {display:flex;align-items:baseline;justify-content:space-between;}.title.svelte-1xvntbg {font-size:13px;font-weight:650;}.now.svelte-1xvntbg {font:600 12px ui-monospace, Menlo, monospace;color:var(--tm-accent);}.hint.svelte-1xvntbg {font-size:11px;color:var(--tm-muted);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.grid.svelte-1xvntbg {display:grid;grid-template-columns:repeat(4, 1fr);gap:6px;margin-top:12px;}.opt.svelte-1xvntbg {height:32px;border-radius:9px;border:0;background:var(--tm-fg-6);color:var(--tm-fg);font:600 11.5px ui-monospace, Menlo, monospace;cursor:pointer;}.opt.svelte-1xvntbg:hover {background:var(--tm-fg-10);}.opt.sel.svelte-1xvntbg {background:var(--tm-accent);color:var(--tm-on-accent);}"
};
function No(e, t) {
	Ke(t, !0), q(e, Mo);
	var n = jo(), r = N(n), i = F(I(N(r)));
	E(r);
	var a = I(r, 2), o = F(a), s = I(a, 2);
	K(s, 21, () => Wi, Ir, (e, n) => {
		var r = Ao();
		let i;
		var a = F(r);
		L((e) => {
			i = J(r, 1, "opt svelte-1xvntbg", null, i, { sel: t.store.speed === B(n) }), W(a, `${e ?? ""}×`);
		}, [() => B(n).toFixed(1)]), V("click", r, () => t.store.setSpeed(B(n))), U(e, r);
	}), E(s), E(n), L((e) => {
		Zr(n, t.pos), W(i, `${e ?? ""}×`), W(o, `Remembered for ${t.store.speedScope ?? ""}.`);
	}, [() => t.store.speed.toFixed(1)]), U(e, n), qe();
}
mr(["click"]);
//#endregion
//#region src/components/PlayerBar.svelte
var Po = /* @__PURE__ */ H("<div class=\"thumb svelte-y66ne\"></div>"), Fo = /* @__PURE__ */ H("<span class=\"live svelte-y66ne\">LIVE</span>"), Io = /* @__PURE__ */ H("<span class=\"time r svelte-y66ne\"> </span>"), Lo = /* @__PURE__ */ H("<footer class=\"bar svelte-y66ne\"><div class=\"now svelte-y66ne\"><!> <div class=\"ntext svelte-y66ne\"><div class=\"ntitle svelte-y66ne\"> </div><div class=\"nsub svelte-y66ne\"> </div></div></div> <div class=\"center svelte-y66ne\"><div class=\"controls svelte-y66ne\"><button class=\"skipc svelte-y66ne\" aria-label=\"Previous chapter\"><!></button> <button class=\"jump svelte-y66ne\" aria-label=\"Back 15 seconds\">−15</button> <button><!></button> <button class=\"jump svelte-y66ne\" aria-label=\"Forward 30 seconds\">+30</button> <button class=\"skipc svelte-y66ne\" aria-label=\"Next in queue\"><!></button></div> <div class=\"timeline svelte-y66ne\"><span class=\"time l svelte-y66ne\"> </span> <!> <!></div></div> <div class=\"tools svelte-y66ne\"><button data-pop=\"\" aria-haspopup=\"dialog\"> </button> <button data-pop=\"\" title=\"Sleep timer\" aria-haspopup=\"dialog\"><!> </button> <button class=\"clip svelte-y66ne\" title=\"Clip to Notes\"><!></button> <div class=\"vol svelte-y66ne\"><button class=\"mute svelte-y66ne\"><!></button> <div class=\"vtrack svelte-y66ne\" role=\"slider\" tabindex=\"0\" aria-label=\"Volume\"><div class=\"vfill svelte-y66ne\"></div></div></div></div> <!> <!></footer>"), Ro = {
	hash: "svelte-y66ne",
	code: ".bar.svelte-y66ne {height:80px;flex:none;display:flex;align-items:center;gap:18px;padding:0 18px;background:var(--tm-panel);border-top:1px solid var(--tm-fg-7);position:relative;}.now.svelte-y66ne {width:240px;display:flex;align-items:center;gap:11px;min-width:0;flex:none;}.thumb.svelte-y66ne {width:46px;height:46px;border-radius:9px;flex:none;background:var(--tm-fg-6);}.ntext.svelte-y66ne {min-width:0;}.ntitle.svelte-y66ne {font-size:12.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.nsub.svelte-y66ne {font-size:11px;color:var(--tm-muted);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.center.svelte-y66ne {flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;gap:6px;}.controls.svelte-y66ne {display:flex;align-items:center;gap:14px;}button.svelte-y66ne:disabled {opacity:.35;cursor:default;}.skipc.svelte-y66ne {width:30px;height:30px;border:0;background:none;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;}.skipc.svelte-y66ne:hover:not(:disabled) {color:var(--tm-fg);}.jump.svelte-y66ne {width:32px;height:32px;border:0;background:none;color:var(--tm-fg);cursor:pointer;font:600 10.5px ui-monospace, Menlo, monospace;border-radius:16px;}.jump.svelte-y66ne:hover:not(:disabled) {background:var(--tm-fg-8);}.toggle.svelte-y66ne {width:42px;height:42px;border:0;border-radius:21px;background:var(--tm-fg);color:var(--tm-bg);cursor:pointer;display:grid;place-items:center;position:relative;}.toggle.svelte-y66ne:hover:not(:disabled) {filter:brightness(1.12);}.toggle.busy.svelte-y66ne::after {content:'';position:absolute;inset:-4px;border-radius:50%;border:2px solid transparent;border-top-color:var(--tm-accent); animation: svelte-y66ne-spin .9s linear infinite;}\n  @keyframes svelte-y66ne-spin { to { transform: rotate(360deg); } }\n  @media (prefers-reduced-motion: reduce) {.toggle.busy.svelte-y66ne::after { animation: none;border-color:var(--tm-accent);} }.timeline.svelte-y66ne {display:flex;align-items:center;gap:10px;width:100%;max-width:440px;}.time.svelte-y66ne {font:500 10.5px ui-monospace, Menlo, monospace;color:var(--tm-muted);width:52px;flex:none;}.time.l.svelte-y66ne {text-align:right;}.live.svelte-y66ne {width:52px;height:20px;flex:none;display:grid;place-items:center;border-radius:10px;background:var(--tm-live);color:#fff;font-size:9.5px;font-weight:700;letter-spacing:.8px;}.tools.svelte-y66ne {width:240px;flex:none;display:flex;align-items:center;justify-content:flex-end;gap:6px;}.speed.svelte-y66ne {height:30px;min-width:44px;padding:0 8px;border:0;border-radius:8px;background:transparent;color:var(--tm-fg);font:600 11.5px ui-monospace, Menlo, monospace;cursor:pointer;}.speed.on.svelte-y66ne {background:var(--tm-accent-14);}.sleep.svelte-y66ne {height:30px;padding:0 8px;border:0;border-radius:8px;background:transparent;color:var(--tm-fg);cursor:pointer;display:flex;align-items:center;gap:5px;font:600 11px ui-monospace, Menlo, monospace;}.sleep.on.svelte-y66ne {background:var(--tm-accent-14);color:var(--tm-accent);}.speed.svelte-y66ne:hover:not(:disabled), .sleep.svelte-y66ne:hover:not(:disabled), .clip.svelte-y66ne:hover:not(:disabled) {background:var(--tm-fg-10);}.clip.svelte-y66ne {height:30px;width:32px;border:0;border-radius:8px;background:transparent;color:var(--tm-fg);cursor:pointer;display:grid;place-items:center;}.vol.svelte-y66ne {display:flex;align-items:center;gap:6px;margin-left:4px;color:var(--tm-muted);}.mute.svelte-y66ne {border:0;background:none;padding:0;color:inherit;cursor:pointer;display:grid;place-items:center;}.mute.svelte-y66ne:hover {color:var(--tm-fg);}.vtrack.svelte-y66ne {width:64px;height:12px;display:flex;align-items:center;cursor:pointer;position:relative;background:linear-gradient(var(--tm-fg-12), var(--tm-fg-12)) center / 100% 4px no-repeat;border-radius:2px;}.vfill.svelte-y66ne {height:4px;border-radius:2px;background:var(--tm-fg);}.vtrack.svelte-y66ne:focus-visible {outline:2px solid var(--tm-accent);outline-offset:2px;}"
};
function zo(e, t) {
	Ke(t, !0), q(e, Ro);
	let n = /* @__PURE__ */ O(() => t.store.item), r = /* @__PURE__ */ O(() => !!B(n) && X(B(n))), i = /* @__PURE__ */ O(() => B(n) ? t.store.durOf(B(n).id) : 0), a = /* @__PURE__ */ O(() => typeof t.store.sleep == "number" ? Ai(t.store.sleep) : t.store.sleep === "chapter" ? "End" : ""), o = /* @__PURE__ */ O(() => t.store.buffering || t.store.loadingItem);
	function s(e) {
		let n = e.currentTarget.getBoundingClientRect();
		t.store.setVolume((e.clientX - n.left) / n.width);
	}
	function c(e) {
		let n = {
			ArrowLeft: -.1,
			ArrowDown: -.1,
			ArrowRight: .1,
			ArrowUp: .1
		}[e.key];
		n && (e.preventDefault(), t.store.setVolume(t.store.volume + n));
	}
	var l = Lo(), u = N(l), d = N(u), f = (e) => {
		na(e, {
			get hue() {
				return B(n).hue;
			},
			get art() {
				return B(n).art;
			},
			get mark() {
				return B(n).mark;
			},
			size: 46,
			radius: 9
		});
	}, p = (e) => {
		U(e, Po());
	};
	G(d, (e) => {
		B(n) ? e(f) : e(p, -1);
	});
	var m = I(d, 2), h = N(m), g = F(h, !0), _ = F(I(h), !0);
	E(m), E(u);
	var v = I(u, 2), y = N(v), b = N(y);
	$(N(b), { get d() {
		return Q.prev;
	} }), E(b);
	var x = I(b, 2), S = I(x, 2);
	let ee;
	var te = N(S);
	{
		let e = /* @__PURE__ */ O(() => t.store.playing ? Q.pause : Q.play);
		$(te, { get d() {
			return B(e);
		} });
	}
	E(S);
	var ne = I(S, 2), re = I(ne, 2);
	$(N(re), { get d() {
		return Q.next;
	} }), E(re), E(y);
	var ie = I(y, 2), ae = N(ie), oe = F(ae, !0), se = I(ae, 2);
	To(se, {
		get store() {
			return t.store;
		},
		ticks: !0
	});
	var ce = I(se, 2), le = (e) => {
		U(e, Fo());
	}, ue = (e) => {
		var n = Io(), r = F(n, !0);
		L((e) => W(r, e), [() => B(i) ? `−${Ai(Hi(B(i), t.store.pos, t.store.speed))}` : ""]), U(e, n);
	};
	G(ce, (e) => {
		B(n) && !B(r) ? e(le) : e(ue, -1);
	}), E(ie), E(v);
	var de = I(v, 2), fe = N(de);
	let pe;
	var me = F(fe), he = I(fe, 2);
	let ge;
	var _e = N(he);
	$(_e, {
		get d() {
			return Q.moon;
		},
		size: 15,
		stroke: 1.8
	});
	var ve = I(_e, 1, !0);
	E(he);
	var C = I(he, 2);
	$(N(C), {
		get d() {
			return Q.clip;
		},
		size: 15,
		stroke: 1.8
	}), E(C);
	var ye = I(C, 2), be = N(ye), xe = N(be);
	{
		let e = /* @__PURE__ */ O(() => t.store.muted ? Q.muted : Q.volume);
		$(xe, {
			get d() {
				return B(e);
			},
			size: 15,
			stroke: 1.8
		});
	}
	E(be);
	var Se = I(be, 2);
	Y(Se, "aria-valuemin", 0), Y(Se, "aria-valuemax", 100);
	var w = N(Se);
	let Ce;
	E(Se), E(ye), E(de);
	var T = I(de, 2), we = (e) => {
		ko(e, {
			get store() {
				return t.store;
			},
			pos: "right:60px;bottom:74px"
		});
	};
	G(T, (e) => {
		t.store.pop === "sleep" && e(we);
	});
	var Te = I(T, 2), Ee = (e) => {
		No(e, {
			get store() {
				return t.store;
			},
			pos: "right:110px;bottom:74px"
		});
	};
	G(Te, (e) => {
		t.store.pop === "speed" && e(Ee);
	}), E(l), L((e, i, s, c) => {
		W(g, B(n)?.title ?? "Nothing playing"), W(_, B(n) ? t.store.subtitle : "Choose something to listen to"), b.disabled = !B(r), x.disabled = !B(r), ee = J(S, 1, "toggle svelte-y66ne", null, ee, { busy: B(o) }), Y(S, "aria-label", t.store.playing ? "Pause" : "Play"), S.disabled = !B(n), ne.disabled = !B(r), re.disabled = !t.store.queue.length, W(oe, e), pe = J(fe, 1, "speed svelte-y66ne", null, pe, { on: t.store.speed !== 1 && B(r) }), fe.disabled = !B(n), Y(fe, "aria-expanded", t.store.pop === "speed"), Y(fe, "aria-label", `Playback speed ${i ?? ""}×`), W(me, `${s ?? ""}×`), ge = J(he, 1, "sleep svelte-y66ne", null, ge, { on: !!t.store.sleep }), he.disabled = !B(n), Y(he, "aria-expanded", t.store.pop === "sleep"), Y(he, "aria-label", `Sleep timer${B(a) ? `: ${B(a)}` : ""}`), W(ve, B(a)), Y(C, "aria-label", B(r) ? "Clip the last 30 seconds to Notes" : "Save what is playing to Notes"), C.disabled = !B(n), Y(be, "aria-label", t.store.muted ? "Unmute" : "Mute"), Y(Se, "aria-valuenow", c), Ce = Zr(w, "", Ce, { width: `${(t.store.muted ? 0 : t.store.volume) * 100}%` });
	}, [
		() => B(n) ? B(r) ? Ai(t.store.pos) : "On air" : "",
		() => t.store.speed.toFixed(1),
		() => B(r) ? t.store.speed.toFixed(1) : "1.0",
		() => Math.round((t.store.muted ? 0 : t.store.volume) * 100)
	]), V("click", b, () => t.store.previous()), V("click", x, () => t.store.skip(-15)), V("click", S, () => t.store.toggle()), V("click", ne, () => t.store.skip(30)), V("click", re, () => t.store.next()), V("click", fe, () => t.store.togglePop("speed")), V("click", he, () => t.store.togglePop("sleep")), V("click", C, () => t.store.clip()), V("click", be, () => t.store.toggleMute()), V("click", Se, s), V("keydown", Se, c), U(e, l), qe();
}
mr(["click", "keydown"]);
//#endregion
//#region src/components/MiniPlayer.svelte
var Bo = /* @__PURE__ */ H("<div class=\"blank svelte-1jla3sy\"></div>"), Vo = /* @__PURE__ */ H("<span class=\"kind svelte-1jla3sy\"> </span>"), Ho = /* @__PURE__ */ H("<div class=\"chapter svelte-1jla3sy\"><span class=\"svelte-1jla3sy\">Chapter</span><br/> </div>"), Uo = /* @__PURE__ */ H("<span class=\"liveword svelte-1jla3sy\">LIVE</span>"), Wo = /* @__PURE__ */ H("<span> </span>"), Go = /* @__PURE__ */ H("<div class=\"sleepnote svelte-1jla3sy\"> </div>"), Ko = /* @__PURE__ */ H("<button class=\"svelte-1jla3sy\">Clip to Notes</button>"), qo = /* @__PURE__ */ H("<button class=\"q svelte-1jla3sy\"><!> <span class=\"qtext svelte-1jla3sy\"><span class=\"qtitle svelte-1jla3sy\"> </span><span class=\"qmeta svelte-1jla3sy\"> </span></span></button>"), Jo = /* @__PURE__ */ H("<div class=\"empty svelte-1jla3sy\">Widen the panel to browse radio, podcasts and audiobooks.</div>"), Yo = /* @__PURE__ */ H("<div class=\"mini svelte-1jla3sy\"><div class=\"head svelte-1jla3sy\"><div class=\"logo svelte-1jla3sy\"></div><span class=\"name svelte-1jla3sy\">TEND Media</span><span class=\"spacer svelte-1jla3sy\"></span><span class=\"np svelte-1jla3sy\">Now playing</span></div> <div class=\"player svelte-1jla3sy\"><div class=\"art svelte-1jla3sy\"><!> <!> <!></div> <div class=\"title svelte-1jla3sy\"> </div> <div class=\"sub svelte-1jla3sy\"> </div> <div class=\"seek svelte-1jla3sy\"><!></div> <div class=\"times svelte-1jla3sy\"><span> </span> <!></div> <div class=\"controls svelte-1jla3sy\"><button class=\"chipbtn svelte-1jla3sy\" data-pop=\"\" aria-haspopup=\"dialog\"> </button> <button class=\"jump svelte-1jla3sy\" aria-label=\"Back 15 seconds\">−15</button> <button><!></button> <button class=\"jump svelte-1jla3sy\" aria-label=\"Forward 30 seconds\">+30</button> <button data-pop=\"\" aria-haspopup=\"dialog\" aria-label=\"Sleep timer\"><!></button></div> <!> <!> <!></div> <div class=\"upnext svelte-1jla3sy\"><div class=\"uphead svelte-1jla3sy\"><span class=\"svelte-1jla3sy\"> </span><!></div> <!></div></div>"), Xo = {
	hash: "svelte-1jla3sy",
	code: ".mini.svelte-1jla3sy {height:100%;container-type:size;display:flex;flex-direction:column;background:var(--tm-bg);}.head.svelte-1jla3sy {height:36px;flex:none;display:flex;align-items:center;gap:8px;padding:0 14px;background:var(--tm-panel);}.logo.svelte-1jla3sy {width:16px;height:16px;border-radius:4px;background:var(--tm-brand);}.name.svelte-1jla3sy {font-size:12px;font-weight:600;}.spacer.svelte-1jla3sy {flex:1;}.np.svelte-1jla3sy {font-size:11px;color:var(--tm-muted);}.player.svelte-1jla3sy {padding:22px 22px 0;position:relative;flex:none;}.art.svelte-1jla3sy {width:min(100%, 48cqh);aspect-ratio:1;margin:0 auto;border-radius:18px;overflow:hidden;display:flex;position:relative;box-shadow:0 24px 50px rgba(0, 0, 0, .45);}.blank.svelte-1jla3sy {flex:1;background:var(--tm-fg-6);}.kind.svelte-1jla3sy {position:absolute;left:14px;top:14px;font-size:9.5px;font-weight:700;letter-spacing:.8px;padding:3px 8px;border-radius:20px;background:rgba(0, 0, 0, .45);color:#fff;}.chapter.svelte-1jla3sy {position:absolute;left:14px;bottom:14px;max-width:70%;padding:8px 10px;border-radius:10px;background:rgba(0, 0, 0, .5);color:#fff;font-size:11.5px;line-height:1.3;}.chapter.svelte-1jla3sy span:where(.svelte-1jla3sy) {opacity:.7;}.title.svelte-1jla3sy {font-size:17px;font-weight:650;margin-top:18px;line-height:1.3;text-wrap:pretty;display:-webkit-box;-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}.sub.svelte-1jla3sy {font-size:12.5px;color:var(--tm-muted);margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.seek.svelte-1jla3sy {display:flex;margin-top:14px;}.times.svelte-1jla3sy {display:flex;justify-content:space-between;font:500 10.5px ui-monospace, Menlo, monospace;color:var(--tm-muted);margin-top:2px;}.liveword.svelte-1jla3sy {color:var(--tm-live);font-weight:700;}.controls.svelte-1jla3sy {display:flex;align-items:center;justify-content:space-between;margin-top:10px;}button.svelte-1jla3sy:disabled {opacity:.35;cursor:default;}.chipbtn.svelte-1jla3sy {width:44px;height:30px;border:0;border-radius:8px;background:var(--tm-fg-6);color:var(--tm-fg);font:600 11px ui-monospace, Menlo, monospace;cursor:pointer;display:grid;place-items:center;}.sleep.svelte-1jla3sy {background:transparent;}.sleep.on.svelte-1jla3sy {background:var(--tm-accent-14);color:var(--tm-accent);}.jump.svelte-1jla3sy {width:40px;height:40px;border:0;border-radius:20px;background:none;color:var(--tm-fg);font:600 11px ui-monospace, Menlo, monospace;cursor:pointer;}.jump.svelte-1jla3sy:hover:not(:disabled) {background:var(--tm-fg-8);}.toggle.svelte-1jla3sy {width:58px;height:58px;border:0;border-radius:29px;background:var(--tm-accent);color:var(--tm-on-accent);cursor:pointer;display:grid;place-items:center;position:relative;}.toggle.busy.svelte-1jla3sy::after {content:'';position:absolute;inset:-5px;border-radius:50%;border:2px solid transparent;border-top-color:var(--tm-accent); animation: svelte-1jla3sy-spin .9s linear infinite;}\n  @keyframes svelte-1jla3sy-spin { to { transform: rotate(360deg); } }\n  @media (prefers-reduced-motion: reduce) {.toggle.busy.svelte-1jla3sy::after { animation: none;} }.sleepnote.svelte-1jla3sy {text-align:center;font-size:11px;color:var(--tm-accent);margin-top:6px;}.upnext.svelte-1jla3sy {flex:1;min-height:0;margin-top:16px;background:var(--tm-panel);border-radius:18px 18px 0 0;padding:14px 12px;overflow:auto;}.uphead.svelte-1jla3sy {display:flex;align-items:baseline;justify-content:space-between;padding:0 8px 6px;}.uphead.svelte-1jla3sy span:where(.svelte-1jla3sy) {font-size:13px;font-weight:650;}.uphead.svelte-1jla3sy button:where(.svelte-1jla3sy) {border:0;background:none;color:var(--tm-accent);font-size:11.5px;cursor:pointer;padding:0;}.q.svelte-1jla3sy {display:flex;align-items:center;gap:10px;width:100%;padding:7px 8px;border:0;border-radius:9px;background:none;color:inherit;cursor:pointer;text-align:left;font:inherit;}.q.svelte-1jla3sy:hover {background:var(--tm-fg-5);}.qtext.svelte-1jla3sy {flex:1;min-width:0;display:flex;flex-direction:column;}.qtitle.svelte-1jla3sy {font-size:12.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.qmeta.svelte-1jla3sy {font-size:11px;color:var(--tm-muted);margin-top:2px;}.empty.svelte-1jla3sy {padding:20px 8px;font-size:12px;color:var(--tm-muted);text-align:center;}"
};
function Zo(e, t) {
	Ke(t, !0), q(e, Xo);
	let n = /* @__PURE__ */ O(() => t.store.item), r = /* @__PURE__ */ O(() => !!B(n) && X(B(n))), i = /* @__PURE__ */ O(() => B(n) ? t.store.durOf(B(n).id) : 0), a = /* @__PURE__ */ O(() => B(n) && X(B(n)) && B(n).chapters.length > 1 && t.store.chapIdx >= 0 ? B(n).chapters[t.store.chapIdx].title : ""), o = /* @__PURE__ */ O(() => typeof t.store.sleep == "number" ? Ai(t.store.sleep) : t.store.sleep === "chapter" ? "end of chapter" : ""), s = /* @__PURE__ */ O(() => [...t.store.continueIds, ...t.store.onAirIds].filter((e) => e !== t.store.now).slice(0, 6));
	var c = Yo(), l = I(N(c), 2), u = N(l), d = N(u), f = (e) => {
		na(e, {
			get hue() {
				return B(n).hue;
			},
			get art() {
				return B(n).art;
			},
			fill: !0,
			radius: 0,
			get mark() {
				return B(n).mark;
			},
			font: 40
		});
	}, p = (e) => {
		U(e, Bo());
	};
	G(d, (e) => {
		B(n) ? e(f) : e(p, -1);
	});
	var m = I(d, 2), h = (e) => {
		var n = Vo(), r = F(n, !0);
		L(() => W(r, t.store.kindLabel)), U(e, n);
	};
	G(m, (e) => {
		B(n) && e(h);
	});
	var g = I(m, 2), _ = (e) => {
		var t = Ho(), n = I(N(t), 2, !0);
		E(t), L(() => W(n, B(a))), U(e, t);
	};
	G(g, (e) => {
		B(a) && e(_);
	}), E(u);
	var v = I(u, 2), y = F(v, !0), b = I(v, 2), x = F(b, !0), S = I(b, 2);
	To(N(S), {
		get store() {
			return t.store;
		},
		height: 16
	}), E(S);
	var ee = I(S, 2), te = N(ee), ne = F(te, !0), re = I(te, 2), ie = (e) => {
		U(e, Uo());
	}, ae = (e) => {
		var n = Wo(), r = F(n, !0);
		L((e) => W(r, e), [() => B(i) ? `−${Ai(Hi(B(i), t.store.pos, t.store.speed))}` : ""]), U(e, n);
	};
	G(re, (e) => {
		B(n) && !B(r) ? e(ie) : e(ae, -1);
	}), E(ee);
	var oe = I(ee, 2), se = N(oe), ce = F(se), le = I(se, 2), ue = I(le, 2);
	let de;
	var fe = N(ue);
	{
		let e = /* @__PURE__ */ O(() => t.store.playing ? Q.pause : Q.play);
		$(fe, {
			get d() {
				return B(e);
			},
			size: 22
		});
	}
	E(ue);
	var pe = I(ue, 2), me = I(pe, 2);
	let he;
	$(N(me), {
		get d() {
			return Q.moon;
		},
		size: 15,
		stroke: 1.8
	}), E(me), E(oe);
	var ge = I(oe, 2), _e = (e) => {
		var t = Go(), n = F(t);
		L(() => W(n, `Sleep timer · ${B(o) ?? ""}`)), U(e, t);
	};
	G(ge, (e) => {
		t.store.sleep && e(_e);
	});
	var ve = I(ge, 2), C = (e) => {
		ko(e, {
			get store() {
				return t.store;
			},
			pos: "right:16px;left:16px;width:auto;top:120px"
		});
	};
	G(ve, (e) => {
		t.store.pop === "sleep" && e(C);
	});
	var ye = I(ve, 2), be = (e) => {
		No(e, {
			get store() {
				return t.store;
			},
			pos: "right:16px;left:16px;width:auto;top:120px"
		});
	};
	G(ye, (e) => {
		t.store.pop === "speed" && e(be);
	}), E(l);
	var xe = I(l, 2), Se = N(xe), w = N(Se), Ce = F(w, !0), T = I(w), we = (e) => {
		var n = Ko();
		V("click", n, () => t.store.clip()), U(e, n);
	};
	G(T, (e) => {
		B(n) && e(we);
	}), E(Se), K(I(Se, 2), 16, () => t.store.queue.length ? t.store.queue : B(s), (e) => e, (e, n) => {
		let r = /* @__PURE__ */ O(() => t.store.items[n]);
		var i = Tr(), a = P(i), o = (e) => {
			var i = qo(), a = N(i);
			na(a, {
				get hue() {
					return B(r).hue;
				},
				get art() {
					return B(r).art;
				},
				get mark() {
					return B(r).mark;
				},
				size: 36,
				font: 9
			});
			var o = I(a, 2), s = N(o), c = F(s, !0), l = F(I(s));
			E(o), E(i), L((e) => {
				W(c, B(r).title), W(l, `${di[B(r).type] ?? ""}${e ?? ""}`);
			}, [() => t.store.lenOf(n) ? ` · ${t.store.lenOf(n)}` : ""]), V("click", i, () => t.store.play(n)), U(e, i);
		};
		G(a, (e) => {
			B(r) && e(o);
		}), U(e, i);
	}, (e) => {
		U(e, Jo());
	}), E(xe), E(c), L((e, i, a) => {
		W(y, B(n)?.title ?? "Nothing playing"), W(x, B(n) ? t.store.subtitle : "Widen the panel to browse, or pick from below."), W(ne, e), se.disabled = !B(r), Y(se, "aria-expanded", t.store.pop === "speed"), Y(se, "aria-label", `Playback speed ${i ?? ""}×`), W(ce, `${a ?? ""}×`), le.disabled = !B(r), de = J(ue, 1, "toggle svelte-1jla3sy", null, de, { busy: t.store.buffering || t.store.loadingItem }), ue.disabled = !B(n), Y(ue, "aria-label", t.store.playing ? "Pause" : "Play"), pe.disabled = !B(r), he = J(me, 1, "chipbtn sleep svelte-1jla3sy", null, he, { on: !!t.store.sleep }), me.disabled = !B(n), Y(me, "aria-expanded", t.store.pop === "sleep"), W(Ce, t.store.queue.length ? "Up next" : "Recent");
	}, [
		() => B(n) ? B(r) ? Ai(t.store.pos) : "On air" : "",
		() => t.store.speed.toFixed(1),
		() => B(r) ? t.store.speed.toFixed(1) : "1.0"
	]), V("click", se, () => t.store.togglePop("speed")), V("click", le, () => t.store.skip(-15)), V("click", ue, () => t.store.toggle()), V("click", pe, () => t.store.skip(30)), V("click", me, () => t.store.togglePop("sleep")), U(e, c), qe();
}
mr(["click"]);
//#endregion
//#region src/App.svelte
var Qo = /* @__PURE__ */ H("<div class=\"unsupported svelte-1n46o8q\"><strong class=\"svelte-1n46o8q\">Update Tend to use TEND Media.</strong><p>This panel does not provide the OndaCast catalog capability yet. Updating Tend adds it.</p></div>"), $o = /* @__PURE__ */ H("<!> <div class=\"middle svelte-1n46o8q\"><!> <main class=\"svelte-1n46o8q\"><!></main> <!></div> <!>", 1), es = /* @__PURE__ */ H("<div role=\"status\"> </div>"), ts = /* @__PURE__ */ H("<div class=\"tend-media svelte-1n46o8q\"><!> <!></div>"), ns = {
	hash: "svelte-1n46o8q",
	code: ".tend-media.svelte-1n46o8q {\n    /* Live Tend theme tokens with the TEND Notes dark palette as fallback. */--tm-bg: var(--color-base-100, #151b19);--tm-panel: var(--color-base-200, #1d2622);--tm-fg: var(--color-base-content, #d8e3df);--tm-accent: var(--color-primary, #66b798);--tm-on-accent: var(--color-primary-content, #071a13);--tm-muted: color-mix(in srgb, var(--tm-fg) 64%, var(--tm-bg));--tm-brand: #0f766e;--tm-live: #ff6b6b;--tm-fg-4: color-mix(in srgb, var(--tm-fg) 4.5%, transparent);--tm-fg-5: color-mix(in srgb, var(--tm-fg) 5%, transparent);--tm-fg-6: color-mix(in srgb, var(--tm-fg) 6%, transparent);--tm-fg-7: color-mix(in srgb, var(--tm-fg) 7%, transparent);--tm-fg-8: color-mix(in srgb, var(--tm-fg) 8%, transparent);--tm-fg-10: color-mix(in srgb, var(--tm-fg) 10%, transparent);--tm-fg-12: color-mix(in srgb, var(--tm-fg) 12%, transparent);--tm-fg-14: color-mix(in srgb, var(--tm-fg) 14%, transparent);--tm-fg-16: color-mix(in srgb, var(--tm-fg) 16%, transparent);--tm-fg-18: color-mix(in srgb, var(--tm-fg) 18%, transparent);--tm-fg-45: color-mix(in srgb, var(--tm-fg) 45%, transparent);--tm-accent-7: color-mix(in srgb, var(--tm-accent) 7%, transparent);--tm-accent-8: color-mix(in srgb, var(--tm-accent) 8%, transparent);--tm-accent-12: color-mix(in srgb, var(--tm-accent) 12%, transparent);--tm-accent-14: color-mix(in srgb, var(--tm-accent) 14%, transparent);--tm-pop: color-mix(in srgb, var(--tm-fg) 3.5%, var(--tm-panel));position:relative;height:100%;width:100%;overflow:hidden;display:flex;flex-direction:column;background:var(--tm-bg);color:var(--tm-fg);font-family:system-ui, -apple-system, \"Segoe UI\", sans-serif;font-size:13px;-webkit-font-smoothing:antialiased;}.tend-media.svelte-1n46o8q * {box-sizing:border-box;}.tend-media.svelte-1n46o8q button {font-family:inherit;}.tend-media.svelte-1n46o8q button:focus-visible {outline:2px solid var(--tm-accent);outline-offset:2px;}.tend-media.svelte-1n46o8q .tm-pop {position:absolute;width:250px;padding:14px;border-radius:14px;z-index:5;background:var(--tm-pop);border:1px solid var(--tm-fg-10);box-shadow:0 20px 50px rgba(0, 0, 0, .5);}.toast.low.svelte-1n46o8q {bottom:20px;}.unsupported.svelte-1n46o8q {margin:auto;max-width:360px;text-align:center;padding:24px;font-size:13px;color:var(--tm-muted);}.unsupported.svelte-1n46o8q strong:where(.svelte-1n46o8q) {display:block;color:var(--tm-fg);font-size:15px;margin-bottom:6px;}.middle.svelte-1n46o8q {flex:1;min-height:0;display:flex;}main.svelte-1n46o8q {flex:1;min-width:0;overflow:auto;padding:26px 28px 28px;}.toast.svelte-1n46o8q {position:absolute;left:50%;bottom:96px;transform:translateX(-50%);padding:10px 16px;border-radius:10px;background:var(--tm-fg);color:var(--tm-bg);font-size:12.5px;font-weight:600;box-shadow:0 12px 30px rgba(0, 0, 0, .4);z-index:6;white-space:nowrap;max-width:calc(100% - 32px);overflow:hidden;text-overflow:ellipsis;}"
};
function rs(e, t) {
	Ke(t, !0), q(e, ns);
	let n = li(t, "narrow", 7, !1), r = new qi(t.host), i = /* @__PURE__ */ A(void 0);
	ui(() => (r.start(), () => r.destroy())), pn(() => {
		r.tab, r.showSlug, r.bookId, B(i)?.scrollTo(0, 0);
	});
	function a(e) {
		n(e);
	}
	let o = (e) => e instanceof HTMLElement && (e.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.tagName));
	function s(e) {
		if (e.key === "Escape" && r.pop) {
			r.pop = null, e.stopPropagation();
			return;
		}
		if (o(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
		let t = e.target instanceof HTMLElement && e.target.closest("button,[role=slider]");
		e.key === " " && !t && (e.preventDefault(), r.toggle());
	}
	function c(e) {
		let t = e.target;
		r.pop && !t.closest(".tm-pop,[data-pop]") && (r.pop = null);
	}
	var l = { setNarrow: a }, u = ts(), d = N(u), f = (e) => {
		U(e, Qo());
	}, p = (e) => {
		Zo(e, { get store() {
			return r;
		} });
	}, m = (e) => {
		var t = $o(), n = P(t);
		Qi(n, { get store() {
			return r;
		} });
		var a = I(n, 2), o = N(a);
		la(o, { get store() {
			return r;
		} });
		var s = I(o, 2), c = N(s), l = (e) => {
			co(e, { get store() {
				return r;
			} });
		}, u = /* @__PURE__ */ O(() => r.query.trim()), d = (e) => {
			Da(e, { get store() {
				return r;
			} });
		}, f = (e) => {
			Pa(e, { get store() {
				return r;
			} });
		}, p = (e) => {
			Ja(e, { get store() {
				return r;
			} });
		}, m = (e) => {
			io(e, { get store() {
				return r;
			} });
		};
		G(c, (e) => {
			B(u) ? e(l) : r.tab === "home" ? e(d, 1) : r.tab === "radio" ? e(f, 2) : r.tab === "pod" ? e(p, 3) : e(m, -1);
		}), E(s), ci(s, (e) => j(i, e), () => B(i)), xo(I(s, 2), { get store() {
			return r;
		} }), E(a), zo(I(a, 2), { get store() {
			return r;
		} }), U(e, t);
	};
	G(d, (e) => {
		r.supported ? n() ? e(p, 1) : e(m, -1) : e(f);
	});
	var h = I(d, 2), g = (e) => {
		var t = es();
		let i;
		var a = F(t, !0);
		L(() => {
			i = J(t, 1, "toast svelte-1n46o8q", null, i, { low: n() }), W(a, r.toast);
		}), U(e, t);
	};
	return G(h, (e) => {
		r.toast && e(g);
	}), E(u), V("keydown", u, s), V("pointerdown", u, c), U(e, u), qe(l);
}
mr(["keydown", "pointerdown"]);
//#endregion
//#region src/index.ts
var is = 640;
function as(e) {
	return { mount(t) {
		let n = Ar(rs, {
			target: t,
			props: {
				host: e,
				narrow: t.clientWidth > 0 && t.clientWidth < 640
			}
		}), r = new ResizeObserver(([e]) => n.setNarrow(e.contentRect.width < 640));
		return r.observe(t), { async unmount() {
			r.disconnect(), await Pr(n);
		} };
	} };
}
//#endregion
export { is as NARROW_WIDTH, as as activate };
