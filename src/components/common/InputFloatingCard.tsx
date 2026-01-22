import React, { useRef, useState, useEffect } from 'react';
import { Phone, MapPin, X, Crosshair, Map, Banknote } from 'lucide-react';
import { LocationPickerModal } from './LocationPickerModal';
import { Keyboard } from '@capacitor/keyboard';
import { Capacitor } from '@capacitor/core';
import mpesaLogo from '../../assets/41.png';

interface InputFloatingCardProps {
    isOpen: boolean;
    onClose: () => void;
    userData: { phone: string; location: string };
    setUserData: React.Dispatch<React.SetStateAction<{ phone: string; location: string; name: string }>>;
    allowCOD?: boolean; // Whether seller allows Cash on Delivery
    paymentMethod?: 'mpesa' | 'cod';
    setPaymentMethod?: (method: 'mpesa' | 'cod') => void;
    onKeyboardActive?: (active: boolean) => void; // Notify parent when keyboard is active
}

export const InputFloatingCard: React.FC<InputFloatingCardProps> = ({
    isOpen,
    onClose,
    userData,
    setUserData,
    allowCOD = false,
    paymentMethod = 'mpesa',
    setPaymentMethod,
    onKeyboardActive
}) => {
    const [showMap, setShowMap] = useState(false);
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const phoneInputRef = useRef<HTMLInputElement>(null);
    const locationInputRef = useRef<HTMLInputElement>(null);
    const drawerRef = useRef<HTMLDivElement>(null);

    // Auto-focus phone input when card opens
    useEffect(() => {
        if (isOpen && phoneInputRef.current) {
            setTimeout(() => phoneInputRef.current?.focus(), 150);
        }
    }, [isOpen]);

    // Handle keyboard detection using Capacitor Keyboard plugin on native
    useEffect(() => {
        if (!isOpen) return;

        let showListener: any;
        let hideListener: any;

        const setupKeyboardListeners = async () => {
            if (Capacitor.isNativePlatform()) {
                // Use Capacitor Keyboard plugin for native platforms
                showListener = await Keyboard.addListener('keyboardWillShow', (info) => {
                    setIsKeyboardOpen(true);
                    setKeyboardHeight(info.keyboardHeight);
                    onKeyboardActive?.(true);
                });

                hideListener = await Keyboard.addListener('keyboardWillHide', () => {
                    setIsKeyboardOpen(false);
                    setKeyboardHeight(0);
                    onKeyboardActive?.(false);
                });
            }
        };

        setupKeyboardListeners();

        // Fallback: Use visualViewport API for web
        const handleResize = () => {
            if (!Capacitor.isNativePlatform() && window.visualViewport) {
                const kbHeight = window.innerHeight - window.visualViewport.height;
                const keyboardVisible = kbHeight > 150;
                setIsKeyboardOpen(keyboardVisible);
                setKeyboardHeight(kbHeight);
                onKeyboardActive?.(keyboardVisible);
            }
        };

        window.visualViewport?.addEventListener('resize', handleResize);

        return () => {
            showListener?.remove?.();
            hideListener?.remove?.();
            window.visualViewport?.removeEventListener('resize', handleResize);
            onKeyboardActive?.(false);
        };
    }, [isOpen, onKeyboardActive]);

    if (!isOpen) return null;

    const isCOD = paymentMethod === 'cod';

    return (
        <>
            {/* ULTRA-THIN INPUT DRAWER - Fixed at bottom when keyboard open, absolute otherwise */}
            <div
                ref={drawerRef}
                className={`${isKeyboardOpen
                    ? 'fixed left-0 right-0 z-[9999]'
                    : 'absolute bottom-full left-0 right-0 mb-0 z-[200]'
                    } animate-in slide-in-from-bottom duration-150 transition-all`}
                style={isKeyboardOpen ? { bottom: keyboardHeight } : undefined}
            >
                {/* Solid thin card */}
                <div className="bg-neutral-900 border border-white/20 rounded-t-xl shadow-lg overflow-hidden">

                    {/* Compact Header: Close + Logo + Title - all in one thin line */}
                    <div className="flex items-center justify-between px-2 py-1 border-b border-white/10 bg-white/5">
                        <button
                            onClick={onClose}
                            className="text-white/50 hover:text-white p-0.5 rounded transition-colors"
                        >
                            <X size={14} />
                        </button>
                        <div className="flex items-center gap-1.5">
                            <img src={mpesaLogo} className="h-5 object-contain" alt="M-Pesa" />
                            <span className="text-[8px] text-white/60 font-bold uppercase tracking-wider">Secure Checkout</span>
                        </div>
                        <div className="w-5" /> {/* Spacer for centering */}
                    </div>

                    {/* Ultra-compact inputs - minimal padding */}
                    <div className="px-2 py-1.5 space-y-1 pb-[env(safe-area-inset-bottom)]">

                        {/* Row 1: Phone Input + COD Toggle (if allowed) */}
                        <div className="flex gap-1.5">
                            <div className="flex-1 relative">
                                <Phone size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-yellow-400/70" />
                                <input
                                    ref={phoneInputRef}
                                    type="tel"
                                    inputMode="numeric"
                                    placeholder={isCOD ? "Phone for delivery" : "M-Pesa Number (0712...)"}
                                    value={userData.phone}
                                    onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                                    className="w-full h-[32px] bg-white/10 border border-white/15 rounded-lg py-1.5 pl-7 pr-2 text-[11px] font-bold text-white placeholder:text-white/30 outline-none focus:border-yellow-400/50 transition-all"
                                />
                            </div>
                            {/* Cash on Delivery Button - Emerald green when active */}
                            {setPaymentMethod && (
                                <button
                                    onClick={() => allowCOD && setPaymentMethod(isCOD ? 'mpesa' : 'cod')}
                                    disabled={!allowCOD}
                                    className={`shrink-0 h-[32px] px-2 rounded-lg flex items-center gap-1 text-[8px] font-bold tracking-wide border transition-all whitespace-nowrap ${!allowCOD
                                        ? 'bg-white/5 border-white/10 text-white/20 cursor-not-allowed opacity-50'
                                        : isCOD
                                            ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 border-emerald-400/50 text-white shadow-sm shadow-emerald-500/30 active:scale-95'
                                            : 'bg-white/5 border-emerald-500/30 text-emerald-400/80 hover:text-emerald-400 hover:border-emerald-400/50 active:scale-95'
                                        }`}
                                    title={allowCOD ? "Cash on Delivery" : "Seller doesn't accept Cash on Delivery"}
                                >
                                    <Banknote size={12} className={isCOD && allowCOD ? 'text-white' : 'text-emerald-500'} />
                                    <span>{isCOD && allowCOD ? 'Cash on Delivery ✓' : 'Cash on Delivery'}</span>
                                </button>
                            )}
                        </div>

                        {/* Row 2: Location Input + GPS + Map */}
                        <div className="flex gap-1.5">
                            <div className="flex-1 relative">
                                <MapPin size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-yellow-400/70" />
                                <input
                                    ref={locationInputRef}
                                    type="text"
                                    placeholder="Delivery Location"
                                    value={userData.location}
                                    onChange={(e) => setUserData(prev => ({ ...prev, location: e.target.value }))}
                                    className="w-full h-[32px] bg-white/10 border border-white/15 rounded-lg py-1.5 pl-7 pr-2 text-[11px] font-bold text-white placeholder:text-white/30 outline-none focus:border-yellow-400/50 transition-all"
                                />
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
                                className="w-[32px] h-[32px] shrink-0 bg-white/5 border border-white/15 rounded-lg flex items-center justify-center text-white/40 hover:text-yellow-400 active:scale-95 transition-all"
                                title="Use GPS"
                            >
                                <Crosshair size={14} />
                            </button>
                            {/* Map Button */}
                            <button
                                onClick={() => setShowMap(true)}
                                className="w-[32px] h-[32px] shrink-0 bg-white/5 border border-white/15 rounded-lg flex items-center justify-center text-white/40 hover:text-yellow-400 active:scale-95 transition-all"
                                title="Pin on Map"
                            >
                                <Map size={14} />
                            </button>
                        </div>
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
