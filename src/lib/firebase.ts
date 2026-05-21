import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup, Auth } from 'firebase/auth';
// @ts-ignore - this file is generated or dummy
import config from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY || config.apiKey,
  authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || config.authDomain,
  projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || config.projectId,
  storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || config.storageBucket,
  messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID || config.messagingSenderId,
  appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID || config.appId
};

// Check if config is valid
const isConfigValid = !!firebaseConfig.apiKey && 
                      firebaseConfig.apiKey !== 'missing' && 
                      firebaseConfig.projectId !== 'missing' &&
                      firebaseConfig.projectId !== '';

let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const db: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  if (!isConfigValid) {
    throw new Error('Firebase configuration is missing or invalid. Please check your environment variables or run the Firebase setup.');
  }
  return signInWithPopup(auth, googleProvider);
};

export { isConfigValid };
