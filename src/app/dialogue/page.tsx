"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import CantonMap from "@/components/dialogue/CantonMap";
import { totalParticipation } from "@/components/dialogue/mockAnalytics";
import { surveySections, getAllQuestions } from "@/components/dialogue/surveyData";
import { useSurveyStore } from "@/components/dialogue/useSurveyStore";
import SurveyQuestion from "@/components/dialogue/SurveyQuestion";
import AnsweredQuestion from "@/components/dialogue/AnsweredQuestion";
import ResultsDashboard from "@/components/dialogue/ResultsDashboard";

function SurveyHeader() {
  return (
    <div className="max-w-4xl mx-auto px-6 pt-16 pb-10">
      <div className="text-center mb-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-medium text-red-500 mb-3 tracking-wide uppercase">
            Swiss National AI Dialogue
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Your voice shapes Swiss AI
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Join {totalParticipation.toLocaleString()} citizens across all 26
            cantons in defining how AI is built and governed in Switzerland.
          </p>
        </motion.div>
        <div className="flex items-center justify-center gap-6 text-sm text-gray-500 flex-wrap">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            CIP
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            Public AI
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            Swiss AI
          </span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-8"
      >
        <div className="text-center mb-4">
          <div className="text-3xl font-bold text-gray-900">
            {totalParticipation.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">
            citizens have shared their views across all 26 cantons
          </div>
        </div>
        <CantonMap />
      </motion.div>
    </div>
  );
}

function CompletionScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-6 py-16"
    >
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-6"
        >
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Your voice has been recorded
        </h2>
        <p className="text-lg text-gray-600 max-w-xl mx-auto mb-2">
          You are now citizen #{(totalParticipation + 1).toLocaleString()} to
          shape the future of AI in Switzerland.
        </p>
        <p className="text-sm text-gray-500 max-w-lg mx-auto">
          Below you can see how your fellow citizens responded across all
          topics.
        </p>
      </div>

      <div className="mb-10">
        <CantonMap />
      </div>

      <div className="mb-12">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
          How Switzerland responded
        </h3>
        <ResultsDashboard />
      </div>

      <div className="flex gap-4 justify-center flex-wrap pt-8 border-t border-gray-100">
        <Link
          href="/"
          className="bg-red-500 text-white hover:bg-red-600 rounded-full px-8 py-3 font-medium transition-colors"
        >
          Back to Public AI
        </Link>
        <a
          href="https://chat.publicai.co"
          target="_blank"
          rel="noopener noreferrer"
          className="border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full px-8 py-3 font-medium transition-colors"
        >
          Try Apertus Chat
        </a>
      </div>
    </motion.div>
  );
}


export default function DialoguePage() {
  const { phase, furthestIndex, answers, editingId, startEditing } =
    useSurveyStore();

  const allQuestions = getAllQuestions();
  const activeRef = useRef<HTMLDivElement>(null);

  // Scroll to the active question when it changes
  useEffect(() => {
    if (phase === "survey" && activeRef.current) {
      // Small delay to let animation start
      const timer = setTimeout(() => {
        activeRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [furthestIndex, editingId, phase]);

  // Build the conversation thread
  const answeredQuestions = allQuestions.slice(0, furthestIndex);
  const currentQuestion =
    phase === "survey" ? allQuestions[furthestIndex] : null;

  return (
    <div className="min-h-screen bg-white">
      <SurveyHeader />

      {phase === "survey" && (
        <div className="max-w-2xl mx-auto px-6 py-8 space-y-4">
          {/* Answered questions */}
          {answeredQuestions.map(({ sectionIndex, question }, i) => {
            const isBeingEdited = editingId === question.id;
            const prevSectionIndex =
              i > 0 ? answeredQuestions[i - 1].sectionIndex : -1;
            const showDivider = sectionIndex !== prevSectionIndex;

            return (
              <div key={question.id}>
                {showDivider && (
                  <div className="flex items-center gap-3 py-2">
                    <div className="h-px flex-1 bg-gray-200" />
                    <span className="text-xs text-gray-400 font-medium uppercase tracking-wider shrink-0">
                      {sectionIndex + 1}.{" "}
                      {surveySections[sectionIndex].title}
                    </span>
                    <div className="h-px flex-1 bg-gray-200" />
                  </div>
                )}
                {isBeingEdited ? (
                  <div ref={activeRef}>
                    <SurveyQuestion questionId={question.id} isEditing />
                  </div>
                ) : (
                  <AnsweredQuestion
                    question={question}
                    answer={answers[question.id]}
                    onEdit={() => startEditing(question.id)}
                  />
                )}
              </div>
            );
          })}

          {/* Current question */}
          {currentQuestion && !editingId && (
            <div ref={activeRef}>
              {(() => {
                const prevSectionIndex =
                  answeredQuestions.length > 0
                    ? answeredQuestions[answeredQuestions.length - 1]
                        .sectionIndex
                    : -1;
                return (
                  currentQuestion.sectionIndex !== prevSectionIndex && (
                    <div className="flex items-center gap-3 py-2">
                      <div className="h-px flex-1 bg-gray-200" />
                      <span className="text-xs text-gray-400 font-medium uppercase tracking-wider shrink-0">
                        {currentQuestion.sectionIndex + 1}.{" "}
                        {
                          surveySections[currentQuestion.sectionIndex]
                            .title
                        }
                      </span>
                      <div className="h-px flex-1 bg-gray-200" />
                    </div>
                  )
                );
              })()}
              <SurveyQuestion />
            </div>
          )}
        </div>
      )}

      {phase === "complete" && <CompletionScreen />}
    </div>
  );
}
