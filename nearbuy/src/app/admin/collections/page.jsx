"use client";

import React, { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Badge from "@/components/ui/Badge";
import useCollectionStore from "@/store/collectionStore";
import { toast } from "react-hot-toast";
import {
  Search,
  RefreshCw,
  FolderOpen,
  Trash2,
  Eye,
  MousePointerClick,
  Building,
  Tag,
  Power,
  X,
  ExternalLink,
  Layers,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CollectionsPage() {
  const {
    collections,
    fetchCollections,
    updateCollection,
    deleteCollection,
    loading,
  } = useCollectionStore();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [activeDrawerImageIdx, setActiveDrawerImageIdx] = useState(0);

  useEffect(() => {
    fetchCollections({ all: true });
  }, [fetchCollections]);

  const handleStatusToggle = async (coll) => {
    const collId = coll._id || coll.id;
    const nextStatus = !coll.status;
    setActionLoadingId(collId);

    try {
      if (updateCollection) {
        await updateCollection(collId, { status: nextStatus });
      } else {
        // Fallback endpoint if store function differs
        await fetch(`/api/admin/collections/${collId}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: nextStatus }),
        });
      }
      toast.success(
        nextStatus ? "Lookbook set to Live" : "Lookbook set to Inactive"
      );
      await fetchCollections({ all: true });
      if (selectedCollection && (selectedCollection._id === collId || selectedCollection.id === collId)) {
        setSelectedCollection((prev) => ({ ...prev, status: nextStatus }));
      }
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id, title) => {
    if (
      confirm(
        `Are you sure you want to permanently delete lookbook "${title || "this item"
        }"?`
      )
    ) {
      setActionLoadingId(id);
      try {
        await deleteCollection(id);
        toast.success("Lookbook deleted successfully");
        await fetchCollections({ all: true });
        if (selectedCollection && (selectedCollection._id === id || selectedCollection.id === id)) {
          setSelectedCollection(null);
        }
      } catch (err) {
        toast.error(err.message || "Failed to delete collection");
      } finally {
        setActionLoadingId(null);
      }
    }
  };

  // Derive unique categories for filter bar
  const categoriesList = Array.from(
    new Set(
      (collections || [])
        .map((c) => c.categoryId?.name || c.category)
        .filter(Boolean)
    )
  );

  const filtered = (collections || []).filter((c) => {
    const query = search.toLowerCase();
    const titleMatch = (c.title || "").toLowerCase().includes(query);
    const descMatch = (c.description || "").toLowerCase().includes(query);
    const vendorMatch = (
      c.vendorId?.businessName ||
      c.vendorId?.storeName ||
      ""
    )
      .toLowerCase()
      .includes(query);

    const matchesSearch = !search || titleMatch || descMatch || vendorMatch;

    const catName = c.categoryId?.name || c.category || "";
    const matchesCategory =
      categoryFilter === "ALL" ||
      catName.toUpperCase() === categoryFilter.toUpperCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 font-body pb-12">
      {/* 1. Header Section */}
      <DashboardHeader
        title="Boutique Catalog Lookbooks"
        description="Monitor seasonal catalogs, rack showcase collections, and apparel lines published by physical merchants."
        badge={`${collections?.length || 0} Total Lookbooks`}
      >
        <button
          type="button"
          onClick={() => fetchCollections({ all: true })}
          className="px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-2"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${loading ? "animate-spin text-indigo-400" : ""
              }`}
          />
          <span>Refresh Catalogs</span>
        </button>
      </DashboardHeader>

      {/* 2. Toolbar & Category Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search lookbooks by title, vendor, or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-slate-800"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        {/* Dynamic Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 custom-scrollbar">
          <button
            type="button"
            onClick={() => setCategoryFilter("ALL")}
            className={`px-3.5 py-2 text-xs font-bold rounded-2xl transition-all cursor-pointer whitespace-nowrap ${categoryFilter === "ALL"
              ? "bg-indigo-600 text-white shadow-xs"
              : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/70"
              }`}
          >
            All Categories
          </button>
          {categoriesList.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-2 text-xs font-bold rounded-2xl transition-all cursor-pointer whitespace-nowrap ${categoryFilter === cat
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/70"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Catalog Grid Showcase */}
      {loading && !collections?.length ? (
        <div className="py-16 flex flex-col items-center justify-center space-y-3 bg-white rounded-3xl border border-slate-200/80">
          <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
          <span className="text-xs font-bold text-slate-500">
            Loading lookbook catalogs...
          </span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200/80 rounded-3xl max-w-xl mx-auto shadow-xs space-y-3 p-6">
          <div className="h-12 w-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
            <FolderOpen className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-black text-slate-900 text-sm">
            No Lookbooks Found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No merchant lookbooks match your current search terms or category filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((coll) => {
            const collId = coll._id || coll.id;
            const isProcessing = actionLoadingId === collId;
            const bannerImage =
              coll.images?.[0] ||
              coll.image ||
              "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80";
            const isLive = coll.status !== false && coll.status !== "Inactive";
            const imageCount = coll.images?.length || (coll.image ? 1 : 0);

            return (
              <div
                key={collId}
                className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden flex flex-col justify-between shadow-xs hover:border-indigo-200 hover:shadow-md transition-all duration-200 group"
              >
                {/* Photo Banner */}
                <div className="h-48 w-full relative bg-slate-100 overflow-hidden">
                  <Image
                    src={bannerImage}
                    alt={coll.title || "Lookbook Cover"}
                    fill
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-transparent to-transparent" />

                  {/* Status Overlay Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <Badge
                      variant={isLive ? "emerald" : "red"}
                      pill
                      className="text-[9px] font-bold shadow-xs"
                    >
                      {isLive ? "Live Directory" : "Hidden"}
                    </Badge>
                  </div>

                  {/* Image Gallery Count Tag */}
                  {imageCount > 1 && (
                    <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/20 flex items-center gap-1">
                      <Layers className="w-3 h-3" />
                      <span>{imageCount} Photos</span>
                    </div>
                  )}

                  {/* Category Pill Tag */}
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-indigo-600/90 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-xl backdrop-blur-xs shadow-2xs">
                      {coll.categoryId?.name || coll.category || "General Line"}
                    </span>
                  </div>
                </div>

                {/* Card Contents */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCollection(coll);
                        setActiveDrawerImageIdx(0);
                      }}
                      className="text-sm font-heading font-black text-slate-900 hover:text-indigo-600 transition-colors text-left block leading-snug line-clamp-1 cursor-pointer"
                    >
                      {coll.title || "Untitled Lookbook Collection"}
                    </button>

                    <p className="text-xs text-slate-500 font-normal line-clamp-2 leading-relaxed">
                      {coll.description || "No description provided for this collection."}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    {/* Merchant Tag */}
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80">
                      <div className="flex items-center gap-2 truncate max-w-45">
                        <Building className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span className="truncate text-[11px] font-bold">
                          {coll.vendorId?.businessName ||
                            coll.vendorId?.storeName ||
                            "Boutique Merchant"}
                        </span>
                      </div>
                      <Badge variant="indigo" pill className="text-[9px] font-extrabold shrink-0">
                        {coll.price ? `₹${coll.price}` : "RACK LOOK"}
                      </Badge>
                    </div>

                    {/* Analytics Metrics & Actions */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-3 text-xs text-slate-400 font-bold font-mono">
                        <span className="flex items-center gap-1" title="Store Views">
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          <span>{coll.views || 0}</span>
                        </span>
                        <span className="flex items-center gap-1" title="WhatsApp Clicks">
                          <MousePointerClick className="w-3.5 h-3.5 text-indigo-500" />
                          <span>{coll.clicks || 0}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Inspect Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCollection(coll);
                            setActiveDrawerImageIdx(0);
                          }}
                          className="p-1.5 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer border border-transparent hover:border-indigo-100"
                          title="Inspect Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Toggle Status */}
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => handleStatusToggle(coll)}
                          title={isLive ? "Hide Lookbook" : "Publish Live"}
                          className={`p-1.5 rounded-xl transition-all cursor-pointer border ${isLive
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200"
                            }`}
                        >
                          {isProcessing ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Power className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Delete Lookbook */}
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => handleDelete(collId, coll.title)}
                          className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 hover:border-rose-200 border border-transparent transition-all cursor-pointer disabled:opacity-50"
                          title="Remove lookbook"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Lookbook Inspection Drawer */}
      {selectedCollection && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-end transition-opacity">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-sm font-heading font-black text-slate-900">
                    Lookbook Catalog Details
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCollection(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Photo Showcase Carousel / Main Preview */}
              <div className="space-y-2">
                <div className="h-56 w-full rounded-2xl bg-slate-100 overflow-hidden relative border border-slate-200/80">
                  <Image
                    src={
                      selectedCollection.images?.[activeDrawerImageIdx] ||
                      selectedCollection.image ||
                      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80"
                    }
                    alt={selectedCollection.title}
                    fill
                    className="w-full h-full object-cover"
                  />

                  {/* Previous / Next Image Buttons */}
                  {selectedCollection.images?.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between p-2">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveDrawerImageIdx((prev) =>
                            prev === 0
                              ? selectedCollection.images.length - 1
                              : prev - 1
                          )
                        }
                        className="p-1.5 rounded-full bg-slate-900/60 text-white hover:bg-slate-900 transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setActiveDrawerImageIdx((prev) =>
                            prev === selectedCollection.images.length - 1
                              ? 0
                              : prev + 1
                          )
                        }
                        className="p-1.5 rounded-full bg-slate-900/60 text-white hover:bg-slate-900 transition-colors cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Thumbnails row */}
                {selectedCollection.images?.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
                    {selectedCollection.images.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveDrawerImageIdx(idx)}
                        className={`h-12 w-12 rounded-xl overflow-hidden border-2 shrink-0 cursor-pointer transition-all ${activeDrawerImageIdx === idx
                          ? "border-indigo-600 scale-105 shadow-2xs"
                          : "border-transparent opacity-60 hover:opacity-100"
                          }`}
                      >
                        <Image
                          src={img}
                          alt="thumb"
                          fill
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Title & Description Box */}
              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-2">
                <h4 className="font-heading font-black text-slate-900 text-base">
                  {selectedCollection.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {selectedCollection.description ||
                    "No description provided for this collection."}
                </p>

                <div className="pt-2 flex items-center gap-2">
                  <Badge variant="indigo" pill className="text-[10px] font-bold">
                    {selectedCollection.categoryId?.name ||
                      selectedCollection.category ||
                      "General Category"}
                  </Badge>
                  <Badge
                    variant={
                      selectedCollection.status !== false ? "emerald" : "red"
                    }
                    pill
                    className="text-[10px] font-bold"
                  >
                    Status: {selectedCollection.status !== false ? "Live" : "Inactive"}
                  </Badge>
                </div>
              </div>

              {/* Metadata Details */}
              <div className="space-y-3 text-xs text-slate-700">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400 font-medium">Boutique Merchant</span>
                  <span className="font-bold text-slate-900">
                    {selectedCollection.vendorId?.businessName ||
                      selectedCollection.vendorId?.storeName ||
                      "N/A"}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400 font-medium">Price / Tag</span>
                  <span className="font-mono font-bold text-slate-900">
                    {selectedCollection.price
                      ? `₹${selectedCollection.price}`
                      : "Unpriced Rack Item"}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400 font-medium">Storefront Views</span>
                  <span className="font-mono text-slate-900">
                    {selectedCollection.views || 0} Impression Views
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400 font-medium">WhatsApp Leads</span>
                  <span className="font-mono text-slate-900">
                    {selectedCollection.clicks || 0} Direct Enquiries
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400 font-medium">Published Date</span>
                  <span className="font-mono text-slate-900">
                    {selectedCollection.createdAt
                      ? new Date(selectedCollection.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <Link
                href={`/stores/${selectedCollection.vendorId?.businessSlug ||
                  selectedCollection.vendorId?.slug ||
                  selectedCollection.vendorId?._id ||
                  ""
                  }`}
                target="_blank"
                className="w-full py-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>View Merchant Storefront</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}