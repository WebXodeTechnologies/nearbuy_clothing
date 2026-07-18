"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { plans } from "../../data/dummy-data";

const pricingContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const pricingItemVariants = {
  hidden: { opacity: 0, y: 35 },
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

function PricingCard({ plan }) {
  const cardRef = useRef(null);

  // Motion values for coordinates
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for 3D card tilt
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
        className={`
          bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative shadow-sm hover:shadow-2xl h-full border transition-all duration-300
          ${plan.popular
            ? "border-purple-600/80 ring-4 ring-purple-100/50"
            : "border-slate-100/70 hover:border-purple-200/50"}
        `}
      >
        {/* Spotlight cursor inner light-orb glow */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
          style={{
            opacity: isHovering ? 1 : 0,
            background: plan.popular
              ? `radial-gradient(130px circle at ${hoverPos.x}px ${hoverPos.y}px, rgba(168, 85, 247, 0.07), transparent 80%)`
              : `radial-gradient(130px circle at ${hoverPos.x}px ${hoverPos.y}px, rgba(99, 102, 241, 0.05), transparent 80%)`,
          }}
        />

        {/* Clean hardware-accelerated glowing border overlay */}
        <div
          className="absolute inset-0 pointer-events-none rounded-3xl border transition-all duration-300 z-20"
          style={{
            borderColor: isHovering
              ? (plan.popular ? "rgba(168, 85, 247, 0.45)" : "rgba(99, 102, 241, 0.3)")
              : "transparent",
            boxShadow: isHovering
              ? (plan.popular
                ? "inset 0 0 20px rgba(168, 85, 247, 0.03), 0 16px 40px -16px rgba(168, 85, 247, 0.08)"
                : "inset 0 0 16px rgba(99, 102, 241, 0.02), 0 12px 36px -12px rgba(99, 102, 241, 0.06)")
              : "none",
          }}
        />

        {plan.popular && (
          <motion.span
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-linear-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-md shadow-purple-600/10 z-30"
          >
            Most Popular
          </motion.span>
        )}

        <div
          style={{ transform: "translateZ(20px)" }}
          className="font-body relative z-10"
        >
          <h3 className="font-heading font-black text-slate-900 text-xl leading-tight">{plan.name}</h3>
          <p className="text-xs text-black mt-1.5 min-h-[32px] font-semibold">{plan.description}</p>

          <div className="mt-5 flex items-baseline gap-1">
            <span className="text-4xl font-extrabold text-slate-950 tracking-tight font-heading">{plan.price}</span>
            <span className="text-xs text-black font-extrabold">/ {plan.period}</span>
          </div>

          <ul className="mt-6 space-y-3.5 border-t border-slate-100 pt-6">
            {plan.features.map((feature, fIdx) => (
              <li key={fIdx} className="flex items-start gap-2.5 text-xs text-black font-semibold">
                <svg className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div
          style={{ transform: "translateZ(10px)" }}
          className="mt-8 pt-4 border-t border-slate-50 relative z-10"
        >
          <Link href={`/auth/register?role=vendor&plan=${encodeURIComponent(plan.name)}`}>
            <motion.span
              whileTap={{ scale: 0.97 }}
              className={`
                w-full text-center py-3 rounded-xl text-xs font-bold transition-all block select-none cursor-pointer
                ${plan.popular
                  ? "bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg shadow-purple-600/10"
                  : "bg-slate-50 hover:bg-slate-100/80 text-slate-700 border border-slate-200/50"}
              `}
            >
              {plan.cta}
            </motion.span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function VendorPricing() {
  return (
    <div className="space-y-10 relative z-10">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-2xl font-black tracking-tight sm:text-3xl font-heading bg-clip-text text-transparent bg-linear-to-r from-purple-600 via-indigo-600 to-purple-800">
          Pricing & Subscription Plans
        </h2>
        <p className="text-sm text-black font-body">
          Pick a listing tier that matches your store&apos;s requirements. Cancel anytime.
        </p>
      </div>

      <motion.div
        variants={pricingContainerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch"
      >
        {plans.map((plan, idx) => (
          <motion.div key={idx} variants={pricingItemVariants}>
            <PricingCard plan={plan} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
