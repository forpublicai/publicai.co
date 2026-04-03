"use client";

import { motion } from "motion/react";
import { surveySections, type QuestionBlock } from "./surveyData";
import { SplitBarResult } from "./results/BarChartResult";
import BarChartResult from "./results/BarChartResult";
import RankingResult from "./results/RankingResult";
import ThemeSummaryResult from "./results/ThemeSummaryResult";

function QuestionResults({ question }: { question: QuestionBlock }) {
  switch (question.type) {
    case "statement-block":
      return (
        <SplitBarResult
          items={question.statements.map((s) => ({
            label: s.text,
            agree: s.mockResults.agree,
            disagree: s.mockResults.disagree,
          }))}
        />
      );

    case "comfort-level-block":
      return (
        <div className="space-y-5">
          {question.scenarios.map((scenario) => (
            <div key={scenario.id} className="space-y-1.5">
              <p className="text-sm text-gray-700 font-medium">
                {scenario.text}
              </p>
              <BarChartResult
                bars={[
                  { label: "Very comfortable", value: scenario.mockResults.veryComfortable, color: "#16a34a" },
                  { label: "Comfortable", value: scenario.mockResults.comfortable, color: "#65a30d" },
                  { label: "Uncomfortable", value: scenario.mockResults.uncomfortable, color: "#ea580c" },
                  { label: "Very uncomfortable", value: scenario.mockResults.veryUncomfortable, color: "#dc2626" },
                ]}
              />
            </div>
          ))}
        </div>
      );

    case "scenario-block":
      return (
        <div className="space-y-5">
          {question.scenarios.map((scenario) => (
            <div key={scenario.id} className="space-y-1.5">
              <p className="text-sm text-gray-700 font-medium">
                {scenario.text}
              </p>
              <BarChartResult
                bars={scenario.options.map((opt) => ({
                  label: opt.label,
                  value: scenario.mockResults[opt.id] || 0,
                }))}
              />
            </div>
          ))}
        </div>
      );

    case "ranking":
    case "priority-ranking":
      return (
        <RankingResult
          items={question.items.map((i) => ({
            label: i.label,
            avgRank: i.mockAvgRank,
          }))}
        />
      );

    case "open-text":
      return <ThemeSummaryResult themes={question.mockThemes} />;
  }
}

export default function ResultsDashboard() {
  return (
    <div className="space-y-12">
      {surveySections.map((section, si) => (
        <motion.div
          key={section.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: si * 0.1 }}
        >
          <div className="mb-6">
            <p className="text-xs uppercase tracking-wider text-red-500 font-medium">
              Section {si + 1}
            </p>
            <h3 className="text-lg font-semibold text-gray-900 mt-1">
              {section.title}
            </h3>
          </div>

          <div className="space-y-6">
            {section.questions.map((question) => (
              <div
                key={question.id}
                className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5"
              >
                <p className="text-sm font-medium text-gray-700 mb-4">
                  {question.title}
                </p>
                <QuestionResults question={question} />
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
