"use client";

import React from "react";
import { motion } from "framer-motion";

export default function ContactHeader() {
  return (
    <div className="text-center max-w-2xl mx-auto space-y-3 mt-6 mb-12">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-purple-50 border border-purple-100/60 text-purple-700 text-[11px] font-extrabold rounded-full uppercase tracking-wider shadow-xs"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600" />
        </span>
        <span>Support Desk</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="text-4xl sm:text-5xl font-black tracking-tight leading-none font-heading bg-clip-text text-transparent bg-linear-to-r from-purple-600 via-indigo-600 to-purple-800"
      >
        Get in Touch
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-md  sm:text-md text-black font-body max-w-lg mx-auto"
      >
        Have questions about store listings, merchant subscriptions, API integrations, or platform partnerships? We are here to help.
      </motion.p>
    </div>
  );
}
