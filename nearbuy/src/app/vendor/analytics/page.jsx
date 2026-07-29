"use client";

import React, { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCard from "@/components/dashboard/StatsCard";
import { useAuth } from "@/context/AuthContext";
import {
  Users,
  Eye,
  MessageSquare,
  PhoneCall,
  MapPin,
  Clock,
  Calendar,
  Award,
  Zap,
  ShieldCheck,
} from "lucide-react";

export default function VendorAnalytics() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("30days");
  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({
    dailyViews: 0,
    monthlyViews: 0,
    whatsappEnquiries: 0,
    phoneClicks: 0,
    mapDirections: 0,
    topCollection: "Loading your top collection...",
    topCollectionViews: 0,
    topCollectionLeads: 0,
    topOffer: "Loading active campaign...",
    topOfferCode: "---",
    topOfferClaims: 0,
  });

  useEffect(() => {
    const fetchYourStoreAnalytics = async () => {
      if (!user?.vendorId) return;
      setLoading(true);
      try {
        const res = await fetch(
          `/api/analytics/vendor?vendor=${user.vendorId}&range=${timeRange}`
        );
        const data = await res.json();
        if (res.ok && data.data) {
          setAnalyticsData(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch store analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchYourStoreAnalytics();
  }, [user, timeRange]);

  const peakHours = [
    { time: "11:00 AM - 1:00 PM", level: "Moderate Traffic", percentage: 55, color: "bg-amber-500" },
    { time: "4:00 PM - 6:00 PM", level: "High Traffic", percentage: 82, color: "bg-indigo-600" },
    { time: "6:00 PM - 8:30 PM", level: "Peak Evening Footfall 🔥", percentage: 98, color: "bg-emerald-600" },
  ];

  return (
    <div className="space-y-8 font-body pb-12">
      {/* Header with Subscription Badge */}
      <DashboardHeader
        title="Your Store Performance & Customer Insights"
        description="Exclusive analytics for your shop. Monitor local shoppers viewing your sarees, asking for WhatsApp quotes, and requesting Google Maps directions."
        badge="Your Store Analytics"
      >
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-2xl text-xs font-black">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Verified Subscriber Profile</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            {[
              { key: "7days", label: "7 Days" },
              { key: "30days", label: "30 Days" },
              { key: "thisMonth", label: "This Month" },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setTimeRange(item.key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${timeRange === item.key
                  ? "bg-white text-indigo-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </DashboardHeader>

      {/* Your Store KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Your Daily Store Views"
          value={loading ? "..." : (analyticsData.dailyViews || 0).toLocaleString("en-IN")}
          change="+18% vs yesterday"
          changeType="increase"
          icon={Users}
        />
        <StatsCard
          title="Total Monthly Lookbook Views"
          value={loading ? "..." : (analyticsData.monthlyViews || 0).toLocaleString("en-IN")}
          change="+24% vs last month"
          changeType="increase"
          icon={Eye}
        />
        <StatsCard
          title="Direct WhatsApp Enquiries"
          value={loading ? "..." : (analyticsData.whatsappEnquiries || 0).toString()}
          change="High Purchase Intent"
          changeType="increase"
          icon={MessageSquare}
        />
        <StatsCard
          title="Google Maps Directions Clicked"
          value={loading ? "..." : (analyticsData.mapDirections || 0).toString()}
          change="Physical Store Navigation"
          changeType="increase"
          icon={MapPin}
        />
      </div>

      {/* Main Analytics Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-lg space-y-4 border border-indigo-900/50">
            <div className="flex items-center justify-between">
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-full flex items-center gap-1">
                <Zap className="w-3 h-3 fill-slate-950" /> Direct Customer Enquiries
              </span>
              <span className="text-xs font-bold text-emerald-400">
                100% Private Store Data
              </span>
            </div>

            <div>
              <h3 className="text-lg font-heading font-black text-white">
                {(analyticsData.whatsappEnquiries || 0) + (analyticsData.phoneClicks || 0)} Direct Local Buyers Contacted Your Shop!
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-xl">
                These are verified customers clicking directly to message your WhatsApp or call your shop counter. Uploading fresh design albums increases your weekly enquiry rate.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold border-t border-slate-800">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <MessageSquare className="w-4 h-4" />
                <span>{analyticsData.whatsappEnquiries || 0} Price & Color Enquiries</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-300">
                <PhoneCall className="w-4 h-4" />
                <span>{analyticsData.phoneClicks || 0} Phone Calls to Counter</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
            <h3 className="text-base font-heading font-black text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              <span>Your Store&apos;s Most Popular Items</span>
            </h3>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                    🏆 Your #1 Viewed Album
                  </span>
                  <h4 className="text-sm font-black text-slate-900">
                    {analyticsData.topCollection}
                  </h4>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <div className="text-xs font-black text-slate-900">
                    {(analyticsData.topCollectionViews || 0).toLocaleString("en-IN")} Customer Views
                  </div>
                  <span className="text-[11px] text-emerald-600 font-bold">
                    💬 {analyticsData.topCollectionLeads || 0} WhatsApp Messages
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                    🏷️ Your Top Coupon Campaign
                  </span>
                  <h4 className="text-sm font-black text-slate-900">
                    {analyticsData.topOffer} ({analyticsData.topOfferCode})
                  </h4>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <div className="text-xs font-black text-slate-900">
                    {analyticsData.topOfferClaims || 0} Coupon Claims
                  </div>
                  <span className="text-[11px] text-indigo-600 font-bold">
                    🔥 Driving Counter Walk-ins
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-heading font-black text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-teal-600" />
              <span>When Buyers Search Your Shop</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Peak hours when nearby shoppers search for your store location
            </p>

            <div className="space-y-4 pt-1">
              {peakHours.map((ph) => (
                <div key={ph.time} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span>{ph.time}</span>
                    <span
                      className={
                        ph.percentage > 90
                          ? "text-indigo-600 font-extrabold"
                          : "text-slate-500"
                      }
                    >
                      {ph.level}
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${ph.color}`}
                      style={{ width: `${ph.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-heading font-black text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <span>Your Shopper Audience Profile</span>
            </h3>

            <div className="space-y-3.5 text-xs font-semibold text-slate-600">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <span>Repeat Profile Visitors</span>
                <span className="font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-xl">
                  42% Repeat
                </span>
              </div>
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <span>Peak Traffic Days</span>
                <span className="font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-xl">
                  Saturday & Sunday
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Buyer Radius Distance</span>
                <span className="font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl">
                  Within 3.5 km
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}