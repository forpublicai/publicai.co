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

  const { data, error } = await supabase
    .from("opinions")
    .select(
      "id, opinion_text, cluster_id, cluster_label, projected_x, projected_y, submitted_at"
    )
    .eq("deliberation_id", deliberationId)
    .order("submitted_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
