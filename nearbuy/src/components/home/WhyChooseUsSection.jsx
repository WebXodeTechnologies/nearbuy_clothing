"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function WhyChooseUsSection() {
  const [activeStep, setActiveStep] = useState(0);

  // Sequential live process ticker (01 -> 02 -> 03 -> 01)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      step: "01",
      icon: (
        <svg className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Zero Size & Fit Mismatches",
      description:
        "Skip online return cycles. Discover local boutiques nearby, walk in, try on apparel in person, and get custom alteration or fitting support on the spot.",
      badge: "In-Person Fitting",
      accent: "from-blue-500 via-cyan-400 to-indigo-500",
      borderGlow: "rgba(59, 130, 246, 0.6)",
      stepHex: "#60a5fa"
    },
    {
      step: "02",
      icon: (
        <svg className="w-7 h-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      title: "Touch & Feel Real Fabrics",
      description:
        "Apparel looks different in heavily retouched studio photos. Walk in to feel cotton weights, linen textures, and silk weaves before spending.",
      badge: "Guaranteed Quality",
      accent: "from-indigo-500 via-purple-400 to-pink-500",
      borderGlow: "rgba(99, 102, 241, 0.6)",
      stepHex: "#818cf8"
    },
    {
      step: "03",
      icon: (
        <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Instant Collection Pickups",
      description:
        "Need an outfit for an event tonight? Don't wait for 2-day delivery delays. Browse nearby inventories online and pick up instantly.",
      badge: "Same-Day Readiness",
      accent: "from-emerald-500 via-teal-400 to-blue-500",
      borderGlow: "rgba(16, 185, 129, 0.6)",
      stepHex: "#34d399"
    },
  ];

  return (
    <section className="relative py-24 sm:py-32 bg-slate-950 text-white overflow-hidden">

      {/* Dynamic Background Light Orbs linked to Active Step */}
      <motion.div
        animate={{
          x: activeStep === 0 ? "-30%" : activeStep === 1 ? "0%" : "30%",
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.35, 0.2]
        }}
        transition={{
          duration: 2,
          ease: "easeInOut"
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-blue-600/30 blur-[130px] pointer-events-none rounded-full"
      />

      <div className="w-full max-w-7xl 2xl:max-w-[1440px] 3xl:max-w-[1600px] 4xl:max-w-[2000px] 5xl:max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-black bg-blue-500/20 text-blue-300 border border-blue-400/40 shadow-xs mb-4">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-400" />
            </span>
            <span className="uppercase tracking-widest text-blue-300 font-extrabold">
              Sequential 3-Step Local Process
            </span>
          </div>

          <h2
            style={{ color: "#ffffff" }}
            className="font-heading text-3xl sm:text-5xl 2xl:text-6xl font-extrabold tracking-tight text-white! leading-tight"
          >
            Why Browse & Shop Local{" "}
            <span
              style={{
                backgroundImage: "linear-gradient(to right, #93c5fd, #c7d2fe, #e9d5ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
              className="inline-block"
            >
              Fashion Offline?
            </span>
          </h2>

          <p
            style={{ color: "#cbd5e1" }}
            className="mt-4 text-base sm:text-lg text-slate-300! leading-relaxed font-body max-w-2xl mx-auto font-medium"
          >
            Online shopping is convenient, but apparel requires tactile quality, exact sizing, and immediate availability. Here is how Nearbuy bridges the physical-digital gap in Namakkal.
          </p>
        </div>




        {/* Feature Cards Grid with Live Border Animations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative z-20">
          {features.map((feature, idx) => {
            const isActive = activeStep === idx;

            return (
              <div
                key={feature.step}
                className="relative group p-[2px] rounded-[26px] overflow-hidden transition-all duration-500"
              >
                {/* Live Rotating Conic Border Animation */}
                <motion.div
                  className="absolute inset-0 bg-linear-to-r from-blue-500 via-purple-500 to-emerald-500 opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{
                    rotate: [0, 360]
                  }}
                  transition={{
                    duration: isActive ? 4 : 10,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    filter: isActive ? "blur(2px)" : "none"
                  }}
                />

                {/* Animated Pulsing Active Border Beam Sweep */}
                {isActive && (
                  <motion.div
                    layoutId="activeBorder"
                    className="absolute inset-0 bg-linear-to-r from-blue-400 via-indigo-300 to-emerald-400 rounded-[26px] z-0 blur-xs"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                {/* Main Card Content Container */}
                <div
                  style={{ backgroundColor: "#0b0f19" }}
                  className={`relative z-10 p-8 sm:p-9 rounded-[24px] flex flex-col justify-between h-full border transition-all duration-500 ${isActive
                    ? "border-blue-400/80 shadow-[0_0_30px_rgba(59,130,246,0.35)]"
                    : "border-slate-800/90 hover:border-slate-700 shadow-2xl"
                    }`}
                >
                  {/* Top Glowing Beam Accent */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r ${feature.accent}`} />

                  <div>
                    {/* Header Row: Icon + Sequential Step Index */}
                    <div className="flex items-center justify-between mb-8">
                      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 ${isActive
                        ? "bg-slate-800 border-2 border-blue-400 scale-110 shadow-blue-500/30"
                        : "bg-slate-900 border border-slate-700/80 group-hover:scale-105"
                        }`}>
                        {feature.icon}
                      </div>

                      {/* Live Sequential Step Badge */}
                      <div className="flex items-center gap-2">
                        {isActive && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/50 text-[10px] font-black uppercase tracking-wider animate-pulse">
                            Live Step
                          </span>
                        )}
                        <span
                          style={{ color: feature.stepHex }}
                          className="font-heading text-2xl font-black tracking-widest"
                        >
                          {feature.step}
                        </span>
                      </div>
                    </div>

                    <h3
                      style={{ color: "#ffffff" }}
                      className="font-heading text-xl sm:text-2xl font-extrabold text-white! mb-3 tracking-tight group-hover:text-blue-300! transition-colors"
                    >
                      {feature.title}
                    </h3>
                    <p
                      style={{ color: "#cbd5e1" }}
                      className="text-sm sm:text-base text-slate-300! leading-relaxed font-body font-normal"
                    >
                      {feature.description}
                    </p>
                  </div>

                  {/* Bottom Footer Badge Pill */}
                  <div className="mt-8 pt-5 border-t border-slate-800/90 flex items-center justify-between">
                    <span
                      style={{ color: "#cbd5e1" }}
                      className="text-xs uppercase font-extrabold tracking-widest text-slate-300!"
                    >
                      {feature.badge}
                    </span>
                    <span className="relative flex h-2.5 w-2.5">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-linear-to-r ${feature.accent} opacity-75`} />
                      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 bg-linear-to-r ${feature.accent}`} />
                    </span>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
