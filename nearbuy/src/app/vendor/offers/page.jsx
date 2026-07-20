"use client";

import React, { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Modal from "@/components/ui/Modal";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
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

const INITIAL_OFFERS = [
  {
    id: "off-1",
    name: "Monsoon Festive Flat 20% Discount",
    code: "MONSOON20",
    discount: "FLAT 20% OFF",
    validUntil: "2026-08-15",
    status: "Active",
    views: 940,
    claims: 180,
    terms: "Valid on all linen shirts and denim purchase above ₹2,999.",
    banner: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "off-2",
    name: "Buy 2 Get 1 Free Graphic Tees",
    code: "B2G1FREE",
    discount: "BUY 2 GET 1 FREE",
    validUntil: "2026-07-31",
    status: "Active",
    views: 1420,
    claims: 270,
    terms: "Applicable on streetwear collection racks.",
    banner: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80",
  },
];

export default function VendorOffers() {
  const [offers, setOffers] = useState(INITIAL_OFFERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);

  // Form State
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [validUntil, setValidUntil] = useState("2026-08-31");
  const [terms, setTerms] = useState("");
  const [banner, setBanner] = useState("");

  const handleOpenAdd = () => {
    setEditingOffer(null);
    setName("");
    setCode("FESTIVE50");
    setDiscount("FLAT 30% OFF");
    setValidUntil("2026-08-31");
    setTerms("Applicable on minimum cart value ₹1,999.");
    setBanner("https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=600&q=80");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (off) => {
    setEditingOffer(off);
    setName(off.name);
    setCode(off.code);
    setDiscount(off.discount);
    setValidUntil(off.validUntil);
    setTerms(off.terms);
    setBanner(off.banner);
    setIsModalOpen(true);
  };

  const handleToggleStatus = (id) => {
    setOffers(
      offers.map((o) => (o.id === id ? { ...o, status: o.status === "Active" ? "Paused" : "Active" } : o))
    );
    toast.success("Campaign status updated!");
  };

  const handleDuplicate = (off) => {
    const dup = {
      ...off,
      id: `off-${Date.now()}`,
      name: `${off.name} (Copy)`,
      code: `${off.code}_2`,
      views: 0,
      claims: 0,
    };
    setOffers([dup, ...offers]);
    toast.success("Offer campaign duplicated!");
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this offer campaign?")) {
      setOffers(offers.filter((o) => o.id !== id));
      toast.success("Offer campaign removed!");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingOffer) {
      setOffers(
        offers.map((o) =>
          o.id === editingOffer.id ? { ...o, name, code, discount, validUntil, terms, banner } : o
        )
      );
      toast.success("Campaign details updated!");
    } else {
      const newOff = {
        id: `off-${Date.now()}`,
        name,
        code,
        discount,
        validUntil,
        status: "Active",
        views: 0,
        claims: 0,
        terms,
        banner,
      };
      setOffers([newOff, ...offers]);
      toast.success("New Promotional Campaign launched!");
    }
    setIsModalOpen(false);
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
      {offers.length === 0 ? (
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
              key={off.id}
              className="bg-white rounded-3xl border border-[#ECECEC] shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
            >
              {/* Campaign Banner Header */}
              <div className="h-44 w-full relative overflow-hidden bg-slate-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={off.banner}
                  alt={off.name}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="bg-linear-to-r from-teal-500 to-indigo-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md">
                    {off.discount}
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
                    CODE: {off.code}
                  </span>
                  <span className="text-[10px] font-bold text-slate-200 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-teal-400" /> Valid till {off.validUntil}
                  </span>
                </div>
              </div>

              {/* Campaign Body */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-heading font-bold text-slate-900 leading-tight">
                    {off.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1 line-clamp-2 leading-relaxed">
                    {off.terms}
                  </p>
                </div>

                {/* Performance Metrics */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-indigo-600" />
                    <span>{off.views} Customer Views</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-emerald-500" />
                    <span>{off.claims} Claims</span>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleToggleStatus(off.id)}
                    className="text-xs font-bold text-slate-600 hover:text-indigo-600 flex items-center gap-1.5 cursor-pointer"
                  >
                    {off.status === "Active" ? (
                      <>
                        <Pause className="w-3.5 h-3.5 text-amber-500" /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 text-emerald-500" /> Resume
                      </>
                    )}
                  </button>

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
                      onClick={() => handleDelete(off.id)}
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Monsoon Festive Flat 20% Discount"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Coupon Code
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="MONSOON20"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Discount Tag
              </label>
              <input
                type="text"
                required
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder="FLAT 20% OFF"
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
              Terms & Conditions
            </label>
            <textarea
              rows={2}
              required
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              placeholder="e.g. Applicable on bill values over ₹2,999."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-medium text-slate-900 focus:outline-none"
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
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md"
            >
              {editingOffer ? "Save Campaign" : "Launch Campaign"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
