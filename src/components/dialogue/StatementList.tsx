"use client";

import { motion } from "motion/react";

export interface StatementData {
  id: string;
  statement_text: string;
  social_ranking: number | null;
  is_winner: boolean;
  rank_distribution: number[];
  projected_x: number | null;
  projected_y: number | null;
}

interface StatementListProps {
  statements: StatementData[];
}

export default function StatementList({ statements }: StatementListProps) {
  if (statements.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        Consensus statements will appear after enough opinions are collected.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Ranked Statements
      </h3>
      {statements.map((stmt, i) => (
        <motion.div
          key={stmt.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className={`rounded-xl border p-4 ${
            stmt.is_winner
              ? "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30"
              : "border-border bg-background"
          }`}
        >
          <div className="flex items-start gap-3">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                stmt.is_winner
                  ? "bg-red-500 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              #{stmt.social_ranking ?? i + 1}
            </span>
            <p className="text-sm leading-relaxed text-foreground">
              {stmt.statement_text}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
