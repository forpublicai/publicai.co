"use client";

import { useState, useRef, useCallback } from "react";
import { parseAssistantContent, type Message } from "./MessageList";
import type { LanguageCode } from "@/lib/languages";

export type InterviewType = "deliberation" | "survey";

export interface ToolCallData {
  opinion?: string;
  analysis?: {
    summary: string;
    topThemes: string[];
    topicScores: { topic: string; userPosition: string; alignmentWithMajority: number }[];
  };
  surveyResponse?: {
    themes: { theme: string; position: string; sentiment: string }[];
    overallSentiment: { hope: number; concern: number };
  };
}

async function streamChat(
  messages: { role: string; content: string }[],
  language: LanguageCode,
  deliberationQuestion: string | null,
  interviewType: InterviewType,
  onChunk: (chunk: string) => void,
  onToolCall: (data: ToolCallData) => void,
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
        } else if (event.type === "tool-input-available") {
          const toolName = event.toolName;
          const input = event.input;
          if (toolName === "complete_survey" || toolName === "complete_deliberation") {
            onToolCall(input as ToolCallData);
          }
        }
      } catch {
        // ignore
      }
    }
  }
  onDone();
}

interface UseInterviewOptions {
  interviewType: InterviewType;
  language: LanguageCode;
  deliberationId: string | null;
  deliberationQuestion: string | null;
  onComplete: () => void;
}

export function useInterview({
  interviewType,
  language,
  deliberationId,
  deliberationQuestion,
  onComplete,
}: UseInterviewOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingContent, setStreamingContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [started, setStarted] = useState(false);
  const [toolCallData, setToolCallData] = useState<ToolCallData | null>(null);
  const startedRef = useRef(false);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const doSend = useCallback(
    async (newMessages: Message[]) => {
      setMessages(newMessages);
      setStreamingContent("");
      setIsStreaming(true);
      setInputValue("");

      let acc = "";
      let receivedToolCall = false;

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
          (data) => {
            receivedToolCall = true;
            setToolCallData(data);
            setCompleted(true);
          },
          () => {
            const assistantMsg: Message = { role: "assistant", content: acc };
            setMessages((prev) => [...prev, assistantMsg]);
            setStreamingContent("");
            setIsStreaming(false);

            // Fallback: regex-based completion detection if no tool call received
            if (!receivedToolCall) {
              const { opinion, surveyResponse } = parseAssistantContent(acc);
              if (interviewType === "survey" ? surveyResponse : opinion) {
                setCompleted(true);
              }
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

  const start = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    setStarted(true);
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

  const handleSave = useCallback(
    async (demographics?: {
      canton: string | null;
      age_range: string | null;
      occupation?: string | null;
    }) => {
      if (saving) return;
      setSaving(true);

      try {
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
            canton: demographics?.canton ?? null,
            age_range: demographics?.age_range ?? null,
            occupation: demographics?.occupation ?? null,
            language,
            toolCallData: toolCallData ?? undefined,
          }),
        });
        setSaved(true);
        onComplete();
      } catch (err) {
        console.error("Save error:", err);
        setSaving(false);
      }
    },
    [deliberationId, interviewType, messages, language, saving, onComplete, toolCallData]
  );

  const reset = useCallback(() => {
    setMessages([]);
    setStreamingContent("");
    setIsStreaming(false);
    setInputValue("");
    setCompleted(false);
    setSaving(false);
    setSaved(false);
    setStarted(false);
    startedRef.current = false;
    setToolCallData(null);
  }, []);

  return {
    messages,
    streamingContent,
    isStreaming,
    inputValue,
    setInputValue,
    completed,
    saving,
    saved,
    started,
    start,
    handleOptionSelect,
    handleSubmit,
    handleSave,
    reset,
    toolCallData,
  };
}
