"use client";

import React from "react";
import Link from "next/link";
import { categories } from "../../data/dummy-data";
import Breadcrumb from "../../components/navigation/Breadcrumb";
import Card, { CardBody } from "../../components/ui/Card";

export default function CategoriesPage() {
  return (
    <div className="flex-1 bg-gray-50/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: "Categories", href: "/categories" }]} />

        {/* Header Title */}
        <div className="mt-6 mb-10">
          <h1 className="text-2xl font-bold text-gray-950 tracking-tight sm:text-3xl">
            Browse Clothing Categories
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Discover local store offerings categorized by dress styles, footwear, boutiques, and fashion departments.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Card key={cat.id} hoverable className="bg-white flex flex-col h-full group">
              <div className="h-48 w-full overflow-hidden bg-gray-100 shrink-0">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              <CardBody className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 text-base group-hover:text-blue-600 transition-colors">
                      {cat.name}
                    </h3>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      {cat.count} stores
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-end">
                  <Link
                    href={`/stores?category=${encodeURIComponent(cat.name)}`}
                    className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 gap-0.5"
                  >
                    View Registered Stores
                    <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
