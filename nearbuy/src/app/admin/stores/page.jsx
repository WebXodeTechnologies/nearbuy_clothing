"use client";

import React, { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Card, { CardBody } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import useStoreStore from "@/store/storeStore";
import { toast } from "react-hot-toast";

export default function AdminStores() {
  const { stores, fetchStores, updateStore, deleteStore, loading } = useStoreStore();
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchStores({ all: true });
  }, [fetchStores]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateStore(id, { status: newStatus });
      toast.success("Store status updated!");
      fetchStores({ all: true });
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to permanently delete this store from the platform directory?")) {
      try {
        await deleteStore(id);
        fetchStores({ all: true });
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  // Filter based on search query
  const filtered = stores.filter((s) =>
    (s.storeName || "").toLowerCase().includes(search.toLowerCase()) ||
    (s.city || "").toLowerCase().includes(search.toLowerCase()) ||
    (s.address || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Directory Listings Management"
        description="Verify physical shop address coordinates, monitor operating status, and manage clothing outlets."
      />

      {/* Filter toolbar */}
      <div className="bg-white border border-gray-150 p-4 rounded-xl shadow-xs">
        <div className="max-w-md">
          <Input
            name="search"
            placeholder="Search stores by title, address, city..."
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

      {/* Listings Table */}
      <Card className="bg-white">
        <CardBody className="p-0 overflow-x-auto">
          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xs font-semibold text-gray-500">No store listings found matching search criteria.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-150 text-xs">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Store details</th>
                  <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Visibility</th>
                  <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150">
                {filtered.map((store) => (
                  <tr key={store._id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={store.vendorId?.logo || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=100&q=80"}
                          alt="Logo"
                          className="h-9 w-9 rounded-lg border object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-semibold text-gray-900 block truncate">{store.storeName}</span>
                          <span className="text-[10px] text-gray-400 font-semibold block">{store.openingTime} - {store.closingTime}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-semibold">{store.address}, {store.city}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-800">Hyperlocal Search Pinned</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          store.status === "Active" || !store.status
                            ? "success"
                            : "danger"
                        }
                        pill
                      >
                        {store.status || "Active"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2.5">
                        {store.status === "Inactive" ? (
                          <button
                            onClick={() => handleStatusChange(store._id, "Active")}
                            className="text-[11px] font-bold text-emerald-600 hover:text-emerald-800 cursor-pointer"
                          >
                            Activate
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(store._id, "Inactive")}
                            className="text-[11px] font-bold text-amber-600 hover:text-amber-800 cursor-pointer"
                          >
                            Deactivate
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(store._id)}
                          className="text-[11px] font-bold text-red-600 hover:text-red-800 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
