/**
 * Zustand Store - Cart State Management
 * Handles shopping cart operations with persistence
 */

import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import type { Product } from '../types';

interface CartItem {
    product: Product;
    quantity: number;
    addedAt: Date;
}

interface CartState {
    // State
    items: CartItem[];
    isOpen: boolean;

    // Computed
    itemCount: number;
    subtotal: number;
    deliveryFee: number;
    total: number;

    // Actions
    addItem: (product: Product, quantity?: number) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
    isInCart: (productId: string) => boolean;
    getItemQuantity: (productId: string) => number;
}

const DELIVERY_FEE = 150; // KES

/**
 * Cart Store with persistence
 */
export const useCartStore = create<CartState>()(
    devtools(
        persist(
            (set, get) => ({
                // Initial State
                items: [],
                isOpen: false,

                // Computed values (recalculated with each state access)
                get itemCount() {
                    return get().items.reduce((sum, item) => sum + item.quantity, 0);
                },

                get subtotal() {
                    return get().items.reduce(
                        (sum, item) => sum + item.product.price * item.quantity,
                        0
                    );
                },

                get deliveryFee() {
                    return get().items.length > 0 ? DELIVERY_FEE : 0;
                },

                get total() {
                    return get().subtotal + get().deliveryFee;
                },

                // Add item to cart
                addItem: (product: Product, quantity = 1) => {
                    set((state) => {
                        const existingItemIndex = state.items.findIndex(
                            (item) => item.product.id === product.id
                        );

                        if (existingItemIndex !== -1) {
                            // Update quantity if item exists
                            const updatedItems = [...state.items];
                            const existingItem = updatedItems[existingItemIndex];

                            if (existingItem) {
                                updatedItems[existingItemIndex] = {
                                    ...existingItem,
                                    quantity: existingItem.quantity + quantity,
                                };
                                return { items: updatedItems };
                            }
                        }

                        // Add new item
                        return {
                            items: [
                                ...state.items,
                                {
                                    product,
                                    quantity,
                                    addedAt: new Date(),
                                },
                            ],
                        };
                    });
                },

                // Remove item from cart
                removeItem: (productId: string) => {
                    set((state) => ({
                        items: state.items.filter((item) => item.product.id !== productId),
                    }));
                },

                // Update item quantity
                updateQuantity: (productId: string, quantity: number) => {
                    if (quantity <= 0) {
                        get().removeItem(productId);
                        return;
                    }

                    set((state) => ({
                        items: state.items.map((item) =>
                            item.product.id === productId ? { ...item, quantity } : item
                        ),
                    }));
                },

                // Clear all items
                clearCart: () => {
                    set({ items: [] });
                },

                // Cart visibility
                openCart: () => set({ isOpen: true }),
                closeCart: () => set({ isOpen: false }),
                toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

                // Helper methods
                isInCart: (productId: string) => {
                    return get().items.some((item) => item.product.id === productId);
                },

                getItemQuantity: (productId: string) => {
                    const item = get().items.find((item) => item.product.id === productId);
                    return item?.quantity ?? 0;
                },
            }),
            {
                name: 'sokosnap-cart',
                // Custom serialization for Date objects
                storage: {
                    getItem: (name) => {
                        const str = localStorage.getItem(name);
                        if (!str) return null;
                        const parsed = JSON.parse(str);
                        // Rehydrate Date objects
                        if (parsed.state?.items) {
                            parsed.state.items = parsed.state.items.map((item: CartItem) => ({
                                ...item,
                                addedAt: new Date(item.addedAt),
                            }));
                        }
                        return parsed;
                    },
                    setItem: (name, value) => {
                        localStorage.setItem(name, JSON.stringify(value));
                    },
                    removeItem: (name) => {
                        localStorage.removeItem(name);
                    },
                },
            }
        ),
        { name: 'CartStore' }
    )
);

/**
 * Selector hooks for optimized re-renders
 */
export const useCartItems = () => useCartStore((state) => state.items);
export const useCartItemCount = () => useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
export const useCartSubtotal = () => useCartStore((state) => state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0));
export const useCartTotal = () => {
    const subtotal = useCartSubtotal();
    const items = useCartItems();
    return subtotal + (items.length > 0 ? DELIVERY_FEE : 0);
};
export const useIsCartOpen = () => useCartStore((state) => state.isOpen);

export default useCartStore;
