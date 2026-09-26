import { splitFrontmatter } from "./frontmatter";
import type { Link, Page, Project, Release } from "./types";

// Vite bundles every .md under content/ as a raw string at build
// time. The glob returns `{ '/content/projects/…md': '…raw source…' }`.
// Eager so we have a synchronous index; the total size at current
// volume is ~30 KB of markdown — well under any threshold where
// per-route code splitting would pay off.
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

// --- helpers -----------------------------------------------------

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

// --- indexes -----------------------------------------------------

export const projects: Project[] = Object.entries(PROJECT_RAW)
  .map(([p, raw]) => parseProject(p, raw))
  .sort((a, b) => a.name.localeCompare(b.name));

export const pages: Record<string, Page> = Object.fromEntries(
  Object.entries(PAGE_RAW)
    .map(([p, raw]) => parsePage(p, raw))
    .map((pg) => [pg.slug, pg]),
);

export function getProject(slug: string | undefined): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getPage(slug: string): Page | undefined {
  return pages[slug];
}
