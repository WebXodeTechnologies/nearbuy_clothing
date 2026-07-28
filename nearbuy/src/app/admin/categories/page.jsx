"use client";

import React, { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Card, { CardBody } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import useCategoryStore from "@/store/categoryStore";
import { toast } from "react-hot-toast";
import { Plus, Edit, Trash2, FolderOpen, Image as ImageIcon, Link2 } from "lucide-react";

export default function CategoriesPage() {
  const { categories, fetchCategories, createCategory, updateCategory, deleteCategory, loading } = useCategoryStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName("");
    setDescription("");
    setImage("https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80");
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || "");
    setImage(cat.image || "");
    setIsActive(cat.isActive !== false);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to permanently delete this category?")) {
      try {
        await deleteCategory(id);
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name,
      description,
      image,
      isActive,
    };

    try {
      if (editingCategory) {
        await updateCategory(editingCategory._id, payload);
      } else {
        await createCategory(payload);
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <DashboardHeader
        title="Apparel Categories Governance"
        description="Configure master clothing categories and lookbook filters shown on the public consumer directory website."
      >
        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </DashboardHeader>

      {/* Categories Table / Grid */}
      <Card className="bg-white">
        <CardBody className="p-0 overflow-x-auto">
          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-16">
              <div className="h-12 w-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <FolderOpen className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm">No Categories Configured</h3>
              <p className="text-xs text-gray-505 mt-1">Add your first directory category to list clothing lines.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-150 text-xs">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Category Details</th>
                  <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150">
                {categories.map((cat) => (
                  <tr key={cat._id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={cat.image || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=100&q=80"}
                          alt={cat.name}
                          className="h-10 w-10 rounded-lg border object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-semibold text-gray-900 block truncate">{cat.name}</span>
                          <span className="text-[10px] text-gray-400 font-semibold block">slug: {cat.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-semibold max-w-sm truncate">
                      {cat.description || "No description provided"}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={cat.isActive !== false ? "success" : "danger"} pill>
                        {cat.isActive !== false ? "Active" : "Disabled"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2.5">
                        <button
                          onClick={() => handleOpenEdit(cat)}
                          className="text-[11px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id)}
                          className="text-[11px] font-bold text-red-600 hover:text-red-800 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? "Edit Apparel Category" : "Add Apparel Category"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 font-body text-xs">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Category Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ethnic Silk Kurtas"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what shoppers will find under this catalog pill..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs font-semibold text-gray-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Category Hero Image URL
            </label>
            <input
              type="text"
              required
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-955 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="flex items-center gap-2 py-1">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
            />
            <label htmlFor="isActive" className="font-bold text-gray-700 select-none">
              Publish as active category filter
            </label>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md cursor-pointer"
            >
              {editingCategory ? "Save Changes" : "Create Category"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}