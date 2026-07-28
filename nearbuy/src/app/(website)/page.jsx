"use client";

import React, { useEffect } from "react";
import {
  testimonials,
  faqs,
  plans,
} from "@/data/dummy-data";
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

const mapDbStoreToFrontend = (s) => ({
  id: s._id,
  name: s.storeName,
  slug: s.vendorId?.businessSlug || "",
  logo: s.vendorId?.logo || "",
  banner: s.vendorId?.coverImage || "",
  rating: 4.8,
  reviewsCount: 12,
  description: s.description || "",
  location: `${s.address}, ${s.city}`,
  phone: s.phone || s.vendorId?.phone || "",
  whatsapp: s.whatsapp || s.phone || s.vendorId?.phone || "",
  isFeatured: s.isFeatured || false,
});

export default function Home() {
  const { stores: dbStores, categories: dbCategories, offers: dbOffers, collections: dbCollections, fetchPublicDirectory } = useWebsiteStore();

  useEffect(() => {
    fetchPublicDirectory();
  }, [fetchPublicDirectory]);

  // Map stores to frontend representation
  const mappedStores = dbStores.map(mapDbStoreToFrontend);

  // Filter featured stores
  const featuredStores = mappedStores.filter((s) => s.isFeatured);

  // Map and sort latest collections from MongoDB
  const latestCollections = dbCollections
    .map((c) => {
      const store = dbStores.find(s => s._id === c.storeId);
      return {
        id: c._id,
        title: c.title,
        description: c.description || "",
        image: c.images?.[0] || c.coverImage || "",
        storeName: store?.storeName || c.vendorId?.businessName || "Local Store",
        storeSlug: store?.vendorId?.businessSlug || "",
      };
    })
    .slice(0, 3);

  // Map and sort trending offers from MongoDB
  const trendingOffers = dbOffers
    .map((o) => {
      const store = dbStores.find(s => s._id === o.storeId);
      return {
        id: o._id,
        title: o.title,
        code: o.code,
        discountType: o.discountType,
        discountValue: o.discountValue,
        storeName: store?.storeName || o.vendorId?.businessName || "Local Store",
        storeSlug: store?.vendorId?.businessSlug || "",
      };
    })
    .slice(0, 3);

  return (
    <div className="">
      <HeroSection />
      <FeaturedCategoriesSection categories={dbCategories} />
      <FeaturedStoresSection stores={featuredStores} />
      <LatestCollectionsSection collections={latestCollections} />
      <TrendingOffersSection offers={trendingOffers} />
      <WhyChooseUsSection />
      <HowItWorksSection />
      <VendorCtaSection />
      <PricingSection plans={plans} />
      <TestimonialsSection testimonials={testimonials} />
      <FaqSection faqs={faqs} />
    </div>
  );
}
