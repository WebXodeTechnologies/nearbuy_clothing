import React from "react";

export default function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: "Discover Stores",
      description:
        "Filter stores by neighborhood location and categories like Men's, Women's, or Designer Boutiques.",
    },
    {
      number: 2,
      title: "Browse Collections & Deals",
      description:
        "Explore active lookbooks, gallery showcases, and claim exclusive discount coupons right on their profiles.",
    },
    {
      number: 3,
      title: "Walk In & Shop",
      description:
        "Use Google Maps coordinates to visit the shop, try out sizes, show coupon details, and complete purchase.",
    },
  ];

  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight sm:text-3xl">
            How It Works
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Discover and support local businesses in 3 easy steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-0.5 border-t border-dashed border-gray-200 z-0" />

          {steps.map((step) => (
            <div
              key={step.number}
              className="text-center relative z-10 flex flex-col items-center"
            >
              <div className="h-14 w-14 rounded-full bg-blue-50 border border-blue-150 flex items-center justify-center text-blue-600 font-bold text-lg mb-4 shadow-xs">
                {step.number}
              </div>
              <h4 className="font-bold text-gray-900 text-sm">{step.title}</h4>
              <p className="mt-2 text-xs text-gray-500 max-w-xs leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
