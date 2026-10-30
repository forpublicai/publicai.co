"use client";

import { useState, useRef, useCallback } from "react";
import { parseAssistantContent, type Message } from "./MessageList";
import type { LanguageCode } from "@/lib/languages";
import { trackEvent } from "@/components/posthog-provider";

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
          if (event.toolName === "complete_survey") {
            onToolCall(event.input as ToolCallData);
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
  language: LanguageCode;
  onComplete: () => void;
}

export function useInterview({
  language,
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
              const { surveyResponse } = parseAssistantContent(acc);
              if (surveyResponse) {
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
    [language]
  );

  const start = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    setStarted(true);
    trackEvent("dialogue_interview_started", {
      language,
    });
    doSend([
      {
        role: "user",
        content: "Hello! I'd like to participate in the Swiss AI Dialogue.",
      },
    ]);
  }, [doSend, language]);

  const handleOptionSelect = useCallback(
    (option: string) => {
      if (isStreaming) return;
      trackEvent("dialogue_option_selected", {
        option,
        language,
      });
      doSend([...messagesRef.current, { role: "user", content: option }]);
    },
    [isStreaming, doSend, language]
  );

  const handleSubmit = useCallback(() => {
    const text = inputValue.trim();
    if (!text || isStreaming) return;
    trackEvent("dialogue_message_sent", {
      message_length: text.length,
      language,
    });
    doSend([...messagesRef.current, { role: "user", content: text }]);
  }, [inputValue, isStreaming, doSend, language]);

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
        trackEvent("dialogue_response_saved", {
          canton: demographics?.canton ?? null,
          age_range: demographics?.age_range ?? null,
          occupation: demographics?.occupation ?? null,
          language,
        });
        setSaved(true);
        onComplete();
      } catch (err) {
        console.error("Save error:", err);
        setSaving(false);
      }
    },
    [messages, language, saving, onComplete, toolCallData]
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
