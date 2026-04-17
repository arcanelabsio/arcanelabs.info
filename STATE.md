# arcanelabs.info — project state

## Current phase: Shipping.

The Jekyll → Vite+React+SSG rearchitecture is complete across all
six planned phases. The site is deploy-ready.

### Phase 6 — completed 2026-04-18

- `src/content/head.ts` — `resolveHead(url)` extracted so both SSR
  (prerender title injection) and client (document.title sync on
  soft-nav) share one SEO policy source.
- `src/components/RouteEffects.tsx` — mounted once inside a layout
  route, observes `useLocation` and on every path change:
  (1) `window.scrollTo(0, 0)` — browser otherwise preserves scroll
      across pushState, which is wrong for a multi-page SPA;
  (2) updates `document.title` and `<meta name=description>` so
      the browser tab reflects the current page during soft nav.
- `src/App.tsx` — wraps all routes in a `RootLayout` with `<Outlet />`
  so RouteEffects runs once rather than re-mounting per route.
- `src/routes/NotFound.tsx` — now full terminal-aesthetic 404: echoes
  the attempted path, offers a `$ ls`-style list of real routes, and
  invites broken-link reports.
- `vite.config.ts` — `rollupOptions.output.manualChunks` splits the
  bundle by churn rate: `vendor-react`, `vendor-markdown`,
  `vendor-highlight`, `vendor-yaml`. App code churns → only
  `index.js` (92 KB raw) busts cache. Dep churn → just that vendor
  chunk. Mermaid's own sub-chunks are already lazy via
  `Diagram.tsx`'s dynamic import.
- README rewritten with frontmatter contract reference, deploy
  prerequisite (Pages source = GitHub Actions), and troubleshooting.

Post-phase-6 bundle shape (raw, gz estimates):
- index:            92 KB  (~20 KB gz)  — app code
- vendor-react:    204 KB  (~70 KB gz)  — React + ReactDOM + router
- vendor-markdown: 176 KB  (~50 KB gz)  — react-markdown + remark/rehype/unified
- vendor-highlight:168 KB  (~50 KB gz)  — highlight.js (9 languages)
- vendor-yaml:      96 KB  (~30 KB gz)  — yaml parser
- + 30-odd lazy mermaid chunks that only load if a diagram is viewed

### Deferred (future phase 7+ candidates)

- Lazy-hydrate the Markdown component. Current hydration forces the
  full markdown pipeline into the initial JS graph; a proper fix
  requires a "render once on server, island-hydrate on intent"
  pattern that's out of scope for this round.
- Per-frontmatter sitemap `<lastmod>`. Current sitemap uses build
  date for every URL; wiring through the loader's date fields is
  simple but not urgent.
- MDX support if a post ever wants embedded components.
- Search over post/project titles via a client-side Lunr-style
  index generated at build.

## Ship checklist

1. **Before first push**: repo Settings → Pages → Source = GitHub
   Actions (one-click flip, can't be automated).
2. `git push origin main` — workflow runs, artifact deploys to
   arcanelabs.info.
3. Verify: visit / and /writing/getting-started-with-forge; both
   should load with content visible in view-source (SSG working).
4. Verify deep-link recovery: visit /writing/does-not-exist; should
   show the styled NotFound page (not a raw GH Pages 404).
