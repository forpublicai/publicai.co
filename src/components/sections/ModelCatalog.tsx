"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ExternalLink, Globe, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MODEL_CATALOG, type ModelEntry } from "@/lib/model-catalog-data";
import { cn } from "@/lib/utils";

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

  return (
    <div className="not-prose flex flex-col gap-5 w-full">
      {showHeader && (
        <div className="space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Sovereign &amp; Open Models Directory
          </h2>
          <p className="text-sm text-muted-foreground">
            Directory of sovereign and national open-weight foundation models available on <code className="font-mono">https://api.publicai.co/v1</code>.
          </p>
        </div>
      )}

      {/* Filter & Search Bar */}
      {/*{!compact && (*/}
      {/*  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-border bg-secondary/40 p-4">*/}
      {/*    <div className="flex flex-wrap items-center gap-3">*/}
      {/*      <Tabs*/}
      {/*        value={licenseFilter}*/}
      {/*        onValueChange={(v) =>*/}
      {/*          setLicenseFilter(v as "all" | "Open Source" | "Open Weights")*/}
      {/*        }*/}
      {/*      >*/}
      {/*        <TabsList className="bg-background">*/}
      {/*          <TabsTrigger value="all" className="text-xs font-semibold">*/}
      {/*            All Licenses*/}
      {/*          </TabsTrigger>*/}
      {/*          <TabsTrigger*/}
      {/*            value="Open Source"*/}
      {/*            className="text-xs font-semibold"*/}
      {/*          >*/}
      {/*            Open Source (Data + Weights)*/}
      {/*          </TabsTrigger>*/}
      {/*          <TabsTrigger*/}
      {/*            value="Open Weights"*/}
      {/*            className="text-xs font-semibold"*/}
      {/*          >*/}
      {/*            Open Weights*/}
      {/*          </TabsTrigger>*/}
      {/*        </TabsList>*/}
      {/*      </Tabs>*/}

      {/*      <div className="flex items-center gap-1.5">*/}
      {/*        {["all", "Vision", "Reasoning", "Tools"].map((mod) => (*/}
      {/*          <button*/}
      {/*            key={mod}*/}
      {/*            type="button"*/}
      {/*            onClick={() => setModalityFilter(mod)}*/}
      {/*            className={cn(*/}
      {/*              "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer",*/}
      {/*              modalityFilter === mod*/}
      {/*                ? "border-primary bg-primary text-primary-foreground"*/}
      {/*                : "border-border bg-background text-muted-foreground hover:text-foreground"*/}
      {/*            )}*/}
      {/*          >*/}
      {/*            {mod === "all" ? "All Modalities" : mod}*/}
      {/*          </button>*/}
      {/*        ))}*/}
      {/*      </div>*/}
      {/*    </div>*/}

      {/*    <div className="relative w-full lg:w-72">*/}
      {/*      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />*/}
      {/*      <Input*/}
      {/*        type="search"*/}
      {/*        placeholder="Filter by model ID, country, lab..."*/}
      {/*        value={searchQuery}*/}
      {/*        onChange={(e) => setSearchQuery(e.target.value)}*/}
      {/*        className="pl-9 pr-8 bg-background h-9 text-sm"*/}
      {/*      />*/}
      {/*      {searchQuery && (*/}
      {/*        <button*/}
      {/*          type="button"*/}
      {/*          onClick={() => setSearchQuery("")}*/}
      {/*          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"*/}
      {/*          aria-label="Clear search"*/}
      {/*        >*/}
      {/*          <X className="h-3.5 w-3.5" />*/}
      {/*        </button>*/}
      {/*      )}*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*)}*/}

      {/* Accessible Responsive Table Region */}
      <div
        tabIndex={0}
        role="region"
        aria-labelledby="publicai-models-table-caption"
        className="overflow-x-auto rounded-2xl border border-border bg-card shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <table className="w-full border-separate border-spacing-0 text-left text-sm">
          <caption id="publicai-models-table-caption" className="sr-only">
            Available open-source and open-weight models on the Public AI
            Gateway, including descriptions and country of origin.
          </caption>
          <thead className="sticky top-0 z-10 bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th
                scope="col"
                className="border-b border-border py-3.5 pl-5 pr-3 font-semibold text-foreground w-64 sm:w-72"
              >
                Model ID
              </th>
              <th
                scope="col"
                className="border-b border-border px-4 py-3.5 font-semibold text-foreground"
              >
                Description
              </th>
              <th
                scope="col"
                className="border-b border-border py-3.5 pl-3 pr-5 font-semibold text-foreground w-36 sm:w-44 whitespace-nowrap"
              >
                Origin
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredModels.map((model) => (
              <tr
                key={model.id}
                className="group transition-colors hover:bg-accent/40"
              >
                <th
                  scope="row"
                  className="py-4 pl-5 pr-3 font-normal align-top"
                >
                  <div className="flex flex-col">
                    <span className="font-mono text-xs sm:text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {model.id}
                    </span>
                    <span className="text-xs text-muted-foreground mt-0.5">
                      {model.provider}
                    </span>
                  </div>
                </th>

                <td className="px-4 py-4 align-top">
                  <div className="space-y-2 max-w-2xl">
                    <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                      {model.details}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span>
                        License:{" "}
                        <span className="font-medium text-foreground">
                          {model.licenseName}
                        </span>
                      </span>
                      <a
                        href={`https://huggingface.co/${model.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
                      >
                        Model Card
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </td>

                <td className="py-4 pl-3 pr-5 text-xs sm:text-sm text-muted-foreground whitespace-nowrap align-top">
                  <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                    <Globe className="h-3.5 w-3.5 text-brand-teal shrink-0" />
                    <span>{model.country}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/*<p className="text-xs text-muted-foreground">*/}
      {/*  Explore sovereign and national open-weight models available across the Public AI Inference Gateway.*/}
      {/*</p>*/}
    </div>
  );
}

export default ModelCatalog;
