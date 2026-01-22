import React from 'react';
import { X, Plus } from 'lucide-react';

interface ActionBtnProps {
    icon: React.ReactNode;
    label?: string | number;
    onClick?: (e: React.MouseEvent) => void;
    onRemoveClick?: (e: React.MouseEvent) => void;
    className?: string;
    count?: number;
    showAddHint?: boolean; // Shows a "+" badge when item not in cart
}

export const ActionBtn: React.FC<ActionBtnProps> = ({ icon, label, onClick, onRemoveClick, className, count, showAddHint }) => (
    <div className={`flex flex-col items-center gap-1 group relative ${className || ''}`}>
        <button
            onClick={onClick}
            className="flex items-center justify-center text-white active:scale-90 transition p-2 hover:bg-white/10 rounded-full relative"
        >
            {icon}

            {/* ADD HINT: Plus badge when item not in cart */}
            {showAddHint && (count === undefined || count === 0) && (
                <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center shadow-md border border-black/20 animate-pulse">
                    <Plus size={10} className="text-black" strokeWidth={3} />
                </div>
            )}

            {/* Quantity badge when in cart */}
            {count !== undefined && count > 0 && (
                <div key={count} className="absolute -top-1 -right-1 min-w-[16px] h-[16px] bg-red-600 border border-black rounded-full flex items-center justify-center px-1 animate-pulse-once z-10">
                    <span className="text-[9px] font-bold text-white leading-none">{count}</span>
                </div>
            )}

            {/* Remove / Decrement Badge Overlay */}
            {count !== undefined && count > 0 && onRemoveClick && (
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemoveClick(e);
                    }}
                    className="absolute -bottom-3 -right-3 w-6 h-6 bg-transparent flex items-center justify-center z-20 active:scale-90"
                >
                    <div className="w-4 h-4 rounded-full bg-white border border-red-500 flex items-center justify-center shadow-sm">
                        <X size={10} className="text-red-500 font-bold" />
                    </div>
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
