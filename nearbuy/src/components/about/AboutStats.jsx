"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, useInView, animate } from "framer-motion";

const STATS = [
  { value: "50+", label: "Registered Boutiques" },
  { value: "12,000+", label: "Monthly Discovery Views" },
  { value: "35%+", label: "Average Footfall Increase" },
  { value: "5+", label: "Namakkal Commercial Hubs" }
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

function Counter({ value }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Extract number and suffix from string (e.g. "12,000+" -> number: 12000, suffix: "+")
  const cleanNumberStr = value.replace(/[^0-9]/g, "");
  const targetNumber = parseInt(cleanNumberStr, 10) || 0;
  const suffix = value.replace(/[0-9,]/g, "");
  const hasCommas = value.includes(",");

  const motionValue = useMotionValue(0);

  useEffect(() => {
    if (isInView) {
      const controls = animate(motionValue, targetNumber, {
        duration: 2,
        ease: "easeOut",
        onUpdate: (latest) => {
          if (ref.current) {
            const formatted = Math.floor(latest);
            ref.current.textContent =
              (hasCommas ? formatted.toLocaleString() : formatted) + suffix;
          }
        }
      });
      return () => controls.stop();
    }
  }, [isInView, targetNumber, suffix, hasCommas, motionValue]);

  return <span ref={ref}>0{suffix}</span>;
}

function StatCard({ stat, idx }) {
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
        className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col h-full items-center justify-center group relative border border-slate-100/70 text-center"
      >
        {/* Spotlight cursor inner light-orb glow */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
          style={{
            opacity: isHovering ? 1 : 0,
            background: `radial-gradient(100px circle at ${hoverPos.x}px ${hoverPos.y}px, rgba(168, 85, 247, 0.05), transparent 80%)`,
          }}
        />

        {/* Sequential border sweep animation on scroll-in */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: [0, 1, 0] }}
          viewport={{ once: true }}
          transition={{
            duration: 1.6,
            delay: idx * 0.22,
            ease: "easeInOut"
          }}
          className="absolute inset-0 pointer-events-none rounded-3xl border border-purple-500/35 z-20"
        />

        {/* Ambient pulsing border glow on rest, switching to highlighted accent border on hover */}
        <motion.div
          animate={isHovering ? {} : {
            borderColor: [
              "rgba(168, 85, 247, 0.06)",
              "rgba(168, 85, 247, 0.22)",
              "rgba(168, 85, 247, 0.06)"
            ]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 pointer-events-none rounded-3xl border transition-all duration-300 z-20"
          style={{
            borderColor: isHovering ? "rgba(168, 85, 247, 0.28)" : undefined,
            boxShadow: isHovering
              ? "inset 0 0 12px rgba(168, 85, 247, 0.02), 0 8px 24px -8px rgba(168, 85, 247, 0.04)"
              : "none",
          }}
        />

        {/* Content */}
        <div
          style={{ transform: "translateZ(15px)" }}
          className="font-body relative z-10 space-y-1"
        >
          <div className="text-3xl sm:text-4xl font-extrabold text-purple-600 tracking-tight font-heading group-hover:scale-105 transition-transform duration-300">
            <Counter value={stat.value} />
          </div>
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest group-hover:text-purple-600 transition-colors">
            {stat.label}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function AboutStats() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-6 relative z-10"
    >
      {STATS.map((stat, idx) => (
        <motion.div key={idx} variants={itemVariants}>
          <StatCard stat={stat} idx={idx} />
        </motion.div>
      ))}
    </motion.div>
  );
}
