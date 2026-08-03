"use client";

import React, { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { toast } from "react-hot-toast";
import {
  Globe,
  CreditCard,
  Mail,
  Shield,
  Save,
  RefreshCw,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    platformName: "Nearbuy Boutiques",
    supportEmail: "support@nearbuy.com",
    contactPhone: "+91 98765 43210",
    platformCurrency: "INR (₹)",
    maintenanceMode: false,
    newVendorRegistration: true,
    razorpayKeyId: "",
    razorpayKeySecret: "",
    commissionRate: "5%",
    smtpHost: "",
    senderEmail: "",
  });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (res.ok && data.data) {
        setSettings(data.data);
      }
    } catch (err) {
      console.warn("Failed to load DB settings:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save settings");

      toast.success("Platform settings saved to database!");
    } catch (err) {
      toast.error(err.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-body pb-12">
      <DashboardHeader
        title="Platform Settings & Configuration"
        description="Manage global system variables, payment gateway credentials, vendor onboarding toggles, and security parameters stored in MongoDB."
        badge="Database Synced"
      >
        <button
          type="button"
          onClick={fetchSettings}
          className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-indigo-600" : ""}`} />
          <span>Reload from DB</span>
        </button>
      </DashboardHeader>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 bg-white p-3 rounded-3xl border border-slate-200/80 shadow-xs space-y-1 h-fit">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`w-full px-4 py-3 text-xs font-bold rounded-2xl transition-all flex items-center gap-2.5 cursor-pointer text-left ${activeTab === "general" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-50"
              }`}
          >
            <Globe className="w-4 h-4" />
            <span>General Platform</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("payments")}
            className={`w-full px-4 py-3 text-xs font-bold rounded-2xl transition-all flex items-center gap-2.5 cursor-pointer text-left ${activeTab === "payments" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-50"
              }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Payments & Commission</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("notifications")}
            className={`w-full px-4 py-3 text-xs font-bold rounded-2xl transition-all flex items-center gap-2.5 cursor-pointer text-left ${activeTab === "notifications" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-50"
              }`}
          >
            <Mail className="w-4 h-4" />
            <span>Email & SMTP</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={`w-full px-4 py-3 text-xs font-bold rounded-2xl transition-all flex items-center gap-2.5 cursor-pointer text-left ${activeTab === "security" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-50"
              }`}
          >
            <Shield className="w-4 h-4" />
            <span>Security & Maintenance</span>
          </button>
        </div>

        <div className="lg:col-span-3 bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
          <form onSubmit={handleSave} className="space-y-6">
            {activeTab === "general" && (
              <div className="space-y-4">
                <h3 className="font-heading font-black text-slate-900 text-sm border-b pb-2">General Platform Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">Platform Brand Name</label>
                    <input
                      type="text"
                      value={settings.platformName}
                      onChange={(e) => handleChange("platformName", e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">Support Email</label>
                    <input
                      type="email"
                      value={settings.supportEmail}
                      onChange={(e) => handleChange("supportEmail", e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "payments" && (
              <div className="space-y-4">
                <h3 className="font-heading font-black text-slate-900 text-sm border-b pb-2">Payment Gateway & Commission</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">Razorpay Key ID</label>
                    <input
                      type="text"
                      value={settings.razorpayKeyId}
                      onChange={(e) => handleChange("razorpayKeyId", e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-mono text-slate-800 focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">Commission Rate</label>
                    <input
                      type="text"
                      value={settings.commissionRate}
                      onChange={(e) => handleChange("commissionRate", e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-4">
                <h3 className="font-heading font-black text-slate-900 text-sm border-b pb-2">SMTP Mail Server</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">SMTP Host</label>
                    <input
                      type="text"
                      value={settings.smtpHost}
                      onChange={(e) => handleChange("smtpHost", e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-mono text-slate-800 focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">Sender Email</label>
                    <input
                      type="email"
                      value={settings.senderEmail}
                      onChange={(e) => handleChange("senderEmail", e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-mono text-slate-800 focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-4">
                <h3 className="font-heading font-black text-slate-900 text-sm border-b pb-2">Platform Switches</h3>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Emergency Maintenance Mode</h4>
                    <p className="text-[11px] text-slate-500">Displays a maintenance screen to visitors.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => handleChange("maintenanceMode", e.target.checked)}
                    className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{saving ? "Saving to Database..." : "Save System Settings"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}