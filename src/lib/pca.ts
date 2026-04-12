/**
 * PCA projection: reduce high-dimensional embeddings to 2D.
 * Uses power iteration for top 2 eigenvectors of the covariance matrix.
 * Pure TypeScript, no dependencies.
 */

export function projectTo2D(
  embeddings: number[][]
): { x: number; y: number }[] {
  if (embeddings.length === 0) return [];
  if (embeddings.length === 1) return [{ x: 0, y: 0 }];

  const n = embeddings.length;
  const dim = embeddings[0].length;

  // Center the data
  const mean = new Float64Array(dim);
  for (const e of embeddings) {
    for (let j = 0; j < dim; j++) mean[j] += e[j];
  }
  for (let j = 0; j < dim; j++) mean[j] /= n;

  const centered = embeddings.map((e) => {
    const c = new Float64Array(dim);
    for (let j = 0; j < dim; j++) c[j] = e[j] - mean[j];
    return c;
  });

  // Power iteration for top eigenvector
  function powerIteration(
    data: Float64Array[],
    deflatedComponent?: Float64Array
  ): Float64Array {
    let v = new Float64Array(dim);
    // Random init
    for (let j = 0; j < dim; j++) v[j] = Math.random() - 0.5;
    normalize(v);

    for (let iter = 0; iter < 100; iter++) {
      // v_new = X^T * X * v
      const Xv = new Float64Array(data.length);
      for (let i = 0; i < data.length; i++) {
        let dot = 0;
        for (let j = 0; j < dim; j++) dot += data[i][j] * v[j];
        Xv[i] = dot;
      }

      const newV = new Float64Array(dim);
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < dim; j++) {
          newV[j] += data[i][j] * Xv[i];
        }
      }

      // Deflate if needed
      if (deflatedComponent) {
        let dot = 0;
        for (let j = 0; j < dim; j++) dot += newV[j] * deflatedComponent[j];
        for (let j = 0; j < dim; j++) newV[j] -= dot * deflatedComponent[j];
      }

      normalize(newV);
      v = newV;
    }

    return v;
  }

  function normalize(v: Float64Array) {
    let norm = 0;
    for (let j = 0; j < v.length; j++) norm += v[j] * v[j];
    norm = Math.sqrt(norm);
    if (norm > 0) {
      for (let j = 0; j < v.length; j++) v[j] /= norm;
    }
  }

  const pc1 = powerIteration(centered);
  const pc2 = powerIteration(centered, pc1);

  // Project
  const projected = centered.map((c) => {
    let x = 0,
      y = 0;
    for (let j = 0; j < dim; j++) {
      x += c[j] * pc1[j];
      y += c[j] * pc2[j];
    }
    return { x, y };
  });

  // Normalize to [-1, 1] range
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;
  for (const p of projected) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;

  return projected.map((p) => ({
    x: ((p.x - minX) / rangeX) * 2 - 1,
    y: ((p.y - minY) / rangeY) * 2 - 1,
  }));
}
