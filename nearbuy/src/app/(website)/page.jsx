"use client";

import React, { useEffect } from "react";
import { testimonials, faqs, plans } from "@/data/dummy-data";
import HeroSection from "@/components/home/HeroSection";
import FeaturedCategoriesSection from "@/components/home/FeaturedCategoriesSection";
import FeaturedStoresSection from "@/components/home/FeaturedStoresSection";
import LatestCollectionsSection from "@/components/home/LatestCollectionsSection";
import TrendingOffersSection from "@/components/home/TrendingOffersSection";
import WhyChooseUsSection from "@/components/home/WhyChooseUsSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import VendorCtaSection from "@/components/home/VendorCtaSection";
import PricingSection from "@/components/home/PricingSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FaqSection from "@/components/home/FaqSection";
import useWebsiteStore from "@/store/websiteStore";

// Helper mapper function for database store objects
const mapDbStoreToFrontend = (s) => ({
  id: s?._id || "",
  name: s?.storeName || "Local Boutique",
  slug: s?.storeSlug || s?.vendorId?.businessSlug || "",
  logo: s?.logo || s?.vendorId?.logo || "",
  banner: s?.coverImage || s?.vendorId?.coverImage || "",
  rating: 4.8,
  reviewsCount: s?.totalViews ? Math.floor(s.totalViews / 5) + 12 : 12,
  description: s?.description || "",
  location:
    s?.address && s?.city ? `${s.address}, ${s.city}` : s?.city || "Namakkal",
  phone: s?.phone || s?.vendorId?.phone || "",
  whatsapp: s?.whatsapp || s?.phone || s?.vendorId?.phone || "",
  isFeatured: s?.isFeatured || false,
  categories: s?.categoryIds?.map((c) => c.name) || ["Boutique"],
  hours:
    s?.openingTime && s?.closingTime
      ? `${s.openingTime} - ${s.closingTime}`
      : "10:00 AM - 9:00 PM",
});

export default function Home() {
  const {
    stores = [],
    categories = [],
    offers = [],
    collections = [],
    fetchPublicDirectory,
  } = useWebsiteStore();

  useEffect(() => {
    fetchPublicDirectory();
  }, [fetchPublicDirectory]);

  // Map database stores safely to frontend structure
  const mappedStores = Array.isArray(stores)
    ? stores.map(mapDbStoreToFrontend)
    : [];

  const storesToDisplay = mappedStores;

  // 🔄 Pass ALL collections without slicing so every store's drops appear
  const allCollections = Array.isArray(collections) ? collections : [];

  // Map and sort trending offers from MongoDB safely
  const trendingOffers = Array.isArray(offers)
    ? offers
        .map((o) => {
          const store = Array.isArray(stores)
            ? stores.find((s) => s._id === o?.storeId)
            : null;
          return {
            id: o?._id,
            title: o?.title || "Special Discount Offer",
            code: o?.code || "WALKIN",
            discountType: o?.discountType || "PERCENTAGE",
            discountValue: o?.discountValue || 10,
            storeName:
              store?.storeName || o?.vendorId?.businessName || "Local Store",
            storeSlug: store?.storeSlug || store?.vendorId?.businessSlug || "",
          };
        })
        .slice(0, 3)
    : [];

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-600 selection:text-white">
      <HeroSection />
      <FeaturedCategoriesSection categories={categories} />
      <FeaturedStoresSection
        stores={storesToDisplay}
        title="All Registered"
        highlight="Fashion Outlets"
      />
      {/* Pass both raw collections and stores to LatestCollectionsSection */}
      <LatestCollectionsSection collections={allCollections} stores={stores} />
      <WhyChooseUsSection />
      <HowItWorksSection />
      <VendorCtaSection />
      <PricingSection plans={plans} />
      <TestimonialsSection testimonials={testimonials} />
      <FaqSection faqs={faqs} />
    </div>
  );
}
