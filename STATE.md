# arcanelabs.info — project state

## Current phase: Phase 4 — Jekyll removal + GH Pages deploy (queued)

Phase 3 complete. The markdown pipeline is live: every route pulls
content from `content/**/*.md` via `import.meta.glob`, frontmatter is
parsed with `yaml`, bodies render through react-markdown with GFM,
slug anchors, autolink headings, and syntax highlighting. Mermaid
renders client-side (lazy-loaded) and PlantUML via kroki.io. SSR
verified across all 10 URL shapes with real markdown HTML output.

### Phase 3 — completed 2026-04-18

- `src/content/types.ts` — `Post`, `Project`, `Page`, `Link`, `Release`
- `src/content/frontmatter.ts` — `splitFrontmatter` via `yaml`
- `src/content/loader.ts` — eager glob imports, typed indexes, by-slug
  getters; posts sorted by date desc, projects by name asc
- `src/components/Markdown.tsx` — remark-gfm, remark-frontmatter,
  rehype-slug, rehype-autolink-headings, rehype-highlight (restricted
  to 9 languages: bash/js/ts/yaml/dart/makefile/markdown/json/xml).
  Custom `a` → Link for internal URLs, custom `code` → Diagram for
  mermaid/plantuml fences, `node` prop dropped from all renderers to
  prevent DOM leak. Variant="page" maps h2 → `.lh__sep`.
- `src/components/Diagram.tsx` — mermaid via dynamic `import()`
  (SSR-safe placeholder), plantuml via `plantuml-encoder` +
  `https://kroki.io/plantuml/svg/<encoded>`
- Page frontmatters gained `greeting` field so the `.lh__greeting`
  top-of-page styling survives the HTML→markdown migration
- Routes now pull from loader; phase-1 stubs replaced
- editorial.css extended with highlight.js token colors (mapped to
  palette) and `.lh__diagram` styles
- Build outputs:
  - Client: 744 KB / 233 KB gz main + ~35 Mermaid chunks (lazy)
  - SSR: 42 KB
  - Bundle size warning accepted — Phase 6 polish can lazy-load the
    Markdown component for subsequent routes
- SSR smoke test: /, /writing, both posts, all 3 projects, /company,
  /contact, /nonexistent — every URL renders with content intact

### Phase 4 — next
Delete Jekyll infrastructure, move preserved files to Vite/public,
add GitHub Actions deployment, wire the SPA 404.html fallback.

- Delete: `Gemfile`, `.ruby-version`, `_config.yml`, `_layouts/`,
  `_includes/`, `writing/`, `company/`, `contact.html`,
  `projects/*/index.html`, old `index.html` redirect (verify not
  needed), `404.html` (old Jekyll one), `assets/` (CSS already
  copied into `src/styles/`)
- Preserve, relocate to `public/`: `CNAME`, `robots.txt`,
  and the new SPA-fallback `404.html`
- Add `.github/workflows/deploy-pages.yml` — Node 22 via `.nvmrc`,
  `actions/deploy-pages@v4`, triggered on push to main
- Add `public/404.html` with the spa-github-pages redirect script
- README updated for new stack

Commit: `refactor: remove jekyll; build and deploy via vite`.
