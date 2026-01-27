import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
import {
    initializeFirestore,
    persistentLocalCache,
    persistentMultipleTabManager,
    CACHE_SIZE_UNLIMITED
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore with modern persistence API
// This replaces the deprecated enableIndexedDbPersistence
export const db = initializeFirestore(app, {
    localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
        cacheSizeBytes: CACHE_SIZE_UNLIMITED
    })
});

export const storage = getStorage(app);

// Email verification helper
export const sendVerificationEmail = async () => {
    const user = auth.currentUser;
    if (user && !user.emailVerified) {
        await sendEmailVerification(user);
        return true;
    }
    return false;
};

// Password reset helper
export const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
};

// Analytics (lazy loaded with support check)
let analyticsInstance = null;
if (typeof window !== 'undefined') {
    import('firebase/analytics').then(({ isSupported, getAnalytics }) => {
        isSupported().then((supported) => {
            if (supported) {
                analyticsInstance = getAnalytics(app);
            }
        }).catch(err => console.warn('Analytics support check failed', err));
    });
}
export const analytics = analyticsInstance;

export default app;
