/**
 * Modal Component
 * Accessible modal/dialog with focus trap and keyboard handling
 */

import React, { useCallback } from 'react';
import { X } from 'lucide-react';
import FocusTrap from 'focus-trap-react';
import { useScrollLock, useKeyPress } from '../../hooks';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'full';
    showCloseButton?: boolean;
    closeOnOverlayClick?: boolean;
    closeOnEscape?: boolean;
    className?: string;
}

const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    full: 'max-w-full mx-4',
};

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    description,
    children,
    size = 'md',
    showCloseButton = true,
    closeOnOverlayClick = true,
    closeOnEscape = true,
    className = '',
}) => {
    // Lock body scroll when modal is open
    useScrollLock(isOpen);

    // Handle escape key
    const handleEscape = useCallback(() => {
        if (closeOnEscape && isOpen) {
            onClose();
        }
    }, [closeOnEscape, isOpen, onClose]);

    useKeyPress('Escape', handleEscape);

    // Handle overlay click
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <FocusTrap
            focusTrapOptions={{
                initialFocus: false,
                allowOutsideClick: true,
                escapeDeactivates: false,
            }}
        >
            <div
                className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? 'modal-title' : undefined}
                aria-describedby={description ? 'modal-description' : undefined}
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={handleOverlayClick}
                    aria-hidden="true"
                />

                {/* Modal Content */}
                <div
                    className={`
            relative
            bg-white
            w-full ${sizeStyles[size]}
            max-h-[85vh]
            rounded-[2rem]
            p-6 md:p-8
            shadow-2xl
            animate-in slide-in-from-bottom duration-300
            overflow-y-auto
            [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']
            ${className}
          `}
                >
                    {/* Close Button */}
                    {showCloseButton && (
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
                            aria-label="Close modal"
                        >
                            <X size={20} aria-hidden="true" />
                        </button>
                    )}

                    {/* Title */}
                    {title && (
                        <h2
                            id="modal-title"
                            className="text-2xl font-bold text-slate-900 mb-2 pr-8"
                        >
                            {title}
                        </h2>
                    )}

                    {/* Description */}
                    {description && (
                        <p
                            id="modal-description"
                            className="text-slate-500 text-sm mb-6 leading-relaxed"
                        >
                            {description}
                        </p>
                    )}

                    {/* Content */}
                    {children}
                </div>
            </div>
        </FocusTrap>
    );
};

/**
 * Modal Footer - Helper component for consistent footer styling
 */
export const ModalFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className = '',
}) => (
    <div className={`mt-6 flex flex-col sm:flex-row gap-3 ${className}`}>
        {children}
    </div>
);

export default Modal;
