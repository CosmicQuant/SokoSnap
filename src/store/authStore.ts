/**
 * Zustand Store - Authentication State Management
 * Handles user authentication, session management, and auth-related UI state
 */

import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import type { User, UserType } from '../types';

interface AuthState {
    // State
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    isAuthModalOpen: boolean;
    authMode: 'login' | 'register' | null;

    // Actions
    login: (phone: string) => Promise<void>;
    logout: () => void;
    register: (data: RegisterData) => Promise<void>;
    becomeSeller: () => Promise<void>;
    clearError: () => void;
    openAuthModal: (mode: 'login' | 'register') => void;
    closeAuthModal: () => void;
    setLoading: (loading: boolean) => void;
}

interface RegisterData {
    phone: string;
    name?: string;
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
                login: async (phone: string) => {
                    set({ isLoading: true, error: null });

                    try {
                        // Simulate API call - Replace with actual API integration
                        await new Promise((resolve) => setTimeout(resolve, 1500));

                        // In production, this would be the response from your auth API
                        const user: User = {
                            id: generateUserId(),
                            name: 'User', // Would come from API
                            phone,
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

                // Register action
                register: async (data: RegisterData) => {
                    set({ isLoading: true, error: null });

                    try {
                        // Simulate API call
                        await new Promise((resolve) => setTimeout(resolve, 1500));

                        const user: User = {
                            id: generateUserId(),
                            name: data.name || 'User',
                            phone: data.phone,
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
                            error: error instanceof Error ? error.message : 'Registration failed',
                            isLoading: false,
                        });
                    }
                },

                // Upgrade to seller
                becomeSeller: async () => {
                    const { user } = get();
                    if (!user) {
                        set({ error: 'Must be logged in to become a seller' });
                        return;
                    }

                    set({ isLoading: true, error: null });

                    try {
                        // Simulate API call for merchant verification
                        await new Promise((resolve) => setTimeout(resolve, 1000));

                        set({
                            user: {
                                ...user,
                                type: 'verified_merchant' as UserType,
                                updatedAt: new Date(),
                            },
                            isLoading: false,
                        });
                    } catch (error) {
                        set({
                            error: error instanceof Error ? error.message : 'Seller upgrade failed',
                            isLoading: false,
                        });
                    }
                },

                // Clear error
                clearError: () => set({ error: null }),

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
