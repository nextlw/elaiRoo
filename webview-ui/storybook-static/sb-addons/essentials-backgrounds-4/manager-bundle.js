try {
	;(() => {
		var re = Object.create
		var W = Object.defineProperty
		var ie = Object.getOwnPropertyDescriptor
		var ae = Object.getOwnPropertyNames
		var ce = Object.getPrototypeOf,
			le = Object.prototype.hasOwnProperty
		var E = ((e) =>
			typeof require < "u"
				? require
				: typeof Proxy < "u"
					? new Proxy(e, { get: (o, c) => (typeof require < "u" ? require : o)[c] })
					: e)(function (e) {
			if (typeof require < "u") return require.apply(this, arguments)
			throw Error('Dynamic require of "' + e + '" is not supported')
		})
		var M = (e, o) => () => (e && (o = e((e = 0))), o)
		var se = (e, o) => () => (o || e((o = { exports: {} }).exports, o), o.exports)
		var ue = (e, o, c, r) => {
			if ((o && typeof o == "object") || typeof o == "function")
				for (let i of ae(o))
					!le.call(e, i) &&
						i !== c &&
						W(e, i, { get: () => o[i], enumerable: !(r = ie(o, i)) || r.enumerable })
			return e
		}
		var de = (e, o, c) => (
			(c = e != null ? re(ce(e)) : {}),
			ue(o || !e || !e.__esModule ? W(c, "default", { value: e, enumerable: !0 }) : c, e)
		)
		var p = M(() => {})
		var h = M(() => {})
		var f = M(() => {})
		var X = se((Q, V) => {
			p()
			h()
			f()
			;(function (e) {
				if (typeof Q == "object" && typeof V < "u") V.exports = e()
				else if (typeof define == "function" && define.amd) define([], e)
				else {
					var o
					typeof window < "u" || typeof window < "u"
						? (o = window)
						: typeof self < "u"
							? (o = self)
							: (o = this),
						(o.memoizerific = e())
				}
			})(function () {
				var e, o, c
				return (function r(i, I, l) {
					function n(a, d) {
						if (!I[a]) {
							if (!i[a]) {
								var s = typeof E == "function" && E
								if (!d && s) return s(a, !0)
								if (t) return t(a, !0)
								var C = new Error("Cannot find module '" + a + "'")
								throw ((C.code = "MODULE_NOT_FOUND"), C)
							}
							var m = (I[a] = { exports: {} })
							i[a][0].call(
								m.exports,
								function (b) {
									var _ = i[a][1][b]
									return n(_ || b)
								},
								m,
								m.exports,
								r,
								i,
								I,
								l,
							)
						}
						return I[a].exports
					}
					for (var t = typeof E == "function" && E, u = 0; u < l.length; u++) n(l[u])
					return n
				})(
					{
						1: [
							function (r, i, I) {
								i.exports = function (l) {
									if (typeof Map != "function" || l) {
										var n = r("./similar")
										return new n()
									} else return new Map()
								}
							},
							{ "./similar": 2 },
						],
						2: [
							function (r, i, I) {
								function l() {
									return (this.list = []), (this.lastItem = void 0), (this.size = 0), this
								}
								;(l.prototype.get = function (n) {
									var t
									if (this.lastItem && this.isEqual(this.lastItem.key, n)) return this.lastItem.val
									if (((t = this.indexOf(n)), t >= 0))
										return (this.lastItem = this.list[t]), this.list[t].val
								}),
									(l.prototype.set = function (n, t) {
										var u
										return this.lastItem && this.isEqual(this.lastItem.key, n)
											? ((this.lastItem.val = t), this)
											: ((u = this.indexOf(n)),
												u >= 0
													? ((this.lastItem = this.list[u]), (this.list[u].val = t), this)
													: ((this.lastItem = { key: n, val: t }),
														this.list.push(this.lastItem),
														this.size++,
														this))
									}),
									(l.prototype.delete = function (n) {
										var t
										if (
											(this.lastItem &&
												this.isEqual(this.lastItem.key, n) &&
												(this.lastItem = void 0),
											(t = this.indexOf(n)),
											t >= 0)
										)
											return this.size--, this.list.splice(t, 1)[0]
									}),
									(l.prototype.has = function (n) {
										var t
										return this.lastItem && this.isEqual(this.lastItem.key, n)
											? !0
											: ((t = this.indexOf(n)),
												t >= 0 ? ((this.lastItem = this.list[t]), !0) : !1)
									}),
									(l.prototype.forEach = function (n, t) {
										var u
										for (u = 0; u < this.size; u++)
											n.call(t || this, this.list[u].val, this.list[u].key, this)
									}),
									(l.prototype.indexOf = function (n) {
										var t
										for (t = 0; t < this.size; t++) if (this.isEqual(this.list[t].key, n)) return t
										return -1
									}),
									(l.prototype.isEqual = function (n, t) {
										return n === t || (n !== n && t !== t)
									}),
									(i.exports = l)
							},
							{},
						],
						3: [
							function (r, i, I) {
								var l = r("map-or-similar")
								i.exports = function (a) {
									var d = new l(!1),
										s = []
									return function (C) {
										var m = function () {
											var b = d,
												_,
												B,
												T = arguments.length - 1,
												x = Array(T + 1),
												O = !0,
												A
											if ((m.numArgs || m.numArgs === 0) && m.numArgs !== T + 1)
												throw new Error(
													"Memoizerific functions should always be called with the same number of arguments",
												)
											for (A = 0; A < T; A++) {
												if (
													((x[A] = { cacheItem: b, arg: arguments[A] }), b.has(arguments[A]))
												) {
													b = b.get(arguments[A])
													continue
												}
												;(O = !1), (_ = new l(!1)), b.set(arguments[A], _), (b = _)
											}
											return (
												O && (b.has(arguments[T]) ? (B = b.get(arguments[T])) : (O = !1)),
												O || ((B = C.apply(null, arguments)), b.set(arguments[T], B)),
												a > 0 &&
													((x[T] = { cacheItem: b, arg: arguments[T] }),
													O ? n(s, x) : s.push(x),
													s.length > a && t(s.shift())),
												(m.wasMemoized = O),
												(m.numArgs = T + 1),
												B
											)
										}
										return (m.limit = a), (m.wasMemoized = !1), (m.cache = d), (m.lru = s), m
									}
								}
								function n(a, d) {
									var s = a.length,
										C = d.length,
										m,
										b,
										_
									for (b = 0; b < s; b++) {
										for (m = !0, _ = 0; _ < C; _++)
											if (!u(a[b][_].arg, d[_].arg)) {
												m = !1
												break
											}
										if (m) break
									}
									a.push(a.splice(b, 1)[0])
								}
								function t(a) {
									var d = a.length,
										s = a[d - 1],
										C,
										m
									for (
										s.cacheItem.delete(s.arg), m = d - 2;
										m >= 0 && ((s = a[m]), (C = s.cacheItem.get(s.arg)), !C || !C.size);
										m--
									)
										s.cacheItem.delete(s.arg)
								}
								function u(a, d) {
									return a === d || (a !== a && d !== d)
								}
							},
							{ "map-or-similar": 1 },
						],
					},
					{},
					[3],
				)(3)
			})
		})
		p()
		h()
		f()
		p()
		h()
		f()
		p()
		h()
		f()
		p()
		h()
		f()
		var g = __REACT__,
			{
				Children: Ee,
				Component: we,
				Fragment: D,
				Profiler: Re,
				PureComponent: Be,
				StrictMode: xe,
				Suspense: Le,
				__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: Pe,
				cloneElement: Me,
				createContext: De,
				createElement: Ue,
				createFactory: Ne,
				createRef: Ge,
				forwardRef: Fe,
				isValidElement: He,
				lazy: qe,
				memo: w,
				startTransition: ze,
				unstable_act: Ke,
				useCallback: U,
				useContext: Ve,
				useDebugValue: Ye,
				useDeferredValue: We,
				useEffect: je,
				useId: $e,
				useImperativeHandle: Ze,
				useInsertionEffect: Je,
				useLayoutEffect: Qe,
				useMemo: j,
				useReducer: Xe,
				useRef: eo,
				useState: N,
				useSyncExternalStore: oo,
				useTransition: to,
				version: no,
			} = __REACT__
		p()
		h()
		f()
		var lo = __STORYBOOK_API__,
			{
				ActiveTabs: so,
				Consumer: uo,
				ManagerContext: Io,
				Provider: mo,
				RequestResponseError: po,
				addons: G,
				combineParameters: ho,
				controlOrMetaKey: fo,
				controlOrMetaSymbol: go,
				eventMatchesShortcut: bo,
				eventToShortcut: Co,
				experimental_MockUniversalStore: _o,
				experimental_UniversalStore: yo,
				experimental_requestResponse: So,
				experimental_useUniversalStore: ko,
				isMacLike: vo,
				isShortcutTaken: To,
				keyToSymbol: Ao,
				merge: Oo,
				mockChannel: Eo,
				optionOrAltSymbol: wo,
				shortcutMatchesShortcut: Ro,
				shortcutToHumanString: Bo,
				types: $,
				useAddonState: xo,
				useArgTypes: Lo,
				useArgs: Po,
				useChannel: Mo,
				useGlobalTypes: Do,
				useGlobals: L,
				useParameter: P,
				useSharedState: Uo,
				useStoryPrepared: No,
				useStorybookApi: Go,
				useStorybookState: Fo,
			} = __STORYBOOK_API__
		p()
		h()
		f()
		var Vo = __STORYBOOK_COMPONENTS__,
			{
				A: Yo,
				ActionBar: Wo,
				AddonPanel: jo,
				Badge: $o,
				Bar: Zo,
				Blockquote: Jo,
				Button: Qo,
				ClipboardCode: Xo,
				Code: et,
				DL: ot,
				Div: tt,
				DocumentWrapper: nt,
				EmptyTabContent: rt,
				ErrorFormatter: it,
				FlexBar: at,
				Form: ct,
				H1: lt,
				H2: st,
				H3: ut,
				H4: dt,
				H5: It,
				H6: mt,
				HR: pt,
				IconButton: R,
				IconButtonSkeleton: ht,
				Icons: ft,
				Img: gt,
				LI: bt,
				Link: Ct,
				ListItem: _t,
				Loader: yt,
				Modal: St,
				OL: kt,
				P: vt,
				Placeholder: Tt,
				Pre: At,
				ProgressSpinner: Ot,
				ResetWrapper: Et,
				ScrollArea: wt,
				Separator: Rt,
				Spaced: Bt,
				Span: xt,
				StorybookIcon: Lt,
				StorybookLogo: Pt,
				Symbols: Mt,
				SyntaxHighlighter: Dt,
				TT: Ut,
				TabBar: Nt,
				TabButton: Gt,
				TabWrapper: Ft,
				Table: Ht,
				Tabs: qt,
				TabsState: zt,
				TooltipLinkList: F,
				TooltipMessage: Kt,
				TooltipNote: Vt,
				UL: Yt,
				WithTooltip: H,
				WithTooltipPure: Wt,
				Zoom: jt,
				codeCommon: $t,
				components: Zt,
				createCopyToClipboardFunction: Jt,
				getStoryHref: Qt,
				icons: Xt,
				interleaveSeparators: en,
				nameSpaceClassNames: on,
				resetComponents: tn,
				withReset: nn,
			} = __STORYBOOK_COMPONENTS__
		p()
		h()
		f()
		var sn = __STORYBOOK_ICONS__,
			{
				AccessibilityAltIcon: un,
				AccessibilityIcon: dn,
				AccessibilityIgnoredIcon: In,
				AddIcon: mn,
				AdminIcon: pn,
				AlertAltIcon: hn,
				AlertIcon: fn,
				AlignLeftIcon: gn,
				AlignRightIcon: bn,
				AppleIcon: Cn,
				ArrowBottomLeftIcon: _n,
				ArrowBottomRightIcon: yn,
				ArrowDownIcon: Sn,
				ArrowLeftIcon: kn,
				ArrowRightIcon: vn,
				ArrowSolidDownIcon: Tn,
				ArrowSolidLeftIcon: An,
				ArrowSolidRightIcon: On,
				ArrowSolidUpIcon: En,
				ArrowTopLeftIcon: wn,
				ArrowTopRightIcon: Rn,
				ArrowUpIcon: Bn,
				AzureDevOpsIcon: xn,
				BackIcon: Ln,
				BasketIcon: Pn,
				BatchAcceptIcon: Mn,
				BatchDenyIcon: Dn,
				BeakerIcon: Un,
				BellIcon: Nn,
				BitbucketIcon: Gn,
				BoldIcon: Fn,
				BookIcon: Hn,
				BookmarkHollowIcon: qn,
				BookmarkIcon: zn,
				BottomBarIcon: Kn,
				BottomBarToggleIcon: Vn,
				BoxIcon: Yn,
				BranchIcon: Wn,
				BrowserIcon: jn,
				ButtonIcon: $n,
				CPUIcon: Zn,
				CalendarIcon: Jn,
				CameraIcon: Qn,
				CameraStabilizeIcon: Xn,
				CategoryIcon: er,
				CertificateIcon: or,
				ChangedIcon: tr,
				ChatIcon: nr,
				CheckIcon: rr,
				ChevronDownIcon: ir,
				ChevronLeftIcon: ar,
				ChevronRightIcon: cr,
				ChevronSmallDownIcon: lr,
				ChevronSmallLeftIcon: sr,
				ChevronSmallRightIcon: ur,
				ChevronSmallUpIcon: dr,
				ChevronUpIcon: Ir,
				ChromaticIcon: mr,
				ChromeIcon: pr,
				CircleHollowIcon: hr,
				CircleIcon: Z,
				ClearIcon: fr,
				CloseAltIcon: gr,
				CloseIcon: br,
				CloudHollowIcon: Cr,
				CloudIcon: _r,
				CogIcon: yr,
				CollapseIcon: Sr,
				CommandIcon: kr,
				CommentAddIcon: vr,
				CommentIcon: Tr,
				CommentsIcon: Ar,
				CommitIcon: Or,
				CompassIcon: Er,
				ComponentDrivenIcon: wr,
				ComponentIcon: Rr,
				ContrastIcon: Br,
				ContrastIgnoredIcon: xr,
				ControlsIcon: Lr,
				CopyIcon: Pr,
				CreditIcon: Mr,
				CrossIcon: Dr,
				DashboardIcon: Ur,
				DatabaseIcon: Nr,
				DeleteIcon: Gr,
				DiamondIcon: Fr,
				DirectionIcon: Hr,
				DiscordIcon: qr,
				DocChartIcon: zr,
				DocListIcon: Kr,
				DocumentIcon: Vr,
				DownloadIcon: Yr,
				DragIcon: Wr,
				EditIcon: jr,
				EllipsisIcon: $r,
				EmailIcon: Zr,
				ExpandAltIcon: Jr,
				ExpandIcon: Qr,
				EyeCloseIcon: Xr,
				EyeIcon: ei,
				FaceHappyIcon: oi,
				FaceNeutralIcon: ti,
				FaceSadIcon: ni,
				FacebookIcon: ri,
				FailedIcon: ii,
				FastForwardIcon: ai,
				FigmaIcon: ci,
				FilterIcon: li,
				FlagIcon: si,
				FolderIcon: ui,
				FormIcon: di,
				GDriveIcon: Ii,
				GithubIcon: mi,
				GitlabIcon: pi,
				GlobeIcon: hi,
				GoogleIcon: fi,
				GraphBarIcon: gi,
				GraphLineIcon: bi,
				GraphqlIcon: Ci,
				GridAltIcon: _i,
				GridIcon: q,
				GrowIcon: yi,
				HeartHollowIcon: Si,
				HeartIcon: ki,
				HomeIcon: vi,
				HourglassIcon: Ti,
				InfoIcon: Ai,
				ItalicIcon: Oi,
				JumpToIcon: Ei,
				KeyIcon: wi,
				LightningIcon: Ri,
				LightningOffIcon: Bi,
				LinkBrokenIcon: xi,
				LinkIcon: Li,
				LinkedinIcon: Pi,
				LinuxIcon: Mi,
				ListOrderedIcon: Di,
				ListUnorderedIcon: Ui,
				LocationIcon: Ni,
				LockIcon: Gi,
				MarkdownIcon: Fi,
				MarkupIcon: Hi,
				MediumIcon: qi,
				MemoryIcon: zi,
				MenuIcon: Ki,
				MergeIcon: Vi,
				MirrorIcon: Yi,
				MobileIcon: Wi,
				MoonIcon: ji,
				NutIcon: $i,
				OutboxIcon: Zi,
				OutlineIcon: Ji,
				PaintBrushIcon: Qi,
				PaperClipIcon: Xi,
				ParagraphIcon: ea,
				PassedIcon: oa,
				PhoneIcon: ta,
				PhotoDragIcon: na,
				PhotoIcon: z,
				PhotoStabilizeIcon: ra,
				PinAltIcon: ia,
				PinIcon: aa,
				PlayAllHollowIcon: ca,
				PlayBackIcon: la,
				PlayHollowIcon: sa,
				PlayIcon: ua,
				PlayNextIcon: da,
				PlusIcon: Ia,
				PointerDefaultIcon: ma,
				PointerHandIcon: pa,
				PowerIcon: ha,
				PrintIcon: fa,
				ProceedIcon: ga,
				ProfileIcon: ba,
				PullRequestIcon: Ca,
				QuestionIcon: _a,
				RSSIcon: ya,
				RedirectIcon: Sa,
				ReduxIcon: ka,
				RefreshIcon: J,
				ReplyIcon: va,
				RepoIcon: Ta,
				RequestChangeIcon: Aa,
				RewindIcon: Oa,
				RulerIcon: Ea,
				SaveIcon: wa,
				SearchIcon: Ra,
				ShareAltIcon: Ba,
				ShareIcon: xa,
				ShieldIcon: La,
				SideBySideIcon: Pa,
				SidebarAltIcon: Ma,
				SidebarAltToggleIcon: Da,
				SidebarIcon: Ua,
				SidebarToggleIcon: Na,
				SpeakerIcon: Ga,
				StackedIcon: Fa,
				StarHollowIcon: Ha,
				StarIcon: qa,
				StatusFailIcon: za,
				StatusIcon: Ka,
				StatusPassIcon: Va,
				StatusWarnIcon: Ya,
				StickerIcon: Wa,
				StopAltHollowIcon: ja,
				StopAltIcon: $a,
				StopIcon: Za,
				StorybookIcon: Ja,
				StructureIcon: Qa,
				SubtractIcon: Xa,
				SunIcon: ec,
				SupportIcon: oc,
				SwitchAltIcon: tc,
				SyncIcon: nc,
				TabletIcon: rc,
				ThumbsUpIcon: ic,
				TimeIcon: ac,
				TimerIcon: cc,
				TransferIcon: lc,
				TrashIcon: sc,
				TwitterIcon: uc,
				TypeIcon: dc,
				UbuntuIcon: Ic,
				UndoIcon: mc,
				UnfoldIcon: pc,
				UnlockIcon: hc,
				UnpinIcon: fc,
				UploadIcon: gc,
				UserAddIcon: bc,
				UserAltIcon: Cc,
				UserIcon: _c,
				UsersIcon: yc,
				VSCodeIcon: Sc,
				VerifiedIcon: kc,
				VideoIcon: vc,
				WandIcon: Tc,
				WatchIcon: Ac,
				WindowsIcon: Oc,
				WrenchIcon: Ec,
				XIcon: wc,
				YoutubeIcon: Rc,
				ZoomIcon: Bc,
				ZoomOutIcon: xc,
				ZoomResetIcon: Lc,
				iconList: Pc,
			} = __STORYBOOK_ICONS__
		p()
		h()
		f()
		var Gc = __STORYBOOK_CLIENT_LOGGER__,
			{ deprecate: Fc, logger: K, once: Hc, pretty: qc } = __STORYBOOK_CLIENT_LOGGER__
		var Y = de(X())
		p()
		h()
		f()
		var Jc = __STORYBOOK_THEMING__,
			{
				CacheProvider: Qc,
				ClassNames: Xc,
				Global: el,
				ThemeProvider: ol,
				background: tl,
				color: nl,
				convert: rl,
				create: il,
				createCache: al,
				createGlobal: cl,
				createReset: ll,
				css: sl,
				darken: ul,
				ensure: dl,
				ignoreSsrWarning: Il,
				isPropValid: ml,
				jsx: pl,
				keyframes: hl,
				lighten: fl,
				styled: ee,
				themes: gl,
				typography: bl,
				useTheme: Cl,
				withTheme: _l,
			} = __STORYBOOK_THEMING__
		p()
		h()
		f()
		function oe(e) {
			for (var o = [], c = 1; c < arguments.length; c++) o[c - 1] = arguments[c]
			var r = Array.from(typeof e == "string" ? [e] : e)
			r[r.length - 1] = r[r.length - 1].replace(/\r?\n([\t ]*)$/, "")
			var i = r.reduce(function (n, t) {
				var u = t.match(/\n([\t ]+|(?!\s).)/g)
				return u
					? n.concat(
							u.map(function (a) {
								var d, s
								return (s = (d = a.match(/[\t ]/g)) === null || d === void 0 ? void 0 : d.length) !==
									null && s !== void 0
									? s
									: 0
							}),
						)
					: n
			}, [])
			if (i.length) {
				var I = new RegExp(
					`
[	 ]{` +
						Math.min.apply(Math, i) +
						"}",
					"g",
				)
				r = r.map(function (n) {
					return n.replace(
						I,
						`
`,
					)
				})
			}
			r[0] = r[0].replace(/^\r?\n/, "")
			var l = r[0]
			return (
				o.forEach(function (n, t) {
					var u = l.match(/(?:^|\n)( *)$/),
						a = u ? u[1] : "",
						d = n
					typeof n == "string" &&
						n.includes(`
`) &&
						(d = String(n)
							.split(
								`
`,
							)
							.map(function (s, C) {
								return C === 0 ? s : "" + a + s
							}).join(`
`)),
						(l += d + r[t + 1])
				}),
				l
			)
		}
		var te = "storybook/background",
			y = "backgrounds",
			Ie = { light: { name: "light", value: "#F8F8F8" }, dark: { name: "dark", value: "#333" } },
			me = w(function () {
				let e = P(y),
					[o, c, r] = L(),
					[i, I] = N(!1),
					{ options: l = Ie, disable: n = !0 } = e || {}
				if (n) return null
				let t = o[y] || {},
					u = t.value,
					a = t.grid || !1,
					d = l[u],
					s = !!r?.[y],
					C = Object.keys(l).length
				return g.createElement(pe, {
					length: C,
					backgroundMap: l,
					item: d,
					updateGlobals: c,
					backgroundName: u,
					setIsTooltipVisible: I,
					isLocked: s,
					isGridActive: a,
					isTooltipVisible: i,
				})
			}),
			pe = w(function (e) {
				let {
						item: o,
						length: c,
						updateGlobals: r,
						setIsTooltipVisible: i,
						backgroundMap: I,
						backgroundName: l,
						isLocked: n,
						isGridActive: t,
						isTooltipVisible: u,
					} = e,
					a = U(
						(d) => {
							r({ [y]: d })
						},
						[r],
					)
				return g.createElement(
					D,
					null,
					g.createElement(
						R,
						{
							key: "grid",
							active: t,
							disabled: n,
							title: "Apply a grid to the preview",
							onClick: () => a({ value: l, grid: !t }),
						},
						g.createElement(q, null),
					),
					c > 0
						? g.createElement(
								H,
								{
									key: "background",
									placement: "top",
									closeOnOutsideClick: !0,
									tooltip: ({ onHide: d }) =>
										g.createElement(F, {
											links: [
												...(o
													? [
															{
																id: "reset",
																title: "Reset background",
																icon: g.createElement(J, null),
																onClick: () => {
																	a({ value: void 0, grid: t }), d()
																},
															},
														]
													: []),
												...Object.entries(I).map(([s, C]) => ({
													id: s,
													title: C.name,
													icon: g.createElement(Z, { color: C?.value || "grey" }),
													active: s === l,
													onClick: () => {
														a({ value: s, grid: t }), d()
													},
												})),
											].flat(),
										}),
									onVisibleChange: i,
								},
								g.createElement(
									R,
									{
										disabled: n,
										key: "background",
										title: "Change the background of the preview",
										active: !!o || u,
									},
									g.createElement(z, null),
								),
							)
						: null,
				)
			}),
			he = ee.span(
				({ background: e }) => ({
					borderRadius: "1rem",
					display: "block",
					height: "1rem",
					width: "1rem",
					background: e,
				}),
				({ theme: e }) => ({ boxShadow: `${e.appBorderColor} 0 0 0 1px inset` }),
			),
			fe = (e, o = [], c) => {
				if (e === "transparent") return "transparent"
				if (o.find((i) => i.value === e) || e) return e
				let r = o.find((i) => i.name === c)
				if (r) return r.value
				if (c) {
					let i = o.map((I) => I.name).join(", ")
					K.warn(oe`
        Backgrounds Addon: could not find the default color "${c}".
        These are the available colors for your story based on your configuration:
        ${i}.
      `)
				}
				return "transparent"
			},
			ne = (0, Y.default)(1e3)((e, o, c, r, i, I) => ({
				id: e || o,
				title: o,
				onClick: () => {
					i({ selected: c, name: o })
				},
				value: c,
				right: r ? g.createElement(he, { background: c }) : void 0,
				active: I,
			})),
			ge = (0, Y.default)(10)((e, o, c) => {
				let r = e.map(({ name: i, value: I }) => ne(null, i, I, !0, c, I === o))
				return o !== "transparent" ? [ne("reset", "Clear background", "transparent", null, c, !1), ...r] : r
			}),
			be = { default: null, disable: !0, values: [] },
			Ce = w(function () {
				let e = P(y, be),
					[o, c] = N(!1),
					[r, i] = L(),
					I = r[y]?.value,
					l = j(() => fe(I, e.values, e.default), [e, I])
				Array.isArray(e) &&
					K.warn(
						"Addon Backgrounds api has changed in Storybook 6.0. Please refer to the migration guide: https://github.com/storybookjs/storybook/blob/next/MIGRATION.md",
					)
				let n = U(
					(t) => {
						i({ [y]: { ...r[y], value: t } })
					},
					[e, r, i],
				)
				return e.disable
					? null
					: g.createElement(
							H,
							{
								placement: "top",
								closeOnOutsideClick: !0,
								tooltip: ({ onHide: t }) =>
									g.createElement(F, {
										links: ge(e.values, l, ({ selected: u }) => {
											l !== u && n(u), t()
										}),
									}),
								onVisibleChange: c,
							},
							g.createElement(
								R,
								{
									key: "background",
									title: "Change the background of the preview",
									active: l !== "transparent" || o,
								},
								g.createElement(z, null),
							),
						)
			}),
			_e = w(function () {
				let [e, o] = L(),
					{ grid: c } = P(y, { grid: { disable: !1 } })
				if (c?.disable) return null
				let r = e[y]?.grid || !1
				return g.createElement(
					R,
					{
						key: "background",
						active: r,
						title: "Apply a grid to the preview",
						onClick: () => o({ [y]: { ...e[y], grid: !r } }),
					},
					g.createElement(q, null),
				)
			})
		G.register(te, () => {
			G.add(te, {
				title: "Backgrounds",
				type: $.TOOL,
				match: ({ viewMode: e, tabId: o }) => !!(e && e.match(/^(story|docs)$/)) && !o,
				render: () =>
					FEATURES?.backgroundsStoryGlobals
						? g.createElement(me, null)
						: g.createElement(D, null, g.createElement(Ce, null), g.createElement(_e, null)),
			})
		})
	})()
} catch (e) {
	console.error("[Storybook] One of your manager-entries failed: " + import.meta.url, e)
}
