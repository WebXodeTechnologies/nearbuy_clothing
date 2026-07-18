"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Breadcrumb from "../../components/navigation/Breadcrumb";
import VendorBenefits from "../../components/vendor/VendorBenefits";
import VendorPricing from "../../components/vendor/VendorPricing";
import VendorFaqs from "../../components/vendor/VendorFaqs";

export default function BecomeVendorPage() {
  return (
    <div className="flex-1 bg-slate-50/30 py-12 pt-28 sm:pt-32 relative overflow-hidden min-h-screen">
      {/* Decorative Radial Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_2px)] bg-size-[24px_24px] opacity-75 pointer-events-none" />

      {/* Floating Ambient Mesh Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.15, 0.22, 0.15],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-12 right-1/4 w-[450px] h-[450px] bg-purple-200/40 blur-3xl pointer-events-none rounded-full"
      />
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.2, 0.28, 0.2],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
        className="absolute bottom-20 left-10 w-[350px] h-[350px] bg-indigo-200/40 blur-3xl pointer-events-none rounded-full"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-20">
        {/* Breadcrumb section */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/80 backdrop-blur-md px-4.5 py-2.5 rounded-2xl border border-slate-100/60 inline-block shadow-sm"
          >
            <Breadcrumb
              items={[{ label: "Become a Vendor", href: "/become-vendor" }]}
            />
          </motion.div>

          {/* Hero header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
            <motion.span
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-xs font-bold text-purple-700 bg-purple-50 border border-purple-100 px-3.5 py-1.5 rounded-full inline-block uppercase tracking-wider shadow-xs"
            >
              Vendor Program Listings
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight font-heading"
            >
              Put Your Clothing Store on the <br className="hidden sm:inline" />
              <span className="bg-clip-text text-transparent bg-linear-to-r from-purple-600 via-indigo-600 to-purple-800">
                Local Digital Map
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-sm sm:text-base text-slate-900 leading-relaxed max-w-2xl mx-auto font-body"
            >
              Nearby Clothing connects local boutique retailers directly with
              local shoppers looking to purchase offline. No courier logistics,
              just walk-in sales.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.22 }}
              className="pt-2 flex justify-center gap-3"
            >
              <Link href="/auth/register?role=vendor">
                <motion.span
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center justify-center font-bold px-6 py-3.5 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg shadow-purple-600/10 transition-all select-none cursor-pointer text-xs"
                >
                  Register Store Now
                </motion.span>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Benefits Grid */}
        <VendorBenefits />

        {/* Pricing Subscriptions */}
        <VendorPricing />
      </div>
    </div>
  );
}
