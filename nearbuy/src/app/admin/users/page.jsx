"use client";

import React, { useEffect, useState } from "react";
import useUserStore from "@/store/userStore";

export default function AdminUsersPage() {
  const { users, fetchUsers, loading, error } = useUserStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role?.toUpperCase() === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Users Management</h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Monitor and manage customer accounts, merchants, and platform administrators.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
            Total Users: {users.length}
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
          />
          <svg
            className="w-4 h-4 text-gray-400 absolute left-3 top-2.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {["ALL", "USER", "VENDOR", "ADMIN"].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                roleFilter === role
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Content Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-500 font-semibold text-xs">{error}</div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-xs font-semibold">
            No user accounts found matching your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">User Profile</th>
                  <th className="py-3.5 px-6">Email Address</th>
                  <th className="py-3.5 px-6">Role</th>
                  <th className="py-3.5 px-6">Joined Date</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-medium text-gray-700">
                {filteredUsers.map((u) => (
                  <tr key={u._id || u.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs border border-blue-200 uppercase">
                        {u.name ? u.name.charAt(0) : "U"}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{u.name || "Anonymous User"}</div>
                        <div className="text-[10px] text-gray-400 font-mono">{u._id || u.id}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-gray-600">{u.email}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          u.role === "ADMIN"
                            ? "bg-purple-100 text-purple-700 border border-purple-200"
                            : u.role === "VENDOR"
                            ? "bg-amber-100 text-amber-700 border border-amber-200"
                            : "bg-blue-100 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {u.role || "USER"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-500">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="text-blue-600 hover:text-blue-700 font-bold text-xs cursor-pointer">
                        Edit Role
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
