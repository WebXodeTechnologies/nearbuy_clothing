"use client";

import React from "react";
import OfferCard from "../cards/OfferCard";

export default function TrendingOffersSection({ offers }) {
  return (
    <section className="py-20 bg-gray-50/50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
            In-Store Walk-In Savings
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
            Trending Local Coupon Deals
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Claim instant coupon codes online and show them at store counters to redeem offline discounts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {offers.map((off, idx) => (
            <OfferCard key={idx} offer={off} storeName={off.storeName} />
          ))}
        </div>
      </div>
    </section>
  );
}
