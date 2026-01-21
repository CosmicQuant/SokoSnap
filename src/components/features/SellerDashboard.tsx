/**
 * SellerDashboard Component
 * Analytics, smart links, and order management for sellers
 */

import React, { useState } from 'react';
import {
    Link,
    Plus,
    Wallet,
    TrendingUp,
    Package,
    CheckCircle2,
    Copy,
    ArrowLeft,
} from 'lucide-react';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';
import { Button, Input, Modal, ModalFooter } from '../common';
import { formatCurrency } from '../../utils/formatters';
import { smartLinkSchema, getErrorMessages } from '../../utils/validators';
import { MOCK_SELLER_STATS, MOCK_ORDERS, MOCK_CHART_DATA } from '../../utils/constants';

interface SellerDashboardProps {
    onBack: () => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'links'>('overview');
    const [showGenerator, setShowGenerator] = useState(false);
    const [generatedLink, setGeneratedLink] = useState('');
    const [inputUrl, setInputUrl] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [urlError, setUrlError] = useState<string | null>(null);

    const handleGenerateLink = async () => {
        // Validate URL
        const result = smartLinkSchema.safeParse({ url: inputUrl });
        if (!result.success) {
            const errors = getErrorMessages(result.error);
            setUrlError(errors.url || 'Invalid URL');
            return;
        }

        setUrlError(null);
        setIsGenerating(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const slug = inputUrl.split('/').pop() || 'item-' + Date.now();
        setGeneratedLink(`sokotrust.ke/${slug}`);
        setIsGenerating(false);
    };

    const handleCloseGenerator = () => {
        setShowGenerator(false);
        setGeneratedLink('');
        setInputUrl('');
        setUrlError(null);
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            // Could show a toast here
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="h-full bg-slate-50 font-sans text-slate-900 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="bg-white px-6 pt-12 pb-4 border-b border-slate-100 flex justify-between items-center sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors group"
                        aria-label="Go back"
                    >
                        <ArrowLeft
                            size={20}
                            className="text-slate-500 group-hover:text-slate-900"
                            aria-hidden="true"
                        />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-slate-900 leading-none">
                            Merchant Hub
                        </h1>
                        <p className="text-[10px] font-bold text-green-600 uppercase tracking-wide mt-1">
                            Verified Seller
                        </p>
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-6 pb-24 space-y-6">
                {/* Revenue Card */}
                <section
                    className="bg-slate-900 text-white p-6 rounded-[2rem] shadow-xl shadow-slate-200 relative overflow-hidden"
                    aria-label="Revenue summary"
                >
                    {/* Decorative element */}
                    <div
                        className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"
                        aria-hidden="true"
                    />

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                                    Total Sales Volume
                                </p>
                                <h2 className="text-3xl font-bold tracking-tight">
                                    {formatCurrency(MOCK_SELLER_STATS.totalSales)}
                                </h2>
                            </div>
                            <div className="bg-white/10 p-2 rounded-lg">
                                <Wallet className="text-blue-400" size={20} aria-hidden="true" />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="bg-white/5 p-4 rounded-2xl flex-1 border border-white/5">
                                <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">
                                    In Escrow (Pending)
                                </p>
                                <p className="text-lg font-bold text-green-400">
                                    {formatCurrency(MOCK_SELLER_STATS.pendingPayout)}
                                </p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl flex-1 border border-white/5">
                                <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">
                                    Active Orders
                                </p>
                                <p className="text-lg font-bold">{MOCK_SELLER_STATS.orders}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Tab Switcher */}
                <div
                    className="bg-white p-1 rounded-xl border border-slate-200 flex mb-2 shadow-sm"
                    role="tablist"
                >
                    <button
                        role="tab"
                        aria-selected={activeTab === 'overview'}
                        onClick={() => setActiveTab('overview')}
                        className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${activeTab === 'overview'
                            ? 'bg-slate-100 text-slate-900 shadow-sm'
                            : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        Analytics
                    </button>
                    <button
                        role="tab"
                        aria-selected={activeTab === 'links'}
                        onClick={() => setActiveTab('links')}
                        className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${activeTab === 'links'
                            ? 'bg-slate-100 text-slate-900 shadow-sm'
                            : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        Smart Links
                    </button>
                </div>

                {/* Analytics Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-6 animate-in slide-in-from-bottom duration-300">
                        {/* Chart */}
                        <section
                            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm h-64"
                            aria-label="Sales performance chart"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-sm text-slate-900">Performance</h3>
                                <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-[10px] font-bold">
                                    <TrendingUp size={12} aria-hidden="true" />
                                    +12.5%
                                </div>
                            </div>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={MOCK_CHART_DATA}>
                                    <defs>
                                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '12px',
                                            border: 'none',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                        }}
                                        itemStyle={{
                                            color: '#0f172a',
                                            fontWeight: 'bold',
                                            fontSize: '12px',
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="sales"
                                        stroke="#22c55e"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorSales)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </section>

                        {/* Recent Orders */}
                        <section aria-label="Recent shipments">
                            <h3 className="font-bold text-slate-900 text-sm mb-4 px-2">
                                Recent Shipments
                            </h3>
                            <div className="space-y-3">
                                {MOCK_ORDERS.map((order) => (
                                    <article
                                        key={order.id}
                                        className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`p-3 rounded-xl ${order.status === 'completed' || order.status === 'delivered'
                                                    ? 'bg-green-50 text-green-600'
                                                    : 'bg-blue-50 text-blue-600'
                                                    }`}
                                            >
                                                <Package size={20} aria-hidden="true" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-slate-900">
                                                    {order.id}
                                                </p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                                                    {order.customerPhone}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-sm text-slate-900">
                                                {formatCurrency(order.amount)}
                                            </p>
                                            <span
                                                className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${order.status === 'completed' || order.status === 'delivered'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-blue-100 text-blue-700'
                                                    }`}
                                            >
                                                {order.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>
                    </div>
                )}

                {/* Smart Links Tab */}
                {activeTab === 'links' && (
                    <div className="animate-in slide-in-from-right duration-300">
                        <div className="flex justify-between items-center mb-4 px-1">
                            <h3 className="font-bold text-slate-900 text-sm">Active Links</h3>
                            <button
                                onClick={() => setShowGenerator(true)}
                                className="bg-slate-900 text-white p-2 rounded-xl shadow-lg active:scale-95 transition-transform"
                                aria-label="Create new smart link"
                            >
                                <Plus size={20} aria-hidden="true" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <article className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-slate-900">Air Jordan 1 Blue</h4>
                                    <span className="bg-orange-50 text-orange-600 text-[9px] font-bold uppercase px-2 py-1 rounded-full">
                                        High Traffic
                                    </span>
                                </div>
                                <button
                                    onClick={() => copyToClipboard('sokotrust.ke/jordan-blue')}
                                    className="bg-slate-50 p-2 rounded-lg mb-4 flex items-center justify-between w-full hover:bg-slate-100 transition-colors"
                                    aria-label="Copy link to clipboard"
                                >
                                    <p className="text-xs text-slate-500 font-mono">
                                        sokotrust.ke/jordan-blue
                                    </p>
                                    <Copy size={14} className="text-slate-400" aria-hidden="true" />
                                </button>

                                <div className="flex gap-4 border-t border-slate-50 pt-4">
                                    <div className="text-center flex-1 border-r border-slate-50">
                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                                            Clicks
                                        </p>
                                        <p className="font-bold text-slate-900">1.2k</p>
                                    </div>
                                    <div className="text-center flex-1">
                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                                            Escrowed
                                        </p>
                                        <p className="font-bold text-green-600">
                                            {formatCurrency(54000)}
                                        </p>
                                    </div>
                                </div>
                            </article>
                        </div>
                    </div>
                )}
            </div>

            {/* Link Generator Modal */}
            <Modal
                isOpen={showGenerator}
                onClose={handleCloseGenerator}
                title={generatedLink ? 'Link Created' : 'Create Smart Link'}
                size="sm"
            >
                {!generatedLink ? (
                    <div className="space-y-4">
                        <Input
                            label="Social Media Post URL"
                            placeholder="https://tiktok.com/..."
                            value={inputUrl}
                            onChange={(e) => {
                                setInputUrl(e.target.value);
                                setUrlError(null);
                            }}
                            error={urlError || undefined}
                            leftIcon={<Link size={18} />}
                        />

                        <ModalFooter>
                            <Button
                                onClick={handleGenerateLink}
                                variant="primary"
                                size="lg"
                                fullWidth
                                isLoading={isGenerating}
                            >
                                Generate Payment Link
                            </Button>
                            <Button
                                onClick={handleCloseGenerator}
                                variant="ghost"
                                size="md"
                                fullWidth
                            >
                                Cancel
                            </Button>
                        </ModalFooter>
                    </div>
                ) : (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                            <CheckCircle2 size={32} aria-hidden="true" />
                        </div>
                        <p className="text-xs text-slate-500 mb-6 px-4">
                            Buyers can now pay securely via M-Pesa using this link.
                        </p>

                        <button
                            onClick={() => copyToClipboard(generatedLink)}
                            className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-sm text-slate-600 mb-6 flex justify-between items-center w-full hover:bg-slate-100 transition-colors"
                            aria-label="Copy generated link"
                        >
                            <span className="truncate mr-2">{generatedLink}</span>
                            <Copy size={16} className="text-slate-400 shrink-0" aria-hidden="true" />
                        </button>

                        <Button
                            onClick={handleCloseGenerator}
                            variant="primary"
                            size="lg"
                            fullWidth
                        >
                            Done
                        </Button>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default SellerDashboard;
