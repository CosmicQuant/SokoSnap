import React, { useState, useEffect } from 'react';
import { X, MapPin, Navigation, Search } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Leaflet + React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LocationPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectLocation: (location: { address: string; lat: number; lng: number }) => void;
}

const LocationMarker = ({ position, setPosition }: { position: [number, number], setPosition: (pos: [number, number]) => void }) => {
    useMapEvents({
        click(e) {
            setPosition([e.latlng.lat, e.latlng.lng]);
        },
    });

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
};

export const LocationPickerModal: React.FC<LocationPickerProps> = ({ isOpen, onClose, onSelectLocation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
    const [initialPosition, setInitialPosition] = useState<[number, number]>([-1.2921, 36.8219]); // Nairobi Default

    useEffect(() => {
        if (isOpen && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos: [number, number] = [position.coords.latitude, position.coords.longitude];
                    setInitialPosition(pos);
                    setMarkerPosition(pos);
                },
                () => {
                    // Fallback or error handling
                }
            );
        }
    }, [isOpen]);

    const handleConfirm = async () => {
        if (!markerPosition) return;

        setIsLoading(true);
        // Reverse Geocoding (Mock implementation if no API key)
        // In pending real implementation, call Google Maps Geocoding API here

        // Simulating API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        onSelectLocation({
            address: `${markerPosition[0].toFixed(4)}, ${markerPosition[1].toFixed(4)}`, // Ideally "Street Name, City"
            lat: markerPosition[0],
            lng: markerPosition[1]
        });
        setIsLoading(false);
        onClose();
    };

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
                <div className="absolute top-0 inset-x-0 z-[401] p-4 pointer-events-none">
                    <div className="flex gap-2 pointer-events-auto">
                        <div className="flex-1 bg-white/90 backdrop-blur-md rounded-xl border border-white/20 flex items-center px-3 h-12 shadow-lg">
                            <Search className="text-slate-500 mr-2" size={18} />
                            <input
                                type="text"
                                placeholder="Search Google Places..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent border-none outline-none text-slate-900 text-sm w-full placeholder:text-slate-400"
                            />
                        </div>
                        <button
                            onClick={onClose}
                            className="w-12 h-12 flex items-center justify-center bg-white/90 backdrop-blur-md rounded-xl border border-white/20 text-slate-900 hover:bg-white transition-colors shadow-lg"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Map Area */}
                <div className="flex-1 relative bg-slate-100 w-full h-full z-0">
                    <MapContainer
                        center={initialPosition}
                        zoom={13}
                        style={{ height: '100%', width: '100%' }}
                        className="z-0"
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {markerPosition && <LocationMarker position={markerPosition} setPosition={setMarkerPosition} />}
                    </MapContainer>

                    {/* Controls Overlay */}
                    <div className="absolute bottom-24 right-4 flex flex-col gap-3 z-[400]">
                        <button
                            onClick={() => {
                                if (navigator.geolocation) {
                                    navigator.geolocation.getCurrentPosition((pos) => {
                                        setMarkerPosition([pos.coords.latitude, pos.coords.longitude]);
                                        // You might need to flyTo here if using a map ref
                                    });
                                }
                            }}
                            className="w-12 h-12 bg-white text-slate-900 rounded-full shadow-xl flex items-center justify-center hover:bg-slate-100 transition-transform active:scale-95"
                        >
                            <Navigation size={20} fill="currentColor" className="text-blue-500" />
                        </button>
                    </div>
                </div>

                {/* Bottom Sheet Actions */}
                <div className="bg-white p-6 border-t border-slate-100 space-y-4 z-[402]">
                    <div className="flex items-start gap-3">
                        <MapPin className="text-red-500 mt-1 shrink-0" size={20} />
                        <div>
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Selected Location</p>
                            <p className="text-slate-900 font-bold">
                                {markerPosition
                                    ? `${markerPosition[0].toFixed(4)}, ${markerPosition[1].toFixed(4)}`
                                    : "Tap map to select location"
                                }
                            </p>
                            <p className="text-slate-500 text-xs">Lat/Long Coordinates</p>
                        </div>
                    </div>

                    <button
                        onClick={handleConfirm}
                        disabled={!markerPosition || isLoading}
                        className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isLoading ? "Confirming..." : "Confirm Location"}
                    </button>
                </div>
            </div>
        </div>
    );
};
