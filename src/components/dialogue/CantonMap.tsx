"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import {
  cantonSvgPaths,
  cantonCentroids,
  cantonBounds,
  MAP_VIEWBOX,
} from "./cantonPaths";

export interface CantonData {
  id: string;
  name: string;
  nameFr: string;
  nameIt: string;
}

export const cantonData: CantonData[] = [
  { id: "ZH", name: "Zürich", nameFr: "Zurich", nameIt: "Zurigo" },
  { id: "BE", name: "Bern", nameFr: "Berne", nameIt: "Berna" },
  { id: "LU", name: "Luzern", nameFr: "Lucerne", nameIt: "Lucerna" },
  { id: "UR", name: "Uri", nameFr: "Uri", nameIt: "Uri" },
  { id: "SZ", name: "Schwyz", nameFr: "Schwyz", nameIt: "Svitto" },
  { id: "OW", name: "Obwalden", nameFr: "Obwald", nameIt: "Obvaldo" },
  { id: "NW", name: "Nidwalden", nameFr: "Nidwald", nameIt: "Nidvaldo" },
  { id: "GL", name: "Glarus", nameFr: "Glaris", nameIt: "Glarona" },
  { id: "ZG", name: "Zug", nameFr: "Zoug", nameIt: "Zugo" },
  { id: "FR", name: "Freiburg", nameFr: "Fribourg", nameIt: "Friburgo" },
  { id: "SO", name: "Solothurn", nameFr: "Soleure", nameIt: "Soletta" },
  {
    id: "BS",
    name: "Basel-Stadt",
    nameFr: "Bâle-Ville",
    nameIt: "Basilea Città",
  },
  {
    id: "BL",
    name: "Basel-Landschaft",
    nameFr: "Bâle-Campagne",
    nameIt: "Basilea Campagna",
  },
  {
    id: "SH",
    name: "Schaffhausen",
    nameFr: "Schaffhouse",
    nameIt: "Sciaffusa",
  },
  {
    id: "AR",
    name: "Appenzell Ausserrhoden",
    nameFr: "Appenzell Rh.-Ext.",
    nameIt: "Appenzello Esterno",
  },
  {
    id: "AI",
    name: "Appenzell Innerrhoden",
    nameFr: "Appenzell Rh.-Int.",
    nameIt: "Appenzello Interno",
  },
  { id: "SG", name: "St. Gallen", nameFr: "Saint-Gall", nameIt: "San Gallo" },
  {
    id: "GR",
    name: "Graubünden",
    nameFr: "Grisons",
    nameIt: "Grigioni",
  },
  { id: "AG", name: "Aargau", nameFr: "Argovie", nameIt: "Argovia" },
  { id: "TG", name: "Thurgau", nameFr: "Thurgovie", nameIt: "Turgovia" },
  { id: "TI", name: "Ticino", nameFr: "Tessin", nameIt: "Ticino" },
  { id: "VD", name: "Waadt", nameFr: "Vaud", nameIt: "Vaud" },
  { id: "VS", name: "Wallis", nameFr: "Valais", nameIt: "Vallese" },
  { id: "NE", name: "Neuenburg", nameFr: "Neuchâtel", nameIt: "Neuchâtel" },
  { id: "GE", name: "Genf", nameFr: "Genève", nameIt: "Ginevra" },
  { id: "JU", name: "Jura", nameFr: "Jura", nameIt: "Giura" },
];

export function getCantonById(id: string): CantonData | undefined {
  return cantonData.find((c) => c.id === id);
}

// --- Utilities ---

/** Seeded PRNG (mulberry32) for deterministic dot placement */
function seededRandom(seed: number) {
  let t = (seed + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

/**
 * Ray-casting point-in-polygon test against simplified SVG path.
 * Handles M, L, Z commands (ignores curves — uses control points as vertices).
 */
function isPointInPolygon(
  px: number,
  py: number,
  pathData: string
): boolean {
  const vertices: [number, number][] = [];
  const nums = pathData.match(/-?\d+\.?\d*/g);
  if (!nums) return false;
  for (let i = 0; i < nums.length - 1; i += 2) {
    const x = parseFloat(nums[i]);
    const y = parseFloat(nums[i + 1]);
    if (x > -500 && x < 1500 && y > -500 && y < 1500) {
      vertices.push([x, y]);
    }
  }
  if (vertices.length < 3) return false;

  let inside = false;
  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    const [xi, yi] = vertices[i];
    const [xj, yj] = vertices[j];
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

interface Dot {
  x: number;
  y: number;
  cantonId: string;
}

function generateDotsInCanton(
  cantonId: string,
  count: number,
  bounds: { minX: number; minY: number; maxX: number; maxY: number },
  pathData: string
): Dot[] {
  const dots: Dot[] = [];
  let seed = 0;
  for (let i = 0; i < cantonId.length; i++) {
    seed = seed * 31 + cantonId.charCodeAt(i);
  }

  const padX = (bounds.maxX - bounds.minX) * 0.08;
  const padY = (bounds.maxY - bounds.minY) * 0.08;
  const minX = bounds.minX + padX;
  const maxX = bounds.maxX - padX;
  const minY = bounds.minY + padY;
  const maxY = bounds.maxY - padY;

  let attempts = 0;
  while (dots.length < count && attempts < count * 50) {
    const r1 = seededRandom(seed + attempts * 7919);
    const r2 = seededRandom(seed + attempts * 7919 + 1);
    const x = minX + r1 * (maxX - minX);
    const y = minY + r2 * (maxY - minY);
    attempts++;
    if (isPointInPolygon(x, y, pathData)) {
      dots.push({ x, y, cantonId });
    }
  }
  return dots;
}

// Skip labels for tiny cantons
const SKIP_LABELS = new Set(["BS", "AI", "AR", "OW", "NW", "ZG"]);

// --- Component ---

interface CantonMapProps {
  participantCounts?: Record<string, number>;
  highlightedCanton?: string;
  participantsPerDot?: number;
}

export default function CantonMap({
  participantCounts = {},
  highlightedCanton,
  participantsPerDot = 3,
}: CantonMapProps) {
  const [hoveredCanton, setHoveredCanton] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Generate all dots
  const allDots = useMemo(() => {
    const dots: Dot[] = [];
    for (const canton of cantonData) {
      const count = participantCounts[canton.id] || 0;
      const dotCount = Math.max(1, Math.round(count / participantsPerDot));
      const pathData = cantonSvgPaths[canton.id];
      const bounds = cantonBounds[canton.id];
      if (pathData && bounds && count > 0) {
        dots.push(...generateDotsInCanton(canton.id, dotCount, bounds, pathData));
      }
    }
    return dots;
  }, [participantCounts, participantsPerDot]);

  const hoveredData = hoveredCanton ? getCantonById(hoveredCanton) : null;
  const hoveredCount = hoveredCanton
    ? participantCounts[hoveredCanton] || 0
    : 0;

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <svg
        viewBox={MAP_VIEWBOX}
        className="w-full h-auto"
        onMouseLeave={() => setHoveredCanton(null)}
      >
        {/* Layer 1: Canton shapes */}
        {cantonData.map((canton, i) => {
          const pathData = cantonSvgPaths[canton.id];
          if (!pathData) return null;
          const isHovered = hoveredCanton === canton.id;
          const isHighlighted = highlightedCanton === canton.id;
          return (
            <motion.path
              key={canton.id}
              d={pathData}
              fill={
                isHighlighted
                  ? "rgba(239,68,68,0.12)"
                  : isHovered
                    ? "rgba(239,68,68,0.06)"
                    : "#fafafa"
              }
              stroke="rgba(0,0,0,0.1)"
              strokeWidth="0.5"
              className="cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: i * 0.02 }}
              onMouseEnter={(e) => {
                setHoveredCanton(canton.id);
                const svg = e.currentTarget.ownerSVGElement;
                if (svg) {
                  const rect = svg.getBoundingClientRect();
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
          );
        })}

        {/* Layer 2: Participant dots */}
        {allDots.map((dot, i) => {
          const isInHovered = hoveredCanton === dot.cantonId;
          return (
            <motion.circle
              key={`dot-${i}`}
              cx={dot.x}
              cy={dot.y}
              r={2.5}
              fill="#ef4444"
              className="pointer-events-none"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: isInHovered ? 1 : [0.6, 0.9, 0.6],
                scale: 1,
                x: [0, (seededRandom(i * 31) - 0.5) * 1.5, 0],
                y: [0, (seededRandom(i * 37) - 0.5) * 1.5, 0],
              }}
              transition={{
                opacity: isInHovered
                  ? { duration: 0.15 }
                  : {
                      duration: 3 + seededRandom(i * 41) * 2,
                      repeat: Infinity,
                      delay: 0.5 + i * 0.008,
                    },
                scale: {
                  duration: 0.4,
                  delay: 0.5 + i * 0.008,
                },
                x: {
                  duration: 4 + seededRandom(i * 43) * 3,
                  repeat: Infinity,
                  delay: 0.5 + i * 0.008,
                },
                y: {
                  duration: 4 + seededRandom(i * 47) * 3,
                  repeat: Infinity,
                  delay: 0.5 + i * 0.008,
                },
              }}
            />
          );
        })}

        {/* Layer 3: Canton labels */}
        {cantonData.map((canton) => {
          if (SKIP_LABELS.has(canton.id)) return null;
          const centroid = cantonCentroids[canton.id];
          if (!centroid) return null;
          return (
            <text
              key={`label-${canton.id}`}
              x={centroid.x}
              y={centroid.y}
              textAnchor="middle"
              dominantBaseline="central"
              className="pointer-events-none select-none"
              fontSize="6"
              fontWeight="500"
              fill="rgba(0,0,0,0.35)"
            >
              {canton.id}
            </text>
          );
        })}
      </svg>

      {/* Tooltip */}
      {hoveredData && (
        <div
          className="absolute pointer-events-none z-10 bg-white border border-gray-200 shadow-lg rounded-lg px-3 py-2 text-sm"
          style={{
            left: tooltipPos.x + 12,
            top: tooltipPos.y - 10,
            transform: "translateY(-100%)",
          }}
        >
          <div className="font-semibold text-gray-900">{hoveredData.name}</div>
          {hoveredCount > 0 && (
            <div className="text-gray-500 text-xs">
              {hoveredCount} participant{hoveredCount !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
