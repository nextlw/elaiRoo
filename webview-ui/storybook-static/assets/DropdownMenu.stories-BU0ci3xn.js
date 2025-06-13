import { j as n } from "./jsx-runtime-ClZEHPQQ.js"
import {
	D as a,
	j as M,
	H as f,
	k as w,
	l as B,
	m as V,
	n as T,
	o as r,
	p as v,
	q as b,
	r as L,
	s as A,
	t as C,
	T as S,
	u as R,
	v as z,
} from "./tooltip-BZ0lSD2s.js"
import { B as g } from "./createLucideIcon-B4nlfPec.js"
import "./autosize-textarea-69dnNYfc.js"
import "./index-Cqyox1Tj.js"
import "./utils-CytzSlOG.js"
import "./index-C2TgfdXk.js"
import "./index-D-LGQApf.js"
const y = { title: "primitives/DropdownMenu", component: a, parameters: { layout: "centered" }, tags: ["autodocs"] },
	o = {
		name: "DropdownMenu",
		render: () =>
			n.jsxs(a, {
				children: [
					n.jsx(M, {
						asChild: !0,
						children: n.jsx(g, { variant: "ghost", size: "icon", children: n.jsx(f, {}) }),
					}),
					n.jsxs(w, {
						children: [
							n.jsx(B, { children: "Label" }),
							n.jsx(V, {}),
							n.jsxs(T, {
								children: [
									n.jsx(r, { children: "Item 1" }),
									n.jsxs(r, { children: ["Item 2", n.jsx(v, { children: "⌘2" })] }),
								],
							}),
						],
					}),
				],
			}),
	},
	e = ({ side: h = "bottom", align: j = "center", children: I }) =>
		n.jsxs(a, {
			children: [
				n.jsx(M, { asChild: !0, children: n.jsx(g, { variant: "ghost", size: "icon", children: I }) }),
				n.jsxs(w, {
					side: h,
					align: j,
					children: [
						n.jsx(r, { children: "Foo" }),
						n.jsx(r, { children: "Bar" }),
						n.jsx(r, { children: "Baz" }),
					],
				}),
			],
		}),
	t = {
		render: () =>
			n.jsxs("div", {
				className: "flex gap-2",
				children: [
					n.jsx(e, { side: "top", children: n.jsx(b, {}) }),
					n.jsx(e, { side: "bottom", children: n.jsx(L, {}) }),
					n.jsx(e, { side: "left", children: n.jsx(A, {}) }),
					n.jsx(e, { side: "right", children: n.jsx(C, {}) }),
				],
			}),
	},
	s = {
		render: () =>
			n.jsxs("div", {
				className: "flex gap-2",
				children: [
					n.jsx(e, { align: "center", children: n.jsx(S, {}) }),
					n.jsx(e, { align: "end", children: n.jsx(R, {}) }),
					n.jsx(e, { align: "start", children: n.jsx(z, {}) }),
				],
			}),
	}
var d, i, p
o.parameters = {
	...o.parameters,
	docs: {
		...((d = o.parameters) == null ? void 0 : d.docs),
		source: {
			originalSource: `{
  name: "DropdownMenu",
  render: () => <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <HamburgerMenuIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Label</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>Item 1</DropdownMenuItem>
                    <DropdownMenuItem>
                        Item 2<DropdownMenuShortcut>⌘2</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
}`,
			...((p = (i = o.parameters) == null ? void 0 : i.docs) == null ? void 0 : p.source),
		},
	},
}
var c, u, l
t.parameters = {
	...t.parameters,
	docs: {
		...((c = t.parameters) == null ? void 0 : c.docs),
		source: {
			originalSource: `{
  render: () => <div className="flex gap-2">
            <DropdownMenuVariant side="top">
                <BorderTopIcon />
            </DropdownMenuVariant>
            <DropdownMenuVariant side="bottom">
                <BorderBottomIcon />
            </DropdownMenuVariant>
            <DropdownMenuVariant side="left">
                <BorderLeftIcon />
            </DropdownMenuVariant>
            <DropdownMenuVariant side="right">
                <BorderRightIcon />
            </DropdownMenuVariant>
        </div>
}`,
			...((l = (u = t.parameters) == null ? void 0 : u.docs) == null ? void 0 : l.source),
		},
	},
}
var m, x, D
s.parameters = {
	...s.parameters,
	docs: {
		...((m = s.parameters) == null ? void 0 : m.docs),
		source: {
			originalSource: `{
  render: () => <div className="flex gap-2">
            <DropdownMenuVariant align="center">
                <TextAlignCenterIcon />
            </DropdownMenuVariant>
            <DropdownMenuVariant align="end">
                <TextAlignRightIcon />
            </DropdownMenuVariant>
            <DropdownMenuVariant align="start">
                <TextAlignLeftIcon />
            </DropdownMenuVariant>
        </div>
}`,
			...((D = (x = s.parameters) == null ? void 0 : x.docs) == null ? void 0 : D.source),
		},
	},
}
const F = ["Default", "Placements", "Alignments"]
export { s as Alignments, o as Default, t as Placements, F as __namedExportsOrder, y as default }
