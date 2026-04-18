---
name: "drive_sync_flutter"
tagline: "Bidirectional Google Drive sync for Flutter. Frozen at v1.2.0 — superseded by cloud_sync_drive."
status: "Frozen"
install: "flutter pub add drive_sync_flutter  # or migrate to cloud_sync_drive"
links:
  - label: "cloud_sync_drive"
    url: "/projects/cloud_sync"
    note: "the successor — new development lives here"
  - label: "pub.dev"
    url: "https://pub.dev/packages/drive_sync_flutter"
    note: "frozen at v1.2.0"
  - label: "GitHub"
    url: "https://github.com/arcanelabsio/drive_sync_flutter"
    note: "archival source — no new releases"
  - label: "Getting started"
    url: "/writing/getting-started-with-drive-sync-flutter"
    note: "legacy tutorial (still valid for v1.2.0)"
release:
  version: "v1.2.0 (final)"
  date: 2026-04-17
  notes: |
    ### Status: frozen

    `drive_sync_flutter` is **frozen at `1.2.0`**. No further
    releases are planned. The package continues to work for
    existing consumers — there is no forced migration.

    New development happens in
    [`cloud_sync`](/projects/cloud_sync), a Dart monorepo that
    splits the sync engine into a storage-agnostic core
    (`cloud_sync_core`) and pluggable backend adapters
    (`cloud_sync_drive`, `cloud_sync_s3`, `cloud_sync_box`).

    ### Why the split

    `drive_sync_flutter` locked the sync engine and the Google
    Drive adapter into one package. Adding a second backend
    (S3, Box) meant either forking the engine or polluting a
    Drive-named package with unrelated code. Neither scaled.

    `cloud_sync` splits them cleanly: the engine lives in
    `cloud_sync_core`, and each backend ships as its own
    package implementing a single 5-method `StorageAdapter`
    interface.

    ### Migration

    If you're already on `drive_sync_flutter 1.2.0`:

    - Replace `drive_sync_flutter` with
      `cloud_sync_core` + `cloud_sync_drive`.
    - `DriveSyncClient` → `SyncClient` (moved to `cloud_sync_core`).
    - `GoogleDriveAdapter` → `DriveAdapter` (stayed in
      `cloud_sync_drive`).
    - `GoogleAuthClient` → `DriveAuthClient`.
    - `SandboxValidator` → `PathValidator` (moved to
      `cloud_sync_core`).
    - `DriveScope` / `DriveScopeError` unchanged.
    - Legacy constructors (`.sandboxed()`, `.withPath()`,
      positional `GoogleDriveAdapter()`) removed — use the
      three explicit scope constructors (`.userDrive`,
      `.appFiles`, `.appData`).

    ### What v1.2.0 final contains

    - Three OAuth scope modes via named constructors on
      `GoogleDriveAdapter` — `.userDrive`, `.appFiles`,
      `.appData`.
    - `DriveScope` enum and `DriveScopeError` with
      remediation messages on 401/403.
    - `SandboxValidator` with structural path validation and
      query-injection escaping.
    - 117 tests covering all three scope modes, legacy
      constructor backward compatibility, and the full client
      lifecycle.
---

A Dart package that synced a local directory with a Google Drive
folder in both directions — SHA-256 change detection, four
conflict-resolution strategies, three OAuth scope modes.

**The project is frozen at `1.2.0`.** It still works; it still
installs; the README and tutorial stay up. But no new features,
no new releases. Active development moved to
[`cloud_sync`](/projects/cloud_sync) — a monorepo that owns the
sync engine once and ships backend adapters for Drive, S3, and
Box as separate packages.

Existing consumers on `1.2.0` can keep using it. New consumers
should start with `cloud_sync_core` + `cloud_sync_drive`.

Frozen on pub.dev at
[`drive_sync_flutter 1.2.0`](https://pub.dev/packages/drive_sync_flutter).
MIT licensed.
