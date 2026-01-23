import React, { useState } from 'react';
import { ArrowLeft, Lock, CheckCircle2, Eye, EyeOff, ShieldCheck } from 'lucide-react';
// import { useAuthStore } from '../../store/authStore';

interface CreatePasswordViewProps {
    onBack: () => void;
    onSuccess: () => void;
    phone: string;
}

export const CreatePasswordView: React.FC<CreatePasswordViewProps> = ({ onBack, onSuccess, phone }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // This would connect to Firebase in a real implementation
    const handleSave = async () => {
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // TODO: Replace with Firebase Auth integration
            // await firebase.auth().createUserWithEmailAndPassword(email, password);
            // await firebase.firestore().collection('users').doc(uid).set({ ... });

            console.log('Saving password for:', phone);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Update local auth state if needed
            // useAuthStore.getState().login(phone); 

            onSuccess();
        } catch (err) {
            setError('Failed to create password. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-[100dvh] w-full bg-slate-50 text-slate-900 flex flex-col pt-safe px-6">
            <header className="flex items-center gap-4 py-4 mb-6">
                <button
                    onClick={onBack}
                    className="p-2 rounded-full bg-slate-200 hover:bg-slate-300 transition-colors"
                >
                    <ArrowLeft size={20} className="text-slate-900" />
                </button>
                <h1 className="text-lg font-black italic uppercase tracking-tighter text-slate-900">Secure Account</h1>
            </header>

            <div className="flex-1 flex flex-col max-w-md mx-auto w-full">
                <div className="mb-8 text-center">
                    <div className="w-16 h-16 mx-auto bg-emerald-50 rounded-full flex items-center justify-center mb-4 border border-emerald-100 shadow-sm">
                        <Lock size={32} className="text-emerald-500" />
                    </div>
                    <h2 className="text-xl font-bold mb-2 text-slate-900">Create a Password</h2>
                    <p className="text-sm text-slate-500">
                        Secure your order history for <span className="text-emerald-600 font-bold font-mono">{phone || 'your account'}</span>
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">New Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-50 transition-all outline-none shadow-sm"
                                placeholder="Min. 6 characters"
                            />
                            <button
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 p-1 hover:text-slate-600"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-50 transition-all outline-none shadow-sm"
                                placeholder="Retype password"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs font-bold text-center animate-in fade-in">
                            {error}
                        </div>
                    )}
                </div>

                <div className="mt-8 space-y-4">
                    <button
                        onClick={handleSave}
                        disabled={isSubmitting || !password}
                        className="w-full bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-black italic uppercase tracking-wider py-4 rounded-xl shadow-lg shadow-yellow-400/20 hover:bg-yellow-300 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <span className="animate-pulse">Securing...</span>
                        ) : (
                            <>
                                <CheckCircle2 size={18} />
                                Save & View Orders
                            </>
                        )}
                    </button>

                    <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-medium">
                        <ShieldCheck size={12} className="text-emerald-500" />
                        <span>Encrypted & Saved to SokoSnap Secure Cloud</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
