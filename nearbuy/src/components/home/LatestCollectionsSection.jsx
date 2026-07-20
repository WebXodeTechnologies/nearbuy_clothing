/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import Link from "next/link";

export default function LatestCollectionsSection({ collections }) {
  return (
    <section className="relative py-20 sm:py-28 bg-linear-to-b from-white via-blue-50/20 to-indigo-50/30 border-t border-gray-100/90 overflow-hidden">
      {/* Background Radial Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[24px_24px] opacity-50 pointer-events-none" />

      {/* Ambient Glowing Background Orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-400/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400/10 blur-3xl pointer-events-none rounded-full" />

      <div className="w-full max-w-7xl 2xl:max-w-[1440px] 3xl:max-w-[1600px] 4xl:max-w-[2000px] 5xl:max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs mb-3.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
            </span>
            <span className="uppercase tracking-wider">Fresh Lookbook Drops</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-5xl 2xl:text-6xl font-extrabold text-gray-950 tracking-tight leading-tight">
            Latest Lookbook{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600">
              Releases
            </span>
          </h2>

          <p className="mt-3.5 text-base sm:text-lg text-gray-600 font-body leading-relaxed max-w-2xl mx-auto">
            Discover fresh designer drops, seasonal lookbooks, and exclusive clothing collections available in Namakkal store inventories right now.
          </p>
        </div>

        {/* Collection Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {collections.map((coll, idx) => (
            <div
              key={idx}
              className="group relative flex flex-col bg-white/90 backdrop-blur-md border border-gray-200/90 hover:border-blue-400/80 rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 shadow-xs hover:shadow-2xl hover:shadow-indigo-500/10"
            >
              {/* Image Container with Glow Sheen */}
              <div className="h-60 relative overflow-hidden bg-gray-100 shrink-0">
                <img
                  src={coll.image}
                  alt={coll.name}
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-linear-to-t from-gray-950/80 via-gray-950/20 to-transparent" />

                {/* Status Badge */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-blue-700 shadow-xs uppercase tracking-wide border border-blue-100 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                  New Drop
                </div>

                {/* Store Name Floating Micro-Chip */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[11px] font-bold truncate max-w-[90%]">
                    <span>🏬</span>
                    <span className="truncate">{coll.storeName}</span>
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-heading font-extrabold text-gray-950 text-xl tracking-tight group-hover:text-blue-600 transition-colors line-clamp-1 mb-2">
                    {coll.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed font-body">
                    {coll.description}
                  </p>
                </div>

                {/* Card Footer CTA */}
                <div className="mt-6 pt-4 border-t border-gray-100/90 flex items-center justify-between">
                  <Link
                    href={`/stores/${coll.storeSlug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold text-blue-600 hover:text-blue-700 bg-blue-50/80 hover:bg-blue-100 px-4 py-2.5 rounded-xl transition-all border border-blue-100 group/btn"
                  >
                    <span>Explore Store Catalog</span>
                    <svg
                      className="w-4 h-4 transition-transform group-hover/btn:translate-x-1.5"
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
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
