"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { stores } from "../../../data/dummy-data";
import CollectionCard from "../../../components/cards/CollectionCard";
import OfferCard from "../../../components/cards/OfferCard";
import StoreCard from "../../../components/cards/StoreCard";
import Badge from "../../../components/ui/Badge";
import Breadcrumb from "../../../components/navigation/Breadcrumb";
import Modal from "../../../components/ui/Modal";

export default function StoreDetailsPage({ params }) {
  // Unwrap params using React.use for compatibility with Next.js dynamic routing
  const { slug } = use(params);
  
  // Find matching store
  const store = stores.find((s) => s.slug === slug);

  if (!store) {
    notFound();
  }

  const [activeTab, setActiveTab] = useState("collections"); // collections, offers, gallery, info
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);

  // Find related stores (same category or location)
  const relatedStores = stores
    .filter((s) => s.id !== store.id && (s.location === store.location || s.categories.some(cat => store.categories.includes(cat))))
    .slice(0, 3);

  return (
    <div className="flex-1 bg-gray-50/50 pb-16">
      {/* Store Banner */}
      <div className="relative h-60 md:h-80 w-full overflow-hidden bg-gray-200">
        <img src={store.banner} alt={store.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 md:-mt-24 relative z-10">
        {/* Breadcrumb path */}
        <div className="bg-white/95 backdrop-blur-xs px-4 py-2.5 rounded-lg border border-gray-150 inline-block shadow-xs mb-6">
          <Breadcrumb
            items={[
              { label: "Stores", href: "/stores" },
              { label: store.name, href: `/stores/${store.slug}` }
            ]}
          />
        </div>

        {/* Store Header Block */}
        <div className="bg-white border border-gray-150 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
          <div className="flex gap-4 sm:gap-6 items-center">
            <div className="h-20 w-20 md:h-24 md:w-24 border border-gray-150 bg-white rounded-2xl shadow-md overflow-hidden shrink-0">
              <img src={store.logo} alt={`${store.name} Logo`} className="w-full h-full object-cover" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-gray-950 tracking-tight">{store.name}</h1>
                <Badge variant="blue" pill className="text-[10px]">
                  {store.rating} ★ ({store.reviewsCount} reviews)
                </Badge>
              </div>
              <p className="text-xs text-gray-500 leading-normal max-w-xl">
                {store.description}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold pt-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span>{store.location}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="w-full md:w-auto flex flex-row sm:flex-col gap-2 shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-gray-50">
            <a
              href={`https://wa.me/${store.whatsapp}?text=Hi%20${encodeURIComponent(store.name)},%20I%20saw%20your%20store%20on%20Nearby%20Clothing%20and%20wanted%20to%20inquire%20about%20your%20latest%20collection.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer select-none"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.37 5.378 0 12.013 0c3.213.001 6.234 1.253 8.508 3.527 2.275 2.274 3.526 5.298 3.525 8.514-.003 6.643-5.378 12.013-12.012 12.013-2.003-.001-3.973-.5-5.713-1.455L0 24zm6.26-4.577c1.642.975 3.256 1.488 4.887 1.489 5.405 0 9.803-4.397 9.805-9.804.001-2.618-1.018-5.08-2.871-6.934-1.854-1.854-4.318-2.873-6.936-2.874-5.41 0-9.81 4.4-9.813 9.807-.001 1.77.473 3.328 1.411 4.821L1.874 21.84l4.443-1.617z" />
              </svg>
              WhatsApp Shop
            </a>
            <a
              href={`tel:${store.phone}`}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-xs transition-colors cursor-pointer select-none"
            >
              Call Merchant
            </a>
          </div>
        </div>

        {/* Detail Body */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main tabs area */}
          <div className="lg:col-span-8 space-y-6">
            {/* Tabs Header */}
            <div className="flex border-b border-gray-200 bg-white p-1 rounded-xl border">
              {[
                { id: "collections", label: `Latest Collections (${store.collections.length})` },
                { id: "offers", label: `Coupons & Offers (${store.offers.length})` },
                { id: "gallery", label: "Store Gallery" }
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50/50"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab content panels */}
            <div>
              {activeTab === "collections" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {store.collections.length === 0 ? (
                    <div className="col-span-2 text-center py-12 bg-white rounded-xl border border-gray-150">
                      <p className="text-xs text-gray-400">No active lookbooks posted yet.</p>
                    </div>
                  ) : (
                    store.collections.map((coll) => (
                      <CollectionCard key={coll.id} collection={coll} />
                    ))
                  )}
                </div>
              )}

              {activeTab === "offers" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {store.offers.length === 0 ? (
                    <div className="col-span-2 text-center py-12 bg-white rounded-xl border border-gray-150">
                      <p className="text-xs text-gray-400">No promo coupons available right now.</p>
                    </div>
                  ) : (
                    store.offers.map((off) => (
                      <OfferCard key={off.id} offer={off} />
                    ))
                  )}
                </div>
              )}

              {activeTab === "gallery" && (
                <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-xs">
                  {store.gallery.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-6">No gallery photos uploaded.</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {store.gallery.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedGalleryImage(imgUrl)}
                          className="h-28 sm:h-36 rounded-lg overflow-hidden bg-gray-100 border border-gray-150 cursor-pointer hover:opacity-90 transition-opacity"
                        >
                          <img src={imgUrl} alt={`Store interior ${idx + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Area: Contact Details / Business Hours / Maps */}
          <div className="lg:col-span-4 space-y-6">
            {/* Store Information Card */}
            <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-2">Business Information</h3>

              <div className="space-y-3.5">
                <div className="flex items-start gap-3 text-xs text-gray-600 leading-normal">
                  <svg className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <div>
                    <span className="font-semibold block text-gray-800">Physical Address</span>
                    <span>{store.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs text-gray-600">
                  <svg className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <span className="font-semibold block text-gray-800">Operating Hours</span>
                    <span>{store.hours}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs text-gray-600">
                  <svg className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <span className="font-semibold block text-gray-800">Phone Directory</span>
                    <span>{store.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map Card */}
            {store.mapEmbedUrl && (
              <div className="bg-white border border-gray-150 p-3 rounded-2xl shadow-xs overflow-hidden">
                <div className="h-56 rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
                  <iframe
                    src={store.mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                  />
                </div>
                <div className="mt-3 px-2 pb-1 text-center">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.name + " " + store.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1"
                  >
                    Open in Google Maps App
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Stores Section */}
        {relatedStores.length > 0 && (
          <div className="mt-16 border-t border-gray-200 pt-12">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-8">Related Stores Nearby</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedStores.map((related) => (
                <StoreCard key={related.id} store={related} />
              ))}
            </div>
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
          <div className="h-[450px] w-full rounded-lg overflow-hidden bg-black flex items-center justify-center">
            <img src={selectedGalleryImage} alt="Showcase Expanded" className="max-h-full max-w-full object-contain" />
          </div>
        )}
      </Modal>
    </div>
  );
}
