"use client";

import React, { useState } from "react";
import CollectionCard from "../../components/cards/CollectionCard";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";

const INITIAL_COLLECTIONS = [
  {
    id: "coll-1-1",
    name: "Summer Linen Collection",
    description: "Lightweight, breathable linen shirts and trousers in pastel shades.",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80",
    status: "Active"
  },
  {
    id: "coll-1-2",
    name: "Urban Streetwear v3",
    description: "Oversized graphic tees, cargo pants, and distressed denim garments.",
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=400&q=80",
    status: "Active"
  }
];

export default function VendorCollections() {
  const [collections, setCollections] = useState(INITIAL_COLLECTIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const handleOpenAdd = () => {
    setEditingCollection(null);
    setName("");
    setDescription("");
    setImage("https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=400&q=80");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (coll) => {
    setEditingCollection(coll);
    setName(coll.name);
    setDescription(coll.description);
    setImage(coll.image);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this collection?")) {
      setCollections(collections.filter((c) => c.id !== id));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!name || !description || !image) return;

    if (editingCollection) {
      // Edit mode
      setCollections(
        collections.map((c) =>
          c.id === editingCollection.id ? { ...c, name, description, image } : c
        )
      );
    } else {
      // Add mode
      const newColl = {
        id: `coll-new-${Date.now()}`,
        name,
        description,
        image,
        status: "Active"
      };
      setCollections([...collections, newColl]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Store Collections & Lookbooks"
        description="Display your current seasonal designs, custom works, and apparel lines."
      >
        <Button onClick={handleOpenAdd} size="sm">
          Publish Lookbook
        </Button>
      </DashboardHeader>

      {collections.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-150 rounded-2xl max-w-xl mx-auto shadow-xs">
          <div className="h-12 w-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="font-bold text-gray-900 text-sm">No Lookbooks Published</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto leading-relaxed">
            Create your first lookbook collection to showcase what is currently hanging on your store racks.
          </p>
          <Button onClick={handleOpenAdd} size="sm" className="mt-5">
            Add Collection
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((coll) => (
            <CollectionCard
              key={coll.id}
              collection={coll}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              isManageMode={true}
            />
          ))}
        </div>
      )}

      {/* Upload/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCollection ? "Edit Lookbook" : "Publish New Lookbook"}
        size="md"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input
            label="Collection Title"
            name="name"
            placeholder="e.g. Winter Tweed Collection"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-semibold text-gray-700">Lookbook Description</label>
            <textarea
              rows={3}
              placeholder="What fabric is used? What sizes are available? Is it casual or wedding wear?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-sm block border border-gray-250 rounded-lg p-2.5 outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
              required
            />
          </div>

          <Input
            label="Collection Cover Image URL"
            name="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              {editingCollection ? "Save Changes" : "Publish Lookbook"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
