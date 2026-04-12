"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import MessageList, { type Message } from "./MessageList";
import InputBar from "./InputBar";
import { cantonData } from "./CantonMap";

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

interface SurveyHeroProps {
  totalResponses: number;
  // From useInterview hook
  messages: Message[];
  streamingContent: string;
  isStreaming: boolean;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onOptionSelect: (option: string) => void;
  started: boolean;
  onStart: () => void;
  completed: boolean;
  saved: boolean;
  saving: boolean;
  onSave: (demographics: {
    canton: string | null;
    age_range: string | null;
    occupation: string | null;
  }) => void;
}

export default function SurveyHero({
  totalResponses,
  messages,
  streamingContent,
  isStreaming,
  inputValue,
  onInputChange,
  onSubmit,
  onOptionSelect,
  started,
  onStart,
  completed,
  saved,
  saving,
  onSave,
}: SurveyHeroProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedCanton, setSelectedCanton] = useState("");
  const [selectedAge, setSelectedAge] = useState("");
  const [selectedOccupation, setSelectedOccupation] = useState("");

  // Scroll to bottom on new messages
  useEffect(() => {
    if (!started) return;
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  }, [messages, streamingContent, started]);

  const handleDemographicsSubmit = () => {
    onSave({
      canton: selectedCanton || null,
      age_range: selectedAge || null,
      occupation: selectedOccupation || null,
    });
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-background">
      {/* Glow effect */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-red-500/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-red-500/10 blur-3xl" />
      </div>

      <div className="relative px-6 py-8 sm:px-10 sm:py-10 space-y-4">
        {/* Header — compresses when expanded */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1
              className={`font-bold tracking-tight text-foreground transition-all duration-300 ${
                started ? "text-lg sm:text-xl" : "text-2xl sm:text-3xl"
              }`}
            >
              National Survey
            </h1>
            <AnimatePresence>
              {!started && (
                <motion.p
                  initial={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm leading-relaxed text-muted-foreground max-w-2xl overflow-hidden"
                >
                  A comprehensive look at how Swiss citizens think AI should be
                  built, governed, and deployed. Share your views in a longer
                  interview covering broad themes.
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Collapse button when expanded */}
          {started && !completed && !saved && (
            <button
              onClick={() => {
                scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="shrink-0 ml-4 rounded-full p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Scroll to top"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>
              <span className="font-semibold text-foreground">
                {totalResponses}
              </span>{" "}
              responses
            </span>
          </div>
        </div>

        {/* CTA button — only when not started */}
        {!started && (
          <button
            onClick={onStart}
            className="inline-flex items-center gap-2 rounded-full bg-red-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-red-600"
          >
            Take the Survey
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        )}
      </div>

      {/* Expanded chat area */}
      <AnimatePresence>
        {started && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {/* Divider */}
            <div className="border-t border-border" />

            {/* Messages */}
            <div
              ref={scrollRef}
              className="max-h-[500px] overflow-y-auto px-6 py-6"
            >
              <div className="mx-auto max-w-lg space-y-4">
                <MessageList
                  messages={messages}
                  streamingContent={streamingContent}
                  isStreaming={isStreaming}
                  onOptionSelect={onOptionSelect}
                />
                <div className="h-2" />
              </div>
            </div>

            {/* Input / Demographics / Thank you */}
            <div className="border-t border-border bg-background px-6 py-4">
              <div className="mx-auto max-w-lg">
                {saved ? (
                  <div className="flex flex-col items-center gap-2 py-2">
                    <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      Thank you for completing the survey!
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Your response has been recorded.
                    </p>
                  </div>
                ) : completed ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Before we save your response, a couple of optional
                      questions to help us understand different perspectives:
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
                          <option value="">
                            Select age range (optional)
                          </option>
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
                          onChange={(e) =>
                            setSelectedOccupation(e.target.value)
                          }
                          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                        >
                          <option value="">
                            Select occupation (optional)
                          </option>
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
                      disabled={saving}
                      className="w-full rounded-full bg-red-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Submit Survey"}
                    </button>
                  </div>
                ) : (
                  <InputBar
                    value={inputValue}
                    onChange={onInputChange}
                    onSubmit={onSubmit}
                    disabled={isStreaming}
                  />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
