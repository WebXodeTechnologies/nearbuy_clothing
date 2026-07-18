"use client";

import React from "react";
import { motion } from "framer-motion";
import Breadcrumb from "../../components/navigation/Breadcrumb";
import ContactHeader from "../../components/contact/ContactHeader";
import ContactForm from "../../components/contact/ContactForm";
import ContactInfo from "../../components/contact/ContactInfo";
import ContactMap from "../../components/contact/ContactMap";

export default function ContactPage() {
  return (
    <div className="flex-1 bg-slate-50/30 py-12 pt-28 sm:pt-32 relative overflow-hidden min-h-screen">
      {/* Decorative Radial dot pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_2px)] bg-size-[24px_24px] opacity-75 pointer-events-none" />

      {/* Floating Ambient Mesh Glows */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.15, 0.22, 0.15]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-12 right-1/4 w-[450px] h-[450px] bg-purple-200/40 blur-3xl pointer-events-none rounded-full"
      />
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.2, 0.28, 0.2]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3
        }}
        className="absolute bottom-20 left-10 w-[350px] h-[350px] bg-indigo-200/40 blur-3xl pointer-events-none rounded-full"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-20 pb-20">
        
        {/* Breadcrumb glassmorphic pill */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-md px-4.5 py-2.5 rounded-2xl border border-slate-100/60 inline-block shadow-sm"
        >
          <Breadcrumb items={[{ label: "Contact Us", href: "/contact" }]} />
        </motion.div>

        {/* Custom Header */}
        <ContactHeader />

        {/* Section 1: Business Details (Horizontal grid columns) */}
        <div className="w-full">
          <ContactInfo />
        </div>

        {/* Section 2: Connection Map dashboard */}
        <div className="w-full">
          <ContactMap />
        </div>

        {/* Section 3: Centered Contact Form */}
        <div className="max-w-7xl mx-auto w-full">
          <ContactForm />
        </div>

      </div>
    </div>
  );
}
