/**
 * AuthModal Component
 * Handles user authentication with validation
 */

import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, X } from 'lucide-react';
import { Modal, Input, Button } from '../common';
import { useAuthStore, useIsAuthModalOpen } from '../../store';
import { loginSchema, getErrorMessages } from '../../utils/validators';

export const AuthModal: React.FC = () => {
    const isOpen = useIsAuthModalOpen();
    const { login, closeAuthModal, isLoading, error, clearError } = useAuthStore();

    const [phone, setPhone] = useState('');
    const [validationError, setValidationError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError(null);
        clearError();

        // Validate input
        const result = loginSchema.safeParse({ phone });
        if (!result.success) {
            const errors = getErrorMessages(result.error);
            setValidationError(errors.phone || 'Invalid phone number');
            return;
        }

        // Attempt login
        await login(result.data.phone);
    };

    const handleClose = () => {
        setPhone('');
        setValidationError(null);
        clearError();
        closeAuthModal();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            size="sm"
            showCloseButton={false}
        >
            <form onSubmit={handleSubmit}>
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                        <ShieldCheck size={16} aria-hidden="true" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                            SokoTrust Secure
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="p-2 -mr-2 text-slate-400 hover:text-slate-900 transition-colors"
                        aria-label="Close authentication modal"
                    >
                        <X size={20} aria-hidden="true" />
                    </button>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Secure Sign In
                </h2>
                <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                    Enter your mobile number to securely approve this purchase via M-Pesa escrow.
                </p>

                {/* Phone Input */}
                <Input
                    type="tel"
                    label="Mobile Number"
                    placeholder="07XX XXX XXX"
                    value={phone}
                    onChange={(e) => {
                        setPhone(e.target.value);
                        setValidationError(null);
                    }}
                    error={validationError || error || undefined}
                    autoFocus
                    required
                    aria-describedby="phone-help"
                />
                <p id="phone-help" className="sr-only">
                    Enter your Kenyan mobile number starting with 07 or 01
                </p>

                {/* Submit Button */}
                <div className="mt-6">
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        isLoading={isLoading}
                        rightIcon={<ArrowRight size={18} />}
                    >
                        Verify & Continue
                    </Button>
                </div>

                {/* Terms */}
                <p className="mt-6 text-center text-[10px] text-slate-400">
                    By continuing, you agree to our{' '}
                    <a href="/terms" className="underline decoration-slate-300 hover:text-slate-600">
                        Escrow Terms
                    </a>{' '}
                    &{' '}
                    <a href="/privacy" className="underline decoration-slate-300 hover:text-slate-600">
                        Privacy Policy
                    </a>
                    .
                </p>
            </form>
        </Modal>
    );
};

export default AuthModal;
