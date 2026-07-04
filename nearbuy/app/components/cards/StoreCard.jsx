import React from "react";
import Link from "next/link";
import Badge from "../ui/Badge";
import Card from "../ui/Card";

export default function StoreCard({ store }) {
  const { name, slug, logo, banner, rating, reviewsCount, categories, location, hours } = store;

  return (
    <Card hoverable className="flex flex-col h-full bg-white group">
      {/* Banner Image */}
      <div className="relative h-44 w-full overflow-hidden bg-gray-100 shrink-0">
        <img
          src={banner}
          alt={name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2 py-1 rounded-md text-xs font-semibold text-gray-800 shadow-xs flex items-center gap-1 border border-gray-100">
          <svg className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {rating}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col relative">
        {/* Store Logo overlapping banner */}
        <div className="absolute -top-8 left-5 h-14 w-14 rounded-xl border-2 border-white bg-white overflow-hidden shadow-md shrink-0">
          <img src={logo} alt={`${name} Logo`} className="h-full w-full object-cover" />
        </div>

        <div className="pt-6 flex-1 flex flex-col">
          {/* Title */}
          <Link href={`/stores/${slug}`} className="block">
            <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 text-base">
              {name}
            </h4>
          </Link>

          {/* Location */}
          <div className="mt-1 flex items-center text-xs text-gray-500 gap-1">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{location}</span>
          </div>

          {/* Hours */}
          <div className="mt-1 flex items-center text-xs text-gray-400 gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Open: {hours}</span>
          </div>

          {/* Categories */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {categories.slice(0, 3).map((cat) => (
              <Badge key={cat} variant="gray" pill className="text-[10px]">
                {cat}
              </Badge>
            ))}
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between shrink-0">
          <span className="text-[11px] font-medium text-gray-400">
            {reviewsCount} reviews
          </span>
          <Link
            href={`/stores/${slug}`}
            className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 gap-0.5"
          >
            Explore Store
            <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </Card>
  );
}
