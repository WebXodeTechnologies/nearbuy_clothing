"use client";

import React, { useState, useEffect } from "react";
import HeroSearchForm from "../forms/HeroSearchForm";
import { Store, QrCode, MapPin, Compass, ShoppingBag, Tag } from "lucide-react";
import Image from "next/image";

// Live Counter with smooth initial count-up + periodic real-time tick-ups
function LiveCounterNumber({ target, suffix = "+", isDecimal = false, duration = 2200, liveIncrement = false }) {
  const [count, setCount] = useState(0);
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    let startTimestamp = null;
    const end = parseFloat(target);

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
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
    <span className={`inline-block transition-all duration-300 ${isFlashing ? 'text-emerald-600 scale-110 font-black drop-shadow-sm' : ''}`}>
      {isDecimal ? count.toFixed(1) : Math.floor(count).toLocaleString()}
      {suffix}
    </span>
  );
}

export default function HeroSection() {
  const liveShowcaseCards = [
    {
      title: "Kanchipuram Pure Silk Saree",
      store: "Sri Amman Silks",
      location: "Salem Road • 0.8 km",
      price: "₹3,499",
      discount: "20% Walk-in Off",
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1000&h=1000&auto=format&fit=crop&q=80",
      tag: "Trending Today",
    },
    {
      title: "Designer Wedding Sherwani",
      store: "Royal Men's Hub",
      location: "Near Bus Stand • 1.2 km",
      price: "₹5,999",
      discount: "Flat ₹1000 Off",
      image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1000&h=1000&auto=format&fit=crop&q=80",
      tag: "Festive Special",
    },
    {
      title: "Kids Ethnic & Party Wear",
      store: "Tiny Tots Boutique",
      location: "Mohanur Road • 1.5 km",
      price: "₹1,299",
      discount: "15% Coupon",
      image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=1000&h=1000&auto=format&fit=crop&q=80",
      tag: "New Arrival",
    },
  ];

  const [activeCardIndex, setActiveCardIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCardIndex((prev) => (prev + 1) % liveShowcaseCards.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [liveShowcaseCards.length]);

  return (
    <section className="relative bg-linear-to-b from-blue-50/70 via-white to-slate-50 text-slate-900 overflow-hidden py-20 lg:py-28">

      {/* Background Soft Atmospheric Glows */}
      <div className="absolute top-10 left-1/4 w-112.5 h-112.5 bg-amber-400/10 rounded-full blur-[140px] pointer-events-none animate-pulse duration-7000" />
      <div className="absolute bottom-10 right-1/4 w-125 h-125 bg-blue-500/10 rounded-full blur-[160px] pointer-events-none animate-pulse duration-10000" />
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] bg-size-[32px_32px] opacity-40 pointer-events-none" />

      {/* Floating Left Activity Badges */}
      <div className="hidden xl:flex absolute top-32 left-16 z-20 items-center gap-3 bg-white/90 backdrop-blur-xl border border-slate-200 px-4 py-2.5 rounded-2xl shadow-xl shadow-slate-900/5 animate-bounce duration-4000">
        <div className="h-8 w-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
          <ShoppingBag className="w-4 h-4" />
        </div>
        <div className="text-left">
          <p className="text-[11px] font-bold text-slate-900">Live Store Order</p>
          <p className="text-[9px] text-emerald-600 font-mono font-semibold">Picked up at Salem Road</p>
        </div>
      </div>

      <div className="hidden xl:flex absolute bottom-32 left-12 z-20 items-center gap-3 bg-white/90 backdrop-blur-xl border border-slate-200 px-4 py-2.5 rounded-2xl shadow-xl shadow-slate-900/5 animate-pulse duration-3000">
        <div className="h-8 w-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-200">
          <Tag className="w-4 h-4" />
        </div>
        <div className="text-left">
          <p className="text-[11px] font-bold text-slate-900">Instant QR Voucher</p>
          <p className="text-[9px] text-purple-700 font-mono font-semibold">35% Walk-in Claimed</p>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ================= GRID COL LAYOUT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* ================= LEFT COLUMN: Headline & Search ================= */}
          <div className="lg:col-span-7 text-left space-y-8">

            {/* Trust Badge with Next.js Image avatars */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full text-xs font-semibold bg-white text-slate-700 border border-slate-200 shadow-md backdrop-blur-md">
              <div className="flex -space-x-2 overflow-hidden">
                <div className="relative h-6 w-6 rounded-full ring-2 ring-white overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Shopper 1" fill sizes="24px" className="object-cover" />
                </div>
                <div className="relative h-6 w-6 rounded-full ring-2 ring-white overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Shopper 2" fill sizes="24px" className="object-cover" />
                </div>
                <div className="relative h-6 w-6 rounded-full ring-2 ring-white overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80" alt="Shopper 3" fill sizes="24px" className="object-cover" />
                </div>
              </div>
              <span className="font-medium">Trusted by <strong className="text-slate-900">15,000+</strong> Namakkal Shoppers</span>
              <span className="flex items-center text-amber-500 gap-0.5 font-bold">★ 4.9</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="font-heading text-4xl sm:text-6xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.1]">
                Find Premium Apparel Collections{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 block sm:inline mt-1">
                  Right in Namakkal
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed font-body">
                Connect directly with local boutiques, browse live daily lookbook arrivals for men, women & kids, and claim instant walk-in QR discount codes before stepping out.
              </p>
            </div>

            {/* Search Box Component */}
            <div className="relative max-w-2xl">
              <div className="absolute -inset-1.5 bg-linear-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-60 pointer-events-none animate-pulse" />
              <div className="relative">
                <HeroSearchForm />
              </div>
            </div>

            {/* Quick Popular Neighborhood Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1 uppercase tracking-wider font-mono">
                <Compass className="w-3.5 h-3.5 text-blue-600" /> Hot Hubs:
              </span>
              {["Salem Road", "Bus Stand", "Mohanur Road", "Trichy Road", "Paramathi Road"].map((hub) => (
                <span
                  key={hub}
                  className="text-xs font-medium bg-white text-slate-700 border border-slate-200 px-3 py-1 rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all cursor-pointer shadow-2xs"
                >
                  {hub}
                </span>
              ))}
            </div>

          </div>

          {/* ================= RIGHT COLUMN: Showcase Card with Floating Customer Avatars Around It ================= */}
          <div className="lg:col-span-5 relative flex justify-center py-6">

            <div className="relative w-full max-w-sm">

              {/* ================= FLOATING CUSTOMER AVATARS (RIGHT SIDE) ================= */}

              {/* Top-Right Floating Shopper Avatar */}
              <div className="absolute -top-6 -right-6 z-30 hidden sm:flex items-center gap-3 bg-white/95 backdrop-blur-xl border border-slate-200 px-3.5 py-2 rounded-2xl shadow-xl animate-bounce duration-4500">
                <div className="relative h-10 w-10 rounded-xl ring-2 ring-amber-400/50 overflow-hidden shadow-xs">
                  <Image src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80" alt="Priya Namakkal" fill sizes="40px" className="object-cover" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    <p className="text-[11px] font-bold text-slate-900">Priya S.</p>
                    <span className="text-[9px] bg-amber-100 text-amber-700 font-semibold px-1 rounded">Verified</span>
                  </div>
                  <p className="text-[9px] text-slate-500">Just bought a Silk Saree 🎉</p>
                </div>
              </div>

              {/* Bottom-Right Floating Shopper Avatar */}
              <div className="absolute -bottom-6 -right-8 z-30 hidden sm:flex items-center gap-3 bg-white/95 backdrop-blur-xl border border-slate-200 px-3.5 py-2 rounded-2xl shadow-xl animate-bounce duration-5500">
                <div className="relative h-10 w-10 rounded-xl ring-2 ring-emerald-400/50 overflow-hidden shadow-xs">
                  <Image src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80" alt="Karthik Namakkal" fill sizes="40px" className="object-cover" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    <p className="text-[11px] font-bold text-slate-900">Karthik R.</p>
                    <span className="text-[9px] bg-emerald-100 text-emerald-700 font-semibold px-1 rounded">Walk-in</span>
                  </div>
                  <p className="text-[9px] text-slate-500">Saved ₹1,000 on Sherwani 🔥</p>
                </div>
              </div>

              {/* Mid-Left Floating Shopper Avatar */}
              <div className="absolute top-1/2 -left-8 z-30 hidden sm:flex items-center gap-2.5 bg-white/95 backdrop-blur-xl border border-slate-200 px-3.5 py-2 rounded-2xl shadow-xl animate-pulse duration-3000">
                <div className="relative h-8 w-8 rounded-xl ring-2 ring-purple-400/50 overflow-hidden shadow-xs">
                  <Image src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80" alt="Divya" fill sizes="32px" className="object-cover" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold text-slate-900">Divya K.</p>
                  <p className="text-[9px] text-purple-600 font-semibold">Claimed 20% Off Code</p>
                </div>
              </div>

              {/* Glowing backplate frame */}
              <div className="absolute -inset-1.5 bg-linear-to-tr from-blue-500/20 via-indigo-500/20 to-purple-600/20 rounded-3xl blur-2xl pointer-events-none animate-pulse" />

              {/* Main Floating Preview Box */}
              <div className="relative bg-white/95 backdrop-blur-xl border border-slate-200 rounded-3xl p-5 shadow-2xl shadow-slate-900/10 overflow-hidden group">

                {/* Header Tag */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Live Boutique Drop</span>
                  </div>
                  <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-200 font-semibold">
                    {liveShowcaseCards[activeCardIndex].tag}
                  </span>
                </div>

                {/* Square 1:1 Aspect Ratio Image Frame */}
                <div className="relative mt-4 aspect-square w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
                  <Image
                    src={liveShowcaseCards[activeCardIndex].image}
                    alt={liveShowcaseCards[activeCardIndex].title}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    priority
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-slate-950/10 to-transparent" />

                  {/* Floating Discount Badge */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-900 border border-slate-200 text-xs font-bold px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 z-10">
                    <QrCode className="w-4 h-4 text-blue-600" />
                    <span>{liveShowcaseCards[activeCardIndex].discount}</span>
                  </div>

                  {/* Price Tag */}
                  <div className="absolute top-3 right-3 bg-emerald-600 text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-md z-10">
                    {liveShowcaseCards[activeCardIndex].price}
                  </div>

                  {/* Store Information Overlay at Bottom of Image */}
                  <div className="absolute bottom-3 left-3 right-3 p-3 bg-white/90 backdrop-blur-md rounded-xl border border-slate-200/80 flex items-center justify-between z-10 shadow-md">
                    <div>
                      <h4 className="font-heading font-black text-slate-900 text-sm">
                        {liveShowcaseCards[activeCardIndex].title}
                      </h4>
                      <p className="text-[11px] text-slate-600 flex items-center gap-1 mt-0.5">
                        <Store className="w-3 h-3 text-blue-600" />
                        <span>{liveShowcaseCards[activeCardIndex].store}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-emerald-600 font-semibold flex items-center gap-0.5 justify-end">
                        <MapPin className="w-3 h-3" />
                        {liveShowcaseCards[activeCardIndex].location}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Carousel Indicator Dots */}
                <div className="flex items-center justify-center gap-2 mt-4 pt-2">
                  {liveShowcaseCards.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveCardIndex(i)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${i === activeCardIndex ? "w-6 bg-blue-600" : "w-1.5 bg-slate-300 hover:bg-slate-400"
                        }`}
                    />
                  ))}
                </div>

              </div>
            </div>

          </div>

        </div>

        {/* ================= METRICS BAR ================= */}
        <div className="mt-20 pt-10 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center">

          <div className="group relative bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all">
            <div className="absolute top-3 right-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[9px] font-extrabold text-emerald-600 uppercase tracking-widest">LIVE</span>
            </div>
            <span className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight group-hover:text-blue-600 transition-colors">
              <LiveCounterNumber target={150} suffix="+" liveIncrement={true} />
            </span>
            <span className="block text-xs font-semibold text-slate-600 mt-1 font-body">
              Verified Boutiques in Namakkal
            </span>
          </div>

          <div className="group relative bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:border-indigo-400 transition-all">
            <div className="absolute top-3 right-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-[9px] font-extrabold text-indigo-600 uppercase tracking-widest">SYNCED</span>
            </div>
            <span className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight group-hover:text-indigo-600 transition-colors">
              <LiveCounterNumber target={2400} suffix="+" liveIncrement={true} />
            </span>
            <span className="block text-xs font-semibold text-slate-600 mt-1 font-body">
              Catalog Collections
            </span>
          </div>

          <div className="group relative bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:border-emerald-400 transition-all">
            <div className="absolute top-3 right-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[9px] font-extrabold text-emerald-600 uppercase tracking-widest">ACTIVE</span>
            </div>
            <span className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight group-hover:text-emerald-600 transition-colors">
              <LiveCounterNumber target={350} suffix="+" liveIncrement={true} />
            </span>
            <span className="block text-xs font-semibold text-slate-600 mt-1 font-body">
              Active Walk-in Deals
            </span>
          </div>

          <div className="group relative bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all">
            <div className="absolute top-3 right-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-[9px] font-extrabold text-amber-600 uppercase tracking-widest">VERIFIED</span>
            </div>
            <span className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight group-hover:text-amber-600 transition-colors">
              <LiveCounterNumber target={4.9} suffix=" ★" isDecimal={true} />
            </span>
            <span className="block text-xs font-semibold text-slate-600 mt-1 font-body">
              Namakkal Shopper Rating
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}