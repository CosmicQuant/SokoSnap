/**
 * Toast Component
 * Notification system for success/error/info messages
 */

import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToast, useUIStore } from '../../store';

const toastConfig = {
    success: {
        icon: CheckCircle2,
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        textColor: 'text-emerald-800',
        iconColor: 'text-emerald-500',
    },
    error: {
        icon: AlertCircle,
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-800',
        iconColor: 'text-red-500',
    },
    warning: {
        icon: AlertTriangle,
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        textColor: 'text-amber-800',
        iconColor: 'text-amber-500',
    },
    info: {
        icon: Info,
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-800',
        iconColor: 'text-blue-500',
    },
};

export const Toast: React.FC = () => {
    const toast = useToast();
    const hideToast = useUIStore((state) => state.hideToast);

    if (!toast) return null;

    const config = toastConfig[toast.type];
    const Icon = config.icon;

    return (
        <div
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4 animate-in slide-in-from-top duration-300"
            role="alert"
            aria-live="polite"
        >
            <div
                className={`
          ${config.bgColor} ${config.borderColor} ${config.textColor}
          border rounded-2xl p-4 shadow-lg
          flex items-start gap-3
        `}
            >
                <Icon className={`${config.iconColor} shrink-0 mt-0.5`} size={20} aria-hidden="true" />

                <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm">{toast.title}</p>
                    {toast.message && (
                        <p className="text-xs mt-1 opacity-80">{toast.message}</p>
                    )}
                </div>

                <button
                    onClick={hideToast}
                    className={`${config.textColor} opacity-50 hover:opacity-100 transition-opacity shrink-0`}
                    aria-label="Dismiss notification"
                >
                    <X size={16} aria-hidden="true" />
                </button>
            </div>
        </div>
    );
};

/**
 * Hook for showing toasts programmatically
 */
export const useShowToast = () => {
    const showToast = useUIStore((state) => state.showToast);

    return {
        success: (title: string, message?: string) =>
            showToast({ type: 'success', title, message }),
        error: (title: string, message?: string) =>
            showToast({ type: 'error', title, message }),
        warning: (title: string, message?: string) =>
            showToast({ type: 'warning', title, message }),
        info: (title: string, message?: string) =>
            showToast({ type: 'info', title, message }),
    };
};

export default Toast;
