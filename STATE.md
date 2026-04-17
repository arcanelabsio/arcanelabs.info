# arcanelabs.info — project state

## Current phase: Phase 3 — Markdown pipeline + diagrams (queued)

Phase 2 complete. Content tree established under `content/` with a
clean separation from the React app under `src/`. Posts moved via
`git mv` to preserve history. Projects converted from hand-authored
HTML to structured frontmatter + markdown body. Pages extracted from
Jekyll templates into markdown. The old Jekyll `_posts/`/`projects/`/
`company/`/`contact.html`/`index.html` files still live at repo root
until phase 4 rips them out.

### Phase 2 — completed 2026-04-18
- `content/posts/` — 2 post .md files moved from `_posts/` via git mv
- `content/projects/` — forge.md, drive_sync_flutter.md, shellcraft.md
  with uniform frontmatter contract (name, tagline, status, install,
  links, release{version,date,notes})
- `content/pages/` — home.md, company.md, contact.md
- Rule-of-thumb applied: structured data (status, release version,
  link arrays) → frontmatter. Narrative prose → body markdown.
  h2 headings used as section delimiters; Phase 3's Markdown component
  will map them to the existing `.lh__sep` aesthetic so design parity
  holds without polluting content with layout classes.

### Phase 3 — next
Wire the markdown pipeline. Install + configure:
- `react-markdown`, `remark-gfm`, `remark-frontmatter`
- `rehype-slug`, `rehype-autolink-headings`, `rehype-highlight` (or
  rehype-pretty-code) for syntax highlighting
- `mermaid` (lazy-loaded)
- `plantuml-encoder` for kroki.io URL generation
- A ~40-line YAML-subset frontmatter parser (avoid `gray-matter` +
  `js-yaml`; see PLAN.md §3)

Deliverables:
- `src/content/loader.ts` — bundles `content/**/*.md` via
  `import.meta.glob({ query: '?raw', eager: true })`, parses
  frontmatter, produces typed indexes for posts/projects/pages
- `src/content/types.ts` — Post, Project, Page types
- `src/components/Markdown.tsx` — react-markdown wrapper with
  per-context component overrides (page vs post)
- `src/components/Diagram.tsx` — mermaid / plantuml dispatch
- Route components pull from loader and render via Markdown. Replace
  the phase-1 stubs.

Commit: `feat: render markdown content with mermaid and plantuml support`.
