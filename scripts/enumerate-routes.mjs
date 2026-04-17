import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");

// Duplicated from src/App.tsx's route config. Five strings we'd
// rather not import across the TS/ESM boundary. If a static route
// is added in App.tsx without being added here, the prerender just
// skips it (and the sitemap omits it) — harmless, spotted fast.
const STATIC_PATHS = ["/", "/writing", "/company", "/contact"];

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

export async function enumerateRoutes() {
  const [postSlugs, projectSlugs] = await Promise.all([
    slugsFromDir(
      "content/posts",
      /^\d{4}-\d{2}-\d{2}-(.+)\.md$/,
      (m) => m[1],
    ),
    slugsFromDir("content/projects", /^(.+)\.md$/, (m) => m[1]),
  ]);

  return [
    ...STATIC_PATHS,
    ...postSlugs.map((s) => `/writing/${s}`),
    ...projectSlugs.map((s) => `/projects/${s}`),
  ];
}
