"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";
import type { QuestionBlock } from "../surveyData";

type StatementBlockData = Extract<QuestionBlock, { type: "statement-block" }>;

interface StatementBlockProps {
  data: StatementBlockData;
  onSubmit: (answers: {
    responses: Record<string, "agree" | "disagree">;
    freeText?: string;
  }) => void;
  initialAnswers?: {
    responses: Record<string, "agree" | "disagree">;
    freeText?: string;
  };
}

export default function StatementBlock({
  data,
  onSubmit,
  initialAnswers,
}: StatementBlockProps) {
  const [answers, setAnswers] = useState<Record<string, "agree" | "disagree">>(
    initialAnswers?.responses ?? {}
  );
  const [freeText, setFreeText] = useState(initialAnswers?.freeText ?? "");
  const [showFreeText, setShowFreeText] = useState(!!initialAnswers?.freeText);
  const submitted = useRef(false);
  const isEditing = !!initialAnswers;

  const allAnswered = data.statements.every((s) => answers[s.id]);

  const doSubmit = useCallback(() => {
    if (!submitted.current) {
      submitted.current = true;
      onSubmit({
        responses: answers,
        freeText: freeText.trim() || undefined,
      });
    }
  }, [answers, freeText, onSubmit]);

  // Auto-submit when all answered (only if free text not open)
  useEffect(() => {
    if (allAnswered && !isEditing && !showFreeText) {
      const timer = setTimeout(doSubmit, 400);
      return () => clearTimeout(timer);
    }
  }, [allAnswered, isEditing, showFreeText, doSubmit]);

  return (
    <div className="space-y-3">
      {data.statements.map((statement, i) => {
        const answered = !!answers[statement.id];
        return (
          <motion.div
            key={statement.id}
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
              {statement.text}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setAnswers((a) => ({ ...a, [statement.id]: "agree" }))
                }
                disabled={submitted.current && !isEditing}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  answers[statement.id] === "agree"
                    ? "border-red-500 bg-red-50 text-red-700 scale-[1.02]"
                    : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                Agree
              </button>
              <button
                onClick={() =>
                  setAnswers((a) => ({ ...a, [statement.id]: "disagree" }))
                }
                disabled={submitted.current && !isEditing}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  answers[statement.id] === "disagree"
                    ? "border-gray-600 bg-gray-100 text-gray-800 scale-[1.02]"
                    : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                Disagree
              </button>
            </div>
          </motion.div>
        );
      })}

      {/* Optional free text */}
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
