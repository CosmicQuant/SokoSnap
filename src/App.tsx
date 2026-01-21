import { useState, useEffect, useMemo } from 'react';
import { ShieldCheck } from 'lucide-react';
import { generateMockSecureOTP } from './utils/validation';
import { FeedItem } from '@components/feed/FeedItem';
import { TopNav } from './components/layout/TopNav';
import { CartView } from './components/cart/CartView';
import { ProfileView } from './components/profile/ProfileView';
import { SearchOverlay } from './components/search/SearchOverlay';
import { SuccessView } from './components/common/SuccessView';

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
        description: "Premium quality. Best sellers in Nairobi.",
        likes: '12.4k'
    },
    {
        id: 2,
        type: 'image',
        seller: 'Tech Oasis',
        handle: '@techoasis_ke',
        name: 'iPhone 15 Pro Max',
        price: 155000,
        media: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=1080',
        description: "Brand new, Titanium Blue. Escrow protected.",
        likes: '8.2k'
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
        likes: '5.1k'
    }
];

const App = () => {
    // Navigation State
    const [activeTab, setActiveTab] = useState('shop');
    const [view, setView] = useState<'feed' | 'success' | 'cart' | 'profile'>('feed');

    // Feature State
    const [showTrustModal, setShowTrustModal] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Data State
    const [cart, setCart] = useState<any[]>([]);
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
        if (!cart.find(item => item.id === product.id)) {
            setCart([...cart, product]);
        }
    };

    const removeFromCart = (productId: number) => {
        setCart(cart.filter(item => item.id !== productId));
    };

    const handleCheckout = async () => {
        setIsProcessing(true);

        // Simulate secure OTP generation from server
        const code = await generateMockSecureOTP();
        setOtp(code);

        setIsProcessing(false);
        setCart([]);
        setView('success');
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
        );
    }

    if (view === 'cart') {
        return (
            <CartView
                cart={cart}
                onBack={() => setView('feed')}
                onRemove={removeFromCart}
                onCheckout={handleCheckout}
                isProcessing={isProcessing}
            />
        );
    }

    if (view === 'profile') {
        return (
            <ProfileView
                userData={userData}
                onBack={() => setView('feed')}
            />
        );
    }

    if (view === 'success') {
        return (
            <SuccessView
                otp={otp}
                onReturn={() => setView('feed')}
            />
        );
    }

    // Default: Feed View
    return (
        <div className="h-screen w-full bg-black relative flex flex-col overflow-hidden select-none">

            <TopNav
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                cartCount={cart.length}
                onProfileClick={() => setView('profile')}
                onSearchClick={() => setShowSearch(true)}
                onCartClick={() => setView('cart')}
            />

            {/* Feed List */}
            <div className="flex-1 overflow-y-scroll snap-y snap-mandatory hide-scrollbar">
                {activeTab === 'shop' && PRODUCTS[0] ? (
                    <FeedItem
                        key={PRODUCTS[0].id}
                        product={PRODUCTS[0]}
                        cart={cart}
                        onAddToCart={handleAddToCart}
                        userData={userData}
                        setUserData={setUserData}
                        onCheckout={handleCheckout}
                        isProcessing={isProcessing}
                        deliveryQuote={deliveryQuote}
                    />
                ) : (
                    PRODUCTS.map(p => (
                        <FeedItem
                            key={p.id}
                            product={p}
                            cart={cart}
                            onAddToCart={handleAddToCart}
                            userData={userData}
                            setUserData={setUserData}
                            onCheckout={handleCheckout}
                            isProcessing={isProcessing}
                            deliveryQuote={deliveryQuote}
                        />
                    ))
                )}
            </div>

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
