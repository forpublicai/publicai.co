"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { StatementData } from "./StatementList";
import type { OpinionPoint } from "./OpinionLandscape";

export interface Deliberation {
  id: string;
  question: string;
  description: string | null;
  status: string;
  participant_count: number;
  opinion_count: number;
}

interface ClusterInfo {
  id: number;
  label: string;
  count: number;
}

export interface DeliberationData {
  deliberation: Deliberation | null;
  consensus: string | null;
  statements: StatementData[];
  opinions: OpinionPoint[];
  clusters: ClusterInfo[];
  loading: boolean;
  refresh: () => void;
}

export function useDeliberation(): DeliberationData {
  const [deliberation, setDeliberation] = useState<Deliberation | null>(null);
  const [consensus, setConsensus] = useState<string | null>(null);
  const [statements, setStatements] = useState<StatementData[]>([]);
  const [opinions, setOpinions] = useState<OpinionPoint[]>([]);
  const [clusters, setClusters] = useState<ClusterInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    try {
      // Fetch active deliberation
      const delRes = await fetch("/api/dialogue/deliberation");
      if (!delRes.ok) {
        setLoading(false);
        return;
      }
      const del = await delRes.json();
      setDeliberation(del);

      // Fetch all data in parallel
      const [consensusRes, statementsRes, opinionsRes] = await Promise.all([
        fetch(`/api/dialogue/consensus?deliberation_id=${del.id}`),
        fetch(`/api/dialogue/statements?deliberation_id=${del.id}`),
        fetch(`/api/dialogue/opinions?deliberation_id=${del.id}`),
      ]);

      const consensusData = await consensusRes.json();
      if (consensusData?.statement_text) {
        setConsensus(consensusData.statement_text);
      }

      const statementsData = await statementsRes.json();
      if (Array.isArray(statementsData)) {
        setStatements(statementsData);
      }

      const opinionsData = await opinionsRes.json();
      if (Array.isArray(opinionsData)) {
        const mapped: OpinionPoint[] = opinionsData.map(
          (o: {
            id: string;
            opinion_text: string;
            cluster_id: number | null;
            cluster_label: string | null;
            projected_x: number | null;
            projected_y: number | null;
          }) => ({
            id: o.id,
            x: o.projected_x ?? 0,
            y: o.projected_y ?? 0,
            clusterId: o.cluster_id,
            clusterLabel: o.cluster_label,
            text: o.opinion_text,
          })
        );
        setOpinions(mapped);

        // Compute clusters
        const clusterMap = new Map<number, { label: string; count: number }>();
        for (const op of mapped) {
          if (op.clusterId === null) continue;
          const existing = clusterMap.get(op.clusterId);
          if (existing) {
            existing.count++;
          } else {
            clusterMap.set(op.clusterId, {
              label: op.clusterLabel || `Cluster ${op.clusterId + 1}`,
              count: 1,
            });
          }
        }
        setClusters(
          Array.from(clusterMap.entries()).map(([id, data]) => ({
            id,
            label: data.label,
            count: data.count,
          }))
        );
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Subscribe to realtime changes
  useEffect(() => {
    if (!deliberation?.id) return;

    const supabase = createClient();
    const channel = supabase
      .channel("deliberation-updates")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "snad",
          table: "opinions",
          filter: `deliberation_id=eq.${deliberation.id}`,
        },
        () => {
          fetchAll();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "snad",
          table: "statements",
          filter: `deliberation_id=eq.${deliberation.id}`,
        },
        () => {
          fetchAll();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [deliberation?.id, fetchAll]);

  return {
    deliberation,
    consensus,
    statements,
    opinions,
    clusters,
    loading,
    refresh: fetchAll,
  };
}
