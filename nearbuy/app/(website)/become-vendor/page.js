"use client";

import React, { useState } from "react";
import Link from "next/link";
import { plans } from "../../data/dummy-data";
import Breadcrumb from "../../components/navigation/Breadcrumb";
import Card, { CardBody } from "../../components/ui/Card";
import Button from "../../components/ui/Button";

const VENDOR_FAQS = [
  {
    question: "Do you charge commissions on my store sales?",
    answer: "No! Nearby Clothing is a listing directory, not an e-commerce marketplace. Customers discover your store here but purchase physically at your shop. We charge 0% sales commission. You only pay the flat subscription fee for premium visibility."
  },
  {
    question: "How long does vendor registration and approval take?",
    answer: "After submitting your store profile details and choosing a subscription plan, our administrators verify your physical shop address. Approval typically takes 12 to 24 hours, after which your store goes live."
  },
  {
    question: "Can I upgrade, downgrade or cancel my plan?",
    answer: "Yes, you can change your listing subscription plan at any time directly through your Vendor Portal's Subscription tab. Downgrades or cancellations will take effect at the end of your billing cycle."
  },
  {
    question: "How do customers find my store?",
    answer: "Customers search by department categories, product keywords, or neighborhood locations. Stores on Grow (Silver) and Enterprise (Gold) plans receive premium badges, higher search rankings, and homepage features."
  }
];

export default function BecomeVendorPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const merchantBenefits = [
    {
      title: "Drive Local Walk-Ins",
      description: "Increase foot traffic to your physical store location by capturing nearby search intent from local buyers.",
      icon: (
        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      title: "Zero Sales Commission",
      description: "Keep 100% of your earnings. We charge a flat monthly listing subscription fee with absolutely no transaction fees.",
      icon: (
        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Active Promo Campaigns",
      description: "Launch flash discounts, weekend sales, and coupon codes. Buyers claim coupons here and show them at your counter.",
      icon: (
        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "Showcase Lookbooks",
      description: "Publish your latest seasonal catalogs and custom tailored gallery items to entice digital discovery shoppers.",
      icon: (
        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  return (
    <div className="flex-1 bg-gray-50/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: "Become a Vendor", href: "/become-vendor" }]} />

        {/* Hero header */}
        <div className="mt-8 text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full inline-block uppercase tracking-wider">
            Vendor Program Listings
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-950 tracking-tight leading-tight">
            Put Your Clothing Store on the <br className="hidden sm:inline" />
            Local Digital Map
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Nearby Clothing connects local boutique retailers directly with local shoppers looking to purchase offline. No courier logistics, just walk-in sales.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link href="/auth/register?role=vendor">
              <span className="inline-flex items-center justify-center font-bold px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm select-none cursor-pointer text-xs">
                Register Store Now
              </span>
            </Link>
          </div>
        </div>

        {/* Core Merchant Benefits */}
        <div className="mt-16 space-y-10">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight text-center">Why List with Nearby Clothing?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {merchantBenefits.map((benefit, idx) => (
              <Card key={idx} className="bg-white">
                <CardBody className="p-6 space-y-3.5">
                  <div className="h-9 w-9 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{benefit.title}</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        {/* Subscription pricing tables */}
        <div className="mt-20 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight sm:text-3xl">Pricing & Subscription Plans</h2>
            <p className="text-sm text-gray-500">Pick a listing tier that matches your store's requirements. Cancel anytime.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className={`
                  bg-white border rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative shadow-xs h-full
                  ${plan.popular ? "border-2 border-blue-600 ring-2 ring-blue-50" : "border-gray-150"}
                `}
              >
                {plan.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                    Most Popular
                  </span>
                )}

                <div>
                  <h3 className="font-bold text-gray-900 text-lg leading-tight">{plan.name}</h3>
                  <p className="text-xs text-gray-400 mt-1 min-h-[32px]">{plan.description}</p>
                  
                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-gray-950 tracking-tight">{plan.price}</span>
                    <span className="text-xs text-gray-500 font-semibold">/ {plan.period}</span>
                  </div>

                  <ul className="mt-6 space-y-3.5 border-t border-gray-100 pt-6">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs text-gray-600">
                        <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-50">
                  <Link href={`/auth/register?role=vendor&plan=${encodeURIComponent(plan.name)}`}>
                    <span className={`
                      w-full text-center py-2.5 rounded-lg text-xs font-bold transition-all block select-none cursor-pointer
                      ${plan.popular 
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm" 
                        : "bg-gray-100 hover:bg-gray-200 text-gray-900"}
                    `}>
                      {plan.cta}
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vendor Program FAQ section */}
        <div className="mt-20 max-w-3xl mx-auto space-y-10">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-3">
            {VENDOR_FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="bg-white border border-gray-150 rounded-xl overflow-hidden transition-all">
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
      </div>
    </div>
  );
}
