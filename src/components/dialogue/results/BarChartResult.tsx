"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

interface Bar {
  label: string;
  value: number; // percentage 0-100
  color?: string;
}

interface BarChartResultProps {
  bars: Bar[];
  staggerDelay?: number;
}

function AnimatedNumber({ target, duration = 800 }: { target: number; duration?: number }) {
  const [value, setValue] = useState(0);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        ref.current = requestAnimationFrame(animate);
      }
    };
    ref.current = requestAnimationFrame(animate);
    return () => {
      if (ref.current) cancelAnimationFrame(ref.current);
    };
  }, [target, duration]);

  return <span>{value}%</span>;
}

export default function BarChartResult({ bars, staggerDelay = 100 }: BarChartResultProps) {
  return (
    <div className="space-y-3 w-full">
      {bars.map((bar, i) => (
        <div key={bar.label} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">{bar.label}</span>
            <span className="font-medium text-gray-900 tabular-nums">
              <AnimatedNumber target={bar.value} duration={800} />
            </span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: bar.color || "#dc2626" }}
              initial={{ width: 0 }}
              animate={{ width: `${bar.value}%` }}
              transition={{
                duration: 0.8,
                delay: i * (staggerDelay / 1000),
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// Split bar for agree/disagree
export function SplitBarResult({
  items,
  staggerDelay = 100,
}: {
  items: { label: string; agree: number; disagree: number }[];
  staggerDelay?: number;
}) {
  return (
    <div className="space-y-4 w-full">
      {items.map((item, i) => (
        <div key={item.label} className="space-y-1.5">
          <p className="text-sm text-gray-700">{item.label}</p>
          <div className="flex h-3 rounded-full overflow-hidden bg-gray-100">
            <motion.div
              className="h-full bg-red-500"
              initial={{ width: 0 }}
              animate={{ width: `${item.agree}%` }}
              transition={{
                duration: 0.8,
                delay: i * (staggerDelay / 1000),
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            />
            <motion.div
              className="h-full bg-gray-300"
              initial={{ width: 0 }}
              animate={{ width: `${item.disagree}%` }}
              transition={{
                duration: 0.8,
                delay: i * (staggerDelay / 1000) + 0.1,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>
              Agree <span className="font-medium text-gray-700 tabular-nums"><AnimatedNumber target={item.agree} /></span>
            </span>
            <span>
              Disagree <span className="font-medium text-gray-700 tabular-nums"><AnimatedNumber target={item.disagree} /></span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
