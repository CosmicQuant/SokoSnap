/**
 * Zustand Store - UI State Management
 * Handles navigation, modals, and general UI state
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ViewState, FeedTab } from '../types';

interface UIState {
    // Navigation
    currentView: ViewState;
    previousView: ViewState | null;

    // Feed
    activeTab: FeedTab;

    // Checkout
    isCheckoutOpen: boolean;
    activeProductId: string | null;

    // Processing states
    isProcessing: boolean;
    processingMessage: string | null;

    // Toast/Notifications
    toast: ToastState | null;

    // Actions
    navigateTo: (view: ViewState) => void;
    goBack: () => void;
    setActiveTab: (tab: FeedTab) => void;
    openCheckout: (productId: string) => void;
    closeCheckout: () => void;
    setProcessing: (processing: boolean, message?: string) => void;
    showToast: (toast: Omit<ToastState, 'id'>) => void;
    hideToast: () => void;
    reset: () => void;
}

interface ToastState {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
}

/**
 * UI Store
 */
export const useUIStore = create<UIState>()(
    devtools(
        (set, get) => ({
            // Initial State
            currentView: 'feed',
            previousView: null,
            activeTab: 'foryou',
            isCheckoutOpen: false,
            activeProductId: null,
            isProcessing: false,
            processingMessage: null,
            toast: null,

            // Navigate to a view
            navigateTo: (view: ViewState) => {
                const { currentView } = get();
                set({
                    previousView: currentView,
                    currentView: view,
                });
            },

            // Go back to previous view
            goBack: () => {
                const { previousView } = get();
                if (previousView) {
                    set({
                        currentView: previousView,
                        previousView: null,
                    });
                } else {
                    set({ currentView: 'feed' });
                }
            },

            // Set active feed tab
            setActiveTab: (tab: FeedTab) => {
                set({ activeTab: tab });
            },

            // Open checkout for a product
            openCheckout: (productId: string) => {
                set({
                    isCheckoutOpen: true,
                    activeProductId: productId,
                });
            },

            // Close checkout
            closeCheckout: () => {
                set({
                    isCheckoutOpen: false,
                    activeProductId: null,
                });
            },

            // Set processing state
            setProcessing: (processing: boolean, message?: string) => {
                set({
                    isProcessing: processing,
                    processingMessage: processing ? message || null : null,
                });
            },

            // Show toast notification
            showToast: (toast: Omit<ToastState, 'id'>) => {
                const id = `toast_${Date.now()}`;
                set({ toast: { ...toast, id } });

                // Auto-hide after duration
                const duration = toast.duration ?? 3000;
                setTimeout(() => {
                    const currentToast = get().toast;
                    if (currentToast?.id === id) {
                        set({ toast: null });
                    }
                }, duration);
            },

            // Hide toast
            hideToast: () => {
                set({ toast: null });
            },

            // Reset UI state
            reset: () => {
                set({
                    currentView: 'feed',
                    previousView: null,
                    activeTab: 'foryou',
                    isCheckoutOpen: false,
                    activeProductId: null,
                    isProcessing: false,
                    processingMessage: null,
                    toast: null,
                });
            },
        }),
        { name: 'UIStore' }
    )
);

/**
 * Selector hooks
 */
export const useCurrentView = () => useUIStore((state) => state.currentView);
export const useActiveTab = () => useUIStore((state) => state.activeTab);
export const useIsCheckoutOpen = () => useUIStore((state) => state.isCheckoutOpen);
export const useIsProcessing = () => useUIStore((state) => state.isProcessing);
export const useToast = () => useUIStore((state) => state.toast);

export default useUIStore;
