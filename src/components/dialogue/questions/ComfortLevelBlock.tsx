"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";
import type { QuestionBlock } from "../surveyData";

type ComfortData = Extract<QuestionBlock, { type: "comfort-level-block" }>;

const LEVELS = [
  { key: "veryComfortable", label: "Very comfortable", emoji: "\ud83d\ude0a" },
  { key: "comfortable", label: "Comfortable", emoji: "\ud83d\ude42" },
  { key: "uncomfortable", label: "Uncomfortable", emoji: "\ud83d\ude1f" },
  { key: "veryUncomfortable", label: "Very uncomfortable", emoji: "\ud83d\ude30" },
] as const;

type LevelKey = (typeof LEVELS)[number]["key"];

interface ComfortLevelBlockProps {
  data: ComfortData;
  onSubmit: (answers: {
    responses: Record<string, LevelKey>;
    freeText?: string;
  }) => void;
  initialAnswers?: { responses: Record<string, string>; freeText?: string };
}

export default function ComfortLevelBlock({
  data,
  onSubmit,
  initialAnswers,
}: ComfortLevelBlockProps) {
  const [answers, setAnswers] = useState<Record<string, LevelKey>>(
    (initialAnswers?.responses as Record<string, LevelKey>) ?? {}
  );
  const [freeText, setFreeText] = useState(initialAnswers?.freeText ?? "");
  const [showFreeText, setShowFreeText] = useState(!!initialAnswers?.freeText);
  const submitted = useRef(false);
  const isEditing = !!initialAnswers;

  const allAnswered = data.scenarios.every((s) => answers[s.id]);

  const doSubmit = useCallback(() => {
    if (!submitted.current) {
      submitted.current = true;
      onSubmit({
        responses: answers,
        freeText: freeText.trim() || undefined,
      });
    }
  }, [answers, freeText, onSubmit]);

  useEffect(() => {
    if (allAnswered && !isEditing && !showFreeText) {
      const timer = setTimeout(doSubmit, 400);
      return () => clearTimeout(timer);
    }
  }, [allAnswered, isEditing, showFreeText, doSubmit]);

  return (
    <div className="space-y-3">
      {data.scenarios.map((scenario, i) => {
        const answered = !!answers[scenario.id];
        return (
          <motion.div
            key={scenario.id}
            initial={!isEditing ? { opacity: 0, y: 12 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: isEditing ? 0 : i * 0.06 }}
            className={`rounded-xl border p-4 transition-all duration-300 ${
              answered && !isEditing
                ? "border-gray-100 bg-gray-50/50"
                : "border-gray-200 bg-white shadow-sm"
            }`}
          >
            <p className="text-sm text-gray-800 leading-relaxed mb-3">
              {scenario.text}
            </p>
            <div className="grid grid-cols-4 gap-1.5">
              {LEVELS.map((level) => (
                <button
                  key={level.key}
                  onClick={() =>
                    setAnswers((a) => ({ ...a, [scenario.id]: level.key }))
                  }
                  disabled={submitted.current && !isEditing}
                  className={`rounded-lg border px-2 py-2 text-center transition-all duration-200 ${
                    answers[scenario.id] === level.key
                      ? "border-red-500 bg-red-50 scale-[1.03]"
                      : "border-gray-200 bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  <span className="text-lg block">{level.emoji}</span>
                  <span className="text-[10px] text-gray-500 leading-tight block mt-0.5">
                    {level.label}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        );
      })}

      {allAnswered && !submitted.current && !showFreeText && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
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
          className="space-y-2"
        >
          <textarea
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            placeholder="Anything you'd like to add..."
            rows={2}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-red-300 focus:outline-none focus:ring-1 focus:ring-red-200 resize-none"
          />
          <button
            onClick={doSubmit}
            className="w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-red-700"
          >
            Continue
          </button>
        </motion.div>
      )}

      {isEditing && (
        <button
          onClick={() =>
            onSubmit({
              responses: answers,
              freeText: freeText.trim() || undefined,
            })
          }
          disabled={!allAnswered}
          className="w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Save changes
        </button>
      )}
    </div>
  );
}
