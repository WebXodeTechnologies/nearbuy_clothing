"use client";

import React from "react";
import { motion } from "framer-motion";
import OfferCard from "../cards/OfferCard";

export default function TrendingOffersSection({ offers }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <section className="relative py-20 sm:py-28 bg-linear-to-b from-gray-50/80 via-white to-blue-50/30 border-t border-gray-100/90 overflow-hidden">

      {/* Background Decorative Radial Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#d1d5db_1px,transparent_1px)] bg-size-[24px_24px] opacity-45 pointer-events-none" />

      {/* Floating Animated Flash Light Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.3, 0.15]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 left-10 w-96 h-96 bg-amber-400/20 blur-3xl pointer-events-none rounded-full"
      />

      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.15, 0.35, 0.15]
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-blue-500/15 blur-3xl pointer-events-none rounded-full"
      />

      <div className="w-full max-w-7xl 2xl:max-w-[1440px] 3xl:max-w-[1600px] 4xl:max-w-[2000px] 5xl:max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 lg:mb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black bg-linear-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 text-amber-700 border border-amber-300/60 shadow-2xs mb-4"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
            </span>
            <span className="uppercase tracking-widest bg-clip-text text-transparent bg-linear-to-r from-amber-700 to-rose-700">
              In-Store Walk-In Savings
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-heading text-3xl sm:text-5xl 2xl:text-6xl font-extrabold text-gray-950 tracking-tight leading-tight"
          >
            Trending Local{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600">
              Coupon Deals
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3.5 text-base sm:text-lg text-gray-600 font-body leading-relaxed max-w-2xl mx-auto"
          >
            Claim instant coupon codes online and present them at offline store counters in Namakkal to unlock exclusive walk-in discounts.
          </motion.p>
        </div>

        {/* Offers Grid with Staggered Framer Motion Entrance */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
        >
          {offers.map((off, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <OfferCard offer={off} storeName={off.storeName} />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
