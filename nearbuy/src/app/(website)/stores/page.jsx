"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import useWebsiteStore from "@/store/websiteStore";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import StoreFilters from "@/components/stores/StoreFilters";
import StoreListings from "@/components/stores/StoreListings";
import StorePagination from "@/components/stores/StorePagination";

const mapDbStoreToFrontend = (s) => ({
  id: s._id,
  name: s.storeName,
  slug: s.storeSlug || s.vendorId?.businessSlug || "",
  logo: s.logo || s.vendorId?.logo || "",
  banner: s.coverImage || s.vendorId?.coverImage || "",
  rating: 4.8,
  reviewsCount: 12,
  description: s.description || "",
  location: s.address && s.city ? `${s.address}, ${s.city}` : s.city || "",
  city: s.city || "",
  phone: s.phone || s.vendorId?.phone || "",
  whatsapp: s.whatsapp || s.phone || s.vendorId?.phone || "",
  categories: s.categoryIds?.map((c) => c.name) || ["Boutique"],
});

function ExploreStoresContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { stores: dbStores, categories: dbCategories, fetchPublicDirectory, loading } = useWebsiteStore();

  useEffect(() => {
    fetchPublicDirectory();
  }, [fetchPublicDirectory]);

  const urlQuery = searchParams.get("q") || "";
  const urlLoc = searchParams.get("loc") || "All Locations";
  const urlCat = searchParams.get("category") || "";

  const [search, setSearch] = useState(urlQuery);
  const [location, setLocation] = useState(urlLoc);
  const [category, setCategory] = useState(urlCat);
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearch(urlQuery);
    setLocation(urlLoc);
    setCategory(urlCat);
    setCurrentPage(1);
  }, [urlQuery, urlLoc, urlCat]);

  const categoriesList = ["All Categories", ...dbCategories.map((c) => c.name)];
  const locationsList = ["All Locations", ...new Set(dbStores.map((s) => s.city).filter(Boolean))];

  const mappedStores = dbStores.map(mapDbStoreToFrontend);

  const filteredStores = mappedStores.filter((store) => {
    const matchesSearch =
      store.name.toLowerCase().includes(search.toLowerCase()) ||
      store.description.toLowerCase().includes(search.toLowerCase()) ||
      store.categories.some((cat) => cat.toLowerCase().includes(search.toLowerCase()));

    const matchesLocation =
      location === "All Locations" || store.city.toLowerCase() === location.toLowerCase();

    const matchesCategory =
      !category ||
      category === "All Categories" ||
      store.categories.some((cat) => cat.toLowerCase() === category.toLowerCase());

    return matchesSearch && matchesLocation && matchesCategory;
  });

  const handleLocationChange = (e) => {
    const locVal = e.target.value;
    setLocation(locVal);
    updateUrlParams(search, locVal, category);
  };

  const handleCategoryClick = (catVal) => {
    const newVal = catVal === "All Categories" ? "" : catVal;
    setCategory(newVal);
    updateUrlParams(search, location, newVal);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateUrlParams(search, location, category);
  };

  const updateUrlParams = (q, loc, cat) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (loc && loc !== "All Locations") params.set("loc", loc);
    if (cat) params.set("category", cat);
    router.push(`/stores?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearch("");
    setLocation("All Locations");
    setCategory("");
    router.push("/stores");
  };

  const storesPerPage = 6;
  const totalPages = Math.ceil(filteredStores.length / storesPerPage) || 1;
  const displayedStores = filteredStores.slice(
    (currentPage - 1) * storesPerPage,
    currentPage * storesPerPage
  );

  return (
    <div className="flex-1 bg-slate-50/30 py-12 pt-28 sm:pt-32 relative overflow-hidden min-h-screen">
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_2px)] bg-[size:24px_24px] opacity-75 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Breadcrumb items={[{ label: "Explore Stores", href: "/stores" }]} />
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-purple-50 border border-purple-100/60 text-purple-700 text-xs font-bold rounded-full shadow-xs">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <span>{filteredStores.length} Stores Verified</span>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl md:text-5xl font-heading leading-tight">
            Explore Local <span className="bg-clip-text text-transparent bg-linear-to-r from-purple-600 via-indigo-600 to-purple-800">Clothing Stores</span> in Namakkal
          </h1>
          <p className="text-sm sm:text-base text-slate-500 font-body max-w-3xl leading-relaxed">
            Discover and support local boutiques, saree houses, footwear outlets, and fashion stores in your neighborhood.
          </p>
        </div>

        <StoreFilters
          search={search}
          setSearch={setSearch}
          location={location}
          handleLocationChange={handleLocationChange}
          category={category}
          handleCategoryClick={handleCategoryClick}
          handleSearchSubmit={handleSearchSubmit}
          clearFilters={clearFilters}
          categoriesList={categoriesList}
          viewMode={viewMode}
          setViewMode={setViewMode}
          locationsList={locationsList}
        />

        {loading && dbStores.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-3xl p-4 h-80 animate-pulse border border-slate-200/60 shadow-xs flex flex-col justify-between">
                <div className="bg-slate-200 h-44 rounded-2xl w-full" />
                <div className="space-y-2 py-2">
                  <div className="bg-slate-200 h-4 rounded w-3/4" />
                  <div className="bg-slate-200 h-3 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <StoreListings
            displayedStores={displayedStores}
            viewMode={viewMode}
            clearFilters={clearFilters}
            search={search}
            location={location}
          />
        )}

        <StorePagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}

export default function ExploreStoresPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center min-h-screen bg-slate-50/50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
        </div>
      }
    >
      <ExploreStoresContent />
    </Suspense>
  );
}