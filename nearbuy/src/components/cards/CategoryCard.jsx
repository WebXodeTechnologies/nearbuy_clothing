/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import Link from "next/link";

export default function CategoryCard({ category }) {
  return (
    <Link
      href={`/stores?category=${encodeURIComponent(category.name)}`}
      className="group relative flex flex-col items-center bg-white/90 backdrop-blur-md border border-gray-200/90 hover:border-blue-400 p-4 sm:p-5 rounded-2xl sm:rounded-3xl text-center transition-all duration-300 hover:-translate-y-1.5 shadow-xs hover:shadow-xl hover:shadow-blue-600/10 overflow-hidden"
    >
      {/* Background Hover Sheen */}
      <div className="absolute inset-0 bg-linear-to-tr from-blue-500/5 via-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Image Container with Glow Ring */}
      <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-2xl overflow-hidden mb-3.5 bg-gray-100 border border-gray-200/80 group-hover:border-blue-300 group-hover:scale-105 transition-all duration-300 shadow-xs group-hover:shadow-md">
        <img
          src={category.image}
          alt={category.name}
          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Category Name */}
      <span className="font-heading font-extrabold text-gray-950 text-xs sm:text-sm truncate max-w-full group-hover:text-blue-600 transition-colors tracking-tight">
        {category.name}
      </span>

      {/* Count Micro Badge */}
      <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-gray-100 group-hover:bg-blue-50 text-gray-500 group-hover:text-blue-600 transition-colors">
        {category.count || "12+"} stores
      </span>

      {/* Bottom Hover Gradient Line Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-blue-600 to-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </Link>
  );
}
