import { create } from 'zustand';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { Order } from '../types';

interface OrderState {
    orders: Order[];
    loading: boolean;
    error: string | null;
    fetchOrders: (userId: string) => Promise<void>;
    createOrder: (orderData: Partial<Order>) => Promise<string>;
}

export const useOrderStore = create<OrderState>((set) => ({
    orders: [],
    loading: false,
    error: null,

    fetchOrders: async (userId: string) => {
        set({ loading: true });
        try {
            const ordersRef = collection(db, 'orders');
            // Check if we have the index for this query before running
            // For now, simple query
            const q = query(
                ordersRef,
                where('customerId', '==', userId),
                // orderBy('createdAt', 'desc') // Needs index
            );

            const snapshot = await getDocs(q);
            const orders = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                // Map legacy fields if necessary
            })) as unknown as Order[];

            set({ orders, loading: false });
        } catch (error: any) {
            console.error("Error fetching orders:", error);
            set({ loading: false, error: error.message });
        }
    },

    createOrder: async (orderData) => {
        set({ loading: true });
        try {
            const docRef = await addDoc(collection(db, 'orders'), {
                ...orderData,
                createdAt: Timestamp.now(),
                status: 'pending',
                // Ensure required fields
            });

            // Optimistic update or refetch
            // const newOrder = { id: docRef.id, ...orderData, createdAt: new Date() } as Order;
            // set(state => ({ orders: [newOrder, ...state.orders], loading: false }));

            set({ loading: false });
            return docRef.id;
        } catch (error: any) {
            console.error("Error creating order:", error);
            set({ loading: false, error: error.message });
            throw error;
        }
    }
}));
