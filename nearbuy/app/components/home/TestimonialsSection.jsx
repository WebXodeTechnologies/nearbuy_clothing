"use client";

import React from "react";
import TestimonialCard from "../cards/TestimonialCard";

export default function TestimonialsSection({ testimonials }) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
            Community Feedback
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
            Shopper & Merchant Stories
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Discover how Nearbuy is empowering shoppers to find zero-fit-error apparel while boosting foot traffic for local stores.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test) => (
            <TestimonialCard key={test.id} testimonial={test} />
          ))}
        </div>
      </div>
    </section>
  );
}
