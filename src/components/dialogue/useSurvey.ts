"use client";

import { useState, useEffect, useCallback } from "react";

interface ThemeAggregate {
  theme: string;
  positive: number;
  mixed: number;
  negative: number;
  total: number;
}

interface CantonCount {
  canton: string;
  count: number;
}

interface SurveyData {
  totalResponses: number;
  themes: ThemeAggregate[];
  cantons: CantonCount[];
  averageSentiment: { hope: number; concern: number } | null;
}

export function useSurvey() {
  const [data, setData] = useState<SurveyData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch("/api/dialogue/survey/results");
      if (res.ok) {
        setData(await res.json());
      }
    } catch (err) {
      console.error("Survey data fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch_();
  }, [fetch_]);

  return { data, loading, refresh: fetch_ };
}
