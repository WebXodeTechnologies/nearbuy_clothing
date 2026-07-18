import React from "react";
import HeroSearchForm from "../forms/HeroSearchForm";

export default function HeroSection() {
  return (
    <section className="relative bg-white border-b border-gray-100 overflow-hidden py-16 sm:py-24 lg:py-28">
      {/* Background Decorative Gradients & Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-linear-to-tr from-blue-200/40 via-indigo-200/30 to-purple-100/20 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        {/* SaaS Platform Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-semibold bg-blue-50/90 text-blue-700 border border-blue-200 shadow-2xs mb-8 backdrop-blur-xs">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
          <span className="font-heading font-bold uppercase tracking-wider text-[11px] text-blue-600">Hyperlocal SaaS Platform</span>
          <span className="text-gray-300">•</span>
          <span className="font-medium text-gray-700">Discover Fashion Stores Near You</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold text-gray-950 tracking-tight max-w-5xl mx-auto leading-[1.08]">
          Find Premium Apparel Collections{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600">
            Right in Your Neighborhood
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-body">
          Discover independent boutiques, explore live lookbook drops, claim instant walk-in coupons, and visit offline stores for zero size mismatches.
        </p>

        {/* Search Component */}
        <HeroSearchForm />

        {/* SaaS Stats & Metrics Bar */}
        <div className="mt-16 pt-10 border-t border-gray-100 max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center">
            <span className="font-heading text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">150+</span>
            <span className="text-xs sm:text-sm font-semibold text-gray-500 mt-1 font-body">Verified Boutiques</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-heading text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">2,400+</span>
            <span className="text-xs sm:text-sm font-semibold text-gray-500 mt-1 font-body">Catalog Collections</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-heading text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">350+</span>
            <span className="text-xs sm:text-sm font-semibold text-gray-500 mt-1 font-body">Active Walk-in Deals</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-heading text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">4.9 ★</span>
            <span className="text-xs sm:text-sm font-semibold text-gray-500 mt-1 font-body">Shopper Rating</span>
          </div>
        </div>
      </div>
    </section>
  );
}
