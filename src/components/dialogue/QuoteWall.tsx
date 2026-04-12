"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { cantonData } from "./CantonMap";

interface Quote {
  id: string;
  opinion_text: string;
  canton: string | null;
  occupation: string | null;
  cluster_label: string | null;
  submitted_at?: string;
  created_at?: string;
}

type QuoteWallMode = "deliberation" | "survey";

interface QuoteWallProps {
  deliberationId?: string | null;
  mode?: QuoteWallMode;
}

function getCantonName(id: string): string {
  return cantonData.find((c) => c.id === id)?.name ?? id;
}

export default function QuoteWall({
  deliberationId,
  mode = "deliberation",
}: QuoteWallProps) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCanton, setSelectedCanton] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "survey") {
      fetch("/api/dialogue/survey/quotes")
        .then((r) => r.json())
        .then((data) => setQuotes(data.quotes || []))
        .catch(() => {});
    } else {
      if (!deliberationId) return;
      fetch(`/api/dialogue/opinions?deliberation_id=${deliberationId}`)
        .then((r) => r.json())
        .then((data) => setQuotes(data.opinions || data || []))
        .catch(() => {});
    }
  }, [mode, deliberationId]);

  // Canton counts for the sidebar
  const cantonCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const q of quotes) {
      const key = q.canton ? getCantonName(q.canton) : "Unknown";
      counts[key] = (counts[key] || 0) + 1;
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [quotes]);

  const filtered = useMemo(() => {
    let result = quotes;

    // Filter by canton
    if (selectedCanton) {
      result = result.filter((q) => {
        const name = q.canton ? getCantonName(q.canton) : "Unknown";
        return name === selectedCanton;
      });
    }

    // Filter by search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (quote) =>
          quote.opinion_text.toLowerCase().includes(q) ||
          (quote.canton &&
            getCantonName(quote.canton).toLowerCase().includes(q)) ||
          (quote.occupation &&
            quote.occupation.toLowerCase().includes(q)) ||
          (quote.cluster_label &&
            quote.cluster_label.toLowerCase().includes(q))
      );
    }

    return result;
  }, [quotes, search, selectedCanton]);

  return (
    <div className="rounded-xl border border-border bg-background p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">
          Voices of Switzerland
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          What participants are saying
        </p>
      </div>

      {quotes.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No responses yet. Be the first to share your perspective.
        </p>
      ) : (
        <div className="flex gap-6">
          {/* Left sidebar — canton filter */}
          <div className="hidden w-56 shrink-0 md:block">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Filter by Canton
            </h3>
            <input
              type="text"
              placeholder="Search cantons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-2 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground"
            />
            <div className="max-h-[400px] space-y-0.5 overflow-y-auto">
              <button
                onClick={() => setSelectedCanton(null)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-left text-xs transition-colors ${
                  selectedCanton === null
                    ? "bg-foreground text-background"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <span>All</span>
                <span className="tabular-nums">{quotes.length}</span>
              </button>
              {cantonCounts.map(([canton, count]) => (
                <button
                  key={canton}
                  onClick={() =>
                    setSelectedCanton(
                      selectedCanton === canton ? null : canton
                    )
                  }
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-left text-xs transition-colors ${
                    selectedCanton === canton
                      ? "bg-foreground text-background"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <span>{canton}</span>
                  <span className="tabular-nums">{count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right area — quote grid */}
          <div className="min-w-0 flex-1">
            {/* Mobile search + filter */}
            <div className="mb-4 flex items-center gap-2 md:hidden">
              <input
                type="text"
                placeholder="Search quotes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No quotes match your filters.
              </p>
            ) : (
              <div className="columns-1 gap-3 sm:columns-2 lg:columns-3">
                {filtered.slice(0, 30).map((q, i) => (
                  <motion.blockquote
                    key={q.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="mb-3 break-inside-avoid rounded-lg border border-border bg-muted/30 px-4 py-3"
                  >
                    {/* Canton name bold at top */}
                    {q.canton && (
                      <p className="text-xs font-bold text-foreground">
                        {getCantonName(q.canton)}
                      </p>
                    )}
                    {/* Occupation below canton */}
                    {q.occupation && (
                      <p className="text-xs text-muted-foreground">
                        {q.occupation}
                      </p>
                    )}
                    {/* Quote text */}
                    <p className="mt-1.5 text-sm leading-relaxed text-foreground">
                      &ldquo;{q.opinion_text}&rdquo;
                    </p>
                    {/* Theme tag */}
                    {q.cluster_label && (
                      <div className="mt-2">
                        <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                          {q.cluster_label}
                        </span>
                      </div>
                    )}
                  </motion.blockquote>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
