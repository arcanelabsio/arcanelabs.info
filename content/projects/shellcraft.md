---
name: "shellcraft"
tagline: "A macOS developer-machine bootstrapper."
status: "Shipping"
install: |
  make plan PROFILE=core
  make install PROFILE=core
  make doctor PROFILE=core
links:
  - label: "GitHub"
    url: "https://github.com/arcanelabsio/shellcraft"
    note: "source code and README"
  - label: "DESIGN.md"
    url: "https://github.com/arcanelabsio/shellcraft/blob/main/DESIGN.md"
    note: "the pattern vs. the implementation"
release:
  version: "v1.0.0"
  date: 2026-04-17
  notes: |
    ### First stable release

    - **Preview-first execution** — `make plan PROFILE=…` shows what
      will happen before anything is written. `--plan` is the default
      for `setup-my-mac.sh`.
    - **Profile-based package selection** — additive profiles
      (`core`, `backend`, `ai`, `frontend`) so the same machine can
      pick up only what it needs: `PROFILE=core,backend,ai`.
    - **Managed-block dotfile adoption** — `~/.zprofile`, `~/.zshrc`,
      `~/.gitconfig`, `~/.tmux.conf` are adopted via named include
      blocks. Everything outside the block is yours and survives
      every run.
    - **Opt-in identity changes** — login-shell change, font install,
      GUI-assisted Xcode CLT install all default to off.
    - **Maintainer toolchain** — repo-wide lint enforced at commit
      time, smoke tests for fresh and existing machines.
---

Bootstraps and maintains a macOS developer machine with profile-based
package selection, preview-first execution, and managed-block dotfile
adoption. Rebuild your workstation in an hour without losing any of
your customizations.

Or via one-line remote bootstrap:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/arcanelabsio/shellcraft/v1.0.0/setup-my-mac.sh) --plan
```

Hosted on [GitHub](https://github.com/arcanelabsio/shellcraft).
Requires macOS and Homebrew. MIT licensed.
