"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Modal from "@/components/ui/Modal";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import useGalleryStore from "@/store/galleryStore";
import { useUploadThing } from "@/utils/uploadthing";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/utils/cropImage";
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
  IndianRupee,
  ZoomIn,
  Crop,
  Check,
} from "lucide-react";
import Image from "next/image";

const STOCK_CATEGORIES = [
  "All",
  "Men's Collection",
  "Women's Wear",
  "Kids & Teens",
  "Ethnic & Traditional",
  "Western & Streetwear",
];

export default function VendorGallery() {
  const { user } = useAuth();
  const { media, fetchGallery, createAsset, deleteAsset, loading } =
    useGalleryStore();

  const [activeFolder, setActiveFolder] = useState("All");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form State
  const [assetName, setAssetName] = useState("");
  const [assetFolder, setAssetFolder] = useState("Women's Wear");
  const [price, setPrice] = useState("");

  // Crop & Image State
  const [rawImageSrc, setRawImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImageFile, setCroppedImageFile] = useState(null);
  const [croppedPreviewUrl, setCroppedPreviewUrl] = useState("");
  const [isCropping, setIsCropping] = useState(false);

  const fileInputRef = useRef(null);

  const { startUpload } = useUploadThing("vendorAssetUploader", {
    headers: {
      "x-user-email": user?.email || "",
    },
    onUploadError: (err) => {
      setIsUploading(false);
      toast.error(err?.message || "Storage quota exceeded or upload failed.");
    },
  });

  useEffect(() => {
    if (user?.vendorId) {
      fetchGallery(user.vendorId);
    }
  }, [user, fetchGallery]);

  const filteredMedia = (media || []).filter(
    (m) => activeFolder === "All" || m.folder === activeFolder,
  );

  const resetForm = () => {
    setAssetName("");
    setAssetFolder(activeFolder === "All" ? "Women's Wear" : activeFolder);
    setPrice("");
    setRawImageSrc(null);
    setCroppedImageFile(null);
    setCroppedPreviewUrl("");
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    setIsCropping(false);
  };

  const handleOpenUpload = () => {
    resetForm();
    setIsUploadOpen(true);
  };

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!user?.email) {
      toast.error("Session email missing. Please re-login.");
      return;
    }

    if (!assetName) {
      setAssetName(file.name.split(".")[0].replace(/[-_]/g, " "));
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setRawImageSrc(reader.result);
      setIsCropping(true);
    });
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const applyCrop = async () => {
    try {
      const cropped = await getCroppedImg(rawImageSrc, croppedAreaPixels);
      if (cropped) {
        setCroppedImageFile(cropped.file);
        setCroppedPreviewUrl(cropped.previewUrl);
        setIsCropping(false);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to crop image.");
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();

    if (!croppedImageFile) {
      toast.error("Please select and crop a photo first");
      return;
    }

    setSubmitting(true);
    setIsUploading(true);
    const toastId = toast.loading("Uploading and saving item...");

    try {
      // 1. Upload the cropped file to UploadThing
      const res = await startUpload([croppedImageFile]);
      if (!res || !res[0]) {
        throw new Error("Cloud upload did not return file URL");
      }
      const uploadedUrl = res[0].url || res[0].fileUrl;

      // 2. Save Asset metadata to Gallery
      await createAsset({
        name: assetName.trim() || `${assetFolder} Piece`,
        folder: assetFolder,
        url: uploadedUrl,
        price: price ? Number(price) : 0,
      });

      toast.success("Stock design published to gallery!", { id: toastId });
      setIsUploadOpen(false);
      resetForm();
    } catch (err) {
      toast.error(err?.message || "Failed to save photo", { id: toastId });
    } finally {
      setSubmitting(false);
      setIsUploading(false);
    }
  };

  const handleDelete = (id) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3 font-body">
          <p className="text-xs font-bold text-slate-800">
            Remove this stock photo from your showcase?
          </p>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200"
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
              className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 shadow-xs"
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
        },
      },
    );
  };

  return (
    <div className="space-y-6 font-body pb-12">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />

      <DashboardHeader
        title="Stock & Store Gallery"
        description="Showcase live stock designs, apparel collections, and physical storefront ambience to local shoppers."
        badge="Stock Showcase"
      >
        <button
          type="button"
          onClick={handleOpenUpload}
          className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Add Stock Item</span>
        </button>
      </DashboardHeader>

      {/* Filter Tabs Bar */}
      <div className="bg-white p-3 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none py-1">
          {STOCK_CATEGORIES.map((f) => (
            <button
              type="button"
              key={f}
              onClick={() => setActiveFolder(f)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 border ${
                activeFolder === f
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Folder className="w-3.5 h-3.5" />
              <span>{f}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Cards Grid */}
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
            No Items in {activeFolder}
          </h3>
          <p className="text-xs text-slate-500 mt-1.5 font-medium leading-relaxed">
            Upload live stock photos or collection pieces for walk-in Namakkal
            buyers.
          </p>
          <button
            type="button"
            onClick={handleOpenUpload}
            className="mt-6 px-6 py-3 rounded-2xl bg-indigo-600 text-white text-xs font-black shadow-md hover:bg-indigo-500 transition-colors cursor-pointer"
          >
            Upload Item Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMedia.map((item) => {
            const assetId = item._id || item.id;
            const assetUrl = item.url;

            return (
              <div
                key={assetId}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div className="aspect-3/4 w-full relative overflow-hidden bg-slate-900">
                  <Image
                    src={assetUrl}
                    alt={item.name || "Stock Photo"}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

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

                  <div className="absolute top-3 left-3 z-10">
                    <span className="text-[10px] font-black uppercase tracking-wider text-white bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                      {item.folder}
                    </span>
                  </div>

                  {item.price > 0 && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="text-[11px] font-black text-emerald-800 bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-xs flex items-center gap-0.5">
                        <IndianRupee className="w-3 h-3 text-emerald-600" />
                        {item.price.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4 flex items-center justify-between bg-white border-t border-slate-100">
                  <div className="truncate pr-2">
                    <h4 className="text-xs font-black text-slate-900 truncate">
                      {item.name}
                    </h4>
                    <span className="text-[10px] font-bold text-slate-400">
                      Showcase Piece
                    </span>
                  </div>
                  <span className="text-[9px] font-black text-indigo-700 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100 shrink-0">
                    In Stock
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 🚀 EXPANDED DRAG, ZOOM & CROP UPLOAD MODAL */}
      <Modal
        isOpen={isUploadOpen}
        onClose={() => {
          setIsUploadOpen(false);
          resetForm();
        }}
        title="Upload & Fit Stock Design"
        size="lg" // Larger modal footprint
      >
        <form
          onSubmit={handleUploadSubmit}
          className="space-y-5 font-body pt-1"
        >
          {/* Card Cropper / Uploader Box */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                Photo Framing (Drag to move & fit) *
              </label>
              {rawImageSrc && !isCropping && (
                <button
                  type="button"
                  onClick={() => setIsCropping(true)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
                >
                  <Crop className="w-3.5 h-3.5" /> Re-crop Image
                </button>
              )}
            </div>

            {/* If In Interactive Cropping Mode */}
            {isCropping && rawImageSrc ? (
              <div className="space-y-3">
                <div className="relative w-full h-80 sm:h-96 bg-slate-950 rounded-3xl overflow-hidden border border-slate-300 shadow-inner">
                  <Cropper
                    image={rawImageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={3 / 4} // Perfect standard portrait clothing aspect
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                  />
                </div>

                {/* Zoom & Confirm Controls */}
                <div className="flex items-center justify-between gap-4 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="flex items-center gap-2 flex-1 max-w-xs">
                    <ZoomIn className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="range"
                      value={zoom}
                      min={1}
                      max={3}
                      step={0.1}
                      aria-labelledby="Zoom"
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <span className="text-[11px] font-bold text-slate-500 w-8">
                      {zoom.toFixed(1)}x
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={applyCrop}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-indigo-600/20 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Confirm Crop</span>
                  </button>
                </div>
              </div>
            ) : croppedPreviewUrl ? (
              /* Cropped Final Preview Card */
              <div className="relative w-full max-w-xs mx-auto aspect-3/4 rounded-3xl overflow-hidden border-2 border-indigo-500 shadow-xl group">
                <img
                  src={croppedPreviewUrl}
                  alt="Final preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-bold gap-2 cursor-pointer"
                >
                  <Camera className="w-6 h-6" />
                  <span>Choose Another Photo</span>
                </button>
              </div>
            ) : (
              /* Initial Empty State Picker */
              <div
                onClick={() => fileInputRef.current?.click()}
                className="h-64 sm:h-72 rounded-3xl border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50/20 transition-all flex flex-col items-center justify-center cursor-pointer p-6 text-center"
              >
                <div className="p-4 rounded-2xl bg-indigo-50 text-indigo-600 mb-3">
                  <Camera className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-extrabold text-slate-800">
                  Select Stock or Boutique Design
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mt-1">
                  Pick any image to drag, zoom, and frame into a clean portrait
                  lookbook card.
                </p>
              </div>
            )}
          </div>

          {/* Form Meta Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Item / Design Title *
              </label>
              <input
                type="text"
                required
                value={assetName}
                onChange={(e) => setAssetName(e.target.value)}
                placeholder="e.g. Silk Anarkali Suit / Regular Fit Denim"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Display Price in ₹ (Optional)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 1999"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
              Showcase Category *
            </label>
            <select
              value={assetFolder}
              onChange={(e) => setAssetFolder(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600 cursor-pointer"
            >
              {STOCK_CATEGORIES.filter((f) => f !== "All").map((folder) => (
                <option key={folder} value={folder}>
                  {folder}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
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
              disabled={
                submitting || isUploading || isCropping || !croppedImageFile
              }
              className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-md cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Upload className="w-4 h-4" /> Save to Stock Gallery
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Fullscreen Lightbox Modal */}
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
            <div
              className="relative w-full max-w-4xl h-[80vh] rounded-3xl overflow-hidden shadow-2xl border border-white/25"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage}
                alt="Fullscreen Preview"
                fill
                sizes="1200px"
                className="object-contain w-full h-full"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
