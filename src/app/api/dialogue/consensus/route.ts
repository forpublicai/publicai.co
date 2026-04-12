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
    .from("statements")
    .select("*")
    .eq("deliberation_id", deliberationId)
    .eq("is_winner", true)
    .limit(1)
    .single();

  if (error || !data) {
    return NextResponse.json(null);
  }

  return NextResponse.json(data);
}
