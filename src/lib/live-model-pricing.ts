/**
 * Dynamic data fetcher & cache manager for Public AI live model pricing.
 *
 * Fetches directly from https://models.publicai.co/info.
 * Next.js ISR caches this for 1 hour on Vercel.
 */

export interface LiveModelPricingItem {
  id: string; // Exact model_name (e.g. "BSC-LT/ALIA-40b-instruct")
  maxInputTokens: number | null;
  contextLength: string; // e.g. "256K", "128K", "32K", or "—"
  inputPricePerMillion: number;
  outputPricePerMillion: number;
}

export interface RawModelInfoItem {
  model_name: string;
  litellm_params?: {
    model?: string;
    [key: string]: unknown;
  };
  model_info?: {
    input_cost_per_token?: number | null;
    output_cost_per_token?: number | null;
    max_tokens?: number | null;
    max_input_tokens?: number | null;
    max_output_tokens?: number | null;
    [key: string]: unknown;
  };
}

export interface ModelsInfoApiResponse {
  data: RawModelInfoItem[];
}

function formatContextSize(tokens?: number | null): string {
  if (!tokens || tokens <= 0) return "—";
  if (tokens >= 1_000_000) {
    const m = tokens / 1_000_000;
    return Number.isInteger(m) ? `${m}M` : `${m.toFixed(1)}M`;
  }
  if (tokens % 1024 === 0 && tokens >= 1024) {
    return `${tokens / 1024}K`;
  }
  if (tokens >= 1000) {
    return `${Math.round(tokens / 1000)}K`;
  }
  return `${tokens}`;
}

const FALLBACK_MODELS: LiveModelPricingItem[] = [
  { id: "BSC-LT/ALIA-40b-instruct", maxInputTokens: 65536, contextLength: "64K", inputPricePerMillion: 0.30, outputPricePerMillion: 0.60 },
  { id: "aisingapore/Gemma-SEA-LION-v4-27B-IT", maxInputTokens: 131072, contextLength: "128K", inputPricePerMillion: 0.20, outputPricePerMillion: 0.40 },
  { id: "aisingapore/Nemotron-SEA-LION-v4.8-120B-A12B", maxInputTokens: 262144, contextLength: "256K", inputPricePerMillion: 0.50, outputPricePerMillion: 2.00 },
  { id: "aisingapore/Qwen-SEA-LION-v4-32B-IT", maxInputTokens: 32000, contextLength: "32K", inputPricePerMillion: 0.25, outputPricePerMillion: 0.50 },
  { id: "aisingapore/Qwen-SEA-LION-v4.5-27B-IT", maxInputTokens: 262144, contextLength: "256K", inputPricePerMillion: 0.20, outputPricePerMillion: 0.40 },
  { id: "speakleash/Bielik-11B-v3.0-Instruct", maxInputTokens: null, contextLength: "—", inputPricePerMillion: 0.40, outputPricePerMillion: 0.40 },
  { id: "swiss-ai/apertus-70b-instruct", maxInputTokens: null, contextLength: "—", inputPricePerMillion: 0.82, outputPricePerMillion: 2.92 },
  { id: "swiss-ai/apertus-8b-instruct", maxInputTokens: null, contextLength: "—", inputPricePerMillion: 0.10, outputPricePerMillion: 0.20 },
  { id: "swiss-ai/apertus-v1.5-70b", maxInputTokens: null, contextLength: "—", inputPricePerMillion: 0.82, outputPricePerMillion: 2.92 },
];

export async function getLiveModelPricing(): Promise<{
  models: LiveModelPricingItem[];
  fetchedAt: string;
  source: "live" | "fallback";
}> {
  try {
    const res = await fetch("https://models.publicai.co/info", {
      next: { revalidate: 3600 }, // 1-hour ISR cache on Vercel
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Endpoint returned status ${res.status}`);
    }

    const payload: ModelsInfoApiResponse = await res.json();
    if (!payload || !Array.isArray(payload.data)) {
      throw new Error("Payload is missing data array");
    }

    const models: LiveModelPricingItem[] = payload.data
      .filter((item) => item && typeof item.model_name === "string" && item.model_name.trim().length > 0)
      .map((item) => {
        const id = item.model_name.trim();
        const info = item.model_info || {};

        const rawInput = info.input_cost_per_token ?? 0;
        const rawOutput = info.output_cost_per_token ?? 0;

        const maxTokens = info.max_input_tokens ?? info.max_tokens ?? null;

        return {
          id,
          maxInputTokens: maxTokens,
          contextLength: formatContextSize(maxTokens),
          inputPricePerMillion: Number((rawInput * 1_000_000).toFixed(4)),
          outputPricePerMillion: Number((rawOutput * 1_000_000).toFixed(4)),
        };
      });

    // Sort alphabetically by model ID
    models.sort((a, b) => a.id.localeCompare(b.id));

    return {
      models: models.length > 0 ? models : FALLBACK_MODELS,
      fetchedAt: new Date().toISOString(),
      source: "live",
    };
  } catch (err) {
    console.warn("Could not fetch live models from models.publicai.co/info:", err);
    return {
      models: FALLBACK_MODELS,
      fetchedAt: new Date().toISOString(),
      source: "fallback",
    };
  }
}
