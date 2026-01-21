/**
 * CheckoutFeed Component
 * TikTok-style product feed with checkout functionality
 * Properly styled with Tailwind CSS
 */

import React, { useState, useCallback } from 'react';
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
import { useCartStore, useUIStore } from '../../store';
import { MOCK_PRODUCTS, APP_CONFIG } from '../../utils/constants';
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
}> = ({ icon, label, onClick, isActive = false, ariaLabel }) => (
    <div className="feed-action-btn">
        <button
            onClick={onClick}
            aria-label={ariaLabel}
            aria-pressed={isActive}
            className={isActive ? 'active' : ''}
        >
            {icon}
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
    const { addItem, isInCart } = useCartStore();
    const inCart = isInCart(product.id);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleAddToCart = () => {
        if (!inCart) {
            addItem(product);
        }
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
                    icon={inCart ? <CheckCircle2 size={24} /> : <ShoppingCart size={24} />}
                    label={inCart ? 'Added' : 'Cart'}
                    onClick={handleAddToCart}
                    isActive={inCart}
                    ariaLabel={inCart ? 'In cart' : 'Add to cart'}
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
        await new Promise((resolve) => setTimeout(resolve, 2500));
        setIsProcessing(false);
        onClose();
        onSuccess();
    };

    return (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
            {/* Backdrop - transparent, no blur */}
            <div
                className="absolute inset-0 bg-black/30 animate-fade-in"
                onClick={onClose}
            />

            {/* Sheet - transparent and compact */}
            <div className="checkout-sheet">
                {/* Handle */}
                <div className="w-8 h-1 bg-white/40 rounded-full mx-auto mb-3" />

                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 p-1.5 bg-white/20 rounded-full text-white/70 hover:bg-white/30"
                    aria-label="Close"
                >
                    <X size={14} />
                </button>

                {/* Compact Form */}
                <div className="space-y-2 mb-3">
                    <div className="checkout-input-group">
                        <div className="checkout-input-icon">
                            <Smartphone size={16} />
                        </div>
                        <div className="flex-1">
                            <label className="block text-[8px] font-bold text-white/50 uppercase tracking-wide">
                                M-Pesa Nambari
                            </label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full bg-transparent font-bold text-sm text-white outline-none placeholder:text-white/30"
                            />
                            {errors.phone && (
                                <p className="text-[10px] text-red-400 mt-0.5">{errors.phone}</p>
                            )}
                        </div>
                    </div>

                    <div className="checkout-input-group">
                        <div className="checkout-input-icon">
                            <MapPin size={16} />
                        </div>
                        <div className="flex-1">
                            <label className="block text-[8px] font-bold text-white/50 uppercase tracking-wide">
                                Mahali
                            </label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full bg-transparent font-bold text-sm text-white outline-none placeholder:text-white/30"
                            />
                            {errors.location && (
                                <p className="text-[10px] text-red-400 mt-0.5">{errors.location}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Pay Button */}
                <button
                    onClick={handleSubmit}
                    disabled={isProcessing}
                    className="checkout-pay-btn"
                >
                    {isProcessing ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <span>Lipa {formatCurrency(total)}</span>
                            <ArrowRight size={18} />
                        </>
                    )}
                </button>

                {/* Trust Badge - Kenyan friendly */}
                <div className="flex items-center justify-center gap-1.5 mt-2 text-white/50">
                    <ShieldCheck size={10} />
                    <span className="text-[9px] font-medium">
                        Pesa yako iko salama • We pay seller when you're satisfied
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
    const navigateTo = useUIStore((state) => state.navigateTo);

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

    const followingFeed = MOCK_PRODUCTS.filter((p) =>
        ['prod_2', 'prod_4', 'prod_6'].includes(p.id)
    );
    const forYouFeed = MOCK_PRODUCTS;

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
