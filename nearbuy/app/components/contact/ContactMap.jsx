"use client";

import React from "react";
import { motion } from "framer-motion";

export default function ContactMap() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.05 }}
      className="bg-white/95 backdrop-blur-md border border-slate-100/70 p-5 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 space-y-4.5 relative overflow-hidden z-10 w-full"
    >
      {/* Location Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 font-body">
        <span className="font-heading font-black text-slate-800 text-xs uppercase tracking-wider">
          Our Location
        </span>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-100/30">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-purple-600" />
          </span>
          <span>Namakkal HQ</span>
        </div>
      </div>

      {/* Main Map Viewport */}
      <div className="h-[380px] relative rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 shadow-inner">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3913.435749114321!2d78.16335121480436!3d11.218942292022436!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3babce0415a770a9%3A0xc6fb0e02eb7f59a3!2sNamakkal%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1625480000000!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        />
      </div>
    </motion.div>
  );
}
