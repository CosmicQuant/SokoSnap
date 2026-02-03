/**
 * Zustand Store - Seller Data Management
 * Handles fetching products (links) and orders from Firebase
 */
import { create } from 'zustand';
import { db, storage } from '../lib/firebase';
import {
    collection,
    query,
    where,
    onSnapshot,
    addDoc,
    updateDoc,
    doc,
    Timestamp
} from 'firebase/firestore';
import {
    ref,
    uploadBytes,
    getDownloadURL
} from 'firebase/storage';
import { slugify } from '../utils/formatters';
// We need to fetch User types from index, but LinkItem and Order need to be flexible for now
// or we update types.ts to support Firestore-style string IDs
import { LinkItem, Order } from '../types';

interface SellerState {
    links: LinkItem[];
    orders: Order[];
    isLoading: boolean;
    error: string | null;

    // Subscriptions
    unsubscribeLinks: (() => void) | null;
    unsubscribeOrders: (() => void) | null;

    // Actions
    fetchSellerData: (sellerId: string) => void;
    stopListening: () => void;
    createProduct: (product: any, files: File[]) => Promise<string>;
    updateProduct: (productId: string, updates: any, newFiles?: File[]) => Promise<void>;
    archiveProduct: (productId: string) => Promise<void>;
}

export const useSellerStore = create<SellerState>((set, get) => ({
    links: [],
    orders: [],
    isLoading: false,
    error: null,
    unsubscribeLinks: null,
    unsubscribeOrders: null,

    fetchSellerData: (sellerId: string) => {
        set({ isLoading: true });

        // 1. Listen to Products (Links)
        const productsQuery = query(
            collection(db, 'products'),
            where('sellerId', '==', sellerId),
            // orderBy('createdAt', 'desc') // Requires index, might fail initially without it
        );

        const unsubLinks = onSnapshot(productsQuery, (snapshot) => {
            const links = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as unknown as LinkItem[];
            set({ links });
        }, (err) => {
            console.error("Error fetching products:", err);
            set({ error: "Failed to load products" });
        });

        // 2. Listen to Orders
        const ordersQuery = query(
            collection(db, 'orders'),
            where('sellerId', '==', sellerId),
            // orderBy('date', 'desc') // Requires index
        );

        const unsubOrders = onSnapshot(ordersQuery, (snapshot) => {
            const orders = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().date?.toDate ? doc.data().date.toDate().toLocaleDateString() : 'Just now'
            })) as unknown as Order[];
            set({ orders, isLoading: false });
        }, () => {
            // console.error("Error fetching orders:", err);
            // Silent fail for orders if collection doesn't exist yet
        });

        set({
            unsubscribeLinks: unsubLinks,
            unsubscribeOrders: unsubOrders,
            isLoading: false
        });
    },

    stopListening: () => {
        const { unsubscribeLinks, unsubscribeOrders } = get();
        if (unsubscribeLinks) unsubscribeLinks();
        if (unsubscribeOrders) unsubscribeOrders();
        set({ links: [], orders: [] });
    },

    createProduct: async (productData, files) => {
        set({ isLoading: true });
        try {
            // 1. Upload Images
            const imageUrls: string[] = [];
            for (const file of files) {
                const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
                const snapshot = await uploadBytes(storageRef, file);
                const url = await getDownloadURL(snapshot.ref);
                imageUrls.push(url);
            }

            // 2. Save to Firestore
            const docRef = await addDoc(collection(db, 'products'), {
                ...productData,
                img: imageUrls[0] || '', // Main image
                images: imageUrls,
                slug: slugify(productData.name),
                createdAt: Timestamp.now(),
                views: 0,
                clicks: 0,
                sales: 0,
                revenue: 0,
                status: 'active'
            });

            set({ isLoading: false });
            return docRef.id;
        } catch (error) {
            console.error("Create Product Error:", error);
            set({ isLoading: false, error: "Failed to create product" });
            throw error;
        }
    },

    updateProduct: async (productId, updates, newFiles) => {
        set({ isLoading: true });
        try {
            // Check if this update involves images (Edit Mode) or just other fields (Status Toggle)
            const isImageUpdate = (updates.existingImages !== undefined) || (newFiles && newFiles.length > 0);

            if (!isImageUpdate) {
                // Simple partial update (e.g. status toggle)
                await updateDoc(doc(db, 'products', productId), {
                    ...updates,
                    updatedAt: Timestamp.now()
                });
                set({ isLoading: false });
                return;
            }

            // --- Full Update with potential image changes ---
            let imageUrls = updates.existingImages || [];

            // Upload new files if any
            if (newFiles && newFiles.length > 0) {
                for (const file of newFiles) {
                    const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
                    const snapshot = await uploadBytes(storageRef, file);
                    const url = await getDownloadURL(snapshot.ref);
                    imageUrls.push(url);
                }
            }

            // Prepare Clean Payload
            // Remove 'existingImages' helper field before sending to Firestore
            const { existingImages, ...cleanUpdates } = updates;

            const payload = {
                ...cleanUpdates,
                img: imageUrls.length > 0 ? imageUrls[0] : (updates.img || ''),
                images: imageUrls,
                ...(cleanUpdates.name ? { slug: slugify(cleanUpdates.name) } : {}),
                updatedAt: Timestamp.now()
            };


            await updateDoc(doc(db, 'products', productId), payload);
            set({ isLoading: false });
        } catch (error) {
            console.error("Update Product Error:", error);
            set({ isLoading: false, error: "Failed to update product" });
            throw error;
        }
    },

    archiveProduct: async (productId) => {
        set({ isLoading: true });
        try {
            await updateDoc(doc(db, 'products', productId), {
                status: 'archived'
            });
            set({ isLoading: false });
        } catch (error) {
            set({ isLoading: false, error: "Failed to archive product" });
        }
    }
}));

export default useSellerStore;
