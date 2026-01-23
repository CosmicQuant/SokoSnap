/**
 * AppShell Component
 * Responsive layout wrapper that provides:
 * - Mobile: Full-screen TikTok-style experience
 * - Desktop: Centered phone mockup with decorative sidebars
 */

import React from 'react';
import { ShoppingBag, Play, ShieldCheck, Zap, Star } from 'lucide-react';
import { Logo } from '../common';

interface AppShellProps {
    children: React.ReactNode;
}

/**
 * Left Sidebar - Branding & Features
 */
const LeftSidebar: React.FC = () => (
    <div className="desktop-sidebar-left">
        {/* Logo */}
        <div className="mb-6 flex flex-col items-center">
            <Logo size={64} />
            <div className="mt-4 text-center">
                <h1 className="sidebar-title mt-0">SokoSnap</h1>
                <p className="sidebar-subtitle">by TumaFast</p>
            </div>
        </div>

        {/* Features */}
        <div className="sidebar-feature">
            <div className="sidebar-feature-icon">
                <ShieldCheck size={18} />
            </div>
            <div>
                <p className="sidebar-feature-title">Pesa Salama</p>
                <p className="sidebar-feature-desc">M-Pesa protected payments</p>
            </div>
        </div>

        <div className="sidebar-feature">
            <div className="sidebar-feature-icon">
                <Play size={18} />
            </div>
            <div>
                <p className="sidebar-feature-title">Video Commerce</p>
                <p className="sidebar-feature-desc">Shop from image and video feeds</p>
            </div>
        </div>

        <div className="sidebar-feature">
            <div className="sidebar-feature-icon">
                <Zap size={18} />
            </div>
            <div>
                <p className="sidebar-feature-title">Instant Checkout</p>
                <p className="sidebar-feature-desc">Nunua haraka sana</p>
            </div>
        </div>
    </div>
);

/**
 * Right Sidebar - Stats & Social Proof
 */
const RightSidebar: React.FC = () => (
    <div className="desktop-sidebar-right">
        {/* Stats */}
        <div className="sidebar-stat">
            <p className="sidebar-stat-value">50K+</p>
            <p className="sidebar-stat-label">Active Sellers</p>
        </div>

        <div className="sidebar-stat">
            <p className="sidebar-stat-value">KES 2M+</p>
            <p className="sidebar-stat-label">Secured Daily</p>
        </div>

        {/* Stars */}
        <div className="sidebar-stars">
            {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={16} className="text-green-500 fill-green-500" />
            ))}
        </div>
        <p className="sidebar-trust-text">Trusted by thousands</p>

        {/* App Buttons */}
        <div className="sidebar-app-buttons">
            <p className="sidebar-trust-text" style={{ marginBottom: '8px' }}>Get the app</p>
            <button className="sidebar-app-btn">📱 App Store</button>
            <button className="sidebar-app-btn">▶️ Play Store</button>
        </div>
    </div>
);

/**
 * Main App Shell
 */
export const AppShell: React.FC<AppShellProps> = ({ children }) => {
    return (
        <div className="app-shell">
            {/* Left Sidebar - Desktop Only */}
            <LeftSidebar />

            {/* Main App Container */}
            <div className="app-container">
                {/* Phone Notch - Desktop Only */}
                <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 z-50">
                    <div className="w-28 h-5 bg-black rounded-b-xl" />
                </div>

                {/* App Content */}
                {children}

                {/* Home Indicator - Desktop Only */}
                <div className="hidden md:block absolute bottom-2 left-1/2 -translate-x-1/2 z-50">
                    <div className="w-24 h-1 bg-white/30 rounded-full" />
                </div>
            </div>

            {/* Right Sidebar - Desktop Only */}
            <RightSidebar />
        </div>
    );
};

export default AppShell;
