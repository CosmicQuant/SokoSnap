import React from 'react';
import { ChevronLeft, Search } from 'lucide-react';

interface SearchOverlayProps {
    onClose: () => void;
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    results: any[];
    onResultClick: () => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({
    onClose,
    searchQuery,
    setSearchQuery,
    results,
    onResultClick
}) => {
    return (
        <div className="fixed inset-0 bg-black/95 z-[60] flex flex-col animate-in fade-in duration-200">
            <div className="p-4 flex items-center gap-4 border-b border-white/10">
                <button onClick={onClose} className="text-white/60 hover:text-white" aria-label="Close Search">
                    <ChevronLeft size={24} />
                </button>
                <div className="flex-1 relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                        className="w-full bg-white/10 rounded-full py-3 pl-10 pr-4 text-white text-sm outline-none focus:bg-white/20 transition-all font-medium"
                        placeholder="Search products, sellers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                    />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                <h3 className="text-xs font-black text-white/40 uppercase tracking-widest mb-4">Results</h3>
                <div className="grid grid-cols-2 gap-4">
                    {results.map(p => (
                        <div key={p.id} onClick={onResultClick} className="bg-white/5 rounded-xl overflow-hidden active:scale-95 transition-transform cursor-pointer">
                            <div className="h-32 bg-slate-800 relative">
                                {p.type === 'video' ? (
                                    <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                                        <span className="text-white/20 text-xs font-bold uppercase">Video</span>
                                    </div>
                                ) : (
                                    <img src={p.media} className="w-full h-full object-cover" alt={p.name} />
                                )}
                            </div>
                            <div className="p-3">
                                <p className="text-white font-bold text-xs truncate">{p.name}</p>
                                <p className="text-yellow-500 text-[10px] font-black">KES {p.price.toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
