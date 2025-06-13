import { j as e } from "./jsx-runtime-ClZEHPQQ.js"
import { r as n } from "./index-Cqyox1Tj.js"
import {
	P as b,
	a as j,
	C as v,
	b as C,
	c as f,
	d as h,
	e as N,
	f as S,
	g,
	h as y,
	i as w,
} from "./tooltip-BZ0lSD2s.js"
import { c as E } from "./utils-CytzSlOG.js"
import { B as I } from "./createLucideIcon-B4nlfPec.js"
import "./autosize-textarea-69dnNYfc.js"
import "./index-C2TgfdXk.js"
import "./index-D-LGQApf.js"
const G = { title: "primitives/Combobox", component: d, parameters: { layout: "centered" }, tags: ["autodocs"] },
	s = { name: "Combobox", render: () => e.jsx(d, {}) },
	c = [
		{ value: "next.js", label: "Next.js" },
		{ value: "sveltekit", label: "SvelteKit" },
		{ value: "nuxt.js", label: "Nuxt.js" },
		{ value: "remix", label: "Remix" },
		{ value: "astro", label: "Astro" },
	]
function d() {
	var l
	const [t, r] = n.useState(!1),
		[o, u] = n.useState("")
	return e.jsxs(b, {
		open: t,
		onOpenChange: r,
		children: [
			e.jsx(j, {
				asChild: !0,
				children: e.jsxs(I, {
					variant: "combobox",
					role: "combobox",
					"aria-expanded": t,
					className: "w-[200px] justify-between",
					children: [
						o ? ((l = c.find((a) => a.value === o)) == null ? void 0 : l.label) : "Select framework...",
						e.jsx(v, { className: "opacity-50" }),
					],
				}),
			}),
			e.jsx(C, {
				className: "w-[200px] p-0",
				children: e.jsxs(f, {
					children: [
						e.jsx(h, { placeholder: "Search framework...", className: "h-9" }),
						e.jsxs(N, {
							children: [
								e.jsx(S, { children: "No framework found." }),
								e.jsx(g, {
									children: c.map((a) =>
										e.jsxs(
											y,
											{
												value: a.value,
												onSelect: (m) => {
													u(m === o ? "" : m), r(!1)
												},
												children: [
													a.label,
													e.jsx(w, {
														className: E(
															"ml-auto",
															o === a.value ? "opacity-100" : "opacity-0",
														),
													}),
												],
											},
											a.value,
										),
									),
								}),
							],
						}),
					],
				}),
			}),
		],
	})
}
var i, p, x
s.parameters = {
	...s.parameters,
	docs: {
		...((i = s.parameters) == null ? void 0 : i.docs),
		source: {
			originalSource: `{
  name: "Combobox",
  render: () => <Combobox />
}`,
			...((x = (p = s.parameters) == null ? void 0 : p.docs) == null ? void 0 : x.source),
		},
	},
}
const K = ["Default"]
export { s as Default, K as __namedExportsOrder, G as default }
