"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { QuestionBlock } from "../surveyData";

type PriorityData = Extract<QuestionBlock, { type: "priority-ranking" }>;

interface PriorityRankingQuestionProps {
  data: PriorityData;
  onSubmit: (answer: { ranked: string[]; freeText?: string }) => void;
  initialSelected?: { ranked: string[]; freeText?: string };
}

export default function PriorityRankingQuestion({
  data,
  onSubmit,
  initialSelected,
}: PriorityRankingQuestionProps) {
  const [selected, setSelected] = useState<string[]>(
    initialSelected?.ranked ?? []
  );
  const [freeText, setFreeText] = useState(initialSelected?.freeText ?? "");
  const [showFreeText, setShowFreeText] = useState(
    !!initialSelected?.freeText
  );

  const toggle = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= data.items.length) return prev;
      return [...prev, id];
    });
  };

  const ready = selected.length >= data.items.length;

  return (
    <div className="space-y-2">
      {data.description && (
        <p className="text-sm text-gray-500 mb-3">{data.description}</p>
      )}
      {data.items.map((item, i) => {
        const rank = selected.indexOf(item.id);
        const isSelected = rank !== -1;
        return (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: i * 0.04 }}
            onClick={() => toggle(item.id)}
            className={`w-full text-left rounded-xl border px-4 py-3 text-sm transition-all duration-200 flex items-center gap-3 ${
              isSelected
                ? "border-red-500 bg-red-50 text-red-700 shadow-sm"
                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
            }`}
          >
            <motion.span
              animate={{ scale: isSelected ? 1 : 0.9 }}
              className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shrink-0 transition-colors duration-200 ${
                isSelected
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {isSelected ? rank + 1 : ""}
            </motion.span>
            {item.label}
          </motion.button>
        );
      })}

      {ready && !showFreeText && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          onClick={() => setShowFreeText(true)}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          + Add a comment
        </motion.button>
      )}

      {showFreeText && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-2"
        >
          <textarea
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            placeholder="Anything you'd like to add..."
            rows={2}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-red-300 focus:outline-none focus:ring-1 focus:ring-red-200 resize-none"
          />
        </motion.div>
      )}

      <motion.button
        animate={{ opacity: ready ? 1 : 0.4, y: ready ? 0 : 4 }}
        onClick={() =>
          ready &&
          onSubmit({ ranked: selected, freeText: freeText.trim() || undefined })
        }
        disabled={!ready}
        className="w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed mt-2"
      >
        {initialSelected ? "Save changes" : "Continue"}
      </motion.button>
    </div>
  );
}
