"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function CategoryCard({ category }) {
  const { name, image, count, description } = category;

  const cardRef = useRef(null);

  // Motion values for normalized coordinate positions (-0.5 to 0.5)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for 3D card tilt - configured for a buttery-smooth floating feel
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), {
    stiffness: 150,
    damping: 20,
  });

  // Spotlight light-orb position state
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Normalize coordinates between -0.5 and 0.5 relative to center of card
    const normalizedX = (e.clientX - rect.left) / width - 0.5;
    const normalizedY = (e.clientY - rect.top) / height - 0.5;

    x.set(normalizedX);
    y.set(normalizedY);

    setHoverPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    // Smooth reset card position to center
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: 1000 }} className="h-full select-none outline-hidden">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="bg-white/95 backdrop-blur-md rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col h-full group relative border border-slate-100/70"
      >
        {/* Spotlight cursor inner light-orb glow */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
          style={{
            opacity: isHovering ? 1 : 0,
            background: `radial-gradient(130px circle at ${hoverPos.x}px ${hoverPos.y}px, rgba(168, 85, 247, 0.05), transparent 80%)`,
          }}
        />

        {/* Clean hardware-accelerated glowing border overlay */}
        <div
          className="absolute inset-0 pointer-events-none rounded-3xl border transition-all duration-300 z-20"
          style={{
            borderColor: isHovering ? "rgba(168, 85, 247, 0.25)" : "rgba(226, 232, 240, 0.4)",
            boxShadow: isHovering
              ? "inset 0 0 16px rgba(168, 85, 247, 0.02), 0 12px 36px -12px rgba(168, 85, 247, 0.06)"
              : "none",
          }}
        />

        {/* Category Image Container */}
        <div
          style={{ transform: "translateZ(20px)" }}
          className="relative h-52 w-full overflow-hidden bg-slate-50 shrink-0 rounded-t-[22px] z-0"
        >
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/50 via-transparent to-transparent" />
        </div>

        {/* Card Content */}
        <div
          style={{ transform: "translateZ(12px)" }}
          className="p-6 flex-1 flex flex-col justify-between font-body relative z-10"
        >
          <div>
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-heading font-black text-slate-900 text-lg group-hover:text-purple-600 transition-colors">
                {name}
              </h3>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-100 px-3 py-1 rounded-full shrink-0 shadow-xs">
                {count} stores
              </span>
            </div>
            <p className="mt-2.5 text-sm text-slate-500 leading-relaxed">
              {description}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100/85 flex items-center justify-end">
            <Link
              href={`/stores?category=${encodeURIComponent(name)}`}
              className="inline-flex items-center text-xs font-bold text-purple-600 hover:text-purple-700 gap-1 group/link"
            >
              <span>View Registered Stores</span>
              <svg
                className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
