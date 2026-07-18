"use client";

import React from "react";
import Link from "next/link";
import StoreCard from "../cards/StoreCard";

export default function FeaturedStoresSection({ stores }) {
  return (
    <section className="relative py-20 sm:py-28 bg-linear-to-b from-gray-50/70 via-white to-blue-50/30 border-y border-gray-100/90 overflow-hidden">
      {/* Background Decorative Radial Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#d1d5db_1px,transparent_1px)] bg-size-[24px_24px] opacity-45 pointer-events-none" />

      {/* Ambient Glowing Orbs */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-blue-400/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-400/10 blur-3xl pointer-events-none rounded-full" />

      <div className="w-full max-w-7xl 2xl:max-w-[1440px] 3xl:max-w-[1600px] 4xl:max-w-[2000px] 5xl:max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 lg:mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs mb-3.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="uppercase tracking-wider">Top Rated Boutiques Network</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-5xl 2xl:text-6xl font-extrabold text-gray-950 tracking-tight leading-tight">
              Featured Offline{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600">
                Fashion Outlets
              </span>
            </h2>

            <p className="mt-3 text-base sm:text-lg text-gray-600 font-body leading-relaxed">
              Explore independent clothing boutiques, local designer hubs, and multi-brand outlets highly rated by walk-in shoppers across Namakkal.
            </p>
          </div>

          <Link
            href="/stores"
            className="group inline-flex items-center gap-2 bg-white hover:bg-blue-600 text-blue-600 hover:text-white text-xs sm:text-sm font-extrabold px-5 py-3.5 rounded-2xl transition-all duration-300 border border-blue-200 hover:border-blue-600 shadow-xs hover:shadow-xl hover:shadow-blue-500/20 shrink-0 self-start sm:self-auto"
          >
            <span>Explore All 150+ Stores</span>
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
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

        {/* Featured Stores Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>

      </div>
    </section>
  );
}
