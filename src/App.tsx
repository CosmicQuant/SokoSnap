import { useState, useEffect, useMemo } from 'react';
import { ShieldCheck } from 'lucide-react';
import { generateMockSecureOTP } from './utils/validation';
import { useCartStore } from './store';
import { FeedItem } from '@components/feed/FeedItem';
import { TopNav } from './components/layout/TopNav';
import { CartView } from './components/cart/CartView';
import { ProfileView } from './components/profile/ProfileView';
import { SellerProfileView } from './components/profile/SellerProfileView';
import { SearchOverlay } from './components/search/SearchOverlay';
import { SuccessView } from './components/common/SuccessView';

import { OrderHistoryView } from './components/profile/OrderHistoryView';

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
        slides: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=1080' },
            { type: 'image', url: 'https://images.unsplash.com/photo-1695048180494-1b32e043324d?auto=format&fit=crop&q=80&w=1080' }
        ],
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
        likes: '15.6k'
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
        likes: '9.3k'
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
        likes: '11.8k'
    }
];

const App = () => {
    // Navigation State
    const [activeTab, setActiveTab] = useState('shop');
    const [view, setView] = useState<'feed' | 'success' | 'cart' | 'profile' | 'seller-profile' | 'order-history'>('feed');
    const [currentSeller, setCurrentSeller] = useState<{ name: string, handle: string } | undefined>(undefined);

    // Feature State
    const [showTrustModal, setShowTrustModal] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Data State
    const { items: cartItems, addItem: addToCart, clearCart } = useCartStore();
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

    const handleCheckout = async () => {
        setIsProcessing(true);

        // Simulate secure OTP generation from server
        const code = await generateMockSecureOTP();
        setOtp(code);

        setIsProcessing(false);
        clearCart();
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
                onBack={() => setView('feed')}
            />
        );
    }

    if (view === 'profile') {
        return (
            <ProfileView
                onBack={() => setView('feed')}
                onOrderHistory={() => setView('order-history')}
            />
        );
    }

    if (view === 'order-history') {
        return (
            <OrderHistoryView
                onBack={() => setView('profile')}
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

    if (view === 'seller-profile' && currentSeller) {
        return (
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
        );
    }

    // Default: Feed View
    return (
        <div className="h-screen w-full bg-black relative flex flex-col overflow-hidden select-none">

            <TopNav
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                cartCount={cartItems.length}
                onProfileClick={() => setView('profile')}
                onBack={currentSeller ? () => {
                    setView('seller-profile');
                    // We keep currentSeller as is, so we return to their profile info
                } : undefined}
                onSearchClick={() => setShowSearch(true)}
                onCartClick={() => setView('cart')}
                currentSeller={currentSeller}
            />

            {/* Feed List */}
            <div className="flex-1 overflow-y-scroll snap-y snap-mandatory hide-scrollbar">
                {/* 
                    Feed Logic:
                    1. If activeTab is 'shop' AND we have a currentSeller, we only show products from that seller.
                    2. If activeTab is 'foryou', we show everything (mixed).
                */}
                {PRODUCTS
                    .filter(p => {
                        if (activeTab === 'shop' && currentSeller) {
                            return p.seller === currentSeller.name;
                        }
                        return true;
                    })
                    .map(p => (
                        <FeedItem
                            key={p.id}
                            product={p}
                            cart={cartItems}
                            onAddToCart={handleAddToCart}
                            userData={userData}
                            setUserData={setUserData}
                            onCheckout={handleCheckout}
                            isProcessing={isProcessing}
                            deliveryQuote={deliveryQuote}
                            onView={(seller) => {
                                setCurrentSeller(seller);
                                setView('seller-profile');
                            }}
                        />
                    ))}
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
