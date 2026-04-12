import { createServiceClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const deliberationId = searchParams.get("deliberation_id");

  if (!deliberationId) {
    return NextResponse.json(
      { error: "deliberation_id required" },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();

  const { data: statements, error } = await supabase
    .from("statements")
    .select("*")
    .eq("deliberation_id", deliberationId)
    .order("social_ranking", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Fetch ranking distributions for ridgeline chart
  const { data: rankings } = await supabase
    .from("rankings")
    .select("statement_rankings")
    .eq("deliberation_id", deliberationId);

  // Build rank distribution per statement
  const rankDistributions: Record<string, number[]> = {};
  if (rankings) {
    for (const r of rankings) {
      const items = r.statement_rankings as {
        statement_id: string;
        rank: number;
      }[];
      for (const item of items) {
        if (!rankDistributions[item.statement_id]) {
          rankDistributions[item.statement_id] = [];
        }
        rankDistributions[item.statement_id].push(item.rank);
      }
    }
  }

  const statementsWithRanks = statements.map((s) => ({
    ...s,
    rank_distribution: rankDistributions[s.id] || [],
  }));

  return NextResponse.json(statementsWithRanks);
}
