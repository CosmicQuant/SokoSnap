/**
 * SuccessView Component
 * Order confirmation with escrow details and OTP
 */

import React from 'react';
import { Lock, UserCheck } from 'lucide-react';
import { Button } from '../common';
import { generateOTP, generateOrderId } from '../../utils/formatters';

interface SuccessViewProps {
    onContinue: () => void;
    onCreatePassword?: () => void;
}

export const SuccessView: React.FC<SuccessViewProps> = ({ onContinue, onCreatePassword }) => {
    // Generate order details (in production these would come from API)
    const escrowId = generateOrderId('TRX');
    const otp = generateOTP(4);
    const riderName = 'Kamau M.';

    return (
        <div
            className="fixed inset-0 z-[70] bg-yellow-400 flex flex-col items-center justify-center p-8 text-center text-slate-900 animate-in zoom-in-95 duration-500"
            role="alertdialog"
            aria-labelledby="success-title"
            aria-describedby="success-description"
        >
            {/* Success Icon */}
            <div className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center mb-6 shadow-xl shadow-yellow-500/20">
                <Lock size={32} className="text-slate-900" aria-hidden="true" />
            </div>

            <h1 id="success-title" className="text-3xl font-bold mb-2">
                Funds Secured
            </h1>
            <p
                id="success-description"
                className="text-slate-900/80 text-sm font-medium mb-12 max-w-[200px] leading-relaxed"
            >
                Your payment is safely held in Escrow ID #{escrowId}
            </p>

            {/* Rider Card */}
            <div className="bg-white w-full rounded-[2.5rem] p-8 text-slate-900 shadow-2xl space-y-6 text-left relative overflow-hidden">
                {/* Rider Info */}
                <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                    <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Kamau"
                        className="w-14 h-14 bg-slate-100 rounded-2xl border border-slate-100"
                        alt={`Delivery agent ${riderName}`}
                    />
                    <div>
                        <p className="font-bold text-lg text-slate-900">{riderName}</p>
                        <div className="flex items-center gap-1 text-yellow-600 text-[10px] font-bold uppercase tracking-widest bg-yellow-50 px-2 py-1 rounded-full w-fit mt-1">
                            <UserCheck size={12} aria-hidden="true" /> Verified Agent
                        </div>
                    </div>
                </div>

                {/* Next Steps */}
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        Next Steps
                    </p>
                    <p className="text-sm font-medium text-slate-600 leading-relaxed">
                        {riderName.split(' ')[0]} is on the way. Inspect your item upon
                        arrival. Share the OTP below only if you are satisfied.
                    </p>
                </div>

                {/* OTP Display */}
                <div
                    className="bg-slate-100 rounded-xl p-4 text-center"
                    role="region"
                    aria-label="Release OTP code"
                >
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">
                        Your Release OTP
                    </p>
                    <p
                        className="text-3xl font-mono font-bold text-slate-900 tracking-[0.5em]"
                        aria-label={`OTP code: ${otp.split('').join(' ')}`}
                    >
                        {otp}
                    </p>
                </div>

                {/* Create Password / Track Button */}
                <Button
                    onClick={onCreatePassword}
                    variant="primary"
                    size="lg"
                    fullWidth
                    className="mt-2 bg-slate-900 text-yellow-400 hover:bg-slate-800 border border-slate-700 shadow-xl"
                >
                    Create Password to View Status
                </Button>
            </div>

            {/* Return Link */}
            <button
                onClick={onContinue}
                className="mt-8 text-black/60 font-bold text-xs uppercase tracking-widest hover:text-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/50 focus-visible:ring-offset-2 focus-visible:ring-offset-yellow-400 rounded-lg px-4 py-2"
            >
                Return to Marketplace
            </button>
        </div>
    );
};

export default SuccessView;
