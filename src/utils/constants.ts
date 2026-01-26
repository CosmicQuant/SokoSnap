/**
 * Application constants
 * Centralizes all magic values and configuration
 */

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
    delivered: { label: 'Delivered', color: 'green', icon: 'Package' },
    completed: { label: 'Completed', color: 'green', icon: 'CheckCircle' },
    cancelled: { label: 'Cancelled', color: 'red', icon: 'XCircle' },
    refunded: { label: 'Refunded', color: 'gray', icon: 'RefreshCw' },
} as const;
