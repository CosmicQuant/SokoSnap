import { useState, useEffect } from 'react';
import {
    Camera,
    Share2,
    Plus,
    Package,
    Ticket,
    Wrench,
    Copy,
    Bell,
    TrendingUp,
    CheckCircle2,
    ArrowUpRight,
    MoreVertical,
    ChevronRight,
    Smartphone,
    ShieldCheck,
    Zap,
    BarChart3,
    User as UserIcon,
    Settings,
    LogOut,
    Truck,
    ChevronLeft,
    Star,
    CreditCard,
    Sun,
    Moon,
    MousePointer2,
    LayoutDashboard,
    ShoppingBag
} from 'lucide-react';
import { useAuthStore } from './store/authStore';
import { useSellerStore } from './store/sellerStore';

const App = () => {
    const { user, logout, initialize } = useAuthStore();
    const { links, orders, isLoading, fetchSellerData } = useSellerStore();

    // Initialize Auth Listener
    useEffect(() => {
        const unsubscribe = initialize();
        return () => unsubscribe();
    }, [initialize]);

    const [activeView, setActiveView] = useState('home'); // home, orders, insights, menu
    const [activeTab, setActiveTab] = useState('Products');
    const [showCopyToast, setShowCopyToast] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Fetch data on mount
    useEffect(() => {
        if (user?.id) {
            fetchSellerData(user.id);
        }
    }, [user, fetchSellerData]);

    // --- DERIVED METRICS ---
    const safeOrders = orders || [];
    const safeLinks = links || [];

    const totalSettled = safeOrders
        .filter(o => o.status === 'completed' || o.status === 'delivered')
        .reduce((acc, curr) => acc + curr.total, 0);

    const inTransit = safeOrders
        .filter(o => o.status === 'in_transit' || o.status === 'processing')
        .reduce((acc, curr) => acc + curr.total, 0);

    const totalClicks = safeLinks.reduce((acc, curr) => acc + (curr.clicks || 0), 0);
    const totalSales = safeLinks.reduce((acc, curr) => acc + (curr.sales || 0), 0);
    const conversionRate = totalClicks > 0 ? ((totalSales / totalClicks) * 100).toFixed(1) : '0.0';

    const handleCopy = () => {
        setShowCopyToast(true);
        setTimeout(() => setShowCopyToast(false), 2000);
    };

    // --- THEME CLASSES ---
    const theme = {
        bg: isDarkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900',
        card: isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200 shadow-sm',
        subCard: isDarkMode ? 'bg-black/40 border-zinc-800/50' : 'bg-gray-50 border-gray-100',
        textMuted: isDarkMode ? 'text-zinc-500' : 'text-gray-400',
        navBg: isDarkMode ? 'bg-zinc-900/90 border-zinc-800/50' : 'bg-white/90 border-gray-200 shadow-xl',
        headerBg: isDarkMode ? 'bg-black/80' : 'bg-white/80',
        pill: isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-gray-200 border-gray-300',
        btnGhost: isDarkMode ? 'bg-zinc-800/50 hover:bg-zinc-800' : 'bg-gray-100 hover:bg-gray-200',
        sidebar: isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-gray-200'
    };

    // --- VIEWS ---

    const InsightsView = () => (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500 pb-32">
            <div className="px-6 mb-6">
                <h2 className="text-2xl font-black italic tracking-tighter uppercase">Insights Pulse</h2>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${theme.textMuted}`}>Real-time Merchant Performance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-6 mb-6">
                <div className={`p-4 rounded-[2rem] border ${theme.card}`}>
                    <div className="bg-yellow-500/10 text-yellow-500 h-8 w-8 rounded-lg flex items-center justify-center mb-3">
                        <MousePointer2 size={16} />
                    </div>
                    <p className={`text-[9px] font-black uppercase tracking-widest ${theme.textMuted}`}>Total Clicks</p>
                    <div className="flex items-end gap-2">
                        <p className="text-xl font-black italic">{totalClicks.toLocaleString()}</p>
                        <span className="text-[9px] text-green-500 font-bold mb-1">+0%</span>
                    </div>
                </div>
                <div className={`p-4 rounded-[2rem] border ${theme.card}`}>
                    <div className="bg-green-500/10 text-green-500 h-8 w-8 rounded-lg flex items-center justify-center mb-3">
                        <Zap size={16} />
                    </div>
                    <p className={`text-[9px] font-black uppercase tracking-widest ${theme.textMuted}`}>Conv. Rate</p>
                    <div className="flex items-end gap-2">
                        <p className="text-xl font-black italic">{conversionRate}%</p>
                        <span className="text-[9px] text-blue-500 font-bold mb-1">Avg</span>
                    </div>
                </div>
            </div>

            <section className="px-6 mb-6">
                <div className={`p-6 rounded-[2.5rem] border ${theme.card}`}>
                    <h3 className={`text-[10px] font-black uppercase tracking-widest mb-6 ${theme.textMuted}`}>Revenue Trend (Last 7 Days)</h3>
                    <div className="flex items-end justify-between h-32 px-2 gap-2">
                        {totalSettled > 0 ? (
                            // Use actual data or a consistent non-zero pattern if we have revenue
                            [35, 60, 45, 90, 65, 85, 70].map((height, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                    <div
                                        className={`w-full rounded-t-lg transition-all duration-500 group-hover:bg-yellow-500 ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'}`}
                                        style={{ height: `${height}%` }}
                                    ></div>
                                    <span className={`text-[8px] font-bold uppercase ${theme.textMuted}`}>
                                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                                    </span>
                                </div>
                            ))
                        ) : (
                            // Zero state placeholders for charts
                            [5, 5, 5, 5, 5, 5, 5].map((height, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                    <div
                                        className={`w-full rounded-t-lg transition-all duration-500 cursor-not-allowed ${isDarkMode ? 'bg-zinc-800/50' : 'bg-gray-100'}`}
                                        style={{ height: `${height}%` }}
                                    ></div>
                                    <span className={`text-[8px] font-bold uppercase ${theme.textMuted}`}>
                                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                    {totalSettled === 0 && (
                        <p className="text-center text-[10px] italic text-zinc-500 mt-4">Start selling to see revenue trends.</p>
                    )}
                </div>
            </section>

            <section className="px-6 mb-6">
                <div className={`p-6 rounded-[2.5rem] border ${theme.card}`}>
                    <h3 className={`text-[10px] font-black uppercase tracking-widest mb-4 ${theme.textMuted}`}>Social Funnel</h3>
                    <div className="space-y-4 max-w-2xl">
                        <div className="relative">
                            <div className="flex justify-between text-[10px] font-bold uppercase mb-1">
                                <span>Link Impressions</span>
                                <span>0</span>
                            </div>
                            <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'}`}>
                                <div className="h-full bg-yellow-500 w-[0%]"></div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="flex justify-between text-[10px] font-bold uppercase mb-1">
                                <span>Unique Clicks</span>
                                <span>{totalClicks}</span>
                            </div>
                            <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'}`}>
                                <div className="h-full bg-yellow-500 opacity-80" style={{ width: totalClicks > 0 ? '50%' : '0%' }}></div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="flex justify-between text-[10px] font-bold uppercase mb-1">
                                <span>Orders Completed</span>
                                <span>{safeOrders.length}</span>
                            </div>
                            <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'}`}>
                                <div className="h-full bg-green-500" style={{ width: safeOrders.length > 0 ? '20%' : '0%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );

    const HomeView = () => (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-6">
                {/* Wallet & Metrics */}
                <div className="lg:col-span-8">
                    <section className="mb-8">
                        <div className={`border p-6 rounded-[2.5rem] relative overflow-hidden ${theme.card}`}>
                            <div className="absolute -right-8 -top-8 w-32 h-32 bg-green-500/10 rounded-full blur-3xl"></div>
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${theme.textMuted}`}>Total Settled (30d)</span>
                                        <div className="bg-green-500/10 text-green-500 text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 font-bold">
                                            <ArrowUpRight size={10} /> +0%
                                        </div>
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-black tracking-tight italic">
                                        <span className={`text-sm md:text-base not-italic font-bold mr-1 ${theme.textMuted}`}>KES</span>
                                        {totalSettled.toLocaleString()}
                                    </h2>
                                </div>
                                <div className="h-12 w-12 bg-green-500 rounded-2xl flex items-center justify-center text-black shadow-lg shadow-green-500/20">
                                    <Zap size={24} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className={`rounded-2xl p-3 border ${theme.subCard}`}>
                                    <p className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${theme.textMuted}`}>
                                        <Truck size={10} className="text-blue-400" /> In Transit
                                    </p>
                                    <p className="font-black text-sm">KES {inTransit.toLocaleString()}</p>
                                </div>
                                <div className={`rounded-2xl p-3 border ${theme.subCard}`}>
                                    <p className={`text-[10px] font-bold uppercase mb-1 ${theme.textMuted}`}>Avg. Settlement</p>
                                    <p className="font-black text-sm text-yellow-500">Instant</p>
                                </div>
                                {/* Desktop-only extra metrics */}
                                <div className={`hidden md:block rounded-2xl p-3 border ${theme.subCard}`}>
                                    <p className={`text-[10px] font-bold uppercase mb-1 ${theme.textMuted}`}>Top Channel</p>
                                    <p className="font-black text-sm text-blue-500">WhatsApp</p>
                                </div>
                                <div className={`hidden md:block rounded-2xl p-3 border ${theme.subCard}`}>
                                    <p className={`text-[10px] font-bold uppercase mb-1 ${theme.textMuted}`}>Growth Score</p>
                                    <p className="font-black text-sm text-green-500">A+</p>
                                </div>
                            </div>
                            <p className={`mt-4 text-[10px] text-center font-medium ${theme.textMuted}`}>Funds settled to your M-Pesa instantly after delivery.</p>
                        </div>
                    </section>

                    {/* Quick Create Speed Zone */}
                    <section className="mb-10">
                        <h3 className={`text-xs font-black uppercase tracking-widest mb-4 ${theme.textMuted}`}>Quick Actions</h3>
                        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                            {[
                                { icon: <Camera />, label: 'Snap Link', color: 'text-yellow-500' },
                                { icon: <Plus />, label: 'Manual', color: isDarkMode ? 'text-zinc-400' : 'text-gray-400' },
                                { icon: <Smartphone />, label: 'Invoice', color: isDarkMode ? 'text-zinc-400' : 'text-gray-400' },
                                { icon: <Share2 />, label: 'Store QR', color: isDarkMode ? 'text-zinc-400' : 'text-gray-400' }
                            ].map((item, i) => (
                                <button key={i} className="flex-shrink-0 flex flex-col items-center gap-3">
                                    <div className={`h-16 w-16 md:h-20 md:w-20 rounded-3xl flex items-center justify-center border shadow-xl active:scale-95 transition-transform ${theme.card}`}>
                                        <span className={item.color}>{item.icon}</span>
                                    </div>
                                    <span className={`text-[11px] font-bold ${isDarkMode ? 'text-zinc-300' : 'text-gray-600'}`}>{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Smart Toggles & Feed */}
                    <section className="pb-32 lg:pb-12">
                        <div className={`p-1.5 rounded-[1.5rem] flex gap-1 mb-8 border shadow-inner max-w-md ${theme.card}`}>
                            {['Products', 'Services', 'Tickets'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 py-3 rounded-2xl text-[11px] font-black transition-all flex items-center justify-center gap-2 uppercase tracking-tight ${activeTab === tab
                                            ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20'
                                            : `${theme.textMuted} hover:text-yellow-500`
                                        }`}
                                >
                                    {tab === 'Products' && <Package size={14} />}
                                    {tab === 'Services' && <Wrench size={14} />}
                                    {tab === 'Tickets' && <Ticket size={14} />}
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Filter Links: For now we show all links under 'Products', others empty */}
                            {activeTab === 'Products' && safeLinks.length === 0 && !isLoading && (
                                <div className="col-span-full border-2 border-dashed rounded-[2.2rem] p-8 text-center opacity-50">
                                    <p className="text-sm font-bold">No products yet.</p>
                                </div>
                            )}
                            {activeTab === 'Products' && safeLinks.map((item) => (
                                <div key={item.id} className={`border p-4 rounded-[2.2rem] flex items-center gap-4 transition-colors group ${theme.card}`}>
                                    <div className={`h-16 w-16 rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:scale-105 transition-transform overflow-hidden ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'}`}>
                                        {item.img ? <img src={item.img} alt={item.name} className="w-full h-full object-cover" /> : <Package size={24} />}
                                    </div>

                                    <div className="flex-1 overflow-hidden">
                                        <h4 className="font-bold text-sm truncate pr-2">{item.name}</h4>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-yellow-500 font-black text-sm italic">KES {item.price?.toLocaleString() || '0'}</span>
                                            <span className={`h-1 w-1 rounded-full ${isDarkMode ? 'bg-zinc-700' : 'bg-gray-300'}`}></span>
                                            <span className={`text-[10px] font-bold uppercase tracking-tighter ${theme.textMuted}`}>
                                                {item.sales} Sold
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <button onClick={handleCopy} className={`h-10 w-10 rounded-xl flex items-center justify-center text-yellow-500 transition-all active:scale-90 ${theme.btnGhost} hover:bg-yellow-500 hover:text-black`}>
                                            <Copy size={16} />
                                        </button>
                                        <button className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all active:scale-90 ${theme.btnGhost} ${theme.textMuted} hover:text-yellow-500`}>
                                            <Share2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Fallback for other tabs */}
                            {activeTab !== 'Products' && (
                                <div className="col-span-full py-12 text-center opacity-50 italic">
                                    Coming soon for {activeTab}
                                </div>
                            )}

                            {/* Create New Button */}
                            <button className={`w-full border-2 border-dashed py-8 rounded-[2.2rem] flex flex-col items-center justify-center gap-2 transition-all group ${theme.card} hover:border-yellow-500/30`}>
                                <div className={`h-12 w-12 rounded-full flex items-center justify-center transition-all group-hover:bg-yellow-500 group-hover:text-black ${isDarkMode ? 'bg-zinc-800 text-zinc-400' : 'bg-gray-100 text-gray-500'}`}>
                                    <Plus size={24} />
                                </div>
                                <span className={`text-xs font-black uppercase tracking-widest ${theme.textMuted} group-hover:text-yellow-500`}>Create New {activeTab.slice(0, -1)}</span>
                            </button>
                        </div>
                    </section>
                </div>

                {/* Desktop Sidebar Column */}
                <div className="hidden lg:block lg:col-span-4 space-y-6">
                    <div className={`p-6 rounded-[2.5rem] border ${theme.card}`}>
                        <h3 className="text-xs font-black uppercase tracking-widest mb-4 italic">Merchant Activity</h3>
                        <div className="space-y-4">
                            {/* Mock activity if no orders */}
                            {safeOrders.length === 0 ? (
                                <>
                                    {[
                                        { icon: <ShoppingBag size={14} />, text: "Welcome to SokoSnap!", time: "Just now", color: "text-green-500" },
                                        { icon: <TrendingUp size={14} />, text: "Finish setting up profile", time: "Action Item", color: "text-yellow-500" },
                                    ].map((activity, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className={`h-8 w-8 rounded-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 ${activity.color}`}>
                                                {activity.icon}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold">{activity.text}</p>
                                                <p className="text-[10px] text-zinc-400">{activity.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                safeOrders.slice(0, 5).map((order) => (
                                    <div key={order.id} className="flex items-center gap-3">
                                        <div className={`h-8 w-8 rounded-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-blue-500`}>
                                            <CreditCard size={14} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold">New Order: KES {order.total}</p>
                                            <p className="text-[10px] text-zinc-400">{new Date().toLocaleTimeString()}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className={`p-6 rounded-[2.5rem] border ${theme.card}`}>
                        <h3 className="text-xs font-black uppercase tracking-widest mb-4 italic">Market Growth</h3>
                        {/* Chart Placeholder */}
                        {totalSettled > 0 ? (
                            // Use actual chart if we have data (or placeholder for now)
                            <div className="h-24 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl flex items-center justify-center border border-zinc-100 dark:border-zinc-800">
                                <TrendingUp className="text-green-500 opacity-30" size={48} />
                            </div>
                        ) : (
                            // Zero state chart
                            <div className="h-24 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl flex items-center justify-center border border-zinc-100 dark:border-zinc-800 relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-10"></div>
                                <p className="text-[10px] font-black uppercase text-zinc-300">No Data Yet</p>
                            </div>
                        )}

                        <p className="text-[10px] mt-4 font-medium text-zinc-500 leading-relaxed uppercase tracking-tighter">
                            {totalClicks > 100
                                ? "Your store traffic is booming! Keep sharing."
                                : "Share your links on WhatsApp to boost traffic (+42% avg)."
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    const MenuView = () => (
        <div className="px-6 pb-32 lg:pb-12 animate-in fade-in duration-300 max-w-2xl mx-auto">
            <div className="flex flex-col items-center mt-4 mb-8 text-center">
                <div className="h-24 w-24 rounded-[2rem] bg-gradient-to-tr from-yellow-500 to-yellow-200 p-1 mb-4">
                    <div className="h-full w-full bg-black rounded-[1.8rem] overflow-hidden">
                        <img src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'Felix'}`} alt="Profile" />
                    </div>
                </div>
                <h2 className="text-2xl font-black italic">{user?.name || 'Store Owner'}</h2>
                <div className={`flex items-center gap-1 mt-1 px-3 py-1 rounded-full ${theme.pill}`}>
                    <Star className="text-yellow-500 fill-yellow-500" size={12} />
                    <span className="text-[10px] font-black uppercase">4.9 TOP SELLER</span>
                </div>
            </div>

            <div className="space-y-3">
                {/* LIGHT MODE TOGGLE */}
                <div className={`w-full p-4 rounded-3xl border flex items-center gap-4 ${theme.card}`}>
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-zinc-800 text-yellow-500' : 'bg-gray-100 text-blue-500'}`}>
                        {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
                    </div>
                    <div className="flex-1 text-left">
                        <p className="text-sm font-bold">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</p>
                        <p className={`text-[10px] ${theme.textMuted}`}>{isDarkMode ? 'Easier on the eyes' : 'Maximum visibility'}</p>
                    </div>
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className={`w-12 h-6 rounded-full relative transition-all border-2 ${isDarkMode ? 'bg-yellow-500 border-yellow-600' : 'bg-gray-200 border-gray-300'}`}
                    >
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-md transition-all ${isDarkMode ? 'left-6' : 'left-0.5'}`}></div>
                    </button>
                </div>

                {[
                    { icon: <UserIcon />, title: 'Merchant Profile', desc: 'Edit your bio & location' },
                    { icon: <CreditCard />, title: 'Settlement Account', desc: 'M-Pesa or Bank Details' },
                    { icon: <ShieldCheck />, title: 'Identity Verification', desc: 'Level 2: Verified' },
                    { icon: <Settings />, title: 'App Settings', desc: 'Notifications & Privacy' },
                ].map((item, i) => (
                    <button key={i} className={`w-full border p-4 rounded-3xl flex items-center gap-4 text-left active:scale-95 transition-transform ${theme.card}`}>
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${theme.pill} text-zinc-400`}>{item.icon}</div>
                        <div className="flex-1">
                            <p className="text-sm font-bold">{item.title}</p>
                            <p className={`text-[10px] ${theme.textMuted}`}>{item.desc}</p>
                        </div>
                        <ChevronRight className={theme.textMuted} size={18} />
                    </button>
                ))}
                <button
                    onClick={logout}
                    className="w-full mt-4 flex items-center justify-center gap-2 text-red-500 font-bold py-4 bg-red-500/5 rounded-2xl border border-red-500/10 active:scale-95 transition-transform"
                >
                    <LogOut size={18} /> Sign Out
                </button>
            </div>
        </div>
    );

    return (
        <div className={`min-h-screen font-sans selection:bg-yellow-500/30 transition-colors duration-300 flex ${theme.bg}`}>

            {/* Sidebar - Desktop Only */}
            <aside className={`hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r z-50 transition-colors ${theme.sidebar}`}>
                <div className="p-8">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-black tracking-tighter text-yellow-500 italic">SokoSnap</h1>
                        <span className="bg-yellow-500 text-black text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter shadow-sm">Pro</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                        <Zap size={12} className="text-yellow-500 fill-yellow-500" />
                        <p className={`text-[10px] font-black uppercase tracking-widest opacity-50`}>Hustle Active</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {[
                        { id: 'home', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
                        { id: 'orders', icon: <ShoppingBag size={20} />, label: 'Orders' },
                        { id: 'insights', icon: <BarChart3 size={20} />, label: 'Pulse Insights' },
                        { id: 'menu', icon: <Settings size={20} />, label: 'Settings' },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group ${activeView === item.id
                                    ? 'bg-yellow-500 text-black font-black'
                                    : `${isDarkMode ? 'text-zinc-500' : 'text-zinc-600'} hover:bg-yellow-500/10 hover:text-yellow-500`
                                }`}
                        >
                            {item.icon}
                            <span className="text-sm font-bold uppercase tracking-tighter">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-8 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gradient-to-tr from-yellow-500 to-yellow-200 rounded-full p-0.5">
                            <div className="h-full w-full rounded-full bg-black overflow-hidden">
                                <img src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'Felix'}`} alt="profile" />
                            </div>
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs font-black truncate">{user?.name || 'User'}</p>
                            <p className="text-[10px] opacity-50 font-bold uppercase tracking-tighter">Verified</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0 flex flex-col">
                {/* Toast Notification */}
                <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[60] transition-all duration-300 ${showCopyToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                    <div className="bg-yellow-500 text-black px-6 py-2 rounded-full font-bold shadow-2xl flex items-center gap-2">
                        <CheckCircle2 size={18} /> Link Copied!
                    </div>
                </div>

                {/* Mobile Header - Hidden on Desktop Sidebar View */}
                <header className={`p-6 pt-8 flex justify-between items-center sticky top-0 backdrop-blur-md z-40 transition-colors lg:hidden ${theme.headerBg}`}>
                    <div>
                        {activeView === 'home' ? (
                            <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                                <div className="flex items-center gap-2">
                                    <h1 className="text-2xl font-black tracking-tighter text-yellow-500 italic">SokoSnap</h1>
                                    <span className="bg-yellow-500 text-black text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter shadow-sm">Pro</span>
                                </div>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <Zap size={12} className="text-yellow-500 fill-yellow-500" />
                                    <p className={`text-[10px] font-black uppercase tracking-widest ${theme.textMuted}`}>Hustle Active</p>
                                </div>
                            </div>
                        ) : (
                            <button onClick={() => setActiveView('home')} className="flex items-center gap-2 group">
                                <ChevronLeft className="text-yellow-500 group-hover:-translate-x-1 transition-transform" />
                                <span className="font-black uppercase tracking-widest text-xs">Back Home</span>
                            </button>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <button className={`h-10 w-10 rounded-full flex items-center justify-center border relative ${theme.pill}`}>
                            <Bell size={20} className={isDarkMode ? 'text-zinc-300' : 'text-gray-600'} />
                            <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-black"></span>
                        </button>
                        {activeView !== 'menu' && (
                            <button onClick={() => setActiveView('menu')} className="h-10 w-10 bg-gradient-to-tr from-yellow-500 to-yellow-200 rounded-full p-0.5 active:scale-90 transition-transform shadow-lg">
                                <div className="h-full w-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                                    <img src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'Felix'}`} alt="profile" />
                                </div>
                            </button>
                        )}
                    </div>
                </header>

                {/* Desktop Header - Visible on Desktop only */}
                <header className="hidden lg:flex p-12 pb-4 justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-black italic tracking-tighter uppercase">{activeView === 'home' ? 'Merchant Dashboard' : activeView}</h2>
                        <p className={`text-xs font-bold uppercase tracking-widest ${theme.textMuted}`}>Welcome back, {user?.name || 'Seller'}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className={`h-12 w-12 rounded-2xl flex items-center justify-center border relative transition-all ${theme.btnGhost}`}>
                            <Bell size={22} />
                            <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                </header>

                {/* Main View Router */}
                <main className="pt-2 pb-24 lg:pb-12 lg:px-6">
                    {activeView === 'home' && <HomeView />}
                    {activeView === 'insights' && <InsightsView />}
                    {activeView === 'menu' && <MenuView />}
                    {activeView === 'orders' && <div className="px-6 text-center py-20 italic opacity-50 uppercase font-black text-xl tracking-tighter text-zinc-500">Orders Stream coming soon...</div>}
                </main>

                {/* Bottom Navigation - Mobile Only */}
                <div className="fixed bottom-6 left-6 right-6 z-50 lg:hidden">
                    <nav className={`backdrop-blur-xl border rounded-[2.5rem] p-2 flex justify-between items-center shadow-2xl px-6 py-3 transition-colors ${theme.navBg}`}>
                        <button
                            onClick={() => setActiveView('home')}
                            className={`flex flex-col items-center gap-1 transition-colors ${activeView === 'home' ? 'text-yellow-500' : isDarkMode ? 'text-zinc-500' : 'text-gray-400'}`}
                        >
                            <div className={`p-2 rounded-2xl ${activeView === 'home' ? 'bg-yellow-500/10' : ''}`}>
                                <Package size={22} strokeWidth={activeView === 'home' ? 3 : 2} />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-tighter">Home</span>
                        </button>

                        <button
                            onClick={() => setActiveView('orders')}
                            className={`flex flex-col items-center gap-1 transition-colors ${activeView === 'orders' ? 'text-yellow-500' : isDarkMode ? 'text-zinc-500' : 'text-gray-400'}`}
                        >
                            <div className={`p-2 rounded-2xl ${activeView === 'orders' ? 'bg-yellow-500/10' : ''}`}>
                                <Ticket size={22} strokeWidth={activeView === 'orders' ? 3 : 2} />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-tighter">Orders</span>
                        </button>

                        {/* Central Action Button */}
                        <div className="relative -top-10">
                            <button className="h-16 w-16 bg-yellow-500 text-black rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(234,179,8,0.4)] border-4 border-black active:scale-95 transition-all hover:scale-105">
                                <Camera size={28} strokeWidth={3} />
                            </button>
                        </div>

                        <button
                            onClick={() => setActiveView('insights')}
                            className={`flex flex-col items-center gap-1 transition-colors ${activeView === 'insights' ? 'text-yellow-500' : isDarkMode ? 'text-zinc-500' : 'text-gray-400'}`}
                        >
                            <div className={`p-2 rounded-2xl ${activeView === 'insights' ? 'bg-yellow-500/10' : ''}`}>
                                <BarChart3 size={22} strokeWidth={activeView === 'insights' ? 3 : 2} />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-tighter">Insights</span>
                        </button>

                        <button
                            onClick={() => setActiveView('menu')}
                            className={`flex flex-col items-center gap-1 transition-colors ${activeView === 'menu' ? 'text-yellow-500' : isDarkMode ? 'text-zinc-500' : 'text-gray-400'}`}
                        >
                            <div className={`p-2 rounded-2xl ${activeView === 'menu' ? 'bg-yellow-500/10' : ''}`}>
                                <MoreVertical size={22} strokeWidth={activeView === 'menu' ? 3 : 2} />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-tighter">Menu</span>
                        </button>
                    </nav>
                </div>

                {/* iOS Safe Area Spacer */}
                <div className={`h-8 transition-colors ${theme.headerBg} lg:hidden`}></div>
            </div>
        </div>
    );
};

export default App;
