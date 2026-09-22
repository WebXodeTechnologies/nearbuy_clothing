"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import StoreCard from "../cards/StoreCard";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 85, damping: 14 },
  },
};

export default function FeaturedStoresSection({
  stores = [],
  title = "Featured Offline",
  highlight = "Fashion Outlets",
}) {
  return (
    <section className="relative py-16 sm:py-24 bg-linear-to-b from-gray-50/80 via-white to-blue-50/20 border-y border-gray-200/60 overflow-hidden font-body">
      {/* Background Radial Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-60 pointer-events-none" />

      {/* Ambient Radial Lights */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-400/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/10 blur-3xl pointer-events-none rounded-full" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header - Cleaned up without the top button */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/80 mb-3 shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="uppercase tracking-wider">
              Top Rated Boutiques Network
            </span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-950 tracking-tight leading-tight">
            {title}{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600">
              {highlight}
            </span>
          </h2>

          <p className="mt-3 text-base text-gray-600 leading-relaxed font-body">
            Explore local clothing boutiques, ethnic hubs, and designer outlets
            highly rated by walk-in shoppers in Namakkal.
          </p>
        </div>

        {/* Dynamic Stores Grid - Displays all fetched stores */}
        {stores && stores.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-14"
          >
            {stores.map((store) => (
              <motion.div
                key={store._id || store.id || store.storeSlug}
                variants={itemVariants}
              >
                <StoreCard store={store} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200/80 shadow-xs max-w-md mx-auto mb-14">
            <p className="text-gray-500 font-medium text-sm">
              No stores found in the database.
            </p>
            <p className="text-gray-400 text-xs mt-1">
              New store listings will appear here automatically.
            </p>
          </div>
        )}

        {/* Bottom Center Navigation Button */}
        <div className="flex justify-center">
          <Link
            href="/stores"
            className="group inline-flex items-center gap-2.5 bg-gray-900 hover:bg-blue-600 text-white text-sm font-extrabold px-8 py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-gray-900/10 hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Explore All Outlets</span>
            <svg
              className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200 text-blue-400 group-hover:text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
