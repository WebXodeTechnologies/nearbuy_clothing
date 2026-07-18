"use client";

import React, { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const INFO_ITEMS = [
  {
    title: "HQ Address",
    description: "Nearby Clothing Platforms Pvt Ltd, 45, Salem Main Road, Opposite Collectorate, Namakkal, Tamil Nadu 637001",
    icon: (
      <svg className="w-5 h-5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      </svg>
    )
  },
  {
    title: "Support Desk",
    description: "support@nearbyclothing.com",
    icon: (
      <svg className="w-5 h-5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L22 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    title: "Merchant Hotline",
    description: "+91 90000 80000",
    icon: (
      <svg className="w-5 h-5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    )
  }
];

function InfoCard({ item, idx }) {
  const cardRef = useRef(null);

  // Motion values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for 3D tilt
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
    <div style={{ perspective: 1000 }} className="h-full select-none outline-none">
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
        className="bg-white/95 backdrop-blur-md border border-slate-100/70 p-8 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col h-full items-center text-center group relative overflow-hidden"
      >
        {/* Spotlight cursor inner light-orb glow */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
          style={{
            opacity: isHovering ? 1 : 0,
            background: `radial-gradient(130px circle at ${hoverPos.x}px ${hoverPos.y}px, rgba(168, 85, 247, 0.06), transparent 80%)`,
          }}
        />

        {/* Ambient pulsing border glow on rest, switching to highlighted accent border on hover */}
        <motion.div
          animate={isHovering ? {} : {
            borderColor: [
              "rgba(168, 85, 247, 0.05)",
              "rgba(168, 85, 247, 0.2)",
              "rgba(168, 85, 247, 0.05)"
            ]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 pointer-events-none rounded-3xl border transition-all duration-300 z-20"
          style={{
            borderColor: isHovering ? "rgba(168, 85, 247, 0.28)" : undefined,
            boxShadow: isHovering
              ? "inset 0 0 16px rgba(168, 85, 247, 0.02), 0 12px 36px -12px rgba(168, 85, 247, 0.04)"
              : "none",
          }}
        />

        {/* Content wrapper */}
        <div
          style={{ transform: "translateZ(18px)" }}
          className="font-body relative z-10 space-y-4.5 flex flex-col items-center flex-1"
        >
          {/* Glowing Icon holder box */}
          <div className="h-12 w-12 bg-purple-50 group-hover:bg-purple-600 group-hover:text-white text-purple-600 rounded-2xl flex items-center justify-center shrink-0 border border-purple-100/40 group-hover:border-purple-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-xs">
            {item.icon}
          </div>
          <div className="space-y-2">
            <h4 className="font-heading font-black text-slate-900 text-base tracking-tight group-hover:text-purple-600 transition-colors">
              {item.title}
            </h4>
            <p className="font-semibold text-slate-700 text-xs sm:text-sm leading-relaxed max-w-xs">
              {item.description}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ContactInfo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
      {INFO_ITEMS.map((item, idx) => (
        <InfoCard key={idx} item={item} idx={idx} />
      ))}
    </div>
  );
}
