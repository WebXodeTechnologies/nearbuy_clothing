"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import useWebsiteStore from "@/store/websiteStore";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import CategoriesGrid from "@/components/categories/CategoriesGrid";

export default function CategoriesPage() {
  const { categories, loading, fetchPublicDirectory } = useWebsiteStore();

  useEffect(() => {
    // Ensures categories are fetched efficiently via global store caching
    fetchPublicDirectory();
  }, [fetchPublicDirectory]);

  if (loading && categories.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-slate-50/50">
        <div className="relative flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
          <div className="absolute h-6 w-6 rounded-full bg-purple-50 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50/30 py-12 pt-28 sm:pt-32 relative overflow-hidden min-h-screen">
      {/* Decorative Background Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_2px)] bg-size-[24px_24px] opacity-75 pointer-events-none" />

      {/* Ambient background glows */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.15, 0.22, 0.15],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-12 right-1/4 w-112.5 h-112.5 bg-purple-200/40 blur-3xl pointer-events-none rounded-full"
      />
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.2, 0.28, 0.2],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
        className="absolute bottom-20 left-10 w-87.5 h-87.5 bg-indigo-200/40 blur-3xl pointer-events-none rounded-full"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        {/* Breadcrumb row */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-md px-4.5 py-2.5 rounded-2xl border border-slate-100/60 inline-block shadow-sm"
        >
          <Breadcrumb items={[{ label: "Categories", href: "/categories" }]} />
        </motion.div>

        {/* Page title and header description */}
        <div className="space-y-2">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl md:text-5xl font-heading leading-tight"
          >
            Browse Clothing{" "}
            <span className="bg-clip-text text-transparent bg-linear-to-r from-purple-600 via-indigo-600 to-purple-800">
              Categories
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-sm sm:text-base text-slate-500 font-body max-w-3xl leading-relaxed"
          >
            Discover local boutique catalogs, saree houses, footwear, and
            accessory stores grouped by dress style and departments in Namakkal.
          </motion.p>
        </div>

        {/* Categories Grid (Dynamically rendered from DB) */}
        <CategoriesGrid categories={categories} />
      </div>
    </div>
  );
}