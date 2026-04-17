import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./App";
import "./styles/editorial.css";

// SPA-GH-Pages redirect recovery: `public/404.html` stashes the
// requested deep-link path into sessionStorage before redirecting
// to `/`. Replay it here so the first effective URL is what the
// user actually asked for.
//
// Important: if we replayed a redirect, the prerendered DOM is the
// one for `/` — not the requested path. Hydrating would produce a
// mismatch warning and a full client re-render. Skipping hydrate
// and going through createRoot is cheaper and correct.
const redirect = sessionStorage.getItem("spa-redirect-path");
const redirected = redirect !== null;
if (redirect) {
  sessionStorage.removeItem("spa-redirect-path");
  window.history.replaceState(null, "", redirect);
}

const router = createBrowserRouter(routes);
const root = document.getElementById("root");
if (!root) throw new Error("missing #root");

const tree = (
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

if (root.firstElementChild && !redirected) {
  hydrateRoot(root, tree);
} else {
  createRoot(root).render(tree);
}
