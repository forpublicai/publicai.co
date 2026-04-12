"use client";

import { motion } from "motion/react";

interface ThemeData {
  theme: string;
  positive: number;
  mixed: number;
  negative: number;
  total: number;
}

interface ThemeBreakdownProps {
  themes: ThemeData[];
}

export default function ThemeBreakdown({ themes }: ThemeBreakdownProps) {
  if (themes.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-background p-6">
        <h2 className="text-lg font-semibold text-foreground">
          Theme Breakdown
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          No survey data yet. Be the first to share your views.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-background p-6">
      <h2 className="text-lg font-semibold text-foreground">
        Theme Breakdown
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Aggregate sentiment across all survey responses
      </p>

      <div className="mt-6 space-y-4">
        {themes.map((theme, i) => {
          const pPct = theme.total > 0 ? (theme.positive / theme.total) * 100 : 0;
          const mPct = theme.total > 0 ? (theme.mixed / theme.total) * 100 : 0;
          const nPct = theme.total > 0 ? (theme.negative / theme.total) * 100 : 0;

          return (
            <motion.div
              key={theme.theme}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="mb-1.5 flex items-baseline justify-between">
                <span className="text-sm font-medium text-foreground">
                  {theme.theme}
                </span>
                <span className="text-xs text-muted-foreground">
                  {theme.total} responses
                </span>
              </div>
              <div className="flex h-3 overflow-hidden rounded-full bg-muted">
                {pPct > 0 && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pPct}%` }}
                    transition={{ duration: 0.6, delay: i * 0.05 }}
                    className="bg-emerald-500"
                  />
                )}
                {mPct > 0 && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${mPct}%` }}
                    transition={{ duration: 0.6, delay: i * 0.05 + 0.1 }}
                    className="bg-amber-400"
                  />
                )}
                {nPct > 0 && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${nPct}%` }}
                    transition={{ duration: 0.6, delay: i * 0.05 + 0.2 }}
                    className="bg-red-400"
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
          Positive
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
          Mixed
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full bg-red-400" />
          Negative
        </span>
      </div>
    </div>
  );
}
