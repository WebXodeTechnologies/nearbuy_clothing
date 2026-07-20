"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
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
  User,
  X,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export default function CommandPalette({ isOpen, onClose }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onClose(!isOpen);
      }
      if (e.key === "Escape" && isOpen) {
        onClose(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const actions = [
    { title: "View Dashboard Overview", category: "Navigation", href: "/vendor/dashboard", icon: LayoutDashboard },
    { title: "Manage Personal Profile & Owner Details (CRUD)", category: "Account Profile", href: "/vendor/profile", icon: User },
    { title: "Update Physical Store Profile & Location", category: "Store Listing", href: "/vendor/store", icon: Store },
    { title: "Upload New Seasonal Lookbook Collection", category: "Collections", href: "/vendor/collections", icon: FolderOpen },
    { title: "Launch Promotional Campaign or Coupon", category: "Promotions", href: "/vendor/offers", icon: Tag },
    { title: "Browse Store Media & Image Gallery", category: "Media", href: "/vendor/gallery", icon: ImageIcon },
    { title: "View Customer Footfall & Lead Analytics", category: "Analytics", href: "/vendor/analytics", icon: BarChart3 },
    { title: "Upgrade Subscription Plan", category: "Billing", href: "/vendor/subscription", icon: CreditCard },
    { title: "View Public Store Listing", category: "Storefront", href: "/stores", icon: ExternalLink },
    { title: "Support & Help Desk", category: "Help", href: "/vendor/support", icon: HelpCircle },
    { title: "Account & Store Preferences", category: "Settings", href: "/vendor/settings", icon: Settings },
  ];

  const filtered = actions.filter(
    (a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (href) => {
    router.push(href);
    onClose(false);
    setQuery("");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-slate-950/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15 }}
          className="w-full max-w-xl bg-white rounded-3xl border border-slate-200/80 shadow-2xl overflow-hidden"
        >
          {/* Search Input Bar */}
          <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
            <Search className="w-5 h-5 text-indigo-600 shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="Type a command or search action... (e.g. Upload collection, Launch offer)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            <button
              onClick={() => onClose(false)}
              className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Results List */}
          <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-100/60">
            {filtered.length === 0 ? (
              <div className="py-12 text-center text-xs font-semibold text-slate-400">
                No commands found matching &quot;{query}&quot;
              </div>
            ) : (
              filtered.map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <div
                    key={idx}
                    onClick={() => handleSelect(item.href)}
                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-indigo-50/80 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-slate-100 text-slate-600 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-colors">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-900">
                          {item.title}
                        </div>
                        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                          {item.category}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-indigo-600 flex items-center gap-1">
                      Jump <Sparkles className="w-3 h-3" />
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Shortcuts */}
          <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-500">
            <span>Navigation Command Center</span>
            <div className="flex items-center gap-3">
              <span><kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono shadow-2xs">ESC</kbd> Close</span>
              <span><kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono shadow-2xs">↵</kbd> Select</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
