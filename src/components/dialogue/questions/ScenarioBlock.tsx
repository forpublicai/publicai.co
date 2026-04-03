"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";
import type { QuestionBlock } from "../surveyData";

type ScenarioData = Extract<QuestionBlock, { type: "scenario-block" }>;

interface ScenarioBlockProps {
  data: ScenarioData;
  onSubmit: (answers: {
    responses: Record<string, string>;
    freeText?: string;
  }) => void;
  initialAnswers?: { responses: Record<string, string>; freeText?: string };
}

export default function ScenarioBlock({
  data,
  onSubmit,
  initialAnswers,
}: ScenarioBlockProps) {
  const [answers, setAnswers] = useState<Record<string, string>>(
    initialAnswers?.responses ?? {}
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
    <div className="space-y-5">
      {data.scenarios.map((scenario, i) => {
        const answered = !!answers[scenario.id];
        return (
          <motion.div
            key={scenario.id}
            initial={!isEditing ? { opacity: 0, y: 12 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: isEditing ? 0 : i * 0.08 }}
            className={`rounded-xl border p-4 transition-all duration-300 ${
              answered && !isEditing
                ? "border-gray-100 bg-gray-50/50"
                : "border-gray-200 bg-white shadow-sm"
            }`}
          >
            <p className="text-sm text-gray-800 leading-relaxed font-medium mb-3">
              {scenario.text}
            </p>
            <div className="space-y-2">
              {scenario.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() =>
                    setAnswers((a) => ({ ...a, [scenario.id]: option.id }))
                  }
                  disabled={submitted.current && !isEditing}
                  className={`w-full text-left rounded-lg border px-4 py-2.5 text-sm transition-all duration-200 ${
                    answers[scenario.id] === option.id
                      ? "border-red-500 bg-red-50 text-red-700 scale-[1.01]"
                      : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {option.label}
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
