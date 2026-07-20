"use client";

import React from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCard from "@/components/dashboard/StatsCard";
import AnalyticsCard from "@/components/dashboard/AnalyticsCard";
import {
  Users,
  Eye,
  MessageSquare,
  PhoneCall,
  MapPin,
  Clock,
  Calendar,
  Sparkles,
  TrendingUp,
  Award,
} from "lucide-react";

export default function VendorAnalytics() {
  const peakHours = [
    { time: "11:00 AM - 1:00 PM", level: "Medium", percentage: 55 },
    { time: "4:00 PM - 6:00 PM", level: "High", percentage: 82 },
    { time: "6:00 PM - 8:30 PM", level: "Peak Footfall 🔥", percentage: 98 },
  ];

  return (
    <div className="space-y-8 font-body pb-12">
      <DashboardHeader
        title="Customer Footfall & Lead Insights"
        description="Deep analysis into local shoppers viewing your store, clicking WhatsApp inquiries, requesting Google Maps directions, and peak visit hours."
        badge="Analytics"
      />

      {/* Stats Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Daily Footfall Views"
          value="142"
          change="+18% vs yesterday"
          changeType="increase"
          icon={Users}
        />
        <StatsCard
          title="Monthly Profile Views"
          value="2,840"
          change="+24% vs last month"
          changeType="increase"
          icon={Eye}
        />
        <StatsCard
          title="WhatsApp Enquiries"
          value="48"
          change="High Purchase Intent"
          changeType="increase"
          icon={MessageSquare}
        />
        <StatsCard
          title="Maps Directions Clicked"
          value="67"
          change="Store Navigation"
          changeType="increase"
          icon={MapPin}
        />
      </div>

      {/* Main Analytics Vector Chart & Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AnalyticsCard
            title="Discovery Traffic & Conversion Trends"
            subtitle="Comparing monthly store profile views against customer contact actions."
          />

          {/* Popular Collections & Offers Performance Card */}
          <div className="bg-white p-6 rounded-3xl border border-[#ECECEC] shadow-xs space-y-4">
            <h3 className="text-base font-heading font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" /> Top Performing Collections & Campaigns
            </h3>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider">Top Collection</span>
                  <h4 className="text-xs font-bold text-slate-900">Summer Linen Essentials 2026</h4>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black text-slate-900">1,240 Views</div>
                  <span className="text-[10px] text-teal-600 font-bold">28 WhatsApp Inquiries</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold text-teal-600 uppercase tracking-wider">Top Offer Coupon</span>
                  <h4 className="text-xs font-bold text-slate-900">Monsoon Festive Flat 20% Off (MONSOON20)</h4>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black text-slate-900">180 Claims</div>
                  <span className="text-[10px] text-indigo-600 font-bold">High Walk-in Rate</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar Insights */}
        <div className="space-y-6">
          {/* Peak Store Visit Hours */}
          <div className="bg-white p-6 rounded-3xl border border-[#ECECEC] shadow-xs space-y-4">
            <h3 className="text-base font-heading font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-teal-600" /> Peak Store Visit Hours
            </h3>
            <p className="text-xs text-slate-400 font-medium">When nearby shoppers look for your store</p>

            <div className="space-y-4 pt-2">
              {peakHours.map((ph) => (
                <div key={ph.time} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span>{ph.time}</span>
                    <span className={ph.percentage > 90 ? "text-indigo-600 font-extrabold" : "text-slate-500"}>
                      {ph.level}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        ph.percentage > 90 ? "bg-indigo-600" : "bg-teal-500"
                      }`}
                      style={{ width: `${ph.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Returning Visitors & Day Stats */}
          <div className="bg-white p-6 rounded-3xl border border-[#ECECEC] shadow-xs space-y-4">
            <h3 className="text-base font-heading font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" /> Customer Loyalty Stats
            </h3>

            <div className="space-y-3 text-xs font-semibold text-slate-600">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span>Returning Store Visitors</span>
                <span className="font-bold text-slate-900">42% Loyalty</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span>Most Popular Shopping Day</span>
                <span className="font-bold text-indigo-600">Saturday & Sunday</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Avg. Shopper Distance</span>
                <span className="font-bold text-emerald-600">Within 3.5 km radius</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
