import React from 'react';
import { Lock, KeyRound, UserCheck, Zap, X, ArrowRight, MessageSquare, Phone } from 'lucide-react';

interface SuccessModalProps {
    isOpen: boolean;
    otp: number | null;
    onClose: () => void;
    onCreatePassword?: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, otp, onClose, onCreatePassword }) => {
    if (!isOpen) return null;

    // Mock Seller Data
    const sellerInfo = {
        name: "Nanny Banana",
        phone: "+254 712 345 678"
    };

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-white/95 backdrop-blur-md animate-in fade-in duration-300 px-4">
            {/* Close button - Fixed to top right of screen for easy access */}
            <button
                onClick={onClose}
                className="absolute top-[env(safe-area-inset-top,24px)] right-6 z-50 p-2 bg-slate-100 backdrop-blur-xl rounded-full text-slate-900 border border-slate-200 hover:bg-slate-200 transition-all shadow-xl active:scale-95"
                aria-label="Close"
            >
                <X size={24} />
            </button>

            <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-3 animate-in slide-in-from-bottom-5 duration-500 max-h-[85dvh] overflow-y-auto no-scrollbar py-2">
                {/* Header */}
                <div className="flex flex-col items-center text-center shrink-0">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-2 shadow-xl shadow-emerald-200">
                        <Lock size={20} className="text-emerald-600" />
                    </div>
                    <h1 className="text-xl font-black italic uppercase tracking-tighter leading-none mb-0.5 text-slate-900">PAYMENT SECURED</h1>
                    <p className="text-[8px] font-black uppercase tracking-[0.3em] text-emerald-600">Held in TumaFast Escrow</p>
                </div>

                {/* OTP Display */}
                <div className="bg-emerald-50 backdrop-blur-md border border-emerald-100 p-3 rounded-xl w-full shadow-lg shrink-0">
                    <div className="flex items-center justify-center gap-2 mb-1 text-yellow-600">
                        <KeyRound size={12} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Your Release Code</span>
                    </div>
                    <div className="text-4xl font-black text-slate-900 tracking-[0.15em] font-mono text-center drop-shadow-sm leading-tight">
                        {otp}
                    </div>
                </div>

                {/* Create Password Button logic for guest users */}
                <button
                    onClick={onCreatePassword}
                    className="w-full py-3 bg-slate-900 text-yellow-400 font-black uppercase text-xs tracking-wider rounded-xl shadow-lg active:scale-95 transition-all hover:bg-slate-800 border border-slate-700"
                >
                    Create Password to View Status
                </button>

                {/* Tracking Info - Guest Recovery */}
                <div className="w-full bg-slate-50 backdrop-blur-md border border-slate-100 rounded-xl p-3 text-left shrink-0">
                    <div className="flex items-start gap-3">
                        <div className="p-1.5 bg-blue-100 rounded-lg shrink-0">
                            <MessageSquare size={14} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-900 mb-0.5">Check your SMS</p>
                            <p className="text-[9px] text-slate-500 leading-relaxed">
                                We've sent a tracking link to your phone. Verify & track without an account.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Seller & Rider Info Card */}
                <div className="bg-white w-full rounded-xl p-3 text-slate-900 shadow-xl border border-slate-100 space-y-3 text-left">
                    {/* Rider */}
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Kamau" className="w-8 h-8 bg-slate-100 rounded-lg border border-slate-200" alt="Rider" />
                        <div>
                            <p className="font-black text-xs uppercase italic tracking-tight text-slate-900">Kamau #294</p>
                            <div className="flex items-center gap-1 text-emerald-600 text-[7px] font-black uppercase tracking-widest">
                                <UserCheck size={8} /> Dispatcher
                            </div>
                        </div>
                        <div className="ml-auto text-right">
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">ETA</p>
                            <p className="text-xs font-black text-slate-900">15m</p>
                        </div>
                    </div>

                    {/* Seller Details */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center text-slate-900 font-black text-sm shrink-0">
                            N
                        </div>
                        <div className="min-w-0">
                            <p className="font-bold text-[10px] text-slate-900 uppercase truncate">Sold by {sellerInfo.name}</p>
                            <p className="text-[9px] text-slate-500">{sellerInfo.phone}</p>
                        </div>
                        <div className="ml-auto flex gap-2">
                            <a href={`sms:${sellerInfo.phone.replace(/\s/g, '')}`} className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-md text-slate-600 transition-colors">
                                <MessageSquare size={14} />
                            </a>
                            <a href={`tel:${sellerInfo.phone.replace(/\s/g, '')}`} className="p-1.5 bg-emerald-100 hover:bg-emerald-200 rounded-md text-emerald-700 transition-colors">
                                <Phone size={14} />
                            </a>
                        </div>
                    </div>

                    <button className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-black text-[9px] uppercase italic tracking-widest shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors">
                        <Zap size={12} fill="currentColor" /> LIVE TRACKING
                    </button>
                </div>

                {/* Guest Upsell */}
                <div className="w-full text-center shrink-0 flex flex-col items-center gap-6 mt-2">
                    <button
                        onClick={onCreatePassword}
                        className="text-white text-[10px] font-bold underline underline-offset-4 decoration-white/30 hover:decoration-white transition-all flex items-center justify-center gap-1 mx-auto"
                    >
                        Create a password to check your order status <ArrowRight size={10} />
                    </button>

                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-white/10 rounded-full text-white font-bold text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all border border-white/5"
                    >
                        Return to Feed
                    </button>
                </div>
            </div>
        </div>
    );
};
