import React, { useState } from 'react';
import { ChevronLeft, MapPin, BadgeCheck, Phone, Mail, UserCheck, Plus } from 'lucide-react';

interface SellerProfileProps {
    seller: { name: string, handle: string };
    onBack: () => void;
    products: any[];
    onSelectPost?: (product: any) => void;
}

export const SellerProfileView: React.FC<SellerProfileProps> = ({ seller, onBack, products, onSelectPost }) => {
    const [isFollowing, setIsFollowing] = useState(false);

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
        <div className="min-h-[100dvh] w-full bg-black text-white flex flex-col animate-in slide-in-from-right duration-300 relative overflow-y-auto">

            {/* Nav */}
            <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-center z-50">
                <button
                    onClick={onBack}
                    className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-black/60 transition-colors"
                >
                    <ChevronLeft size={24} />
                </button>
            </div>

            {/* Header / Cover */}
            <div className="h-48 w-full bg-gradient-to-br from-yellow-900 to-black relative">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd80026?auto=format&fit=crop&q=80')] opacity-30 bg-cover bg-center" />
                <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black to-transparent" />
            </div>

            <div className="px-6 -mt-12 relative z-10 pb-20">
                {/* Profile Header */}
                <div className="flex items-end gap-4 mb-6">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-yellow-400 to-yellow-600 p-[2px] shadow-2xl">
                        <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center overflow-hidden">
                            <div className="text-3xl font-black text-white/20 uppercase">{seller.name.charAt(0)}</div>
                        </div>
                    </div>
                    <div className="pb-2 flex flex-col items-start">
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-black italic uppercase leading-none">{seller.name}</h1>
                            {sellerInfo.isVerified && <BadgeCheck size={18} className="text-blue-500 fill-blue-500/20" />}
                        </div>
                        <p className="text-sm font-medium text-white/60 mb-3">{seller.handle}</p>

                        <button
                            onClick={() => setIsFollowing(!isFollowing)}
                            className={`
                                h-8 px-6 rounded-full flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all
                                ${isFollowing
                                    ? 'bg-white/10 text-white border border-white/20 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-500 group'
                                    : 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20 active:scale-95'
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
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4 backdrop-blur-md mb-8">
                    <div className="grid grid-cols-2 gap-4 border-b border-white/5 pb-4">
                        <div className="space-y-1">
                            <h3 className="text-[10px] font-black uppercase text-white/40 tracking-widest">Location</h3>
                            <div className="flex items-center gap-1.5">
                                <MapPin size={12} className="text-yellow-500" />
                                <span className="text-xs font-bold text-white/90">{sellerInfo.location}</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-[10px] font-black uppercase text-white/40 tracking-widest">Contact Person</h3>
                            <div className="flex items-center gap-1.5">
                                <UserCheck size={12} className="text-yellow-500" />
                                <span className="text-xs font-bold text-white/90">{sellerInfo.contactPerson}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <a href={`tel:${sellerInfo.phone}`} className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group">
                            <div className="flex items-center gap-3">
                                <Phone size={16} className="text-white/60 group-hover:text-green-400 transition-colors" />
                                <span className="text-xs font-medium">{sellerInfo.phone}</span>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-green-400">Call Now</span>
                        </a>
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                            <div className="flex items-center gap-3">
                                <Mail size={16} className="text-white/60" />
                                <span className="text-xs font-medium">{sellerInfo.email}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <h3 className="text-sm font-black italic uppercase tracking-wider mb-4 border-l-4 border-yellow-500 pl-3">
                    Latest Posts
                </h3>

                {/* Grid */}
                <div className="grid grid-cols-2 gap-3">
                    {/* Just re-rendering products as grid items for now */}
                    {products.map(p => (
                        <div
                            key={p.id}
                            className="aspect-[4/5] bg-white/5 rounded-xl overflow-hidden relative border border-white/10 group cursor-pointer active:scale-95 transition-transform"
                            onClick={() => onSelectPost?.(p)}
                        >
                            <img src={p.media} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt={p.name} />
                            <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                                <p className="text-[10px] font-bold truncate text-white">{p.name}</p>
                                <p className="text-[9px] text-yellow-500 font-black">KES {p.price.toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                    {products.length === 0 && (
                        <div className="col-span-2 py-10 text-center text-white/30 text-xs uppercase tracking-widest">
                            No posts yet
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
