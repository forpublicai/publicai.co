"use client";

import { motion } from "motion/react";
import type { QuestionBlock } from "./surveyData";

const COMFORT_LABELS: Record<string, string> = {
  veryComfortable: "Very comfortable",
  comfortable: "Comfortable",
  uncomfortable: "Uncomfortable",
  veryUncomfortable: "Very uncomfortable",
};

interface AnsweredQuestionProps {
  question: QuestionBlock;
  answer: unknown;
  onEdit: () => void;
}

export default function AnsweredQuestion({
  question,
  answer,
  onEdit,
}: AnsweredQuestionProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group cursor-pointer rounded-xl border border-gray-100 bg-gray-50/50 px-5 py-4 transition-colors hover:border-gray-200 hover:bg-gray-50"
      onClick={onEdit}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 mb-2">
            {question.title}
          </p>
          <AnswerSummary question={question} answer={answer} />
        </div>
        <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5">
          Edit
        </span>
      </div>
    </motion.div>
  );
}

function FreeTextBadge({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <p className="text-xs text-gray-400 italic mt-1.5 line-clamp-1">
      &ldquo;{text}&rdquo;
    </p>
  );
}

function AnswerSummary({
  question,
  answer,
}: {
  question: QuestionBlock;
  answer: unknown;
}) {
  switch (question.type) {
    case "statement-block": {
      const ans = answer as {
        responses: Record<string, "agree" | "disagree">;
        freeText?: string;
      };
      return (
        <>
          <div className="flex flex-wrap gap-1.5">
            {question.statements.map((s) => (
              <span
                key={s.id}
                className={`inline-block rounded-md px-2 py-0.5 text-xs font-medium ${
                  ans.responses[s.id] === "agree"
                    ? "bg-red-50 text-red-600"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {ans.responses[s.id] === "agree" ? "Agree" : "Disagree"}:{" "}
                {s.text.length > 50
                  ? s.text.slice(0, 50) + "\u2026"
                  : s.text}
              </span>
            ))}
          </div>
          <FreeTextBadge text={ans.freeText} />
        </>
      );
    }

    case "comfort-level-block": {
      const ans = answer as {
        responses: Record<string, string>;
        freeText?: string;
      };
      return (
        <>
          <div className="flex flex-wrap gap-1.5">
            {question.scenarios.map((s) => (
              <span
                key={s.id}
                className="inline-block rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
              >
                {COMFORT_LABELS[ans.responses[s.id]] || ans.responses[s.id]}
              </span>
            ))}
          </div>
          <FreeTextBadge text={ans.freeText} />
        </>
      );
    }

    case "scenario-block": {
      const ans = answer as {
        responses: Record<string, string>;
        freeText?: string;
      };
      return (
        <>
          <div className="space-y-1">
            {question.scenarios.map((s) => {
              const chosen = s.options.find(
                (o) => o.id === ans.responses[s.id]
              );
              return (
                <p key={s.id} className="text-xs text-gray-500">
                  <span className="text-gray-700">{chosen?.label}</span>
                </p>
              );
            })}
          </div>
          <FreeTextBadge text={ans.freeText} />
        </>
      );
    }

    case "ranking":
    case "priority-ranking": {
      const ans = answer as { ranked: string[]; freeText?: string };
      return (
        <>
          <div className="flex flex-wrap gap-1.5">
            {ans.ranked.map((id, i) => {
              const item = question.items.find((x) => x.id === id);
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-0.5 text-xs text-red-600"
                >
                  <span className="font-bold">{i + 1}.</span> {item?.label}
                </span>
              );
            })}
          </div>
          <FreeTextBadge text={ans.freeText} />
        </>
      );
    }

    case "open-text": {
      const texts = answer as string[];
      return (
        <div className="space-y-1">
          {texts.map((text, i) => (
            <p key={i} className="text-xs text-gray-500 line-clamp-2 italic">
              &ldquo;{text}&rdquo;
            </p>
          ))}
        </div>
      );
    }
  }
}
