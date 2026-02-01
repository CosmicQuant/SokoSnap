import React, { useState, useEffect, useRef } from 'react';
import {
    CheckCircle2,
    ArrowRight,
    ShieldCheck,
    Zap,
    Store,
    Loader2,
    Lock,
    ChevronRight,
    Globe,
    TrendingUp,
    MapPin,
    Navigation,
    PlusCircle,
    LogOut,
    Instagram,
    MessageCircle,
    Share2 as Share2Icon,
    MousePointer2,
    Link as LinkIcon,
    Copy,
    BrainCircuit
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { LocationPickerModal } from '../common/LocationPickerModal';
import { AuthModal } from './AuthModal';
import { SellerDashboard } from './SellerDashboard';
import { SellerInfoPages } from './SellerInfoPages';
import { useAuthStore } from '../../store';

// --- HELPER COMPONENTS ---

const InfiniteMarquee = ({ children, direction = "left", speed = 20 }: { children: React.ReactNode, direction?: "left" | "right", speed?: number }) => {
    return (
        <div className="overflow-hidden flex w-full relative">
            <motion.div
                className="flex gap-16 min-w-full items-center shrink-0 py-4 px-4"
                initial={{ x: direction === "left" ? 0 : "-100%" }}
                animate={{ x: direction === "left" ? "-100%" : 0 }}
                transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
            >
                {children}
                {children}
            </motion.div>
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        </div>
    );
};

// --- SOCIAL ICONS (REAL LOGOS) ---

export const InstagramLogo = ({ size = 24 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <radialGradient id="insta-gradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(6.5 23) rotate(-57.947) scale(29.155 28.3276)">
                <stop offset="0" stopColor="#FFC107" />
                <stop offset="0.5" stopColor="#F44336" />
                <stop offset="1" stopColor="#9C27B0" />
            </radialGradient>
        </defs>
        <path fillRule="evenodd" clipRule="evenodd" d="M12 0C8.741 0 8.332 0.014 7.052 0.072C2.695 0.272 0.273 2.69 0.073 7.052C0.014 8.333 0 8.741 0 12C0 15.259 0.014 15.668 0.073 16.948C0.273 21.306 2.69 23.728 7.052 23.928C8.332 23.986 8.741 24 12 24C15.259 24 15.668 23.986 16.948 23.928C21.302 23.728 23.73 21.31 23.927 16.948C23.986 15.668 24 15.259 24 12C24 8.741 23.986 8.333 23.927 7.052C23.73 2.699 21.302 0.272 16.948 0.072C15.668 0.014 15.259 0 12 0ZM12 2.162C15.204 2.162 15.584 2.174 16.85 2.232C20.102 2.38 21.621 3.902 21.769 7.15C21.827 8.416 21.838 8.796 21.838 12C21.838 15.204 21.827 15.584 21.769 16.85C21.621 20.098 20.102 21.62 16.85 21.768C15.584 21.826 15.204 21.838 12 21.838C8.796 21.838 8.416 21.826 7.15 21.768C3.894 21.62 2.38 20.098 2.231 16.85C2.173 15.584 2.162 15.204 2.162 12C2.162 8.796 2.173 8.416 2.231 7.15C2.38 3.902 3.894 2.38 7.15 2.232C8.416 2.174 8.796 2.162 12 2.162ZM12 5.838C8.597 5.838 5.838 8.597 5.838 12C5.838 15.403 8.597 18.162 12 18.162C15.403 18.162 18.162 15.403 18.162 12C18.162 8.597 15.403 5.838 12 5.838ZM12 16C9.791 16 8 14.209 8 12C8 9.791 9.791 8 12 8C14.209 8 16 9.791 16 12C16 14.209 14.209 16 12 16ZM18.406 4.155C17.61 4.155 16.965 4.8 16.965 5.595C16.965 6.39 17.61 7.035 18.406 7.035C19.201 7.035 19.845 6.39 19.845 5.595C19.845 4.8 19.201 4.155 18.406 4.155Z" fill="url(#insta-gradient)" />
    </svg>
);

export const WhatsAppLogo = ({ size = 24 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M12.007 0C5.378 0 0 5.377 0 12.006C0 14.12 0.55 16.182 1.597 18L0.05 23.636L5.823 22.122C7.575 23.078 9.57 23.582 11.996 23.582H12.006C18.634 23.582 24 18.271 24 11.996C24 5.388 18.625 0 12.007 0ZM12.007 21.602H11.997C9.96 21.602 8.01 21.056 6.34 20.066L5.94 19.83L2.52 20.728L3.43 17.39L3.17 16.974C2.09 15.26 1.52 13.33 1.52 11.996C1.52 6.216 6.22 1.518 12.007 1.518C17.78 1.518 22.48 6.216 22.48 11.996C22.48 17.786 17.79 21.602 12.007 21.602ZM17.71 14.39C17.4 14.23 15.86 13.47 15.57 13.37C15.29 13.27 15.08 13.22 14.87 13.53C14.66 13.84 14.06 14.54 13.88 14.75C13.7 14.95 13.51 14.98 13.21 14.82C12.91 14.67 11.93 14.35 10.77 13.32C9.87 12.51 9.27 11.52 8.97 11.01C8.67 10.49 8.94 10.21 9.09 10.06C9.22 9.93 9.38 9.72 9.54 9.54C9.69 9.35 9.74 9.22 9.85 9.01C9.95 8.8 9.9 8.62 9.82 8.46C9.74 8.29 9.12 6.78 8.86 6.16C8.61 5.56 8.36 5.64 8.16 5.64L7.59 5.63C7.38 5.63 7.04 5.71 6.75 6.02C6.46 6.33 5.64 7.1 5.64 8.67C5.64 10.23 6.78 11.75 6.94 11.96C7.1 12.17 9.17 15.36 12.33 16.73C13.08 17.05 13.67 17.25 14.13 17.39C14.96 17.65 15.72 17.63 16.32 17.54C16.98 17.44 18.35 16.71 18.64 15.91C18.93 15.11 18.93 14.42 18.84 14.27C18.75 14.12 18.52 14.03 18.22 13.88L17.71 14.39Z" fill="#25D366" />
    </svg>
);

export const FacebookLogo = ({ size = 24 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 17.9895 4.3882 22.954 10.125 23.8534V15.4688H7.07813V12H10.125V9.35625C10.125 6.34875 11.9166 4.6875 14.6576 4.6875C15.9701 4.6875 17.3438 4.92188 17.3438 4.92188V7.875H15.8306C14.34 7.875 13.875 8.8 13.875 9.75V12H17.2031L16.6711 15.4688H13.875V23.8534C19.6118 22.954 24 17.9895 24 12Z" fill="#1877F2" />
    </svg>
);

const TikTokLogo = ({ size = 24 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.5898 9.99986C18.9959 10.0097 18.4116 10.1601 17.8931 10.4363C17.3745 10.7125 16.9395 11.1049 16.6301 11.5755V0H12.9248V17.0734C12.8711 17.817 12.6074 18.52 12.1643 19.1021C11.7212 19.6841 11.1165 20.122 10.4199 20.3653C9.72318 20.6087 8.96265 20.6476 8.22557 20.4777C7.48849 20.3079 6.80496 19.9362 6.25368 19.4055C5.70241 18.8748 5.30571 18.2069 5.10931 17.4785C4.91292 16.75 4.92472 15.9904 5.14336 15.2868C5.362 14.5832 5.77864 13.9642 6.34538 13.5015C6.91212 13.0388 7.6057 12.7512 8.3458 12.6718V8.92723C6.67134 9.07065 5.09349 9.77883 3.86475 10.9382C2.63601 12.0975 1.82672 13.6403 1.56497 15.3204C1.30321 17.0006 1.60417 18.7208 2.41968 20.2076C3.23519 21.6946 4.51817 22.8617 6.06202 23.5218C7.60588 24.1818 9.32039 24.2965 10.9329 23.8475C12.5453 23.3985 13.962 22.4116 14.9568 21.0439C15.9515 19.6762 16.4673 18.0054 16.4216 16.297V6.09549C17.4897 6.86423 18.7845 7.2798 20.1011 7.27649V3.53503C18.6672 3.53503 17.2917 2.96425 16.2778 1.94828C15.2638 0.932306 14.6942 -0.445902 14.6942 -1.88247H18.4285C18.4285 -0.902266 18.8172 0.0378618 19.5085 0.730335C20.1997 1.42281 21.1374 1.81156 22.1162 1.81156V5.553C21.2847 5.5492 20.4571 5.42065 19.6738 5.17409C18.2711 6.30239 17.5191 8.08339 17.5936 9.88242" fill="black" />
    </svg>
);

const YoutubeLogo = ({ size = 24 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.498 6.186C23.225 5.145 22.411 4.331 21.371 4.058C19.505 3.558 12.001 3.558 12.001 3.558C12.001 3.558 4.497 3.558 2.631 4.058C1.59 4.331 0.776 5.145 0.503 6.186C0 8.053 0 12 0 12C0 12 0 15.947 0.503 17.814C0.776 18.855 1.59 19.669 2.631 19.942C4.497 20.442 12.001 20.442 12.001 20.442C12.001 20.442 19.505 20.442 21.371 19.942C22.411 19.669 23.225 18.855 23.498 17.814C24 15.947 24 12 24 12C24 12 24 8.053 23.498 6.186ZM9.544 15.568V8.432L15.819 12L9.544 15.568Z" fill="#ff0000" />
    </svg>
);

// --- TRUST BAR COMPONENT (REMOVED) ---
// const TrustBar = () => ...

// --- INTERACTIVE PHONE SIMULATOR ---
const InteractiveSolutions = () => {
    const [activeFeature, setActiveFeature] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const features = [
        {
            title: "Universal Secure Checkout Links",
            desc: "One bio link for TikTok, WhatsApp, IG & Facebook. No more 'DM for details'.",
            icon: <Globe size={20} />,
            screenColor: "bg-blue-600",
            screenContent: (
                <div className="text-center p-6 text-white">
                    <div className="bg-white/20 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center backdrop-blur-md">
                        <Globe size={32} />
                    </div>
                    <h3 className="font-black text-2xl italic mb-2">BIO LINK</h3>
                    <div className="space-y-2">
                        <div className="bg-white/10 p-3 rounded-xl text-xs font-bold flex items-center gap-2"><Instagram size={14} /> Shop on IG</div>
                        <div className="bg-white/10 p-3 rounded-xl text-xs font-bold flex items-center gap-2"><MessageCircle size={14} /> Shop on WhatsApp</div>
                    </div>
                </div>
            )
        },
        {
            title: "Instant Secure Mpesa Payments",
            desc: "We hold the buyer's money safely. You get paid instantly upon delivery verification.",
            icon: <ShieldCheck size={20} />,
            screenColor: "bg-black",
            screenContent: (
                <div className="text-center p-6 text-white">
                    <div className="bg-green-500/20 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center border-2 border-green-500">
                        <Lock size={32} className="text-green-500" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-green-500 mb-1">SECURE HOLD</p>
                    <h3 className="font-black text-3xl italic mb-1">KES 4,500</h3>
                    <p className="text-xs opacity-60">Locked in Vault</p>
                </div>
            )
        },
        {
            title: "Automatic Delivery",
            desc: "TumaFast riders are dispatched automatically the moment a customer pays.",
            icon: <Zap size={20} />,
            screenColor: "bg-yellow-500",
            screenContent: (
                <div className="text-center p-6 text-black">
                    <div className="bg-black/10 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Zap size={32} fill="currentColor" />
                    </div>
                    <h3 className="font-black text-2xl italic mb-2">RIDER ACTIVE</h3>
                    <div className="bg-black text-white p-3 rounded-xl flex items-center gap-3 text-left">
                        <div className="w-8 h-8 bg-slate-800 rounded-full shadow-inner" />
                        <div>
                            <p className="text-[10px] font-bold">Courier #294</p>
                            <p className="text-[8px] opacity-60">Arriving in 12m</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "AI Growth Insights",
            desc: "Our AI predicts your best selling times and suggests price optimizations.",
            icon: <TrendingUp size={20} />,
            screenColor: "bg-blue-600",
            screenContent: (
                <div className="text-center p-6 text-white">
                    <div className="bg-white/20 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <BrainCircuit size={32} className="text-white animate-pulse" />
                    </div>
                    <h3 className="font-black text-2xl italic mb-4">AI ANALYTICS</h3>
                    <div className="flex gap-2 justify-center items-end h-24 pb-2">
                        <div className="w-4 bg-white/30 h-[40%] rounded-t-lg"></div>
                        <div className="w-4 bg-white/50 h-[60%] rounded-t-lg"></div>
                        <div className="w-4 bg-white/70 h-[50%] rounded-t-lg"></div>
                        <div className="w-4 bg-white h-[85%] rounded-t-lg shadow-[0_0_15px_rgba(255,255,255,0.5)]"></div>
                        <div className="w-4 bg-white/40 h-[70%] rounded-t-lg"></div>
                    </div>
                </div>
            )
        }
    ];

    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % features.length);
        }, 2000);
        return () => clearInterval(interval);
    }, [isPaused, features.length]);

    return (
        <div className="py-24 bg-slate-50 border-y border-slate-200">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16 space-y-6 max-w-3xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
                        Everything you need <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-yellow-500">to run your store online.</span>
                    </h2>
                    <div className="inline-flex items-center gap-2 mb-2 px-3 py-1">
                        <span className="text-sm font-medium text-slate-500">Simple enough for a side-hustle. Powerful enough for an enterprise.</span>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Desktop: Feature List */}
                    <div className="hidden lg:block space-y-4">
                        {features.map((feature, idx) => (
                            <div
                                key={idx}
                                onMouseEnter={() => { setActiveFeature(idx); setIsPaused(true); }}
                                onMouseLeave={() => setIsPaused(false)}
                                onClick={() => { setActiveFeature(idx); setIsPaused(true); }}
                                className={`p-6 rounded-3xl cursor-pointer transition-all duration-300 border ${activeFeature === idx
                                    ? 'bg-white border-slate-200 shadow-xl scale-105'
                                    : 'bg-transparent border-transparent opacity-60 hover:opacity-100'
                                    }`}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`p-2 rounded-lg ${activeFeature === idx ? 'bg-yellow-500 text-black' : 'bg-slate-200 text-slate-500'}`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="font-black text-lg uppercase italic tracking-tight">{feature.title}</h3>
                                </div>
                                <p className="text-sm font-medium text-slate-500 pl-11">{feature.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col items-center w-full relative">
                        <div className="relative flex justify-center items-center h-[540px] lg:h-[600px] perspective-1000 w-full px-4 overflow-visible">
                            {/* Phone Container: Thinner on Mobile, Rotated Left on Desktop */}
                            <div className="relative w-[240px] lg:w-[300px] h-[500px] lg:h-[580px] bg-slate-900 rounded-[2.5rem] lg:rounded-[3rem] border-[6px] lg:border-8 border-slate-900 shadow-2xl overflow-hidden transition-all duration-500 lg:-rotate-y-12 dark-phone-shadow z-10 group">
                                {/* SCREEN CONTENT */}
                                <div className={`flex absolute inset-0 items-center justify-center transition-colors duration-500 ${features[activeFeature]?.screenColor}`}>
                                    {/* VISIBLE ON BOTH MOBILE AND DESKTOP */}
                                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 origin-center lg:transform-none transform scale-90">
                                        {features[activeFeature]?.screenContent}
                                    </div>
                                </div>

                                {/* BEZEL REFLECTIONS */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 lg:w-32 h-5 lg:h-6 bg-black rounded-b-2xl z-20 pointer-events-none" />
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-30" />
                            </div>

                            {/* Background Glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-yellow-500/20 blur-[100px] -z-10" />

                            {/* MOBILE FLOATING FEATURES - Zig-Zag Layout */}
                            <div className="lg:hidden absolute inset-0 z-20 pointer-events-none">
                                {features.map((feature, idx) => {
                                    const isRight = idx % 2 !== 0; // 0: Left, 1: Right, 2: Left, 3: Right
                                    const topOffset = 2 + (idx * 23); // Spaced vertically: 2%, 25%, 48%, 71%

                                    return (
                                        <div
                                            key={idx}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveFeature(idx);
                                                setIsPaused(true);
                                            }}
                                            className={`absolute w-[45%] flex flex-col gap-1.5 transition-all duration-500 cursor-pointer pointer-events-auto ${isRight ? 'right-0 items-end text-right' : 'left-0 items-start text-left'
                                                }`}
                                            style={{ top: `${topOffset}%` }}
                                        >
                                            <div className={`
                                                p-2.5 rounded-xl backdrop-blur-md border shadow-lg transition-all duration-300
                                                ${activeFeature === idx
                                                    ? 'bg-slate-900/95 border-yellow-500 text-yellow-500 scale-110 z-30 shadow-yellow-500/20'
                                                    : 'bg-slate-900/80 border-white/10 text-slate-300 z-10'}
                                            `}>
                                                {React.cloneElement(feature.icon as React.ReactElement<any>, { size: 20 })}
                                            </div>
                                            <div className={`mt-1 ${activeFeature === idx ? 'opacity-100 scale-105' : 'opacity-90'} transition-transform duration-300`}>
                                                <h3 className="font-black text-slate-900 text-[11px] sm:text-xs uppercase italic tracking-wide leading-tight bg-white px-3 py-1.5 rounded-lg shadow-md inline-block max-w-full border-2 border-slate-100">
                                                    {feature.title}
                                                </h3>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- POSITIVE EARNING CALCULATOR ---
const RevenueCalculator = ({ onAction }: { onAction: () => void }) => {
    const [commentCount, setCommentCount] = useState(15);
    const avgPrice = 4500;
    const conversionRate = 0.25;
    const potentialRevenue = commentCount * avgPrice * conversionRate * 30;

    return (
        <div className="bg-slate-900 text-white py-24 relative overflow-hidden">
            <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter mb-4">How Much Could You <span className="text-green-500">Earn?</span></h2>
                <p className="text-slate-400 mb-12">Drag the slider to match your daily <b>Price Comments</b>.</p>

                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[2.5rem] max-w-2xl mx-auto">
                    <div className="mb-8">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">
                            <span>5 Comments</span>
                            <span>100+ Comments</span>
                        </div>
                        <input
                            type="range"
                            min="5" max="100"
                            value={commentCount}
                            onChange={(e) => setCommentCount(Number(e.target.value))}
                            className="w-full h-3 bg-slate-700 rounded-full appearance-none cursor-pointer accent-green-500"
                        />
                        <p className="text-center mt-6 font-black text-green-500 text-2xl">{commentCount} Price Comments / Day</p>
                    </div>

                    <div className="border-t border-white/10 pt-8">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Estimated Monthly Revenue</p>
                        <p className="text-5xl md:text-6xl font-black text-white italic tracking-tighter transition-all duration-300">KES {potentialRevenue.toLocaleString()}</p>
                        <p className="text-xs text-green-400 font-bold mt-4 flex items-center justify-center gap-2">
                            <TrendingUp size={16} /> Unlocked via SokoSnap Checkout
                        </p>
                    </div>
                </div>

                <button onClick={onAction} className="mt-12 px-12 py-5 bg-green-500 text-black rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-xl shadow-green-500/20 flex items-center gap-2 mx-auto">
                    <TrendingUp size={16} fill="currentColor" /> Start Earning More Now
                </button>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---

const SellerLandingPage = () => {
    // Initialize step from URL param ?view=dashboard or default to 'hero'
    const [step, setStep] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get('view') || 'hero';
    });
    const { user, isAuthenticated, isInitialized, initialize, logout, openAuthModal, becomeSeller } = useAuthStore();
    const scrollRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll({ container: scrollRef });
    const navBackground = useTransform(scrollY, [0, 50], ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.8)"]);
    const navBackdrop = useTransform(scrollY, [0, 50], ["blur(0px)", "blur(12px)"]);

    // Initialize Firebase auth listener on mount
    useEffect(() => {
        const unsubscribe = initialize();
        return () => unsubscribe();
    }, [initialize]);

    // Handle initial redirect Logic
    useEffect(() => {
        if (!isInitialized) return;

        if (isAuthenticated && user) {
            if (user.type === 'verified_merchant' && step === 'hero') {
                setStep('dashboard');
            } else if (user.type !== 'verified_merchant' && step === 'dashboard') {
                setStep('register');
            }
        }
    }, [isInitialized, isAuthenticated, user, step]);

    // Auth & Form State
    const [showAuthWarning, setShowAuthWarning] = useState(false);
    const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
    const [mpesaType, setMpesaType] = useState('personal');

    // === NEW ANIMATION STATE ===
    const [isStep1Visible, setIsStep1Visible] = useState(false);

    const [formData, setFormData] = useState({
        shopName: '', locationRequest: '', locationName: '', latitude: null as number | null, longitude: null as number | null,
        contactName: '', contactPhone: '', email: '', kraPin: '',
        mpesaNumber: '', tillNumber: '', paybillNumber: '', accountNumber: '',
        whatsapp: '', instagram: '', tiktok: '', facebook: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- NEW STATE & LOGIC ---
    const [platformIndex, setPlatformIndex] = useState(0);

    // Platform Brand Colors & Gradients
    const platforms = [
        { name: 'Instagram', color: 'text-transparent bg-clip-text bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045]' },
        { name: 'TikTok', color: 'text-black [text-shadow:-2px_0_#25F4EE,2px_0_#FE2C55]' },
        { name: 'WhatsApp', color: 'text-[#25D366]' },
        { name: 'Facebook', color: 'text-[#1877F2]' },
        { name: 'Online Shops', color: 'text-yellow-500' }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setPlatformIndex((prev) => (prev + 1) % platforms.length);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Initial Loading State
    if (!isInitialized || (isAuthenticated && !user)) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="animate-spin text-slate-900" size={48} />
            </div>
        );
    }

    const handleLocationSelect = (location: { address: string; lat: number; lng: number }) => {
        setFormData(prev => ({
            ...prev, locationName: location.address, locationRequest: location.address, latitude: location.lat, longitude: location.lng
        }));
    };

    const handleCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData(prev => ({
                        ...prev, locationName: "Current Device Location", locationRequest: "Current Device Location", latitude: position.coords.latitude, longitude: position.coords.longitude
                    }));
                },
                () => alert('Unable to retrieve location. Please check browser permissions.')
            );
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!user) { setShowAuthWarning(true); return; }
        setIsSubmitting(true);
        try {
            await becomeSeller({
                shopName: formData.shopName, shopLocation: formData.locationName, contactPerson: formData.contactName, contactPhone: formData.contactPhone,
            });
            setIsSubmitting(false);
            setStep('success');
        } catch (error) {
            console.error('Failed to register seller:', error);
            setIsSubmitting(false);
            alert('Failed to create shop. Please try again.');
        }
    };

    const handleGoogleSignIn = () => {
        openAuthModal('register');
        setShowAuthWarning(false);
    };

    const handleCallToAction = () => {
        if (isAuthenticated && user) {
            if (user.type === 'verified_merchant') {
                setStep('dashboard');
            } else {
                setStep('register');
            }
        } else {
            openAuthModal('register');
        }
    };

    return (
        <div ref={scrollRef} className="h-screen bg-white text-slate-900 font-sans selection:bg-yellow-200 overflow-y-auto overflow-x-hidden">


            {/* --- IMMERSIVE BACKGROUND --- */}
            {step === 'hero' && (
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-100/40 blur-[120px]" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-yellow-100/40 blur-[120px]" />
                    <div className="absolute top-[30%] left-[30%] w-[40%] h-[40%] rounded-full bg-pink-100/30 blur-[150px]" />
                </div>
            )}

            {/* --- NAVBAR --- */}
            {step !== 'dashboard' && (
                <motion.nav
                    style={{ backgroundColor: navBackground, backdropFilter: navBackdrop, borderBottom: "1px solid rgba(241, 245, 249, 0.5)" }}
                    className="flex justify-between items-center p-6 max-w-7xl mx-auto sticky top-0 z-50 transition-all rounded-b-[2rem]"
                >
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setStep('hero')}>
                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-900/20 transform -rotate-3 hover:rotate-0 transition-all">
                            <Store className="text-yellow-500" size={20} />
                        </div>
                        <span className="font-black italic text-2xl tracking-tighter text-slate-900">SokoSnap</span>
                    </div>
                    <div>
                        <button
                            onClick={() => {
                                if (user) {
                                    if (user.type === 'verified_merchant') { setStep('dashboard'); } else { setStep('register'); }
                                } else { openAuthModal('login'); }
                            }}
                            className="bg-slate-900 text-white text-[10px] sm:text-xs font-bold px-5 py-2.5 rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-200"
                        >
                            SELLER DASHBOARD
                        </button>
                    </div>
                </motion.nav>
            )}

            <AnimatePresence mode="wait">
                {step === 'hero' && (
                    <motion.div
                        key="hero"
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, y: -20 }}
                        className="relative z-10"
                    >
                        {/* HERO SECTION */}
                        <div className="max-w-7xl mx-auto px-6 pt-4 pb-8 lg:pb-12 relative z-10 lg:min-h-screen lg:flex lg:items-center">
                            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full">
                                {/* Mobile: Occupy full viewport height minus header to push image down */}
                                <div className="text-left animate-in slide-in-from-left duration-700 pt-4 lg:pt-0 lg:min-h-0 lg:block">

                                    {/* --- TOP BADGE (UNIFIED) --- */}
                                    <div className="flex mb-6 lg:mb-8">
                                        <div className="inline-flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-full px-5 py-2 self-start shadow-[0_0_20px_rgba(34,211,238,0.15)]">
                                            <BrainCircuit size={16} className="text-cyan-400 animate-pulse" />
                                            <div className="h-4 w-px bg-slate-700" />
                                            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] leading-none pt-0.5">
                                                <span className="text-cyan-400">AI-Powered</span> <span className="text-yellow-500">Universal Checkout</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* --- DYNAMIC BRANDED HEADLINE (FIXED 'FOR') --- */}
                                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black italic uppercase tracking-tighter leading-none mb-4 text-slate-900 py-2">
                                        The #1 <img src="/M-PESA_LOGO-01.svg.png" alt="M-PESA" className="inline-block h-12 sm:h-20 md:h-24 -mt-2 sm:-mt-6 ml-2 align-middle object-contain" /> <br />
                                        Secure Checkout For <br />
                                        <span className={`inline-block pr-4 transition-all duration-500 ${platforms[platformIndex]?.color}`}>
                                            {platforms[platformIndex]?.name}.
                                        </span>
                                    </h1>

                                    {/* --- REFINED SUB-HEADLINE: FOCUSING ON TRUST & FRICTION REMOVAL --- */}
                                    <p className="text-slate-500 text-sm md:text-base font-medium max-w-lg mb-6 leading-relaxed">
                                        Sell more, faster & securely by giving your customers <span className="font-bold text-slate-900">absolute confidence</span> to buy instantly. Eliminate <span className="font-bold text-slate-900">repetitive price and delivery questions</span> with a <span className="font-bold text-slate-900 bg-yellow-100 px-1 rounded">Verified Secure M-Pesa Checkout</span> with automatic delivery across Kenya.
                                    </p>

                                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                        <button onClick={handleCallToAction} className="px-8 py-4 md:px-10 md:py-5 bg-black text-white rounded-[2rem] font-black text-[10px] md:text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-2xl shadow-black/20 shrink-0">
                                            SET UP SECURE CHECKOUT <ArrowRight size={16} strokeWidth={3} className="text-yellow-500" />
                                        </button>

                                        {/* Social Proof Badge */}
                                        <div className="flex items-center gap-2 mt-2 sm:mt-0 sm:ml-2 bg-slate-50 px-4 py-3 rounded-[2rem] border border-slate-100 shadow-sm shrink-0">
                                            <div className="flex -space-x-3">
                                                {[1, 2, 3].map(i => (
                                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} alt="user" />
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-[9px] font-bold text-slate-500 leading-tight uppercase tracking-wide">Trusted by 500+ <br />Kenyan Merchants</p>
                                        </div>
                                    </div>

                                    {/* Spacer for Mobile to push image below fold */}
                                    <div className="h-[20vh] lg:hidden hidden"></div>
                                </div>

                                <div className="hidden lg:block relative animate-in slide-in-from-right duration-1000 delay-200">
                                    <div className="absolute inset-0 bg-yellow-400 rounded-[4rem] rotate-6 opacity-20 blur-2xl" />

                                    {/* HERO IMAGE: Kenyan Seller Celebrating */}
                                    <video
                                        src="/sokosnap.mp4"
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        className="relative rounded-[3rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] border-4 border-white object-cover h-[500px] w-full"
                                    />

                                    {/* TOP FLOATING CARD */}
                                    <div className="absolute -left-4 top-12 bg-white p-4 rounded-[2rem] shadow-2xl border border-green-100 flex items-center gap-3 animate-bounce delay-700 z-20 scale-90">
                                        <div className="bg-[#4CAF50] p-2.5 rounded-2xl text-white shadow-lg shadow-green-500/30">
                                            <MessageCircle size={24} fill="currentColor" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5 leading-none">M-PESA SECURED</p>
                                            <p className="text-lg font-black text-slate-900 tracking-tight leading-none mt-0.5">KES 14,500.00</p>
                                        </div>
                                    </div>

                                    {/* BOTTOM FLOATING CARD: UNIVERSAL LINKS */}
                                    <div className="absolute -right-4 -bottom-6 bg-yellow-500 text-black p-4 rounded-[2rem] shadow-xl flex items-center gap-3 animate-pulse delay-1000 z-20 border-4 border-white scale-90">
                                        <div className="bg-black p-2.5 rounded-2xl text-yellow-500 shadow-xl">
                                            <Globe size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-black/60 uppercase tracking-widest mb-0.5">UNIVERSAL LINKS</p>
                                            <p className="text-xl font-black text-black italic tracking-tighter leading-none">WORKS EVERYWHERE</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <InteractiveSolutions />

                        {/* STICKY BOTTOM CTA (REMOVED) */}

                        <style>{`
            @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
            .animate-marquee { animation: marquee 25s linear infinite; }
            .perspective-1000 { perspective: 1000px; }
            @media (min-width: 1024px) {
                .rotate-y-12 { transform: rotateY(-12deg) rotateX(5deg); }
            }
          `}</style>


                        {/* BENTO GRID FEATURES - MODERN (REMOVED) */}

                        {/* CTA SECTION (REMOVED) */}

                        {/* HOW IT WORKS (3-STEP - REFINED) */}
                        <div className="py-32 bg-slate-50 relative overflow-hidden">
                            {/* Animated Background Elements */}
                            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                            <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

                            <div className="max-w-7xl mx-auto px-6 relative z-10">
                                <div className="text-center max-w-3xl mx-auto mb-20">
                                    <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-900 mb-6">
                                        Start Selling in <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600">Minutes, Not Days.</span>
                                    </h2>
                                    <p className="text-slate-500 font-medium text-lg">
                                        Skip the DMs. Skip the "how much is delivery". Just paste your link and get paid.
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-3 gap-8 relative">
                                    {/* Desktop Connecting Line */}
                                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-yellow-300 via-blue-300 to-green-300 -translate-y-1/2 z-0 opacity-30" />

                                    {/* Step 1: Generate Link (UI Fragment) */}
                                    <motion.div
                                        onViewportEnter={() => setIsStep1Visible(true)}
                                        viewport={{ once: true, amount: 0.6 }}
                                        className="relative group z-10"
                                    >
                                        <div className="bg-yellow-400 rounded-[2.5rem] border border-yellow-500 shadow-xl overflow-hidden h-full flex flex-col">
                                            {/* Header */}
                                            <div className="p-6 pb-2 flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center font-black text-[10px] text-yellow-500 ring-4 ring-yellow-400/50">1</span>
                                                    <span className="text-xs font-black uppercase text-yellow-900/60 tracking-wider">Create</span>
                                                </div>
                                                <PlusCircle size={14} className="text-black" />
                                            </div>

                                            {/* UI VISUAL */}
                                            <div className="p-5 pt-2 flex-grow flex items-center justify-center relative overflow-hidden">
                                                {/* Card */}
                                                <div className={`w-full bg-white rounded-2xl p-4 shadow-xl border border-white/50 space-y-3 relative overflow-hidden transition-all duration-700 ease-out ${isStep1Visible ? 'rotate-0 shadow-2xl' : 'rotate-[-2deg]'}`}>

                                                    {/* Scanning Laser Effect Overlay - UPGRADED */}
                                                    {isStep1Visible && (
                                                        <div className="absolute inset-x-0 top-0 bottom-0 z-30 pointer-events-none rounded-2xl overflow-hidden">
                                                            {/* The Moving Scanner Bar */}
                                                            <div className="absolute left-0 right-0 h-10 -top-10 bg-gradient-to-b from-transparent via-cyan-400/50 to-cyan-400 z-10 animate-scan drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
                                                                <div className="absolute bottom-0 w-full h-[2px] bg-cyan-300 shadow-[0_0_15px_#22d3ee]" />
                                                            </div>
                                                            {/* Grid Overlay that appears only during detection phase */}
                                                            <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.1)_1px,transparent_1px)] bg-[size:16px_16px] animate-[fadeIn_0.5s_ease-out] opacity-30 mix-blend-overlay" />
                                                        </div>
                                                    )}

                                                    {/* Fake Fields - Simplified */}
                                                    <div className="h-2 w-1/3 bg-slate-100 rounded mb-4" />
                                                    <div className="space-y-2">
                                                        <div className="relative group/img overflow-hidden rounded-lg">
                                                            {/* AI Bounding Box Effect */}
                                                            <div className={`absolute inset-0 border-2 border-cyan-400/80 z-20 opacity-0 transition-opacity duration-500 rounded-lg ${isStep1Visible ? 'opacity-100 delay-300' : ''}`}>
                                                                <div className="absolute top-0 left-0 bg-cyan-400 text-black text-[6px] font-bold px-1.5 py-0.5 rounded-br shadow-sm">
                                                                    Sneakers Detected (99%)
                                                                </div>
                                                                {/* Corner Brackets */}
                                                                <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-300 -mt-px -mr-px" />
                                                                <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-300 -mb-px -ml-px" />
                                                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-300 -mb-px -mr-px" />
                                                            </div>

                                                            <div className="relative aspect-video w-full">
                                                                <img
                                                                    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400"
                                                                    alt="Sneaker Scan"
                                                                    className="w-full h-full object-cover rounded-lg bg-slate-100"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="h-8 w-full bg-slate-100 rounded-lg" />
                                                    </div>
                                                    {/* The Magic Button */}
                                                    <div className={`mt-4 py-3 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-wide transition-colors duration-300 delay-500 relative overflow-hidden ${isStep1Visible ? 'bg-yellow-500 text-black' : 'bg-black text-white'}`}>
                                                        <span className={`relative z-10 flex items-center gap-2 transition-opacity duration-300 delay-500 ${isStep1Visible ? 'opacity-0' : 'opacity-100'}`}>
                                                            <Zap size={12} fill="currentColor" /> Generate Link
                                                        </span>
                                                        <span className={`absolute inset-0 flex items-center justify-center gap-2 transition-opacity duration-300 delay-500 z-10 font-bold ${isStep1Visible ? 'opacity-100' : 'opacity-0'}`}>
                                                            <LinkIcon size={12} /> Link Ready!
                                                        </span>
                                                    </div>

                                                    {/* Cursor Animation - Moves to Button */}
                                                    <div className={`absolute transition-all duration-500 ease-in-out z-40 ${isStep1Visible ? 'opacity-0 right-1/2 bottom-2' : 'opacity-100 right-1/4 bottom-4'}`}>
                                                        <MousePointer2 className="fill-black text-white drop-shadow-xl stroke-white" size={24} />
                                                    </div>

                                                    {/* Generated Link Popover - Appears after "click" */}
                                                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] bg-white border-2 border-slate-900 rounded-xl p-3 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] transform transition-all duration-500 delay-[800ms] z-50 ${isStep1Visible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Your Branded Link</p>
                                                        <div className="flex items-center justify-between bg-yellow-50 rounded-lg p-2 border border-yellow-200">
                                                            <div className="flex items-center gap-2 min-w-0">
                                                                <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shrink-0">
                                                                    <LinkIcon size={10} className="text-black" />
                                                                </div>
                                                                <span className="text-[10px] font-black text-slate-900 truncate tracking-tight">soko.to/urbankicks/red-nikes-001</span>
                                                            </div>
                                                            <Copy size={10} className="text-yellow-600 shrink-0" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-6 pt-0 z-10">
                                                <h3 className="font-black text-lg text-black uppercase italic mb-2">Smart AI Scan</h3>
                                                <p className="text-sm text-yellow-900 font-bold leading-relaxed opacity-80">
                                                    Snap a photo. Our AI <span className="text-black font-black bg-white/20 px-1 rounded">generates details</span> & builds your checkout link instantly.
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Step 2: Share Link (WhatsApp UI) */}
                                    <motion.div
                                        whileHover={{ y: -10 }}
                                        viewport={{ once: true }}
                                        className="relative group z-10"
                                    >
                                        <div className="bg-blue-600 rounded-[2.5rem] border border-blue-500 shadow-xl overflow-hidden h-full flex flex-col">
                                            {/* Header */}
                                            <div className="p-6 pb-2 flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center font-black text-[10px] text-blue-600 ring-4 ring-blue-500/50">2</span>
                                                    <span className="text-xs font-black uppercase text-blue-200 tracking-wider">Share</span>
                                                </div>
                                                <Share2Icon size={14} className="text-white" />
                                            </div>

                                            {/* UI VISUAL */}
                                            <div className="p-5 pt-2 flex-grow flex items-center justify-center relative overflow-hidden">
                                                {/* Phone Screen Container */}
                                                <div className="w-full h-48 bg-[#efeae2] rounded-xl overflow-hidden relative shadow-lg border-4 border-slate-900 rotate-2 group-hover:rotate-0 transition-all duration-500 flex flex-col justify-end pb-4">
                                                    {/* WhatsApp Doodle Pattern Overlay */}
                                                    <div className="absolute inset-0 opacity-[0.4] bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-731a-11e7-99d4-d60b44c278d4.png')] bg-repeat bg-[length:400px_400px] mix-blend-multiply"></div>

                                                    {/* Chat Content */}
                                                    <div className="relative w-full px-3 space-y-3">

                                                        {/* Buyer Message (Incoming) */}
                                                        <div className="w-full flex justify-start">
                                                            <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-[0_1px_0.5px_rgba(0,0,0,0.13)] relative max-w-[85%]">
                                                                <div className="absolute top-0 -left-2 w-0 h-0 border-[8px] border-t-white border-l-transparent border-b-transparent border-r-white transform rotate-[0deg]"></div>
                                                                <p className="text-[10px] md:text-xs font-medium text-[#111b21] leading-tight">How much specifically for the red ones? 🤔</p>
                                                                <span className="text-[9px] text-slate-400 block text-right mt-1">11:41 AM</span>
                                                            </div>
                                                        </div>

                                                        {/* Seller Reply (Outgoing) */}
                                                        <div className="w-full flex justify-end">
                                                            <div className="bg-[#d9fdd3] p-3 rounded-lg rounded-tr-none shadow-[0_1px_0.5px_rgba(0,0,0,0.13)] relative max-w-[90%]">
                                                                <div className="absolute top-0 -right-2 w-0 h-0 border-[8px] border-t-[#d9fdd3] border-r-transparent border-b-transparent border-l-[#d9fdd3] transform rotate-[0deg]"></div>

                                                                <p className="text-[10px] md:text-xs font-medium text-[#111b21] leading-tight mb-2">Hey! Cop the new kicks here 👇</p>

                                                                {/* Link Preview Card */}
                                                                <div className="bg-[#f0f0f0] rounded-lg flex gap-2 p-1.5 items-center border-l-4 border-slate-300">
                                                                    <div className="h-10 w-10 bg-slate-200 rounded shrink-0 overflow-hidden">
                                                                        <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80" className="w-full h-full object-cover" />
                                                                    </div>
                                                                    <div className="min-w-0 flex-1 pr-1">
                                                                        <div className="h-2 w-20 bg-slate-400 rounded mb-1" />
                                                                        <div className="h-1.5 w-12 bg-slate-300 rounded" />
                                                                        <div className="mt-1 text-[8px] text-blue-500 font-bold">sokosnap.com</div>
                                                                    </div>
                                                                </div>

                                                                {/* Metadata */}
                                                                <div className="flex justify-end items-center gap-0.5 mt-1 opacity-60">
                                                                    <span className="text-[9px] text-slate-500">11:42 AM</span>
                                                                    <CheckCircle2 size={12} className="text-blue-500" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-6 pt-0 z-10">
                                                <h3 className="font-black text-lg text-white uppercase italic mb-2">Post Anywhere</h3>
                                                <p className="text-sm text-blue-100 font-medium leading-relaxed opacity-90">
                                                    Paste on <span className="text-white font-bold underline decoration-wavy">WhatsApp, IG, or TikTok</span>. No website needed.
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Step 3: Get Paid (Notification UI) */}
                                    <motion.div
                                        whileHover={{ y: -10 }}
                                        viewport={{ once: true }}
                                        className="relative group z-10"
                                    >
                                        <div className="bg-green-600 rounded-[2.5rem] border border-green-500 shadow-xl overflow-hidden h-full flex flex-col">
                                            {/* Header */}
                                            <div className="p-6 pb-2 flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center font-black text-[10px] text-green-600 ring-4 ring-green-500/50">3</span>
                                                    <span className="text-xs font-black uppercase text-green-200 tracking-wider">Earn</span>
                                                </div>
                                                <ShieldCheck size={14} className="text-white" />
                                            </div>

                                            {/* UI VISUAL */}
                                            <div className="p-5 pt-2 flex-grow flex items-center justify-center relative overflow-hidden">
                                                {/* Wallpaper Blur - Simplified for green theme */}
                                                <div className="absolute inset-0 bg-green-500/20 mix-blend-overlay"></div>

                                                {/* Phone Screen / Wallet Card */}
                                                <div className="w-full h-48 bg-slate-900 rounded-xl overflow-hidden relative shadow-lg border-4 border-green-300 -rotate-2 group-hover:rotate-0 transition-all duration-500 flex flex-col items-center justify-center p-4">

                                                    {/* Balance */}
                                                    <div className="text-center mb-6">
                                                        <p className="text-green-500 text-[9px] font-bold uppercase tracking-widest mb-1">Total Earned</p>
                                                        <p className="text-white text-3xl font-black tracking-tighter">KES 4,500</p>
                                                    </div>

                                                    {/* Notification Toast over it */}
                                                    <div className="w-full bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20 flex gap-3 items-center shadow-2xl">
                                                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center font-bold text-white text-sm shrink-0 shadow-lg shadow-green-500/50">M</div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-white text-[11px] font-black leading-tight mb-0.5">PAYMENT RECEIVED</p>
                                                            <p className="text-green-100 text-[10px] font-medium leading-snug">
                                                                You received <span className="text-white font-bold">KES 4,500.00</span> from <span className="text-white font-bold">SokoSnap Escrow</span> via TumaFast.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-6 pt-0 z-10">
                                                <h3 className="font-black text-lg text-white uppercase italic mb-2">Instant Payout</h3>
                                                <p className="text-sm text-green-100 font-medium leading-relaxed opacity-90">
                                                    We handle the delivery. You get the cash. <span className="text-white font-bold decoration-wavy underline">Safe & Automatic.</span>
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>

                        <RevenueCalculator onAction={handleCallToAction} />

                    </motion.div>
                )}
            </AnimatePresence>

            {step === 'hero' && (
                <>
                    {/* MARQUEE SECTION MOVED HERE - ABOVE FOOTER */}
                    <div className="border-y border-slate-100 bg-slate-50/50 py-10 relative overflow-hidden backdrop-blur-sm">
                        <div className="flex justify-center mb-8">
                            <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-400">Sell Securely Online</h3>
                        </div>
                        <InfiniteMarquee speed={25}>
                            <div className="flex items-center gap-3 text-2xl font-black text-slate-800 transition-all duration-300 cursor-default"><InstagramLogo /> INSTAGRAM</div>
                            <div className="flex items-center gap-3 text-2xl font-black text-slate-800 transition-all duration-300 cursor-default"><TikTokLogo /> TIKTOK</div>
                            <div className="flex items-center gap-3 text-2xl font-black text-slate-800 transition-all duration-300 cursor-default"><YoutubeLogo /> YOUTUBE</div>
                            <div className="flex items-center gap-3 text-2xl font-black text-slate-800 transition-all duration-300 cursor-default"><WhatsAppLogo /> WHATSAPP</div>
                            <div className="flex items-center gap-3 text-2xl font-black text-slate-800 transition-all duration-300 cursor-default"><FacebookLogo /> FACEBOOK</div>
                            <div className="flex items-center gap-3 text-2xl font-black text-slate-800 transition-all duration-300 cursor-default"><Store className="text-rose-500" size={28} /> ONLINE SHOPS</div>
                            <div className="flex items-center gap-3 text-2xl font-black text-slate-800 transition-all duration-300 cursor-default"><Globe className="text-blue-500" size={28} /> WEBSITES</div>
                        </InfiniteMarquee>
                    </div>

                    <footer className="bg-white border-t border-slate-100 py-12 relative overflow-hidden">
                        <div className="max-w-7xl mx-auto px-6 relative z-10">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
                                {/* Brand Block */}
                                <div className="max-w-sm">
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center transform -rotate-3 shadow-lg shadow-yellow-500/20">
                                            <Store className="text-black" size={20} />
                                        </div>
                                        <span className="font-black italic text-2xl tracking-tighter text-slate-900">SokoSnap</span>
                                    </div>
                                    <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
                                        The secure social commerce platform for African sellers. Powered by TumaFast Logistics.
                                    </p>
                                </div>

                                {/* Horizontal Links */}
                                <div className="flex flex-col md:items-end gap-6">
                                    <div className="flex flex-wrap md:justify-end gap-x-8 gap-y-4 max-w-lg text-xs font-bold uppercase tracking-widest text-slate-400 cursor-pointer">
                                        <span onClick={() => setStep('about')} className="hover:text-slate-900 transition-colors">About</span>
                                        <span onClick={() => setStep('terms')} className="hover:text-slate-900 transition-colors">Terms</span>
                                        <span onClick={() => setStep('privacy')} className="hover:text-slate-900 transition-colors">Privacy</span>
                                        <span onClick={() => setStep('merchant')} className="hover:text-slate-900 transition-colors">Merchant Agreement</span>
                                        <span onClick={() => setStep('contact')} className="hover:text-slate-900 transition-colors">Contact</span>
                                        <span onClick={() => setStep('faq')} className="hover:text-slate-900 transition-colors">FAQs</span>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Bar: Location Left, Socials Right, Copyright Below */}
                            <div className="border-t border-slate-100 pt-8 flex flex-col gap-6">
                                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">Nairobi, KE</span>

                                    <div className="flex gap-4">
                                        <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-900"><InstagramLogo size={18} /></a>
                                        <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-900"><WhatsAppLogo size={18} /></a>
                                        <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-900"><FacebookLogo size={18} /></a>
                                    </div>
                                </div>

                                <p className="text-[10px] text-slate-400 font-bold text-center uppercase tracking-widest">© 2026 TumaFast Ltd. All rights reserved.</p>
                            </div>
                        </div>
                    </footer>
                </>
            )}

            {/* --- REGISTRATION FORM (Enhanced) --- */}
            {step === 'register' && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="w-full max-w-2xl mx-auto px-6 pt-16 pb-20"
                >
                    <div className="text-center mb-10">
                        <div className="flex justify-between items-center mb-6 px-4">
                            <button onClick={() => setStep('hero')} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
                                <ArrowRight className="rotate-180" size={14} /> Back Home
                            </button>
                            {user && (
                                <button onClick={() => { logout(); setStep('hero'); }} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-900 transition-colors">
                                    <LogOut size={14} /> Sign Out
                                </button>
                            )}
                        </div>
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900">Claim Your Link</h2>
                        <p className="text-slate-500 font-medium mt-2">Join the elite merchants on SokoSnap.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500" />

                        {showAuthWarning && (
                            <div className="rounded-2xl bg-red-50 border border-red-100 p-4 flex gap-4 items-center">
                                <div className="bg-white p-2 rounded-full text-red-500"><Lock size={16} /></div>
                                <div>
                                    <p className="text-sm font-bold text-red-900">Authentication Required</p>
                                    <button type="button" onClick={handleGoogleSignIn} className="text-xs font-bold underline mt-1">Sign in with Google</button>
                                </div>
                            </div>
                        )}

                        <div className="space-y-6">
                            <div className="group">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1 group-focus-within:text-slate-900 transition-colors">Shop Name</label>
                                <input
                                    required
                                    className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white border-2 border-transparent focus:border-slate-900 rounded-2xl py-4 px-6 font-bold text-lg outline-none transition-all"
                                    placeholder="e.g. Rare Kicks V2"
                                    value={formData.shopName}
                                    onChange={e => setFormData({ ...formData, shopName: e.target.value })}
                                />
                            </div>

                            <div className="group">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Location</label>
                                <div className="space-y-2">
                                    <div className="relative">
                                        <input
                                            className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white border-2 border-transparent focus:border-slate-900 rounded-2xl py-4 px-6 font-bold outline-none transition-all"
                                            placeholder="Search Location..."
                                            value={formData.locationRequest}
                                            onChange={e => setFormData({ ...formData, locationRequest: e.target.value })}
                                        />
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                                            <button type="button" onClick={handleCurrentLocation} className="p-2 bg-white rounded-xl shadow-sm hover:bg-slate-900 hover:text-white transition-colors"><Navigation size={18} /></button>
                                            <button type="button" onClick={() => setIsLocationPickerOpen(true)} className="p-2 bg-white rounded-xl shadow-sm hover:bg-slate-900 hover:text-white transition-colors"><MapPin size={18} /></button>
                                        </div>
                                    </div>
                                    {formData.locationName && (
                                        <div className="flex gap-2 items-center text-[10px] font-bold text-green-600 bg-green-50 p-2 rounded-lg">
                                            <CheckCircle2 size={12} /> Confirmed: {formData.locationName}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="group">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Admin Contact</label>
                                    <input
                                        required
                                        className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white border-2 border-transparent focus:border-slate-900 rounded-2xl py-4 px-6 font-bold outline-none transition-all"
                                        placeholder="Full Name"
                                        value={formData.contactName}
                                        onChange={e => setFormData({ ...formData, contactName: e.target.value })}
                                    />
                                </div>
                                <div className="group">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Phone</label>
                                    <input
                                        required
                                        type="tel"
                                        className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white border-2 border-transparent focus:border-slate-900 rounded-2xl py-4 px-6 font-bold outline-none transition-all"
                                        placeholder="07XX XXX XXX"
                                        value={formData.contactPhone}
                                        onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="group">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white border-2 border-transparent focus:border-slate-900 rounded-2xl py-4 px-6 font-bold outline-none transition-all"
                                        placeholder="shop@example.com"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className="group">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">KRA PIN (Optional)</label>
                                    <input
                                        className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white border-2 border-transparent focus:border-slate-900 rounded-2xl py-4 px-6 font-bold outline-none transition-all"
                                        placeholder="A00..."
                                        value={formData.kraPin}
                                        onChange={e => setFormData({ ...formData, kraPin: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 pt-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Social Media Links (Optional)</label>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><InstagramLogo size={18} /></div>
                                        <input
                                            className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white border-2 border-transparent focus:border-slate-900 rounded-2xl py-3 pl-12 pr-6 font-medium outline-none transition-all"
                                            placeholder="Instagram Username"
                                            value={formData.instagram}
                                            onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                                        />
                                    </div>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><TikTokLogo size={18} /></div>
                                        <input
                                            className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white border-2 border-transparent focus:border-slate-900 rounded-2xl py-3 pl-12 pr-6 font-medium outline-none transition-all"
                                            placeholder="TikTok Username"
                                            value={formData.tiktok}
                                            onChange={e => setFormData({ ...formData, tiktok: e.target.value })}
                                        />
                                    </div>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><FacebookLogo size={18} /></div>
                                        <input
                                            className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white border-2 border-transparent focus:border-slate-900 rounded-2xl py-3 pl-12 pr-6 font-medium outline-none transition-all"
                                            placeholder="Facebook Page"
                                            value={formData.facebook}
                                            onChange={e => setFormData({ ...formData, facebook: e.target.value })}
                                        />
                                    </div>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><WhatsAppLogo size={18} /></div>
                                        <input
                                            className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white border-2 border-transparent focus:border-slate-900 rounded-2xl py-3 pl-12 pr-6 font-medium outline-none transition-all"
                                            placeholder="WhatsApp Number"
                                            value={formData.whatsapp}
                                            onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="group">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Payment Method</label>
                                <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-4">
                                    {['personal', 'till', 'paybill'].map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setMpesaType(type)}
                                            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${mpesaType === type ? 'bg-white shadow-md text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                                {(mpesaType === 'personal' || mpesaType === 'till') && (
                                    <input
                                        required
                                        type="number"
                                        className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white border-2 border-transparent focus:border-slate-900 rounded-2xl py-4 px-6 font-bold outline-none transition-all"
                                        placeholder={mpesaType === 'personal' ? 'M-Pesa Number' : 'Till Number'}
                                        value={mpesaType === 'personal' ? formData.mpesaNumber : formData.tillNumber}
                                        onChange={e => setFormData({ ...formData, [mpesaType === 'personal' ? 'mpesaNumber' : 'tillNumber']: e.target.value })}
                                    />
                                )}
                                {mpesaType === 'paybill' && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <input placeholder="Paybill No." className="w-full bg-slate-50 rounded-2xl py-4 px-6 font-bold outline-none" onChange={e => setFormData({ ...formData, paybillNumber: e.target.value })} />
                                        <input placeholder="Account No." className="w-full bg-slate-50 rounded-2xl py-4 px-6 font-bold outline-none" onChange={e => setFormData({ ...formData, accountNumber: e.target.value })} />
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 pb-2">
                                <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
                                    <input type="checkbox" required className="w-5 h-5 rounded border-slate-300 text-black focus:ring-black" />
                                    <span className="text-xs font-medium text-slate-500">I agree to the <span className="text-slate-900 font-bold underline">Merchant Terms</span> & Privacy Policy.</span>
                                </label>
                            </div>

                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/20"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" /> : <>Launch Shop <ChevronRight size={18} /></>}
                        </button>

                    </form>
                </motion.div>
            )}

            {/* --- SUCCESS STATE --- */}
            {step === 'success' && (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-slate-50">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-8 animate-bounce"><CheckCircle2 size={48} /></div>
                    <h2 className="text-4xl font-black text-slate-900 mb-4">You're In!</h2>
                    <p className="text-slate-500 mb-8 max-w-md">Your shop <b>{formData.shopName}</b> is pending verification. We'll text you shortly.</p>
                    <button onClick={() => window.location.reload()} className="px-8 py-3 bg-white border-2 border-slate-200 rounded-full font-bold text-slate-600 hover:border-slate-900 hover:text-slate-900 transition-all">Refresh Status</button>
                </motion.div>
            )}

            {step === 'dashboard' && <SellerDashboard onBack={() => setStep('hero')} />}
            {['about', 'terms', 'privacy', 'cookies', 'merchant', 'contact', 'faq'].includes(step) && <SellerInfoPages page={step} onBack={() => setStep('hero')} onNavigate={setStep} />}
            <LocationPickerModal isOpen={isLocationPickerOpen} onClose={() => setIsLocationPickerOpen(false)} onSelectLocation={(loc) => { handleLocationSelect(loc); setIsLocationPickerOpen(false); }} />
            <AuthModal />
        </div>
    );
};

export default SellerLandingPage;
