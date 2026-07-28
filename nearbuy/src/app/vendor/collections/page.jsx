"use client";

import React, { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import useCollectionStore from "@/store/collectionStore";
import useCategoryStore from "@/store/categoryStore";
import {
  FolderOpen,
  Plus,
  Search,
  Filter,
  Eye,
  MessageSquare,
  MoreVertical,
  Copy,
  Archive,
  Edit,
  Trash2,
  Sparkles,
  Tag,
} from "lucide-react";

export default function VendorCollections() {
  const { user } = useAuth();
  const { collections, fetchCollections, createCollection, updateCollection, deleteCollection, loading } = useCollectionStore();
  const { categories, fetchCategories } = useCategoryStore();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);

  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (user?.vendorId) {
      fetchCollections({ vendor: user.vendorId });
    }
  }, [user, fetchCollections]);

  const filtered = collections.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === "All" || item.categoryId?.name === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleOpenAdd = () => {
    setEditingCollection(null);
    setName("");
    setCategory(categories[0]?._id || "");
    setDescription("");
    setImage("https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (coll) => {
    setEditingCollection(coll);
    setName(coll.title);
    setCategory(coll.categoryId?._id || coll.categoryId || "");
    setDescription(coll.description);
    setImage(coll.images?.[0] || "");
    setIsModalOpen(true);
  };

  const handleDuplicate = async (coll) => {
    try {
      const payload = {
        title: `${coll.title} (Copy)`,
        categoryId: coll.categoryId?._id || coll.categoryId || undefined,
        description: coll.description,
        images: coll.images,
      };
      await createCollection(payload);
    } catch (e) {
      // toast shown in store
    }
  };

  const handleArchive = async (coll) => {
    try {
      await updateCollection(coll._id, { status: !coll.status });
      toast.success("Status updated!");
    } catch (e) {
      // toast shown in store
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this collection lookbook?")) {
      await deleteCollection(id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: name,
      categoryId: category || undefined,
      description,
      images: [image],
    };

    try {
      if (editingCollection) {
        await updateCollection(editingCollection._id, payload);
      } else {
        await createCollection(payload);
      }
      setIsModalOpen(false);
    } catch {
      // toast shown in store
    }
  };

  return (
    <div className="space-y-8 font-body pb-12">
      <DashboardHeader
        title="Store Collections & Lookbooks"
        description="Showcase your current in-store rack designs, seasonal releases, and clothing lines to attract local footfall."
        badge="Lookbooks"
      >
        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Publish Lookbook
        </button>
      </DashboardHeader>

      {/* Sticky Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-[#ECECEC] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 sticky top-16 z-10">
        <div className="flex items-center gap-3 w-full md:w-auto bg-slate-50 border border-slate-200/80 px-4 py-2 rounded-2xl">
          <Search className="w-4 h-4 text-indigo-600 shrink-0" />
          <input
            type="text"
            placeholder="Search collections..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none w-full md:w-64"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-none py-1">
          {["All", ...categories.map((c) => c.name)].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Collections Card Grid */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#ECECEC] rounded-3xl max-w-xl mx-auto shadow-xs p-8">
          <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-100">
            <FolderOpen className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-slate-900 text-base">No Lookbooks Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed font-medium">
            Publish your first collection lookbook to feature what is currently available inside your shop.
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-5 px-5 py-2.5 rounded-2xl bg-indigo-600 text-white text-xs font-bold shadow-md hover:bg-indigo-700 transition-colors"
          >
            Add Collection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((coll) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={coll._id}
              className="bg-white rounded-3xl border border-[#ECECEC] shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group"
            >
              {/* Image Header with Badges */}
              <div className="h-52 w-full relative overflow-hidden bg-slate-100">
                <img
                  src={coll.images?.[0] || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80"}
                  alt={coll.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  {coll.featured && (
                    <span className="bg-indigo-600 text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 fill-white" /> Featured
                    </span>
                  )}
                  <span
                    className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full shadow-xs ${
                      coll.status
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-700 text-white"
                    }`}
                  >
                    {coll.status ? "Active" : "Archived"}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider">
                    {coll.categoryId?.name || "Uncategorized"}
                  </span>
                  <h3 className="text-base font-heading font-bold text-slate-900 mt-0.5 leading-tight">
                    {coll.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium line-clamp-2 mt-1.5 leading-relaxed">
                    {coll.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-indigo-600" /> {coll.views || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-teal-600" /> {coll.clicks || 0}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDuplicate(coll)}
                      title="Duplicate"
                      className="p-1.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(coll)}
                      title="Edit"
                      className="p-1.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleArchive(coll)}
                      title={coll.status ? "Archive" : "Activate"}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(coll._id)}
                      title="Delete"
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Publish/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCollection ? "Edit Collection Lookbook" : "Publish Store Lookbook"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 font-body">
          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
              Collection Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Winter Tweed Jackets 2026"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
              Apparel Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
              Description & Rack Availability
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Fabric details, size ranges, or seasonal highlights..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-medium text-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
              Image URL
            </label>
            <input
              type="text"
              required
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-950 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md cursor-pointer"
            >
              {editingCollection ? "Save Changes" : "Publish Lookbook"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
