import React, { useState, useEffect } from 'react';
import {
    X, Upload, Loader2, ChevronRight,
    Image as ImageIcon, Video, Tag,
    Type, Sparkles, Smartphone, Eye,
    AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const productSchema = z.object({
    name: z.string().min(1, "Product Title is required"),
    price: z.string().min(1, "Price is required"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    category: z.string(),
    stock: z.string().min(1, "Stock quantity is required"),
    condition: z.string(),
    returnPolicy: z.string().min(1, "Return policy is required"),
    images: z.array(z.any()).min(1, "At least one image is required"),
    videos: z.array(z.any()),
    tags: z.array(z.string())
});

type ProductFormData = z.infer<typeof productSchema>;

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (product: any) => void;
    initialData?: any;
    type?: 'product' | 'service' | 'ticket';
    isDarkMode?: boolean;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onSubmit, initialData, type = 'product', isDarkMode = false }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'details' | 'media' | 'settings'>('details');

    const { control, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: '',
            price: '',
            description: '',
            category: 'fashion',
            stock: '1',
            condition: 'new',
            returnPolicy: 'No Returns',
            images: [],
            videos: [],
            tags: []
        }
    });

    const formData = watch();

    // Load initial data (e.g. from Smart Scan)
    useEffect(() => {
        if (initialData && isOpen) {
            reset({
                name: initialData.name || '',
                price: initialData.price || '',
                description: initialData.description || '',
                category: initialData.category || 'fashion',
                stock: initialData.stock || '1',
                condition: initialData.condition || 'new',
                returnPolicy: initialData.returnPolicy || 'No Returns',
                images: initialData.image ? [initialData.image] : [],
                videos: [],
                tags: []
            });

            // Include generated images if available
            if (initialData.generatedImages && initialData.generatedImages.length > 0) {
                const allImages = [initialData.image, ...initialData.generatedImages].filter(Boolean);
                setValue('images', allImages);
            }

        } else if (!isOpen) {
            reset({
                name: '', price: '', description: '',
                category: 'fashion', stock: '1', condition: 'new',
                returnPolicy: 'No Returns',
                images: [], videos: [], tags: []
            });
            setActiveTab('details');
        }
    }, [initialData, isOpen, reset, setValue]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setValue('images', [...formData.images, ...newFiles].slice(0, 8));
        }
    };

    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setValue('videos', [...formData.videos, ...newFiles].slice(0, 2));
        }
    };

    const removeMedia = (mediaType: 'images' | 'videos', index: number) => {
        if (mediaType === 'images') {
            setValue('images', formData.images.filter((_, i) => i !== index));
        } else {
            setValue('videos', formData.videos.filter((_, i) => i !== index));
        }
    };

    const handleFormSubmit = async (data: ProductFormData) => {
        setIsLoading(true);
        // Simulate robust API call with validation
        setTimeout(() => {
            onSubmit(data);
            setIsLoading(false);
            onClose();
        }, 1500);
    };

    const getPreviewImage = () => {
        if (formData.images.length > 0) {
            const img = formData.images[0];
            if (!img) return 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&h=400&q=80';
            return typeof img === 'string' ? img : URL.createObjectURL(img);
        }
        return 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&h=400&q=80';
    };

    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8 bg-black/60 backdrop-blur-md ${isDarkMode ? 'dark' : ''}`}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-white w-full max-w-7xl h-[95vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row"
            >
                {/* LEFT COLUMN - Form Input */}
                <div className="flex-1 flex flex-col h-full bg-white dark:bg-zinc-950 border-r border-gray-200 dark:border-zinc-800">

                    {/* Header */}
                    <div className="p-6 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center bg-white dark:bg-zinc-900 z-10 transition-colors">
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight capitalize">New {type} Link</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Create a high-converting listing</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                            <X size={24} className="text-gray-500 dark:text-gray-400" />
                        </button>
                    </div>

                    {/* Progress Tabs */}
                    <div className="px-6 pt-4 pb-0 bg-white dark:bg-zinc-900 transition-colors">
                        <div className="flex gap-6 border-b border-gray-100 dark:border-zinc-800">
                            {[
                                { id: 'details', label: 'Details', icon: Type },
                                { id: 'media', label: 'Media', icon: ImageIcon },
                                { id: 'settings', label: 'Settings', icon: Tag }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`pb-4 flex items-center gap-2 text-sm font-bold border-b-2 transition-all ${activeTab === tab.id
                                        ? 'border-yellow-500 text-yellow-600 dark:text-yellow-500'
                                        : 'border-transparent text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
                                        }`}
                                >
                                    <tab.icon size={16} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Scrollable Form Content */}
                    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8 custom-scrollbar bg-white dark:bg-zinc-950 transition-colors">
                        <AnimatePresence mode='wait'>
                            {activeTab === 'details' && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                                    className="space-y-6"
                                    key="details"
                                >
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Product Title</label>
                                        <div className="relative">
                                            <Controller
                                                name="name"
                                                control={control}
                                                render={({ field }) => (
                                                    <input
                                                        {...field}
                                                        type="text"
                                                        placeholder="e.g. Vintage Denim Jacket"
                                                        className={`w-full pl-4 pr-10 py-4 bg-white dark:bg-zinc-900 border ${errors.name ? 'border-red-500' : 'border-gray-200 dark:border-zinc-800'} rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none text-lg font-medium text-gray-900 dark:text-white transition-all`}
                                                    />
                                                )}
                                            />
                                            <Type className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        </div>
                                        {errors.name && <p className="text-red-500 text-xs font-bold flex items-center gap-1"><AlertCircle size={10} /> {errors.name.message}</p>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Price (KES)</label>
                                            <Controller
                                                name="price"
                                                control={control}
                                                render={({ field }) => (
                                                    <input
                                                        {...field}
                                                        type="number"
                                                        placeholder="0.00"
                                                        className={`w-full px-4 py-4 bg-white dark:bg-zinc-900 border ${errors.price ? 'border-red-500' : 'border-gray-200 dark:border-zinc-800'} rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none text-lg font-medium text-gray-900 dark:text-white`}
                                                    />
                                                )}
                                            />
                                            {errors.price && <p className="text-red-500 text-xs font-bold flex items-center gap-1"><AlertCircle size={10} /> {errors.price.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Stock Qty</label>
                                            <Controller
                                                name="stock"
                                                control={control}
                                                render={({ field }) => (
                                                    <input
                                                        {...field}
                                                        type="number"
                                                        className={`w-full px-4 py-4 bg-white dark:bg-zinc-900 border ${errors.stock ? 'border-red-500' : 'border-gray-200 dark:border-zinc-800'} rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none text-lg font-medium text-gray-900 dark:text-white`}
                                                    />
                                                )}
                                            />
                                            {errors.stock && <p className="text-red-500 text-xs font-bold flex items-center gap-1"><AlertCircle size={10} /> {errors.stock.message}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex justify-between">
                                            Description
                                            <span className="text-xs text-yellow-600 cursor-pointer flex items-center gap-1">
                                                <Sparkles size={12} /> {formData.description ? 'Auto-Enhance' : 'Auto-Generate'}
                                            </span>
                                        </label>
                                        <Controller
                                            name="description"
                                            control={control}
                                            render={({ field }) => (
                                                <textarea
                                                    {...field}
                                                    placeholder="Describe the key features, condition, and material..."
                                                    className={`w-full p-4 bg-white dark:bg-zinc-900 border ${errors.description ? 'border-red-500' : 'border-gray-200 dark:border-zinc-800'} rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none text-base font-medium text-gray-900 dark:text-white min-h-[160px] resize-none`}
                                                />
                                            )}
                                        />
                                        {errors.description && <p className="text-red-500 text-xs font-bold flex items-center gap-1"><AlertCircle size={10} /> {errors.description.message}</p>}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'media' && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                                    className="space-y-8"
                                    key="media"
                                >
                                    {/* Validated/Selected Images Grid */}
                                    <div>
                                        <div className="flex justify-between items-end mb-3">
                                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Gallery ({formData.images.length}/8)</label>
                                        </div>
                                        <div className="grid grid-cols-4 gap-3">
                                            {formData.images.map((img, i) => (
                                                <div key={i} className="aspect-square relative group rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-800 shadow-sm">
                                                    <img
                                                        src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                                                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                                        alt="upload"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeMedia('images', i)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                            <label className={`aspect-square rounded-xl border-2 border-dashed ${errors.images ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-zinc-700'} flex flex-col items-center justify-center cursor-pointer hover:border-yellow-500 hover:bg-yellow-50 dark:hover:bg-zinc-800 transition-all group`}>
                                                <div className="p-3 bg-gray-100 dark:bg-zinc-800 rounded-full group-hover:bg-white dark:group-hover:bg-zinc-700 transition-colors">
                                                    <Upload size={20} className="text-gray-400 group-hover:text-yellow-500" />
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-400 mt-2 uppercase">Add Image</span>
                                                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                                            </label>
                                        </div>
                                        {errors.images && <p className="text-red-500 text-xs font-bold flex items-center gap-1 mt-2"><AlertCircle size={10} /> {errors.images.message as string}</p>}
                                    </div>

                                    {/* Video Section */}
                                    <div>
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 block">Product Video</label>
                                        <div className="p-6 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 text-center hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
                                            {formData.videos.length > 0 && formData.videos[0] ? (
                                                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-100 dark:border-blue-800">
                                                    <Video className="text-blue-500" />
                                                    <span className="text-sm font-medium flex-1 text-left text-blue-900 dark:text-blue-200">
                                                        {formData.videos[0].name}
                                                    </span>
                                                    <button type="button" onClick={() => removeMedia('videos', 0)}>
                                                        <X size={16} className="text-blue-400 hover:text-blue-600 dark:text-blue-300" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <label className="cursor-pointer block">
                                                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                                        <Video size={24} />
                                                    </div>
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white">Click to upload video</p>
                                                    <p className="text-xs text-gray-400 mt-1">MP4, WEBM up to 50MB</p>
                                                    <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'settings' && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                                    className="space-y-6"
                                    key="settings"
                                >
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Category</label>
                                        <Controller
                                            name="category"
                                            control={control}
                                            render={({ field }) => (
                                                <select
                                                    {...field}
                                                    className="w-full p-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none font-medium appearance-none text-gray-900 dark:text-white"
                                                >
                                                    <option value="fashion">Fashion & Apparel</option>
                                                    <option value="electronics">Electronics</option>
                                                    <option value="home">Home & Living</option>
                                                    <option value="beauty">Beauty & Care</option>
                                                </select>
                                            )}
                                        />
                                    </div>

                                    {/* Return Policy Field */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Return Policy</label>
                                        <Controller
                                            name="returnPolicy"
                                            control={control}
                                            render={({ field }) => (
                                                <select
                                                    {...field}
                                                    className="w-full p-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none font-medium appearance-none text-gray-900 dark:text-white"
                                                >
                                                    <option value="No Returns">No Returns</option>
                                                    <option value="7 Days">7 Days Return</option>
                                                    <option value="14 Days">14 Days Return</option>
                                                    <option value="30 Days">30 Days Return</option>
                                                </select>
                                            )}
                                        />
                                        {errors.returnPolicy && <p className="text-red-500 text-xs font-bold flex items-center gap-1"><AlertCircle size={10} /> {errors.returnPolicy.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Condition</label>
                                        <div className="flex gap-3">
                                            {['new', 'like-new', 'good', 'fair'].map(c => (
                                                <button
                                                    key={c}
                                                    type="button"
                                                    onClick={() => setValue('condition', c)}
                                                    className={`px-4 py-2 rounded-lg border text-sm font-bold capitalize transition-all ${formData.condition === c
                                                        ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                                                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 dark:bg-zinc-900 dark:text-gray-400 dark:border-zinc-700 dark:hover:border-zinc-600'
                                                        }`}
                                                >
                                                    {c.replace('-', ' ')}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex justify-between">
                                            SEO Tags
                                            <span className="text-xs text-gray-400 font-normal">Separate with Enter</span>
                                        </label>
                                        <div className="p-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl min-h-[50px] flex flex-wrap gap-2">
                                            {/* Fake tags for visualization */}
                                            {['viral', 'trending', 'sale'].map(tag => (
                                                <span key={tag} className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-xs font-bold rounded-md flex items-center gap-1">
                                                    #{tag} <X size={10} className="cursor-pointer" />
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 z-10">
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-4 rounded-full font-bold text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit(handleFormSubmit)} // Trigger validation on click
                                className="flex-1 py-4 bg-yellow-500 hover:bg-yellow-400 text-black text-sm rounded-full font-black capitalize tracking-wide hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2"
                            >
                                {isLoading ? <Loader2 className="animate-spin" /> : (
                                    <>
                                        <span>Generate {type} Link</span>
                                        <ChevronRight size={18} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN - Live Preview (Hidden on mobile) */}
                <div className="hidden lg:flex w-[400px] bg-gray-100 dark:bg-zinc-950 p-8 flex-col items-center justify-center border-l border-gray-200 dark:border-zinc-800">
                    <div className="w-[320px] h-[640px] bg-white rounded-[40px] shadow-2xl border-[8px] border-zinc-900 overflow-hidden relative">
                        {/* Mobile Status Bar Simulation */}
                        <div className="h-6 w-full bg-zinc-900 absolute top-0 left-0 z-20 flex justify-between px-6 items-center">
                            <span className="text-[10px] text-white font-medium">9:41</span>
                            <div className="flex gap-1">
                                <div className="w-3 h-3 bg-white rounded-full opacity-20"></div>
                                <div className="w-3 h-3 bg-white rounded-full"></div>
                            </div>
                        </div>

                        {/* App Content */}
                        <div className="mt-6 h-full overflow-y-auto pb-20 custom-scrollbar">
                            <div className="relative aspect-[4/5] bg-gray-200">
                                <img
                                    src={getPreviewImage()}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold">
                                    {formData.condition}
                                </div>
                            </div>

                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-black text-xl text-gray-900 leading-tight">
                                        {formData.name || 'Product Title'}
                                    </h3>
                                    <div className="flex flex-col items-end">
                                        <span className="text-lg font-bold text-gray-900">
                                            KSh {Number(formData.price).toLocaleString() || '0'}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
                                    {formData.description || 'Product description will appear here...'}
                                </p>

                                <div className="mt-6 flex gap-2">
                                    <button className="flex-1 py-3 bg-zinc-900 text-white rounded-xl font-bold text-sm shadow-lg">
                                        Add to Cart
                                    </button>
                                    <button className="p-3 bg-gray-100 rounded-xl">
                                        <Smartphone size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Floating "Live Preview" Badge */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/80 backdrop-blur-md rounded-full text-white text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 pointer-events-none">
                            <Eye size={12} /> Live Preview
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
