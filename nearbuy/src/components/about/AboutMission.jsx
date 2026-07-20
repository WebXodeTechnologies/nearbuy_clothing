"use client";

import React, { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

function MissionCard({ title, description, letter }) {
  const cardRef = useRef(null);
  
  // Motion values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for 3D tilt
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), {
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
        className="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col h-full group relative border border-slate-100/70 overflow-hidden"
      >
        {/* Large decorative background glyph */}
        <div className="absolute right-4 bottom-0 text-[130px] font-black text-slate-50 group-hover:text-purple-50/70 group-hover:-translate-y-2 transition-all duration-500 pointer-events-none select-none font-heading leading-none">
          {letter}
        </div>

        {/* Spotlight cursor inner light-orb glow */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
          style={{
            opacity: isHovering ? 1 : 0,
            background: `radial-gradient(130px circle at ${hoverPos.x}px ${hoverPos.y}px, rgba(168, 85, 247, 0.05), transparent 80%)`,
          }}
        />

        {/* Clean border highlight overlay */}
        <div
          className="absolute inset-0 pointer-events-none rounded-3xl border transition-all duration-300 z-20"
          style={{
            borderColor: isHovering ? "rgba(168, 85, 247, 0.25)" : "transparent",
            boxShadow: isHovering
              ? "inset 0 0 16px rgba(168, 85, 247, 0.02), 0 12px 36px -12px rgba(168, 85, 247, 0.06)"
              : "none",
          }}
        />

        {/* Content wrapper */}
        <div 
          style={{ transform: "translateZ(20px)" }}
          className="font-body relative z-10 space-y-4 flex-1 flex flex-col"
        >
          <div className="h-11 w-11 bg-purple-50 group-hover:bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 font-heading font-black text-lg border border-purple-100/50 transition-colors">
            {letter}
          </div>
          <div className="space-y-2">
            <h3 className="font-heading font-black text-slate-900 text-lg group-hover:text-purple-600 transition-colors">
              {title}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-md">
              {description}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function AboutMission() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <MissionCard
          letter="M"
          title="Our Mission"
          description="To empower local independent apparel vendors with premium digital discovery tools, driving customer walk-in foot traffic, increasing local employment, and saving buyers the hassle of online size returns."
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <MissionCard
          letter="V"
          title="Our Vision"
          description="To create a world where local boutiques and designer shops are the first place citizens search for clothing, establishing a highly integrated physical-digital retail environment in every major smart city."
        />
      </motion.div>
    </div>
  );
}
