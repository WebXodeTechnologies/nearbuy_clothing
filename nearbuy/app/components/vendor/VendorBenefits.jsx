"use client";

import React, { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const BENEFITS = [
  {
    title: "Drive Local Walk-Ins",
    description: "Increase foot traffic to your physical store location by capturing nearby search intent from local buyers.",
    icon: (
      <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
  {
    title: "Zero Sales Commission",
    description: "Keep 100% of your earnings. We charge a flat monthly listing subscription fee with absolutely no transaction fees.",
    icon: (
      <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    title: "Active Promo Campaigns",
    description: "Launch flash discounts, weekend sales, and coupon codes. Buyers claim coupons here and show them at your counter.",
    icon: (
      <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    title: "Showcase Lookbooks",
    description: "Publish your latest seasonal catalogs and custom tailored gallery items to entice digital discovery shoppers.",
    icon: (
      <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 85,
      damping: 14
    }
  }
};

function BenefitCard({ benefit }) {
  const { title, description, icon } = benefit;
  const cardRef = useRef(null);

  // Motion values for coordinates
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
        className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col h-full group relative border border-slate-100/70"
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

        {/* Icon Container */}
        <div
          style={{ transform: "translateZ(20px)" }}
          className="h-10 w-10 bg-purple-50 group-hover:bg-purple-100 rounded-2xl flex items-center justify-center shrink-0 border border-purple-100/50 transition-colors relative z-10"
        >
          {icon}
        </div>

        {/* Content */}
        <div
          style={{ transform: "translateZ(12px)" }}
          className="font-body relative z-10 flex-1 flex flex-col justify-between"
        >
          <div className="space-y-2 mt-2">
            <h4 className="font-heading font-black text-slate-900 text-base">{title}</h4>
            <p className="text-xs text-black leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function VendorBenefits() {
  return (
    <div className="space-y-10 relative z-10">
      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl font-extrabold tracking-tight text-center font-heading bg-clip-text text-transparent bg-linear-to-r from-purple-600 via-indigo-600 to-purple-800 sm:text-3xl"
      >
        Why List with Nearby Clothing?
      </motion.h2>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {BENEFITS.map((benefit, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <BenefitCard benefit={benefit} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
