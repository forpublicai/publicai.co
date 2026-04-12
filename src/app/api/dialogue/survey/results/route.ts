import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServiceClient();

  const { data: responses, error } = await supabase
    .from("survey_responses")
    .select("id, themes, overall_sentiment, canton, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Survey results fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }

  // Aggregate theme data
  const themeMap = new Map<
    string,
    { positive: number; mixed: number; negative: number; total: number }
  >();

  const cantonCounts = new Map<string, number>();
  let totalHope = 0;
  let totalConcern = 0;
  let sentimentCount = 0;

  for (const r of responses || []) {
    // Aggregate themes
    const themes = r.themes as {
      theme: string;
      position: string;
      sentiment: string;
    }[];
    for (const t of themes) {
      const existing = themeMap.get(t.theme) || {
        positive: 0,
        mixed: 0,
        negative: 0,
        total: 0,
      };
      if (t.sentiment === "positive") existing.positive++;
      else if (t.sentiment === "negative") existing.negative++;
      else existing.mixed++;
      existing.total++;
      themeMap.set(t.theme, existing);
    }

    // Aggregate canton
    if (r.canton) {
      cantonCounts.set(r.canton, (cantonCounts.get(r.canton) || 0) + 1);
    }

    // Aggregate sentiment
    const sentiment = r.overall_sentiment as {
      hope: number;
      concern: number;
    } | null;
    if (sentiment) {
      totalHope += sentiment.hope;
      totalConcern += sentiment.concern;
      sentimentCount++;
    }
  }

  // Convert to sorted arrays
  const themes = Array.from(themeMap.entries())
    .map(([theme, counts]) => ({ theme, ...counts }))
    .sort((a, b) => b.total - a.total);

  const cantons = Array.from(cantonCounts.entries())
    .map(([canton, count]) => ({ canton, count }))
    .sort((a, b) => b.count - a.count);

  return NextResponse.json({
    totalResponses: responses?.length || 0,
    themes,
    cantons,
    averageSentiment:
      sentimentCount > 0
        ? {
            hope: totalHope / sentimentCount,
            concern: totalConcern / sentimentCount,
          }
        : null,
  });
}
