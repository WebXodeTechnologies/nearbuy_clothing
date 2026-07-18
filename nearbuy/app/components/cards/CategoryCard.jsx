/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import Link from "next/link";

export default function CategoryCard({ category }) {
  return (
    <Link
      href={`/stores?category=${encodeURIComponent(category.name)}`}
      className="group flex flex-col items-center bg-white hover:bg-white border border-gray-200/80 hover:border-blue-300 p-5 rounded-2xl text-center transition-all duration-300 hover:-translate-y-1 shadow-2xs hover:shadow-lg"
    >
      <div className="h-16 w-16 rounded-2xl overflow-hidden mb-3 bg-gray-100 border border-gray-200 group-hover:scale-105 transition-transform duration-300 shadow-xs">
        <img
          src={category.image}
          alt={category.name}
          className="h-full w-full object-cover"
        />
      </div>
      <span className="font-heading font-bold text-gray-950 text-xs sm:text-sm truncate max-w-full group-hover:text-blue-600 transition-colors">
        {category.name}
      </span>
      <span className="text-[11px] font-medium text-gray-400 mt-0.5">
        {category.count} stores
      </span>
    </Link>
  );
}
