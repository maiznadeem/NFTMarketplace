const { version } = require('./package.json');

// versionCode = major * 10000 + minor * 100 + patch (2.0.0 -> 20000)
const [major, minor, patch] = version.split('.').map(Number);
const versionCode = major * 10000 + minor * 100 + patch;

const NAVY = '#001F2D';

module.exports = {
  expo: {
    name: 'NFTMarketplace',
    slug: 'nftmarketplace',
    version,
    orientation: 'portrait',
    icon: './assets/icon.png',
    // The app themes itself (system default, user override); window background is set at runtime.
    userInterfaceStyle: 'automatic',
    platforms: ['android'],
    android: {
      package: 'com.himaiz.nftmarketplace',
      versionCode,
      googleServicesFile: './google-services.json',
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        monochromeImage: './assets/adaptive-icon-monochrome.png',
        backgroundColor: NAVY,
      },
    },
    plugins: [
      '@react-native-firebase/app',
      [
        'expo-splash-screen',
        {
          image: './assets/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: NAVY,
        },
      ],
      // Embed Inter natively: no runtime font loading at startup. Family names are the file names.
      [
        'expo-font',
        {
          fonts: ['Bold', 'SemiBold', 'Medium', 'Regular', 'Light'].map((w) => `./assets/fonts/Inter-${w}.ttf`),
        },
      ],
      // Ship only real-device ABIs (drops x86/x86_64, about 37 MB). NFT_BUILD_ARCHS overrides it for
      // emulator test builds, e.g. NFT_BUILD_ARCHS=x86_64.
      [
        'expo-build-properties',
        {
          android: {
            buildArchs: (process.env.NFT_BUILD_ARCHS || 'arm64-v8a,armeabi-v7a').split(','),
          },
        },
      ],
      './plugins/withReleaseSigning',
      './plugins/withCmakeVersion',
      './plugins/withNoForceDark',
    ],
  },
};
