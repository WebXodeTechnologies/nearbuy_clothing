"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/navigation/Sidebar";
import Button from "@/components/ui/Button";
import CommandPalette from "@/components/ui/CommandPalette";
import Link from "next/link";
import {
  Search,
  Bell,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";

export default function VendorLayout({ children }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Keyboard shortcut listener for Command Palette (⌘+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleBackToLogin = () => {
    router.push("/auth/login");
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-indigo-500" />
        <span className="text-xs font-semibold text-slate-400">Loading merchant workspace...</span>
      </div>
    );
  }

  // 2. Role Security Guard
  const isVendor = user?.role && ["VENDOR", "ADMIN"].includes(user.role.toUpperCase());

  if (!user || !isVendor) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-slate-300">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-5 shadow-2xl">
          <div className="h-14 w-14 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Access Restricted</h2>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed font-medium">
              You must be logged in as a registered Merchant Vendor to access the store dashboard.
            </p>
          </div>
          <Button
            onClick={handleBackToLogin}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl py-3 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            Sign In as Vendor
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-body text-slate-900">

      {/* Desktop Left Sidebar */}
      <div className="hidden lg:block shrink-0">
        <Sidebar type="vendor" />
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-72 h-full bg-slate-950 flex flex-col">
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="absolute top-5 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <Sidebar type="vendor" />
          </div>
        </div>
      )}

      {/* Global Command Palette Overlay */}
      <CommandPalette isOpen={isCommandOpen} onClose={setIsCommandOpen} />

      {/* Main Viewport Container */}
      <div className="flex-1 flex flex-col overflow-y-auto">

        {/* Top Navbar Header */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-xs">

          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Toggle Button */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Global Command Search Trigger */}
            <button
              onClick={() => setIsCommandOpen(true)}
              className="flex items-center gap-3 bg-slate-100 hover:bg-slate-200/70 border border-slate-200/80 px-3.5 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-800 transition-all duration-200 w-48 sm:w-72 md:w-96 cursor-pointer shadow-xs"
            >
              <Search className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="font-medium truncate text-left">
                Search metrics, offers, collections...
              </span>
              <kbd className="hidden sm:inline-flex ml-auto px-2 py-0.5 bg-white border border-slate-200 rounded-md text-[10px] font-mono text-slate-500 font-bold shadow-xs">
                ⌘ K
              </kbd>
            </button>
          </div>

          {/* Header Action Items */}
          <div className="flex items-center gap-3 sm:gap-4">

            {/* Store Status Indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Store Live</span>
            </div>

            {/* Public Storefront Link */}
            <Link
              href={user?.storeSlug ? `/stores/${user.storeSlug}` : "/stores"}
              target="_blank"
              className="hidden md:flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-3.5 py-2 rounded-xl border border-slate-200 transition-colors"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {/* Notifications Trigger */}
            <Link
              href="/vendor/notifications"
              className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-indigo-600 transition-colors border border-slate-200"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white" />
            </Link>

            {/* User Avatar & Plan Info */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="h-9 w-9 rounded-xl bg-linear-to-tr from-indigo-600 to-teal-400 p-0.5 shadow-xs">
                <div className="w-full h-full rounded-[10px] bg-white flex items-center justify-center font-black text-indigo-700 text-xs uppercase overflow-hidden">
                  {user?.image ? (
                    <Image src={user.image} alt={user.name} width={200} height={200} className="w-full h-full object-cover" />
                  ) : (
                    <span>{user?.name ? user.name.charAt(0) : "V"}</span>
                  )}
                </div>
              </div>
              <div className="hidden lg:flex flex-col">
                <span className="text-xs font-extrabold text-slate-900 leading-tight">
                  {user?.name || "Merchant"}
                </span>
                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                  {user?.planName || "Pro Gold"} <Sparkles className="w-2.5 h-2.5 fill-emerald-500 text-emerald-500" />
                </span>
              </div>
            </div>

          </div>
        </header>

        {/* Scrollable Page Body */}
        <main className="p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}