"use client";

import React, { useState, useEffect } from "react";
import HeroSearchForm from "../forms/HeroSearchForm";

// Live Counter with smooth initial count-up + periodic real-time tick-ups
function LiveCounterNumber({ target, suffix = "+", isDecimal = false, duration = 2200, liveIncrement = false }) {
  const [count, setCount] = useState(0);
  const [isFlashing, setIsFlashing] = useState(false);

  // Initial count up animation
  useEffect(() => {
    let startTimestamp = null;
    const end = parseFloat(target);

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Smooth cubic ease-out
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);
      const current = easeOutProgress * end;

      setCount(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    const animId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animId);
  }, [target, duration]);

  // Periodic real-time live pulse increment
  useEffect(() => {
    if (!liveIncrement) return;

    const interval = setInterval(() => {
      setCount((prev) => {
        const incrementAmount = Math.floor(Math.random() * 2) + 1;
        setIsFlashing(true);
        setTimeout(() => setIsFlashing(false), 1500);
        return prev + incrementAmount;
      });
    }, 8000 + Math.random() * 4000);

    return () => clearInterval(interval);
  }, [liveIncrement]);

  return (
    <span className={`inline-block transition-all duration-300 ${isFlashing ? 'text-emerald-500 scale-110 font-black drop-shadow-md' : ''}`}>
      {isDecimal ? count.toFixed(1) : Math.floor(count).toLocaleString()}
      {suffix}
    </span>
  );
}

export default function HeroSection() {
  return (
    <section className="relative bg-linear-to-b from-blue-50/60 via-white to-gray-50/40 border-b border-gray-100/80 overflow-hidden py-16 sm:py-24 lg:py-28">
      {/* Background Decorative Radial Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#d1d5db_1px,transparent_1px)] bg-size-[24px_24px] opacity-40 pointer-events-none" />
      
      {/* Animated Floating Ambient Glowing Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-linear-to-tr from-blue-400/25 via-indigo-300/20 to-purple-400/15 blur-3xl pointer-events-none rounded-full animate-pulse" />
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl pointer-events-none animate-float" />
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl pointer-events-none animate-float delay-1000" />

      {/* Real-time Floating Live Activity Badges (Desktop XL+) */}
      <div className="hidden xl:block absolute top-28 left-8 2xl:left-16 z-20 animate-bounce duration-4000">
        <div className="flex items-center gap-3 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-blue-200/80 shadow-xl shadow-blue-900/10 hover:scale-105 transition-transform duration-300">
          <div className="h-8.5 w-8.5 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 text-base">
            🛍️
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-gray-900 leading-snug">New Silk Saree Drop</p>
            <p className="text-[10px] font-bold text-blue-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
              Salem Road Boutique • Namakkal
            </p>
          </div>
        </div>
      </div>

      <div className="hidden xl:block absolute top-40 right-8 2xl:right-16 z-20 animate-bounce duration-5000">
        <div className="flex items-center gap-3 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-purple-200/80 shadow-xl shadow-purple-900/10 hover:scale-105 transition-transform duration-300">
          <div className="h-8.5 w-8.5 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0 text-base">
            🏷️
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-gray-900 leading-snug">35% OFF Walk-in Coupon</p>
            <p className="text-[10px] font-bold text-purple-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping" />
              Claimed 2m ago • Mohanur Road
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-7xl 2xl:max-w-[1440px] 3xl:max-w-[1600px] 4xl:max-w-[2000px] 5xl:max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 relative z-10 text-center">
        
        {/* Live Status SaaS Badge */}
        <div className="inline-flex items-center gap-2.5 px-4.5 py-2.5 rounded-full text-xs font-bold bg-white/95 text-blue-700 border border-blue-200/90 shadow-md shadow-blue-500/10 mb-8 backdrop-blur-md hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/15 transition-all duration-300 cursor-pointer group">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="font-heading font-extrabold uppercase tracking-wider text-[11px] text-blue-600">Hyperlocal SaaS Platform</span>
          <span className="text-gray-300">•</span>
          <span className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">Discover Fashion Stores in Namakkal</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl 2xl:text-8xl font-extrabold text-gray-950 tracking-tight max-w-5xl 2xl:max-w-6xl mx-auto leading-[1.08]">
          Find Premium Apparel Collections{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-blue-600 transition-all duration-700">
            Right in Namakkal
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-xl 2xl:text-2xl text-gray-600 max-w-3xl 2xl:max-w-4xl mx-auto leading-relaxed font-body font-normal">
          Discover independent clothing stores in Namakkal, explore live lookbook drops, claim instant walk-in coupons, and visit offline stores with zero size mismatches.
        </p>

        {/* Search Component Container with Ambient Glow */}
        <div className="relative mt-8 max-w-4xl mx-auto">
          <div className="absolute -inset-1 bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 pointer-events-none" />
          <div className="relative">
            <HeroSearchForm />
          </div>
        </div>

        {/* SaaS Animated Running & Live Updating Metrics Bar */}
        <div className="mt-14 pt-10 border-t border-gray-200/80 max-w-5xl 2xl:max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-center">
          
          {/* Stat 1: Verified Boutiques */}
          <div className="group relative bg-white/90 backdrop-blur-md border border-gray-200/80 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-xl hover:border-blue-400 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className="absolute top-3 right-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[9px] font-extrabold text-emerald-600 uppercase tracking-widest">LIVE</span>
            </div>
            <div className="absolute inset-0 bg-linear-to-tr from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="font-heading text-3xl sm:text-4xl 2xl:text-5xl font-extrabold text-gray-950 tracking-tight group-hover:text-blue-600 transition-colors">
              <LiveCounterNumber
                target={150}
                suffix="+"
                liveIncrement={true}
              />
            </span>
            <span className="block text-xs sm:text-sm font-semibold text-gray-600 mt-1.5 font-body group-hover:text-gray-900 transition-colors">
              Verified Boutiques in Namakkal
            </span>
          </div>

          {/* Stat 2: Catalog Collections */}
          <div className="group relative bg-white/90 backdrop-blur-md border border-gray-200/80 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-xl hover:border-indigo-400 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className="absolute top-3 right-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-[9px] font-extrabold text-indigo-600 uppercase tracking-widest">REALTIME</span>
            </div>
            <div className="absolute inset-0 bg-linear-to-tr from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="font-heading text-3xl sm:text-4xl 2xl:text-5xl font-extrabold text-gray-950 tracking-tight group-hover:text-indigo-600 transition-colors">
              <LiveCounterNumber
                target={2400}
                suffix="+"
                liveIncrement={true}
              />
            </span>
            <span className="block text-xs sm:text-sm font-semibold text-gray-600 mt-1.5 font-body group-hover:text-gray-900 transition-colors">
              Catalog Collections
            </span>
          </div>

          {/* Stat 3: Active Walk-in Deals */}
          <div className="group relative bg-white/90 backdrop-blur-md border border-gray-200/80 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-xl hover:border-purple-400 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className="absolute top-3 right-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
              <span className="text-[9px] font-extrabold text-purple-600 uppercase tracking-widest">ACTIVE</span>
            </div>
            <div className="absolute inset-0 bg-linear-to-tr from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="font-heading text-3xl sm:text-4xl 2xl:text-5xl font-extrabold text-gray-950 tracking-tight group-hover:text-purple-600 transition-colors">
              <LiveCounterNumber
                target={350}
                suffix="+"
                liveIncrement={true}
              />
            </span>
            <span className="block text-xs sm:text-sm font-semibold text-gray-600 mt-1.5 font-body group-hover:text-gray-900 transition-colors">
              Active Walk-in Deals
            </span>
          </div>

          {/* Stat 4: Shopper Rating */}
          <div className="group relative bg-white/90 backdrop-blur-md border border-gray-200/80 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-xl hover:border-amber-400 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className="absolute top-3 right-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-[9px] font-extrabold text-amber-600 uppercase tracking-widest">VERIFIED</span>
            </div>
            <div className="absolute inset-0 bg-linear-to-tr from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="font-heading text-3xl sm:text-4xl 2xl:text-5xl font-extrabold text-gray-950 tracking-tight group-hover:text-amber-500 transition-colors">
              <LiveCounterNumber target={4.9} suffix=" ★" isDecimal={true} />
            </span>
            <span className="block text-xs sm:text-sm font-semibold text-gray-600 mt-1.5 font-body group-hover:text-gray-900 transition-colors">
              Namakkal Shopper Rating
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
