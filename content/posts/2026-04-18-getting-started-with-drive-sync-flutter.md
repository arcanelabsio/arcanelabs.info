---
title: "Getting started with drive_sync_flutter"
description: "Zero to a working Google Drive sync in about ten minutes."
date: 2026-04-18
---

`drive_sync_flutter` is a Dart package that adds bidirectional Google
Drive sync to a Flutter app — in both directions, with SHA-256 change
detection and conflict resolution. This guide takes you from an empty
project to a working sync in about ten minutes.

The library is [published on
pub.dev](https://pub.dev/packages/drive_sync_flutter) at v1.2.0 and
lives at [arcanelabsio/drive_sync_flutter](https://github.com/arcanelabsio/drive_sync_flutter)
on GitHub.

## Install

Add the package to your `pubspec.yaml`:

```yaml
dependencies:
  drive_sync_flutter: ^1.2.0
  google_sign_in: ^6.1.0
```

The library requires Dart 3.11 or newer. You'll also need
`google_sign_in` to obtain OAuth tokens — the library doesn't bundle
auth, so you pass it a signed-in HTTP client.

Run `flutter pub get`.

## Google Cloud setup

One-time ceremony before any sync works:

1. Create a Google Cloud project (or reuse one).
2. Enable the **Google Drive API v3** for the project.
3. Create an **OAuth 2.0 client ID** for each platform you ship
   on — Android, iOS/macOS, web. Each platform's `google_sign_in`
   setup guide walks through the manifest and Info.plist entries.

That's it. No service account, no server side. The tokens live on
the user's device.

## Pick a scope

Google Drive offers three OAuth scopes. `drive_sync_flutter` exposes
all three via named constructors on `GoogleDriveAdapter`. Pick one
based on who else writes to the Drive folder:

- **`drive.file`** (recommended default) — app sees only files it
  created. Non-sensitive scope; no [CASA
  assessment](https://developers.google.com/drive/api/guides/api-specific-auth)
  required. Use when your Flutter app is the only writer.

- **`drive`** — full access. Use only when multiple writers share the
  data (e.g., a mobile app *and* a desktop CLI *and* Drive Desktop
  all write to the same folder). Public distribution triggers annual
  CASA (~$5K–$20K).

- **`drive.appdata`** — hidden per-OAuth-client folder. Users can't
  see it in Drive. Good for opaque app state and caches.

When in doubt, `.appFiles()` — the `drive.file` mode — is the
correct answer for a Flutter-only app.

## Sign in

`drive_sync_flutter` expects an `http.Client` with OAuth headers
attached. `GoogleAuthClient` is a small wrapper for that:

```dart
import 'package:google_sign_in/google_sign_in.dart';
import 'package:drive_sync_flutter/drive_sync_flutter.dart';

final signIn = GoogleSignIn(scopes: [
  'https://www.googleapis.com/auth/drive.file',
]);
final account = await signIn.signIn();
final authClient = GoogleAuthClient(await account!.authHeaders);
```

The scope string on `GoogleSignIn` must match the adapter mode you
pick next — `drive.file` here pairs with `.appFiles()` below.

## Minimal sync

Ten lines:

```dart
final adapter = GoogleDriveAdapter.appFiles(
  httpClient: authClient,
  folderName: 'YourAppName',
  subPath: 'data',
);

final client = DriveSyncClient(adapter: adapter);

final result = await client.sync(
  localPath: '/absolute/path/to/your/local/data',
);

print('Uploaded: ${result.filesUploaded}');
print('Downloaded: ${result.filesDownloaded}');
```

On first run, the library creates the folder on Drive and uploads
every local file. On subsequent runs, it compares SHA-256 hashes
against a local manifest and moves only what changed.

`SyncResult` reports counts and any unresolved conflicts. Keep reading.

## Handling conflicts

When the same file changed on both sides since the last sync, the
library applies one of four strategies:

- **`newerWins`** (default) — most recent `lastModified` wins; ties
  favor local.
- **`localWins`** — always keep local.
- **`remoteWins`** — always keep remote.
- **`askUser`** — don't touch the file; add it to
  `result.unresolvedConflicts` so your UI can prompt the user.

Choose at construction:

```dart
final client = DriveSyncClient(
  adapter: adapter,
  defaultStrategy: ConflictStrategy.askUser,
);

final result = await client.sync(localPath: dir);
for (final conflict in result.unresolvedConflicts) {
  // show your UI; call client.resolveConflict(conflict, choice)
}
```

No merging happens. Losing versions are overwritten completely — if
you need to preserve both, use `askUser` and fan out in the UI.

## What's next

- [Package on pub.dev](https://pub.dev/packages/drive_sync_flutter) —
  version history and API reference.
- [Source on GitHub](https://github.com/arcanelabsio/drive_sync_flutter) —
  full README with a detailed scope-mode comparison and the CASA
  trade-off discussion.
- [CHANGELOG](https://github.com/arcanelabsio/drive_sync_flutter/blob/main/CHANGELOG.md) —
  what changed in each release.

More guides on the library's other features — custom `DriveAdapter`
implementations for non-Google backends, path-traversal protection,
and manifest inspection — soon.
