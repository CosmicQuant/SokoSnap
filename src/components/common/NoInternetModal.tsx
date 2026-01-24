import React from 'react';
import { WifiOff, X } from 'lucide-react';
import { Modal } from './Modal';

interface NoInternetModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const NoInternetModal: React.FC<NoInternetModalProps> = ({ isOpen, onClose }) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="sm"
            showCloseButton={false} // We'll add our own cancel button
            closeOnOverlayClick={false}
        >
            <div className="flex flex-col items-center text-center p-2">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                    <WifiOff size={32} className="text-red-500" />
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-2">No Internet Connection</h2>

                <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                    It looks like you're offline. Please check your internet settings and try again.
                </p>

                <div className="w-full flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl text-sm uppercase tracking-wide hover:bg-slate-200 transition-colors"
                    >
                        Cancel
                    </button>
                    {/* Optional: Add a Retry button logic later if needed */}
                </div>
            </div>
        </Modal>
    );
};
