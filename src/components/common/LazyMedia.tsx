/**
 * LazyVideo Component
 * Video component with lazy loading using Intersection Observer
 */

import React, { useRef, useState, useEffect } from 'react';
import { useIntersectionObserver } from '../../hooks';

export interface LazyVideoProps {
    src: string;
    poster?: string;
    className?: string;
    autoPlay?: boolean;
    loop?: boolean;
    muted?: boolean;
    playsInline?: boolean;
    preload?: 'none' | 'metadata' | 'auto';
    onLoad?: () => void;
    onError?: (error: Error) => void;
}

export const LazyVideo: React.FC<LazyVideoProps> = ({
    src,
    poster,
    className = '',
    autoPlay = true,
    loop = true,
    muted = true,
    playsInline = true,
    preload = 'none',
    onLoad,
    onError,
}) => {
    const [containerRef, isVisible] = useIntersectionObserver<HTMLDivElement>({
        threshold: 0.5,
        rootMargin: '100px',
    });
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    // Handle video playback based on visibility
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (isVisible && isLoaded) {
            video.play().catch(() => {
                // Autoplay might be blocked, that's okay
            });
        } else {
            video.pause();
        }
    }, [isVisible, isLoaded]);

    const handleLoadedData = () => {
        setIsLoaded(true);
        onLoad?.();
    };

    const handleError = () => {
        setHasError(true);
        onError?.(new Error('Video failed to load'));
    };

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {/* Placeholder/Poster while loading */}
            {!isLoaded && !hasError && (
                <div className="absolute inset-0 bg-slate-800 animate-pulse flex items-center justify-center">
                    {poster && (
                        <img
                            src={poster}
                            alt=""
                            className="w-full h-full object-cover opacity-50"
                        />
                    )}
                </div>
            )}

            {/* Error state */}
            {hasError && (
                <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                    <p className="text-slate-400 text-sm">Video unavailable</p>
                </div>
            )}

            {/* Video element - only load src when visible */}
            <video
                ref={videoRef}
                src={isVisible ? src : undefined}
                poster={poster}
                autoPlay={autoPlay && isVisible}
                loop={loop}
                muted={muted}
                playsInline={playsInline}
                preload={preload}
                onLoadedData={handleLoadedData}
                onError={handleError}
                className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                aria-label="Product video"
            />
        </div>
    );
};

/**
 * LazyImage Component
 * Image component with lazy loading
 */
export interface LazyImageProps {
    src: string;
    alt: string;
    className?: string;
    placeholderClassName?: string;
    onLoad?: () => void;
    onError?: (error: Error) => void;
}

export const LazyImage: React.FC<LazyImageProps> = ({
    src,
    alt,
    className = '',
    placeholderClassName = '',
    onLoad,
    onError,
}) => {
    const [containerRef, isVisible] = useIntersectionObserver<HTMLDivElement>({
        threshold: 0.1,
        rootMargin: '200px',
    });
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    const handleLoad = () => {
        setIsLoaded(true);
        onLoad?.();
    };

    const handleError = () => {
        setHasError(true);
        onError?.(new Error('Image failed to load'));
    };

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {/* Placeholder while loading */}
            {!isLoaded && !hasError && (
                <div
                    className={`absolute inset-0 bg-slate-200 animate-pulse ${placeholderClassName}`}
                />
            )}

            {/* Error state */}
            {hasError && (
                <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
                    <p className="text-slate-400 text-xs">Image unavailable</p>
                </div>
            )}

            {/* Image element - only load src when visible */}
            {isVisible && (
                <img
                    src={src}
                    alt={alt}
                    onLoad={handleLoad}
                    onError={handleError}
                    loading="lazy"
                    className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                />
            )}
        </div>
    );
};

export default LazyVideo;
