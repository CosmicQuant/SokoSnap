import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, getDoc, doc, limit } from 'firebase/firestore';
import type { Product } from '../types';
import lipaNaMpesaLogo from '../assets/41.png';
import { formatCurrency } from '../utils/formatters';
import { useCartStore, useUIStore, usePreferenceStore } from '../store';
import { LocationPickerModal } from './common/LocationPickerModal';
import { SearchOverlay } from './search/SearchOverlay';
import { CommentsOverlay } from './feed/CommentsOverlay'; // We will create this or use existing if correct
import { Share as ShareApi } from '@capacitor/share';
import {
  Heart,
  MessageCircle,
  ShieldCheck,
  Share2,
  Search,
  ShoppingCart,
  Smartphone,
  MapPin,
  Loader2,
  ArrowLeft,
  Trash2,
  Map as MapIcon,
  ChevronDown,
  Navigation,
  BadgeCheck,
  CheckCircle2
} from 'lucide-react';

const COURIERS = [
  { id: 'pickup', name: 'Pickup Station', price: 150, time: 'Next Day' },
  { id: 'standard', name: 'Standard Delivery', price: 250, time: '24-48hrs' },
  { id: 'express', name: 'Express Bike', price: 450, time: '1-3hrs' }
];

interface UserProfile {
  name: string;
  type: 'guest' | 'verified_buyer' | 'verified_merchant';
  avatar?: string;
}

interface CheckoutFeedProps {
  user: UserProfile | null;
  onBuyIntent: () => boolean;
}

// Display Product Interface (Computed UI state)
interface DisplayProduct extends Product {
  slug?: string;
}

/**
 * Action Button Component (Restored from Jan 24)
 */
const ActionBtn: React.FC<{
  icon: React.ReactNode;
  label?: string;
  onClick?: () => void;
  isActive?: boolean;
  ariaLabel?: string;
  count?: number;
}> = ({ icon, label, onClick, isActive = false, ariaLabel, count }) => (
  <div className="feed-action-btn">
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={isActive}
      className={`relative ${isActive ? 'active' : ''}`}
    >
      {icon}
      {count !== undefined && count > 0 && (
        <div key={count} className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-red-600 border-2 border-black rounded-full flex items-center justify-center px-1 animate-pulse-once">
          <span className="text-[10px] font-bold text-white leading-none">{count}</span>
        </div>
      )}
    </button>
    {label && <span>{label}</span>}
  </div>
);



interface FeedItemProps {
  product: DisplayProduct;
  isActive?: boolean;
  phone: string;
  setPhone: (val: string) => void;
  location: string;
  setLocation: (val: string) => void;
  isFormFilled: boolean;
  shouldAnimateAbsorb: boolean;
  setShouldAnimateAbsorb: (val: boolean) => void;
  handleMpesa: () => void;
  setActiveProduct: (p: DisplayProduct) => void;
  user: UserProfile | null;
}

const FeedItem: React.FC<FeedItemProps> = ({
  product,
  phone,
  setPhone,
  location,
  setLocation,
  isFormFilled,
  shouldAnimateAbsorb,
  setShouldAnimateAbsorb,
  handleMpesa,
  setActiveProduct,
  user
}) => {
  const { addItem, isInCart: checkInCart } = useCartStore();
  const { showToast } = useUIStore();
  const isInCart = checkInCart(product.id);

  const [isExpanded, setIsExpanded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  // Default to false (collapsed)
  const [isEditMode, setIsEditMode] = useState(false);

  // Interaction States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  // Like State (optimistic)
  const [likesCount, setLikesCount] = useState(parseInt(product.likes || '0'));
  const [isLiked, setIsLiked] = useState(false); // In real app, check if user ID in caching or subcollection

  const [courier, setCourier] = useState(COURIERS[1]);
  const [isCourierOpen, setIsCourierOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Function to handle like toggle
  const handleToggleLike = async () => {
    if (!user) return; // Guests cannot like

    const newIsLiked = !isLiked;
    const newCount = likesCount + (newIsLiked ? 1 : -1);

    // Optimistic Update
    setIsLiked(newIsLiked);
    setLikesCount(newCount);

    try {
      // Only if we had real user ID
      // const productRef = doc(db, 'products', product.id);
      // await updateDoc(productRef, { likes: increment(newIsLiked ? 1 : -1) });
    } catch (error) {
      // Revert
      setIsLiked(!newIsLiked);
      setLikesCount(likesCount);
    }
  };

  // Delivery Cost based on Courier
  const deliveryCost = location.length > 3 ? (courier?.price || 0) : 0;

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      // Mocking a reverse geocode or just indicating success
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          // In a real app, call Google Maps Geocoding API here
          setLocation(`Lat: ${pos.coords.latitude.toFixed(3)}, Lng: ${pos.coords.longitude.toFixed(3)}`);
          showToast({ title: 'Location updated', type: 'success' });
        },
        (err) => console.error(err)
      );
    }
  };

  const handleAddToCart = (p: Product) => {
    addItem(p);
    showToast({ title: 'Added to cart', type: 'success' });
  };

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} on SokoSnap!`,
      url: window.location.href, // Or construct a deep link
    };

    try {
      await ShareApi.share(shareData);
    } catch (err) {
      // Fallback for web if Capacitor not available or failed
      if (navigator.share) {
        navigator.share(shareData).catch(console.error);
      } else {
        navigator.clipboard.writeText(window.location.href);
        showToast({ title: "Link copied", type: "success" });
      }
    }
  };

  const handleDone = () => {
    setIsEditMode(false);
    if (isFormFilled) {
      setShouldAnimateAbsorb(true);
      setTimeout(() => setShouldAnimateAbsorb(false), 500);
    }
  };

  return (
    <div className="feed-item h-full w-full snap-start relative flex flex-col bg-black shrink-0">
      <Helmet>
        <title>{product.name} | SokoSnap</title>
        <meta name="description" content={product.description} />
      </Helmet>

      {/* Floating Header */}
      {!user ? (
        // GUEST HEADER
        <div className="absolute top-0 inset-x-0 z-30 p-4 pt-[calc(env(safe-area-inset-top)+10px)] flex items-center justify-between pointer-events-none">
          <div className="w-8" /> {/* Spacer since profile icon is removed */}

          <div className="flex items-center gap-2 opacity-90 drop-shadow-md">
            <img src="/logo.svg" alt="SokoSnap" className="h-5 w-auto object-contain" />
            <div className="h-3 w-px bg-white/30 rounded-full" />
            <span className="text-[8px] bg-[#FFC107] text-black font-bold px-1.5 py-0.5 rounded uppercase tracking-widest leading-none">Secure Checkout</span>
          </div>

          <button onClick={handleShare} className="pointer-events-auto flex items-center justify-center bg-black/20 backdrop-blur-md rounded-full text-white w-8 h-8">
            <Share2 size={18} />
          </button>
        </div>
      ) : (
        // LOGGED IN USER HEADER
        <div className="absolute top-0 inset-x-0 z-30 p-4 pt-[calc(env(safe-area-inset-top)+10px)] flex items-center justify-center pointer-events-none">
          <div className="flex gap-4 pointer-events-auto drop-shadow-md">
            <button onClick={() => setActiveProduct(product) /* Just a placeholder */} className="text-white/80 font-bold text-sm opacity-50 bg-transparent border-0">Following</button>
            <button className="text-white font-black text-sm relative bg-transparent border-0 after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-[#FFC107] after:rounded-full">Discover</button>
          </div>
          <button onClick={() => setIsSearchOpen(true)} className="pointer-events-auto absolute right-4 w-8 h-8 flex items-center justify-center bg-black/20 backdrop-blur-md rounded-full text-white">
            <Search size={18} />
          </button>
        </div>
      )}

      <div className="feed-media absolute inset-0 z-0">
        {product.type === 'video' ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
            src={product.mediaUrl}
          />
        ) : (
          <>
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 bg-slate-800 animate-pulse" />
            )}
            <img
              src={product.mediaUrl}
              alt={product.name}
              className={`h-full w-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          </>
        )}
        <div className="feed-gradient absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90" />
      </div>

      <div className="feed-actions absolute right-4 bottom-40 z-30 flex flex-col items-center gap-4 pb-4">
        {user && (
          <>
            <ActionBtn
              icon={<Heart size={28} className={isLiked ? "text-red-500 fill-current drop-shadow-md" : "text-white drop-shadow-md"} />}
              label={likesCount > 0 ? String(likesCount) : 'Like'} // Fallback label if 0
              ariaLabel={`Like, ${likesCount} likes`}
              onClick={handleToggleLike}
            />
            <ActionBtn
              icon={<MessageCircle size={26} className="text-white drop-shadow-md" />}
              label={product.comments !== undefined ? String(product.comments) : '0'}
              ariaLabel={`Comments, ${product.comments}`}
              onClick={() => setIsCommentsOpen(true)}
            />
            <ActionBtn
              icon={<ShoppingCart size={26} className={isInCart ? "text-emerald-400 drop-shadow-md" : "text-white drop-shadow-md"} />}
              label="Cart"
              onClick={() => handleAddToCart(product)}
              isActive={isInCart}
              ariaLabel={isInCart ? "In cart" : "Add to cart"}
            />
            <ActionBtn
              icon={<Share2 size={24} className="text-white drop-shadow-md" />}
              label="Share"
              ariaLabel="Share product"
              onClick={handleShare}
            />
          </>
        )}
      </div>

      <div className="feed-info relative z-20 mt-auto px-1 pb-0 space-y-1 w-full mx-auto">
        {/* REPLACES OLD SELLER TAG - Now INTEGRATED IN CAPTION OR REMOVED FROM HERE since avatar is on right now? 
            Wait, user said "Where we are displaying this the seller's name on the caption... on the left side of this we have the profile image".
            The previous design had the avatar in the caption area.
            The user wants the profile image "on the left side of this" (caption / seller name).
            BUT, standard TikTok UI has the avatar on the RIGHT sidebar.
            I will keep the small avatar in the caption as requested "Just above the title of the product... next to each user name verified... left side of this we have the profile image".
        */}
        <div className="feed-seller-tag flex items-center gap-2 mb-1 animate-in slide-in-from-bottom duration-500 delay-100">
          <div className="w-9 h-9 rounded-full border border-white/50 overflow-hidden p-0.5 bg-black/20 backdrop-blur-sm shadow-sm shrink-0">
            {/* Use photoURL if available (adding type support if needed or trusting 'any') */}
            {/* Note: DisplayProduct doesn't normally have photoURL, we rely on sellerAvatar mapped field */}
            <img
              src={(product as any).sellerAvatar || (product as any).photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${product.sellerName}`}
              alt="avatar"
              className="w-full h-full rounded-full bg-white object-cover"
              onError={(e) => {
                e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${product.sellerName}`;
              }}
            />
          </div>
          <div className="flex flex-col leading-none justify-center">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">{product.sellerName || product.sellerHandle}</span>
              <BadgeCheck size={14} className="text-[#FFD700] fill-current/20 drop-shadow-md" />
            </div>
            <span className="text-[10px] text-white/90 font-medium tracking-wide drop-shadow-md">is selling</span>
          </div>
        </div>

        <div className="space-y-1 drop-shadow-md animate-in slide-in-from-bottom duration-500 delay-200">
          <h2 className="text-lg font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] leading-tight mb-1 line-clamp-2">
            {product.name}
          </h2>
          <div className={`transition-all duration-200 ${isExpanded ? 'max-h-[120px] overflow-y-auto scrollbar-hide' : ''}`}>
            <p className={`text-white/95 text-sm font-medium leading-relaxed drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] ${isExpanded ? '' : 'line-clamp-2'}`}>
              {product.description}
            </p>
          </div>
          {product.description && product.description.length > 80 && (
            <button
              onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
              className="text-white/80 text-xs font-bold mt-0.5 hover:text-white transition-colors cursor-pointer uppercase tracking-wider drop-shadow-md"
            >
              {isExpanded ? 'Show less' : '...more'}
            </button>
          )}
          <div className="mt-1">
            <span className="font-bold text-white text-xs opacity-90 drop-shadow-md">#SokoSnap</span>
          </div>
        </div>
      </div>

      <div className="mt-0.5 animate-in slide-in-from-bottom duration-500 delay-300 relative group/commerce flex flex-col items-stretch gap-0 w-full px-1 drop-shadow-2xl">
        <div className="w-full z-30 mb-0 pb-0 relative">

          {/* CENTERED HINT TEXT with START Button */}
          {!isEditMode && !isFormFilled && (
            <div className="bg-[#FFC107] border border-yellow-500 border-b-0 rounded-t-xl py-0.5 px-2 shadow-lg animate-in slide-in-from-bottom fade-in duration-300 relative z-10 w-full mb-0 pb-1 cursor-pointer" onClick={() => setIsEditMode(true)}>
              <div className="flex items-center justify-center relative w-full h-full">
                <span className="text-[10px] font-black text-black tracking-wide uppercase">
                  Tap to fill delivery info
                </span>
                <div className="absolute right-0 bg-black text-yellow-400 text-[8px] font-black px-2 py-0.5 rounded-full uppercase animate-pulse">
                  Start
                </div>
              </div>
            </div>
          )}

          {!isEditMode && isFormFilled && (
            <div className="bg-[#FFC107] border-yellow-500 rounded-t-xl rounded-b-none py-1 px-3 shadow-lg animate-in slide-in-from-bottom fade-in duration-300 relative z-10 w-full mb-0 border-b-0 pb-1 cursor-pointer" onClick={() => setIsEditMode(true)}>
              <div className="flex items-center justify-center gap-2 text-center w-full relative">
                <span className="text-[10px] font-bold text-black truncate max-w-[80%] flex items-center justify-center gap-1">
                  Pay via <span className="font-extrabold">{phone}</span> <span className="mx-1 font-black text-[10px] text-black">•</span> To <span className="font-extrabold truncate">{location}</span>
                </span>
                <button
                  className="absolute right-0 text-[10px] font-black text-black/70 border-b border-black/70 uppercase hover:text-black whitespace-nowrap"
                >
                  Edit
                </button>
              </div>
            </div>
          )}

          {isEditMode && (
            <div className="bg-black/80 backdrop-blur-xl border border-b-0 border-white/20 rounded-t-xl p-0 pb-0 mb-0 shadow-2xl animate-in slide-in-from-bottom fade-in duration-300 relative z-10 w-full mb-0 !rounded-b-none">
              {/* Header Row */}
              <div className="relative flex items-center justify-center h-6 bg-yellow-400/10 rounded-t-xl overflow-hidden w-full border-b border-white/10">
                <span className="text-[10px] font-black text-white tracking-widest shadow-sm text-center uppercase">
                  SokoSnap secure checkout
                </span>

                {/* Done Button - Absolute Right */}
                <button
                  onClick={handleDone}
                  className="absolute right-0 h-full bg-[#FFC107] text-black px-3 flex items-center justify-center text-[8px] font-bold uppercase hover:bg-yellow-400/90 transition-colors shadow-sm"
                >
                  Done
                </button>
              </div>

              <div className="space-y-0.5 p-0.5">
                <div className="flex gap-0.5">
                  {/* Phone Input */}
                  <div className="flex-[1.4] bg-white/5 border border-white/10 rounded-md flex items-center px-1 focus-within:bg-emerald-500/10 focus-within:border-emerald-500/50 transition-colors group relative overflow-hidden h-7">
                    <div className="w-5 h-full flex items-center justify-center text-emerald-500 group-focus-within:scale-110 transition-transform">
                      <Smartphone size={12} />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleDone()}
                      className="flex-1 bg-transparent font-bold text-[10px] text-white outline-none placeholder:text-white/20 h-full min-w-0"
                      placeholder="M-Pesa No."
                    />
                  </div>

                  {/* Courier Dropdown */}
                  <div className="relative flex-1 group/courier">
                    <button
                      onClick={() => setIsCourierOpen(!isCourierOpen)}
                      className="w-full h-7 bg-white/5 border border-white/10 rounded-md flex items-center justify-between px-1 hover:bg-white/10 transition-colors">
                      <div className="flex flex-col items-start leading-none overflow-hidden flex-1 mr-1">
                        <span className="text-[8px] font-bold text-white w-full text-left truncate">{courier?.name || 'Select'}</span>
                        <span className="text-[6px] text-emerald-400 font-mono">{formatCurrency(courier?.price || 0)}</span>
                      </div>
                      <ChevronDown size={10} className="text-white/50 shrink-0" />
                    </button>

                    {isCourierOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-black/95 border border-white/10 rounded-md overflow-hidden z-50 backdrop-blur-xl shadow-2xl">
                        {COURIERS.map(c => (
                          <button
                            key={c.id}
                            onClick={() => { setCourier(c); setIsCourierOpen(false); }}
                            className={`w-full text-left px-2 py-2 flex flex-col border-b border-white/5 last:border-0 hover:bg-white/10 transition-colors ${courier?.id === c.id ? 'bg-white/10' : ''}`}
                          >
                            <span className="text-[9px] font-bold text-white">{c.name}</span>
                            <div className="flex justify-between items-center w-full mt-0.5">
                              <span className="text-[7px] text-emerald-400 font-mono">{formatCurrency(c.price)}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Location Input with Icons */}
                <div className="bg-white/5 border border-white/10 rounded-md flex items-center px-1 focus-within:bg-white/10 focus-within:border-blue-500/50 transition-colors group h-7 relative">
                  <div className="w-5 h-full flex items-center justify-center text-blue-400 group-focus-within:scale-110 transition-transform">
                    <MapPin size={12} />
                  </div>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleDone()}
                    className="flex-1 bg-transparent font-bold text-[10px] text-white outline-none placeholder:text-white/20 h-full min-w-0 pr-12"
                    placeholder="Delivery Location"
                  />

                  <div className="absolute right-0.5 flex items-center gap-0.5 h-full py-0.5">
                    <button onClick={handleGetCurrentLocation} className="h-full aspect-square flex items-center justify-center bg-white/10 rounded hover:bg-white/20 text-white/70" title="Use Current Location">
                      <Navigation size={10} />
                    </button>
                    <button onClick={() => setIsMapOpen(true)} className="h-full aspect-square flex items-center justify-center bg-blue-500/20 rounded hover:bg-blue-500/30 text-blue-400" title="Pin on Map">
                      <MapIcon size={10} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => {
            if (isEditMode) {
              // If closing edit mode via main button, animate if filled
              setIsEditMode(false);
              if (isFormFilled) handleDone();
            } else if (!isFormFilled) {
              setIsEditMode(true);
            } else {
              setActiveProduct(product);
              handleMpesa();
            }
          }}
          className={`action-btn w-full relative z-20 !bg-white/10 backdrop-blur-xl border border-t-0 border-[#FFC107] rounded-none !rounded-t-none shadow-[0_-4px_20px_rgba(0,0,0,0.2)] outline-none ring-0 active:scale-[0.99] transition-all duration-300 !mt-0 -mt-px !h-auto !min-h-0 !p-0 rounded-b-2xl ${shouldAnimateAbsorb ? 'animate-absorb-highlight' : ''} ${isFormFilled && !isEditMode ? 'animate-pulse shadow-[0_0_20px_rgba(255,193,7,0.4)]' : ''}`}
          aria-label={`Buy Now ${product.name}`}
        >
          <div className="action-primary-row h-10 flex items-center justify-between px-3">
            <div className="flex items-center h-full">
              <img
                src={lipaNaMpesaLogo}
                alt="Lipa na M-Pesa"
                className="action-mpesa-logo h-full object-contain scale-110 origin-left"
              />
            </div>

            <div className="flex flex-col items-center justify-center -space-y-0.5 mx-auto">
              <span className="text-[7px] font-bold text-white/40 tracking-[0.2em] uppercase mb-0.5">Tap To</span>
              <span className="text-base font-black italic text-[#FFC107] tracking-tighter drop-shadow-sm">ORDER NOW</span>
            </div>
            <div className="flex flex-col items-end leading-none">
              <span className="action-price text-sm text-white font-black font-mono drop-shadow-md">{formatCurrency(product.price)}</span>
              <span className="text-[8px] font-bold font-mono text-[#FFC107] mt-0.5 tracking-wide uppercase drop-shadow-sm">+ {deliveryCost > 0 ? formatCurrency(deliveryCost) : 'Delivery'}</span>
            </div>
          </div>
        </button>

        <div className="flex justify-center w-full !mb-0 !pb-0 !mt-0 bg-[#111]">
          <div className="flex items-center gap-1.5 opacity-60 w-full justify-center py-1">
            <ShieldCheck size={8} className="text-[#4CAF50]" />
            <span className="text-[8px] font-bold text-white uppercase tracking-wider">
              Secure Hold by SokoSnap: Funds released after verification.
            </span>
          </div>
        </div>

      </div>

      {/* Modals placed at root of FeedItem to be within context but over media */}
      <LocationPickerModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onSelectLocation={(loc) => {
          setLocation(loc.address || `Lat: ${loc.lat.toFixed(4)}, Lng: ${loc.lng.toFixed(4)}`);
          setIsMapOpen(false);
        }}
      />

      {isSearchOpen && (
        <SearchOverlay
          onClose={() => setIsSearchOpen(false)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          results={[]}
          onResultClick={() => setIsSearchOpen(false)}
        />
      )}

      {isCommentsOpen && (
        <CommentsOverlay productId={product.id} onClose={() => setIsCommentsOpen(false)} />
      )}
    </div>
  );
};


export const CheckoutFeed: React.FC<CheckoutFeedProps> = ({ user }) => {
  const { storeId, productId } = useParams();
  const [view, setView] = useState<'feed' | 'cart' | 'success'>('feed');

  // Logic State
  const [products, setProducts] = useState<DisplayProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cart State
  const [cart, setCart] = useState<DisplayProduct[]>([]);
  const { savedPhone, savedLocation } = usePreferenceStore();
  const [phone, setPhone] = useState(savedPhone || '');
  const [location, setLocation] = useState(savedLocation || '');
  const [, setIsProcessing] = useState(false);

  // Checkout State (Minimal for now)
  const [, setActiveProduct] = useState<DisplayProduct | null>(null);

  const isFormFilled = phone.length >= 10 && location.length >= 3;
  const [shouldAnimateAbsorb, setShouldAnimateAbsorb] = useState(false);

  const handleMpesa = () => {
    if (!isFormFilled) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setActiveProduct(null); // Clear active product
      setView('success');
      setCart([]);
    }, 2500);
  };


  // Fetch Products Effect -> ...

  // Unused handlers removed to clean up code

  useEffect(() => {
    const fetchFeed = async () => {
      setIsLoading(true);
      try {
        let feed: DisplayProduct[] = [];

        // 1. Base Query
        const productsRef = collection(db, 'products');

        // Scenario A: Store Page - Filter by Seller Handle
        if (storeId) {
          // Note: In a real app, you might want to query by 'sellerHandle' field
          // Assuming storeId URL param is like 'nike-shop' and handle is '@nike-shop' or 'nike-shop'
          const q = query(
            productsRef,
            where('status', '==', 'active'),
            limit(20) // Pagination can be added later
          );
          const snapshot = await getDocs(q);
          // Client-side filter for fuzzy handle matching if needed, or precise
          const allActive = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data, // Spread original data
              // Explicitly map image fields to mediaUrl to support legacy/migrated products
              mediaUrl: data.mediaUrl || data.img || '',
              sellerAvatar: data.sellerAvatar || data.sellerImg || '',
            } as DisplayProduct;
          });

          const normalizedStoreId = storeId.toLowerCase().replace(/_/g, '-');

          // Logic Change: Check handle OR sellerName/shopName slug
          feed = allActive.filter(p => {
            const handle = (p.sellerHandle || '').toLowerCase().replace('@', '').replace(/_/g, '-');
            // Also check if the storeID matches the seller's name slug (e.g. "mombasa-dhow" vs "Mombasa Dhow")
            const nameSlug = (p.sellerName || '').toLowerCase().replace(/\s+/g, '-');

            return handle.includes(normalizedStoreId) || nameSlug.includes(normalizedStoreId);
          });
        }
        // Scenario B: Global Feed
        else {
          const q = query(productsRef, where('status', '==', 'active'), limit(20));
          const snapshot = await getDocs(q);
          feed = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              mediaUrl: data.mediaUrl || data.img || '',
              sellerAvatar: data.sellerAvatar || data.sellerImg || '',
            } as DisplayProduct;
          });
        }

        // Scenario C: Deep Linked Product (Ensure it is in the list)
        if (productId) {
          // Check for ID match or Slug match
          const exists = feed.find(p => p.id === productId || p.slug === productId);

          if (!exists) {
            try {
              // 1. Try Fetching by Doc ID (Legacy / Direct ID)
              const docRef = doc(db, 'products', productId);
              const docSnap = await getDoc(docRef);

              if (docSnap.exists()) {
                const data = docSnap.data();
                const directProduct = {
                  id: docSnap.id,
                  ...data,
                  mediaUrl: data.mediaUrl || data.img || '',
                  sellerAvatar: data.sellerAvatar || data.sellerImg || ''
                } as DisplayProduct;
                feed = [directProduct, ...feed];
              } else {
                // 2. Try Fetching by Slug (SEO Friendly URLs)
                const qSlug = query(productsRef, where('slug', '==', productId), limit(1));
                const slugSnap = await getDocs(qSlug);

                if (!slugSnap.empty && slugSnap.docs[0]) {
                  const slugDoc = slugSnap.docs[0];
                  const data = slugDoc.data();
                  const directProduct = {
                    id: slugDoc.id,
                    ...data,
                    mediaUrl: data.mediaUrl || data.img || '',
                    sellerAvatar: data.sellerAvatar || data.sellerImg || ''
                  } as DisplayProduct;
                  feed = [directProduct, ...feed];
                }
              }
            } catch (e) {
              console.error("Failed to fetch deep-linked product", e);
            }
          } else {
            // Move to top
            feed = [exists, ...feed.filter(p => p.id !== exists.id)];
          }
        }

        setProducts(feed);
      } catch (error) {
        console.error("Error loading feed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeed();
  }, [storeId, productId]);


  // CART HANDLERS
  const handleRemoveFromCart = (productId: string) => {
    setCart(cart.filter(p => p.id !== productId));
  };

  // GENERAL UI (FEED)
  if (view === 'feed') {
    if (isLoading) {
      return (
        <div className="h-full w-full bg-black flex items-center justify-center">
          <Loader2 className="animate-spin text-emerald-500" size={32} />
        </div>
      )
    }

    if (products.length === 0) {
      return (
        <div className="h-full w-full bg-black flex flex-col items-center justify-center text-white p-6 text-center">
          <Search className="text-white/20 mb-4" size={48} />
          <h3 className="font-bold text-lg mb-2">No Products Found</h3>
          <p className="text-white/50 text-sm">We couldn't find any products in this store/feed.</p>
        </div>
      )
    }

    return (
      <div className="h-full w-full bg-black relative flex flex-col overflow-hidden select-none">

        {/* Header Removed as per UI update (Moved to FeedItem) */}

        {/* Main Feed */}
        <div className="flex-1 overflow-y-scroll snap-y snap-mandatory no-scrollbar">
          {products.map(p => (
            <div key={p.id} className="h-full w-full snap-start"><FeedItem
              product={p}
              phone={phone}
              setPhone={setPhone}
              location={location}
              setLocation={setLocation}
              isFormFilled={isFormFilled}
              shouldAnimateAbsorb={shouldAnimateAbsorb}
              setShouldAnimateAbsorb={setShouldAnimateAbsorb}
              handleMpesa={handleMpesa}
              setActiveProduct={setActiveProduct}
              user={user}
            /></div>
          ))}
        </div>


      </div>
    );
  }

  // CART VIEW (Separate Drawer for multiple items)
  if (view === 'cart') {
    return (
      <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col text-slate-900 animate-in slide-in-from-right duration-300">
        <header className="px-4 py-4 flex items-center justify-between bg-white border-b border-slate-100 shadow-sm z-20 sticky top-0">
          <button
            onClick={() => setView('feed')}
            className="p-2 -ml-2 text-slate-500 hover:text-slate-900 transition-colors active:scale-95"
          >
            <ArrowLeft size={22} />
          </button>
          <h2 className="font-bold text-base text-slate-900">Your Cart</h2>
          <div className="w-8" />
        </header>

        <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
              <ShoppingCart size={48} className="text-slate-300" />
              <p className="text-sm font-bold text-slate-400">Your cart is empty</p>
              <button onClick={() => setView('feed')} className="text-emerald-600 font-bold text-xs uppercase">Start Shopping</button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex gap-4 animate-in slide-in-from-bottom duration-300">
                <div className="w-20 h-20 shrink-0 bg-slate-100 rounded-xl overflow-hidden relative">
                  {item.type === 'video' ? (
                    <video src={item.mediaUrl} className="w-full h-full object-cover" />
                  ) : (
                    <img src={item.mediaUrl} className="w-full h-full object-cover" alt={item.name} />
                  )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide truncate">{item.sellerHandle}</p>
                    <h3 className="font-bold text-slate-900 leading-tight truncate">{item.name}</h3>
                  </div>
                  <div className="flex items-end justify-between">
                    <p className="font-bold text-emerald-600">{formatCurrency(item.price)}</p>
                    <button
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  if (view === 'success') {
    return (
      <div className="fixed inset-0 z-50 bg-emerald-500 text-white flex flex-col items-center justify-center animate-in zoom-in duration-300">
        <CheckCircle2 size={80} className="mb-4" />
        <h2 className="text-3xl font-black mb-2">Order Placed!</h2>
        <p className="opacity-80 mb-8">Redirecting you back...</p>
        <button onClick={() => setView('feed')} className="bg-white text-emerald-600 px-6 py-3 rounded-xl font-bold">Close</button>
      </div>
    )
  }

  return null;
};
