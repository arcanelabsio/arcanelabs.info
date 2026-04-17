import fs from "node:fs/promises";
import path from "node:path";
import { enumerateRoutes } from "./enumerate-routes.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const DIST = path.join(ROOT, "dist");
const BASE_URL = "https://arcanelabs.info";

function urlEntry(url, lastmod) {
  return `  <url>
    <loc>${BASE_URL}${url}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`;
}

async function main() {
  const routes = await enumerateRoutes();
  const today = new Date().toISOString().slice(0, 10);
  const body = routes.map((u) => urlEntry(u, today)).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

  const out = path.join(DIST, "sitemap.xml");
  await fs.writeFile(out, xml, "utf-8");
  console.log(`Wrote sitemap with ${routes.length} URLs → ${path.relative(ROOT, out)}`);
}

main().catch((e) => {
  console.error("Sitemap failed:", e);
  process.exitCode = 1;
});
