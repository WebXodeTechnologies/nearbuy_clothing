"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
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
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Clock,
  ShieldCheck,
  CreditCard,
  Image as ImageIcon,
  Store,
} from "lucide-react";

export default function VendorDashboard() {
  const { vendorStats, fetchVendorStats, loading } = useDashboardStore();

  useEffect(() => {
    fetchVendorStats();
  }, [fetchVendorStats]);

  const activities = [
    { text: "Customer clicked WhatsApp Enquiry for 'Summer Linen 2026'", date: "10 mins ago", type: "lead", badge: "WhatsApp" },
    { text: "Monsoon flat 20% coupon code MONSOON20 claimed by customer", date: "45 mins ago", type: "offer", badge: "Promotion" },
    { text: "Google Maps directions requested for Bandra West shop", date: "2 hours ago", type: "map", badge: "Direction" },
    { text: "New collection 'Urban Oversized Hoodies' was published", date: "Yesterday, 4:30 PM", type: "collection", badge: "Collection" },
    { text: "Gold Pro Monthly Subscription renewed successfully", date: "July 15, 2026", type: "billing", badge: "Billing" },
  ];

  const quickActions = [
    { title: "Create Collection", desc: "Upload new lookbook items", href: "/vendor/collections", icon: FolderOpen, color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
    { title: "Launch Offer", desc: "Create discount coupons", href: "/vendor/offers", icon: Tag, color: "bg-teal-50 text-teal-600 border-teal-100" },
    { title: "Upload Images", desc: "Add gallery & store photos", href: "/vendor/gallery", icon: ImageIcon, color: "bg-purple-50 text-purple-600 border-purple-100" },
    { title: "Update Store", desc: "Edit hours, address & phone", href: "/vendor/profile", icon: Store, color: "bg-amber-50 text-amber-600 border-amber-100" },
    { title: "View Public Listing", desc: "Preview customer view", href: "/stores", icon: ExternalLink, color: "bg-blue-50 text-blue-600 border-blue-100" },
    { title: "Renew Subscription", desc: "Manage Pro Gold billing", href: "/vendor/subscription", icon: CreditCard, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  ];

  const stats = [
    { title: "Today's Visitors", value: "142", change: "+18% vs yesterday", type: "increase", icon: Users },
    { title: "Store Views", value: loading ? "..." : (vendorStats?.storeViews || 2840).toString(), change: "Live footfall", type: "increase", icon: Eye },
    { title: "WhatsApp Clicks", value: loading ? "..." : (vendorStats?.whatsappClicks || 48).toString(), change: "High Lead Interest", type: "increase", icon: MessageSquare },
    { title: "Phone Calls", value: loading ? "..." : (vendorStats?.phoneClicks || 31).toString(), change: "Direct Enquiries", type: "increase", icon: PhoneCall },
    { title: "Direction Requests", value: loading ? "..." : (vendorStats?.mapsClicks || 67).toString(), change: "Top Footfall Driver", type: "increase", icon: MapPin },
    { title: "Active Collections", value: loading ? "..." : `${vendorStats?.storesCount ? 12 : 3} Items`, change: "3 Featured", type: "neutral", icon: FolderOpen },
    { title: "Active Promotions", value: loading ? "..." : `${vendorStats?.activeOffersCount || 2} Running`, change: "450 Claims", type: "increase", icon: Tag },
    { title: "Conversion Rate", value: "6.8%", change: "Top 10% Local Rank", type: "increase", icon: Zap },
  ];

  return (
    <div className="space-y-8 font-body pb-12">
      {/* 1. Large Welcome Header */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#ECECEC] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 fill-indigo-600" /> Business Control Center
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-black text-slate-900 tracking-tight">
            Good Morning, Akash 👋
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium max-w-2xl leading-relaxed">
            Here is your hyperlocal clothing store discovery stats, WhatsApp lead conversions, and store health checklist today.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 z-10">
          <Link
            href="/vendor/collections"
            className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-bold transition-all flex items-center gap-2 border border-slate-200/60"
          >
            <Plus className="w-4 h-4" /> Add Collection
          </Link>
          <Link
            href="/vendor/offers"
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
          >
            <Tag className="w-4 h-4" /> Launch Promotion
          </Link>
        </div>
      </div>

      {/* 2. Business Health Card & Stat Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Business Health Card */}
        <div className="bg-white p-6 rounded-3xl border border-[#ECECEC] shadow-xs space-y-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-heading font-bold text-slate-900">Business Score</h2>
              <p className="text-xs text-slate-400 font-medium">Store listing completeness rank</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-black border border-teal-100">
              92% Score
            </span>
          </div>

          {/* Animated Progress Score Ring */}
          <div className="flex items-center gap-5 py-2">
            <div className="relative h-20 w-20 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <motion.path
                  initial={{ strokeDasharray: "0, 100" }}
                  animate={{ strokeDasharray: "92, 100" }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="text-indigo-600"
                  strokeWidth="3.5"
                  strokeDasharray="92, 100"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-xl font-heading font-black text-slate-900">92%</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Optimized for Footfall
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                Your store listing ranks in the <span className="font-extrabold text-slate-800">Top 5% in Bandra West</span> for linen clothing searches.
              </p>
            </div>
          </div>

          {/* Actionable Suggestions Checklist */}
          <div className="space-y-2 border-t border-slate-100 pt-4 text-xs font-medium">
            <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
              Actionable Suggestions (+8% Available)
            </div>
            <div className="flex items-center justify-between text-slate-700">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Store Profile & Location Pinned
              </span>
              <span className="text-[10px] text-slate-400 font-bold">Done</span>
            </div>
            <div className="flex items-center justify-between text-slate-700">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Summer Lookbook Collection
              </span>
              <span className="text-[10px] text-slate-400 font-bold">Done</span>
            </div>
            <div className="flex items-center justify-between text-slate-800 font-bold bg-slate-50 p-2 rounded-xl border border-slate-100">
              <span className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" /> Upload 2 Store Gallery Photos
              </span>
              <span className="text-[10px] text-amber-600 bg-amber-100 px-2 py-0.5 rounded-md">+4% Score</span>
            </div>
            <div className="flex items-center justify-between text-slate-800 font-bold bg-slate-50 p-2 rounded-xl border border-slate-100">
              <span className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-indigo-500 shrink-0" /> Create Festive Coupon
              </span>
              <span className="text-[10px] text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-md">+4% Score</span>
            </div>
          </div>
        </div>

        {/* 8 Stat Cards Grid (2-col on small, 4-col on large inside container) */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, idx) => {
            const IconComp = s.icon;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-white p-5 rounded-3xl border border-[#ECECEC] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {s.title}
                  </span>
                  <div className="h-9 w-9 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0 border border-indigo-100 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <IconComp className="w-4 h-4" />
                  </div>
                </div>

                <div className="mt-4 space-y-1">
                  <div className="text-2xl font-heading font-black text-slate-900 tracking-tight">
                    {s.value}
                  </div>
                  <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full inline-block">
                    {s.change}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 3. Top Performing Collection Spotlight & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Performing Collection */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-[#ECECEC] shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-heading font-bold text-slate-900">Top Performing Lookbook</h2>
              <p className="text-xs text-slate-400 font-medium">Most viewed customer collection this month</p>
            </div>
            <Link
              href="/vendor/collections"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-center gap-5">
            <div className="h-28 w-full sm:w-36 rounded-2xl overflow-hidden shrink-0 relative bg-slate-200">
              {/* Collection Image */}
              <img
                src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80"
                alt="Summer Linen 2026"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 bg-indigo-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs">
                Featured
              </span>
            </div>

            <div className="flex-1 space-y-3 w-full">
              <div>
                <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider">Men's Apparel</span>
                <h3 className="text-base font-heading font-bold text-slate-900 leading-tight">
                  Summer Linen Essentials 2026
                </h3>
                <p className="text-xs text-slate-500 font-medium line-clamp-1 mt-0.5">
                  Lightweight breathable pure linen shirts & trousers for summer walk-ins.
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 pt-1">
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-indigo-600" />
                  <span>1,240 Store Views</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-emerald-500" />
                  <span>28 WhatsApp Inquiries</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="bg-white p-6 rounded-3xl border border-[#ECECEC] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-heading font-bold text-slate-900">Quick Actions</h2>
            <span className="text-[10px] font-bold text-slate-400">⌘K Command</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((act) => {
              const IconComponent = act.icon;
              return (
                <Link
                  key={act.title}
                  href={act.href}
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-150 hover:border-indigo-200 transition-all group flex flex-col justify-between space-y-2 cursor-pointer"
                >
                  <div className={`h-8 w-8 rounded-xl ${act.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-900 leading-tight">
                      {act.title}
                    </div>
                    <div className="text-[9px] text-slate-400 font-medium line-clamp-1 mt-0.5">
                      {act.desc}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Activity Timeline */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#ECECEC] shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-heading font-bold text-slate-900">Recent Customer Activity</h2>
            <p className="text-xs text-slate-400 font-medium">Real-time walk-in leads and store interactions</p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/60">
            Live Stream
          </span>
        </div>

        <div className="space-y-4">
          {activities.map((act, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-slate-100/60 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="h-9 w-9 rounded-xl bg-white text-indigo-600 border border-slate-200/60 flex items-center justify-center shrink-0 shadow-2xs font-bold text-xs">
                  ⚡
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">{act.text}</p>
                  <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-slate-400" /> {act.date}
                  </span>
                </div>
              </div>

              <span className="bg-indigo-50 text-indigo-700 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border border-indigo-100">
                {act.badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
