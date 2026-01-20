"use client";

import { useEffect, useState } from "react";
import { fetchCachedImage } from "@/lib/imageCache";

interface CachedImageProps {
    src: string;
    alt: string;
    className?: string;
    fallback?: React.ReactNode;
}

export function CachedImage({ src, alt, className, fallback }: CachedImageProps) {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let mounted = true;
        let objectUrl: string | null = null;

        async function loadImage() {
            if (!src) {
                setLoading(false);
                setError(true);
                return;
            }

            try {
                const cachedSrc = await fetchCachedImage(src);
                if (mounted) {
                    if (cachedSrc.startsWith('blob:')) {
                        objectUrl = cachedSrc;
                    }
                    setImageSrc(cachedSrc);
                    setLoading(false);
                }
            } catch {
                if (mounted) {
                    setImageSrc(src);
                    setLoading(false);
                }
            }
        }

        loadImage();

        return () => {
            mounted = false;
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [src]);

    if (loading) {
        return (
            <div className={className}>
                <div className="w-full h-full bg-muted/20 animate-pulse" />
            </div>
        );
    }

    if (error || !imageSrc) {
        return fallback ? <>{fallback}</> : null;
    }

    return (
        <img
            src={imageSrc}
            alt={alt}
            className={className}
            onError={() => {
                if (imageSrc !== src) {
                    setImageSrc(src);
                } else {
                    setError(true);
                }
            }}
        />
    );
}