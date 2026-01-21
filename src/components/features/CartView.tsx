/**
 * CartView Component
 * Shopping cart with items display and checkout initiation
 */

import React from 'react';
import { ArrowLeft, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { useCartStore, useUIStore } from '../../store';
import { Button } from '../common';
import { formatCurrency } from '../../utils/formatters';
import { APP_CONFIG } from '../../utils/constants';

interface CartViewProps {
    onBack: () => void;
}

export const CartView: React.FC<CartViewProps> = ({ onBack }) => {
    const { items, removeItem, updateQuantity, clearCart } = useCartStore();
    const navigateTo = useUIStore((state) => state.navigateTo);

    const subtotal = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );
    const deliveryFee = items.length > 0 ? APP_CONFIG.deliveryFee : 0;
    const total = subtotal + deliveryFee;

    const handleCheckout = () => {
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
                <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 space-y-4 shadow-lg">
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

                    {/* Checkout Button */}
                    <Button
                        onClick={handleCheckout}
                        variant="success"
                        size="lg"
                        fullWidth
                    >
                        Proceed to Checkout
                    </Button>
                </footer>
            )}
        </div>
    );
};

export default CartView;
