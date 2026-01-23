import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const CheckoutTopNav: React.FC = () => {
    return (
        <div className="absolute top-0 left-0 right-0 z-50 pt-6 pb-4 px-6 flex justify-center items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
            {/* Centered Container - Logo | Divider | Secure Badge */}
            <div className="flex items-center gap-3 pointer-events-auto">
                {/* SokoSnap Logo */}
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
                        <span className="text-black font-black text-xs italic">S</span>
                    </div>
                    <span className="text-white font-black text-[10px] uppercase tracking-tight leading-none">SokoSnap</span>
                </div>

                {/* Divider */}
                <div className="w-[1px] h-4 bg-white/20"></div>

                {/* Secure Order Badge */}
                <div className="flex items-center gap-1.5 bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 px-2.5 py-1 rounded-full">
                    <ShieldCheck size={12} className="text-emerald-400" />
                    <span className="text-emerald-400 text-[8px] font-black uppercase tracking-wider">Secure Order</span>
                </div>
            </div>
        </div>
    );
};
