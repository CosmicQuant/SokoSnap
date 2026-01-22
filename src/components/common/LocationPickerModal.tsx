import React, { useState, useEffect } from 'react';
import { X, MapPin, Navigation, Search } from 'lucide-react';

interface LocationPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectLocation: (location: { address: string; lat: number; lng: number }) => void;
}

export const LocationPickerModal: React.FC<LocationPickerProps> = ({ isOpen, onClose, onSelectLocation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Mock loading Google Maps
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => setIsLoading(false), 1500);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center pointer-events-auto">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-lg h-[85vh] sm:h-[600px] bg-[#1a1a1a] sm:rounded-2xl rounded-t-3xl overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">

                {/* Header / Search Bar */}
                <div className="absolute top-0 inset-x-0 z-10 p-4 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                    <div className="flex gap-2 pointer-events-auto">
                        <div className="flex-1 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 flex items-center px-3 h-12 shadow-lg">
                            <Search className="text-white/50 mr-2" size={18} />
                            <input
                                type="text"
                                placeholder="Search Google Places..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent border-none outline-none text-white text-sm w-full placeholder:text-white/30"
                            />
                        </div>
                        <button
                            onClick={onClose}
                            className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white hover:bg-white/20 transition-colors shadow-lg"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Map Area (Placeholder for Google Maps) */}
                <div className="flex-1 relative bg-[#242f3e] w-full h-full">
                    {/* Google Map Implementation would go here */}
                    {isLoading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                            <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                            <span className="text-white/50 text-xs font-medium uppercase tracking-widest">Loading Maps...</span>
                        </div>
                    ) : (
                        <div className="w-full h-full relative" style={{
                            backgroundImage: 'url("https://maps.googleapis.com/maps/api/staticmap?center=-1.2921,36.8219&zoom=13&size=600x600&maptype=roadmap&style=feature:all|element:geometry|color:0x242f3e&style=feature:all|element:labels.text.stroke|visibility:off&style=feature:all|element:labels.text.fill|color:0x746855&key=YOUR_API_KEY")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}>
                            {/* Center Pin Target */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform -mt-4 drop-shadow-2xl">
                                <MapPin size={48} className="text-yellow-400 fill-yellow-400/20 animate-bounce" />
                                <div className="w-4 h-1 bg-black/50 blur-sm rounded-full mx-auto mt-1" />
                            </div>
                        </div>
                    )}

                    {/* Controls Overlay */}
                    <div className="absolute bottom-24 right-4 flex flex-col gap-3">
                        <button className="w-12 h-12 bg-white text-slate-900 rounded-full shadow-xl flex items-center justify-center hover:bg-slate-100 transition-transform active:scale-95">
                            <Navigation size={20} fill="currentColor" className="text-blue-500" />
                        </button>
                    </div>
                </div>

                {/* Bottom Sheet Actions */}
                <div className="bg-[#1a1a1a] p-6 border-t border-white/5 space-y-4">
                    <div className="flex items-start gap-3">
                        <MapPin className="text-yellow-400 mt-1 shrink-0" size={20} />
                        <div>
                            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Inferred Location</p>
                            <p className="text-white font-medium">Bishan Plaza, Mpaka Road</p>
                            <p className="text-white/60 text-xs">Westlands, Nairobi</p>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            onSelectLocation({
                                address: "Bishan Plaza, Mpaka Road, Westlands",
                                lat: -1.2650,
                                lng: 36.8052
                            });
                            onClose();
                        }}
                        className="w-full bg-yellow-400 text-black py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-yellow-300 transition-colors"
                    >
                        Confirm Location
                    </button>
                    <div className="h-[env(safe-area-inset-bottom)] w-full" />
                </div>
            </div>
        </div>
    );
};
