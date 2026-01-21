import React from 'react';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
    width?: string | number;
    height?: string | number;
    animation?: 'pulse' | 'wave' | 'none';
}

/**
 * Base Skeleton component for loading states
 */
export const Skeleton: React.FC<SkeletonProps> = ({
    className = '',
    variant = 'text',
    width,
    height,
    animation = 'pulse',
}) => {
    const baseClasses = 'bg-slate-200';

    const variantClasses = {
        text: 'rounded',
        circular: 'rounded-full',
        rectangular: '',
        rounded: 'rounded-xl',
    };

    const animationClasses = {
        pulse: 'animate-pulse',
        wave: 'animate-shimmer',
        none: '',
    };

    const style: React.CSSProperties = {
        width: width ?? (variant === 'text' ? '100%' : undefined),
        height: height ?? (variant === 'text' ? '1em' : undefined),
    };

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
            style={style}
            aria-hidden="true"
            role="presentation"
        />
    );
};

/**
 * Product Feed Skeleton - Used in the main feed while loading
 */
export const ProductFeedSkeleton: React.FC = () => (
    <div className="h-full w-full bg-slate-900 relative flex flex-col">
        {/* Media placeholder */}
        <div className="absolute inset-0 bg-slate-800 animate-pulse" />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90" />

        {/* Right action bar */}
        <div className="absolute right-4 bottom-28 z-30 flex flex-col items-center gap-6 pb-4">
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="circular" width={44} height={44} />
            <Skeleton variant="circular" width={44} height={44} />
            <Skeleton variant="circular" width={44} height={44} />
            <Skeleton variant="circular" width={44} height={44} />
        </div>

        {/* Bottom info */}
        <div className="relative z-20 mt-auto px-4 pb-6 space-y-4 max-w-[85%]">
            <div className="flex items-center gap-2 mb-2">
                <Skeleton width={100} height={16} className="bg-white/20" />
                <Skeleton width={80} height={20} className="bg-white/20 rounded-full" />
            </div>

            <div className="space-y-2">
                <Skeleton width="90%" height={14} className="bg-white/20" />
                <Skeleton width="70%" height={20} className="bg-white/20" />
            </div>

            <div className="flex items-stretch gap-2 h-14 pt-2">
                <div className="flex-1 bg-white/10 rounded-xl animate-pulse" />
                <div className="flex-[2] bg-emerald-500/30 rounded-xl animate-pulse" />
            </div>
        </div>
    </div>
);

/**
 * Cart Item Skeleton
 */
export const CartItemSkeleton: React.FC = () => (
    <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex gap-4 animate-pulse">
        <Skeleton variant="rounded" width={80} height={80} />
        <div className="flex-1 flex flex-col justify-between py-1">
            <div>
                <Skeleton width={60} height={10} className="mb-2" />
                <Skeleton width="80%" height={16} />
            </div>
            <div className="flex items-end justify-between">
                <Skeleton width={80} height={18} />
                <Skeleton variant="rounded" width={36} height={36} />
            </div>
        </div>
    </div>
);

/**
 * Order Card Skeleton
 */
export const OrderSkeleton: React.FC = () => (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm animate-pulse">
        <div className="flex items-center gap-4">
            <Skeleton variant="rounded" width={48} height={48} />
            <div>
                <Skeleton width={100} height={16} className="mb-2" />
                <Skeleton width={70} height={12} />
            </div>
        </div>
        <div className="text-right">
            <Skeleton width={80} height={16} className="mb-2" />
            <Skeleton width={60} height={18} className="rounded-full" />
        </div>
    </div>
);

/**
 * Profile Header Skeleton
 */
export const ProfileHeaderSkeleton: React.FC = () => (
    <div className="px-6 pt-12 pb-8 bg-slate-900 animate-pulse">
        <Skeleton variant="circular" width={24} height={24} className="mb-6 bg-slate-700" />
        <div className="flex items-center gap-4 mb-6">
            <Skeleton variant="circular" width={64} height={64} className="bg-slate-700" />
            <div>
                <Skeleton width={120} height={24} className="mb-2 bg-slate-700" />
                <Skeleton width={100} height={20} className="bg-slate-700 rounded-full" />
            </div>
        </div>
        <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
            <Skeleton width={80} height={12} className="mb-2 bg-slate-700" />
            <Skeleton width={120} height={28} className="bg-slate-700" />
        </div>
    </div>
);

/**
 * Dashboard Stats Skeleton
 */
export const DashboardStatsSkeleton: React.FC = () => (
    <div className="bg-slate-900 text-white p-6 rounded-[2rem] shadow-xl animate-pulse">
        <div className="flex justify-between items-start mb-6">
            <div>
                <Skeleton width={120} height={12} className="mb-2 bg-slate-700" />
                <Skeleton width={180} height={32} className="bg-slate-700" />
            </div>
            <Skeleton variant="rounded" width={40} height={40} className="bg-slate-700" />
        </div>
        <div className="flex gap-4">
            <div className="flex-1 bg-slate-800 p-4 rounded-2xl">
                <Skeleton width={80} height={10} className="mb-2 bg-slate-700" />
                <Skeleton width={100} height={22} className="bg-slate-700" />
            </div>
            <div className="flex-1 bg-slate-800 p-4 rounded-2xl">
                <Skeleton width={80} height={10} className="mb-2 bg-slate-700" />
                <Skeleton width={60} height={22} className="bg-slate-700" />
            </div>
        </div>
    </div>
);

/**
 * Chart Skeleton
 */
export const ChartSkeleton: React.FC = () => (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm h-64 animate-pulse">
        <div className="flex justify-between items-center mb-6">
            <Skeleton width={100} height={18} />
            <Skeleton width={60} height={24} className="rounded-full" />
        </div>
        <div className="h-40 flex items-end justify-around gap-2">
            {[40, 60, 80, 50, 90, 70, 55].map((height, i) => (
                <Skeleton
                    key={i}
                    variant="rounded"
                    width="12%"
                    height={`${height}%`}
                    className="bg-emerald-100"
                />
            ))}
        </div>
    </div>
);

/**
 * Lead Card Skeleton
 */
export const LeadSkeleton: React.FC = () => (
    <div className="bg-white border border-slate-100 p-4 rounded-2xl flex items-center justify-between shadow-sm animate-pulse">
        <div className="flex items-center gap-4">
            <Skeleton variant="circular" width={40} height={40} />
            <div>
                <Skeleton width={120} height={16} className="mb-2" />
                <Skeleton width={180} height={12} />
            </div>
        </div>
        <Skeleton variant="rounded" width={80} height={32} />
    </div>
);

/**
 * Multiple skeletons renderer
 */
export const SkeletonList: React.FC<{
    count?: number;
    skeleton: React.ReactNode;
    gap?: string;
}> = ({ count = 3, skeleton, gap = 'gap-4' }) => (
    <div className={`flex flex-col ${gap}`}>
        {Array.from({ length: count }).map((_, index) => (
            <React.Fragment key={index}>{skeleton}</React.Fragment>
        ))}
    </div>
);

export default Skeleton;
