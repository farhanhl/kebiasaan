import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";

// Safe placeholder for build-time prerendering (e.g. Next.js static prerender of /_not-found)
// when environment variables are not injected into the build environment.
const apiKey =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSy_BUILD_TIME_PLACEHOLDER_KEY";
const authDomain =
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "localhost";
const projectId =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "kebiasaan-placeholder";
const storageBucket =
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "";
const messagingSenderId =
  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "";
const appId =
  process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:000000000000:web:000000000000";

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
};

export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

function createDb() {
  if (typeof window !== "undefined") {
    try {
      return initializeFirestore(app, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
        }),
      });
    } catch {
      return getFirestore(app);
    }
  }
  return getFirestore(app);
}

export const db = createDb();
