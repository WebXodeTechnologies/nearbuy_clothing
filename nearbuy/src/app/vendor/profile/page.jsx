"use client";

import React, { useEffect, useState, useCallback } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import useUserStore from "@/store/userStore";
import { useSession, signOut } from "next-auth/react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Camera,
  Save,
  Trash2,
  CheckCircle2,
  Shield,
  AlertTriangle,
  Building,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";

export default function VendorUserProfile() {
  const { data: session, update: updateSession } = useSession();
  const { profile, fetchProfile, updateProfile, deleteProfile, loading } = useUserStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    image: "",
    designation: "Boutique Owner & General Manager",
    bio: "Managing director and apparel buyer. Specializing in sustainable cotton, linen, and traditional silk wear.",
  });

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Safely hydrate profile data ONCE on mount without triggering infinite resets
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (isDataLoaded) return; // Prevent overwriting user's active edits

      const data = await fetchProfile();
      if (!isMounted) return;

      if (data) {
        setFormData({
          name: data.name || session?.user?.name || "",
          email: data.email || session?.user?.email || "",
          phone: data.phone || "",
          image: data.profileImage || data.image || session?.user?.image || "",
          designation: data.designation || "Merchant Owner",
          bio: data.bio || "",
        });
        setIsDataLoaded(true);
      } else if (session?.user) {
        setFormData({
          name: session.user.name || "",
          email: session.user.email || "",
          phone: "",
          image: session.user.image || "",
          designation: "Merchant Owner",
          bio: "",
        });
        setIsDataLoaded(true);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [fetchProfile, session, isDataLoaded]);

  // Handle Input Changes cleanly
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update Profile CRUD Handler
  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    try {
      // Map keys cleanly for both User model (profileImage) and Vendor model (phone)
      const updatedData = {
        name: formData.name,
        phone: formData.phone,
        image: formData.image,
        profileImage: formData.image,
        designation: formData.designation,
        bio: formData.bio,
      };

      // 1. Call Zustand API Service
      const result = await updateProfile(updatedData);

      // 2. Refresh NextAuth Client Session Header
      if (updateSession) {
        await updateSession({
          ...session,
          user: {
            ...session?.user,
            name: formData.name,
            image: formData.image,
          },
        });
      }

      // 3. Keep local state aligned with updated response
      if (result) {
        setFormData((prev) => ({
          ...prev,
          name: result.name || prev.name,
          phone: result.phone || prev.phone,
          image: result.profileImage || result.image || prev.image,
          designation: result.designation || prev.designation,
          bio: result.bio || prev.bio,
        }));
      }

      toast.success("profile updated successfully!");
    } catch (err) {
      toast.error(err?.message || "Failed to update profile details.");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Account Handler
  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteProfile();
      toast.success("Profile deleted. Redirecting to login...");
      signOut({ callbackUrl: "/auth/login" });
    } catch (err) {
      toast.error("Failed to delete account.");
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="space-y-8 font-body pb-12">
      <DashboardHeader
        title="Owner Account & Personal Profile"
        description="Manage your merchant identity, contact phone number, profile image, and store credentials."
        badge="Account Settings"
      >
        <button
          type="button"
          onClick={handleSaveProfile}
          disabled={loading || isSaving}
          className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading || isSaving ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>Save Changes</span>
        </button>
      </DashboardHeader>

      {/* Main Profile Summary Header */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="h-24 w-24 rounded-3xl bg-linear-to-tr from-indigo-500 to-teal-400 p-1 shadow-xl shrink-0 overflow-hidden relative">
              {formData.image ? (
                <Image
                  src={formData.image}
                  alt={formData.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover rounded-[20px]"
                />
              ) : (
                <div className="w-full h-full bg-slate-900 text-white font-black text-2xl flex items-center justify-center rounded-[20px]">
                  {formData.name ? formData.name.charAt(0) : "V"}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                const url = prompt("Enter Avatar Image URL:", formData.image);
                if (url !== null) setFormData((prev) => ({ ...prev, image: url }));
              }}
              className="absolute inset-0 bg-slate-950/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1 cursor-pointer"
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
            <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 pt-0.5">
              <Building className="w-3.5 h-3.5 text-teal-600" /> {formData.designation}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 shrink-0">
          <div className="text-right">
            <span className="text-[10px] font-black text-slate-400 uppercase block">Account Status</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center justify-end gap-1 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Verified Merchant
            </span>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSaveProfile} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-base font-heading font-extrabold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-600" /> Personal Identity Details
              </h3>
              <span className="text-xs font-bold text-slate-400">Merchant Settings</span>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
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
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    Contact Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    Merchant Title / Designation
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                  Avatar Picture URL
                </label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://cloudinary.com/..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                  Owner Bio & Description
                </label>
                <textarea
                  rows={3}
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-medium text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={loading || isSaving}
                className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>Save Profile Details</span>
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar Security Details */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-heading font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-teal-600" /> Security & Role
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
                  {session?.user?.email?.includes("gmail") ? "Google OAuth" : "Email / Password"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-rose-50/60 p-6 rounded-3xl border border-rose-200/80 space-y-3">
            <h3 className="text-base font-heading font-bold text-rose-900 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-rose-600" /> Delete Profile
            </h3>
            <p className="text-xs text-rose-700 font-medium leading-relaxed">
              Deleting your profile will erase your login account settings from the database.
            </p>
            <button
              type="button"
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
                This action is permanent and will remove your owner settings.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
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