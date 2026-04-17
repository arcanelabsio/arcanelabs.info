---
name: "forge"
tagline: "One CLI, four AI coding assistants."
status: "Shipping"
install: "npx forge-ai-assist@latest"
links:
  - label: "npm"
    url: "https://www.npmjs.com/package/forge-ai-assist"
    note: "package as forge-ai-assist"
  - label: "GitHub"
    url: "https://github.com/arcanelabsio/forge"
    note: "source code and README"
release:
  version: "v1.2.3"
  date: 2026-03-20
  notes: |
    ### Bug fixes
    - Added a resilience and transparency instruction to all plugin
      prompts so assistants acknowledge limitations and recover from
      tool failures more predictably.
---

A command-line tool that installs engineering-quality plugins into
GitHub Copilot, Claude Code, Codex, and Gemini. A plugin is authored
once, then rendered for each assistant by its adapter. The installed
files are strictly read-only and call `gh` directly from the user's
terminal — no bundled runtime, no proxy, no cached answers.

Published on [npm](https://www.npmjs.com/package/forge-ai-assist).
Requires Node 22 or newer. MIT licensed. Forge asks which assistants
you use, installs the plugins, and you're done.
