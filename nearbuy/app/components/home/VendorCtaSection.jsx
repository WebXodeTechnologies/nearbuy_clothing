import React from "react";
import Link from "next/link";

export default function VendorCtaSection() {
  return (
    <section className="py-20 bg-linear-to-r from-blue-700 via-blue-600 to-indigo-700 relative overflow-hidden text-white">
      {/* Radial glow overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 sm:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="max-w-2xl">
            <span className="inline-block px-3.5 py-1 bg-white/20 text-white text-xs font-bold rounded-full uppercase tracking-wider mb-3">
              For Apparel Merchants & Boutiques
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Grow Your Local Store&apos;s Foot Traffic & Digital Visibility
            </h2>
            <p className="mt-3 text-sm sm:text-base text-blue-100 leading-relaxed font-body">
              Join 150+ clothing store vendors on Nearbuy. Showcase seasonal inventory lookbooks, publish walk-in discount deals, and drive nearby shoppers straight to your storefront.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-blue-50 font-medium font-body">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
                <span>Digital Storefront setup in 5 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
                <span>Publish Lookbooks & Collections</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
                <span>In-Store Walk-In Coupon Campaigns</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
                <span>Direct WhatsApp & Google Maps Leads</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3.5 shrink-0 w-full md:w-auto">
            <Link href="/become-vendor" className="w-full">
              <span className="w-full inline-flex items-center justify-center font-bold px-8 py-4 rounded-xl bg-white text-blue-700 hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl text-sm cursor-pointer border border-white font-heading">
                Register Store Now
              </span>
            </Link>
            <Link href="/about" className="w-full">
              <span className="w-full inline-flex items-center justify-center font-semibold px-8 py-3.5 rounded-xl border border-blue-300/40 hover:border-white text-white transition-all text-sm cursor-pointer font-body">
                View Vendor Plans
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
