"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { totalParticipation } from "@/components/dialogue/mockAnalytics";
import CantonMap from "@/components/dialogue/CantonMap";

// ── Types ──

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface TopicScore {
  topic: string;
  userPosition: string;
  alignmentWithMajority: number;
}

interface AnalysisData {
  summary: string;
  topThemes: string[];
  topicScores: TopicScore[];
}

// ── Text parsing ──

/** Extract [[option]] items and split content into text + options */
function parseAssistantContent(content: string): {
  textBefore: string;
  options: string[];
  analysis: AnalysisData | null;
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

  return { textBefore, options, analysis };
}

// ── Streaming ──

async function streamChat(
  messages: { role: string; content: string }[],
  onChunk: (chunk: string) => void,
  onDone: () => void
) {
  const res = await fetch("/api/dialogue", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
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

// ── Components ──

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

function AnalysisDashboard({ data }: { data: AnalysisData }) {
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
                  <span className="text-sm font-medium text-foreground">{score.topic}</span>
                  <span className="text-xs text-muted-foreground">{score.userPosition}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${score.alignmentWithMajority}%` }}
                      transition={{ delay: 0.3 + i * 0.06, duration: 0.6, ease: "easeOut" }}
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
        <div className="flex flex-wrap gap-3 border-t border-border pt-5">
          <Link href="/" className="rounded-full bg-red-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600">
            Back to Public AI
          </Link>
          <a href="https://chat.publicai.co" target="_blank" rel="noopener noreferrer" className="rounded-full border border-border px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted">
            Try Apertus Chat
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
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

// ── Main page ──

export default function DialoguePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingContent, setStreamingContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
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

  const doSend = useCallback(async (newMessages: Message[]) => {
    setMessages(newMessages);
    setStreamingContent("");
    setIsStreaming(true);
    setInputValue("");

    let acc = "";

    try {
      await streamChat(
        newMessages.map((m) => ({ role: m.role, content: m.content })),
        (text) => {
          acc += text;
          setStreamingContent(acc);
        },
        () => {
          const assistantMsg: Message = { role: "assistant", content: acc };
          setMessages((prev) => [...prev, assistantMsg]);
          setStreamingContent("");
          setIsStreaming(false);

          // Check for analysis in the final content
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
  }, []);

  // Auto-start
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    doSend([{ role: "user", content: "Hello! I'd like to participate in the Swiss AI Dialogue." }]);
  }, [doSend]);

  const handleOptionSelect = useCallback(
    (option: string) => {
      if (isStreaming) return;
      doSend([...messagesRef.current, { role: "user", content: option }]);
    },
    [isStreaming, doSend]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const text = inputValue.trim();
      if (!text || isStreaming) return;
      doSend([...messagesRef.current, { role: "user", content: text }]);
    },
    [inputValue, isStreaming, doSend]
  );

  return (
    <div className="fixed inset-0 flex flex-col bg-background">
      {/* Messages + Header scroll together */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {/* Hero header */}
        <div className="px-6 pt-12 pb-8">
          <div className="mx-auto max-w-2xl text-center">
            <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              &larr; Back to Public AI
            </Link>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <p className="text-sm font-medium text-red-500 mt-4 mb-3 tracking-wide uppercase">
                Swiss National AI Dialogue
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Your voice shapes Swiss AI
              </h1>
              <p className="text-base text-muted-foreground max-w-lg mx-auto mb-6">
                Join {totalParticipation.toLocaleString()} citizens across all 26 cantons in defining how AI is built and governed in Switzerland.
              </p>
            </motion.div>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground flex-wrap mb-6">
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-foreground">{totalParticipation.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">citizens have shared their views across all 26 cantons</div>
              </div>
              <CantonMap />
            </motion.div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-auto max-w-2xl px-4 pb-2">
          <div className="h-px bg-border" />
        </div>

        {/* Messages */}
        <div className="px-4 py-6">
          <div className="mx-auto max-w-2xl space-y-4">
          <AnimatePresence mode="popLayout">
            {messages.map((msg, i) => {
              // Hide auto-start message
              if (i === 0 && msg.role === "user") return null;

              if (msg.role === "user") {
                return (
                  <motion.div key={`msg-${i}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
                    <div className="max-w-[80%] rounded-3xl bg-muted px-5 py-2.5 text-sm text-foreground">
                      {msg.content}
                    </div>
                  </motion.div>
                );
              }

              // Assistant message — parse for options and analysis
              const { textBefore, options, analysis } = parseAssistantContent(msg.content);
              const isLast = i === messages.length - 1 && !isStreaming;

              return (
                <motion.div key={`msg-${i}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
                  {textBefore && (
                    <div className="text-sm leading-7 text-foreground whitespace-pre-wrap">{textBefore}</div>
                  )}
                  {options.length > 0 && (
                    <OptionButtons
                      options={options}
                      onSelect={handleOptionSelect}
                      disabled={!isLast}
                    />
                  )}
                  {analysis && <AnalysisDashboard data={analysis} />}
                </motion.div>
              );
            })}

            {/* Streaming */}
            {isStreaming && streamingContent && (
              <motion.div key="streaming" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1">
                <div className="text-sm leading-7 text-foreground whitespace-pre-wrap">
                  {parseAssistantContent(streamingContent).textBefore || streamingContent}
                </div>
              </motion.div>
            )}

            {isStreaming && !streamingContent && (
              <motion.div key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <TypingIndicator />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="h-4" />
        </div>
        </div>
      </div>

      {/* Input */}
      {!analysisData && (
        <div className="shrink-0 border-t border-border bg-background px-4 py-4">
          <form onSubmit={handleSubmit} className="mx-auto flex max-w-2xl items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your thoughts..."
              disabled={isStreaming}
              className="flex-1 rounded-full border border-border bg-muted px-5 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-red-300 focus:ring-1 focus:ring-red-300 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isStreaming || !inputValue.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-opacity hover:opacity-80 disabled:opacity-30"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
