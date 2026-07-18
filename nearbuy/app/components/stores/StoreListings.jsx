/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { motion } from "framer-motion";
import StoreCard from "../cards/StoreCard";
import Badge from "../ui/Badge";

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
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring", 
      stiffness: 80, 
      damping: 15 
    } 
  }
};

export default function StoreListings({ displayedStores, viewMode, clearFilters, search, location }) {
  if (displayedStores.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-20 bg-white border border-slate-100 rounded-3xl p-8 max-w-xl mx-auto shadow-xl shadow-slate-100/40 relative z-10"
      >
        <div className="h-16 w-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="font-heading font-black text-slate-900 text-lg">No Stores Found</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed font-body">
          We couldn&apos;t find any boutiques matching &quot;{search}&quot; in &quot;{location}&quot;. Try widening your search or adjusting your keywords.
        </p>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={clearFilters}
          className="mt-6 text-xs font-bold bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-5 py-3 rounded-xl transition-all cursor-pointer shadow-md hover:shadow-lg shadow-purple-600/10"
        >
          Reset All Filters
        </motion.button>
      </motion.div>
    );
  }

  if (viewMode === "grid") {
    return (
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {displayedStores.map((store) => (
          <motion.div key={store.id} variants={itemVariants}>
            <StoreCard store={store} />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {displayedStores.map((store) => (
        <motion.div
          key={store.id}
          variants={itemVariants}
          whileHover={{ y: -4 }}
          className="bg-white/95 backdrop-blur-md border border-slate-100 rounded-3xl p-6 hover:shadow-xl hover:border-purple-200/50 transition-all duration-300 flex flex-col md:flex-row gap-6 items-start md:items-center relative group overflow-hidden"
        >
          {/* Subtle accent hover indicator */}
          <div className="absolute top-0 bottom-0 left-0 w-1 bg-linear-to-b from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="h-28 w-44 rounded-2xl overflow-hidden shrink-0 bg-slate-50 relative border border-slate-100">
            <img 
              src={store.banner} 
              alt={store.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute top-2 left-2 h-10 w-10 rounded-xl border border-white bg-white overflow-hidden shadow-md shrink-0">
              <img src={store.logo} alt="Logo" className="w-full h-full object-cover" />
            </div>
          </div>
          
          <div className="flex-1 space-y-2 min-w-0 font-body">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-heading font-black text-slate-900 text-lg group-hover:text-purple-600 transition-colors truncate">
                {store.name}
              </h4>
              <Badge variant="blue" pill className="text-[10px] font-extrabold bg-blue-50 border border-blue-100 text-blue-700">
                {store.rating} ★
              </Badge>
            </div>
            
            <p className="text-sm text-slate-500 line-clamp-1 leading-normal">
              {store.description}
            </p>
            
            <div className="flex items-center gap-5 text-xs text-slate-400 flex-wrap font-medium">
              <span className="flex items-center gap-1.5 text-slate-500 font-semibold">
                <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {store.location}
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Open: {store.hours}
              </span>
            </div>
          </div>

          <div className="shrink-0 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-50 flex items-center justify-between md:flex-col md:items-end gap-3 text-right">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">
              {store.reviewsCount} verified reviews
            </span>
            <a
              href={`/stores/${store.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100/80 px-4.5 py-2.5 rounded-xl transition-all border border-purple-100/50 group/btn shadow-xs"
            >
              <span>View Profile</span>
              <svg className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
