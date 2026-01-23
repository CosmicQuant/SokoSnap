import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, MapPin, BadgeCheck, Phone, UserCheck, Plus, MessageSquare } from 'lucide-react';

interface SellerProfileProps {
    seller: { name: string, handle: string };
    onBack: () => void;
    products: any[];
    onSelectPost?: (product: any) => void;
}

export const SellerProfileView: React.FC<SellerProfileProps> = ({ seller, onBack, products, onSelectPost }) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Scroll to top on mount
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = 0;
        }
    }, []);

    // Mock Data for the purpose of the demo
    const sellerInfo = {
        location: "Moi Avenue, Nairobi CBD",
        phone: "+254 712 345 678",
        email: "contact@nannybanana.ke",
        contactPerson: "Sarah K.",
        isVerified: true,
        stats: {
            rating: "4.8",
            sales: "1.2k+"
        }
    };

    return (
        <div
            ref={containerRef}
            className="h-[100dvh] w-full bg-slate-50 text-slate-900 animate-in slide-in-from-right duration-300 relative overflow-y-auto no-scrollbar"
        >

            {/* Nav */}
            <div className="sticky top-0 inset-x-0 p-6 flex justify-between items-center z-50 pointer-events-none">
                <button
                    onClick={onBack}
                    className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center hover:bg-white transition-colors pointer-events-auto border border-slate-200 shadow-sm text-slate-700"
                >
                    <ChevronLeft size={24} />
                </button>
            </div>

            {/* Header / Cover */}
            <div className="absolute top-0 inset-x-0 h-64 w-full bg-gradient-to-br from-yellow-50 to-emerald-50 z-0">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd80026?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center" />
                <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-slate-50 to-transparent" />
            </div>

            <div className="px-6 pt-40 relative z-10 pb-20">
                {/* Profile Header */}
                <div className="flex items-end gap-4 mb-6">
                    <div className="w-24 h-24 rounded-2xl bg-white p-[2px] shadow-xl shadow-slate-200/50">
                        <div className="w-full h-full rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-100">
                            <div className="text-3xl font-black text-slate-300 uppercase">{seller.name.charAt(0)}</div>
                        </div>
                    </div>
                    <div className="pb-2 flex flex-col items-start">
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-black italic uppercase leading-none text-slate-900">{seller.name}</h1>
                            {sellerInfo.isVerified && <BadgeCheck size={18} className="text-emerald-500 fill-emerald-500/10" />}
                        </div>
                        <p className="text-sm font-medium text-slate-500 mb-3">{seller.handle}</p>

                        <button
                            onClick={() => setIsFollowing(!isFollowing)}
                            className={`
                                h-8 px-6 rounded-full flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all
                                ${isFollowing
                                    ? 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-red-50 hover:border-red-200 hover:text-red-500 group'
                                    : 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 active:scale-95 hover:bg-emerald-700'
                                }
                            `}
                        >
                            {isFollowing ? (
                                <>
                                    <UserCheck size={14} className="group-hover:hidden" />
                                    <span className="group-hover:hidden">Following</span>
                                    <span className="hidden group-hover:inline">Unfollow</span>
                                </>
                            ) : (
                                <>
                                    <Plus size={14} />
                                    Follow
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Seller Stats / Contact Box */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm mb-8">
                    <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
                        <div className="space-y-1">
                            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Location</h3>
                            <div className="flex items-center gap-1.5">
                                <MapPin size={12} className="text-yellow-500" />
                                <span className="text-xs font-bold text-slate-700">{sellerInfo.location}</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Contact Person</h3>
                            <div className="flex items-center gap-1.5">
                                <UserCheck size={12} className="text-yellow-500" />
                                <span className="text-xs font-bold text-slate-700">{sellerInfo.contactPerson}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <a href={`sms:${sellerInfo.phone}`} className="flex flex-col items-center justify-center gap-2 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 hover:bg-emerald-100 transition-colors group active:scale-95">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-white group-hover:shadow-md transition-all">
                                <MessageSquare size={18} fill="currentColor" className="opacity-20" />
                                <MessageSquare size={18} className="absolute" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-emerald-700">Message</span>
                        </a>

                        <a href={`tel:${sellerInfo.phone}`} className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-colors group active:scale-95">
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 group-hover:bg-white group-hover:shadow-md transition-all">
                                <Phone size={18} fill="currentColor" className="opacity-20" />
                                <Phone size={18} className="absolute" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-slate-700">Call Now</span>
                        </a>
                    </div>
                </div>

                <h3 className="text-sm font-black italic uppercase tracking-wider mb-4 border-l-4 border-emerald-500 pl-3 text-slate-900">
                    Store Content
                </h3>

                {/* Grid */}
                <div className="grid grid-cols-2 gap-3">
                    {/* Just re-rendering products as grid items for now */}
                    {products.map(p => (
                        <div
                            key={p.id}
                            className="aspect-[4/5] bg-slate-100 rounded-xl overflow-hidden relative border border-slate-200 group cursor-pointer active:scale-95 transition-transform shadow-sm"
                            onClick={() => onSelectPost?.(p)}
                        >
                            {p.type === 'video' ? (
                                <video
                                    src={p.mediaUrl}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <img
                                    src={p.mediaUrl}
                                    className="w-full h-full object-cover"
                                    alt={p.name}
                                    loading="lazy"
                                />
                            )}
                            <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent">
                                <p className="text-[11px] font-bold truncate text-white drop-shadow-md">{p.name}</p>
                                <p className="text-[10px] text-yellow-400 font-black drop-shadow-md">KES {p.price.toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                    {products.length === 0 && (
                        <div className="col-span-2 py-10 text-center text-slate-400 text-xs uppercase tracking-widest bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            No active posts
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
