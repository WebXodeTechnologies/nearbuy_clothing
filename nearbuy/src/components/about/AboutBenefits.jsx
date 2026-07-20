"use client";

import React, { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

function BenefitBlock({ title, description, badge }) {
  const cardRef = useRef(null);
  
  // Motion values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for 3D tilt
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), {
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
        className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-sm hover:shadow-2xl transition-all duration-300 flex gap-5 h-full group relative border border-slate-100/70"
      >
        {/* Spotlight cursor inner light-orb glow */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
          style={{
            opacity: isHovering ? 1 : 0,
            background: `radial-gradient(120px circle at ${hoverPos.x}px ${hoverPos.y}px, rgba(168, 85, 247, 0.05), transparent 80%)`,
          }}
        />

        {/* Glowing border overlay */}
        <div
          className="absolute inset-0 pointer-events-none rounded-3xl border transition-all duration-300 z-20"
          style={{
            borderColor: isHovering ? "rgba(168, 85, 247, 0.2)" : "transparent",
            boxShadow: isHovering
              ? "inset 0 0 16px rgba(168, 85, 247, 0.02), 0 12px 36px -12px rgba(168, 85, 247, 0.05)"
              : "none",
          }}
        />

        {/* Icon checkmark wrapper */}
        <div 
          style={{ transform: "translateZ(18px)" }}
          className="h-10 w-10 bg-purple-50 group-hover:bg-purple-100 border border-purple-100/50 rounded-2xl flex items-center justify-center shrink-0 text-purple-600 transition-colors relative z-10"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Content */}
        <div 
          style={{ transform: "translateZ(10px)" }}
          className="font-body relative z-10 space-y-1 flex-1"
        >
          <div className="flex items-center gap-2">
            <h4 className="font-heading font-black text-slate-900 text-sm group-hover:text-purple-600 transition-colors">
              {title}
            </h4>
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100/30">
              {badge}
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            {description}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function AboutBenefits() {
  return (
    <div className="space-y-10 relative z-10">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <motion.h2 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-extrabold tracking-tight sm:text-3xl font-heading bg-clip-text text-transparent bg-linear-to-r from-purple-600 via-indigo-600 to-purple-800"
        >
          Platform Benefits
        </motion.h2>
        <p className="text-sm text-slate-500 font-body">
          Helping buyers discover locally, helping stores list confidently.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <BenefitBlock
            badge="Shopper"
            title="For Customers"
            description="Discover boutique clothing and accessories close to home. Try sizes and textures instantly, claim active coupons, get tailoring support, and support small merchants."
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <BenefitBlock
            badge="Merchant"
            title="For Retail Merchants"
            description="Increase storefront footfall without complex commissions or logistics. Post active lookbooks, run flash offers, showcase gallery items, and connect via WhatsApp."
          />
        </motion.div>
      </div>
    </div>
  );
}
