/**
 * CartView Component
 * Shopping cart with items display and checkout initiation
 */

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ShoppingCart, Trash2, Plus, Minus, AlertCircle, Banknote } from 'lucide-react';
import { useCartStore, useUIStore, useAuthStore } from '../../store';
import { Button } from '../common';
import { formatCurrency } from '../../utils/formatters';
import { APP_CONFIG } from '../../utils/constants';

interface CartViewProps {
    onBack: () => void;
}

export const CartView: React.FC<CartViewProps> = ({ onBack }) => {
    const { items, removeItem, updateQuantity, clearCart } = useCartStore();
    const { user } = useAuthStore();
    const navigateTo = useUIStore((state) => state.navigateTo);
    const [missingInfoError, setMissingInfoError] = useState<string | null>(null);

    const subtotal = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );
    const deliveryFee = items.length > 0 ? APP_CONFIG.deliveryFee : 0;
    const total = subtotal + deliveryFee;

    const handleCheckout = () => {
        // Validate user information
        // We check against the mock user or the stored user object
        // Assuming validation logic checks if phone/location are present
        const hasPhone = user?.phone && user.phone.length > 5;
        // const hasLocation = user?.location && user.location.length > 3; // Location might be part of user object or separate

        if (!user) {
            // If no user is logged in, perhaps prompt logic (though app seems to default to Guest)
            setMissingInfoError("Please log in to checkout.");
            navigateTo('profile'); // Send them to profile to login? Or open auth modal.
            return;
        }

        // Simplistic validation: if phone is "default" or missing
        if (!hasPhone) {
            setMissingInfoError("Please add your Phone Number and Delivery Location in your Profile before checking out.");
            setTimeout(() => navigateTo('profile'), 2000);
            return;
        }

        // For now, we'll just show success since we don't have a full checkout flow
        navigateTo('success');
        clearCart();
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col text-slate-900 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <header className="px-4 py-4 flex items-center justify-between bg-white border-b border-slate-100 shadow-sm z-20 sticky top-0">
                <button
                    onClick={onBack}
                    className="p-2 -ml-2 text-slate-500 hover:text-slate-900 transition-colors active:scale-95"
                    aria-label="Go back"
                >
                    <ArrowLeft size={22} aria-hidden="true" />
                </button>
                <h1 className="font-bold text-base text-slate-900">Your Cart</h1>
                <div className="w-8" /> {/* Spacer for centering */}
            </header>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 pb-48 space-y-4">
                {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
                            <ShoppingCart size={32} className="text-slate-300" aria-hidden="true" />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-slate-400">Your cart is empty</p>
                            <p className="text-sm text-slate-400 mt-1">
                                Browse products and add them to your cart
                            </p>
                        </div>
                        <Button onClick={onBack} variant="primary" size="md">
                            Start Shopping
                        </Button>
                    </div>
                ) : (
                    items.map((item) => (
                        <article
                            key={item.product.id}
                            className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex gap-4 animate-in slide-in-from-bottom duration-300"
                        >
                            {/* Product Image */}
                            <div className="w-20 h-20 shrink-0 bg-slate-100 rounded-xl overflow-hidden relative">
                                {item.product.type === 'video' ? (
                                    <video
                                        src={item.product.mediaUrl}
                                        className="w-full h-full object-cover"
                                        aria-label={item.product.name}
                                    />
                                ) : (
                                    <img
                                        src={item.product.mediaUrl}
                                        className="w-full h-full object-cover"
                                        alt={item.product.name}
                                    />
                                )}
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide truncate">
                                        {item.product.sellerName}
                                    </p>
                                    <h3 className="font-bold text-slate-900 leading-tight truncate">
                                        {item.product.name}
                                    </h3>
                                </div>

                                <div className="flex items-end justify-between">
                                    <p className="font-bold text-emerald-600">
                                        {formatCurrency(item.product.price * item.quantity)}
                                    </p>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() =>
                                                updateQuantity(item.product.id, item.quantity - 1)
                                            }
                                            className="p-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                                            aria-label={`Decrease quantity of ${item.product.name}`}
                                        >
                                            <Minus size={14} aria-hidden="true" />
                                        </button>
                                        <span
                                            className="w-6 text-center font-bold text-sm"
                                            aria-label={`Quantity: ${item.quantity}`}
                                        >
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() =>
                                                updateQuantity(item.product.id, item.quantity + 1)
                                            }
                                            className="p-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                                            aria-label={`Increase quantity of ${item.product.name}`}
                                        >
                                            <Plus size={14} aria-hidden="true" />
                                        </button>
                                        <button
                                            onClick={() => removeItem(item.product.id)}
                                            className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors ml-2"
                                            aria-label={`Remove ${item.product.name} from cart`}
                                        >
                                            <Trash2 size={16} aria-hidden="true" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))
                )}
            </div>

            {/* Checkout Footer */}
            {items.length > 0 && (
                <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] space-y-4 shadow-lg">
                    {/* Summary */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Subtotal</span>
                            <span className="font-bold text-slate-900">
                                {formatCurrency(subtotal)}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Delivery</span>
                            <span className="font-bold text-slate-900">
                                {formatCurrency(deliveryFee)}
                            </span>
                        </div>
                        <div className="flex justify-between text-base border-t border-slate-100 pt-2">
                            <span className="font-bold text-slate-900">Total</span>
                            <span className="font-bold text-emerald-600 text-lg">
                                {formatCurrency(total)}
                            </span>
                        </div>
                    </div>

                    {/* Checkout Actions */}
                    {missingInfoError && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2 animate-in fade-in slide-in-from-bottom-2">
                            <AlertCircle size={16} className="shrink-0 mt-0.5" />
                            <p>{missingInfoError}</p>
                        </div>
                    )}

                    <div className="grid gap-3 pt-2">
                        {/* Unified Checkout Button - Exact match to Feed Style */}
                        <button
                            onClick={handleCheckout}
                            className="group relative w-full bg-[#4CAF50] hover:bg-[#43A047] active:scale-[0.98] text-white p-4 rounded-xl font-bold flex items-center justify-between shadow-lg shadow-emerald-500/20 transition-all overflow-hidden"
                        >
                            <div className="flex flex-col items-start leading-none relative z-10">
                                <span className="text-[9px] font-black uppercase tracking-widest opacity-80 mb-1 text-emerald-100">Confirm & Pay</span>
                                <span className="text-xl font-black">{formatCurrency(total)}</span>
                            </div>

                            <div className="flex items-center gap-3 relative z-10">
                                <div className="flex flex-col items-end mr-1">
                                    <span className="text-[9px] font-bold opacity-90">M-PESA</span>
                                    <span className="text-[8px] font-medium opacity-70">Instant</span>
                                </div>
                                <div className="bg-black/20 p-2 rounded-lg">
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>

                            {/* Shimmer Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] animate-[shimmer_2s_infinite]" />
                        </button>

                        {/* Secondary Option: Cash on Delivery */}
                        <div className="flex flex-col gap-2">
                            <Button
                                onClick={handleCheckout}
                                variant="secondary"
                                size="lg"
                                fullWidth
                                className="bg-white border-2 border-slate-100 text-slate-700 hover:bg-slate-50 hover:border-slate-200 py-3 shadow-sm"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <Banknote size={20} className="text-slate-400" />
                                    <span className="font-bold">Cash on Delivery</span>
                                </div>
                            </Button>
                            <p className="text-[10px] text-center text-slate-400 font-medium bg-slate-50 py-1.5 px-3 rounded-full mx-auto border border-slate-100">
                                <span className="text-amber-500 font-bold">Tip:</span> You'll pay the <span className="text-slate-600 font-bold">delivery fee</span> upfront
                            </p>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
};

export default CartView;
