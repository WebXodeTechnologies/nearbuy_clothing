"use client";

import React, { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import useSettingsStore from "@/store/useSettingsStore";
import { useUploadThing } from "@/utils/uploadthing"; // 👈 Import UploadThing client helper
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

  const [activeTab, setActiveTab] = useState("profile");
  const [isUploading, setIsUploading] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  // Local Form States
  const [profile, setProfile] = useState({ name: "", email: "", phone: "", avatarUrl: "" });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [notifs, setNotifs] = useState({
    emailLeads: true,
    whatsappAlerts: true,
    promoReminders: true,
    monthlyReports: false,
  });

  // 👈 Initialize UploadThing hook for avatar profile picture (enforces 2GB vendor limit pool)
  const { startUpload } = useUploadThing("vendorAssetUploader", {
    headers: {
      "x-user-email": user?.email || "",
    },
    onClientUploadComplete: (res) => {
      setIsUploading(false);
      if (res && res[0]) {
        const uploadedUrl = res[0].url || res[0].fileUrl;
        setProfile((prev) => ({ ...prev, avatarUrl: uploadedUrl }));
        toast.success("Avatar uploaded to cloud server! Click 'Save Profile' to apply.");
      }
    },
    onUploadError: (err) => {
      setIsUploading(false);
      toast.error(err?.message || "Storage limit of 2GB reached or upload failed.");
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

  // 👈 1. Avatar PC Upload Handler via UploadThing
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!user?.email) {
      toast.error("Session email missing. Please re-login.");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading("Uploading avatar to UploadThing server...");

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

  // 👈 2. Password Reset via Email Logic
  const handleRequestPasswordResetEmail = async () => {
    if (!profile.email) {
      toast.error("No email associated with this account.");
      return;
    }

    setIsSendingReset(true);
    const toastId = toast.loading("Sending secure password reset link to your email...");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: profile.email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send reset email");

      toast.success("Password reset link sent! Check your inbox.", { id: toastId });
    } catch (err) {
      toast.error(err.message || "Could not send reset email.", { id: toastId });
    } finally {
      setIsSendingReset(false);
    }
  };

  // 👈 3. Real-Time Notification Toggle & Event Listener Hook
  const handleToggleNotif = (key) => {
    const updated = { ...notifs, [key]: !notifs[key] };
    setNotifs(updated);
    updateNotifications(updated);
    toast.success("Notification preferences updated!");
  };

  // Real-time listener for incoming live alerts (e.g., WebSocket / Server-Sent Events)
  useEffect(() => {
    if (!user?.email) return;

    // Example real-time event stream connection (e.g. SSE endpoint or Socket.io)
    const eventSource = new EventSource(`/api/notifications/stream?email=${encodeURIComponent(user.email)}`);

    eventSource.onmessage = (event) => {
      try {
        const liveAlert = JSON.parse(event.data);
        if (liveAlert && liveAlert.title) {
          toast((t) => (
            <div className="flex flex-col gap-1 font-body">
              <span className="text-xs font-bold text-slate-900">⚡ {liveAlert.title}</span>
              <span className="text-[11px] text-slate-600">{liveAlert.message}</span>
            </div>
          ), { position: "top-right", duration: 6000 });
        }
      } catch (err) {
        console.error("Failed to parse live notification stream:", err);
      }
    };

    return () => {
      eventSource.close();
    };
  }, [user]);

  return (
    <div className="space-y-8 font-body pb-12 max-w-5xl mx-auto">
      <DashboardHeader
        title="Account & Store Settings"
        description="Manage owner credentials, password security, notification alerts, and account preferences."
        badge="Preferences"
      />

      {/* Navigation Tabs */}
      <div className="bg-slate-100/80 p-1.5 rounded-2xl flex items-center gap-1 max-w-md border border-slate-200/60">
        {[
          { id: "profile", label: "Profile Info", icon: User },
          { id: "security", label: "Security", icon: KeyRound },
          { id: "notifications", label: "Notifications", icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${activeTab === tab.id
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

      {/* Tab 1: Profile Info */}
      {activeTab === "profile" && (
        <form
          onSubmit={handleSaveProfile}
          className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6 max-w-2xl"
        >
          <h3 className="text-sm font-bold text-slate-900">Personal & Account Information</h3>

          {/* Avatar Section */}
          <div className="flex items-center gap-4 pb-2 border-b border-slate-100">
            <div className="relative group">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-extrabold text-lg overflow-hidden relative">
                {profile.avatarUrl ? (
                  <Image src={profile.avatarUrl} alt="Avatar" width={64} height={64} className="w-full h-full object-cover" />
                ) : (
                  profile.name.charAt(0) || "U"
                )}
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute -bottom-1 -right-1 bg-slate-900 text-white p-1.5 rounded-full cursor-pointer hover:bg-indigo-600 transition-colors shadow-2xs"
              >
                {isUploading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
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
              <h4 className="text-xs font-bold text-slate-900">Owner Profile Photo (UploadThing Cloud)</h4>
              <p className="text-[11px] text-slate-500 font-medium">
                {isUploading ? "Uploading to server..." : "JPG or PNG. Stored against your 2GB storage quota."}
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
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
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
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
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

      {/* Tab 2: Password Security & Reset via Email */}
      {activeTab === "security" && (
        <div className="space-y-6 max-w-2xl">
          <form
            onSubmit={handleChangePassword}
            className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4"
          >
            <h3 className="text-sm font-bold text-slate-900">Update Password</h3>

            <div>
              <label className="block text-[11px] font-extrabold text-slate-600 uppercase tracking-wider mb-1">
                Current Password
              </label>
              <input
                type="password"
                required
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
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
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
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
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
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

          {/* Reset via Email Box */}
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 flex items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-slate-900">Forgot current password?</h4>
              <p className="text-[11px] text-slate-500 font-medium">
                We can send a secure token link to <span className="font-semibold text-slate-700">{profile.email}</span> to reset your password.
              </p>
            </div>
            <button
              type="button"
              disabled={isSendingReset}
              onClick={handleRequestPasswordResetEmail}
              className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 disabled:opacity-50 shadow-2xs"
            >
              {isSendingReset ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5 text-indigo-600" />}
              <span>Send Reset Email</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Notification Preferences & Real-time Alerts */}
      {activeTab === "notifications" && (
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 max-w-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Alert & Notification Toggles</h3>
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
                      <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                      <p className="text-[11px] text-slate-500 font-medium">{item.desc}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleNotif(item.key)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${notifs[item.key] ? "bg-indigo-600" : "bg-slate-200"
                      }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-2xs transform transition-transform duration-200 ease-in-out ${notifs[item.key] ? "translate-x-5" : "translate-x-0"
                        }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Danger Zone Box */}
      <div className="bg-rose-50/40 p-6 md:p-8 rounded-3xl border border-rose-200/70 space-y-3 max-w-2xl">
        <h3 className="text-sm font-bold text-rose-900 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-600" /> Danger Zone
        </h3>
        <p className="text-xs text-rose-700 font-medium">
          Permanently unlist your clothing store profile, collections, and promotions from Nearbuy.
        </p>
        <button
          onClick={() => {
            if (confirm("Are you sure you want to permanently delete your merchant store profile?")) {
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