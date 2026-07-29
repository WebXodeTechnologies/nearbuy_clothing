"use client";

import React, { useState, useEffect, useRef } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Modal from "@/components/ui/Modal";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import useOfferStore from "@/store/offerStore";
import {
  Tag,
  Plus,
  Calendar,
  Eye,
  Copy,
  Edit,
  Trash2,
  Camera,
  RefreshCw,
  Zap,
  Ticket,
} from "lucide-react";
import Image from "next/image";

export default function VendorOffers() {
  const { user } = useAuth();
  const { offers, fetchOffers, createOffer, updateOffer, deleteOffer, loading } =
    useOfferStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // File Upload Ref
  const bannerInputRef = useRef(null);

  // Form State
  const [title, setTitle] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [discountType, setDiscountType] = useState("Percentage");
  const [discountValue, setDiscountValue] = useState(20);
  const [minPurchase, setMinPurchase] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [description, setDescription] = useState("");
  const [banner, setBanner] = useState("");
  const [status, setStatus] = useState("Active");

  useEffect(() => {
    if (user?.vendorId) {
      fetchOffers(user.vendorId);
    }
  }, [user, fetchOffers]);

  const resetForm = () => {
    setTitle("");
    setCouponCode("");
    setDiscountType("Percentage");
    setDiscountValue(20);
    setMinPurchase("");

    // Default valid until date: 30 days from now
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 30);
    setValidUntil(defaultDate.toISOString().split("T")[0]);

    setDescription("Applicable on minimum purchase at our Namakkal shop.");
    setBanner("");
    setStatus("Active");
    setEditingOffer(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (off) => {
    setEditingOffer(off);
    setTitle(off.title || "");
    setCouponCode(off.couponCode || "");
    setDiscountType(off.discountType || "Percentage");
    setDiscountValue(off.discountValue || 20);
    setMinPurchase(off.minPurchaseAmount !== undefined ? String(off.minPurchaseAmount) : "");
    setValidUntil(
      off.endDate
        ? new Date(off.endDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0]
    );
    setDescription(off.description || "");
    setBanner(off.banner || "");
    setStatus(off.status || "Active");
    setIsModalOpen(true);
  };

  const handleBannerUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (JPG, PNG, WEBP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Banner photo size should be under 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setBanner(reader.result);
      toast.success("Offer banner loaded cleanly!");
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = (id) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3 font-body">
          <p className="text-xs font-bold text-slate-800">
            Are you sure you want to delete this offer campaign?
          </p>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={async () => {
                toast.dismiss(t.id);
                const toastId = toast.loading("Deleting offer campaign...");
                try {
                  await deleteOffer(id);
                  toast.success("Offer deleted successfully!", { id: toastId });
                } catch (err) {
                  toast.error(err?.message || "Failed to delete offer", { id: toastId });
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 transition-colors cursor-pointer shadow-xs"
            >
              Delete Offer
            </button>
          </div>
        </div>
      ),
      {
        duration: 5000,
        position: "top-center",
        style: {
          borderRadius: "20px",
          background: "#ffffff",
          color: "#0f172a",
          border: "1px solid #e2e8f0",
          padding: "16px",
          boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
        },
      }
    );
  };

  const handleToggleStatus = async (off) => {
    const newStatus = off.status === "Active" ? "Paused" : "Active";
    const toastId = toast.loading("Updating offer status...");
    try {
      await updateOffer(off._id, { status: newStatus });
      toast.success(`Campaign is now ${newStatus}!`, { id: toastId });
    } catch (err) {
      toast.error(err?.message || "Failed to update offer status", { id: toastId });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a campaign title");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading(
      editingOffer ? "Saving campaign updates..." : "Launching new promotion..."
    );

    const generatedCode =
      couponCode.trim().toUpperCase() ||
      title.substring(0, 5).replace(/\s+/g, "").toUpperCase() + discountValue;

    const payload = {
      title,
      couponCode: generatedCode,
      discountType,
      discountValue: Number(discountValue),
      minPurchaseAmount: minPurchase ? Number(minPurchase) : 0,
      endDate: new Date(validUntil).toISOString(),
      description,
      banner,
      status,
    };

    try {
      if (editingOffer) {
        await updateOffer(editingOffer._id, payload);
        toast.success("Campaign details updated!", { id: toastId });
      } else {
        await createOffer(payload);
        toast.success("New promotion launched successfully!", { id: toastId });
      }
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      toast.error(err?.message || "Failed to save promotion", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const displayDiscount = (off) => {
    if (off.discountType === "BOGO") return "BUY 1 GET 1 FREE";
    return off.discountType === "Percentage"
      ? `FLAT ${off.discountValue}% OFF`
      : `FLAT ₹${off.discountValue} OFF`;
  };

  return (
    <div className="space-y-8 font-body pb-12">
      {/* Hidden Banner Upload Input */}
      <input
        type="file"
        ref={bannerInputRef}
        onChange={handleBannerUpload}
        accept="image/*"
        className="hidden"
      />

      <DashboardHeader
        title="Promotions & Walk-in Campaigns"
        description="Launch coupon codes, flat discounts, or festive offers to drive nearby shoppers directly into your shop."
        badge="Marketing Cards"
      >
        <button
          onClick={handleOpenAdd}
          className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Promotion</span>
        </button>
      </DashboardHeader>

      {/* Offer Cards Grid */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      ) : offers.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-200/80 rounded-3xl max-w-lg mx-auto shadow-xs p-8">
          <div className="h-16 w-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-indigo-100">
            <Tag className="w-8 h-8" />
          </div>
          <h3 className="font-heading font-black text-slate-900 text-lg">
            No Active Promotions
          </h3>
          <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed font-medium">
            Creating promotional coupons is the fastest way to increase customer walk-ins to your shop this week.
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-6 px-6 py-3 rounded-2xl bg-indigo-600 text-white text-xs font-black shadow-md hover:bg-indigo-500 transition-colors cursor-pointer"
          >
            Launch First Campaign
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offers.map((off) => {
            const bannerImg =
              off.banner ||
              "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&q=80";

            return (
              <div
                key={off._id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                {/* Campaign Banner Header */}
                <div className="h-48 w-full relative overflow-hidden bg-slate-900">
                  <Image
                    src={bannerImg}
                    alt={off.title}
                    fill
                    unoptimized={bannerImg.startsWith("data:")}
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                    <span className="bg-gradient-to-r from-indigo-600 to-teal-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md">
                      {displayDiscount(off)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(off)}
                      className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-xs cursor-pointer ${off.status === "Active"
                          ? "bg-emerald-500 text-white"
                          : "bg-amber-500 text-white"
                        }`}
                    >
                      {off.status === "Active" ? "🟢 Active" : "⏸️ Paused"}
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(off)}
                      className="p-2 bg-slate-950/70 hover:bg-indigo-600 text-white rounded-xl transition-colors cursor-pointer backdrop-blur-md"
                      title="Edit Campaign"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(off._id)}
                      className="p-2 bg-slate-950/70 hover:bg-rose-600 text-white rounded-xl transition-colors cursor-pointer backdrop-blur-md"
                      title="Delete Campaign"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Coupon Code Strip */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white z-10">
                    <span className="font-mono text-xs font-extrabold bg-white/20 backdrop-blur-md px-3 py-1 rounded-xl border border-white/30 flex items-center gap-1.5">
                      <Ticket className="w-3.5 h-3.5 text-amber-300" />
                      CODE: {off.couponCode || "SPECIAL"}
                    </span>
                    <span className="text-[11px] font-bold text-slate-200 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-teal-400" />
                      Valid till{" "}
                      {off.endDate ? new Date(off.endDate).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                </div>

                {/* Campaign Body */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-heading font-black text-slate-900 leading-tight">
                      {off.title}
                    </h3>
                    {off.description && (
                      <p className="text-xs text-slate-500 font-medium mt-1.5 line-clamp-2 leading-relaxed">
                        {off.description}
                      </p>
                    )}
                  </div>

                  {/* Metrics Bar */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-indigo-600" />
                      <span>{off.views || 0} Customer Views</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-emerald-500" />
                      <span>{off.claims || 0} Coupon Claims</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Promotion Launch Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingOffer ? "Edit Promotional Campaign" : "Launch New Promotion"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 font-body pt-2">
          {/* Banner Photo Upload */}
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
              Campaign Banner Photo (Optional)
            </label>
            <div
              onClick={() => bannerInputRef.current?.click()}
              className="h-36 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 transition-all flex flex-col items-center justify-center cursor-pointer relative overflow-hidden group"
            >
              {banner ? (
                <>
                  <Image
                    src={banner}
                    alt="Banner Preview"
                    fill
                    unoptimized={banner.startsWith("data:")}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                    <Camera className="w-4 h-4" /> Change Banner
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-slate-400 p-4 text-center">
                  <div className="p-2.5 rounded-full bg-indigo-50 text-indigo-600">
                    <Camera className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">
                    Click to choose banner image from Mobile/PC
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Campaign Title */}
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
              Campaign Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Diwali Festive Flat 20% Off"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
            />
          </div>

          {/* Coupon Code & Discount Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Coupon Code
              </label>
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="e.g. DIWALI20"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-mono font-black text-indigo-600 uppercase focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Discount Type
              </label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600 cursor-pointer"
              >
                <option value="Percentage">Percentage (%)</option>
                <option value="Flat">Flat (₹)</option>
                <option value="BOGO">Buy 1 Get 1 Free</option>
              </select>
            </div>
          </div>

          {/* Discount Value & Min Purchase */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Discount Value {discountType === "Percentage" ? "(%)" : "(₹)"}
              </label>
              <input
                type="number"
                required
                min="1"
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                placeholder="e.g. 20"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Min Bill Value (₹) (Optional)
              </label>
              <input
                type="number"
                value={minPurchase}
                onChange={(e) => setMinPurchase(e.target.value)}
                placeholder="e.g. 1999"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          {/* Valid Until Date */}
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Valid Until Date</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    const d = new Date();
                    d.setDate(d.getDate() + 7);
                    setValidUntil(d.toISOString().split("T")[0]);
                  }}
                  className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg hover:bg-indigo-100 cursor-pointer"
                >
                  +7 Days
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const d = new Date();
                    d.setDate(d.getDate() + 30);
                    setValidUntil(d.toISOString().split("T")[0]);
                  }}
                  className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg hover:bg-slate-200 cursor-pointer"
                >
                  +30 Days
                </button>
              </div>
            </label>
            <input
              type="date"
              required
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600 cursor-pointer"
            />
          </div>

          {/* Terms & Description */}
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
              Terms / Offer Description
            </label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Applicable on silk sarees & ethnic wear at Salem Road shop."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
              className="px-5 py-2.5 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-md cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : editingOffer ? (
                "Save Campaign"
              ) : (
                "Launch Campaign"
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}