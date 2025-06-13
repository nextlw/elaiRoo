import { j as n } from "./jsx-runtime-ClZEHPQQ.js"
import { r as t } from "./index-Cqyox1Tj.js"
import {
	c as L,
	u as M,
	a as $,
	b as B,
	P as g,
	d as F,
	e as G,
	f as H,
	g as q,
	B as z,
} from "./createLucideIcon-B4nlfPec.js"
import "./index-C2TgfdXk.js"
import "./index-D-LGQApf.js"
import "./utils-CytzSlOG.js"
/**
 * @license lucide-react v0.513.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const U = [
		["path", { d: "m7 15 5 5 5-5", key: "1hf1tw" }],
		["path", { d: "m7 9 5-5 5 5", key: "sgt6xg" }],
	],
	J = L("chevrons-up-down", U)
var f = "Collapsible",
	[K, re] = $(f),
	[Q, x] = K(f),
	I = t.forwardRef((e, a) => {
		const { __scopeCollapsible: l, open: r, defaultOpen: o, disabled: c, onOpenChange: i, ...C } = e,
			[p, d] = M({ prop: r, defaultProp: o ?? !1, onChange: i, caller: f })
		return n.jsx(Q, {
			scope: l,
			disabled: c,
			contentId: B(),
			open: p,
			onOpenToggle: t.useCallback(() => d((b) => !b), [d]),
			children: n.jsx(g.div, { "data-state": R(p), "data-disabled": c ? "" : void 0, ...C, ref: a }),
		})
	})
I.displayName = f
var S = "CollapsibleTrigger",
	A = t.forwardRef((e, a) => {
		const { __scopeCollapsible: l, ...r } = e,
			o = x(S, l)
		return n.jsx(g.button, {
			type: "button",
			"aria-controls": o.contentId,
			"aria-expanded": o.open || !1,
			"data-state": R(o.open),
			"data-disabled": o.disabled ? "" : void 0,
			disabled: o.disabled,
			...r,
			ref: a,
			onClick: F(e.onClick, o.onOpenToggle),
		})
	})
A.displayName = S
var v = "CollapsibleContent",
	T = t.forwardRef((e, a) => {
		const { forceMount: l, ...r } = e,
			o = x(v, e.__scopeCollapsible)
		return n.jsx(G, { present: l || o.open, children: ({ present: c }) => n.jsx(V, { ...r, ref: a, present: c }) })
	})
T.displayName = v
var V = t.forwardRef((e, a) => {
	const { __scopeCollapsible: l, present: r, children: o, ...c } = e,
		i = x(v, l),
		[C, p] = t.useState(r),
		d = t.useRef(null),
		b = H(a, d),
		y = t.useRef(0),
		N = y.current,
		P = t.useRef(0),
		_ = P.current,
		h = i.open || C,
		j = t.useRef(h),
		u = t.useRef(void 0)
	return (
		t.useEffect(() => {
			const s = requestAnimationFrame(() => (j.current = !1))
			return () => cancelAnimationFrame(s)
		}, []),
		q(() => {
			const s = d.current
			if (s) {
				;(u.current = u.current || {
					transitionDuration: s.style.transitionDuration,
					animationName: s.style.animationName,
				}),
					(s.style.transitionDuration = "0s"),
					(s.style.animationName = "none")
				const E = s.getBoundingClientRect()
				;(y.current = E.height),
					(P.current = E.width),
					j.current ||
						((s.style.transitionDuration = u.current.transitionDuration),
						(s.style.animationName = u.current.animationName)),
					p(r)
			}
		}, [i.open, r]),
		n.jsx(g.div, {
			"data-state": R(i.open),
			"data-disabled": i.disabled ? "" : void 0,
			id: i.contentId,
			hidden: !h,
			...c,
			ref: b,
			style: {
				"--radix-collapsible-content-height": N ? `${N}px` : void 0,
				"--radix-collapsible-content-width": _ ? `${_}px` : void 0,
				...e.style,
			},
			children: h && o,
		})
	)
})
function R(e) {
	return e ? "open" : "closed"
}
var W = I
const k = W,
	X = A,
	Y = T,
	le = { title: "Primitives/Collapsible", component: k, tags: ["autodocs"] },
	m = { render: () => n.jsx(Z, {}) },
	Z = () => {
		const [e, a] = t.useState(!1)
		return n.jsxs(k, {
			open: e,
			onOpenChange: a,
			children: [
				n.jsx(X, {
					asChild: !0,
					children: n.jsxs(z, { variant: "ghost", children: ["Hello", n.jsx(J, { className: "size-4" })] }),
				}),
				n.jsx(Y, { className: "p-2", children: "👋" }),
			],
		})
	}
var O, w, D
m.parameters = {
	...m.parameters,
	docs: {
		...((O = m.parameters) == null ? void 0 : O.docs),
		source: {
			originalSource: `{
  render: () => <CollapsibleDemo />
}`,
			...((D = (w = m.parameters) == null ? void 0 : w.docs) == null ? void 0 : D.source),
		},
	},
}
const ie = ["Default"]
export { m as Default, ie as __namedExportsOrder, le as default }
