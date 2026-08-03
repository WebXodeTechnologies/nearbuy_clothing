"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { toast } from "react-hot-toast";
import {
  Plus,
  Edit3,
  Trash2,
  RefreshCw,
  Search,
  Power,
  Image as ImageIcon,
  Link2,
  Upload,
  X,
  FileImage,
} from "lucide-react";
import Image from "next/image";

export default function BannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploadMode, setUploadMode] = useState("file"); // "file" or "url"
  const [linkUrl, setLinkUrl] = useState("");
  const [buttonText, setButtonText] = useState("Explore Now");
  const [position, setPosition] = useState("HERO");
  const [sortOrder, setSortOrder] = useState(1);
  const [isActive, setIsActive] = useState(true);

  const fileInputRef = useRef(null);

  // Fetch Banners from API
  const fetchBanners = useCallback(async () => {
    setLoading(true);
    try {
      let res = await fetch("/api/admin/banners");

      if (!res.ok) {
        res = await fetch("/api/banners?all=true");
      }

      const contentType = res.headers.get("content-type");
      if (
        !res.ok ||
        !contentType ||
        !contentType.includes("application/json")
      ) {
        throw new Error("Banners endpoint returned non-JSON response.");
      }

      const data = await res.json();
      setBanners(data.data || data.banners || []);
    } catch (err) {
      console.warn("fetchBanners API fallback:", err.message);
      setBanners([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBanners();
  }, [fetchBanners]);

  // Handle Local PC File Selection
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (PNG, JPG, WEBP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageUrl(event.target.result);
      toast.success("Image uploaded successfully!");
    };
    reader.readAsDataURL(file);
  };

  const handleOpenAdd = () => {
    setEditingBanner(null);
    setTitle("");
    setSubtitle("");
    setImageUrl("");
    setUploadMode("file");
    setLinkUrl("/offers");
    setButtonText("Explore Now");
    setPosition("HERO");
    setSortOrder((banners?.length || 0) + 1);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b) => {
    setEditingBanner(b);
    setTitle(b.title || "");
    setSubtitle(b.subtitle || "");
    setImageUrl(b.imageUrl || b.image || "");
    setUploadMode(b.imageUrl?.startsWith("data:") ? "file" : "url");
    setLinkUrl(b.linkUrl || b.link || "");
    setButtonText(b.buttonText || "Explore Now");
    setPosition(b.position || "HERO");
    setSortOrder(b.sortOrder || 1);
    setIsActive(b.isActive !== false);
    setIsModalOpen(true);
  };

  const handleToggleActive = async (b) => {
    const id = b._id || b.id;
    const newStatus = !(b.isActive !== false);
    setActionLoadingId(id);

    try {
      const res = await fetch(`/api/admin/banners/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update banner status");

      toast.success(newStatus ? "Banner published live" : "Banner unpublished");
      setBanners((prev) =>
        prev.map((item) =>
          (item._id || item.id) === id
            ? { ...item, isActive: newStatus }
            : item,
        ),
      );
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id, titleText) => {
    if (
      confirm(
        `Are you sure you want to delete banner "${titleText || "this item"}"?`,
      )
    ) {
      setActionLoadingId(id);
      try {
        const res = await fetch(`/api/admin/banners/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete banner");

        toast.success("Banner deleted successfully");
        setBanners((prev) => prev.filter((b) => (b._id || b.id) !== id));
      } catch (err) {
        toast.error(err.message || "Failed to delete banner");
      } finally {
        setActionLoadingId(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageUrl) {
      toast.error("Please upload an image for the banner");
      return;
    }

    const payload = {
      title,
      subtitle,
      imageUrl,
      linkUrl,
      buttonText,
      position,
      sortOrder: Number(sortOrder) || 1,
      isActive,
    };

    try {
      if (editingBanner) {
        const id = editingBanner._id || editingBanner.id;
        await fetch(`/api/admin/banners/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        toast.success("Banner updated successfully");
      } else {
        await fetch("/api/admin/banners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        toast.success("New promo banner created");
      }
      setIsModalOpen(false);
      await fetchBanners();
    } catch (err) {
      toast.error(err.message || "Failed to save banner");
    }
  };

  const filtered = (banners || []).filter((b) => {
    const query = search.toLowerCase();
    return (
      b.title?.toLowerCase().includes(query) ||
      b.subtitle?.toLowerCase().includes(query) ||
      b.linkUrl?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6 font-body pb-12">
      {/* 1. Header Section */}
      <DashboardHeader
        title="Homepage Hero Banners"
        description="Configure featured promotional sliders, seasonal campaign banners, and high-impact hero graphics shown on the public app homepage."
        badge={`${banners?.length || 0} Banners Configured`}
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchBanners}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
            title="Refresh List"
          >
            <RefreshCw
              className={`w-4 h-4 ${
                loading ? "animate-spin text-indigo-600" : ""
              }`}
            />
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Banner</span>
          </button>
        </div>
      </DashboardHeader>

      {/* 2. Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search banners by title or link..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-slate-800"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        <div className="text-xs font-bold text-slate-400">
          Reorder sequence by priority number
        </div>
      </div>

      {/* 3. Banners Grid Showcase */}
      {loading && !banners?.length ? (
        <div className="py-16 flex flex-col items-center justify-center space-y-3 bg-white rounded-3xl border border-slate-200/80">
          <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
          <span className="text-xs font-bold text-slate-500">
            Loading homepage banners...
          </span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200/80 rounded-3xl max-w-xl mx-auto shadow-xs space-y-3 p-6">
          <div className="h-12 w-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
            <ImageIcon className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-black text-slate-900 text-sm">
            No Banners Configured
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Add your first homepage hero banner to show promotional sales to
            visitors.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((b, idx) => {
            const bannerId = b._id || b.id;
            const isProcessing = actionLoadingId === bannerId;
            const liveState = b.isActive !== false;
            const srcUrl = b.imageUrl || b.image;

            return (
              <div
                key={bannerId}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden hover:border-indigo-200 transition-all p-4 md:p-5 flex flex-col lg:flex-row items-center gap-5 justify-between group"
              >
                {/* Banner Image Preview */}
                <div className="w-full lg:w-72 h-36 rounded-2xl bg-slate-900 overflow-hidden relative shrink-0">
                  {srcUrl ? (
                    <Image
                      src={srcUrl}
                      alt={b.title || "Banner"}
                      fill
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 space-y-1">
                      <FileImage className="w-6 h-6" />
                      <span className="text-[10px]">No image attached</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />

                  <span className="absolute top-2.5 left-2.5 bg-slate-900/80 text-white font-mono text-[9px] font-black px-2 py-0.5 rounded-lg border border-white/20">
                    Pos #{b.sortOrder || idx + 1}
                  </span>

                  <span className="absolute bottom-2.5 left-2.5 bg-indigo-600/90 text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-lg">
                    {b.position || "HERO CAROUSEL"}
                  </span>
                </div>

                {/* Banner Details */}
                <div className="flex-1 space-y-2 w-full">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-black text-slate-900 text-base leading-snug">
                      {b.title || "Untitled Banner"}
                    </h3>
                    <Badge
                      variant={liveState ? "emerald" : "red"}
                      pill
                      className="text-[9px] font-bold"
                    >
                      {liveState ? "Live" : "Draft"}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-500 font-normal leading-relaxed">
                    {b.subtitle || "No subtitle line specified."}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-600">
                    <span className="bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-xl text-[10px] font-mono text-slate-700 flex items-center gap-1">
                      <Link2 className="w-3 h-3 text-indigo-600" />
                      <span>{b.linkUrl || "/offers"}</span>
                    </span>

                    <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-lg text-[10px] font-bold">
                      Btn: &quot;{b.buttonText || "Explore Now"}&quot;
                    </span>

                    <span className="text-[10px] text-slate-400 font-mono">
                      {b.clicks || 0} Click Leads
                    </span>
                  </div>
                </div>

                {/* Action Controls */}
                <div className="flex items-center justify-end gap-2 w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleToggleActive(b)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold cursor-pointer transition-all flex items-center gap-1 shadow-2xs ${
                      liveState
                        ? "bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200"
                        : "bg-emerald-600 hover:bg-emerald-500 text-white"
                    }`}
                  >
                    <Power className="w-3 h-3" />
                    <span>{liveState ? "Unpublish" : "Publish"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(b)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer"
                    title="Edit Banner"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleDelete(bannerId, b.title)}
                    className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                    title="Delete Banner"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Custom File-Upload Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBanner ? "Edit Homepage Banner" : "Add New Hero Banner"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 font-body text-xs">
          <div>
            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
              Banner Main Headline *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Festival Silk Saree Grand Sale"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
              Subtitle / Tagline
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Flat 30% OFF on Top Boutiques in Namakkal"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-indigo-600"
            />
          </div>

          {/* Upload Method Mode Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider">
                Graphic Banner Image *
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setUploadMode("file")}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-lg cursor-pointer transition-all ${
                    uploadMode === "file"
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Upload File (PC)
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode("url")}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-lg cursor-pointer transition-all ${
                    uploadMode === "url"
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Image URL
                </button>
              </div>
            </div>

            {uploadMode === "file" ? (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 hover:border-indigo-500 rounded-2xl p-6 bg-slate-50/50 hover:bg-slate-50 flex flex-col items-center justify-center space-y-2 cursor-pointer transition-all"
                >
                  <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="text-center space-y-0.5">
                    <p className="text-xs font-bold text-slate-800">
                      Click to browse image file from PC
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Supports PNG, JPG, WEBP (Max 5MB)
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/banner-graphic.jpg"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-mono text-slate-800 focus:outline-none focus:border-indigo-600"
              />
            )}
          </div>

          {/* Live Image Banner Preview */}
          {imageUrl && (
            <div className="h-32 rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 relative group">
              <Image
                src={imageUrl}
                alt="Preview"
                fill
                className="w-full h-full object-cover opacity-90"
              />
              <button
                type="button"
                onClick={() => setImageUrl("")}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 transition-colors cursor-pointer"
                title="Remove image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3 text-white pointer-events-none">
                <div>
                  <p className="font-heading font-black text-sm">
                    {title || "Headline Preview"}
                  </p>
                  <p className="text-[10px] text-slate-300">
                    {subtitle || "Subtitle Preview"}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
                Target Link URL
              </label>
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="/offers, /stores, etc."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
                CTA Button Text
              </label>
              <input
                type="text"
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
                placeholder="Shop Collection"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
                Sequence Order Priority
              </label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="bannerIsActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded-md text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer"
              />
              <label
                htmlFor="bannerIsActive"
                className="font-bold text-slate-700 select-none cursor-pointer"
              >
                Publish Live Immediately
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              {editingBanner ? "Save Changes" : "Create Banner"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
