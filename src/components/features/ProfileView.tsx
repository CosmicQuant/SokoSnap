/**
 * ProfileView Component
 * User profile with login, seller upgrade, and account management
 */

import React, { useState } from 'react';
import {
    User,
    ShieldCheck,
    Store,
    ChevronRight,
    LogOut,
    Package,
    Wallet,
    ArrowLeft,
    Camera,
    CreditCard,
} from 'lucide-react';
import { Button, Input } from '../common';
import { useAuthStore } from '../../store';
import { formatCurrency, getInitials } from '../../utils/formatters';
import { loginSchema, getErrorMessages } from '../../utils/validators';

interface ProfileViewProps {
    onBack: () => void;
    onNavigateToDashboard: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
    onBack,
    onNavigateToDashboard,
}) => {
    const { user, login, logout, becomeSeller, isLoading } = useAuthStore();
    const [phone, setPhone] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        const result = loginSchema.safeParse({ phone });
        if (!result.success) {
            const errors = getErrorMessages(result.error);
            setError(errors.phone || 'Invalid phone number');
            return;
        }

        setError(null);
        await login(result.data.phone);
    };

    const handleBecomeSeller = async () => {
        await becomeSeller();
        onNavigateToDashboard();
    };

    // Guest View - Login Form
    if (!user) {
        return (
            <div className="h-full bg-slate-50 flex flex-col font-sans animate-in slide-in-from-left duration-300">
                <header className="px-6 pt-12 pb-4 flex items-center gap-4 bg-white sticky top-0 border-b border-slate-100 z-10">
                    <button
                        onClick={onBack}
                        className="p-2 -ml-2 text-slate-500 hover:text-slate-900 transition-colors"
                        aria-label="Go back"
                    >
                        <ArrowLeft size={24} aria-hidden="true" />
                    </button>
                    <h1 className="text-xl font-bold text-slate-900">My Profile</h1>
                </header>

                <div className="flex-1 p-8 flex flex-col justify-center items-center text-center">
                    <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 text-emerald-600 border border-emerald-100 shadow-sm">
                        <User size={48} aria-hidden="true" />
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                        Welcome to SokoTrust
                    </h2>
                    <p className="text-slate-500 mb-8 leading-relaxed max-w-xs">
                        Sign in to track your escrow orders, manage your secure wallet, and
                        start selling.
                    </p>

                    <div className="w-full space-y-4">
                        <Input
                            type="tel"
                            label="Mobile Number"
                            placeholder="07XX XXX XXX"
                            value={phone}
                            onChange={(e) => {
                                setPhone(e.target.value);
                                setError(null);
                            }}
                            error={error || undefined}
                        />

                        <Button
                            onClick={handleLogin}
                            variant="primary"
                            size="lg"
                            fullWidth
                            isLoading={isLoading}
                            disabled={!phone}
                        >
                            Continue with Phone
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Logged In View
    return (
        <div className="h-full bg-slate-50 flex flex-col font-sans overflow-y-auto animate-in slide-in-from-right duration-300">
            {/* Header with Profile Info */}
            <header className="px-6 pt-12 pb-8 bg-slate-900 text-white relative overflow-hidden">
                {/* Decorative Background */}
                <div
                    className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"
                    aria-hidden="true"
                />

                <div className="relative z-10">
                    <button
                        onClick={onBack}
                        className="mb-6 p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
                        aria-label="Go back"
                    >
                        <ArrowLeft size={24} aria-hidden="true" />
                    </button>

                    {/* User Info */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-2xl font-bold border border-white/20 text-emerald-400">
                            {getInitials(user.name)}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">{user.name}</h1>
                            <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 bg-emerald-500/10 px-2 py-1 rounded-full w-fit mt-1">
                                {user.type === 'verified_merchant' ? (
                                    <>
                                        <Store size={12} aria-hidden="true" /> Merchant Account
                                    </>
                                ) : (
                                    <>
                                        <User size={12} aria-hidden="true" /> Buyer Account
                                    </>
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Wallet Card */}
                    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex justify-between items-center shadow-lg">
                        <div>
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                                Escrow Balance
                            </p>
                            <h3 className="text-2xl font-bold">
                                {formatCurrency(user.type === 'verified_merchant' ? 12400 : 0)}
                            </h3>
                        </div>
                        <div className="flex gap-2">
                            <button
                                className="p-2.5 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                                aria-label="Payment methods"
                            >
                                <CreditCard size={18} className="text-white" aria-hidden="true" />
                            </button>
                            <button
                                className="p-2.5 bg-emerald-500 rounded-xl text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-colors"
                                aria-label="Wallet"
                            >
                                <Wallet size={18} aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex-1 p-6 space-y-6 pb-24">
                {/* Seller Actions */}
                {user.type === 'verified_merchant' && (
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={onNavigateToDashboard}
                            className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-left active:scale-[0.98] transition-all group hover:border-emerald-200"
                        >
                            <div className="bg-purple-50 w-10 h-10 rounded-2xl flex items-center justify-center text-purple-600 mb-3 group-hover:bg-purple-100 transition-colors">
                                <Store size={20} aria-hidden="true" />
                            </div>
                            <p className="font-bold text-slate-900">Dashboard</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                                Analytics & Links
                            </p>
                        </button>

                        <button className="bg-emerald-600 p-4 rounded-3xl border border-emerald-500 shadow-lg shadow-emerald-200 text-left active:scale-[0.98] transition-all group hover:bg-emerald-500">
                            <div className="bg-white/20 w-10 h-10 rounded-2xl flex items-center justify-center text-white mb-3">
                                <Camera size={20} aria-hidden="true" />
                            </div>
                            <p className="font-bold text-white">Upload Item</p>
                            <p className="text-[10px] text-emerald-100 font-bold uppercase tracking-wide">
                                Add to Feed
                            </p>
                        </button>
                    </div>
                )}

                {/* Become Seller CTA (for buyers) */}
                {user.type === 'verified_buyer' && (
                    <button
                        onClick={handleBecomeSeller}
                        disabled={isLoading}
                        className="w-full bg-slate-900 text-white p-5 rounded-3xl flex items-center justify-between shadow-xl shadow-slate-200 active:scale-[0.98] transition-all group disabled:opacity-50"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-emerald-500/20 p-3 rounded-2xl text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                <Store size={24} aria-hidden="true" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-lg">Become a Seller</p>
                                <p className="text-xs text-slate-400 font-medium">
                                    Verified Merchant Status
                                </p>
                            </div>
                        </div>
                        <ChevronRight
                            className="text-slate-500 group-hover:text-emerald-400 transition-colors"
                            aria-hidden="true"
                        />
                    </button>
                )}

                {/* Menu Items */}
                <nav className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                    <a
                        href="#orders"
                        className="p-4 border-b border-slate-50 flex items-center justify-between hover:bg-slate-50 transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                <Package size={16} aria-hidden="true" />
                            </div>
                            <span className="font-bold text-sm text-slate-700">
                                Orders History
                            </span>
                        </div>
                        <ChevronRight
                            size={16}
                            className="text-slate-300 group-hover:text-slate-500"
                            aria-hidden="true"
                        />
                    </a>

                    <a
                        href="#trust"
                        className="p-4 border-b border-slate-50 flex items-center justify-between hover:bg-slate-50 transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                                <ShieldCheck size={16} aria-hidden="true" />
                            </div>
                            <span className="font-bold text-sm text-slate-700">
                                Trust & Safety
                            </span>
                        </div>
                        <ChevronRight
                            size={16}
                            className="text-slate-300 group-hover:text-slate-500"
                            aria-hidden="true"
                        />
                    </a>

                    <button
                        onClick={logout}
                        className="w-full p-4 flex items-center gap-3 text-red-500 hover:bg-red-50 transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
                            <LogOut size={16} aria-hidden="true" />
                        </div>
                        <span className="font-bold text-sm">Sign Out</span>
                    </button>
                </nav>

                <p className="text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest pt-4">
                    SokoTrust Verified • v2.4.0
                </p>
            </div>
        </div>
    );
};

export default ProfileView;
