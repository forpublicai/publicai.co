// Social card for /progress, rendered by the shared forpublicai/progress repo
// (static/card.mjs) from the same data as the page. Served as a static file.
import { readFile } from "node:fs/promises";
import path from "node:path";

export const alt = "Public AI progress: one headline number each for products, movement and idea";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const png = await readFile(path.join(process.cwd(), "progress/static/dist/card.png"));
  return new Response(new Uint8Array(png), { headers: { "Content-Type": contentType } });
}
