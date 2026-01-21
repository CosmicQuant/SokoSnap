import React from 'react';
import { User, Search, ShoppingBag, ChevronLeft } from 'lucide-react';

interface TopNavProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    cartCount: number;
    onProfileClick: () => void;
    onSearchClick: () => void;
    onCartClick: () => void;
    currentSeller?: { name: string, handle: string };
    onBack?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
    activeTab,
    setActiveTab,
    cartCount,
    onProfileClick,
    onSearchClick,
    onCartClick,
    currentSeller,
    onBack
}) => {
    return (
        <div className="absolute top-0 left-0 right-0 z-50 pt-6 pb-4 px-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
            {/* Top Left: Back Button OR User Profile Icon */}
            {onBack ? (
                <button
                    onClick={onBack}
                    aria-label="Back"
                    className="pointer-events-auto text-white hover:text-white/80 transition-colors p-2 bg-black/20 backdrop-blur-md rounded-full"
                >
                    <ChevronLeft size={24} />
                </button>
            ) : (
                <button
                    onClick={onProfileClick}
                    aria-label="View Profile"
                    className="pointer-events-auto text-white/80 hover:text-white transition-colors p-2 bg-black/20 backdrop-blur-md rounded-full"
                >
                    <User size={20} />
                </button>
            )}

            {/* Center Toggles: [ Shop Name ] | [ For You ] */}
            <div className="flex gap-4 pointer-events-auto absolute left-1/2 -translate-x-1/2 items-center">
                {currentSeller ? (
                    <>
                        <button
                            onClick={() => setActiveTab('shop')}
                            className={`flex flex-col items-center gap-0.5 transition-all duration-300 drop-shadow-md ${activeTab === 'shop'
                                ? 'opacity-100 scale-105'
                                : 'opacity-50 hover:opacity-80'
                                }`}
                        >
                            {/* Shop Icon */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center p-0.5 border ${activeTab === 'shop' ? 'border-green-500' : 'border-white/20'
                                }`}>
                                <div className="w-full h-full rounded-full bg-gradient-to-tr from-green-400 to-green-600 flex items-center justify-center text-black font-bold text-[10px]">
                                    {currentSeller.name.charAt(0)}
                                </div>
                            </div>
                            {/* Shop Name */}
                            <span className={`text-[8px] font-black uppercase tracking-wider ${activeTab === 'shop' ? 'text-green-400' : 'text-white'
                                }`}>
                                {currentSeller.name.split(' ')[0]}
                            </span>
                        </button>

                        <div className="w-[1px] h-3 bg-white/20 self-center mb-4"></div>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => setActiveTab('shop')}
                            className={`text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-300 drop-shadow-md p-2 ${activeTab === 'shop'
                                ? 'text-white scale-110'
                                : 'text-white/40 hover:text-white/60'
                                }`}
                        >
                            Following
                        </button>
                        <div className="w-[1px] h-3 bg-white/20 self-center"></div>
                    </>
                )}

                <button
                    onClick={() => setActiveTab('foryou')}
                    className={`text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-300 drop-shadow-md p-2 ${activeTab === 'foryou'
                        ? 'text-white scale-110'
                        : 'text-white/40 hover:text-white/60'
                        } ${currentSeller ? 'mb-3' : ''}`} // Align with the pill if pill exists
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
                    {cartCount > 0 && (
                        <div key={cartCount} className="absolute -top-1 -right-1 min-w-[16px] h-[16px] bg-red-600 border border-black rounded-full flex items-center justify-center px-1 animate-pulse-once">
                            <span className="text-[9px] font-bold text-white leading-none">{cartCount}</span>
                        </div>
                    )}
                </button>
            </div>
        </div>
    );
};
