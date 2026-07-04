"use client";

import React from "react";
import Breadcrumb from "../../components/navigation/Breadcrumb";
import Card, { CardBody } from "../../components/ui/Card";

export default function TermsPage() {
  return (
    <div className="flex-1 bg-gray-50/50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: "Terms & Conditions", href: "/terms" }]} />

        {/* Header */}
        <div className="mt-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-950 tracking-tight sm:text-3xl">
            Terms & Conditions
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Last Updated: July 04, 2026
          </p>
        </div>

        {/* Content Card */}
        <Card className="bg-white">
          <CardBody className="p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-gray-600 leading-relaxed">
            <p>
              Welcome to Nearby Clothing. By accessing or using our directory platform, you agree to comply with and be bound by the following terms of use. Please read them carefully.
            </p>

            <div className="space-y-2">
              <h3 className="font-bold text-gray-950 text-sm">1. Non-E-Commerce Platform Scope</h3>
              <p>
                Nearby Clothing is a hyperlocal directory directory platform that assists customers in discovering local physical apparel outlets, catalog lookbooks, and active coupons. 
              </p>
              <p className="font-semibold text-gray-800">
                You cannot buy, check out, pay for, or ship clothing items through this website. All financial transactions must take place physically at the vendor's retail shop.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-gray-950 text-sm">2. Coupon and Offer Redemption</h3>
              <p>
                Any active offers, discount codes, or buy-one-get-one coupons listed on the platform must be claimed digital-only and presented to the merchant at the physical billing counter. Redemption is subject to the terms listed on the coupon details page, and merchants reserve the right to verify claim validity.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-gray-950 text-sm">3. Merchant Content Integrity</h3>
              <p>
                Merchants registered under our subscription tiers are responsible for the accuracy of their catalog lookbooks, pricing details, operational hours, and gallery images. Nearby Clothing does not guarantee stock availability at any physical store location.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-gray-950 text-sm">4. Limitation of Liability</h3>
              <p>
                Nearby Clothing shall not be liable for any disputes, size mismatches, garment quality defects, or transactions taking place at the physical retail shops. We act solely as a discovery link between buyers and boutiques.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
