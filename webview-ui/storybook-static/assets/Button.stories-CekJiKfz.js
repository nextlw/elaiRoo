import "./jsx-runtime-ClZEHPQQ.js"
import { B as L } from "./createLucideIcon-B4nlfPec.js"
import "./autosize-textarea-69dnNYfc.js"
import "./tooltip-BZ0lSD2s.js"
import "./index-Cqyox1Tj.js"
import "./index-C2TgfdXk.js"
import "./index-D-LGQApf.js"
import "./utils-CytzSlOG.js"
const A = {
		title: "primitives/Button",
		component: L,
		parameters: { layout: "centered" },
		tags: ["autodocs"],
		argTypes: {
			variant: {
				control: "select",
				options: ["default", "secondary", "outline", "ghost", "link", "destructive"],
				type: "string",
				table: { defaultValue: { summary: "default" } },
			},
			size: {
				control: "select",
				options: ["default", "sm", "lg", "icon"],
				type: "string",
				table: { defaultValue: { summary: "default" } },
			},
			children: { table: { disable: !0 } },
			asChild: { table: { disable: !0 } },
		},
		args: { children: "Button" },
	},
	e = { name: "Default" },
	a = { name: "Secondary", args: { variant: "secondary" } },
	r = { name: "Destructive", args: { variant: "destructive" } },
	t = { name: "Outline", args: { variant: "outline" } },
	s = { name: "Ghost", args: { variant: "ghost" } },
	o = { name: "Link", args: { variant: "link" } },
	n = { name: "Combobox", args: { variant: "combobox" } }
var c, i, m
e.parameters = {
	...e.parameters,
	docs: {
		...((c = e.parameters) == null ? void 0 : c.docs),
		source: {
			originalSource: `{
  name: "Default"
}`,
			...((m = (i = e.parameters) == null ? void 0 : i.docs) == null ? void 0 : m.source),
		},
	},
}
var u, d, l
a.parameters = {
	...a.parameters,
	docs: {
		...((u = a.parameters) == null ? void 0 : u.docs),
		source: {
			originalSource: `{
  name: "Secondary",
  args: {
    variant: "secondary"
  }
}`,
			...((l = (d = a.parameters) == null ? void 0 : d.docs) == null ? void 0 : l.source),
		},
	},
}
var p, g, v
r.parameters = {
	...r.parameters,
	docs: {
		...((p = r.parameters) == null ? void 0 : p.docs),
		source: {
			originalSource: `{
  name: "Destructive",
  args: {
    variant: "destructive"
  }
}`,
			...((v = (g = r.parameters) == null ? void 0 : g.docs) == null ? void 0 : v.source),
		},
	},
}
var b, y, f
t.parameters = {
	...t.parameters,
	docs: {
		...((b = t.parameters) == null ? void 0 : b.docs),
		source: {
			originalSource: `{
  name: "Outline",
  args: {
    variant: "outline"
  }
}`,
			...((f = (y = t.parameters) == null ? void 0 : y.docs) == null ? void 0 : f.source),
		},
	},
}
var S, h, x
s.parameters = {
	...s.parameters,
	docs: {
		...((S = s.parameters) == null ? void 0 : S.docs),
		source: {
			originalSource: `{
  name: "Ghost",
  args: {
    variant: "ghost"
  }
}`,
			...((x = (h = s.parameters) == null ? void 0 : h.docs) == null ? void 0 : x.source),
		},
	},
}
var D, k, C
o.parameters = {
	...o.parameters,
	docs: {
		...((D = o.parameters) == null ? void 0 : D.docs),
		source: {
			originalSource: `{
  name: "Link",
  args: {
    variant: "link"
  }
}`,
			...((C = (k = o.parameters) == null ? void 0 : k.docs) == null ? void 0 : C.source),
		},
	},
}
var O, B, G
n.parameters = {
	...n.parameters,
	docs: {
		...((O = n.parameters) == null ? void 0 : O.docs),
		source: {
			originalSource: `{
  name: "Combobox",
  args: {
    variant: "combobox"
  }
}`,
			...((G = (B = n.parameters) == null ? void 0 : B.docs) == null ? void 0 : G.source),
		},
	},
}
const F = ["Default", "Secondary", "Destructive", "Outline", "Ghost", "Link", "Combobox"]
export {
	n as Combobox,
	e as Default,
	r as Destructive,
	s as Ghost,
	o as Link,
	t as Outline,
	a as Secondary,
	F as __namedExportsOrder,
	A as default,
}
