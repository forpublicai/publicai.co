"use client";

import { motion } from "motion/react";

interface RankingResultProps {
  items: { label: string; avgRank: number }[];
}

export default function RankingResult({ items }: RankingResultProps) {
  const sorted = [...items].sort((a, b) => a.avgRank - b.avgRank);
  const maxRank = Math.max(...items.map((i) => i.avgRank));

  return (
    <div className="space-y-3 w-full">
      {sorted.map((item, i) => (
        <motion.div
          key={item.label}
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
        >
          <span className="text-lg font-bold text-red-600 w-8 text-center tabular-nums">
            {i + 1}
          </span>
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-700">{item.label}</span>
              <span className="text-gray-500 tabular-nums">avg {item.avgRank.toFixed(1)}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-red-500"
                initial={{ width: 0 }}
                animate={{ width: `${((maxRank - item.avgRank + 1) / maxRank) * 100}%` }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
