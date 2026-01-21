import React from 'react';
import { User, Search, ShoppingBag } from 'lucide-react';

interface TopNavProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    cartCount: number;
    onProfileClick: () => void;
    onSearchClick: () => void;
    onCartClick: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
    activeTab,
    setActiveTab,
    cartCount,
    onProfileClick,
    onSearchClick,
    onCartClick
}) => {
    return (
        <div className="absolute top-0 left-0 right-0 z-50 pt-6 pb-4 px-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
            {/* Profile Button */}
            <button
                onClick={onProfileClick}
                aria-label="View Profile"
                className="pointer-events-auto text-white/80 hover:text-white transition-colors p-2 bg-black/20 backdrop-blur-md rounded-full"
            >
                <User size={20} />
            </button>

            {/* Toggles */}
            <div className="flex gap-6 pointer-events-auto">
                <button
                    onClick={() => setActiveTab('shop')}
                    className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 drop-shadow-md p-2 ${activeTab === 'shop'
                            ? 'text-white scale-110'
                            : 'text-white/40 hover:text-white/60'
                        }`}
                >
                    Following
                </button>
                <div className="w-[1px] h-3 bg-white/20 self-center"></div>
                <button
                    onClick={() => setActiveTab('foryou')}
                    className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 drop-shadow-md p-2 ${activeTab === 'foryou'
                            ? 'text-white scale-110'
                            : 'text-white/40 hover:text-white/60'
                        }`}
                >
                    For You
                </button>
            </div>

            {/* Right Actions */}
            <div className="flex gap-3 pointer-events-auto">
                <button
                    onClick={onSearchClick}
                    aria-label="Search"
                    className="text-white/80 hover:text-white transition-colors p-2 bg-black/20 backdrop-blur-md rounded-full"
                >
                    <Search size={20} />
                </button>
                <button
                    onClick={onCartClick}
                    aria-label="View Cart"
                    className="text-white/80 hover:text-white transition-colors p-2 bg-black/20 backdrop-blur-md rounded-full relative"
                >
                    <ShoppingBag size={20} />
                    {cartCount > 0 && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-yellow-500 rounded-full border border-black"></span>}
                </button>
            </div>
        </div>
    );
};
