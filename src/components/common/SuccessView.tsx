import React from 'react';
import { Lock, KeyRound, UserCheck, Zap } from 'lucide-react';

interface SuccessViewProps {
    otp: number | null;
    onReturn: () => void;
}

export const SuccessView: React.FC<SuccessViewProps> = ({ otp, onReturn }) => {
    return (
        <div className="h-screen w-full bg-blue-600 flex flex-col items-center justify-center p-8 text-center text-white animate-in zoom-in-95 duration-500">
            <Lock size={48} className="mb-6 opacity-30" />
            <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none mb-2 text-white">PAYMENT SECURED</h1>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] mb-8 opacity-60 italic">Held in TumaFast Escrow</p>

            {/* OTP Display - Protected */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl w-full mb-8 shadow-xl">
                <div className="flex items-center justify-center gap-2 mb-2 text-yellow-400 opacity-90">
                    <KeyRound size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Your Release Code</span>
                </div>
                <div className="text-6xl font-black text-white tracking-[0.2em] font-mono drop-shadow-md">
                    {otp}
                </div>
                <p className="text-[8px] font-bold text-blue-200 mt-2 uppercase tracking-wide">Give this to the rider only after inspection</p>
            </div>

            <div className="bg-white w-full rounded-[2.5rem] p-8 text-slate-900 shadow-2xl space-y-6 text-left relative overflow-hidden">
                <div className="flex items-center gap-4">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Kamau" className="w-14 h-14 bg-slate-100 rounded-xl border border-blue-50" alt="Rider" />
                    <div>
                        <p className="font-black text-lg uppercase italic tracking-tight">Kamau #294</p>
                        <div className="flex items-center gap-1 text-blue-500 text-[8px] font-black uppercase tracking-widest">
                            <UserCheck size={10} /> Vetted Dispatcher
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-100 pt-5">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Important</p>
                    <p className="text-[10px] font-bold leading-tight text-slate-700 italic">Rider is on the way. Track their location below.</p>
                </div>

                <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-[10px] uppercase italic tracking-widest shadow-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
                    <Zap size={14} fill="currentColor" /> LIVE TRACKING
                </button>
            </div>

            <button onClick={onReturn} className="mt-14 text-white/50 font-black text-[9px] uppercase tracking-[0.5em] underline underline-offset-8 hover:text-white transition-colors">Return to Shop</button>
        </div>
    );
};
