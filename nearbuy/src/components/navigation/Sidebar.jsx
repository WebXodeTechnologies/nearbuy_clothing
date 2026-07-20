"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Store,
  FolderOpen,
  Tag,
  Image as ImageIcon,
  BarChart3,
  CreditCard,
  Bell,
  HelpCircle,
  Settings,
  LogOut,
  Sparkles,
  ChevronRight,
  User,
  ShieldCheck,
} from "lucide-react";

export default function Sidebar({ type = "vendor" }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const vendorMenu = [
    {
      label: "Dashboard",
      href: "/vendor/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "My Profile",
      href: "/vendor/profile",
      icon: User,
    },
    {
      label: "My Store",
      href: "/vendor/store",
      icon: Store,
    },
    {
      label: "Collections",
      href: "/vendor/collections",
      icon: FolderOpen,
      badge: "12 Items",
    },
    {
      label: "Promotions",
      href: "/vendor/offers",
      icon: Tag,
      badge: "2 Active",
    },
    {
      label: "Media Library",
      href: "/vendor/gallery",
      icon: ImageIcon,
    },
    {
      label: "Customer Insights",
      href: "/vendor/analytics",
      icon: BarChart3,
    },
    {
      label: "Subscription",
      href: "/vendor/subscription",
      icon: CreditCard,
      badge: "Pro Plan",
    },
    {
      label: "Notifications",
      href: "/vendor/notifications",
      icon: Bell,
      unread: 3,
    },
    {
      label: "Support",
      href: "/vendor/support",
      icon: HelpCircle,
    },
    {
      label: "Settings",
      href: "/vendor/settings",
      icon: Settings,
    },
  ];

  const adminMenu = [
    { label: "Dashboard Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Vendors & Approval", href: "/admin/vendors", icon: Store, badge: "Pending" },
    { label: "Store Directory", href: "/admin/stores", icon: FolderOpen },
    { label: "Categories Master", href: "/admin/categories", icon: Tag },
    { label: "Collections Lookbook", href: "/admin/collections", icon: FolderOpen },
    { label: "Offers & Coupons", href: "/admin/offers", icon: Tag },
    { label: "Banner Management", href: "/admin/banners", icon: ImageIcon },
    { label: "Homepage CMS", href: "/admin/cms", icon: LayoutDashboard },
    { label: "Users Directory", href: "/admin/users", icon: ShieldCheck },
    { label: "Payments & Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
    { label: "Platform Analytics", href: "/admin/analytics", icon: BarChart3 },
    { label: "System Settings", href: "/admin/settings", icon: Settings },
  ];

  const currentMenu = type === "admin" ? adminMenu : vendorMenu;

  return (
    <aside className="w-68 bg-[#0F172A] border-r border-slate-800/80 flex flex-col justify-between shrink-0 h-screen sticky top-0 text-slate-300 z-30 select-none shadow-2xl">
      <div>
        {/* Brand Header */}
        <div className="h-20 flex items-center px-6 border-b border-slate-800/80 bg-slate-950/60 justify-between">
          <Link href="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="h-10 w-10 rounded-2xl bg-linear-to-tr from-indigo-600 via-indigo-500 to-teal-400 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
              N
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-white text-base tracking-tight leading-tight flex items-center gap-1.5">
                Nearby <Sparkles className="w-3.5 h-3.5 text-teal-400 fill-teal-400/20" />
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                {type === "admin" ? "Admin Control" : "Merchant Portal"}
              </span>
            </div>
          </Link>

          {/* Store Active Pulse */}
          {type !== "admin" && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </div>
          )}
        </div>

        {/* Navigation Section */}
        <div className="px-4 py-6 space-y-1.5 overflow-y-auto max-h-[calc(100vh-210px)] scrollbar-none">
          <div className="px-3 mb-2 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
            Main Menu
          </div>

          {currentMenu.map((item) => {
            const IconComponent = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} href={item.href} className="block relative">
                <div
                  className={`
                    flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all duration-200 group cursor-pointer relative overflow-hidden
                    ${
                      isActive
                        ? "bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/30"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent
                      className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                        isActive ? "text-white" : "text-slate-400 group-hover:text-teal-400"
                      }`}
                    />
                    <span className="tracking-tight">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.unread && (
                      <span className="bg-teal-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-xs">
                        {item.unread}
                      </span>
                    )}
                    {item.badge && !item.unread && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                          isActive
                            ? "bg-indigo-500 text-white border border-indigo-400/40"
                            : "bg-slate-800/80 text-slate-300 border border-slate-700/60"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {isActive && (
                    <motion.div
                      layoutId="activeSideGlow"
                      className="absolute inset-0 bg-linear-to-r from-indigo-500/20 to-transparent pointer-events-none rounded-2xl"
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom User Card & Subscription Status */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/80 space-y-3">
        {type !== "admin" && (
          <div className="p-3 rounded-2xl bg-linear-to-br from-slate-900 to-indigo-950/60 border border-indigo-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs border border-teal-500/30">
                ⚡
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-extrabold text-white">Gold Pro Plan</span>
                <span className="text-[9px] text-slate-400">Renews in 18 days</span>
              </div>
            </div>
            <Link
              href="/vendor/subscription"
              className="text-[10px] font-bold text-teal-400 hover:text-teal-300 flex items-center gap-0.5 cursor-pointer"
            >
              Upgrade <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-linear-to-tr from-indigo-500 to-teal-400 p-0.5 shadow-md">
              <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center font-black text-white text-xs uppercase">
                {session?.user?.name ? session.user.name.charAt(0) : "V"}
              </div>
            </div>
            <div className="flex flex-col truncate max-w-[110px]">
              <span className="font-bold text-white text-xs truncate">
                {session?.user?.name || "Merchant Owner"}
              </span>
              <span className="text-[10px] text-slate-400 font-mono truncate">
                {session?.user?.email || "vendor@store.com"}
              </span>
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            title="Log Out"
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
