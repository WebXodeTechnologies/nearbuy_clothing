"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import Input from "../ui/Input";
import Select from "../ui/Select";
import { locations } from "@/data/dummy-data";

export default function StoreFilters({
  search,
  setSearch,
  location,
  handleLocationChange,
  category,
  handleCategoryClick,
  handleSearchSubmit,
  clearFilters,
  categoriesList,
  viewMode,
  setViewMode
}) {
  const cardRef = useRef(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setHoverPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="bg-white/95 backdrop-blur-md border border-slate-100 hover:border-purple-200/50 p-6 rounded-2xl shadow-xl shadow-slate-100/50 space-y-6 relative overflow-hidden transition-all duration-300"
    >
      {/* Interactive Cursor Spotlight Glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(180px circle at ${hoverPos.x}px ${hoverPos.y}px, rgba(147, 51, 234, 0.05), transparent 80%)`
        }}
      />

      <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4 relative z-10 font-body">
        <div className="flex-1">
          <Input
            name="search"
            placeholder="Search store name, collections, categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="focus-within:ring-2 focus-within:ring-purple-500/10 focus-within:border-purple-500 transition-all duration-200"
            icon={(props) => (
              <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          />
        </div>
        <div className="w-full md:w-64">
          <Select
            name="location"
            value={location}
            onChange={handleLocationChange}
            placeholder={null}
            options={locations.map((loc) => ({ value: loc, label: loc }))}
            className="focus-within:ring-2 focus-within:ring-purple-500/10 focus-within:border-purple-500 transition-all duration-200"
          />
        </div>
        <div className="flex gap-2 shrink-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="px-6 py-2.5 text-xs font-bold bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl shadow-md hover:shadow-lg hover:shadow-purple-600/10 transition-all duration-200 cursor-pointer"
          >
            Apply Filters
          </motion.button>
          {(search || location !== "All Locations" || category) && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={clearFilters}
              className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/50 rounded-xl transition-all cursor-pointer"
            >
              Reset
            </motion.button>
          )}
        </div>
      </form>

      {/* Categories Quick Filter Row */}
      <div className="border-t border-slate-100 pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none max-w-full">
          {categoriesList.map((cat) => {
            const isSelected = (!category && cat === "All Categories") || category === cat;
            return (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleCategoryClick(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 cursor-pointer select-none ${
                  isSelected
                    ? "bg-linear-to-r from-purple-600 to-indigo-600 border-transparent text-white shadow-md shadow-purple-600/10 font-extrabold"
                    : "bg-slate-50 border-slate-200/55 text-slate-600 hover:bg-slate-100 hover:border-slate-300"
                }`}
              >
                {cat}
              </motion.button>
            );
          })}
        </div>

        {/* View switcher */}
        <div className="hidden sm:flex items-center gap-1 bg-slate-50 border border-slate-200/50 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${
              viewMode === "grid"
                ? "bg-white text-purple-600 shadow-sm border border-slate-100"
                : "text-slate-400 hover:text-slate-700"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${
              viewMode === "list"
                ? "bg-white text-purple-600 shadow-sm border border-slate-100"
                : "text-slate-400 hover:text-slate-700"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
