import React, { useState, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, MapPin, Navigation, Search, Loader2 } from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api';

const LIBRARIES: any = ['places'];

interface LocationPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectLocation: (location: { address: string; lat: number; lng: number }) => void;
}

const mapContainerStyle = {
    width: '100%',
    height: '100%'
};

const defaultCenter = {
    lat: -1.2921,
    lng: 36.8219
};

const options = {
    disableDefaultUI: true,
    zoomControl: false,
    streetViewControl: false,
    mapTypeControl: false,
    fullScreenControl: false,
    clickableIcons: false,
    styles: [
        {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
        }
    ]
};

export const LocationPickerModal: React.FC<LocationPickerProps> = ({ isOpen, onClose, onSelectLocation }) => {
    // Determine API Key - Check both Vite env and standard env
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: apiKey,
        libraries: LIBRARIES
    });

    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null);
    const [address, setAddress] = useState('');
    const [isGeocoding, setIsGeocoding] = useState(false);

    // Autocomplete Ref
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    // Initial Location
    useEffect(() => {
        if (isOpen && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setMarkerPosition(pos);
                    if (map) map.panTo(pos);
                    // Do reverse geocoding here if needed
                },
                () => {
                    // console.warn("Geolocation failed");
                }
            );
        }
    }, [isOpen, map]);

    const onLoadMap = useCallback(function callback(map: google.maps.Map) {
        setMap(map);
    }, []);

    // eslint-disable-next-line
    const onUnmountMap = React.useCallback(function callback() {
        setMap(null);
    }, []);

    const onLoadAutocomplete = (autocomplete: google.maps.places.Autocomplete) => {
        autocompleteRef.current = autocomplete;
    };

    const onPlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (place.geometry && place.geometry.location) {
                const pos = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                };
                setMarkerPosition(pos);
                setAddress(place.formatted_address || place.name || '');
                map?.panTo(pos);
                map?.setZoom(17);
            }
        }
    };

    const handleMapClick = async (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            setMarkerPosition({ lat, lng });

            // Reverse Geocode
            setIsGeocoding(true);
            try {
                const geocoder = new google.maps.Geocoder();
                const response = await geocoder.geocode({ location: { lat, lng } });
                if (response.results[0]) {
                    setAddress(response.results[0].formatted_address);
                } else {
                    setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
                }
            } catch (error) {
                setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
            } finally {
                setIsGeocoding(false);
            }
        }
    };

    const handleConfirm = () => {
        if (!markerPosition) return;
        onSelectLocation({
            address: address || `${markerPosition.lat.toFixed(5)}, ${markerPosition.lng.toFixed(5)}`,
            lat: markerPosition.lat,
            lng: markerPosition.lng
        });
        onClose();
    };

    const handleCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                setMarkerPosition(pos);
                map?.panTo(pos);
                map?.setZoom(17);
                // Trigger geocode
                handleMapClick({ latLng: new google.maps.LatLng(pos.lat, pos.lng) } as any);
            });
        }
    };

    if (!isOpen) return null;

    if (!apiKey) {
        return createPortal(
            <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center">
                    <h3 className="text-lg font-bold text-red-600 mb-2">Google Maps API Key Missing</h3>
                    <p className="text-gray-600 text-sm mb-4">Please add <code>VITE_GOOGLE_MAPS_API_KEY</code> to your environment variables to use the map.</p>
                    <button onClick={onClose} className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold">Close</button>
                </div>
            </div>,
            document.body
        );
    }

    if (loadError) {
        return createPortal(
            <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 ">
                <div className="text-white">Error loading maps</div>
            </div>,
            document.body
        );
    }

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center pointer-events-auto isolation-auto">
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
                        <div className="flex-1 bg-white/90 backdrop-blur-md rounded-xl border border-white/20 flex items-center px-3 h-12 shadow-lg relative">
                            <Search className="text-slate-500 mr-2 shrink-0" size={18} />
                            {isLoaded ? (
                                <Autocomplete
                                    onLoad={onLoadAutocomplete}
                                    onPlaceChanged={onPlaceChanged}
                                    className="w-full"
                                >
                                    <input
                                        type="text"
                                        placeholder="Search Google Places..."
                                        className="bg-transparent border-none outline-none text-slate-900 text-sm w-full placeholder:text-slate-400 h-full py-3"
                                    />
                                </Autocomplete>
                            ) : (
                                <div className="text-slate-400 text-sm">Loading Search...</div>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="w-12 h-12 flex items-center justify-center bg-white/90 backdrop-blur-md rounded-xl border border-white/20 text-slate-900 hover:bg-white transition-colors shadow-lg shrink-0"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Map Area */}
                <div className="flex-1 relative bg-slate-100 w-full h-full z-0">
                    {isLoaded ? (
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={defaultCenter}
                            zoom={13}
                            options={options}
                            onLoad={onLoadMap}
                            onUnmount={onUnmountMap}
                            onClick={handleMapClick}
                        >
                            {markerPosition && (
                                <Marker
                                    position={markerPosition}
                                    animation={google.maps.Animation.DROP}
                                />
                            )}
                        </GoogleMap>
                    ) : (
                        <div className="flex items-center justify-center h-full w-full bg-slate-100">
                            <Loader2 className="animate-spin text-slate-400" size={32} />
                        </div>
                    )}

                    {/* Controls Overlay */}
                    <div className="absolute bottom-24 right-4 flex flex-col gap-3 z-[400] pointer-events-auto">
                        <button
                            onClick={handleCurrentLocation}
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
                            <p className="text-slate-900 font-bold line-clamp-1">
                                {isGeocoding ? "Locating..." : (address || "Tap map to select location")}
                            </p>
                            <p className="text-slate-500 text-xs">Lat/Long Coordinates</p>
                        </div>
                    </div>

                    <button
                        onClick={handleConfirm}
                        disabled={!markerPosition || isGeocoding}
                        className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isGeocoding ? "Loading..." : "Confirm Location"}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};
