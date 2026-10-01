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
var h = 1024, g = 2048, _ = 4096, v = 8192, y = 16384, b = 32768, x = 1 << 25, S = 65536, C = 1 << 19, w = 1 << 20, ee = 1 << 25, T = 65536, te = 1 << 21, ne = 1 << 22, re = 1 << 23, ie = Symbol("$state"), ae = Symbol("component"), oe = Symbol("legacy props"), se = Symbol(""), ce = Symbol("attributes"), le = Symbol("class"), ue = Symbol("style"), de = Symbol("text"), fe = Symbol("form reset"), pe = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), me = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml"), he = {}, ge = Symbol("uninitialized"), _e = "http://www.w3.org/1999/xhtml";
function ve() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function ye(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function be() {
	console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function xe() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/hydration.js
var E = !1;
function Se(e) {
	E = e;
}
var D;
function Ce(e) {
	if (e === null) throw ye(), he;
	return D = e;
}
function we() {
	return Ce(/* @__PURE__ */ an(D));
}
function O(e) {
	if (E) {
		if (/* @__PURE__ */ an(D) !== null) throw ye(), he;
		D = e;
	}
}
function k(e = 1) {
	if (E) {
		for (var t = e, n = D; t--;) n = /* @__PURE__ */ an(n);
		D = n;
	}
}
function Te(e = !0) {
	for (var t = 0, n = D;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ an(n);
		e && n.remove(), n = i;
	}
}
function Ee(e) {
	if (!e || e.nodeType !== 8) throw ye(), he;
	return e.data;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/equality.js
function De(e) {
	return e === this.v;
}
function Oe(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function ke(e) {
	return !Oe(e, this.v);
}
function Ae(e) {
	throw Error("https://svelte.dev/e/lifecycle_outside_component");
}
//#endregion
//#region node_modules/svelte/src/internal/client/errors.js
function je() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function Me(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function Ne(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function Pe() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function Fe(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function Ie() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Le(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function Re() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function ze() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function Be() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Ve() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
//#endregion
//#region node_modules/svelte/src/internal/client/context.js
var He = null;
function Ue(e) {
	He = e;
}
function We(e, t = !1, n) {
	He = {
		p: He,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: V,
		l: null
	};
}
function Ge(e) {
	var t = He, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) vn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, He = t.p, Ke(e);
}
function Ke(e = {}) {
	return i(e, ae, { value: !0 }), e;
}
function qe() {
	return !0;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
var Je = [];
function Ye() {
	var e = Je;
	Je = [], f(e);
}
function Xe(e) {
	if (Je.length === 0 && !Et) {
		var t = Je;
		queueMicrotask(() => {
			t === Je && Ye();
		});
	}
	Je.push(e);
}
function Ze() {
	for (; Je.length > 0;) Ye();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/status.js
var Qe = ~(g | _ | h);
function $e(e, t) {
	e.f = e.f & Qe | t;
}
function et(e) {
	e.f & 512 || e.deps === null ? $e(e, h) : $e(e, _);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function tt(e) {
	if (e !== null) for (let t of e) t.f & 2 && t.f & 65536 && (t.f ^= T, tt(t.deps));
}
function nt(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), tt(e.deps), $e(e, h);
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
			if (!e.defaultPrevented) for (let t of e.target.elements) t[fe]?.();
		});
	}, { capture: !0 }));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function st(e) {
	var t = B, n = V;
	Vn(null), Hn(null);
	try {
		return e();
	} finally {
		Vn(t), Hn(n);
	}
}
function ct(e, t, n, r = n) {
	e.addEventListener(t, () => st(n));
	let i = e[fe];
	e[fe] = i ? () => {
		i(), r(!0);
	} : () => r(!0), ot();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/async.js
function lt(e, t, n, r) {
	let i = qe() ? pt : gt;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = V, c = ut(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				dn(e, s);
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
		Promise.all(n.map((e) => /* @__PURE__ */ ht(e))).then(u).catch((e) => dn(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), dt();
	}) : f();
}
function ut() {
	var e = V, t = B, n = He, r = j;
	return function(i = !0) {
		Hn(e), Vn(t), Ue(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function dt(e = !0) {
	Hn(null), Vn(null), Ue(null), e && j?.deactivate();
}
function ft() {
	var e = V, t = e.b, n = j, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function pt(e) {
	var t = 2 | g;
	return V !== null && (V.f |= C), {
		ctx: He,
		deps: null,
		effects: null,
		equals: De,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: ge,
		wv: 0,
		parent: V,
		ac: null
	};
}
var mt = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function ht(e, t, n) {
	let r = V;
	r === null && je();
	var i = void 0, a = Ut(ge), o = !B, s = /* @__PURE__ */ new Set();
	return xn(() => {
		var t = V, n = p();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== pe && n.reject(e);
			}).finally(dt);
		} catch (e) {
			n.reject(e), dt();
		}
		var c = j;
		if (o) {
			if (t.f & 32768) var l = ft();
			if (r.b?.is_rendered()) c.async_deriveds.get(t)?.reject(mt);
			else for (let e of s.values()) e.reject(mt);
			s.add(n), c.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), s.delete(n), t !== mt && (c.activate(), t ? (a.f |= re, Gt(a, t)) : (a.f & 8388608 && (a.f ^= re), Gt(a, e)), c.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), gn(() => {
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
function A(e) {
	let t = /* @__PURE__ */ pt(e);
	return Wn(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function gt(e) {
	let t = /* @__PURE__ */ pt(e);
	return t.equals = ke, t;
}
function _t(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) On(t[n]);
	}
}
function vt(e) {
	var t, n = V, r = e.parent;
	if (!Rn && r !== null && e.v !== ge && r.f & 24576) return ve(), e.v;
	Hn(r);
	try {
		e.f &= ~T, _t(e), t = nr(e);
	} finally {
		Hn(n);
	}
	return t;
}
function yt(e) {
	var t = vt(e);
	if (!e.equals(t) && (e.wv = $n(), (!j?.is_fork || e.deps === null) && (j === null ? e.v = t : (j.capture(e, t, !0), Ct?.capture(e, t, !0)), e.deps === null))) {
		$e(e, h);
		return;
	}
	Rn || (wt === null ? et(e) : (hn() || j?.is_fork) && wt.set(e, t));
}
function bt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && st(() => {
		t.ac.abort(pe), t.ac = null;
	}), t.fn !== null && (t.teardown = d), ar(t, 0), En(t));
}
function xt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && or(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var St = null, j = null, Ct = null, wt = null, Tt = null, Et = !1, Dt = !1, Ot = null, kt = null, At = 0, jt = 1, Mt = class e {
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
		St === null ? St = this : (St.#n = this, this.#t = St), St = this;
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
			for (var r of n.d) $e(r, g), t(r);
			for (r of n.m) $e(r, _), t(r);
		}
		this.#p.add(e);
	}
	#g() {
		this.#e = !0, At++ > 1e3 && (this.#x(), Pt());
		for (let e of this.#u) this.#d.delete(e), $e(e, g), this.schedule(e);
		for (let e of this.#d) $e(e, _), this.schedule(e);
		let t = this.#c;
		this.#c = [], this.apply();
		var n = Ot = [], r = [], i = kt = [];
		for (let e of t) try {
			this.#_(e, n, r);
		} catch (t) {
			throw zt(e), this.#h() || this.discard(), t;
		}
		if (j = null, i.length > 0) {
			var a = e.ensure();
			for (let e of i) a.schedule(e);
		}
		if (Ot = null, kt = null, this.#h()) {
			this.#b(r), this.#b(n);
			for (let [e, t] of this.#f) Rt(e, t);
			i.length > 0 && j.#g();
			return;
		}
		let o = this.#v();
		if (o) {
			this.#b(r), this.#b(n), o.#y(this);
			return;
		}
		this.#u.clear(), this.#d.clear();
		for (let e of this.#r) e(this);
		this.#r.clear(), Ct = this, It(r), It(n), Ct = null, this.#s?.resolve();
		var s = j;
		if (this.#a === 0 && (this.#c.length === 0 || s !== null) && this.#x(), this.#c.length > 0) {
			if (s !== null) {
				let e = s;
				e.#c.push(...this.#c.filter((t) => !e.#c.includes(t)));
			} else s = this;
		}
		s !== null && (Vt.clear(), s.#g());
	}
	#_(e, t, n) {
		e.f ^= h;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= h : i & 4 ? t.push(r) : er(r) && (i & 16 && this.#d.add(r), or(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), $e(i, g), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#x(), j = this, this.#g();
	}
	#b(e) {
		for (var t = 0; t < e.length; t += 1) nt(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== ge && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), wt?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		j = this;
	}
	deactivate() {
		j = null, wt = null;
	}
	flush() {
		try {
			Dt = !0, j = this, this.#g();
		} finally {
			At = 0, Tt = null, Ot = null, kt = null, Dt = !1, j = null, wt = null, Vt.clear();
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
		this.#m || (this.#m = !0, Xe(() => {
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
		if (j === null) {
			let t = j = new e();
			!Dt && !Et && Xe(() => {
				t.#e || t.flush();
			});
		}
		return j;
	}
	apply() {
		wt = null;
	}
	schedule(e) {
		if (Tt = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		for (var t = e; t.parent !== null;) {
			t = t.parent;
			var n = t.f;
			if (Ot !== null && t === V && (B === null || !(B.f & 2))) return;
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
			e === null || (e.#n = t), t === null ? St = e : t.#t = e, this.linked = !1;
		}
	}
};
function Nt(e) {
	var t = Et;
	Et = !0;
	try {
		var n;
		for (e && (j !== null && !j.is_fork && j.flush(), n = e());;) {
			if (Ze(), j === null) return n;
			j.flush();
		}
	} finally {
		Et = t;
	}
}
function Pt() {
	try {
		Ie();
	} catch (e) {
		dn(e, Tt);
	}
}
var Ft = null;
function It(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && er(r) && (Ft = /* @__PURE__ */ new Set(), or(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && An(r), Ft?.size > 0)) {
				Vt.clear();
				for (let e of Ft) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Ft.has(n) && (Ft.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || or(n);
					}
				}
				Ft.clear();
			}
		}
		Ft = null;
	}
}
function Lt(e) {
	j.schedule(e);
}
function Rt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), $e(e, h);
		for (var n = e.first; n !== null;) Rt(n, t), n = n.next;
	}
}
function zt(e) {
	$e(e, h);
	for (var t = e.first; t !== null;) zt(t), t = t.next;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
var Bt = /* @__PURE__ */ new Set(), Vt = /* @__PURE__ */ new Map(), Ht = !1;
function Ut(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: De,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function M(e, t) {
	let n = Ut(e, t);
	return Wn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function Wt(e, t = !1, n = !0) {
	let r = Ut(e);
	return t || (r.equals = ke), r;
}
function N(e, t, n = !1) {
	return B !== null && (!Bn || B.f & 131072) && qe() && B.f & 4325394 && (Un === null || !Un.has(e)) && Be(), Gt(e, n ? P(t) : t, kt);
}
function Gt(e, t, n = null) {
	if (!e.equals(t)) {
		Rn ? Vt.set(e, t) : Vt.has(e) || Vt.set(e, e.v);
		var r = Mt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && vt(t), wt === null && et(t);
		}
		e.wv = $n(), Jt(e, g, n), qe() && V !== null && V.f & 1024 && !(V.f & 96) && (qn === null ? Jn([e]) : qn.push(e)), !r.is_fork && Bt.size > 0 && !Ht && Kt();
	}
	return t;
}
function Kt() {
	Ht = !1;
	for (let e of Bt) {
		e.f & 1024 && $e(e, _);
		let t;
		try {
			t = er(e);
		} catch {
			t = !0;
		}
		t && or(e);
	}
	Bt.clear();
}
function qt(e) {
	N(e, e.v + 1);
}
function Jt(e, t, n) {
	var r = e.reactions;
	if (r !== null) for (var i = qe(), a = r.length, o = 0; o < a; o++) {
		var s = r[o], c = s.f;
		if (i || s !== V) {
			var l = (c & g) === 0;
			if (l && $e(s, t), c & 131072) Bt.add(s);
			else if (c & 2) {
				var u = s;
				wt?.delete(u), c & 65536 || (c & 512 && (V === null || !(V.f & 2097152)) && (s.f |= T), Jt(u, _, n));
			} else if (l) {
				var d = s;
				c & 16 && Ft !== null && Ft.add(d), n === null ? Lt(d) : n.push(d);
			}
		}
	}
}
function P(t) {
	if (typeof t != "object" || !t || ie in t || ae in t) return t;
	let n = l(t);
	if (n !== s && n !== c) return t;
	var r = /* @__PURE__ */ new Map(), i = e(t), o = /* @__PURE__ */ M(0), u = null, d = Zn, f = (e) => {
		if (Zn === d) return e();
		var t = B, n = Zn;
		Vn(null), Qn(d);
		var r = e();
		return Vn(t), Qn(n), r;
	};
	return i && r.set("length", /* @__PURE__ */ M(t.length, u)), new Proxy(t, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && Re();
			var i = r.get(t);
			return i === void 0 ? f(() => {
				var e = /* @__PURE__ */ M(n.value, u);
				return r.set(t, e), e;
			}) : N(i, n.value, !0), !0;
		},
		deleteProperty(e, t) {
			var n = r.get(t);
			if (n === void 0) {
				if (t in e) {
					let e = f(() => /* @__PURE__ */ M(ge, u));
					r.set(t, e), qt(o);
				}
			} else N(n, ge), qt(o);
			return !0;
		},
		get(e, n, i) {
			if (n === ie) return t;
			var o = r.get(n), s = n in e;
			if (o === void 0 && (!s || a(e, n)?.writable) && (o = f(() => /* @__PURE__ */ M(P(s ? e[n] : ge), u)), r.set(n, o)), o !== void 0) {
				var c = H(o);
				return c === ge ? void 0 : c;
			}
			return Reflect.get(e, n, i);
		},
		getOwnPropertyDescriptor(e, t) {
			var n = Reflect.getOwnPropertyDescriptor(e, t);
			if (n && "value" in n) {
				var i = r.get(t);
				i && (n.value = H(i));
			} else if (n === void 0) {
				var a = r.get(t), o = a?.v;
				if (a !== void 0 && o !== ge) return {
					enumerable: !0,
					configurable: !0,
					value: o,
					writable: !0
				};
			}
			return n;
		},
		has(e, t) {
			if (t === ie) return !0;
			var n = r.get(t), i = n !== void 0 && n.v !== ge || Reflect.has(e, t);
			return (n !== void 0 || V !== null && (!i || a(e, t)?.writable)) && (n === void 0 && (n = f(() => /* @__PURE__ */ M(i ? P(e[t]) : ge, u)), r.set(t, n)), H(n) === ge) ? !1 : i;
		},
		set(e, t, n, s) {
			var c = r.get(t), l = t in e;
			if (i && t === "length") for (var d = n; d < c.v; d += 1) {
				var p = r.get(d + "");
				p === void 0 ? d in e && (p = f(() => /* @__PURE__ */ M(ge, u)), r.set(d + "", p)) : N(p, ge);
			}
			if (c === void 0) (!l || a(e, t)?.writable) && (c = f(() => /* @__PURE__ */ M(void 0, u)), N(c, P(n)), r.set(t, c));
			else {
				l = c.v !== ge;
				var m = f(() => P(n));
				N(c, m);
			}
			var h = Reflect.getOwnPropertyDescriptor(e, t);
			if (h?.set && h.set.call(s, n), !l) {
				if (i && typeof t == "string") {
					var g = r.get("length"), _ = Number(t);
					Number.isInteger(_) && _ >= g.v && N(g, _ + 1);
				}
				qt(o);
			}
			return !0;
		},
		ownKeys(e) {
			H(o);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = r.get(e);
				return t === void 0 || t.v !== ge;
			});
			for (var [n, i] of r) i.v !== ge && !(n in e) && t.push(n);
			return t;
		},
		setPrototypeOf() {
			ze();
		}
	});
}
function Yt(e) {
	try {
		if (typeof e == "object" && e && ie in e) return e[ie];
	} catch {}
	return e;
}
function Xt(e, t) {
	return Object.is(Yt(e), Yt(t));
}
var Zt, Qt, $t, en;
function tn() {
	if (Zt === void 0) {
		Zt = window, Qt = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		$t = a(t, "firstChild").get, en = a(t, "nextSibling").get, u(e) && (e[le] = void 0, e[ce] = null, e[ue] = void 0, e.__e = void 0), u(n) && (n[de] = void 0);
	}
}
function nn(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function rn(e) {
	return $t.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function an(e) {
	return en.call(e);
}
function F(e, t) {
	if (!E) return /* @__PURE__ */ rn(e);
	var n = /* @__PURE__ */ rn(D);
	if (n === null) n = D.appendChild(nn());
	else if (t && n.nodeType !== 3) {
		var r = nn();
		return n?.before(r), Ce(r), r;
	}
	return t && ln(n), Ce(n), n;
}
function I(e, t = !1) {
	if (!E) {
		var n = /* @__PURE__ */ rn(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ an(n) : n;
	}
	if (t) {
		if (D?.nodeType !== 3) {
			var r = nn();
			return D?.before(r), Ce(r), r;
		}
		ln(D);
	}
	return D;
}
function L(e, t = !1) {
	if (!E) return /* @__PURE__ */ rn(e);
	var n = F(e, t);
	return O(e), n;
}
function R(e, t = 1, n = !1) {
	let r = E ? D : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ an(r);
	if (!E) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = nn();
			return r === null ? i?.after(a) : r.before(a), Ce(a), a;
		}
		ln(r);
	}
	return Ce(r), r;
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
	var t = V;
	if (t === null) return B.f |= re, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	dn(e, t);
}
function dn(e, t) {
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
function fn(e) {
	V === null && (B === null && Fe(e), Pe()), Rn && Ne(e);
}
function pn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function mn(e, t) {
	var n = V;
	n !== null && n.f & 8192 && (e |= v);
	var r = {
		ctx: He,
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
	j?.register_created_effect(r);
	var i = r;
	if (e & 4) Ot === null ? Mt.ensure().schedule(r) : Ot.push(r);
	else if (t !== null) {
		try {
			or(r);
		} catch (e) {
			throw On(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= S));
	}
	if (i !== null && (i.parent = n, n !== null && pn(i, n), B !== null && B.f & 2 && !(e & 64))) {
		var a = B;
		(a.effects ??= []).push(i);
	}
	return r;
}
function hn() {
	return B !== null && !Bn;
}
function gn(e) {
	let t = mn(8, null);
	return $e(t, h), t.teardown = e, t;
}
function _n(e) {
	fn("$effect");
	var t = V.f;
	if (!B && t & 32 && He !== null && !He.i) {
		var n = He;
		(n.e ??= []).push(e);
	} else return vn(e);
}
function vn(e) {
	return mn(4 | w, e);
}
function yn(e) {
	Mt.ensure();
	let t = mn(64 | C, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? jn(t, () => {
			On(t), n(void 0);
		}) : (On(t), n(void 0));
	});
}
function bn(e) {
	return mn(4, e);
}
function xn(e) {
	return mn(ne | C, e);
}
function Sn(e, t = 0) {
	return mn(8 | t, e);
}
function z(e, t = [], n = [], r = []) {
	lt(r, t, n, (t) => {
		mn(8, () => {
			e(...t.map(H));
		});
	});
}
function Cn(e, t = 0) {
	return mn(16 | t, e);
}
function wn(e) {
	return mn(32 | C, e);
}
function Tn(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = Rn, r = B;
		zn(!0), Vn(null);
		try {
			t.call(null);
		} catch (t) {
			dn(t, e.parent);
		} finally {
			zn(n), Vn(r);
		}
	}
}
function En(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && st(() => {
			e.abort(pe);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : On(n, t), n = r;
	}
}
function Dn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || On(t), t = n;
	}
}
function On(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (kn(e.nodes.start, e.nodes.end), n = !0), e.f |= x, En(e, t && !n), ar(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	Tn(e), e.f ^= x, e.f |= y;
	var i = e.parent;
	i !== null && i.first !== null && An(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function kn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ an(e);
		e.remove(), e = n;
	}
}
function An(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function jn(e, t, n = !0) {
	var r = [];
	e.f |= 256, Mn(e, r, !0);
	var i = () => {
		n && On(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Mn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= v;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				Mn(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Nn(e) {
	e.f &= -257, Pn(e, !0);
}
function Pn(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= v, e.f & 1024 || ($e(e, g), Mt.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			Pn(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function Fn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ an(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var In = null, Ln = !1, Rn = !1;
function zn(e) {
	Rn = e;
}
var B = null, Bn = !1;
function Vn(e) {
	B = e;
}
var V = null;
function Hn(e) {
	V = e;
}
var Un = null;
function Wn(e) {
	B !== null && (Un ??= /* @__PURE__ */ new Set()).add(e);
}
var Gn = null, Kn = 0, qn = null;
function Jn(e) {
	qn = e;
}
var Yn = 1, Xn = 0, Zn = Xn;
function Qn(e) {
	Zn = e;
}
function $n() {
	return ++Yn;
}
function er(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 2 && (e.f &= ~T), t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (er(a) && yt(a), a.wv > e.wv) return !0;
		}
		t & 512 && wt === null && $e(e, h);
	}
	return !1;
}
function tr(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(Un !== null && Un.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? tr(a, t, !1) : t === a && (n ? $e(a, g) : a.f & 1024 && $e(a, _), Lt(a));
	}
}
function nr(e) {
	var t = Gn, n = Kn, r = qn, i = B, a = Un, o = He, s = Bn, c = Zn, l = e.f;
	Gn = null, Kn = 0, qn = null, B = l & 96 ? null : e, Un = null, Ue(e.ctx), Bn = !1, Zn = ++Xn, e.ac !== null && (st(() => {
		e.ac.abort(pe);
	}), e.ac = null);
	try {
		e.f |= te;
		var u = e.fn, d = u();
		e.f |= b;
		var f = rr(e);
		if (qe() && qn !== null && !Bn && f !== null && !(e.f & 6146)) for (var p = 0; p < qn.length; p++) tr(qn[p], e);
		if (i !== null && i !== e) {
			if (Xn++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = Xn;
			if (t !== null) for (let e of t) e.rv = Xn;
			qn !== null && (r === null ? r = qn : r.push(...qn));
		}
		return e.f & 8388608 && (e.f ^= re), d;
	} catch (t) {
		return rr(e), un(t);
	} finally {
		e.f ^= te, Gn = t, Kn = n, qn = r, B = i, Un = a, Ue(o), Bn = s, Zn = c;
	}
}
function rr(e) {
	var t = e.deps, n = j?.is_fork;
	if (Gn !== null) {
		var r;
		if (n || ar(e, Kn), t !== null && Kn > 0) for (t.length = Kn + Gn.length, r = 0; r < Gn.length; r++) t[Kn + r] = Gn[r];
		else e.deps = t = Gn;
		if (hn() && e.f & 512) for (r = Kn; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && Kn < t.length && (ar(e, Kn), t.length = Kn);
	return t;
}
function ir(e, r) {
	let i = r.reactions;
	if (i !== null) {
		var a = t.call(i, e);
		if (a !== -1) {
			var o = i.length - 1;
			o === 0 ? i = r.reactions = null : (i[a] = i[o], i.pop());
		}
	}
	if (i === null && r.f & 2 && (Gn === null || !n.call(Gn, r))) {
		var s = r;
		s.f & 512 && (s.f ^= 512, s.f &= ~T), s.v !== ge && et(s), s.ac !== null && st(() => {
			s.ac.abort(pe), s.ac = null, $e(s, g);
		}), bt(s), ar(s, 0);
	}
}
function ar(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) ir(e, n[r]);
}
function or(e) {
	var t = e.f;
	if (!(t & 16384)) {
		$e(e, h);
		var n = V, r = Ln;
		V = e, Ln = !(t & 96);
		try {
			t & 16777232 ? Dn(e) : En(e), Tn(e);
			var i = nr(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = Yn;
		} finally {
			Ln = r, V = n;
		}
	}
}
async function sr() {
	await Promise.resolve(), Nt();
}
function H(e) {
	var t = !!(e.f & 2);
	if (In?.add(e), B !== null && !Bn && !(V !== null && V.f & 16384) && (Un === null || !Un.has(e))) {
		var r = B.deps;
		if (B.f & 2097152) e.rv < Xn && (e.rv = Xn, Gn === null && r !== null && r[Kn] === e ? Kn++ : Gn === null ? Gn = [e] : Gn.push(e));
		else {
			B.deps ??= [], n.call(B.deps, e) || B.deps.push(e);
			var i = e.reactions;
			i === null ? e.reactions = [B] : n.call(i, B) || i.push(B);
		}
	}
	if (Rn && Vt.has(e)) return Vt.get(e);
	if (t) {
		var a = e;
		if (Rn) {
			var o = a.v;
			return (!(a.f & 1024) && a.reactions !== null || lr(a)) && (o = vt(a)), Vt.set(a, o), o;
		}
		var s = !(a.f & 512) && !Bn && B !== null && (Ln || !!(B.f & 512)), c = (a.f & b) === 0;
		er(a) && (s && (a.f |= 512), yt(a)), s && !c && (xt(a), cr(a));
	}
	if (wt?.has(e)) return wt.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function cr(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (xt(t), cr(t));
}
function lr(e) {
	if (e.v === ge) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Vt.has(t) || t.f & 2 && lr(t)) return !0;
	return !1;
}
function ur(e) {
	var t = Bn;
	try {
		return Bn = !0, e();
	} finally {
		Bn = t;
	}
}
function dr(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (ie in e) fr(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && ie in n && fr(n);
		}
	}
}
function fr(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			fr(e[n], t);
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
var pr = ["touchstart", "touchmove"];
function mr(e) {
	return pr.includes(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dev/css.js
var hr = Symbol("events"), gr = /* @__PURE__ */ new Set(), _r = /* @__PURE__ */ new Set();
function vr(e) {
	if (!E) return;
	e.removeAttribute("onload"), e.removeAttribute("onerror");
	let t = e.__e;
	t !== void 0 && (e.__e = void 0, queueMicrotask(() => {
		e.isConnected && e.dispatchEvent(t);
	}));
}
function yr(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || wr.call(t, e), !e.cancelBubble) return st(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? Xe(() => {
		t.addEventListener(e, i, r);
	}) : t.addEventListener(e, i, r), i;
}
function br(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = yr(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && gn(() => {
		t.removeEventListener(e, o, a);
	});
}
function U(e, t, n) {
	(t[hr] ??= {})[e] = n;
}
function xr(e) {
	for (var t = 0; t < e.length; t++) gr.add(e[t]);
	for (var n of _r) n(e);
}
var Sr = null, Cr = !1;
function wr(e) {
	var t = this, n = t.ownerDocument, r = e.type, a = e.composedPath?.() || [], o = a[0] || e.target;
	Sr = e, Cr || (Cr = !0, setTimeout(() => {
		Cr = !1, Sr = null;
	}));
	var s = 0, c = Sr === e && e[hr];
	if (c) {
		var l = a.indexOf(c);
		if (l !== -1 && (t === document || t === window)) {
			e[hr] = t;
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
		var d = B, f = V;
		Vn(null), Hn(null);
		try {
			for (var p, m = []; o !== null && o !== t;) {
				try {
					var h = o[hr]?.[r];
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
			e[hr] = t, delete e.currentTarget, Vn(d), Hn(f);
		}
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/reconciler.js
var Tr = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function Er(e) {
	return Tr?.createHTML(e) ?? e;
}
function Dr(e) {
	var t = cn("template");
	return t.innerHTML = Er(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
function Or(e, t) {
	var n = V;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function W(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i, a = !e.startsWith("<!>");
	return () => {
		if (E) return Or(D, null), D;
		i === void 0 && (i = Dr(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ rn(i)));
		var t = r || Qt ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ rn(t), s = t.lastChild;
			Or(o, s);
		} else Or(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function kr(e, t, n = "svg") {
	var r = !e.startsWith("<!>"), i = !!(t & 1), a = `<${n}>${r ? e : "<!>" + e}</${n}>`, o;
	return () => {
		if (E) return Or(D, null), D;
		if (!o) {
			var e = /* @__PURE__ */ rn(Dr(a));
			if (i) for (o = document.createDocumentFragment(); /* @__PURE__ */ rn(e);) o.appendChild(/* @__PURE__ */ rn(e));
			else o = /* @__PURE__ */ rn(e);
		}
		var t = o.cloneNode(!0);
		if (i) {
			var n = /* @__PURE__ */ rn(t), r = t.lastChild;
			Or(n, r);
		} else Or(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Ar(e, t) {
	return /* @__PURE__ */ kr(e, t, "svg");
}
function jr(e = "") {
	if (!E) {
		var t = nn(e + "");
		return Or(t, t), t;
	}
	var n = D;
	return n.nodeType === 3 ? ln(n) : (n.before(n = nn()), Ce(n)), Or(n, n), n;
}
function Mr() {
	if (E) return Or(D, null), D;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = nn();
	return e.append(t, n), Or(t, n), e;
}
function G(e, t) {
	if (E) {
		var n = V;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = D), we();
		return;
	}
	e !== null && e.before(t);
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function Nr(e) {
	let t = 0, n = Ut(0), r;
	return () => {
		hn() && (H(n), Sn(() => (t === 0 && (r = ur(() => e(() => qt(n)))), t += 1, () => {
			Xe(() => {
				--t, t === 0 && (r?.(), r = void 0, qt(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var Pr = S | C;
function Fr(e, t, n, r) {
	new Ir(e, t, n, r);
}
var Ir = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = E ? D : null;
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
	#h = Nr(() => (this.#m = Ut(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = V;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = V.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = Cn(() => {
			if (E) {
				let e = this.#t;
				we();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, Pr), E && (this.#e = D);
	}
	#g() {
		try {
			this.#a = wn(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		Xe(r), t && (this.#s = wn(() => {
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
			t = !0, n && Ve(), this.#s !== null && jn(this.#s, () => {
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
					dn(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = wn(() => e(this.#e)), Xe(() => {
			var e = this.#c = document.createDocumentFragment(), t = nn(), n = !1;
			if (e.append(t), this.#a = this.#S(() => {
				try {
					return wn(() => this.#r(t));
				} catch (e) {
					try {
						this.error(e), n = !0;
					} catch (e) {
						dn(e, this.#i.parent);
					}
					return null;
				}
			}), this.#a === null) {
				this.#c = null, n && this.#x(j);
				return;
			}
			this.#u === 0 && (this.#e.before(e), this.#c = null, jn(this.#o, () => {
				this.#o = null;
			}), this.#x(j));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = wn(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				Fn(this.#a, e);
				let t = this.#n.pending;
				this.#o = wn(() => t(this.#e));
			} else this.#x(j);
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
		var t = V, n = B, r = He;
		Hn(this.#i), Vn(this.#i), Ue(this.#i.ctx);
		try {
			return Mt.ensure(), e();
		} finally {
			Hn(t), Vn(n), Ue(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && jn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, Xe(() => {
			this.#d = !1, this.#m && Gt(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), H(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		j?.is_fork ? (this.#a && j.skip_effect(this.#a), this.#o && j.skip_effect(this.#o), this.#s && j.skip_effect(this.#s), j.oncommit(() => {
			this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (On(this.#a), null), this.#o &&= (On(this.#o), null), this.#s &&= (On(this.#s), null), E && (Ce(this.#t), k(), Ce(Te()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return wn(() => {
						var r = V;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return dn(e, this.#i.parent), null;
				}
			}));
		};
		Xe(() => {
			var t;
			try {
				t = this.transform_error(e);
			} catch (e) {
				dn(e, this.#i && this.#i.parent);
				return;
			}
			typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => dn(e, this.#i && this.#i.parent)) : n(t);
		});
	}
};
function K(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[de] ??= e.nodeValue) && (e[de] = n, e.nodeValue = `${n}`);
}
function Lr(e, t) {
	return zr(e, t);
}
var Rr = /* @__PURE__ */ new Map();
function zr(e, { target: t, anchor: n, props: i = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	tn();
	var l = void 0, u = yn(() => {
		var s = n ?? t.appendChild(nn());
		Fr(s, { pending: () => {} }, (t) => {
			We({});
			var n = He;
			if (o && (n.c = o), a && (i.$$events = a), E && Or(t, null), l = e(t, i) || Ke(), E && (V.nodes.end = D, D === null || D.nodeType !== 8 || D.data !== "]")) throw ye(), he;
			Ge();
		}, c);
		var u = /* @__PURE__ */ new Set(), d = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!u.has(r)) {
					u.add(r);
					var i = mr(r);
					for (let e of [t, document]) {
						var a = Rr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Rr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, wr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return d(r(gr)), _r.add(d), () => {
			for (var e of u) for (let n of [t, document]) {
				var r = Rr.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, wr), r.delete(e), r.size === 0 && Rr.delete(n)) : r.set(e, i);
			}
			_r.delete(d), s !== n && s.parentNode?.removeChild(s);
		};
	});
	return Br.set(l, u), l;
}
var Br = /* @__PURE__ */ new WeakMap();
function Vr(e, t) {
	let n = Br.get(e);
	return n ? (Br.delete(e), n(t)) : Promise.resolve();
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/branches.js
var Hr = class {
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
			if (n) Nn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (Nn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (On(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						Fn(r, t), t.append(nn()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else On(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), jn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (On(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = j, r = sn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) {
			if (r) {
				var i = document.createDocumentFragment(), a = nn();
				i.append(a), this.#n.set(e, {
					effect: wn(() => t(a)),
					fragment: i
				});
			} else this.#t.set(e, wn(() => t(this.anchor)));
		}
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else E && (this.anchor = D), this.#a(n);
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/if.js
function q(e, t, n = !1) {
	var r;
	E && (r = D, we());
	var i = new Hr(e), a = n ? S : 0;
	function o(e, t) {
		if (E) {
			var n = Ee(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Te();
				Ce(a), i.anchor = a, Se(!1), i.ensure(e, t), Se(!0);
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
var Ur = Symbol("NaN");
function Wr(e, t, n) {
	E && we();
	var r = new Hr(e), i = !qe();
	Cn(() => {
		var e = t();
		e !== e && (e = Ur), i && typeof e == "object" && e && (e = {}), r.ensure(e, n);
	});
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/each.js
function Gr(e, t) {
	return t;
}
function Kr(e, t, n) {
	for (var i = [], a = t.length, o, s = t.length, c = 0; c < a; c++) {
		let n = t[c];
		jn(n, () => {
			if (o) {
				if (o.pending.delete(n), o.done.add(n), o.pending.size === 0) {
					var t = e.outrogroups;
					qr(e, r(o.done)), t.delete(o), t.size === 0 && (e.outrogroups = null);
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
		qr(e, t, !l);
	} else o = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(o);
}
function qr(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= ee, Fn(a, document.createDocumentFragment())) : On(t[i], n);
	}
}
var Jr;
function J(t, n, i, a, o, s = null) {
	var c = t, l = /* @__PURE__ */ new Map();
	if (n & 4) {
		var u = t;
		c = E ? Ce(/* @__PURE__ */ rn(u)) : u.appendChild(nn());
	}
	E && we();
	var d = null, f = /* @__PURE__ */ gt(() => {
		var t = i();
		return e(t) ? t : t == null ? [] : r(t);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, Xr(v, p, c, n, a), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= ee, Qr(d, null, c)) : Nn(d) : jn(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: Cn(() => {
			p = H(f);
			var e = p.length;
			let t = !1;
			E && Ee(c) === "[!" != (e === 0) && (c = Te(), Ce(c), Se(!1), t = !0);
			for (var r = /* @__PURE__ */ new Set(), u = j, v = sn(), y = 0; y < e; y += 1) {
				E && D.nodeType === 8 && D.data === "]" && (c = D, t = !0, Se(!1));
				var b = p[y], x = a(b, y), S = h ? null : l.get(x);
				S ? (S.v && Gt(S.v, b), S.i && Gt(S.i, y), v && u.unskip_effect(S.e)) : (S = Zr(l, h ? c : Jr ??= nn(), b, x, y, o, n, i), h || (S.e.f |= ee), l.set(x, S)), r.add(x);
			}
			if (e === 0 && s && !d && (h ? d = wn(() => s(c)) : (d = wn(() => s(Jr ??= nn())), d.f |= ee)), e > r.size && Me("", "", ""), E && e > 0 && Ce(Te()), !h) {
				if (m.set(u, r), v) {
					for (let [e, t] of l) r.has(e) || u.skip_effect(t.e);
					u.oncommit(g), u.ondiscard(_);
				} else g(u);
			}
			t && Se(!0), H(f);
		}),
		flags: n,
		items: l,
		pending: m,
		outrogroups: null,
		fallback: d
	};
	h = !1, E && (c = D);
}
function Yr(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function Xr(e, t, n, i, a) {
	var o = !!(i & 8), s = t.length, c = e.items, l = Yr(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (o) for (v = 0; v < s; v += 1) h = t[v], g = a(h, v), _ = c.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < s; v += 1) {
		if (h = t[v], g = a(h, v), _ = c.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (Nn(_), o && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) {
			if (_.f ^= ee, _ === l) Qr(_, null, n);
			else {
				var y = d ? d.next : l;
				_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), $r(e, d, _), $r(e, _, y), Qr(_, y, n), d = _, p = [], m = [], l = Yr(d.next);
				continue;
			}
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], C = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) Qr(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					$r(e, S.prev, C.next), $r(e, d, S), $r(e, C, b), l = b, d = C, --v, p = [], m = [];
				} else u.delete(_), Qr(_, l, n), $r(e, _.prev, _.next), $r(e, _, d === null ? e.effect.first : d.next), $r(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = Yr(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = Yr(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (qr(e, r(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var w = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || w.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && w.push(l), l = Yr(l.next);
		var T = w.length;
		if (T > 0) {
			var te = i & 4 && s === 0 ? n : null;
			if (o) {
				for (v = 0; v < T; v += 1) w[v].nodes?.a?.measure();
				for (v = 0; v < T; v += 1) w[v].nodes?.a?.fix();
			}
			Kr(e, w, te);
		}
	}
	o && Xe(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function Zr(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Ut(n) : /* @__PURE__ */ Wt(n, !1, !1) : null, l = o & 2 ? Ut(i) : null;
	return {
		v: c,
		i: l,
		e: wn(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function Qr(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ an(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function $r(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/css.js
function ei(e, t) {
	bn(() => {
		e = V?.parent?.nodes?.start ?? e;
		var n = e.getRootNode(), r = n.host ? n : n.head ?? n.ownerDocument.head;
		if (!r.querySelector("#" + t.hash)) {
			let e = cn("style");
			e.id = t.hash, e.textContent = t.code, r.appendChild(e);
		}
	});
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/actions.js
function ti(e, t, n) {
	bn(() => {
		var r = ur(() => t(e, n?.()) || {});
		if (n && r?.update) {
			var i = !1, a = {};
			Sn(() => {
				var e = n();
				dr(e), i && Oe(a, e) && (a = e, r.update(e));
			}), i = !0;
		}
		if (r?.destroy) return () => r.destroy();
	});
}
//#endregion
//#region node_modules/svelte/src/internal/shared/attributes.js
var ni = [..." 	\n\r\f\xA0\v﻿"];
function ri(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || ni.includes(r[o - 1])) && (s === r.length || ni.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
function ii(e, t = !1) {
	var n = t ? " !important;" : ";", r = "";
	for (var i of Object.keys(e)) {
		var a = e[i];
		a != null && a !== "" && (r += " " + i + ": " + a + n);
	}
	return r;
}
function ai(e) {
	return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function oi(e, t) {
	if (t) {
		var n = "", r, i;
		if (Array.isArray(t) ? (r = t[0], i = t[1]) : r = t, e) {
			e = String(e).replaceAll(/\/\*.*?\*\//g, "").trim();
			var a = !1, o = 0, s = !1, c = [];
			r && c.push(...Object.keys(r).map(ai)), i && c.push(...Object.keys(i).map(ai));
			var l = 0, u = -1;
			let t = e.length;
			for (var d = 0; d < t; d++) {
				var f = e[d];
				if (s ? f === "/" && e[d - 1] === "*" && (s = !1) : a ? a === f && (a = !1) : f === "/" && e[d + 1] === "*" ? s = !0 : f === "\"" || f === "'" ? a = f : f === "(" ? o++ : f === ")" && o--, !s && a === !1 && o === 0) {
					if (f === ":" && u === -1) u = d;
					else if (f === ";" || d === t - 1) {
						if (u !== -1) {
							var p = ai(e.substring(l, u).trim());
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
		return r && (n += ii(r)), i && (n += ii(i, !0)), n = n.trim(), n === "" ? null : n;
	}
	return e == null ? null : String(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/class.js
function Y(e, t, n, r, i, a) {
	var o = e[le];
	if (E || o !== n || o === void 0) {
		var s = ri(n, r, a);
		(!E || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[le] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/style.js
function si(e, t = {}, n, r) {
	for (var i in n) {
		var a = n[i];
		t[i] !== a && (n[i] == null ? e.style.removeProperty(i) : e.style.setProperty(i, a, r));
	}
}
function ci(e, t, n, r) {
	var i = e[ue];
	if (E || i !== t) {
		var a = oi(t, r);
		(!E || a !== e.getAttribute("style")) && (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[ue] = t;
	} else r && (Array.isArray(r) ? (si(e, n?.[0], r[0]), si(e, n?.[1], r[1], "important")) : si(e, n, r));
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function li(e, t) {
	t ? e.hasAttribute("selected") || e.setAttribute("selected", "") : e.removeAttribute("selected");
}
function ui(t, n) {
	var r = t.__defaultValue, i = t.multiple, a = i ? r ?? [] : null;
	if (!i || e(a)) {
		var o = t.selectedIndex, s = n && i ? new Set(t.selectedOptions) : null;
		for (var c of t.options) {
			var l = mi(c);
			li(c, i ? a.includes(l) : Xt(l, r));
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
function di(t, n, r = !1) {
	if (t.multiple) {
		if (n == null) return;
		if (!e(n)) return be();
		for (var i of t.options) i.selected = n.includes(mi(i));
		return;
	}
	for (i of t.options) if (Xt(mi(i), n)) {
		i.selected = !0;
		return;
	}
	(!r || n !== void 0) && (t.selectedIndex = -1);
}
function fi(e) {
	var t = new MutationObserver((t) => {
		t.every(hi) || ("__defaultValue" in e && ui(e, !1), "__value" in e && di(e, e.__value));
	});
	t.observe(e, {
		childList: !0,
		subtree: !0,
		attributes: !0,
		attributeFilter: ["value"]
	}), gn(() => {
		t.disconnect();
	});
}
function pi(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet(), i = !0;
	ct(e, "change", (t) => {
		var i = t ? "[selected]" : ":checked", a;
		if (e.multiple) a = [].map.call(e.querySelectorAll(i), mi);
		else {
			var o = e.querySelector(i) ?? e.querySelector("option:not([disabled])");
			a = o && mi(o);
		}
		n(a), e.__value = a, j !== null && r.add(j);
	}), bn(() => {
		var a = t();
		if (e === document.activeElement) {
			var o = j;
			if (r.has(o)) return;
		}
		if (di(e, a, i), i && a === void 0) {
			var s = e.querySelector(":checked");
			s !== null && (a = mi(s), n(a));
		}
		e.__value = a, i = !1;
	});
}
function mi(e) {
	return "__value" in e ? e.__value : e.value;
}
function hi(e) {
	if (e.target.closest("selectedcontent") !== null) return !0;
	if (e.type === "childList") {
		var t = [...e.addedNodes, ...e.removedNodes];
		return t.length > 0 && t.every((e) => e.nodeName === "SELECTEDCONTENT");
	}
	return !1;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attributes.js
var gi = Symbol("is custom element"), _i = Symbol("is html"), vi = me ? "link" : "LINK", yi = me ? "progress" : "PROGRESS";
function bi(e) {
	if (E) {
		var t = !1, n = () => {
			if (!t) {
				if (t = !0, e.hasAttribute("value")) {
					var n = e.value;
					X(e, "value", null), e.value = n;
				}
				if (e.hasAttribute("checked")) {
					var r = e.checked;
					X(e, "checked", null), e.checked = r;
				}
			}
		};
		e[fe] = n, Xe(n), ot();
	}
}
function xi(e, t) {
	var n = Ci(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === yi) && (e.value = t ?? "");
}
function Si(e, t) {
	var n = Ci(e);
	n.checked !== (n.checked = t ?? void 0) && (e.checked = t);
}
function X(e, t, n, r) {
	var i = Ci(e);
	E && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === vi) || i[t] !== (i[t] = n) && (t === "loading" && (e[se] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && Ti(e).has(t) ? e[t] = n : e.setAttribute(t, n));
}
function Ci(e) {
	return e[ce] ??= {
		[gi]: e.nodeName.includes("-"),
		[_i]: e.namespaceURI === _e
	};
}
var wi = /* @__PURE__ */ new Map();
function Ti(e) {
	var t = e.getAttribute("is") || e.nodeName, n = wi.get(t);
	if (n) return n;
	wi.set(t, n = /* @__PURE__ */ new Set());
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var s in r = o(i), r) r[s].set && s !== "innerHTML" && s !== "textContent" && s !== "innerText" && n.add(s);
		i = l(i);
	}
	return n;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function Ei(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet();
	ct(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = Oi(e) ? ki(a) : a, n(a), j !== null && r.add(j), await sr(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (E && e.defaultValue !== e.value || ur(t) == null && e.value) && (n(Oi(e) ? ki(e.value) : e.value), j !== null && r.add(j)), Sn(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = j;
			if (r.has(i)) return;
		}
		Oi(e) && n === ki(e.value) || (e.type !== "date" || n || e.value) && n !== e.value && (e.value = n ?? "");
	});
}
function Di(e, t, n = t) {
	ct(e, "change", (t) => {
		n(t ? e.defaultChecked : e.checked);
	}), (E && e.defaultChecked !== e.checked || ur(t) == null) && n(e.checked), Sn(() => {
		e.checked = !!t();
	});
}
function Oi(e) {
	var t = e.type;
	return t === "number" || t === "range";
}
function ki(e) {
	return e === "" ? null : +e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function Ai(e, t) {
	return e === t || e?.[ie] === t;
}
function ji(e = Ke(), t, n, r) {
	var i = He.r, a = V;
	return bn(() => {
		var o, s;
		return Sn(() => {
			o = s, s = r?.() || [], ur(() => {
				Ai(n(...s), e) || (t(e, ...s), o && Ai(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && Ai(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function Mi(e, t, n, r) {
	var i = !0, o = !!(n & 8), s = !!(n & 16), c = r, l = !0, u = void 0, d = () => s && i ? (u ??= /* @__PURE__ */ pt(r), H(u)) : (l && (l = !1, c = s ? ur(r) : r), c);
	let f;
	if (o) {
		var p = ie in e || oe in e;
		f = a(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	o ? [m, h] = it(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && Le(t), f(m)));
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
	var v = !1, y = (n & 1 ? pt : gt)(() => (v = !1, g()));
	o && H(y);
	var b = V;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? H(y) : i && o ? P(e) : e;
			return N(y, n), v = !0, c !== void 0 && (c = n), e;
		}
		return Rn && v || b.f & 16384 ? y.v : H(y);
	});
}
function Ni(e) {
	He === null && Ae("onMount"), _n(() => {
		let t = ur(e);
		if (typeof t == "function") return t;
	});
}
//#endregion
//#region node_modules/svelte/src/internal/disclose-version.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
//#endregion
//#region src/catalog.ts
var Pi = {
	podcast: "Podcast",
	book: "Audiobook",
	radio: "Radio"
}, Fi = (e) => e.type !== "radio", Ii = (e) => e.type === "podcast" ? `show:${e.show}` : e.id, Li = [
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
], Ri = (e) => Li[e] ?? String(e + 1), zi = (e) => {
	let t = 0;
	for (let n of e) t = t * 31 + n.charCodeAt(0) >>> 0;
	return t % 360;
}, Bi = (e) => {
	let t = e.replace(/^(the|a|an|el|la|los|las|o|os|as)\s+/i, "").split(/[\s:·\-–—]+/).filter((e) => /[\p{L}\p{N}]/u.test(e));
	return (t.length > 1 ? t[0][0] + t[1][0] : (t[0] ?? "?").slice(0, 2)).toUpperCase();
}, Vi = (e) => typeof e == "string" ? e : "", Hi = (e) => typeof e == "number" && Number.isFinite(e) ? e : 0, Ui = (e) => {
	let t = Vi(e);
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
	let t = Vi(e.id), n = Vi(e.name), r = Ui(e.stream_url);
	if (!t || !n || !r || e.playable === !1) return null;
	let i = [Vi(e.city), Vi(e.region) || Vi(e.country)].filter(Boolean).join(", "), a = Vi(e.genre).split(/[,/]/)[0]?.trim() || "Radio";
	return {
		id: `st:${t}`,
		type: "radio",
		stationId: t,
		title: n,
		url: r,
		genre: a,
		sub: [i || Vi(e.country), a].filter(Boolean).join(" · "),
		onair: "Live",
		hue: zi(t),
		mark: Bi(n),
		art: Ui(e.logo_url) || void 0
	};
}
function qi(e) {
	let t = Vi(e.slug), n = Vi(e.title);
	return !t || !n ? null : {
		slug: t,
		id: Vi(e.id),
		title: n,
		author: Vi(e.author),
		desc: Vi(e.description),
		art: Ui(e.image_url) || void 0,
		hue: zi(t),
		mark: Bi(n),
		category: Vi(e.category),
		episodes: Hi(e.episode_count)
	};
}
function Ji(e, t) {
	let n = Vi(e.id), r = Ui(e.audio_url), i = Vi(e.title);
	return !n || !r || !i ? null : {
		id: `ep:${n}`,
		type: "podcast",
		show: t.slug,
		slug: Vi(e.slug),
		title: i,
		sub: t.title,
		url: r,
		dur: Hi(e.duration),
		date: Vi(e.published_at),
		desc: Vi(e.description),
		chapters: [],
		hue: t.hue,
		mark: t.mark,
		art: Ui(e.image_url) || t.art
	};
}
function Yi(e) {
	let t = Vi(e.slug), n = Vi(e.title);
	if (!t || !n) return null;
	let r = 0, i = Wi(e.chapters).flatMap((e) => {
		let t = Ui(e.audio_url);
		if (!t) return [];
		let n = {
			start: r,
			title: Vi(e.title) || `Chapter ${Hi(e.section)}`,
			dur: Hi(e.duration),
			url: t,
			section: Hi(e.section)
		};
		return r += n.dur ?? 0, [n];
	}), a = i.length && i.every((e) => e.dur) ? r : Hi(e.duration), o = Vi(e.authors);
	return {
		id: `book:${t}`,
		type: "book",
		slug: t,
		title: n,
		sub: o || "Audiobook",
		dur: a,
		desc: Vi(e.description),
		chapters: i,
		loaded: i.length > 0,
		hue: zi(t),
		mark: Bi(n),
		art: Ui(e.cover_url) || void 0
	};
}
var Xi = (e) => Wi(e.lines).map((e) => ({
	t: Hi(e.start),
	who: Vi(e.speaker),
	text: Vi(e.text)
})).filter((e) => e.text), Zi = (e) => e && typeof e == "object" ? e : {}, Qi = (e, t) => Wi(Zi(e)[t]), $i = class {
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
}, ea = (e) => `linear-gradient(145deg, oklch(0.6 0.1 ${e}), oklch(0.32 0.06 ${e}))`, ta = (e) => {
	let t = Math.max(0, Math.round(e)), n = Math.floor(t / 3600), r = Math.floor(t % 3600 / 60), i = t % 60;
	return n ? `${n}:${String(r).padStart(2, "0")}:${String(i).padStart(2, "0")}` : `${r}:${String(i).padStart(2, "0")}`;
}, na = (e) => {
	let t = Math.max(0, e), n = Math.floor(t / 3600), r = Math.round(t % 3600 / 60);
	return n ? `${n}h ${r}m` : `${r} min`;
}, ra = (e = /* @__PURE__ */ new Date()) => {
	let t = e.getHours();
	return t < 5 ? "Good evening" : t < 12 ? "Good morning" : t < 18 ? "Good afternoon" : "Good evening";
}, ia = (e, t = Date.now()) => {
	let n = e ? Date.parse(e) : NaN;
	if (Number.isNaN(n)) return "";
	let r = Math.round((t - n) / 6e4);
	return r < 1 ? "just now" : r < 60 ? `${r} min ago` : r < 1440 ? `${Math.round(r / 60)} h ago` : new Date(n).toLocaleDateString();
}, aa = (e, t, n) => (e ?? []).reduce((e, r, i) => n(r) <= t ? i : e, e?.length ? 0 : -1), oa = (e, t) => aa(e, t, (e) => e.start), sa = (e, t) => [t, ...e.filter((e) => e !== t)], ca = (e, t) => [...e.filter((e) => e !== t), t], la = (e, t) => e.filter((e) => e !== t), ua = (e, t) => {
	let n = Math.max(0, oa(e, t));
	return {
		index: n,
		offset: Math.max(0, t - (e[n]?.start ?? 0))
	};
}, da = (e, t) => Object.fromEntries(Object.entries(e).sort((e, t) => t[1].at - e[1].at).slice(0, t)), fa = (e, t) => {
	let n = oa(e, t);
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
], wa = {
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
}, Ta = {
	back: 15,
	fwd: 30,
	smartRewind: !0,
	continuous: !0,
	repeat: "off"
}, Ea = [
	5,
	10,
	15,
	30
], Da = [
	10,
	15,
	30,
	45,
	60
], Oa = {
	intro: 0,
	outro: 0,
	autoQueue: !1
}, ka = [
	0,
	10,
	15,
	30,
	45,
	60,
	90
], Aa = [
	0,
	10,
	15,
	30,
	60
], ja = [
	.8,
	1,
	1.1,
	1.2,
	1.4,
	1.6,
	1.8,
	2
], Ma = [
	5,
	15,
	30,
	45,
	60,
	90
], Na = 200, Pa = class {
	#e = /* @__PURE__ */ M(P({}));
	get items() {
		return H(this.#e);
	}
	set items(e) {
		N(this.#e, e, !0);
	}
	#t = /* @__PURE__ */ M(P({}));
	get shows() {
		return H(this.#t);
	}
	set shows(e) {
		N(this.#t, e, !0);
	}
	#n = /* @__PURE__ */ M(P({}));
	get showEpisodes() {
		return H(this.#n);
	}
	set showEpisodes(e) {
		N(this.#n, e, !0);
	}
	#r = /* @__PURE__ */ M(P({}));
	get epOrder() {
		return H(this.#r);
	}
	set epOrder(e) {
		N(this.#r, e, !0);
	}
	#i = /* @__PURE__ */ M("all");
	get epFilter() {
		return H(this.#i);
	}
	set epFilter(e) {
		N(this.#i, e, !0);
	}
	#a = /* @__PURE__ */ M("");
	get epQuery() {
		return H(this.#a);
	}
	set epQuery(e) {
		N(this.#a, e, !0);
	}
	#o = /* @__PURE__ */ M(P({}));
	get showPrefs() {
		return H(this.#o);
	}
	set showPrefs(e) {
		N(this.#o, e, !0);
	}
	#s = /* @__PURE__ */ M(P([]));
	get autoQueued() {
		return H(this.#s);
	}
	set autoQueued(e) {
		N(this.#s, e, !0);
	}
	#c = /* @__PURE__ */ M(P([]));
	get playlists() {
		return H(this.#c);
	}
	set playlists(e) {
		N(this.#c, e, !0);
	}
	#l = /* @__PURE__ */ M(P([]));
	get trending() {
		return H(this.#l);
	}
	set trending(e) {
		N(this.#l, e, !0);
	}
	#u = /* @__PURE__ */ M("idle");
	get radioStatus() {
		return H(this.#u);
	}
	set radioStatus(e) {
		N(this.#u, e, !0);
	}
	#d = /* @__PURE__ */ M(P({
		slugs: [],
		cursor: null,
		status: "idle"
	}));
	get podcastBrowse() {
		return H(this.#d);
	}
	set podcastBrowse(e) {
		N(this.#d, e, !0);
	}
	#f = /* @__PURE__ */ M(P({
		ids: [],
		cursor: null,
		status: "idle"
	}));
	get bookBrowse() {
		return H(this.#f);
	}
	set bookBrowse(e) {
		N(this.#f, e, !0);
	}
	#p = /* @__PURE__ */ M(P([]));
	get newEpisodes() {
		return H(this.#p);
	}
	set newEpisodes(e) {
		N(this.#p, e, !0);
	}
	#m = /* @__PURE__ */ M("idle");
	get newStatus() {
		return H(this.#m);
	}
	set newStatus(e) {
		N(this.#m, e, !0);
	}
	#h = /* @__PURE__ */ M(P({}));
	get bookStatus() {
		return H(this.#h);
	}
	set bookStatus(e) {
		N(this.#h, e, !0);
	}
	#g = /* @__PURE__ */ M(P({}));
	get transcripts() {
		return H(this.#g);
	}
	set transcripts(e) {
		N(this.#g, e, !0);
	}
	#_ = /* @__PURE__ */ M(P({
		q: "",
		hits: [],
		status: "idle"
	}));
	get search() {
		return H(this.#_);
	}
	set search(e) {
		N(this.#_, e, !0);
	}
	#v = /* @__PURE__ */ M(P({
		ids: [],
		page: 0,
		more: !1,
		total: 0,
		status: "idle"
	}));
	get stationHits() {
		return H(this.#v);
	}
	set stationHits(e) {
		N(this.#v, e, !0);
	}
	#y = /* @__PURE__ */ M(P({}));
	get radioLists() {
		return H(this.#y);
	}
	set radioLists(e) {
		N(this.#y, e, !0);
	}
	#b = /* @__PURE__ */ M(P({}));
	get nowPlaying() {
		return H(this.#b);
	}
	set nowPlaying(e) {
		N(this.#b, e, !0);
	}
	supported = !0;
	#x = /* @__PURE__ */ M("home");
	get tab() {
		return H(this.#x);
	}
	set tab(e) {
		N(this.#x, e, !0);
	}
	#S = /* @__PURE__ */ M(null);
	get showSlug() {
		return H(this.#S);
	}
	set showSlug(e) {
		N(this.#S, e, !0);
	}
	#C = /* @__PURE__ */ M(null);
	get bookId() {
		return H(this.#C);
	}
	set bookId(e) {
		N(this.#C, e, !0);
	}
	#w = /* @__PURE__ */ M("All");
	get genre() {
		return H(this.#w);
	}
	set genre(e) {
		N(this.#w, e, !0);
	}
	#T = /* @__PURE__ */ M("");
	get query() {
		return H(this.#T);
	}
	set query(e) {
		N(this.#T, e, !0);
	}
	#E = /* @__PURE__ */ M("onair");
	get rtab() {
		return H(this.#E);
	}
	set rtab(e) {
		N(this.#E, e, !0);
	}
	#D = /* @__PURE__ */ M(null);
	get pop() {
		return H(this.#D);
	}
	set pop(e) {
		N(this.#D, e, !0);
	}
	#O = /* @__PURE__ */ M(null);
	get popItem() {
		return H(this.#O);
	}
	set popItem(e) {
		N(this.#O, e, !0);
	}
	#k = /* @__PURE__ */ M(!1);
	get shortcuts() {
		return H(this.#k);
	}
	set shortcuts(e) {
		N(this.#k, e, !0);
	}
	#A = /* @__PURE__ */ M("all");
	get libKind() {
		return H(this.#A);
	}
	set libKind(e) {
		N(this.#A, e, !0);
	}
	#j = /* @__PURE__ */ M("recent");
	get libSort() {
		return H(this.#j);
	}
	set libSort(e) {
		N(this.#j, e, !0);
	}
	#M = /* @__PURE__ */ M("");
	get libQuery() {
		return H(this.#M);
	}
	set libQuery(e) {
		N(this.#M, e, !0);
	}
	#N = /* @__PURE__ */ M(null);
	get toast() {
		return H(this.#N);
	}
	set toast(e) {
		N(this.#N, e, !0);
	}
	#P = /* @__PURE__ */ M(null);
	get now() {
		return H(this.#P);
	}
	set now(e) {
		N(this.#P, e, !0);
	}
	#F = /* @__PURE__ */ M(0);
	get pos() {
		return H(this.#F);
	}
	set pos(e) {
		N(this.#F, e, !0);
	}
	#I = /* @__PURE__ */ M(!1);
	get playing() {
		return H(this.#I);
	}
	set playing(e) {
		N(this.#I, e, !0);
	}
	#L = /* @__PURE__ */ M(!1);
	get buffering() {
		return H(this.#L);
	}
	set buffering(e) {
		N(this.#L, e, !0);
	}
	#R = /* @__PURE__ */ M(!1);
	get loadingItem() {
		return H(this.#R);
	}
	set loadingItem(e) {
		N(this.#R, e, !0);
	}
	#z = /* @__PURE__ */ M(1);
	get speed() {
		return H(this.#z);
	}
	set speed(e) {
		N(this.#z, e, !0);
	}
	#B = /* @__PURE__ */ M(P({}));
	get speeds() {
		return H(this.#B);
	}
	set speeds(e) {
		N(this.#B, e, !0);
	}
	#V = /* @__PURE__ */ M(P([]));
	get queue() {
		return H(this.#V);
	}
	set queue(e) {
		N(this.#V, e, !0);
	}
	#H = /* @__PURE__ */ M(P({}));
	get progress() {
		return H(this.#H);
	}
	set progress(e) {
		N(this.#H, e, !0);
	}
	#U = /* @__PURE__ */ M(P({}));
	get played() {
		return H(this.#U);
	}
	set played(e) {
		N(this.#U, e, !0);
	}
	#W = /* @__PURE__ */ M(P({}));
	get subscribed() {
		return H(this.#W);
	}
	set subscribed(e) {
		N(this.#W, e, !0);
	}
	#G = /* @__PURE__ */ M(P({}));
	get bookmarks() {
		return H(this.#G);
	}
	set bookmarks(e) {
		N(this.#G, e, !0);
	}
	#K = /* @__PURE__ */ M(P([]));
	get recentStations() {
		return H(this.#K);
	}
	set recentStations(e) {
		N(this.#K, e, !0);
	}
	#q = /* @__PURE__ */ M(P({}));
	get favorites() {
		return H(this.#q);
	}
	set favorites(e) {
		N(this.#q, e, !0);
	}
	#J = /* @__PURE__ */ M(P({}));
	get saved() {
		return H(this.#J);
	}
	set saved(e) {
		N(this.#J, e, !0);
	}
	#Y = /* @__PURE__ */ M(P({}));
	get addedAt() {
		return H(this.#Y);
	}
	set addedAt(e) {
		N(this.#Y, e, !0);
	}
	#X = /* @__PURE__ */ M(P([]));
	get history() {
		return H(this.#X);
	}
	set history(e) {
		N(this.#X, e, !0);
	}
	#Z = /* @__PURE__ */ M(P({}));
	get stats() {
		return H(this.#Z);
	}
	set stats(e) {
		N(this.#Z, e, !0);
	}
	#Q = /* @__PURE__ */ M(P({ ...Ta }));
	get prefs() {
		return H(this.#Q);
	}
	set prefs(e) {
		N(this.#Q, e, !0);
	}
	#$ = /* @__PURE__ */ M(null);
	get sleep() {
		return H(this.#$);
	}
	set sleep(e) {
		N(this.#$, e, !0);
	}
	#ee = /* @__PURE__ */ M(.8);
	get volume() {
		return H(this.#ee);
	}
	set volume(e) {
		N(this.#ee, e, !0);
	}
	#te = /* @__PURE__ */ M(!1);
	get muted() {
		return H(this.#te);
	}
	set muted(e) {
		N(this.#te, e, !0);
	}
	#ne = /* @__PURE__ */ M(!1);
	get restored() {
		return H(this.#ne);
	}
	set restored(e) {
		N(this.#ne, e, !0);
	}
	host;
	api;
	storageKey;
	engine = new $i();
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
		return e && Fi(e) ? e.chapters : [];
	}
	get chapIdx() {
		return oa(this.chapters, this.pos);
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
		return e ? aa(e.lines, this.pos, (e) => e.t) : -1;
	}
	get kindLabel() {
		let e = this.item;
		return e ? e.type === "radio" ? "● LIVE RADIO" : Pi[e.type].toUpperCase() : "";
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
		return e ? wa[e.type] : ["queue"];
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
			...Oa,
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
		let e = this.item && Fi(this.item) ? { [this.item.id]: {
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
		this.queue = [], this.say("Up next cleared"), this.scheduleSave();
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
		this.queue = i, this.play(r);
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
		return t && Fi(t) && (t.dur || this.progress[e]?.dur) || 0;
	}
	speedFor(e) {
		let t = this.items[e];
		return !t || t.type === "radio" ? 1 : this.speeds[Ii(t)] ?? 1;
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
		return n ? na(n) : "";
	}
	leftOf(e) {
		let t = this.items[e], n = this.progressOf(e), r = this.durOf(e);
		return t ? t.type === "radio" ? "Live now" : this.isDone(e) ? "Played" : r ? n > 5 ? `${na((r - n) / this.speedFor(e))} left` : na(r) : n > 5 ? `${ta(n)} in` : "" : "";
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
				let e = Qi(await this.api.stations.trending(30), "stations").map(Ki).filter((e) => !!e);
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
			let e = [], i = o.page + 1, s = null, c = !1, l = (e) => Qi(e, "stations").map(Ki).filter((e) => !!e);
			if (!r.slugs.length) {
				if (n.stations.browse) {
					let r = Zi(await n.stations.browse(t ? o.cursor ?? void 0 : void 0));
					e = l(r), s = typeof r.next_cursor == "string" && r.next_cursor ? r.next_cursor : null, c = !!s;
				} else e = l(await n.stations.trending(30));
			} else if (n.stations.genre) {
				let t = await Promise.all(r.slugs.map((e) => n.stations.genre(e, i).catch(() => null)));
				if (t.every((e) => e === null)) throw Error("genre unavailable");
				let a = t.map(l);
				for (let t = 0; a.some((e) => t < e.length); t++) for (let n of a) n[t] && e.push(n[t]);
				c = t.some((e) => Zi(e).has_more === !0);
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
		let n = Zi(await this.api.podcasts.get(e, t)), r = qi(Zi(n.podcast));
		if (!r) throw Error("missing show");
		let i = Qi(n, "episodes").map((e) => Ji(e, r)).filter((e) => !!e);
		this.shows = {
			...this.shows,
			[e]: r
		}, this.subscribed[e] && (this.subscribed = {
			...this.subscribed,
			[e]: r
		}), this.remember(i);
		let a = Zi(n.pagination);
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
		e ? (this.queue = [...r, ...this.queue.filter((e) => !t.includes(e))], this.play(n)) : this.queue = [...this.queue.filter((e) => !t.includes(e)), ...t], this.say(e ? `Playing ${t.length} unplayed episodes` : `${t.length} episodes added to Up next`), this.scheduleSave();
	}
	async loadPodcastBrowse(e = !1) {
		if (!(!this.api || this.podcastBrowse.status === "loading" || e && !this.podcastBrowse.cursor)) {
			this.podcastBrowse.status = "loading";
			try {
				let t = Zi(await this.api.podcasts.list({
					sort: "last-episode",
					limit: 24,
					cursor: e ? this.podcastBrowse.cursor ?? void 0 : void 0
				})), n = Qi(t, "podcasts").map(qi).filter((e) => !!e);
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
				let t = Zi(await this.api.audiobooks.list({
					limit: 24,
					cursor: e ? this.bookBrowse.cursor ?? void 0 : void 0
				})), n = Qi(t, "audiobooks").map(Yi).filter((e) => !!e);
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
			let t = Yi(Zi(Zi(await this.api.audiobooks.get(n)).audiobook));
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
		r.length && (this.queue = [...this.queue, ...r], this.autoQueued = [...this.autoQueued, ...r].slice(-300), this.say(r.length === 1 ? "A new episode was added to Up next" : `${r.length} new episodes were added to Up next`), this.scheduleSave());
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
				let i = Zi(n), a = Xi(i).map((e) => ({
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
			let t = Zi(await this.api.stations.nowPlaying(e.stationId)), n = (e) => {
				let t = typeof e.title == "string" && e.title !== "Live broadcast" ? e.title : "", n = typeof e.artwork_url == "string" && e.artwork_url.startsWith("https://") ? e.artwork_url : void 0;
				return {
					title: t,
					artist: typeof e.artist == "string" ? e.artist : "",
					art: n,
					at: typeof e.played_at == "string" ? e.played_at : void 0
				};
			}, r = Qi(t, "recent").map(n).filter((e) => e.title), i = this.nowPlaying[e.stationId], a = {
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
				let e = Qi(await this.api.search(t, "all"), "results");
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
				let t = Zi(await r.stations.search(e, 20, i.page + 1));
				if (n !== this.searchSeq) return;
				let a = Qi(t, "stations").map(Ki).filter((e) => !!e);
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
			let t = Ki(Zi(await this.api?.stations.get(e.id)));
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
		}, Na));
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
		if (this.pos = Fi(n) && n.dur && r >= n.dur - 5 ? 0 : r, n.type === "podcast" && this.pos < 1) {
			let e = this.showPrefsOf(n.show).intro;
			e && (!n.dur || e < n.dur - 30) && (this.pos = e);
		}
		this.queue = la(this.queue, e), this.speed = this.speedFor(e), n.type === "radio" && (this.recentStations = [e, ...this.recentStations.filter((t) => t !== e)].slice(0, 6)), wa[n.type].includes(this.rtab) || (this.rtab = wa[n.type][0]), this.history = ba(this.history, e, Date.now()), this.playing = !0, this.sync(!0), n.type === "radio" && this.refreshNowPlaying(), this.rtab === "trans" && this.loadTranscript(), this.scheduleSave();
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
			else if (Fi(e) && this.prefs.smartRewind && this.pausedAt) {
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
		e && Fi(e) && this.seekTo(fa(e.chapters, this.pos));
	}
	skip(e) {
		let t = this.item;
		if (!t || !Fi(t)) return;
		let n = this.durOf(t.id);
		this.seekTo(Math.max(0, n ? Math.min(n, this.pos + e) : this.pos + e));
	}
	seekTo(e) {
		let t = this.item;
		if (t && Fi(t)) {
			if (this.pos = e, t.type === "book") {
				let { index: n, offset: r } = ua(t.chapters, e), i = t.chapters[n];
				i?.url && this.engine.load(i.url, r);
			} else this.engine.seek(e);
			this.sync();
		}
	}
	seekFraction(e) {
		let t = this.item;
		if (!t || !Fi(t)) return;
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
			let t = oa(e.chapters, this.pos + 1), n = e.chapters[t + 1];
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
		Fi(t) && this.engine.active && (n = (t.type === "book" ? t.chapters[ua(t.chapters, this.pos).index]?.start ?? 0 : 0) + this.engine.time - this.pos, (n < 0 || n > 10) && (n = 0)), t.type === "podcast" && !t.dur && this.engine.duration && (this.items = {
			...this.items,
			[t.id]: {
				...t,
				dur: Math.round(this.engine.duration)
			}
		});
		let r = Fi(t) ? this.durOf(t.id) || 2 ** 53 - 1 : 0, i = pa({
			pos: this.pos,
			speed: this.speed,
			sleep: this.sleep
		}, Fi(t) ? {
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
		Date.now() - this.lastSaved > 1e4 && (this.lastSaved = Date.now(), Fi(t) && this.saveCurrent(), this.scheduleSave());
	}
	playNext(e) {
		this.queue = sa(this.queue, e), this.say(`Playing next: ${this.items[e]?.title ?? ""}`), this.scheduleSave();
	}
	addToQueue(e) {
		this.queue = ca(this.queue, e), this.say("Added to queue"), this.scheduleSave();
	}
	removeFromQueue(e) {
		this.queue = la(this.queue, e), this.scheduleSave();
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
			[Ii(t)]: e
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
		let n = Fi(e), r = n ? this.pos : 0, i = Math.max(0, r - 30), a = this.transcript?.lines ?? [], o = n ? a.filter((e, t) => e.t <= r && (a[t + 1]?.t ?? Infinity) > i) : [], s = e.type === "radio" ? this.songOf(e.stationId) : "", c = /* @__PURE__ */ new Date(), l = e.type === "radio" && s || e.title, u = [
			`# ${l}`,
			"",
			`- **Source:** ${e.type === "radio" ? `${e.title} (live radio)` : e.sub}`,
			n ? `- **Clip:** ${ta(i)}–${ta(r)}` : `- **Heard at:** ${c.toLocaleString()}`,
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
			}), this.say(e.type === "radio" ? `Clipped “${l}” to TEND Notes` : `Clip ${ta(i)}–${ta(r)} saved to TEND Notes`);
		} catch {
			this.say("Install TEND Notes to save clips");
		}
	}
	bookmark(e = this.bookId ?? "") {
		let t = this.items[e], n = t?.type === "book" ? t : null;
		if (!n) return;
		let r = this.progressOf(n.id), i = oa(n.chapters, r), a = i >= 0 ? `Chapter ${Ri(i)} · ${ta(r - n.chapters[i].start)}` : ta(r);
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
			album: `TEND Media · ${Pi[n.type]}`,
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
			playlists: this.playlists
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
			}, this.history = (t.history ?? []).filter((e) => this.items[e.id]), this.stats = t.stats ?? {}, this.addedAt = t.addedAt ?? {}, this.showPrefs = t.showPrefs ?? {}, this.autoQueued = t.autoQueued ?? [], this.playlists = t.playlists ?? [], this.prefs = {
				...Ta,
				...t.prefs ?? {}
			}, t.now && this.items[t.now] && (this.now = t.now, this.pos = t.pos ?? 0, this.speed = this.speedFor(t.now));
			let e = this.item;
			e?.type === "book" && this.ensureBook(e.id);
		}
		this.restored = !0;
	}
}, Z = {
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
}, Fa = /* @__PURE__ */ Ar("<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path></path></svg>"), Ia = /* @__PURE__ */ Ar("<svg viewBox=\"0 0 24 24\" fill=\"currentColor\" aria-hidden=\"true\"><path></path></svg>");
function Q(e, t) {
	let n = Mi(t, "size", 3, 16), r = Mi(t, "stroke", 3, 0);
	var i = Mr(), a = I(i), o = (e) => {
		var i = Fa(), a = L(i);
		z(() => {
			X(i, "width", n()), X(i, "height", n()), X(i, "stroke-width", r()), X(a, "d", t.d);
		}), G(e, i);
	}, s = (e) => {
		var r = Ia(), i = L(r);
		z(() => {
			X(r, "width", n()), X(r, "height", n()), X(i, "d", t.d);
		}), G(e, r);
	};
	q(a, (e) => {
		r() ? e(o) : e(s, -1);
	}), G(e, i);
}
//#endregion
//#region src/components/TopBar.svelte
var La = /* @__PURE__ */ W("<header class=\"bar svelte-1h259us\"><span class=\"by svelte-1h259us\">Powered by OndaCast</span> <div class=\"spacer svelte-1h259us\"></div> <label class=\"search svelte-1h259us\"><!> <input type=\"search\" placeholder=\"Search stations, shows, books\" aria-label=\"Search stations, shows and books\" class=\"svelte-1h259us\"/></label> <button class=\"gear svelte-1h259us\" data-pop=\"\" aria-haspopup=\"dialog\" aria-label=\"Playback preferences\" title=\"Playback preferences\"><!></button></header>"), Ra = {
	hash: "svelte-1h259us",
	code: ".bar.svelte-1h259us {height:36px;flex:none;display:flex;align-items:center;gap:10px;padding:0 14px;background:var(--tm-panel-surface);border-bottom:1px solid var(--tm-fg-6);}.by.svelte-1h259us {font-size:11px;color:var(--tm-muted);}.spacer.svelte-1h259us {flex:1;}.gear.svelte-1h259us {width:26px;height:26px;border:0;border-radius:7px;background:none;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;}.gear.svelte-1h259us:hover, .gear[aria-expanded='true'].svelte-1h259us {background:var(--tm-fg-8);color:var(--tm-fg);}.search.svelte-1h259us {display:flex;align-items:center;gap:8px;height:24px;padding:0 10px;border-radius:7px;background:var(--tm-fg-6);width:220px;box-sizing:border-box;color:var(--tm-muted);}.search.svelte-1h259us:focus-within {box-shadow:0 0 0 1px var(--tm-accent);}input.svelte-1h259us {flex:1;min-width:0;border:0;background:none;outline:none;color:var(--tm-fg);font:inherit;font-size:11.5px;padding:0;}input.svelte-1h259us::placeholder {color:var(--tm-muted);opacity:1;}input.svelte-1h259us::-webkit-search-cancel-button {display:none;}"
};
function za(e, t) {
	We(t, !0), ei(e, Ra);
	var n = La(), r = R(F(n), 4), i = F(r);
	Q(i, {
		get d() {
			return Z.search;
		},
		size: 13,
		stroke: 2
	});
	var a = R(i, 2);
	bi(a), O(r);
	var o = R(r, 2);
	Q(F(o), {
		get d() {
			return Z.gear;
		},
		size: 15,
		stroke: 1.6
	}), O(o), O(n), z(() => {
		xi(a, t.store.query), X(o, "aria-expanded", t.store.pop === "prefs");
	}), U("input", a, (e) => t.store.setQuery(e.currentTarget.value)), U("keydown", a, (e) => {
		e.key === "Escape" && t.store.setQuery("");
	}), U("click", o, () => t.store.togglePop("prefs")), G(e, n), Ge();
}
xr([
	"input",
	"keydown",
	"click"
]);
//#endregion
//#region src/components/Cover.svelte
var Ba = /* @__PURE__ */ W("<img alt=\"\" loading=\"lazy\" decoding=\"async\" referrerpolicy=\"no-referrer\" class=\"svelte-2fjyqn\"/>"), Va = /* @__PURE__ */ W("<div><!></div>"), Ha = {
	hash: "svelte-2fjyqn",
	code: ".cover.svelte-2fjyqn {flex:none;display:grid;place-items:center;overflow:hidden;font-family:ui-monospace, Menlo, monospace;font-weight:600;color:rgba(255, 255, 255, .75);}.cover.fill.svelte-2fjyqn {flex:1;}img.svelte-2fjyqn {width:100%;height:100%;object-fit:cover;display:block;}"
};
function $(e, t) {
	We(t, !0), ei(e, Ha);
	let n = Mi(t, "radius", 3, 8), r = Mi(t, "mark", 3, ""), i = Mi(t, "font", 3, 11), a = Mi(t, "fill", 3, !1), o = /* @__PURE__ */ M(!1);
	_n(() => {
		t.art, N(o, !1);
	});
	var s = Va();
	let c, l;
	var u = F(s), d = (e) => {
		var n = Mr();
		Wr(I(n), () => t.art, (e) => {
			var n = Ba();
			z(() => X(n, "src", t.art)), br("error", n, () => N(o, !0)), vr(n), G(e, n);
		}), G(e, n);
	}, f = (e) => {
		var t = jr();
		z(() => K(t, r())), G(e, t);
	};
	q(u, (e) => {
		t.art && !H(o) ? e(d) : e(f, -1);
	}), O(s), z((e) => {
		c = Y(s, 1, "cover svelte-2fjyqn", null, c, { fill: a() }), l = ci(s, "", l, {
			width: a() ? "100%" : `${t.size}px`,
			height: a() ? "100%" : `${t.size}px`,
			"border-radius": `${n() ?? ""}px`,
			background: e,
			"font-size": `${i() ?? ""}px`
		});
	}, [() => ea(t.hue)]), G(e, s), Ge();
}
//#endregion
//#region src/components/Sidebar.svelte
var Ua = /* @__PURE__ */ W("<span class=\"count svelte-181dlmc\"> </span>"), Wa = /* @__PURE__ */ W("<button><!><span class=\"label svelte-181dlmc\"> </span> <!></button>"), Ga = /* @__PURE__ */ W("<span class=\"eq svelte-181dlmc\" aria-hidden=\"true\"><i class=\"svelte-181dlmc\"></i><i class=\"svelte-181dlmc\"></i><i class=\"svelte-181dlmc\"></i></span>"), Ka = /* @__PURE__ */ W("<button><!> <span class=\"title svelte-181dlmc\"> </span> <!></button>"), qa = /* @__PURE__ */ W("<div class=\"heading svelte-181dlmc\">Favorite stations</div> <!>", 1), Ja = /* @__PURE__ */ W("<nav class=\"side svelte-181dlmc\" aria-label=\"TEND Media\"><!> <!> <div class=\"spacer svelte-181dlmc\"></div> <button class=\"keys svelte-181dlmc\"><!>Keyboard shortcuts<kbd class=\"svelte-181dlmc\">?</kbd></button></nav>"), Ya = {
	hash: "svelte-181dlmc",
	code: ".side.svelte-181dlmc {width:188px;flex:none;padding:18px 12px;display:flex;flex-direction:column;gap:2px;border-right:1px solid var(--tm-fg-6);box-sizing:border-box;overflow:auto;}.tab.svelte-181dlmc {display:flex;align-items:center;gap:11px;height:36px;flex:none;padding:0 10px;border:0;border-radius:9px;background:transparent;color:var(--tm-fg);font-size:13px;font-weight:500;cursor:pointer;text-align:left;}.tab.svelte-181dlmc:hover {background:var(--tm-fg-6);}.tab.on.svelte-181dlmc {background:var(--tm-accent-12);color:var(--tm-accent);}.heading.svelte-181dlmc {margin:22px 10px 8px;font-size:10.5px;letter-spacing:1px;text-transform:uppercase;color:var(--tm-muted);}.show.svelte-181dlmc {display:flex;align-items:center;gap:10px;padding:6px 10px;font-size:12.5px;color:var(--tm-fg);border:0;border-radius:8px;background:none;cursor:pointer;text-align:left;}.show.svelte-181dlmc:hover {background:var(--tm-fg-4);}.show.on.svelte-181dlmc {background:var(--tm-fg-6);}.title.svelte-181dlmc {flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.label.svelte-181dlmc {flex:1;}.count.svelte-181dlmc {font-size:10px;font-weight:700;min-width:18px;height:18px;padding:0 5px;border-radius:9px;display:grid;place-items:center;background:var(--tm-accent);color:var(--tm-on-accent);}.eq.svelte-181dlmc {display:flex;align-items:flex-end;gap:2px;height:12px;flex:none;}.eq.svelte-181dlmc i:where(.svelte-181dlmc) {width:3px;background:var(--tm-accent);border-radius:1px; animation: svelte-181dlmc-eq 1s ease-in-out infinite;}.eq.svelte-181dlmc i:where(.svelte-181dlmc):nth-child(2) {animation-delay:-.3s;}.eq.svelte-181dlmc i:where(.svelte-181dlmc):nth-child(3) {animation-delay:-.6s;}\n  @keyframes svelte-181dlmc-eq { 0%, 100% { height: 4px; } 50% { height: 12px; } }\n  @media (prefers-reduced-motion: reduce) {.eq.svelte-181dlmc i:where(.svelte-181dlmc) { animation: none;height:8px;} }.keys.svelte-181dlmc {display:flex;align-items:center;gap:8px;padding:8px 10px;border:0;border-radius:9px;background:none;color:var(--tm-muted);font-size:11.5px;cursor:pointer;text-align:left;}.keys.svelte-181dlmc:hover {background:var(--tm-fg-6);color:var(--tm-fg);}kbd.svelte-181dlmc {margin-left:auto;font:600 10px ui-monospace, Menlo, monospace;padding:1px 6px;border-radius:4px;border:1px solid var(--tm-fg-16);}.spacer.svelte-181dlmc {flex:1;min-height:12px;}"
};
function Xa(e, t) {
	We(t, !0), ei(e, Ya);
	let n = Mi(t, "store", 7), r = [
		[
			"home",
			"Listen now",
			Z.home
		],
		[
			"mine",
			"My Media",
			Z.library
		],
		[
			"radio",
			"Radio",
			Z.radio
		],
		[
			"pod",
			"Podcasts",
			Z.podcast
		],
		[
			"book",
			"Audiobooks",
			Z.book
		]
	], i = /* @__PURE__ */ A(() => Object.values(n().favorites).sort((e, t) => n().lastPlayed(t.id) - n().lastPlayed(e.id)).slice(0, 6)), a = /* @__PURE__ */ A(() => Object.keys(n().subscribed).reduce((e, t) => e + n().newCount(t), 0));
	var o = Ja(), s = F(o);
	J(s, 17, () => r, Gr, (e, t) => {
		var r = /* @__PURE__ */ A(() => m(H(t), 3));
		let i = () => H(r)[0], o = () => H(r)[1], s = () => H(r)[2];
		var c = Wa();
		let l;
		var u = F(c);
		Q(u, {
			get d() {
				return s();
			},
			size: 17,
			stroke: 1.7
		});
		var d = R(u), f = L(d, !0), p = R(d, 2), h = (e) => {
			var t = Ua(), n = L(t, !0);
			z(() => {
				X(t, "aria-label", `${H(a) ?? ""} new episodes`), K(n, H(a));
			}), G(e, t);
		};
		q(p, (e) => {
			i() === "mine" && H(a) && e(h);
		}), O(c), z(() => {
			l = Y(c, 1, "tab svelte-181dlmc", null, l, { on: n().tab === i() && !n().query }), X(c, "aria-current", n().tab === i() && !n().query ? "page" : void 0), K(f, o());
		}), U("click", c, () => {
			n().tab = i(), n().setQuery(""), i() === "pod" && (n().showSlug = null), i() === "book" && (n().bookId = null);
		}), G(e, c);
	});
	var c = R(s, 2), l = (e) => {
		var t = qa();
		J(R(I(t), 2), 17, () => H(i), (e) => e.id, (e, t) => {
			let r = /* @__PURE__ */ A(() => n().isPlaying(H(t).id));
			var i = Ka();
			let a;
			var o = F(i);
			$(o, {
				get hue() {
					return H(t).hue;
				},
				get art() {
					return H(t).art;
				},
				size: 26,
				radius: 6,
				font: 9,
				get mark() {
					return H(t).mark;
				}
			});
			var s = R(o, 2), c = L(s, !0), l = R(s, 2), u = (e) => {
				G(e, Ga());
			};
			q(l, (e) => {
				H(r) && e(u);
			}), O(i), z(() => {
				a = Y(i, 1, "show svelte-181dlmc", null, a, { on: H(t).id === n().now }), X(i, "aria-label", `${H(r) ? "Stop" : "Play"} ${H(t).title ?? ""}`), K(c, H(t).title);
			}), U("click", i, () => H(r) ? n().stop() : n().play(H(t).id)), G(e, i);
		}), G(e, t);
	};
	q(c, (e) => {
		H(i).length && e(l);
	});
	var u = R(c, 4);
	Q(F(u), {
		get d() {
			return Z.keyboard;
		},
		size: 14,
		stroke: 1.7
	}), k(2), O(u), O(o), U("click", u, () => n().shortcuts = !0), G(e, o), Ge();
}
xr(["click"]);
//#endregion
//#region src/focus.ts
function Za(e) {
	e.isConnected ? e.focus() : requestAnimationFrame(() => e.focus());
}
//#endregion
//#region src/components/ItemMenu.svelte
var Qa = /* @__PURE__ */ W("<button role=\"menuitem\" class=\"svelte-8mcf8g\"><!>Play next</button> <button role=\"menuitem\" class=\"svelte-8mcf8g\"><!>Add to Up next</button>", 1), $a = /* @__PURE__ */ W("<span class=\"in svelte-8mcf8g\">Added</span>"), eo = /* @__PURE__ */ W("<button role=\"menuitem\" class=\"svelte-8mcf8g\"><!><span class=\"nm svelte-8mcf8g\"> </span><!></button>"), to = /* @__PURE__ */ W("<form class=\"newform svelte-8mcf8g\"><input maxlength=\"80\" placeholder=\"Playlist name\" aria-label=\"New playlist name\" class=\"svelte-8mcf8g\"/> <button type=\"submit\" class=\"svelte-8mcf8g\">Create</button></form>"), no = /* @__PURE__ */ W("<button role=\"menuitem\" class=\"svelte-8mcf8g\"><!>New playlist…</button>"), ro = /* @__PURE__ */ W("<div role=\"menu\"><!> <div class=\"sep svelte-8mcf8g\">Add to playlist</div> <!> <!> <div class=\"rule svelte-8mcf8g\"></div> <button role=\"menuitem\" class=\"svelte-8mcf8g\"><!> </button></div>"), io = /* @__PURE__ */ W("<span class=\"anchor svelte-8mcf8g\"><button class=\"dots svelte-8mcf8g\" data-pop=\"\" aria-haspopup=\"menu\">•••</button> <!></span>"), ao = {
	hash: "svelte-8mcf8g",
	code: ".anchor.svelte-8mcf8g {position:relative;display:inline-flex;flex:none;}.dots.svelte-8mcf8g {width:30px;height:28px;border:0;border-radius:7px;background:transparent;color:var(--tm-muted);cursor:pointer;font-size:11px;letter-spacing:1px;}.dots.svelte-8mcf8g:hover, .dots[aria-expanded='true'].svelte-8mcf8g {background:var(--tm-fg-8);color:var(--tm-fg);}.menu.svelte-8mcf8g {right:0;top:32px;width:230px;padding:6px;z-index:8;}.menu.left.svelte-8mcf8g {left:0;right:auto;}.menu.svelte-8mcf8g button:where(.svelte-8mcf8g) {display:flex;align-items:center;gap:9px;width:100%;height:32px;padding:0 10px;border:0;border-radius:8px;background:none;color:var(--tm-fg);font-size:12px;cursor:pointer;text-align:left;}.menu.svelte-8mcf8g button:where(.svelte-8mcf8g):hover:not(:disabled) {background:var(--tm-fg-8);}.menu.svelte-8mcf8g button:where(.svelte-8mcf8g):disabled {opacity:.55;cursor:default;}.nm.svelte-8mcf8g {flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.in.svelte-8mcf8g {font-size:10.5px;color:var(--tm-accent);}.sep.svelte-8mcf8g {font-size:10px;letter-spacing:.8px;text-transform:uppercase;color:var(--tm-muted);padding:8px 10px 4px;}.rule.svelte-8mcf8g {height:1px;background:var(--tm-fg-8);margin:4px 0;}.newform.svelte-8mcf8g {display:flex;gap:6px;padding:4px 6px;}.newform.svelte-8mcf8g input:where(.svelte-8mcf8g) {flex:1;min-width:0;height:28px;padding:0 8px;border-radius:7px;border:1px solid var(--tm-fg-14);background:var(--tm-fg-4);color:var(--tm-fg);font:inherit;font-size:12px;outline:none;}.newform.svelte-8mcf8g input:where(.svelte-8mcf8g):focus {border-color:var(--tm-accent);}.newform.svelte-8mcf8g button:where(.svelte-8mcf8g) {width:auto;height:28px;padding:0 10px;border-radius:7px;background:var(--tm-accent);color:var(--tm-on-accent);font-weight:650;justify-content:center;}.newform.svelte-8mcf8g button:where(.svelte-8mcf8g):hover {background:var(--tm-accent);}"
};
function oo(e, t) {
	We(t, !0), ei(e, ao);
	let n = Mi(t, "store", 7), r = Mi(t, "align", 3, "right"), i = /* @__PURE__ */ A(() => n().items[t.id]), a = /* @__PURE__ */ A(() => n().pop === "item" && n().popItem === t.id), o = /* @__PURE__ */ A(() => n().isDone(t.id)), s = /* @__PURE__ */ A(() => t.id === n().now), c = /* @__PURE__ */ M(!1), l = /* @__PURE__ */ M(""), u = () => {
		n().pop = null, n().popItem = null, N(c, !1);
	};
	function d() {
		let e = {
			id: `pl:${Date.now().toString(36)}`,
			name: H(l).trim().slice(0, 80) || H(i)?.title.slice(0, 40) || "My playlist",
			ids: [t.id],
			at: Date.now()
		};
		n().playlists = [e, ...n().playlists], n().say(`Saved to “${e.name}”`), n().scheduleSave(), u();
	}
	var f = Mr(), p = I(f), m = (e) => {
		var f = io(), p = F(f), m = R(p, 2), h = (e) => {
			var i = ro();
			let a;
			var f = F(i), p = (e) => {
				var r = Qa(), i = I(r);
				Q(F(i), {
					get d() {
						return Z.playNext;
					},
					size: 13,
					stroke: 1.8
				}), k(), O(i);
				var a = R(i, 2);
				Q(F(a), {
					get d() {
						return Z.plus;
					},
					size: 13,
					stroke: 1.8
				}), k(), O(a), U("click", i, () => {
					n().playNext(t.id), u();
				}), U("click", a, () => {
					n().addToQueue(t.id), u();
				}), G(e, r);
			};
			q(f, (e) => {
				H(s) || e(p);
			});
			var m = R(f, 4);
			J(m, 17, () => n().playlists, (e) => e.id, (e, r) => {
				var i = eo(), a = F(i);
				Q(a, {
					get d() {
						return Z.list;
					},
					size: 13,
					stroke: 1.8
				});
				var o = R(a), s = L(o, !0), c = R(o), l = (e) => {
					G(e, $a());
				}, d = /* @__PURE__ */ A(() => H(r).ids.includes(t.id));
				q(c, (e) => {
					H(d) && e(l);
				}), O(i), z((e) => {
					i.disabled = e, K(s, H(r).name);
				}, [() => H(r).ids.includes(t.id)]), U("click", i, () => {
					n().addToPlaylist(H(r).id, t.id), u();
				}), G(e, i);
			});
			var h = R(m, 2), g = (e) => {
				var t = to(), n = F(t);
				bi(n), ti(n, (e) => Za?.(e)), bn(() => Ei(n, () => H(l), (e) => N(l, e))), k(2), O(t), br("submit", t, (e) => {
					e.preventDefault(), d();
				}), U("keydown", n, (e) => {
					e.key === "Escape" && (e.stopPropagation(), N(c, !1));
				}), G(e, t);
			}, _ = (e) => {
				var t = no();
				Q(F(t), {
					get d() {
						return Z.plus;
					},
					size: 13,
					stroke: 1.8
				}), k(), O(t), U("click", t, () => {
					N(c, !0), N(l, "");
				}), G(e, t);
			};
			q(h, (e) => {
				H(c) ? e(g) : e(_, -1);
			});
			var v = R(h, 4), y = F(v);
			Q(y, {
				get d() {
					return Z.check;
				},
				size: 13,
				stroke: 2
			});
			var b = R(y, 1, !0);
			O(v), O(i), z(() => {
				a = Y(i, 1, "tm-pop menu svelte-8mcf8g", null, a, { left: r() === "left" }), K(b, H(o) ? "Mark as unplayed" : "Mark as played");
			}), U("click", v, () => {
				n().togglePlayed(t.id), u();
			}), G(e, i);
		};
		q(m, (e) => {
			H(a) && e(h);
		}), O(f), z(() => {
			X(p, "aria-expanded", H(a)), X(p, "aria-label", `More for ${H(i).title ?? ""}`);
		}), U("click", p, (e) => {
			e.stopPropagation(), n().openItemMenu(t.id), N(c, !1);
		}), G(e, f);
	};
	q(p, (e) => {
		H(i) && H(i).type !== "radio" && e(m);
	}), G(e, f), Ge();
}
xr(["click", "keydown"]);
//#endregion
//#region src/components/ItemRow.svelte
var so = /* @__PURE__ */ W("<button class=\"icon svelte-ee3n05\" title=\"Play next\"><!></button> <button class=\"icon svelte-ee3n05\" title=\"Add to queue\"><!></button>", 1), co = /* @__PURE__ */ W("<div><!> <div class=\"text svelte-ee3n05\"><div> </div> <div class=\"meta svelte-ee3n05\"> </div></div> <!> <!> <button class=\"play svelte-ee3n05\"><!></button></div>"), lo = {
	hash: "svelte-ee3n05",
	code: ".row.svelte-ee3n05 {display:flex;align-items:center;gap:14px;padding:10px 8px;border-radius:10px;}.row.svelte-ee3n05:hover {background:var(--tm-fg-5);}.row.cur.svelte-ee3n05 {background:var(--tm-accent-8);}.text.svelte-ee3n05 {flex:1;min-width:0;}.title.svelte-ee3n05 {font-size:13px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.cur.svelte-ee3n05 .title:where(.svelte-ee3n05) {color:var(--tm-accent);}.title.done.svelte-ee3n05 {color:var(--tm-muted);}.meta.svelte-ee3n05 {font-size:11.5px;color:var(--tm-muted);margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.icon.svelte-ee3n05 {width:32px;height:32px;flex:none;border:0;border-radius:8px;background:transparent;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;}.icon.svelte-ee3n05:hover {background:var(--tm-fg-8);color:var(--tm-fg);}.play.svelte-ee3n05 {width:34px;height:34px;flex:none;border:0;border-radius:17px;background:var(--tm-accent);color:var(--tm-on-accent);cursor:pointer;display:grid;place-items:center;}"
};
function uo(e, t) {
	We(t, !0), ei(e, lo);
	let n = /* @__PURE__ */ A(() => t.store.items[t.id]), r = /* @__PURE__ */ A(() => t.id === t.store.now), i = /* @__PURE__ */ A(() => H(n) ? H(n).type === "podcast" ? [
		H(n).sub,
		Gi(H(n).date),
		t.store.lenOf(t.id)
	].filter(Boolean).join(" · ") : H(n).type === "radio" ? `${Pi.radio} · ${H(n).sub}` : `${Pi.book} · ${H(n).sub}` : "");
	var a = Mr(), o = I(a), s = (e) => {
		var a = co();
		let o;
		var s = F(a);
		$(s, {
			get hue() {
				return H(n).hue;
			},
			get art() {
				return H(n).art;
			},
			get mark() {
				return H(n).mark;
			},
			size: 44
		});
		var c = R(s, 2), l = F(c);
		let u;
		var d = L(l, !0), f = L(R(l, 2), !0);
		O(c);
		var p = R(c, 2), m = (e) => {
			var r = so(), i = I(r);
			Q(F(i), {
				get d() {
					return Z.playNext;
				},
				stroke: 1.8
			}), O(i);
			var a = R(i, 2);
			Q(F(a), {
				get d() {
					return Z.plus;
				},
				stroke: 1.8
			}), O(a), z(() => {
				X(i, "aria-label", `Play next: ${H(n).title ?? ""}`), X(a, "aria-label", `Add to queue: ${H(n).title ?? ""}`);
			}), U("click", i, () => t.store.playNext(t.id)), U("click", a, () => t.store.addToQueue(t.id)), G(e, r);
		};
		q(p, (e) => {
			H(n).type !== "radio" && !H(r) && e(m);
		});
		var h = R(p, 2), g = (e) => {
			oo(e, {
				get store() {
					return t.store;
				},
				get id() {
					return t.id;
				}
			});
		};
		q(h, (e) => {
			H(n).type !== "radio" && e(g);
		});
		var _ = R(h, 2), v = F(_);
		{
			let e = /* @__PURE__ */ A(() => t.store.isPlaying(t.id) ? H(n).type === "radio" ? Z.stop : Z.pause : Z.play);
			Q(v, {
				get d() {
					return H(e);
				},
				size: 14
			});
		}
		O(_), O(a), z((e, t) => {
			o = Y(a, 1, "row svelte-ee3n05", null, o, { cur: H(r) }), u = Y(l, 1, "title svelte-ee3n05", null, u, { done: e }), K(d, H(n).title), K(f, H(i)), X(_, "aria-label", `${t ?? ""} ${H(n).title ?? ""}`);
		}, [() => !H(r) && t.store.isDone(t.id), () => t.store.isPlaying(t.id) ? H(n).type === "radio" ? "Stop" : "Pause" : "Play"]), U("click", _, () => t.store.isPlaying(t.id) && H(n).type === "radio" ? t.store.stop() : t.store.play(t.id)), G(e, a);
	};
	q(o, (e) => {
		H(n) && e(s);
	}), G(e, a), Ge();
}
xr(["click"]);
//#endregion
//#region src/components/Status.svelte
var fo = /* @__PURE__ */ W("<div class=\"line svelte-hcghuu\" role=\"status\"><span class=\"spin svelte-hcghuu\" aria-hidden=\"true\"></span>Loading…</div>"), po = /* @__PURE__ */ W("<button class=\"svelte-hcghuu\">Try again</button>"), mo = /* @__PURE__ */ W("<div class=\"line svelte-hcghuu\" role=\"alert\"> <!></div>"), ho = /* @__PURE__ */ W("<div class=\"line svelte-hcghuu\"> </div>"), go = {
	hash: "svelte-hcghuu",
	code: ".line.svelte-hcghuu {display:flex;align-items:center;gap:10px;padding:18px 8px;font-size:12.5px;color:var(--tm-muted);}button.svelte-hcghuu {border:0;background:none;color:var(--tm-accent);font-size:12.5px;cursor:pointer;padding:0;}.spin.svelte-hcghuu {width:14px;height:14px;border-radius:50%;border:2px solid var(--tm-fg-16);border-top-color:var(--tm-accent); animation: svelte-hcghuu-spin .8s linear infinite;}\n  @keyframes svelte-hcghuu-spin { to { transform: rotate(360deg); } }\n  @media (prefers-reduced-motion: reduce) {.spin.svelte-hcghuu { animation: none;} }"
};
function _o(e, t) {
	ei(e, go);
	let n = Mi(t, "empty", 3, ""), r = Mi(t, "error", 3, "OndaCast could not be reached.");
	var i = Mr(), a = I(i), o = (e) => {
		G(e, fo());
	}, s = (e) => {
		var n = mo(), i = F(n, !0), a = R(i), o = (e) => {
			var n = po();
			U("click", n, function(...e) {
				t.retry?.apply(this, e);
			}), G(e, n);
		};
		q(a, (e) => {
			t.retry && e(o);
		}), O(n), z(() => K(i, r())), G(e, n);
	}, c = (e) => {
		var t = ho(), r = L(t, !0);
		z(() => K(r, n())), G(e, t);
	};
	q(a, (e) => {
		t.status === "loading" ? e(o) : t.status === "error" ? e(s, 1) : n() && e(c, 2);
	}), G(e, i);
}
xr(["click"]);
//#endregion
//#region src/components/HomeView.svelte
var vo = /* @__PURE__ */ W("<button class=\"card svelte-oxdkf2\"><!> <span class=\"ctext svelte-oxdkf2\"><span class=\"kind svelte-oxdkf2\"> </span> <span class=\"ctitle svelte-oxdkf2\"> </span> <span class=\"bar svelte-oxdkf2\"><span class=\"svelte-oxdkf2\"></span></span> <span class=\"left svelte-oxdkf2\"> </span></span></button>"), yo = /* @__PURE__ */ W("<div class=\"continue svelte-oxdkf2\"></div>"), bo = /* @__PURE__ */ W("<div class=\"start svelte-oxdkf2\"><button class=\"svelte-oxdkf2\">Tune in to live radio</button> <button class=\"svelte-oxdkf2\">Find a podcast</button> <button class=\"svelte-oxdkf2\">Start an audiobook</button></div>"), xo = /* @__PURE__ */ W("<button><span class=\"banner svelte-oxdkf2\"><!><span class=\"live svelte-oxdkf2\"><i class=\"svelte-oxdkf2\"></i>LIVE</span></span> <span class=\"stext svelte-oxdkf2\"><span class=\"stitle svelte-oxdkf2\"> </span><span class=\"song svelte-oxdkf2\"> </span></span></button>"), So = /* @__PURE__ */ W("<div class=\"onair svelte-oxdkf2\"></div>"), Co = /* @__PURE__ */ W("<h1 class=\"h1 svelte-oxdkf2\"> </h1> <p class=\"lede svelte-oxdkf2\">Pick up where you left off across radio, podcasts and books.</p> <!> <div class=\"section svelte-oxdkf2\"><h2 class=\"svelte-oxdkf2\">On air now</h2><button class=\"link svelte-oxdkf2\">All stations</button></div> <!> <h2 class=\"h2 svelte-oxdkf2\">New from your shows</h2> <!>", 1), wo = {
	hash: "svelte-oxdkf2",
	code: ".h1.svelte-oxdkf2 {font-size:26px;font-weight:650;letter-spacing:-.5px;margin:0;}.lede.svelte-oxdkf2 {font-size:13px;color:var(--tm-muted);margin:4px 0 0;}.continue.svelte-oxdkf2 {display:grid;grid-template-columns:repeat(3, minmax(0, 1fr));gap:12px;margin-top:20px;}.card.svelte-oxdkf2 {display:flex;gap:12px;padding:12px;border:0;border-radius:14px;background:var(--tm-fg-4);color:inherit;cursor:pointer;align-items:center;text-align:left;font:inherit;}.card.svelte-oxdkf2:hover {background:var(--tm-fg-8);}.ctext.svelte-oxdkf2 {min-width:0;flex:1;display:flex;flex-direction:column;gap:4px;}.kind.svelte-oxdkf2 {font-size:10px;letter-spacing:.8px;text-transform:uppercase;color:var(--tm-accent);font-weight:600;}.ctitle.svelte-oxdkf2 {font-size:13px;font-weight:600;line-height:1.25;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.bar.svelte-oxdkf2 {height:3px;border-radius:2px;background:var(--tm-fg-10);margin-top:3px;display:block;}.bar.svelte-oxdkf2 span:where(.svelte-oxdkf2) {display:block;height:3px;border-radius:2px;background:var(--tm-accent);}.left.svelte-oxdkf2 {font-size:11px;color:var(--tm-muted);}.start.svelte-oxdkf2 {display:flex;flex-wrap:wrap;gap:8px;margin-top:18px;}.start.svelte-oxdkf2 button:where(.svelte-oxdkf2) {height:34px;padding:0 16px;border-radius:17px;border:1px solid var(--tm-fg-14);background:var(--tm-fg-4);color:var(--tm-fg);font-size:12.5px;font-weight:600;cursor:pointer;}.start.svelte-oxdkf2 button:where(.svelte-oxdkf2):hover {border-color:var(--tm-accent);}.section.svelte-oxdkf2 {display:flex;align-items:baseline;justify-content:space-between;margin:28px 0 12px;}h2.svelte-oxdkf2 {font-size:15px;font-weight:650;margin:0;}.h2.svelte-oxdkf2 {margin:28px 0 8px;}.link.svelte-oxdkf2 {border:0;background:none;color:var(--tm-accent);font-size:12px;cursor:pointer;padding:0;}.onair.svelte-oxdkf2 {display:grid;grid-template-columns:repeat(4, minmax(0, 1fr));gap:12px;}.station.svelte-oxdkf2 {border:0;padding:0;border-radius:14px;overflow:hidden;background:var(--tm-fg-4);color:inherit;cursor:pointer;text-align:left;font:inherit;display:flex;flex-direction:column;}.station.svelte-oxdkf2:hover {background:var(--tm-fg-8);}.station.cur.svelte-oxdkf2 {box-shadow:inset 0 0 0 1px var(--tm-accent);}.banner.svelte-oxdkf2 {height:78px;display:flex;width:100%;position:relative;}.live.svelte-oxdkf2 {position:absolute;left:10px;top:10px;display:inline-flex;align-items:center;gap:5px;font-size:9.5px;font-weight:700;letter-spacing:.8px;padding:3px 7px;border-radius:20px;background:rgba(0, 0, 0, .45);color:#fff;}.live.svelte-oxdkf2 i:where(.svelte-oxdkf2) {width:5px;height:5px;border-radius:3px;background:var(--tm-live);}.stext.svelte-oxdkf2 {padding:10px 12px 12px;display:flex;flex-direction:column;min-width:0;}.stitle.svelte-oxdkf2 {font-size:12.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.song.svelte-oxdkf2 {font-size:11px;color:var(--tm-muted);margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}"
};
function To(e, t) {
	We(t, !0), ei(e, wo);
	let n = Mi(t, "store", 7);
	var r = Co(), i = I(r), a = L(i, !0), o = R(i, 4), s = (e) => {
		var t = yo();
		J(t, 20, () => n().continueIds, (e) => e, (e, t) => {
			let r = /* @__PURE__ */ A(() => n().items[t]);
			var i = vo(), a = F(i);
			$(a, {
				get hue() {
					return H(r).hue;
				},
				get art() {
					return H(r).art;
				},
				size: 58,
				radius: 10,
				get mark() {
					return H(r).mark;
				}
			});
			var o = R(a, 2), s = F(o), c = L(s, !0), l = R(s, 2), u = L(l, !0), d = R(l, 2), f = F(d);
			let p;
			O(d);
			var m = L(R(d, 2), !0);
			O(o), O(i), z((e, t, n) => {
				X(i, "aria-label", `${e ?? ""} ${H(r).title ?? ""}`), K(c, Pi[H(r).type]), K(u, H(r).title), p = ci(f, "", p, { width: t }), K(m, n);
			}, [
				() => n().isPlaying(t) ? "Pause" : "Continue",
				() => `${n().pctOf(t) ?? ""}%`,
				() => n().leftOf(t)
			]), U("click", i, () => n().play(t)), G(e, i);
		}), O(t), G(e, t);
	}, c = (e) => {
		var t = bo(), r = F(t), i = R(r, 2), a = R(i, 2);
		O(t), U("click", r, () => n().tab = "radio"), U("click", i, () => {
			n().tab = "pod", n().showSlug = null;
		}), U("click", a, () => {
			n().tab = "book", n().bookId = null;
		}), G(e, t);
	};
	q(o, (e) => {
		n().continueIds.length ? e(s) : e(c, -1);
	});
	var l = R(o, 2), u = R(F(l));
	O(l);
	var d = R(l, 2), f = (e) => {
		var t = So();
		J(t, 20, () => n().onAirIds, (e) => e, (e, t) => {
			let r = /* @__PURE__ */ A(() => n().items[t]);
			var i = xo();
			let a;
			var o = F(i);
			$(F(o), {
				get hue() {
					return H(r).hue;
				},
				get art() {
					return H(r).art;
				},
				fill: !0,
				radius: 0,
				get mark() {
					return H(r).mark;
				},
				font: 18
			}), k(), O(o);
			var s = R(o, 2), c = F(s), l = L(c, !0), u = L(R(c), !0);
			O(s), O(i), z((e, o) => {
				a = Y(i, 1, "station svelte-oxdkf2", null, a, { cur: t === n().now }), X(i, "aria-label", `${e ?? ""} ${H(r).title ?? ""}`), K(l, H(r).title), K(u, o);
			}, [() => n().isPlaying(t) ? "Pause" : "Play", () => H(r).type === "radio" ? n().songOf(H(r).stationId) ? `♪ ${n().songOf(H(r).stationId)}` : H(r).sub : ""]), U("click", i, () => n().play(t)), G(e, i);
		}), O(t), G(e, t);
	}, p = (e) => {
		_o(e, {
			get status() {
				return n().radioStatus;
			},
			retry: () => n().loadRadio(),
			empty: "No stations are on air right now."
		});
	};
	q(d, (e) => {
		n().onAirIds.length ? e(f) : e(p, -1);
	}), J(R(d, 4), 16, () => n().newEpisodes, (e) => e, (e, t) => {
		uo(e, {
			get store() {
				return n();
			},
			get id() {
				return t;
			}
		});
	}, (e) => {
		_o(e, {
			get status() {
				return n().newStatus;
			},
			retry: () => n().loadNewEpisodes(),
			empty: "Subscribe to shows in Podcasts and their new episodes land here."
		});
	}), z((e) => K(a, e), [() => ra()]), U("click", u, () => n().tab = "radio"), G(e, r), Ge();
}
xr(["click"]);
//#endregion
//#region src/components/FavButton.svelte
var Eo = /* @__PURE__ */ W("<button><!></button>"), Do = {
	hash: "svelte-18vgx0d",
	code: ".fav.svelte-18vgx0d {width:32px;height:32px;flex:none;padding:0;border:0;border-radius:50%;background:transparent;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;transition:color .15s, transform .15s, background .15s;}.fav.svelte-18vgx0d:hover {color:var(--tm-fg);background:var(--tm-fg-8);}.fav.on.svelte-18vgx0d {color:var(--tm-live);}.fav.on.svelte-18vgx0d:hover {color:var(--tm-live);}.fav.solid.svelte-18vgx0d {background:rgba(0, 0, 0, .4);color:#fff;}.fav.solid.on.svelte-18vgx0d {color:var(--tm-live);}.fav.svelte-18vgx0d:active {transform:scale(.9);}\n  @media (prefers-reduced-motion: reduce) {.fav.svelte-18vgx0d {transition:none;} }"
};
function Oo(e, t) {
	We(t, !0), ei(e, Do);
	let n = Mi(t, "size", 3, 16), r = Mi(t, "solid", 3, !1), i = /* @__PURE__ */ A(() => t.store.items[t.id]), a = /* @__PURE__ */ A(() => t.store.isFavorite(t.id)), o = /* @__PURE__ */ A(() => H(i) ? H(i).type === "radio" ? H(a) ? "Remove from favorite stations" : "Add to favorite stations" : H(i).type === "book" ? H(a) ? "Remove from My Media" : "Save to My Media" : H(a) ? `Unsubscribe from ${H(i).sub}` : `Subscribe to ${H(i).sub}` : "");
	var s = Mr(), c = I(s), l = (e) => {
		var i = Eo();
		let s;
		var c = F(i);
		{
			let e = /* @__PURE__ */ A(() => H(a) ? 0 : 1.8);
			Q(c, {
				get d() {
					return Z.heart;
				},
				get size() {
					return n();
				},
				get stroke() {
					return H(e);
				}
			});
		}
		O(i), z(() => {
			s = Y(i, 1, "fav svelte-18vgx0d", null, s, {
				on: H(a),
				solid: r()
			}), X(i, "aria-pressed", H(a)), X(i, "aria-label", H(o)), X(i, "title", H(o));
		}), U("click", i, (e) => {
			e.stopPropagation(), t.store.toggleFavorite(t.id);
		}), G(e, i);
	};
	q(c, (e) => {
		H(i) && e(l);
	}), G(e, s), Ge();
}
xr(["click"]);
//#endregion
//#region src/components/WeekCard.svelte
var ko = /* @__PURE__ */ W("<span class=\"streak svelte-155zco6\"><!> </span>"), Ao = /* @__PURE__ */ W("<span class=\"tip svelte-155zco6\"> </span>"), jo = /* @__PURE__ */ W("<div class=\"col svelte-155zco6\" role=\"presentation\"><span class=\"track svelte-155zco6\"><span></span> <!></span> <span> </span></div>"), Mo = /* @__PURE__ */ W("<div class=\"svelte-155zco6\"><dt class=\"svelte-155zco6\"> </dt><dd class=\"svelte-155zco6\"> </dd></div>"), No = /* @__PURE__ */ W("<tr><th scope=\"row\"> </th><td> </td></tr>"), Po = /* @__PURE__ */ W("<section class=\"week svelte-155zco6\" aria-label=\"Your listening this week\"><div class=\"hero svelte-155zco6\"><span class=\"eyebrow svelte-155zco6\">Your week</span> <strong class=\"svelte-155zco6\"> </strong> <span class=\"sub svelte-155zco6\">listened in the last 7 days</span> <!></div> <div class=\"chart svelte-155zco6\" role=\"img\" aria-label=\"Minutes listened per day, last seven days\"></div> <dl class=\"split svelte-155zco6\"></dl> <table class=\"sr svelte-155zco6\"><caption>Minutes listened per day</caption><tbody></tbody></table></section>"), Fo = {
	hash: "svelte-155zco6",
	code: ".week.svelte-155zco6 {display:grid;grid-template-columns:minmax(150px, 1fr) minmax(200px, 1.6fr) minmax(130px, 1fr);grid-template-areas:'hero chart split';gap:14px 22px;align-items:center;padding:18px 20px;border-radius:16px;background:linear-gradient(135deg, var(--tm-accent-12), var(--tm-fg-4));border:1px solid var(--tm-fg-7);}.hero.svelte-155zco6 {grid-area:hero;display:flex;flex-direction:column;gap:2px;min-width:0;}.eyebrow.svelte-155zco6 {font-size:10.5px;letter-spacing:1px;text-transform:uppercase;color:var(--tm-accent);font-weight:650;}strong.svelte-155zco6 {font-size:30px;font-weight:700;letter-spacing:-.6px;line-height:1.1;}.sub.svelte-155zco6 {font-size:11.5px;color:var(--tm-muted);}.streak.svelte-155zco6 {display:inline-flex;align-items:center;gap:5px;margin-top:8px;width:fit-content;font-size:11px;font-weight:650;padding:3px 9px;border-radius:20px;background:var(--tm-fg-8);}.chart.svelte-155zco6 {grid-area:chart;display:grid;grid-template-columns:repeat(7, 1fr);gap:8px;height:120px;padding-top:24px;box-sizing:border-box;align-items:end;}.col.svelte-155zco6 {position:relative;display:flex;flex-direction:column;align-items:center;gap:6px;height:100%;}.track.svelte-155zco6 {position:relative;flex:1;width:100%;max-width:22px;display:flex;align-items:flex-end;justify-content:center;border-bottom:1px solid var(--tm-fg-12);}.bar.svelte-155zco6 {display:block;width:100%;border-radius:4px 4px 0 0;background:color-mix(in srgb, var(--tm-accent) 55%, transparent);}.bar.today.svelte-155zco6 {background:var(--tm-accent);}.day.svelte-155zco6 {font-size:10px;color:var(--tm-muted);}.day.today.svelte-155zco6 {color:var(--tm-fg);font-weight:650;}.tip.svelte-155zco6 {position:absolute;left:50%;transform:translateX(-50%);white-space:nowrap;font-size:11px;padding:4px 8px;border-radius:6px;background:var(--tm-fg);color:var(--tm-bg);pointer-events:none;z-index:2;}.split.svelte-155zco6 {grid-area:split;margin:0;display:grid;gap:8px;}.split.svelte-155zco6 div:where(.svelte-155zco6) {display:flex;justify-content:space-between;gap:10px;font-size:12px;}dt.svelte-155zco6 {color:var(--tm-muted);}dd.svelte-155zco6 {margin:0;font-weight:600;font-variant-numeric:tabular-nums;}.sr.svelte-155zco6 {position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;}\n  /* Medium widths: hero and split on the left, chart on the right. */\n  @container (max-width: 760px) {.week.svelte-155zco6 {grid-template-columns:minmax(150px, 1fr) minmax(180px, 1.3fr);grid-template-areas:'hero chart' 'split chart';align-items:start;}.split.svelte-155zco6 {gap:5px;} }\n  @container (max-width: 420px) {.week.svelte-155zco6 {grid-template-columns:1fr;grid-template-areas:'hero' 'chart' 'split';} }"
};
function Io(e, t) {
	We(t, !0), ei(e, Fo);
	let n = /* @__PURE__ */ A(() => t.store.week), r = /* @__PURE__ */ A(() => Math.max(60, ...H(n).days.map((e) => e.seconds))), i = (e) => e < 60 ? e ? "<1 min" : "0 min" : na(e), a = [
		["radio", "Radio"],
		["podcast", "Podcasts"],
		["book", "Audiobooks"]
	], o = /* @__PURE__ */ M(-1);
	var s = Po(), c = F(s), l = R(F(c), 2), u = L(l, !0), d = R(l, 4), f = (e) => {
		var t = ko(), r = F(t);
		Q(r, {
			get d() {
				return Z.flame;
			},
			size: 13,
			stroke: 1.8
		});
		var i = R(r);
		O(t), z(() => K(i, `${H(n).streak ?? ""}-day streak`)), G(e, t);
	};
	q(d, (e) => {
		H(n).streak > 1 && e(f);
	}), O(c);
	var p = R(c, 2);
	J(p, 23, () => H(n).days, (e) => e.key, (e, t, n) => {
		let a = /* @__PURE__ */ A(() => H(t).seconds ? Math.max(4, H(t).seconds / H(r) * 100) : 0);
		var s = jo(), c = F(s), l = F(c);
		let u, d;
		var f = R(l, 2), p = (e) => {
			var n = Ao();
			let r;
			var o = L(n);
			z((e) => {
				r = ci(n, "", r, { bottom: `calc(${H(a) ?? ""}% + 6px)` }), K(o, `${H(t).label ?? ""} · ${e ?? ""}`);
			}, [() => i(H(t).seconds)]), G(e, n);
		};
		q(f, (e) => {
			H(o) === H(n) && e(p);
		}), O(c);
		var m = R(c, 2);
		let h;
		var g = L(m, !0);
		O(s), z((e) => {
			u = Y(l, 1, "bar svelte-155zco6", null, u, { today: H(n) === 6 }), d = ci(l, "", d, { height: `${H(a) ?? ""}%` }), h = Y(m, 1, "day svelte-155zco6", null, h, { today: H(n) === 6 }), K(g, e);
		}, [() => H(t).label.slice(0, 2)]), br("pointerenter", s, () => N(o, H(n), !0)), br("pointerleave", s, () => N(o, -1)), G(e, s);
	}), O(p);
	var h = R(p, 2);
	J(h, 21, () => a, ([e, t]) => e, (e, t) => {
		var r = /* @__PURE__ */ A(() => m(H(t), 2));
		let a = () => H(r)[0], o = () => H(r)[1];
		var s = Mo(), c = F(s), l = L(c, !0), u = L(R(c), !0);
		O(s), z((e) => {
			K(l, o()), K(u, e);
		}, [() => i(H(n).byKind[a()])]), G(e, s);
	}), O(h);
	var g = R(h, 2), _ = R(F(g));
	J(_, 21, () => H(n).days, (e) => e.key, (e, t) => {
		var n = No(), r = F(n), i = L(r, !0), a = L(R(r), !0);
		O(n), z((e) => {
			K(i, H(t).label), K(a, e);
		}, [() => Math.round(H(t).seconds / 60)]), G(e, n);
	}), O(_), O(g), O(s), z((e) => K(u, e), [() => i(H(n).total)]), G(e, s), Ge();
}
//#endregion
//#region src/components/MyMediaView.svelte
var Lo = /* @__PURE__ */ W("<button> <span class=\"n svelte-ube16v\"> </span></button>"), Ro = /* @__PURE__ */ W("<div class=\"welcome svelte-ube16v\"><div class=\"wicon svelte-ube16v\"><!></div> <h2 class=\"svelte-ube16v\">Your library starts here</h2> <p class=\"svelte-ube16v\">Tap the heart on a station to keep it here, subscribe to shows, and save audiobooks. Everything you play is remembered, with your place in every episode and book.</p> <div class=\"cta svelte-ube16v\"><button class=\"svelte-ube16v\">Find stations</button> <button class=\"svelte-ube16v\">Browse podcasts</button> <button class=\"svelte-ube16v\">Browse audiobooks</button></div></div>"), zo = /* @__PURE__ */ W("<button class=\"rcard svelte-ube16v\"><!> <span class=\"rtext svelte-ube16v\"><span class=\"kind svelte-ube16v\"> </span> <span class=\"rtitle svelte-ube16v\"> </span> <span class=\"prog svelte-ube16v\"><span class=\"svelte-ube16v\"></span></span> <span class=\"meta svelte-ube16v\"> </span></span> <span class=\"rplay svelte-ube16v\"><!></span></button>"), Bo = /* @__PURE__ */ W("<section class=\"svelte-ube16v\"><div class=\"sh svelte-ube16v\"><h2 class=\"svelte-ube16v\">Continue listening</h2><span class=\"svelte-ube16v\"> </span></div> <div class=\"resume svelte-ube16v\"></div></section>"), Vo = /* @__PURE__ */ W("<form><input class=\"rename svelte-ube16v\" maxlength=\"80\" aria-label=\"Playlist name\"/></form>"), Ho = /* @__PURE__ */ W("<button class=\"plname svelte-ube16v\" title=\"Rename\"> </button>"), Uo = /* @__PURE__ */ W("<div><!> <button class=\"pltitle svelte-ube16v\"> <small class=\"svelte-ube16v\"> </small></button> <button class=\"plrm svelte-ube16v\"><!></button></div>"), Wo = /* @__PURE__ */ W("<p class=\"none svelte-ube16v\">This playlist is empty. Use ••• on any episode or book to add to it.</p>"), Go = /* @__PURE__ */ W("<div class=\"plitems svelte-ube16v\"></div>"), Ko = /* @__PURE__ */ W("<div><div class=\"plhead svelte-ube16v\"><button class=\"mosaic svelte-ube16v\"><!> <span class=\"mplay svelte-ube16v\"><!></span></button> <div class=\"pltext svelte-ube16v\"><!> <span class=\"plmeta svelte-ube16v\"> </span></div> <button class=\"plbtn primary svelte-ube16v\"><!>Play</button> <button class=\"plbtn svelte-ube16v\" title=\"Shuffle\"><!></button> <button class=\"plbtn svelte-ube16v\"><!></button> <button><!></button></div> <!></div>"), qo = /* @__PURE__ */ W("<section class=\"svelte-ube16v\"><div class=\"sh svelte-ube16v\"><h2 class=\"svelte-ube16v\">Playlists</h2><span class=\"svelte-ube16v\"> </span></div> <div class=\"pls svelte-ube16v\"></div></section>"), Jo = /* @__PURE__ */ W("<button class=\"all svelte-ube16v\">See all</button>"), Yo = /* @__PURE__ */ W("<div><button class=\"tbody svelte-ube16v\"><span class=\"banner svelte-ube16v\"><!> <span class=\"live svelte-ube16v\"><i class=\"svelte-ube16v\"></i>LIVE</span> <span class=\"tplay svelte-ube16v\"><!></span></span> <span class=\"ttext svelte-ube16v\"><span class=\"ttitle svelte-ube16v\"> </span><span class=\"tsub svelte-ube16v\"> </span></span></button> <span class=\"tfav svelte-ube16v\"><!></span></div>"), Xo = /* @__PURE__ */ W("<div class=\"tiles svelte-ube16v\"></div>"), Zo = /* @__PURE__ */ W("<button class=\"link svelte-ube16v\">Find stations</button>"), Qo = /* @__PURE__ */ W("<p class=\"none svelte-ube16v\"> <!></p>"), $o = /* @__PURE__ */ W("<section class=\"svelte-ube16v\"><div class=\"sh svelte-ube16v\"><h2 class=\"svelte-ube16v\">Favorite stations</h2><span class=\"svelte-ube16v\"> </span><!></div> <!></section>"), es = /* @__PURE__ */ W("<span class=\"badge svelte-ube16v\"> </span>"), ts = /* @__PURE__ */ W("<button class=\"card svelte-ube16v\"><span class=\"art svelte-ube16v\"><!><!></span> <span class=\"ctitle svelte-ube16v\"> </span> <span class=\"csub svelte-ube16v\"> </span></button>"), ns = /* @__PURE__ */ W("<div class=\"cards svelte-ube16v\"></div>"), rs = /* @__PURE__ */ W("<button class=\"link svelte-ube16v\">Browse podcasts</button>"), is = /* @__PURE__ */ W("<section class=\"svelte-ube16v\"><div class=\"sh svelte-ube16v\"><h2 class=\"svelte-ube16v\">Your shows</h2><span class=\"svelte-ube16v\"> </span><!></div> <!></section>"), as = /* @__PURE__ */ W("<span class=\"bprog svelte-ube16v\"><span class=\"svelte-ube16v\"></span></span>"), os = /* @__PURE__ */ W("<div class=\"bwrap svelte-ube16v\"><button class=\"card svelte-ube16v\"><span class=\"art tall svelte-ube16v\"><!> <!></span> <span class=\"ctitle svelte-ube16v\"> </span> <span> </span></button> <span class=\"bfav svelte-ube16v\"><!></span></div>"), ss = /* @__PURE__ */ W("<div class=\"cards books svelte-ube16v\"></div>"), cs = /* @__PURE__ */ W("<button class=\"link svelte-ube16v\">Browse audiobooks</button>"), ls = /* @__PURE__ */ W("<section class=\"svelte-ube16v\"><div class=\"sh svelte-ube16v\"><h2 class=\"svelte-ube16v\">Audiobooks</h2><span class=\"svelte-ube16v\"> </span><!></div> <!></section>"), us = /* @__PURE__ */ W("<div><!> <button class=\"htext svelte-ube16v\"><span class=\"htitle svelte-ube16v\"> </span> <span class=\"hmeta svelte-ube16v\"> </span></button> <!> <!> <button class=\"hplay svelte-ube16v\"><!></button></div>"), ds = /* @__PURE__ */ W("<section class=\"svelte-ube16v\"><div class=\"sh svelte-ube16v\"><h2 class=\"svelte-ube16v\">Recently played</h2><span class=\"svelte-ube16v\"> </span><button class=\"all svelte-ube16v\">Clear history</button></div> <div class=\"hist svelte-ube16v\"></div></section>"), fs = /* @__PURE__ */ W("<!> <!> <!> <!> <!> <!>", 1), ps = /* @__PURE__ */ W("<div class=\"head svelte-ube16v\"><div><h1 class=\"h1 svelte-ube16v\">My Media</h1> <p class=\"lede svelte-ube16v\">Your stations, shows and books, and everything you have been listening to.</p></div> <label class=\"filter svelte-ube16v\"><!> <input type=\"search\" placeholder=\"Filter your library\" aria-label=\"Filter your library\" class=\"svelte-ube16v\"/></label></div> <!> <div class=\"bar svelte-ube16v\"><div class=\"kinds svelte-ube16v\" role=\"group\" aria-label=\"Show\"></div> <label class=\"sort svelte-ube16v\">Sort <select aria-label=\"Sort\" class=\"svelte-ube16v\"><option>Recently played</option><option>Recently added</option><option>Title A–Z</option></select></label></div> <!>", 1), ms = {
	hash: "svelte-ube16v",
	code: ".head.svelte-ube16v {display:flex;align-items:flex-end;justify-content:space-between;gap:16px;margin-bottom:18px;}.h1.svelte-ube16v {font-size:26px;font-weight:650;letter-spacing:-.5px;margin:0;}.lede.svelte-ube16v {font-size:13px;color:var(--tm-muted);margin:4px 0 0;}.filter.svelte-ube16v {display:flex;align-items:center;gap:8px;height:30px;padding:0 12px;border-radius:9px;background:var(--tm-fg-6);color:var(--tm-muted);width:220px;flex:none;}.filter.svelte-ube16v:focus-within {box-shadow:0 0 0 1px var(--tm-accent);}.filter.svelte-ube16v input:where(.svelte-ube16v) {flex:1;min-width:0;border:0;background:none;outline:none;color:var(--tm-fg);font:inherit;font-size:12px;}.bar.svelte-ube16v {display:flex;align-items:center;justify-content:space-between;gap:12px;margin:20px 0 4px;flex-wrap:wrap;}.kinds.svelte-ube16v {display:flex;gap:8px;flex-wrap:wrap;}.chip.svelte-ube16v {height:30px;padding:0 12px 0 14px;border-radius:15px;border:1px solid var(--tm-fg-16);background:transparent;color:var(--tm-fg);font-size:12px;font-weight:500;cursor:pointer;display:flex;align-items:center;gap:7px;}.chip.svelte-ube16v .n:where(.svelte-ube16v) {font-size:10.5px;min-width:18px;padding:1px 6px;border-radius:10px;background:var(--tm-fg-8);font-variant-numeric:tabular-nums;}.chip.on.svelte-ube16v {border-color:var(--tm-accent);background:var(--tm-accent);color:var(--tm-on-accent);}.chip.on.svelte-ube16v .n:where(.svelte-ube16v) {background:color-mix(in srgb, var(--tm-on-accent) 18%, transparent);}.sort.svelte-ube16v {display:flex;align-items:center;gap:8px;font-size:12px;color:var(--tm-muted);}select.svelte-ube16v {height:30px;border-radius:8px;border:1px solid var(--tm-fg-14);background:var(--tm-panel);color:var(--tm-fg);font:inherit;font-size:12px;padding:0 8px;}section.svelte-ube16v {margin-top:24px;}.sh.svelte-ube16v {display:flex;align-items:baseline;gap:8px;margin-bottom:12px;}.sh.svelte-ube16v h2:where(.svelte-ube16v) {font-size:15px;font-weight:650;margin:0;}.sh.svelte-ube16v > span:where(.svelte-ube16v) {font-size:11px;color:var(--tm-muted);font-variant-numeric:tabular-nums;}.all.svelte-ube16v, .link.svelte-ube16v {margin-left:auto;border:0;background:none;color:var(--tm-accent);font-size:12px;cursor:pointer;padding:0;font:inherit;font-size:12px;}.link.svelte-ube16v {margin-left:4px;}.none.svelte-ube16v {font-size:12.5px;color:var(--tm-muted);margin:0;padding:14px 16px;border-radius:12px;background:var(--tm-fg-4);}.resume.svelte-ube16v {display:grid;grid-template-columns:repeat(auto-fill, minmax(240px, 1fr));gap:10px;}.rcard.svelte-ube16v {display:flex;align-items:center;gap:12px;padding:10px;border:0;border-radius:14px;background:var(--tm-fg-4);color:inherit;cursor:pointer;text-align:left;font:inherit;}.rcard.svelte-ube16v:hover {background:var(--tm-fg-8);}.rtext.svelte-ube16v {flex:1;min-width:0;display:flex;flex-direction:column;gap:3px;}.kind.svelte-ube16v {font-size:9.5px;letter-spacing:.8px;text-transform:uppercase;color:var(--tm-accent);font-weight:650;}.rtitle.svelte-ube16v {font-size:12.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.prog.svelte-ube16v, .bprog.svelte-ube16v {display:block;height:3px;border-radius:2px;background:var(--tm-fg-10);}.prog.svelte-ube16v span:where(.svelte-ube16v), .bprog.svelte-ube16v span:where(.svelte-ube16v) {display:block;height:3px;border-radius:2px;background:var(--tm-accent);}.meta.svelte-ube16v {font-size:11px;color:var(--tm-muted);}.rplay.svelte-ube16v {width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:var(--tm-accent);color:var(--tm-on-accent);flex:none;}.tiles.svelte-ube16v {display:grid;grid-template-columns:repeat(auto-fill, minmax(150px, 1fr));gap:12px;}.tile.svelte-ube16v {position:relative;border-radius:14px;overflow:hidden;background:var(--tm-fg-4);}.tile.svelte-ube16v:hover {background:var(--tm-fg-8);}.tile.cur.svelte-ube16v {box-shadow:inset 0 0 0 1px var(--tm-accent);}.tbody.svelte-ube16v {display:flex;flex-direction:column;width:100%;border:0;padding:0;background:none;color:inherit;cursor:pointer;text-align:left;font:inherit;}.banner.svelte-ube16v {height:86px;display:flex;width:100%;position:relative;}.live.svelte-ube16v {position:absolute;left:8px;top:8px;display:inline-flex;align-items:center;gap:5px;font-size:9px;font-weight:700;letter-spacing:.8px;padding:3px 7px;border-radius:20px;background:rgba(0, 0, 0, .45);color:#fff;}.live.svelte-ube16v i:where(.svelte-ube16v) {width:5px;height:5px;border-radius:3px;background:var(--tm-live);}.tplay.svelte-ube16v {position:absolute;right:8px;bottom:8px;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:var(--tm-accent);color:var(--tm-on-accent);box-shadow:0 6px 16px rgba(0, 0, 0, .35);opacity:0;transform:translateY(4px);transition:opacity .15s, transform .15s;}.tile.svelte-ube16v:hover .tplay:where(.svelte-ube16v), .tile.cur.svelte-ube16v .tplay:where(.svelte-ube16v), .tbody.svelte-ube16v:focus-visible .tplay:where(.svelte-ube16v) {opacity:1;transform:none;}.tfav.svelte-ube16v {position:absolute;right:6px;top:6px;}.ttext.svelte-ube16v {padding:9px 11px 11px;display:flex;flex-direction:column;min-width:0;}.ttitle.svelte-ube16v {font-size:12.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.tsub.svelte-ube16v {font-size:11px;color:var(--tm-muted);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.cards.svelte-ube16v {display:grid;grid-template-columns:repeat(auto-fill, minmax(124px, 1fr));gap:16px;}.card.svelte-ube16v {display:flex;flex-direction:column;gap:3px;border:0;padding:0;background:none;color:inherit;cursor:pointer;text-align:left;font:inherit;min-width:0;width:100%;}.art.svelte-ube16v {position:relative;display:flex;aspect-ratio:1;border-radius:12px;overflow:hidden;box-shadow:0 10px 24px rgba(0, 0, 0, .28);margin-bottom:6px;transition:transform .15s;}.art.tall.svelte-ube16v {aspect-ratio:.72;border-radius:5px 10px 10px 5px;}.card.svelte-ube16v:hover .art:where(.svelte-ube16v) {transform:translateY(-2px);}.badge.svelte-ube16v {position:absolute;left:8px;top:8px;font-size:10px;font-weight:700;padding:3px 8px;border-radius:20px;background:var(--tm-accent);color:var(--tm-on-accent);}.bprog.svelte-ube16v {position:absolute;left:8px;right:8px;bottom:8px;background:rgba(0, 0, 0, .45);}.ctitle.svelte-ube16v {font-size:12.5px;font-weight:600;line-height:1.3;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical;}.csub.svelte-ube16v {font-size:11px;color:var(--tm-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.csub.done.svelte-ube16v {color:var(--tm-accent);}.bwrap.svelte-ube16v {position:relative;}.bfav.svelte-ube16v {position:absolute;right:6px;top:6px;}.hist.svelte-ube16v {display:flex;flex-direction:column;}.hrow.svelte-ube16v {display:flex;align-items:center;gap:12px;padding:8px;border-radius:10px;}.hrow.svelte-ube16v:hover {background:var(--tm-fg-5);}.hrow.cur.svelte-ube16v {background:var(--tm-accent-8);}.htext.svelte-ube16v {flex:1;min-width:0;display:flex;flex-direction:column;border:0;padding:0;background:none;color:inherit;cursor:pointer;text-align:left;font:inherit;}.htitle.svelte-ube16v {font-size:12.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.hmeta.svelte-ube16v {font-size:11px;color:var(--tm-muted);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.hplay.svelte-ube16v {width:30px;height:30px;flex:none;border:0;border-radius:50%;background:var(--tm-fg-8);color:var(--tm-fg);cursor:pointer;display:grid;place-items:center;}.hplay.svelte-ube16v:hover {background:var(--tm-accent);color:var(--tm-on-accent);}.pls.svelte-ube16v {display:grid;gap:8px;}.pl.svelte-ube16v {border-radius:14px;background:var(--tm-fg-4);}.pl.open.svelte-ube16v {background:var(--tm-fg-6);}.plhead.svelte-ube16v {display:flex;align-items:center;gap:10px;padding:10px;}.mosaic.svelte-ube16v {position:relative;width:52px;height:52px;flex:none;border:0;padding:0;border-radius:10px;overflow:hidden;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;background:var(--tm-fg-8);cursor:pointer;}.mosaic.svelte-ube16v > .cover {width:100% !important;height:100% !important;}.mplay.svelte-ube16v {position:absolute;inset:0;display:grid;place-items:center;background:rgba(0, 0, 0, .45);color:#fff;opacity:0;transition:opacity .15s;}.mosaic.svelte-ube16v:hover .mplay:where(.svelte-ube16v), .mosaic.svelte-ube16v:focus-visible .mplay:where(.svelte-ube16v) {opacity:1;}.pltext.svelte-ube16v {flex:1;min-width:0;display:flex;flex-direction:column;gap:2px;}.plname.svelte-ube16v {border:0;padding:0;background:none;color:var(--tm-fg);font:inherit;font-size:13px;font-weight:650;text-align:left;cursor:text;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.rename.svelte-ube16v {width:100%;height:26px;padding:0 8px;border-radius:7px;border:1px solid var(--tm-accent);background:var(--tm-fg-4);color:var(--tm-fg);font:inherit;font-size:13px;outline:none;}.plmeta.svelte-ube16v {font-size:11px;color:var(--tm-muted);}.plbtn.svelte-ube16v {height:30px;min-width:30px;padding:0 8px;border:0;border-radius:8px;background:var(--tm-fg-6);color:var(--tm-fg);cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;font-size:12px;font-weight:600;flex:none;}.plbtn.svelte-ube16v:hover {background:var(--tm-fg-12);}.plbtn.primary.svelte-ube16v {background:var(--tm-accent);color:var(--tm-on-accent);padding:0 12px;}.plbtn.danger.svelte-ube16v {background:color-mix(in srgb, var(--tm-live) 25%, transparent);color:var(--tm-live);}.plitems.svelte-ube16v {padding:0 10px 10px 72px;display:flex;flex-direction:column;}.plrow.svelte-ube16v {display:flex;align-items:center;gap:10px;padding:5px 6px;border-radius:8px;}.plrow.svelte-ube16v:hover {background:var(--tm-fg-5);}.plrow.cur.svelte-ube16v .pltitle:where(.svelte-ube16v) {color:var(--tm-accent);}.pltitle.svelte-ube16v {flex:1;min-width:0;display:flex;flex-direction:column;border:0;padding:0;background:none;color:var(--tm-fg);font:inherit;font-size:12px;font-weight:600;text-align:left;cursor:pointer;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}.pltitle.svelte-ube16v small:where(.svelte-ube16v) {font-size:10.5px;font-weight:400;color:var(--tm-muted);}.plrm.svelte-ube16v {width:24px;height:24px;border:0;border-radius:6px;background:none;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;}.plrm.svelte-ube16v:hover {background:var(--tm-fg-8);color:var(--tm-fg);}.welcome.svelte-ube16v {margin-top:26px;padding:34px 28px;border-radius:18px;text-align:center;background:var(--tm-fg-4);border:1px dashed var(--tm-fg-14);}.wicon.svelte-ube16v {width:54px;height:54px;margin:0 auto 12px;border-radius:16px;display:grid;place-items:center;background:var(--tm-accent-12);color:var(--tm-accent);}.welcome.svelte-ube16v h2:where(.svelte-ube16v) {font-size:17px;margin:0;}.welcome.svelte-ube16v p:where(.svelte-ube16v) {font-size:12.5px;color:var(--tm-muted);max-width:440px;margin:8px auto 0;line-height:1.55;}.cta.svelte-ube16v {display:flex;justify-content:center;flex-wrap:wrap;gap:8px;margin-top:18px;}.cta.svelte-ube16v button:where(.svelte-ube16v) {height:32px;padding:0 16px;border-radius:16px;border:1px solid var(--tm-fg-14);background:var(--tm-panel);color:var(--tm-fg);font-size:12px;font-weight:600;cursor:pointer;}.cta.svelte-ube16v button:where(.svelte-ube16v):hover {border-color:var(--tm-accent);}\n  @media (prefers-reduced-motion: reduce) {.art.svelte-ube16v, .tplay.svelte-ube16v {transition:none;} }"
};
function hs(e, t) {
	We(t, !0), ei(e, ms);
	let n = Mi(t, "store", 7), r = [
		["all", "All"],
		["radio", "Radio"],
		["podcast", "Podcasts"],
		["book", "Audiobooks"]
	], i = /* @__PURE__ */ A(() => n().libraryCounts), a = (e) => e === "all" ? H(i).radio + H(i).podcast + H(i).book : H(i)[e], o = /* @__PURE__ */ A(() => n().libQuery.trim().toLowerCase()), s = (...e) => !H(o) || e.some((e) => e.toLowerCase().includes(H(o))), c = (e) => n().libKind === "all" || n().libKind === e, l = (e) => n().libKind === "all" ? e.slice(0, 8) : e, u = /* @__PURE__ */ A(() => {
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
	let f = /* @__PURE__ */ A(() => d(Object.values(n().favorites).map((e) => n().items[e.id] ?? e).filter((e) => s(e.title, e.sub)), (e) => e.id, (e) => e.title, (e) => n().lastPlayed(e.id))), p = /* @__PURE__ */ A(() => d(Object.values(n().subscribed).filter((e) => s(e.title, e.author)), (e) => `show:${e.slug}`, (e) => e.title, (e) => H(u)[e.slug] ?? 0)), h = /* @__PURE__ */ A(() => d(n().libraryBooks.filter((e) => s(e.title, e.sub)), (e) => e.id, (e) => e.title, (e) => n().lastPlayed(e.id))), g = /* @__PURE__ */ A(() => n().inProgress.filter((e) => {
		let t = n().items[e];
		return c(t.type) && s(t.title, t.sub);
	})), _ = /* @__PURE__ */ A(() => n().history.filter((e) => {
		let t = n().items[e.id];
		return t && c(t.type) && s(t.title, t.sub);
	})), v = /* @__PURE__ */ A(() => a("all") === 0 && !n().history.length && !n().inProgress.length && !n().playlists.length), y = /* @__PURE__ */ A(() => n().playlists.filter((e) => s(e.name, ...e.ids.map((e) => n().items[e]?.title ?? "")))), b = /* @__PURE__ */ M(null), x = /* @__PURE__ */ M(null), S = /* @__PURE__ */ M(""), C = /* @__PURE__ */ M(null);
	function w(e) {
		if (n().played[e.id]) return {
			pct: 100,
			label: "Finished"
		};
		let t = n().progressOf(e.id), r = n().durOf(e.id);
		return t > 5 && r ? {
			pct: Math.min(100, Math.round(t / r * 100)),
			label: `${na((r - t) / n().speedFor(e.id))} left`
		} : {
			pct: 0,
			label: "Not started"
		};
	}
	let ee = (e) => {
		n().libKind = e;
	};
	var T = ps(), te = I(T), ne = R(F(te), 2), re = F(ne);
	Q(re, {
		get d() {
			return Z.search;
		},
		size: 13,
		stroke: 2
	});
	var ie = R(re, 2);
	bi(ie), O(ne), O(te);
	var ae = R(te, 2);
	Io(ae, { get store() {
		return n();
	} });
	var oe = R(ae, 2), se = F(oe);
	J(se, 21, () => r, ([e, t]) => e, (e, t) => {
		var r = /* @__PURE__ */ A(() => m(H(t), 2));
		let i = () => H(r)[0], o = () => H(r)[1];
		var s = Lo();
		let c;
		var l = F(s, !0), u = L(R(l), !0);
		O(s), z((e) => {
			c = Y(s, 1, "chip svelte-ube16v", null, c, { on: n().libKind === i() }), X(s, "aria-pressed", n().libKind === i()), K(l, o()), K(u, e);
		}, [() => a(i())]), U("click", s, () => n().libKind = i()), G(e, s);
	}), O(se);
	var ce = R(se, 2), le = R(F(ce)), ue = F(le);
	ue.value = ue.__value = "recent";
	var de = R(ue);
	de.value = de.__value = "added";
	var fe = R(de);
	fe.value = fe.__value = "title", O(le), fi(le), O(ce), O(oe);
	var pe = R(oe, 2), me = (e) => {
		var t = Ro(), r = F(t);
		Q(F(r), {
			get d() {
				return Z.library;
			},
			size: 26,
			stroke: 1.6
		}), O(r);
		var i = R(r, 6), a = F(i), o = R(a, 2), s = R(o, 2);
		O(i), O(t), U("click", a, () => n().tab = "radio"), U("click", o, () => {
			n().tab = "pod", n().showSlug = null;
		}), U("click", s, () => {
			n().tab = "book", n().bookId = null;
		}), G(e, t);
	}, he = (e) => {
		var t = fs(), r = I(t), i = (e) => {
			var t = Bo(), r = F(t), i = L(R(F(r)), !0);
			O(r);
			var a = R(r, 2);
			J(a, 20, () => l(H(g)), (e) => e, (e, t) => {
				let r = /* @__PURE__ */ A(() => n().items[t]);
				var i = zo(), a = F(i);
				$(a, {
					get hue() {
						return H(r).hue;
					},
					get art() {
						return H(r).art;
					},
					size: 52,
					radius: 9,
					get mark() {
						return H(r).mark;
					}
				});
				var o = R(a, 2), s = F(o), c = L(s, !0), l = R(s, 2), u = L(l, !0), d = R(l, 2), f = F(d);
				let p;
				O(d);
				var m = L(R(d, 2), !0);
				O(o);
				var h = R(o, 2), g = F(h);
				{
					let e = /* @__PURE__ */ A(() => n().isPlaying(t) ? Z.pause : Z.play);
					Q(g, {
						get d() {
							return H(e);
						},
						size: 13
					});
				}
				O(h), O(i), z((e, t, n) => {
					X(i, "aria-label", `${e ?? ""} ${H(r).title ?? ""}`), K(c, Pi[H(r).type]), K(u, H(r).title), p = ci(f, "", p, { width: t }), K(m, n);
				}, [
					() => n().isPlaying(t) ? "Pause" : "Resume",
					() => `${n().pctOf(t) ?? ""}%`,
					() => n().leftOf(t)
				]), U("click", i, () => n().play(t)), G(e, i);
			}), O(a), O(t), z(() => K(i, H(g).length)), G(e, t);
		};
		q(r, (e) => {
			H(g).length && e(i);
		});
		var a = R(r, 2), s = (e) => {
			var t = qo(), r = F(t), i = L(R(F(r)), !0);
			O(r);
			var a = R(r, 2);
			J(a, 21, () => H(y), (e) => e.id, (e, t) => {
				let r = /* @__PURE__ */ A(() => H(t).ids.map((e) => n().items[e]).filter(Boolean)), i = /* @__PURE__ */ A(() => n().playlistDuration(H(t)));
				var a = Ko();
				let o;
				var s = F(a), c = F(s), l = F(c);
				J(l, 17, () => H(r).slice(0, 4), (e) => e.id, (e, t) => {
					$(e, {
						get hue() {
							return H(t).hue;
						},
						get art() {
							return H(t).art;
						},
						fill: !0,
						radius: 0,
						get mark() {
							return H(t).mark;
						},
						font: 8
					});
				});
				var u = R(l, 2);
				Q(F(u), {
					get d() {
						return Z.play;
					},
					size: 14
				}), O(u), O(c);
				var d = R(c, 2), f = F(d), p = (e) => {
					var r = Vo(), i = F(r);
					bi(i), ti(i, (e) => Za?.(e)), bn(() => Ei(i, () => H(S), (e) => N(S, e))), O(r), br("submit", r, (e) => {
						e.preventDefault(), n().renamePlaylist(H(t).id, H(S)), N(x, null);
					}), br("blur", i, () => {
						n().renamePlaylist(H(t).id, H(S)), N(x, null);
					}), U("keydown", i, (e) => {
						e.key === "Escape" && (e.stopPropagation(), N(x, null));
					}), G(e, r);
				}, m = (e) => {
					var n = Ho(), r = L(n, !0);
					z(() => K(r, H(t).name)), U("click", n, () => {
						N(x, H(t).id, !0), N(S, H(t).name, !0);
					}), G(e, n);
				};
				q(f, (e) => {
					H(x) === H(t).id ? e(p) : e(m, -1);
				});
				var h = L(R(f, 2));
				O(d);
				var g = R(d, 2);
				Q(F(g), {
					get d() {
						return Z.play;
					},
					size: 12
				}), k(), O(g);
				var _ = R(g, 2);
				Q(F(_), {
					get d() {
						return Z.shuffle;
					},
					size: 13,
					stroke: 1.8
				}), O(_);
				var v = R(_, 2), y = F(v);
				{
					let e = /* @__PURE__ */ A(() => H(b) === H(t).id ? Z.up : Z.down);
					Q(y, {
						get d() {
							return H(e);
						},
						size: 13,
						stroke: 2
					});
				}
				O(v);
				var w = R(v, 2);
				let ee;
				Q(F(w), {
					get d() {
						return Z.trash;
					},
					size: 13,
					stroke: 1.8
				}), O(w), O(s);
				var T = R(s, 2), te = (e) => {
					var i = Go();
					J(i, 21, () => H(r), (e) => e.id, (e, r) => {
						var i = Uo();
						let a;
						var o = F(i);
						$(o, {
							get hue() {
								return H(r).hue;
							},
							get art() {
								return H(r).art;
							},
							size: 30,
							radius: 6,
							get mark() {
								return H(r).mark;
							},
							font: 8
						});
						var s = R(o, 2), c = F(s, !0), l = L(R(c));
						O(s);
						var u = R(s, 2);
						Q(F(u), {
							get d() {
								return Z.close;
							},
							size: 11,
							stroke: 2
						}), O(u), O(i), z((e) => {
							a = Y(i, 1, "plrow svelte-ube16v", null, a, { cur: H(r).id === n().now }), K(c, H(r).title), K(l, `${Pi[H(r).type] ?? ""}${e ?? ""}`), X(u, "aria-label", `Remove ${H(r).title ?? ""} from ${H(t).name ?? ""}`);
						}, [() => n().lenOf(H(r).id) ? ` · ${n().lenOf(H(r).id)}` : ""]), U("click", s, () => n().play(H(r).id)), U("click", u, () => n().removeFromPlaylist(H(t).id, H(r).id)), G(e, i);
					}, (e) => {
						G(e, Wo());
					}), O(i), G(e, i);
				};
				q(T, (e) => {
					H(b) === H(t).id && e(te);
				}), O(a), z((e) => {
					o = Y(a, 1, "pl svelte-ube16v", null, o, { open: H(b) === H(t).id }), X(c, "aria-label", `Play ${H(t).name ?? ""}`), K(h, `${H(r).length ?? ""} item${H(r).length === 1 ? "" : "s"}${e ?? ""}`), X(_, "aria-label", `Shuffle ${H(t).name ?? ""}`), X(v, "aria-expanded", H(b) === H(t).id), X(v, "aria-label", `${H(b) === H(t).id ? "Hide" : "Show"} items in ${H(t).name ?? ""}`), ee = Y(w, 1, "plbtn svelte-ube16v", null, ee, { danger: H(C) === H(t).id }), X(w, "aria-label", H(C) === H(t).id ? `Confirm delete ${H(t).name}` : `Delete ${H(t).name}`), X(w, "title", H(C) === H(t).id ? "Click again to delete" : "Delete playlist");
				}, [() => H(i) ? ` · ${na(H(i))}` : ""]), U("click", c, () => n().playPlaylist(H(t).id)), U("click", g, () => n().playPlaylist(H(t).id)), U("click", _, () => n().playPlaylist(H(t).id, !0)), U("click", v, () => N(b, H(b) === H(t).id ? null : H(t).id, !0)), U("click", w, () => {
					H(C) === H(t).id ? (n().deletePlaylist(H(t).id), N(C, null)) : N(C, H(t).id, !0);
				}), br("blur", w, () => {
					H(C) === H(t).id && N(C, null);
				}), G(e, a);
			}), O(a), O(t), z(() => K(i, H(y).length)), G(e, t);
		};
		q(a, (e) => {
			n().libKind === "all" && H(y).length && e(s);
		});
		var u = R(a, 2), d = (e) => {
			var t = $o(), r = F(t), i = R(F(r)), a = L(i, !0), s = R(i), c = (e) => {
				var t = Jo();
				U("click", t, () => ee("radio")), G(e, t);
			};
			q(s, (e) => {
				n().libKind === "all" && H(f).length > 8 && e(c);
			}), O(r);
			var u = R(r, 2), d = (e) => {
				var t = Xo();
				J(t, 21, () => l(H(f)), (e) => e.id, (e, t) => {
					let r = /* @__PURE__ */ A(() => n().isPlaying(H(t).id)), i = /* @__PURE__ */ A(() => n().songOf(H(t).stationId));
					var a = Yo();
					let o;
					var s = F(a), c = F(s), l = F(c);
					$(l, {
						get hue() {
							return H(t).hue;
						},
						get art() {
							return H(t).art;
						},
						fill: !0,
						radius: 0,
						get mark() {
							return H(t).mark;
						},
						font: 18
					});
					var u = R(l, 4), d = F(u);
					{
						let e = /* @__PURE__ */ A(() => H(r) ? Z.stop : Z.play);
						Q(d, {
							get d() {
								return H(e);
							},
							size: 14
						});
					}
					O(u), O(c);
					var f = R(c, 2), p = F(f), m = L(p, !0), h = L(R(p), !0);
					O(f), O(s);
					var g = R(s, 2);
					Oo(F(g), {
						get store() {
							return n();
						},
						get id() {
							return H(t).id;
						},
						size: 14,
						solid: !0
					}), O(g), O(a), z(() => {
						o = Y(a, 1, "tile svelte-ube16v", null, o, { cur: H(t).id === n().now }), X(s, "aria-label", `${H(r) ? "Stop" : "Play"} ${H(t).title ?? ""}`), K(m, H(t).title), K(h, H(i) ? `♪ ${H(i)}` : H(t).sub);
					}), U("click", s, () => H(r) ? n().stop() : n().play(H(t).id)), G(e, a);
				}), O(t), G(e, t);
			}, p = (e) => {
				var t = Qo(), r = F(t), i = R(r), a = (e) => {
					var t = Zo();
					U("click", t, () => n().tab = "radio"), G(e, t);
				};
				q(i, (e) => {
					H(o) || e(a);
				}), O(t), z(() => K(r, `${H(o) ? "No favorite stations match." : "Tap ♥ on any station to keep it here."} `)), G(e, t);
			};
			q(u, (e) => {
				H(f).length ? e(d) : e(p, -1);
			}), O(t), z(() => K(a, H(f).length)), G(e, t);
		}, m = /* @__PURE__ */ A(() => c("radio"));
		q(u, (e) => {
			H(m) && e(d);
		});
		var v = R(u, 2), T = (e) => {
			var t = is(), r = F(t), i = R(F(r)), a = L(i, !0), s = R(i), c = (e) => {
				var t = Jo();
				U("click", t, () => ee("podcast")), G(e, t);
			};
			q(s, (e) => {
				n().libKind === "all" && H(p).length > 8 && e(c);
			}), O(r);
			var u = R(r, 2), d = (e) => {
				var t = ns();
				J(t, 21, () => l(H(p)), (e) => e.slug, (e, t) => {
					let r = /* @__PURE__ */ A(() => n().newCount(H(t).slug));
					var i = ts(), a = F(i), o = F(a);
					$(o, {
						get hue() {
							return H(t).hue;
						},
						get art() {
							return H(t).art;
						},
						fill: !0,
						radius: 0,
						get mark() {
							return H(t).mark;
						},
						font: 18
					});
					var s = R(o), c = (e) => {
						var t = es(), n = L(t);
						z(() => K(n, `${H(r) ?? ""} new`)), G(e, t);
					};
					q(s, (e) => {
						H(r) && e(c);
					}), O(a);
					var l = R(a, 2), u = L(l, !0), d = L(R(l, 2), !0);
					O(i), z(() => {
						K(u, H(t).title), K(d, H(t).author || H(t).category || "Podcast");
					}), U("click", i, () => n().openShow(H(t).slug)), G(e, i);
				}), O(t), G(e, t);
			}, f = (e) => {
				var t = Qo(), r = F(t), i = R(r), a = (e) => {
					var t = rs();
					U("click", t, () => {
						n().tab = "pod", n().showSlug = null;
					}), G(e, t);
				};
				q(i, (e) => {
					H(o) || e(a);
				}), O(t), z(() => K(r, `${H(o) ? "No shows match." : "Subscribe to a show and its new episodes come to you."} `)), G(e, t);
			};
			q(u, (e) => {
				H(p).length ? e(d) : e(f, -1);
			}), O(t), z(() => K(a, H(p).length)), G(e, t);
		}, te = /* @__PURE__ */ A(() => c("podcast"));
		q(v, (e) => {
			H(te) && e(T);
		});
		var ne = R(v, 2), re = (e) => {
			var t = ls(), r = F(t), i = R(F(r)), a = L(i, !0), s = R(i), c = (e) => {
				var t = Jo();
				U("click", t, () => ee("book")), G(e, t);
			};
			q(s, (e) => {
				n().libKind === "all" && H(h).length > 8 && e(c);
			}), O(r);
			var u = R(r, 2), d = (e) => {
				var t = ss();
				J(t, 21, () => l(H(h)), (e) => e.id, (e, t) => {
					let r = /* @__PURE__ */ A(() => w(H(t)));
					var i = os(), a = F(i), o = F(a), s = F(o);
					$(s, {
						get hue() {
							return H(t).hue;
						},
						get art() {
							return H(t).art;
						},
						fill: !0,
						radius: 0,
						get mark() {
							return H(t).mark;
						},
						font: 18
					});
					var c = R(s, 2), l = (e) => {
						var t = as(), n = F(t);
						let i;
						O(t), z(() => i = ci(n, "", i, { width: `${H(r).pct ?? ""}%` })), G(e, t);
					};
					q(c, (e) => {
						H(r).pct && e(l);
					}), O(o);
					var u = R(o, 2), d = L(u, !0), f = R(u, 2);
					let p;
					var m = L(f, !0);
					O(a);
					var h = R(a, 2);
					Oo(F(h), {
						get store() {
							return n();
						},
						get id() {
							return H(t).id;
						},
						size: 13,
						solid: !0
					}), O(h), O(i), z(() => {
						K(d, H(t).title), p = Y(f, 1, "csub svelte-ube16v", null, p, { done: H(r).pct === 100 }), K(m, H(r).pct === 100 ? "✓ Finished" : H(r).label);
					}), U("click", a, () => n().openBook(H(t).id)), G(e, i);
				}), O(t), G(e, t);
			}, f = (e) => {
				var t = Qo(), r = F(t), i = R(r), a = (e) => {
					var t = cs();
					U("click", t, () => {
						n().tab = "book", n().bookId = null;
					}), G(e, t);
				};
				q(i, (e) => {
					H(o) || e(a);
				}), O(t), z(() => K(r, `${H(o) ? "No audiobooks match." : "Save a book, or start one, and it shows up here with your place."} `)), G(e, t);
			};
			q(u, (e) => {
				H(h).length ? e(d) : e(f, -1);
			}), O(t), z(() => K(a, H(h).length)), G(e, t);
		}, ie = /* @__PURE__ */ A(() => c("book"));
		q(ne, (e) => {
			H(ie) && e(re);
		});
		var ae = R(ne, 2), oe = (e) => {
			var t = ds(), r = F(t), i = R(F(r)), a = L(i, !0), o = R(i);
			O(r);
			var s = R(r, 2);
			J(s, 21, () => l(H(_)), (e) => e.id, (e, t) => {
				let r = /* @__PURE__ */ A(() => n().items[H(t).id]);
				var i = us();
				let a;
				var o = F(i);
				$(o, {
					get hue() {
						return H(r).hue;
					},
					get art() {
						return H(r).art;
					},
					size: 38,
					radius: 8,
					get mark() {
						return H(r).mark;
					},
					font: 10
				});
				var s = R(o, 2), c = F(s), l = L(c, !0), u = L(R(c, 2));
				O(s);
				var d = R(s, 2);
				Oo(d, {
					get store() {
						return n();
					},
					get id() {
						return H(t).id;
					},
					size: 14
				});
				var f = R(d, 2);
				oo(f, {
					get store() {
						return n();
					},
					get id() {
						return H(t).id;
					}
				});
				var p = R(f, 2), m = F(p);
				{
					let e = /* @__PURE__ */ A(() => n().isPlaying(H(t).id) ? H(r).type === "radio" ? Z.stop : Z.pause : Z.play);
					Q(m, {
						get d() {
							return H(e);
						},
						size: 12
					});
				}
				O(p), O(i), z((e, o, s) => {
					a = Y(i, 1, "hrow svelte-ube16v", null, a, { cur: H(t).id === n().now }), K(l, H(r).title), K(u, `${Pi[H(r).type] ?? ""} · ${e ?? ""} · ${o ?? ""}`), X(p, "aria-label", `${s ?? ""} ${H(r).title ?? ""}`);
				}, [
					() => H(r).type === "radio" ? H(r).sub : n().leftOf(H(t).id) || H(r).sub,
					() => ia(new Date(H(t).at).toISOString()),
					() => n().isPlaying(H(t).id) ? H(r).type === "radio" ? "Stop" : "Pause" : "Play"
				]), U("click", s, () => n().play(H(t).id)), U("click", p, () => n().isPlaying(H(t).id) && H(r).type === "radio" ? n().stop() : n().play(H(t).id)), G(e, i);
			}), O(s), O(t), z(() => K(a, H(_).length)), U("click", o, () => n().clearHistory()), G(e, t);
		};
		q(ae, (e) => {
			H(_).length && e(oe);
		}), G(e, t);
	};
	q(pe, (e) => {
		H(v) ? e(me) : e(he, -1);
	}), Ei(ie, () => n().libQuery, (e) => n().libQuery = e), pi(le, () => n().libSort, (e) => n().libSort = e), G(e, T), Ge();
}
xr(["click", "keydown"]);
//#endregion
//#region src/components/RadioView.svelte
var gs = /* @__PURE__ */ W("<button> </button>"), _s = /* @__PURE__ */ W("<div class=\"song svelte-1c0iuue\"> </div>"), vs = /* @__PURE__ */ W("<div><!> <div class=\"text svelte-1c0iuue\"><div class=\"title svelte-1c0iuue\"> </div> <div class=\"sub svelte-1c0iuue\"> </div> <!></div> <!> <button class=\"play svelte-1c0iuue\"><!></button></div>"), ys = /* @__PURE__ */ W("<button class=\"more svelte-1c0iuue\">Show more stations</button>"), bs = /* @__PURE__ */ W("<h1 class=\"h1 svelte-1c0iuue\">Radio</h1> <p class=\"lede svelte-1c0iuue\">Live stations from OndaCast, most listened first. Search above for any station by name, city or genre.</p> <div class=\"genres svelte-1c0iuue\" role=\"group\" aria-label=\"Genre\"></div> <div class=\"grid svelte-1c0iuue\"></div> <!> <!>", 1), xs = {
	hash: "svelte-1c0iuue",
	code: ".h1.svelte-1c0iuue {font-size:26px;font-weight:650;letter-spacing:-.5px;margin:0;}.lede.svelte-1c0iuue {font-size:13px;color:var(--tm-muted);margin:4px 0 0;}.genres.svelte-1c0iuue {display:flex;flex-wrap:wrap;gap:8px;margin-top:18px;}.chip.svelte-1c0iuue {height:30px;padding:0 14px;border-radius:15px;border:1px solid var(--tm-fg-16);background:transparent;color:var(--tm-fg);font-size:12px;font-weight:500;cursor:pointer;}.chip.on.svelte-1c0iuue {border-color:var(--tm-accent);background:var(--tm-accent);color:var(--tm-on-accent);}.grid.svelte-1c0iuue {display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));gap:10px;margin-top:18px;}.row.svelte-1c0iuue {display:flex;align-items:center;gap:10px;padding:12px;border-radius:14px;min-width:0;}.row.svelte-1c0iuue:hover {background:var(--tm-fg-7);}.row.cur.svelte-1c0iuue {background:var(--tm-accent-8);}.text.svelte-1c0iuue {flex:1;min-width:0;}.title.svelte-1c0iuue {font-size:13.5px;font-weight:600;line-height:1.3;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical;overflow-wrap:anywhere;}.cur.svelte-1c0iuue .title:where(.svelte-1c0iuue) {color:var(--tm-accent);}.sub.svelte-1c0iuue {font-size:11.5px;color:var(--tm-muted);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.song.svelte-1c0iuue {font-size:11.5px;margin-top:5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;opacity:.85;}.more.svelte-1c0iuue {display:block;margin:18px auto 0;height:32px;padding:0 18px;border-radius:16px;border:1px solid var(--tm-fg-14);background:transparent;color:var(--tm-fg);font-size:12px;cursor:pointer;}.more.svelte-1c0iuue:hover {background:var(--tm-fg-6);}.play.svelte-1c0iuue {width:36px;height:36px;border:0;border-radius:18px;background:var(--tm-accent);color:var(--tm-on-accent);cursor:pointer;display:grid;place-items:center;flex:none;}"
};
function Ss(e, t) {
	We(t, !0), ei(e, xs);
	let n = Mi(t, "store", 7), r = /* @__PURE__ */ A(() => n().stationList);
	_n(() => {
		n().radioStatus === "idle" && n().loadRadio();
	}), _n(() => {
		H(r).status === "idle" && n().loadStations(n().genre);
	});
	var i = bs(), a = R(I(i), 4);
	J(a, 21, () => Ca, (e) => e.label, (e, t) => {
		var r = gs();
		let i;
		var a = L(r, !0);
		z(() => {
			i = Y(r, 1, "chip svelte-1c0iuue", null, i, { on: n().genre === H(t).label }), X(r, "aria-pressed", n().genre === H(t).label), K(a, H(t).label);
		}), U("click", r, () => n().genre = H(t).label), G(e, r);
	}), O(a);
	var o = R(a, 2);
	J(o, 21, () => n().stations, (e) => e.id, (e, t) => {
		let r = /* @__PURE__ */ A(() => n().songOf(H(t).stationId)), i = /* @__PURE__ */ A(() => n().isPlaying(H(t).id));
		var a = vs();
		let o;
		var s = F(a);
		$(s, {
			get hue() {
				return H(t).hue;
			},
			get art() {
				return H(t).art;
			},
			size: 56,
			radius: 12,
			get mark() {
				return H(t).mark;
			},
			font: 12
		});
		var c = R(s, 2), l = F(c), u = L(l, !0), d = R(l, 2), f = L(d, !0), p = R(d, 2), m = (e) => {
			var t = _s(), n = L(t);
			z(() => K(n, `♪ ${H(r) ?? ""}`)), G(e, t);
		};
		q(p, (e) => {
			H(r) && e(m);
		}), O(c);
		var h = R(c, 2);
		Oo(h, {
			get store() {
				return n();
			},
			get id() {
				return H(t).id;
			}
		});
		var g = R(h, 2), _ = F(g);
		{
			let e = /* @__PURE__ */ A(() => H(i) ? Z.stop : Z.play);
			Q(_, {
				get d() {
					return H(e);
				},
				size: 14
			});
		}
		O(g), O(a), z(() => {
			o = Y(a, 1, "row svelte-1c0iuue", null, o, { cur: H(t).id === n().now }), K(u, H(t).title), K(f, H(t).sub), X(g, "aria-label", `${H(i) ? "Stop" : "Play"} ${H(t).title ?? ""}`);
		}), U("click", g, () => H(i) ? n().stop() : n().play(H(t).id)), G(e, a);
	}), O(o);
	var s = R(o, 2), c = (e) => {
		var t = ys();
		U("click", t, () => n().loadStations(n().genre, !0)), G(e, t);
	};
	q(s, (e) => {
		H(r).more && H(r).status === "ready" && e(c);
	});
	var l = R(s, 2), u = (e) => {
		{
			let t = /* @__PURE__ */ A(() => H(r).status === "idle" ? "loading" : H(r).status);
			_o(e, {
				get status() {
					return H(t);
				},
				retry: () => n().loadStations(n().genre, H(r).ids.length > 0),
				empty: "No stations in this genre right now."
			});
		}
	};
	q(l, (e) => {
		(!n().stations.length || H(r).status === "loading" || H(r).status === "error") && e(u);
	}), G(e, i), Ge();
}
xr(["click"]);
//#endregion
//#region src/components/Grid.svelte
var Cs = /* @__PURE__ */ W("<button class=\"card svelte-1cebjac\"><span><!></span> <span class=\"title svelte-1cebjac\"> </span> <span class=\"sub svelte-1cebjac\"> </span></button>"), ws = /* @__PURE__ */ W("<div class=\"grid svelte-1cebjac\"></div>"), Ts = {
	hash: "svelte-1cebjac",
	code: ".grid.svelte-1cebjac {display:grid;grid-template-columns:repeat(auto-fill, minmax(118px, 1fr));gap:16px 14px;margin-top:16px;}.card.svelte-1cebjac {display:flex;flex-direction:column;gap:3px;padding:0;border:0;background:none;color:inherit;text-align:left;cursor:pointer;font:inherit;min-width:0;}.art.svelte-1cebjac {display:flex;aspect-ratio:1;border-radius:12px;overflow:hidden;box-shadow:0 10px 24px rgba(0, 0, 0, .28);margin-bottom:6px;transition:transform .15s;}.art.tall.svelte-1cebjac {aspect-ratio:0.72;}.card.svelte-1cebjac:hover .art:where(.svelte-1cebjac) {transform:translateY(-2px);}.title.svelte-1cebjac {font-size:12.5px;font-weight:600;line-height:1.25;display:-webkit-box;-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}.sub.svelte-1cebjac {font-size:11px;color:var(--tm-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}\n  @media (prefers-reduced-motion: reduce) {.art.svelte-1cebjac {transition:none;} }"
};
function Es(e, t) {
	We(t, !0), ei(e, Ts);
	let n = Mi(t, "tall", 3, !1);
	var r = ws();
	J(r, 21, () => t.cards, (e) => e.key, (e, r) => {
		var i = Cs(), a = F(i);
		let o;
		$(F(a), {
			get hue() {
				return H(r).hue;
			},
			get art() {
				return H(r).art;
			},
			get mark() {
				return H(r).mark;
			},
			fill: !0,
			radius: 12,
			font: 18
		}), O(a);
		var s = R(a, 2), c = L(s, !0), l = L(R(s, 2), !0);
		O(i), z(() => {
			o = Y(a, 1, "art svelte-1cebjac", null, o, { tall: n() }), K(c, H(r).title), K(l, H(r).sub);
		}), U("click", i, () => t.open(H(r).key)), G(e, i);
	}), O(r), G(e, r), Ge();
}
xr(["click"]);
//#endregion
//#region src/components/PodcastView.svelte
var Ds = /* @__PURE__ */ W("<b class=\"svelte-1phe8yx\"> </b>"), Os = /* @__PURE__ */ W("<button class=\"chipshow svelte-1phe8yx\"><!><span class=\"svelte-1phe8yx\"> </span><!></button>"), ks = /* @__PURE__ */ W("<div class=\"strip svelte-1phe8yx\" aria-label=\"Your shows\"></div>"), As = /* @__PURE__ */ W("<button class=\"more svelte-1phe8yx\">Show more</button>"), js = /* @__PURE__ */ W("<h1 class=\"h1 svelte-1phe8yx\">Podcasts</h1> <p class=\"lede svelte-1phe8yx\">Recently updated shows on OndaCast. Subscribe and new episodes land in Listen now.</p> <!> <!> <!> <!>", 1), Ms = /* @__PURE__ */ W("<div class=\"author svelte-1phe8yx\"> </div>"), Ns = /* @__PURE__ */ W("<button> </button>"), Ps = /* @__PURE__ */ W("<div class=\"tm-pop pop svelte-1phe8yx\" role=\"dialog\"><div class=\"ptitle svelte-1phe8yx\"> </div> <div class=\"plabel svelte-1phe8yx\">Skip intro</div> <div class=\"opts svelte-1phe8yx\"></div> <div class=\"plabel svelte-1phe8yx\">Skip outro</div> <div class=\"opts svelte-1phe8yx\"></div> <div class=\"plabel svelte-1phe8yx\">Speed for this show</div> <div class=\"opts svelte-1phe8yx\"></div> <label class=\"trow svelte-1phe8yx\"><span class=\"svelte-1phe8yx\"><b class=\"svelte-1phe8yx\">Add new episodes to Up next</b><small class=\"svelte-1phe8yx\">When this show publishes, its new episodes queue up for you.</small></span> <input type=\"checkbox\" role=\"switch\" class=\"svelte-1phe8yx\"/></label></div>"), Fs = /* @__PURE__ */ W("<div class=\"hero svelte-1phe8yx\"><div class=\"art svelte-1phe8yx\"><!></div> <div class=\"info svelte-1phe8yx\"><div class=\"eyebrow svelte-1phe8yx\"> </div> <h1 class=\"svelte-1phe8yx\"> </h1> <!> <p class=\"desc svelte-1phe8yx\"> </p> <div class=\"actions svelte-1phe8yx\"><button class=\"primary svelte-1phe8yx\"><!>Latest episode</button> <button> </button> <span class=\"anchor svelte-1phe8yx\"><button class=\"sub icon svelte-1phe8yx\" data-pop=\"\" aria-haspopup=\"dialog\" title=\"Show settings\" aria-label=\"Show settings\"><!>Settings</button> <!></span></div></div></div>"), Is = /* @__PURE__ */ W("<div class=\"tm-pop menu svelte-1phe8yx\" role=\"menu\"><button role=\"menuitem\" class=\"svelte-1phe8yx\"><!>Play unplayed</button> <button role=\"menuitem\" class=\"svelte-1phe8yx\"><!>Queue unplayed</button> <button role=\"menuitem\" class=\"svelte-1phe8yx\"><!>Mark all as played</button> <button role=\"menuitem\" class=\"svelte-1phe8yx\"><!>Mark all as unplayed</button></div>"), Ls = /* @__PURE__ */ W("<button> <span class=\"svelte-1phe8yx\"> </span></button>"), Rs = /* @__PURE__ */ W("<span class=\"loaded svelte-1phe8yx\"> </span>"), zs = /* @__PURE__ */ W("<div class=\"prog svelte-1phe8yx\"><span class=\"bar svelte-1phe8yx\"><span class=\"svelte-1phe8yx\"></span></span><span class=\"left svelte-1phe8yx\"> </span></div>"), Bs = /* @__PURE__ */ W("<p class=\"notes svelte-1phe8yx\"> </p>"), Vs = /* @__PURE__ */ W("<button class=\"notes-toggle svelte-1phe8yx\"> </button> <!>", 1), Hs = /* @__PURE__ */ W("<span class=\"eq svelte-1phe8yx\" aria-hidden=\"true\"><i class=\"svelte-1phe8yx\"></i><i class=\"svelte-1phe8yx\"></i><i class=\"svelte-1phe8yx\"></i></span>"), Us = /* @__PURE__ */ W("<span class=\"nowtag svelte-1phe8yx\"><!>Now playing</span>"), Ws = /* @__PURE__ */ W("<button class=\"pill svelte-1phe8yx\">Play next</button> <button class=\"pill svelte-1phe8yx\">Queue</button>", 1), Gs = /* @__PURE__ */ W("<div><button class=\"playbtn svelte-1phe8yx\"><!></button> <div class=\"text svelte-1phe8yx\"><div class=\"date svelte-1phe8yx\"> </div> <div> </div> <!> <!></div> <!> <!> <button><!></button></div>"), Ks = /* @__PURE__ */ W("<button class=\"more svelte-1phe8yx\"> </button>"), qs = /* @__PURE__ */ W("<button class=\"back svelte-1phe8yx\">‹ All podcasts</button> <!> <div class=\"listhead svelte-1phe8yx\"><span class=\"lt svelte-1phe8yx\">Episodes</span> <div class=\"seg svelte-1phe8yx\" role=\"group\" aria-label=\"Order\"><button>Newest</button> <button>Oldest</button></div> <span class=\"spacer svelte-1phe8yx\"></span> <label class=\"find svelte-1phe8yx\"><!><input type=\"search\" placeholder=\"Find an episode\" aria-label=\"Find an episode\" class=\"svelte-1phe8yx\"/></label> <span class=\"anchor svelte-1phe8yx\"><button class=\"more-btn svelte-1phe8yx\" data-pop=\"\" aria-haspopup=\"menu\" aria-label=\"Episode actions\">•••</button> <!></span></div> <div class=\"filters svelte-1phe8yx\" role=\"group\" aria-label=\"Filter episodes\"><!> <!></div> <!> <!> <!>", 1), Js = {
	hash: "svelte-1phe8yx",
	code: ".h1.svelte-1phe8yx {font-size:26px;font-weight:650;letter-spacing:-.5px;margin:0;}.lede.svelte-1phe8yx {font-size:13px;color:var(--tm-muted);margin:4px 0 0;}.more.svelte-1phe8yx {display:block;margin:16px auto 0;height:32px;padding:0 18px;border-radius:16px;border:1px solid var(--tm-fg-14);background:transparent;color:var(--tm-fg);font-size:12px;cursor:pointer;}.back.svelte-1phe8yx {border:0;background:none;color:var(--tm-muted);font-size:12px;cursor:pointer;padding:0;margin:-8px 0 14px;}.back.svelte-1phe8yx:hover {color:var(--tm-fg);}.hero.svelte-1phe8yx {display:flex;gap:22px;align-items:flex-end;}.art.svelte-1phe8yx {border-radius:16px;box-shadow:0 18px 40px rgba(0, 0, 0, .35);flex:none;}.info.svelte-1phe8yx {flex:1;min-width:0;}.eyebrow.svelte-1phe8yx {font-size:10.5px;letter-spacing:1px;text-transform:uppercase;color:var(--tm-accent);font-weight:600;}h1.svelte-1phe8yx {font-size:28px;font-weight:700;letter-spacing:-.6px;margin:4px 0 0;line-height:1.15;}.author.svelte-1phe8yx {font-size:12.5px;margin-top:4px;}.desc.svelte-1phe8yx {font-size:12.5px;color:var(--tm-muted);margin:4px 0 0;text-wrap:pretty;display:-webkit-box;-webkit-line-clamp:3;line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;}.actions.svelte-1phe8yx {display:flex;gap:8px;margin-top:14px;flex-wrap:wrap;}.actions.svelte-1phe8yx button:where(.svelte-1phe8yx) {height:34px;border-radius:17px;cursor:pointer;}.primary.svelte-1phe8yx {padding:0 16px;border:0;background:var(--tm-accent);color:var(--tm-on-accent);font-size:12.5px;font-weight:650;display:flex;align-items:center;gap:7px;}.primary.svelte-1phe8yx:disabled {opacity:.5;cursor:default;}.sub.svelte-1phe8yx {padding:0 16px;border:1px solid var(--tm-fg-18);background:transparent;color:var(--tm-fg);font-size:12.5px;font-weight:600;}.sub.on.svelte-1phe8yx {border-color:var(--tm-accent);background:var(--tm-accent-12);}.listhead.svelte-1phe8yx {display:flex;align-items:center;gap:10px;margin:26px 0 8px;font-size:12px;color:var(--tm-muted);flex-wrap:wrap;}.lt.svelte-1phe8yx {color:var(--tm-fg);font-weight:650;font-size:14px;}.seg.svelte-1phe8yx {display:flex;padding:2px;border-radius:9px;background:var(--tm-fg-6);}.seg.svelte-1phe8yx button:where(.svelte-1phe8yx) {height:26px;padding:0 12px;border:0;border-radius:7px;background:none;color:var(--tm-muted);font-size:11.5px;font-weight:600;cursor:pointer;}.seg.svelte-1phe8yx button.on:where(.svelte-1phe8yx) {background:var(--tm-panel);color:var(--tm-fg);box-shadow:0 1px 3px rgba(0, 0, 0, .25);}.find.svelte-1phe8yx {display:flex;align-items:center;gap:6px;height:28px;padding:0 10px;border-radius:8px;background:var(--tm-fg-6);width:180px;}.find.svelte-1phe8yx:focus-within {box-shadow:0 0 0 1px var(--tm-accent);}.find.svelte-1phe8yx input:where(.svelte-1phe8yx) {flex:1;min-width:0;border:0;background:none;outline:none;color:var(--tm-fg);font:inherit;font-size:12px;}.anchor.svelte-1phe8yx {position:relative;display:inline-flex;}.more-btn.svelte-1phe8yx {width:30px;height:28px;border:0;border-radius:8px;background:var(--tm-fg-6);color:var(--tm-fg);cursor:pointer;font-size:11px;letter-spacing:1px;}.more-btn.svelte-1phe8yx:hover, .more-btn[aria-expanded='true'].svelte-1phe8yx {background:var(--tm-fg-12);}.menu.svelte-1phe8yx {right:0;top:34px;width:210px;padding:6px;}.menu.svelte-1phe8yx button:where(.svelte-1phe8yx) {display:flex;align-items:center;gap:9px;width:100%;height:32px;padding:0 10px;border:0;border-radius:8px;background:none;color:var(--tm-fg);font-size:12px;cursor:pointer;text-align:left;}.menu.svelte-1phe8yx button:where(.svelte-1phe8yx):hover {background:var(--tm-fg-8);}.pop.svelte-1phe8yx {left:0;top:40px;width:380px;max-width:calc(100cqw - 40px);}.ptitle.svelte-1phe8yx {font-size:13px;font-weight:650;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.plabel.svelte-1phe8yx {font-size:11px;color:var(--tm-muted);margin:12px 0 6px;}.opts.svelte-1phe8yx {display:flex;flex-wrap:wrap;gap:5px;}.opt.svelte-1phe8yx {min-width:38px;height:28px;padding:0 8px;border:0;border-radius:7px;background:var(--tm-fg-6);color:var(--tm-fg);font-size:11px;font-weight:600;cursor:pointer;font-variant-numeric:tabular-nums;}.opt.svelte-1phe8yx:hover {background:var(--tm-fg-10);}.opt.sel.svelte-1phe8yx {background:var(--tm-accent);color:var(--tm-on-accent);}.trow.svelte-1phe8yx {display:flex;align-items:center;gap:12px;margin-top:14px;cursor:pointer;}.trow.svelte-1phe8yx span:where(.svelte-1phe8yx) {flex:1;display:flex;flex-direction:column;gap:2px;font-size:12px;}.trow.svelte-1phe8yx small:where(.svelte-1phe8yx) {font-size:11px;color:var(--tm-muted);line-height:1.35;}.trow.svelte-1phe8yx input:where(.svelte-1phe8yx) {appearance:none;width:34px;height:20px;flex:none;border-radius:10px;background:var(--tm-fg-16);position:relative;cursor:pointer;margin:0;}.trow.svelte-1phe8yx input:where(.svelte-1phe8yx)::after {content:'';position:absolute;top:3px;left:3px;width:14px;height:14px;border-radius:50%;background:var(--tm-fg);transition:transform .15s;}.trow.svelte-1phe8yx input:where(.svelte-1phe8yx):checked {background:var(--tm-accent);}.trow.svelte-1phe8yx input:where(.svelte-1phe8yx):checked::after {transform:translateX(14px);background:var(--tm-on-accent);}.sub.icon.svelte-1phe8yx {display:flex;align-items:center;gap:6px;}.filters.svelte-1phe8yx {display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-bottom:4px;}.fchip.svelte-1phe8yx {height:26px;padding:0 10px;border-radius:13px;border:1px solid var(--tm-fg-14);background:transparent;color:var(--tm-fg);font-size:11.5px;cursor:pointer;display:flex;align-items:center;gap:6px;}.fchip.svelte-1phe8yx span:where(.svelte-1phe8yx) {font-size:10px;color:var(--tm-muted);font-variant-numeric:tabular-nums;}.fchip.on.svelte-1phe8yx {background:var(--tm-accent-14);border-color:var(--tm-accent);color:var(--tm-accent);}.fchip.on.svelte-1phe8yx span:where(.svelte-1phe8yx) {color:inherit;}.loaded.svelte-1phe8yx {font-size:11px;color:var(--tm-muted);margin-left:4px;}.notes-toggle.svelte-1phe8yx {border:0;padding:0;margin-top:6px;background:none;color:var(--tm-accent);font-size:11.5px;cursor:pointer;}.notes.svelte-1phe8yx {font-size:12px;line-height:1.55;color:var(--tm-muted);margin:6px 0 0;white-space:pre-line;max-width:640px;}.strip.svelte-1phe8yx {display:flex;gap:8px;overflow-x:auto;margin-top:16px;padding-bottom:4px;scrollbar-width:thin;}.chipshow.svelte-1phe8yx {display:flex;align-items:center;gap:8px;height:40px;padding:0 12px 0 6px;flex:none;border:1px solid var(--tm-fg-10);border-radius:12px;background:var(--tm-fg-4);color:var(--tm-fg);font-size:12px;font-weight:600;cursor:pointer;max-width:240px;}.chipshow.svelte-1phe8yx:hover {border-color:var(--tm-accent);}.chipshow.svelte-1phe8yx span:where(.svelte-1phe8yx) {overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.chipshow.svelte-1phe8yx b:where(.svelte-1phe8yx) {font-size:10px;min-width:18px;height:18px;padding:0 5px;border-radius:9px;display:grid;place-items:center;background:var(--tm-accent);color:var(--tm-on-accent);}.spacer.svelte-1phe8yx {flex:1;}.ep.svelte-1phe8yx {display:flex;align-items:center;gap:14px;padding:14px 8px;border-top:1px solid var(--tm-fg-6);}.ep.cur.svelte-1phe8yx {background:var(--tm-accent-8);}.playbtn.svelte-1phe8yx {width:36px;height:36px;border-radius:18px;border:1px solid var(--tm-fg-18);background:transparent;color:var(--tm-fg);cursor:pointer;display:grid;place-items:center;flex:none;}.playbtn.svelte-1phe8yx:hover {background:var(--tm-accent);color:var(--tm-on-accent);border-color:var(--tm-accent);}.text.svelte-1phe8yx {flex:1;min-width:0;}.date.svelte-1phe8yx {font-size:11px;color:var(--tm-muted);}.title.svelte-1phe8yx {font-size:13.5px;font-weight:600;margin-top:2px;}.cur.svelte-1phe8yx .title:where(.svelte-1phe8yx) {color:var(--tm-accent);}.title.done.svelte-1phe8yx {color:var(--tm-muted);}.prog.svelte-1phe8yx {display:flex;align-items:center;gap:8px;margin-top:6px;}.bar.svelte-1phe8yx {width:70px;height:3px;border-radius:2px;background:var(--tm-fg-10);display:block;}.bar.svelte-1phe8yx span:where(.svelte-1phe8yx) {display:block;height:3px;border-radius:2px;background:var(--tm-accent);}.left.svelte-1phe8yx {font-size:11px;color:var(--tm-muted);}.nowtag.svelte-1phe8yx {display:flex;align-items:center;gap:7px;font-size:11.5px;font-weight:650;color:var(--tm-accent);flex:none;padding:0 6px;}.eq.svelte-1phe8yx {display:flex;align-items:flex-end;gap:2px;height:12px;}.eq.svelte-1phe8yx i:where(.svelte-1phe8yx) {width:3px;background:var(--tm-accent);border-radius:1px; animation: svelte-1phe8yx-eq 1s ease-in-out infinite;}.eq.svelte-1phe8yx i:where(.svelte-1phe8yx):nth-child(2) {animation-delay:-.3s;}.eq.svelte-1phe8yx i:where(.svelte-1phe8yx):nth-child(3) {animation-delay:-.6s;}\n  @keyframes svelte-1phe8yx-eq { 0%, 100% { height: 4px; } 50% { height: 12px; } }\n  @media (prefers-reduced-motion: reduce) {.eq.svelte-1phe8yx i:where(.svelte-1phe8yx) { animation: none;height:8px;} }.pill.svelte-1phe8yx {height:28px;padding:0 10px;border:0;border-radius:7px;background:var(--tm-fg-6);color:var(--tm-fg);font-size:11.5px;cursor:pointer;flex:none;}.pill.svelte-1phe8yx:hover {background:var(--tm-fg-12);}.mark.svelte-1phe8yx {width:28px;height:28px;border:0;border-radius:7px;background:transparent;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;flex:none;}.mark.done.svelte-1phe8yx {color:var(--tm-accent);}.mark.svelte-1phe8yx:hover {background:var(--tm-fg-8);}"
};
function Ys(e, t) {
	We(t, !0), ei(e, Js);
	let n = Mi(t, "store", 7), r = /* @__PURE__ */ A(() => n().show), i = /* @__PURE__ */ A(() => !!H(r) && !!n().subscribed[H(r).slug]), a = /* @__PURE__ */ A(() => n().showSlug ? n().showEpisodes[n().showSlug] : void 0), o = /* @__PURE__ */ A(() => n().showSlug ? n().epOrder[n().showSlug] ?? "new" : "new"), s = /* @__PURE__ */ A(() => H(r) ? n().showPrefsOf(H(r).slug) : null), c = /* @__PURE__ */ A(() => H(r) ? n().speeds[`show:${H(r).slug}`] ?? 1 : 1), l = /* @__PURE__ */ A(() => n().podcastBrowse.slugs.map((e) => n().shows[e]).filter(Boolean).map((e) => ({
		key: e.slug,
		title: e.title,
		sub: e.author || e.category,
		hue: e.hue,
		mark: e.mark,
		art: e.art
	}))), u = /* @__PURE__ */ A(() => Object.values(n().subscribed)), d = /* @__PURE__ */ A(() => n().allEpisodes), f = /* @__PURE__ */ A(() => [...H(d)].sort((e, t) => (t.date || "").localeCompare(e.date || ""))[0]), p = /* @__PURE__ */ A(() => {
		let e = {
			all: H(d).length,
			unplayed: 0,
			progress: 0,
			played: 0
		};
		for (let t of H(d)) e[n().episodeState(t.id)]++;
		return e;
	}), h = [
		["all", "All"],
		["unplayed", "Unplayed"],
		["progress", "In progress"],
		["played", "Played"]
	], g = /* @__PURE__ */ M(P({}));
	_n(() => {
		!n().showSlug && n().podcastBrowse.status === "idle" && n().loadPodcastBrowse();
	});
	let _ = (e) => e ? `${e}s` : "Off";
	function v(e) {
		if (!H(r)) return;
		n().speeds = {
			...n().speeds,
			[`show:${H(r).slug}`]: e
		};
		let t = n().item;
		t?.type === "podcast" && t.show === H(r).slug ? n().setSpeed(e) : n().scheduleSave();
	}
	var y = Mr(), b = I(y), x = (e) => {
		var t = js(), r = R(I(t), 4), i = (e) => {
			var t = ks();
			J(t, 21, () => H(u), (e) => e.slug, (e, t) => {
				let r = /* @__PURE__ */ A(() => n().newCount(H(t).slug));
				var i = Os(), a = F(i);
				$(a, {
					get hue() {
						return H(t).hue;
					},
					get art() {
						return H(t).art;
					},
					size: 28,
					radius: 7,
					font: 9,
					get mark() {
						return H(t).mark;
					}
				});
				var o = R(a), s = L(o, !0), c = R(o), l = (e) => {
					var t = Ds(), n = L(t, !0);
					z(() => K(n, H(r))), G(e, t);
				};
				q(c, (e) => {
					H(r) && e(l);
				}), O(i), z(() => K(s, H(t).title)), U("click", i, () => n().openShow(H(t).slug)), G(e, i);
			}), O(t), G(e, t);
		};
		q(r, (e) => {
			H(u).length && e(i);
		});
		var a = R(r, 2);
		Es(a, {
			get cards() {
				return H(l);
			},
			open: (e) => n().openShow(e)
		});
		var o = R(a, 2);
		_o(o, {
			get status() {
				return n().podcastBrowse.status;
			},
			retry: () => n().loadPodcastBrowse()
		});
		var s = R(o, 2), c = (e) => {
			var t = As();
			U("click", t, () => n().loadPodcastBrowse(!0)), G(e, t);
		};
		q(s, (e) => {
			n().podcastBrowse.cursor && n().podcastBrowse.status === "ready" && e(c);
		}), G(e, t);
	}, S = (e) => {
		var t = qs(), l = I(t), u = R(l, 2), y = (e) => {
			var t = Fs(), a = F(t);
			$(F(a), {
				get hue() {
					return H(r).hue;
				},
				get art() {
					return H(r).art;
				},
				size: 132,
				radius: 16,
				get mark() {
					return H(r).mark;
				},
				font: 20
			}), O(a);
			var o = R(a, 2), l = F(o), u = L(l), d = R(l, 2), p = L(d, !0), m = R(d, 2), h = (e) => {
				var t = Ms(), n = L(t, !0);
				z(() => K(n, H(r).author)), G(e, t);
			};
			q(m, (e) => {
				H(r).author && e(h);
			});
			var g = R(m, 2), y = L(g, !0), b = R(g, 2), x = F(b);
			Q(F(x), {
				get d() {
					return Z.play;
				},
				size: 12
			}), k(), O(x);
			var S = R(x, 2);
			let C;
			var w = L(S, !0), ee = R(S, 2), T = F(ee);
			Q(F(T), {
				get d() {
					return Z.gear;
				},
				size: 14,
				stroke: 1.6
			}), k(), O(T);
			var te = R(T, 2), ne = (e) => {
				var t = Ps(), a = F(t), o = L(a, !0), l = R(a, 4);
				J(l, 21, () => ka, Gr, (e, t) => {
					var i = Ns();
					let a;
					var o = L(i, !0);
					z((e) => {
						a = Y(i, 1, "opt svelte-1phe8yx", null, a, { sel: H(s).intro === H(t) }), K(o, e);
					}, [() => _(H(t))]), U("click", i, () => n().setShowPref(H(r).slug, "intro", H(t))), G(e, i);
				}), O(l);
				var u = R(l, 4);
				J(u, 21, () => Aa, Gr, (e, t) => {
					var i = Ns();
					let a;
					var o = L(i, !0);
					z((e) => {
						a = Y(i, 1, "opt svelte-1phe8yx", null, a, { sel: H(s).outro === H(t) }), K(o, e);
					}, [() => _(H(t))]), U("click", i, () => n().setShowPref(H(r).slug, "outro", H(t))), G(e, i);
				}), O(u);
				var d = R(u, 4);
				J(d, 21, () => ja, Gr, (e, t) => {
					var n = Ns();
					let r;
					var i = L(n);
					z((e) => {
						r = Y(n, 1, "opt svelte-1phe8yx", null, r, { sel: H(c) === H(t) }), K(i, `${e ?? ""}×`);
					}, [() => H(t).toFixed(1)]), U("click", n, () => v(H(t))), G(e, n);
				}), O(d);
				var f = R(d, 2), p = R(F(f), 2);
				bi(p), O(f), O(t), z(() => {
					X(t, "aria-label", `Settings for ${H(r).title ?? ""}`), K(o, H(r).title), Si(p, H(s).autoQueue);
				}), U("change", p, (e) => {
					n().setShowPref(H(r).slug, "autoQueue", e.currentTarget.checked), e.currentTarget.checked && !H(i) && n().toggleSubscribe(H(r).slug);
				}), G(e, t);
			};
			q(te, (e) => {
				n().pop === "show" && H(s) && e(ne);
			}), O(ee), O(b), O(o), O(t), z(() => {
				K(u, `Podcast${H(r).category ? ` · ${H(r).category}` : ""}`), K(p, H(r).title), K(y, H(r).desc), x.disabled = !H(f), C = Y(S, 1, "sub svelte-1phe8yx", null, C, { on: H(i) }), X(S, "aria-pressed", H(i)), K(w, H(i) ? "Subscribed" : "Subscribe"), X(T, "aria-expanded", n().pop === "show");
			}), U("click", x, () => H(f) && n().play(H(f).id)), U("click", S, () => n().toggleSubscribe(H(r).slug)), U("click", T, () => n().togglePop("show")), G(e, t);
		};
		q(u, (e) => {
			H(r) && e(y);
		});
		var b = R(u, 2), x = R(F(b), 2), S = F(x);
		let C;
		var w = R(S, 2);
		let ee;
		O(x);
		var T = R(x, 4), te = F(T);
		Q(te, {
			get d() {
				return Z.search;
			},
			size: 12,
			stroke: 2
		});
		var ne = R(te);
		bi(ne), O(T);
		var re = R(T, 2), ie = F(re), ae = R(ie, 2), oe = (e) => {
			var t = Is(), i = F(t);
			Q(F(i), {
				get d() {
					return Z.play;
				},
				size: 12
			}), k(), O(i);
			var a = R(i, 2);
			Q(F(a), {
				get d() {
					return Z.plus;
				},
				size: 12,
				stroke: 2
			}), k(), O(a);
			var o = R(a, 2);
			Q(F(o), {
				get d() {
					return Z.check;
				},
				size: 12,
				stroke: 2
			}), k(), O(o);
			var s = R(o, 2);
			Q(F(s), {
				get d() {
					return Z.clock;
				},
				size: 12,
				stroke: 2
			}), k(), O(s), O(t), U("click", i, () => {
				n().pop = null, n().queueUnplayed(!0);
			}), U("click", a, () => {
				n().pop = null, n().queueUnplayed(!1);
			}), U("click", o, () => {
				n().pop = null, n().markShow(H(r).slug, !0);
			}), U("click", s, () => {
				n().pop = null, n().markShow(H(r).slug, !1);
			}), G(e, t);
		};
		q(ae, (e) => {
			n().pop === "epmenu" && H(r) && e(oe);
		}), O(re), O(b);
		var se = R(b, 2), ce = F(se);
		J(ce, 17, () => h, ([e, t]) => e, (e, t) => {
			var r = /* @__PURE__ */ A(() => m(H(t), 2));
			let i = () => H(r)[0], a = () => H(r)[1];
			var o = Ls();
			let s;
			var c = F(o, !0), l = L(R(c), !0);
			O(o), z(() => {
				s = Y(o, 1, "fchip svelte-1phe8yx", null, s, { on: n().epFilter === i() }), X(o, "aria-pressed", n().epFilter === i()), K(c, a()), K(l, H(p)[i()]);
			}), U("click", o, () => n().epFilter = i()), G(e, o);
		});
		var le = R(ce, 2), ue = (e) => {
			var t = Rs(), n = L(t);
			z(() => K(n, `${H(d).length ?? ""} loaded`)), G(e, t);
		};
		q(le, (e) => {
			H(a)?.hasNext && e(ue);
		}), O(se);
		var de = R(se, 2);
		J(de, 17, () => n().episodes, (e) => e.id, (e, t) => {
			let r = /* @__PURE__ */ A(() => n().isDone(H(t).id));
			var i = Gs();
			let a;
			var o = F(i), s = F(o);
			{
				let e = /* @__PURE__ */ A(() => n().isPlaying(H(t).id) ? Z.pause : Z.play);
				Q(s, {
					get d() {
						return H(e);
					},
					size: 13
				});
			}
			O(o);
			var c = R(o, 2), l = F(c), u = L(l, !0), d = R(l, 2);
			let f;
			var p = L(d, !0), m = R(d, 2), h = (e) => {
				var i = zs(), a = F(i), o = F(a);
				let s;
				O(a);
				var c = L(R(a), !0);
				O(i), z((e, t) => {
					s = ci(o, "", s, { width: e }), K(c, t);
				}, [() => `${(H(r) ? 100 : n().pctOf(H(t).id)) ?? ""}%`, () => n().leftOf(H(t).id)]), G(e, i);
			}, _ = /* @__PURE__ */ A(() => n().progressOf(H(t).id) > 5 || H(r));
			q(m, (e) => {
				H(_) && e(h);
			});
			var v = R(m, 2), y = (e) => {
				var n = Vs(), r = I(n), i = L(r, !0), a = R(r, 2), o = (e) => {
					var n = Bs(), r = L(n, !0);
					z(() => K(r, H(t).desc)), G(e, n);
				};
				q(a, (e) => {
					H(g)[H(t).id] && e(o);
				}), z(() => {
					X(r, "aria-expanded", !!H(g)[H(t).id]), K(i, H(g)[H(t).id] ? "Hide show notes" : "Show notes");
				}), U("click", r, () => N(g, {
					...H(g),
					[H(t).id]: !H(g)[H(t).id]
				}, !0)), G(e, n);
			};
			q(v, (e) => {
				H(t).desc && e(y);
			}), O(c);
			var b = R(c, 2), x = (e) => {
				var t = Us(), r = F(t), i = (e) => {
					G(e, Hs());
				};
				q(r, (e) => {
					n().playing && e(i);
				}), k(), O(t), G(e, t);
			}, S = (e) => {
				var r = Ws(), i = I(r), a = R(i, 2);
				U("click", i, () => n().playNext(H(t).id)), U("click", a, () => n().addToQueue(H(t).id)), G(e, r);
			};
			q(b, (e) => {
				H(t).id === n().now ? e(x) : e(S, -1);
			});
			var C = R(b, 2);
			oo(C, {
				get store() {
					return n();
				},
				get id() {
					return H(t).id;
				}
			});
			var w = R(C, 2);
			let ee;
			Q(F(w), {
				get d() {
					return Z.check;
				},
				size: 15,
				stroke: 2
			}), O(w), O(i), z((e, s) => {
				a = Y(i, 1, "ep svelte-1phe8yx", null, a, { cur: H(t).id === n().now }), X(o, "aria-label", `${e ?? ""} ${H(t).title ?? ""}`), K(u, s), f = Y(d, 1, "title svelte-1phe8yx", null, f, { done: H(r) && H(t).id !== n().now }), K(p, H(t).title), ee = Y(w, 1, "mark svelte-1phe8yx", null, ee, { done: H(r) }), X(w, "title", H(r) ? "Mark as unplayed" : "Mark as played"), X(w, "aria-label", H(r) ? "Mark as unplayed" : "Mark as played"), X(w, "aria-pressed", H(r));
			}, [() => n().isPlaying(H(t).id) ? "Pause" : "Play", () => [Gi(H(t).date), n().lenOf(H(t).id)].filter(Boolean).join(" · ")]), U("click", o, () => n().play(H(t).id)), U("click", w, () => n().togglePlayed(H(t).id)), G(e, i);
		});
		var fe = R(de, 2);
		{
			let e = /* @__PURE__ */ A(() => H(a)?.status ?? "loading"), t = /* @__PURE__ */ A(() => H(a)?.status === "ready" && !n().episodes.length ? H(d).length ? "No episodes match. Change the filter or load more." : "This show has no playable episodes yet." : "");
			_o(fe, {
				get status() {
					return H(e);
				},
				retry: () => n().showSlug && n().loadShow(n().showSlug, (H(a)?.ids.length ?? 0) > 0),
				get empty() {
					return H(t);
				}
			});
		}
		var pe = R(fe, 2), me = (e) => {
			var t = Ks(), r = L(t, !0);
			z(() => K(r, H(o) === "new" ? "Older episodes" : "Newer episodes")), U("click", t, () => n().showSlug && n().loadShow(n().showSlug, !0)), G(e, t);
		};
		q(pe, (e) => {
			H(a)?.hasNext && H(a).status === "ready" && e(me);
		}), z(() => {
			X(S, "aria-pressed", H(o) === "new"), C = Y(S, 1, "svelte-1phe8yx", null, C, { on: H(o) === "new" }), X(w, "aria-pressed", H(o) === "old"), ee = Y(w, 1, "svelte-1phe8yx", null, ee, { on: H(o) === "old" }), X(ie, "aria-expanded", n().pop === "epmenu");
		}), U("click", l, () => n().showSlug = null), U("click", S, () => H(r) && n().setEpisodeOrder(H(r).slug, "new")), U("click", w, () => H(r) && n().setEpisodeOrder(H(r).slug, "old")), Ei(ne, () => n().epQuery, (e) => n().epQuery = e), U("click", ie, () => n().togglePop("epmenu")), G(e, t);
	};
	q(b, (e) => {
		n().showSlug ? e(S, -1) : e(x);
	}), G(e, y), Ge();
}
xr(["click", "change"]);
//#endregion
//#region src/components/BookView.svelte
var Xs = /* @__PURE__ */ W("<span class=\"sbar svelte-965svo\"><span class=\"svelte-965svo\"></span></span>"), Zs = /* @__PURE__ */ W("<button class=\"shelfitem svelte-965svo\"><span class=\"scover svelte-965svo\"><!></span> <span class=\"stext svelte-965svo\"><span class=\"stitle svelte-965svo\"> </span><span class=\"smeta svelte-965svo\"> </span> <!></span></button>"), Qs = /* @__PURE__ */ W("<div class=\"shelf svelte-965svo\"></div>"), $s = /* @__PURE__ */ W("<button class=\"more svelte-965svo\">Show more</button>"), ec = /* @__PURE__ */ W("<h1 class=\"h1 svelte-965svo\">Audiobooks</h1> <p class=\"lede svelte-965svo\">Public-domain classics read by LibriVox volunteers, via OndaCast.</p> <!> <!> <!> <!>", 1), tc = /* @__PURE__ */ W("<div class=\"prog svelte-965svo\"><span class=\"bar svelte-965svo\"><span class=\"svelte-965svo\"></span></span><span class=\"left svelte-965svo\"> </span></div>"), nc = /* @__PURE__ */ W("<div class=\"where svelte-965svo\"> </div>"), rc = /* @__PURE__ */ W("<div class=\"tm-pop menu svelte-965svo\" role=\"menu\"><button role=\"menuitem\" class=\"svelte-965svo\"><!> </button> <button role=\"menuitem\" class=\"svelte-965svo\"><!>Start over</button></div>"), ic = /* @__PURE__ */ W("<button class=\"link svelte-965svo\"> </button>"), ac = /* @__PURE__ */ W("<p> </p> <!>", 1), oc = /* @__PURE__ */ W("<form class=\"noteform svelte-965svo\"><input maxlength=\"500\" placeholder=\"Add a note\" class=\"svelte-965svo\"/> <button type=\"submit\" class=\"svelte-965svo\">Save</button></form>"), sc = /* @__PURE__ */ W("<button class=\"note svelte-965svo\"> </button>"), cc = /* @__PURE__ */ W("<button class=\"addnote svelte-965svo\">Add a note</button>"), lc = /* @__PURE__ */ W("<div class=\"mrow svelte-965svo\"><div class=\"mbody svelte-965svo\"><button class=\"mjump svelte-965svo\"> <span class=\"svelte-965svo\"> </span></button> <!></div> <button class=\"rm svelte-965svo\"><!></button></div>"), uc = /* @__PURE__ */ W("<h2 class=\"svelte-965svo\">Bookmarks</h2> <!>", 1), dc = /* @__PURE__ */ W("<label class=\"find svelte-965svo\"><!><input type=\"search\" placeholder=\"Find a chapter\" aria-label=\"Find a chapter\" class=\"svelte-965svo\"/></label>"), fc = /* @__PURE__ */ W("<label class=\"hide svelte-965svo\"><input type=\"checkbox\" class=\"svelte-965svo\"/>Hide finished</label>"), pc = /* @__PURE__ */ W("<button><span class=\"n svelte-965svo\"> </span> <span class=\"title svelte-965svo\"> </span> <span class=\"state svelte-965svo\"> </span></button>"), mc = /* @__PURE__ */ W("<div class=\"hero svelte-965svo\"><div class=\"cover svelte-965svo\"><!></div> <div class=\"info svelte-965svo\"><div class=\"eyebrow svelte-965svo\">Audiobook · Public domain</div> <h1 class=\"svelte-965svo\"> </h1> <p class=\"sub svelte-965svo\"> </p> <!> <!> <div class=\"actions svelte-965svo\"><button class=\"primary svelte-965svo\"><!> </button> <button><!> </button> <button class=\"ghost svelte-965svo\">Add bookmark</button> <span class=\"anchor svelte-965svo\"><button class=\"ghost dots svelte-965svo\" data-pop=\"\" aria-haspopup=\"menu\" aria-label=\"More actions\">•••</button> <!></span></div></div></div> <!> <!> <div class=\"chead svelte-965svo\"><h2 class=\"svelte-965svo\">Chapters</h2> <span class=\"spacer svelte-965svo\"></span> <!> <!></div> <!>", 1), hc = /* @__PURE__ */ W("<button class=\"back svelte-965svo\">‹ All audiobooks</button> <!> <!>", 1), gc = {
	hash: "svelte-965svo",
	code: ".h1.svelte-965svo {font-size:26px;font-weight:650;letter-spacing:-.5px;margin:0;}.lede.svelte-965svo {font-size:13px;color:var(--tm-muted);margin:4px 0 0;}.more.svelte-965svo {display:block;margin:16px auto 0;height:32px;padding:0 18px;border-radius:16px;border:1px solid var(--tm-fg-14);background:transparent;color:var(--tm-fg);font-size:12px;cursor:pointer;}.back.svelte-965svo {border:0;background:none;color:var(--tm-muted);font-size:12px;cursor:pointer;padding:0;margin:-8px 0 14px;}.back.svelte-965svo:hover {color:var(--tm-fg);}.hero.svelte-965svo {display:flex;gap:24px;}.cover.svelte-965svo {width:120px;height:176px;border-radius:6px 12px 12px 6px;flex:none;overflow:hidden;display:flex;box-shadow:0 18px 40px rgba(0, 0, 0, .4), inset 6px 0 0 rgba(0, 0, 0, .18);}.info.svelte-965svo {flex:1;min-width:0;padding-top:6px;}.eyebrow.svelte-965svo {font-size:10.5px;letter-spacing:1px;text-transform:uppercase;color:var(--tm-accent);font-weight:600;}h1.svelte-965svo {font-size:28px;font-weight:700;letter-spacing:-.6px;margin:4px 0 0;line-height:1.15;}.sub.svelte-965svo {font-size:13px;color:var(--tm-muted);margin:4px 0 0;}.prog.svelte-965svo {display:flex;align-items:center;gap:10px;margin-top:16px;}.bar.svelte-965svo {flex:1;max-width:260px;height:4px;border-radius:2px;background:var(--tm-fg-10);display:block;}.bar.svelte-965svo span:where(.svelte-965svo) {display:block;height:4px;border-radius:2px;background:var(--tm-accent);}.left.svelte-965svo {font-size:12px;}.actions.svelte-965svo {display:flex;gap:8px;margin-top:16px;flex-wrap:wrap;}.where.svelte-965svo {font-size:11.5px;color:var(--tm-muted);margin-top:6px;}.anchor.svelte-965svo {position:relative;display:inline-flex;}.dots.svelte-965svo {width:38px;justify-content:center;letter-spacing:1px;padding:0 !important;}.menu.svelte-965svo {left:0;top:40px;width:210px;padding:6px;}.menu.svelte-965svo button:where(.svelte-965svo) {display:flex;align-items:center;gap:9px;width:100%;height:32px;padding:0 10px;border:0;border-radius:8px;background:none;color:var(--tm-fg);font-size:12px;cursor:pointer;text-align:left;}.menu.svelte-965svo button:where(.svelte-965svo):hover {background:var(--tm-fg-8);}.desc.svelte-965svo {font-size:12.5px;line-height:1.6;color:var(--tm-muted);margin:20px 0 0;max-width:720px;display:-webkit-box;-webkit-line-clamp:3;line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;}.desc.open.svelte-965svo {display:block;}.link.svelte-965svo {border:0;background:none;padding:0;color:var(--tm-accent);font-size:12px;cursor:pointer;margin-top:4px;}.mbody.svelte-965svo {flex:1;min-width:0;}.note.svelte-965svo, .addnote.svelte-965svo {display:block;border:0;background:none;padding:0 8px 9px;text-align:left;font:inherit;font-size:12px;cursor:pointer;}.note.svelte-965svo {color:var(--tm-fg);font-style:italic;}.addnote.svelte-965svo {color:var(--tm-muted);}.addnote.svelte-965svo:hover {color:var(--tm-accent);}.noteform.svelte-965svo {display:flex;gap:6px;padding:0 8px 9px;}.noteform.svelte-965svo input:where(.svelte-965svo) {flex:1;min-width:0;height:28px;padding:0 8px;border-radius:7px;border:1px solid var(--tm-fg-14);background:var(--tm-fg-4);color:var(--tm-fg);font:inherit;font-size:12px;outline:none;}.noteform.svelte-965svo input:where(.svelte-965svo):focus {border-color:var(--tm-accent);}.noteform.svelte-965svo button:where(.svelte-965svo) {height:28px;padding:0 12px;border:0;border-radius:7px;background:var(--tm-accent);color:var(--tm-on-accent);font-size:11.5px;font-weight:650;cursor:pointer;}.chead.svelte-965svo {display:flex;align-items:center;gap:10px;margin:26px 0 6px;}.chead.svelte-965svo h2:where(.svelte-965svo) {margin:0;}.spacer.svelte-965svo {flex:1;}.find.svelte-965svo {display:flex;align-items:center;gap:6px;height:28px;padding:0 10px;border-radius:8px;background:var(--tm-fg-6);width:170px;color:var(--tm-muted);}.find.svelte-965svo input:where(.svelte-965svo) {flex:1;min-width:0;border:0;background:none;outline:none;color:var(--tm-fg);font:inherit;font-size:12px;}.hide.svelte-965svo {display:flex;align-items:center;gap:6px;font-size:12px;color:var(--tm-muted);cursor:pointer;}.hide.svelte-965svo input:where(.svelte-965svo) {accent-color:var(--tm-accent);}.shelf.svelte-965svo {display:flex;gap:10px;overflow-x:auto;margin-top:16px;padding-bottom:4px;scrollbar-width:thin;}.shelfitem.svelte-965svo {display:flex;gap:10px;align-items:center;flex:none;width:230px;padding:8px;border:1px solid var(--tm-fg-10);border-radius:12px;background:var(--tm-fg-4);color:inherit;cursor:pointer;text-align:left;font:inherit;}.shelfitem.svelte-965svo:hover {border-color:var(--tm-accent);}.scover.svelte-965svo {width:36px;height:52px;border-radius:3px 6px 6px 3px;overflow:hidden;display:flex;flex:none;}.stext.svelte-965svo {flex:1;min-width:0;display:flex;flex-direction:column;gap:3px;}.stitle.svelte-965svo {font-size:12px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.smeta.svelte-965svo {font-size:10.5px;color:var(--tm-muted);}.sbar.svelte-965svo {display:block;height:3px;border-radius:2px;background:var(--tm-fg-10);}.sbar.svelte-965svo span:where(.svelte-965svo) {display:block;height:3px;border-radius:2px;background:var(--tm-accent);}.actions.svelte-965svo button:where(.svelte-965svo) {height:34px;border-radius:17px;cursor:pointer;}.actions.svelte-965svo button:where(.svelte-965svo):disabled {opacity:.5;cursor:default;}.primary.svelte-965svo {padding:0 16px;border:0;background:var(--tm-accent);color:var(--tm-on-accent);font-size:12.5px;font-weight:650;display:flex;align-items:center;gap:7px;}.ghost.saved.svelte-965svo {color:var(--tm-live);border-color:color-mix(in srgb, var(--tm-live) 40%, transparent);}.ghost.svelte-965svo {display:flex;align-items:center;gap:6px;padding:0 14px;border:1px solid var(--tm-fg-14);background:transparent;color:var(--tm-fg);font-size:12px;}h2.svelte-965svo {font-size:14px;font-weight:600;margin:26px 0 6px;}.mrow.svelte-965svo {align-items:flex-start;}.mrow.svelte-965svo {display:flex;align-items:center;border-top:1px solid var(--tm-fg-6);}.mjump.svelte-965svo {flex:1;width:100%;display:flex;justify-content:space-between;gap:12px;padding:9px 8px;border:0;background:none;color:var(--tm-fg);font:inherit;font-size:12.5px;cursor:pointer;text-align:left;}.mjump.svelte-965svo span:where(.svelte-965svo) {color:var(--tm-muted);font-size:11px;}.mjump.svelte-965svo:hover {background:var(--tm-fg-4);}.rm.svelte-965svo {width:26px;height:26px;border:0;background:none;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;border-radius:6px;}.rm.svelte-965svo:hover {color:var(--tm-fg);background:var(--tm-fg-8);}.chap.svelte-965svo {display:flex;align-items:center;gap:14px;width:100%;padding:10px 8px;border:0;border-top:1px solid var(--tm-fg-6);background:transparent;color:var(--tm-fg);cursor:pointer;text-align:left;font:inherit;}.chap.svelte-965svo:hover {background:var(--tm-fg-4);}.chap.cur.svelte-965svo {background:var(--tm-accent-7);}.n.svelte-965svo {width:30px;flex:none;font:500 11px ui-monospace, Menlo, monospace;color:var(--tm-muted);}.title.svelte-965svo {flex:1;font-size:13px;min-width:0;}.cur.svelte-965svo .title:where(.svelte-965svo) {color:var(--tm-accent);}.done.svelte-965svo .title:where(.svelte-965svo) {color:var(--tm-muted);}.state.svelte-965svo {font-size:11px;color:var(--tm-muted);flex:none;}"
};
function _c(e, t) {
	We(t, !0), ei(e, gc);
	let n = Mi(t, "store", 7), r = /* @__PURE__ */ A(() => n().book), i = /* @__PURE__ */ A(() => H(r) ? n().progressOf(H(r).id) : 0), a = /* @__PURE__ */ A(() => H(r) ? n().speedFor(H(r).id) : 1), o = /* @__PURE__ */ A(() => H(r) ? Math.max(0, oa(H(r).chapters, H(i))) : 0), s = /* @__PURE__ */ A(() => !!H(r) && n().isPlaying(H(r).id)), c = /* @__PURE__ */ A(() => H(r) ? n().bookmarks[H(r).id] ?? [] : []), l = /* @__PURE__ */ A(() => n().bookBrowse.ids.map((e) => n().items[e]).filter(Boolean).map((e) => ({
		key: e.id,
		title: e.title,
		sub: e.sub,
		hue: e.hue,
		mark: e.mark,
		art: e.art
	}))), u = /* @__PURE__ */ A(() => n().libraryBooks.filter((e) => !n().played[e.id] && n().progressOf(e.id) > 5).concat(n().item?.type === "book" && !n().libraryBooks.some((e) => e.id === n().now) && n().pos > 5 ? [n().item] : [])), d = /* @__PURE__ */ A(() => Object.values(n().saved).filter((e) => !H(u).some((t) => t.id === e.id)).map((e) => n().items[e.id] ?? e)), f = /* @__PURE__ */ A(() => !!H(r) && !!n().played[H(r).id]), p = /* @__PURE__ */ A(() => H(r) && H(r).chapters.length ? Math.max(0, H(r).chapters[H(o)].start + b(H(o)) - H(i)) : 0), m = /* @__PURE__ */ M(!1), h = /* @__PURE__ */ M(""), g = /* @__PURE__ */ M(!1), _ = /* @__PURE__ */ M(null), v = /* @__PURE__ */ M(""), y = /* @__PURE__ */ A(() => H(r) ? H(r).chapters.map((e, t) => ({
		c: e,
		i: t
	})).filter(({ c: e, i: t }) => (!H(m) || t >= H(o)) && (!H(h).trim() || e.title.toLowerCase().includes(H(h).trim().toLowerCase()))) : []);
	function b(e) {
		return H(r) ? H(r).chapters[e].dur || (H(r).chapters[e + 1]?.start ?? H(r).dur) - H(r).chapters[e].start : 0;
	}
	_n(() => {
		!n().bookId && n().bookBrowse.status === "idle" && n().loadBookBrowse();
	});
	function x(e) {
		H(r) && n().jumpTo(H(r).id, e);
	}
	var S = Mr(), C = I(S), w = (e) => {
		var t = ec(), r = R(I(t), 4), i = (e) => {
			var t = Qs();
			J(t, 21, () => [...H(u), ...H(d)], (e) => e.id, (e, t) => {
				let r = /* @__PURE__ */ A(() => n().durOf(H(t).id) ? Math.round(n().progressOf(H(t).id) / n().durOf(H(t).id) * 100) : 0);
				var i = Zs(), a = F(i);
				$(F(a), {
					get hue() {
						return H(t).hue;
					},
					get art() {
						return H(t).art;
					},
					fill: !0,
					radius: 0,
					get mark() {
						return H(t).mark;
					},
					font: 12
				}), O(a);
				var o = R(a, 2), s = F(o), c = L(s, !0), l = R(s), u = L(l, !0), d = R(l, 2), f = (e) => {
					var t = Xs(), n = F(t);
					let i;
					O(t), z(() => i = ci(n, "", i, { width: `${H(r) ?? ""}%` })), G(e, t);
				};
				q(d, (e) => {
					H(r) > 0 && e(f);
				}), O(o), O(i), z((e) => {
					K(c, H(t).title), K(u, e);
				}, [() => H(r) > 0 ? `${H(r)}% · ${n().leftOf(H(t).id)}` : "Saved"]), U("click", i, () => n().openBook(H(t).id)), G(e, i);
			}), O(t), G(e, t);
		};
		q(r, (e) => {
			(H(u).length || H(d).length) && e(i);
		});
		var a = R(r, 2);
		Es(a, {
			get cards() {
				return H(l);
			},
			tall: !0,
			open: (e) => n().openBook(e)
		});
		var o = R(a, 2);
		_o(o, {
			get status() {
				return n().bookBrowse.status;
			},
			retry: () => n().loadBookBrowse()
		});
		var s = R(o, 2), c = (e) => {
			var t = $s();
			U("click", t, () => n().loadBookBrowse(!0)), G(e, t);
		};
		q(s, (e) => {
			n().bookBrowse.cursor && n().bookBrowse.status === "ready" && e(c);
		}), G(e, t);
	}, ee = (e) => {
		var t = hc(), l = I(t), u = R(l, 2), d = (e) => {
			var t = mc(), l = I(t), u = F(l);
			$(F(u), {
				get hue() {
					return H(r).hue;
				},
				get art() {
					return H(r).art;
				},
				fill: !0,
				radius: 0,
				get mark() {
					return H(r).mark;
				},
				font: 22
			}), O(u);
			var d = R(u, 2), S = R(F(d), 2), C = L(S, !0), w = R(S, 2), ee = L(w, !0), T = R(w, 2), te = (e) => {
				var t = tc(), n = F(t), o = F(n);
				let s;
				O(n);
				var c = L(R(n), !0);
				O(t), z((e, t) => {
					s = ci(o, "", s, { width: e }), K(c, t);
				}, [() => `${H(f) ? 100 : Math.round(H(i) / H(r).dur * 100)}%`, () => H(f) ? "Finished" : `${na((H(r).dur - H(i)) / H(a))} left at ${H(a).toFixed(1)}×`]), G(e, t);
			};
			q(T, (e) => {
				H(r).dur && e(te);
			});
			var ne = R(T, 2), re = (e) => {
				var t = nc(), n = L(t);
				z((e, t) => K(n, `Chapter ${e ?? ""} of ${H(r).chapters.length ?? ""} · ${t ?? ""} left in this chapter`), [() => Ri(H(o)), () => na(H(p) / H(a))]), G(e, t);
			};
			q(ne, (e) => {
				H(r).chapters.length && H(i) > 5 && !H(f) && e(re);
			});
			var ie = R(ne, 2), ae = F(ie), oe = F(ae);
			{
				let e = /* @__PURE__ */ A(() => H(s) ? Z.pause : Z.play);
				Q(oe, {
					get d() {
						return H(e);
					},
					size: 12
				});
			}
			var se = R(oe, 1, !0);
			O(ae);
			var ce = R(ae, 2);
			let le;
			var ue = F(ce);
			{
				let e = /* @__PURE__ */ A(() => n().isFavorite(H(r).id) ? 0 : 1.8);
				Q(ue, {
					get d() {
						return Z.heart;
					},
					size: 12,
					get stroke() {
						return H(e);
					}
				});
			}
			var de = R(ue, 1, !0);
			O(ce);
			var fe = R(ce, 2), pe = R(fe, 2), me = F(pe), he = R(me, 2), ge = (e) => {
				var t = rc(), i = F(t), a = F(i);
				Q(a, {
					get d() {
						return Z.check;
					},
					size: 12,
					stroke: 2
				});
				var o = R(a, 1, !0);
				O(i);
				var s = R(i, 2);
				Q(F(s), {
					get d() {
						return Z.prev;
					},
					size: 12
				}), k(), O(s), O(t), z(() => K(o, H(f) ? "Mark as not finished" : "Mark as finished")), U("click", i, () => {
					n().pop = null, n().markBook(H(r).id, !H(f));
				}), U("click", s, () => {
					n().pop = null, n().restartBook(H(r).id);
				}), G(e, t);
			};
			q(he, (e) => {
				n().pop === "epmenu" && e(ge);
			}), O(pe), O(ie), O(d), O(l);
			var _e = R(l, 2), ve = (e) => {
				var t = ac(), n = I(t);
				let i;
				var a = L(n, !0), o = R(n, 2), s = (e) => {
					var t = ic(), n = L(t, !0);
					z(() => K(n, H(g) ? "Less" : "More")), U("click", t, () => N(g, !H(g))), G(e, t);
				};
				q(o, (e) => {
					H(r).desc.length > 220 && e(s);
				}), z(() => {
					i = Y(n, 1, "desc svelte-965svo", null, i, { open: H(g) }), K(a, H(r).desc);
				}), G(e, t);
			};
			q(_e, (e) => {
				H(r).desc && e(ve);
			});
			var ye = R(_e, 2), be = (e) => {
				var t = uc();
				J(R(I(t), 2), 17, () => H(c), (e) => e.at, (e, t) => {
					var i = lc(), a = F(i), o = F(a), s = F(o, !0), c = L(R(s), !0);
					O(o);
					var l = R(o, 2), u = (e) => {
						var i = oc(), a = F(i);
						bi(a), ti(a, (e) => Za?.(e)), bn(() => Ei(a, () => H(v), (e) => N(v, e))), k(2), O(i), z(() => X(a, "aria-label", `Note for ${H(t).label ?? ""}`)), br("submit", i, (e) => {
							e.preventDefault(), n().setBookmarkNote(H(r).id, H(t).at, H(v)), N(_, null);
						}), U("keydown", a, (e) => {
							e.key === "Escape" && (e.stopPropagation(), N(_, null));
						}), G(e, i);
					}, d = (e) => {
						var n = sc(), r = L(n, !0);
						z(() => K(r, H(t).note)), U("click", n, () => {
							N(_, H(t).at, !0), N(v, H(t).note ?? "", !0);
						}), G(e, n);
					}, f = (e) => {
						var n = cc();
						U("click", n, () => {
							N(_, H(t).at, !0), N(v, "");
						}), G(e, n);
					};
					q(l, (e) => {
						H(_) === H(t).at ? e(u) : H(t).note ? e(d, 1) : e(f, -1);
					}), O(a);
					var p = R(a, 2);
					Q(F(p), {
						get d() {
							return Z.close;
						},
						size: 12,
						stroke: 2
					}), O(p), O(i), z((e) => {
						K(s, H(t).label), K(c, e), X(p, "aria-label", `Remove bookmark ${H(t).label ?? ""}`);
					}, [() => new Date(H(t).at).toLocaleDateString()]), U("click", o, () => x(H(t).pos)), U("click", p, () => n().removeBookmark(H(r).id, H(t).at)), G(e, i);
				}), G(e, t);
			};
			q(ye, (e) => {
				H(c).length && e(be);
			});
			var xe = R(ye, 2), E = R(F(xe), 4), Se = (e) => {
				var t = dc(), n = F(t);
				Q(n, {
					get d() {
						return Z.search;
					},
					size: 12,
					stroke: 2
				});
				var r = R(n);
				bi(r), O(t), Ei(r, () => H(h), (e) => N(h, e)), G(e, t);
			};
			q(E, (e) => {
				H(r).chapters.length > 12 && e(Se);
			});
			var D = R(E, 2), Ce = (e) => {
				var t = fc(), n = F(t);
				bi(n), k(), O(t), Di(n, () => H(m), (e) => N(m, e)), G(e, t);
			};
			q(D, (e) => {
				H(o) > 0 && e(Ce);
			}), O(xe), J(R(xe, 2), 17, () => H(y), ({ c: e, i: t }) => t, (e, t) => {
				let n = () => H(t).c, r = () => H(t).i;
				var a = pc();
				let s;
				var c = F(a), l = L(c, !0), u = R(c, 2), d = L(u, !0), f = L(R(u, 2), !0);
				O(a), z((e, t) => {
					s = Y(a, 1, "chap svelte-965svo", null, s, {
						cur: r() === H(o) && H(i) > 0,
						done: r() < H(o)
					}), K(l, e), K(d, n().title), K(f, t);
				}, [() => Ri(r()), () => r() < H(o) ? "Finished" : r() === H(o) && H(i) > 0 && b(r()) ? `${Math.min(100, Math.round((H(i) - n().start) / b(r()) * 100))}%` : b(r()) ? na(b(r())) : ""]), U("click", a, () => x(n().start)), G(e, a);
			}), z((e, t, a, o) => {
				K(C, H(r).title), K(ee, H(r).sub), ae.disabled = !H(r).chapters.length, K(se, e), le = Y(ce, 1, "ghost svelte-965svo", null, le, { saved: t }), X(ce, "aria-pressed", a), K(de, o), fe.disabled = H(i) <= 0, X(me, "aria-expanded", n().pop === "epmenu");
			}, [
				() => H(s) ? "Pause" : H(i) > 5 ? `Resume chapter ${Ri(H(o))}` : "Start listening",
				() => n().isFavorite(H(r).id),
				() => n().isFavorite(H(r).id),
				() => n().isFavorite(H(r).id) ? "In My Media" : "Save to My Media"
			]), U("click", ae, () => n().play(H(r).id)), U("click", ce, () => n().toggleFavorite(H(r).id)), U("click", fe, () => n().bookmark()), U("click", me, () => n().togglePop("epmenu")), G(e, t);
		};
		q(u, (e) => {
			H(r) && e(d);
		});
		var S = R(u, 2), C = (e) => {
			{
				let t = /* @__PURE__ */ A(() => n().bookStatus[n().bookId] ?? "loading");
				_o(e, {
					get status() {
						return H(t);
					},
					retry: () => n().bookId && n().ensureBook(n().bookId),
					empty: "This audiobook has no playable chapters yet."
				});
			}
		};
		q(S, (e) => {
			H(r)?.chapters.length || e(C);
		}), U("click", l, () => n().bookId = null), G(e, t);
	};
	q(C, (e) => {
		n().bookId ? e(ee, -1) : e(w);
	}), G(e, S), Ge();
}
xr(["click", "keydown"]);
//#endregion
//#region src/components/SearchView.svelte
var vc = /* @__PURE__ */ W("<div class=\"srow svelte-1occquv\"><button class=\"row svelte-1occquv\"><!> <span class=\"text svelte-1occquv\"><span class=\"title svelte-1occquv\"> </span><span class=\"meta svelte-1occquv\"> </span></span> <span class=\"act svelte-1occquv\"><!> </span></button> <span class=\"sfav svelte-1occquv\"><!></span></div>"), yc = /* @__PURE__ */ W("<button class=\"more svelte-1occquv\">More stations</button>"), bc = /* @__PURE__ */ W("<h2 class=\"svelte-1occquv\">Shows and books</h2>"), xc = /* @__PURE__ */ W("<h2 class=\"svelte-1occquv\"> </h2> <div class=\"list svelte-1occquv\"></div> <!> <!> <!>", 1), Sc = /* @__PURE__ */ W("<button class=\"row svelte-1occquv\"><!> <span class=\"text svelte-1occquv\"><span class=\"title svelte-1occquv\"> </span><span class=\"meta svelte-1occquv\"> </span></span> <span class=\"act svelte-1occquv\"> </span></button>"), Cc = /* @__PURE__ */ W("<h1 class=\"h1 svelte-1occquv\"> </h1> <!> <div class=\"list svelte-1occquv\"></div> <!>", 1), wc = {
	hash: "svelte-1occquv",
	code: ".h1.svelte-1occquv {font-size:22px;font-weight:650;letter-spacing:-.4px;margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.list.svelte-1occquv {margin-top:14px;}.row.svelte-1occquv {display:flex;align-items:center;gap:14px;width:100%;padding:10px 8px;border:0;border-radius:10px;background:none;color:inherit;text-align:left;cursor:pointer;font:inherit;}.row.svelte-1occquv:hover {background:var(--tm-fg-5);}.srow.svelte-1occquv {display:flex;align-items:center;}.srow.svelte-1occquv .row:where(.svelte-1occquv) {flex:1;min-width:0;}.sfav.svelte-1occquv {flex:none;margin-left:4px;}.text.svelte-1occquv {flex:1;min-width:0;display:flex;flex-direction:column;}.title.svelte-1occquv {font-size:13px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.meta.svelte-1occquv {font-size:11.5px;color:var(--tm-muted);margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.act.svelte-1occquv {font-size:11.5px;color:var(--tm-accent);flex:none;display:flex;align-items:center;gap:5px;}h2.svelte-1occquv {font-size:13px;font-weight:650;margin:18px 0 0;color:var(--tm-muted);}.more.svelte-1occquv {display:block;margin:10px auto 4px;height:30px;padding:0 16px;border-radius:15px;border:1px solid var(--tm-fg-14);background:transparent;color:var(--tm-fg);font-size:12px;cursor:pointer;}"
};
function Tc(e, t) {
	We(t, !0), ei(e, wc);
	let n = {
		station: "Radio",
		podcast: "Podcast",
		audiobook: "Audiobook"
	}, r = {
		station: "Play",
		podcast: "Open",
		audiobook: "Open"
	}, i = /* @__PURE__ */ A(() => t.store.stationHits.ids.map((e) => t.store.items[e]).filter((e) => e?.type === "radio")), a = /* @__PURE__ */ A(() => t.store.stationHits.status !== "idle"), o = /* @__PURE__ */ A(() => t.store.search.status === "ready" && !t.store.search.hits.length && (!H(a) || t.store.stationHits.status === "ready" && !H(i).length));
	var s = Cc(), c = I(s), l = L(c), u = R(c, 2), d = (e) => {
		var n = xc(), r = I(n), a = L(r), o = R(r, 2);
		J(o, 21, () => H(i), (e) => e.id, (e, n) => {
			let r = /* @__PURE__ */ A(() => t.store.isPlaying(H(n).id));
			var i = vc(), a = F(i), o = F(a);
			$(o, {
				get hue() {
					return H(n).hue;
				},
				get art() {
					return H(n).art;
				},
				get mark() {
					return H(n).mark;
				},
				size: 44
			});
			var s = R(o, 2), c = F(s), l = L(c, !0), u = L(R(c), !0);
			O(s);
			var d = R(s, 2), f = F(d);
			{
				let e = /* @__PURE__ */ A(() => H(r) ? Z.stop : Z.play);
				Q(f, {
					get d() {
						return H(e);
					},
					size: 12
				});
			}
			var p = R(f, 1, !0);
			O(d), O(a);
			var m = R(a, 2);
			Oo(F(m), {
				get store() {
					return t.store;
				},
				get id() {
					return H(n).id;
				},
				size: 14
			}), O(m), O(i), z(() => {
				K(l, H(n).title), K(u, H(n).sub), K(p, H(r) ? "Stop" : "Play");
			}), U("click", a, () => H(r) ? t.store.stop() : t.store.play(H(n).id)), G(e, i);
		}), O(o);
		var s = R(o, 2), c = (e) => {
			var n = yc();
			U("click", n, () => t.store.loadStationHits(t.store.search.q, !0)), G(e, n);
		};
		q(s, (e) => {
			t.store.stationHits.more && t.store.stationHits.status === "ready" && e(c);
		});
		var l = R(s, 2), u = (e) => {
			_o(e, {
				get status() {
					return t.store.stationHits.status;
				},
				retry: () => t.store.loadStationHits(t.store.search.q, H(i).length > 0)
			});
		};
		q(l, (e) => {
			(t.store.stationHits.status === "loading" || t.store.stationHits.status === "error") && e(u);
		});
		var d = R(l, 2), f = (e) => {
			G(e, bc());
		};
		q(d, (e) => {
			t.store.search.hits.length && e(f);
		}), z((e) => K(a, `Stations${e ?? ""}`), [() => t.store.stationHits.total ? ` · ${t.store.stationHits.total.toLocaleString()}` : ""]), G(e, n);
	};
	q(u, (e) => {
		H(a) && e(d);
	});
	var f = R(u, 2);
	J(f, 21, () => t.store.search.hits, (e) => e.kind + e.id, (e, i) => {
		var a = Sc(), o = F(a);
		{
			let e = /* @__PURE__ */ A(() => zi(H(i).slug || H(i).id)), t = /* @__PURE__ */ A(() => Bi(H(i).title));
			$(o, {
				get hue() {
					return H(e);
				},
				get art() {
					return H(i).art;
				},
				get mark() {
					return H(t);
				},
				size: 44
			});
		}
		var s = R(o, 2), c = F(s), l = L(c, !0), u = L(R(c));
		O(s);
		var d = L(R(s, 2), !0);
		O(a), z(() => {
			K(l, H(i).title), K(u, `${n[H(i).kind] ?? ""}${H(i).subtitle ? ` · ${H(i).subtitle}` : ""}`), K(d, r[H(i).kind]);
		}), U("click", a, () => t.store.openHit(H(i))), G(e, a);
	}), O(f);
	var p = R(f, 2);
	{
		let e = /* @__PURE__ */ A(() => t.store.search.status === "idle" ? "loading" : t.store.search.status), n = /* @__PURE__ */ A(() => H(o) ? "Nothing matches. Try a station, show, book or author." : "");
		_o(p, {
			get status() {
				return H(e);
			},
			retry: () => t.store.setQuery(t.store.query),
			get empty() {
				return H(n);
			}
		});
	}
	z((e) => K(l, `Results for “${e ?? ""}”`), [() => t.store.query.trim()]), G(e, s), Ge();
}
xr(["click"]);
//#endregion
//#region src/components/NowPlaying.svelte
var Ec = /* @__PURE__ */ W("<div class=\"blank svelte-1b7bd5u\"></div>"), Dc = /* @__PURE__ */ W("<span class=\"kind svelte-1b7bd5u\"> </span>"), Oc = /* @__PURE__ */ W("<div class=\"prog svelte-1b7bd5u\" aria-label=\"Progress\"><span class=\"bar svelte-1b7bd5u\"><span class=\"svelte-1b7bd5u\"></span></span> <span class=\"pct svelte-1b7bd5u\"> </span></div>"), kc = /* @__PURE__ */ W("<span class=\"badge svelte-1b7bd5u\"> </span>"), Ac = /* @__PURE__ */ W("<button role=\"tab\"> <!></button>"), jc = /* @__PURE__ */ W("<div class=\"tabs svelte-1b7bd5u\" role=\"tablist\"></div>"), Mc = /* @__PURE__ */ W("<button class=\"q svelte-1b7bd5u\"><!> <span class=\"qtext svelte-1b7bd5u\"><span class=\"qtitle svelte-1b7bd5u\"> </span><span class=\"qmeta svelte-1b7bd5u\"> </span></span></button>"), Nc = /* @__PURE__ */ W("<h3 class=\"svelte-1b7bd5u\">Continue listening</h3> <!>", 1), Pc = /* @__PURE__ */ W("<div class=\"empty svelte-1b7bd5u\">Choose a station, an episode or a book. What you are listening to shows here.</div> <!>", 1), Fc = /* @__PURE__ */ W("<span class=\"ontext svelte-1b7bd5u\"><span class=\"qtitle svelte-1b7bd5u\"> </span><span class=\"qmeta svelte-1b7bd5u\"> </span></span>"), Ic = /* @__PURE__ */ W("<span class=\"ontext svelte-1b7bd5u\"><span class=\"qtitle svelte-1b7bd5u\"> </span><span class=\"qmeta svelte-1b7bd5u\">This station does not publish song titles right now.</span></span>"), Lc = /* @__PURE__ */ W("<dt class=\"svelte-1b7bd5u\">From</dt><dd class=\"svelte-1b7bd5u\"> </dd>", 1), Rc = /* @__PURE__ */ W("<div class=\"q track svelte-1b7bd5u\"><!> <span class=\"qtext svelte-1b7bd5u\"><span class=\"qtitle svelte-1b7bd5u\"> </span><span class=\"qmeta svelte-1b7bd5u\"> </span></span></div>"), zc = /* @__PURE__ */ W("<h3 class=\"svelte-1b7bd5u\">Recently played</h3> <!>", 1), Bc = /* @__PURE__ */ W("<div class=\"onair svelte-1b7bd5u\"><span class=\"dot svelte-1b7bd5u\" aria-hidden=\"true\"></span> <!></div> <h3 class=\"svelte-1b7bd5u\">Station</h3> <dl class=\"facts svelte-1b7bd5u\"><dt class=\"svelte-1b7bd5u\">Genre</dt><dd class=\"svelte-1b7bd5u\"> </dd> <!></dl> <!>", 1), Vc = /* @__PURE__ */ W("<form class=\"plform svelte-1b7bd5u\"><input maxlength=\"80\" placeholder=\"Playlist name\" aria-label=\"Playlist name\" class=\"svelte-1b7bd5u\"/> <button type=\"submit\" class=\"svelte-1b7bd5u\">Save</button></form>"), Hc = /* @__PURE__ */ W("<div class=\"qbar svelte-1b7bd5u\"><button class=\"svelte-1b7bd5u\"><!>Shuffle</button> <button class=\"svelte-1b7bd5u\"><!>Save as playlist</button> <button class=\"svelte-1b7bd5u\"><!>Clear</button></div> <!>", 1), Uc = /* @__PURE__ */ W("<div role=\"listitem\" draggable=\"true\"><span class=\"grip svelte-1b7bd5u\" aria-hidden=\"true\"><!></span> <!> <button class=\"qtext svelte-1b7bd5u\"><span class=\"qtitle svelte-1b7bd5u\"> </span><span class=\"qmeta svelte-1b7bd5u\"> </span></button> <span class=\"moves svelte-1b7bd5u\"><button class=\"mv svelte-1b7bd5u\"><!></button> <button class=\"mv svelte-1b7bd5u\"><!></button></span> <button class=\"rm svelte-1b7bd5u\"><!></button></div>"), Wc = /* @__PURE__ */ W("<div class=\"empty svelte-1b7bd5u\">Queue is empty. Use Play next or Queue on any episode.</div>"), Gc = /* @__PURE__ */ W("<!> <!>", 1), Kc = /* @__PURE__ */ W("<button><span class=\"t svelte-1b7bd5u\"> </span> <span class=\"ctitle svelte-1b7bd5u\"> </span> <span class=\"cstate svelte-1b7bd5u\"> </span></button>"), qc = /* @__PURE__ */ W("<div class=\"empty svelte-1b7bd5u\"> </div>"), Jc = /* @__PURE__ */ W("<div class=\"q svelte-1b7bd5u\"><button class=\"qtext svelte-1b7bd5u\"><span class=\"qtitle svelte-1b7bd5u\"> </span><span class=\"qmeta svelte-1b7bd5u\"> </span></button> <button class=\"rm svelte-1b7bd5u\"><!></button></div>"), Yc = /* @__PURE__ */ W("<div class=\"empty svelte-1b7bd5u\">No bookmarks yet. Your place is saved automatically; bookmarks keep moments you want to return to.</div>"), Xc = /* @__PURE__ */ W("<button class=\"add svelte-1b7bd5u\"><!>Bookmark this moment</button> <!>", 1), Zc = /* @__PURE__ */ W("<dt class=\"svelte-1b7bd5u\">Length</dt><dd class=\"svelte-1b7bd5u\"> </dd>", 1), Qc = /* @__PURE__ */ W("<dt class=\"svelte-1b7bd5u\">Chapters</dt><dd class=\"svelte-1b7bd5u\"> </dd>", 1), $c = /* @__PURE__ */ W("<dl class=\"facts svelte-1b7bd5u\"><dt class=\"svelte-1b7bd5u\">Author</dt><dd class=\"svelte-1b7bd5u\"> </dd> <!> <!> <dt class=\"svelte-1b7bd5u\">Narration</dt><dd class=\"svelte-1b7bd5u\">LibriVox volunteers</dd></dl>"), el = /* @__PURE__ */ W("<dt class=\"svelte-1b7bd5u\">Published</dt><dd class=\"svelte-1b7bd5u\"> </dd>", 1), tl = /* @__PURE__ */ W("<dl class=\"facts svelte-1b7bd5u\"><dt class=\"svelte-1b7bd5u\">Show</dt><dd class=\"svelte-1b7bd5u\"><button class=\"link svelte-1b7bd5u\"> </button></dd> <!> <!></dl>"), nl = /* @__PURE__ */ W("<p class=\"desc svelte-1b7bd5u\"> </p>"), rl = /* @__PURE__ */ W("<!> <!> <!>", 1), il = /* @__PURE__ */ W("<button><span class=\"who svelte-1b7bd5u\"> </span> </button>"), al = /* @__PURE__ */ W("<div></div>"), ol = /* @__PURE__ */ W("<aside class=\"aside svelte-1b7bd5u\" aria-label=\"Now playing\"><div class=\"top svelte-1b7bd5u\"><div><!> <!></div> <div class=\"trow svelte-1b7bd5u\"><div class=\"ttext svelte-1b7bd5u\"><div class=\"title svelte-1b7bd5u\"> </div><div class=\"sub svelte-1b7bd5u\"> </div></div> <!></div> <!></div> <!> <div class=\"body svelte-1b7bd5u\" role=\"tabpanel\"><!></div></aside>"), sl = {
	hash: "svelte-1b7bd5u",
	code: ".aside.svelte-1b7bd5u {width:300px;flex:none;background:var(--tm-panel-surface);display:flex;flex-direction:column;min-height:0;}.top.svelte-1b7bd5u {padding:20px 20px 14px;}.art.svelte-1b7bd5u {width:100%;aspect-ratio:1.45;border-radius:14px;position:relative;overflow:hidden;display:flex;box-shadow:0 14px 36px rgba(0, 0, 0, .35);}.blank.svelte-1b7bd5u {flex:1;background:var(--tm-fg-6);}.kind.svelte-1b7bd5u {position:absolute;left:12px;top:12px;font-size:9.5px;font-weight:700;letter-spacing:.8px;padding:3px 8px;border-radius:20px;background:rgba(0, 0, 0, .45);color:#fff;}.trow.svelte-1b7bd5u {display:flex;align-items:flex-start;gap:6px;}.ttext.svelte-1b7bd5u {flex:1;min-width:0;}.trow.svelte-1b7bd5u .fav {margin-top:10px;}.title.svelte-1b7bd5u {font-size:15px;font-weight:650;margin-top:14px;line-height:1.3;text-wrap:pretty;display:-webkit-box;-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}.sub.svelte-1b7bd5u {font-size:12px;color:var(--tm-muted);margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.tabs.svelte-1b7bd5u {display:flex;gap:0;padding:0 10px;border-bottom:1px solid var(--tm-fg-7);overflow-x:auto;scrollbar-width:none;}.tabs.svelte-1b7bd5u button:where(.svelte-1b7bd5u) {flex:none;display:flex;align-items:center;gap:4px;height:34px;padding:0 5px;border:0;background:none;color:var(--tm-muted);font-size:11px;font-weight:600;white-space:nowrap;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;}.badge.svelte-1b7bd5u {font-size:9.5px;min-width:15px;height:15px;padding:0 4px;border-radius:8px;display:grid;place-items:center;background:var(--tm-fg-10);color:var(--tm-fg);}.tabs.svelte-1b7bd5u button.on:where(.svelte-1b7bd5u) {color:var(--tm-fg);border-bottom-color:var(--tm-accent);}.body.svelte-1b7bd5u {flex:1;min-height:0;overflow:auto;padding:8px 12px 12px;}.q.svelte-1b7bd5u {display:flex;align-items:center;gap:10px;padding:7px 8px;border-radius:9px;}.q.svelte-1b7bd5u:hover {background:var(--tm-fg-5);}.qtext.svelte-1b7bd5u {flex:1;min-width:0;display:flex;flex-direction:column;border:0;padding:0;background:none;color:inherit;text-align:left;cursor:pointer;font:inherit;}.track.svelte-1b7bd5u .qtext:where(.svelte-1b7bd5u) {cursor:default;}.qtitle.svelte-1b7bd5u {font-size:12px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.qmeta.svelte-1b7bd5u {font-size:11px;color:var(--tm-muted);margin-top:2px;}.qbar.svelte-1b7bd5u {display:flex;gap:4px;padding:2px 0 8px;}.qbar.svelte-1b7bd5u button:where(.svelte-1b7bd5u) {display:flex;align-items:center;gap:5px;height:26px;padding:0 8px;border:0;border-radius:7px;background:var(--tm-fg-6);color:var(--tm-fg);font-size:11px;cursor:pointer;}.qbar.svelte-1b7bd5u button:where(.svelte-1b7bd5u):hover:not(:disabled) {background:var(--tm-fg-10);}.qbar.svelte-1b7bd5u button:where(.svelte-1b7bd5u):disabled {opacity:.4;cursor:default;}.plform.svelte-1b7bd5u {display:flex;gap:6px;padding:0 0 8px;}.plform.svelte-1b7bd5u input:where(.svelte-1b7bd5u) {flex:1;min-width:0;height:28px;padding:0 8px;border-radius:7px;border:1px solid var(--tm-fg-14);background:var(--tm-fg-4);color:var(--tm-fg);font:inherit;font-size:12px;outline:none;}.plform.svelte-1b7bd5u input:where(.svelte-1b7bd5u):focus {border-color:var(--tm-accent);}.plform.svelte-1b7bd5u button:where(.svelte-1b7bd5u) {height:28px;padding:0 12px;border:0;border-radius:7px;background:var(--tm-accent);color:var(--tm-on-accent);font-size:11.5px;font-weight:650;cursor:pointer;}.drag.svelte-1b7bd5u {cursor:grab;}.drag.dragging.svelte-1b7bd5u {opacity:.4;}.drag.over.svelte-1b7bd5u {box-shadow:inset 0 2px 0 var(--tm-accent);}.grip.svelte-1b7bd5u {color:var(--tm-muted);opacity:.5;display:grid;flex:none;margin-right:-4px;}.moves.svelte-1b7bd5u {display:flex;flex-direction:column;opacity:0;flex:none;}.q.svelte-1b7bd5u:hover .moves:where(.svelte-1b7bd5u), .moves.svelte-1b7bd5u:focus-within {opacity:1;}.mv.svelte-1b7bd5u {width:20px;height:14px;border:0;padding:0;background:none;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;}.mv.svelte-1b7bd5u:hover:not(:disabled) {color:var(--tm-fg);}.mv.svelte-1b7bd5u:disabled {opacity:.3;cursor:default;}.rm.svelte-1b7bd5u {width:24px;height:24px;border:0;background:none;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;flex:none;border-radius:6px;}.rm.svelte-1b7bd5u:hover {color:var(--tm-fg);background:var(--tm-fg-8);}.empty.svelte-1b7bd5u {padding:24px 8px;font-size:12px;color:var(--tm-muted);text-align:center;}.art.book.svelte-1b7bd5u {aspect-ratio:0.8;width:62%;margin:0 auto;border-radius:6px 12px 12px 6px;}.prog.svelte-1b7bd5u {display:flex;align-items:center;gap:10px;margin-top:10px;}.bar.svelte-1b7bd5u {flex:1;height:4px;border-radius:2px;background:var(--tm-fg-10);display:block;}.bar.svelte-1b7bd5u span:where(.svelte-1b7bd5u) {display:block;height:4px;border-radius:2px;background:var(--tm-accent);}.pct.svelte-1b7bd5u {font-size:11px;color:var(--tm-muted);flex:none;}h3.svelte-1b7bd5u {font-size:11px;font-weight:650;letter-spacing:.6px;text-transform:uppercase;color:var(--tm-muted);margin:16px 8px 6px;}.onair.svelte-1b7bd5u {display:flex;align-items:center;gap:10px;padding:10px 8px;border-radius:10px;background:var(--tm-accent-8);}.dot.svelte-1b7bd5u {width:8px;height:8px;border-radius:50%;background:var(--tm-live);flex:none;box-shadow:0 0 0 3px color-mix(in srgb, var(--tm-live) 25%, transparent);}.ontext.svelte-1b7bd5u {min-width:0;display:flex;flex-direction:column;}.facts.svelte-1b7bd5u {display:grid;grid-template-columns:auto 1fr;gap:6px 12px;margin:8px 8px 0;font-size:12px;}.facts.svelte-1b7bd5u dt:where(.svelte-1b7bd5u) {color:var(--tm-muted);}.facts.svelte-1b7bd5u dd:where(.svelte-1b7bd5u) {margin:0;min-width:0;overflow:hidden;text-overflow:ellipsis;}.link.svelte-1b7bd5u {border:0;padding:0;background:none;color:var(--tm-accent);font:inherit;cursor:pointer;text-align:left;}.desc.svelte-1b7bd5u {font-size:12px;line-height:1.55;color:var(--tm-muted);margin:12px 8px 0;white-space:pre-line;}.add.svelte-1b7bd5u {display:flex;align-items:center;justify-content:center;gap:6px;width:100%;height:32px;margin:4px 0 8px;border:1px dashed var(--tm-fg-16);border-radius:9px;background:none;color:var(--tm-fg);font:inherit;font-size:12px;cursor:pointer;}.add.svelte-1b7bd5u:hover {background:var(--tm-fg-5);}button.q.svelte-1b7bd5u {width:100%;border:0;background:none;color:inherit;cursor:pointer;text-align:left;font:inherit;}.q.svelte-1b7bd5u .qtext:where(.svelte-1b7bd5u) {display:flex;flex-direction:column;}.ctitle.svelte-1b7bd5u {flex:1;min-width:0;}.cstate.svelte-1b7bd5u {font-size:11px;color:var(--tm-muted);flex:none;}.chap.done.svelte-1b7bd5u .ctitle:where(.svelte-1b7bd5u) {color:var(--tm-muted);}.chap.svelte-1b7bd5u {display:flex;gap:10px;width:100%;padding:8px;border:0;border-radius:8px;background:transparent;color:var(--tm-fg);cursor:pointer;text-align:left;font:inherit;font-size:12.5px;}.chap.svelte-1b7bd5u:hover {background:var(--tm-fg-5);}.chap.cur.svelte-1b7bd5u {background:var(--tm-accent-8);color:var(--tm-accent);}.t.svelte-1b7bd5u {font:500 11px ui-monospace, Menlo, monospace;color:var(--tm-muted);width:52px;flex:none;padding-top:1px;}.line.svelte-1b7bd5u {display:block;width:100%;padding:7px 8px;border:0;border-radius:8px;background:transparent;cursor:pointer;text-align:left;font:inherit;font-size:13px;line-height:1.5;color:var(--tm-fg-45);}.line.svelte-1b7bd5u:hover {background:var(--tm-fg-4);}.line.cur.svelte-1b7bd5u {color:var(--tm-fg);background:var(--tm-accent-8);}.who.svelte-1b7bd5u {display:block;font:500 10px ui-monospace, Menlo, monospace;color:var(--tm-muted);margin-bottom:2px;}"
};
function cl(e, t) {
	We(t, !0), ei(e, sl);
	let n = Mi(t, "store", 7), r = /* @__PURE__ */ A(() => n().item), i = /* @__PURE__ */ A(() => n().activeRtab), a = /* @__PURE__ */ A(() => H(r)?.type === "radio" ? n().nowPlaying[H(r).stationId] : void 0), o = /* @__PURE__ */ A(() => H(r)?.type === "book" ? H(r) : null), s = /* @__PURE__ */ A(() => H(o) ? n().bookmarks[H(o).id] ?? [] : []), c = /* @__PURE__ */ A(() => H(r) ? n().durOf(H(r).id) : 0), l = /* @__PURE__ */ A(() => n().continueIds.filter((e) => e !== n().now)), u = {
		onair: "On air",
		queue: "Up next",
		chaps: "Chapters",
		trans: "Transcript",
		marks: "Bookmarks",
		about: "About"
	}, d = (e) => e === "queue" ? n().queue.length : e === "marks" ? H(s).length : 0, f = /* @__PURE__ */ A(() => H(a)?.art || H(r)?.art), p = /* @__PURE__ */ A(() => H(a)?.title || H(r)?.title || "Nothing playing"), m = /* @__PURE__ */ A(() => H(r) ? H(r).type === "radio" ? H(a)?.title ? [H(a).artist, H(r).title].filter(Boolean).join(" · ") : H(r).sub : H(r).type === "book" && H(r).chapters.length > 1 && n().chapIdx >= 0 ? `${H(r).sub} · Chapter ${Ri(n().chapIdx)}` : H(r).sub : "Pick a station, episode or book."), h = /* @__PURE__ */ A(() => n().transcript?.lines ?? []), g = /* @__PURE__ */ M(void 0), _ = /* @__PURE__ */ M(null), v = /* @__PURE__ */ M(!1), y = /* @__PURE__ */ M(""), b = /* @__PURE__ */ M(-1);
	function x(e) {
		H(_) && n().moveQueue(H(_), e), N(_, null), N(b, -1);
	}
	let S = (e) => {
		if (!H(r) || !Fi(H(r))) return 0;
		let t = H(r).chapters[e];
		return t.dur || (H(r).chapters[e + 1]?.start ?? H(c)) - t.start;
	};
	_n(() => {
		H(i) === "trans" && n().transcriptKey && n().loadTranscript();
	}), _n(() => {
		let e = n().lineIdx;
		H(i) !== "trans" || e < 0 || H(g)?.querySelectorAll(".line")[e]?.scrollIntoView({
			block: "nearest",
			behavior: "smooth"
		});
	});
	let C = /* @__PURE__ */ A(() => {
		let e = n().transcript;
		return H(r) ? !e || e.state === "loading" ? "Loading transcript…" : e.state === "queued" || e.state === "running" ? "OndaCast is preparing a transcript. Check back in a few minutes." : e.state === "error" ? "The transcript could not be loaded." : "No transcript for this item yet." : "Nothing is playing.";
	});
	var w = ol(), ee = F(w), T = F(ee);
	let te;
	var ne = F(T), re = (e) => {
		$(e, {
			get hue() {
				return H(r).hue;
			},
			get art() {
				return H(f);
			},
			fill: !0,
			radius: 0,
			get mark() {
				return H(r).mark;
			},
			font: 26
		});
	}, ie = (e) => {
		G(e, Ec());
	};
	q(ne, (e) => {
		H(r) ? e(re) : e(ie, -1);
	});
	var ae = R(ne, 2), oe = (e) => {
		var t = Dc(), r = L(t, !0);
		z(() => K(r, n().kindLabel)), G(e, t);
	};
	q(ae, (e) => {
		H(r) && e(oe);
	}), O(T);
	var se = R(T, 2), ce = F(se), le = F(ce), ue = L(le, !0), de = L(R(le), !0);
	O(ce);
	var fe = R(ce, 2), pe = (e) => {
		Oo(e, {
			get store() {
				return n();
			},
			get id() {
				return H(r).id;
			},
			size: 18
		});
	};
	q(fe, (e) => {
		H(r) && e(pe);
	}), O(se);
	var me = R(se, 2), he = (e) => {
		var t = Oc(), r = F(t), i = F(r);
		let a;
		O(r);
		var o = L(R(r, 2));
		O(t), z((e, t, n) => {
			a = ci(i, "", a, { width: e }), K(o, `${t ?? ""}% · ${n ?? ""} left`);
		}, [
			() => `${Math.min(100, Math.round(n().pos / H(c) * 100))}%`,
			() => Math.min(100, Math.round(n().pos / H(c) * 100)),
			() => na((H(c) - n().pos) / n().speed)
		]), G(e, t);
	}, ge = /* @__PURE__ */ A(() => H(r) && Fi(H(r)) && H(c));
	q(me, (e) => {
		H(ge) && e(he);
	}), O(ee);
	var _e = R(ee, 2), ve = (e) => {
		var t = jc();
		J(t, 20, () => n().rightTabs, (e) => e, (e, t) => {
			var r = Ac();
			let a;
			var o = F(r, !0), s = R(o), c = (e) => {
				var n = kc(), r = L(n, !0);
				z((e) => K(r, e), [() => d(t)]), G(e, n);
			}, l = /* @__PURE__ */ A(() => d(t));
			q(s, (e) => {
				H(l) && e(c);
			}), O(r), z(() => {
				X(r, "aria-selected", H(i) === t), a = Y(r, 1, "svelte-1b7bd5u", null, a, { on: H(i) === t }), K(o, u[t]);
			}), U("click", r, () => n().rtab = t), G(e, r);
		}), O(t), G(e, t);
	};
	q(_e, (e) => {
		H(r) && e(ve);
	});
	var ye = R(_e, 2), be = F(ye), xe = (e) => {
		var t = Pc(), r = R(I(t), 2), i = (e) => {
			var t = Nc();
			J(R(I(t), 2), 16, () => H(l), (e) => e, (e, t) => {
				let r = /* @__PURE__ */ A(() => n().items[t]);
				var i = Mr(), a = I(i), o = (e) => {
					var i = Mc(), a = F(i);
					$(a, {
						get hue() {
							return H(r).hue;
						},
						get art() {
							return H(r).art;
						},
						get mark() {
							return H(r).mark;
						},
						size: 34,
						radius: 7,
						font: 9
					});
					var o = R(a, 2), s = F(o), c = L(s, !0), l = L(R(s));
					O(o), O(i), z((e) => {
						K(c, H(r).title), K(l, `${Pi[H(r).type] ?? ""} · ${e ?? ""}`);
					}, [() => n().leftOf(t)]), U("click", i, () => n().play(t)), G(e, i);
				};
				q(a, (e) => {
					H(r) && e(o);
				}), G(e, i);
			}), G(e, t);
		};
		q(r, (e) => {
			H(l).length && e(i);
		}), G(e, t);
	}, E = (e) => {
		var t = Bc(), n = I(t), i = R(F(n), 2), o = (e) => {
			var t = Fc(), n = F(t), i = L(n, !0), o = L(R(n), !0);
			O(t), z(() => {
				K(i, H(a).title), K(o, H(a).artist || H(r).title);
			}), G(e, t);
		}, s = (e) => {
			var t = Ic(), n = L(F(t), !0);
			k(), O(t), z(() => K(n, H(r).title)), G(e, t);
		};
		q(i, (e) => {
			H(a)?.title ? e(o) : e(s, -1);
		}), O(n);
		var c = R(n, 4), l = R(F(c)), u = L(l, !0), d = R(l, 2), f = (e) => {
			var t = Lc(), n = L(R(I(t)), !0);
			z((e) => K(n, e), [() => H(r).sub.split(" · ")[0]]), G(e, t);
		};
		q(d, (e) => {
			H(r).sub && e(f);
		}), O(c);
		var p = R(c, 2), m = (e) => {
			var t = zc();
			J(R(I(t), 2), 17, () => H(a).recent, Gr, (e, t) => {
				var n = Rc(), i = F(n);
				{
					let e = /* @__PURE__ */ A(() => H(t).title.slice(0, 2).toUpperCase());
					$(i, {
						get hue() {
							return H(r).hue;
						},
						get art() {
							return H(t).art;
						},
						get mark() {
							return H(e);
						},
						size: 34,
						radius: 7,
						font: 9
					});
				}
				var a = R(i, 2), o = F(a), s = L(o, !0), c = L(R(o), !0);
				O(a), O(n), z((e) => {
					K(s, H(t).title), K(c, e);
				}, [() => [H(t).artist, ia(H(t).at)].filter(Boolean).join(" · ")]), G(e, n);
			}), G(e, t);
		};
		q(p, (e) => {
			H(a)?.recent.length && e(m);
		}), z(() => K(u, H(r).genre)), G(e, t);
	}, Se = (e) => {
		var t = Gc(), i = I(t), a = (e) => {
			var t = Hc(), r = I(t), i = F(r);
			Q(F(i), {
				get d() {
					return Z.shuffle;
				},
				size: 12,
				stroke: 1.8
			}), k(), O(i);
			var a = R(i, 2);
			Q(F(a), {
				get d() {
					return Z.list;
				},
				size: 12,
				stroke: 1.8
			}), k(), O(a);
			var o = R(a, 2);
			Q(F(o), {
				get d() {
					return Z.trash;
				},
				size: 12,
				stroke: 1.8
			}), k(), O(o), O(r);
			var s = R(r, 2), c = (e) => {
				var t = Vc(), r = F(t);
				bi(r), ti(r, (e) => Za?.(e)), bn(() => Ei(r, () => H(y), (e) => N(y, e))), k(2), O(t), br("submit", t, (e) => {
					e.preventDefault(), n().saveQueueAsPlaylist(H(y)) && N(v, !1);
				}), U("keydown", r, (e) => {
					e.key === "Escape" && (e.stopPropagation(), N(v, !1));
				}), G(e, t);
			};
			q(s, (e) => {
				H(v) && e(c);
			}), z(() => {
				i.disabled = n().queue.length < 2, X(a, "aria-expanded", H(v)), o.disabled = !n().queue.length;
			}), U("click", i, () => n().shuffleQueue()), U("click", a, () => {
				N(v, !H(v)), N(y, "");
			}), U("click", o, () => n().clearQueue()), G(e, t);
		};
		q(i, (e) => {
			(n().queue.length || H(r) && H(r).type !== "radio") && e(a);
		}), J(R(i, 2), 18, () => n().queue, (e) => e, (e, t, r) => {
			let i = /* @__PURE__ */ A(() => n().items[t]);
			var a = Mr(), o = I(a), s = (e) => {
				var a = Uc();
				let o;
				var s = F(a);
				Q(F(s), {
					get d() {
						return Z.grip;
					},
					size: 14,
					stroke: 2.4
				}), O(s);
				var c = R(s, 2);
				$(c, {
					get hue() {
						return H(i).hue;
					},
					get art() {
						return H(i).art;
					},
					get mark() {
						return H(i).mark;
					},
					size: 34,
					radius: 7,
					font: 9
				});
				var l = R(c, 2), u = F(l), d = L(u, !0), f = L(R(u));
				O(l);
				var p = R(l, 2), m = F(p);
				Q(F(m), {
					get d() {
						return Z.up;
					},
					size: 11,
					stroke: 2.2
				}), O(m);
				var h = R(m, 2);
				Q(F(h), {
					get d() {
						return Z.down;
					},
					size: 11,
					stroke: 2.2
				}), O(h), O(p);
				var g = R(p, 2);
				Q(F(g), {
					get d() {
						return Z.close;
					},
					size: 12,
					stroke: 2
				}), O(g), O(a), z((e) => {
					o = Y(a, 1, "q drag svelte-1b7bd5u", null, o, {
						dragging: H(_) === t,
						over: H(b) === H(r) && H(_) !== t
					}), K(d, H(i).title), K(f, `${Pi[H(i).type] ?? ""}${e ?? ""}`), X(m, "aria-label", `Move ${H(i).title ?? ""} up`), m.disabled = H(r) === 0, X(h, "aria-label", `Move ${H(i).title ?? ""} down`), h.disabled = H(r) === n().queue.length - 1, X(g, "aria-label", `Remove ${H(i).title ?? ""} from queue`);
				}, [() => n().lenOf(t) ? ` · ${n().lenOf(t)}` : ""]), br("dragstart", a, (e) => {
					N(_, t, !0), e.dataTransfer?.setData("text/plain", t);
				}), br("dragover", a, (e) => {
					e.preventDefault(), N(b, H(r), !0);
				}), br("dragleave", a, () => {
					H(b) === H(r) && N(b, -1);
				}), br("drop", a, (e) => {
					e.preventDefault(), x(H(r));
				}), br("dragend", a, () => {
					N(_, null), N(b, -1);
				}), U("click", l, () => n().play(t)), U("click", m, () => n().moveQueue(t, H(r) - 1)), U("click", h, () => n().moveQueue(t, H(r) + 1)), U("click", g, () => n().removeFromQueue(t)), G(e, a);
			};
			q(o, (e) => {
				H(i) && e(s);
			}), G(e, a);
		}, (e) => {
			G(e, Wc());
		}), G(e, t);
	}, D = (e) => {
		var t = Mr(), i = I(t), a = (e) => {
			var t = Mr();
			J(I(t), 17, () => H(r).chapters, Gr, (e, t, i) => {
				let a = /* @__PURE__ */ A(() => S(i)), o = /* @__PURE__ */ A(() => i === n().chapIdx);
				var s = Kc();
				let c;
				var l = F(s), u = L(l, !0), d = R(l, 2), f = L(d, !0), p = L(R(d, 2), !0);
				O(s), z((e, r) => {
					c = Y(s, 1, "chap svelte-1b7bd5u", null, c, {
						cur: H(o),
						done: i < n().chapIdx
					}), K(u, e), K(f, H(t).title), K(p, r);
				}, [() => H(r).type === "book" ? Ri(i) : ta(H(t).start), () => i < n().chapIdx ? "Done" : H(o) && H(a) ? `${Math.min(100, Math.round((n().pos - H(t).start) / H(a) * 100))}%` : H(a) ? na(H(a)) : ""]), U("click", s, () => n().seekTo(H(t).start)), G(e, s);
			}), G(e, t);
		}, o = /* @__PURE__ */ A(() => Fi(H(r)) && H(r).chapters.length), s = (e) => {
			var t = qc(), n = L(t, !0);
			z(() => K(n, H(r).type === "book" ? "Loading chapters…" : "This episode has no chapters.")), G(e, t);
		};
		q(i, (e) => {
			H(o) ? e(a) : e(s, -1);
		}), G(e, t);
	}, Ce = (e) => {
		var t = Xc(), r = I(t);
		Q(F(r), {
			get d() {
				return Z.plus;
			},
			size: 12,
			stroke: 2
		}), k(), O(r), J(R(r, 2), 17, () => H(s), (e) => e.at, (e, t) => {
			var r = Jc(), i = F(r), a = F(i), s = L(a, !0), c = L(R(a), !0);
			O(i);
			var l = R(i, 2);
			Q(F(l), {
				get d() {
					return Z.close;
				},
				size: 12,
				stroke: 2
			}), O(l), O(r), z((e) => {
				K(s, H(t).label), K(c, e), X(l, "aria-label", `Remove bookmark ${H(t).label ?? ""}`);
			}, [() => new Date(H(t).at).toLocaleString()]), U("click", i, () => n().jumpTo(H(o).id, H(t).pos)), U("click", l, () => n().removeBookmark(H(o).id, H(t).at)), G(e, r);
		}, (e) => {
			G(e, Yc());
		}), U("click", r, () => n().bookmark(H(o).id)), G(e, t);
	}, we = (e) => {
		var t = rl(), i = I(t), a = (e) => {
			var t = $c(), n = R(F(t)), i = L(n, !0), a = R(n, 2), o = (e) => {
				var t = Zc(), n = L(R(I(t)), !0);
				z((e) => K(n, e), [() => na(H(r).dur)]), G(e, t);
			};
			q(a, (e) => {
				H(r).dur && e(o);
			});
			var s = R(a, 2), c = (e) => {
				var t = Qc(), n = L(R(I(t)), !0);
				z(() => K(n, H(r).chapters.length)), G(e, t);
			};
			q(s, (e) => {
				H(r).chapters.length && e(c);
			}), k(3), O(t), z(() => K(i, H(r).sub)), G(e, t);
		}, o = (e) => {
			var t = tl(), i = R(F(t)), a = F(i), o = L(a, !0);
			O(i);
			var s = R(i, 2), l = (e) => {
				var t = el(), n = L(R(I(t)), !0);
				z((e) => K(n, e), [() => new Date(H(r).date).toLocaleDateString()]), G(e, t);
			};
			q(s, (e) => {
				H(r).date && e(l);
			});
			var u = R(s, 2), d = (e) => {
				var t = Zc(), n = L(R(I(t)), !0);
				z((e) => K(n, e), [() => na(H(c))]), G(e, t);
			};
			q(u, (e) => {
				H(c) && e(d);
			}), O(t), z(() => K(o, H(r).sub)), U("click", a, () => n().openShow(H(r).show)), G(e, t);
		};
		q(i, (e) => {
			H(r).type === "book" ? e(a) : H(r).type === "podcast" && e(o, 1);
		});
		var s = R(i, 2), u = (e) => {
			var t = nl(), n = L(t, !0);
			z(() => K(n, H(r).desc)), G(e, t);
		}, d = /* @__PURE__ */ A(() => Fi(H(r)) && H(r).desc);
		q(s, (e) => {
			H(d) && e(u);
		});
		var f = R(s, 2), p = (e) => {
			var t = Nc();
			J(R(I(t), 2), 16, () => H(l), (e) => e, (e, t) => {
				let r = /* @__PURE__ */ A(() => n().items[t]);
				var i = Mr(), a = I(i), o = (e) => {
					var i = Mc(), a = F(i);
					$(a, {
						get hue() {
							return H(r).hue;
						},
						get art() {
							return H(r).art;
						},
						get mark() {
							return H(r).mark;
						},
						size: 34,
						radius: 7,
						font: 9
					});
					var o = R(a, 2), s = F(o), c = L(s, !0), l = L(R(s));
					O(o), O(i), z((e) => {
						K(c, H(r).title), K(l, `${Pi[H(r).type] ?? ""} · ${e ?? ""}`);
					}, [() => n().leftOf(t)]), U("click", i, () => n().play(t)), G(e, i);
				};
				q(a, (e) => {
					H(r) && e(o);
				}), G(e, i);
			}), G(e, t);
		};
		q(f, (e) => {
			H(l).length && e(p);
		}), G(e, t);
	}, Te = (e) => {
		var t = al();
		J(t, 21, () => H(h), Gr, (e, t, r) => {
			var i = il();
			let a;
			var o = F(i), s = L(o), c = R(o, 1, !0);
			O(i), z((e) => {
				a = Y(i, 1, "line svelte-1b7bd5u", null, a, { cur: r === n().lineIdx }), K(s, `${H(t).who ? `${H(t).who} · ` : ""}${e ?? ""}`), K(c, H(t).text);
			}, [() => ta(H(t).t)]), U("click", i, () => n().seekTo(H(t).t)), G(e, i);
		}, (e) => {
			var t = qc(), n = L(t, !0);
			z(() => K(n, H(C))), G(e, t);
		}), O(t), ji(t, (e) => N(g, e), () => H(g)), G(e, t);
	};
	q(be, (e) => {
		H(r) ? H(i) === "onair" && H(r).type === "radio" ? e(E, 1) : H(i) === "queue" ? e(Se, 2) : H(i) === "chaps" ? e(D, 3) : H(i) === "marks" && H(o) ? e(Ce, 4) : H(i) === "about" ? e(we, 5) : H(i) === "trans" && e(Te, 6) : e(xe);
	}), O(ye), O(w), z(() => {
		te = Y(T, 1, "art svelte-1b7bd5u", null, te, { book: H(r)?.type === "book" }), K(ue, H(p)), K(de, H(m));
	}), G(e, w), Ge();
}
xr(["click", "keydown"]);
//#endregion
//#region src/components/SeekBar.svelte
var ll = /* @__PURE__ */ W("<div class=\"tick svelte-qmop01\"></div>"), ul = /* @__PURE__ */ W("<div role=\"slider\" aria-label=\"Playback position\"><div class=\"track svelte-qmop01\"><div class=\"fill svelte-qmop01\"></div> <!></div></div>"), dl = {
	hash: "svelte-qmop01",
	code: ".seek.svelte-qmop01 {flex:1;display:flex;align-items:center;cursor:pointer;border-radius:4px;}.seek.live.svelte-qmop01 {cursor:default;}.seek.svelte-qmop01:focus-visible {outline:2px solid var(--tm-accent);outline-offset:2px;}.track.svelte-qmop01 {flex:1;height:4px;border-radius:2px;background:var(--tm-fg-12);position:relative;}.fill.svelte-qmop01 {position:absolute;left:0;top:0;bottom:0;border-radius:2px;background:var(--tm-accent);}.live.svelte-qmop01 .fill:where(.svelte-qmop01) {opacity:.55;}.tick.svelte-qmop01 {position:absolute;top:-1px;width:2px;height:6px;background:var(--tm-panel-surface);}"
};
function fl(e, t) {
	We(t, !0), ei(e, dl);
	let n = Mi(t, "height", 3, 14), r = Mi(t, "ticks", 3, !1), i = /* @__PURE__ */ A(() => t.store.item), a = /* @__PURE__ */ A(() => H(i) ? t.store.durOf(H(i).id) : 0), o = /* @__PURE__ */ A(() => !!H(i) && Fi(H(i)) && H(a) > 0), s = /* @__PURE__ */ A(() => H(i) ? Fi(H(i)) ? H(a) ? Math.min(100, t.store.pos / H(a) * 100) : 0 : 100 : 0), c = /* @__PURE__ */ A(() => r() && H(i) && Fi(H(i)) && H(a) ? H(i).chapters.slice(1).map((e) => e.start / H(a) * 100) : []);
	function l(e) {
		if (!H(o)) return;
		let n = e.currentTarget.getBoundingClientRect();
		t.store.seekFraction((e.clientX - n.left) / n.width);
	}
	function u(e) {
		if (!H(o)) return;
		let n = {
			ArrowLeft: -15,
			ArrowRight: 30,
			PageDown: -60,
			PageUp: 60
		}[e.key];
		n ? (e.preventDefault(), t.store.skip(n)) : e.key === "Home" ? (e.preventDefault(), t.store.seekFraction(0)) : e.key === "End" && (e.preventDefault(), t.store.seekFraction(1));
	}
	var d = ul();
	let f;
	X(d, "aria-valuemin", 0), X(d, "aria-valuemax", 100);
	let p;
	var m = F(d), h = F(m);
	let g;
	J(R(h, 2), 17, () => H(c), Gr, (e, t) => {
		var n = ll();
		let r;
		z(() => r = ci(n, "", r, { left: `${H(t) ?? ""}%` })), G(e, n);
	}), O(m), O(d), z((e, t) => {
		f = Y(d, 1, "seek svelte-qmop01", null, f, { live: !H(o) }), X(d, "tabindex", H(o) ? 0 : -1), X(d, "aria-disabled", !H(o)), X(d, "aria-valuenow", e), X(d, "aria-valuetext", t), p = ci(d, "", p, { height: `${n() ?? ""}px` }), g = ci(h, "", g, { width: `${H(s) ?? ""}%` });
	}, [() => Math.round(H(s)), () => H(o) ? `${ta(t.store.pos)} of ${ta(H(a))}` : "Live"]), U("click", d, l), U("keydown", d, u), G(e, d), Ge();
}
xr(["click", "keydown"]);
//#endregion
//#region src/components/SleepPopover.svelte
var pl = /* @__PURE__ */ W("<button> </button>"), ml = /* @__PURE__ */ W("<div class=\"tm-pop\" role=\"dialog\" aria-label=\"Sleep timer\"><div class=\"title svelte-1mpzphw\">Sleep timer</div> <div class=\"hint svelte-1mpzphw\">Audio fades out over the last minute.</div> <div class=\"grid svelte-1mpzphw\"></div> <button> </button> <button class=\"off svelte-1mpzphw\">Turn off</button></div>"), hl = {
	hash: "svelte-1mpzphw",
	code: ".title.svelte-1mpzphw {font-size:13px;font-weight:650;}.hint.svelte-1mpzphw {font-size:11px;color:var(--tm-muted);margin-top:2px;}.grid.svelte-1mpzphw {display:grid;grid-template-columns:repeat(3, 1fr);gap:6px;margin-top:12px;}.opt.svelte-1mpzphw {height:34px;border-radius:9px;border:0;background:var(--tm-fg-6);color:var(--tm-fg);font-size:12px;font-weight:600;cursor:pointer;}.opt.svelte-1mpzphw:hover {background:var(--tm-fg-10);}.opt.sel.svelte-1mpzphw {background:var(--tm-accent);color:var(--tm-on-accent);}.wide.svelte-1mpzphw {width:100%;margin-top:6px;}.off.svelte-1mpzphw {width:100%;height:30px;margin-top:6px;border:0;background:none;color:var(--tm-muted);font-size:12px;cursor:pointer;}.off.svelte-1mpzphw:hover {color:var(--tm-fg);}"
};
function gl(e, t) {
	We(t, !0), ei(e, hl);
	let n = (e) => typeof t.store.sleep == "number" && Math.ceil(t.store.sleep / 60) === e;
	var r = ml(), i = R(F(r), 4);
	J(i, 21, () => Ma, Gr, (e, r) => {
		var i = pl();
		let a;
		var o = L(i);
		z((e) => {
			a = Y(i, 1, "opt svelte-1mpzphw", null, a, { sel: e }), K(o, `${H(r) ?? ""} min`);
		}, [() => n(H(r))]), U("click", i, () => t.store.setSleepMinutes(H(r))), G(e, i);
	}), O(i);
	var a = R(i, 2);
	let o;
	var s = L(a, !0), c = R(a, 2);
	O(r), z(() => {
		ci(r, t.pos), o = Y(a, 1, "opt wide svelte-1mpzphw", null, o, { sel: t.store.sleep === "chapter" }), K(s, t.store.live ? "End of current show" : t.store.chapters.length > 1 ? "End of chapter" : "End of episode");
	}), U("click", a, () => t.store.sleepAtEnd()), U("click", c, () => t.store.sleepOff()), G(e, r), Ge();
}
xr(["click"]);
//#endregion
//#region src/components/SpeedPopover.svelte
var _l = /* @__PURE__ */ W("<button> </button>"), vl = /* @__PURE__ */ W("<div class=\"tm-pop\" role=\"dialog\" aria-label=\"Playback speed\"><div class=\"head svelte-1xvntbg\"><span class=\"title svelte-1xvntbg\">Playback speed</span><span class=\"now svelte-1xvntbg\"> </span></div> <div class=\"hint svelte-1xvntbg\"> </div> <div class=\"grid svelte-1xvntbg\"></div></div>"), yl = {
	hash: "svelte-1xvntbg",
	code: ".head.svelte-1xvntbg {display:flex;align-items:baseline;justify-content:space-between;}.title.svelte-1xvntbg {font-size:13px;font-weight:650;}.now.svelte-1xvntbg {font:600 12px ui-monospace, Menlo, monospace;color:var(--tm-accent);}.hint.svelte-1xvntbg {font-size:11px;color:var(--tm-muted);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.grid.svelte-1xvntbg {display:grid;grid-template-columns:repeat(4, 1fr);gap:6px;margin-top:12px;}.opt.svelte-1xvntbg {height:32px;border-radius:9px;border:0;background:var(--tm-fg-6);color:var(--tm-fg);font:600 11.5px ui-monospace, Menlo, monospace;cursor:pointer;}.opt.svelte-1xvntbg:hover {background:var(--tm-fg-10);}.opt.sel.svelte-1xvntbg {background:var(--tm-accent);color:var(--tm-on-accent);}"
};
function bl(e, t) {
	We(t, !0), ei(e, yl);
	var n = vl(), r = F(n), i = L(R(F(r)));
	O(r);
	var a = R(r, 2), o = L(a), s = R(a, 2);
	J(s, 21, () => ja, Gr, (e, n) => {
		var r = _l();
		let i;
		var a = L(r);
		z((e) => {
			i = Y(r, 1, "opt svelte-1xvntbg", null, i, { sel: t.store.speed === H(n) }), K(a, `${e ?? ""}×`);
		}, [() => H(n).toFixed(1)]), U("click", r, () => t.store.setSpeed(H(n))), G(e, r);
	}), O(s), O(n), z((e) => {
		ci(n, t.pos), K(i, `${e ?? ""}×`), K(o, `Remembered for ${t.store.speedScope ?? ""}.`);
	}, [() => t.store.speed.toFixed(1)]), G(e, n), Ge();
}
xr(["click"]);
//#endregion
//#region src/components/PlayerBar.svelte
var xl = /* @__PURE__ */ W("<div class=\"thumb svelte-y66ne\"></div>"), Sl = /* @__PURE__ */ W("<span class=\"live svelte-y66ne\">LIVE</span>"), Cl = /* @__PURE__ */ W("<span class=\"time r svelte-y66ne\"> </span>"), wl = /* @__PURE__ */ W("<span class=\"one svelte-y66ne\">1</span>"), Tl = /* @__PURE__ */ W("<footer class=\"bar svelte-y66ne\"><div class=\"now svelte-y66ne\"><!> <div class=\"ntext svelte-y66ne\"><div class=\"ntitle svelte-y66ne\"> </div><div class=\"nsub svelte-y66ne\"> </div></div> <!></div> <div class=\"center svelte-y66ne\"><div class=\"controls svelte-y66ne\"><button class=\"skipc svelte-y66ne\" aria-label=\"Previous chapter\"><!></button> <button class=\"jump svelte-y66ne\"> </button> <button><!></button> <button class=\"jump svelte-y66ne\"> </button> <button class=\"skipc svelte-y66ne\" aria-label=\"Next in queue\"><!></button></div> <div class=\"timeline svelte-y66ne\"><span class=\"time l svelte-y66ne\"> </span> <!> <!></div></div> <div class=\"tools svelte-y66ne\"><button><!><!></button> <button data-pop=\"\" aria-haspopup=\"dialog\"> </button> <button data-pop=\"\" title=\"Sleep timer\" aria-haspopup=\"dialog\"><!> </button> <button class=\"clip svelte-y66ne\" title=\"Clip to Notes\"><!></button> <div class=\"vol svelte-y66ne\"><button class=\"mute svelte-y66ne\"><!></button> <div class=\"vtrack svelte-y66ne\" role=\"slider\" tabindex=\"0\" aria-label=\"Volume\"><div class=\"vfill svelte-y66ne\"></div></div></div></div> <!> <!></footer>"), El = {
	hash: "svelte-y66ne",
	code: ".bar.svelte-y66ne {height:84px;flex:none;display:flex;align-items:center;gap:18px;padding:0 18px;background:var(--tm-panel-surface);border-top:1px solid var(--tm-fg-7);position:relative;}.now.svelte-y66ne {width:240px;display:flex;align-items:center;gap:11px;min-width:0;flex:none;}.thumb.svelte-y66ne {width:46px;height:46px;border-radius:9px;flex:none;background:var(--tm-fg-6);}.ntext.svelte-y66ne {min-width:0;flex:1;}.ntitle.svelte-y66ne {font-size:12.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.nsub.svelte-y66ne {font-size:11px;color:var(--tm-muted);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.center.svelte-y66ne {flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;gap:6px;}.controls.svelte-y66ne {display:flex;align-items:center;justify-content:center;gap:14px;}button.svelte-y66ne:disabled {opacity:.35;cursor:default;}.skipc.svelte-y66ne {width:30px;height:30px;border:0;background:none;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;}.skipc.svelte-y66ne:hover:not(:disabled) {color:var(--tm-fg);}.jump.svelte-y66ne {width:32px;height:32px;border:0;background:none;color:var(--tm-fg);cursor:pointer;font:600 10.5px ui-monospace, Menlo, monospace;border-radius:16px;}.jump.svelte-y66ne:hover:not(:disabled) {background:var(--tm-fg-8);}.pp.svelte-y66ne {width:50px;height:50px;flex:none;padding:0;border:0;border-radius:50%;background:var(--tm-fg);color:var(--tm-bg);cursor:pointer;display:grid;place-items:center;position:relative;transition:transform .1s;}\n  /* The play triangle's visual centre sits left of its box. */.pp.paused.svelte-y66ne svg {transform:translateX(1.5px);}.pp.svelte-y66ne:hover:not(:disabled) {filter:brightness(1.12);transform:scale(1.04);}.pp.svelte-y66ne:active:not(:disabled) {transform:scale(.96);}.pp.busy.svelte-y66ne::after {content:'';position:absolute;inset:-4px;border-radius:50%;border:2px solid transparent;border-top-color:var(--tm-accent); animation: svelte-y66ne-spin .9s linear infinite;}\n  @keyframes svelte-y66ne-spin { to { transform: rotate(360deg); } }\n  @media (prefers-reduced-motion: reduce) {.pp.svelte-y66ne {transition:none;}.pp.busy.svelte-y66ne::after { animation: none;border-color:var(--tm-accent);} }.timeline.svelte-y66ne {display:flex;align-items:center;gap:10px;width:100%;max-width:440px;}.time.svelte-y66ne {font:500 10.5px ui-monospace, Menlo, monospace;color:var(--tm-muted);width:52px;flex:none;}.time.l.svelte-y66ne {text-align:right;}.live.svelte-y66ne {width:52px;height:20px;flex:none;display:grid;place-items:center;border-radius:10px;background:var(--tm-live);color:#fff;font-size:9.5px;font-weight:700;letter-spacing:.8px;}.tools.svelte-y66ne {width:240px;flex:none;display:flex;align-items:center;justify-content:flex-end;gap:6px;}.repeat.svelte-y66ne {position:relative;height:30px;width:32px;border:0;border-radius:8px;background:transparent;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;}.repeat.svelte-y66ne:hover:not(:disabled) {background:var(--tm-fg-10);color:var(--tm-fg);}.repeat.on.svelte-y66ne {color:var(--tm-accent);}.one.svelte-y66ne {position:absolute;right:3px;bottom:3px;min-width:11px;height:11px;border-radius:6px;background:var(--tm-accent);color:var(--tm-on-accent);font:700 8px/11px system-ui, sans-serif;text-align:center;}.speed.svelte-y66ne {height:30px;min-width:44px;padding:0 8px;border:0;border-radius:8px;background:transparent;color:var(--tm-fg);font:600 11.5px ui-monospace, Menlo, monospace;cursor:pointer;}.speed.on.svelte-y66ne {background:var(--tm-accent-14);}.sleep.svelte-y66ne {height:30px;padding:0 8px;border:0;border-radius:8px;background:transparent;color:var(--tm-fg);cursor:pointer;display:flex;align-items:center;gap:5px;font:600 11px ui-monospace, Menlo, monospace;}.sleep.on.svelte-y66ne {background:var(--tm-accent-14);color:var(--tm-accent);}.speed.svelte-y66ne:hover:not(:disabled), .sleep.svelte-y66ne:hover:not(:disabled), .clip.svelte-y66ne:hover:not(:disabled) {background:var(--tm-fg-10);}.clip.svelte-y66ne {height:30px;width:32px;border:0;border-radius:8px;background:transparent;color:var(--tm-fg);cursor:pointer;display:grid;place-items:center;}.vol.svelte-y66ne {display:flex;align-items:center;gap:6px;margin-left:4px;color:var(--tm-muted);}.mute.svelte-y66ne {border:0;background:none;padding:0;color:inherit;cursor:pointer;display:grid;place-items:center;}.mute.svelte-y66ne:hover {color:var(--tm-fg);}.vtrack.svelte-y66ne {width:64px;height:12px;display:flex;align-items:center;cursor:pointer;position:relative;background:linear-gradient(var(--tm-fg-12), var(--tm-fg-12)) center / 100% 4px no-repeat;border-radius:2px;}.vfill.svelte-y66ne {height:4px;border-radius:2px;background:var(--tm-fg);}.vtrack.svelte-y66ne:focus-visible {outline:2px solid var(--tm-accent);outline-offset:2px;}"
};
function Dl(e, t) {
	We(t, !0), ei(e, El);
	let n = /* @__PURE__ */ A(() => t.store.item), r = /* @__PURE__ */ A(() => !!H(n) && Fi(H(n))), i = /* @__PURE__ */ A(() => H(n) ? t.store.durOf(H(n).id) : 0), a = /* @__PURE__ */ A(() => typeof t.store.sleep == "number" ? ta(t.store.sleep) : t.store.sleep === "chapter" ? "End" : ""), o = /* @__PURE__ */ A(() => t.store.buffering || t.store.loadingItem), s = /* @__PURE__ */ A(() => H(n)?.type === "radio" ? t.store.nowPlaying[H(n).stationId] : void 0), c = /* @__PURE__ */ A(() => t.store.playing ? t.store.live ? "Stop" : "Pause" : "Play"), l = /* @__PURE__ */ A(() => t.store.playing ? t.store.live ? Z.stop : Z.pause : Z.play);
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
	var f = Tl(), p = F(f), m = F(p), h = (e) => {
		{
			let t = /* @__PURE__ */ A(() => H(s)?.art || H(n).art);
			$(e, {
				get hue() {
					return H(n).hue;
				},
				get art() {
					return H(t);
				},
				get mark() {
					return H(n).mark;
				},
				size: 46,
				radius: 9
			});
		}
	}, g = (e) => {
		G(e, xl());
	};
	q(m, (e) => {
		H(n) ? e(h) : e(g, -1);
	});
	var _ = R(m, 2), v = F(_), y = L(v, !0), b = L(R(v), !0);
	O(_);
	var x = R(_, 2), S = (e) => {
		Oo(e, {
			get store() {
				return t.store;
			},
			get id() {
				return H(n).id;
			}
		});
	};
	q(x, (e) => {
		H(n) && e(S);
	}), O(p);
	var C = R(p, 2), w = F(C), ee = F(w);
	Q(F(ee), { get d() {
		return Z.prev;
	} }), O(ee);
	var T = R(ee, 2), te = L(T), ne = R(T, 2);
	let re;
	Q(F(ne), {
		get d() {
			return H(l);
		},
		size: 22
	}), O(ne);
	var ie = R(ne, 2), ae = L(ie), oe = R(ie, 2);
	Q(F(oe), { get d() {
		return Z.next;
	} }), O(oe), O(w);
	var se = R(w, 2), ce = F(se), le = L(ce, !0), ue = R(ce, 2);
	fl(ue, {
		get store() {
			return t.store;
		},
		ticks: !0
	});
	var de = R(ue, 2), fe = (e) => {
		G(e, Sl());
	}, pe = (e) => {
		var n = Cl(), r = L(n, !0);
		z((e) => K(r, e), [() => H(i) ? `−${ta(ma(H(i), t.store.pos, t.store.speed))}` : ""]), G(e, n);
	};
	q(de, (e) => {
		H(n) && !H(r) ? e(fe) : e(pe, -1);
	}), O(se), O(C);
	var me = R(C, 2), he = F(me);
	let ge;
	var _e = F(he);
	Q(_e, {
		get d() {
			return Z.repeat;
		},
		size: 15,
		stroke: 1.8
	});
	var ve = R(_e), ye = (e) => {
		G(e, wl());
	};
	q(ve, (e) => {
		t.store.prefs.repeat === "one" && e(ye);
	}), O(he);
	var be = R(he, 2);
	let xe;
	var E = L(be), Se = R(be, 2);
	let D;
	var Ce = F(Se);
	Q(Ce, {
		get d() {
			return Z.moon;
		},
		size: 15,
		stroke: 1.8
	});
	var we = R(Ce, 1, !0);
	O(Se);
	var k = R(Se, 2);
	Q(F(k), {
		get d() {
			return Z.clip;
		},
		size: 15,
		stroke: 1.8
	}), O(k);
	var Te = R(k, 2), Ee = F(Te), De = F(Ee);
	{
		let e = /* @__PURE__ */ A(() => t.store.muted ? Z.muted : Z.volume);
		Q(De, {
			get d() {
				return H(e);
			},
			size: 15,
			stroke: 1.8
		});
	}
	O(Ee);
	var Oe = R(Ee, 2);
	X(Oe, "aria-valuemin", 0), X(Oe, "aria-valuemax", 100);
	var ke = F(Oe);
	let Ae;
	O(Oe), O(Te), O(me);
	var je = R(me, 2), Me = (e) => {
		gl(e, {
			get store() {
				return t.store;
			},
			pos: "right:60px;bottom:74px"
		});
	};
	q(je, (e) => {
		t.store.pop === "sleep" && e(Me);
	});
	var Ne = R(je, 2), Pe = (e) => {
		bl(e, {
			get store() {
				return t.store;
			},
			pos: "right:110px;bottom:74px"
		});
	};
	q(Ne, (e) => {
		t.store.pop === "speed" && e(Pe);
	}), O(f), z((e, i, l, u, d) => {
		K(y, H(s)?.title || H(n)?.title || "Nothing playing"), K(b, e), ee.disabled = !H(r), X(T, "aria-label", `Back ${t.store.prefs.back ?? ""} seconds`), T.disabled = !H(r), K(te, `−${t.store.prefs.back ?? ""}`), re = Y(ne, 1, "pp svelte-y66ne", null, re, {
			busy: H(o),
			paused: !t.store.playing
		}), X(ne, "aria-label", H(c)), X(ne, "title", H(c)), ne.disabled = !H(n), X(ie, "aria-label", `Forward ${t.store.prefs.fwd ?? ""} seconds`), ie.disabled = !H(r), K(ae, `+${t.store.prefs.fwd ?? ""}`), oe.disabled = !t.store.queue.length, K(le, i), ge = Y(he, 1, "repeat svelte-y66ne", null, ge, { on: t.store.prefs.repeat !== "off" }), he.disabled = !H(n) || t.store.live, X(he, "aria-pressed", t.store.prefs.repeat !== "off"), X(he, "aria-label", t.store.prefs.repeat === "off" ? "Repeat is off" : t.store.prefs.repeat === "all" ? "Repeat all" : "Repeat one"), X(he, "title", t.store.prefs.repeat === "off" ? "Repeat: off" : t.store.prefs.repeat === "all" ? "Repeat: all" : "Repeat: one"), xe = Y(be, 1, "speed svelte-y66ne", null, xe, { on: t.store.speed !== 1 && H(r) }), be.disabled = !H(n), X(be, "aria-expanded", t.store.pop === "speed"), X(be, "aria-label", `Playback speed ${l ?? ""}×`), K(E, `${u ?? ""}×`), D = Y(Se, 1, "sleep svelte-y66ne", null, D, { on: !!t.store.sleep }), Se.disabled = !H(n), X(Se, "aria-expanded", t.store.pop === "sleep"), X(Se, "aria-label", `Sleep timer${H(a) ? `: ${H(a)}` : ""}`), K(we, H(a)), X(k, "aria-label", H(r) ? "Clip the last 30 seconds to Notes" : "Save what is playing to Notes"), k.disabled = !H(n), X(Ee, "aria-label", t.store.muted ? "Unmute" : "Mute"), X(Oe, "aria-valuenow", d), Ae = ci(ke, "", Ae, { width: `${(t.store.muted ? 0 : t.store.volume) * 100}%` });
	}, [
		() => H(n) ? H(s)?.title ? [H(s).artist, H(n).title].filter(Boolean).join(" · ") : t.store.subtitle : "Choose something to listen to",
		() => H(n) ? H(r) ? ta(t.store.pos) : "On air" : "",
		() => t.store.speed.toFixed(1),
		() => H(r) ? t.store.speed.toFixed(1) : "1.0",
		() => Math.round((t.store.muted ? 0 : t.store.volume) * 100)
	]), U("click", ee, () => t.store.previous()), U("click", T, () => t.store.skip(-t.store.prefs.back)), U("click", ne, () => t.store.toggle()), U("click", ie, () => t.store.skip(t.store.prefs.fwd)), U("click", oe, () => t.store.next()), U("click", he, () => t.store.cycleRepeat()), U("click", be, () => t.store.togglePop("speed")), U("click", Se, () => t.store.togglePop("sleep")), U("click", k, () => t.store.clip()), U("click", Ee, () => t.store.toggleMute()), U("click", Oe, u), U("keydown", Oe, d), G(e, f), Ge();
}
xr(["click", "keydown"]);
//#endregion
//#region src/components/MiniPlayer.svelte
var Ol = /* @__PURE__ */ W("<div class=\"blank svelte-1jla3sy\"></div>"), kl = /* @__PURE__ */ W("<span class=\"kind svelte-1jla3sy\"> </span>"), Al = /* @__PURE__ */ W("<div class=\"chapter svelte-1jla3sy\"><span class=\"svelte-1jla3sy\">Chapter</span><br/> </div>"), jl = /* @__PURE__ */ W("<span class=\"liveword svelte-1jla3sy\">LIVE</span>"), Ml = /* @__PURE__ */ W("<span> </span>"), Nl = /* @__PURE__ */ W("<span class=\"one svelte-1jla3sy\">1</span>"), Pl = /* @__PURE__ */ W("<div class=\"sleepnote svelte-1jla3sy\"> </div>"), Fl = /* @__PURE__ */ W("<button class=\"svelte-1jla3sy\">Clip to Notes</button>"), Il = /* @__PURE__ */ W("<button class=\"q svelte-1jla3sy\"><!> <span class=\"qtext svelte-1jla3sy\"><span class=\"qtitle svelte-1jla3sy\"> </span><span class=\"qmeta svelte-1jla3sy\"> </span></span></button>"), Ll = /* @__PURE__ */ W("<div class=\"empty svelte-1jla3sy\">Widen the panel to browse radio, podcasts and audiobooks.</div>"), Rl = /* @__PURE__ */ W("<div class=\"mini svelte-1jla3sy\"><div class=\"head svelte-1jla3sy\"><span class=\"np svelte-1jla3sy\">Now playing</span><span class=\"spacer svelte-1jla3sy\"></span><span class=\"by svelte-1jla3sy\">OndaCast</span></div> <div class=\"player svelte-1jla3sy\"><div class=\"art svelte-1jla3sy\"><!> <!> <!></div> <div class=\"trow svelte-1jla3sy\"><div class=\"title svelte-1jla3sy\"> </div><!></div> <div class=\"sub svelte-1jla3sy\"> </div> <div class=\"seek svelte-1jla3sy\"><!></div> <div class=\"times svelte-1jla3sy\"><span> </span> <!></div> <div class=\"controls svelte-1jla3sy\"><button class=\"chipbtn svelte-1jla3sy\" data-pop=\"\" aria-haspopup=\"dialog\"> </button> <button class=\"jump svelte-1jla3sy\"> </button> <button><!></button> <button class=\"jump svelte-1jla3sy\"> </button> <button><!><!></button> <button data-pop=\"\" aria-haspopup=\"dialog\" aria-label=\"Sleep timer\"><!></button></div> <!> <!> <!></div> <div class=\"upnext svelte-1jla3sy\"><div class=\"uphead svelte-1jla3sy\"><span class=\"svelte-1jla3sy\"> </span><!></div> <!></div></div>"), zl = {
	hash: "svelte-1jla3sy",
	code: ".mini.svelte-1jla3sy {height:100%;container-type:size;display:flex;flex-direction:column;background:var(--tm-surface);}.head.svelte-1jla3sy {height:36px;flex:none;display:flex;align-items:center;gap:8px;padding:0 14px;background:var(--tm-panel-surface);}.by.svelte-1jla3sy {font-size:11px;color:var(--tm-muted);}.spacer.svelte-1jla3sy {flex:1;}.np.svelte-1jla3sy {font-size:12px;font-weight:600;}.player.svelte-1jla3sy {padding:22px 22px 0;position:relative;flex:none;}.art.svelte-1jla3sy {width:min(100%, 48cqh);aspect-ratio:1;margin:0 auto;border-radius:18px;overflow:hidden;display:flex;position:relative;box-shadow:0 24px 50px rgba(0, 0, 0, .45);}.blank.svelte-1jla3sy {flex:1;background:var(--tm-fg-6);}.kind.svelte-1jla3sy {position:absolute;left:14px;top:14px;font-size:9.5px;font-weight:700;letter-spacing:.8px;padding:3px 8px;border-radius:20px;background:rgba(0, 0, 0, .45);color:#fff;}.chapter.svelte-1jla3sy {position:absolute;left:14px;bottom:14px;max-width:70%;padding:8px 10px;border-radius:10px;background:rgba(0, 0, 0, .5);color:#fff;font-size:11.5px;line-height:1.3;}.chapter.svelte-1jla3sy span:where(.svelte-1jla3sy) {opacity:.7;}.trow.svelte-1jla3sy {display:flex;align-items:flex-start;gap:6px;margin-top:18px;}.trow.svelte-1jla3sy .title:where(.svelte-1jla3sy) {margin-top:0;flex:1;min-width:0;}.title.svelte-1jla3sy {font-size:17px;font-weight:650;margin-top:18px;line-height:1.3;text-wrap:pretty;display:-webkit-box;-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}.sub.svelte-1jla3sy {font-size:12.5px;color:var(--tm-muted);margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.seek.svelte-1jla3sy {display:flex;margin-top:14px;}.times.svelte-1jla3sy {display:flex;justify-content:space-between;font:500 10.5px ui-monospace, Menlo, monospace;color:var(--tm-muted);margin-top:2px;}.liveword.svelte-1jla3sy {color:var(--tm-live);font-weight:700;}.controls.svelte-1jla3sy {display:flex;align-items:center;justify-content:space-between;margin-top:10px;}button.svelte-1jla3sy:disabled {opacity:.35;cursor:default;}.chipbtn.svelte-1jla3sy {width:44px;height:30px;border:0;border-radius:8px;background:var(--tm-fg-6);color:var(--tm-fg);font:600 11px ui-monospace, Menlo, monospace;cursor:pointer;display:grid;place-items:center;}.repeat.svelte-1jla3sy {position:relative;height:30px;width:32px;border:0;border-radius:8px;background:transparent;color:var(--tm-muted);cursor:pointer;display:grid;place-items:center;}.repeat.svelte-1jla3sy:hover:not(:disabled) {background:var(--tm-fg-10);color:var(--tm-fg);}.repeat.on.svelte-1jla3sy {color:var(--tm-accent);}.one.svelte-1jla3sy {position:absolute;right:3px;bottom:3px;min-width:11px;height:11px;border-radius:6px;background:var(--tm-accent);color:var(--tm-on-accent);font:700 8px/11px system-ui, sans-serif;text-align:center;}.sleep.svelte-1jla3sy {background:transparent;}.sleep.on.svelte-1jla3sy {background:var(--tm-accent-14);color:var(--tm-accent);}.jump.svelte-1jla3sy {width:40px;height:40px;border:0;border-radius:20px;background:none;color:var(--tm-fg);font:600 11px ui-monospace, Menlo, monospace;cursor:pointer;}.jump.svelte-1jla3sy:hover:not(:disabled) {background:var(--tm-fg-8);}.pp.svelte-1jla3sy {width:58px;height:58px;flex:none;padding:0;border:0;border-radius:50%;background:var(--tm-accent);color:var(--tm-on-accent);cursor:pointer;display:grid;place-items:center;position:relative;}.pp.paused.svelte-1jla3sy svg {transform:translateX(1.5px);}.pp.busy.svelte-1jla3sy::after {content:'';position:absolute;inset:-5px;border-radius:50%;border:2px solid transparent;border-top-color:var(--tm-accent); animation: svelte-1jla3sy-spin .9s linear infinite;}\n  @keyframes svelte-1jla3sy-spin { to { transform: rotate(360deg); } }\n  @media (prefers-reduced-motion: reduce) {.pp.busy.svelte-1jla3sy::after { animation: none;} }.sleepnote.svelte-1jla3sy {text-align:center;font-size:11px;color:var(--tm-accent);margin-top:6px;}.upnext.svelte-1jla3sy {flex:1;min-height:0;margin-top:16px;background:var(--tm-panel-surface);border-radius:18px 18px 0 0;padding:14px 12px;overflow:auto;}.uphead.svelte-1jla3sy {display:flex;align-items:baseline;justify-content:space-between;padding:0 8px 6px;}.uphead.svelte-1jla3sy span:where(.svelte-1jla3sy) {font-size:13px;font-weight:650;}.uphead.svelte-1jla3sy button:where(.svelte-1jla3sy) {border:0;background:none;color:var(--tm-accent);font-size:11.5px;cursor:pointer;padding:0;}.q.svelte-1jla3sy {display:flex;align-items:center;gap:10px;width:100%;padding:7px 8px;border:0;border-radius:9px;background:none;color:inherit;cursor:pointer;text-align:left;font:inherit;}.q.svelte-1jla3sy:hover {background:var(--tm-fg-5);}.qtext.svelte-1jla3sy {flex:1;min-width:0;display:flex;flex-direction:column;}.qtitle.svelte-1jla3sy {font-size:12.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.qmeta.svelte-1jla3sy {font-size:11px;color:var(--tm-muted);margin-top:2px;}.empty.svelte-1jla3sy {padding:20px 8px;font-size:12px;color:var(--tm-muted);text-align:center;}"
};
function Bl(e, t) {
	We(t, !0), ei(e, zl);
	let n = /* @__PURE__ */ A(() => t.store.item), r = /* @__PURE__ */ A(() => !!H(n) && Fi(H(n))), i = /* @__PURE__ */ A(() => H(n) ? t.store.durOf(H(n).id) : 0), a = /* @__PURE__ */ A(() => H(n) && Fi(H(n)) && H(n).chapters.length > 1 && t.store.chapIdx >= 0 ? H(n).chapters[t.store.chapIdx].title : ""), o = /* @__PURE__ */ A(() => typeof t.store.sleep == "number" ? ta(t.store.sleep) : t.store.sleep === "chapter" ? "end of chapter" : ""), s = /* @__PURE__ */ A(() => H(n)?.type === "radio" ? t.store.nowPlaying[H(n).stationId] : void 0), c = /* @__PURE__ */ A(() => [...t.store.continueIds, ...t.store.onAirIds].filter((e) => e !== t.store.now).slice(0, 6));
	var l = Rl(), u = R(F(l), 2), d = F(u), f = F(d), p = (e) => {
		{
			let t = /* @__PURE__ */ A(() => H(s)?.art || H(n).art);
			$(e, {
				get hue() {
					return H(n).hue;
				},
				get art() {
					return H(t);
				},
				fill: !0,
				radius: 0,
				get mark() {
					return H(n).mark;
				},
				font: 40
			});
		}
	}, m = (e) => {
		G(e, Ol());
	};
	q(f, (e) => {
		H(n) ? e(p) : e(m, -1);
	});
	var h = R(f, 2), g = (e) => {
		var n = kl(), r = L(n, !0);
		z(() => K(r, t.store.kindLabel)), G(e, n);
	};
	q(h, (e) => {
		H(n) && e(g);
	});
	var _ = R(h, 2), v = (e) => {
		var t = Al(), n = R(F(t), 2, !0);
		O(t), z(() => K(n, H(a))), G(e, t);
	};
	q(_, (e) => {
		H(a) && e(v);
	}), O(d);
	var y = R(d, 2), b = F(y), x = L(b, !0), S = R(b), C = (e) => {
		Oo(e, {
			get store() {
				return t.store;
			},
			get id() {
				return H(n).id;
			},
			size: 18
		});
	};
	q(S, (e) => {
		H(n) && e(C);
	}), O(y);
	var w = R(y, 2), ee = L(w, !0), T = R(w, 2);
	fl(F(T), {
		get store() {
			return t.store;
		},
		height: 16
	}), O(T);
	var te = R(T, 2), ne = F(te), re = L(ne, !0), ie = R(ne, 2), ae = (e) => {
		G(e, jl());
	}, oe = (e) => {
		var n = Ml(), r = L(n, !0);
		z((e) => K(r, e), [() => H(i) ? `−${ta(ma(H(i), t.store.pos, t.store.speed))}` : ""]), G(e, n);
	};
	q(ie, (e) => {
		H(n) && !H(r) ? e(ae) : e(oe, -1);
	}), O(te);
	var se = R(te, 2), ce = F(se), le = L(ce), ue = R(ce, 2), de = L(ue), fe = R(ue, 2);
	let pe;
	var me = F(fe);
	{
		let e = /* @__PURE__ */ A(() => t.store.playing ? t.store.live ? Z.stop : Z.pause : Z.play);
		Q(me, {
			get d() {
				return H(e);
			},
			size: 24
		});
	}
	O(fe);
	var he = R(fe, 2), ge = L(he), _e = R(he, 2);
	let ve;
	var ye = F(_e);
	Q(ye, {
		get d() {
			return Z.repeat;
		},
		size: 15,
		stroke: 1.8
	});
	var be = R(ye), xe = (e) => {
		G(e, Nl());
	};
	q(be, (e) => {
		t.store.prefs.repeat === "one" && e(xe);
	}), O(_e);
	var E = R(_e, 2);
	let Se;
	Q(F(E), {
		get d() {
			return Z.moon;
		},
		size: 15,
		stroke: 1.8
	}), O(E), O(se);
	var D = R(se, 2), Ce = (e) => {
		var t = Pl(), n = L(t);
		z(() => K(n, `Sleep timer · ${H(o) ?? ""}`)), G(e, t);
	};
	q(D, (e) => {
		t.store.sleep && e(Ce);
	});
	var we = R(D, 2), k = (e) => {
		gl(e, {
			get store() {
				return t.store;
			},
			pos: "right:16px;left:16px;width:auto;top:120px"
		});
	};
	q(we, (e) => {
		t.store.pop === "sleep" && e(k);
	});
	var Te = R(we, 2), Ee = (e) => {
		bl(e, {
			get store() {
				return t.store;
			},
			pos: "right:16px;left:16px;width:auto;top:120px"
		});
	};
	q(Te, (e) => {
		t.store.pop === "speed" && e(Ee);
	}), O(u);
	var De = R(u, 2), Oe = F(De), ke = F(Oe), Ae = L(ke, !0), je = R(ke), Me = (e) => {
		var n = Fl();
		U("click", n, () => t.store.clip()), G(e, n);
	};
	q(je, (e) => {
		H(n) && e(Me);
	}), O(Oe), J(R(Oe, 2), 16, () => t.store.queue.length ? t.store.queue : H(c), (e) => e, (e, n) => {
		let r = /* @__PURE__ */ A(() => t.store.items[n]);
		var i = Mr(), a = I(i), o = (e) => {
			var i = Il(), a = F(i);
			$(a, {
				get hue() {
					return H(r).hue;
				},
				get art() {
					return H(r).art;
				},
				get mark() {
					return H(r).mark;
				},
				size: 36,
				font: 9
			});
			var o = R(a, 2), s = F(o), c = L(s, !0), l = L(R(s));
			O(o), O(i), z((e) => {
				K(c, H(r).title), K(l, `${Pi[H(r).type] ?? ""}${e ?? ""}`);
			}, [() => t.store.lenOf(n) ? ` · ${t.store.lenOf(n)}` : ""]), U("click", i, () => t.store.play(n)), G(e, i);
		};
		q(a, (e) => {
			H(r) && e(o);
		}), G(e, i);
	}, (e) => {
		G(e, Ll());
	}), O(De), O(l), z((e, i, a, o) => {
		K(x, H(s)?.title || H(n)?.title || "Nothing playing"), K(ee, e), K(re, i), ce.disabled = !H(r), X(ce, "aria-expanded", t.store.pop === "speed"), X(ce, "aria-label", `Playback speed ${a ?? ""}×`), K(le, `${o ?? ""}×`), ue.disabled = !H(r), X(ue, "aria-label", `Back ${t.store.prefs.back ?? ""} seconds`), K(de, `−${t.store.prefs.back ?? ""}`), pe = Y(fe, 1, "pp svelte-1jla3sy", null, pe, {
			busy: t.store.buffering || t.store.loadingItem,
			paused: !t.store.playing
		}), fe.disabled = !H(n), X(fe, "aria-label", t.store.playing ? t.store.live ? "Stop" : "Pause" : "Play"), he.disabled = !H(r), X(he, "aria-label", `Forward ${t.store.prefs.fwd ?? ""} seconds`), K(ge, `+${t.store.prefs.fwd ?? ""}`), ve = Y(_e, 1, "repeat svelte-1jla3sy", null, ve, { on: t.store.prefs.repeat !== "off" }), _e.disabled = !H(n) || t.store.live, X(_e, "aria-pressed", t.store.prefs.repeat !== "off"), X(_e, "aria-label", t.store.prefs.repeat === "off" ? "Repeat is off" : t.store.prefs.repeat === "all" ? "Repeat all" : "Repeat one"), X(_e, "title", t.store.prefs.repeat === "off" ? "Repeat: off" : t.store.prefs.repeat === "all" ? "Repeat: all" : "Repeat: one"), Se = Y(E, 1, "chipbtn sleep svelte-1jla3sy", null, Se, { on: !!t.store.sleep }), E.disabled = !H(n), X(E, "aria-expanded", t.store.pop === "sleep"), K(Ae, t.store.queue.length ? "Up next" : "Recent");
	}, [
		() => H(n) ? H(s)?.title ? [H(s).artist, H(n).title].filter(Boolean).join(" · ") : t.store.subtitle : "Widen the panel to browse, or pick from below.",
		() => H(n) ? H(r) ? ta(t.store.pos) : "On air" : "",
		() => t.store.speed.toFixed(1),
		() => H(r) ? t.store.speed.toFixed(1) : "1.0"
	]), U("click", ce, () => t.store.togglePop("speed")), U("click", ue, () => t.store.skip(-t.store.prefs.back)), U("click", fe, () => t.store.toggle()), U("click", he, () => t.store.skip(t.store.prefs.fwd)), U("click", _e, () => t.store.cycleRepeat()), U("click", E, () => t.store.togglePop("sleep")), G(e, l), Ge();
}
xr(["click"]);
//#endregion
//#region src/components/PrefsPopover.svelte
var Vl = /* @__PURE__ */ W("<button> </button>"), Hl = /* @__PURE__ */ W("<div class=\"tm-pop\" role=\"dialog\" aria-label=\"Playback preferences\"><div class=\"title svelte-1dgvwbx\">Playback</div> <div class=\"label svelte-1dgvwbx\">Skip back</div> <div class=\"row svelte-1dgvwbx\" role=\"group\" aria-label=\"Skip back\"></div> <div class=\"label svelte-1dgvwbx\">Skip forward</div> <div class=\"row svelte-1dgvwbx\" role=\"group\" aria-label=\"Skip forward\"></div> <label class=\"toggle-row svelte-1dgvwbx\"><span class=\"svelte-1dgvwbx\"><b>Smart rewind</b><small class=\"svelte-1dgvwbx\">Replay a few seconds when you resume after a break.</small></span> <input type=\"checkbox\" role=\"switch\" class=\"svelte-1dgvwbx\"/></label> <label class=\"toggle-row svelte-1dgvwbx\"><span class=\"svelte-1dgvwbx\"><b>Continuous play</b><small class=\"svelte-1dgvwbx\">When an episode or book ends, play what is up next, or the show's next episode.</small></span> <input type=\"checkbox\" role=\"switch\" class=\"svelte-1dgvwbx\"/></label> <div class=\"foot svelte-1dgvwbx\"><button class=\"link svelte-1dgvwbx\">Keyboard shortcuts</button> <button class=\"link danger svelte-1dgvwbx\">Clear history</button></div></div>"), Ul = {
	hash: "svelte-1dgvwbx",
	code: ".title.svelte-1dgvwbx {font-size:13px;font-weight:650;}.label.svelte-1dgvwbx {font-size:11px;color:var(--tm-muted);margin:12px 0 6px;}.row.svelte-1dgvwbx {display:flex;gap:5px;}.opt.svelte-1dgvwbx {flex:1;height:30px;border-radius:8px;border:0;background:var(--tm-fg-6);color:var(--tm-fg);font-size:11.5px;font-weight:600;cursor:pointer;font-variant-numeric:tabular-nums;}.opt.svelte-1dgvwbx:hover {background:var(--tm-fg-10);}.opt.sel.svelte-1dgvwbx {background:var(--tm-accent);color:var(--tm-on-accent);}.toggle-row.svelte-1dgvwbx {display:flex;align-items:center;gap:12px;margin-top:12px;cursor:pointer;}.toggle-row.svelte-1dgvwbx span:where(.svelte-1dgvwbx) {flex:1;display:flex;flex-direction:column;gap:2px;font-size:12px;}.toggle-row.svelte-1dgvwbx small:where(.svelte-1dgvwbx) {font-size:11px;color:var(--tm-muted);line-height:1.35;}input[type=checkbox].svelte-1dgvwbx {appearance:none;width:34px;height:20px;flex:none;border-radius:10px;background:var(--tm-fg-16);position:relative;cursor:pointer;transition:background .15s;margin:0;}input[type=checkbox].svelte-1dgvwbx::after {content:'';position:absolute;top:3px;left:3px;width:14px;height:14px;border-radius:50%;background:var(--tm-fg);transition:transform .15s;}input[type=checkbox].svelte-1dgvwbx:checked {background:var(--tm-accent);}input[type=checkbox].svelte-1dgvwbx:checked::after {transform:translateX(14px);background:var(--tm-on-accent);}input[type=checkbox].svelte-1dgvwbx:focus-visible {outline:2px solid var(--tm-accent);outline-offset:2px;}.foot.svelte-1dgvwbx {display:flex;justify-content:space-between;margin-top:14px;padding-top:10px;border-top:1px solid var(--tm-fg-8);}.link.svelte-1dgvwbx {border:0;background:none;padding:0;color:var(--tm-accent);font-size:11.5px;cursor:pointer;}.link.danger.svelte-1dgvwbx {color:var(--tm-muted);}.link.danger.svelte-1dgvwbx:hover:not(:disabled) {color:var(--tm-live);}.link.svelte-1dgvwbx:disabled {opacity:.4;cursor:default;}\n  @media (prefers-reduced-motion: reduce) {input[type=checkbox].svelte-1dgvwbx, input[type=checkbox].svelte-1dgvwbx::after {transition:none;} }"
};
function Wl(e, t) {
	We(t, !0), ei(e, Ul);
	let n = Mi(t, "store", 7);
	var r = Hl(), i = R(F(r), 4);
	J(i, 21, () => Ea, Gr, (e, t) => {
		var r = Vl();
		let i;
		var a = L(r);
		z(() => {
			i = Y(r, 1, "opt svelte-1dgvwbx", null, i, { sel: n().prefs.back === H(t) }), X(r, "aria-pressed", n().prefs.back === H(t)), K(a, `${H(t) ?? ""}s`);
		}), U("click", r, () => n().setPref("back", H(t))), G(e, r);
	}), O(i);
	var a = R(i, 4);
	J(a, 21, () => Da, Gr, (e, t) => {
		var r = Vl();
		let i;
		var a = L(r);
		z(() => {
			i = Y(r, 1, "opt svelte-1dgvwbx", null, i, { sel: n().prefs.fwd === H(t) }), X(r, "aria-pressed", n().prefs.fwd === H(t)), K(a, `${H(t) ?? ""}s`);
		}), U("click", r, () => n().setPref("fwd", H(t))), G(e, r);
	}), O(a);
	var o = R(a, 2), s = R(F(o), 2);
	bi(s), O(o);
	var c = R(o, 2), l = R(F(c), 2);
	bi(l), O(c);
	var u = R(c, 2), d = F(u), f = R(d, 2);
	O(u), O(r), z(() => {
		ci(r, t.pos), Si(s, n().prefs.smartRewind), Si(l, n().prefs.continuous), f.disabled = !n().history.length;
	}), U("change", s, (e) => n().setPref("smartRewind", e.currentTarget.checked)), U("change", l, (e) => n().setPref("continuous", e.currentTarget.checked)), U("click", d, () => {
		n().pop = null, n().shortcuts = !0;
	}), U("click", f, () => n().clearHistory()), G(e, r), Ge();
}
xr(["click", "change"]);
//#endregion
//#region src/components/ShortcutsSheet.svelte
var Gl = /* @__PURE__ */ W("<span class=\"to svelte-jfujii\">–</span>"), Kl = /* @__PURE__ */ W("<kbd class=\"svelte-jfujii\"> </kbd>"), ql = /* @__PURE__ */ W("<div class=\"svelte-jfujii\"><dt class=\"svelte-jfujii\"></dt><dd class=\"svelte-jfujii\"> </dd></div>"), Jl = /* @__PURE__ */ W("<div class=\"scrim svelte-jfujii\" role=\"presentation\"><div class=\"sheet svelte-jfujii\" role=\"dialog\" aria-modal=\"true\" aria-label=\"Keyboard shortcuts\" tabindex=\"-1\"><div class=\"head svelte-jfujii\"><h2 class=\"svelte-jfujii\">Keyboard shortcuts</h2><button class=\"x svelte-jfujii\" aria-label=\"Close\">✕</button></div> <dl class=\"svelte-jfujii\"></dl></div></div>"), Yl = {
	hash: "svelte-jfujii",
	code: ".scrim.svelte-jfujii {position:absolute;inset:0;z-index:20;background:rgba(0, 0, 0, .5);display:grid;place-items:center;padding:20px;}.sheet.svelte-jfujii {width:min(460px, 100%);max-height:100%;overflow:auto;padding:20px 22px;border-radius:16px;background:var(--tm-pop);border:1px solid var(--tm-fg-10);box-shadow:0 30px 70px rgba(0, 0, 0, .55);outline:none;}.head.svelte-jfujii {display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}h2.svelte-jfujii {font-size:15px;margin:0;}.x.svelte-jfujii {width:28px;height:28px;border:0;border-radius:8px;background:none;color:var(--tm-muted);cursor:pointer;}.x.svelte-jfujii:hover {background:var(--tm-fg-8);color:var(--tm-fg);}dl.svelte-jfujii {margin:0;display:grid;gap:2px;}dl.svelte-jfujii div:where(.svelte-jfujii) {display:flex;align-items:center;gap:14px;padding:7px 0;border-top:1px solid var(--tm-fg-6);}dt.svelte-jfujii {width:120px;flex:none;display:flex;align-items:center;gap:4px;}dd.svelte-jfujii {margin:0;font-size:12.5px;}kbd.svelte-jfujii {font:600 11px ui-monospace, Menlo, monospace;min-width:22px;text-align:center;padding:3px 6px;border-radius:6px;background:var(--tm-fg-8);border:1px solid var(--tm-fg-14);border-bottom-width:2px;}.to.svelte-jfujii {color:var(--tm-muted);}"
};
function Xl(e, t) {
	We(t, !0), ei(e, Yl);
	let n = Mi(t, "store", 7), r = /* @__PURE__ */ A(() => [
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
	]), i = /* @__PURE__ */ M(void 0);
	_n(() => {
		H(i)?.focus();
	});
	var a = Jl(), o = F(a), s = F(o), c = R(F(s));
	O(s);
	var l = R(s, 2);
	J(l, 21, () => H(r), ([e, t]) => t, (e, t) => {
		var n = /* @__PURE__ */ A(() => m(H(t), 2));
		let r = () => H(n)[0], i = () => H(n)[1];
		var a = ql(), o = F(a);
		J(o, 21, r, Gr, (e, t) => {
			var n = Mr(), r = I(n), i = (e) => {
				G(e, Gl());
			}, a = (e) => {
				var n = Kl(), r = L(n, !0);
				z(() => K(r, H(t))), G(e, n);
			};
			q(r, (e) => {
				H(t) === "–" ? e(i) : e(a, -1);
			}), G(e, n);
		}), O(o);
		var s = L(R(o), !0);
		O(a), z(() => K(s, i())), G(e, a);
	}), O(l), O(o), ji(o, (e) => N(i, e), () => H(i)), O(a), U("click", a, () => n().shortcuts = !1), U("click", o, (e) => e.stopPropagation()), U("keydown", o, (e) => {
		e.key === "Escape" && (e.stopPropagation(), n().shortcuts = !1);
	}), U("click", c, () => n().shortcuts = !1), G(e, a), Ge();
}
xr(["click", "keydown"]);
//#endregion
//#region src/App.svelte
var Zl = /* @__PURE__ */ W("<div class=\"unsupported svelte-1n46o8q\"><strong class=\"svelte-1n46o8q\">Update Tend to use TEND Media.</strong><p>This panel does not provide the OndaCast catalog capability yet. Updating Tend adds it.</p></div>"), Ql = /* @__PURE__ */ W("<!> <div class=\"middle svelte-1n46o8q\"><!> <main class=\"svelte-1n46o8q\"><!></main> <!></div> <!>", 1), $l = /* @__PURE__ */ W("<div role=\"status\"> </div>"), eu = /* @__PURE__ */ W("<div class=\"tend-media svelte-1n46o8q\" tabindex=\"-1\"><!> <!> <!> <!></div>"), tu = {
	hash: "svelte-1n46o8q",
	code: ".tend-media.svelte-1n46o8q {\n    /* Live Tend theme tokens with the TEND Notes dark palette as fallback. */--tm-bg: var(--color-base-100, #151b19);--tm-panel: var(--color-base-200, #1d2622);--tm-fg: var(--color-base-content, #d8e3df);--tm-accent: var(--color-primary, #66b798);--tm-on-accent: var(--color-primary-content, #071a13);--tm-muted: color-mix(in srgb, var(--tm-fg) 64%, var(--tm-bg));--tm-brand: #0f766e;--tm-live: #ff6b6b;--tm-fg-4: color-mix(in srgb, var(--tm-fg) 4.5%, transparent);--tm-fg-5: color-mix(in srgb, var(--tm-fg) 5%, transparent);--tm-fg-6: color-mix(in srgb, var(--tm-fg) 6%, transparent);--tm-fg-7: color-mix(in srgb, var(--tm-fg) 7%, transparent);--tm-fg-8: color-mix(in srgb, var(--tm-fg) 8%, transparent);--tm-fg-10: color-mix(in srgb, var(--tm-fg) 10%, transparent);--tm-fg-12: color-mix(in srgb, var(--tm-fg) 12%, transparent);--tm-fg-14: color-mix(in srgb, var(--tm-fg) 14%, transparent);--tm-fg-16: color-mix(in srgb, var(--tm-fg) 16%, transparent);--tm-fg-18: color-mix(in srgb, var(--tm-fg) 18%, transparent);--tm-fg-45: color-mix(in srgb, var(--tm-fg) 45%, transparent);--tm-accent-7: color-mix(in srgb, var(--tm-accent) 7%, transparent);--tm-accent-8: color-mix(in srgb, var(--tm-accent) 8%, transparent);--tm-accent-12: color-mix(in srgb, var(--tm-accent) 12%, transparent);--tm-accent-14: color-mix(in srgb, var(--tm-accent) 14%, transparent);--tm-pop: color-mix(in srgb, var(--tm-fg) 3.5%, var(--tm-panel));\n    /* The panel's window glass: --tend-panel-surface-alpha is 0% for a glass\n       window and 100% for a solid one. The main surface follows it exactly;\n       bars and side panels keep a light tint so the layout still reads. */--tm-alpha: var(--tend-panel-surface-alpha, 100%);--tm-surface: color-mix(in srgb, var(--tm-bg) var(--tm-alpha), transparent);--tm-panel-surface: color-mix(in srgb, var(--tm-panel) max(var(--tm-alpha), 45%), transparent);position:relative;height:100%;width:100%;overflow:hidden;display:flex;flex-direction:column;background:var(--tm-surface);color:var(--tm-fg);font-family:system-ui, -apple-system, \"Segoe UI\", sans-serif;font-size:13px;-webkit-font-smoothing:antialiased;outline:none;}.tend-media.svelte-1n46o8q * {box-sizing:border-box;}.tend-media.svelte-1n46o8q button {font-family:inherit;}.tend-media.svelte-1n46o8q button:focus-visible {outline:2px solid var(--tm-accent);outline-offset:2px;}.tend-media.svelte-1n46o8q .tm-pop {position:absolute;width:250px;padding:14px;border-radius:14px;z-index:5;background:var(--tm-pop);border:1px solid var(--tm-fg-10);box-shadow:0 20px 50px rgba(0, 0, 0, .5);}.toast.low.svelte-1n46o8q {bottom:20px;}.unsupported.svelte-1n46o8q {margin:auto;max-width:360px;text-align:center;padding:24px;font-size:13px;color:var(--tm-muted);}.unsupported.svelte-1n46o8q strong:where(.svelte-1n46o8q) {display:block;color:var(--tm-fg);font-size:15px;margin-bottom:6px;}.middle.svelte-1n46o8q {flex:1;min-height:0;display:flex;}main.svelte-1n46o8q {flex:1;min-width:0;overflow:auto;padding:26px 28px 28px;container-type:inline-size;}.toast.svelte-1n46o8q {position:absolute;left:50%;bottom:96px;transform:translateX(-50%);padding:10px 16px;border-radius:10px;background:var(--tm-fg);color:var(--tm-bg);font-size:12.5px;font-weight:600;box-shadow:0 12px 30px rgba(0, 0, 0, .4);z-index:6;white-space:nowrap;max-width:calc(100% - 32px);overflow:hidden;text-overflow:ellipsis;}"
};
function nu(e, t) {
	We(t, !0), ei(e, tu);
	let n = Mi(t, "narrow", 7, !1), r = new Pa(t.host), i = /* @__PURE__ */ M(void 0);
	Ni(() => (r.start(), () => r.destroy())), _n(() => {
		r.tab, r.showSlug, r.bookId, r.libKind, H(i)?.scrollTo(0, 0);
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
	}, f = eu(), p = F(f), m = (e) => {
		G(e, Zl());
	}, h = (e) => {
		Bl(e, { get store() {
			return r;
		} });
	}, g = (e) => {
		var t = Ql(), n = I(t);
		za(n, { get store() {
			return r;
		} });
		var a = R(n, 2), o = F(a);
		Xa(o, { get store() {
			return r;
		} });
		var s = R(o, 2), c = F(s), l = (e) => {
			Tc(e, { get store() {
				return r;
			} });
		}, u = /* @__PURE__ */ A(() => r.query.trim()), d = (e) => {
			To(e, { get store() {
				return r;
			} });
		}, f = (e) => {
			hs(e, { get store() {
				return r;
			} });
		}, p = (e) => {
			Ss(e, { get store() {
				return r;
			} });
		}, m = (e) => {
			Ys(e, { get store() {
				return r;
			} });
		}, h = (e) => {
			_c(e, { get store() {
				return r;
			} });
		};
		q(c, (e) => {
			H(u) ? e(l) : r.tab === "home" ? e(d, 1) : r.tab === "mine" ? e(f, 2) : r.tab === "radio" ? e(p, 3) : r.tab === "pod" ? e(m, 4) : e(h, -1);
		}), O(s), ji(s, (e) => N(i, e), () => H(i)), cl(R(s, 2), { get store() {
			return r;
		} }), O(a), Dl(R(a, 2), { get store() {
			return r;
		} }), G(e, t);
	};
	q(p, (e) => {
		r.supported ? n() ? e(h, 1) : e(g, -1) : e(m);
	});
	var _ = R(p, 2), v = (e) => {
		Wl(e, {
			get store() {
				return r;
			},
			pos: "right:12px;top:42px;width:290px"
		});
	};
	q(_, (e) => {
		r.pop === "prefs" && e(v);
	});
	var y = R(_, 2), b = (e) => {
		Xl(e, { get store() {
			return r;
		} });
	};
	q(y, (e) => {
		r.shortcuts && e(b);
	});
	var x = R(y, 2), S = (e) => {
		var t = $l();
		let i;
		var a = L(t, !0);
		z(() => {
			i = Y(t, 1, "toast svelte-1n46o8q", null, i, { low: n() }), K(a, r.toast);
		}), G(e, t);
	};
	return q(x, (e) => {
		r.toast && e(S);
	}), O(f), U("keydown", f, l), U("pointerdown", f, u), G(e, f), Ge(d);
}
xr(["keydown", "pointerdown"]);
//#endregion
//#region src/index.ts
var ru = 640;
function iu(e) {
	let t = null, n = null;
	async function r() {
		n?.disconnect(), n = null;
		let e = t;
		if (t = null, e) try {
			await e.shutdown();
		} finally {
			await Vr(e);
		}
	}
	return e.onUnmount?.(r), {
		mount(i) {
			let a = i.shadowRoot ?? i.attachShadow({ mode: "open" }), o = document.createElement("div");
			return o.style.cssText = "height:100%;width:100%", a.replaceChildren(o), i.style.display = i.style.display || "block", t = Lr(nu, {
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
export { ru as NARROW_WIDTH, iu as activate };
