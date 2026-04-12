import { createServiceClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("deliberations")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "No active deliberation found" },
      { status: 404 }
    );
  }

  // Get participant count
  const { count } = await supabase
    .from("interviews")
    .select("*", { count: "exact", head: true })
    .eq("deliberation_id", data.id)
    .not("completed_at", "is", null);

  // Get opinion count
  const { count: opinionCount } = await supabase
    .from("opinions")
    .select("*", { count: "exact", head: true })
    .eq("deliberation_id", data.id);

  return NextResponse.json({
    ...data,
    participant_count: count ?? 0,
    opinion_count: opinionCount ?? 0,
  });
}
