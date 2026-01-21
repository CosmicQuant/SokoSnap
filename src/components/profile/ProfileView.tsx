import React from 'react';
import { ChevronLeft, User, ShieldCheck } from 'lucide-react';

interface UserData {
    phone: string;
    location: string;
    name: string;
}

interface ProfileViewProps {
    userData: UserData;
    onBack: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ userData, onBack }) => {
    return (
        <div className="h-screen bg-black text-white flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 flex items-center gap-4 border-b border-white/10">
                <button onClick={onBack} aria-label="Back"><ChevronLeft /></button>
                <h1 className="text-xl font-black italic uppercase">Profile</h1>
            </div>
            <div className="p-6 space-y-8">
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center border-2 border-yellow-500">
                        <User size={32} className="text-yellow-500" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black">{userData.name}</h2>
                        <p className="text-white/50 text-xs">{userData.phone || "No phone linked"}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <div className="flex items-center gap-3 mb-2 text-blue-400">
                            <ShieldCheck size={18} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Verification Level</span>
                        </div>
                        <p className="text-xs text-white/80">Unverified Guest. Make your first purchase to verify.</p>
                    </div>

                    <div>
                        <h3 className="text-xs font-black text-white/40 uppercase tracking-widest mb-4">Settings</h3>
                        <div className="space-y-2">
                            <div className="bg-white/5 p-4 rounded-xl flex justify-between items-center">
                                <span className="text-sm font-bold">Location</span>
                                <span className="text-xs text-white/50">{userData.location || "Nairobi, KE"}</span>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl flex justify-between items-center">
                                <span className="text-sm font-bold">Notifications</span>
                                <span className="text-green-400 text-xs font-black uppercase">On</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
