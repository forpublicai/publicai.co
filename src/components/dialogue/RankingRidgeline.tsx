"use client";

import type { StatementData } from "./StatementList";

interface RankingRidgelineProps {
  statements: StatementData[];
}

function densityCurve(
  ranks: number[],
  numStatements: number,
  width: number,
  height: number
): string {
  if (ranks.length === 0) return "";

  // Build histogram
  const bins = new Array(numStatements).fill(0);
  for (const r of ranks) {
    const idx = Math.min(Math.max(Math.round(r) - 1, 0), numStatements - 1);
    bins[idx]++;
  }

  // Normalize
  const maxCount = Math.max(...bins, 1);
  const normalized = bins.map((b) => b / maxCount);

  // Build SVG path
  const stepW = width / numStatements;
  const points = normalized.map((v, i) => ({
    x: i * stepW + stepW / 2,
    y: height - v * height * 0.8,
  }));

  let d = `M 0 ${height}`;
  for (const p of points) {
    d += ` L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  }
  d += ` L ${width} ${height} Z`;

  return d;
}

const COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

export default function RankingRidgeline({
  statements,
}: RankingRidgelineProps) {
  if (statements.length === 0) return null;

  const hasRanks = statements.some((s) => s.rank_distribution.length > 0);
  if (!hasRanks) {
    return (
      <div className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
        Ranking distributions will appear after consensus is generated.
      </div>
    );
  }

  const rowHeight = 40;
  const width = 240;
  const totalHeight = statements.length * rowHeight + 20;
  const numStatements = statements.length;

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Rank Distributions
      </h3>
      <svg
        viewBox={`0 0 ${width + 40} ${totalHeight}`}
        className="w-full h-auto"
      >
        {statements.map((stmt, i) => {
          const y = i * rowHeight + 10;
          const path = densityCurve(
            stmt.rank_distribution,
            numStatements,
            width,
            rowHeight - 4
          );

          return (
            <g key={stmt.id} transform={`translate(30, ${y})`}>
              <text
                x={-4}
                y={rowHeight / 2}
                textAnchor="end"
                dominantBaseline="central"
                className="fill-muted-foreground"
                fontSize="10"
              >
                #{stmt.social_ranking ?? i + 1}
              </text>
              {path && (
                <path
                  d={path}
                  fill={COLORS[i % COLORS.length]}
                  fillOpacity={0.3}
                  stroke={COLORS[i % COLORS.length]}
                  strokeWidth={1.5}
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
