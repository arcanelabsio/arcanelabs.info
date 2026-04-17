import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./App";
import "./styles/editorial.css";

// SPA-GH-Pages redirect recovery: `public/404.html` (phase 4) stores
// the original deep-link path into sessionStorage before redirecting
// to `/`. Replay it here before the router mounts, so the first
// effective location is the requested one.
const redirect = sessionStorage.getItem("spa-redirect-path");
if (redirect) {
  sessionStorage.removeItem("spa-redirect-path");
  window.history.replaceState(null, "", redirect);
}

const router = createBrowserRouter(routes);
const root = document.getElementById("root");
if (!root) throw new Error("missing #root");

// Hydrate when the shell was prerendered (phase 5+). Before that,
// the shell ships empty and we render client-only.
const tree = (
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

if (root.firstElementChild) {
  hydrateRoot(root, tree);
} else {
  createRoot(root).render(tree);
}
