import React from 'react';
import { ChevronLeft, ShoppingBag, Trash2, Loader2, Lock } from 'lucide-react';

interface CartViewProps {
    cart: any[];
    onBack: () => void;
    onRemove: (id: number) => void;
    onCheckout: () => void;
    isProcessing: boolean;
}

export const CartView: React.FC<CartViewProps> = ({
    cart,
    onBack,
    onRemove,
    onCheckout,
    isProcessing
}) => {
    const total = cart.reduce((acc, item) => acc + item.price, 0);

    return (
        <div className="h-screen bg-black text-white flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} aria-label="Go Back"><ChevronLeft /></button>
                    <h1 className="text-xl font-black italic uppercase">My Bag</h1>
                </div>
                <span className="text-xs font-bold bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full">{cart.length} items</span>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-white/30 gap-4">
                        <ShoppingBag size={48} />
                        <p className="text-sm font-medium uppercase tracking-widest">Your bag is empty</p>
                    </div>
                ) : (
                    cart.map((item, idx) => (
                        <div key={`${item.id}-${idx}`} className="flex gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                            <div className="w-20 h-20 bg-slate-800 rounded-xl overflow-hidden shrink-0">
                                {item.type === 'image' && <img src={item.media} className="w-full h-full object-cover" alt={item.name} />}
                                {item.type === 'video' && <video src={item.media} className="w-full h-full object-cover" />}
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-bold text-sm leading-tight mb-1">{item.name}</h3>
                                    <p className="text-[10px] text-white/50">{item.seller}</p>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-yellow-500 font-black italic">KES {item.price.toLocaleString()}</span>
                                    <button onClick={() => onRemove(item.id)} className="text-red-400 p-2" aria-label="Remove item"><Trash2 size={14} /></button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {cart.length > 0 && (
                <div className="p-6 bg-white/5 border-t border-white/10 space-y-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-white/60">Total</span>
                        <span className="font-black text-xl">KES {total.toLocaleString()}</span>
                    </div>
                    <button
                        onClick={onCheckout}
                        disabled={isProcessing}
                        className="w-full bg-yellow-500 text-black py-4 rounded-xl font-black uppercase tracking-widest hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isProcessing ? <Loader2 className="animate-spin" /> : <Lock size={16} />}
                        Secure Checkout
                    </button>
                </div>
            )}
        </div>
    );
};
