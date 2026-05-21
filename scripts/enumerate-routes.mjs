import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");

// Duplicated from src/App.tsx's route config. Static strings we'd
// rather not import across the TS/ESM boundary. If a static route
// is added in App.tsx without being added here, the prerender just
// skips it (and the sitemap omits it) — harmless, spotted fast.
const STATIC_PATHS = ["/", "/writing", "/notebook", "/company", "/contact"];

async function slugsFromDir(rel, pattern, transform) {
  const dir = path.join(ROOT, rel);
  let entries;
  try {
    entries = await fs.readdir(dir);
  } catch {
    return [];
  }
  return entries
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const m = pattern.exec(f);
      return m ? transform(m) : null;
    })
    .filter((s) => s !== null);
}

async function notebookRoutes() {
  // /content/notebook/<season>/<slug>.md  →  /notebook/<season>/<slug>
  // Also emit a /notebook/<season> index URL per season present on disk.
  const root = path.join(ROOT, "content/notebook");
  let seasons;
  try {
    seasons = await fs.readdir(root);
  } catch {
    return [];
  }
  const urls = [];
  for (const season of seasons) {
    const seasonDir = path.join(root, season);
    let stat;
    try {
      stat = await fs.stat(seasonDir);
    } catch {
      continue;
    }
    if (!stat.isDirectory()) continue;
    let files;
    try {
      files = await fs.readdir(seasonDir);
    } catch {
      continue;
    }
    const episodes = files
      .filter((f) => f.endsWith(".md"))
      .map((f) => f.replace(/\.md$/, ""));
    if (episodes.length === 0) continue;
    urls.push(`/notebook/${season}`);
    for (const slug of episodes) {
      urls.push(`/notebook/${season}/${slug}`);
    }
  }
  return urls;
}

export async function enumerateRoutes() {
  const [postSlugs, projectSlugs, notebookUrls] = await Promise.all([
    slugsFromDir(
      "content/posts",
      /^\d{4}-\d{2}-\d{2}-(.+)\.md$/,
      (m) => m[1],
    ),
    slugsFromDir("content/projects", /^(.+)\.md$/, (m) => m[1]),
    notebookRoutes(),
  ]);

  return [
    ...STATIC_PATHS,
    ...postSlugs.map((s) => `/writing/${s}`),
    ...projectSlugs.map((s) => `/projects/${s}`),
    ...notebookUrls,
  ];
}
