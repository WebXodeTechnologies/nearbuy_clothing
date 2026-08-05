/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import Link from "next/link";

export default function CategoryCard({ category }) {
  return (
    <Link
      href={`/stores?category=${encodeURIComponent(category.name)}`}
      className="group relative flex flex-col items-center bg-white p-4 sm:p-5 rounded-3xl text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10 border border-gray-100"
    >
      {/* Image Container - Changed to portrait aspect ratio */}
      <div className="relative aspect-4/5 w-full rounded-2xl overflow-hidden mb-4 bg-gray-100 shadow-inner border border-gray-50">
        <img
          src={category.image}
          alt={category.name}
          className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
        />
        {/* Subtle overlay to ensure text readability if image is bright */}
        <div className="absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent" />
      </div>

      {/* Count Micro Badge - Moved above title, styled cleaner */}
      <span className="mb-1.5 inline-block rounded-full bg-gray-50 px-3 py-1 text-[10px] sm:text-xs font-medium text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors duration-300">
        {category.count || "12+"} Stores
      </span>

      {/* Category Name - Slightly larger font, less harsh color */}
      <span className="font-heading font-bold text-gray-800 text-sm sm:text-base group-hover:text-blue-700 transition-colors duration-300 tracking-tight line-clamp-2 px-1">
        {category.name}
      </span>
    </Link>
  );
}