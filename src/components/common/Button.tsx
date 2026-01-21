/**
 * Button Component
 * Accessible, reusable button with multiple variants
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}

const variantStyles = {
    primary: 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-200',
    success: 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-300 hover:to-yellow-400 shadow-lg shadow-yellow-400/50',
};

const sizeStyles = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-4 py-3 text-sm',
    lg: 'px-6 py-4 text-base',
};

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    disabled,
    className = '',
    type = 'button',
    ...props
}) => {
    const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-bold uppercase tracking-wide
    rounded-xl
    transition-all duration-200
    active:scale-[0.98]
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-500
    disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
  `;

    return (
        <button
            type={type}
            disabled={disabled || isLoading}
            className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
            {...props}
        >
            {isLoading ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    <span>Loading...</span>
                </>
            ) : (
                <>
                    {leftIcon && <span aria-hidden="true">{leftIcon}</span>}
                    {children}
                    {rightIcon && <span aria-hidden="true">{rightIcon}</span>}
                </>
            )}
        </button>
    );
};

export default Button;
