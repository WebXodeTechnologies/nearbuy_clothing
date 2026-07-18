"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutCta() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-xl z-10 border border-slate-800"
    >
      {/* Decorative ambient mesh overlays */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 blur-3xl pointer-events-none rounded-full" />
      
      <div className="relative z-10 max-w-2xl mx-auto space-y-5 font-body">
        <h3 className="text-2xl sm:text-3.5xl font-black font-heading leading-tight tracking-tight">
          Ready to discover your <br className="hidden sm:inline" />
          neighborhood boutiques?
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          Browse stores in your locality, view lookbooks, and claim active walk-in discount coupons instantly.
        </p>
        
        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3.5 max-w-sm mx-auto">
          <Link href="/stores" className="flex-1">
            <motion.span 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full inline-flex items-center justify-center font-bold px-6 py-3.5 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg shadow-purple-600/10 transition-all select-none cursor-pointer text-xs"
            >
              Explore Stores
            </motion.span>
          </Link>
          <Link href="/become-vendor" className="flex-1">
            <motion.span 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full inline-flex items-center justify-center font-bold px-6 py-3.5 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-200 hover:text-white transition-all select-none cursor-pointer text-xs bg-slate-800/40 backdrop-blur-xs"
            >
              Merchant Registration
            </motion.span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
