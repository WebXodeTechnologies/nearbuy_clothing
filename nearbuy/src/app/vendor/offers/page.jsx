"use client";

import React, { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Modal from "@/components/ui/Modal";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import useOfferStore from "@/store/offerStore";
import {
  Tag,
  Plus,
  Calendar,
  Eye,
  MessageSquare,
  Copy,
  Pause,
  Play,
  Edit,
  Trash2,
  Sparkles,
  Zap,
} from "lucide-react";

export default function VendorOffers() {
  const { user } = useAuth();
  const { offers, fetchOffers, createOffer, deleteOffer, loading } = useOfferStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState("Percentage");
  const [discountValue, setDiscountValue] = useState(20);
  const [validUntil, setValidUntil] = useState("2026-08-31");
  const [banner, setBanner] = useState("");

  useEffect(() => {
    if (user?.vendorId) {
      fetchOffers(user.vendorId);
    }
  }, [user, fetchOffers]);

  const handleOpenAdd = () => {
    setEditingOffer(null);
    setTitle("");
    setDiscountType("Percentage");
    setDiscountValue(20);
    setValidUntil("2026-08-31");
    setDescription("Applicable on minimum cart value ₹1,999.");
    setBanner("https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=600&q=80");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (off) => {
    setEditingOffer(off);
    setTitle(off.title);
    setDiscountType(off.discountType || "Percentage");
    setDiscountValue(off.discountValue || 20);
    setValidUntil(off.endDate ? new Date(off.endDate).toISOString().split("T")[0] : "2026-08-31");
    setDescription(off.description);
    setBanner(off.banner);
    setIsModalOpen(true);
  };

  const handleDuplicate = async (off) => {
    try {
      const payload = {
        title: `${off.title} (Copy)`,
        discountType: off.discountType,
        discountValue: off.discountValue,
        endDate: off.endDate,
        description: off.description,
        banner: off.banner,
        status: off.status,
      };
      await createOffer(payload);
    } catch (e) {
      // Error handled in store
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this offer campaign?")) {
      await deleteOffer(id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title,
      discountType,
      discountValue: Number(discountValue),
      endDate: new Date(validUntil).toISOString(),
      description,
      banner,
      status: "Active",
    };

    try {
      if (editingOffer) {
        // Since useOfferStore update method isn't implemented, we will simulate or implement PUT call
        const res = await fetch(`/api/offers/${editingOffer._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        toast.success("Campaign details updated!");
        fetchOffers(user.vendorId);
      } else {
        await createOffer(payload);
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getOfferCode = (off) => {
    return off.title
      ? off.title.substring(0, 8).replace(/\s+/g, "").toUpperCase() + (off.discountValue || "")
      : "OFFER";
  };

  const displayDiscount = (off) => {
    return off.discountType === "Percentage"
      ? `FLAT ${off.discountValue}% OFF`
      : `FLAT ₹${off.discountValue} OFF`;
  };

  return (
    <div className="space-y-8 font-body pb-12">
      <DashboardHeader
        title="Promotions & Walk-in Campaigns"
        description="Launch coupon codes, flat discounts, or buy-one-get-one offers to drive nearby shoppers directly to your store door."
        badge="Marketing Cards"
      >
        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create Promotion
        </button>
      </DashboardHeader>

      {/* Offer Cards Grid */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      ) : offers.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#ECECEC] rounded-3xl max-w-xl mx-auto shadow-xs p-8">
          <div className="h-12 w-12 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-teal-100">
            <Tag className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-slate-900 text-base">No Active Promotions</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed font-medium">
            Creating promotional coupons is the fastest way to increase customer walk-ins this week.
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-5 px-5 py-2.5 rounded-2xl bg-indigo-600 text-white text-xs font-bold shadow-md hover:bg-indigo-700 transition-colors"
          >
            Launch Offer
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offers.map((off) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={off._id}
              className="bg-white rounded-3xl border border-[#ECECEC] shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
            >
              {/* Campaign Banner Header */}
              <div className="h-44 w-full relative overflow-hidden bg-slate-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={off.banner || "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&q=80"}
                  alt={off.title}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="bg-linear-to-r from-teal-500 to-indigo-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md">
                    {displayDiscount(off)}
                  </span>
                  <span
                    className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full shadow-xs ${
                      off.status === "Active" ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
                    }`}
                  >
                    {off.status}
                  </span>
                </div>

                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                  <span className="font-mono text-xs font-bold bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/30">
                    CODE: {getOfferCode(off)}
                  </span>
                  <span className="text-[10px] font-bold text-slate-200 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-teal-400" /> Valid till {off.endDate ? new Date(off.endDate).toLocaleDateString() : "N/A"}
                  </span>
                </div>
              </div>

              {/* Campaign Body */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-heading font-bold text-slate-900 leading-tight">
                    {off.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1 line-clamp-2 leading-relaxed">
                    {off.description}
                  </p>
                </div>

                {/* Performance Metrics */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-indigo-600" />
                    <span>{off.views || 0} Customer Views</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-emerald-500" />
                    <span>{off.claims || 0} Claims</span>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDuplicate(off)}
                      title="Duplicate"
                      className="p-1.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(off)}
                      title="Edit"
                      className="p-1.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(off._id)}
                      title="Delete"
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingOffer ? "Edit Promotional Campaign" : "Launch Promotion"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 font-body">
          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
              Campaign Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Monsoon Festive Flat 20% Discount"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Discount Type
              </label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none"
              >
                <option value="Percentage">Percentage (%)</option>
                <option value="Flat">Flat (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Discount Value
              </label>
              <input
                type="number"
                required
                min="1"
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                placeholder="e.g. 20"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
              Valid Until Date
            </label>
            <input
              type="date"
              required
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
              Terms & Conditions / Description
            </label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Applicable on bill values over ₹2,999."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-medium text-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
              Banner URL
            </label>
            <input
              type="text"
              required
              value={banner}
              onChange={(e) => setBanner(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-950 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md cursor-pointer"
            >
              {editingOffer ? "Save Campaign" : "Launch Campaign"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
