import { initializeApp, getApps, getApp } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import type { Auth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import type { FirebaseStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';
import type { Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyALCxxZtPt63C2g1dwiqNC0kc_PmXbYfoI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "travel-de402.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "travel-de402",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "travel-de402.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "872234153875",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:872234153875:web:8c6b622fdf8453af8e5a66",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-TTPL6YSGZT",
};

export const isFirebaseConfigured = true;

const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const storage: FirebaseStorage = getStorage(app);

let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
      console.log('📈 [Firebase Analytics] Initialized for measurement ID:', firebaseConfig.measurementId);
    }
  }).catch((err) => {
    console.debug('[Firebase Analytics] Not supported in this environment', err);
  });
}

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

console.log('🔥 [Firebase] Connected to project: travel-de402');

export { app, auth, storage, analytics, firebaseConfig };
export default app;
