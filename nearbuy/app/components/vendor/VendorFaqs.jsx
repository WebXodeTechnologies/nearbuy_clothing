"use client";

import React from "react";
import FaqSection from "../home/FaqSection";

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
    answer: "Yes, you can change your listing subscription plan at any time directly through your Vendor's Portal Subscription tab. Downgrades or cancellations will take effect at the end of your billing cycle."
  },
  {
    question: "How do customers find my store?",
    answer: "Customers search by department categories, product keywords, or neighborhood locations. Stores on Grow (Silver) and Enterprise (Gold) plans receive premium badges, higher search rankings, and homepage features."
  }
];

export default function VendorFaqs() {
  return (
    <FaqSection
      faqs={VENDOR_FAQS}
      title={
        <>
          Merchant Program{" "}
          <span className="bg-clip-text text-transparent bg-linear-to-r from-purple-600 via-indigo-600 to-purple-800">
            FAQs
          </span>
        </>
      }
      description="Common questions boutique owners ask about our listing plans and storefront setup."
    />
  );
}
