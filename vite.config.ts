import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Two-mode Vite config: client (default) and SSR (`--ssr`).
// The SSR build produces an ESM bundle the Phase-5 prerender script
// imports via dynamic `import()`.
export default defineConfig({
  plugins: [react()],
  define: {
    BUILD_DATE: JSON.stringify(new Date().toISOString().slice(0, 10).replace(/-/g, ".")),
  },
  build: {
    target: "es2022",
    sourcemap: true,
  },
});
