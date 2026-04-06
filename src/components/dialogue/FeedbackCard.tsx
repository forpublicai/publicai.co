"use client";

import { motion } from "motion/react";

export interface FeedbackData {
  cantonHighlight: string;
  topicCovered: string;
  insightTeaser: string;
}

export default function FeedbackCard({ data }: { data: FeedbackData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="my-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900 dark:bg-red-950/30"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600 dark:bg-red-900 dark:text-red-300">
          {data.cantonHighlight}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-red-600 dark:text-red-400">
            {data.topicCovered}
          </p>
          <p className="mt-0.5 text-sm text-foreground">{data.insightTeaser}</p>
        </div>
      </div>
    </motion.div>
  );
}
