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
      'expo-font',
      './plugins/withReleaseSigning',
      './plugins/withCmakeVersion',
      './plugins/withNoForceDark',
    ],
  },
};
