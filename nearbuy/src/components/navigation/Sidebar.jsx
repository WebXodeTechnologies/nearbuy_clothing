"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
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
  ChevronRight,
  User,
  ShieldCheck,
  Zap,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";

export default function Sidebar({ type = "vendor" }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const vendorMenu = [
    { label: "Dashboard", href: "/vendor/dashboard", icon: LayoutDashboard },
    { label: "My Profile", href: "/vendor/profile", icon: User },
    { label: "My Store", href: "/vendor/store", icon: Store },
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
    { label: "Media Library", href: "/vendor/gallery", icon: ImageIcon },
    { label: "Customer Insights", href: "/vendor/analytics", icon: BarChart3 },
    {
      label: "Subscription",
      href: "/vendor/subscription",
      icon: CreditCard,
      badge: "Pro",
    },
    {
      label: "Notifications",
      href: "/vendor/notifications",
      icon: Bell,
      unread: 3,
    },
    { label: "Support", href: "/vendor/support", icon: HelpCircle },
    { label: "Settings", href: "/vendor/settings", icon: Settings },
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
    <motion.aside
      animate={{ width: isCollapsed ? "80px" : "288px" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between shrink-0 h-screen sticky top-0 text-slate-300 z-30 select-none shadow-2xl"
    >
      <div className="flex flex-col h-[calc(100vh-85px)] overflow-hidden">

        {/* Brand Header */}
        <div className="h-20 flex items-center px-4 sm:px-5 border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md justify-between shrink-0">
          <Link href="/" className="flex items-center gap-3 group cursor-pointer overflow-hidden">
            <div className="relative w-10 h-10 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-500 p-0.5 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Image
                  src="/logos/nearbuy.png"
                  alt="Nearbuy Logo"
                  width={22}
                  height={22}
                  className="object-contain"
                  unoptimized
                />
              </div>
            </div>

            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col truncate"
              >
                <span className="text-base font-black tracking-tight text-white group-hover:text-blue-400 transition-colors">
                  Nearbuy
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {type === "admin" ? "Admin Portal" : "Vendor Hub"}
                </span>
              </motion.div>
            )}
          </Link>

          {/* Toggle Sidebar Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer border border-slate-800/60"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="px-3 py-5 space-y-1 overflow-y-auto flex-1 custom-scrollbar">
          {!isCollapsed && (
            <div className="px-3 mb-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Main Menu
            </div>
          )}

          {currentMenu.map((item) => {
            const IconComponent = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/vendor/dashboard" &&
                item.href !== "/admin/dashboard" &&
                pathname.startsWith(item.href));

            return (
              <Link key={item.href} href={item.href} className="block relative group">
                <div
                  className={`
                    flex items-center ${isCollapsed ? "justify-center" : "justify-between"} px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer relative overflow-hidden
                    ${isActive
                      ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-500/20"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/80"
                    }
                  `}
                >
                  <div className="flex items-center gap-3 relative z-10">
                    <IconComponent
                      className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 shrink-0 ${isActive ? "text-white" : "text-slate-400 group-hover:text-blue-400"
                        }`}
                    />
                    {!isCollapsed && (
                      <span className="tracking-tight truncate">{item.label}</span>
                    )}
                  </div>

                  {!isCollapsed && (
                    <div className="flex items-center gap-1.5 relative z-10">
                      {item.unread && (
                        <span className="bg-emerald-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-xs">
                          {item.unread}
                        </span>
                      )}
                      {item.badge && !item.unread && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition-colors ${isActive
                            ? "bg-white/20 text-white border border-white/30"
                            : "bg-slate-800 text-slate-400 border border-slate-700/50 group-hover:border-slate-600"
                            }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Active Indicator Glow */}
                  {isActive && (
                    <motion.div
                      layoutId="activeSideGlow"
                      className="absolute inset-0 bg-linear-to-r from-blue-500/30 to-indigo-500/10 pointer-events-none rounded-xl"
                    />
                  )}
                </div>

                {/* Tooltip for Collapsed Mode */}
                {isCollapsed && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-xl border border-slate-800 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className="p-3.5 border-t border-slate-800/80 bg-slate-900/60 space-y-3 shrink-0">

        {/* Subscription Banner (Only in Vendor & Expanded Mode) */}
        {type !== "admin" && !isCollapsed && (
          <div className="p-3 rounded-2xl bg-linear-to-br from-slate-900 via-slate-900 to-blue-950/40 border border-blue-500/20 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-500/20 shrink-0">
                <Zap className="w-4 h-4 text-blue-400 fill-blue-400/20" />
              </div>
              <div className="flex flex-col truncate">
                <span className="text-[11px] font-extrabold text-white">Pro Plan</span>
                <span className="text-[9px] text-slate-400">Renews in 18 days</span>
              </div>
            </div>
            <Link
              href="/vendor/subscription"
              className="text-[10px] font-extrabold text-blue-400 hover:text-blue-300 flex items-center gap-0.5 cursor-pointer bg-blue-500/10 hover:bg-blue-500/20 px-2 py-1 rounded-lg border border-blue-500/20 transition-colors"
            >
              <span>Plan</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        )}

        {/* User Session Profile Card */}
        <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"} pt-1`}>
          <div className="flex items-center gap-3 truncate">
            <div className="h-9 w-9 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-500 p-0.5 shadow-md shrink-0">
              <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center font-black text-white text-xs uppercase overflow-hidden">
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="User Avatar"
                    width={36}
                    height={36}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span>{session?.user?.name ? session.user.name.charAt(0) : "V"}</span>
                )}
              </div>
            </div>

            {!isCollapsed && (
              <div className="flex flex-col truncate max-w-32.5">
                <span className="font-extrabold text-white text-xs truncate">
                  {session?.user?.name || "Merchant Owner"}
                </span>
                <span className="text-[10px] text-slate-400 font-mono truncate">
                  {session?.user?.email || "vendor@nearbuy.com"}
                </span>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
              title="Log Out"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer border border-transparent hover:border-rose-500/20"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
}