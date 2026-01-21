import React from 'react';
import { ChevronLeft, CheckCircle, Clock } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface OrderHistoryViewProps {
    onBack: () => void;
}

// Mock Orders Data
const MOCK_ORDERS = [
    {
        id: "ORD-7782-XJ",
        status: "ongoing",
        items: [
            { name: "Air Jordan 1 'Uni Blue'", price: 4500, media: "https://images.unsplash.com/photo-1628253747716-0c4f5c90fdda?auto=format&fit=crop&q=80&w=200" }
        ],
        total: 4650,
        date: "Today, 10:23 AM",
        step: "In Transit"
    },
    {
        id: "ORD-9921-MC",
        status: "delivered",
        items: [
            { name: "Vintage Denim Jacket", price: 2800, media: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=80&w=200" }
        ],
        total: 2950,
        date: "Yesterday",
        step: "Delivered"
    },
    {
        id: "ORD-1102-PP",
        status: "delivered",
        items: [
            { name: "Gucci Marmont Handbag", price: 12500, media: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=200" }
        ],
        total: 12650,
        date: "14 Jan 2024",
        step: "Delivered"
    }
];

export const OrderHistoryView: React.FC<OrderHistoryViewProps> = ({ onBack }) => {
    return (
        <div className="min-h-screen w-full bg-black text-white animate-in slide-in-from-right duration-300 relative">
            {/* Header */}
            <div className="sticky top-0 inset-x-0 p-4 bg-black/80 backdrop-blur-md border-b border-white/5 flex items-center gap-4 z-50">
                <button
                    onClick={onBack}
                    className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
                >
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-xl font-bold italic uppercase tracking-wider">Order History</h1>
            </div>

            <div className="p-4 space-y-8 pb-32">

                {/* Ongoing Section */}
                <section>
                    <h2 className="text-xs font-black uppercase tracking-widest text-yellow-500 mb-4 flex items-center gap-2">
                        <Clock size={14} /> In Progress
                    </h2>
                    <div className="space-y-4">
                        {MOCK_ORDERS.filter(o => o.status === 'ongoing').map(order => (
                            <div key={order.id} className="bg-white/5 border border-yellow-500/20 rounded-2xl p-4 relative overflow-hidden">
                                <div className="flex gap-4">
                                    <div className="w-16 h-16 bg-white/5 rounded-xl overflow-hidden shrink-0">
                                        <img src={order.items[0]?.media} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-sm truncate pr-4">{order.items[0]?.name}</h3>
                                            <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded font-bold uppercase tracking-wide whitespace-nowrap">
                                                {order.step}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-white/50 mt-1">Order #{order.id}</p>
                                        <p className="text-sm font-black mt-2">{formatCurrency(order.total)}</p>
                                    </div>
                                </div>
                                {/* Progress Bar Mock */}
                                <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2">
                                    <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full w-[70%] bg-yellow-500 rounded-full" />
                                    </div>
                                    <span className="text-[9px] font-bold text-white/70">Arriving Soon</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Delivered Section */}
                <section>
                    <h2 className="text-xs font-black uppercase tracking-widest text-green-500 mb-4 flex items-center gap-2">
                        <CheckCircle size={14} /> Completed
                    </h2>
                    <div className="space-y-4">
                        {MOCK_ORDERS.filter(o => o.status === 'delivered').map(order => (
                            <div key={order.id} className="bg-white/5 border border-white/5 rounded-2xl p-4 opacity-80 hover:opacity-100 transition-opacity">
                                <div className="flex gap-4">
                                    <div className="w-16 h-16 bg-white/5 rounded-xl overflow-hidden shrink-0 grayscale">
                                        <img src={order.items[0]?.media} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-sm truncate pr-4 text-white/80">{order.items[0]?.name}</h3>
                                            <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded font-bold uppercase tracking-wide whitespace-nowrap">
                                                DELIVERED
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-white/40 mt-1">{order.date}</p>
                                        <p className="text-sm font-bold text-white/60 mt-2">{formatCurrency(order.total)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};
