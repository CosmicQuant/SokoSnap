import React from 'react';
import { X, Share2, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { getInitials } from '../../../utils/formatters';

interface QRLinkModalProps {
    isOpen: boolean;
    onClose: () => void;
    shopName: string;
    shopUrl: string; // e.g., "soko.to/urbankicks"
    isDarkMode?: boolean;
}

export const QRLinkModal: React.FC<QRLinkModalProps> = ({ isOpen, onClose, shopName, shopUrl, isDarkMode = false }) => {
    if (!isOpen) return null;

    const handleDownload = async () => {
        // Use the QR Server API directly
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=https://${shopUrl}&format=png`;
        try {
            const response = await fetch(qrUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${shopName || 'store'}-qr.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Failed to download QR:', err);
        }
    };

    const handleShare = async () => {
        const url = `https://${shopUrl}`;
        // Support specific Web Share API level 2 if available
        if (navigator.share) {
            try {
                // Try sharing link
                await navigator.share({
                    title: shopName || 'My Store',
                    text: `Shop at ${shopName} on SokoSnap. Verified Merchant.`,
                    url: url
                });
            } catch (err) {
                // If user cancels, do nothing. If error, try clipboard.
                console.log('Share dismissed or failed', err);
            }
        } else {
            navigator.clipboard.writeText(url);
            // Fallback UI could go here, but copying is the standard fallback
        }
    };

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm ${isDarkMode ? 'dark' : ''}`}>
            {/* 
               The 'dark' class here will trigger dark mode styles for CHILDREN.
               If isDarkMode is FALSE, 'bg-white' should apply.
               We explicitly enforce text colors to avoid inheritance issues.
            */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative"
            >
                <div className="p-6 text-center space-y-4">
                    <div className="flex justify-end absolute top-4 right-4">
                        <button onClick={onClose}>
                            <X size={20} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
                        </button>
                    </div>

                    <button
                        onClick={handleDownload}
                        className="mx-auto w-12 h-12 bg-gray-100 dark:bg-zinc-800 text-black dark:text-white rounded-full flex items-center justify-center mb-2 hover:bg-yellow-500 hover:text-black dark:hover:bg-yellow-500 dark:hover:text-black transition-all active:scale-95"
                        title="Download QR Code"
                    >
                        <Download size={24} />
                    </button>

                    {/* Used shopName here */}
                    <h3 className="text-xl font-black uppercase text-gray-900 dark:text-white">
                        {shopName ? `${shopName} QR` : 'Your Store QR'}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium">
                        Share this code with your customers to direct them to your store.
                    </p>
                </div>

                <div className="p-6 pt-0">
                    <div className="bg-white dark:bg-zinc-900 border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-2xl p-6 mb-6 flex flex-col items-center justify-center relative group">
                        {/* QR Code */}
                        <div className="w-48 h-48 bg-gray-100 dark:bg-zinc-800 rounded-lg mb-4 flex items-center justify-center text-white relative overflow-hidden">
                            <div
                                className="absolute inset-2 bg-cover bg-center rounded-lg mix-blend-multiply dark:mix-blend-normal"
                                style={{ backgroundImage: `url('https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://${shopUrl}&color=${isDarkMode ? 'FFFFFF' : '000000'}&bgcolor=${isDarkMode ? '27272a' : 'F3F4F6'}')` }}
                            />
                            {/* Center Logo with SokoSnap Branding */}
                            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center z-10 shadow-lg border-2 border-white">
                                <span className="font-black text-sm text-black tracking-tighter">
                                    {getInitials(shopName || 'SokoSnap')}
                                </span>
                            </div>
                        </div>
                        <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-medium">Scan to visit store</p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-800 p-3 rounded-xl border border-gray-100 dark:border-zinc-700">
                            <div className="flex-1 min-w-0 text-left">
                                <p className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase mb-0.5">Your Bio Link</p>
                                <p className="font-bold text-sm truncate text-blue-600 dark:text-blue-400">{shopUrl}</p>
                            </div>
                            <button onClick={handleShare} className="p-2 hover:bg-white dark:hover:bg-zinc-700 rounded-lg transition-colors shadow-sm dark:shadow-none text-gray-600 dark:text-zinc-300">
                                <Share2 size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
