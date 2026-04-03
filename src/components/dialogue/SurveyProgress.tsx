"use client";

import { motion } from "motion/react";
import { useSurveyStore } from "./useSurveyStore";
import { surveySections, getAllQuestions } from "./surveyData";

export default function SurveyProgress() {
  const { furthestIndex } = useSurveyStore();
  const allQuestions = getAllQuestions();
  const current = allQuestions[furthestIndex];
  const currentSectionIndex = current?.sectionIndex ?? surveySections.length;

  const progress = (furthestIndex / allQuestions.length) * 100;

  return (
    <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-gray-100 py-3 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
          <motion.div
            className="h-full bg-red-500 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        <div className="flex justify-between">
          {surveySections.map((section, i) => (
            <span
              key={section.id}
              className={`text-xs transition-colors ${
                i === currentSectionIndex
                  ? "text-red-600 font-medium"
                  : i < currentSectionIndex
                    ? "text-gray-400"
                    : "text-gray-300"
              }`}
            >
              <span className="hidden sm:inline">
                {section.title.length > 20
                  ? section.title.slice(0, 20) + "\u2026"
                  : section.title}
              </span>
              <span className="sm:hidden">{i + 1}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
