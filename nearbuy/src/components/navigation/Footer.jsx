"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logoImg from "@public/logos/logo2.png";

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
    <footer className="relative bg-slate-950 text-blue-100 text-sm mt-auto overflow-hidden border-t border-white/10">
      {/* Ambient background blur glows */}
      <div className="absolute top-0 left-1/4 -translate-y-1/2 w-125 h-125 bg-blue-500/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 translate-y-1/2 w-125 h-125 bg-indigo-500/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-7xl 2xl:max-w-360 3xl:max-w-[1600px] 4xl:max-w-[2000px] 5xl:max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 pt-20 pb-12 relative z-10">

        {subscribed && (
          <div className="mb-10 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-sm font-bold text-center shadow-lg">
            🎉 Thank you for subscribing! Check your inbox for your first local boutique discount code.
          </div>
        )}

        {/* Primary Footer Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-16">

          {/* Brand Info Column */}
          <div className="lg:col-span-1 space-y-5">
            <Link href="/" className="inline-block group focus:outline-none" aria-label="Streetunics Clothing">
              {/* White Glassmorphic Card Container for Logo Visibility */}
              <div className="flex items-center justify-center px-5 py-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-white shadow-xl group-hover:scale-105 transition-all duration-300">
                <Image
                  src={logoImg}
                  alt="Streetunics Clothing"
                  width={612}
                  height={408}
                  className="h-14 sm:h-16 w-auto object-contain transition-transform duration-300"
                />
              </div>
            </Link>

            <p className="text-sm text-blue-200/90 leading-relaxed font-normal">
              Empowering independent fashion boutiques with real-time digital lookbooks, instant walk-in coupons, and seamless local style discovery.
            </p>

            {/* Live Operational Status Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-blue-100 shadow-xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
              </span>
              All Systems Operational
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-1">
              {[
                {
                  label: "Facebook",
                  href: "https://www.facebook.com/share/1HLXEFqrAu/?mibextid=wwXIfr",
                  icon: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
                },
                {
                  label: "Instagram",
                  href: "https://www.instagram.com/nearbuy.in?igsh=Yjd5d2dpYzVvYnlt&utm_source=qr",
                  icon: "M16 4H8C5.79 4 4 5.79 4 8v8c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4V8c0-2.21-1.79-4-4-4zm-4 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm4-7.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z",
                },
                {
                  label: "LinkedIn",
                  href: "#",
                  icon: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z",
                },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-blue-100 hover:text-white hover:bg-white/20 hover:scale-105 transition-all duration-200 shadow-xs"
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
                    className="group inline-flex items-center gap-2 text-sm text-blue-200/80 hover:text-white hover:translate-x-1 transition-all duration-200 font-medium"
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="px-2 py-0.5 rounded-md bg-white/15 backdrop-blur-sm border border-white/20 text-white text-[10px] font-extrabold uppercase shadow-xs">
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
                    className="group inline-flex items-center gap-2 text-sm text-blue-200/80 hover:text-white hover:translate-x-1 transition-all duration-200 font-medium"
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="px-2 py-0.5 rounded-md bg-white/15 backdrop-blur-sm border border-white/20 text-white text-[10px] font-extrabold uppercase shadow-xs">
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
                    className="group inline-flex items-center gap-2 text-sm text-blue-200/80 hover:text-white hover:translate-x-1 transition-all duration-200 font-medium"
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="px-2 py-0.5 rounded-md bg-white/15 backdrop-blur-sm border border-white/20 text-white text-[10px] font-extrabold uppercase shadow-xs">
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
                    className="group inline-flex items-center gap-2 text-sm text-blue-200/80 hover:text-white hover:translate-x-1 transition-all duration-200 font-medium"
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="px-2 py-0.5 rounded-md bg-white/15 backdrop-blur-sm border border-white/20 text-white text-[10px] font-extrabold uppercase shadow-xs">
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
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs sm:text-sm text-blue-200/80 font-medium">

          {/* Copyright Line */}
          <div className="text-center md:text-left">
            <span>&copy; {currentYear} <strong className="text-white font-bold">Streetunics</strong>. All rights reserved.</span>
          </div>

          {/* WebXode Technologies Attribution & Credit */}
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 shadow-xs">
            <span className="text-blue-100">Designed & Developed with</span>
            <span className="text-red-400 animate-pulse">❤️</span>
            <span className="text-blue-100">by</span>
            <a
              href="https://webxode.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-extrabold text-white hover:text-blue-200 transition-all underline decoration-white/40 underline-offset-4"
            >
              Webxode Technologies
            </a>
          </div>

          {/* Legal Quicklinks */}
          <div className="flex items-center gap-6 text-xs text-blue-200/80">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Support</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}