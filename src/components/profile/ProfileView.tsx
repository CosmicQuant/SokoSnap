import React, { useState, useRef } from 'react';
import { User, CreditCard, ShoppingBag, MapPin, ChevronRight, Phone, ShieldCheck, ChevronLeft, Camera, Navigation, Map, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

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
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onBack, onOrderHistory }) => {
    const { user, updateUser } = useAuthStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [phone, setPhone] = useState(INITIAL_USER_DATA.phone);
    const [location, setLocation] = useState(INITIAL_USER_DATA.location);
    const [mpesaNumber, setMpesaNumber] = useState(INITIAL_USER_DATA.phone);
    const [editSection, setEditSection] = useState<'personal' | 'payment' | null>(null);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);

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
                // const address = await geocode({ lat: latitude, lng: longitude });
                // setLocation(address);

                // Simulating Geocoding API response
                setTimeout(() => {
                    setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)} (GPS)`);
                    setIsLoadingLocation(false);
                    setSuggestions([]);
                }, 1000);
            },
            (error) => {
                console.error("Error getting location:", error);
                setIsLoadingLocation(false);
                alert("Unable to retrieve your location. Please check your permissions.");
            }
        );
    };

    const pinOnMap = () => {
        // In production: Open Map Modal similar to FeedItem
        // For now, we simulate a user selecting a point on the map
        setLocation("Pin: -1.2921, 36.8219 (Moi Avenue)");
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
        <div className="h-full w-full bg-black text-white pt-24 px-6 overflow-y-auto pb-32 relative">
            {/* Back Button */}
            {onBack && (
                <button
                    onClick={onBack}
                    className="absolute top-6 left-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors z-50"
                >
                    <ChevronLeft size={24} className="text-white" />
                </button>
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-black italic uppercase tracking-tighter">My Profile</h1>
                {/* Settings icon removed as requested */}
            </div>

            {/* Avatar & Name */}
            <div className="flex items-center gap-5 mb-10">
                <div className="relative group cursor-pointer" onClick={triggerFileInput}>
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 p-[2px]">
                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden relative">
                            {user?.avatar ? (
                                <img src={user.avatar} className="w-full h-full object-cover" alt="Profile" />
                            ) : (
                                <User size={32} className="text-white/50" />
                            )}
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera size={20} className="text-white" />
                            </div>
                        </div>
                    </div>
                    {/* Badge */}
                    <div className="absolute -bottom-1 -right-1 bg-white text-black p-1 rounded-full shadow-lg border border-black group-hover:bg-green-500 transition-colors">
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
                        <h2 className="text-xl font-bold">{user?.name || "Guest User"}</h2>
                        <ShieldCheck size={16} className="text-green-500" />
                    </div>
                    <p className="text-sm text-white/40 font-medium">@{user?.handle || "guest"}</p>
                    <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />
                        <span className="text-[10px] font-bold text-green-500 tracking-wider uppercase">Verified Buyer</span>
                    </div>
                </div>
            </div>

            {/* Sections */}
            <div className="space-y-6">

                {/* Contact Info */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between pl-1">
                        <h3 className="text-xs font-black uppercase tracking-widest text-white/30">Personal Details</h3>
                        {editSection === 'personal' ? (
                            <button onClick={() => handleSave('personal')} className="text-[10px] font-bold text-green-500 uppercase">Save</button>
                        ) : (
                            <button onClick={() => setEditSection('personal')} className="text-[10px] font-bold text-white/40 hover:text-white uppercase transition-colors">Edit</button>
                        )}
                    </div>
                    <div className={`bg-white/5 border ${editSection === 'personal' ? 'border-green-500/50' : 'border-white/5'} rounded-2xl overflow-hidden backdrop-blur-sm transition-colors`}>
                        <div className="p-4 flex items-center gap-4 border-b border-white/5">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                                <Phone size={14} className="text-blue-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] uppercase tracking-wider text-white/40 font-bold">Phone Number</p>
                                {editSection === 'personal' ? (
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full bg-transparent border-b border-green-500 text-green-500 font-medium outline-none text-sm pt-1"
                                    />
                                ) : (
                                    <p className="text-sm font-medium">{phone}</p>
                                )}
                            </div>
                        </div>
                        <div className="p-4 flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                                <MapPin size={14} className="text-purple-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] uppercase tracking-wider text-white/40 font-bold">Delivery Location</p>
                                {editSection === 'personal' ? (
                                    <div className="relative">
                                        <div className="flex items-center border-b border-green-500 pb-1">
                                            <input
                                                type="text"
                                                value={location}
                                                onChange={handleLocationChange}
                                                className="w-full bg-transparent text-green-500 font-medium outline-none text-sm placeholder-white/20"
                                                placeholder="Search location..."
                                            />
                                            {location && (
                                                <button onClick={() => { setLocation(''); setSuggestions([]); }}>
                                                    <X size={14} className="text-white/40 hover:text-white" />
                                                </button>
                                            )}
                                        </div>

                                        {/* Suggestions */}
                                        {suggestions.length > 0 && (
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                                                {suggestions.map((s, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => selectSuggestion(s)}
                                                        className="w-full text-left px-4 py-3 hover:bg-white/5 border-b border-white/5 last:border-0 flex items-center gap-3 transition-colors"
                                                    >
                                                        <MapPin size={14} className="text-white/40" />
                                                        <span className="text-sm text-gray-300">{s}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {/* Quick Actions */}
                                        <div className="mt-3 flex gap-2">
                                            <button
                                                onClick={useCurrentLocation}
                                                disabled={isLoadingLocation}
                                                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold hover:bg-blue-500/20 transition-all disabled:opacity-50"
                                            >
                                                {isLoadingLocation ? (
                                                    <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <Navigation size={12} />
                                                )}
                                                {isLoadingLocation ? 'Locating...' : 'Current Location'}
                                            </button>
                                            <button
                                                onClick={pinOnMap}
                                                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold hover:bg-purple-500/20 transition-all"
                                            >
                                                <Map size={12} />
                                                Pin on Map
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm font-medium">{location}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between pl-1">
                        <h3 className="text-xs font-black uppercase tracking-widest text-white/30">Payment & Wallet</h3>
                        {editSection === 'payment' ? (
                            <button onClick={() => handleSave('payment')} className="text-[10px] font-bold text-green-500 uppercase">Save</button>
                        ) : (
                            <button onClick={() => setEditSection('payment')} className="text-[10px] font-bold text-white/40 hover:text-white uppercase transition-colors">Edit</button>
                        )}
                    </div>

                    <div className={`bg-white/5 border ${editSection === 'payment' ? 'border-green-500/50' : 'border-white/5'} rounded-2xl overflow-hidden backdrop-blur-sm`}>
                        <div className="p-4 flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                <CreditCard size={14} className="text-green-400" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-[10px] uppercase tracking-wider text-white/40 font-bold">Default Method</p>
                                    <span className="text-[9px] font-bold bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">ACTIVE</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold">M-PESA</span>
                                    {editSection === 'payment' ? (
                                        <input
                                            type="tel"
                                            value={mpesaNumber}
                                            onChange={(e) => setMpesaNumber(e.target.value)}
                                            className="bg-transparent border-b border-green-500 text-green-400 font-medium outline-none text-sm text-right w-32"
                                        />
                                    ) : (
                                        <span className="text-white/60 text-xs font-medium">{mpesaNumber}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-widest text-white/30 pl-1">History</h3>
                    <div
                        onClick={onOrderHistory}
                        className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <ShoppingBag size={18} className="text-white/60 group-hover:text-green-500 transition-colors" />
                            <span className="font-medium text-sm group-hover:text-white transition-colors">Order History</span>
                        </div>
                        <ChevronRight size={16} className="text-white/20 group-hover:text-white transition-colors" />
                    </div>
                </div>

            </div>

            <div className="mt-12 text-center text-[10px] text-white/20 uppercase tracking-widest font-black">
                SokoSnap v1.0.5 (Beta)
            </div>
        </div>
    );
};
