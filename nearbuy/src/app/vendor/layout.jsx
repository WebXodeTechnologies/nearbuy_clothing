"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/navigation/Sidebar";
import Button from "@/components/ui/Button";
import CommandPalette from "@/components/ui/CommandPalette";
import Link from "next/link";
import { Search, Bell, Sparkles, ExternalLink, ShieldCheck } from "lucide-react";

export default function VendorLayout({ children }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  const handleBackToLogin = () => {
    router.push("/auth/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  // Case-insensitive verification for VENDOR or ADMIN role
  const isVendor = user?.role && ["VENDOR", "ADMIN"].includes(user.role.toUpperCase());

  if (!user || !isVendor) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-slate-300">
        <div className="max-w-md space-y-4">
          <div className="h-12 w-12 bg-indigo-950/30 text-indigo-400 border border-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Access Restricted</h2>
          <p className="text-xs text-slate-400 leading-relaxed font-semibold">
            You must be logged in as a Merchant Vendor to access the merchant dashboard. Please authenticate to view your store listings.
          </p>
          <div className="pt-4">
            <Button onClick={handleBackToLogin} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl py-3 shadow-lg shadow-indigo-600/30">
              Proceed to Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#FAFAFA] overflow-hidden font-body text-slate-900">
      {/* Left Sidebar */}
      <Sidebar type="vendor" />

      {/* Command Palette Overlay */}
      <CommandPalette isOpen={isCommandOpen} onClose={setIsCommandOpen} />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Navbar Header */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-[#ECECEC] px-6 py-3.5 flex items-center justify-between shadow-2xs">
          {/* Global Command Search Trigger */}
          <button
            onClick={() => setIsCommandOpen(true)}
            className="flex items-center gap-3 bg-slate-100/80 hover:bg-slate-200/60 border border-slate-200/60 px-4 py-2 rounded-2xl text-xs text-slate-400 hover:text-slate-700 transition-all duration-200 w-72 md:w-96 cursor-pointer group shadow-2xs"
          >
            <Search className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
            <span className="font-medium truncate">Search store metrics, offers, collections...</span>
            <kbd className="ml-auto px-2 py-0.5 bg-white border border-slate-200 rounded-lg text-[10px] font-mono text-slate-500 font-extrabold shadow-2xs">
              ⌘K
            </kbd>
          </button>

          {/* Right Status Actions */}
          <div className="flex items-center gap-4">
            {/* Store Status Indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-bold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Store Open • Bandra West</span>
            </div>

            {/* Public Storefront Link */}
            <Link
              href="/stores"
              target="_blank"
              className="hidden md:flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-3 py-1.5 rounded-xl border border-slate-200/60 transition-colors"
            >
              <span>Public Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {/* Notifications Trigger */}
            <Link
              href="/vendor/notifications"
              className="relative p-2 rounded-2xl bg-slate-100/80 hover:bg-slate-200/60 text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer border border-slate-200/60"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-teal-500 rounded-full border-2 border-white" />
            </Link>

            {/* User Avatar & Plan Badge */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200/80">
              <div className="h-9 w-9 rounded-2xl bg-linear-to-tr from-indigo-600 to-teal-400 p-0.5 shadow-md">
                <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center font-black text-indigo-700 text-xs uppercase">
                  {user?.name ? user.name.charAt(0) : "V"}
                </div>
              </div>
              <div className="hidden lg:flex flex-col">
                <span className="text-xs font-extrabold text-slate-900 leading-tight">{user?.name || "Akash S M"}</span>
                <span className="text-[10px] font-bold text-teal-600 flex items-center gap-0.5">
                  Pro Gold <Sparkles className="w-2.5 h-2.5 fill-teal-500" />
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Body */}
        <main className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
}
