"use client";

import React from "react";
import { motion } from "framer-motion";
import TestimonialCard from "../cards/TestimonialCard";

export default function TestimonialsSection({ testimonials }) {
  return (
    <section className="py-24 sm:py-32 bg-white relative overflow-hidden text-slate-900 border-t border-slate-100">



      {/* Background Ambient Glows */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.25, 0.35, 0.25]
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 -left-20 w-[350px] h-[350px] bg-purple-200/40 blur-3xl pointer-events-none rounded-full"
      />
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4
        }}
        className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] bg-indigo-200/40 blur-3xl pointer-events-none rounded-full"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-50 border border-purple-100 text-purple-700 text-xs font-bold rounded-full uppercase tracking-wider"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600" />
            </span>
            <span>Community Feedback</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-heading text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-slate-950"
          >
            Shopper &{" "}
            <span className="bg-clip-text text-transparent bg-linear-to-r from-purple-600 via-indigo-600 to-purple-800">
              Merchant Stories
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-500 leading-relaxed font-body max-w-2xl mx-auto"
          >
            Discover how Nearbuy is empowering shoppers to find zero-fit-error apparel while boosting digital visibility and walk-in sales for local store merchants.
          </motion.p>
        </div>

        {/* Testimonials Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, index) => (
            <TestimonialCard key={test.id} testimonial={test} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}
