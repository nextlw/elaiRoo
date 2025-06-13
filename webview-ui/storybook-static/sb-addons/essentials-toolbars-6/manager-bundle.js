try {
	;(() => {
		var n = __REACT__,
			{
				Children: se,
				Component: ie,
				Fragment: ue,
				Profiler: de,
				PureComponent: ce,
				StrictMode: pe,
				Suspense: me,
				__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: _e,
				cloneElement: be,
				createContext: Se,
				createElement: ye,
				createFactory: Te,
				createRef: Ce,
				forwardRef: Oe,
				isValidElement: ve,
				lazy: fe,
				memo: ke,
				startTransition: Ie,
				unstable_act: Ee,
				useCallback: O,
				useContext: xe,
				useDebugValue: Re,
				useDeferredValue: ge,
				useEffect: x,
				useId: Ae,
				useImperativeHandle: Me,
				useInsertionEffect: Ne,
				useLayoutEffect: he,
				useMemo: Le,
				useReducer: we,
				useRef: N,
				useState: h,
				useSyncExternalStore: Be,
				useTransition: Pe,
				version: Ue,
			} = __REACT__
		var Fe = __STORYBOOK_API__,
			{
				ActiveTabs: Ge,
				Consumer: Ke,
				ManagerContext: Ye,
				Provider: $e,
				RequestResponseError: qe,
				addons: R,
				combineParameters: ze,
				controlOrMetaKey: je,
				controlOrMetaSymbol: Ze,
				eventMatchesShortcut: Je,
				eventToShortcut: Qe,
				experimental_MockUniversalStore: Xe,
				experimental_UniversalStore: et,
				experimental_requestResponse: tt,
				experimental_useUniversalStore: ot,
				isMacLike: rt,
				isShortcutTaken: lt,
				keyToSymbol: nt,
				merge: at,
				mockChannel: st,
				optionOrAltSymbol: it,
				shortcutMatchesShortcut: ut,
				shortcutToHumanString: dt,
				types: L,
				useAddonState: ct,
				useArgTypes: pt,
				useArgs: mt,
				useChannel: _t,
				useGlobalTypes: w,
				useGlobals: g,
				useParameter: bt,
				useSharedState: St,
				useStoryPrepared: yt,
				useStorybookApi: B,
				useStorybookState: Tt,
			} = __STORYBOOK_API__
		var kt = __STORYBOOK_COMPONENTS__,
			{
				A: It,
				ActionBar: Et,
				AddonPanel: xt,
				Badge: Rt,
				Bar: gt,
				Blockquote: At,
				Button: Mt,
				ClipboardCode: Nt,
				Code: ht,
				DL: Lt,
				Div: wt,
				DocumentWrapper: Bt,
				EmptyTabContent: Pt,
				ErrorFormatter: Ut,
				FlexBar: Dt,
				Form: Vt,
				H1: Ht,
				H2: Wt,
				H3: Ft,
				H4: Gt,
				H5: Kt,
				H6: Yt,
				HR: $t,
				IconButton: P,
				IconButtonSkeleton: qt,
				Icons: A,
				Img: zt,
				LI: jt,
				Link: Zt,
				ListItem: Jt,
				Loader: Qt,
				Modal: Xt,
				OL: eo,
				P: to,
				Placeholder: oo,
				Pre: ro,
				ProgressSpinner: lo,
				ResetWrapper: no,
				ScrollArea: ao,
				Separator: U,
				Spaced: so,
				Span: io,
				StorybookIcon: uo,
				StorybookLogo: co,
				Symbols: po,
				SyntaxHighlighter: mo,
				TT: _o,
				TabBar: bo,
				TabButton: So,
				TabWrapper: yo,
				Table: To,
				Tabs: Co,
				TabsState: Oo,
				TooltipLinkList: D,
				TooltipMessage: vo,
				TooltipNote: fo,
				UL: ko,
				WithTooltip: V,
				WithTooltipPure: Io,
				Zoom: Eo,
				codeCommon: xo,
				components: Ro,
				createCopyToClipboardFunction: go,
				getStoryHref: Ao,
				icons: Mo,
				interleaveSeparators: No,
				nameSpaceClassNames: ho,
				resetComponents: Lo,
				withReset: wo,
			} = __STORYBOOK_COMPONENTS__
		var G = { type: "item", value: "" },
			K = (o, t) => ({
				...t,
				name: t.name || o,
				description: t.description || o,
				toolbar: {
					...t.toolbar,
					items: t.toolbar.items.map((e) => {
						let r = typeof e == "string" ? { value: e, title: e } : e
						return (
							r.type === "reset" && t.toolbar.icon && ((r.icon = t.toolbar.icon), (r.hideIcon = !0)),
							{ ...G, ...r }
						)
					}),
				},
			}),
			Y = ["reset"],
			$ = (o) => o.filter((t) => !Y.includes(t.type)).map((t) => t.value),
			b = "addon-toolbars",
			q = async (o, t, e) => {
				e &&
					e.next &&
					(await o.setAddonShortcut(b, {
						label: e.next.label,
						defaultShortcut: e.next.keys,
						actionName: `${t}:next`,
						action: e.next.action,
					})),
					e &&
						e.previous &&
						(await o.setAddonShortcut(b, {
							label: e.previous.label,
							defaultShortcut: e.previous.keys,
							actionName: `${t}:previous`,
							action: e.previous.action,
						})),
					e &&
						e.reset &&
						(await o.setAddonShortcut(b, {
							label: e.reset.label,
							defaultShortcut: e.reset.keys,
							actionName: `${t}:reset`,
							action: e.reset.action,
						}))
			},
			z = (o) => (t) => {
				let {
						id: e,
						toolbar: { items: r, shortcuts: l },
					} = t,
					d = B(),
					[S, i] = g(),
					a = N([]),
					u = S[e],
					v = O(() => {
						i({ [e]: "" })
					}, [i]),
					f = O(() => {
						let s = a.current,
							p = s.indexOf(u),
							m = p === s.length - 1 ? 0 : p + 1,
							c = a.current[m]
						i({ [e]: c })
					}, [a, u, i]),
					k = O(() => {
						let s = a.current,
							p = s.indexOf(u),
							m = p > -1 ? p : 0,
							c = m === 0 ? s.length - 1 : m - 1,
							_ = a.current[c]
						i({ [e]: _ })
					}, [a, u, i])
				return (
					x(() => {
						l &&
							q(d, e, {
								next: { ...l.next, action: f },
								previous: { ...l.previous, action: k },
								reset: { ...l.reset, action: v },
							})
					}, [d, e, l, f, k, v]),
					x(() => {
						a.current = $(r)
					}, []),
					n.createElement(o, { cycleValues: a.current, ...t })
				)
			},
			H = ({ currentValue: o, items: t }) => o != null && t.find((e) => e.value === o && e.type !== "reset"),
			j = ({ currentValue: o, items: t }) => {
				let e = H({ currentValue: o, items: t })
				if (e) return e.icon
			},
			Z = ({ currentValue: o, items: t }) => {
				let e = H({ currentValue: o, items: t })
				if (e) return e.title
			},
			J = ({ active: o, disabled: t, title: e, icon: r, description: l, onClick: d }) =>
				n.createElement(
					P,
					{ active: o, title: l, disabled: t, onClick: t ? () => {} : d },
					r && n.createElement(A, { icon: r, __suppressDeprecationWarning: !0 }),
					e ? `\xA0${e}` : null,
				),
			Q = ({ right: o, title: t, value: e, icon: r, hideIcon: l, onClick: d, disabled: S, currentValue: i }) => {
				let a = r && n.createElement(A, { style: { opacity: 1 }, icon: r, __suppressDeprecationWarning: !0 }),
					u = { id: e ?? "_reset", active: i === e, right: o, title: t, disabled: S, onClick: d }
				return r && !l && (u.icon = a), u
			},
			X = z(
				({
					id: o,
					name: t,
					description: e,
					toolbar: { icon: r, items: l, title: d, preventDynamicIcon: S, dynamicTitle: i },
				}) => {
					let [a, u, v] = g(),
						[f, k] = h(!1),
						s = a[o],
						p = !!s,
						m = o in v,
						c = r,
						_ = d
					S || (c = j({ currentValue: s, items: l }) || c),
						i && (_ = Z({ currentValue: s, items: l }) || _),
						!_ && !c && console.warn(`Toolbar '${t}' has no title or icon`)
					let W = O(
						(E) => {
							u({ [o]: E })
						},
						[o, u],
					)
					return n.createElement(
						V,
						{
							placement: "top",
							tooltip: ({ onHide: E }) => {
								let F = l
									.filter(({ type: I }) => {
										let M = !0
										return I === "reset" && !s && (M = !1), M
									})
									.map((I) =>
										Q({
											...I,
											currentValue: s,
											disabled: m,
											onClick: () => {
												W(I.value), E()
											},
										}),
									)
								return n.createElement(D, { links: F })
							},
							closeOnOutsideClick: !0,
							onVisibleChange: k,
						},
						n.createElement(J, {
							active: f || p,
							disabled: m,
							description: e || "",
							icon: c,
							title: _ || "",
						}),
					)
				},
			),
			ee = () => {
				let o = w(),
					t = Object.keys(o).filter((e) => !!o[e].toolbar)
				return t.length
					? n.createElement(
							n.Fragment,
							null,
							n.createElement(U, null),
							t.map((e) => {
								let r = K(e, o[e])
								return n.createElement(X, { key: e, id: e, ...r })
							}),
						)
					: null
			}
		R.register(b, () =>
			R.add(b, { title: b, type: L.TOOL, match: ({ tabId: o }) => !o, render: () => n.createElement(ee, null) }),
		)
	})()
} catch (e) {
	console.error("[Storybook] One of your manager-entries failed: " + import.meta.url, e)
}
