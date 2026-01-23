import React, { useState, useRef } from 'react';
import { User, CreditCard, ShoppingBag, MapPin, ChevronRight, Phone, ShieldCheck, ChevronLeft, Camera, Navigation, Map, X, Store } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { SellerLinksSection } from '../seller/SellerLinksSection';
import { BecomeSellerModal } from '../features/BecomeSellerModal';
import { LocationPickerModal } from '../common/LocationPickerModal';

// Production-ready initial state
const INITIAL_USER_DATA = {
    phone: "+254 712 345 678",
    email: "user@example.com",
    mpesaName: "J*** D**",
    location: "Westlands, Nairobi"
};

interface ProfileViewProps {
    onBack?: () => void;
    onOrderHistory: () => void;
    onCreatePost?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onBack, onOrderHistory, onCreatePost }) => {
    const { user, updateUser } = useAuthStore();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isSeller = user?.type === 'verified_merchant';

    const [phone, setPhone] = useState(INITIAL_USER_DATA.phone);
    const [location, setLocation] = useState(INITIAL_USER_DATA.location);
    const [mpesaNumber, setMpesaNumber] = useState(INITIAL_USER_DATA.phone);
    const [editSection, setEditSection] = useState<'personal' | 'payment' | null>(null);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
    const [showMap, setShowMap] = useState(false);

    const handleSave = (_section: 'personal' | 'payment') => {
        setEditSection(null);
        setSuggestions([]);
        // Sync with backend would happen here
    };

    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setLocation(val);
        // Production: This would trigger Google Places Autocomplete API call
        // For now we just show valid-looking Kenyan suggestions if user types > 2 chars
        if (val.length > 2) {
            // Mocking API response latency
            // In production: const predictions = await placesService.getPlacePredictions(...)
            setSuggestions([
                `${val}, Nairobi, Kenya`,
                `${val} Towers, Westlands`,
                `${val} Road, Kilimani`,
                `${val} Avenue, CBD`
            ]);
        } else {
            setSuggestions([]);
        }
    };

    const selectSuggestion = (s: string) => {
        setLocation(s);
        setSuggestions([]);
    };

    const useCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        setIsLoadingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                // In production: Call Google Geocoding API here
                // For now, we simply use the coordinates as "Real" location
                setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
                setIsLoadingLocation(false);
                setSuggestions([]);
            },
            (error) => {
                console.error("Error getting location:", error);
                setIsLoadingLocation(false);
                alert("Unable to retrieve your location. Please check your permissions.");
            }
        );
    };

    const pinOnMap = () => {
        setShowMap(true);
        setSuggestions([]);
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            updateUser({ avatar: imageUrl });
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="h-full w-full bg-slate-50 text-slate-900 pt-24 px-6 overflow-y-auto pb-32 relative">
            {/* Back Button */}
            {onBack && (
                <button
                    onClick={onBack}
                    className="absolute top-6 left-6 p-2 rounded-full bg-white/50 hover:bg-white transition-colors z-50 border border-slate-200 shadow-sm"
                >
                    <ChevronLeft size={24} className="text-slate-900" />
                </button>
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">My Profile</h1>
                {/* Settings icon removed as requested */}
            </div>

            {/* Avatar & Name */}
            <div className="flex items-center gap-5 mb-10">
                <div className="relative group cursor-pointer" onClick={triggerFileInput}>
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 p-[2px]">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden relative border-4 border-white">
                            {user?.avatar ? (
                                <img src={user.avatar} className="w-full h-full object-cover" alt="Profile" />
                            ) : (
                                <User size={32} className="text-slate-300" />
                            )}
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera size={20} className="text-white" />
                            </div>
                        </div>
                    </div>
                    {/* Badge */}
                    <div className="absolute -bottom-1 -right-1 bg-white text-black p-1 rounded-full shadow-lg border border-slate-100 group-hover:bg-yellow-400 transition-colors">
                        <Camera size={12} />
                    </div>
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                />
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-slate-900">{user?.name || "Guest User"}</h2>
                        <ShieldCheck size={16} className={`text-${isSeller ? 'emerald' : 'yellow'}-500`} />
                    </div>
                    <p className="text-sm text-slate-500 font-medium">@{user?.handle || "guest"}</p>
                    <div className={`mt-2 inline-flex items-center px-2 py-0.5 rounded ${isSeller ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'} border`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isSeller ? 'bg-emerald-500' : 'bg-yellow-500'} mr-1.5 animate-pulse`} />
                        <span className="text-[10px] font-bold tracking-wider uppercase">
                            {isSeller ? 'Verified Seller' : 'Verified Buyer'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Sections */}
            <div className="space-y-6">

                {/* Contact Info */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between pl-1">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Personal Details</h3>
                        {editSection === 'personal' ? (
                            <button onClick={() => handleSave('personal')} className="text-[10px] font-bold text-emerald-600 uppercase">Save</button>
                        ) : (
                            <button onClick={() => setEditSection('personal')} className="text-[10px] font-bold text-slate-400 hover:text-slate-900 uppercase transition-colors">Edit</button>
                        )}
                    </div>
                    <div className={`bg-white border ${editSection === 'personal' ? 'border-emerald-500' : 'border-slate-200'} rounded-2xl overflow-hidden shadow-sm transition-colors`}>
                        <div className="p-4 flex items-center gap-4 border-b border-slate-100">
                            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                                <Phone size={14} className="text-emerald-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Phone Number</p>
                                {editSection === 'personal' ? (
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full bg-transparent border-b border-emerald-500 text-slate-900 font-medium outline-none text-sm pt-1"
                                    />
                                ) : (
                                    <p className="text-sm font-medium text-slate-900">{phone}</p>
                                )}
                            </div>
                        </div>
                        <div className="p-4 flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                                <MapPin size={14} className="text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Delivery Location</p>
                                {editSection === 'personal' ? (
                                    <div className="relative">
                                        <div className="flex items-center border-b border-emerald-500 pb-1">
                                            <input
                                                type="text"
                                                value={location}
                                                onChange={handleLocationChange}
                                                className="w-full bg-transparent text-slate-900 font-medium outline-none text-sm placeholder-slate-300"
                                                placeholder="Search location..."
                                            />
                                            {location && (
                                                <button onClick={() => { setLocation(''); setSuggestions([]); }}>
                                                    <X size={14} className="text-slate-400 hover:text-slate-600" />
                                                </button>
                                            )}
                                        </div>

                                        {/* Suggestions */}
                                        {suggestions.length > 0 && (
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                                                {suggestions.map((s, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => selectSuggestion(s)}
                                                        className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-0 flex items-center gap-3 transition-colors"
                                                    >
                                                        <MapPin size={14} className="text-slate-400" />
                                                        <span className="text-sm text-slate-700">{s}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {/* Quick Actions */}
                                        <div className="mt-3 flex gap-2">
                                            <button
                                                onClick={useCurrentLocation}
                                                disabled={isLoadingLocation}
                                                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 text-xs font-bold hover:bg-blue-100 transition-all disabled:opacity-50"
                                            >
                                                {isLoadingLocation ? (
                                                    <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <Navigation size={12} />
                                                )}
                                                {isLoadingLocation ? 'Locating...' : 'Current Location'}
                                            </button>
                                            <button
                                                onClick={pinOnMap}
                                                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-bold hover:bg-emerald-100 transition-all"
                                            >
                                                <Map size={12} />
                                                Pin on Map
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm font-medium text-slate-900">{location}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between pl-1">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Payment & Wallet</h3>
                        {editSection === 'payment' ? (
                            <button onClick={() => handleSave('payment')} className="text-[10px] font-bold text-emerald-600 uppercase">Save</button>
                        ) : (
                            <button onClick={() => setEditSection('payment')} className="text-[10px] font-bold text-slate-400 hover:text-slate-900 uppercase transition-colors">Edit</button>
                        )}
                    </div>

                    <div className={`bg-white border ${editSection === 'payment' ? 'border-emerald-500' : 'border-slate-200'} rounded-2xl overflow-hidden shadow-sm`}>
                        <div className="p-4 flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                                <CreditCard size={14} className="text-emerald-600" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Default Method</p>
                                    <span className="text-[9px] font-bold bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded border border-emerald-100">ACTIVE</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-slate-900">M-PESA</span>
                                    {editSection === 'payment' ? (
                                        <input
                                            type="tel"
                                            value={mpesaNumber}
                                            onChange={(e) => setMpesaNumber(e.target.value)}
                                            className="bg-transparent border-b border-emerald-500 text-slate-900 font-medium outline-none text-sm text-right w-32"
                                        />
                                    ) : (
                                        <span className="text-slate-500 text-xs font-medium">{mpesaNumber}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 pl-1">History</h3>
                    <div
                        onClick={onOrderHistory}
                        className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors group shadow-sm"
                    >
                        <div className="flex items-center gap-3">
                            <ShoppingBag size={18} className="text-slate-400 group-hover:text-emerald-600 transition-colors" />
                            <span className="font-medium text-sm text-slate-700 group-hover:text-slate-900 transition-colors">Order History</span>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-600 transition-colors" />
                    </div>
                </div>

                {/* Seller Links Section - Only visible for sellers */}
                {isSeller ? (
                    <SellerLinksSection onCreateNew={onCreatePost} />
                ) : (
                    <div className="space-y-3">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 pl-1">Business</h3>
                        <div
                            onClick={() => setIsSellerModalOpen(true)}
                            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 flex items-center justify-between cursor-pointer hover:shadow-lg transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full -mr-10 -mt-10 blur-2xl" />

                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-10 h-10 rounded-full bg-yellow-400/20 flex items-center justify-center border border-yellow-400/30">
                                    <Store size={20} className="text-yellow-400" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-sm">Become a Seller</h4>
                                    <p className="text-[10px] text-slate-400 mt-0.5">Setup your shop & start selling today</p>
                                </div>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                <ChevronRight size={16} className="text-white" />
                            </div>
                        </div>
                    </div>
                )}

            </div>

            <div className="mt-12 text-center text-[10px] text-slate-300 uppercase tracking-widest font-black">
                SokoSnap v2.0 (Luminous)
            </div>

            <BecomeSellerModal
                isOpen={isSellerModalOpen}
                onClose={() => setIsSellerModalOpen(false)}
            />

            <LocationPickerModal
                isOpen={showMap}
                onClose={() => setShowMap(false)}
                onSelectLocation={(loc) => {
                    setLocation(loc.address);
                    setShowMap(false);
                }}
            />
        </div>
    );
};
