"use client";

import React, { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Card, { CardBody } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import { stores } from "@/data/dummy-data";

export default function AdminStores() {
  const [storeList, setStoreList] = useState(stores);
  const [search, setSearch] = useState("");

  const handleStatusChange = (id, newStatus) => {
    setStoreList(
      storeList.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
  };

  const handleEdit = (store) => {
    alert(`Editing details for ${store.name} (Simulated)`);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to permanently delete this store from the platform directory?")) {
      setStoreList(storeList.filter((s) => s.id !== id));
    }
  };

  // Filter based on search query
  const filtered = storeList.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.location.toLowerCase().includes(search.toLowerCase())
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
            placeholder="Search stores by title, address, tags..."
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
          <table className="min-w-full divide-y divide-gray-150 text-xs">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Store details</th>
                <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150">
              {filtered.map((store) => (
                <tr key={store.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={store.logo} alt="Logo" className="h-9 w-9 rounded-lg border object-cover shrink-0" />
                      <div className="min-w-0">
                        <span className="font-semibold text-gray-900 block truncate">{store.name}</span>
                        <span className="text-[10px] text-gray-400 font-semibold block">{store.hours}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-semibold">{store.location}</td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-800">{store.rating} ★</span>
                    <span className="text-gray-400 block text-[10px]">{store.reviewsCount} reviews</span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={
                        store.status === "Active" || !store.status
                          ? "success"
                          : store.status === "Pending"
                          ? "warning"
                          : "danger"
                      }
                      pill
                    >
                      {store.status || "Active"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2.5">
                      {store.status === "Suspended" ? (
                        <button
                          onClick={() => handleStatusChange(store.id, "Active")}
                          className="text-[11px] font-bold text-emerald-600 hover:text-emerald-800"
                        >
                          Unsuspend
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusChange(store.id, "Suspended")}
                          className="text-[11px] font-bold text-amber-600 hover:text-amber-800"
                        >
                          Suspend
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(store)}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(store.id)}
                        className="text-[11px] font-bold text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}
