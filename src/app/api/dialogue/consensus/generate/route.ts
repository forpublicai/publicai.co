import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { schulze } from "@/lib/schulze";
import { projectTo2D } from "@/lib/pca";
import { kmeans } from "@/lib/kmeans";
import OpenAI from "openai";

export const maxDuration = 120;

const openai = new OpenAI();

export async function POST(req: Request) {
  const { deliberation_id } = await req.json();
  if (!deliberation_id) {
    return NextResponse.json(
      { error: "deliberation_id required" },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();

  // 1. Fetch all opinions for this deliberation
  const { data: opinions, error: opError } = await supabase
    .from("opinions")
    .select("id, opinion_text, embedding, interview_id")
    .eq("deliberation_id", deliberation_id);

  if (opError || !opinions || opinions.length === 0) {
    return NextResponse.json(
      { error: "No opinions found" },
      { status: 400 }
    );
  }

  // 2. LLM generates candidate consensus statements
  const opinionTexts = opinions.map((o) => o.opinion_text).join("\n- ");
  const statementsRes = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are helping synthesize public opinions into candidate consensus statements for a Swiss national AI dialogue. Generate 5-7 concise, distinct consensus statements that capture the range of views expressed. Each statement should be 1-2 sentences and represent a position that multiple participants might agree with. Return ONLY a JSON array of strings.",
      },
      {
        role: "user",
        content: `Here are the participant opinions:\n- ${opinionTexts}\n\nGenerate 5-7 candidate consensus statements as a JSON array of strings.`,
      },
    ],
    response_format: { type: "json_object" },
  });

  let statementTexts: string[];
  try {
    const parsed = JSON.parse(
      statementsRes.choices[0].message.content || "{}"
    );
    statementTexts = parsed.statements || parsed.candidates || Object.values(parsed).flat();
    if (!Array.isArray(statementTexts)) throw new Error("Not an array");
  } catch {
    return NextResponse.json(
      { error: "Failed to parse generated statements" },
      { status: 500 }
    );
  }

  // 3. Generate embeddings for each statement
  const embeddingRes = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: statementTexts,
  });
  const statementEmbeddings = embeddingRes.data.map((d) => d.embedding);

  // 4. Store statements
  const statementInserts = statementTexts.map((text, i) => ({
    deliberation_id,
    statement_text: text,
    embedding: statementEmbeddings[i],
    is_seed: true,
  }));

  // Delete old statements for this deliberation first
  await supabase
    .from("rankings")
    .delete()
    .eq("deliberation_id", deliberation_id);
  await supabase
    .from("statements")
    .delete()
    .eq("deliberation_id", deliberation_id);

  const { data: insertedStatements, error: stmtError } = await supabase
    .from("statements")
    .insert(statementInserts)
    .select();

  if (stmtError || !insertedStatements) {
    console.error("Statement insert error:", stmtError);
    return NextResponse.json(
      { error: "Failed to save statements" },
      { status: 500 }
    );
  }

  // 5. For each interview, LLM predicts how user would rank statements
  const { data: interviews } = await supabase
    .from("interviews")
    .select("id, messages, session_id")
    .eq("deliberation_id", deliberation_id)
    .eq("interview_type", "deliberation")
    .not("completed_at", "is", null);

  const allRankings: { statement_id: string; rank: number }[][] = [];

  if (interviews) {
    const statementList = insertedStatements
      .map((s, i) => `${i + 1}. ${s.statement_text}`)
      .join("\n");

    // Process interviews in batches of 5
    for (let batch = 0; batch < interviews.length; batch += 5) {
      const chunk = interviews.slice(batch, batch + 5);

      const rankPromises = chunk.map(async (interview) => {
        const transcript = (
          interview.messages as { role: string; content: string }[]
        )
          .map((m) => `${m.role}: ${m.content}`)
          .join("\n");

        const rankRes = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "Based on the interview transcript below, predict how this participant would rank the following consensus statements from most agreeable (rank 1) to least agreeable. Return a JSON object with a 'rankings' array of {statement_number, rank} objects.",
            },
            {
              role: "user",
              content: `Interview transcript:\n${transcript}\n\nConsensus statements:\n${statementList}\n\nPredict the ranking as JSON.`,
            },
          ],
          response_format: { type: "json_object" },
        });

        try {
          const parsed = JSON.parse(
            rankRes.choices[0].message.content || "{}"
          );
          const rawRankings = parsed.rankings || parsed.ranking || [];
          const ranking = rawRankings.map(
            (r: { statement_number: number; rank: number }) => ({
              statement_id:
                insertedStatements[(r.statement_number || 1) - 1]?.id,
              rank: r.rank,
            })
          ).filter((r: { statement_id: string | undefined }) => r.statement_id);

          allRankings.push(ranking);

          // Save to DB
          await supabase.from("rankings").insert({
            deliberation_id,
            session_id: interview.session_id,
            interview_id: interview.id,
            statement_rankings: ranking,
            is_predicted: true,
          });

          return ranking;
        } catch {
          return null;
        }
      });

      await Promise.all(rankPromises);
    }
  }

  // 6. Run Schulze method
  const candidateIds = insertedStatements.map((s) => s.id);
  const schulzeOrder = schulze(allRankings, candidateIds);

  // Update social_ranking and is_winner
  for (let i = 0; i < schulzeOrder.length; i++) {
    await supabase
      .from("statements")
      .update({
        social_ranking: i + 1,
        is_winner: i === 0,
      })
      .eq("id", schulzeOrder[i]);
  }

  // 7. Compute 2D projections for opinions + statements
  // Supabase returns vector columns as strings — parse them
  const parseEmbedding = (emb: unknown): number[] => {
    if (Array.isArray(emb)) return emb;
    if (typeof emb === "string") return JSON.parse(emb);
    return [];
  };

  const opinionEmbeddings = opinions
    .filter((o) => o.embedding)
    .map((o) => parseEmbedding(o.embedding));

  const allEmbeddings = [...opinionEmbeddings, ...statementEmbeddings];
  const projections = projectTo2D(allEmbeddings);

  // Update opinion projections
  const opinionsWithEmbeddings = opinions.filter((o) => o.embedding);
  for (let i = 0; i < opinionsWithEmbeddings.length; i++) {
    await supabase
      .from("opinions")
      .update({
        projected_x: projections[i].x,
        projected_y: projections[i].y,
      })
      .eq("id", opinionsWithEmbeddings[i].id);
  }

  // Update statement projections
  for (let i = 0; i < insertedStatements.length; i++) {
    const projIdx = opinionEmbeddings.length + i;
    await supabase
      .from("statements")
      .update({
        projected_x: projections[projIdx].x,
        projected_y: projections[projIdx].y,
      })
      .eq("id", insertedStatements[i].id);
  }

  // 8. K-means clustering on opinion projections
  const opinionPoints = projections.slice(0, opinionEmbeddings.length);
  const k = Math.min(5, Math.max(2, Math.floor(opinionPoints.length / 3)));
  const { assignments } = kmeans(opinionPoints, k);

  // Generate cluster labels
  const clusters: Record<number, string[]> = {};
  for (let i = 0; i < assignments.length; i++) {
    const clusterId = assignments[i];
    if (!clusters[clusterId]) clusters[clusterId] = [];
    clusters[clusterId].push(opinionsWithEmbeddings[i].opinion_text);
  }

  const labelRes = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Generate a 2-4 word label for each cluster of opinions. Return a JSON object with cluster numbers as keys and labels as values.",
      },
      {
        role: "user",
        content: JSON.stringify(clusters),
      },
    ],
    response_format: { type: "json_object" },
  });

  let clusterLabels: Record<string, string> = {};
  try {
    clusterLabels = JSON.parse(
      labelRes.choices[0].message.content || "{}"
    );
  } catch {
    // fallback labels
  }

  // Update opinion cluster assignments
  for (let i = 0; i < opinionsWithEmbeddings.length; i++) {
    await supabase
      .from("opinions")
      .update({
        cluster_id: assignments[i],
        cluster_label:
          clusterLabels[String(assignments[i])] ||
          `Cluster ${assignments[i] + 1}`,
      })
      .eq("id", opinionsWithEmbeddings[i].id);
  }

  return NextResponse.json({
    statements: schulzeOrder.length,
    rankings: allRankings.length,
    clusters: Object.keys(clusters).length,
    winner: schulzeOrder[0],
  });
}
