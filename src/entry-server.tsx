import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from "react-router-dom/server";
import { routes } from "./App";
import { resolveHead, type Head } from "./content/head";

export type RenderResult = {
  html: string;
  head: Head;
  status: number;
};

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
      head: { title: "Arcane Labs", description: "" },
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
