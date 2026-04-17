import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { resolveHead } from "../content/head";

// Single home for cross-route side effects that React Router doesn't
// give us for free:
//   1. Scroll to top on every path change. The browser preserves
//      scroll position on `history.pushState`, which is usually
//      wrong for a multi-page SPA.
//   2. Keep `document.title` in sync with the current URL so the
//      browser tab updates during soft navigation. (The prerender
//      already injects the correct title into each HTML file; this
//      only matters after the first hydrate.)
export function RouteEffects() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    const { title, description } = resolveHead(location.pathname);
    document.title = title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", description);
  }, [location.pathname]);
  return null;
}
