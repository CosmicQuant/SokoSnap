import { useState, useEffect, useMemo, useRef, lazy, Suspense } from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { generateMockSecureOTP } from './utils/validation';
import { useCartStore, useAuthStore, useSellerStore, useProductStore } from './store';
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

const App = () => {
    // Store
    const { products, fetchProducts, loading: productsLoading } = useProductStore();

    // Initial Fetch
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Checkout Mode State (for shared checkout links)
    const [isCheckoutMode, setIsCheckoutMode] = useState(false);
    const [checkoutProductId, setCheckoutProductId] = useState<string | null>(null);
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
    const { createProduct } = useSellerStore();
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
            // Match patterns: /p/ID
            // Supports numeric or string IDs (Firebase IDs are mixed case strings)
            const pathMatch = url.match(/\/p\/([^\/?#]+)/);
            const queryMatch = url.match(/[?&]p=([^\/?#&]+)/);
            const hashMatch = url.match(/#\/p\/([^\/?#]+)/);

            const productId = pathMatch?.[1] || queryMatch?.[1] || hashMatch?.[1];

            console.log('[Checkout] Parsing URL:', url, 'Found ID:', productId);

            if (productId) {
                // Determine if ID exists in products or if we should trust it's loading
                const product = products.find(p => p.id === productId || String(p.id) === productId);

                if (product) {
                    setIsCheckoutMode(true);
                    setCheckoutProductId(product.id);
                    return true;
                } else if (productsLoading) {
                    // Assume loading
                    setIsCheckoutMode(true);
                    setCheckoutProductId(productId);
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
    }, [products, productsLoading]);

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
        if (!searchQuery) return products;
        return products.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.sellerName.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, products]);

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
                    onCreatePost={async (data, files) => {
                        const id = await createProduct({
                            name: data.name,
                            description: data.description,
                            price: data.price,
                            sellerId: user?.id || 'unknown',
                            sellerName: user?.shopName || user?.name || 'Seller',
                            sellerHandle: user?.handle || '@seller',
                            sellerAvatar: user?.avatar || '',
                            verified: user?.type === 'verified_merchant',
                            type: files[0]?.type.includes('video') ? 'video' : 'image',
                            status: 'active',
                            likes: '0',
                            comments: '0'
                        }, files);

                        fetchProducts();
                        return id;
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
                    products={products.filter(p => p.sellerName === currentSeller.name)}
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
        ? products.find(p => p.id === checkoutProductId || String(p.id) === checkoutProductId)
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
                {(isCheckoutMode && checkoutProduct ? [checkoutProduct] : products
                    .filter(p => {
                        if (activeTab === 'shop' && currentSeller) {
                            return p.sellerName === currentSeller.name;
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
            {showSuccessModal && (
                <div className="fixed inset-0 z-[10000] bg-white animate-in fade-in duration-300 slide-in-from-bottom-5">
                    <Suspense fallback={<PageLoader />}>
                        <SuccessView
                            otp={otp}
                            onReturn={handleSuccessModalClose}
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
                </div>
            )}

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
