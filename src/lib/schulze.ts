/**
 * Schulze voting method.
 * Input: array of rankings, each being { statement_id, rank } where rank 1 = best.
 * Output: ordered array of statement IDs from winner to loser.
 */

interface RankingEntry {
  statement_id: string;
  rank: number;
}

export function schulze(
  rankings: RankingEntry[][],
  candidateIds: string[]
): string[] {
  const n = candidateIds.length;
  if (n === 0) return [];
  const idx = new Map(candidateIds.map((id, i) => [id, i]));

  // Build pairwise preference matrix d[i][j] = number of voters who prefer i over j
  const d: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

  for (const ballot of rankings) {
    const rankMap = new Map<string, number>();
    for (const entry of ballot) {
      rankMap.set(entry.statement_id, entry.rank);
    }

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        const ri = rankMap.get(candidateIds[i]) ?? n + 1;
        const rj = rankMap.get(candidateIds[j]) ?? n + 1;
        if (ri < rj) d[i][j]++;
      }
    }
  }

  // Compute strongest path strengths using Floyd-Warshall
  const p: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j && d[i][j] > d[j][i]) {
        p[i][j] = d[i][j];
      }
    }
  }

  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      if (i === k) continue;
      for (let j = 0; j < n; j++) {
        if (j === i || j === k) continue;
        p[i][j] = Math.max(p[i][j], Math.min(p[i][k], p[k][j]));
      }
    }
  }

  // Count pairwise wins for each candidate
  const wins = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j && p[i][j] > p[j][i]) {
        wins[i]++;
      }
    }
  }

  // Sort by wins descending
  const sorted = candidateIds
    .map((id, i) => ({ id, wins: wins[i] }))
    .sort((a, b) => b.wins - a.wins)
    .map((x) => x.id);

  return sorted;
}
