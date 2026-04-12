"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { useLanguage } from "@/components/dialogue/LanguageContext";
import type { DeliberationData } from "@/components/dialogue/useDeliberation";
import { useSurvey } from "@/components/dialogue/useSurvey";
import { useInterview } from "@/components/dialogue/useInterview";
import SurveyHero from "@/components/dialogue/SurveyHero";
import QuoteWall from "@/components/dialogue/QuoteWall";

const CantonMap = dynamic(
  () => import("@/components/dialogue/CantonMap"),
  { ssr: false }
);

export default function SurveyContent({
  deliberationData,
}: {
  deliberationData: DeliberationData;
}) {
  const { language } = useLanguage();
  const { deliberation } = deliberationData;
  const { data: surveyData, loading, refresh } = useSurvey();

  const interview = useInterview({
    interviewType: "survey",
    language,
    deliberationId: deliberation?.id ?? null,
    deliberationQuestion: null,
    onComplete: refresh,
  });

  // Convert survey canton data to the Record<string, number> format CantonMap expects
  const surveyCantonCounts = useMemo(() => {
    if (!surveyData?.cantons) return {};
    const counts: Record<string, number> = {};
    for (const { canton, count } of surveyData.cantons) {
      counts[canton] = count;
    }
    return counts;
  }, [surveyData?.cantons]);

  const hasSurveyCantonData = Object.keys(surveyCantonCounts).length > 0;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 space-y-12">
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-sm text-muted-foreground">Loading...</div>
        </div>
      )}

      {!loading && (
        <>
          {/* Survey Hero with integrated chat */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <SurveyHero
              totalResponses={surveyData?.totalResponses ?? 0}
              messages={interview.messages}
              streamingContent={interview.streamingContent}
              isStreaming={interview.isStreaming}
              inputValue={interview.inputValue}
              onInputChange={interview.setInputValue}
              onSubmit={interview.handleSubmit}
              onOptionSelect={interview.handleOptionSelect}
              started={interview.started}
              onStart={interview.start}
              completed={interview.completed}
              saved={interview.saved}
              saving={interview.saving}
              onSave={interview.handleSave}
            />
          </motion.section>

          {/* MAP: Survey responses across Switzerland */}
          {hasSurveyCantonData && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="space-y-4"
            >
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Survey Responses Across Switzerland
              </h3>
              <CantonMap
                participantCounts={surveyCantonCounts}
                participantsPerDot={1}
              />
              <p className="text-xs text-muted-foreground text-center">
                Each dot represents a survey response
              </p>
            </motion.section>
          )}

          {/* Results below the hero */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <QuoteWall mode="survey" />
          </motion.section>
        </>
      )}
    </main>
  );
}
