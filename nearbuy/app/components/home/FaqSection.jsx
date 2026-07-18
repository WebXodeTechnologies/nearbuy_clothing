"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const defaultBrandFaqs = [
  {
    question: "What is Nearbuy Clothing and how does it work?",
    answer: "Nearbuy is a hyperlocal fashion discovery platform. We bridge the gap between digital convenience and physical retail by showcasing seasonal inventory catalogs of local clothing boutiques online. Shoppers can search for apparel nearby, verify real-time stock availability, claim walk-in discount coupons, and visit the physical store to try on and buy with zero fit-errors."
  },
  {
    question: "Can I buy clothes directly from the Nearbuy website?",
    answer: "No, Nearbuy is not an e-commerce transaction site. We believe in the power of touch-and-feel, fit verification, and supporting local retail. You discover products and claim discounts online, then visit the physical storefront to experience the clothing and finalize your purchase."
  },
  {
    question: "How do I claim a discount offer or walk-in coupon?",
    answer: "Simply find a store profile with an active offer on Nearbuy, click 'Claim Coupon' to generate a digital coupon badge. When you walk into that store, show this badge at the billing counter to instantly apply your discount."
  },
  {
    question: "I am a local boutique owner. How does Nearbuy help my business?",
    answer: "Nearbuy acts as a digital magnet for your brick-and-mortar store. By listing your live location, WhatsApp query hotlines, and latest collections, we direct local buyers straight to your counter, helping increase walk-in traffic by up to 35%."
  },
  {
    question: "Is listing my store on Nearbuy free?",
    answer: "Yes! We offer a Free Starter tier that allows you to list your basic storefront location, contact details, and a small catalog of products. For premium features like featured homepage placement, banner uploads, and unlimited coupon campaigns, we offer simple monthly subscription plans."
  },
  {
    question: "How do I contact a local store through Nearbuy?",
    answer: "Every storefront profile features direct phone numbers, an interactive Google Maps location finder, and a direct 'WhatsApp Inquiry' shortcut button that lets you message the merchant immediately to ask about sizes or store hours."
  },
  {
    question: "How do I know if a listed item is currently in stock?",
    answer: "While we sync inventory details with stores, we recommend clicking the 'WhatsApp Inquiry' button on the store's profile page. This allows you to message the merchant directly to verify exact size and color availability in seconds before making the trip."
  },
  {
    question: "Can I return or exchange items purchased through Nearbuy?",
    answer: "All transactions, returns, and exchanges are handled directly at the merchant's physical storefront under their store policies. Since you try on the apparel in-person before paying, return rates are virtually zero!"
  },
  {
    question: "Does Nearbuy provide home delivery services?",
    answer: "Nearbuy does not handle shipping or home delivery directly, as our platform is designed to promote local in-person shopping. However, many individual boutiques offer home delivery via local courier services which you can arrange directly with them via our WhatsApp chat link."
  },
  {
    question: "How often are the store catalogs and discounts updated?",
    answer: "Merchants update their catalogs and offers dynamically through their Vendor Dashboards. Popular collections, new season drops, and flash walk-in deals are updated in real-time, ensuring you get accurate local stock information."
  }
];


export default function FaqSection({ faqs }) {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const displayFaqs = defaultBrandFaqs;

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section className="py-24 sm:py-32 bg-slate-50/40 relative overflow-hidden text-slate-900 border-t border-slate-100">
      {/* Background Decorative Grid Pattern */}


      {/* Background Ambient Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.06, 1],
          opacity: [0.2, 0.28, 0.25]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-10 right-1/4 w-[380px] h-[380px] bg-purple-200/40 blur-3xl pointer-events-none rounded-full"
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
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
            <span>Clear Answers</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-heading text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-slate-950"
          >
            Frequently Asked{" "}
            <span className="bg-clip-text text-transparent bg-linear-to-r from-purple-600 via-indigo-600 to-purple-800">
              Questions
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base text-slate-500 leading-relaxed font-body"
          >
            Everything you need to know about the Nearbuy hyperlocal fashion discovery experience.
          </motion.p>
        </div>

        {/* Accordion Questions List */}
        <div className="space-y-4 font-body">
          {displayFaqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 shadow-xs ${isOpen
                  ? "border-purple-200/80 shadow-md ring-1 ring-purple-100/50"
                  : "border-slate-100 hover:border-slate-300/80"
                  }`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-slate-50/40 cursor-pointer group"
                >
                  <span className={`font-heading font-black text-sm sm:text-base tracking-tight transition-colors duration-200 ${isOpen ? "text-purple-700" : "text-slate-800 group-hover:text-slate-950"
                    }`}>
                    {faq.question}
                  </span>

                  <span className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${isOpen
                    ? "bg-purple-100 text-purple-700 rotate-180"
                    : "bg-slate-100 text-slate-500 group-hover:bg-slate-200/70 group-hover:text-slate-800"
                    }`}>
                    <svg
                      className="w-4 h-4 transition-transform duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial="collapsed"
                      animate="open"
                      exit="collapsed"
                      variants={{
                        open: { opacity: 1, height: "auto" },
                        collapsed: { opacity: 0, height: 0 }
                      }}
                      transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-50 pt-4 font-body">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
