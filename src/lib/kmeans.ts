/**
 * K-means clustering on 2D points.
 * Pure TypeScript, no dependencies.
 */

interface Point2D {
  x: number;
  y: number;
}

export function kmeans(
  points: Point2D[],
  k: number,
  maxIter = 50
): { assignments: number[]; centroids: Point2D[] } {
  if (points.length === 0) return { assignments: [], centroids: [] };
  k = Math.min(k, points.length);

  // Initialize centroids with k-means++ style
  const centroids: Point2D[] = [];
  centroids.push({ ...points[Math.floor(Math.random() * points.length)] });

  for (let c = 1; c < k; c++) {
    const dists = points.map((p) => {
      let minD = Infinity;
      for (const cent of centroids) {
        const d = (p.x - cent.x) ** 2 + (p.y - cent.y) ** 2;
        if (d < minD) minD = d;
      }
      return minD;
    });
    const total = dists.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < points.length; i++) {
      r -= dists[i];
      if (r <= 0) {
        centroids.push({ ...points[i] });
        break;
      }
    }
    if (centroids.length === c) {
      centroids.push({ ...points[Math.floor(Math.random() * points.length)] });
    }
  }

  let assignments = new Array(points.length).fill(0);

  for (let iter = 0; iter < maxIter; iter++) {
    // Assign points to nearest centroid
    const newAssignments = points.map((p) => {
      let minD = Infinity;
      let best = 0;
      for (let c = 0; c < k; c++) {
        const d =
          (p.x - centroids[c].x) ** 2 + (p.y - centroids[c].y) ** 2;
        if (d < minD) {
          minD = d;
          best = c;
        }
      }
      return best;
    });

    // Check convergence
    const changed = newAssignments.some((a, i) => a !== assignments[i]);
    assignments = newAssignments;

    if (!changed) break;

    // Update centroids
    for (let c = 0; c < k; c++) {
      let sumX = 0,
        sumY = 0,
        count = 0;
      for (let i = 0; i < points.length; i++) {
        if (assignments[i] === c) {
          sumX += points[i].x;
          sumY += points[i].y;
          count++;
        }
      }
      if (count > 0) {
        centroids[c] = { x: sumX / count, y: sumY / count };
      }
    }
  }

  return { assignments, centroids };
}
