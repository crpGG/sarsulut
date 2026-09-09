import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, type User } from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDocFromServer,
  type Firestore 
} from 'firebase/firestore';
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  type FirebaseStorage,
} from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App instance
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with specific database ID
export const db: Firestore = getFirestore(
  app, 
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
    ? firebaseConfig.firestoreDatabaseId
    : undefined
);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const storage: FirebaseStorage = getStorage(app);

/** Largest image we accept before upload, in bytes. */
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

/**
 * Upload an image to Firebase Storage and return its public download URL.
 *
 * Images used to be inlined into Firestore documents as base64 data URLs,
 * which broke on any real photo: base64 inflates a file by ~1.37x and a
 * Firestore document is capped at 1 MiB. Storing the file here and keeping
 * only the URL in Firestore removes that ceiling.
 *
 * @param folder Storage folder, e.g. 'galleries' or 'news'.
 */
export async function uploadImage(file: File, folder: string): Promise<string> {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error(
      `Format gambar tidak didukung (${file.type || 'tidak dikenal'}). Gunakan JPG, PNG, WebP, atau GIF.`
    );
  }
  if (file.size > MAX_IMAGE_BYTES) {
    const mb = (file.size / 1024 / 1024).toFixed(1);
    throw new Error(`Ukuran gambar ${mb} MB melebihi batas 8 MB.`);
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-80);
  const path = `${folder}/${Date.now()}-${safeName}`;

  const snapshot = await uploadBytes(storageRef(storage, path), file, {
    contentType: file.type,
    cacheControl: 'public, max-age=31536000',
  });

  return getDownloadURL(snapshot.ref);
}

/**
 * Delete a previously uploaded image by its download URL. Best effort: a
 * missing object or a URL pointing somewhere other than our own bucket is
 * not treated as an error.
 */
export async function deleteImageByUrl(url: string): Promise<void> {
  if (!url || !url.includes('firebasestorage.googleapis.com')) return;
  try {
    await deleteObject(storageRef(storage, url));
  } catch (err) {
    console.debug('Storage cleanup skipped:', err);
  }
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email || null,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore client is offline. Checking fallback.');
      return false;
    }
    // Non-fatal error during probe
    return true;
  }
}

// Execute connection test
testFirestoreConnection().catch((err) => {
  console.debug('Firestore probe completed:', err);
});

export { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, type User };
