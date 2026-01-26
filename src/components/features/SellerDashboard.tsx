import React, { useState, useRef, useEffect } from 'react';
import {
    Plus,
    Wallet,
    TrendingUp,
    Package,
    Share2,
    Copy,
    CheckCircle2,
    ShieldCheck,
    Eye,
    MousePointer2,
    X,
    Smartphone,
    Trash2,
    ArrowLeft,
    Clock,
    Truck,
    Box,
    Lock,
    Pencil,
    Menu,
    LogOut,
    User,
    LayoutDashboard,
    MapPin,
    CreditCard,
    MessageCircle,
    Instagram,
    Facebook,
    Store,
    Mail
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useSellerStore } from '../../store/sellerStore';
import { LinkItem, Order } from '../../types';
import { formatCompactNumber } from '../../utils/formatters';

interface StatCardProps {
    label: string;
    value: string;
    sub?: string;
    icon: React.ReactNode;
    color: string;
    onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, sub, icon, color, onClick }) => (
    <div onClick={onClick} className={`h-full bg-white border border-slate-100 p-3 sm:p-4 rounded-[1.5rem] relative overflow-hidden shadow-sm ${onClick ? 'cursor-pointer active:scale-95 transition-transform' : ''}`}>
        <div className={`absolute -right-4 -top-4 opacity-10 text-${color}-600 scale-75`}>{icon}</div>
        <p className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 sm:mb-2 truncate">{label}</p>
        <h3 className="text-lg sm:text-2xl font-black text-slate-900 italic tracking-tighter truncate">{value}</h3>
        {sub && <p className={`text-[8px] sm:text-[9px] font-bold mt-0.5 sm:mt-1 uppercase tracking-wide text-${color}-600 truncate`}>{sub}</p>}
    </div>
);

const LinkCard = ({ item, onClick, action }: { item: LinkItem; onClick: () => void; action?: React.ReactNode }) => {
    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Use share functionality suitable for mobile/desktop
        if (navigator.share) {
            navigator.share({
                title: item.name,
                text: `Check out ${item.name} on SokoSnap!`,
                url: window.location.href // In real app, this would be the product link
            }).catch(console.error);
        } else {
            // Fallback to clipboard or alert
            alert(`Link copied: https://sokosnap.com/p/${item.id}`);
        }
    };

    return (
        <div onClick={onClick} className="bg-white border border-slate-100 p-4 rounded-3xl flex items-center gap-4 group active:bg-slate-50 transition-colors shadow-sm cursor-pointer">
            {item.img.includes('mp4') ? (
                <video src={item.img} className="w-16 h-16 rounded-2xl object-cover opacity-90" muted />
            ) : (
                <img src={item.img} className="w-16 h-16 rounded-2xl object-cover opacity-90" alt="product" />
            )}
            <div className="flex-1 min-w-0">
                <h4 className="text-slate-900 font-black text-sm truncate">{item.name}</h4>
                <div className="flex items-center gap-3 mt-2 text-[10px] font-bold text-slate-400">
                    <span className="flex items-center gap-1"><Eye size={12} /> {item.views}</span>
                    <span className="flex items-center gap-1 text-green-600"><Package size={12} /> {item.sales}</span>
                </div>
            </div>
            <div className="text-right">
                <span className="block text-slate-900 font-black italic">KES {(item.revenue / 1000).toFixed(1)}k</span>
                {action ? action : (
                    <button
                        onClick={handleShare}
                        className="bg-yellow-100 p-2 rounded-xl text-yellow-700 mt-1 hover:bg-yellow-200 transition-colors"
                    >
                        <Share2 size={16} />
                    </button>
                )}
            </div>
        </div>
    );

};

const OrderCard = ({ order }: { order: Order }) => {
    // Map status to color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'shipping': return 'bg-blue-100 text-blue-700';
            case 'completed': return 'bg-green-100 text-green-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    // Map status to icon
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock size={12} />;
            case 'shipping': return <Truck size={12} />;
            case 'completed': return <CheckCircle2 size={12} />;
            case 'cancelled': return <X size={12} />;
            default: return <Clock size={12} />;
        }
    };

    // Fallback for image (since Order type doesn't store product image directly anymore)
    const productImg = order.items && order.items[0] ? order.items[0].product.mediaUrl : '';
    const productName = order.items && order.items[0] ? order.items[0].product.name : 'Product';

    return (
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            {productImg.includes('mp4') ? (
                <video src={productImg} className="w-14 h-14 rounded-2xl object-cover bg-slate-100" />
            ) : (
                <img src={productImg} className="w-14 h-14 rounded-2xl object-cover bg-slate-100" />
            )}
            <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                    <h4 className="font-black text-slate-900 text-sm">{order.customerId}</h4>
                    <span className="text-xs font-black text-slate-900">KES {order.amount}</span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 truncate w-40">{productName} • {order.id}</p>
                <div className="flex justify-between items-center mt-2">
                    <span className={`flex items-center gap-1 text-[9px] font-bold uppercase px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)} {order.status}
                    </span>
                    <span className="text-[9px] font-bold text-slate-300">{/* Check date format */}</span>
                </div>
            </div>
        </div>
    );
};

interface SellerDashboardProps {
    onBack: () => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({ onBack }) => {
    // Views: 'hub' | 'payouts' | 'analytics' | 'edit-link' | 'orders'
    const [view, setView] = useState('hub');
    const [selectedLink, setSelectedLink] = useState<LinkItem | null>(null);
    const [ordersFilter, setOrdersFilter] = useState<string | null>(null); // null = all, string = linkId
    const [activeOrderTab, setActiveOrderTab] = useState<'ongoing' | 'completed'>('ongoing');

    // Store Hooks
    const { user, updateUser } = useAuthStore();
    const {
        links,
        orders,
        fetchSellerData,
        createProduct: storeCreateProduct,
        archiveProduct: storeArchiveProduct,
        stopListening
    } = useSellerStore();

    // Fetch data on mount
    useEffect(() => {
        if (user?.id) {
            fetchSellerData(user.id);
        }
        return () => stopListening();
    }, [user?.id]);

    // Profile State
    const [profileData, setProfileData] = useState({
        shopName: user?.shopName || 'My Shop',
        locationName: user?.shopLocation || 'Nairobi',
        contactName: user?.contactPerson || user?.name || '',
        contactPhone: user?.contactPhone || user?.phone || '',
        email: user?.email || '',
        kraPin: 'A00xxxxxxZ', // TODO: Add to User type
        mpesaType: 'personal', // TODO: Add to User type
        mpesaNumber: user?.phone || '',
        tillNumber: '',
        paybillNumber: '',
        accountNumber: '',
        whatsapp: user?.phone || '',
        instagram: '',
        tiktok: '',
        facebook: ''
    });

    const [showGenerator, setShowGenerator] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [qty, setQty] = useState('');
    const [returnPolicy, setReturnPolicy] = useState('exchange_7d');
    const [isEditing, setIsEditing] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Filter links
    const activeLinks = links.filter(l => l.status !== 'archived');
    const archivedLinks = links.filter(l => l.status === 'archived');

    // Stats calculations
    const totalViews = links.reduce((sum, item) => sum + (item.views || 0), 0);
    const totalClicks = links.reduce((sum, item) => sum + (item.clicks || 0), 0);
    
    const safeOrders = orders || [];
    const inHoldAmount = safeOrders
        .filter(o => ['pending', 'shipping'].includes(o.status))
        .reduce((sum, o) => sum + (o.amount || 0), 0);
        
    const payoutAmount = safeOrders
        .filter(o => o.status === 'completed')
        .reduce((sum, o) => sum + (o.amount || 0), 0);

    const totalSalesAmount = safeOrders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + (o.amount || 0), 0);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleCreateNewLink = () => {
        // Reset all form state
        setFiles([]);
        setPreviews([]);
        setProductName('');
        setPrice('');
        setQty('');
        setReturnPolicy('exchange_7d');
        setIsEditing(false);
        setSelectedLink(null);
        setShowGenerator(true);
    };

    const handleGenerate = async () => {
        if (files.length === 0 && !isEditing) {
            alert("Please upload at least one media file.");
            return;
        }
        if (!productName || !price || !qty) {
            alert("Please fill in all product details (Name, Price, and Quantity).");
            return;
        }

        try {
            if (isEditing && selectedLink) {
                // TODO: specific update product action
                alert("Update logic not fully implemented yet.");
            } else {
                if (!user?.id) return;

                await storeCreateProduct({
                    name: productName,
                    price: parseFloat(price),
                    sellerId: user.id,
                    sellerName: profileData.shopName,
                    description: '',
                    // Add other fields as needed
                }, files);

                alert("SokoSnap Link Generated Successfully!");
            }
            setShowGenerator(false);
            setIsEditing(false);

            // Reset form
            setFiles([]);
            setPreviews([]);
            setProductName('');
            setPrice('');
            setQty('');
            setReturnPolicy('exchange_7d');
        } catch (err) {
            alert("Failed to create product. Please try again.");
            console.error(err);
        }
    };

    const handleArchiveProduct = async () => {
        if (!selectedLink) return;

        if (confirm('Are you sure you want to archive this product? It will be moved to the Archived tab.')) {
            await storeArchiveProduct(selectedLink.id.toString());
            alert("Product archived successfully.");
            setShowGenerator(false);
            setView('hub');
        }
    };

    const handleEditLink = () => {
        if (!selectedLink) return;
        setProductName(selectedLink.name);
        setPrice((selectedLink.price || 0).toString());
        setQty("50"); // Mock
        setReturnPolicy('exchange_7d');
        setPreviews([selectedLink.img]);
        setIsEditing(true);
        setShowGenerator(true);
    };

    const validateVideoDuration = (file: File): Promise<boolean> => {
        return new Promise((resolve) => {
            if (!file.type.startsWith('video/')) {
                resolve(true);
                return;
            }
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = () => {
                window.URL.revokeObjectURL(video.src);
                resolve(video.duration <= 60.5);
            };
            video.onerror = () => resolve(false);
            video.src = window.URL.createObjectURL(file);
        });
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(event.target.files || []);
        if (files.length + newFiles.length > 5) {
            alert("Maximum 5 media files allowed");
            return;
        }

        for (const file of newFiles) {
            if (file.type.startsWith('video/')) {
                const isValidDuration = await validateVideoDuration(file);
                if (!isValidDuration) {
                    alert(`Video ${file.name} must be 60 seconds or less`);
                    continue;
                }
            }
            setPreviews(prev => [...prev, URL.createObjectURL(file)]);
            setFiles(prev => [...prev, file]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const filteredOrders = orders.filter(o => {
        const matchesFilter = ordersFilter
            ? o.items.some(i => String(i.product.id) === String(ordersFilter))
            : true;

        const matchesTab = activeOrderTab === 'ongoing'
            ? ['pending', 'shipping'].includes(o.status)
            : ['completed', 'cancelled'].includes(o.status);

        return matchesFilter && matchesTab;
    });

    const CreateLinkModal = () => (
        showGenerator && (
            <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
                <div className="fixed inset-0 bg-slate-900/60 transition-opacity backdrop-blur-sm" onClick={() => setShowGenerator(false)} />

                <div className="relative bg-white w-full sm:max-w-xl h-[95vh] sm:h-[85vh] rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6 shadow-2xl transform transition-all animate-in slide-in-from-bottom duration-300 overflow-y-auto scrollbar-hide flex flex-col" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <div className="flex justify-between items-center mb-6 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="bg-yellow-100 text-yellow-700 p-3 rounded-2xl">
                                {isEditing ? <Pencil size={20} /> : <Plus size={20} />}
                            </div>
                            <div>
                                <h3 className="font-black text-xl text-slate-900">{isEditing ? 'Edit Product' : 'New Product'}</h3>
                                <p className="text-xs font-bold text-slate-400">{isEditing ? 'Update your product details' : 'Generate a SokoSnap secure checkout link'}</p>
                            </div>
                        </div>
                        <button onClick={() => setShowGenerator(false)} className="bg-slate-100 p-2 rounded-full text-slate-400 hover:text-slate-900 transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-6 flex-1">
                        {/* Media Upload Grid - Supports up to 5 items */}
                        <div className="grid grid-cols-3 gap-2">
                            {/* Previews */}
                            {previews.map((src, idx) => (
                                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-100 group">
                                    {files[idx]?.type.startsWith('video') ? (
                                        <video src={src} className="w-full h-full object-cover" />
                                    ) : (
                                        <img src={src} className="w-full h-full object-cover" />
                                    )}
                                    <button
                                        onClick={() => removeFile(idx)}
                                        className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}

                            {/* Upload Button */}
                            {files.length < 5 && (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-yellow-500 hover:bg-yellow-50/50 transition-all text-slate-400 hover:text-yellow-600"
                                >
                                    <Plus size={24} />
                                    <span className="text-[9px] font-bold uppercase">Add</span>
                                </div>
                            )}
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*,video/*"
                            multiple
                            onChange={handleFileUpload}
                        />

                        {files.length === 0 && (
                            <div className="text-center py-4">
                                <p className="text-xs text-slate-400">Upload up to 5 media files photos or videos (Max 60s)</p>
                            </div>
                        )}

                        {/* Pro Tip for Video Length */}
                        <div className="bg-blue-50 p-3 rounded-2xl flex gap-3 items-start border border-blue-100">
                            <div className="bg-blue-100 text-blue-600 p-2 rounded-xl mt-0.5 shadow-sm">
                                <TrendingUp size={14} />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-0.5">
                                    <p className="text-[10px] font-black text-blue-800 uppercase">Pro Tip: Boost Sales</p>
                                    <span className="bg-blue-200 text-blue-700 text-[9px] font-bold px-1.5 rounded-md">3x Conversion</span>
                                </div>
                                <p className="text-xs text-blue-700 leading-snug font-medium">
                                    You can upload up to 60s, but <strong>videos under 15s sell best</strong>. Keep it short and snappy to hook customers fast!
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3 pt-2">
                            <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3 border border-slate-100 focus-within:border-yellow-500 transition-colors">
                                <span className="text-slate-400"><Smartphone size={18} /></span>
                                <input
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                    placeholder="Product Name (e.g. Navy Blue Suit)"
                                    className="bg-transparent w-full text-sm font-bold text-slate-900 placeholder:text-slate-400 outline-none"
                                />
                            </div>

                            <div className="flex gap-4">
                                <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3 border border-slate-100 focus-within:border-yellow-500 transition-colors flex-1">
                                    <span className="text-slate-400 font-bold text-xs">KES</span>
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        placeholder="Price"
                                        className="bg-transparent w-full text-sm font-bold text-slate-900 placeholder:text-slate-400 outline-none"
                                    />
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3 border border-slate-100 focus-within:border-yellow-500 transition-colors w-1/3">
                                    <span className="text-slate-400"><Box size={18} /></span>
                                    <input
                                        type="number"
                                        value={qty}
                                        onChange={(e) => setQty(e.target.value)}
                                        placeholder="Qty"
                                        className="bg-transparent w-full text-sm font-bold text-slate-900 placeholder:text-slate-400 outline-none"
                                    />
                                </div>
                            </div>

                            {/* Return Policy Selection */}
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 focus-within:border-yellow-500 transition-colors">
                                <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Return Policy</label>
                                <select
                                    value={returnPolicy}
                                    onChange={(e) => setReturnPolicy(e.target.value)}
                                    className="bg-transparent w-full text-sm font-bold text-slate-900 outline-none"
                                >
                                    <option value="exchange_7d">7-Day Exchange (The "Fashion" Standard)</option>
                                    <option value="tech_warranty_48h">48hr Tech Warranty (The "Imenti" Standard)</option>
                                    <option value="inspect_accept">Inspect & Accept (The "Mitumba" Standard)</option>
                                    <option value="guarantee_30d">30-Day Guarantee (The "Premium" Standard)</option>
                                    <option value="manufacturer_warranty">Manufacturer Warranty (The "Official" Standard)</option>
                                    <option value="custom_order">Custom & Made-to-Order (The "Fundi" Standard)</option>
                                    <option value="restocking_fee">Restocking Fee Apply (The "Open Box" Standard)</option>
                                    <option value="final_sale">Non-Returnable / Final Sale (The "Hygiene" Standard)</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4 mt-auto">
                            {isEditing && (
                                <button
                                    onClick={handleArchiveProduct}
                                    className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-black text-lg hover:bg-red-50 hover:text-red-500 transition-colors"
                                >
                                    Archive
                                </button>
                            )}
                            <button
                                onClick={handleGenerate}
                                className={`flex-[2] bg-slate-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 active:scale-95`}
                            >
                                {isEditing ? 'Update Link' : 'Generate Link'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    );

    // --- RENDER HELPERS ---

    if (view === 'all-links') {
        return (
            <div className="h-full bg-slate-50 flex flex-col">
                <div className="bg-white px-6 pt-12 pb-4 border-b border-slate-100 flex items-center gap-3 sticky top-0 z-20">
                    <button onClick={() => setView('hub')} className="p-2 -ml-2 rounded-full hover:bg-slate-50"><ArrowLeft size={20} /></button>
                    <h1 className="text-xl font-black text-slate-900">All Links</h1>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Active Links */}
                    <div>
                        <h2 className="text-lg font-black text-slate-900 mb-4">Active</h2>
                        <div className="space-y-3">
                            {activeLinks.map(item => (
                                <LinkCard
                                    key={item.id}
                                    item={item}
                                    onClick={() => {
                                        setSelectedLink(item);
                                        setView('edit-link');
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Archived Links */}
                    <div>
                        <h2 className="text-lg font-black text-slate-900 mb-4 text-slate-400">Archived</h2>
                        <div className="space-y-3 opacity-75">
                            {archivedLinks.map(item => (
                                <LinkCard
                                    key={item.id}
                                    item={item}
                                    onClick={() => { }}
                                    action={
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (confirm('Delete this archived link permanently?')) {
                                                    // setArchivedLinks(prev => prev.filter(l => l.id !== item.id));
                                                    console.warn('Delete not implemented yet');
                                                }
                                            }}
                                            className="bg-red-100 p-2 rounded-xl text-red-600 mt-1 hover:bg-red-200 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    }
                                />
                            ))}
                            {archivedLinks.length === 0 && <p className="text-slate-400 text-sm font-bold italic">No archived links.</p>}
                        </div>
                    </div>
                </div>
                {CreateLinkModal()}
            </div>
        );
    }

    if (view === 'profile') {
        return (
            <div className="h-full bg-slate-50 flex flex-col">
                <div className="bg-white px-6 pt-12 pb-4 border-b border-slate-100 flex items-center gap-3 sticky top-0 z-20">
                    <button onClick={() => setView('hub')} className="p-2 -ml-2 rounded-full hover:bg-slate-50"><ArrowLeft size={20} /></button>
                    <h1 className="text-xl font-black text-slate-900">My Profile</h1>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Profile Header */}
                    <div className="flex items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center text-slate-400 text-2xl">
                            <Store size={32} />
                        </div>
                        <div>
                            <h2 className="font-black text-2xl text-slate-900">{profileData.shopName}</h2>
                            <p className="font-medium text-slate-500">Verified Merchant</p>
                            <button className="text-yellow-600 text-xs font-bold uppercase mt-2">Change Photo</button>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-6">
                        {/* Shop Details */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2">Shop Details</h3>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase ml-2">Shop Name</label>
                                <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                                    <Store size={18} className="text-slate-400" />
                                    <input
                                        value={profileData.shopName}
                                        onChange={(e) => setProfileData({ ...profileData, shopName: e.target.value })}
                                        className="flex-1 outline-none text-slate-900 font-bold"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase ml-2">Location</label>
                                <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                                    <MapPin size={18} className="text-slate-400" />
                                    <input
                                        value={profileData.locationName}
                                        onChange={(e) => setProfileData({ ...profileData, locationName: e.target.value })}
                                        className="flex-1 outline-none text-slate-900 font-bold"
                                    />
                                    <button className="text-xs font-bold text-yellow-600 uppercase">Change</button>
                                </div>
                            </div>
                        </div>

                        {/* Contact Person */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2">Contact Info</h3>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase ml-2">Contact Person</label>
                                <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                                    <User size={18} className="text-slate-400" />
                                    <input
                                        value={profileData.contactName}
                                        onChange={(e) => setProfileData({ ...profileData, contactName: e.target.value })}
                                        className="flex-1 outline-none text-slate-900 font-bold"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase ml-2">Phone Number</label>
                                <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                                    <Smartphone size={18} className="text-slate-400" />
                                    <input
                                        value={profileData.contactPhone}
                                        onChange={(e) => setProfileData({ ...profileData, contactPhone: e.target.value })}
                                        className="flex-1 outline-none text-slate-900 font-bold"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase ml-2">Email Address</label>
                                <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                                    <Mail size={18} className="text-slate-400" />
                                    <input
                                        type="email"
                                        value={profileData.email}
                                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                        className="flex-1 outline-none text-slate-900 font-bold"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Legal */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2">Legal</h3>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase ml-2">KRA PIN</label>
                                <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                                    <ShieldCheck size={18} className="text-slate-400" />
                                    <input
                                        value={profileData.kraPin}
                                        onChange={(e) => setProfileData({ ...profileData, kraPin: e.target.value })}
                                        className="flex-1 outline-none text-slate-900 font-bold uppercase"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2">Payment Details</h3>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase ml-2">Payment Type</label>
                                <div className="flex gap-2">
                                    {['personal', 'till', 'paybill'].map(type => (
                                        <button
                                            key={type}
                                            onClick={() => setProfileData({ ...profileData, mpesaType: type })}
                                            className={`flex-1 py-3 text-xs font-black uppercase rounded-xl border-2 transition-all ${profileData.mpesaType === type
                                                ? 'border-yellow-400 bg-yellow-50 text-slate-900'
                                                : 'border-slate-100 bg-white text-slate-400'
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {profileData.mpesaType === 'personal' && (
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-2">M-Pesa Number</label>
                                    <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                                        <Smartphone size={18} className="text-slate-400" />
                                        <input
                                            value={profileData.mpesaNumber}
                                            onChange={(e) => setProfileData({ ...profileData, mpesaNumber: e.target.value })}
                                            className="flex-1 outline-none text-slate-900 font-bold"
                                        />
                                    </div>
                                </div>
                            )}

                            {profileData.mpesaType === 'till' && (
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-2">Till Number</label>
                                    <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                                        <Store size={18} className="text-slate-400" />
                                        <input
                                            value={profileData.tillNumber}
                                            onChange={(e) => setProfileData({ ...profileData, tillNumber: e.target.value })}
                                            className="flex-1 outline-none text-slate-900 font-bold"
                                        />
                                    </div>
                                </div>
                            )}

                            {profileData.mpesaType === 'paybill' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase ml-2">Paybill No</label>
                                        <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                                            <CreditCard size={18} className="text-slate-400" />
                                            <input
                                                value={profileData.paybillNumber}
                                                onChange={(e) => setProfileData({ ...profileData, paybillNumber: e.target.value })}
                                                className="flex-1 outline-none text-slate-900 font-bold"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase ml-2">Account No</label>
                                        <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                                            <User size={18} className="text-slate-400" />
                                            <input
                                                value={profileData.accountNumber}
                                                onChange={(e) => setProfileData({ ...profileData, accountNumber: e.target.value })}
                                                className="flex-1 outline-none text-slate-900 font-bold"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Socials */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2">Social Storefronts</h3>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase ml-2">WhatsApp</label>
                                <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                                    <MessageCircle size={18} className="text-[#25D366]" />
                                    <input
                                        value={profileData.whatsapp}
                                        onChange={(e) => setProfileData({ ...profileData, whatsapp: e.target.value })}
                                        className="flex-1 outline-none text-slate-900 font-bold"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase ml-2">Instagram</label>
                                <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                                    <Instagram size={18} className="text-pink-500" />
                                    <input
                                        value={profileData.instagram}
                                        onChange={(e) => setProfileData({ ...profileData, instagram: e.target.value })}
                                        className="flex-1 outline-none text-slate-900 font-bold"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase ml-2">Facebook</label>
                                <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                                    <Facebook size={18} className="text-blue-600" />
                                    <input
                                        value={profileData.facebook}
                                        onChange={(e) => setProfileData({ ...profileData, facebook: e.target.value })}
                                        className="flex-1 outline-none text-slate-900 font-bold"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>

                    <button
                        onClick={async () => {
                            if (user?.id) {
                                await updateUser({
                                    shopName: profileData.shopName,
                                    shopLocation: profileData.locationName,
                                    contactPerson: profileData.contactName,
                                    contactPhone: profileData.contactPhone,
                                    email: profileData.email,
                                    kraPin: profileData.kraPin,
                                    mpesaType: profileData.mpesaType as 'personal' | 'till' | 'paybill',
                                    mpesaNumber: profileData.mpesaNumber,
                                    tillNumber: profileData.tillNumber,
                                    paybillNumber: profileData.paybillNumber,
                                    accountNumber: profileData.accountNumber,
                                    whatsapp: profileData.whatsapp,
                                    instagram: profileData.instagram,
                                    facebook: profileData.facebook,
                                    tiktok: profileData.tiktok
                                });
                                alert('Profile Updated Successfully!');
                            }
                        }}
                        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 active:scale-95"
                    >
                        Save Changes
                    </button>
                    <div className="h-10" />
                </div>
                {CreateLinkModal()}
            </div>
        );
    }

    if (view === 'payouts') {
        return (
            <div className="h-full bg-slate-50 flex flex-col">
                <div className="bg-white px-6 pt-12 pb-4 border-b border-slate-100 flex items-center gap-3 sticky top-0 z-20">
                    <button onClick={() => setView('hub')} className="p-2 -ml-2 rounded-full hover:bg-slate-50"><ArrowLeft size={20} /></button>
                    <h1 className="text-xl font-black text-slate-900">Payouts</h1>
                </div>
                <div className="flex-1 p-6 flex flex-col items-center justify-center text-slate-400">
                    <Wallet size={48} className="mb-4 opacity-20" />
                    <p className="font-bold text-sm">No recent transactions</p>
                </div>
                {CreateLinkModal()}
            </div>
        );
    }

    if (view === 'orders') {
        return (
            <div className="h-full bg-slate-50 flex flex-col">
                <div className="bg-white px-6 pt-12 pb-4 border-b border-slate-100 sticky top-0 z-20">
                    <div className="flex items-center gap-3 mb-4">
                        <button onClick={() => setView(selectedLink ? 'edit-link' : 'hub')} className="p-2 -ml-2 rounded-full hover:bg-slate-50"><ArrowLeft size={20} /></button>
                        <div>
                            <h1 className="text-xl font-black text-slate-900 leading-none">Order History</h1>
                            {ordersFilter && <p className="text-[10px] font-bold text-slate-400 mt-1">Filtering by: #{links.find(l => String(l.id) === String(ordersFilter))?.name}</p>}
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex p-1 bg-slate-100 rounded-2xl mx-2">
                        <button
                            onClick={() => setActiveOrderTab('ongoing')}
                            className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${activeOrderTab === 'ongoing' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
                        >
                            Ongoing ({orders.filter(o => ['pending', 'shipping'].includes(o.status)).length})
                        </button>
                        <button
                            onClick={() => setActiveOrderTab('completed')}
                            className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${activeOrderTab === 'completed' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
                        >
                            History
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-3">
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map(order => <OrderCard key={order.id} order={order} />)
                    ) : (
                        <div className="text-center py-12 text-slate-400">
                            <Box size={48} className="mx-auto mb-4 opacity-20" />
                            <p className="font-bold text-sm">No orders found</p>
                        </div>
                    )}
                </div>
                {CreateLinkModal()}
            </div>
        );
    }

    if (view === 'edit-link' && selectedLink) {
        return (
            <div className="h-full bg-slate-50 flex flex-col">
                <div className="bg-white px-6 pt-12 pb-4 border-b border-slate-100 flex justify-between items-center sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                        <button onClick={() => { setView('hub'); setSelectedLink(null); }} className="p-2 -ml-2 rounded-full hover:bg-slate-50"><ArrowLeft size={20} /></button>
                        <div>
                            <h1 className="text-xl font-black text-slate-900 leading-none">Link Details</h1>
                            <p className="text-[10px] font-bold text-slate-400 mt-1">Ref: #SK{selectedLink.id}992</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleArchiveProduct}
                            className="bg-slate-50 text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
                        >
                            <Trash2 size={20} />
                        </button>
                        <button
                            onClick={() => handleEditLink()}
                            className="bg-slate-50 text-slate-900 p-2 rounded-full hover:bg-slate-100 transition-colors"
                        >
                            <Pencil size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Preview Card */}
                    <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="aspect-square bg-slate-100 rounded-2xl mb-4 overflow-hidden relative">
                            {selectedLink.img.includes('mp4') ? (
                                <video src={selectedLink.img} className="w-full h-full object-cover" controls />
                            ) : (
                                <img src={selectedLink.img} className="w-full h-full object-cover" />
                            )}
                            <button className="absolute bottom-4 right-4 bg-white/90 p-2 rounded-xl text-xs font-bold shadow-sm backdrop-blur-md">
                                Edit Media
                            </button>
                        </div>
                        <input className="text-2xl font-black text-slate-900 w-full mb-1 outline-none focus:bg-slate-50 rounded-lg px-2 -mx-2" defaultValue={selectedLink.name} />
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400 uppercase">Price (KES)</span>
                            <input className="text-lg font-black text-slate-900 w-32 outline-none focus:bg-slate-50 rounded-lg px-2" defaultValue="4500" />
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <StatCard
                            label="Total Views"
                            value={selectedLink.views.toString()}
                            icon={<Eye size={20} />}
                            color="blue"
                        />
                        <StatCard
                            label="Orders"
                            value={selectedLink.sales.toString()}
                            icon={<Package size={20} />}
                            color="green"
                            onClick={() => {
                                setOrdersFilter(String(selectedLink.id));
                                setView('orders');
                            }}
                        />
                    </div>

                    <div className="bg-white text-slate-900 p-5 rounded-3xl border border-slate-200">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold text-sm text-slate-500 uppercase tracking-wide">Checkout Link</h3>
                            <button
                                onClick={() => window.open(`https://sokosnap.com/p/${selectedLink.id}`, '_blank')}
                                className="text-yellow-600 text-xs font-bold uppercase hover:underline"
                            >
                                Test Link
                            </button>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <span className="text-slate-400"><Lock size={16} /></span>
                            <span className="flex-1 font-mono text-sm font-bold truncate">sokosnap.com/p/{selectedLink.id}</span>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(`https://sokosnap.com/p/${selectedLink.id}`);
                                    alert('Link copied to clipboard!');
                                }}
                                className="p-2 bg-white rounded-lg shadow-sm text-slate-600 hover:text-slate-900"
                            >
                                <Copy size={16} />
                            </button>
                        </div>
                        <button
                            onClick={async () => {
                                if (navigator.share) {
                                    try {
                                        await navigator.share({
                                            title: selectedLink.name,
                                            text: `Check out ${selectedLink.name} on SokoSnap!`,
                                            url: `https://sokosnap.com/p/${selectedLink.id}`
                                        });
                                    } catch (err) {
                                        console.error('Error sharing:', err);
                                    }
                                } else {
                                    navigator.clipboard.writeText(`https://sokosnap.com/p/${selectedLink.id}`);
                                    alert('Link copied to clipboard!');
                                }
                            }}
                            className="w-full mt-4 bg-yellow-400 text-slate-900 py-3 rounded-xl font-black text-sm uppercase tracking-wide shadow-lg shadow-yellow-200 hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2"
                        >
                            <Share2 size={18} /> Share Link
                        </button>
                    </div>
                </div>
                {/* Footer Buttons Removed */}
                {CreateLinkModal()}
            </div>
        );
    }

    return (
        <div className="h-full bg-slate-50 font-sans text-slate-900 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-white px-6 pt-12 pb-4 border-b border-slate-100 flex justify-between items-center sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsDrawerOpen(true)}
                        className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors group"
                    >
                        <Menu size={20} className="text-slate-900" />
                    </button>
                    <div className="bg-yellow-500 w-10 h-10 rounded-full flex items-center justify-center text-white font-black shadow-lg shadow-yellow-200">
                        <Package size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-slate-900 leading-none">Eastleigh Kicks</h1>
                        <p className="text-[10px] font-bold text-yellow-600 uppercase tracking-wide mt-1">Verified Merchant</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 pb-24 space-y-8 scrollbar-hide">
                {/* Actions Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={handleCreateNewLink}
                        className="bg-slate-900 text-white p-5 rounded-3xl flex flex-col justify-between h-32 shadow-xl shadow-slate-200 relative overflow-hidden group active:scale-[0.98] transition-all"
                    >
                        <div className="bg-white/10 w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-yellow-500 group-hover:text-slate-900 transition-colors">
                            <Plus size={24} />
                        </div>
                        <div className="text-left relative z-10">
                            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">New Product</p>
                            <h3 className="font-black text-lg leading-tight">Create Link</h3>
                        </div>
                        <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-yellow-500/20 rounded-full blur-2xl group-hover:bg-yellow-500/40 transition-all" />
                    </button>

                    <div
                        onClick={() => setView('payouts')}
                        className="bg-white p-5 rounded-3xl flex flex-col justify-between h-32 border border-slate-100 shadow-sm relative overflow-hidden active:scale-95 transition-transform cursor-pointer"
                    >
                        <div className="flex justify-between items-start">
                            <div className="bg-blue-50 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center">
                                <Wallet size={20} />
                            </div>
                            <span className="bg-green-100 text-green-700 text-[9px] font-black px-2 py-1 rounded-full uppercase">Good</span>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Total Payout</p>
                            <h3 className="font-black text-xl text-slate-900">KES {formatCompactNumber(payoutAmount)}</h3>
                        </div>
                    </div>
                </div>

                {/* Analytics Scroll */}
                <div>
                    <div className="flex justify-between items-end mb-4 px-1">
                        <h3 className="font-black text-slate-900 text-lg">Overview</h3>
                        <select className="bg-transparent text-xs font-bold text-slate-400 outline-none">
                            <option>This Week</option>
                            <option>This Month</option>
                        </select>
                    </div>
                    {/* Grid Layout for Stats */}
                    <div className="grid grid-cols-3 gap-2 px-1">
                        <StatCard
                            label="In Hold"
                            value={`KES ${formatCompactNumber(inHoldAmount)}`}
                            sub="Pending"
                            icon={<Lock size={64} />}
                            color="blue"
                            onClick={() => {
                                setActiveOrderTab('ongoing');
                                setOrdersFilter(null);
                                setView('orders');
                            }}
                        />
                        <StatCard
                            label="Clicks"
                            value={formatCompactNumber(totalClicks)}
                            sub={`${totalViews > 0 ? ((links.reduce((a, b) => a + (b.sales || 0), 0) / totalViews) * 100).toFixed(1) : 0}% Conv`}
                            icon={<MousePointer2 size={64} />}
                            color="purple"
                        />
                        <StatCard
                            label="Sales"
                            value={`KES ${formatCompactNumber(totalSalesAmount)}`}
                            sub="Revenue"
                            icon={<TrendingUp size={64} />}
                            color="green"
                            onClick={() => {
                                setOrdersFilter(null);
                                setView('orders');
                            }}
                        />
                    </div>
                </div>

                {/* Active Links */}
                <div>
                    <div className="flex justify-between items-center mb-4 px-1">
                        <h3 className="font-black text-slate-900 text-lg">Active SokoLinks</h3>
                        <button onClick={() => setView('all-links')} className="text-yellow-600 text-xs font-bold uppercase hover:underline">See All</button>
                    </div>

                    <div className="space-y-3">
                        {activeLinks.map(item => (
                            <LinkCard
                                key={item.id}
                                item={item}
                                onClick={() => {
                                    setSelectedLink(item);
                                    setView('edit-link');
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Drawer Navigation */}
            {isDrawerOpen && (
                <div className="fixed inset-0 z-50 flex justify-start">
                    <div
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsDrawerOpen(false)}
                    />

                    <div className="relative bg-white w-3/4 max-w-xs h-full shadow-2xl p-6 transform transition-transform animate-in slide-in-from-left duration-300 flex flex-col">
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-3">
                                <div className="bg-yellow-500 w-10 h-10 rounded-full flex items-center justify-center text-white font-black shadow-lg shadow-yellow-200">
                                    <Package size={20} />
                                </div>
                                <span className="font-black text-xl tracking-tight">SokoSnap</span>
                            </div>
                            <button onClick={() => setIsDrawerOpen(false)} className="p-2 bg-slate-50 rounded-full text-slate-400">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex items-center gap-4 mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-400">
                                <User size={24} />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 leading-none">Eastleigh Kicks</h4>
                                <p className="text-xs font-bold text-slate-400 mt-1">Verified Merchant</p>
                            </div>
                        </div>

                        <div className="space-y-2 flex-1">
                            {[
                                { icon: <LayoutDashboard size={20} />, label: 'Dashboard', id: 'hub' },
                                { icon: <Package size={20} />, label: 'My Orders', id: 'orders' },
                                { icon: <Wallet size={20} />, label: 'Payouts', id: 'payouts' },
                                { icon: <User size={20} />, label: 'Profile', id: 'profile' },
                            ].map((item) => (
                                <button
                                    key={item.label}
                                    onClick={() => {
                                        setView(item.id);
                                        setIsDrawerOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${view === item.id
                                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                                        : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    {item.icon}
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={onBack}
                            className="flex items-center gap-4 p-4 rounded-2xl font-bold text-red-500 hover:bg-red-50 transition-colors mt-auto"
                        >
                            <LogOut size={20} />
                            Log Out
                        </button>
                    </div>
                </div>
            )}

            {CreateLinkModal()}
        </div>
    );
};

export default SellerDashboard;