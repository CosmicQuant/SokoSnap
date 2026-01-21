import React from 'react';

interface ActionBtnProps {
    icon: React.ReactNode;
    label?: string | number;
    onClick?: (e: React.MouseEvent) => void;
    className?: string;
    count?: number;
}

export const ActionBtn: React.FC<ActionBtnProps> = ({ icon, label, onClick, className, count }) => (
    <div className={`flex flex-col items-center gap-1 group relative ${className || ''}`}>
        <button
            onClick={onClick}
            className="flex items-center justify-center text-white active:scale-90 transition p-2 hover:bg-white/10 rounded-full relative"
        >
            {icon}
            {count !== undefined && count > 0 && (
                <div key={count} className="absolute -top-1 -right-1 min-w-[16px] h-[16px] bg-red-600 border border-black rounded-full flex items-center justify-center px-1 animate-pulse-once z-10">
                    <span className="text-[9px] font-bold text-white leading-none">{count}</span>
                </div>
            )}
        </button>
        {label !== undefined && (
            <span className="text-[10px] font-black text-white uppercase tracking-widest drop-shadow-md">
                {label}
            </span>
        )}
    </div>
);
