"use client";

import React, { useState, useEffect, useRef } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Modal from "@/components/ui/Modal";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import useGalleryStore from "@/store/galleryStore";
import { useUploadThing } from "@/utils/uploadthing"; // 👈 Import UploadThing client helper
import {
  Image as ImageIcon,
  Folder,
  Upload,
  Trash2,
  Maximize2,
  Zap,
  Camera,
  X,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";

export default function VendorGallery() {
  const { user } = useAuth();
  const { media, fetchGallery, createAsset, deleteAsset, loading } =
    useGalleryStore();

  const [activeFolder, setActiveFolder] = useState("All");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // 👈 Upload tracking state

  // Upload Form State
  const [assetName, setAssetName] = useState("");
  const [assetFolder, setAssetFolder] = useState("Store Interior");
  const [imagePreview, setImagePreview] = useState("");

  const fileInputRef = useRef(null);

  const folders = [
    "All",
    "Store Interior",
    "Collections",
    "Offers",
    "Logo & Banners",
  ];

  // 👈 Initialize UploadThing hook with 2GB storage middleware tracking
  const { startUpload } = useUploadThing("vendorAssetUploader", {
    headers: {
      "x-user-email": user?.email || "",
    },
    onClientUploadComplete: (res) => {
      setIsUploading(false);
      if (res && res[0]) {
        const uploadedUrl = res[0].url || res[0].fileUrl;
        setImagePreview(uploadedUrl);
        toast.success("Photo uploaded to cloud server!");
      }
    },
    onUploadError: (err) => {
      setIsUploading(false);
      toast.error(err?.message || "Storage limit of 2GB reached or upload failed.");
    },
  });

  useEffect(() => {
    if (user?.vendorId) {
      fetchGallery(user.vendorId);
    }
  }, [user, fetchGallery]);

  const filteredMedia = media.filter(
    (m) => activeFolder === "All" || m.folder === activeFolder
  );

  const resetForm = () => {
    setAssetName("");
    setAssetFolder(activeFolder === "All" ? "Store Interior" : activeFolder);
    setImagePreview("");
  };

  const handleOpenUpload = () => {
    resetForm();
    setIsUploadOpen(true);
  };

  // 👈 Handle PC File Upload via UploadThing Server
  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!user?.email) {
      toast.error("User session email missing. Please re-login.");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading("Uploading photo to UploadThing server...");

    try {
      if (!assetName) {
        setAssetName(file.name.split(".")[0].replace(/[-_]/g, " "));
      }
      await startUpload([file]);
      toast.dismiss(toastId);
    } catch (err) {
      toast.dismiss(toastId);
      setIsUploading(false);
      toast.error(err.message || "Failed to upload file");
    }
  };

  const handleDelete = (id) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3 font-body">
          <p className="text-xs font-bold text-slate-800">
            Remove this photo from your shop gallery?
          </p>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={async () => {
                toast.dismiss(t.id);
                const toastId = toast.loading("Deleting photo...");
                try {
                  await deleteAsset(id);
                  toast.success("Photo removed successfully!", { id: toastId });
                } catch (err) {
                  toast.error(err?.message || "Failed to delete photo", {
                    id: toastId,
                  });
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 transition-colors cursor-pointer shadow-xs"
            >
              Delete Photo
            </button>
          </div>
        </div>
      ),
      {
        duration: 5000,
        position: "top-center",
        style: {
          borderRadius: "20px",
          background: "#ffffff",
          color: "#0f172a",
          border: "1px solid #e2e8f0",
          padding: "16px",
          boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
        },
      }
    );
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();

    if (!imagePreview) {
      toast.error("Please select a photo to upload");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading("Saving photo details to gallery...");

    try {
      await createAsset({
        name: assetName.trim() || "Shop Photo Asset",
        folder: assetFolder,
        url: imagePreview,
      });

      toast.success("Photo saved to gallery!", { id: toastId });
      setIsUploadOpen(false);
      resetForm();
    } catch (err) {
      toast.error(err?.message || "Failed to save photo", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-body pb-12">
      {/* Hidden Native File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />

      {/* Header */}
      <DashboardHeader
        title="Store Gallery & Media Assets"
        description="Upload photos of your shop interior, trial rooms, and promotional banners so local shoppers can see your store."
        badge="Shop Gallery"
      >
        <button
          onClick={handleOpenUpload}
          className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Upload New Photo</span>
        </button>
      </DashboardHeader>

      {/* Folder Pills Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-none py-1">
          {folders.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFolder(f)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 border ${activeFolder === f
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
            >
              <Folder className="w-3.5 h-3.5" />
              <span>{f}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-teal-700 bg-teal-50 px-3.5 py-2 rounded-2xl border border-teal-100 shrink-0 w-full md:w-auto justify-center">
          <Zap className="w-4 h-4 text-teal-600" />
          <span>UploadThing Cloud Storage Active</span>
        </div>
      </div>

      {/* Grid Gallery */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200/80 rounded-3xl max-w-md mx-auto shadow-xs p-8">
          <div className="h-16 w-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-indigo-100">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h3 className="font-heading font-black text-slate-900 text-lg">
            No Photos in {activeFolder}
          </h3>
          <p className="text-xs text-slate-500 mt-1.5 font-medium leading-relaxed">
            Upload photos to show buyers what your shop interior and dress collections look like.
          </p>
          <button
            onClick={handleOpenUpload}
            className="mt-6 px-6 py-3 rounded-2xl bg-indigo-600 text-white text-xs font-black shadow-md hover:bg-indigo-500 transition-colors cursor-pointer"
          >
            Upload Photo Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedia.map((item) => {
            const assetId = item._id || item.id;
            const assetUrl = item.url;

            return (
              <div
                key={assetId}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                {/* Photo Area */}
                <div className="h-60 w-full relative overflow-hidden bg-slate-900">
                  <Image
                    src={assetUrl}
                    alt={item.name || "Gallery Photo"}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Hover Actions Overlay */}
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10 backdrop-blur-xs">
                    <button
                      type="button"
                      onClick={() => setSelectedImage(assetUrl)}
                      className="p-3 rounded-2xl bg-white/90 hover:bg-white text-slate-900 font-bold transition-all cursor-pointer shadow-md"
                      title="View Fullscreen"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(assetId)}
                      className="p-3 rounded-2xl bg-rose-600/90 hover:bg-rose-600 text-white font-bold transition-all cursor-pointer shadow-md"
                      title="Delete Photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Folder Tag Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="text-[10px] font-black uppercase tracking-wider text-white bg-slate-950/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                      {item.folder}
                    </span>
                  </div>
                </div>

                {/* Asset Footer */}
                <div className="p-4 flex items-center justify-between bg-white border-t border-slate-100">
                  <div>
                    <h4 className="text-xs font-black text-slate-900 truncate max-w-40">
                      {item.name}
                    </h4>
                    <span className="text-[10px] font-bold text-slate-400">
                      Cloud Synced
                    </span>
                  </div>

                  <span className="text-[10px] font-black text-teal-700 bg-teal-50 px-2.5 py-1 rounded-xl border border-teal-200">
                    ⚡ UploadThing
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Asset Modal */}
      <Modal
        isOpen={isUploadOpen}
        onClose={() => {
          setIsUploadOpen(false);
          resetForm();
        }}
        title="Upload Shop Photo"
        size="md"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4 font-body pt-2">
          {/* File Picker Box */}
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
              Select Image File (UploadThing Cloud)
            </label>
            <div
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className="h-44 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 transition-all flex flex-col items-center justify-center cursor-pointer relative overflow-hidden group"
            >
              {imagePreview ? (
                <>
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    sizes="400px"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                    {isUploading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Camera className="w-4 h-4" /> Change Photo
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-400 p-4 text-center">
                  <div className="p-3 rounded-full bg-indigo-50 text-indigo-600">
                    {isUploading ? (
                      <RefreshCw className="w-6 h-6 animate-spin" />
                    ) : (
                      <Camera className="w-6 h-6" />
                    )}
                  </div>
                  <span className="text-xs font-bold text-slate-700">
                    {isUploading ? "Uploading to UploadThing server..." : "Click here to pick photo from PC"}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Saved to 2GB Cloud Storage Pool
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Title / Caption */}
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
              Photo Title / Caption
            </label>
            <input
              type="text"
              required
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              placeholder="e.g. Trial Room Area / Main Counter"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
            />
          </div>

          {/* Folder Category Select */}
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
              Gallery Category
            </label>
            <select
              value={assetFolder}
              onChange={(e) => setAssetFolder(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600 cursor-pointer"
            >
              {folders
                .filter((f) => f !== "All")
                .map((folder) => (
                  <option key={folder} value={folder}>
                    {folder}
                  </option>
                ))}
            </select>
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setIsUploadOpen(false);
                resetForm();
              }}
              className="px-5 py-2.5 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting || isUploading}
              className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-md cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Upload className="w-4 h-4" /> Save Photo to Gallery
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Fullscreen Lightbox Preview */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setSelectedImage(null)}
          >
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative w-full max-w-4xl h-[80vh] rounded-3xl overflow-hidden shadow-2xl border border-white/25">
              <Image
                src={selectedImage}
                alt="Fullscreen Preview"
                fill
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-contain w-full h-full"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}