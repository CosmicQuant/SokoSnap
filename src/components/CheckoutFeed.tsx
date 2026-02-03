import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Heart,
  MessageCircle,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  Share2,
  Lock,
  User,
  Search,
  MapPin,
  Smartphone,
  ShoppingCart,
  Trash2,
  ChevronDown,
  UserCheck,
  ArrowRight,
  Banknote,
  PenLine
} from 'lucide-react';

const MOCK_PRODUCTS = [
  {
    id: 1,
    type: 'video',
    seller: 'Eastleigh Kicks',
    handle: '@eastleigh_kicks',
    name: 'Air Jordan 1 "Uni Blue"',
    price: 4500,
    media: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-showing-sneakers-34537-large.mp4',
    description: "Premium quality. Best sellers in Nairobi. Verified stock.",
    likes: '12.4k'
  },
  {
    id: 2,
    type: 'image',
    seller: 'Luxe Tech',
    handle: '@luxetech_ke',
    name: 'Neon Edition Controller',
    price: 8500,
    media: 'https://images.unsplash.com/photo-1605833559746-611c651a038c?auto=format&fit=crop&q=80&w=1080',
    description: "Limited stock. Official warranty. Same-day delivery.",
    likes: '5.2k'
  },
  {
    id: 3,
    type: 'image',
    seller: 'Sneaker Head',
    handle: '@sneakerhead_254',
    name: 'Yeezy Boost "Solar"',
    price: 12500,
    media: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=1080',
    description: "Authentic import. Vetted for TumaFast Trust.",
    likes: '18.9k'
  },
  {
    id: 4,
    type: 'image',
    seller: 'Urban Fit',
    handle: '@urbanfit_ke',
    name: 'Sunshine Puffer Jacket',
    price: 3500,
    media: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=1080',
    description: "Stand out this winter. Thermal insulated & water resistant.",
    likes: '8.4k'
  },
  {
    id: 5,
    type: 'video',
    seller: 'Skate Nairobi',
    handle: '@skate_nbo',
    name: 'Pro Deck "Neon City"',
    price: 6000,
    media: 'https://assets.mixkit.co/videos/preview/mixkit-skateboarder-doing-a-trick-in-slow-motion-42502-large.mp4',
    description: "Professional grade maple. Custom grip tape included.",
    likes: '3.1k'
  },
  {
    id: 6,
    type: 'image',
    seller: 'Glamour Heels',
    handle: '@glamour_ke',
    name: 'Royal Blue Stilettos',
    price: 4200,
    media: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=1080',
    description: "Italian velvet finish. Comfortable all-day wear.",
    likes: '15.2k'
  },
  {
    id: 7,
    type: 'image',
    seller: 'Afro Luxury',
    handle: '@afrolux_254',
    name: 'Gold Plated Rolex',
    price: 15000,
    media: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=1080',
    description: "Swiss movement. 2-year warranty included.",
    likes: '22k'
  }
];

interface UserProfile {
  name: string;
  type: 'guest' | 'verified_buyer' | 'verified_merchant';
  avatar?: string;
}

interface CheckoutFeedProps {
  user: UserProfile | null;
  onBuyIntent: () => boolean;
  onProfileClick: () => void;
}

export const CheckoutFeed: React.FC<CheckoutFeedProps> = ({ user, onBuyIntent, onProfileClick }) => {
  const [activeTab, setActiveTab] = useState('foryou');
  const [view, setView] = useState<'feed' | 'cart' | 'success'>('feed');

  // Checkout State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<typeof MOCK_PRODUCTS[0] | null>(null);

  // Cart State
  const [cart, setCart] = useState<typeof MOCK_PRODUCTS>([]);

  // User Details State (Pre-populated)
  const [phone, setPhone] = useState('0712 345 678');
  const [location, setLocation] = useState('Westlands, Nairobi');
  const [isProcessing, setIsProcessing] = useState(false);

  // CART HANDLERS
  const handleAddToCart = (product: typeof MOCK_PRODUCTS[0]) => {
    if (!cart.find(p => p.id === product.id)) {
      setCart([...cart, product]);
    }
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart(cart.filter(p => p.id !== productId));
  };

  // Opens the "On-Reel" Checkout Drawer
  const openInstantCheckout = (product: typeof MOCK_PRODUCTS[0]) => {
    if (onBuyIntent()) {
      setActiveProduct(product);
      setIsCheckoutOpen(true);
    }
  };

  const handleMpesa = () => {
    if (!phone || !location) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsCheckoutOpen(false);
      setView('success');
      setCart([]); // Clear cart if it was a cart checkout
    }, 2500);
  };

  const ActionBtn = ({ icon, label, onClick, isActive = false }: { icon: React.ReactNode, label?: string, onClick?: () => void, isActive?: boolean }) => (
    <div className="flex flex-col items-center gap-1.5 animate-in slide-in-from-right duration-500">
      <button
        onClick={onClick}
        className={`flex items-center justify-center p-3.5 rounded-full active:scale-90 transition-all duration-300 shadow-sm border backdrop-blur-xl ${isActive ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-black/20 text-white border-white/20 hover:bg-black/40'}`}
      >
        {icon}
      </button>
      {label && <span className="text-[10px] font-bold text-white drop-shadow-md tracking-wide">{label}</span>}
    </div>
  );

  const FeedItem: React.FC<{ product: typeof MOCK_PRODUCTS[0] }> = ({ product }) => {
    const isInCart = cart.some(p => p.id === product.id);

    return (
      <div className="h-full w-full snap-start relative flex flex-col bg-black shrink-0">
        <Helmet>
          <title>{product.name} | SokoSnap</title>
          <meta name="description" content={product.description} />
          <meta property="og:title" content={product.name} />
          <meta property="og:description" content={product.description} />
          <meta property="og:image" content={product.media} />
          <meta property="og:type" content="product" />
          <meta property="og:price:amount" content={product.price.toString()} />
          <meta property="og:price:currency" content="KES" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image" content={product.media} />
          <meta name="twitter:title" content={product.name} />
          <meta name="twitter:description" content={product.description} />
        </Helmet>
        {/* Media Layer */}
        <div className="absolute inset-0 z-0">
          {product.type === 'video' ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover"
              src={product.media}
            />
          ) : (
            <img src={product.media} className="h-full w-full object-cover" alt={product.name} />
          )}
          {/* Cinema Gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90" />
        </div>

        {/* Right Action Sidebar */}
        <div className="absolute right-4 bottom-28 z-30 flex flex-col items-center gap-6 pb-4">
          <div className="relative">
            <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden p-0.5 bg-black">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${product.seller}`} alt="avatar" className="w-full h-full rounded-full bg-white" />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-emerald-500 rounded-full p-0.5">
              <CheckCircle2 size={10} className="text-white" />
            </div>
          </div>

          <ActionBtn icon={<Heart size={28} className="text-white fill-white/10" />} label={product.likes} />
          <ActionBtn icon={<MessageCircle size={26} />} label="420" />
          <ActionBtn
            icon={isInCart ? <CheckCircle2 size={26} /> : <ShoppingCart size={26} />}
            label={isInCart ? "Added" : "Cart"}
            onClick={() => handleAddToCart(product)}
            isActive={isInCart}
          />
          <ActionBtn icon={<Share2 size={24} />} label="Share" />
        </div>

        {/* Bottom Information Overlay */}
        <div className="relative z-20 mt-auto px-4 pb-6 space-y-4 max-w-[85%]">

          {/* Seller Tag */}
          <div className="flex items-center gap-2 mb-2 animate-in slide-in-from-bottom duration-500 delay-100">
            <span className="text-sm font-bold text-white shadow-black drop-shadow-md">{product.handle}</span>
            <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-white border border-white/10">Verified Merchant</span>
          </div>

          {/* Description */}
          <div className="space-y-2 drop-shadow-md animate-in slide-in-from-bottom duration-500 delay-200">
            <div className="max-w-[90%]">
              <p className="text-white/90 text-sm font-medium leading-relaxed line-clamp-2">{product.description} <span className="font-bold text-white">#SokoSnap</span></p>
            </div>
            <h2 className="text-lg font-bold text-white leading-tight mt-1 flex items-center gap-2">
              {product.name}
            </h2>
          </div>

          {/* Commerce Trigger Bar */}
          <div className="pt-2 animate-in slide-in-from-bottom duration-500 delay-300">
            <div className="flex items-stretch gap-2 h-14">
              <div className="flex-1 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl px-4 flex flex-col justify-center">
                <span className="text-[10px] text-white/60 font-bold uppercase tracking-wider">Price</span>
                <span className="text-lg font-bold text-white">KES {product.price.toLocaleString()}</span>
              </div>

              <button
                onClick={() => openInstantCheckout(product)}
                className="flex-[2] bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl flex items-center justify-between px-4 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                <span className="font-bold text-sm">Buy Now</span>
                <div className="flex items-center gap-2 bg-black/10 px-2 py-1 rounded-lg">
                  <ShieldCheck size={14} />
                  <span className="text-[10px] font-bold uppercase">Escrow</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // CHECKOUT BOTTOM SHEET (Restored Immersive Design)
  const CheckoutSheet = () => {
    if (!isCheckoutOpen || !activeProduct) return null;

    // Local State for the Sheet
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'cod'>('mpesa');

    // Derived values
    const deliveryFee = 150;
    const total = activeProduct.price + deliveryFee;

    return (
      <div className="absolute inset-0 z-[60] flex flex-col justify-end">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-300"
          onClick={() => setIsCheckoutOpen(false)}
        />

        {/* Glass Sheet Container */}
        <div className={`relative w-full bg-slate-900/90 backdrop-blur-xl border-t border-white/10 text-white transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] shadow-[0_-10px_40px_rgba(0,0,0,0.5)] ${isDetailsOpen ? 'rounded-t-[2rem] pt-0' : 'rounded-t-3xl pt-0'}`}>

          {/* The "Edit Tab" Pull Handle */}
          <div
            onClick={() => setIsDetailsOpen(!isDetailsOpen)}
            className="w-full h-8 flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors rounded-t-[inherit] group"
          >
            <div className="flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
              <span className="text-[9px] font-black uppercase tracking-widest">
                {isDetailsOpen ? 'Close Options' : 'Edit Delivery & Pay'}
              </span>
              <ChevronDown size={12} className={`transition-transform duration-500 ${isDetailsOpen ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {/* EXPANDABLE DETAILS SECTION */}
          <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isDetailsOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="px-6 pb-6 space-y-5">

              {/* 1. Payment Method Toggle */}
              <div className="bg-black/20 p-1.5 rounded-2xl flex relative">
                <div className={`absolute inset-y-1.5 bg-[#4CAF50] rounded-xl shadow-lg transition-all duration-300 w-[calc(50%-6px)] ${paymentMethod === 'cod' ? 'left-[calc(50%+3px)]' : 'left-1.5'}`} />
                <button
                  onClick={() => setPaymentMethod('mpesa')}
                  className="flex-1 relative z-10 flex items-center justify-center gap-2 py-3 text-sm font-bold uppercase tracking-wide transition-colors"
                >
                  <Smartphone size={16} /> M-Pesa
                </button>
                <button
                  onClick={() => setPaymentMethod('cod')}
                  className="flex-1 relative z-10 flex items-center justify-center gap-2 py-3 text-sm font-bold uppercase tracking-wide transition-colors"
                >
                  <Banknote size={16} /> Cash
                </button>
              </div>

              {/* 2. Inputs Group */}
              <div className="space-y-3">
                {/* Phone Input */}
                <div className="group bg-white/5 hover:bg-white/10 focus-within:bg-white/10 transition-colors p-3 rounded-2xl border border-white/5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#4CAF50] shadow-inner">
                    <Smartphone size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-[9px] font-black text-white/40 uppercase tracking-widest mb-0.5">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-transparent border-none p-0 text-white font-bold text-base focus:ring-0 placeholder:text-white/20"
                    />
                  </div>
                  <PenLine size={14} className="text-white/30" />
                </div>

                {/* Location Input */}
                <div className="group bg-white/5 hover:bg-white/10 focus-within:bg-white/10 transition-colors p-3 rounded-2xl border border-white/5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-yellow-500 shadow-inner">
                    <MapPin size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-[9px] font-black text-white/40 uppercase tracking-widest mb-0.5">Delivery Location</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-transparent border-none p-0 text-white font-bold text-base focus:ring-0 placeholder:text-white/20"
                    />
                  </div>
                  <PenLine size={14} className="text-white/30" />
                </div>
              </div>

              {/* 3. Order Summary */}
              <div className="flex justify-between items-center px-2 pt-2 border-t border-white/10 opacity-70">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-medium text-white/70">Delivery Fee</span>
                </div>
                <span className="font-bold text-white">KES {deliveryFee}</span>
              </div>
            </div>
          </div>

          {/* MAIN "ORDER NOW" BAR (Always Visible) */}
          <div className="px-6 pb-8 pt-2 bg-gradient-to-t from-slate-900 to-transparent">
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Total to Pay</span>
                <span className="text-2xl font-black text-white tracking-tight">KES {total.toLocaleString()}</span>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-1.5 text-[#4CAF50] mb-0.5">
                  <ShieldCheck size={14} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Escrow Protected</span>
                </div>
                <p className="text-[9px] text-white/40 font-medium">Funds held until delivery</p>
              </div>
            </div>

            <button
              onClick={handleMpesa}
              disabled={isProcessing}
              className="w-full group relative overflow-hidden bg-white text-black rounded-2xl p-1 pr-1.5 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              {/* Animated Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]" />

              <div className="relative flex items-center justify-between">
                <div className="bg-black text-white rounded-xl px-4 py-3.5 flex items-center gap-2 relative overflow-hidden min-w-[140px] justify-center">
                  {/* Button Inner Animation */}
                  <div className="absolute inset-0 bg-[#4CAF50] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="relative z-10 font-black text-sm uppercase tracking-widest flex items-center gap-2">
                    {isProcessing ? <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : 'Tap To Order'}
                  </span>
                </div>

                <div className="flex items-center gap-2 px-4 opacity-50 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                    {isDetailsOpen ? 'Confirm' : 'Checkout'}
                  </span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>

            {/* Trust Badge Below Button */}
            <div className="mt-4 flex justify-center opacity-40">
              <p className="text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Lock size={10} /> 256-Bit Secure Payment
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const followingFeed = MOCK_PRODUCTS.filter(p => [2, 4, 6].includes(p.id));
  const forYouFeed = MOCK_PRODUCTS;

  if (view === 'feed') {
    return (
      <div className="h-full w-full bg-black relative flex flex-col overflow-hidden select-none">

        {/* Transparent Header */}
        <div className="absolute top-0 left-0 right-0 z-40 px-4 pt-10 pb-4 flex justify-between items-start bg-gradient-to-b from-black/80 via-black/20 to-transparent pointer-events-none">
          <button
            onClick={onProfileClick}
            className={`pointer-events-auto text-white/90 hover:text-white transition-colors backdrop-blur-md bg-white/5 rounded-full overflow-hidden flex items-center justify-center ${user?.avatar ? 'w-10 h-10' : 'p-2'}`}
          >
            {user?.avatar ? (
              <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={24} />
            )}
          </button>

          <div className="pointer-events-auto flex gap-6 pt-2">
            <button
              onClick={() => setActiveTab('shop')}
              className={`text-[13px] font-bold tracking-wide transition-all drop-shadow-md ${activeTab === 'shop' ? 'text-white border-b-2 border-white pb-1' : 'text-white/60 hover:text-white/80'}`}
            >
              Following
            </button>
            <button
              onClick={() => setActiveTab('foryou')}
              className={`text-[13px] font-bold tracking-wide transition-all drop-shadow-md ${activeTab === 'foryou' ? 'text-white border-b-2 border-white pb-1' : 'text-white/60 hover:text-white/80'}`}
            >
              For You
            </button>
          </div>

          <div className="pointer-events-auto flex gap-3 items-center">
            <button
              onClick={() => setView('cart')}
              className="p-2 text-white/90 hover:text-white transition-colors relative backdrop-blur-md bg-white/5 rounded-full"
            >
              <ShoppingCart size={22} />
              {cart.length > 0 && (
                <div className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-black shadow-sm">
                  {cart.length}
                </div>
              )}
            </button>
            <button className="p-2 text-white/90 hover:text-white transition-colors backdrop-blur-md bg-white/5 rounded-full">
              <Search size={22} />
            </button>
          </div>
        </div>

        {/* Main Feed */}
        <div className="flex-1 overflow-y-scroll snap-y snap-mandatory no-scrollbar">
          {activeTab === 'shop' ? (
            followingFeed.map(p => (
              <div key={p.id} className="h-full w-full snap-start"><FeedItem product={p} /></div>
            ))
          ) : (
            forYouFeed.map(p => (
              <div key={p.id} className="h-full w-full snap-start"><FeedItem product={p} /></div>
            ))
          )}
        </div>

        {/* Instant Checkout Overlay */}
        <CheckoutSheet />
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
                    <video src={item.media} className="w-full h-full object-cover" />
                  ) : (
                    <img src={item.media} className="w-full h-full object-cover" alt={item.name} />
                  )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide truncate">{item.seller}</p>
                    <h3 className="font-bold text-slate-900 leading-tight truncate">{item.name}</h3>
                  </div>
                  <div className="flex items-end justify-between">
                    <p className="font-bold text-emerald-600">KES {item.price.toLocaleString()}</p>
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

  // SUCCESS VIEW
  if (view === 'success') {
    return (
      <div className="fixed inset-0 z-[70] bg-emerald-600 flex flex-col items-center justify-center p-8 text-center text-white animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center mb-6">
          <Lock size={32} className="text-white" />
        </div>

        <h1 className="text-3xl font-bold mb-2">Funds Secured</h1>
        <p className="text-emerald-100 text-sm font-medium mb-12 max-w-[200px] leading-relaxed">Your payment is safely held in Escrow ID #TRX-8829</p>

        <div className="bg-white w-full rounded-[2.5rem] p-8 text-slate-900 shadow-2xl space-y-6 text-left relative overflow-hidden">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Kamau" className="w-14 h-14 bg-slate-100 rounded-2xl border border-slate-100" alt="rider" />
            <div>
              <p className="font-bold text-lg text-slate-900">Kamau M.</p>
              <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-bold uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-full w-fit mt-1">
                <UserCheck size={12} /> Verified Agent
              </div>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Next Steps</p>
            <p className="text-sm font-medium text-slate-600 leading-relaxed">
              Kamau is on the way. Inspect your item upon arrival. Share the OTP below only if you are satisfied.
            </p>
          </div>

          <div className="bg-slate-100 rounded-xl p-4 text-center">
            <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Your Release OTP</p>
            <p className="text-3xl font-mono font-bold text-slate-900 tracking-[0.5em]">4829</p>
          </div>

          <button className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg flex items-center justify-center gap-2">
            Track Order Live
          </button>
        </div>

        <button onClick={() => setView('feed')} className="mt-8 text-white/70 font-bold text-xs uppercase tracking-widest hover:text-white transition-colors">Return to Marketplace</button>
      </div>
    );
  }

  return null;
};