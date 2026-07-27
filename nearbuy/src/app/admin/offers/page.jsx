"use client";

import React, { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Card, { CardBody } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import useOfferStore from "@/store/offerStore";
import { toast } from "react-hot-toast";
import { Calendar, Eye, Trash2, Tag, Percent } from "lucide-react";

export default function OffersPage() {
  const { offers, fetchOffers, deleteOffer, loading } = useOfferStore();
  const [search, setSearch] = useState("");

  // Wait, let's override fetchOffers in client components or fetch directly for admin since we supported all=true
  const [adminOffers, setAdminOffers] = useState([]);
  const [adminLoading, setAdminLoading] = useState(true);

  const fetchAdminOffers = async (showLoading = false) => {
    if (showLoading) {
      setAdminLoading(true);
    }
    try {
      const res = await fetch("/api/offers?all=true");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setAdminOffers(data.data.offers || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAdminLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchAdminOffers();
    });
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to permanently delete this offer campaign?")) {
      try {
        const res = await fetch(`/api/offers/${id}`, { method: "DELETE" });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message);
        }
        toast.success("Offer campaign removed successfully!");
        fetchAdminOffers();
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  const filtered = adminOffers.filter((o) =>
    (o.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (o.description || "").toLowerCase().includes(search.toLowerCase()) ||
    (o.vendorId?.businessName || "").toLowerCase().includes(search.toLowerCase())
  );

  const displayDiscount = (off) => {
    return off.discountType === "Percentage"
      ? `${off.discountValue}% OFF`
      : `₹${off.discountValue} OFF`;
  };

  return (
    <div className="space-y-6 font-sans">
      <DashboardHeader
        title="Boutique Promotions & Campaigns"
        description="Monitor active and scheduled walk-in offers, discount coupons, and clearance discount cards launched by physical shops."
      />

      {/* Toolbar */}
      <div className="bg-white border border-gray-150 p-4 rounded-xl shadow-xs">
        <div className="max-w-md">
          <Input
            name="search"
            placeholder="Search campaigns by title, description, or vendor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={(props) => (
              <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          />
        </div>
      </div>

      {/* Grid List */}
      {adminLoading ? (
        <div className="py-16 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl max-w-xl mx-auto">
          <div className="h-12 w-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
            <Tag className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 text-sm">No Offers Found</h3>
          <p className="text-xs text-gray-550 mt-1">No merchant coupon records match your search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((off) => (
            <div
              key={off._id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col justify-between group shadow-2xs hover:shadow-md transition-all duration-200"
            >
              {/* Image Banner */}
              <div className="h-40 w-full relative bg-slate-900 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={off.banner || "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&q=80"}
                  alt={off.title}
                  className="w-full h-full object-cover opacity-80 group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <Badge variant={off.status === "Active" ? "success" : "danger"}>
                    {off.status === "Active" ? "Live" : "Inactive"}
                  </Badge>
                  <span className="bg-blue-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs">
                    {displayDiscount(off)}
                  </span>
                </div>

                <div className="absolute bottom-3 left-4 right-4 text-white text-[11px] font-bold flex items-center justify-between">
                  <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
                    CODE: {off.title.substring(0, 8).replace(/\s+/g, "").toUpperCase() + off.discountValue}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-teal-400" /> Valid till {off.endDate ? new Date(off.endDate).toLocaleDateString() : "N/A"}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 leading-snug">{off.title}</h3>
                  <p className="text-xs text-gray-500 font-semibold line-clamp-2 mt-1 leading-relaxed">
                    {off.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-600 bg-gray-50 p-2 rounded-xl border border-gray-100">
                    <span>Store: {off.vendorId?.businessName || "Unknown Boutique"}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-xs text-gray-400 font-bold">
                      <span className="flex items-center gap-0.5">
                        <Eye className="w-3.5 h-3.5" /> {off.views || 0} views
                      </span>
                    </div>

                    <button
                      onClick={() => handleDelete(off._id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete Campaign"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
