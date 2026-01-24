import { useState, useEffect, useMemo, useRef, lazy, Suspense } from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { generateMockSecureOTP } from './utils/validation';
import { useCartStore, useAuthStore, useSellerStore } from './store';
import { useNetworkStatus } from './hooks';
import { FeedItem } from '@components/feed/FeedItem';
import { TopNav } from './components/layout/TopNav';
import { CheckoutTopNav } from './components/layout/CheckoutTopNav';
import { NoInternetModal } from './components/common/NoInternetModal';

// Lazy Load Views for Code Splitting
const CartView = lazy(() => import('./components/cart/CartView').then(module => ({ default: module.CartView })));
const ProfileView = lazy(() => import('./components/profile/ProfileView').then(module => ({ default: module.ProfileView })));
const SellerProfileView = lazy(() => import('./components/profile/SellerProfileView').then(module => ({ default: module.SellerProfileView })));
const SearchOverlay = lazy(() => import('./components/search/SearchOverlay').then(module => ({ default: module.SearchOverlay })));
const SuccessView = lazy(() => import('./components/common/SuccessView').then(module => ({ default: module.SuccessView })));
const SuccessModal = lazy(() => import('./components/common/SuccessModal').then(module => ({ default: module.SuccessModal })));
const AuthModal = lazy(() => import('./components/features/AuthModal').then(module => ({ default: module.AuthModal })));
const CreatePostView = lazy(() => import('./components/seller/CreatePostView').then(module => ({ default: module.CreatePostView })));
const OrderHistoryView = lazy(() => import('./components/profile/OrderHistoryView').then(module => ({ default: module.OrderHistoryView })));

import { App as CapacitorApp } from '@capacitor/app';

// Loading Fallback
const PageLoader = () => (
    <div className="h-full w-full flex items-center justify-center bg-white z-50">
        <Loader2 className="animate-spin text-yellow-500" size={32} />
    </div>
);

// Unified Data Structure
const PRODUCTS = [
    {
        id: 1,
        type: 'video',
        seller: 'Eastleigh Kicks',
        handle: '@eastleigh_kicks',
        name: 'Air Jordan 1 "Uni Blue"',
        price: 4500,
        media: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-showing-sneakers-34537-large.mp4',
        slides: [
            { type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-showing-sneakers-34537-large.mp4' },
            { type: 'image', url: 'https://images.unsplash.com/photo-1628253747716-0c4f5c90fdda?auto=format&fit=crop&q=80&w=1080' },
            { type: 'image', url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=1080' }
        ],
        description: "Premium quality. Best sellers in Nairobi.",
        likes: '12.4k',
        allowCOD: true
    },
    {
        id: 2,
        type: 'image',
        seller: 'Tech Oasis',
        handle: '@techoasis_ke',
        name: 'iPhone 15 Pro Max',
        price: 155000,
        media: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=1080',
        slides: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=1080' },
            { type: 'image', url: 'https://images.unsplash.com/photo-1695048180494-1b32e043324d?auto=format&fit=crop&q=80&w=1080' }
        ],
        description: "Brand new, Titanium Blue. Escrow protected.",
        likes: '8.2k',
        allowCOD: true
    },
    {
        id: 3,
        type: 'image',
        seller: 'Glamour Trends',
        handle: '@glamour_ke',
        name: 'Gucci Marmont Handbag',
        price: 12500,
        media: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=1080',
        description: "Authentic leather. Comes with dust bag.",
        likes: '5.1k',
        allowCOD: true
    },
    {
        id: 4,
        type: 'video',
        seller: 'Nanny Banana',
        handle: '@nano_banana',
        name: 'Summer Flora Dress',
        price: 3200,
        media: 'https://assets.mixkit.co/videos/preview/mixkit-woman-turning-in-slow-motion-with-a-floral-dress-39327-large.mp4',
        slides: [
            { type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-turning-in-slow-motion-with-a-floral-dress-39327-large.mp4' },
            { type: 'image', url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=1080' }
        ],
        description: "Lightweight summer vibes. Available in all sizes.",
        likes: '15.6k',
        allowCOD: true
    },
    {
        id: 5,
        type: 'video',
        seller: 'Nanny Banana',
        handle: '@nano_banana',
        name: 'Chic Beige Blazer',
        price: 5500,
        media: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-posing-with-a-blazer-34539-large.mp4',
        description: "Perfect for the office or a casual brunch.",
        likes: '9.3k',
        allowCOD: true
    },
    {
        id: 6,
        type: 'image',
        seller: 'Nanny Banana',
        handle: '@nano_banana',
        name: 'Velvet Evening Gown',
        price: 8900,
        media: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=1080',
        description: "Stunning velvet texture. Create an impression.",
        likes: '11.8k',
        allowCOD: true
    }
];

const App = () => {
    // Checkout Mode State (for shared checkout links)
    const [isCheckoutMode, setIsCheckoutMode] = useState(false);
    const [checkoutProductId, setCheckoutProductId] = useState<number | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Ref to track checkout mode for async callbacks
    const isCheckoutModeRef = useRef(isCheckoutMode);
    useEffect(() => {
        isCheckoutModeRef.current = isCheckoutMode;
    }, [isCheckoutMode]);

    // Navigation State
    const [activeTab, setActiveTab] = useState('shop');
    const [view, setView] = useState<'feed' | 'success' | 'cart' | 'profile' | 'seller-profile' | 'order-history' | 'create-post'>('feed');
    const [currentSeller, setCurrentSeller] = useState<{ name: string, handle: string } | undefined>(undefined);

    // Seller State
    const { user, openAuthModal } = useAuthStore();
    const { addPost } = useSellerStore();
    const isSeller = user?.type === 'verified_merchant';

    // Network Status
    const isOnline = useNetworkStatus();
    const [isOfflineDismissed, setIsOfflineDismissed] = useState(false);

    // Reset dismissed state when online comes back
    useEffect(() => {
        if (isOnline) {
            setIsOfflineDismissed(false);
        }
    }, [isOnline]);

    // Feature State
    const [showTrustModal, setShowTrustModal] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Parse URL for checkout mode on mount and handle deep links
    useEffect(() => {
        const parseCheckoutUrl = (url: string) => {
            // Match patterns: /p/123, ?p=123, or #/p/123 (hash routing)
            const pathMatch = url.match(/\/p\/(\d+)/);
            const queryMatch = url.match(/[?&]p=(\d+)/);
            const hashMatch = url.match(/#\/p\/(\d+)/);

            const productId = pathMatch?.[1] || queryMatch?.[1] || hashMatch?.[1];

            console.log('[Checkout] Parsing URL:', url, 'Found ID:', productId);

            if (productId) {
                const id = parseInt(productId, 10);
                const product = PRODUCTS.find(p => p.id === id);
                console.log('[Checkout] Product found:', !!product, 'Setting checkout mode');
                if (product) {
                    setIsCheckoutMode(true);
                    setCheckoutProductId(id);
                    return true;
                }
            }
            return false;
        };

        // Check initial URL
        parseCheckoutUrl(window.location.href);

        // Listen for deep links on native (Capacitor)
        const appUrlListener = CapacitorApp.addListener('appUrlOpen', (event) => {
            parseCheckoutUrl(event.url);
        });

        // Listen for popstate (browser back/forward)
        const handlePopState = () => {
            if (!parseCheckoutUrl(window.location.href)) {
                // If no checkout URL, exit checkout mode
                setIsCheckoutMode(false);
                setCheckoutProductId(null);
            }
        };
        window.addEventListener('popstate', handlePopState);

        return () => {
            appUrlListener.then(h => h.remove());
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    // Hardware Back Button Handling
    useEffect(() => {
        const backListener = CapacitorApp.addListener('backButton', () => {
            if (showSuccessModal) {
                // Close success modal first
                handleSuccessModalClose();
            } else if (showSearch) {
                setShowSearch(false);
            } else if (isCheckoutMode) {
                // In checkout mode, back button exits checkout mode
                setIsCheckoutMode(false);
                setCheckoutProductId(null);
                // Clear URL
                window.history.replaceState({}, '', '/');
            } else if (view !== 'feed') {
                // Return to feed from any other view
                setView('feed');
                setCurrentSeller(undefined);
            } else {
                // Determine exit behavior: could minimize or exit
                CapacitorApp.exitApp();
            }
        });

        return () => {
            backListener.then((h: any) => h.remove());
        };
    }, [view, showSearch]);

    // Data State
    const { items: cartItems, addItem: addToCart, clearCart, updateQuantity, removeItem } = useCartStore();
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const cartTotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const [userData, setUserData] = useState({
        phone: '',
        location: '',
        name: 'Guest User'
    });

    // Transaction State
    const [otp, setOtp] = useState<number | null>(null);
    const [deliveryQuote, setDeliveryQuote] = useState<number | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Effect: Delivery Quote Simulation
    useEffect(() => {
        if (userData.location.length > 3) {
            setDeliveryQuote(150);
        } else {
            setDeliveryQuote(null);
        }
    }, [userData.location]);

    // Actions
    const handleAddToCart = (product: any) => {
        addToCart(product, 1);
    };

    const handleRemoveFromCart = (product: any) => {
        // Decrease quantity by 1, or remove if 0 (handled by store)
        const currentItem = cartItems.find(i => i.product.id === product.id);
        if (currentItem) {
            if (currentItem.quantity > 1) {
                updateQuantity(product.id, currentItem.quantity - 1);
            } else {
                removeItem(product.id);
            }
        }
    };

    const handleCheckout = async () => {
        // Use ref to get current value (avoids stale closure)
        const inCheckoutMode = isCheckoutModeRef.current;
        console.log('[Checkout] handleCheckout called, isCheckoutMode:', inCheckoutMode);
        setIsProcessing(true);

        // Simulate secure OTP generation from server
        const code = await generateMockSecureOTP();
        setOtp(code);

        setIsProcessing(false);
        clearCart();

        // In checkout mode, show modal instead of navigating to success page
        console.log('[Checkout] Showing success, isCheckoutMode:', inCheckoutMode);
        if (inCheckoutMode) {
            console.log('[Checkout] Setting showSuccessModal to true');
            setShowSuccessModal(true);
        } else {
            setView('success');
        }
    };

    // Handle success modal close - exit checkout mode and show normal feed
    const handleSuccessModalClose = () => {
        setShowSuccessModal(false);
        setIsCheckoutMode(false);
        setCheckoutProductId(null);
        // Clear URL to show normal feed
        window.history.replaceState({}, '', '/');
    };
    const filteredProducts = useMemo(() => {
        if (!searchQuery) return PRODUCTS;
        return PRODUCTS.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.seller.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    // View Routing
    if (showSearch) {
        return (
            <Suspense fallback={<PageLoader />}>
                <SearchOverlay
                    onClose={() => setShowSearch(false)}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    results={filteredProducts}
                    onResultClick={() => {
                        setShowSearch(false);
                        setView('feed');
                    }}
                />
            </Suspense>
        );
    }

    if (view === 'cart') {
        return (
            <Suspense fallback={<PageLoader />}>
                <CartView
                    onBack={() => setView('feed')}
                    userData={userData}
                    setUserData={setUserData}
                    onCheckout={handleCheckout}
                />
            </Suspense>
        );
    }

    if (view === 'profile') {
        return (
            <Suspense fallback={<PageLoader />}>
                <ProfileView
                    onBack={() => setView('feed')}
                    onOrderHistory={() => setView('order-history')}
                    onCreatePost={() => setView('create-post')}
                />
            </Suspense>
        );
    }

    if (view === 'order-history') {
        return (
            <Suspense fallback={<PageLoader />}>
                <OrderHistoryView
                    onBack={() => setView('profile')}
                />
            </Suspense>
        );
    }

    if (view === 'create-post') {
        return (
            <Suspense fallback={<PageLoader />}>
                <CreatePostView
                    onBack={() => setView('feed')}
                    onPostCreated={(post) => {
                        addPost({
                            id: post.id,
                            name: post.name,
                            description: post.description,
                            price: post.price,
                            checkoutLink: post.checkoutLink,
                            createdAt: post.createdAt,
                            thumbnailUrl: post.media[0]?.preview,
                        });
                    }}
                />
            </Suspense>
        );
    }

    if (view === 'success') {
        return (
            <Suspense fallback={<PageLoader />}>
                <SuccessView
                    otp={otp}
                    onReturn={() => setView('feed')}
                    onLogin={() => {
                        // Keep current view as success, but open the modal
                        openAuthModal('login');
                    }}
                    onViewOrders={() => setView('order-history')}
                    isLoggedIn={!!user}
                />
                {/* Ensure AuthModal is mounted if it is triggered from here */}
                <AuthModal />
            </Suspense>
        );
    }

    if (view === 'seller-profile' && currentSeller) {
        return (
            <Suspense fallback={<PageLoader />}>
                <SellerProfileView
                    seller={currentSeller}
                    onBack={() => {
                        setView('feed');
                        setCurrentSeller(undefined);
                    }}
                    products={PRODUCTS.filter(p => p.seller === currentSeller.name)}
                    onSelectPost={() => {
                        setActiveTab('shop');
                        setView('feed');
                    }}
                />
            </Suspense>
        );
    }

    // Get checkout product if in checkout mode
    const checkoutProduct = isCheckoutMode && checkoutProductId
        ? PRODUCTS.find(p => p.id === checkoutProductId)
        : null;

    // Default: Feed View
    return (
        <div className="h-[100dvh] w-full bg-black relative flex flex-col overflow-hidden select-none">

            {/* Conditional TopNav based on checkout mode */}
            {isCheckoutMode ? (
                <CheckoutTopNav />
            ) : (
                <TopNav
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    cartCount={cartCount}
                    cartTotal={cartTotal}
                    onProfileClick={() => setView('profile')}
                    onBack={currentSeller ? () => {
                        setView('seller-profile');
                    } : undefined}
                    onSearchClick={() => setShowSearch(true)}
                    onCartClick={() => setView('cart')}
                    onCreateClick={() => setView('create-post')}
                    currentSeller={currentSeller}
                    isSeller={isSeller}
                />
            )}

            {/* Feed List - Single product in checkout mode, full feed otherwise */}
            <div className={`flex-1 ${isCheckoutMode ? 'overflow-hidden' : 'overflow-y-scroll snap-y snap-mandatory'} hide-scrollbar`}>
                {/* 
                    Feed Logic:
                    1. In checkout mode: Only show the single checkout product
                    2. If activeTab is 'shop' AND we have a currentSeller, we only show products from that seller.
                    3. If activeTab is 'foryou', we show everything (mixed).
                */}
                {(isCheckoutMode && checkoutProduct ? [checkoutProduct] : PRODUCTS
                    .filter(p => {
                        if (activeTab === 'shop' && currentSeller) {
                            return p.seller === currentSeller.name;
                        }
                        return true;
                    }))
                    .map(p => (
                        <FeedItem
                            key={p.id}
                            product={p}
                            cart={cartItems}
                            onAddToCart={handleAddToCart}
                            onRemoveFromCart={handleRemoveFromCart}
                            userData={userData}
                            setUserData={setUserData}
                            onCheckout={handleCheckout}
                            isProcessing={isProcessing}
                            deliveryQuote={deliveryQuote}
                            onView={isCheckoutMode ? undefined : (seller) => {
                                setCurrentSeller(seller);
                                setView('seller-profile');
                            }}
                            hideActions={isCheckoutMode}
                            disableScroll={isCheckoutMode}
                        />
                    ))}
            </div>

            {/* Success Modal (for checkout mode) */}
            <Suspense fallback={null}>
                <SuccessModal
                    isOpen={showSuccessModal}
                    otp={otp}
                    onClose={handleSuccessModalClose}
                    onLogin={() => {
                        setShowSuccessModal(false);
                        openAuthModal('login');
                    }}
                    onViewOrders={() => {
                        setShowSuccessModal(false);
                        setView('order-history');
                    }}
                    isLoggedIn={!!user}
                />
            </Suspense>

            {/* Auth Modal (Global) - Render this outside of views to ensure it works everywhere */}
            <Suspense fallback={null}>
                <AuthModal />
            </Suspense>

            {/* Offline Modal */}
            <NoInternetModal
                isOpen={!isOnline && !isOfflineDismissed}
                onClose={() => setIsOfflineDismissed(true)}
            />

            {/* Trust/Info Modal */}
            {showTrustModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm px-10">
                    <div className="text-center space-y-6 animate-in zoom-in-95 duration-300">
                        <ShieldCheck size={48} className="text-blue-500 mx-auto" />
                        <h3 className="text-xl font-black italic uppercase tracking-tighter text-white leading-none">Security First</h3>
                        <p className="text-white/60 text-xs font-medium leading-relaxed">Your funds are held in the TumaFast Secure Vault. The seller only receives payment once you approve the delivery.</p>
                        <button onClick={() => setShowTrustModal(false)} className="px-8 py-3 border border-white/20 text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
                            CLOSE
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
