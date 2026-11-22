# Infrastructure, deploy and operations

The live setup as of **2026-11-22**, checked against the Firebase and Google Cloud project. It contains no secret values.

## Overview

NFTMarketplace is an Android app (React Native / Expo) distributed as signed APKs on [GitHub Releases](https://github.com/maiznadeem/NFTMarketplace/releases). Its only backend is **Firebase**. There's no server, web hosting, cloud function or custom domain.

```
Android app (com.himaiz.nftmarketplace)
  ├─ App Check token ── firebaseappcheck.googleapis.com ← Play Integrity (on device)
  └─ realtime reads ─── nft-marketplace-d54bc-default-rtdb.firebaseio.com  (App Check ENFORCED, rules: read NFTData only)
```

## Hosting: Firebase project and services

| Item | Value |
|---|---|
| Firebase / Google Cloud project | `nft-marketplace-d54bc` (display name "NFTMarketplace", project number `235187590207`) |
| Billing plan | **Spark (free)**, with no billing account linked. The project must stay on the free tier. |
| Ownership | One owner account (IAM `roles/owner`). No other human members. |
| Registered apps | Android only: `com.himaiz.nftmarketplace`, app ID `1:235187590207:android:9868847070ef85f419d48a`, with release SHA-1 and SHA-256 registered. No Web or iOS apps. |
| **Realtime Database** | Default instance `https://nft-marketplace-d54bc-default-rtdb.firebaseio.com` (us-central1). Holds `NFTData`, 7 items with artwork embedded as base64 `data:` URIs (about 290 KB). Source images are in [`data/images/`](../data/images). |
| **App Check** | Play Integrity provider, enforced on the Realtime Database (see [Bot protection](#bot-protection-app-check)). |
| Firebase Hosting | **Disabled.** The default site `nft-marketplace-d54bc.web.app` / `.firebaseapp.com` has a `SITE_DISABLE` release (2026-11-21) and returns 404. Nothing is deployed and no domain is attached. |
| Cloud Storage | **None.** Both legacy `appspot.com` buckets were deleted (Storage needs Blaze). The Storage APIs are still enabled but unused. |
| Firestore, Cloud Functions, Auth, FCM | Not used. The Firestore and Cloud Functions APIs aren't enabled. |
| Custom domains | None. There's no `himaiz.com` (or other) hostname for this project. `himaiz` appears only in the Android package name. |

## CI

**None.** The repo has no `.github/workflows`, so pushes and PRs start no checks. Verification is local before every release:
- `npx expo-doctor`
- the release build (`npm run build:android`)
- `apksigner verify --print-certs` (signer must be the release certificate)
- `aapt2 dump badging` (package and version)
- an emulator run

## CD

Nothing deploys automatically. Each part is deployed by hand:

| Part | How it's deployed |
|---|---|
| **Android app** | `npm run version:*` → `npm run build:android` (local Gradle build, signed by `plugins/withReleaseSigning.js`) → `git tag vX.Y.Z` → `gh release create` with the APK and `.sha256`. Users sideload the update; there's no store auto-update. |
| **Database rules** | Source of truth: [`database.rules.json`](../database.rules.json), referenced by [`firebase.json`](../firebase.json). Deploy with `firebase deploy --only database --project nft-marketplace-d54bc` from an owner account, or paste into Console → Realtime Database → Rules. The live rules matched the file on 2026-11-22. |
| **Database data** | Written by an owner through the REST API or Console (owner OAuth bypasses rules and App Check). No seed or migration tooling is in the repo. |
| **Indexes** | None. The rules have no `.indexOn`, and the app reads the whole `NFTData` node. |
| **Functions / Hosting** | None deployed. Hosting is disabled. |
| **App Check, API keys** | Console or REST, by hand (see below). |

## Rollback

| Part | How to roll back |
|---|---|
| **App** | Android won't install a lower `versionCode` over a newer one. To roll back, revert the change, bump the **patch** version, rebuild and release. Users must install that APK. Builds older than v2.1.0 can't read data (they have no App Check). |
| **Database rules** | `git revert` the rules change and redeploy. Console → Rules also keeps a history with one-click rollback. |
| **App Check enforcement** | Emergency switch: Console → App Check → APIs → Realtime Database → **Unenforce**, or set the database service's `enforcementMode` to `UNENFORCED` via the App Check REST API. It takes effect within minutes and makes the data publicly readable again. Re-enforce afterwards. |
| **API key restrictions** | Google Cloud Console → APIs & Services → Credentials → edit the key. Restrictions apply within minutes. |
| **Data** | Spark has no automated RTDB backups. Restore by re-writing `NFTData` from a JSON export (Console → Realtime Database → ⋮ → Export/Import). Keep a current export before changing data; see the finding below. |
| **Hosting** | Nothing to roll back; the site is disabled. |

## Cloudflare

**Not behind Cloudflare, by design.** The app talks only to Google endpoints (`*.firebaseio.com`, `*.googleapis.com`, and Play Integrity through Google Play services). None of these can be proxied through Cloudflare, and there's no custom hostname to proxy. The backend is protected by App Check, database rules and API key restrictions instead.

## Secrets and keys

Names and locations only; never commit values.

| Name | What it is | Where it lives |
|---|---|---|
| Release keystore `nftmarketplace-release.jks` (alias `nftmarketplace`) | Signs every APK. Updates only install if signed with the same key. | Maintainer's machine (`%USERPROFILE%\.keystores\`) and an offline backup copy. Never in the repo (`*.jks` is gitignored). |
| `nftmarketplace-keystore-password` | Store and key password for the keystore. | The maintainer's local DPAPI secret store, plus a password manager. `scripts/build-android.ps1` reads it into process env only. |
| Gradle properties `NFT_STORE_FILE`, `NFT_STORE_PASSWORD`, `NFT_KEY_ALIAS`, `NFT_KEY_PASSWORD` | Passed to Gradle as `ORG_GRADLE_PROJECT_*` env vars at build time. | Set by the build script for one run; never written to disk. |
| `EXPO_PUBLIC_APPCHECK_DEBUG_TOKEN` | App Check debug token, for emulator/dev builds only. | Set only for a local test build. The token is registered in Console → App Check and deleted afterwards. Release builds refuse it. |
| `google-services.json` | Firebase Android config, including the **Android API key**. | Committed. The key isn't a secret by itself; it's restricted (below). |
| GitHub Actions secrets | None (there's no CI). | n/a |

**API key restrictions** (Google Cloud → Credentials):
- **Android key (auto created by Firebase)**, the key the app uses:
  - Android restriction: package `com.himaiz.nftmarketplace` with SHA-1 `3F:57:AF:B7:2F:0E:56:2C:CE:DB:F6:25:4D:FA:F7:EA:BB:82:77:D6`.
  - API restriction: Firebase Realtime Database, Firebase Installations, Firebase Management and Firebase App Check APIs only.
- **Browser key (auto created by Firebase)**: see the finding below. The app doesn't use it.

## Bot protection (App Check)

- **Provider:** Play Integrity, configured for apps distributed outside Google Play:
  - "Play recognized" is **not** required (`allowUnrecognizedVersion: true`), since sideloaded APKs can't be.
  - Licensing is **not** required.
  - Device integrity minimum: **`MEETS_DEVICE_INTEGRITY`**.
  - Token TTL: 1 hour.
- **Enforcement:** **ENFORCED** on the Realtime Database. Requests without a valid App Check token get `401 Missing appcheck token`; this was checked on 2026-11-22.
- **Debug tokens:** none registered (checked 2026-11-22). Register one only for a test, and delete it afterwards.
- **Effect:**
  - Only this app, signed with the release key and running on a genuine Android device, can read data.
  - Rooted devices, custom ROMs and emulators see "Couldn't load NFTs on this device."
  - The Play Integrity API has a default quota of 10,000 requests per day.

## Data: security rules

[`database.rules.json`](../database.rules.json), live and identical to the file:
- `.read` and `.write` are `false` at the root, so everything is denied by default.
- `NFTData` has `.read: true`. Together with App Check enforcement, that means readable only by the attested app.
- No path is writable by clients. Data changes are made by an owner with admin (OAuth) access, which bypasses rules and App Check.

## Findings (2026-11-22)

- **Browser API key recreated.** A "Browser key (auto created by Firebase)" exists again, created on 2026-11-21 at 17:13 UTC. The earlier one was deleted along with the Web app. Firebase most likely recreated it when the App Check and Play Integrity APIs were enabled.
  - It has **no application restriction** and a broad API allow-list (Database, Storage, Firestore, Hosting and more).
  - No app or repo file contains it, and App Check plus the rules still block data access. Even so, it should be **deleted or restricted**.
- **No data export in the repo.** `NFTData` exists only in the live database, plus a local export on the maintainer's machine. Spark has no automated backups. Commit a sanitized export, or document where the canonical copy lives.
- **Unused APIs enabled:** Firebase Hosting and the Cloud Storage APIs are enabled with nothing deployed. That's harmless, but they could be disabled.
