# arcanelabs.info — project state

## Current phase: Phase 6 — Polish (queued)

Phase 5 complete. The site now ships as genuine static HTML — every
known route has its own `dist/<path>/index.html` with distinct
`<title>` and `<meta description>`, rendered server-side from the
shared React Router route config via `createStaticHandler`. The
client bundle hydrates on first load and takes over SPA navigation
from there. A crawler fetching `arcanelabs.info/writing/my-post` now
sees the full article HTML, not a blank shell.

### Phase 5 — completed 2026-04-18

- `src/entry-server.tsx` — `render()` now returns `{ html, head,
  status }` with per-route title/description derived from the
  content loader. Switch-style dispatch: pages use frontmatter
  title/description, posts use title+description, projects use
  name+tagline.
- `scripts/enumerate-routes.mjs` — Node-side route list: static
  paths + post slugs (from filenames) + project slugs. Five strings
  are duplicated from `src/App.tsx`'s route config; acceptable drift
  surface for a site this size.
- `scripts/prerender.mjs` — reads `dist/index.html` as template,
  dynamic-imports `dist-ssr/entry-server.js`, iterates every
  enumerated URL, injects head + body into the template via three
  string replacements, writes `dist/<path>/index.html`, cleans up
  `dist-ssr/`.
- `scripts/sitemap.mjs` — writes `dist/sitemap.xml` with every
  enumerated URL. `public/robots.txt` already points at it.
- `package.json` — `postbuild` hook runs `build:ssr && prerender &&
  sitemap` so the single `npm run build` command produces a fully
  prerendered `dist/`.
- `src/entry-client.tsx` — detects sessionStorage redirect replay
  and falls back to `createRoot` (skipping `hydrateRoot`) when the
  prerendered DOM is for `/` but the post-replay URL is something
  else. Prevents hydration mismatches on deep-link recovery for
  pages we haven't prerendered.

Verified prerender output:
- 9 routes emitted: `/`, `/writing`, `/company`, `/contact`, 2 posts,
  3 projects.
- Every route has a distinct `<title>` and `<meta description>`.
- Post HTML (9.4 KB for the forge post) contains full rendered
  article body: semantic `<article>`, `<h1 class="lh__post__title">`,
  `<h2 id="…">` with autolink anchors, code blocks with
  `class="hljs language-bash"`, tables from GFM, external links with
  `target=_blank rel=noreferrer noopener`.
- `dist-ssr/` is cleaned up after prerender — no ESM bundle lingers
  in the deploy artifact.

### Phase 6 — next

Polish. Candidates, to prioritize in order of user-visible impact:

1. Lazy-load `Markdown` component via dynamic `import()`. First
   render is prerendered HTML — no JS needed to see content. Subsequent
   soft-navs get Markdown on demand. Should drop main bundle from
   ~230 KB gz to ~80 KB gz.
2. Tune hljs token colors to match Rouge output more precisely.
3. Active-nav refinement — aria-current is set but hover states may
   need tweaks.
4. Styled 404 page for "real" 404s (deep-linked to a nonexistent
   slug) — currently shows minimal stub. The `public/404.html`
   redirect is different (captures deep-links for SPA recovery).
5. README expansion: writing guide, project frontmatter contract
   reference, deployment troubleshooting.

Commit: `polish: …`.
