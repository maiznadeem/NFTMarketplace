const { withAndroidStyles, AndroidConfig } = require('expo/config-plugins');

// The app has its own light and dark themes. Opt out of Android/OEM "force dark" (e.g. MIUI/HyperOS dark
// mode for all apps), which would otherwise recolour backgrounds on top of the app's own theme.
module.exports = function withNoForceDark(config) {
  return withAndroidStyles(config, (cfg) => {
    cfg.modResults = AndroidConfig.Styles.assignStylesValue(cfg.modResults, {
      add: true,
      parent: AndroidConfig.Styles.getAppThemeGroup(),
      name: 'android:forceDarkAllowed',
      value: 'false',
    });
    return cfg;
  });
};
