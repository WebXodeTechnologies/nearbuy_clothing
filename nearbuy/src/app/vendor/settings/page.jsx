"use client";

import React, { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import useSettingsStore from "@/store/useSettingsStore";
import { useUploadThing } from "@/utils/uploadthing";
import { toast } from "react-hot-toast";
import {
  User,
  KeyRound,
  Bell,
  Camera,
  ShieldAlert,
  Smartphone,
  Mail,
  Lock,
  Save,
  Trash2,
  RefreshCw,
  Store as StoreIcon,
  Tag,
  Check,
} from "lucide-react";
import Image from "next/image";

export default function VendorStoreSettings() {
  const {
    user,
    notifications,
    loading,
    fetchSettings,
    updateProfile,
    updatePassword,
    updateNotifications,
  } = useSettingsStore();

  const [activeTab, setActiveTab] = useState("store"); // Default to store profile
  const [isUploading, setIsUploading] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  // Store & Categories State
  const [storeData, setStoreData] = useState(null);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isSavingStore, setIsSavingStore] = useState(false);

  // Local User Account States
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    avatarUrl: "",
  });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [notifs, setNotifs] = useState({
    emailLeads: true,
    whatsappAlerts: true,
    promoReminders: true,
    monthlyReports: false,
  });

  // Fetch Vendor Store and Categories
  useEffect(() => {
    async function loadStoreAndCategories() {
      try {
        const [categoriesRes, storeRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/stores?vendor=me"), // Or your vendor store route
        ]);

        const categoriesJson = await categoriesRes.json();
        const storeJson = await storeRes.json();

        const catList =
          categoriesJson?.data || categoriesJson?.categories || [];
        setAvailableCategories(catList);

        const activeStore =
          storeJson?.data?.stores?.[0] || storeJson?.data || storeJson?.store;
        if (activeStore) {
          setStoreData(activeStore);
          const currentCatIds = (activeStore.categoryIds || []).map((c) =>
            typeof c === "object" ? c._id : c,
          );
          setSelectedCategories(currentCatIds);
        }
      } catch (err) {
        console.error("Failed to load store or categories:", err);
      }
    }

    loadStoreAndCategories();
  }, []);

  const { startUpload } = useUploadThing("vendorAssetUploader", {
    headers: {
      "x-user-email": user?.email || "",
    },
    onClientUploadComplete: (res) => {
      setIsUploading(false);
      if (res && res[0]) {
        const uploadedUrl = res[0].url || res[0].fileUrl;
        setProfile((prev) => ({ ...prev, avatarUrl: uploadedUrl }));
        toast.success("Avatar uploaded! Click 'Save Profile' to apply.");
      }
    },
    onUploadError: (err) => {
      setIsUploading(false);
      toast.error(err?.message || "Storage limit reached or upload failed.");
    },
  });

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProfile({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        avatarUrl: user.avatarUrl || user.image || "",
      });
    }
    if (notifications) {
      setNotifs(notifications);
    }
  }, [user, notifications]);

  // Category Toggle Handler
  const toggleCategory = (catId) => {
    setSelectedCategories((prev) =>
      prev.includes(catId)
        ? prev.filter((id) => id !== catId)
        : [...prev, catId],
    );
  };

  // Save Store Details (including categoryIds)
  const handleSaveStore = async (e) => {
    e.preventDefault();
    if (!storeData?._id) {
      toast.error("Store document not found");
      return;
    }

    setIsSavingStore(true);
    const toastId = toast.loading("Updating store categories...");

    try {
      const res = await fetch(`/api/stores/${storeData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryIds: selectedCategories,
          storeName: storeData.storeName,
          address: storeData.address,
          city: storeData.city,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update store");

      toast.success("Store categories updated successfully!", { id: toastId });
    } catch (err) {
      toast.error(err.message || "Error saving store categories", {
        id: toastId,
      });
    } finally {
      setIsSavingStore(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!user?.email) {
      toast.error("Session email missing. Please re-login.");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading("Uploading avatar...");

    try {
      await startUpload([file]);
      toast.dismiss(toastId);
    } catch (err) {
      toast.dismiss(toastId);
      setIsUploading(false);
      toast.error(err.message || "Failed to upload avatar");
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({
      name: profile.name,
      phone: profile.phone,
      avatarUrl: profile.avatarUrl,
    });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    updatePassword({
      currentPassword: passwords.currentPassword,
      newPassword: passwords.newPassword,
    });
    setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleRequestPasswordResetEmail = async () => {
    if (!profile.email) {
      toast.error("No email associated with this account.");
      return;
    }

    setIsSendingReset(true);
    const toastId = toast.loading("Sending password reset link...");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: profile.email }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to send reset email");

      toast.success("Password reset link sent! Check your inbox.", {
        id: toastId,
      });
    } catch (err) {
      toast.error(err.message || "Could not send reset email.", {
        id: toastId,
      });
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleToggleNotif = (key) => {
    const updated = { ...notifs, [key]: !notifs[key] };
    setNotifs(updated);
    updateNotifications(updated);
    toast.success("Notification preferences updated!");
  };

  return (
    <div className="space-y-8 font-body pb-12 max-w-5xl mx-auto">
      <DashboardHeader
        title="Account & Store Settings"
        description="Manage your boutique categories, business address, credentials, and notification alerts."
        badge="Preferences"
      />

      {/* Navigation Tabs */}
      <div className="bg-slate-100/80 p-1.5 rounded-2xl flex items-center gap-1 max-w-lg border border-slate-200/60">
        {[
          { id: "store", label: "Store & Categories", icon: StoreIcon },
          { id: "profile", label: "Profile Info", icon: User },
          { id: "security", label: "Security", icon: KeyRound },
          { id: "notifications", label: "Notifications", icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-white text-slate-900 shadow-2xs border border-slate-200/80"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-indigo-600" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 0: Store & Categories */}
      {activeTab === "store" && (
        <form
          onSubmit={handleSaveStore}
          className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6 max-w-2xl"
        >
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Boutique Category Tags
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select all categories your store sells so shoppers can discover
              you on the explore page.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
            {availableCategories.map((cat) => {
              const isSelected = selectedCategories.includes(cat._id);
              return (
                <button
                  type="button"
                  key={cat._id}
                  onClick={() => toggleCategory(cat._id)}
                  className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? "bg-indigo-50 border-indigo-300 text-indigo-700 shadow-2xs"
                      : "bg-slate-50/60 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3 h-3 text-indigo-500" />
                    {cat.name}
                  </span>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={isSavingStore}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-2xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> Save Store Categories
            </button>
          </div>
        </form>
      )}

      {/* Tab 1: Profile Info */}
      {activeTab === "profile" && (
        <form
          onSubmit={handleSaveProfile}
          className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6 max-w-2xl"
        >
          <h3 className="text-sm font-bold text-slate-900">
            Personal & Account Information
          </h3>

          <div className="flex items-center gap-4 pb-2 border-b border-slate-100">
            <div className="relative group">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-extrabold text-lg overflow-hidden relative">
                {profile.avatarUrl ? (
                  <Image
                    src={profile.avatarUrl}
                    alt="Avatar"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  profile.name.charAt(0) || "U"
                )}
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute -bottom-1 -right-1 bg-slate-900 text-white p-1.5 rounded-full cursor-pointer hover:bg-indigo-600 transition-colors shadow-2xs"
              >
                {isUploading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Camera className="w-3.5 h-3.5" />
                )}
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={isUploading}
                className="hidden"
              />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                Owner Profile Photo
              </h4>
              <p className="text-[11px] text-slate-500 font-medium">
                {isUploading
                  ? "Uploading to server..."
                  : "JPG or PNG. Stored against your cloud storage quota."}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-extrabold text-slate-600 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-slate-600 uppercase tracking-wider mb-1">
                Account Email (Read-Only)
              </label>
              <input
                type="email"
                disabled
                value={profile.email}
                className="w-full bg-slate-100/80 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-slate-600 uppercase tracking-wider mb-1">
                Contact Phone Number
              </label>
              <input
                type="text"
                required
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
                className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading || isUploading}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-2xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> Save Profile
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Security */}
      {activeTab === "security" && (
        <div className="space-y-6 max-w-2xl">
          <form
            onSubmit={handleChangePassword}
            className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4"
          >
            <h3 className="text-sm font-bold text-slate-900">
              Update Password
            </h3>

            <div>
              <label className="block text-[11px] font-extrabold text-slate-600 uppercase tracking-wider mb-1">
                Current Password
              </label>
              <input
                type="password"
                required
                value={passwords.currentPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    currentPassword: e.target.value,
                  })
                }
                className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-600 uppercase tracking-wider mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, newPassword: e.target.value })
                  }
                  className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-slate-600 uppercase tracking-wider mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={passwords.confirmPassword}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-2xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Lock className="w-4 h-4" /> Update Password
              </button>
            </div>
          </form>

          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 flex items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                Forgot current password?
              </h4>
              <p className="text-[11px] text-slate-500 font-medium">
                We can send a secure token link to{" "}
                <span className="font-semibold text-slate-700">
                  {profile.email}
                </span>{" "}
                to reset your password.
              </p>
            </div>
            <button
              type="button"
              disabled={isSendingReset}
              onClick={handleRequestPasswordResetEmail}
              className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 disabled:opacity-50 shadow-2xs"
            >
              {isSendingReset ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Mail className="w-3.5 h-3.5 text-indigo-600" />
              )}
              <span>Send Reset Email</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Notifications */}
      {activeTab === "notifications" && (
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 max-w-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Alert & Notification Toggles
            </h3>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              🟢 Real-Time Stream Active
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {[
              {
                key: "whatsappAlerts",
                title: "Instant WhatsApp Lead Alerts",
                desc: "Get immediate WhatsApp messages when shoppers click your store direction/contact.",
                icon: Smartphone,
              },
              {
                key: "emailLeads",
                title: "Daily Email Lead Digest",
                desc: "Receive daily performance metrics and store footfall summary in your inbox.",
                icon: Mail,
              },
              {
                key: "promoReminders",
                title: "Campaign & Promotion Reminders",
                desc: "Notifications when active store discount campaigns are expiring soon.",
                icon: Bell,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/60 border border-slate-100"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-white border border-slate-200/60 text-indigo-600">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleNotif(item.key)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
                      notifs[item.key] ? "bg-indigo-600" : "bg-slate-200"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-2xs transform transition-transform duration-200 ease-in-out ${
                        notifs[item.key] ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Danger Zone */}
      <div className="bg-rose-50/40 p-6 md:p-8 rounded-3xl border border-rose-200/70 space-y-3 max-w-2xl">
        <h3 className="text-sm font-bold text-rose-900 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-600" /> Danger Zone
        </h3>
        <p className="text-xs text-rose-700 font-medium">
          Permanently unlist your clothing store profile, collections, and
          promotions from Streetunics.
        </p>
        <button
          onClick={() => {
            if (
              confirm(
                "Are you sure you want to permanently delete your merchant store profile?",
              )
            ) {
              toast.error("Account deletion requested. Support team notified.");
            }
          }}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-2xs flex items-center gap-2 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" /> Delete Store Account
        </button>
      </div>
    </div>
  );
}
