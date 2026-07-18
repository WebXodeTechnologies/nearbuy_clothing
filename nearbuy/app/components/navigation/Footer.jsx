"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logoImg from "@/public/logos/nearbuy.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const linkGroups = {
    explore: [
      { label: "Search Local Stores", href: "/stores", badge: "Live" },
      { label: "All Categories", href: "/categories" },
      { label: "Lookbook Drops", href: "/stores", badge: "HOT" },
      { label: "Walk-in Coupons", href: "/stores" },
      { label: "Featured Outlets", href: "/stores" },
    ],
    categories: [
      { label: "Women's Fashion", href: "/categories" },
      { label: "Men's Apparel", href: "/categories" },
      { label: "Designer Boutiques", href: "/categories", badge: "POPULAR" },
      { label: "Ethnic & Footwear", href: "/categories" },
      { label: "Seasonal Deals", href: "/categories" },
    ],
    merchants: [
      { label: "Become a Merchant", href: "/become-vendor", badge: "Partner" },
      { label: "Vendor Dashboard", href: "/vendor/dashboard" },
      { label: "Store Analytics", href: "/become-vendor" },
      { label: "Growth Stories", href: "/about" },
      { label: "Merchant FAQ", href: "/contact" },
    ],
    company: [
      { label: "About Our Story", href: "/about" },
      { label: "Contact Support", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "System Status", href: "/", badge: "99.9%" },
    ]
  };

  return (
    <footer className="relative bg-gray-950 text-gray-200 text-sm mt-auto overflow-hidden border-t border-gray-800/80">
      {/* Ambient background blur glows */}
      <div className="absolute top-0 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-7xl 2xl:max-w-[1440px] 3xl:max-w-[1600px] 4xl:max-w-[2000px] 5xl:max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 pt-16 sm:pt-20 pb-12 relative z-10">



        {subscribed && (
          <div className="mb-10 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm font-bold text-center animate-fadeIn shadow-lg">
            🎉 Thank you for subscribing! Check your inbox for your first local boutique discount code.
          </div>
        )}

        {/* Primary Footer Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-16 border-b border-gray-800/80">

          {/* Brand Info Column */}
          <div className="lg:col-span-1 space-y-5">
            <Link href="/" className="flex items-center gap-3 group focus:outline-none">
              <div className="relative h-11 w-11 rounded-2xl bg-gradient-to-tr from-blue-900/60 via-gray-900 to-indigo-900/60 border border-blue-500/40 p-1 flex items-center justify-center shadow-md group-hover:border-blue-400 transition-all duration-300 shrink-0">
                <Image
                  src={logoImg}
                  alt="Nearbuy Clothing Logo"
                  width={44}
                  height={44}
                  className="h-full w-full object-contain rounded-xl"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-white text-2xl tracking-tight leading-none group-hover:text-blue-400 transition-colors">
                  Nearbuy<span className="text-blue-500 ml-0.5">Clothing</span>
                </span>
                <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-widest mt-1">
                  Hyperlocal SaaS Platform
                </span>
              </div>
            </Link>

            <p className="text-sm text-gray-300 leading-relaxed font-normal">
              Empowering independent fashion boutiques with real-time digital lookbooks, instant walk-in coupons, and seamless local style discovery.
            </p>

            {/* Live Operational Status Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-gray-900/90 border border-gray-800 text-xs font-semibold text-gray-200 shadow-2xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              All Systems Operational
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-1">
              {[
                { label: "Twitter", href: "#", icon: "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" },
                { label: "Instagram", href: "#", icon: "M16 4H8C5.79 4 4 5.79 4 8v8c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4V8c0-2.21-1.79-4-4-4zm-4 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm4-7.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" },
                { label: "LinkedIn", href: "#", icon: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" },
                { label: "GitHub", href: "#", icon: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="h-9 w-9 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 hover:border-blue-500/50 transition-all duration-200 shadow-2xs"
                >
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Nav Links Column 1: Discover Stores */}
          <div className="space-y-4">
            <h5 className="font-heading font-extrabold text-white text-xs uppercase tracking-widest">
              Discover Stores
            </h5>
            <ul className="space-y-3">
              {linkGroups.explore.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-gray-300 hover:text-blue-400 hover:translate-x-1.5 transition-all duration-200 font-medium"
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-extrabold uppercase shadow-2xs">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Nav Links Column 2: Categories */}
          <div className="space-y-4">
            <h5 className="font-heading font-extrabold text-white text-xs uppercase tracking-widest">
              Popular Categories
            </h5>
            <ul className="space-y-3">
              {linkGroups.categories.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-gray-300 hover:text-blue-400 hover:translate-x-1.5 transition-all duration-200 font-medium"
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-extrabold uppercase shadow-2xs">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Nav Links Column 3: Merchants */}
          <div className="space-y-4">
            <h5 className="font-heading font-extrabold text-white text-xs uppercase tracking-widest">
              Merchant Network
            </h5>
            <ul className="space-y-3">
              {linkGroups.merchants.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-gray-300 hover:text-blue-400 hover:translate-x-1.5 transition-all duration-200 font-medium"
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold uppercase shadow-2xs">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Nav Links Column 4: Company */}
          <div className="space-y-4">
            <h5 className="font-heading font-extrabold text-white text-xs uppercase tracking-widest">
              Company & Legal
            </h5>
            <ul className="space-y-3">
              {linkGroups.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-gray-300 hover:text-blue-400 hover:translate-x-1.5 transition-all duration-200 font-medium"
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="px-2 py-0.5 rounded-md bg-gray-800 text-gray-300 border border-gray-700 text-[10px] font-extrabold uppercase shadow-2xs">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & WebXode Technologies Credit */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-gray-400 font-medium">

          {/* Copyright Line */}
          <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 text-center sm:text-left">
            <span>&copy; {currentYear} <strong className="text-white font-bold">Nearbuy Clothing</strong>. All rights reserved.</span>
          </div>

          {/* WebXode Technologies Attribution & Credit */}
          <div className="flex items-center gap-2 bg-gray-900/80 px-4 py-2 rounded-2xl border border-gray-800/90 shadow-2xs">
            <span className="text-white">Designed & Developed with</span>
            <span className="text-red-500 animate-pulse">❤️</span>
            <span className="text-white">by</span>
            <a
              href="https://webxode.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400 hover:from-blue-300 hover:to-indigo-200 transition-all  decoration-blue-500/40 underline-offset-4"
            >
              Webxode Technologies
            </a>
          </div>

          {/* Legal Quicklinks */}
          <div className="flex items-center gap-6 text-xs text-white">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Support</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
