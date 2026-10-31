import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  Auth
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  Firestore
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
  FirebaseStorage
} from 'firebase/storage';
import { Incident, UserProfile } from '../types';

// Support both environment variables and default user Firebase project configuration
const firebaseConfig = {
  apiKey:
    (import.meta as any).env?.VITE_FIREBASE_API_KEY ||
    'AIzaSyCYFoZ2aOAaX0bxpQCQRhUc96zPGh8wFag',
  authDomain:
    (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN ||
    'neighbournet-cf750.firebaseapp.com',
  projectId:
    (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID ||
    'neighbournet-cf750',
  storageBucket:
    (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET ||
    'neighbournet-cf750.firebasestorage.app',
  messagingSenderId:
    (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID ||
    '816858406105',
  appId:
    (import.meta as any).env?.VITE_FIREBASE_APP_ID ||
    '1:816858406105:web:cccd36050229ac63edf2c8',
  measurementId:
    (import.meta as any).env?.VITE_FIREBASE_MEASUREMENT_ID ||
    'G-62PEF4V34R'
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let isFirebaseInitialized = false;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  try {
    storage = getStorage(app);
  } catch (storageErr) {
    console.warn('Firebase Storage not active (using canvas base64 & Firestore image storage):', storageErr);
  }
  isFirebaseInitialized = true;
  console.log('✅ Firebase initialized successfully for project:', firebaseConfig.projectId);
} catch (error) {
  console.warn('⚠️ Firebase initialization failed, running with local persistence fallback:', error);
}

export { app, auth, db, storage, isFirebaseInitialized };

/* ================= AUTHENTICATION HELPERS ================= */

export const googleProvider = new GoogleAuthProvider();

export async function loginWithGoogle(): Promise<{ user?: FirebaseUser; error?: string }> {
  if (!isFirebaseInitialized || !auth) {
    return { error: 'Firebase Auth is not initialized' };
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user };
  } catch (error: any) {
    console.warn('Firebase Google Sign-in note (console config or popup):', error?.code || error?.message);
    return { error: error?.code || error?.message || 'Google popup sign-in unavailable' };
  }
}

export async function loginAnonymously(): Promise<FirebaseUser | null> {
  if (!isFirebaseInitialized || !auth) return null;
  try {
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (error) {
    console.error('Anonymous Sign-in failed:', error);
    return null;
  }
}

export async function logoutUser(): Promise<void> {
  if (!isFirebaseInitialized || !auth) return;
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign-out failed:', error);
  }
}

export function subscribeToAuthChanges(callback: (user: FirebaseUser | null) => void) {
  if (!isFirebaseInitialized || !auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

/* ================= CLOUD FIRESTORE: INCIDENTS ================= */

const INCIDENTS_COLLECTION = 'incidents';
const USERS_COLLECTION = 'users';

/**
 * Subscribes in real-time to incidents collection in Firestore.
 */
export function subscribeToFirestoreIncidents(
  onUpdate: (incidents: Incident[]) => void,
  onError?: (err: any) => void
) {
  if (!isFirebaseInitialized || !db) {
    return () => {};
  }

  try {
    const q = query(
      collection(db, INCIDENTS_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    return onSnapshot(
      q,
      snapshot => {
        const incidents: Incident[] = [];
        snapshot.forEach(docSnap => {
          incidents.push({ ...(docSnap.data() as Incident), id: docSnap.id });
        });
        if (incidents.length > 0) {
          onUpdate(incidents);
        }
      },
      error => {
        console.warn('Firestore subscription fallback:', error);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.warn('Firestore query error:', err);
    return () => {};
  }
}

/**
 * Writes or updates an incident in Firestore.
 */
export async function saveIncidentToFirestore(incident: Incident): Promise<boolean> {
  if (!isFirebaseInitialized || !db) return false;
  try {
    const docRef = doc(db, INCIDENTS_COLLECTION, incident.id);
    await setDoc(docRef, incident, { merge: true });
    return true;
  } catch (error) {
    console.warn('Error saving incident to Firestore:', error);
    return false;
  }
}

/**
 * Updates status or votes of an incident.
 */
export async function updateIncidentInFirestore(
  incidentId: string,
  updates: Partial<Incident>
): Promise<boolean> {
  if (!isFirebaseInitialized || !db) return false;
  try {
    const docRef = doc(db, INCIDENTS_COLLECTION, incidentId);
    await updateDoc(docRef, updates);
    return true;
  } catch (error) {
    console.warn('Error updating incident in Firestore:', error);
    return false;
  }
}

/**
 * Seed initial incidents if Firestore is empty.
 */
export async function seedFirestoreIfEmpty(seedData: Incident[]): Promise<boolean> {
  if (!isFirebaseInitialized || !db) return false;
  try {
    const snap = await getDocs(query(collection(db, INCIDENTS_COLLECTION), limit(1)));
    if (snap.empty) {
      for (const inc of seedData) {
        await setDoc(doc(db, INCIDENTS_COLLECTION, inc.id), inc);
      }
      return true;
    }
    return false;
  } catch (e) {
    console.warn('Firestore seed check error:', e);
    return false;
  }
}

/* ================= CLOUD FIRESTORE: USERS ================= */

export async function saveUserProfileToFirestore(profile: UserProfile): Promise<boolean> {
  if (!isFirebaseInitialized || !db || !profile.uid) return false;
  try {
    const docRef = doc(db, USERS_COLLECTION, profile.uid);
    await setDoc(docRef, profile, { merge: true });
    return true;
  } catch (error) {
    console.warn('Error saving user profile to Firestore:', error);
    return false;
  }
}

export async function getUserProfileFromFirestore(uid: string): Promise<UserProfile | null> {
  if (!isFirebaseInitialized || !db) return null;
  try {
    const docRef = doc(db, USERS_COLLECTION, uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.warn('Error getting user profile from Firestore:', error);
    return null;
  }
}

export function subscribeToLeaderboardFromFirestore(
  onUpdate: (users: UserProfile[]) => void
) {
  if (!isFirebaseInitialized || !db) {
    return () => {};
  }

  try {
    const q = query(collection(db, USERS_COLLECTION), orderBy('xp', 'desc'), limit(10));
    return onSnapshot(
      q,
      snapshot => {
        const users: UserProfile[] = [];
        snapshot.forEach(docSnap => {
          users.push(docSnap.data() as UserProfile);
        });
        if (users.length > 0) {
          onUpdate(users);
        }
      },
      error => {
        console.warn('Leaderboard subscription error:', error);
      }
    );
  } catch (err) {
    return () => {};
  }
}

/* ================= FIREBASE STORAGE ================= */

export async function uploadIncidentPhotoToStorage(
  incidentId: string,
  base64Data: string
): Promise<string | null> {
  if (!isFirebaseInitialized || !storage) {
    // Return compressed base64 directly so photos are never lost even without Cloud Storage
    return base64Data;
  }
  try {
    const fileRef = ref(storage, `incidents/${incidentId}_${Date.now()}.jpg`);
    await uploadString(fileRef, base64Data, 'data_url');
    return await getDownloadURL(fileRef);
  } catch (error) {
    console.warn('Firebase storage upload fallback to base64 inline:', error);
    return base64Data;
  }
}
