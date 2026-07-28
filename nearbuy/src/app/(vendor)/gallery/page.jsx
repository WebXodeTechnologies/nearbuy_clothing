"use client";

import React, { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Modal from "@/components/ui/Modal";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  Image as ImageIcon,
  Folder,
  Upload,
  Plus,
  Trash2,
  Maximize2,
  Sparkles,
  Zap,
  Search,
} from "lucide-react";

const INITIAL_MEDIA = [
  { id: 1, folder: "Store Interior", name: "Bandra Rack Display", url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80", size: "1.2 MB", compressed: "240 KB" },
  { id: 2, folder: "Collections", name: "Linen Shirt Lookbook", url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80", size: "2.1 MB", compressed: "380 KB" },
  { id: 3, folder: "Store Interior", name: "Boutique Front Signboard", url: "https://images.unsplash.com/photo-1567401893930-7becd1127e6f?auto=format&fit=crop&w=600&q=80", size: "1.8 MB", compressed: "310 KB" },
  { id: 4, folder: "Offers", name: "Monsoon Coupon Banner", url: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&q=80", size: "1.5 MB", compressed: "290 KB" },
  { id: 5, folder: "Store Interior", name: "Trial Room Lounge", url: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=600&q=80", size: "2.4 MB", compressed: "420 KB" },
  { id: 6, folder: "Logo & Banners", name: "Store Logo HD", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80", size: "890 KB", compressed: "150 KB" },
];

export default function VendorGallery() {
  const [media, setMedia] = useState(INITIAL_MEDIA);
  const [activeFolder, setActiveFolder] = useState("All");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newName, setNewName] = useState("");

  const folders = ["All", "Store Interior", "Collections", "Offers", "Logo & Banners"];

  const filtered = media.filter((m) => activeFolder === "All" || m.folder === activeFolder);

  const handleDelete = (id) => {
    if (confirm("Delete this asset from your media library?")) {
      setMedia(media.filter((m) => m.id !== id));
      toast.success("Asset removed!");
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    const asset = {
      id: Date.now(),
      folder: activeFolder === "All" ? "Store Interior" : activeFolder,
      name: newName || "Uploaded Photo Asset",
      url: newUrl || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
      size: "1.8 MB",
      compressed: "320 KB",
    };
    setMedia([asset, ...media]);
    setNewUrl("");
    setNewName("");
    setIsUploadOpen(false);
    toast.success("Image uploaded & auto-compressed for Web!");
  };

  return (
    <div className="space-y-8 font-body pb-12">
      <DashboardHeader
        title="Media Library & Asset Manager"
        description="Pinterest-style gallery management for store photos, lookbooks, hero banners, and promotional cards."
        badge="Asset Gallery"
      >
        <button
          onClick={() => setIsUploadOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Upload className="w-4 h-4" /> Upload New Media
        </button>
      </DashboardHeader>

      {/* Folders & Compression Header */}
      <div className="bg-white p-6 rounded-3xl border border-[#ECECEC] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
            {folders.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFolder(f)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 border ${
                  activeFolder === f
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <Folder className="w-3.5 h-3.5" /> {f}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-teal-700 bg-teal-50 px-3.5 py-1.5 rounded-2xl border border-teal-100 shrink-0">
            <Zap className="w-4 h-4 text-teal-600" /> WebP Auto-Compression Active
          </div>
        </div>
      </div>

      {/* Pinterest-style Masonry Gallery */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#ECECEC] rounded-3xl max-w-xl mx-auto shadow-xs p-8">
          <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-100">
            <ImageIcon className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-slate-900 text-base">No Assets in Folder</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto font-medium">
            Upload high-resolution store photos to showcase your shop layout and apparel lines.
          </p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filtered.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={item.id}
              className="break-inside-avoid bg-white rounded-3xl border border-[#ECECEC] shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden group relative"
            >
              <div className="relative overflow-hidden bg-slate-100">
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => setSelectedImage(item.url)}
                    className="p-2.5 rounded-2xl bg-white/90 backdrop-blur-md text-slate-900 font-bold hover:bg-white transition-colors cursor-pointer"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2.5 rounded-2xl bg-rose-600 text-white font-bold hover:bg-rose-700 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between bg-white border-t border-slate-100">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 truncate max-w-[150px]">{item.name}</h4>
                  <span className="text-[10px] text-slate-400 font-medium">{item.folder}</span>
                </div>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                  {item.compressed}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Upload Image Asset"
        size="md"
      >
        <form onSubmit={handleUpload} className="space-y-4 font-body">
          {/* Drag and Drop Zone */}
          <div className="border-2 border-dashed border-indigo-200 bg-indigo-50/50 p-8 rounded-3xl text-center space-y-3">
            <div className="h-12 w-12 bg-white text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs border border-indigo-100">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Drag and drop store images here</p>
              <span className="text-[10px] text-slate-400 font-medium">PNG, JPG, WebP up to 10MB</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
              Asset Title / Caption
            </label>
            <input
              type="text"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Rack Display Left Side"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
              Image URL
            </label>
            <input
              type="text"
              required
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsUploadOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md hover:bg-indigo-700"
            >
              Upload Asset
            </button>
          </div>
        </form>
      </Modal>

      {/* Lightbox Preview */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <img src={selectedImage} alt="Fullscreen Asset" className="max-w-full max-h-[85vh] rounded-3xl shadow-2xl border border-white/20" />
        </div>
      )}
    </div>
  );
}
