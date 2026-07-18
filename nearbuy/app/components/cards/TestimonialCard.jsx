/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";

export default function TestimonialCard({ testimonial, index }) {
  const { text, avatar, name, role } = testimonial;
  const cardRef = useRef(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setHoverPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Determine user type / badge
  const isMerchant = role.toLowerCase().includes("owner") || role.toLowerCase().includes("partner") || role.toLowerCase().includes("merchant");

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      initial={{ opacity: 0, y: 45 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.215, 0.610, 0.355, 1.000] }}
      whileHover={{ y: -6 }}
      className="relative border border-slate-100 p-8 rounded-3xl bg-white flex flex-col justify-between shadow-xs hover:shadow-2xl hover:border-purple-200/50 transition-all duration-300 overflow-hidden group cursor-default select-none min-h-[260px]"
    >
      {/* Interactive Cursor Spotlight Glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(150px circle at ${hoverPos.x}px ${hoverPos.y}px, rgba(147, 51, 234, 0.07), transparent 80%)`
        }}
      />

      {/* Decorative Quote Mark Background */}
      <div className="absolute top-6 right-6 text-slate-100/50 group-hover:text-purple-100/50 transition-colors duration-300 font-serif text-7xl pointer-events-none leading-none select-none">
        &ldquo;
      </div>

      <div className="relative z-10 space-y-4">
        {/* Rating Stars and Verified Badge */}
        <div className="flex items-center justify-between">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="w-4 h-4 text-amber-400 fill-current"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2.5 py-0.5 rounded-full border ${isMerchant
              ? "bg-purple-50 text-purple-700 border-purple-100/50"
              : "bg-emerald-50 text-emerald-700 border-emerald-100/50"
            }`}>
            <span className={`w-1 h-1 rounded-full ${isMerchant ? "bg-purple-500 animate-pulse" : "bg-emerald-500"}`} />
            {isMerchant ? "Verified Partner" : "Verified Buyer"}
          </span>
        </div>

        {/* Testimonial Quote Text */}
        <p className="text-sm text-slate-700 leading-relaxed font-body font-medium italic relative">
          &quot;{text}&quot;
        </p>
      </div>

      {/* User Information */}
      <div className="mt-8 pt-6 border-t border-slate-100/80 flex items-center gap-4 relative z-10">
        <div className="relative shrink-0">
          {/* Avatar Ring */}
          <div className="absolute -inset-0.5 bg-linear-to-r from-purple-500 to-indigo-500 rounded-full blur-[1px] opacity-75 group-hover:scale-105 transition-transform duration-300" />
          <img
            src={avatar}
            alt={name}
            className="relative h-10 w-10 rounded-full object-cover border border-white shadow-xs"
          />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-heading font-black text-slate-900 text-sm tracking-tight truncate group-hover:text-purple-600 transition-colors">
            {name}
          </span>
          <span className="text-[11px] text-slate-500 font-semibold tracking-wide uppercase mt-0.5">
            {role}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
