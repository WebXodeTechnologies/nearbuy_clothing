"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Store,
  MapPin,
  ArrowUpDown,
  Sparkles,
} from "lucide-react";

export default function LatestCollectionsSection({
  collections = [],
  stores = [],
}) {
  const [activeImageIndices, setActiveImageIndices] = useState({});
  const [sortBy, setSortBy] = useState("latest"); // 'latest' | 'oldest' | 'price-low' | 'price-high'

  // 1. Create a lookup map for stores using storeId
  const storeMap = useMemo(() => {
    const map = {};
    stores.forEach((store) => {
      const sId = String(store._id || store.id);
      map[sId] = {
        name: store.storeName || store.name || "Local Storefront",
        slug: store.storeSlug || store.slug || "",
        logo: store.logo || store.vendorId?.logo || "",
        location: store.city || store.address || "Namakkal",
      };
    });
    return map;
  }, [stores]);

  // 2. Format and map all collections with their store info
  const formattedCollections = useMemo(() => {
    return collections.map((coll) => {
      const rawStoreId = coll.storeId?._id || coll.storeId;
      const sId = rawStoreId ? String(rawStoreId) : null;

      const storeInfo = (sId && storeMap[sId]) || {
        name: coll.storeName || coll.vendorId?.businessName || "Local Boutique",
        slug: coll.storeSlug || coll.vendorId?.businessSlug || "",
        logo: coll.logo || "",
        location: "Namakkal",
      };

      return {
        // eslint-disable-next-line react-hooks/purity
        id: String(coll._id || coll.id || Math.random()),
        title: coll.title || "New Arrival Lookbook",
        description: coll.description || "",
        images: [
          coll.coverImage,
          ...(Array.isArray(coll.images) ? coll.images : []),
        ].filter(Boolean),
        price: Number(coll.price) || 0,
        createdAt: coll.createdAt ? new Date(coll.createdAt) : new Date(),
        storeName: storeInfo.name,
        storeSlug: storeInfo.slug,
        storeLogo: storeInfo.logo,
        storeLocation: storeInfo.location,
      };
    });
  }, [collections, storeMap]);

  // 3. Multi-option Sorting & Slicing to exactly 6 cards
  const displayedCollections = useMemo(() => {
    const list = [...formattedCollections];

    switch (sortBy) {
      case "latest":
        list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case "oldest":
        list.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        break;
      case "price-low":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        list.sort((a, b) => b.price - a.price);
        break;
      default:
        list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    // 🔒 Limit to top 6 cards
    return list.slice(0, 6);
  }, [formattedCollections, sortBy]);

  return (
    <section className="relative py-20 sm:py-28 bg-linear-to-b from-white via-blue-50/20 to-indigo-50/30 border-t border-gray-100/90 overflow-hidden font-body">
      {/* Background Radial Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[24px_24px] opacity-50 pointer-events-none" />

      {/* Ambient Glowing Background Orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-150 h-150 bg-blue-400/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400/10 blur-3xl pointer-events-none rounded-full" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 lg:mb-16">
          <div className="text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs mb-3.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
              </span>
              <span className="uppercase tracking-wider">
                Fresh Lookbook Drops
              </span>
            </div>

            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-gray-950 tracking-tight leading-tight">
              Latest Lookbook{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600">
                Releases
              </span>
            </h2>

            <p className="mt-3.5 text-base sm:text-lg text-gray-600 leading-relaxed">
              Discover the newest designer drops curated across verified
              clothing boutiques in Namakkal.
            </p>
          </div>

          {/* 🔄 Sorting Controls */}
          <div className="flex items-center gap-2.5 self-start md:self-end bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-gray-200/90 shadow-2xs">
            <span className="text-xs font-bold text-gray-500 pl-2.5 flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-blue-600" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-extrabold text-gray-800 focus:outline-none focus:border-blue-600 cursor-pointer"
            >
              <option value="latest">Latest Drops (Newest)</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Collection Cards Grid (Strictly 6 Cards Max) */}
        {displayedCollections.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedCollections.map((coll) => {
              const currentImgIdx = activeImageIndices[coll.id] || 0;
              const allImages =
                coll.images.length > 0
                  ? coll.images
                  : [
                      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80",
                    ];

              return (
                <div
                  key={coll.id}
                  className="group relative flex flex-col bg-white/95 backdrop-blur-md border border-gray-200/90 hover:border-blue-500/50 rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-1.5 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10"
                >
                  {/* Store Name Header on Card */}
                  <div className="px-5 py-3.5 bg-gray-50/90 border-b border-gray-100 flex items-center justify-between shrink-0">
                    <Link
                      href={`/stores/${coll.storeSlug}`}
                      className="flex items-center gap-2.5 group/store truncate"
                    >
                      <div className="h-8 w-8 rounded-xl bg-white border border-gray-200 shadow-2xs overflow-hidden flex items-center justify-center shrink-0 relative">
                        {coll.storeLogo ? (
                          <Image
                            src={coll.storeLogo}
                            alt={coll.storeName}
                            fill
                            sizes="32px"
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <Store className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <div className="truncate">
                        <h4 className="font-heading font-extrabold text-gray-900 text-xs sm:text-sm group-hover/store:text-blue-600 transition-colors truncate">
                          {coll.storeName}
                        </h4>
                        <span className="text-[10px] text-gray-500 flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5 text-gray-400" />
                          {coll.storeLocation}
                        </span>
                      </div>
                    </Link>

                    <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-100 shrink-0">
                      Store Drop
                    </span>
                  </div>

                  {/* Instagram-Style 9:16 Vertical Aspect Ratio Container */}
                  <div className="w-full aspect-9/16 relative overflow-hidden bg-gray-900 shrink-0 select-none">
                    <Image
                      src={allImages[currentImgIdx % allImages.length]}
                      alt={coll.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-gray-950/70 via-transparent to-transparent pointer-events-none" />

                    {/* Carousel Navigation Arrows */}
                    {allImages.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveImageIndices((prev) => ({
                              ...prev,
                              [coll.id]:
                                currentImgIdx === 0
                                  ? allImages.length - 1
                                  : currentImgIdx - 1,
                            }));
                          }}
                          className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                          title="Previous Look"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveImageIndices((prev) => ({
                              ...prev,
                              [coll.id]:
                                currentImgIdx === allImages.length - 1
                                  ? 0
                                  : currentImgIdx + 1,
                            }));
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                          title="Next Look"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>

                        {/* Image Dots Indicator */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
                          {allImages.map((_, dotIdx) => (
                            <span
                              key={dotIdx}
                              className={`h-1.5 rounded-full transition-all ${
                                dotIdx === currentImgIdx % allImages.length
                                  ? "w-3 bg-white"
                                  : "w-1.5 bg-white/50"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}

                    {/* Price Badge */}
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-indigo-700 shadow-sm border border-indigo-100">
                      {coll.price
                        ? `₹${coll.price.toLocaleString("en-IN")}`
                        : "On Request"}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <h4 className="font-heading font-extrabold text-gray-950 text-base sm:text-lg tracking-tight group-hover:text-blue-600 transition-colors line-clamp-1">
                        {coll.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {coll.description ||
                          "Exclusive designer piece available for in-store trial and direct purchase."}
                      </p>
                    </div>

                    {/* Footer CTA */}
                    <div className="pt-3 border-t border-gray-100">
                      <Link
                        href={`/stores/${coll.storeSlug}`}
                        className="w-full inline-flex items-center justify-center gap-2 text-xs font-extrabold text-blue-600 hover:text-white bg-blue-50/80 hover:bg-blue-600 px-4 py-3 rounded-2xl transition-all border border-blue-100 hover:border-blue-600 shadow-2xs group/btn"
                      >
                        <span>Visit {coll.storeName}</span>
                        <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200/80 shadow-xs max-w-md mx-auto">
            <p className="text-gray-500 font-medium text-sm">
              No lookbook collections found.
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Stores will post fresh style drops soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
