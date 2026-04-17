import { getPage, posts, projects } from "./loader";

export type Head = {
  title: string;
  description: string;
};

const SITE = "Arcane Labs";

// Resolve per-route title + description for both SSR prerender and
// client-side soft-nav title updates. Central switch → one place
// to edit SEO policy, no server/client drift.
export function resolveHead(url: string): Head {
  const path =
    url.split("?")[0].split("#")[0].replace(/\/$/, "") || "/";

  if (path === "/") {
    const home = getPage("home");
    return {
      title: home?.title ?? SITE,
      description: home?.description ?? "",
    };
  }

  if (path === "/writing") {
    return {
      title: `Writing — ${SITE}`,
      description: "Notes, articles, and user guides from Arcane Labs.",
    };
  }

  if (path === "/company") {
    const page = getPage("company");
    return {
      title: `${page?.title ?? "Company"} — ${SITE}`,
      description: page?.description ?? "",
    };
  }

  if (path === "/contact") {
    const page = getPage("contact");
    return {
      title: `${page?.title ?? "Contact"} — ${SITE}`,
      description: page?.description ?? "",
    };
  }

  const postMatch = /^\/writing\/([A-Za-z0-9_-]+)$/.exec(path);
  if (postMatch) {
    const post = posts.find((p) => p.slug === postMatch[1]);
    if (post) {
      return {
        title: `${post.title} — ${SITE}`,
        description: post.description,
      };
    }
  }

  const projMatch = /^\/projects\/([A-Za-z0-9_-]+)$/.exec(path);
  if (projMatch) {
    const project = projects.find((p) => p.slug === projMatch[1]);
    if (project) {
      return {
        title: `${project.name} — ${SITE}`,
        description: project.tagline,
      };
    }
  }

  return { title: SITE, description: "" };
}
