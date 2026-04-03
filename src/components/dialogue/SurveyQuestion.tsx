"use client";

import { motion, AnimatePresence } from "motion/react";
import { useSurveyStore } from "./useSurveyStore";
import { getAllQuestions, type QuestionBlock } from "./surveyData";
import StatementBlock from "./questions/StatementBlock";
import ComfortLevelBlock from "./questions/ComfortLevelBlock";
import ScenarioBlock from "./questions/ScenarioBlock";
import RankingQuestion from "./questions/RankingQuestion";
import PriorityRankingQuestion from "./questions/PriorityRankingQuestion";
import OpenTextQuestion from "./questions/OpenTextQuestion";

interface ActiveQuestionProps {
  question: QuestionBlock;
  onSubmit: (answer: unknown) => void;
  existingAnswer?: unknown;
  isEditing?: boolean;
  onCancelEdit?: () => void;
}

function ActiveQuestion({
  question,
  onSubmit,
  existingAnswer,
  isEditing,
  onCancelEdit,
}: ActiveQuestionProps) {
  return (
    <div>
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-gray-900">
          {question.title}
        </h2>
        {"description" in question && question.description && (
          <p className="text-sm text-gray-500 mt-1">{question.description}</p>
        )}
      </div>

      {question.type === "statement-block" && (
        <StatementBlock
          data={question}
          onSubmit={onSubmit}
          initialAnswers={
            isEditing
              ? (existingAnswer as {
                  responses: Record<string, "agree" | "disagree">;
                  freeText?: string;
                })
              : undefined
          }
        />
      )}
      {question.type === "comfort-level-block" && (
        <ComfortLevelBlock
          data={question}
          onSubmit={onSubmit}
          initialAnswers={
            isEditing
              ? (existingAnswer as {
                  responses: Record<string, string>;
                  freeText?: string;
                })
              : undefined
          }
        />
      )}
      {question.type === "scenario-block" && (
        <ScenarioBlock
          data={question}
          onSubmit={onSubmit}
          initialAnswers={
            isEditing
              ? (existingAnswer as {
                  responses: Record<string, string>;
                  freeText?: string;
                })
              : undefined
          }
        />
      )}
      {question.type === "ranking" && (
        <RankingQuestion
          data={question}
          onSubmit={onSubmit}
          initialSelected={
            isEditing
              ? (existingAnswer as { ranked: string[]; freeText?: string })
              : undefined
          }
        />
      )}
      {question.type === "priority-ranking" && (
        <PriorityRankingQuestion
          data={question}
          onSubmit={onSubmit}
          initialSelected={
            isEditing
              ? (existingAnswer as { ranked: string[]; freeText?: string })
              : undefined
          }
        />
      )}
      {question.type === "open-text" && (
        <OpenTextQuestion
          data={question}
          onSubmit={onSubmit}
          initialTexts={isEditing ? (existingAnswer as string[]) : undefined}
          isEditing={isEditing}
        />
      )}

      {isEditing && onCancelEdit && (
        <button
          onClick={onCancelEdit}
          className="w-full mt-3 rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      )}
    </div>
  );
}

export default function SurveyQuestion({
  questionId,
  isEditing,
}: {
  questionId?: string;
  isEditing?: boolean;
}) {
  const { furthestIndex, answers, submit, cancelEditing } = useSurveyStore();

  const allQuestions = getAllQuestions();

  const entry = questionId
    ? allQuestions.find((q) => q.question.id === questionId)
    : allQuestions[furthestIndex];

  if (!entry) return null;
  const { question } = entry;

  const handleSubmit = (answer: unknown) => {
    submit(question.id, answer);
  };

  const existingAnswer = answers[question.id];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id + (isEditing ? "-edit" : "")}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="w-full"
      >
        <ActiveQuestion
          question={question}
          onSubmit={handleSubmit}
          existingAnswer={isEditing ? existingAnswer : undefined}
          isEditing={isEditing}
          onCancelEdit={isEditing ? cancelEditing : undefined}
        />
      </motion.div>
    </AnimatePresence>
  );
}
