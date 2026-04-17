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
