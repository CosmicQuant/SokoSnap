/**
 * AuthModal Component
 * Professional Sign In / Sign Up with Google integration
 */

import React, { useState, useEffect } from 'react';
import { Mail, Lock, Phone, User as UserIcon, X } from 'lucide-react';
import { Modal, Input, Button } from '../common';
import { GoogleButton } from '../common/GoogleButton';
import { useAuthStore, useIsAuthModalOpen } from '../../store';
import { kenyanPhoneSchema } from '../../utils/validators';

type AuthTab = 'login' | 'register';

export const AuthModal: React.FC = () => {
    const isOpen = useIsAuthModalOpen();
    const {
        login,
        loginWithGoogle,
        register,
        updateUser,
        closeAuthModal,
        isLoading,
        error,
        clearError,
        user,
        authMode
    } = useAuthStore();

    const [activeTab, setActiveTab] = useState<AuthTab>('login');
    const [missingPhoneMode, setMissingPhoneMode] = useState(false);

    // Form States
    const [identifier, setIdentifier] = useState(''); // Email or Phone
    const [password, setPassword] = useState('');

    // Register specific
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    // Validation
    const [validationError, setValidationError] = useState<string | null>(null);

    // Reset state on open/close
    useEffect(() => {
        if (!isOpen) {
            setMissingPhoneMode(false);
            setValidationError(null);
            clearError();
        } else {
            // Set active tab based on store request
            if (authMode) {
                setActiveTab(authMode);
            }

            // Check if we are already authenticated but missing phone (Google flow)
            if (user && !user.phone) {
                setMissingPhoneMode(true);
            }
        }
    }, [isOpen, user, authMode]);

    // Handle Tab Switch
    const switchTab = (tab: AuthTab) => {
        setActiveTab(tab);
        clearError();
        setValidationError(null);
    };

    // SUBMIT HANDLERS
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError(null);
        await login(identifier, password);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError(null);

        // Basic Validation
        if (!name || !email || !password || !phone) {
            setValidationError('All fields are required');
            return;
        }

        // Phone Validation
        const phoneResult = kenyanPhoneSchema.safeParse(phone);
        if (!phoneResult.success) {
            setValidationError('Invalid Kenyan phone number');
            return;
        }

        await register({ name, email, phone, showPassword: password });
    };

    const handleCompleteProfile = (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError(null);

        const phoneResult = kenyanPhoneSchema.safeParse(phone);
        if (!phoneResult.success) {
            setValidationError('Invalid Kenyan phone number');
            return;
        }

        // Update user profile and close
        updateUser({ phone });
        closeAuthModal();
    };

    // If "Complete Profile" Mode (Google Sign in missing phone)
    if (missingPhoneMode) {
        return (
            <Modal isOpen={isOpen} onClose={closeAuthModal} size="sm" showCloseButton={false}>
                <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Phone size={24} className="text-yellow-500" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">One Last Step</h2>
                    <p className="text-sm text-slate-500">Please provide your phone number for delivery updates.</p>
                </div>

                <form onSubmit={handleCompleteProfile} className="space-y-4">
                    <Input
                        type="tel"
                        label="Phone Number"
                        placeholder="07XX XXX XXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        autoFocus
                    />
                    {validationError && (
                        <p className="text-xs text-red-500 text-center font-medium">{validationError}</p>
                    )}
                    <Button type="submit" fullWidth isLoading={isLoading} variant="primary">
                        Complete Profile
                    </Button>
                </form>
            </Modal>
        );
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={closeAuthModal}
            size="sm"
            showCloseButton={false}
        >
            {/* Header / Tabs */}
            <div className="flex border-b border-slate-100 mb-6">
                <button
                    className={`flex-1 pb-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'login' ? 'border-yellow-400 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    onClick={() => switchTab('login')}
                >
                    Sign In
                </button>
                <button
                    className={`flex-1 pb-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'register' ? 'border-yellow-400 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    onClick={() => switchTab('register')}
                >
                    Join Now
                </button>
            </div>

            {/* Error Display */}
            {(error || validationError) && (
                <div className="bg-red-50 text-red-600 text-xs font-medium p-3 rounded-lg mb-4 text-center">
                    {error || validationError}
                </div>
            )}

            {/* GOOGLE BUTTON - Common to both */}
            <div className="mb-6">
                <GoogleButton
                    onClick={loginWithGoogle}
                    isLoading={isLoading}
                    label={activeTab === 'login' ? 'Sign in with Google' : 'Sign up with Google'}
                />
            </div>

            <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-400 bg-white">Or continue with email</span>
                </div>
            </div>

            {/* LOGIN FORM */}
            {activeTab === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4">
                    <Input
                        label="Email or Phone"
                        placeholder="user@example.com"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        leftIcon={<UserIcon size={16} />}
                        required
                    />
                    <Input
                        type="password"
                        label="Password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        leftIcon={<Lock size={16} />}
                        required
                    />
                    <div className="text-right">
                        <button type="button" className="text-xs text-slate-400 hover:text-slate-600">Forgot Password?</button>
                    </div>
                    <Button type="submit" fullWidth isLoading={isLoading} variant="primary">
                        Sign In
                    </Button>
                </form>
            )}

            {/* REGISTER FORM */}
            {activeTab === 'register' && (
                <form onSubmit={handleRegister} className="space-y-4">
                    <Input
                        label="Full Name"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        leftIcon={<UserIcon size={16} />}
                        required
                    />
                    <Input
                        type="email"
                        label="Email Address"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        leftIcon={<Mail size={16} />}
                        required
                    />
                    <Input
                        type="tel"
                        label="Mobile Number"
                        placeholder="07XX XXX XXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        leftIcon={<Phone size={16} />}
                        required
                    />
                    <Input
                        type="password"
                        label="Create Password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        leftIcon={<Lock size={16} />}
                        required
                    />
                    <Button type="submit" fullWidth isLoading={isLoading} variant="primary">
                        Create Account
                    </Button>
                    <p className="text-[10px] text-slate-400 text-center leading-tight mt-2">
                        By joining, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </form>
            )}

            <button
                onClick={closeAuthModal}
                className="absolute top-4 right-4 text-slate-300 hover:text-slate-600 p-1"
            >
                <X size={20} />
            </button>
        </Modal>
    );
};

export default AuthModal;
