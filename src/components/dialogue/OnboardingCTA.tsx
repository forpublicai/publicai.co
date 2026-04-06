"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { totalParticipation } from "@/components/dialogue/mockAnalytics";

interface OnboardingCTAProps {
  onCopySummary?: () => void;
}

export default function OnboardingCTA({ onCopySummary }: OnboardingCTAProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-6 rounded-2xl border border-border bg-background p-6 text-center"
    >
      <p className="text-sm text-muted-foreground">
        Your voice joins{" "}
        <span className="font-semibold text-foreground">
          {totalParticipation.toLocaleString()}
        </span>{" "}
        others shaping Swiss AI policy.
      </p>

      <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <a
          href="https://chat.publicai.co"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-red-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600"
        >
          Experience Apertus yourself
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </a>
        {onCopySummary && (
          <button
            onClick={onCopySummary}
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Copy summary
          </button>
        )}
      </div>

      <Link
        href="/"
        className="mt-4 inline-block text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        &larr; Back to Public AI
      </Link>
    </motion.div>
  );
}
