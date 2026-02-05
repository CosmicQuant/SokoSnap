import React, { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { useAuthStore } from '../../store';

interface CommentsOverlayProps {
    productId: string;
    onClose: () => void;
}

interface Comment {
    id: string;
    text: string;
    userId: string;
    userName: string;
    createdAt: any;
}

export const CommentsOverlay: React.FC<CommentsOverlayProps> = ({ productId, onClose }) => {
    const { user } = useAuthStore();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!productId) return;

        const q = query(
            collection(db, 'products', productId, 'comments'),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const commentsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Comment));
            setComments(commentsData);
        });

        return () => unsubscribe();
    }, [productId]);

    const handlePost = async () => {
        if (!newComment.trim() || !user || isSubmitting) return;

        setIsSubmitting(true);
        try {
            // Add comment
            await addDoc(collection(db, 'products', productId, 'comments'), {
                text: newComment.trim(),
                userId: user.id,
                userName: user.name || 'User',
                createdAt: serverTimestamp()
            });

            // Increment count on product
            const productRef = doc(db, 'products', productId);
            await updateDoc(productRef, {
                comments: increment(1)
            });

            setNewComment('');
        } catch (error) {
            console.error("Error posting comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Simple time formatter fallback
    const formatTime = (timestamp: any) => {
        if (!timestamp) return 'Just now';
        // Handle Firestore Timestamp
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const diff = (Date.now() - date.getTime()) / 1000; // seconds
        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
        return `${Math.floor(diff / 86400)}d`;
    };

    return (
        <div className="absolute inset-0 z-50 flex flex-col justify-end animate-in slide-in-from-bottom duration-300 pointer-events-none">
            {/* Clickable backdrop for closing (transparent) */}
            <div className="absolute inset-0 pointer-events-auto" onClick={onClose} />

            <div
                className="bg-black/90 backdrop-blur-xl rounded-t-3xl h-[60vh] w-full flex flex-col overflow-hidden pointer-events-auto relative z-10 pb-[env(safe-area-inset-bottom)] border-t border-white/10"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between shadow-lg z-20 bg-black/50">
                    <span className="text-white text-xs font-black uppercase tracking-widest">
                        {comments.length} Comments
                    </span>
                    <button onClick={onClose} className="text-white/50 hover:text-white p-2 bg-white/5 rounded-full">
                        <X size={14} />
                    </button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {comments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-white/30 space-y-2">
                            <span className="text-sm font-bold">No comments yet</span>
                            <span className="text-xs">Be the first to share your thoughts!</span>
                        </div>
                    ) : (
                        comments.map((c) => (
                            <div key={c.id} className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10 flex items-center justify-center shrink-0 shadow-sm">
                                    <span className="text-xs font-bold text-white uppercase">{c.userName.substring(0, 2)}</span>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-xs font-bold text-white/90 drop-shadow-sm">@{c.userName}</span>
                                        <span className="text-[10px] text-white/40">{formatTime(c.createdAt)}</span>
                                    </div>
                                    <p className="text-xs text-white/80 leading-relaxed font-medium">
                                        {c.text}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Input */}
                <div className="p-3 bg-black/40 border-t border-white/10 flex gap-2 backdrop-blur-md z-20">
                    <input
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        onKeyDown={(e) => e.key === 'Enter' && handlePost()}
                        className="flex-1 bg-white/10 border border-white/5 rounded-full px-4 text-xs text-white placeholder:text-white/30 outline-none focus:bg-white/15 focus:border-white/20 transition-all h-10"
                    />
                    <button
                        onClick={handlePost}
                        disabled={!newComment.trim() || isSubmitting}
                        className="bg-[#FFC107] text-black w-10 h-10 flex items-center justify-center rounded-full hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg active:scale-95"
                    >
                        {isSubmitting ? <span className="animate-spin text-lg">⟳</span> : <Send size={16} />}
                    </button>
                </div>
            </div>
        </div>
    );
};
