import React, { useState } from 'react';
import { 
  Radar, RefreshCw, Send, CheckCircle2, Flame, Search, Filter, ArrowLeft
} from 'lucide-react';
import { LEADS } from '../constants';

export const LeadSniper: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [leads, setLeads] = useState(LEADS);

  const startScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const newLead = { 
        id: `lead_${Date.now()}`, 
        platform: 'TikTok', 
        handle: 'nairobithrifts_new', 
        productHint: 'Vintage Tees', 
        frictionScore: 92, 
        lastPostTime: 'Just now', 
        status: 'New' 
      };
      // @ts-ignore
      setLeads([newLead, ...leads]);
    }, 2000);
  };

  const handleDM = (id: string) => {
    setLeads(leads.map(l => l.id === id ? { ...l, status: 'Contacted' } : l));
  };

  return (
    <div className="h-full bg-slate-50 text-slate-900 font-sans flex flex-col overflow-hidden">
        
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-4 border-b border-slate-100 flex justify-between items-center sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors">
              <ArrowLeft size={20} className="text-slate-500" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-none">Market Intelligence</h1>
              <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wide mt-1">Demand Discovery</p>
            </div>
          </div>
          <button className="bg-slate-50 p-2 rounded-xl border border-slate-200 text-slate-500">
            <Filter size={18} />
          </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-24">
        {/* Control Panel */}
        <div className="bg-white border border-slate-100 p-6 rounded-[2rem] flex items-center justify-between mb-8 shadow-sm">
            <div>
              <p className="text-[9px] font-bold uppercase text-slate-400 tracking-widest mb-2">Monitoring Keywords</p>
              <div className="flex flex-wrap gap-2">
                 <span className="bg-purple-50 text-purple-600 text-[10px] font-bold px-2 py-1 rounded-md">#SneakersNairobi</span>
                 <span className="bg-purple-50 text-purple-600 text-[10px] font-bold px-2 py-1 rounded-md">#Imenti</span>
              </div>
            </div>
            <button 
              onClick={startScan}
              disabled={isScanning}
              className={`h-12 w-12 rounded-2xl flex items-center justify-center font-bold transition-all shadow-lg ${isScanning ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white hover:scale-105'}`}
            >
              <RefreshCw size={20} className={isScanning ? 'animate-spin' : ''} />
            </button>
        </div>

        {/* Lead List */}
        <div className="space-y-4">
          <h3 className="font-bold text-[10px] uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2 px-2">
            <Search size={12} /> Detected Opportunities ({leads.length})
          </h3>
          
          {leads.map((lead) => (
             <div key={lead.id} className="bg-white border border-slate-100 p-4 rounded-2xl flex items-center justify-between group shadow-sm">
               
               <div className="flex items-center gap-4">
                 <div className="relative shrink-0">
                   <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center font-bold text-slate-500 border border-slate-100 text-[10px]">
                     {lead.platform === 'TikTok' ? 'TT' : 'IG'}
                   </div>
                   {lead.frictionScore > 80 && (
                     <div className="absolute -top-1 -right-1 bg-red-500 text-white p-0.5 rounded-full border-2 border-white">
                       <Flame size={8} fill="currentColor" />
                     </div>
                   )}
                 </div>
                 
                 <div className="min-w-0">
                   <h4 className="font-bold text-sm text-slate-900 truncate">@{lead.handle}</h4>
                   <p className="text-[10px] text-slate-400 font-medium flex items-center gap-2 truncate">
                     {lead.productHint} • <span className="text-purple-600 font-bold">{lead.frictionScore} asking price</span>
                   </p>
                 </div>
               </div>

               <div className="flex items-center gap-2 pl-2">
                 {lead.status === 'New' ? (
                   <button 
                     onClick={() => handleDM(lead.id)}
                     className="bg-slate-900 text-white px-3 py-2 rounded-lg font-bold text-[10px] flex items-center gap-1 active:scale-95 transition-all whitespace-nowrap"
                   >
                     <Send size={12} /> Auto-Reply
                   </button>
                 ) : (
                   <div className="px-3 py-2 rounded-lg font-bold text-[10px] flex items-center gap-1 bg-green-50 text-green-600 border border-green-100 whitespace-nowrap">
                     <CheckCircle2 size={12} /> SENT
                   </div>
                 )}
               </div>

             </div>
          ))}
        </div>
      </div>
    </div>
  );
};
