"use client";

import React, { useState, useEffect, useMemo } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Card, { CardBody } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import useCategoryStore from "@/store/categoryStore";
import { toast } from "react-hot-toast";
import {
  Plus,
  Edit3,
  Trash2,
  FolderOpen,
  RefreshCw,
  Search,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Layers,
  CheckCircle2,
  XCircle,
  Eye,
  Shirt,
} from "lucide-react";

// Client-specified category ordering hierarchy
const MANDATED_CATEGORY_ORDER = [
  "MEN'S WEAR",
  "WOMEN'S WEAR",
  "KIDS",
  "AUTHENTIC WEAR",
  "SPORTS WEAR",
  "WINTERWEAR",
  "ACCESSORIES",
];

export default function CategoriesPage() {
  const {
    categories,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    loading,
  } = useCategoryStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Order categories strictly according to client specs, then custom sortOrder
  const sortedAndFilteredCategories = useMemo(() => {
    if (!categories) return [];

    const list = [...categories];

    // Priority index map based on requested order
    const getPriority = (catName) => {
      const upper = (catName || "").toUpperCase().trim();
      const matchIndex = MANDATED_CATEGORY_ORDER.findIndex(
        (target) => upper.includes(target) || target.includes(upper)
      );
      return matchIndex !== -1 ? matchIndex : 999;
    };

    list.sort((a, b) => {
      const pA = getPriority(a.name);
      const pB = getPriority(b.name);

      if (pA !== pB) return pA - pB;
      return (a.sortOrder || 0) - (b.sortOrder || 0);
    });

    if (!search.trim()) return list;

    const query = search.toLowerCase();
    return list.filter(
      (c) =>
        c.name?.toLowerCase().includes(query) ||
        c.description?.toLowerCase().includes(query) ||
        c.slug?.toLowerCase().includes(query)
    );
  }, [categories, search]);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName("");
    setDescription("");
    setImage(
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80"
    );
    setIsActive(true);
    setSortOrder((categories?.length || 0) + 1);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || "");
    setImage(cat.image || "");
    setIsActive(cat.isActive !== false);
    setSortOrder(cat.sortOrder || 0);
    setIsModalOpen(true);
  };

  const handleDelete = async (id, catName) => {
    if (
      confirm(
        `Are you sure you want to permanently delete category "${catName || "this item"
        }"?`
      )
    ) {
      setActionLoadingId(id);
      try {
        await deleteCategory(id);
        toast.success("Category removed successfully");
        await fetchCategories();
      } catch (err) {
        toast.error(err.message || "Failed to delete category");
      } finally {
        setActionLoadingId(null);
      }
    }
  };

  const handleToggleActive = async (cat) => {
    const id = cat._id || cat.id;
    setActionLoadingId(id);
    try {
      const newStatus = !(cat.isActive !== false);
      await updateCategory(id, { isActive: newStatus });
      toast.success(
        newStatus ? "Category published live" : "Category hidden from public menu"
      );
      await fetchCategories();
    } catch (err) {
      toast.error(err.message || "Failed to update category status");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name,
      description,
      image,
      isActive,
      sortOrder: Number(sortOrder) || 0,
    };

    try {
      if (editingCategory) {
        await updateCategory(editingCategory._id || editingCategory.id, payload);
        toast.success("Category updated successfully");
      } else {
        await createCategory(payload);
        toast.success("New apparel category created");
      }
      setIsModalOpen(false);
      await fetchCategories();
    } catch (err) {
      toast.error(err.message || "Failed to save category");
    }
  };

  return (
    <div className="space-y-6 font-body pb-12">
      {/* 1. Dashboard Header */}
      <DashboardHeader
        title="Apparel Categories Governance"
        description="Organize master clothing lines into structured shopper navigation for Men's, Women's, Kids, Authentic, and Accessories."
        badge="Taxonomy Engine v2.0"
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fetchCategories()}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
            title="Refresh List"
          >
            <RefreshCw
              className={`w-4 h-4 ${loading ? "animate-spin text-indigo-600" : ""
                }`}
            />
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Category</span>
          </button>
        </div>
      </DashboardHeader>

      {/* 2. Mandatory Sequence Strip & Search Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        {/* Visual Pill Order Indicator */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>Client Order Sequence</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
            {MANDATED_CATEGORY_ORDER.map((item, idx) => (
              <span
                key={item}
                className="bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-xl text-[10px] font-bold text-slate-700 whitespace-nowrap flex items-center gap-1.5"
              >
                <span className="w-4 h-4 rounded-full bg-indigo-50 text-indigo-700 text-[9px] font-black flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span>{item}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80 pt-1">
          <input
            type="text"
            placeholder="Filter category names..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-slate-800"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
        </div>
      </div>

      {/* 3. Category Grid Showcase */}
      {loading && !categories?.length ? (
        <div className="py-16 flex flex-col items-center justify-center space-y-3 bg-white rounded-3xl border border-slate-200/80">
          <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
          <span className="text-xs font-bold text-slate-500">
            Loading taxonomy catalog...
          </span>
        </div>
      ) : sortedAndFilteredCategories.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200/80 rounded-3xl max-w-xl mx-auto shadow-xs space-y-3 p-6">
          <div className="h-12 w-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
            <FolderOpen className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-black text-slate-900 text-sm">
            No Categories Found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No master apparel category records match your current filter query.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedAndFilteredCategories.map((cat, index) => {
            const catId = cat._id || cat.id;
            const isProcessing = actionLoadingId === catId;
            const activeState = cat.isActive !== false;

            return (
              <div
                key={catId}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:border-indigo-200 transition-all overflow-hidden flex flex-col justify-between group"
              >
                {/* Visual Banner Container */}
                <div className="relative h-36 bg-slate-100 overflow-hidden">
                  <img
                    src={
                      cat.image ||
                      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80"
                    }
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  {/* Sequence Position Tag */}
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white px-2.5 py-1 rounded-xl text-[10px] font-black font-mono shadow-xs border border-white/20">
                    Pos #{index + 1}
                  </div>

                  {/* Active Toggle Badge */}
                  <div className="absolute top-3 right-3">
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleToggleActive(cat)}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider backdrop-blur-md border transition-all cursor-pointer ${activeState
                          ? "bg-emerald-500/90 text-white border-emerald-400"
                          : "bg-rose-500/90 text-white border-rose-400"
                        }`}
                    >
                      {activeState ? "Live" : "Hidden"}
                    </button>
                  </div>

                  {/* Title Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 space-y-0.5 text-white">
                    <h3 className="font-heading font-black text-base truncate">
                      {cat.name}
                    </h3>
                    <p className="text-[10px] text-slate-300 font-mono truncate">
                      slug: {cat.slug || "n/a"}
                    </p>
                  </div>
                </div>

                {/* Card Content Description */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {cat.description || "No category description provided."}
                  </p>

                  {/* Bottom Action Strip */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      Priority: {cat.sortOrder || index + 1}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(cat)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-[10px] transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3 text-slate-500" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handleDelete(catId, cat.name)}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Edit / Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          editingCategory ? "Edit Apparel Category" : "Add New Apparel Category"
        }
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 font-body text-xs">
          <div>
            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Men's Wear, Women's Wear, Kids, Authentic Wear..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what apparel styles shoppers will explore in this catalog pill..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
              Category Hero Image URL
            </label>
            <input
              type="text"
              required
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-mono text-slate-800 focus:outline-none focus:border-indigo-600"
            />
          </div>

          {/* Live Image Preview */}
          {image && (
            <div className="h-24 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 relative">
              <img
                src={image}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1.5 right-2 bg-slate-900/80 text-white text-[9px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                Live Banner Preview
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
                Display Order Priority
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
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded-md text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer"
              />
              <label
                htmlFor="isActive"
                className="font-bold text-slate-700 select-none cursor-pointer"
              >
                Publish as Live Filter
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
              {editingCategory ? "Save Changes" : "Create Category"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}