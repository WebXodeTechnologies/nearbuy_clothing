"use client";

import React, { useState } from "react";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import VendorCard from "../../components/cards/VendorCard";
import Input from "../../components/ui/Input";

const INITIAL_VENDORS = [
  {
    id: "vend-1",
    name: "Rohan Sen",
    email: "rohan@urbanthreads.com",
    storeName: "Urban Threads Boutique",
    date: "June 15, 2026",
    status: "Approved",
    plan: "Gold"
  },
  {
    id: "vend-2",
    name: "Priya Sharma",
    email: "priya@ethnicelegance.in",
    storeName: "Ethnic Elegance",
    date: "June 12, 2026",
    status: "Approved",
    plan: "Silver"
  },
  {
    id: "vend-3",
    name: "Vikram Malhotra",
    email: "vikram@voguestudio.com",
    storeName: "Vogue Studio",
    date: "June 28, 2026",
    status: "Pending",
    plan: "Gold"
  },
  {
    id: "vend-4",
    name: "Ananya Iyer",
    email: "ananya@kidszone.com",
    storeName: "Kids Zone outlet",
    date: "July 01, 2026",
    status: "Pending",
    plan: "Free"
  },
  {
    id: "vend-5",
    name: "Rajesh Kumar",
    email: "rajesh@footwearking.com",
    storeName: "Footwear King Emporium",
    date: "May 20, 2026",
    status: "Suspended",
    plan: "Free"
  }
];

export default function AdminVendors() {
  const [vendors, setVendors] = useState(INITIAL_VENDORS);
  const [search, setSearch] = useState("");

  const handleApprove = (id) => {
    setVendors(
      vendors.map((v) => (v.id === id ? { ...v, status: "Approved" } : v))
    );
  };

  const handleReject = (id) => {
    if (confirm("Are you sure you want to reject this vendor application?")) {
      setVendors(vendors.filter((v) => v.id !== id));
    }
  };

  const handleSuspend = (id) => {
    if (confirm("Are you sure you want to suspend this vendor account?")) {
      setVendors(
        vendors.map((v) => (v.id === id ? { ...v, status: "Suspended" } : v))
      );
    }
  };

  // Filter based on search query
  const filtered = vendors.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.email.toLowerCase().includes(search.toLowerCase()) ||
      v.storeName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Merchant Accounts Management"
        description="Verify vendor identities, approve storefront registration applications, and adjust subscription billing."
      />

      {/* Filter toolbar */}
      <div className="bg-white border border-gray-150 p-4 rounded-xl shadow-xs">
        <div className="max-w-md">
          <Input
            name="search"
            placeholder="Search merchants by owner name, store name, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={(props) => (
              <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          />
        </div>
      </div>

      {/* Vendor Cards Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-150 rounded-2xl max-w-xl mx-auto shadow-xs">
          <div className="h-12 w-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="font-bold text-gray-900 text-sm">No Merchants Found</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto leading-relaxed">
            We couldn't find any merchant accounts matching your search terms.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((vendor) => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              onApprove={handleApprove}
              onReject={handleReject}
              onSuspend={handleSuspend}
            />
          ))}
        </div>
      )}
    </div>
  );
}
