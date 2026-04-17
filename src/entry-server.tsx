import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from "react-router-dom/server";
import { routes } from "./App";
import { getPage, posts, projects } from "./content/loader";

export type Head = {
  title: string;
  description: string;
};

export type RenderResult = {
  html: string;
  head: Head;
  status: number;
};

const SITE = "Arcane Labs";

// Resolve per-route title + description so the prerender can inject
// distinct <head> tags into each prerendered HTML file. Central
// switch means one place to edit the SEO policy.
function resolveHead(url: string): Head {
  const path = url.split("?")[0].split("#")[0].replace(/\/$/, "") || "/";

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

// Render the app for a given URL with no browser globals. The
// prerender script calls this per route to emit static HTML.
export async function render(url: string): Promise<RenderResult> {
  const { query, dataRoutes } = createStaticHandler(routes);
  const request = new Request(`http://arcanelabs.info${url}`, {
    signal: new AbortController().signal,
  });
  const context = await query(request);

  if (context instanceof Response) {
    return {
      html: "",
      head: { title: SITE, description: "" },
      status: context.status,
    };
  }

  const router = createStaticRouter(dataRoutes, context);
  const html = renderToString(
    <StrictMode>
      <StaticRouterProvider router={router} context={context} />
    </StrictMode>,
  );

  return {
    html,
    head: resolveHead(url),
    status: context.statusCode,
  };
}
