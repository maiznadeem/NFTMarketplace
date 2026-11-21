const { withAppBuildGradle } = require('expo/config-plugins');

// Pins the Android CMake version to one that bundles a long-path-aware ninja. The default (3.22.1) ships
// ninja 1.10, which fails on Windows with "Filename longer than 260 characters" for RN native modules.
const CMAKE_VERSION = '3.31.6';

module.exports = function withCmakeVersion(config) {
  return withAppBuildGradle(config, (cfg) => {
    const src = cfg.modResults.contents;
    if (src.includes('// withCmakeVersion')) return cfg;
    if (!/^android \{\n/m.test(src)) throw new Error('withCmakeVersion: android block not found');
    cfg.modResults.contents = src.replace(
      /^android \{\n/m,
      `android {\n    // withCmakeVersion\n    externalNativeBuild {\n        cmake {\n            version "${CMAKE_VERSION}"\n        }\n    }\n`
    );
    return cfg;
  });
};
