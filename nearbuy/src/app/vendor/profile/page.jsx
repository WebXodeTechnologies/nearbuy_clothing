"use client";

import React, { useEffect, useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import useUserStore from "@/store/userStore";
import { useSession, signOut } from "next-auth/react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Shield,
  Camera,
  Save,
  Trash2,
  CheckCircle2,
  Calendar,
  Sparkles,
  AlertTriangle,
  Building,
  KeyRound,
  RefreshCw,
} from "lucide-react";

export default function VendorUserProfile() {
  const { data: session } = useSession();
  const { profile, fetchProfile, updateProfile, deleteProfile, loading } = useUserStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    image: "",
    designation: "Merchant Owner & General Manager",
    bio: "Managing director and apparel buyer at Urban Threads Boutique. Specializing in sustainable linen and traditional ethnic wear.",
  });

  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchProfile().then((data) => {
      if (data) {
        setFormData((prev) => ({
          ...prev,
          name: data.name || session?.user?.name || "",
          email: data.email || session?.user?.email || "",
          phone: data.phone || "+91 98200 12345",
          image: data.image || session?.user?.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
        }));
      } else if (session?.user) {
        setFormData((prev) => ({
          ...prev,
          name: session.user.name || "",
          email: session.user.email || "",
          image: session.user.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
        }));
      }
    });
  }, [fetchProfile, session]);

  // Update CRUD Action
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({
        name: formData.name,
        phone: formData.phone,
        image: formData.image,
      });
      toast.success("Merchant owner profile updated successfully!");
    } catch (err) {
      // Toast already handled in userStore
    }
  };

  // Delete CRUD Action
  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteProfile();
      toast.success("Profile deleted. Logging out...");
      signOut({ callbackUrl: "/auth/login" });
    } catch (err) {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="space-y-8 font-body pb-12">
      <DashboardHeader
        title="Owner Account & Personal Profile"
        description="Manage your personal merchant identity, contact information, profile photo, security credentials, and account settings."
        badge="Account CRUD"
      >
        <button
          onClick={handleSaveProfile}
          disabled={loading}
          className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Profile Changes
        </button>
      </DashboardHeader>

      {/* Main Profile Summary Header */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#ECECEC] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="h-24 w-24 rounded-3xl bg-linear-to-tr from-indigo-500 to-teal-400 p-1 shadow-xl shrink-0 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={formData.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"}
                alt={formData.name}
                className="w-full h-full object-cover rounded-[20px]"
              />
            </div>
            <button
              onClick={() => {
                const url = prompt("Enter Avatar Image URL:", formData.image);
                if (url) setFormData({ ...formData, image: url });
              }}
              className="absolute inset-0 bg-slate-950/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1 cursor-pointer"
            >
              <Camera className="w-4 h-4" /> Edit
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-heading font-black text-slate-900">
                {formData.name || "Merchant Owner"}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-black border border-indigo-200">
                {profile?.role || session?.user?.role || "VENDOR"}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-600" /> {formData.email}
            </p>
            <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 pt-0.5">
              <Building className="w-3.5 h-3.5 text-teal-600" /> Urban Threads Boutique (Bandra West)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 shrink-0">
          <div className="text-right">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Account Status</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center justify-end gap-1 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Verified Merchant
            </span>
          </div>
        </div>
      </div>

      {/* Profile CRUD Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Read & Update Details Form */}
          <form onSubmit={handleSaveProfile} className="bg-white p-6 md:p-8 rounded-3xl border border-[#ECECEC] shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-base font-heading font-bold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-600" /> Personal Identity Details
              </h3>
              <span className="text-xs font-bold text-slate-400">CRUD: Update Profile</span>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address (Immutable)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={formData.email}
                    className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    Contact Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98200 12345"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    Merchant Title / Role
                  </label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  Avatar Picture URL
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  About Owner / Short Bio
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-medium text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Profile Details
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar Info & Delete Profile Action */}
        <div className="space-y-6">
          {/* Account Credentials Card */}
          <div className="bg-white p-6 rounded-3xl border border-[#ECECEC] shadow-xs space-y-4">
            <h3 className="text-base font-heading font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-teal-600" /> Account Security & Role
            </h3>

            <div className="space-y-3 text-xs font-semibold text-slate-600">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span>Account Role</span>
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  {profile?.role || session?.user?.role || "VENDOR"}
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span>Auth Provider</span>
                <span className="font-bold text-slate-900">
                  {session?.user?.email?.includes("gmail") ? "Google OAuth 2.0" : "Credentials Password"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Member Since</span>
                <span className="font-bold text-slate-900">July 2026</span>
              </div>
            </div>
          </div>

          {/* Delete Profile (CRUD: Delete) Card */}
          <div className="bg-rose-50/60 p-6 rounded-3xl border border-rose-200/80 space-y-3">
            <h3 className="text-base font-heading font-bold text-rose-900 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-rose-600" /> Delete Profile (CRUD)
            </h3>
            <p className="text-xs text-rose-700 font-medium leading-relaxed">
              Deleting your merchant account profile will erase your login credentials and owner settings.
            </p>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-1.5 w-full justify-center"
            >
              <Trash2 className="w-4 h-4" /> Delete Account Profile
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-rose-100 space-y-4 font-body"
          >
            <div className="h-12 w-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-heading font-bold text-slate-900">Delete Account Profile?</h3>
              <p className="text-xs text-slate-500 font-medium">
                This action is permanent. Your merchant profile details will be removed from MongoDB.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={handleDeleteAccount}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-md"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
