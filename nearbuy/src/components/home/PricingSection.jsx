"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { plans as defaultPlans } from "@/data/dummy-data";

function PricingCard({ plan, index, billingCycle }) {
  const cardRef = useRef(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setHoverPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const { name, price, period, description, features, cta, popular } = plan;

  // Simple price calculator if billing is yearly (20% off)
  const cleanPriceNum = parseInt(price.replace(/[^0-9]/g, ""), 10);
  const displayPrice = billingCycle === "yearly" 
    ? `₹${Math.round(cleanPriceNum * 0.8)}` 
    : price;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.215, 0.610, 0.355, 1.000] }}
      whileHover={{ y: -8 }}
      className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 overflow-hidden cursor-default select-none border min-h-[580px] ${
        popular 
          ? "border-purple-600 bg-white shadow-xl shadow-purple-600/5 ring-1 ring-purple-600/30" 
          : "border-slate-100 bg-white hover:border-slate-300 hover:shadow-xl shadow-xs"
      }`}
    >
      {/* Interactive Cursor Spotlight Glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: isHovering ? 1 : 0,
          background: popular
            ? `radial-gradient(150px circle at ${hoverPos.x}px ${hoverPos.y}px, rgba(147, 51, 234, 0.12), transparent 80%)`
            : `radial-gradient(150px circle at ${hoverPos.x}px ${hoverPos.y}px, rgba(147, 51, 234, 0.07), transparent 80%)`
        }}
      />

      {popular && (
        <div className="absolute top-4 right-4 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-600 text-white text-[10px] font-black tracking-wider uppercase rounded-full shadow-xs">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            Most Popular
          </span>
        </div>
      )}

      <div className="relative z-10 space-y-6">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-slate-950 font-heading">{name}</h3>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed font-body min-h-[40px]">{description}</p>
        </div>

        <div className="flex items-baseline gap-1 mt-4">
          <span className="text-4xl font-extrabold tracking-tight text-slate-950 font-heading">
            {displayPrice}
          </span>
          <span className="text-sm text-slate-500 font-semibold font-body">/{period}</span>
        </div>
        
        {billingCycle === "yearly" && (
          <span className="text-[10px] text-purple-700 bg-purple-50 border border-purple-100 font-bold px-2.5 py-0.5 rounded-full inline-block">
            Billed annually (Save 20%)
          </span>
        )}

        <div className="border-t border-slate-100 pt-6">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">What&apos;s included</h4>
          <ul className="space-y-3 font-body">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-600">
                <svg className={`w-4 h-4 mt-0.5 shrink-0 ${popular ? "text-purple-600" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
                <span className="leading-snug">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative z-10 mt-8">
        <Link href={`/become-vendor?plan=${name.toLowerCase()}`} className="block w-full">
          <span className={`block w-full py-4 rounded-xl text-center text-sm font-bold transition-all cursor-pointer ${
            popular 
              ? "bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg hover:shadow-purple-600/15" 
              : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
          }`}>
            {cta}
          </span>
        </Link>
      </div>
    </motion.div>
  );
}

export default function PricingSection({ plans }) {
  const displayPlans = plans && plans.length > 0 ? plans : defaultPlans;
  const [billingCycle, setBillingCycle] = useState("monthly");

  return (
    <section className="py-24 sm:py-32 bg-white relative overflow-hidden text-slate-900 border-t border-slate-100">
      {/* Background Decorative Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_2px)] bg-size-[24px_24px] opacity-80 pointer-events-none" />

      {/* Floating Gradient Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 -right-10 w-[450px] h-[450px] bg-purple-200/30 blur-3xl pointer-events-none rounded-full"
      />
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.25, 0.35, 0.25]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-1/4 -left-10 w-[350px] h-[350px] bg-indigo-200/40 blur-3xl pointer-events-none rounded-full"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-50 border border-purple-100/60 text-purple-700 text-xs font-bold rounded-full uppercase tracking-wider"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600" />
            </span>
            <span>Simple Pricing Plans</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-heading text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-slate-950"
          >
            Choose the Perfect Plan for your{" "}
            <span className="bg-clip-text text-transparent bg-linear-to-r from-purple-600 via-indigo-600 to-purple-800">
              Boutique
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base text-slate-500 leading-relaxed font-body max-w-2xl mx-auto"
          >
            Boost your walk-in foot traffic and local digital visibility with our budget-friendly listing plans. Scale up as you grow.
          </motion.p>
        </div>

        {/* Toggle Selector */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex justify-center mb-16"
        >
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200/60 font-body">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                billingCycle === "monthly" 
                  ? "bg-white text-purple-700 shadow-xs border border-purple-100" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Monthly billing
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer relative ${
                billingCycle === "yearly" 
                  ? "bg-white text-purple-700 shadow-xs border border-purple-100" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Yearly billing
              <span className="absolute -top-3.5 -right-3 px-1.5 py-0.5 bg-emerald-500 text-white text-[7px] font-black uppercase rounded-md tracking-wider">
                -20%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {displayPlans.map((plan, index) => (
            <PricingCard 
              key={plan.name} 
              plan={plan} 
              index={index} 
              billingCycle={billingCycle} 
            />
          ))}
        </div>

      </div>
    </section>
  );
}
