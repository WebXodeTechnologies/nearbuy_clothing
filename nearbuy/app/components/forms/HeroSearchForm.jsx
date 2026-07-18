"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";

export default function HeroSearchForm() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");

  const popularTags = [
    { label: "👗 Ethnic Wear", query: "Ethnic" },
    { label: "👟 Footwear", query: "Footwear" },
    { label: "⚡ Indiranagar", loc: "Indiranagar, Bangalore" },
    { label: "🏷️ Active Coupons", query: "Discounts" },
  ];

  const handleSearch = (e) => {
    e?.preventDefault();
    router.push(
      `/stores?q=${encodeURIComponent(searchQuery)}&loc=${encodeURIComponent(selectedLocation)}`
    );
  };

  const handleQuickTagClick = (tag) => {
    if (tag.query) setSearchQuery(tag.query);
    if (tag.loc) setSelectedLocation(tag.loc);
    router.push(
      `/stores?q=${encodeURIComponent(tag.query || searchQuery)}&loc=${encodeURIComponent(tag.loc || selectedLocation)}`
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-10">
      {/* Search Input Box */}
      <form
        onSubmit={handleSearch}
        className="bg-white p-3 rounded-2xl shadow-xl shadow-blue-900/5 border border-gray-200 flex flex-col md:flex-row items-center gap-3 transition-all focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500"
      >
        {/* Keyword input */}
        <div className="flex-1 w-full flex items-center px-4 py-2.5 border-b md:border-b-0 md:border-r border-gray-100 gap-3">
          <svg
            className="w-5 h-5 text-blue-600 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search styles, designer boutiques, ethnic wear..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-sm font-medium outline-hidden border-none text-gray-900 placeholder-gray-400 bg-transparent focus:ring-0 focus:outline-hidden"
          />
        </div>

        {/* Location selector */}
        <div className="w-full md:w-56 flex items-center px-4 py-2.5 gap-2.5 bg-gray-50/80 rounded-xl border border-gray-100 md:bg-transparent md:border-none">
          <svg
            className="w-5 h-5 text-gray-400 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full text-sm text-gray-800 outline-hidden border-none bg-transparent cursor-pointer font-semibold"
          >
            <option value="All Locations">All Bangalore</option>
            <option value="Indiranagar, Bangalore">Indiranagar</option>
            <option value="Commercial Street, Bangalore">Commercial St</option>
            <option value="Koramangala, Bangalore">Koramangala</option>
            <option value="Jayanagar, Bangalore">Jayanagar</option>
          </select>
        </div>

        <Button type="submit" className="w-full md:w-auto px-8 py-3.5 rounded-xl font-bold text-sm shadow-md shrink-0">
          Explore Stores
        </Button>
      </form>

      {/* Quick Search Tags */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
        <span className="text-gray-400 font-semibold">Quick Tags:</span>
        {popularTags.map((tag, idx) => (
          <button
            key={idx}
            onClick={() => handleQuickTagClick(tag)}
            className="bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 px-3.5 py-1.5 rounded-full text-gray-700 hover:text-blue-600 font-medium transition-all cursor-pointer shadow-2xs hover:shadow-xs"
          >
            {tag.label}
          </button>
        ))}
      </div>
    </div>
  );
}
