import { j as o } from "./jsx-runtime-ClZEHPQQ.js"
import { useMDXComponents as r } from "./index-BLKynSmM.js"
import { M as i } from "./index-DsFKETf1.js"
import "./index-Cqyox1Tj.js"
import "./iframe-BrPxLo_6.js"
import "./index-C2TgfdXk.js"
import "./index-D-LGQApf.js"
import "./index-CXQShRbs.js"
import "./index-DrFu-skq.js"
function n(e) {
	const t = { h1: "h1", p: "p", ...r(), ...e.components }
	return o.jsxs(o.Fragment, {
		children: [
			o.jsx(i, { title: "Welcome" }),
			`
`,
			o.jsx(t.h1, { id: "welcome", children: "Welcome" }),
			`
`,
			o.jsx(t.p, {
				children:
					"This Roo Code storybook is used to independently develop components for the Roo Code webview UI.",
			}),
		],
	})
}
function u(e = {}) {
	const { wrapper: t } = { ...r(), ...e.components }
	return t ? o.jsx(t, { ...e, children: o.jsx(n, { ...e }) }) : n(e)
}
export { u as default }
