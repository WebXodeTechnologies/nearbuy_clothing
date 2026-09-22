/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { motion } from "framer-motion";
import StoreCard from "../cards/StoreCard";
import Badge from "../ui/Badge";
import {
  MapPin,
  Clock,
  Star,
  ArrowRight,
  Store as StoreIcon,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 85,
      damping: 15,
    },
  },
};

export default function StoreListings({
  displayedStores,
  viewMode,
  clearFilters,
  search,
  location,
}) {
  if (displayedStores.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-20 bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-3xl p-8 max-w-xl mx-auto shadow-2xl relative z-10"
      >
        <div className="h-16 w-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-purple-100">
          <StoreIcon className="w-8 h-8" />
        </div>
        <h3 className="font-heading font-black text-slate-950 text-lg tracking-tight">
          No Stores Found
        </h3>
        <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed font-body">
          We couldn&apos;t find any boutiques matching &quot;{search}&quot; in
          &quot;{location}&quot;. Try widening your search criteria or resetting
          filters.
        </p>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={clearFilters}
          className="mt-6 text-xs font-extrabold bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-2xl transition-all cursor-pointer shadow-lg shadow-purple-600/20"
        >
          Reset All Filters
        </motion.button>
      </motion.div>
    );
  }

  // 🌟 GRID VIEW (Banner-free, clean avatar cards with premium depth)
  if (viewMode === "grid") {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {displayedStores.map((store) => (
          <motion.div key={store._id || store.id} variants={itemVariants}>
            <StoreCard store={store} />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  // 🌟 LIST VIEW (Clean banner-free horizontal rows with smooth hover states)
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      {displayedStores.map((store) => (
        <motion.div
          key={store._id || store.id}
          variants={itemVariants}
          whileHover={{ y: -3, scale: 1.005 }}
          className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-5 sm:p-6 hover:shadow-2xl hover:border-purple-300/60 transition-all duration-300 flex flex-col md:flex-row gap-5 items-start md:items-center relative group overflow-hidden"
        >
          {/* Subtle Accent Glow Indicator */}
          <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-linear-to-b from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Store Logo Avatar (No Banner Image) */}
          <div className="flex items-center gap-4 sm:gap-5 w-full md:w-auto">
            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-slate-100 p-1 border border-slate-200 shrink-0 relative overflow-hidden shadow-md">
              <img
                src={
                  store.logo ||
                  "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=300&auto=format&fit=crop&q=80"
                }
                alt={store.name}
                className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="flex-1 md:hidden space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-heading font-black text-slate-950 text-base group-hover:text-purple-600 transition-colors">
                  {store.name}
                </h4>
                <Badge
                  variant="blue"
                  pill
                  className="text-[10px] font-extrabold bg-blue-50 border border-blue-100 text-blue-700 px-2.5 py-0.5"
                >
                  <Star className="w-3 h-3 inline mr-0.5 fill-blue-600" />{" "}
                  {store.rating}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1">
                {store.description}
              </p>
            </div>
          </div>

          {/* Main Info Section (Desktop) */}
          <div className="flex-1 space-y-2 min-w-0 font-body hidden md:block">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h4 className="font-heading font-black text-slate-950 text-lg group-hover:text-purple-600 transition-colors truncate">
                {store.name}
              </h4>
              <Badge
                variant="blue"
                pill
                className="text-[10px] font-extrabold bg-blue-50 border border-blue-100 text-blue-700 px-2.5 py-0.5"
              >
                ★ {store.rating} ({store.reviewsCount} reviews)
              </Badge>
            </div>

            <p className="text-xs text-slate-500 line-clamp-1 leading-relaxed">
              {store.description ||
                "Verified physical boutique outlet offering exclusive apparel and lookbooks."}
            </p>

            <div className="flex items-center gap-5 text-xs text-slate-400 flex-wrap font-semibold">
              <span className="flex items-center gap-1.5 text-slate-600 bg-slate-100 px-2.5 py-1 rounded-xl">
                <MapPin className="w-3.5 h-3.5 text-purple-600" />
                {store.location || store.city || "Namakkal"}
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 bg-slate-100 px-2.5 py-1 rounded-xl">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                Open Daily
              </span>
            </div>
          </div>

          {/* Action Button & Stats */}
          <div className="shrink-0 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 flex items-center justify-between md:flex-col md:items-end gap-2.5">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider hidden md:block">
              Verified Retailer
            </span>
            <a
              href={`/stores/${store.slug}`}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 text-xs font-extrabold text-purple-700 hover:text-white bg-purple-50 hover:bg-purple-600 px-5 py-3 rounded-2xl transition-all duration-300 border border-purple-200/80 group/btn shadow-sm"
            >
              <span>View Store Profile</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
            </a>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
