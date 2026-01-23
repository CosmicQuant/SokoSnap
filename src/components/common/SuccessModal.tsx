import React from 'react';
import { Lock, KeyRound, UserCheck, Zap, X } from 'lucide-react';

interface SuccessModalProps {
    isOpen: boolean;
    otp: number | null;
    onClose: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, otp, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 bg-white/10 backdrop-blur-md rounded-full text-white/60 hover:text-white hover:bg-white/20 transition-colors z-10"
                aria-label="Close"
            >
                <X size={20} />
            </button>

            <div className="w-full max-w-sm mx-6 flex flex-col items-center space-y-5 animate-in zoom-in-95 duration-500">
                {/* Header */}
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mb-4 shadow-xl shadow-blue-600/30">
                        <Lock size={32} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-black italic uppercase tracking-tighter leading-none mb-1 text-white">PAYMENT SECURED</h1>
                    <p className="text-[8px] font-black uppercase tracking-[0.3em] text-blue-400">Held in TumaFast Escrow</p>
                </div>

                {/* OTP Display */}
                <div className="bg-blue-600/20 backdrop-blur-md border border-blue-400/30 p-5 rounded-2xl w-full shadow-xl">
                    <div className="flex items-center justify-center gap-2 mb-2 text-yellow-400">
                        <KeyRound size={14} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Your Release Code</span>
                    </div>
                    <div className="text-5xl font-black text-white tracking-[0.15em] font-mono text-center drop-shadow-md">
                        {otp}
                    </div>
                    <p className="text-[8px] font-bold text-blue-300 mt-2 uppercase tracking-wide text-center">
                        Give this to the rider only after inspection
                    </p>
                </div>

                {/* Rider Info Card */}
                <div className="bg-white w-full rounded-2xl p-4 text-slate-900 shadow-2xl space-y-4 text-left">
                    <div className="flex items-center gap-3">
                        <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Kamau"
                            className="w-12 h-12 bg-slate-100 rounded-xl border border-slate-100"
                            alt="Rider"
                        />
                        <div>
                            <p className="font-black text-base uppercase italic tracking-tight">Kamau #294</p>
                            <div className="flex items-center gap-1 text-blue-500 text-[8px] font-black uppercase tracking-widest">
                                <UserCheck size={10} /> Vetted Dispatcher
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-3">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Important</p>
                        <p className="text-[10px] font-bold leading-tight text-slate-700">Rider is on the way. Track their location below.</p>
                    </div>

                    <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
                        <Zap size={14} fill="currentColor" /> LIVE TRACKING
                    </button>
                </div>

                {/* Continue Shopping Button */}
                <button
                    onClick={onClose}
                    className="text-white/50 font-black text-[9px] uppercase tracking-[0.3em] underline underline-offset-4 hover:text-white transition-colors pt-2"
                >
                    Continue Shopping
                </button>
            </div>
        </div>
    );
};
