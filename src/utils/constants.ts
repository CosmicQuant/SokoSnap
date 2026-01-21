/**
 * Application constants
 * Centralizes all magic values and configuration
 */

import type { Product, Lead, Order, SellerStats } from '../types';

// ============================================
// App Configuration
// ============================================

export const APP_CONFIG = {
    name: 'SokoSnap',
    tagline: 'by TumaFast',
    version: '2.4.0',
    currency: 'KES',
    deliveryFee: 150,
    escrowPrefix: 'TRX',
    supportEmail: 'support@sokosnap.ke',
    supportPhone: '+254 700 000 000',
} as const;

// ============================================
// API Configuration
// ============================================

export const API_CONFIG = {
    baseUrl: import.meta.env.VITE_API_URL || 'https://api.sokosnap.ke',
    timeout: 30000,
    retryAttempts: 3,
} as const;

// ============================================
// M-Pesa Configuration
// ============================================

export const MPESA_CONFIG = {
    paybillNumber: '174379',
    accountPrefix: 'SOKO',
    minAmount: 10,
    maxAmount: 150000,
} as const;

// ============================================
// Validation Constants
// ============================================

export const VALIDATION = {
    phone: {
        minLength: 10,
        maxLength: 13,
        pattern: /^0[17]\d{8}$/,
    },
    name: {
        minLength: 2,
        maxLength: 50,
    },
    description: {
        minLength: 10,
        maxLength: 1000,
    },
    price: {
        min: 1,
        max: 10000000,
    },
} as const;

// ============================================
// UI Constants
// ============================================

export const UI_CONSTANTS = {
    toastDuration: 3000,
    animationDuration: 300,
    debounceDelay: 300,
    maxCartItems: 50,
    productsPerPage: 20,
} as const;

// ============================================
// Product Categories
// ============================================

export const PRODUCT_CATEGORIES = [
    { id: 'fashion', name: 'Fashion', icon: '👕' },
    { id: 'electronics', name: 'Electronics', icon: '📱' },
    { id: 'beauty', name: 'Beauty', icon: '💄' },
    { id: 'home', name: 'Home & Living', icon: '🏠' },
    { id: 'sports', name: 'Sports', icon: '⚽' },
    { id: 'food', name: 'Food & Drinks', icon: '🍔' },
    { id: 'other', name: 'Other', icon: '📦' },
] as const;

// ============================================
// Order Status Configuration
// ============================================

export const ORDER_STATUS_CONFIG = {
    pending: { label: 'Pending', color: 'slate', icon: 'Clock' },
    processing: { label: 'Processing', color: 'blue', icon: 'Loader' },
    escrow_held: { label: 'Escrow Held', color: 'purple', icon: 'Lock' },
    in_transit: { label: 'In Transit', color: 'orange', icon: 'Truck' },
    delivered: { label: 'Delivered', color: 'emerald', icon: 'Package' },
    completed: { label: 'Completed', color: 'green', icon: 'CheckCircle' },
    cancelled: { label: 'Cancelled', color: 'red', icon: 'XCircle' },
    refunded: { label: 'Refunded', color: 'gray', icon: 'RefreshCw' },
} as const;

// ============================================
// Mock Data - Products
// ============================================

export const MOCK_PRODUCTS: Product[] = [
    {
        id: 'prod_1',
        sellerId: 'sell_1',
        sellerName: 'Eastleigh Kicks',
        sellerHandle: '@eastleigh_kicks',
        sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eastleigh',
        verified: true,
        name: 'Air Jordan 1 "University Blue"',
        price: 4500,
        currency: 'KES',
        type: 'video',
        mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-showing-sneakers-34537-large.mp4',
        description: 'Premium quality. Best sellers in Nairobi. Verified stock. This Air Jordan 1 University Blue is composed of a white leather upper with University Blue suede overlays and black Swooshes. Get yours today securely.',
        likes: '12.4k',
        comments: '420',
        isHighValue: false,
        category: 'fashion',
    },
    {
        id: 'prod_2',
        sellerId: 'sell_2',
        sellerName: 'Luxe Tech',
        sellerHandle: '@luxetech_ke',
        sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LuxeTech',
        verified: true,
        name: 'Neon Edition Controller',
        price: 8500,
        currency: 'KES',
        type: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1605833559746-611c651a038c?auto=format&fit=crop&q=80&w=1080',
        description: 'Limited stock. Official warranty. Same-day delivery.',
        likes: '5.2k',
        comments: '89',
        isHighValue: false,
        category: 'electronics',
    },
    {
        id: 'prod_3',
        sellerId: 'sell_3',
        sellerName: 'Sneaker Head',
        sellerHandle: '@sneakerhead_254',
        sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SneakerHead',
        verified: true,
        name: 'Yeezy Boost "Solar"',
        price: 12500,
        currency: 'KES',
        type: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=1080',
        description: 'Authentic import. Vetted for TumaFast Trust.',
        likes: '18.9k',
        comments: '234',
        isHighValue: true,
        category: 'fashion',
    },
    {
        id: 'prod_4',
        sellerId: 'sell_4',
        sellerName: 'Urban Fit',
        sellerHandle: '@urbanfit_ke',
        sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=UrbanFit',
        verified: true,
        name: 'Sunshine Puffer Jacket',
        price: 3500,
        currency: 'KES',
        type: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=1080',
        description: 'Stand out this winter. Thermal insulated & water resistant.',
        likes: '8.4k',
        comments: '156',
        isHighValue: false,
        category: 'fashion',
    },
    {
        id: 'prod_5',
        sellerId: 'sell_5',
        sellerName: 'Skate Nairobi',
        sellerHandle: '@skate_nbo',
        sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SkateNBO',
        verified: true,
        name: 'Pro Deck "Neon City"',
        price: 6000,
        currency: 'KES',
        type: 'video',
        mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-skateboarder-doing-a-trick-in-slow-motion-42502-large.mp4',
        description: 'Professional grade maple. Custom grip tape included.',
        likes: '3.1k',
        comments: '67',
        isHighValue: false,
        category: 'sports',
    },
    {
        id: 'prod_6',
        sellerId: 'sell_6',
        sellerName: 'Glamour Heels',
        sellerHandle: '@glamour_ke',
        sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GlamourHeels',
        verified: true,
        name: 'Royal Blue Stilettos',
        price: 4200,
        currency: 'KES',
        type: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=1080',
        description: 'Italian velvet finish. Comfortable all-day wear.',
        likes: '15.2k',
        comments: '298',
        isHighValue: false,
        category: 'fashion',
    },
    {
        id: 'prod_7',
        sellerId: 'sell_7',
        sellerName: 'Afro Luxury',
        sellerHandle: '@afrolux_254',
        sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AfroLuxury',
        verified: true,
        name: 'Gold Plated Watch',
        price: 15000,
        currency: 'KES',
        type: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=1080',
        description: 'Swiss movement. 2-year warranty included.',
        likes: '22k',
        comments: '456',
        isHighValue: true,
        category: 'fashion',
    },
];

// ============================================
// Mock Data - Seller Stats
// ============================================

export const MOCK_SELLER_STATS: SellerStats = {
    totalSales: 142500,
    orders: 32,
    pendingPayout: 12400,
    views: 4800,
    conversionRate: 4.2,
};

// ============================================
// Mock Data - Orders
// ============================================

export const MOCK_ORDERS: Order[] = [
    {
        id: 'ORD-8821',
        items: [],
        customerId: 'cust_1',
        customerPhone: '0722***890',
        sellerId: 'sell_1',
        amount: 4500,
        deliveryFee: 150,
        total: 4650,
        status: 'in_transit',
        riderId: 'rider_1',
        riderName: 'Kamau',
        deliveryLocation: 'Westlands, Nairobi',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 'ORD-8820',
        items: [],
        customerId: 'cust_2',
        customerPhone: '0711***412',
        sellerId: 'sell_1',
        amount: 3800,
        deliveryFee: 150,
        total: 3950,
        status: 'delivered',
        riderId: 'rider_2',
        riderName: 'Otieno',
        deliveryLocation: 'Kilimani, Nairobi',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 'ORD-8819',
        items: [],
        customerId: 'cust_3',
        customerPhone: '0745***110',
        sellerId: 'sell_1',
        amount: 3500,
        deliveryFee: 150,
        total: 3650,
        status: 'completed',
        riderId: 'rider_3',
        riderName: 'Sarah',
        deliveryLocation: 'Parklands, Nairobi',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

// ============================================
// Mock Data - Leads
// ============================================

export const MOCK_LEADS: Lead[] = [
    {
        id: 'lead_1',
        platform: 'TikTok',
        handle: 'nairobisneakers_254',
        productHint: 'New stock J4s',
        frictionScore: 45,
        lastPostTime: '10 mins ago',
        status: 'New',
    },
    {
        id: 'lead_2',
        platform: 'Instagram',
        handle: 'luxury_watches_ke',
        productHint: 'Rolex Submariner',
        frictionScore: 12,
        lastPostTime: '1 hour ago',
        status: 'New',
    },
    {
        id: 'lead_3',
        platform: 'TikTok',
        handle: 'thrift_queen',
        productHint: 'Denim Jackets',
        frictionScore: 82,
        lastPostTime: '2 hours ago',
        status: 'Contacted',
    },
];

// ============================================
// Chart Mock Data
// ============================================

export const MOCK_CHART_DATA = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 12000 },
    { name: 'Thu', sales: 8000 },
    { name: 'Fri', sales: 15000 },
    { name: 'Sat', sales: 22000 },
    { name: 'Sun', sales: 18000 },
];
