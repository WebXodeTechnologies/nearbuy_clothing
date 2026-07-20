"use client";

import React, { useState } from "react";
import StatsCard from "@/components/dashboard/StatsCard";
import AnalyticsCard from "@/components/dashboard/AnalyticsCard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Card, { CardHeader, CardBody } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export default function AdminDashboard() {
  const [pendingItems, setPendingItems] = useState([
    { id: "store-4", name: "Thread & Needle Boutique", vendor: "Rohan Sen", plan: "Silver Plan", date: "Today, 08:30 AM" },
    { id: "store-5", name: "Royal Footwear Emporium", vendor: "Aditi Rao", plan: "Gold Plan", date: "Yesterday" }
  ]);

  const handleApprove = (id) => {
    setPendingItems(pendingItems.filter((item) => item.id !== id));
    alert(`Store listing approved successfully! (Simulated)`);
  };

  const handleReject = (id) => {
    if (confirm("Are you sure you want to reject this store registration?")) {
      setPendingItems(pendingItems.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Administrative Command Center"
        description="Monitor system health, check listing request approvals, and manage merchant subscriptions."
      />

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Registered Stores"
          value="48 Listings"
          change="+4 this week"
          changeType="increase"
          icon={(props) => (
            <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          )}
        />
        <StatsCard
          title="Pending Approvals"
          value={`${pendingItems.length} Requests`}
          change="Urgent attention"
          changeType={pendingItems.length > 0 ? "decrease" : "neutral"}
          icon={(props) => (
            <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
        />
        <StatsCard
          title="Monthly Traffic Views"
          value="48.2K Hits"
          change="+12.5% vs May"
          changeType="increase"
          icon={(props) => (
            <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        />
        <StatsCard
          title="System Subscriptions"
          value="₹1.48 Lakhs"
          change="ARR Projected"
          changeType="increase"
          icon={(props) => (
            <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16c1.22 0 2.22-.665 2.22-1.5S13.22 13 12 13c-1.22 0-2.22-.665-2.22-1.5s1-1.5 2.22-1.5" />
            </svg>
          )}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AnalyticsCard
            title="Global Directory Traffic Trends"
            subtitle="Comparing click conversions and lookbook impressions on the platform."
          />
        </div>

        {/* Action center / Pending approvals */}
        <div className="space-y-6">
          {/* Quick Stats Summary */}
          <Card className="bg-white">
            <CardHeader>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Pending Approvals</h3>
            </CardHeader>
            <CardBody className="p-4 space-y-4">
              {pendingItems.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-4">All registrations approved. Clear queue!</p>
              ) : (
                <div className="space-y-3">
                  {pendingItems.map((item) => (
                    <div key={item.id} className="p-3 border border-gray-150 rounded-xl space-y-2.5 bg-gray-50/50">
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-gray-900 text-xs truncate max-w-[150px]">{item.name}</span>
                          <Badge variant="blue" className="text-[9px] px-1 py-0">{item.plan}</Badge>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-0.5">By {item.vendor} • {item.date}</p>
                      </div>
                      <div className="flex justify-end gap-1.5 border-t border-gray-100 pt-2">
                        <button
                          onClick={() => handleReject(item.id)}
                          className="px-2.5 py-1 text-[9px] font-bold text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleApprove(item.id)}
                          className="px-2.5 py-1 text-[9px] font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors cursor-pointer"
                        >
                          Approve
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
