"use client";

import React from "react";
import Link from "next/link";
import StoreCard from "../cards/StoreCard";

export default function FeaturedStoresSection({ stores }) {
  return (
    <section className="py-20 bg-gray-50/50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
              Top Rated Boutiques
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
              Featured Offline Stores
            </h2>
            <p className="mt-2 text-sm text-gray-500 max-w-xl">
              Explore independent boutiques and clothing stores highly rated by local walk-in shoppers.
            </p>
          </div>
          <Link
            href="/stores"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 bg-blue-50/80 hover:bg-blue-100 px-4 py-2 rounded-xl transition-all border border-blue-100 shrink-0 self-start sm:self-auto"
          >
            Explore All Stores
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      </div>
    </section>
  );
}
