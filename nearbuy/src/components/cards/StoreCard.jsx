"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function StoreCard({ store }) {
  const {
    name,
    slug,
    logo,
    rating = 4.8,
    reviewsCount = 0,
    categories = [],
    location = "Namakkal Main Road",
    hours = "10:00 AM - 9:00 PM",
    phone = "919876543210", // Fallback for direct WhatsApp lead
  } = store || {};

  const handleWhatsAppClick = (e) => {
    e.stopPropagation();
    const message = encodeURIComponent(
      `Hi ${name}, I discovered your store on Streetunics and would like to check your latest collection!`,
    );
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  return (
    <div className="group relative flex flex-col h-full bg-white border border-gray-200/80 hover:border-purple-500/50 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 p-6 justify-between">
      <div className="space-y-4">
        {/* Header: Logo, Verified Badge, and Rating */}
        <div className="flex items-start justify-between gap-3">
          <div className="relative h-16 w-16 rounded-2xl bg-gray-50 overflow-hidden shadow-md shrink-0 border border-gray-100 group-hover:scale-105 transition-transform duration-300">
            <Image
              src={logo || "/placeholder-logo.jpg"}
              alt={`${name} Logo`}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col items-end gap-1.5">
            {/* Rating Badge */}
            <div className="bg-gray-950/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-sm flex items-center gap-1 border border-white/10">
              <svg
                className="w-3.5 h-3.5 text-amber-400 fill-current"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>{rating}</span>
            </div>

            {/* Verified Boutique Badge */}
            <div className="bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold text-emerald-700 shadow-2xs flex items-center gap-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              Verified Boutique
            </div>
          </div>
        </div>

        {/* Store Name & Details */}
        <div className="space-y-2.5">
          <Link href={`/stores/${slug}`} className="block group/title">
            <h3 className="font-heading font-extrabold text-gray-950 text-lg sm:text-xl tracking-tight group-hover/title:text-purple-600 transition-colors line-clamp-1">
              {name}
            </h3>
          </Link>

          {/* Location Line */}
          <div className="flex items-center text-xs font-medium text-gray-600 gap-1.5">
            <div className="h-5 w-5 rounded-md bg-purple-50 flex items-center justify-center shrink-0 border border-purple-100 text-purple-600">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <span className="truncate">{location}</span>
          </div>

          {/* Operating Hours */}
          <div className="flex items-center text-xs font-medium text-gray-500 gap-1.5">
            <div className="h-5 w-5 rounded-md bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-600 border border-emerald-100">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span>Open: {hours}</span>
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div className="pt-1 flex flex-wrap gap-1.5">
              {categories.slice(0, 3).map((cat) => (
                <span
                  key={cat}
                  className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-[10px] font-bold uppercase tracking-wider group-hover:bg-purple-50 group-hover:text-purple-700 transition-colors"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between gap-2 shrink-0">
        <button
          onClick={handleWhatsAppClick}
          type="button"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white px-3.5 py-2.5 rounded-xl transition-all duration-200 border border-emerald-200 shadow-2xs cursor-pointer"
          title="Chat directly on WhatsApp"
        >
          <span className="text-sm">💬</span>
          <span>WhatsApp</span>
        </button>

        <Link
          href={`/stores/${slug}`}
          className="inline-flex items-center gap-1 text-xs font-extrabold text-purple-600 hover:text-white bg-purple-50 hover:bg-purple-600 px-4 py-2.5 rounded-xl transition-all duration-200 border border-purple-100 group/btn shadow-2xs"
        >
          <span>View Store</span>
          <svg
            className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
