import React, { useRef, useState, useEffect } from 'react';
import { Phone, MapPin, X, Crosshair, Loader2, Map } from 'lucide-react';
import { validateLocation, validatePhone } from '../../utils/validation';
import { LocationPickerModal } from './LocationPickerModal';
import mpesaLogo from '../../assets/41.png';

interface InputFloatingCardProps {
    isOpen: boolean;
    onClose: () => void;
    userData: { phone: string; location: string };
    setUserData: React.Dispatch<React.SetStateAction<{ phone: string; location: string; name: string }>>;
    onConfirm: () => void;
    isProcessing: boolean;
    productPrice: number;
    deliveryQuote: number | null;
}

export const InputFloatingCard: React.FC<InputFloatingCardProps> = ({
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
    const phoneInputRef = useRef<HTMLInputElement>(null);

    // Auto-focus phone input when card opens
    useEffect(() => {
        if (isOpen && phoneInputRef.current) {
            setTimeout(() => phoneInputRef.current?.focus(), 150);
        }
    }, [isOpen]);

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

    const total = productPrice + (deliveryQuote || 0);

    return (
        <>
            {/* COMPACT FLOATING CARD - Ultra-transparent glass effect */}
            <div
                className="fixed bottom-0 left-0 right-0 z-[100] animate-in slide-in-from-bottom duration-300"
                style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
                {/* Glass Card Container - Maximum transparency while keeping readability */}
                <div className="mx-3 mb-3 bg-black/40 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl shadow-black/30 overflow-hidden relative">

                    {/* Header Row: Title + Close Button */}
                    <div className="flex items-center justify-between px-4 pt-3 pb-1">
                        <div className="flex items-center gap-2">
                            <img src={mpesaLogo} className="h-8 object-contain" alt="M-Pesa" />
                            <span className="text-[10px] text-white/60 font-bold uppercase tracking-wider">Secure Checkout</span>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/40 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Compact Content */}
                    <div className="px-4 pb-4 pt-2 space-y-3">

                        {/* Two Inputs Side by Side */}
                        <div className="flex gap-2">
                            {/* Phone Input - Compact */}
                            <div className="flex-1 relative">
                                <Phone size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${errors.phone ? 'text-red-400' : 'text-yellow-400/70'}`} />
                                <input
                                    ref={phoneInputRef}
                                    type="tel"
                                    inputMode="numeric"
                                    placeholder="M-Pesa (0712...)"
                                    value={userData.phone}
                                    onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                                    className={`w-full bg-white/5 border rounded-xl py-2.5 pl-9 pr-3 text-sm font-bold text-white placeholder:text-white/40 outline-none transition-all ${errors.phone ? 'border-red-500/50' : 'border-white/10 focus:border-yellow-400/50'
                                        }`}
                                />
                                {errors.phone && (
                                    <span className="absolute -bottom-4 left-0 text-[9px] text-red-400 font-bold">{errors.phone}</span>
                                )}
                            </div>

                            {/* Location Input - Compact with GPS + Map buttons */}
                            <div className="flex-1 flex gap-1.5">
                                <div className="flex-1 relative">
                                    <MapPin size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${errors.location ? 'text-red-400' : 'text-yellow-400/70'}`} />
                                    <input
                                        type="text"
                                        placeholder="Location"
                                        value={userData.location}
                                        onChange={(e) => setUserData(prev => ({ ...prev, location: e.target.value }))}
                                        className={`w-full bg-white/5 border rounded-xl py-2.5 pl-9 pr-3 text-sm font-bold text-white placeholder:text-white/40 outline-none transition-all ${errors.location ? 'border-red-500/50' : 'border-white/10 focus:border-yellow-400/50'
                                            }`}
                                    />
                                    {errors.location && (
                                        <span className="absolute -bottom-4 left-0 text-[9px] text-red-400 font-bold truncate max-w-full">{errors.location}</span>
                                    )}
                                </div>
                                {/* GPS Button */}
                                <button
                                    onClick={() => {
                                        if (navigator.geolocation) {
                                            navigator.geolocation.getCurrentPosition((pos) => {
                                                setUserData(prev => ({
                                                    ...prev,
                                                    location: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`
                                                }));
                                            });
                                        }
                                    }}
                                    className="w-9 shrink-0 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/50 hover:text-yellow-400 hover:border-yellow-400/30 active:scale-95 transition-all"
                                    title="Use GPS"
                                >
                                    <Crosshair size={15} />
                                </button>
                                {/* Map Pin Button */}
                                <button
                                    onClick={() => setShowMap(true)}
                                    className="w-9 shrink-0 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/50 hover:text-yellow-400 hover:border-yellow-400/30 active:scale-95 transition-all"
                                    title="Pin on Map"
                                >
                                    <Map size={15} />
                                </button>
                            </div>
                        </div>

                        {/* Order Button - Full Width, Prominent */}
                        <button
                            onClick={handleConfirm}
                            disabled={isProcessing}
                            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-black py-3.5 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-50 shadow-lg shadow-yellow-400/20"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    <span className="text-sm uppercase tracking-wide">Processing...</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-base uppercase tracking-wide font-black">
                                        Order Now
                                    </span>
                                    <span className="text-base font-black">•</span>
                                    <span className="text-base font-black">
                                        KES {total.toLocaleString()}
                                    </span>
                                </>
                            )}
                        </button>
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
