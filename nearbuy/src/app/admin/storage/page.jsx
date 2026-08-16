"use client";

import React, { useState, useEffect } from "react";
import { HardDrive, PlusCircle, Search, ShieldAlert, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminStoragePage() {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [extraGB, setExtraGB] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch all vendors and their storage metrics
    const fetchVendorsStorage = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/admin/vendors"); // Or a dedicated storage endpoint
            const data = await res.json();
            if (data.success) {
                setVendors(data.data || []);
            }
        } catch (err) {
            toast.error("Failed to load vendor storage data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchVendorsStorage();
    }, []);

    const handleAllocateStorage = async (e) => {
        e.preventDefault();
        if (!selectedVendor || !extraGB) return;

        try {
            const res = await fetch(`/api/admin/vendors/${selectedVendor._id}/storage`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ extraStorageGB: Number(extraGB) }),
            });

            const data = await res.json();
            if (data.success) {
                toast.success(`Successfully added ${extraGB}GB to ${selectedVendor.storeName || "Vendor"}`);
                setIsModalOpen(false);
                setExtraGB("");
                fetchVendorsStorage();
            } else {
                toast.error(data.message || "Failed to update storage");
            }
        } catch (err) {
            toast.error("Network error while updating storage");
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6 font-body">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-3xl shadow-xl">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <HardDrive className="w-6 h-6 text-blue-400" />
                        <h1 className="text-xl font-black font-heading">Cloud Storage & Quota Server</h1>
                    </div>
                    <p className="text-xs text-slate-400">
                        Manage 100GB UploadThing server pool and allocate extra storage quotas to individual vendor IDs.
                    </p>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 px-4 py-2.5 rounded-2xl flex items-center gap-3">
                    <span className="text-xs font-bold text-blue-300">Total Pool:</span>
                    <span className="text-sm font-black text-white">100 GB UploadThing</span>
                </div>
            </div>

            {/* Vendors Storage Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-900">Vendor Storage Allocation Registry</h3>
                    <span className="text-xs text-slate-500">Default Quota: 2 GB / vendor</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                                <th className="p-4">Vendor & Store ID</th>
                                <th className="p-4">Used Storage</th>
                                <th className="p-4">Total Quota Limit</th>
                                <th className="p-4">Extra Allocated</th>
                                <th className="p-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-12 text-slate-400">Loading storage metrics...</td>
                                </tr>
                            ) : vendors.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-12 text-slate-400">No vendors found.</td>
                                </tr>
                            ) : (
                                vendors.map((v) => {
                                    const usedBytes = v.storageUsedBytes || 0;
                                    const limitBytes = v.storageLimitBytes || (2 * 1024 * 1024 * 1024); // 2GB default
                                    const usedMB = (usedBytes / (1024 * 1024)).toFixed(1);
                                    const limitGB = (limitBytes / (1024 * 1024 * 1024)).toFixed(1);
                                    const percentage = Math.min(100, (usedBytes / limitBytes) * 100).toFixed(0);

                                    return (
                                        <tr key={v._id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="p-4">
                                                <div className="font-bold text-slate-900">{v.storeName || v.businessName || "Unnamed Store"}</div>
                                                <div className="text-[10px] text-slate-400 font-mono">ID: {v._id}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-bold text-slate-800">{usedMB} MB</div>
                                                <div className="w-24 bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${Number(percentage) > 85 ? 'bg-rose-500' : 'bg-blue-600'}`}
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </td>
                                            <td className="p-4 font-bold text-slate-900">{limitGB} GB</td>
                                            <td className="p-4">
                                                <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-indigo-50 text-indigo-700 border border-indigo-100">
                                                    +{v.extraStorageGBAllocated || 0} GB Extra
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => {
                                                        setSelectedVendor(v);
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                                                >
                                                    <PlusCircle className="w-3.5 h-3.5" /> Add Storage
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Allocate Storage Modal */}
            {isModalOpen && selectedVendor && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6 border border-slate-100">
                        <div className="space-y-1">
                            <h3 className="text-lg font-black text-slate-900">Allocate Extra Storage</h3>
                            <p className="text-xs text-slate-500">
                                Updating storage quota for <span className="font-bold text-slate-800">{selectedVendor.storeName}</span>
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono">Vendor ID: {selectedVendor._id}</p>
                        </div>

                        <form onSubmit={handleAllocateStorage} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-extrabold text-slate-700">Add Extra Storage (in GB)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    required
                                    placeholder="e.g. 5 (Adds 5GB to their pool)"
                                    value={extraGB}
                                    onChange={(e) => setExtraGB(e.target.value)}
                                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                                />
                                <p className="text-[11px] text-slate-400">
                                    This will expand their 2GB default limit by the specified GB amount immediately.
                                </p>
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/25 transition-all cursor-pointer"
                                >
                                    Save & Allocate
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}