import React, { useRef, useEffect, useState } from 'react';
import {
    Heart,
    MessageCircle,
    ShoppingBag,
    Share2,
    CheckCircle2,
    Loader2,
    ShieldCheck,
} from 'lucide-react';
import { ActionBtn } from '../common/ActionBtn';
import { InputFloatingCard } from '../common/InputFloatingCard';
import { CommentsOverlay } from './CommentsOverlay';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';
import mpesaLogo from '../../assets/41.png';

interface FeedItemProps {
    product: any;
    cart: any[];
    onAddToCart: (product: any) => void;
    onRemoveFromCart?: (product: any) => void;
    userData: { phone: string; location: string };
    setUserData: React.Dispatch<React.SetStateAction<{ phone: string; location: string; name: string }>>;
    onCheckout: () => void;
    isProcessing: boolean;
    deliveryQuote: number | null;
    onView?: (seller: { name: string, handle: string }) => void;
    hideActions?: boolean; // Hide action sidebar (for checkout mode)
    disableScroll?: boolean; // Disable vertical scroll/snap (for checkout mode)
}

export const FeedItem: React.FC<FeedItemProps> = ({
    product,
    cart,
    onAddToCart,
    onRemoveFromCart,
    userData,
    setUserData,
    onCheckout,
    isProcessing,
    deliveryQuote,
    onView,
    hideActions = false,
    disableScroll = false
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const carouselRef = useRef<HTMLDivElement>(null);

    // Desktop Drag State
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // Bottom Sheet state (replaces inline inputs)
    const [showBottomSheet, setShowBottomSheet] = useState(false);

    // Payment method state
    const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'cod'>('mpesa');

    // Keyboard active state for positioning
    const [isKeyboardActive, setIsKeyboardActive] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0); // Track height
    const [isMapOpen, setIsMapOpen] = useState(false);

    // Feature States (Local)
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState<number>(parseInt(product.likes?.replace('k', '000') || '0'));
    const [showComments, setShowComments] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    // Performance: IntersectionObserver for autoplay
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        videoRef.current?.play().catch(() => { });
                        // DO NOT notify parent about view automatically on scroll
                        // onView?.({ name: product.seller, handle: product.handle });
                    } else {
                        videoRef.current?.pause();
                        // Close drawer and keyboard when user scrolls away
                        if (showBottomSheet) {
                            setShowBottomSheet(false);
                        }
                    }
                });
            },
            { threshold: 0.6 } // Play when 60% visible
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) observer.unobserve(containerRef.current);
        };
    }, [showBottomSheet]);

    const handleActionClick = () => {
        // If user data is missing, open the Bottom Sheet for input
        if (!userData.phone || !userData.location) {
            setShowBottomSheet(true);
            return;
        }

        // If user data exists, proceed directly to checkout
        onCheckout();
    };

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    };

    const handleShare = async () => {
        try {
            await Share.share({
                title: `Check out ${product.name} on SokoSnap`,
                text: product.description,
                url: window.location.href,
                dialogTitle: 'Share with friends',
            });
        } catch (err) {
            console.log('Error sharing or cancelled:', err);

            // On Native, if Share fails (e.g. dismissed), we stop here.
            // We do NOT want the fallback alert.
            if (Capacitor.isNativePlatform()) {
                return;
            }

            // Web Fallback Logic
            if (navigator.share) {
                // If navigator.share exists but Capacitor Share failed (unlikely as Capacitor uses it on web), try again or ignore.
                // Usually duplicate, so maybe just fallback to clipboard if navigator.share fails too.
                await navigator.share({
                    title: `Check out ${product.name} on SokoSnap`,
                    text: product.description,
                    url: window.location.href,
                }).catch(() => {
                    // If web share cancelled, do nothing? Or copy?
                    // User probably doesn't want "Link copied" if they just cancelled share.
                });
            } else {
                // Only copy if no native share is available
                navigator.clipboard.writeText(window.location.href)
                    .then(() => alert("Link copied to clipboard!"))
                    .catch(console.error);
            }
        }
    };

    const isInCart = cart.some(i => i.product.id === product.id);
    const cartItemQuantity = cart.find(i => i.product.id === product.id)?.quantity || 0;
    const hasUserData = userData.phone && userData.location;

    // Carousel Logic
    const slides = product.slides || [{ type: product.type, url: product.media }];
    const [activeSlide, setActiveSlide] = useState(0);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const index = Math.round(e.currentTarget.scrollLeft / e.currentTarget.offsetWidth);
        setActiveSlide(index);
    };

    const scrollToSlide = (index: number) => {
        if (carouselRef.current) {
            carouselRef.current.scrollTo({
                left: index * carouselRef.current.clientWidth,
                behavior: 'smooth'
            });
        }
    };

    // Mouse Drag Handlers for Desktop Swiping
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!carouselRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - carouselRef.current.offsetLeft);
        setScrollLeft(carouselRef.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !carouselRef.current) return;
        e.preventDefault();
        const x = e.pageX - carouselRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Scroll-fast
        carouselRef.current.scrollLeft = scrollLeft - walk;
    };

    return (
        <div
            ref={containerRef}
            className={`h-[100dvh] w-full ${disableScroll ? '' : 'snap-start snap-always'} relative flex flex-col bg-black overflow-hidden shrink-0`}
        >
            {/* 
              Media Layer:
              - position: absolute keeps it contained within each FeedItem
              - The blurred background (for images) + contained foreground handles any aspect ratio
              - Keyboard interaction is now isolated in the Bottom Sheet overlay
            */}
            <div
                ref={carouselRef}
                className={`absolute inset-0 w-full h-full z-0 flex overflow-x-auto snap-x snap-mandatory hide-scrollbar ${isDragging ? 'cursor-grabbing snap-none' : 'cursor-grab'} bg-black`}
                onScroll={handleScroll}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            >
                {slides.map((slide: any, index: number) => (
                    <div
                        key={index}
                        className="w-full h-full shrink-0 snap-center snap-always relative flex items-center justify-center bg-black overflow-hidden"
                        style={{ scrollSnapStop: 'always' }}
                    >
                        {slide.type === 'video' ? (
                            <div className="relative w-full h-full flex items-center justify-center bg-black">
                                {/* 
                                  OPTIMIZED: No second video playing!
                                  Background uses CSS gradient that complements dark content.
                                  In production, server would generate a blurred thumbnail.
                                */}
                                <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-neutral-800" />
                                {/* Main Video - Properly contained, single video = saves bandwidth */}
                                <video
                                    ref={index === activeSlide ? videoRef : null}
                                    loop
                                    muted
                                    playsInline
                                    className="relative z-10 w-full h-full object-contain"
                                    src={slide.url}
                                />
                            </div>
                        ) : (
                            <div className="relative w-full h-full flex items-center justify-center bg-black">
                                {/* 
                                  Images: Blur is OK because same image is cached by browser.
                                  No extra bandwidth - just uses the already-loaded image.
                                */}
                                <img
                                    src={slide.url}
                                    className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-50"
                                    alt=""
                                    aria-hidden="true"
                                    loading="lazy"
                                />
                                {/* Main Image - Properly contained */}
                                <img
                                    src={slide.url}
                                    className="relative z-10 w-full h-full object-contain"
                                    alt={product.name}
                                    loading="lazy"
                                />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20 pointer-events-none z-20" />
                    </div>
                ))}
            </div>

            {/* Removed Smart Dots from absolute position to integrate correctly above */}


            {/* Comments Overlay */}
            {showComments && <CommentsOverlay onClose={() => setShowComments(false)} />}


            {/* Action Sidebar - Hide when keyboard is active, move up when drawer is open, hidden in checkout mode */}
            {!hideActions && (
                <div className={`absolute right-4 z-40 flex flex-col items-center gap-6 transition-all duration-200 ${isKeyboardActive || isMapOpen
                    ? 'opacity-0 pointer-events-none'
                    : showBottomSheet
                        ? 'bottom-[calc(17rem+env(safe-area-inset-bottom))]'
                        : 'bottom-[calc(10rem+env(safe-area-inset-bottom))]'
                    } animate-in fade-in duration-300`}>
                    <ActionBtn
                        icon={<Heart size={28} className={`drop-shadow-lg transition-colors ${isLiked ? 'text-red-500 fill-red-500' : 'text-white'}`} />}
                        label={isLiked ? `${likesCount}` : product.likes}
                        onClick={handleLike}
                    />
                    <ActionBtn
                        icon={<MessageCircle size={28} className="drop-shadow-lg" />}
                        onClick={() => setShowComments(true)}
                    />
                    <ActionBtn
                        icon={<Share2 size={28} className="drop-shadow-lg" />}
                        onClick={handleShare}
                    />
                    <ActionBtn
                        icon={<ShoppingBag size={28} className={`drop-shadow-lg transition-colors duration-300 ${isInCart ? 'text-yellow-400 fill-yellow-400/20' : 'text-white'}`} />}
                        onClick={(e) => {
                            e?.stopPropagation();
                            onAddToCart(product);
                        }}
                        onRemoveClick={isInCart ? (e) => {
                            e.stopPropagation();
                            if (onRemoveFromCart) {
                                onRemoveFromCart(product);
                            } else {
                                onAddToCart({ ...product, quantity: -1 });
                            }
                        } : undefined}
                        count={cartItemQuantity}
                        showAddHint={!isInCart}
                        className={isInCart ? "bg-white/20 rounded-full" : ""}
                    />
                </div>
            )}

            {/* Bottom Information Stack */}
            <div className="relative z-30 mt-auto w-full pb-[env(safe-area-inset-bottom)]">

                {/* Smart Dots Indicator */}
                {slides.length > 1 && !showBottomSheet && (
                    <div className="w-full flex justify-center gap-1.5 mb-4 px-6 pointer-events-auto">
                        {slides.map((_: any, i: number) => (
                            <button
                                key={i}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    scrollToSlide(i);
                                }}
                                className={`rounded-full transition-all duration-300 shadow-sm cursor-pointer ${i === activeSlide
                                    ? 'w-4 h-1.5 bg-yellow-400'
                                    : 'w-1.5 h-1.5 bg-white/40'
                                    }`}
                            />
                        ))}
                    </div>
                )}

                <div className="px-6 space-y-1 max-w-[85%] transition-all duration-300">
                    {/* Title & Description */}
                    <div className="space-y-0.5">
                        <div
                            className="w-fit flex items-center gap-2 mb-1 cursor-pointer active:scale-95 transition-transform origin-left"
                            onClick={(e) => {
                                e.stopPropagation();
                                onView?.({ name: product.seller, handle: product.handle });
                            }}
                        >
                            <div className="w-5 h-5 rounded-full border border-yellow-400/50 overflow-hidden shadow-lg">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${product.seller}`} alt="avatar" />
                            </div>
                            <span className="text-[10px] font-black text-white uppercase tracking-tight drop-shadow-md">{product.handle}</span>
                            <CheckCircle2 size={10} className="text-blue-400 drop-shadow-md" />
                        </div>
                        <h2 className="text-lg font-black text-white italic uppercase tracking-tighter leading-none drop-shadow-xl whitespace-nowrap overflow-hidden text-ellipsis mb-1">
                            {product.name}
                        </h2>

                        <div
                            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                            className="w-fit cursor-pointer group/desc relative pb-0.5"
                        >
                            <p
                                id={`desc-${product.id}`}
                                className={`text-white/50 text-[9px] font-bold uppercase tracking-wider drop-shadow-md transition-all duration-300 ${isExpanded ? '' : 'line-clamp-2'}`}
                            >
                                {product.description}
                            </p>

                            {/* Only show 'Read More' if text is likely to overflow (primitive check) or 'Show Less' if expanded */}
                            {(product.description.length > 80 || isExpanded) && (
                                <span className="inline-block mt-1 text-yellow-400 text-[9px] font-black uppercase tracking-wider border-b border-yellow-400/30 group-hover/desc:border-yellow-400 transition-colors">
                                    {isExpanded ? 'Show Less' : 'Read More'}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* ACTION BUTTON - Opens Bottom Sheet if data missing */}
                    <div className={`relative w-[120%] group/btn ${hasUserData ? 'mt-8' : ''}`}>
                        {/* INPUT DRAWER - Shows above button when open */}
                        <InputFloatingCard
                            isOpen={showBottomSheet}
                            onClose={() => setShowBottomSheet(false)}
                            userData={userData}
                            setUserData={setUserData}
                            allowCOD={product.allowCOD ?? false}
                            paymentMethod={paymentMethod}
                            setPaymentMethod={setPaymentMethod}
                            onKeyboardActive={setIsKeyboardActive}
                            onMapOpen={setIsMapOpen}
                            onKeyboardHeightChange={setKeyboardHeight}
                            onDone={() => {
                                // If we have data, collapse the drawer to focus on the button
                                if (userData.phone && userData.location) {
                                    setShowBottomSheet(false);
                                    // Highlight button logic could go here via a prop ref or new state
                                    const button = document.getElementById(`btn-${product.id}`);
                                    if (button) {
                                        button.classList.add('animate-pulse', 'ring-2', 'ring-yellow-400');
                                        setTimeout(() => {
                                            button.classList.remove('animate-pulse', 'ring-2', 'ring-yellow-400');
                                        }, 1500);
                                    }
                                }
                            }}
                            bottomOffset={56}
                        />

                        {/* EDITABLE USER DATA HINT (Full-width Tab) */}
                        {hasUserData && !showBottomSheet && (
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowBottomSheet(true);
                                }}
                                className="absolute bottom-full mb-[-2px] inset-x-0 z-0 bg-yellow-400 border border-yellow-300 rounded-t-xl py-0.5 flex items-center justify-center cursor-pointer hover:bg-yellow-300 transition-colors"
                            >
                                <span className="text-[10px] font-medium text-black tracking-tight flex items-center gap-1.5">
                                    <span>Using {userData.phone} • {userData.location}</span>
                                    <span className="border-b border-black/50 opacity-70 text-[9px]">Edit</span>
                                </span>
                            </div>
                        )}

                        {/* THE GOLDEN GLASS BUTTON */}
                        <button
                            id={`btn-${product.id}`}
                            onClick={handleActionClick}
                            className={`w-full border-y-[2px] border-x-[1px] border-yellow-400/60 text-white py-1.5 px-3 flex flex-col items-center gap-0.5 active:bg-yellow-400/10 transition-all shadow-[0_0_20px_rgba(234,179,8,0.1)] group hover:border-yellow-300 relative overflow-hidden z-10 bg-black/10 backdrop-blur-[2px] 
                                ${hasUserData ? 'rounded-b-2xl rounded-t-none' : 'rounded-2xl'}
                                ${showBottomSheet ? 'opacity-80' : 'opacity-100'}
                            `}
                        >
                            {/* Top Row: Action & Price */}
                            <div className="w-full h-10 relative flex items-center justify-between gap-2">

                                {/* LEFT: Logo Group */}
                                <div className="flex items-center gap-2 relative z-30 shrink-0">
                                    {isProcessing ? (
                                        <Loader2 size={24} className="text-yellow-400 animate-spin" />
                                    ) : (
                                        <div className="h-10 w-16 flex items-center justify-start overflow-visible relative">
                                            <div className="absolute inset-0 bg-yellow-400/20 blur-lg rounded-full animate-pulse opacity-50" />
                                            <img src={mpesaLogo} className="h-[160%] w-auto object-contain object-left relative z-10" alt="M-Pesa" />
                                        </div>
                                    )}
                                </div>

                                {/* CENTER: CTA */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                                    {isProcessing ? (
                                        <span className="text-[10px] font-black italic tracking-tighter uppercase leading-none text-yellow-400 animate-pulse">
                                            PROCESSING
                                        </span>
                                    ) : (
                                        <div className="flex flex-col items-center leading-none animate-pulse opacity-90">
                                            <span className="text-[7px] font-bold text-white/60 uppercase tracking-[0.2em]">TAP TO</span>
                                            <span className="text-xs font-black text-yellow-400 italic uppercase tracking-tighter drop-shadow-sm scale-y-110">ORDER NOW</span>
                                        </div>
                                    )}
                                </div>

                                {/* RIGHT: Price Box */}
                                <div className="relative z-30 ml-auto h-full flex items-center">
                                    <div className="bg-white/5 backdrop-blur-sm rounded-lg px-2 py-1 border border-white/10 flex flex-col items-end min-w-[70px]">
                                        <span className={`text-sm font-black italic tracking-tighter block leading-none drop-shadow-md transition-all duration-300 ${paymentMethod === 'cod' ? 'text-white/30' : 'text-white'}`}>
                                            <span className={`text-[9px] mr-1 ${paymentMethod === 'cod' ? 'text-white/30' : 'text-yellow-400'}`}>KES</span>
                                            {product.price.toLocaleString()}
                                        </span>

                                        {/* Smart Delivery Quote Logic */}
                                        {deliveryQuote ? (
                                            <span className={`font-black uppercase tracking-wide mt-0.5 block animate-in fade-in transition-all duration-300 ${paymentMethod === 'cod' ? 'text-yellow-400 text-[10px] drop-shadow-sm' : 'text-yellow-400 text-[7px]'}`}>
                                                + {deliveryQuote} Del.
                                            </span>
                                        ) : (
                                            <span className="text-[7px] font-black text-white/30 uppercase tracking-wide mt-0.5 block">
                                                + Delivery
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </button>
                    </div>

                    <div className="w-[100vw] -ml-6 flex items-center justify-center gap-2 pt-1 pb-0.5 px-4 backdrop-blur-[2px]">
                        <ShieldCheck size={12} className="text-emerald-500 shrink-0 animate-pulse" />
                        <span className="text-[9px] font-bold text-white leading-tight drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] text-center">
                            Secure Hold by SokoSnap: Funds released after verification on delivery.
                        </span>
                    </div>

                </div>
            </div>
        </div>
    );
};
