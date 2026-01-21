import React, { useState } from 'react';
import { ArrowLeft, ShoppingCart, Trash2, Plus, Minus, Phone, MapPin, X, AlertCircle } from 'lucide-react';
import { useCartStore } from '../../store';
import { Button } from '../common';
import { formatCurrency } from '../../utils/formatters';
import { APP_CONFIG } from '../../utils/constants';
import { validateLocation, validatePhone } from '../../utils/validation';

interface CartViewProps {
    onBack: () => void;
    userData: { phone: string; location: string; name: string };
    setUserData: React.Dispatch<React.SetStateAction<any>>;
    onCheckout: () => void;
}

export const CartView: React.FC<CartViewProps> = ({ onBack, userData, setUserData, onCheckout }) => {
    // @ts-ignore - store types might mismatch mock data slightly
    const { items, removeItem, updateQuantity, clearCart } = useCartStore();

    const [showInputs, setShowInputs] = useState(false);
    const [errors, setErrors] = useState<{ phone?: string; location?: string }>({});

    const subtotal = items.reduce(
        // @ts-ignore - mock data uses `price`
        (sum, item) => sum + (item.product.price * item.quantity),
        0
    );
    const deliveryFee = items.length > 0 ? APP_CONFIG.deliveryFee : 0;
    const total = subtotal + deliveryFee;

    const handleCheckout = () => {
        // Clear previous errors
        setErrors({});

        // 1. Validation Logic
        let isValid = true;
        const newErrors: { phone?: string; location?: string } = {};

        const phoneRes = validatePhone(userData.phone);
        if (!phoneRes.isValid) {
            newErrors.phone = phoneRes.error;
            isValid = false;
        }

        const locRes = validateLocation(userData.location);
        if (!locRes.isValid) {
            newErrors.location = locRes.error;
            isValid = false;
        }

        if (!isValid) {
            setErrors(newErrors);
            setShowInputs(true);
            return;
        }

        // 2. Proceed
        onCheckout();
        // create order logic is handled in App.tsx handleCheckout
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
                <div className="w-8" />
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
                    items.map((item: any) => (
                        <article
                            key={item.product.id}
                            className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex gap-4 animate-in slide-in-from-bottom duration-300"
                        >
                            {/* Product Image - ADAPTED to Mock Data Shape (.media instead of .mediaUrl) */}
                            <div className="w-20 h-20 shrink-0 bg-slate-100 rounded-xl overflow-hidden relative">
                                {item.product.type === 'video' ? (
                                    <video
                                        src={item.product.media || item.product.mediaUrl}
                                        className="w-full h-full object-cover"
                                        aria-label={item.product.name}
                                    />
                                ) : (
                                    <img
                                        src={item.product.media || item.product.mediaUrl}
                                        className="w-full h-full object-cover"
                                        alt={item.product.name}
                                    />
                                )}
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide truncate">
                                        {item.product.seller || item.product.sellerName}
                                    </p>
                                    <h3 className="font-bold text-slate-900 leading-tight truncate">
                                        {item.product.name}
                                    </h3>
                                </div>

                                <div className="flex items-end justify-between">
                                    <p className="font-bold text-green-600">
                                        {formatCurrency(item.product.price * item.quantity)}
                                    </p>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                            className="p-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="w-6 text-center font-bold text-sm">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                            className="p-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                                        >
                                            <Plus size={14} />
                                        </button>
                                        <button
                                            onClick={() => removeItem(item.product.id)}
                                            className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors ml-2"
                                        >
                                            <Trash2 size={16} />
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
                <footer className={`fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 space-y-4 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 ${showInputs ? 'pb-safe' : 'pb-safe'}`}>

                    {/* User Info Prompt */}
                    {showInputs && (
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 animate-in fade-in slide-in-from-bottom-4 relative">
                            <button
                                onClick={() => setShowInputs(false)}
                                className="absolute top-2 right-2 text-slate-400 hover:text-slate-600"
                            >
                                <X size={16} />
                            </button>

                            <div className="flex gap-2 items-start">
                                <AlertCircle size={16} className="text-orange-500 mt-0.5 shrink-0" />
                                <p className="text-xs text-slate-600 mb-2 font-medium">
                                    Please provide your delivery details to check out.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <div className="relative">
                                        <Phone size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${errors.phone ? 'text-red-500' : 'text-slate-400'}`} />
                                        <input
                                            type="tel"
                                            placeholder="M-Pesa Number (e.g. 0712...)"
                                            value={userData.phone}
                                            onChange={(e) => setUserData((prev: any) => ({ ...prev, phone: e.target.value }))}
                                            className={`w-full pl-10 p-3 bg-white border rounded-xl text-sm outline-none transition-all ${errors.phone ? 'border-red-500 focus:ring-2 focus:ring-red-100' : 'border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-100'
                                                }`}
                                        />
                                    </div>
                                    {errors.phone && <span className="text-xs text-red-500 font-medium ml-1">{errors.phone}</span>}
                                </div>

                                <div className="space-y-1">
                                    <div className="relative">
                                        <MapPin size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${errors.location ? 'text-red-500' : 'text-slate-400'}`} />
                                        <input
                                            type="text"
                                            placeholder="Delivery Location (e.g. Westlands)"
                                            value={userData.location}
                                            onChange={(e) => setUserData((prev: any) => ({ ...prev, location: e.target.value }))}
                                            className={`w-full pl-10 p-3 bg-white border rounded-xl text-sm outline-none transition-all ${errors.location ? 'border-red-500 focus:ring-2 focus:ring-red-100' : 'border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-100'
                                                }`}
                                        />
                                    </div>
                                    {errors.location && <span className="text-xs text-red-500 font-medium ml-1">{errors.location}</span>}
                                </div>
                            </div>
                        </div>
                    )}

                    {!showInputs && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Subtotal</span>
                                <span className="font-bold text-slate-900">{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Delivery</span>
                                <span className="font-bold text-slate-900">{formatCurrency(deliveryFee)}</span>
                            </div>
                            <div className="flex justify-between text-base border-t border-slate-100 pt-2">
                                <span className="font-bold text-slate-900">Total</span>
                                <span className="font-bold text-green-600 text-lg">{formatCurrency(total)}</span>
                            </div>
                        </div>
                    )}

                    <Button onClick={handleCheckout} variant="success" size="lg" fullWidth>
                        Secure Checkout
                    </Button>
                </footer>
            )}
        </div>
    );
};
