import { getDatabase, goOffline, goOnline, setPersistenceEnabled } from '@react-native-firebase/database';

import { appCheckReady } from './appCheck';

// Cache-first database:
// - Disk persistence serves the last synced NFTData instantly on later launches.
// - The client starts offline and connects only once App Check has a token (fetched at launch), so no
//   request ever reaches the database unattested. If attestation fails, cached data stays visible.
const db = getDatabase();

try {
  // Typed as a Promise but synchronous (returns undefined) on Android; must run before any ref is used.
  setPersistenceEnabled(db, true);
} catch (error) {
  console.warn('Database persistence unavailable', error?.message ?? error);
}
goOffline(db);
appCheckReady.then((ok) => { if (ok) goOnline(db); });

export const dbReady = Promise.resolve(db);
