"use client";

import React from "react";
import Link from "next/link";
import StatsCard from "../../components/dashboard/StatsCard";
import AnalyticsCard from "../../components/dashboard/AnalyticsCard";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import Card, { CardHeader, CardBody } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";

export default function VendorDashboard() {
  const storeViewsIcon = (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

  const collectionsIcon = (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );

  const offersIcon = (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  const subIcon = (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  );

  const activities = [
    { text: "Linen Summer Collection lookup was published.", date: "Today, 10:24 AM", badge: "Collection" },
    { text: "Monsoon flat 20% coupon was claimed by 18 users.", date: "Yesterday", badge: "Offer" },
    { text: "Store details were updated by admin approval.", date: "July 02, 2026", badge: "System" },
    { text: "Gold monthly subscription successfully renewed.", date: "June 28, 2026", badge: "Billing" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <DashboardHeader
        title="Urban Threads Boutique"
        description="Monitor store discovery stats, active lookbooks, and coupon walk-ins."
      >
        <Link href="/vendor/collections">
          <Button size="sm" variant="outline">
            Manage Lookbooks
          </Button>
        </Link>
        <Link href="/vendor/offers">
          <Button size="sm">
            Launch Coupon
          </Button>
        </Link>
      </DashboardHeader>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Store Views"
          value="1,480"
          change="+18.4%"
          changeType="increase"
          icon={storeViewsIcon}
        />
        <StatsCard
          title="Lookbooks"
          value="4 Active"
          change="Updated today"
          changeType="neutral"
          icon={collectionsIcon}
        />
        <StatsCard
          title="Offers Running"
          value="2 Active"
          change="35 claims"
          changeType="increase"
          icon={offersIcon}
        />
        <StatsCard
          title="Listing Tier"
          value="Gold Plan"
          change="Expires in 24 days"
          changeType="neutral"
          icon={subIcon}
        />
      </div>

      {/* Analytics chart and details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AnalyticsCard
            title="Discovery Performance"
            subtitle="Views and coupon claims tracked over the past 6 months."
          />
        </div>

        {/* Quick links & activities */}
        <div className="space-y-6">
          {/* Quick Actions Panel */}
          <Card className="bg-white">
            <CardHeader>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Quick Actions</h3>
            </CardHeader>
            <CardBody className="p-4 space-y-2">
              <Link
                href="/vendor/settings"
                className="w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 border border-gray-150 transition-colors"
              >
                <span>Edit Store Listing Details</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/vendor/profile"
                className="w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 border border-gray-150 transition-colors"
              >
                <span>Change Owner Account Details</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <a
                href="/stores/urban-threads-boutique"
                target="_blank"
                className="w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 border border-gray-150 transition-colors"
              >
                <span>Preview Store Profile</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </CardBody>
          </Card>

          {/* Activity Log */}
          <Card className="bg-white">
            <CardHeader>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Recent Activity</h3>
            </CardHeader>
            <CardBody className="p-4">
              <div className="flow-root">
                <ul className="-mb-8">
                  {activities.map((act, idx) => (
                    <li key={idx}>
                      <div className="relative pb-8">
                        {idx !== activities.length - 1 && (
                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-100" aria-hidden="true" />
                        )}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center ring-8 ring-white shrink-0">
                              <span className="text-[9px] font-bold">{act.badge[0]}</span>
                            </span>
                          </div>
                          <div className="flex-1 min-w-0 pt-1.5 flex justify-between gap-2.5">
                            <div>
                              <p className="text-xs text-gray-700 leading-normal">{act.text}</p>
                              <span className="text-[10px] text-gray-400">{act.date}</span>
                            </div>
                            <span className="shrink-0">
                              <Badge variant="gray" className="text-[9px] px-1.5 py-0">
                                {act.badge}
                              </Badge>
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
