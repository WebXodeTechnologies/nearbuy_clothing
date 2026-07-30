"use client";

import React, { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import useSettingsStore from "@/store/useSettingsStore";
import { toast } from "react-hot-toast";
import {
  User,
  KeyRound,
  Bell,
  Camera,
  ShieldAlert,
  Check,
  Smartphone,
  Mail,
  Lock,
  Save,
  Trash2,
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

  // Local Form States
  const [profile, setProfile] = useState({ name: "", email: "", phone: "", avatarUrl: "" });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [notifs, setNotifs] = useState({
    emailLeads: true,
    whatsappAlerts: true,
    promoReminders: true,
    monthlyReports: false,
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
        avatarUrl: user.avatarUrl || "",
      });
    }
    if (notifications) {
      setNotifs(notifications);
    }
  }, [user, notifications]);

  // Avatar Upload Handler
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "nearbuy_preset"); // Replace with Cloudinary preset

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      if (res.ok) {
        const data = await res.json();
        setProfile((prev) => ({ ...prev, avatarUrl: data.secure_url }));
        toast.success("Avatar uploaded! Remember to save changes.");
      }
    } catch (err) {
      toast.error("Avatar upload failed");
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

  const handleToggleNotif = (key) => {
    const updated = { ...notifs, [key]: !notifs[key] };
    setNotifs(updated);
    updateNotifications(updated);
  };

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
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-extrabold text-lg overflow-hidden">
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
                <Camera className="w-3.5 h-3.5" />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Owner Profile Photo</h4>
              <p className="text-[11px] text-slate-500 font-medium">
                JPG or PNG. Maximum file size 2MB.
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
              <Save className="w-4 h-4" /> Save Profile
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Password Security */}
      {activeTab === "security" && (
        <form
          onSubmit={handleChangePassword}
          className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 max-w-2xl"
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
      )}

      {/* Tab 3: Notification Preferences */}
      {activeTab === "notifications" && (
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 max-w-2xl">
          <h3 className="text-sm font-bold text-slate-900">Alert & Notification Toggles</h3>

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