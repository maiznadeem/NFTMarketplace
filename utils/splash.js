import * as SplashScreen from 'expo-splash-screen';

// Keep the native splash up until the first screen has real content (or failed to load),
// so the user never sees an empty frame. A failsafe hides it no matter what.
SplashScreen.preventAutoHideAsync().catch(() => {});

let hidden = false;
export function hideSplash() {
  if (hidden) return;
  hidden = true;
  SplashScreen.hideAsync().catch(() => {});
}

setTimeout(hideSplash, 8000);
