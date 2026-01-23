/**
 * Zustand Store - Seller State Management
 * Handles seller posts, checkout links, and seller-specific state
 */

import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

interface SellerPost {
    id: number;
    name: string;
    description: string;
    price: number;
    checkoutLink: string;
    createdAt: Date;
    thumbnailUrl?: string;
    views: number;
    orders: number;
}

interface SellerState {
    // State
    posts: SellerPost[];
    isLoading: boolean;

    // Actions
    addPost: (post: Omit<SellerPost, 'views' | 'orders'>) => void;
    removePost: (id: number) => void;
    updatePostStats: (id: number, views?: number, orders?: number) => void;
    clearPosts: () => void;
}

export const useSellerStore = create<SellerState>()(
    devtools(
        persist(
            (set) => ({
                // Initial State
                posts: [],
                isLoading: false,

                // Add new post
                addPost: (post) => {
                    const newPost: SellerPost = {
                        ...post,
                        views: 0,
                        orders: 0,
                    };
                    set((state) => ({
                        posts: [newPost, ...state.posts]
                    }));
                },

                // Remove post
                removePost: (id) => {
                    set((state) => ({
                        posts: state.posts.filter(p => p.id !== id)
                    }));
                },

                // Update post stats
                updatePostStats: (id, views, orders) => {
                    set((state) => ({
                        posts: state.posts.map(p =>
                            p.id === id
                                ? {
                                    ...p,
                                    views: views !== undefined ? views : p.views,
                                    orders: orders !== undefined ? orders : p.orders
                                }
                                : p
                        )
                    }));
                },

                // Clear all posts
                clearPosts: () => set({ posts: [] }),
            }),
            {
                name: 'sokosnap-seller',
                partialize: (state) => ({
                    posts: state.posts,
                }),
            }
        ),
        { name: 'SellerStore' }
    )
);

// Selector hooks
export const useSellerPosts = () => useSellerStore((state) => state.posts);
export const useSellerLoading = () => useSellerStore((state) => state.isLoading);

export default useSellerStore;
