"use client";

import React, { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { toast } from "react-hot-toast";
import {
  Bell,
  CheckCircle2,
  Tag,
  CreditCard,
  Sparkles,
  Info,
  Clock,
} from "lucide-react";

export default function VendorNotifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "approval",
      title: "Store Profile Approved",
      message: "Your store 'Urban Threads Boutique' in Bandra West is now live on Nearbuy local search.",
      date: "10 mins ago",
      unread: true,
    },
    {
      id: 2,
      type: "offer",
      title: "Monsoon Flat 20% Offer Approved",
      message: "Your campaign MONSOON20 is active and featured on the nearby deals section.",
      date: "2 hours ago",
      unread: true,
    },
    {
      id: 3,
      type: "billing",
      title: "Subscription Renewal Notice",
      message: "Your Gold Pro Plan will renew on August 15, 2026. Auto-pay is enabled.",
      date: "Yesterday",
      unread: false,
    },
    {
      id: 4,
      type: "announcement",
      title: "New Feature: Customer WhatsApp Leads",
      message: "Shoppers can now message your store directly from your collection lookbooks.",
      date: "July 12, 2026",
      unread: false,
    },
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
    toast.success("All notifications marked as read.");
  };

  return (
    <div className="space-y-8 font-body pb-12">
      <DashboardHeader
        title="Store Notifications & System Alerts"
        description="Timeline stream of store approvals, offer campaign activations, subscription notices, and platform updates."
        badge="Notifications"
      >
        <button
          onClick={markAllRead}
          className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-bold transition-all border border-slate-200/60 cursor-pointer"
        >
          Mark All as Read
        </button>
      </DashboardHeader>

      {/* Timeline List */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#ECECEC] shadow-xs space-y-6">
        <div className="flow-root">
          <ul className="-mb-8">
            {notifications.map((n, idx) => (
              <li key={n.id}>
                <div className="relative pb-8">
                  {idx !== notifications.length - 1 && (
                    <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-slate-100" aria-hidden="true" />
                  )}
                  <div className="relative flex space-x-4">
                    <div>
                      <span
                        className={`h-10 w-10 rounded-2xl flex items-center justify-center ring-8 ring-white shrink-0 ${
                          n.unread
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {n.type === "approval" && <CheckCircle2 className="w-5 h-5" />}
                        {n.type === "offer" && <Tag className="w-5 h-5" />}
                        {n.type === "billing" && <CreditCard className="w-5 h-5" />}
                        {n.type === "announcement" && <Sparkles className="w-5 h-5" />}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0 pt-1.5 flex justify-between gap-4 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                          {n.unread && (
                            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                          )}
                        </div>
                        <p className="text-xs text-slate-600 font-medium leading-relaxed">{n.message}</p>
                        <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 pt-1">
                          <Clock className="w-3 h-3 text-slate-400" /> {n.date}
                        </span>
                      </div>

                      <span className="shrink-0">
                        <span className="bg-indigo-50 text-indigo-700 text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full border border-indigo-100">
                          {n.type}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
