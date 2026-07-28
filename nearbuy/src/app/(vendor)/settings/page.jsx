"use client";

import React, { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { toast } from "react-hot-toast";
import {
  User,
  KeyRound,
  Bell,
  Sliders,
  Trash2,
  Check,
  ShieldAlert,
} from "lucide-react";

export default function VendorStoreSettings() {
  const [activeTab, setActiveTab] = useState("profile");

  // State
  const [profile, setProfile] = useState({ name: "Akash S M", email: "akash@urbanthreads.in", phone: "+91 98200 12345" });
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [notifs, setNotifs] = useState({ emailLeads: true, whatsappAlerts: true, promoReminders: true });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    toast.success("Profile information updated!");
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) {
      toast.error("New passwords do not match!");
      return;
    }
    toast.success("Password changed successfully!");
    setPasswords({ current: "", newPass: "", confirm: "" });
  };

  return (
    <div className="space-y-8 font-body pb-12">
      <DashboardHeader
        title="Account & Store Settings"
        description="Manage owner account details, password security, notification preferences, and business configurations."
        badge="Preferences"
      />

      {/* Tabs */}
      <div className="bg-white p-2 rounded-3xl border border-[#ECECEC] shadow-xs flex items-center gap-2 max-w-xl">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex-1 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "profile"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <User className="w-4 h-4" /> Profile
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`flex-1 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "security"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <KeyRound className="w-4 h-4" /> Password
        </button>

        <button
          onClick={() => setActiveTab("notifications")}
          className={`flex-1 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "notifications"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Bell className="w-4 h-4" /> Notifications
        </button>
      </div>

      {/* Profile Form */}
      {activeTab === "profile" && (
        <form onSubmit={handleSaveProfile} className="bg-white p-6 md:p-8 rounded-3xl border border-[#ECECEC] shadow-xs space-y-4 max-w-2xl">
          <h3 className="text-base font-heading font-bold text-slate-900">Personal & Account Info</h3>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
              Account Email
            </label>
            <input
              type="email"
              disabled
              value={profile.email}
              className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
              Contact Phone Number
            </label>
            <input
              type="text"
              required
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md"
            >
              Save Profile
            </button>
          </div>
        </form>
      )}

      {/* Security Form */}
      {activeTab === "security" && (
        <form onSubmit={handleChangePassword} className="bg-white p-6 md:p-8 rounded-3xl border border-[#ECECEC] shadow-xs space-y-4 max-w-2xl">
          <h3 className="text-base font-heading font-bold text-slate-900">Change Password</h3>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
              Current Password
            </label>
            <input
              type="password"
              required
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                value={passwords.newPass}
                onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md"
            >
              Update Password
            </button>
          </div>
        </form>
      )}

      {/* Notifications Form */}
      {activeTab === "notifications" && (
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#ECECEC] shadow-xs space-y-4 max-w-2xl">
          <h3 className="text-base font-heading font-bold text-slate-900">Notification Preferences</h3>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Email Lead Digest</h4>
                <p className="text-[11px] text-slate-500 font-medium">Receive daily summary of WhatsApp & direction clicks.</p>
              </div>
              <input
                type="checkbox"
                checked={notifs.emailLeads}
                onChange={(e) => setNotifs({ ...notifs, emailLeads: e.target.checked })}
                className="h-5 w-5 rounded-lg text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Instant WhatsApp Lead Alerts</h4>
                <p className="text-[11px] text-slate-500 font-medium">Get real-time notification on your phone when a shopper clicks WhatsApp.</p>
              </div>
              <input
                type="checkbox"
                checked={notifs.whatsappAlerts}
                onChange={(e) => setNotifs({ ...notifs, whatsappAlerts: e.target.checked })}
                className="h-5 w-5 rounded-lg text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Danger Zone */}
      <div className="bg-rose-50/60 p-6 md:p-8 rounded-3xl border border-rose-200/80 space-y-3 max-w-2xl">
        <h3 className="text-base font-heading font-bold text-rose-900 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-600" /> Danger Zone
        </h3>
        <p className="text-xs text-rose-700 font-medium">
          Permanently delete your merchant store profile, active collections, and promotions from Nearbuy.
        </p>
        <button
          onClick={() => {
            if (confirm("Are you sure you want to delete your merchant account?")) {
              toast.error("Account deletion requested.");
            }
          }}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md cursor-pointer"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}
