import React, { useState, useEffect } from 'react';
import {
    CheckCircle2,
    ArrowRight,
    ShieldCheck,
    Zap,
    Smartphone,
    Store,
    Instagram,
    Loader2,
    Lock,
    ChevronRight,
    MessageCircle,
    Facebook,
    Video,
    Globe,
    Building2,
    CreditCard,
    MapPin,
    Navigation,
    User as UserIcon,
    Mail,
    Phone,
    FileText,
    Search
} from 'lucide-react';
import { LocationPickerModal } from '../common/LocationPickerModal';
import { AuthModal } from './AuthModal';
import { SellerDashboard } from './SellerDashboard';
import { SellerInfoPages } from './SellerInfoPages';
import { useAuthStore } from '../../store';

// --- HELPER COMPONENTS (Defined at top to prevent errors) ---

const StepCard = ({ step, title, desc, icon, bgClass }: { step: string, title: string, desc: string, icon: React.ReactNode, bgClass: string }) => (
    <div className={`${bgClass} p-8 rounded-[2.5rem] hover:shadow-2xl hover:scale-105 transition-all duration-300 group h-full border-none`}>
        <div className="flex justify-between items-start mb-6">
            <span className="text-6xl font-black italic tracking-tighter select-none opacity-40 text-white mix-blend-overlay">{step}</span>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 group-hover:rotate-12 transition-transform bg-white/20 backdrop-blur-md border border-white/20">
                {icon}
            </div>
        </div>
        <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4 text-white drop-shadow-sm">{title}</h3>
        <p className="text-sm text-white/90 font-medium leading-relaxed">{desc}</p>
    </div>
);

const TrustItem = ({ text }: { text: string }) => (
    <div className="flex items-center gap-3">
        <CheckCircle2 className="text-blue-500" size={18} />
        <span className="text-sm font-bold text-white">{text}</span>
    </div>
);

const Share2Icon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
        <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" x2="15.42" y1="13.51" y2="17.49" /><line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
    </svg>
);

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

// --- MAIN COMPONENT ---

const SellerLandingPage = () => {
    // Initialize step from URL param ?view=dashboard or default to 'hero'
    const [step, setStep] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get('view') || 'hero';
    });
    const { user, openAuthModal, becomeSeller } = useAuthStore();

    // Check if user is seller or if needs to register
    useEffect(() => {
        if (!user) return; // Do nothing if not logged in

        if (user.type === 'verified_merchant') {
            // Already a seller, go to dashboard
            if (step === 'register') setStep('dashboard');
        }
        // We DON'T auto-redirect buyers to register from 'hero' anymore
        // allowing them to view the landing page freely.
        // They will be prompted to register when clicking "Start Selling"
    }, [user, step]);

    // Auth State Check
    const [showAuthWarning, setShowAuthWarning] = useState(false);

    // Location State
    const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);

    // Payment Method State
    const [mpesaType, setMpesaType] = useState('personal'); // 'personal', 'till', 'paybill'

    const [formData, setFormData] = useState({
        // Shop Details
        shopName: '',
        locationRequest: '', // The user's input/search
        locationName: '', // Confirmed address
        latitude: null as number | null,
        longitude: null as number | null,

        // Contact Person
        contactName: '',
        contactPhone: '',
        email: '',

        // Legal
        kraPin: '',

        // Payment
        mpesaNumber: '',
        tillNumber: '',
        paybillNumber: '',
        accountNumber: '',

        // Socials
        whatsapp: '',
        instagram: '',
        tiktok: '',
        facebook: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLocationSelect = (location: { address: string; lat: number; lng: number }) => {
        setFormData(prev => ({
            ...prev,
            locationName: location.address,
            locationRequest: location.address, // Update input with selected address
            latitude: location.lat,
            longitude: location.lng
        }));
    };

    const handleCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // In a real app, reverse geocode here
                    setFormData(prev => ({
                        ...prev,
                        locationName: "Current Device Location",
                        locationRequest: "Current Device Location",
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }));
                },
                () => {
                    alert('Unable to retrieve location. Please check browser permissions.');
                }
            );
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSubmit = async (e: any) => {
        e.preventDefault();

        // NEW: Auth Check
        if (!user) {
            setShowAuthWarning(true);
            return;
        }

        setIsSubmitting(true);

        try {
            // Register the user as a seller with their shop information
            await becomeSeller({
                shopName: formData.shopName,
                shopLocation: formData.locationName,
                contactPerson: formData.contactName,
                contactPhone: formData.contactPhone,
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

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-yellow-200 overflow-x-hidden">

            {/* --- NAVBAR --- */}
            {step !== 'dashboard' && (
                <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto sticky top-0 bg-white/90 backdrop-blur-md z-50 border-b border-slate-100">
                    <div className="flex items-center gap-2" onClick={() => setStep('hero')} style={{ cursor: 'pointer' }}>
                        <div className="w-9 h-9 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20 transform -rotate-3">
                            <Store className="text-black" size={20} />
                        </div>
                        <span className="font-black italic text-2xl tracking-tighter text-slate-900">SokoSnap</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => openAuthModal('login')}
                            className="text-xs font-bold text-black border-2 border-black px-6 py-2.5 rounded-full hover:bg-black hover:text-white transition-all uppercase tracking-widest"
                        >
                            Seller Login
                        </button>
                    </div>
                </nav>
            )}

            {/* --- MAIN CONTENT SWITCHER --- */}
            {step === 'hero' && (
                <>
                    {/* HERO SECTION */}
                    <div className="max-w-7xl mx-auto px-6 pt-6 pb-12 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-8 items-center">

                            {/* Left Content */}
                            <div className="text-left animate-in slide-in-from-left duration-700">
                                <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-100 rounded-full px-4 py-1.5 mb-4">
                                    <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-700">Sell on Any Platform</span>
                                </div>

                                {/* Fixed Header with extra padding for italics */}
                                <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-4 text-slate-900 py-2">
                                    Turn <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-600 pr-6 pb-2">Any Social Post</span> <br />
                                    Into A Sale.
                                </h1>

                                <p className="text-slate-500 text-lg font-medium max-w-lg mb-6 leading-relaxed">
                                    One link to rule them all. The #1 M-Pesa Checkout for <span className="font-black text-black">TikTok</span>, <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500">Instagram</span>, <span className="font-black text-[#25D366]">WhatsApp</span> & <span className="font-black text-[#1877F2]">Facebook</span>. We handle the payments and delivery so you can focus on posting and selling more online.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 items-start">
                                    <button
                                        onClick={() => {
                                            if (user) {
                                                setStep('register');
                                            } else {
                                                openAuthModal('register');
                                            }
                                        }}
                                        className="px-10 py-5 bg-black text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-2xl shadow-black/20"
                                    >
                                        Start Selling Everywhere <ArrowRight size={18} strokeWidth={3} className="text-yellow-500" />
                                    </button>
                                    <div className="flex items-center gap-2 mt-4 sm:mt-0 sm:ml-4">
                                        <div className="flex -space-x-3">
                                            <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="user" /></div>
                                            <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-300 overflow-hidden"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="user" /></div>
                                            <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-400 overflow-hidden"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="user" /></div>
                                        </div>
                                        <p className="text-xs font-bold text-slate-500 leading-tight">Join 500+ <br />Kenya Sellers</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Visual (High Energy) */}
                            <div className="relative animate-in slide-in-from-right duration-1000 delay-200">
                                <div className="absolute inset-0 bg-yellow-500 rounded-[3rem] rotate-6 opacity-20 blur-xl" />
                                <img
                                    src="/seller.png"
                                    alt="Kenyan Seller on Phone"
                                    className="relative rounded-[2.5rem] shadow-2xl border-4 border-white object-cover h-[500px] w-full"
                                />

                                {/* Floating Badge 1 (The M-Pesa Bounce) - Repositioned higher to avoid covering face */}
                                <div className="absolute left-2 md:-left-8 top-8 md:top-12 bg-white p-2.5 md:p-3 rounded-xl md:rounded-2xl shadow-2xl border border-green-100 flex items-center gap-2 md:gap-3 animate-bounce delay-700 z-20">
                                    <div className="bg-[#4CAF50] p-2 md:p-2.5 rounded-lg md:rounded-xl text-white shadow-lg shadow-green-500/30">
                                        <MessageCircle size={18} className="md:w-6 md:h-6" fill="currentColor" />
                                    </div>
                                    <div>
                                        <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">M-PESA CONFIRMED</p>
                                        <p className="text-base md:text-lg font-black text-slate-900 tracking-tight leading-none">KES 4,500.00</p>
                                        <p className="text-[7px] md:text-[8px] font-bold text-slate-400 mt-0.5 md:mt-1">Ref: SG829...</p>
                                    </div>
                                </div>

                                {/* Floating Badge 2 (Universal Link) - Lowered Position */}
                                <div className="absolute -right-8 bottom-12 md:bottom-16 bg-black text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-pulse delay-1000 z-20 border border-white/10">
                                    <div className="bg-blue-600 p-3 rounded-xl text-white shadow-lg shadow-blue-600/40">
                                        <Globe size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-0.5">Universal Link</p>
                                        <p className="text-base font-black text-white leading-none">Works Everywhere</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* PLATFORM STRIP (Subtle Universal Proof) */}
                    <div className="border-y border-slate-100 bg-slate-50 overflow-hidden">
                        <div className="max-w-7xl mx-auto py-8 px-6 flex flex-wrap justify-center gap-8 md:gap-16 opacity-100 grayscale-0 transition-all duration-500">
                            <div className="flex items-center gap-2 text-xl font-bold text-slate-600"><InstagramLogo /> Instagram</div>
                            <div className="flex items-center gap-2 text-xl font-bold text-slate-600"><TikTokLogo /> TikTok</div>
                            <div className="flex items-center gap-2 text-xl font-bold text-slate-600"><WhatsAppLogo /> WhatsApp</div>
                            <div className="flex items-center gap-2 text-xl font-bold text-slate-600"><FacebookLogo /> Facebook</div>
                            <div className="flex items-center gap-2 text-xl font-bold text-slate-400"><Globe /> & More</div>
                        </div>
                    </div>

                    {/* HOW IT WORKS (Value Prop) */}
                    <div id="how-it-works" className="bg-white py-24">
                        <div className="max-w-7xl mx-auto px-6">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-4 text-slate-900">How SokoSnap Works</h2>
                                <p className="text-slate-500 font-medium">Simple steps to turn followers into customers.</p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8">
                                <StepCard
                                    step="01"
                                    bgClass="bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500"
                                    title="Generate Link"
                                    desc="Upload your product photo or video, name, and price. We create a secure checkout link instantly."
                                    icon={<Zap className="text-white" size={28} strokeWidth={3} />}
                                />
                                <StepCard
                                    step="02"
                                    bgClass="bg-black"
                                    title="Share Everywhere"
                                    desc="Post the link on your WhatsApp Status & Catalog, TikTok Bio, Facebook Groups, or send via DM."
                                    icon={<Share2Icon />}
                                />
                                <StepCard
                                    step="03"
                                    bgClass="bg-[#25D366]"
                                    title="Get Paid Instantly"
                                    desc="Customer pays via M-Pesa. TumaFast delivers the item. Funds hit your phone instantly."
                                    icon={<ShieldCheck className="text-white" size={28} strokeWidth={3} />}
                                />
                            </div>
                        </div>
                    </div>

                    {/* TRUST SECTION */}
                    <div className="bg-slate-900 text-white py-24 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 blur-[150px] rounded-full" />
                        <div className="max-w-7xl mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-6 leading-none">
                                    Safety for You & <br /> Your Buyers.
                                </h2>
                                <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                                    The biggest killer of sales online is trust. "Tuma deposit" scares buyers away.
                                    <br /><br />
                                    With SokoSnap's <b>Buyer Protection Badge</b>, buyers pay with confidence knowing their money is held securely until delivery.
                                </p>
                                <button className="text-yellow-500 font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:translate-x-2 transition-transform">
                                    Learn about TumaFast Black <ArrowRight size={16} />
                                </button>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-8 rounded-[2.5rem]">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                                        <ShieldCheck className="text-yellow-500" size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black uppercase italic">Gold Verified Badge</h3>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Included with Account</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <TrustItem text="Identity Verified Seller" />
                                    <TrustItem text="M-Pesa Integration" />
                                    <TrustItem text="Store Analytics" />
                                    <TrustItem text="TumaFast Delivery" />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* --- FOOTER --- */}
            {step === 'hero' && (
                <footer className="bg-white border-t border-slate-100 py-6">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                            {/* Brand Block - Restored & Minimal */}
                            <div className="max-w-sm">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center transform -rotate-3">
                                        <Store className="text-black" size={16} />
                                    </div>
                                    <span className="font-black italic text-xl tracking-tighter text-slate-900">SokoSnap</span>
                                </div>
                                <p className="text-slate-400 text-xs font-medium leading-relaxed mb-4">
                                    The secure social commerce platform for African sellers. Powered by TumaFast Logistics.
                                </p>

                                <div className="flex flex-col gap-4">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nairobi, KE</span>

                                    <div className="flex gap-4">
                                        <a href="#" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"><InstagramLogo size={16} /></a>
                                        <a href="#" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"><WhatsAppLogo size={16} /></a>
                                        <a href="#" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"><FacebookLogo size={16} /></a>
                                    </div>

                                    <p className="text-[10px] text-slate-400 font-medium">┬® 2026 TumaFast Ltd. All rights reserved.</p>
                                </div>
                            </div>

                            {/* Horizontal Links - Smaller Font */}
                            <div className="flex flex-wrap md:justify-end gap-x-8 gap-y-4 max-w-lg text-[10px] font-bold uppercase tracking-widest text-slate-500 pt-2 cursor-pointer">
                                <span onClick={() => setStep('about')} className="hover:text-black transition-colors">About SokoSnap</span>
                                <span onClick={() => setStep('terms')} className="hover:text-black transition-colors">Terms of Service</span>
                                <span onClick={() => setStep('privacy')} className="hover:text-black transition-colors">Privacy Policy</span>
                                <span onClick={() => setStep('cookies')} className="hover:text-black transition-colors">Cookie Policy</span>
                                <span onClick={() => setStep('merchant')} className="hover:text-black transition-colors">Merchant Agreement</span>
                                <span onClick={() => setStep('contact')} className="hover:text-black transition-colors">Contact Us</span>
                            </div>
                        </div>
                    </div>
                </footer>
            )}

            {/* --- REGISTRATION FORM --- */}
            {step === 'register' && (
                <div className="w-full max-w-2xl mx-auto px-6 pt-16 pb-20 animate-in slide-in-from-bottom-8 duration-500">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900">Claim Your Link</h2>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Join the Elite Merchants</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100">

                        {/* AUTH WARNING */}
                        {showAuthWarning && (
                            <div className="rounded-2xl bg-red-50 border border-red-100 p-4 animate-in slide-in-from-top-2">
                                <div className="flex gap-3">
                                    <div className="bg-white p-2 rounded-full h-fit text-red-500 shadow-sm">
                                        <Lock size={16} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-black text-slate-900 mb-1">Account Required</h4>
                                        <p className="text-xs text-slate-500 font-medium mb-3">You must be signed in to google to create a shop.</p>
                                        <button
                                            type="button"
                                            onClick={handleGoogleSignIn}
                                            className="text-xs font-bold bg-white border border-slate-200 shadow-sm px-4 py-2 rounded-lg text-slate-900 hover:bg-slate-50"
                                        >
                                            Sign In / Register with Google
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SHOP DETAILS SECTION */}
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Shop Name</label>
                                <div className="relative">
                                    <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Eastleigh Kicks"
                                        value={formData.shopName}
                                        onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-yellow-500 focus:bg-white transition-all"
                                    />
                                </div>
                            </div>

                            {/* LOCATION PICKER */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Shop Location</label>
                                <div className="flex flex-col gap-2">
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Search Google Places (e.g. Moi Avenue)"
                                            value={formData.locationRequest}
                                            onChange={(e) => setFormData({ ...formData, locationRequest: e.target.value })}
                                            className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-yellow-500 focus:bg-white transition-all"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={handleCurrentLocation}
                                            className="flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
                                        >
                                            <Navigation size={14} /> Use Current GPS
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsLocationPickerOpen(true)}
                                            className="flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
                                        >
                                            <MapPin size={14} /> Pin on Map
                                        </button>
                                    </div>
                                    {formData.locationName && (
                                        <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-100 rounded-xl">
                                            <MapPin size={14} className="text-green-600 mt-0.5 shrink-0" />
                                            <div>
                                                <p className="text-[10px] font-bold text-green-700 uppercase tracking-wide">Confirmed Location</p>
                                                <p className="text-xs font-medium text-green-900 leading-tight">{formData.locationName}</p>
                                            </div>
                                        </div>
                                    )}
                                    <p className="text-[9px] text-slate-400 font-medium ml-1">This helps customers and riders find you.</p>
                                </div>
                            </div>
                        </div>

                        {/* CONTACT PERSON SECTION */}
                        <div className="space-y-4 pt-4 border-t border-slate-100">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Shop Admin Contact</label>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <div className="relative">
                                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            required
                                            type="text"
                                            placeholder="Contact Person Name"
                                            value={formData.contactName}
                                            onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                                            className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 pl-12 pr-4 font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-yellow-500 focus:bg-white transition-all text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            required
                                            type="tel"
                                            placeholder="Contact Phone"
                                            value={formData.contactPhone}
                                            onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                            className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 pl-12 pr-4 font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-yellow-500 focus:bg-white transition-all text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        required
                                        type="email"
                                        placeholder="Business Email Address"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 pl-12 pr-4 font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-yellow-500 focus:bg-white transition-all text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* KRA PIN SECTION */}
                        <div className="space-y-1.5 pt-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Verification</label>
                            <div className="relative">
                                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    required
                                    type="text"
                                    placeholder="KRA PIN (Mandatory)"
                                    value={formData.kraPin}
                                    onChange={(e) => setFormData({ ...formData, kraPin: e.target.value })}
                                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-yellow-500 focus:bg-white transition-all uppercase"
                                />
                            </div>
                            <p className="text-[9px] text-slate-400 font-medium ml-1">For compliance and business verification purposes.</p>
                        </div>

                        {/* M-PESA CONFIGURATION SECTION */}
                        <div className="space-y-3 pt-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Receive Payments Via</label>

                            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1 rounded-2xl border border-slate-200">
                                <button
                                    type="button"
                                    onClick={() => setMpesaType('personal')}
                                    className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${mpesaType === 'personal' ? 'bg-black text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Personal
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMpesaType('till')}
                                    className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${mpesaType === 'till' ? 'bg-black text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Till No.
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMpesaType('paybill')}
                                    className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${mpesaType === 'paybill' ? 'bg-black text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Paybill
                                </button>
                            </div>

                            {/* Conditional M-Pesa Inputs */}
                            <div className="relative animate-in fade-in slide-in-from-top-2 duration-300">

                                {mpesaType === 'personal' && (
                                    <div className="relative">
                                        <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            required
                                            type="tel"
                                            placeholder="07XX XXX XXX"
                                            value={formData.mpesaNumber}
                                            onChange={(e) => setFormData({ ...formData, mpesaNumber: e.target.value })}
                                            className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-yellow-500 focus:bg-white transition-all"
                                        />
                                    </div>
                                )}

                                {mpesaType === 'till' && (
                                    <div className="relative">
                                        <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            required
                                            type="number"
                                            placeholder="Enter Till Number"
                                            value={formData.tillNumber}
                                            onChange={(e) => setFormData({ ...formData, tillNumber: e.target.value })}
                                            className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-yellow-500 focus:bg-white transition-all"
                                        />
                                    </div>
                                )}

                                {mpesaType === 'paybill' && (
                                    <div className="space-y-2">
                                        <div className="relative">
                                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                required
                                                type="number"
                                                placeholder="Business Number (Paybill)"
                                                value={formData.paybillNumber}
                                                onChange={(e) => setFormData({ ...formData, paybillNumber: e.target.value })}
                                                className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-yellow-500 focus:bg-white transition-all"
                                            />
                                        </div>
                                        <div className="relative">
                                            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                required
                                                type="text"
                                                placeholder="Account Number"
                                                value={formData.accountNumber}
                                                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                                                className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-yellow-500 focus:bg-white transition-all"
                                            />
                                        </div>
                                    </div>
                                )}

                                <p className="text-[9px] text-slate-400 ml-1 font-medium mt-1">Funds will be settled to this account after delivery verification.</p>
                            </div>
                        </div>

                        {/* Social Links Section - Full Capture */}
                        <div className="space-y-3 pt-4 border-t border-slate-100">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Social Storefronts</label>

                            <div className="grid gap-3">
                                <div className="relative">
                                    <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-[#25D366]" size={18} />
                                    <input
                                        type="tel"
                                        placeholder="WhatsApp Number"
                                        value={formData.whatsapp}
                                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 pl-12 pr-4 font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#25D366] focus:bg-white transition-all text-sm"
                                    />
                                </div>

                                <div className="relative">
                                    <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Instagram Handle (@shop)"
                                        value={formData.instagram}
                                        onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 pl-12 pr-4 font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-pink-500 focus:bg-white transition-all text-sm"
                                    />
                                </div>

                                <div className="relative">
                                    <Video className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={18} />
                                    <input
                                        type="text"
                                        placeholder="TikTok Handle (@shop)"
                                        value={formData.tiktok}
                                        onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
                                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 pl-12 pr-4 font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-black focus:bg-white transition-all text-sm"
                                    />
                                </div>

                                <div className="relative">
                                    <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Facebook Page Name/Link"
                                        value={formData.facebook}
                                        onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 pl-12 pr-4 font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-600 focus:bg-white transition-all text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-5 bg-black text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 mt-8 shadow-xl shadow-slate-300"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={18} className="animate-spin text-yellow-500" />
                                    Creating Shop...
                                </>
                            ) : (
                                <>
                                    Launch Shop <ChevronRight size={18} strokeWidth={3} className="text-yellow-500" />
                                </>
                            )}
                        </button>

                        <div className="flex items-center justify-center gap-2 mt-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                            <Lock size={12} className="text-blue-500" /> Secured by TumaFast Black
                        </div>

                    </form>

                    <button onClick={() => setStep('hero')} className="w-full text-center mt-8 text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-black transition-colors">
                        Back to Home
                    </button>
                </div>
            )}

            {/* --- SUCCESS STATE --- */}
            {step === 'success' && (
                <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center animate-in zoom-in-95 duration-500">
                    <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mb-8 shadow-xl shadow-yellow-100/50">
                        <Loader2 size={48} className="animate-spin" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-4 text-slate-900">Application Received</h2>
                    <p className="text-slate-500 text-sm font-medium max-w-xs mx-auto mb-10 leading-relaxed">
                        Your shop creation request is <b>Pending Verification</b>. <br />
                        We will manually review your details shortly. You will be notified via SMS or Email once approved.
                    </p>

                    <div className="bg-slate-50 border border-slate-200 p-6 rounded-3xl w-full max-w-sm mb-8 shadow-sm opacity-50 select-none grayscale">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pending Shop Link</p>
                        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-inner">
                            <span className="text-slate-400 font-mono text-sm font-bold">tmft.me/{formData.shopName.toLowerCase().replace(/\s/g, '')}</span>
                            <Lock size={18} className="text-slate-300" />
                        </div>
                    </div>

                    <button
                        onClick={() => window.location.reload()}
                        className="px-8 py-3 bg-white border-2 border-slate-200 text-slate-600 rounded-full font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-colors"
                    >
                        Refresh Status
                    </button>

                    <button onClick={() => setStep('hero')} className="mt-6 text-slate-400 text-[10px] font-bold uppercase tracking-widest hover:text-black">
                        Back to Home
                    </button>
                </div>
            )}

            {/* --- DASHBOARD VIEW --- */}
            {step === 'dashboard' && (
                <SellerDashboard onBack={() => setStep('hero')} />
            )}

            {/* --- INFO PAGES --- */}
            {['about', 'terms', 'privacy', 'cookies', 'merchant', 'contact'].includes(step) && (
                <SellerInfoPages page={step} onBack={() => setStep('hero')} onNavigate={(page) => setStep(page)} />
            )}

            {/* --- MODALS --- */}
            <LocationPickerModal
                isOpen={isLocationPickerOpen}
                onClose={() => setIsLocationPickerOpen(false)}
                onSelectLocation={(loc) => {
                    handleLocationSelect(loc);
                    setIsLocationPickerOpen(false);
                }}
            />
            <AuthModal />

        </div>
    );
};

export default SellerLandingPage;
