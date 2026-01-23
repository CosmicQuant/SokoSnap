import React, { useRef, useState, useEffect, useCallback } from 'react';
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
    onKeyboardActive?: (active: boolean) => void;
    onMapOpen?: (isOpen: boolean) => void;
    onDone?: () => void;
}

export const InputFloatingCard: React.FC<InputFloatingCardProps> = ({
    isOpen,
    onClose,
    userData,
    setUserData,
    allowCOD = false,
    paymentMethod = 'mpesa',
    setPaymentMethod,
    onKeyboardActive,
    onMapOpen,
    onDone
}) => {
    const [showMap, setShowMap] = useState(false);
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const phoneInputRef = useRef<HTMLInputElement>(null);
    const locationInputRef = useRef<HTMLInputElement>(null);
    const drawerRef = useRef<HTMLDivElement>(null);

    // Handle "Done" action - dismiss keyboard and notify parent
    const handleDone = useCallback(async () => {
        // Blur inputs
        phoneInputRef.current?.blur();
        locationInputRef.current?.blur();

        // Hide native keyboard if available
        if (Capacitor.isNativePlatform()) {
            await Keyboard.hide();
        }

        // Notify parent
        onDone?.();
    }, [onDone]);

    // Handle Enter key on inputs
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleDone();
        }
    };

    // Auto-focus phone input when card opens, hide keyboard when it closes
    useEffect(() => {
        if (isOpen && phoneInputRef.current) {
            setTimeout(() => phoneInputRef.current?.focus(), 150);
        } else if (!isOpen) {
            // Hide keyboard when drawer closes
            if (Capacitor.isNativePlatform()) {
                Keyboard.hide().catch(() => { });
            }
            // Also blur any focused inputs
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }
        }
    }, [isOpen]);

    // Prevent drawer from being dragged/scrolled when keyboard is open
    const preventTouchMove = useCallback((e: TouchEvent) => {
        if (isKeyboardOpen && drawerRef.current?.contains(e.target as Node)) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, [isKeyboardOpen]);

    useEffect(() => {
        if (isKeyboardOpen) {
            document.addEventListener('touchmove', preventTouchMove, { passive: false });
            return () => document.removeEventListener('touchmove', preventTouchMove);
        }
    }, [isKeyboardOpen, preventTouchMove]);

    // Handle keyboard detection using Capacitor Keyboard plugin on native
    useEffect(() => {
        if (!isOpen) return;

        let showListener: any;
        let hideListener: any;
        let animationFrameId: number;

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

        // Continuous polling for keyboard height changes (handles keyboard type switching)
        const pollViewportHeight = () => {
            if (window.visualViewport) {
                const viewportHeight = window.visualViewport.height;
                const viewportTop = window.visualViewport.offsetTop;
                const windowHeight = window.innerHeight;

                // Calculate keyboard height accounting for viewport offset
                const kbHeight = Math.max(0, windowHeight - viewportHeight - viewportTop);

                // Keyboard is visible if there's significant viewport reduction
                const keyboardVisible = kbHeight > 50;

                if (keyboardVisible) {
                    setIsKeyboardOpen(true);
                    setKeyboardHeight(kbHeight);
                    onKeyboardActive?.(true);
                } else {
                    setIsKeyboardOpen(false);
                    setKeyboardHeight(0);
                    onKeyboardActive?.(false);
                }
            }

            // Continue polling while drawer is open
            if (isOpen) {
                animationFrameId = requestAnimationFrame(pollViewportHeight);
            }
        };

        // Start polling
        animationFrameId = requestAnimationFrame(pollViewportHeight);

        // Also listen to viewport events for immediate response
        const handleViewportChange = () => {
            // Trigger immediate recalculation
            if (window.visualViewport) {
                const viewportHeight = window.visualViewport.height;
                const viewportTop = window.visualViewport.offsetTop;
                const windowHeight = window.innerHeight;
                const kbHeight = Math.max(0, windowHeight - viewportHeight - viewportTop);

                if (kbHeight > 50) {
                    setIsKeyboardOpen(true);
                    setKeyboardHeight(kbHeight);
                    onKeyboardActive?.(true);
                } else {
                    setIsKeyboardOpen(false);
                    setKeyboardHeight(0);
                    onKeyboardActive?.(false);
                }
            }
        };

        window.visualViewport?.addEventListener('resize', handleViewportChange);
        window.visualViewport?.addEventListener('scroll', handleViewportChange);

        return () => {
            showListener?.remove?.();
            hideListener?.remove?.();
            cancelAnimationFrame(animationFrameId);
            window.visualViewport?.removeEventListener('resize', handleViewportChange);
            window.visualViewport?.removeEventListener('scroll', handleViewportChange);
            onKeyboardActive?.(false);
        };
    }, [isOpen, onKeyboardActive]);

    if (!isOpen) return null;

    const isCOD = paymentMethod === 'cod';

    // Calculate the bottom position - simply use keyboard height
    // The polling/event handlers already account for viewport offsets
    const bottomPosition = isKeyboardOpen ? keyboardHeight : undefined;

    return (
        <>
            {/* ULTRA-THIN INPUT DRAWER - Fixed at bottom when keyboard open, absolute otherwise */}
            <div
                ref={drawerRef}
                className={`${isKeyboardOpen
                    ? 'fixed left-0 right-0 z-[9999]'
                    : 'absolute bottom-full left-0 right-0 mb-0 z-[200]'
                    } animate-in slide-in-from-bottom duration-150`}
                style={isKeyboardOpen ? {
                    bottom: bottomPosition,
                    transition: 'bottom 0.05s ease-out'
                } : undefined}
            >
                {/* Solid thin card - prevent any touch scrolling */}
                <div
                    className="bg-transparent border-t border-white/20 rounded-t-xl shadow-lg overflow-hidden backdrop-blur-[2px]"
                    style={{ touchAction: isKeyboardOpen ? 'none' : 'auto' }}
                >

                    {/* Compact Header: Close + Logo + Title - all in one thin line */}
                    <div className="flex items-center justify-between px-2 py-0 border-b border-white/10 bg-black/20 backdrop-blur-md">
                        <button
                            onClick={onClose}
                            className="text-white/50 hover:text-white p-0.5 rounded transition-colors"
                        >
                            <X size={14} />
                        </button>
                        <div className="flex items-center gap-1.5 overflow-hidden">
                            <img src={mpesaLogo} className="h-8 object-contain drop-shadow-lg -my-1" alt="M-Pesa" />
                            <span className="text-[9px] text-white/80 font-black uppercase tracking-widest drop-shadow-md whitespace-nowrap">Secure Checkout</span>
                        </div>
                        {/* Done Button */}
                        <button
                            onClick={handleDone}
                            className={`bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-400 text-[9px] font-black px-2 py-0.5 rounded border border-yellow-400/30 transition-all uppercase tracking-wider ${!isKeyboardOpen && userData.phone && userData.location ? 'animate-pulse' : ''}`}
                        >
                            DONE
                        </button>
                    </div>

                    {/* Ultra-compact inputs - minimal padding, fixed gap issue by removing extra safe-area padding */}
                    <div className="px-2 py-1.5 space-y-1 pb-1 bg-gradient-to-t from-black/40 to-transparent">

                        {/* Row 1: Phone Input + COD Toggle (if allowed) */}
                        <div className="flex gap-1.5">
                            <div className="flex-1 relative">
                                <Phone size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-yellow-400 drop-shadow-md" />
                                <input
                                    ref={phoneInputRef}
                                    type="tel"
                                    inputMode="numeric"
                                    onKeyDown={handleKeyDown}
                                    placeholder={isCOD ? "Phone for delivery" : "M-Pesa Number (0712...)"}
                                    value={userData.phone}
                                    onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                                    className="w-full h-[32px] bg-black/40 border border-white/20 rounded-lg py-1.5 pl-7 pr-2 text-[11px] font-bold text-white placeholder:text-yellow-100/90 placeholder:font-bold outline-none focus:border-yellow-400/80 transition-all backdrop-blur-md shadow-inner"
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
                                <MapPin size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-yellow-400 drop-shadow-md" />
                                <input
                                    ref={locationInputRef}
                                    type="text"
                                    onKeyDown={handleKeyDown}
                                    placeholder="Delivery Location"
                                    value={userData.location}
                                    onChange={(e) => setUserData(prev => ({ ...prev, location: e.target.value }))}
                                    className="w-full h-[32px] bg-black/40 border border-white/20 rounded-lg py-1.5 pl-7 pr-2 text-[11px] font-bold text-white placeholder:text-yellow-100/90 placeholder:font-bold outline-none focus:border-yellow-400/80 transition-all backdrop-blur-md shadow-inner"
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
                                className="w-[32px] h-[32px] shrink-0 bg-black/40 backdrop-blur-md border border-white/20 rounded-lg flex items-center justify-center text-white/60 hover:text-yellow-400 active:scale-95 transition-all shadow-lg"
                                title="Use GPS"
                            >
                                <Crosshair size={14} />
                            </button>
                            {/* Map Button */}
                            <button
                                onClick={() => {
                                    setShowMap(true);
                                    onMapOpen?.(true);
                                }}
                                className="w-[32px] h-[32px] shrink-0 bg-black/40 backdrop-blur-md border border-white/20 rounded-lg flex items-center justify-center text-white/60 hover:text-yellow-400 active:scale-95 transition-all shadow-lg"
                                title="Pin on Map"
                            >
                                <Map size={14} />
                            </button>
                        </div>

                        {/* Hint for COD */}
                        {isCOD && (
                            <div className="px-1 py-0.5 animate-in fade-in slide-in-from-top-1">
                                <p className="text-[9px] text-emerald-400 italic font-medium leading-tight">
                                    <span className="font-bold text-yellow-400">*Note:</span> Delivery fees must be paid upfront to dispatch rider.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Location Picker Modal */}
            <LocationPickerModal
                isOpen={showMap}
                onClose={() => {
                    setShowMap(false);
                    onMapOpen?.(false);
                }}
                onSelectLocation={(loc) => {
                    setUserData(prev => ({ ...prev, location: loc.address }));
                    setShowMap(false);
                    onMapOpen?.(false);
                }}
            />
        </>
    );
};
