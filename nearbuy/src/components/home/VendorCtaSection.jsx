"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";

const demoItems = {
  tops: {
    title: "Luxe Linen Summer Shirt",
    price: "₹1,899",
    color: "from-amber-400 to-orange-500",
    label: "Summer Collection",
    tagColor: "bg-amber-50 text-amber-700 border-amber-200/40",
    emoji: "👕",
    desc: "100% breathable organic linen, tailored fit."
  },
  bottoms: {
    title: "Chic Tailored Trousers",
    price: "₹2,499",
    color: "from-violet-500 to-indigo-500",
    label: "Casual Smart",
    tagColor: "bg-indigo-50 text-indigo-700 border-indigo-200/40",
    emoji: "👖",
    desc: "Premium lightweight cotton chino trousers."
  },
  dresses: {
    title: "Silk Cocktail Wrap Dress",
    price: "₹4,299",
    color: "from-pink-500 to-rose-500",
    label: "Festive Wear",
    tagColor: "bg-pink-50 text-pink-700 border-pink-200/40",
    emoji: "👗",
    desc: "Elegant raw Mulberry silk with wrap tie."
  }
};

const leadPool = [
  { sender: "Kavya M.", text: "Hi! Is the Silk Wrap Dress available in size M?", time: "Just now", dist: "1.2km away" },
  { sender: "Rahul S.", text: "Do you have the Linen Shirt in Olive Green?", time: "Just now", dist: "800m away" },
  { sender: "Priya D.", text: "Requested Google Maps driving directions", time: "Just now", dist: "2.1km away" },
  { sender: "Vikram R.", text: "Claimed 15% OFF Walk-in Coupon", time: "Just now", dist: "400m away" }
];

// Reusable premium card component with its own mouse spotlight highlight
function BenefitCard({ title, desc, emoji, colorClasses }) {
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

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      whileHover={{ y: -3 }}
      className="relative p-5 rounded-2xl bg-white border border-slate-100 hover:border-purple-200/60 shadow-xs hover:shadow-lg transition-all duration-300 flex gap-4 overflow-hidden group cursor-default"
    >
      {/* Interactive Cursor Spotlight Glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(120px circle at ${hoverPos.x}px ${hoverPos.y}px, rgba(147, 51, 234, 0.08), transparent 80%)`
        }}
      />
      <div className={`p-2.5 rounded-xl border shrink-0 flex items-center justify-center font-bold text-sm h-10 w-10 transition-colors group-hover:scale-105 duration-300 ${colorClasses}`}>
        {emoji}
      </div>
      <div>
        <h4 className="text-base font-bold text-slate-900 leading-tight transition-colors group-hover:text-purple-600">
          {title}
        </h4>
        <p className="text-sm text-slate-500 mt-1 leading-normal font-body">
          {desc}
        </p>
      </div>
    </motion.div>
  );
}

export default function VendorCtaSection() {
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("tops");

  // Interactive live metrics
  const [visitors, setVisitors] = useState(14);
  const [activeLead, setActiveLead] = useState(leadPool[0]);

  // 3D Tilt variables for smartphone mockup
  const mockupRef = useRef(null);
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);

  const rotateX = useTransform(tiltY, [-200, 200], [10, -10]);
  const rotateY = useTransform(tiltX, [-200, 200], [-10, 10]);

  const springRotateX = useSpring(rotateX, { stiffness: 180, damping: 25 });
  const springRotateY = useSpring(rotateY, { stiffness: 180, damping: 25 });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Update visitors counter and rotate simulated customer queries
  useEffect(() => {
    if (!mounted) return;

    const visitorInterval = setInterval(() => {
      setVisitors((prev) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const next = prev + delta;
        return next >= 8 && next <= 22 ? next : prev;
      });
    }, 4000);

    const leadInterval = setInterval(() => {
      setActiveLead((prev) => {
        const remainingPool = leadPool.filter((l) => l.sender !== prev.sender);
        return remainingPool[Math.floor(Math.random() * remainingPool.length)];
      });
    }, 7000);

    return () => {
      clearInterval(visitorInterval);
      clearInterval(leadInterval);
    };
  }, [mounted]);

  const handleMockupMouseMove = (e) => {
    if (!mockupRef.current) return;
    const rect = mockupRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Normalized position relative to center of the element
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    tiltX.set(mouseX);
    tiltY.set(mouseY);
  };

  const handleMockupMouseLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  const currentItem = demoItems[selectedCategory];

  return (
    <section className="py-24 sm:py-32 bg-white relative overflow-hidden text-slate-900 border-t border-slate-100">
      {/* Background Decorative Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_2px)] bg-size-[24px_24px] opacity-80 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column: Copy & Value Proposition */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-50 border border-purple-100 text-purple-700 text-xs font-bold rounded-full uppercase tracking-wider"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600" />
              </span>
              <span>For Apparel Merchants</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-heading text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-slate-950"
            >
              Grow Your Local Store&apos;s{" "}
              <span className="bg-clip-text text-transparent bg-linear-to-r from-purple-600 via-indigo-600 to-purple-800">
                Foot Traffic
              </span>{" "}
              & Digital Visibility
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 leading-relaxed font-body"
            >
              Join 150+ clothing store vendors on Nearbuy. Showcase seasonal inventory lookbooks, publish walk-in discount deals, and drive nearby shoppers straight to your storefront.
            </motion.p>

            {/* Benefit Cards Spotlight Grid */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-4 font-body"
            >
              <BenefitCard
                title="Digital Storefront in 5 Minutes"
                desc="List products and showcase collections automatically with zero technical setup."
                emoji="✓"
                colorClasses="text-purple-600 bg-purple-50 border-purple-100"
              />
              <BenefitCard
                title="In-Store Walk-In Coupon Campaigns"
                desc="Publish smart discounts online that shoppers must claim physically at your counter."
                emoji="✓"
                colorClasses="text-indigo-600 bg-indigo-50 border-indigo-100"
              />
              <BenefitCard
                title="Direct WhatsApp & Google Maps Leads"
                desc="Connect instantly with local buyers asking about stock availability and directions."
                emoji="✓"
                colorClasses="text-pink-600 bg-pink-50 border-pink-100"
              />
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 pt-2"
            >
              <Link href="/become-vendor" className="w-full sm:w-auto">
                <span className="w-full sm:w-auto inline-flex items-center justify-center font-bold px-8 py-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition-all shadow-md hover:shadow-lg hover:shadow-purple-600/15 text-sm cursor-pointer border border-purple-500/20 font-heading group">
                  Register Store Now
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </Link>
              <Link href="/about" className="w-full sm:w-auto">
                <span className="w-full sm:w-auto inline-flex items-center justify-center font-semibold px-8 py-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-all text-sm cursor-pointer font-body">
                  View Pricing Plans
                </span>
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Interactive Parallax 3D Device Showcase */}
          <div className="lg:col-span-5 relative" style={{ perspective: 1200 }}>
            {/* Background glowing orb element */}
            <div className="absolute -inset-4 bg-linear-to-r from-purple-500 to-indigo-500 rounded-[30px] blur-2xl opacity-10 pointer-events-none" />

            {/* Main Interactive Smartphone-like Card */}
            <motion.div
              ref={mockupRef}
              onMouseMove={handleMockupMouseMove}
              onMouseLeave={handleMockupMouseLeave}
              style={{
                rotateX: springRotateX,
                rotateY: springRotateY,
                transformStyle: "preserve-3d"
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative bg-white border border-slate-100 rounded-3xl p-6 shadow-2xl overflow-visible cursor-pointer"
            >
              {/* Header inside Shop mockup */}
              <div className="flex justify-between items-center pb-4 border-b border-slate-100" style={{ transform: "translateZ(20px)" }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-purple-600/10">
                    🛍️
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 leading-tight">Chic Boutique</h3>
                    <p className="text-[10px] text-slate-500 font-semibold flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Namakkal Storefront
                    </p>
                  </div>
                </div>

                {/* Live Browsing Counter Badge - Floating slightly higher */}
                <div
                  className="text-[10px] bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded-full border border-purple-100 flex items-center gap-1 animate-pulse"
                  style={{ transform: "translateZ(35px)" }}
                >
                  <span>●</span>
                  <span>{mounted ? visitors : 14} online</span>
                </div>
              </div>

              {/* Category Selector Pills inside Mockup */}
              <div className="flex gap-1.5 mt-5 p-1 bg-slate-50 rounded-xl border border-slate-100 relative z-10 font-body" style={{ transform: "translateZ(25px)" }}>
                {Object.keys(demoItems).map((key) => (
                  <button
                    key={key}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCategory(key);
                    }}
                    className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all capitalize cursor-pointer relative ${selectedCategory === key ? "text-purple-700" : "text-slate-500 hover:text-slate-800"
                      }`}
                  >
                    {selectedCategory === key && (
                      <motion.div
                        layoutId="activeCtaTab"
                        className="absolute inset-0 bg-white rounded-lg border border-purple-100 shadow-xs -z-10"
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      />
                    )}
                    {key === "tops" ? "👚 Tops" : key === "bottoms" ? "👖 Pants" : "👗 Dresses"}
                  </button>
                ))}
              </div>

              {/* Product Preview Card */}
              <div className="mt-5 min-h-[160px]" style={{ transform: "translateZ(30px)" }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedCategory}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 flex gap-4 items-center group font-body"
                  >
                    <div className={`w-16 h-16 rounded-xl bg-linear-to-tr ${currentItem.color} flex items-center justify-center text-3xl shadow-lg shrink-0`}>
                      {currentItem.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${currentItem.tagColor}`}>
                          {currentItem.label}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 truncate mt-1">{currentItem.title}</h4>
                      <p className="text-xs text-slate-500 leading-tight mt-0.5">{currentItem.desc}</p>

                      <div className="mt-2.5 flex items-baseline gap-2">
                        <span className="text-sm font-extrabold text-slate-900">{currentItem.price}</span>
                        <span className="text-[10px] text-purple-600 font-bold bg-purple-50 px-1.5 py-0.5 rounded">In Stock</span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Action Mock Button representing what buyers see */}
              <div className="mt-4" style={{ transform: "translateZ(20px)" }}>
                <div className="w-full bg-purple-600 text-white rounded-xl py-3 text-center text-xs font-bold shadow-md shadow-purple-600/10 border border-purple-500 flex items-center justify-center gap-2">
                  <span>Claim 15% Walk-in Discount</span>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>

              {/* Floating Parallax Lead Center Activity Ticker */}
              <div
                className="absolute -bottom-2 right-4 left-4 z-20 md:left-auto md:right-[-40px] md:bottom-[45px] md:max-w-[240px]"
                style={{ transform: "translateZ(65px)" }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeLead.sender}
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -15, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className="bg-white border border-purple-100 rounded-2xl p-3.5 shadow-2xl flex items-start gap-2.5 font-body"
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-sm shrink-0 border border-purple-100">
                      💬
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-black text-slate-800">{activeLead.sender}</span>
                        <span className="text-[8px] bg-slate-100 text-slate-500 font-semibold px-1.5 py-0.5 rounded-full">{activeLead.dist}</span>
                      </div>
                      <p className="text-[10px] text-slate-600 font-medium leading-tight mt-1 truncate">
                        {activeLead.text}
                      </p>
                      <span className="text-[8px] text-purple-500 font-semibold mt-1 block">Live lead captured</span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
