"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function AboutHero() {
  const cardRef = useRef(null);

  // Motion values for normalized cursor tracking (-0.5 to 0.5)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for 3D card tilt
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), {
    stiffness: 150,
    damping: 20,
  });

  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

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
    x.set(0);
    y.set(0);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="lg:col-span-7 space-y-6 font-body"
      >
        <span className="text-xs font-bold text-purple-700 bg-purple-50 border border-purple-100 px-3.5 py-1.5 rounded-full inline-block uppercase tracking-wider shadow-xs">
          Our Story
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight font-heading">
          Reviving Local Fashion Retail Through{" "}
          <span className="bg-clip-text text-transparent bg-linear-to-r from-purple-600 via-indigo-600 to-purple-800">
            Hyperlocal Tech
          </span>
        </h1>
        <div className="space-y-4 text-black text-md sm:text-lg leading-relaxed">
          <p>
            Nearby Clothing was founded with a simple realization: local brick-and-mortar clothing stores possess incredible design talent and unique collections, yet struggle to compete against multi-billion dollar online retailers.
          </p>
          <p>
            We asked ourselves: why wait for package deliveries and deal with size returns when the perfect dress or suit might be hanging in a boutique just 500 meters down your street?
          </p>
          <p>
            Nearby Clothing is not an e-commerce platform. We don&apos;t believe in adding shipping trucks to streets. Instead, we showcase physical merchant inventories digitally, allowing shoppers to discover fashion locally, try sizes physically, and support neighborhood boutique stores.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="lg:col-span-5 relative select-none outline-hidden"
      >
        {/* Decorative background overlay */}
        <div className="absolute -inset-4 rounded-3xl bg-linear-to-tr from-purple-100 to-indigo-100/50 blur-lg pointer-events-none" />

        <div style={{ perspective: 1000 }} className="w-full">
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
            className="relative transition-all duration-300 h-[360px] group cursor-pointer"
          >
            {/* Image card with overflow hidden - separates visual boundaries from float badge */}
            <div
              style={{ transform: "translateZ(10px)" }}
              className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden border border-slate-100/70 shadow-xl hover:shadow-2xl transition-all duration-300 bg-slate-50"
            >
              {/* Spotlight cursor inner light-orb glow */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
                style={{
                  opacity: isHovering ? 1 : 0,
                  background: `radial-gradient(140px circle at ${hoverPos.x}px ${hoverPos.y}px, rgba(168, 85, 247, 0.06), transparent 80%)`,
                }}
              />

              <Image
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80"
                alt="Local Boutique"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/45 via-transparent to-transparent z-10" />
            </div>

            {/* Float-out badge details - OUTSIDE of overflow-hidden image container to prevent clipping */}
            <div
              style={{ transform: "translateZ(35px)" }}
              className="absolute -bottom-6 -left-6 bg-linear-to-r from-purple-600 to-indigo-600 text-white p-5 rounded-2xl shadow-2xl hidden sm:block max-w-xs font-body border border-purple-500/25 z-30 transition-transform duration-300"
            >
              <h4 className="font-heading font-black text-sm">Supporting Local Shops</h4>
              <p className="text-[11px] text-purple-100 mt-1 leading-relaxed">
                Every listing on our platform helps a brick-and-mortar boutique thrive in a digital era.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
