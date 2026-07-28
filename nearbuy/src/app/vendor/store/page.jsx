"use client";

import React, { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import useStoreStore from "@/store/storeStore";
import {
  Store,
  MapPin,
  Phone,
  MessageSquare,
  Mail,
  Clock,
  Calendar,
  Globe,
  Instagram,
  Facebook,
  Upload,
  Check,
  Sparkles,
  ShieldCheck,
  Eye,
} from "lucide-react";

export default function VendorStore() {
  const { user } = useAuth();
  const { stores, fetchStores, createStore, updateStore } = useStoreStore();

  const [loading, setLoading] = useState(false);
  const [storeId, setStoreId] = useState(null);
  const [facilities, setFacilities] = useState([
    "Parking",
    "Trial Room",
    "Air Conditioned",
    "Women's Wear",
    "Ethnic Wear",
    "Western Wear",
  ]);

  const [formData, setFormData] = useState({
    businessName: "Urban Threads Boutique",
    description: "Premium handcrafted linen, silk dresses, and designer festive ethnic wear for men and women in Bandra West.",
    address: "Shop 14, Hill Road, Opposite St. Andrew's Church, Bandra West, Mumbai 400050",
    city: "Mumbai",
    pincode: "400050",
    phone: "+91 98200 12345",
    whatsapp: "+91 98200 12345",
    email: "contact@urbanthreads.com",
    workingHours: "10:30 AM - 09:30 PM",
    businessDays: "Monday - Sunday",
    instagram: "@urbanthreadsmumbai",
    facebook: "facebook.com/urbanthreadsmumbai",
    website: "https://urbanthreads.in",
    status: "Active",
    logo: "",
    coverImage: "",
  });

  useEffect(() => {
    if (user?.vendorId) {
      fetchStores({ vendor: user.vendorId });
    }
  }, [user, fetchStores]);

  useEffect(() => {
    if (stores && stores.length > 0) {
      const store = stores[0];
      if (store._id !== storeId) {
        Promise.resolve().then(() => {
          setStoreId(store._id);
          setFormData({
            businessName: store.storeName || "",
            description: store.description || "",
            address: store.address || "",
            city: store.city || "Mumbai",
            pincode: store.pincode || "",
            phone: store.phone || "",
            whatsapp: store.whatsapp || "",
            email: store.email || "",
            workingHours: `${store.openingTime || "10:00 AM"} - ${store.closingTime || "09:00 PM"}`,
            businessDays: store.workingDays?.join(" - ") || "Monday - Sunday",
            instagram: store.instagram || "",
            facebook: store.facebook || "",
            website: store.website || "",
            status: store.status || "Active",
            logo: store.vendorId?.logo || "",
            coverImage: store.vendorId?.coverImage || "",
          });
        });
      }
    }
  }, [stores, storeId]);

  const availableFacilities = [
    "Parking",
    "Trial Room",
    "Air Conditioned",
    "Wheelchair Access",
    "Kids Section",
    "Women's Wear",
    "Men's Wear",
    "Ethnic Wear",
    "Western Wear",
  ];

  const toggleFacility = (item) => {
    if (facilities.includes(item)) {
      setFacilities(facilities.filter((f) => f !== item));
    } else {
      setFacilities([...facilities, item]);
    }
  };

  const handleSave = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoading(true);

    const [openingTime, closingTime] = formData.workingHours.split(" - ");
    const workingDays = formData.businessDays.split(" - ");

    const payload = {
      storeName: formData.businessName,
      description: formData.description,
      address: formData.address,
      city: formData.city || "Mumbai",
      pincode: formData.pincode,
      phone: formData.phone,
      whatsapp: formData.whatsapp,
      email: formData.email,
      openingTime: openingTime || "10:00 AM",
      closingTime: closingTime || "09:00 PM",
      workingDays: workingDays.length > 0 ? workingDays : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      instagram: formData.instagram,
      facebook: formData.facebook,
      website: formData.website,
      status: formData.status,
      logo: formData.logo,
      coverImage: formData.coverImage,
    };

    try {
      if (storeId) {
        await updateStore(storeId, payload);
      } else {
        await createStore(payload);
      }
      toast.success("Store details updated successfully!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-body pb-12">
      <DashboardHeader
        title="My Store Profile & Physical Location"
        description="Configure your physical store storefront, Google Maps location, opening hours, facilities, and SEO preview."
        badge="Hyperlocal Store"
      >
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center gap-2"
        >
          {loading ? "Saving..." : "Save Store Changes"}
        </button>
      </DashboardHeader>

      {/* Cover Banner & Logo Section */}
      <div className="bg-white rounded-3xl border border-[#ECECEC] shadow-xs overflow-hidden">
        {/* Cover Photo */}
        <div className="h-48 md:h-64 w-full bg-slate-800 relative group overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={formData.coverImage || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80"}
            alt="Store Cover"
            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />
          <button
            type="button"
            onClick={() => {
              const url = prompt("Enter Cover Image URL:", formData.coverImage);
              if (url !== null) setFormData({ ...formData, coverImage: url });
            }}
            className="absolute top-4 right-4 bg-slate-950/60 hover:bg-slate-950/80 rounded-2xl px-4 py-2 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-4 h-4" /> Edit Cover Image
          </button>
        </div>

        {/* Logo & Basic Header */}
        <div className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 -mt-16 relative z-10">
          <div className="flex items-end gap-5">
            <div className="h-24 w-24 md:h-28 md:w-28 rounded-3xl bg-white p-1.5 shadow-xl border border-slate-200 shrink-0 relative group overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={formData.logo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"}
                alt="Store Logo"
                className="w-full h-full object-cover rounded-2xl"
              />
              <button
                type="button"
                onClick={() => {
                  const url = prompt("Enter Logo Image URL:", formData.logo);
                  if (url !== null) setFormData({ ...formData, logo: url });
                }}
                className="absolute inset-0 bg-slate-950/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold gap-1 cursor-pointer"
              >
                <Upload className="w-4 h-4" /> Edit
              </button>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-heading font-black text-slate-900">{formData.businessName}</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200">
                  Verified Store
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-600" /> {formData.city}, India
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-150">
            <span className="text-xs font-bold text-slate-600 px-2">Store Visibility:</span>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, status: formData.status === "Active" ? "Inactive" : "Active" })}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                formData.status === "Active"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-amber-500 text-white shadow-sm"
              }`}
            >
              {formData.status === "Active" ? "🟢 Live on Nearby" : "⏸️ Temporarily Paused"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Details Form Grid */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Business Information Card */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#ECECEC] shadow-xs space-y-5">
            <h3 className="text-base font-heading font-bold text-slate-900 flex items-center gap-2">
              <Store className="w-5 h-5 text-indigo-600" /> General Store Info
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  Business / Store Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  Store Description & Highlights
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-medium text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    WhatsApp Enquiry Number
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    Direct Store Contact Phone
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Location & Operating Hours */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#ECECEC] shadow-xs space-y-5">
            <h3 className="text-base font-heading font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-teal-600" /> Physical Location & Hours
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Store Address (For Customer Directions)
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    City (Indexed for local search)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    Pincode
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    Working Hours
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.workingHours}
                    onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                    placeholder="e.g. 10:30 AM - 09:30 PM"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    Operating Days
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.businessDays}
                    onChange={(e) => setFormData({ ...formData, businessDays: e.target.value })}
                    placeholder="e.g. Monday - Sunday"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Store Facilities Tags */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#ECECEC] shadow-xs space-y-4">
            <h3 className="text-base font-heading font-bold text-slate-900">Facilities & Clothing Tags</h3>
            <p className="text-xs text-slate-400 font-medium">Select features offered at your physical shop</p>

            <div className="flex flex-wrap gap-2.5 pt-2">
              {availableFacilities.map((fac) => {
                const isSelected = facilities.includes(fac);
                return (
                  <button
                    type="button"
                    key={fac}
                    onClick={() => toggleFacility(fac)}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                      isSelected
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    {fac}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Cards: Live SEO Preview & Socials */}
        <div className="space-y-6">
          {/* Google / Hyperlocal Search Preview */}
          <div className="bg-white p-6 rounded-3xl border border-[#ECECEC] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-indigo-600" /> Search Card Preview
              </h3>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Google Live
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-150 space-y-2">
              <span className="text-[10px] font-mono text-emerald-700 truncate block">
                https://nearbuy.clothing/stores/{formData.businessName.toLowerCase().replace(/\s+/g, "-")}
              </span>
              <h4 className="text-sm font-heading font-bold text-indigo-600 hover:underline leading-tight">
                {formData.businessName} - {formData.city} Clothing Store
              </h4>
              <p className="text-[11px] text-slate-500 font-medium line-clamp-2 leading-relaxed">
                {formData.description}
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white p-6 rounded-3xl border border-[#ECECEC] shadow-xs space-y-4">
            <h3 className="text-base font-heading font-bold text-slate-900">Social Handles</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                  Instagram Handle
                </label>
                <input
                  type="text"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                  Website URL
                </label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
