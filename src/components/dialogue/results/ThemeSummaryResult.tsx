"use client";

import { motion } from "motion/react";
import type { ThemePill } from "../surveyData";

interface ThemeSummaryResultProps {
  themes: ThemePill[];
}

export default function ThemeSummaryResult({ themes }: ThemeSummaryResultProps) {
  const maxCount = Math.max(...themes.map((t) => t.count));

  return (
    <div className="space-y-2 w-full">
      <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">
        Common themes from all participants
      </p>
      <div className="flex flex-wrap gap-2">
        {themes.map((theme, i) => {
          const opacity = 0.4 + 0.6 * (theme.count / maxCount);
          return (
            <motion.span
              key={theme.label}
              className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
            >
              <span className="text-gray-700" style={{ opacity }}>
                {theme.label}
              </span>
              <span className="text-xs text-red-500 font-medium tabular-nums">
                {theme.count.toLocaleString()}
              </span>
            </motion.span>
          );
        })}
      </div>
    </div>
  );
}
