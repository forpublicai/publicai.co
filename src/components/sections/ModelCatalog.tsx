"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Globe,
  Search,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyButton } from "@/components/ui/copy-button";
import { MODEL_CATALOG, type ModelEntry } from "@/lib/model-catalog-data";
import { cn } from "@/lib/utils";

function formatPricing(input: number, output: number): string {
  return `$${input.toFixed(2)} / $${output.toFixed(2)}`;
}

export interface ModelCatalogProps {
  compact?: boolean;
  showHeader?: boolean;
  defaultTab?: "cards" | "table";
}

export function ModelCatalog({
  compact = false,
  showHeader = false,
}: ModelCatalogProps) {
  const [models, setModels] = useState<ModelEntry[]>(MODEL_CATALOG);
  const [searchQuery, setSearchQuery] = useState("");
  const [licenseFilter, setLicenseFilter] = useState<
    "all" | "Open Source" | "Open Weights"
  >("all");
  const [modalityFilter, setModalityFilter] = useState<string>("all");
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  // Attempt live enrichment from https://models.publicai.co/info while keeping static catalog fallback
  useEffect(() => {
    let active = true;
    fetch("https://models.publicai.co/info")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data || !Array.isArray(data.data)) return;
        const liveMap = new Map<
          string,
          { input?: number; output?: number; context_length?: number }
        >();
        for (const item of data.data) {
          if (item && typeof item.id === "string") {
            liveMap.set(item.id, {
              input: item.pricing?.input,
              output: item.pricing?.output,
              context_length: item.context_length,
            });
          }
        }
        if (liveMap.size > 0) {
          setModels((prev) =>
            prev.map((m) => {
              const live = liveMap.get(m.id);
              if (!live) return m;
              return {
                ...m,
                inputPricePerMillion:
                  typeof live.input === "number"
                    ? live.input
                    : m.inputPricePerMillion,
                outputPricePerMillion:
                  typeof live.output === "number"
                    ? live.output
                    : m.outputPricePerMillion,
                contextLength:
                  typeof live.context_length === "number"
                    ? `${Math.round(live.context_length / 1000)}K`
                    : m.contextLength,
              };
            })
          );
        }
      })
      .catch(() => {
        // Gracefully keep static catalog fallback
      });
    return () => {
      active = false;
    };
  }, []);

  const filteredModels = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return models.filter((m) => {
      if (licenseFilter !== "all" && m.licenseType !== licenseFilter) {
        return false;
      }
      if (
        modalityFilter !== "all" &&
        !m.modalities.includes(modalityFilter as ModelEntry["modalities"][number])
      ) {
        return false;
      }
      if (!q) return true;
      return [m.id, m.name, m.provider, m.country, m.details, ...m.modalities]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [models, searchQuery, licenseFilter, modalityFilter]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="not-prose flex flex-col gap-5 w-full">
      {showHeader && (
        <div className="space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Per-1M Token Model Pricing &amp; Directory
          </h2>
          <p className="text-sm text-muted-foreground">
            Live input and output token rates across all sovereign and open-weight models on <code className="font-mono">https://api.publicai.co/v1</code>.
          </p>
        </div>
      )}
      {/* Filter & Search Bar */}
      {!compact && (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-border bg-secondary/40 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <Tabs
              value={licenseFilter}
              onValueChange={(v) =>
                setLicenseFilter(v as "all" | "Open Source" | "Open Weights")
              }
            >
              <TabsList className="bg-background">
                <TabsTrigger value="all" className="text-xs font-semibold">
                  All Licenses
                </TabsTrigger>
                <TabsTrigger
                  value="Open Source"
                  className="text-xs font-semibold"
                >
                  Open Source (Data + Weights)
                </TabsTrigger>
                <TabsTrigger
                  value="Open Weights"
                  className="text-xs font-semibold"
                >
                  Open Weights
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-1.5">
              {["all", "Vision", "Reasoning", "Tools"].map((mod) => (
                <button
                  key={mod}
                  type="button"
                  onClick={() => setModalityFilter(mod)}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer",
                    modalityFilter === mod
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-muted-foreground hover:text-foreground"
                  )}
                >
                  {mod === "all" ? "All Modalities" : mod}
                </button>
              ))}
            </div>
          </div>

          <div className="relative w-full lg:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Filter by model ID, country, lab..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-8 bg-background h-9 text-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Accessible Responsive Table Region (modern-web-guidance: responsive-table) */}
      <div
        tabIndex={0}
        role="region"
        aria-labelledby="publicai-models-table-caption"
        className="overflow-x-auto rounded-2xl border border-border bg-card shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <table className="w-full border-separate border-spacing-0 text-left text-sm">
          <caption id="publicai-models-table-caption" className="sr-only">
            Available open-source and open-weight models on the Public AI
            Gateway, including context length, token pricing, and country of
            origin.
          </caption>
          <thead className="sticky top-0 z-10 bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th
                scope="col"
                className="border-b border-border py-3.5 pl-4 pr-3 font-semibold text-foreground"
              >
                Model ID
              </th>
              <th
                scope="col"
                className="border-b border-border px-3 py-3.5 font-semibold text-foreground"
              >
                Openness &amp; Modalities
              </th>
              <th
                scope="col"
                className="border-b border-border px-3 py-3.5 font-semibold text-foreground"
              >
                Context
              </th>
              <th
                scope="col"
                className="border-b border-border px-3 py-3.5 font-semibold text-foreground"
              >
                Input / Output (1M Tokens)
              </th>
              <th
                scope="col"
                className="border-b border-border py-3.5 pl-3 pr-4 font-semibold text-foreground"
              >
                Origin
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredModels.map((model) => {
              const isExpanded = !!expandedIds[model.id];
              return (
                <React.Fragment key={model.id}>
                  <tr
                    onClick={() => toggleExpand(model.id)}
                    aria-expanded={isExpanded}
                    className="group cursor-pointer transition-colors hover:bg-accent/40"
                  >
                    <th
                      scope="row"
                      className="sticky left-0 z-1 bg-card group-hover:bg-accent/40 py-3.5 pl-4 pr-3 font-normal transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="text-muted-foreground"
                          aria-hidden="true"
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-primary" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </span>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs sm:text-sm font-semibold text-foreground group-hover:text-primary">
                              {model.id}
                            </span>
                            <CopyButton
                              text={model.id}
                              className="h-6 w-6 p-1 bg-transparent hover:bg-secondary"
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {model.provider}
                          </span>
                        </div>
                      </div>
                    </th>

                    <td className="px-3 py-3.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge
                          variant="outline"
                          className={cn(
                            "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                            model.licenseType === "Open Source"
                              ? "bg-brand-teal/15 text-brand-teal border-brand-teal/30"
                              : "bg-warning/20 text-foreground border-warning/40"
                          )}
                        >
                          {model.licenseType}
                        </Badge>
                        {model.modalities.map((mod) => (
                          <Badge
                            key={mod}
                            variant="secondary"
                            className="rounded-md px-1.5 py-0 text-[10px] font-normal text-muted-foreground"
                          >
                            {mod}
                          </Badge>
                        ))}
                      </div>
                    </td>

                    <td className="px-3 py-3.5 font-mono text-xs sm:text-sm text-foreground whitespace-nowrap">
                      {model.contextLength}
                    </td>

                    <td className="px-3 py-3.5 whitespace-nowrap">
                      <span className="font-mono text-xs sm:text-sm font-semibold text-foreground">
                        {formatPricing(
                          model.inputPricePerMillion,
                          model.outputPricePerMillion
                        )}
                      </span>
                      <span className="block text-[11px] text-muted-foreground">
                        per 1M tokens
                      </span>
                    </td>

                    <td className="py-3.5 pl-3 pr-4 text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5">
                        <Globe className="h-3.5 w-3.5 text-brand-teal shrink-0" />
                        <span>{model.country}</span>
                      </span>
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr className="bg-secondary/40">
                      <td colSpan={5} className="px-6 py-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs sm:text-sm">
                          <div className="space-y-1 max-w-3xl">
                            <p className="text-foreground leading-relaxed">
                              {model.details}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              License:{" "}
                              <span className="font-medium text-foreground">
                                {model.licenseName}
                              </span>
                            </p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <a
                              href={`https://huggingface.co/${model.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                            >
                              Hugging Face Model Card
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">
        Click any model row to expand model details and Hugging Face cards, or
        click the copy icon to copy its API <code className="font-mono">model</code> ID.{" "}
        <span className="font-semibold text-brand-teal">Open Source</span>{" "}
        indicates open weights, open training data, and open recipes;{" "}
        <span className="font-semibold text-foreground">Open Weights</span>{" "}
        indicates publicly downloadable weights.
      </p>
    </div>
  );
}

export default ModelCatalog;
