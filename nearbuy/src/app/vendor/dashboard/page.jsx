"use client";

import React, { useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import useDashboardStore from "@/store/dashboardStore";
import {
  Users,
  Eye,
  MessageSquare,
  PhoneCall,
  MapPin,
  FolderOpen,
  Tag,
  Zap,
  CheckCircle2,
  AlertCircle,
  Plus,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Clock,
  ShieldCheck,
  CreditCard,
  Image as ImageIcon,
  Store,
  HardDrive,
  AlertTriangle,
} from "lucide-react";

export default function VendorDashboard() {
  const { data: session } = useSession();
  const { vendorStats, fetchVendorStats, loading } = useDashboardStore();

  useEffect(() => {
    fetchVendorStats();
  }, [fetchVendorStats]);

  // Dynamic Time Greeting
  const greetingTime = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const vendorName = session?.user?.name || "Merchant Owner";

  // Real data calculations from backend stats
  const usedBytes = vendorStats?.storageUsedBytes || 0;
  const limitBytes = vendorStats?.storageLimitBytes || 2 * 1024 * 1024 * 1024; // 2 GB default
  const usedGB = (usedBytes / (1024 * 1024 * 1024)).toFixed(2);
  const limitGB = (limitBytes / (1024 * 1024 * 1024)).toFixed(0);
  const storagePercentage = Math.min(100, (usedBytes / limitBytes) * 100);

  // Fallback to real activities if provided by store, otherwise empty state array
  const activities = vendorStats?.recentActivities || [];

  const quickActions = [
    {
      title: "Create Collection",
      desc: "Upload outfit lookbooks",
      href: "/vendor/collections",
      icon: FolderOpen,
      color: "bg-indigo-50 text-indigo-600 border-indigo-100",
    },
    {
      title: "Launch Offer",
      desc: "Create discount coupons",
      href: "/vendor/offers",
      icon: Tag,
      color: "bg-teal-50 text-teal-600 border-teal-100",
    },
    {
      title: "Upload Images",
      desc: "Add store photos & banners",
      href: "/vendor/gallery",
      icon: ImageIcon,
      color: "bg-purple-50 text-purple-600 border-purple-100",
    },
    {
      title: "Update Store",
      desc: "Edit hours, location & phone",
      href: "/vendor/store",
      icon: Store,
      color: "bg-amber-50 text-amber-600 border-amber-100",
    },
    {
      title: "Public Listing",
      desc: "Preview customer view",
      href: session?.user?.storeSlug
        ? `/stores/${session.user.storeSlug}`
        : "/stores",
      icon: ExternalLink,
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      title: "Subscription",
      desc: "Manage Pro Gold billing",
      href: "/vendor/subscription",
      icon: CreditCard,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
  ];

  const stats = [
    {
      title: "Today's Visitors",
      value: loading
        ? "..."
        : (vendorStats?.todayVisitors || 0).toLocaleString(),
      change: "Real-time traffic",
      icon: Users,
    },
    {
      title: "Store Views",
      value: loading ? "..." : (vendorStats?.storeViews || 0).toLocaleString(),
      change: "Live Footfall",
      icon: Eye,
    },
    {
      title: "WhatsApp Leads",
      value: loading
        ? "..."
        : (vendorStats?.whatsappClicks || 0).toLocaleString(),
      change: "High Conversion",
      icon: MessageSquare,
    },
    {
      title: "Phone Enquiries",
      value: loading ? "..." : (vendorStats?.phoneClicks || 0).toLocaleString(),
      change: "Direct Calls",
      icon: PhoneCall,
    },
    {
      title: "Direction Requests",
      value: loading ? "..." : (vendorStats?.mapsClicks || 0).toLocaleString(),
      change: "Store Footfall",
      icon: MapPin,
    },
    {
      title: "Active Outfits",
      value: loading ? "..." : `${vendorStats?.collectionsCount || 0} Items`,
      change: "Catalog count",
      icon: FolderOpen,
    },
    {
      title: "Active Offers",
      value: loading ? "..." : `${vendorStats?.activeOffersCount || 0} Running`,
      change: "Active promos",
      icon: Tag,
    },
    {
      title: "Conversion Rate",
      value: vendorStats?.conversionRate || "0.0%",
      change: "Engagement Rank",
      icon: Zap,
    },
  ];

  const topLookbook = vendorStats?.topLookbook || null;

  return (
    <div className="space-y-8 font-body pb-12">
      {/* 1. Dynamic Welcome Header */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 fill-blue-600 text-blue-600" />
            <span>Hyperlocal Merchant Control</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-black text-slate-900 tracking-tight">
            {greetingTime}, {vendorName} 👋
          </h1>
          <p className="text-xs md:text-sm text-slate-600 font-medium max-w-2xl leading-relaxed">
            Track your boutique&apos;s store performance, customer WhatsApp
            inquiries, and live lookbook activity from MongoDB.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 z-10">
          <Link
            href="/vendor/collections"
            className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-bold transition-all flex items-center gap-2 border border-slate-200"
          >
            <Plus className="w-4 h-4" /> Add Outfit
          </Link>
          <Link
            href="/vendor/offers"
            className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
          >
            <Tag className="w-4 h-4" /> Launch Offer
          </Link>
        </div>
      </div>

      {/* 2. Business Health, Storage & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Score Card & Cloud Storage Widget */}
        <div className="space-y-6 flex flex-col justify-between">
          {/* Listing Completeness Score Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-heading font-extrabold text-slate-900">
                  Listing Completeness
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Store visibility optimization rank
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold border border-emerald-200">
                {vendorStats?.completenessScore || 92}% Score
              </span>
            </div>

            <div className="flex items-center gap-5 py-2">
              <div className="relative h-20 w-20 flex items-center justify-center shrink-0">
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 36 36"
                >
                  <path
                    className="text-slate-100"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <motion.path
                    initial={{ strokeDasharray: "0, 100" }}
                    animate={{
                      strokeDasharray: `${vendorStats?.completenessScore || 92}, 100`,
                    }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="text-blue-600"
                    strokeWidth="3.5"
                    strokeDasharray="92, 100"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-xl font-heading font-black text-slate-900">
                    {vendorStats?.completenessScore || 92}%
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Optimized for Local Discovery</span>
                </div>
                <p className="text-xs text-slate-600 leading-snug">
                  Your store is active and discoverable by local shoppers.
                </p>
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-2 border-t border-slate-100 pt-4 text-xs font-medium">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                Optimization Status
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Store Profile & GPS Location</span>
                </span>
                <span className="text-[10px] text-emerald-600 font-bold">
                  Done
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Catalog & Collections</span>
                </span>
                <span className="text-[10px] text-emerald-600 font-bold">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Cloud Storage Usage Widget */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Cloud Storage
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    UploadThing 2GB Server Pool
                  </p>
                </div>
              </div>
              <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-xl">
                {usedGB} GB / {limitGB} GB
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  storagePercentage >= 90 ? "bg-rose-500" : "bg-blue-600"
                }`}
                style={{ width: `${Math.max(storagePercentage, 3)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-semibold">
              <span className="text-slate-500">
                {storagePercentage.toFixed(1)}% Storage Used
              </span>
              {storagePercentage >= 90 ? (
                <span className="text-rose-600 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Almost full!
                </span>
              ) : (
                <span className="text-emerald-600">
                  Free Tier (2GB Allocated)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: 8 Metric Cards Grid */}
        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 content-start">
          {stats.map((s, idx) => {
            const IconComp = s.icon;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.04 }}
                className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-wider">
                    {s.title}
                  </span>
                  <div className="h-8 w-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 border border-blue-100 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <IconComp className="w-4 h-4" />
                  </div>
                </div>

                <div className="mt-4 space-y-1">
                  <div className="text-xl sm:text-2xl font-heading font-black text-slate-900 tracking-tight">
                    {s.value}
                  </div>
                  <div className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full inline-block">
                    {s.change}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 3. Top Lookbook & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Lookbook Spotlight */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-heading font-extrabold text-slate-900">
                Top Performing Lookbook
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Most viewed customer collection this month
              </p>
            </div>
            <Link
              href="/vendor/collections"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/60 flex flex-col sm:flex-row items-center gap-5">
            <div className="h-28 w-full sm:w-36 rounded-2xl overflow-hidden shrink-0 relative bg-slate-200">
              <Image
                src={
                  topLookbook?.image ||
                  "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80"
                }
                alt={topLookbook?.title || "Lookbook item"}
                fill
                sizes="(max-width: 640px) 100vw, 144px"
                className="object-cover"
              />
              <span className="absolute top-2 left-2 bg-blue-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs">
                Featured
              </span>
            </div>

            <div className="flex-1 space-y-2 w-full">
              <div>
                <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider">
                  {topLookbook?.category || "Apparel Collection"}
                </span>
                <h3 className="text-base font-heading font-extrabold text-slate-900 leading-tight">
                  {topLookbook?.title || "No featured collection published yet"}
                </h3>
                <p className="text-xs text-slate-600 font-medium line-clamp-1 mt-0.5">
                  {topLookbook?.description ||
                    "Upload your first clothing album to start tracking visitor views and customer engagement."}
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-bold text-slate-600 pt-1">
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-blue-600" />
                  <span>{topLookbook?.views || 0} Views</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>
                    {topLookbook?.whatsappInquiries || 0} WhatsApp Inquiries
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-heading font-extrabold text-slate-900">
              Quick Actions
            </h2>
            <kbd className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
              ⌘ K
            </kbd>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((act) => {
              const IconComponent = act.icon;
              return (
                <Link
                  key={act.title}
                  href={act.href}
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/70 hover:border-blue-200 transition-all group flex flex-col justify-between space-y-2 cursor-pointer"
                >
                  <div
                    className={`h-8 w-8 rounded-xl ${act.color} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-blue-900 leading-tight">
                      {act.title}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium line-clamp-1 mt-0.5">
                      {act.desc}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Live Customer Activity Stream */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-heading font-extrabold text-slate-900">
              Recent Customer Activity
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Real-time walk-in leads and store interactions
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            Live Stream
          </span>
        </div>

        <div className="space-y-3">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400 font-medium">
              No recent customer activity logged yet. Interactions will appear
              here in real-time.
            </div>
          ) : (
            activities.map((act, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/60 hover:bg-slate-100/80 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="h-9 w-9 rounded-xl bg-white text-blue-600 border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs font-bold text-xs">
                    ⚡
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      {act.text}
                    </p>
                    <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-slate-400" /> {act.date}
                    </span>
                  </div>
                </div>

                <span className="bg-blue-50 text-blue-700 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border border-blue-100">
                  {act.badge}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
