"use client";

import React from "react";
import Link from "next/link";
import Breadcrumb from "../../components/navigation/Breadcrumb";
import Card, { CardBody } from "../../components/ui/Card";
import Button from "../../components/ui/Button";

export default function AboutPage() {
  const stats = [
    { value: "50+", label: "Registered Boutiques" },
    { value: "12,000+", label: "Monthly Store Discovery Views" },
    { value: "35%+", label: "Average Footfall Increase" },
    { value: "5+", label: "Namakkal Commercial Hubs" }
  ];

  return (
    <div className="flex-1 bg-gray-50/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: "About Us", href: "/about" }]} />

        {/* Content Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Our Story</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
              Reviving Local Fashion Retail Through Hyperlocal Technology
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              Nearby Clothing was founded in 2500 with a simple realization: local brick-and-mortar clothing stores possess incredible design talent and collections, yet struggle to compete against multi-billion dollar online retailers. 
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              We asked ourselves: why wait for package deliveries and deal with size returns when the perfect dress or suit might be hanging in a boutique just 500 meters down your street?
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Nearby Clothing is not an e-commerce platform. We don't believe in adding shipping trucks to streets. Instead, we showcase physical merchant inventories digitally, allowing shoppers to discover fashion locally, try sizes physically, and get custom adjustments directly.
            </p>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative border border-gray-150 rounded-2xl overflow-hidden shadow-lg h-80">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80"
                alt="Local Boutique"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-blue-600 text-white p-5 rounded-2xl shadow-md hidden sm:block max-w-xs">
              <h4 className="font-bold text-sm">Supporting Local Shops</h4>
              <p className="text-[10px] text-blue-100 mt-1">
                Every listing on our platform helps a brick-and-mortar boutique thrive in a digital era.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-16 bg-white border border-gray-100 rounded-2xl p-8 shadow-xs grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="space-y-1">
              <div className="text-3xl font-extrabold text-blue-600 tracking-tight">{stat.value}</div>
              <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-white">
            <CardBody className="p-8 space-y-3">
              <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 font-bold text-lg mb-2">
                M
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Our Mission</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                To empower local independent apparel vendors with premium digital discovery tools, driving customer walk-in foot traffic, increasing local employment, and saving buyers the hassle of online size returns.
              </p>
            </CardBody>
          </Card>
          <Card className="bg-white">
            <CardBody className="p-8 space-y-3">
              <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 font-bold text-lg mb-2">
                V
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Our Vision</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                To create a world where local boutiques and designer shops are the first place citizens search for clothing, establishing a highly integrated physical-digital retail environment in every major smart city.
              </p>
            </CardBody>
          </Card>
        </div>

        {/* Platform Benefits */}
        <div className="mt-16 space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight sm:text-3xl">Platform Benefits</h2>
            <p className="mt-1 text-sm text-gray-500">Helping buyers buy locally, helping stores sell confidently.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4 p-5 bg-white border border-gray-100 rounded-xl shadow-xs">
              <div className="h-8 w-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">For Customers</h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Discover boutique clothing and accessories close to home. Try sizes and textures instantly, claim active coupons, get tailoring support, and support small merchants.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-5 bg-white border border-gray-100 rounded-xl shadow-xs">
              <div className="h-8 w-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">For Retail Merchants</h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Increase storefront footfall without complex commissions or logistics. Post active lookbooks, run flash offers, showcase gallery items, and connect via WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA section */}
        <div className="mt-16 bg-gray-900 rounded-2xl p-8 text-center text-white relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold">Ready to discover your neighborhood boutiques?</h3>
            <p className="text-xs text-gray-400">
              Browse stores in your locality and browse discounts instantly.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link href="/stores">
                <span className="inline-flex items-center justify-center font-bold px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer text-xs">
                  Explore Stores
                </span>
              </Link>
              <Link href="/become-vendor">
                <span className="inline-flex items-center justify-center font-medium px-5 py-2.5 rounded-lg border border-gray-700 hover:border-gray-500 text-white transition-colors cursor-pointer text-xs">
                  Merchant Registration
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
