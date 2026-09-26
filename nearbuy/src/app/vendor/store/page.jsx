"use client";

import React, { useState, useEffect, useRef } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import useStoreStore from "@/store/storeStore";
import { useUploadThing } from "@/utils/uploadthing";
import {
  Store,
  MapPin,
  Check,
  Eye,
  RefreshCw,
  Save,
  Camera,
  Clock,
  Calendar,
  Compass,
  Globe,
  ExternalLink,
  Tag,
} from "lucide-react";
import Image from "next/image";
import ImageCropModal from "@/components/modals/ImageCropModal";

const ALL_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const AVAILABLE_FACILITIES = [
  "Parking",
  "Trial Room",
  "Air Conditioned",
  "Wheelchair Access",
  "Card Payment Accepted",
  "UPI Accepted",
  "Custom Alterations",
];

export default function VendorStore() {
  const { user } = useAuth();
  const { updateStore } = useStoreStore();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [storeId, setStoreId] = useState(null);

  // Master Categories State
  const [availableCategories, setAvailableCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Image Cropper Modal State
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState(null);

  // Hidden File Input Ref for Logo
  const logoInputRef = useRef(null);

  // Operating Days State
  const [selectedDays, setSelectedDays] = useState(ALL_DAYS);

  // Store Facilities
  const [facilities, setFacilities] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    businessName: "",
    description: "",
    address: "",
    area: "Salem Road",
    city: "Namakkal",
    state: "Tamil Nadu",
    pincode: "",
    googleMapUrl: "",
    phone: "",
    whatsapp: "",
    email: "",
    openingTime: "09:30",
    closingTime: "21:00",
    instagram: "",
    facebook: "",
    website: "",
    status: "Active",
    logo: "",
  });

  // UploadThing helper for Logo Upload
  const { startUpload: startLogoUpload } = useUploadThing(
    "vendorAssetUploader",
    {
      headers: {
        "x-user-email": user?.email || "",
      },
      onClientUploadComplete: (res) => {
        setIsUploadingLogo(false);
        if (res && res[0]) {
          const uploadedUrl = res[0].url || res[0].fileUrl;
          setFormData((prev) => ({ ...prev, logo: uploadedUrl }));
          toast.success("Store logo uploaded to cloud storage!");
        }
      },
      onUploadError: (err) => {
        setIsUploadingLogo(false);
        toast.error(err?.message || "Storage limit reached or upload failed.");
      },
    },
  );

  const parseTo24Hr = (timeStr) => {
    if (!timeStr) return "09:30";
    if (timeStr.includes(":") && !timeStr.toLowerCase().includes("m")) {
      return timeStr;
    }
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return "09:30";
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const period = match[3].toUpperCase();
    if (period === "PM" && hours < 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    return `${String(hours).padStart(2, "0")}:${minutes}`;
  };

  const format12Hour = (time24) => {
    if (!time24) return "";
    const [h, m] = time24.split(":");
    let hours = parseInt(h, 10);
    const suffix = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${String(hours).padStart(2, "0")}:${m} ${suffix}`;
  };

  useEffect(() => {
    async function loadInitialData() {
      setLoading(true);
      try {
        // 1. Fetch categories
        const catRes = await fetch("/api/categories");
        const catJson = await catRes.json();
        const categoriesList = catJson?.data || catJson?.categories || [];
        setAvailableCategories(categoriesList);

        // 2. Fetch the logged-in vendor's STORE profile (not just vendor profile)
        // Check /api/stores?all=true or an endpoint that returns the store document
        const res = await fetch("/api/vendors/me");
        const json = await res.json();

        if (res.ok && json.data) {
          const vendorData = json.data;

          // 🔍 CRITICAL FIX: Ensure we have the actual Store ID
          // If vendorData.storeId is an object or ID, fetch the store, or query /api/stores?vendor=...
          let storeData = vendorData;
          let actualStoreId =
            vendorData.storeId?._id || vendorData.storeId || vendorData._id;

          // If your backend separates Vendor and Store, fetch the actual store document:
          try {
            const storeRes = await fetch(
              `/api/stores?vendor=${vendorData._id}`,
            );
            const storeJson = await storeRes.json();
            const foundStore =
              storeJson?.data?.stores?.[0] || storeJson?.stores?.[0];
            if (foundStore) {
              storeData = foundStore;
              actualStoreId = foundStore._id;
            }
          } catch (e) {
            console.log("Fallback to vendor document", e);
          }

          setStoreId(actualStoreId);

          setFormData({
            businessName: storeData.storeName || storeData.businessName || "",
            description:
              storeData.description || storeData.tagline || storeData.bio || "",
            address:
              storeData.address ||
              (typeof storeData.location === "object"
                ? storeData.location?.street
                : "") ||
              "",
            area: storeData.area || "Salem Road",
            city: storeData.city || "Namakkal",
            state: storeData.state || "Tamil Nadu",
            pincode: storeData.pincode || "",
            googleMapUrl:
              storeData.googleMapUrl || storeData.location?.googleMapUrl || "",
            phone: storeData.phone || storeData.businessPhone || "",
            whatsapp: storeData.whatsapp || storeData.whatsappNumber || "",
            email: storeData.email || "",
            openingTime: parseTo24Hr(storeData.openingTime || "09:30 AM"),
            closingTime: parseTo24Hr(storeData.closingTime || "09:00 PM"),
            instagram: storeData.instagram || "",
            facebook: storeData.facebook || "",
            website: storeData.website || "",
            status:
              storeData.isActive === false || storeData.status === "Inactive"
                ? "Inactive"
                : "Active",
            logo: storeData.logo || "",
          });

          // 👈 RETRIEVE AND POPULATE EXISTING CATEGORIES ON REFRESH
          if (
            Array.isArray(storeData.categoryIds) &&
            storeData.categoryIds.length > 0
          ) {
            const preselected = storeData.categoryIds
              .map((c) => (typeof c === "object" && c !== null ? c._id : c))
              .filter(Boolean)
              .map(String);
            setSelectedCategories(preselected);
          } else {
            setSelectedCategories([]);
          }

          if (storeData.workingDays && Array.isArray(storeData.workingDays)) {
            setSelectedDays(storeData.workingDays);
          }

          if (storeData.facilities && Array.isArray(storeData.facilities)) {
            setFacilities(storeData.facilities);
          }
        }
      } catch (err) {
        console.error("Error loading initial store data:", err);
        toast.error("Failed to load store profile or categories.");
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, []);

  const toggleCategory = (catId) => {
    const idStr = String(catId);
    setSelectedCategories((prev) =>
      prev.includes(idStr)
        ? prev.filter((id) => id !== idStr)
        : [...prev, idStr],
    );
  };

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      if (selectedDays.length === 1) {
        toast.error("At least one operating day must be selected.");
        return;
      }
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const toggleFacility = (item) => {
    if (facilities.includes(item)) {
      setFacilities(facilities.filter((f) => f !== item));
    } else {
      setFacilities([...facilities, item]);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!user?.email) {
      toast.error("User session email missing. Please re-login.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setRawImageSrc(reader.result);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleCropComplete = async (croppedFile) => {
    setCropModalOpen(false);
    setIsUploadingLogo(true);
    const toastId = toast.loading("Uploading cropped store logo...");
    try {
      const res = await startLogoUpload([croppedFile]);
      toast.dismiss(toastId);

      if (res && res[0]) {
        const uploadedUrl = res[0].url || res[0].fileUrl;
        setFormData((prev) => ({ ...prev, logo: uploadedUrl }));

        const payload = {
          storeName: formData.businessName,
          logo: uploadedUrl,
          coverImage: "",
          categoryIds: selectedCategories,
        };
        await updateStore(storeId, payload);
        toast.success("Store logo updated successfully!");
      }
    } catch (err) {
      toast.dismiss(toastId);
      setIsUploadingLogo(false);
      toast.error(err.message || "Failed to upload logo");
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleSave = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (selectedCategories.length === 0) {
      toast.error("Please select at least one boutique category!");
      return;
    }

    if (!storeId) {
      toast.error("Store ID not found. Please refresh and try again.");
      return;
    }

    setSaving(true);
    const toastId = toast.loading("Saving store details and categories...");

    const payload = {
      storeName: formData.businessName,
      tagline: formData.description,
      description: formData.description || "",
      address: formData.address,
      area: formData.area || "Salem Road",
      city: formData.city || "Namakkal",
      state: formData.state || "Tamil Nadu",
      pincode: formData.pincode || "",
      googleMapUrl: formData.googleMapUrl || "",
      phone: formData.phone || "",
      whatsapp: formData.whatsapp || "",
      email: formData.email || "",
      openingTime: format12Hour(formData.openingTime),
      closingTime: format12Hour(formData.closingTime),
      workingDays: selectedDays,
      facilities: facilities || [],
      categoryIds: selectedCategories, // 👈 Explicit array of category IDs
      status: formData.status,
      isActive: formData.status === "Active",
      logo: formData.logo || "",
    };

    try {
      // Direct API update to guarantee the payload reaches the database
      const res = await fetch(`/api/stores/${storeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to update store in database");
      }

      toast.success("Store & categories updated and live!", { id: toastId });
    } catch (err) {
      console.error("Save error:", err);
      toast.error(err?.message || "Failed to save store details", {
        id: toastId,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
        <span className="ml-3 text-sm font-semibold text-slate-600">
          Loading store profile & categories...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-body pb-12">
      <input
        type="file"
        ref={logoInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      <DashboardHeader
        title="My Store Profile & Physical Location"
        description="Configure your storefront name, clothing categories, physical address, clock hours, and operating days."
        badge="Namakkal Storefront"
      >
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || isUploadingLogo}
          className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{saving ? "Saving..." : "Save Store Changes"}</span>
        </button>
      </DashboardHeader>

      {/* Header Summary Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="h-24 w-24 md:h-28 md:w-28 rounded-3xl bg-slate-100 p-1.5 shadow-md border border-slate-200 shrink-0 relative group overflow-hidden">
            {formData.logo ? (
              <Image
                src={formData.logo}
                alt="Store Logo"
                fill
                sizes="112px"
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <div className="w-full h-full bg-slate-900 text-white font-black text-2xl flex items-center justify-center rounded-2xl">
                {formData.businessName ? formData.businessName.charAt(0) : "S"}
              </div>
            )}
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              disabled={isUploadingLogo}
              className="absolute inset-0 bg-slate-950/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold gap-1 cursor-pointer flex-col"
            >
              {isUploadingLogo ? (
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-300" />
              ) : (
                <>
                  <Camera className="w-4 h-4 text-indigo-300" />
                  <span>Upload Logo</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl md:text-2xl font-heading font-black text-slate-900">
                {formData.businessName || "Store Name"}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200">
                Verified Store
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-600" />
              {formData.address
                ? `${formData.address}, ${formData.city}`
                : formData.area && formData.city
                  ? `${formData.area}, ${formData.city}`
                  : "Address not updated yet"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200">
          <span className="text-xs font-bold text-slate-600 px-2">
            Store Status:
          </span>
          <button
            type="button"
            onClick={() =>
              setFormData({
                ...formData,
                status: formData.status === "Active" ? "Inactive" : "Active",
              })
            }
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              formData.status === "Active"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-amber-500 text-white shadow-xs"
            }`}
          >
            {formData.status === "Active" ? "Live on Streetunics" : "Paused"}
          </button>
        </div>
      </div>

      {/* Main Details Form */}
      <form
        onSubmit={handleSave}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-2 space-y-6">
          {/* 1. General Info Card */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
            <h3 className="text-base font-heading font-extrabold text-slate-900 flex items-center gap-2">
              <Store className="w-5 h-5 text-indigo-600" /> Basic Store
              Information
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                  Business / Store Name
                </label>
                <input
                  type="text"
                  name="businessName"
                  required
                  placeholder="e.g. Kavin Ethnic Boutiques"
                  value={formData.businessName}
                  onChange={(e) =>
                    setFormData({ ...formData, businessName: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                  Store Tagline / Description
                </label>
                <textarea
                  rows={3}
                  name="description"
                  required
                  placeholder="Describe your store and products..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-medium text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    WhatsApp Enquiry Number
                  </label>
                  <input
                    type="text"
                    name="whatsapp"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.whatsapp}
                    onChange={(e) =>
                      setFormData({ ...formData, whatsapp: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    Direct Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. 🏷️ STORE CATEGORIES SECTION */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-heading font-extrabold text-slate-900 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-indigo-600" /> Boutique Fashion
                  Categories *
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Select which clothing categories are available at your
                  physical shop.
                </p>
              </div>
              <span className="text-[11px] font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
                {selectedCategories.length} Selected
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              {availableCategories.map((cat) => {
                const isSelected = selectedCategories.includes(String(cat._id));
                return (
                  <button
                    type="button"
                    key={cat._id}
                    onClick={() => toggleCategory(cat._id)}
                    className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? "bg-indigo-50 border-indigo-300 text-indigo-700 shadow-2xs"
                        : "bg-slate-50/70 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 ml-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Physical Address & Location */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
            <h3 className="text-base font-heading font-extrabold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-teal-600" /> Physical Store
              Address & GPS
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                  Street / Shop Address Line
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  placeholder="e.g. Shop No. 12, Salem Main Road, Opposite Bus Stand"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    Area / Locality
                  </label>
                  <select
                    name="area"
                    value={formData.area}
                    onChange={(e) =>
                      setFormData({ ...formData, area: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600 cursor-pointer"
                  >
                    <option value="Salem Road">Salem Road</option>
                    <option value="Paramathi Road">Paramathi Road</option>
                    <option value="Mohanur Road">Mohanur Road</option>
                    <option value="Tiruchengode Road">Tiruchengode Road</option>
                    <option value="Park Road">Park Road</option>
                    <option value="Bus Stand Main Market">
                      Bus Stand Main Market
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    placeholder="637001"
                    value={formData.pincode}
                    onChange={(e) =>
                      setFormData({ ...formData, pincode: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-indigo-600" /> Google
                    Maps Link
                  </span>
                  {formData.googleMapUrl && (
                    <a
                      href={formData.googleMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-indigo-600 font-bold hover:underline flex items-center gap-1"
                    >
                      Test Map Link <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </label>
                <input
                  type="url"
                  name="googleMapUrl"
                  placeholder="https://maps.google.com/..."
                  value={formData.googleMapUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, googleMapUrl: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* 4. Working Hours & Days */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <h3 className="text-base font-heading font-extrabold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" /> Working Hours &
              Operating Days
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>Opening Time</span>
                  <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                    {format12Hour(formData.openingTime)}
                  </span>
                </label>
                <input
                  type="time"
                  name="openingTime"
                  required
                  value={formData.openingTime}
                  onChange={(e) =>
                    setFormData({ ...formData, openingTime: e.target.value })
                  }
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-indigo-600 cursor-pointer"
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>Closing Time</span>
                  <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                    {format12Hour(formData.closingTime)}
                  </span>
                </label>
                <input
                  type="time"
                  name="closingTime"
                  required
                  value={formData.closingTime}
                  onChange={(e) =>
                    setFormData({ ...formData, closingTime: e.target.value })
                  }
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-indigo-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-600" /> Operating
                  Days
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedDays(ALL_DAYS)}
                    className="text-[10px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    All 7 Days
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedDays([
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                      ])
                    }
                    className="text-[10px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    Mon - Sat
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {ALL_DAYS.map((day) => {
                  const isSelected = selectedDays.includes(day);
                  return (
                    <button
                      type="button"
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`py-3 px-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1 border ${
                        isSelected
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                          : "bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <span className="text-[10px] font-black uppercase tracking-wider opacity-80">
                        {day.slice(0, 3)}
                      </span>
                      {isSelected ? (
                        <Check className="w-3.5 h-3.5 text-white" />
                      ) : (
                        <span className="text-[10px] opacity-50">Off</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 5. Physical Store Facilities */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-heading font-extrabold text-slate-900">
              Shop Amenities & Features
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Select conveniences available to in-person shoppers.
            </p>

            <div className="flex flex-wrap gap-2.5 pt-2">
              {AVAILABLE_FACILITIES.map((fac) => {
                const isSelected = facilities.includes(fac);
                return (
                  <button
                    type="button"
                    key={fac}
                    onClick={() => toggleFacility(fac)}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                      isSelected
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    <span>{fac}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-indigo-600" /> Search Card Preview
              </h3>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Streetunics Live
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="text-[10px] font-mono text-emerald-700 truncate block">
                https://streetunics.clothing/stores/
                {formData.businessName
                  ? formData.businessName.toLowerCase().replace(/\s+/g, "-")
                  : "your-store-slug"}
              </span>
              <h4 className="text-sm font-heading font-bold text-indigo-600 leading-tight">
                {formData.businessName || "Store Name"} - {formData.city}
              </h4>
              <p className="text-[11px] text-slate-500 font-medium line-clamp-2 leading-relaxed">
                {formData.description ||
                  "Your store description preview will show here..."}
              </p>
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-bold text-slate-600">
                <span className="flex items-center gap-1 text-emerald-700">
                  <Clock className="w-3 h-3 text-emerald-600" />
                  {format12Hour(formData.openingTime)} -{" "}
                  {format12Hour(formData.closingTime)}
                </span>
                <span className="text-indigo-600">
                  {selectedDays.length === 7
                    ? "Open Daily"
                    : `${selectedDays.length} Days / Wk`}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-heading font-extrabold text-slate-900">
              Social & Web Links
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                  Instagram Handle
                </label>
                <input
                  type="text"
                  name="instagram"
                  placeholder="@your_handle"
                  value={formData.instagram}
                  onChange={(e) =>
                    setFormData({ ...formData, instagram: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Globe className="w-3 h-3 text-indigo-600" /> Website URL
                </label>
                <input
                  type="text"
                  name="website"
                  placeholder="https://yourwebsite.com"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Store Logo Crop Modal */}
      <ImageCropModal
        isOpen={cropModalOpen}
        onClose={() => setCropModalOpen(false)}
        imageSrc={rawImageSrc}
        onCropComplete={handleCropComplete}
        isUploading={isUploadingLogo}
        title="Crop & Edit Store Logo (1:1 Ratio)"
        defaultAspect="1:1"
        defaultShape="square"
      />
    </div>
  );
}
