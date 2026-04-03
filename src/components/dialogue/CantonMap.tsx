"use client";

import { useState } from "react";
import { cantonData, type CantonData } from "./mockAnalytics";

const maxParticipation = Math.max(...cantonData.map((c) => c.participation));

function getColor(participation: number): string {
  const intensity = participation / maxParticipation;
  // Interpolate from light gray (#e5e7eb) to primary red (#ef4444)
  const r = Math.round(229 + (239 - 229) * intensity);
  const g = Math.round(231 - (231 - 68) * intensity);
  const b = Math.round(235 - (235 - 68) * intensity);
  return `rgb(${r}, ${g}, ${b})`;
}

// Simplified canton paths (approximate boundaries)
const cantonPaths: Record<string, string> = {
  ZH: "M 295 115 L 330 100 L 355 115 L 350 145 L 320 155 L 290 140 Z",
  BE: "M 170 180 L 220 155 L 270 170 L 280 220 L 260 270 L 210 290 L 170 260 L 155 220 Z",
  LU: "M 275 170 L 310 160 L 325 185 L 310 210 L 280 210 L 265 190 Z",
  UR: "M 310 215 L 335 205 L 345 240 L 330 270 L 310 260 L 305 235 Z",
  SZ: "M 325 185 L 355 175 L 365 200 L 350 215 L 330 210 Z",
  OW: "M 280 215 L 310 210 L 310 240 L 290 245 L 275 235 Z",
  NW: "M 290 245 L 310 240 L 315 260 L 295 265 L 285 255 Z",
  GL: "M 365 200 L 395 190 L 405 215 L 390 235 L 370 225 L 360 210 Z",
  ZG: "M 310 160 L 330 155 L 335 175 L 325 185 L 310 180 Z",
  FR: "M 140 220 L 175 205 L 195 230 L 185 265 L 155 275 L 135 250 Z",
  SO: "M 210 130 L 250 120 L 265 140 L 255 160 L 220 160 L 205 145 Z",
  BS: "M 230 90 L 250 85 L 255 100 L 240 105 Z",
  BL: "M 205 95 L 230 90 L 240 105 L 255 100 L 250 120 L 220 125 L 200 110 Z",
  SH: "M 310 75 L 340 65 L 355 80 L 340 95 L 315 90 Z",
  AR: "M 395 150 L 415 140 L 425 155 L 410 165 L 395 160 Z",
  AI: "M 405 165 L 420 158 L 428 172 L 415 180 Z",
  SG: "M 355 115 L 395 100 L 420 120 L 415 140 L 395 150 L 395 190 L 365 200 L 355 175 L 350 145 Z",
  GR: "M 345 240 L 395 220 L 440 240 L 460 290 L 430 330 L 380 330 L 350 300 L 340 270 Z",
  AG: "M 250 120 L 295 115 L 305 135 L 290 155 L 265 155 L 250 140 Z",
  TG: "M 340 95 L 375 85 L 395 100 L 380 115 L 355 115 L 340 105 Z",
  TI: "M 300 300 L 340 290 L 360 330 L 340 380 L 310 385 L 290 350 Z",
  VD: "M 80 230 L 140 220 L 155 275 L 140 310 L 100 320 L 65 290 L 60 260 Z",
  VS: "M 140 310 L 210 290 L 260 300 L 300 300 L 290 350 L 240 370 L 180 360 L 140 340 Z",
  NE: "M 130 175 L 170 165 L 175 195 L 150 210 L 130 200 Z",
  GE: "M 50 285 L 75 270 L 85 295 L 70 315 L 50 310 Z",
  JU: "M 130 110 L 170 100 L 185 125 L 170 150 L 140 150 L 125 135 Z",
};

export default function CantonMap() {
  const [hoveredCanton, setHoveredCanton] = useState<CantonData | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <svg
        viewBox="30 50 450 350"
        className="w-full h-auto"
        onMouseLeave={() => setHoveredCanton(null)}
      >
        {cantonData.map((canton) => (
          <path
            key={canton.id}
            d={cantonPaths[canton.id] || ""}
            data-canton={canton.id}
            fill={getColor(canton.participation)}
            stroke="white"
            strokeWidth="1.5"
            className="cursor-pointer transition-opacity duration-150 hover:opacity-80"
            onMouseEnter={(e) => {
              setHoveredCanton(canton);
              const svg = e.currentTarget.ownerSVGElement;
              if (svg) {
                const rect = svg.getBoundingClientRect();
                const pt = svg.createSVGPoint();
                pt.x = e.clientX;
                pt.y = e.clientY;
                setTooltipPos({
                  x: e.clientX - rect.left,
                  y: e.clientY - rect.top,
                });
              }
            }}
            onMouseMove={(e) => {
              const svg = e.currentTarget.ownerSVGElement;
              if (svg) {
                const rect = svg.getBoundingClientRect();
                setTooltipPos({
                  x: e.clientX - rect.left,
                  y: e.clientY - rect.top,
                });
              }
            }}
          />
        ))}
        {/* Canton labels */}
        {cantonData.map((canton) => {
          const path = cantonPaths[canton.id];
          if (!path) return null;
          // Calculate rough center from path
          const nums = path.match(/\d+/g)?.map(Number) || [];
          const xs = nums.filter((_, i) => i % 2 === 0);
          const ys = nums.filter((_, i) => i % 2 === 1);
          const cx = xs.reduce((a, b) => a + b, 0) / xs.length;
          const cy = ys.reduce((a, b) => a + b, 0) / ys.length;
          return (
            <text
              key={`label-${canton.id}`}
              x={cx}
              y={cy}
              textAnchor="middle"
              dominantBaseline="central"
              className="pointer-events-none select-none fill-gray-700"
              fontSize="8"
              fontWeight="600"
            >
              {canton.id}
            </text>
          );
        })}
      </svg>

      {/* Tooltip */}
      {hoveredCanton && (
        <div
          className="absolute pointer-events-none z-10 bg-white border border-gray-200 shadow-lg rounded-lg px-3 py-2 text-sm"
          style={{
            left: tooltipPos.x + 12,
            top: tooltipPos.y - 10,
            transform: "translateY(-100%)",
          }}
        >
          <div className="font-semibold text-gray-900">
            {hoveredCanton.name}
          </div>
          <div className="text-gray-600">
            {hoveredCanton.participation.toLocaleString()} participants
          </div>
        </div>
      )}
    </div>
  );
}
