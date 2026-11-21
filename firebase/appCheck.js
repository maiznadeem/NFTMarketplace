import { getApp } from '@react-native-firebase/app';
import {
  getToken,
  initializeAppCheck,
  ReactNativeFirebaseAppCheckProvider,
} from '@react-native-firebase/app-check';

// App Check proves Realtime Database requests come from this app (package + signing key) on a genuine
// device, via Play Integrity. The database enforces it, so other clients can't read the data.
// For emulator testing only, a build can embed a registered debug token through
// EXPO_PUBLIC_APPCHECK_DEBUG_TOKEN; release builds must be built without it.
const debugToken = process.env.EXPO_PUBLIC_APPCHECK_DEBUG_TOKEN;

const provider = new ReactNativeFirebaseAppCheckProvider();
provider.configure({
  android: debugToken ? { provider: 'debug', debugToken } : { provider: 'playIntegrity' },
});

const appCheck = initializeAppCheck(getApp(), { provider, isTokenAutoRefreshEnabled: true });

// Resolves once a first token was obtained (or failed), so the first database read carries it.
export const appCheckReady = getToken(appCheck).then(
  () => true,
  (error) => {
    console.warn('App Check token unavailable', error?.message ?? error);
    return false;
  },
);
