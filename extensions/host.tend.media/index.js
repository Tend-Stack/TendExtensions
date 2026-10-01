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
var h = 1024, g = 2048, _ = 4096, v = 8192, y = 16384, b = 32768, x = 1 << 25, S = 65536, C = 1 << 19, ee = 1 << 20, te = 1 << 25, ne = 65536, re = 1 << 21, ie = 1 << 22, ae = 1 << 23, oe = Symbol("$state"), se = Symbol("component"), ce = Symbol("legacy props"), le = Symbol(""), ue = Symbol("attributes"), de = Symbol("class"), fe = Symbol("style"), pe = Symbol("text"), me = Symbol("form reset"), he = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), ge = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml"), _e = {}, w = Symbol("uninitialized"), ve = "http://www.w3.org/1999/xhtml";
function ye() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function be(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function xe() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/hydration.js
var T = !1;
function Se(e) {
	T = e;
}
var E;
function Ce(e) {
	if (e === null) throw be(), _e;
	return E = e;
}
function we() {
	return Ce(/* @__PURE__ */ $t(E));
}
function D(e) {
	if (T) {
		if (/* @__PURE__ */ $t(E) !== null) throw be(), _e;
		E = e;
	}
}
function Te(e = 1) {
	if (T) {
		for (var t = e, n = E; t--;) n = /* @__PURE__ */ $t(n);
		E = n;
	}
}
function Ee(e = !0) {
	for (var t = 0, n = E;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ $t(n);
		e && n.remove(), n = i;
	}
}
function De(e) {
	if (!e || e.nodeType !== 8) throw be(), _e;
	return e.data;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/equality.js
function Oe(e) {
	return e === this.v;
}
function ke(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function Ae(e) {
	return !ke(e, this.v);
}
function je(e) {
	throw Error("https://svelte.dev/e/lifecycle_outside_component");
}
//#endregion
//#region node_modules/svelte/src/internal/client/errors.js
function Me() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function Ne(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function Pe(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function Fe() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function Ie(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function Le() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Re(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function ze() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Be() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function Ve() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function He() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
//#endregion
//#region node_modules/svelte/src/internal/client/context.js
var Ue = null;
function We(e) {
	Ue = e;
}
function Ge(e, t = !1, n) {
	Ue = {
		p: Ue,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: B,
		l: null
	};
}
function Ke(e) {
	var t = Ue, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) pn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, Ue = t.p, qe(e);
}
function qe(e = {}) {
	return i(e, se, { value: !0 }), e;
}
function Je() {
	return !0;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
var Ye = [];
function Xe() {
	var e = Ye;
	Ye = [], f(e);
}
function Ze(e) {
	if (Ye.length === 0 && !wt) {
		var t = Ye;
		queueMicrotask(() => {
			t === Ye && Xe();
		});
	}
	Ye.push(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/status.js
var Qe = ~(g | _ | h);
function O(e, t) {
	e.f = e.f & Qe | t;
}
function $e(e) {
	e.f & 512 || e.deps === null ? O(e, h) : O(e, _);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function et(e) {
	if (e !== null) for (let t of e) t.f & 2 && t.f & 65536 && (t.f ^= ne, et(t.deps));
}
function tt(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), et(e.deps), O(e, h);
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
			if (!e.defaultPrevented) for (let t of e.target.elements) t[me]?.();
		});
	}, { capture: !0 }));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function ot(e) {
	var t = z, n = B;
	In(null), Ln(null);
	try {
		return e();
	} finally {
		In(t), Ln(n);
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/async.js
function st(e, t, n, r) {
	let i = Je() ? dt : mt;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = B, c = ct(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				on(e, s);
			}
			lt();
		}
	}
	var d = ut();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ pt(e))).then(u).catch((e) => on(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), lt();
	}) : f();
}
function ct() {
	var e = B, t = z, n = Ue, r = A;
	return function(i = !0) {
		Ln(e), In(t), We(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function lt(e = !0) {
	Ln(null), In(null), We(null), e && A?.deactivate();
}
function ut() {
	var e = B, t = e.b, n = A, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function dt(e) {
	var t = 2 | g;
	return B !== null && (B.f |= C), {
		ctx: Ue,
		deps: null,
		effects: null,
		equals: Oe,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: w,
		wv: 0,
		parent: B,
		ac: null
	};
}
var ft = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function pt(e, t, n) {
	let r = B;
	r === null && Me();
	var i = void 0, a = Bt(w), o = !z, s = /* @__PURE__ */ new Set();
	return gn(() => {
		var t = B, n = p();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== he && n.reject(e);
			}).finally(lt);
		} catch (e) {
			n.reject(e), lt();
		}
		var c = A;
		if (o) {
			if (t.f & 32768) var l = ut();
			if (r.b?.is_rendered()) c.async_deriveds.get(t)?.reject(ft);
			else for (let e of s.values()) e.reject(ft);
			s.add(n), c.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), s.delete(n), t !== ft && (c.activate(), t ? (a.f |= ae, Ht(a, t)) : (a.f & 8388608 && (a.f ^= ae), Ht(a, e)), c.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), dn(() => {
		for (let e of s) e.reject(ft);
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
function k(e) {
	let t = /* @__PURE__ */ dt(e);
	return zn(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function mt(e) {
	let t = /* @__PURE__ */ dt(e);
	return t.equals = Ae, t;
}
function ht(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) Cn(t[n]);
	}
}
function gt(e) {
	var t, n = B, r = e.parent;
	if (!Nn && r !== null && e.v !== w && r.f & 24576) return ye(), e.v;
	Ln(r);
	try {
		e.f &= ~ne, ht(e), t = Zn(e);
	} finally {
		Ln(n);
	}
	return t;
}
function _t(e) {
	var t = gt(e);
	if (!e.equals(t) && (e.wv = Jn(), (!A?.is_fork || e.deps === null) && (A === null ? e.v = t : (A.capture(e, t, !0), xt?.capture(e, t, !0)), e.deps === null))) {
		O(e, h);
		return;
	}
	Nn || (St === null ? $e(e) : (un() || A?.is_fork) && St.set(e, t));
}
function vt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && ot(() => {
		t.ac.abort(he), t.ac = null;
	}), t.fn !== null && (t.teardown = d), er(t, 0), xn(t));
}
function yt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && tr(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var bt = null, A = null, xt = null, St = null, Ct = null, wt = !1, Tt = !1, Et = null, Dt = null, Ot = 0, kt = 1, At = class e {
	id = kt++;
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
		bt === null ? bt = this : (bt.#n = this, this.#t = bt), bt = this;
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
			for (var r of n.d) O(r, g), t(r);
			for (r of n.m) O(r, _), t(r);
		}
		this.#p.add(e);
	}
	#g() {
		this.#e = !0, Ot++ > 1e3 && (this.#x(), jt());
		for (let e of this.#u) this.#d.delete(e), O(e, g), this.schedule(e);
		for (let e of this.#d) O(e, _), this.schedule(e);
		let t = this.#c;
		this.#c = [], this.apply();
		var n = Et = [], r = [], i = Dt = [];
		for (let e of t) try {
			this.#_(e, n, r);
		} catch (t) {
			throw It(e), this.#h() || this.discard(), t;
		}
		if (A = null, i.length > 0) {
			var a = e.ensure();
			for (let e of i) a.schedule(e);
		}
		if (Et = null, Dt = null, this.#h()) {
			this.#b(r), this.#b(n);
			for (let [e, t] of this.#f) Ft(e, t);
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
		this.#r.clear(), xt = this, Nt(r), Nt(n), xt = null, this.#s?.resolve();
		var s = A;
		if (this.#a === 0 && (this.#c.length === 0 || s !== null) && this.#x(), this.#c.length > 0) {
			if (s !== null) {
				let e = s;
				e.#c.push(...this.#c.filter((t) => !e.#c.includes(t)));
			} else s = this;
		}
		s !== null && (Rt.clear(), s.#g());
	}
	#_(e, t, n) {
		e.f ^= h;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= h : i & 4 ? t.push(r) : Yn(r) && (i & 16 && this.#d.add(r), tr(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), O(i, g), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#x(), A = this, this.#g();
	}
	#b(e) {
		for (var t = 0; t < e.length; t += 1) tt(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== w && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), St?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		A = this;
	}
	deactivate() {
		A = null, St = null;
	}
	flush() {
		try {
			Tt = !0, A = this, this.#g();
		} finally {
			Ot = 0, Ct = null, Et = null, Dt = null, Tt = !1, A = null, St = null, Rt.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(ft);
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
		this.#m || (this.#m = !0, Ze(() => {
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
			!Tt && Ze(() => {
				t.#e || t.flush();
			});
		}
		return A;
	}
	apply() {
		St = null;
	}
	schedule(e) {
		if (Ct = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		for (var t = e; t.parent !== null;) {
			t = t.parent;
			var n = t.f;
			if (Et !== null && t === B && (z === null || !(z.f & 2))) return;
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
			e === null || (e.#n = t), t === null ? bt = e : t.#t = e, this.linked = !1;
		}
	}
};
function jt() {
	try {
		Le();
	} catch (e) {
		on(e, Ct);
	}
}
var Mt = null;
function Nt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && Yn(r) && (Mt = /* @__PURE__ */ new Set(), tr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Tn(r), Mt?.size > 0)) {
				Rt.clear();
				for (let e of Mt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Mt.has(n) && (Mt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || tr(n);
					}
				}
				Mt.clear();
			}
		}
		Mt = null;
	}
}
function Pt(e) {
	A.schedule(e);
}
function Ft(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), O(e, h);
		for (var n = e.first; n !== null;) Ft(n, t), n = n.next;
	}
}
function It(e) {
	O(e, h);
	for (var t = e.first; t !== null;) It(t), t = t.next;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
var Lt = /* @__PURE__ */ new Set(), Rt = /* @__PURE__ */ new Map(), zt = !1;
function Bt(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: Oe,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function j(e, t) {
	let n = Bt(e, t);
	return zn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function Vt(e, t = !1, n = !0) {
	let r = Bt(e);
	return t || (r.equals = Ae), r;
}
function M(e, t, n = !1) {
	return z !== null && (!Fn || z.f & 131072) && Je() && z.f & 4325394 && (Rn === null || !Rn.has(e)) && Ve(), Ht(e, n ? N(t) : t, Dt);
}
function Ht(e, t, n = null) {
	if (!e.equals(t)) {
		Nn ? Rt.set(e, t) : Rt.has(e) || Rt.set(e, e.v);
		var r = At.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && gt(t), St === null && $e(t);
		}
		e.wv = Jn(), Gt(e, g, n), Je() && B !== null && B.f & 1024 && !(B.f & 96) && (Hn === null ? Un([e]) : Hn.push(e)), !r.is_fork && Lt.size > 0 && !zt && Ut();
	}
	return t;
}
function Ut() {
	zt = !1;
	for (let e of Lt) {
		e.f & 1024 && O(e, _);
		let t;
		try {
			t = Yn(e);
		} catch {
			t = !0;
		}
		t && tr(e);
	}
	Lt.clear();
}
function Wt(e) {
	M(e, e.v + 1);
}
function Gt(e, t, n) {
	var r = e.reactions;
	if (r !== null) for (var i = Je(), a = r.length, o = 0; o < a; o++) {
		var s = r[o], c = s.f;
		if (i || s !== B) {
			var l = (c & g) === 0;
			if (l && O(s, t), c & 131072) Lt.add(s);
			else if (c & 2) {
				var u = s;
				St?.delete(u), c & 65536 || (c & 512 && (B === null || !(B.f & 2097152)) && (s.f |= ne), Gt(u, _, n));
			} else if (l) {
				var d = s;
				c & 16 && Mt !== null && Mt.add(d), n === null ? Pt(d) : n.push(d);
			}
		}
	}
}
function N(t) {
	if (typeof t != "object" || !t || oe in t || se in t) return t;
	let n = l(t);
	if (n !== s && n !== c) return t;
	var r = /* @__PURE__ */ new Map(), i = e(t), o = /* @__PURE__ */ j(0), u = null, d = Kn, f = (e) => {
		if (Kn === d) return e();
		var t = z, n = Kn;
		In(null), qn(d);
		var r = e();
		return In(t), qn(n), r;
	};
	return i && r.set("length", /* @__PURE__ */ j(t.length, u)), new Proxy(t, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && ze();
			var i = r.get(t);
			return i === void 0 ? f(() => {
				var e = /* @__PURE__ */ j(n.value, u);
				return r.set(t, e), e;
			}) : M(i, n.value, !0), !0;
		},
		deleteProperty(e, t) {
			var n = r.get(t);
			if (n === void 0) {
				if (t in e) {
					let e = f(() => /* @__PURE__ */ j(w, u));
					r.set(t, e), Wt(o);
				}
			} else M(n, w), Wt(o);
			return !0;
		},
		get(e, n, i) {
			if (n === oe) return t;
			var o = r.get(n), s = n in e;
			if (o === void 0 && (!s || a(e, n)?.writable) && (o = f(() => /* @__PURE__ */ j(N(s ? e[n] : w), u)), r.set(n, o)), o !== void 0) {
				var c = V(o);
				return c === w ? void 0 : c;
			}
			return Reflect.get(e, n, i);
		},
		getOwnPropertyDescriptor(e, t) {
			var n = Reflect.getOwnPropertyDescriptor(e, t);
			if (n && "value" in n) {
				var i = r.get(t);
				i && (n.value = V(i));
			} else if (n === void 0) {
				var a = r.get(t), o = a?.v;
				if (a !== void 0 && o !== w) return {
					enumerable: !0,
					configurable: !0,
					value: o,
					writable: !0
				};
			}
			return n;
		},
		has(e, t) {
			if (t === oe) return !0;
			var n = r.get(t), i = n !== void 0 && n.v !== w || Reflect.has(e, t);
			return (n !== void 0 || B !== null && (!i || a(e, t)?.writable)) && (n === void 0 && (n = f(() => /* @__PURE__ */ j(i ? N(e[t]) : w, u)), r.set(t, n)), V(n) === w) ? !1 : i;
		},
		set(e, t, n, s) {
			var c = r.get(t), l = t in e;
			if (i && t === "length") for (var d = n; d < c.v; d += 1) {
				var p = r.get(d + "");
				p === void 0 ? d in e && (p = f(() => /* @__PURE__ */ j(w, u)), r.set(d + "", p)) : M(p, w);
			}
			if (c === void 0) (!l || a(e, t)?.writable) && (c = f(() => /* @__PURE__ */ j(void 0, u)), M(c, N(n)), r.set(t, c));
			else {
				l = c.v !== w;
				var m = f(() => N(n));
				M(c, m);
			}
			var h = Reflect.getOwnPropertyDescriptor(e, t);
			if (h?.set && h.set.call(s, n), !l) {
				if (i && typeof t == "string") {
					var g = r.get("length"), _ = Number(t);
					Number.isInteger(_) && _ >= g.v && M(g, _ + 1);
				}
				Wt(o);
			}
			return !0;
		},
		ownKeys(e) {
			V(o);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = r.get(e);
				return t === void 0 || t.v !== w;
			});
			for (var [n, i] of r) i.v !== w && !(n in e) && t.push(n);
			return t;
		},
		setPrototypeOf() {
			Be();
		}
	});
}
var Kt, qt, Jt, Yt;
function Xt() {
	if (Kt === void 0) {
		Kt = window, qt = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		Jt = a(t, "firstChild").get, Yt = a(t, "nextSibling").get, u(e) && (e[de] = void 0, e[ue] = null, e[fe] = void 0, e.__e = void 0), u(n) && (n[pe] = void 0);
	}
}
function Zt(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function Qt(e) {
	return Jt.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function $t(e) {
	return Yt.call(e);
}
function P(e, t) {
	if (!T) return /* @__PURE__ */ Qt(e);
	var n = /* @__PURE__ */ Qt(E);
	if (n === null) n = E.appendChild(Zt());
	else if (t && n.nodeType !== 3) {
		var r = Zt();
		return n?.before(r), Ce(r), r;
	}
	return t && rn(n), Ce(n), n;
}
function F(e, t = !1) {
	if (!T) {
		var n = /* @__PURE__ */ Qt(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ $t(n) : n;
	}
	if (t) {
		if (E?.nodeType !== 3) {
			var r = Zt();
			return E?.before(r), Ce(r), r;
		}
		rn(E);
	}
	return E;
}
function I(e, t = !1) {
	if (!T) return /* @__PURE__ */ Qt(e);
	var n = P(e, t);
	return D(e), n;
}
function L(e, t = 1, n = !1) {
	let r = T ? E : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ $t(r);
	if (!T) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = Zt();
			return r === null ? i?.after(a) : r.before(a), Ce(a), a;
		}
		rn(r);
	}
	return Ce(r), r;
}
function en(e) {
	e.textContent = "";
}
function tn() {
	return !1;
}
function nn(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function rn(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
function an(e) {
	var t = B;
	if (t === null) return z.f |= ae, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	on(e, t);
}
function on(e, t) {
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
function sn(e) {
	B === null && (z === null && Ie(e), Fe()), Nn && Pe(e);
}
function cn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function ln(e, t) {
	var n = B;
	n !== null && n.f & 8192 && (e |= v);
	var r = {
		ctx: Ue,
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
	if (e & 4) Et === null ? At.ensure().schedule(r) : Et.push(r);
	else if (t !== null) {
		try {
			tr(r);
		} catch (e) {
			throw Cn(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= S));
	}
	if (i !== null && (i.parent = n, n !== null && cn(i, n), z !== null && z.f & 2 && !(e & 64))) {
		var a = z;
		(a.effects ??= []).push(i);
	}
	return r;
}
function un() {
	return z !== null && !Fn;
}
function dn(e) {
	let t = ln(8, null);
	return O(t, h), t.teardown = e, t;
}
function fn(e) {
	sn("$effect");
	var t = B.f;
	if (!z && t & 32 && Ue !== null && !Ue.i) {
		var n = Ue;
		(n.e ??= []).push(e);
	} else return pn(e);
}
function pn(e) {
	return ln(4 | ee, e);
}
function mn(e) {
	At.ensure();
	let t = ln(64 | C, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? En(t, () => {
			Cn(t), n(void 0);
		}) : (Cn(t), n(void 0));
	});
}
function hn(e) {
	return ln(4, e);
}
function gn(e) {
	return ln(ie | C, e);
}
function _n(e, t = 0) {
	return ln(8 | t, e);
}
function R(e, t = [], n = [], r = []) {
	st(r, t, n, (t) => {
		ln(8, () => {
			e(...t.map(V));
		});
	});
}
function vn(e, t = 0) {
	return ln(16 | t, e);
}
function yn(e) {
	return ln(32 | C, e);
}
function bn(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = Nn, r = z;
		Pn(!0), In(null);
		try {
			t.call(null);
		} catch (t) {
			on(t, e.parent);
		} finally {
			Pn(n), In(r);
		}
	}
}
function xn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && ot(() => {
			e.abort(he);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : Cn(n, t), n = r;
	}
}
function Sn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || Cn(t), t = n;
	}
}
function Cn(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (wn(e.nodes.start, e.nodes.end), n = !0), e.f |= x, xn(e, t && !n), er(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	bn(e), e.f ^= x, e.f |= y;
	var i = e.parent;
	i !== null && i.first !== null && Tn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function wn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ $t(e);
		e.remove(), e = n;
	}
}
function Tn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function En(e, t, n = !0) {
	var r = [];
	e.f |= 256, Dn(e, r, !0);
	var i = () => {
		n && Cn(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Dn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= v;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				Dn(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function On(e) {
	e.f &= -257, kn(e, !0);
}
function kn(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= v, e.f & 1024 || (O(e, g), At.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			kn(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function An(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ $t(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var jn = null, Mn = !1, Nn = !1;
function Pn(e) {
	Nn = e;
}
var z = null, Fn = !1;
function In(e) {
	z = e;
}
var B = null;
function Ln(e) {
	B = e;
}
var Rn = null;
function zn(e) {
	z !== null && (Rn ??= /* @__PURE__ */ new Set()).add(e);
}
var Bn = null, Vn = 0, Hn = null;
function Un(e) {
	Hn = e;
}
var Wn = 1, Gn = 0, Kn = Gn;
function qn(e) {
	Kn = e;
}
function Jn() {
	return ++Wn;
}
function Yn(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 2 && (e.f &= ~ne), t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (Yn(a) && _t(a), a.wv > e.wv) return !0;
		}
		t & 512 && St === null && O(e, h);
	}
	return !1;
}
function Xn(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(Rn !== null && Rn.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? Xn(a, t, !1) : t === a && (n ? O(a, g) : a.f & 1024 && O(a, _), Pt(a));
	}
}
function Zn(e) {
	var t = Bn, n = Vn, r = Hn, i = z, a = Rn, o = Ue, s = Fn, c = Kn, l = e.f;
	Bn = null, Vn = 0, Hn = null, z = l & 96 ? null : e, Rn = null, We(e.ctx), Fn = !1, Kn = ++Gn, e.ac !== null && (ot(() => {
		e.ac.abort(he);
	}), e.ac = null);
	try {
		e.f |= re;
		var u = e.fn, d = u();
		e.f |= b;
		var f = Qn(e);
		if (Je() && Hn !== null && !Fn && f !== null && !(e.f & 6146)) for (var p = 0; p < Hn.length; p++) Xn(Hn[p], e);
		if (i !== null && i !== e) {
			if (Gn++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = Gn;
			if (t !== null) for (let e of t) e.rv = Gn;
			Hn !== null && (r === null ? r = Hn : r.push(...Hn));
		}
		return e.f & 8388608 && (e.f ^= ae), d;
	} catch (t) {
		return Qn(e), an(t);
	} finally {
		e.f ^= re, Bn = t, Vn = n, Hn = r, z = i, Rn = a, We(o), Fn = s, Kn = c;
	}
}
function Qn(e) {
	var t = e.deps, n = A?.is_fork;
	if (Bn !== null) {
		var r;
		if (n || er(e, Vn), t !== null && Vn > 0) for (t.length = Vn + Bn.length, r = 0; r < Bn.length; r++) t[Vn + r] = Bn[r];
		else e.deps = t = Bn;
		if (un() && e.f & 512) for (r = Vn; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && Vn < t.length && (er(e, Vn), t.length = Vn);
	return t;
}
function $n(e, r) {
	let i = r.reactions;
	if (i !== null) {
		var a = t.call(i, e);
		if (a !== -1) {
			var o = i.length - 1;
			o === 0 ? i = r.reactions = null : (i[a] = i[o], i.pop());
		}
	}
	if (i === null && r.f & 2 && (Bn === null || !n.call(Bn, r))) {
		var s = r;
		s.f & 512 && (s.f ^= 512, s.f &= ~ne), s.v !== w && $e(s), s.ac !== null && ot(() => {
			s.ac.abort(he), s.ac = null, O(s, g);
		}), vt(s), er(s, 0);
	}
}
function er(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) $n(e, n[r]);
}
function tr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		O(e, h);
		var n = B, r = Mn;
		B = e, Mn = !(t & 96);
		try {
			t & 16777232 ? Sn(e) : xn(e), bn(e);
			var i = Zn(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = Wn;
		} finally {
			Mn = r, B = n;
		}
	}
}
function V(e) {
	var t = !!(e.f & 2);
	if (jn?.add(e), z !== null && !Fn && !(B !== null && B.f & 16384) && (Rn === null || !Rn.has(e))) {
		var r = z.deps;
		if (z.f & 2097152) e.rv < Gn && (e.rv = Gn, Bn === null && r !== null && r[Vn] === e ? Vn++ : Bn === null ? Bn = [e] : Bn.push(e));
		else {
			z.deps ??= [], n.call(z.deps, e) || z.deps.push(e);
			var i = e.reactions;
			i === null ? e.reactions = [z] : n.call(i, z) || i.push(z);
		}
	}
	if (Nn && Rt.has(e)) return Rt.get(e);
	if (t) {
		var a = e;
		if (Nn) {
			var o = a.v;
			return (!(a.f & 1024) && a.reactions !== null || rr(a)) && (o = gt(a)), Rt.set(a, o), o;
		}
		var s = !(a.f & 512) && !Fn && z !== null && (Mn || !!(z.f & 512)), c = (a.f & b) === 0;
		Yn(a) && (s && (a.f |= 512), _t(a)), s && !c && (yt(a), nr(a));
	}
	if (St?.has(e)) return St.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function nr(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (yt(t), nr(t));
}
function rr(e) {
	if (e.v === w) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Rt.has(t) || t.f & 2 && rr(t)) return !0;
	return !1;
}
function ir(e) {
	var t = Fn;
	try {
		return Fn = !0, e();
	} finally {
		Fn = t;
	}
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var ar = ["touchstart", "touchmove"];
function or(e) {
	return ar.includes(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dev/css.js
var sr = Symbol("events"), cr = /* @__PURE__ */ new Set(), lr = /* @__PURE__ */ new Set();
function ur(e) {
	if (!T) return;
	e.removeAttribute("onload"), e.removeAttribute("onerror");
	let t = e.__e;
	t !== void 0 && (e.__e = void 0, queueMicrotask(() => {
		e.isConnected && e.dispatchEvent(t);
	}));
}
function dr(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || gr.call(t, e), !e.cancelBubble) return ot(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? Ze(() => {
		t.addEventListener(e, i, r);
	}) : t.addEventListener(e, i, r), i;
}
function fr(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = dr(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && dn(() => {
		t.removeEventListener(e, o, a);
	});
}
function H(e, t, n) {
	(t[sr] ??= {})[e] = n;
}
function pr(e) {
	for (var t = 0; t < e.length; t++) cr.add(e[t]);
	for (var n of lr) n(e);
}
var mr = null, hr = !1;
function gr(e) {
	var t = this, n = t.ownerDocument, r = e.type, a = e.composedPath?.() || [], o = a[0] || e.target;
	mr = e, hr || (hr = !0, setTimeout(() => {
		hr = !1, mr = null;
	}));
	var s = 0, c = mr === e && e[sr];
	if (c) {
		var l = a.indexOf(c);
		if (l !== -1 && (t === document || t === window)) {
			e[sr] = t;
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
		var d = z, f = B;
		In(null), Ln(null);
		try {
			for (var p, m = []; o !== null && o !== t;) {
				try {
					var h = o[sr]?.[r];
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
			e[sr] = t, delete e.currentTarget, In(d), Ln(f);
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
	var t = nn("template");
	return t.innerHTML = vr(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
function br(e, t) {
	var n = B;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function U(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i, a = !e.startsWith("<!>");
	return () => {
		if (T) return br(E, null), E;
		i === void 0 && (i = yr(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ Qt(i)));
		var t = r || qt ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ Qt(t), s = t.lastChild;
			br(o, s);
		} else br(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function xr(e, t, n = "svg") {
	var r = !e.startsWith("<!>"), i = !!(t & 1), a = `<${n}>${r ? e : "<!>" + e}</${n}>`, o;
	return () => {
		if (T) return br(E, null), E;
		if (!o) {
			var e = /* @__PURE__ */ Qt(yr(a));
			if (i) for (o = document.createDocumentFragment(); /* @__PURE__ */ Qt(e);) o.appendChild(/* @__PURE__ */ Qt(e));
			else o = /* @__PURE__ */ Qt(e);
		}
		var t = o.cloneNode(!0);
		if (i) {
			var n = /* @__PURE__ */ Qt(t), r = t.lastChild;
			br(n, r);
		} else br(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Sr(e, t) {
	return /* @__PURE__ */ xr(e, t, "svg");
}
function Cr(e = "") {
	if (!T) {
		var t = Zt(e + "");
		return br(t, t), t;
	}
	var n = E;
	return n.nodeType === 3 ? rn(n) : (n.before(n = Zt()), Ce(n)), br(n, n), n;
}
function wr() {
	if (T) return br(E, null), E;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = Zt();
	return e.append(t, n), br(t, n), e;
}
function W(e, t) {
	if (T) {
		var n = B;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = E), we();
		return;
	}
	e !== null && e.before(t);
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function Tr(e) {
	let t = 0, n = Bt(0), r;
	return () => {
		un() && (V(n), _n(() => (t === 0 && (r = ir(() => e(() => Wt(n)))), t += 1, () => {
			Ze(() => {
				--t, t === 0 && (r?.(), r = void 0, Wt(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var Er = S | C;
function Dr(e, t, n, r) {
	new Or(e, t, n, r);
}
var Or = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = T ? E : null;
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
	#h = Tr(() => (this.#m = Bt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = B;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = B.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = vn(() => {
			if (T) {
				let e = this.#t;
				we();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, Er), T && (this.#e = E);
	}
	#g() {
		try {
			this.#a = yn(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		Ze(r), t && (this.#s = yn(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			if (t) {
				xe();
				return;
			}
			t = !0, n && He(), this.#s !== null && En(this.#s, () => {
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
					on(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = yn(() => e(this.#e)), Ze(() => {
			var e = this.#c = document.createDocumentFragment(), t = Zt(), n = !1;
			if (e.append(t), this.#a = this.#S(() => {
				try {
					return yn(() => this.#r(t));
				} catch (e) {
					try {
						this.error(e), n = !0;
					} catch (e) {
						on(e, this.#i.parent);
					}
					return null;
				}
			}), this.#a === null) {
				this.#c = null, n && this.#x(A);
				return;
			}
			this.#u === 0 && (this.#e.before(e), this.#c = null, En(this.#o, () => {
				this.#o = null;
			}), this.#x(A));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = yn(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				An(this.#a, e);
				let t = this.#n.pending;
				this.#o = yn(() => t(this.#e));
			} else this.#x(A);
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
		var t = B, n = z, r = Ue;
		Ln(this.#i), In(this.#i), We(this.#i.ctx);
		try {
			return At.ensure(), e();
		} finally {
			Ln(t), In(n), We(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && En(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, Ze(() => {
			this.#d = !1, this.#m && Ht(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), V(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		A?.is_fork ? (this.#a && A.skip_effect(this.#a), this.#o && A.skip_effect(this.#o), this.#s && A.skip_effect(this.#s), A.oncommit(() => {
			this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (Cn(this.#a), null), this.#o &&= (Cn(this.#o), null), this.#s &&= (Cn(this.#s), null), T && (Ce(this.#t), Te(), Ce(Ee()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return yn(() => {
						var r = B;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return on(e, this.#i.parent), null;
				}
			}));
		};
		Ze(() => {
			var t;
			try {
				t = this.transform_error(e);
			} catch (e) {
				on(e, this.#i && this.#i.parent);
				return;
			}
			typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => on(e, this.#i && this.#i.parent)) : n(t);
		});
	}
};
function G(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[pe] ??= e.nodeValue) && (e[pe] = n, e.nodeValue = `${n}`);
}
function kr(e, t) {
	return jr(e, t);
}
var Ar = /* @__PURE__ */ new Map();
function jr(e, { target: t, anchor: n, props: i = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	Xt();
	var l = void 0, u = mn(() => {
		var s = n ?? t.appendChild(Zt());
		Dr(s, { pending: () => {} }, (t) => {
			Ge({});
			var n = Ue;
			if (o && (n.c = o), a && (i.$$events = a), T && br(t, null), l = e(t, i) || qe(), T && (B.nodes.end = E, E === null || E.nodeType !== 8 || E.data !== "]")) throw be(), _e;
			Ke();
		}, c);
		var u = /* @__PURE__ */ new Set(), d = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!u.has(r)) {
					u.add(r);
					var i = or(r);
					for (let e of [t, document]) {
						var a = Ar.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Ar.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, gr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return d(r(cr)), lr.add(d), () => {
			for (var e of u) for (let n of [t, document]) {
				var r = Ar.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, gr), r.delete(e), r.size === 0 && Ar.delete(n)) : r.set(e, i);
			}
			lr.delete(d), s !== n && s.parentNode?.removeChild(s);
		};
	});
	return Mr.set(l, u), l;
}
var Mr = /* @__PURE__ */ new WeakMap();
function Nr(e, t) {
	let n = Mr.get(e);
	return n ? (Mr.delete(e), n(t)) : Promise.resolve();
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/branches.js
var Pr = class {
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
			if (n) On(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (On(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (Cn(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						An(r, t), t.append(Zt()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else Cn(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), En(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (Cn(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = A, r = tn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) {
			if (r) {
				var i = document.createDocumentFragment(), a = Zt();
				i.append(a), this.#n.set(e, {
					effect: yn(() => t(a)),
					fragment: i
				});
			} else this.#t.set(e, yn(() => t(this.anchor)));
		}
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else T && (this.anchor = E), this.#a(n);
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/if.js
function K(e, t, n = !1) {
	var r;
	T && (r = E, we());
	var i = new Pr(e), a = n ? S : 0;
	function o(e, t) {
		if (T) {
			var n = De(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Ee();
				Ce(a), i.anchor = a, Se(!1), i.ensure(e, t), Se(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	vn(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/each.js
function Fr(e, t) {
	return t;
}
function Ir(e, t, n) {
	for (var i = [], a = t.length, o, s = t.length, c = 0; c < a; c++) {
		let n = t[c];
		En(n, () => {
			if (o) {
				if (o.pending.delete(n), o.done.add(n), o.pending.size === 0) {
					var t = e.outrogroups;
					Lr(e, r(o.done)), t.delete(o), t.size === 0 && (e.outrogroups = null);
				}
			} else --s;
		}, !1);
	}
	if (s === 0) {
		var l = i.length === 0 && n !== null && e.pending.size === 0;
		if (l) {
			var u = n, d = u.parentNode;
			en(d), d.append(u), e.items.clear();
		}
		Lr(e, t, !l);
	} else o = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(o);
}
function Lr(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= te, An(a, document.createDocumentFragment())) : Cn(t[i], n);
	}
}
var Rr;
function q(t, n, i, a, o, s = null) {
	var c = t, l = /* @__PURE__ */ new Map();
	if (n & 4) {
		var u = t;
		c = T ? Ce(/* @__PURE__ */ Qt(u)) : u.appendChild(Zt());
	}
	T && we();
	var d = null, f = /* @__PURE__ */ mt(() => {
		var t = i();
		return e(t) ? t : t == null ? [] : r(t);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, Br(v, p, c, n, a), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= te, Hr(d, null, c)) : On(d) : En(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: vn(() => {
			p = V(f);
			var e = p.length;
			let t = !1;
			T && De(c) === "[!" != (e === 0) && (c = Ee(), Ce(c), Se(!1), t = !0);
			for (var r = /* @__PURE__ */ new Set(), u = A, v = tn(), y = 0; y < e; y += 1) {
				T && E.nodeType === 8 && E.data === "]" && (c = E, t = !0, Se(!1));
				var b = p[y], x = a(b, y), S = h ? null : l.get(x);
				S ? (S.v && Ht(S.v, b), S.i && Ht(S.i, y), v && u.unskip_effect(S.e)) : (S = Vr(l, h ? c : Rr ??= Zt(), b, x, y, o, n, i), h || (S.e.f |= te), l.set(x, S)), r.add(x);
			}
			if (e === 0 && s && !d && (h ? d = yn(() => s(c)) : (d = yn(() => s(Rr ??= Zt())), d.f |= te)), e > r.size && Ne("", "", ""), T && e > 0 && Ce(Ee()), !h) {
				if (m.set(u, r), v) {
					for (let [e, t] of l) r.has(e) || u.skip_effect(t.e);
					u.oncommit(g), u.ondiscard(_);
				} else g(u);
			}
			t && Se(!0), V(f);
		}),
		flags: n,
		items: l,
		pending: m,
		outrogroups: null,
		fallback: d
	};
	h = !1, T && (c = E);
}
function zr(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function Br(e, t, n, i, a) {
	var o = !!(i & 8), s = t.length, c = e.items, l = zr(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (o) for (v = 0; v < s; v += 1) h = t[v], g = a(h, v), _ = c.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < s; v += 1) {
		if (h = t[v], g = a(h, v), _ = c.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (On(_), o && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) {
			if (_.f ^= te, _ === l) Hr(_, null, n);
			else {
				var y = d ? d.next : l;
				_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), Ur(e, d, _), Ur(e, _, y), Hr(_, y, n), d = _, p = [], m = [], l = zr(d.next);
				continue;
			}
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], C = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) Hr(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					Ur(e, S.prev, C.next), Ur(e, d, S), Ur(e, C, b), l = b, d = C, --v, p = [], m = [];
				} else u.delete(_), Hr(_, l, n), Ur(e, _.prev, _.next), Ur(e, _, d === null ? e.effect.first : d.next), Ur(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = zr(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = zr(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (Lr(e, r(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var ee = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || ee.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && ee.push(l), l = zr(l.next);
		var ne = ee.length;
		if (ne > 0) {
			var re = i & 4 && s === 0 ? n : null;
			if (o) {
				for (v = 0; v < ne; v += 1) ee[v].nodes?.a?.measure();
				for (v = 0; v < ne; v += 1) ee[v].nodes?.a?.fix();
			}
			Ir(e, ee, re);
		}
	}
	o && Ze(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function Vr(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Bt(n) : /* @__PURE__ */ Vt(n, !1, !1) : null, l = o & 2 ? Bt(i) : null;
	return {
		v: c,
		i: l,
		e: yn(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function Hr(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ $t(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function Ur(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/css.js
function Wr(e, t) {
	hn(() => {
		e = B?.parent?.nodes?.start ?? e;
		var n = e.getRootNode(), r = n.host ? n : n.head ?? n.ownerDocument.head;
		if (!r.querySelector("#" + t.hash)) {
			let e = nn("style");
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
	var o = e[de];
	if (T || o !== n || o === void 0) {
		var s = Kr(n, r, a);
		(!T || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[de] = n;
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
	var i = e[fe];
	if (T || i !== t) {
		var a = Yr(t, r);
		(!T || a !== e.getAttribute("style")) && (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[fe] = t;
	} else r && (Array.isArray(r) ? (Xr(e, n?.[0], r[0]), Xr(e, n?.[1], r[1], "important")) : Xr(e, n, r));
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attributes.js
var Qr = Symbol("is custom element"), $r = Symbol("is html"), ei = ge ? "link" : "LINK", ti = ge ? "progress" : "PROGRESS";
function ni(e) {
	if (T) {
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
		e[me] = n, Ze(n), at();
	}
}
function ri(e, t) {
	var n = ii(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === ti) && (e.value = t ?? "");
}
function Y(e, t, n, r) {
	var i = ii(e);
	T && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === ei) || i[t] !== (i[t] = n) && (t === "loading" && (e[le] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && oi(e).has(t) ? e[t] = n : e.setAttribute(t, n));
}
function ii(e) {
	return e[ue] ??= {
		[Qr]: e.nodeName.includes("-"),
		[$r]: e.namespaceURI === ve
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
	return e === t || e?.[oe] === t;
}
function ci(e = qe(), t, n, r) {
	var i = Ue.r, a = B;
	return hn(() => {
		var o, s;
		return _n(() => {
			o = s, s = r?.() || [], ir(() => {
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
	var i = !0, o = !!(n & 8), s = !!(n & 16), c = r, l = !0, u = void 0, d = () => s && i ? (u ??= /* @__PURE__ */ dt(r), V(u)) : (l && (l = !1, c = s ? ir(r) : r), c);
	let f;
	if (o) {
		var p = oe in e || ce in e;
		f = a(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	o ? [m, h] = rt(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && Re(t), f(m)));
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
	var v = !1, y = (n & 1 ? dt : mt)(() => (v = !1, g()));
	o && V(y);
	var b = B;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? V(y) : i && o ? N(e) : e;
			return M(y, n), v = !0, c !== void 0 && (c = n), e;
		}
		return Nn && v || b.f & 16384 ? y.v : V(y);
	});
}
function ui(e) {
	Ue === null && je("onMount"), fn(() => {
		let t = ir(e);
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
}, Ni = (e, t = Date.now()) => {
	let n = e ? Date.parse(e) : NaN;
	if (Number.isNaN(n)) return "";
	let r = Math.round((t - n) / 6e4);
	return r < 1 ? "just now" : r < 60 ? `${r} min ago` : r < 1440 ? `${Math.round(r / 60)} h ago` : new Date(n).toLocaleDateString();
}, Pi = (e, t, n) => (e ?? []).reduce((e, r, i) => n(r) <= t ? i : e, e?.length ? 0 : -1), Fi = (e, t) => Pi(e, t, (e) => e.start), Ii = (e, t) => [t, ...e.filter((e) => e !== t)], Li = (e, t) => [...e.filter((e) => e !== t), t], Ri = (e, t) => e.filter((e) => e !== t), zi = (e, t) => {
	let n = Math.max(0, Fi(e, t));
	return {
		index: n,
		offset: Math.max(0, t - (e[n]?.start ?? 0))
	};
}, Bi = (e, t) => Object.fromEntries(Object.entries(e).sort((e, t) => t[1].at - e[1].at).slice(0, t)), Vi = (e, t) => {
	let n = Fi(e, t);
	return n < 0 ? 0 : t - e[n].start > 3 ? e[n].start : e[n - 1]?.start ?? 0;
};
function Hi(e, t, n = 1, r = n * e.speed) {
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
var Ui = (e, t, n) => Math.max(0, e - t) / n, Wi = (e) => typeof e == "number" && e < 60 ? Math.max(0, e / 60) : 1, Gi = [
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
], Ki = {
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
}, qi = [
	.8,
	1,
	1.1,
	1.2,
	1.4,
	1.6,
	1.8,
	2
], Ji = [
	5,
	15,
	30,
	45,
	60,
	90
], Yi = 200, Xi = class {
	#e = /* @__PURE__ */ j(N({}));
	get items() {
		return V(this.#e);
	}
	set items(e) {
		M(this.#e, e, !0);
	}
	#t = /* @__PURE__ */ j(N({}));
	get shows() {
		return V(this.#t);
	}
	set shows(e) {
		M(this.#t, e, !0);
	}
	#n = /* @__PURE__ */ j(N({}));
	get showEpisodes() {
		return V(this.#n);
	}
	set showEpisodes(e) {
		M(this.#n, e, !0);
	}
	#r = /* @__PURE__ */ j(N([]));
	get trending() {
		return V(this.#r);
	}
	set trending(e) {
		M(this.#r, e, !0);
	}
	#i = /* @__PURE__ */ j("idle");
	get radioStatus() {
		return V(this.#i);
	}
	set radioStatus(e) {
		M(this.#i, e, !0);
	}
	#a = /* @__PURE__ */ j(N({
		slugs: [],
		cursor: null,
		status: "idle"
	}));
	get podcastBrowse() {
		return V(this.#a);
	}
	set podcastBrowse(e) {
		M(this.#a, e, !0);
	}
	#o = /* @__PURE__ */ j(N({
		ids: [],
		cursor: null,
		status: "idle"
	}));
	get bookBrowse() {
		return V(this.#o);
	}
	set bookBrowse(e) {
		M(this.#o, e, !0);
	}
	#s = /* @__PURE__ */ j(N([]));
	get newEpisodes() {
		return V(this.#s);
	}
	set newEpisodes(e) {
		M(this.#s, e, !0);
	}
	#c = /* @__PURE__ */ j("idle");
	get newStatus() {
		return V(this.#c);
	}
	set newStatus(e) {
		M(this.#c, e, !0);
	}
	#l = /* @__PURE__ */ j(N({}));
	get bookStatus() {
		return V(this.#l);
	}
	set bookStatus(e) {
		M(this.#l, e, !0);
	}
	#u = /* @__PURE__ */ j(N({}));
	get transcripts() {
		return V(this.#u);
	}
	set transcripts(e) {
		M(this.#u, e, !0);
	}
	#d = /* @__PURE__ */ j(N({
		q: "",
		hits: [],
		status: "idle"
	}));
	get search() {
		return V(this.#d);
	}
	set search(e) {
		M(this.#d, e, !0);
	}
	#f = /* @__PURE__ */ j(N({
		ids: [],
		page: 0,
		more: !1,
		total: 0,
		status: "idle"
	}));
	get stationHits() {
		return V(this.#f);
	}
	set stationHits(e) {
		M(this.#f, e, !0);
	}
	#p = /* @__PURE__ */ j(N({}));
	get radioLists() {
		return V(this.#p);
	}
	set radioLists(e) {
		M(this.#p, e, !0);
	}
	#m = /* @__PURE__ */ j(N({}));
	get nowPlaying() {
		return V(this.#m);
	}
	set nowPlaying(e) {
		M(this.#m, e, !0);
	}
	supported = !0;
	#h = /* @__PURE__ */ j("home");
	get tab() {
		return V(this.#h);
	}
	set tab(e) {
		M(this.#h, e, !0);
	}
	#g = /* @__PURE__ */ j(null);
	get showSlug() {
		return V(this.#g);
	}
	set showSlug(e) {
		M(this.#g, e, !0);
	}
	#_ = /* @__PURE__ */ j(null);
	get bookId() {
		return V(this.#_);
	}
	set bookId(e) {
		M(this.#_, e, !0);
	}
	#v = /* @__PURE__ */ j("All");
	get genre() {
		return V(this.#v);
	}
	set genre(e) {
		M(this.#v, e, !0);
	}
	#y = /* @__PURE__ */ j("");
	get query() {
		return V(this.#y);
	}
	set query(e) {
		M(this.#y, e, !0);
	}
	#b = /* @__PURE__ */ j("onair");
	get rtab() {
		return V(this.#b);
	}
	set rtab(e) {
		M(this.#b, e, !0);
	}
	#x = /* @__PURE__ */ j(null);
	get pop() {
		return V(this.#x);
	}
	set pop(e) {
		M(this.#x, e, !0);
	}
	#S = /* @__PURE__ */ j(null);
	get toast() {
		return V(this.#S);
	}
	set toast(e) {
		M(this.#S, e, !0);
	}
	#C = /* @__PURE__ */ j(null);
	get now() {
		return V(this.#C);
	}
	set now(e) {
		M(this.#C, e, !0);
	}
	#w = /* @__PURE__ */ j(0);
	get pos() {
		return V(this.#w);
	}
	set pos(e) {
		M(this.#w, e, !0);
	}
	#T = /* @__PURE__ */ j(!1);
	get playing() {
		return V(this.#T);
	}
	set playing(e) {
		M(this.#T, e, !0);
	}
	#E = /* @__PURE__ */ j(!1);
	get buffering() {
		return V(this.#E);
	}
	set buffering(e) {
		M(this.#E, e, !0);
	}
	#D = /* @__PURE__ */ j(!1);
	get loadingItem() {
		return V(this.#D);
	}
	set loadingItem(e) {
		M(this.#D, e, !0);
	}
	#O = /* @__PURE__ */ j(1);
	get speed() {
		return V(this.#O);
	}
	set speed(e) {
		M(this.#O, e, !0);
	}
	#k = /* @__PURE__ */ j(N({}));
	get speeds() {
		return V(this.#k);
	}
	set speeds(e) {
		M(this.#k, e, !0);
	}
	#A = /* @__PURE__ */ j(N([]));
	get queue() {
		return V(this.#A);
	}
	set queue(e) {
		M(this.#A, e, !0);
	}
	#j = /* @__PURE__ */ j(N({}));
	get progress() {
		return V(this.#j);
	}
	set progress(e) {
		M(this.#j, e, !0);
	}
	#M = /* @__PURE__ */ j(N({}));
	get played() {
		return V(this.#M);
	}
	set played(e) {
		M(this.#M, e, !0);
	}
	#N = /* @__PURE__ */ j(N({}));
	get subscribed() {
		return V(this.#N);
	}
	set subscribed(e) {
		M(this.#N, e, !0);
	}
	#P = /* @__PURE__ */ j(N({}));
	get bookmarks() {
		return V(this.#P);
	}
	set bookmarks(e) {
		M(this.#P, e, !0);
	}
	#F = /* @__PURE__ */ j(N([]));
	get recentStations() {
		return V(this.#F);
	}
	set recentStations(e) {
		M(this.#F, e, !0);
	}
	#I = /* @__PURE__ */ j(null);
	get sleep() {
		return V(this.#I);
	}
	set sleep(e) {
		M(this.#I, e, !0);
	}
	#L = /* @__PURE__ */ j(.8);
	get volume() {
		return V(this.#L);
	}
	set volume(e) {
		M(this.#L, e, !0);
	}
	#R = /* @__PURE__ */ j(!1);
	get muted() {
		return V(this.#R);
	}
	set muted(e) {
		M(this.#R, e, !0);
	}
	#z = /* @__PURE__ */ j(!1);
	get restored() {
		return V(this.#z);
	}
	set restored(e) {
		M(this.#z, e, !0);
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
	lastSaved = 0;
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
		return this.timers = [], clearTimeout(this.toastTimer), clearTimeout(this.searchTimer), clearTimeout(this.saveTimer), this.saveTimer = void 0, this.engine.destroy(), this.restored ? (this.saveCurrent(), this.restored = !1, this.persist()) : Promise.resolve();
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
		return Fi(this.chapters, this.pos);
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
		return e ? Pi(e.lines, this.pos, (e) => e.t) : -1;
	}
	get kindLabel() {
		let e = this.item;
		return e ? e.type === "radio" ? "● LIVE RADIO" : di[e.type].toUpperCase() : "";
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
		return e ? Ki[e.type] : ["queue"];
	}
	get activeRtab() {
		let e = this.rightTabs;
		return e.includes(this.rtab) ? this.rtab : e[0];
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
	async loadStations(e = this.genre, t = !1) {
		let n = this.api, r = Gi.find((t) => t.label === e), i = this.radioLists[e];
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
			let e = [], i = o.page + 1, s = null, c = !1, l = (e) => Di(e, "stations").map(xi).filter((e) => !!e);
			if (!r.slugs.length) {
				if (n.stations.browse) {
					let r = Ei(await n.stations.browse(t ? o.cursor ?? void 0 : void 0));
					e = l(r), s = typeof r.next_cursor == "string" && r.next_cursor ? r.next_cursor : null, c = !!s;
				} else e = l(await n.stations.trending(30));
			} else if (n.stations.genre) {
				let t = await Promise.all(r.slugs.map((e) => n.stations.genre(e, i).catch(() => null)));
				if (t.every((e) => e === null)) throw Error("genre unavailable");
				let a = t.map(l);
				for (let t = 0; a.some((e) => t < e.length); t++) for (let n of a) n[t] && e.push(n[t]);
				c = t.some((e) => Ei(e).has_more === !0);
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
			let t = Ei(await this.api.stations.nowPlaying(e.stationId)), n = (e) => {
				let t = typeof e.title == "string" && e.title !== "Live broadcast" ? e.title : "", n = typeof e.artwork_url == "string" && e.artwork_url.startsWith("https://") ? e.artwork_url : void 0;
				return {
					title: t,
					artist: typeof e.artist == "string" ? e.artist : "",
					art: n,
					at: typeof e.played_at == "string" ? e.played_at : void 0
				};
			}, r = Di(t, "recent").map(n).filter((e) => e.title), i = this.nowPlaying[e.stationId], a = {
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
				let e = Di(await this.api.search(t, "all"), "results");
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
				let t = Ei(await r.stations.search(e, 20, i.page + 1));
				if (n !== this.searchSeq) return;
				let a = Di(t, "stations").map(xi).filter((e) => !!e);
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
		e && e.type !== "radio" && (this.progress = Bi({
			...this.progress,
			[e.id]: {
				pos: Math.round(this.pos),
				dur: this.durOf(e.id),
				at: Date.now()
			}
		}, Yi));
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
		this.pos = X(n) && n.dur && r >= n.dur - 5 ? 0 : r, this.queue = Ri(this.queue, e), this.speed = this.speedFor(e), n.type === "radio" && (this.recentStations = [e, ...this.recentStations.filter((t) => t !== e)].slice(0, 6)), Ki[n.type].includes(this.rtab) || (this.rtab = Ki[n.type][0]), this.playing = !0, this.sync(!0), n.type === "radio" && this.refreshNowPlaying(), this.rtab === "trans" && this.loadTranscript(), this.scheduleSave();
	}
	stop() {
		this.item && (this.playing = !1, this.sync());
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
		e && X(e) && this.seekTo(Vi(e.chapters, this.pos));
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
				let { index: n, offset: r } = zi(t.chapters, e), i = t.chapters[n];
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
				let t = Fi(e.chapters, this.pos + 1), n = e.chapters[t + 1];
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
		X(t) && this.engine.active && (n = (t.type === "book" ? t.chapters[zi(t.chapters, this.pos).index]?.start ?? 0 : 0) + this.engine.time - this.pos, (n < 0 || n > 10) && (n = 0)), t.type === "podcast" && !t.dur && this.engine.duration && (this.items = {
			...this.items,
			[t.id]: {
				...t,
				dur: Math.round(this.engine.duration)
			}
		});
		let r = X(t) ? this.durOf(t.id) || 2 ** 53 - 1 : 0, i = Hi({
			pos: this.pos,
			speed: this.speed,
			sleep: this.sleep
		}, X(t) ? {
			dur: r,
			chapters: t.type === "book" ? [] : t.chapters
		} : null, e, n);
		this.pos = i.ended ? this.pos : i.pos, this.sleep = i.sleep, this.playing = i.playing, i.reason === "timer" && this.say("Sleep timer ended. Sweet dreams."), i.reason === "chapter" && this.say("Sleep timer: paused at end of chapter"), this.sync(), X(t) && Date.now() - this.lastSaved > 1e4 && (this.lastSaved = Date.now(), this.saveCurrent(), this.scheduleSave());
	}
	playNext(e) {
		this.queue = Ii(this.queue, e), this.say(`Playing next: ${this.items[e]?.title ?? ""}`), this.scheduleSave();
	}
	addToQueue(e) {
		this.queue = Li(this.queue, e), this.say("Added to queue"), this.scheduleSave();
	}
	removeFromQueue(e) {
		this.queue = Ri(this.queue, e), this.scheduleSave();
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
		let n = X(e), r = n ? this.pos : 0, i = Math.max(0, r - 30), a = this.transcript?.lines ?? [], o = n ? a.filter((e, t) => e.t <= r && (a[t + 1]?.t ?? Infinity) > i) : [], s = e.type === "radio" ? this.songOf(e.stationId) : "", c = /* @__PURE__ */ new Date(), l = e.type === "radio" && s || e.title, u = [
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
		let t = this.progressOf(e.id), n = Fi(e.chapters, t), r = n >= 0 ? `Chapter ${mi(n)} · ${Ai(t - e.chapters[n].start)}` : Ai(t);
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
					let { index: e, offset: n } = zi(t.chapters, this.pos), r = t.chapters[e];
					r?.url ? this.engine.load(r.url, n) : this.loadedId = null;
				}
			}
			this.engine.apply({
				playing: this.playing,
				rate: this.live ? 1 : this.speed,
				volume: this.muted ? 0 : this.volume * Wi(this.sleep)
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
			album: `TEND Media · ${di[n.type]}`,
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
	book: "M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h10"
}, Zi = /* @__PURE__ */ Sr("<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path></path></svg>"), Qi = /* @__PURE__ */ Sr("<svg viewBox=\"0 0 24 24\" fill=\"currentColor\" aria-hidden=\"true\"><path></path></svg>");
function $(e, t) {
	let n = li(t, "size", 3, 16), r = li(t, "stroke", 3, 0);
	var i = wr(), a = F(i), o = (e) => {
		var i = Zi(), a = I(i);
		R(() => {
			Y(i, "width", n()), Y(i, "height", n()), Y(i, "stroke-width", r()), Y(a, "d", t.d);
		}), W(e, i);
	}, s = (e) => {
		var r = Qi(), i = I(r);
		R(() => {
			Y(r, "width", n()), Y(r, "height", n()), Y(i, "d", t.d);
		}), W(e, r);
	};
	K(a, (e) => {
		r() ? e(o) : e(s, -1);
	}), W(e, i);
}
//#endregion
//#region src/components/TopBar.svelte
var $i = /* @__PURE__ */ U("<header class=\"bar svelte-1h259us\"><span class=\"by svelte-1h259us\">Powered by OndaCast</span> <div class=\"spacer svelte-1h259us\"></div> <label class=\"search svelte-1h259us\"><!> <input type=\"search\" placeholder=\"Search stations, shows, books\" aria-label=\"Search stations, shows and books\" class=\"svelte-1h259us\"/></label></header>"), ea = {
	hash: "svelte-1h259us",
	code: ".bar.svelte-1h259us {height:36px;flex:none;display:flex;align-items:center;gap:10px;padding:0 14px;background:var(--tm-panel);border-bottom:1px solid var(--tm-fg-6);}.by.svelte-1h259us {font-size:11px;color:var(--tm-muted);}.spacer.svelte-1h259us {flex:1;}.search.svelte-1h259us {display:flex;align-items:center;gap:8px;height:24px;padding:0 10px;border-radius:7px;background:var(--tm-fg-6);width:220px;box-sizing:border-box;color:var(--tm-muted);}.search.svelte-1h259us:focus-within {box-shadow:0 0 0 1px var(--tm-accent);}input.svelte-1h259us {flex:1;min-width:0;border:0;background:none;outline:none;color:var(--tm-fg);font:inherit;font-size:11.5px;padding:0;}input.svelte-1h259us::placeholder {color:var(--tm-muted);opacity:1;}input.svelte-1h259us::-webkit-search-cancel-button {display:none;}"
};
function ta(e, t) {
	Ge(t, !0), Wr(e, ea);
	var n = $i(), r = L(P(n), 4), i = P(r);
	$(i, {
		get d() {
			return Q.search;
		},
		size: 13,
		stroke: 2
	});
	var a = L(i, 2);
	ni(a), D(r), D(n), R(() => ri(a, t.store.query)), H("input", a, (e) => t.store.setQuery(e.currentTarget.value)), H("keydown", a, (e) => {
		e.key === "Escape" && t.store.setQuery("");
	}), W(e, n), Ke();
}
pr(["input", "keydown"]);
//#endregion
//#region src/components/Cover.svelte
var na = /* @__PURE__ */ U("<img alt=\"\" loading=\"lazy\" decoding=\"async\" referrerpolicy=\"no-referrer\" class=\"svelte-2fjyqn\"/>"), ra = /* @__PURE__ */ U("<div><!></div>"), ia = {
	hash: "svelte-2fjyqn",
	code: ".cover.svelte-2fjyqn {flex:none;display:grid;place-items:center;overflow:hidden;font-family:ui-monospace, Menlo, monospace;font-weight:600;color:rgba(255, 255, 255, .75);}.cover.fill.svelte-2fjyqn {flex:1;}img.svelte-2fjyqn {width:100%;height:100%;object-fit:cover;display:block;}"
};
function aa(e, t) {
	Ge(t, !0), Wr(e, ia);
	let n = li(t, "radius", 3, 8), r = li(t, "mark", 3, ""), i = li(t, "font", 3, 11), a = li(t, "fill", 3, !1), o = /* @__PURE__ */ j(!1);
	fn(() => {
		t.art, M(o, !1);
	});
	var s = ra();
	let c, l;
	var u = P(s), d = (e) => {
		var n = na();
		R(() => Y(n, "src", t.art)), fr("error", n, () => M(o, !0)), ur(n), W(e, n);
	}, f = (e) => {
		var t = Cr();
		R(() => G(t, r())), W(e, t);
	};
	K(u, (e) => {
		t.art && !V(o) ? e(d) : e(f, -1);
	}), D(s), R((e) => {
		c = J(s, 1, "cover svelte-2fjyqn", null, c, { fill: a() }), l = Zr(s, "", l, {
			width: a() ? "100%" : `${t.size}px`,
			height: a() ? "100%" : `${t.size}px`,
			"border-radius": `${n() ?? ""}px`,
			background: e,
			"font-size": `${i() ?? ""}px`
		});
	}, [() => ki(t.hue)]), W(e, s), Ke();
}
//#endregion
//#region src/components/Sidebar.svelte
var oa = /* @__PURE__ */ U("<button><!> </button>"), sa = /* @__PURE__ */ U("<span class=\"dot svelte-181dlmc\" aria-label=\"New episodes\"></span>"), ca = /* @__PURE__ */ U("<button><!> <span class=\"title svelte-181dlmc\"> </span> <!></button>"), la = /* @__PURE__ */ U("<div class=\"empty svelte-181dlmc\">Subscribe to a show to see it here.</div>"), ua = /* @__PURE__ */ U("<nav class=\"side svelte-181dlmc\" aria-label=\"TEND Media\"><!> <div class=\"heading svelte-181dlmc\">Your shows</div> <!> <div class=\"spacer svelte-181dlmc\"></div> <div class=\"tip svelte-181dlmc\"><b class=\"svelte-181dlmc\">Clips go to Notes.</b> Press the clip button to save the last 30 seconds, with its transcript, to TEND Notes.</div></nav>"), da = {
	hash: "svelte-181dlmc",
	code: ".side.svelte-181dlmc {width:188px;flex:none;padding:18px 12px;display:flex;flex-direction:column;gap:2px;border-right:1px solid var(--tm-fg-6);box-sizing:border-box;overflow:auto;}.tab.svelte-181dlmc {display:flex;align-items:center;gap:11px;height:36px;flex:none;padding:0 10px;border:0;border-radius:9px;background:transparent;color:var(--tm-fg);font-size:13px;font-weight:500;cursor:pointer;text-align:left;}.tab.svelte-181dlmc:hover {background:var(--tm-fg-6);}.tab.on.svelte-181dlmc {background:var(--tm-accent-12);color:var(--tm-accent);}.heading.svelte-181dlmc {margin:22px 10px 8px;font-size:10.5px;letter-spacing:1px;text-transform:uppercase;color:var(--tm-muted);}.show.svelte-181dlmc {display:flex;align-items:center;gap:10px;padding:6px 10px;font-size:12.5px;color:var(--tm-fg);border:0;border-radius:8px;background:none;cursor:pointer;text-align:left;}.show.svelte-181dlmc:hover {background:var(--tm-fg-4);}.show.on.svelte-181dlmc {background:var(--tm-fg-6);}.title.svelte-181dlmc {flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.dot.svelte-181dlmc {width:6px;height:6px;border-radius:3px;background:var(--tm-accent);flex:none;}.empty.svelte-181dlmc {padding:6px 10px;font-size:11.5px;color:var(--tm-muted);}.spacer.svelte-181dlmc {flex:1;min-height:12px;}.tip.svelte-181dlmc {padding:12px 10px;border-radius:10px;background:var(--tm-accent-8);font-size:11.5px;line-height:1.45;color:var(--tm-muted);}.tip.svelte-181dlmc b:where(.svelte-181dlmc) {color:var(--tm-fg);font-weight:600;}"
};
function fa(e, t) {
	Ge(t, !0), Wr(e, da);
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
	], i = /* @__PURE__ */ k(() => Object.values(n().subscribed)), a = (e) => n().newEpisodes.some((t) => {
		let r = n().items[t];
		return r?.type === "podcast" && r.show === e && !n().isDone(t) && !n().progressOf(t);
	});
	var o = ua(), s = P(o);
	q(s, 17, () => r, Fr, (e, t) => {
		var r = /* @__PURE__ */ k(() => m(V(t), 3));
		let i = () => V(r)[0], a = () => V(r)[1], o = () => V(r)[2];
		var s = oa();
		let c;
		var l = P(s);
		$(l, {
			get d() {
				return o();
			},
			size: 17,
			stroke: 1.7
		});
		var u = L(l, 1, !0);
		D(s), R(() => {
			c = J(s, 1, "tab svelte-181dlmc", null, c, { on: n().tab === i() && !n().query }), Y(s, "aria-current", n().tab === i() && !n().query ? "page" : void 0), G(u, a());
		}), H("click", s, () => {
			n().tab = i(), n().setQuery(""), i() === "pod" && (n().showSlug = null), i() === "book" && (n().bookId = null);
		}), W(e, s);
	}), q(L(s, 4), 17, () => V(i), (e) => e.slug, (e, t) => {
		var r = ca();
		let i;
		var o = P(r);
		aa(o, {
			get hue() {
				return V(t).hue;
			},
			get art() {
				return V(t).art;
			},
			size: 26,
			radius: 6,
			font: 9,
			get mark() {
				return V(t).mark;
			}
		});
		var s = L(o, 2), c = I(s, !0), l = L(s, 2), u = (e) => {
			W(e, sa());
		}, d = /* @__PURE__ */ k(() => a(V(t).id));
		K(l, (e) => {
			V(d) && e(u);
		}), D(r), R(() => {
			i = J(r, 1, "show svelte-181dlmc", null, i, { on: n().tab === "pod" && n().showSlug === V(t).slug }), G(c, V(t).title);
		}), H("click", r, () => n().openShow(V(t).slug)), W(e, r);
	}, (e) => {
		W(e, la());
	}), Te(4), D(o), W(e, o), Ke();
}
pr(["click"]);
//#endregion
//#region src/components/ItemRow.svelte
var pa = /* @__PURE__ */ U("<button class=\"icon svelte-ee3n05\" title=\"Play next\"><!></button> <button class=\"icon svelte-ee3n05\" title=\"Add to queue\"><!></button>", 1), ma = /* @__PURE__ */ U("<div><!> <div class=\"text svelte-ee3n05\"><div> </div> <div class=\"meta svelte-ee3n05\"> </div></div> <!> <button class=\"play svelte-ee3n05\"><!></button></div>"), ha = {
	hash: "svelte-ee3n05",
	code: ".row.svelte-ee3n05 {display:flex;align-items:center;gap:14px;padding:10px 8px;border-radius:10px;}.row.svelte-ee3n05:hover {background:var(--tm-fg-5);}.row.cur.svelte-ee3n05 {background:var(--tm-accent-8);}.text.svelte-ee3n05 {flex:1;min-width:0;}.title.svelte-ee3n05 {font-size:13px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.cur.svelte-ee3n05 .title:where(.svelte-ee3n05) {color:var(--tm-accent);}.title.done.svelte-ee3n05 {color:var(--tm-muted);}.meta.svelte-ee3n05 {font-size:11.5px;color:var(--tm-muted);margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.icon.svelte-ee3n05 {width:32px;height:32px;flex:none;border:0;border-radius:8px;background:transparent;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;}.icon.svelte-ee3n05:hover {background:var(--tm-fg-8);color:var(--tm-fg);}.play.svelte-ee3n05 {width:34px;height:34px;flex:none;border:0;border-radius:17px;background:var(--tm-accent);color:var(--tm-on-accent);cursor:pointer;display:grid;place-items:center;}"
};
function ga(e, t) {
	Ge(t, !0), Wr(e, ha);
	let n = /* @__PURE__ */ k(() => t.store.items[t.id]), r = /* @__PURE__ */ k(() => t.id === t.store.now), i = /* @__PURE__ */ k(() => V(n) ? V(n).type === "podcast" ? [
		V(n).sub,
		bi(V(n).date),
		t.store.lenOf(t.id)
	].filter(Boolean).join(" · ") : V(n).type === "radio" ? `${di.radio} · ${V(n).sub}` : `${di.book} · ${V(n).sub}` : "");
	var a = wr(), o = F(a), s = (e) => {
		var a = ma();
		let o;
		var s = P(a);
		aa(s, {
			get hue() {
				return V(n).hue;
			},
			get art() {
				return V(n).art;
			},
			get mark() {
				return V(n).mark;
			},
			size: 44
		});
		var c = L(s, 2), l = P(c);
		let u;
		var d = I(l, !0), f = I(L(l, 2), !0);
		D(c);
		var p = L(c, 2), m = (e) => {
			var r = pa(), i = F(r);
			$(P(i), {
				get d() {
					return Q.playNext;
				},
				stroke: 1.8
			}), D(i);
			var a = L(i, 2);
			$(P(a), {
				get d() {
					return Q.plus;
				},
				stroke: 1.8
			}), D(a), R(() => {
				Y(i, "aria-label", `Play next: ${V(n).title ?? ""}`), Y(a, "aria-label", `Add to queue: ${V(n).title ?? ""}`);
			}), H("click", i, () => t.store.playNext(t.id)), H("click", a, () => t.store.addToQueue(t.id)), W(e, r);
		};
		K(p, (e) => {
			V(n).type !== "radio" && e(m);
		});
		var h = L(p, 2), g = P(h);
		{
			let e = /* @__PURE__ */ k(() => t.store.isPlaying(t.id) ? V(n).type === "radio" ? Q.stop : Q.pause : Q.play);
			$(g, {
				get d() {
					return V(e);
				},
				size: 14
			});
		}
		D(h), D(a), R((e, t) => {
			o = J(a, 1, "row svelte-ee3n05", null, o, { cur: V(r) }), u = J(l, 1, "title svelte-ee3n05", null, u, { done: e }), G(d, V(n).title), G(f, V(i)), Y(h, "aria-label", `${t ?? ""} ${V(n).title ?? ""}`);
		}, [() => !V(r) && t.store.isDone(t.id), () => t.store.isPlaying(t.id) ? V(n).type === "radio" ? "Stop" : "Pause" : "Play"]), H("click", h, () => t.store.isPlaying(t.id) && V(n).type === "radio" ? t.store.stop() : t.store.play(t.id)), W(e, a);
	};
	K(o, (e) => {
		V(n) && e(s);
	}), W(e, a), Ke();
}
pr(["click"]);
//#endregion
//#region src/components/Status.svelte
var _a = /* @__PURE__ */ U("<div class=\"line svelte-hcghuu\" role=\"status\"><span class=\"spin svelte-hcghuu\" aria-hidden=\"true\"></span>Loading…</div>"), va = /* @__PURE__ */ U("<button class=\"svelte-hcghuu\">Try again</button>"), ya = /* @__PURE__ */ U("<div class=\"line svelte-hcghuu\" role=\"alert\"> <!></div>"), ba = /* @__PURE__ */ U("<div class=\"line svelte-hcghuu\"> </div>"), xa = {
	hash: "svelte-hcghuu",
	code: ".line.svelte-hcghuu {display:flex;align-items:center;gap:10px;padding:18px 8px;font-size:12.5px;color:var(--tm-muted);}button.svelte-hcghuu {border:0;background:none;color:var(--tm-accent);font-size:12.5px;cursor:pointer;padding:0;}.spin.svelte-hcghuu {width:14px;height:14px;border-radius:50%;border:2px solid var(--tm-fg-16);border-top-color:var(--tm-accent); animation: svelte-hcghuu-spin .8s linear infinite;}\n  @keyframes svelte-hcghuu-spin { to { transform: rotate(360deg); } }\n  @media (prefers-reduced-motion: reduce) {.spin.svelte-hcghuu { animation: none;} }"
};
function Sa(e, t) {
	Wr(e, xa);
	let n = li(t, "empty", 3, ""), r = li(t, "error", 3, "OndaCast could not be reached.");
	var i = wr(), a = F(i), o = (e) => {
		W(e, _a());
	}, s = (e) => {
		var n = ya(), i = P(n, !0), a = L(i), o = (e) => {
			var n = va();
			H("click", n, function(...e) {
				t.retry?.apply(this, e);
			}), W(e, n);
		};
		K(a, (e) => {
			t.retry && e(o);
		}), D(n), R(() => G(i, r())), W(e, n);
	}, c = (e) => {
		var t = ba(), r = I(t, !0);
		R(() => G(r, n())), W(e, t);
	};
	K(a, (e) => {
		t.status === "loading" ? e(o) : t.status === "error" ? e(s, 1) : n() && e(c, 2);
	}), W(e, i);
}
pr(["click"]);
//#endregion
//#region src/components/HomeView.svelte
var Ca = /* @__PURE__ */ U("<button class=\"card svelte-oxdkf2\"><!> <span class=\"ctext svelte-oxdkf2\"><span class=\"kind svelte-oxdkf2\"> </span> <span class=\"ctitle svelte-oxdkf2\"> </span> <span class=\"bar svelte-oxdkf2\"><span class=\"svelte-oxdkf2\"></span></span> <span class=\"left svelte-oxdkf2\"> </span></span></button>"), wa = /* @__PURE__ */ U("<div class=\"continue svelte-oxdkf2\"></div>"), Ta = /* @__PURE__ */ U("<div class=\"start svelte-oxdkf2\"><button class=\"svelte-oxdkf2\">Tune in to live radio</button> <button class=\"svelte-oxdkf2\">Find a podcast</button> <button class=\"svelte-oxdkf2\">Start an audiobook</button></div>"), Ea = /* @__PURE__ */ U("<button><span class=\"banner svelte-oxdkf2\"><!><span class=\"live svelte-oxdkf2\"><i class=\"svelte-oxdkf2\"></i>LIVE</span></span> <span class=\"stext svelte-oxdkf2\"><span class=\"stitle svelte-oxdkf2\"> </span><span class=\"song svelte-oxdkf2\"> </span></span></button>"), Da = /* @__PURE__ */ U("<div class=\"onair svelte-oxdkf2\"></div>"), Oa = /* @__PURE__ */ U("<h1 class=\"h1 svelte-oxdkf2\"> </h1> <p class=\"lede svelte-oxdkf2\">Pick up where you left off across radio, podcasts and books.</p> <!> <div class=\"section svelte-oxdkf2\"><h2 class=\"svelte-oxdkf2\">On air now</h2><button class=\"link svelte-oxdkf2\">All stations</button></div> <!> <h2 class=\"h2 svelte-oxdkf2\">New from your shows</h2> <!>", 1), ka = {
	hash: "svelte-oxdkf2",
	code: ".h1.svelte-oxdkf2 {font-size:26px;font-weight:650;letter-spacing:-.5px;margin:0;}.lede.svelte-oxdkf2 {font-size:13px;color:var(--tm-muted);margin:4px 0 0;}.continue.svelte-oxdkf2 {display:grid;grid-template-columns:repeat(3, minmax(0, 1fr));gap:12px;margin-top:20px;}.card.svelte-oxdkf2 {display:flex;gap:12px;padding:12px;border:0;border-radius:14px;background:var(--tm-fg-4);color:inherit;cursor:pointer;align-items:center;text-align:left;font:inherit;}.card.svelte-oxdkf2:hover {background:var(--tm-fg-8);}.ctext.svelte-oxdkf2 {min-width:0;flex:1;display:flex;flex-direction:column;gap:4px;}.kind.svelte-oxdkf2 {font-size:10px;letter-spacing:.8px;text-transform:uppercase;color:var(--tm-accent);font-weight:600;}.ctitle.svelte-oxdkf2 {font-size:13px;font-weight:600;line-height:1.25;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.bar.svelte-oxdkf2 {height:3px;border-radius:2px;background:var(--tm-fg-10);margin-top:3px;display:block;}.bar.svelte-oxdkf2 span:where(.svelte-oxdkf2) {display:block;height:3px;border-radius:2px;background:var(--tm-accent);}.left.svelte-oxdkf2 {font-size:11px;color:var(--tm-muted);}.start.svelte-oxdkf2 {display:flex;flex-wrap:wrap;gap:8px;margin-top:18px;}.start.svelte-oxdkf2 button:where(.svelte-oxdkf2) {height:34px;padding:0 16px;border-radius:17px;border:1px solid var(--tm-fg-14);background:var(--tm-fg-4);color:var(--tm-fg);font-size:12.5px;font-weight:600;cursor:pointer;}.start.svelte-oxdkf2 button:where(.svelte-oxdkf2):hover {border-color:var(--tm-accent);}.section.svelte-oxdkf2 {display:flex;align-items:baseline;justify-content:space-between;margin:28px 0 12px;}h2.svelte-oxdkf2 {font-size:15px;font-weight:650;margin:0;}.h2.svelte-oxdkf2 {margin:28px 0 8px;}.link.svelte-oxdkf2 {border:0;background:none;color:var(--tm-accent);font-size:12px;cursor:pointer;padding:0;}.onair.svelte-oxdkf2 {display:grid;grid-template-columns:repeat(4, minmax(0, 1fr));gap:12px;}.station.svelte-oxdkf2 {border:0;padding:0;border-radius:14px;overflow:hidden;background:var(--tm-fg-4);color:inherit;cursor:pointer;text-align:left;font:inherit;display:flex;flex-direction:column;}.station.svelte-oxdkf2:hover {background:var(--tm-fg-8);}.station.cur.svelte-oxdkf2 {box-shadow:inset 0 0 0 1px var(--tm-accent);}.banner.svelte-oxdkf2 {height:78px;display:flex;width:100%;position:relative;}.live.svelte-oxdkf2 {position:absolute;left:10px;top:10px;display:inline-flex;align-items:center;gap:5px;font-size:9.5px;font-weight:700;letter-spacing:.8px;padding:3px 7px;border-radius:20px;background:rgba(0, 0, 0, .45);color:#fff;}.live.svelte-oxdkf2 i:where(.svelte-oxdkf2) {width:5px;height:5px;border-radius:3px;background:var(--tm-live);}.stext.svelte-oxdkf2 {padding:10px 12px 12px;display:flex;flex-direction:column;min-width:0;}.stitle.svelte-oxdkf2 {font-size:12.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.song.svelte-oxdkf2 {font-size:11px;color:var(--tm-muted);margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}"
};
function Aa(e, t) {
	Ge(t, !0), Wr(e, ka);
	let n = li(t, "store", 7);
	var r = Oa(), i = F(r), a = I(i, !0), o = L(i, 4), s = (e) => {
		var t = wa();
		q(t, 20, () => n().continueIds, (e) => e, (e, t) => {
			let r = /* @__PURE__ */ k(() => n().items[t]);
			var i = Ca(), a = P(i);
			aa(a, {
				get hue() {
					return V(r).hue;
				},
				get art() {
					return V(r).art;
				},
				size: 58,
				radius: 10,
				get mark() {
					return V(r).mark;
				}
			});
			var o = L(a, 2), s = P(o), c = I(s, !0), l = L(s, 2), u = I(l, !0), d = L(l, 2), f = P(d);
			let p;
			D(d);
			var m = I(L(d, 2), !0);
			D(o), D(i), R((e, t, n) => {
				Y(i, "aria-label", `${e ?? ""} ${V(r).title ?? ""}`), G(c, di[V(r).type]), G(u, V(r).title), p = Zr(f, "", p, { width: t }), G(m, n);
			}, [
				() => n().isPlaying(t) ? "Pause" : "Continue",
				() => `${n().pctOf(t) ?? ""}%`,
				() => n().leftOf(t)
			]), H("click", i, () => n().play(t)), W(e, i);
		}), D(t), W(e, t);
	}, c = (e) => {
		var t = Ta(), r = P(t), i = L(r, 2), a = L(i, 2);
		D(t), H("click", r, () => n().tab = "radio"), H("click", i, () => {
			n().tab = "pod", n().showSlug = null;
		}), H("click", a, () => {
			n().tab = "book", n().bookId = null;
		}), W(e, t);
	};
	K(o, (e) => {
		n().continueIds.length ? e(s) : e(c, -1);
	});
	var l = L(o, 2), u = L(P(l));
	D(l);
	var d = L(l, 2), f = (e) => {
		var t = Da();
		q(t, 20, () => n().onAirIds, (e) => e, (e, t) => {
			let r = /* @__PURE__ */ k(() => n().items[t]);
			var i = Ea();
			let a;
			var o = P(i);
			aa(P(o), {
				get hue() {
					return V(r).hue;
				},
				get art() {
					return V(r).art;
				},
				fill: !0,
				radius: 0,
				get mark() {
					return V(r).mark;
				},
				font: 18
			}), Te(), D(o);
			var s = L(o, 2), c = P(s), l = I(c, !0), u = I(L(c), !0);
			D(s), D(i), R((e, o) => {
				a = J(i, 1, "station svelte-oxdkf2", null, a, { cur: t === n().now }), Y(i, "aria-label", `${e ?? ""} ${V(r).title ?? ""}`), G(l, V(r).title), G(u, o);
			}, [() => n().isPlaying(t) ? "Pause" : "Play", () => V(r).type === "radio" ? n().songOf(V(r).stationId) ? `♪ ${n().songOf(V(r).stationId)}` : V(r).sub : ""]), H("click", i, () => n().play(t)), W(e, i);
		}), D(t), W(e, t);
	}, p = (e) => {
		Sa(e, {
			get status() {
				return n().radioStatus;
			},
			retry: () => n().loadRadio(),
			empty: "No stations are on air right now."
		});
	};
	K(d, (e) => {
		n().onAirIds.length ? e(f) : e(p, -1);
	}), q(L(d, 4), 16, () => n().newEpisodes, (e) => e, (e, t) => {
		ga(e, {
			get store() {
				return n();
			},
			get id() {
				return t;
			}
		});
	}, (e) => {
		Sa(e, {
			get status() {
				return n().newStatus;
			},
			retry: () => n().loadNewEpisodes(),
			empty: "Subscribe to shows in Podcasts and their new episodes land here."
		});
	}), R((e) => G(a, e), [() => Mi()]), H("click", u, () => n().tab = "radio"), W(e, r), Ke();
}
pr(["click"]);
//#endregion
//#region src/components/RadioView.svelte
var ja = /* @__PURE__ */ U("<button> </button>"), Ma = /* @__PURE__ */ U("<div class=\"song svelte-1c0iuue\"> </div>"), Na = /* @__PURE__ */ U("<div><!> <div class=\"text svelte-1c0iuue\"><div class=\"title svelte-1c0iuue\"> </div> <div class=\"sub svelte-1c0iuue\"> </div> <!></div> <button class=\"play svelte-1c0iuue\"><!></button></div>"), Pa = /* @__PURE__ */ U("<button class=\"more svelte-1c0iuue\">Show more stations</button>"), Fa = /* @__PURE__ */ U("<h1 class=\"h1 svelte-1c0iuue\">Radio</h1> <p class=\"lede svelte-1c0iuue\">Live stations from OndaCast, most listened first. Search above for any station by name, city or genre.</p> <div class=\"genres svelte-1c0iuue\" role=\"group\" aria-label=\"Genre\"></div> <div class=\"grid svelte-1c0iuue\"></div> <!> <!>", 1), Ia = {
	hash: "svelte-1c0iuue",
	code: ".h1.svelte-1c0iuue {font-size:26px;font-weight:650;letter-spacing:-.5px;margin:0;}.lede.svelte-1c0iuue {font-size:13px;color:var(--tm-muted);margin:4px 0 0;}.genres.svelte-1c0iuue {display:flex;flex-wrap:wrap;gap:8px;margin-top:18px;}.chip.svelte-1c0iuue {height:30px;padding:0 14px;border-radius:15px;border:1px solid var(--tm-fg-16);background:transparent;color:var(--tm-fg);font-size:12px;font-weight:500;cursor:pointer;}.chip.on.svelte-1c0iuue {border-color:var(--tm-accent);background:var(--tm-accent);color:var(--tm-on-accent);}.grid.svelte-1c0iuue {display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));gap:10px;margin-top:18px;}.row.svelte-1c0iuue {display:flex;align-items:center;gap:14px;padding:12px;border-radius:14px;min-width:0;}.row.svelte-1c0iuue:hover {background:var(--tm-fg-7);}.row.cur.svelte-1c0iuue {background:var(--tm-accent-8);}.text.svelte-1c0iuue {flex:1;min-width:0;}.title.svelte-1c0iuue {font-size:13.5px;font-weight:600;line-height:1.3;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical;overflow-wrap:anywhere;}.cur.svelte-1c0iuue .title:where(.svelte-1c0iuue) {color:var(--tm-accent);}.sub.svelte-1c0iuue {font-size:11.5px;color:var(--tm-muted);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.song.svelte-1c0iuue {font-size:11.5px;margin-top:5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;opacity:.85;}.more.svelte-1c0iuue {display:block;margin:18px auto 0;height:32px;padding:0 18px;border-radius:16px;border:1px solid var(--tm-fg-14);background:transparent;color:var(--tm-fg);font-size:12px;cursor:pointer;}.more.svelte-1c0iuue:hover {background:var(--tm-fg-6);}.play.svelte-1c0iuue {width:36px;height:36px;border:0;border-radius:18px;background:var(--tm-accent);color:var(--tm-on-accent);cursor:pointer;display:grid;place-items:center;flex:none;}"
};
function La(e, t) {
	Ge(t, !0), Wr(e, Ia);
	let n = li(t, "store", 7), r = /* @__PURE__ */ k(() => n().stationList);
	fn(() => {
		n().radioStatus === "idle" && n().loadRadio();
	}), fn(() => {
		V(r).status === "idle" && n().loadStations(n().genre);
	});
	var i = Fa(), a = L(F(i), 4);
	q(a, 21, () => Gi, (e) => e.label, (e, t) => {
		var r = ja();
		let i;
		var a = I(r, !0);
		R(() => {
			i = J(r, 1, "chip svelte-1c0iuue", null, i, { on: n().genre === V(t).label }), Y(r, "aria-pressed", n().genre === V(t).label), G(a, V(t).label);
		}), H("click", r, () => n().genre = V(t).label), W(e, r);
	}), D(a);
	var o = L(a, 2);
	q(o, 21, () => n().stations, (e) => e.id, (e, t) => {
		let r = /* @__PURE__ */ k(() => n().songOf(V(t).stationId)), i = /* @__PURE__ */ k(() => n().isPlaying(V(t).id));
		var a = Na();
		let o;
		var s = P(a);
		aa(s, {
			get hue() {
				return V(t).hue;
			},
			get art() {
				return V(t).art;
			},
			size: 56,
			radius: 12,
			get mark() {
				return V(t).mark;
			},
			font: 12
		});
		var c = L(s, 2), l = P(c), u = I(l, !0), d = L(l, 2), f = I(d, !0), p = L(d, 2), m = (e) => {
			var t = Ma(), n = I(t);
			R(() => G(n, `♪ ${V(r) ?? ""}`)), W(e, t);
		};
		K(p, (e) => {
			V(r) && e(m);
		}), D(c);
		var h = L(c, 2), g = P(h);
		{
			let e = /* @__PURE__ */ k(() => V(i) ? Q.stop : Q.play);
			$(g, {
				get d() {
					return V(e);
				},
				size: 14
			});
		}
		D(h), D(a), R(() => {
			o = J(a, 1, "row svelte-1c0iuue", null, o, { cur: V(t).id === n().now }), G(u, V(t).title), G(f, V(t).sub), Y(h, "aria-label", `${V(i) ? "Stop" : "Play"} ${V(t).title ?? ""}`);
		}), H("click", h, () => V(i) ? n().stop() : n().play(V(t).id)), W(e, a);
	}), D(o);
	var s = L(o, 2), c = (e) => {
		var t = Pa();
		H("click", t, () => n().loadStations(n().genre, !0)), W(e, t);
	};
	K(s, (e) => {
		V(r).more && V(r).status === "ready" && e(c);
	});
	var l = L(s, 2), u = (e) => {
		{
			let t = /* @__PURE__ */ k(() => V(r).status === "idle" ? "loading" : V(r).status);
			Sa(e, {
				get status() {
					return V(t);
				},
				retry: () => n().loadStations(n().genre, V(r).ids.length > 0),
				empty: "No stations in this genre right now."
			});
		}
	};
	K(l, (e) => {
		(!n().stations.length || V(r).status === "loading" || V(r).status === "error") && e(u);
	}), W(e, i), Ke();
}
pr(["click"]);
//#endregion
//#region src/components/Grid.svelte
var Ra = /* @__PURE__ */ U("<button class=\"card svelte-1cebjac\"><span><!></span> <span class=\"title svelte-1cebjac\"> </span> <span class=\"sub svelte-1cebjac\"> </span></button>"), za = /* @__PURE__ */ U("<div class=\"grid svelte-1cebjac\"></div>"), Ba = {
	hash: "svelte-1cebjac",
	code: ".grid.svelte-1cebjac {display:grid;grid-template-columns:repeat(auto-fill, minmax(118px, 1fr));gap:16px 14px;margin-top:16px;}.card.svelte-1cebjac {display:flex;flex-direction:column;gap:3px;padding:0;border:0;background:none;color:inherit;text-align:left;cursor:pointer;font:inherit;min-width:0;}.art.svelte-1cebjac {display:flex;aspect-ratio:1;border-radius:12px;overflow:hidden;box-shadow:0 10px 24px rgba(0, 0, 0, .28);margin-bottom:6px;transition:transform .15s;}.art.tall.svelte-1cebjac {aspect-ratio:0.72;}.card.svelte-1cebjac:hover .art:where(.svelte-1cebjac) {transform:translateY(-2px);}.title.svelte-1cebjac {font-size:12.5px;font-weight:600;line-height:1.25;display:-webkit-box;-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}.sub.svelte-1cebjac {font-size:11px;color:var(--tm-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}\n  @media (prefers-reduced-motion: reduce) {.art.svelte-1cebjac {transition:none;} }"
};
function Va(e, t) {
	Ge(t, !0), Wr(e, Ba);
	let n = li(t, "tall", 3, !1);
	var r = za();
	q(r, 21, () => t.cards, (e) => e.key, (e, r) => {
		var i = Ra(), a = P(i);
		let o;
		aa(P(a), {
			get hue() {
				return V(r).hue;
			},
			get art() {
				return V(r).art;
			},
			get mark() {
				return V(r).mark;
			},
			fill: !0,
			radius: 12,
			font: 18
		}), D(a);
		var s = L(a, 2), c = I(s, !0), l = I(L(s, 2), !0);
		D(i), R(() => {
			o = J(a, 1, "art svelte-1cebjac", null, o, { tall: n() }), G(c, V(r).title), G(l, V(r).sub);
		}), H("click", i, () => t.open(V(r).key)), W(e, i);
	}), D(r), W(e, r), Ke();
}
pr(["click"]);
//#endregion
//#region src/components/PodcastView.svelte
var Ha = /* @__PURE__ */ U("<button class=\"more svelte-1phe8yx\">Show more</button>"), Ua = /* @__PURE__ */ U("<h1 class=\"h1 svelte-1phe8yx\">Podcasts</h1> <p class=\"lede svelte-1phe8yx\">Recently updated shows on OndaCast. Subscribe and new episodes land in Listen now.</p> <!> <!> <!>", 1), Wa = /* @__PURE__ */ U("<div class=\"author svelte-1phe8yx\"> </div>"), Ga = /* @__PURE__ */ U("<div class=\"hero svelte-1phe8yx\"><div class=\"art svelte-1phe8yx\"><!></div> <div class=\"info svelte-1phe8yx\"><div class=\"eyebrow svelte-1phe8yx\"> </div> <h1 class=\"svelte-1phe8yx\"> </h1> <!> <p class=\"desc svelte-1phe8yx\"> </p> <div class=\"actions svelte-1phe8yx\"><button class=\"primary svelte-1phe8yx\"><!>Latest episode</button> <button> </button></div></div></div>"), Ka = /* @__PURE__ */ U("<div class=\"prog svelte-1phe8yx\"><span class=\"bar svelte-1phe8yx\"><span class=\"svelte-1phe8yx\"></span></span><span class=\"left svelte-1phe8yx\"> </span></div>"), qa = /* @__PURE__ */ U("<div><button class=\"playbtn svelte-1phe8yx\"><!></button> <div class=\"text svelte-1phe8yx\"><div class=\"date svelte-1phe8yx\"> </div> <div> </div> <!></div> <button class=\"pill svelte-1phe8yx\">Play next</button> <button class=\"pill svelte-1phe8yx\">Queue</button> <button><!></button></div>"), Ja = /* @__PURE__ */ U("<button class=\"more svelte-1phe8yx\">Older episodes</button>"), Ya = /* @__PURE__ */ U("<button class=\"back svelte-1phe8yx\">‹ All podcasts</button> <!> <div class=\"listhead svelte-1phe8yx\"><span class=\"svelte-1phe8yx\">Episodes</span><span class=\"spacer svelte-1phe8yx\"></span>Newest first</div> <!> <!> <!>", 1), Xa = {
	hash: "svelte-1phe8yx",
	code: ".h1.svelte-1phe8yx {font-size:26px;font-weight:650;letter-spacing:-.5px;margin:0;}.lede.svelte-1phe8yx {font-size:13px;color:var(--tm-muted);margin:4px 0 0;}.more.svelte-1phe8yx {display:block;margin:16px auto 0;height:32px;padding:0 18px;border-radius:16px;border:1px solid var(--tm-fg-14);background:transparent;color:var(--tm-fg);font-size:12px;cursor:pointer;}.back.svelte-1phe8yx {border:0;background:none;color:var(--tm-muted);font-size:12px;cursor:pointer;padding:0;margin:-8px 0 14px;}.back.svelte-1phe8yx:hover {color:var(--tm-fg);}.hero.svelte-1phe8yx {display:flex;gap:22px;align-items:flex-end;}.art.svelte-1phe8yx {border-radius:16px;box-shadow:0 18px 40px rgba(0, 0, 0, .35);flex:none;}.info.svelte-1phe8yx {flex:1;min-width:0;}.eyebrow.svelte-1phe8yx {font-size:10.5px;letter-spacing:1px;text-transform:uppercase;color:var(--tm-accent);font-weight:600;}h1.svelte-1phe8yx {font-size:28px;font-weight:700;letter-spacing:-.6px;margin:4px 0 0;line-height:1.15;}.author.svelte-1phe8yx {font-size:12.5px;margin-top:4px;}.desc.svelte-1phe8yx {font-size:12.5px;color:var(--tm-muted);margin:4px 0 0;text-wrap:pretty;display:-webkit-box;-webkit-line-clamp:3;line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;}.actions.svelte-1phe8yx {display:flex;gap:8px;margin-top:14px;flex-wrap:wrap;}.actions.svelte-1phe8yx button:where(.svelte-1phe8yx) {height:34px;border-radius:17px;cursor:pointer;}.primary.svelte-1phe8yx {padding:0 16px;border:0;background:var(--tm-accent);color:var(--tm-on-accent);font-size:12.5px;font-weight:650;display:flex;align-items:center;gap:7px;}.primary.svelte-1phe8yx:disabled {opacity:.5;cursor:default;}.sub.svelte-1phe8yx {padding:0 16px;border:1px solid var(--tm-fg-18);background:transparent;color:var(--tm-fg);font-size:12.5px;font-weight:600;}.sub.on.svelte-1phe8yx {border-color:var(--tm-accent);background:var(--tm-accent-12);}.listhead.svelte-1phe8yx {display:flex;align-items:center;gap:6px;margin:26px 0 6px;font-size:12px;color:var(--tm-muted);}.listhead.svelte-1phe8yx span:where(.svelte-1phe8yx):first-child {color:var(--tm-fg);font-weight:600;font-size:14px;}.spacer.svelte-1phe8yx {flex:1;}.ep.svelte-1phe8yx {display:flex;align-items:center;gap:14px;padding:14px 8px;border-top:1px solid var(--tm-fg-6);}.ep.cur.svelte-1phe8yx {background:var(--tm-accent-8);}.playbtn.svelte-1phe8yx {width:36px;height:36px;border-radius:18px;border:1px solid var(--tm-fg-18);background:transparent;color:var(--tm-fg);cursor:pointer;display:grid;place-items:center;flex:none;}.playbtn.svelte-1phe8yx:hover {background:var(--tm-accent);color:var(--tm-on-accent);border-color:var(--tm-accent);}.text.svelte-1phe8yx {flex:1;min-width:0;}.date.svelte-1phe8yx {font-size:11px;color:var(--tm-muted);}.title.svelte-1phe8yx {font-size:13.5px;font-weight:600;margin-top:2px;}.cur.svelte-1phe8yx .title:where(.svelte-1phe8yx) {color:var(--tm-accent);}.title.done.svelte-1phe8yx {color:var(--tm-muted);}.prog.svelte-1phe8yx {display:flex;align-items:center;gap:8px;margin-top:6px;}.bar.svelte-1phe8yx {width:70px;height:3px;border-radius:2px;background:var(--tm-fg-10);display:block;}.bar.svelte-1phe8yx span:where(.svelte-1phe8yx) {display:block;height:3px;border-radius:2px;background:var(--tm-accent);}.left.svelte-1phe8yx {font-size:11px;color:var(--tm-muted);}.pill.svelte-1phe8yx {height:28px;padding:0 10px;border:0;border-radius:7px;background:var(--tm-fg-6);color:var(--tm-fg);font-size:11.5px;cursor:pointer;flex:none;}.pill.svelte-1phe8yx:hover {background:var(--tm-fg-12);}.mark.svelte-1phe8yx {width:28px;height:28px;border:0;border-radius:7px;background:transparent;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;flex:none;}.mark.done.svelte-1phe8yx {color:var(--tm-accent);}.mark.svelte-1phe8yx:hover {background:var(--tm-fg-8);}"
};
function Za(e, t) {
	Ge(t, !0), Wr(e, Xa);
	let n = li(t, "store", 7), r = /* @__PURE__ */ k(() => n().show), i = /* @__PURE__ */ k(() => !!V(r) && !!n().subscribed[V(r).slug]), a = /* @__PURE__ */ k(() => n().showSlug ? n().showEpisodes[n().showSlug] : void 0), o = /* @__PURE__ */ k(() => n().podcastBrowse.slugs.map((e) => n().shows[e]).filter(Boolean).map((e) => ({
		key: e.slug,
		title: e.title,
		sub: e.author || e.category,
		hue: e.hue,
		mark: e.mark,
		art: e.art
	})));
	fn(() => {
		!n().showSlug && n().podcastBrowse.status === "idle" && n().loadPodcastBrowse();
	});
	var s = wr(), c = F(s), l = (e) => {
		var t = Ua(), r = L(F(t), 4);
		Va(r, {
			get cards() {
				return V(o);
			},
			open: (e) => n().openShow(e)
		});
		var i = L(r, 2);
		Sa(i, {
			get status() {
				return n().podcastBrowse.status;
			},
			retry: () => n().loadPodcastBrowse()
		});
		var a = L(i, 2), s = (e) => {
			var t = Ha();
			H("click", t, () => n().loadPodcastBrowse(!0)), W(e, t);
		};
		K(a, (e) => {
			n().podcastBrowse.cursor && n().podcastBrowse.status === "ready" && e(s);
		}), W(e, t);
	}, u = (e) => {
		var t = Ya(), o = F(t), s = L(o, 2), c = (e) => {
			var t = Ga(), a = P(t);
			aa(P(a), {
				get hue() {
					return V(r).hue;
				},
				get art() {
					return V(r).art;
				},
				size: 132,
				radius: 16,
				get mark() {
					return V(r).mark;
				},
				font: 20
			}), D(a);
			var o = L(a, 2), s = P(o), c = I(s), l = L(s, 2), u = I(l, !0), d = L(l, 2), f = (e) => {
				var t = Wa(), n = I(t, !0);
				R(() => G(n, V(r).author)), W(e, t);
			};
			K(d, (e) => {
				V(r).author && e(f);
			});
			var p = L(d, 2), m = I(p, !0), h = L(p, 2), g = P(h);
			$(P(g), {
				get d() {
					return Q.play;
				},
				size: 12
			}), Te(), D(g);
			var _ = L(g, 2);
			let v;
			var y = I(_, !0);
			D(h), D(o), D(t), R(() => {
				G(c, `Podcast${V(r).category ? ` · ${V(r).category}` : ""}`), G(u, V(r).title), G(m, V(r).desc), g.disabled = !n().episodes.length, v = J(_, 1, "sub svelte-1phe8yx", null, v, { on: V(i) }), Y(_, "aria-pressed", V(i)), G(y, V(i) ? "Subscribed" : "Subscribe");
			}), H("click", g, () => n().episodes[0] && n().play(n().episodes[0].id)), H("click", _, () => n().toggleSubscribe(V(r).slug)), W(e, t);
		};
		K(s, (e) => {
			V(r) && e(c);
		});
		var l = L(s, 4);
		q(l, 17, () => n().episodes, (e) => e.id, (e, t) => {
			let r = /* @__PURE__ */ k(() => n().isDone(V(t).id));
			var i = qa();
			let a;
			var o = P(i), s = P(o);
			{
				let e = /* @__PURE__ */ k(() => n().isPlaying(V(t).id) ? Q.pause : Q.play);
				$(s, {
					get d() {
						return V(e);
					},
					size: 13
				});
			}
			D(o);
			var c = L(o, 2), l = P(c), u = I(l, !0), d = L(l, 2);
			let f;
			var p = I(d, !0), m = L(d, 2), h = (e) => {
				var i = Ka(), a = P(i), o = P(a);
				let s;
				D(a);
				var c = I(L(a), !0);
				D(i), R((e, t) => {
					s = Zr(o, "", s, { width: e }), G(c, t);
				}, [() => `${(V(r) ? 100 : n().pctOf(V(t).id)) ?? ""}%`, () => n().leftOf(V(t).id)]), W(e, i);
			}, g = /* @__PURE__ */ k(() => n().progressOf(V(t).id) > 5 || V(r));
			K(m, (e) => {
				V(g) && e(h);
			}), D(c);
			var _ = L(c, 2), v = L(_, 2), y = L(v, 2);
			let b;
			$(P(y), {
				get d() {
					return Q.check;
				},
				size: 15,
				stroke: 2
			}), D(y), D(i), R((e, s) => {
				a = J(i, 1, "ep svelte-1phe8yx", null, a, { cur: V(t).id === n().now }), Y(o, "aria-label", `${e ?? ""} ${V(t).title ?? ""}`), G(u, s), f = J(d, 1, "title svelte-1phe8yx", null, f, { done: V(r) && V(t).id !== n().now }), G(p, V(t).title), b = J(y, 1, "mark svelte-1phe8yx", null, b, { done: V(r) }), Y(y, "title", V(r) ? "Mark as unplayed" : "Mark as played"), Y(y, "aria-label", V(r) ? "Mark as unplayed" : "Mark as played"), Y(y, "aria-pressed", V(r));
			}, [() => n().isPlaying(V(t).id) ? "Pause" : "Play", () => [bi(V(t).date), n().lenOf(V(t).id)].filter(Boolean).join(" · ")]), H("click", o, () => n().play(V(t).id)), H("click", _, () => n().playNext(V(t).id)), H("click", v, () => n().addToQueue(V(t).id)), H("click", y, () => n().togglePlayed(V(t).id)), W(e, i);
		});
		var u = L(l, 2);
		{
			let e = /* @__PURE__ */ k(() => V(a)?.status ?? "loading"), t = /* @__PURE__ */ k(() => V(a)?.status === "ready" && !n().episodes.length ? "This show has no playable episodes yet." : "");
			Sa(u, {
				get status() {
					return V(e);
				},
				retry: () => n().showSlug && n().loadShow(n().showSlug),
				get empty() {
					return V(t);
				}
			});
		}
		var d = L(u, 2), f = (e) => {
			var t = Ja();
			H("click", t, () => n().showSlug && n().loadShow(n().showSlug, (V(a)?.page ?? 1) + 1)), W(e, t);
		};
		K(d, (e) => {
			V(a)?.hasNext && V(a).status === "ready" && e(f);
		}), H("click", o, () => n().showSlug = null), W(e, t);
	};
	K(c, (e) => {
		n().showSlug ? e(u, -1) : e(l);
	}), W(e, s), Ke();
}
pr(["click"]);
//#endregion
//#region src/components/BookView.svelte
var Qa = /* @__PURE__ */ U("<button class=\"more svelte-965svo\">Show more</button>"), $a = /* @__PURE__ */ U("<h1 class=\"h1 svelte-965svo\">Audiobooks</h1> <p class=\"lede svelte-965svo\">Public-domain classics read by LibriVox volunteers, via OndaCast.</p> <!> <!> <!>", 1), eo = /* @__PURE__ */ U("<div class=\"prog svelte-965svo\"><span class=\"bar svelte-965svo\"><span class=\"svelte-965svo\"></span></span><span class=\"left svelte-965svo\"> </span></div>"), to = /* @__PURE__ */ U("<div class=\"mrow svelte-965svo\"><button class=\"mjump svelte-965svo\"> <span class=\"svelte-965svo\"> </span></button> <button class=\"rm svelte-965svo\"><!></button></div>"), no = /* @__PURE__ */ U("<h2 class=\"svelte-965svo\">Bookmarks</h2> <!>", 1), ro = /* @__PURE__ */ U("<button><span class=\"n svelte-965svo\"> </span> <span class=\"title svelte-965svo\"> </span> <span class=\"state svelte-965svo\"> </span></button>"), io = /* @__PURE__ */ U("<div class=\"hero svelte-965svo\"><div class=\"cover svelte-965svo\"><!></div> <div class=\"info svelte-965svo\"><div class=\"eyebrow svelte-965svo\">Audiobook · Public domain</div> <h1 class=\"svelte-965svo\"> </h1> <p class=\"sub svelte-965svo\"> </p> <!> <div class=\"actions svelte-965svo\"><button class=\"primary svelte-965svo\"><!> </button> <button class=\"ghost svelte-965svo\">Add bookmark</button></div></div></div> <!> <h2 class=\"svelte-965svo\">Chapters</h2> <!>", 1), ao = /* @__PURE__ */ U("<button class=\"back svelte-965svo\">‹ All audiobooks</button> <!> <!>", 1), oo = {
	hash: "svelte-965svo",
	code: ".h1.svelte-965svo {font-size:26px;font-weight:650;letter-spacing:-.5px;margin:0;}.lede.svelte-965svo {font-size:13px;color:var(--tm-muted);margin:4px 0 0;}.more.svelte-965svo {display:block;margin:16px auto 0;height:32px;padding:0 18px;border-radius:16px;border:1px solid var(--tm-fg-14);background:transparent;color:var(--tm-fg);font-size:12px;cursor:pointer;}.back.svelte-965svo {border:0;background:none;color:var(--tm-muted);font-size:12px;cursor:pointer;padding:0;margin:-8px 0 14px;}.back.svelte-965svo:hover {color:var(--tm-fg);}.hero.svelte-965svo {display:flex;gap:24px;}.cover.svelte-965svo {width:120px;height:176px;border-radius:6px 12px 12px 6px;flex:none;overflow:hidden;display:flex;box-shadow:0 18px 40px rgba(0, 0, 0, .4), inset 6px 0 0 rgba(0, 0, 0, .18);}.info.svelte-965svo {flex:1;min-width:0;padding-top:6px;}.eyebrow.svelte-965svo {font-size:10.5px;letter-spacing:1px;text-transform:uppercase;color:var(--tm-accent);font-weight:600;}h1.svelte-965svo {font-size:28px;font-weight:700;letter-spacing:-.6px;margin:4px 0 0;line-height:1.15;}.sub.svelte-965svo {font-size:13px;color:var(--tm-muted);margin:4px 0 0;}.prog.svelte-965svo {display:flex;align-items:center;gap:10px;margin-top:16px;}.bar.svelte-965svo {flex:1;max-width:260px;height:4px;border-radius:2px;background:var(--tm-fg-10);display:block;}.bar.svelte-965svo span:where(.svelte-965svo) {display:block;height:4px;border-radius:2px;background:var(--tm-accent);}.left.svelte-965svo {font-size:12px;}.actions.svelte-965svo {display:flex;gap:8px;margin-top:16px;}.actions.svelte-965svo button:where(.svelte-965svo) {height:34px;border-radius:17px;cursor:pointer;}.actions.svelte-965svo button:where(.svelte-965svo):disabled {opacity:.5;cursor:default;}.primary.svelte-965svo {padding:0 16px;border:0;background:var(--tm-accent);color:var(--tm-on-accent);font-size:12.5px;font-weight:650;display:flex;align-items:center;gap:7px;}.ghost.svelte-965svo {padding:0 14px;border:1px solid var(--tm-fg-14);background:transparent;color:var(--tm-fg);font-size:12px;}h2.svelte-965svo {font-size:14px;font-weight:600;margin:26px 0 6px;}.mrow.svelte-965svo {display:flex;align-items:center;border-top:1px solid var(--tm-fg-6);}.mjump.svelte-965svo {flex:1;display:flex;justify-content:space-between;padding:9px 8px;border:0;background:none;color:var(--tm-fg);font:inherit;font-size:12.5px;cursor:pointer;text-align:left;}.mjump.svelte-965svo span:where(.svelte-965svo) {color:var(--tm-muted);font-size:11px;}.mjump.svelte-965svo:hover {background:var(--tm-fg-4);}.rm.svelte-965svo {width:26px;height:26px;border:0;background:none;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;border-radius:6px;}.rm.svelte-965svo:hover {color:var(--tm-fg);background:var(--tm-fg-8);}.chap.svelte-965svo {display:flex;align-items:center;gap:14px;width:100%;padding:10px 8px;border:0;border-top:1px solid var(--tm-fg-6);background:transparent;color:var(--tm-fg);cursor:pointer;text-align:left;font:inherit;}.chap.svelte-965svo:hover {background:var(--tm-fg-4);}.chap.cur.svelte-965svo {background:var(--tm-accent-7);}.n.svelte-965svo {width:30px;flex:none;font:500 11px ui-monospace, Menlo, monospace;color:var(--tm-muted);}.title.svelte-965svo {flex:1;font-size:13px;min-width:0;}.cur.svelte-965svo .title:where(.svelte-965svo) {color:var(--tm-accent);}.done.svelte-965svo .title:where(.svelte-965svo) {color:var(--tm-muted);}.state.svelte-965svo {font-size:11px;color:var(--tm-muted);flex:none;}"
};
function so(e, t) {
	Ge(t, !0), Wr(e, oo);
	let n = li(t, "store", 7), r = /* @__PURE__ */ k(() => n().book), i = /* @__PURE__ */ k(() => V(r) ? n().progressOf(V(r).id) : 0), a = /* @__PURE__ */ k(() => V(r) ? n().speedFor(V(r).id) : 1), o = /* @__PURE__ */ k(() => V(r) ? Math.max(0, Fi(V(r).chapters, V(i))) : 0), s = /* @__PURE__ */ k(() => !!V(r) && n().isPlaying(V(r).id)), c = /* @__PURE__ */ k(() => V(r) ? n().bookmarks[V(r).id] ?? [] : []), l = /* @__PURE__ */ k(() => n().bookBrowse.ids.map((e) => n().items[e]).filter(Boolean).map((e) => ({
		key: e.id,
		title: e.title,
		sub: e.sub,
		hue: e.hue,
		mark: e.mark,
		art: e.art
	}))), u = (e) => V(r) ? V(r).chapters[e].dur || (V(r).chapters[e + 1]?.start ?? V(r).dur) - V(r).chapters[e].start : 0;
	fn(() => {
		!n().bookId && n().bookBrowse.status === "idle" && n().loadBookBrowse();
	});
	function d(e) {
		V(r) && n().jumpTo(V(r).id, e);
	}
	var f = wr(), p = F(f), m = (e) => {
		var t = $a(), r = L(F(t), 4);
		Va(r, {
			get cards() {
				return V(l);
			},
			tall: !0,
			open: (e) => n().openBook(e)
		});
		var i = L(r, 2);
		Sa(i, {
			get status() {
				return n().bookBrowse.status;
			},
			retry: () => n().loadBookBrowse()
		});
		var a = L(i, 2), o = (e) => {
			var t = Qa();
			H("click", t, () => n().loadBookBrowse(!0)), W(e, t);
		};
		K(a, (e) => {
			n().bookBrowse.cursor && n().bookBrowse.status === "ready" && e(o);
		}), W(e, t);
	}, h = (e) => {
		var t = ao(), l = F(t), f = L(l, 2), p = (e) => {
			var t = io(), l = F(t), f = P(l);
			aa(P(f), {
				get hue() {
					return V(r).hue;
				},
				get art() {
					return V(r).art;
				},
				fill: !0,
				radius: 0,
				get mark() {
					return V(r).mark;
				},
				font: 22
			}), D(f);
			var p = L(f, 2), m = L(P(p), 2), h = I(m, !0), g = L(m, 2), _ = I(g, !0), v = L(g, 2), y = (e) => {
				var t = eo(), n = P(t), o = P(n);
				let s;
				D(n);
				var c = I(L(n));
				D(t), R((e, t, n) => {
					s = Zr(o, "", s, { width: e }), G(c, `${t ?? ""} left at ${n ?? ""}×`);
				}, [
					() => `${Math.round(V(i) / V(r).dur * 100)}%`,
					() => ji((V(r).dur - V(i)) / V(a)),
					() => V(a).toFixed(1)
				]), W(e, t);
			};
			K(v, (e) => {
				V(r).dur && e(y);
			});
			var b = L(v, 2), x = P(b), S = P(x);
			{
				let e = /* @__PURE__ */ k(() => V(s) ? Q.pause : Q.play);
				$(S, {
					get d() {
						return V(e);
					},
					size: 12
				});
			}
			var C = L(S, 1, !0);
			D(x);
			var ee = L(x, 2);
			D(b), D(p), D(l);
			var te = L(l, 2), ne = (e) => {
				var t = no();
				q(L(F(t), 2), 17, () => V(c), (e) => e.at, (e, t) => {
					var i = to(), a = P(i), o = P(a, !0), s = I(L(o), !0);
					D(a);
					var c = L(a, 2);
					$(P(c), {
						get d() {
							return Q.close;
						},
						size: 12,
						stroke: 2
					}), D(c), D(i), R((e) => {
						G(o, V(t).label), G(s, e), Y(c, "aria-label", `Remove bookmark ${V(t).label ?? ""}`);
					}, [() => new Date(V(t).at).toLocaleDateString()]), H("click", a, () => d(V(t).pos)), H("click", c, () => n().removeBookmark(V(r).id, V(t).at)), W(e, i);
				}), W(e, t);
			};
			K(te, (e) => {
				V(c).length && e(ne);
			}), q(L(te, 4), 17, () => V(r).chapters, Fr, (e, t, n) => {
				var r = ro();
				let a;
				var s = P(r), c = I(s, !0), l = L(s, 2), f = I(l, !0), p = I(L(l, 2), !0);
				D(r), R((e, s) => {
					a = J(r, 1, "chap svelte-965svo", null, a, {
						cur: n === V(o) && V(i) > 0,
						done: n < V(o)
					}), G(c, e), G(f, V(t).title), G(p, s);
				}, [() => mi(n), () => n < V(o) ? "Finished" : n === V(o) && V(i) > 0 && u(n) ? `${Math.min(100, Math.round((V(i) - V(t).start) / u(n) * 100))}%` : u(n) ? ji(u(n)) : ""]), H("click", r, () => d(V(t).start)), W(e, r);
			}), R((e) => {
				G(h, V(r).title), G(_, V(r).sub), x.disabled = !V(r).chapters.length, G(C, e), ee.disabled = V(i) <= 0;
			}, [() => V(s) ? "Pause" : V(i) > 5 ? `Resume chapter ${mi(V(o))}` : "Start listening"]), H("click", x, () => n().play(V(r).id)), H("click", ee, () => n().bookmark()), W(e, t);
		};
		K(f, (e) => {
			V(r) && e(p);
		});
		var m = L(f, 2), h = (e) => {
			{
				let t = /* @__PURE__ */ k(() => n().bookStatus[n().bookId] ?? "loading");
				Sa(e, {
					get status() {
						return V(t);
					},
					retry: () => n().bookId && n().ensureBook(n().bookId),
					empty: "This audiobook has no playable chapters yet."
				});
			}
		};
		K(m, (e) => {
			V(r)?.chapters.length || e(h);
		}), H("click", l, () => n().bookId = null), W(e, t);
	};
	K(p, (e) => {
		n().bookId ? e(h, -1) : e(m);
	}), W(e, f), Ke();
}
pr(["click"]);
//#endregion
//#region src/components/SearchView.svelte
var co = /* @__PURE__ */ U("<button class=\"row svelte-1occquv\"><!> <span class=\"text svelte-1occquv\"><span class=\"title svelte-1occquv\"> </span><span class=\"meta svelte-1occquv\"> </span></span> <span class=\"act svelte-1occquv\"><!> </span></button>"), lo = /* @__PURE__ */ U("<button class=\"more svelte-1occquv\">More stations</button>"), uo = /* @__PURE__ */ U("<h2 class=\"svelte-1occquv\">Shows and books</h2>"), fo = /* @__PURE__ */ U("<h2 class=\"svelte-1occquv\"> </h2> <div class=\"list svelte-1occquv\"></div> <!> <!> <!>", 1), po = /* @__PURE__ */ U("<button class=\"row svelte-1occquv\"><!> <span class=\"text svelte-1occquv\"><span class=\"title svelte-1occquv\"> </span><span class=\"meta svelte-1occquv\"> </span></span> <span class=\"act svelte-1occquv\"> </span></button>"), mo = /* @__PURE__ */ U("<h1 class=\"h1 svelte-1occquv\"> </h1> <!> <div class=\"list svelte-1occquv\"></div> <!>", 1), ho = {
	hash: "svelte-1occquv",
	code: ".h1.svelte-1occquv {font-size:22px;font-weight:650;letter-spacing:-.4px;margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.list.svelte-1occquv {margin-top:14px;}.row.svelte-1occquv {display:flex;align-items:center;gap:14px;width:100%;padding:10px 8px;border:0;border-radius:10px;background:none;color:inherit;text-align:left;cursor:pointer;font:inherit;}.row.svelte-1occquv:hover {background:var(--tm-fg-5);}.text.svelte-1occquv {flex:1;min-width:0;display:flex;flex-direction:column;}.title.svelte-1occquv {font-size:13px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.meta.svelte-1occquv {font-size:11.5px;color:var(--tm-muted);margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.act.svelte-1occquv {font-size:11.5px;color:var(--tm-accent);flex:none;display:flex;align-items:center;gap:5px;}h2.svelte-1occquv {font-size:13px;font-weight:650;margin:18px 0 0;color:var(--tm-muted);}.more.svelte-1occquv {display:block;margin:10px auto 4px;height:30px;padding:0 16px;border-radius:15px;border:1px solid var(--tm-fg-14);background:transparent;color:var(--tm-fg);font-size:12px;cursor:pointer;}"
};
function go(e, t) {
	Ge(t, !0), Wr(e, ho);
	let n = {
		station: "Radio",
		podcast: "Podcast",
		audiobook: "Audiobook"
	}, r = {
		station: "Play",
		podcast: "Open",
		audiobook: "Open"
	}, i = /* @__PURE__ */ k(() => t.store.stationHits.ids.map((e) => t.store.items[e]).filter((e) => e?.type === "radio")), a = /* @__PURE__ */ k(() => t.store.stationHits.status !== "idle"), o = /* @__PURE__ */ k(() => t.store.search.status === "ready" && !t.store.search.hits.length && (!V(a) || t.store.stationHits.status === "ready" && !V(i).length));
	var s = mo(), c = F(s), l = I(c), u = L(c, 2), d = (e) => {
		var n = fo(), r = F(n), a = I(r), o = L(r, 2);
		q(o, 21, () => V(i), (e) => e.id, (e, n) => {
			let r = /* @__PURE__ */ k(() => t.store.isPlaying(V(n).id));
			var i = co(), a = P(i);
			aa(a, {
				get hue() {
					return V(n).hue;
				},
				get art() {
					return V(n).art;
				},
				get mark() {
					return V(n).mark;
				},
				size: 44
			});
			var o = L(a, 2), s = P(o), c = I(s, !0), l = I(L(s), !0);
			D(o);
			var u = L(o, 2), d = P(u);
			{
				let e = /* @__PURE__ */ k(() => V(r) ? Q.stop : Q.play);
				$(d, {
					get d() {
						return V(e);
					},
					size: 12
				});
			}
			var f = L(d, 1, !0);
			D(u), D(i), R(() => {
				G(c, V(n).title), G(l, V(n).sub), G(f, V(r) ? "Stop" : "Play");
			}), H("click", i, () => V(r) ? t.store.stop() : t.store.play(V(n).id)), W(e, i);
		}), D(o);
		var s = L(o, 2), c = (e) => {
			var n = lo();
			H("click", n, () => t.store.loadStationHits(t.store.search.q, !0)), W(e, n);
		};
		K(s, (e) => {
			t.store.stationHits.more && t.store.stationHits.status === "ready" && e(c);
		});
		var l = L(s, 2), u = (e) => {
			Sa(e, {
				get status() {
					return t.store.stationHits.status;
				},
				retry: () => t.store.loadStationHits(t.store.search.q, V(i).length > 0)
			});
		};
		K(l, (e) => {
			(t.store.stationHits.status === "loading" || t.store.stationHits.status === "error") && e(u);
		});
		var d = L(l, 2), f = (e) => {
			W(e, uo());
		};
		K(d, (e) => {
			t.store.search.hits.length && e(f);
		}), R((e) => G(a, `Stations${e ?? ""}`), [() => t.store.stationHits.total ? ` · ${t.store.stationHits.total.toLocaleString()}` : ""]), W(e, n);
	};
	K(u, (e) => {
		V(a) && e(d);
	});
	var f = L(u, 2);
	q(f, 21, () => t.store.search.hits, (e) => e.kind + e.id, (e, i) => {
		var a = po(), o = P(a);
		{
			let e = /* @__PURE__ */ k(() => hi(V(i).slug || V(i).id)), t = /* @__PURE__ */ k(() => gi(V(i).title));
			aa(o, {
				get hue() {
					return V(e);
				},
				get art() {
					return V(i).art;
				},
				get mark() {
					return V(t);
				},
				size: 44
			});
		}
		var s = L(o, 2), c = P(s), l = I(c, !0), u = I(L(c));
		D(s);
		var d = I(L(s, 2), !0);
		D(a), R(() => {
			G(l, V(i).title), G(u, `${n[V(i).kind] ?? ""}${V(i).subtitle ? ` · ${V(i).subtitle}` : ""}`), G(d, r[V(i).kind]);
		}), H("click", a, () => t.store.openHit(V(i))), W(e, a);
	}), D(f);
	var p = L(f, 2);
	{
		let e = /* @__PURE__ */ k(() => t.store.search.status === "idle" ? "loading" : t.store.search.status), n = /* @__PURE__ */ k(() => V(o) ? "Nothing matches. Try a station, show, book or author." : "");
		Sa(p, {
			get status() {
				return V(e);
			},
			retry: () => t.store.setQuery(t.store.query),
			get empty() {
				return V(n);
			}
		});
	}
	R((e) => G(l, `Results for “${e ?? ""}”`), [() => t.store.query.trim()]), W(e, s), Ke();
}
pr(["click"]);
//#endregion
//#region src/components/NowPlaying.svelte
var _o = /* @__PURE__ */ U("<div class=\"blank svelte-1b7bd5u\"></div>"), vo = /* @__PURE__ */ U("<span class=\"kind svelte-1b7bd5u\"> </span>"), yo = /* @__PURE__ */ U("<div class=\"prog svelte-1b7bd5u\" aria-label=\"Progress\"><span class=\"bar svelte-1b7bd5u\"><span class=\"svelte-1b7bd5u\"></span></span> <span class=\"pct svelte-1b7bd5u\"> </span></div>"), bo = /* @__PURE__ */ U("<button role=\"tab\"> </button>"), xo = /* @__PURE__ */ U("<div class=\"tabs svelte-1b7bd5u\" role=\"tablist\"></div>"), So = /* @__PURE__ */ U("<button class=\"q svelte-1b7bd5u\"><!> <span class=\"qtext svelte-1b7bd5u\"><span class=\"qtitle svelte-1b7bd5u\"> </span><span class=\"qmeta svelte-1b7bd5u\"> </span></span></button>"), Co = /* @__PURE__ */ U("<h3 class=\"svelte-1b7bd5u\">Continue listening</h3> <!>", 1), wo = /* @__PURE__ */ U("<div class=\"empty svelte-1b7bd5u\">Choose a station, an episode or a book. What you are listening to shows here.</div> <!>", 1), To = /* @__PURE__ */ U("<span class=\"ontext svelte-1b7bd5u\"><span class=\"qtitle svelte-1b7bd5u\"> </span><span class=\"qmeta svelte-1b7bd5u\"> </span></span>"), Eo = /* @__PURE__ */ U("<span class=\"ontext svelte-1b7bd5u\"><span class=\"qtitle svelte-1b7bd5u\"> </span><span class=\"qmeta svelte-1b7bd5u\">This station does not publish song titles right now.</span></span>"), Do = /* @__PURE__ */ U("<dt class=\"svelte-1b7bd5u\">From</dt><dd class=\"svelte-1b7bd5u\"> </dd>", 1), Oo = /* @__PURE__ */ U("<div class=\"q track svelte-1b7bd5u\"><!> <span class=\"qtext svelte-1b7bd5u\"><span class=\"qtitle svelte-1b7bd5u\"> </span><span class=\"qmeta svelte-1b7bd5u\"> </span></span></div>"), ko = /* @__PURE__ */ U("<h3 class=\"svelte-1b7bd5u\">Recently played</h3> <!>", 1), Ao = /* @__PURE__ */ U("<div class=\"onair svelte-1b7bd5u\"><span class=\"dot svelte-1b7bd5u\" aria-hidden=\"true\"></span> <!></div> <h3 class=\"svelte-1b7bd5u\">Station</h3> <dl class=\"facts svelte-1b7bd5u\"><dt class=\"svelte-1b7bd5u\">Genre</dt><dd class=\"svelte-1b7bd5u\"> </dd> <!></dl> <!>", 1), jo = /* @__PURE__ */ U("<div class=\"q svelte-1b7bd5u\"><!> <button class=\"qtext svelte-1b7bd5u\"><span class=\"qtitle svelte-1b7bd5u\"> </span><span class=\"qmeta svelte-1b7bd5u\"> </span></button> <button class=\"rm svelte-1b7bd5u\"><!></button></div>"), Mo = /* @__PURE__ */ U("<div class=\"empty svelte-1b7bd5u\">Queue is empty. Use Play next or Queue on any episode.</div>"), No = /* @__PURE__ */ U("<button><span class=\"t svelte-1b7bd5u\"> </span> <span class=\"ctitle svelte-1b7bd5u\"> </span> <span class=\"cstate svelte-1b7bd5u\"> </span></button>"), Po = /* @__PURE__ */ U("<div class=\"empty svelte-1b7bd5u\"> </div>"), Fo = /* @__PURE__ */ U("<div class=\"q svelte-1b7bd5u\"><button class=\"qtext svelte-1b7bd5u\"><span class=\"qtitle svelte-1b7bd5u\"> </span><span class=\"qmeta svelte-1b7bd5u\"> </span></button> <button class=\"rm svelte-1b7bd5u\"><!></button></div>"), Io = /* @__PURE__ */ U("<div class=\"empty svelte-1b7bd5u\">No bookmarks yet. Your place is saved automatically; bookmarks keep moments you want to return to.</div>"), Lo = /* @__PURE__ */ U("<button class=\"add svelte-1b7bd5u\"><!>Bookmark this moment</button> <!>", 1), Ro = /* @__PURE__ */ U("<dt class=\"svelte-1b7bd5u\">Length</dt><dd class=\"svelte-1b7bd5u\"> </dd>", 1), zo = /* @__PURE__ */ U("<dt class=\"svelte-1b7bd5u\">Chapters</dt><dd class=\"svelte-1b7bd5u\"> </dd>", 1), Bo = /* @__PURE__ */ U("<dl class=\"facts svelte-1b7bd5u\"><dt class=\"svelte-1b7bd5u\">Author</dt><dd class=\"svelte-1b7bd5u\"> </dd> <!> <!> <dt class=\"svelte-1b7bd5u\">Narration</dt><dd class=\"svelte-1b7bd5u\">LibriVox volunteers</dd></dl>"), Vo = /* @__PURE__ */ U("<dt class=\"svelte-1b7bd5u\">Published</dt><dd class=\"svelte-1b7bd5u\"> </dd>", 1), Ho = /* @__PURE__ */ U("<dl class=\"facts svelte-1b7bd5u\"><dt class=\"svelte-1b7bd5u\">Show</dt><dd class=\"svelte-1b7bd5u\"><button class=\"link svelte-1b7bd5u\"> </button></dd> <!> <!></dl>"), Uo = /* @__PURE__ */ U("<p class=\"desc svelte-1b7bd5u\"> </p>"), Wo = /* @__PURE__ */ U("<!> <!> <!>", 1), Go = /* @__PURE__ */ U("<button><span class=\"who svelte-1b7bd5u\"> </span> </button>"), Ko = /* @__PURE__ */ U("<div></div>"), qo = /* @__PURE__ */ U("<aside class=\"aside svelte-1b7bd5u\" aria-label=\"Now playing\"><div class=\"top svelte-1b7bd5u\"><div><!> <!></div> <div class=\"title svelte-1b7bd5u\"> </div> <div class=\"sub svelte-1b7bd5u\"> </div> <!></div> <!> <div class=\"body svelte-1b7bd5u\" role=\"tabpanel\"><!></div></aside>"), Jo = {
	hash: "svelte-1b7bd5u",
	code: ".aside.svelte-1b7bd5u {width:300px;flex:none;background:var(--tm-panel);display:flex;flex-direction:column;min-height:0;}.top.svelte-1b7bd5u {padding:20px 20px 14px;}.art.svelte-1b7bd5u {width:100%;aspect-ratio:1.45;border-radius:14px;position:relative;overflow:hidden;display:flex;box-shadow:0 14px 36px rgba(0, 0, 0, .35);}.blank.svelte-1b7bd5u {flex:1;background:var(--tm-fg-6);}.kind.svelte-1b7bd5u {position:absolute;left:12px;top:12px;font-size:9.5px;font-weight:700;letter-spacing:.8px;padding:3px 8px;border-radius:20px;background:rgba(0, 0, 0, .45);color:#fff;}.title.svelte-1b7bd5u {font-size:15px;font-weight:650;margin-top:14px;line-height:1.3;text-wrap:pretty;display:-webkit-box;-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}.sub.svelte-1b7bd5u {font-size:12px;color:var(--tm-muted);margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.tabs.svelte-1b7bd5u {display:flex;gap:2px;padding:0 12px;border-bottom:1px solid var(--tm-fg-7);overflow-x:auto;scrollbar-width:none;}.tabs.svelte-1b7bd5u button:where(.svelte-1b7bd5u) {flex:0 1 auto;min-width:0;height:34px;padding:0 7px;border:0;background:none;color:var(--tm-muted);font-size:11.5px;font-weight:600;white-space:nowrap;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;}.tabs.svelte-1b7bd5u button.on:where(.svelte-1b7bd5u) {color:var(--tm-fg);border-bottom-color:var(--tm-accent);}.body.svelte-1b7bd5u {flex:1;min-height:0;overflow:auto;padding:8px 12px 12px;}.q.svelte-1b7bd5u {display:flex;align-items:center;gap:10px;padding:7px 8px;border-radius:9px;}.q.svelte-1b7bd5u:hover {background:var(--tm-fg-5);}.qtext.svelte-1b7bd5u {flex:1;min-width:0;display:flex;flex-direction:column;border:0;padding:0;background:none;color:inherit;text-align:left;cursor:pointer;font:inherit;}.track.svelte-1b7bd5u .qtext:where(.svelte-1b7bd5u) {cursor:default;}.qtitle.svelte-1b7bd5u {font-size:12px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.qmeta.svelte-1b7bd5u {font-size:11px;color:var(--tm-muted);margin-top:2px;}.rm.svelte-1b7bd5u {width:24px;height:24px;border:0;background:none;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;flex:none;border-radius:6px;}.rm.svelte-1b7bd5u:hover {color:var(--tm-fg);background:var(--tm-fg-8);}.empty.svelte-1b7bd5u {padding:24px 8px;font-size:12px;color:var(--tm-muted);text-align:center;}.art.book.svelte-1b7bd5u {aspect-ratio:0.8;width:62%;margin:0 auto;border-radius:6px 12px 12px 6px;}.prog.svelte-1b7bd5u {display:flex;align-items:center;gap:10px;margin-top:10px;}.bar.svelte-1b7bd5u {flex:1;height:4px;border-radius:2px;background:var(--tm-fg-10);display:block;}.bar.svelte-1b7bd5u span:where(.svelte-1b7bd5u) {display:block;height:4px;border-radius:2px;background:var(--tm-accent);}.pct.svelte-1b7bd5u {font-size:11px;color:var(--tm-muted);flex:none;}h3.svelte-1b7bd5u {font-size:11px;font-weight:650;letter-spacing:.6px;text-transform:uppercase;color:var(--tm-muted);margin:16px 8px 6px;}.onair.svelte-1b7bd5u {display:flex;align-items:center;gap:10px;padding:10px 8px;border-radius:10px;background:var(--tm-accent-8);}.dot.svelte-1b7bd5u {width:8px;height:8px;border-radius:50%;background:var(--tm-live);flex:none;box-shadow:0 0 0 3px color-mix(in srgb, var(--tm-live) 25%, transparent);}.ontext.svelte-1b7bd5u {min-width:0;display:flex;flex-direction:column;}.facts.svelte-1b7bd5u {display:grid;grid-template-columns:auto 1fr;gap:6px 12px;margin:8px 8px 0;font-size:12px;}.facts.svelte-1b7bd5u dt:where(.svelte-1b7bd5u) {color:var(--tm-muted);}.facts.svelte-1b7bd5u dd:where(.svelte-1b7bd5u) {margin:0;min-width:0;overflow:hidden;text-overflow:ellipsis;}.link.svelte-1b7bd5u {border:0;padding:0;background:none;color:var(--tm-accent);font:inherit;cursor:pointer;text-align:left;}.desc.svelte-1b7bd5u {font-size:12px;line-height:1.55;color:var(--tm-muted);margin:12px 8px 0;white-space:pre-line;}.add.svelte-1b7bd5u {display:flex;align-items:center;justify-content:center;gap:6px;width:100%;height:32px;margin:4px 0 8px;border:1px dashed var(--tm-fg-16);border-radius:9px;background:none;color:var(--tm-fg);font:inherit;font-size:12px;cursor:pointer;}.add.svelte-1b7bd5u:hover {background:var(--tm-fg-5);}button.q.svelte-1b7bd5u {width:100%;border:0;background:none;color:inherit;cursor:pointer;text-align:left;font:inherit;}.q.svelte-1b7bd5u .qtext:where(.svelte-1b7bd5u) {display:flex;flex-direction:column;}.ctitle.svelte-1b7bd5u {flex:1;min-width:0;}.cstate.svelte-1b7bd5u {font-size:11px;color:var(--tm-muted);flex:none;}.chap.done.svelte-1b7bd5u .ctitle:where(.svelte-1b7bd5u) {color:var(--tm-muted);}.chap.svelte-1b7bd5u {display:flex;gap:10px;width:100%;padding:8px;border:0;border-radius:8px;background:transparent;color:var(--tm-fg);cursor:pointer;text-align:left;font:inherit;font-size:12.5px;}.chap.svelte-1b7bd5u:hover {background:var(--tm-fg-5);}.chap.cur.svelte-1b7bd5u {background:var(--tm-accent-8);color:var(--tm-accent);}.t.svelte-1b7bd5u {font:500 11px ui-monospace, Menlo, monospace;color:var(--tm-muted);width:52px;flex:none;padding-top:1px;}.line.svelte-1b7bd5u {display:block;width:100%;padding:7px 8px;border:0;border-radius:8px;background:transparent;cursor:pointer;text-align:left;font:inherit;font-size:13px;line-height:1.5;color:var(--tm-fg-45);}.line.svelte-1b7bd5u:hover {background:var(--tm-fg-4);}.line.cur.svelte-1b7bd5u {color:var(--tm-fg);background:var(--tm-accent-8);}.who.svelte-1b7bd5u {display:block;font:500 10px ui-monospace, Menlo, monospace;color:var(--tm-muted);margin-bottom:2px;}"
};
function Yo(e, t) {
	Ge(t, !0), Wr(e, Jo);
	let n = li(t, "store", 7), r = /* @__PURE__ */ k(() => n().item), i = /* @__PURE__ */ k(() => n().activeRtab), a = /* @__PURE__ */ k(() => V(r)?.type === "radio" ? n().nowPlaying[V(r).stationId] : void 0), o = /* @__PURE__ */ k(() => V(r)?.type === "book" ? V(r) : null), s = /* @__PURE__ */ k(() => V(o) ? n().bookmarks[V(o).id] ?? [] : []), c = /* @__PURE__ */ k(() => V(r) ? n().durOf(V(r).id) : 0), l = /* @__PURE__ */ k(() => n().continueIds.filter((e) => e !== n().now)), u = {
		onair: "On air",
		queue: "Up next",
		chaps: "Chapters",
		trans: "Transcript",
		marks: "Bookmarks",
		about: "About"
	}, d = (e) => e === "queue" && n().queue.length ? `Up next · ${n().queue.length}` : e === "marks" && V(s).length ? `Bookmarks · ${V(s).length}` : u[e], f = /* @__PURE__ */ k(() => V(a)?.art || V(r)?.art), p = /* @__PURE__ */ k(() => V(a)?.title || V(r)?.title || "Nothing playing"), m = /* @__PURE__ */ k(() => V(r) ? V(r).type === "radio" ? V(a)?.title ? [V(a).artist, V(r).title].filter(Boolean).join(" · ") : V(r).sub : V(r).type === "book" && V(r).chapters.length > 1 && n().chapIdx >= 0 ? `${V(r).sub} · Chapter ${mi(n().chapIdx)}` : V(r).sub : "Pick a station, episode or book."), h = /* @__PURE__ */ k(() => n().transcript?.lines ?? []), g = /* @__PURE__ */ j(void 0), _ = (e) => {
		if (!V(r) || !X(V(r))) return 0;
		let t = V(r).chapters[e];
		return t.dur || (V(r).chapters[e + 1]?.start ?? V(c)) - t.start;
	};
	fn(() => {
		V(i) === "trans" && n().transcriptKey && n().loadTranscript();
	}), fn(() => {
		let e = n().lineIdx;
		V(i) !== "trans" || e < 0 || V(g)?.querySelectorAll(".line")[e]?.scrollIntoView({
			block: "nearest",
			behavior: "smooth"
		});
	});
	let v = /* @__PURE__ */ k(() => {
		let e = n().transcript;
		return V(r) ? !e || e.state === "loading" ? "Loading transcript…" : e.state === "queued" || e.state === "running" ? "OndaCast is preparing a transcript. Check back in a few minutes." : e.state === "error" ? "The transcript could not be loaded." : "No transcript for this item yet." : "Nothing is playing.";
	});
	var y = qo(), b = P(y), x = P(b);
	let S;
	var C = P(x), ee = (e) => {
		aa(e, {
			get hue() {
				return V(r).hue;
			},
			get art() {
				return V(f);
			},
			fill: !0,
			radius: 0,
			get mark() {
				return V(r).mark;
			},
			font: 26
		});
	}, te = (e) => {
		W(e, _o());
	};
	K(C, (e) => {
		V(r) ? e(ee) : e(te, -1);
	});
	var ne = L(C, 2), re = (e) => {
		var t = vo(), r = I(t, !0);
		R(() => G(r, n().kindLabel)), W(e, t);
	};
	K(ne, (e) => {
		V(r) && e(re);
	}), D(x);
	var ie = L(x, 2), ae = I(ie, !0), oe = L(ie, 2), se = I(oe, !0), ce = L(oe, 2), le = (e) => {
		var t = yo(), r = P(t), i = P(r);
		let a;
		D(r);
		var o = I(L(r, 2));
		D(t), R((e, t, n) => {
			a = Zr(i, "", a, { width: e }), G(o, `${t ?? ""}% · ${n ?? ""} left`);
		}, [
			() => `${Math.min(100, Math.round(n().pos / V(c) * 100))}%`,
			() => Math.min(100, Math.round(n().pos / V(c) * 100)),
			() => ji((V(c) - n().pos) / n().speed)
		]), W(e, t);
	}, ue = /* @__PURE__ */ k(() => V(r) && X(V(r)) && V(c));
	K(ce, (e) => {
		V(ue) && e(le);
	}), D(b);
	var de = L(b, 2), fe = (e) => {
		var t = xo();
		q(t, 20, () => n().rightTabs, (e) => e, (e, t) => {
			var r = bo();
			let a;
			var o = I(r, !0);
			R((e) => {
				Y(r, "aria-selected", V(i) === t), a = J(r, 1, "svelte-1b7bd5u", null, a, { on: V(i) === t }), G(o, e);
			}, [() => d(t)]), H("click", r, () => n().rtab = t), W(e, r);
		}), D(t), W(e, t);
	};
	K(de, (e) => {
		V(r) && e(fe);
	});
	var pe = L(de, 2), me = P(pe), he = (e) => {
		var t = wo(), r = L(F(t), 2), i = (e) => {
			var t = Co();
			q(L(F(t), 2), 16, () => V(l), (e) => e, (e, t) => {
				let r = /* @__PURE__ */ k(() => n().items[t]);
				var i = wr(), a = F(i), o = (e) => {
					var i = So(), a = P(i);
					aa(a, {
						get hue() {
							return V(r).hue;
						},
						get art() {
							return V(r).art;
						},
						get mark() {
							return V(r).mark;
						},
						size: 34,
						radius: 7,
						font: 9
					});
					var o = L(a, 2), s = P(o), c = I(s, !0), l = I(L(s));
					D(o), D(i), R((e) => {
						G(c, V(r).title), G(l, `${di[V(r).type] ?? ""} · ${e ?? ""}`);
					}, [() => n().leftOf(t)]), H("click", i, () => n().play(t)), W(e, i);
				};
				K(a, (e) => {
					V(r) && e(o);
				}), W(e, i);
			}), W(e, t);
		};
		K(r, (e) => {
			V(l).length && e(i);
		}), W(e, t);
	}, ge = (e) => {
		var t = Ao(), n = F(t), i = L(P(n), 2), o = (e) => {
			var t = To(), n = P(t), i = I(n, !0), o = I(L(n), !0);
			D(t), R(() => {
				G(i, V(a).title), G(o, V(a).artist || V(r).title);
			}), W(e, t);
		}, s = (e) => {
			var t = Eo(), n = I(P(t), !0);
			Te(), D(t), R(() => G(n, V(r).title)), W(e, t);
		};
		K(i, (e) => {
			V(a)?.title ? e(o) : e(s, -1);
		}), D(n);
		var c = L(n, 4), l = L(P(c)), u = I(l, !0), d = L(l, 2), f = (e) => {
			var t = Do(), n = I(L(F(t)), !0);
			R((e) => G(n, e), [() => V(r).sub.split(" · ")[0]]), W(e, t);
		};
		K(d, (e) => {
			V(r).sub && e(f);
		}), D(c);
		var p = L(c, 2), m = (e) => {
			var t = ko();
			q(L(F(t), 2), 17, () => V(a).recent, Fr, (e, t) => {
				var n = Oo(), i = P(n);
				{
					let e = /* @__PURE__ */ k(() => V(t).title.slice(0, 2).toUpperCase());
					aa(i, {
						get hue() {
							return V(r).hue;
						},
						get art() {
							return V(t).art;
						},
						get mark() {
							return V(e);
						},
						size: 34,
						radius: 7,
						font: 9
					});
				}
				var a = L(i, 2), o = P(a), s = I(o, !0), c = I(L(o), !0);
				D(a), D(n), R((e) => {
					G(s, V(t).title), G(c, e);
				}, [() => [V(t).artist, Ni(V(t).at)].filter(Boolean).join(" · ")]), W(e, n);
			}), W(e, t);
		};
		K(p, (e) => {
			V(a)?.recent.length && e(m);
		}), R(() => G(u, V(r).genre)), W(e, t);
	}, _e = (e) => {
		var t = wr();
		q(F(t), 16, () => n().queue, (e) => e, (e, t) => {
			let r = /* @__PURE__ */ k(() => n().items[t]);
			var i = wr(), a = F(i), o = (e) => {
				var i = jo(), a = P(i);
				aa(a, {
					get hue() {
						return V(r).hue;
					},
					get art() {
						return V(r).art;
					},
					get mark() {
						return V(r).mark;
					},
					size: 34,
					radius: 7,
					font: 9
				});
				var o = L(a, 2), s = P(o), c = I(s, !0), l = I(L(s));
				D(o);
				var u = L(o, 2);
				$(P(u), {
					get d() {
						return Q.close;
					},
					size: 12,
					stroke: 2
				}), D(u), D(i), R((e) => {
					G(c, V(r).title), G(l, `${di[V(r).type] ?? ""}${e ?? ""}`), Y(u, "aria-label", `Remove ${V(r).title ?? ""} from queue`);
				}, [() => n().lenOf(t) ? ` · ${n().lenOf(t)}` : ""]), H("click", o, () => n().play(t)), H("click", u, () => n().removeFromQueue(t)), W(e, i);
			};
			K(a, (e) => {
				V(r) && e(o);
			}), W(e, i);
		}, (e) => {
			W(e, Mo());
		}), W(e, t);
	}, w = (e) => {
		var t = wr(), i = F(t), a = (e) => {
			var t = wr();
			q(F(t), 17, () => V(r).chapters, Fr, (e, t, i) => {
				let a = /* @__PURE__ */ k(() => _(i)), o = /* @__PURE__ */ k(() => i === n().chapIdx);
				var s = No();
				let c;
				var l = P(s), u = I(l, !0), d = L(l, 2), f = I(d, !0), p = I(L(d, 2), !0);
				D(s), R((e, r) => {
					c = J(s, 1, "chap svelte-1b7bd5u", null, c, {
						cur: V(o),
						done: i < n().chapIdx
					}), G(u, e), G(f, V(t).title), G(p, r);
				}, [() => V(r).type === "book" ? mi(i) : Ai(V(t).start), () => i < n().chapIdx ? "Done" : V(o) && V(a) ? `${Math.min(100, Math.round((n().pos - V(t).start) / V(a) * 100))}%` : V(a) ? ji(V(a)) : ""]), H("click", s, () => n().seekTo(V(t).start)), W(e, s);
			}), W(e, t);
		}, o = /* @__PURE__ */ k(() => X(V(r)) && V(r).chapters.length), s = (e) => {
			var t = Po(), n = I(t, !0);
			R(() => G(n, V(r).type === "book" ? "Loading chapters…" : "This episode has no chapters.")), W(e, t);
		};
		K(i, (e) => {
			V(o) ? e(a) : e(s, -1);
		}), W(e, t);
	}, ve = (e) => {
		var t = Lo(), r = F(t);
		$(P(r), {
			get d() {
				return Q.plus;
			},
			size: 12,
			stroke: 2
		}), Te(), D(r), q(L(r, 2), 17, () => V(s), (e) => e.at, (e, t) => {
			var r = Fo(), i = P(r), a = P(i), s = I(a, !0), c = I(L(a), !0);
			D(i);
			var l = L(i, 2);
			$(P(l), {
				get d() {
					return Q.close;
				},
				size: 12,
				stroke: 2
			}), D(l), D(r), R((e) => {
				G(s, V(t).label), G(c, e), Y(l, "aria-label", `Remove bookmark ${V(t).label ?? ""}`);
			}, [() => new Date(V(t).at).toLocaleString()]), H("click", i, () => n().jumpTo(V(o).id, V(t).pos)), H("click", l, () => n().removeBookmark(V(o).id, V(t).at)), W(e, r);
		}, (e) => {
			W(e, Io());
		}), H("click", r, () => n().bookmark()), W(e, t);
	}, ye = (e) => {
		var t = Wo(), i = F(t), a = (e) => {
			var t = Bo(), n = L(P(t)), i = I(n, !0), a = L(n, 2), o = (e) => {
				var t = Ro(), n = I(L(F(t)), !0);
				R((e) => G(n, e), [() => ji(V(r).dur)]), W(e, t);
			};
			K(a, (e) => {
				V(r).dur && e(o);
			});
			var s = L(a, 2), c = (e) => {
				var t = zo(), n = I(L(F(t)), !0);
				R(() => G(n, V(r).chapters.length)), W(e, t);
			};
			K(s, (e) => {
				V(r).chapters.length && e(c);
			}), Te(3), D(t), R(() => G(i, V(r).sub)), W(e, t);
		}, o = (e) => {
			var t = Ho(), i = L(P(t)), a = P(i), o = I(a, !0);
			D(i);
			var s = L(i, 2), l = (e) => {
				var t = Vo(), n = I(L(F(t)), !0);
				R((e) => G(n, e), [() => new Date(V(r).date).toLocaleDateString()]), W(e, t);
			};
			K(s, (e) => {
				V(r).date && e(l);
			});
			var u = L(s, 2), d = (e) => {
				var t = Ro(), n = I(L(F(t)), !0);
				R((e) => G(n, e), [() => ji(V(c))]), W(e, t);
			};
			K(u, (e) => {
				V(c) && e(d);
			}), D(t), R(() => G(o, V(r).sub)), H("click", a, () => n().openShow(V(r).show)), W(e, t);
		};
		K(i, (e) => {
			V(r).type === "book" ? e(a) : V(r).type === "podcast" && e(o, 1);
		});
		var s = L(i, 2), u = (e) => {
			var t = Uo(), n = I(t, !0);
			R(() => G(n, V(r).desc)), W(e, t);
		}, d = /* @__PURE__ */ k(() => X(V(r)) && V(r).desc);
		K(s, (e) => {
			V(d) && e(u);
		});
		var f = L(s, 2), p = (e) => {
			var t = Co();
			q(L(F(t), 2), 16, () => V(l), (e) => e, (e, t) => {
				let r = /* @__PURE__ */ k(() => n().items[t]);
				var i = wr(), a = F(i), o = (e) => {
					var i = So(), a = P(i);
					aa(a, {
						get hue() {
							return V(r).hue;
						},
						get art() {
							return V(r).art;
						},
						get mark() {
							return V(r).mark;
						},
						size: 34,
						radius: 7,
						font: 9
					});
					var o = L(a, 2), s = P(o), c = I(s, !0), l = I(L(s));
					D(o), D(i), R((e) => {
						G(c, V(r).title), G(l, `${di[V(r).type] ?? ""} · ${e ?? ""}`);
					}, [() => n().leftOf(t)]), H("click", i, () => n().play(t)), W(e, i);
				};
				K(a, (e) => {
					V(r) && e(o);
				}), W(e, i);
			}), W(e, t);
		};
		K(f, (e) => {
			V(l).length && e(p);
		}), W(e, t);
	}, be = (e) => {
		var t = Ko();
		q(t, 21, () => V(h), Fr, (e, t, r) => {
			var i = Go();
			let a;
			var o = P(i), s = I(o), c = L(o, 1, !0);
			D(i), R((e) => {
				a = J(i, 1, "line svelte-1b7bd5u", null, a, { cur: r === n().lineIdx }), G(s, `${V(t).who ? `${V(t).who} · ` : ""}${e ?? ""}`), G(c, V(t).text);
			}, [() => Ai(V(t).t)]), H("click", i, () => n().seekTo(V(t).t)), W(e, i);
		}, (e) => {
			var t = Po(), n = I(t, !0);
			R(() => G(n, V(v))), W(e, t);
		}), D(t), ci(t, (e) => M(g, e), () => V(g)), W(e, t);
	};
	K(me, (e) => {
		V(r) ? V(i) === "onair" && V(r).type === "radio" ? e(ge, 1) : V(i) === "queue" ? e(_e, 2) : V(i) === "chaps" ? e(w, 3) : V(i) === "marks" && V(o) ? e(ve, 4) : V(i) === "about" ? e(ye, 5) : V(i) === "trans" && e(be, 6) : e(he);
	}), D(pe), D(y), R(() => {
		S = J(x, 1, "art svelte-1b7bd5u", null, S, { book: V(r)?.type === "book" }), G(ae, V(p)), G(se, V(m));
	}), W(e, y), Ke();
}
pr(["click"]);
//#endregion
//#region src/components/SeekBar.svelte
var Xo = /* @__PURE__ */ U("<div class=\"tick svelte-qmop01\"></div>"), Zo = /* @__PURE__ */ U("<div role=\"slider\" aria-label=\"Playback position\"><div class=\"track svelte-qmop01\"><div class=\"fill svelte-qmop01\"></div> <!></div></div>"), Qo = {
	hash: "svelte-qmop01",
	code: ".seek.svelte-qmop01 {flex:1;display:flex;align-items:center;cursor:pointer;border-radius:4px;}.seek.live.svelte-qmop01 {cursor:default;}.seek.svelte-qmop01:focus-visible {outline:2px solid var(--tm-accent);outline-offset:2px;}.track.svelte-qmop01 {flex:1;height:4px;border-radius:2px;background:var(--tm-fg-12);position:relative;}.fill.svelte-qmop01 {position:absolute;left:0;top:0;bottom:0;border-radius:2px;background:var(--tm-accent);}.live.svelte-qmop01 .fill:where(.svelte-qmop01) {opacity:.55;}.tick.svelte-qmop01 {position:absolute;top:-1px;width:2px;height:6px;background:var(--tm-panel);}"
};
function $o(e, t) {
	Ge(t, !0), Wr(e, Qo);
	let n = li(t, "height", 3, 14), r = li(t, "ticks", 3, !1), i = /* @__PURE__ */ k(() => t.store.item), a = /* @__PURE__ */ k(() => V(i) ? t.store.durOf(V(i).id) : 0), o = /* @__PURE__ */ k(() => !!V(i) && X(V(i)) && V(a) > 0), s = /* @__PURE__ */ k(() => V(i) ? X(V(i)) ? V(a) ? Math.min(100, t.store.pos / V(a) * 100) : 0 : 100 : 0), c = /* @__PURE__ */ k(() => r() && V(i) && X(V(i)) && V(a) ? V(i).chapters.slice(1).map((e) => e.start / V(a) * 100) : []);
	function l(e) {
		if (!V(o)) return;
		let n = e.currentTarget.getBoundingClientRect();
		t.store.seekFraction((e.clientX - n.left) / n.width);
	}
	function u(e) {
		if (!V(o)) return;
		let n = {
			ArrowLeft: -15,
			ArrowRight: 30,
			PageDown: -60,
			PageUp: 60
		}[e.key];
		n ? (e.preventDefault(), t.store.skip(n)) : e.key === "Home" ? (e.preventDefault(), t.store.seekFraction(0)) : e.key === "End" && (e.preventDefault(), t.store.seekFraction(1));
	}
	var d = Zo();
	let f;
	Y(d, "aria-valuemin", 0), Y(d, "aria-valuemax", 100);
	let p;
	var m = P(d), h = P(m);
	let g;
	q(L(h, 2), 17, () => V(c), Fr, (e, t) => {
		var n = Xo();
		let r;
		R(() => r = Zr(n, "", r, { left: `${V(t) ?? ""}%` })), W(e, n);
	}), D(m), D(d), R((e, t) => {
		f = J(d, 1, "seek svelte-qmop01", null, f, { live: !V(o) }), Y(d, "tabindex", V(o) ? 0 : -1), Y(d, "aria-disabled", !V(o)), Y(d, "aria-valuenow", e), Y(d, "aria-valuetext", t), p = Zr(d, "", p, { height: `${n() ?? ""}px` }), g = Zr(h, "", g, { width: `${V(s) ?? ""}%` });
	}, [() => Math.round(V(s)), () => V(o) ? `${Ai(t.store.pos)} of ${Ai(V(a))}` : "Live"]), H("click", d, l), H("keydown", d, u), W(e, d), Ke();
}
pr(["click", "keydown"]);
//#endregion
//#region src/components/SleepPopover.svelte
var es = /* @__PURE__ */ U("<button> </button>"), ts = /* @__PURE__ */ U("<div class=\"tm-pop\" role=\"dialog\" aria-label=\"Sleep timer\"><div class=\"title svelte-1mpzphw\">Sleep timer</div> <div class=\"hint svelte-1mpzphw\">Audio fades out over the last minute.</div> <div class=\"grid svelte-1mpzphw\"></div> <button> </button> <button class=\"off svelte-1mpzphw\">Turn off</button></div>"), ns = {
	hash: "svelte-1mpzphw",
	code: ".title.svelte-1mpzphw {font-size:13px;font-weight:650;}.hint.svelte-1mpzphw {font-size:11px;color:var(--tm-muted);margin-top:2px;}.grid.svelte-1mpzphw {display:grid;grid-template-columns:repeat(3, 1fr);gap:6px;margin-top:12px;}.opt.svelte-1mpzphw {height:34px;border-radius:9px;border:0;background:var(--tm-fg-6);color:var(--tm-fg);font-size:12px;font-weight:600;cursor:pointer;}.opt.svelte-1mpzphw:hover {background:var(--tm-fg-10);}.opt.sel.svelte-1mpzphw {background:var(--tm-accent);color:var(--tm-on-accent);}.wide.svelte-1mpzphw {width:100%;margin-top:6px;}.off.svelte-1mpzphw {width:100%;height:30px;margin-top:6px;border:0;background:none;color:var(--tm-muted);font-size:12px;cursor:pointer;}.off.svelte-1mpzphw:hover {color:var(--tm-fg);}"
};
function rs(e, t) {
	Ge(t, !0), Wr(e, ns);
	let n = (e) => typeof t.store.sleep == "number" && Math.ceil(t.store.sleep / 60) === e;
	var r = ts(), i = L(P(r), 4);
	q(i, 21, () => Ji, Fr, (e, r) => {
		var i = es();
		let a;
		var o = I(i);
		R((e) => {
			a = J(i, 1, "opt svelte-1mpzphw", null, a, { sel: e }), G(o, `${V(r) ?? ""} min`);
		}, [() => n(V(r))]), H("click", i, () => t.store.setSleepMinutes(V(r))), W(e, i);
	}), D(i);
	var a = L(i, 2);
	let o;
	var s = I(a, !0), c = L(a, 2);
	D(r), R(() => {
		Zr(r, t.pos), o = J(a, 1, "opt wide svelte-1mpzphw", null, o, { sel: t.store.sleep === "chapter" }), G(s, t.store.live ? "End of current show" : t.store.chapters.length > 1 ? "End of chapter" : "End of episode");
	}), H("click", a, () => t.store.sleepAtEnd()), H("click", c, () => t.store.sleepOff()), W(e, r), Ke();
}
pr(["click"]);
//#endregion
//#region src/components/SpeedPopover.svelte
var is = /* @__PURE__ */ U("<button> </button>"), as = /* @__PURE__ */ U("<div class=\"tm-pop\" role=\"dialog\" aria-label=\"Playback speed\"><div class=\"head svelte-1xvntbg\"><span class=\"title svelte-1xvntbg\">Playback speed</span><span class=\"now svelte-1xvntbg\"> </span></div> <div class=\"hint svelte-1xvntbg\"> </div> <div class=\"grid svelte-1xvntbg\"></div></div>"), os = {
	hash: "svelte-1xvntbg",
	code: ".head.svelte-1xvntbg {display:flex;align-items:baseline;justify-content:space-between;}.title.svelte-1xvntbg {font-size:13px;font-weight:650;}.now.svelte-1xvntbg {font:600 12px ui-monospace, Menlo, monospace;color:var(--tm-accent);}.hint.svelte-1xvntbg {font-size:11px;color:var(--tm-muted);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.grid.svelte-1xvntbg {display:grid;grid-template-columns:repeat(4, 1fr);gap:6px;margin-top:12px;}.opt.svelte-1xvntbg {height:32px;border-radius:9px;border:0;background:var(--tm-fg-6);color:var(--tm-fg);font:600 11.5px ui-monospace, Menlo, monospace;cursor:pointer;}.opt.svelte-1xvntbg:hover {background:var(--tm-fg-10);}.opt.sel.svelte-1xvntbg {background:var(--tm-accent);color:var(--tm-on-accent);}"
};
function ss(e, t) {
	Ge(t, !0), Wr(e, os);
	var n = as(), r = P(n), i = I(L(P(r)));
	D(r);
	var a = L(r, 2), o = I(a), s = L(a, 2);
	q(s, 21, () => qi, Fr, (e, n) => {
		var r = is();
		let i;
		var a = I(r);
		R((e) => {
			i = J(r, 1, "opt svelte-1xvntbg", null, i, { sel: t.store.speed === V(n) }), G(a, `${e ?? ""}×`);
		}, [() => V(n).toFixed(1)]), H("click", r, () => t.store.setSpeed(V(n))), W(e, r);
	}), D(s), D(n), R((e) => {
		Zr(n, t.pos), G(i, `${e ?? ""}×`), G(o, `Remembered for ${t.store.speedScope ?? ""}.`);
	}, [() => t.store.speed.toFixed(1)]), W(e, n), Ke();
}
pr(["click"]);
//#endregion
//#region src/components/PlayerBar.svelte
var cs = /* @__PURE__ */ U("<div class=\"thumb svelte-y66ne\"></div>"), ls = /* @__PURE__ */ U("<span class=\"live svelte-y66ne\">LIVE</span>"), us = /* @__PURE__ */ U("<span class=\"time r svelte-y66ne\"> </span>"), ds = /* @__PURE__ */ U("<footer class=\"bar svelte-y66ne\"><div class=\"now svelte-y66ne\"><!> <div class=\"ntext svelte-y66ne\"><div class=\"ntitle svelte-y66ne\"> </div><div class=\"nsub svelte-y66ne\"> </div></div></div> <div class=\"center svelte-y66ne\"><div class=\"controls svelte-y66ne\"><button class=\"skipc svelte-y66ne\" aria-label=\"Previous chapter\"><!></button> <button class=\"jump svelte-y66ne\" aria-label=\"Back 15 seconds\">−15</button> <button><!></button> <button class=\"jump svelte-y66ne\" aria-label=\"Forward 30 seconds\">+30</button> <button class=\"skipc svelte-y66ne\" aria-label=\"Next in queue\"><!></button></div> <div class=\"timeline svelte-y66ne\"><span class=\"time l svelte-y66ne\"> </span> <!> <!></div></div> <div class=\"tools svelte-y66ne\"><button data-pop=\"\" aria-haspopup=\"dialog\"> </button> <button data-pop=\"\" title=\"Sleep timer\" aria-haspopup=\"dialog\"><!> </button> <button class=\"clip svelte-y66ne\" title=\"Clip to Notes\"><!></button> <div class=\"vol svelte-y66ne\"><button class=\"mute svelte-y66ne\"><!></button> <div class=\"vtrack svelte-y66ne\" role=\"slider\" tabindex=\"0\" aria-label=\"Volume\"><div class=\"vfill svelte-y66ne\"></div></div></div></div> <!> <!></footer>"), fs = {
	hash: "svelte-y66ne",
	code: ".bar.svelte-y66ne {height:84px;flex:none;display:flex;align-items:center;gap:18px;padding:0 18px;background:var(--tm-panel);border-top:1px solid var(--tm-fg-7);position:relative;}.now.svelte-y66ne {width:240px;display:flex;align-items:center;gap:11px;min-width:0;flex:none;}.thumb.svelte-y66ne {width:46px;height:46px;border-radius:9px;flex:none;background:var(--tm-fg-6);}.ntext.svelte-y66ne {min-width:0;}.ntitle.svelte-y66ne {font-size:12.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.nsub.svelte-y66ne {font-size:11px;color:var(--tm-muted);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.center.svelte-y66ne {flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;gap:6px;}.controls.svelte-y66ne {display:flex;align-items:center;justify-content:center;gap:14px;}button.svelte-y66ne:disabled {opacity:.35;cursor:default;}.skipc.svelte-y66ne {width:30px;height:30px;border:0;background:none;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;}.skipc.svelte-y66ne:hover:not(:disabled) {color:var(--tm-fg);}.jump.svelte-y66ne {width:32px;height:32px;border:0;background:none;color:var(--tm-fg);cursor:pointer;font:600 10.5px ui-monospace, Menlo, monospace;border-radius:16px;}.jump.svelte-y66ne:hover:not(:disabled) {background:var(--tm-fg-8);}.pp.svelte-y66ne {width:50px;height:50px;flex:none;padding:0;border:0;border-radius:50%;background:var(--tm-fg);color:var(--tm-bg);cursor:pointer;display:grid;place-items:center;position:relative;transition:transform .1s;}\n  /* The play triangle's visual centre sits left of its box. */.pp.paused.svelte-y66ne svg {transform:translateX(1.5px);}.pp.svelte-y66ne:hover:not(:disabled) {filter:brightness(1.12);transform:scale(1.04);}.pp.svelte-y66ne:active:not(:disabled) {transform:scale(.96);}.pp.busy.svelte-y66ne::after {content:'';position:absolute;inset:-4px;border-radius:50%;border:2px solid transparent;border-top-color:var(--tm-accent); animation: svelte-y66ne-spin .9s linear infinite;}\n  @keyframes svelte-y66ne-spin { to { transform: rotate(360deg); } }\n  @media (prefers-reduced-motion: reduce) {.pp.svelte-y66ne {transition:none;}.pp.busy.svelte-y66ne::after { animation: none;border-color:var(--tm-accent);} }.timeline.svelte-y66ne {display:flex;align-items:center;gap:10px;width:100%;max-width:440px;}.time.svelte-y66ne {font:500 10.5px ui-monospace, Menlo, monospace;color:var(--tm-muted);width:52px;flex:none;}.time.l.svelte-y66ne {text-align:right;}.live.svelte-y66ne {width:52px;height:20px;flex:none;display:grid;place-items:center;border-radius:10px;background:var(--tm-live);color:#fff;font-size:9.5px;font-weight:700;letter-spacing:.8px;}.tools.svelte-y66ne {width:240px;flex:none;display:flex;align-items:center;justify-content:flex-end;gap:6px;}.speed.svelte-y66ne {height:30px;min-width:44px;padding:0 8px;border:0;border-radius:8px;background:transparent;color:var(--tm-fg);font:600 11.5px ui-monospace, Menlo, monospace;cursor:pointer;}.speed.on.svelte-y66ne {background:var(--tm-accent-14);}.sleep.svelte-y66ne {height:30px;padding:0 8px;border:0;border-radius:8px;background:transparent;color:var(--tm-fg);cursor:pointer;display:flex;align-items:center;gap:5px;font:600 11px ui-monospace, Menlo, monospace;}.sleep.on.svelte-y66ne {background:var(--tm-accent-14);color:var(--tm-accent);}.speed.svelte-y66ne:hover:not(:disabled), .sleep.svelte-y66ne:hover:not(:disabled), .clip.svelte-y66ne:hover:not(:disabled) {background:var(--tm-fg-10);}.clip.svelte-y66ne {height:30px;width:32px;border:0;border-radius:8px;background:transparent;color:var(--tm-fg);cursor:pointer;display:grid;place-items:center;}.vol.svelte-y66ne {display:flex;align-items:center;gap:6px;margin-left:4px;color:var(--tm-muted);}.mute.svelte-y66ne {border:0;background:none;padding:0;color:inherit;cursor:pointer;display:grid;place-items:center;}.mute.svelte-y66ne:hover {color:var(--tm-fg);}.vtrack.svelte-y66ne {width:64px;height:12px;display:flex;align-items:center;cursor:pointer;position:relative;background:linear-gradient(var(--tm-fg-12), var(--tm-fg-12)) center / 100% 4px no-repeat;border-radius:2px;}.vfill.svelte-y66ne {height:4px;border-radius:2px;background:var(--tm-fg);}.vtrack.svelte-y66ne:focus-visible {outline:2px solid var(--tm-accent);outline-offset:2px;}"
};
function ps(e, t) {
	Ge(t, !0), Wr(e, fs);
	let n = /* @__PURE__ */ k(() => t.store.item), r = /* @__PURE__ */ k(() => !!V(n) && X(V(n))), i = /* @__PURE__ */ k(() => V(n) ? t.store.durOf(V(n).id) : 0), a = /* @__PURE__ */ k(() => typeof t.store.sleep == "number" ? Ai(t.store.sleep) : t.store.sleep === "chapter" ? "End" : ""), o = /* @__PURE__ */ k(() => t.store.buffering || t.store.loadingItem), s = /* @__PURE__ */ k(() => V(n)?.type === "radio" ? t.store.nowPlaying[V(n).stationId] : void 0), c = /* @__PURE__ */ k(() => t.store.playing ? t.store.live ? "Stop" : "Pause" : "Play"), l = /* @__PURE__ */ k(() => t.store.playing ? t.store.live ? Q.stop : Q.pause : Q.play);
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
	var f = ds(), p = P(f), m = P(p), h = (e) => {
		{
			let t = /* @__PURE__ */ k(() => V(s)?.art || V(n).art);
			aa(e, {
				get hue() {
					return V(n).hue;
				},
				get art() {
					return V(t);
				},
				get mark() {
					return V(n).mark;
				},
				size: 46,
				radius: 9
			});
		}
	}, g = (e) => {
		W(e, cs());
	};
	K(m, (e) => {
		V(n) ? e(h) : e(g, -1);
	});
	var _ = L(m, 2), v = P(_), y = I(v, !0), b = I(L(v), !0);
	D(_), D(p);
	var x = L(p, 2), S = P(x), C = P(S);
	$(P(C), { get d() {
		return Q.prev;
	} }), D(C);
	var ee = L(C, 2), te = L(ee, 2);
	let ne;
	$(P(te), {
		get d() {
			return V(l);
		},
		size: 22
	}), D(te);
	var re = L(te, 2), ie = L(re, 2);
	$(P(ie), { get d() {
		return Q.next;
	} }), D(ie), D(S);
	var ae = L(S, 2), oe = P(ae), se = I(oe, !0), ce = L(oe, 2);
	$o(ce, {
		get store() {
			return t.store;
		},
		ticks: !0
	});
	var le = L(ce, 2), ue = (e) => {
		W(e, ls());
	}, de = (e) => {
		var n = us(), r = I(n, !0);
		R((e) => G(r, e), [() => V(i) ? `−${Ai(Ui(V(i), t.store.pos, t.store.speed))}` : ""]), W(e, n);
	};
	K(le, (e) => {
		V(n) && !V(r) ? e(ue) : e(de, -1);
	}), D(ae), D(x);
	var fe = L(x, 2), pe = P(fe);
	let me;
	var he = I(pe), ge = L(pe, 2);
	let _e;
	var w = P(ge);
	$(w, {
		get d() {
			return Q.moon;
		},
		size: 15,
		stroke: 1.8
	});
	var ve = L(w, 1, !0);
	D(ge);
	var ye = L(ge, 2);
	$(P(ye), {
		get d() {
			return Q.clip;
		},
		size: 15,
		stroke: 1.8
	}), D(ye);
	var be = L(ye, 2), xe = P(be), T = P(xe);
	{
		let e = /* @__PURE__ */ k(() => t.store.muted ? Q.muted : Q.volume);
		$(T, {
			get d() {
				return V(e);
			},
			size: 15,
			stroke: 1.8
		});
	}
	D(xe);
	var Se = L(xe, 2);
	Y(Se, "aria-valuemin", 0), Y(Se, "aria-valuemax", 100);
	var E = P(Se);
	let Ce;
	D(Se), D(be), D(fe);
	var we = L(fe, 2), Te = (e) => {
		rs(e, {
			get store() {
				return t.store;
			},
			pos: "right:60px;bottom:74px"
		});
	};
	K(we, (e) => {
		t.store.pop === "sleep" && e(Te);
	});
	var Ee = L(we, 2), De = (e) => {
		ss(e, {
			get store() {
				return t.store;
			},
			pos: "right:110px;bottom:74px"
		});
	};
	K(Ee, (e) => {
		t.store.pop === "speed" && e(De);
	}), D(f), R((e, i, l, u, d) => {
		G(y, V(s)?.title || V(n)?.title || "Nothing playing"), G(b, e), C.disabled = !V(r), ee.disabled = !V(r), ne = J(te, 1, "pp svelte-y66ne", null, ne, {
			busy: V(o),
			paused: !t.store.playing
		}), Y(te, "aria-label", V(c)), Y(te, "title", V(c)), te.disabled = !V(n), re.disabled = !V(r), ie.disabled = !t.store.queue.length, G(se, i), me = J(pe, 1, "speed svelte-y66ne", null, me, { on: t.store.speed !== 1 && V(r) }), pe.disabled = !V(n), Y(pe, "aria-expanded", t.store.pop === "speed"), Y(pe, "aria-label", `Playback speed ${l ?? ""}×`), G(he, `${u ?? ""}×`), _e = J(ge, 1, "sleep svelte-y66ne", null, _e, { on: !!t.store.sleep }), ge.disabled = !V(n), Y(ge, "aria-expanded", t.store.pop === "sleep"), Y(ge, "aria-label", `Sleep timer${V(a) ? `: ${V(a)}` : ""}`), G(ve, V(a)), Y(ye, "aria-label", V(r) ? "Clip the last 30 seconds to Notes" : "Save what is playing to Notes"), ye.disabled = !V(n), Y(xe, "aria-label", t.store.muted ? "Unmute" : "Mute"), Y(Se, "aria-valuenow", d), Ce = Zr(E, "", Ce, { width: `${(t.store.muted ? 0 : t.store.volume) * 100}%` });
	}, [
		() => V(n) ? V(s)?.title ? [V(s).artist, V(n).title].filter(Boolean).join(" · ") : t.store.subtitle : "Choose something to listen to",
		() => V(n) ? V(r) ? Ai(t.store.pos) : "On air" : "",
		() => t.store.speed.toFixed(1),
		() => V(r) ? t.store.speed.toFixed(1) : "1.0",
		() => Math.round((t.store.muted ? 0 : t.store.volume) * 100)
	]), H("click", C, () => t.store.previous()), H("click", ee, () => t.store.skip(-15)), H("click", te, () => t.store.toggle()), H("click", re, () => t.store.skip(30)), H("click", ie, () => t.store.next()), H("click", pe, () => t.store.togglePop("speed")), H("click", ge, () => t.store.togglePop("sleep")), H("click", ye, () => t.store.clip()), H("click", xe, () => t.store.toggleMute()), H("click", Se, u), H("keydown", Se, d), W(e, f), Ke();
}
pr(["click", "keydown"]);
//#endregion
//#region src/components/MiniPlayer.svelte
var ms = /* @__PURE__ */ U("<div class=\"blank svelte-1jla3sy\"></div>"), hs = /* @__PURE__ */ U("<span class=\"kind svelte-1jla3sy\"> </span>"), gs = /* @__PURE__ */ U("<div class=\"chapter svelte-1jla3sy\"><span class=\"svelte-1jla3sy\">Chapter</span><br/> </div>"), _s = /* @__PURE__ */ U("<span class=\"liveword svelte-1jla3sy\">LIVE</span>"), vs = /* @__PURE__ */ U("<span> </span>"), ys = /* @__PURE__ */ U("<div class=\"sleepnote svelte-1jla3sy\"> </div>"), bs = /* @__PURE__ */ U("<button class=\"svelte-1jla3sy\">Clip to Notes</button>"), xs = /* @__PURE__ */ U("<button class=\"q svelte-1jla3sy\"><!> <span class=\"qtext svelte-1jla3sy\"><span class=\"qtitle svelte-1jla3sy\"> </span><span class=\"qmeta svelte-1jla3sy\"> </span></span></button>"), Ss = /* @__PURE__ */ U("<div class=\"empty svelte-1jla3sy\">Widen the panel to browse radio, podcasts and audiobooks.</div>"), Cs = /* @__PURE__ */ U("<div class=\"mini svelte-1jla3sy\"><div class=\"head svelte-1jla3sy\"><span class=\"np svelte-1jla3sy\">Now playing</span><span class=\"spacer svelte-1jla3sy\"></span><span class=\"by svelte-1jla3sy\">OndaCast</span></div> <div class=\"player svelte-1jla3sy\"><div class=\"art svelte-1jla3sy\"><!> <!> <!></div> <div class=\"title svelte-1jla3sy\"> </div> <div class=\"sub svelte-1jla3sy\"> </div> <div class=\"seek svelte-1jla3sy\"><!></div> <div class=\"times svelte-1jla3sy\"><span> </span> <!></div> <div class=\"controls svelte-1jla3sy\"><button class=\"chipbtn svelte-1jla3sy\" data-pop=\"\" aria-haspopup=\"dialog\"> </button> <button class=\"jump svelte-1jla3sy\" aria-label=\"Back 15 seconds\">−15</button> <button><!></button> <button class=\"jump svelte-1jla3sy\" aria-label=\"Forward 30 seconds\">+30</button> <button data-pop=\"\" aria-haspopup=\"dialog\" aria-label=\"Sleep timer\"><!></button></div> <!> <!> <!></div> <div class=\"upnext svelte-1jla3sy\"><div class=\"uphead svelte-1jla3sy\"><span class=\"svelte-1jla3sy\"> </span><!></div> <!></div></div>"), ws = {
	hash: "svelte-1jla3sy",
	code: ".mini.svelte-1jla3sy {height:100%;container-type:size;display:flex;flex-direction:column;background:var(--tm-bg);}.head.svelte-1jla3sy {height:36px;flex:none;display:flex;align-items:center;gap:8px;padding:0 14px;background:var(--tm-panel);}.by.svelte-1jla3sy {font-size:11px;color:var(--tm-muted);}.spacer.svelte-1jla3sy {flex:1;}.np.svelte-1jla3sy {font-size:12px;font-weight:600;}.player.svelte-1jla3sy {padding:22px 22px 0;position:relative;flex:none;}.art.svelte-1jla3sy {width:min(100%, 48cqh);aspect-ratio:1;margin:0 auto;border-radius:18px;overflow:hidden;display:flex;position:relative;box-shadow:0 24px 50px rgba(0, 0, 0, .45);}.blank.svelte-1jla3sy {flex:1;background:var(--tm-fg-6);}.kind.svelte-1jla3sy {position:absolute;left:14px;top:14px;font-size:9.5px;font-weight:700;letter-spacing:.8px;padding:3px 8px;border-radius:20px;background:rgba(0, 0, 0, .45);color:#fff;}.chapter.svelte-1jla3sy {position:absolute;left:14px;bottom:14px;max-width:70%;padding:8px 10px;border-radius:10px;background:rgba(0, 0, 0, .5);color:#fff;font-size:11.5px;line-height:1.3;}.chapter.svelte-1jla3sy span:where(.svelte-1jla3sy) {opacity:.7;}.title.svelte-1jla3sy {font-size:17px;font-weight:650;margin-top:18px;line-height:1.3;text-wrap:pretty;display:-webkit-box;-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}.sub.svelte-1jla3sy {font-size:12.5px;color:var(--tm-muted);margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.seek.svelte-1jla3sy {display:flex;margin-top:14px;}.times.svelte-1jla3sy {display:flex;justify-content:space-between;font:500 10.5px ui-monospace, Menlo, monospace;color:var(--tm-muted);margin-top:2px;}.liveword.svelte-1jla3sy {color:var(--tm-live);font-weight:700;}.controls.svelte-1jla3sy {display:flex;align-items:center;justify-content:space-between;margin-top:10px;}button.svelte-1jla3sy:disabled {opacity:.35;cursor:default;}.chipbtn.svelte-1jla3sy {width:44px;height:30px;border:0;border-radius:8px;background:var(--tm-fg-6);color:var(--tm-fg);font:600 11px ui-monospace, Menlo, monospace;cursor:pointer;display:grid;place-items:center;}.sleep.svelte-1jla3sy {background:transparent;}.sleep.on.svelte-1jla3sy {background:var(--tm-accent-14);color:var(--tm-accent);}.jump.svelte-1jla3sy {width:40px;height:40px;border:0;border-radius:20px;background:none;color:var(--tm-fg);font:600 11px ui-monospace, Menlo, monospace;cursor:pointer;}.jump.svelte-1jla3sy:hover:not(:disabled) {background:var(--tm-fg-8);}.pp.svelte-1jla3sy {width:58px;height:58px;flex:none;padding:0;border:0;border-radius:50%;background:var(--tm-accent);color:var(--tm-on-accent);cursor:pointer;display:grid;place-items:center;position:relative;}.pp.paused.svelte-1jla3sy svg {transform:translateX(1.5px);}.pp.busy.svelte-1jla3sy::after {content:'';position:absolute;inset:-5px;border-radius:50%;border:2px solid transparent;border-top-color:var(--tm-accent); animation: svelte-1jla3sy-spin .9s linear infinite;}\n  @keyframes svelte-1jla3sy-spin { to { transform: rotate(360deg); } }\n  @media (prefers-reduced-motion: reduce) {.pp.busy.svelte-1jla3sy::after { animation: none;} }.sleepnote.svelte-1jla3sy {text-align:center;font-size:11px;color:var(--tm-accent);margin-top:6px;}.upnext.svelte-1jla3sy {flex:1;min-height:0;margin-top:16px;background:var(--tm-panel);border-radius:18px 18px 0 0;padding:14px 12px;overflow:auto;}.uphead.svelte-1jla3sy {display:flex;align-items:baseline;justify-content:space-between;padding:0 8px 6px;}.uphead.svelte-1jla3sy span:where(.svelte-1jla3sy) {font-size:13px;font-weight:650;}.uphead.svelte-1jla3sy button:where(.svelte-1jla3sy) {border:0;background:none;color:var(--tm-accent);font-size:11.5px;cursor:pointer;padding:0;}.q.svelte-1jla3sy {display:flex;align-items:center;gap:10px;width:100%;padding:7px 8px;border:0;border-radius:9px;background:none;color:inherit;cursor:pointer;text-align:left;font:inherit;}.q.svelte-1jla3sy:hover {background:var(--tm-fg-5);}.qtext.svelte-1jla3sy {flex:1;min-width:0;display:flex;flex-direction:column;}.qtitle.svelte-1jla3sy {font-size:12.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.qmeta.svelte-1jla3sy {font-size:11px;color:var(--tm-muted);margin-top:2px;}.empty.svelte-1jla3sy {padding:20px 8px;font-size:12px;color:var(--tm-muted);text-align:center;}"
};
function Ts(e, t) {
	Ge(t, !0), Wr(e, ws);
	let n = /* @__PURE__ */ k(() => t.store.item), r = /* @__PURE__ */ k(() => !!V(n) && X(V(n))), i = /* @__PURE__ */ k(() => V(n) ? t.store.durOf(V(n).id) : 0), a = /* @__PURE__ */ k(() => V(n) && X(V(n)) && V(n).chapters.length > 1 && t.store.chapIdx >= 0 ? V(n).chapters[t.store.chapIdx].title : ""), o = /* @__PURE__ */ k(() => typeof t.store.sleep == "number" ? Ai(t.store.sleep) : t.store.sleep === "chapter" ? "end of chapter" : ""), s = /* @__PURE__ */ k(() => V(n)?.type === "radio" ? t.store.nowPlaying[V(n).stationId] : void 0), c = /* @__PURE__ */ k(() => [...t.store.continueIds, ...t.store.onAirIds].filter((e) => e !== t.store.now).slice(0, 6));
	var l = Cs(), u = L(P(l), 2), d = P(u), f = P(d), p = (e) => {
		{
			let t = /* @__PURE__ */ k(() => V(s)?.art || V(n).art);
			aa(e, {
				get hue() {
					return V(n).hue;
				},
				get art() {
					return V(t);
				},
				fill: !0,
				radius: 0,
				get mark() {
					return V(n).mark;
				},
				font: 40
			});
		}
	}, m = (e) => {
		W(e, ms());
	};
	K(f, (e) => {
		V(n) ? e(p) : e(m, -1);
	});
	var h = L(f, 2), g = (e) => {
		var n = hs(), r = I(n, !0);
		R(() => G(r, t.store.kindLabel)), W(e, n);
	};
	K(h, (e) => {
		V(n) && e(g);
	});
	var _ = L(h, 2), v = (e) => {
		var t = gs(), n = L(P(t), 2, !0);
		D(t), R(() => G(n, V(a))), W(e, t);
	};
	K(_, (e) => {
		V(a) && e(v);
	}), D(d);
	var y = L(d, 2), b = I(y, !0), x = L(y, 2), S = I(x, !0), C = L(x, 2);
	$o(P(C), {
		get store() {
			return t.store;
		},
		height: 16
	}), D(C);
	var ee = L(C, 2), te = P(ee), ne = I(te, !0), re = L(te, 2), ie = (e) => {
		W(e, _s());
	}, ae = (e) => {
		var n = vs(), r = I(n, !0);
		R((e) => G(r, e), [() => V(i) ? `−${Ai(Ui(V(i), t.store.pos, t.store.speed))}` : ""]), W(e, n);
	};
	K(re, (e) => {
		V(n) && !V(r) ? e(ie) : e(ae, -1);
	}), D(ee);
	var oe = L(ee, 2), se = P(oe), ce = I(se), le = L(se, 2), ue = L(le, 2);
	let de;
	var fe = P(ue);
	{
		let e = /* @__PURE__ */ k(() => t.store.playing ? t.store.live ? Q.stop : Q.pause : Q.play);
		$(fe, {
			get d() {
				return V(e);
			},
			size: 24
		});
	}
	D(ue);
	var pe = L(ue, 2), me = L(pe, 2);
	let he;
	$(P(me), {
		get d() {
			return Q.moon;
		},
		size: 15,
		stroke: 1.8
	}), D(me), D(oe);
	var ge = L(oe, 2), _e = (e) => {
		var t = ys(), n = I(t);
		R(() => G(n, `Sleep timer · ${V(o) ?? ""}`)), W(e, t);
	};
	K(ge, (e) => {
		t.store.sleep && e(_e);
	});
	var w = L(ge, 2), ve = (e) => {
		rs(e, {
			get store() {
				return t.store;
			},
			pos: "right:16px;left:16px;width:auto;top:120px"
		});
	};
	K(w, (e) => {
		t.store.pop === "sleep" && e(ve);
	});
	var ye = L(w, 2), be = (e) => {
		ss(e, {
			get store() {
				return t.store;
			},
			pos: "right:16px;left:16px;width:auto;top:120px"
		});
	};
	K(ye, (e) => {
		t.store.pop === "speed" && e(be);
	}), D(u);
	var xe = L(u, 2), T = P(xe), Se = P(T), E = I(Se, !0), Ce = L(Se), we = (e) => {
		var n = bs();
		H("click", n, () => t.store.clip()), W(e, n);
	};
	K(Ce, (e) => {
		V(n) && e(we);
	}), D(T), q(L(T, 2), 16, () => t.store.queue.length ? t.store.queue : V(c), (e) => e, (e, n) => {
		let r = /* @__PURE__ */ k(() => t.store.items[n]);
		var i = wr(), a = F(i), o = (e) => {
			var i = xs(), a = P(i);
			aa(a, {
				get hue() {
					return V(r).hue;
				},
				get art() {
					return V(r).art;
				},
				get mark() {
					return V(r).mark;
				},
				size: 36,
				font: 9
			});
			var o = L(a, 2), s = P(o), c = I(s, !0), l = I(L(s));
			D(o), D(i), R((e) => {
				G(c, V(r).title), G(l, `${di[V(r).type] ?? ""}${e ?? ""}`);
			}, [() => t.store.lenOf(n) ? ` · ${t.store.lenOf(n)}` : ""]), H("click", i, () => t.store.play(n)), W(e, i);
		};
		K(a, (e) => {
			V(r) && e(o);
		}), W(e, i);
	}, (e) => {
		W(e, Ss());
	}), D(xe), D(l), R((e, i, a, o) => {
		G(b, V(s)?.title || V(n)?.title || "Nothing playing"), G(S, e), G(ne, i), se.disabled = !V(r), Y(se, "aria-expanded", t.store.pop === "speed"), Y(se, "aria-label", `Playback speed ${a ?? ""}×`), G(ce, `${o ?? ""}×`), le.disabled = !V(r), de = J(ue, 1, "pp svelte-1jla3sy", null, de, {
			busy: t.store.buffering || t.store.loadingItem,
			paused: !t.store.playing
		}), ue.disabled = !V(n), Y(ue, "aria-label", t.store.playing ? t.store.live ? "Stop" : "Pause" : "Play"), pe.disabled = !V(r), he = J(me, 1, "chipbtn sleep svelte-1jla3sy", null, he, { on: !!t.store.sleep }), me.disabled = !V(n), Y(me, "aria-expanded", t.store.pop === "sleep"), G(E, t.store.queue.length ? "Up next" : "Recent");
	}, [
		() => V(n) ? V(s)?.title ? [V(s).artist, V(n).title].filter(Boolean).join(" · ") : t.store.subtitle : "Widen the panel to browse, or pick from below.",
		() => V(n) ? V(r) ? Ai(t.store.pos) : "On air" : "",
		() => t.store.speed.toFixed(1),
		() => V(r) ? t.store.speed.toFixed(1) : "1.0"
	]), H("click", se, () => t.store.togglePop("speed")), H("click", le, () => t.store.skip(-15)), H("click", ue, () => t.store.toggle()), H("click", pe, () => t.store.skip(30)), H("click", me, () => t.store.togglePop("sleep")), W(e, l), Ke();
}
pr(["click"]);
//#endregion
//#region src/App.svelte
var Es = /* @__PURE__ */ U("<div class=\"unsupported svelte-1n46o8q\"><strong class=\"svelte-1n46o8q\">Update Tend to use TEND Media.</strong><p>This panel does not provide the OndaCast catalog capability yet. Updating Tend adds it.</p></div>"), Ds = /* @__PURE__ */ U("<!> <div class=\"middle svelte-1n46o8q\"><!> <main class=\"svelte-1n46o8q\"><!></main> <!></div> <!>", 1), Os = /* @__PURE__ */ U("<div role=\"status\"> </div>"), ks = /* @__PURE__ */ U("<div class=\"tend-media svelte-1n46o8q\"><!> <!></div>"), As = {
	hash: "svelte-1n46o8q",
	code: ".tend-media.svelte-1n46o8q {\n    /* Live Tend theme tokens with the TEND Notes dark palette as fallback. */--tm-bg: var(--color-base-100, #151b19);--tm-panel: var(--color-base-200, #1d2622);--tm-fg: var(--color-base-content, #d8e3df);--tm-accent: var(--color-primary, #66b798);--tm-on-accent: var(--color-primary-content, #071a13);--tm-muted: color-mix(in srgb, var(--tm-fg) 64%, var(--tm-bg));--tm-brand: #0f766e;--tm-live: #ff6b6b;--tm-fg-4: color-mix(in srgb, var(--tm-fg) 4.5%, transparent);--tm-fg-5: color-mix(in srgb, var(--tm-fg) 5%, transparent);--tm-fg-6: color-mix(in srgb, var(--tm-fg) 6%, transparent);--tm-fg-7: color-mix(in srgb, var(--tm-fg) 7%, transparent);--tm-fg-8: color-mix(in srgb, var(--tm-fg) 8%, transparent);--tm-fg-10: color-mix(in srgb, var(--tm-fg) 10%, transparent);--tm-fg-12: color-mix(in srgb, var(--tm-fg) 12%, transparent);--tm-fg-14: color-mix(in srgb, var(--tm-fg) 14%, transparent);--tm-fg-16: color-mix(in srgb, var(--tm-fg) 16%, transparent);--tm-fg-18: color-mix(in srgb, var(--tm-fg) 18%, transparent);--tm-fg-45: color-mix(in srgb, var(--tm-fg) 45%, transparent);--tm-accent-7: color-mix(in srgb, var(--tm-accent) 7%, transparent);--tm-accent-8: color-mix(in srgb, var(--tm-accent) 8%, transparent);--tm-accent-12: color-mix(in srgb, var(--tm-accent) 12%, transparent);--tm-accent-14: color-mix(in srgb, var(--tm-accent) 14%, transparent);--tm-pop: color-mix(in srgb, var(--tm-fg) 3.5%, var(--tm-panel));position:relative;height:100%;width:100%;overflow:hidden;display:flex;flex-direction:column;background:var(--tm-bg);color:var(--tm-fg);font-family:system-ui, -apple-system, \"Segoe UI\", sans-serif;font-size:13px;-webkit-font-smoothing:antialiased;}.tend-media.svelte-1n46o8q * {box-sizing:border-box;}.tend-media.svelte-1n46o8q button {font-family:inherit;}.tend-media.svelte-1n46o8q button:focus-visible {outline:2px solid var(--tm-accent);outline-offset:2px;}.tend-media.svelte-1n46o8q .tm-pop {position:absolute;width:250px;padding:14px;border-radius:14px;z-index:5;background:var(--tm-pop);border:1px solid var(--tm-fg-10);box-shadow:0 20px 50px rgba(0, 0, 0, .5);}.toast.low.svelte-1n46o8q {bottom:20px;}.unsupported.svelte-1n46o8q {margin:auto;max-width:360px;text-align:center;padding:24px;font-size:13px;color:var(--tm-muted);}.unsupported.svelte-1n46o8q strong:where(.svelte-1n46o8q) {display:block;color:var(--tm-fg);font-size:15px;margin-bottom:6px;}.middle.svelte-1n46o8q {flex:1;min-height:0;display:flex;}main.svelte-1n46o8q {flex:1;min-width:0;overflow:auto;padding:26px 28px 28px;}.toast.svelte-1n46o8q {position:absolute;left:50%;bottom:96px;transform:translateX(-50%);padding:10px 16px;border-radius:10px;background:var(--tm-fg);color:var(--tm-bg);font-size:12.5px;font-weight:600;box-shadow:0 12px 30px rgba(0, 0, 0, .4);z-index:6;white-space:nowrap;max-width:calc(100% - 32px);overflow:hidden;text-overflow:ellipsis;}"
};
function js(e, t) {
	Ge(t, !0), Wr(e, As);
	let n = li(t, "narrow", 7, !1), r = new Xi(t.host), i = /* @__PURE__ */ j(void 0);
	ui(() => (r.start(), () => r.destroy())), fn(() => {
		r.tab, r.showSlug, r.bookId, V(i)?.scrollTo(0, 0);
	});
	function a(e) {
		n(e);
	}
	function o() {
		return r.destroy();
	}
	let s = (e) => e instanceof HTMLElement && (e.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.tagName));
	function c(e) {
		if (e.key === "Escape" && r.pop) {
			r.pop = null, e.stopPropagation();
			return;
		}
		if (s(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
		let t = e.target instanceof HTMLElement && e.target.closest("button,[role=slider]");
		e.key === " " && !t && (e.preventDefault(), r.toggle());
	}
	function l(e) {
		let t = e.target;
		r.pop && !t.closest(".tm-pop,[data-pop]") && (r.pop = null);
	}
	var u = {
		setNarrow: a,
		shutdown: o
	}, d = ks(), f = P(d), p = (e) => {
		W(e, Es());
	}, m = (e) => {
		Ts(e, { get store() {
			return r;
		} });
	}, h = (e) => {
		var t = Ds(), n = F(t);
		ta(n, { get store() {
			return r;
		} });
		var a = L(n, 2), o = P(a);
		fa(o, { get store() {
			return r;
		} });
		var s = L(o, 2), c = P(s), l = (e) => {
			go(e, { get store() {
				return r;
			} });
		}, u = /* @__PURE__ */ k(() => r.query.trim()), d = (e) => {
			Aa(e, { get store() {
				return r;
			} });
		}, f = (e) => {
			La(e, { get store() {
				return r;
			} });
		}, p = (e) => {
			Za(e, { get store() {
				return r;
			} });
		}, m = (e) => {
			so(e, { get store() {
				return r;
			} });
		};
		K(c, (e) => {
			V(u) ? e(l) : r.tab === "home" ? e(d, 1) : r.tab === "radio" ? e(f, 2) : r.tab === "pod" ? e(p, 3) : e(m, -1);
		}), D(s), ci(s, (e) => M(i, e), () => V(i)), Yo(L(s, 2), { get store() {
			return r;
		} }), D(a), ps(L(a, 2), { get store() {
			return r;
		} }), W(e, t);
	};
	K(f, (e) => {
		r.supported ? n() ? e(m, 1) : e(h, -1) : e(p);
	});
	var g = L(f, 2), _ = (e) => {
		var t = Os();
		let i;
		var a = I(t, !0);
		R(() => {
			i = J(t, 1, "toast svelte-1n46o8q", null, i, { low: n() }), G(a, r.toast);
		}), W(e, t);
	};
	return K(g, (e) => {
		r.toast && e(_);
	}), D(d), H("keydown", d, c), H("pointerdown", d, l), W(e, d), Ke(u);
}
pr(["keydown", "pointerdown"]);
//#endregion
//#region src/index.ts
var Ms = 640;
function Ns(e) {
	let t = null, n = null;
	async function r() {
		n?.disconnect(), n = null;
		let e = t;
		if (t = null, e) try {
			await e.shutdown();
		} finally {
			await Nr(e);
		}
	}
	return e.onUnmount?.(r), {
		mount(i) {
			let a = i.shadowRoot ?? i.attachShadow({ mode: "open" }), o = document.createElement("div");
			return o.style.cssText = "height:100%;width:100%", a.replaceChildren(o), i.style.display = i.style.display || "block", t = kr(js, {
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
export { Ms as NARROW_WIDTH, Ns as activate };
