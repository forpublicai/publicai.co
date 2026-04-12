import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("survey_responses")
    .select("id, opinion_text, canton, occupation, cluster_label, created_at")
    .not("opinion_text", "is", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Survey quotes fetch error:", error);
    return NextResponse.json({ quotes: [] });
  }

  return NextResponse.json({ quotes: data || [] });
}
