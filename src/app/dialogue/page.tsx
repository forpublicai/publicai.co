"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import Link from "next/link";
import { totalParticipation } from "@/components/dialogue/mockAnalytics";
import CantonMap from "@/components/dialogue/CantonMap";
import LanguageToggle from "@/components/dialogue/LanguageToggle";
import MessageList, {
  parseAssistantContent,
  type Message,
  type AnalysisData,
} from "@/components/dialogue/MessageList";
import InputBar from "@/components/dialogue/InputBar";
import OnboardingCTA from "@/components/dialogue/OnboardingCTA";
import type { LanguageCode } from "@/lib/languages";

// Lazy-load VoiceMode to avoid SSR issues with LiveKit
const VoiceMode = dynamic(
  () => import("@/components/dialogue/VoiceMode"),
  { ssr: false }
);

// ── Streaming ──

async function streamChat(
  messages: { role: string; content: string }[],
  language: LanguageCode,
  onChunk: (chunk: string) => void,
  onDone: () => void
) {
  const res = await fetch("/api/dialogue", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, language }),
  });

  if (!res.ok || !res.body) {
    throw new Error(`API error: ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed === "data: [DONE]") continue;
      if (!trimmed.startsWith("data: ")) continue;

      try {
        const event = JSON.parse(trimmed.slice(6));
        if (event.type === "text-delta") {
          onChunk(event.delta);
        }
      } catch {
        // ignore
      }
    }
  }
  onDone();
}

// ── Analysis Dashboard ──

function AnalysisDashboard({
  data,
  onCopySummary,
}: {
  data: AnalysisData;
  onCopySummary: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-4 overflow-hidden rounded-2xl border border-border bg-background"
    >
      <div className="border-b border-border bg-red-50 px-6 py-5 dark:bg-red-950/30">
        <h3 className="text-lg font-bold text-foreground">
          How your voice shapes Swiss AI
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s a summary of your perspectives from this dialogue.
        </p>
      </div>
      <div className="space-y-6 p-6">
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Your Perspective
          </h4>
          <p className="text-sm leading-relaxed text-foreground">{data.summary}</p>
        </div>
        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Key Themes
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.topThemes.map((theme, i) => (
              <motion.span
                key={theme}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="inline-flex items-center rounded-full bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 dark:bg-red-950 dark:text-red-300"
              >
                {theme}
              </motion.span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Your Positions
          </h4>
          <div className="space-y-3">
            {data.topicScores.map((score, i) => (
              <motion.div
                key={score.topic}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.06 }}
              >
                <div className="mb-1 flex items-baseline justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {score.topic}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {score.userPosition}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${score.alignmentWithMajority}%` }}
                      transition={{
                        delay: 0.3 + i * 0.06,
                        duration: 0.6,
                        ease: "easeOut",
                      }}
                      className={`h-full rounded-full ${
                        score.alignmentWithMajority >= 70
                          ? "bg-green-500"
                          : score.alignmentWithMajority >= 40
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    />
                  </div>
                  <span className="w-8 text-right text-xs tabular-nums text-muted-foreground">
                    {score.alignmentWithMajority}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <OnboardingCTA onCopySummary={onCopySummary} />
      </div>
    </motion.div>
  );
}

// ── Main page ──

export default function DialoguePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingContent, setStreamingContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [voiceMode, setVoiceMode] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent, scrollToBottom]);

  const doSend = useCallback(
    async (newMessages: Message[]) => {
      setMessages(newMessages);
      setStreamingContent("");
      setIsStreaming(true);
      setInputValue("");
      setHasStarted(true);

      let acc = "";

      try {
        await streamChat(
          newMessages.map((m) => ({ role: m.role, content: m.content })),
          language,
          (text) => {
            acc += text;
            setStreamingContent(acc);
          },
          () => {
            const assistantMsg: Message = { role: "assistant", content: acc };
            setMessages((prev) => [...prev, assistantMsg]);
            setStreamingContent("");
            setIsStreaming(false);

            const { analysis } = parseAssistantContent(acc);
            if (analysis) {
              setAnalysisData(analysis);
            }
          }
        );
      } catch (error) {
        console.error("Stream error:", error);
        setIsStreaming(false);
        setStreamingContent("");
      }
    },
    [language]
  );

  const startTextMode = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    setHasStarted(true);
    doSend([
      {
        role: "user",
        content: "Hello! I'd like to participate in the Swiss AI Dialogue.",
      },
    ]);
  }, [doSend]);

  const handleOptionSelect = useCallback(
    (option: string) => {
      if (isStreaming) return;
      doSend([...messagesRef.current, { role: "user", content: option }]);
    },
    [isStreaming, doSend]
  );

  const handleSubmit = useCallback(() => {
    const text = inputValue.trim();
    if (!text || isStreaming) return;
    doSend([...messagesRef.current, { role: "user", content: text }]);
  }, [inputValue, isStreaming, doSend]);

  const handleCopySummary = useCallback(() => {
    if (!analysisData) return;
    const text = `Swiss AI Dialogue Summary\n\n${analysisData.summary}\n\nKey themes: ${analysisData.topThemes.join(", ")}`;
    navigator.clipboard.writeText(text);
  }, [analysisData]);

  const handleVoiceTranscript = useCallback(
    (role: "user" | "assistant", text: string) => {
      setMessages((prev) => [...prev, { role, content: text }]);
    },
    []
  );

  const handleVoiceEnd = useCallback(() => {
    setVoiceMode(false);
  }, []);

  const handleVoiceStart = useCallback(() => {
    if (hasStarted) return; // Voice mode only available before first exchange
    setVoiceMode(true);
    setHasStarted(true);
    // Prevent text auto-start
    startedRef.current = true;
  }, [hasStarted]);

  return (
    <div className="fixed inset-0 flex flex-col bg-background">
      {/* Messages + Header scroll together */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {/* Hero header */}
        <div className="px-6 pt-12 pb-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                &larr; Back to Public AI
              </Link>
              <LanguageToggle value={language} onChange={setLanguage} />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="mt-4 mb-3 text-sm font-medium uppercase tracking-wide text-red-500">
                Swiss National AI Dialogue
              </p>
              <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                Your voice shapes Swiss AI
              </h1>
              <p className="mx-auto mb-2 max-w-lg text-base text-muted-foreground">
                Join {totalParticipation.toLocaleString()} citizens across all
                26 cantons in defining how AI is built and governed in
                Switzerland.
              </p>
              <p className="mx-auto mb-6 max-w-lg text-xs text-muted-foreground">
                This takes about 10 minutes. Your responses are anonymous and go
                toward shaping Swiss AI policy.
              </p>
            </motion.div>
            <div className="mb-6 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                CIP
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                Public AI
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                Swiss AI
              </span>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="mb-4 text-center">
                <div className="text-2xl font-bold text-foreground">
                  {totalParticipation.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  citizens have shared their views across all 26 cantons
                </div>
              </div>
              <CantonMap />
            </motion.div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-auto max-w-2xl px-4 pb-2">
          <div className="h-px bg-border" />
        </div>

        {/* Voice mode UI */}
        {voiceMode && (
          <div className="px-4 py-6">
            <div className="mx-auto max-w-2xl">
              <VoiceMode
                language={language}
                onEnd={handleVoiceEnd}
                onTranscript={handleVoiceTranscript}
              />
            </div>
          </div>
        )}

        {/* Messages (shown in both modes — voice transcripts appear here too) */}
        <div className="px-4 py-6">
          <div className="mx-auto max-w-2xl space-y-4">
            <MessageList
              messages={messages}
              streamingContent={streamingContent}
              isStreaming={isStreaming}
              onOptionSelect={handleOptionSelect}
              renderAnalysis={(data) => (
                <AnalysisDashboard
                  data={data}
                  onCopySummary={handleCopySummary}
                />
              )}
            />
            <div className="h-4" />
          </div>
        </div>
      </div>

      {/* Mode picker — shown before interview starts */}
      {!hasStarted && !voiceMode && (
        <div className="shrink-0 border-t border-border bg-background px-4 py-6">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-3">
            <p className="text-sm text-muted-foreground">How would you like to participate?</p>
            <div className="flex items-center gap-3">
              <button
                onClick={startTextMode}
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Type
              </button>
              <button
                onClick={handleVoiceStart}
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                </svg>
                Speak
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Text input bar — shown during text mode */}
      {hasStarted && !analysisData && !voiceMode && (
        <div className="shrink-0 border-t border-border bg-background px-4 py-4">
          <div className="mx-auto max-w-2xl">
            <InputBar
              value={inputValue}
              onChange={setInputValue}
              onSubmit={handleSubmit}
              disabled={isStreaming}
            />
          </div>
        </div>
      )}
    </div>
  );
}
