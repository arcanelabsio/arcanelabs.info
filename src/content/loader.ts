import { splitFrontmatter } from "./frontmatter";
import type {
  Link,
  NotebookEpisode,
  NotebookSeasonSummary,
  Page,
  Post,
  Project,
  Release,
  SceneType,
} from "./types";

// Vite bundles every .md under content/ as a raw string at build
// time. The glob returns `{ '/content/posts/…md': '…raw source…' }`.
// Eager so we have a synchronous index; the total size at current
// volume is ~30 KB of markdown — well under any threshold where
// per-route code splitting would pay off.
const POST_RAW = import.meta.glob("/content/posts/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const PROJECT_RAW = import.meta.glob("/content/projects/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const PAGE_RAW = import.meta.glob("/content/pages/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const NOTEBOOK_RAW = import.meta.glob("/content/notebook/*/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

// --- helpers -----------------------------------------------------

const POST_FILE = /^\/content\/posts\/(\d{4}-\d{2}-\d{2})-([a-z0-9-]+)\.md$/;

function fileSlug(path: string): string {
  const base = path.split("/").pop()!;
  return base.replace(/\.md$/, "");
}

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function asIsoDate(v: unknown): string {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (typeof v === "string") return v;
  return "";
}

function asLinks(v: unknown): Link[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    .map((item) => ({
      label: asString(item.label),
      url: asString(item.url),
      note: typeof item.note === "string" ? item.note : undefined,
    }))
    .filter((l) => l.label && l.url);
}

function asRelease(v: unknown): Release | undefined {
  if (!v || typeof v !== "object") return undefined;
  const r = v as Record<string, unknown>;
  const version = asString(r.version);
  const date = asIsoDate(r.date);
  if (!version) return undefined;
  return {
    version,
    date,
    notes: typeof r.notes === "string" ? r.notes : undefined,
  };
}

// --- parsers -----------------------------------------------------

function parsePost(path: string, raw: string): Post {
  const match = POST_FILE.exec(path);
  if (!match) {
    throw new Error(
      `post filename must match YYYY-MM-DD-slug.md — got ${path}`,
    );
  }
  const [, date, slug] = match;
  const { data, body } = splitFrontmatter(raw);
  return {
    slug,
    title: asString(data.title, slug),
    description: asString(data.description),
    date: asIsoDate(data.date) || date,
    body,
  };
}

function parseProject(path: string, raw: string): Project {
  const slug = fileSlug(path);
  const { data, body } = splitFrontmatter(raw);
  return {
    slug,
    name: asString(data.name, slug),
    tagline: asString(data.tagline),
    status: asString(data.status),
    install: typeof data.install === "string" ? data.install : undefined,
    links: asLinks(data.links),
    release: asRelease(data.release),
    body,
  };
}

function parsePage(path: string, raw: string): Page {
  const slug = fileSlug(path);
  const { data, body } = splitFrontmatter(raw);
  return {
    slug,
    title: asString(data.title, slug),
    description: asString(data.description),
    greeting: typeof data.greeting === "string" ? data.greeting : undefined,
    body,
  };
}

const NOTEBOOK_FILE = /^\/content\/notebook\/([a-z0-9-]+)\/([a-z0-9-]+)\.md$/;

const SCENE_TYPES: ReadonlySet<SceneType> = new Set([
  "feature",
  "incident",
  "support",
  "decision",
]);

function asSceneType(v: unknown): SceneType {
  if (typeof v === "string" && SCENE_TYPES.has(v as SceneType)) {
    return v as SceneType;
  }
  return "feature";
}

function asEpisodeNumber(v: unknown): number {
  if (typeof v === "number" && Number.isFinite(v)) return Math.trunc(v);
  if (typeof v === "string") {
    const n = parseInt(v, 10);
    if (Number.isFinite(n)) return n;
  }
  return 0;
}

function parseNotebookEpisode(path: string, raw: string): NotebookEpisode {
  const match = NOTEBOOK_FILE.exec(path);
  if (!match) {
    throw new Error(
      `notebook filename must match /content/notebook/<season>/<slug>.md — got ${path}`,
    );
  }
  const [, seasonFromPath, slugFromPath] = match;
  const { data, body } = splitFrontmatter(raw);
  return {
    series: asString(data.series, "tessera-notebook"),
    season: asString(data.season, seasonFromPath),
    slug: slugFromPath,
    episode: asEpisodeNumber(data.episode),
    title: asString(data.title, slugFromPath),
    description: asString(data.description),
    date: asIsoDate(data.date),
    sceneType: asSceneType(data.scene_type),
    arc: asString(data.arc),
    concept: asString(data.concept),
    body,
  };
}

const SEASON_LABELS: Record<string, { label: string; description: string }> = {
  "season-1": {
    label: "Season 1 — Distributed Systems Foundations",
    description:
      "Take a reader who builds correct single-machine code and give them the mental scaffold for thinking in distributed primitives — where every interaction is over a network and every component can fail.",
  },
  "season-2": {
    label: "Season 2 — Platform Engineering as a Discipline",
    description:
      "Platform engineering is product management for developers. Kubernetes is a generic control-loop engine, not a container scheduler. Multi-tenancy is an architectural choice.",
  },
  "season-3": {
    label: "Season 3 — System Design at Staff Bar",
    description:
      "Frame ambiguous problems, estimate at scale, choose data stores defensibly, design for read/write asymmetry, write ADRs that get cited three years later.",
  },
  "season-4": {
    label: "Season 4 — Identity, Compliance, and the Agentic Era",
    description:
      "Enterprise-grade identity (OAuth/OIDC/SAML/mTLS/SPIFFE/zero trust). Agentic literacy (loops, MCP, evals, cost/latency budgets). The Principal-track inflection.",
  },
};

// --- indexes -----------------------------------------------------

export const posts: Post[] = Object.entries(POST_RAW)
  .map(([p, raw]) => parsePost(p, raw))
  .sort((a, b) => b.date.localeCompare(a.date));

export const projects: Project[] = Object.entries(PROJECT_RAW)
  .map(([p, raw]) => parseProject(p, raw))
  .sort((a, b) => a.name.localeCompare(b.name));

export const pages: Record<string, Page> = Object.fromEntries(
  Object.entries(PAGE_RAW)
    .map(([p, raw]) => parsePage(p, raw))
    .map((pg) => [pg.slug, pg]),
);

export const notebookEpisodes: NotebookEpisode[] = Object.entries(NOTEBOOK_RAW)
  .map(([p, raw]) => parseNotebookEpisode(p, raw))
  .sort((a, b) => a.episode - b.episode);

export const notebookSeasons: NotebookSeasonSummary[] = (() => {
  const bySeason = new Map<string, NotebookEpisode[]>();
  for (const ep of notebookEpisodes) {
    if (!bySeason.has(ep.season)) bySeason.set(ep.season, []);
    bySeason.get(ep.season)!.push(ep);
  }
  return Array.from(bySeason.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([season, episodes]) => {
      const meta = SEASON_LABELS[season] ?? {
        label: season,
        description: "",
      };
      const series = episodes[0]?.series ?? "tessera-notebook";
      return {
        series,
        season,
        label: meta.label,
        description: meta.description,
        episodes,
      };
    });
})();

export function getPost(slug: string | undefined): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getProject(slug: string | undefined): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getPage(slug: string): Page | undefined {
  return pages[slug];
}

export function getNotebookSeason(
  season: string | undefined,
): NotebookSeasonSummary | undefined {
  if (!season) return undefined;
  return notebookSeasons.find((s) => s.season === season);
}

export function getNotebookEpisode(
  season: string | undefined,
  slug: string | undefined,
): NotebookEpisode | undefined {
  if (!season || !slug) return undefined;
  return notebookEpisodes.find((e) => e.season === season && e.slug === slug);
}
