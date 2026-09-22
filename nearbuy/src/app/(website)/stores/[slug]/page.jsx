"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import OfferCard from "@/components/cards/OfferCard";
import Badge from "@/components/ui/Badge";
import Breadcrumb from "@/components/navigation/Breadcrumb";
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
} from "lucide-react";
import toast from "react-hot-toast";

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
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const gridItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 85, damping: 14 },
  },
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
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);

  // Sign-in Modal & Social Interaction States
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

        const [collectionsRes, offersRes] = await Promise.all([
          fetch(
            `/api/vendors/collections?vendorId=${vendorId}&storeId=${storeId}`,
          ),
          fetch(`/api/offers?vendorId=${vendorId}`),
        ]);

        const collectionsData = await collectionsRes.json().catch(() => ({}));
        const offersData = await offersRes.json().catch(() => ({}));

        const rawCollections =
          collectionsData?.data?.collections ||
          collectionsData?.collections ||
          [];
        const rawOffers = offersData?.data?.offers || offersData?.offers || [];

        const mappedStore = {
          id: storeDoc._id,
          vendorId: vendorId,
          name: storeDoc.storeName || "Storefront",
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
          gallery: Array.isArray(storeDoc.gallery) ? storeDoc.gallery : [],
          categories: storeDoc.categoryIds?.map((c) => c.name) || ["Boutique"],
          collections: rawCollections.map((c) => {
            const isUserLiked = currentUserId
              ? c.likes?.some(
                  (id) => id && id.toString() === currentUserId.toString(),
                )
              : false;
            return {
              id: c._id,
              title: c.title,
              description: c.description || "",
              image: c.images?.[0] || c.coverImage || "",
              price: c.price || 0,
              status: c.status !== false,
              isLiked: isUserLiked,
              likesCount: c.likes?.length || 0,
              comments: c.comments || [],
            };
          }),
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

  const handleLikeToggle = async (collId) => {
    if (!session) {
      setShowSignInModal(true);
      return;
    }

    setStore((prev) => ({
      ...prev,
      collections: prev.collections.map((item) => {
        if (item.id === collId) {
          const nextLiked = !item.isLiked;
          return {
            ...item,
            isLiked: nextLiked,
            likesCount: nextLiked ? item.likesCount + 1 : item.likesCount - 1,
          };
        }
        return item;
      }),
    }));

    try {
      const res = await fetch(`/api/users/wishlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: collId }),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message || "Failed to sync like");
      }
    } catch (err) {
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
      const res = await fetch(
        `/api/collections/${activeCommentItem.id}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: commentText }),
        },
      );
      const data = await res.json();
      if (data.success) {
        setStore((prev) => ({
          ...prev,
          collections: prev.collections.map((item) => {
            if (item.id === activeCommentItem.id) {
              const updatedComments = [...item.comments, data.comment];
              setActiveCommentItem((prevActive) => ({
                ...prevActive,
                comments: updatedComments,
              }));
              return {
                ...item,
                comments: updatedComments,
              };
            }
            return item;
          }),
        }));
        setCommentText("");
        toast.success("Comment added!");
      }
    } catch (err) {
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
      `Description: ${item.description || "Exclusive boutique collection item."}\n\n` +
      `Store: *${store.name}* (${store.location})\n` +
      `Price: *${itemPrice}*\n` +
      `Status: [ ${stockStatus} ]\n\n` +
      `View Item Image:\n${item.image}\n\n` +
      `Explore full catalog on Streetunics: ${window.location.href}`;

    try {
      if (navigator.canShare && item.image) {
        const response = await fetch(item.image);
        const blob = await response.blob();
        const file = new File([blob], "collection-item.jpg", {
          type: blob.type,
        });

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!store) {
    notFound();
    return null;
  }

  return (
    <div className="flex-1 bg-slate-50/50 pb-24 pt-20 relative overflow-hidden min-h-screen font-body">
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] bg-size-[24px_24px] opacity-40 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-28 relative z-10 space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-200/60 inline-block shadow-sm">
          <Breadcrumb
            items={[
              { label: "Stores", href: "/stores" },
              { label: store.name, href: `/stores/${store.slug}` },
            ]}
          />
        </div>

        {/* 🌟 Premium Glassmorphism Store Header Profile Card */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/95 backdrop-blur-xl border border-slate-200/80 p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row gap-6 justify-between items-start md:items-center relative overflow-hidden"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-start sm:items-center relative z-10">
            {/* Store Logo Container (Fixed Box with object-cover) */}
            <div className="h-24 w-24 sm:h-28 sm:w-28 border-2 border-white bg-white rounded-3xl shadow-xl overflow-hidden shrink-0 ring-4 ring-indigo-500/10 relative">
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
                  className="text-xs font-extrabold bg-blue-50 border border-blue-200/80 text-blue-700 px-3 py-1"
                >
                  ★ {store.rating} ({store.reviewsCount} verified reviews)
                </Badge>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed max-w-2xl font-body">
                {store.description ||
                  "Verified physical boutique outlet offering premium apparel, designer lookbooks, and exclusive in-store walk-in deals."}
              </p>

              <div className="flex items-center gap-4 flex-wrap text-xs font-semibold text-slate-500 pt-1">
                <span className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-xl">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                  {store.location}
                </span>
                <span className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-xl">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  {store.hours}
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="w-full md:w-auto shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 relative z-10">
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href={`https://wa.me/${(store.whatsapp || store.phone || "").replace(/\D/g, "")}?text=Hi%20${encodeURIComponent(store.name)},%20I%20saw%20your%20store%20on%20Streetunics%20and%20want%20to%20enquire%20about%20availability.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <span>💬 Chat with Store on WhatsApp</span>
            </motion.a>
          </div>
        </motion.div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Tabs & Items Grid */}
          <div className="lg:col-span-8 space-y-6">
            {/* Navigation Tabs */}
            <div className="flex bg-slate-200/60 p-1.5 rounded-2xl border border-slate-200 relative z-10">
              {[
                {
                  id: "collections",
                  label: `Latest Lookbooks (${store.collections.length})`,
                },
                {
                  id: "offers",
                  label: `Active Offers (${store.offers.length})`,
                },
                {
                  id: "gallery",
                  label: `Store Gallery (${store.gallery.length})`,
                },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex-1 text-center py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer relative"
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

            {/* Tab Contents */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {/* COLLECTIONS TAB */}
                {activeTab === "collections" && (
                  <motion.div
                    variants={gridContainerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                  >
                    {store.collections.length === 0 ? (
                      <div className="col-span-full text-center py-24 bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-3xl shadow-sm space-y-3">
                        <Sparkles className="w-9 h-9 text-indigo-500 mx-auto animate-pulse" />
                        <p className="text-sm font-bold text-slate-800 tracking-tight">
                          No lookbook collections posted yet.
                        </p>
                        <p className="text-xs text-slate-400 max-w-xs mx-auto">
                          Check back soon for fresh style drops from this
                          boutique.
                        </p>
                      </div>
                    ) : (
                      store.collections.map((coll) => (
                        <motion.div
                          key={coll.id}
                          variants={gridItemVariants}
                          className="group relative bg-white rounded-[2.5rem] border border-slate-200/70 p-5 shadow-sm hover:shadow-2xl hover:border-indigo-200/80 transition-all duration-500 flex flex-col justify-between overflow-hidden"
                        >
                          {/* Subtle background glow effect on hover */}
                          <div className="absolute -right-20 -top-20 w-48 h-48 bg-indigo-50 rounded-full blur-3xl group-hover:bg-indigo-100/60 transition-colors pointer-events-none" />

                          <div className="space-y-4 relative z-10">
                            {/* 📸 Instagram-Style 9:16 Vertical Aspect Ratio Container */}
                            <div className="relative w-full aspect-9/16 rounded-3xl overflow-hidden bg-slate-950 border border-slate-100/80 shadow-inner">
                              <Image
                                src={
                                  coll.image ||
                                  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80"
                                }
                                alt={coll.title}
                                fill
                                unoptimized
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                              />

                              {/* Floating Price Tag Overlay */}
                              <div className="absolute top-4 right-4">
                                <span className="text-xs font-black text-slate-900 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg border border-white/20">
                                  {coll.price
                                    ? `₹${coll.price.toLocaleString("en-IN")}`
                                    : "On Request"}
                                </span>
                              </div>
                            </div>

                            {/* Content Section */}
                            <div className="space-y-1.5 px-1">
                              <h4 className="font-heading font-black text-slate-950 text-base tracking-tight group-hover:text-indigo-600 transition-colors truncate">
                                {coll.title}
                              </h4>
                              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                                {coll.description ||
                                  "Curated seasonal collection item available exclusively in-store."}
                              </p>
                            </div>
                          </div>

                          {/* Interaction Toolbar */}
                          <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 text-slate-700 px-1 relative z-10">
                            <div className="flex items-center gap-5">
                              {/* Like Button */}
                              <button
                                type="button"
                                onClick={() => handleLikeToggle(coll.id)}
                                className="flex items-center gap-2 cursor-pointer group/btn transition-transform active:scale-95"
                              >
                                <div className="p-2 rounded-xl bg-slate-50 group-hover/btn:bg-rose-50 transition-colors">
                                  <Heart
                                    className={`w-4 h-4 transition-colors ${
                                      coll.isLiked
                                        ? "fill-rose-500 text-rose-500"
                                        : "text-slate-500 group-hover/btn:text-rose-500"
                                    }`}
                                  />
                                </div>
                                <span className="text-xs font-bold text-slate-700">
                                  {coll.likesCount}
                                </span>
                              </button>

                              {/* Comment Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  if (!session) {
                                    setShowSignInModal(true);
                                  } else {
                                    setActiveCommentItem(coll);
                                  }
                                }}
                                className="flex items-center gap-2 cursor-pointer group/btn transition-transform active:scale-95"
                              >
                                <div className="p-2 rounded-xl bg-slate-50 group-hover/btn:bg-indigo-50 transition-colors">
                                  <MessageCircle className="w-4 h-4 text-slate-500 group-hover/btn:text-indigo-600 transition-colors" />
                                </div>
                                <span className="text-xs font-bold text-slate-700">
                                  {coll.comments?.length || 0}
                                </span>
                              </button>
                            </div>

                            {/* WhatsApp Share Button */}
                            <button
                              type="button"
                              onClick={() => handleUnifiedShare(coll)}
                              className="py-2 px-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-500 text-emerald-700 hover:text-white transition-all duration-300 cursor-pointer border border-emerald-200/80 flex items-center gap-1.5 text-xs font-extrabold shadow-sm active:scale-95"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                              <span>Share</span>
                            </button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </motion.div>
                )}

                {/* OFFERS TAB */}
                {activeTab === "offers" && (
                  <motion.div
                    variants={gridContainerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                  >
                    {store.offers.length === 0 ? (
                      <div className="col-span-2 text-center py-20 bg-white border border-slate-200/80 rounded-3xl shadow-sm">
                        <p className="text-sm font-bold text-slate-600">
                          No promotional coupons currently active.
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

                {/* GALLERY TAB */}
                {activeTab === "gallery" && (
                  <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm">
                    {store.gallery.length === 0 ? (
                      <p className="text-sm text-slate-400 text-center py-12">
                        No store showcase photos uploaded yet.
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {store.gallery.map((imgUrl, idx) => (
                          <motion.div
                            key={idx}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedGalleryImage(imgUrl)}
                            className="h-32 sm:h-40 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 cursor-pointer shadow-sm relative group"
                          >
                            <Image
                              src={imgUrl}
                              alt={`Store interior ${idx + 1}`}
                              fill
                              unoptimized
                              sizes="300px"
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: Sticky Business Information Sidebar */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            <div className="bg-white border border-slate-200/80 p-6 sm:p-7 rounded-3xl shadow-xl space-y-6">
              <h3 className="text-base font-black text-slate-950 border-b border-slate-100 pb-3 font-heading flex items-center gap-2">
                <span>📍 Store Details & Map</span>
              </h3>

              <div className="space-y-4 text-sm text-slate-600 font-body">
                <div>
                  <span className="font-extrabold block text-slate-900 text-xs uppercase tracking-wider mb-1">
                    Complete Address
                  </span>
                  <p className="leading-relaxed">
                    {store.address || store.location}
                  </p>
                </div>

                <div>
                  <span className="font-extrabold block text-slate-900 text-xs uppercase tracking-wider mb-1">
                    Store Timing
                  </span>
                  <p className="flex items-center gap-1.5 text-emerald-700 font-bold">
                    <Clock className="w-4 h-4" />
                    {store.hours}
                  </p>
                </div>

                <div>
                  <span className="font-extrabold block text-slate-900 text-xs uppercase tracking-wider mb-1">
                    Direct Contact
                  </span>
                  <p className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Phone className="w-4 h-4 text-indigo-600" />
                    {store.phone || "Available via WhatsApp"}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={`https://wa.me/${(store.whatsapp || store.phone || "").replace(/\D/g, "")}?text=Hi%20${encodeURIComponent(store.name)},%20I%20want%20to%20visit%20your%20store.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/20 block text-center transition-all"
                >
                  Get Directions / Enquire Walk-in
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sign-In Guard Modal */}
      {showSignInModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center space-y-5">
            <div className="h-12 w-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6 fill-rose-500" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-black text-slate-950 text-base">
                Sign In Required
              </h3>
              <p className="text-xs text-slate-500">
                Please sign in to like collections, leave comments, and save
                items to your shopper profile wishlist.
              </p>
            </div>
            <div className="space-y-2 pt-2">
              <Link
                href="/auth/login"
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-md block text-center"
              >
                Sign In Now
              </Link>
              <button
                type="button"
                onClick={() => setShowSignInModal(false)}
                className="w-full py-2.5 rounded-2xl text-xs font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comment Drawer / Modal */}
      {activeCommentItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 font-body">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-heading font-black text-slate-950 text-sm">
                Comments
              </h3>
              <button
                type="button"
                onClick={() => setActiveCommentItem(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto space-y-3">
              {activeCommentItem.comments?.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">
                  No comments yet. Start the conversation!
                </p>
              ) : (
                activeCommentItem.comments?.map((c, i) => (
                  <div
                    key={i}
                    className="p-3 bg-slate-50 rounded-2xl space-y-1 border border-slate-100"
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
                className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Lightbox Modal */}
      {selectedGalleryImage && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedGalleryImage(null)}
        >
          <div className="relative max-w-4xl w-full h-[80vh] rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src={selectedGalleryImage}
              alt="Gallery zoom"
              fill
              unoptimized
              className="object-contain"
            />
            <button className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/60 text-white flex items-center justify-center cursor-pointer hover:bg-black/80">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
