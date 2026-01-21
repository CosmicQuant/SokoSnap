import React, { useRef, useEffect, useState } from 'react';
import {
    Heart,
    MessageCircle,
    ShoppingBag,
    Share2,
    CheckCircle2,
    Phone,
    MapPin,
    Loader2,
    X,
    ShieldCheck,
    Map,
    Crosshair
} from 'lucide-react';
import { ActionBtn } from '../common/ActionBtn';
import { validateLocation, validatePhone } from '../../utils/validation';
import { CommentsOverlay } from './CommentsOverlay';
import { LocationPickerModal } from '../common/LocationPickerModal';
import mpesaLogo from '../../assets/41.png';

interface FeedItemProps {
    product: any;
    cart: any[];
    onAddToCart: (product: any) => void;
    userData: { phone: string; location: string };
    setUserData: React.Dispatch<React.SetStateAction<{ phone: string; location: string; name: string }>>;
    onCheckout: () => void;
    isProcessing: boolean;
    deliveryQuote: number | null;
    onView?: (seller: { name: string, handle: string }) => void;
}

export const FeedItem: React.FC<FeedItemProps> = ({
    product,
    cart,
    onAddToCart,
    userData,
    setUserData,
    onCheckout,
    isProcessing,
    deliveryQuote,
    onView
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const carouselRef = useRef<HTMLDivElement>(null);

    // Desktop Drag State
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const [showInputs, setShowInputs] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [errors, setErrors] = useState<{ phone?: string; location?: string }>({});

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
    }, []);

    const handleActionClick = () => {
        // Clear previous errors
        setErrors({});

        // 1. If fields are not visible and data is missing, show them
        if ((!userData.phone || !userData.location) && !showInputs) {
            setShowInputs(true);
            return;
        }

        // 2. Validate if inputs are shown or if we differ from empty
        // If inputs are now visible (or user thinks they are done), validate

        // Validate Phone
        const phoneRes = validatePhone(userData.phone);
        if (!phoneRes.isValid) {
            setErrors(prev => ({ ...prev, phone: phoneRes.error }));
            setShowInputs(true); // Ensure inputs are visible to show error
            return;
        }

        // Validate Location
        const locRes = validateLocation(userData.location);
        if (!locRes.isValid) {
            setErrors(prev => ({ ...prev, location: locRes.error }));
            setShowInputs(true);
            return;
        }

        // 3. If all valid, checkout
        onCheckout();
    };

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Check out ${product.name} on SokoSnap`,
                    text: product.description,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback for desktop or non-supported
            alert("Link copied to clipboard!");
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
        <div ref={containerRef} className="h-screen w-full snap-start relative flex flex-col bg-black overflow-hidden shrink-0">
            {/* Media Layer (Carousel) */}
            <div
                ref={carouselRef}
                className={`absolute inset-0 z-0 flex overflow-x-auto snap-x snap-mandatory hide-scrollbar ${isDragging ? 'cursor-grabbing snap-none' : 'cursor-grab'}`}
                onScroll={handleScroll}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            >
                {slides.map((slide: any, index: number) => (
                    <div key={index} className="w-full h-full shrink-0 snap-center relative">
                        {slide.type === 'video' ? (
                            <video
                                ref={index === activeSlide ? videoRef : null}
                                loop
                                muted
                                playsInline
                                className="h-full w-full object-cover opacity-90"
                                src={slide.url}
                            // poster={slide.url + '#t=0.1'} // Removed to prevent CORB / blocking issues
                            />
                        ) : (
                            <img src={slide.url} className="h-full w-full object-cover opacity-90" alt={product.name} />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20 pointer-events-none" />
                    </div>
                ))}
            </div>

            {/* Smart Dots Indicator */}
            {slides.length > 1 && !showInputs && (
                <div className="absolute bottom-48 left-0 right-0 z-50 flex justify-center gap-1.5 fade-in pointer-events-auto">
                    {slides.map((_: any, i: number) => (
                        <button
                            key={i}
                            onClick={(e) => {
                                e.stopPropagation();
                                scrollToSlide(i);
                            }}
                            className={`rounded-full transition-all duration-300 shadow-sm cursor-pointer hover:scale-125 ${i === activeSlide
                                ? 'w-4 h-1.5 bg-yellow-500'
                                : 'w-1.5 h-1.5 bg-white/40'
                                }`}
                        />
                    ))}
                </div>
            )}

            {/* Comments Overlay */}
            {showComments && <CommentsOverlay onClose={() => setShowComments(false)} />}


            {/* Action Sidebar */}
            {!showMap && (
                <div className="absolute right-4 bottom-40 z-40 flex flex-col items-center gap-6 animate-in fade-in duration-300">
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
                        icon={<ShoppingBag size={28} className={`drop-shadow-lg transition-colors duration-300 ${isInCart ? 'text-green-500 fill-green-500/20' : 'text-white'}`} />}
                        onClick={(e) => {
                            e?.stopPropagation();
                            onAddToCart(product);
                        }}
                        count={cartItemQuantity}
                        className={isInCart ? "bg-white/20 rounded-full" : ""}
                    />
                </div>
            )}

            {/* Bottom Information Stack */}
            <div className="relative z-30 mt-auto p-6 pb-6 space-y-6 max-w-[85%]">

                {/* Title & Description */}
                <div className="space-y-1">
                    <div
                        className="w-fit flex items-center gap-2 mb-1 cursor-pointer active:scale-95 transition-transform origin-left"
                        onClick={(e) => {
                            e.stopPropagation();
                            onView?.({ name: product.seller, handle: product.handle });
                        }}
                    >
                        <div className="w-5 h-5 rounded-full border border-yellow-500/50 overflow-hidden shadow-lg">
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
                        className="w-fit cursor-pointer group/desc relative"
                    >
                        <p
                            id={`desc-${product.id}`}
                            className={`text-white/50 text-[9px] font-bold uppercase tracking-wider drop-shadow-md transition-all duration-300 ${isExpanded ? '' : 'line-clamp-2'}`}
                        >
                            {product.description}
                        </p>

                        {/* Only show 'Read More' if text is likely to overflow (primitive check) or 'Show Less' if expanded */}
                        {(product.description.length > 80 || isExpanded) && (
                            <span className="inline-block mt-1 text-yellow-500 text-[9px] font-black uppercase tracking-wider border-b border-yellow-500/30 group-hover/desc:border-yellow-500 transition-colors">
                                {isExpanded ? 'Show Less' : 'Read More'}
                            </span>
                        )}
                    </div>
                </div>

                {/* SMART INPUT TRAY */}
                {showInputs && (
                    <div className="animate-in slide-in-from-bottom duration-300 space-y-3 pb-2 relative">
                        {/* Close/Collapse Button */}
                        <button
                            onClick={() => setShowInputs(false)}
                            className="absolute -top-8 right-0 text-white/50 hover:text-white bg-black/20 rounded-full p-1"
                        >
                            <X size={16} />
                        </button>

                        {/* Phone Input */}
                        <div className="relative group">
                            <div className="relative">
                                <Phone size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${errors.phone ? 'text-red-400' : 'text-white/60 group-focus-within:text-yellow-500'}`} />
                                <input
                                    type="tel"
                                    placeholder="M-Pesa Number (e.g. 0712...)"
                                    autoFocus
                                    value={userData.phone}
                                    onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                                    className={`w-full bg-white/5 backdrop-blur-md border rounded-xl py-2.5 pl-9 pr-3 text-xs font-bold text-white placeholder:text-white/30 outline-none transition-all ${errors.phone ? 'border-red-400/50 focus:border-red-500' : 'border-white/20 focus:border-yellow-500/50'
                                        }`}
                                />
                            </div>
                            {errors.phone && <span className="text-[9px] text-red-400 font-bold ml-1">{errors.phone}</span>}
                        </div>

                        {/* Location Input with NEW Controls */}
                        <div className="relative group">
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <MapPin size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${errors.location ? 'text-red-400' : 'text-white/60 group-focus-within:text-yellow-500'}`} />
                                    <input
                                        type="text"
                                        placeholder="Location (Google Places)"
                                        value={userData.location}
                                        onChange={(e) => setUserData(prev => ({ ...prev, location: e.target.value }))}
                                        className={`w-full bg-white/5 backdrop-blur-md border rounded-xl py-2.5 pl-9 pr-3 text-xs font-bold text-white placeholder:text-white/30 outline-none transition-all ${errors.location ? 'border-red-400/50 focus:border-red-500' : 'border-white/20 focus:border-yellow-500/50'
                                            }`}
                                    />
                                </div>
                                <button
                                    onClick={() => {
                                        if (navigator.geolocation) {
                                            navigator.geolocation.getCurrentPosition((pos) => {
                                                setUserData(prev => ({ ...prev, location: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)} (GPS)` }));
                                            });
                                        }
                                    }}
                                    className="w-10 bg-white/5 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center text-white/70 hover:text-green-400 hover:border-green-400/50 transition-colors"
                                    title="Use Current Location"
                                >
                                    <Crosshair size={18} />
                                </button>
                                <button
                                    onClick={() => setShowMap(true)}
                                    className="w-10 bg-white/5 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center text-white/70 hover:text-yellow-400 hover:border-yellow-400/50 transition-colors"
                                    title="Pin on Map"
                                >
                                    <Map size={18} />
                                </button>
                            </div>
                            {errors.location && <span className="text-[9px] text-red-400 font-bold ml-1">{errors.location}</span>}
                        </div>

                    </div>
                )}

                <LocationPickerModal
                    isOpen={showMap}
                    onClose={() => setShowMap(false)}
                    onSelectLocation={(loc) => {
                        setUserData(prev => ({ ...prev, location: loc.address }));
                        setShowMap(false);
                    }}
                />

                <div className="relative w-[120%] group/btn">
                    {/* EDITABLE USER DATA HINT (Full-width Tab) */}
                    {hasUserData && !showInputs && (
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowInputs(true);
                            }}
                            className="absolute bottom-full mb-[-2px] inset-x-0 z-0 bg-yellow-500 border border-yellow-400 rounded-t-xl py-0.5 flex items-center justify-center cursor-pointer hover:bg-yellow-400 transition-colors"
                        >
                            <span className="text-[10px] font-medium text-black tracking-tight flex items-center gap-1.5">
                                <span>Using {userData.phone} • {userData.location}</span>
                                <span className="border-b border-black/50 opacity-70 text-[9px]">Edit</span>
                            </span>
                        </div>
                    )}

                    {/* THE GOLDEN GLASS BUTTON */}
                    <button
                        onClick={handleActionClick}
                        className={`w-full border-y-[2px] border-x-[1px] border-yellow-500/60 text-white py-1.5 px-3 flex flex-col items-center gap-0.5 active:bg-yellow-500/10 transition-all shadow-[0_0_20px_rgba(234,179,8,0.1)] group hover:border-yellow-400 relative overflow-hidden z-10 bg-black/10 backdrop-blur-[2px] ${hasUserData && !showInputs ? 'rounded-b-2xl rounded-t-none' : 'rounded-2xl'
                            }`}
                    >
                        {/* Top Row: Action & Price */}
                        <div className="w-full h-10 relative flex items-center justify-between gap-2">

                            {/* LEFT: Logo Group */}
                            <div className="flex items-center gap-2 relative z-30 shrink-0">
                                {isProcessing ? (
                                    <Loader2 size={24} className="text-yellow-500 animate-spin" />
                                ) : (
                                    <div className="h-10 w-16 flex items-center justify-start overflow-visible relative">
                                        <div className="absolute inset-0 bg-yellow-500/20 blur-lg rounded-full animate-pulse opacity-50" />
                                        <img src={mpesaLogo} className="h-[160%] w-auto object-contain object-left relative z-10" alt="M-Pesa" />
                                    </div>
                                )}
                            </div>

                            {/* CENTER: CTA */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                                {isProcessing ? (
                                    <span className="text-[10px] font-black italic tracking-tighter uppercase leading-none text-yellow-500 animate-pulse">
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
                                    <span className="text-sm font-black italic tracking-tighter block leading-none text-white drop-shadow-md">
                                        <span className="text-yellow-500 text-[9px] mr-1">KES</span>
                                        {product.price.toLocaleString()}
                                    </span>

                                    {/* Smart Delivery Quote Logic */}
                                    {deliveryQuote ? (
                                        <span className="text-[7px] font-black text-green-400 uppercase tracking-wide mt-0.5 block animate-in fade-in">
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

                        {/* Bottom Row: Trust Signal (Compact) */}
                        <div className="w-full flex items-center justify-center gap-1.5 pt-1 mt-0.5 border-t border-white/5">
                            <ShieldCheck size={10} className="text-green-400 shrink-0" />
                            <span className="text-[7px] font-bold text-white/90 uppercase tracking-wide drop-shadow-md text-center leading-tight">
                                Protected by TumaFast. Payment released only after you inspect & accept.
                            </span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};
