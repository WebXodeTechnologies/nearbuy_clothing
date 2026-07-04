"use client";

import React, { useState } from "react";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import Card, { CardBody } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";

const INITIAL_GALLERY = [
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1567401893930-7becd1127e6f?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=400&q=80"
];

export default function VendorGallery() {
  const [gallery, setGallery] = useState(INITIAL_GALLERY);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const handleAddImage = (e) => {
    e.preventDefault();
    if (!imageUrl) return;
    setGallery([...gallery, imageUrl]);
    setImageUrl("");
    setIsModalOpen(false);
  };

  const handleDelete = (index) => {
    if (confirm("Are you sure you want to remove this image from your store gallery?")) {
      setGallery(gallery.filter((_, idx) => idx !== index));
    }
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Store Gallery Showcase"
        description="Manage the high-resolution photo gallery displayed on your public storefront profile page."
      >
        <Button onClick={() => setIsModalOpen(true)} size="sm">
          Upload Store Photo
        </Button>
      </DashboardHeader>

      {gallery.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-150 rounded-2xl max-w-xl mx-auto shadow-xs">
          <div className="h-12 w-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="font-bold text-gray-900 text-sm">No Photos in Gallery</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto leading-relaxed">
            Upload photos of your store interior, physical collections, and storefront styling to attract walk-in shoppers.
          </p>
          <Button onClick={() => setIsModalOpen(true)} size="sm" className="mt-5">
            Add Image
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {gallery.map((img, idx) => (
            <div key={idx} className="bg-white border border-gray-150 rounded-xl overflow-hidden shadow-xs group relative flex flex-col justify-between">
              <div className="h-44 bg-gray-100 relative">
                <img src={img} alt={`Showcase ${idx + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleDelete(idx)}
                    className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                  >
                    Delete Photo
                  </button>
                </div>
              </div>
              <div className="p-3 text-[10px] text-gray-400 font-semibold truncate border-t border-gray-50 bg-gray-50/50">
                Photo #{idx + 1} URL
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Photo Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Upload Store Gallery Photo"
        size="md"
      >
        <form onSubmit={handleAddImage} className="space-y-4">
          <Input
            label="Image Asset URL"
            name="imageUrl"
            placeholder="https://images.unsplash.com/... or relative path"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
          />

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Add Photo
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
