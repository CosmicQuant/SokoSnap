import React from 'react';

interface ActionBtnProps {
    icon: React.ReactNode;
    label?: string;
    onClick?: (e: React.MouseEvent) => void;
    className?: string;
}

export const ActionBtn: React.FC<ActionBtnProps> = ({ icon, label, onClick, className }) => (
    <div className={`flex flex-col items-center gap-1 group ${className || ''}`}>
        <button
            onClick={onClick}
            className="flex items-center justify-center text-white active:scale-90 transition p-2 hover:bg-white/10 rounded-full"
        >
            {icon}
        </button>
        {label && (
            <span className="text-[10px] font-black text-white uppercase tracking-widest drop-shadow-md">
                {label}
            </span>
        )}
    </div>
);
