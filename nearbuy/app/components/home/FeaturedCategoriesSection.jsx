"use client";

import React from "react";
import Link from "next/link";
import CategoryCard from "../cards/CategoryCard";

export default function FeaturedCategoriesSection({ categories }) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
              Browse Departments
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
              Featured Fashion Categories
            </h2>
            <p className="mt-2 text-sm text-gray-500 max-w-xl">
              Discover local clothing collections categorized by style department and retail fashion niche.
            </p>
          </div>
          <Link
            href="/categories"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 bg-blue-50/80 hover:bg-blue-100 px-4 py-2 rounded-xl transition-all border border-blue-100 shrink-0 self-start sm:self-auto"
          >
            View All Categories
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}
