"use client";

import { motion } from "motion/react";
import type { OpinionPoint } from "./OpinionLandscape";

interface OpinionGridProps {
  opinions: OpinionPoint[];
}

const CLUSTER_BORDERS = [
  "border-red-200 dark:border-red-900",
  "border-blue-200 dark:border-blue-900",
  "border-green-200 dark:border-green-900",
  "border-amber-200 dark:border-amber-900",
  "border-violet-200 dark:border-violet-900",
  "border-pink-200 dark:border-pink-900",
  "border-teal-200 dark:border-teal-900",
];

export default function OpinionGrid({ opinions }: OpinionGridProps) {
  if (opinions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        Opinions will appear here as participants share their views.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Individual Opinions ({opinions.length})
      </h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {opinions.slice(0, 30).map((opinion, i) => (
          <motion.div
            key={opinion.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className={`rounded-xl border p-4 ${
              opinion.clusterId !== null
                ? CLUSTER_BORDERS[opinion.clusterId % CLUSTER_BORDERS.length]
                : "border-border"
            }`}
          >
            <p className="text-sm leading-relaxed text-foreground">
              {opinion.text}
            </p>
            {opinion.clusterLabel && (
              <p className="mt-2 text-xs text-muted-foreground">
                {opinion.clusterLabel}
              </p>
            )}
          </motion.div>
        ))}
      </div>
      {opinions.length > 30 && (
        <p className="text-center text-xs text-muted-foreground">
          Showing 30 of {opinions.length} opinions
        </p>
      )}
    </div>
  );
}
