/**
 * BecomeSellerModal Component
 * Onboarding for new sellers
 */

import React, { useState } from 'react';
import { Store, MapPin, User, Phone, FileText, ArrowRight, X } from 'lucide-react';
import { Modal, Input, Button } from '../common';
import { useAuthStore } from '../../store';
import { kenyanPhoneSchema } from '../../utils/validators';

interface BecomeSellerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const BecomeSellerModal: React.FC<BecomeSellerModalProps> = ({ isOpen, onClose }) => {
    const { becomeSeller, isLoading, user } = useAuthStore();

    // Form State
    const [formData, setFormData] = useState({
        shopName: '',
        shopLocation: user?.location || '',
        contactPerson: user?.name || '',
        contactPhone: user?.phone || '',
        refundPolicy: ''
    });

    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Basic Validation
        if (!formData.shopName || !formData.shopLocation || !formData.contactPerson || !formData.contactPhone) {
            setError('Please fill in all required fields');
            return;
        }

        const phoneResult = kenyanPhoneSchema.safeParse(formData.contactPhone);
        if (!phoneResult.success) {
            setError('Invalid contact phone number');
            return;
        }

        try {
            await becomeSeller(formData);
            onClose();
        } catch (err) {
            setError('Failed to create seller profile. Please try again.');
        }
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg" showCloseButton={false}>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900">
                        Start Selling
                    </h2>
                    <p className="text-sm text-slate-500">Launch your shop on SokoSnap today.</p>
                </div>
                <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900">
                    <X size={24} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Shop Details</h3>
                        <Input
                            label="Shop Name"
                            placeholder="e.g. Nairobi Kicks"
                            value={formData.shopName}
                            onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                            leftIcon={<Store size={16} />}
                            required
                        />
                        <Input
                            label="Shop Location"
                            placeholder="e.g. Soko Safi Mall, Shop B2"
                            value={formData.shopLocation}
                            onChange={(e) => setFormData({ ...formData, shopLocation: e.target.value })}
                            leftIcon={<MapPin size={16} />}
                            required
                        />
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Contact Info</h3>
                        <Input
                            label="Contact Person"
                            placeholder="Manager Name"
                            value={formData.contactPerson}
                            onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                            leftIcon={<User size={16} />}
                            required
                        />
                        <Input
                            type="tel"
                            label="Business Phone"
                            placeholder="07XX XXX XXX"
                            value={formData.contactPhone}
                            onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                            leftIcon={<Phone size={16} />}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Refund Policy (Optional)</h3>
                    <div className="relative">
                        <FileText className="absolute left-3 top-3 text-slate-400" size={16} />
                        <textarea
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 min-h-[80px]"
                            placeholder="Describe your return and refund policy..."
                            value={formData.refundPolicy}
                            onChange={(e) => setFormData({ ...formData, refundPolicy: e.target.value })}
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg text-center">
                        {error}
                    </div>
                )}

                <Button
                    type="submit"
                    fullWidth
                    variant="primary"
                    isLoading={isLoading}
                    rightIcon={<ArrowRight size={18} />}
                >
                    Create Seller Profile
                </Button>
            </form>
        </Modal>
    );
};
