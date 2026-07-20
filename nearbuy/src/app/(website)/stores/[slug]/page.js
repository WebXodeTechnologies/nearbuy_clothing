"use client";

import React, { useState, use, useRef } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { stores } from "@/data/dummy-data";
import CollectionCard from "@/components/cards/CollectionCard";
import OfferCard from "@/components/cards/OfferCard";
import StoreCard from "@/components/cards/StoreCard";
import Badge from "@/components/ui/Badge";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import Modal from "@/components/ui/Modal";

const contentVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const gridItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 85,
      damping: 14,
    },
  },
};

export default function StoreDetailsPage({ params }) {
  // Unwrap params using React.use for compatibility with Next.js dynamic routing
  const { slug } = use(params);

  // Find matching store
  const store = stores.find((s) => s.slug === slug);

  if (!store) {
    notFound();
  }

  const [activeTab, setActiveTab] = useState("collections"); // collections, offers, gallery
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);

  // Spotlight coordinates state for the Header card
  const headerRef = useRef(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const [isHoveringHeader, setIsHoveringHeader] = useState(false);

  const handleHeaderMouseMove = (e) => {
    if (!headerRef.current) return;
    const rect = headerRef.current.getBoundingClientRect();
    setHoverPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Find related stores (same category or location)
  const relatedStores = stores
    .filter(
      (s) =>
        s.id !== store.id &&
        (s.location === store.location ||
          s.categories.some((cat) => store.categories.includes(cat))),
    )
    .slice(0, 3);

  return (
    <div className="flex-1 bg-slate-50/30 pb-20 pt-24 relative overflow-hidden min-h-screen">
      {/* Decorative radial pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_2px)] bg-size-[24px_24px] opacity-75 pointer-events-none" />

      {/* Ambient backgrounds */}
      <motion.div
        animate={{
          scale: [1, 1.06, 1],
          opacity: [0.12, 0.2, 0.12],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-0 right-10 w-[450px] h-[450px] bg-purple-200/40 blur-3xl pointer-events-none rounded-full"
      />
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.15, 0.22, 0.15],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-1/3 left-10 w-[350px] h-[350px] bg-indigo-200/40 blur-3xl pointer-events-none rounded-full"
      />

      {/* Store Banner */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden bg-slate-900 z-0">
        <motion.img
          initial={{ scale: 1.1, opacity: 0.8 }}
          animate={{ scale: 1.02, opacity: 1 }}
          transition={{ duration: 0.8 }}
          src={store.banner}
          alt={store.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-900/40 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 md:-mt-24 relative z-10 space-y-8">
        {/* Breadcrumb path */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-md px-4.5 py-2.5 rounded-2xl border border-slate-100/60 inline-block shadow-sm"
        >
          <Breadcrumb
            items={[
              { label: "Stores", href: "/stores" },
              { label: store.name, href: `/stores/${store.slug}` },
            ]}
          />
        </motion.div>

        {/* Store Header Block */}
        <motion.div
          ref={headerRef}
          onMouseMove={handleHeaderMouseMove}
          onMouseEnter={() => setIsHoveringHeader(true)}
          onMouseLeave={() => setIsHoveringHeader(false)}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/95 backdrop-blur-md border border-slate-150 p-6 md:p-8 rounded-3xl shadow-xl shadow-slate-100/40 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center relative overflow-hidden transition-all duration-300 hover:border-purple-200/50"
        >
          {/* Spotlight element */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              opacity: isHoveringHeader ? 1 : 0,
              background: `radial-gradient(200px circle at ${hoverPos.x}px ${hoverPos.y}px, rgba(147, 51, 234, 0.05), transparent 80%)`,
            }}
          />

          <div className="flex gap-4 sm:gap-6 items-center relative z-10">
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="h-20 w-20 md:h-24 md:w-24 border border-slate-150 bg-white rounded-2xl shadow-md overflow-hidden shrink-0 ring-4 ring-white"
            >
              <img
                src={store.logo}
                alt={`${store.name} Logo`}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="space-y-1.5 font-body">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading">
                  {store.name}
                </h1>
                <Badge
                  variant="blue"
                  pill
                  className="text-[10px] font-extrabold bg-blue-50 border border-blue-100 text-blue-700"
                >
                  {store.rating} ★ ({store.reviewsCount} reviews)
                </Badge>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xl">
                {store.description}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold pt-1">
                <svg
                  className="w-4 h-4 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                </svg>
                <span className="text-slate-500">{store.location}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="w-full md:w-auto flex flex-row sm:flex-col gap-2 shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100/50 relative z-10">
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={`https://wa.me/${store.whatsapp}?text=Hi%20${encodeURIComponent(store.name)},%20I%20saw%20your%20store%20on%20Nearby%20Clothing%2520and%20wanted%20to%20inquire%20about%20your%2520latest%2520collection.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs shadow-md hover:shadow-lg shadow-emerald-500/10 transition-all cursor-pointer select-none"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.37 5.378 0 12.013 0c3.213.001 6.234 1.253 8.508 3.527 2.275 2.274 3.526 5.298 3.525 8.514-.003 6.643-5.378 12.013-12.012 12.013-2.003-.001-3.973-.5-5.713-1.455L0 24zm6.26-4.577c1.642.975 3.256 1.488 4.887 1.489 5.405 0 9.803-4.397 9.805-9.804.001-2.618-1.018-5.08-2.871-6.934-1.854-1.854-4.318-2.873-6.936-2.874-5.41 0-9.81 4.4-9.813 9.807-.001 1.77.473 3.328 1.411 4.821L1.874 21.84l4.443-1.617z" />
              </svg>
              WhatsApp Shop
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={`tel:${store.phone}`}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs transition-all cursor-pointer select-none shadow-xs"
            >
              Call Merchant
            </motion.a>
          </div>
        </motion.div>

        {/* Detail Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main tabs area */}
          <div className="lg:col-span-8 space-y-6">
            {/* Sliding Premium Tabs Header */}
            <div className="flex bg-slate-100/60 p-1.5 rounded-2xl border border-slate-200/50 relative z-10">
              {[
                {
                  id: "collections",
                  label: `Latest Collections (${store.collections.length})`,
                },
                {
                  id: "offers",
                  label: `Coupons & Offers (${store.offers.length})`,
                },
                { id: "gallery", label: "Store Gallery" },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex-1 text-center py-3 rounded-xl text-xs font-bold transition-all cursor-pointer relative"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute inset-0 bg-white border border-slate-200/10 shadow-xs rounded-xl"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                    <span
                      className={`relative z-10 ${isActive ? "text-purple-700 font-extrabold" : "text-slate-500 hover:text-slate-900"}`}
                    >
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Tab content panels */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {activeTab === "collections" && (
                  <motion.div
                    variants={gridContainerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                  >
                    {store.collections.length === 0 ? (
                      <div className="col-span-2 text-center py-16 bg-white border border-slate-150 rounded-3xl shadow-xs">
                        <p className="text-sm text-slate-400 font-body">
                          No lookbook collections posted yet.
                        </p>
                      </div>
                    ) : (
                      store.collections.map((coll) => (
                        <motion.div key={coll.id} variants={gridItemVariants}>
                          <CollectionCard collection={coll} />
                        </motion.div>
                      ))
                    )}
                  </motion.div>
                )}

                {activeTab === "offers" && (
                  <motion.div
                    variants={gridContainerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                  >
                    {store.offers.length === 0 ? (
                      <div className="col-span-2 text-center py-16 bg-white border border-slate-150 rounded-3xl shadow-xs">
                        <p className="text-sm text-slate-400 font-body">
                          No promotional coupons available at the moment.
                        </p>
                      </div>
                    ) : (
                      store.offers.map((off) => (
                        <motion.div key={off.id} variants={gridItemVariants}>
                          <OfferCard offer={off} />
                        </motion.div>
                      ))
                    )}
                  </motion.div>
                )}

                {activeTab === "gallery" && (
                  <div className="bg-white border border-slate-150 p-6 rounded-3xl shadow-sm">
                    {store.gallery.length === 0 ? (
                      <p className="text-sm text-slate-400 text-center py-8 font-body">
                        No showcase photos uploaded.
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {store.gallery.map((imgUrl, idx) => (
                          <motion.div
                            key={idx}
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedGalleryImage(imgUrl)}
                            className="h-28 sm:h-36 rounded-2xl overflow-hidden bg-slate-50 border border-slate-150 cursor-pointer shadow-xs hover:shadow-md transition-all duration-300"
                          >
                            <img
                              src={imgUrl}
                              alt={`Store interior ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sidebar Area: Contact Details / Business Hours / Maps */}
          <div className="lg:col-span-4 space-y-6">
            {/* Store Information Card */}
            <div className="bg-white border border-slate-150 p-6 rounded-3xl shadow-sm space-y-5">
              <h3 className="text-base font-black text-slate-900 border-b border-slate-50 pb-3 font-heading">
                Business Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5 text-sm text-slate-500 leading-relaxed font-body">
                  <div className="h-9 w-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-100/60 shrink-0 mt-0.5">
                    <svg
                      className="w-4.5 h-4.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="font-extrabold block text-slate-800 text-xs uppercase tracking-wider mb-0.5">
                      Physical Address
                    </span>
                    <span>{store.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 text-sm text-slate-500 leading-relaxed font-body">
                  <div className="h-9 w-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-100/60 shrink-0 mt-0.5">
                    <svg
                      className="w-4.5 h-4.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="font-extrabold block text-slate-800 text-xs uppercase tracking-wider mb-0.5">
                      Operating Hours
                    </span>
                    <span>{store.hours}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 text-sm text-slate-500 leading-relaxed font-body">
                  <div className="h-9 w-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-100/60 shrink-0 mt-0.5">
                    <svg
                      className="w-4.5 h-4.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="font-extrabold block text-slate-800 text-xs uppercase tracking-wider mb-0.5">
                      Phone Directory
                    </span>
                    <span>{store.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map Card */}
            {store.mapEmbedUrl && (
              <div className="bg-white border border-slate-150 p-3 rounded-3xl shadow-sm overflow-hidden">
                <div className="h-56 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
                  <iframe
                    src={store.mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                  />
                </div>
                <div className="mt-4 px-2 pb-1.5 text-center font-body">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.name + " " + store.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center justify-center gap-1.5"
                  >
                    Open in Google Maps App
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Stores Section */}
        {relatedStores.length > 0 && (
          <div className="mt-20 border-t border-slate-200/60 pt-16">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8 font-heading">
              Related Stores Nearby
            </h2>
            <motion.div
              variants={gridContainerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {relatedStores.map((related) => (
                <motion.div key={related.id} variants={gridItemVariants}>
                  <StoreCard store={related} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </div>

      {/* Gallery Modal Viewer */}
      <Modal
        isOpen={!!selectedGalleryImage}
        onClose={() => setSelectedGalleryImage(null)}
        title="Store Showcase"
        size="lg"
      >
        {selectedGalleryImage && (
          <div className="h-[450px] w-full rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center p-2">
            <img
              src={selectedGalleryImage}
              alt="Showcase Expanded"
              className="max-h-full max-w-full object-contain rounded-lg"
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
