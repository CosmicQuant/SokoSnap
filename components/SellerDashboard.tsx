import React, { useState } from 'react';
import { 
  BarChart3, Link, Plus, Wallet, TrendingUp, Package, 
  CheckCircle2, ArrowRight, ArrowUpRight, Copy, Bell, ArrowLeft
} from 'lucide-react';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';
import { RECENT_ORDERS, SELLER_STATS } from '../constants';

const chartData = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 12000 },
  { name: 'Thu', sales: 8000 },
  { name: 'Fri', sales: 15000 },
  { name: 'Sat', sales: 22000 },
  { name: 'Sun', sales: 18000 },
];

export const SellerDashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'links'>('overview');
  const [showGenerator, setShowGenerator] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [inputUrl, setInputUrl] = useState('');

  const generateLink = () => {
    setTimeout(() => {
        setGeneratedLink(`sokotrust.ke/${inputUrl.split('/').pop() || 'item-882'}`);
    }, 1500);
  };

  return (
    <div className="h-full bg-slate-50 font-sans text-slate-900 flex flex-col overflow-hidden">
      
      {/* App Header */}
      <div className="bg-white px-6 pt-12 pb-4 border-b border-slate-100 flex justify-between items-center sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors group">
              <ArrowLeft size={20} className="text-slate-500 group-hover:text-slate-900" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-none">Merchant Hub</h1>
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide mt-1">Verified Seller</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-24 space-y-6">
        
        {/* REVENUE CARD */}
        <div className="bg-slate-900 text-white p-6 rounded-[2rem] shadow-xl shadow-slate-200 relative overflow-hidden">
           {/* Abstract decorative shape */}
           <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
           
           <div className="relative z-10">
             <div className="flex justify-between items-start mb-6">
                <div>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Sales Volume</p>
                    <h2 className="text-3xl font-bold tracking-tight">KES {SELLER_STATS.totalSales.toLocaleString()}</h2>
                </div>
                <div className="bg-white/10 p-2 rounded-lg">
                    <Wallet className="text-blue-400" size={20} />
                </div>
             </div>
             
             <div className="flex gap-4">
               <div className="bg-white/5 p-4 rounded-2xl flex-1 border border-white/5">
                 <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">In Escrow (Pending)</p>
                 <p className="text-lg font-bold text-emerald-400">KES {SELLER_STATS.pendingPayout.toLocaleString()}</p>
               </div>
               <div className="bg-white/5 p-4 rounded-2xl flex-1 border border-white/5">
                 <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Active Orders</p>
                 <p className="text-lg font-bold">{SELLER_STATS.orders}</p>
               </div>
             </div>
           </div>
        </div>

        {/* Tab Switcher */}
        <div className="bg-white p-1 rounded-xl border border-slate-200 flex mb-2 shadow-sm">
            <button 
                onClick={() => setActiveTab('overview')}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${activeTab === 'overview' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
                Analytics
            </button>
             <button 
                onClick={() => setActiveTab('links')}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${activeTab === 'links' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
                Smart Links
            </button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in slide-in-from-bottom duration-300">
            {/* Chart */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm h-64">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-sm text-slate-900">Performance</h3>
                 <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full text-[10px] font-bold">
                    <TrendingUp size={12} /> +12.5%
                 </div>
               </div>
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={chartData}>
                   <defs>
                     <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#059669" stopOpacity={0.1}/>
                       <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <Tooltip 
                     contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                     itemStyle={{ color: '#0f172a', fontWeight: 'bold', fontSize: '12px' }}
                   />
                   <Area type="monotone" dataKey="sales" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                 </AreaChart>
               </ResponsiveContainer>
            </div>

            {/* Recent Orders */}
            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-4 px-2">Recent Shipments</h3>
              <div className="space-y-3">
                {RECENT_ORDERS.map((order) => (
                  <div key={order.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                        <Package size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-900">{order.item}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{order.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="font-bold text-sm text-slate-900">KES {order.amount.toLocaleString()}</p>
                       <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                         {order.status}
                       </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* LINK GENERATOR TAB */}
        {activeTab === 'links' && (
          <div className="animate-in slide-in-from-right duration-300">
             <div className="flex justify-between items-center mb-4 px-1">
               <h3 className="font-bold text-slate-900 text-sm">Active Links</h3>
               <button 
                 onClick={() => setShowGenerator(true)}
                 className="bg-slate-900 text-white p-2 rounded-xl shadow-lg active:scale-95 transition-transform"
               >
                 <Plus size={20} />
               </button>
             </div>

             <div className="space-y-4">
                <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-900">Air Jordan 1 Blue</h4>
                    <span className="bg-orange-50 text-orange-600 text-[9px] font-bold uppercase px-2 py-1 rounded-full">High Traffic</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg mb-4 flex items-center justify-between">
                    <p className="text-xs text-slate-500 font-mono">sokotrust.ke/jordan-blue</p>
                    <Copy size={14} className="text-slate-400" />
                  </div>
                  
                  <div className="flex gap-4 border-t border-slate-50 pt-4">
                    <div className="text-center flex-1 border-r border-slate-50">
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">Clicks</p>
                      <p className="font-bold text-slate-900">1.2k</p>
                    </div>
                    <div className="text-center flex-1">
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">Escrowed</p>
                      <p className="font-bold text-emerald-600">KES 54k</p>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* GENERATOR MODAL */}
      {showGenerator && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
           <div className="bg-white w-full max-w-sm rounded-[2rem] p-8 animate-in slide-in-from-bottom duration-300 shadow-2xl">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Create Smart Link</h3>
              
              {!generatedLink ? (
                <>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Social Media Post URL</label>
                      <div className="relative mt-2">
                        <Link className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input 
                           type="text"
                           placeholder="https://tiktok.com/..."
                           className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 font-bold text-sm outline-none focus:border-emerald-500 text-slate-900"
                           value={inputUrl}
                           onChange={(e) => setInputUrl(e.target.value)}
                        />
                      </div>
                    </div>
                    <button 
                      onClick={generateLink}
                      className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-sm shadow-lg"
                    >
                      Generate Payment Link
                    </button>
                    <button onClick={() => setShowGenerator(false)} className="w-full py-2 text-xs font-bold text-slate-400 uppercase hover:text-slate-600">Cancel</button>
                  </div>
                </>
              ) : (
                <div className="text-center">
                   <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                     <CheckCircle2 size={32} />
                   </div>
                   <h4 className="font-bold text-lg mb-2 text-slate-900">Link Created</h4>
                   <p className="text-xs text-slate-500 mb-6 px-4">Buyers can now pay securely via M-Pesa using this link.</p>
                   
                   <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-sm text-slate-600 mb-6 flex justify-between items-center break-all">
                     <span className="truncate mr-2">{generatedLink}</span>
                     <Copy size={16} className="text-slate-400 shrink-0" />
                   </div>
                   <button 
                     onClick={() => {setShowGenerator(false); setGeneratedLink(''); setInputUrl('')}}
                     className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-sm uppercase tracking-wide"
                   >
                     Done
                   </button>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};
