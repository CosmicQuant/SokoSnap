import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { SellerDashboard } from './components/features/SellerDashboard';
import SellerLandingPage from './components/features/SellerLandingPage';
import { CheckoutFeed } from './components/CheckoutFeed';
import { Loader2 } from 'lucide-react';

const App = () => {
    const { user, initialize, isLoading } = useAuthStore();
    const [isInitialized, setIsInitialized] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const unsubscribe = initialize();
        setIsInitialized(true);
        return () => unsubscribe();
    }, [initialize]);

    // Derived State
    const isPublicRoute = location.pathname.startsWith('/store');
    const isAuthLoading = (!isInitialized || isLoading) && !user;

    // Transform user for CheckoutFeed
    const currentFeedUser = user ? {
        name: user.name,
        type: user.type === 'verified_merchant' ? 'verified_merchant' : 'verified_buyer' as 'verified_merchant' | 'verified_buyer',
        avatar: user.avatar || user.photoURL
    } : null;

    // Show Loader only if loading AND NOT on a public route (Store)
    if (isAuthLoading && !isPublicRoute) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-black text-white'>
                <Loader2 className='animate-spin text-yellow-500' size={48} />
            </div>
        );
    }

    return (
        <Routes>
            {/* Public Store/Checkout Routes */}
            <Route path="/store/:storeId/:productId?" element={
                <div className="h-screen w-full bg-black overflow-hidden relative">
                    <CheckoutFeed
                        user={currentFeedUser}
                    />
                </div>
            } />

            {/* Main App Routes */}
            <Route path="/" element={
                user ? <SellerDashboard /> : <SellerLandingPage />
            } />

            {/* Default Catch-All */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default App;
