"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { categories, stores, testimonials, faqs } from "../data/dummy-data";
import StoreCard from "../components/cards/StoreCard";
import OfferCard from "../components/cards/OfferCard";
import Button from "../components/ui/Button";

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/stores?q=${encodeURIComponent(searchQuery)}&loc=${encodeURIComponent(selectedLocation)}`);
  };

  // Get featured stores
  const featuredStores = stores.filter(s => s.isFeatured);

  // Get all offers from stores to display trending
  const trendingOffers = stores.flatMap(s => 
    s.offers.map(o => ({ ...o, storeName: s.name, storeSlug: s.slug }))
  ).slice(0, 3);

  // Get some collections
  const latestCollections = stores.flatMap(s =>
    s.collections.map(c => ({ ...c, storeName: s.name, storeSlug: s.slug }))
  ).slice(0, 3);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* 1. Hero Section */}
      <section className="relative bg-white border-b border-gray-100 overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 bg-radial-gradient from-blue-50/40 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            Hyperlocal Fashion Discovery
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-950 tracking-tight max-w-4xl mx-auto leading-tight">
            Find Premium Clothing Collections <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Right in Your Neighborhood
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Discover independent boutiques, view the latest designer drops, check active offers, and walk in to find your perfect fit today. Supporting local retail.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="mt-10 max-w-3xl mx-auto bg-white p-2 rounded-2xl shadow-lg border border-gray-150 flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-gray-100 gap-2">
              <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search styles, boutiques, footwear..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm outline-hidden text-gray-900 placeholder-gray-400 bg-transparent"
              />
            </div>
            <div className="w-full md:w-52 flex items-center px-4 py-2 gap-2">
              <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full text-sm text-gray-700 outline-hidden bg-transparent cursor-pointer"
              >
                <option value="All Locations">All Bangalore</option>
                <option value="Indiranagar, Bangalore">Indiranagar</option>
                <option value="Commercial Street, Bangalore">Commercial St</option>
                <option value="Koramangala, Bangalore">Koramangala</option>
                <option value="Jayanagar, Bangalore">Jayanagar</option>
              </select>
            </div>
            <Button type="submit" className="md:px-8 py-3 rounded-xl font-bold">
              Find Stores
            </Button>
          </form>
        </div>
      </section>

      {/* 2. Featured Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center md:text-left md:flex md:items-end md:justify-between mb-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight sm:text-3xl">Featured Categories</h2>
              <p className="mt-1 text-sm text-gray-500">Explore collections curated by store departments.</p>
            </div>
            <Link href="/categories" className="hidden md:inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 gap-0.5">
              View All Categories
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/stores?category=${encodeURIComponent(cat.name)}`}
                className="group flex flex-col items-center bg-gray-50/50 hover:bg-white border border-gray-100 hover:border-gray-250 p-4 rounded-xl text-center transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="h-16 w-16 rounded-full overflow-hidden mb-3 bg-gray-100 border border-gray-150">
                  <img src={cat.image} alt={cat.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <span className="font-semibold text-gray-800 text-xs truncate max-w-full">
                  {cat.name}
                </span>
                <span className="text-[10px] text-gray-400 mt-0.5">
                  {cat.count} listings
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Stores */}
      <section className="py-16 bg-gray-50/40 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight sm:text-3xl">Featured Stores</h2>
              <p className="mt-1 text-sm text-gray-500">Premium boutiques highly rated by walk-in shoppers.</p>
            </div>
            <Link href="/stores" className="text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-0.5">
              Explore All
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredStores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Latest Collections */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight sm:text-3xl">Latest Collections</h2>
            <p className="mt-1 text-sm text-gray-500">Fresh designer releases and seasonal drops currently in stores.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestCollections.map((coll, idx) => (
              <div key={idx} className="flex flex-col border border-gray-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-gray-200 transition-all duration-200 group">
                <div className="h-56 relative overflow-hidden bg-gray-100">
                  <img src={coll.image} alt={coll.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] font-bold text-blue-600 shadow-xs uppercase tracking-wide">
                    New Drop
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                      Store: {coll.storeName}
                    </span>
                    <h4 className="font-bold text-gray-900 mt-1 mb-1.5 text-base line-clamp-1">
                      {coll.name}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {coll.description}
                    </p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between">
                    <Link href={`/stores/${coll.storeSlug}`} className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5">
                      Explore Store
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Trending Offers */}
      <section className="py-16 bg-gray-50/40 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight sm:text-3xl">Trending Local Offers</h2>
            <p className="mt-1 text-sm text-gray-500">Claim these coupon codes and walk in to redeem discount at billing.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendingOffers.map((off, idx) => (
              <OfferCard key={idx} offer={off} storeName={off.storeName} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Why Choose Nearby */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-blue-500 text-xs font-bold uppercase tracking-wider">The Offline Shopping Advantage</span>
            <h2 className="text-3xl font-extrabold tracking-tight mt-2 text-white sm:text-4xl">
              Why Shop Local Fashion Offline?
            </h2>
            <p className="mt-3 text-sm text-gray-400">
              Online shopping is convenient, but clothing requires fittings, fabrics, and direct relationships. Here is how we bridge the gap.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800/40 border border-gray-800 p-6 rounded-2xl">
              <div className="h-10 w-10 bg-blue-600/20 border border-blue-500/30 rounded-lg flex items-center justify-center text-blue-500 mb-5 font-bold">
                1
              </div>
              <h4 className="text-base font-bold text-white mb-2">Zero Size Mismatches</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Skip the trial-and-error return cycles. Discover the store nearby, walk in, try on the apparel, and get custom fitting support on the spot.
              </p>
            </div>
            <div className="bg-gray-800/40 border border-gray-800 p-6 rounded-2xl">
              <div className="h-10 w-10 bg-blue-600/20 border border-blue-500/30 rounded-lg flex items-center justify-center text-blue-500 mb-5 font-bold">
                2
              </div>
              <h4 className="text-base font-bold text-white mb-2">Touch the Fabric Quality</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Apparel looks different in heavily edited studio photos. Walk in to feel the cotton blends, linen weights, and silk weaves before purchasing.
              </p>
            </div>
            <div className="bg-gray-800/40 border border-gray-800 p-6 rounded-2xl">
              <div className="h-10 w-10 bg-blue-600/20 border border-blue-500/30 rounded-lg flex items-center justify-center text-blue-500 mb-5 font-bold">
                3
              </div>
              <h4 className="text-base font-bold text-white mb-2">Instant Collection Pickups</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Need an outfit for an event tonight? Don't hope for standard next-day shipping. Find a style nearby and purchase it immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. How It Works */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight sm:text-3xl">How It Works</h2>
            <p className="mt-1 text-sm text-gray-500">Discover and support local businesses in 3 easy steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting lines for desktop */}
            <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-0.5 border-t border-dashed border-gray-200 z-0" />

            <div className="text-center relative z-10 flex flex-col items-center">
              <div className="h-14 w-14 rounded-full bg-blue-50 border border-blue-150 flex items-center justify-center text-blue-600 font-bold text-lg mb-4 shadow-xs">
                1
              </div>
              <h4 className="font-bold text-gray-900 text-sm">Discover Stores</h4>
              <p className="mt-2 text-xs text-gray-500 max-w-xs leading-relaxed">
                Filter stores by neighborhood location and categories like Men's, Women's, or Designer Boutiques.
              </p>
            </div>

            <div className="text-center relative z-10 flex flex-col items-center">
              <div className="h-14 w-14 rounded-full bg-blue-50 border border-blue-150 flex items-center justify-center text-blue-600 font-bold text-lg mb-4 shadow-xs">
                2
              </div>
              <h4 className="font-bold text-gray-900 text-sm">Browse Collections & Deals</h4>
              <p className="mt-2 text-xs text-gray-500 max-w-xs leading-relaxed">
                Explore active lookbooks, gallery showcases, and claim exclusive discount coupons right on their profiles.
              </p>
            </div>

            <div className="text-center relative z-10 flex flex-col items-center">
              <div className="h-14 w-14 rounded-full bg-blue-50 border border-blue-150 flex items-center justify-center text-blue-600 font-bold text-lg mb-4 shadow-xs">
                3
              </div>
              <h4 className="font-bold text-gray-900 text-sm">Walk In & Shop</h4>
              <p className="mt-2 text-xs text-gray-500 max-w-xs leading-relaxed">
                Use Google Maps coordinates to visit the shop, try out sizes, show coupon details, and complete purchase.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Become a Vendor CTA */}
      <section className="py-16 bg-blue-600 relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-radial-gradient from-blue-500/30 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
            Are You a Clothing Store Vendor?
          </h2>
          <p className="mt-4 text-base text-blue-100 max-w-2xl mx-auto">
            Get discovered by thousands of customers searching for fashion in your neighborhood. Display your catalog, launch active offers, and drive premium walk-in foot traffic.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/become-vendor">
              <span className="inline-flex items-center justify-center font-bold px-6 py-3 rounded-xl bg-white text-blue-600 hover:bg-blue-50 transition-all shadow-md select-none cursor-pointer">
                List Your Store
              </span>
            </Link>
            <Link href="/about">
              <span className="inline-flex items-center justify-center font-medium px-6 py-3 rounded-xl border border-blue-400 hover:border-white text-white transition-all select-none cursor-pointer">
                Learn More
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* 9. Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight sm:text-3xl">Shopper & Vendor Stories</h2>
            <p className="mt-1 text-sm text-gray-500">Read how we've helped buyers find their fit and merchants grow listings.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((test) => (
              <div key={test.id} className="border border-gray-100 p-6 rounded-2xl bg-gray-50/50 flex flex-col justify-between">
                <p className="text-xs text-gray-600 italic leading-relaxed">
                  "{test.text}"
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <img src={test.avatar} alt={test.name} className="h-9 w-9 rounded-full object-cover" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-900">{test.name}</span>
                    <span className="text-[10px] text-gray-400 font-semibold">{test.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FAQs */}
      <section className="py-16 bg-gray-50/40 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight sm:text-3xl">Frequently Asked Questions</h2>
            <p className="mt-1 text-sm text-gray-500">Got questions? We've got answers.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="bg-white border border-gray-100 rounded-xl overflow-hidden transition-all duration-200">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-5 py-4 text-left flex justify-between items-center hover:bg-gray-50/50 cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm font-bold text-gray-800">
                      {faq.question}
                    </span>
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs text-gray-600 leading-relaxed border-t border-gray-50 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
