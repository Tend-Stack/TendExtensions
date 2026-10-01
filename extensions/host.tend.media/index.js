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
var h = 1024, g = 2048, _ = 4096, v = 8192, y = 16384, ee = 32768, b = 1 << 25, x = 65536, te = 1 << 19, S = 1 << 20, ne = 1 << 25, re = 65536, ie = 1 << 21, ae = 1 << 22, oe = 1 << 23, se = Symbol("$state"), ce = Symbol("component"), le = Symbol("legacy props"), ue = Symbol(""), de = Symbol("attributes"), fe = Symbol("class"), pe = Symbol("style"), me = Symbol("text"), he = Symbol("form reset"), ge = new class extends Error {
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
function Te(e) {
	if (e === null) throw xe(), ve;
	return T = e;
}
function Ee() {
	return Te(/* @__PURE__ */ cn(T));
}
function E(e) {
	if (w) {
		if (/* @__PURE__ */ cn(T) !== null) throw xe(), ve;
		T = e;
	}
}
function De(e = 1) {
	if (w) {
		for (var t = e, n = T; t--;) n = /* @__PURE__ */ cn(n);
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
		var i = /* @__PURE__ */ cn(n);
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
var Ge = null;
function Ke(e) {
	Ge = e;
}
function qe(e, t = !1, n) {
	Ge = {
		p: Ge,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: R,
		l: null
	};
}
function Je(e) {
	var t = Ge, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) xn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, Ge = t.p, Ye(e);
}
function Ye(e = {}) {
	return i(e, ce, { value: !0 }), e;
}
function Xe() {
	return !0;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
var Ze = [];
function Qe() {
	var e = Ze;
	Ze = [], f(e);
}
function $e(e) {
	if (Ze.length === 0 && !kt) {
		var t = Ze;
		queueMicrotask(() => {
			t === Ze && Qe();
		});
	}
	Ze.push(e);
}
function et() {
	for (; Ze.length > 0;) Qe();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/status.js
var tt = ~(g | _ | h);
function nt(e, t) {
	e.f = e.f & tt | t;
}
function rt(e) {
	e.f & 512 || e.deps === null ? nt(e, h) : nt(e, _);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function it(e) {
	if (e !== null) for (let t of e) t.f & 2 && t.f & 65536 && (t.f ^= re, it(t.deps));
}
function at(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), it(e.deps), nt(e, h);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/store.js
var ot = !1;
function st(e) {
	var t = ot;
	try {
		return ot = !1, [e(), ot];
	} finally {
		ot = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/misc.js
var ct = !1;
function lt() {
	ct || (ct = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[he]?.();
		});
	}, { capture: !0 }));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function ut(e) {
	var t = L, n = R;
	Wn(null), Gn(null);
	try {
		return e();
	} finally {
		Wn(t), Gn(n);
	}
}
function dt(e, t, n, r = n) {
	e.addEventListener(t, () => ut(n));
	let i = e[he];
	e[he] = i ? () => {
		i(), r(!0);
	} : () => r(!0), lt();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/async.js
function ft(e, t, n, r) {
	let i = Xe() ? gt : yt;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = R, c = pt(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				mn(e, s);
			}
			mt();
		}
	}
	var d = ht();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ vt(e))).then(u).catch((e) => mn(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), mt();
	}) : f();
}
function pt() {
	var e = R, t = L, n = Ge, r = O;
	return function(i = !0) {
		Gn(e), Wn(t), Ke(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function mt(e = !0) {
	Gn(null), Wn(null), Ke(null), e && O?.deactivate();
}
function ht() {
	var e = R, t = e.b, n = O, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function gt(e) {
	var t = 2 | g;
	return R !== null && (R.f |= te), {
		ctx: Ge,
		deps: null,
		effects: null,
		equals: Ae,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: C,
		wv: 0,
		parent: R,
		ac: null
	};
}
var _t = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function vt(e, t, n) {
	let r = R;
	r === null && Pe();
	var i = void 0, a = Kt(C), o = !L, s = /* @__PURE__ */ new Set();
	return wn(() => {
		var t = R, n = p();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== ge && n.reject(e);
			}).finally(mt);
		} catch (e) {
			n.reject(e), mt();
		}
		var c = O;
		if (o) {
			if (t.f & 32768) var l = ht();
			if (r.b?.is_rendered()) c.async_deriveds.get(t)?.reject(_t);
			else for (let e of s.values()) e.reject(_t);
			s.add(n), c.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), s.delete(n), t !== _t && (c.activate(), t ? (a.f |= oe, Jt(a, t)) : (a.f & 8388608 && (a.f ^= oe), Jt(a, e)), c.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), yn(() => {
		for (let e of s) e.reject(_t);
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
function D(e) {
	let t = /* @__PURE__ */ gt(e);
	return qn(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function yt(e) {
	let t = /* @__PURE__ */ gt(e);
	return t.equals = Me, t;
}
function bt(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) jn(t[n]);
	}
}
function xt(e) {
	var t, n = R, r = e.parent;
	if (!Vn && r !== null && e.v !== C && r.f & 24576) return be(), e.v;
	Gn(r);
	try {
		e.f &= ~re, bt(e), t = ar(e);
	} finally {
		Gn(n);
	}
	return t;
}
function St(e) {
	var t = xt(e);
	if (!e.equals(t) && (e.wv = nr(), (!O?.is_fork || e.deps === null) && (O === null ? e.v = t : (O.capture(e, t, !0), Et?.capture(e, t, !0)), e.deps === null))) {
		nt(e, h);
		return;
	}
	Vn || (Dt === null ? rt(e) : (vn() || O?.is_fork) && Dt.set(e, t));
}
function Ct(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && ut(() => {
		t.ac.abort(ge), t.ac = null;
	}), t.fn !== null && (t.teardown = d), cr(t, 0), kn(t));
}
function wt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && lr(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var Tt = null, O = null, Et = null, Dt = null, Ot = null, kt = !1, At = !1, jt = null, Mt = null, Nt = 0, Pt = 1, Ft = class e {
	id = Pt++;
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
		Tt === null ? Tt = this : (Tt.#n = this, this.#t = Tt), Tt = this;
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
			for (var r of n.d) nt(r, g), t(r);
			for (r of n.m) nt(r, _), t(r);
		}
		this.#p.add(e);
	}
	#g() {
		this.#e = !0, Nt++ > 1e3 && (this.#x(), Lt());
		for (let e of this.#u) this.#d.delete(e), nt(e, g), this.schedule(e);
		for (let e of this.#d) nt(e, _), this.schedule(e);
		let t = this.#c;
		this.#c = [], this.apply();
		var n = jt = [], r = [], i = Mt = [];
		for (let e of t) try {
			this.#_(e, n, r);
		} catch (t) {
			throw Ht(e), this.#h() || this.discard(), t;
		}
		if (O = null, i.length > 0) {
			var a = e.ensure();
			for (let e of i) a.schedule(e);
		}
		if (jt = null, Mt = null, this.#h()) {
			this.#b(r), this.#b(n);
			for (let [e, t] of this.#f) Vt(e, t);
			i.length > 0 && O.#g();
			return;
		}
		let o = this.#v();
		if (o) {
			this.#b(r), this.#b(n), o.#y(this);
			return;
		}
		this.#u.clear(), this.#d.clear();
		for (let e of this.#r) e(this);
		this.#r.clear(), Et = this, zt(r), zt(n), Et = null, this.#s?.resolve();
		var s = O;
		if (this.#a === 0 && (this.#c.length === 0 || s !== null) && this.#x(), this.#c.length > 0) {
			if (s !== null) {
				let e = s;
				e.#c.push(...this.#c.filter((t) => !e.#c.includes(t)));
			} else s = this;
		}
		s !== null && (Wt.clear(), s.#g());
	}
	#_(e, t, n) {
		e.f ^= h;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= h : i & 4 ? t.push(r) : rr(r) && (i & 16 && this.#d.add(r), lr(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), nt(i, g), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#x(), O = this, this.#g();
	}
	#b(e) {
		for (var t = 0; t < e.length; t += 1) at(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== C && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), Dt?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		O = this;
	}
	deactivate() {
		O = null, Dt = null;
	}
	flush() {
		try {
			At = !0, O = this, this.#g();
		} finally {
			Nt = 0, Ot = null, jt = null, Mt = null, At = !1, O = null, Dt = null, Wt.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(_t);
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
		this.#m || (this.#m = !0, $e(() => {
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
		if (O === null) {
			let t = O = new e();
			!At && !kt && $e(() => {
				t.#e || t.flush();
			});
		}
		return O;
	}
	apply() {
		Dt = null;
	}
	schedule(e) {
		if (Ot = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		for (var t = e; t.parent !== null;) {
			t = t.parent;
			var n = t.f;
			if (jt !== null && t === R && (L === null || !(L.f & 2))) return;
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
			e === null || (e.#n = t), t === null ? Tt = e : t.#t = e, this.linked = !1;
		}
	}
};
function It(e) {
	var t = kt;
	kt = !0;
	try {
		var n;
		for (e && (O !== null && !O.is_fork && O.flush(), n = e());;) {
			if (et(), O === null) return n;
			O.flush();
		}
	} finally {
		kt = t;
	}
}
function Lt() {
	try {
		ze();
	} catch (e) {
		mn(e, Ot);
	}
}
var Rt = null;
function zt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && rr(r) && (Rt = /* @__PURE__ */ new Set(), lr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Nn(r), Rt?.size > 0)) {
				Wt.clear();
				for (let e of Rt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Rt.has(n) && (Rt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || lr(n);
					}
				}
				Rt.clear();
			}
		}
		Rt = null;
	}
}
function Bt(e) {
	O.schedule(e);
}
function Vt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), nt(e, h);
		for (var n = e.first; n !== null;) Vt(n, t), n = n.next;
	}
}
function Ht(e) {
	nt(e, h);
	for (var t = e.first; t !== null;) Ht(t), t = t.next;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
var Ut = /* @__PURE__ */ new Set(), Wt = /* @__PURE__ */ new Map(), Gt = !1;
function Kt(e, t) {
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
function k(e, t) {
	let n = Kt(e, t);
	return qn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function qt(e, t = !1, n = !0) {
	let r = Kt(e);
	return t || (r.equals = Me), r;
}
function A(e, t, n = !1) {
	return L !== null && (!Un || L.f & 131072) && Xe() && L.f & 4325394 && (Kn === null || !Kn.has(e)) && Ue(), Jt(e, n ? j(t) : t, Mt);
}
function Jt(e, t, n = null) {
	if (!e.equals(t)) {
		Vn ? Wt.set(e, t) : Wt.has(e) || Wt.set(e, e.v);
		var r = Ft.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && xt(t), Dt === null && rt(t);
		}
		e.wv = nr(), Zt(e, g, n), Xe() && R !== null && R.f & 1024 && !(R.f & 96) && (Xn === null ? Zn([e]) : Xn.push(e)), !r.is_fork && Ut.size > 0 && !Gt && Yt();
	}
	return t;
}
function Yt() {
	Gt = !1;
	for (let e of Ut) {
		e.f & 1024 && nt(e, _);
		let t;
		try {
			t = rr(e);
		} catch {
			t = !0;
		}
		t && lr(e);
	}
	Ut.clear();
}
function Xt(e) {
	A(e, e.v + 1);
}
function Zt(e, t, n) {
	var r = e.reactions;
	if (r !== null) for (var i = Xe(), a = r.length, o = 0; o < a; o++) {
		var s = r[o], c = s.f;
		if (i || s !== R) {
			var l = (c & g) === 0;
			if (l && nt(s, t), c & 131072) Ut.add(s);
			else if (c & 2) {
				var u = s;
				Dt?.delete(u), c & 65536 || (c & 512 && (R === null || !(R.f & 2097152)) && (s.f |= re), Zt(u, _, n));
			} else if (l) {
				var d = s;
				c & 16 && Rt !== null && Rt.add(d), n === null ? Bt(d) : n.push(d);
			}
		}
	}
}
function j(t) {
	if (typeof t != "object" || !t || se in t || ce in t) return t;
	let n = l(t);
	if (n !== s && n !== c) return t;
	var r = /* @__PURE__ */ new Map(), i = e(t), o = /* @__PURE__ */ k(0), u = null, d = er, f = (e) => {
		if (er === d) return e();
		var t = L, n = er;
		Wn(null), tr(d);
		var r = e();
		return Wn(t), tr(n), r;
	};
	return i && r.set("length", /* @__PURE__ */ k(t.length, u)), new Proxy(t, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && Ve();
			var i = r.get(t);
			return i === void 0 ? f(() => {
				var e = /* @__PURE__ */ k(n.value, u);
				return r.set(t, e), e;
			}) : A(i, n.value, !0), !0;
		},
		deleteProperty(e, t) {
			var n = r.get(t);
			if (n === void 0) {
				if (t in e) {
					let e = f(() => /* @__PURE__ */ k(C, u));
					r.set(t, e), Xt(o);
				}
			} else A(n, C), Xt(o);
			return !0;
		},
		get(e, n, i) {
			if (n === se) return t;
			var o = r.get(n), s = n in e;
			if (o === void 0 && (!s || a(e, n)?.writable) && (o = f(() => /* @__PURE__ */ k(j(s ? e[n] : C), u)), r.set(n, o)), o !== void 0) {
				var c = z(o);
				return c === C ? void 0 : c;
			}
			return Reflect.get(e, n, i);
		},
		getOwnPropertyDescriptor(e, t) {
			var n = Reflect.getOwnPropertyDescriptor(e, t);
			if (n && "value" in n) {
				var i = r.get(t);
				i && (n.value = z(i));
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
			return (n !== void 0 || R !== null && (!i || a(e, t)?.writable)) && (n === void 0 && (n = f(() => /* @__PURE__ */ k(i ? j(e[t]) : C, u)), r.set(t, n)), z(n) === C) ? !1 : i;
		},
		set(e, t, n, s) {
			var c = r.get(t), l = t in e;
			if (i && t === "length") for (var d = n; d < c.v; d += 1) {
				var p = r.get(d + "");
				p === void 0 ? d in e && (p = f(() => /* @__PURE__ */ k(C, u)), r.set(d + "", p)) : A(p, C);
			}
			if (c === void 0) (!l || a(e, t)?.writable) && (c = f(() => /* @__PURE__ */ k(void 0, u)), A(c, j(n)), r.set(t, c));
			else {
				l = c.v !== C;
				var m = f(() => j(n));
				A(c, m);
			}
			var h = Reflect.getOwnPropertyDescriptor(e, t);
			if (h?.set && h.set.call(s, n), !l) {
				if (i && typeof t == "string") {
					var g = r.get("length"), _ = Number(t);
					Number.isInteger(_) && _ >= g.v && A(g, _ + 1);
				}
				Xt(o);
			}
			return !0;
		},
		ownKeys(e) {
			z(o);
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
function Qt(e) {
	try {
		if (typeof e == "object" && e && se in e) return e[se];
	} catch {}
	return e;
}
function $t(e, t) {
	return Object.is(Qt(e), Qt(t));
}
var en, tn, nn, rn;
function an() {
	if (en === void 0) {
		en = window, tn = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		nn = a(t, "firstChild").get, rn = a(t, "nextSibling").get, u(e) && (e[fe] = void 0, e[de] = null, e[pe] = void 0, e.__e = void 0), u(n) && (n[me] = void 0);
	}
}
function on(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function sn(e) {
	return nn.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function cn(e) {
	return rn.call(e);
}
function M(e, t) {
	if (!w) return /* @__PURE__ */ sn(e);
	var n = /* @__PURE__ */ sn(T);
	if (n === null) n = T.appendChild(on());
	else if (t && n.nodeType !== 3) {
		var r = on();
		return n?.before(r), Te(r), r;
	}
	return t && fn(n), Te(n), n;
}
function N(e, t = !1) {
	if (!w) {
		var n = /* @__PURE__ */ sn(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ cn(n) : n;
	}
	if (t) {
		if (T?.nodeType !== 3) {
			var r = on();
			return T?.before(r), Te(r), r;
		}
		fn(T);
	}
	return T;
}
function P(e, t = !1) {
	if (!w) return /* @__PURE__ */ sn(e);
	var n = M(e, t);
	return E(e), n;
}
function F(e, t = 1, n = !1) {
	let r = w ? T : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ cn(r);
	if (!w) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = on();
			return r === null ? i?.after(a) : r.before(a), Te(a), a;
		}
		fn(r);
	}
	return Te(r), r;
}
function ln(e) {
	e.textContent = "";
}
function un() {
	return !1;
}
function dn(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function fn(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
function pn(e) {
	var t = R;
	if (t === null) return L.f |= oe, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	mn(e, t);
}
function mn(e, t) {
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
function hn(e) {
	R === null && (L === null && Re(e), Le()), Vn && Ie(e);
}
function gn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function _n(e, t) {
	var n = R;
	n !== null && n.f & 8192 && (e |= v);
	var r = {
		ctx: Ge,
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
	O?.register_created_effect(r);
	var i = r;
	if (e & 4) jt === null ? Ft.ensure().schedule(r) : jt.push(r);
	else if (t !== null) {
		try {
			lr(r);
		} catch (e) {
			throw jn(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= x));
	}
	if (i !== null && (i.parent = n, n !== null && gn(i, n), L !== null && L.f & 2 && !(e & 64))) {
		var a = L;
		(a.effects ??= []).push(i);
	}
	return r;
}
function vn() {
	return L !== null && !Un;
}
function yn(e) {
	let t = _n(8, null);
	return nt(t, h), t.teardown = e, t;
}
function bn(e) {
	hn("$effect");
	var t = R.f;
	if (!L && t & 32 && Ge !== null && !Ge.i) {
		var n = Ge;
		(n.e ??= []).push(e);
	} else return xn(e);
}
function xn(e) {
	return _n(4 | S, e);
}
function Sn(e) {
	Ft.ensure();
	let t = _n(64 | te, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Pn(t, () => {
			jn(t), n(void 0);
		}) : (jn(t), n(void 0));
	});
}
function Cn(e) {
	return _n(4, e);
}
function wn(e) {
	return _n(ae | te, e);
}
function Tn(e, t = 0) {
	return _n(8 | t, e);
}
function I(e, t = [], n = [], r = []) {
	ft(r, t, n, (t) => {
		_n(8, () => {
			e(...t.map(z));
		});
	});
}
function En(e, t = 0) {
	return _n(16 | t, e);
}
function Dn(e) {
	return _n(32 | te, e);
}
function On(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = Vn, r = L;
		Hn(!0), Wn(null);
		try {
			t.call(null);
		} catch (t) {
			mn(t, e.parent);
		} finally {
			Hn(n), Wn(r);
		}
	}
}
function kn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && ut(() => {
			e.abort(ge);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : jn(n, t), n = r;
	}
}
function An(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || jn(t), t = n;
	}
}
function jn(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Mn(e.nodes.start, e.nodes.end), n = !0), e.f |= b, kn(e, t && !n), cr(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	On(e), e.f ^= b, e.f |= y;
	var i = e.parent;
	i !== null && i.first !== null && Nn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Mn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ cn(e);
		e.remove(), e = n;
	}
}
function Nn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Pn(e, t, n = !0) {
	var r = [];
	e.f |= 256, Fn(e, r, !0);
	var i = () => {
		n && jn(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Fn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= v;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				Fn(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function In(e) {
	e.f &= -257, Ln(e, !0);
}
function Ln(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= v, e.f & 1024 || (nt(e, g), Ft.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			Ln(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function Rn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ cn(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var zn = null, Bn = !1, Vn = !1;
function Hn(e) {
	Vn = e;
}
var L = null, Un = !1;
function Wn(e) {
	L = e;
}
var R = null;
function Gn(e) {
	R = e;
}
var Kn = null;
function qn(e) {
	L !== null && (Kn ??= /* @__PURE__ */ new Set()).add(e);
}
var Jn = null, Yn = 0, Xn = null;
function Zn(e) {
	Xn = e;
}
var Qn = 1, $n = 0, er = $n;
function tr(e) {
	er = e;
}
function nr() {
	return ++Qn;
}
function rr(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 2 && (e.f &= ~re), t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (rr(a) && St(a), a.wv > e.wv) return !0;
		}
		t & 512 && Dt === null && nt(e, h);
	}
	return !1;
}
function ir(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(Kn !== null && Kn.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? ir(a, t, !1) : t === a && (n ? nt(a, g) : a.f & 1024 && nt(a, _), Bt(a));
	}
}
function ar(e) {
	var t = Jn, n = Yn, r = Xn, i = L, a = Kn, o = Ge, s = Un, c = er, l = e.f;
	Jn = null, Yn = 0, Xn = null, L = l & 96 ? null : e, Kn = null, Ke(e.ctx), Un = !1, er = ++$n, e.ac !== null && (ut(() => {
		e.ac.abort(ge);
	}), e.ac = null);
	try {
		e.f |= ie;
		var u = e.fn, d = u();
		e.f |= ee;
		var f = or(e);
		if (Xe() && Xn !== null && !Un && f !== null && !(e.f & 6146)) for (var p = 0; p < Xn.length; p++) ir(Xn[p], e);
		if (i !== null && i !== e) {
			if ($n++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = $n;
			if (t !== null) for (let e of t) e.rv = $n;
			Xn !== null && (r === null ? r = Xn : r.push(...Xn));
		}
		return e.f & 8388608 && (e.f ^= oe), d;
	} catch (t) {
		return or(e), pn(t);
	} finally {
		e.f ^= ie, Jn = t, Yn = n, Xn = r, L = i, Kn = a, Ke(o), Un = s, er = c;
	}
}
function or(e) {
	var t = e.deps, n = O?.is_fork;
	if (Jn !== null) {
		var r;
		if (n || cr(e, Yn), t !== null && Yn > 0) for (t.length = Yn + Jn.length, r = 0; r < Jn.length; r++) t[Yn + r] = Jn[r];
		else e.deps = t = Jn;
		if (vn() && e.f & 512) for (r = Yn; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && Yn < t.length && (cr(e, Yn), t.length = Yn);
	return t;
}
function sr(e, r) {
	let i = r.reactions;
	if (i !== null) {
		var a = t.call(i, e);
		if (a !== -1) {
			var o = i.length - 1;
			o === 0 ? i = r.reactions = null : (i[a] = i[o], i.pop());
		}
	}
	if (i === null && r.f & 2 && (Jn === null || !n.call(Jn, r))) {
		var s = r;
		s.f & 512 && (s.f ^= 512, s.f &= ~re), s.v !== C && rt(s), s.ac !== null && ut(() => {
			s.ac.abort(ge), s.ac = null, nt(s, g);
		}), Ct(s), cr(s, 0);
	}
}
function cr(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) sr(e, n[r]);
}
function lr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		nt(e, h);
		var n = R, r = Bn;
		R = e, Bn = !(t & 96);
		try {
			t & 16777232 ? An(e) : kn(e), On(e);
			var i = ar(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = Qn;
		} finally {
			Bn = r, R = n;
		}
	}
}
async function ur() {
	await Promise.resolve(), It();
}
function z(e) {
	var t = !!(e.f & 2);
	if (zn?.add(e), L !== null && !Un && !(R !== null && R.f & 16384) && (Kn === null || !Kn.has(e))) {
		var r = L.deps;
		if (L.f & 2097152) e.rv < $n && (e.rv = $n, Jn === null && r !== null && r[Yn] === e ? Yn++ : Jn === null ? Jn = [e] : Jn.push(e));
		else {
			L.deps ??= [], n.call(L.deps, e) || L.deps.push(e);
			var i = e.reactions;
			i === null ? e.reactions = [L] : n.call(i, L) || i.push(L);
		}
	}
	if (Vn && Wt.has(e)) return Wt.get(e);
	if (t) {
		var a = e;
		if (Vn) {
			var o = a.v;
			return (!(a.f & 1024) && a.reactions !== null || fr(a)) && (o = xt(a)), Wt.set(a, o), o;
		}
		var s = !(a.f & 512) && !Un && L !== null && (Bn || !!(L.f & 512)), c = (a.f & ee) === 0;
		rr(a) && (s && (a.f |= 512), St(a)), s && !c && (wt(a), dr(a));
	}
	if (Dt?.has(e)) return Dt.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function dr(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (wt(t), dr(t));
}
function fr(e) {
	if (e.v === C) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Wt.has(t) || t.f & 2 && fr(t)) return !0;
	return !1;
}
function pr(e) {
	var t = Un;
	try {
		return Un = !0, e();
	} finally {
		Un = t;
	}
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var mr = ["touchstart", "touchmove"];
function hr(e) {
	return mr.includes(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dev/css.js
var gr = Symbol("events"), _r = /* @__PURE__ */ new Set(), vr = /* @__PURE__ */ new Set();
function yr(e) {
	if (!w) return;
	e.removeAttribute("onload"), e.removeAttribute("onerror");
	let t = e.__e;
	t !== void 0 && (e.__e = void 0, queueMicrotask(() => {
		e.isConnected && e.dispatchEvent(t);
	}));
}
function br(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || Tr.call(t, e), !e.cancelBubble) return ut(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? $e(() => {
		t.addEventListener(e, i, r);
	}) : t.addEventListener(e, i, r), i;
}
function xr(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = br(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && yn(() => {
		t.removeEventListener(e, o, a);
	});
}
function B(e, t, n) {
	(t[gr] ??= {})[e] = n;
}
function Sr(e) {
	for (var t = 0; t < e.length; t++) _r.add(e[t]);
	for (var n of vr) n(e);
}
var Cr = null, wr = !1;
function Tr(e) {
	var t = this, n = t.ownerDocument, r = e.type, a = e.composedPath?.() || [], o = a[0] || e.target;
	Cr = e, wr || (wr = !0, setTimeout(() => {
		wr = !1, Cr = null;
	}));
	var s = 0, c = Cr === e && e[gr];
	if (c) {
		var l = a.indexOf(c);
		if (l !== -1 && (t === document || t === window)) {
			e[gr] = t;
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
		var d = L, f = R;
		Wn(null), Gn(null);
		try {
			for (var p, m = []; o !== null && o !== t;) {
				try {
					var h = o[gr]?.[r];
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
			e[gr] = t, delete e.currentTarget, Wn(d), Gn(f);
		}
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/reconciler.js
var Er = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function Dr(e) {
	return Er?.createHTML(e) ?? e;
}
function Or(e) {
	var t = dn("template");
	return t.innerHTML = Dr(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
function kr(e, t) {
	var n = R;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function V(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i, a = !e.startsWith("<!>");
	return () => {
		if (w) return kr(T, null), T;
		i === void 0 && (i = Or(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ sn(i)));
		var t = r || tn ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ sn(t), s = t.lastChild;
			kr(o, s);
		} else kr(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Ar(e, t, n = "svg") {
	var r = !e.startsWith("<!>"), i = !!(t & 1), a = `<${n}>${r ? e : "<!>" + e}</${n}>`, o;
	return () => {
		if (w) return kr(T, null), T;
		if (!o) {
			var e = /* @__PURE__ */ sn(Or(a));
			if (i) for (o = document.createDocumentFragment(); /* @__PURE__ */ sn(e);) o.appendChild(/* @__PURE__ */ sn(e));
			else o = /* @__PURE__ */ sn(e);
		}
		var t = o.cloneNode(!0);
		if (i) {
			var n = /* @__PURE__ */ sn(t), r = t.lastChild;
			kr(n, r);
		} else kr(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function jr(e, t) {
	return /* @__PURE__ */ Ar(e, t, "svg");
}
function Mr(e = "") {
	if (!w) {
		var t = on(e + "");
		return kr(t, t), t;
	}
	var n = T;
	return n.nodeType === 3 ? fn(n) : (n.before(n = on()), Te(n)), kr(n, n), n;
}
function Nr() {
	if (w) return kr(T, null), T;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = on();
	return e.append(t, n), kr(t, n), e;
}
function H(e, t) {
	if (w) {
		var n = R;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = T), Ee();
		return;
	}
	e !== null && e.before(t);
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function Pr(e) {
	let t = 0, n = Kt(0), r;
	return () => {
		vn() && (z(n), Tn(() => (t === 0 && (r = pr(() => e(() => Xt(n)))), t += 1, () => {
			$e(() => {
				--t, t === 0 && (r?.(), r = void 0, Xt(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var Fr = x | te;
function Ir(e, t, n, r) {
	new Lr(e, t, n, r);
}
var Lr = class {
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
	#h = Pr(() => (this.#m = Kt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = R;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = R.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = En(() => {
			if (w) {
				let e = this.#t;
				Ee();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, Fr), w && (this.#e = T);
	}
	#g() {
		try {
			this.#a = Dn(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		$e(r), t && (this.#s = Dn(() => {
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
			t = !0, n && We(), this.#s !== null && Pn(this.#s, () => {
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
					mn(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = Dn(() => e(this.#e)), $e(() => {
			var e = this.#c = document.createDocumentFragment(), t = on(), n = !1;
			if (e.append(t), this.#a = this.#S(() => {
				try {
					return Dn(() => this.#r(t));
				} catch (e) {
					try {
						this.error(e), n = !0;
					} catch (e) {
						mn(e, this.#i.parent);
					}
					return null;
				}
			}), this.#a === null) {
				this.#c = null, n && this.#x(O);
				return;
			}
			this.#u === 0 && (this.#e.before(e), this.#c = null, Pn(this.#o, () => {
				this.#o = null;
			}), this.#x(O));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = Dn(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				Rn(this.#a, e);
				let t = this.#n.pending;
				this.#o = Dn(() => t(this.#e));
			} else this.#x(O);
		} catch (e) {
			this.error(e);
		}
	}
	#x(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		at(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#S(e) {
		var t = R, n = L, r = Ge;
		Gn(this.#i), Wn(this.#i), Ke(this.#i.ctx);
		try {
			return Ft.ensure(), e();
		} finally {
			Gn(t), Wn(n), Ke(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && Pn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, $e(() => {
			this.#d = !1, this.#m && Jt(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), z(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		O?.is_fork ? (this.#a && O.skip_effect(this.#a), this.#o && O.skip_effect(this.#o), this.#s && O.skip_effect(this.#s), O.oncommit(() => {
			this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (jn(this.#a), null), this.#o &&= (jn(this.#o), null), this.#s &&= (jn(this.#s), null), w && (Te(this.#t), De(), Te(Oe()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return Dn(() => {
						var r = R;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return mn(e, this.#i.parent), null;
				}
			}));
		};
		$e(() => {
			var t;
			try {
				t = this.transform_error(e);
			} catch (e) {
				mn(e, this.#i && this.#i.parent);
				return;
			}
			typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => mn(e, this.#i && this.#i.parent)) : n(t);
		});
	}
};
function U(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[me] ??= e.nodeValue) && (e[me] = n, e.nodeValue = `${n}`);
}
function Rr(e, t) {
	return Br(e, t);
}
var zr = /* @__PURE__ */ new Map();
function Br(e, { target: t, anchor: n, props: i = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	an();
	var l = void 0, u = Sn(() => {
		var s = n ?? t.appendChild(on());
		Ir(s, { pending: () => {} }, (t) => {
			qe({});
			var n = Ge;
			if (o && (n.c = o), a && (i.$$events = a), w && kr(t, null), l = e(t, i) || Ye(), w && (R.nodes.end = T, T === null || T.nodeType !== 8 || T.data !== "]")) throw xe(), ve;
			Je();
		}, c);
		var u = /* @__PURE__ */ new Set(), d = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!u.has(r)) {
					u.add(r);
					var i = hr(r);
					for (let e of [t, document]) {
						var a = zr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), zr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Tr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return d(r(_r)), vr.add(d), () => {
			for (var e of u) for (let n of [t, document]) {
				var r = zr.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, Tr), r.delete(e), r.size === 0 && zr.delete(n)) : r.set(e, i);
			}
			vr.delete(d), s !== n && s.parentNode?.removeChild(s);
		};
	});
	return Vr.set(l, u), l;
}
var Vr = /* @__PURE__ */ new WeakMap();
function Hr(e, t) {
	let n = Vr.get(e);
	return n ? (Vr.delete(e), n(t)) : Promise.resolve();
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/branches.js
var Ur = class {
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
			if (n) In(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (In(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (jn(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						Rn(r, t), t.append(on()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else jn(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Pn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (jn(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = O, r = un();
		if (t && !this.#t.has(e) && !this.#n.has(e)) {
			if (r) {
				var i = document.createDocumentFragment(), a = on();
				i.append(a), this.#n.set(e, {
					effect: Dn(() => t(a)),
					fragment: i
				});
			} else this.#t.set(e, Dn(() => t(this.anchor)));
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
function W(e, t, n = !1) {
	var r;
	w && (r = T, Ee());
	var i = new Ur(e), a = n ? x : 0;
	function o(e, t) {
		if (w) {
			var n = ke(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Oe();
				Te(a), i.anchor = a, we(!1), i.ensure(e, t), we(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	En(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/each.js
function Wr(e, t) {
	return t;
}
function Gr(e, t, n) {
	for (var i = [], a = t.length, o, s = t.length, c = 0; c < a; c++) {
		let n = t[c];
		Pn(n, () => {
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
			ln(d), d.append(u), e.items.clear();
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
		r?.has(a) ? (a.f |= ne, Rn(a, document.createDocumentFragment())) : jn(t[i], n);
	}
}
var qr;
function G(t, n, i, a, o, s = null) {
	var c = t, l = /* @__PURE__ */ new Map();
	if (n & 4) {
		var u = t;
		c = w ? Te(/* @__PURE__ */ sn(u)) : u.appendChild(on());
	}
	w && Ee();
	var d = null, f = /* @__PURE__ */ yt(() => {
		var t = i();
		return e(t) ? t : t == null ? [] : r(t);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, Yr(v, p, c, n, a), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= ne, Zr(d, null, c)) : In(d) : Pn(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: En(() => {
			p = z(f);
			var e = p.length;
			let t = !1;
			w && ke(c) === "[!" != (e === 0) && (c = Oe(), Te(c), we(!1), t = !0);
			for (var r = /* @__PURE__ */ new Set(), u = O, v = un(), y = 0; y < e; y += 1) {
				w && T.nodeType === 8 && T.data === "]" && (c = T, t = !0, we(!1));
				var ee = p[y], b = a(ee, y), x = h ? null : l.get(b);
				x ? (x.v && Jt(x.v, ee), x.i && Jt(x.i, y), v && u.unskip_effect(x.e)) : (x = Xr(l, h ? c : qr ??= on(), ee, b, y, o, n, i), h || (x.e.f |= ne), l.set(b, x)), r.add(b);
			}
			if (e === 0 && s && !d && (h ? d = Dn(() => s(c)) : (d = Dn(() => s(qr ??= on())), d.f |= ne)), e > r.size && Fe("", "", ""), w && e > 0 && Te(Oe()), !h) {
				if (m.set(u, r), v) {
					for (let [e, t] of l) r.has(e) || u.skip_effect(t.e);
					u.oncommit(g), u.ondiscard(_);
				} else g(u);
			}
			t && we(!0), z(f);
		}),
		flags: n,
		items: l,
		pending: m,
		outrogroups: null,
		fallback: d
	};
	h = !1, w && (c = T);
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
		if (_.f & 8192 && (In(_), o && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) {
			if (_.f ^= ne, _ === l) Zr(_, null, n);
			else {
				var y = d ? d.next : l;
				_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), Qr(e, d, _), Qr(e, _, y), Zr(_, y, n), d = _, p = [], m = [], l = Jr(d.next);
				continue;
			}
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var ee = m[0], b;
					d = ee.prev;
					var x = p[0], te = p[p.length - 1];
					for (b = 0; b < p.length; b += 1) Zr(p[b], ee, n);
					for (b = 0; b < m.length; b += 1) u.delete(m[b]);
					Qr(e, x.prev, te.next), Qr(e, d, x), Qr(e, te, ee), l = ee, d = te, --v, p = [], m = [];
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
		var S = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || S.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && S.push(l), l = Jr(l.next);
		var re = S.length;
		if (re > 0) {
			var ie = i & 4 && s === 0 ? n : null;
			if (o) {
				for (v = 0; v < re; v += 1) S[v].nodes?.a?.measure();
				for (v = 0; v < re; v += 1) S[v].nodes?.a?.fix();
			}
			Gr(e, S, ie);
		}
	}
	o && $e(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function Xr(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Kt(n) : /* @__PURE__ */ qt(n, !1, !1) : null, l = o & 2 ? Kt(i) : null;
	return {
		v: c,
		i: l,
		e: Dn(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function Zr(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ cn(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function Qr(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/css.js
function K(e, t) {
	Cn(() => {
		e = R?.parent?.nodes?.start ?? e;
		var n = e.getRootNode(), r = n.host ? n : n.head ?? n.ownerDocument.head;
		if (!r.querySelector("#" + t.hash)) {
			let e = dn("style");
			e.id = t.hash, e.textContent = t.code, r.appendChild(e);
		}
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
function q(e, t, n, r, i, a) {
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
function ii(e, t = {}, n, r) {
	for (var i in n) {
		var a = n[i];
		t[i] !== a && (n[i] == null ? e.style.removeProperty(i) : e.style.setProperty(i, a, r));
	}
}
function ai(e, t, n, r) {
	var i = e[pe];
	if (w || i !== t) {
		var a = ri(t, r);
		(!w || a !== e.getAttribute("style")) && (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[pe] = t;
	} else r && (Array.isArray(r) ? (ii(e, n?.[0], r[0]), ii(e, n?.[1], r[1], "important")) : ii(e, n, r));
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function oi(e, t) {
	t ? e.hasAttribute("selected") || e.setAttribute("selected", "") : e.removeAttribute("selected");
}
function si(t, n) {
	var r = t.__defaultValue, i = t.multiple, a = i ? r ?? [] : null;
	if (!i || e(a)) {
		var o = t.selectedIndex, s = n && i ? new Set(t.selectedOptions) : null;
		for (var c of t.options) {
			var l = di(c);
			oi(c, i ? a.includes(l) : $t(l, r));
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
function ci(t, n, r = !1) {
	if (t.multiple) {
		if (n == null) return;
		if (!e(n)) return Se();
		for (var i of t.options) i.selected = n.includes(di(i));
		return;
	}
	for (i of t.options) if ($t(di(i), n)) {
		i.selected = !0;
		return;
	}
	(!r || n !== void 0) && (t.selectedIndex = -1);
}
function li(e) {
	var t = new MutationObserver((t) => {
		t.every(fi) || ("__defaultValue" in e && si(e, !1), "__value" in e && ci(e, e.__value));
	});
	t.observe(e, {
		childList: !0,
		subtree: !0,
		attributes: !0,
		attributeFilter: ["value"]
	}), yn(() => {
		t.disconnect();
	});
}
function ui(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet(), i = !0;
	dt(e, "change", (t) => {
		var i = t ? "[selected]" : ":checked", a;
		if (e.multiple) a = [].map.call(e.querySelectorAll(i), di);
		else {
			var o = e.querySelector(i) ?? e.querySelector("option:not([disabled])");
			a = o && di(o);
		}
		n(a), e.__value = a, O !== null && r.add(O);
	}), Cn(() => {
		var a = t();
		if (e === document.activeElement) {
			var o = O;
			if (r.has(o)) return;
		}
		if (ci(e, a, i), i && a === void 0) {
			var s = e.querySelector(":checked");
			s !== null && (a = di(s), n(a));
		}
		e.__value = a, i = !1;
	});
}
function di(e) {
	return "__value" in e ? e.__value : e.value;
}
function fi(e) {
	if (e.target.closest("selectedcontent") !== null) return !0;
	if (e.type === "childList") {
		var t = [...e.addedNodes, ...e.removedNodes];
		return t.length > 0 && t.every((e) => e.nodeName === "SELECTEDCONTENT");
	}
	return !1;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attributes.js
var pi = Symbol("is custom element"), mi = Symbol("is html"), hi = _e ? "link" : "LINK", gi = _e ? "progress" : "PROGRESS";
function _i(e) {
	if (w) {
		var t = !1, n = () => {
			if (!t) {
				if (t = !0, e.hasAttribute("value")) {
					var n = e.value;
					J(e, "value", null), e.value = n;
				}
				if (e.hasAttribute("checked")) {
					var r = e.checked;
					J(e, "checked", null), e.checked = r;
				}
			}
		};
		e[he] = n, $e(n), lt();
	}
}
function vi(e, t) {
	var n = bi(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === gi) && (e.value = t ?? "");
}
function yi(e, t) {
	var n = bi(e);
	n.checked !== (n.checked = t ?? void 0) && (e.checked = t);
}
function J(e, t, n, r) {
	var i = bi(e);
	w && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === hi) || i[t] !== (i[t] = n) && (t === "loading" && (e[ue] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && Si(e).has(t) ? e[t] = n : e.setAttribute(t, n));
}
function bi(e) {
	return e[de] ??= {
		[pi]: e.nodeName.includes("-"),
		[mi]: e.namespaceURI === ye
	};
}
var xi = /* @__PURE__ */ new Map();
function Si(e) {
	var t = e.getAttribute("is") || e.nodeName, n = xi.get(t);
	if (n) return n;
	xi.set(t, n = /* @__PURE__ */ new Set());
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var s in r = o(i), r) r[s].set && s !== "innerHTML" && s !== "textContent" && s !== "innerText" && n.add(s);
		i = l(i);
	}
	return n;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function Ci(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet();
	dt(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = wi(e) ? Ti(a) : a, n(a), O !== null && r.add(O), await ur(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (w && e.defaultValue !== e.value || pr(t) == null && e.value) && (n(wi(e) ? Ti(e.value) : e.value), O !== null && r.add(O)), Tn(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = O;
			if (r.has(i)) return;
		}
		wi(e) && n === Ti(e.value) || (e.type !== "date" || n || e.value) && n !== e.value && (e.value = n ?? "");
	});
}
function wi(e) {
	var t = e.type;
	return t === "number" || t === "range";
}
function Ti(e) {
	return e === "" ? null : +e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function Ei(e, t) {
	return e === t || e?.[se] === t;
}
function Di(e = Ye(), t, n, r) {
	var i = Ge.r, a = R;
	return Cn(() => {
		var o, s;
		return Tn(() => {
			o = s, s = r?.() || [], pr(() => {
				Ei(n(...s), e) || (t(e, ...s), o && Ei(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && Ei(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function Y(e, t, n, r) {
	var i = !0, o = !!(n & 8), s = !!(n & 16), c = r, l = !0, u = void 0, d = () => s && i ? (u ??= /* @__PURE__ */ gt(r), z(u)) : (l && (l = !1, c = s ? pr(r) : r), c);
	let f;
	if (o) {
		var p = se in e || le in e;
		f = a(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	o ? [m, h] = st(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && Be(t), f(m)));
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
	var v = !1, y = (n & 1 ? gt : yt)(() => (v = !1, g()));
	o && z(y);
	var ee = R;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? z(y) : i && o ? j(e) : e;
			return A(y, n), v = !0, c !== void 0 && (c = n), e;
		}
		return Vn && v || ee.f & 16384 ? y.v : z(y);
	});
}
function Oi(e) {
	Ge === null && Ne("onMount"), bn(() => {
		let t = pr(e);
		if (typeof t == "function") return t;
	});
}
//#endregion
//#region node_modules/svelte/src/internal/disclose-version.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
//#endregion
//#region src/catalog.ts
var ki = {
	podcast: "Podcast",
	book: "Audiobook",
	radio: "Radio"
}, X = (e) => e.type !== "radio", Ai = (e) => e.type === "podcast" ? `show:${e.show}` : e.id, ji = [
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
], Mi = (e) => ji[e] ?? String(e + 1), Ni = (e) => {
	let t = 0;
	for (let n of e) t = t * 31 + n.charCodeAt(0) >>> 0;
	return t % 360;
}, Pi = (e) => {
	let t = e.replace(/^(the|a|an|el|la|los|las|o|os|as)\s+/i, "").split(/[\s:·\-–—]+/).filter((e) => /[\p{L}\p{N}]/u.test(e));
	return (t.length > 1 ? t[0][0] + t[1][0] : (t[0] ?? "?").slice(0, 2)).toUpperCase();
}, Z = (e) => typeof e == "string" ? e : "", Fi = (e) => typeof e == "number" && Number.isFinite(e) ? e : 0, Ii = (e) => {
	let t = Z(e);
	return t.startsWith("https://") ? t : "";
}, Li = (e) => Array.isArray(e) ? e.filter((e) => !!e && typeof e == "object") : [], Ri = (e, t = /* @__PURE__ */ new Date()) => {
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
function zi(e) {
	let t = Z(e.id), n = Z(e.name), r = Ii(e.stream_url);
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
		hue: Ni(t),
		mark: Pi(n),
		art: Ii(e.logo_url) || void 0
	};
}
function Bi(e) {
	let t = Z(e.slug), n = Z(e.title);
	return !t || !n ? null : {
		slug: t,
		id: Z(e.id),
		title: n,
		author: Z(e.author),
		desc: Z(e.description),
		art: Ii(e.image_url) || void 0,
		hue: Ni(t),
		mark: Pi(n),
		category: Z(e.category),
		episodes: Fi(e.episode_count)
	};
}
function Vi(e, t) {
	let n = Z(e.id), r = Ii(e.audio_url), i = Z(e.title);
	return !n || !r || !i ? null : {
		id: `ep:${n}`,
		type: "podcast",
		show: t.slug,
		slug: Z(e.slug),
		title: i,
		sub: t.title,
		url: r,
		dur: Fi(e.duration),
		date: Z(e.published_at),
		desc: Z(e.description),
		chapters: [],
		hue: t.hue,
		mark: t.mark,
		art: Ii(e.image_url) || t.art
	};
}
function Hi(e) {
	let t = Z(e.slug), n = Z(e.title);
	if (!t || !n) return null;
	let r = 0, i = Li(e.chapters).flatMap((e) => {
		let t = Ii(e.audio_url);
		if (!t) return [];
		let n = {
			start: r,
			title: Z(e.title) || `Chapter ${Fi(e.section)}`,
			dur: Fi(e.duration),
			url: t,
			section: Fi(e.section)
		};
		return r += n.dur ?? 0, [n];
	}), a = i.length && i.every((e) => e.dur) ? r : Fi(e.duration), o = Z(e.authors);
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
		hue: Ni(t),
		mark: Pi(n),
		art: Ii(e.cover_url) || void 0
	};
}
var Ui = (e) => Li(e.lines).map((e) => ({
	t: Fi(e.start),
	who: Z(e.speaker),
	text: Z(e.text)
})).filter((e) => e.text), Wi = (e) => e && typeof e == "object" ? e : {}, Gi = (e, t) => Li(Wi(e)[t]), Ki = class {
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
}, qi = (e) => `linear-gradient(145deg, oklch(0.6 0.1 ${e}), oklch(0.32 0.06 ${e}))`, Ji = (e) => {
	let t = Math.max(0, Math.round(e)), n = Math.floor(t / 3600), r = Math.floor(t % 3600 / 60), i = t % 60;
	return n ? `${n}:${String(r).padStart(2, "0")}:${String(i).padStart(2, "0")}` : `${r}:${String(i).padStart(2, "0")}`;
}, Yi = (e) => {
	let t = Math.max(0, e), n = Math.floor(t / 3600), r = Math.round(t % 3600 / 60);
	return n ? `${n}h ${r}m` : `${r} min`;
}, Xi = (e = /* @__PURE__ */ new Date()) => {
	let t = e.getHours();
	return t < 5 ? "Good evening" : t < 12 ? "Good morning" : t < 18 ? "Good afternoon" : "Good evening";
}, Zi = (e, t = Date.now()) => {
	let n = e ? Date.parse(e) : NaN;
	if (Number.isNaN(n)) return "";
	let r = Math.round((t - n) / 6e4);
	return r < 1 ? "just now" : r < 60 ? `${r} min ago` : r < 1440 ? `${Math.round(r / 60)} h ago` : new Date(n).toLocaleDateString();
}, Qi = (e, t, n) => (e ?? []).reduce((e, r, i) => n(r) <= t ? i : e, e?.length ? 0 : -1), $i = (e, t) => Qi(e, t, (e) => e.start), ea = (e, t) => [t, ...e.filter((e) => e !== t)], ta = (e, t) => [...e.filter((e) => e !== t), t], na = (e, t) => e.filter((e) => e !== t), ra = (e, t) => {
	let n = Math.max(0, $i(e, t));
	return {
		index: n,
		offset: Math.max(0, t - (e[n]?.start ?? 0))
	};
}, ia = (e, t) => Object.fromEntries(Object.entries(e).sort((e, t) => t[1].at - e[1].at).slice(0, t)), aa = (e, t) => {
	let n = $i(e, t);
	return n < 0 ? 0 : t - e[n].start > 3 ? e[n].start : e[n - 1]?.start ?? 0;
};
function oa(e, t, n = 1, r = n * e.speed) {
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
var sa = (e, t, n) => Math.max(0, e - t) / n, ca = (e) => typeof e == "number" && e < 60 ? Math.max(0, e / 60) : 1, la = (e) => `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`;
function ua(e, t, n, r, i = 120) {
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
var da = (e) => (e?.radio ?? 0) + (e?.podcast ?? 0) + (e?.book ?? 0);
function fa(e, t = /* @__PURE__ */ new Date()) {
	let n = [], r = {
		radio: 0,
		podcast: 0,
		book: 0
	};
	for (let i = 6; i >= 0; i--) {
		let a = new Date(t.getFullYear(), t.getMonth(), t.getDate() - i), o = la(a), s = e[o];
		n.push({
			key: o,
			label: a.toLocaleDateString(void 0, { weekday: "short" }),
			seconds: da(s)
		});
		for (let e of [
			"radio",
			"podcast",
			"book"
		]) r[e] += s?.[e] ?? 0;
	}
	let i = 0;
	for (let n = 0; n < 366; n++) if (da(e[la(new Date(t.getFullYear(), t.getMonth(), t.getDate() - n))]) >= 60) i++;
	else if (n > 0 || i > 0) break;
	return {
		days: n,
		byKind: r,
		total: r.radio + r.podcast + r.book,
		streak: i
	};
}
var pa = (e, t, n, r = 60) => [{
	id: t,
	at: n
}, ...e.filter((e) => e.id !== t)].slice(0, r);
function ma(e, t, n) {
	let r = e.filter((e) => e !== t);
	if (r.length === e.length) return e;
	let i = Math.max(0, Math.min(r.length, n));
	return [
		...r.slice(0, i),
		t,
		...r.slice(i)
	];
}
var ha = (e) => e < 3e4 ? 0 : e < 3e5 ? 3 : e < 36e5 ? 10 : 20, ga = [
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
], _a = {
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
}, va = {
	back: 15,
	fwd: 30,
	smartRewind: !0,
	continuous: !0
}, ya = [
	5,
	10,
	15,
	30
], ba = [
	10,
	15,
	30,
	45,
	60
], xa = [
	.8,
	1,
	1.1,
	1.2,
	1.4,
	1.6,
	1.8,
	2
], Sa = [
	5,
	15,
	30,
	45,
	60,
	90
], Ca = 200, wa = class {
	#e = /* @__PURE__ */ k(j({}));
	get items() {
		return z(this.#e);
	}
	set items(e) {
		A(this.#e, e, !0);
	}
	#t = /* @__PURE__ */ k(j({}));
	get shows() {
		return z(this.#t);
	}
	set shows(e) {
		A(this.#t, e, !0);
	}
	#n = /* @__PURE__ */ k(j({}));
	get showEpisodes() {
		return z(this.#n);
	}
	set showEpisodes(e) {
		A(this.#n, e, !0);
	}
	#r = /* @__PURE__ */ k(j([]));
	get trending() {
		return z(this.#r);
	}
	set trending(e) {
		A(this.#r, e, !0);
	}
	#i = /* @__PURE__ */ k("idle");
	get radioStatus() {
		return z(this.#i);
	}
	set radioStatus(e) {
		A(this.#i, e, !0);
	}
	#a = /* @__PURE__ */ k(j({
		slugs: [],
		cursor: null,
		status: "idle"
	}));
	get podcastBrowse() {
		return z(this.#a);
	}
	set podcastBrowse(e) {
		A(this.#a, e, !0);
	}
	#o = /* @__PURE__ */ k(j({
		ids: [],
		cursor: null,
		status: "idle"
	}));
	get bookBrowse() {
		return z(this.#o);
	}
	set bookBrowse(e) {
		A(this.#o, e, !0);
	}
	#s = /* @__PURE__ */ k(j([]));
	get newEpisodes() {
		return z(this.#s);
	}
	set newEpisodes(e) {
		A(this.#s, e, !0);
	}
	#c = /* @__PURE__ */ k("idle");
	get newStatus() {
		return z(this.#c);
	}
	set newStatus(e) {
		A(this.#c, e, !0);
	}
	#l = /* @__PURE__ */ k(j({}));
	get bookStatus() {
		return z(this.#l);
	}
	set bookStatus(e) {
		A(this.#l, e, !0);
	}
	#u = /* @__PURE__ */ k(j({}));
	get transcripts() {
		return z(this.#u);
	}
	set transcripts(e) {
		A(this.#u, e, !0);
	}
	#d = /* @__PURE__ */ k(j({
		q: "",
		hits: [],
		status: "idle"
	}));
	get search() {
		return z(this.#d);
	}
	set search(e) {
		A(this.#d, e, !0);
	}
	#f = /* @__PURE__ */ k(j({
		ids: [],
		page: 0,
		more: !1,
		total: 0,
		status: "idle"
	}));
	get stationHits() {
		return z(this.#f);
	}
	set stationHits(e) {
		A(this.#f, e, !0);
	}
	#p = /* @__PURE__ */ k(j({}));
	get radioLists() {
		return z(this.#p);
	}
	set radioLists(e) {
		A(this.#p, e, !0);
	}
	#m = /* @__PURE__ */ k(j({}));
	get nowPlaying() {
		return z(this.#m);
	}
	set nowPlaying(e) {
		A(this.#m, e, !0);
	}
	supported = !0;
	#h = /* @__PURE__ */ k("home");
	get tab() {
		return z(this.#h);
	}
	set tab(e) {
		A(this.#h, e, !0);
	}
	#g = /* @__PURE__ */ k(null);
	get showSlug() {
		return z(this.#g);
	}
	set showSlug(e) {
		A(this.#g, e, !0);
	}
	#_ = /* @__PURE__ */ k(null);
	get bookId() {
		return z(this.#_);
	}
	set bookId(e) {
		A(this.#_, e, !0);
	}
	#v = /* @__PURE__ */ k("All");
	get genre() {
		return z(this.#v);
	}
	set genre(e) {
		A(this.#v, e, !0);
	}
	#y = /* @__PURE__ */ k("");
	get query() {
		return z(this.#y);
	}
	set query(e) {
		A(this.#y, e, !0);
	}
	#b = /* @__PURE__ */ k("onair");
	get rtab() {
		return z(this.#b);
	}
	set rtab(e) {
		A(this.#b, e, !0);
	}
	#x = /* @__PURE__ */ k(null);
	get pop() {
		return z(this.#x);
	}
	set pop(e) {
		A(this.#x, e, !0);
	}
	#S = /* @__PURE__ */ k(!1);
	get shortcuts() {
		return z(this.#S);
	}
	set shortcuts(e) {
		A(this.#S, e, !0);
	}
	#C = /* @__PURE__ */ k("all");
	get libKind() {
		return z(this.#C);
	}
	set libKind(e) {
		A(this.#C, e, !0);
	}
	#w = /* @__PURE__ */ k("recent");
	get libSort() {
		return z(this.#w);
	}
	set libSort(e) {
		A(this.#w, e, !0);
	}
	#T = /* @__PURE__ */ k("");
	get libQuery() {
		return z(this.#T);
	}
	set libQuery(e) {
		A(this.#T, e, !0);
	}
	#E = /* @__PURE__ */ k(null);
	get toast() {
		return z(this.#E);
	}
	set toast(e) {
		A(this.#E, e, !0);
	}
	#D = /* @__PURE__ */ k(null);
	get now() {
		return z(this.#D);
	}
	set now(e) {
		A(this.#D, e, !0);
	}
	#O = /* @__PURE__ */ k(0);
	get pos() {
		return z(this.#O);
	}
	set pos(e) {
		A(this.#O, e, !0);
	}
	#k = /* @__PURE__ */ k(!1);
	get playing() {
		return z(this.#k);
	}
	set playing(e) {
		A(this.#k, e, !0);
	}
	#A = /* @__PURE__ */ k(!1);
	get buffering() {
		return z(this.#A);
	}
	set buffering(e) {
		A(this.#A, e, !0);
	}
	#j = /* @__PURE__ */ k(!1);
	get loadingItem() {
		return z(this.#j);
	}
	set loadingItem(e) {
		A(this.#j, e, !0);
	}
	#M = /* @__PURE__ */ k(1);
	get speed() {
		return z(this.#M);
	}
	set speed(e) {
		A(this.#M, e, !0);
	}
	#N = /* @__PURE__ */ k(j({}));
	get speeds() {
		return z(this.#N);
	}
	set speeds(e) {
		A(this.#N, e, !0);
	}
	#P = /* @__PURE__ */ k(j([]));
	get queue() {
		return z(this.#P);
	}
	set queue(e) {
		A(this.#P, e, !0);
	}
	#F = /* @__PURE__ */ k(j({}));
	get progress() {
		return z(this.#F);
	}
	set progress(e) {
		A(this.#F, e, !0);
	}
	#I = /* @__PURE__ */ k(j({}));
	get played() {
		return z(this.#I);
	}
	set played(e) {
		A(this.#I, e, !0);
	}
	#L = /* @__PURE__ */ k(j({}));
	get subscribed() {
		return z(this.#L);
	}
	set subscribed(e) {
		A(this.#L, e, !0);
	}
	#R = /* @__PURE__ */ k(j({}));
	get bookmarks() {
		return z(this.#R);
	}
	set bookmarks(e) {
		A(this.#R, e, !0);
	}
	#z = /* @__PURE__ */ k(j([]));
	get recentStations() {
		return z(this.#z);
	}
	set recentStations(e) {
		A(this.#z, e, !0);
	}
	#B = /* @__PURE__ */ k(j({}));
	get favorites() {
		return z(this.#B);
	}
	set favorites(e) {
		A(this.#B, e, !0);
	}
	#V = /* @__PURE__ */ k(j({}));
	get saved() {
		return z(this.#V);
	}
	set saved(e) {
		A(this.#V, e, !0);
	}
	#H = /* @__PURE__ */ k(j({}));
	get addedAt() {
		return z(this.#H);
	}
	set addedAt(e) {
		A(this.#H, e, !0);
	}
	#U = /* @__PURE__ */ k(j([]));
	get history() {
		return z(this.#U);
	}
	set history(e) {
		A(this.#U, e, !0);
	}
	#W = /* @__PURE__ */ k(j({}));
	get stats() {
		return z(this.#W);
	}
	set stats(e) {
		A(this.#W, e, !0);
	}
	#G = /* @__PURE__ */ k(j({ ...va }));
	get prefs() {
		return z(this.#G);
	}
	set prefs(e) {
		A(this.#G, e, !0);
	}
	#K = /* @__PURE__ */ k(null);
	get sleep() {
		return z(this.#K);
	}
	set sleep(e) {
		A(this.#K, e, !0);
	}
	#q = /* @__PURE__ */ k(.8);
	get volume() {
		return z(this.#q);
	}
	set volume(e) {
		A(this.#q, e, !0);
	}
	#J = /* @__PURE__ */ k(!1);
	get muted() {
		return z(this.#J);
	}
	set muted(e) {
		A(this.#J, e, !0);
	}
	#Y = /* @__PURE__ */ k(!1);
	get restored() {
		return z(this.#Y);
	}
	set restored(e) {
		A(this.#Y, e, !0);
	}
	host;
	api;
	storageKey;
	engine = new Ki();
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
		return $i(this.chapters, this.pos);
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
		return e ? Qi(e.lines, this.pos, (e) => e.t) : -1;
	}
	get kindLabel() {
		let e = this.item;
		return e ? e.type === "radio" ? "● LIVE RADIO" : ki[e.type].toUpperCase() : "";
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
		return e ? _a[e.type] : ["queue"];
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
		return fa(this.stats);
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
		this.queue = ma(this.queue, e, t), this.scheduleSave();
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
		return t && X(t) && (t.dur || this.progress[e]?.dur) || 0;
	}
	speedFor(e) {
		let t = this.items[e];
		return !t || t.type === "radio" ? 1 : this.speeds[Ai(t)] ?? 1;
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
		return n ? Yi(n) : "";
	}
	leftOf(e) {
		let t = this.items[e], n = this.progressOf(e), r = this.durOf(e);
		return t ? t.type === "radio" ? "Live now" : this.isDone(e) ? "Played" : r ? n > 5 ? `${Yi((r - n) / this.speedFor(e))} left` : Yi(r) : n > 5 ? `${Ji(n)} in` : "" : "";
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
				let e = Gi(await this.api.stations.trending(30), "stations").map(zi).filter((e) => !!e);
				this.remember(e), this.trending = e.map((e) => e.id), this.radioStatus = "ready";
			} catch {
				this.radioStatus = "error";
			}
		}
	}
	async loadStations(e = this.genre, t = !1) {
		let n = this.api, r = ga.find((t) => t.label === e), i = this.radioLists[e];
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
			let e = [], i = o.page + 1, s = null, c = !1, l = (e) => Gi(e, "stations").map(zi).filter((e) => !!e);
			if (!r.slugs.length) {
				if (n.stations.browse) {
					let r = Wi(await n.stations.browse(t ? o.cursor ?? void 0 : void 0));
					e = l(r), s = typeof r.next_cursor == "string" && r.next_cursor ? r.next_cursor : null, c = !!s;
				} else e = l(await n.stations.trending(30));
			} else if (n.stations.genre) {
				let t = await Promise.all(r.slugs.map((e) => n.stations.genre(e, i).catch(() => null)));
				if (t.every((e) => e === null)) throw Error("genre unavailable");
				let a = t.map(l);
				for (let t = 0; a.some((e) => t < e.length); t++) for (let n of a) n[t] && e.push(n[t]);
				c = t.some((e) => Wi(e).has_more === !0);
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
				let n = Wi(await this.api.podcasts.get(e, t)), r = Bi(Wi(n.podcast));
				if (!r) throw Error("missing show");
				let i = Gi(n, "episodes").map((e) => Vi(e, r)).filter((e) => !!e);
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
						hasNext: Wi(n.pagination).has_next === !0,
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
				let t = Wi(await this.api.podcasts.list({
					sort: "last-episode",
					limit: 24,
					cursor: e ? this.podcastBrowse.cursor ?? void 0 : void 0
				})), n = Gi(t, "podcasts").map(Bi).filter((e) => !!e);
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
				let t = Wi(await this.api.audiobooks.list({
					limit: 24,
					cursor: e ? this.bookBrowse.cursor ?? void 0 : void 0
				})), n = Gi(t, "audiobooks").map(Hi).filter((e) => !!e);
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
			let t = Hi(Wi(Wi(await this.api.audiobooks.get(n)).audiobook));
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
				let i = Wi(n), a = Ui(i).map((e) => ({
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
			let t = Wi(await this.api.stations.nowPlaying(e.stationId)), n = (e) => {
				let t = typeof e.title == "string" && e.title !== "Live broadcast" ? e.title : "", n = typeof e.artwork_url == "string" && e.artwork_url.startsWith("https://") ? e.artwork_url : void 0;
				return {
					title: t,
					artist: typeof e.artist == "string" ? e.artist : "",
					art: n,
					at: typeof e.played_at == "string" ? e.played_at : void 0
				};
			}, r = Gi(t, "recent").map(n).filter((e) => e.title), i = this.nowPlaying[e.stationId], a = {
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
				let e = Gi(await this.api.search(t, "all"), "results");
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
				let t = Wi(await r.stations.search(e, 20, i.page + 1));
				if (n !== this.searchSeq) return;
				let a = Gi(t, "stations").map(zi).filter((e) => !!e);
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
			let t = zi(Wi(await this.api?.stations.get(e.id)));
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
		e && e.type !== "radio" && (this.progress = ia({
			...this.progress,
			[e.id]: {
				pos: Math.round(this.pos),
				dur: this.durOf(e.id),
				at: Date.now()
			}
		}, Ca));
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
		this.pos = X(n) && n.dur && r >= n.dur - 5 ? 0 : r, this.queue = na(this.queue, e), this.speed = this.speedFor(e), n.type === "radio" && (this.recentStations = [e, ...this.recentStations.filter((t) => t !== e)].slice(0, 6)), _a[n.type].includes(this.rtab) || (this.rtab = _a[n.type][0]), this.history = pa(this.history, e, Date.now()), this.playing = !0, this.sync(!0), n.type === "radio" && this.refreshNowPlaying(), this.rtab === "trans" && this.loadTranscript(), this.scheduleSave();
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
			else if (X(e) && this.prefs.smartRewind && this.pausedAt) {
				let e = ha(Date.now() - this.pausedAt);
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
		e && X(e) && this.seekTo(aa(e.chapters, this.pos));
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
				let { index: n, offset: r } = ra(t.chapters, e), i = t.chapters[n];
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
				let t = $i(e.chapters, this.pos + 1), n = e.chapters[t + 1];
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
			}, this.pos = this.durOf(e.id) || this.pos, this.prefs.continuous ? this.next() : (this.saveCurrent(), this.playing = !1, this.sync());
		}
	}
	tick(e = 1) {
		if (!this.playing || this.buffering) return;
		let t = this.item;
		if (!t) return;
		let n;
		X(t) && this.engine.active && (n = (t.type === "book" ? t.chapters[ra(t.chapters, this.pos).index]?.start ?? 0 : 0) + this.engine.time - this.pos, (n < 0 || n > 10) && (n = 0)), t.type === "podcast" && !t.dur && this.engine.duration && (this.items = {
			...this.items,
			[t.id]: {
				...t,
				dur: Math.round(this.engine.duration)
			}
		});
		let r = X(t) ? this.durOf(t.id) || 2 ** 53 - 1 : 0, i = oa({
			pos: this.pos,
			speed: this.speed,
			sleep: this.sleep
		}, X(t) ? {
			dur: r,
			chapters: t.type === "book" ? [] : t.chapters
		} : null, e, n);
		this.pos = i.ended ? this.pos : i.pos, this.sleep = i.sleep, this.playing = i.playing, i.reason === "timer" && this.say("Sleep timer ended. Sweet dreams."), i.reason === "chapter" && this.say("Sleep timer: paused at end of chapter"), this.sync(), this.playing && (this.stats = ua(this.stats, la(/* @__PURE__ */ new Date()), t.type, e)), Date.now() - this.lastSaved > 1e4 && (this.lastSaved = Date.now(), X(t) && this.saveCurrent(), this.scheduleSave());
	}
	playNext(e) {
		this.queue = ea(this.queue, e), this.say(`Playing next: ${this.items[e]?.title ?? ""}`), this.scheduleSave();
	}
	addToQueue(e) {
		this.queue = ta(this.queue, e), this.say("Added to queue"), this.scheduleSave();
	}
	removeFromQueue(e) {
		this.queue = na(this.queue, e), this.scheduleSave();
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
			[Ai(t)]: e
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
			n ? `- **Clip:** ${Ji(i)}–${Ji(r)}` : `- **Heard at:** ${c.toLocaleString()}`,
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
			}), this.say(e.type === "radio" ? `Clipped “${l}” to TEND Notes` : `Clip ${Ji(i)}–${Ji(r)} saved to TEND Notes`);
		} catch {
			this.say("Install TEND Notes to save clips");
		}
	}
	bookmark(e = this.bookId ?? "") {
		let t = this.items[e], n = t?.type === "book" ? t : null;
		if (!n) return;
		let r = this.progressOf(n.id), i = $i(n.chapters, r), a = i >= 0 ? `Chapter ${Mi(i)} · ${Ji(r - n.chapters[i].start)}` : Ji(r);
		this.bookmarks = {
			...this.bookmarks,
			[n.id]: [{
				pos: Math.round(r),
				at: Date.now(),
				label: a
			}, ...this.bookmarks[n.id] ?? []].slice(0, 50)
		}, this.say(`Bookmark saved at ${a}`), this.scheduleSave();
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
					let { index: e, offset: n } = ra(t.chapters, this.pos), r = t.chapters[e];
					r?.url ? this.engine.load(r.url, n) : this.loadedId = null;
				}
			}
			this.engine.apply({
				playing: this.playing,
				rate: this.live ? 1 : this.speed,
				volume: this.muted ? 0 : this.volume * ca(this.sleep)
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
			album: `TEND Media · ${ki[n.type]}`,
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
			prefs: this.prefs
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
			}, this.progress = t.progress ?? {}, this.played = t.played ?? {}, this.subscribed = t.subscribed ?? {}, this.bookmarks = t.bookmarks ?? {}, this.speeds = t.speeds ?? {}, this.recentStations = (t.recentStations ?? []).filter((e) => this.items[e]), this.queue = (t.queue ?? []).filter((e) => this.items[e]), this.volume = typeof t.volume == "number" ? t.volume : .8, this.favorites = t.favorites ?? {}, this.saved = t.saved ?? {}, this.items = {
				...this.favorites,
				...this.saved,
				...this.items
			}, this.history = (t.history ?? []).filter((e) => this.items[e.id]), this.stats = t.stats ?? {}, this.addedAt = t.addedAt ?? {}, this.prefs = {
				...va,
				...t.prefs ?? {}
			}, t.now && this.items[t.now] && (this.now = t.now, this.pos = t.pos ?? 0, this.speed = this.speedFor(t.now));
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
	book: "M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h10",
	heart: "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z",
	library: "M5 4v16M9 4v16M13 5l4 15M4 20h16",
	gear: "M12 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6zM19 12l2-1-1-3-2 .3-1.3-1.3.3-2-3-1-1 2h-2l-1-2-3 1 .3 2L6 7.3l-2-.3-1 3 2 1v2l-2 1 1 3 2-.3 1.3 1.3-.3 2 3 1 1-2h2l1 2 3-1-.3-2 1.3-1.3 2 .3 1-3-2-1z",
	keyboard: "M3 7h18v10H3zM7 11h.01M11 11h.01M15 11h.01M8 14h8",
	grip: "M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01",
	up: "M6 15l6-6 6 6",
	down: "M6 9l6 6 6-6",
	clock: "M12 4a8 8 0 1 0 0 16a8 8 0 1 0 0-16zM12 8v4l3 2",
	flame: "M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3-1-5 1-8.5z"
}, Ta = /* @__PURE__ */ jr("<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path></path></svg>"), Ea = /* @__PURE__ */ jr("<svg viewBox=\"0 0 24 24\" fill=\"currentColor\" aria-hidden=\"true\"><path></path></svg>");
function $(e, t) {
	let n = Y(t, "size", 3, 16), r = Y(t, "stroke", 3, 0);
	var i = Nr(), a = N(i), o = (e) => {
		var i = Ta(), a = P(i);
		I(() => {
			J(i, "width", n()), J(i, "height", n()), J(i, "stroke-width", r()), J(a, "d", t.d);
		}), H(e, i);
	}, s = (e) => {
		var r = Ea(), i = P(r);
		I(() => {
			J(r, "width", n()), J(r, "height", n()), J(i, "d", t.d);
		}), H(e, r);
	};
	W(a, (e) => {
		r() ? e(o) : e(s, -1);
	}), H(e, i);
}
//#endregion
//#region src/components/TopBar.svelte
var Da = /* @__PURE__ */ V("<header class=\"bar svelte-1h259us\"><span class=\"by svelte-1h259us\">Powered by OndaCast</span> <div class=\"spacer svelte-1h259us\"></div> <label class=\"search svelte-1h259us\"><!> <input type=\"search\" placeholder=\"Search stations, shows, books\" aria-label=\"Search stations, shows and books\" class=\"svelte-1h259us\"/></label> <button class=\"gear svelte-1h259us\" data-pop=\"\" aria-haspopup=\"dialog\" aria-label=\"Playback preferences\" title=\"Playback preferences\"><!></button></header>"), Oa = {
	hash: "svelte-1h259us",
	code: ".bar.svelte-1h259us {height:36px;flex:none;display:flex;align-items:center;gap:10px;padding:0 14px;background:var(--tm-panel);border-bottom:1px solid var(--tm-fg-6);}.by.svelte-1h259us {font-size:11px;color:var(--tm-muted);}.spacer.svelte-1h259us {flex:1;}.gear.svelte-1h259us {width:26px;height:26px;border:0;border-radius:7px;background:none;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;}.gear.svelte-1h259us:hover, .gear[aria-expanded='true'].svelte-1h259us {background:var(--tm-fg-8);color:var(--tm-fg);}.search.svelte-1h259us {display:flex;align-items:center;gap:8px;height:24px;padding:0 10px;border-radius:7px;background:var(--tm-fg-6);width:220px;box-sizing:border-box;color:var(--tm-muted);}.search.svelte-1h259us:focus-within {box-shadow:0 0 0 1px var(--tm-accent);}input.svelte-1h259us {flex:1;min-width:0;border:0;background:none;outline:none;color:var(--tm-fg);font:inherit;font-size:11.5px;padding:0;}input.svelte-1h259us::placeholder {color:var(--tm-muted);opacity:1;}input.svelte-1h259us::-webkit-search-cancel-button {display:none;}"
};
function ka(e, t) {
	qe(t, !0), K(e, Oa);
	var n = Da(), r = F(M(n), 4), i = M(r);
	$(i, {
		get d() {
			return Q.search;
		},
		size: 13,
		stroke: 2
	});
	var a = F(i, 2);
	_i(a), E(r);
	var o = F(r, 2);
	$(M(o), {
		get d() {
			return Q.gear;
		},
		size: 15,
		stroke: 1.6
	}), E(o), E(n), I(() => {
		vi(a, t.store.query), J(o, "aria-expanded", t.store.pop === "prefs");
	}), B("input", a, (e) => t.store.setQuery(e.currentTarget.value)), B("keydown", a, (e) => {
		e.key === "Escape" && t.store.setQuery("");
	}), B("click", o, () => t.store.togglePop("prefs")), H(e, n), Je();
}
Sr([
	"input",
	"keydown",
	"click"
]);
//#endregion
//#region src/components/Cover.svelte
var Aa = /* @__PURE__ */ V("<img alt=\"\" loading=\"lazy\" decoding=\"async\" referrerpolicy=\"no-referrer\" class=\"svelte-2fjyqn\"/>"), ja = /* @__PURE__ */ V("<div><!></div>"), Ma = {
	hash: "svelte-2fjyqn",
	code: ".cover.svelte-2fjyqn {flex:none;display:grid;place-items:center;overflow:hidden;font-family:ui-monospace, Menlo, monospace;font-weight:600;color:rgba(255, 255, 255, .75);}.cover.fill.svelte-2fjyqn {flex:1;}img.svelte-2fjyqn {width:100%;height:100%;object-fit:cover;display:block;}"
};
function Na(e, t) {
	qe(t, !0), K(e, Ma);
	let n = Y(t, "radius", 3, 8), r = Y(t, "mark", 3, ""), i = Y(t, "font", 3, 11), a = Y(t, "fill", 3, !1), o = /* @__PURE__ */ k(!1);
	bn(() => {
		t.art, A(o, !1);
	});
	var s = ja();
	let c, l;
	var u = M(s), d = (e) => {
		var n = Aa();
		I(() => J(n, "src", t.art)), xr("error", n, () => A(o, !0)), yr(n), H(e, n);
	}, f = (e) => {
		var t = Mr();
		I(() => U(t, r())), H(e, t);
	};
	W(u, (e) => {
		t.art && !z(o) ? e(d) : e(f, -1);
	}), E(s), I((e) => {
		c = q(s, 1, "cover svelte-2fjyqn", null, c, { fill: a() }), l = ai(s, "", l, {
			width: a() ? "100%" : `${t.size}px`,
			height: a() ? "100%" : `${t.size}px`,
			"border-radius": `${n() ?? ""}px`,
			background: e,
			"font-size": `${i() ?? ""}px`
		});
	}, [() => qi(t.hue)]), H(e, s), Je();
}
//#endregion
//#region src/components/Sidebar.svelte
var Pa = /* @__PURE__ */ V("<span class=\"count svelte-181dlmc\"> </span>"), Fa = /* @__PURE__ */ V("<button><!><span class=\"label svelte-181dlmc\"> </span> <!></button>"), Ia = /* @__PURE__ */ V("<span class=\"eq svelte-181dlmc\" aria-hidden=\"true\"><i class=\"svelte-181dlmc\"></i><i class=\"svelte-181dlmc\"></i><i class=\"svelte-181dlmc\"></i></span>"), La = /* @__PURE__ */ V("<button><!> <span class=\"title svelte-181dlmc\"> </span> <!></button>"), Ra = /* @__PURE__ */ V("<div class=\"heading svelte-181dlmc\">Favorite stations</div> <!>", 1), za = /* @__PURE__ */ V("<nav class=\"side svelte-181dlmc\" aria-label=\"TEND Media\"><!> <!> <div class=\"spacer svelte-181dlmc\"></div> <button class=\"keys svelte-181dlmc\"><!>Keyboard shortcuts<kbd class=\"svelte-181dlmc\">?</kbd></button></nav>"), Ba = {
	hash: "svelte-181dlmc",
	code: ".side.svelte-181dlmc {width:188px;flex:none;padding:18px 12px;display:flex;flex-direction:column;gap:2px;border-right:1px solid var(--tm-fg-6);box-sizing:border-box;overflow:auto;}.tab.svelte-181dlmc {display:flex;align-items:center;gap:11px;height:36px;flex:none;padding:0 10px;border:0;border-radius:9px;background:transparent;color:var(--tm-fg);font-size:13px;font-weight:500;cursor:pointer;text-align:left;}.tab.svelte-181dlmc:hover {background:var(--tm-fg-6);}.tab.on.svelte-181dlmc {background:var(--tm-accent-12);color:var(--tm-accent);}.heading.svelte-181dlmc {margin:22px 10px 8px;font-size:10.5px;letter-spacing:1px;text-transform:uppercase;color:var(--tm-muted);}.show.svelte-181dlmc {display:flex;align-items:center;gap:10px;padding:6px 10px;font-size:12.5px;color:var(--tm-fg);border:0;border-radius:8px;background:none;cursor:pointer;text-align:left;}.show.svelte-181dlmc:hover {background:var(--tm-fg-4);}.show.on.svelte-181dlmc {background:var(--tm-fg-6);}.title.svelte-181dlmc {flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.label.svelte-181dlmc {flex:1;}.count.svelte-181dlmc {font-size:10px;font-weight:700;min-width:18px;height:18px;padding:0 5px;border-radius:9px;display:grid;place-items:center;background:var(--tm-accent);color:var(--tm-on-accent);}.eq.svelte-181dlmc {display:flex;align-items:flex-end;gap:2px;height:12px;flex:none;}.eq.svelte-181dlmc i:where(.svelte-181dlmc) {width:3px;background:var(--tm-accent);border-radius:1px; animation: svelte-181dlmc-eq 1s ease-in-out infinite;}.eq.svelte-181dlmc i:where(.svelte-181dlmc):nth-child(2) {animation-delay:-.3s;}.eq.svelte-181dlmc i:where(.svelte-181dlmc):nth-child(3) {animation-delay:-.6s;}\n  @keyframes svelte-181dlmc-eq { 0%, 100% { height: 4px; } 50% { height: 12px; } }\n  @media (prefers-reduced-motion: reduce) {.eq.svelte-181dlmc i:where(.svelte-181dlmc) { animation: none;height:8px;} }.keys.svelte-181dlmc {display:flex;align-items:center;gap:8px;padding:8px 10px;border:0;border-radius:9px;background:none;color:var(--tm-muted);font-size:11.5px;cursor:pointer;text-align:left;}.keys.svelte-181dlmc:hover {background:var(--tm-fg-6);color:var(--tm-fg);}kbd.svelte-181dlmc {margin-left:auto;font:600 10px ui-monospace, Menlo, monospace;padding:1px 6px;border-radius:4px;border:1px solid var(--tm-fg-16);}.spacer.svelte-181dlmc {flex:1;min-height:12px;}"
};
function Va(e, t) {
	qe(t, !0), K(e, Ba);
	let n = Y(t, "store", 7), r = [
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
	], i = /* @__PURE__ */ D(() => Object.values(n().favorites).sort((e, t) => n().lastPlayed(t.id) - n().lastPlayed(e.id)).slice(0, 6)), a = /* @__PURE__ */ D(() => Object.keys(n().subscribed).reduce((e, t) => e + n().newCount(t), 0));
	var o = za(), s = M(o);
	G(s, 17, () => r, Wr, (e, t) => {
		var r = /* @__PURE__ */ D(() => m(z(t), 3));
		let i = () => z(r)[0], o = () => z(r)[1], s = () => z(r)[2];
		var c = Fa();
		let l;
		var u = M(c);
		$(u, {
			get d() {
				return s();
			},
			size: 17,
			stroke: 1.7
		});
		var d = F(u), f = P(d, !0), p = F(d, 2), h = (e) => {
			var t = Pa(), n = P(t, !0);
			I(() => {
				J(t, "aria-label", `${z(a) ?? ""} new episodes`), U(n, z(a));
			}), H(e, t);
		};
		W(p, (e) => {
			i() === "mine" && z(a) && e(h);
		}), E(c), I(() => {
			l = q(c, 1, "tab svelte-181dlmc", null, l, { on: n().tab === i() && !n().query }), J(c, "aria-current", n().tab === i() && !n().query ? "page" : void 0), U(f, o());
		}), B("click", c, () => {
			n().tab = i(), n().setQuery(""), i() === "pod" && (n().showSlug = null), i() === "book" && (n().bookId = null);
		}), H(e, c);
	});
	var c = F(s, 2), l = (e) => {
		var t = Ra();
		G(F(N(t), 2), 17, () => z(i), (e) => e.id, (e, t) => {
			let r = /* @__PURE__ */ D(() => n().isPlaying(z(t).id));
			var i = La();
			let a;
			var o = M(i);
			Na(o, {
				get hue() {
					return z(t).hue;
				},
				get art() {
					return z(t).art;
				},
				size: 26,
				radius: 6,
				font: 9,
				get mark() {
					return z(t).mark;
				}
			});
			var s = F(o, 2), c = P(s, !0), l = F(s, 2), u = (e) => {
				H(e, Ia());
			};
			W(l, (e) => {
				z(r) && e(u);
			}), E(i), I(() => {
				a = q(i, 1, "show svelte-181dlmc", null, a, { on: z(t).id === n().now }), J(i, "aria-label", `${z(r) ? "Stop" : "Play"} ${z(t).title ?? ""}`), U(c, z(t).title);
			}), B("click", i, () => z(r) ? n().stop() : n().play(z(t).id)), H(e, i);
		}), H(e, t);
	};
	W(c, (e) => {
		z(i).length && e(l);
	});
	var u = F(c, 4);
	$(M(u), {
		get d() {
			return Q.keyboard;
		},
		size: 14,
		stroke: 1.7
	}), De(2), E(u), E(o), B("click", u, () => n().shortcuts = !0), H(e, o), Je();
}
Sr(["click"]);
//#endregion
//#region src/components/ItemRow.svelte
var Ha = /* @__PURE__ */ V("<button class=\"icon svelte-ee3n05\" title=\"Play next\"><!></button> <button class=\"icon svelte-ee3n05\" title=\"Add to queue\"><!></button>", 1), Ua = /* @__PURE__ */ V("<div><!> <div class=\"text svelte-ee3n05\"><div> </div> <div class=\"meta svelte-ee3n05\"> </div></div> <!> <button class=\"play svelte-ee3n05\"><!></button></div>"), Wa = {
	hash: "svelte-ee3n05",
	code: ".row.svelte-ee3n05 {display:flex;align-items:center;gap:14px;padding:10px 8px;border-radius:10px;}.row.svelte-ee3n05:hover {background:var(--tm-fg-5);}.row.cur.svelte-ee3n05 {background:var(--tm-accent-8);}.text.svelte-ee3n05 {flex:1;min-width:0;}.title.svelte-ee3n05 {font-size:13px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.cur.svelte-ee3n05 .title:where(.svelte-ee3n05) {color:var(--tm-accent);}.title.done.svelte-ee3n05 {color:var(--tm-muted);}.meta.svelte-ee3n05 {font-size:11.5px;color:var(--tm-muted);margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.icon.svelte-ee3n05 {width:32px;height:32px;flex:none;border:0;border-radius:8px;background:transparent;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;}.icon.svelte-ee3n05:hover {background:var(--tm-fg-8);color:var(--tm-fg);}.play.svelte-ee3n05 {width:34px;height:34px;flex:none;border:0;border-radius:17px;background:var(--tm-accent);color:var(--tm-on-accent);cursor:pointer;display:grid;place-items:center;}"
};
function Ga(e, t) {
	qe(t, !0), K(e, Wa);
	let n = /* @__PURE__ */ D(() => t.store.items[t.id]), r = /* @__PURE__ */ D(() => t.id === t.store.now), i = /* @__PURE__ */ D(() => z(n) ? z(n).type === "podcast" ? [
		z(n).sub,
		Ri(z(n).date),
		t.store.lenOf(t.id)
	].filter(Boolean).join(" · ") : z(n).type === "radio" ? `${ki.radio} · ${z(n).sub}` : `${ki.book} · ${z(n).sub}` : "");
	var a = Nr(), o = N(a), s = (e) => {
		var a = Ua();
		let o;
		var s = M(a);
		Na(s, {
			get hue() {
				return z(n).hue;
			},
			get art() {
				return z(n).art;
			},
			get mark() {
				return z(n).mark;
			},
			size: 44
		});
		var c = F(s, 2), l = M(c);
		let u;
		var d = P(l, !0), f = P(F(l, 2), !0);
		E(c);
		var p = F(c, 2), m = (e) => {
			var r = Ha(), i = N(r);
			$(M(i), {
				get d() {
					return Q.playNext;
				},
				stroke: 1.8
			}), E(i);
			var a = F(i, 2);
			$(M(a), {
				get d() {
					return Q.plus;
				},
				stroke: 1.8
			}), E(a), I(() => {
				J(i, "aria-label", `Play next: ${z(n).title ?? ""}`), J(a, "aria-label", `Add to queue: ${z(n).title ?? ""}`);
			}), B("click", i, () => t.store.playNext(t.id)), B("click", a, () => t.store.addToQueue(t.id)), H(e, r);
		};
		W(p, (e) => {
			z(n).type !== "radio" && e(m);
		});
		var h = F(p, 2), g = M(h);
		{
			let e = /* @__PURE__ */ D(() => t.store.isPlaying(t.id) ? z(n).type === "radio" ? Q.stop : Q.pause : Q.play);
			$(g, {
				get d() {
					return z(e);
				},
				size: 14
			});
		}
		E(h), E(a), I((e, t) => {
			o = q(a, 1, "row svelte-ee3n05", null, o, { cur: z(r) }), u = q(l, 1, "title svelte-ee3n05", null, u, { done: e }), U(d, z(n).title), U(f, z(i)), J(h, "aria-label", `${t ?? ""} ${z(n).title ?? ""}`);
		}, [() => !z(r) && t.store.isDone(t.id), () => t.store.isPlaying(t.id) ? z(n).type === "radio" ? "Stop" : "Pause" : "Play"]), B("click", h, () => t.store.isPlaying(t.id) && z(n).type === "radio" ? t.store.stop() : t.store.play(t.id)), H(e, a);
	};
	W(o, (e) => {
		z(n) && e(s);
	}), H(e, a), Je();
}
Sr(["click"]);
//#endregion
//#region src/components/Status.svelte
var Ka = /* @__PURE__ */ V("<div class=\"line svelte-hcghuu\" role=\"status\"><span class=\"spin svelte-hcghuu\" aria-hidden=\"true\"></span>Loading…</div>"), qa = /* @__PURE__ */ V("<button class=\"svelte-hcghuu\">Try again</button>"), Ja = /* @__PURE__ */ V("<div class=\"line svelte-hcghuu\" role=\"alert\"> <!></div>"), Ya = /* @__PURE__ */ V("<div class=\"line svelte-hcghuu\"> </div>"), Xa = {
	hash: "svelte-hcghuu",
	code: ".line.svelte-hcghuu {display:flex;align-items:center;gap:10px;padding:18px 8px;font-size:12.5px;color:var(--tm-muted);}button.svelte-hcghuu {border:0;background:none;color:var(--tm-accent);font-size:12.5px;cursor:pointer;padding:0;}.spin.svelte-hcghuu {width:14px;height:14px;border-radius:50%;border:2px solid var(--tm-fg-16);border-top-color:var(--tm-accent); animation: svelte-hcghuu-spin .8s linear infinite;}\n  @keyframes svelte-hcghuu-spin { to { transform: rotate(360deg); } }\n  @media (prefers-reduced-motion: reduce) {.spin.svelte-hcghuu { animation: none;} }"
};
function Za(e, t) {
	K(e, Xa);
	let n = Y(t, "empty", 3, ""), r = Y(t, "error", 3, "OndaCast could not be reached.");
	var i = Nr(), a = N(i), o = (e) => {
		H(e, Ka());
	}, s = (e) => {
		var n = Ja(), i = M(n, !0), a = F(i), o = (e) => {
			var n = qa();
			B("click", n, function(...e) {
				t.retry?.apply(this, e);
			}), H(e, n);
		};
		W(a, (e) => {
			t.retry && e(o);
		}), E(n), I(() => U(i, r())), H(e, n);
	}, c = (e) => {
		var t = Ya(), r = P(t, !0);
		I(() => U(r, n())), H(e, t);
	};
	W(a, (e) => {
		t.status === "loading" ? e(o) : t.status === "error" ? e(s, 1) : n() && e(c, 2);
	}), H(e, i);
}
Sr(["click"]);
//#endregion
//#region src/components/HomeView.svelte
var Qa = /* @__PURE__ */ V("<button class=\"card svelte-oxdkf2\"><!> <span class=\"ctext svelte-oxdkf2\"><span class=\"kind svelte-oxdkf2\"> </span> <span class=\"ctitle svelte-oxdkf2\"> </span> <span class=\"bar svelte-oxdkf2\"><span class=\"svelte-oxdkf2\"></span></span> <span class=\"left svelte-oxdkf2\"> </span></span></button>"), $a = /* @__PURE__ */ V("<div class=\"continue svelte-oxdkf2\"></div>"), eo = /* @__PURE__ */ V("<div class=\"start svelte-oxdkf2\"><button class=\"svelte-oxdkf2\">Tune in to live radio</button> <button class=\"svelte-oxdkf2\">Find a podcast</button> <button class=\"svelte-oxdkf2\">Start an audiobook</button></div>"), to = /* @__PURE__ */ V("<button><span class=\"banner svelte-oxdkf2\"><!><span class=\"live svelte-oxdkf2\"><i class=\"svelte-oxdkf2\"></i>LIVE</span></span> <span class=\"stext svelte-oxdkf2\"><span class=\"stitle svelte-oxdkf2\"> </span><span class=\"song svelte-oxdkf2\"> </span></span></button>"), no = /* @__PURE__ */ V("<div class=\"onair svelte-oxdkf2\"></div>"), ro = /* @__PURE__ */ V("<h1 class=\"h1 svelte-oxdkf2\"> </h1> <p class=\"lede svelte-oxdkf2\">Pick up where you left off across radio, podcasts and books.</p> <!> <div class=\"section svelte-oxdkf2\"><h2 class=\"svelte-oxdkf2\">On air now</h2><button class=\"link svelte-oxdkf2\">All stations</button></div> <!> <h2 class=\"h2 svelte-oxdkf2\">New from your shows</h2> <!>", 1), io = {
	hash: "svelte-oxdkf2",
	code: ".h1.svelte-oxdkf2 {font-size:26px;font-weight:650;letter-spacing:-.5px;margin:0;}.lede.svelte-oxdkf2 {font-size:13px;color:var(--tm-muted);margin:4px 0 0;}.continue.svelte-oxdkf2 {display:grid;grid-template-columns:repeat(3, minmax(0, 1fr));gap:12px;margin-top:20px;}.card.svelte-oxdkf2 {display:flex;gap:12px;padding:12px;border:0;border-radius:14px;background:var(--tm-fg-4);color:inherit;cursor:pointer;align-items:center;text-align:left;font:inherit;}.card.svelte-oxdkf2:hover {background:var(--tm-fg-8);}.ctext.svelte-oxdkf2 {min-width:0;flex:1;display:flex;flex-direction:column;gap:4px;}.kind.svelte-oxdkf2 {font-size:10px;letter-spacing:.8px;text-transform:uppercase;color:var(--tm-accent);font-weight:600;}.ctitle.svelte-oxdkf2 {font-size:13px;font-weight:600;line-height:1.25;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.bar.svelte-oxdkf2 {height:3px;border-radius:2px;background:var(--tm-fg-10);margin-top:3px;display:block;}.bar.svelte-oxdkf2 span:where(.svelte-oxdkf2) {display:block;height:3px;border-radius:2px;background:var(--tm-accent);}.left.svelte-oxdkf2 {font-size:11px;color:var(--tm-muted);}.start.svelte-oxdkf2 {display:flex;flex-wrap:wrap;gap:8px;margin-top:18px;}.start.svelte-oxdkf2 button:where(.svelte-oxdkf2) {height:34px;padding:0 16px;border-radius:17px;border:1px solid var(--tm-fg-14);background:var(--tm-fg-4);color:var(--tm-fg);font-size:12.5px;font-weight:600;cursor:pointer;}.start.svelte-oxdkf2 button:where(.svelte-oxdkf2):hover {border-color:var(--tm-accent);}.section.svelte-oxdkf2 {display:flex;align-items:baseline;justify-content:space-between;margin:28px 0 12px;}h2.svelte-oxdkf2 {font-size:15px;font-weight:650;margin:0;}.h2.svelte-oxdkf2 {margin:28px 0 8px;}.link.svelte-oxdkf2 {border:0;background:none;color:var(--tm-accent);font-size:12px;cursor:pointer;padding:0;}.onair.svelte-oxdkf2 {display:grid;grid-template-columns:repeat(4, minmax(0, 1fr));gap:12px;}.station.svelte-oxdkf2 {border:0;padding:0;border-radius:14px;overflow:hidden;background:var(--tm-fg-4);color:inherit;cursor:pointer;text-align:left;font:inherit;display:flex;flex-direction:column;}.station.svelte-oxdkf2:hover {background:var(--tm-fg-8);}.station.cur.svelte-oxdkf2 {box-shadow:inset 0 0 0 1px var(--tm-accent);}.banner.svelte-oxdkf2 {height:78px;display:flex;width:100%;position:relative;}.live.svelte-oxdkf2 {position:absolute;left:10px;top:10px;display:inline-flex;align-items:center;gap:5px;font-size:9.5px;font-weight:700;letter-spacing:.8px;padding:3px 7px;border-radius:20px;background:rgba(0, 0, 0, .45);color:#fff;}.live.svelte-oxdkf2 i:where(.svelte-oxdkf2) {width:5px;height:5px;border-radius:3px;background:var(--tm-live);}.stext.svelte-oxdkf2 {padding:10px 12px 12px;display:flex;flex-direction:column;min-width:0;}.stitle.svelte-oxdkf2 {font-size:12.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.song.svelte-oxdkf2 {font-size:11px;color:var(--tm-muted);margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}"
};
function ao(e, t) {
	qe(t, !0), K(e, io);
	let n = Y(t, "store", 7);
	var r = ro(), i = N(r), a = P(i, !0), o = F(i, 4), s = (e) => {
		var t = $a();
		G(t, 20, () => n().continueIds, (e) => e, (e, t) => {
			let r = /* @__PURE__ */ D(() => n().items[t]);
			var i = Qa(), a = M(i);
			Na(a, {
				get hue() {
					return z(r).hue;
				},
				get art() {
					return z(r).art;
				},
				size: 58,
				radius: 10,
				get mark() {
					return z(r).mark;
				}
			});
			var o = F(a, 2), s = M(o), c = P(s, !0), l = F(s, 2), u = P(l, !0), d = F(l, 2), f = M(d);
			let p;
			E(d);
			var m = P(F(d, 2), !0);
			E(o), E(i), I((e, t, n) => {
				J(i, "aria-label", `${e ?? ""} ${z(r).title ?? ""}`), U(c, ki[z(r).type]), U(u, z(r).title), p = ai(f, "", p, { width: t }), U(m, n);
			}, [
				() => n().isPlaying(t) ? "Pause" : "Continue",
				() => `${n().pctOf(t) ?? ""}%`,
				() => n().leftOf(t)
			]), B("click", i, () => n().play(t)), H(e, i);
		}), E(t), H(e, t);
	}, c = (e) => {
		var t = eo(), r = M(t), i = F(r, 2), a = F(i, 2);
		E(t), B("click", r, () => n().tab = "radio"), B("click", i, () => {
			n().tab = "pod", n().showSlug = null;
		}), B("click", a, () => {
			n().tab = "book", n().bookId = null;
		}), H(e, t);
	};
	W(o, (e) => {
		n().continueIds.length ? e(s) : e(c, -1);
	});
	var l = F(o, 2), u = F(M(l));
	E(l);
	var d = F(l, 2), f = (e) => {
		var t = no();
		G(t, 20, () => n().onAirIds, (e) => e, (e, t) => {
			let r = /* @__PURE__ */ D(() => n().items[t]);
			var i = to();
			let a;
			var o = M(i);
			Na(M(o), {
				get hue() {
					return z(r).hue;
				},
				get art() {
					return z(r).art;
				},
				fill: !0,
				radius: 0,
				get mark() {
					return z(r).mark;
				},
				font: 18
			}), De(), E(o);
			var s = F(o, 2), c = M(s), l = P(c, !0), u = P(F(c), !0);
			E(s), E(i), I((e, o) => {
				a = q(i, 1, "station svelte-oxdkf2", null, a, { cur: t === n().now }), J(i, "aria-label", `${e ?? ""} ${z(r).title ?? ""}`), U(l, z(r).title), U(u, o);
			}, [() => n().isPlaying(t) ? "Pause" : "Play", () => z(r).type === "radio" ? n().songOf(z(r).stationId) ? `♪ ${n().songOf(z(r).stationId)}` : z(r).sub : ""]), B("click", i, () => n().play(t)), H(e, i);
		}), E(t), H(e, t);
	}, p = (e) => {
		Za(e, {
			get status() {
				return n().radioStatus;
			},
			retry: () => n().loadRadio(),
			empty: "No stations are on air right now."
		});
	};
	W(d, (e) => {
		n().onAirIds.length ? e(f) : e(p, -1);
	}), G(F(d, 4), 16, () => n().newEpisodes, (e) => e, (e, t) => {
		Ga(e, {
			get store() {
				return n();
			},
			get id() {
				return t;
			}
		});
	}, (e) => {
		Za(e, {
			get status() {
				return n().newStatus;
			},
			retry: () => n().loadNewEpisodes(),
			empty: "Subscribe to shows in Podcasts and their new episodes land here."
		});
	}), I((e) => U(a, e), [() => Xi()]), B("click", u, () => n().tab = "radio"), H(e, r), Je();
}
Sr(["click"]);
//#endregion
//#region src/components/FavButton.svelte
var oo = /* @__PURE__ */ V("<button><!></button>"), so = {
	hash: "svelte-18vgx0d",
	code: ".fav.svelte-18vgx0d {width:32px;height:32px;flex:none;padding:0;border:0;border-radius:50%;background:transparent;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;transition:color .15s, transform .15s, background .15s;}.fav.svelte-18vgx0d:hover {color:var(--tm-fg);background:var(--tm-fg-8);}.fav.on.svelte-18vgx0d {color:var(--tm-live);}.fav.on.svelte-18vgx0d:hover {color:var(--tm-live);}.fav.solid.svelte-18vgx0d {background:rgba(0, 0, 0, .4);color:#fff;}.fav.solid.on.svelte-18vgx0d {color:var(--tm-live);}.fav.svelte-18vgx0d:active {transform:scale(.9);}\n  @media (prefers-reduced-motion: reduce) {.fav.svelte-18vgx0d {transition:none;} }"
};
function co(e, t) {
	qe(t, !0), K(e, so);
	let n = Y(t, "size", 3, 16), r = Y(t, "solid", 3, !1), i = /* @__PURE__ */ D(() => t.store.items[t.id]), a = /* @__PURE__ */ D(() => t.store.isFavorite(t.id)), o = /* @__PURE__ */ D(() => z(i) ? z(i).type === "radio" ? z(a) ? "Remove from favorite stations" : "Add to favorite stations" : z(i).type === "book" ? z(a) ? "Remove from My Media" : "Save to My Media" : z(a) ? `Unsubscribe from ${z(i).sub}` : `Subscribe to ${z(i).sub}` : "");
	var s = Nr(), c = N(s), l = (e) => {
		var i = oo();
		let s;
		var c = M(i);
		{
			let e = /* @__PURE__ */ D(() => z(a) ? 0 : 1.8);
			$(c, {
				get d() {
					return Q.heart;
				},
				get size() {
					return n();
				},
				get stroke() {
					return z(e);
				}
			});
		}
		E(i), I(() => {
			s = q(i, 1, "fav svelte-18vgx0d", null, s, {
				on: z(a),
				solid: r()
			}), J(i, "aria-pressed", z(a)), J(i, "aria-label", z(o)), J(i, "title", z(o));
		}), B("click", i, (e) => {
			e.stopPropagation(), t.store.toggleFavorite(t.id);
		}), H(e, i);
	};
	W(c, (e) => {
		z(i) && e(l);
	}), H(e, s), Je();
}
Sr(["click"]);
//#endregion
//#region src/components/WeekCard.svelte
var lo = /* @__PURE__ */ V("<span class=\"streak svelte-155zco6\"><!> </span>"), uo = /* @__PURE__ */ V("<span class=\"tip svelte-155zco6\"> </span>"), fo = /* @__PURE__ */ V("<div class=\"col svelte-155zco6\" role=\"presentation\"><span class=\"track svelte-155zco6\"><span></span> <!></span> <span> </span></div>"), po = /* @__PURE__ */ V("<div class=\"svelte-155zco6\"><dt class=\"svelte-155zco6\"> </dt><dd class=\"svelte-155zco6\"> </dd></div>"), mo = /* @__PURE__ */ V("<tr><th scope=\"row\"> </th><td> </td></tr>"), ho = /* @__PURE__ */ V("<section class=\"week svelte-155zco6\" aria-label=\"Your listening this week\"><div class=\"hero svelte-155zco6\"><span class=\"eyebrow svelte-155zco6\">Your week</span> <strong class=\"svelte-155zco6\"> </strong> <span class=\"sub svelte-155zco6\">listened in the last 7 days</span> <!></div> <div class=\"chart svelte-155zco6\" role=\"img\" aria-label=\"Minutes listened per day, last seven days\"></div> <dl class=\"split svelte-155zco6\"></dl> <table class=\"sr svelte-155zco6\"><caption>Minutes listened per day</caption><tbody></tbody></table></section>"), go = {
	hash: "svelte-155zco6",
	code: ".week.svelte-155zco6 {display:grid;grid-template-columns:minmax(150px, 1fr) minmax(200px, 1.6fr) minmax(130px, 1fr);grid-template-areas:'hero chart split';gap:14px 22px;align-items:center;padding:18px 20px;border-radius:16px;background:linear-gradient(135deg, var(--tm-accent-12), var(--tm-fg-4));border:1px solid var(--tm-fg-7);}.hero.svelte-155zco6 {grid-area:hero;display:flex;flex-direction:column;gap:2px;min-width:0;}.eyebrow.svelte-155zco6 {font-size:10.5px;letter-spacing:1px;text-transform:uppercase;color:var(--tm-accent);font-weight:650;}strong.svelte-155zco6 {font-size:30px;font-weight:700;letter-spacing:-.6px;line-height:1.1;}.sub.svelte-155zco6 {font-size:11.5px;color:var(--tm-muted);}.streak.svelte-155zco6 {display:inline-flex;align-items:center;gap:5px;margin-top:8px;width:fit-content;font-size:11px;font-weight:650;padding:3px 9px;border-radius:20px;background:var(--tm-fg-8);}.chart.svelte-155zco6 {grid-area:chart;display:grid;grid-template-columns:repeat(7, 1fr);gap:8px;height:120px;padding-top:24px;box-sizing:border-box;align-items:end;}.col.svelte-155zco6 {position:relative;display:flex;flex-direction:column;align-items:center;gap:6px;height:100%;}.track.svelte-155zco6 {position:relative;flex:1;width:100%;max-width:22px;display:flex;align-items:flex-end;justify-content:center;border-bottom:1px solid var(--tm-fg-12);}.bar.svelte-155zco6 {display:block;width:100%;border-radius:4px 4px 0 0;background:color-mix(in srgb, var(--tm-accent) 55%, transparent);}.bar.today.svelte-155zco6 {background:var(--tm-accent);}.day.svelte-155zco6 {font-size:10px;color:var(--tm-muted);}.day.today.svelte-155zco6 {color:var(--tm-fg);font-weight:650;}.tip.svelte-155zco6 {position:absolute;left:50%;transform:translateX(-50%);white-space:nowrap;font-size:11px;padding:4px 8px;border-radius:6px;background:var(--tm-fg);color:var(--tm-bg);pointer-events:none;z-index:2;}.split.svelte-155zco6 {grid-area:split;margin:0;display:grid;gap:8px;}.split.svelte-155zco6 div:where(.svelte-155zco6) {display:flex;justify-content:space-between;gap:10px;font-size:12px;}dt.svelte-155zco6 {color:var(--tm-muted);}dd.svelte-155zco6 {margin:0;font-weight:600;font-variant-numeric:tabular-nums;}.sr.svelte-155zco6 {position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;}\n  /* Medium widths: hero and split on the left, chart on the right. */\n  @container (max-width: 760px) {.week.svelte-155zco6 {grid-template-columns:minmax(150px, 1fr) minmax(180px, 1.3fr);grid-template-areas:'hero chart' 'split chart';align-items:start;}.split.svelte-155zco6 {gap:5px;} }\n  @container (max-width: 420px) {.week.svelte-155zco6 {grid-template-columns:1fr;grid-template-areas:'hero' 'chart' 'split';} }"
};
function _o(e, t) {
	qe(t, !0), K(e, go);
	let n = /* @__PURE__ */ D(() => t.store.week), r = /* @__PURE__ */ D(() => Math.max(60, ...z(n).days.map((e) => e.seconds))), i = (e) => e < 60 ? e ? "<1 min" : "0 min" : Yi(e), a = [
		["radio", "Radio"],
		["podcast", "Podcasts"],
		["book", "Audiobooks"]
	], o = /* @__PURE__ */ k(-1);
	var s = ho(), c = M(s), l = F(M(c), 2), u = P(l, !0), d = F(l, 4), f = (e) => {
		var t = lo(), r = M(t);
		$(r, {
			get d() {
				return Q.flame;
			},
			size: 13,
			stroke: 1.8
		});
		var i = F(r);
		E(t), I(() => U(i, `${z(n).streak ?? ""}-day streak`)), H(e, t);
	};
	W(d, (e) => {
		z(n).streak > 1 && e(f);
	}), E(c);
	var p = F(c, 2);
	G(p, 23, () => z(n).days, (e) => e.key, (e, t, n) => {
		let a = /* @__PURE__ */ D(() => z(t).seconds ? Math.max(4, z(t).seconds / z(r) * 100) : 0);
		var s = fo(), c = M(s), l = M(c);
		let u, d;
		var f = F(l, 2), p = (e) => {
			var n = uo();
			let r;
			var o = P(n);
			I((e) => {
				r = ai(n, "", r, { bottom: `calc(${z(a) ?? ""}% + 6px)` }), U(o, `${z(t).label ?? ""} · ${e ?? ""}`);
			}, [() => i(z(t).seconds)]), H(e, n);
		};
		W(f, (e) => {
			z(o) === z(n) && e(p);
		}), E(c);
		var m = F(c, 2);
		let h;
		var g = P(m, !0);
		E(s), I((e) => {
			u = q(l, 1, "bar svelte-155zco6", null, u, { today: z(n) === 6 }), d = ai(l, "", d, { height: `${z(a) ?? ""}%` }), h = q(m, 1, "day svelte-155zco6", null, h, { today: z(n) === 6 }), U(g, e);
		}, [() => z(t).label.slice(0, 2)]), xr("pointerenter", s, () => A(o, z(n), !0)), xr("pointerleave", s, () => A(o, -1)), H(e, s);
	}), E(p);
	var h = F(p, 2);
	G(h, 21, () => a, ([e, t]) => e, (e, t) => {
		var r = /* @__PURE__ */ D(() => m(z(t), 2));
		let a = () => z(r)[0], o = () => z(r)[1];
		var s = po(), c = M(s), l = P(c, !0), u = P(F(c), !0);
		E(s), I((e) => {
			U(l, o()), U(u, e);
		}, [() => i(z(n).byKind[a()])]), H(e, s);
	}), E(h);
	var g = F(h, 2), _ = F(M(g));
	G(_, 21, () => z(n).days, (e) => e.key, (e, t) => {
		var n = mo(), r = M(n), i = P(r, !0), a = P(F(r), !0);
		E(n), I((e) => {
			U(i, z(t).label), U(a, e);
		}, [() => Math.round(z(t).seconds / 60)]), H(e, n);
	}), E(_), E(g), E(s), I((e) => U(u, e), [() => i(z(n).total)]), H(e, s), Je();
}
//#endregion
//#region src/components/MyMediaView.svelte
var vo = /* @__PURE__ */ V("<button> <span class=\"n svelte-ube16v\"> </span></button>"), yo = /* @__PURE__ */ V("<div class=\"welcome svelte-ube16v\"><div class=\"wicon svelte-ube16v\"><!></div> <h2 class=\"svelte-ube16v\">Your library starts here</h2> <p class=\"svelte-ube16v\">Tap the heart on a station to keep it here, subscribe to shows, and save audiobooks. Everything you play is remembered, with your place in every episode and book.</p> <div class=\"cta svelte-ube16v\"><button class=\"svelte-ube16v\">Find stations</button> <button class=\"svelte-ube16v\">Browse podcasts</button> <button class=\"svelte-ube16v\">Browse audiobooks</button></div></div>"), bo = /* @__PURE__ */ V("<button class=\"rcard svelte-ube16v\"><!> <span class=\"rtext svelte-ube16v\"><span class=\"kind svelte-ube16v\"> </span> <span class=\"rtitle svelte-ube16v\"> </span> <span class=\"prog svelte-ube16v\"><span class=\"svelte-ube16v\"></span></span> <span class=\"meta svelte-ube16v\"> </span></span> <span class=\"rplay svelte-ube16v\"><!></span></button>"), xo = /* @__PURE__ */ V("<section class=\"svelte-ube16v\"><div class=\"sh svelte-ube16v\"><h2 class=\"svelte-ube16v\">Continue listening</h2><span class=\"svelte-ube16v\"> </span></div> <div class=\"resume svelte-ube16v\"></div></section>"), So = /* @__PURE__ */ V("<button class=\"all svelte-ube16v\">See all</button>"), Co = /* @__PURE__ */ V("<div><button class=\"tbody svelte-ube16v\"><span class=\"banner svelte-ube16v\"><!> <span class=\"live svelte-ube16v\"><i class=\"svelte-ube16v\"></i>LIVE</span> <span class=\"tplay svelte-ube16v\"><!></span></span> <span class=\"ttext svelte-ube16v\"><span class=\"ttitle svelte-ube16v\"> </span><span class=\"tsub svelte-ube16v\"> </span></span></button> <span class=\"tfav svelte-ube16v\"><!></span></div>"), wo = /* @__PURE__ */ V("<div class=\"tiles svelte-ube16v\"></div>"), To = /* @__PURE__ */ V("<button class=\"link svelte-ube16v\">Find stations</button>"), Eo = /* @__PURE__ */ V("<p class=\"none svelte-ube16v\"> <!></p>"), Do = /* @__PURE__ */ V("<section class=\"svelte-ube16v\"><div class=\"sh svelte-ube16v\"><h2 class=\"svelte-ube16v\">Favorite stations</h2><span class=\"svelte-ube16v\"> </span><!></div> <!></section>"), Oo = /* @__PURE__ */ V("<span class=\"badge svelte-ube16v\"> </span>"), ko = /* @__PURE__ */ V("<button class=\"card svelte-ube16v\"><span class=\"art svelte-ube16v\"><!><!></span> <span class=\"ctitle svelte-ube16v\"> </span> <span class=\"csub svelte-ube16v\"> </span></button>"), Ao = /* @__PURE__ */ V("<div class=\"cards svelte-ube16v\"></div>"), jo = /* @__PURE__ */ V("<button class=\"link svelte-ube16v\">Browse podcasts</button>"), Mo = /* @__PURE__ */ V("<section class=\"svelte-ube16v\"><div class=\"sh svelte-ube16v\"><h2 class=\"svelte-ube16v\">Your shows</h2><span class=\"svelte-ube16v\"> </span><!></div> <!></section>"), No = /* @__PURE__ */ V("<span class=\"bprog svelte-ube16v\"><span class=\"svelte-ube16v\"></span></span>"), Po = /* @__PURE__ */ V("<div class=\"bwrap svelte-ube16v\"><button class=\"card svelte-ube16v\"><span class=\"art tall svelte-ube16v\"><!> <!></span> <span class=\"ctitle svelte-ube16v\"> </span> <span> </span></button> <span class=\"bfav svelte-ube16v\"><!></span></div>"), Fo = /* @__PURE__ */ V("<div class=\"cards books svelte-ube16v\"></div>"), Io = /* @__PURE__ */ V("<button class=\"link svelte-ube16v\">Browse audiobooks</button>"), Lo = /* @__PURE__ */ V("<section class=\"svelte-ube16v\"><div class=\"sh svelte-ube16v\"><h2 class=\"svelte-ube16v\">Audiobooks</h2><span class=\"svelte-ube16v\"> </span><!></div> <!></section>"), Ro = /* @__PURE__ */ V("<div><!> <button class=\"htext svelte-ube16v\"><span class=\"htitle svelte-ube16v\"> </span> <span class=\"hmeta svelte-ube16v\"> </span></button> <!> <button class=\"hplay svelte-ube16v\"><!></button></div>"), zo = /* @__PURE__ */ V("<section class=\"svelte-ube16v\"><div class=\"sh svelte-ube16v\"><h2 class=\"svelte-ube16v\">Recently played</h2><span class=\"svelte-ube16v\"> </span><button class=\"all svelte-ube16v\">Clear history</button></div> <div class=\"hist svelte-ube16v\"></div></section>"), Bo = /* @__PURE__ */ V("<!> <!> <!> <!> <!>", 1), Vo = /* @__PURE__ */ V("<div class=\"head svelte-ube16v\"><div><h1 class=\"h1 svelte-ube16v\">My Media</h1> <p class=\"lede svelte-ube16v\">Your stations, shows and books, and everything you have been listening to.</p></div> <label class=\"filter svelte-ube16v\"><!> <input type=\"search\" placeholder=\"Filter your library\" aria-label=\"Filter your library\" class=\"svelte-ube16v\"/></label></div> <!> <div class=\"bar svelte-ube16v\"><div class=\"kinds svelte-ube16v\" role=\"group\" aria-label=\"Show\"></div> <label class=\"sort svelte-ube16v\">Sort <select aria-label=\"Sort\" class=\"svelte-ube16v\"><option>Recently played</option><option>Recently added</option><option>Title A–Z</option></select></label></div> <!>", 1), Ho = {
	hash: "svelte-ube16v",
	code: ".head.svelte-ube16v {display:flex;align-items:flex-end;justify-content:space-between;gap:16px;margin-bottom:18px;}.h1.svelte-ube16v {font-size:26px;font-weight:650;letter-spacing:-.5px;margin:0;}.lede.svelte-ube16v {font-size:13px;color:var(--tm-muted);margin:4px 0 0;}.filter.svelte-ube16v {display:flex;align-items:center;gap:8px;height:30px;padding:0 12px;border-radius:9px;background:var(--tm-fg-6);color:var(--tm-muted);width:220px;flex:none;}.filter.svelte-ube16v:focus-within {box-shadow:0 0 0 1px var(--tm-accent);}.filter.svelte-ube16v input:where(.svelte-ube16v) {flex:1;min-width:0;border:0;background:none;outline:none;color:var(--tm-fg);font:inherit;font-size:12px;}.bar.svelte-ube16v {display:flex;align-items:center;justify-content:space-between;gap:12px;margin:20px 0 4px;flex-wrap:wrap;}.kinds.svelte-ube16v {display:flex;gap:8px;flex-wrap:wrap;}.chip.svelte-ube16v {height:30px;padding:0 12px 0 14px;border-radius:15px;border:1px solid var(--tm-fg-16);background:transparent;color:var(--tm-fg);font-size:12px;font-weight:500;cursor:pointer;display:flex;align-items:center;gap:7px;}.chip.svelte-ube16v .n:where(.svelte-ube16v) {font-size:10.5px;min-width:18px;padding:1px 6px;border-radius:10px;background:var(--tm-fg-8);font-variant-numeric:tabular-nums;}.chip.on.svelte-ube16v {border-color:var(--tm-accent);background:var(--tm-accent);color:var(--tm-on-accent);}.chip.on.svelte-ube16v .n:where(.svelte-ube16v) {background:color-mix(in srgb, var(--tm-on-accent) 18%, transparent);}.sort.svelte-ube16v {display:flex;align-items:center;gap:8px;font-size:12px;color:var(--tm-muted);}select.svelte-ube16v {height:30px;border-radius:8px;border:1px solid var(--tm-fg-14);background:var(--tm-panel);color:var(--tm-fg);font:inherit;font-size:12px;padding:0 8px;}section.svelte-ube16v {margin-top:24px;}.sh.svelte-ube16v {display:flex;align-items:baseline;gap:8px;margin-bottom:12px;}.sh.svelte-ube16v h2:where(.svelte-ube16v) {font-size:15px;font-weight:650;margin:0;}.sh.svelte-ube16v > span:where(.svelte-ube16v) {font-size:11px;color:var(--tm-muted);font-variant-numeric:tabular-nums;}.all.svelte-ube16v, .link.svelte-ube16v {margin-left:auto;border:0;background:none;color:var(--tm-accent);font-size:12px;cursor:pointer;padding:0;font:inherit;font-size:12px;}.link.svelte-ube16v {margin-left:4px;}.none.svelte-ube16v {font-size:12.5px;color:var(--tm-muted);margin:0;padding:14px 16px;border-radius:12px;background:var(--tm-fg-4);}.resume.svelte-ube16v {display:grid;grid-template-columns:repeat(auto-fill, minmax(240px, 1fr));gap:10px;}.rcard.svelte-ube16v {display:flex;align-items:center;gap:12px;padding:10px;border:0;border-radius:14px;background:var(--tm-fg-4);color:inherit;cursor:pointer;text-align:left;font:inherit;}.rcard.svelte-ube16v:hover {background:var(--tm-fg-8);}.rtext.svelte-ube16v {flex:1;min-width:0;display:flex;flex-direction:column;gap:3px;}.kind.svelte-ube16v {font-size:9.5px;letter-spacing:.8px;text-transform:uppercase;color:var(--tm-accent);font-weight:650;}.rtitle.svelte-ube16v {font-size:12.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.prog.svelte-ube16v, .bprog.svelte-ube16v {display:block;height:3px;border-radius:2px;background:var(--tm-fg-10);}.prog.svelte-ube16v span:where(.svelte-ube16v), .bprog.svelte-ube16v span:where(.svelte-ube16v) {display:block;height:3px;border-radius:2px;background:var(--tm-accent);}.meta.svelte-ube16v {font-size:11px;color:var(--tm-muted);}.rplay.svelte-ube16v {width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:var(--tm-accent);color:var(--tm-on-accent);flex:none;}.tiles.svelte-ube16v {display:grid;grid-template-columns:repeat(auto-fill, minmax(150px, 1fr));gap:12px;}.tile.svelte-ube16v {position:relative;border-radius:14px;overflow:hidden;background:var(--tm-fg-4);}.tile.svelte-ube16v:hover {background:var(--tm-fg-8);}.tile.cur.svelte-ube16v {box-shadow:inset 0 0 0 1px var(--tm-accent);}.tbody.svelte-ube16v {display:flex;flex-direction:column;width:100%;border:0;padding:0;background:none;color:inherit;cursor:pointer;text-align:left;font:inherit;}.banner.svelte-ube16v {height:86px;display:flex;width:100%;position:relative;}.live.svelte-ube16v {position:absolute;left:8px;top:8px;display:inline-flex;align-items:center;gap:5px;font-size:9px;font-weight:700;letter-spacing:.8px;padding:3px 7px;border-radius:20px;background:rgba(0, 0, 0, .45);color:#fff;}.live.svelte-ube16v i:where(.svelte-ube16v) {width:5px;height:5px;border-radius:3px;background:var(--tm-live);}.tplay.svelte-ube16v {position:absolute;right:8px;bottom:8px;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:var(--tm-accent);color:var(--tm-on-accent);box-shadow:0 6px 16px rgba(0, 0, 0, .35);opacity:0;transform:translateY(4px);transition:opacity .15s, transform .15s;}.tile.svelte-ube16v:hover .tplay:where(.svelte-ube16v), .tile.cur.svelte-ube16v .tplay:where(.svelte-ube16v), .tbody.svelte-ube16v:focus-visible .tplay:where(.svelte-ube16v) {opacity:1;transform:none;}.tfav.svelte-ube16v {position:absolute;right:6px;top:6px;}.ttext.svelte-ube16v {padding:9px 11px 11px;display:flex;flex-direction:column;min-width:0;}.ttitle.svelte-ube16v {font-size:12.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.tsub.svelte-ube16v {font-size:11px;color:var(--tm-muted);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.cards.svelte-ube16v {display:grid;grid-template-columns:repeat(auto-fill, minmax(124px, 1fr));gap:16px;}.card.svelte-ube16v {display:flex;flex-direction:column;gap:3px;border:0;padding:0;background:none;color:inherit;cursor:pointer;text-align:left;font:inherit;min-width:0;width:100%;}.art.svelte-ube16v {position:relative;display:flex;aspect-ratio:1;border-radius:12px;overflow:hidden;box-shadow:0 10px 24px rgba(0, 0, 0, .28);margin-bottom:6px;transition:transform .15s;}.art.tall.svelte-ube16v {aspect-ratio:.72;border-radius:5px 10px 10px 5px;}.card.svelte-ube16v:hover .art:where(.svelte-ube16v) {transform:translateY(-2px);}.badge.svelte-ube16v {position:absolute;left:8px;top:8px;font-size:10px;font-weight:700;padding:3px 8px;border-radius:20px;background:var(--tm-accent);color:var(--tm-on-accent);}.bprog.svelte-ube16v {position:absolute;left:8px;right:8px;bottom:8px;background:rgba(0, 0, 0, .45);}.ctitle.svelte-ube16v {font-size:12.5px;font-weight:600;line-height:1.3;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical;}.csub.svelte-ube16v {font-size:11px;color:var(--tm-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.csub.done.svelte-ube16v {color:var(--tm-accent);}.bwrap.svelte-ube16v {position:relative;}.bfav.svelte-ube16v {position:absolute;right:6px;top:6px;}.hist.svelte-ube16v {display:flex;flex-direction:column;}.hrow.svelte-ube16v {display:flex;align-items:center;gap:12px;padding:8px;border-radius:10px;}.hrow.svelte-ube16v:hover {background:var(--tm-fg-5);}.hrow.cur.svelte-ube16v {background:var(--tm-accent-8);}.htext.svelte-ube16v {flex:1;min-width:0;display:flex;flex-direction:column;border:0;padding:0;background:none;color:inherit;cursor:pointer;text-align:left;font:inherit;}.htitle.svelte-ube16v {font-size:12.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.hmeta.svelte-ube16v {font-size:11px;color:var(--tm-muted);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.hplay.svelte-ube16v {width:30px;height:30px;flex:none;border:0;border-radius:50%;background:var(--tm-fg-8);color:var(--tm-fg);cursor:pointer;display:grid;place-items:center;}.hplay.svelte-ube16v:hover {background:var(--tm-accent);color:var(--tm-on-accent);}.welcome.svelte-ube16v {margin-top:26px;padding:34px 28px;border-radius:18px;text-align:center;background:var(--tm-fg-4);border:1px dashed var(--tm-fg-14);}.wicon.svelte-ube16v {width:54px;height:54px;margin:0 auto 12px;border-radius:16px;display:grid;place-items:center;background:var(--tm-accent-12);color:var(--tm-accent);}.welcome.svelte-ube16v h2:where(.svelte-ube16v) {font-size:17px;margin:0;}.welcome.svelte-ube16v p:where(.svelte-ube16v) {font-size:12.5px;color:var(--tm-muted);max-width:440px;margin:8px auto 0;line-height:1.55;}.cta.svelte-ube16v {display:flex;justify-content:center;flex-wrap:wrap;gap:8px;margin-top:18px;}.cta.svelte-ube16v button:where(.svelte-ube16v) {height:32px;padding:0 16px;border-radius:16px;border:1px solid var(--tm-fg-14);background:var(--tm-panel);color:var(--tm-fg);font-size:12px;font-weight:600;cursor:pointer;}.cta.svelte-ube16v button:where(.svelte-ube16v):hover {border-color:var(--tm-accent);}\n  @media (prefers-reduced-motion: reduce) {.art.svelte-ube16v, .tplay.svelte-ube16v {transition:none;} }"
};
function Uo(e, t) {
	qe(t, !0), K(e, Ho);
	let n = Y(t, "store", 7), r = [
		["all", "All"],
		["radio", "Radio"],
		["podcast", "Podcasts"],
		["book", "Audiobooks"]
	], i = /* @__PURE__ */ D(() => n().libraryCounts), a = (e) => e === "all" ? z(i).radio + z(i).podcast + z(i).book : z(i)[e], o = /* @__PURE__ */ D(() => n().libQuery.trim().toLowerCase()), s = (...e) => !z(o) || e.some((e) => e.toLowerCase().includes(z(o))), c = (e) => n().libKind === "all" || n().libKind === e, l = (e) => n().libKind === "all" ? e.slice(0, 8) : e, u = /* @__PURE__ */ D(() => {
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
	let f = /* @__PURE__ */ D(() => d(Object.values(n().favorites).map((e) => n().items[e.id] ?? e).filter((e) => s(e.title, e.sub)), (e) => e.id, (e) => e.title, (e) => n().lastPlayed(e.id))), p = /* @__PURE__ */ D(() => d(Object.values(n().subscribed).filter((e) => s(e.title, e.author)), (e) => `show:${e.slug}`, (e) => e.title, (e) => z(u)[e.slug] ?? 0)), h = /* @__PURE__ */ D(() => d(n().libraryBooks.filter((e) => s(e.title, e.sub)), (e) => e.id, (e) => e.title, (e) => n().lastPlayed(e.id))), g = /* @__PURE__ */ D(() => n().inProgress.filter((e) => {
		let t = n().items[e];
		return c(t.type) && s(t.title, t.sub);
	})), _ = /* @__PURE__ */ D(() => n().history.filter((e) => {
		let t = n().items[e.id];
		return t && c(t.type) && s(t.title, t.sub);
	})), v = /* @__PURE__ */ D(() => a("all") === 0 && !n().history.length && !n().inProgress.length);
	function y(e) {
		if (n().played[e.id]) return {
			pct: 100,
			label: "Finished"
		};
		let t = n().progressOf(e.id), r = n().durOf(e.id);
		return t > 5 && r ? {
			pct: Math.min(100, Math.round(t / r * 100)),
			label: `${Yi((r - t) / n().speedFor(e.id))} left`
		} : {
			pct: 0,
			label: "Not started"
		};
	}
	let ee = (e) => {
		n().libKind = e;
	};
	var b = Vo(), x = N(b), te = F(M(x), 2), S = M(te);
	$(S, {
		get d() {
			return Q.search;
		},
		size: 13,
		stroke: 2
	});
	var ne = F(S, 2);
	_i(ne), E(te), E(x);
	var re = F(x, 2);
	_o(re, { get store() {
		return n();
	} });
	var ie = F(re, 2), ae = M(ie);
	G(ae, 21, () => r, ([e, t]) => e, (e, t) => {
		var r = /* @__PURE__ */ D(() => m(z(t), 2));
		let i = () => z(r)[0], o = () => z(r)[1];
		var s = vo();
		let c;
		var l = M(s, !0), u = P(F(l), !0);
		E(s), I((e) => {
			c = q(s, 1, "chip svelte-ube16v", null, c, { on: n().libKind === i() }), J(s, "aria-pressed", n().libKind === i()), U(l, o()), U(u, e);
		}, [() => a(i())]), B("click", s, () => n().libKind = i()), H(e, s);
	}), E(ae);
	var oe = F(ae, 2), se = F(M(oe)), ce = M(se);
	ce.value = ce.__value = "recent";
	var le = F(ce);
	le.value = le.__value = "added";
	var ue = F(le);
	ue.value = ue.__value = "title", E(se), li(se), E(oe), E(ie);
	var de = F(ie, 2), fe = (e) => {
		var t = yo(), r = M(t);
		$(M(r), {
			get d() {
				return Q.library;
			},
			size: 26,
			stroke: 1.6
		}), E(r);
		var i = F(r, 6), a = M(i), o = F(a, 2), s = F(o, 2);
		E(i), E(t), B("click", a, () => n().tab = "radio"), B("click", o, () => {
			n().tab = "pod", n().showSlug = null;
		}), B("click", s, () => {
			n().tab = "book", n().bookId = null;
		}), H(e, t);
	}, pe = (e) => {
		var t = Bo(), r = N(t), i = (e) => {
			var t = xo(), r = M(t), i = P(F(M(r)), !0);
			E(r);
			var a = F(r, 2);
			G(a, 20, () => l(z(g)), (e) => e, (e, t) => {
				let r = /* @__PURE__ */ D(() => n().items[t]);
				var i = bo(), a = M(i);
				Na(a, {
					get hue() {
						return z(r).hue;
					},
					get art() {
						return z(r).art;
					},
					size: 52,
					radius: 9,
					get mark() {
						return z(r).mark;
					}
				});
				var o = F(a, 2), s = M(o), c = P(s, !0), l = F(s, 2), u = P(l, !0), d = F(l, 2), f = M(d);
				let p;
				E(d);
				var m = P(F(d, 2), !0);
				E(o);
				var h = F(o, 2), g = M(h);
				{
					let e = /* @__PURE__ */ D(() => n().isPlaying(t) ? Q.pause : Q.play);
					$(g, {
						get d() {
							return z(e);
						},
						size: 13
					});
				}
				E(h), E(i), I((e, t, n) => {
					J(i, "aria-label", `${e ?? ""} ${z(r).title ?? ""}`), U(c, ki[z(r).type]), U(u, z(r).title), p = ai(f, "", p, { width: t }), U(m, n);
				}, [
					() => n().isPlaying(t) ? "Pause" : "Resume",
					() => `${n().pctOf(t) ?? ""}%`,
					() => n().leftOf(t)
				]), B("click", i, () => n().play(t)), H(e, i);
			}), E(a), E(t), I(() => U(i, z(g).length)), H(e, t);
		};
		W(r, (e) => {
			z(g).length && e(i);
		});
		var a = F(r, 2), s = (e) => {
			var t = Do(), r = M(t), i = F(M(r)), a = P(i, !0), s = F(i), c = (e) => {
				var t = So();
				B("click", t, () => ee("radio")), H(e, t);
			};
			W(s, (e) => {
				n().libKind === "all" && z(f).length > 8 && e(c);
			}), E(r);
			var u = F(r, 2), d = (e) => {
				var t = wo();
				G(t, 21, () => l(z(f)), (e) => e.id, (e, t) => {
					let r = /* @__PURE__ */ D(() => n().isPlaying(z(t).id)), i = /* @__PURE__ */ D(() => n().songOf(z(t).stationId));
					var a = Co();
					let o;
					var s = M(a), c = M(s), l = M(c);
					Na(l, {
						get hue() {
							return z(t).hue;
						},
						get art() {
							return z(t).art;
						},
						fill: !0,
						radius: 0,
						get mark() {
							return z(t).mark;
						},
						font: 18
					});
					var u = F(l, 4), d = M(u);
					{
						let e = /* @__PURE__ */ D(() => z(r) ? Q.stop : Q.play);
						$(d, {
							get d() {
								return z(e);
							},
							size: 14
						});
					}
					E(u), E(c);
					var f = F(c, 2), p = M(f), m = P(p, !0), h = P(F(p), !0);
					E(f), E(s);
					var g = F(s, 2);
					co(M(g), {
						get store() {
							return n();
						},
						get id() {
							return z(t).id;
						},
						size: 14,
						solid: !0
					}), E(g), E(a), I(() => {
						o = q(a, 1, "tile svelte-ube16v", null, o, { cur: z(t).id === n().now }), J(s, "aria-label", `${z(r) ? "Stop" : "Play"} ${z(t).title ?? ""}`), U(m, z(t).title), U(h, z(i) ? `♪ ${z(i)}` : z(t).sub);
					}), B("click", s, () => z(r) ? n().stop() : n().play(z(t).id)), H(e, a);
				}), E(t), H(e, t);
			}, p = (e) => {
				var t = Eo(), r = M(t), i = F(r), a = (e) => {
					var t = To();
					B("click", t, () => n().tab = "radio"), H(e, t);
				};
				W(i, (e) => {
					z(o) || e(a);
				}), E(t), I(() => U(r, `${z(o) ? "No favorite stations match." : "Tap ♥ on any station to keep it here."} `)), H(e, t);
			};
			W(u, (e) => {
				z(f).length ? e(d) : e(p, -1);
			}), E(t), I(() => U(a, z(f).length)), H(e, t);
		}, u = /* @__PURE__ */ D(() => c("radio"));
		W(a, (e) => {
			z(u) && e(s);
		});
		var d = F(a, 2), m = (e) => {
			var t = Mo(), r = M(t), i = F(M(r)), a = P(i, !0), s = F(i), c = (e) => {
				var t = So();
				B("click", t, () => ee("podcast")), H(e, t);
			};
			W(s, (e) => {
				n().libKind === "all" && z(p).length > 8 && e(c);
			}), E(r);
			var u = F(r, 2), d = (e) => {
				var t = Ao();
				G(t, 21, () => l(z(p)), (e) => e.slug, (e, t) => {
					let r = /* @__PURE__ */ D(() => n().newCount(z(t).slug));
					var i = ko(), a = M(i), o = M(a);
					Na(o, {
						get hue() {
							return z(t).hue;
						},
						get art() {
							return z(t).art;
						},
						fill: !0,
						radius: 0,
						get mark() {
							return z(t).mark;
						},
						font: 18
					});
					var s = F(o), c = (e) => {
						var t = Oo(), n = P(t);
						I(() => U(n, `${z(r) ?? ""} new`)), H(e, t);
					};
					W(s, (e) => {
						z(r) && e(c);
					}), E(a);
					var l = F(a, 2), u = P(l, !0), d = P(F(l, 2), !0);
					E(i), I(() => {
						U(u, z(t).title), U(d, z(t).author || z(t).category || "Podcast");
					}), B("click", i, () => n().openShow(z(t).slug)), H(e, i);
				}), E(t), H(e, t);
			}, f = (e) => {
				var t = Eo(), r = M(t), i = F(r), a = (e) => {
					var t = jo();
					B("click", t, () => {
						n().tab = "pod", n().showSlug = null;
					}), H(e, t);
				};
				W(i, (e) => {
					z(o) || e(a);
				}), E(t), I(() => U(r, `${z(o) ? "No shows match." : "Subscribe to a show and its new episodes come to you."} `)), H(e, t);
			};
			W(u, (e) => {
				z(p).length ? e(d) : e(f, -1);
			}), E(t), I(() => U(a, z(p).length)), H(e, t);
		}, v = /* @__PURE__ */ D(() => c("podcast"));
		W(d, (e) => {
			z(v) && e(m);
		});
		var b = F(d, 2), x = (e) => {
			var t = Lo(), r = M(t), i = F(M(r)), a = P(i, !0), s = F(i), c = (e) => {
				var t = So();
				B("click", t, () => ee("book")), H(e, t);
			};
			W(s, (e) => {
				n().libKind === "all" && z(h).length > 8 && e(c);
			}), E(r);
			var u = F(r, 2), d = (e) => {
				var t = Fo();
				G(t, 21, () => l(z(h)), (e) => e.id, (e, t) => {
					let r = /* @__PURE__ */ D(() => y(z(t)));
					var i = Po(), a = M(i), o = M(a), s = M(o);
					Na(s, {
						get hue() {
							return z(t).hue;
						},
						get art() {
							return z(t).art;
						},
						fill: !0,
						radius: 0,
						get mark() {
							return z(t).mark;
						},
						font: 18
					});
					var c = F(s, 2), l = (e) => {
						var t = No(), n = M(t);
						let i;
						E(t), I(() => i = ai(n, "", i, { width: `${z(r).pct ?? ""}%` })), H(e, t);
					};
					W(c, (e) => {
						z(r).pct && e(l);
					}), E(o);
					var u = F(o, 2), d = P(u, !0), f = F(u, 2);
					let p;
					var m = P(f, !0);
					E(a);
					var h = F(a, 2);
					co(M(h), {
						get store() {
							return n();
						},
						get id() {
							return z(t).id;
						},
						size: 13,
						solid: !0
					}), E(h), E(i), I(() => {
						U(d, z(t).title), p = q(f, 1, "csub svelte-ube16v", null, p, { done: z(r).pct === 100 }), U(m, z(r).pct === 100 ? "✓ Finished" : z(r).label);
					}), B("click", a, () => n().openBook(z(t).id)), H(e, i);
				}), E(t), H(e, t);
			}, f = (e) => {
				var t = Eo(), r = M(t), i = F(r), a = (e) => {
					var t = Io();
					B("click", t, () => {
						n().tab = "book", n().bookId = null;
					}), H(e, t);
				};
				W(i, (e) => {
					z(o) || e(a);
				}), E(t), I(() => U(r, `${z(o) ? "No audiobooks match." : "Save a book, or start one, and it shows up here with your place."} `)), H(e, t);
			};
			W(u, (e) => {
				z(h).length ? e(d) : e(f, -1);
			}), E(t), I(() => U(a, z(h).length)), H(e, t);
		}, te = /* @__PURE__ */ D(() => c("book"));
		W(b, (e) => {
			z(te) && e(x);
		});
		var S = F(b, 2), ne = (e) => {
			var t = zo(), r = M(t), i = F(M(r)), a = P(i, !0), o = F(i);
			E(r);
			var s = F(r, 2);
			G(s, 21, () => l(z(_)), (e) => e.id, (e, t) => {
				let r = /* @__PURE__ */ D(() => n().items[z(t).id]);
				var i = Ro();
				let a;
				var o = M(i);
				Na(o, {
					get hue() {
						return z(r).hue;
					},
					get art() {
						return z(r).art;
					},
					size: 38,
					radius: 8,
					get mark() {
						return z(r).mark;
					},
					font: 10
				});
				var s = F(o, 2), c = M(s), l = P(c, !0), u = P(F(c, 2));
				E(s);
				var d = F(s, 2);
				co(d, {
					get store() {
						return n();
					},
					get id() {
						return z(t).id;
					},
					size: 14
				});
				var f = F(d, 2), p = M(f);
				{
					let e = /* @__PURE__ */ D(() => n().isPlaying(z(t).id) ? z(r).type === "radio" ? Q.stop : Q.pause : Q.play);
					$(p, {
						get d() {
							return z(e);
						},
						size: 12
					});
				}
				E(f), E(i), I((e, o, s) => {
					a = q(i, 1, "hrow svelte-ube16v", null, a, { cur: z(t).id === n().now }), U(l, z(r).title), U(u, `${ki[z(r).type] ?? ""} · ${e ?? ""} · ${o ?? ""}`), J(f, "aria-label", `${s ?? ""} ${z(r).title ?? ""}`);
				}, [
					() => z(r).type === "radio" ? z(r).sub : n().leftOf(z(t).id) || z(r).sub,
					() => Zi(new Date(z(t).at).toISOString()),
					() => n().isPlaying(z(t).id) ? z(r).type === "radio" ? "Stop" : "Pause" : "Play"
				]), B("click", s, () => n().play(z(t).id)), B("click", f, () => n().isPlaying(z(t).id) && z(r).type === "radio" ? n().stop() : n().play(z(t).id)), H(e, i);
			}), E(s), E(t), I(() => U(a, z(_).length)), B("click", o, () => n().clearHistory()), H(e, t);
		};
		W(S, (e) => {
			z(_).length && e(ne);
		}), H(e, t);
	};
	W(de, (e) => {
		z(v) ? e(fe) : e(pe, -1);
	}), Ci(ne, () => n().libQuery, (e) => n().libQuery = e), ui(se, () => n().libSort, (e) => n().libSort = e), H(e, b), Je();
}
Sr(["click"]);
//#endregion
//#region src/components/RadioView.svelte
var Wo = /* @__PURE__ */ V("<button> </button>"), Go = /* @__PURE__ */ V("<div class=\"song svelte-1c0iuue\"> </div>"), Ko = /* @__PURE__ */ V("<div><!> <div class=\"text svelte-1c0iuue\"><div class=\"title svelte-1c0iuue\"> </div> <div class=\"sub svelte-1c0iuue\"> </div> <!></div> <!> <button class=\"play svelte-1c0iuue\"><!></button></div>"), qo = /* @__PURE__ */ V("<button class=\"more svelte-1c0iuue\">Show more stations</button>"), Jo = /* @__PURE__ */ V("<h1 class=\"h1 svelte-1c0iuue\">Radio</h1> <p class=\"lede svelte-1c0iuue\">Live stations from OndaCast, most listened first. Search above for any station by name, city or genre.</p> <div class=\"genres svelte-1c0iuue\" role=\"group\" aria-label=\"Genre\"></div> <div class=\"grid svelte-1c0iuue\"></div> <!> <!>", 1), Yo = {
	hash: "svelte-1c0iuue",
	code: ".h1.svelte-1c0iuue {font-size:26px;font-weight:650;letter-spacing:-.5px;margin:0;}.lede.svelte-1c0iuue {font-size:13px;color:var(--tm-muted);margin:4px 0 0;}.genres.svelte-1c0iuue {display:flex;flex-wrap:wrap;gap:8px;margin-top:18px;}.chip.svelte-1c0iuue {height:30px;padding:0 14px;border-radius:15px;border:1px solid var(--tm-fg-16);background:transparent;color:var(--tm-fg);font-size:12px;font-weight:500;cursor:pointer;}.chip.on.svelte-1c0iuue {border-color:var(--tm-accent);background:var(--tm-accent);color:var(--tm-on-accent);}.grid.svelte-1c0iuue {display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));gap:10px;margin-top:18px;}.row.svelte-1c0iuue {display:flex;align-items:center;gap:10px;padding:12px;border-radius:14px;min-width:0;}.row.svelte-1c0iuue:hover {background:var(--tm-fg-7);}.row.cur.svelte-1c0iuue {background:var(--tm-accent-8);}.text.svelte-1c0iuue {flex:1;min-width:0;}.title.svelte-1c0iuue {font-size:13.5px;font-weight:600;line-height:1.3;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical;overflow-wrap:anywhere;}.cur.svelte-1c0iuue .title:where(.svelte-1c0iuue) {color:var(--tm-accent);}.sub.svelte-1c0iuue {font-size:11.5px;color:var(--tm-muted);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.song.svelte-1c0iuue {font-size:11.5px;margin-top:5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;opacity:.85;}.more.svelte-1c0iuue {display:block;margin:18px auto 0;height:32px;padding:0 18px;border-radius:16px;border:1px solid var(--tm-fg-14);background:transparent;color:var(--tm-fg);font-size:12px;cursor:pointer;}.more.svelte-1c0iuue:hover {background:var(--tm-fg-6);}.play.svelte-1c0iuue {width:36px;height:36px;border:0;border-radius:18px;background:var(--tm-accent);color:var(--tm-on-accent);cursor:pointer;display:grid;place-items:center;flex:none;}"
};
function Xo(e, t) {
	qe(t, !0), K(e, Yo);
	let n = Y(t, "store", 7), r = /* @__PURE__ */ D(() => n().stationList);
	bn(() => {
		n().radioStatus === "idle" && n().loadRadio();
	}), bn(() => {
		z(r).status === "idle" && n().loadStations(n().genre);
	});
	var i = Jo(), a = F(N(i), 4);
	G(a, 21, () => ga, (e) => e.label, (e, t) => {
		var r = Wo();
		let i;
		var a = P(r, !0);
		I(() => {
			i = q(r, 1, "chip svelte-1c0iuue", null, i, { on: n().genre === z(t).label }), J(r, "aria-pressed", n().genre === z(t).label), U(a, z(t).label);
		}), B("click", r, () => n().genre = z(t).label), H(e, r);
	}), E(a);
	var o = F(a, 2);
	G(o, 21, () => n().stations, (e) => e.id, (e, t) => {
		let r = /* @__PURE__ */ D(() => n().songOf(z(t).stationId)), i = /* @__PURE__ */ D(() => n().isPlaying(z(t).id));
		var a = Ko();
		let o;
		var s = M(a);
		Na(s, {
			get hue() {
				return z(t).hue;
			},
			get art() {
				return z(t).art;
			},
			size: 56,
			radius: 12,
			get mark() {
				return z(t).mark;
			},
			font: 12
		});
		var c = F(s, 2), l = M(c), u = P(l, !0), d = F(l, 2), f = P(d, !0), p = F(d, 2), m = (e) => {
			var t = Go(), n = P(t);
			I(() => U(n, `♪ ${z(r) ?? ""}`)), H(e, t);
		};
		W(p, (e) => {
			z(r) && e(m);
		}), E(c);
		var h = F(c, 2);
		co(h, {
			get store() {
				return n();
			},
			get id() {
				return z(t).id;
			}
		});
		var g = F(h, 2), _ = M(g);
		{
			let e = /* @__PURE__ */ D(() => z(i) ? Q.stop : Q.play);
			$(_, {
				get d() {
					return z(e);
				},
				size: 14
			});
		}
		E(g), E(a), I(() => {
			o = q(a, 1, "row svelte-1c0iuue", null, o, { cur: z(t).id === n().now }), U(u, z(t).title), U(f, z(t).sub), J(g, "aria-label", `${z(i) ? "Stop" : "Play"} ${z(t).title ?? ""}`);
		}), B("click", g, () => z(i) ? n().stop() : n().play(z(t).id)), H(e, a);
	}), E(o);
	var s = F(o, 2), c = (e) => {
		var t = qo();
		B("click", t, () => n().loadStations(n().genre, !0)), H(e, t);
	};
	W(s, (e) => {
		z(r).more && z(r).status === "ready" && e(c);
	});
	var l = F(s, 2), u = (e) => {
		{
			let t = /* @__PURE__ */ D(() => z(r).status === "idle" ? "loading" : z(r).status);
			Za(e, {
				get status() {
					return z(t);
				},
				retry: () => n().loadStations(n().genre, z(r).ids.length > 0),
				empty: "No stations in this genre right now."
			});
		}
	};
	W(l, (e) => {
		(!n().stations.length || z(r).status === "loading" || z(r).status === "error") && e(u);
	}), H(e, i), Je();
}
Sr(["click"]);
//#endregion
//#region src/components/Grid.svelte
var Zo = /* @__PURE__ */ V("<button class=\"card svelte-1cebjac\"><span><!></span> <span class=\"title svelte-1cebjac\"> </span> <span class=\"sub svelte-1cebjac\"> </span></button>"), Qo = /* @__PURE__ */ V("<div class=\"grid svelte-1cebjac\"></div>"), $o = {
	hash: "svelte-1cebjac",
	code: ".grid.svelte-1cebjac {display:grid;grid-template-columns:repeat(auto-fill, minmax(118px, 1fr));gap:16px 14px;margin-top:16px;}.card.svelte-1cebjac {display:flex;flex-direction:column;gap:3px;padding:0;border:0;background:none;color:inherit;text-align:left;cursor:pointer;font:inherit;min-width:0;}.art.svelte-1cebjac {display:flex;aspect-ratio:1;border-radius:12px;overflow:hidden;box-shadow:0 10px 24px rgba(0, 0, 0, .28);margin-bottom:6px;transition:transform .15s;}.art.tall.svelte-1cebjac {aspect-ratio:0.72;}.card.svelte-1cebjac:hover .art:where(.svelte-1cebjac) {transform:translateY(-2px);}.title.svelte-1cebjac {font-size:12.5px;font-weight:600;line-height:1.25;display:-webkit-box;-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}.sub.svelte-1cebjac {font-size:11px;color:var(--tm-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}\n  @media (prefers-reduced-motion: reduce) {.art.svelte-1cebjac {transition:none;} }"
};
function es(e, t) {
	qe(t, !0), K(e, $o);
	let n = Y(t, "tall", 3, !1);
	var r = Qo();
	G(r, 21, () => t.cards, (e) => e.key, (e, r) => {
		var i = Zo(), a = M(i);
		let o;
		Na(M(a), {
			get hue() {
				return z(r).hue;
			},
			get art() {
				return z(r).art;
			},
			get mark() {
				return z(r).mark;
			},
			fill: !0,
			radius: 12,
			font: 18
		}), E(a);
		var s = F(a, 2), c = P(s, !0), l = P(F(s, 2), !0);
		E(i), I(() => {
			o = q(a, 1, "art svelte-1cebjac", null, o, { tall: n() }), U(c, z(r).title), U(l, z(r).sub);
		}), B("click", i, () => t.open(z(r).key)), H(e, i);
	}), E(r), H(e, r), Je();
}
Sr(["click"]);
//#endregion
//#region src/components/PodcastView.svelte
var ts = /* @__PURE__ */ V("<button class=\"more svelte-1phe8yx\">Show more</button>"), ns = /* @__PURE__ */ V("<h1 class=\"h1 svelte-1phe8yx\">Podcasts</h1> <p class=\"lede svelte-1phe8yx\">Recently updated shows on OndaCast. Subscribe and new episodes land in Listen now.</p> <!> <!> <!>", 1), rs = /* @__PURE__ */ V("<div class=\"author svelte-1phe8yx\"> </div>"), is = /* @__PURE__ */ V("<div class=\"hero svelte-1phe8yx\"><div class=\"art svelte-1phe8yx\"><!></div> <div class=\"info svelte-1phe8yx\"><div class=\"eyebrow svelte-1phe8yx\"> </div> <h1 class=\"svelte-1phe8yx\"> </h1> <!> <p class=\"desc svelte-1phe8yx\"> </p> <div class=\"actions svelte-1phe8yx\"><button class=\"primary svelte-1phe8yx\"><!>Latest episode</button> <button> </button></div></div></div>"), as = /* @__PURE__ */ V("<div class=\"prog svelte-1phe8yx\"><span class=\"bar svelte-1phe8yx\"><span class=\"svelte-1phe8yx\"></span></span><span class=\"left svelte-1phe8yx\"> </span></div>"), os = /* @__PURE__ */ V("<div><button class=\"playbtn svelte-1phe8yx\"><!></button> <div class=\"text svelte-1phe8yx\"><div class=\"date svelte-1phe8yx\"> </div> <div> </div> <!></div> <button class=\"pill svelte-1phe8yx\">Play next</button> <button class=\"pill svelte-1phe8yx\">Queue</button> <button><!></button></div>"), ss = /* @__PURE__ */ V("<button class=\"more svelte-1phe8yx\">Older episodes</button>"), cs = /* @__PURE__ */ V("<button class=\"back svelte-1phe8yx\">‹ All podcasts</button> <!> <div class=\"listhead svelte-1phe8yx\"><span class=\"svelte-1phe8yx\">Episodes</span><span class=\"spacer svelte-1phe8yx\"></span>Newest first</div> <!> <!> <!>", 1), ls = {
	hash: "svelte-1phe8yx",
	code: ".h1.svelte-1phe8yx {font-size:26px;font-weight:650;letter-spacing:-.5px;margin:0;}.lede.svelte-1phe8yx {font-size:13px;color:var(--tm-muted);margin:4px 0 0;}.more.svelte-1phe8yx {display:block;margin:16px auto 0;height:32px;padding:0 18px;border-radius:16px;border:1px solid var(--tm-fg-14);background:transparent;color:var(--tm-fg);font-size:12px;cursor:pointer;}.back.svelte-1phe8yx {border:0;background:none;color:var(--tm-muted);font-size:12px;cursor:pointer;padding:0;margin:-8px 0 14px;}.back.svelte-1phe8yx:hover {color:var(--tm-fg);}.hero.svelte-1phe8yx {display:flex;gap:22px;align-items:flex-end;}.art.svelte-1phe8yx {border-radius:16px;box-shadow:0 18px 40px rgba(0, 0, 0, .35);flex:none;}.info.svelte-1phe8yx {flex:1;min-width:0;}.eyebrow.svelte-1phe8yx {font-size:10.5px;letter-spacing:1px;text-transform:uppercase;color:var(--tm-accent);font-weight:600;}h1.svelte-1phe8yx {font-size:28px;font-weight:700;letter-spacing:-.6px;margin:4px 0 0;line-height:1.15;}.author.svelte-1phe8yx {font-size:12.5px;margin-top:4px;}.desc.svelte-1phe8yx {font-size:12.5px;color:var(--tm-muted);margin:4px 0 0;text-wrap:pretty;display:-webkit-box;-webkit-line-clamp:3;line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;}.actions.svelte-1phe8yx {display:flex;gap:8px;margin-top:14px;flex-wrap:wrap;}.actions.svelte-1phe8yx button:where(.svelte-1phe8yx) {height:34px;border-radius:17px;cursor:pointer;}.primary.svelte-1phe8yx {padding:0 16px;border:0;background:var(--tm-accent);color:var(--tm-on-accent);font-size:12.5px;font-weight:650;display:flex;align-items:center;gap:7px;}.primary.svelte-1phe8yx:disabled {opacity:.5;cursor:default;}.sub.svelte-1phe8yx {padding:0 16px;border:1px solid var(--tm-fg-18);background:transparent;color:var(--tm-fg);font-size:12.5px;font-weight:600;}.sub.on.svelte-1phe8yx {border-color:var(--tm-accent);background:var(--tm-accent-12);}.listhead.svelte-1phe8yx {display:flex;align-items:center;gap:6px;margin:26px 0 6px;font-size:12px;color:var(--tm-muted);}.listhead.svelte-1phe8yx span:where(.svelte-1phe8yx):first-child {color:var(--tm-fg);font-weight:600;font-size:14px;}.spacer.svelte-1phe8yx {flex:1;}.ep.svelte-1phe8yx {display:flex;align-items:center;gap:14px;padding:14px 8px;border-top:1px solid var(--tm-fg-6);}.ep.cur.svelte-1phe8yx {background:var(--tm-accent-8);}.playbtn.svelte-1phe8yx {width:36px;height:36px;border-radius:18px;border:1px solid var(--tm-fg-18);background:transparent;color:var(--tm-fg);cursor:pointer;display:grid;place-items:center;flex:none;}.playbtn.svelte-1phe8yx:hover {background:var(--tm-accent);color:var(--tm-on-accent);border-color:var(--tm-accent);}.text.svelte-1phe8yx {flex:1;min-width:0;}.date.svelte-1phe8yx {font-size:11px;color:var(--tm-muted);}.title.svelte-1phe8yx {font-size:13.5px;font-weight:600;margin-top:2px;}.cur.svelte-1phe8yx .title:where(.svelte-1phe8yx) {color:var(--tm-accent);}.title.done.svelte-1phe8yx {color:var(--tm-muted);}.prog.svelte-1phe8yx {display:flex;align-items:center;gap:8px;margin-top:6px;}.bar.svelte-1phe8yx {width:70px;height:3px;border-radius:2px;background:var(--tm-fg-10);display:block;}.bar.svelte-1phe8yx span:where(.svelte-1phe8yx) {display:block;height:3px;border-radius:2px;background:var(--tm-accent);}.left.svelte-1phe8yx {font-size:11px;color:var(--tm-muted);}.pill.svelte-1phe8yx {height:28px;padding:0 10px;border:0;border-radius:7px;background:var(--tm-fg-6);color:var(--tm-fg);font-size:11.5px;cursor:pointer;flex:none;}.pill.svelte-1phe8yx:hover {background:var(--tm-fg-12);}.mark.svelte-1phe8yx {width:28px;height:28px;border:0;border-radius:7px;background:transparent;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;flex:none;}.mark.done.svelte-1phe8yx {color:var(--tm-accent);}.mark.svelte-1phe8yx:hover {background:var(--tm-fg-8);}"
};
function us(e, t) {
	qe(t, !0), K(e, ls);
	let n = Y(t, "store", 7), r = /* @__PURE__ */ D(() => n().show), i = /* @__PURE__ */ D(() => !!z(r) && !!n().subscribed[z(r).slug]), a = /* @__PURE__ */ D(() => n().showSlug ? n().showEpisodes[n().showSlug] : void 0), o = /* @__PURE__ */ D(() => n().podcastBrowse.slugs.map((e) => n().shows[e]).filter(Boolean).map((e) => ({
		key: e.slug,
		title: e.title,
		sub: e.author || e.category,
		hue: e.hue,
		mark: e.mark,
		art: e.art
	})));
	bn(() => {
		!n().showSlug && n().podcastBrowse.status === "idle" && n().loadPodcastBrowse();
	});
	var s = Nr(), c = N(s), l = (e) => {
		var t = ns(), r = F(N(t), 4);
		es(r, {
			get cards() {
				return z(o);
			},
			open: (e) => n().openShow(e)
		});
		var i = F(r, 2);
		Za(i, {
			get status() {
				return n().podcastBrowse.status;
			},
			retry: () => n().loadPodcastBrowse()
		});
		var a = F(i, 2), s = (e) => {
			var t = ts();
			B("click", t, () => n().loadPodcastBrowse(!0)), H(e, t);
		};
		W(a, (e) => {
			n().podcastBrowse.cursor && n().podcastBrowse.status === "ready" && e(s);
		}), H(e, t);
	}, u = (e) => {
		var t = cs(), o = N(t), s = F(o, 2), c = (e) => {
			var t = is(), a = M(t);
			Na(M(a), {
				get hue() {
					return z(r).hue;
				},
				get art() {
					return z(r).art;
				},
				size: 132,
				radius: 16,
				get mark() {
					return z(r).mark;
				},
				font: 20
			}), E(a);
			var o = F(a, 2), s = M(o), c = P(s), l = F(s, 2), u = P(l, !0), d = F(l, 2), f = (e) => {
				var t = rs(), n = P(t, !0);
				I(() => U(n, z(r).author)), H(e, t);
			};
			W(d, (e) => {
				z(r).author && e(f);
			});
			var p = F(d, 2), m = P(p, !0), h = F(p, 2), g = M(h);
			$(M(g), {
				get d() {
					return Q.play;
				},
				size: 12
			}), De(), E(g);
			var _ = F(g, 2);
			let v;
			var y = P(_, !0);
			E(h), E(o), E(t), I(() => {
				U(c, `Podcast${z(r).category ? ` · ${z(r).category}` : ""}`), U(u, z(r).title), U(m, z(r).desc), g.disabled = !n().episodes.length, v = q(_, 1, "sub svelte-1phe8yx", null, v, { on: z(i) }), J(_, "aria-pressed", z(i)), U(y, z(i) ? "Subscribed" : "Subscribe");
			}), B("click", g, () => n().episodes[0] && n().play(n().episodes[0].id)), B("click", _, () => n().toggleSubscribe(z(r).slug)), H(e, t);
		};
		W(s, (e) => {
			z(r) && e(c);
		});
		var l = F(s, 4);
		G(l, 17, () => n().episodes, (e) => e.id, (e, t) => {
			let r = /* @__PURE__ */ D(() => n().isDone(z(t).id));
			var i = os();
			let a;
			var o = M(i), s = M(o);
			{
				let e = /* @__PURE__ */ D(() => n().isPlaying(z(t).id) ? Q.pause : Q.play);
				$(s, {
					get d() {
						return z(e);
					},
					size: 13
				});
			}
			E(o);
			var c = F(o, 2), l = M(c), u = P(l, !0), d = F(l, 2);
			let f;
			var p = P(d, !0), m = F(d, 2), h = (e) => {
				var i = as(), a = M(i), o = M(a);
				let s;
				E(a);
				var c = P(F(a), !0);
				E(i), I((e, t) => {
					s = ai(o, "", s, { width: e }), U(c, t);
				}, [() => `${(z(r) ? 100 : n().pctOf(z(t).id)) ?? ""}%`, () => n().leftOf(z(t).id)]), H(e, i);
			}, g = /* @__PURE__ */ D(() => n().progressOf(z(t).id) > 5 || z(r));
			W(m, (e) => {
				z(g) && e(h);
			}), E(c);
			var _ = F(c, 2), v = F(_, 2), y = F(v, 2);
			let ee;
			$(M(y), {
				get d() {
					return Q.check;
				},
				size: 15,
				stroke: 2
			}), E(y), E(i), I((e, s) => {
				a = q(i, 1, "ep svelte-1phe8yx", null, a, { cur: z(t).id === n().now }), J(o, "aria-label", `${e ?? ""} ${z(t).title ?? ""}`), U(u, s), f = q(d, 1, "title svelte-1phe8yx", null, f, { done: z(r) && z(t).id !== n().now }), U(p, z(t).title), ee = q(y, 1, "mark svelte-1phe8yx", null, ee, { done: z(r) }), J(y, "title", z(r) ? "Mark as unplayed" : "Mark as played"), J(y, "aria-label", z(r) ? "Mark as unplayed" : "Mark as played"), J(y, "aria-pressed", z(r));
			}, [() => n().isPlaying(z(t).id) ? "Pause" : "Play", () => [Ri(z(t).date), n().lenOf(z(t).id)].filter(Boolean).join(" · ")]), B("click", o, () => n().play(z(t).id)), B("click", _, () => n().playNext(z(t).id)), B("click", v, () => n().addToQueue(z(t).id)), B("click", y, () => n().togglePlayed(z(t).id)), H(e, i);
		});
		var u = F(l, 2);
		{
			let e = /* @__PURE__ */ D(() => z(a)?.status ?? "loading"), t = /* @__PURE__ */ D(() => z(a)?.status === "ready" && !n().episodes.length ? "This show has no playable episodes yet." : "");
			Za(u, {
				get status() {
					return z(e);
				},
				retry: () => n().showSlug && n().loadShow(n().showSlug),
				get empty() {
					return z(t);
				}
			});
		}
		var d = F(u, 2), f = (e) => {
			var t = ss();
			B("click", t, () => n().showSlug && n().loadShow(n().showSlug, (z(a)?.page ?? 1) + 1)), H(e, t);
		};
		W(d, (e) => {
			z(a)?.hasNext && z(a).status === "ready" && e(f);
		}), B("click", o, () => n().showSlug = null), H(e, t);
	};
	W(c, (e) => {
		n().showSlug ? e(u, -1) : e(l);
	}), H(e, s), Je();
}
Sr(["click"]);
//#endregion
//#region src/components/BookView.svelte
var ds = /* @__PURE__ */ V("<button class=\"more svelte-965svo\">Show more</button>"), fs = /* @__PURE__ */ V("<h1 class=\"h1 svelte-965svo\">Audiobooks</h1> <p class=\"lede svelte-965svo\">Public-domain classics read by LibriVox volunteers, via OndaCast.</p> <!> <!> <!>", 1), ps = /* @__PURE__ */ V("<div class=\"prog svelte-965svo\"><span class=\"bar svelte-965svo\"><span class=\"svelte-965svo\"></span></span><span class=\"left svelte-965svo\"> </span></div>"), ms = /* @__PURE__ */ V("<div class=\"mrow svelte-965svo\"><button class=\"mjump svelte-965svo\"> <span class=\"svelte-965svo\"> </span></button> <button class=\"rm svelte-965svo\"><!></button></div>"), hs = /* @__PURE__ */ V("<h2 class=\"svelte-965svo\">Bookmarks</h2> <!>", 1), gs = /* @__PURE__ */ V("<button><span class=\"n svelte-965svo\"> </span> <span class=\"title svelte-965svo\"> </span> <span class=\"state svelte-965svo\"> </span></button>"), _s = /* @__PURE__ */ V("<div class=\"hero svelte-965svo\"><div class=\"cover svelte-965svo\"><!></div> <div class=\"info svelte-965svo\"><div class=\"eyebrow svelte-965svo\">Audiobook · Public domain</div> <h1 class=\"svelte-965svo\"> </h1> <p class=\"sub svelte-965svo\"> </p> <!> <div class=\"actions svelte-965svo\"><button class=\"primary svelte-965svo\"><!> </button> <button><!> </button> <button class=\"ghost svelte-965svo\">Add bookmark</button></div></div></div> <!> <h2 class=\"svelte-965svo\">Chapters</h2> <!>", 1), vs = /* @__PURE__ */ V("<button class=\"back svelte-965svo\">‹ All audiobooks</button> <!> <!>", 1), ys = {
	hash: "svelte-965svo",
	code: ".h1.svelte-965svo {font-size:26px;font-weight:650;letter-spacing:-.5px;margin:0;}.lede.svelte-965svo {font-size:13px;color:var(--tm-muted);margin:4px 0 0;}.more.svelte-965svo {display:block;margin:16px auto 0;height:32px;padding:0 18px;border-radius:16px;border:1px solid var(--tm-fg-14);background:transparent;color:var(--tm-fg);font-size:12px;cursor:pointer;}.back.svelte-965svo {border:0;background:none;color:var(--tm-muted);font-size:12px;cursor:pointer;padding:0;margin:-8px 0 14px;}.back.svelte-965svo:hover {color:var(--tm-fg);}.hero.svelte-965svo {display:flex;gap:24px;}.cover.svelte-965svo {width:120px;height:176px;border-radius:6px 12px 12px 6px;flex:none;overflow:hidden;display:flex;box-shadow:0 18px 40px rgba(0, 0, 0, .4), inset 6px 0 0 rgba(0, 0, 0, .18);}.info.svelte-965svo {flex:1;min-width:0;padding-top:6px;}.eyebrow.svelte-965svo {font-size:10.5px;letter-spacing:1px;text-transform:uppercase;color:var(--tm-accent);font-weight:600;}h1.svelte-965svo {font-size:28px;font-weight:700;letter-spacing:-.6px;margin:4px 0 0;line-height:1.15;}.sub.svelte-965svo {font-size:13px;color:var(--tm-muted);margin:4px 0 0;}.prog.svelte-965svo {display:flex;align-items:center;gap:10px;margin-top:16px;}.bar.svelte-965svo {flex:1;max-width:260px;height:4px;border-radius:2px;background:var(--tm-fg-10);display:block;}.bar.svelte-965svo span:where(.svelte-965svo) {display:block;height:4px;border-radius:2px;background:var(--tm-accent);}.left.svelte-965svo {font-size:12px;}.actions.svelte-965svo {display:flex;gap:8px;margin-top:16px;}.actions.svelte-965svo button:where(.svelte-965svo) {height:34px;border-radius:17px;cursor:pointer;}.actions.svelte-965svo button:where(.svelte-965svo):disabled {opacity:.5;cursor:default;}.primary.svelte-965svo {padding:0 16px;border:0;background:var(--tm-accent);color:var(--tm-on-accent);font-size:12.5px;font-weight:650;display:flex;align-items:center;gap:7px;}.ghost.saved.svelte-965svo {color:var(--tm-live);border-color:color-mix(in srgb, var(--tm-live) 40%, transparent);}.ghost.svelte-965svo {display:flex;align-items:center;gap:6px;padding:0 14px;border:1px solid var(--tm-fg-14);background:transparent;color:var(--tm-fg);font-size:12px;}h2.svelte-965svo {font-size:14px;font-weight:600;margin:26px 0 6px;}.mrow.svelte-965svo {display:flex;align-items:center;border-top:1px solid var(--tm-fg-6);}.mjump.svelte-965svo {flex:1;display:flex;justify-content:space-between;padding:9px 8px;border:0;background:none;color:var(--tm-fg);font:inherit;font-size:12.5px;cursor:pointer;text-align:left;}.mjump.svelte-965svo span:where(.svelte-965svo) {color:var(--tm-muted);font-size:11px;}.mjump.svelte-965svo:hover {background:var(--tm-fg-4);}.rm.svelte-965svo {width:26px;height:26px;border:0;background:none;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;border-radius:6px;}.rm.svelte-965svo:hover {color:var(--tm-fg);background:var(--tm-fg-8);}.chap.svelte-965svo {display:flex;align-items:center;gap:14px;width:100%;padding:10px 8px;border:0;border-top:1px solid var(--tm-fg-6);background:transparent;color:var(--tm-fg);cursor:pointer;text-align:left;font:inherit;}.chap.svelte-965svo:hover {background:var(--tm-fg-4);}.chap.cur.svelte-965svo {background:var(--tm-accent-7);}.n.svelte-965svo {width:30px;flex:none;font:500 11px ui-monospace, Menlo, monospace;color:var(--tm-muted);}.title.svelte-965svo {flex:1;font-size:13px;min-width:0;}.cur.svelte-965svo .title:where(.svelte-965svo) {color:var(--tm-accent);}.done.svelte-965svo .title:where(.svelte-965svo) {color:var(--tm-muted);}.state.svelte-965svo {font-size:11px;color:var(--tm-muted);flex:none;}"
};
function bs(e, t) {
	qe(t, !0), K(e, ys);
	let n = Y(t, "store", 7), r = /* @__PURE__ */ D(() => n().book), i = /* @__PURE__ */ D(() => z(r) ? n().progressOf(z(r).id) : 0), a = /* @__PURE__ */ D(() => z(r) ? n().speedFor(z(r).id) : 1), o = /* @__PURE__ */ D(() => z(r) ? Math.max(0, $i(z(r).chapters, z(i))) : 0), s = /* @__PURE__ */ D(() => !!z(r) && n().isPlaying(z(r).id)), c = /* @__PURE__ */ D(() => z(r) ? n().bookmarks[z(r).id] ?? [] : []), l = /* @__PURE__ */ D(() => n().bookBrowse.ids.map((e) => n().items[e]).filter(Boolean).map((e) => ({
		key: e.id,
		title: e.title,
		sub: e.sub,
		hue: e.hue,
		mark: e.mark,
		art: e.art
	}))), u = (e) => z(r) ? z(r).chapters[e].dur || (z(r).chapters[e + 1]?.start ?? z(r).dur) - z(r).chapters[e].start : 0;
	bn(() => {
		!n().bookId && n().bookBrowse.status === "idle" && n().loadBookBrowse();
	});
	function d(e) {
		z(r) && n().jumpTo(z(r).id, e);
	}
	var f = Nr(), p = N(f), m = (e) => {
		var t = fs(), r = F(N(t), 4);
		es(r, {
			get cards() {
				return z(l);
			},
			tall: !0,
			open: (e) => n().openBook(e)
		});
		var i = F(r, 2);
		Za(i, {
			get status() {
				return n().bookBrowse.status;
			},
			retry: () => n().loadBookBrowse()
		});
		var a = F(i, 2), o = (e) => {
			var t = ds();
			B("click", t, () => n().loadBookBrowse(!0)), H(e, t);
		};
		W(a, (e) => {
			n().bookBrowse.cursor && n().bookBrowse.status === "ready" && e(o);
		}), H(e, t);
	}, h = (e) => {
		var t = vs(), l = N(t), f = F(l, 2), p = (e) => {
			var t = _s(), l = N(t), f = M(l);
			Na(M(f), {
				get hue() {
					return z(r).hue;
				},
				get art() {
					return z(r).art;
				},
				fill: !0,
				radius: 0,
				get mark() {
					return z(r).mark;
				},
				font: 22
			}), E(f);
			var p = F(f, 2), m = F(M(p), 2), h = P(m, !0), g = F(m, 2), _ = P(g, !0), v = F(g, 2), y = (e) => {
				var t = ps(), n = M(t), o = M(n);
				let s;
				E(n);
				var c = P(F(n));
				E(t), I((e, t, n) => {
					s = ai(o, "", s, { width: e }), U(c, `${t ?? ""} left at ${n ?? ""}×`);
				}, [
					() => `${Math.round(z(i) / z(r).dur * 100)}%`,
					() => Yi((z(r).dur - z(i)) / z(a)),
					() => z(a).toFixed(1)
				]), H(e, t);
			};
			W(v, (e) => {
				z(r).dur && e(y);
			});
			var ee = F(v, 2), b = M(ee), x = M(b);
			{
				let e = /* @__PURE__ */ D(() => z(s) ? Q.pause : Q.play);
				$(x, {
					get d() {
						return z(e);
					},
					size: 12
				});
			}
			var te = F(x, 1, !0);
			E(b);
			var S = F(b, 2);
			let ne;
			var re = M(S);
			{
				let e = /* @__PURE__ */ D(() => n().isFavorite(z(r).id) ? 0 : 1.8);
				$(re, {
					get d() {
						return Q.heart;
					},
					size: 12,
					get stroke() {
						return z(e);
					}
				});
			}
			var ie = F(re, 1, !0);
			E(S);
			var ae = F(S, 2);
			E(ee), E(p), E(l);
			var oe = F(l, 2), se = (e) => {
				var t = hs();
				G(F(N(t), 2), 17, () => z(c), (e) => e.at, (e, t) => {
					var i = ms(), a = M(i), o = M(a, !0), s = P(F(o), !0);
					E(a);
					var c = F(a, 2);
					$(M(c), {
						get d() {
							return Q.close;
						},
						size: 12,
						stroke: 2
					}), E(c), E(i), I((e) => {
						U(o, z(t).label), U(s, e), J(c, "aria-label", `Remove bookmark ${z(t).label ?? ""}`);
					}, [() => new Date(z(t).at).toLocaleDateString()]), B("click", a, () => d(z(t).pos)), B("click", c, () => n().removeBookmark(z(r).id, z(t).at)), H(e, i);
				}), H(e, t);
			};
			W(oe, (e) => {
				z(c).length && e(se);
			}), G(F(oe, 4), 17, () => z(r).chapters, Wr, (e, t, n) => {
				var r = gs();
				let a;
				var s = M(r), c = P(s, !0), l = F(s, 2), f = P(l, !0), p = P(F(l, 2), !0);
				E(r), I((e, s) => {
					a = q(r, 1, "chap svelte-965svo", null, a, {
						cur: n === z(o) && z(i) > 0,
						done: n < z(o)
					}), U(c, e), U(f, z(t).title), U(p, s);
				}, [() => Mi(n), () => n < z(o) ? "Finished" : n === z(o) && z(i) > 0 && u(n) ? `${Math.min(100, Math.round((z(i) - z(t).start) / u(n) * 100))}%` : u(n) ? Yi(u(n)) : ""]), B("click", r, () => d(z(t).start)), H(e, r);
			}), I((e, t, n, a) => {
				U(h, z(r).title), U(_, z(r).sub), b.disabled = !z(r).chapters.length, U(te, e), ne = q(S, 1, "ghost svelte-965svo", null, ne, { saved: t }), J(S, "aria-pressed", n), U(ie, a), ae.disabled = z(i) <= 0;
			}, [
				() => z(s) ? "Pause" : z(i) > 5 ? `Resume chapter ${Mi(z(o))}` : "Start listening",
				() => n().isFavorite(z(r).id),
				() => n().isFavorite(z(r).id),
				() => n().isFavorite(z(r).id) ? "In My Media" : "Save to My Media"
			]), B("click", b, () => n().play(z(r).id)), B("click", S, () => n().toggleFavorite(z(r).id)), B("click", ae, () => n().bookmark()), H(e, t);
		};
		W(f, (e) => {
			z(r) && e(p);
		});
		var m = F(f, 2), h = (e) => {
			{
				let t = /* @__PURE__ */ D(() => n().bookStatus[n().bookId] ?? "loading");
				Za(e, {
					get status() {
						return z(t);
					},
					retry: () => n().bookId && n().ensureBook(n().bookId),
					empty: "This audiobook has no playable chapters yet."
				});
			}
		};
		W(m, (e) => {
			z(r)?.chapters.length || e(h);
		}), B("click", l, () => n().bookId = null), H(e, t);
	};
	W(p, (e) => {
		n().bookId ? e(h, -1) : e(m);
	}), H(e, f), Je();
}
Sr(["click"]);
//#endregion
//#region src/components/SearchView.svelte
var xs = /* @__PURE__ */ V("<div class=\"srow svelte-1occquv\"><button class=\"row svelte-1occquv\"><!> <span class=\"text svelte-1occquv\"><span class=\"title svelte-1occquv\"> </span><span class=\"meta svelte-1occquv\"> </span></span> <span class=\"act svelte-1occquv\"><!> </span></button> <span class=\"sfav svelte-1occquv\"><!></span></div>"), Ss = /* @__PURE__ */ V("<button class=\"more svelte-1occquv\">More stations</button>"), Cs = /* @__PURE__ */ V("<h2 class=\"svelte-1occquv\">Shows and books</h2>"), ws = /* @__PURE__ */ V("<h2 class=\"svelte-1occquv\"> </h2> <div class=\"list svelte-1occquv\"></div> <!> <!> <!>", 1), Ts = /* @__PURE__ */ V("<button class=\"row svelte-1occquv\"><!> <span class=\"text svelte-1occquv\"><span class=\"title svelte-1occquv\"> </span><span class=\"meta svelte-1occquv\"> </span></span> <span class=\"act svelte-1occquv\"> </span></button>"), Es = /* @__PURE__ */ V("<h1 class=\"h1 svelte-1occquv\"> </h1> <!> <div class=\"list svelte-1occquv\"></div> <!>", 1), Ds = {
	hash: "svelte-1occquv",
	code: ".h1.svelte-1occquv {font-size:22px;font-weight:650;letter-spacing:-.4px;margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.list.svelte-1occquv {margin-top:14px;}.row.svelte-1occquv {display:flex;align-items:center;gap:14px;width:100%;padding:10px 8px;border:0;border-radius:10px;background:none;color:inherit;text-align:left;cursor:pointer;font:inherit;}.row.svelte-1occquv:hover {background:var(--tm-fg-5);}.srow.svelte-1occquv {display:flex;align-items:center;}.srow.svelte-1occquv .row:where(.svelte-1occquv) {flex:1;min-width:0;}.sfav.svelte-1occquv {flex:none;margin-left:4px;}.text.svelte-1occquv {flex:1;min-width:0;display:flex;flex-direction:column;}.title.svelte-1occquv {font-size:13px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.meta.svelte-1occquv {font-size:11.5px;color:var(--tm-muted);margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.act.svelte-1occquv {font-size:11.5px;color:var(--tm-accent);flex:none;display:flex;align-items:center;gap:5px;}h2.svelte-1occquv {font-size:13px;font-weight:650;margin:18px 0 0;color:var(--tm-muted);}.more.svelte-1occquv {display:block;margin:10px auto 4px;height:30px;padding:0 16px;border-radius:15px;border:1px solid var(--tm-fg-14);background:transparent;color:var(--tm-fg);font-size:12px;cursor:pointer;}"
};
function Os(e, t) {
	qe(t, !0), K(e, Ds);
	let n = {
		station: "Radio",
		podcast: "Podcast",
		audiobook: "Audiobook"
	}, r = {
		station: "Play",
		podcast: "Open",
		audiobook: "Open"
	}, i = /* @__PURE__ */ D(() => t.store.stationHits.ids.map((e) => t.store.items[e]).filter((e) => e?.type === "radio")), a = /* @__PURE__ */ D(() => t.store.stationHits.status !== "idle"), o = /* @__PURE__ */ D(() => t.store.search.status === "ready" && !t.store.search.hits.length && (!z(a) || t.store.stationHits.status === "ready" && !z(i).length));
	var s = Es(), c = N(s), l = P(c), u = F(c, 2), d = (e) => {
		var n = ws(), r = N(n), a = P(r), o = F(r, 2);
		G(o, 21, () => z(i), (e) => e.id, (e, n) => {
			let r = /* @__PURE__ */ D(() => t.store.isPlaying(z(n).id));
			var i = xs(), a = M(i), o = M(a);
			Na(o, {
				get hue() {
					return z(n).hue;
				},
				get art() {
					return z(n).art;
				},
				get mark() {
					return z(n).mark;
				},
				size: 44
			});
			var s = F(o, 2), c = M(s), l = P(c, !0), u = P(F(c), !0);
			E(s);
			var d = F(s, 2), f = M(d);
			{
				let e = /* @__PURE__ */ D(() => z(r) ? Q.stop : Q.play);
				$(f, {
					get d() {
						return z(e);
					},
					size: 12
				});
			}
			var p = F(f, 1, !0);
			E(d), E(a);
			var m = F(a, 2);
			co(M(m), {
				get store() {
					return t.store;
				},
				get id() {
					return z(n).id;
				},
				size: 14
			}), E(m), E(i), I(() => {
				U(l, z(n).title), U(u, z(n).sub), U(p, z(r) ? "Stop" : "Play");
			}), B("click", a, () => z(r) ? t.store.stop() : t.store.play(z(n).id)), H(e, i);
		}), E(o);
		var s = F(o, 2), c = (e) => {
			var n = Ss();
			B("click", n, () => t.store.loadStationHits(t.store.search.q, !0)), H(e, n);
		};
		W(s, (e) => {
			t.store.stationHits.more && t.store.stationHits.status === "ready" && e(c);
		});
		var l = F(s, 2), u = (e) => {
			Za(e, {
				get status() {
					return t.store.stationHits.status;
				},
				retry: () => t.store.loadStationHits(t.store.search.q, z(i).length > 0)
			});
		};
		W(l, (e) => {
			(t.store.stationHits.status === "loading" || t.store.stationHits.status === "error") && e(u);
		});
		var d = F(l, 2), f = (e) => {
			H(e, Cs());
		};
		W(d, (e) => {
			t.store.search.hits.length && e(f);
		}), I((e) => U(a, `Stations${e ?? ""}`), [() => t.store.stationHits.total ? ` · ${t.store.stationHits.total.toLocaleString()}` : ""]), H(e, n);
	};
	W(u, (e) => {
		z(a) && e(d);
	});
	var f = F(u, 2);
	G(f, 21, () => t.store.search.hits, (e) => e.kind + e.id, (e, i) => {
		var a = Ts(), o = M(a);
		{
			let e = /* @__PURE__ */ D(() => Ni(z(i).slug || z(i).id)), t = /* @__PURE__ */ D(() => Pi(z(i).title));
			Na(o, {
				get hue() {
					return z(e);
				},
				get art() {
					return z(i).art;
				},
				get mark() {
					return z(t);
				},
				size: 44
			});
		}
		var s = F(o, 2), c = M(s), l = P(c, !0), u = P(F(c));
		E(s);
		var d = P(F(s, 2), !0);
		E(a), I(() => {
			U(l, z(i).title), U(u, `${n[z(i).kind] ?? ""}${z(i).subtitle ? ` · ${z(i).subtitle}` : ""}`), U(d, r[z(i).kind]);
		}), B("click", a, () => t.store.openHit(z(i))), H(e, a);
	}), E(f);
	var p = F(f, 2);
	{
		let e = /* @__PURE__ */ D(() => t.store.search.status === "idle" ? "loading" : t.store.search.status), n = /* @__PURE__ */ D(() => z(o) ? "Nothing matches. Try a station, show, book or author." : "");
		Za(p, {
			get status() {
				return z(e);
			},
			retry: () => t.store.setQuery(t.store.query),
			get empty() {
				return z(n);
			}
		});
	}
	I((e) => U(l, `Results for “${e ?? ""}”`), [() => t.store.query.trim()]), H(e, s), Je();
}
Sr(["click"]);
//#endregion
//#region src/components/NowPlaying.svelte
var ks = /* @__PURE__ */ V("<div class=\"blank svelte-1b7bd5u\"></div>"), As = /* @__PURE__ */ V("<span class=\"kind svelte-1b7bd5u\"> </span>"), js = /* @__PURE__ */ V("<div class=\"prog svelte-1b7bd5u\" aria-label=\"Progress\"><span class=\"bar svelte-1b7bd5u\"><span class=\"svelte-1b7bd5u\"></span></span> <span class=\"pct svelte-1b7bd5u\"> </span></div>"), Ms = /* @__PURE__ */ V("<button role=\"tab\"> </button>"), Ns = /* @__PURE__ */ V("<div class=\"tabs svelte-1b7bd5u\" role=\"tablist\"></div>"), Ps = /* @__PURE__ */ V("<button class=\"q svelte-1b7bd5u\"><!> <span class=\"qtext svelte-1b7bd5u\"><span class=\"qtitle svelte-1b7bd5u\"> </span><span class=\"qmeta svelte-1b7bd5u\"> </span></span></button>"), Fs = /* @__PURE__ */ V("<h3 class=\"svelte-1b7bd5u\">Continue listening</h3> <!>", 1), Is = /* @__PURE__ */ V("<div class=\"empty svelte-1b7bd5u\">Choose a station, an episode or a book. What you are listening to shows here.</div> <!>", 1), Ls = /* @__PURE__ */ V("<span class=\"ontext svelte-1b7bd5u\"><span class=\"qtitle svelte-1b7bd5u\"> </span><span class=\"qmeta svelte-1b7bd5u\"> </span></span>"), Rs = /* @__PURE__ */ V("<span class=\"ontext svelte-1b7bd5u\"><span class=\"qtitle svelte-1b7bd5u\"> </span><span class=\"qmeta svelte-1b7bd5u\">This station does not publish song titles right now.</span></span>"), zs = /* @__PURE__ */ V("<dt class=\"svelte-1b7bd5u\">From</dt><dd class=\"svelte-1b7bd5u\"> </dd>", 1), Bs = /* @__PURE__ */ V("<div class=\"q track svelte-1b7bd5u\"><!> <span class=\"qtext svelte-1b7bd5u\"><span class=\"qtitle svelte-1b7bd5u\"> </span><span class=\"qmeta svelte-1b7bd5u\"> </span></span></div>"), Vs = /* @__PURE__ */ V("<h3 class=\"svelte-1b7bd5u\">Recently played</h3> <!>", 1), Hs = /* @__PURE__ */ V("<div class=\"onair svelte-1b7bd5u\"><span class=\"dot svelte-1b7bd5u\" aria-hidden=\"true\"></span> <!></div> <h3 class=\"svelte-1b7bd5u\">Station</h3> <dl class=\"facts svelte-1b7bd5u\"><dt class=\"svelte-1b7bd5u\">Genre</dt><dd class=\"svelte-1b7bd5u\"> </dd> <!></dl> <!>", 1), Us = /* @__PURE__ */ V("<div role=\"listitem\" draggable=\"true\"><span class=\"grip svelte-1b7bd5u\" aria-hidden=\"true\"><!></span> <!> <button class=\"qtext svelte-1b7bd5u\"><span class=\"qtitle svelte-1b7bd5u\"> </span><span class=\"qmeta svelte-1b7bd5u\"> </span></button> <span class=\"moves svelte-1b7bd5u\"><button class=\"mv svelte-1b7bd5u\"><!></button> <button class=\"mv svelte-1b7bd5u\"><!></button></span> <button class=\"rm svelte-1b7bd5u\"><!></button></div>"), Ws = /* @__PURE__ */ V("<div class=\"empty svelte-1b7bd5u\">Queue is empty. Use Play next or Queue on any episode.</div>"), Gs = /* @__PURE__ */ V("<button><span class=\"t svelte-1b7bd5u\"> </span> <span class=\"ctitle svelte-1b7bd5u\"> </span> <span class=\"cstate svelte-1b7bd5u\"> </span></button>"), Ks = /* @__PURE__ */ V("<div class=\"empty svelte-1b7bd5u\"> </div>"), qs = /* @__PURE__ */ V("<div class=\"q svelte-1b7bd5u\"><button class=\"qtext svelte-1b7bd5u\"><span class=\"qtitle svelte-1b7bd5u\"> </span><span class=\"qmeta svelte-1b7bd5u\"> </span></button> <button class=\"rm svelte-1b7bd5u\"><!></button></div>"), Js = /* @__PURE__ */ V("<div class=\"empty svelte-1b7bd5u\">No bookmarks yet. Your place is saved automatically; bookmarks keep moments you want to return to.</div>"), Ys = /* @__PURE__ */ V("<button class=\"add svelte-1b7bd5u\"><!>Bookmark this moment</button> <!>", 1), Xs = /* @__PURE__ */ V("<dt class=\"svelte-1b7bd5u\">Length</dt><dd class=\"svelte-1b7bd5u\"> </dd>", 1), Zs = /* @__PURE__ */ V("<dt class=\"svelte-1b7bd5u\">Chapters</dt><dd class=\"svelte-1b7bd5u\"> </dd>", 1), Qs = /* @__PURE__ */ V("<dl class=\"facts svelte-1b7bd5u\"><dt class=\"svelte-1b7bd5u\">Author</dt><dd class=\"svelte-1b7bd5u\"> </dd> <!> <!> <dt class=\"svelte-1b7bd5u\">Narration</dt><dd class=\"svelte-1b7bd5u\">LibriVox volunteers</dd></dl>"), $s = /* @__PURE__ */ V("<dt class=\"svelte-1b7bd5u\">Published</dt><dd class=\"svelte-1b7bd5u\"> </dd>", 1), ec = /* @__PURE__ */ V("<dl class=\"facts svelte-1b7bd5u\"><dt class=\"svelte-1b7bd5u\">Show</dt><dd class=\"svelte-1b7bd5u\"><button class=\"link svelte-1b7bd5u\"> </button></dd> <!> <!></dl>"), tc = /* @__PURE__ */ V("<p class=\"desc svelte-1b7bd5u\"> </p>"), nc = /* @__PURE__ */ V("<!> <!> <!>", 1), rc = /* @__PURE__ */ V("<button><span class=\"who svelte-1b7bd5u\"> </span> </button>"), ic = /* @__PURE__ */ V("<div></div>"), ac = /* @__PURE__ */ V("<aside class=\"aside svelte-1b7bd5u\" aria-label=\"Now playing\"><div class=\"top svelte-1b7bd5u\"><div><!> <!></div> <div class=\"trow svelte-1b7bd5u\"><div class=\"ttext svelte-1b7bd5u\"><div class=\"title svelte-1b7bd5u\"> </div><div class=\"sub svelte-1b7bd5u\"> </div></div> <!></div> <!></div> <!> <div class=\"body svelte-1b7bd5u\" role=\"tabpanel\"><!></div></aside>"), oc = {
	hash: "svelte-1b7bd5u",
	code: ".aside.svelte-1b7bd5u {width:300px;flex:none;background:var(--tm-panel);display:flex;flex-direction:column;min-height:0;}.top.svelte-1b7bd5u {padding:20px 20px 14px;}.art.svelte-1b7bd5u {width:100%;aspect-ratio:1.45;border-radius:14px;position:relative;overflow:hidden;display:flex;box-shadow:0 14px 36px rgba(0, 0, 0, .35);}.blank.svelte-1b7bd5u {flex:1;background:var(--tm-fg-6);}.kind.svelte-1b7bd5u {position:absolute;left:12px;top:12px;font-size:9.5px;font-weight:700;letter-spacing:.8px;padding:3px 8px;border-radius:20px;background:rgba(0, 0, 0, .45);color:#fff;}.trow.svelte-1b7bd5u {display:flex;align-items:flex-start;gap:6px;}.ttext.svelte-1b7bd5u {flex:1;min-width:0;}.trow.svelte-1b7bd5u .fav {margin-top:10px;}.title.svelte-1b7bd5u {font-size:15px;font-weight:650;margin-top:14px;line-height:1.3;text-wrap:pretty;display:-webkit-box;-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}.sub.svelte-1b7bd5u {font-size:12px;color:var(--tm-muted);margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.tabs.svelte-1b7bd5u {display:flex;gap:2px;padding:0 12px;border-bottom:1px solid var(--tm-fg-7);overflow-x:auto;scrollbar-width:none;}.tabs.svelte-1b7bd5u button:where(.svelte-1b7bd5u) {flex:0 1 auto;min-width:0;height:34px;padding:0 7px;border:0;background:none;color:var(--tm-muted);font-size:11.5px;font-weight:600;white-space:nowrap;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;}.tabs.svelte-1b7bd5u button.on:where(.svelte-1b7bd5u) {color:var(--tm-fg);border-bottom-color:var(--tm-accent);}.body.svelte-1b7bd5u {flex:1;min-height:0;overflow:auto;padding:8px 12px 12px;}.q.svelte-1b7bd5u {display:flex;align-items:center;gap:10px;padding:7px 8px;border-radius:9px;}.q.svelte-1b7bd5u:hover {background:var(--tm-fg-5);}.qtext.svelte-1b7bd5u {flex:1;min-width:0;display:flex;flex-direction:column;border:0;padding:0;background:none;color:inherit;text-align:left;cursor:pointer;font:inherit;}.track.svelte-1b7bd5u .qtext:where(.svelte-1b7bd5u) {cursor:default;}.qtitle.svelte-1b7bd5u {font-size:12px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.qmeta.svelte-1b7bd5u {font-size:11px;color:var(--tm-muted);margin-top:2px;}.drag.svelte-1b7bd5u {cursor:grab;}.drag.dragging.svelte-1b7bd5u {opacity:.4;}.drag.over.svelte-1b7bd5u {box-shadow:inset 0 2px 0 var(--tm-accent);}.grip.svelte-1b7bd5u {color:var(--tm-muted);opacity:.5;display:grid;flex:none;margin-right:-4px;}.moves.svelte-1b7bd5u {display:flex;flex-direction:column;opacity:0;flex:none;}.q.svelte-1b7bd5u:hover .moves:where(.svelte-1b7bd5u), .moves.svelte-1b7bd5u:focus-within {opacity:1;}.mv.svelte-1b7bd5u {width:20px;height:14px;border:0;padding:0;background:none;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;}.mv.svelte-1b7bd5u:hover:not(:disabled) {color:var(--tm-fg);}.mv.svelte-1b7bd5u:disabled {opacity:.3;cursor:default;}.rm.svelte-1b7bd5u {width:24px;height:24px;border:0;background:none;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;flex:none;border-radius:6px;}.rm.svelte-1b7bd5u:hover {color:var(--tm-fg);background:var(--tm-fg-8);}.empty.svelte-1b7bd5u {padding:24px 8px;font-size:12px;color:var(--tm-muted);text-align:center;}.art.book.svelte-1b7bd5u {aspect-ratio:0.8;width:62%;margin:0 auto;border-radius:6px 12px 12px 6px;}.prog.svelte-1b7bd5u {display:flex;align-items:center;gap:10px;margin-top:10px;}.bar.svelte-1b7bd5u {flex:1;height:4px;border-radius:2px;background:var(--tm-fg-10);display:block;}.bar.svelte-1b7bd5u span:where(.svelte-1b7bd5u) {display:block;height:4px;border-radius:2px;background:var(--tm-accent);}.pct.svelte-1b7bd5u {font-size:11px;color:var(--tm-muted);flex:none;}h3.svelte-1b7bd5u {font-size:11px;font-weight:650;letter-spacing:.6px;text-transform:uppercase;color:var(--tm-muted);margin:16px 8px 6px;}.onair.svelte-1b7bd5u {display:flex;align-items:center;gap:10px;padding:10px 8px;border-radius:10px;background:var(--tm-accent-8);}.dot.svelte-1b7bd5u {width:8px;height:8px;border-radius:50%;background:var(--tm-live);flex:none;box-shadow:0 0 0 3px color-mix(in srgb, var(--tm-live) 25%, transparent);}.ontext.svelte-1b7bd5u {min-width:0;display:flex;flex-direction:column;}.facts.svelte-1b7bd5u {display:grid;grid-template-columns:auto 1fr;gap:6px 12px;margin:8px 8px 0;font-size:12px;}.facts.svelte-1b7bd5u dt:where(.svelte-1b7bd5u) {color:var(--tm-muted);}.facts.svelte-1b7bd5u dd:where(.svelte-1b7bd5u) {margin:0;min-width:0;overflow:hidden;text-overflow:ellipsis;}.link.svelte-1b7bd5u {border:0;padding:0;background:none;color:var(--tm-accent);font:inherit;cursor:pointer;text-align:left;}.desc.svelte-1b7bd5u {font-size:12px;line-height:1.55;color:var(--tm-muted);margin:12px 8px 0;white-space:pre-line;}.add.svelte-1b7bd5u {display:flex;align-items:center;justify-content:center;gap:6px;width:100%;height:32px;margin:4px 0 8px;border:1px dashed var(--tm-fg-16);border-radius:9px;background:none;color:var(--tm-fg);font:inherit;font-size:12px;cursor:pointer;}.add.svelte-1b7bd5u:hover {background:var(--tm-fg-5);}button.q.svelte-1b7bd5u {width:100%;border:0;background:none;color:inherit;cursor:pointer;text-align:left;font:inherit;}.q.svelte-1b7bd5u .qtext:where(.svelte-1b7bd5u) {display:flex;flex-direction:column;}.ctitle.svelte-1b7bd5u {flex:1;min-width:0;}.cstate.svelte-1b7bd5u {font-size:11px;color:var(--tm-muted);flex:none;}.chap.done.svelte-1b7bd5u .ctitle:where(.svelte-1b7bd5u) {color:var(--tm-muted);}.chap.svelte-1b7bd5u {display:flex;gap:10px;width:100%;padding:8px;border:0;border-radius:8px;background:transparent;color:var(--tm-fg);cursor:pointer;text-align:left;font:inherit;font-size:12.5px;}.chap.svelte-1b7bd5u:hover {background:var(--tm-fg-5);}.chap.cur.svelte-1b7bd5u {background:var(--tm-accent-8);color:var(--tm-accent);}.t.svelte-1b7bd5u {font:500 11px ui-monospace, Menlo, monospace;color:var(--tm-muted);width:52px;flex:none;padding-top:1px;}.line.svelte-1b7bd5u {display:block;width:100%;padding:7px 8px;border:0;border-radius:8px;background:transparent;cursor:pointer;text-align:left;font:inherit;font-size:13px;line-height:1.5;color:var(--tm-fg-45);}.line.svelte-1b7bd5u:hover {background:var(--tm-fg-4);}.line.cur.svelte-1b7bd5u {color:var(--tm-fg);background:var(--tm-accent-8);}.who.svelte-1b7bd5u {display:block;font:500 10px ui-monospace, Menlo, monospace;color:var(--tm-muted);margin-bottom:2px;}"
};
function sc(e, t) {
	qe(t, !0), K(e, oc);
	let n = Y(t, "store", 7), r = /* @__PURE__ */ D(() => n().item), i = /* @__PURE__ */ D(() => n().activeRtab), a = /* @__PURE__ */ D(() => z(r)?.type === "radio" ? n().nowPlaying[z(r).stationId] : void 0), o = /* @__PURE__ */ D(() => z(r)?.type === "book" ? z(r) : null), s = /* @__PURE__ */ D(() => z(o) ? n().bookmarks[z(o).id] ?? [] : []), c = /* @__PURE__ */ D(() => z(r) ? n().durOf(z(r).id) : 0), l = /* @__PURE__ */ D(() => n().continueIds.filter((e) => e !== n().now)), u = {
		onair: "On air",
		queue: "Up next",
		chaps: "Chapters",
		trans: "Transcript",
		marks: "Bookmarks",
		about: "About"
	}, d = (e) => e === "queue" && n().queue.length ? `Up next · ${n().queue.length}` : e === "marks" && z(s).length ? `Bookmarks · ${z(s).length}` : u[e], f = /* @__PURE__ */ D(() => z(a)?.art || z(r)?.art), p = /* @__PURE__ */ D(() => z(a)?.title || z(r)?.title || "Nothing playing"), m = /* @__PURE__ */ D(() => z(r) ? z(r).type === "radio" ? z(a)?.title ? [z(a).artist, z(r).title].filter(Boolean).join(" · ") : z(r).sub : z(r).type === "book" && z(r).chapters.length > 1 && n().chapIdx >= 0 ? `${z(r).sub} · Chapter ${Mi(n().chapIdx)}` : z(r).sub : "Pick a station, episode or book."), h = /* @__PURE__ */ D(() => n().transcript?.lines ?? []), g = /* @__PURE__ */ k(void 0), _ = /* @__PURE__ */ k(null), v = /* @__PURE__ */ k(-1);
	function y(e) {
		z(_) && n().moveQueue(z(_), e), A(_, null), A(v, -1);
	}
	let ee = (e) => {
		if (!z(r) || !X(z(r))) return 0;
		let t = z(r).chapters[e];
		return t.dur || (z(r).chapters[e + 1]?.start ?? z(c)) - t.start;
	};
	bn(() => {
		z(i) === "trans" && n().transcriptKey && n().loadTranscript();
	}), bn(() => {
		let e = n().lineIdx;
		z(i) !== "trans" || e < 0 || z(g)?.querySelectorAll(".line")[e]?.scrollIntoView({
			block: "nearest",
			behavior: "smooth"
		});
	});
	let b = /* @__PURE__ */ D(() => {
		let e = n().transcript;
		return z(r) ? !e || e.state === "loading" ? "Loading transcript…" : e.state === "queued" || e.state === "running" ? "OndaCast is preparing a transcript. Check back in a few minutes." : e.state === "error" ? "The transcript could not be loaded." : "No transcript for this item yet." : "Nothing is playing.";
	});
	var x = ac(), te = M(x), S = M(te);
	let ne;
	var re = M(S), ie = (e) => {
		Na(e, {
			get hue() {
				return z(r).hue;
			},
			get art() {
				return z(f);
			},
			fill: !0,
			radius: 0,
			get mark() {
				return z(r).mark;
			},
			font: 26
		});
	}, ae = (e) => {
		H(e, ks());
	};
	W(re, (e) => {
		z(r) ? e(ie) : e(ae, -1);
	});
	var oe = F(re, 2), se = (e) => {
		var t = As(), r = P(t, !0);
		I(() => U(r, n().kindLabel)), H(e, t);
	};
	W(oe, (e) => {
		z(r) && e(se);
	}), E(S);
	var ce = F(S, 2), le = M(ce), ue = M(le), de = P(ue, !0), fe = P(F(ue), !0);
	E(le);
	var pe = F(le, 2), me = (e) => {
		co(e, {
			get store() {
				return n();
			},
			get id() {
				return z(r).id;
			},
			size: 18
		});
	};
	W(pe, (e) => {
		z(r) && e(me);
	}), E(ce);
	var he = F(ce, 2), ge = (e) => {
		var t = js(), r = M(t), i = M(r);
		let a;
		E(r);
		var o = P(F(r, 2));
		E(t), I((e, t, n) => {
			a = ai(i, "", a, { width: e }), U(o, `${t ?? ""}% · ${n ?? ""} left`);
		}, [
			() => `${Math.min(100, Math.round(n().pos / z(c) * 100))}%`,
			() => Math.min(100, Math.round(n().pos / z(c) * 100)),
			() => Yi((z(c) - n().pos) / n().speed)
		]), H(e, t);
	}, _e = /* @__PURE__ */ D(() => z(r) && X(z(r)) && z(c));
	W(he, (e) => {
		z(_e) && e(ge);
	}), E(te);
	var ve = F(te, 2), C = (e) => {
		var t = Ns();
		G(t, 20, () => n().rightTabs, (e) => e, (e, t) => {
			var r = Ms();
			let a;
			var o = P(r, !0);
			I((e) => {
				J(r, "aria-selected", z(i) === t), a = q(r, 1, "svelte-1b7bd5u", null, a, { on: z(i) === t }), U(o, e);
			}, [() => d(t)]), B("click", r, () => n().rtab = t), H(e, r);
		}), E(t), H(e, t);
	};
	W(ve, (e) => {
		z(r) && e(C);
	});
	var ye = F(ve, 2), be = M(ye), xe = (e) => {
		var t = Is(), r = F(N(t), 2), i = (e) => {
			var t = Fs();
			G(F(N(t), 2), 16, () => z(l), (e) => e, (e, t) => {
				let r = /* @__PURE__ */ D(() => n().items[t]);
				var i = Nr(), a = N(i), o = (e) => {
					var i = Ps(), a = M(i);
					Na(a, {
						get hue() {
							return z(r).hue;
						},
						get art() {
							return z(r).art;
						},
						get mark() {
							return z(r).mark;
						},
						size: 34,
						radius: 7,
						font: 9
					});
					var o = F(a, 2), s = M(o), c = P(s, !0), l = P(F(s));
					E(o), E(i), I((e) => {
						U(c, z(r).title), U(l, `${ki[z(r).type] ?? ""} · ${e ?? ""}`);
					}, [() => n().leftOf(t)]), B("click", i, () => n().play(t)), H(e, i);
				};
				W(a, (e) => {
					z(r) && e(o);
				}), H(e, i);
			}), H(e, t);
		};
		W(r, (e) => {
			z(l).length && e(i);
		}), H(e, t);
	}, Se = (e) => {
		var t = Hs(), n = N(t), i = F(M(n), 2), o = (e) => {
			var t = Ls(), n = M(t), i = P(n, !0), o = P(F(n), !0);
			E(t), I(() => {
				U(i, z(a).title), U(o, z(a).artist || z(r).title);
			}), H(e, t);
		}, s = (e) => {
			var t = Rs(), n = P(M(t), !0);
			De(), E(t), I(() => U(n, z(r).title)), H(e, t);
		};
		W(i, (e) => {
			z(a)?.title ? e(o) : e(s, -1);
		}), E(n);
		var c = F(n, 4), l = F(M(c)), u = P(l, !0), d = F(l, 2), f = (e) => {
			var t = zs(), n = P(F(N(t)), !0);
			I((e) => U(n, e), [() => z(r).sub.split(" · ")[0]]), H(e, t);
		};
		W(d, (e) => {
			z(r).sub && e(f);
		}), E(c);
		var p = F(c, 2), m = (e) => {
			var t = Vs();
			G(F(N(t), 2), 17, () => z(a).recent, Wr, (e, t) => {
				var n = Bs(), i = M(n);
				{
					let e = /* @__PURE__ */ D(() => z(t).title.slice(0, 2).toUpperCase());
					Na(i, {
						get hue() {
							return z(r).hue;
						},
						get art() {
							return z(t).art;
						},
						get mark() {
							return z(e);
						},
						size: 34,
						radius: 7,
						font: 9
					});
				}
				var a = F(i, 2), o = M(a), s = P(o, !0), c = P(F(o), !0);
				E(a), E(n), I((e) => {
					U(s, z(t).title), U(c, e);
				}, [() => [z(t).artist, Zi(z(t).at)].filter(Boolean).join(" · ")]), H(e, n);
			}), H(e, t);
		};
		W(p, (e) => {
			z(a)?.recent.length && e(m);
		}), I(() => U(u, z(r).genre)), H(e, t);
	}, Ce = (e) => {
		var t = Nr();
		G(N(t), 18, () => n().queue, (e) => e, (e, t, r) => {
			let i = /* @__PURE__ */ D(() => n().items[t]);
			var a = Nr(), o = N(a), s = (e) => {
				var a = Us();
				let o;
				var s = M(a);
				$(M(s), {
					get d() {
						return Q.grip;
					},
					size: 14,
					stroke: 2.4
				}), E(s);
				var c = F(s, 2);
				Na(c, {
					get hue() {
						return z(i).hue;
					},
					get art() {
						return z(i).art;
					},
					get mark() {
						return z(i).mark;
					},
					size: 34,
					radius: 7,
					font: 9
				});
				var l = F(c, 2), u = M(l), d = P(u, !0), f = P(F(u));
				E(l);
				var p = F(l, 2), m = M(p);
				$(M(m), {
					get d() {
						return Q.up;
					},
					size: 11,
					stroke: 2.2
				}), E(m);
				var h = F(m, 2);
				$(M(h), {
					get d() {
						return Q.down;
					},
					size: 11,
					stroke: 2.2
				}), E(h), E(p);
				var g = F(p, 2);
				$(M(g), {
					get d() {
						return Q.close;
					},
					size: 12,
					stroke: 2
				}), E(g), E(a), I((e) => {
					o = q(a, 1, "q drag svelte-1b7bd5u", null, o, {
						dragging: z(_) === t,
						over: z(v) === z(r) && z(_) !== t
					}), U(d, z(i).title), U(f, `${ki[z(i).type] ?? ""}${e ?? ""}`), J(m, "aria-label", `Move ${z(i).title ?? ""} up`), m.disabled = z(r) === 0, J(h, "aria-label", `Move ${z(i).title ?? ""} down`), h.disabled = z(r) === n().queue.length - 1, J(g, "aria-label", `Remove ${z(i).title ?? ""} from queue`);
				}, [() => n().lenOf(t) ? ` · ${n().lenOf(t)}` : ""]), xr("dragstart", a, (e) => {
					A(_, t, !0), e.dataTransfer?.setData("text/plain", t);
				}), xr("dragover", a, (e) => {
					e.preventDefault(), A(v, z(r), !0);
				}), xr("dragleave", a, () => {
					z(v) === z(r) && A(v, -1);
				}), xr("drop", a, (e) => {
					e.preventDefault(), y(z(r));
				}), xr("dragend", a, () => {
					A(_, null), A(v, -1);
				}), B("click", l, () => n().play(t)), B("click", m, () => n().moveQueue(t, z(r) - 1)), B("click", h, () => n().moveQueue(t, z(r) + 1)), B("click", g, () => n().removeFromQueue(t)), H(e, a);
			};
			W(o, (e) => {
				z(i) && e(s);
			}), H(e, a);
		}, (e) => {
			H(e, Ws());
		}), H(e, t);
	}, w = (e) => {
		var t = Nr(), i = N(t), a = (e) => {
			var t = Nr();
			G(N(t), 17, () => z(r).chapters, Wr, (e, t, i) => {
				let a = /* @__PURE__ */ D(() => ee(i)), o = /* @__PURE__ */ D(() => i === n().chapIdx);
				var s = Gs();
				let c;
				var l = M(s), u = P(l, !0), d = F(l, 2), f = P(d, !0), p = P(F(d, 2), !0);
				E(s), I((e, r) => {
					c = q(s, 1, "chap svelte-1b7bd5u", null, c, {
						cur: z(o),
						done: i < n().chapIdx
					}), U(u, e), U(f, z(t).title), U(p, r);
				}, [() => z(r).type === "book" ? Mi(i) : Ji(z(t).start), () => i < n().chapIdx ? "Done" : z(o) && z(a) ? `${Math.min(100, Math.round((n().pos - z(t).start) / z(a) * 100))}%` : z(a) ? Yi(z(a)) : ""]), B("click", s, () => n().seekTo(z(t).start)), H(e, s);
			}), H(e, t);
		}, o = /* @__PURE__ */ D(() => X(z(r)) && z(r).chapters.length), s = (e) => {
			var t = Ks(), n = P(t, !0);
			I(() => U(n, z(r).type === "book" ? "Loading chapters…" : "This episode has no chapters.")), H(e, t);
		};
		W(i, (e) => {
			z(o) ? e(a) : e(s, -1);
		}), H(e, t);
	}, we = (e) => {
		var t = Ys(), r = N(t);
		$(M(r), {
			get d() {
				return Q.plus;
			},
			size: 12,
			stroke: 2
		}), De(), E(r), G(F(r, 2), 17, () => z(s), (e) => e.at, (e, t) => {
			var r = qs(), i = M(r), a = M(i), s = P(a, !0), c = P(F(a), !0);
			E(i);
			var l = F(i, 2);
			$(M(l), {
				get d() {
					return Q.close;
				},
				size: 12,
				stroke: 2
			}), E(l), E(r), I((e) => {
				U(s, z(t).label), U(c, e), J(l, "aria-label", `Remove bookmark ${z(t).label ?? ""}`);
			}, [() => new Date(z(t).at).toLocaleString()]), B("click", i, () => n().jumpTo(z(o).id, z(t).pos)), B("click", l, () => n().removeBookmark(z(o).id, z(t).at)), H(e, r);
		}, (e) => {
			H(e, Js());
		}), B("click", r, () => n().bookmark(z(o).id)), H(e, t);
	}, T = (e) => {
		var t = nc(), i = N(t), a = (e) => {
			var t = Qs(), n = F(M(t)), i = P(n, !0), a = F(n, 2), o = (e) => {
				var t = Xs(), n = P(F(N(t)), !0);
				I((e) => U(n, e), [() => Yi(z(r).dur)]), H(e, t);
			};
			W(a, (e) => {
				z(r).dur && e(o);
			});
			var s = F(a, 2), c = (e) => {
				var t = Zs(), n = P(F(N(t)), !0);
				I(() => U(n, z(r).chapters.length)), H(e, t);
			};
			W(s, (e) => {
				z(r).chapters.length && e(c);
			}), De(3), E(t), I(() => U(i, z(r).sub)), H(e, t);
		}, o = (e) => {
			var t = ec(), i = F(M(t)), a = M(i), o = P(a, !0);
			E(i);
			var s = F(i, 2), l = (e) => {
				var t = $s(), n = P(F(N(t)), !0);
				I((e) => U(n, e), [() => new Date(z(r).date).toLocaleDateString()]), H(e, t);
			};
			W(s, (e) => {
				z(r).date && e(l);
			});
			var u = F(s, 2), d = (e) => {
				var t = Xs(), n = P(F(N(t)), !0);
				I((e) => U(n, e), [() => Yi(z(c))]), H(e, t);
			};
			W(u, (e) => {
				z(c) && e(d);
			}), E(t), I(() => U(o, z(r).sub)), B("click", a, () => n().openShow(z(r).show)), H(e, t);
		};
		W(i, (e) => {
			z(r).type === "book" ? e(a) : z(r).type === "podcast" && e(o, 1);
		});
		var s = F(i, 2), u = (e) => {
			var t = tc(), n = P(t, !0);
			I(() => U(n, z(r).desc)), H(e, t);
		}, d = /* @__PURE__ */ D(() => X(z(r)) && z(r).desc);
		W(s, (e) => {
			z(d) && e(u);
		});
		var f = F(s, 2), p = (e) => {
			var t = Fs();
			G(F(N(t), 2), 16, () => z(l), (e) => e, (e, t) => {
				let r = /* @__PURE__ */ D(() => n().items[t]);
				var i = Nr(), a = N(i), o = (e) => {
					var i = Ps(), a = M(i);
					Na(a, {
						get hue() {
							return z(r).hue;
						},
						get art() {
							return z(r).art;
						},
						get mark() {
							return z(r).mark;
						},
						size: 34,
						radius: 7,
						font: 9
					});
					var o = F(a, 2), s = M(o), c = P(s, !0), l = P(F(s));
					E(o), E(i), I((e) => {
						U(c, z(r).title), U(l, `${ki[z(r).type] ?? ""} · ${e ?? ""}`);
					}, [() => n().leftOf(t)]), B("click", i, () => n().play(t)), H(e, i);
				};
				W(a, (e) => {
					z(r) && e(o);
				}), H(e, i);
			}), H(e, t);
		};
		W(f, (e) => {
			z(l).length && e(p);
		}), H(e, t);
	}, Te = (e) => {
		var t = ic();
		G(t, 21, () => z(h), Wr, (e, t, r) => {
			var i = rc();
			let a;
			var o = M(i), s = P(o), c = F(o, 1, !0);
			E(i), I((e) => {
				a = q(i, 1, "line svelte-1b7bd5u", null, a, { cur: r === n().lineIdx }), U(s, `${z(t).who ? `${z(t).who} · ` : ""}${e ?? ""}`), U(c, z(t).text);
			}, [() => Ji(z(t).t)]), B("click", i, () => n().seekTo(z(t).t)), H(e, i);
		}, (e) => {
			var t = Ks(), n = P(t, !0);
			I(() => U(n, z(b))), H(e, t);
		}), E(t), Di(t, (e) => A(g, e), () => z(g)), H(e, t);
	};
	W(be, (e) => {
		z(r) ? z(i) === "onair" && z(r).type === "radio" ? e(Se, 1) : z(i) === "queue" ? e(Ce, 2) : z(i) === "chaps" ? e(w, 3) : z(i) === "marks" && z(o) ? e(we, 4) : z(i) === "about" ? e(T, 5) : z(i) === "trans" && e(Te, 6) : e(xe);
	}), E(ye), E(x), I(() => {
		ne = q(S, 1, "art svelte-1b7bd5u", null, ne, { book: z(r)?.type === "book" }), U(de, z(p)), U(fe, z(m));
	}), H(e, x), Je();
}
Sr(["click"]);
//#endregion
//#region src/components/SeekBar.svelte
var cc = /* @__PURE__ */ V("<div class=\"tick svelte-qmop01\"></div>"), lc = /* @__PURE__ */ V("<div role=\"slider\" aria-label=\"Playback position\"><div class=\"track svelte-qmop01\"><div class=\"fill svelte-qmop01\"></div> <!></div></div>"), uc = {
	hash: "svelte-qmop01",
	code: ".seek.svelte-qmop01 {flex:1;display:flex;align-items:center;cursor:pointer;border-radius:4px;}.seek.live.svelte-qmop01 {cursor:default;}.seek.svelte-qmop01:focus-visible {outline:2px solid var(--tm-accent);outline-offset:2px;}.track.svelte-qmop01 {flex:1;height:4px;border-radius:2px;background:var(--tm-fg-12);position:relative;}.fill.svelte-qmop01 {position:absolute;left:0;top:0;bottom:0;border-radius:2px;background:var(--tm-accent);}.live.svelte-qmop01 .fill:where(.svelte-qmop01) {opacity:.55;}.tick.svelte-qmop01 {position:absolute;top:-1px;width:2px;height:6px;background:var(--tm-panel);}"
};
function dc(e, t) {
	qe(t, !0), K(e, uc);
	let n = Y(t, "height", 3, 14), r = Y(t, "ticks", 3, !1), i = /* @__PURE__ */ D(() => t.store.item), a = /* @__PURE__ */ D(() => z(i) ? t.store.durOf(z(i).id) : 0), o = /* @__PURE__ */ D(() => !!z(i) && X(z(i)) && z(a) > 0), s = /* @__PURE__ */ D(() => z(i) ? X(z(i)) ? z(a) ? Math.min(100, t.store.pos / z(a) * 100) : 0 : 100 : 0), c = /* @__PURE__ */ D(() => r() && z(i) && X(z(i)) && z(a) ? z(i).chapters.slice(1).map((e) => e.start / z(a) * 100) : []);
	function l(e) {
		if (!z(o)) return;
		let n = e.currentTarget.getBoundingClientRect();
		t.store.seekFraction((e.clientX - n.left) / n.width);
	}
	function u(e) {
		if (!z(o)) return;
		let n = {
			ArrowLeft: -15,
			ArrowRight: 30,
			PageDown: -60,
			PageUp: 60
		}[e.key];
		n ? (e.preventDefault(), t.store.skip(n)) : e.key === "Home" ? (e.preventDefault(), t.store.seekFraction(0)) : e.key === "End" && (e.preventDefault(), t.store.seekFraction(1));
	}
	var d = lc();
	let f;
	J(d, "aria-valuemin", 0), J(d, "aria-valuemax", 100);
	let p;
	var m = M(d), h = M(m);
	let g;
	G(F(h, 2), 17, () => z(c), Wr, (e, t) => {
		var n = cc();
		let r;
		I(() => r = ai(n, "", r, { left: `${z(t) ?? ""}%` })), H(e, n);
	}), E(m), E(d), I((e, t) => {
		f = q(d, 1, "seek svelte-qmop01", null, f, { live: !z(o) }), J(d, "tabindex", z(o) ? 0 : -1), J(d, "aria-disabled", !z(o)), J(d, "aria-valuenow", e), J(d, "aria-valuetext", t), p = ai(d, "", p, { height: `${n() ?? ""}px` }), g = ai(h, "", g, { width: `${z(s) ?? ""}%` });
	}, [() => Math.round(z(s)), () => z(o) ? `${Ji(t.store.pos)} of ${Ji(z(a))}` : "Live"]), B("click", d, l), B("keydown", d, u), H(e, d), Je();
}
Sr(["click", "keydown"]);
//#endregion
//#region src/components/SleepPopover.svelte
var fc = /* @__PURE__ */ V("<button> </button>"), pc = /* @__PURE__ */ V("<div class=\"tm-pop\" role=\"dialog\" aria-label=\"Sleep timer\"><div class=\"title svelte-1mpzphw\">Sleep timer</div> <div class=\"hint svelte-1mpzphw\">Audio fades out over the last minute.</div> <div class=\"grid svelte-1mpzphw\"></div> <button> </button> <button class=\"off svelte-1mpzphw\">Turn off</button></div>"), mc = {
	hash: "svelte-1mpzphw",
	code: ".title.svelte-1mpzphw {font-size:13px;font-weight:650;}.hint.svelte-1mpzphw {font-size:11px;color:var(--tm-muted);margin-top:2px;}.grid.svelte-1mpzphw {display:grid;grid-template-columns:repeat(3, 1fr);gap:6px;margin-top:12px;}.opt.svelte-1mpzphw {height:34px;border-radius:9px;border:0;background:var(--tm-fg-6);color:var(--tm-fg);font-size:12px;font-weight:600;cursor:pointer;}.opt.svelte-1mpzphw:hover {background:var(--tm-fg-10);}.opt.sel.svelte-1mpzphw {background:var(--tm-accent);color:var(--tm-on-accent);}.wide.svelte-1mpzphw {width:100%;margin-top:6px;}.off.svelte-1mpzphw {width:100%;height:30px;margin-top:6px;border:0;background:none;color:var(--tm-muted);font-size:12px;cursor:pointer;}.off.svelte-1mpzphw:hover {color:var(--tm-fg);}"
};
function hc(e, t) {
	qe(t, !0), K(e, mc);
	let n = (e) => typeof t.store.sleep == "number" && Math.ceil(t.store.sleep / 60) === e;
	var r = pc(), i = F(M(r), 4);
	G(i, 21, () => Sa, Wr, (e, r) => {
		var i = fc();
		let a;
		var o = P(i);
		I((e) => {
			a = q(i, 1, "opt svelte-1mpzphw", null, a, { sel: e }), U(o, `${z(r) ?? ""} min`);
		}, [() => n(z(r))]), B("click", i, () => t.store.setSleepMinutes(z(r))), H(e, i);
	}), E(i);
	var a = F(i, 2);
	let o;
	var s = P(a, !0), c = F(a, 2);
	E(r), I(() => {
		ai(r, t.pos), o = q(a, 1, "opt wide svelte-1mpzphw", null, o, { sel: t.store.sleep === "chapter" }), U(s, t.store.live ? "End of current show" : t.store.chapters.length > 1 ? "End of chapter" : "End of episode");
	}), B("click", a, () => t.store.sleepAtEnd()), B("click", c, () => t.store.sleepOff()), H(e, r), Je();
}
Sr(["click"]);
//#endregion
//#region src/components/SpeedPopover.svelte
var gc = /* @__PURE__ */ V("<button> </button>"), _c = /* @__PURE__ */ V("<div class=\"tm-pop\" role=\"dialog\" aria-label=\"Playback speed\"><div class=\"head svelte-1xvntbg\"><span class=\"title svelte-1xvntbg\">Playback speed</span><span class=\"now svelte-1xvntbg\"> </span></div> <div class=\"hint svelte-1xvntbg\"> </div> <div class=\"grid svelte-1xvntbg\"></div></div>"), vc = {
	hash: "svelte-1xvntbg",
	code: ".head.svelte-1xvntbg {display:flex;align-items:baseline;justify-content:space-between;}.title.svelte-1xvntbg {font-size:13px;font-weight:650;}.now.svelte-1xvntbg {font:600 12px ui-monospace, Menlo, monospace;color:var(--tm-accent);}.hint.svelte-1xvntbg {font-size:11px;color:var(--tm-muted);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.grid.svelte-1xvntbg {display:grid;grid-template-columns:repeat(4, 1fr);gap:6px;margin-top:12px;}.opt.svelte-1xvntbg {height:32px;border-radius:9px;border:0;background:var(--tm-fg-6);color:var(--tm-fg);font:600 11.5px ui-monospace, Menlo, monospace;cursor:pointer;}.opt.svelte-1xvntbg:hover {background:var(--tm-fg-10);}.opt.sel.svelte-1xvntbg {background:var(--tm-accent);color:var(--tm-on-accent);}"
};
function yc(e, t) {
	qe(t, !0), K(e, vc);
	var n = _c(), r = M(n), i = P(F(M(r)));
	E(r);
	var a = F(r, 2), o = P(a), s = F(a, 2);
	G(s, 21, () => xa, Wr, (e, n) => {
		var r = gc();
		let i;
		var a = P(r);
		I((e) => {
			i = q(r, 1, "opt svelte-1xvntbg", null, i, { sel: t.store.speed === z(n) }), U(a, `${e ?? ""}×`);
		}, [() => z(n).toFixed(1)]), B("click", r, () => t.store.setSpeed(z(n))), H(e, r);
	}), E(s), E(n), I((e) => {
		ai(n, t.pos), U(i, `${e ?? ""}×`), U(o, `Remembered for ${t.store.speedScope ?? ""}.`);
	}, [() => t.store.speed.toFixed(1)]), H(e, n), Je();
}
Sr(["click"]);
//#endregion
//#region src/components/PlayerBar.svelte
var bc = /* @__PURE__ */ V("<div class=\"thumb svelte-y66ne\"></div>"), xc = /* @__PURE__ */ V("<span class=\"live svelte-y66ne\">LIVE</span>"), Sc = /* @__PURE__ */ V("<span class=\"time r svelte-y66ne\"> </span>"), Cc = /* @__PURE__ */ V("<footer class=\"bar svelte-y66ne\"><div class=\"now svelte-y66ne\"><!> <div class=\"ntext svelte-y66ne\"><div class=\"ntitle svelte-y66ne\"> </div><div class=\"nsub svelte-y66ne\"> </div></div> <!></div> <div class=\"center svelte-y66ne\"><div class=\"controls svelte-y66ne\"><button class=\"skipc svelte-y66ne\" aria-label=\"Previous chapter\"><!></button> <button class=\"jump svelte-y66ne\"> </button> <button><!></button> <button class=\"jump svelte-y66ne\"> </button> <button class=\"skipc svelte-y66ne\" aria-label=\"Next in queue\"><!></button></div> <div class=\"timeline svelte-y66ne\"><span class=\"time l svelte-y66ne\"> </span> <!> <!></div></div> <div class=\"tools svelte-y66ne\"><button data-pop=\"\" aria-haspopup=\"dialog\"> </button> <button data-pop=\"\" title=\"Sleep timer\" aria-haspopup=\"dialog\"><!> </button> <button class=\"clip svelte-y66ne\" title=\"Clip to Notes\"><!></button> <div class=\"vol svelte-y66ne\"><button class=\"mute svelte-y66ne\"><!></button> <div class=\"vtrack svelte-y66ne\" role=\"slider\" tabindex=\"0\" aria-label=\"Volume\"><div class=\"vfill svelte-y66ne\"></div></div></div></div> <!> <!></footer>"), wc = {
	hash: "svelte-y66ne",
	code: ".bar.svelte-y66ne {height:84px;flex:none;display:flex;align-items:center;gap:18px;padding:0 18px;background:var(--tm-panel);border-top:1px solid var(--tm-fg-7);position:relative;}.now.svelte-y66ne {width:240px;display:flex;align-items:center;gap:11px;min-width:0;flex:none;}.thumb.svelte-y66ne {width:46px;height:46px;border-radius:9px;flex:none;background:var(--tm-fg-6);}.ntext.svelte-y66ne {min-width:0;flex:1;}.ntitle.svelte-y66ne {font-size:12.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.nsub.svelte-y66ne {font-size:11px;color:var(--tm-muted);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.center.svelte-y66ne {flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;gap:6px;}.controls.svelte-y66ne {display:flex;align-items:center;justify-content:center;gap:14px;}button.svelte-y66ne:disabled {opacity:.35;cursor:default;}.skipc.svelte-y66ne {width:30px;height:30px;border:0;background:none;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;}.skipc.svelte-y66ne:hover:not(:disabled) {color:var(--tm-fg);}.jump.svelte-y66ne {width:32px;height:32px;border:0;background:none;color:var(--tm-fg);cursor:pointer;font:600 10.5px ui-monospace, Menlo, monospace;border-radius:16px;}.jump.svelte-y66ne:hover:not(:disabled) {background:var(--tm-fg-8);}.pp.svelte-y66ne {width:50px;height:50px;flex:none;padding:0;border:0;border-radius:50%;background:var(--tm-fg);color:var(--tm-bg);cursor:pointer;display:grid;place-items:center;position:relative;transition:transform .1s;}\n  /* The play triangle's visual centre sits left of its box. */.pp.paused.svelte-y66ne svg {transform:translateX(1.5px);}.pp.svelte-y66ne:hover:not(:disabled) {filter:brightness(1.12);transform:scale(1.04);}.pp.svelte-y66ne:active:not(:disabled) {transform:scale(.96);}.pp.busy.svelte-y66ne::after {content:'';position:absolute;inset:-4px;border-radius:50%;border:2px solid transparent;border-top-color:var(--tm-accent); animation: svelte-y66ne-spin .9s linear infinite;}\n  @keyframes svelte-y66ne-spin { to { transform: rotate(360deg); } }\n  @media (prefers-reduced-motion: reduce) {.pp.svelte-y66ne {transition:none;}.pp.busy.svelte-y66ne::after { animation: none;border-color:var(--tm-accent);} }.timeline.svelte-y66ne {display:flex;align-items:center;gap:10px;width:100%;max-width:440px;}.time.svelte-y66ne {font:500 10.5px ui-monospace, Menlo, monospace;color:var(--tm-muted);width:52px;flex:none;}.time.l.svelte-y66ne {text-align:right;}.live.svelte-y66ne {width:52px;height:20px;flex:none;display:grid;place-items:center;border-radius:10px;background:var(--tm-live);color:#fff;font-size:9.5px;font-weight:700;letter-spacing:.8px;}.tools.svelte-y66ne {width:240px;flex:none;display:flex;align-items:center;justify-content:flex-end;gap:6px;}.speed.svelte-y66ne {height:30px;min-width:44px;padding:0 8px;border:0;border-radius:8px;background:transparent;color:var(--tm-fg);font:600 11.5px ui-monospace, Menlo, monospace;cursor:pointer;}.speed.on.svelte-y66ne {background:var(--tm-accent-14);}.sleep.svelte-y66ne {height:30px;padding:0 8px;border:0;border-radius:8px;background:transparent;color:var(--tm-fg);cursor:pointer;display:flex;align-items:center;gap:5px;font:600 11px ui-monospace, Menlo, monospace;}.sleep.on.svelte-y66ne {background:var(--tm-accent-14);color:var(--tm-accent);}.speed.svelte-y66ne:hover:not(:disabled), .sleep.svelte-y66ne:hover:not(:disabled), .clip.svelte-y66ne:hover:not(:disabled) {background:var(--tm-fg-10);}.clip.svelte-y66ne {height:30px;width:32px;border:0;border-radius:8px;background:transparent;color:var(--tm-fg);cursor:pointer;display:grid;place-items:center;}.vol.svelte-y66ne {display:flex;align-items:center;gap:6px;margin-left:4px;color:var(--tm-muted);}.mute.svelte-y66ne {border:0;background:none;padding:0;color:inherit;cursor:pointer;display:grid;place-items:center;}.mute.svelte-y66ne:hover {color:var(--tm-fg);}.vtrack.svelte-y66ne {width:64px;height:12px;display:flex;align-items:center;cursor:pointer;position:relative;background:linear-gradient(var(--tm-fg-12), var(--tm-fg-12)) center / 100% 4px no-repeat;border-radius:2px;}.vfill.svelte-y66ne {height:4px;border-radius:2px;background:var(--tm-fg);}.vtrack.svelte-y66ne:focus-visible {outline:2px solid var(--tm-accent);outline-offset:2px;}"
};
function Tc(e, t) {
	qe(t, !0), K(e, wc);
	let n = /* @__PURE__ */ D(() => t.store.item), r = /* @__PURE__ */ D(() => !!z(n) && X(z(n))), i = /* @__PURE__ */ D(() => z(n) ? t.store.durOf(z(n).id) : 0), a = /* @__PURE__ */ D(() => typeof t.store.sleep == "number" ? Ji(t.store.sleep) : t.store.sleep === "chapter" ? "End" : ""), o = /* @__PURE__ */ D(() => t.store.buffering || t.store.loadingItem), s = /* @__PURE__ */ D(() => z(n)?.type === "radio" ? t.store.nowPlaying[z(n).stationId] : void 0), c = /* @__PURE__ */ D(() => t.store.playing ? t.store.live ? "Stop" : "Pause" : "Play"), l = /* @__PURE__ */ D(() => t.store.playing ? t.store.live ? Q.stop : Q.pause : Q.play);
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
	var f = Cc(), p = M(f), m = M(p), h = (e) => {
		{
			let t = /* @__PURE__ */ D(() => z(s)?.art || z(n).art);
			Na(e, {
				get hue() {
					return z(n).hue;
				},
				get art() {
					return z(t);
				},
				get mark() {
					return z(n).mark;
				},
				size: 46,
				radius: 9
			});
		}
	}, g = (e) => {
		H(e, bc());
	};
	W(m, (e) => {
		z(n) ? e(h) : e(g, -1);
	});
	var _ = F(m, 2), v = M(_), y = P(v, !0), ee = P(F(v), !0);
	E(_);
	var b = F(_, 2), x = (e) => {
		co(e, {
			get store() {
				return t.store;
			},
			get id() {
				return z(n).id;
			}
		});
	};
	W(b, (e) => {
		z(n) && e(x);
	}), E(p);
	var te = F(p, 2), S = M(te), ne = M(S);
	$(M(ne), { get d() {
		return Q.prev;
	} }), E(ne);
	var re = F(ne, 2), ie = P(re), ae = F(re, 2);
	let oe;
	$(M(ae), {
		get d() {
			return z(l);
		},
		size: 22
	}), E(ae);
	var se = F(ae, 2), ce = P(se), le = F(se, 2);
	$(M(le), { get d() {
		return Q.next;
	} }), E(le), E(S);
	var ue = F(S, 2), de = M(ue), fe = P(de, !0), pe = F(de, 2);
	dc(pe, {
		get store() {
			return t.store;
		},
		ticks: !0
	});
	var me = F(pe, 2), he = (e) => {
		H(e, xc());
	}, ge = (e) => {
		var n = Sc(), r = P(n, !0);
		I((e) => U(r, e), [() => z(i) ? `−${Ji(sa(z(i), t.store.pos, t.store.speed))}` : ""]), H(e, n);
	};
	W(me, (e) => {
		z(n) && !z(r) ? e(he) : e(ge, -1);
	}), E(ue), E(te);
	var _e = F(te, 2), ve = M(_e);
	let C;
	var ye = P(ve), be = F(ve, 2);
	let xe;
	var Se = M(be);
	$(Se, {
		get d() {
			return Q.moon;
		},
		size: 15,
		stroke: 1.8
	});
	var Ce = F(Se, 1, !0);
	E(be);
	var w = F(be, 2);
	$(M(w), {
		get d() {
			return Q.clip;
		},
		size: 15,
		stroke: 1.8
	}), E(w);
	var we = F(w, 2), T = M(we), Te = M(T);
	{
		let e = /* @__PURE__ */ D(() => t.store.muted ? Q.muted : Q.volume);
		$(Te, {
			get d() {
				return z(e);
			},
			size: 15,
			stroke: 1.8
		});
	}
	E(T);
	var Ee = F(T, 2);
	J(Ee, "aria-valuemin", 0), J(Ee, "aria-valuemax", 100);
	var De = M(Ee);
	let Oe;
	E(Ee), E(we), E(_e);
	var ke = F(_e, 2), Ae = (e) => {
		hc(e, {
			get store() {
				return t.store;
			},
			pos: "right:60px;bottom:74px"
		});
	};
	W(ke, (e) => {
		t.store.pop === "sleep" && e(Ae);
	});
	var je = F(ke, 2), Me = (e) => {
		yc(e, {
			get store() {
				return t.store;
			},
			pos: "right:110px;bottom:74px"
		});
	};
	W(je, (e) => {
		t.store.pop === "speed" && e(Me);
	}), E(f), I((e, i, l, u, d) => {
		U(y, z(s)?.title || z(n)?.title || "Nothing playing"), U(ee, e), ne.disabled = !z(r), J(re, "aria-label", `Back ${t.store.prefs.back ?? ""} seconds`), re.disabled = !z(r), U(ie, `−${t.store.prefs.back ?? ""}`), oe = q(ae, 1, "pp svelte-y66ne", null, oe, {
			busy: z(o),
			paused: !t.store.playing
		}), J(ae, "aria-label", z(c)), J(ae, "title", z(c)), ae.disabled = !z(n), J(se, "aria-label", `Forward ${t.store.prefs.fwd ?? ""} seconds`), se.disabled = !z(r), U(ce, `+${t.store.prefs.fwd ?? ""}`), le.disabled = !t.store.queue.length, U(fe, i), C = q(ve, 1, "speed svelte-y66ne", null, C, { on: t.store.speed !== 1 && z(r) }), ve.disabled = !z(n), J(ve, "aria-expanded", t.store.pop === "speed"), J(ve, "aria-label", `Playback speed ${l ?? ""}×`), U(ye, `${u ?? ""}×`), xe = q(be, 1, "sleep svelte-y66ne", null, xe, { on: !!t.store.sleep }), be.disabled = !z(n), J(be, "aria-expanded", t.store.pop === "sleep"), J(be, "aria-label", `Sleep timer${z(a) ? `: ${z(a)}` : ""}`), U(Ce, z(a)), J(w, "aria-label", z(r) ? "Clip the last 30 seconds to Notes" : "Save what is playing to Notes"), w.disabled = !z(n), J(T, "aria-label", t.store.muted ? "Unmute" : "Mute"), J(Ee, "aria-valuenow", d), Oe = ai(De, "", Oe, { width: `${(t.store.muted ? 0 : t.store.volume) * 100}%` });
	}, [
		() => z(n) ? z(s)?.title ? [z(s).artist, z(n).title].filter(Boolean).join(" · ") : t.store.subtitle : "Choose something to listen to",
		() => z(n) ? z(r) ? Ji(t.store.pos) : "On air" : "",
		() => t.store.speed.toFixed(1),
		() => z(r) ? t.store.speed.toFixed(1) : "1.0",
		() => Math.round((t.store.muted ? 0 : t.store.volume) * 100)
	]), B("click", ne, () => t.store.previous()), B("click", re, () => t.store.skip(-t.store.prefs.back)), B("click", ae, () => t.store.toggle()), B("click", se, () => t.store.skip(t.store.prefs.fwd)), B("click", le, () => t.store.next()), B("click", ve, () => t.store.togglePop("speed")), B("click", be, () => t.store.togglePop("sleep")), B("click", w, () => t.store.clip()), B("click", T, () => t.store.toggleMute()), B("click", Ee, u), B("keydown", Ee, d), H(e, f), Je();
}
Sr(["click", "keydown"]);
//#endregion
//#region src/components/MiniPlayer.svelte
var Ec = /* @__PURE__ */ V("<div class=\"blank svelte-1jla3sy\"></div>"), Dc = /* @__PURE__ */ V("<span class=\"kind svelte-1jla3sy\"> </span>"), Oc = /* @__PURE__ */ V("<div class=\"chapter svelte-1jla3sy\"><span class=\"svelte-1jla3sy\">Chapter</span><br/> </div>"), kc = /* @__PURE__ */ V("<span class=\"liveword svelte-1jla3sy\">LIVE</span>"), Ac = /* @__PURE__ */ V("<span> </span>"), jc = /* @__PURE__ */ V("<div class=\"sleepnote svelte-1jla3sy\"> </div>"), Mc = /* @__PURE__ */ V("<button class=\"svelte-1jla3sy\">Clip to Notes</button>"), Nc = /* @__PURE__ */ V("<button class=\"q svelte-1jla3sy\"><!> <span class=\"qtext svelte-1jla3sy\"><span class=\"qtitle svelte-1jla3sy\"> </span><span class=\"qmeta svelte-1jla3sy\"> </span></span></button>"), Pc = /* @__PURE__ */ V("<div class=\"empty svelte-1jla3sy\">Widen the panel to browse radio, podcasts and audiobooks.</div>"), Fc = /* @__PURE__ */ V("<div class=\"mini svelte-1jla3sy\"><div class=\"head svelte-1jla3sy\"><span class=\"np svelte-1jla3sy\">Now playing</span><span class=\"spacer svelte-1jla3sy\"></span><span class=\"by svelte-1jla3sy\">OndaCast</span></div> <div class=\"player svelte-1jla3sy\"><div class=\"art svelte-1jla3sy\"><!> <!> <!></div> <div class=\"trow svelte-1jla3sy\"><div class=\"title svelte-1jla3sy\"> </div><!></div> <div class=\"sub svelte-1jla3sy\"> </div> <div class=\"seek svelte-1jla3sy\"><!></div> <div class=\"times svelte-1jla3sy\"><span> </span> <!></div> <div class=\"controls svelte-1jla3sy\"><button class=\"chipbtn svelte-1jla3sy\" data-pop=\"\" aria-haspopup=\"dialog\"> </button> <button class=\"jump svelte-1jla3sy\"> </button> <button><!></button> <button class=\"jump svelte-1jla3sy\"> </button> <button data-pop=\"\" aria-haspopup=\"dialog\" aria-label=\"Sleep timer\"><!></button></div> <!> <!> <!></div> <div class=\"upnext svelte-1jla3sy\"><div class=\"uphead svelte-1jla3sy\"><span class=\"svelte-1jla3sy\"> </span><!></div> <!></div></div>"), Ic = {
	hash: "svelte-1jla3sy",
	code: ".mini.svelte-1jla3sy {height:100%;container-type:size;display:flex;flex-direction:column;background:var(--tm-bg);}.head.svelte-1jla3sy {height:36px;flex:none;display:flex;align-items:center;gap:8px;padding:0 14px;background:var(--tm-panel);}.by.svelte-1jla3sy {font-size:11px;color:var(--tm-muted);}.spacer.svelte-1jla3sy {flex:1;}.np.svelte-1jla3sy {font-size:12px;font-weight:600;}.player.svelte-1jla3sy {padding:22px 22px 0;position:relative;flex:none;}.art.svelte-1jla3sy {width:min(100%, 48cqh);aspect-ratio:1;margin:0 auto;border-radius:18px;overflow:hidden;display:flex;position:relative;box-shadow:0 24px 50px rgba(0, 0, 0, .45);}.blank.svelte-1jla3sy {flex:1;background:var(--tm-fg-6);}.kind.svelte-1jla3sy {position:absolute;left:14px;top:14px;font-size:9.5px;font-weight:700;letter-spacing:.8px;padding:3px 8px;border-radius:20px;background:rgba(0, 0, 0, .45);color:#fff;}.chapter.svelte-1jla3sy {position:absolute;left:14px;bottom:14px;max-width:70%;padding:8px 10px;border-radius:10px;background:rgba(0, 0, 0, .5);color:#fff;font-size:11.5px;line-height:1.3;}.chapter.svelte-1jla3sy span:where(.svelte-1jla3sy) {opacity:.7;}.trow.svelte-1jla3sy {display:flex;align-items:flex-start;gap:6px;margin-top:18px;}.trow.svelte-1jla3sy .title:where(.svelte-1jla3sy) {margin-top:0;flex:1;min-width:0;}.title.svelte-1jla3sy {font-size:17px;font-weight:650;margin-top:18px;line-height:1.3;text-wrap:pretty;display:-webkit-box;-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}.sub.svelte-1jla3sy {font-size:12.5px;color:var(--tm-muted);margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.seek.svelte-1jla3sy {display:flex;margin-top:14px;}.times.svelte-1jla3sy {display:flex;justify-content:space-between;font:500 10.5px ui-monospace, Menlo, monospace;color:var(--tm-muted);margin-top:2px;}.liveword.svelte-1jla3sy {color:var(--tm-live);font-weight:700;}.controls.svelte-1jla3sy {display:flex;align-items:center;justify-content:space-between;margin-top:10px;}button.svelte-1jla3sy:disabled {opacity:.35;cursor:default;}.chipbtn.svelte-1jla3sy {width:44px;height:30px;border:0;border-radius:8px;background:var(--tm-fg-6);color:var(--tm-fg);font:600 11px ui-monospace, Menlo, monospace;cursor:pointer;display:grid;place-items:center;}.sleep.svelte-1jla3sy {background:transparent;}.sleep.on.svelte-1jla3sy {background:var(--tm-accent-14);color:var(--tm-accent);}.jump.svelte-1jla3sy {width:40px;height:40px;border:0;border-radius:20px;background:none;color:var(--tm-fg);font:600 11px ui-monospace, Menlo, monospace;cursor:pointer;}.jump.svelte-1jla3sy:hover:not(:disabled) {background:var(--tm-fg-8);}.pp.svelte-1jla3sy {width:58px;height:58px;flex:none;padding:0;border:0;border-radius:50%;background:var(--tm-accent);color:var(--tm-on-accent);cursor:pointer;display:grid;place-items:center;position:relative;}.pp.paused.svelte-1jla3sy svg {transform:translateX(1.5px);}.pp.busy.svelte-1jla3sy::after {content:'';position:absolute;inset:-5px;border-radius:50%;border:2px solid transparent;border-top-color:var(--tm-accent); animation: svelte-1jla3sy-spin .9s linear infinite;}\n  @keyframes svelte-1jla3sy-spin { to { transform: rotate(360deg); } }\n  @media (prefers-reduced-motion: reduce) {.pp.busy.svelte-1jla3sy::after { animation: none;} }.sleepnote.svelte-1jla3sy {text-align:center;font-size:11px;color:var(--tm-accent);margin-top:6px;}.upnext.svelte-1jla3sy {flex:1;min-height:0;margin-top:16px;background:var(--tm-panel);border-radius:18px 18px 0 0;padding:14px 12px;overflow:auto;}.uphead.svelte-1jla3sy {display:flex;align-items:baseline;justify-content:space-between;padding:0 8px 6px;}.uphead.svelte-1jla3sy span:where(.svelte-1jla3sy) {font-size:13px;font-weight:650;}.uphead.svelte-1jla3sy button:where(.svelte-1jla3sy) {border:0;background:none;color:var(--tm-accent);font-size:11.5px;cursor:pointer;padding:0;}.q.svelte-1jla3sy {display:flex;align-items:center;gap:10px;width:100%;padding:7px 8px;border:0;border-radius:9px;background:none;color:inherit;cursor:pointer;text-align:left;font:inherit;}.q.svelte-1jla3sy:hover {background:var(--tm-fg-5);}.qtext.svelte-1jla3sy {flex:1;min-width:0;display:flex;flex-direction:column;}.qtitle.svelte-1jla3sy {font-size:12.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.qmeta.svelte-1jla3sy {font-size:11px;color:var(--tm-muted);margin-top:2px;}.empty.svelte-1jla3sy {padding:20px 8px;font-size:12px;color:var(--tm-muted);text-align:center;}"
};
function Lc(e, t) {
	qe(t, !0), K(e, Ic);
	let n = /* @__PURE__ */ D(() => t.store.item), r = /* @__PURE__ */ D(() => !!z(n) && X(z(n))), i = /* @__PURE__ */ D(() => z(n) ? t.store.durOf(z(n).id) : 0), a = /* @__PURE__ */ D(() => z(n) && X(z(n)) && z(n).chapters.length > 1 && t.store.chapIdx >= 0 ? z(n).chapters[t.store.chapIdx].title : ""), o = /* @__PURE__ */ D(() => typeof t.store.sleep == "number" ? Ji(t.store.sleep) : t.store.sleep === "chapter" ? "end of chapter" : ""), s = /* @__PURE__ */ D(() => z(n)?.type === "radio" ? t.store.nowPlaying[z(n).stationId] : void 0), c = /* @__PURE__ */ D(() => [...t.store.continueIds, ...t.store.onAirIds].filter((e) => e !== t.store.now).slice(0, 6));
	var l = Fc(), u = F(M(l), 2), d = M(u), f = M(d), p = (e) => {
		{
			let t = /* @__PURE__ */ D(() => z(s)?.art || z(n).art);
			Na(e, {
				get hue() {
					return z(n).hue;
				},
				get art() {
					return z(t);
				},
				fill: !0,
				radius: 0,
				get mark() {
					return z(n).mark;
				},
				font: 40
			});
		}
	}, m = (e) => {
		H(e, Ec());
	};
	W(f, (e) => {
		z(n) ? e(p) : e(m, -1);
	});
	var h = F(f, 2), g = (e) => {
		var n = Dc(), r = P(n, !0);
		I(() => U(r, t.store.kindLabel)), H(e, n);
	};
	W(h, (e) => {
		z(n) && e(g);
	});
	var _ = F(h, 2), v = (e) => {
		var t = Oc(), n = F(M(t), 2, !0);
		E(t), I(() => U(n, z(a))), H(e, t);
	};
	W(_, (e) => {
		z(a) && e(v);
	}), E(d);
	var y = F(d, 2), ee = M(y), b = P(ee, !0), x = F(ee), te = (e) => {
		co(e, {
			get store() {
				return t.store;
			},
			get id() {
				return z(n).id;
			},
			size: 18
		});
	};
	W(x, (e) => {
		z(n) && e(te);
	}), E(y);
	var S = F(y, 2), ne = P(S, !0), re = F(S, 2);
	dc(M(re), {
		get store() {
			return t.store;
		},
		height: 16
	}), E(re);
	var ie = F(re, 2), ae = M(ie), oe = P(ae, !0), se = F(ae, 2), ce = (e) => {
		H(e, kc());
	}, le = (e) => {
		var n = Ac(), r = P(n, !0);
		I((e) => U(r, e), [() => z(i) ? `−${Ji(sa(z(i), t.store.pos, t.store.speed))}` : ""]), H(e, n);
	};
	W(se, (e) => {
		z(n) && !z(r) ? e(ce) : e(le, -1);
	}), E(ie);
	var ue = F(ie, 2), de = M(ue), fe = P(de), pe = F(de, 2), me = P(pe), he = F(pe, 2);
	let ge;
	var _e = M(he);
	{
		let e = /* @__PURE__ */ D(() => t.store.playing ? t.store.live ? Q.stop : Q.pause : Q.play);
		$(_e, {
			get d() {
				return z(e);
			},
			size: 24
		});
	}
	E(he);
	var ve = F(he, 2), C = P(ve), ye = F(ve, 2);
	let be;
	$(M(ye), {
		get d() {
			return Q.moon;
		},
		size: 15,
		stroke: 1.8
	}), E(ye), E(ue);
	var xe = F(ue, 2), Se = (e) => {
		var t = jc(), n = P(t);
		I(() => U(n, `Sleep timer · ${z(o) ?? ""}`)), H(e, t);
	};
	W(xe, (e) => {
		t.store.sleep && e(Se);
	});
	var Ce = F(xe, 2), w = (e) => {
		hc(e, {
			get store() {
				return t.store;
			},
			pos: "right:16px;left:16px;width:auto;top:120px"
		});
	};
	W(Ce, (e) => {
		t.store.pop === "sleep" && e(w);
	});
	var we = F(Ce, 2), T = (e) => {
		yc(e, {
			get store() {
				return t.store;
			},
			pos: "right:16px;left:16px;width:auto;top:120px"
		});
	};
	W(we, (e) => {
		t.store.pop === "speed" && e(T);
	}), E(u);
	var Te = F(u, 2), Ee = M(Te), De = M(Ee), Oe = P(De, !0), ke = F(De), Ae = (e) => {
		var n = Mc();
		B("click", n, () => t.store.clip()), H(e, n);
	};
	W(ke, (e) => {
		z(n) && e(Ae);
	}), E(Ee), G(F(Ee, 2), 16, () => t.store.queue.length ? t.store.queue : z(c), (e) => e, (e, n) => {
		let r = /* @__PURE__ */ D(() => t.store.items[n]);
		var i = Nr(), a = N(i), o = (e) => {
			var i = Nc(), a = M(i);
			Na(a, {
				get hue() {
					return z(r).hue;
				},
				get art() {
					return z(r).art;
				},
				get mark() {
					return z(r).mark;
				},
				size: 36,
				font: 9
			});
			var o = F(a, 2), s = M(o), c = P(s, !0), l = P(F(s));
			E(o), E(i), I((e) => {
				U(c, z(r).title), U(l, `${ki[z(r).type] ?? ""}${e ?? ""}`);
			}, [() => t.store.lenOf(n) ? ` · ${t.store.lenOf(n)}` : ""]), B("click", i, () => t.store.play(n)), H(e, i);
		};
		W(a, (e) => {
			z(r) && e(o);
		}), H(e, i);
	}, (e) => {
		H(e, Pc());
	}), E(Te), E(l), I((e, i, a, o) => {
		U(b, z(s)?.title || z(n)?.title || "Nothing playing"), U(ne, e), U(oe, i), de.disabled = !z(r), J(de, "aria-expanded", t.store.pop === "speed"), J(de, "aria-label", `Playback speed ${a ?? ""}×`), U(fe, `${o ?? ""}×`), pe.disabled = !z(r), J(pe, "aria-label", `Back ${t.store.prefs.back ?? ""} seconds`), U(me, `−${t.store.prefs.back ?? ""}`), ge = q(he, 1, "pp svelte-1jla3sy", null, ge, {
			busy: t.store.buffering || t.store.loadingItem,
			paused: !t.store.playing
		}), he.disabled = !z(n), J(he, "aria-label", t.store.playing ? t.store.live ? "Stop" : "Pause" : "Play"), ve.disabled = !z(r), J(ve, "aria-label", `Forward ${t.store.prefs.fwd ?? ""} seconds`), U(C, `+${t.store.prefs.fwd ?? ""}`), be = q(ye, 1, "chipbtn sleep svelte-1jla3sy", null, be, { on: !!t.store.sleep }), ye.disabled = !z(n), J(ye, "aria-expanded", t.store.pop === "sleep"), U(Oe, t.store.queue.length ? "Up next" : "Recent");
	}, [
		() => z(n) ? z(s)?.title ? [z(s).artist, z(n).title].filter(Boolean).join(" · ") : t.store.subtitle : "Widen the panel to browse, or pick from below.",
		() => z(n) ? z(r) ? Ji(t.store.pos) : "On air" : "",
		() => t.store.speed.toFixed(1),
		() => z(r) ? t.store.speed.toFixed(1) : "1.0"
	]), B("click", de, () => t.store.togglePop("speed")), B("click", pe, () => t.store.skip(-t.store.prefs.back)), B("click", he, () => t.store.toggle()), B("click", ve, () => t.store.skip(t.store.prefs.fwd)), B("click", ye, () => t.store.togglePop("sleep")), H(e, l), Je();
}
Sr(["click"]);
//#endregion
//#region src/components/PrefsPopover.svelte
var Rc = /* @__PURE__ */ V("<button> </button>"), zc = /* @__PURE__ */ V("<div class=\"tm-pop\" role=\"dialog\" aria-label=\"Playback preferences\"><div class=\"title svelte-1dgvwbx\">Playback</div> <div class=\"label svelte-1dgvwbx\">Skip back</div> <div class=\"row svelte-1dgvwbx\" role=\"group\" aria-label=\"Skip back\"></div> <div class=\"label svelte-1dgvwbx\">Skip forward</div> <div class=\"row svelte-1dgvwbx\" role=\"group\" aria-label=\"Skip forward\"></div> <label class=\"toggle-row svelte-1dgvwbx\"><span class=\"svelte-1dgvwbx\"><b>Smart rewind</b><small class=\"svelte-1dgvwbx\">Replay a few seconds when you resume after a break.</small></span> <input type=\"checkbox\" role=\"switch\" class=\"svelte-1dgvwbx\"/></label> <label class=\"toggle-row svelte-1dgvwbx\"><span class=\"svelte-1dgvwbx\"><b>Continuous play</b><small class=\"svelte-1dgvwbx\">When an episode or book ends, start what is up next.</small></span> <input type=\"checkbox\" role=\"switch\" class=\"svelte-1dgvwbx\"/></label> <div class=\"foot svelte-1dgvwbx\"><button class=\"link svelte-1dgvwbx\">Keyboard shortcuts</button> <button class=\"link danger svelte-1dgvwbx\">Clear history</button></div></div>"), Bc = {
	hash: "svelte-1dgvwbx",
	code: ".title.svelte-1dgvwbx {font-size:13px;font-weight:650;}.label.svelte-1dgvwbx {font-size:11px;color:var(--tm-muted);margin:12px 0 6px;}.row.svelte-1dgvwbx {display:flex;gap:5px;}.opt.svelte-1dgvwbx {flex:1;height:30px;border-radius:8px;border:0;background:var(--tm-fg-6);color:var(--tm-fg);font-size:11.5px;font-weight:600;cursor:pointer;font-variant-numeric:tabular-nums;}.opt.svelte-1dgvwbx:hover {background:var(--tm-fg-10);}.opt.sel.svelte-1dgvwbx {background:var(--tm-accent);color:var(--tm-on-accent);}.toggle-row.svelte-1dgvwbx {display:flex;align-items:center;gap:12px;margin-top:12px;cursor:pointer;}.toggle-row.svelte-1dgvwbx span:where(.svelte-1dgvwbx) {flex:1;display:flex;flex-direction:column;gap:2px;font-size:12px;}.toggle-row.svelte-1dgvwbx small:where(.svelte-1dgvwbx) {font-size:11px;color:var(--tm-muted);line-height:1.35;}input[type=checkbox].svelte-1dgvwbx {appearance:none;width:34px;height:20px;flex:none;border-radius:10px;background:var(--tm-fg-16);position:relative;cursor:pointer;transition:background .15s;margin:0;}input[type=checkbox].svelte-1dgvwbx::after {content:'';position:absolute;top:3px;left:3px;width:14px;height:14px;border-radius:50%;background:var(--tm-fg);transition:transform .15s;}input[type=checkbox].svelte-1dgvwbx:checked {background:var(--tm-accent);}input[type=checkbox].svelte-1dgvwbx:checked::after {transform:translateX(14px);background:var(--tm-on-accent);}input[type=checkbox].svelte-1dgvwbx:focus-visible {outline:2px solid var(--tm-accent);outline-offset:2px;}.foot.svelte-1dgvwbx {display:flex;justify-content:space-between;margin-top:14px;padding-top:10px;border-top:1px solid var(--tm-fg-8);}.link.svelte-1dgvwbx {border:0;background:none;padding:0;color:var(--tm-accent);font-size:11.5px;cursor:pointer;}.link.danger.svelte-1dgvwbx {color:var(--tm-muted);}.link.danger.svelte-1dgvwbx:hover:not(:disabled) {color:var(--tm-live);}.link.svelte-1dgvwbx:disabled {opacity:.4;cursor:default;}\n  @media (prefers-reduced-motion: reduce) {input[type=checkbox].svelte-1dgvwbx, input[type=checkbox].svelte-1dgvwbx::after {transition:none;} }"
};
function Vc(e, t) {
	qe(t, !0), K(e, Bc);
	let n = Y(t, "store", 7);
	var r = zc(), i = F(M(r), 4);
	G(i, 21, () => ya, Wr, (e, t) => {
		var r = Rc();
		let i;
		var a = P(r);
		I(() => {
			i = q(r, 1, "opt svelte-1dgvwbx", null, i, { sel: n().prefs.back === z(t) }), J(r, "aria-pressed", n().prefs.back === z(t)), U(a, `${z(t) ?? ""}s`);
		}), B("click", r, () => n().setPref("back", z(t))), H(e, r);
	}), E(i);
	var a = F(i, 4);
	G(a, 21, () => ba, Wr, (e, t) => {
		var r = Rc();
		let i;
		var a = P(r);
		I(() => {
			i = q(r, 1, "opt svelte-1dgvwbx", null, i, { sel: n().prefs.fwd === z(t) }), J(r, "aria-pressed", n().prefs.fwd === z(t)), U(a, `${z(t) ?? ""}s`);
		}), B("click", r, () => n().setPref("fwd", z(t))), H(e, r);
	}), E(a);
	var o = F(a, 2), s = F(M(o), 2);
	_i(s), E(o);
	var c = F(o, 2), l = F(M(c), 2);
	_i(l), E(c);
	var u = F(c, 2), d = M(u), f = F(d, 2);
	E(u), E(r), I(() => {
		ai(r, t.pos), yi(s, n().prefs.smartRewind), yi(l, n().prefs.continuous), f.disabled = !n().history.length;
	}), B("change", s, (e) => n().setPref("smartRewind", e.currentTarget.checked)), B("change", l, (e) => n().setPref("continuous", e.currentTarget.checked)), B("click", d, () => {
		n().pop = null, n().shortcuts = !0;
	}), B("click", f, () => n().clearHistory()), H(e, r), Je();
}
Sr(["click", "change"]);
//#endregion
//#region src/components/ShortcutsSheet.svelte
var Hc = /* @__PURE__ */ V("<span class=\"to svelte-jfujii\">–</span>"), Uc = /* @__PURE__ */ V("<kbd class=\"svelte-jfujii\"> </kbd>"), Wc = /* @__PURE__ */ V("<div class=\"svelte-jfujii\"><dt class=\"svelte-jfujii\"></dt><dd class=\"svelte-jfujii\"> </dd></div>"), Gc = /* @__PURE__ */ V("<div class=\"scrim svelte-jfujii\" role=\"presentation\"><div class=\"sheet svelte-jfujii\" role=\"dialog\" aria-modal=\"true\" aria-label=\"Keyboard shortcuts\" tabindex=\"-1\"><div class=\"head svelte-jfujii\"><h2 class=\"svelte-jfujii\">Keyboard shortcuts</h2><button class=\"x svelte-jfujii\" aria-label=\"Close\">✕</button></div> <dl class=\"svelte-jfujii\"></dl></div></div>"), Kc = {
	hash: "svelte-jfujii",
	code: ".scrim.svelte-jfujii {position:absolute;inset:0;z-index:20;background:rgba(0, 0, 0, .5);display:grid;place-items:center;padding:20px;}.sheet.svelte-jfujii {width:min(460px, 100%);max-height:100%;overflow:auto;padding:20px 22px;border-radius:16px;background:var(--tm-pop);border:1px solid var(--tm-fg-10);box-shadow:0 30px 70px rgba(0, 0, 0, .55);outline:none;}.head.svelte-jfujii {display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}h2.svelte-jfujii {font-size:15px;margin:0;}.x.svelte-jfujii {width:28px;height:28px;border:0;border-radius:8px;background:none;color:var(--tm-muted);cursor:pointer;}.x.svelte-jfujii:hover {background:var(--tm-fg-8);color:var(--tm-fg);}dl.svelte-jfujii {margin:0;display:grid;gap:2px;}dl.svelte-jfujii div:where(.svelte-jfujii) {display:flex;align-items:center;gap:14px;padding:7px 0;border-top:1px solid var(--tm-fg-6);}dt.svelte-jfujii {width:120px;flex:none;display:flex;align-items:center;gap:4px;}dd.svelte-jfujii {margin:0;font-size:12.5px;}kbd.svelte-jfujii {font:600 11px ui-monospace, Menlo, monospace;min-width:22px;text-align:center;padding:3px 6px;border-radius:6px;background:var(--tm-fg-8);border:1px solid var(--tm-fg-14);border-bottom-width:2px;}.to.svelte-jfujii {color:var(--tm-muted);}"
};
function qc(e, t) {
	qe(t, !0), K(e, Kc);
	let n = Y(t, "store", 7), r = /* @__PURE__ */ D(() => [
		[["Space"], "Play or pause (stop for live radio)"],
		[["←"], `Back ${n().prefs.back} seconds`],
		[["→"], `Forward ${n().prefs.fwd} seconds`],
		[["Shift", "←"], "Previous chapter"],
		[["Shift", "→"], "Next in queue"],
		[["↑", "↓"], "Volume up or down"],
		[["M"], "Mute"],
		[["F"], "Favorite or save what is playing"],
		[["B"], "Bookmark this moment (audiobooks)"],
		[["/"], "Search"],
		[[
			"1",
			"–",
			"5"
		], "Listen now, My Media, Radio, Podcasts, Audiobooks"],
		[["?"], "Show this list"]
	]), i = /* @__PURE__ */ k(void 0);
	bn(() => {
		z(i)?.focus();
	});
	var a = Gc(), o = M(a), s = M(o), c = F(M(s));
	E(s);
	var l = F(s, 2);
	G(l, 21, () => z(r), ([e, t]) => t, (e, t) => {
		var n = /* @__PURE__ */ D(() => m(z(t), 2));
		let r = () => z(n)[0], i = () => z(n)[1];
		var a = Wc(), o = M(a);
		G(o, 21, r, Wr, (e, t) => {
			var n = Nr(), r = N(n), i = (e) => {
				H(e, Hc());
			}, a = (e) => {
				var n = Uc(), r = P(n, !0);
				I(() => U(r, z(t))), H(e, n);
			};
			W(r, (e) => {
				z(t) === "–" ? e(i) : e(a, -1);
			}), H(e, n);
		}), E(o);
		var s = P(F(o), !0);
		E(a), I(() => U(s, i())), H(e, a);
	}), E(l), E(o), Di(o, (e) => A(i, e), () => z(i)), E(a), B("click", a, () => n().shortcuts = !1), B("click", o, (e) => e.stopPropagation()), B("keydown", o, (e) => {
		e.key === "Escape" && (e.stopPropagation(), n().shortcuts = !1);
	}), B("click", c, () => n().shortcuts = !1), H(e, a), Je();
}
Sr(["click", "keydown"]);
//#endregion
//#region src/App.svelte
var Jc = /* @__PURE__ */ V("<div class=\"unsupported svelte-1n46o8q\"><strong class=\"svelte-1n46o8q\">Update Tend to use TEND Media.</strong><p>This panel does not provide the OndaCast catalog capability yet. Updating Tend adds it.</p></div>"), Yc = /* @__PURE__ */ V("<!> <div class=\"middle svelte-1n46o8q\"><!> <main class=\"svelte-1n46o8q\"><!></main> <!></div> <!>", 1), Xc = /* @__PURE__ */ V("<div role=\"status\"> </div>"), Zc = /* @__PURE__ */ V("<div class=\"tend-media svelte-1n46o8q\" tabindex=\"-1\"><!> <!> <!> <!></div>"), Qc = {
	hash: "svelte-1n46o8q",
	code: ".tend-media.svelte-1n46o8q {\n    /* Live Tend theme tokens with the TEND Notes dark palette as fallback. */--tm-bg: var(--color-base-100, #151b19);--tm-panel: var(--color-base-200, #1d2622);--tm-fg: var(--color-base-content, #d8e3df);--tm-accent: var(--color-primary, #66b798);--tm-on-accent: var(--color-primary-content, #071a13);--tm-muted: color-mix(in srgb, var(--tm-fg) 64%, var(--tm-bg));--tm-brand: #0f766e;--tm-live: #ff6b6b;--tm-fg-4: color-mix(in srgb, var(--tm-fg) 4.5%, transparent);--tm-fg-5: color-mix(in srgb, var(--tm-fg) 5%, transparent);--tm-fg-6: color-mix(in srgb, var(--tm-fg) 6%, transparent);--tm-fg-7: color-mix(in srgb, var(--tm-fg) 7%, transparent);--tm-fg-8: color-mix(in srgb, var(--tm-fg) 8%, transparent);--tm-fg-10: color-mix(in srgb, var(--tm-fg) 10%, transparent);--tm-fg-12: color-mix(in srgb, var(--tm-fg) 12%, transparent);--tm-fg-14: color-mix(in srgb, var(--tm-fg) 14%, transparent);--tm-fg-16: color-mix(in srgb, var(--tm-fg) 16%, transparent);--tm-fg-18: color-mix(in srgb, var(--tm-fg) 18%, transparent);--tm-fg-45: color-mix(in srgb, var(--tm-fg) 45%, transparent);--tm-accent-7: color-mix(in srgb, var(--tm-accent) 7%, transparent);--tm-accent-8: color-mix(in srgb, var(--tm-accent) 8%, transparent);--tm-accent-12: color-mix(in srgb, var(--tm-accent) 12%, transparent);--tm-accent-14: color-mix(in srgb, var(--tm-accent) 14%, transparent);--tm-pop: color-mix(in srgb, var(--tm-fg) 3.5%, var(--tm-panel));position:relative;height:100%;width:100%;overflow:hidden;display:flex;flex-direction:column;background:var(--tm-bg);color:var(--tm-fg);font-family:system-ui, -apple-system, \"Segoe UI\", sans-serif;font-size:13px;-webkit-font-smoothing:antialiased;outline:none;}.tend-media.svelte-1n46o8q * {box-sizing:border-box;}.tend-media.svelte-1n46o8q button {font-family:inherit;}.tend-media.svelte-1n46o8q button:focus-visible {outline:2px solid var(--tm-accent);outline-offset:2px;}.tend-media.svelte-1n46o8q .tm-pop {position:absolute;width:250px;padding:14px;border-radius:14px;z-index:5;background:var(--tm-pop);border:1px solid var(--tm-fg-10);box-shadow:0 20px 50px rgba(0, 0, 0, .5);}.toast.low.svelte-1n46o8q {bottom:20px;}.unsupported.svelte-1n46o8q {margin:auto;max-width:360px;text-align:center;padding:24px;font-size:13px;color:var(--tm-muted);}.unsupported.svelte-1n46o8q strong:where(.svelte-1n46o8q) {display:block;color:var(--tm-fg);font-size:15px;margin-bottom:6px;}.middle.svelte-1n46o8q {flex:1;min-height:0;display:flex;}main.svelte-1n46o8q {flex:1;min-width:0;overflow:auto;padding:26px 28px 28px;container-type:inline-size;}.toast.svelte-1n46o8q {position:absolute;left:50%;bottom:96px;transform:translateX(-50%);padding:10px 16px;border-radius:10px;background:var(--tm-fg);color:var(--tm-bg);font-size:12.5px;font-weight:600;box-shadow:0 12px 30px rgba(0, 0, 0, .4);z-index:6;white-space:nowrap;max-width:calc(100% - 32px);overflow:hidden;text-overflow:ellipsis;}"
};
function $c(e, t) {
	qe(t, !0), K(e, Qc);
	let n = Y(t, "narrow", 7, !1), r = new wa(t.host), i = /* @__PURE__ */ k(void 0);
	Oi(() => (r.start(), () => r.destroy())), bn(() => {
		r.tab, r.showSlug, r.bookId, r.libKind, z(i)?.scrollTo(0, 0);
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
			r.pop = null, e.stopPropagation();
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
		r.pop && !t.closest(".tm-pop,[data-pop]") && (r.pop = null);
	}
	var d = {
		setNarrow: a,
		shutdown: o
	}, f = Zc(), p = M(f), m = (e) => {
		H(e, Jc());
	}, h = (e) => {
		Lc(e, { get store() {
			return r;
		} });
	}, g = (e) => {
		var t = Yc(), n = N(t);
		ka(n, { get store() {
			return r;
		} });
		var a = F(n, 2), o = M(a);
		Va(o, { get store() {
			return r;
		} });
		var s = F(o, 2), c = M(s), l = (e) => {
			Os(e, { get store() {
				return r;
			} });
		}, u = /* @__PURE__ */ D(() => r.query.trim()), d = (e) => {
			ao(e, { get store() {
				return r;
			} });
		}, f = (e) => {
			Uo(e, { get store() {
				return r;
			} });
		}, p = (e) => {
			Xo(e, { get store() {
				return r;
			} });
		}, m = (e) => {
			us(e, { get store() {
				return r;
			} });
		}, h = (e) => {
			bs(e, { get store() {
				return r;
			} });
		};
		W(c, (e) => {
			z(u) ? e(l) : r.tab === "home" ? e(d, 1) : r.tab === "mine" ? e(f, 2) : r.tab === "radio" ? e(p, 3) : r.tab === "pod" ? e(m, 4) : e(h, -1);
		}), E(s), Di(s, (e) => A(i, e), () => z(i)), sc(F(s, 2), { get store() {
			return r;
		} }), E(a), Tc(F(a, 2), { get store() {
			return r;
		} }), H(e, t);
	};
	W(p, (e) => {
		r.supported ? n() ? e(h, 1) : e(g, -1) : e(m);
	});
	var _ = F(p, 2), v = (e) => {
		Vc(e, {
			get store() {
				return r;
			},
			pos: "right:12px;top:42px;width:290px"
		});
	};
	W(_, (e) => {
		r.pop === "prefs" && e(v);
	});
	var y = F(_, 2), ee = (e) => {
		qc(e, { get store() {
			return r;
		} });
	};
	W(y, (e) => {
		r.shortcuts && e(ee);
	});
	var b = F(y, 2), x = (e) => {
		var t = Xc();
		let i;
		var a = P(t, !0);
		I(() => {
			i = q(t, 1, "toast svelte-1n46o8q", null, i, { low: n() }), U(a, r.toast);
		}), H(e, t);
	};
	return W(b, (e) => {
		r.toast && e(x);
	}), E(f), B("keydown", f, l), B("pointerdown", f, u), H(e, f), Je(d);
}
Sr(["keydown", "pointerdown"]);
//#endregion
//#region src/index.ts
var el = 640;
function tl(e) {
	let t = null, n = null;
	async function r() {
		n?.disconnect(), n = null;
		let e = t;
		if (t = null, e) try {
			await e.shutdown();
		} finally {
			await Hr(e);
		}
	}
	return e.onUnmount?.(r), {
		mount(i) {
			let a = i.shadowRoot ?? i.attachShadow({ mode: "open" }), o = document.createElement("div");
			return o.style.cssText = "height:100%;width:100%", a.replaceChildren(o), i.style.display = i.style.display || "block", t = Rr($c, {
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
export { el as NARROW_WIDTH, tl as activate };
