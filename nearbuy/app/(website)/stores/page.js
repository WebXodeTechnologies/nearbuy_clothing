"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { stores } from "../../data/dummy-data";
import Breadcrumb from "../../components/navigation/Breadcrumb";
import StoreFilters from "../../components/stores/StoreFilters";
import StoreListings from "../../components/stores/StoreListings";
import StorePagination from "../../components/stores/StorePagination";

function ExploreStoresContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read URL query parameters
  const urlQuery = searchParams.get("q") || "";
  const urlLoc = searchParams.get("loc") || "All Locations";
  const urlCat = searchParams.get("category") || "";

  // State initialized with URL queries
  const [search, setSearch] = useState(urlQuery);
  const [location, setLocation] = useState(urlLoc);
  const [category, setCategory] = useState(urlCat);
  const [viewMode, setViewMode] = useState("grid"); // grid, list
  const [currentPage, setCurrentPage] = useState(1);

  // Sync state when URL search params change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearch(urlQuery);
    setLocation(urlLoc);
    setCategory(urlCat);
    setCurrentPage(1); // Reset page on filter changes
  }, [urlQuery, urlLoc, urlCat]);

  const categoriesList = [
    "All Categories",
    "Men's Wear",
    "Women's Wear",
    "Kids Wear",
    "Ethnic Wear",
    "Boutique",
    "Footwear",
    "Accessories",
  ];

  // Filter logic
  const filteredStores = stores.filter((store) => {
    const matchesSearch =
      store.name.toLowerCase().includes(search.toLowerCase()) ||
      store.description.toLowerCase().includes(search.toLowerCase()) ||
      store.categories.some((cat) =>
        cat.toLowerCase().includes(search.toLowerCase()),
      );

    const matchesLocation =
      location === "All Locations" ||
      store.location.toLowerCase() === location.toLowerCase();

    const matchesCategory =
      !category ||
      category === "All Categories" ||
      store.categories.some(
        (cat) => cat.toLowerCase() === category.toLowerCase(),
      );

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

  // Mock Pagination sizing
  const storesPerPage = 6;
  const totalPages = Math.ceil(filteredStores.length / storesPerPage) || 1;
  const displayedStores = filteredStores.slice(
    (currentPage - 1) * storesPerPage,
    currentPage * storesPerPage,
  );

  return (
    <div className="flex-1 bg-slate-50/30 py-12 pt-28 sm:pt-32 relative overflow-hidden min-h-screen">
      {/* Background Decorative Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_2px)] bg-size-[24px_24px] opacity-75 pointer-events-none" />

      {/* Background Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.15, 0.22, 0.15]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-12 right-1/4 w-[450px] h-[450px] bg-purple-200/40 blur-3xl pointer-events-none rounded-full"
      />
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.2, 0.28, 0.2]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3
        }}
        className="absolute bottom-20 left-10 w-[350px] h-[350px] bg-indigo-200/40 blur-3xl pointer-events-none rounded-full"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Breadcrumb & Results Badge Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Breadcrumb items={[{ label: "Explore Stores", href: "/stores" }]} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center self-start sm:self-auto gap-2 px-3.5 py-1 bg-purple-50 border border-purple-100/60 text-purple-700 text-xs font-bold rounded-full shadow-xs"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <span>{filteredStores.length} Stores Verified</span>
          </motion.div>
        </div>

        {/* Page Title */}
        <div className="space-y-2">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl md:text-5xl font-heading leading-tight"
          >
            Explore Local{" "}
            <span className="bg-clip-text text-transparent bg-linear-to-r from-purple-600 via-indigo-600 to-purple-800">
              Clothing Stores
            </span>{" "}
            in Namakkal
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-sm sm:text-base text-slate-500 font-body max-w-3xl leading-relaxed"
          >
            Discover and support local boutiques, saree houses, footwear outlets, and fashion stores in your neighborhood. Try them on in-person with zero fit errors.
          </motion.p>
        </div>

        {/* Filter Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22 }}
        >
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
          />
        </motion.div>

        {/* Store Listings */}
        <StoreListings
          displayedStores={displayedStores}
          viewMode={viewMode}
          clearFilters={clearFilters}
          search={search}
          location={location}
        />

        {/* Pagination */}
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
          <div className="relative flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
            <div className="absolute h-6 w-6 rounded-full bg-purple-50 animate-pulse" />
          </div>
        </div>
      }
    >
      <ExploreStoresContent />
    </Suspense>
  );
}
