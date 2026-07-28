"use client";

import React, { useEffect, useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import useVendorStore from "@/store/vendorStore";

export default function AdminVendors() {
  const { vendors, fetchVendors, updateVendorStatus, loading, error } = useVendorStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const handleApprove = async (id) => {
    await updateVendorStatus(id, "Approved");
  };

  const handleReject = async (id) => {
    if (confirm("Are you sure you want to reject this vendor application?")) {
      await updateVendorStatus(id, "Rejected");
    }
  };

  const handleSuspend = async (id) => {
    if (confirm("Are you sure you want to suspend this vendor account?")) {
      await updateVendorStatus(id, "Suspended");
    }
  };

  const filtered = vendors.filter((v) => {
    const matchesSearch =
      v.businessName?.toLowerCase().includes(search.toLowerCase()) ||
      v.email?.toLowerCase().includes(search.toLowerCase()) ||
      v.phone?.includes(search);
    const matchesStatus = statusFilter === "ALL" || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Merchant Vendors Management"
        description="Verify vendor applications, approve storefront registrations, and manage merchant account statuses."
      />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search merchants by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {["ALL", "Pending", "Approved", "Rejected", "Suspended"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                statusFilter === st
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Vendors List */}
      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : error ? (
        <div className="p-6 text-center text-red-500 font-semibold text-xs">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl max-w-xl mx-auto shadow-xs">
          <div className="h-12 w-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="font-bold text-gray-900 text-sm">No Vendors Found</h3>
          <p className="text-xs text-gray-500 mt-1">No merchant records match your active search filters.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Business Name</th>
                  <th className="py-3.5 px-6">Contact Info</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Applied Date</th>
                  <th className="py-3.5 px-6 text-right">Approval Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-medium text-gray-700">
                {filtered.map((v) => (
                  <tr key={v._id || v.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-gray-900">{v.businessName || "Unnamed Business"}</div>
                      <div className="text-[10px] text-gray-400 font-mono">ID: {v._id || v.id}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-gray-900 font-mono">{v.email}</div>
                      <div className="text-gray-400 text-[11px]">{v.phone || "No phone"}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          v.status === "Approved"
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            : v.status === "Pending"
                            ? "bg-amber-100 text-amber-700 border border-amber-200"
                            : v.status === "Suspended"
                            ? "bg-red-100 text-red-700 border border-red-200"
                            : "bg-gray-100 text-gray-700 border border-gray-200"
                        }`}
                      >
                        {v.status || "Pending"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-500">
                      {v.createdAt ? new Date(v.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      {v.status !== "Approved" && (
                        <button
                          onClick={() => handleApprove(v._id || v.id)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] cursor-pointer transition-colors"
                        >
                          Approve
                        </button>
                      )}
                      {v.status !== "Suspended" && (
                        <button
                          onClick={() => handleSuspend(v._id || v.id)}
                          className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-[11px] cursor-pointer transition-colors"
                        >
                          Suspend
                        </button>
                      )}
                      <button
                        onClick={() => handleReject(v._id || v.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-[11px] cursor-pointer transition-colors"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
