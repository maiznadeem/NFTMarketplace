const { withAppBuildGradle } = require('expo/config-plugins');

// Adds a `release` signingConfig driven by Gradle properties (NFT_STORE_FILE, NFT_STORE_PASSWORD,
// NFT_KEY_ALIAS, NFT_KEY_PASSWORD) and uses it for the release buildType only when all are present.
const MARKER = '// withReleaseSigning';

const SIGNING_CONFIG = `
        ${MARKER}
        if (project.hasProperty('NFT_STORE_FILE') && project.hasProperty('NFT_STORE_PASSWORD') &&
                project.hasProperty('NFT_KEY_ALIAS') && project.hasProperty('NFT_KEY_PASSWORD')) {
            release {
                storeFile file(project.property('NFT_STORE_FILE'))
                storePassword project.property('NFT_STORE_PASSWORD')
                keyAlias project.property('NFT_KEY_ALIAS')
                keyPassword project.property('NFT_KEY_PASSWORD')
            }
        }`;

module.exports = function withReleaseSigning(config) {
  return withAppBuildGradle(config, (cfg) => {
    let src = cfg.modResults.contents;
    if (src.includes(MARKER)) return cfg;

    // 1. Add the release signing config at the end of the signingConfigs block.
    const sc = /signingConfigs\s*\{[\s\S]*?\n    \}/;
    if (!sc.test(src)) throw new Error('withReleaseSigning: signingConfigs block not found');
    src = src.replace(sc, (m) => m.replace(/\n    \}$/, `${SIGNING_CONFIG}\n    }`));

    // 2. In buildTypes.release, use it when it exists (otherwise keep the template default).
    const bt = /(buildTypes\s*\{[\s\S]*?release\s*\{[\s\S]*?)signingConfig signingConfigs\.debug/;
    if (!bt.test(src)) throw new Error('withReleaseSigning: release signingConfig line not found');
    src = src.replace(
      bt,
      "$1signingConfig signingConfigs.findByName('release') ?: signingConfigs.debug"
    );

    cfg.modResults.contents = src;
    return cfg;
  });
};
