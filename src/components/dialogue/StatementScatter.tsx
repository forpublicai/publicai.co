"use client";

import { useRef, useEffect } from "react";

interface ScatterPoint {
  x: number;
  y: number;
  label?: string;
  isWinner?: boolean;
}

interface StatementScatterProps {
  points: ScatterPoint[];
}

export default function StatementScatter({ points }: StatementScatterProps) {
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
      ctx.fillText("No data yet", w / 2, h / 2);
      return;
    }

    for (const p of points) {
      const px = pad + ((p.x + 1) / 2) * (w - 2 * pad);
      const py = pad + ((p.y + 1) / 2) * (h - 2 * pad);

      ctx.beginPath();
      ctx.arc(px, py, p.isWinner ? 8 : 5, 0, Math.PI * 2);
      ctx.fillStyle = p.isWinner ? "#ef4444" : "#94a3b8";
      ctx.fill();
      ctx.strokeStyle = p.isWinner ? "#dc2626" : "#64748b";
      ctx.lineWidth = 1;
      ctx.stroke();

      if (p.label) {
        ctx.fillStyle = "#374151";
        ctx.font = "10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(p.label, px, py - 10);
      }
    }
  }, [points]);

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Statement Embedding Space
      </h3>
      <canvas
        ref={canvasRef}
        className="h-48 w-full rounded-xl border border-border"
      />
    </div>
  );
}
