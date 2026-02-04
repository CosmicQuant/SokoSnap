import React, { useState, useEffect } from 'react';
import {
    X, Upload, Loader2, ChevronRight,
    Image as ImageIcon, Video,
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
    videos: z.array(z.any())
}).refine(data => data.images.length > 0 || data.videos.length > 0, {
    message: "At least one media file (image or video) is required",
    path: ["images"]
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
    const [activeTab, setActiveTab] = useState<'details' | 'media'>('media');

    const { control, handleSubmit, setValue, watch, setError, clearErrors, reset, formState: { errors } } = useForm<ProductFormData>({
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
            videos: []
        }
    });

    const formData = watch();

    // Validation Checks for Blocking Steps
    const isMediaValid = formData.images.length > 0 || formData.videos.length > 0;

    // Explicitly typed tabId to match state
    const handleTabChange = (tabId: 'media' | 'details') => {
        if (tabId === 'details') {
            if (!isMediaValid) {
                setError('images', { type: 'manual', message: 'Please upload at least one image or video first' });
                return;
            }
            clearErrors('images');
        }

        setActiveTab(tabId);
    };

    const handleGenerateDescription = async () => {
        if (!formData.name) {
            setError('name', { type: 'manual', message: 'Please enter a Product Title to generate a description' });
            // meaningful focus would ideally happen here, but error message is good enough for now
            return;
        }

        setIsLoading(true);
        // Professional Optimized Prompt Logic (Mocked)
        const prompt = `Act as an expert copywriter. Write a high-converting sales description for a product titled "${formData.name}". 
        Category: ${formData.category}. Condition: ${formData.condition}.
        Include:
        - Hook: Grabs attention immediately.
        - Benefits: Why they need this.
        - Urgency: Limited availability.
        - Call to Action: Buy now.
        Keep it concise (under 150 words) and formatted with emojis.`;

        console.log("Generating with prompt:", prompt);

        // Simulate AI Delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        const generatedDesc = `✨ ${formData.name} - ${formData.condition === 'new' ? 'Brand New!' : 'Great Condition!'} ✨\n\nUpgrade your game with this stunning ${formData.name}. Designed for quality and style, it's the perfect addition to your ${formData.category} collection.\n\n🔥 Why you need this:\n✅ Premium materials & durability\n✅ Stylish modern design\n✅ Best value for money\n\n⏳ Hurry! Only ${formData.stock} left in stock.\n\n👉 Tap 'Add to Cart' now before it's gone! 🚀`;

        setValue('description', generatedDesc, { shouldValidate: true });
        setIsLoading(false);
        clearErrors('description');
    };

    // Load initial data (e.g. from Smart Scan OR Edit Mode)
    useEffect(() => {
        if (initialData && isOpen) {
            // Handle Images: Can be File objects (SmartScan) or URL strings (Edit Mode)
            let loadedImages: any[] = [];

            if (initialData.images && Array.isArray(initialData.images)) {
                loadedImages = initialData.images;
            } else if (initialData.img) {
                loadedImages = [initialData.img];
            } else if (initialData.image instanceof File) {
                loadedImages = [initialData.image];
            }

            reset({
                name: initialData.name || '',
                price: initialData.price ? String(initialData.price) : '',
                description: initialData.description || '',
                category: initialData.category || 'fashion',
                stock: initialData.stock ? String(initialData.stock) : '1',
                condition: initialData.condition || 'new',
                returnPolicy: initialData.returnPolicy || 'No Returns',
                images: loadedImages,
                videos: []
            });
        } else if (!isOpen) {
            reset({
                name: '', price: '', description: '',
                category: 'fashion', stock: '1', condition: 'new',
                returnPolicy: 'No Returns',
                images: [], videos: []
            });
            setActiveTab('media');
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

    const handleNextClick = async () => {
        if (activeTab === 'media') {
            if (!isMediaValid) {
                setError('images', { type: 'manual', message: 'Please upload at least one image or video first' });
                return;
            }
            clearErrors('images');
            setActiveTab('details');
        } else {
            handleSubmit(handleFormSubmit)();
        }
    };

    const getPreviewImage = () => {
        if (formData.images.length > 0) {
            const img = formData.images[0];
            if (!img) return 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&h=400&q=80';

            // Handle File Object (create temp URL) or String URL
            if (img instanceof File) {
                return URL.createObjectURL(img);
            }
            return typeof img === 'string' ? img : 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&h=400&q=80';
        }
        return 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&h=400&q=80';
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className={`fixed inset-0 z-[100] flex items-end lg:items-center justify-center lg:p-8 bg-black/60 backdrop-blur-md ${isDarkMode ? 'dark' : ''}`}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 100 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 100 }}
                        className={`text-gray-900 dark:text-white w-full lg:max-w-7xl h-[92vh] lg:h-[95vh] rounded-t-[2.5rem] lg:rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row ${isDarkMode ? 'bg-zinc-900' : 'bg-white'}`}
                    >
                        {/* LEFT COLUMN - Form Input */}
                        <div className={`flex-1 flex flex-col h-full border-r border-gray-200 dark:border-zinc-800 ${isDarkMode ? 'bg-zinc-950' : 'bg-white'}`}>

                            {/* Header */}
                            <div className={`p-6 border-b z-10 transition-colors ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'}`}>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className={`text-2xl font-black tracking-tight capitalize ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {initialData?.id ? 'Edit' : 'New'} {type} Link
                                        </h2>
                                        <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {initialData?.id ? 'Update your listing details' : 'Create a high-converting listing'}
                                        </p>
                                    </div>
                                    <button onClick={onClose} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-gray-100'}`}>
                                        <X size={24} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                                    </button>
                                </div>
                            </div>

                            {/* Progress Tabs */}
                            <div className={`px-6 pt-4 pb-0 transition-colors ${isDarkMode ? 'bg-zinc-900' : 'bg-white'}`}>
                                <div className={`flex gap-6 border-b ${isDarkMode ? 'border-zinc-800' : 'border-gray-100'}`}>
                                    {[
                                        { id: 'media', label: 'Media', icon: ImageIcon },
                                        { id: 'details', label: 'Details', icon: Type }
                                    ].map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => handleTabChange(tab.id as any)}
                                            className={`pb-4 flex items-center gap-2 text-sm font-bold border-b-2 transition-all ${activeTab === tab.id
                                                ? `border-yellow-500 ${isDarkMode ? 'text-yellow-500' : 'text-yellow-600'}`
                                                : `border-transparent ${isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`
                                                }`}
                                        >
                                            <tab.icon size={16} />
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Scrollable Form Content */}
                            <form onSubmit={handleSubmit(handleFormSubmit)} className={`flex-1 overflow-y-auto no-scrollbar p-6 lg:p-8 space-y-8 transition-colors ${isDarkMode ? 'bg-zinc-950' : 'bg-white'}`}>
                                <AnimatePresence mode='wait'>
                                    {activeTab === 'media' && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                                            className="space-y-8"
                                            key="media"
                                        >
                                            {/* Validated/Selected Images Grid */}
                                            <div>
                                                <div className="flex justify-between items-end mb-3">
                                                    <label className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Gallery ({formData.images.length}/8)</label>
                                                </div>
                                                <div className="grid grid-cols-4 gap-3">
                                                    {formData.images.map((img, i) => (
                                                        <div key={i} className={`aspect-square relative group rounded-xl overflow-hidden shadow-sm ${isDarkMode ? 'border-zinc-800' : 'border-gray-200'} border`}>
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
                                                    <label className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:border-yellow-500 transition-all group ${errors.images ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : (isDarkMode ? 'border-zinc-700 hover:bg-zinc-800' : 'border-gray-300 hover:bg-yellow-50')}`}>
                                                        <div className={`p-3 rounded-full transition-colors ${isDarkMode ? 'bg-zinc-800 group-hover:bg-zinc-700' : 'bg-gray-100 group-hover:bg-white'}`}>
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
                                                <label className={`text-sm font-bold mb-3 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Product Video</label>
                                                <div className={`p-6 border-2 border-dashed rounded-2xl text-center transition-colors ${isDarkMode ? 'border-zinc-800 bg-zinc-900 hover:bg-zinc-800' : 'border-gray-200 bg-white hover:bg-slate-50'}`}>
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
                                                            <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Click to upload video</p>
                                                            <p className="text-xs text-gray-400 mt-1">MP4, WEBM up to 50MB</p>
                                                            <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
                                                        </label>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === 'details' && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                                            className="space-y-6"
                                            key="details"
                                        >
                                            <div className="space-y-2">
                                                <label className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Product Title</label>
                                                <div className="relative">
                                                    <Controller
                                                        name="name"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <input
                                                                {...field}
                                                                type="text"
                                                                placeholder="e.g. Vintage Denim Jacket"
                                                                className={`w-full pl-4 pr-10 py-4 border rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none text-lg font-medium transition-all ${isDarkMode ? 'bg-zinc-900 text-white border-zinc-800' : 'bg-white text-gray-900 border-gray-200'} ${errors.name ? 'border-red-500' : ''}`}
                                                            />
                                                        )}
                                                    />
                                                    <Type className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                                </div>
                                                {errors.name && <p className="text-red-500 text-xs font-bold flex items-center gap-1"><AlertCircle size={10} /> {errors.name.message}</p>}
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Price (KES)</label>
                                                    <Controller
                                                        name="price"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <input
                                                                {...field}
                                                                type="number"
                                                                placeholder="0.00"
                                                                className={`w-full px-4 py-4 border rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none text-lg font-medium ${isDarkMode ? 'bg-zinc-900 text-white border-zinc-800' : 'bg-white text-gray-900 border-gray-200'} ${errors.price ? 'border-red-500' : ''}`}
                                                            />
                                                        )}
                                                    />
                                                    {errors.price && <p className="text-red-500 text-xs font-bold flex items-center gap-1"><AlertCircle size={10} /> {errors.price.message}</p>}
                                                </div>
                                                <div className="space-y-2">
                                                    <label className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Stock Qty</label>
                                                    <Controller
                                                        name="stock"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <input
                                                                {...field}
                                                                type="number"
                                                                className={`w-full px-4 py-4 border rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none text-lg font-medium ${isDarkMode ? 'bg-zinc-900 text-white border-zinc-800' : 'bg-white text-gray-900 border-gray-200'} ${errors.stock ? 'border-red-500' : ''}`}
                                                            />
                                                        )}
                                                    />
                                                    {errors.stock && <p className="text-red-500 text-xs font-bold flex items-center gap-1"><AlertCircle size={10} /> {errors.stock.message}</p>}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className={`text-sm font-bold flex justify-between ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    Description
                                                    <button
                                                        type="button"
                                                        onClick={handleGenerateDescription}
                                                        className="text-xs text-yellow-600 hover:text-yellow-500 cursor-pointer flex items-center gap-1 transition-colors"
                                                    >
                                                        {isLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                                        {formData.description ? 'Auto-Enhance' : 'Auto-Generate'}
                                                    </button>
                                                </label>
                                                <Controller
                                                    name="description"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <textarea
                                                            {...field}
                                                            placeholder="Describe the key features, condition, and material..."
                                                            className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none text-base font-medium min-h-[160px] resize-none ${isDarkMode ? 'bg-zinc-900 text-white border-zinc-800' : 'bg-white text-gray-900 border-gray-200'} ${errors.description ? 'border-red-500' : ''}`}
                                                        />
                                                    )}
                                                />
                                                {errors.description && <p className="text-red-500 text-xs font-bold flex items-center gap-1"><AlertCircle size={10} /> {errors.description.message}</p>}
                                            </div>

                                            {/* Merged Settings Fields */}
                                            <div className="space-y-2">
                                                <label className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Category</label>
                                                <Controller
                                                    name="category"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <select
                                                            {...field}
                                                            className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none font-medium appearance-none ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                                        >
                                                            <option value="fashion">Fashion & Apparel</option>
                                                            <option value="electronics">Electronics</option>
                                                            <option value="home">Home & Living</option>
                                                            <option value="beauty">Beauty & Care</option>
                                                        </select>
                                                    )}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Return Policy</label>
                                                <Controller
                                                    name="returnPolicy"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <select
                                                            {...field}
                                                            className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none font-medium appearance-none ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                                        >
                                                            <option value="No Returns">No Returns</option>
                                                            <option value="7 Days">7 Days Return</option>
                                                            <option value="14 Days">14 Days Return</option>
                                                            <option value="30 Days">30 Days Return</option>
                                                        </select>
                                                    )}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Condition</label>
                                                <div className="flex gap-3">
                                                    {['new', 'like-new', 'good', 'fair'].map(c => (
                                                        <button
                                                            key={c}
                                                            type="button"
                                                            onClick={() => setValue('condition', c)}
                                                            className={`px-4 py-2 rounded-lg border text-sm font-bold capitalize transition-all ${formData.condition === c
                                                                ? (isDarkMode ? 'bg-white text-black border-white' : 'bg-black text-white border-black')
                                                                : (isDarkMode ? 'bg-zinc-900 text-gray-400 border-zinc-700 hover:border-zinc-600' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300')
                                                                }`}
                                                        >
                                                            {c.replace('-', ' ')}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                </AnimatePresence>
                            </form>

                            {/* Footer Actions */}
                            <div className={`p-6 border-t z-10 ${isDarkMode ? 'border-zinc-800 bg-zinc-900' : 'border-gray-200 bg-white'}`}>
                                <div className="flex gap-4">
                                    <button
                                        onClick={handleNextClick}
                                        className="flex-1 py-4 bg-yellow-500 hover:bg-yellow-400 text-black text-sm rounded-full font-black capitalize tracking-wide hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? <Loader2 className="animate-spin" /> : (
                                            <>
                                                <span>{activeTab === 'details' ? (initialData?.id ? `Edit ${type} Link` : `Generate ${type} Link`) : 'Next'}</span>
                                                <ChevronRight size={18} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN - Live Preview (Hidden on mobile) */}
                        <div className={`hidden lg:flex w-[400px] p-8 flex-col items-center justify-center border-l ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-gray-100 border-gray-200'}`}>
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
            )}
        </AnimatePresence>
    );
};
