"use client";

import React, { useState } from "react";
import Image from "next/image";

export default function OptimizedImage({
    src,
    alt = "Nearbuy vendor asset",
    fill = false,
    width,
    height,
    className = "",
    fallbackSrc = "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80",
}) {
    const [imgSrc, setImgSrc] = useState(src || fallbackSrc);

    return (
        <div className={`relative overflow-hidden ${className}`}>
            <Image
                src={imgSrc}
                alt={alt}
                fill={fill}
                width={!fill ? width || 400 : undefined}
                height={!fill ? height || 400 : undefined}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="lazy"
                quality={85} // Perfect balance between compression quality and blazing fast speed
                onError={() => setImgSrc(fallbackSrc)}
                className="object-cover transition-transform duration-300 hover:scale-105"
            />
        </div>
    );
}