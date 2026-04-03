"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { QuestionBlock } from "../surveyData";

type OpenTextData = Extract<QuestionBlock, { type: "open-text" }>;

interface OpenTextQuestionProps {
  data: OpenTextData;
  onSubmit: (answers: string[]) => void;
  initialTexts?: string[];
  isEditing?: boolean;
}

export default function OpenTextQuestion({
  data,
  onSubmit,
  initialTexts,
}: OpenTextQuestionProps) {
  const [texts, setTexts] = useState<string[]>(
    initialTexts ?? data.prompts.map(() => "")
  );

  const allFilled = texts.every((t) => t.trim().length > 0);

  return (
    <div className="space-y-4">
      {data.prompts.map((prompt, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: i * 0.1 }}
          className="space-y-2"
        >
          <p className="text-sm text-gray-800 font-medium">{prompt}</p>
          <textarea
            value={texts[i]}
            onChange={(e) =>
              setTexts((prev) => {
                const next = [...prev];
                next[i] = e.target.value;
                return next;
              })
            }
            placeholder="Share your thoughts..."
            rows={3}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-red-300 focus:outline-none focus:ring-1 focus:ring-red-200 resize-none"
          />
        </motion.div>
      ))}

      <motion.button
        animate={{ opacity: allFilled ? 1 : 0.4 }}
        onClick={() => allFilled && onSubmit(texts)}
        disabled={!allFilled}
        className="w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed"
      >
        {initialTexts ? "Save changes" : "Continue"}
      </motion.button>
    </div>
  );
}
