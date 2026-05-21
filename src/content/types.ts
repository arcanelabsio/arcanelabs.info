export type Link = {
  label: string;
  url: string;
  note?: string;
};

export type Release = {
  version: string;
  date: string;
  notes?: string;
};

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  body: string;
};

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  status: string;
  install?: string;
  links: Link[];
  release?: Release;
  body: string;
};

export type Page = {
  slug: string;
  title: string;
  description: string;
  greeting?: string;
  body: string;
};

export type SceneType = "feature" | "incident" | "support" | "decision";

export type NotebookEpisode = {
  series: string;        // e.g., "tessera-notebook"
  season: string;        // e.g., "season-1"
  slug: string;          // e.g., "two-regions-by-friday"
  episode: number;       // ordinal within the series (e.g., 1, 13, 32)
  title: string;
  description: string;
  date: string;          // YYYY-MM-DD
  sceneType: SceneType;
  arc: string;           // human-readable arc name
  concept: string;       // one-line description of the concept revealed
  body: string;
};

export type NotebookSeasonSummary = {
  series: string;
  season: string;
  label: string;         // e.g., "Season 1 — Distributed Systems Foundations"
  description: string;   // pulled from the season's first episode or a season.md file
  episodes: NotebookEpisode[];
};
