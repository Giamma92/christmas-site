import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
  getDoc
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID
};

let app: FirebaseApp | undefined;

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0]!;
    }
  }
  return app!;
}

export function getFirebaseAuth() {
  const app = getFirebaseApp();
  return getAuth(app);
}

export function getFirebaseDb() {
  const app = getFirebaseApp();
  return getFirestore(app);
}

export async function signInWithGooglePopup() {
  const auth = getFirebaseAuth();
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

export async function signOutUser() {
  const auth = getFirebaseAuth();
  await signOut(auth);
}

export function subscribeToAuth(callback: (user: User | null) => void) {
  const auth = getFirebaseAuth();
  return onAuthStateChanged(auth, callback);
}

export async function saveLetterToFirestore(data: {
  name: string;
  text: string;
  userUid: string;
  userEmail: string | null;
}) {
  const db = getFirebaseDb();
  const col = collection(db, "letters");
  await addDoc(col, {
    name: data.name,
    text: data.text,
    userUid: data.userUid,
    userEmail: data.userEmail,
    createdAt: serverTimestamp()
  });
}

/**
 * Salva lo stato del calendario dell'Avvento per un utente.
 * openedDays è un array di numeri (1-24).
 */
export async function saveAdventStateForUser(userUid: string, openedDays: number[]) {
  const db = getFirebaseDb();
  const ref = doc(db, "adventStates", userUid);
  await setDoc(
    ref,
    {
      openedDays,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}

/**
 * Recupera lo stato del calendario dell'Avvento per un utente.
 * Restituisce un array di numeri (1-24) o [] se non presente.
 */
export async function getAdventStateForUser(userUid: string): Promise<number[]> {
  const db = getFirebaseDb();
  const ref = doc(db, "adventStates", userUid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return [];
  const data = snap.data() as { openedDays?: number[] };
  return Array.isArray(data.openedDays) ? data.openedDays : [];
}
