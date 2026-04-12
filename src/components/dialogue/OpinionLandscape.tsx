"use client";

import { useRef, useEffect } from "react";

export interface OpinionPoint {
  id: string;
  x: number;
  y: number;
  clusterId: number | null;
  clusterLabel: string | null;
  text: string;
}

interface OpinionLandscapeProps {
  points: OpinionPoint[];
}

const CLUSTER_COLORS = [
  "#ef4444",
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
];

export default function OpinionLandscape({ points }: OpinionLandscapeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const pad = 20;

    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = "rgba(0,0,0,0.02)";
    ctx.fillRect(0, 0, w, h);

    if (points.length === 0) {
      ctx.fillStyle = "#a1a1aa";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Opinions will appear here", w / 2, h / 2);
      return;
    }

    for (const p of points) {
      const px = pad + ((p.x + 1) / 2) * (w - 2 * pad);
      const py = pad + ((p.y + 1) / 2) * (h - 2 * pad);
      const color =
        p.clusterId !== null
          ? CLUSTER_COLORS[p.clusterId % CLUSTER_COLORS.length]
          : "#94a3b8";

      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.7;
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // Draw cluster labels
    const labelsByCluster = new Map<number, { x: number; y: number; label: string; count: number }>();
    for (const p of points) {
      if (p.clusterId === null || !p.clusterLabel) continue;
      const existing = labelsByCluster.get(p.clusterId);
      if (existing) {
        existing.x += p.x;
        existing.y += p.y;
        existing.count++;
      } else {
        labelsByCluster.set(p.clusterId, {
          x: p.x,
          y: p.y,
          label: p.clusterLabel,
          count: 1,
        });
      }
    }

    for (const [clusterId, data] of labelsByCluster) {
      const cx = pad + ((data.x / data.count + 1) / 2) * (w - 2 * pad);
      const cy = pad + ((data.y / data.count + 1) / 2) * (h - 2 * pad);
      const color = CLUSTER_COLORS[clusterId % CLUSTER_COLORS.length];

      ctx.fillStyle = color;
      ctx.font = "bold 10px sans-serif";
      ctx.textAlign = "center";
      ctx.globalAlpha = 0.8;
      ctx.fillText(data.label, cx, cy - 8);
      ctx.globalAlpha = 1;
    }
  }, [points]);

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Opinion Landscape
      </h3>
      <canvas
        ref={canvasRef}
        className="h-64 w-full rounded-xl border border-border sm:h-80"
      />
    </div>
  );
}
