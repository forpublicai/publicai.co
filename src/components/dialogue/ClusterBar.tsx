"use client";

import { motion } from "motion/react";

interface ClusterInfo {
  id: number;
  label: string;
  count: number;
}

interface ClusterBarProps {
  clusters: ClusterInfo[];
  total: number;
}

const CLUSTER_COLORS = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-amber-500",
  "bg-violet-500",
  "bg-pink-500",
  "bg-teal-500",
];

export default function ClusterBar({ clusters, total }: ClusterBarProps) {
  if (clusters.length === 0 || total === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Opinion Clusters
      </h3>

      {/* Stacked bar */}
      <div className="flex h-4 overflow-hidden rounded-full bg-muted">
        {clusters.map((cluster, i) => {
          const pct = (cluster.count / total) * 100;
          return (
            <motion.div
              key={cluster.id}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`${CLUSTER_COLORS[cluster.id % CLUSTER_COLORS.length]}`}
              title={`${cluster.label}: ${cluster.count} (${Math.round(pct)}%)`}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {clusters.map((cluster) => (
          <div key={cluster.id} className="flex items-center gap-1.5 text-xs">
            <span
              className={`h-2.5 w-2.5 rounded-full ${CLUSTER_COLORS[cluster.id % CLUSTER_COLORS.length]}`}
            />
            <span className="text-muted-foreground">
              {cluster.label}{" "}
              <span className="font-medium text-foreground">
                ({Math.round((cluster.count / total) * 100)}%)
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
