"use client";

import React, { useState, useMemo } from "react";
import { Check, Copy, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { LiveModelPricingItem } from "@/lib/live-model-pricing";

export interface LiveModelPricingTableProps {
  initialModels: LiveModelPricingItem[];
  fetchedAt?: string;
  source?: "live" | "fallback";
}

function formatPrice(price: number): string {
  if (price === 0) return "$0.00";
  if (price < 0.01) return `$${price.toFixed(4)}`;
  return `$${price.toFixed(2)}`;
}

export function LiveModelPricingTable({
  initialModels,
  fetchedAt,
  source = "live",
}: LiveModelPricingTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredModels = useMemo(() => {
    if (!searchQuery.trim()) {
      return initialModels;
    }
    const q = searchQuery.toLowerCase().trim();
    return initialModels.filter((model) =>
      model.id.toLowerCase().includes(q)
    );
  }, [initialModels, searchQuery]);

  const handleCopyId = (id: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(id);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Bar & Total Counter */}
      {/*<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-border bg-secondary/30 p-3 sm:p-4">*/}
      {/*  <div className="relative w-full sm:w-80">*/}
      {/*    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />*/}
      {/*    <Input*/}
      {/*      value={searchQuery}*/}
      {/*      onChange={(e) => setSearchQuery(e.target.value)}*/}
      {/*      placeholder="Filter models by name..."*/}
      {/*      className="pl-9 text-xs sm:text-sm rounded-xl bg-background"*/}
      {/*    />*/}
      {/*  </div>*/}

      {/*  <div className="text-xs text-muted-foreground px-1 sm:px-0">*/}
      {/*    {searchQuery.trim() ? (*/}
      {/*      <span>*/}
      {/*        Showing <strong className="text-foreground">{filteredModels.length}</strong> of {initialModels.length} models*/}
      {/*      </span>*/}
      {/*    ) : (*/}
      {/*      <span>*/}
      {/*        <strong className="text-foreground">{initialModels.length}</strong> dynamic models available*/}
      {/*      </span>*/}
      {/*    )}*/}
      {/*  </div>*/}
      {/*</div>*/}

      {/* Pricing Table */}
      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-xs">
        <table className="w-full border-separate border-spacing-0 text-left text-sm">
          <thead className="bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th scope="col" className="border-b border-border py-3.5 pl-5 pr-3 font-semibold text-foreground">
                Model
              </th>
              <th scope="col" className="border-b border-border px-4 py-3.5 font-semibold text-foreground text-center w-36 whitespace-nowrap">
                Context Window
              </th>
              <th scope="col" className="border-b border-border px-4 py-3.5 font-semibold text-foreground text-right w-40 whitespace-nowrap">
                Input Price
              </th>
              <th scope="col" className="border-b border-border py-3.5 pl-4 pr-5 font-semibold text-foreground text-right w-40 whitespace-nowrap">
                Output Price
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredModels.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-muted-foreground text-xs sm:text-sm">
                  No models found matching &quot;{searchQuery}&quot;.
                </td>
              </tr>
            ) : (
              filteredModels.map((model) => {
                const isCopied = copiedId === model.id;

                return (
                  <tr key={model.id} className="group transition-colors hover:bg-accent/40">
                    {/* 1. Model Name with Copy Button */}
                    <td className="py-3.5 pl-5 pr-3 align-middle">
                      <div className="flex items-center gap-2">
                        <code className="text-xs sm:text-sm font-mono font-semibold text-foreground group-hover:text-primary transition-colors">
                          {model.id}
                        </code>
                        <button
                          type="button"
                          onClick={() => handleCopyId(model.id)}
                          title="Copy model name for API requests"
                          className="inline-flex items-center justify-center h-6 w-6 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                        >
                          {isCopied ? (
                            <Check className="h-3.5 w-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* 2. Context Window */}
                    <td className="px-4 py-3.5 align-middle text-center">
                      <Badge
                        variant="outline"
                        className="font-mono text-xs font-semibold bg-secondary/50 text-foreground"
                      >
                        {model.contextLength}
                      </Badge>
                    </td>

                    {/* 3. Input Price / 1M tokens */}
                    <td className="px-4 py-3.5 align-middle text-right">
                      <div className="font-mono font-bold text-foreground">
                        {formatPrice(model.inputPricePerMillion)}
                      </div>
                      <span className="text-[10px] text-muted-foreground">/ 1M tokens</span>
                    </td>

                    {/* 4. Output Price / 1M tokens */}
                    <td className="py-3.5 pl-4 pr-5 align-middle text-right">
                      <div className="font-mono font-bold text-foreground">
                        {formatPrice(model.outputPricePerMillion)}
                      </div>
                      <span className="text-[10px] text-muted-foreground">/ 1M tokens</span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Endpoint Attribution & Sync Status */}
    {/*  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-muted-foreground gap-2 px-1">*/}
    {/*    <div className="flex items-center gap-2">*/}
    {/*      <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />*/}
    {/*      <span>*/}
    {/*        Live pricing synchronized from{" "}*/}
    {/*        <a*/}
    {/*          href="https://models.publicai.co/info"*/}
    {/*          target="_blank"*/}
    {/*          rel="noopener noreferrer"*/}
    {/*          className="text-foreground font-mono underline hover:text-primary"*/}
    {/*        >*/}
    {/*          models.publicai.co/info*/}
    {/*        </a>*/}
    {/*      </span>*/}
    {/*    </div>*/}

    {/*    {fetchedAt && (*/}
    {/*      <span className="text-[11px] font-mono">*/}
    {/*        Last synced: {new Date(fetchedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}*/}
    {/*      </span>*/}
    {/*    )}*/}
    {/*  </div>*/}
    </div>
  );
}
