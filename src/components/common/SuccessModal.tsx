import React from 'react';
import { Lock, KeyRound, X, MessageSquare, Zap, ArrowRight, Phone } from 'lucide-react';

interface SuccessModalProps {
    isOpen: boolean;
    otp: number | null;
    onClose: () => void;
    onLogin?: () => void;
    onViewOrders?: () => void;
    isLoggedIn?: boolean;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, otp, onClose, onLogin, onViewOrders, isLoggedIn }) => {
    if (!isOpen) return null;

    // Mock Models
    const rider = { name: "Kamau #294", phone: "0712345678" };
    const seller = { name: "Nanny Banana", phone: "0712345678" };

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-white/95 backdrop-blur-md animate-in fade-in duration-300 px-4">
            {/* Close button - Top Right */}
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
                <div className="bg-emerald-50 backdrop-blur-md border border-emerald-100 p-3 rounded-xl w-full shadow-lg shrink-0 flex flex-col items-center">
                    <div className="flex items-center justify-center gap-2 mb-1 text-yellow-600">
                        <KeyRound size={12} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Release Code</span>
                    </div>
                    <div className="text-5xl font-black text-slate-900 tracking-[0.1em] font-mono text-center drop-shadow-sm leading-tight py-1">
                        {otp}
                    </div>
                    <p className="text-[8px] font-bold text-center text-emerald-700 uppercase tracking-wide opacity-60">Give to rider after inspection</p>
                </div>

                {/* Tracking Info */}
                <div className="w-full bg-slate-50 backdrop-blur-md border border-slate-100 rounded-xl p-3 text-left shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-blue-100 rounded-lg shrink-0">
                            <MessageSquare size={14} className="text-blue-600" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-bold text-slate-900 leading-tight">Check your SMS</p>
                            <p className="text-[9px] text-slate-500 leading-tight truncate">Tracking link sent to verify & track without account.</p>
                        </div>
                    </div>
                </div>

                {/* Seller & Rider Info Card */}
                <div className="bg-white w-full rounded-xl p-3 text-slate-900 shadow-xl border border-slate-100 space-y-3 text-left">
                    {/* Rider - Separate Row */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Kamau" className="w-8 h-8 bg-slate-100 rounded-lg border border-slate-200" alt="Rider" />
                            <div>
                                <p className="font-black text-xs uppercase italic tracking-tight text-slate-900">{rider.name}</p>
                                <div className="text-emerald-600 text-[7px] font-black uppercase tracking-widest">Dispatcher</div>
                            </div>
                        </div>
                        {/* Rider Actions */}
                        <div className="flex gap-1.5 ml-auto">
                            <a href={`sms:${rider.phone}`} className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded-md text-slate-500 hover:text-slate-900 transition-colors border border-slate-100">
                                <MessageSquare size={14} />
                            </a>
                            <a href={`tel:${rider.phone}`} className="p-1.5 bg-emerald-50 hover:bg-emerald-100 rounded-md text-emerald-600 hover:text-emerald-700 transition-colors border border-emerald-100">
                                <Phone size={14} />
                            </a>
                        </div>
                    </div>

                    {/* Seller - Separate Row */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center text-slate-900 font-black text-xs">N</div>
                            <div className="min-w-0 max-w-[80px]">
                                <p className="font-bold text-[9px] text-slate-900 uppercase truncate">Nanny B.</p>
                                <p className="text-[8px] text-slate-500 truncate">Seller</p>
                            </div>
                        </div>
                        {/* Seller Actions */}
                        <div className="flex gap-1.5 ml-auto">
                            <a href={`sms:${seller.phone}`} className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded-md text-slate-500 hover:text-slate-900 transition-colors border border-slate-100">
                                <MessageSquare size={14} />
                            </a>
                            <a href={`tel:${seller.phone}`} className="p-1.5 bg-emerald-50 hover:bg-emerald-100 rounded-md text-emerald-600 hover:text-emerald-700 transition-colors border border-emerald-100">
                                <Phone size={14} />
                            </a>
                        </div>
                    </div>

                    <button className="w-full bg-slate-900 text-yellow-400 py-2.5 rounded-xl font-black text-[9px] uppercase italic tracking-widest shadow-lg flex items-center justify-center gap-2 hover:bg-slate-800 transition-all">
                        <Zap size={12} fill="currentColor" /> LIVE TRACKING
                    </button>
                </div>

                {/* Action Buttons */}
                <div className="w-full space-y-2 mt-2">
                    {/* Logged Out: Show 'Log in to view status' prompt */}
                    {!isLoggedIn ? (
                        <button
                            onClick={onLogin}
                            className="w-full py-3 bg-yellow-400 text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md active:scale-95 transition-all hover:bg-yellow-300 border border-yellow-300 flex items-center justify-center gap-2"
                        >
                            <span>Log in to View Status</span>
                            <ArrowRight size={14} />
                        </button>
                    ) : (
                        /* Logged In: Show View Status or Return */
                        <div className="space-y-2">
                            <button
                                onClick={onViewOrders}
                                className="w-full py-3 bg-yellow-400 text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md active:scale-95 transition-all hover:bg-yellow-300 border border-yellow-300 flex items-center justify-center gap-2"
                            >
                                <span>View Order Status</span>
                                <ArrowRight size={14} />
                            </button>

                            <button
                                onClick={onClose}
                                className="w-full py-3 bg-slate-100 text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm active:scale-95 transition-all hover:bg-slate-200 border border-slate-200 flex items-center justify-center gap-2"
                            >
                                <span>Return to Shop</span>
                            </button>
                        </div>
                    )}

                    {!isLoggedIn && (
                        <button
                            onClick={onClose}
                            className="w-full py-2 bg-transparent text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-slate-900 transition-all"
                        >
                            Return to Shop
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
