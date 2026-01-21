/**
 * M-Pesa Logo SVG Component
 * A stylized representation of the M-Pesa payment logo
 */

import React from 'react';

interface MpesaLogoProps {
    size?: number;
    className?: string;
}

export const MpesaLogo: React.FC<MpesaLogoProps> = ({ size = 24, className = '' }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="M-Pesa"
    >
        {/* Background circle */}
        <circle cx="24" cy="24" r="22" fill="#4CAF50" />

        {/* M letter */}
        <path
            d="M12 34V18L18 28L24 18L30 28L36 18V34"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
        />

        {/* Underline accent */}
        <path
            d="M14 36H34"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
        />
    </svg>
);

/**
 * Lipa na M-Pesa horizontal logo with text
 */
export const LipaNaMpesaLogo: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`lipa-na-mpesa-logo ${className}`}>
        <MpesaLogo size={22} />
        <span className="lipa-logo-text">Lipa na M-Pesa</span>
    </div>
);

export default MpesaLogo;
