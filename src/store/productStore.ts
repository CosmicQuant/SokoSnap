import { create } from 'zustand';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { Product } from '../types';

interface ProductState {
    products: Product[];
    loading: boolean;
    error: string | null;
    fetchProducts: () => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
    products: [],
    loading: false,
    error: null,
    fetchProducts: async () => {
        set({ loading: true });
        try {
            const productsRef = collection(db, 'products');
            const q = query(
                productsRef,
                where('status', '==', 'active'),
                // orderBy('createdAt', 'desc'), // Requires composite index, safe to omit until index created
                limit(50)
            );

            const snapshot = await getDocs(q);
            const products = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    // Map legacy/seller-dashboard fields to Product interface
                    mediaUrl: data.mediaUrl || data.img || '',
                    type: data.type || (data.img?.includes('mp4') ? 'video' : 'image'),
                    sellerHandle: data.sellerHandle || (data.sellerName ? `@${data.sellerName.replace(/\s+/g, '').toLowerCase()}` : '@seller'),
                    sellerAvatar: data.sellerAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
                    likes: data.likes?.toString() || '0',
                    comments: data.comments?.toString() || '0',
                    verified: data.verified || false,
                    currency: data.currency || 'KES',
                    description: data.description || 'No description',
                };
            }) as unknown as Product[];

            set({ products, loading: false });
        } catch (error: any) {
            console.error("Error fetching feed:", error);
            set({ loading: false, error: error.message });
        }
    }
}));
