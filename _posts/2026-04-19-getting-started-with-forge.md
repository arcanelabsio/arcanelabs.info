---
layout: post
title: "Getting started with forge"
description: "One CLI, four AI coding assistants — install in thirty seconds, use for the rest of your day."
date: 2026-04-19
---

`forge` is a single CLI that installs engineering-quality plugins into
four AI coding assistants — GitHub Copilot, Claude Code, Codex, and
Gemini CLI — from one authored definition. Your assistant gains the
ability to analyze discussions, triage issues, review PRs, and coach
your engineering practice, without forge ever running a background
service or touching your data.

The package is [on npm as
`forge-ai-assist`](https://www.npmjs.com/package/forge-ai-assist) and
lives at [arcanelabsio/forge](https://github.com/arcanelabsio/forge)
on GitHub.

## Install

```bash
npx forge-ai-assist@latest
```

That's the whole install. Forge asks which assistants you use,
writes their plugin files, and gets out of the way. Requires Node 22
or newer.

To install everything non-interactively (useful in CI or a dotfile
bootstrap):

```bash
npx forge-ai-assist@latest --assistants all --plugins all
```

Check what's currently installed:

```bash
npx forge-ai-assist@latest status
```

Uninstall cleanly:

```bash
npx forge-ai-assist@latest --uninstall
```

## What you get

Forge ships three plugin groups. The **Core** group installs by
default; the others are opt-in.

**Core** — read-only GitHub analysis, useful every day.

- **Discussion Analyzer** — *"Summarize the top 5 open discussions
  and highlight unanswered questions."*
- **Issue Analyzer** — *"Show me open bugs labeled `P0` and group
  them by component."*
- **PR Comments Analyzer** — *"Analyze review comments on PR #42 —
  what are the recurring themes?"*

**Elevate** (`--plugins elevate`) — coaching on your engineering
practice.

- **Commit Craft Coach** — *"Review my last 10 commits — are they
  atomic and well-narrated?"*
- **PR Architect** — *"Evaluate my open PR — is it structured for
  easy review?"*
- **Review Quality Coach** — *"Assess my recent reviews — are they
  specific and architecturally deep?"*

**Ops** (`--plugins ops`) — release machinery.

- **Release Notes Generator** — *"Generate release notes from v1.1.20
  to HEAD."*

## How you invoke a plugin

Each assistant surfaces forge plugins differently because each
assistant has its own convention. Forge authors the plugin once and
its adapters render the right shape for each tool:

| Assistant | How to invoke |
|---|---|
| **Claude Code** | `/forge:discussion-analyzer`, `/forge:issue-analyzer`, … |
| **Codex** | `$forge-discussion-analyzer`, `$forge-issue-analyzer`, … |
| **GitHub Copilot** | `/agent` → pick a `forge-*` agent |
| **Gemini CLI** | `forge:discussion-analyzer`, `forge:issue-analyzer`, … |

No matter which assistant you're in, the natural-language examples
above work verbatim — you pass intent, the plugin handles the
`gh`/`git` commands.

## Selective installs

Install only Core plugins for only one assistant:

```bash
npx forge-ai-assist@latest --assistants claude --plugins core
```

Install the Elevate coaching plugins across all your assistants:

```bash
npx forge-ai-assist@latest --plugins elevate
```

Everything is additive. Re-running forge with a different set
replaces only its own managed files; your assistants' other
configuration is untouched.

## How it works

Forge does not run a background service. It does not proxy your
data. It does not cache answers or mint its own tokens. When you
invoke a plugin, your assistant executes read-only `gh` and `git`
commands *in your current repo* and interprets the results. The only
thing forge ships is a set of prompt files — agents, skills,
workflows — in each assistant's config directory.

The upside: zero trust surface added. The data your AI sees is
exactly what `gh` already sees on your machine.

The consequence: forge plugins are strictly **read-only**. They can
analyze, summarize, and coach, but they never mutate a repository or
create a PR or comment on an issue. That boundary is intentional and
enforced at the plugin-definition level.

## What's next

- [Package on npm](https://www.npmjs.com/package/forge-ai-assist) —
  latest version and release history.
- [Source on GitHub](https://github.com/arcanelabsio/forge) — full
  README, per-assistant setup guides, and the plugin architecture
  doc.
- [Usage Guide](https://github.com/arcanelabsio/forge/blob/main/docs/usage-guide.md) —
  file locations, custom instructions, and tips per assistant.
- [Plugin Architecture](https://github.com/arcanelabsio/forge/blob/main/docs/plugin-architecture.md) —
  how a single definition renders to four assistants.

More guides soon — a deeper look at the Review Quality Coach and the
PR Architect, and a walkthrough of authoring your own forge plugin
for internal use.
