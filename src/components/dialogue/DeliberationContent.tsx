"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { useLanguage } from "@/components/dialogue/LanguageContext";
import type { DeliberationData } from "@/components/dialogue/useDeliberation";
import DeliberationHero from "@/components/dialogue/DeliberationHero";
import StatementList from "@/components/dialogue/StatementList";
import RankingRidgeline from "@/components/dialogue/RankingRidgeline";
import ClusterBar from "@/components/dialogue/ClusterBar";
import OpinionGrid from "@/components/dialogue/OpinionGrid";
import { mockParticipantCounts } from "@/components/dialogue/mockCantonParticipants";

const CantonMap = dynamic(
  () => import("@/components/dialogue/CantonMap"),
  { ssr: false }
);
const ChatBubble = dynamic(
  () => import("@/components/dialogue/ChatBubble"),
  { ssr: false }
);
const StatementScatter = dynamic(
  () => import("@/components/dialogue/StatementScatter"),
  { ssr: false }
);
const OpinionLandscape = dynamic(
  () => import("@/components/dialogue/OpinionLandscape"),
  { ssr: false }
);
const QuestionSuggestions = dynamic(
  () => import("@/components/dialogue/QuestionSuggestions"),
  { ssr: false }
);

export default function DeliberationContent({
  deliberationData,
}: {
  deliberationData: DeliberationData;
}) {
  const { language } = useLanguage();
  const [chatOpen, setChatOpen] = useState(false);
  const {
    deliberation,
    consensus,
    statements,
    opinions,
    clusters,
    loading,
    refresh,
  } = deliberationData;

  const handleInterviewComplete = () => {
    refresh();
  };

  // Statement scatter points
  const statementPoints = statements
    .filter((s) => s.projected_x != null && s.projected_y != null)
    .map((s) => ({
      x: s.projected_x!,
      y: s.projected_y!,
      label: `#${s.social_ranking ?? ""}`,
      isWinner: s.is_winner,
    }));

  return (
    <>
      <main className="mx-auto max-w-6xl px-4 py-8 space-y-12">
        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-sm text-muted-foreground">Loading...</div>
          </div>
        )}

        {!loading && !deliberation && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg font-medium text-foreground">
              No active deliberation
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Check back soon for the next topic.
            </p>
          </div>
        )}

        {!loading && deliberation && (
          <>
            {/* TOP: Hero (Header + Living Consensus) */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <DeliberationHero
                question={deliberation.question}
                description={deliberation.description}
                participantCount={deliberation.participant_count}
                opinionCount={deliberation.opinion_count}
                consensus={consensus}
                onShareView={() => setChatOpen(true)}
              />
            </motion.section>

            {/* MAP: Participation across Switzerland */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="space-y-4"
            >
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Participation Across Switzerland
              </h3>
              <CantonMap participantCounts={mockParticipantCounts} />
              <p className="text-xs text-muted-foreground text-center">
                Each dot represents ~3 participants
              </p>
            </motion.section>

            {/* MIDDLE: Statements */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <div className="grid gap-8 lg:grid-cols-2">
                <StatementList statements={statements} />
                <div className="space-y-6">
                  <RankingRidgeline statements={statements} />
                  <StatementScatter points={statementPoints} />
                </div>
              </div>
            </motion.section>

            {/* BOTTOM: Opinions */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <ClusterBar clusters={clusters} total={opinions.length} />
              <div className="grid gap-8 lg:grid-cols-2">
                <OpinionGrid opinions={opinions} />
                <OpinionLandscape points={opinions} />
              </div>
            </motion.section>

            {/* META-DELIBERATION: Suggest Tomorrow's Question */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <QuestionSuggestions />
            </motion.section>
          </>
        )}
      </main>

      {/* Floating chat bubble */}
      <ChatBubble
        open={chatOpen}
        onToggle={() => setChatOpen((o) => !o)}
        language={language}
        interviewType="deliberation"
        deliberationId={deliberation?.id ?? null}
        deliberationQuestion={deliberation?.question ?? null}
        onComplete={handleInterviewComplete}
      />
    </>
  );
}
