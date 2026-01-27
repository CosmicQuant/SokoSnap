/**
 * AuthModal Component
 * Professional authentication modal with:
 * - Sign In / Sign Up tabs
 * - Google authentication
 * - Email/Password authentication
 * - Forgot password flow
 * - Email verification prompts
 */

import React, { useState, useEffect } from 'react';
import { Mail, Lock, Phone, User as UserIcon, X, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { Modal, Input, Button } from '../common';
import { GoogleButton } from '../common/GoogleButton';
import { useAuthStore, useIsAuthModalOpen } from '../../store';
import { kenyanPhoneSchema } from '../../utils/validators';

type AuthView = 'login' | 'register' | 'forgot';

export const AuthModal: React.FC = () => {
    const isOpen = useIsAuthModalOpen();
    const {
        login,
        loginWithGoogle,
        register,
        forgotPassword,
        resendVerificationEmail,
        updateUser,
        closeAuthModal,
        clearError,
        clearSuccess,
        isLoading,
        error,
        successMessage,
        user,
        authMode
    } = useAuthStore();

    const [activeView, setActiveView] = useState<AuthView>('login');
    const [missingPhoneMode, setMissingPhoneMode] = useState(false);

    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    // Validation
    const [validationError, setValidationError] = useState<string | null>(null);

    // Reset state on open/close
    useEffect(() => {
        if (!isOpen) {
            // Reset all fields when modal closes
            setMissingPhoneMode(false);
            setValidationError(null);
            setEmail('');
            setPassword('');
            setName('');
            setPhone('');
            clearError();
            clearSuccess();
        } else {
            // Set active view based on store request
            if (authMode && authMode !== activeView) {
                setActiveView(authMode);
            }

            // Check if user needs to complete profile (Google flow missing phone)
            if (user && !user.phone) {
                setMissingPhoneMode(true);
            }
        }
    }, [isOpen, user, authMode]);

    // Sync authMode changes
    useEffect(() => {
        if (authMode && authMode !== activeView) {
            setActiveView(authMode);
        }
    }, [authMode]);

    // Handle View Switch
    const switchView = (view: AuthView) => {
        setActiveView(view);
        clearError();
        clearSuccess();
        setValidationError(null);
    };

    // SUBMIT HANDLERS
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError(null);

        if (!email || !password) {
            setValidationError('Please enter your email and password');
            return;
        }

        await login(email, password);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError(null);

        // Validation
        if (!name || !email || !password || !phone) {
            setValidationError('All fields are required');
            return;
        }

        if (password.length < 6) {
            setValidationError('Password must be at least 6 characters');
            return;
        }

        // Phone Validation
        const phoneResult = kenyanPhoneSchema.safeParse(phone);
        if (!phoneResult.success) {
            setValidationError('Please enter a valid Kenyan phone number');
            return;
        }

        await register({ name, email, phone, password });
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError(null);

        if (!email) {
            setValidationError('Please enter your email address');
            return;
        }

        await forgotPassword(email);
    };

    const handleCompleteProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError(null);

        const phoneResult = kenyanPhoneSchema.safeParse(phone);
        if (!phoneResult.success) {
            setValidationError('Please enter a valid Kenyan phone number');
            return;
        }

        await updateUser({ phone });
        closeAuthModal();
    };

    const handleGoogleAuth = async () => {
        await loginWithGoogle();
    };

    const handleResendVerification = async () => {
        await resendVerificationEmail();
    };

    // "Complete Profile" Mode (Google sign-in with missing phone)
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
                        leftIcon={<Phone size={16} />}
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

    // Forgot Password View
    if (activeView === 'forgot') {
        return (
            <Modal isOpen={isOpen} onClose={closeAuthModal} size="sm" showCloseButton={false}>
                <div className="mb-6">
                    <button
                        onClick={() => switchView('login')}
                        className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4"
                    >
                        <ArrowLeft size={16} />
                        Back to Sign In
                    </button>
                    <h2 className="text-xl font-bold text-slate-900">Reset Password</h2>
                    <p className="text-sm text-slate-500">Enter your email to receive a password reset link.</p>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="bg-green-50 text-green-700 text-sm p-3 rounded-lg mb-4 flex items-start gap-2">
                        <CheckCircle size={18} className="flex-shrink-0 mt-0.5" />
                        <span>{successMessage}</span>
                    </div>
                )}

                {/* Error Display */}
                {(error || validationError) && (
                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 flex items-start gap-2">
                        <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                        <span>{error || validationError}</span>
                    </div>
                )}

                <form onSubmit={handleForgotPassword} className="space-y-4">
                    <Input
                        type="email"
                        label="Email Address"
                        placeholder="user@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        leftIcon={<Mail size={16} />}
                        required
                        autoFocus
                    />
                    <Button type="submit" fullWidth isLoading={isLoading} variant="primary">
                        Send Reset Link
                    </Button>
                </form>

                <button
                    onClick={closeAuthModal}
                    className="absolute top-4 right-4 text-slate-300 hover:text-slate-600 p-1"
                >
                    <X size={20} />
                </button>
            </Modal>
        );
    }

    return (
        <Modal isOpen={isOpen} onClose={closeAuthModal} size="sm" showCloseButton={false}>
            {/* Header / Tabs */}
            <div className="flex border-b border-slate-100 mb-6">
                <button
                    className={`flex-1 pb-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeView === 'login'
                            ? 'border-yellow-400 text-slate-900'
                            : 'border-transparent text-slate-400 hover:text-slate-600'
                        }`}
                    onClick={() => switchView('login')}
                >
                    Sign In
                </button>
                <button
                    className={`flex-1 pb-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeView === 'register'
                            ? 'border-yellow-400 text-slate-900'
                            : 'border-transparent text-slate-400 hover:text-slate-600'
                        }`}
                    onClick={() => switchView('register')}
                >
                    Join Now
                </button>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className="bg-green-50 text-green-700 text-sm p-3 rounded-lg mb-4 flex items-start gap-2">
                    <CheckCircle size={18} className="flex-shrink-0 mt-0.5" />
                    <span>{successMessage}</span>
                </div>
            )}

            {/* Error Display */}
            {(error || validationError) && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 flex items-start gap-2">
                    <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                    <span>{error || validationError}</span>
                </div>
            )}

            {/* GOOGLE BUTTON - Common to both */}
            <div className="mb-6">
                <GoogleButton
                    onClick={handleGoogleAuth}
                    isLoading={isLoading}
                    label={activeView === 'login' ? 'Sign in with Google' : 'Sign up with Google'}
                />
            </div>

            <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-400">Or continue with email</span>
                </div>
            </div>

            {/* LOGIN FORM */}
            {activeView === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4">
                    <Input
                        type="email"
                        label="Email Address"
                        placeholder="user@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        leftIcon={<Mail size={16} />}
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
                        <button
                            type="button"
                            onClick={() => switchView('forgot')}
                            className="text-xs text-slate-400 hover:text-yellow-600 transition-colors"
                        >
                            Forgot Password?
                        </button>
                    </div>
                    <Button type="submit" fullWidth isLoading={isLoading} variant="primary">
                        Sign In
                    </Button>
                </form>
            )}

            {/* REGISTER FORM */}
            {activeView === 'register' && (
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
                        placeholder="Min. 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        leftIcon={<Lock size={16} />}
                        required
                    />
                    <Button type="submit" fullWidth isLoading={isLoading} variant="primary">
                        Create Account
                    </Button>
                    <p className="text-[10px] text-slate-400 text-center leading-tight">
                        By joining, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </form>
            )}

            {/* Email Verification Notice (for logged-in users with unverified email) */}
            {user && user.email && !user.isEmailVerified && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                    <p className="text-xs text-yellow-800 text-center">
                        Please verify your email address.{' '}
                        <button
                            onClick={handleResendVerification}
                            className="font-medium underline hover:no-underline"
                            disabled={isLoading}
                        >
                            Resend verification email
                        </button>
                    </p>
                </div>
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
