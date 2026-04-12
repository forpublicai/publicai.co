"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import MessageList, {
  parseAssistantContent,
  type Message,
} from "./MessageList";
import InputBar from "./InputBar";
import type { LanguageCode } from "@/lib/languages";

export type InterviewType = "deliberation" | "survey";

interface InterviewDrawerProps {
  open: boolean;
  onClose: () => void;
  language: LanguageCode;
  interviewType?: InterviewType;
  deliberationId: string | null;
  deliberationQuestion: string | null;
  onComplete: () => void;
}

async function streamChat(
  messages: { role: string; content: string }[],
  language: LanguageCode,
  deliberationQuestion: string | null,
  interviewType: InterviewType,
  onChunk: (chunk: string) => void,
  onDone: () => void
) {
  const res = await fetch("/api/dialogue", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages,
      language,
      deliberationQuestion,
      interviewType,
    }),
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

// Detect canton from user messages
const CANTON_IDS = [
  "ZH", "BE", "LU", "UR", "SZ", "OW", "NW", "GL", "ZG", "FR",
  "SO", "BS", "BL", "SH", "AR", "AI", "SG", "GR", "AG", "TG",
  "TI", "VD", "VS", "NE", "GE", "JU",
];

function detectCanton(messages: Message[]): string | null {
  for (const msg of messages) {
    if (msg.role !== "user") continue;
    const upper = msg.content.toUpperCase().trim();
    for (const id of CANTON_IDS) {
      if (new RegExp(`\\b${id}\\b`).test(upper)) return id;
    }
  }
  return null;
}

export default function InterviewDrawer({
  open,
  onClose,
  language,
  interviewType = "deliberation",
  deliberationId,
  deliberationQuestion,
  onComplete,
}: InterviewDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingContent, setStreamingContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
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

      let acc = "";

      try {
        await streamChat(
          newMessages.map((m) => ({ role: m.role, content: m.content })),
          language,
          deliberationQuestion,
          interviewType,
          (text) => {
            acc += text;
            setStreamingContent(acc);
          },
          () => {
            const assistantMsg: Message = { role: "assistant", content: acc };
            setMessages((prev) => [...prev, assistantMsg]);
            setStreamingContent("");
            setIsStreaming(false);

            // Check if interview is complete
            const { opinion, surveyResponse } = parseAssistantContent(acc);
            if (interviewType === "survey" ? surveyResponse : opinion) {
              setCompleted(true);
            }
          }
        );
      } catch (error) {
        console.error("Stream error:", error);
        setIsStreaming(false);
        setStreamingContent("");
      }
    },
    [language, deliberationQuestion, interviewType]
  );

  // Auto-start when drawer opens
  useEffect(() => {
    if (!open || startedRef.current) return;
    startedRef.current = true;
    doSend([
      {
        role: "user",
        content: "Hello! I'd like to participate in the Swiss AI Dialogue.",
      },
    ]);
  }, [open, doSend]);

  // Reset when drawer closes
  useEffect(() => {
    if (!open) {
      startedRef.current = false;
      setMessages([]);
      setStreamingContent("");
      setIsStreaming(false);
      setInputValue("");
      setCompleted(false);
      setSaving(false);
    }
  }, [open]);

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

  const handleSave = useCallback(async () => {
    if (!deliberationId || saving) return;
    setSaving(true);

    try {
      const canton = detectCanton(messages);
      await fetch("/api/dialogue/interview/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deliberation_id: deliberationId,
          interview_type: interviewType,
          messages: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          canton,
          language,
        }),
      });
      onComplete();
      onClose();
    } catch (err) {
      console.error("Save error:", err);
      setSaving(false);
    }
  }, [deliberationId, interviewType, messages, language, saving, onComplete, onClose]);

  const headerText = interviewType === "survey" ? "Take the Survey" : "Share Your View";
  const submitText = interviewType === "survey" ? "Submit Survey" : "Submit My Opinion";

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col bg-background shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-sm font-semibold text-foreground">
                {headerText}
              </h2>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-5 py-6"
            >
              <div className="mx-auto max-w-lg space-y-4">
                <MessageList
                  messages={messages}
                  streamingContent={streamingContent}
                  isStreaming={isStreaming}
                  onOptionSelect={handleOptionSelect}
                />
                <div className="h-4" />
              </div>
            </div>

            {/* Input / Complete */}
            <div className="shrink-0 border-t border-border bg-background px-5 py-4">
              <div className="mx-auto max-w-lg">
                {completed ? (
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full rounded-full bg-red-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50"
                  >
                    {saving ? "Saving..." : submitText}
                  </button>
                ) : (
                  <InputBar
                    value={inputValue}
                    onChange={setInputValue}
                    onSubmit={handleSubmit}
                    disabled={isStreaming}
                  />
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
