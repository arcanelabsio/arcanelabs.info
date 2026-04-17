import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from "react-router-dom/server";
import { routes } from "./App";

export type RenderResult = {
  html: string;
  head: string;
  status: number;
};

// Renders the app for a given URL with no browser globals. The
// Phase-5 prerender script calls this per route to emit static HTML.
export async function render(url: string): Promise<RenderResult> {
  const { query, dataRoutes } = createStaticHandler(routes);
  const request = new Request(`http://arcanelabs.info${url}`, {
    signal: new AbortController().signal,
  });
  const context = await query(request);

  if (context instanceof Response) {
    // Redirect or non-HTML response — phase 5 prerender treats
    // these as skip signals.
    return { html: "", head: "", status: context.status };
  }

  const router = createStaticRouter(dataRoutes, context);
  const html = renderToString(
    <StrictMode>
      <StaticRouterProvider router={router} context={context} />
    </StrictMode>,
  );

  return { html, head: "", status: context.statusCode };
}
