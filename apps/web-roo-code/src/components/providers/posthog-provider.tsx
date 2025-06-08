"use client"

import { usePathname, useSearchParams } from "next/navigation"
import posthog from "posthog-js"
import { PostHogProvider as OriginalPostHogProvider } from "posthog-js/react"
import { useEffect, Suspense } from "react"

// Create a separate component for analytics tracking that uses useSearchParams
function PageViewTracker() {
	const pathname = usePathname()
	const searchParams = useSearchParams()

	// Track page views
	useEffect(() => {
		if (pathname) {
			let url = window.location.origin + pathname
			if (searchParams && searchParams.toString()) {
				url = url + `?${searchParams.toString()}`
			}
			posthog.capture("$pageview", {
				$current_url: url,
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname, searchParams.toString()])

	return null
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
	useEffect(() => {
		posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
			api_host: "/ingest",
			ui_host: "https://us.posthog.com",
			capture_pageview: "history_change",
			capture_pageleave: true,
			capture_exceptions: true,
			debug: process.env.NODE_ENV === "development",
		})
	}, [])

	return (
		<OriginalPostHogProvider client={posthog}>
			<Suspense fallback={null}>
				<PageViewTracker />
			</Suspense>
			{children}
		</OriginalPostHogProvider>
	)
}
