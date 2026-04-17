# arcanelabs.info — project state

## Current phase: Phase 2 — Content migration (queued)

Phase 1 scaffold complete. The Vite+React+TS app builds, renders
client-side, and server-renders all six route shapes (verified via
`vite build --ssr` + node import smoke test). Jekyll files still
present but the root `index.html` is now the Vite entry — so `bundle
exec jekyll serve` will no longer produce the old site locally. No
push yet, so the deployed site at arcanelabs.info is unaffected.

### Phase 1 — completed 2026-04-18
- package.json (Node >=22, React 18.3, Vite 5.4, react-router-dom 6.28)
- tsconfig.{json,app.json,node.json} with project references, strict TS
- vite.config.ts (client + `--ssr` support, `BUILD_DATE` define)
- index.html entry with Vite module script
- src/styles/editorial.css (verbatim port from assets/css/editorial.css)
- src/components/{TerminalShell,Nav,Footer}.tsx
- src/routes/{Home,WritingIndex,Post,Project,Company,Contact,NotFound}.tsx
- src/App.tsx with shared `routes: RouteObject[]`
- src/entry-client.tsx (hydrate-or-create auto-switch, SPA redirect recovery)
- src/entry-server.tsx (`render(url)` via createStaticHandler + renderToString)
- .nvmrc pinned to 22
- .gitignore extended for node_modules/dist/dist-ssr
- Client bundle: 14KB CSS + 214KB JS (70KB gz)
- SSR bundle: 10KB JS, smoke-tested across all 6 route shapes

### Phase 2 — next
Migrate content into the `content/` tree:
- `content/posts/*.md` — move `_posts/*.md` verbatim
- `content/projects/*.md` — convert `projects/*/index.html` to the
  frontmatter contract in PLAN.md §2
- `content/pages/{home,company,contact}.md` — extract body copy from
  `index.html` / `company/index.html` / `contact.html`
- Do not wire loaders yet — that's phase 3. Just establish the tree
  and commit as `refactor: migrate content to markdown-first tree`.
