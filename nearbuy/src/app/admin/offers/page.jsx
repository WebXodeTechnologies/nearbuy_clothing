"use client";

import React, { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Badge from "@/components/ui/Badge";
import { toast } from "react-hot-toast";
import {
  Calendar,
  Eye,
  Trash2,
  Tag,
  Search,
  RefreshCw,
  Building,
  Power,
  X,
  ExternalLink,
  Sparkles,
  Percent,
  Clock,
  Ticket,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function OffersPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);

  const fetchAdminOffers = async () => {
    setLoading(true);
    try {
      // 1. Primary Admin endpoint
      let res = await fetch("/api/admin/offers");

      // 2. Fallback to public route with all=true query parameter
      if (!res.ok) {
        res = await fetch("/api/offers?all=true");
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to load offers queue");
      }

      const offersList = Array.isArray(data.data)
        ? data.data
        : data.data?.offers || [];

      setOffers(offersList);
    } catch (err) {
      console.error("fetchAdminOffers Error:", err);
      toast.error(err.message || "Failed to fetch vendor promotions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAdminOffers();
  }, []);

  const handleToggleStatus = async (offer) => {
    const offerId = offer._id || offer.id;
    const currentStatus = offer.status || "Active";
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";

    setActionLoadingId(offerId);
    try {
      let res = await fetch(`/api/admin/offers/${offerId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      // Fallback endpoint if legacy route
      if (!res.ok) {
        res = await fetch(`/api/offers/${offerId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update offer status");
      }

      toast.success(`Campaign status set to ${newStatus}`);
      await fetchAdminOffers();
      if (
        selectedOffer &&
        (selectedOffer._id === offerId || selectedOffer.id === offerId)
      ) {
        setSelectedOffer((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      toast.error(err.message || "Failed to update offer status");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id, title) => {
    if (
      confirm(
        `Are you sure you want to permanently delete campaign "${title || "this promotion"
        }"?`
      )
    ) {
      setActionLoadingId(id);
      try {
        let res = await fetch(`/api/admin/offers/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          res = await fetch(`/api/offers/${id}`, { method: "DELETE" });
        }

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to delete offer");
        }

        toast.success("Offer campaign removed successfully");
        await fetchAdminOffers();
        if (
          selectedOffer &&
          (selectedOffer._id === id || selectedOffer.id === id)
        ) {
          setSelectedOffer(null);
        }
      } catch (err) {
        toast.error(err.message || "Failed to delete campaign");
      } finally {
        setActionLoadingId(null);
      }
    }
  };

  const filtered = (offers || []).filter((o) => {
    const query = search.toLowerCase();
    const titleMatch = (o.title || "").toLowerCase().includes(query);
    const descMatch = (o.description || "").toLowerCase().includes(query);
    const codeMatch = (o.couponCode || o.code || "").toLowerCase().includes(query);
    const vendorMatch = (
      o.vendorId?.businessName ||
      o.vendorId?.storeName ||
      ""
    )
      .toLowerCase()
      .includes(query);

    const matchesSearch =
      !search || titleMatch || descMatch || codeMatch || vendorMatch;

    const offerStatus = (o.status || "Active").toUpperCase();
    const matchesStatus =
      statusFilter === "ALL" || offerStatus === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  const displayDiscount = (off) => {
    if (off.discountType === "Percentage" || off.discountPercentage) {
      return `${off.discountValue || off.discountPercentage}% OFF`;
    }
    return `₹${off.discountValue || off.discountAmount || 0} OFF`;
  };

  return (
    <div className="space-y-6 font-body pb-12">
      {/* 1. Header Section */}
      <DashboardHeader
        title="Boutique Promotions & Campaigns"
        description="Monitor active and scheduled walk-in offers, discount coupons, and clearance discount cards launched by physical shops."
        badge={`${offers?.length || 0} Campaigns Active`}
      >
        <button
          type="button"
          onClick={() => fetchAdminOffers()}
          className="px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-2"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${loading ? "animate-spin text-indigo-400" : ""
              }`}
          />
          <span>Refresh Campaigns</span>
        </button>
      </DashboardHeader>

      {/* 2. Search & Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search campaigns by title, code, or merchant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-slate-800"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 custom-scrollbar">
          {["ALL", "Active", "Inactive", "Expired"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-2 text-xs font-bold rounded-2xl transition-all cursor-pointer whitespace-nowrap ${statusFilter === st
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/70"
                }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Grid List */}
      {loading && !offers?.length ? (
        <div className="py-16 flex flex-col items-center justify-center space-y-3 bg-white rounded-3xl border border-slate-200/80">
          <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
          <span className="text-xs font-bold text-slate-500">
            Loading vendor offers queue...
          </span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200/80 rounded-3xl max-w-xl mx-auto shadow-xs space-y-3 p-6">
          <div className="h-12 w-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
            <Tag className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-black text-slate-900 text-sm">
            No Offer Campaigns Found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No merchant promotion records match your active search terms or status filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((off) => {
            const offerId = off._id || off.id;
            const isProcessing = actionLoadingId === offerId;
            const isActive = (off.status || "Active") === "Active";
            const bannerImage =
              off.banner ||
              off.image ||
              "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&q=80";

            const generatedCode =
              off.couponCode ||
              off.code ||
              (off.title
                ? off.title
                  .substring(0, 8)
                  .replace(/\s+/g, "")
                  .toUpperCase() + (off.discountValue || 10)
                : "SALE20");

            return (
              <div
                key={offerId}
                className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden flex flex-col justify-between group shadow-xs hover:border-indigo-200 hover:shadow-md transition-all duration-200"
              >
                {/* Image Banner */}
                <div className="h-44 w-full relative bg-slate-900 overflow-hidden">
                  <Image
                    src={bannerImage}
                    alt={off.title || "Offer Banner"}
                    fill
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <Badge
                      variant={isActive ? "emerald" : "red"}
                      pill
                      className="text-[9px] font-bold shadow-xs"
                    >
                      {isActive ? "Live Campaign" : "Inactive"}
                    </Badge>
                    <span className="bg-indigo-600 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-2xs">
                      {displayDiscount(off)}
                    </span>
                  </div>

                  {/* Coupon Code & Expiry Overlay */}
                  <div className="absolute bottom-3 left-4 right-4 text-white text-[11px] font-bold flex items-center justify-between">
                    <span className="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/20 font-mono text-[10px]">
                      CODE: {generatedCode}
                    </span>
                    <span className="flex items-center gap-1 text-[10px]">
                      <Calendar className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                      <span>
                        Till{" "}
                        {off.endDate
                          ? new Date(off.endDate).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => setSelectedOffer(off)}
                      className="text-sm font-heading font-black text-slate-900 hover:text-indigo-600 transition-colors text-left block leading-snug line-clamp-1 cursor-pointer"
                    >
                      {off.title}
                    </button>
                    <p className="text-xs text-slate-500 font-normal line-clamp-2 leading-relaxed">
                      {off.description || "No campaign description added."}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    {/* Merchant Tag */}
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80">
                      <div className="flex items-center gap-2 truncate max-w-50">
                        <Building className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span className="truncate text-[11px] font-bold">
                          {off.vendorId?.businessName ||
                            off.vendorId?.storeName ||
                            "Boutique Merchant"}
                        </span>
                      </div>
                      <Badge variant="indigo" pill className="text-[9px] font-extrabold shrink-0">
                        PROMO
                      </Badge>
                    </div>

                    {/* Bottom Metrics & Actions */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2.5 text-xs text-slate-400 font-bold font-mono">
                        <span className="flex items-center gap-1" title="Impressions">
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          <span>{off.views || 0} views</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Inspect Modal Button */}
                        <button
                          type="button"
                          onClick={() => setSelectedOffer(off)}
                          className="p-1.5 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer border border-transparent hover:border-indigo-100"
                          title="Inspect Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Toggle Status Button */}
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => handleToggleStatus(off)}
                          title={isActive ? "Deactivate Offer" : "Activate Offer"}
                          className={`p-1.5 rounded-xl transition-all cursor-pointer border ${isActive
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

                        {/* Delete Offer */}
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => handleDelete(offerId, off.title)}
                          className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 hover:border-rose-200 border border-transparent transition-all cursor-pointer disabled:opacity-50"
                          title="Delete Campaign"
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

      {/* 4. Offer Campaign Inspection Drawer */}
      {selectedOffer && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-end transition-opacity">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-sm font-heading font-black text-slate-900">
                    Promotion Campaign Inspection
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOffer(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Offer Banner & Header Box */}
              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="h-32 w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 relative">
                  <Image
                    src={
                      selectedOffer.banner ||
                      selectedOffer.image ||
                      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&q=80"
                    }
                    width={600}
                    height={400}
                    alt={selectedOffer.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="indigo" pill className="text-[10px] font-bold">
                      {displayDiscount(selectedOffer)}
                    </Badge>
                  </div>
                </div>

                <h4 className="font-heading font-black text-slate-900 text-base">
                  {selectedOffer.title}
                </h4>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {selectedOffer.description ||
                    "No promotional terms provided for this campaign."}
                </p>

                <div className="pt-1 flex items-center gap-2">
                  <Badge
                    variant={
                      selectedOffer.status === "Active" ? "emerald" : "red"
                    }
                    pill
                    className="text-[10px] font-bold"
                  >
                    Status: {selectedOffer.status || "Active"}
                  </Badge>
                </div>
              </div>

              {/* Detail Key-Value List */}
              <div className="space-y-3 text-xs text-slate-700">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400 font-medium">Coupon Code</span>
                  <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-100">
                    {selectedOffer.couponCode ||
                      selectedOffer.code ||
                      "WALK-IN DEPOSIT"}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400 font-medium">
                    Boutique Merchant
                  </span>
                  <span className="font-bold text-slate-900">
                    {selectedOffer.vendorId?.businessName ||
                      selectedOffer.vendorId?.storeName ||
                      "N/A"}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400 font-medium">
                    Valid Start Date
                  </span>
                  <span className="font-mono text-slate-900">
                    {selectedOffer.startDate
                      ? new Date(selectedOffer.startDate).toLocaleDateString()
                      : "Immediate"}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400 font-medium">
                    Expiry Date
                  </span>
                  <span className="font-mono text-slate-900">
                    {selectedOffer.endDate
                      ? new Date(selectedOffer.endDate).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400 font-medium">
                    Total Impressions
                  </span>
                  <span className="font-mono text-slate-900">
                    {selectedOffer.views || 0} Views
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <Link
                href={`/stores/${selectedOffer.vendorId?.businessSlug ||
                  selectedOffer.vendorId?.slug ||
                  selectedOffer.vendorId?._id ||
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