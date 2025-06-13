import { r as i, b as E } from "./index-Cqyox1Tj.js"
import { j as g } from "./jsx-runtime-ClZEHPQQ.js"
import { r as j } from "./index-C2TgfdXk.js"
import { a as M, c as $ } from "./utils-CytzSlOG.js"
function ue(e, t) {
	const n = i.createContext(t),
		o = (s) => {
			const { children: a, ...c } = s,
				l = i.useMemo(() => c, Object.values(c))
			return g.jsx(n.Provider, { value: l, children: a })
		}
	o.displayName = e + "Provider"
	function r(s) {
		const a = i.useContext(n)
		if (a) return a
		if (t !== void 0) return t
		throw new Error(`\`${s}\` must be used within \`${e}\``)
	}
	return [o, r]
}
function le(e, t = []) {
	let n = []
	function o(s, a) {
		const c = i.createContext(a),
			l = n.length
		n = [...n, a]
		const u = (f) => {
			var C
			const { scope: m, children: p, ...v } = f,
				b = ((C = m == null ? void 0 : m[e]) == null ? void 0 : C[l]) || c,
				h = i.useMemo(() => v, Object.values(v))
			return g.jsx(b.Provider, { value: h, children: p })
		}
		u.displayName = s + "Provider"
		function d(f, m) {
			var b
			const p = ((b = m == null ? void 0 : m[e]) == null ? void 0 : b[l]) || c,
				v = i.useContext(p)
			if (v) return v
			if (a !== void 0) return a
			throw new Error(`\`${f}\` must be used within \`${s}\``)
		}
		return [u, d]
	}
	const r = () => {
		const s = n.map((a) => i.createContext(a))
		return function (c) {
			const l = (c == null ? void 0 : c[e]) || s
			return i.useMemo(() => ({ [`__scope${e}`]: { ...c, [e]: l } }), [c, l])
		}
	}
	return (r.scopeName = e), [o, T(r, ...t)]
}
function T(...e) {
	const t = e[0]
	if (e.length === 1) return t
	const n = () => {
		const o = e.map((r) => ({ useScope: r(), scopeName: r.scopeName }))
		return function (s) {
			const a = o.reduce((c, { useScope: l, scopeName: u }) => {
				const f = l(s)[`__scope${u}`]
				return { ...c, ...f }
			}, {})
			return i.useMemo(() => ({ [`__scope${t.scopeName}`]: a }), [a])
		}
	}
	return (n.scopeName = t.scopeName), n
}
function N(e, t) {
	if (typeof e == "function") return e(t)
	e != null && (e.current = t)
}
function V(...e) {
	return (t) => {
		let n = !1
		const o = e.map((r) => {
			const s = N(r, t)
			return !n && typeof s == "function" && (n = !0), s
		})
		if (n)
			return () => {
				for (let r = 0; r < o.length; r++) {
					const s = o[r]
					typeof s == "function" ? s() : N(e[r], null)
				}
			}
	}
}
function A(...e) {
	return i.useCallback(V(...e), e)
}
function de(e, t, { checkForDefaultPrevented: n = !0 } = {}) {
	return function (r) {
		if ((e == null || e(r), n === !1 || !r.defaultPrevented)) return t == null ? void 0 : t(r)
	}
}
var x = globalThis != null && globalThis.document ? i.useLayoutEffect : () => {},
	k = E[" useId ".trim().toString()] || (() => {}),
	U = 0
function fe(e) {
	const [t, n] = i.useState(k())
	return (
		x(() => {
			n((o) => o ?? String(U++))
		}, [e]),
		e || (t ? `radix-${t}` : "")
	)
}
var L = E[" useInsertionEffect ".trim().toString()] || x
function me({ prop: e, defaultProp: t, onChange: n = () => {}, caller: o }) {
	const [r, s, a] = W({ defaultProp: t, onChange: n }),
		c = e !== void 0,
		l = c ? e : r
	{
		const d = i.useRef(e !== void 0)
		i.useEffect(() => {
			const f = d.current
			f !== c &&
				console.warn(
					`${o} is changing from ${f ? "controlled" : "uncontrolled"} to ${c ? "controlled" : "uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`,
				),
				(d.current = c)
		}, [c, o])
	}
	const u = i.useCallback(
		(d) => {
			var f
			if (c) {
				const m = D(d) ? d(e) : d
				m !== e && ((f = a.current) == null || f.call(a, m))
			} else s(d)
		},
		[c, e, s, a],
	)
	return [l, u]
}
function W({ defaultProp: e, onChange: t }) {
	const [n, o] = i.useState(e),
		r = i.useRef(n),
		s = i.useRef(t)
	return (
		L(() => {
			s.current = t
		}, [t]),
		i.useEffect(() => {
			var a
			r.current !== n && ((a = s.current) == null || a.call(s, n), (r.current = n))
		}, [n, r]),
		[n, o, s]
	)
}
function D(e) {
	return typeof e == "function"
}
function R(e) {
	const t = F(e),
		n = i.forwardRef((o, r) => {
			const { children: s, ...a } = o,
				c = i.Children.toArray(s),
				l = c.find(Z)
			if (l) {
				const u = l.props.children,
					d = c.map((f) =>
						f === l
							? i.Children.count(u) > 1
								? i.Children.only(null)
								: i.isValidElement(u)
									? u.props.children
									: null
							: f,
					)
				return g.jsx(t, { ...a, ref: r, children: i.isValidElement(u) ? i.cloneElement(u, void 0, d) : null })
			}
			return g.jsx(t, { ...a, ref: r, children: s })
		})
	return (n.displayName = `${e}.Slot`), n
}
var B = R("Slot")
function F(e) {
	const t = i.forwardRef((n, o) => {
		const { children: r, ...s } = n,
			a = i.isValidElement(r) ? K(r) : void 0,
			c = A(a, o)
		if (i.isValidElement(r)) {
			const l = z(s, r.props)
			return r.type !== i.Fragment && (l.ref = c), i.cloneElement(r, l)
		}
		return i.Children.count(r) > 1 ? i.Children.only(null) : null
	})
	return (t.displayName = `${e}.SlotClone`), t
}
var O = Symbol("radix.slottable")
function pe(e) {
	const t = ({ children: n }) => g.jsx(g.Fragment, { children: n })
	return (t.displayName = `${e}.Slottable`), (t.__radixId = O), t
}
function Z(e) {
	return i.isValidElement(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === O
}
function z(e, t) {
	const n = { ...t }
	for (const o in t) {
		const r = e[o],
			s = t[o]
		;/^on[A-Z]/.test(o)
			? r && s
				? (n[o] = (...c) => {
						const l = s(...c)
						return r(...c), l
					})
				: r && (n[o] = r)
			: o === "style"
				? (n[o] = { ...r, ...s })
				: o === "className" && (n[o] = [r, s].filter(Boolean).join(" "))
	}
	return { ...e, ...n }
}
function K(e) {
	var o, r
	let t = (o = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : o.get,
		n = t && "isReactWarning" in t && t.isReactWarning
	return n
		? e.ref
		: ((t = (r = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : r.get),
			(n = t && "isReactWarning" in t && t.isReactWarning),
			n ? e.props.ref : e.props.ref || e.ref)
}
var q = [
		"a",
		"button",
		"div",
		"form",
		"h2",
		"h3",
		"img",
		"input",
		"label",
		"li",
		"nav",
		"ol",
		"p",
		"select",
		"span",
		"svg",
		"ul",
	],
	ve = q.reduce((e, t) => {
		const n = R(`Primitive.${t}`),
			o = i.forwardRef((r, s) => {
				const { asChild: a, ...c } = r,
					l = a ? n : t
				return typeof window < "u" && (window[Symbol.for("radix-ui")] = !0), g.jsx(l, { ...c, ref: s })
			})
		return (o.displayName = `Primitive.${t}`), { ...e, [t]: o }
	}, {})
function be(e, t) {
	e && j.flushSync(() => e.dispatchEvent(t))
}
function G(e, t) {
	return i.useReducer((n, o) => t[n][o] ?? n, e)
}
var J = (e) => {
	const { present: t, children: n } = e,
		o = Q(t),
		r = typeof n == "function" ? n({ present: o.isPresent }) : i.Children.only(n),
		s = A(o.ref, X(r))
	return typeof n == "function" || o.isPresent ? i.cloneElement(r, { ref: s }) : null
}
J.displayName = "Presence"
function Q(e) {
	const [t, n] = i.useState(),
		o = i.useRef(null),
		r = i.useRef(e),
		s = i.useRef("none"),
		a = e ? "mounted" : "unmounted",
		[c, l] = G(a, {
			mounted: { UNMOUNT: "unmounted", ANIMATION_OUT: "unmountSuspended" },
			unmountSuspended: { MOUNT: "mounted", ANIMATION_END: "unmounted" },
			unmounted: { MOUNT: "mounted" },
		})
	return (
		i.useEffect(() => {
			const u = y(o.current)
			s.current = c === "mounted" ? u : "none"
		}, [c]),
		x(() => {
			const u = o.current,
				d = r.current
			if (d !== e) {
				const m = s.current,
					p = y(u)
				e
					? l("MOUNT")
					: p === "none" || (u == null ? void 0 : u.display) === "none"
						? l("UNMOUNT")
						: l(d && m !== p ? "ANIMATION_OUT" : "UNMOUNT"),
					(r.current = e)
			}
		}, [e, l]),
		x(() => {
			if (t) {
				let u
				const d = t.ownerDocument.defaultView ?? window,
					f = (p) => {
						const b = y(o.current).includes(p.animationName)
						if (p.target === t && b && (l("ANIMATION_END"), !r.current)) {
							const h = t.style.animationFillMode
							;(t.style.animationFillMode = "forwards"),
								(u = d.setTimeout(() => {
									t.style.animationFillMode === "forwards" && (t.style.animationFillMode = h)
								}))
						}
					},
					m = (p) => {
						p.target === t && (s.current = y(o.current))
					}
				return (
					t.addEventListener("animationstart", m),
					t.addEventListener("animationcancel", f),
					t.addEventListener("animationend", f),
					() => {
						d.clearTimeout(u),
							t.removeEventListener("animationstart", m),
							t.removeEventListener("animationcancel", f),
							t.removeEventListener("animationend", f)
					}
				)
			} else l("ANIMATION_END")
		}, [t, l]),
		{
			isPresent: ["mounted", "unmountSuspended"].includes(c),
			ref: i.useCallback((u) => {
				;(o.current = u ? getComputedStyle(u) : null), n(u)
			}, []),
		}
	)
}
function y(e) {
	return (e == null ? void 0 : e.animationName) || "none"
}
function X(e) {
	var o, r
	let t = (o = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : o.get,
		n = t && "isReactWarning" in t && t.isReactWarning
	return n
		? e.ref
		: ((t = (r = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : r.get),
			(n = t && "isReactWarning" in t && t.isReactWarning),
			n ? e.props.ref : e.props.ref || e.ref)
}
const w = (e) => (typeof e == "boolean" ? `${e}` : e === 0 ? "0" : e),
	S = M,
	Y = (e, t) => (n) => {
		var o
		if ((t == null ? void 0 : t.variants) == null)
			return S(e, n == null ? void 0 : n.class, n == null ? void 0 : n.className)
		const { variants: r, defaultVariants: s } = t,
			a = Object.keys(r).map((u) => {
				const d = n == null ? void 0 : n[u],
					f = s == null ? void 0 : s[u]
				if (d === null) return null
				const m = w(d) || w(f)
				return r[u][m]
			}),
			c =
				n &&
				Object.entries(n).reduce((u, d) => {
					let [f, m] = d
					return m === void 0 || (u[f] = m), u
				}, {}),
			l =
				t == null || (o = t.compoundVariants) === null || o === void 0
					? void 0
					: o.reduce((u, d) => {
							let { class: f, className: m, ...p } = d
							return Object.entries(p).every((v) => {
								let [b, h] = v
								return Array.isArray(h) ? h.includes({ ...s, ...c }[b]) : { ...s, ...c }[b] === h
							})
								? [...u, f, m]
								: u
						}, [])
		return S(e, a, l, n == null ? void 0 : n.class, n == null ? void 0 : n.className)
	},
	H = Y(
		"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer active:opacity-80",
		{
			variants: {
				variant: {
					default: "border border-vscode-input-border bg-primary text-primary-foreground hover:bg-primary/90",
					destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
					outline:
						"border border-vscode-input-border bg-transparent hover:bg-accent hover:text-accent-foreground",
					secondary:
						"border border-vscode-input-border bg-secondary text-secondary-foreground hover:bg-secondary/80",
					ghost: "bg-transparent hover:bg-accent hover:text-accent-foreground",
					link: "text-primary underline-offset-4 hover:underline",
					combobox:
						"border border-vscode-dropdown-border focus-visible:border-vscode-focusBorder bg-vscode-dropdown-background hover:bg-transparent text-vscode-dropdown-foreground font-normal",
				},
				size: { default: "h-7 px-3", sm: "h-6 px-2 text-sm", lg: "h-8 px-4 text-lg", icon: "h-7 w-7" },
			},
			defaultVariants: { variant: "default", size: "default" },
		},
	),
	_ = i.forwardRef(({ className: e, variant: t, size: n, asChild: o = !1, ...r }, s) => {
		const a = o ? B : "button"
		return g.jsx(a, { className: $(H({ variant: t, size: n, className: e })), ref: s, ...r })
	})
_.displayName = "Button"
_.__docgenInfo = {
	description: "",
	methods: [],
	displayName: "Button",
	props: {
		asChild: {
			required: !1,
			tsType: { name: "boolean" },
			description: "",
			defaultValue: { value: "false", computed: !1 },
		},
	},
	composes: ["VariantProps"],
}
/**
 * @license lucide-react v0.513.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const ee = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(),
	te = (e) => e.replace(/^([A-Z])|[\s-_]+(\w)/g, (t, n, o) => (o ? o.toUpperCase() : n.toLowerCase())),
	P = (e) => {
		const t = te(e)
		return t.charAt(0).toUpperCase() + t.slice(1)
	},
	I = (...e) =>
		e
			.filter((t, n, o) => !!t && t.trim() !== "" && o.indexOf(t) === n)
			.join(" ")
			.trim(),
	ne = (e) => {
		for (const t in e) if (t.startsWith("aria-") || t === "role" || t === "title") return !0
	}
/**
 * @license lucide-react v0.513.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var re = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 24,
	height: 24,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 2,
	strokeLinecap: "round",
	strokeLinejoin: "round",
}
/**
 * @license lucide-react v0.513.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const oe = i.forwardRef(
	(
		{
			color: e = "currentColor",
			size: t = 24,
			strokeWidth: n = 2,
			absoluteStrokeWidth: o,
			className: r = "",
			children: s,
			iconNode: a,
			...c
		},
		l,
	) =>
		i.createElement(
			"svg",
			{
				ref: l,
				...re,
				width: t,
				height: t,
				stroke: e,
				strokeWidth: o ? (Number(n) * 24) / Number(t) : n,
				className: I("lucide", r),
				...(!s && !ne(c) && { "aria-hidden": "true" }),
				...c,
			},
			[...a.map(([u, d]) => i.createElement(u, d)), ...(Array.isArray(s) ? s : [s])],
		),
)
/**
 * @license lucide-react v0.513.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const ge = (e, t) => {
	const n = i.forwardRef(({ className: o, ...r }, s) =>
		i.createElement(oe, { ref: s, iconNode: t, className: I(`lucide-${ee(P(e))}`, `lucide-${e}`, o), ...r }),
	)
	return (n.displayName = P(e)), n
}
export {
	_ as B,
	ve as P,
	le as a,
	fe as b,
	ge as c,
	de as d,
	J as e,
	A as f,
	x as g,
	be as h,
	R as i,
	ue as j,
	Y as k,
	V as l,
	pe as m,
	me as u,
}
