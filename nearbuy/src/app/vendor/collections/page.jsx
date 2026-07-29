"use client";

import React, { useState, useEffect, useRef } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Modal from "@/components/ui/Modal";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import useCollectionStore from "@/store/collectionStore";
import useCategoryStore from "@/store/categoryStore";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Camera,
  CheckCircle2,
  XCircle,
  ShoppingBag,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";

export default function VendorCollections() {
  const { user } = useAuth();
  const {
    collections,
    fetchCollections,
    createCollection,
    updateCollection,
    deleteCollection,
    loading,
  } = useCollectionStore();
  const { categories, fetchCategories } = useCategoryStore();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Hidden File Input Ref
  const imageInputRef = useRef(null);

  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [inStock, setInStock] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (user?.vendorId) {
      fetchCollections({ vendor: user.vendorId });
    }
  }, [user, fetchCollections]);

  const resetForm = () => {
    setName("");
    setCategory(categories[0]?._id || "");
    setPrice("");
    setDescription("");
    setImage("");
    setInStock(true);
    setEditingCollection(null);
  };

  const filtered = collections.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCat =
      selectedCategory === "All" ||
      item.categoryId?.name === selectedCategory ||
      item.categoryIds?.some((c) => c.name === selectedCategory);
    return matchesSearch && matchesCat;
  });

  const handleOpenAdd = () => {
    resetForm();
    setCategory(categories[0]?._id || "");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (coll) => {
    setEditingCollection(coll);
    setName(coll.title || "");
    const catId =
      coll.categoryId?._id ||
      coll.categoryId ||
      (coll.categoryIds && coll.categoryIds[0]?._id) ||
      (coll.categoryIds && coll.categoryIds[0]) ||
      categories[0]?._id ||
      "";
    setCategory(catId);
    setPrice(coll.price !== undefined && coll.price !== null ? String(coll.price) : "");
    setDescription(coll.description || "");
    setImage(coll.images?.[0] || coll.coverImage || "");
    setInStock(coll.status !== false);
    setIsModalOpen(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (JPG, PNG, WEBP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Photo size should be under 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      toast.success("Photo loaded cleanly!");
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = (id) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3 font-body">
          <p className="text-xs font-bold text-slate-800">
            Are you sure you want to delete this design album?
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
                const toastId = toast.loading("Deleting design album...");
                try {
                  await deleteCollection(id);
                  toast.success("Design album deleted successfully!", { id: toastId });
                } catch (err) {
                  toast.error(err?.message || "Failed to delete album", { id: toastId });
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 transition-colors cursor-pointer shadow-xs"
            >
              Delete Album
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

  const handleToggleStock = async (coll) => {
    const newStatus = !coll.status;
    const toastId = toast.loading("Updating availability status...");
    try {
      await updateCollection(coll._id, { status: newStatus });
      toast.success(
        newStatus ? "Marked as Available in Shop! 🟢" : "Marked as Out of Stock 🔴",
        { id: toastId }
      );
    } catch (err) {
      toast.error(err?.message || "Failed to update status", { id: toastId });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter a collection or saree name");
      return;
    }
    if (!image) {
      toast.error("Please upload a photo of the clothing item");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading(
      editingCollection ? "Saving changes..." : "Publishing album to shop..."
    );

    const payload = {
      title: name,
      categoryId: category || undefined,
      price: price ? Number(price) : 0,
      description,
      images: [image],
      coverImage: image,
      status: inStock,
    };

    try {
      if (editingCollection) {
        await updateCollection(editingCollection._id, payload);
        toast.success("Collection updated successfully!", { id: toastId });
      } else {
        await createCollection(payload);
        toast.success("New design album added to shop!", { id: toastId });
      }
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      toast.error(err?.message || "Failed to save design album", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-body pb-12">
      {/* Hidden Native File Input */}
      <input
        type="file"
        ref={imageInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Header */}
      <DashboardHeader
        title="Shop Collections & New Arrivals"
        description="Upload photos of your latest sarees, shirts, and festive collections so local Namakkal buyers can see what is inside your shop."
        badge="Design Showcase"
      >
        <button
          onClick={handleOpenAdd}
          className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Design Album</span>
        </button>
      </DashboardHeader>

      {/* Search & Category Filter Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="flex items-center gap-2.5 w-full md:w-80 bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by saree or outfit name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none w-full"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-none py-1">
          {["All", ...categories.map((c) => c.name)].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${selectedCategory === cat
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Collections Grid */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200/80 rounded-3xl max-w-md mx-auto shadow-xs p-8">
          <div className="h-16 w-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-indigo-100">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="font-heading font-black text-slate-900 text-lg">
            No Collections Added Yet
          </h3>
          <p className="text-xs text-slate-500 mt-1.5 font-medium leading-relaxed">
            Upload photos of your latest dresses, sarees, or festive wear to showcase them to local shoppers in Namakkal.
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-6 px-6 py-3 rounded-2xl bg-indigo-600 text-white text-xs font-black shadow-md hover:bg-indigo-500 transition-colors cursor-pointer"
          >
            Add Your First Album
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((coll) => {
            const cardImg =
              coll.images?.[0] ||
              coll.coverImage ||
              "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80";

            return (
              <div
                key={coll._id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                {/* Photo Header */}
                <div className="h-60 w-full relative overflow-hidden bg-slate-900">
                  <Image
                    src={cardImg}
                    alt={coll.title || "Collection photo"}
                    fill
                    unoptimized={cardImg.startsWith("data:")}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Stock Availability Toggle Button */}
                  <div className="absolute top-3 left-3">
                    <button
                      type="button"
                      onClick={() => handleToggleStock(coll)}
                      className={`px-3 py-1 rounded-full text-[10px] font-black border backdrop-blur-md flex items-center gap-1 cursor-pointer transition-all ${coll.status !== false
                          ? "bg-emerald-500/90 text-white border-emerald-400"
                          : "bg-rose-600/90 text-white border-rose-400"
                        }`}
                    >
                      {coll.status !== false ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> Available in Shop
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" /> Out of Stock
                        </>
                      )}
                    </button>
                  </div>

                  {/* Action Buttons (Edit & Delete) */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(coll)}
                      className="p-2 bg-slate-950/70 hover:bg-indigo-600 text-white rounded-xl transition-colors cursor-pointer backdrop-blur-md"
                      title="Edit Product"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(coll._id)}
                      className="p-2 bg-slate-950/70 hover:bg-rose-600 text-white rounded-xl transition-colors cursor-pointer backdrop-blur-md"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-1 rounded-full">
                      {coll.categoryId?.name ||
                        (coll.categoryIds && coll.categoryIds[0]?.name) ||
                        "Apparel Collection"}
                    </span>

                    {coll.price > 0 && (
                      <span className="text-sm font-black text-slate-900">
                        ₹{coll.price.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-heading font-black text-slate-900 line-clamp-1">
                    {coll.title}
                  </h3>

                  {coll.description && (
                    <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                      {coll.description}
                    </p>
                  )}

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 w-full justify-center">
                      💬 Direct WhatsApp Enquiries Enabled
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingCollection ? "Edit Product Album" : "Add New Design / Saree Album"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 font-body pt-2">
          {/* Photo Uploader */}
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
              Album / Outfit Photo
            </label>
            <div
              onClick={() => imageInputRef.current?.click()}
              className="h-44 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 transition-all flex flex-col items-center justify-center cursor-pointer relative overflow-hidden group"
            >
              {image ? (
                <>
                  <Image
                    src={image}
                    alt="Preview"
                    fill
                    unoptimized={image.startsWith("data:")}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                    <Camera className="w-4 h-4" /> Change Photo
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-400 p-4 text-center">
                  <div className="p-3 rounded-full bg-indigo-50 text-indigo-600">
                    <Camera className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">
                    Click here to choose photo from Mobile/PC
                  </span>
                  <span className="text-[10px] text-slate-400">
                    JPG, PNG or WEBP (Max 5MB)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Title / Name */}
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
              Design / Collection Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Wedding Kanchipuram Silk Sarees"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
            />
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Apparel Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600 cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Starting Price (₹) (Optional)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 4500"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
              Details / Color Options (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Pure Zari silk, available in Red, Maroon and Gold colors."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
            />
          </div>

          {/* In Stock Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-700">
              Is this item available in your shop?
            </span>
            <button
              type="button"
              onClick={() => setInStock(!inStock)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${inStock
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-400 text-white"
                }`}
            >
              {inStock ? "🟢 Available" : "🔴 Out of Stock"}
            </button>
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
              className="px-5 py-2.5 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-md cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : editingCollection ? (
                "Save Changes"
              ) : (
                "Publish Album"
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}