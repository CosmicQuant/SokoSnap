import React, { useState, useRef } from 'react';
import {
    ChevronLeft,
    X,
    Image as ImageIcon,
    Video,
    Link2,
    Copy,
    Check,
    Loader2,
    AlertCircle
} from 'lucide-react';

interface MediaItem {
    id: string;
    type: 'image' | 'video';
    file: File;
    preview: string;
    duration?: number; // For videos
}

interface CreatePostViewProps {
    onBack: () => void;
    onPostCreated: (post: {
        id: number;
        name: string;
        description: string;
        price: number;
        media: MediaItem[];
        checkoutLink: string;
        createdAt: Date;
    }) => void;
}

const MAX_VIDEOS = 5;
const MAX_IMAGES = 5;
const MAX_VIDEO_DURATION = 42; // seconds

export const CreatePostView: React.FC<CreatePostViewProps> = ({ onBack, onPostCreated }) => {
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [createdLink, setCreatedLink] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const videoInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const videoCount = media.filter(m => m.type === 'video').length;
    const imageCount = media.filter(m => m.type === 'image').length;

    const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        setError(null);

        for (let i = 0; i < files.length; i++) {
            if (videoCount + i >= MAX_VIDEOS) {
                setError(`Maximum ${MAX_VIDEOS} videos allowed`);
                break;
            }

            const file = files[i];
            if (!file) continue;

            // Check video duration
            const duration = await getVideoDuration(file);
            if (duration > MAX_VIDEO_DURATION) {
                setError(`Video must be ${MAX_VIDEO_DURATION} seconds or less. This video is ${Math.round(duration)}s`);
                continue;
            }

            const preview = URL.createObjectURL(file);
            const newMedia: MediaItem = {
                id: `video-${Date.now()}-${i}`,
                type: 'video',
                file,
                preview,
                duration
            };
            setMedia(prev => [...prev, newMedia]);
        }

        // Reset input
        if (videoInputRef.current) videoInputRef.current.value = '';
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        setError(null);

        for (let i = 0; i < files.length; i++) {
            if (imageCount + i >= MAX_IMAGES) {
                setError(`Maximum ${MAX_IMAGES} images allowed`);
                break;
            }

            const file = files[i];
            if (!file) continue;
            const preview = URL.createObjectURL(file);
            const newMedia: MediaItem = {
                id: `image-${Date.now()}-${i}`,
                type: 'image',
                file,
                preview
            };
            setMedia(prev => [...prev, newMedia]);
        }

        // Reset input
        if (imageInputRef.current) imageInputRef.current.value = '';
    };

    const getVideoDuration = (file: File): Promise<number> => {
        return new Promise((resolve) => {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = () => {
                window.URL.revokeObjectURL(video.src);
                resolve(video.duration);
            };
            video.src = URL.createObjectURL(file);
        });
    };

    const removeMedia = (id: string) => {
        setMedia(prev => {
            const item = prev.find(m => m.id === id);
            if (item) URL.revokeObjectURL(item.preview);
            return prev.filter(m => m.id !== id);
        });
    };

    const handleCreateLink = async () => {
        if (!productName.trim()) {
            setError('Please enter a product name');
            return;
        }
        if (!price.trim()) {
            setError('Please enter a price');
            return;
        }
        if (media.length === 0) {
            setError('Please add at least one image or video');
            return;
        }

        setIsCreating(true);
        setError(null);

        // Simulate API call to create post and get checkout link
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Generate a mock product ID and checkout link
        const postId = Date.now();
        const checkoutLink = `https://sokosnap.app/p/${postId}`;

        setCreatedLink(checkoutLink);
        setIsCreating(false);

        // Notify parent
        onPostCreated({
            id: postId,
            name: productName,
            description,
            price: parseInt(price, 10) || 0,
            media,
            checkoutLink,
            createdAt: new Date()
        });
    };

    const copyLink = async () => {
        if (!createdLink) return;

        try {
            await navigator.clipboard.writeText(createdLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const canCreate = productName.trim() && price.trim() && media.length > 0;

    return (
        <div className="min-h-[100dvh] w-full bg-slate-50 text-slate-900 flex flex-col">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
                <div className="flex items-center justify-between px-4 py-4">
                    <button
                        onClick={onBack}
                        className="p-2 -ml-2 text-slate-500 hover:text-slate-900 transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-sm font-black uppercase tracking-wider">Create Post</h1>
                    <div className="w-10" /> {/* Spacer */}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto pb-32">
                <div className="p-4 space-y-6">

                    {/* Media Upload Section */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Media ({media.length}/{MAX_VIDEOS + MAX_IMAGES})
                        </label>

                        {/* Media Preview Grid */}
                        {media.length > 0 && (
                            <div className="grid grid-cols-3 gap-2">
                                {media.map((item) => (
                                    <div key={item.id} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                                        {item.type === 'video' ? (
                                            <video
                                                src={item.preview}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <img
                                                src={item.preview}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                        {/* Type Badge */}
                                        <div className="absolute top-1 left-1 bg-black/50 backdrop-blur-sm rounded-md px-1.5 py-0.5">
                                            {item.type === 'video' ? (
                                                <span className="text-[8px] font-bold text-white/90">
                                                    {item.duration ? `${Math.round(item.duration)}s` : 'VID'}
                                                </span>
                                            ) : (
                                                <ImageIcon size={10} className="text-white/90" />
                                            )}
                                        </div>
                                        {/* Remove Button */}
                                        <button
                                            onClick={() => removeMedia(item.id)}
                                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-sm"
                                        >
                                            <X size={12} className="text-white" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Upload Buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => videoInputRef.current?.click()}
                                disabled={videoCount >= MAX_VIDEOS}
                                className="flex-1 py-4 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center gap-2 hover:border-yellow-400 hover:bg-yellow-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-white"
                            >
                                <Video size={24} className="text-slate-400 hover:text-yellow-500" />
                                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                    Video ({videoCount}/{MAX_VIDEOS})
                                </span>
                                <span className="text-[8px] text-slate-400">Max {MAX_VIDEO_DURATION}s each</span>
                            </button>
                            <button
                                onClick={() => imageInputRef.current?.click()}
                                disabled={imageCount >= MAX_IMAGES}
                                className="flex-1 py-4 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center gap-2 hover:border-yellow-400 hover:bg-yellow-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-white"
                            >
                                <ImageIcon size={24} className="text-slate-400 hover:text-yellow-500" />
                                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                    Image ({imageCount}/{MAX_IMAGES})
                                </span>
                            </button>
                        </div>

                        {/* Hidden Inputs */}
                        <input
                            ref={videoInputRef}
                            type="file"
                            accept="video/*"
                            multiple
                            className="hidden"
                            onChange={handleVideoUpload}
                        />
                        <input
                            ref={imageInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleImageUpload}
                        />
                    </div>

                    {/* Product Name */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Product Name *
                        </label>
                        <input
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            placeholder="e.g., Air Jordan 1 Retro High"
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none transition-all shadow-sm"
                        />
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Price (KES) *
                        </label>
                        <input
                            type="number"
                            inputMode="numeric"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="e.g., 4500"
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none transition-all shadow-sm"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe your product... #sneakers #fashion #kenya"
                            rows={4}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none transition-all resize-none shadow-sm"
                        />
                        <p className="text-[9px] text-slate-400">You can use #hashtags in your description</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                            <AlertCircle size={16} className="text-red-500 shrink-0" />
                            <span className="text-xs text-red-600 font-medium">{error}</span>
                        </div>
                    )}

                    {/* Created Link Display */}
                    {createdLink && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-3">
                            <div className="flex items-center gap-2">
                                <Link2 size={16} className="text-emerald-600" />
                                <span className="text-xs font-black uppercase tracking-wider text-emerald-600">
                                    Checkout Link Created!
                                </span>
                            </div>
                            <div className="flex items-center gap-2 bg-white border border-emerald-100 rounded-lg px-3 py-2 shadow-sm">
                                <span className="flex-1 text-xs text-slate-600 truncate font-mono">
                                    {createdLink}
                                </span>
                                <button
                                    onClick={copyLink}
                                    className="shrink-0 p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg transition-colors"
                                >
                                    {copied ? (
                                        <Check size={14} />
                                    ) : (
                                        <Copy size={14} />
                                    )}
                                </button>
                            </div>
                            <p className="text-[9px] text-emerald-600/70">
                                Share this link on TikTok, Instagram, or any platform!
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Action Button */}
            <div className="fixed bottom-0 left-0 right-0 md:max-w-[var(--app-max-width)] mx-auto p-4 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent">
                <button
                    onClick={handleCreateLink}
                    disabled={!canCreate || isCreating || !!createdLink}
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-yellow-400/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:from-yellow-300 hover:to-yellow-400 transition-all border border-yellow-400/50"
                >
                    {isCreating ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            Creating...
                        </>
                    ) : createdLink ? (
                        <>
                            <Check size={16} />
                            Link Created
                        </>
                    ) : (
                        <>
                            <Link2 size={16} />
                            Create Checkout Link
                        </>
                    )}
                </button>
                <div className="h-[env(safe-area-inset-bottom)]" />
            </div>
        </div>
    );
};
