"use client";

import React, { useEffect, useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import useUserStore from "@/store/userStore";
import { toast } from "react-hot-toast";
import {
  Search,
  RefreshCw,
  Users as UsersIcon,
  User as UserIcon,
  Mail,
  Eye,
  Edit3,
  Power,
  X,
  Building2,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function AdminUsersPage() {
  const { users, fetchUsers, loading, error } = useUserStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Inspection Drawer & Role Edit Modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newRole, setNewRole] = useState("USER");

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenRoleModal = (user) => {
    setEditingUser(user);
    setNewRole(user.role || "USER");
    setIsRoleModalOpen(true);
  };

  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    const userId = editingUser._id || editingUser.id;
    setActionLoadingId(userId);

    try {
      const res = await fetch(`/api/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update role");
      }

      toast.success(`Role updated to ${newRole}`);
      setIsRoleModalOpen(false);
      await fetchUsers();
      if (
        selectedUser &&
        (selectedUser._id === userId || selectedUser.id === userId)
      ) {
        setSelectedUser((prev) => ({ ...prev, role: newRole }));
      }
    } catch (err) {
      toast.error(err.message || "Failed to update user role");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleStatus = async (user) => {
    const userId = user._id || user.id;
    const currentActive = user.isActive !== false;
    const nextActive = !currentActive;

    setActionLoadingId(userId);
    try {
      const res = await fetch(`/api/users/${userId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: nextActive }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      toast.success(nextActive ? "Account activated" : "Account suspended");
      await fetchUsers();
    } catch (err) {
      toast.error(err.message || "Failed to update user status");
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredUsers = (users || []).filter((u) => {
    const query = searchQuery.toLowerCase();
    const nameMatch = (u.name || "").toLowerCase().includes(query);
    const emailMatch = (u.email || "").toLowerCase().includes(query);
    const matchesSearch = !searchQuery || nameMatch || emailMatch;

    const userRole = (u.role || "USER").toUpperCase();
    const matchesRole =
      roleFilter === "ALL" || userRole === roleFilter.toUpperCase();

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 font-body pb-12">
      {/* 1. Dashboard Header */}
      <DashboardHeader
        title="User & Customer Accounts"
        description="Monitor and manage customer accounts, boutique merchants, and platform administrators."
        badge={`${users?.length || 0} Registered Users`}
      >
        <button
          type="button"
          onClick={() => fetchUsers()}
          className="px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-2"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${loading ? "animate-spin text-indigo-400" : ""
              }`}
          />
          <span>Refresh Directory</span>
        </button>
      </DashboardHeader>

      {/* 2. Toolbar & Role Filter Pills */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-slate-800"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        {/* Role Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 custom-scrollbar">
          {["ALL", "USER", "VENDOR", "ADMIN"].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setRoleFilter(role)}
              className={`px-3.5 py-2 text-xs font-bold rounded-2xl transition-all cursor-pointer whitespace-nowrap ${roleFilter === role
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/70"
                }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Directory Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading && !users?.length ? (
          <div className="py-16 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
            <span className="text-xs font-bold text-slate-500">
              Loading user accounts directory...
            </span>
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-rose-50 border border-rose-200 rounded-3xl text-rose-700 font-bold text-xs space-y-1">
            <p>Failed to load user directory</p>
            <p className="text-[11px] text-rose-500 font-normal">{error}</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-16 p-6 space-y-3">
            <div className="h-12 w-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
              <UsersIcon className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-black text-slate-900 text-sm">
              No User Accounts Found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No user records match your active search terms or role filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">User Profile</th>
                  <th className="py-4 px-6">Email & Auth Provider</th>
                  <th className="py-4 px-6">Access Role</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Joined Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {filteredUsers.map((u) => {
                  const userId = u._id || u.id;
                  const isProcessing = actionLoadingId === userId;
                  const role = (u.role || "USER").toUpperCase();
                  const isActive = u.isActive !== false;

                  return (
                    <tr
                      key={userId}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      {/* Avatar & Name */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-700 font-black flex items-center justify-center text-xs uppercase shrink-0 shadow-2xs overflow-hidden">
                            {u.profileImage ? (
                              <img
                                src={u.profileImage}
                                alt={u.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span>{(u.name || "U").charAt(0)}</span>
                            )}
                          </div>
                          <div className="space-y-0.5 max-w-[180px]">
                            <button
                              type="button"
                              onClick={() => setSelectedUser(u)}
                              className="font-bold text-slate-900 text-xs hover:text-indigo-600 block truncate transition-colors text-left cursor-pointer"
                            >
                              {u.name || "Anonymous Shopper"}
                            </button>
                            <p className="text-[10px] text-slate-400 font-mono truncate">
                              ID: {userId.substring(0, 10)}...
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email Address & Auth Provider */}
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <span className="font-mono text-slate-800 text-[11px] flex items-center gap-1.5 truncate max-w-[200px]">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{u.email}</span>
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="text-[9px] font-mono text-slate-400 uppercase">
                              {u.provider || "credentials"}
                            </span>
                            {u.emailVerified && (
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-4 px-6">
                        {role === "ADMIN" && (
                          <Badge
                            variant="purple"
                            pill
                            className="text-[9px] font-bold"
                          >
                            Administrator
                          </Badge>
                        )}
                        {role === "VENDOR" && (
                          <Badge
                            variant="yellow"
                            pill
                            className="text-[9px] font-bold"
                          >
                            Merchant Vendor
                          </Badge>
                        )}
                        {role === "USER" && (
                          <Badge
                            variant="indigo"
                            pill
                            className="text-[9px] font-bold"
                          >
                            Shopper
                          </Badge>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <Badge
                          variant={isActive ? "emerald" : "red"}
                          pill
                          className="text-[9px] font-bold"
                        >
                          {isActive ? "Active" : "Suspended"}
                        </Badge>
                      </td>

                      {/* Created Date */}
                      <td className="py-4 px-6 text-slate-500 text-[11px] font-mono">
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Inspect Modal Trigger */}
                          <button
                            type="button"
                            onClick={() => setSelectedUser(u)}
                            title="Inspect User Details"
                            className="p-1.5 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer border border-transparent hover:border-indigo-100"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit Role Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenRoleModal(u)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-[10px] cursor-pointer transition-all flex items-center gap-1"
                          >
                            <Edit3 className="w-3 h-3 text-slate-500" />
                            <span>Edit Role</span>
                          </button>

                          {/* Toggle Active / Suspended */}
                          <button
                            type="button"
                            disabled={isProcessing}
                            onClick={() => handleToggleStatus(u)}
                            title={
                              isActive ? "Suspend Account" : "Activate Account"
                            }
                            className={`p-1.5 rounded-xl transition-all cursor-pointer border ${isActive
                                ? "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100"
                                : "bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-500"
                              }`}
                          >
                            {isProcessing ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Power className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Edit Role Modal */}
      <Modal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        title="Modify Access Role"
        size="sm"
      >
        <form onSubmit={handleRoleSubmit} className="space-y-4 font-body text-xs">
          <div>
            <p className="text-slate-500 text-xs mb-3">
              Change operating permissions for{" "}
              <strong className="text-slate-900">{editingUser?.name}</strong> (
              <span className="font-mono text-slate-700">{editingUser?.email}</span>
              )
            </p>

            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">
              Select Role Level
            </label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
            >
              <option value="USER">Shopper (Standard Consumer)</option>
              <option value="VENDOR">Merchant Vendor (Boutique Owner)</option>
              <option value="ADMIN">Super Administrator (Full System Access)</option>
            </select>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsRoleModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              Save New Role
            </button>
          </div>
        </form>
      </Modal>

      {/* 5. User Inspection Drawer */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-end transition-opacity">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-sm font-heading font-black text-slate-900">
                    User Account Inspection
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Identity Box */}
              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-base uppercase shrink-0 overflow-hidden">
                    {selectedUser.profileImage ? (
                      <img
                        src={selectedUser.profileImage}
                        alt={selectedUser.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{(selectedUser.name || "U").charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-heading font-black text-slate-900 text-base">
                      {selectedUser.name || "Anonymous Shopper"}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400 block">
                      ID: {selectedUser._id || selectedUser.id}
                    </span>
                  </div>
                </div>

                <div className="pt-1 flex items-center gap-2">
                  <Badge
                    variant="indigo"
                    pill
                    className="text-[10px] font-bold"
                  >
                    Role: {selectedUser.role || "USER"}
                  </Badge>
                  <Badge
                    variant={
                      selectedUser.isActive !== false ? "emerald" : "red"
                    }
                    pill
                    className="text-[10px] font-bold"
                  >
                    Status:{" "}
                    {selectedUser.isActive !== false ? "Active" : "Suspended"}
                  </Badge>
                </div>
              </div>

              {/* Account Details List */}
              <div className="space-y-3 text-xs text-slate-700">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400 font-medium">
                    Email Address
                  </span>
                  <span className="font-mono text-slate-900">
                    {selectedUser.email}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400 font-medium">
                    Designation
                  </span>
                  <span className="font-semibold text-slate-900">
                    {selectedUser.designation || "Consumer"}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400 font-medium">
                    Authentication Provider
                  </span>
                  <span className="font-mono text-slate-900 uppercase">
                    {selectedUser.provider || "credentials"}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400 font-medium">
                    Joined Date
                  </span>
                  <span className="font-mono text-slate-900">
                    {selectedUser.createdAt
                      ? new Date(selectedUser.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>

                {selectedUser.vendorId && (
                  <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-800">
                      <Building2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-[10px] font-bold uppercase">
                        Linked Boutique Merchant ID
                      </span>
                    </div>
                    <p className="font-mono text-slate-900 text-xs font-bold pt-0.5">
                      {typeof selectedUser.vendorId === "object"
                        ? selectedUser.vendorId._id || selectedUser.vendorId.businessName
                        : selectedUser.vendorId}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}