"use client";

import React, { useEffect, useState } from "react";
import StatsCard from "@/components/dashboard/StatsCard";
import AnalyticsCard from "@/components/dashboard/AnalyticsCard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Card, { CardHeader, CardBody } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import useDashboardStore from "@/store/dashboardStore";
import useVendorStore from "@/store/vendorStore";
import {
  Store,
  Clock,
  Eye,
  Users,
  CheckCircle2,
  XCircle,
  TrendingUp,
  MapPin,
  Building2,
  Phone,
  Mail,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const { adminStats, fetchAdminStats, loading: statsLoading } = useDashboardStore();
  const { vendors, fetchVendors, updateVendorStatus, loading: vendorsLoading } = useVendorStore();

  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchAdminStats();
    fetchVendors("Pending");
  }, [fetchAdminStats, fetchVendors]);

  const handleApprove = async (id) => {
    setProcessingId(id);
    try {
      await updateVendorStatus(id, "Approved");
      await fetchAdminStats();
    } catch (err) {
      console.error("Approve error:", err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    if (confirm("Are you sure you want to reject this merchant registration?")) {
      setProcessingId(id);
      try {
        await updateVendorStatus(id, "Rejected");
        await fetchAdminStats();
      } catch (err) {
        console.error("Reject error:", err);
      } finally {
        setProcessingId(null);
      }
    }
  };

  return (
    <div className="space-y-8 font-body pb-12">
      {/* 1. Header Section */}
      <DashboardHeader
        title="Administrative Command Center"
        description="Monitor system health, check listing request approvals, and manage merchant subscriptions."
        badge="Platform v2.4 Live"
      >
        <button
          type="button"
          onClick={() => {
            fetchAdminStats();
            fetchVendors("Pending");
          }}
          className="px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${statsLoading ? "animate-spin text-indigo-400" : ""}`} />
          <span>Refresh Analytics</span>
        </button>
      </DashboardHeader>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Total Registered Stores"
          value={statsLoading ? "..." : `${adminStats?.totalStores || 0}`}
          change={`${adminStats?.totalVendors || 0} Merchants`}
          changeType="increase"
          icon={Building2}
        />
        <StatsCard
          title="Pending Approvals"
          value={statsLoading ? "..." : `${adminStats?.pendingVendors || vendors?.length || 0}`}
          change="Requires Action"
          changeType={adminStats?.pendingVendors > 0 ? "decrease" : "neutral"}
          icon={Clock}
        />
        <StatsCard
          title="Platform Visits"
          value={statsLoading ? "..." : `${adminStats?.totalVisits || 0}`}
          change={`${adminStats?.totalStoreViews || 0} Store Views`}
          changeType="increase"
          icon={Eye}
        />
        <StatsCard
          title="Total Platform Users"
          value={statsLoading ? "..." : `${adminStats?.totalUsers || 0}`}
          change="Customer Accounts"
          changeType="increase"
          icon={Users}
        />
      </div>

      {/* 3. Analytics & Pending Approvals Queue Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Analytics Chart & Quick Telemetry */}
        <div className="lg:col-span-2 space-y-6">
          <AnalyticsCard
            title="Global Directory Traffic Trends"
            subtitle="Comparing click conversions and lookbook impressions on the platform."
          />

          {/* Quick Platform Telemetry Strip */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                Active Markets
              </span>
              <p className="text-base font-heading font-black text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-indigo-600" /> Namakkal & Salem
              </p>
              <p className="text-[11px] text-slate-500 font-medium">92% Store Coverage</p>
            </div>

            <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-slate-100 sm:pl-6 pt-3 sm:pt-0">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                Lead Conversion Rate
              </span>
              <p className="text-base font-heading font-black text-emerald-700 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" /> 18.4%
              </p>
              <p className="text-[11px] text-slate-500 font-medium">WhatsApp Direct Enquiries</p>
            </div>

            <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-slate-100 sm:pl-6 pt-3 sm:pt-0">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                Approval SLA
              </span>
              <p className="text-base font-heading font-black text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-600" /> &lt; 2 Hours
              </p>
              <p className="text-[11px] text-slate-500 font-medium">Merchant Onboarding Speed</p>
            </div>
          </div>
        </div>

        {/* Right Column: Pending Merchant Approvals Feed */}
        <div className="space-y-6">
          <Card className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Pending Merchant Queue
                </h3>
              </div>
              <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                {vendors?.length || 0} Pending
              </span>
            </CardHeader>

            <CardBody className="p-5 space-y-4">
              {vendorsLoading ? (
                <div className="flex flex-col items-center justify-center py-8 text-slate-400 space-y-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-indigo-600" />
                  <span className="text-xs font-semibold">Loading pending approvals...</span>
                </div>
              ) : vendors.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                  <p className="text-xs font-bold text-slate-800">All caught up!</p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    No pending merchant approval requests in the queue.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {vendors.map((vendor) => {
                    const isProcessing = processingId === vendor._id;

                    return (
                      <div
                        key={vendor._id}
                        className="p-4 border border-slate-200/80 rounded-2xl space-y-3 bg-slate-50/60 hover:border-indigo-200 transition-all"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="space-y-0.5 truncate">
                            <h4 className="font-bold text-slate-900 text-xs truncate">
                              {vendor.businessName || vendor.storeName || "New Merchant Store"}
                            </h4>
                            <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-indigo-600 shrink-0" />
                              {vendor.city || "Namakkal"}
                            </p>
                          </div>
                          <Badge variant="yellow" pill className="text-[9px] font-bold shrink-0">
                            Pending Review
                          </Badge>
                        </div>

                        {/* Merchant Details */}
                        <div className="pt-2 border-t border-slate-200/60 space-y-1 text-[11px] text-slate-600">
                          <p className="flex items-center gap-1.5 truncate">
                            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{vendor.ownerId?.email || vendor.email || "No email"}</span>
                          </p>
                          <p className="flex items-center gap-1.5 font-mono">
                            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{vendor.businessPhone || vendor.phone || "+91 Mobile"}</span>
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between gap-2 border-t border-slate-200/60 pt-2.5">
                          <Link
                            href={`/stores/${vendor.businessSlug || vendor.slug || vendor._id}`}
                            target="_blank"
                            className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center gap-0.5"
                          >
                            <span>Inspect</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() => handleReject(vendor._id)}
                              className="px-3 py-1.5 text-[10px] font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1"
                            >
                              <XCircle className="w-3 h-3" />
                              <span>Reject</span>
                            </button>
                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() => handleApprove(vendor._id)}
                              className="px-3.5 py-1.5 text-[10px] font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1"
                            >
                              {isProcessing ? (
                                <RefreshCw className="w-3 h-3 animate-spin" />
                              ) : (
                                <CheckCircle2 className="w-3 h-3" />
                              )}
                              <span>Approve</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}