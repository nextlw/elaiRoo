try {
	;(() => {
		var me = Object.create
		var J = Object.defineProperty
		var he = Object.getOwnPropertyDescriptor
		var fe = Object.getOwnPropertyNames
		var ge = Object.getPrototypeOf,
			be = Object.prototype.hasOwnProperty
		var x = ((e) =>
			typeof require < "u"
				? require
				: typeof Proxy < "u"
					? new Proxy(e, { get: (t, l) => (typeof require < "u" ? require : t)[l] })
					: e)(function (e) {
			if (typeof require < "u") return require.apply(this, arguments)
			throw Error('Dynamic require of "' + e + '" is not supported')
		})
		var N = (e, t) => () => (e && (t = e((e = 0))), t)
		var we = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports)
		var ye = (e, t, l, s) => {
			if ((t && typeof t == "object") || typeof t == "function")
				for (let a of fe(t))
					!be.call(e, a) &&
						a !== l &&
						J(e, a, { get: () => t[a], enumerable: !(s = he(t, a)) || s.enumerable })
			return e
		}
		var Se = (e, t, l) => (
			(l = e != null ? me(ge(e)) : {}),
			ye(t || !e || !e.__esModule ? J(l, "default", { value: e, enumerable: !0 }) : l, e)
		)
		var f = N(() => {})
		var g = N(() => {})
		var b = N(() => {})
		var ce = we((ae, Z) => {
			f()
			g()
			b()
			;(function (e) {
				if (typeof ae == "object" && typeof Z < "u") Z.exports = e()
				else if (typeof define == "function" && define.amd) define([], e)
				else {
					var t
					typeof window < "u" || typeof window < "u"
						? (t = window)
						: typeof self < "u"
							? (t = self)
							: (t = this),
						(t.memoizerific = e())
				}
			})(function () {
				var e, t, l
				return (function s(a, w, p) {
					function o(n, I) {
						if (!w[n]) {
							if (!a[n]) {
								var r = typeof x == "function" && x
								if (!I && r) return r(n, !0)
								if (i) return i(n, !0)
								var u = new Error("Cannot find module '" + n + "'")
								throw ((u.code = "MODULE_NOT_FOUND"), u)
							}
							var d = (w[n] = { exports: {} })
							a[n][0].call(
								d.exports,
								function (h) {
									var y = a[n][1][h]
									return o(y || h)
								},
								d,
								d.exports,
								s,
								a,
								w,
								p,
							)
						}
						return w[n].exports
					}
					for (var i = typeof x == "function" && x, m = 0; m < p.length; m++) o(p[m])
					return o
				})(
					{
						1: [
							function (s, a, w) {
								a.exports = function (p) {
									if (typeof Map != "function" || p) {
										var o = s("./similar")
										return new o()
									} else return new Map()
								}
							},
							{ "./similar": 2 },
						],
						2: [
							function (s, a, w) {
								function p() {
									return (this.list = []), (this.lastItem = void 0), (this.size = 0), this
								}
								;(p.prototype.get = function (o) {
									var i
									if (this.lastItem && this.isEqual(this.lastItem.key, o)) return this.lastItem.val
									if (((i = this.indexOf(o)), i >= 0))
										return (this.lastItem = this.list[i]), this.list[i].val
								}),
									(p.prototype.set = function (o, i) {
										var m
										return this.lastItem && this.isEqual(this.lastItem.key, o)
											? ((this.lastItem.val = i), this)
											: ((m = this.indexOf(o)),
												m >= 0
													? ((this.lastItem = this.list[m]), (this.list[m].val = i), this)
													: ((this.lastItem = { key: o, val: i }),
														this.list.push(this.lastItem),
														this.size++,
														this))
									}),
									(p.prototype.delete = function (o) {
										var i
										if (
											(this.lastItem &&
												this.isEqual(this.lastItem.key, o) &&
												(this.lastItem = void 0),
											(i = this.indexOf(o)),
											i >= 0)
										)
											return this.size--, this.list.splice(i, 1)[0]
									}),
									(p.prototype.has = function (o) {
										var i
										return this.lastItem && this.isEqual(this.lastItem.key, o)
											? !0
											: ((i = this.indexOf(o)),
												i >= 0 ? ((this.lastItem = this.list[i]), !0) : !1)
									}),
									(p.prototype.forEach = function (o, i) {
										var m
										for (m = 0; m < this.size; m++)
											o.call(i || this, this.list[m].val, this.list[m].key, this)
									}),
									(p.prototype.indexOf = function (o) {
										var i
										for (i = 0; i < this.size; i++) if (this.isEqual(this.list[i].key, o)) return i
										return -1
									}),
									(p.prototype.isEqual = function (o, i) {
										return o === i || (o !== o && i !== i)
									}),
									(a.exports = p)
							},
							{},
						],
						3: [
							function (s, a, w) {
								var p = s("map-or-similar")
								a.exports = function (n) {
									var I = new p(!1),
										r = []
									return function (u) {
										var d = function () {
											var h = I,
												y,
												E,
												S = arguments.length - 1,
												M = Array(S + 1),
												T = !0,
												C
											if ((d.numArgs || d.numArgs === 0) && d.numArgs !== S + 1)
												throw new Error(
													"Memoizerific functions should always be called with the same number of arguments",
												)
											for (C = 0; C < S; C++) {
												if (
													((M[C] = { cacheItem: h, arg: arguments[C] }), h.has(arguments[C]))
												) {
													h = h.get(arguments[C])
													continue
												}
												;(T = !1), (y = new p(!1)), h.set(arguments[C], y), (h = y)
											}
											return (
												T && (h.has(arguments[S]) ? (E = h.get(arguments[S])) : (T = !1)),
												T || ((E = u.apply(null, arguments)), h.set(arguments[S], E)),
												n > 0 &&
													((M[S] = { cacheItem: h, arg: arguments[S] }),
													T ? o(r, M) : r.push(M),
													r.length > n && i(r.shift())),
												(d.wasMemoized = T),
												(d.numArgs = S + 1),
												E
											)
										}
										return (d.limit = n), (d.wasMemoized = !1), (d.cache = I), (d.lru = r), d
									}
								}
								function o(n, I) {
									var r = n.length,
										u = I.length,
										d,
										h,
										y
									for (h = 0; h < r; h++) {
										for (d = !0, y = 0; y < u; y++)
											if (!m(n[h][y].arg, I[y].arg)) {
												d = !1
												break
											}
										if (d) break
									}
									n.push(n.splice(h, 1)[0])
								}
								function i(n) {
									var I = n.length,
										r = n[I - 1],
										u,
										d
									for (
										r.cacheItem.delete(r.arg), d = I - 2;
										d >= 0 && ((r = n[d]), (u = r.cacheItem.get(r.arg)), !u || !u.size);
										d--
									)
										r.cacheItem.delete(r.arg)
								}
								function m(n, I) {
									return n === I || (n !== n && I !== I)
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
		f()
		g()
		b()
		f()
		g()
		b()
		f()
		g()
		b()
		f()
		g()
		b()
		var c = __REACT__,
			{
				Children: $e,
				Component: Je,
				Fragment: V,
				Profiler: Qe,
				PureComponent: Xe,
				StrictMode: et,
				Suspense: tt,
				__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: ot,
				cloneElement: nt,
				createContext: rt,
				createElement: U,
				createFactory: it,
				createRef: lt,
				forwardRef: at,
				isValidElement: ct,
				lazy: st,
				memo: Q,
				startTransition: ut,
				unstable_act: dt,
				useCallback: X,
				useContext: pt,
				useDebugValue: It,
				useDeferredValue: mt,
				useEffect: O,
				useId: ht,
				useImperativeHandle: ft,
				useInsertionEffect: gt,
				useLayoutEffect: bt,
				useMemo: wt,
				useReducer: yt,
				useRef: ee,
				useState: z,
				useSyncExternalStore: St,
				useTransition: vt,
				version: Ct,
			} = __REACT__
		f()
		g()
		b()
		var Et = __STORYBOOK_API__,
			{
				ActiveTabs: Tt,
				Consumer: At,
				ManagerContext: xt,
				Provider: Ot,
				RequestResponseError: Lt,
				addons: H,
				combineParameters: Bt,
				controlOrMetaKey: Pt,
				controlOrMetaSymbol: Mt,
				eventMatchesShortcut: Vt,
				eventToShortcut: Dt,
				experimental_MockUniversalStore: Nt,
				experimental_UniversalStore: Ut,
				experimental_requestResponse: zt,
				experimental_useUniversalStore: Ht,
				isMacLike: Gt,
				isShortcutTaken: Ft,
				keyToSymbol: qt,
				merge: Wt,
				mockChannel: Yt,
				optionOrAltSymbol: jt,
				shortcutMatchesShortcut: Kt,
				shortcutToHumanString: Zt,
				types: te,
				useAddonState: $t,
				useArgTypes: Jt,
				useArgs: Qt,
				useChannel: Xt,
				useGlobalTypes: eo,
				useGlobals: G,
				useParameter: F,
				useSharedState: to,
				useStoryPrepared: oo,
				useStorybookApi: oe,
				useStorybookState: no,
			} = __STORYBOOK_API__
		f()
		g()
		b()
		var co = __STORYBOOK_COMPONENTS__,
			{
				A: so,
				ActionBar: uo,
				AddonPanel: po,
				Badge: Io,
				Bar: mo,
				Blockquote: ho,
				Button: fo,
				ClipboardCode: go,
				Code: bo,
				DL: wo,
				Div: yo,
				DocumentWrapper: So,
				EmptyTabContent: vo,
				ErrorFormatter: Co,
				FlexBar: _o,
				Form: ko,
				H1: Ro,
				H2: Eo,
				H3: To,
				H4: Ao,
				H5: xo,
				H6: Oo,
				HR: Lo,
				IconButton: L,
				IconButtonSkeleton: Bo,
				Icons: Po,
				Img: Mo,
				LI: Vo,
				Link: Do,
				ListItem: No,
				Loader: Uo,
				Modal: zo,
				OL: Ho,
				P: Go,
				Placeholder: Fo,
				Pre: qo,
				ProgressSpinner: Wo,
				ResetWrapper: Yo,
				ScrollArea: jo,
				Separator: Ko,
				Spaced: Zo,
				Span: $o,
				StorybookIcon: Jo,
				StorybookLogo: Qo,
				Symbols: Xo,
				SyntaxHighlighter: en,
				TT: tn,
				TabBar: on,
				TabButton: nn,
				TabWrapper: rn,
				Table: ln,
				Tabs: an,
				TabsState: cn,
				TooltipLinkList: q,
				TooltipMessage: sn,
				TooltipNote: un,
				UL: dn,
				WithTooltip: W,
				WithTooltipPure: pn,
				Zoom: In,
				codeCommon: mn,
				components: hn,
				createCopyToClipboardFunction: fn,
				getStoryHref: gn,
				icons: bn,
				interleaveSeparators: wn,
				nameSpaceClassNames: yn,
				resetComponents: Sn,
				withReset: vn,
			} = __STORYBOOK_COMPONENTS__
		f()
		g()
		b()
		var En = __STORYBOOK_THEMING__,
			{
				CacheProvider: Tn,
				ClassNames: An,
				Global: Y,
				ThemeProvider: xn,
				background: On,
				color: Ln,
				convert: Bn,
				create: Pn,
				createCache: Mn,
				createGlobal: Vn,
				createReset: Dn,
				css: Nn,
				darken: Un,
				ensure: zn,
				ignoreSsrWarning: Hn,
				isPropValid: Gn,
				jsx: Fn,
				keyframes: qn,
				lighten: Wn,
				styled: v,
				themes: Yn,
				typography: jn,
				useTheme: Kn,
				withTheme: Zn,
			} = __STORYBOOK_THEMING__
		f()
		g()
		b()
		var er = __STORYBOOK_ICONS__,
			{
				AccessibilityAltIcon: tr,
				AccessibilityIcon: or,
				AccessibilityIgnoredIcon: nr,
				AddIcon: rr,
				AdminIcon: ir,
				AlertAltIcon: lr,
				AlertIcon: ar,
				AlignLeftIcon: cr,
				AlignRightIcon: sr,
				AppleIcon: ur,
				ArrowBottomLeftIcon: dr,
				ArrowBottomRightIcon: pr,
				ArrowDownIcon: Ir,
				ArrowLeftIcon: mr,
				ArrowRightIcon: hr,
				ArrowSolidDownIcon: fr,
				ArrowSolidLeftIcon: gr,
				ArrowSolidRightIcon: br,
				ArrowSolidUpIcon: wr,
				ArrowTopLeftIcon: yr,
				ArrowTopRightIcon: Sr,
				ArrowUpIcon: vr,
				AzureDevOpsIcon: Cr,
				BackIcon: _r,
				BasketIcon: kr,
				BatchAcceptIcon: Rr,
				BatchDenyIcon: Er,
				BeakerIcon: Tr,
				BellIcon: Ar,
				BitbucketIcon: xr,
				BoldIcon: Or,
				BookIcon: Lr,
				BookmarkHollowIcon: Br,
				BookmarkIcon: Pr,
				BottomBarIcon: Mr,
				BottomBarToggleIcon: Vr,
				BoxIcon: Dr,
				BranchIcon: Nr,
				BrowserIcon: ne,
				ButtonIcon: Ur,
				CPUIcon: zr,
				CalendarIcon: Hr,
				CameraIcon: Gr,
				CameraStabilizeIcon: Fr,
				CategoryIcon: qr,
				CertificateIcon: Wr,
				ChangedIcon: Yr,
				ChatIcon: jr,
				CheckIcon: Kr,
				ChevronDownIcon: Zr,
				ChevronLeftIcon: $r,
				ChevronRightIcon: Jr,
				ChevronSmallDownIcon: Qr,
				ChevronSmallLeftIcon: Xr,
				ChevronSmallRightIcon: ei,
				ChevronSmallUpIcon: ti,
				ChevronUpIcon: oi,
				ChromaticIcon: ni,
				ChromeIcon: ri,
				CircleHollowIcon: ii,
				CircleIcon: li,
				ClearIcon: ai,
				CloseAltIcon: ci,
				CloseIcon: si,
				CloudHollowIcon: ui,
				CloudIcon: di,
				CogIcon: pi,
				CollapseIcon: Ii,
				CommandIcon: mi,
				CommentAddIcon: hi,
				CommentIcon: fi,
				CommentsIcon: gi,
				CommitIcon: bi,
				CompassIcon: wi,
				ComponentDrivenIcon: yi,
				ComponentIcon: Si,
				ContrastIcon: vi,
				ContrastIgnoredIcon: Ci,
				ControlsIcon: _i,
				CopyIcon: ki,
				CreditIcon: Ri,
				CrossIcon: Ei,
				DashboardIcon: Ti,
				DatabaseIcon: Ai,
				DeleteIcon: xi,
				DiamondIcon: Oi,
				DirectionIcon: Li,
				DiscordIcon: Bi,
				DocChartIcon: Pi,
				DocListIcon: Mi,
				DocumentIcon: Vi,
				DownloadIcon: Di,
				DragIcon: Ni,
				EditIcon: Ui,
				EllipsisIcon: zi,
				EmailIcon: Hi,
				ExpandAltIcon: Gi,
				ExpandIcon: Fi,
				EyeCloseIcon: qi,
				EyeIcon: Wi,
				FaceHappyIcon: Yi,
				FaceNeutralIcon: ji,
				FaceSadIcon: Ki,
				FacebookIcon: Zi,
				FailedIcon: $i,
				FastForwardIcon: Ji,
				FigmaIcon: Qi,
				FilterIcon: Xi,
				FlagIcon: el,
				FolderIcon: tl,
				FormIcon: ol,
				GDriveIcon: nl,
				GithubIcon: rl,
				GitlabIcon: il,
				GlobeIcon: ll,
				GoogleIcon: al,
				GraphBarIcon: cl,
				GraphLineIcon: sl,
				GraphqlIcon: ul,
				GridAltIcon: dl,
				GridIcon: pl,
				GrowIcon: j,
				HeartHollowIcon: Il,
				HeartIcon: ml,
				HomeIcon: hl,
				HourglassIcon: fl,
				InfoIcon: gl,
				ItalicIcon: bl,
				JumpToIcon: wl,
				KeyIcon: yl,
				LightningIcon: Sl,
				LightningOffIcon: vl,
				LinkBrokenIcon: Cl,
				LinkIcon: _l,
				LinkedinIcon: kl,
				LinuxIcon: Rl,
				ListOrderedIcon: El,
				ListUnorderedIcon: Tl,
				LocationIcon: Al,
				LockIcon: xl,
				MarkdownIcon: Ol,
				MarkupIcon: Ll,
				MediumIcon: Bl,
				MemoryIcon: Pl,
				MenuIcon: Ml,
				MergeIcon: Vl,
				MirrorIcon: Dl,
				MobileIcon: re,
				MoonIcon: Nl,
				NutIcon: Ul,
				OutboxIcon: zl,
				OutlineIcon: Hl,
				PaintBrushIcon: Gl,
				PaperClipIcon: Fl,
				ParagraphIcon: ql,
				PassedIcon: Wl,
				PhoneIcon: Yl,
				PhotoDragIcon: jl,
				PhotoIcon: Kl,
				PhotoStabilizeIcon: Zl,
				PinAltIcon: $l,
				PinIcon: Jl,
				PlayAllHollowIcon: Ql,
				PlayBackIcon: Xl,
				PlayHollowIcon: ea,
				PlayIcon: ta,
				PlayNextIcon: oa,
				PlusIcon: na,
				PointerDefaultIcon: ra,
				PointerHandIcon: ia,
				PowerIcon: la,
				PrintIcon: aa,
				ProceedIcon: ca,
				ProfileIcon: sa,
				PullRequestIcon: ua,
				QuestionIcon: da,
				RSSIcon: pa,
				RedirectIcon: Ia,
				ReduxIcon: ma,
				RefreshIcon: ie,
				ReplyIcon: ha,
				RepoIcon: fa,
				RequestChangeIcon: ga,
				RewindIcon: ba,
				RulerIcon: wa,
				SaveIcon: ya,
				SearchIcon: Sa,
				ShareAltIcon: va,
				ShareIcon: Ca,
				ShieldIcon: _a,
				SideBySideIcon: ka,
				SidebarAltIcon: Ra,
				SidebarAltToggleIcon: Ea,
				SidebarIcon: Ta,
				SidebarToggleIcon: Aa,
				SpeakerIcon: xa,
				StackedIcon: Oa,
				StarHollowIcon: La,
				StarIcon: Ba,
				StatusFailIcon: Pa,
				StatusIcon: Ma,
				StatusPassIcon: Va,
				StatusWarnIcon: Da,
				StickerIcon: Na,
				StopAltHollowIcon: Ua,
				StopAltIcon: za,
				StopIcon: Ha,
				StorybookIcon: Ga,
				StructureIcon: Fa,
				SubtractIcon: qa,
				SunIcon: Wa,
				SupportIcon: Ya,
				SwitchAltIcon: ja,
				SyncIcon: Ka,
				TabletIcon: le,
				ThumbsUpIcon: Za,
				TimeIcon: $a,
				TimerIcon: Ja,
				TransferIcon: K,
				TrashIcon: Qa,
				TwitterIcon: Xa,
				TypeIcon: ec,
				UbuntuIcon: tc,
				UndoIcon: oc,
				UnfoldIcon: nc,
				UnlockIcon: rc,
				UnpinIcon: ic,
				UploadIcon: lc,
				UserAddIcon: ac,
				UserAltIcon: cc,
				UserIcon: sc,
				UsersIcon: uc,
				VSCodeIcon: dc,
				VerifiedIcon: pc,
				VideoIcon: Ic,
				WandIcon: mc,
				WatchIcon: hc,
				WindowsIcon: fc,
				WrenchIcon: gc,
				XIcon: bc,
				YoutubeIcon: wc,
				ZoomIcon: yc,
				ZoomOutIcon: Sc,
				ZoomResetIcon: vc,
				iconList: Cc,
			} = __STORYBOOK_ICONS__
		var $ = Se(ce()),
			B = "storybook/viewport",
			A = "viewport",
			de = {
				mobile1: { name: "Small mobile", styles: { height: "568px", width: "320px" }, type: "mobile" },
				mobile2: { name: "Large mobile", styles: { height: "896px", width: "414px" }, type: "mobile" },
				tablet: { name: "Tablet", styles: { height: "1112px", width: "834px" }, type: "tablet" },
			},
			P = { name: "Reset viewport", styles: { height: "100%", width: "100%" }, type: "desktop" },
			Ce = { [A]: { value: void 0, isRotated: !1 } },
			_e = { viewport: "reset", viewportRotated: !1 },
			ke = globalThis.FEATURES?.viewportStoryGlobals ? Ce : _e,
			pe = (e, t) => e.indexOf(t),
			Re = (e, t) => {
				let l = pe(e, t)
				return l === e.length - 1 ? e[0] : e[l + 1]
			},
			Ee = (e, t) => {
				let l = pe(e, t)
				return l < 1 ? e[e.length - 1] : e[l - 1]
			},
			Ie = async (e, t, l, s) => {
				await e.setAddonShortcut(B, {
					label: "Previous viewport",
					defaultShortcut: ["alt", "shift", "V"],
					actionName: "previous",
					action: () => {
						l({ viewport: Ee(s, t) })
					},
				}),
					await e.setAddonShortcut(B, {
						label: "Next viewport",
						defaultShortcut: ["alt", "V"],
						actionName: "next",
						action: () => {
							l({ viewport: Re(s, t) })
						},
					}),
					await e.setAddonShortcut(B, {
						label: "Reset viewport",
						defaultShortcut: ["alt", "control", "V"],
						actionName: "reset",
						action: () => {
							l(ke)
						},
					})
			},
			Te = v.div({ display: "inline-flex", alignItems: "center" }),
			se = v.div(({ theme: e }) => ({
				display: "inline-block",
				textDecoration: "none",
				padding: 10,
				fontWeight: e.typography.weight.bold,
				fontSize: e.typography.size.s2 - 1,
				lineHeight: "1",
				height: 40,
				border: "none",
				borderTop: "3px solid transparent",
				borderBottom: "3px solid transparent",
				background: "transparent",
			})),
			Ae = v(L)(() => ({ display: "inline-flex", alignItems: "center" })),
			xe = v.div(({ theme: e }) => ({ fontSize: e.typography.size.s2 - 1, marginLeft: 10 })),
			Oe = {
				desktop: c.createElement(ne, null),
				mobile: c.createElement(re, null),
				tablet: c.createElement(le, null),
				other: c.createElement(V, null),
			},
			Le = ({ api: e }) => {
				let t = F(A),
					[l, s, a] = G(),
					[w, p] = z(!1),
					{ options: o = de, disable: i } = t || {},
					m = l?.[A] || {},
					n = m.value,
					I = m.isRotated,
					r = o[n] || P,
					u = w || r !== P,
					d = A in a,
					h = Object.keys(o).length
				if (
					(O(() => {
						Ie(e, n, s, Object.keys(o))
					}, [o, n, s, e]),
					r.styles === null || !o || h < 1)
				)
					return null
				if (typeof r.styles == "function")
					return (
						console.warn(
							"Addon Viewport no longer supports dynamic styles using a function, use css calc() instead",
						),
						null
					)
				let y = I ? r.styles.height : r.styles.width,
					E = I ? r.styles.width : r.styles.height
				return i
					? null
					: c.createElement(Be, {
							item: r,
							updateGlobals: s,
							viewportMap: o,
							viewportName: n,
							isRotated: I,
							setIsTooltipVisible: p,
							isLocked: d,
							isActive: u,
							width: y,
							height: E,
						})
			},
			Be = c.memo(function (e) {
				let {
						item: t,
						viewportMap: l,
						viewportName: s,
						isRotated: a,
						updateGlobals: w,
						setIsTooltipVisible: p,
						isLocked: o,
						isActive: i,
						width: m,
						height: n,
					} = e,
					I = X((r) => w({ [A]: r }), [w])
				return c.createElement(
					V,
					null,
					c.createElement(
						W,
						{
							placement: "bottom",
							tooltip: ({ onHide: r }) =>
								c.createElement(q, {
									links: [
										...(length > 0 && t !== P
											? [
													{
														id: "reset",
														title: "Reset viewport",
														icon: c.createElement(ie, null),
														onClick: () => {
															I({ value: void 0, isRotated: !1 }), r()
														},
													},
												]
											: []),
										...Object.entries(l).map(([u, d]) => ({
											id: u,
											title: d.name,
											icon: Oe[d.type],
											active: u === s,
											onClick: () => {
												I({ value: u, isRotated: !1 }), r()
											},
										})),
									].flat(),
								}),
							closeOnOutsideClick: !0,
							onVisibleChange: p,
						},
						c.createElement(
							Ae,
							{
								disabled: o,
								key: "viewport",
								title: "Change the size of the preview",
								active: i,
								onDoubleClick: () => {
									I({ value: void 0, isRotated: !1 })
								},
							},
							c.createElement(j, null),
							t !== P ? c.createElement(xe, null, t.name, " ", a ? "(L)" : "(P)") : null,
						),
					),
					c.createElement(Y, { styles: { 'iframe[data-is-storybook="true"]': { width: m, height: n } } }),
					t !== P
						? c.createElement(
								Te,
								null,
								c.createElement(se, { title: "Viewport width" }, m.replace("px", "")),
								o
									? "/"
									: c.createElement(
											L,
											{
												key: "viewport-rotate",
												title: "Rotate viewport",
												onClick: () => {
													I({ value: s, isRotated: !a })
												},
											},
											c.createElement(K, null),
										),
								c.createElement(se, { title: "Viewport height" }, n.replace("px", "")),
							)
						: null,
				)
			}),
			Pe = (0, $.default)(50)((e) => [
				...Me,
				...Object.entries(e).map(([t, { name: l, ...s }]) => ({ ...s, id: t, title: l })),
			]),
			D = { id: "reset", title: "Reset viewport", styles: null, type: "other" },
			Me = [D],
			Ve = (0, $.default)(50)((e, t, l, s) =>
				e
					.filter((a) => a.id !== D.id || t.id !== a.id)
					.map((a) => ({
						...a,
						onClick: () => {
							l({ viewport: a.id }), s()
						},
					})),
			),
			De = ({ width: e, height: t, ...l }) => ({ ...l, height: e, width: t }),
			Ne = v.div({ display: "inline-flex", alignItems: "center" }),
			ue = v.div(({ theme: e }) => ({
				display: "inline-block",
				textDecoration: "none",
				padding: 10,
				fontWeight: e.typography.weight.bold,
				fontSize: e.typography.size.s2 - 1,
				lineHeight: "1",
				height: 40,
				border: "none",
				borderTop: "3px solid transparent",
				borderBottom: "3px solid transparent",
				background: "transparent",
			})),
			Ue = v(L)(() => ({ display: "inline-flex", alignItems: "center" })),
			ze = v.div(({ theme: e }) => ({ fontSize: e.typography.size.s2 - 1, marginLeft: 10 })),
			He = (e, t, l) => {
				if (t === null) return
				let s = typeof t == "function" ? t(e) : t
				return l ? De(s) : s
			},
			Ge = Q(function () {
				let [e, t] = G(),
					{ viewports: l = de, defaultOrientation: s, defaultViewport: a, disable: w } = F(A, {}),
					p = Pe(l),
					o = oe(),
					[i, m] = z(!1)
				a &&
					!p.find((u) => u.id === a) &&
					console.warn(
						`Cannot find "defaultViewport" of "${a}" in addon-viewport configs, please check the "viewports" setting in the configuration.`,
					),
					O(() => {
						Ie(o, e, t, Object.keys(l))
					}, [l, e, e.viewport, t, o]),
					O(() => {
						let u = s === "landscape"
						;((a && e.viewport !== a) || (s && e.viewportRotated !== u)) &&
							t({ viewport: a, viewportRotated: u })
					}, [s, a, t])
				let n =
						p.find((u) => u.id === e.viewport) ||
						p.find((u) => u.id === a) ||
						p.find((u) => u.default) ||
						D,
					I = ee(),
					r = He(I.current, n.styles, e.viewportRotated)
				return (
					O(() => {
						I.current = r
					}, [n]),
					w || Object.entries(l).length === 0
						? null
						: c.createElement(
								V,
								null,
								c.createElement(
									W,
									{
										placement: "top",
										tooltip: ({ onHide: u }) => c.createElement(q, { links: Ve(p, n, t, u) }),
										closeOnOutsideClick: !0,
										onVisibleChange: m,
									},
									c.createElement(
										Ue,
										{
											key: "viewport",
											title: "Change the size of the preview",
											active: i || !!r,
											onDoubleClick: () => {
												t({ viewport: D.id })
											},
										},
										c.createElement(j, null),
										r
											? c.createElement(
													ze,
													null,
													e.viewportRotated ? `${n.title} (L)` : `${n.title} (P)`,
												)
											: null,
									),
								),
								r
									? c.createElement(
											Ne,
											null,
											c.createElement(Y, {
												styles: {
													'iframe[data-is-storybook="true"]': {
														...(r || { width: "100%", height: "100%" }),
													},
												},
											}),
											c.createElement(ue, { title: "Viewport width" }, r.width.replace("px", "")),
											c.createElement(
												L,
												{
													key: "viewport-rotate",
													title: "Rotate viewport",
													onClick: () => {
														t({ viewportRotated: !e.viewportRotated })
													},
												},
												c.createElement(K, null),
											),
											c.createElement(
												ue,
												{ title: "Viewport height" },
												r.height.replace("px", ""),
											),
										)
									: null,
							)
				)
			})
		H.register(B, (e) => {
			H.add(B, {
				title: "viewport / media-queries",
				type: te.TOOL,
				match: ({ viewMode: t, tabId: l }) => t === "story" && !l,
				render: () => (FEATURES?.viewportStoryGlobals ? U(Le, { api: e }) : U(Ge, null)),
			})
		})
	})()
} catch (e) {
	console.error("[Storybook] One of your manager-entries failed: " + import.meta.url, e)
}
