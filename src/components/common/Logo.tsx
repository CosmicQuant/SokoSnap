import React from 'react';

interface LogoProps {
    className?: string;
    size?: number;
    showText?: boolean;
    variant?: 'white' | 'color';
}

export const Logo: React.FC<LogoProps> = ({
    className = "",
    size = 32,
    showText = false,
    variant = 'white'
}) => {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <svg
                width={size}
                height={size}
                viewBox="0 0 512 512"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="SokoSnap Logo"
            >
                <defs>
                    <linearGradient id="logo_grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                    <filter id="logo_shadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.25" />
                    </filter>
                </defs>

                {/* Background Circle */}
                <circle cx="256" cy="256" r="240" fill="url(#logo_grad)" />

                {/* Icon Content */}
                <g transform="translate(106, 106) scale(0.6)" filter="url(#logo_shadow)">
                    <path d="M60 440h380l-40-320H100L60 440z" fill="white" />
                    <path d="M160 120v-40c0-44.18 35.82-80 80-80s80 35.82 80 80v40"
                        fill="none"
                        stroke="white"
                        strokeWidth="40"
                        strokeLinecap="round"
                    />

                    {/* Brand Accent (Yellow Tag) */}
                    <path d="M220 220h60v60h-60z" fill="#facc15" transform="rotate(-15 250 250)" />

                    {/* SokoSnap Check/Bolt Motif */}
                    <path d="M200 280 L240 320 L320 200"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="30"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        transform="translate(10, 30)"
                    />
                </g>
            </svg>

            {showText && (
                <div className="flex flex-colleading-none">
                    <span className={`font-black italic tracking-tighter text-xl ${variant === 'white' ? 'text-white' : 'text-slate-900'}`}>
                        SokoSnap
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${variant === 'white' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        TumaFast
                    </span>
                </div>
            )}
        </div>
    );
};
