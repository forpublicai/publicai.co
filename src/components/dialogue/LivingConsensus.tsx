"use client";

import { motion } from "motion/react";

interface LivingConsensusProps {
  statement: string | null;
  onShareView: () => void;
  loading?: boolean;
}

export default function LivingConsensus({
  statement,
  onShareView,
  loading,
}: LivingConsensusProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-background">
      {/* Glow effect */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-red-500/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-red-500/10 blur-3xl" />
      </div>

      <div className="relative px-6 py-8 sm:px-10 sm:py-12">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600 dark:bg-red-950 dark:text-red-400">
          <motion.span
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block h-1.5 w-1.5 rounded-full bg-red-500"
          />
          Living Consensus
        </div>

        {loading ? (
          <div className="space-y-3">
            <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-6 w-1/2 animate-pulse rounded bg-muted" />
          </div>
        ) : statement ? (
          <motion.blockquote
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg font-medium leading-relaxed text-foreground sm:text-xl"
          >
            &ldquo;{statement}&rdquo;
          </motion.blockquote>
        ) : (
          <p className="text-lg text-muted-foreground">
            No consensus yet. Be among the first to share your perspective.
          </p>
        )}

        <div className="mt-6">
          <button
            onClick={onShareView}
            className="inline-flex items-center gap-2 rounded-full bg-red-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-red-600"
          >
            Share Your View
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
