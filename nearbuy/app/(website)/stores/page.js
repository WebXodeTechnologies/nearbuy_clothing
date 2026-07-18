"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { stores, locations } from "../../data/dummy-data";
import StoreCard from "../../components/cards/StoreCard";
import Badge from "../../components/ui/Badge";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Breadcrumb from "../../components/navigation/Breadcrumb";

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

  // Sync state when URL search params change (e.g. from homepage search redirect)
  useEffect(() => {
    setSearch(urlQuery);
    setLocation(urlLoc);
    setCategory(urlCat);
  }, [urlQuery, urlLoc, urlCat]);

  const categoriesList = [
    "All Categories",
    "Men's Wear",
    "Women's Wear",
    "Kids Wear",
    "Ethnic Wear",
    "Boutique",
    "Footwear",
    "Accessories"
  ];

  // Filter logic
  const filteredStores = stores.filter((store) => {
    // Search query filter
    const matchesSearch =
      store.name.toLowerCase().includes(search.toLowerCase()) ||
      store.description.toLowerCase().includes(search.toLowerCase()) ||
      store.categories.some((cat) => cat.toLowerCase().includes(search.toLowerCase()));

    // Location filter
    const matchesLocation =
      location === "All Locations" || store.location.toLowerCase() === location.toLowerCase();

    // Category filter
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

  // Mock Pagination sizing
  const storesPerPage = 6;
  const totalPages = Math.ceil(filteredStores.length / storesPerPage) || 1;
  const displayedStores = filteredStores.slice(
    (currentPage - 1) * storesPerPage,
    currentPage * storesPerPage
  );

  return (
    <div className="flex-1 bg-gray-50/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Breadcrumb items={[{ label: "Explore Stores", href: "/stores" }]} />
          <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
            {filteredStores.length} stores found
          </span>
        </div>

        {/* Page title */}
        <div className="mt-6">
          <h1 className="text-2xl font-bold text-gray-950 tracking-tight sm:text-3xl">
            Explore Local Clothing Stores in Namakkal
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Browse through nearby boutiques, specialty shops, footwear options, and fashion outlets in Namakkal.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="mt-8 bg-white border border-gray-150 rounded-xl p-4 shadow-xs space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <Input
                name="search"
                placeholder="Search by store name, items, departments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={(props) => (
                  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              />
            </div>
            <div className="w-full md:w-60">
              <Select
                name="location"
                value={location}
                onChange={handleLocationChange}
                placeholder={null}
                options={locations.map((loc) => ({ value: loc, label: loc }))}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer"
              >
                Apply
              </button>
              {(search || location !== "All Locations" || category) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          </form>

          {/* Categories Quick Filter Row */}
          <div className="border-t border-gray-100 pt-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none max-w-full">
              {categoriesList.map((cat) => {
                const isSelected = (!category && cat === "All Categories") || category === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all shrink-0 cursor-pointer select-none ${
                      isSelected
                        ? "bg-blue-50 border-blue-300 text-blue-700 shadow-xs"
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* View switcher */}
            <div className="hidden sm:flex items-center gap-1 bg-gray-100 p-1 rounded-lg shrink-0">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === "grid" ? "bg-white text-blue-600 shadow-xs" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === "list" ? "bg-white text-blue-600 shadow-xs" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Store listings */}
        <div className="mt-8">
          {displayedStores.length === 0 ? (
            <div className="text-center py-20 bg-white border border-gray-150 rounded-2xl p-8 max-w-xl mx-auto shadow-xs">
              <div className="h-12 w-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 text-sm">No Stores Found</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto leading-relaxed">
                We couldn't find any boutiques matching "{search}" in "{location}". Try adjusting your keywords or widening your search location.
              </p>
              <button
                onClick={clearFilters}
                className="mt-5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedStores.map((store) => (
                <StoreCard key={store.id} store={store} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {displayedStores.map((store) => (
                <div
                  key={store.id}
                  className="bg-white border border-gray-150 rounded-xl p-5 hover:shadow-md hover:border-gray-250 transition-all duration-200 flex flex-col sm:flex-row gap-5 items-start sm:items-center relative"
                >
                  <div className="h-24 w-36 rounded-lg overflow-hidden shrink-0 bg-gray-50 relative border border-gray-100">
                    <img src={store.banner} alt={store.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 h-8 w-8 rounded-md border border-white bg-white overflow-hidden shadow-sm shrink-0">
                      <img src={store.logo} alt="Logo" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-gray-900 text-base truncate">{store.name}</h4>
                      <Badge variant="blue" pill className="text-[10px]">
                        {store.rating} ★
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1 leading-normal">
                      {store.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {store.location}
                      </span>
                      <span>Open: {store.hours}</span>
                    </div>
                  </div>
                  <div className="shrink-0 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-50 flex items-center justify-between sm:block text-right">
                    <span className="text-[10px] text-gray-400 font-semibold block">{store.reviewsCount} reviews</span>
                    <a
                      href={`/stores/${store.slug}`}
                      className="mt-1 inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50/50 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      View Profile
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-2.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-xs font-semibold text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ExploreStoresPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center p-12 bg-gray-50/50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    }>
      <ExploreStoresContent />
    </Suspense>
  );
}
