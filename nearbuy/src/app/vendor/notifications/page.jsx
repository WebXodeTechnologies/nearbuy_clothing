/* eslint-disable react-hooks/purity */
"use client";

import React, { useEffect, useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import useNotificationStore from "@/store/useNotificationStore";
import {
  Bell,
  CheckCircle2,
  Tag,
  CreditCard,
  Sparkles,
  MessageSquare,
  Clock,
  CheckCheck,
  Filter,
} from "lucide-react";

export default function VendorNotifications() {
  const { notifications, loading, fetchNotifications, markAllRead, markSingleRead } =
    useNotificationStore();

  const [activeTab, setActiveTab] = useState("ALL");

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const getIcon = (type) => {
    switch (type?.toUpperCase()) {
      case "APPROVAL":
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case "OFFER":
        return <Tag className="w-5 h-5 text-amber-600" />;
      case "BILLING":
        return <CreditCard className="w-5 h-5 text-indigo-600" />;
      case "LEAD":
        return <MessageSquare className="w-5 h-5 text-teal-600" />;
      default:
        return <Sparkles className="w-5 h-5 text-sky-600" />;
    }
  };

  const getBadgeStyle = (type) => {
    switch (type?.toUpperCase()) {
      case "APPROVAL":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
      case "OFFER":
        return "bg-amber-50 text-amber-700 border-amber-200/60";
      case "BILLING":
        return "bg-indigo-50 text-indigo-700 border-indigo-200/60";
      case "LEAD":
        return "bg-teal-50 text-teal-700 border-teal-200/60";
      default:
        return "bg-sky-50 text-sky-700 border-sky-200/60";
    }
  };

  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === "UNREAD") return item.unread;
    if (activeTab === "LEADS") return item.type === "LEAD" || item.type === "OFFER";
    return true;
  });

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="space-y-8 font-body pb-12 max-w-6xl mx-auto">
      <DashboardHeader
        title="Store Notifications & System Alerts"
        description="Timeline stream of store approvals, offer campaign activations, subscription notices, and customer lead updates."
        badge="Notifications"
      >
        <button
          onClick={markAllRead}
          disabled={unreadCount === 0 || loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <CheckCheck className="w-4 h-4" />
          Mark All as Read
        </button>
      </DashboardHeader>

      {/* Tabs Filter Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          {[
            { id: "ALL", label: "All Updates" },
            { id: "UNREAD", label: `Unread (${unreadCount})` },
            { id: "LEADS", label: "Leads & Offers" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeTab === tab.id
                ? "bg-indigo-50 text-indigo-600 border border-indigo-200/80 shadow-2xs"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="text-xs text-slate-500 font-medium hidden sm:block">
          Showing {filteredNotifications.length} items
        </div>
      </div>

      {/* Main List Box */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold text-slate-500">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No Notifications</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You are all caught up! High-priority store alerts and lead activities will appear here.
            </p>
          </div>
        ) : (
          <div className="flow-root">
            <ul className="-mb-8">
              {filteredNotifications.map((n, idx) => (
                <li key={n._id || n.id}>
                  <div className="relative pb-8">
                    {idx !== filteredNotifications.length - 1 && (
                      <span
                        className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-slate-100"
                        aria-hidden="true"
                      />
                    )}
                    <div className="relative flex items-start space-x-4">
                      {/* Icon Indicator */}
                      <div className="shrink-0">
                        <span className="h-10 w-10 rounded-2xl flex items-center justify-center ring-8 ring-white bg-slate-50 border border-slate-200/60 shadow-2xs">
                          {getIcon(n.type)}
                        </span>
                      </div>

                      {/* Card Content */}
                      <div
                        onClick={() => n.unread && markSingleRead(n._id)}
                        className={`flex-1 min-w-0 p-4 md:p-5 rounded-2xl border transition-all cursor-pointer ${n.unread
                          ? "bg-indigo-50/40 border-indigo-100 hover:border-indigo-200 shadow-2xs"
                          : "bg-slate-50/50 border-slate-100 hover:bg-slate-50"
                          }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs md:text-sm font-bold text-slate-900">
                                {n.title}
                              </h4>
                              {n.unread && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500 text-white shadow-2xs">
                                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                  New
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 font-medium leading-relaxed">
                              {n.message}
                            </p>
                            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1 pt-2">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {new Date(n.createdAt || Date.now()).toLocaleDateString("en-IN", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>

                          <span className="shrink-0">
                            <span
                              className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full border ${getBadgeStyle(
                                n.type
                              )}`}
                            >
                              {n.type}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}