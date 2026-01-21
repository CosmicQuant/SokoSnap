/**
 * Input Component
 * Accessible form input with validation support
 */

import React, { forwardRef, useId } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            error,
            hint,
            leftIcon,
            rightIcon,
            containerClassName = '',
            className = '',
            id: providedId,
            disabled,
            required,
            ...props
        },
        ref
    ) => {
        const generatedId = useId();
        const id = providedId || generatedId;
        const errorId = `${id}-error`;
        const hintId = `${id}-hint`;

        const hasError = Boolean(error);

        return (
            <div className={`space-y-2 ${containerClassName}`}>
                {label && (
                    <label
                        htmlFor={id}
                        className="block text-xs font-bold text-slate-400 uppercase tracking-wide ml-1"
                    >
                        {label}
                        {required && (
                            <span className="text-red-500 ml-1" aria-hidden="true">
                                *
                            </span>
                        )}
                    </label>
                )}

                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true">
                            {leftIcon}
                        </div>
                    )}

                    <input
                        ref={ref}
                        id={id}
                        disabled={disabled}
                        required={required}
                        aria-invalid={hasError}
                        aria-describedby={
                            [error && errorId, hint && hintId].filter(Boolean).join(' ') || undefined
                        }
                        className={`
              w-full
              bg-slate-50 border rounded-xl
              px-4 py-3
              font-bold text-slate-900
              placeholder:text-slate-300
              outline-none
              transition-all duration-200
              ${leftIcon ? 'pl-12' : ''}
              ${rightIcon ? 'pr-12' : ''}
              ${hasError
                                ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                                : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10'
                            }
              ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-100' : ''}
              ${className}
            `}
                        {...props}
                    />

                    {rightIcon && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true">
                            {rightIcon}
                        </div>
                    )}
                </div>

                {error && (
                    <p id={errorId} className="text-xs text-red-500 font-medium ml-1" role="alert">
                        {error}
                    </p>
                )}

                {hint && !error && (
                    <p id={hintId} className="text-xs text-slate-400 ml-1">
                        {hint}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
