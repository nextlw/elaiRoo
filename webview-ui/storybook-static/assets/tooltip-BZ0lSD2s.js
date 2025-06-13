import { j as p } from "./jsx-runtime-ClZEHPQQ.js"
import { r as a, R as Ne } from "./index-Cqyox1Tj.js"
import { c as X } from "./utils-CytzSlOG.js"
import {
	f as q,
	P as H,
	d as L,
	h as so,
	g as Ft,
	u as Je,
	a as ue,
	b as re,
	e as ae,
	i as ct,
	j as Ls,
	k as co,
	c as lo,
	l as Oe,
	m as js,
} from "./createLucideIcon-B4nlfPec.js"
import "./autosize-textarea-69dnNYfc.js"
import { h as Fs, r as $s } from "./index-C2TgfdXk.js"
function xe(e) {
	const t = a.useRef(e)
	return (
		a.useEffect(() => {
			t.current = e
		}),
		a.useMemo(
			() =>
				(...r) => {
					var n
					return (n = t.current) == null ? void 0 : n.call(t, ...r)
				},
			[],
		)
	)
}
function Bs(e, t = globalThis == null ? void 0 : globalThis.document) {
	const r = xe(e)
	a.useEffect(() => {
		const n = (o) => {
			o.key === "Escape" && r(o)
		}
		return (
			t.addEventListener("keydown", n, { capture: !0 }),
			() => t.removeEventListener("keydown", n, { capture: !0 })
		)
	}, [r, t])
}
var Hs = "DismissableLayer",
	Pr = "dismissableLayer.update",
	Vs = "dismissableLayer.pointerDownOutside",
	zs = "dismissableLayer.focusOutside",
	_n,
	uo = a.createContext({ layers: new Set(), layersWithOutsidePointerEventsDisabled: new Set(), branches: new Set() }),
	gt = a.forwardRef((e, t) => {
		const {
				disableOutsidePointerEvents: r = !1,
				onEscapeKeyDown: n,
				onPointerDownOutside: o,
				onFocusOutside: i,
				onInteractOutside: s,
				onDismiss: c,
				...d
			} = e,
			l = a.useContext(uo),
			[u, f] = a.useState(null),
			m = (u == null ? void 0 : u.ownerDocument) ?? (globalThis == null ? void 0 : globalThis.document),
			[, g] = a.useState({}),
			x = q(t, (S) => f(S)),
			h = Array.from(l.layers),
			[v] = [...l.layersWithOutsidePointerEventsDisabled].slice(-1),
			w = h.indexOf(v),
			b = u ? h.indexOf(u) : -1,
			C = l.layersWithOutsidePointerEventsDisabled.size > 0,
			E = b >= w,
			R = Ws((S) => {
				const _ = S.target,
					$ = [...l.branches].some((T) => T.contains(_))
				!E || $ || (o == null || o(S), s == null || s(S), S.defaultPrevented || c == null || c())
			}, m),
			M = Gs((S) => {
				const _ = S.target
				;[...l.branches].some((T) => T.contains(_)) ||
					(i == null || i(S), s == null || s(S), S.defaultPrevented || c == null || c())
			}, m)
		return (
			Bs((S) => {
				b === l.layers.size - 1 && (n == null || n(S), !S.defaultPrevented && c && (S.preventDefault(), c()))
			}, m),
			a.useEffect(() => {
				if (u)
					return (
						r &&
							(l.layersWithOutsidePointerEventsDisabled.size === 0 &&
								((_n = m.body.style.pointerEvents), (m.body.style.pointerEvents = "none")),
							l.layersWithOutsidePointerEventsDisabled.add(u)),
						l.layers.add(u),
						Nn(),
						() => {
							r &&
								l.layersWithOutsidePointerEventsDisabled.size === 1 &&
								(m.body.style.pointerEvents = _n)
						}
					)
			}, [u, m, r, l]),
			a.useEffect(
				() => () => {
					u && (l.layers.delete(u), l.layersWithOutsidePointerEventsDisabled.delete(u), Nn())
				},
				[u, l],
			),
			a.useEffect(() => {
				const S = () => g({})
				return document.addEventListener(Pr, S), () => document.removeEventListener(Pr, S)
			}, []),
			p.jsx(H.div, {
				...d,
				ref: x,
				style: { pointerEvents: C ? (E ? "auto" : "none") : void 0, ...e.style },
				onFocusCapture: L(e.onFocusCapture, M.onFocusCapture),
				onBlurCapture: L(e.onBlurCapture, M.onBlurCapture),
				onPointerDownCapture: L(e.onPointerDownCapture, R.onPointerDownCapture),
			})
		)
	})
gt.displayName = Hs
var Ks = "DismissableLayerBranch",
	Us = a.forwardRef((e, t) => {
		const r = a.useContext(uo),
			n = a.useRef(null),
			o = q(t, n)
		return (
			a.useEffect(() => {
				const i = n.current
				if (i)
					return (
						r.branches.add(i),
						() => {
							r.branches.delete(i)
						}
					)
			}, [r.branches]),
			p.jsx(H.div, { ...e, ref: o })
		)
	})
Us.displayName = Ks
function Ws(e, t = globalThis == null ? void 0 : globalThis.document) {
	const r = xe(e),
		n = a.useRef(!1),
		o = a.useRef(() => {})
	return (
		a.useEffect(() => {
			const i = (c) => {
					if (c.target && !n.current) {
						let d = function () {
							fo(Vs, r, l, { discrete: !0 })
						}
						const l = { originalEvent: c }
						c.pointerType === "touch"
							? (t.removeEventListener("click", o.current),
								(o.current = d),
								t.addEventListener("click", o.current, { once: !0 }))
							: d()
					} else t.removeEventListener("click", o.current)
					n.current = !1
				},
				s = window.setTimeout(() => {
					t.addEventListener("pointerdown", i)
				}, 0)
			return () => {
				window.clearTimeout(s),
					t.removeEventListener("pointerdown", i),
					t.removeEventListener("click", o.current)
			}
		}, [t, r]),
		{ onPointerDownCapture: () => (n.current = !0) }
	)
}
function Gs(e, t = globalThis == null ? void 0 : globalThis.document) {
	const r = xe(e),
		n = a.useRef(!1)
	return (
		a.useEffect(() => {
			const o = (i) => {
				i.target && !n.current && fo(zs, r, { originalEvent: i }, { discrete: !1 })
			}
			return t.addEventListener("focusin", o), () => t.removeEventListener("focusin", o)
		}, [t, r]),
		{ onFocusCapture: () => (n.current = !0), onBlurCapture: () => (n.current = !1) }
	)
}
function Nn() {
	const e = new CustomEvent(Pr)
	document.dispatchEvent(e)
}
function fo(e, t, r, { discrete: n }) {
	const o = r.originalEvent.target,
		i = new CustomEvent(e, { bubbles: !1, cancelable: !0, detail: r })
	t && o.addEventListener(e, t, { once: !0 }), n ? so(o, i) : o.dispatchEvent(i)
}
var fr = "focusScope.autoFocusOnMount",
	pr = "focusScope.autoFocusOnUnmount",
	In = { bubbles: !1, cancelable: !0 },
	Ys = "FocusScope",
	Zt = a.forwardRef((e, t) => {
		const { loop: r = !1, trapped: n = !1, onMountAutoFocus: o, onUnmountAutoFocus: i, ...s } = e,
			[c, d] = a.useState(null),
			l = xe(o),
			u = xe(i),
			f = a.useRef(null),
			m = q(t, (h) => d(h)),
			g = a.useRef({
				paused: !1,
				pause() {
					this.paused = !0
				},
				resume() {
					this.paused = !1
				},
			}).current
		a.useEffect(() => {
			if (n) {
				let h = function (C) {
						if (g.paused || !c) return
						const E = C.target
						c.contains(E) ? (f.current = E) : Ce(f.current, { select: !0 })
					},
					v = function (C) {
						if (g.paused || !c) return
						const E = C.relatedTarget
						E !== null && (c.contains(E) || Ce(f.current, { select: !0 }))
					},
					w = function (C) {
						if (document.activeElement === document.body)
							for (const R of C) R.removedNodes.length > 0 && Ce(c)
					}
				document.addEventListener("focusin", h), document.addEventListener("focusout", v)
				const b = new MutationObserver(w)
				return (
					c && b.observe(c, { childList: !0, subtree: !0 }),
					() => {
						document.removeEventListener("focusin", h),
							document.removeEventListener("focusout", v),
							b.disconnect()
					}
				)
			}
		}, [n, c, g.paused]),
			a.useEffect(() => {
				if (c) {
					Tn.add(g)
					const h = document.activeElement
					if (!c.contains(h)) {
						const w = new CustomEvent(fr, In)
						c.addEventListener(fr, l),
							c.dispatchEvent(w),
							w.defaultPrevented || (Zs(ec(po(c)), { select: !0 }), document.activeElement === h && Ce(c))
					}
					return () => {
						c.removeEventListener(fr, l),
							setTimeout(() => {
								const w = new CustomEvent(pr, In)
								c.addEventListener(pr, u),
									c.dispatchEvent(w),
									w.defaultPrevented || Ce(h ?? document.body, { select: !0 }),
									c.removeEventListener(pr, u),
									Tn.remove(g)
							}, 0)
					}
				}
			}, [c, l, u, g])
		const x = a.useCallback(
			(h) => {
				if ((!r && !n) || g.paused) return
				const v = h.key === "Tab" && !h.altKey && !h.ctrlKey && !h.metaKey,
					w = document.activeElement
				if (v && w) {
					const b = h.currentTarget,
						[C, E] = qs(b)
					C && E
						? !h.shiftKey && w === E
							? (h.preventDefault(), r && Ce(C, { select: !0 }))
							: h.shiftKey && w === C && (h.preventDefault(), r && Ce(E, { select: !0 }))
						: w === b && h.preventDefault()
				}
			},
			[r, n, g.paused],
		)
		return p.jsx(H.div, { tabIndex: -1, ...s, ref: m, onKeyDown: x })
	})
Zt.displayName = Ys
function Zs(e, { select: t = !1 } = {}) {
	const r = document.activeElement
	for (const n of e) if ((Ce(n, { select: t }), document.activeElement !== r)) return
}
function qs(e) {
	const t = po(e),
		r = On(t, e),
		n = On(t.reverse(), e)
	return [r, n]
}
function po(e) {
	const t = [],
		r = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
			acceptNode: (n) => {
				const o = n.tagName === "INPUT" && n.type === "hidden"
				return n.disabled || n.hidden || o
					? NodeFilter.FILTER_SKIP
					: n.tabIndex >= 0
						? NodeFilter.FILTER_ACCEPT
						: NodeFilter.FILTER_SKIP
			},
		})
	for (; r.nextNode(); ) t.push(r.currentNode)
	return t
}
function On(e, t) {
	for (const r of e) if (!Xs(r, { upTo: t })) return r
}
function Xs(e, { upTo: t }) {
	if (getComputedStyle(e).visibility === "hidden") return !0
	for (; e; ) {
		if (t !== void 0 && e === t) return !1
		if (getComputedStyle(e).display === "none") return !0
		e = e.parentElement
	}
	return !1
}
function Qs(e) {
	return e instanceof HTMLInputElement && "select" in e
}
function Ce(e, { select: t = !1 } = {}) {
	if (e && e.focus) {
		const r = document.activeElement
		e.focus({ preventScroll: !0 }), e !== r && Qs(e) && t && e.select()
	}
}
var Tn = Js()
function Js() {
	let e = []
	return {
		add(t) {
			const r = e[0]
			t !== r && (r == null || r.pause()), (e = Dn(e, t)), e.unshift(t)
		},
		remove(t) {
			var r
			;(e = Dn(e, t)), (r = e[0]) == null || r.resume()
		},
	}
}
function Dn(e, t) {
	const r = [...e],
		n = r.indexOf(t)
	return n !== -1 && r.splice(n, 1), r
}
function ec(e) {
	return e.filter((t) => t.tagName !== "A")
}
var tc = "Portal",
	vt = a.forwardRef((e, t) => {
		var c
		const { container: r, ...n } = e,
			[o, i] = a.useState(!1)
		Ft(() => i(!0), [])
		const s = r || (o && ((c = globalThis == null ? void 0 : globalThis.document) == null ? void 0 : c.body))
		return s ? Fs.createPortal(p.jsx(H.div, { ...n, ref: t }), s) : null
	})
vt.displayName = tc
var mr = 0
function zr() {
	a.useEffect(() => {
		const e = document.querySelectorAll("[data-radix-focus-guard]")
		return (
			document.body.insertAdjacentElement("afterbegin", e[0] ?? kn()),
			document.body.insertAdjacentElement("beforeend", e[1] ?? kn()),
			mr++,
			() => {
				mr === 1 && document.querySelectorAll("[data-radix-focus-guard]").forEach((t) => t.remove()), mr--
			}
		)
	}, [])
}
function kn() {
	const e = document.createElement("span")
	return (
		e.setAttribute("data-radix-focus-guard", ""),
		(e.tabIndex = 0),
		(e.style.outline = "none"),
		(e.style.opacity = "0"),
		(e.style.position = "fixed"),
		(e.style.pointerEvents = "none"),
		e
	)
}
var pe = function () {
	return (
		(pe =
			Object.assign ||
			function (t) {
				for (var r, n = 1, o = arguments.length; n < o; n++) {
					r = arguments[n]
					for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (t[i] = r[i])
				}
				return t
			}),
		pe.apply(this, arguments)
	)
}
function mo(e, t) {
	var r = {}
	for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && t.indexOf(n) < 0 && (r[n] = e[n])
	if (e != null && typeof Object.getOwnPropertySymbols == "function")
		for (var o = 0, n = Object.getOwnPropertySymbols(e); o < n.length; o++)
			t.indexOf(n[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, n[o]) && (r[n[o]] = e[n[o]])
	return r
}
function rc(e, t, r) {
	if (r || arguments.length === 2)
		for (var n = 0, o = t.length, i; n < o; n++)
			(i || !(n in t)) && (i || (i = Array.prototype.slice.call(t, 0, n)), (i[n] = t[n]))
	return e.concat(i || Array.prototype.slice.call(t))
}
var kt = "right-scroll-bar-position",
	Lt = "width-before-scroll-bar",
	nc = "with-scroll-bars-hidden",
	oc = "--removed-body-scroll-bar-size"
function hr(e, t) {
	return typeof e == "function" ? e(t) : e && (e.current = t), e
}
function ic(e, t) {
	var r = a.useState(function () {
		return {
			value: e,
			callback: t,
			facade: {
				get current() {
					return r.value
				},
				set current(n) {
					var o = r.value
					o !== n && ((r.value = n), r.callback(n, o))
				},
			},
		}
	})[0]
	return (r.callback = t), r.facade
}
var ac = typeof window < "u" ? a.useLayoutEffect : a.useEffect,
	Ln = new WeakMap()
function sc(e, t) {
	var r = ic(null, function (n) {
		return e.forEach(function (o) {
			return hr(o, n)
		})
	})
	return (
		ac(
			function () {
				var n = Ln.get(r)
				if (n) {
					var o = new Set(n),
						i = new Set(e),
						s = r.current
					o.forEach(function (c) {
						i.has(c) || hr(c, null)
					}),
						i.forEach(function (c) {
							o.has(c) || hr(c, s)
						})
				}
				Ln.set(r, e)
			},
			[e],
		),
		r
	)
}
function cc(e) {
	return e
}
function lc(e, t) {
	t === void 0 && (t = cc)
	var r = [],
		n = !1,
		o = {
			read: function () {
				if (n)
					throw new Error(
						"Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.",
					)
				return r.length ? r[r.length - 1] : e
			},
			useMedium: function (i) {
				var s = t(i, n)
				return (
					r.push(s),
					function () {
						r = r.filter(function (c) {
							return c !== s
						})
					}
				)
			},
			assignSyncMedium: function (i) {
				for (n = !0; r.length; ) {
					var s = r
					;(r = []), s.forEach(i)
				}
				r = {
					push: function (c) {
						return i(c)
					},
					filter: function () {
						return r
					},
				}
			},
			assignMedium: function (i) {
				n = !0
				var s = []
				if (r.length) {
					var c = r
					;(r = []), c.forEach(i), (s = r)
				}
				var d = function () {
						var u = s
						;(s = []), u.forEach(i)
					},
					l = function () {
						return Promise.resolve().then(d)
					}
				l(),
					(r = {
						push: function (u) {
							s.push(u), l()
						},
						filter: function (u) {
							return (s = s.filter(u)), r
						},
					})
			},
		}
	return o
}
function uc(e) {
	e === void 0 && (e = {})
	var t = lc(null)
	return (t.options = pe({ async: !0, ssr: !1 }, e)), t
}
var ho = function (e) {
	var t = e.sideCar,
		r = mo(e, ["sideCar"])
	if (!t) throw new Error("Sidecar: please provide `sideCar` property to import the right car")
	var n = t.read()
	if (!n) throw new Error("Sidecar medium not found")
	return a.createElement(n, pe({}, r))
}
ho.isSideCarExport = !0
function dc(e, t) {
	return e.useMedium(t), ho
}
var go = uc(),
	gr = function () {},
	qt = a.forwardRef(function (e, t) {
		var r = a.useRef(null),
			n = a.useState({ onScrollCapture: gr, onWheelCapture: gr, onTouchMoveCapture: gr }),
			o = n[0],
			i = n[1],
			s = e.forwardProps,
			c = e.children,
			d = e.className,
			l = e.removeScrollBar,
			u = e.enabled,
			f = e.shards,
			m = e.sideCar,
			g = e.noIsolation,
			x = e.inert,
			h = e.allowPinchZoom,
			v = e.as,
			w = v === void 0 ? "div" : v,
			b = e.gapMode,
			C = mo(e, [
				"forwardProps",
				"children",
				"className",
				"removeScrollBar",
				"enabled",
				"shards",
				"sideCar",
				"noIsolation",
				"inert",
				"allowPinchZoom",
				"as",
				"gapMode",
			]),
			E = m,
			R = sc([r, t]),
			M = pe(pe({}, C), o)
		return a.createElement(
			a.Fragment,
			null,
			u &&
				a.createElement(E, {
					sideCar: go,
					removeScrollBar: l,
					shards: f,
					noIsolation: g,
					inert: x,
					setCallbacks: i,
					allowPinchZoom: !!h,
					lockRef: r,
					gapMode: b,
				}),
			s
				? a.cloneElement(a.Children.only(c), pe(pe({}, M), { ref: R }))
				: a.createElement(w, pe({}, M, { className: d, ref: R }), c),
		)
	})
qt.defaultProps = { enabled: !0, removeScrollBar: !0, inert: !1 }
qt.classNames = { fullWidth: Lt, zeroRight: kt }
var fc = function () {
	if (typeof __webpack_nonce__ < "u") return __webpack_nonce__
}
function pc() {
	if (!document) return null
	var e = document.createElement("style")
	e.type = "text/css"
	var t = fc()
	return t && e.setAttribute("nonce", t), e
}
function mc(e, t) {
	e.styleSheet ? (e.styleSheet.cssText = t) : e.appendChild(document.createTextNode(t))
}
function hc(e) {
	var t = document.head || document.getElementsByTagName("head")[0]
	t.appendChild(e)
}
var gc = function () {
		var e = 0,
			t = null
		return {
			add: function (r) {
				e == 0 && (t = pc()) && (mc(t, r), hc(t)), e++
			},
			remove: function () {
				e--, !e && t && (t.parentNode && t.parentNode.removeChild(t), (t = null))
			},
		}
	},
	vc = function () {
		var e = gc()
		return function (t, r) {
			a.useEffect(
				function () {
					return (
						e.add(t),
						function () {
							e.remove()
						}
					)
				},
				[t && r],
			)
		}
	},
	vo = function () {
		var e = vc(),
			t = function (r) {
				var n = r.styles,
					o = r.dynamic
				return e(n, o), null
			}
		return t
	},
	xc = { left: 0, top: 0, right: 0, gap: 0 },
	vr = function (e) {
		return parseInt(e || "", 10) || 0
	},
	wc = function (e) {
		var t = window.getComputedStyle(document.body),
			r = t[e === "padding" ? "paddingLeft" : "marginLeft"],
			n = t[e === "padding" ? "paddingTop" : "marginTop"],
			o = t[e === "padding" ? "paddingRight" : "marginRight"]
		return [vr(r), vr(n), vr(o)]
	},
	yc = function (e) {
		if ((e === void 0 && (e = "margin"), typeof window > "u")) return xc
		var t = wc(e),
			r = document.documentElement.clientWidth,
			n = window.innerWidth
		return { left: t[0], top: t[1], right: t[2], gap: Math.max(0, n - r + t[2] - t[0]) }
	},
	bc = vo(),
	Ge = "data-scroll-locked",
	Cc = function (e, t, r, n) {
		var o = e.left,
			i = e.top,
			s = e.right,
			c = e.gap
		return (
			r === void 0 && (r = "margin"),
			`
  .`
				.concat(
					nc,
					` {
   overflow: hidden `,
				)
				.concat(
					n,
					`;
   padding-right: `,
				)
				.concat(c, "px ")
				.concat(
					n,
					`;
  }
  body[`,
				)
				.concat(
					Ge,
					`] {
    overflow: hidden `,
				)
				.concat(
					n,
					`;
    overscroll-behavior: contain;
    `,
				)
				.concat(
					[
						t && "position: relative ".concat(n, ";"),
						r === "margin" &&
							`
    padding-left: `
								.concat(
									o,
									`px;
    padding-top: `,
								)
								.concat(
									i,
									`px;
    padding-right: `,
								)
								.concat(
									s,
									`px;
    margin-left:0;
    margin-top:0;
    margin-right: `,
								)
								.concat(c, "px ")
								.concat(
									n,
									`;
    `,
								),
						r === "padding" && "padding-right: ".concat(c, "px ").concat(n, ";"),
					]
						.filter(Boolean)
						.join(""),
					`
  }
  
  .`,
				)
				.concat(
					kt,
					` {
    right: `,
				)
				.concat(c, "px ")
				.concat(
					n,
					`;
  }
  
  .`,
				)
				.concat(
					Lt,
					` {
    margin-right: `,
				)
				.concat(c, "px ")
				.concat(
					n,
					`;
  }
  
  .`,
				)
				.concat(kt, " .")
				.concat(
					kt,
					` {
    right: 0 `,
				)
				.concat(
					n,
					`;
  }
  
  .`,
				)
				.concat(Lt, " .")
				.concat(
					Lt,
					` {
    margin-right: 0 `,
				)
				.concat(
					n,
					`;
  }
  
  body[`,
				)
				.concat(
					Ge,
					`] {
    `,
				)
				.concat(oc, ": ")
				.concat(
					c,
					`px;
  }
`,
				)
		)
	},
	jn = function () {
		var e = parseInt(document.body.getAttribute(Ge) || "0", 10)
		return isFinite(e) ? e : 0
	},
	Ec = function () {
		a.useEffect(function () {
			return (
				document.body.setAttribute(Ge, (jn() + 1).toString()),
				function () {
					var e = jn() - 1
					e <= 0 ? document.body.removeAttribute(Ge) : document.body.setAttribute(Ge, e.toString())
				}
			)
		}, [])
	},
	Rc = function (e) {
		var t = e.noRelative,
			r = e.noImportant,
			n = e.gapMode,
			o = n === void 0 ? "margin" : n
		Ec()
		var i = a.useMemo(
			function () {
				return yc(o)
			},
			[o],
		)
		return a.createElement(bc, { styles: Cc(i, !t, o, r ? "" : "!important") })
	},
	Mr = !1
if (typeof window < "u")
	try {
		var Nt = Object.defineProperty({}, "passive", {
			get: function () {
				return (Mr = !0), !0
			},
		})
		window.addEventListener("test", Nt, Nt), window.removeEventListener("test", Nt, Nt)
	} catch {
		Mr = !1
	}
var He = Mr ? { passive: !1 } : !1,
	Sc = function (e) {
		return e.tagName === "TEXTAREA"
	},
	xo = function (e, t) {
		if (!(e instanceof Element)) return !1
		var r = window.getComputedStyle(e)
		return r[t] !== "hidden" && !(r.overflowY === r.overflowX && !Sc(e) && r[t] === "visible")
	},
	Pc = function (e) {
		return xo(e, "overflowY")
	},
	Mc = function (e) {
		return xo(e, "overflowX")
	},
	Fn = function (e, t) {
		var r = t.ownerDocument,
			n = t
		do {
			typeof ShadowRoot < "u" && n instanceof ShadowRoot && (n = n.host)
			var o = wo(e, n)
			if (o) {
				var i = yo(e, n),
					s = i[1],
					c = i[2]
				if (s > c) return !0
			}
			n = n.parentNode
		} while (n && n !== r.body)
		return !1
	},
	Ac = function (e) {
		var t = e.scrollTop,
			r = e.scrollHeight,
			n = e.clientHeight
		return [t, r, n]
	},
	_c = function (e) {
		var t = e.scrollLeft,
			r = e.scrollWidth,
			n = e.clientWidth
		return [t, r, n]
	},
	wo = function (e, t) {
		return e === "v" ? Pc(t) : Mc(t)
	},
	yo = function (e, t) {
		return e === "v" ? Ac(t) : _c(t)
	},
	Nc = function (e, t) {
		return e === "h" && t === "rtl" ? -1 : 1
	},
	Ic = function (e, t, r, n, o) {
		var i = Nc(e, window.getComputedStyle(t).direction),
			s = i * n,
			c = r.target,
			d = t.contains(c),
			l = !1,
			u = s > 0,
			f = 0,
			m = 0
		do {
			var g = yo(e, c),
				x = g[0],
				h = g[1],
				v = g[2],
				w = h - v - i * x
			;(x || w) && wo(e, c) && ((f += w), (m += x)), c instanceof ShadowRoot ? (c = c.host) : (c = c.parentNode)
		} while ((!d && c !== document.body) || (d && (t.contains(c) || t === c)))
		return ((u && Math.abs(f) < 1) || (!u && Math.abs(m) < 1)) && (l = !0), l
	},
	It = function (e) {
		return "changedTouches" in e ? [e.changedTouches[0].clientX, e.changedTouches[0].clientY] : [0, 0]
	},
	$n = function (e) {
		return [e.deltaX, e.deltaY]
	},
	Bn = function (e) {
		return e && "current" in e ? e.current : e
	},
	Oc = function (e, t) {
		return e[0] === t[0] && e[1] === t[1]
	},
	Tc = function (e) {
		return `
  .block-interactivity-`
			.concat(
				e,
				` {pointer-events: none;}
  .allow-interactivity-`,
			)
			.concat(
				e,
				` {pointer-events: all;}
`,
			)
	},
	Dc = 0,
	Ve = []
function kc(e) {
	var t = a.useRef([]),
		r = a.useRef([0, 0]),
		n = a.useRef(),
		o = a.useState(Dc++)[0],
		i = a.useState(vo)[0],
		s = a.useRef(e)
	a.useEffect(
		function () {
			s.current = e
		},
		[e],
	),
		a.useEffect(
			function () {
				if (e.inert) {
					document.body.classList.add("block-interactivity-".concat(o))
					var h = rc([e.lockRef.current], (e.shards || []).map(Bn), !0).filter(Boolean)
					return (
						h.forEach(function (v) {
							return v.classList.add("allow-interactivity-".concat(o))
						}),
						function () {
							document.body.classList.remove("block-interactivity-".concat(o)),
								h.forEach(function (v) {
									return v.classList.remove("allow-interactivity-".concat(o))
								})
						}
					)
				}
			},
			[e.inert, e.lockRef.current, e.shards],
		)
	var c = a.useCallback(function (h, v) {
			if (("touches" in h && h.touches.length === 2) || (h.type === "wheel" && h.ctrlKey))
				return !s.current.allowPinchZoom
			var w = It(h),
				b = r.current,
				C = "deltaX" in h ? h.deltaX : b[0] - w[0],
				E = "deltaY" in h ? h.deltaY : b[1] - w[1],
				R,
				M = h.target,
				S = Math.abs(C) > Math.abs(E) ? "h" : "v"
			if ("touches" in h && S === "h" && M.type === "range") return !1
			var _ = Fn(S, M)
			if (!_) return !0
			if ((_ ? (R = S) : ((R = S === "v" ? "h" : "v"), (_ = Fn(S, M))), !_)) return !1
			if ((!n.current && "changedTouches" in h && (C || E) && (n.current = R), !R)) return !0
			var $ = n.current || R
			return Ic($, v, h, $ === "h" ? C : E)
		}, []),
		d = a.useCallback(function (h) {
			var v = h
			if (!(!Ve.length || Ve[Ve.length - 1] !== i)) {
				var w = "deltaY" in v ? $n(v) : It(v),
					b = t.current.filter(function (R) {
						return (
							R.name === v.type &&
							(R.target === v.target || v.target === R.shadowParent) &&
							Oc(R.delta, w)
						)
					})[0]
				if (b && b.should) {
					v.cancelable && v.preventDefault()
					return
				}
				if (!b) {
					var C = (s.current.shards || [])
							.map(Bn)
							.filter(Boolean)
							.filter(function (R) {
								return R.contains(v.target)
							}),
						E = C.length > 0 ? c(v, C[0]) : !s.current.noIsolation
					E && v.cancelable && v.preventDefault()
				}
			}
		}, []),
		l = a.useCallback(function (h, v, w, b) {
			var C = { name: h, delta: v, target: w, should: b, shadowParent: Lc(w) }
			t.current.push(C),
				setTimeout(function () {
					t.current = t.current.filter(function (E) {
						return E !== C
					})
				}, 1)
		}, []),
		u = a.useCallback(function (h) {
			;(r.current = It(h)), (n.current = void 0)
		}, []),
		f = a.useCallback(function (h) {
			l(h.type, $n(h), h.target, c(h, e.lockRef.current))
		}, []),
		m = a.useCallback(function (h) {
			l(h.type, It(h), h.target, c(h, e.lockRef.current))
		}, [])
	a.useEffect(function () {
		return (
			Ve.push(i),
			e.setCallbacks({ onScrollCapture: f, onWheelCapture: f, onTouchMoveCapture: m }),
			document.addEventListener("wheel", d, He),
			document.addEventListener("touchmove", d, He),
			document.addEventListener("touchstart", u, He),
			function () {
				;(Ve = Ve.filter(function (h) {
					return h !== i
				})),
					document.removeEventListener("wheel", d, He),
					document.removeEventListener("touchmove", d, He),
					document.removeEventListener("touchstart", u, He)
			}
		)
	}, [])
	var g = e.removeScrollBar,
		x = e.inert
	return a.createElement(
		a.Fragment,
		null,
		x ? a.createElement(i, { styles: Tc(o) }) : null,
		g ? a.createElement(Rc, { gapMode: e.gapMode }) : null,
	)
}
function Lc(e) {
	for (var t = null; e !== null; ) e instanceof ShadowRoot && ((t = e.host), (e = e.host)), (e = e.parentNode)
	return t
}
const jc = dc(go, kc)
var Xt = a.forwardRef(function (e, t) {
	return a.createElement(qt, pe({}, e, { ref: t, sideCar: jc }))
})
Xt.classNames = qt.classNames
var Fc = function (e) {
		if (typeof document > "u") return null
		var t = Array.isArray(e) ? e[0] : e
		return t.ownerDocument.body
	},
	ze = new WeakMap(),
	Ot = new WeakMap(),
	Tt = {},
	xr = 0,
	bo = function (e) {
		return e && (e.host || bo(e.parentNode))
	},
	$c = function (e, t) {
		return t
			.map(function (r) {
				if (e.contains(r)) return r
				var n = bo(r)
				return n && e.contains(n)
					? n
					: (console.error("aria-hidden", r, "in not contained inside", e, ". Doing nothing"), null)
			})
			.filter(function (r) {
				return !!r
			})
	},
	Bc = function (e, t, r, n) {
		var o = $c(t, Array.isArray(e) ? e : [e])
		Tt[r] || (Tt[r] = new WeakMap())
		var i = Tt[r],
			s = [],
			c = new Set(),
			d = new Set(o),
			l = function (f) {
				!f || c.has(f) || (c.add(f), l(f.parentNode))
			}
		o.forEach(l)
		var u = function (f) {
			!f ||
				d.has(f) ||
				Array.prototype.forEach.call(f.children, function (m) {
					if (c.has(m)) u(m)
					else
						try {
							var g = m.getAttribute(n),
								x = g !== null && g !== "false",
								h = (ze.get(m) || 0) + 1,
								v = (i.get(m) || 0) + 1
							ze.set(m, h),
								i.set(m, v),
								s.push(m),
								h === 1 && x && Ot.set(m, !0),
								v === 1 && m.setAttribute(r, "true"),
								x || m.setAttribute(n, "true")
						} catch (w) {
							console.error("aria-hidden: cannot operate on ", m, w)
						}
				})
		}
		return (
			u(t),
			c.clear(),
			xr++,
			function () {
				s.forEach(function (f) {
					var m = ze.get(f) - 1,
						g = i.get(f) - 1
					ze.set(f, m),
						i.set(f, g),
						m || (Ot.has(f) || f.removeAttribute(n), Ot.delete(f)),
						g || f.removeAttribute(r)
				}),
					xr--,
					xr || ((ze = new WeakMap()), (ze = new WeakMap()), (Ot = new WeakMap()), (Tt = {}))
			}
		)
	},
	Kr = function (e, t, r) {
		r === void 0 && (r = "data-aria-hidden")
		var n = Array.from(Array.isArray(e) ? e : [e]),
			o = Fc(e)
		return o
			? (n.push.apply(n, Array.from(o.querySelectorAll("[aria-live]"))), Bc(n, o, r, "aria-hidden"))
			: function () {
					return null
				}
	},
	Qt = "Dialog",
	[Co, Lm] = ue(Qt),
	[Hc, de] = Co(Qt),
	Eo = (e) => {
		const { __scopeDialog: t, children: r, open: n, defaultOpen: o, onOpenChange: i, modal: s = !0 } = e,
			c = a.useRef(null),
			d = a.useRef(null),
			[l, u] = Je({ prop: n, defaultProp: o ?? !1, onChange: i, caller: Qt })
		return p.jsx(Hc, {
			scope: t,
			triggerRef: c,
			contentRef: d,
			contentId: re(),
			titleId: re(),
			descriptionId: re(),
			open: l,
			onOpenChange: u,
			onOpenToggle: a.useCallback(() => u((f) => !f), [u]),
			modal: s,
			children: r,
		})
	}
Eo.displayName = Qt
var Ro = "DialogTrigger",
	Vc = a.forwardRef((e, t) => {
		const { __scopeDialog: r, ...n } = e,
			o = de(Ro, r),
			i = q(t, o.triggerRef)
		return p.jsx(H.button, {
			type: "button",
			"aria-haspopup": "dialog",
			"aria-expanded": o.open,
			"aria-controls": o.contentId,
			"data-state": Gr(o.open),
			...n,
			ref: i,
			onClick: L(e.onClick, o.onOpenToggle),
		})
	})
Vc.displayName = Ro
var Ur = "DialogPortal",
	[zc, So] = Co(Ur, { forceMount: void 0 }),
	Po = (e) => {
		const { __scopeDialog: t, forceMount: r, children: n, container: o } = e,
			i = de(Ur, t)
		return p.jsx(zc, {
			scope: t,
			forceMount: r,
			children: a.Children.map(n, (s) =>
				p.jsx(ae, { present: r || i.open, children: p.jsx(vt, { asChild: !0, container: o, children: s }) }),
			),
		})
	}
Po.displayName = Ur
var $t = "DialogOverlay",
	Mo = a.forwardRef((e, t) => {
		const r = So($t, e.__scopeDialog),
			{ forceMount: n = r.forceMount, ...o } = e,
			i = de($t, e.__scopeDialog)
		return i.modal ? p.jsx(ae, { present: n || i.open, children: p.jsx(Uc, { ...o, ref: t }) }) : null
	})
Mo.displayName = $t
var Kc = ct("DialogOverlay.RemoveScroll"),
	Uc = a.forwardRef((e, t) => {
		const { __scopeDialog: r, ...n } = e,
			o = de($t, r)
		return p.jsx(Xt, {
			as: Kc,
			allowPinchZoom: !0,
			shards: [o.contentRef],
			children: p.jsx(H.div, {
				"data-state": Gr(o.open),
				...n,
				ref: t,
				style: { pointerEvents: "auto", ...n.style },
			}),
		})
	}),
	Te = "DialogContent",
	Ao = a.forwardRef((e, t) => {
		const r = So(Te, e.__scopeDialog),
			{ forceMount: n = r.forceMount, ...o } = e,
			i = de(Te, e.__scopeDialog)
		return p.jsx(ae, {
			present: n || i.open,
			children: i.modal ? p.jsx(Wc, { ...o, ref: t }) : p.jsx(Gc, { ...o, ref: t }),
		})
	})
Ao.displayName = Te
var Wc = a.forwardRef((e, t) => {
		const r = de(Te, e.__scopeDialog),
			n = a.useRef(null),
			o = q(t, r.contentRef, n)
		return (
			a.useEffect(() => {
				const i = n.current
				if (i) return Kr(i)
			}, []),
			p.jsx(_o, {
				...e,
				ref: o,
				trapFocus: r.open,
				disableOutsidePointerEvents: !0,
				onCloseAutoFocus: L(e.onCloseAutoFocus, (i) => {
					var s
					i.preventDefault(), (s = r.triggerRef.current) == null || s.focus()
				}),
				onPointerDownOutside: L(e.onPointerDownOutside, (i) => {
					const s = i.detail.originalEvent,
						c = s.button === 0 && s.ctrlKey === !0
					;(s.button === 2 || c) && i.preventDefault()
				}),
				onFocusOutside: L(e.onFocusOutside, (i) => i.preventDefault()),
			})
		)
	}),
	Gc = a.forwardRef((e, t) => {
		const r = de(Te, e.__scopeDialog),
			n = a.useRef(!1),
			o = a.useRef(!1)
		return p.jsx(_o, {
			...e,
			ref: t,
			trapFocus: !1,
			disableOutsidePointerEvents: !1,
			onCloseAutoFocus: (i) => {
				var s, c
				;(s = e.onCloseAutoFocus) == null || s.call(e, i),
					i.defaultPrevented ||
						(n.current || (c = r.triggerRef.current) == null || c.focus(), i.preventDefault()),
					(n.current = !1),
					(o.current = !1)
			},
			onInteractOutside: (i) => {
				var d, l
				;(d = e.onInteractOutside) == null || d.call(e, i),
					i.defaultPrevented ||
						((n.current = !0), i.detail.originalEvent.type === "pointerdown" && (o.current = !0))
				const s = i.target
				;((l = r.triggerRef.current) == null ? void 0 : l.contains(s)) && i.preventDefault(),
					i.detail.originalEvent.type === "focusin" && o.current && i.preventDefault()
			},
		})
	}),
	_o = a.forwardRef((e, t) => {
		const { __scopeDialog: r, trapFocus: n, onOpenAutoFocus: o, onCloseAutoFocus: i, ...s } = e,
			c = de(Te, r),
			d = a.useRef(null),
			l = q(t, d)
		return (
			zr(),
			p.jsxs(p.Fragment, {
				children: [
					p.jsx(Zt, {
						asChild: !0,
						loop: !0,
						trapped: n,
						onMountAutoFocus: o,
						onUnmountAutoFocus: i,
						children: p.jsx(gt, {
							role: "dialog",
							id: c.contentId,
							"aria-describedby": c.descriptionId,
							"aria-labelledby": c.titleId,
							"data-state": Gr(c.open),
							...s,
							ref: l,
							onDismiss: () => c.onOpenChange(!1),
						}),
					}),
					p.jsxs(p.Fragment, {
						children: [
							p.jsx(Xc, { titleId: c.titleId }),
							p.jsx(Jc, { contentRef: d, descriptionId: c.descriptionId }),
						],
					}),
				],
			})
		)
	}),
	Wr = "DialogTitle",
	Yc = a.forwardRef((e, t) => {
		const { __scopeDialog: r, ...n } = e,
			o = de(Wr, r)
		return p.jsx(H.h2, { id: o.titleId, ...n, ref: t })
	})
Yc.displayName = Wr
var No = "DialogDescription",
	Zc = a.forwardRef((e, t) => {
		const { __scopeDialog: r, ...n } = e,
			o = de(No, r)
		return p.jsx(H.p, { id: o.descriptionId, ...n, ref: t })
	})
Zc.displayName = No
var Io = "DialogClose",
	qc = a.forwardRef((e, t) => {
		const { __scopeDialog: r, ...n } = e,
			o = de(Io, r)
		return p.jsx(H.button, { type: "button", ...n, ref: t, onClick: L(e.onClick, () => o.onOpenChange(!1)) })
	})
qc.displayName = Io
function Gr(e) {
	return e ? "open" : "closed"
}
var Oo = "DialogTitleWarning",
	[jm, To] = Ls(Oo, { contentName: Te, titleName: Wr, docsSlug: "dialog" }),
	Xc = ({ titleId: e }) => {
		const t = To(Oo),
			r = `\`${t.contentName}\` requires a \`${t.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${t.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${t.docsSlug}`
		return (
			a.useEffect(() => {
				e && (document.getElementById(e) || console.error(r))
			}, [r, e]),
			null
		)
	},
	Qc = "DialogDescriptionWarning",
	Jc = ({ contentRef: e, descriptionId: t }) => {
		const n = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${To(Qc).contentName}}.`
		return (
			a.useEffect(() => {
				var i
				const o = (i = e.current) == null ? void 0 : i.getAttribute("aria-describedby")
				t && o && (document.getElementById(t) || console.warn(n))
			}, [n, e, t]),
			null
		)
	},
	el = Eo,
	tl = Po,
	rl = Mo,
	nl = Ao
const ol = co(
	"inline-flex items-center rounded-full border border-transparent px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground hover:bg-primary/80",
				secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
				destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
				outline: "text-muted-foreground border-vscode-input-border",
			},
		},
		defaultVariants: { variant: "default" },
	},
)
function il({ className: e, variant: t, ...r }) {
	return p.jsx("div", { className: X(ol({ variant: t }), e), ...r })
}
il.__docgenInfo = { description: "", methods: [], displayName: "Badge", composes: ["VariantProps"] }
function Do(e) {
	const t = a.useRef({ value: e, previous: e })
	return a.useMemo(
		() => (
			t.current.value !== e && ((t.current.previous = t.current.value), (t.current.value = e)), t.current.previous
		),
		[e],
	)
}
function Yr(e) {
	const [t, r] = a.useState(void 0)
	return (
		Ft(() => {
			if (e) {
				r({ width: e.offsetWidth, height: e.offsetHeight })
				const n = new ResizeObserver((o) => {
					if (!Array.isArray(o) || !o.length) return
					const i = o[0]
					let s, c
					if ("borderBoxSize" in i) {
						const d = i.borderBoxSize,
							l = Array.isArray(d) ? d[0] : d
						;(s = l.inlineSize), (c = l.blockSize)
					} else (s = e.offsetWidth), (c = e.offsetHeight)
					r({ width: s, height: c })
				})
				return n.observe(e, { box: "border-box" }), () => n.unobserve(e)
			} else r(void 0)
		}, [e]),
		t
	)
}
var Jt = "Checkbox",
	[al, Fm] = ue(Jt),
	[sl, Zr] = al(Jt)
function cl(e) {
	const {
			__scopeCheckbox: t,
			checked: r,
			children: n,
			defaultChecked: o,
			disabled: i,
			form: s,
			name: c,
			onCheckedChange: d,
			required: l,
			value: u = "on",
			internal_do_not_use_render: f,
		} = e,
		[m, g] = Je({ prop: r, defaultProp: o ?? !1, onChange: d, caller: Jt }),
		[x, h] = a.useState(null),
		[v, w] = a.useState(null),
		b = a.useRef(!1),
		C = x ? !!s || !!x.closest("form") : !0,
		E = {
			checked: m,
			disabled: i,
			setChecked: g,
			control: x,
			setControl: h,
			name: c,
			form: s,
			value: u,
			hasConsumerStoppedPropagationRef: b,
			required: l,
			defaultChecked: Re(o) ? !1 : o,
			isFormControl: C,
			bubbleInput: v,
			setBubbleInput: w,
		}
	return p.jsx(sl, { scope: t, ...E, children: ll(f) ? f(E) : n })
}
var ko = "CheckboxTrigger",
	Lo = a.forwardRef(({ __scopeCheckbox: e, onKeyDown: t, onClick: r, ...n }, o) => {
		const {
				control: i,
				value: s,
				disabled: c,
				checked: d,
				required: l,
				setControl: u,
				setChecked: f,
				hasConsumerStoppedPropagationRef: m,
				isFormControl: g,
				bubbleInput: x,
			} = Zr(ko, e),
			h = q(o, u),
			v = a.useRef(d)
		return (
			a.useEffect(() => {
				const w = i == null ? void 0 : i.form
				if (w) {
					const b = () => f(v.current)
					return w.addEventListener("reset", b), () => w.removeEventListener("reset", b)
				}
			}, [i, f]),
			p.jsx(H.button, {
				type: "button",
				role: "checkbox",
				"aria-checked": Re(d) ? "mixed" : d,
				"aria-required": l,
				"data-state": Ho(d),
				"data-disabled": c ? "" : void 0,
				disabled: c,
				value: s,
				...n,
				ref: h,
				onKeyDown: L(t, (w) => {
					w.key === "Enter" && w.preventDefault()
				}),
				onClick: L(r, (w) => {
					f((b) => (Re(b) ? !0 : !b)),
						x && g && ((m.current = w.isPropagationStopped()), m.current || w.stopPropagation())
				}),
			})
		)
	})
Lo.displayName = ko
var qr = a.forwardRef((e, t) => {
	const {
		__scopeCheckbox: r,
		name: n,
		checked: o,
		defaultChecked: i,
		required: s,
		disabled: c,
		value: d,
		onCheckedChange: l,
		form: u,
		...f
	} = e
	return p.jsx(cl, {
		__scopeCheckbox: r,
		checked: o,
		defaultChecked: i,
		disabled: c,
		required: s,
		onCheckedChange: l,
		name: n,
		form: u,
		value: d,
		internal_do_not_use_render: ({ isFormControl: m }) =>
			p.jsxs(p.Fragment, {
				children: [p.jsx(Lo, { ...f, ref: t, __scopeCheckbox: r }), m && p.jsx(Bo, { __scopeCheckbox: r })],
			}),
	})
})
qr.displayName = Jt
var jo = "CheckboxIndicator",
	Fo = a.forwardRef((e, t) => {
		const { __scopeCheckbox: r, forceMount: n, ...o } = e,
			i = Zr(jo, r)
		return p.jsx(ae, {
			present: n || Re(i.checked) || i.checked === !0,
			children: p.jsx(H.span, {
				"data-state": Ho(i.checked),
				"data-disabled": i.disabled ? "" : void 0,
				...o,
				ref: t,
				style: { pointerEvents: "none", ...e.style },
			}),
		})
	})
Fo.displayName = jo
var $o = "CheckboxBubbleInput",
	Bo = a.forwardRef(({ __scopeCheckbox: e, ...t }, r) => {
		const {
				control: n,
				hasConsumerStoppedPropagationRef: o,
				checked: i,
				defaultChecked: s,
				required: c,
				disabled: d,
				name: l,
				value: u,
				form: f,
				bubbleInput: m,
				setBubbleInput: g,
			} = Zr($o, e),
			x = q(r, g),
			h = Do(i),
			v = Yr(n)
		a.useEffect(() => {
			const b = m
			if (!b) return
			const C = window.HTMLInputElement.prototype,
				R = Object.getOwnPropertyDescriptor(C, "checked").set,
				M = !o.current
			if (h !== i && R) {
				const S = new Event("click", { bubbles: M })
				;(b.indeterminate = Re(i)), R.call(b, Re(i) ? !1 : i), b.dispatchEvent(S)
			}
		}, [m, h, i, o])
		const w = a.useRef(Re(i) ? !1 : i)
		return p.jsx(H.input, {
			type: "checkbox",
			"aria-hidden": !0,
			defaultChecked: s ?? w.current,
			required: c,
			disabled: d,
			name: l,
			value: u,
			form: f,
			...t,
			tabIndex: -1,
			ref: x,
			style: {
				...t.style,
				...v,
				position: "absolute",
				pointerEvents: "none",
				opacity: 0,
				margin: 0,
				transform: "translateX(-100%)",
			},
		})
	})
Bo.displayName = $o
function ll(e) {
	return typeof e == "function"
}
function Re(e) {
	return e === "indeterminate"
}
function Ho(e) {
	return Re(e) ? "indeterminate" : e ? "checked" : "unchecked"
}
/**
 * @license lucide-react v0.513.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const ul = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]],
	Vo = lo("check", ul)
/**
 * @license lucide-react v0.513.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const dl = [
		["path", { d: "M18 6 6 18", key: "1bl5f8" }],
		["path", { d: "m6 6 12 12", key: "d8bk6v" }],
	],
	fl = lo("x", dl),
	pl = co(
		"peer h-4 w-4 shrink-0 rounded-sm border ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
		{
			variants: {
				variant: {
					default:
						"border-vscode-foreground data-[state=checked]:bg-vscode-foreground data-[state=checked]:text-primary-foreground",
					description:
						"border-vscode-descriptionForeground data-[state=checked]:bg-vscode-descriptionForeground data-[state=checked]:text-white",
				},
			},
			defaultVariants: { variant: "default" },
		},
	),
	zo = a.forwardRef(({ className: e, variant: t, ...r }, n) =>
		p.jsx(qr, {
			ref: n,
			className: X(pl({ variant: t, className: e })),
			...r,
			children: p.jsx(Fo, {
				className: X("flex items-center justify-center text-current"),
				children: p.jsx(Vo, { className: "h-4 w-4 text-vscode-background" }),
			}),
		}),
	)
zo.displayName = qr.displayName
zo.__docgenInfo = { description: "", methods: [], composes: ["VariantProps"] }
var Hn = 1,
	ml = 0.9,
	hl = 0.8,
	gl = 0.17,
	wr = 0.1,
	yr = 0.999,
	vl = 0.9999,
	xl = 0.99,
	wl = /[\\\/_+.#"@\[\(\{&]/,
	yl = /[\\\/_+.#"@\[\(\{&]/g,
	bl = /[\s-]/,
	Ko = /[\s-]/g
function Ar(e, t, r, n, o, i, s) {
	if (i === t.length) return o === e.length ? Hn : xl
	var c = `${o},${i}`
	if (s[c] !== void 0) return s[c]
	for (var d = n.charAt(i), l = r.indexOf(d, o), u = 0, f, m, g, x; l >= 0; )
		(f = Ar(e, t, r, n, l + 1, i + 1, s)),
			f > u &&
				(l === o
					? (f *= Hn)
					: wl.test(e.charAt(l - 1))
						? ((f *= hl), (g = e.slice(o, l - 1).match(yl)), g && o > 0 && (f *= Math.pow(yr, g.length)))
						: bl.test(e.charAt(l - 1))
							? ((f *= ml),
								(x = e.slice(o, l - 1).match(Ko)),
								x && o > 0 && (f *= Math.pow(yr, x.length)))
							: ((f *= gl), o > 0 && (f *= Math.pow(yr, l - o))),
				e.charAt(l) !== t.charAt(i) && (f *= vl)),
			((f < wr && r.charAt(l - 1) === n.charAt(i + 1)) ||
				(n.charAt(i + 1) === n.charAt(i) && r.charAt(l - 1) !== n.charAt(i))) &&
				((m = Ar(e, t, r, n, l + 1, i + 2, s)), m * wr > f && (f = m * wr)),
			f > u && (u = f),
			(l = r.indexOf(d, l + 1))
	return (s[c] = u), u
}
function Vn(e) {
	return e.toLowerCase().replace(Ko, " ")
}
function Cl(e, t, r) {
	return (e = r && r.length > 0 ? `${e + " " + r.join(" ")}` : e), Ar(e, t, Vn(e), Vn(t), 0, 0, {})
}
var it = '[cmdk-group=""]',
	br = '[cmdk-group-items=""]',
	El = '[cmdk-group-heading=""]',
	Uo = '[cmdk-item=""]',
	zn = `${Uo}:not([aria-disabled="true"])`,
	_r = "cmdk-item-select",
	Ke = "data-value",
	Rl = (e, t, r) => Cl(e, t, r),
	Wo = a.createContext(void 0),
	xt = () => a.useContext(Wo),
	Go = a.createContext(void 0),
	Xr = () => a.useContext(Go),
	Yo = a.createContext(void 0),
	Zo = a.forwardRef((e, t) => {
		let r = Ue(() => {
				var y, A
				return {
					search: "",
					value: (A = (y = e.value) != null ? y : e.defaultValue) != null ? A : "",
					selectedItemId: void 0,
					filtered: { count: 0, items: new Map(), groups: new Set() },
				}
			}),
			n = Ue(() => new Set()),
			o = Ue(() => new Map()),
			i = Ue(() => new Map()),
			s = Ue(() => new Set()),
			c = qo(e),
			{
				label: d,
				children: l,
				value: u,
				onValueChange: f,
				filter: m,
				shouldFilter: g,
				loop: x,
				disablePointerSelection: h = !1,
				vimBindings: v = !0,
				...w
			} = e,
			b = re(),
			C = re(),
			E = re(),
			R = a.useRef(null),
			M = kl()
		De(() => {
			if (u !== void 0) {
				let y = u.trim()
				;(r.current.value = y), S.emit()
			}
		}, [u]),
			De(() => {
				M(6, K)
			}, [])
		let S = a.useMemo(
				() => ({
					subscribe: (y) => (s.current.add(y), () => s.current.delete(y)),
					snapshot: () => r.current,
					setState: (y, A, D) => {
						var N, B, V, G
						if (!Object.is(r.current[y], A)) {
							if (((r.current[y] = A), y === "search")) z(), T(), M(1, k)
							else if (y === "value") {
								if (
									document.activeElement.hasAttribute("cmdk-input") ||
									document.activeElement.hasAttribute("cmdk-root")
								) {
									let Y = document.getElementById(E)
									Y ? Y.focus() : (N = document.getElementById(b)) == null || N.focus()
								}
								if (
									(M(7, () => {
										var Y
										;(r.current.selectedItemId = (Y = P()) == null ? void 0 : Y.id), S.emit()
									}),
									D || M(5, K),
									((B = c.current) == null ? void 0 : B.value) !== void 0)
								) {
									let Y = A ?? ""
									;(G = (V = c.current).onValueChange) == null || G.call(V, Y)
									return
								}
							}
							S.emit()
						}
					},
					emit: () => {
						s.current.forEach((y) => y())
					},
				}),
				[],
			),
			_ = a.useMemo(
				() => ({
					value: (y, A, D) => {
						var N
						A !== ((N = i.current.get(y)) == null ? void 0 : N.value) &&
							(i.current.set(y, { value: A, keywords: D }),
							r.current.filtered.items.set(y, $(A, D)),
							M(2, () => {
								T(), S.emit()
							}))
					},
					item: (y, A) => (
						n.current.add(y),
						A && (o.current.has(A) ? o.current.get(A).add(y) : o.current.set(A, new Set([y]))),
						M(3, () => {
							z(), T(), r.current.value || k(), S.emit()
						}),
						() => {
							i.current.delete(y), n.current.delete(y), r.current.filtered.items.delete(y)
							let D = P()
							M(4, () => {
								z(), (D == null ? void 0 : D.getAttribute("id")) === y && k(), S.emit()
							})
						}
					),
					group: (y) => (
						o.current.has(y) || o.current.set(y, new Set()),
						() => {
							i.current.delete(y), o.current.delete(y)
						}
					),
					filter: () => c.current.shouldFilter,
					label: d || e["aria-label"],
					getDisablePointerSelection: () => c.current.disablePointerSelection,
					listId: b,
					inputId: E,
					labelId: C,
					listInnerRef: R,
				}),
				[],
			)
		function $(y, A) {
			var D, N
			let B = (N = (D = c.current) == null ? void 0 : D.filter) != null ? N : Rl
			return y ? B(y, r.current.search, A) : 0
		}
		function T() {
			if (!r.current.search || c.current.shouldFilter === !1) return
			let y = r.current.filtered.items,
				A = []
			r.current.filtered.groups.forEach((N) => {
				let B = o.current.get(N),
					V = 0
				B.forEach((G) => {
					let Y = y.get(G)
					V = Math.max(Y, V)
				}),
					A.push([N, V])
			})
			let D = R.current
			O()
				.sort((N, B) => {
					var V, G
					let Y = N.getAttribute("id"),
						oe = B.getAttribute("id")
					return ((V = y.get(oe)) != null ? V : 0) - ((G = y.get(Y)) != null ? G : 0)
				})
				.forEach((N) => {
					let B = N.closest(br)
					B
						? B.appendChild(N.parentElement === B ? N : N.closest(`${br} > *`))
						: D.appendChild(N.parentElement === D ? N : N.closest(`${br} > *`))
				}),
				A.sort((N, B) => B[1] - N[1]).forEach((N) => {
					var B
					let V =
						(B = R.current) == null ? void 0 : B.querySelector(`${it}[${Ke}="${encodeURIComponent(N[0])}"]`)
					V == null || V.parentElement.appendChild(V)
				})
		}
		function k() {
			let y = O().find((D) => D.getAttribute("aria-disabled") !== "true"),
				A = y == null ? void 0 : y.getAttribute(Ke)
			S.setState("value", A || void 0)
		}
		function z() {
			var y, A, D, N
			if (!r.current.search || c.current.shouldFilter === !1) {
				r.current.filtered.count = n.current.size
				return
			}
			r.current.filtered.groups = new Set()
			let B = 0
			for (let V of n.current) {
				let G = (A = (y = i.current.get(V)) == null ? void 0 : y.value) != null ? A : "",
					Y = (N = (D = i.current.get(V)) == null ? void 0 : D.keywords) != null ? N : [],
					oe = $(G, Y)
				r.current.filtered.items.set(V, oe), oe > 0 && B++
			}
			for (let [V, G] of o.current)
				for (let Y of G)
					if (r.current.filtered.items.get(Y) > 0) {
						r.current.filtered.groups.add(V)
						break
					}
			r.current.filtered.count = B
		}
		function K() {
			var y, A, D
			let N = P()
			N &&
				(((y = N.parentElement) == null ? void 0 : y.firstChild) === N &&
					((D = (A = N.closest(it)) == null ? void 0 : A.querySelector(El)) == null ||
						D.scrollIntoView({ block: "nearest" })),
				N.scrollIntoView({ block: "nearest" }))
		}
		function P() {
			var y
			return (y = R.current) == null ? void 0 : y.querySelector(`${Uo}[aria-selected="true"]`)
		}
		function O() {
			var y
			return Array.from(((y = R.current) == null ? void 0 : y.querySelectorAll(zn)) || [])
		}
		function j(y) {
			let A = O()[y]
			A && S.setState("value", A.getAttribute(Ke))
		}
		function U(y) {
			var A
			let D = P(),
				N = O(),
				B = N.findIndex((G) => G === D),
				V = N[B + y]
			;(A = c.current) != null &&
				A.loop &&
				(V = B + y < 0 ? N[N.length - 1] : B + y === N.length ? N[0] : N[B + y]),
				V && S.setState("value", V.getAttribute(Ke))
		}
		function F(y) {
			let A = P(),
				D = A == null ? void 0 : A.closest(it),
				N
			for (; D && !N; ) (D = y > 0 ? Tl(D, it) : Dl(D, it)), (N = D == null ? void 0 : D.querySelector(zn))
			N ? S.setState("value", N.getAttribute(Ke)) : U(y)
		}
		let I = () => j(O().length - 1),
			W = (y) => {
				y.preventDefault(), y.metaKey ? I() : y.altKey ? F(1) : U(1)
			},
			Z = (y) => {
				y.preventDefault(), y.metaKey ? j(0) : y.altKey ? F(-1) : U(-1)
			}
		return a.createElement(
			H.div,
			{
				ref: t,
				tabIndex: -1,
				...w,
				"cmdk-root": "",
				onKeyDown: (y) => {
					var A
					;(A = w.onKeyDown) == null || A.call(w, y)
					let D = y.nativeEvent.isComposing || y.keyCode === 229
					if (!(y.defaultPrevented || D))
						switch (y.key) {
							case "n":
							case "j": {
								v && y.ctrlKey && W(y)
								break
							}
							case "ArrowDown": {
								W(y)
								break
							}
							case "p":
							case "k": {
								v && y.ctrlKey && Z(y)
								break
							}
							case "ArrowUp": {
								Z(y)
								break
							}
							case "Home": {
								y.preventDefault(), j(0)
								break
							}
							case "End": {
								y.preventDefault(), I()
								break
							}
							case "Enter": {
								y.preventDefault()
								let N = P()
								if (N) {
									let B = new Event(_r)
									N.dispatchEvent(B)
								}
							}
						}
				},
			},
			a.createElement("label", { "cmdk-label": "", htmlFor: _.inputId, id: _.labelId, style: jl }, d),
			er(e, (y) => a.createElement(Go.Provider, { value: S }, a.createElement(Wo.Provider, { value: _ }, y))),
		)
	}),
	Sl = a.forwardRef((e, t) => {
		var r, n
		let o = re(),
			i = a.useRef(null),
			s = a.useContext(Yo),
			c = xt(),
			d = qo(e),
			l = (n = (r = d.current) == null ? void 0 : r.forceMount) != null ? n : s == null ? void 0 : s.forceMount
		De(() => {
			if (!l) return c.item(o, s == null ? void 0 : s.id)
		}, [l])
		let u = Xo(o, i, [e.value, e.children, i], e.keywords),
			f = Xr(),
			m = Se((M) => M.value && M.value === u.current),
			g = Se((M) => (l || c.filter() === !1 ? !0 : M.search ? M.filtered.items.get(o) > 0 : !0))
		a.useEffect(() => {
			let M = i.current
			if (!(!M || e.disabled)) return M.addEventListener(_r, x), () => M.removeEventListener(_r, x)
		}, [g, e.onSelect, e.disabled])
		function x() {
			var M, S
			h(), (S = (M = d.current).onSelect) == null || S.call(M, u.current)
		}
		function h() {
			f.setState("value", u.current, !0)
		}
		if (!g) return null
		let { disabled: v, value: w, onSelect: b, forceMount: C, keywords: E, ...R } = e
		return a.createElement(
			H.div,
			{
				ref: Oe(i, t),
				...R,
				id: o,
				"cmdk-item": "",
				role: "option",
				"aria-disabled": !!v,
				"aria-selected": !!m,
				"data-disabled": !!v,
				"data-selected": !!m,
				onPointerMove: v || c.getDisablePointerSelection() ? void 0 : h,
				onClick: v ? void 0 : x,
			},
			e.children,
		)
	}),
	Pl = a.forwardRef((e, t) => {
		let { heading: r, children: n, forceMount: o, ...i } = e,
			s = re(),
			c = a.useRef(null),
			d = a.useRef(null),
			l = re(),
			u = xt(),
			f = Se((g) => (o || u.filter() === !1 ? !0 : g.search ? g.filtered.groups.has(s) : !0))
		De(() => u.group(s), []), Xo(s, c, [e.value, e.heading, d])
		let m = a.useMemo(() => ({ id: s, forceMount: o }), [o])
		return a.createElement(
			H.div,
			{ ref: Oe(c, t), ...i, "cmdk-group": "", role: "presentation", hidden: f ? void 0 : !0 },
			r && a.createElement("div", { ref: d, "cmdk-group-heading": "", "aria-hidden": !0, id: l }, r),
			er(e, (g) =>
				a.createElement(
					"div",
					{ "cmdk-group-items": "", role: "group", "aria-labelledby": r ? l : void 0 },
					a.createElement(Yo.Provider, { value: m }, g),
				),
			),
		)
	}),
	Ml = a.forwardRef((e, t) => {
		let { alwaysRender: r, ...n } = e,
			o = a.useRef(null),
			i = Se((s) => !s.search)
		return !r && !i
			? null
			: a.createElement(H.div, { ref: Oe(o, t), ...n, "cmdk-separator": "", role: "separator" })
	}),
	Al = a.forwardRef((e, t) => {
		let { onValueChange: r, ...n } = e,
			o = e.value != null,
			i = Xr(),
			s = Se((l) => l.search),
			c = Se((l) => l.selectedItemId),
			d = xt()
		return (
			a.useEffect(() => {
				e.value != null && i.setState("search", e.value)
			}, [e.value]),
			a.createElement(H.input, {
				ref: t,
				...n,
				"cmdk-input": "",
				autoComplete: "off",
				autoCorrect: "off",
				spellCheck: !1,
				"aria-autocomplete": "list",
				role: "combobox",
				"aria-expanded": !0,
				"aria-controls": d.listId,
				"aria-labelledby": d.labelId,
				"aria-activedescendant": c,
				id: d.inputId,
				type: "text",
				value: o ? e.value : s,
				onChange: (l) => {
					o || i.setState("search", l.target.value), r == null || r(l.target.value)
				},
			})
		)
	}),
	_l = a.forwardRef((e, t) => {
		let { children: r, label: n = "Suggestions", ...o } = e,
			i = a.useRef(null),
			s = a.useRef(null),
			c = Se((l) => l.selectedItemId),
			d = xt()
		return (
			a.useEffect(() => {
				if (s.current && i.current) {
					let l = s.current,
						u = i.current,
						f,
						m = new ResizeObserver(() => {
							f = requestAnimationFrame(() => {
								let g = l.offsetHeight
								u.style.setProperty("--cmdk-list-height", g.toFixed(1) + "px")
							})
						})
					return (
						m.observe(l),
						() => {
							cancelAnimationFrame(f), m.unobserve(l)
						}
					)
				}
			}, []),
			a.createElement(
				H.div,
				{
					ref: Oe(i, t),
					...o,
					"cmdk-list": "",
					role: "listbox",
					tabIndex: -1,
					"aria-activedescendant": c,
					"aria-label": n,
					id: d.listId,
				},
				er(e, (l) => a.createElement("div", { ref: Oe(s, d.listInnerRef), "cmdk-list-sizer": "" }, l)),
			)
		)
	}),
	Nl = a.forwardRef((e, t) => {
		let { open: r, onOpenChange: n, overlayClassName: o, contentClassName: i, container: s, ...c } = e
		return a.createElement(
			el,
			{ open: r, onOpenChange: n },
			a.createElement(
				tl,
				{ container: s },
				a.createElement(rl, { "cmdk-overlay": "", className: o }),
				a.createElement(
					nl,
					{ "aria-label": e.label, "cmdk-dialog": "", className: i },
					a.createElement(Zo, { ref: t, ...c }),
				),
			),
		)
	}),
	Il = a.forwardRef((e, t) =>
		Se((r) => r.filtered.count === 0)
			? a.createElement(H.div, { ref: t, ...e, "cmdk-empty": "", role: "presentation" })
			: null,
	),
	Ol = a.forwardRef((e, t) => {
		let { progress: r, children: n, label: o = "Loading...", ...i } = e
		return a.createElement(
			H.div,
			{
				ref: t,
				...i,
				"cmdk-loading": "",
				role: "progressbar",
				"aria-valuenow": r,
				"aria-valuemin": 0,
				"aria-valuemax": 100,
				"aria-label": o,
			},
			er(e, (s) => a.createElement("div", { "aria-hidden": !0 }, s)),
		)
	}),
	ee = Object.assign(Zo, {
		List: _l,
		Item: Sl,
		Input: Al,
		Group: Pl,
		Separator: Ml,
		Dialog: Nl,
		Empty: Il,
		Loading: Ol,
	})
function Tl(e, t) {
	let r = e.nextElementSibling
	for (; r; ) {
		if (r.matches(t)) return r
		r = r.nextElementSibling
	}
}
function Dl(e, t) {
	let r = e.previousElementSibling
	for (; r; ) {
		if (r.matches(t)) return r
		r = r.previousElementSibling
	}
}
function qo(e) {
	let t = a.useRef(e)
	return (
		De(() => {
			t.current = e
		}),
		t
	)
}
var De = typeof window > "u" ? a.useEffect : a.useLayoutEffect
function Ue(e) {
	let t = a.useRef()
	return t.current === void 0 && (t.current = e()), t
}
function Se(e) {
	let t = Xr(),
		r = () => e(t.snapshot())
	return a.useSyncExternalStore(t.subscribe, r, r)
}
function Xo(e, t, r, n = []) {
	let o = a.useRef(),
		i = xt()
	return (
		De(() => {
			var s
			let c = (() => {
					var l
					for (let u of r) {
						if (typeof u == "string") return u.trim()
						if (typeof u == "object" && "current" in u)
							return u.current ? ((l = u.current.textContent) == null ? void 0 : l.trim()) : o.current
					}
				})(),
				d = n.map((l) => l.trim())
			i.value(e, c, d), (s = t.current) == null || s.setAttribute(Ke, c), (o.current = c)
		}),
		o
	)
}
var kl = () => {
	let [e, t] = a.useState(),
		r = Ue(() => new Map())
	return (
		De(() => {
			r.current.forEach((n) => n()), (r.current = new Map())
		}, [e]),
		(n, o) => {
			r.current.set(n, o), t({})
		}
	)
}
function Ll(e) {
	let t = e.type
	return typeof t == "function" ? t(e.props) : "render" in t ? t.render(e.props) : e
}
function er({ asChild: e, children: t }, r) {
	return e && a.isValidElement(t) ? a.cloneElement(Ll(t), { ref: t.ref }, r(t.props.children)) : r(t)
}
var jl = {
	position: "absolute",
	width: "1px",
	height: "1px",
	padding: "0",
	margin: "-1px",
	overflow: "hidden",
	clip: "rect(0, 0, 0, 0)",
	whiteSpace: "nowrap",
	borderWidth: "0",
}
function Q(e, t) {
	if (e == null) return {}
	var r = {},
		n = Object.keys(e),
		o,
		i
	for (i = 0; i < n.length; i++) (o = n[i]), !(t.indexOf(o) >= 0) && (r[o] = e[o])
	return r
}
var Fl = ["color"],
	$m = a.forwardRef(function (e, t) {
		var r = e.color,
			n = r === void 0 ? "currentColor" : r,
			o = Q(e, Fl)
		return a.createElement(
			"svg",
			Object.assign(
				{ width: "15", height: "15", viewBox: "0 0 15 15", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
				o,
				{ ref: t },
			),
			a.createElement("path", {
				d: "M1 13.25L14 13.25V14.75L1 14.75V13.25Z",
				fill: n,
				fillRule: "evenodd",
				clipRule: "evenodd",
			}),
			a.createElement("rect", { x: "7", y: "5", width: "1", height: "1", rx: ".5", fill: n }),
			a.createElement("rect", { x: "13", y: "5", width: "1", height: "1", rx: ".5", fill: n }),
			a.createElement("rect", { x: "7", y: "3", width: "1", height: "1", rx: ".5", fill: n }),
			a.createElement("rect", { x: "13", y: "3", width: "1", height: "1", rx: ".5", fill: n }),
			a.createElement("rect", { x: "7", y: "7", width: "1", height: "1", rx: ".5", fill: n }),
			a.createElement("rect", { x: "7", y: "1", width: "1", height: "1", rx: ".5", fill: n }),
			a.createElement("rect", { x: "13", y: "7", width: "1", height: "1", rx: ".5", fill: n }),
			a.createElement("rect", { x: "13", y: "1", width: "1", height: "1", rx: ".5", fill: n }),
			a.createElement("rect", { x: "5", y: "7", width: "1", height: "1", rx: ".5", fill: n }),
			a.createElement("rect", { x: "5", y: "1", width: "1", height: "1", rx: ".5", fill: n }),
			a.createElement("rect", { x: "3", y: "7", width: "1", height: "1", rx: ".5", fill: n }),
			a.createElement("rect", { x: "3", y: "1", width: "1", height: "1", rx: ".5", fill: n }),
			a.createElement("rect", { x: "9", y: "7", width: "1", height: "1", rx: ".5", fill: n }),
			a.createElement("rect", { x: "9", y: "1", width: "1", height: "1", rx: ".5", fill: n }),
			a.createElement("rect", { x: "11", y: "7", width: "1", height: "1", rx: ".5", fill: n }),
			a.createElement("rect", { x: "11", y: "1", width: "1", height: "1", rx: ".5", fill: n }),
			a.createElement("rect", { x: "7", y: "9", width: "1", height: "1", rx: ".5", fill: n }),
			a.createElement("rect", { x: "13", y: "9", width: "1", height: "1", rx: ".5", fill: n }),
			a.createElement("rect", { x: "7", y: "11", width: "1", height: "1", rx: ".5", fill: n }),
			a.createElement("rect", { x: "13", y: "11", width: "1", height: "1", rx: ".5", fill: n }),
			a.createElement("rect", { x: "1", y: "5", width: "1", height: "1", rx: ".5", fill: n }),
			a.createElement("rect", { x: "1", y: "3", width: "1", height: "1", rx: ".5", fill: n }),
			a.createElement("rect", { x: "1", y: "7", width: "1", height: "1", rx: ".5", fill: n }),
			a.createElement("rect", { x: "1", y: "1", width: "1", height: "1", rx: ".5", fill: n }),
			a.createElement("rect", { x: "1", y: "9", width: "1", height: "1", rx: ".5", fill: n }),
			a.createElement("rect", { x: "1", y: "11", width: "1", height: "1", rx: ".5", fill: n }),
		)
	}),
	$l = ["color"],
	Bm = a.forwardRef(function (e, t) {
		var r = e.color,
			n = r === void 0 ? "currentColor" : r,
			o = Q(e, $l)
		return a.createElement(
			"svg",
			Object.assign(
				{ width: "15", height: "15", viewBox: "0 0 15 15", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
				o,
				{ ref: t },
			),
			a.createElement("path", {
				d: "M1.75 1L1.75 14L0.249999 14L0.25 1L1.75 1Z",
				fill: n,
				fillRule: "evenodd",
				clipRule: "evenodd",
			}),
			a.createElement("rect", {
				x: "10",
				y: "7",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(90 10 7)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "10",
				y: "13",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(90 10 13)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "12",
				y: "7",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(90 12 7)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "12",
				y: "13",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(90 12 13)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "8",
				y: "7",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(90 8 7)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "14",
				y: "7",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(90 14 7)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "8",
				y: "13",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(90 8 13)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "14",
				y: "13",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(90 14 13)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "8",
				y: "5",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(90 8 5)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "14",
				y: "5",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(90 14 5)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "8",
				y: "3",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(90 8 3)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "14",
				y: "3",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(90 14 3)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "8",
				y: "9",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(90 8 9)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "14",
				y: "9",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(90 14 9)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "8",
				y: "11",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(90 8 11)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "14",
				y: "11",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(90 14 11)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "6",
				y: "7",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(90 6 7)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "6",
				y: "13",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(90 6 13)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "4",
				y: "7",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(90 4 7)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "4",
				y: "13",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(90 4 13)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "10",
				y: "1",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(90 10 1)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "12",
				y: "1",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(90 12 1)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "8",
				y: "1",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(90 8 1)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "14",
				y: "1",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(90 14 1)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "6",
				y: "1",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(90 6 1)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "4",
				y: "1",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(90 4 1)",
				fill: n,
			}),
		)
	}),
	Bl = ["color"],
	Hm = a.forwardRef(function (e, t) {
		var r = e.color,
			n = r === void 0 ? "currentColor" : r,
			o = Q(e, Bl)
		return a.createElement(
			"svg",
			Object.assign(
				{ width: "15", height: "15", viewBox: "0 0 15 15", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
				o,
				{ ref: t },
			),
			a.createElement("path", {
				d: "M13.25 1L13.25 14L14.75 14L14.75 1L13.25 1Z",
				fill: n,
				fillRule: "evenodd",
				clipRule: "evenodd",
			}),
			a.createElement("rect", { width: "1", height: "1", rx: ".5", transform: "matrix(0 1 1 0 5 7)", fill: n }),
			a.createElement("rect", { width: "1", height: "1", rx: ".5", transform: "matrix(0 1 1 0 5 13)", fill: n }),
			a.createElement("rect", { width: "1", height: "1", rx: ".5", transform: "matrix(0 1 1 0 3 7)", fill: n }),
			a.createElement("rect", { width: "1", height: "1", rx: ".5", transform: "matrix(0 1 1 0 3 13)", fill: n }),
			a.createElement("rect", { width: "1", height: "1", rx: ".5", transform: "matrix(0 1 1 0 7 7)", fill: n }),
			a.createElement("rect", { width: "1", height: "1", rx: ".5", transform: "matrix(0 1 1 0 1 7)", fill: n }),
			a.createElement("rect", { width: "1", height: "1", rx: ".5", transform: "matrix(0 1 1 0 7 13)", fill: n }),
			a.createElement("rect", { width: "1", height: "1", rx: ".5", transform: "matrix(0 1 1 0 1 13)", fill: n }),
			a.createElement("rect", { width: "1", height: "1", rx: ".5", transform: "matrix(0 1 1 0 7 5)", fill: n }),
			a.createElement("rect", { width: "1", height: "1", rx: ".5", transform: "matrix(0 1 1 0 1 5)", fill: n }),
			a.createElement("rect", { width: "1", height: "1", rx: ".5", transform: "matrix(0 1 1 0 7 3)", fill: n }),
			a.createElement("rect", { width: "1", height: "1", rx: ".5", transform: "matrix(0 1 1 0 1 3)", fill: n }),
			a.createElement("rect", { width: "1", height: "1", rx: ".5", transform: "matrix(0 1 1 0 7 9)", fill: n }),
			a.createElement("rect", { width: "1", height: "1", rx: ".5", transform: "matrix(0 1 1 0 1 9)", fill: n }),
			a.createElement("rect", { width: "1", height: "1", rx: ".5", transform: "matrix(0 1 1 0 7 11)", fill: n }),
			a.createElement("rect", { width: "1", height: "1", rx: ".5", transform: "matrix(0 1 1 0 1 11)", fill: n }),
			a.createElement("rect", { width: "1", height: "1", rx: ".5", transform: "matrix(0 1 1 0 9 7)", fill: n }),
			a.createElement("rect", { width: "1", height: "1", rx: ".5", transform: "matrix(0 1 1 0 9 13)", fill: n }),
			a.createElement("rect", { width: "1", height: "1", rx: ".5", transform: "matrix(0 1 1 0 11 7)", fill: n }),
			a.createElement("rect", { width: "1", height: "1", rx: ".5", transform: "matrix(0 1 1 0 11 13)", fill: n }),
			a.createElement("rect", { width: "1", height: "1", rx: ".5", transform: "matrix(0 1 1 0 5 1)", fill: n }),
			a.createElement("rect", { width: "1", height: "1", rx: ".5", transform: "matrix(0 1 1 0 3 1)", fill: n }),
			a.createElement("rect", { width: "1", height: "1", rx: ".5", transform: "matrix(0 1 1 0 7 1)", fill: n }),
			a.createElement("rect", { width: "1", height: "1", rx: ".5", transform: "matrix(0 1 1 0 1 1)", fill: n }),
			a.createElement("rect", { width: "1", height: "1", rx: ".5", transform: "matrix(0 1 1 0 9 1)", fill: n }),
			a.createElement("rect", { width: "1", height: "1", rx: ".5", transform: "matrix(0 1 1 0 11 1)", fill: n }),
		)
	}),
	Hl = ["color"],
	Vm = a.forwardRef(function (e, t) {
		var r = e.color,
			n = r === void 0 ? "currentColor" : r,
			o = Q(e, Hl)
		return a.createElement(
			"svg",
			Object.assign(
				{ width: "15", height: "15", viewBox: "0 0 15 15", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
				o,
				{ ref: t },
			),
			a.createElement("path", {
				d: "M14 1.75L1 1.75L1 0.249999L14 0.25L14 1.75Z",
				fill: n,
				fillRule: "evenodd",
				clipRule: "evenodd",
			}),
			a.createElement("rect", {
				x: "8",
				y: "10",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(-180 8 10)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "2",
				y: "10",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(-180 2 10)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "8",
				y: "12",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(-180 8 12)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "2",
				y: "12",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(-180 2 12)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "8",
				y: "8",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(-180 8 8)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "8",
				y: "14",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(-180 8 14)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "2",
				y: "8",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(-180 2 8)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "2",
				y: "14",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(-180 2 14)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "10",
				y: "8",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(-180 10 8)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "10",
				y: "14",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(-180 10 14)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "12",
				y: "8",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(-180 12 8)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "12",
				y: "14",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(-180 12 14)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "6",
				y: "8",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(-180 6 8)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "6",
				y: "14",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(-180 6 14)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "4",
				y: "8",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(-180 4 8)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "4",
				y: "14",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(-180 4 14)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "8",
				y: "6",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(-180 8 6)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "2",
				y: "6",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(-180 2 6)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "8",
				y: "4",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(-180 8 4)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "2",
				y: "4",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(-180 2 4)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "14",
				y: "10",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(-180 14 10)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "14",
				y: "12",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(-180 14 12)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "14",
				y: "8",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(-180 14 8)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "14",
				y: "14",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(-180 14 14)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "14",
				y: "6",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(-180 14 6)",
				fill: n,
			}),
			a.createElement("rect", {
				x: "14",
				y: "4",
				width: "1",
				height: "1",
				rx: ".5",
				transform: "rotate(-180 14 4)",
				fill: n,
			}),
		)
	}),
	Vl = ["color"],
	zm = a.forwardRef(function (e, t) {
		var r = e.color,
			n = r === void 0 ? "currentColor" : r,
			o = Q(e, Vl)
		return a.createElement(
			"svg",
			Object.assign(
				{ width: "15", height: "15", viewBox: "0 0 15 15", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
				o,
				{ ref: t },
			),
			a.createElement("path", {
				d: "M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z",
				fill: n,
				fillRule: "evenodd",
				clipRule: "evenodd",
			}),
		)
	}),
	zl = ["color"],
	Kl = a.forwardRef(function (e, t) {
		var r = e.color,
			n = r === void 0 ? "currentColor" : r,
			o = Q(e, zl)
		return a.createElement(
			"svg",
			Object.assign(
				{ width: "15", height: "15", viewBox: "0 0 15 15", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
				o,
				{ ref: t },
			),
			a.createElement("path", {
				d: "M4.18179 8.81819C4.00605 8.64245 4.00605 8.35753 4.18179 8.18179L7.18179 5.18179C7.26618 5.0974 7.38064 5.04999 7.49999 5.04999C7.61933 5.04999 7.73379 5.0974 7.81819 5.18179L10.8182 8.18179C10.9939 8.35753 10.9939 8.64245 10.8182 8.81819C10.6424 8.99392 10.3575 8.99392 10.1818 8.81819L7.49999 6.13638L4.81819 8.81819C4.64245 8.99392 4.35753 8.99392 4.18179 8.81819Z",
				fill: n,
				fillRule: "evenodd",
				clipRule: "evenodd",
			}),
		)
	}),
	Ul = ["color"],
	Wl = a.forwardRef(function (e, t) {
		var r = e.color,
			n = r === void 0 ? "currentColor" : r,
			o = Q(e, Ul)
		return a.createElement(
			"svg",
			Object.assign(
				{ width: "15", height: "15", viewBox: "0 0 15 15", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
				o,
				{ ref: t },
			),
			a.createElement("path", {
				d: "M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z",
				fill: n,
				fillRule: "evenodd",
				clipRule: "evenodd",
			}),
		)
	}),
	Gl = ["color"],
	Km = a.forwardRef(function (e, t) {
		var r = e.color,
			n = r === void 0 ? "currentColor" : r,
			o = Q(e, Gl)
		return a.createElement(
			"svg",
			Object.assign(
				{ width: "15", height: "15", viewBox: "0 0 15 15", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
				o,
				{ ref: t },
			),
			a.createElement("path", {
				d: "M1 9.50006C1 10.3285 1.67157 11.0001 2.5 11.0001H4L4 10.0001H2.5C2.22386 10.0001 2 9.7762 2 9.50006L2 2.50006C2 2.22392 2.22386 2.00006 2.5 2.00006L9.5 2.00006C9.77614 2.00006 10 2.22392 10 2.50006V4.00002H5.5C4.67158 4.00002 4 4.67159 4 5.50002V12.5C4 13.3284 4.67158 14 5.5 14H12.5C13.3284 14 14 13.3284 14 12.5V5.50002C14 4.67159 13.3284 4.00002 12.5 4.00002H11V2.50006C11 1.67163 10.3284 1.00006 9.5 1.00006H2.5C1.67157 1.00006 1 1.67163 1 2.50006V9.50006ZM5 5.50002C5 5.22388 5.22386 5.00002 5.5 5.00002H12.5C12.7761 5.00002 13 5.22388 13 5.50002V12.5C13 12.7762 12.7761 13 12.5 13H5.5C5.22386 13 5 12.7762 5 12.5V5.50002Z",
				fill: n,
				fillRule: "evenodd",
				clipRule: "evenodd",
			}),
		)
	}),
	Yl = ["color"],
	Zl = a.forwardRef(function (e, t) {
		var r = e.color,
			n = r === void 0 ? "currentColor" : r,
			o = Q(e, Yl)
		return a.createElement(
			"svg",
			Object.assign(
				{ width: "15", height: "15", viewBox: "0 0 15 15", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
				o,
				{ ref: t },
			),
			a.createElement("path", {
				d: "M9.875 7.5C9.875 8.81168 8.81168 9.875 7.5 9.875C6.18832 9.875 5.125 8.81168 5.125 7.5C5.125 6.18832 6.18832 5.125 7.5 5.125C8.81168 5.125 9.875 6.18832 9.875 7.5Z",
				fill: n,
			}),
		)
	}),
	ql = ["color"],
	Um = a.forwardRef(function (e, t) {
		var r = e.color,
			n = r === void 0 ? "currentColor" : r,
			o = Q(e, ql)
		return a.createElement(
			"svg",
			Object.assign(
				{ width: "15", height: "15", viewBox: "0 0 15 15", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
				o,
				{ ref: t },
			),
			a.createElement("path", {
				d: "M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z",
				fill: n,
				fillRule: "evenodd",
				clipRule: "evenodd",
			}),
		)
	}),
	Xl = ["color"],
	Ql = a.forwardRef(function (e, t) {
		var r = e.color,
			n = r === void 0 ? "currentColor" : r,
			o = Q(e, Xl)
		return a.createElement(
			"svg",
			Object.assign(
				{ width: "15", height: "15", viewBox: "0 0 15 15", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
				o,
				{ ref: t },
			),
			a.createElement("path", {
				d: "M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z",
				fill: n,
				fillRule: "evenodd",
				clipRule: "evenodd",
			}),
		)
	}),
	Jl = ["color"],
	Wm = a.forwardRef(function (e, t) {
		var r = e.color,
			n = r === void 0 ? "currentColor" : r,
			o = Q(e, Jl)
		return a.createElement(
			"svg",
			Object.assign(
				{ width: "15", height: "15", viewBox: "0 0 15 15", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
				o,
				{ ref: t },
			),
			a.createElement("path", {
				d: "M1.20308 1.04312C1.00481 0.954998 0.772341 1.0048 0.627577 1.16641C0.482813 1.32802 0.458794 1.56455 0.568117 1.75196L3.92115 7.50002L0.568117 13.2481C0.458794 13.4355 0.482813 13.672 0.627577 13.8336C0.772341 13.9952 1.00481 14.045 1.20308 13.9569L14.7031 7.95693C14.8836 7.87668 15 7.69762 15 7.50002C15 7.30243 14.8836 7.12337 14.7031 7.04312L1.20308 1.04312ZM4.84553 7.10002L2.21234 2.586L13.2689 7.50002L2.21234 12.414L4.84552 7.90002H9C9.22092 7.90002 9.4 7.72094 9.4 7.50002C9.4 7.27911 9.22092 7.10002 9 7.10002H4.84553Z",
				fill: n,
				fillRule: "evenodd",
				clipRule: "evenodd",
			}),
		)
	}),
	eu = ["color"],
	Gm = a.forwardRef(function (e, t) {
		var r = e.color,
			n = r === void 0 ? "currentColor" : r,
			o = Q(e, eu)
		return a.createElement(
			"svg",
			Object.assign(
				{ width: "15", height: "15", viewBox: "0 0 15 15", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
				o,
				{ ref: t },
			),
			a.createElement("path", {
				d: "M2 3C2 2.44772 2.44772 2 3 2H12C12.5523 2 13 2.44772 13 3V12C13 12.5523 12.5523 13 12 13H3C2.44772 13 2 12.5523 2 12V3ZM12 3H3V12H12V3Z",
				fill: n,
				fillRule: "evenodd",
				clipRule: "evenodd",
			}),
		)
	}),
	tu = ["color"],
	Ym = a.forwardRef(function (e, t) {
		var r = e.color,
			n = r === void 0 ? "currentColor" : r,
			o = Q(e, tu)
		return a.createElement(
			"svg",
			Object.assign(
				{ width: "15", height: "15", viewBox: "0 0 15 15", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
				o,
				{ ref: t },
			),
			a.createElement("path", {
				d: "M2 4.5C2 4.22386 2.22386 4 2.5 4H12.5C12.7761 4 13 4.22386 13 4.5C13 4.77614 12.7761 5 12.5 5H2.5C2.22386 5 2 4.77614 2 4.5ZM4 7.5C4 7.22386 4.22386 7 4.5 7H10.5C10.7761 7 11 7.22386 11 7.5C11 7.77614 10.7761 8 10.5 8H4.5C4.22386 8 4 7.77614 4 7.5ZM3 10.5C3 10.2239 3.22386 10 3.5 10H11.5C11.7761 10 12 10.2239 12 10.5C12 10.7761 11.7761 11 11.5 11H3.5C3.22386 11 3 10.7761 3 10.5Z",
				fill: n,
				fillRule: "evenodd",
				clipRule: "evenodd",
			}),
		)
	}),
	ru = ["color"],
	Zm = a.forwardRef(function (e, t) {
		var r = e.color,
			n = r === void 0 ? "currentColor" : r,
			o = Q(e, ru)
		return a.createElement(
			"svg",
			Object.assign(
				{ width: "15", height: "15", viewBox: "0 0 15 15", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
				o,
				{ ref: t },
			),
			a.createElement("path", {
				d: "M2 4.5C2 4.22386 2.22386 4 2.5 4H12.5C12.7761 4 13 4.22386 13 4.5C13 4.77614 12.7761 5 12.5 5H2.5C2.22386 5 2 4.77614 2 4.5ZM2 7.5C2 7.22386 2.22386 7 2.5 7H7.5C7.77614 7 8 7.22386 8 7.5C8 7.77614 7.77614 8 7.5 8H2.5C2.22386 8 2 7.77614 2 7.5ZM2 10.5C2 10.2239 2.22386 10 2.5 10H10.5C10.7761 10 11 10.2239 11 10.5C11 10.7761 10.7761 11 10.5 11H2.5C2.22386 11 2 10.7761 2 10.5Z",
				fill: n,
				fillRule: "evenodd",
				clipRule: "evenodd",
			}),
		)
	}),
	nu = ["color"],
	qm = a.forwardRef(function (e, t) {
		var r = e.color,
			n = r === void 0 ? "currentColor" : r,
			o = Q(e, nu)
		return a.createElement(
			"svg",
			Object.assign(
				{ width: "15", height: "15", viewBox: "0 0 15 15", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
				o,
				{ ref: t },
			),
			a.createElement("path", {
				d: "M2 4.5C2 4.22386 2.22386 4 2.5 4H12.5C12.7761 4 13 4.22386 13 4.5C13 4.77614 12.7761 5 12.5 5H2.5C2.22386 5 2 4.77614 2 4.5ZM7 7.5C7 7.22386 7.22386 7 7.5 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H7.5C7.22386 8 7 7.77614 7 7.5ZM4 10.5C4 10.2239 4.22386 10 4.5 10H12.5C12.7761 10 13 10.2239 13 10.5C13 10.7761 12.7761 11 12.5 11H4.5C4.22386 11 4 10.7761 4 10.5Z",
				fill: n,
				fillRule: "evenodd",
				clipRule: "evenodd",
			}),
		)
	})
const Qo = a.forwardRef(({ className: e, ...t }, r) =>
	p.jsx(ee, {
		ref: r,
		className: X("flex h-full w-full flex-col overflow-hidden rounded-lg bg-popover text-popover-foreground", e),
		...t,
	}),
)
Qo.displayName = ee.displayName
const Jo = a.forwardRef(({ className: e, ...t }, r) =>
	p.jsxs("div", {
		className: "flex items-center border-b border-vscode-dropdown-border px-3",
		"cmdk-input-wrapper": "",
		children: [
			p.jsx(Ql, { className: "mr-2 h-4 w-4 shrink-0 opacity-50" }),
			p.jsx(ee.Input, {
				ref: r,
				className: X(
					"flex h-10 w-full rounded-lg bg-transparent py-3 text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
					e,
				),
				...t,
			}),
		],
	}),
)
Jo.displayName = ee.Input.displayName
const ei = a.forwardRef(({ className: e, ...t }, r) =>
	p.jsx(ee.List, { ref: r, className: X("max-h-[300px] overflow-y-auto overflow-x-hidden", e), ...t }),
)
ei.displayName = ee.List.displayName
const ti = a.forwardRef((e, t) => p.jsx(ee.Empty, { ref: t, className: "py-6 text-center text-sm", ...e }))
ti.displayName = ee.Empty.displayName
const ri = a.forwardRef(({ className: e, ...t }, r) =>
	p.jsx(ee.Group, {
		ref: r,
		className: X(
			"overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
			e,
		),
		...t,
	}),
)
ri.displayName = ee.Group.displayName
const ni = a.forwardRef(({ className: e, ...t }, r) =>
	p.jsx(ee.Separator, { ref: r, className: X("-mx-1 h-px bg-vscode-dropdown-border", e), ...t }),
)
ni.displayName = ee.Separator.displayName
const oi = a.forwardRef(({ className: e, ...t }, r) =>
	p.jsx(ee.Item, {
		ref: r,
		className: X(
			"relative flex gap-2 select-none items-center px-2 py-1.5 outline-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
			"data-[selected=true]:bg-vscode-list-activeSelectionBackground data-[selected=true]:text-vscode-list-activeSelectionForeground",
			"text-vscode-dropdown-foreground text-sm",
			"rounded-lg active:opacity-90 cursor-pointer",
			e,
		),
		...t,
	}),
)
oi.displayName = ee.Item.displayName
Qo.__docgenInfo = { description: "", methods: [] }
Jo.__docgenInfo = { description: "", methods: [] }
ei.__docgenInfo = { description: "", methods: [] }
ti.__docgenInfo = { description: "", methods: [] }
ri.__docgenInfo = { description: "", methods: [] }
oi.__docgenInfo = { description: "", methods: [] }
ni.__docgenInfo = { description: "", methods: [] }
function Qr(e) {
	const t = e + "CollectionProvider",
		[r, n] = ue(t),
		[o, i] = r(t, { collectionRef: { current: null }, itemMap: new Map() }),
		s = (h) => {
			const { scope: v, children: w } = h,
				b = Ne.useRef(null),
				C = Ne.useRef(new Map()).current
			return p.jsx(o, { scope: v, itemMap: C, collectionRef: b, children: w })
		}
	s.displayName = t
	const c = e + "CollectionSlot",
		d = ct(c),
		l = Ne.forwardRef((h, v) => {
			const { scope: w, children: b } = h,
				C = i(c, w),
				E = q(v, C.collectionRef)
			return p.jsx(d, { ref: E, children: b })
		})
	l.displayName = c
	const u = e + "CollectionItemSlot",
		f = "data-radix-collection-item",
		m = ct(u),
		g = Ne.forwardRef((h, v) => {
			const { scope: w, children: b, ...C } = h,
				E = Ne.useRef(null),
				R = q(v, E),
				M = i(u, w)
			return (
				Ne.useEffect(() => (M.itemMap.set(E, { ref: E, ...C }), () => void M.itemMap.delete(E))),
				p.jsx(m, { [f]: "", ref: R, children: b })
			)
		})
	g.displayName = u
	function x(h) {
		const v = i(e + "CollectionConsumer", h)
		return Ne.useCallback(() => {
			const b = v.collectionRef.current
			if (!b) return []
			const C = Array.from(b.querySelectorAll(`[${f}]`))
			return Array.from(v.itemMap.values()).sort((M, S) => C.indexOf(M.ref.current) - C.indexOf(S.ref.current))
		}, [v.collectionRef, v.itemMap])
	}
	return [{ Provider: s, Slot: l, ItemSlot: g }, x, n]
}
var ou = a.createContext(void 0)
function Jr(e) {
	const t = a.useContext(ou)
	return e || t || "ltr"
}
const iu = ["top", "right", "bottom", "left"],
	Pe = Math.min,
	te = Math.max,
	Bt = Math.round,
	Dt = Math.floor,
	me = (e) => ({ x: e, y: e }),
	au = { left: "right", right: "left", bottom: "top", top: "bottom" },
	su = { start: "end", end: "start" }
function Nr(e, t, r) {
	return te(e, Pe(t, r))
}
function we(e, t) {
	return typeof e == "function" ? e(t) : e
}
function ye(e) {
	return e.split("-")[0]
}
function et(e) {
	return e.split("-")[1]
}
function en(e) {
	return e === "x" ? "y" : "x"
}
function tn(e) {
	return e === "y" ? "height" : "width"
}
function ve(e) {
	return ["top", "bottom"].includes(ye(e)) ? "y" : "x"
}
function rn(e) {
	return en(ve(e))
}
function cu(e, t, r) {
	r === void 0 && (r = !1)
	const n = et(e),
		o = rn(e),
		i = tn(o)
	let s = o === "x" ? (n === (r ? "end" : "start") ? "right" : "left") : n === "start" ? "bottom" : "top"
	return t.reference[i] > t.floating[i] && (s = Ht(s)), [s, Ht(s)]
}
function lu(e) {
	const t = Ht(e)
	return [Ir(e), t, Ir(t)]
}
function Ir(e) {
	return e.replace(/start|end/g, (t) => su[t])
}
function uu(e, t, r) {
	const n = ["left", "right"],
		o = ["right", "left"],
		i = ["top", "bottom"],
		s = ["bottom", "top"]
	switch (e) {
		case "top":
		case "bottom":
			return r ? (t ? o : n) : t ? n : o
		case "left":
		case "right":
			return t ? i : s
		default:
			return []
	}
}
function du(e, t, r, n) {
	const o = et(e)
	let i = uu(ye(e), r === "start", n)
	return o && ((i = i.map((s) => s + "-" + o)), t && (i = i.concat(i.map(Ir)))), i
}
function Ht(e) {
	return e.replace(/left|right|bottom|top/g, (t) => au[t])
}
function fu(e) {
	return { top: 0, right: 0, bottom: 0, left: 0, ...e }
}
function ii(e) {
	return typeof e != "number" ? fu(e) : { top: e, right: e, bottom: e, left: e }
}
function Vt(e) {
	const { x: t, y: r, width: n, height: o } = e
	return { width: n, height: o, top: r, left: t, right: t + n, bottom: r + o, x: t, y: r }
}
function Kn(e, t, r) {
	let { reference: n, floating: o } = e
	const i = ve(t),
		s = rn(t),
		c = tn(s),
		d = ye(t),
		l = i === "y",
		u = n.x + n.width / 2 - o.width / 2,
		f = n.y + n.height / 2 - o.height / 2,
		m = n[c] / 2 - o[c] / 2
	let g
	switch (d) {
		case "top":
			g = { x: u, y: n.y - o.height }
			break
		case "bottom":
			g = { x: u, y: n.y + n.height }
			break
		case "right":
			g = { x: n.x + n.width, y: f }
			break
		case "left":
			g = { x: n.x - o.width, y: f }
			break
		default:
			g = { x: n.x, y: n.y }
	}
	switch (et(t)) {
		case "start":
			g[s] -= m * (r && l ? -1 : 1)
			break
		case "end":
			g[s] += m * (r && l ? -1 : 1)
			break
	}
	return g
}
const pu = async (e, t, r) => {
	const { placement: n = "bottom", strategy: o = "absolute", middleware: i = [], platform: s } = r,
		c = i.filter(Boolean),
		d = await (s.isRTL == null ? void 0 : s.isRTL(t))
	let l = await s.getElementRects({ reference: e, floating: t, strategy: o }),
		{ x: u, y: f } = Kn(l, n, d),
		m = n,
		g = {},
		x = 0
	for (let h = 0; h < c.length; h++) {
		const { name: v, fn: w } = c[h],
			{
				x: b,
				y: C,
				data: E,
				reset: R,
			} = await w({
				x: u,
				y: f,
				initialPlacement: n,
				placement: m,
				strategy: o,
				middlewareData: g,
				rects: l,
				platform: s,
				elements: { reference: e, floating: t },
			})
		;(u = b ?? u),
			(f = C ?? f),
			(g = { ...g, [v]: { ...g[v], ...E } }),
			R &&
				x <= 50 &&
				(x++,
				typeof R == "object" &&
					(R.placement && (m = R.placement),
					R.rects &&
						(l =
							R.rects === !0
								? await s.getElementRects({ reference: e, floating: t, strategy: o })
								: R.rects),
					({ x: u, y: f } = Kn(l, m, d))),
				(h = -1))
	}
	return { x: u, y: f, placement: m, strategy: o, middlewareData: g }
}
async function lt(e, t) {
	var r
	t === void 0 && (t = {})
	const { x: n, y: o, platform: i, rects: s, elements: c, strategy: d } = e,
		{
			boundary: l = "clippingAncestors",
			rootBoundary: u = "viewport",
			elementContext: f = "floating",
			altBoundary: m = !1,
			padding: g = 0,
		} = we(t, e),
		x = ii(g),
		v = c[m ? (f === "floating" ? "reference" : "floating") : f],
		w = Vt(
			await i.getClippingRect({
				element:
					(r = await (i.isElement == null ? void 0 : i.isElement(v))) == null || r
						? v
						: v.contextElement ||
							(await (i.getDocumentElement == null ? void 0 : i.getDocumentElement(c.floating))),
				boundary: l,
				rootBoundary: u,
				strategy: d,
			}),
		),
		b = f === "floating" ? { x: n, y: o, width: s.floating.width, height: s.floating.height } : s.reference,
		C = await (i.getOffsetParent == null ? void 0 : i.getOffsetParent(c.floating)),
		E = (await (i.isElement == null ? void 0 : i.isElement(C)))
			? (await (i.getScale == null ? void 0 : i.getScale(C))) || { x: 1, y: 1 }
			: { x: 1, y: 1 },
		R = Vt(
			i.convertOffsetParentRelativeRectToViewportRelativeRect
				? await i.convertOffsetParentRelativeRectToViewportRelativeRect({
						elements: c,
						rect: b,
						offsetParent: C,
						strategy: d,
					})
				: b,
		)
	return {
		top: (w.top - R.top + x.top) / E.y,
		bottom: (R.bottom - w.bottom + x.bottom) / E.y,
		left: (w.left - R.left + x.left) / E.x,
		right: (R.right - w.right + x.right) / E.x,
	}
}
const mu = (e) => ({
		name: "arrow",
		options: e,
		async fn(t) {
			const { x: r, y: n, placement: o, rects: i, platform: s, elements: c, middlewareData: d } = t,
				{ element: l, padding: u = 0 } = we(e, t) || {}
			if (l == null) return {}
			const f = ii(u),
				m = { x: r, y: n },
				g = rn(o),
				x = tn(g),
				h = await s.getDimensions(l),
				v = g === "y",
				w = v ? "top" : "left",
				b = v ? "bottom" : "right",
				C = v ? "clientHeight" : "clientWidth",
				E = i.reference[x] + i.reference[g] - m[g] - i.floating[x],
				R = m[g] - i.reference[g],
				M = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(l))
			let S = M ? M[C] : 0
			;(!S || !(await (s.isElement == null ? void 0 : s.isElement(M)))) && (S = c.floating[C] || i.floating[x])
			const _ = E / 2 - R / 2,
				$ = S / 2 - h[x] / 2 - 1,
				T = Pe(f[w], $),
				k = Pe(f[b], $),
				z = T,
				K = S - h[x] - k,
				P = S / 2 - h[x] / 2 + _,
				O = Nr(z, P, K),
				j = !d.arrow && et(o) != null && P !== O && i.reference[x] / 2 - (P < z ? T : k) - h[x] / 2 < 0,
				U = j ? (P < z ? P - z : P - K) : 0
			return {
				[g]: m[g] + U,
				data: { [g]: O, centerOffset: P - O - U, ...(j && { alignmentOffset: U }) },
				reset: j,
			}
		},
	}),
	hu = function (e) {
		return (
			e === void 0 && (e = {}),
			{
				name: "flip",
				options: e,
				async fn(t) {
					var r, n
					const {
							placement: o,
							middlewareData: i,
							rects: s,
							initialPlacement: c,
							platform: d,
							elements: l,
						} = t,
						{
							mainAxis: u = !0,
							crossAxis: f = !0,
							fallbackPlacements: m,
							fallbackStrategy: g = "bestFit",
							fallbackAxisSideDirection: x = "none",
							flipAlignment: h = !0,
							...v
						} = we(e, t)
					if ((r = i.arrow) != null && r.alignmentOffset) return {}
					const w = ye(o),
						b = ve(c),
						C = ye(c) === c,
						E = await (d.isRTL == null ? void 0 : d.isRTL(l.floating)),
						R = m || (C || !h ? [Ht(c)] : lu(c)),
						M = x !== "none"
					!m && M && R.push(...du(c, h, x, E))
					const S = [c, ...R],
						_ = await lt(t, v),
						$ = []
					let T = ((n = i.flip) == null ? void 0 : n.overflows) || []
					if ((u && $.push(_[w]), f)) {
						const O = cu(o, s, E)
						$.push(_[O[0]], _[O[1]])
					}
					if (((T = [...T, { placement: o, overflows: $ }]), !$.every((O) => O <= 0))) {
						var k, z
						const O = (((k = i.flip) == null ? void 0 : k.index) || 0) + 1,
							j = S[O]
						if (j) {
							var K
							const F = f === "alignment" ? b !== ve(j) : !1,
								I = ((K = T[0]) == null ? void 0 : K.overflows[0]) > 0
							if (!F || I) return { data: { index: O, overflows: T }, reset: { placement: j } }
						}
						let U =
							(z = T.filter((F) => F.overflows[0] <= 0).sort(
								(F, I) => F.overflows[1] - I.overflows[1],
							)[0]) == null
								? void 0
								: z.placement
						if (!U)
							switch (g) {
								case "bestFit": {
									var P
									const F =
										(P = T.filter((I) => {
											if (M) {
												const W = ve(I.placement)
												return W === b || W === "y"
											}
											return !0
										})
											.map((I) => [
												I.placement,
												I.overflows.filter((W) => W > 0).reduce((W, Z) => W + Z, 0),
											])
											.sort((I, W) => I[1] - W[1])[0]) == null
											? void 0
											: P[0]
									F && (U = F)
									break
								}
								case "initialPlacement":
									U = c
									break
							}
						if (o !== U) return { reset: { placement: U } }
					}
					return {}
				},
			}
		)
	}
function Un(e, t) {
	return { top: e.top - t.height, right: e.right - t.width, bottom: e.bottom - t.height, left: e.left - t.width }
}
function Wn(e) {
	return iu.some((t) => e[t] >= 0)
}
const gu = function (e) {
	return (
		e === void 0 && (e = {}),
		{
			name: "hide",
			options: e,
			async fn(t) {
				const { rects: r } = t,
					{ strategy: n = "referenceHidden", ...o } = we(e, t)
				switch (n) {
					case "referenceHidden": {
						const i = await lt(t, { ...o, elementContext: "reference" }),
							s = Un(i, r.reference)
						return { data: { referenceHiddenOffsets: s, referenceHidden: Wn(s) } }
					}
					case "escaped": {
						const i = await lt(t, { ...o, altBoundary: !0 }),
							s = Un(i, r.floating)
						return { data: { escapedOffsets: s, escaped: Wn(s) } }
					}
					default:
						return {}
				}
			},
		}
	)
}
async function vu(e, t) {
	const { placement: r, platform: n, elements: o } = e,
		i = await (n.isRTL == null ? void 0 : n.isRTL(o.floating)),
		s = ye(r),
		c = et(r),
		d = ve(r) === "y",
		l = ["left", "top"].includes(s) ? -1 : 1,
		u = i && d ? -1 : 1,
		f = we(t, e)
	let {
		mainAxis: m,
		crossAxis: g,
		alignmentAxis: x,
	} = typeof f == "number"
		? { mainAxis: f, crossAxis: 0, alignmentAxis: null }
		: { mainAxis: f.mainAxis || 0, crossAxis: f.crossAxis || 0, alignmentAxis: f.alignmentAxis }
	return (
		c && typeof x == "number" && (g = c === "end" ? x * -1 : x), d ? { x: g * u, y: m * l } : { x: m * l, y: g * u }
	)
}
const xu = function (e) {
		return (
			e === void 0 && (e = 0),
			{
				name: "offset",
				options: e,
				async fn(t) {
					var r, n
					const { x: o, y: i, placement: s, middlewareData: c } = t,
						d = await vu(t, e)
					return s === ((r = c.offset) == null ? void 0 : r.placement) &&
						(n = c.arrow) != null &&
						n.alignmentOffset
						? {}
						: { x: o + d.x, y: i + d.y, data: { ...d, placement: s } }
				},
			}
		)
	},
	wu = function (e) {
		return (
			e === void 0 && (e = {}),
			{
				name: "shift",
				options: e,
				async fn(t) {
					const { x: r, y: n, placement: o } = t,
						{
							mainAxis: i = !0,
							crossAxis: s = !1,
							limiter: c = {
								fn: (v) => {
									let { x: w, y: b } = v
									return { x: w, y: b }
								},
							},
							...d
						} = we(e, t),
						l = { x: r, y: n },
						u = await lt(t, d),
						f = ve(ye(o)),
						m = en(f)
					let g = l[m],
						x = l[f]
					if (i) {
						const v = m === "y" ? "top" : "left",
							w = m === "y" ? "bottom" : "right",
							b = g + u[v],
							C = g - u[w]
						g = Nr(b, g, C)
					}
					if (s) {
						const v = f === "y" ? "top" : "left",
							w = f === "y" ? "bottom" : "right",
							b = x + u[v],
							C = x - u[w]
						x = Nr(b, x, C)
					}
					const h = c.fn({ ...t, [m]: g, [f]: x })
					return { ...h, data: { x: h.x - r, y: h.y - n, enabled: { [m]: i, [f]: s } } }
				},
			}
		)
	},
	yu = function (e) {
		return (
			e === void 0 && (e = {}),
			{
				options: e,
				fn(t) {
					const { x: r, y: n, placement: o, rects: i, middlewareData: s } = t,
						{ offset: c = 0, mainAxis: d = !0, crossAxis: l = !0 } = we(e, t),
						u = { x: r, y: n },
						f = ve(o),
						m = en(f)
					let g = u[m],
						x = u[f]
					const h = we(c, t),
						v = typeof h == "number" ? { mainAxis: h, crossAxis: 0 } : { mainAxis: 0, crossAxis: 0, ...h }
					if (d) {
						const C = m === "y" ? "height" : "width",
							E = i.reference[m] - i.floating[C] + v.mainAxis,
							R = i.reference[m] + i.reference[C] - v.mainAxis
						g < E ? (g = E) : g > R && (g = R)
					}
					if (l) {
						var w, b
						const C = m === "y" ? "width" : "height",
							E = ["top", "left"].includes(ye(o)),
							R =
								i.reference[f] -
								i.floating[C] +
								((E && ((w = s.offset) == null ? void 0 : w[f])) || 0) +
								(E ? 0 : v.crossAxis),
							M =
								i.reference[f] +
								i.reference[C] +
								(E ? 0 : ((b = s.offset) == null ? void 0 : b[f]) || 0) -
								(E ? v.crossAxis : 0)
						x < R ? (x = R) : x > M && (x = M)
					}
					return { [m]: g, [f]: x }
				},
			}
		)
	},
	bu = function (e) {
		return (
			e === void 0 && (e = {}),
			{
				name: "size",
				options: e,
				async fn(t) {
					var r, n
					const { placement: o, rects: i, platform: s, elements: c } = t,
						{ apply: d = () => {}, ...l } = we(e, t),
						u = await lt(t, l),
						f = ye(o),
						m = et(o),
						g = ve(o) === "y",
						{ width: x, height: h } = i.floating
					let v, w
					f === "top" || f === "bottom"
						? ((v = f),
							(w =
								m === ((await (s.isRTL == null ? void 0 : s.isRTL(c.floating))) ? "start" : "end")
									? "left"
									: "right"))
						: ((w = f), (v = m === "end" ? "top" : "bottom"))
					const b = h - u.top - u.bottom,
						C = x - u.left - u.right,
						E = Pe(h - u[v], b),
						R = Pe(x - u[w], C),
						M = !t.middlewareData.shift
					let S = E,
						_ = R
					if (
						((r = t.middlewareData.shift) != null && r.enabled.x && (_ = C),
						(n = t.middlewareData.shift) != null && n.enabled.y && (S = b),
						M && !m)
					) {
						const T = te(u.left, 0),
							k = te(u.right, 0),
							z = te(u.top, 0),
							K = te(u.bottom, 0)
						g
							? (_ = x - 2 * (T !== 0 || k !== 0 ? T + k : te(u.left, u.right)))
							: (S = h - 2 * (z !== 0 || K !== 0 ? z + K : te(u.top, u.bottom)))
					}
					await d({ ...t, availableWidth: _, availableHeight: S })
					const $ = await s.getDimensions(c.floating)
					return x !== $.width || h !== $.height ? { reset: { rects: !0 } } : {}
				},
			}
		)
	}
function tr() {
	return typeof window < "u"
}
function tt(e) {
	return ai(e) ? (e.nodeName || "").toLowerCase() : "#document"
}
function ne(e) {
	var t
	return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window
}
function ge(e) {
	var t
	return (t = (ai(e) ? e.ownerDocument : e.document) || window.document) == null ? void 0 : t.documentElement
}
function ai(e) {
	return tr() ? e instanceof Node || e instanceof ne(e).Node : !1
}
function ce(e) {
	return tr() ? e instanceof Element || e instanceof ne(e).Element : !1
}
function he(e) {
	return tr() ? e instanceof HTMLElement || e instanceof ne(e).HTMLElement : !1
}
function Gn(e) {
	return !tr() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof ne(e).ShadowRoot
}
function wt(e) {
	const { overflow: t, overflowX: r, overflowY: n, display: o } = le(e)
	return /auto|scroll|overlay|hidden|clip/.test(t + n + r) && !["inline", "contents"].includes(o)
}
function Cu(e) {
	return ["table", "td", "th"].includes(tt(e))
}
function rr(e) {
	return [":popover-open", ":modal"].some((t) => {
		try {
			return e.matches(t)
		} catch {
			return !1
		}
	})
}
function nn(e) {
	const t = on(),
		r = ce(e) ? le(e) : e
	return (
		["transform", "translate", "scale", "rotate", "perspective"].some((n) => (r[n] ? r[n] !== "none" : !1)) ||
		(r.containerType ? r.containerType !== "normal" : !1) ||
		(!t && (r.backdropFilter ? r.backdropFilter !== "none" : !1)) ||
		(!t && (r.filter ? r.filter !== "none" : !1)) ||
		["transform", "translate", "scale", "rotate", "perspective", "filter"].some((n) =>
			(r.willChange || "").includes(n),
		) ||
		["paint", "layout", "strict", "content"].some((n) => (r.contain || "").includes(n))
	)
}
function Eu(e) {
	let t = Me(e)
	for (; he(t) && !Ze(t); ) {
		if (nn(t)) return t
		if (rr(t)) return null
		t = Me(t)
	}
	return null
}
function on() {
	return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none")
}
function Ze(e) {
	return ["html", "body", "#document"].includes(tt(e))
}
function le(e) {
	return ne(e).getComputedStyle(e)
}
function nr(e) {
	return ce(e)
		? { scrollLeft: e.scrollLeft, scrollTop: e.scrollTop }
		: { scrollLeft: e.scrollX, scrollTop: e.scrollY }
}
function Me(e) {
	if (tt(e) === "html") return e
	const t = e.assignedSlot || e.parentNode || (Gn(e) && e.host) || ge(e)
	return Gn(t) ? t.host : t
}
function si(e) {
	const t = Me(e)
	return Ze(t) ? (e.ownerDocument ? e.ownerDocument.body : e.body) : he(t) && wt(t) ? t : si(t)
}
function ut(e, t, r) {
	var n
	t === void 0 && (t = []), r === void 0 && (r = !0)
	const o = si(e),
		i = o === ((n = e.ownerDocument) == null ? void 0 : n.body),
		s = ne(o)
	if (i) {
		const c = Or(s)
		return t.concat(s, s.visualViewport || [], wt(o) ? o : [], c && r ? ut(c) : [])
	}
	return t.concat(o, ut(o, [], r))
}
function Or(e) {
	return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null
}
function ci(e) {
	const t = le(e)
	let r = parseFloat(t.width) || 0,
		n = parseFloat(t.height) || 0
	const o = he(e),
		i = o ? e.offsetWidth : r,
		s = o ? e.offsetHeight : n,
		c = Bt(r) !== i || Bt(n) !== s
	return c && ((r = i), (n = s)), { width: r, height: n, $: c }
}
function an(e) {
	return ce(e) ? e : e.contextElement
}
function Ye(e) {
	const t = an(e)
	if (!he(t)) return me(1)
	const r = t.getBoundingClientRect(),
		{ width: n, height: o, $: i } = ci(t)
	let s = (i ? Bt(r.width) : r.width) / n,
		c = (i ? Bt(r.height) : r.height) / o
	return (!s || !Number.isFinite(s)) && (s = 1), (!c || !Number.isFinite(c)) && (c = 1), { x: s, y: c }
}
const Ru = me(0)
function li(e) {
	const t = ne(e)
	return !on() || !t.visualViewport ? Ru : { x: t.visualViewport.offsetLeft, y: t.visualViewport.offsetTop }
}
function Su(e, t, r) {
	return t === void 0 && (t = !1), !r || (t && r !== ne(e)) ? !1 : t
}
function ke(e, t, r, n) {
	t === void 0 && (t = !1), r === void 0 && (r = !1)
	const o = e.getBoundingClientRect(),
		i = an(e)
	let s = me(1)
	t && (n ? ce(n) && (s = Ye(n)) : (s = Ye(e)))
	const c = Su(i, r, n) ? li(i) : me(0)
	let d = (o.left + c.x) / s.x,
		l = (o.top + c.y) / s.y,
		u = o.width / s.x,
		f = o.height / s.y
	if (i) {
		const m = ne(i),
			g = n && ce(n) ? ne(n) : n
		let x = m,
			h = Or(x)
		for (; h && n && g !== x; ) {
			const v = Ye(h),
				w = h.getBoundingClientRect(),
				b = le(h),
				C = w.left + (h.clientLeft + parseFloat(b.paddingLeft)) * v.x,
				E = w.top + (h.clientTop + parseFloat(b.paddingTop)) * v.y
			;(d *= v.x), (l *= v.y), (u *= v.x), (f *= v.y), (d += C), (l += E), (x = ne(h)), (h = Or(x))
		}
	}
	return Vt({ width: u, height: f, x: d, y: l })
}
function sn(e, t) {
	const r = nr(e).scrollLeft
	return t ? t.left + r : ke(ge(e)).left + r
}
function ui(e, t, r) {
	r === void 0 && (r = !1)
	const n = e.getBoundingClientRect(),
		o = n.left + t.scrollLeft - (r ? 0 : sn(e, n)),
		i = n.top + t.scrollTop
	return { x: o, y: i }
}
function Pu(e) {
	let { elements: t, rect: r, offsetParent: n, strategy: o } = e
	const i = o === "fixed",
		s = ge(n),
		c = t ? rr(t.floating) : !1
	if (n === s || (c && i)) return r
	let d = { scrollLeft: 0, scrollTop: 0 },
		l = me(1)
	const u = me(0),
		f = he(n)
	if ((f || (!f && !i)) && ((tt(n) !== "body" || wt(s)) && (d = nr(n)), he(n))) {
		const g = ke(n)
		;(l = Ye(n)), (u.x = g.x + n.clientLeft), (u.y = g.y + n.clientTop)
	}
	const m = s && !f && !i ? ui(s, d, !0) : me(0)
	return {
		width: r.width * l.x,
		height: r.height * l.y,
		x: r.x * l.x - d.scrollLeft * l.x + u.x + m.x,
		y: r.y * l.y - d.scrollTop * l.y + u.y + m.y,
	}
}
function Mu(e) {
	return Array.from(e.getClientRects())
}
function Au(e) {
	const t = ge(e),
		r = nr(e),
		n = e.ownerDocument.body,
		o = te(t.scrollWidth, t.clientWidth, n.scrollWidth, n.clientWidth),
		i = te(t.scrollHeight, t.clientHeight, n.scrollHeight, n.clientHeight)
	let s = -r.scrollLeft + sn(e)
	const c = -r.scrollTop
	return le(n).direction === "rtl" && (s += te(t.clientWidth, n.clientWidth) - o), { width: o, height: i, x: s, y: c }
}
function _u(e, t) {
	const r = ne(e),
		n = ge(e),
		o = r.visualViewport
	let i = n.clientWidth,
		s = n.clientHeight,
		c = 0,
		d = 0
	if (o) {
		;(i = o.width), (s = o.height)
		const l = on()
		;(!l || (l && t === "fixed")) && ((c = o.offsetLeft), (d = o.offsetTop))
	}
	return { width: i, height: s, x: c, y: d }
}
function Nu(e, t) {
	const r = ke(e, !0, t === "fixed"),
		n = r.top + e.clientTop,
		o = r.left + e.clientLeft,
		i = he(e) ? Ye(e) : me(1),
		s = e.clientWidth * i.x,
		c = e.clientHeight * i.y,
		d = o * i.x,
		l = n * i.y
	return { width: s, height: c, x: d, y: l }
}
function Yn(e, t, r) {
	let n
	if (t === "viewport") n = _u(e, r)
	else if (t === "document") n = Au(ge(e))
	else if (ce(t)) n = Nu(t, r)
	else {
		const o = li(e)
		n = { x: t.x - o.x, y: t.y - o.y, width: t.width, height: t.height }
	}
	return Vt(n)
}
function di(e, t) {
	const r = Me(e)
	return r === t || !ce(r) || Ze(r) ? !1 : le(r).position === "fixed" || di(r, t)
}
function Iu(e, t) {
	const r = t.get(e)
	if (r) return r
	let n = ut(e, [], !1).filter((c) => ce(c) && tt(c) !== "body"),
		o = null
	const i = le(e).position === "fixed"
	let s = i ? Me(e) : e
	for (; ce(s) && !Ze(s); ) {
		const c = le(s),
			d = nn(s)
		!d && c.position === "fixed" && (o = null),
			(
				i
					? !d && !o
					: (!d && c.position === "static" && !!o && ["absolute", "fixed"].includes(o.position)) ||
						(wt(s) && !d && di(e, s))
			)
				? (n = n.filter((u) => u !== s))
				: (o = c),
			(s = Me(s))
	}
	return t.set(e, n), n
}
function Ou(e) {
	let { element: t, boundary: r, rootBoundary: n, strategy: o } = e
	const s = [...(r === "clippingAncestors" ? (rr(t) ? [] : Iu(t, this._c)) : [].concat(r)), n],
		c = s[0],
		d = s.reduce(
			(l, u) => {
				const f = Yn(t, u, o)
				return (
					(l.top = te(f.top, l.top)),
					(l.right = Pe(f.right, l.right)),
					(l.bottom = Pe(f.bottom, l.bottom)),
					(l.left = te(f.left, l.left)),
					l
				)
			},
			Yn(t, c, o),
		)
	return { width: d.right - d.left, height: d.bottom - d.top, x: d.left, y: d.top }
}
function Tu(e) {
	const { width: t, height: r } = ci(e)
	return { width: t, height: r }
}
function Du(e, t, r) {
	const n = he(t),
		o = ge(t),
		i = r === "fixed",
		s = ke(e, !0, i, t)
	let c = { scrollLeft: 0, scrollTop: 0 }
	const d = me(0)
	function l() {
		d.x = sn(o)
	}
	if (n || (!n && !i))
		if (((tt(t) !== "body" || wt(o)) && (c = nr(t)), n)) {
			const g = ke(t, !0, i, t)
			;(d.x = g.x + t.clientLeft), (d.y = g.y + t.clientTop)
		} else o && l()
	i && !n && o && l()
	const u = o && !n && !i ? ui(o, c) : me(0),
		f = s.left + c.scrollLeft - d.x - u.x,
		m = s.top + c.scrollTop - d.y - u.y
	return { x: f, y: m, width: s.width, height: s.height }
}
function Cr(e) {
	return le(e).position === "static"
}
function Zn(e, t) {
	if (!he(e) || le(e).position === "fixed") return null
	if (t) return t(e)
	let r = e.offsetParent
	return ge(e) === r && (r = r.ownerDocument.body), r
}
function fi(e, t) {
	const r = ne(e)
	if (rr(e)) return r
	if (!he(e)) {
		let o = Me(e)
		for (; o && !Ze(o); ) {
			if (ce(o) && !Cr(o)) return o
			o = Me(o)
		}
		return r
	}
	let n = Zn(e, t)
	for (; n && Cu(n) && Cr(n); ) n = Zn(n, t)
	return n && Ze(n) && Cr(n) && !nn(n) ? r : n || Eu(e) || r
}
const ku = async function (e) {
	const t = this.getOffsetParent || fi,
		r = this.getDimensions,
		n = await r(e.floating)
	return {
		reference: Du(e.reference, await t(e.floating), e.strategy),
		floating: { x: 0, y: 0, width: n.width, height: n.height },
	}
}
function Lu(e) {
	return le(e).direction === "rtl"
}
const ju = {
	convertOffsetParentRelativeRectToViewportRelativeRect: Pu,
	getDocumentElement: ge,
	getClippingRect: Ou,
	getOffsetParent: fi,
	getElementRects: ku,
	getClientRects: Mu,
	getDimensions: Tu,
	getScale: Ye,
	isElement: ce,
	isRTL: Lu,
}
function pi(e, t) {
	return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height
}
function Fu(e, t) {
	let r = null,
		n
	const o = ge(e)
	function i() {
		var c
		clearTimeout(n), (c = r) == null || c.disconnect(), (r = null)
	}
	function s(c, d) {
		c === void 0 && (c = !1), d === void 0 && (d = 1), i()
		const l = e.getBoundingClientRect(),
			{ left: u, top: f, width: m, height: g } = l
		if ((c || t(), !m || !g)) return
		const x = Dt(f),
			h = Dt(o.clientWidth - (u + m)),
			v = Dt(o.clientHeight - (f + g)),
			w = Dt(u),
			C = { rootMargin: -x + "px " + -h + "px " + -v + "px " + -w + "px", threshold: te(0, Pe(1, d)) || 1 }
		let E = !0
		function R(M) {
			const S = M[0].intersectionRatio
			if (S !== d) {
				if (!E) return s()
				S
					? s(!1, S)
					: (n = setTimeout(() => {
							s(!1, 1e-7)
						}, 1e3))
			}
			S === 1 && !pi(l, e.getBoundingClientRect()) && s(), (E = !1)
		}
		try {
			r = new IntersectionObserver(R, { ...C, root: o.ownerDocument })
		} catch {
			r = new IntersectionObserver(R, C)
		}
		r.observe(e)
	}
	return s(!0), i
}
function $u(e, t, r, n) {
	n === void 0 && (n = {})
	const {
			ancestorScroll: o = !0,
			ancestorResize: i = !0,
			elementResize: s = typeof ResizeObserver == "function",
			layoutShift: c = typeof IntersectionObserver == "function",
			animationFrame: d = !1,
		} = n,
		l = an(e),
		u = o || i ? [...(l ? ut(l) : []), ...ut(t)] : []
	u.forEach((w) => {
		o && w.addEventListener("scroll", r, { passive: !0 }), i && w.addEventListener("resize", r)
	})
	const f = l && c ? Fu(l, r) : null
	let m = -1,
		g = null
	s &&
		((g = new ResizeObserver((w) => {
			let [b] = w
			b &&
				b.target === l &&
				g &&
				(g.unobserve(t),
				cancelAnimationFrame(m),
				(m = requestAnimationFrame(() => {
					var C
					;(C = g) == null || C.observe(t)
				}))),
				r()
		})),
		l && !d && g.observe(l),
		g.observe(t))
	let x,
		h = d ? ke(e) : null
	d && v()
	function v() {
		const w = ke(e)
		h && !pi(h, w) && r(), (h = w), (x = requestAnimationFrame(v))
	}
	return (
		r(),
		() => {
			var w
			u.forEach((b) => {
				o && b.removeEventListener("scroll", r), i && b.removeEventListener("resize", r)
			}),
				f == null || f(),
				(w = g) == null || w.disconnect(),
				(g = null),
				d && cancelAnimationFrame(x)
		}
	)
}
const Bu = xu,
	Hu = wu,
	Vu = hu,
	zu = bu,
	Ku = gu,
	qn = mu,
	Uu = yu,
	Wu = (e, t, r) => {
		const n = new Map(),
			o = { platform: ju, ...r },
			i = { ...o.platform, _c: n }
		return pu(e, t, { ...o, platform: i })
	}
var jt = typeof document < "u" ? a.useLayoutEffect : a.useEffect
function zt(e, t) {
	if (e === t) return !0
	if (typeof e != typeof t) return !1
	if (typeof e == "function" && e.toString() === t.toString()) return !0
	let r, n, o
	if (e && t && typeof e == "object") {
		if (Array.isArray(e)) {
			if (((r = e.length), r !== t.length)) return !1
			for (n = r; n-- !== 0; ) if (!zt(e[n], t[n])) return !1
			return !0
		}
		if (((o = Object.keys(e)), (r = o.length), r !== Object.keys(t).length)) return !1
		for (n = r; n-- !== 0; ) if (!{}.hasOwnProperty.call(t, o[n])) return !1
		for (n = r; n-- !== 0; ) {
			const i = o[n]
			if (!(i === "_owner" && e.$$typeof) && !zt(e[i], t[i])) return !1
		}
		return !0
	}
	return e !== e && t !== t
}
function mi(e) {
	return typeof window > "u" ? 1 : (e.ownerDocument.defaultView || window).devicePixelRatio || 1
}
function Xn(e, t) {
	const r = mi(e)
	return Math.round(t * r) / r
}
function Er(e) {
	const t = a.useRef(e)
	return (
		jt(() => {
			t.current = e
		}),
		t
	)
}
function Gu(e) {
	e === void 0 && (e = {})
	const {
			placement: t = "bottom",
			strategy: r = "absolute",
			middleware: n = [],
			platform: o,
			elements: { reference: i, floating: s } = {},
			transform: c = !0,
			whileElementsMounted: d,
			open: l,
		} = e,
		[u, f] = a.useState({ x: 0, y: 0, strategy: r, placement: t, middlewareData: {}, isPositioned: !1 }),
		[m, g] = a.useState(n)
	zt(m, n) || g(n)
	const [x, h] = a.useState(null),
		[v, w] = a.useState(null),
		b = a.useCallback((F) => {
			F !== M.current && ((M.current = F), h(F))
		}, []),
		C = a.useCallback((F) => {
			F !== S.current && ((S.current = F), w(F))
		}, []),
		E = i || x,
		R = s || v,
		M = a.useRef(null),
		S = a.useRef(null),
		_ = a.useRef(u),
		$ = d != null,
		T = Er(d),
		k = Er(o),
		z = Er(l),
		K = a.useCallback(() => {
			if (!M.current || !S.current) return
			const F = { placement: t, strategy: r, middleware: m }
			k.current && (F.platform = k.current),
				Wu(M.current, S.current, F).then((I) => {
					const W = { ...I, isPositioned: z.current !== !1 }
					P.current &&
						!zt(_.current, W) &&
						((_.current = W),
						$s.flushSync(() => {
							f(W)
						}))
				})
		}, [m, t, r, k, z])
	jt(() => {
		l === !1 && _.current.isPositioned && ((_.current.isPositioned = !1), f((F) => ({ ...F, isPositioned: !1 })))
	}, [l])
	const P = a.useRef(!1)
	jt(
		() => (
			(P.current = !0),
			() => {
				P.current = !1
			}
		),
		[],
	),
		jt(() => {
			if ((E && (M.current = E), R && (S.current = R), E && R)) {
				if (T.current) return T.current(E, R, K)
				K()
			}
		}, [E, R, K, T, $])
	const O = a.useMemo(() => ({ reference: M, floating: S, setReference: b, setFloating: C }), [b, C]),
		j = a.useMemo(() => ({ reference: E, floating: R }), [E, R]),
		U = a.useMemo(() => {
			const F = { position: r, left: 0, top: 0 }
			if (!j.floating) return F
			const I = Xn(j.floating, u.x),
				W = Xn(j.floating, u.y)
			return c
				? {
						...F,
						transform: "translate(" + I + "px, " + W + "px)",
						...(mi(j.floating) >= 1.5 && { willChange: "transform" }),
					}
				: { position: r, left: I, top: W }
		}, [r, c, j.floating, u.x, u.y])
	return a.useMemo(() => ({ ...u, update: K, refs: O, elements: j, floatingStyles: U }), [u, K, O, j, U])
}
const Yu = (e) => {
		function t(r) {
			return {}.hasOwnProperty.call(r, "current")
		}
		return {
			name: "arrow",
			options: e,
			fn(r) {
				const { element: n, padding: o } = typeof e == "function" ? e(r) : e
				return n && t(n)
					? n.current != null
						? qn({ element: n.current, padding: o }).fn(r)
						: {}
					: n
						? qn({ element: n, padding: o }).fn(r)
						: {}
			},
		}
	},
	Zu = (e, t) => ({ ...Bu(e), options: [e, t] }),
	qu = (e, t) => ({ ...Hu(e), options: [e, t] }),
	Xu = (e, t) => ({ ...Uu(e), options: [e, t] }),
	Qu = (e, t) => ({ ...Vu(e), options: [e, t] }),
	Ju = (e, t) => ({ ...zu(e), options: [e, t] }),
	ed = (e, t) => ({ ...Ku(e), options: [e, t] }),
	td = (e, t) => ({ ...Yu(e), options: [e, t] })
var rd = "Arrow",
	hi = a.forwardRef((e, t) => {
		const { children: r, width: n = 10, height: o = 5, ...i } = e
		return p.jsx(H.svg, {
			...i,
			ref: t,
			width: n,
			height: o,
			viewBox: "0 0 30 10",
			preserveAspectRatio: "none",
			children: e.asChild ? r : p.jsx("polygon", { points: "0,0 30,0 15,10" }),
		})
	})
hi.displayName = rd
var nd = hi,
	cn = "Popper",
	[gi, rt] = ue(cn),
	[od, vi] = gi(cn),
	xi = (e) => {
		const { __scopePopper: t, children: r } = e,
			[n, o] = a.useState(null)
		return p.jsx(od, { scope: t, anchor: n, onAnchorChange: o, children: r })
	}
xi.displayName = cn
var wi = "PopperAnchor",
	yi = a.forwardRef((e, t) => {
		const { __scopePopper: r, virtualRef: n, ...o } = e,
			i = vi(wi, r),
			s = a.useRef(null),
			c = q(t, s)
		return (
			a.useEffect(() => {
				i.onAnchorChange((n == null ? void 0 : n.current) || s.current)
			}),
			n ? null : p.jsx(H.div, { ...o, ref: c })
		)
	})
yi.displayName = wi
var ln = "PopperContent",
	[id, ad] = gi(ln),
	bi = a.forwardRef((e, t) => {
		var V, G, Y, oe, Pt, Mt
		const {
				__scopePopper: r,
				side: n = "bottom",
				sideOffset: o = 0,
				align: i = "center",
				alignOffset: s = 0,
				arrowPadding: c = 0,
				avoidCollisions: d = !0,
				collisionBoundary: l = [],
				collisionPadding: u = 0,
				sticky: f = "partial",
				hideWhenDetached: m = !1,
				updatePositionStrategy: g = "optimized",
				onPlaced: x,
				...h
			} = e,
			v = vi(ln, r),
			[w, b] = a.useState(null),
			C = q(t, (_e) => b(_e)),
			[E, R] = a.useState(null),
			M = Yr(E),
			S = (M == null ? void 0 : M.width) ?? 0,
			_ = (M == null ? void 0 : M.height) ?? 0,
			$ = n + (i !== "center" ? "-" + i : ""),
			T = typeof u == "number" ? u : { top: 0, right: 0, bottom: 0, left: 0, ...u },
			k = Array.isArray(l) ? l : [l],
			z = k.length > 0,
			K = { padding: T, boundary: k.filter(cd), altBoundary: z },
			{
				refs: P,
				floatingStyles: O,
				placement: j,
				isPositioned: U,
				middlewareData: F,
			} = Gu({
				strategy: "fixed",
				placement: $,
				whileElementsMounted: (..._e) => $u(..._e, { animationFrame: g === "always" }),
				elements: { reference: v.anchor },
				middleware: [
					Zu({ mainAxis: o + _, alignmentAxis: s }),
					d && qu({ mainAxis: !0, crossAxis: !1, limiter: f === "partial" ? Xu() : void 0, ...K }),
					d && Qu({ ...K }),
					Ju({
						...K,
						apply: ({ elements: _e, rects: $e, availableWidth: se, availableHeight: dr }) => {
							const { width: At, height: be } = $e.reference,
								fe = _e.floating.style
							fe.setProperty("--radix-popper-available-width", `${se}px`),
								fe.setProperty("--radix-popper-available-height", `${dr}px`),
								fe.setProperty("--radix-popper-anchor-width", `${At}px`),
								fe.setProperty("--radix-popper-anchor-height", `${be}px`)
						},
					}),
					E && td({ element: E, padding: c }),
					ld({ arrowWidth: S, arrowHeight: _ }),
					m && ed({ strategy: "referenceHidden", ...K }),
				],
			}),
			[I, W] = Ri(j),
			Z = xe(x)
		Ft(() => {
			U && (Z == null || Z())
		}, [U, Z])
		const y = (V = F.arrow) == null ? void 0 : V.x,
			A = (G = F.arrow) == null ? void 0 : G.y,
			D = ((Y = F.arrow) == null ? void 0 : Y.centerOffset) !== 0,
			[N, B] = a.useState()
		return (
			Ft(() => {
				w && B(window.getComputedStyle(w).zIndex)
			}, [w]),
			p.jsx("div", {
				ref: P.setFloating,
				"data-radix-popper-content-wrapper": "",
				style: {
					...O,
					transform: U ? O.transform : "translate(0, -200%)",
					minWidth: "max-content",
					zIndex: N,
					"--radix-popper-transform-origin": [
						(oe = F.transformOrigin) == null ? void 0 : oe.x,
						(Pt = F.transformOrigin) == null ? void 0 : Pt.y,
					].join(" "),
					...(((Mt = F.hide) == null ? void 0 : Mt.referenceHidden) && {
						visibility: "hidden",
						pointerEvents: "none",
					}),
				},
				dir: e.dir,
				children: p.jsx(id, {
					scope: r,
					placedSide: I,
					onArrowChange: R,
					arrowX: y,
					arrowY: A,
					shouldHideArrow: D,
					children: p.jsx(H.div, {
						"data-side": I,
						"data-align": W,
						...h,
						ref: C,
						style: { ...h.style, animation: U ? void 0 : "none" },
					}),
				}),
			})
		)
	})
bi.displayName = ln
var Ci = "PopperArrow",
	sd = { top: "bottom", right: "left", bottom: "top", left: "right" },
	Ei = a.forwardRef(function (t, r) {
		const { __scopePopper: n, ...o } = t,
			i = ad(Ci, n),
			s = sd[i.placedSide]
		return p.jsx("span", {
			ref: i.onArrowChange,
			style: {
				position: "absolute",
				left: i.arrowX,
				top: i.arrowY,
				[s]: 0,
				transformOrigin: { top: "", right: "0 0", bottom: "center 0", left: "100% 0" }[i.placedSide],
				transform: {
					top: "translateY(100%)",
					right: "translateY(50%) rotate(90deg) translateX(-50%)",
					bottom: "rotate(180deg)",
					left: "translateY(50%) rotate(-90deg) translateX(50%)",
				}[i.placedSide],
				visibility: i.shouldHideArrow ? "hidden" : void 0,
			},
			children: p.jsx(nd, { ...o, ref: r, style: { ...o.style, display: "block" } }),
		})
	})
Ei.displayName = Ci
function cd(e) {
	return e !== null
}
var ld = (e) => ({
	name: "transformOrigin",
	options: e,
	fn(t) {
		var v, w, b
		const { placement: r, rects: n, middlewareData: o } = t,
			s = ((v = o.arrow) == null ? void 0 : v.centerOffset) !== 0,
			c = s ? 0 : e.arrowWidth,
			d = s ? 0 : e.arrowHeight,
			[l, u] = Ri(r),
			f = { start: "0%", center: "50%", end: "100%" }[u],
			m = (((w = o.arrow) == null ? void 0 : w.x) ?? 0) + c / 2,
			g = (((b = o.arrow) == null ? void 0 : b.y) ?? 0) + d / 2
		let x = "",
			h = ""
		return (
			l === "bottom"
				? ((x = s ? f : `${m}px`), (h = `${-d}px`))
				: l === "top"
					? ((x = s ? f : `${m}px`), (h = `${n.floating.height + d}px`))
					: l === "right"
						? ((x = `${-d}px`), (h = s ? f : `${g}px`))
						: l === "left" && ((x = `${n.floating.width + d}px`), (h = s ? f : `${g}px`)),
			{ data: { x, y: h } }
		)
	},
})
function Ri(e) {
	const [t, r = "center"] = e.split("-")
	return [t, r]
}
var Si = xi,
	or = yi,
	un = bi,
	dn = Ei,
	Rr = "rovingFocusGroup.onEntryFocus",
	ud = { bubbles: !1, cancelable: !0 },
	yt = "RovingFocusGroup",
	[Tr, Pi, dd] = Qr(yt),
	[fd, Mi] = ue(yt, [dd]),
	[pd, md] = fd(yt),
	Ai = a.forwardRef((e, t) =>
		p.jsx(Tr.Provider, {
			scope: e.__scopeRovingFocusGroup,
			children: p.jsx(Tr.Slot, { scope: e.__scopeRovingFocusGroup, children: p.jsx(hd, { ...e, ref: t }) }),
		}),
	)
Ai.displayName = yt
var hd = a.forwardRef((e, t) => {
		const {
				__scopeRovingFocusGroup: r,
				orientation: n,
				loop: o = !1,
				dir: i,
				currentTabStopId: s,
				defaultCurrentTabStopId: c,
				onCurrentTabStopIdChange: d,
				onEntryFocus: l,
				preventScrollOnEntryFocus: u = !1,
				...f
			} = e,
			m = a.useRef(null),
			g = q(t, m),
			x = Jr(i),
			[h, v] = Je({ prop: s, defaultProp: c ?? null, onChange: d, caller: yt }),
			[w, b] = a.useState(!1),
			C = xe(l),
			E = Pi(r),
			R = a.useRef(!1),
			[M, S] = a.useState(0)
		return (
			a.useEffect(() => {
				const _ = m.current
				if (_) return _.addEventListener(Rr, C), () => _.removeEventListener(Rr, C)
			}, [C]),
			p.jsx(pd, {
				scope: r,
				orientation: n,
				dir: x,
				loop: o,
				currentTabStopId: h,
				onItemFocus: a.useCallback((_) => v(_), [v]),
				onItemShiftTab: a.useCallback(() => b(!0), []),
				onFocusableItemAdd: a.useCallback(() => S((_) => _ + 1), []),
				onFocusableItemRemove: a.useCallback(() => S((_) => _ - 1), []),
				children: p.jsx(H.div, {
					tabIndex: w || M === 0 ? -1 : 0,
					"data-orientation": n,
					...f,
					ref: g,
					style: { outline: "none", ...e.style },
					onMouseDown: L(e.onMouseDown, () => {
						R.current = !0
					}),
					onFocus: L(e.onFocus, (_) => {
						const $ = !R.current
						if (_.target === _.currentTarget && $ && !w) {
							const T = new CustomEvent(Rr, ud)
							if ((_.currentTarget.dispatchEvent(T), !T.defaultPrevented)) {
								const k = E().filter((j) => j.focusable),
									z = k.find((j) => j.active),
									K = k.find((j) => j.id === h),
									O = [z, K, ...k].filter(Boolean).map((j) => j.ref.current)
								Ii(O, u)
							}
						}
						R.current = !1
					}),
					onBlur: L(e.onBlur, () => b(!1)),
				}),
			})
		)
	}),
	_i = "RovingFocusGroupItem",
	Ni = a.forwardRef((e, t) => {
		const { __scopeRovingFocusGroup: r, focusable: n = !0, active: o = !1, tabStopId: i, children: s, ...c } = e,
			d = re(),
			l = i || d,
			u = md(_i, r),
			f = u.currentTabStopId === l,
			m = Pi(r),
			{ onFocusableItemAdd: g, onFocusableItemRemove: x, currentTabStopId: h } = u
		return (
			a.useEffect(() => {
				if (n) return g(), () => x()
			}, [n, g, x]),
			p.jsx(Tr.ItemSlot, {
				scope: r,
				id: l,
				focusable: n,
				active: o,
				children: p.jsx(H.span, {
					tabIndex: f ? 0 : -1,
					"data-orientation": u.orientation,
					...c,
					ref: t,
					onMouseDown: L(e.onMouseDown, (v) => {
						n ? u.onItemFocus(l) : v.preventDefault()
					}),
					onFocus: L(e.onFocus, () => u.onItemFocus(l)),
					onKeyDown: L(e.onKeyDown, (v) => {
						if (v.key === "Tab" && v.shiftKey) {
							u.onItemShiftTab()
							return
						}
						if (v.target !== v.currentTarget) return
						const w = xd(v, u.orientation, u.dir)
						if (w !== void 0) {
							if (v.metaKey || v.ctrlKey || v.altKey || v.shiftKey) return
							v.preventDefault()
							let C = m()
								.filter((E) => E.focusable)
								.map((E) => E.ref.current)
							if (w === "last") C.reverse()
							else if (w === "prev" || w === "next") {
								w === "prev" && C.reverse()
								const E = C.indexOf(v.currentTarget)
								C = u.loop ? wd(C, E + 1) : C.slice(E + 1)
							}
							setTimeout(() => Ii(C))
						}
					}),
					children: typeof s == "function" ? s({ isCurrentTabStop: f, hasTabStop: h != null }) : s,
				}),
			})
		)
	})
Ni.displayName = _i
var gd = {
	ArrowLeft: "prev",
	ArrowUp: "prev",
	ArrowRight: "next",
	ArrowDown: "next",
	PageUp: "first",
	Home: "first",
	PageDown: "last",
	End: "last",
}
function vd(e, t) {
	return t !== "rtl" ? e : e === "ArrowLeft" ? "ArrowRight" : e === "ArrowRight" ? "ArrowLeft" : e
}
function xd(e, t, r) {
	const n = vd(e.key, r)
	if (
		!(t === "vertical" && ["ArrowLeft", "ArrowRight"].includes(n)) &&
		!(t === "horizontal" && ["ArrowUp", "ArrowDown"].includes(n))
	)
		return gd[n]
}
function Ii(e, t = !1) {
	const r = document.activeElement
	for (const n of e) if (n === r || (n.focus({ preventScroll: t }), document.activeElement !== r)) return
}
function wd(e, t) {
	return e.map((r, n) => e[(t + n) % e.length])
}
var yd = Ai,
	bd = Ni,
	Dr = ["Enter", " "],
	Cd = ["ArrowDown", "PageUp", "Home"],
	Oi = ["ArrowUp", "PageDown", "End"],
	Ed = [...Cd, ...Oi],
	Rd = { ltr: [...Dr, "ArrowRight"], rtl: [...Dr, "ArrowLeft"] },
	Sd = { ltr: ["ArrowLeft"], rtl: ["ArrowRight"] },
	bt = "Menu",
	[dt, Pd, Md] = Qr(bt),
	[je, Ti] = ue(bt, [Md, rt, Mi]),
	ir = rt(),
	Di = Mi(),
	[Ad, Fe] = je(bt),
	[_d, Ct] = je(bt),
	ki = (e) => {
		const { __scopeMenu: t, open: r = !1, children: n, dir: o, onOpenChange: i, modal: s = !0 } = e,
			c = ir(t),
			[d, l] = a.useState(null),
			u = a.useRef(!1),
			f = xe(i),
			m = Jr(o)
		return (
			a.useEffect(() => {
				const g = () => {
						;(u.current = !0),
							document.addEventListener("pointerdown", x, { capture: !0, once: !0 }),
							document.addEventListener("pointermove", x, { capture: !0, once: !0 })
					},
					x = () => (u.current = !1)
				return (
					document.addEventListener("keydown", g, { capture: !0 }),
					() => {
						document.removeEventListener("keydown", g, { capture: !0 }),
							document.removeEventListener("pointerdown", x, { capture: !0 }),
							document.removeEventListener("pointermove", x, { capture: !0 })
					}
				)
			}, []),
			p.jsx(Si, {
				...c,
				children: p.jsx(Ad, {
					scope: t,
					open: r,
					onOpenChange: f,
					content: d,
					onContentChange: l,
					children: p.jsx(_d, {
						scope: t,
						onClose: a.useCallback(() => f(!1), [f]),
						isUsingKeyboardRef: u,
						dir: m,
						modal: s,
						children: n,
					}),
				}),
			})
		)
	}
ki.displayName = bt
var Nd = "MenuAnchor",
	fn = a.forwardRef((e, t) => {
		const { __scopeMenu: r, ...n } = e,
			o = ir(r)
		return p.jsx(or, { ...o, ...n, ref: t })
	})
fn.displayName = Nd
var pn = "MenuPortal",
	[Id, Li] = je(pn, { forceMount: void 0 }),
	ji = (e) => {
		const { __scopeMenu: t, forceMount: r, children: n, container: o } = e,
			i = Fe(pn, t)
		return p.jsx(Id, {
			scope: t,
			forceMount: r,
			children: p.jsx(ae, {
				present: r || i.open,
				children: p.jsx(vt, { asChild: !0, container: o, children: n }),
			}),
		})
	}
ji.displayName = pn
var ie = "MenuContent",
	[Od, mn] = je(ie),
	Fi = a.forwardRef((e, t) => {
		const r = Li(ie, e.__scopeMenu),
			{ forceMount: n = r.forceMount, ...o } = e,
			i = Fe(ie, e.__scopeMenu),
			s = Ct(ie, e.__scopeMenu)
		return p.jsx(dt.Provider, {
			scope: e.__scopeMenu,
			children: p.jsx(ae, {
				present: n || i.open,
				children: p.jsx(dt.Slot, {
					scope: e.__scopeMenu,
					children: s.modal ? p.jsx(Td, { ...o, ref: t }) : p.jsx(Dd, { ...o, ref: t }),
				}),
			}),
		})
	}),
	Td = a.forwardRef((e, t) => {
		const r = Fe(ie, e.__scopeMenu),
			n = a.useRef(null),
			o = q(t, n)
		return (
			a.useEffect(() => {
				const i = n.current
				if (i) return Kr(i)
			}, []),
			p.jsx(hn, {
				...e,
				ref: o,
				trapFocus: r.open,
				disableOutsidePointerEvents: r.open,
				disableOutsideScroll: !0,
				onFocusOutside: L(e.onFocusOutside, (i) => i.preventDefault(), { checkForDefaultPrevented: !1 }),
				onDismiss: () => r.onOpenChange(!1),
			})
		)
	}),
	Dd = a.forwardRef((e, t) => {
		const r = Fe(ie, e.__scopeMenu)
		return p.jsx(hn, {
			...e,
			ref: t,
			trapFocus: !1,
			disableOutsidePointerEvents: !1,
			disableOutsideScroll: !1,
			onDismiss: () => r.onOpenChange(!1),
		})
	}),
	kd = ct("MenuContent.ScrollLock"),
	hn = a.forwardRef((e, t) => {
		const {
				__scopeMenu: r,
				loop: n = !1,
				trapFocus: o,
				onOpenAutoFocus: i,
				onCloseAutoFocus: s,
				disableOutsidePointerEvents: c,
				onEntryFocus: d,
				onEscapeKeyDown: l,
				onPointerDownOutside: u,
				onFocusOutside: f,
				onInteractOutside: m,
				onDismiss: g,
				disableOutsideScroll: x,
				...h
			} = e,
			v = Fe(ie, r),
			w = Ct(ie, r),
			b = ir(r),
			C = Di(r),
			E = Pd(r),
			[R, M] = a.useState(null),
			S = a.useRef(null),
			_ = q(t, S, v.onContentChange),
			$ = a.useRef(0),
			T = a.useRef(""),
			k = a.useRef(0),
			z = a.useRef(null),
			K = a.useRef("right"),
			P = a.useRef(0),
			O = x ? Xt : a.Fragment,
			j = x ? { as: kd, allowPinchZoom: !0 } : void 0,
			U = (I) => {
				var V, G
				const W = T.current + I,
					Z = E().filter((Y) => !Y.disabled),
					y = document.activeElement,
					A = (V = Z.find((Y) => Y.ref.current === y)) == null ? void 0 : V.textValue,
					D = Z.map((Y) => Y.textValue),
					N = Gd(D, W, A),
					B = (G = Z.find((Y) => Y.textValue === N)) == null ? void 0 : G.ref.current
				;(function Y(oe) {
					;(T.current = oe),
						window.clearTimeout($.current),
						oe !== "" && ($.current = window.setTimeout(() => Y(""), 1e3))
				})(W),
					B && setTimeout(() => B.focus())
			}
		a.useEffect(() => () => window.clearTimeout($.current), []), zr()
		const F = a.useCallback((I) => {
			var Z, y
			return (
				K.current === ((Z = z.current) == null ? void 0 : Z.side) &&
				Zd(I, (y = z.current) == null ? void 0 : y.area)
			)
		}, [])
		return p.jsx(Od, {
			scope: r,
			searchRef: T,
			onItemEnter: a.useCallback(
				(I) => {
					F(I) && I.preventDefault()
				},
				[F],
			),
			onItemLeave: a.useCallback(
				(I) => {
					var W
					F(I) || ((W = S.current) == null || W.focus(), M(null))
				},
				[F],
			),
			onTriggerLeave: a.useCallback(
				(I) => {
					F(I) && I.preventDefault()
				},
				[F],
			),
			pointerGraceTimerRef: k,
			onPointerGraceIntentChange: a.useCallback((I) => {
				z.current = I
			}, []),
			children: p.jsx(O, {
				...j,
				children: p.jsx(Zt, {
					asChild: !0,
					trapped: o,
					onMountAutoFocus: L(i, (I) => {
						var W
						I.preventDefault(), (W = S.current) == null || W.focus({ preventScroll: !0 })
					}),
					onUnmountAutoFocus: s,
					children: p.jsx(gt, {
						asChild: !0,
						disableOutsidePointerEvents: c,
						onEscapeKeyDown: l,
						onPointerDownOutside: u,
						onFocusOutside: f,
						onInteractOutside: m,
						onDismiss: g,
						children: p.jsx(yd, {
							asChild: !0,
							...C,
							dir: w.dir,
							orientation: "vertical",
							loop: n,
							currentTabStopId: R,
							onCurrentTabStopIdChange: M,
							onEntryFocus: L(d, (I) => {
								w.isUsingKeyboardRef.current || I.preventDefault()
							}),
							preventScrollOnEntryFocus: !0,
							children: p.jsx(un, {
								role: "menu",
								"aria-orientation": "vertical",
								"data-state": ea(v.open),
								"data-radix-menu-content": "",
								dir: w.dir,
								...b,
								...h,
								ref: _,
								style: { outline: "none", ...h.style },
								onKeyDown: L(h.onKeyDown, (I) => {
									const Z = I.target.closest("[data-radix-menu-content]") === I.currentTarget,
										y = I.ctrlKey || I.altKey || I.metaKey,
										A = I.key.length === 1
									Z && (I.key === "Tab" && I.preventDefault(), !y && A && U(I.key))
									const D = S.current
									if (I.target !== D || !Ed.includes(I.key)) return
									I.preventDefault()
									const B = E()
										.filter((V) => !V.disabled)
										.map((V) => V.ref.current)
									Oi.includes(I.key) && B.reverse(), Ud(B)
								}),
								onBlur: L(e.onBlur, (I) => {
									I.currentTarget.contains(I.target) ||
										(window.clearTimeout($.current), (T.current = ""))
								}),
								onPointerMove: L(
									e.onPointerMove,
									ft((I) => {
										const W = I.target,
											Z = P.current !== I.clientX
										if (I.currentTarget.contains(W) && Z) {
											const y = I.clientX > P.current ? "right" : "left"
											;(K.current = y), (P.current = I.clientX)
										}
									}),
								),
							}),
						}),
					}),
				}),
			}),
		})
	})
Fi.displayName = ie
var Ld = "MenuGroup",
	gn = a.forwardRef((e, t) => {
		const { __scopeMenu: r, ...n } = e
		return p.jsx(H.div, { role: "group", ...n, ref: t })
	})
gn.displayName = Ld
var jd = "MenuLabel",
	$i = a.forwardRef((e, t) => {
		const { __scopeMenu: r, ...n } = e
		return p.jsx(H.div, { ...n, ref: t })
	})
$i.displayName = jd
var Kt = "MenuItem",
	Qn = "menu.itemSelect",
	ar = a.forwardRef((e, t) => {
		const { disabled: r = !1, onSelect: n, ...o } = e,
			i = a.useRef(null),
			s = Ct(Kt, e.__scopeMenu),
			c = mn(Kt, e.__scopeMenu),
			d = q(t, i),
			l = a.useRef(!1),
			u = () => {
				const f = i.current
				if (!r && f) {
					const m = new CustomEvent(Qn, { bubbles: !0, cancelable: !0 })
					f.addEventListener(Qn, (g) => (n == null ? void 0 : n(g)), { once: !0 }),
						so(f, m),
						m.defaultPrevented ? (l.current = !1) : s.onClose()
				}
			}
		return p.jsx(Bi, {
			...o,
			ref: d,
			disabled: r,
			onClick: L(e.onClick, u),
			onPointerDown: (f) => {
				var m
				;(m = e.onPointerDown) == null || m.call(e, f), (l.current = !0)
			},
			onPointerUp: L(e.onPointerUp, (f) => {
				var m
				l.current || (m = f.currentTarget) == null || m.click()
			}),
			onKeyDown: L(e.onKeyDown, (f) => {
				const m = c.searchRef.current !== ""
				r || (m && f.key === " ") || (Dr.includes(f.key) && (f.currentTarget.click(), f.preventDefault()))
			}),
		})
	})
ar.displayName = Kt
var Bi = a.forwardRef((e, t) => {
		const { __scopeMenu: r, disabled: n = !1, textValue: o, ...i } = e,
			s = mn(Kt, r),
			c = Di(r),
			d = a.useRef(null),
			l = q(t, d),
			[u, f] = a.useState(!1),
			[m, g] = a.useState("")
		return (
			a.useEffect(() => {
				const x = d.current
				x && g((x.textContent ?? "").trim())
			}, [i.children]),
			p.jsx(dt.ItemSlot, {
				scope: r,
				disabled: n,
				textValue: o ?? m,
				children: p.jsx(bd, {
					asChild: !0,
					...c,
					focusable: !n,
					children: p.jsx(H.div, {
						role: "menuitem",
						"data-highlighted": u ? "" : void 0,
						"aria-disabled": n || void 0,
						"data-disabled": n ? "" : void 0,
						...i,
						ref: l,
						onPointerMove: L(
							e.onPointerMove,
							ft((x) => {
								n
									? s.onItemLeave(x)
									: (s.onItemEnter(x),
										x.defaultPrevented || x.currentTarget.focus({ preventScroll: !0 }))
							}),
						),
						onPointerLeave: L(
							e.onPointerLeave,
							ft((x) => s.onItemLeave(x)),
						),
						onFocus: L(e.onFocus, () => f(!0)),
						onBlur: L(e.onBlur, () => f(!1)),
					}),
				}),
			})
		)
	}),
	Fd = "MenuCheckboxItem",
	Hi = a.forwardRef((e, t) => {
		const { checked: r = !1, onCheckedChange: n, ...o } = e
		return p.jsx(Wi, {
			scope: e.__scopeMenu,
			checked: r,
			children: p.jsx(ar, {
				role: "menuitemcheckbox",
				"aria-checked": Ut(r) ? "mixed" : r,
				...o,
				ref: t,
				"data-state": xn(r),
				onSelect: L(o.onSelect, () => (n == null ? void 0 : n(Ut(r) ? !0 : !r)), {
					checkForDefaultPrevented: !1,
				}),
			}),
		})
	})
Hi.displayName = Fd
var Vi = "MenuRadioGroup",
	[$d, Bd] = je(Vi, { value: void 0, onValueChange: () => {} }),
	zi = a.forwardRef((e, t) => {
		const { value: r, onValueChange: n, ...o } = e,
			i = xe(n)
		return p.jsx($d, { scope: e.__scopeMenu, value: r, onValueChange: i, children: p.jsx(gn, { ...o, ref: t }) })
	})
zi.displayName = Vi
var Ki = "MenuRadioItem",
	Ui = a.forwardRef((e, t) => {
		const { value: r, ...n } = e,
			o = Bd(Ki, e.__scopeMenu),
			i = r === o.value
		return p.jsx(Wi, {
			scope: e.__scopeMenu,
			checked: i,
			children: p.jsx(ar, {
				role: "menuitemradio",
				"aria-checked": i,
				...n,
				ref: t,
				"data-state": xn(i),
				onSelect: L(
					n.onSelect,
					() => {
						var s
						return (s = o.onValueChange) == null ? void 0 : s.call(o, r)
					},
					{ checkForDefaultPrevented: !1 },
				),
			}),
		})
	})
Ui.displayName = Ki
var vn = "MenuItemIndicator",
	[Wi, Hd] = je(vn, { checked: !1 }),
	Gi = a.forwardRef((e, t) => {
		const { __scopeMenu: r, forceMount: n, ...o } = e,
			i = Hd(vn, r)
		return p.jsx(ae, {
			present: n || Ut(i.checked) || i.checked === !0,
			children: p.jsx(H.span, { ...o, ref: t, "data-state": xn(i.checked) }),
		})
	})
Gi.displayName = vn
var Vd = "MenuSeparator",
	Yi = a.forwardRef((e, t) => {
		const { __scopeMenu: r, ...n } = e
		return p.jsx(H.div, { role: "separator", "aria-orientation": "horizontal", ...n, ref: t })
	})
Yi.displayName = Vd
var zd = "MenuArrow",
	Zi = a.forwardRef((e, t) => {
		const { __scopeMenu: r, ...n } = e,
			o = ir(r)
		return p.jsx(dn, { ...o, ...n, ref: t })
	})
Zi.displayName = zd
var Kd = "MenuSub",
	[Xm, qi] = je(Kd),
	st = "MenuSubTrigger",
	Xi = a.forwardRef((e, t) => {
		const r = Fe(st, e.__scopeMenu),
			n = Ct(st, e.__scopeMenu),
			o = qi(st, e.__scopeMenu),
			i = mn(st, e.__scopeMenu),
			s = a.useRef(null),
			{ pointerGraceTimerRef: c, onPointerGraceIntentChange: d } = i,
			l = { __scopeMenu: e.__scopeMenu },
			u = a.useCallback(() => {
				s.current && window.clearTimeout(s.current), (s.current = null)
			}, [])
		return (
			a.useEffect(() => u, [u]),
			a.useEffect(() => {
				const f = c.current
				return () => {
					window.clearTimeout(f), d(null)
				}
			}, [c, d]),
			p.jsx(fn, {
				asChild: !0,
				...l,
				children: p.jsx(Bi, {
					id: o.triggerId,
					"aria-haspopup": "menu",
					"aria-expanded": r.open,
					"aria-controls": o.contentId,
					"data-state": ea(r.open),
					...e,
					ref: Oe(t, o.onTriggerChange),
					onClick: (f) => {
						var m
						;(m = e.onClick) == null || m.call(e, f),
							!(e.disabled || f.defaultPrevented) &&
								(f.currentTarget.focus(), r.open || r.onOpenChange(!0))
					},
					onPointerMove: L(
						e.onPointerMove,
						ft((f) => {
							i.onItemEnter(f),
								!f.defaultPrevented &&
									!e.disabled &&
									!r.open &&
									!s.current &&
									(i.onPointerGraceIntentChange(null),
									(s.current = window.setTimeout(() => {
										r.onOpenChange(!0), u()
									}, 100)))
						}),
					),
					onPointerLeave: L(
						e.onPointerLeave,
						ft((f) => {
							var g, x
							u()
							const m = (g = r.content) == null ? void 0 : g.getBoundingClientRect()
							if (m) {
								const h = (x = r.content) == null ? void 0 : x.dataset.side,
									v = h === "right",
									w = v ? -5 : 5,
									b = m[v ? "left" : "right"],
									C = m[v ? "right" : "left"]
								i.onPointerGraceIntentChange({
									area: [
										{ x: f.clientX + w, y: f.clientY },
										{ x: b, y: m.top },
										{ x: C, y: m.top },
										{ x: C, y: m.bottom },
										{ x: b, y: m.bottom },
									],
									side: h,
								}),
									window.clearTimeout(c.current),
									(c.current = window.setTimeout(() => i.onPointerGraceIntentChange(null), 300))
							} else {
								if ((i.onTriggerLeave(f), f.defaultPrevented)) return
								i.onPointerGraceIntentChange(null)
							}
						}),
					),
					onKeyDown: L(e.onKeyDown, (f) => {
						var g
						const m = i.searchRef.current !== ""
						e.disabled ||
							(m && f.key === " ") ||
							(Rd[n.dir].includes(f.key) &&
								(r.onOpenChange(!0), (g = r.content) == null || g.focus(), f.preventDefault()))
					}),
				}),
			})
		)
	})
Xi.displayName = st
var Qi = "MenuSubContent",
	Ji = a.forwardRef((e, t) => {
		const r = Li(ie, e.__scopeMenu),
			{ forceMount: n = r.forceMount, ...o } = e,
			i = Fe(ie, e.__scopeMenu),
			s = Ct(ie, e.__scopeMenu),
			c = qi(Qi, e.__scopeMenu),
			d = a.useRef(null),
			l = q(t, d)
		return p.jsx(dt.Provider, {
			scope: e.__scopeMenu,
			children: p.jsx(ae, {
				present: n || i.open,
				children: p.jsx(dt.Slot, {
					scope: e.__scopeMenu,
					children: p.jsx(hn, {
						id: c.contentId,
						"aria-labelledby": c.triggerId,
						...o,
						ref: l,
						align: "start",
						side: s.dir === "rtl" ? "left" : "right",
						disableOutsidePointerEvents: !1,
						disableOutsideScroll: !1,
						trapFocus: !1,
						onOpenAutoFocus: (u) => {
							var f
							s.isUsingKeyboardRef.current && ((f = d.current) == null || f.focus()), u.preventDefault()
						},
						onCloseAutoFocus: (u) => u.preventDefault(),
						onFocusOutside: L(e.onFocusOutside, (u) => {
							u.target !== c.trigger && i.onOpenChange(!1)
						}),
						onEscapeKeyDown: L(e.onEscapeKeyDown, (u) => {
							s.onClose(), u.preventDefault()
						}),
						onKeyDown: L(e.onKeyDown, (u) => {
							var g
							const f = u.currentTarget.contains(u.target),
								m = Sd[s.dir].includes(u.key)
							f && m && (i.onOpenChange(!1), (g = c.trigger) == null || g.focus(), u.preventDefault())
						}),
					}),
				}),
			}),
		})
	})
Ji.displayName = Qi
function ea(e) {
	return e ? "open" : "closed"
}
function Ut(e) {
	return e === "indeterminate"
}
function xn(e) {
	return Ut(e) ? "indeterminate" : e ? "checked" : "unchecked"
}
function Ud(e) {
	const t = document.activeElement
	for (const r of e) if (r === t || (r.focus(), document.activeElement !== t)) return
}
function Wd(e, t) {
	return e.map((r, n) => e[(t + n) % e.length])
}
function Gd(e, t, r) {
	const o = t.length > 1 && Array.from(t).every((l) => l === t[0]) ? t[0] : t,
		i = r ? e.indexOf(r) : -1
	let s = Wd(e, Math.max(i, 0))
	o.length === 1 && (s = s.filter((l) => l !== r))
	const d = s.find((l) => l.toLowerCase().startsWith(o.toLowerCase()))
	return d !== r ? d : void 0
}
function Yd(e, t) {
	const { x: r, y: n } = e
	let o = !1
	for (let i = 0, s = t.length - 1; i < t.length; s = i++) {
		const c = t[i],
			d = t[s],
			l = c.x,
			u = c.y,
			f = d.x,
			m = d.y
		u > n != m > n && r < ((f - l) * (n - u)) / (m - u) + l && (o = !o)
	}
	return o
}
function Zd(e, t) {
	if (!t) return !1
	const r = { x: e.clientX, y: e.clientY }
	return Yd(r, t)
}
function ft(e) {
	return (t) => (t.pointerType === "mouse" ? e(t) : void 0)
}
var qd = ki,
	Xd = fn,
	Qd = ji,
	Jd = Fi,
	ef = gn,
	tf = $i,
	rf = ar,
	nf = Hi,
	of = zi,
	af = Ui,
	sf = Gi,
	cf = Yi,
	lf = Zi,
	uf = Xi,
	df = Ji,
	sr = "DropdownMenu",
	[ff, Qm] = ue(sr, [Ti]),
	J = Ti(),
	[pf, ta] = ff(sr),
	ra = (e) => {
		const {
				__scopeDropdownMenu: t,
				children: r,
				dir: n,
				open: o,
				defaultOpen: i,
				onOpenChange: s,
				modal: c = !0,
			} = e,
			d = J(t),
			l = a.useRef(null),
			[u, f] = Je({ prop: o, defaultProp: i ?? !1, onChange: s, caller: sr })
		return p.jsx(pf, {
			scope: t,
			triggerId: re(),
			triggerRef: l,
			contentId: re(),
			open: u,
			onOpenChange: f,
			onOpenToggle: a.useCallback(() => f((m) => !m), [f]),
			modal: c,
			children: p.jsx(qd, { ...d, open: u, onOpenChange: f, dir: n, modal: c, children: r }),
		})
	}
ra.displayName = sr
var na = "DropdownMenuTrigger",
	oa = a.forwardRef((e, t) => {
		const { __scopeDropdownMenu: r, disabled: n = !1, ...o } = e,
			i = ta(na, r),
			s = J(r)
		return p.jsx(Xd, {
			asChild: !0,
			...s,
			children: p.jsx(H.button, {
				type: "button",
				id: i.triggerId,
				"aria-haspopup": "menu",
				"aria-expanded": i.open,
				"aria-controls": i.open ? i.contentId : void 0,
				"data-state": i.open ? "open" : "closed",
				"data-disabled": n ? "" : void 0,
				disabled: n,
				...o,
				ref: Oe(t, i.triggerRef),
				onPointerDown: L(e.onPointerDown, (c) => {
					!n && c.button === 0 && c.ctrlKey === !1 && (i.onOpenToggle(), i.open || c.preventDefault())
				}),
				onKeyDown: L(e.onKeyDown, (c) => {
					n ||
						(["Enter", " "].includes(c.key) && i.onOpenToggle(),
						c.key === "ArrowDown" && i.onOpenChange(!0),
						["Enter", " ", "ArrowDown"].includes(c.key) && c.preventDefault())
				}),
			}),
		})
	})
oa.displayName = na
var mf = "DropdownMenuPortal",
	ia = (e) => {
		const { __scopeDropdownMenu: t, ...r } = e,
			n = J(t)
		return p.jsx(Qd, { ...n, ...r })
	}
ia.displayName = mf
var aa = "DropdownMenuContent",
	sa = a.forwardRef((e, t) => {
		const { __scopeDropdownMenu: r, ...n } = e,
			o = ta(aa, r),
			i = J(r),
			s = a.useRef(!1)
		return p.jsx(Jd, {
			id: o.contentId,
			"aria-labelledby": o.triggerId,
			...i,
			...n,
			ref: t,
			onCloseAutoFocus: L(e.onCloseAutoFocus, (c) => {
				var d
				s.current || (d = o.triggerRef.current) == null || d.focus(), (s.current = !1), c.preventDefault()
			}),
			onInteractOutside: L(e.onInteractOutside, (c) => {
				const d = c.detail.originalEvent,
					l = d.button === 0 && d.ctrlKey === !0,
					u = d.button === 2 || l
				;(!o.modal || u) && (s.current = !0)
			}),
			style: {
				...e.style,
				"--radix-dropdown-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
				"--radix-dropdown-menu-content-available-width": "var(--radix-popper-available-width)",
				"--radix-dropdown-menu-content-available-height": "var(--radix-popper-available-height)",
				"--radix-dropdown-menu-trigger-width": "var(--radix-popper-anchor-width)",
				"--radix-dropdown-menu-trigger-height": "var(--radix-popper-anchor-height)",
			},
		})
	})
sa.displayName = aa
var hf = "DropdownMenuGroup",
	ca = a.forwardRef((e, t) => {
		const { __scopeDropdownMenu: r, ...n } = e,
			o = J(r)
		return p.jsx(ef, { ...o, ...n, ref: t })
	})
ca.displayName = hf
var gf = "DropdownMenuLabel",
	la = a.forwardRef((e, t) => {
		const { __scopeDropdownMenu: r, ...n } = e,
			o = J(r)
		return p.jsx(tf, { ...o, ...n, ref: t })
	})
la.displayName = gf
var vf = "DropdownMenuItem",
	ua = a.forwardRef((e, t) => {
		const { __scopeDropdownMenu: r, ...n } = e,
			o = J(r)
		return p.jsx(rf, { ...o, ...n, ref: t })
	})
ua.displayName = vf
var xf = "DropdownMenuCheckboxItem",
	da = a.forwardRef((e, t) => {
		const { __scopeDropdownMenu: r, ...n } = e,
			o = J(r)
		return p.jsx(nf, { ...o, ...n, ref: t })
	})
da.displayName = xf
var wf = "DropdownMenuRadioGroup",
	yf = a.forwardRef((e, t) => {
		const { __scopeDropdownMenu: r, ...n } = e,
			o = J(r)
		return p.jsx(of, { ...o, ...n, ref: t })
	})
yf.displayName = wf
var bf = "DropdownMenuRadioItem",
	fa = a.forwardRef((e, t) => {
		const { __scopeDropdownMenu: r, ...n } = e,
			o = J(r)
		return p.jsx(af, { ...o, ...n, ref: t })
	})
fa.displayName = bf
var Cf = "DropdownMenuItemIndicator",
	pa = a.forwardRef((e, t) => {
		const { __scopeDropdownMenu: r, ...n } = e,
			o = J(r)
		return p.jsx(sf, { ...o, ...n, ref: t })
	})
pa.displayName = Cf
var Ef = "DropdownMenuSeparator",
	ma = a.forwardRef((e, t) => {
		const { __scopeDropdownMenu: r, ...n } = e,
			o = J(r)
		return p.jsx(cf, { ...o, ...n, ref: t })
	})
ma.displayName = Ef
var Rf = "DropdownMenuArrow",
	Sf = a.forwardRef((e, t) => {
		const { __scopeDropdownMenu: r, ...n } = e,
			o = J(r)
		return p.jsx(lf, { ...o, ...n, ref: t })
	})
Sf.displayName = Rf
var Pf = "DropdownMenuSubTrigger",
	Mf = a.forwardRef((e, t) => {
		const { __scopeDropdownMenu: r, ...n } = e,
			o = J(r)
		return p.jsx(uf, { ...o, ...n, ref: t })
	})
Mf.displayName = Pf
var Af = "DropdownMenuSubContent",
	_f = a.forwardRef((e, t) => {
		const { __scopeDropdownMenu: r, ...n } = e,
			o = J(r)
		return p.jsx(df, {
			...o,
			...n,
			ref: t,
			style: {
				...e.style,
				"--radix-dropdown-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
				"--radix-dropdown-menu-content-available-width": "var(--radix-popper-available-width)",
				"--radix-dropdown-menu-content-available-height": "var(--radix-popper-available-height)",
				"--radix-dropdown-menu-trigger-width": "var(--radix-popper-anchor-width)",
				"--radix-dropdown-menu-trigger-height": "var(--radix-popper-anchor-height)",
			},
		})
	})
_f.displayName = Af
var Nf = ra,
	If = oa,
	Of = ia,
	ha = sa,
	Tf = ca,
	ga = la,
	va = ua,
	xa = da,
	wa = fa,
	ya = pa,
	ba = ma
const Jm = Nf,
	eh = If,
	th = Tf,
	Ca = a.forwardRef(({ className: e, sideOffset: t = 4, container: r, ...n }, o) =>
		p.jsx(Of, {
			container: r,
			children: p.jsx(ha, {
				ref: o,
				sideOffset: t,
				className: X(
					"z-50 min-w-[8rem] overflow-hidden rounded-lg p-1 shadow-xs",
					"data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
					"border border-vscode-focusBorder",
					"bg-vscode-dropdown-background bg-opacity-100",
					"text-vscode-dropdown-foreground",
					e,
				),
				...n,
			}),
		}),
	)
Ca.displayName = ha.displayName
const Ea = a.forwardRef(({ className: e, inset: t, ...r }, n) =>
	p.jsx(va, {
		ref: n,
		className: X(
			"relative flex select-none items-center gap-2 px-2 py-1.5 outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
			"focus:bg-vscode-list-activeSelectionBackground focus:text-vscode-list-activeSelectionForeground",
			"text-vscode-dropdown-foreground text-sm",
			"rounded-lg active:opacity-90 cursor-pointer",
			t && "pl-8",
			e,
		),
		...r,
	}),
)
Ea.displayName = va.displayName
const Ra = a.forwardRef(({ className: e, children: t, checked: r, ...n }, o) =>
	p.jsxs(xa, {
		ref: o,
		className: X(
			"relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
			"focus:bg-vscode-list-activeSelectionBackground focus:text-vscode-list-activeSelectionForeground",
			e,
		),
		checked: r,
		...n,
		children: [
			p.jsx("span", {
				className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
				children: p.jsx(ya, { children: p.jsx(Wl, { className: "h-4 w-4" }) }),
			}),
			t,
		],
	}),
)
Ra.displayName = xa.displayName
const Sa = a.forwardRef(({ className: e, children: t, ...r }, n) =>
	p.jsxs(wa, {
		ref: n,
		className: X(
			"relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-vscode-list-activeSelectionBackground focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
			e,
		),
		...r,
		children: [
			p.jsx("span", {
				className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
				children: p.jsx(ya, { children: p.jsx(Zl, { className: "h-2 w-2 fill-current" }) }),
			}),
			t,
		],
	}),
)
Sa.displayName = wa.displayName
const Pa = a.forwardRef(({ className: e, inset: t, ...r }, n) =>
	p.jsx(ga, { ref: n, className: X("px-2 py-1.5 text-sm font-semibold", t && "pl-8", e), ...r }),
)
Pa.displayName = ga.displayName
const Ma = a.forwardRef(({ className: e, ...t }, r) =>
	p.jsx(ba, { ref: r, className: X("-mx-1 my-1 h-px bg-vscode-dropdown-foreground/10", e), ...t }),
)
Ma.displayName = ba.displayName
const Aa = ({ className: e, ...t }) =>
	p.jsx("span", { className: X("ml-auto text-xs tracking-widest opacity-60", e), ...t })
Aa.displayName = "DropdownMenuShortcut"
Ca.__docgenInfo = {
	description: "",
	methods: [],
	props: { sideOffset: { defaultValue: { value: "4", computed: !1 }, required: !1 } },
}
Ea.__docgenInfo = {
	description: "",
	methods: [],
	props: { inset: { required: !1, tsType: { name: "boolean" }, description: "" } },
}
Ra.__docgenInfo = { description: "", methods: [] }
Sa.__docgenInfo = { description: "", methods: [] }
Pa.__docgenInfo = {
	description: "",
	methods: [],
	props: { inset: { required: !1, tsType: { name: "boolean" }, description: "" } },
}
Ma.__docgenInfo = { description: "", methods: [] }
Aa.__docgenInfo = { description: "", methods: [], displayName: "DropdownMenuShortcut" }
const _a = a.forwardRef(({ className: e, type: t, ...r }, n) =>
	p.jsx("input", {
		type: t,
		className: X(
			"flex w-full text-vscode-input-foreground border border-vscode-dropdown-border  bg-vscode-input-background rounded-lg px-3 py-1 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus:outline-0 focus-visible:outline-none focus-visible:border-vscode-focusBorder disabled:cursor-not-allowed disabled:opacity-50",
			e,
		),
		ref: n,
		...r,
	}),
)
_a.displayName = "Input"
_a.__docgenInfo = { description: "", methods: [], displayName: "Input" }
var cr = "Popover",
	[Na, rh] = ue(cr, [rt]),
	Et = rt(),
	[Df, Ae] = Na(cr),
	Ia = (e) => {
		const { __scopePopover: t, children: r, open: n, defaultOpen: o, onOpenChange: i, modal: s = !1 } = e,
			c = Et(t),
			d = a.useRef(null),
			[l, u] = a.useState(!1),
			[f, m] = Je({ prop: n, defaultProp: o ?? !1, onChange: i, caller: cr })
		return p.jsx(Si, {
			...c,
			children: p.jsx(Df, {
				scope: t,
				contentId: re(),
				triggerRef: d,
				open: f,
				onOpenChange: m,
				onOpenToggle: a.useCallback(() => m((g) => !g), [m]),
				hasCustomAnchor: l,
				onCustomAnchorAdd: a.useCallback(() => u(!0), []),
				onCustomAnchorRemove: a.useCallback(() => u(!1), []),
				modal: s,
				children: r,
			}),
		})
	}
Ia.displayName = cr
var Oa = "PopoverAnchor",
	kf = a.forwardRef((e, t) => {
		const { __scopePopover: r, ...n } = e,
			o = Ae(Oa, r),
			i = Et(r),
			{ onCustomAnchorAdd: s, onCustomAnchorRemove: c } = o
		return a.useEffect(() => (s(), () => c()), [s, c]), p.jsx(or, { ...i, ...n, ref: t })
	})
kf.displayName = Oa
var Ta = "PopoverTrigger",
	Da = a.forwardRef((e, t) => {
		const { __scopePopover: r, ...n } = e,
			o = Ae(Ta, r),
			i = Et(r),
			s = q(t, o.triggerRef),
			c = p.jsx(H.button, {
				type: "button",
				"aria-haspopup": "dialog",
				"aria-expanded": o.open,
				"aria-controls": o.contentId,
				"data-state": $a(o.open),
				...n,
				ref: s,
				onClick: L(e.onClick, o.onOpenToggle),
			})
		return o.hasCustomAnchor ? c : p.jsx(or, { asChild: !0, ...i, children: c })
	})
Da.displayName = Ta
var wn = "PopoverPortal",
	[Lf, jf] = Na(wn, { forceMount: void 0 }),
	ka = (e) => {
		const { __scopePopover: t, forceMount: r, children: n, container: o } = e,
			i = Ae(wn, t)
		return p.jsx(Lf, {
			scope: t,
			forceMount: r,
			children: p.jsx(ae, {
				present: r || i.open,
				children: p.jsx(vt, { asChild: !0, container: o, children: n }),
			}),
		})
	}
ka.displayName = wn
var qe = "PopoverContent",
	La = a.forwardRef((e, t) => {
		const r = jf(qe, e.__scopePopover),
			{ forceMount: n = r.forceMount, ...o } = e,
			i = Ae(qe, e.__scopePopover)
		return p.jsx(ae, {
			present: n || i.open,
			children: i.modal ? p.jsx($f, { ...o, ref: t }) : p.jsx(Bf, { ...o, ref: t }),
		})
	})
La.displayName = qe
var Ff = ct("PopoverContent.RemoveScroll"),
	$f = a.forwardRef((e, t) => {
		const r = Ae(qe, e.__scopePopover),
			n = a.useRef(null),
			o = q(t, n),
			i = a.useRef(!1)
		return (
			a.useEffect(() => {
				const s = n.current
				if (s) return Kr(s)
			}, []),
			p.jsx(Xt, {
				as: Ff,
				allowPinchZoom: !0,
				children: p.jsx(ja, {
					...e,
					ref: o,
					trapFocus: r.open,
					disableOutsidePointerEvents: !0,
					onCloseAutoFocus: L(e.onCloseAutoFocus, (s) => {
						var c
						s.preventDefault(), i.current || (c = r.triggerRef.current) == null || c.focus()
					}),
					onPointerDownOutside: L(
						e.onPointerDownOutside,
						(s) => {
							const c = s.detail.originalEvent,
								d = c.button === 0 && c.ctrlKey === !0,
								l = c.button === 2 || d
							i.current = l
						},
						{ checkForDefaultPrevented: !1 },
					),
					onFocusOutside: L(e.onFocusOutside, (s) => s.preventDefault(), { checkForDefaultPrevented: !1 }),
				}),
			})
		)
	}),
	Bf = a.forwardRef((e, t) => {
		const r = Ae(qe, e.__scopePopover),
			n = a.useRef(!1),
			o = a.useRef(!1)
		return p.jsx(ja, {
			...e,
			ref: t,
			trapFocus: !1,
			disableOutsidePointerEvents: !1,
			onCloseAutoFocus: (i) => {
				var s, c
				;(s = e.onCloseAutoFocus) == null || s.call(e, i),
					i.defaultPrevented ||
						(n.current || (c = r.triggerRef.current) == null || c.focus(), i.preventDefault()),
					(n.current = !1),
					(o.current = !1)
			},
			onInteractOutside: (i) => {
				var d, l
				;(d = e.onInteractOutside) == null || d.call(e, i),
					i.defaultPrevented ||
						((n.current = !0), i.detail.originalEvent.type === "pointerdown" && (o.current = !0))
				const s = i.target
				;((l = r.triggerRef.current) == null ? void 0 : l.contains(s)) && i.preventDefault(),
					i.detail.originalEvent.type === "focusin" && o.current && i.preventDefault()
			},
		})
	}),
	ja = a.forwardRef((e, t) => {
		const {
				__scopePopover: r,
				trapFocus: n,
				onOpenAutoFocus: o,
				onCloseAutoFocus: i,
				disableOutsidePointerEvents: s,
				onEscapeKeyDown: c,
				onPointerDownOutside: d,
				onFocusOutside: l,
				onInteractOutside: u,
				...f
			} = e,
			m = Ae(qe, r),
			g = Et(r)
		return (
			zr(),
			p.jsx(Zt, {
				asChild: !0,
				loop: !0,
				trapped: n,
				onMountAutoFocus: o,
				onUnmountAutoFocus: i,
				children: p.jsx(gt, {
					asChild: !0,
					disableOutsidePointerEvents: s,
					onInteractOutside: u,
					onEscapeKeyDown: c,
					onPointerDownOutside: d,
					onFocusOutside: l,
					onDismiss: () => m.onOpenChange(!1),
					children: p.jsx(un, {
						"data-state": $a(m.open),
						role: "dialog",
						id: m.contentId,
						...g,
						...f,
						ref: t,
						style: {
							...f.style,
							"--radix-popover-content-transform-origin": "var(--radix-popper-transform-origin)",
							"--radix-popover-content-available-width": "var(--radix-popper-available-width)",
							"--radix-popover-content-available-height": "var(--radix-popper-available-height)",
							"--radix-popover-trigger-width": "var(--radix-popper-anchor-width)",
							"--radix-popover-trigger-height": "var(--radix-popper-anchor-height)",
						},
					}),
				}),
			})
		)
	}),
	Fa = "PopoverClose",
	Hf = a.forwardRef((e, t) => {
		const { __scopePopover: r, ...n } = e,
			o = Ae(Fa, r)
		return p.jsx(H.button, { type: "button", ...n, ref: t, onClick: L(e.onClick, () => o.onOpenChange(!1)) })
	})
Hf.displayName = Fa
var Vf = "PopoverArrow",
	zf = a.forwardRef((e, t) => {
		const { __scopePopover: r, ...n } = e,
			o = Et(r)
		return p.jsx(dn, { ...o, ...n, ref: t })
	})
zf.displayName = Vf
function $a(e) {
	return e ? "open" : "closed"
}
var Kf = Ia,
	Uf = Da,
	Wf = ka,
	Ba = La
const Gf = Kf,
	Yf = Uf,
	yn = a.forwardRef(({ className: e, align: t = "center", sideOffset: r = 4, container: n, ...o }, i) =>
		p.jsx(Wf, {
			container: n,
			children: p.jsx(Ba, {
				ref: i,
				align: t,
				sideOffset: r,
				className: X(
					"z-50 w-72 rounded-lg p-4 shadow-xs outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
					"bg-popover",
					"border border-vscode-focusBorder",
					"text-popover-foreground",
					e,
				),
				...o,
			}),
		}),
	)
yn.displayName = Ba.displayName
yn.__docgenInfo = {
	description: "",
	methods: [],
	props: {
		align: { defaultValue: { value: '"center"', computed: !1 }, required: !1 },
		sideOffset: { defaultValue: { value: "4", computed: !1 }, required: !1 },
	},
}
var bn = "Progress",
	Cn = 100,
	[Zf, nh] = ue(bn),
	[qf, Xf] = Zf(bn),
	Ha = a.forwardRef((e, t) => {
		const { __scopeProgress: r, value: n = null, max: o, getValueLabel: i = Qf, ...s } = e
		;(o || o === 0) && !Jn(o) && console.error(Jf(`${o}`, "Progress"))
		const c = Jn(o) ? o : Cn
		n !== null && !eo(n, c) && console.error(ep(`${n}`, "Progress"))
		const d = eo(n, c) ? n : null,
			l = Wt(d) ? i(d, c) : void 0
		return p.jsx(qf, {
			scope: r,
			value: d,
			max: c,
			children: p.jsx(H.div, {
				"aria-valuemax": c,
				"aria-valuemin": 0,
				"aria-valuenow": Wt(d) ? d : void 0,
				"aria-valuetext": l,
				role: "progressbar",
				"data-state": Ka(d, c),
				"data-value": d ?? void 0,
				"data-max": c,
				...s,
				ref: t,
			}),
		})
	})
Ha.displayName = bn
var Va = "ProgressIndicator",
	za = a.forwardRef((e, t) => {
		const { __scopeProgress: r, ...n } = e,
			o = Xf(Va, r)
		return p.jsx(H.div, {
			"data-state": Ka(o.value, o.max),
			"data-value": o.value ?? void 0,
			"data-max": o.max,
			...n,
			ref: t,
		})
	})
za.displayName = Va
function Qf(e, t) {
	return `${Math.round((e / t) * 100)}%`
}
function Ka(e, t) {
	return e == null ? "indeterminate" : e === t ? "complete" : "loading"
}
function Wt(e) {
	return typeof e == "number"
}
function Jn(e) {
	return Wt(e) && !isNaN(e) && e > 0
}
function eo(e, t) {
	return Wt(e) && !isNaN(e) && e <= t && e >= 0
}
function Jf(e, t) {
	return `Invalid prop \`max\` of value \`${e}\` supplied to \`${t}\`. Only numbers greater than 0 are valid max values. Defaulting to \`${Cn}\`.`
}
function ep(e, t) {
	return `Invalid prop \`value\` of value \`${e}\` supplied to \`${t}\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or ${Cn} if no \`max\` prop is set)
  - \`null\` or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`
}
var Ua = Ha,
	tp = za
const Wa = a.forwardRef(({ className: e, value: t, ...r }, n) =>
	p.jsx(Ua, {
		ref: n,
		className: X("relative h-2 w-full overflow-hidden rounded-full bg-vscode-editor-background", e),
		...r,
		children: p.jsx(tp, {
			className: "h-full w-full flex-1 bg-vscode-badge-background transition-all",
			style: { transform: `translateX(-${100 - (t || 0)}%)` },
		}),
	}),
)
Wa.displayName = Ua.displayName
Wa.__docgenInfo = { description: "", methods: [] }
var rp = "Separator",
	to = "horizontal",
	np = ["horizontal", "vertical"],
	Ga = a.forwardRef((e, t) => {
		const { decorative: r, orientation: n = to, ...o } = e,
			i = op(n) ? n : to,
			c = r ? { role: "none" } : { "aria-orientation": i === "vertical" ? i : void 0, role: "separator" }
		return p.jsx(H.div, { "data-orientation": i, ...c, ...o, ref: t })
	})
Ga.displayName = rp
function op(e) {
	return np.includes(e)
}
var Ya = Ga
const Za = a.forwardRef(({ className: e, orientation: t = "horizontal", decorative: r = !0, ...n }, o) =>
	p.jsx(Ya, {
		ref: o,
		decorative: r,
		orientation: t,
		className: X(
			"shrink-0 bg-vscode-editor-background my-5",
			t === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
			e,
		),
		...n,
	}),
)
Za.displayName = Ya.displayName
Za.__docgenInfo = {
	description: "",
	methods: [],
	props: {
		orientation: { defaultValue: { value: '"horizontal"', computed: !1 }, required: !1 },
		decorative: { defaultValue: { value: "true", computed: !1 }, required: !1 },
	},
}
function qa(e, [t, r]) {
	return Math.min(r, Math.max(t, e))
}
var Xa = ["PageUp", "PageDown"],
	Qa = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"],
	Ja = {
		"from-left": ["Home", "PageDown", "ArrowDown", "ArrowLeft"],
		"from-right": ["Home", "PageDown", "ArrowDown", "ArrowRight"],
		"from-bottom": ["Home", "PageDown", "ArrowDown", "ArrowLeft"],
		"from-top": ["Home", "PageDown", "ArrowUp", "ArrowLeft"],
	},
	nt = "Slider",
	[kr, ip, ap] = Qr(nt),
	[es, oh] = ue(nt, [ap]),
	[sp, lr] = es(nt),
	ts = a.forwardRef((e, t) => {
		const {
				name: r,
				min: n = 0,
				max: o = 100,
				step: i = 1,
				orientation: s = "horizontal",
				disabled: c = !1,
				minStepsBetweenThumbs: d = 0,
				defaultValue: l = [n],
				value: u,
				onValueChange: f = () => {},
				onValueCommit: m = () => {},
				inverted: g = !1,
				form: x,
				...h
			} = e,
			v = a.useRef(new Set()),
			w = a.useRef(0),
			C = s === "horizontal" ? cp : lp,
			[E = [], R] = Je({
				prop: u,
				defaultProp: l,
				onChange: (k) => {
					var K
					;(K = [...v.current][w.current]) == null || K.focus(), f(k)
				},
			}),
			M = a.useRef(E)
		function S(k) {
			const z = mp(E, k)
			T(k, z)
		}
		function _(k) {
			T(k, w.current)
		}
		function $() {
			const k = M.current[w.current]
			E[w.current] !== k && m(E)
		}
		function T(k, z, { commit: K } = { commit: !1 }) {
			const P = xp(i),
				O = wp(Math.round((k - n) / i) * i + n, P),
				j = qa(O, [n, o])
			R((U = []) => {
				const F = fp(U, j, z)
				if (vp(F, d * i)) {
					w.current = F.indexOf(j)
					const I = String(F) !== String(U)
					return I && K && m(F), I ? F : U
				} else return U
			})
		}
		return p.jsx(sp, {
			scope: e.__scopeSlider,
			name: r,
			disabled: c,
			min: n,
			max: o,
			valueIndexToChangeRef: w,
			thumbs: v.current,
			values: E,
			orientation: s,
			form: x,
			children: p.jsx(kr.Provider, {
				scope: e.__scopeSlider,
				children: p.jsx(kr.Slot, {
					scope: e.__scopeSlider,
					children: p.jsx(C, {
						"aria-disabled": c,
						"data-disabled": c ? "" : void 0,
						...h,
						ref: t,
						onPointerDown: L(h.onPointerDown, () => {
							c || (M.current = E)
						}),
						min: n,
						max: o,
						inverted: g,
						onSlideStart: c ? void 0 : S,
						onSlideMove: c ? void 0 : _,
						onSlideEnd: c ? void 0 : $,
						onHomeKeyDown: () => !c && T(n, 0, { commit: !0 }),
						onEndKeyDown: () => !c && T(o, E.length - 1, { commit: !0 }),
						onStepKeyDown: ({ event: k, direction: z }) => {
							if (!c) {
								const O = Xa.includes(k.key) || (k.shiftKey && Qa.includes(k.key)) ? 10 : 1,
									j = w.current,
									U = E[j],
									F = i * O * z
								T(U + F, j, { commit: !0 })
							}
						},
					}),
				}),
			}),
		})
	})
ts.displayName = nt
var [rs, ns] = es(nt, { startEdge: "left", endEdge: "right", size: "width", direction: 1 }),
	cp = a.forwardRef((e, t) => {
		const {
				min: r,
				max: n,
				dir: o,
				inverted: i,
				onSlideStart: s,
				onSlideMove: c,
				onSlideEnd: d,
				onStepKeyDown: l,
				...u
			} = e,
			[f, m] = a.useState(null),
			g = q(t, (C) => m(C)),
			x = a.useRef(void 0),
			h = Jr(o),
			v = h === "ltr",
			w = (v && !i) || (!v && i)
		function b(C) {
			const E = x.current || f.getBoundingClientRect(),
				R = [0, E.width],
				S = En(R, w ? [r, n] : [n, r])
			return (x.current = E), S(C - E.left)
		}
		return p.jsx(rs, {
			scope: e.__scopeSlider,
			startEdge: w ? "left" : "right",
			endEdge: w ? "right" : "left",
			direction: w ? 1 : -1,
			size: "width",
			children: p.jsx(os, {
				dir: h,
				"data-orientation": "horizontal",
				...u,
				ref: g,
				style: { ...u.style, "--radix-slider-thumb-transform": "translateX(-50%)" },
				onSlideStart: (C) => {
					const E = b(C.clientX)
					s == null || s(E)
				},
				onSlideMove: (C) => {
					const E = b(C.clientX)
					c == null || c(E)
				},
				onSlideEnd: () => {
					;(x.current = void 0), d == null || d()
				},
				onStepKeyDown: (C) => {
					const R = Ja[w ? "from-left" : "from-right"].includes(C.key)
					l == null || l({ event: C, direction: R ? -1 : 1 })
				},
			}),
		})
	}),
	lp = a.forwardRef((e, t) => {
		const {
				min: r,
				max: n,
				inverted: o,
				onSlideStart: i,
				onSlideMove: s,
				onSlideEnd: c,
				onStepKeyDown: d,
				...l
			} = e,
			u = a.useRef(null),
			f = q(t, u),
			m = a.useRef(void 0),
			g = !o
		function x(h) {
			const v = m.current || u.current.getBoundingClientRect(),
				w = [0, v.height],
				C = En(w, g ? [n, r] : [r, n])
			return (m.current = v), C(h - v.top)
		}
		return p.jsx(rs, {
			scope: e.__scopeSlider,
			startEdge: g ? "bottom" : "top",
			endEdge: g ? "top" : "bottom",
			size: "height",
			direction: g ? 1 : -1,
			children: p.jsx(os, {
				"data-orientation": "vertical",
				...l,
				ref: f,
				style: { ...l.style, "--radix-slider-thumb-transform": "translateY(50%)" },
				onSlideStart: (h) => {
					const v = x(h.clientY)
					i == null || i(v)
				},
				onSlideMove: (h) => {
					const v = x(h.clientY)
					s == null || s(v)
				},
				onSlideEnd: () => {
					;(m.current = void 0), c == null || c()
				},
				onStepKeyDown: (h) => {
					const w = Ja[g ? "from-bottom" : "from-top"].includes(h.key)
					d == null || d({ event: h, direction: w ? -1 : 1 })
				},
			}),
		})
	}),
	os = a.forwardRef((e, t) => {
		const {
				__scopeSlider: r,
				onSlideStart: n,
				onSlideMove: o,
				onSlideEnd: i,
				onHomeKeyDown: s,
				onEndKeyDown: c,
				onStepKeyDown: d,
				...l
			} = e,
			u = lr(nt, r)
		return p.jsx(H.span, {
			...l,
			ref: t,
			onKeyDown: L(e.onKeyDown, (f) => {
				f.key === "Home"
					? (s(f), f.preventDefault())
					: f.key === "End"
						? (c(f), f.preventDefault())
						: Xa.concat(Qa).includes(f.key) && (d(f), f.preventDefault())
			}),
			onPointerDown: L(e.onPointerDown, (f) => {
				const m = f.target
				m.setPointerCapture(f.pointerId), f.preventDefault(), u.thumbs.has(m) ? m.focus() : n(f)
			}),
			onPointerMove: L(e.onPointerMove, (f) => {
				f.target.hasPointerCapture(f.pointerId) && o(f)
			}),
			onPointerUp: L(e.onPointerUp, (f) => {
				const m = f.target
				m.hasPointerCapture(f.pointerId) && (m.releasePointerCapture(f.pointerId), i(f))
			}),
		})
	}),
	is = "SliderTrack",
	as = a.forwardRef((e, t) => {
		const { __scopeSlider: r, ...n } = e,
			o = lr(is, r)
		return p.jsx(H.span, {
			"data-disabled": o.disabled ? "" : void 0,
			"data-orientation": o.orientation,
			...n,
			ref: t,
		})
	})
as.displayName = is
var Lr = "SliderRange",
	ss = a.forwardRef((e, t) => {
		const { __scopeSlider: r, ...n } = e,
			o = lr(Lr, r),
			i = ns(Lr, r),
			s = a.useRef(null),
			c = q(t, s),
			d = o.values.length,
			l = o.values.map((m) => us(m, o.min, o.max)),
			u = d > 1 ? Math.min(...l) : 0,
			f = 100 - Math.max(...l)
		return p.jsx(H.span, {
			"data-orientation": o.orientation,
			"data-disabled": o.disabled ? "" : void 0,
			...n,
			ref: c,
			style: { ...e.style, [i.startEdge]: u + "%", [i.endEdge]: f + "%" },
		})
	})
ss.displayName = Lr
var jr = "SliderThumb",
	cs = a.forwardRef((e, t) => {
		const r = ip(e.__scopeSlider),
			[n, o] = a.useState(null),
			i = q(t, (c) => o(c)),
			s = a.useMemo(() => (n ? r().findIndex((c) => c.ref.current === n) : -1), [r, n])
		return p.jsx(up, { ...e, ref: i, index: s })
	}),
	up = a.forwardRef((e, t) => {
		const { __scopeSlider: r, index: n, name: o, ...i } = e,
			s = lr(jr, r),
			c = ns(jr, r),
			[d, l] = a.useState(null),
			u = q(t, (b) => l(b)),
			f = d ? s.form || !!d.closest("form") : !0,
			m = Yr(d),
			g = s.values[n],
			x = g === void 0 ? 0 : us(g, s.min, s.max),
			h = pp(n, s.values.length),
			v = m == null ? void 0 : m[c.size],
			w = v ? hp(v, x, c.direction) : 0
		return (
			a.useEffect(() => {
				if (d)
					return (
						s.thumbs.add(d),
						() => {
							s.thumbs.delete(d)
						}
					)
			}, [d, s.thumbs]),
			p.jsxs("span", {
				style: {
					transform: "var(--radix-slider-thumb-transform)",
					position: "absolute",
					[c.startEdge]: `calc(${x}% + ${w}px)`,
				},
				children: [
					p.jsx(kr.ItemSlot, {
						scope: e.__scopeSlider,
						children: p.jsx(H.span, {
							role: "slider",
							"aria-label": e["aria-label"] || h,
							"aria-valuemin": s.min,
							"aria-valuenow": g,
							"aria-valuemax": s.max,
							"aria-orientation": s.orientation,
							"data-orientation": s.orientation,
							"data-disabled": s.disabled ? "" : void 0,
							tabIndex: s.disabled ? void 0 : 0,
							...i,
							ref: u,
							style: g === void 0 ? { display: "none" } : e.style,
							onFocus: L(e.onFocus, () => {
								s.valueIndexToChangeRef.current = n
							}),
						}),
					}),
					f &&
						p.jsx(
							ls,
							{
								name: o ?? (s.name ? s.name + (s.values.length > 1 ? "[]" : "") : void 0),
								form: s.form,
								value: g,
							},
							n,
						),
				],
			})
		)
	})
cs.displayName = jr
var dp = "RadioBubbleInput",
	ls = a.forwardRef(({ __scopeSlider: e, value: t, ...r }, n) => {
		const o = a.useRef(null),
			i = q(o, n),
			s = Do(t)
		return (
			a.useEffect(() => {
				const c = o.current
				if (!c) return
				const d = window.HTMLInputElement.prototype,
					u = Object.getOwnPropertyDescriptor(d, "value").set
				if (s !== t && u) {
					const f = new Event("input", { bubbles: !0 })
					u.call(c, t), c.dispatchEvent(f)
				}
			}, [s, t]),
			p.jsx(H.input, { style: { display: "none" }, ...r, ref: i, defaultValue: t })
		)
	})
ls.displayName = dp
function fp(e = [], t, r) {
	const n = [...e]
	return (n[r] = t), n.sort((o, i) => o - i)
}
function us(e, t, r) {
	const i = (100 / (r - t)) * (e - t)
	return qa(i, [0, 100])
}
function pp(e, t) {
	return t > 2 ? `Value ${e + 1} of ${t}` : t === 2 ? ["Minimum", "Maximum"][e] : void 0
}
function mp(e, t) {
	if (e.length === 1) return 0
	const r = e.map((o) => Math.abs(o - t)),
		n = Math.min(...r)
	return r.indexOf(n)
}
function hp(e, t, r) {
	const n = e / 2,
		i = En([0, 50], [0, n])
	return (n - i(t) * r) * r
}
function gp(e) {
	return e.slice(0, -1).map((t, r) => e[r + 1] - t)
}
function vp(e, t) {
	if (t > 0) {
		const r = gp(e)
		return Math.min(...r) >= t
	}
	return !0
}
function En(e, t) {
	return (r) => {
		if (e[0] === e[1] || t[0] === t[1]) return t[0]
		const n = (t[1] - t[0]) / (e[1] - e[0])
		return t[0] + n * (r - e[0])
	}
}
function xp(e) {
	return (String(e).split(".")[1] || "").length
}
function wp(e, t) {
	const r = Math.pow(10, t)
	return Math.round(e * r) / r
}
var ds = ts,
	yp = as,
	bp = ss,
	Cp = cs
const fs = a.forwardRef(({ className: e, ...t }, r) =>
	p.jsxs(ds, {
		ref: r,
		className: X("relative flex w-full touch-none select-none items-center", e),
		...t,
		children: [
			p.jsx(yp, {
				className: "relative w-full h-[8px] grow overflow-hidden bg-accent rounded-sm border",
				children: p.jsx(bp, { className: "absolute h-full bg-vscode-button-background" }),
			}),
			p.jsx(Cp, {
				className:
					"block h-3 w-3 rounded-full border border-primary/50 bg-vscode-button-background transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
			}),
		],
	}),
)
fs.displayName = ds.displayName
fs.__docgenInfo = { description: "", methods: [] }
/** @license
 * fzf v0.5.2
 * Copyright (c) 2021 Ajit
 * Licensed under BSD 3-Clause
 */ const Rn = {
	216: "O",
	223: "s",
	248: "o",
	273: "d",
	295: "h",
	305: "i",
	320: "l",
	322: "l",
	359: "t",
	383: "s",
	384: "b",
	385: "B",
	387: "b",
	390: "O",
	392: "c",
	393: "D",
	394: "D",
	396: "d",
	398: "E",
	400: "E",
	402: "f",
	403: "G",
	407: "I",
	409: "k",
	410: "l",
	412: "M",
	413: "N",
	414: "n",
	415: "O",
	421: "p",
	427: "t",
	429: "t",
	430: "T",
	434: "V",
	436: "y",
	438: "z",
	477: "e",
	485: "g",
	544: "N",
	545: "d",
	549: "z",
	564: "l",
	565: "n",
	566: "t",
	567: "j",
	570: "A",
	571: "C",
	572: "c",
	573: "L",
	574: "T",
	575: "s",
	576: "z",
	579: "B",
	580: "U",
	581: "V",
	582: "E",
	583: "e",
	584: "J",
	585: "j",
	586: "Q",
	587: "q",
	588: "R",
	589: "r",
	590: "Y",
	591: "y",
	592: "a",
	593: "a",
	595: "b",
	596: "o",
	597: "c",
	598: "d",
	599: "d",
	600: "e",
	603: "e",
	604: "e",
	605: "e",
	606: "e",
	607: "j",
	608: "g",
	609: "g",
	610: "G",
	613: "h",
	614: "h",
	616: "i",
	618: "I",
	619: "l",
	620: "l",
	621: "l",
	623: "m",
	624: "m",
	625: "m",
	626: "n",
	627: "n",
	628: "N",
	629: "o",
	633: "r",
	634: "r",
	635: "r",
	636: "r",
	637: "r",
	638: "r",
	639: "r",
	640: "R",
	641: "R",
	642: "s",
	647: "t",
	648: "t",
	649: "u",
	651: "v",
	652: "v",
	653: "w",
	654: "y",
	655: "Y",
	656: "z",
	657: "z",
	663: "c",
	665: "B",
	666: "e",
	667: "G",
	668: "H",
	669: "j",
	670: "k",
	671: "L",
	672: "q",
	686: "h",
	867: "a",
	868: "e",
	869: "i",
	870: "o",
	871: "u",
	872: "c",
	873: "d",
	874: "h",
	875: "m",
	876: "r",
	877: "t",
	878: "v",
	879: "x",
	7424: "A",
	7427: "B",
	7428: "C",
	7429: "D",
	7431: "E",
	7432: "e",
	7433: "i",
	7434: "J",
	7435: "K",
	7436: "L",
	7437: "M",
	7438: "N",
	7439: "O",
	7440: "O",
	7441: "o",
	7442: "o",
	7443: "o",
	7446: "o",
	7447: "o",
	7448: "P",
	7449: "R",
	7450: "R",
	7451: "T",
	7452: "U",
	7453: "u",
	7454: "u",
	7455: "m",
	7456: "V",
	7457: "W",
	7458: "Z",
	7522: "i",
	7523: "r",
	7524: "u",
	7525: "v",
	7834: "a",
	7835: "s",
	8305: "i",
	8341: "h",
	8342: "k",
	8343: "l",
	8344: "m",
	8345: "n",
	8346: "p",
	8347: "s",
	8348: "t",
	8580: "c",
}
for (let e = "̀".codePointAt(0); e <= "ͯ".codePointAt(0); ++e) {
	const t = String.fromCodePoint(e)
	for (const r of "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz") {
		const o = (r + t).normalize().codePointAt(0)
		o > 126 && (Rn[o] = r)
	}
}
const Sr = { a: [7844, 7863], e: [7870, 7879], o: [7888, 7907], u: [7912, 7921] }
for (const e of Object.keys(Sr)) {
	const t = e.toUpperCase()
	for (let r = Sr[e][0]; r <= Sr[e][1]; ++r) Rn[r] = r % 2 === 0 ? t : e
}
function Rt(e) {
	if (e < 192 || e > 8580) return e
	const t = Rn[e]
	return t !== void 0 ? t.codePointAt(0) : e
}
function Ee(e, t) {
	return e > t ? e : t
}
const ps = (e) => e.split("").map((t) => t.codePointAt(0)),
	Ep = new Set(
		` \f
\r	\v  \u2028\u2029  　\uFEFF`
			.split("")
			.map((e) => e.codePointAt(0)),
	)
for (let e = " ".codePointAt(0); e <= " ".codePointAt(0); e++) Ep.add(e)
const Xe = "".codePointAt(0),
	pt = "A".codePointAt(0),
	mt = "Z".codePointAt(0),
	ms = "a".codePointAt(0),
	hs = "z".codePointAt(0),
	Rp = "0".codePointAt(0),
	Sp = "9".codePointAt(0)
function We(e, t, r) {
	return r ? e : t - e - 1
}
const ht = 16,
	Fr = -3,
	Gt = -1,
	Le = ht / 2,
	Pp = ht / 2,
	Mp = Le + Gt,
	gs = 4,
	vs = 2
function $r(e) {
	return e ? new Set() : null
}
function at(e, t, r) {
	if (t !== null && t.i16.length > e + r) {
		const n = t.i16.subarray(e, e + r)
		return [e + r, n]
	}
	return [e, new Int16Array(r)]
}
function ro(e, t, r) {
	if (t !== null && t.i32.length > e + r) {
		const n = t.i32.subarray(e, e + r)
		return [e + r, n]
	}
	return [e, new Int32Array(r)]
}
function xs(e) {
	return e >= ms && e <= hs ? 1 : e >= pt && e <= mt ? 2 : e >= Rp && e <= Sp ? 4 : 0
}
function ws(e) {
	const t = String.fromCodePoint(e)
	return t !== t.toUpperCase()
		? 1
		: t !== t.toLowerCase()
			? 2
			: t.match(new RegExp("\\p{Number}", "gu")) !== null
				? 4
				: t.match(new RegExp("\\p{Letter}", "gu")) !== null
					? 3
					: 0
}
function Yt(e) {
	return e <= Xe ? xs(e) : ws(e)
}
function Sn(e, t) {
	return e === 0 && t !== 0 ? Le : (e === 1 && t === 2) || (e !== 4 && t === 4) ? Mp : t === 0 ? Pp : 0
}
function Ap(e, t) {
	return t === 0 ? Le : Sn(Yt(e[t - 1]), Yt(e[t]))
}
function _p(e, t, r, n) {
	let o = e.slice(n),
		i = o.indexOf(r)
	if (i === 0) return n
	if (!t && r >= ms && r <= hs) {
		i > 0 && (o = o.slice(0, i))
		const s = o.indexOf(r - 32)
		s >= 0 && (i = s)
	}
	return i < 0 ? -1 : n + i
}
function no(e) {
	for (const t of e) if (t >= 128) return !1
	return !0
}
function Pn(e, t, r) {
	if (!no(e)) return 0
	if (!no(t)) return -1
	let n = 0,
		o = 0
	for (let i = 0; i < t.length; i++) {
		if (((o = _p(e, r, t[i], o)), o < 0)) return -1
		i === 0 && o > 0 && (n = o - 1), o++
	}
	return n
}
const Np = (e, t, r, n, o, i, s) => {
	const c = o.length
	if (c === 0) return [{ start: 0, end: 0, score: 0 }, $r(i)]
	const d = n.length
	if (s !== null && d * c > s.i16.length) return bs(e, t, r, n, o, i)
	const l = Pn(n, o, e)
	if (l < 0) return [{ start: -1, end: -1, score: 0 }, null]
	let u = 0,
		f = 0,
		m = null,
		g = null,
		x = null,
		h = null
	;([u, m] = at(u, s, d)), ([u, g] = at(u, s, d)), ([u, x] = at(u, s, d)), ([f, h] = ro(f, s, c))
	const [, v] = ro(f, s, d)
	for (let y = 0; y < v.length; y++) v[y] = n[y]
	let w = 0,
		b = 0,
		C = 0,
		E = 0
	const R = o[0]
	let M = o[0],
		S = 0,
		_ = 0,
		$ = !1,
		T = v.subarray(l),
		k = m.subarray(l).subarray(0, T.length),
		z = g.subarray(l).subarray(0, T.length),
		K = x.subarray(l).subarray(0, T.length)
	for (let [y, A] of T.entries()) {
		let D = null
		A <= Xe
			? ((D = xs(A)), !e && D === 2 && (A += 32))
			: ((D = ws(A)),
				!e && D === 2 && (A = String.fromCodePoint(A).toLowerCase().codePointAt(0)),
				t && (A = Rt(A))),
			(T[y] = A)
		const N = Sn(_, D)
		if (
			((K[y] = N),
			(_ = D),
			A === M && (C < c && ((h[C] = l + y), C++, (M = o[Math.min(C, c - 1)])), (E = l + y)),
			A === R)
		) {
			const B = ht + N * vs
			if (
				((k[y] = B),
				(z[y] = 1),
				c === 1 && ((r && B > w) || (!r && B >= w)) && ((w = B), (b = l + y), r && N === Le))
			)
				break
			$ = !1
		} else $ ? (k[y] = Ee(S + Gt, 0)) : (k[y] = Ee(S + Fr, 0)), (z[y] = 0), ($ = !0)
		S = k[y]
	}
	if (C !== c) return [{ start: -1, end: -1, score: 0 }, null]
	if (c === 1) {
		const y = { start: b, end: b + 1, score: w }
		if (!i) return [y, null]
		const A = new Set()
		return A.add(b), [y, A]
	}
	const P = h[0],
		O = E - P + 1
	let j = null
	;[u, j] = at(u, s, O * c)
	{
		const y = m.subarray(P, E + 1)
		for (const [A, D] of y.entries()) j[A] = D
	}
	let [, U] = at(u, s, O * c)
	{
		const y = g.subarray(P, E + 1)
		for (const [A, D] of y.entries()) U[A] = D
	}
	const F = h.subarray(1),
		I = o.slice(1).slice(0, F.length)
	for (const [y, A] of F.entries()) {
		let D = !1
		const N = I[y],
			B = y + 1,
			V = B * O,
			G = v.subarray(A, E + 1),
			Y = x.subarray(A).subarray(0, G.length),
			oe = U.subarray(V + A - P).subarray(0, G.length),
			Pt = U.subarray(V + A - P - 1 - O).subarray(0, G.length),
			Mt = j.subarray(V + A - P).subarray(0, G.length),
			_e = j.subarray(V + A - P - 1 - O).subarray(0, G.length),
			$e = j.subarray(V + A - P - 1).subarray(0, G.length)
		$e[0] = 0
		for (const [se, dr] of G.entries()) {
			const At = se + A
			let be = 0,
				fe = 0,
				Be = 0
			if ((D ? (fe = $e[se] + Gt) : (fe = $e[se] + Fr), N === dr)) {
				be = _e[se] + ht
				let ot = Y[se]
				;(Be = Pt[se] + 1),
					ot === Le ? (Be = 1) : Be > 1 && (ot = Ee(ot, Ee(gs, x[At - Be + 1]))),
					be + ot < fe ? ((be += Y[se]), (Be = 0)) : (be += ot)
			}
			;(oe[se] = Be), (D = be < fe)
			const _t = Ee(Ee(be, fe), 0)
			B === c - 1 && ((r && _t > w) || (!r && _t >= w)) && ((w = _t), (b = At)), (Mt[se] = _t)
		}
	}
	const W = $r(i)
	let Z = P
	if (i && W !== null) {
		let y = c - 1
		Z = b
		let A = !0
		for (;;) {
			const D = y * O,
				N = Z - P,
				B = j[D + N]
			let V = 0,
				G = 0
			if (
				(y > 0 && Z >= h[y] && (V = j[D - O + N - 1]),
				Z > h[y] && (G = j[D + N - 1]),
				B > V && (B > G || (B === G && A)))
			) {
				if ((W.add(Z), y === 0)) break
				y--
			}
			;(A = U[D + N] > 1 || (D + O + N + 1 < U.length && U[D + O + N + 1] > 0)), Z--
		}
	}
	return [{ start: Z, end: b + 1, score: w }, W]
}
function ys(e, t, r, n, o, i, s) {
	let c = 0,
		d = 0,
		l = !1,
		u = 0,
		f = 0
	const m = $r(s)
	let g = 0
	o > 0 && (g = Yt(r[o - 1]))
	for (let x = o; x < i; x++) {
		let h = r[x]
		const v = Yt(h)
		if (
			(e ||
				(h >= pt && h <= mt ? (h += 32) : h > Xe && (h = String.fromCodePoint(h).toLowerCase().codePointAt(0))),
			t && (h = Rt(h)),
			h === n[c])
		) {
			s && m !== null && m.add(x), (d += ht)
			let w = Sn(g, v)
			u === 0 ? (f = w) : (w === Le && (f = w), (w = Ee(Ee(w, f), gs))),
				c === 0 ? (d += w * vs) : (d += w),
				(l = !1),
				u++,
				c++
		} else l ? (d += Gt) : (d += Fr), (l = !0), (u = 0), (f = 0)
		g = v
	}
	return [d, m]
}
const bs = (e, t, r, n, o, i, s) => {
		if (o.length === 0) return [{ start: 0, end: 0, score: 0 }, null]
		if (Pn(n, o, e) < 0) return [{ start: -1, end: -1, score: 0 }, null]
		let c = 0,
			d = -1,
			l = -1
		const u = n.length,
			f = o.length
		for (let m = 0; m < u; m++) {
			let g = n[We(m, u, r)]
			e ||
				(g >= pt && g <= mt ? (g += 32) : g > Xe && (g = String.fromCodePoint(g).toLowerCase().codePointAt(0))),
				t && (g = Rt(g))
			const x = o[We(c, f, r)]
			if (g === x && (d < 0 && (d = m), c++, c === f)) {
				l = m + 1
				break
			}
		}
		if (d >= 0 && l >= 0) {
			c--
			for (let x = l - 1; x >= d; x--) {
				const h = We(x, u, r)
				let v = n[h]
				e ||
					(v >= pt && v <= mt
						? (v += 32)
						: v > Xe && (v = String.fromCodePoint(v).toLowerCase().codePointAt(0)))
				const w = We(c, f, r),
					b = o[w]
				if (v === b && (c--, c < 0)) {
					d = x
					break
				}
			}
			if (!r) {
				const x = d
				;(d = u - l), (l = u - x)
			}
			const [m, g] = ys(e, t, n, o, d, l, i)
			return [{ start: d, end: l, score: m }, g]
		}
		return [{ start: -1, end: -1, score: 0 }, null]
	},
	Ip = (e, t, r, n, o, i, s) => {
		if (o.length === 0) return [{ start: 0, end: 0, score: 0 }, null]
		const c = n.length,
			d = o.length
		if (c < d) return [{ start: -1, end: -1, score: 0 }, null]
		if (Pn(n, o, e) < 0) return [{ start: -1, end: -1, score: 0 }, null]
		let l = 0,
			u = -1,
			f = 0,
			m = -1
		for (let g = 0; g < c; g++) {
			const x = We(g, c, r)
			let h = n[x]
			e ||
				(h >= pt && h <= mt ? (h += 32) : h > Xe && (h = String.fromCodePoint(h).toLowerCase().codePointAt(0))),
				t && (h = Rt(h))
			const v = We(l, d, r)
			if (o[v] === h) {
				if ((v === 0 && (f = Ap(n, x)), l++, l === d)) {
					if ((f > m && ((u = g), (m = f)), f === Le)) break
					;(g -= l - 1), (l = 0), (f = 0)
				}
			} else (g -= l), (l = 0), (f = 0)
		}
		if (u >= 0) {
			let g = 0,
				x = 0
			r ? ((g = u - d + 1), (x = u + 1)) : ((g = c - (u + 1)), (x = c - (u - d + 1)))
			const [h] = ys(e, t, n, o, g, x, !1)
			return [{ start: g, end: x, score: h }, null]
		}
		return [{ start: -1, end: -1, score: 0 }, null]
	},
	Op = 100 * 1024,
	Tp = 2048
function Dp(e, t) {
	return { i16: new Int16Array(e), i32: new Int32Array(t) }
}
const kp = Dp(Op, Tp),
	Lp = (e, t, r) => {
		let n = !1
		switch (t) {
			case "smart-case":
				e.toLowerCase() !== e && (n = !0)
				break
			case "case-sensitive":
				n = !0
				break
			case "case-insensitive":
				;(e = e.toLowerCase()), (n = !1)
				break
		}
		let o = ps(e)
		return r && (o = o.map(Rt)), { queryRunes: o, caseSensitive: n }
	}
function jp(e, t) {
	const r = Object.keys(e)
		.map((o) => parseInt(o, 10))
		.sort((o, i) => i - o)
	let n = []
	for (const o of r) if (((n = n.concat(e[o])), n.length >= t)) break
	return n
}
function Fp(e, t, r) {
	return (n) => {
		const o = this.runesList[n]
		if (t.length > o.length) return
		let [i, s] = this.algoFn(r, this.opts.normalize, this.opts.forward, o, t, !0, kp)
		if (i.start === -1) return
		if (this.opts.fuzzy === !1) {
			s = new Set()
			for (let d = i.start; d < i.end; ++d) s.add(d)
		}
		const c = this.opts.sort ? i.score : 0
		e[c] === void 0 && (e[c] = []), e[c].push({ item: this.items[n], ...i, positions: s ?? new Set() })
	}
}
function $p(e) {
	const { queryRunes: t, caseSensitive: r } = Lp(e, this.opts.casing, this.opts.normalize),
		n = {},
		o = Fp.bind(this)(n, t, r)
	for (let i = 0, s = this.runesList.length; i < s; ++i) o(i)
	return jp(n, this.opts.limit)
}
const Cs = {
	limit: 1 / 0,
	selector: (e) => e,
	casing: "smart-case",
	normalize: !0,
	fuzzy: "v2",
	tiebreakers: [],
	sort: !0,
	forward: !0,
}
class Bp {
	constructor(t, ...r) {
		switch (
			((this.opts = { ...Cs, ...r[0] }),
			(this.items = t),
			(this.runesList = t.map((n) => ps(this.opts.selector(n).normalize()))),
			(this.algoFn = Ip),
			this.opts.fuzzy)
		) {
			case "v2":
				this.algoFn = Np
				break
			case "v1":
				this.algoFn = bs
				break
		}
	}
}
const Hp = { ...Cs, match: $p }
class Vp extends Bp {
	constructor(t, ...r) {
		super(t, ...r), (this.opts = { ...Hp, ...r[0] })
	}
	find(t) {
		if (t.length === 0 || this.items.length === 0) return this.items.slice(0, this.opts.limit).map(zp)
		t = t.normalize()
		let r = this.opts.match.bind(this)(t)
		return Kp(r, this.opts)
	}
}
const zp = (e) => ({ item: e, start: -1, end: -1, score: 0, positions: new Set() })
function Kp(e, t) {
	if (t.sort) {
		const { selector: r } = t
		e.sort((n, o) => {
			if (n.score === o.score)
				for (const i of t.tiebreakers) {
					const s = i(n, o, r)
					if (s !== 0) return s
				}
			return 0
		})
	}
	return Number.isFinite(t.limit) && e.splice(t.limit), e
}
class Up {
	constructor(t, ...r) {
		;(this.finder = new Vp(t, ...r)), (this.find = this.finder.find.bind(this.finder))
	}
}
const Wp = (e, t, r, n) => {
		var i, s, c, d
		const o = [r, { code: t, ...(n || {}) }]
		if ((s = (i = e == null ? void 0 : e.services) == null ? void 0 : i.logger) != null && s.forward)
			return e.services.logger.forward(o, "warn", "react-i18next::", !0)
		Ie(o[0]) && (o[0] = `react-i18next:: ${o[0]}`),
			(d = (c = e == null ? void 0 : e.services) == null ? void 0 : c.logger) != null && d.warn
				? e.services.logger.warn(...o)
				: console != null && console.warn && console.warn(...o)
	},
	oo = {},
	Br = (e, t, r, n) => {
		;(Ie(r) && oo[r]) || (Ie(r) && (oo[r] = new Date()), Wp(e, t, r, n))
	},
	Es = (e, t) => () => {
		if (e.isInitialized) t()
		else {
			const r = () => {
				setTimeout(() => {
					e.off("initialized", r)
				}, 0),
					t()
			}
			e.on("initialized", r)
		}
	},
	Hr = (e, t, r) => {
		e.loadNamespaces(t, Es(e, r))
	},
	io = (e, t, r, n) => {
		if ((Ie(r) && (r = [r]), e.options.preload && e.options.preload.indexOf(t) > -1)) return Hr(e, r, n)
		r.forEach((o) => {
			e.options.ns.indexOf(o) < 0 && e.options.ns.push(o)
		}),
			e.loadLanguages(t, Es(e, n))
	},
	Gp = (e, t, r = {}) =>
		!t.languages || !t.languages.length
			? (Br(t, "NO_LANGUAGES", "i18n.languages were undefined or empty", { languages: t.languages }), !0)
			: t.hasLoadedNamespace(e, {
					lng: r.lng,
					precheck: (n, o) => {
						var i
						if (
							((i = r.bindI18n) == null ? void 0 : i.indexOf("languageChanging")) > -1 &&
							n.services.backendConnector.backend &&
							n.isLanguageChangingTo &&
							!o(n.isLanguageChangingTo, e)
						)
							return !1
					},
				}),
	Ie = (e) => typeof e == "string",
	Yp = (e) => typeof e == "object" && e !== null,
	Zp = /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34|nbsp|#160|copy|#169|reg|#174|hellip|#8230|#x2F|#47);/g,
	qp = {
		"&amp;": "&",
		"&#38;": "&",
		"&lt;": "<",
		"&#60;": "<",
		"&gt;": ">",
		"&#62;": ">",
		"&apos;": "'",
		"&#39;": "'",
		"&quot;": '"',
		"&#34;": '"',
		"&nbsp;": " ",
		"&#160;": " ",
		"&copy;": "©",
		"&#169;": "©",
		"&reg;": "®",
		"&#174;": "®",
		"&hellip;": "…",
		"&#8230;": "…",
		"&#x2F;": "/",
		"&#47;": "/",
	},
	Xp = (e) => qp[e],
	Qp = (e) => e.replace(Zp, Xp)
let Jp = {
	bindI18n: "languageChanged",
	bindI18nStore: "",
	transEmptyNodeValue: "",
	transSupportBasicHtmlNodes: !0,
	transWrapTextNodes: "",
	transKeepBasicHtmlNodesFor: ["br", "strong", "i", "p"],
	useSuspense: !0,
	unescape: Qp,
}
const em = () => Jp
let tm
const rm = () => tm,
	nm = a.createContext()
class om {
	constructor() {
		this.usedNamespaces = {}
	}
	addUsedNamespaces(t) {
		t.forEach((r) => {
			this.usedNamespaces[r] || (this.usedNamespaces[r] = !0)
		})
	}
	getUsedNamespaces() {
		return Object.keys(this.usedNamespaces)
	}
}
const im = (e, t) => {
		const r = a.useRef()
		return (
			a.useEffect(() => {
				r.current = e
			}, [e, t]),
			r.current
		)
	},
	Rs = (e, t, r, n) => e.getFixedT(t, r, n),
	am = (e, t, r, n) => a.useCallback(Rs(e, t, r, n), [e, t, r, n]),
	sm = (e, t = {}) => {
		var E, R, M, S
		const { i18n: r } = t,
			{ i18n: n, defaultNS: o } = a.useContext(nm) || {},
			i = r || n || rm()
		if ((i && !i.reportNamespaces && (i.reportNamespaces = new om()), !i)) {
			Br(
				i,
				"NO_I18NEXT_INSTANCE",
				"useTranslation: You will need to pass in an i18next instance by using initReactI18next",
			)
			const _ = (T, k) =>
					Ie(k) ? k : Yp(k) && Ie(k.defaultValue) ? k.defaultValue : Array.isArray(T) ? T[T.length - 1] : T,
				$ = [_, {}, !1]
			return ($.t = _), ($.i18n = {}), ($.ready = !1), $
		}
		;(E = i.options.react) != null &&
			E.wait &&
			Br(
				i,
				"DEPRECATED_OPTION",
				"useTranslation: It seems you are still using the old wait option, you may migrate to the new useSuspense behaviour.",
			)
		const s = { ...em(), ...i.options.react, ...t },
			{ useSuspense: c, keyPrefix: d } = s
		let l = o || ((R = i.options) == null ? void 0 : R.defaultNS)
		;(l = Ie(l) ? [l] : l || ["translation"]),
			(S = (M = i.reportNamespaces).addUsedNamespaces) == null || S.call(M, l)
		const u = (i.isInitialized || i.initializedStoreOnce) && l.every((_) => Gp(_, i, s)),
			f = am(i, t.lng || null, s.nsMode === "fallback" ? l : l[0], d),
			m = () => f,
			g = () => Rs(i, t.lng || null, s.nsMode === "fallback" ? l : l[0], d),
			[x, h] = a.useState(m)
		let v = l.join()
		t.lng && (v = `${t.lng}${v}`)
		const w = im(v),
			b = a.useRef(!0)
		a.useEffect(() => {
			const { bindI18n: _, bindI18nStore: $ } = s
			;(b.current = !0),
				!u &&
					!c &&
					(t.lng
						? io(i, t.lng, l, () => {
								b.current && h(g)
							})
						: Hr(i, l, () => {
								b.current && h(g)
							})),
				u && w && w !== v && b.current && h(g)
			const T = () => {
				b.current && h(g)
			}
			return (
				_ && (i == null || i.on(_, T)),
				$ && (i == null || i.store.on($, T)),
				() => {
					;(b.current = !1),
						i && (_ == null || _.split(" ").forEach((k) => i.off(k, T))),
						$ && i && $.split(" ").forEach((k) => i.store.off(k, T))
				}
			)
		}, [i, v]),
			a.useEffect(() => {
				b.current && u && h(m)
			}, [i, d, u])
		const C = [x, i, u]
		if (((C.t = x), (C.i18n = i), (C.ready = u), u || (!u && !c))) return C
		throw new Promise((_) => {
			t.lng ? io(i, t.lng, l, () => _()) : Hr(i, l, () => _())
		})
	}
var cm = function (e) {
		a.useEffect(e, [])
	},
	lm = function (e) {
		cm(function () {
			e()
		})
	}
const um = (e) => {
		const [t, r] = a.useState()
		return lm(() => r(document.getElementById(e) ?? void 0)), t
	},
	Ss = a.memo(
		a.forwardRef(
			(
				{
					value: e,
					options: t,
					onChange: r,
					disabled: n = !1,
					title: o = "",
					triggerClassName: i = "",
					contentClassName: s = "",
					itemClassName: c = "",
					sideOffset: d = 4,
					align: l = "start",
					placeholder: u = "",
					shortcutText: f = "",
					renderItem: m,
				},
				g,
			) => {
				const { t: x } = sm(),
					[h, v] = a.useState(!1),
					[w, b] = a.useState(""),
					C = a.useRef(null),
					E = um("roo-portal"),
					R = a.useMemo(() => t.find((P) => P.value === e), [t, e]),
					M = a.useMemo(() => (e && !R && u ? u : (R == null ? void 0 : R.label) || u || ""), [e, R, u]),
					S = a.useCallback((P) => {
						v(P), P || requestAnimationFrame(() => b(""))
					}, []),
					_ = a.useCallback(() => {
						var P
						b(""), (P = C.current) == null || P.focus()
					}, []),
					$ = a.useMemo(
						() =>
							t
								.filter((P) => P.type !== "separator" && P.type !== "shortcut")
								.map((P) => ({ original: P, searchStr: [P.label, P.value].filter(Boolean).join(" ") })),
						[t],
					),
					T = a.useMemo(() => new Up($, { selector: (P) => P.searchStr }), [$]),
					k = a.useMemo(() => {
						if (!w) return t
						const P = T.find(w).map((O) => O.item.original)
						return t.filter((O) =>
							O.type === "separator" || O.type === "shortcut" ? !0 : P.some((j) => j.value === O.value),
						)
					}, [t, w, T]),
					z = a.useMemo(() => {
						const P = []
						let O = !1
						return (
							k.forEach((j) => {
								j.type === "separator"
									? P.length > 0 && !O && (P.push(j), (O = !0))
									: (P.push(j), (O = !1))
							}),
							P.length > 0 && P[P.length - 1].type === "separator" && P.pop(),
							P
						)
					}, [k]),
					K = a.useCallback(
						(P) => {
							const O = t.find((j) => j.value === P)
							if (O) {
								if (O.type === "action") {
									window.postMessage({ type: "action", action: O.value }), b(""), v(!1)
									return
								}
								O.disabled || (r(O.value), b(""), v(!1))
							}
						},
						[r, t],
					)
				return p.jsxs(Gf, {
					open: h,
					onOpenChange: S,
					"data-testid": "dropdown-root",
					children: [
						p.jsxs(Yf, {
							ref: g,
							disabled: n,
							title: o,
							"data-testid": "dropdown-trigger",
							className: X(
								"w-full min-w-0 max-w-full inline-flex items-center gap-1.5 relative whitespace-nowrap px-1.5 py-1 text-xs",
								"bg-transparent border border-[rgba(255,255,255,0.08)] rounded-md text-vscode-foreground w-auto",
								"transition-all duration-150 focus:outline-none focus-visible:ring-1 focus-visible:ring-vscode-focusBorder focus-visible:ring-inset",
								n
									? "opacity-50 cursor-not-allowed"
									: "opacity-90 hover:opacity-100 hover:bg-[rgba(255,255,255,0.03)] hover:border-[rgba(255,255,255,0.15)] cursor-pointer",
								i,
							),
							children: [
								p.jsx(Kl, { className: "pointer-events-none opacity-80 flex-shrink-0 size-3" }),
								p.jsx("span", { className: "truncate", children: M }),
							],
						}),
						p.jsx(yn, {
							align: l,
							sideOffset: d,
							container: E,
							className: X("p-0 overflow-hidden", s),
							children: p.jsxs("div", {
								className: "flex flex-col w-full",
								children: [
									p.jsxs("div", {
										className: "relative p-2 border-b border-vscode-dropdown-border",
										children: [
											p.jsx("input", {
												"aria-label": "Search",
												ref: C,
												value: w,
												onChange: (P) => b(P.target.value),
												placeholder: x("common:ui.search_placeholder"),
												className:
													"w-full h-8 px-2 py-1 text-xs bg-vscode-input-background text-vscode-input-foreground border border-vscode-input-border rounded focus:outline-0",
											}),
											w.length > 0 &&
												p.jsx("div", {
													className:
														"absolute right-4 top-0 bottom-0 flex items-center justify-center",
													children: p.jsx(fl, {
														className:
															"text-vscode-input-foreground opacity-50 hover:opacity-100 size-4 p-0.5 cursor-pointer",
														onClick: _,
													}),
												}),
										],
									}),
									p.jsx("div", {
										className: "max-h-[300px] overflow-y-auto",
										children:
											z.length === 0 && w
												? p.jsx("div", {
														className: "py-2 px-3 text-sm text-vscode-foreground/70",
														children: "No results found",
													})
												: p.jsx("div", {
														className: "py-1",
														children: z.map((P, O) => {
															if (P.type === "separator")
																return p.jsx(
																	"div",
																	{
																		className:
																			"mx-1 my-1 h-px bg-vscode-dropdown-foreground/10",
																		"data-testid": "dropdown-separator",
																	},
																	`sep-${O}`,
																)
															if (
																P.type === "shortcut" ||
																(P.disabled && f && P.label.includes(f))
															)
																return p.jsx(
																	"div",
																	{
																		className: "px-3 py-1.5 text-sm opacity-50",
																		children: P.label,
																	},
																	`label-${O}`,
																)
															const j = `item-${P.value || P.label || O}`
															return p.jsx(
																"div",
																{
																	onClick: () => !P.disabled && K(P.value),
																	className: X(
																		"px-3 py-1.5 text-sm cursor-pointer flex items-center",
																		P.disabled
																			? "opacity-50 cursor-not-allowed"
																			: "hover:bg-vscode-list-hoverBackground",
																		P.value === e
																			? "bg-vscode-list-activeSelectionBackground text-vscode-list-activeSelectionForeground"
																			: "",
																		c,
																	),
																	"data-testid": "dropdown-item",
																	children: m
																		? m(P)
																		: p.jsxs(p.Fragment, {
																				children: [
																					p.jsx("span", {
																						children: P.label,
																					}),
																					P.value === e &&
																						p.jsx(Vo, {
																							className:
																								"ml-auto size-4 p-0.5",
																						}),
																				],
																			}),
																},
																j,
															)
														}),
													}),
									}),
								],
							}),
						}),
					],
				})
			},
		),
	)
Ss.displayName = "SelectDropdown"
Ss.__docgenInfo = {
	description: "",
	methods: [],
	displayName: "SelectDropdown",
	props: {
		value: { required: !0, tsType: { name: "string" }, description: "" },
		options: {
			required: !0,
			tsType: { name: "Array", elements: [{ name: "DropdownOption" }], raw: "DropdownOption[]" },
			description: "",
		},
		onChange: {
			required: !0,
			tsType: {
				name: "signature",
				type: "function",
				raw: "(value: string) => void",
				signature: { arguments: [{ type: { name: "string" }, name: "value" }], return: { name: "void" } },
			},
			description: "",
		},
		disabled: {
			required: !1,
			tsType: { name: "boolean" },
			description: "",
			defaultValue: { value: "false", computed: !1 },
		},
		title: {
			required: !1,
			tsType: { name: "string" },
			description: "",
			defaultValue: { value: '""', computed: !1 },
		},
		triggerClassName: {
			required: !1,
			tsType: { name: "string" },
			description: "",
			defaultValue: { value: '""', computed: !1 },
		},
		contentClassName: {
			required: !1,
			tsType: { name: "string" },
			description: "",
			defaultValue: { value: '""', computed: !1 },
		},
		itemClassName: {
			required: !1,
			tsType: { name: "string" },
			description: "",
			defaultValue: { value: '""', computed: !1 },
		},
		sideOffset: {
			required: !1,
			tsType: { name: "number" },
			description: "",
			defaultValue: { value: "4", computed: !1 },
		},
		align: {
			required: !1,
			tsType: {
				name: "union",
				raw: '"start" | "center" | "end"',
				elements: [
					{ name: "literal", value: '"start"' },
					{ name: "literal", value: '"center"' },
					{ name: "literal", value: '"end"' },
				],
			},
			description: "",
			defaultValue: { value: '"start"', computed: !1 },
		},
		placeholder: {
			required: !1,
			tsType: { name: "string" },
			description: "",
			defaultValue: { value: '""', computed: !1 },
		},
		shortcutText: {
			required: !1,
			tsType: { name: "string" },
			description: "",
			defaultValue: { value: '""', computed: !1 },
		},
		renderItem: {
			required: !1,
			tsType: {
				name: "signature",
				type: "function",
				raw: "(option: DropdownOption) => React.ReactNode",
				signature: {
					arguments: [{ type: { name: "DropdownOption" }, name: "option" }],
					return: { name: "ReactReactNode", raw: "React.ReactNode" },
				},
			},
			description: "",
		},
	},
}
var dm = Object.freeze({
		position: "absolute",
		border: 0,
		width: 1,
		height: 1,
		padding: 0,
		margin: -1,
		overflow: "hidden",
		clip: "rect(0, 0, 0, 0)",
		whiteSpace: "nowrap",
		wordWrap: "normal",
	}),
	fm = "VisuallyHidden",
	Ps = a.forwardRef((e, t) => p.jsx(H.span, { ...e, ref: t, style: { ...dm, ...e.style } }))
Ps.displayName = fm
var pm = Ps
const Ms = a.forwardRef(({ className: e, ...t }, r) =>
	p.jsx("textarea", {
		className: X(
			"flex min-h-[60px] w-full rounded-lg px-3 py-2 text-base placeholder:text-muted-foreground focus:outline-0 focus-visible:outline-none focus-visible:border-vscode-focusBorder disabled:cursor-not-allowed disabled:opacity-50",
			"border border-[var(--vscode-input-border,var(--vscode-input-background))] focus-visible:border-vscode-focusBorder",
			"bg-vscode-input-background",
			"text-vscode-input-foreground",
			e,
		),
		ref: r,
		...t,
	}),
)
Ms.displayName = "Textarea"
Ms.__docgenInfo = { description: "", methods: [], displayName: "Textarea" }
var [ur, ih] = ue("Tooltip", [rt]),
	Mn = rt(),
	mm = "TooltipProvider",
	ao = "tooltip.open",
	[ah, As] = ur(mm),
	_s = "Tooltip",
	[sh, St] = ur(_s),
	Vr = "TooltipTrigger",
	hm = a.forwardRef((e, t) => {
		const { __scopeTooltip: r, ...n } = e,
			o = St(Vr, r),
			i = As(Vr, r),
			s = Mn(r),
			c = a.useRef(null),
			d = q(t, c, o.onTriggerChange),
			l = a.useRef(!1),
			u = a.useRef(!1),
			f = a.useCallback(() => (l.current = !1), [])
		return (
			a.useEffect(() => () => document.removeEventListener("pointerup", f), [f]),
			p.jsx(or, {
				asChild: !0,
				...s,
				children: p.jsx(H.button, {
					"aria-describedby": o.open ? o.contentId : void 0,
					"data-state": o.stateAttribute,
					...n,
					ref: d,
					onPointerMove: L(e.onPointerMove, (m) => {
						m.pointerType !== "touch" &&
							!u.current &&
							!i.isPointerInTransitRef.current &&
							(o.onTriggerEnter(), (u.current = !0))
					}),
					onPointerLeave: L(e.onPointerLeave, () => {
						o.onTriggerLeave(), (u.current = !1)
					}),
					onPointerDown: L(e.onPointerDown, () => {
						o.open && o.onClose(), (l.current = !0), document.addEventListener("pointerup", f, { once: !0 })
					}),
					onFocus: L(e.onFocus, () => {
						l.current || o.onOpen()
					}),
					onBlur: L(e.onBlur, o.onClose),
					onClick: L(e.onClick, o.onClose),
				}),
			})
		)
	})
hm.displayName = Vr
var An = "TooltipPortal",
	[gm, vm] = ur(An, { forceMount: void 0 }),
	Ns = (e) => {
		const { __scopeTooltip: t, forceMount: r, children: n, container: o } = e,
			i = St(An, t)
		return p.jsx(gm, {
			scope: t,
			forceMount: r,
			children: p.jsx(ae, {
				present: r || i.open,
				children: p.jsx(vt, { asChild: !0, container: o, children: n }),
			}),
		})
	}
Ns.displayName = An
var Qe = "TooltipContent",
	Is = a.forwardRef((e, t) => {
		const r = vm(Qe, e.__scopeTooltip),
			{ forceMount: n = r.forceMount, side: o = "top", ...i } = e,
			s = St(Qe, e.__scopeTooltip)
		return p.jsx(ae, {
			present: n || s.open,
			children: s.disableHoverableContent
				? p.jsx(Os, { side: o, ...i, ref: t })
				: p.jsx(xm, { side: o, ...i, ref: t }),
		})
	}),
	xm = a.forwardRef((e, t) => {
		const r = St(Qe, e.__scopeTooltip),
			n = As(Qe, e.__scopeTooltip),
			o = a.useRef(null),
			i = q(t, o),
			[s, c] = a.useState(null),
			{ trigger: d, onClose: l } = r,
			u = o.current,
			{ onPointerInTransitChange: f } = n,
			m = a.useCallback(() => {
				c(null), f(!1)
			}, [f]),
			g = a.useCallback(
				(x, h) => {
					const v = x.currentTarget,
						w = { x: x.clientX, y: x.clientY },
						b = Em(w, v.getBoundingClientRect()),
						C = Rm(w, b),
						E = Sm(h.getBoundingClientRect()),
						R = Mm([...C, ...E])
					c(R), f(!0)
				},
				[f],
			)
		return (
			a.useEffect(() => () => m(), [m]),
			a.useEffect(() => {
				if (d && u) {
					const x = (v) => g(v, u),
						h = (v) => g(v, d)
					return (
						d.addEventListener("pointerleave", x),
						u.addEventListener("pointerleave", h),
						() => {
							d.removeEventListener("pointerleave", x), u.removeEventListener("pointerleave", h)
						}
					)
				}
			}, [d, u, g, m]),
			a.useEffect(() => {
				if (s) {
					const x = (h) => {
						const v = h.target,
							w = { x: h.clientX, y: h.clientY },
							b = (d == null ? void 0 : d.contains(v)) || (u == null ? void 0 : u.contains(v)),
							C = !Pm(w, s)
						b ? m() : C && (m(), l())
					}
					return (
						document.addEventListener("pointermove", x),
						() => document.removeEventListener("pointermove", x)
					)
				}
			}, [d, u, s, l, m]),
			p.jsx(Os, { ...e, ref: i })
		)
	}),
	[wm, ym] = ur(_s, { isInside: !1 }),
	bm = js("TooltipContent"),
	Os = a.forwardRef((e, t) => {
		const {
				__scopeTooltip: r,
				children: n,
				"aria-label": o,
				onEscapeKeyDown: i,
				onPointerDownOutside: s,
				...c
			} = e,
			d = St(Qe, r),
			l = Mn(r),
			{ onClose: u } = d
		return (
			a.useEffect(() => (document.addEventListener(ao, u), () => document.removeEventListener(ao, u)), [u]),
			a.useEffect(() => {
				if (d.trigger) {
					const f = (m) => {
						const g = m.target
						g != null && g.contains(d.trigger) && u()
					}
					return (
						window.addEventListener("scroll", f, { capture: !0 }),
						() => window.removeEventListener("scroll", f, { capture: !0 })
					)
				}
			}, [d.trigger, u]),
			p.jsx(gt, {
				asChild: !0,
				disableOutsidePointerEvents: !1,
				onEscapeKeyDown: i,
				onPointerDownOutside: s,
				onFocusOutside: (f) => f.preventDefault(),
				onDismiss: u,
				children: p.jsxs(un, {
					"data-state": d.stateAttribute,
					...l,
					...c,
					ref: t,
					style: {
						...c.style,
						"--radix-tooltip-content-transform-origin": "var(--radix-popper-transform-origin)",
						"--radix-tooltip-content-available-width": "var(--radix-popper-available-width)",
						"--radix-tooltip-content-available-height": "var(--radix-popper-available-height)",
						"--radix-tooltip-trigger-width": "var(--radix-popper-anchor-width)",
						"--radix-tooltip-trigger-height": "var(--radix-popper-anchor-height)",
					},
					children: [
						p.jsx(bm, { children: n }),
						p.jsx(wm, {
							scope: r,
							isInside: !0,
							children: p.jsx(pm, { id: d.contentId, role: "tooltip", children: o || n }),
						}),
					],
				}),
			})
		)
	})
Is.displayName = Qe
var Ts = "TooltipArrow",
	Cm = a.forwardRef((e, t) => {
		const { __scopeTooltip: r, ...n } = e,
			o = Mn(r)
		return ym(Ts, r).isInside ? null : p.jsx(dn, { ...o, ...n, ref: t })
	})
Cm.displayName = Ts
function Em(e, t) {
	const r = Math.abs(t.top - e.y),
		n = Math.abs(t.bottom - e.y),
		o = Math.abs(t.right - e.x),
		i = Math.abs(t.left - e.x)
	switch (Math.min(r, n, o, i)) {
		case i:
			return "left"
		case o:
			return "right"
		case r:
			return "top"
		case n:
			return "bottom"
		default:
			throw new Error("unreachable")
	}
}
function Rm(e, t, r = 5) {
	const n = []
	switch (t) {
		case "top":
			n.push({ x: e.x - r, y: e.y + r }, { x: e.x + r, y: e.y + r })
			break
		case "bottom":
			n.push({ x: e.x - r, y: e.y - r }, { x: e.x + r, y: e.y - r })
			break
		case "left":
			n.push({ x: e.x + r, y: e.y - r }, { x: e.x + r, y: e.y + r })
			break
		case "right":
			n.push({ x: e.x - r, y: e.y - r }, { x: e.x - r, y: e.y + r })
			break
	}
	return n
}
function Sm(e) {
	const { top: t, right: r, bottom: n, left: o } = e
	return [
		{ x: o, y: t },
		{ x: r, y: t },
		{ x: r, y: n },
		{ x: o, y: n },
	]
}
function Pm(e, t) {
	const { x: r, y: n } = e
	let o = !1
	for (let i = 0, s = t.length - 1; i < t.length; s = i++) {
		const c = t[i],
			d = t[s],
			l = c.x,
			u = c.y,
			f = d.x,
			m = d.y
		u > n != m > n && r < ((f - l) * (n - u)) / (m - u) + l && (o = !o)
	}
	return o
}
function Mm(e) {
	const t = e.slice()
	return t.sort((r, n) => (r.x < n.x ? -1 : r.x > n.x ? 1 : r.y < n.y ? -1 : r.y > n.y ? 1 : 0)), Am(t)
}
function Am(e) {
	if (e.length <= 1) return e.slice()
	const t = []
	for (let n = 0; n < e.length; n++) {
		const o = e[n]
		for (; t.length >= 2; ) {
			const i = t[t.length - 1],
				s = t[t.length - 2]
			if ((i.x - s.x) * (o.y - s.y) >= (i.y - s.y) * (o.x - s.x)) t.pop()
			else break
		}
		t.push(o)
	}
	t.pop()
	const r = []
	for (let n = e.length - 1; n >= 0; n--) {
		const o = e[n]
		for (; r.length >= 2; ) {
			const i = r[r.length - 1],
				s = r[r.length - 2]
			if ((i.x - s.x) * (o.y - s.y) >= (i.y - s.y) * (o.x - s.x)) r.pop()
			else break
		}
		r.push(o)
	}
	return r.pop(), t.length === 1 && r.length === 1 && t[0].x === r[0].x && t[0].y === r[0].y ? t : t.concat(r)
}
var _m = Ns,
	Ds = Is
const ks = a.forwardRef(({ className: e, sideOffset: t = 4, ...r }, n) =>
	p.jsx(_m, {
		children: p.jsx(Ds, {
			ref: n,
			sideOffset: t,
			className: X(
				"z-50 overflow-hidden rounded-lg bg-vscode-notifications-background border border-vscode-notifications-border px-3 py-1.5 text-xs text-vscode-notifications-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
				e,
			),
			...r,
		}),
	}),
)
ks.displayName = Ds.displayName
ks.__docgenInfo = {
	description: "",
	methods: [],
	props: { sideOffset: { defaultValue: { value: "4", computed: !1 }, required: !1 } },
}
export {
	Wm as A,
	il as B,
	zm as C,
	Jm as D,
	Um as H,
	Gf as P,
	fs as S,
	Ym as T,
	Yf as a,
	yn as b,
	Qo as c,
	Jo as d,
	ei as e,
	ti as f,
	ri as g,
	oi as h,
	Wl as i,
	eh as j,
	Ca as k,
	Pa as l,
	Ma as m,
	th as n,
	Ea as o,
	Aa as p,
	Vm as q,
	$m as r,
	Bm as s,
	Hm as t,
	qm as u,
	Zm as v,
	Wa as w,
	Km as x,
	Za as y,
	Gm as z,
}
