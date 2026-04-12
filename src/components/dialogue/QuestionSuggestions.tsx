"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Suggestion {
  id: string;
  questionText: string;
  source: string;
  votes: number;
  hasVoted: boolean;
  createdAt: string;
}

export default function QuestionSuggestions() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchSuggestions = useCallback(async () => {
    try {
      const res = await fetch("/api/dialogue/meta/suggestions");
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data.suggestions || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || submitting) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/dialogue/meta/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionText: newQuestion.trim() }),
      });
      if (res.ok) {
        setNewQuestion("");
        fetchSuggestions();
      }
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (suggestionId: string) => {
    // Optimistic update
    setSuggestions((prev) =>
      prev.map((s) =>
        s.id === suggestionId
          ? { ...s, votes: s.votes + 1, hasVoted: true }
          : s
      )
    );

    try {
      await fetch("/api/dialogue/meta/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suggestionId }),
      });
    } catch {
      // Revert on error
      fetchSuggestions();
    }
  };

  return (
    <div className="rounded-xl border border-border bg-background p-6">
      <h2 className="text-lg font-semibold text-foreground">
        Suggest Tomorrow&apos;s Question
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Help shape the dialogue. Suggest a question or vote for existing ones.
      </p>

      {/* Submit form */}
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          type="text"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="What question should Switzerland discuss next?"
          className="flex-1 rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-red-300 focus:outline-none focus:ring-1 focus:ring-red-300"
        />
        <button
          type="submit"
          disabled={submitting || newQuestion.trim().length < 10}
          className="shrink-0 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50"
        >
          {submitting ? "..." : "Suggest"}
        </button>
      </form>

      {/* Suggestions list */}
      <div className="mt-6 space-y-2">
        {loading && (
          <p className="text-sm text-muted-foreground">Loading suggestions...</p>
        )}

        <AnimatePresence mode="popLayout">
          {suggestions.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-start gap-3 rounded-lg border border-border px-4 py-3"
            >
              <button
                onClick={() => !s.hasVoted && handleVote(s.id)}
                disabled={s.hasVoted}
                className={`mt-0.5 flex shrink-0 flex-col items-center gap-0.5 transition-colors ${
                  s.hasVoted
                    ? "text-red-500"
                    : "text-muted-foreground hover:text-red-500"
                }`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill={s.hasVoted ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="18 15 12 9 6 15" />
                </svg>
                <span className="text-xs font-semibold">{s.votes}</span>
              </button>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-foreground">{s.questionText}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {s.source === "llm" ? "AI-suggested" : "Community suggestion"}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {!loading && suggestions.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No suggestions yet. Be the first to propose a question!
          </p>
        )}
      </div>
    </div>
  );
}
