"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";
import MessageList from "./MessageList";
import InputBar from "./InputBar";
import { useInterview, type InterviewType } from "./useInterview";
import { cantonData } from "./CantonMap";
import type { LanguageCode } from "@/lib/languages";

const AGE_RANGES = ["18-29", "30-44", "45-64", "65+", "Prefer not to say"];
const OCCUPATIONS = [
  "Technology / IT",
  "Healthcare",
  "Education",
  "Finance / Banking",
  "Government / Public Sector",
  "Science / Research",
  "Legal",
  "Media / Communications",
  "Student",
  "Retired",
  "Other",
  "Prefer not to say",
];

interface InlineChatProps {
  language: LanguageCode;
  interviewType: InterviewType;
  deliberationId: string | null;
  deliberationQuestion: string | null;
  onComplete: () => void;
}

export default function InlineChat({
  language,
  interviewType,
  deliberationId,
  deliberationQuestion,
  onComplete,
}: InlineChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedCanton, setSelectedCanton] = useState("");
  const [selectedAge, setSelectedAge] = useState("");
  const interview = useInterview({
    interviewType,
    language,
    deliberationId,
    deliberationQuestion,
    onComplete,
  });

  const [selectedOccupation, setSelectedOccupation] = useState("");

  // Auto-start on mount — intentionally narrow deps to avoid double-fire
  useEffect(() => {
    if (!interview.started) {
      interview.start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interview.started, interview.start]);

  // Scroll to bottom on new messages
  useEffect(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  }, [interview.messages, interview.streamingContent]);

  const handleDemographicsSubmit = () => {
    interview.handleSave({
      canton: selectedCanton || null,
      age_range: selectedAge || null,
      occupation: selectedOccupation || null,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl border border-border bg-background"
    >
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-sm font-semibold text-foreground">
          Take the Survey
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Share your views on how Switzerland should build, govern, and deploy AI
        </p>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="max-h-[500px] overflow-y-auto px-6 py-6"
      >
        <div className="mx-auto max-w-lg space-y-4">
          <MessageList
            messages={interview.messages}
            streamingContent={interview.streamingContent}
            isStreaming={interview.isStreaming}
            onOptionSelect={interview.handleOptionSelect}
          />
          <div className="h-2" />
        </div>
      </div>

      {/* Input / Demographics / Submit */}
      <div className="border-t border-border bg-background px-6 py-4">
        <div className="mx-auto max-w-lg">
          {interview.saved ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                Thank you for completing the survey!
              </p>
              <p className="text-xs text-muted-foreground">
                Your response has been recorded.
              </p>
            </div>
          ) : interview.completed ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Before we save your response, a couple of optional questions to
                help us understand different perspectives:
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-foreground">
                    Canton
                  </label>
                  <select
                    value={selectedCanton}
                    onChange={(e) => setSelectedCanton(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  >
                    <option value="">Select canton (optional)</option>
                    {cantonData.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-foreground">
                    Age range
                  </label>
                  <select
                    value={selectedAge}
                    onChange={(e) => setSelectedAge(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  >
                    <option value="">Select age range (optional)</option>
                    {AGE_RANGES.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-foreground">
                    Occupation
                  </label>
                  <select
                    value={selectedOccupation}
                    onChange={(e) => setSelectedOccupation(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  >
                    <option value="">Select occupation (optional)</option>
                    {OCCUPATIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                onClick={handleDemographicsSubmit}
                disabled={interview.saving}
                className="w-full rounded-full bg-red-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50"
              >
                {interview.saving ? "Saving..." : "Submit Survey"}
              </button>
            </div>
          ) : (
            <InputBar
              value={interview.inputValue}
              onChange={interview.setInputValue}
              onSubmit={interview.handleSubmit}
              disabled={interview.isStreaming}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
