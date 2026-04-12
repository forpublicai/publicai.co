"use client";

import { motion } from "motion/react";

interface DeliberationHeroProps {
  question: string;
  description?: string | null;
  participantCount: number;
  opinionCount: number;
  consensus: string | null;
  onShareView: () => void;
}

export default function DeliberationHero({
  question,
  description,
  participantCount,
  opinionCount,
  consensus,
  onShareView,
}: DeliberationHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-background">
      {/* Glow effect */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-red-500/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-red-500/10 blur-3xl" />
      </div>

      <div className="relative px-6 py-8 sm:px-10 sm:py-10 space-y-6">
        {/* Question + stats */}
        <div className="space-y-3">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {question}
          </h1>
          {description && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>
                <span className="font-semibold text-foreground">
                  {participantCount}
                </span>{" "}
                participants
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span>
                <span className="font-semibold text-foreground">
                  {opinionCount}
                </span>{" "}
                opinions
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Living Consensus */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600 dark:bg-red-950 dark:text-red-400">
            <motion.span
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block h-1.5 w-1.5 rounded-full bg-red-500"
            />
            Living Consensus
          </div>

          {consensus ? (
            <motion.blockquote
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg font-medium leading-relaxed text-foreground sm:text-xl"
            >
              &ldquo;{consensus}&rdquo;
            </motion.blockquote>
          ) : (
            <p className="text-lg text-muted-foreground">
              No consensus yet. Be among the first to share your perspective.
            </p>
          )}

          <button
            onClick={onShareView}
            className="inline-flex items-center gap-2 rounded-full bg-red-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-red-600"
          >
            Share Your View
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
