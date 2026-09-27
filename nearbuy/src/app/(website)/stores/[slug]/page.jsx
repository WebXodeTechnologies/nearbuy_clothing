"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  Heart,
  MessageCircle,
  Share2,
  X,
  MapPin,
  Clock,
  Phone,
  Sparkles,
  MessageSquare,
  ArrowUpDown,
  Filter,
} from "lucide-react";
import toast from "react-hot-toast";

import OfferCard from "@/components/cards/OfferCard";
import Badge from "@/components/ui/Badge";
import Breadcrumb from "@/components/navigation/Breadcrumb";

const contentVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const gridItemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 85, damping: 14 },
  },
};

const STANDARD_CATEGORIES = ["Men", "Women", "Kids", "Accessories", "Footwear"];

const normalizeCategoryName = (catStr) => {
  if (!catStr || typeof catStr !== "string") return "";
  const clean = catStr.trim();
  const lower = clean.toLowerCase();

  if (lower.includes("women")) return "Women";
  if (lower.includes("men") || lower === "mens") return "Men";
  if (lower.includes("kid") || lower.includes("child")) return "Kids";
  if (
    lower.includes("footwear") ||
    lower.includes("shoe") ||
    lower.includes("sneaker") ||
    lower.includes("heel") ||
    lower.includes("sandal")
  ) {
    return "Footwear";
  }
  if (lower.includes("accessor")) return "Accessories";
  if (lower.includes("ethnic")) return "Ethnic Wear";
  if (lower.includes("boutique")) return "Boutique";

  return clean;
};

const extractItemCategories = (item) => {
  if (!item) return { primary: "Accessories", all: ["Accessories"] };
  const categoriesSet = new Set();

  // 1. categoryIds array
  if (Array.isArray(item.categoryIds) && item.categoryIds.length > 0) {
    item.categoryIds.forEach((cat) => {
      if (typeof cat === "object" && cat !== null) {
        if (cat.name) categoriesSet.add(normalizeCategoryName(cat.name));
      } else if (typeof cat === "string" && cat.trim()) {
        categoriesSet.add(normalizeCategoryName(cat));
      }
    });
  }

  // 2. category field (object or string)
  if (typeof item.category === "object" && item.category !== null) {
    if (item.category.name) categoriesSet.add(normalizeCategoryName(item.category.name));
    if (item.category.title) categoriesSet.add(normalizeCategoryName(item.category.title));
  } else if (typeof item.category === "string" && item.category.trim()) {
    categoriesSet.add(normalizeCategoryName(item.category));
  }

  // 3. categoryName or categoryId
  if (typeof item.categoryName === "string" && item.categoryName.trim()) {
    categoriesSet.add(normalizeCategoryName(item.categoryName));
  }
  if (typeof item.categoryId === "object" && item.categoryId?.name) {
    categoriesSet.add(normalizeCategoryName(item.categoryId.name));
  }

  // 4. folder field (from gallery)
  if (typeof item.folder === "string" && item.folder.trim()) {
    categoriesSet.add(normalizeCategoryName(item.folder));
  }

  // 5. tags array
  if (Array.isArray(item.tags)) {
    item.tags.forEach((t) => {
      if (typeof t === "string" && t.trim()) {
        const norm = normalizeCategoryName(t);
        if (STANDARD_CATEGORIES.concat(["Ethnic Wear", "Boutique"]).includes(norm)) {
          categoriesSet.add(norm);
        }
      }
    });
  }

  const all = Array.from(categoriesSet).filter(Boolean);
  const primary = all.length > 0 ? all[0] : "Accessories";
  return { primary, all: all.length > 0 ? all : ["Accessories"] };
};

export default function StoreDetailsPage({ params }) {
  const resolvedParams = React.use(params);
  const slug = resolvedParams?.slug;
  const { data: session } = useSession();
  const currentUserId =
    session?.user?.id || session?.user?._id || session?.user?.sub;

  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("collections");

  // Filtering & Sorting State
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [sortBy, setSortBy] = useState("featured"); // 'featured' | 'category' | 'price-asc' | 'price-desc' | 'popular' | 'name-asc'

  // Modals & Social
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [activeCommentItem, setActiveCommentItem] = useState(null);
  const [commentText, setCommentText] = useState("");

  const headerRef = useRef(null);

  useEffect(() => {
    if (!slug) return;

    async function loadStoreData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/stores/${slug}`);
        if (!res.ok) {
          setStore(null);
          return;
        }

        const storeData = await res.json();
        const storeDoc = storeData?.data;
        if (!storeDoc) {
          setStore(null);
          return;
        }

        const vendorId = storeDoc.vendorId?._id || storeDoc.vendorId;
        const storeId = storeDoc._id;

        const [collectionsRes, offersRes, galleryRes] = await Promise.all([
          fetch(
            `/api/vendors/collections?vendorId=${vendorId}&storeId=${storeId}`,
          ),
          fetch(`/api/offers?vendorId=${vendorId}`),
          fetch(`/api/gallery?vendor=${vendorId}`).catch(() => null),
        ]);

        const collectionsData = await collectionsRes.json().catch(() => ({}));
        const offersData = await offersRes.json().catch(() => ({}));
        const galleryData = galleryRes
          ? await galleryRes.json().catch(() => ({}))
          : {};

        const rawCollections =
          collectionsData?.data?.collections ||
          collectionsData?.collections ||
          [];
        const rawOffers = offersData?.data?.offers || offersData?.offers || [];
        const rawGalleryAssets = galleryData?.data || galleryData?.assets || [];

        // Normalize gallery
        const normalizedGallery = (
          rawGalleryAssets.length > 0
            ? rawGalleryAssets
            : Array.isArray(storeDoc.gallery)
              ? storeDoc.gallery
              : []
        ).map((item, idx) => {
          const isObj = typeof item === "object" && item !== null;
          const imageSrc = isObj ? item.url || item.image : item;
          const isUserLiked =
            currentUserId && isObj
              ? item.likes?.some(
                  (id) => id?.toString() === currentUserId.toString(),
                )
              : false;

          const catInfo = isObj
            ? extractItemCategories(item)
            : { primary: "Accessories", all: ["Accessories"] };

          return {
            id: isObj ? item._id || `gallery-${idx}` : `gallery-${idx}`,
            title: isObj
              ? item.title || item.name || `Gallery Item #${idx + 1}`
              : `Store Highlight #${idx + 1}`,
            description: isObj
              ? item.description || ""
              : "Exclusive boutique highlight.",
            image: imageSrc || "",
            price: isObj ? Number(item.price) || 0 : 0,
            category: catInfo.primary,
            categories: catInfo.all,
            status: isObj ? item.status !== false : true,
            isLiked: isUserLiked,
            likesCount: isObj && item.likes ? item.likes.length : 0,
            comments: isObj && item.comments ? item.comments : [],
            isGalleryItem: true,
            createdAt: isObj ? item.createdAt : null,
          };
        });

        // Normalize collections
        const normalizedCollections = rawCollections.map((c) => {
          const catInfo = extractItemCategories(c);

          return {
            id: c._id,
            title: c.title,
            description: c.description || "",
            image: c.images?.[0] || c.coverImage || "",
            price: Number(c.price) || 0,
            category: catInfo.primary,
            categories: catInfo.all,
            status: c.status !== false,
            isLiked: currentUserId
              ? c.likes?.some((id) => id?.toString() === currentUserId.toString())
              : false,
            likesCount: c.likes?.length || 0,
            comments: c.comments || [],
            createdAt: c.createdAt,
            isFeatured: Boolean(c.isFeatured),
          };
        });

        // Master categories attached to store
        const masterStoreCategories =
          storeDoc.categoryIds?.map((c) => c.name || c) || [];

        const mappedStore = {
          id: storeDoc._id,
          vendorId: vendorId,
          name: storeDoc.storeName || storeDoc.businessName || "Storefront",
          slug: storeDoc.storeSlug || storeDoc.vendorId?.businessSlug || "",
          logo: storeDoc.logo || storeDoc.vendorId?.logo || "",
          banner: storeDoc.coverImage || storeDoc.vendorId?.coverImage || "",
          rating: 4.8,
          reviewsCount: storeDoc.totalViews
            ? Math.floor(storeDoc.totalViews / 5) + 12
            : 12,
          description: storeDoc.description || "",
          address: storeDoc.address || "",
          city: storeDoc.city || "",
          location: `${storeDoc.address || ""}, ${storeDoc.city || ""}`.replace(
            /^,\s*/,
            "",
          ),
          phone: storeDoc.phone || storeDoc.vendorId?.phone || "",
          whatsapp:
            storeDoc.whatsapp ||
            storeDoc.phone ||
            storeDoc.vendorId?.phone ||
            "",
          hours:
            storeDoc.openingTime && storeDoc.closingTime
              ? `${storeDoc.openingTime} - ${storeDoc.closingTime}`
              : "09:30 AM - 09:00 PM",
          categories:
            masterStoreCategories.length > 0
              ? masterStoreCategories
              : ["Men", "Women", "Kids"],
          gallery: normalizedGallery,
          collections: normalizedCollections,
          offers: rawOffers.map((o) => ({
            id: o._id,
            title: o.title,
            code: o.couponCode || o.code,
            discountType: o.discountType,
            discountValue: o.discountValue,
            endDate: o.endDate,
          })),
        };

        setStore(mappedStore);
      } catch (err) {
        console.error("Failed to load store details:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStoreData();
  }, [slug, currentUserId]);

  // Aggregate available categories based on active tab items + store master categories + standard categories
  const availableCategories = useMemo(() => {
    if (!store) return STANDARD_CATEGORIES;

    const sourceList =
      activeTab === "gallery" ? store.gallery : store.collections;

    const foundCategories = new Set();

    sourceList.forEach((item) => {
      if (Array.isArray(item.categories)) {
        item.categories.forEach((c) => foundCategories.add(c));
      }
      if (item.category) {
        foundCategories.add(item.category);
      }
    });

    if (Array.isArray(store.categories)) {
      store.categories.forEach((c) => {
        const norm = normalizeCategoryName(c);
        if (norm) foundCategories.add(norm);
      });
    }

    STANDARD_CATEGORIES.forEach((std) => foundCategories.add(std));

    const categoryOrder = [
      "Men",
      "Women",
      "Kids",
      "Accessories",
      "Footwear",
      "Ethnic Wear",
      "Boutique",
    ];

    return Array.from(foundCategories).sort((a, b) => {
      const idxA = categoryOrder.indexOf(a);
      const idxB = categoryOrder.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [store, activeTab]);

  // Filter & Sort Engine
  const processItems = (items = []) => {
    const filtered =
      selectedCategory === "ALL"
        ? items
        : items.filter((item) => {
            const selected = selectedCategory.trim().toLowerCase();

            if (Array.isArray(item.categories) && item.categories.length > 0) {
              const hasMatch = item.categories.some((c) => {
                const normCat = normalizeCategoryName(c).toLowerCase();
                const rawCat = String(c).trim().toLowerCase();
                return normCat === selected || rawCat === selected;
              });
              if (hasMatch) return true;
            }

            const itemCatNorm = normalizeCategoryName(item.category || "").toLowerCase();
            const itemCatRaw = String(item.category || "").trim().toLowerCase();
            return itemCatNorm === selected || itemCatRaw === selected;
          });

    return [...filtered].sort((a, b) => {
      const priceA = Number(a.price) || 0;
      const priceB = Number(b.price) || 0;

      if (sortBy === "price-asc") return priceA - priceB;
      if (sortBy === "price-desc") return priceB - priceA;
      if (sortBy === "popular") {
        return (b.likesCount || 0) - (a.likesCount || 0);
      }
      if (sortBy === "category") {
        const catA = String(a.category || "").toLowerCase();
        const catB = String(b.category || "").toLowerCase();
        if (catA !== catB) return catA.localeCompare(catB);
        return String(a.title || "").localeCompare(String(b.title || ""));
      }
      if (sortBy === "name-asc") {
        return String(a.title || "").localeCompare(String(b.title || ""));
      }

      if (Boolean(a.isFeatured) !== Boolean(b.isFeatured)) {
        return a.isFeatured ? -1 : 1;
      }

      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });
  };
  const processedCollections = useMemo(
    () => processItems(store?.collections),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [store?.collections, selectedCategory, sortBy],
  );

  const processedGallery = useMemo(
    () => processItems(store?.gallery),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [store?.gallery, selectedCategory, sortBy],
  );

  const updateItemInState = (itemId, updater) => {
    setStore((prev) => {
      const updateList = (list) =>
        list.map((item) => (item.id === itemId ? updater(item) : item));
      return {
        ...prev,
        collections: updateList(prev.collections),
        gallery: updateList(prev.gallery),
      };
    });
  };

  const handleLikeToggle = async (item) => {
    if (!session) {
      setShowSignInModal(true);
      return;
    }

    updateItemInState(item.id, (prev) => {
      const nextLiked = !prev.isLiked;
      return {
        ...prev,
        isLiked: nextLiked,
        likesCount: nextLiked ? prev.likesCount + 1 : prev.likesCount - 1,
      };
    });

    try {
      const endpoint = item.isGalleryItem
        ? `/api/gallery/${item.id}/like`
        : `/api/users/wishlist`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: item.id }),
      });
      const data = await res.json();
      if (!data.success) toast.error(data.message || "Failed to sync like");
    } catch {
      toast.error("Network error syncing like");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!session) {
      setShowSignInModal(true);
      return;
    }
    if (!commentText.trim() || !activeCommentItem) return;

    try {
      const endpoint = activeCommentItem.isGalleryItem
        ? `/api/gallery/${activeCommentItem.id}/comments`
        : `/api/collections/${activeCommentItem.id}/comments`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: commentText }),
      });
      const data = await res.json();

      if (data.success) {
        const newComment = data.comment;
        updateItemInState(activeCommentItem.id, (prev) => ({
          ...prev,
          comments: [...(prev.comments || []), newComment],
        }));
        setActiveCommentItem((prev) => ({
          ...prev,
          comments: [...(prev.comments || []), newComment],
        }));
        setCommentText("");
        toast.success("Comment added!");
      }
    } catch {
      toast.error("Failed to post comment");
    }
  };

  const handleUnifiedShare = async (item) => {
    const stockStatus = item.status ? "In Stock & Ready" : "Out of Stock";
    const itemPrice = item.price
      ? `Rs. ${item.price.toLocaleString("en-IN")}`
      : "Price on Enquiry";

    const shareText =
      `*${item.title}*\n` +
      `Category: ${item.category}\n` +
      `Description: ${item.description || "Exclusive boutique piece."}\n\n` +
      `Store: *${store.name}* (${store.location})\n` +
      `Price: *${itemPrice}*\n` +
      `Status: [ ${stockStatus} ]\n\n` +
      `View Lookbook Item:\n${item.image}\n\n` +
      `Explore on Streetunics: ${typeof window !== "undefined" ? window.location.href : ""}`;

    try {
      if (navigator.canShare && item.image) {
        const response = await fetch(item.image);
        const blob = await response.blob();
        const file = new File([blob], "lookbook-item.jpg", { type: blob.type });

        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: item.title,
            text: shareText,
            files: [file],
          });
          return;
        }
      }
    } catch (err) {
      console.log("Native share fallback:", err);
    }

    window.open(
      `https://wa.me/?text=${encodeURIComponent(shareText)}`,
      "_blank",
    );
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!store) {
    notFound();
    return null;
  }

  return (
    <div className="flex-1 bg-slate-50/50 pb-24 pt-20 relative overflow-hidden min-h-screen font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10 space-y-8">
        {/* Breadcrumb */}
        <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-200/60 inline-block shadow-sm">
          <Breadcrumb
            items={[
              { label: "Stores", href: "/stores" },
              { label: store.name, href: `/stores/${store.slug}` },
            ]}
          />
        </div>

        {/* Store Profile Card */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200/80 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-center relative"
        >
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-start sm:items-center">
            <div className="h-24 w-24 sm:h-28 sm:w-28 border border-slate-100 bg-white rounded-3xl shadow-md overflow-hidden shrink-0 relative">
              <Image
                src={
                  store.logo ||
                  "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=300&auto=format&fit=crop&q=80"
                }
                alt={`${store.name} Logo`}
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight font-heading">
                  {store.name}
                </h1>
                <Badge
                  variant="blue"
                  pill
                  className="text-xs font-bold bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1"
                >
                  ★ {store.rating} ({store.reviewsCount} reviews)
                </Badge>
              </div>

              <p className="text-sm text-slate-600 max-w-2xl">
                {store.description ||
                  "Verified boutique outlet offering apparel and lookbooks in Namakkal."}
              </p>

              <div className="flex items-center gap-3 flex-wrap text-xs font-semibold text-slate-500 pt-1">
                <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-xl">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                  {store.location}
                </span>
                <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-xl">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  {store.hours}
                </span>
              </div>
            </div>
          </div>

          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={`https://wa.me/${(store.whatsapp || store.phone || "").replace(/\D/g, "")}?text=Hi%20${encodeURIComponent(store.name)},%20I%20saw%20your%20store%20on%20Streetunics.`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </motion.a>
        </motion.div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Area: Navigation Tabs, Filter Bar & Feed */}
          <div className="lg:col-span-8 space-y-6">
            {/* Primary Section Tabs */}
            <div className="flex bg-slate-200/70 p-1.5 rounded-2xl border border-slate-200">
              {[
                {
                  id: "collections",
                  label: `Latest Collections (${store.collections.length})`,
                },
                {
                  id: "gallery",
                  label: `Store Gallery (${store.gallery.length})`,
                },
                {
                  id: "offers",
                  label: `Active Offers (${store.offers.length})`,
                },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSelectedCategory("ALL"); // Reset category filter on tab switch
                    }}
                    className="flex-1 text-center py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all relative"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute inset-0 bg-white border border-slate-200 shadow-sm rounded-xl"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                    <span
                      className={`relative z-10 ${isActive ? "text-indigo-700 font-extrabold" : "text-slate-600 hover:text-slate-900"}`}
                    >
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 🌟 Category Filter & Sorter Toolbar (Shown on Collections and Gallery tabs) */}
            {activeTab !== "offers" && (
              <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Category Chips Scrollbar */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                    <button
                      type="button"
                      onClick={() => setSelectedCategory("ALL")}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        selectedCategory === "ALL"
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                      }`}
                    >
                      All Items
                    </button>

                    {availableCategories.map((cat) => {
                      const isCatActive =
                        selectedCategory.toLowerCase() === cat.toLowerCase();
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                            isCatActive
                              ? "bg-indigo-600 text-white shadow-sm"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>

                  {/* Sort By Dropdown */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-indigo-600 cursor-pointer"
                    >
                      <option value="featured">Featured (Newest)</option>
                      <option value="category">Sort by Category (A-Z)</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="popular">Most Liked</option>
                      <option value="name-asc">Title: A-Z</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeTab}-${selectedCategory}-${sortBy}`}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {/* 1. LATEST COLLECTIONS TAB */}
                {activeTab === "collections" && (
                  <LookbookGrid
                    items={processedCollections}
                    emptyMessage={
                      selectedCategory !== "ALL"
                        ? `No items found in "${selectedCategory}".`
                        : "No lookbook collections posted yet."
                    }
                    onLike={handleLikeToggle}
                    onComment={(item) =>
                      !session
                        ? setShowSignInModal(true)
                        : setActiveCommentItem(item)
                    }
                    onShare={handleUnifiedShare}
                  />
                )}

                {/* 2. STORE GALLERY TAB (9:16 Ratio Cards) */}
                {activeTab === "gallery" && (
                  <LookbookGrid
                    items={processedGallery}
                    emptyMessage={
                      selectedCategory !== "ALL"
                        ? `No gallery items found in "${selectedCategory}".`
                        : "No store gallery items uploaded yet."
                    }
                    onLike={handleLikeToggle}
                    onComment={(item) =>
                      !session
                        ? setShowSignInModal(true)
                        : setActiveCommentItem(item)
                    }
                    onShare={handleUnifiedShare}
                  />
                )}

                {/* 3. OFFERS TAB */}
                {activeTab === "offers" && (
                  <motion.div
                    variants={gridContainerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                  >
                    {store.offers.length === 0 ? (
                      <div className="col-span-2 text-center py-16 bg-white border border-slate-200/80 rounded-3xl shadow-sm">
                        <p className="text-sm font-semibold text-slate-500">
                          No active promotional coupons right now.
                        </p>
                      </div>
                    ) : (
                      store.offers.map((off) => (
                        <motion.div key={off.id} variants={gridItemVariants}>
                          <OfferCard offer={off} />
                        </motion.div>
                      ))
                    )}
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm space-y-5">
              <h3 className="text-sm font-black text-slate-950 uppercase tracking-wider border-b border-slate-100 pb-3">
                Store Details
              </h3>

              <div className="space-y-4 text-xs font-medium text-slate-600">
                <div>
                  <span className="font-bold text-slate-900 block mb-0.5">
                    Address
                  </span>
                  <p className="leading-relaxed">
                    {store.address || store.location}
                  </p>
                </div>

                <div>
                  <span className="font-bold text-slate-900 block mb-0.5">
                    Hours
                  </span>
                  <p className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    {store.hours}
                  </p>
                </div>

                <div>
                  <span className="font-bold text-slate-900 block mb-0.5">
                    Contact
                  </span>
                  <p className="flex items-center gap-1.5 text-slate-800 font-semibold">
                    <Phone className="w-3.5 h-3.5 text-indigo-600" />
                    {store.phone || "Available via WhatsApp"}
                  </p>
                </div>

                {store.categories?.length > 0 && (
                  <div>
                    <span className="font-bold text-slate-900 block mb-1">
                      Available Categories
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {store.categories.map((c) => (
                        <span
                          key={c}
                          className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[11px] font-semibold"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <a
                href={`https://wa.me/${(store.whatsapp || store.phone || "").replace(/\D/g, "")}?text=Hi%20${encodeURIComponent(store.name)},%20I%20want%20to%20visit%20your%20store.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs block text-center transition-all shadow-sm"
              >
                Get Directions / Visit Store
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Guard Modal */}
      {showSignInModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6 fill-rose-500" />
            </div>
            <div>
              <h3 className="font-heading font-black text-slate-950 text-base">
                Sign In Required
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Sign in to like collections, leave comments, and save to
                wishlist.
              </p>
            </div>
            <div className="space-y-2 pt-2">
              <Link
                href="/auth/login"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold block text-center"
              >
                Sign In
              </Link>
              <button
                type="button"
                onClick={() => setShowSignInModal(false)}
                className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-slate-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comment Modal */}
      {activeCommentItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-heading font-bold text-slate-950 text-sm">
                Comments
              </h3>
              <button
                type="button"
                onClick={() => setActiveCommentItem(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto space-y-2.5">
              {activeCommentItem.comments?.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">
                  No comments yet. Start the conversation!
                </p>
              ) : (
                activeCommentItem.comments?.map((c, i) => (
                  <div
                    key={i}
                    className="p-3 bg-slate-50 rounded-xl space-y-0.5 border border-slate-100"
                  >
                    <span className="text-[10px] font-bold text-indigo-600 block">
                      {c.userName || "Shopper"}
                    </span>
                    <p className="text-xs text-slate-700">{c.text}</p>
                  </div>
                ))
              )}
            </div>
            <form
              onSubmit={handleCommentSubmit}
              className="flex gap-2 pt-2 border-t border-slate-100"
            >
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// 🌟 Lookbook Grid Component with Category Tag and 9:16 Aspect Ratio
function LookbookGrid({ items, emptyMessage, onLike, onComment, onShare }) {
  if (items.length === 0) {
    return (
      <div className="col-span-full text-center py-20 bg-white border border-slate-200/80 rounded-3xl shadow-sm space-y-2">
        <Sparkles className="w-8 h-8 text-indigo-500 mx-auto animate-pulse" />
        <p className="text-sm font-bold text-slate-800">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={gridContainerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      {items.map((item) => (
        <motion.div
          key={item.id}
          variants={gridItemVariants}
          className="group relative bg-white rounded-3xl border border-slate-200/80 p-4 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
        >
          <div className="space-y-3">
            {/* 9:16 Aspect Ratio Lookbook Container */}
            <div className="relative w-full aspect-9/16 rounded-2xl overflow-hidden bg-slate-900 border border-slate-100 shadow-inner">
              <Image
                src={
                  item.image ||
                  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80"
                }
                alt={item.title}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Category Pill Tag */}
              {item.category && (
                <div className="absolute top-3 left-3">
                  <span className="text-[11px] font-extrabold text-white bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-full shadow-md">
                    {item.category}
                  </span>
                </div>
              )}

              {/* Price Tag */}
              <div className="absolute top-3 right-3">
                <span className="text-xs font-black text-slate-900 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full shadow-md">
                  {item.price
                    ? `₹${item.price.toLocaleString("en-IN")}`
                    : "On Request"}
                </span>
              </div>
            </div>

            <div className="space-y-1 px-1">
              <h4 className="font-heading font-black text-slate-950 text-sm tracking-tight truncate">
                {item.title}
              </h4>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {item.description ||
                  "Exclusive boutique piece available in-store."}
              </p>
            </div>
          </div>

          {/* Social Interactions */}
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-slate-700 px-1">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => onLike(item)}
                className="flex items-center gap-1.5 group/btn transition-transform active:scale-95"
              >
                <div className="p-1.5 rounded-lg bg-slate-50 group-hover/btn:bg-rose-50 transition-colors">
                  <Heart
                    className={`w-4 h-4 ${
                      item.isLiked
                        ? "fill-rose-500 text-rose-500"
                        : "text-slate-500 group-hover/btn:text-rose-500"
                    }`}
                  />
                </div>
                <span className="text-xs font-bold text-slate-700">
                  {item.likesCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onComment(item)}
                className="flex items-center gap-1.5 group/btn transition-transform active:scale-95"
              >
                <div className="p-1.5 rounded-lg bg-slate-50 group-hover/btn:bg-indigo-50 transition-colors">
                  <MessageCircle className="w-4 h-4 text-slate-500 group-hover/btn:text-indigo-600 transition-colors" />
                </div>
                <span className="text-xs font-bold text-slate-700">
                  {item.comments?.length || 0}
                </span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => onShare(item)}
              className="py-1.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white transition-all border border-emerald-200 flex items-center gap-1.5 text-xs font-bold active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
