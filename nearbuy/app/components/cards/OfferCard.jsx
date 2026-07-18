"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Badge from "../ui/Badge";
import toast from "react-hot-toast";

export default function OfferCard({ offer, onEdit, onDelete, isManageMode = false, storeName }) {
  const { id, name, discount, validUntil, status, terms, code } = offer;
  const [copied, setCopied] = useState(false);

  const handleClaim = () => {
    const couponCode = code || `NEARBY${discount.replace(/[^0-9]/g, "") || "OFF"}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(couponCode);
    }
    setCopied(true);
    toast.success(`Coupon "${couponCode}" copied to clipboard!`, {
      style: {
        borderRadius: "12px",
        background: "#090d16",
        color: "#fff",
        fontSize: "12px",
        fontWeight: "bold",
        border: "1px solid rgba(59, 130, 246, 0.3)"
      }
    });
    setTimeout(() => setCopied(false), 3500);
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="relative p-[1.5px] rounded-3xl overflow-hidden group shadow-md hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 bg-linear-to-r from-blue-500/30 via-purple-500/30 to-amber-500/30"
    >
      {/* Animated Glowing Border Beam Sweep on Hover */}
      <motion.div
        className="absolute inset-0 bg-linear-to-r from-blue-600 via-indigo-500 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xs"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Main Card Content Container */}
      <div className="relative bg-white/95 backdrop-blur-md rounded-[23px] p-6 flex flex-col justify-between h-full overflow-hidden border border-gray-100">
        
        {/* Flash Ambient Glow Behind Card */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-400/10 blur-2xl pointer-events-none rounded-full group-hover:bg-blue-500/15 transition-colors duration-500" />

        {/* Coupon Notches Left & Right */}
        <div className="absolute top-1/2 -translate-y-1/2 -left-3.5 w-5 h-5 bg-gray-50/90 rounded-full border border-gray-200/90 shadow-inner z-20" />
        <div className="absolute top-1/2 -translate-y-1/2 -right-3.5 w-5 h-5 bg-gray-50/90 rounded-full border border-gray-200/90 shadow-inner z-20" />

        <div>
          {/* Top Row: Store Tag & Flash Status Pill */}
          <div className="flex items-center justify-between mb-4">
            {storeName ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50/90 text-blue-700 border border-blue-200/60 text-[10px] font-extrabold tracking-wider uppercase">
                <span>🏬</span>
                <span className="truncate max-w-[140px]">{storeName}</span>
              </span>
            ) : isManageMode ? (
              <Badge variant={status === "Active" ? "emerald" : "gray"} pill>
                {status}
              </Badge>
            ) : null}

            {/* Flash Deal Pill with Animated Flame Pulsing */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-linear-to-r from-amber-500 to-rose-500 text-white text-[10px] font-black uppercase tracking-wider shadow-xs"
            >
              <span className="animate-bounce text-[11px]">⚡</span>
              <span>Flash Deal</span>
            </motion.div>
          </div>

          {/* Discount Headline & Main Description */}
          <div className="space-y-1.5 my-3">
            <div className="flex items-baseline gap-2">
              <h3 className="font-heading font-black text-3xl text-gray-950 tracking-tight bg-clip-text text-transparent bg-linear-to-r from-blue-700 via-indigo-800 to-gray-900">
                {discount}
              </h3>
            </div>
            
            <h4 className="font-heading font-bold text-gray-800 text-sm sm:text-base leading-snug">
              {name}
            </h4>

            {terms && (
              <p className="text-[11px] text-gray-500 leading-relaxed font-body pt-1">
                * {terms}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Bar: Expiry & Action CTA */}
        <div className="mt-6 pt-4 border-t border-dashed border-gray-200 flex items-center justify-between relative z-10">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-widest text-gray-400 font-extrabold">Valid Till</span>
            <span className="text-xs text-gray-800 font-extrabold">{validUntil}</span>
          </div>

          {isManageMode ? (
            <div className="flex gap-2 shrink-0">
              {onEdit && (
                <button
                  onClick={() => onEdit(offer)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                  title="Edit Offer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                  title="Delete Offer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          ) : (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleClaim}
              className={`text-xs font-extrabold px-4 py-2.5 rounded-xl transition-all duration-300 cursor-pointer flex items-center gap-2 shadow-xs ${
                copied
                  ? "bg-emerald-600 text-white shadow-emerald-500/20"
                  : "bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/20 hover:shadow-md"
              }`}
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div
                    key="copied"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-1.5"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Coupon Copied!</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="claim"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-1.5"
                  >
                    <span>Claim Deal</span>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          )}
        </div>

      </div>
    </motion.div>
  );
}
