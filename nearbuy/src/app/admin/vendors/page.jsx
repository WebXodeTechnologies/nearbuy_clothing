"use client";

import React, { useEffect, useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Badge from "@/components/ui/Badge";
import useVendorStore from "@/store/vendorStore";
import {
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Eye,
  Mail,
  Phone,
  MapPin,
  Building2,
  X,
  Building,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AdminVendors() {
  const { vendors, fetchVendors, updateVendorStatus, loading, error } =
    useVendorStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const handleStatusChange = async (id, status, confirmationMessage) => {
    if (confirmationMessage && !confirm(confirmationMessage)) return;

    setActionLoadingId(id);
    try {
      await updateVendorStatus(id, status);
      if (
        selectedVendor &&
        (selectedVendor._id === id || selectedVendor.id === id)
      ) {
        setSelectedVendor((prev) => ({ ...prev, status }));
      }
    } catch (err) {
      console.error("Status update error:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const filtered = (vendors || []).filter((v) => {
    const query = search.toLowerCase();
    const nameMatch =
      v.businessName?.toLowerCase().includes(query) ||
      v.storeName?.toLowerCase().includes(query) ||
      v.ownerId?.name?.toLowerCase().includes(query);

    const emailMatch =
      v.email?.toLowerCase().includes(query) ||
      v.ownerId?.email?.toLowerCase().includes(query);

    const phoneMatch =
      v.businessPhone?.includes(search) ||
      v.phone?.includes(search) ||
      v.whatsappNumber?.includes(search) ||
      v.whatsapp?.includes(search);

    const matchesSearch = !search || nameMatch || emailMatch || phoneMatch;

    const matchesStatus =
      statusFilter === "ALL" ||
      v.status?.toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 font-body pb-12">
      {/* 1. Header Section */}
      <DashboardHeader
        title="Merchant Vendors Directory"
        description="Verify merchant applications, approve local storefront listings, and manage merchant operating permissions."
        badge={`${vendors?.length || 0} Total Registered`}
      >
        <button
          type="button"
          onClick={() => fetchVendors()}
          className="px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-2"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${loading ? "animate-spin text-indigo-400" : ""
              }`}
          />
          <span>Refresh Table</span>
        </button>
      </DashboardHeader>

      {/* 2. Search & Tab Filters Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search by name, email, or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-slate-800"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        {/* Status Tab Filter Group */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 custom-scrollbar">
          {["ALL", "Pending", "Approved", "Rejected", "Suspended"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-2 text-xs font-bold rounded-2xl transition-all cursor-pointer whitespace-nowrap ${statusFilter === st
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/70"
                }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Vendors Table Body */}
      {loading && !vendors?.length ? (
        <div className="py-16 flex flex-col items-center justify-center space-y-3 bg-white rounded-3xl border border-slate-200/80">
          <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
          <span className="text-xs font-bold text-slate-500">
            Loading merchant directory...
          </span>
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-rose-50 border border-rose-200 rounded-3xl text-rose-700 font-bold text-xs space-y-1">
          <p>Failed to load vendors</p>
          <p className="text-[11px] text-rose-500 font-normal">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200/80 rounded-3xl max-w-xl mx-auto shadow-xs space-y-3 p-6">
          <div className="h-12 w-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-black text-slate-900 text-sm">
            No Merchants Match Your Filter
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords or switching between status
            tabs.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Business Name</th>
                  <th className="py-4 px-6">Contact & Owner</th>
                  <th className="py-4 px-6">City & Location</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Registered On</th>
                  <th className="py-4 px-6 text-right">Approval Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {filtered.map((v) => {
                  const vendorId = v._id || v.id;
                  const isProcessing = actionLoadingId === vendorId;
                  const currentStatus = (v.status || "Pending").toUpperCase();
                  const businessTitle =
                    v.businessName || v.storeName || "Unnamed Business";

                  return (
                    <tr
                      key={vendorId}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      {/* Business Logo & Name */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-2xl bg-slate-100 border border-slate-200/80 overflow-hidden shrink-0 flex items-center justify-center font-black text-slate-400 text-xs uppercase shadow-2xs">
                            {v.logo ? (
                              <Image
                                src={v.logo}
                                alt={businessTitle}
                                fill
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span>{businessTitle.charAt(0)}</span>
                            )}
                          </div>
                          <div className="space-y-0.5 truncate max-w-45">
                            <button
                              type="button"
                              onClick={() => setSelectedVendor(v)}
                              className="font-bold text-slate-900 text-xs hover:text-indigo-600 text-left transition-colors cursor-pointer block truncate"
                            >
                              {businessTitle}
                            </button>
                            <p className="text-[10px] text-slate-400 font-mono truncate">
                              {v.businessSlug ||
                                v.slug ||
                                `ID: ${vendorId.substring(0, 8)}...`}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="py-4 px-6">
                        <div className="space-y-1 text-[11px]">
                          <p className="text-slate-800 font-medium flex items-center gap-1.5 truncate max-w-50">
                            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">
                              {v.email || v.ownerId?.email || "No email"}
                            </span>
                          </p>
                          <p className="text-slate-500 font-mono flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>
                              {v.phone ||
                                v.businessPhone ||
                                v.whatsappNumber ||
                                v.whatsapp ||
                                "No Phone"}
                            </span>
                          </p>
                        </div>
                      </td>

                      {/* City Location */}
                      <td className="py-4 px-6">
                        <div className="text-slate-700 text-[11px] flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span>{v.city || "Namakkal"}</span>
                        </div>
                      </td>

                      {/* Status Badges */}
                      <td className="py-4 px-6">
                        {currentStatus === "APPROVED" && (
                          <Badge
                            variant="emerald"
                            pill
                            className="text-[9px] font-bold"
                          >
                            Approved
                          </Badge>
                        )}
                        {currentStatus === "PENDING" && (
                          <Badge
                            variant="yellow"
                            pill
                            className="text-[9px] font-bold"
                          >
                            Pending Review
                          </Badge>
                        )}
                        {currentStatus === "REJECTED" && (
                          <Badge
                            variant="red"
                            pill
                            className="text-[9px] font-bold"
                          >
                            Rejected
                          </Badge>
                        )}
                        {currentStatus === "SUSPENDED" && (
                          <Badge
                            variant="gray"
                            pill
                            className="text-[9px] font-bold"
                          >
                            Suspended
                          </Badge>
                        )}
                      </td>

                      {/* Registration Date */}
                      <td className="py-4 px-6 text-slate-500 text-[11px] font-mono">
                        {v.createdAt
                          ? new Date(v.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedVendor(v)}
                            title="Inspect Details"
                            className="p-1.5 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer border border-transparent hover:border-indigo-100"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {currentStatus !== "APPROVED" && (
                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() =>
                                handleStatusChange(vendorId, "Approved")
                              }
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-[10px] cursor-pointer shadow-2xs transition-all disabled:opacity-50 flex items-center gap-1"
                            >
                              {isProcessing ? (
                                <RefreshCw className="w-3 h-3 animate-spin" />
                              ) : (
                                <CheckCircle2 className="w-3 h-3" />
                              )}
                              <span>Approve</span>
                            </button>
                          )}

                          {currentStatus !== "SUSPENDED" &&
                            currentStatus === "APPROVED" && (
                              <button
                                type="button"
                                disabled={isProcessing}
                                onClick={() =>
                                  handleStatusChange(
                                    vendorId,
                                    "Suspended",
                                    "Are you sure you want to suspend this merchant account?"
                                  )
                                }
                                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-[10px] cursor-pointer shadow-2xs transition-all disabled:opacity-50 flex items-center gap-1"
                              >
                                <AlertTriangle className="w-3 h-3" />
                                <span>Suspend</span>
                              </button>
                            )}

                          {currentStatus !== "REJECTED" && (
                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() =>
                                handleStatusChange(
                                  vendorId,
                                  "Rejected",
                                  "Are you sure you want to reject this merchant application?"
                                )
                              }
                              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-[10px] cursor-pointer shadow-2xs transition-all disabled:opacity-50 flex items-center gap-1"
                            >
                              <XCircle className="w-3 h-3" />
                              <span>Reject</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Merchant Inspection Drawer Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-end transition-opacity">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-sm font-heading font-black text-slate-900">
                    Merchant Inspection
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedVendor(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Store Identity Box */}
              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-white border border-slate-200/80 overflow-hidden shrink-0 flex items-center justify-center font-black text-slate-500 text-sm">
                    {selectedVendor.logo ? (
                      <Image
                        src={selectedVendor.logo}
                        alt="Logo"
                        fill
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>
                        {(
                          selectedVendor.businessName ||
                          selectedVendor.storeName ||
                          "V"
                        ).charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="truncate">
                    <h4 className="font-heading font-black text-slate-900 text-base truncate">
                      {selectedVendor.businessName || selectedVendor.storeName}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400 block truncate">
                      Slug:{" "}
                      {selectedVendor.businessSlug ||
                        selectedVendor.slug ||
                        "N/A"}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {selectedVendor.description ||
                    selectedVendor.bio ||
                    "No store description provided."}
                </p>

                <div className="pt-1 flex items-center gap-2">
                  <Badge variant="indigo" pill className="text-[10px] font-bold">
                    {selectedVendor.category ||
                      selectedVendor.businessType ||
                      "Clothing Store"}
                  </Badge>
                  <Badge variant="gray" pill className="text-[10px] font-bold">
                    Status: {selectedVendor.status || "Pending"}
                  </Badge>
                </div>
              </div>

              {/* Detailed Key-Value Grid */}
              <div className="space-y-3 text-xs text-slate-700">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400 font-medium">Owner Name</span>
                  <span className="font-bold text-slate-900">
                    {selectedVendor.ownerId?.name || "N/A"}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400 font-medium">Email Address</span>
                  <span className="font-mono text-slate-900">
                    {selectedVendor.email ||
                      selectedVendor.ownerId?.email ||
                      "N/A"}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400 font-medium">Phone / Mobile</span>
                  <span className="font-mono text-slate-900">
                    {selectedVendor.phone ||
                      selectedVendor.businessPhone ||
                      "N/A"}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400 font-medium">WhatsApp</span>
                  <span className="font-mono text-slate-900">
                    {selectedVendor.whatsappNumber ||
                      selectedVendor.whatsapp ||
                      "N/A"}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400 font-medium">City & Region</span>
                  <span className="font-bold text-slate-900">
                    {selectedVendor.city || "Namakkal"}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400 font-medium">Website</span>
                  <span className="font-mono text-indigo-600 truncate max-w-45">
                    {selectedVendor.website || "Not Provided"}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400 font-medium">GST Number</span>
                  <span className="font-mono text-slate-900">
                    {selectedVendor.gstNumber || "Not Provided"}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <Link
                href={`/stores/${selectedVendor.businessSlug ||
                  selectedVendor.slug ||
                  selectedVendor._id
                  }`}
                target="_blank"
                className="w-full py-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>View Live Storefront</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}