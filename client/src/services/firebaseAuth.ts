import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../config/firebase';

export interface FirebaseUserInfo {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

/**
 * Sign in using Google OAuth Popup via Firebase
 */
export const signInWithGoogle = async (): Promise<FirebaseUser> => {
  if (!isFirebaseConfigured) {
    throw new Error(
      'Firebase is not yet configured with real project credentials. Please paste your Firebase keys into client/.env'
    );
  }
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};

/**
 * Register a new user with Email & Password via Firebase
 */
export const registerWithFirebase = async (
  email: string,
  pass: string,
  displayName: string
): Promise<FirebaseUser> => {
  if (!isFirebaseConfigured) {
    throw new Error(
      'Firebase is not yet configured with real project credentials. Please paste your Firebase keys into client/.env'
    );
  }
  const result = await createUserWithEmailAndPassword(auth, email, pass);
  if (displayName) {
    await updateProfile(result.user, { displayName });
  }
  return result.user;
};

/**
 * Sign in with existing Email & Password via Firebase
 */
export const loginWithFirebase = async (
  email: string,
  pass: string
): Promise<FirebaseUser> => {
  if (!isFirebaseConfigured) {
    throw new Error(
      'Firebase is not yet configured with real project credentials. Please paste your Firebase keys into client/.env'
    );
  }
  const result = await signInWithEmailAndPassword(auth, email, pass);
  return result.user;
};

/**
 * Log out from Firebase session
 */
export const logoutFromFirebase = async (): Promise<void> => {
  if (!isFirebaseConfigured) return;
  await signOut(auth);
};

/**
 * Trigger a Firebase password reset email
 */
export const resetFirebasePassword = async (email: string): Promise<void> => {
  if (!isFirebaseConfigured) {
    throw new Error(
      'Firebase is not yet configured with real project credentials. Please paste your Firebase keys into client/.env'
    );
  }
  await sendPasswordResetEmail(auth, email);
};

/**
 * Listen for Firebase authentication state changes
 */
export const subscribeToFirebaseAuthState = (
  callback: (user: FirebaseUser | null) => void
) => {
  return onAuthStateChanged(auth, callback);
};
