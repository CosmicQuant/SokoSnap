import React from 'react';
import { Lock, KeyRound, Zap, MessageSquare, ArrowRight, X, Phone } from 'lucide-react';

interface SuccessViewProps {
    otp: number | null;
    onReturn: () => void;
    onLogin?: () => void;
    onViewOrders?: () => void;
    isLoggedIn?: boolean;
}

export const SuccessView: React.FC<SuccessViewProps> = ({ otp, onReturn, onLogin, onViewOrders, isLoggedIn }) => {
    // Mock Rider & Seller Data
    const rider = { name: "Kamau #294", phone: "0712345678" };
    const seller = { name: "Nanny B.", phone: "0712345678", location: "Westlands, NRB" };

    return (
        <div className="h-[100dvh] w-full bg-white flex flex-col items-stretch overflow-hidden">
            {/* 1. Top Bar: Back Action (Compact) */}
            <div className="shrink-0 px-4 py-2 flex justify-end z-20">
                <button
                    onClick={onReturn}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-full text-slate-500 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-100 hover:text-slate-900 transition-all border border-slate-100"
                >
                    <span>Close</span>
                    <X size={14} />
                </button>
            </div>

            {/* Main Content Area - Flex Col with Justify Space Between/Evenly */}
            <div className="flex-1 w-full max-w-sm mx-auto px-4 pb-4 flex flex-col min-h-0 justify-evenly">

                {/* 2. Header (Compact) */}
                <div className="shrink-0 flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mb-2 shadow-lg shadow-emerald-200/50">
                        <Lock size={20} className="text-emerald-600" />
                    </div>
                    <h1 className="text-lg font-black italic uppercase tracking-tighter leading-none mb-0.5 text-slate-900">PAYMENT SECURED</h1>
                    <p className="text-[8px] font-black uppercase tracking-[0.3em] opacity-80 text-emerald-600">Held in TumaFast Escrow</p>
                </div>

                {/* 3. OTP Display (Primary Focus) */}
                <div className="shrink-0 bg-emerald-50 border border-emerald-100 p-4 rounded-3xl w-full shadow-lg flex flex-col items-center gap-1">
                    <div className="flex items-center justify-center gap-1.5 text-yellow-600 font-bold opacity-80">
                        <KeyRound size={12} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Release Code</span>
                    </div>
                    <div className="text-5xl font-black text-slate-900 tracking-[0.1em] font-mono leading-none py-1">
                        {otp}
                    </div>
                    <p className="text-[8px] font-bold text-center text-emerald-700 uppercase tracking-wide opacity-60">Give to rider after inspection</p>
                </div>

                {/* 4. Tracking Info (Compact Row) */}
                <div className="shrink-0 w-full bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-3">
                    <div className="p-1.5 bg-blue-100 rounded-lg shrink-0">
                        <MessageSquare size={14} className="text-blue-600" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[10px] font-bold text-slate-900 leading-tight">Check your SMS</p>
                        <p className="text-[9px] text-slate-500 leading-tight truncate">Tracking link sent to verify & track without account.</p>
                    </div>
                </div>

                {/* 5. Main Card (Contacts & Tracking) */}
                <div className="shrink-0 bg-white w-full rounded-2xl p-4 shadow-xl border border-slate-100 flex flex-col gap-3 relative overflow-hidden">

                    {/* Rider Row */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Kamau" className="w-9 h-9 bg-slate-100 rounded-xl border border-slate-200" alt="Rider" />
                            <div>
                                <p className="font-black text-xs uppercase italic tracking-tight text-slate-900">{rider.name}</p>
                                <div className="text-emerald-600 text-[8px] font-black uppercase tracking-widest">Dispatcher</div>
                            </div>
                        </div>
                        <div className="flex gap-1.5">
                            <a href={`sms:${rider.phone}`} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors border border-slate-100">
                                <MessageSquare size={14} />
                            </a>
                            <a href={`tel:${rider.phone}`} className="p-2 bg-emerald-50 hover:bg-emerald-100 rounded-lg text-emerald-600 hover:text-emerald-700 transition-colors border border-emerald-100">
                                <Phone size={14} />
                            </a>
                        </div>
                    </div>

                    {/* Seller Row */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                            <div className="w-9 h-9 bg-yellow-400 rounded-xl flex items-center justify-center text-slate-900 font-black text-xs shadow-sm">N</div>
                            <div>
                                <p className="font-bold text-xs text-slate-900 uppercase italic tracking-tight">{seller.name}</p>
                                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wide">Seller • {seller.location}</p>
                            </div>
                        </div>
                        <div className="flex gap-1.5">
                            <a href={`sms:${seller.phone}`} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors border border-slate-100">
                                <MessageSquare size={14} />
                            </a>
                            <a href={`tel:${seller.phone}`} className="p-2 bg-emerald-50 hover:bg-emerald-100 rounded-lg text-emerald-600 hover:text-emerald-700 transition-colors border border-emerald-100">
                                <Phone size={14} />
                            </a>
                        </div>
                    </div>

                    <button className="w-full bg-slate-900 text-yellow-400 py-2.5 rounded-xl font-black text-[9px] uppercase italic tracking-widest shadow-md flex items-center justify-center gap-2 hover:bg-slate-800 transition-all">
                        <Zap size={12} fill="currentColor" /> LIVE TRACKING
                    </button>
                </div>

                {/* 6. Action Buttons (Bottom) */}
                <div className="shrink-0 w-full pt-1 space-y-2">
                    {/* Show 'Log in to Status' button only if NOT logged in */}
                    {!isLoggedIn ? (
                        <>
                            <button
                                onClick={onLogin}
                                className="w-full py-3 bg-yellow-400 text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md active:scale-95 transition-all hover:bg-yellow-300 border border-yellow-300 flex items-center justify-center gap-2"
                            >
                                <span>Log in to View Status</span>
                                <ArrowRight size={14} />
                            </button>

                            <button
                                onClick={onReturn}
                                className="w-full py-2 bg-transparent text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-slate-900 transition-all mt-2"
                            >
                                Return to Shop
                            </button>
                        </>
                    ) : (
                        <div className="space-y-2">
                            <button
                                onClick={onViewOrders}
                                className="w-full py-3 bg-yellow-400 text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md active:scale-95 transition-all hover:bg-yellow-300 border border-yellow-300 flex items-center justify-center gap-2"
                            >
                                <span>View Order Status</span>
                                <ArrowRight size={14} />
                            </button>

                            <button
                                onClick={onReturn}
                                className="w-full py-3 bg-slate-100 text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm active:scale-95 transition-all hover:bg-slate-200 border border-slate-200 flex items-center justify-center gap-2"
                            >
                                <span>Return to Shop</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
