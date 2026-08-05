"use client";

import React from "react";
import Link from "next/link";
import StoreCard from "../cards/StoreCard";

export default function FeaturedStoresSection({ stores = [] }) {
  return (
    <section className="relative py-16 sm:py-24 bg-linear-to-b from-gray-50/80 via-white to-blue-50/20 border-y border-gray-200/60 overflow-hidden">
      {/* Background Radial Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-60 pointer-events-none" />

      {/* Ambient Radial Lights */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-400/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/10 blur-3xl pointer-events-none rounded-full" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 lg:mb-14 gap-6">
          <div className="max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/80 mb-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="uppercase tracking-wider">Top Rated Boutiques Network</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-950 tracking-tight leading-tight">
              Featured Offline{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600">
                Fashion Outlets
              </span>
            </h2>

            <p className="mt-3 text-base text-gray-600 leading-relaxed font-body">
              Explore local clothing boutiques, ethnic hubs, and designer outlets highly rated by walk-in shoppers in Namakkal.
            </p>
          </div>

          <Link
            href="/stores"
            className="group inline-flex items-center gap-2 bg-white hover:bg-blue-600 text-gray-900 hover:text-white text-sm font-extrabold px-5 py-3 rounded-2xl transition-all duration-300 border border-gray-200 hover:border-blue-600 shadow-xs hover:shadow-lg hover:shadow-blue-500/20 shrink-0 self-start sm:self-auto"
          >
            <span>Explore All Outlets</span>
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200 text-blue-600 group-hover:text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {/* Dynamic Featured Stores Grid */}
        {stores && stores.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {stores.map((store) => (
              <StoreCard key={store._id || store.id || store.storeSlug} store={store} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200/80 shadow-xs max-w-md mx-auto">
            <p className="text-gray-500 font-medium text-sm">No featured stores found in the database.</p>
            <p className="text-gray-400 text-xs mt-1">New store listings will appear here automatically.</p>
          </div>
        )}

      </div>
    </section>
  );
}