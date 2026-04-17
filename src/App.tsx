import type { RouteObject } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { Home } from "./routes/Home";
import { WritingIndex } from "./routes/WritingIndex";
import { Post } from "./routes/Post";
import { Project } from "./routes/Project";
import { Company } from "./routes/Company";
import { Contact } from "./routes/Contact";
import { NotFound } from "./routes/NotFound";
import { RouteEffects } from "./components/RouteEffects";

// Layout route wraps every page and hosts cross-route side effects
// (scroll restoration, title sync). Putting RouteEffects here means
// it mounts once and observes every location change via useLocation,
// instead of each route re-mounting its own effect.
function RootLayout() {
  return (
    <>
      <RouteEffects />
      <Outlet />
    </>
  );
}

// Shared route config — consumed by both `createBrowserRouter`
// (client hydrate) and `createStaticHandler`/`createStaticRouter`
// (SSG prerender). Keep this the single source of truth so the
// server and client render identical trees.
export const routes: RouteObject[] = [
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/writing", element: <WritingIndex /> },
      { path: "/writing/:slug", element: <Post /> },
      { path: "/projects/:slug", element: <Project /> },
      { path: "/company", element: <Company /> },
      { path: "/contact", element: <Contact /> },
      { path: "*", element: <NotFound /> },
    ],
  },
];
