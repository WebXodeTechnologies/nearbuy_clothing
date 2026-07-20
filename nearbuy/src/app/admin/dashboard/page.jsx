"use client";

import React, { useEffect } from "react";
import StatsCard from "@/components/dashboard/StatsCard";
import AnalyticsCard from "@/components/dashboard/AnalyticsCard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Card, { CardHeader, CardBody } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import useDashboardStore from "@/store/dashboardStore";
import useVendorStore from "@/store/vendorStore";

export default function AdminDashboard() {
  const { adminStats, fetchAdminStats, loading: statsLoading } = useDashboardStore();
  const { vendors, fetchVendors, updateVendorStatus, loading: vendorsLoading } = useVendorStore();

  useEffect(() => {
    fetchAdminStats();
    fetchVendors("Pending");
  }, [fetchAdminStats, fetchVendors]);

  const handleApprove = async (id) => {
    await updateVendorStatus(id, "Approved");
    fetchAdminStats();
  };

  const handleReject = async (id) => {
    if (confirm("Are you sure you want to reject this vendor registration?")) {
      await updateVendorStatus(id, "Rejected");
      fetchAdminStats();
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
          value={statsLoading ? "..." : `${adminStats?.totalStores || 0} Stores`}
          change={`${adminStats?.totalVendors || 0} Vendors`}
          changeType="increase"
          icon={(props) => (
            <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          )}
        />
        <StatsCard
          title="Pending Approvals"
          value={statsLoading ? "..." : `${adminStats?.pendingVendors || 0} Requests`}
          change="Requires action"
          changeType={adminStats?.pendingVendors > 0 ? "decrease" : "neutral"}
          icon={(props) => (
            <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
        />
        <StatsCard
          title="Platform Visits"
          value={statsLoading ? "..." : `${adminStats?.totalVisits || 0} Visits`}
          change={`${adminStats?.totalStoreViews || 0} Store Views`}
          changeType="increase"
          icon={(props) => (
            <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        />
        <StatsCard
          title="Total Users"
          value={statsLoading ? "..." : `${adminStats?.totalUsers || 0} Registered`}
          change="Platform Accounts"
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

        <div className="space-y-6">
          <Card className="bg-white">
            <CardHeader>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Pending Merchant Approvals</h3>
            </CardHeader>
            <CardBody className="p-4 space-y-4">
              {vendorsLoading ? (
                <p className="text-xs text-gray-400 py-4 text-center">Loading pending queue...</p>
              ) : vendors.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-4">No pending applications. Clear queue!</p>
              ) : (
                <div className="space-y-3">
                  {vendors.map((vendor) => (
                    <div key={vendor._id} className="p-3 border border-gray-150 rounded-xl space-y-2.5 bg-gray-50/50">
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-gray-900 text-xs truncate max-w-[150px]">{vendor.businessName}</span>
                          <Badge variant="blue" className="text-[9px] px-1 py-0">{vendor.status}</Badge>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-0.5">By {vendor.ownerId?.name || vendor.email || "Vendor"}</p>
                      </div>
                      <div className="flex justify-end gap-1.5 border-t border-gray-100 pt-2">
                        <button
                          onClick={() => handleReject(vendor._id)}
                          className="px-2.5 py-1 text-[9px] font-bold text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleApprove(vendor._id)}
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
