---
name: "cloud_sync"
tagline: "Bidirectional file sync for Dart and Flutter, across every cloud storage backend."
status: "Shipping"
install: "flutter pub add cloud_sync_core cloud_sync_drive"
links:
  - label: "cloud_sync_core"
    url: "https://pub.dev/packages/cloud_sync_core"
    note: "sync engine, manifest differ, conflict resolver"
  - label: "cloud_sync_drive"
    url: "https://pub.dev/packages/cloud_sync_drive"
    note: "Google Drive adapter"
  - label: "cloud_sync_s3"
    url: "https://pub.dev/packages/cloud_sync_s3"
    note: "AWS S3 + S3-compatible (R2, MinIO, B2, Wasabi, DO Spaces)"
  - label: "cloud_sync_box"
    url: "https://pub.dev/packages/cloud_sync_box"
    note: "Box Content API"
  - label: "GitHub"
    url: "https://github.com/arcanelabsio/cloud_sync"
    note: "monorepo source and READMEs"
release:
  version: "v0.1.1"
  date: 2026-04-18
  notes: |
    ### What's new

    - **Four packages on pub.dev.** `cloud_sync_core`,
      `cloud_sync_drive`, `cloud_sync_s3`, and `cloud_sync_box`
      are all live at `0.1.1`.
    - **Storage-agnostic core.** `cloud_sync_core` owns the sync
      engine, manifest differ, conflict resolver, and the
      `StorageAdapter` interface. Every backend plugs in behind
      the same 5-method contract.
    - **Drive, S3, Box shipped.** Google Drive with all three
      OAuth scopes, AWS S3 with SigV4 signing (validated against
      AWS test vectors) plus every S3-compatible service, and Box
      Content API via the files/folders endpoints.
    - **157 tests across 4 packages.** 62 core, 28 Drive, 48 S3,
      19 Box. `pana 160/160` on every package.
    - **One manifest format, one conflict model.** Move from Drive
      to S3 to Box by swapping the adapter — the client, engine,
      and strategy code stay identical.

    ### Scope in v0.1

    - Files up to ~50 MB (single-request upload; no multipart or
      resumable uploads yet).
    - No encryption — bring your own if you need it. Files are
      transferred as opaque bytes.
    - No background scheduling — you decide when to call `sync()`.
---

A Dart monorepo that moves files between a local directory and
any supported cloud backend, in both directions, with SHA-256
change detection and pluggable conflict resolution. The sync
logic is implemented once in a storage-agnostic core and reused
across every backend.

`cloud_sync` supersedes
[`drive_sync_flutter`](/projects/drive_sync_flutter), which is
frozen at `1.2.0`. New development happens here. Existing users
on v1.2.0 can stay on it — it still works — or migrate to
`cloud_sync_drive` for the new adapter API, additional backends,
and ongoing updates.

## Architecture

```
cloud_sync_core        <- StorageAdapter, SyncClient, SyncEngine,
    |                     ManifestDiffer, ConflictResolver, PathValidator
    +-- cloud_sync_drive   <- Google Drive v3 (drive / drive.file / drive.appdata)
    +-- cloud_sync_s3      <- AWS S3 + S3-compatible (R2, MinIO, B2, Wasabi, DO Spaces)
    +-- cloud_sync_box     <- Box Content API
```

Adding a new backend is a matter of implementing five methods:
`ensureFolder`, `listFiles`, `uploadFile`, `downloadFile`,
`deleteFile`. The engine handles diffing, conflict resolution,
and manifest persistence.

Published on
[pub.dev](https://pub.dev/publishers/arcanelabs.info/packages).
Requires Dart 3.11 or newer. MIT licensed.
