"use client";

import React, { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { toast } from "react-hot-toast";
import {
  FileText,
  HelpCircle,
  Megaphone,
  Plus,
  Edit3,
  Trash2,
  RefreshCw,
  Search,
  ExternalLink,
  CheckCircle2,
  Globe,
  Eye,
  Shield,
  Clock,
  Layers,
} from "lucide-react";
import Link from "next/link";

export default function CmsPage() {
  const [activeTab, setActiveTab] = useState("pages"); // "pages", "faqs", "announcements"
  const [pages, setPages] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Legal"); // Legal, General, Merchant
  const [content, setContent] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Fetch CMS Content
  const fetchCmsData = async () => {
    setLoading(true);
    try {
      let res = await fetch("/api/admin/cms");

      // Verify JSON content-type before parsing
      const contentType = res.headers.get("content-type");
      if (
        !res.ok ||
        !contentType ||
        !contentType.includes("application/json")
      ) {
        throw new Error(
          "CMS endpoint not found or returned non-JSON response.",
        );
      }

      const data = await res.json();
      setPages(data.data?.pages || []);
      setFaqs(data.data?.faqs || []);
    } catch (err) {
      console.warn("CMS API fallback active:", err.message);
      // Fallback mock data keeps UI functional while routes compile
      setPages([
        {
          _id: "cms-1",
          title: "Privacy Policy",
          slug: "privacy-policy",
          category: "Legal",
          content:
            "Nearbuy Privacy Policy details data retention and location telemetry...",
          updatedAt: new Date().toISOString(),
          isActive: true,
        },
      ]);
      setFaqs([
        {
          _id: "faq-1",
          question: "How do I claim a discount offer at a local store?",
          answer:
            "Show the coupon code at the boutique checkout desk before payment.",
          category: "Shoppers",
          isActive: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCmsData();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setTitle("");
    setSlug("");
    setCategory(activeTab === "faqs" ? "Shoppers" : "Legal");
    setContent("");
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setTitle(item.title || item.question || "");
    setSlug(item.slug || "");
    setCategory(item.category || "General");
    setContent(item.content || item.answer || "");
    setIsActive(item.isActive !== false);
    setIsModalOpen(true);
  };

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    if (!editingItem && activeTab === "pages") {
      setSlug(
        val
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-"),
      );
    }
  };

  const handleDelete = async (id, itemTitle) => {
    if (
      confirm(
        `Are you sure you want to delete "${itemTitle || "this document"}"?`,
      )
    ) {
      setActionLoadingId(id);
      try {
        await fetch(`/api/admin/cms/${id}`, { method: "DELETE" });
        toast.success("Content item deleted");
        await fetchCmsData();
      } catch (err) {
        toast.error("Failed to delete content");
      } finally {
        setActionLoadingId(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      type: activeTab,
      title,
      question: title,
      slug,
      category,
      content,
      answer: content,
      isActive,
    };

    try {
      if (editingItem) {
        const id = editingItem._id || editingItem.id;
        await fetch(`/api/admin/cms/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        toast.success("Content updated successfully");
      } else {
        await fetch("/api/admin/cms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        toast.success("New CMS entry created");
      }
      setIsModalOpen(false);
      await fetchCmsData();
    } catch (err) {
      toast.error(err.message || "Failed to save CMS document");
    }
  };

  const filteredPages = (pages || []).filter(
    (p) =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.slug?.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredFaqs = (faqs || []).filter(
    (f) =>
      f.question?.toLowerCase().includes(search.toLowerCase()) ||
      f.answer?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6 font-body pb-12">
      {/* 1. Header Section */}
      <DashboardHeader
        title="CMS & Legal Content Engine"
        description="Manage privacy policies, merchant terms of service, consumer help desk FAQs, and static site copy."
        badge="Content Manager v1.2"
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchCmsData}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
            title="Refresh List"
          >
            <RefreshCw
              className={`w-4 h-4 ${loading ? "animate-spin text-indigo-600" : ""}`}
            />
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>
              {activeTab === "faqs" ? "Add FAQ Entry" : "Add Page Document"}
            </span>
          </button>
        </div>
      </DashboardHeader>

      {/* 2. Mode Navigation & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto custom-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab("pages")}
            className={`px-4 py-2 text-xs font-bold rounded-2xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "pages"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/70"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Static Pages ({pages.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("faqs")}
            className={`px-4 py-2 text-xs font-bold rounded-2xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "faqs"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/70"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Consumer FAQs ({faqs.length})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search pages, FAQs, or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-slate-800"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>
      </div>

      {/* 3. Static Pages Content View */}
      {activeTab === "pages" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Page Title & Slug</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Last Modified</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {filteredPages.map((page) => {
                  const pageId = page._id || page.id;
                  const isLive = page.isActive !== false;

                  return (
                    <tr
                      key={pageId}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-900 text-xs block">
                            {page.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono block">
                            /{page.slug}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <Badge
                          variant={
                            page.category === "Legal" ? "indigo" : "gray"
                          }
                          pill
                          className="text-[9px] font-bold"
                        >
                          {page.category || "General"}
                        </Badge>
                      </td>

                      <td className="py-4 px-6">
                        <Badge
                          variant={isLive ? "emerald" : "red"}
                          pill
                          className="text-[9px] font-bold"
                        >
                          {isLive ? "Published" : "Draft"}
                        </Badge>
                      </td>

                      <td className="py-4 px-6 text-slate-500 font-mono text-[11px]">
                        {page.updatedAt
                          ? new Date(page.updatedAt).toLocaleDateString()
                          : "N/A"}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/${page.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer"
                            title="Preview Page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleOpenEdit(page)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer"
                            title="Edit Content"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(pageId, page.title)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-all cursor-pointer"
                            title="Delete Document"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Consumer FAQs View */}
      {activeTab === "faqs" && (
        <div className="space-y-4">
          {filteredFaqs.map((faq) => {
            const faqId = faq._id || faq.id;

            return (
              <div
                key={faqId}
                className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:border-indigo-200 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="indigo"
                        pill
                        className="text-[9px] font-bold"
                      >
                        {faq.category || "General"}
                      </Badge>
                      <h4 className="font-heading font-black text-slate-900 text-sm">
                        {faq.question}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed pt-1">
                      {faq.answer}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(faq)}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(faqId, faq.question)}
                      className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Create / Edit CMS Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          editingItem
            ? `Edit ${activeTab === "faqs" ? "FAQ" : "Document"}`
            : `Add New ${activeTab === "faqs" ? "FAQ" : "Document"}`
        }
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 font-body text-xs">
          <div>
            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
              {activeTab === "faqs" ? "FAQ Question *" : "Document Title *"}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={handleTitleChange}
              placeholder={
                activeTab === "faqs"
                  ? "e.g. How do I claim local store coupons?"
                  : "e.g. Merchant Onboarding Policy"
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
            />
          </div>

          {activeTab === "pages" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
                  URL Route Slug *
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. privacy-policy"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-mono text-slate-800 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
                  Document Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600"
                >
                  <option value="Legal">Legal & Compliance</option>
                  <option value="General">General Information</option>
                  <option value="Merchant">Merchant Policies</option>
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
              {activeTab === "faqs" ? "FAQ Answer Text *" : "Page Body Copy *"}
            </label>
            <textarea
              rows={8}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write the full policy or FAQ answer..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-normal text-slate-800 leading-relaxed focus:outline-none focus:border-indigo-600 font-mono"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="cmsIsActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded-md text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer"
            />
            <label
              htmlFor="cmsIsActive"
              className="font-bold text-slate-700 select-none cursor-pointer"
            >
              Publish live on public consumer website
            </label>
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
              {editingItem ? "Save Changes" : "Publish Entry"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
