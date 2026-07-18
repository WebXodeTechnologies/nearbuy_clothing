"use client";

import React from "react";
import { motion } from "framer-motion";

export default function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Discover Stores",
      description:
        "Filter stores by Namakkal neighborhood hubs (Salem Rd, Mohanur Rd) and retail departments like Men's, Women's, or Designer Boutiques.",
      badge: "Location Search",
      icon: (
        <svg className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      accent: "from-blue-600 via-cyan-500 to-blue-400",
      numGradient: "from-blue-600 to-cyan-500",
      glowColor: "rgba(37, 99, 235, 0.4)",
      lightBg: "bg-blue-50 text-blue-700 border-blue-200"
    },
    {
      number: "02",
      title: "Browse Collections & Deals",
      description:
        "Explore active lookbooks, gallery showcases, and claim exclusive walk-in discount coupons right on their store profiles.",
      badge: "Instant Coupons",
      icon: (
        <svg className="w-7 h-7 text-indigo-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M7 7h.01M7 11h.01M7 15h.01M13 7h.01M13 11h.01M13 15h.01M17 7h.01M17 11h.01M17 15h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
        </svg>
      ),
      accent: "from-indigo-600 via-purple-500 to-pink-500",
      numGradient: "from-indigo-600 to-purple-500",
      glowColor: "rgba(79, 70, 229, 0.4)",
      lightBg: "bg-indigo-50 text-indigo-700 border-indigo-200"
    },
    {
      number: "03",
      title: "Walk In & Shop",
      description:
        "Use interactive Google Maps coordinates to visit physical stores, try out sizes, show coupon details, and complete your purchase.",
      badge: "In-Store Purchase",
      icon: (
        <svg className="w-7 h-7 text-emerald-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      accent: "from-emerald-500 via-teal-500 to-emerald-400",
      numGradient: "from-emerald-500 to-teal-400",
      glowColor: "rgba(16, 185, 129, 0.4)",
      lightBg: "bg-emerald-50 text-emerald-700 border-emerald-200"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 280, damping: 22 }
    }
  };

  return (
    <section className="relative py-20 sm:py-28 bg-linear-to-b from-blue-50/40 via-white to-indigo-50/20 border-b border-gray-100/90 overflow-hidden">


      {/* Glowing Ambient Light Orbs */}
      <div className="absolute top-1/3 left-10 w-[500px] h-[500px] bg-blue-400/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-indigo-400/10 blur-3xl pointer-events-none rounded-full" />

      <div className="w-full max-w-7xl 2xl:max-w-[1440px] 3xl:max-w-[1600px] 4xl:max-w-[2000px] 5xl:max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs mb-4"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600" />
            </span>
            <span className="uppercase tracking-widest">3-Step Hyperlocal Discovery</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-heading text-3xl sm:text-5xl 2xl:text-6xl font-extrabold text-gray-950 tracking-tight leading-tight"
          >
            How It{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600">
              Works
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3.5 text-base sm:text-lg text-gray-600 font-body leading-relaxed max-w-2xl mx-auto"
          >
            Discover, explore, and support local fashion stores in Namakkal in 3 simple seamless steps.
          </motion.p>
        </div>

        {/* Steps Grid Container */}
        <div className="relative">

          {/* Connecting Track Line for Desktop */}
          <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-1 bg-linear-to-r from-blue-400 via-indigo-400 to-emerald-400 -translate-y-10 z-0 rounded-full opacity-40 shadow-xs" />

          {/* Grid Cards with Staggered Entrance */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative z-10"
          >
            {steps.map((step) => (
              <motion.div
                key={step.number}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="group relative bg-white/95 backdrop-blur-md border border-gray-200/90 hover:border-blue-400/80 rounded-3xl p-8 sm:p-9 shadow-xs hover:shadow-2xl hover:shadow-blue-500/15 transition-all duration-500 flex flex-col justify-between overflow-hidden"
              >
                {/* Top Glowing Beam Accent */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r ${step.accent} opacity-90 group-hover:opacity-100 transition-opacity duration-500`} />

                <div>
                  {/* Step Header: Icon & Bright Highlighted Step Number Badge */}
                  <div className="flex items-center justify-between mb-8">
                    {/* Vibrant Icon Box */}
                    <div className="h-16 w-16 rounded-2xl bg-blue-50/80 border border-blue-100 flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:bg-linear-to-r group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-500">
                      {step.icon}
                    </div>

                    {/* Bright Glowing Step Number Badge Pill */}
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`relative px-4 py-1.5 rounded-2xl bg-linear-to-r ${step.numGradient} text-white font-heading font-black text-2xl tracking-tight shadow-md transition-shadow duration-500`}
                      style={{
                        boxShadow: `0 4px 20px ${step.glowColor}`
                      }}
                    >
                      <span className="relative z-10 drop-shadow-sm">{step.number}</span>
                      <span className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.div>
                  </div>

                  {/* Step Title & Description */}
                  <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-gray-950 mb-3 tracking-tight group-hover:text-blue-600 transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-body font-normal">
                    {step.description}
                  </p>
                </div>

                {/* Bottom Step Badge */}
                <div className="mt-8 pt-4 border-t border-gray-100/90 flex items-center justify-between">
                  <span className={`text-[11px] uppercase font-extrabold tracking-wider px-3.5 py-1 rounded-full border shadow-2xs ${step.lightBg}`}>
                    {step.badge}
                  </span>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600" />
                  </span>
                </div>

              </motion.div>
            ))}
          </motion.div>

        </div>

      </div>
    </section>
  );
}
