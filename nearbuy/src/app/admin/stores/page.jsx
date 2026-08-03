"use client";

import React, { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Card, { CardBody } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import useStoreStore from "@/store/storeStore";
import { toast } from "react-hot-toast";
import {
  Search,
  RefreshCw,
  Store as StoreIcon,
  MapPin,
  Clock,
  Eye,
  Power,
  Trash2,
  ExternalLink,
  Star,
  CheckCircle2,
  X,
  Phone,
  Mail,
  Navigation,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function AdminStores() {
  const { stores, fetchStores, updateStore, deleteStore, loading } =
    useStoreStore();
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("ALL");
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);

  useEffect(() => {
    fetchStores({ all: true });
  }, [fetchStores]);

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === "Inactive" ? "Active" : "Inactive";
    setActionLoadingId(id);
    try {
      await updateStore(id, {
        status: newStatus,
        isActive: newStatus === "Active",
      });
      toast.success(`Store status set to ${newStatus}`);
      await fetchStores({ all: true });
      if (selectedStore && selectedStore._id === id) {
        setSelectedStore((prev) => ({
          ...prev,
          status: newStatus,
          isActive: newStatus === "Active",
        }));
      }
    } catch (err) {
      toast.error(err.message || "Failed to update store status");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleFeatured = async (id, currentFeatured) => {
    setActionLoadingId(id);
    try {
      await updateStore(id, { isFeatured: !currentFeatured });
      toast.success(
        !currentFeatured
          ? "Store pinned to Featured Directory!"
          : "Store removed from Featured."
      );
      await fetchStores({ all: true });
    } catch (err) {
      toast.error(err.message || "Failed to update featured state");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id, name) => {
    if (
      confirm(
        `Are you sure you want to permanently delete "${name || "this store"
        }" from the directory?`
      )
    ) {
      setActionLoadingId(id);
      try {
        await deleteStore(id);
        toast.success("Store deleted successfully.");
        await fetchStores({ all: true });
        if (selectedStore && selectedStore._id === id) {
          setSelectedStore(null);
        }
      } catch (err) {
        toast.error(err.message || "Failed to delete store");
      } finally {
        setActionLoadingId(null);
      }
    }
  };

  // Filter based on search query & city
  const filtered = (stores || []).filter((s) => {
    const query = search.toLowerCase();
    const nameMatch = (s.storeName || "").toLowerCase().includes(query);
    const cityMatch = (s.city || "").toLowerCase().includes(query);
    const addressMatch = (s.address || "").toLowerCase().includes(query);
    const matchesSearch = !search || nameMatch || cityMatch || addressMatch;

    const matchesCity =
      cityFilter === "ALL" ||
      (s.city || "").toUpperCase() === cityFilter.toUpperCase();

    return matchesSearch && matchesCity;
  });

  return (
    <div className="space-y-6 font-body pb-12">
      {/* 1. Header Section */}
      <DashboardHeader
        title="Directory Listings Management"
        description="Verify physical shop address coordinates, monitor operating status, and manage active outlet listings."
        badge={`${stores?.length || 0} Outlets Total`}
      >
        <button
          type="button"
          onClick={() => fetchStores({ all: true })}
          className="px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-2"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${loading ? "animate-spin text-indigo-400" : ""
              }`}
          />
          <span>Refresh Listings</span>
        </button>
      </DashboardHeader>

      {/* 2. Search & Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search stores by name, city, address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-slate-800"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 custom-scrollbar">
          {["ALL", "Namakkal", "Salem", "Erode", "Tirupur"].map((ct) => (
            <button
              key={ct}
              type="button"
              onClick={() => setCityFilter(ct)}
              className={`px-3.5 py-2 text-xs font-bold rounded-2xl transition-all cursor-pointer whitespace-nowrap ${cityFilter === ct
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/70"
                }`}
            >
              {ct}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Listings Table */}
      <Card className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <CardBody className="p-0 overflow-x-auto">
          {loading && !stores?.length ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
              <span className="text-xs font-bold text-slate-500">
                Loading store listings...
              </span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 p-6 space-y-3">
              <div className="h-12 w-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
                <StoreIcon className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-black text-slate-900 text-sm">
                No Store Listings Found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No outlet records match your active search terms or city filters.
              </p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-slate-100 text-xs font-medium text-slate-700">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4 text-left">Store Identity</th>
                  <th className="px-6 py-4 text-left">Location & Address</th>
                  <th className="px-6 py-4 text-left">Operating Hours</th>
                  <th className="px-6 py-4 text-left">Visibility & Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((store) => {
                  const storeId = store._id || store.id;
                  const isProcessing = actionLoadingId === storeId;
                  const isActive =
                    store.status === "Active" ||
                    store.isActive === true ||
                    !store.status;
                  const logoSrc =
                    store.logo ||
                    store.vendorId?.logo ||
                    store.coverImage;

                  return (
                    <tr
                      key={storeId}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      {/* Store Details */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-2xl bg-slate-100 border border-slate-200/80 overflow-hidden shrink-0 flex items-center justify-center font-black text-slate-400 text-xs uppercase shadow-2xs">
                            {logoSrc ? (
                              <img
                                src={logoSrc}
                                alt={store.storeName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span>{(store.storeName || "S").charAt(0)}</span>
                            )}
                          </div>
                          <div className="min-w-0 max-w-[200px]">
                            <button
                              type="button"
                              onClick={() => setSelectedStore(store)}
                              className="font-bold text-slate-900 text-xs hover:text-indigo-600 block truncate transition-colors text-left cursor-pointer"
                            >
                              {store.storeName || "Unnamed Store"}
                            </button>
                            <span className="text-[10px] text-slate-400 font-mono block truncate">
                              Slug: {store.slug || "N/A"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-6 py-4">
                        <div className="space-y-0.5 max-w-[220px]">
                          <p className="font-bold text-slate-800 text-[11px] flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            <span className="truncate">
                              {store.city || "Namakkal"}
                            </span>
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {store.address || "Main Street"}
                          </p>
                        </div>
                      </td>

                      {/* Operating Hours */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-slate-600 font-mono text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>
                            {store.openingTime || "09:30 AM"} -{" "}
                            {store.closingTime || "09:00 PM"}
                          </span>
                        </div>
                      </td>

                      {/* Status & Featured Badge */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={isActive ? "emerald" : "red"}
                            pill
                            className="text-[9px] font-bold"
                          >
                            {isActive ? "Active" : "Inactive"}
                          </Badge>

                          {store.isFeatured && (
                            <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                              <span>Featured</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Inspect Modal Trigger */}
                          <button
                            type="button"
                            onClick={() => setSelectedStore(store)}
                            title="Inspect Outlet Details"
                            className="p-1.5 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer border border-transparent hover:border-indigo-100"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Toggle Featured */}
                          <button
                            type="button"
                            disabled={isProcessing}
                            onClick={() =>
                              handleToggleFeatured(
                                storeId,
                                store.isFeatured
                              )
                            }
                            title={
                              store.isFeatured
                                ? "Unpin from Featured"
                                : "Pin as Featured Outlet"
                            }
                            className={`p-1.5 rounded-xl transition-all cursor-pointer border ${store.isFeatured
                                ? "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100"
                                : "text-slate-400 hover:text-amber-500 hover:bg-slate-100 border-transparent"
                              }`}
                          >
                            <Sparkles className="w-4 h-4" />
                          </button>

                          {/* Toggle Active/Inactive */}
                          <button
                            type="button"
                            disabled={isProcessing}
                            onClick={() =>
                              handleStatusChange(
                                storeId,
                                isActive ? "Active" : "Inactive"
                              )
                            }
                            title={
                              isActive
                                ? "Deactivate Outlet"
                                : "Activate Outlet"
                            }
                            className={`px-2.5 py-1.5 font-bold rounded-xl text-[10px] cursor-pointer shadow-2xs transition-all disabled:opacity-50 flex items-center gap-1 ${isActive
                                ? "bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200"
                                : "bg-emerald-600 hover:bg-emerald-500 text-white"
                              }`}
                          >
                            {isProcessing ? (
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : (
                              <Power className="w-3 h-3" />
                            )}
                            <span>{isActive ? "Deactivate" : "Activate"}</span>
                          </button>

                          {/* Delete Store */}
                          <button
                            type="button"
                            disabled={isProcessing}
                            onClick={() =>
                              handleDelete(storeId, store.storeName)
                            }
                            title="Delete Store Permanently"
                            className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 hover:border-rose-200 border border-transparent transition-all cursor-pointer disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>

      {/* 4. Store Inspection Drawer */}
      {selectedStore && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-end transition-opacity">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <StoreIcon className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-sm font-heading font-black text-slate-900">
                    Store Outlet Details
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedStore(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Outlet Cover & Header */}
              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-white border border-slate-200/80 overflow-hidden shrink-0 flex items-center justify-center font-black text-slate-500 text-sm">
                    {selectedStore.logo || selectedStore.coverImage ? (
                      <img
                        src={selectedStore.logo || selectedStore.coverImage}
                        alt="Logo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{(selectedStore.storeName || "S").charAt(0)}</span>
                    )}
                  </div>
                  <div className="truncate">
                    <h4 className="font-heading font-black text-slate-900 text-base truncate">
                      {selectedStore.storeName}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400 block truncate">
                      Slug: {selectedStore.slug || "N/A"}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {selectedStore.description ||
                    selectedStore.tagline ||
                    "No specific store description added."}
                </p>

                <div className="pt-1 flex items-center gap-2">
                  <Badge
                    variant={
                      selectedStore.status === "Active" ||
                        selectedStore.isActive
                        ? "emerald"
                        : "red"
                    }
                    pill
                    className="text-[10px] font-bold"
                  >
                    Status: {selectedStore.status || "Active"}
                  </Badge>

                  {selectedStore.isFeatured && (
                    <Badge variant="yellow" pill className="text-[10px] font-bold">
                      Featured Outlet
                    </Badge>
                  )}
                </div>
              </div>

              {/* Detail Key-Values */}
              <div className="space-y-3 text-xs text-slate-700">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400 font-medium">
                    City / Location
                  </span>
                  <span className="font-bold text-slate-900">
                    {selectedStore.city || "Namakkal"}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400 font-medium">Street Address</span>
                  <span className="font-medium text-slate-800 text-right max-w-[200px] truncate">
                    {selectedStore.address || "Main Road"}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400 font-medium">
                    Operating Schedule
                  </span>
                  <span className="font-mono text-slate-900">
                    {selectedStore.openingTime || "09:30 AM"} -{" "}
                    {selectedStore.closingTime || "09:00 PM"}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400 font-medium">
                    Phone Contact
                  </span>
                  <span className="font-mono text-slate-900">
                    {selectedStore.phone ||
                      selectedStore.vendorId?.phone ||
                      "N/A"}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400 font-medium">WhatsApp</span>
                  <span className="font-mono text-slate-900">
                    {selectedStore.whatsapp ||
                      selectedStore.vendorId?.whatsappNumber ||
                      "N/A"}
                  </span>
                </div>

                {/* Facilities Array */}
                {selectedStore.facilities &&
                  selectedStore.facilities.length > 0 && (
                    <div className="pt-2 space-y-1.5">
                      <span className="text-slate-400 font-medium block">
                        Amenities & Facilities
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {selectedStore.facilities.map((fac, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-md font-semibold"
                          >
                            {fac}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <Link
                href={`/stores/${selectedStore.slug || selectedStore._id}`}
                target="_blank"
                className="w-full py-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>View Public Storefront</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}