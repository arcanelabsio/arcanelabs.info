import type { RouteObject } from "react-router-dom";
import { Home } from "./routes/Home";
import { WritingIndex } from "./routes/WritingIndex";
import { Post } from "./routes/Post";
import { Project } from "./routes/Project";
import { Company } from "./routes/Company";
import { Contact } from "./routes/Contact";
import { NotFound } from "./routes/NotFound";

// Shared route config — consumed by both `createBrowserRouter`
// (client hydrate) and `createStaticHandler`/`createStaticRouter`
// (SSG prerender). Keep this the single source of truth so the
// server and client render identical trees.
export const routes: RouteObject[] = [
  { path: "/", element: <Home /> },
  { path: "/writing", element: <WritingIndex /> },
  { path: "/writing/:slug", element: <Post /> },
  { path: "/projects/:slug", element: <Project /> },
  { path: "/company", element: <Company /> },
  { path: "/contact", element: <Contact /> },
  { path: "*", element: <NotFound /> },
];

// Enumerates every static URL the site serves. Phase 3 will extend
// this to pull dynamic slugs from the content index.
export function allStaticPaths(): string[] {
  return routes
    .map((r) => r.path)
    .filter((p): p is string => typeof p === "string" && !p.includes(":") && p !== "*");
}
