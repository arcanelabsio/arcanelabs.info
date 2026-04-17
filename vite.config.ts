import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Two-mode Vite config: client (default) and SSR (`--ssr`).
// The SSR build produces an ESM bundle the prerender script imports
// via dynamic `import()`.
export default defineConfig({
  plugins: [react()],
  define: {
    BUILD_DATE: JSON.stringify(
      new Date().toISOString().slice(0, 10).replace(/-/g, "."),
    ),
  },
  build: {
    target: "es2022",
    sourcemap: true,
    // Manual chunks group dependencies by churn rate: react + router
    // changes rarely, markdown plumbing changes rarely, content-editor
    // output changes often. Better CDN cache granularity without
    // rewriting the app. Mermaid's own sub-chunks are already emitted
    // by the dynamic `import('mermaid')` in Diagram.tsx.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (
            id.includes("/react/") ||
            id.includes("/react-dom/") ||
            id.includes("/react-router") ||
            id.includes("/scheduler/")
          ) {
            return "vendor-react";
          }
          if (id.includes("/highlight.js/")) {
            return "vendor-highlight";
          }
          if (id.includes("/yaml/")) {
            return "vendor-yaml";
          }
          if (
            id.includes("/react-markdown/") ||
            id.includes("/remark-") ||
            id.includes("/rehype-") ||
            id.includes("/unified/") ||
            id.includes("/mdast-") ||
            id.includes("/hast-") ||
            id.includes("/micromark") ||
            id.includes("/bail/") ||
            id.includes("/is-plain-obj/") ||
            id.includes("/trough/") ||
            id.includes("/vfile") ||
            id.includes("/property-information/") ||
            id.includes("/space-separated-tokens/") ||
            id.includes("/comma-separated-tokens/") ||
            id.includes("/lowlight/")
          ) {
            return "vendor-markdown";
          }
        },
      },
    },
  },
});
