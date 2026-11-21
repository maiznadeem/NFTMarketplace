![Banner Image](images/AppBanner.png)

# Modern NFT Marketplace App

This repository contains the source code for a modern NFT Marketplace app built using React Native. The app allows users to explore and trade various digital assets as non-fungible tokens (NFTs).

## Features

- Browse and discover a wide range of NFTs from different artists and creators.
- Buy and sell NFTs securely using integrated cryptocurrency payments.
- Create and mint your own NFTs to showcase your digital creations.
- Connect with a vibrant community of artists, collectors, and enthusiasts.

## Screenshots

<div align="center">
  <img src="images/Image%201.jpg" alt="Home Page" width="200px" style="margin-right: 20px" />
  <img src="images/Image%202.jpg" alt="Details Page" width="200px" />
</div>

## Download

You can download the Android build of the app from here: [NFT Marketplace App (apk)](https://github.com/maiznadeem/NFTMarketplace/releases/latest)

## Development

1. Clone this repository and run `npm install`.
2. Start Metro with `npm start`. Firebase is native, so use a development build (`npx expo run:android`), not Expo Go.

## Build a release APK

Requires the Android SDK, a JDK, and the release keystore (the password is read from the local secret store).

```
npm run build:android
```

This runs `expo prebuild --clean`, `gradlew assembleRelease`, and writes `dist/NFTMarketplace-v<version>.apk` plus a `.sha256` file. `android/` is generated and not committed. Signing is wired in by `plugins/withReleaseSigning.js` from the Gradle properties `NFT_STORE_FILE`, `NFT_STORE_PASSWORD`, `NFT_KEY_ALIAS` and `NFT_KEY_PASSWORD`.

## Versioning

`package.json` `version` is the single source of truth. `app.config.js` derives the Android `versionCode` as `major * 10000 + minor * 100 + patch` (2.0.0 -> 20000). Bump it with `npm run version:patch`, `version:minor` or `version:major`.

To release, build the APK, then tag and publish it:

```
git tag v<version> && git push origin v<version>
gh release create v<version> dist/NFTMarketplace-v<version>.apk dist/NFTMarketplace-v<version>.apk.sha256 --title "NFTMarketplace v<version>"
```

Always sign with the same release keystore, or Android will refuse to install the update over an existing install.

## Technologies Used

- React Native with Expo SDK 58
- React Native Firebase (Realtime Database)
- Firebase Hosting (NFT and profile images, `hosting/`)
- React Navigation

## Contributing

Contributions are welcomed! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request.

<h4 align="center"> © M. Maiz Nadeem </h4>