/**
 * Core type definitions for SokoSnap
 * Single source of truth for all TypeScript interfaces
 */

// ============================================
// User & Authentication Types
// ============================================

export type UserType = 'guest' | 'verified_buyer' | 'verified_merchant';

export interface User {
    id: string;
    name: string;
    handle?: string;
    phone: string;
    email?: string;
    type: UserType;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

// ============================================
// Product Types
// ============================================

export type MediaType = 'video' | 'image';

export interface Product {
    id: string;
    sellerId: string;
    sellerName: string;
    sellerHandle: string;
    sellerAvatar: string;
    verified: boolean;
    name: string;
    price: number;
    currency: string;
    type: MediaType;
    mediaUrl: string;
    description: string;
    likes: string;
    comments: string;
    isHighValue?: boolean;
    createdAt?: Date;
    stock?: number;
    category?: string;
    tags?: string[];
}

export interface ProductFilters {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    verified?: boolean;
    sortBy?: 'price' | 'likes' | 'recent';
    sortOrder?: 'asc' | 'desc';
}

// ============================================
// Cart Types
// ============================================

export interface CartItem {
    product: Product;
    quantity: number;
    addedAt: Date;
}

export interface Cart {
    items: CartItem[];
    total: number;
    itemCount: number;
}

// ============================================
// Order Types
// ============================================

export type OrderStatus =
    | 'pending'
    | 'processing'
    | 'escrow_held'
    | 'in_transit'
    | 'delivered'
    | 'completed'
    | 'cancelled'
    | 'refunded';

export interface Order {
    id: string;
    items: CartItem[];
    customerId: string;
    customerPhone: string;
    sellerId: string;
    amount: number;
    deliveryFee: number;
    total: number;
    status: OrderStatus;
    escrowId?: string;
    riderId?: string;
    riderName?: string;
    deliveryLocation: string;
    deliveryOtp?: string;
    createdAt: Date;
    updatedAt: Date;
}

// ============================================
// Seller Types
// ============================================

export interface SellerStats {
    totalSales: number;
    orders: number;
    pendingPayout: number;
    views: number;
    conversionRate?: number;
}

export interface SmartLink {
    id: string;
    sellerId: string;
    productId: string;
    url: string;
    shortUrl: string;
    clicks: number;
    conversions: number;
    revenue: number;
    createdAt: Date;
}

// ============================================
// Lead Types
// ============================================

export type Platform = 'TikTok' | 'Instagram' | 'Twitter' | 'Facebook';
export type LeadStatus = 'New' | 'Contacted' | 'Onboarded' | 'Rejected';

export interface Lead {
    id: string;
    platform: Platform;
    handle: string;
    productHint: string;
    frictionScore: number;
    lastPostTime: string;
    status: LeadStatus;
    contactedAt?: Date;
}

// ============================================
// Payment Types
// ============================================

export type PaymentMethod = 'mpesa' | 'card' | 'bank_transfer';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Payment {
    id: string;
    orderId: string;
    method: PaymentMethod;
    amount: number;
    status: PaymentStatus;
    transactionId?: string;
    createdAt: Date;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
    };
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
    };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// ============================================
// UI State Types
// ============================================

export type ViewState = 'feed' | 'seller' | 'profile' | 'cart' | 'checkout' | 'success';
export type FeedTab = 'foryou' | 'following' | 'shop';

export interface UIState {
    currentView: ViewState;
    activeTab: FeedTab;
    isCheckoutOpen: boolean;
    isAuthModalOpen: boolean;
    isLoading: boolean;
}

// ============================================
// Form Types
// ============================================

export interface CheckoutFormData {
    phone: string;
    location: string;
    notes?: string;
}

export interface LoginFormData {
    phone: string;
}

export interface SellerRegistrationData {
    businessName: string;
    phone: string;
    email: string;
    category: string;
    socialLinks?: string[];
}

// ============================================
// Component Prop Types
// ============================================

export interface BaseComponentProps {
    className?: string;
    children?: React.ReactNode;
}

export interface ModalProps extends BaseComponentProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
}

export interface ButtonProps extends BaseComponentProps {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    disabled?: boolean;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    'aria-label'?: string;
}

// ============================================
// Chart Data Types
// ============================================

export interface ChartDataPoint {
    name: string;
    value: number;
    [key: string]: string | number;
}

export interface SalesChartData {
    name: string;
    sales: number;
    orders?: number;
}
