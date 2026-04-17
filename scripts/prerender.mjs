import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { enumerateRoutes } from "./enumerate-routes.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const DIST = path.join(ROOT, "dist");
const DIST_SSR = path.join(ROOT, "dist-ssr");

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

function injectHead(template, head) {
  return template
    .replace(
      /<title>[\s\S]*?<\/title>/,
      `<title>${escapeHtml(head.title)}</title>`,
    )
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
      `<meta name="description" content="${escapeHtml(head.description)}" />`,
    );
}

async function writeRoute(url, { template, render }) {
  const result = await render(url);
  if (result.status !== 200) {
    console.warn(`  · skip ${url} — status ${result.status}`);
    return;
  }
  const html = injectHead(template, result.head).replace(
    "<!--app-html-->",
    result.html,
  );
  const outPath =
    url === "/"
      ? path.join(DIST, "index.html")
      : path.join(DIST, url, "index.html");
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, html, "utf-8");
  const rel = path.relative(ROOT, outPath);
  console.log(`  ✓ ${url.padEnd(55)} → ${rel}`);
}

async function main() {
  const template = await fs.readFile(
    path.join(DIST, "index.html"),
    "utf-8",
  );

  // Node can't require the SSR build directly — it's an ESM bundle
  // produced by Vite. Dynamic import via a file URL gets around
  // any CJS/ESM confusion on different platforms.
  const entryUrl = pathToFileURL(path.join(DIST_SSR, "entry-server.js"));
  const { render } = await import(entryUrl.href);

  const routes = await enumerateRoutes();
  console.log(`Prerendering ${routes.length} routes…`);

  for (const url of routes) {
    await writeRoute(url, { template, render });
  }

  await fs.rm(DIST_SSR, { recursive: true, force: true });
  console.log("Prerender complete.");
}

main().catch((e) => {
  console.error("Prerender failed:", e);
  process.exitCode = 1;
});
