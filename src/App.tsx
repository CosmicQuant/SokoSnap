import { useEffect, useState } from 'react';
import { useAuthStore } from './store/authStore';
import { SellerDashboard } from './components/features/SellerDashboard';
import SellerLandingPage from './components/features/SellerLandingPage';
import { CheckoutFeed } from './components/CheckoutFeed';
import { Loader2 } from 'lucide-react';

const App = () => {
    const { user, initialize, isLoading } = useAuthStore();
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const unsubscribe = initialize();
        setIsInitialized(true);
        return () => unsubscribe();
    }, [initialize]);

    // Simple Client-Side Routing for Store/Checkout Pages
    const path = window.location.pathname;
    const isStorePage = path.startsWith('/store/');

    // Extract Product/Store Context from URL
    // URL Format: /store/[business-name] or /store/[business-name]/[product-slug]
    // const pathSegments = path.split('/').filter(Boolean); // Clean up unused vars
    // pathSegments[0] = 'store'
    // pathSegments[1] = business-name (slug)
    // pathSegments[2] = product-slug (optional)

    // Render Store Page Immediately (Don't wait for full auth init if public)
    if (isStorePage) {
        return (
            <div className="h-screen w-full bg-black overflow-hidden relative">
                <CheckoutFeed
                    user={user ? { name: user.name, type: user.type === 'verified_merchant' ? 'verified_merchant' : 'verified_buyer' } : null}
                    onBuyIntent={() => true}
                    onProfileClick={() => { }}
                />
            </div>
        );
    }

    if (!isInitialized || isLoading) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-black text-white'>
                <Loader2 className='animate-spin text-yellow-500' size={48} />
            </div>
        );
    }

    if (!user) {
        return <SellerLandingPage />;
    }

    return <SellerDashboard />;
};

export default App;
