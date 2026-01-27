/**
 * Zustand Store - Authentication State Management
 * Handles user authentication, session management, and auth-related UI state
 */

import { create } from 'zustand';
import { persist, devtools, createJSONStorage, StateStorage } from 'zustand/middleware';
import type { User } from '../types';
import { auth, db, googleProvider } from '../lib/firebase';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

// Safe storage wrapper for environments where localStorage is blocked (e.g. strict privacy settings)
const safeLocalStorage: StateStorage = {
    getItem: (name: string): string | null => {
        try {
            return window.localStorage.getItem(name);
        } catch (e) {
            return null;
        }
    },
    setItem: (name: string, value: string): void => {
        try {
            window.localStorage.setItem(name, value);
        } catch (e) {
            // Ignore write errors in restricted environments
        }
    },
    removeItem: (name: string): void => {
        try {
            window.localStorage.removeItem(name);
        } catch (e) {
            // Ignore
        }
    }
};

interface AuthState {
    // State
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    isAuthModalOpen: boolean;
    authMode: 'login' | 'register' | null;

    // Actions
    login: (identifier: string, password?: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    logout: () => void;
    register: (data: RegisterData) => Promise<void>;
    becomeSeller: (data: SellerData) => Promise<void>;
    clearError: () => void;
    openAuthModal: (mode: 'login' | 'register') => void;
    closeAuthModal: () => void;
    setLoading: (loading: boolean) => void;
    updateUser: (updates: Partial<User>) => void;
}

interface RegisterData {
    phone: string;
    email?: string;
    showPassword?: string;
    name?: string;
}

interface SellerData {
    shopName: string;
    shopLocation: string;
    contactPerson: string;
    contactPhone: string;
    refundPolicy?: string;
}

/**
 * Authentication Store
 * Uses Zustand with persistence and devtools middleware
 */
export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            (set, get) => ({
                // Initial State
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
                isAuthModalOpen: false,
                authMode: null,

                // Login action
                login: async (identifier: string, password?: string) => {
                    set({ isLoading: true, error: null });

                    try {
                        if (!password) throw new Error('Password is required');

                        // 1. Sign in with Firebase Auth
                        const userCredential = await signInWithEmailAndPassword(auth, identifier, password);
                        const firebaseUser = userCredential.user;

                        // 2. Fetch User Data from Firestore
                        const docRef = doc(db, 'users', firebaseUser.uid);
                        const docSnap = await getDoc(docRef);

                        let userData: User;

                        if (docSnap.exists()) {
                            // Convert Firestore Timestamp to Date if needed, assuming direct mapping for now
                            // but ensuring dates are Dates
                            const data = docSnap.data();
                            userData = {
                                ...data,
                                id: firebaseUser.uid,
                                createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
                                updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date()
                            } as User;
                        } else {
                            // Fallback if doc doesn't exist (shouldn't happen for registered users but good safety)
                            userData = {
                                id: firebaseUser.uid,
                                name: firebaseUser.displayName || 'User',
                                email: firebaseUser.email || identifier,
                                phone: '',
                                type: 'verified_buyer',
                                createdAt: new Date(),
                                updatedAt: new Date()
                            };
                            // Create it so next time it exists
                            await setDoc(docRef, userData);
                        }

                        set({
                            user: userData,
                            isAuthenticated: true,
                            isLoading: false,
                            isAuthModalOpen: false,
                            authMode: null,
                        });
                    } catch (error) {
                        console.error('Login error:', error);
                        set({
                            error: error instanceof Error ? error.message : 'Login failed',
                            isLoading: false,
                        });
                    }
                },

                loginWithGoogle: async () => {
                    set({ isLoading: true, error: null });
                    try {
                        const { authMode } = get();
                        const result = await signInWithPopup(auth, googleProvider);
                        const firebaseUser = result.user;

                        // Check Firestore
                        const docRef = doc(db, 'users', firebaseUser.uid);
                        const docSnap = await getDoc(docRef);

                        let userData: User;

                        if (docSnap.exists()) {
                            const data = docSnap.data();
                            userData = {
                                ...data,
                                id: firebaseUser.uid,
                                createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
                                updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date()
                            } as User;
                        } else {
                            // User document does not exist
                            if (authMode === 'login') {
                                // REQUIREMENT: Prevent login if not signed up
                                await signOut(auth);
                                set({
                                    user: null,
                                    isAuthenticated: false,
                                    isLoading: false,
                                    error: "No account found. Please sign up first.",
                                    authMode: 'register', // Switch to register mode
                                    isAuthModalOpen: true
                                });
                                return;
                            }

                            // Create new user doc for Google Sign In (Register Mode)
                            userData = {
                                id: firebaseUser.uid,
                                name: firebaseUser.displayName || 'Google User',
                                email: firebaseUser.email || '',
                                phone: '', // Missing initially, will prompt user later
                                avatar: firebaseUser.photoURL || undefined,
                                type: 'verified_buyer',
                                isEmailVerified: true,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            };
                            await setDoc(docRef, userData);
                        }

                        set({
                            user: userData,
                            isAuthenticated: true,
                            isLoading: false,
                            // If phone is missing, keep modal open (or logic elsewhere handles it)
                            // But here we just close it generally, relying on the 'Start Selling' check logic
                            isAuthModalOpen: false,
                        });

                    } catch (error: any) {
                        console.error('Google Sign in failed', error);

                        let errorMessage = 'Google Sign in failed';
                        if (error.message?.includes('offline')) {
                            errorMessage = 'Network error: Cannot verify account. Please check your internet connection.';
                        } else if (error.code === 'auth/popup-closed-by-user') {
                            errorMessage = 'Sign in cancelled';
                        }

                        set({ error: errorMessage, isLoading: false });
                    }
                },

                // Logout action
                logout: async () => {
                    try {
                        await signOut(auth);
                        set({
                            user: null,
                            isAuthenticated: false,
                            error: null,
                            isAuthModalOpen: false,
                            authMode: null,
                        });
                    } catch (error) {
                        console.error('Logout failed', error);
                    }
                },

                register: async (data) => {
                    set({ isLoading: true, error: null });
                    try {
                        if (!data.email || !data.showPassword) {
                            throw new Error("Email and password required");
                        }

                        // 1. Create Auth User
                        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.showPassword);
                        const firebaseUser = userCredential.user;

                        // 2. Update Profile Name
                        if (data.name) {
                            await updateProfile(firebaseUser, { displayName: data.name });
                        }

                        // 3. Create Firestore Doc
                        const newUser: User = {
                            id: firebaseUser.uid,
                            name: data.name || 'New User',
                            phone: data.phone,
                            email: data.email,
                            type: 'verified_buyer',
                            isEmailVerified: false,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        };

                        await setDoc(doc(db, 'users', firebaseUser.uid), newUser);

                        set({ user: newUser, isAuthenticated: true, isLoading: false, isAuthModalOpen: false });
                    } catch (error: any) {
                        console.error('Registration failed:', error);
                        let msg = 'Registration failed';
                        if (error.code === 'auth/email-already-in-use') msg = 'Email already in use';
                        if (error.code === 'auth/weak-password') msg = 'Password should be at least 6 characters';
                        set({ isLoading: false, error: msg });
                    }
                },

                becomeSeller: async (data: SellerData) => {
                    set({ isLoading: true });
                    try {
                        const currentUser = get().user;
                        if (!currentUser) throw new Error('Not authenticated');

                        const updatedUser: User = {
                            ...currentUser,
                            type: 'verified_merchant',
                            ...data,
                            updatedAt: new Date()
                        };

                        // Update Firestore
                        const docRef = doc(db, 'users', currentUser.id);
                        await updateDoc(docRef, {
                            type: 'verified_merchant',
                            ...data,
                            updatedAt: new Date()
                        });

                        set({ user: updatedUser, isLoading: false });
                    } catch (e) {
                        console.error('Become seller failed:', e);
                        set({ isLoading: false, error: 'Failed to upgrade to seller' });
                    }
                },

                clearError: () => set({ error: null }),

                updateUser: async (updates) => {
                    const currentUser = get().user;
                    if (currentUser) {
                        // Optimistic update
                        const updatedUser = { ...currentUser, ...updates };
                        set({ user: updatedUser });

                        // Fire and forget update to DB (or await if critical)
                        try {
                            const docRef = doc(db, 'users', currentUser.id);
                            await updateDoc(docRef, { ...updates, updatedAt: new Date() });
                        } catch (err) {
                            console.error("Failed to sync user update", err);
                        }
                    }
                },




                // Open auth modal
                openAuthModal: (mode) => set({ isAuthModalOpen: true, authMode: mode }),

                // Close auth modal
                closeAuthModal: () => set({ isAuthModalOpen: false, authMode: null }),

                // Set loading state
                setLoading: (loading) => set({ isLoading: loading }),
            }),
            {
                name: 'sokosnap-auth',
                // Use safe storage to prevent crashes in restricted environments
                storage: createJSONStorage(() => safeLocalStorage),
                // Only persist essential data
                partialize: (state) => ({
                    user: state.user,
                    isAuthenticated: state.isAuthenticated,
                }),
            }
        ),
        { name: 'AuthStore' }
    )
);

/**
 * Selector hooks for optimized re-renders
 */
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);
export const useIsAuthModalOpen = () => useAuthStore((state) => state.isAuthModalOpen);

export default useAuthStore;
