"use client";

import React, { useEffect } from "react";
import useDashboardStore from "@/store/dashboardStore";

export default function AdminAnalyticsPage() {
  const { adminStats, fetchAdminStats, loading, error } = useDashboardStore();

  useEffect(() => {
    fetchAdminStats();
  }, [fetchAdminStats]);

  const metrics = [
    {
      title: "Total Registered Users",
      value: adminStats?.totalUsers ?? 0,
      icon: (
        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      bg: "bg-blue-50",
    },
    {
      title: "Total Merchants / Vendors",
      value: adminStats?.totalVendors ?? 0,
      icon: (
        <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      bg: "bg-purple-50",
    },
    {
      title: "Approved Stores",
      value: adminStats?.approvedVendors ?? 0,
      icon: (
        <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      ),
      bg: "bg-emerald-50",
    },
    {
      title: "Pending Approvals",
      value: adminStats?.pendingVendors ?? 0,
      icon: (
        <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Platform Analytics</h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Real-time platform traffic, storefront engagement, and lead distribution analytics.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : error ? (
        <div className="p-6 text-center text-red-500 font-semibold text-xs">{error}</div>
      ) : (
        <>
          {/* Key Metric Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((m) => (
              <div key={m.title} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
                <div className={`h-12 w-12 rounded-xl ${m.bg} flex items-center justify-center shrink-0`}>
                  {m.icon}
                </div>
                <div>
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{m.title}</div>
                  <div className="text-2xl font-extrabold text-gray-900 mt-0.5">{m.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Traffic Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-gray-900">Buyer Conversion Funnel</h2>
              <div className="space-y-3 text-xs font-semibold text-gray-600">
                <div className="flex justify-between items-center">
                  <span>Store Page Views</span>
                  <span className="font-mono text-gray-900">{adminStats?.totalStoreViews ?? 0}</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full w-full" />
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span>WhatsApp Enquiries</span>
                  <span className="font-mono text-gray-900">{adminStats?.totalWhatsappClicks ?? 0}</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full w-3/4" />
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span>Phone Calls Triggered</span>
                  <span className="font-mono text-gray-900">{adminStats?.totalPhoneClicks ?? 0}</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full w-1/2" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-gray-900">Local Navigation Leads</h2>
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="text-3xl font-extrabold text-gray-900">{adminStats?.totalMapsClicks ?? 0}</div>
                <div className="text-xs font-semibold text-gray-400 mt-1">
                  Google Maps Location Directions Triggered
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
