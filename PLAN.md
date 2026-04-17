# arcanelabs.info — Vite+React SPA rearchitecture

Current state: Jekyll static site, hand-authored HTML pages under
`_layouts`/`_includes`/`index.html`/`company/`/`contact.html`, posts
in `_posts/*.md`, projects as hand-authored HTML in `projects/*/index.html`.

Target: Vite + React + TypeScript SPA. Content (markdown) lives
separately from site code. Rich markdown rendering with Mermaid and
PlantUML support. Deployed to GitHub Pages on push to `main`.
Design system (`editorial.css` — terminal-window aesthetic) carried
over verbatim. Clean URLs with proper SPA navigation.

---

## 1. Repository layout

Two top-level zones — content vs. site — in the same repo:

```
arcanelabs.info/
├─ content/                        ← authoring layer, markdown-only
│  ├─ posts/
│  │  ├─ 2026-04-18-getting-started-with-drive-sync-flutter.md
│  │  └─ 2026-04-19-getting-started-with-forge.md
│  ├─ projects/
│  │  ├─ forge.md
│  │  ├─ drive_sync_flutter.md
│  │  └─ shellcraft.md
│  └─ pages/
│     ├─ company.md
│     ├─ contact.md
│     └─ home.md                   ← home page body, including catalog
│
├─ src/                            ← React app
│  ├─ main.tsx                     ← React root, Router, theme
│  ├─ App.tsx                      ← routes
│  ├─ routes/                      ← one file per route component
│  │  ├─ Home.tsx
│  │  ├─ WritingIndex.tsx
│  │  ├─ Post.tsx                  ← /writing/:slug
│  │  ├─ ProjectsIndex.tsx         ← (optional — home already lists)
│  │  ├─ Project.tsx               ← /projects/:slug
│  │  ├─ Company.tsx
│  │  ├─ Contact.tsx
│  │  └─ NotFound.tsx
│  ├─ components/
│  │  ├─ TerminalShell.tsx         ← .lh wrapper + chrome + nav + footer
│  │  ├─ Nav.tsx
│  │  ├─ Footer.tsx
│  │  ├─ Markdown.tsx              ← react-markdown + plugins + custom renderers
│  │  ├─ Diagram.tsx               ← mermaid / plantuml dispatch
│  │  ├─ CodeBlock.tsx             ← intercepts <code className="language-…">
│  │  └─ PostCard.tsx
│  ├─ content/                     ← generated + loader glue
│  │  ├─ loader.ts                 ← import.meta.glob raw text + frontmatter
│  │  ├─ types.ts                  ← Post, Project, Page types
│  │  └─ frontmatter.ts            ← tiny YAML frontmatter parser
│  ├─ styles/
│  │  └─ editorial.css             ← ported verbatim from assets/css/
│  └─ vite-env.d.ts
│
├─ public/
│  ├─ CNAME                        ← arcanelabs.info (preserved)
│  ├─ robots.txt                   ← preserved
│  ├─ 404.html                     ← SPA-redirect fallback (not Jekyll one)
│  └─ favicon.svg                  ← if we add one
│
├─ scripts/
│  └─ generate-sitemap.mjs         ← prebuild sitemap.xml into dist/
│
├─ .github/workflows/
│  └─ deploy-pages.yml             ← build + deploy on push to main
│
├─ index.html                      ← Vite entry
├─ vite.config.ts
├─ tsconfig.json
├─ package.json
├─ .nvmrc                          ← node 22
├─ README.md                       ← updated: new stack, new workflow
└─ LICENSE                         ← unchanged
```

**Removed**: `Gemfile`, `Gemfile.lock`, `.ruby-version`, `_config.yml`,
`_includes/`, `_layouts/`, `_posts/`, `writing/index.html`, `company/`,
`contact.html`, `projects/*/index.html`, `assets/`, `index.html`
(current Jekyll one), root `404.html` (replaced by `public/404.html`).

---

## 2. Content model (frontmatter contract)

### Post (`content/posts/*.md`)

```yaml
---
title: "Getting started with forge"
description: "One CLI, four AI coding assistants — …"
date: 2026-04-19
tags: [forge, ai, cli]          # optional, for future filtering
---
```

Slug is derived from the filename: strip `YYYY-MM-DD-` prefix and
`.md` suffix. URL: `/writing/:slug`.

### Project (`content/projects/*.md`)

```yaml
---
name: "forge"
tagline: "One CLI, four AI coding assistants."
status: "Shipping"                 # Shipping | Active build | Deprecated
links:
  - label: "npm"
    url: "https://www.npmjs.com/package/forge-ai-assist"
  - label: "GitHub"
    url: "https://github.com/arcanelabsio/forge"
install: |
  npx forge-ai-assist@latest
release:
  version: "v1.2.3"
  date: 2026-03-20
  notes: |
    - Added a resilience and transparency instruction…
---
```

Slug is filename sans `.md`. URL: `/projects/:slug`.

### Page (`content/pages/{company,contact,home}.md`)

Minimal frontmatter (`title`, `description`) + freeform markdown
body. Rendered into the corresponding route component, which wraps
the markdown in the design system's section structure.

---

## 3. Markdown pipeline

Three-stage pipeline, all build-time except diagram rendering:

1. **Bundle raw markdown** via Vite's `import.meta.glob(..., { query: '?raw', eager: true })`.
   Entire `content/` tree becomes an object `{ '/content/posts/…md': '…raw string…' }`
   at build time. No runtime fetch. Bundle size at current volume is
   < 50KB gzipped for all markdown combined — well under the limit
   where we'd need per-route code splitting.

2. **Parse frontmatter in-browser** via a ~40-line YAML-subset parser
   (we only need strings, numbers, dates, one-level lists, one-level
   maps). Avoids pulling in `gray-matter` + `js-yaml` (together ~30KB
   gz). If the contract outgrows this, swap to `yaml` package later.

3. **Render markdown** via `react-markdown` with:
   - `remark-gfm` → tables, strikethrough, task lists, autolinks
   - `remark-frontmatter` → strips `---` block during render (we
     parse it separately in step 2)
   - `rehype-slug` → heading anchors
   - `rehype-autolink-headings` → clickable anchors on `h2`/`h3`
   - `rehype-highlight` (or Shiki via `rehype-pretty-code`) → code
     syntax highlighting that matches our Rouge tokens
   - Custom `code` renderer: intercepts fences with
     `language-mermaid` and `language-plantuml` and swaps to `<Diagram>`.

### Diagram rendering

A single `<Diagram type="mermaid" | "plantuml" source="…">` component:

- **Mermaid**: `mermaid` package, lazy-loaded (dynamic import on first
  diagram mount), rendered to SVG client-side. Lazy load keeps the
  main bundle lean for readers who never hit a diagram.
- **PlantUML**: encode source with `plantuml-encoder` → build a
  `https://kroki.io/plantuml/svg/<encoded>` URL → render as `<img>`.
  No bundle cost beyond the encoder (~1KB). Kroki is a public, free,
  self-hostable service — privacy profile is acceptable for public
  diagrams but documented in README.

Both render inside a `<figure class="lh__diagram">` that matches the
existing editorial aesthetic (subtle bg, amber-left border).

---

## 4. Routing & navigation

**Router**: `react-router-dom` v6+ with `createBrowserRouter`.
- `/` → Home
- `/writing` → WritingIndex
- `/writing/:slug` → Post
- `/projects/:slug` → Project
- `/company` → Company
- `/contact` → Contact
- `*` → NotFound

**Clean URLs on GitHub Pages**: the `spa-github-pages` convention.
`public/404.html` runs a 5-line script that captures the failed
path into `sessionStorage` and redirects to `/`. `src/main.tsx`
reads that on boot and replaces history before React Router mounts.
Works with the CNAME'd domain; no `basename` needed.

**In-app navigation**: `<Link>` everywhere. A global scroll-to-top
on route change. Focus management on route change for a11y.

---

## 5. Design system port

`editorial.css` copied verbatim from `assets/css/editorial.css`
into `src/styles/editorial.css`, imported once in `main.tsx`.
All existing `.lh__*` classes remain valid. The `<TerminalShell>`
component replicates the current `editorial.html` layout:

```tsx
<div className="lh">
  <div className="lh__chrome">…dots + title…</div>
  <div className="lh__page">
    <Nav />
    <main>{children}</main>
    <Footer />
  </div>
</div>
```

The chrome title updates per route: "zsh — home", "zsh — writing",
"zsh — getting started with forge" (truncated to 40 chars).

JetBrains Mono loads from Google Fonts via a `<link>` in `index.html`
(same as today). No sans, no serif. Dark-only — no theme toggle.

---

## 6. Build & deploy

### Local dev

```bash
npm install
npm run dev          # vite dev server, hot reload for src/ AND content/
```

### Production build

```bash
npm run build        # tsc + vite build → dist/
npm run preview      # serve dist/ locally
```

### GitHub Pages deploy

`.github/workflows/deploy-pages.yml`:

```yaml
name: Deploy to Pages
on:
  push: { branches: [main] }
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version-file: .nvmrc, cache: npm }
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

The Pages source in repo settings must be switched from "Deploy from
a branch" to "GitHub Actions" — one manual click after merge.

### Sitemap

`scripts/generate-sitemap.mjs` runs as a `postbuild` step. It walks
`content/posts/` + `content/projects/` + the static routes and emits
`dist/sitemap.xml`. `public/robots.txt` references it.

---

## 7. Phased execution plan

Each phase ends in a green `npm run build` and a conventional commit.
Commits follow global rules: `feat`/`refactor`/`chore`/`docs` etc,
no Co-Authored-By.

**Phase 1 — Scaffold.** Add Vite+React+TS, router, editorial.css,
TerminalShell, Nav, Footer. Static routes for `/company`, `/contact`,
`/`, `/writing`, `/projects/:slug` with placeholder copy. No markdown
pipeline yet. Jekyll files still present — site still builds via
Jekyll locally if needed. Ends with `npm run build` succeeding.
`chore: scaffold vite+react app alongside jekyll`.

**Phase 2 — Content migration.** Create `content/` tree. Convert the
three `projects/*/index.html` into `content/projects/*.md` with the
frontmatter contract. Move `_posts/*.md` → `content/posts/*.md`
unchanged (they already have the right frontmatter). Extract
`index.html` + `company/index.html` + `contact.html` bodies into
`content/pages/*.md`. `refactor: migrate content to markdown-first tree`.

**Phase 3 — Markdown pipeline.** Wire `import.meta.glob`, frontmatter
parser, `Markdown` component with plugins, `Diagram` component with
lazy mermaid + kroki plantuml. Route components read from the loader.
`feat: render markdown content with mermaid and plantuml support`.

**Phase 4 — Jekyll removal + deploy.** Delete all Jekyll files
(`Gemfile`, `_config.yml`, `_layouts/`, `_includes/`, `_posts/`,
`writing/`, `company/`, `contact.html`, old `projects/*/index.html`,
old `index.html`, old `404.html`, `assets/`). Move `CNAME`,
`robots.txt` to `public/`. Add GH Actions workflow. Add sitemap
script. `refactor: remove jekyll; build and deploy via vite`.

**Phase 5 — Polish.** Syntax theme tuning to match Rouge tokens.
Active-nav styling. 404 page styled in terminal aesthetic.
Head-tag manager (`react-helmet-async`) for per-route title + OG
meta (SEO recovery for the SPA). `feat: per-route SEO metadata`.

Optional phase 6 — SSG prerender via `vite-plugin-ssr` or
`react-snap`. First paint + crawl parity with the Jekyll site.
Deferred until the SPA is otherwise shipping.

---

## 8. Decisions (confirmed 2026-04-18)

1. **Router**: `BrowserRouter` + `public/404.html` SPA fallback.
   Clean URLs. Standard `spa-github-pages` redirect script.
2. **PlantUML**: kroki.io public endpoint.
   `https://kroki.io/plantuml/svg/<deflate+base64>`. Documented as a
   third-party dependency in README.
3. **Demo diagrams**: content stays byte-identical. Pipeline is
   verified via a throwaway fixture under `content/_fixtures/` that
   ships in dev only, excluded from the production content index.
4. **SSG prerender**: in scope, not deferred. See §9.
5. **Node**: pinned to 22 via `.nvmrc` + matching `engines.node` in
   `package.json` + `node-version-file: .nvmrc` in CI.

---

## 9. SSG prerender (folded into scope)

Goal: every route ships pre-rendered HTML in `dist/<path>/index.html`,
hydrated on the client. Crawlers + first paint match (or beat) the
old Jekyll site. The SPA still takes over after hydration for soft
client navigation.

### Approach — DIY, two entry points, no framework lock-in

No `vike`/`vite-ssg`/`react-snap` dependency. The mechanism is ~80
lines of glue and transparent to reason about.

- `src/entry-client.tsx` — browser entry. Uses
  `hydrateRoot(document.getElementById('root'), <App />)`.
- `src/entry-server.tsx` — server entry. Exports
  `render(url) → { html, head }` which calls React Router's
  `createStaticHandler` + `createStaticRouter` +
  `renderToString`.
- `vite.config.ts` — two build modes:
  - `vite build` → client bundle in `dist/`
  - `vite build --ssr src/entry-server.tsx` → server bundle in
    `dist-ssr/` (gitignored)
- `scripts/prerender.mjs` — orchestrates:
  1. Reads `dist/index.html` as template.
  2. Imports `dist-ssr/entry-server.js` via dynamic `import()`.
  3. Enumerates all static routes + all content slugs (globs
     `content/posts/*.md`, `content/projects/*.md`).
  4. For each URL: calls `render(url)`, injects `html` into
     template's `<div id="root">…</div>`, injects `head` into
     `<head>`, writes `dist/<path>/index.html`.
  5. Deletes `dist-ssr/` after.

Runs as a `postbuild` in `package.json`. The Pages workflow therefore
deploys pre-rendered HTML per route; the browser still gets the full
SPA after hydration.

### Per-route metadata

Each route component exports a `meta: (params, data) → { title,
description, ogImage? }` object. The server render picks this up
via a `HeadProvider` context and the client uses the same context +
`useEffect` to mutate `document.title` on soft nav. No
`react-helmet-async` dependency — ~30 lines.

### Sitemap

`scripts/generate-sitemap.mjs` reuses the same route enumeration
(extracted into `scripts/routes.mjs`), emits `dist/sitemap.xml`.

### Revised phase list (SSG folded in)

**Phase 1 — Scaffold with SSG-ready split.** Vite+React+TS,
`entry-client.tsx` + `entry-server.tsx` from day one,
`createStaticHandler`-compatible router. editorial.css ported.
TerminalShell + Nav + Footer + route stubs. `npm run build` passes
(client only; prerender wired but not required until phase 5).
Jekyll still present.

**Phase 2 — Content migration.** As described in §7.

**Phase 3 — Markdown pipeline + diagrams.** As described in §7, plus
the HeadProvider meta contract.

**Phase 4 — Jekyll removal + deploy (SPA first).** Remove Jekyll.
Move CNAME/robots.txt to public/. GH Actions deploys `dist/` (SPA
with 404.html fallback only — prerender not yet enabled).

**Phase 5 — SSG prerender live.** Enable the `--ssr` build,
`prerender.mjs`, postbuild hook, sitemap generator. CI now emits
prerendered HTML. Verify each route serves its own `<title>` +
`<meta description>` on view-source.

**Phase 6 — Polish.** Active-nav, 404 styling, Rouge-token match for
code highlighting, a11y focus rings, README refresh.
