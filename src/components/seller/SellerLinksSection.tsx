import React, { useState } from 'react';
import { Link2, Copy, Check, Trash2, ExternalLink, Eye, ShoppingBag } from 'lucide-react';
import { useSellerStore } from '../../store';

interface SellerLinksSectionProps {
    onCreateNew?: () => void;
}

export const SellerLinksSection: React.FC<SellerLinksSectionProps> = ({ onCreateNew }) => {
    const { posts, removePost } = useSellerStore();
    const [copiedId, setCopiedId] = useState<number | null>(null);

    const copyLink = async (link: string, id: number) => {
        try {
            await navigator.clipboard.writeText(link);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const openLink = (link: string) => {
        window.open(link, '_blank');
    };

    if (posts.length === 0) {
        return (
            <div className="space-y-3">
                <div className="flex items-center justify-between pl-1">
                    <h3 className="text-xs font-black uppercase tracking-widest text-white/30">Checkout Links</h3>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-2xl p-6 text-center">
                    <Link2 size={32} className="text-white/20 mx-auto mb-3" />
                    <p className="text-sm text-white/40 mb-4">No checkout links yet</p>
                    {onCreateNew && (
                        <button
                            onClick={onCreateNew}
                            className="px-4 py-2 bg-yellow-400 text-black rounded-xl text-xs font-black uppercase tracking-wider hover:bg-yellow-300 transition-colors"
                        >
                            Create Your First Link
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between pl-1">
                <h3 className="text-xs font-black uppercase tracking-widest text-white/30">
                    Checkout Links ({posts.length})
                </h3>
                {onCreateNew && (
                    <button
                        onClick={onCreateNew}
                        className="text-[10px] font-bold text-yellow-400 uppercase hover:text-yellow-300 transition-colors"
                    >
                        + New
                    </button>
                )}
            </div>

            <div className="space-y-2">
                {posts.map((post) => (
                    <div
                        key={post.id}
                        className="bg-white/5 border border-white/5 rounded-2xl p-4 hover:bg-white/10 transition-colors"
                    >
                        <div className="flex items-start gap-3">
                            {/* Thumbnail */}
                            <div className="w-14 h-14 rounded-xl bg-white/10 overflow-hidden shrink-0">
                                {post.thumbnailUrl ? (
                                    <img
                                        src={post.thumbnailUrl}
                                        alt={post.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Link2 size={20} className="text-white/30" />
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm text-white truncate">{post.name}</h4>
                                <p className="text-xs text-white/40 mt-0.5">
                                    KES {post.price.toLocaleString()}
                                </p>

                                {/* Stats */}
                                <div className="flex items-center gap-3 mt-2">
                                    <div className="flex items-center gap-1 text-white/30">
                                        <Eye size={12} />
                                        <span className="text-[10px] font-medium">{post.views}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-white/30">
                                        <ShoppingBag size={12} />
                                        <span className="text-[10px] font-medium">{post.orders}</span>
                                    </div>
                                    <span className="text-[10px] text-white/20">
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Link & Actions */}
                        <div className="mt-3 flex items-center gap-2">
                            <div className="flex-1 bg-black/30 rounded-lg px-3 py-2 overflow-hidden">
                                <span className="text-[10px] text-white/50 font-mono truncate block">
                                    {post.checkoutLink}
                                </span>
                            </div>
                            <button
                                onClick={() => copyLink(post.checkoutLink, post.id)}
                                className="p-2 bg-yellow-400 hover:bg-yellow-300 rounded-lg transition-colors shrink-0"
                                title="Copy link"
                            >
                                {copiedId === post.id ? (
                                    <Check size={14} className="text-black" />
                                ) : (
                                    <Copy size={14} className="text-black" />
                                )}
                            </button>
                            <button
                                onClick={() => openLink(post.checkoutLink)}
                                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors shrink-0"
                                title="Open link"
                            >
                                <ExternalLink size={14} className="text-white/70" />
                            </button>
                            <button
                                onClick={() => removePost(post.id)}
                                className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors shrink-0"
                                title="Delete"
                            >
                                <Trash2 size={14} className="text-red-400" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
