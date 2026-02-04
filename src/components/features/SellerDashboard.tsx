import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import {
    Share2,
    Plus,
    Package,
    Ticket,
    Wrench,
    Bell,
    TrendingUp,
    CheckCircle2,
    ArrowUpRight,
    ChevronRight,
    ShieldCheck,
    Zap,
    BarChart3,
    User as UserIcon,
    Settings,
    LogOut,
    ChevronLeft,
    Star,
    CreditCard,
    Sun,
    Moon,
    MousePointer2,
    LayoutDashboard,
    ShoppingBag,
    QrCode,
    Instagram, // Instagram
    Globe, // Web
    Camera, // AI Camera
    Pencil, // Edit Icon
    Search, // Search Icon
    Link, // Link Icon
    Store,
    FileText,
    MapPin,
    Upload,
    Sparkles,
    AlertCircle,
    Mail
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useSellerStore } from '../../store/sellerStore';
import { AddProductModal, SmartScanModal, QRLinkModal } from './seller';
import { slugify } from '../../utils/formatters';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../lib/firebase';

// Add props interface for compatibility with SellerLandingPage
interface SellerDashboardProps {
    onBack?: () => void;
}

// Extracted Component to avoid Hook issues
const MerchantProfileView = ({ user, theme, isDarkMode, setActiveView, scrollToSettlement = false }: { user: any, theme: any, isDarkMode: boolean, setActiveView: (v: string) => void, scrollToSettlement?: boolean }) => {
    const [formData, setFormData] = useState({
        avatar: user?.avatar || user?.photoURL || '',
        shopName: user?.shopName || user?.name || '',
        shopLocation: user?.shopLocation || '',
        email: user?.email || '',
        contactPhone: user?.contactPhone || user?.phone || '',
        contactPerson: user?.contactPerson || user?.name || '',
        kraPin: user?.kraPin || '',
        // Socials
        whatsapp: user?.whatsapp || '',
        instagram: user?.instagram || '',
        facebook: user?.facebook || '',
        tiktok: user?.tiktok || '',
        // Payment
        mpesaType: user?.mpesaType || 'personal', // personal, till, paybill
        mpesaNumber: user?.mpesaNumber || '',
        tillNumber: user?.tillNumber || '',
        paybillNumber: user?.paybillNumber || '',
        accountNumber: user?.accountNumber || '',
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const { updateUser } = useAuthStore();
    const settlementRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollToSettlement && settlementRef.current) {
            settlementRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [scrollToSettlement]);

    const handleLocation = () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(async (pos) => {
                const { latitude, longitude } = pos.coords;

                try {
                    // Try to get a readable address
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await response.json();

                    if (data && data.address) {
                        const addr = data.address;
                        // Prioritize: Suburb/Area, City/Town
                        const parts = [
                            addr.suburb || addr.neighbourhood || addr.residential || addr.road,
                            addr.city || addr.town || addr.municipality || addr.county,
                            addr.country
                        ].filter(Boolean);

                        // Take top 2 relevant parts to keep it short, e.g. "Westlands, Nairobi"
                        const locName = parts.slice(0, 2).join(', ');
                        setFormData(prev => ({ ...prev, shopLocation: locName || data.display_name }));
                    } else {
                        // Fallback to coords if name fails
                        const loc = `Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}`;
                        setFormData(prev => ({ ...prev, shopLocation: loc }));
                    }
                } catch (error) {
                    // Fallback on network error
                    const loc = `Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}`;
                    setFormData(prev => ({ ...prev, shopLocation: loc }));
                }
            }, (err) => {
                console.error("Geolocation error:", err);
                alert("Could not access location. Please check browser permissions.");
            });
        }
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user?.id) return;

        setIsUploading(true);
        try {
            const fileRef = ref(storage, `profiles/${user.id}/${Date.now()}_${file.name}`);
            await uploadBytes(fileRef, file);
            const url = await getDownloadURL(fileRef);

            // 1. Update Local Form State
            setFormData(prev => ({ ...prev, avatar: url }));

            // 2. IMMEDIATE SAVE to Global Store & Firestore
            // This ensures Header/Sidebar update immediately without hitting "Save" button
            await updateUser({ avatar: url });

        } catch (error) {
            console.error("Profile upload failed", error);
            alert("Failed to upload image");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // @ts-ignore
            await updateUser(formData);
            // toast success?
            setActiveView('menu');
        } catch (e) {
            console.error(e);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500 pb-32">
            <div className="px-4 mb-6">
                <h2 className="text-2xl font-black italic tracking-tighter uppercase">Merchant Profile</h2>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${theme.textMuted}`}>Edit Business Details</p>
            </div>

            <div className="px-4 space-y-6">
                {/* Profile Photo */}
                <div className="flex flex-col items-center mb-6">
                    <label className="relative group cursor-pointer">
                        <div className={`h-24 w-24 rounded-full border-2 overflow-hidden flex items-center justify-center relative ${isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-gray-100 border-white shadow-lg'}`}>
                            {formData.avatar ? (
                                <img
                                    src={formData.avatar}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        // Fallback to icon by modifying state or showing sibling
                                        // Since we can't easily modify state in onError (loop risk), we hide img and show icon behind or via CSS
                                        const parent = e.currentTarget.parentElement;
                                        if (parent) parent.classList.add('image-error');
                                    }}
                                />
                            ) : null}
                            {/* Fallback Icon - Visible if avatar is missing OR if image error class added */}
                            <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${formData.avatar ? '-z-10' : ''}`}>
                                <UserIcon size={32} className="text-zinc-400" />
                            </div>

                            {isUploading && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>
                        <div className="absolute bottom-0 right-0 bg-yellow-500 text-black p-1.5 rounded-full shadow-lg transform group-hover:scale-110 transition-transform">
                            <Camera size={14} />
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} disabled={isUploading} />
                    </label>
                    <p className="text-[10px] font-bold mt-2 opacity-50 uppercase">Tap to change logo</p>
                </div>

                {/* Business Details */}
                <section className={`p-4 rounded-[2rem] border ${theme.card}`}>
                    <h3 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Store size={14} className="text-yellow-500" /> Business Details
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-bold uppercase ml-3 mb-1 block opacity-50">Business Name</label>
                            <input
                                value={formData.shopName}
                                onChange={e => setFormData({ ...formData, shopName: e.target.value })}
                                className={`w-full p-4 rounded-xl font-bold text-sm outline-none border transition-all focus:border-yellow-500 ${isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-gray-50 border-gray-200'}`}
                                placeholder="Enter business name"
                            />
                        </div>

                        {/* Location Field */}
                        <div>
                            <label className="text-[10px] font-bold uppercase ml-3 mb-1 block opacity-50">Location</label>
                            <div className="flex gap-2">
                                <input
                                    value={formData.shopLocation}
                                    onChange={e => setFormData({ ...formData, shopLocation: e.target.value })}
                                    className={`flex-1 p-4 rounded-xl font-bold text-sm outline-none border transition-all focus:border-yellow-500 ${isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-gray-50 border-gray-200'}`}
                                    placeholder="City, Street or Building"
                                />
                                <button
                                    onClick={handleLocation}
                                    className={`p-4 rounded-xl border flex items-center justify-center ${theme.btnGhost} hover:bg-green-500/10 hover:text-green-500`}
                                    title="Use Current Location"
                                >
                                    <MapPin size={20} />
                                </button>
                            </div>
                            <button className="text-[10px] font-bold text-blue-500 mt-2 flex items-center gap-1 active:scale-95 transition-transform">
                                <MapPin size={10} /> Pin manually on map
                            </button>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold uppercase ml-3 mb-1 block opacity-50">Business Email</label>
                            <input
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className={`w-full p-4 rounded-xl font-bold text-sm outline-none border transition-all focus:border-yellow-500 ${isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-gray-50 border-gray-200'}`}
                                placeholder="Using primary account email"
                                disabled
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase ml-3 mb-1 block opacity-50">KRA PIN</label>
                            <input
                                value={formData.kraPin}
                                onChange={e => setFormData({ ...formData, kraPin: e.target.value })}
                                className={`w-full p-4 rounded-xl font-bold text-sm outline-none border transition-all focus:border-yellow-500 ${isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-gray-50 border-gray-200'}`}
                                placeholder="P0..."
                            />
                        </div>
                    </div>
                </section>

                {/* Admin Details */}
                <section className={`p-6 rounded-[2rem] border ${theme.card}`}>
                    <h3 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                        <UserIcon size={14} className="text-blue-500" /> Admin Details
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-bold uppercase ml-3 mb-1 block opacity-50">Admin Name</label>
                            <input
                                value={formData.contactPerson}
                                onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                                className={`w-full p-4 rounded-xl font-bold text-sm outline-none border transition-all focus:border-yellow-500 ${isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-gray-50 border-gray-200'}`}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase ml-3 mb-1 block opacity-50">Admin Phone</label>
                            <input
                                value={formData.contactPhone}
                                onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                                className={`w-full p-4 rounded-xl font-bold text-sm outline-none border transition-all focus:border-yellow-500 ${isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-gray-50 border-gray-200'}`}
                            />
                        </div>
                    </div>
                </section>

                {/* Socials */}
                <section className={`p-6 rounded-[2rem] border ${theme.card}`}>
                    <h3 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Globe size={14} className="text-pink-500" /> Social Presence
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-bold uppercase ml-3 mb-1 block opacity-50">WhatsApp</label>
                            <input
                                value={formData.whatsapp}
                                onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                                className={`w-full p-3 rounded-xl font-bold text-xs outline-none border transition-all focus:border-yellow-500 ${isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-gray-50 border-gray-200'}`}
                                placeholder="wa.me/..."
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase ml-3 mb-1 block opacity-50">Instagram</label>
                            <input
                                value={formData.instagram}
                                onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                                className={`w-full p-3 rounded-xl font-bold text-xs outline-none border transition-all focus:border-yellow-500 ${isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-gray-50 border-gray-200'}`}
                                placeholder="@handle"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase ml-3 mb-1 block opacity-50">Facebook</label>
                            <input
                                value={formData.facebook}
                                onChange={e => setFormData({ ...formData, facebook: e.target.value })}
                                className={`w-full p-3 rounded-xl font-bold text-xs outline-none border transition-all focus:border-yellow-500 ${isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-gray-50 border-gray-200'}`}
                                placeholder="Page URL"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase ml-3 mb-1 block opacity-50">TikTok</label>
                            <input
                                value={formData.tiktok}
                                onChange={e => setFormData({ ...formData, tiktok: e.target.value })}
                                className={`w-full p-3 rounded-xl font-bold text-xs outline-none border transition-all focus:border-yellow-500 ${isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-gray-50 border-gray-200'}`}
                                placeholder="@handle"
                            />
                        </div>
                    </div>
                </section>

                {/* Payment Method - Radios */}
                <section ref={settlementRef} className={`p-6 rounded-[2rem] border ${theme.card}`}>
                    <h3 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                        <CreditCard size={14} className="text-green-500" /> Settlement Account
                    </h3>
                    <p className="text-[10px] opacity-60 mb-4">Choose ONE default settlement method.</p>

                    <div className="space-y-4">
                        {/* Personal */}
                        <label className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${formData.mpesaType === 'personal' ? 'border-yellow-500 bg-yellow-500/5' : theme.subCard}`}>
                            <input
                                type="radio"
                                name="mpesaType"
                                checked={formData.mpesaType === 'personal'}
                                onChange={() => setFormData({ ...formData, mpesaType: 'personal' })}
                                className="mt-1"
                            />
                            <div className="flex-1">
                                <span className="font-bold text-sm block">M-Pesa Personal</span>
                                {formData.mpesaType === 'personal' && (
                                    <input
                                        value={formData.mpesaNumber}
                                        onChange={e => setFormData({ ...formData, mpesaNumber: e.target.value })}
                                        placeholder="07XX XXX XXX"
                                        className="mt-2 w-full bg-transparent border-b border-zinc-300 dark:border-zinc-700 py-1 text-sm font-bold outline-none focus:border-yellow-500"
                                    />
                                )}
                            </div>
                        </label>

                        {/* Till */}
                        <label className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${formData.mpesaType === 'till' ? 'border-yellow-500 bg-yellow-500/5' : theme.subCard}`}>
                            <input
                                type="radio"
                                name="mpesaType"
                                checked={formData.mpesaType === 'till'}
                                onChange={() => setFormData({ ...formData, mpesaType: 'till' })}
                                className="mt-1"
                            />
                            <div className="flex-1">
                                <span className="font-bold text-sm block">Buy Goods (Till)</span>
                                {formData.mpesaType === 'till' && (
                                    <input
                                        value={formData.tillNumber}
                                        onChange={e => setFormData({ ...formData, tillNumber: e.target.value })}
                                        placeholder="Till Number"
                                        className="mt-2 w-full bg-transparent border-b border-zinc-300 dark:border-zinc-700 py-1 text-sm font-bold outline-none focus:border-yellow-500"
                                    />
                                )}
                            </div>
                        </label>

                        {/* Paybill */}
                        <label className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${formData.mpesaType === 'paybill' ? 'border-yellow-500 bg-yellow-500/5' : theme.subCard}`}>
                            <input
                                type="radio"
                                name="mpesaType"
                                checked={formData.mpesaType === 'paybill'}
                                onChange={() => setFormData({ ...formData, mpesaType: 'paybill' })}
                                className="mt-1"
                            />
                            <div className="flex-1">
                                <span className="font-bold text-sm block">Paybill</span>
                                {formData.mpesaType === 'paybill' && (
                                    <div className="flex gap-2 mt-2">
                                        <input
                                            value={formData.paybillNumber}
                                            onChange={e => setFormData({ ...formData, paybillNumber: e.target.value })}
                                            placeholder="Business No."
                                            className="w-1/2 bg-transparent border-b border-zinc-300 dark:border-zinc-700 py-1 text-sm font-bold outline-none focus:border-yellow-500"
                                        />
                                        <input
                                            value={formData.accountNumber}
                                            onChange={e => setFormData({ ...formData, accountNumber: e.target.value })}
                                            placeholder="Account No."
                                            className="w-1/2 bg-transparent border-b border-zinc-300 dark:border-zinc-700 py-1 text-sm font-bold outline-none focus:border-yellow-500"
                                        />
                                    </div>
                                )}
                            </div>
                        </label>
                    </div>
                </section>

                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full py-4 rounded-2xl bg-yellow-500 text-black font-black uppercase tracking-widest shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-2"
                >
                    {isSaving ? 'Saving...' : 'Save Profile Details'}
                </button>
            </div>
        </div>
    );
};

export const SellerDashboard: React.FC<SellerDashboardProps> = ({ onBack }) => {
    const { user, logout, initialize, updateUser } = useAuthStore();
    const { links, orders, isLoading, fetchSellerData, createProduct, updateProduct } = useSellerStore();

    // Initialize Auth Listener within the component as well, to be safe
    useEffect(() => {
        const unsubscribe = initialize();
        return () => unsubscribe();
    }, [initialize]);

    const [activeView, setActiveView] = useState('home');

    // Standard navigation reset wrapper
    const navigateTo = (view: string) => {
        setScrollToSettlement(false);
        setActiveView(view);
    };
    const [activeTab, setActiveTab] = useState('Products');
    const [linksSearchTerm, setLinksSearchTerm] = useState('');
    const [ordersSearchTerm, setOrdersSearchTerm] = useState('');
    // Orders Sub-tabs
    const [ordersFilter, setOrdersFilter] = useState<'ongoing' | 'completed' | 'disputed'>('ongoing');

    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(user?.notificationsEnabled ?? true);
    const [verificationUploading, setVerificationUploading] = useState(false);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    // UI Helpers
    const [showVerificationPrompt, setShowVerificationPrompt] = useState(false);
    const [scrollToSettlement, setScrollToSettlement] = useState(false);

    // Sync notification state when user loads
    useEffect(() => {
        if (user) {
            setNotificationsEnabled(user.notificationsEnabled ?? true);
        }
    }, [user]);

    // Modals State
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [addProductInitialData, setAddProductInitialData] = useState<any>(null); // New state for pre-filling

    // Verification Logic
    const isProfileComplete = !!(user?.shopName && user?.shopLocation && user?.contactPerson);
    const isVerified = user?.isVerified === true;
    const isVerificationPending = !!user?.verificationDoc && !isVerified;

    // Gating Function
    const handleRestrictedAction = (action: () => void) => {
        if (!isVerified) {
            // If they click a locked feature, explain why
            // If the card is visible (Home view), scroll to it
            const verificationCard = document.getElementById('verification-card');
            if (verificationCard) {
                verificationCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                verificationCard.classList.add('animate-pulse');
                setTimeout(() => verificationCard.classList.remove('animate-pulse'), 1000);
            } else {
                // If not visible (e.g. Insights View), show notification
                showToast("⚠️ Verification Required: Complete setup to continue.");
            }
            return;
        }
        action();
    };

    const handleAiSnap = () => handleRestrictedAction(() => setShowSmartScan(true));
    const handleManualAdd = () => handleRestrictedAction(() => setShowAddProduct(true));
    const handleQRLink = () => handleRestrictedAction(() => setShowQRLink(true));

    const [showSmartScan, setShowSmartScan] = useState(false);
    const [showQRLink, setShowQRLink] = useState(false);

    // Fetch data on mount
    useEffect(() => {
        if (user?.id) {
            fetchSellerData(user.id);
        }
    }, [user, fetchSellerData]);

    // --- DERIVED METRICS ---
    const [scrollToProductId, setScrollToProductId] = useState<string | null>(null);

    // Deep Scroll Logic (Moved to top-level to respect Rules of Hooks)
    useEffect(() => {
        if (scrollToProductId && activeView === 'links') {
            const el = document.getElementById(`product-${scrollToProductId}`);
            if (el) {
                setTimeout(() => {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    el.classList.add('ring-2', 'ring-yellow-500', 'ring-offset-2');
                    setTimeout(() => {
                        el.classList.remove('ring-2', 'ring-yellow-500', 'ring-offset-2');
                        setScrollToProductId(null);
                    }, 2000);
                }, 100);
            }
        }
    }, [scrollToProductId]);

    const safeOrders = orders || [];
    const safeLinks = links || [];

    const totalSettled = safeOrders
        .filter(o => o.status === 'completed' || o.status === 'delivered')
        .reduce((acc, curr) => acc + curr.total, 0);

    const secureHold = safeOrders
        .filter(o => o.status === 'in_transit' || o.status === 'processing' || o.status === 'escrow_held')
        .reduce((acc, curr) => acc + curr.total, 0);

    const totalClicks = safeLinks.reduce((acc, curr) => acc + (curr.clicks || 0), 0);
    const totalSales = safeLinks.reduce((acc, curr) => acc + (curr.sales || 0), 0);
    const conversionRate = totalClicks > 0 ? ((totalSales / totalClicks) * 100).toFixed(1) : '0.0';

    // --- LOGIC HANDLERS ---
    const handleAddProduct = async (productData: any) => {
        if (!user?.id) return;

        try {
            // Extract File objects for upload
            const filesToUpload = productData.images.filter((img: any) => img instanceof File);

            // Prepare data payload (excluding raw files)
            const { images, videos, ...rest } = productData;

            // Check if this is an EDIT or CREATE
            if (addProductInitialData?.id) {
                console.log("Updating Product:", addProductInitialData.id, rest);

                // Pass 'existingImages' separately so store knows what to keep
                // In AddProductModal, we load existing images into 'images' array (as strings)
                // We filter strings to identify existing images
                const existingImages = productData.images.filter((img: any) => typeof img === 'string');

                await updateProduct(addProductInitialData.id, {
                    ...rest,
                    existingImages
                }, filesToUpload);

            } else {
                const payload = {
                    ...rest,
                    sellerId: user.id,
                    sellerName: user.name || 'Store',
                    // Keep existing URLs if any (though createProduct currently overwrites 'images')
                    existingImages: productData.images.filter((img: any) => typeof img === 'string')
                };

                console.log("Creating Product:", payload);
                await createProduct(payload, filesToUpload);
            }

            // Reset and close
            setShowAddProduct(false);
            setAddProductInitialData(null);

            // Refresh data
            fetchSellerData(user.id);

        } catch (error) {
            console.error("Failed to add product:", error);
            // Could add error toast state here
        }
    };

    const handleSmartScan = (scanResult: any) => {
        console.log("Smart Scan Result:", scanResult);
        setAddProductInitialData(scanResult);
        setShowAddProduct(true);
    };

    // Filtered Orders Logic
    const getFilteredOrders = () => {
        let relevantOrders = safeOrders;

        switch (ordersFilter) {
            case 'ongoing':
                relevantOrders = safeOrders.filter(o => ['processing', 'in_transit', 'pending', 'escrow_held'].includes(o.status.toLowerCase()));
                break;
            case 'completed':
                relevantOrders = safeOrders.filter(o => ['delivered', 'completed'].includes(o.status.toLowerCase()));
                break;
            case 'disputed':
                relevantOrders = safeOrders.filter(o => ['disputed', 'cancelled', 'returned'].includes(o.status.toLowerCase()));
                break;
            default:
                break;
        }

        if (ordersSearchTerm.trim()) {
            const lowerTerm = ordersSearchTerm.toLowerCase();
            return relevantOrders.filter(o =>
                o.id.toLowerCase().includes(lowerTerm) ||
                o.items.some(i => i.product.name.toLowerCase().includes(lowerTerm))
            );
        }

        return relevantOrders;
    };

    const filteredOrders = getFilteredOrders();

    const handleCopy = () => {
        showToast("Link Copied!");
    };

    const handleToggleLink = async (link: any, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const newStatus = link.status === 'active' ? 'archived' : 'active';
            await updateProduct(link.id, { status: newStatus });
        } catch (error) {
            console.error("Failed to toggle link status", error);
        }
    };

    const handleShareLink = async (link: any, e: React.MouseEvent) => {
        e.stopPropagation();
        // Force use of name-based slug if regular slug is missing, instead of ID
        const finalSlug = link.slug || slugify(link.name);
        const url = `${window.location.protocol}//${window.location.host}/store/${slugify(user?.shopName || user?.name || '')}/${finalSlug}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: link.name,
                    url: url
                });
            } catch (err) {
                console.error("Share failed:", err);
            }
        } else {
            navigator.clipboard.writeText(url);
            handleCopy();
        }
    };

    // --- THEME CLASSES ---
    const theme = {
        bg: isDarkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900',
        card: isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200 shadow-sm',
        subCard: isDarkMode ? 'bg-black/40 border-zinc-800/50' : 'bg-gray-50 border-gray-100',
        textMuted: isDarkMode ? 'text-zinc-500' : 'text-gray-400',
        navBg: isDarkMode ? 'bg-zinc-900/90 border-zinc-800/50' : 'bg-white/90 border-gray-200 shadow-xl',
        headerBg: isDarkMode ? 'bg-black/80' : 'bg-white/80',
        pill: isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-gray-200 border-gray-300',
        btnGhost: isDarkMode ? 'bg-zinc-800/50 hover:bg-zinc-800' : 'bg-gray-100 hover:bg-gray-200',
        sidebar: isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-gray-200',
        activeTab: isDarkMode ? 'bg-zinc-800 text-white' : 'bg-white text-black shadow-sm'
    };

    // --- VIEWS ---

    const renderLinksView = () => {
        const filteredLinks = safeLinks.filter(link =>
            link.name.toLowerCase().includes(linksSearchTerm.toLowerCase()) &&
            // Filter by activeTab if needed, or show all. User said "List of links... which can be toggled"
            // For now, let's show all and just search
            true
        );

        return (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 pb-32">
                <div className="px-4 mb-6">
                    <h2 className="text-2xl font-black italic tracking-tighter uppercase">My Links</h2>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${theme.textMuted}`}>Manage Checkout Links</p>
                </div>

                <div className="px-4 mb-6">
                    <button
                        onClick={() => handleRestrictedAction(() => setShowAddProduct(true))}
                        className={`w-full py-4 rounded-[1.5rem] flex items-center justify-center gap-3 font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 ${isVerified
                            ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border border-zinc-200 dark:border-zinc-700 opacity-60'
                            }`}
                    >
                        {isVerified ? <Plus size={18} strokeWidth={3} /> : <ShieldCheck size={18} />}
                        <span>{isVerified ? 'Add New Link' : 'Verification Required'}</span>
                    </button>
                </div>

                {/* Search Bar */}
                <div className="px-4 mb-6">
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${theme.card}`}>
                        <Search size={18} className={theme.textMuted} />
                        <input
                            type="text"
                            placeholder="Search links..."
                            value={linksSearchTerm}
                            onChange={(e) => setLinksSearchTerm(e.target.value)}
                            className={`flex-1 bg-transparent outline-none text-sm font-bold ${isDarkMode ? 'text-white placeholder:text-zinc-600' : 'text-black placeholder:text-gray-400'}`}
                        />
                    </div>
                </div>

                <div className="px-4 space-y-3">
                    {filteredLinks.length > 0 ? (
                        filteredLinks.map(link => (
                            <div id={`product-${link.id}`} key={link.id} className={`p-4 rounded-[2rem] border transition-all ${theme.card} ${link.status === 'archived' ? 'opacity-60' : ''}`}>

                                <div className="flex gap-4">
                                    {/* Image */}
                                    <div className={`h-16 w-16 rounded-2xl flex-shrink-0 flex items-center justify-center overflow-hidden border ${isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-gray-100 border-gray-100'}`}>
                                        {link.img ? <img src={link.img} className="w-full h-full object-cover" style={{ filter: link.status === 'archived' ? 'grayscale(100%)' : 'none' }} /> : <Package size={20} className={theme.textMuted} />}
                                    </div>

                                    {/* Middle Content */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <h4 className={`font-bold text-sm truncate pr-2 mb-0.5 ${link.status === 'archived' ? 'line-through text-zinc-500' : ''}`}>{link.name}</h4>
                                        <p className="text-xs font-black text-yellow-500 mb-1.5">KES {link.price?.toLocaleString()}</p>

                                        {/* Compact Stats Row (3 Items Only) */}
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1">
                                                <MousePointer2 size={10} className="text-violet-500" />
                                                <span className={`text-[9px] font-bold ${theme.textMuted}`}>{link.clicks || 0}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <ShoppingBag size={10} className="text-orange-500" />
                                                <span className={`text-[9px] font-bold ${theme.textMuted}`}>{link.sales || 0}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Zap size={10} className="text-green-500" />
                                                <span className={`text-[9px] font-bold ${theme.textMuted}`}>
                                                    {link.clicks > 0 ? ((link.sales / link.clicks) * 100).toFixed(0) : 0}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Actions */}
                                    <div className="flex flex-col items-end gap-2">
                                        <button
                                            disabled={link.status === 'archived'}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setAddProductInitialData(link);
                                                setShowAddProduct(true);
                                            }}
                                            className={`h-8 w-8 rounded-full flex items-center justify-center ${theme.btnGhost} ${link.status === 'archived' ? 'bg-transparent text-zinc-300 pointer-events-none' : ''}`}
                                        >
                                            <Pencil size={14} className={link.status === 'archived' ? "text-zinc-600" : "text-zinc-400 hover:text-blue-500"} />
                                        </button>

                                        <div className="flex items-center gap-2" onClick={(e) => { e.stopPropagation(); }}>
                                            <button
                                                disabled={link.status === 'archived'}
                                                onClick={(e) => handleShareLink(link, e)}
                                                className={`h-6 w-6 rounded-full flex items-center justify-center mr-1 active:scale-95 transition-transform ${link.status === 'archived' ? 'bg-zinc-100 text-zinc-300 pointer-events-none dark:bg-zinc-800 dark:text-zinc-600' : 'bg-blue-500/10 text-blue-500'}`}
                                            >
                                                <Share2 size={12} strokeWidth={3} />
                                            </button>
                                            {/* Toggle Switch Only */}
                                            <button
                                                onClick={(e) => handleToggleLink(link, e)}
                                                className={`h-5 w-9 rounded-full p-0.5 transition-colors flex items-center ${link.status === 'active' ? 'bg-green-500 justify-end' : 'bg-gray-300 dark:bg-zinc-700 justify-start'}`}
                                            >
                                                <div className="h-4 w-4 rounded-full bg-white shadow-sm" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Clickable Link */}
                                <div className={`mt-3 py-2 px-3 rounded-xl text-center ${isDarkMode ? 'bg-zinc-800/50' : 'bg-blue-50'} ${link.status === 'archived' ? 'opacity-50 pointer-events-none' : ''}`}>
                                    <a
                                        href={`${window.location.protocol}//${window.location.host}/store/${slugify(user?.shopName || user?.name || 'store')}/${slugify(link.name)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`text-[10px] font-black hover:underline block truncate ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} ${link.status === 'archived' ? 'text-zinc-500' : ''}`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {window.location.host}/store/.../{slugify(link.name).slice(0, 15)}
                                    </a>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 opacity-50">
                            <p className="font-bold">No links found.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderOrdersView = () => (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500 pb-32">
            <div className="px-6 mb-6">
                <h2 className="text-2xl font-black italic tracking-tighter uppercase">My Orders</h2>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${theme.textMuted}`}>Manage & Track Shipments</p>
            </div>

            {/* Order Status Tabs */}
            <div className="px-4 mb-6">
                <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border mb-4 ${theme.card}`}>
                    <Search size={18} className={theme.textMuted} />
                    <input
                        type="text"
                        placeholder="Search orders by ID or Product Name"
                        value={ordersSearchTerm}
                        onChange={(e) => setOrdersSearchTerm(e.target.value)}
                        className={`flex-1 bg-transparent outline-none text-sm font-bold ${isDarkMode ? 'text-white placeholder:text-zinc-600' : 'text-black placeholder:text-gray-400'}`}
                    />
                </div>

                {/* Tabs */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {['ongoing', 'completed', 'disputed'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setOrdersFilter(status as any)}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wide transition-colors whitespace-nowrap ${ordersFilter === status
                                ? 'bg-yellow-500 text-black'
                                : `${isDarkMode ? 'bg-zinc-800 text-zinc-400' : 'bg-gray-100 text-gray-500'}`
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            <div className="px-4 space-y-4">
                {filteredOrders.length > 0 ? (
                    filteredOrders.map(order => (
                        <div key={order.id} className={`p-4 rounded-[2rem] border ${theme.card}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="font-black text-xs uppercase text-zinc-400 mb-1">Order #{order.id.slice(0, 8)}</p>
                                    <p className="font-black text-sm">KES {order.total.toLocaleString()}</p>
                                </div>
                                <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${order.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                                    (order.status as string) === 'disputed' ? 'bg-red-500/10 text-red-500' :
                                        'bg-yellow-500/10 text-yellow-600'
                                    }`}>
                                    {order.status}
                                </span>
                            </div>
                            {/* Items */}
                            <div className="space-y-2 mb-4">
                                {order.items.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            {item.product?.mediaUrl ? <img src={item.product.mediaUrl} className="w-full h-full object-cover" /> : <Package size={20} className="m-2 text-zinc-300" />}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold line-clamp-1">{item.product?.name || 'Product'}</p>
                                            <p className="text-[10px] text-zinc-400">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-[10px] text-zinc-400 text-right">{new Date(order.createdAt as string | number | Date).toLocaleDateString()}</p>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 opacity-50">
                        <ShoppingBag size={48} className="mx-auto mb-4 text-zinc-300" />
                        <p className="font-bold">No {ordersFilter} orders found.</p>
                    </div>
                )}
            </div>
        </div>
    );

    const InsightsView = () => {
        // --- 1. Real Data Aggregation ---
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toISOString().split('T')[0] as string;
        });

        // Revenue Trend (Group Orders by Date)
        const revenueData = last7Days.map(dateStr => {
            const dayOrders = safeOrders.filter(o => {
                if (!o.createdAt) return false;
                try {
                    return new Date(o.createdAt as string | number | Date).toISOString().split('T')[0] === dateStr;
                } catch (e) { return false; }
            });
            const dailyTotal = dayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
            return {
                date: dateStr,
                dayName: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' }),
                revenue: dailyTotal
            };
        });

        const maxRevenue = Math.max(...revenueData.map(d => d.revenue), 100); // Avoid div by zero

        // Top Performing Products
        const topProducts = safeLinks
            .sort((a, b) => (b.sales || 0) - (a.sales || 0))
            .slice(0, 3);

        // Channel Distribution (Proxy Data)
        const channelData = [
            { name: 'WhatsApp', conversions: totalClicks > 0 ? Math.floor(totalClicks * 0.45) : 0, color: '#25D366' },
            { name: 'TikTok', conversions: totalClicks > 0 ? Math.floor(totalClicks * 0.25) : 0, color: isDarkMode ? '#ffffff' : '#000000' },
            { name: 'Instagram', conversions: totalClicks > 0 ? Math.floor(totalClicks * 0.15) : 0, color: '#E1306C' },
            { name: 'Facebook', conversions: totalClicks > 0 ? Math.floor(totalClicks * 0.10) : 0, color: '#1877F2' },
            { name: 'Web', conversions: totalClicks > 0 ? Math.floor(totalClicks * 0.05) : 0, color: '#8b5cf6' }
        ];

        // --- 2. AI Business Coach Logic ---
        const handleShareStore = async () => {
            const url = `${window.location.protocol}//${window.location.host}/store/${slugify(user?.shopName || user?.name || 'store')}`;
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: user?.shopName || 'My Store',
                        url
                    });
                } catch (e) { }
            } else {
                navigator.clipboard.writeText(url);
                // Assuming setShowCopyToast is available in scope
                showToast("Store Link Copied!");
            }
        };

        const generateAiInsight = () => {
            // Priority 0: Empty Store
            if (safeLinks.length === 0) return {
                title: "Empty Store",
                msg: "Your store is empty. Customers can't buy anything until you add a checkout link. Create your first checkout link now.",
                action: "Add Checkout Link",
                handler: () => handleRestrictedAction(() => setShowAddProduct(true)),
                color: "text-red-500",
                bg: "bg-red-500/10",
                icon: Plus
            };

            if (totalClicks === 0) return {
                title: "Invisibility Alert",
                msg: "Your store has zero traffic. The algorithm can't help you if no one sees your products. Share your store link on social media to kickstart traffic.",
                action: "Share Store Link",
                handler: handleShareStore,
                color: "text-red-500",
                bg: "bg-red-500/10",
                icon: AlertCircle
            };

            if (totalClicks > 20 && safeOrders.length === 0) return {
                title: "Conversion Gap",
                msg: `You had ${totalClicks} visitors but 0 sales. Your prices might be too high or product photos aren't clear enough. Try lowering prices by 10%.`,
                action: "Edit Products",
                handler: () => navigateTo('links'),
                color: "text-orange-500",
                bg: "bg-orange-500/10",
                icon: TrendingUp
            };

            if (safeOrders.length > 0) return {
                title: "Growth Opportunity",
                msg: `Great job! "${topProducts[0]?.name || 'Your top product'}" is winning. Bundling it with another item could increase your average order value by 30%.`,
                action: "Create Bundle",
                handler: () => navigateTo('links'),
                color: "text-green-500",
                bg: "bg-green-500/10",
                icon: Sparkles
            };

            return {
                title: "Gathering Data",
                msg: "We are learning about your customers. Keep sharing links to build your profile.",
                action: "Keep Sharing",
                handler: handleShareStore,
                color: "text-blue-500",
                bg: "bg-blue-500/10",
                icon: BarChart3
            };
        };

        const aiInsight = generateAiInsight();

        return (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 pb-32">
                <div className="px-4 mb-6">
                    <h2 className="text-2xl font-black italic tracking-tighter uppercase">Pulse Insights</h2>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${theme.textMuted}`}>Real-time Store Analytics</p>
                </div>

                {/* AI Insight Card */}
                <div className="px-4 mb-6">
                    <div className={`p-5 rounded-[2rem] border relative overflow-hidden ${theme.card}`}>
                        <div className={`absolute top-0 right-0 p-3 opacity-20 ${aiInsight.color}`}>
                            <aiInsight.icon size={80} />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${aiInsight.bg} ${aiInsight.color}`}>
                                    AI Insight
                                </span>
                                <span className={`text-[10px] font-black uppercase ${aiInsight.color}`}>{aiInsight.title}</span>
                            </div>

                            <p className="text-sm font-bold leading-relaxed pr-8 mb-4">
                                {aiInsight.msg}
                            </p>

                            <button
                                onClick={aiInsight.handler}
                                className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:underline ${aiInsight.color}`}
                            >
                                {aiInsight.action} <ArrowUpRight size={12} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 px-4 mb-6">
                    <div className={`p-4 rounded-[2rem] border ${theme.card}`}>
                        <div className="bg-blue-500/10 text-blue-500 h-8 w-8 rounded-lg flex items-center justify-center mb-3">
                            <MousePointer2 size={16} />
                        </div>
                        <p className={`text-[9px] font-black uppercase tracking-widest ${theme.textMuted}`}>Total Clicks</p>
                        <div className="flex items-end gap-2">
                            <p className="text-xl font-black italic">{totalClicks.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className={`p-4 rounded-[2rem] border ${theme.card}`}>
                        <div className="bg-green-500/10 text-green-500 h-8 w-8 rounded-lg flex items-center justify-center mb-3">
                            <CreditCard size={16} />
                        </div>
                        <p className={`text-[9px] font-black uppercase tracking-widest ${theme.textMuted}`}>Orders</p>
                        <div className="flex items-end gap-2">
                            <p className="text-xl font-black italic">{safeOrders.length}</p>
                            <span className={`text-[9px] font-bold mb-1 ${parseFloat(conversionRate) > 2 ? 'text-green-500' : 'text-orange-500'}`}>
                                {conversionRate}% Conv
                            </span>
                        </div>
                    </div>
                </div>

                {/* Revenue Chart (Real Data) */}
                <section className="px-4 mb-6">
                    <div className={`p-5 rounded-[2.5rem] border ${theme.card}`}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className={`text-[10px] font-black uppercase tracking-widest ${theme.textMuted}`}>Revenue Trend (7d)</h3>
                            <h3 className="text-xs font-black">KES {totalSettled.toLocaleString()}</h3>
                        </div>

                        <div className="flex items-end justify-between h-32 px-1 gap-1.5">
                            {revenueData.map((data, i) => {
                                const heightPercent = maxRevenue > 0 ? (data.revenue / maxRevenue) * 100 : 5;
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                                        <div className="relative w-full h-full flex items-end">
                                            <div
                                                className={`w-full rounded-md transition-all duration-500 min-h-[4px] ${data.revenue > 0
                                                    ? 'bg-yellow-500 group-hover:bg-yellow-400'
                                                    : isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'
                                                    }`}
                                                style={{ height: `${heightPercent}%` }}
                                            ></div>
                                        </div>
                                        <span className={`text-[8px] font-bold uppercase ${theme.textMuted}`}>
                                            {data.dayName.slice(0, 1)}
                                        </span>
                                        {/* Tooltip */}
                                        {data.revenue > 0 && (
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[9px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                                                {data.revenue.toLocaleString()}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Social Media Conversion Chart */}
                <section className="px-4 mb-6">
                    <div className={`p-6 rounded-[2.5rem] border ${theme.card}`}>
                        <h3 className={`text-[10px] font-black uppercase tracking-widest mb-4 ${theme.textMuted}`}>Social Media Conversion</h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={channelData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                                    <XAxis
                                        dataKey="name"
                                        interval={0}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={({ x, y, payload }) => {
                                            const channel = channelData.find(c => c.name === payload.value);
                                            return (
                                                <text x={x} y={y} dy={12} textAnchor="middle" fill={channel?.color || '#888'} fontSize={9} fontWeight="900">
                                                    {payload.value}
                                                </text>
                                            );
                                        }}
                                    />
                                    <YAxis width={30} tick={{ fontSize: 10 }} stroke="#888888" axisLine={false} tickLine={false} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ backgroundColor: isDarkMode ? '#27272a' : '#fff', borderRadius: '12px', border: `1px solid ${isDarkMode ? '#3f3f46' : '#e5e7eb'}` }}
                                        itemStyle={{ color: isDarkMode ? '#fff' : '#000', fontSize: '12px', fontWeight: 'bold' }}
                                    />
                                    <Bar dataKey="conversions" radius={[4, 4, 4, 4]} barSize={40}>
                                        {channelData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </section>

                {/* Top Products List */}
                <section className="px-4 mb-6">
                    <div className={`p-6 rounded-[2.5rem] border ${theme.card}`}>
                        <h3 className={`text-[10px] font-black uppercase tracking-widest mb-4 ${theme.textMuted}`}>Top Performers</h3>
                        <div className="space-y-4">
                            {topProducts.length > 0 ? topProducts.map((prod, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="font-black text-xs text-zinc-300 w-4">#{i + 1}</div>
                                        <div className={`h-8 w-8 rounded-lg overflow-hidden border ${isDarkMode ? 'border-zinc-700' : 'border-gray-200'}`}>
                                            <img src={prod.img || '/placeholder.png'} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold line-clamp-1 max-w-[120px]">{prod.name}</p>
                                            <p className={`text-[9px] ${theme.textMuted}`}>{prod.sales || 0} sold</p>
                                        </div>
                                    </div>
                                    <p className="text-xs font-black text-yellow-500">KES {((prod.price || 0) * (prod.sales || 0)).toLocaleString()}</p>
                                </div>
                            )) : (
                                <p className="text-center text-[10px] italic text-zinc-500 py-4">No sales data yet.</p>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        );
    };



    const HomeView = () => (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Email Verification Banner */}
            {!user?.isEmailVerified && (
                <div className="mx-4 mb-6 p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-500 text-white rounded-full">
                            <Mail size={16} />
                        </div>
                        <div>
                            <p className="font-bold text-sm text-orange-900 dark:text-orange-500">Email Verification Required</p>
                            <p className="text-xs opacity-70">Verify your email to unlock all features.</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-4">
                {/* Wallet & Metrics */}
                <div className="lg:col-span-8">
                    <section className="mb-8">
                        {!isVerified ? (
                            <div id="verification-card" className={`p-6 rounded-[2rem] border-2 border-dashed ${isVerificationPending ? 'border-yellow-500/50 bg-yellow-500/5' : 'border-red-500/50 bg-red-500/5'}`}>
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                            <ShieldCheck size={16} className={isVerificationPending ? 'text-yellow-500' : 'text-red-500'} />
                                            {isVerificationPending ? 'Verification Pending' : 'Setup Mode'}
                                        </h3>
                                        <p className="text-[10px] opacity-60 mt-1 max-w-[250px] leading-relaxed">
                                            {isVerificationPending
                                                ? "Your store is under review. Selling is disabled until verified. Typical wait: 2-24 hrs."
                                                : "You are in Setup Mode. Complete the checklist below to unlock selling features."}
                                        </p>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${isVerificationPending ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                        {isVerificationPending ? 'In Review' : 'Action Required'}
                                    </div>
                                </div>

                                <div className="space-y-3 bg-white/50 dark:bg-black/20 p-4 rounded-xl">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-6 w-6 rounded-full flex items-center justify-center transition-colors ${isProfileComplete ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                                {isProfileComplete ? <CheckCircle2 size={14} /> : <span className="text-[10px] font-bold">1</span>}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className={`text-xs font-bold ${isProfileComplete ? 'text-zinc-700 dark:text-zinc-300' : 'text-zinc-500'}`}>Complete Business Profile</span>
                                                {!isProfileComplete && <span className="text-[9px] text-red-400">Missing: Location, Contact Name</span>}
                                            </div>
                                        </div>
                                        {!isProfileComplete && (
                                            <button
                                                onClick={() => setActiveView('profile')}
                                                className="text-[10px] font-black uppercase text-blue-500 hover:underline"
                                            >
                                                Fix Now
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-6 w-6 rounded-full flex items-center justify-center transition-colors ${user?.verificationDoc ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                                {user?.verificationDoc ? <CheckCircle2 size={14} /> : <span className="text-[10px] font-bold">2</span>}
                                            </div>
                                            <span className={`text-xs font-bold ${user?.verificationDoc ? 'text-zinc-700 dark:text-zinc-300' : 'text-zinc-500'}`}>Upload KRA Certificate</span>
                                        </div>
                                        {!user?.verificationDoc && (
                                            <button
                                                onClick={() => setActiveView('identity')}
                                                className="text-[10px] font-black uppercase text-blue-500 hover:underline flex items-center gap-1"
                                            >
                                                Start <ChevronRight size={10} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className={`border p-4 rounded-[2.5rem] relative overflow-hidden ${theme.card}`}>
                                <div className="absolute -right-8 -top-8 w-32 h-32 bg-green-500/10 rounded-full blur-3xl"></div>
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${theme.textMuted}`}>Total Settled (30d)</span>
                                            <div className="bg-green-500/10 text-green-500 text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 font-bold">
                                                <ArrowUpRight size={10} /> +0%
                                            </div>
                                        </div>
                                        <h2 className="text-4xl md:text-5xl font-black tracking-tight italic">
                                            <span className={`text-sm md:text-base not-italic font-bold mr-1 ${theme.textMuted}`}>KES</span>
                                            {totalSettled.toLocaleString()}
                                        </h2>
                                    </div>
                                    <div onClick={() => { navigateTo('orders'); setOrdersFilter('ongoing'); }} className={`flex flex-col items-end cursor-pointer group mr-2`}>
                                        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 flex items-center gap-1 ${theme.textMuted} transition-colors`}>
                                            <ShieldCheck size={10} className="text-yellow-500 group-hover:rotate-12 transition-transform" /> Secure Hold
                                        </p>
                                        <p className="font-black text-xl group-hover:text-yellow-500 transition-colors">KES {secureHold.toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4">
                                    {/* Performance Card: Channels & Links */}
                                    <div className={`border rounded-2xl p-4 flex flex-col justify-between ${theme.subCard}`}>
                                        {/* Top Product Links Section (Priority) */}
                                        <div
                                            onClick={() => navigateTo('links')}
                                            className="cursor-pointer group mb-3"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <p className={`text-[10px] font-black uppercase tracking-widest ${theme.textMuted} group-hover:text-yellow-600 transition-colors`}>Top 3 Checkout Links</p>
                                                <span className="text-[9px] font-bold text-blue-500 uppercase flex items-center gap-0.5">View All <ChevronRight size={10} /></span>
                                            </div>

                                            <div className="grid grid-cols-3 gap-3">
                                                {links.slice().sort((a, b) => (b.sales || 0) - (a.sales || 0)).slice(0, 3).map((link, i) => (
                                                    <div
                                                        onClick={() => {
                                                            setScrollToProductId(String(link.id));
                                                            navigateTo('links');
                                                        }}
                                                        key={link.id || i}
                                                        className="group/card relative aspect-square rounded-xl overflow-hidden border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 shadow-sm transition-all hover:shadow-md hover:border-yellow-500/30 cursor-pointer"
                                                    >
                                                        {/* Image - Full Coverage */}
                                                        <img
                                                            src={link.img}
                                                            alt={link.name}
                                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                                                        />

                                                        {/* Gradient Overlay */}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover/card:opacity-80 transition-opacity" />

                                                        {/* Content Overlay */}
                                                        <div className="absolute inset-x-0 bottom-0 p-2 text-white transform transition-transform duration-300">
                                                            <p className="font-bold text-[10px] leading-3 line-clamp-2 mb-1.5 text-white/90 group-hover/card:text-white">{link.name}</p>

                                                            <div className="flex items-center justify-between">
                                                                <p className="font-black text-[10px] text-yellow-400">KES {link.price?.toLocaleString()}</p>

                                                                <button
                                                                    onClick={(e) => handleShareLink(link, e)}
                                                                    className="h-5 w-5 rounded-full flex items-center justify-center bg-white/20 hover:bg-yellow-400 text-white hover:text-black backdrop-blur-md transition-all active:scale-95"
                                                                >
                                                                    <Share2 size={10} strokeWidth={2.5} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                {links.length === 0 && (
                                                    <div className="col-span-3 py-8 text-center border-2 border-dashed border-gray-100 dark:border-zinc-800 rounded-xl">
                                                        <p className={`text-[9px] italic ${theme.textMuted}`}>No checkout links active. <br />Create one to start selling.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Channels Section */}
                                        <div
                                            className="pt-3 border-t border-dashed border-gray-200 dark:border-zinc-800"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <p className={`text-[10px] font-black uppercase tracking-widest ${theme.textMuted}`}>Top 3 Channels</p>
                                            </div>
                                            <div className="flex flex-wrap items-center justify-start gap-3 px-1">
                                                {/* Dynamic Channels Display utilizing totalClicks as proxy for activity distribution */}
                                                {[
                                                    { count: totalClicks > 0 ? Math.floor(totalClicks * 0.6) : 0, color: '#8b5cf6', bg: 'bg-violet-500/10', icon: Globe },
                                                    { count: totalClicks > 0 ? Math.floor(totalClicks * 0.25) : 0, color: '#25D366', bg: 'bg-[#25D366]/10', path: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z' },
                                                    { count: totalClicks > 0 ? Math.floor(totalClicks * 0.15) : 0, color: '#E1306C', bg: 'bg-[#E1306C]/10', icon: Instagram }
                                                ].map((social, i) => (
                                                    <div key={i} className="flex items-center gap-1.5">
                                                        <div className={`h-6 w-6 rounded-full flex items-center justify-center ${social.bg}`}>
                                                            {social.path ? (
                                                                <svg viewBox="0 0 24 24" className="w-3 h-3" fill={social.color}>
                                                                    <path d={social.path} />
                                                                </svg>
                                                            ) : (
                                                                // @ts-ignore
                                                                <social.icon size={12} className={i === 0 ? "text-violet-500" : "text-[#E1306C]"} />
                                                            )}
                                                        </div>
                                                        <span className={`text-[10px] font-black ${theme.textMuted}`}>
                                                            {social.count >= 1000 ? (social.count / 1000).toFixed(1) + 'k' : social.count}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <p className={`mt-4 text-[10px] text-center font-medium text-green-600`}>Funds settled to your M-Pesa instantly after delivery.</p>
                            </div>
                        )}
                    </section>

                    {/* Quick Create Speed Zone */}
                    <section className="mb-10">
                        <h3 className={`text-xs font-black uppercase tracking-widest mb-4 flex items-center justify-between ${theme.textMuted}`}>
                            Quick Actions
                            {!isVerified && <span className="text-[9px] text-red-500 flex items-center gap-1"><ShieldCheck size={10} /> Verification Required</span>}
                        </h3>
                        <div className={`flex gap-4 overflow-x-auto pb-4 no-scrollbar ${!isVerified ? 'opacity-50 grayscale' : ''}`}>
                            {[
                                {
                                    icon: (
                                        <div className="relative">
                                            <Camera />
                                            <Sparkles size={14} className="absolute -top-2 -right-2 fill-current animate-pulse" />
                                        </div>
                                    ),
                                    label: 'AI Snap',
                                    color: 'text-yellow-500',
                                    action: () => handleAiSnap()
                                },
                                { icon: <Plus />, label: 'Manual Add', color: 'text-blue-500', action: () => handleManualAdd() },
                                { icon: <QrCode />, label: 'Bio Link', color: isDarkMode ? 'text-white' : 'text-black', action: () => handleQRLink() },
                                { icon: <ShoppingBag />, label: 'Orders', color: 'text-orange-500', action: () => navigateTo('orders') }
                            ].map((item, i) => (
                                <button key={i} onClick={item.action} className="flex-shrink-0 flex flex-col items-center gap-3 group relative">
                                    <div className={`h-16 w-16 md:h-20 md:w-20 rounded-3xl flex items-center justify-center border shadow-xl active:scale-95 transition-transform ${theme.card}`}>
                                        <span className={item.color}>{item.icon}</span>
                                        {!isVerified && item.label !== 'Orders' && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-3xl backdrop-blur-[1px]">
                                                <ShieldCheck size={18} className="text-zinc-500" />
                                            </div>
                                        )}
                                    </div>
                                    <span className={`text-[11px] font-bold ${isDarkMode ? 'text-zinc-300' : 'text-gray-600'}`}>{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Smart Toggles & Feed */}
                    <section className="pb-32 lg:pb-12">
                        <div className={`p-1.5 rounded-[1.5rem] flex gap-1 mb-8 border shadow-inner max-w-md ${theme.card}`}>
                            {['Products', 'Services', 'Tickets'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => {
                                        if (tab === 'Products') {
                                            setActiveTab(tab);
                                        } else {
                                            // Coming Soon Logic
                                            const el = document.getElementById(`tab-text-${tab}`);
                                            if (el) {
                                                el.innerText = "Coming Soon";
                                                el.classList.add("text-yellow-600");
                                                setTimeout(() => {
                                                    el.innerText = tab;
                                                    el.classList.remove("text-yellow-600");
                                                }, 2000);
                                            }
                                        }
                                    }}
                                    className={`flex-1 py-3 rounded-2xl text-[11px] font-black transition-all flex items-center justify-center gap-2 uppercase tracking-tight ${activeTab === tab
                                        ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20'
                                        : `${theme.textMuted} ${tab === 'Products' ? 'hover:text-yellow-500 cursor-pointer' : 'cursor-pointer'}`
                                        }`}
                                >
                                    {tab === 'Products' && <Package size={14} />}
                                    {tab === 'Services' && <Wrench size={14} />}
                                    {tab === 'Tickets' && <Ticket size={14} />}
                                    <span id={`tab-text-${tab}`}>{tab}</span>
                                </button>
                            ))}
                        </div>

                        {/* Compact See All Button (Right under tabs) */}
                        {activeTab === 'Products' && safeLinks.length > 0 && (
                            <div className="flex justify-end px-2 mb-4">
                                <button
                                    onClick={() => navigateTo('links')}
                                    className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-600 flex items-center gap-1 active:scale-95 transition-transform"
                                >
                                    See All Links <ChevronRight size={12} />
                                </button>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Filter Links: For now we show all links under 'Products', others empty */}
                            {activeTab === 'Products' && safeLinks.length === 0 && !isLoading && (
                                <div className="col-span-full border-2 border-dashed rounded-[2.2rem] p-8 text-center opacity-50">
                                    <p className="text-sm font-bold">No checkout links yet.</p>
                                </div>
                            )}
                            {activeTab === 'Products' && safeLinks.slice(0, 5).map((link) => (
                                <div key={link.id} className={`p-4 rounded-[2rem] border transition-all ${theme.card} ${link.status === 'archived' ? 'opacity-60' : ''}`}>

                                    <div className="flex gap-4">
                                        {/* Image */}
                                        <div className={`h-16 w-16 rounded-2xl flex-shrink-0 flex items-center justify-center overflow-hidden border ${isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-gray-100 border-gray-100'}`}>
                                            {link.img ? <img src={link.img} className="w-full h-full object-cover" style={{ filter: link.status === 'archived' ? 'grayscale(100%)' : 'none' }} /> : <Package size={20} className={theme.textMuted} />}
                                        </div>

                                        {/* Middle Content */}
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <h4 className={`font-bold text-sm truncate pr-2 mb-0.5 ${link.status === 'archived' ? 'line-through text-zinc-500' : ''}`}>{link.name}</h4>
                                            <p className="text-xs font-black text-yellow-500 mb-1.5">KES {link.price?.toLocaleString()}</p>

                                            {/* Compact Stats Row (3 Items Only) */}
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1">
                                                    <MousePointer2 size={10} className="text-violet-500" />
                                                    <span className={`text-[9px] font-bold ${theme.textMuted}`}>{link.clicks || 0}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <ShoppingBag size={10} className="text-orange-500" />
                                                    <span className={`text-[9px] font-bold ${theme.textMuted}`}>{link.sales || 0}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Zap size={10} className="text-green-500" />
                                                    <span className={`text-[9px] font-bold ${theme.textMuted}`}>
                                                        {link.clicks > 0 ? ((link.sales / link.clicks) * 100).toFixed(0) : 0}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Actions */}
                                        <div className="flex flex-col items-end gap-2">
                                            <button
                                                disabled={link.status === 'archived'}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setAddProductInitialData(link);
                                                    setShowAddProduct(true);
                                                }}
                                                className={`h-8 w-8 rounded-full flex items-center justify-center ${theme.btnGhost} ${link.status === 'archived' ? 'bg-transparent text-zinc-300 pointer-events-none' : ''}`}
                                            >
                                                <Pencil size={14} className={link.status === 'archived' ? "text-zinc-600" : "text-zinc-400 hover:text-blue-500"} />
                                            </button>

                                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    disabled={link.status === 'archived'}
                                                    onClick={(e) => handleShareLink(link, e)}
                                                    className={`h-6 w-6 rounded-full flex items-center justify-center mr-1 active:scale-95 transition-transform ${link.status === 'archived' ? 'bg-zinc-100 text-zinc-300 pointer-events-none dark:bg-zinc-800 dark:text-zinc-600' : 'bg-blue-500/10 text-blue-500'}`}
                                                >
                                                    <Share2 size={12} strokeWidth={3} />
                                                </button>
                                                {/* Toggle Switch Only */}
                                                <button
                                                    onClick={(e) => handleToggleLink(link, e)}
                                                    className={`h-5 w-9 rounded-full p-0.5 transition-colors flex items-center ${link.status === 'active' ? 'bg-green-500 justify-end' : 'bg-gray-300 dark:bg-zinc-700 justify-start'}`}
                                                >
                                                    <div className="h-4 w-4 rounded-full bg-white shadow-sm" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Clickable Link */}
                                    <div className={`mt-3 py-2 px-3 rounded-xl text-center ${isDarkMode ? 'bg-zinc-800/50' : 'bg-blue-50'} ${link.status === 'archived' ? 'opacity-50 pointer-events-none' : ''}`}>
                                        <a
                                            href={`${window.location.protocol}//${window.location.host}/store/${slugify(user?.shopName || user?.name || 'store')}/${slugify(link.name)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`text-[10px] font-black hover:underline block truncate ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} ${link.status === 'archived' ? 'text-zinc-500' : ''}`}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {window.location.host}/store/.../{slugify(link.name).slice(0, 15)}
                                        </a>
                                    </div>
                                </div>
                            ))}

                            {activeTab === 'Products' && safeLinks.length > 5 && (
                                <button
                                    onClick={() => navigateTo('links')}
                                    className="col-span-full py-4 text-xs font-black uppercase tracking-widest text-yellow-600 hover:text-yellow-500 transition-colors"
                                >
                                    See All Links ({safeLinks.length})
                                </button>
                            )}

                            {/* Fallback for other tabs */}
                            {activeTab !== 'Products' && (
                                <div className="col-span-full py-12 text-center opacity-50 italic">
                                    Coming soon for {activeTab}
                                </div>
                            )}

                            {/* Create New Button */}
                            <button
                                onClick={() => handleRestrictedAction(() => setShowAddProduct(true))}
                                className={`w-full border-2 border-dashed py-8 rounded-[2.2rem] flex flex-col items-center justify-center gap-2 transition-all group ${theme.card} ${!isVerified ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:border-yellow-500/30 cursor-pointer'}`}
                            >
                                <div className={`relative h-12 w-12 rounded-full flex items-center justify-center transition-all group-hover:bg-yellow-500 group-hover:text-black ${isDarkMode ? 'bg-zinc-800 text-zinc-400' : 'bg-gray-100 text-gray-500'}`}>
                                    <Plus size={24} />
                                    {!isVerified && (
                                        <div className="absolute -top-1 -right-1 bg-zinc-200 dark:bg-zinc-700 rounded-full p-1">
                                            <ShieldCheck size={12} className="text-zinc-500" />
                                        </div>
                                    )}
                                </div>
                                <span className={`text-xs font-black uppercase tracking-widest ${theme.textMuted} group-hover:text-yellow-500`}>Generate {activeTab.slice(0, -1)} Link</span>
                            </button>
                        </div>
                    </section>
                </div>

                {/* Desktop Sidebar Column */}
                <div className="hidden lg:block lg:col-span-4 space-y-6">
                    <div className={`p-6 rounded-[2.5rem] border ${theme.card}`}>
                        <h3 className="text-xs font-black uppercase tracking-widest mb-4 italic">Merchant Activity</h3>
                        <div className="space-y-4">
                            {/* Mock activity if no orders */}
                            {safeOrders.length === 0 ? (
                                <>
                                    {[
                                        { icon: <ShoppingBag size={14} />, text: "Welcome to SokoSnap!", time: "Just now", color: "text-green-500" },
                                        { icon: <TrendingUp size={14} />, text: "Finish setting up profile", time: "Action Item", color: "text-yellow-500" },
                                    ].map((activity, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className={`h-8 w-8 rounded-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 ${activity.color}`}>
                                                {activity.icon}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold">{activity.text}</p>
                                                <p className="text-[10px] text-zinc-400">{activity.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                safeOrders.slice(0, 5).map((order) => (
                                    <div key={order.id} className="flex items-center gap-3">
                                        <div className={`h-8 w-8 rounded-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-blue-500`}>
                                            <CreditCard size={14} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold">New Order: KES {order.total}</p>
                                            <p className="text-[10px] text-zinc-400">{new Date().toLocaleTimeString()}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className={`p-6 rounded-[2.5rem] border ${theme.card}`}>
                        <h3 className="text-xs font-black uppercase tracking-widest mb-4 italic">Market Growth</h3>
                        {/* Chart Placeholder */}
                        {totalSettled > 0 ? (
                            // Use actual chart if we have data (or placeholder for now)
                            <div className="h-24 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl flex items-center justify-center border border-zinc-100 dark:border-zinc-800">
                                <TrendingUp className="text-green-500 opacity-30" size={48} />
                            </div>
                        ) : (
                            // Zero state chart
                            <div className="h-24 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl flex items-center justify-center border border-zinc-100 dark:border-zinc-800 relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-10"></div>
                                <p className="text-[10px] font-black uppercase text-zinc-300">No Data Yet</p>
                            </div>
                        )}

                        <p className="text-[10px] mt-4 font-medium text-zinc-500 leading-relaxed uppercase tracking-tighter">
                            {totalClicks > 100
                                ? "Your store traffic is booming! Keep sharing."
                                : "Share your links on WhatsApp to boost traffic (+42% avg)."
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    // Read-only view for settlement
    const renderSettlement = () => (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500 pb-32">
            <div className="px-6 mb-6">
                <h2 className="text-2xl font-black italic tracking-tighter uppercase">Settlement</h2>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${theme.textMuted}`}>Active Payment Method</p>
            </div>

            <div className="px-6">
                <div className={`p-8 rounded-[2.5rem] border flex flex-col items-center text-center gap-4 ${theme.card}`}>
                    <div className="h-20 w-20 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mb-2">
                        <CreditCard size={40} />
                    </div>

                    <h3 className="text-xl font-bold">Active Account</h3>

                    {user?.mpesaType === 'personal' && (
                        <div>
                            <p className="text-xs font-bold uppercase opacity-50 mb-1">M-Pesa Personal</p>
                            <p className="text-2xl font-black tracking-tight">{user?.mpesaNumber || 'Not Set'}</p>
                        </div>
                    )}

                    {user?.mpesaType === 'till' && (
                        <div>
                            <p className="text-xs font-bold uppercase opacity-50 mb-1">Buy Goods Till</p>
                            <p className="text-2xl font-black tracking-tight">{user?.tillNumber || 'Not Set'}</p>
                        </div>
                    )}

                    {user?.mpesaType === 'paybill' && (
                        <div>
                            <p className="text-xs font-bold uppercase opacity-50 mb-1">Paybill</p>
                            <p className="text-2xl font-black tracking-tight mb-2">{user?.paybillNumber || 'Not Set'}</p>
                            <p className="text-sm font-bold bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">Acc: {user?.accountNumber}</p>
                        </div>
                    )}

                    {!user?.mpesaType && <p className="text-red-500 font-bold">No payment method configured.</p>}

                    <button onClick={() => {
                        setScrollToSettlement(true);
                        setActiveView('profile');
                    }} className="mt-8 text-xs font-black uppercase text-blue-500 hover:underline">
                        Change Settlement Method
                    </button>
                </div>

                <p className="text-center text-[10px] text-zinc-500 mt-6 px-10">
                    Funds are automatically settled to this account instantly upon order completion.
                </p>
            </div>
        </div>
    );

    const handleVerificationUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user?.id) return;

        setVerificationUploading(true);
        try {
            const fileRef = ref(storage, `verification/${user.id}/${Date.now()}_${file.name}`);
            await uploadBytes(fileRef, file);
            const url = await getDownloadURL(fileRef);

            // @ts-ignore
            await updateUser({ verificationDoc: url });

            // Force local update if needed (though store handles it)
            alert("Document uploaded successfully! Your verification is now pending.");
            window.location.reload(); // Refresh to ensure state sync

        } catch (error) {
            console.error("Verification upload failed", error);
            alert("Upload failed. Please try again.");
        } finally {
            setVerificationUploading(false);
        }
    };

    const renderVerification = () => (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500 pb-32">
            <div className="px-6 mb-6">
                <h2 className="text-2xl font-black italic tracking-tighter uppercase">Identity</h2>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${theme.textMuted}`}>Tier 2 Verification</p>
            </div>

            <div className="px-6 space-y-6">
                {!isVerified ? (
                    <>
                        <div className={`p-6 rounded-[2rem] border ${theme.card} ${isVerificationPending ? 'border-yellow-500/50 bg-yellow-500/5' : 'border-red-500/50 bg-red-500/5'}`}>
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                        <ShieldCheck size={16} className={isVerificationPending ? 'text-yellow-500' : 'text-red-500'} />
                                        {isVerificationPending ? 'Verification Pending' : 'Action Required'}
                                    </h3>
                                    <p className="text-[10px] opacity-60 mt-1 max-w-[250px] leading-relaxed">
                                        {isVerificationPending
                                            ? "Your store is under review. Our team checks documents every 6 hours."
                                            : "You are currently in Setup Mode. Upload your KRA Certificate to unlock selling."}
                                    </p>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${isVerificationPending ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                    {isVerificationPending ? 'In Review' : 'Tier 1'}
                                </div>
                            </div>

                            {!user?.verificationDoc && (
                                <div className="mt-4">
                                    <h4 className="text-[10px] font-bold uppercase opacity-50 mb-2">Upload Document</h4>
                                    <label className={`w-full border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-6 flex flex-col items-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer ${verificationUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                        <input type="file" hidden accept="image/*,.pdf" onChange={handleVerificationUpload} />
                                        {verificationUploading ? (
                                            <div className="animate-spin h-6 w-6 border-2 border-yellow-500 rounded-full border-t-transparent"></div>
                                        ) : (
                                            <Upload size={24} className="opacity-50" />
                                        )}
                                        <span className="text-xs font-bold">{verificationUploading ? 'Uploading...' : 'Tap to Upload KRA Certificate'}</span>
                                    </label>
                                </div>
                            )}

                            {user?.verificationDoc && (
                                <div className="mt-4 bg-white/50 dark:bg-black/20 p-4 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                                            <FileText size={14} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold">Document Submitted</p>
                                            <a href={user.verificationDoc} target="_blank" rel="noreferrer" className="text-[10px] text-blue-500 underline">View Document</a>
                                        </div>
                                    </div>
                                </div>
                            )}


                        </div>
                    </>
                ) : (
                    <div className={`p-6 rounded-[2rem] border ${theme.card}`}>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold uppercase opacity-50">Current Status</span>
                            <span className="px-3 py-1 rounded-full bg-green-500 text-black font-bold text-[10px] uppercase">Verified Merchant</span>
                        </div>
                        <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full w-full bg-green-500"></div>
                        </div>
                        <p className="mt-4 text-xs font-bold">You have full access to all seller features.</p>

                        <div className="mt-6 flex items-center gap-4 p-4 rounded-xl bg-green-500/10 text-green-600">
                            <ShieldCheck size={24} />
                            <div>
                                <p className="text-xs font-black uppercase">Tier 2 Protection</p>
                                <p className="text-[10px] opacity-70">Your account is verified and secured.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderSettings = () => (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500 pb-32">
            <div className="px-4 mb-6">
                <h2 className="text-2xl font-black italic tracking-tighter uppercase">App Settings</h2>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${theme.textMuted}`}>Preferences & Privacy</p>
            </div>

            <div className="px-4 space-y-4">
                {/* Notifications */}
                <div
                    onClick={async () => {
                        const newVal = !notificationsEnabled;
                        setNotificationsEnabled(newVal);
                        try {
                            // @ts-ignore
                            await updateUser({ notificationsEnabled: newVal });
                        } catch (e) { console.error(e); }
                    }}
                    className={`p-4 rounded-3xl border flex items-center justify-between cursor-pointer ${theme.card}`}
                >
                    <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${theme.pill}`}>
                            <Bell size={18} />
                        </div>
                        <div>
                            <p className="font-bold text-sm">Push Notifications</p>
                            <p className="text-[10px] opacity-50">Orders & Messages</p>
                        </div>
                    </div>
                    <div className={`w-10 h-6 rounded-full relative transition-colors ${notificationsEnabled ? 'bg-green-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}>
                        <div className={`absolute top-1 h-4 w-4 bg-white rounded-full shadow-sm transition-all ${notificationsEnabled ? 'right-1' : 'left-1'}`}></div>
                    </div>
                </div>

                {/* Theme Mode */}
                <div onClick={() => setIsDarkMode(!isDarkMode)} className={`p-4 rounded-3xl border flex items-center justify-between cursor-pointer ${theme.card}`}>
                    <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${theme.pill}`}>
                            {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
                        </div>
                        <div>
                            <p className="font-bold text-sm">Appearance</p>
                            <p className="text-[10px] opacity-50">{isDarkMode ? 'Dark Mode On' : 'Light Mode On'}</p>
                        </div>
                    </div>
                    <div className={`w-10 h-6 rounded-full relative transition-colors ${isDarkMode ? 'bg-yellow-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}>
                        <div className={`absolute top-1 h-4 w-4 bg-white rounded-full shadow-sm transition-all ${isDarkMode ? 'right-1' : 'left-1'}`}></div>
                    </div>
                </div>
            </div>
        </div>
    );

    const MenuView = () => (
        <div className="px-6 pb-32 lg:pb-12 animate-in fade-in duration-300 max-w-2xl mx-auto">
            <div className="flex flex-col items-center mt-4 mb-8 text-center">
                <div className="h-24 w-24 rounded-[2rem] bg-gradient-to-tr from-yellow-500 to-yellow-200 p-1 mb-4">
                    <div className="h-full w-full bg-black rounded-[1.8rem] overflow-hidden">
                        <img src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'Felix'}`} alt="Profile" />
                    </div>
                </div>
                <h2 className="text-2xl font-black italic">{user?.name || 'Store Owner'}</h2>
                <div className={`flex items-center gap-1 mt-1 px-3 py-1 rounded-full ${theme.pill}`}>
                    <Star className="text-yellow-500 fill-yellow-500" size={12} />
                    <span className="text-[10px] font-black uppercase">4.9 TOP SELLER</span>
                </div>
            </div>

            <div className="space-y-3">
                {/* MENU ITEMS */}
                <button
                    onClick={() => navigateTo('profile')}
                    className={`w-full border p-4 rounded-3xl flex items-center gap-4 text-left active:scale-95 transition-transform ${theme.card}`}
                >
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${theme.pill} text-zinc-400`}><UserIcon /></div>
                    <div className="flex-1">
                        <p className="text-sm font-bold">Merchant Profile</p>
                        <p className={`text-[10px] ${theme.textMuted}`}>Edit bio, contact & social links</p>
                    </div>
                    <ChevronRight className={theme.textMuted} size={18} />
                </button>

                <button
                    onClick={() => navigateTo('settlement')}
                    className={`w-full border p-4 rounded-3xl flex items-center gap-4 text-left active:scale-95 transition-transform ${theme.card}`}
                >
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${theme.pill} text-zinc-400`}><CreditCard /></div>
                    <div className="flex-1">
                        <p className="text-sm font-bold">Settlement Account</p>
                        <p className={`text-[10px] ${theme.textMuted}`}>View active payment method</p>
                    </div>
                    <ChevronRight className={theme.textMuted} size={18} />
                </button>

                <button
                    onClick={() => navigateTo('identity')}
                    className={`w-full border p-4 rounded-3xl flex items-center gap-4 text-left active:scale-95 transition-transform ${theme.card}`}
                >
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${theme.pill} text-zinc-400`}><ShieldCheck /></div>
                    <div className="flex-1">
                        <p className="text-sm font-bold">Identity Verification</p>
                        <p className={`text-[10px] ${theme.textMuted}`}>Level 2: Verified</p>
                    </div>
                    <ChevronRight className={theme.textMuted} size={18} />
                </button>

                <button
                    onClick={() => navigateTo('settings')}
                    className={`w-full border p-4 rounded-3xl flex items-center gap-4 text-left active:scale-95 transition-transform ${theme.card}`}
                >
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${theme.pill} text-zinc-400`}><Settings /></div>
                    <div className="flex-1">
                        <p className="text-sm font-bold">App Settings</p>
                        <p className={`text-[10px] ${theme.textMuted}`}>Notifications & Appearance</p>
                    </div>
                    <ChevronRight className={theme.textMuted} size={18} />
                </button>

                <button
                    onClick={() => {
                        logout();
                        if (onBack) onBack();
                    }}
                    className="w-full mt-4 flex items-center justify-center gap-2 text-red-500 font-bold py-4 bg-red-500/5 rounded-2xl border border-red-500/10 active:scale-95 transition-transform"
                >
                    <LogOut size={18} /> Sign Out
                </button>
            </div>
        </div>
    );

    return (
        <div className={`min-h-screen font-sans selection:bg-yellow-500/30 transition-colors duration-300 flex ${theme.bg} ${isDarkMode ? 'dark' : ''}`}>
            {/* HELPER MODALS */}

            <AddProductModal
                isOpen={showAddProduct}
                onClose={() => { setShowAddProduct(false); setAddProductInitialData(null); }}
                onSubmit={handleAddProduct}
                initialData={addProductInitialData}
                type={activeTab.slice(0, -1).toLowerCase() as any}
                isDarkMode={isDarkMode}
            />
            <SmartScanModal
                isOpen={showSmartScan}
                onClose={() => setShowSmartScan(false)}
                onScanComplete={handleSmartScan}
            />
            <QRLinkModal
                isOpen={showQRLink}
                onClose={() => setShowQRLink(false)}
                // Prioritize shop name for the modal title and QR initials
                shopName={user?.shopName || user?.name || 'My Store'}
                // Use current window host to ensure it points to the deployed environment
                // Format: domain/store/[shop-name-slug]
                shopUrl={`${window.location.host}/store/${slugify(user?.shopName || user?.name || 'store')}`}
                isDarkMode={isDarkMode}
            />

            {/* Verification Prompt Modal */}
            {showVerificationPrompt && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className={`w-full max-w-sm rounded-[2rem] p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-300 ${theme.bg} border-zinc-200 dark:border-zinc-800 border`}>
                        <div className="h-12 w-12 rounded-full bg-yellow-500/10 text-yellow-500 flex items-center justify-center mb-4 mx-auto">
                            <ShieldCheck size={24} />
                        </div>
                        <h3 className="text-xl font-black text-center mb-2 uppercase tracking-tight">Complete Setup</h3>
                        <p className={`text-center text-sm mb-6 ${theme.textMuted}`}>
                            You must complete your business profile setup to start generating smart checkout links.
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => {
                                    setShowVerificationPrompt(false);
                                    navigateTo('profile');
                                }}
                                className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl active:scale-95 transition-all text-sm uppercase tracking-wide"
                            >
                                Get Verified Now
                            </button>
                            <button
                                onClick={() => setShowVerificationPrompt(false)}
                                className={`w-full py-3 font-bold rounded-xl active:scale-95 transition-all text-sm ${theme.btnGhost}`}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Sidebar - Desktop Only */}
            <aside className={`hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r z-50 transition-colors ${theme.sidebar}`}>
                <div className="p-8">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-black tracking-tighter text-yellow-500 italic">SokoSnap</h1>
                        <span className="bg-yellow-500 text-black text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter shadow-sm">Pro</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                        <Zap size={12} className="text-yellow-500 fill-yellow-500" />
                        <p className={`text-[10px] font-black uppercase tracking-widest opacity-50`}>Hustle Active</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {[
                        { id: 'home', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
                        { id: 'links', icon: <Link size={20} />, label: 'Links' },
                        { id: 'orders', icon: <ShoppingBag size={20} />, label: 'Orders' },
                        { id: 'insights', icon: <BarChart3 size={20} />, label: 'Pulse Insights' },
                        { id: 'menu', icon: <Settings size={20} />, label: 'Settings' },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => navigateTo(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group ${activeView === item.id
                                ? 'bg-yellow-500 text-black font-black'
                                : `${isDarkMode ? 'text-zinc-500' : 'text-zinc-600'} hover:bg-yellow-500/10 hover:text-yellow-500`
                                }`}
                        >
                            {item.icon}
                            <span className="text-sm font-bold uppercase tracking-tighter">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-8 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gradient-to-tr from-yellow-500 to-yellow-200 rounded-full p-0.5">
                            <div className="h-full w-full rounded-full bg-black overflow-hidden">
                                <img src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'Felix'}`} alt="profile" />
                            </div>
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs font-black truncate">{user?.name || 'User'}</p>
                            <p className="text-[10px] opacity-50 font-bold uppercase tracking-tighter">Verified</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0 flex flex-col overflow-y-auto">
                {/* Toast Notification */}
                <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[60] transition-all duration-300 ${toastMessage ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
                    <div className="bg-zinc-900 text-white border border-zinc-800 px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-3 whitespace-nowrap">
                        {toastMessage && toastMessage.includes('⚠️') ? <ShieldCheck size={18} className="text-yellow-500" /> : <CheckCircle2 size={18} className="text-green-500" />}
                        {toastMessage?.replace('⚠️', '').trim()}
                    </div>
                </div>

                {/* Mobile Header - Hidden on Desktop Sidebar View */}
                <header className={`p-6 pt-8 flex justify-between items-center sticky top-0 backdrop-blur-md z-40 transition-colors lg:hidden ${theme.headerBg}`}>
                    <div>
                        {['profile', 'settlement', 'identity', 'settings'].includes(activeView) ? (
                            <button onClick={() => navigateTo('menu')} className="flex items-center gap-2 group">
                                <ChevronLeft className="text-yellow-500 group-hover:-translate-x-1 transition-transform" />
                                <span className="font-black uppercase tracking-widest text-xs">Back to Menu</span>
                            </button>
                        ) : activeView === 'home' ? (
                            <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                                <div className="flex items-center gap-2">
                                    <h1 className="text-2xl font-black tracking-tighter text-yellow-500 italic">SokoSnap</h1>
                                    <span className="bg-yellow-500 text-black text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter shadow-sm">SELLER</span>
                                </div>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_#22c55e]"></span>
                                    <p className={`text-[10px] font-black uppercase tracking-widest ${theme.textMuted}`}>Merchant Dashboard</p>
                                </div>
                            </div>
                        ) : (
                            <button onClick={() => navigateTo('home')} className="flex items-center gap-2 group">
                                <ChevronLeft className="text-yellow-500 group-hover:-translate-x-1 transition-transform" />
                                <span className="font-black uppercase tracking-widest text-xs">Back Home</span>
                            </button>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <button className={`h-10 w-10 rounded-full flex items-center justify-center border relative ${theme.pill}`}>
                            <Bell size={20} className={isDarkMode ? 'text-zinc-300' : 'text-gray-600'} />
                            <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-black"></span>
                        </button>
                        {activeView !== 'menu' && (
                            <button onClick={() => navigateTo('menu')} className="h-10 w-10 bg-gradient-to-tr from-yellow-500 to-yellow-200 rounded-full p-0.5 active:scale-90 transition-transform shadow-lg">
                                <div className="h-full w-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                                    <img
                                        src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'Felix'}`}
                                        alt="profile"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'Fallback'}`;
                                        }}
                                    />
                                </div>
                            </button>
                        )}
                    </div>
                </header>

                {/* Desktop Header - Visible on Desktop only */}
                <header className="hidden lg:flex p-12 pb-4 justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-black italic tracking-tighter uppercase">{activeView === 'home' ? 'Merchant Dashboard' : activeView}</h2>
                        <p className={`text-xs font-bold uppercase tracking-widest ${theme.textMuted}`}>Welcome back, {user?.name || 'Seller'}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className={`h-12 w-12 rounded-2xl flex items-center justify-center border relative transition-all ${theme.btnGhost}`}>
                            <Bell size={22} />
                            <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                </header>

                {/* Main View Router */}
                <main className="pt-2 pb-24 lg:pb-12 lg:px-6">
                    {activeView === 'home' && <HomeView />}
                    {activeView === 'links' && renderLinksView()}
                    {activeView === 'insights' && <InsightsView />}
                    {activeView === 'menu' && <MenuView />}
                    {activeView === 'orders' && renderOrdersView()}
                    {activeView === 'profile' && <MerchantProfileView user={user} theme={theme} isDarkMode={isDarkMode} setActiveView={navigateTo} scrollToSettlement={scrollToSettlement} />}
                    {activeView === 'settlement' && renderSettlement()}
                    {activeView === 'identity' && renderVerification()}
                    {activeView === 'settings' && renderSettings()}
                </main>

                {/* Bottom Navigation - Mobile Only */}
                <div className="fixed bottom-6 left-6 right-6 z-50 lg:hidden">
                    <nav className={`backdrop-blur-xl border rounded-[2.5rem] p-2 flex justify-between items-center shadow-2xl px-6 py-3 transition-colors ${theme.navBg}`}>
                        <button
                            onClick={() => navigateTo('home')}
                            className={`flex flex-col items-center gap-1 transition-colors ${activeView === 'home' ? 'text-yellow-500' : isDarkMode ? 'text-zinc-500' : 'text-gray-400'}`}
                        >
                            <div className={`p-2 rounded-2xl ${activeView === 'home' ? 'bg-yellow-500/10' : ''}`}>
                                <Package size={22} strokeWidth={activeView === 'home' ? 3 : 2} />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-tighter">Home</span>
                        </button>

                        <button
                            onClick={() => navigateTo('links')}
                            className={`flex flex-col items-center gap-1 transition-colors ${activeView === 'links' ? 'text-yellow-500' : isDarkMode ? 'text-zinc-500' : 'text-gray-400'}`}
                        >
                            <div className={`p-2 rounded-2xl ${activeView === 'links' ? 'bg-yellow-500/10' : ''}`}>
                                <Link size={22} strokeWidth={activeView === 'links' ? 3 : 2} />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-tighter">Links</span>
                        </button>

                        {/* Central Action Button */}
                        <div className="relative -top-10 group">
                            <button
                                onClick={() => handleAiSnap()}
                                className="h-16 w-16 bg-yellow-500 text-black rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(234,179,8,0.4)] border-4 border-black active:scale-95 transition-all hover:scale-110 relative overflow-hidden group-hover:shadow-[0_0_40px_rgba(234,179,8,0.6)]">
                                <span className="absolute inset-0 bg-white/30 animate-[ping_2s_ease-out_infinite] rounded-full opacity-20"></span>
                                <div className="relative z-10 transition-transform duration-300 group-hover:rotate-12 flex items-center justify-center">
                                    <Camera size={28} strokeWidth={2.5} />
                                    <Sparkles size={16} className="absolute -top-1 -right-2 fill-black animate-pulse" strokeWidth={2} />
                                </div>
                            </button>
                            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-widest bg-black text-white px-2 py-0.5 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                AI Snap
                            </span>
                        </div>

                        <button
                            onClick={() => navigateTo('orders')}
                            className={`flex flex-col items-center gap-1 transition-colors ${activeView === 'orders' ? 'text-yellow-500' : isDarkMode ? 'text-zinc-500' : 'text-gray-400'}`}
                        >
                            <div className={`p-2 rounded-2xl ${activeView === 'orders' ? 'bg-yellow-500/10' : ''}`}>
                                <Ticket size={22} strokeWidth={activeView === 'orders' ? 3 : 2} />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-tighter">Orders</span>
                        </button>

                        <button
                            onClick={() => navigateTo('insights')}
                            className={`flex flex-col items-center gap-1 transition-colors ${activeView === 'insights' ? 'text-yellow-500' : isDarkMode ? 'text-zinc-500' : 'text-gray-400'}`}
                        >
                            <div className={`p-2 rounded-2xl ${activeView === 'insights' ? 'bg-yellow-500/10' : ''}`}>
                                <BarChart3 size={22} strokeWidth={activeView === 'insights' ? 3 : 2} />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-tighter">Insights</span>
                        </button>
                    </nav>
                </div>


                {/* iOS Safe Area Spacer */}
                <div className={`h-8 transition-colors ${theme.headerBg} lg:hidden`}></div>
            </div>
        </div>
    );
};
