import React, { useEffect } from 'react';
import { ShieldCheck, ArrowLeft, Mail, FileText, Lock, Globe, Cookie, Store, MessageSquare, MapPin, Send, ArrowRight } from 'lucide-react';

const InstagramLogo = ({ size = 24 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <radialGradient id="insta-gradient-info" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(6.5 23) rotate(-57.947) scale(29.155 28.3276)">
                <stop offset="0" stopColor="#FFC107" />
                <stop offset="0.5" stopColor="#F44336" />
                <stop offset="1" stopColor="#9C27B0" />
            </radialGradient>
        </defs>
        <path fillRule="evenodd" clipRule="evenodd" d="M12 0C8.741 0 8.332 0.014 7.052 0.072C2.695 0.272 0.273 2.69 0.073 7.052C0.014 8.333 0 8.741 0 12C0 15.259 0.014 15.668 0.073 16.948C0.273 21.306 2.69 23.728 7.052 23.928C8.332 23.986 8.741 24 12 24C15.259 24 15.668 23.986 16.948 23.928C21.302 23.728 23.73 21.31 23.927 16.948C23.986 15.668 24 15.259 24 12C24 8.741 23.986 8.333 23.927 7.052C23.73 2.699 21.302 0.272 16.948 0.072C15.668 0.014 15.259 0 12 0ZM12 2.162C15.204 2.162 15.584 2.174 16.85 2.232C20.102 2.38 21.621 3.902 21.769 7.15C21.827 8.416 21.838 8.796 21.838 12C21.838 15.204 21.827 15.584 21.769 16.85C21.621 20.098 20.102 21.62 16.85 21.768C15.584 21.826 15.204 21.838 12 21.838C8.796 21.838 8.416 21.826 7.15 21.768C3.894 21.62 2.38 20.098 2.231 16.85C2.173 15.584 2.162 15.204 2.162 12C2.162 8.796 2.173 8.416 2.231 7.15C2.38 3.902 3.894 2.38 7.15 2.232C8.416 2.174 8.796 2.162 12 2.162ZM12 5.838C8.597 5.838 5.838 8.597 5.838 12C5.838 15.403 8.597 18.162 12 18.162C15.403 18.162 18.162 15.403 18.162 12C18.162 8.597 15.403 5.838 12 5.838ZM12 16C9.791 16 8 14.209 8 12C8 9.791 9.791 8 12 8C14.209 8 16 9.791 16 12C16 14.209 14.209 16 12 16ZM18.406 4.155C17.61 4.155 16.965 4.8 16.965 5.595C16.965 6.39 17.61 7.035 18.406 7.035C19.201 7.035 19.845 6.39 19.845 5.595C19.845 4.8 19.201 4.155 18.406 4.155Z" fill="url(#insta-gradient-info)" />
    </svg>
);

const WhatsAppLogo = ({ size = 24 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M12.007 0C5.378 0 0 5.377 0 12.006C0 14.12 0.55 16.182 1.597 18L0.05 23.636L5.823 22.122C7.575 23.078 9.57 23.582 11.996 23.582H12.006C18.634 23.582 24 18.271 24 11.996C24 5.388 18.625 0 12.007 0ZM12.007 21.602H11.997C9.96 21.602 8.01 21.056 6.34 20.066L5.94 19.83L2.52 20.728L3.43 17.39L3.17 16.974C2.09 15.26 1.52 13.33 1.52 11.996C1.52 6.216 6.22 1.518 12.007 1.518C17.78 1.518 22.48 6.216 22.48 11.996C22.48 17.786 17.79 21.602 12.007 21.602ZM17.71 14.39C17.4 14.23 15.86 13.47 15.57 13.37C15.29 13.27 15.08 13.22 14.87 13.53C14.66 13.84 14.06 14.54 13.88 14.75C13.7 14.95 13.51 14.98 13.21 14.82C12.91 14.67 11.93 14.35 10.77 13.32C9.87 12.51 9.27 11.52 8.97 11.01C8.67 10.49 8.94 10.21 9.09 10.06C9.22 9.93 9.38 9.72 9.54 9.54C9.69 9.35 9.74 9.22 9.85 9.01C9.95 8.8 9.9 8.62 9.82 8.46C9.74 8.29 9.12 6.78 8.86 6.16C8.61 5.56 8.36 5.64 8.16 5.64L7.59 5.63C7.38 5.63 7.04 5.71 6.75 6.02C6.46 6.33 5.64 7.1 5.64 8.67C5.64 10.23 6.78 11.75 6.94 11.96C7.1 12.17 9.17 15.36 12.33 16.73C13.08 17.05 13.67 17.25 14.13 17.39C14.96 17.65 15.72 17.63 16.32 17.54C16.98 17.44 18.35 16.71 18.64 15.91C18.93 15.11 18.93 14.42 18.84 14.27C18.75 14.12 18.52 14.03 18.22 13.88L17.71 14.39Z" fill="#25D366" />
    </svg>
);

const FacebookLogo = ({ size = 24 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 17.9895 4.3882 22.954 10.125 23.8534V15.4688H7.07813V12H10.125V9.35625C10.125 6.34875 11.9166 4.6875 14.6576 4.6875C15.9701 4.6875 17.3438 4.92188 17.3438 4.92188V7.875H15.8306C14.34 7.875 13.875 8.8 13.875 9.75V12H17.2031L16.6711 15.4688H13.875V23.8534C19.6118 22.954 24 17.9895 24 12Z" fill="#1877F2" />
    </svg>
);

interface InfoPageProps {
    page: string;
    onBack: () => void;
    onNavigate: (page: string) => void;
}

const Footer = ({ onNavigate }: { onNavigate: (page: string) => void }) => (
    <footer className="bg-white border-t border-slate-100 py-6">
        <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                {/* Brand Block - Restored & Minimal */}
                <div className="max-w-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center transform -rotate-3">
                            <Store className="text-black" size={16} />
                        </div>
                        <span className="font-black italic text-xl tracking-tighter text-slate-900">SokoSnap</span>
                    </div>
                    <p className="text-slate-400 text-xs font-medium leading-relaxed mb-4">
                        The secure social commerce platform for African sellers. Powered by TumaFast Logistics.
                    </p>

                    <div className="flex flex-col gap-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nairobi, KE</span>

                        <div className="flex gap-4">
                            <a href="#" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"><InstagramLogo size={16} /></a>
                            <a href="#" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"><WhatsAppLogo size={16} /></a>
                            <a href="#" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"><FacebookLogo size={16} /></a>
                        </div>

                        <p className="text-[10px] text-slate-400 font-medium">© 2026 TumaFast Ltd. All rights reserved.</p>
                    </div>
                </div>

                {/* Horizontal Links - Smaller Font */}
                <div className="flex flex-wrap md:justify-end gap-x-8 gap-y-4 max-w-lg text-[10px] font-bold uppercase tracking-widest text-slate-500 pt-2 cursor-pointer">
                    <span onClick={() => onNavigate('about')} className="hover:text-black transition-colors">About SokoSnap</span>
                    <span onClick={() => onNavigate('terms')} className="hover:text-black transition-colors">Terms of Service</span>
                    <span onClick={() => onNavigate('privacy')} className="hover:text-black transition-colors">Privacy Policy</span>
                    <span onClick={() => onNavigate('cookies')} className="hover:text-black transition-colors">Cookie Policy</span>
                    <span onClick={() => onNavigate('merchant')} className="hover:text-black transition-colors">Merchant Agreement</span>
                    <span onClick={() => onNavigate('contact')} className="hover:text-black transition-colors">Contact Us</span>
                </div>
            </div>
        </div>
    </footer>
);

export const SellerInfoPages: React.FC<InfoPageProps> = ({ page, onBack, onNavigate }) => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [page]);

    const renderContent = () => {
        switch (page) {
            case 'about':
                return (
                    <div className="space-y-8 animate-in slide-in-from-right duration-500">
                        <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-8 md:p-12 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-6 relative z-10">Reinventing Social Commerce</h1>
                            <p className="font-medium text-lg md:text-xl leading-relaxed opacity-90 max-w-2xl relative z-10">
                                SokoSnap is Africa's first Trust-as-a-Service platform. We bridge the gap between "Tuma Deposit" and "Payment on Delivery" by using a <b>Secure Hold</b> system until delivery is confirmed.
                            </p>
                        </div>

                        <div className="prose prose-slate max-w-none">
                            <p className="text-xl font-medium text-slate-900 leading-relaxed">
                                We are building the trust infrastructure for the informal economy. For years, online sellers have lost customers due to lack of trust, and buyers have lost money to scams. SokoSnap solves this by acting as a neutral guardian.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm mb-4"><Globe className="text-yellow-500" /></div>
                                <h3 className="font-black text-lg mb-2 text-slate-900">Our Mission</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">To empower every African hustler with the tools to sell globally with the security and professional reputation of a major retailer.</p>
                            </div>
                            <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm mb-4"><ShieldCheck className="text-[#25D366]" /></div>
                                <h3 className="font-black text-lg mb-2 text-slate-900">Our Promise</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">Zero fraud. Zero uncertainty. We only release funds when the customer touches the product.</p>
                            </div>
                            <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm mb-4"><Lock className="text-blue-500" /></div>
                                <h3 className="font-black text-lg mb-2 text-slate-900">Secure Hold</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">Our proprietary payment protection system ensures that both parties are protected throughout the transaction lifecycle.</p>
                            </div>
                        </div>
                    </div>
                );
            case 'terms':
                return (
                    <div className="space-y-8 animate-in slide-in-from-right duration-500 text-slate-600">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center text-yellow-600">
                                <FileText size={32} />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-slate-900">Terms of Service</h1>
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">Last Updated: January 25, 2026</p>
                            </div>
                        </div>

                        <div className="prose prose-slate max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:text-slate-900">
                            <p className="lead font-medium text-lg">
                                Welcome to SokoSnap. By accessing our platform, creating a shop, or making a purchase, you agree to be bound by these Terms of Service. These terms constitute a legally binding agreement between you ("User") and TumaFast Ltd ("Company", "We", "Us").
                            </p>

                            <h3>1. The SokoSnap Platform</h3>
                            <p>
                                SokoSnap is a technology platform that facilitates social commerce transactions. We provide:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 marker:text-yellow-500">
                                <li>A mechanism for Sellers to generate checkout links for products.</li>
                                <li>A <b>Secure Hold</b> payment processing service where funds are held temporarily until delivery confirmation.</li>
                                <li>Integrated logistics coordination via TumaFast Delivery partners.</li>
                            </ul>
                            <p className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-sm">
                                <b>Important Note:</b> SokoSnap is not a bank. The Secure Hold service is a transaction management tool designed to ensure fulfillment obligations are met before funds settlement.
                            </p>

                            <h3>2. Account Registration</h3>
                            <p>
                                You must provide accurate, current, and complete information during the registration process. Sellers must verify their identity (KYC) to receive payouts. TumaFast reserves the right to suspend accounts with suspicious activity or unverified details.
                            </p>

                            <h3>3. Secure Hold & Payments</h3>
                            <p>
                                All payments made via SokoSnap link are processed through mobile money providers (e.g., M-Pesa). Funds are immediately placed in a <b>Secure Hold</b> state.
                            </p>
                            <ul>
                                <li><b>Release of Funds:</b> Funds are released to the Seller's wallet only after the Buyer (or TumaFast Rider) confirms receipt of the goods.</li>
                                <li><b>Disputes:</b> If a buyer raises a dispute within the delivery window, funds remain in Secure Hold until resolution.</li>
                                <li><b>Fees:</b> We charge a platform transaction fee (typically 2.5% - 5%) per successful sale, which is deducted from the payout.</li>
                            </ul>

                            <h3>4. Delivery & Logistics</h3>
                            <p>
                                Sellers agree to hand over goods to TumaFast logistics partners within 24 hours of order notification. Failure to fulfill orders promptly may result in transaction cancellation and refund to the buyer.
                            </p>

                            <h3>5. Prohibited Items</h3>
                            <p>
                                You may not use SokoSnap to sell illegal goods, weapons, counterfeit items, or adult content. Violation of this policy will result in immediate permanent ban and report to authorities.
                            </p>

                            <h3>6. Limitation of Liability</h3>
                            <p>
                                TumaFast Ltd is not a party to the contract between Buyer and Seller. We are not liable for the quality, safety, or legality of items advertised. Our liability is limited to the amount of the transaction fee earned.
                            </p>
                        </div>
                    </div>
                );
            case 'privacy':
                return (
                    <div className="space-y-8 animate-in slide-in-from-right duration-500 text-slate-600">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
                                <Lock size={32} />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-slate-900">Privacy Policy</h1>
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">Your Data is Sacred</p>
                            </div>
                        </div>

                        <div className="prose prose-slate max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:text-slate-900">
                            <p className="lead font-medium text-lg">
                                At SokoSnap, we believe privacy is a fundamental right. This policy outlines how we collect, use, and protect your personal information in compliance with the Kenya Data Protection Act, 2019.
                            </p>

                            <h3>1. Information We Collect</h3>
                            <ul>
                                <li><b>Identity Data:</b> Name, National ID (for Sellers), Phone Number.</li>
                                <li><b>Transactional Data:</b> Payment details, M-Pesa transaction codes, Order history.</li>
                                <li><b>Location Data:</b> Delivery addresses and GPS coordinates for logistics fulfillment.</li>
                                <li><b>Device Data:</b> IP address, browser type, and device identifiers for fraud prevention.</li>
                            </ul>

                            <h3>2. How We Use Your Data</h3>
                            <p>We do not sell your data to advertisers. We use your data strictly to:</p>
                            <ul className="list-disc pl-5 space-y-2 marker:text-green-500">
                                <li>Facilitate the Secure Hold payment and subsequent payout.</li>
                                <li>Coordinate delivery with our logistics partners (Riders receive strictly necessary contact info).</li>
                                <li>Verify your identity to prevent fraud and money laundering.</li>
                                <li>Send transaction notifications via SMS or WhatsApp.</li>
                            </ul>

                            <h3>3. Data Security</h3>
                            <p>
                                We employ military-grade encryption for all sensitive data. Access to personal data is restricted to authorized TumaFast employees on a need-to-know basis.
                            </p>

                            <h3>4. Your Rights</h3>
                            <p>
                                You have the right to request access to your data, correction of inaccuracies, or deletion of your account. Contact our Data Protection Officer at privacy@sokosnap.com for any requests.
                            </p>
                        </div>
                    </div>
                );
            case 'merchant':
                return (
                    <div className="space-y-8 animate-in slide-in-from-right duration-500 text-slate-600">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                                <ShieldCheck size={32} />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-slate-900">Merchant Agreement</h1>
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">Elite Seller Standards</p>
                            </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-100 p-6 rounded-2xl mb-8">
                            <p className="font-bold text-yellow-800 text-xs uppercase tracking-widest mb-1">Elite Merchant Status</p>
                            <p className="text-yellow-900 font-medium text-sm">This agreement governs your status as a Verified Merchant on SokoSnap. Violation of these terms may result in loss of your Gold Verification Badge and account termination.</p>
                        </div>

                        <div className="prose prose-slate max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:text-slate-900">
                            <h3>1. Product Authenticity Guarantee</h3>
                            <p>
                                You represent and warrant that all items listed are genuine, authentic, and free from any liens or encumbrances. The sale of counterfeit goods ("fakes") is strictly prohibited. If a buyer demonstrates an item is fake, you agree to a full refund including shipping costs.
                            </p>

                            <h3>2. The "Secure Hold" Mandate</h3>
                            <p>
                                You acknowledge that SokoSnap will not settle funds to your mobile wallet until delivery is confirmed. You agree not to demand direct payment ("Tuma Deposit") from buyers originating from SokoSnap links, as this violates the platform's trust promise.
                            </p>

                            <h3>3. Fulfillment Service Level Agreement (SLA)</h3>
                            <ul>
                                <li><b>Dispatch Time:</b> Orders must be ready for pickup within 24 hours.</li>
                                <li><b>Packaging:</b> Items must be packaged securely to prevent damage during transit.</li>
                                <li><b>Availability:</b> You must maintain accurate stock levels. Canceling paid orders due to stockouts affects your merchant score.</li>
                            </ul>

                            <h3>4. Returns & Refunds</h3>
                            <p>
                                You generally agree to accept returns for defective or materially different items within 48 hours of delivery. SokoSnap acts as the final arbiter in such disputes.
                            </p>
                        </div>
                    </div>
                );
            case 'cookies':
                return (
                    <div className="space-y-8 animate-in slide-in-from-right duration-500 text-slate-600">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600">
                                <Cookie size={32} />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-slate-900">Cookie Policy</h1>
                        </div>

                        <div className="prose prose-slate max-w-none">
                            <p className="lead">
                                We use cookies and similar tracking technologies to track the activity on our Service and store certain information.
                            </p>
                            <p>
                                <b>Essential Cookies:</b> These are necessary for the website to function (e.g., maintaining your login session, remembering your shopping cart). You cannot opt out of these.
                            </p>
                            <p>
                                <b>Analytics Cookies:</b> We use these to understand how you use our site so we can improve it. These are optional.
                            </p>
                        </div>
                    </div>
                );
            case 'contact':
                return (
                    <div className="space-y-12 animate-in slide-in-from-right duration-500">
                        <div className="text-center mb-8">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Need Assistance?</span>
                            <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-900 mt-2">Get in Touch</h1>
                            <p className="text-slate-500 text-lg mt-2 max-w-2xl mx-auto">
                                Our support team is here to help you with any questions about your seller account, orders, or payments.
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Contact Info Cards */}
                            <div className="space-y-4">
                                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                    <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center mb-4 text-yellow-600">
                                        <MessageSquare size={24} />
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-900 mb-1">Chat Support</h3>
                                    <p className="text-sm text-slate-500 mb-4">Immediate assistance via WhatsApp for urgent issues.</p>
                                    <a href="https://wa.me/254700000000" className="text-sm font-bold text-yellow-600 hover:text-yellow-700 flex items-center gap-1">
                                        Chat Now <ArrowRight size={16} />
                                    </a>
                                </div>

                                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-600">
                                        <Mail size={24} />
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-900 mb-1">Email Us</h3>
                                    <p className="text-sm text-slate-500 mb-4">Send us a detailed message and we'll reply within 24h.</p>
                                    <a href="mailto:support@sokosnap.com" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                        support@sokosnap.com
                                    </a>
                                </div>

                                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                    <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mb-4 text-purple-600">
                                        <MapPin size={24} />
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-900 mb-1">Visit Us</h3>
                                    <p className="text-sm text-slate-500 mb-4">SokoSnap HQ, Westlands, content house, 5th Floor.</p>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Mon-Fri: 9am - 5pm</p>
                                </div>
                            </div>

                            {/* Contact Form */}
                            <div className="lg:col-span-2 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200">
                                <h3 className="text-2xl font-black text-slate-900 mb-6">Send a Message</h3>
                                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Full Name</label>
                                            <input type="text" className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-900 outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 transition-all" placeholder="John Doe" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Email Address</label>
                                            <input type="email" className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-900 outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 transition-all" placeholder="john@example.com" />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Subject</label>
                                        <select className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-900 outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 transition-all appearance-none cursor-pointer">
                                            <option>General Inquiry</option>
                                            <option>Order Issue</option>
                                            <option>Payment Support</option>
                                            <option>Account Verification</option>
                                            <option>Report a Bug</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Message</label>
                                        <textarea rows={5} className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm font-medium text-slate-900 outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 transition-all resize-none" placeholder="How can we help you today?"></textarea>
                                    </div>

                                    <div className="pt-4">
                                        <button className="bg-slate-900 text-white w-full py-4 rounded-2xl font-black text-lg shadow-lg shadow-slate-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 hover:bg-slate-800">
                                            Send Message <Send size={18} />
                                        </button>
                                        <p className="text-center text-xs text-slate-400 mt-4 font-medium">We typically reply within 24 hours.</p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto pt-8 px-6 pb-24">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-black mb-12 transition-colors sticky top-6 bg-white/80 backdrop-blur-sm py-3 px-4 rounded-full w-fit z-50 border border-slate-100 shadow-sm"
                >
                    <ArrowLeft size={16} /> Back to Home
                </button>

                {renderContent()}
            </div>

            <Footer onNavigate={onNavigate} />
        </div>
    );
};
