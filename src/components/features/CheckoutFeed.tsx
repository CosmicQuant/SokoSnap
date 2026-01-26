/**
 * CheckoutFeed Component
 * TikTok-style product feed with checkout functionality
 * Properly styled with Tailwind CSS
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
    Heart,
    MessageCircle,
    ShoppingCart,
    CheckCircle2,
    ShieldCheck,
    Share2,
    User,
    Search,
    X,
    ArrowRight,
    Smartphone,
    MapPin,
    Play,
} from 'lucide-react';
import lipaNaMpesaLogo from '../../assets/lipa-na-mpesa.png';
import { useCartStore, useUIStore, useAuthStore } from '../../store';
import { useProductStore } from '../../store/productStore';
import { useOrderStore } from '../../store/orderStore';
import { APP_CONFIG } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import { checkoutSchema, getErrorMessages } from '../../utils/validators';
import type { Product, User as UserType } from '../../types';

interface CheckoutFeedProps {
    user: UserType | null;
    onBuyIntent: () => boolean;
    onProfileClick: () => void;
}

/**
 * Action Button Component
 */
const ActionBtn: React.FC<{
    icon: React.ReactNode;
    label?: string;
    onClick?: () => void;
    isActive?: boolean;
    ariaLabel: string;
    count?: number;
}> = ({ icon, label, onClick, isActive = false, ariaLabel, count }) => (
    <div className="feed-action-btn">
        <button
            onClick={onClick}
            aria-label={ariaLabel}
            aria-pressed={isActive}
            className={`relative ${isActive ? 'active' : ''}`}
        >
            {icon}
            {count !== undefined && count > 0 && (
                <div key={count} className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-red-600 border-2 border-black rounded-full flex items-center justify-center px-1 animate-pulse-once">
                    <span className="text-[10px] font-bold text-white leading-none">{count}</span>
                </div>
            )}
        </button>
        {label && <span>{label}</span>}
    </div>
);

/**
 * Feed Item Component
 */
const FeedItem: React.FC<{
    product: Product;
    onBuyNow: (product: Product) => void;
}> = ({ product, onBuyNow }) => {
    const { addItem, getItemQuantity } = useCartStore(); // Use getItemQuantity selector
    const itemQuantity = getItemQuantity ? getItemQuantity(product.id) : 0; // Guard clause if selector doesn't exist yet
    const inCart = itemQuantity > 0;
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleAddToCart = () => {
        addItem(product);
    };

    return (
        <div className="feed-item">
            {/* Media Layer */}
            <div className="feed-media">
                {product.type === 'video' ? (
                    <>
                        {/* Video Placeholder - showing image instead due to CORS */}
                        <div className="relative w-full h-full">
                            <img
                                src={`https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1080`}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                            {/* Play button overlay */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                                    <Play size={28} className="text-white ml-1" fill="white" />
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {!imageLoaded && !imageError && (
                            <div className="absolute inset-0 bg-slate-800 animate-pulse" />
                        )}
                        {imageError && (
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                                <div className="text-center text-white/50">
                                    <ShoppingCart size={48} className="mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">{product.name}</p>
                                </div>
                            </div>
                        )}
                        <img
                            src={product.mediaUrl}
                            alt={product.name}
                            className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                                }`}
                            onLoad={() => setImageLoaded(true)}
                            onError={() => setImageError(true)}
                        />
                    </>
                )}
                {/* Cinema Gradient Overlay */}
                <div className="feed-gradient" />
            </div>

            {/* Right Action Sidebar */}
            <div className="feed-actions">
                {/* Seller Avatar */}
                <div className="relative mb-2">
                    <div className="w-11 h-11 rounded-full border-2 border-white overflow-hidden p-0.5 bg-black shadow-lg">
                        <img
                            src={product.sellerAvatar}
                            alt={`${product.sellerName}`}
                            className="w-full h-full rounded-full bg-white"
                        />
                    </div>
                    {product.verified && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-emerald-500 rounded-full p-0.5 shadow-md">
                            <CheckCircle2 size={12} className="text-white" />
                        </div>
                    )}
                </div>

                <ActionBtn
                    icon={<Heart size={26} className="text-white" />}
                    label={product.likes}
                    ariaLabel={`Like, ${product.likes} likes`}
                />
                <ActionBtn
                    icon={<MessageCircle size={24} />}
                    label={product.comments}
                    ariaLabel={`Comments, ${product.comments}`}
                />
                <ActionBtn
                    icon={<ShoppingCart size={24} className={inCart ? "text-white" : ""} />}
                    label="Cart"
                    onClick={handleAddToCart}
                    isActive={inCart}
                    count={itemQuantity}
                    ariaLabel={inCart ? `In cart: ${itemQuantity}` : 'Add to cart'}
                />
                <ActionBtn
                    icon={<Share2 size={22} />}
                    label="Share"
                    ariaLabel="Share product"
                />
            </div>

            {/* Bottom Information Overlay */}
            <div className="feed-info">
                {/* Seller Tag */}
                <div className="feed-seller-tag">
                    <span className="text-sm font-bold text-white drop-shadow-lg">
                        {product.sellerHandle}
                    </span>
                    {product.verified && (
                        <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-white border border-white/10">
                            Verified
                        </span>
                    )}
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                    <p className={`text-white/90 text-sm font-medium leading-relaxed drop-shadow-lg transition-all duration-200 ${isExpanded ? '' : 'line-clamp-3'}`}>
                        {product.description}{' '}
                        <span className="font-bold text-white">#SokoSnap</span>
                    </p>
                    {product.description.length > 80 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                            className="text-white/80 text-xs font-bold mt-0.5 mb-1 hover:text-white transition-colors cursor-pointer"
                        >
                            {isExpanded ? 'less' : 'more'}
                        </button>
                    )}
                    <h2 className="text-lg font-bold text-white drop-shadow-lg leading-tight">
                        {product.name}
                    </h2>
                </div>

                {/* Commerce Bar - New Layout */}
                {/* Commerce Bar - Professional Layout */}
                <div className="commerce-section">
                    <button
                        onClick={() => onBuyNow(product)}
                        className="action-btn"
                        aria-label={`Buy Now ${product.name}`}
                    >
                        {/* Primary Row: Logo + BUY + Price */}
                        <div className="action-primary-row">
                            <img
                                src={lipaNaMpesaLogo}
                                alt="Lipa na M-Pesa"
                                className="action-mpesa-logo"
                            />
                            <span className="action-text">BUY</span>
                            <span className="action-price">{formatCurrency(product.price)}</span>
                        </div>

                        {/* Secondary Row: Trust Signals */}
                        <div className="action-secondary-row">
                            <span>Secure Payment Hold</span>
                            <span className="h-[2px] w-[2px] rounded-full bg-white/50 mx-1"></span>
                            <div className="flex items-center gap-1">
                                <ShieldCheck size={9} className="text-[#4CAF50]" />
                                <span className="text-[#4CAF50] font-bold">MONEY-BACK BUYER PROTECTION</span>
                            </div>
                            <span className="h-[2px] w-[2px] rounded-full bg-white/50 mx-1"></span>
                            <span>Verify on Arrival</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

/**
 * Checkout Bottom Sheet
 */
const CheckoutSheet: React.FC<{
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}> = ({ product, isOpen, onClose, onSuccess }) => {
    const [phone, setPhone] = useState('0712 345 678');
    const [location, setLocation] = useState('Westlands, Nairobi');
    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // "Absorb" Animation Trigger
    const [shouldAnimateAbsorb, setShouldAnimateAbsorb] = useState(false);
    const isFormFilled = phone.length >= 10 && location.length >= 3;

    const { createOrder } = useOrderStore();
    const { user } = useAuthStore();

    // Trigger animation when form BECOMES filled
    useEffect(() => {
        if (isFormFilled) {
            setShouldAnimateAbsorb(true);
            const timer = setTimeout(() => setShouldAnimateAbsorb(false), 500);
            return () => clearTimeout(timer);
        }
    }, [isFormFilled]);

    if (!isOpen || !product) return null;

    const deliveryFee = APP_CONFIG.deliveryFee;
    const total = product.price + deliveryFee;

    const handleSubmit = async () => {
        const result = checkoutSchema.safeParse({ phone, location });
        if (!result.success) {
            setErrors(getErrorMessages(result.error));
            return;
        }

        setErrors({});
        setIsProcessing(true);

        try {
            await createOrder({
                items: [{ product, quantity: 1, addedAt: new Date() }],
                customerId: user?.id || 'guest',
                customerPhone: phone,
                sellerId: product.sellerId,
                amount: product.price,
                deliveryFee: deliveryFee,
                total: total,
                status: 'pending',
                deliveryLocation: location
            });
            setIsProcessing(false);
            onClose();
            onSuccess();
        } catch (err) {
            console.error(err);
            setIsProcessing(false);
            alert("Failed to process order. Please try again.");
        }
    };

    return (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
            {/* Backdrop - transparent, no blur */}
            <div
                className="absolute inset-0 bg-black/30 animate-fade-in"
                onClick={onClose}
            />

            {/* Sheet - transparent and compact */}
            <div className="bg-black/80 backdrop-blur-xl border-t border-white/10 p-5 pb-8 rounded-t-3xl text-white transition-all duration-300 w-full md:max-w-[420px] mx-auto animate-in slide-in-from-bottom">
                {/* Handle */}
                <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-4" />

                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white/70 hover:text-white transition-colors"
                    aria-label="Close"
                >
                    <X size={18} />
                </button>

                {/* Compact Form */}
                <div className="space-y-3 mb-6">
                    <div className="bg-white/5 border border-white/10 rounded-2xl flex items-center p-1 focus-within:bg-black/40 focus-within:border-emerald-500/50 transition-colors">
                        <div className="w-10 h-10 flex items-center justify-center text-emerald-400">
                            <Smartphone size={18} />
                        </div>
                        <div className="flex-1 pr-3">
                            <label className="block text-[8px] font-bold text-white/40 uppercase tracking-widest mb-0.5">
                                M-Pesa Number
                            </label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full bg-transparent font-bold text-sm text-white outline-none placeholder:text-white/20"
                                placeholder="07XX XXX XXX"
                            />
                            {errors.phone && (
                                <p className="text-[10px] text-red-400 mt-0.5">{errors.phone}</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl flex items-center p-1 focus-within:bg-black/40 focus-within:border-emerald-500/50 transition-colors">
                        <div className="w-10 h-10 flex items-center justify-center text-blue-400">
                            <MapPin size={18} />
                        </div>
                        <div className="flex-1 pr-3">
                            <label className="block text-[8px] font-bold text-white/40 uppercase tracking-widest mb-0.5">
                                Delivery Location
                            </label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full bg-transparent font-bold text-sm text-white outline-none placeholder:text-white/20"
                                placeholder="Search or use GPS..."
                            />
                            {errors.location && (
                                <p className="text-[10px] text-red-400 mt-0.5">{errors.location}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Pay Button - "Golden Charge" Animation */}
                <button
                    onClick={handleSubmit}
                    disabled={isProcessing || !isFormFilled}
                    className={`
                        w-full p-4 rounded-xl font-bold flex items-center justify-between transition-all duration-300 relative overflow-hidden group
                        ${isFormFilled
                            ? 'bg-yellow-400 text-slate-900 shadow-lg shadow-yellow-400/20 hover:bg-yellow-300'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                        }
                        ${shouldAnimateAbsorb ? 'animate-absorb' : 'active:scale-[0.98]'}
                    `}
                >
                    {isProcessing ? (
                        <div className="w-full flex justify-center">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col items-start leading-none relative z-10">
                                <span className={`text-[9px] font-black uppercase tracking-widest mb-1 transition-opacity ${isFormFilled ? 'opacity-80' : 'opacity-50'}`}>
                                    {isFormFilled ? 'Confirm Payment' : 'Enter Details to Pay'}
                                </span>
                                <span className="text-lg font-black">{formatCurrency(total)}</span>
                            </div>

                            <div className={`p-2 rounded-lg relative z-10 transition-all ${isFormFilled ? 'bg-slate-900/10 text-slate-900' : 'bg-white/5 text-slate-600'}`}>
                                <ArrowRight size={20} className={`transform transition-transform ${isFormFilled ? 'group-hover:translate-x-1' : ''}`} />
                            </div>

                            {/* Golden Sheen Effect (Only when filled) */}
                            {isFormFilled && (
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full h-full skew-x-[-12deg] animate-gold-sheen pointer-events-none mix-blend-overlay" />
                            )}
                        </>
                    )}
                </button>

                {/* Trust Badge - Kenyan friendly */}
                <div className="flex items-center justify-center gap-1.5 mt-4 text-white/30">
                    <ShieldCheck size={10} />
                    <span className="text-[9px] font-bold tracking-wide uppercase">
                        TumaFast Escrow Protected
                    </span>
                </div>
            </div>
        </div>
    );
};

/**
 * Main CheckoutFeed Component
 */
export const CheckoutFeed: React.FC<CheckoutFeedProps> = ({
    user: _user,
    onBuyIntent,
    onProfileClick,
}) => {
    const [activeTab, setActiveTab] = useState<'foryou' | 'following'>('foryou');
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [activeProduct, setActiveProduct] = useState<Product | null>(null);

    const { items: cartItems } = useCartStore();
    const { products, fetchProducts, loading } = useProductStore();
    const navigateTo = useUIStore((state) => state.navigateTo);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleBuyNow = useCallback(
        (product: Product) => {
            if (onBuyIntent()) {
                setActiveProduct(product);
                setIsCheckoutOpen(true);
            }
        },
        [onBuyIntent]
    );

    const handleCheckoutSuccess = useCallback(() => {
        navigateTo('success');
    }, [navigateTo]);

    // In a real app, 'following' would filter by sellers the user follows
    // For now, we just show all products in both, or slice them differently
    const followingFeed = products;
    const forYouFeed = products;

    if (loading && products.length === 0) {
        return (
            <div className="h-full w-full bg-black flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="h-full w-full bg-black relative flex flex-col overflow-hidden">
            {/* Header */}
            <header className="feed-header">
                {/* Profile Button */}
                <button
                    onClick={onProfileClick}
                    className="header-btn"
                    aria-label="Profile"
                >
                    <User size={22} />
                </button>

                {/* Tab Switcher */}
                <nav className="header-tabs" role="tablist">
                    <button
                        role="tab"
                        aria-selected={activeTab === 'following'}
                        onClick={() => setActiveTab('following')}
                        className={`header-tab ${activeTab === 'following' ? 'active' : ''}`}
                    >
                        Following
                    </button>
                    <button
                        role="tab"
                        aria-selected={activeTab === 'foryou'}
                        onClick={() => setActiveTab('foryou')}
                        className={`header-tab ${activeTab === 'foryou' ? 'active' : ''}`}
                    >
                        For You
                    </button>
                </nav>

                {/* Right Actions */}
                <div className="header-right-actions">
                    <button
                        onClick={() => navigateTo('cart')}
                        className="header-btn relative"
                        aria-label={`Cart, ${cartItems.length} items`}
                    >
                        <ShoppingCart size={18} />
                        {cartItems.length > 0 && (
                            <span className="cart-badge">
                                {cartItems.length}
                            </span>
                        )}
                    </button>
                    <button className="header-btn" aria-label="Search">
                        <Search size={18} />
                    </button>
                </div>
            </header>

            {/* Feed */}
            <main className="flex-1 overflow-y-scroll snap-y snap-mandatory no-scrollbar">
                {(activeTab === 'following' ? followingFeed : forYouFeed).map((product) => (
                    <div key={product.id} className="h-full w-full snap-start">
                        <FeedItem product={product} onBuyNow={handleBuyNow} />
                    </div>
                ))}
            </main>

            {/* Checkout Sheet */}
            <CheckoutSheet
                product={activeProduct}
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                onSuccess={handleCheckoutSuccess}
            />
        </div>
    );
};

export default CheckoutFeed;
