# arcanelabs.info — project state

## Current phase: Phase 5 — SSG prerender (queued)

Phase 4 complete. Jekyll is gone. The repo now builds exclusively
through Vite, deploys through GitHub Actions to the custom domain,
and serves SPA routes via the 404.html fallback trick for deep
links. The live site will flip from Jekyll-rendered HTML to the
Vite SPA the moment this is pushed — readers see a client-rendered
SPA until phase 5 enables SSG.

### Phase 4 — completed 2026-04-18

- `public/CNAME` — moved from root, Vite copies to `dist/CNAME`
- `public/robots.txt` — stripped of Jekyll frontmatter, points to
  the phase-5 sitemap at `/sitemap.xml`
- `public/404.html` — the SPA-GH-Pages fallback: stashes
  `location.pathname + search + hash` into sessionStorage and
  `location.replace('/')`. `src/entry-client.tsx` replays this into
  history before the router mounts, so deep links (e.g.
  `arcanelabs.info/writing/my-post`) resolve correctly on first hit.
- `.github/workflows/deploy-pages.yml` — triggers on push to main,
  Node 22 via `.nvmrc`, `actions/deploy-pages@v4`
- Deleted: Gemfile, Gemfile.lock, .ruby-version, _config.yml,
  _layouts/ (3 files), _includes/ (5 files), writing/index.html,
  company/index.html, contact.html, projects/{drive_sync_flutter,
  forge, shellcraft}/index.html, root 404.html, assets/css/ (both
  CSS files — editorial.css was already copied into src/styles/)
- README rewritten for the new stack
- .gitignore trimmed of Jekyll cache entries

First-time deploy prerequisite: **Repo Settings → Pages → Source**
must be set to **GitHub Actions** (not "Deploy from a branch").

### Phase 5 — next

Enable SSG prerender per PLAN.md §9:

- `scripts/prerender.mjs` — enumerates routes (static paths from
  `src/App.tsx`'s `allStaticPaths()` + dynamic slugs from
  `content/posts/*` and `content/projects/*`), calls `render(url)`
  per route, injects output into `dist/index.html` template, writes
  `dist/<path>/index.html`
- `scripts/generate-sitemap.mjs` — same enumeration → `dist/sitemap.xml`
- `package.json` — `postbuild` hook runs SSR build + prerender +
  sitemap
- Per-route `<title>` + `<meta description>` via a minimal head
  context (no react-helmet-async dep)

Commit: `feat: prerender routes to static HTML`.
