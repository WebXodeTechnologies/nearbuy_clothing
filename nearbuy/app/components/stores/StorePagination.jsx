"use client";

import React from "react";
import { motion } from "framer-motion";

export default function StorePagination({ currentPage, setCurrentPage, totalPages }) {
  if (totalPages <= 1) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      className="mt-16 flex justify-center items-center gap-3 relative z-10"
    >
      <motion.button
        whileHover={{ scale: currentPage === 1 ? 1 : 1.05, x: currentPage === 1 ? 0 : -2 }}
        whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:border-slate-350 disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 cursor-pointer shadow-xs"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>
      
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100/60 border border-slate-200/50 rounded-2xl">
        <span className="text-xs font-bold text-slate-500 font-body">
          Page
        </span>
        <span className="text-xs font-extrabold text-slate-900 font-heading bg-white px-2 py-0.5 rounded-lg shadow-xs border border-slate-150">
          {currentPage}
        </span>
        <span className="text-xs font-bold text-slate-500 font-body">
          of {totalPages}
        </span>
      </div>
      
      <motion.button
        whileHover={{ scale: currentPage === totalPages ? 1 : 1.05, x: currentPage === totalPages ? 0 : 2 }}
        whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
        className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:border-slate-350 disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 cursor-pointer shadow-xs"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
        </svg>
      </motion.button>
    </motion.div>
  );
}
