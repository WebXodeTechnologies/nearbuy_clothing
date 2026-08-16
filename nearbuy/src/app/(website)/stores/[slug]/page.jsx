"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import CollectionCard from "@/components/cards/CollectionCard";
import OfferCard from "@/components/cards/OfferCard";
import Badge from "@/components/ui/Badge";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import Image from "next/image";
import { Heart, MessageCircle, Share2, X } from "lucide-react";
import toast from "react-hot-toast";

const contentVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
};

const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const gridItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 85, damping: 14 } },
};

export default function StoreDetailsPage({ params }) {
  const resolvedParams = React.use(params);
  const slug = resolvedParams?.slug;
  const { data: session } = useSession();

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
          fetch(`/api/vendors/collections?vendorId=${vendorId}&storeId=${storeId}`),
          fetch(`/api/offers?vendorId=${vendorId}`),
        ]);

        const collectionsData = await collectionsRes.json().catch(() => ({}));
        const offersData = await offersRes.json().catch(() => ({}));

        const rawCollections = collectionsData?.data?.collections || collectionsData?.collections || [];
        const rawOffers = offersData?.data?.offers || offersData?.offers || [];

        const mappedStore = {
          id: storeDoc._id,
          vendorId: vendorId,
          name: storeDoc.storeName || "Storefront",
          slug: storeDoc.storeSlug || storeDoc.vendorId?.businessSlug || "",
          logo: storeDoc.logo || storeDoc.vendorId?.logo || "",
          banner: storeDoc.coverImage || storeDoc.vendorId?.coverImage || "",
          rating: 4.8,
          reviewsCount: storeDoc.totalViews ? Math.floor(storeDoc.totalViews / 5) + 12 : 12,
          description: storeDoc.description || "",
          address: storeDoc.address || "",
          city: storeDoc.city || "",
          location: `${storeDoc.address || ""}, ${storeDoc.city || ""}`.replace(/^,\s*/, ""),
          phone: storeDoc.phone || storeDoc.vendorId?.phone || "",
          whatsapp: storeDoc.whatsapp || storeDoc.phone || storeDoc.vendorId?.phone || "",
          hours: storeDoc.openingTime && storeDoc.closingTime
            ? `${storeDoc.openingTime} - ${storeDoc.closingTime}`
            : "09:30 AM - 09:00 PM",
          gallery: Array.isArray(storeDoc.gallery) ? storeDoc.gallery : [],
          categories: storeDoc.categoryIds?.map(c => c.name) || ["Boutique"],
          collections: rawCollections.map(c => ({
            id: c._id,
            title: c.title,
            description: c.description || "",
            image: c.images?.[0] || c.coverImage || "",
            price: c.price || 0,
            status: c.status !== false,
            isLiked: false,
            likesCount: c.likesCount || 0,
            comments: c.comments || [],
          })),
          offers: rawOffers.map(o => ({
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
  }, [slug]);

  // Social Interaction Handlers
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
      await fetch(`/api/user/wishlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: collId }),
      });
    } catch (err) {
      toast.error("Failed to sync like");
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
      const res = await fetch(`/api/collections/${activeCommentItem.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: commentText }),
      });
      const data = await res.json();
      if (data.success) {
        setStore((prev) => ({
          ...prev,
          collections: prev.collections.map((item) => {
            if (item.id === activeCommentItem.id) {
              return {
                ...item,
                comments: [...item.comments, data.comment],
              };
            }
            return item;
          }),
        }));
        setCommentText("");
        setActiveCommentItem(null);
        toast.success("Comment added!");
      }
    } catch (err) {
      toast.error("Failed to post comment");
    }
  };

  // Unified Share Handler: Shares image file on mobile, or text/link card on desktop
  const handleUnifiedShare = async (item) => {
    const stockStatus = item.status ? "In Stock & Ready" : "Out of Stock";
    const itemPrice = item.price ? `Rs. ${item.price.toLocaleString("en-IN")}` : "Price on Enquiry";

    const activeOffer = store.offers && store.offers.length > 0
      ? `Special Offer: Use code *${store.offers[0].code}* for ${store.offers[0].discountValue}% OFF!`
      : "Direct Store Collection";

    const shareText =
      `*${item.title}*\n` +
      `Description: ${item.description || "Exclusive boutique collection item."}\n\n` +
      `Store: *${store.name}* (${store.location})\n` +
      `Price: *${itemPrice}*\n` +
      `Status: [ ${stockStatus} ]\n` +
      `${activeOffer}\n\n` +
      `View Item Image:\n${item.image}\n\n` +
      `Explore full catalog on Streetunics: ${window.location.href}`;

    try {
      // Attempt native file sharing if supported (Mobile devices)
      if (navigator.canShare && item.image) {
        const response = await fetch(item.image);
        const blob = await response.blob();
        const file = new File([blob], "collection-item.jpg", { type: blob.type });

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
      console.log("Native file share fallback triggered:", err);
    }

    // Fallback for Desktop / browsers without file-share support (Opens WhatsApp Web with full text card)
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-slate-50/50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    );
  }

  if (!store) {
    notFound();
    return null;
  }

  return (
    <div className="flex-1 bg-slate-50/30 pb-20 pt-24 relative overflow-hidden min-h-screen font-body">
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_2px)] bg-[size:24px_24px] opacity-75 pointer-events-none" />

      {/* Store Banner */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden bg-slate-900 z-0">
        <motion.img
          initial={{ scale: 1.1, opacity: 0.8 }}
          animate={{ scale: 1.02, opacity: 1 }}
          transition={{ duration: 0.8 }}
          src={store.banner || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80"}
          alt={store.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 md:-mt-24 relative z-10 space-y-8">
        <div className="bg-white/85 backdrop-blur-md px-4.5 py-2.5 rounded-2xl border border-slate-100/60 inline-block shadow-xs">
          <Breadcrumb
            items={[
              { label: "Stores", href: "/stores" },
              { label: store.name, href: `/stores/${store.slug}` },
            ]}
          />
        </div>

        {/* Store Header Block */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/95 backdrop-blur-md border border-slate-200/80 p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row gap-6 justify-between items-start md:items-center relative overflow-hidden"
        >
          <div className="flex gap-4 sm:gap-6 items-center relative z-10">
            <div className="h-20 w-20 md:h-24 md:w-24 border border-slate-200 bg-white rounded-2xl shadow-md overflow-hidden shrink-0 ring-4 ring-white relative">
              <Image
                src={store.logo || "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=200&auto=format&fit=crop&q=80"}
                alt={`${store.name} Logo`}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading">
                  {store.name}
                </h1>
                <Badge variant="blue" pill className="text-[10px] font-extrabold bg-blue-50 border border-blue-100 text-blue-700">
                  {store.rating} ★ ({store.reviewsCount} reviews)
                </Badge>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xl">
                {store.description}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold pt-1">
                <span className="text-slate-500">{store.location}</span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto flex flex-row sm:flex-col gap-2 shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100/50 relative z-10">
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={`https://wa.me/${(store.whatsapp || store.phone || "").replace(/\D/g, "")}?text=Hi%20${encodeURIComponent(store.name)},%20I%20saw%20your%20store%20on%20Streetunics.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer select-none"
            >
              WhatsApp Shop
            </motion.a>
          </div>
        </motion.div>

        {/* Tabbed Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="flex bg-slate-100/60 p-1.5 rounded-2xl border border-slate-200/50 relative z-10">
              {[
                { id: "collections", label: `Latest Collections (${store.collections.length})` },
                { id: "offers", label: `Coupons & Offers (${store.offers.length})` },
                { id: "gallery", label: "Store Gallery" },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex-1 text-center py-3 rounded-xl text-xs font-bold transition-all cursor-pointer relative"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute inset-0 bg-white border border-slate-200/40 shadow-xs rounded-xl"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className={`relative z-10 ${isActive ? "text-purple-700 font-extrabold" : "text-slate-500 hover:text-slate-900"}`}>
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={activeTab} variants={contentVariants} initial="hidden" animate="visible" exit="hidden">
                {activeTab === "collections" && (
                  <motion.div variants={gridContainerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {store.collections.length === 0 ? (
                      <div className="col-span-2 text-center py-16 bg-white border border-slate-200/80 rounded-3xl shadow-xs">
                        <p className="text-sm text-slate-400">No lookbook collections posted yet for this store.</p>
                      </div>
                    ) : (
                      store.collections.map((coll) => (
                        <motion.div key={coll.id} variants={gridItemVariants} className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-xs space-y-3 flex flex-col justify-between">
                          <div>
                            <CollectionCard collection={coll} />
                          </div>

                          {/* Instagram-Style Interaction Toolbar */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-slate-700 px-1">
                            <div className="flex items-center gap-4">
                              {/* Red Heart / Like Button */}
                              <button
                                type="button"
                                onClick={() => handleLikeToggle(coll.id)}
                                className="flex items-center gap-1.5 cursor-pointer group transition-transform active:scale-90"
                              >
                                <Heart
                                  className={`w-5 h-5 transition-colors ${coll.isLiked ? "fill-rose-500 text-rose-500" : "text-slate-600 group-hover:text-rose-500"
                                    }`}
                                />
                                <span className="text-xs font-bold">{coll.likesCount}</span>
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
                                className="flex items-center gap-1.5 cursor-pointer group transition-transform active:scale-90"
                              >
                                <MessageCircle className="w-5 h-5 text-slate-600 group-hover:text-blue-500 transition-colors" />
                                <span className="text-xs font-bold">{coll.comments?.length || 0}</span>
                              </button>
                            </div>

                            {/* WhatsApp Direct Share Button */}
                            {/* WhatsApp / Native Image Share Button */}
                            <button
                              type="button"
                              onClick={() => handleUnifiedShare(coll)}
                              className="p-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors cursor-pointer border border-emerald-200 flex items-center gap-1.5 px-3 text-[11px] font-bold"
                              title="Share Image & Details to WhatsApp"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                              <span>Share to WhatsApp</span>
                            </button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </motion.div>
                )}

                {activeTab === "offers" && (
                  <motion.div variants={gridContainerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {store.offers.length === 0 ? (
                      <div className="col-span-2 text-center py-16 bg-white border border-slate-200/80 rounded-3xl shadow-xs">
                        <p className="text-sm text-slate-400">No promotional coupons available at the moment.</p>
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

                {activeTab === "gallery" && (
                  <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm">
                    {store.gallery.length === 0 ? (
                      <p className="text-sm text-slate-400 text-center py-8">No showcase photos uploaded.</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {store.gallery.map((imgUrl, idx) => (
                          <motion.div
                            key={idx}
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedGalleryImage(imgUrl)}
                            className="h-28 sm:h-36 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 cursor-pointer shadow-xs relative"
                          >
                            <Image src={imgUrl} alt={`Store interior ${idx + 1}`} fill className="object-cover" />
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm space-y-5">
              <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3 font-heading">
                Business Information
              </h3>
              <div className="space-y-4 text-sm text-slate-500">
                <div>
                  <span className="font-extrabold block text-slate-800 text-xs uppercase tracking-wider mb-0.5">Physical Address</span>
                  <span>{store.address || store.location}</span>
                </div>
                <div>
                  <span className="font-extrabold block text-slate-800 text-xs uppercase tracking-wider mb-0.5">Operating Hours</span>
                  <span>{store.hours}</span>
                </div>
                <div>
                  <span className="font-extrabold block text-slate-800 text-xs uppercase tracking-wider mb-0.5">Phone Directory</span>
                  <span>{store.phone || "Not Provided"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sign-In Guard Modal Popup */}
      {showSignInModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl text-center space-y-5 font-body">
            <div className="h-12 w-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6 fill-rose-500" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-black text-slate-900 text-base">Sign In Required</h3>
              <p className="text-xs text-slate-500">
                Please sign in to like collections, leave comments, and save items to your shopper profile wishlist.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <Link
                href="/auth/login"
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-md block transition-all text-center"
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

      {/* Comment Modal / Drawer */}
      {activeCommentItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 font-body">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-heading font-black text-slate-900 text-sm">Comments</h3>
              <button
                type="button"
                onClick={() => setActiveCommentItem(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-3">
              {activeCommentItem.comments?.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">No comments yet. Start the conversation!</p>
              ) : (
                activeCommentItem.comments?.map((c, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-2xl space-y-1">
                    <span className="text-[10px] font-bold text-indigo-600 block">{c.userName || "Shopper"}</span>
                    <p className="text-xs text-slate-700">{c.text}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleCommentSubmit} className="flex gap-2 pt-2 border-t border-slate-100">
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 px-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl cursor-pointer"
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