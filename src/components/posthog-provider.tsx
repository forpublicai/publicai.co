"use client";

import React, { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";

/**
 * Client component to track route changes and search params in Next.js App Router.
 * Wrapped in Suspense to satisfy Next.js useSearchParams requirements during static generation.
 */
function PostHogPageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ph = usePostHog();

  useEffect(() => {
    if (pathname && ph && typeof window !== "undefined") {
      let url = window.origin + pathname;
      const query = searchParams?.toString();
      if (query) {
        url += `?${query}`;
      }
      ph.capture("$pageview", {
        $current_url: url,
        $pathname: pathname,
      });
    }
  }, [pathname, searchParams, ph]);

  return null;
}

export interface PostHogProviderProps {
  children: React.ReactNode;
}

/**
 * Universal PostHog Provider for Next.js App Router.
 * Initializes web analytics, session replay, performance & Web Vitals autocapture,
 * and handles SPA route transitions.
 */
export function PostHogProvider({ children }: PostHogProviderProps) {
  useEffect(() => {
    const posthogKey =
      process.env.NEXT_PUBLIC_POSTHOG_KEY ||
      process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

    const posthogHost =
      process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";

    if (typeof window !== "undefined" && posthogKey && !posthog.__loaded) {
      posthog.init(posthogKey, {
        api_host: posthogHost,
        ui_host: "https://eu.posthog.com",
        person_profiles: "identified_only", // Optimal for anonymous traffic & privacy
        capture_pageview: false, // Explicitly false so PostHogPageViewTracker handles SPA transitions cleanly
        capture_pageleave: true, // Tracks dwell time and bounce rates accurately
        autocapture: true, // Auto-tracks clicks, button taps, and form interactions
        capture_performance: true, // Captures Core Web Vitals (LCP, FID, CLS, TTFB)
        session_recording: {
          maskAllInputs: true, // Masks text, passwords, and sensitive inputs by default
          maskInputOptions: {
            password: true,
          },
        },
      });
    }
  }, []);

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageViewTracker />
      </Suspense>
      {children}
    </PHProvider>
  );
}

/**
 * Helper to safely track custom client-side events across any component
 */
export function trackEvent(
  eventName: string,
  properties?: Record<string, unknown>
) {
  if (typeof window !== "undefined" && posthog?.__loaded) {
    posthog.capture(eventName, properties);
  }
}
