import React, { useState, useEffect } from 'react';
import { ChevronLeft, Clock, ShieldCheck, X } from 'lucide-react';
import { useOrderStore, useAuthStore } from '../../store';
import { formatCurrency } from '../../utils/formatters';

interface OrderHistoryViewProps {
    onBack: () => void;
}

export const OrderHistoryView: React.FC<OrderHistoryViewProps> = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState<'ongoing' | 'completed'>('ongoing');
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

    const { orders, fetchOrders, loading } = useOrderStore();
    const { user } = useAuthStore();

    useEffect(() => {
        if (user?.id) {
            fetchOrders(user.id);
        }
    }, [user?.id, fetchOrders]);

    // Derived lists
    const ongoingOrders = orders.filter(o => ['pending', 'processing', 'escrow_held', 'in_transit'].includes(o.status));
    const completedOrders = orders.filter(o => ['delivered', 'completed', 'cancelled', 'refunded'].includes(o.status));

    if (loading && orders.length === 0) {
        return (
            <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-slate-50 text-slate-900 animate-in slide-in-from-right duration-300 relative">
            {/* Header */}
            <div className="sticky top-0 inset-x-0 bg-white/90 backdrop-blur-md border-b border-slate-200 z-40 shadow-sm">
                <div className="p-4 flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-xl font-bold italic uppercase tracking-wider text-slate-900">Order History</h1>
                </div>

                {/* Tabs */}
                <div className="flex border-t border-slate-100">
                    <button
                        onClick={() => setActiveTab('ongoing')}
                        className={`flex-1 py-3 text-xs font-black uppercase tracking-widest transition-colors relative ${activeTab === 'ongoing' ? 'text-yellow-600' : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        In Progress
                        {activeTab === 'ongoing' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-yellow-500" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('completed')}
                        className={`flex-1 py-3 text-xs font-black uppercase tracking-widest transition-colors relative ${activeTab === 'completed' ? 'text-yellow-600' : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        Completed
                        {activeTab === 'completed' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-yellow-500" />}
                    </button>
                </div>
            </div>

            <div className="p-4 pb-[calc(2rem+env(safe-area-inset-bottom))]">

                {/* Ongoing Section */}
                {activeTab === 'ongoing' && (
                    <section className="animate-in fade-in zoom-in-95 duration-200">
                        <div className="space-y-4">
                            {ongoingOrders.map(order => {
                                const product = order.items?.[0]?.product;
                                return (
                                    <div
                                        key={order.id}
                                        onClick={() => setSelectedOrder(order)}
                                        className="bg-white border border-slate-200 rounded-2xl p-4 relative overflow-hidden active:scale-98 transition-transform cursor-pointer shadow-sm hover:shadow-md hover:border-yellow-400/50"
                                    >
                                        <div className="flex gap-4">
                                            <div className="w-16 h-16 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                                                {product && (
                                                    <img src={product.mediaUrl} className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-bold text-sm truncate pr-4 text-slate-900">{product?.name || 'Unknown Product'}</h3>
                                                    <span className="text-[10px] bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-0.5 rounded font-bold uppercase tracking-wide whitespace-nowrap">
                                                        {order.status.replace('_', ' ')}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-slate-500 mt-1">Order #{order.id}</p>
                                                <p className="text-sm font-black mt-2 text-slate-900">{formatCurrency(order.total)}</p>
                                            </div>
                                        </div>
                                        {/* Progress Bar Mock */}
                                        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2">
                                            <div className="h-1 flex-1 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full w-[50%] bg-yellow-500 rounded-full" />
                                            </div>
                                            <span className="text-[9px] font-bold text-slate-500">Processing</span>
                                        </div>
                                    </div>
                                );
                            })}
                            {ongoingOrders.length === 0 && (
                                <div className="text-center py-10 text-slate-400 text-xs font-medium">
                                    No active orders
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* Delivered Section */}
                {activeTab === 'completed' && (
                    <section className="animate-in fade-in zoom-in-95 duration-200">
                        <div className="space-y-4">
                            {completedOrders.map(order => {
                                const product = order.items?.[0]?.product;
                                return (
                                    <div
                                        key={order.id}
                                        onClick={() => setSelectedOrder(order)}
                                        className="bg-white border border-slate-200 rounded-2xl p-4 opacity-100 hover:border-slate-300 transition-colors active:scale-98 cursor-pointer shadow-sm"
                                    >
                                        <div className="flex gap-4">
                                            <div className="w-16 h-16 bg-slate-100 rounded-xl overflow-hidden shrink-0 grayscale border border-slate-100">
                                                {product && (
                                                    <img src={product.mediaUrl} className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-bold text-sm truncate pr-4 text-slate-600">{product?.name || 'Unknown'}</h3>
                                                    <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded font-bold uppercase tracking-wide whitespace-nowrap">
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-slate-400 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                <p className="text-sm font-bold text-slate-500 mt-2">{formatCurrency(order.total)}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {completedOrders.length === 0 && (
                                <div className="text-center py-10 text-slate-400 text-xs font-medium">
                                    No completed orders
                                </div>
                            )}
                        </div>
                    </section>
                )}
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center pointer-events-auto">
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                        onClick={() => setSelectedOrder(null)}
                    />
                    <div className="relative w-full max-w-lg bg-white sm:rounded-2xl rounded-t-3xl overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90vh]">

                        {/* Modal Header */}
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
                            <div>
                                <h2 className="text-lg font-black italic uppercase tracking-tighter text-slate-900">Order Details</h2>
                                <p className="text-xs text-slate-500">#{selectedOrder.id}</p>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto space-y-6">

                            {/* Status Banner */}
                            <div className={`p-4 rounded-xl flex items-center gap-3 ${selectedOrder.status === 'ongoing' || selectedOrder.status === 'pending'
                                ? 'bg-yellow-50 border border-yellow-100'
                                : 'bg-emerald-50 border border-emerald-100'
                                }`}>
                                {selectedOrder.status === 'ongoing' || selectedOrder.status === 'pending' ? (
                                    <Clock className="text-yellow-600" size={24} />
                                ) : (
                                    <ShieldCheck className="text-emerald-600" size={24} />
                                )}
                                <div>
                                    <p className={`text-sm font-bold uppercase tracking-wider ${selectedOrder.status === 'ongoing' || selectedOrder.status === 'pending' ? 'text-yellow-700' : 'text-emerald-700'
                                        }`}>
                                        {selectedOrder.status === 'ongoing' || selectedOrder.status === 'pending' ? 'In Progress' : 'Order Completed'}
                                    </p>
                                    <p className="text-[10px] text-slate-500">
                                        Status: {selectedOrder.status.replace('_', ' ')}
                                    </p>
                                </div>
                            </div>

                            {/* Items List */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Items</h3>
                                {selectedOrder.items?.map((item: any, i: number) => (
                                    <div key={i} className="flex gap-4 items-center bg-slate-50 border border-slate-100 p-3 rounded-xl">
                                        {item.product?.mediaUrl && <img src={item.product.mediaUrl} className="w-12 h-12 rounded-lg object-cover bg-slate-200" />}
                                        <div className="flex-1">
                                            <p className="font-bold text-sm text-slate-900">{item.product?.name || 'Unknown'}</p>
                                            <p className="text-xs text-slate-500">{formatCurrency(item.product?.price || 0)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
