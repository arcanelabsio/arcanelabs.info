---
name: "drive_sync_flutter"
tagline: "Bidirectional Google Drive sync for Flutter."
status: "Shipping"
install: "flutter pub add drive_sync_flutter"
links:
  - label: "pub.dev"
    url: "https://pub.dev/packages/drive_sync_flutter"
    note: "package on pub.dev"
  - label: "GitHub"
    url: "https://github.com/arcanelabsio/drive_sync_flutter"
    note: "source code and README"
  - label: "Getting started"
    url: "/writing/getting-started-with-drive-sync-flutter"
    note: "tutorial for new users"
release:
  version: "v1.2.0"
  date: 2026-04-17
  notes: |
    ### What's new

    - **Three OAuth scope modes.** `GoogleDriveAdapter` now supports
      all three Google Drive scopes via explicit named constructors —
      the consumer chooses the compliance posture.
      - `GoogleDriveAdapter.userDrive(basePath:, subPath:)` — full
        `drive` scope. Required for multi-writer setups. Triggers
        annual CASA.
      - `GoogleDriveAdapter.appFiles(folderName:, subPath:)` —
        `drive.file` scope. App sees only files it created. No CASA.
      - `GoogleDriveAdapter.appData(subPath:)` — `drive.appdata`
        scope. Hidden per-OAuth-client folder. No CASA.
    - **`DriveScope` enum** exported so consumers can inspect
      `adapter.scope`.
    - **`DriveScopeError`** — 401/403 errors are translated into
      scope-mismatch errors with remediation messages.
    - **`SandboxValidator` refactor** — split structural path
      validation (always on) from the `.app/{appName}` naming
      convention.
    - **45 new tests** covering all three modes and legacy
      constructor backward compatibility.

    ### Backward compatibility

    All existing constructors still work. `.sandboxed()` emits a
    deprecation warning pointing to the new API. Migration is a
    one-to-one call-site rewrite.
---

A Dart package that syncs a local directory with a Google Drive
folder in both directions. SHA-256 change detection, four
conflict-resolution strategies, three OAuth scope modes, and
pluggable adapters for non-Google backends. Used by every Arcane
Labs app that treats Drive as a data layer.

Published on [pub.dev](https://pub.dev/packages/drive_sync_flutter).
Requires Dart 3.11 or newer. MIT licensed.
