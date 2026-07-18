"use client";

import React from "react";
import { categories, stores, testimonials, faqs, plans } from "../data/dummy-data";
import HeroSection from "../components/home/HeroSection";
import FeaturedCategoriesSection from "../components/home/FeaturedCategoriesSection";
import FeaturedStoresSection from "../components/home/FeaturedStoresSection";
import LatestCollectionsSection from "../components/home/LatestCollectionsSection";
import TrendingOffersSection from "../components/home/TrendingOffersSection";
import WhyChooseUsSection from "../components/home/WhyChooseUsSection";
import HowItWorksSection from "../components/home/HowItWorksSection";
import VendorCtaSection from "../components/home/VendorCtaSection";
import PricingSection from "../components/home/PricingSection";
import TestimonialsSection from "../components/home/TestimonialsSection";
import FaqSection from "../components/home/FaqSection";

export default function Home() {
  // Filter featured stores
  const featuredStores = stores.filter((s) => s.isFeatured);

  // Extract top 3 trending offers from stores
  const trendingOffers = stores
    .flatMap((s) =>
      s.offers.map((o) => ({ ...o, storeName: s.name, storeSlug: s.slug })),
    )
    .slice(0, 3);

  // Extract top 3 latest collections from stores
  const latestCollections = stores
    .flatMap((s) =>
      s.collections.map((c) => ({
        ...c,
        storeName: s.name,
        storeSlug: s.slug,
      })),
    )
    .slice(0, 3);

  return (
    <div className="">
      <HeroSection />
      <FeaturedCategoriesSection categories={categories} />
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

