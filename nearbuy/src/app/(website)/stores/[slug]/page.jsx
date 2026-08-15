"use client";

import React, { useState, useEffect, useRef } from "react";
import { notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import CollectionCard from "@/components/cards/CollectionCard";
import OfferCard from "@/components/cards/OfferCard";
import Badge from "@/components/ui/Badge";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import Image from "next/image";

const contentVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
};

const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const gridItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 85, damping: 14 } },
};

export default function StoreDetailsPage({ params }) {
  const resolvedParams = React.use(params);
  const slug = resolvedParams?.slug;

  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("collections");
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);

  const headerRef = useRef(null);

  useEffect(() => {
    if (!slug) return;

    async function loadStoreData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/stores/${slug}`);
        if (!res.ok) {
          setStore(null);
          return;
        }
        const storeData = await res.json();
        const storeDoc = storeData?.data;

        if (!storeDoc) {
          setStore(null);
          return;
        }

        const vendorId = storeDoc.vendorId?._id || storeDoc.vendorId;
        const storeId = storeDoc._id;
        const city = storeDoc.city || "";

        const [collectionsRes, offersRes] = await Promise.all([
          fetch(`/api/vendors/collections?vendorId=${vendorId}&storeId=${storeId}`),
          fetch(`/api/offers?vendorId=${vendorId}`),
        ]);

        const collectionsData = await collectionsRes.json().catch(() => ({}));
        const offersData = await offersRes.json().catch(() => ({}));

        const rawCollections = collectionsData?.data?.collections || collectionsData?.collections || [];
        const rawOffers = offersData?.data?.offers || offersData?.offers || [];

        const mappedStore = {
          id: storeDoc._id,
          vendorId: vendorId,
          name: storeDoc.storeName || "Storefront",
          slug: storeDoc.storeSlug || storeDoc.vendorId?.businessSlug || "",
          logo: storeDoc.logo || storeDoc.vendorId?.logo || "",
          banner: storeDoc.coverImage || storeDoc.vendorId?.coverImage || "",
          rating: 4.8,
          reviewsCount: storeDoc.totalViews ? Math.floor(storeDoc.totalViews / 5) + 12 : 12,
          description: storeDoc.description || "",
          address: storeDoc.address || "",
          city: storeDoc.city || "",
          location: `${storeDoc.address || ""}, ${storeDoc.city || ""}`.replace(/^,\s*/, ""),
          phone: storeDoc.phone || storeDoc.vendorId?.phone || "",
          whatsapp: storeDoc.whatsapp || storeDoc.phone || storeDoc.vendorId?.phone || "",
          hours: storeDoc.openingTime && storeDoc.closingTime
            ? `${storeDoc.openingTime} - ${storeDoc.closingTime}`
            : "09:30 AM - 09:00 PM",
          gallery: Array.isArray(storeDoc.gallery) ? storeDoc.gallery : [],
          categories: storeDoc.categoryIds?.map(c => c.name) || ["Boutique"],
          collections: rawCollections.map(c => ({
            id: c._id,
            title: c.title,
            description: c.description || "",
            image: c.images?.[0] || c.coverImage || "",
            price: c.price || 0,
          })),
          offers: rawOffers.map(o => ({
            id: o._id,
            title: o.title,
            code: o.couponCode || o.code,
            discountType: o.discountType,
            discountValue: o.discountValue,
            endDate: o.endDate,
          })),
        };

        setStore(mappedStore);
      } catch (err) {
        console.error("Failed to load store details:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStoreData();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-slate-50/50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    );
  }

  if (!store) {
    notFound();
    return null;
  }

  return (
    <div className="flex-1 bg-slate-50/30 pb-20 pt-24 relative overflow-hidden min-h-screen font-body">
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_2px)] bg-[size:24px_24px] opacity-75 pointer-events-none" />

      {/* Store Banner */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden bg-slate-900 z-0">
        <motion.img
          initial={{ scale: 1.1, opacity: 0.8 }}
          animate={{ scale: 1.02, opacity: 1 }}
          transition={{ duration: 0.8 }}
          src={store.banner || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80"}
          alt={store.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 md:-mt-24 relative z-10 space-y-8">
        <div className="bg-white/85 backdrop-blur-md px-4.5 py-2.5 rounded-2xl border border-slate-100/60 inline-block shadow-xs">
          <Breadcrumb
            items={[
              { label: "Stores", href: "/stores" },
              { label: store.name, href: `/stores/${store.slug}` },
            ]}
          />
        </div>

        {/* Store Header Block */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/95 backdrop-blur-md border border-slate-200/80 p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row gap-6 justify-between items-start md:items-center relative overflow-hidden"
        >
          <div className="flex gap-4 sm:gap-6 items-center relative z-10">
            <div className="h-20 w-20 md:h-24 md:w-24 border border-slate-200 bg-white rounded-2xl shadow-md overflow-hidden shrink-0 ring-4 ring-white relative">
              <Image
                src={store.logo || "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=200&auto=format&fit=crop&q=80"}
                alt={`${store.name} Logo`}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading">
                  {store.name}
                </h1>
                <Badge variant="blue" pill className="text-[10px] font-extrabold bg-blue-50 border border-blue-100 text-blue-700">
                  {store.rating} ★ ({store.reviewsCount} reviews)
                </Badge>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xl">
                {store.description}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold pt-1">
                <span className="text-slate-500">{store.location}</span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto flex flex-row sm:flex-col gap-2 shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100/50 relative z-10">
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={`https://wa.me/${store.whatsapp}?text=Hi%20${encodeURIComponent(store.name)},%20I%20saw%20your%20store%20on%20Nearby%20Clothing.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer select-none"
            >
              WhatsApp Shop
            </motion.a>
          </div>
        </motion.div>

        {/* Tabbed Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="flex bg-slate-100/60 p-1.5 rounded-2xl border border-slate-200/50 relative z-10">
              {[
                { id: "collections", label: `Latest Collections (${store.collections.length})` },
                { id: "offers", label: `Coupons & Offers (${store.offers.length})` },
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
                        className="absolute inset-0 bg-white border border-slate-200/40 shadow-xs rounded-xl"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className={`relative z-10 ${isActive ? "text-purple-700 font-extrabold" : "text-slate-500 hover:text-slate-900"}`}>
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={activeTab} variants={contentVariants} initial="hidden" animate="visible" exit="hidden">
                {activeTab === "collections" && (
                  <motion.div variants={gridContainerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {store.collections.length === 0 ? (
                      <div className="col-span-2 text-center py-16 bg-white border border-slate-200/80 rounded-3xl shadow-xs">
                        <p className="text-sm text-slate-400">No lookbook collections posted yet for this store.</p>
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
                  <motion.div variants={gridContainerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {store.offers.length === 0 ? (
                      <div className="col-span-2 text-center py-16 bg-white border border-slate-200/80 rounded-3xl shadow-xs">
                        <p className="text-sm text-slate-400">No promotional coupons available at the moment.</p>
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
                  <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm">
                    {store.gallery.length === 0 ? (
                      <p className="text-sm text-slate-400 text-center py-8">No showcase photos uploaded.</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {store.gallery.map((imgUrl, idx) => (
                          <motion.div
                            key={idx}
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedGalleryImage(imgUrl)}
                            className="h-28 sm:h-36 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 cursor-pointer shadow-xs relative"
                          >
                            <Image src={imgUrl} alt={`Store interior ${idx + 1}`} fill className="object-cover" />
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm space-y-5">
              <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3 font-heading">
                Business Information
              </h3>
              <div className="space-y-4 text-sm text-slate-500">
                <div>
                  <span className="font-extrabold block text-slate-800 text-xs uppercase tracking-wider mb-0.5">Physical Address</span>
                  <span>{store.address || store.location}</span>
                </div>
                <div>
                  <span className="font-extrabold block text-slate-800 text-xs uppercase tracking-wider mb-0.5">Operating Hours</span>
                  <span>{store.hours}</span>
                </div>
                <div>
                  <span className="font-extrabold block text-slate-800 text-xs uppercase tracking-wider mb-0.5">Phone Directory</span>
                  <span>{store.phone || "Not Provided"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}