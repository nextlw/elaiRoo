try {
	;(() => {
		var O = __STORYBOOK_API__,
			{
				ActiveTabs: M,
				Consumer: R,
				ManagerContext: T,
				Provider: h,
				RequestResponseError: g,
				addons: u,
				combineParameters: C,
				controlOrMetaKey: U,
				controlOrMetaSymbol: w,
				eventMatchesShortcut: N,
				eventToShortcut: f,
				experimental_MockUniversalStore: v,
				experimental_UniversalStore: A,
				experimental_requestResponse: x,
				experimental_useUniversalStore: P,
				isMacLike: B,
				isShortcutTaken: E,
				keyToSymbol: I,
				merge: K,
				mockChannel: G,
				optionOrAltSymbol: L,
				shortcutMatchesShortcut: Y,
				shortcutToHumanString: q,
				types: D,
				useAddonState: F,
				useArgTypes: H,
				useArgs: j,
				useChannel: V,
				useGlobalTypes: z,
				useGlobals: J,
				useParameter: Q,
				useSharedState: W,
				useStoryPrepared: X,
				useStorybookApi: Z,
				useStorybookState: $,
			} = __STORYBOOK_API__
		var i = (() => {
				let e
				return (
					typeof window < "u"
						? (e = window)
						: typeof globalThis < "u"
							? (e = globalThis)
							: typeof window < "u"
								? (e = window)
								: typeof self < "u"
									? (e = self)
									: (e = {}),
					e
				)
			})(),
			m = "tag-filters",
			p = "static-filter"
		u.register(m, (e) => {
			let a = Object.entries(i.TAGS_OPTIONS ?? {}).reduce((o, t) => {
				let [r, n] = t
				return n.excludeFromSidebar && (o[r] = !0), o
			}, {})
			e.experimental_setFilter(p, (o) => {
				let t = o.tags ?? []
				return (t.includes("dev") || o.type === "docs") && t.filter((r) => a[r]).length === 0
			})
		})
	})()
} catch (e) {
	console.error("[Storybook] One of your manager-entries failed: " + import.meta.url, e)
}
