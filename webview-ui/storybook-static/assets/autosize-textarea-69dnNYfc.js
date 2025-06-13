import { j as b } from "./jsx-runtime-ClZEHPQQ.js"
import { r as o } from "./index-Cqyox1Tj.js"
import { c as p } from "./utils-CytzSlOG.js"
const m = ({ textAreaRef: c, triggerAutoSize: d, maxHeight: t = Number.MAX_SAFE_INTEGER, minHeight: r = 0 }) => {
		const [s, u] = o.useState(!0)
		o.useEffect(() => {
			const e = c.current
			if (e) {
				s && ((e.style.minHeight = `${r + 6}px`), t > r && (e.style.maxHeight = `${t}px`), u(!1)),
					(e.style.height = `${r + 6}px`)
				const l = e.scrollHeight
				l > t ? (e.style.height = `${t}px`) : (e.style.height = `${l + 6}px`)
			}
		}, [s, r, t, c, d])
	},
	a = o.forwardRef(({ minHeight: c, maxHeight: d, className: t, onChange: r, value: s, ...u }, f) => {
		const e = o.useRef(null),
			[l, n] = o.useState("")
		return (
			m({ textAreaRef: e, triggerAutoSize: l, maxHeight: d, minHeight: c }),
			o.useImperativeHandle(f, () => ({
				textArea: e.current,
				focus: () => {
					var i
					return (i = e == null ? void 0 : e.current) == null ? void 0 : i.focus()
				},
				maxHeight: d,
				minHeight: c,
			})),
			o.useEffect(() => {
				n(s)
			}, [u == null ? void 0 : u.defaultValue, s]),
			b.jsx("textarea", {
				...u,
				value: s,
				ref: e,
				className: p(
					"flex w-full rounded-lg ring-offset-background placeholder:text-muted-foreground focus:outline-0 focus-visible:outline-none focus-visible:border-vscode-focusBorder disabled:cursor-not-allowed disabled:opacity-50 scrollbar-hide",
					"border-[var(--vscode-input-border,var(--vscode-input-background))] focus-visible:border-vscode-focusBorder",
					"bg-vscode-input-background",
					"text-vscode-input-foreground",
					t,
				),
				onChange: (i) => {
					n(i.target.value), r == null || r(i)
				},
			})
		)
	})
a.displayName = "AutosizeTextarea"
a.__docgenInfo = {
	description: "",
	methods: [{ name: "focus", docblock: null, modifiers: [], params: [], returns: null }],
	displayName: "AutosizeTextarea",
	props: {
		minHeight: { required: !0, tsType: { name: "number" }, description: "" },
		maxHeight: { required: !0, tsType: { name: "number" }, description: "" },
	},
}
export { a as A }
