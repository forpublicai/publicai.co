"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import MessageList from "./MessageList";
import InputBar from "./InputBar";
import { useInterview, type InterviewType } from "./useInterview";
import type { LanguageCode } from "@/lib/languages";

interface ChatBubbleProps {
  open: boolean;
  onToggle: () => void;
  language: LanguageCode;
  interviewType: InterviewType;
  deliberationId: string | null;
  deliberationQuestion: string | null;
  onComplete: () => void;
}

export default function ChatBubble({
  open,
  onToggle,
  language,
  interviewType,
  deliberationId,
  deliberationQuestion,
  onComplete,
}: ChatBubbleProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const interview = useInterview({
    interviewType,
    language,
    deliberationId,
    deliberationQuestion,
    onComplete,
  });

  // Auto-start on first open — intentionally narrow deps to avoid double-fire
  useEffect(() => {
    if (open && !interview.started) {
      interview.start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, interview.started, interview.start]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  }, [interview.messages, interview.streamingContent, open]);

  const headerText = "Share Your View";
  const submitText = "Submit My Opinion";

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="flex w-[380px] max-h-[min(600px,calc(100vh-120px))] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 className="text-sm font-semibold text-foreground">
                {headerText}
              </h2>
              <button
                onClick={onToggle}
                className="text-muted-foreground hover:text-foreground"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="4 14 10 14 10 20" />
                  <polyline points="20 10 14 10 14 4" />
                  <line x1="14" y1="10" x2="21" y2="3" />
                  <line x1="3" y1="21" x2="10" y2="14" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
              <div className="space-y-4">
                <MessageList
                  messages={interview.messages}
                  streamingContent={interview.streamingContent}
                  isStreaming={interview.isStreaming}
                  onOptionSelect={interview.handleOptionSelect}
                />
                <div className="h-2" />
              </div>
            </div>

            {/* Input / Submit */}
            <div className="shrink-0 border-t border-border bg-background px-4 py-3">
              {interview.saved ? (
                <p className="text-center text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                  Thanks for sharing your view!
                </p>
              ) : interview.completed ? (
                <button
                  onClick={() => interview.handleSave()}
                  disabled={interview.saving}
                  className="w-full rounded-full bg-red-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50"
                >
                  {interview.saving ? "Saving..." : submitText}
                </button>
              ) : (
                <InputBar
                  value={interview.inputValue}
                  onChange={interview.setInputValue}
                  onSubmit={interview.handleSubmit}
                  disabled={interview.isStreaming}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <motion.button
        onClick={onToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-colors hover:bg-red-600"
      >
        {open ? (
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        ) : (
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </motion.button>
    </div>
  );
}
