/**
 * Zustand Store - Authentication State Management
 * Industry-grade authentication with Firebase
 * 
 * Features:
 * - Email/Password + Google Sign-in
 * - Secure persistence handling
 * - Automatic profile creation for Google users
 * - Robust error handling
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '../types';
import { auth, db, googleProvider } from '../lib/firebase';
import { slugify } from '../utils/formatters';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    updateProfile,
    browserLocalPersistence,
    setPersistence,
    type User as FirebaseUser
} from 'firebase/auth';
import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp,
    updateDoc
} from 'firebase/firestore';

// ============================================
// Types
// ============================================
interface AuthState {
    // State
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isInitialized: boolean;
    error: string | null;
    successMessage: string | null;

    // UI State
    isAuthModalOpen: boolean;
    authMode: 'login' | 'register' | 'forgot' | null;

    // Actions
    initialize: () => () => void;
    login: (email: string, password: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    resendVerificationEmail: () => Promise<void>;

    // Updates
    becomeSeller: (data: SellerData) => Promise<void>;
    updateUser: (updates: Partial<User>) => Promise<void>;

    // UI Actions
    openAuthModal: (mode: 'login' | 'register' | 'forgot') => void;
    closeAuthModal: () => void;
    clearError: () => void;
    clearSuccess: () => void;
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
    phone: string;
}

interface SellerData {
    shopName: string;
    shopLocation: string;
    contactPerson: string;
    contactPhone: string;
    refundPolicy?: string;
}

// ============================================
// Store Implementation
// ============================================
export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            // Initial State
            user: null,
            isAuthenticated: false,
            isLoading: true, // Start loading
            isInitialized: false,
            error: null,
            successMessage: null,
            isAuthModalOpen: false,
            authMode: null,

            // ============================================
            // Actions
            // ============================================

            /**
             * Initialize Auth Listener
             * This is the single source of truth for auth state
             */
            initialize: () => {
                console.log('[Auth] Initializing listener...');

                // State tracker to coordinate Redirect vs AuthListener
                // We don't want to show the Landing Page if a redirect is still validating
                // let redirectCheckComplete = false;

                // Handle Redirect Result (Mobile Auth Flow)
                getRedirectResult(auth).then(async (result) => {
                    if (result && result.user) {
                        console.log('[Auth] Recovered from redirect:', result.user.uid);
                        // The user is signed in, onAuthStateChanged will handle the rest
                    }
                }).catch(error => {
                    console.error('[Auth] Redirect login error:', error);
                    set({ error: "Mobile login failed. Please try again." });
                });

                // Set persistence to local (survives browser restart)
                setPersistence(auth, browserLocalPersistence).catch(err =>
                    console.error('[Auth] Persistence error:', err)
                );

                const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
                    if (firebaseUser) {
                        // User Found
                        try {
                            // Fetch user profile from Firestore
                            const docRef = doc(db, 'users', firebaseUser.uid);
                            const docSnap = await getDoc(docRef);

                            if (docSnap.exists()) {
                                const userData = docSnap.data() as User;

                                // Auto-heal: Ensure slug exists for existing users
                                if (!userData.slug) {
                                    const newSlug = slugify(userData.shopName || userData.name || '');
                                    if (newSlug) {
                                        await updateDoc(docRef, { slug: newSlug });
                                        userData.slug = newSlug;
                                    }
                                }

                                set({
                                    user: { ...userData, id: firebaseUser.uid },
                                    isAuthenticated: true,
                                    isLoading: false,
                                    isInitialized: true
                                });
                            } else {
                                // Valid auth but no profile - rare, but handled (Auto-heal)
                                console.warn('[Auth] No profile found for authenticated user. Creating default...');
                                const newUser = await createDefaultUser(firebaseUser);
                                set({
                                    user: newUser,
                                    isAuthenticated: true,
                                    isLoading: false,
                                    isInitialized: true
                                });
                            }
                        } catch (error) {
                            console.error('[Auth] Profile fetch error:', error);
                            // Fallback to basic profile to prevent loop
                            const basicUser: User = {
                                id: firebaseUser.uid,
                                name: firebaseUser.displayName || 'User',
                                email: firebaseUser.email || '',
                                phone: '',
                                type: 'verified_buyer',
                                isEmailVerified: firebaseUser.emailVerified,
                                isVerified: false,
                                createdAt: new Date(),
                                updatedAt: new Date()
                            };
                            set({
                                user: basicUser,
                                isAuthenticated: true,
                                isLoading: false,
                                isInitialized: true,
                                error: 'Could not load complete profile. Some features may be unavailable.'
                            });
                        }
                    } else {
                        // NO User Found
                        // Only set isInitialized=true if the redirect check is also done.
                        // However, onAuthStateChanged often fires 'null' first before the redirect consumes.
                        // We will add a small artificial delay if it's potentially a redirect flow

                        // If we are definitely not expecting a redirect (or it failed), show landing page
                        console.log('[Auth] No active session found.');

                        set({
                            user: null,
                            isAuthenticated: false,
                            isLoading: false,
                            isInitialized: true
                        });
                    }
                });

                return unsubscribe;
            },

            login: async (email, password) => {
                set({ isLoading: true, error: null });
                try {
                    await setPersistence(auth, browserLocalPersistence);
                    await signInWithEmailAndPassword(auth, email, password);
                    set({ isAuthModalOpen: false });
                } catch (error: any) {
                    console.error('[Auth] Login error:', error);
                    set({
                        error: getFriendlyErrorMessage(error),
                        isLoading: false
                    });
                }
            },

            loginWithGoogle: async () => {
                set({ isLoading: true, error: null });
                try {
                    await setPersistence(auth, browserLocalPersistence);

                    // Start with Popup (better for state preservation)
                    // Modern mobile browsers handle this well generally
                    try {
                        await signInWithPopup(auth, googleProvider);
                        set({ isAuthModalOpen: false });
                    } catch (popupError: any) {
                        console.warn('[Auth] Popup failed, falling back to redirect:', popupError);

                        // Fallback to redirect if popup is blocked/closed or not supported
                        // This ensures we still support strict mobile browsers that block popups
                        if (popupError.code === 'auth/popup-blocked' || popupError.code === 'auth/operation-not-supported-in-this-environment') {
                            await signInWithRedirect(auth, googleProvider);
                            return;
                        }
                        throw popupError;
                    }

                } catch (error: any) {
                    console.error('[Auth] Google login error:', error);
                    set({ error: error.message, isLoading: false });
                }
            },

            register: async (data) => {
                set({ isLoading: true, error: null });
                try {
                    const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, data.email, data.password);

                    // Update Display Name
                    await updateProfile(firebaseUser, { displayName: data.name });

                    // Create Profile
                    const newUser: User = {
                        id: firebaseUser.uid,
                        name: data.name,
                        email: data.email,
                        phone: data.phone,
                        type: 'verified_buyer', // Default role
                        isEmailVerified: false,
                        isVerified: false,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    };

                    await setDoc(doc(db, 'users', firebaseUser.uid), {
                        ...newUser,
                        createdAt: serverTimestamp(),
                        updatedAt: serverTimestamp()
                    });

                    // Success
                    set({
                        isAuthModalOpen: false,
                        successMessage: "Account created successfully!"
                    });
                } catch (error: any) {
                    console.error('[Auth] Register error:', error);
                    set({
                        error: getFriendlyErrorMessage(error),
                        isLoading: false
                    });
                }
            },

            logout: async () => {
                set({ isLoading: true });
                try {
                    await signOut(auth);
                    // Full State Reset
                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                        isInitialized: true,
                        authMode: null,
                        isAuthModalOpen: false,
                        error: null,
                        successMessage: null
                    });

                    // Clear local storage for safety
                    localStorage.removeItem('sokosnap-auth');

                    // Force navigation to Seller Landing Page
                    window.location.href = '/seller.html';
                } catch (error) {
                    console.error('[Auth] Logout error:', error);
                    set({ isLoading: false });
                }
            },

            forgotPassword: async (email) => {
                set({ isLoading: true, error: null });
                try {
                    await sendPasswordResetEmail(auth, email);
                    set({
                        isLoading: false,
                        successMessage: 'Password reset email sent! Check your inbox.'
                    });
                } catch (error: any) {
                    set({
                        isLoading: false,
                        error: getFriendlyErrorMessage(error)
                    });
                }
            },

            becomeSeller: async (data) => {
                set({ isLoading: true, error: null });
                const currentUser = get().user;

                if (!currentUser) return;

                try {
                    // Update Profile with Seller Data
                    const sellerUpdates = {
                        type: 'verified_merchant', // Or pending_merchant if you want approval flow
                        isVerified: false, // Needs admin approval by default? Or true?
                        shopName: data.shopName,
                        shopLocation: data.shopLocation,
                        contactPerson: data.contactPerson || currentUser.name,
                        contactPhone: data.contactPhone || currentUser.phone,
                        slug: slugify(data.shopName)
                    };

                    const docRef = doc(db, 'users', currentUser.id);
                    await updateDoc(docRef, {
                        ...sellerUpdates,
                        updatedAt: serverTimestamp()
                    });

                    // Update Local State based on logic
                    // Fetch fresh to be sure? No, optimistic is cleaner for UI
                    set((state) => ({
                        user: state.user ? { ...state.user, ...sellerUpdates } as User : null,
                        isLoading: false,
                        successMessage: "Seller profile activated!"
                    }));

                } catch (error: any) {
                    console.error('[Auth] Become Seller error:', error);
                    set({
                        isLoading: false,
                        error: "Failed to update seller profile. Try again."
                    });
                }
            },

            updateUser: async (updates) => {
                const currentUser = get().user;
                if (!currentUser) return;
                // Ensure slug is updated if shopName or name changes
                if (updates.shopName) {
                    // @ts-ignore - slug is not main typed but we want it in DB
                    updates.slug = slugify(updates.shopName);
                } else if (updates.name && !currentUser.shopName && !updates.shopName) {
                    // Only update slug from name if they don't have a shop name
                    // @ts-ignore
                    updates.slug = slugify(updates.name);
                }


                try {
                    await updateDoc(doc(db, 'users', currentUser.id), {
                        ...updates,
                        updatedAt: serverTimestamp()
                    });

                    set((state) => ({
                        user: state.user ? { ...state.user, ...updates } : null
                    }));
                } catch (error) {
                    console.error('Update failed', error);
                    throw error;
                }
            },

            // UI Helpers
            openAuthModal: (mode) => set({ isAuthModalOpen: true, authMode: mode, error: null, successMessage: null }),
            closeAuthModal: () => set({ isAuthModalOpen: false, authMode: null }),
            clearError: () => set({ error: null }),
            clearSuccess: () => set({ successMessage: null }),

            // Legacy/Unused dummy to satisfy types if needed or re-implement
            resendVerificationEmail: async () => { console.log("Verification email resend not implemented in V2"); }
        }),
        {
            name: 'sokosnap-auth',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated
            })
        }
    )
);

// ============================================
// Selector Hooks
// ============================================
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);
export const useIsAuthModalOpen = () => useAuthStore((state) => state.isAuthModalOpen);
export const useAuthInitialized = () => useAuthStore((state) => state.isInitialized);

export default useAuthStore;

async function createDefaultUser(firebaseUser: FirebaseUser): Promise<User> {
    const newUser: User = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'User',
        email: firebaseUser.email || '',
        phone: '',
        avatar: firebaseUser.photoURL || undefined,
        type: 'verified_buyer',
        isEmailVerified: firebaseUser.emailVerified,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), {
        ...newUser,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });

    return newUser;
}

function getFriendlyErrorMessage(error: any): string {
    const code = error.code;
    switch (code) {
        case 'auth/user-not-found':
            return 'No account found with this email.';
        case 'auth/wrong-password':
            return 'Incorrect password.';
        case 'auth/email-already-in-use':
            return 'This email is already registered.';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters.';
        case 'auth/network-request-failed':
            return 'Network error. Please check your connection.';
        case 'auth/popup-closed-by-user':
            return 'Sign in cancelled.';
        default:
            return error.message || 'An authentication error occurred.';
    }
}
