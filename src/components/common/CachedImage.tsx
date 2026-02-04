import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

interface CachedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    fallback?: React.ReactNode;
}

const CACHE_NAME = 'sokosnap-image-cache-v1';

export const CachedImage: React.FC<CachedImageProps> = ({ src, alt, className, fallback, ...props }) => {
    const [imageSrc, setImageSrc] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const loadImage = async () => {
            if (!src) {
                setError(true);
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(false);

                // 1. Check Cache
                const cache = await caches.open(CACHE_NAME);
                const cachedResponse = await cache.match(src);

                if (cachedResponse) {
                    const blob = await cachedResponse.blob();
                    if (isMounted) {
                        setImageSrc(URL.createObjectURL(blob));
                        setIsLoading(false);
                    }
                    return;
                }

                // 2. Fetch Network
                const response = await fetch(src, { mode: 'cors' });
                if (!response.ok) throw new Error('Network response was not ok');

                const blob = await response.blob();

                // 3. Save to Cache
                await cache.put(src, new Response(blob));

                if (isMounted) {
                    setImageSrc(URL.createObjectURL(blob));
                    setIsLoading(false);
                }
            } catch (err) {
                console.warn(`[ImageCache] Failed to load ${src}`, err);
                if (isMounted) {
                    // Fallback to direct source if cache logic fails (e.g. CORS)
                    setImageSrc(src);
                    setIsLoading(false);
                }
            }
        };

        loadImage();

        return () => {
            isMounted = false;
            // Cleanup ObjectURLs if needed? 
            // Browser handles this mostly, but explicit revoke is good if we churn a lot.
        };
    }, [src]);

    if (error) {
        return <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
            <AlertCircle className="text-gray-300" />
        </div>;
    }

    if (isLoading) {
        return <div className={`animate-pulse bg-gray-200 ${className}`} />;
    }

    return (
        <img
            src={imageSrc || src}
            alt={alt}
            className={className}
            onError={() => setError(true)}
            {...props}
        />
    );
};
