/**
 * Zustand Store - Authentication State Management
 * Handles user authentication, session management, and auth-related UI state
 */

import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import type { User } from '../types';

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
 * Generate a unique user ID
 */
const generateUserId = (): string => {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

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
                login: async (identifier: string, _password?: string) => {
                    set({ isLoading: true, error: null });

                    try {
                        // Simulate API call - Replace with actual API integration
                        await new Promise((resolve) => setTimeout(resolve, 1500));

                        // Mock user lookup
                        const user: User = {
                            id: generateUserId(),
                            name: 'Demo User',
                            phone: identifier.includes('@') ? '0712345678' : identifier,
                            email: identifier.includes('@') ? identifier : 'demo@sokosnap.com',
                            type: 'verified_buyer',
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        };

                        set({
                            user,
                            isAuthenticated: true,
                            isLoading: false,
                            isAuthModalOpen: false,
                            authMode: null,
                        });
                    } catch (error) {
                        set({
                            error: error instanceof Error ? error.message : 'Login failed',
                            isLoading: false,
                        });
                    }
                },

                loginWithGoogle: async () => {
                    set({ isLoading: true, error: null });
                    try {
                        // Simulate Google Auth
                        await new Promise((resolve) => setTimeout(resolve, 1500));

                        // Check if we need to collect phone (mock logic: 50% chance we need phone)
                        // In real app, you'd check if user exists and has phone

                        const user: User = {
                            id: generateUserId(),
                            name: 'Google User',
                            email: 'google.user@gmail.com',
                            phone: '', // Intentionally empty to trigger phone collection flow if needed
                            type: 'verified_buyer',
                            isEmailVerified: true,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        };

                        set({
                            user,
                            isAuthenticated: true,
                            isLoading: false,
                            // Only close if profile is complete (has phone)
                            isAuthModalOpen: !!user.phone ? false : true,
                        });

                    } catch (error) {
                        set({ error: 'Google Sign in failed', isLoading: false });
                    }
                },

                // Logout action
                logout: () => {
                    set({
                        user: null,
                        isAuthenticated: false,
                        error: null,
                        isAuthModalOpen: false,
                        authMode: null,
                    });
                },

                register: async (data) => {
                    set({ isLoading: true });
                    try {
                        await new Promise((resolve) => setTimeout(resolve, 1500));
                        const user: User = {
                            id: generateUserId(),
                            name: data.name || 'New User',
                            phone: data.phone,
                            email: data.email,
                            type: 'verified_buyer',
                            isEmailVerified: false, // Needs verification
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        };
                        set({ user, isAuthenticated: true, isLoading: false, isAuthModalOpen: false });
                    } catch (e) {
                        set({ isLoading: false, error: 'Registration failed' });
                    }
                },

                becomeSeller: async (data: SellerData) => {
                    set({ isLoading: true });
                    try {
                        await new Promise((resolve) => setTimeout(resolve, 1500));
                        const currentUser = get().user;
                        if (!currentUser) throw new Error('Not authenticated');

                        const updatedUser: User = {
                            ...currentUser,
                            type: 'verified_merchant',
                            ...data
                        };
                        set({ user: updatedUser, isLoading: false });
                    } catch (e) {
                        set({ isLoading: false, error: 'Failed to upgrade to seller' });
                    }
                },

                clearError: () => set({ error: null }),

                updateUser: (updates) => {
                    const currentUser = get().user;
                    if (currentUser) {
                        set({ user: { ...currentUser, ...updates } });
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
