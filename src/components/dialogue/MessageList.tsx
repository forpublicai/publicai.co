"use client";

import { motion, AnimatePresence } from "motion/react";
import FeedbackCard, { type FeedbackData } from "./FeedbackCard";

// ── Types ──

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface TopicScore {
  topic: string;
  userPosition: string;
  alignmentWithMajority: number;
}

export interface AnalysisData {
  summary: string;
  topThemes: string[];
  topicScores: TopicScore[];
}

// ── Parsing ──

export function parseAssistantContent(content: string): {
  textBefore: string;
  options: string[];
  analysis: AnalysisData | null;
  feedback: FeedbackData | null;
} {
  // Check for analysis block
  const analysisMatch = content.match(/```ANALYSIS\s*\n([\s\S]*?)\n```/);
  let analysis: AnalysisData | null = null;
  let remaining = content;

  if (analysisMatch) {
    try {
      analysis = JSON.parse(analysisMatch[1]);
    } catch {
      // ignore parse errors
    }
    remaining = content.replace(analysisMatch[0], "").trim();
  }

  // Check for feedback block
  const feedbackMatch = remaining.match(/```FEEDBACK\s*\n([\s\S]*?)\n```/);
  let feedback: FeedbackData | null = null;

  if (feedbackMatch) {
    try {
      feedback = JSON.parse(feedbackMatch[1]);
    } catch {
      // ignore parse errors
    }
    remaining = remaining.replace(feedbackMatch[0], "").trim();
  }

  // Extract [[options]]
  const optionRegex = /^\[\[(.+?)\]\]$/gm;
  const options: string[] = [];
  let match;
  while ((match = optionRegex.exec(remaining)) !== null) {
    options.push(match[1]);
  }

  // Text before options (remove option lines)
  const textBefore = remaining
    .replace(/^\[\[.+?\]\]$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return { textBefore, options, analysis, feedback };
}

// ── Sub-components ──

function OptionButtons({
  options,
  onSelect,
  disabled,
}: {
  options: string[];
  onSelect: (option: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="mt-3 flex flex-col gap-2">
      {options.map((option, i) => (
        <motion.button
          key={`${option}-${i}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          onClick={() => !disabled && onSelect(option)}
          disabled={disabled}
          className="w-fit rounded-full border border-border bg-background px-4 py-2 text-left text-sm text-foreground transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:opacity-40 disabled:hover:border-border disabled:hover:bg-background disabled:hover:text-foreground dark:hover:border-red-800 dark:hover:bg-red-950 dark:hover:text-red-300"
        >
          {option}
        </motion.button>
      ))}
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 py-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

// ── MessageList ──

interface MessageListProps {
  messages: Message[];
  streamingContent: string;
  isStreaming: boolean;
  onOptionSelect: (option: string) => void;
  renderAnalysis: (data: AnalysisData) => React.ReactNode;
}

export default function MessageList({
  messages,
  streamingContent,
  isStreaming,
  onOptionSelect,
  renderAnalysis,
}: MessageListProps) {
  return (
    <AnimatePresence mode="popLayout">
      {messages.map((msg, i) => {
        // Hide auto-start message
        if (i === 0 && msg.role === "user") return null;

        if (msg.role === "user") {
          return (
            <motion.div
              key={`msg-${i}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-end"
            >
              <div className="max-w-[80%] rounded-3xl bg-muted px-5 py-2.5 text-sm text-foreground">
                {msg.content}
              </div>
            </motion.div>
          );
        }

        // Assistant message
        const { textBefore, options, analysis, feedback } = parseAssistantContent(msg.content);
        const isLast = i === messages.length - 1 && !isStreaming;

        return (
          <motion.div
            key={`msg-${i}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-1"
          >
            {textBefore && (
              <div className="text-sm leading-7 text-foreground whitespace-pre-wrap">
                {textBefore}
              </div>
            )}
            {options.length > 0 && (
              <OptionButtons
                options={options}
                onSelect={onOptionSelect}
                disabled={!isLast}
              />
            )}
            {feedback && <FeedbackCard data={feedback} />}
            {analysis && renderAnalysis(analysis)}
          </motion.div>
        );
      })}

      {/* Streaming */}
      {isStreaming && streamingContent && (
        <motion.div
          key="streaming"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-1"
        >
          <div className="text-sm leading-7 text-foreground whitespace-pre-wrap">
            {parseAssistantContent(streamingContent).textBefore || streamingContent}
          </div>
        </motion.div>
      )}

      {isStreaming && !streamingContent && (
        <motion.div
          key="typing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <TypingIndicator />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
