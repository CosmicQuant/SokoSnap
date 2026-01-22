import React, { useState } from 'react';
import { X, Send, User } from 'lucide-react';

interface CommentsOverlayProps {
    onClose: () => void;
}

const MOCK_COMMENTS = [
    { id: 1, user: 'stacy_k', text: 'Is this available in size 38?', time: '2m' },
    { id: 2, user: 'dev_musa', text: 'Trusted seller! Got mine yesterday.', time: '1h' },
    { id: 3, user: 'sharon_254', text: 'How long is delivery to Mombasa?', time: '3h' },
];

export const CommentsOverlay: React.FC<CommentsOverlayProps> = ({ onClose }) => {
    const [comments, setComments] = useState(MOCK_COMMENTS);
    const [newComment, setNewComment] = useState('');

    const handlePost = () => {
        if (!newComment.trim()) return;
        setComments([
            { id: Date.now(), user: 'you', text: newComment, time: 'Just now' },
            ...comments
        ]);
        setNewComment('');
    };

    return (
        <div className="absolute inset-0 z-50 flex flex-col justify-end animate-in slide-in-from-bottom duration-300 pointer-events-none">
            {/* Clickable backdrop for closing (transparent) */}
            <div className="absolute inset-0 pointer-events-auto" onClick={onClose} />

            <div
                className="bg-black/80 backdrop-blur-md rounded-t-3xl h-[60vh] w-full flex flex-col overflow-hidden pointer-events-auto relative z-10 pb-[env(safe-area-inset-bottom)]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <span className="text-white text-xs font-black uppercase tracking-widest">
                        {comments.length} Comments
                    </span>
                    <button onClick={onClose} className="text-white/50 hover:text-white p-2">
                        <X size={18} />
                    </button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {comments.map((c) => (
                        <div key={c.id} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                <User size={14} className="text-white/50" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-xs font-bold text-white/90">@{c.user}</span>
                                    <span className="text-[10px] text-white/40">{c.time}</span>
                                </div>
                                <p className="text-xs text-white/80 leading-relaxed font-medium">
                                    {c.text}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input */}
                <div className="p-4 bg-black/20 border-t border-white/10 flex gap-2">
                    <input
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 bg-white/5 rounded-full px-4 text-xs text-white outline-none focus:bg-white/10 transition-colors"
                    />
                    <button
                        onClick={handlePost}
                        disabled={!newComment.trim()}
                        className="bg-green-500 text-white p-2.5 rounded-full hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};
