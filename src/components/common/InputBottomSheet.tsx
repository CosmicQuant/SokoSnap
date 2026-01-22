import React, { useEffect, useRef, useState } from 'react';
import { Phone, MapPin, X, Crosshair, Map, Loader2, ShieldCheck } from 'lucide-react';
import { validateLocation, validatePhone } from '../../utils/validation';
import { LocationPickerModal } from './LocationPickerModal';
import mpesaLogo from '../../assets/41.png';

interface InputBottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    userData: { phone: string; location: string };
    setUserData: React.Dispatch<React.SetStateAction<{ phone: string; location: string; name: string }>>;
    onConfirm: () => void;
    isProcessing: boolean;
    productPrice: number;
    deliveryQuote: number | null;
}

export const InputBottomSheet: React.FC<InputBottomSheetProps> = ({
    isOpen,
    onClose,
    userData,
    setUserData,
    onConfirm,
    isProcessing,
    productPrice,
    deliveryQuote
}) => {
    const [errors, setErrors] = useState<{ phone?: string; location?: string }>({});
    const [showMap, setShowMap] = useState(false);
    const sheetRef = useRef<HTMLDivElement>(null);
    const phoneInputRef = useRef<HTMLInputElement>(null);

    // Auto-focus phone input when sheet opens
    useEffect(() => {
        if (isOpen && phoneInputRef.current) {
            setTimeout(() => phoneInputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    const handleConfirm = () => {
        const newErrors: { phone?: string; location?: string } = {};

        const phoneValidation = validatePhone(userData.phone);
        if (!phoneValidation.isValid) {
            newErrors.phone = phoneValidation.error;
        }

        const locationValidation = validateLocation(userData.location);
        if (!locationValidation.isValid) {
            newErrors.location = locationValidation.error;
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            onConfirm();
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop - Fixed position, covers entire screen */}
            <div
                className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Bottom Sheet - Fixed to bottom, keyboard-aware */}
            <div
                ref={sheetRef}
                className="fixed bottom-0 left-0 right-0 z-[101] bg-gradient-to-t from-black via-black/95 to-black/90 rounded-t-3xl border-t border-white/10 animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-y-auto"
                style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
                {/* Handle Bar */}
                <div className="w-full flex justify-center pt-3 pb-2">
                    <div className="w-10 h-1 bg-white/30 rounded-full" />
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/50 hover:text-white bg-white/10 rounded-full p-2 transition-colors"
                >
                    <X size={18} />
                </button>

                {/* Content */}
                <div className="px-6 pb-6 space-y-4">
                    {/* Header */}
                    <div className="text-center mb-2">
                        <h3 className="text-lg font-black text-white italic uppercase tracking-tight">
                            Complete Your Order
                        </h3>
                        <p className="text-white/50 text-xs font-medium mt-1">
                            Enter your M-Pesa number and delivery location
                        </p>
                    </div>

                    {/* Phone Input */}
                    <div className="relative group">
                        <label className="text-[10px] font-bold text-white/60 uppercase tracking-wider mb-1.5 block">
                            M-Pesa Number
                        </label>
                        <div className="relative">
                            <Phone size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.phone ? 'text-red-400' : 'text-white/40 group-focus-within:text-yellow-400'}`} />
                            <input
                                ref={phoneInputRef}
                                type="tel"
                                inputMode="numeric"
                                placeholder="e.g. 0712345678"
                                value={userData.phone}
                                onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                                className={`w-full bg-white/5 backdrop-blur-md border-2 rounded-2xl py-4 pl-12 pr-4 text-base font-bold text-white placeholder:text-white/30 outline-none transition-all ${errors.phone ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-yellow-400'
                                    }`}
                            />
                        </div>
                        {errors.phone && (
                            <span className="text-xs text-red-400 font-bold mt-1 block">{errors.phone}</span>
                        )}
                    </div>

                    {/* Location Input */}
                    <div className="relative group">
                        <label className="text-[10px] font-bold text-white/60 uppercase tracking-wider mb-1.5 block">
                            Delivery Location
                        </label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <MapPin size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.location ? 'text-red-400' : 'text-white/40 group-focus-within:text-yellow-400'}`} />
                                <input
                                    type="text"
                                    placeholder="e.g. Westlands, Nairobi"
                                    value={userData.location}
                                    onChange={(e) => setUserData(prev => ({ ...prev, location: e.target.value }))}
                                    className={`w-full bg-white/5 backdrop-blur-md border-2 rounded-2xl py-4 pl-12 pr-4 text-base font-bold text-white placeholder:text-white/30 outline-none transition-all ${errors.location ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-yellow-400'
                                        }`}
                                />
                            </div>
                            <button
                                onClick={() => {
                                    if (navigator.geolocation) {
                                        navigator.geolocation.getCurrentPosition((pos) => {
                                            setUserData(prev => ({
                                                ...prev,
                                                location: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)} (GPS)`
                                            }));
                                        });
                                    }
                                }}
                                className="w-14 bg-white/5 border-2 border-white/10 rounded-2xl flex items-center justify-center text-white/50 hover:text-yellow-400 hover:border-yellow-400/50 active:scale-95 transition-all"
                                title="Use Current Location"
                            >
                                <Crosshair size={20} />
                            </button>
                            <button
                                onClick={() => setShowMap(true)}
                                className="w-14 bg-white/5 border-2 border-white/10 rounded-2xl flex items-center justify-center text-white/50 hover:text-yellow-400 hover:border-yellow-400/50 active:scale-95 transition-all"
                                title="Pin on Map"
                            >
                                <Map size={20} />
                            </button>
                        </div>
                        {errors.location && (
                            <span className="text-xs text-red-400 font-bold mt-1 block">{errors.location}</span>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mt-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-white/60 font-medium">Product</span>
                            <span className="text-white font-bold">KES {productPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm mt-2">
                            <span className="text-white/60 font-medium">Delivery</span>
                            <span className="text-white font-bold">
                                {deliveryQuote ? `KES ${deliveryQuote}` : 'Calculating...'}
                            </span>
                        </div>
                        <div className="border-t border-white/10 mt-3 pt-3 flex justify-between items-center">
                            <span className="text-white font-bold">Total</span>
                            <span className="text-yellow-400 font-black text-lg">
                                KES {(productPrice + (deliveryQuote || 0)).toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* Confirm Button */}
                    <button
                        onClick={handleConfirm}
                        disabled={isProcessing}
                        className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-black py-4 rounded-2xl flex items-center justify-center gap-3 active:scale-[0.98] transition-transform disabled:opacity-50 shadow-lg shadow-yellow-400/20"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                <span className="uppercase tracking-wide">Processing...</span>
                            </>
                        ) : (
                            <>
                                <img src={mpesaLogo} className="h-6 object-contain" alt="M-Pesa" />
                                <span className="uppercase tracking-wide">Pay Now</span>
                            </>
                        )}
                    </button>

                    {/* Security Note */}
                    <div className="flex items-center justify-center gap-2 pt-1">
                        <ShieldCheck size={14} className="text-emerald-500" />
                        <span className="text-[10px] text-white/50 font-medium">
                            Secure escrow payment • Funds released after delivery
                        </span>
                    </div>
                </div>
            </div>

            {/* Location Picker Modal */}
            <LocationPickerModal
                isOpen={showMap}
                onClose={() => setShowMap(false)}
                onSelectLocation={(loc) => {
                    setUserData(prev => ({ ...prev, location: loc.address }));
                    setShowMap(false);
                }}
            />
        </>
    );
};
