/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";

export default function LatestCollectionsSection({ collections }) {
  return (
    <section className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
            Fresh Arrivals
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
            Latest Lookbook Releases
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Fresh designer drops and seasonal collections available in local store inventories right now.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((coll, idx) => (
            <div
              key={idx}
              className="flex flex-col bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-2xs hover:shadow-xl hover:border-blue-200 transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="h-56 relative overflow-hidden bg-gray-100 shrink-0">
                <img
                  src={coll.image}
                  alt={coll.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-lg text-[10px] font-bold text-blue-600 shadow-xs uppercase tracking-wide border border-gray-150">
                  New Drop
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600">
                    Store: {coll.storeName}
                  </span>
                  <h4 className="font-heading font-bold text-gray-950 mt-1 mb-2 text-lg line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {coll.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 leading-relaxed font-body">
                    {coll.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <Link
                    href={`/stores/${coll.storeSlug}`}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group/btn"
                  >
                    Explore Store Catalog
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
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
