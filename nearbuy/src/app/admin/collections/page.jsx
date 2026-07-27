"use client";

import React, { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Card, { CardBody } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import useCollectionStore from "@/store/collectionStore";
import { toast } from "react-hot-toast";
import { Eye, MessageSquare, Trash2, FolderOpen, ExternalLink } from "lucide-react";

export default function CollectionsPage() {
  const { collections, fetchCollections, deleteCollection, loading } = useCollectionStore();
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCollections({ all: true });
  }, [fetchCollections]);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to permanently delete this lookbook/collection?")) {
      try {
        await deleteCollection(id);
        fetchCollections({ all: true });
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  const filtered = collections.filter((c) =>
    (c.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.description || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.vendorId?.businessName || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      <DashboardHeader
        title="Boutique Catalog Lookbooks"
        description="Monitor seasonal catalogs, rack showcase collections, and apparel lines published by physical merchants."
      />

      {/* Toolbar */}
      <div className="bg-white border border-gray-150 p-4 rounded-xl shadow-xs">
        <div className="max-w-md">
          <Input
            name="search"
            placeholder="Search lookbooks by title, description, or vendor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={(props) => (
              <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          />
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="py-16 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl max-w-xl mx-auto">
          <div className="h-12 w-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
            <FolderOpen className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 text-sm">No Lookbooks Found</h3>
          <p className="text-xs text-gray-505 mt-1">No collections match your current search queries.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((coll) => (
            <div
              key={coll._id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col justify-between group shadow-2xs hover:shadow-md transition-all duration-200"
            >
              {/* Photo Banner */}
              <div className="h-44 w-full relative bg-gray-100 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coll.images?.[0] || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80"}
                  alt={coll.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <Badge variant={coll.status ? "success" : "danger"}>
                    {coll.status ? "Live" : "Inactive"}
                  </Badge>
                </div>
              </div>

              {/* Card Contents */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider">
                    {coll.categoryId?.name || "Uncategorized"}
                  </span>
                  <h3 className="text-sm font-bold text-gray-900 leading-snug">{coll.title}</h3>
                  <p className="text-xs text-gray-500 font-semibold line-clamp-2 leading-relaxed">
                    {coll.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 space-y-3">
                  {/* Vendor Tag */}
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-600 bg-gray-50 p-2 rounded-xl border border-gray-100">
                    <span className="truncate block max-w-[150px]">Vendor: {coll.vendorId?.businessName || "Unknown Business"}</span>
                    <Badge variant="warning" pill>
                      IMP
                    </Badge>
                  </div>

                  {/* Views / Clicks / Delete Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-xs text-gray-400 font-bold">
                      <span className="flex items-center gap-0.5">
                        <Eye className="w-3.5 h-3.5" /> {coll.views || 0}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <MessageSquare className="w-3.5 h-3.5" /> {coll.clicks || 0}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDelete(coll._id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Remove lookbook"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}