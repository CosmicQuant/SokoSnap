import React from 'react';
import { Lock, KeyRound, UserCheck, Zap, MessageSquare, Phone, ArrowRight, X } from 'lucide-react';

interface SuccessViewProps {
    otp: number | null;
    onReturn: () => void;
    onCreatePassword?: () => void;
}

export const SuccessView: React.FC<SuccessViewProps> = ({ otp, onReturn, onCreatePassword }) => {
    // Mock Seller Data
    const sellerInfo = {
        name: "Nanny Banana",
        phone: "+254 712 345 678"
    };

    return (
        <div className="min-h-[100dvh] w-full bg-emerald-600 flex flex-col items-center justify-center p-4 text-center text-white animate-in zoom-in-95 duration-500 overflow-y-auto relative">
            {/* Close button for View Mode - Consistent with dark mode */}

            <div className="absolute top-0 right-0 p-6 z-50">
                <button
                    onClick={onReturn}
                    className="flex items-center gap-2 px-4 py-2 bg-black/20 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-widest hover:bg-black/30 transition-all border border-white/10 shadow-lg"
                >
                    <span>Back to Feed</span>
                    <X size={16} />
                </button>
            </div>

            <div className="flex flex-col items-center w-full max-w-sm my-auto gap-4 py-4 pt-16">
                <div className="flex flex-col items-center shrink-0">
                    <Lock size={24} className="mb-2 opacity-30" />
                    <h1 className="text-2xl font-black italic uppercase tracking-tighter leading-none mb-1 text-white">PAYMENT SECURED</h1>
                    <p className="text-[8px] font-black uppercase tracking-[0.4em] opacity-60 italic text-emerald-100">Held in TumaFast Escrow</p>
                </div>

                {/* OTP Display - Protected */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-3xl w-full shadow-xl shrink-0">
                    <div className="flex items-center justify-center gap-2 mb-1 text-yellow-400 opacity-90">
                        <KeyRound size={14} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Your Release Code</span>
                    </div>
                    <div className="text-5xl font-black text-white tracking-[0.2em] font-mono drop-shadow-md leading-tight">
                        {otp}
                    </div>
                    <p className="text-[8px] font-bold text-emerald-100 mt-2 uppercase tracking-wide">Give this to the rider only after inspection</p>
                </div>

                {/* Tracking Info - Guest Recovery */}
                <div className="w-full bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-3 text-left shrink-0">
                    <div className="flex items-start gap-3">
                        <div className="p-1.5 bg-blue-500/20 rounded-lg shrink-0">
                            <MessageSquare size={14} className="text-blue-300" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-white mb-0.5">Check your SMS</p>
                            <p className="text-[9px] text-white/70 leading-relaxed">
                                We've sent a tracking link to your phone. Verify & track without an account.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white w-full rounded-[2rem] p-4 text-slate-900 shadow-2xl space-y-4 text-left relative overflow-hidden">
                    {/* Rider Info */}
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Kamau" className="w-10 h-10 bg-slate-100 rounded-xl border border-emerald-50" alt="Rider" />
                        <div>
                            <p className="font-black text-sm uppercase italic tracking-tight">Kamau #294</p>
                            <div className="flex items-center gap-1 text-emerald-600 text-[8px] font-black uppercase tracking-widest">
                                <UserCheck size={10} /> Vetted Dispatcher
                            </div>
                        </div>
                    </div>

                    {/* Seller Details */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center text-slate-900 font-black text-lg shrink-0">
                            N
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="font-bold text-[10px] text-slate-900 uppercase truncate">Sold by {sellerInfo.name}</p>
                            <p className="text-[9px] text-slate-500">{sellerInfo.phone}</p>
                        </div>
                        <div className="flex gap-2">
                            <a href={`sms:${sellerInfo.phone.replace(/\s/g, '')}`} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors">
                                <MessageSquare size={14} />
                            </a>
                            <a href={`tel:${sellerInfo.phone.replace(/\s/g, '')}`} className="p-2 bg-emerald-100 hover:bg-emerald-200 rounded-lg text-emerald-700 transition-colors">
                                <Phone size={14} />
                            </a>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-4">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Important</p>
                        <p className="text-[10px] font-bold leading-tight text-slate-700 italic">Rider is on the way. Track their location below.</p>
                    </div>

                    <button className="w-full bg-emerald-600 text-white py-3 rounded-xl font-black text-[9px] uppercase italic tracking-widest shadow-xl flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors">
                        <Zap size={12} fill="currentColor" /> LIVE TRACKING
                    </button>
                </div>

                {/* Guest Upsell */}
                <div className="w-full text-center pb-4 pt-4 space-y-6 shrink-0">
                    <div>
                        <p className="text-[9px] text-white/40 mb-2 font-bold uppercase tracking-wider">Secure your order history</p>
                        <button
                            onClick={onCreatePassword}
                            className="text-white text-[10px] font-bold underline underline-offset-4 decoration-white/30 hover:decoration-white transition-all flex items-center justify-center gap-1 mx-auto"
                        >
                            Create a password to check your order status <ArrowRight size={10} />
                        </button>
                    </div>

                    <button
                        onClick={onReturn}
                        className="px-6 py-3 bg-white/10 rounded-full text-white font-bold text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all border border-white/5"
                    >
                        Return to Shop
                    </button>
                </div>
            </div>
        </div>
    );
};
