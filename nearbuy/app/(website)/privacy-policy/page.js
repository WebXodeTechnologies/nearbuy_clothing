"use client";

import React from "react";
import Breadcrumb from "../../components/navigation/Breadcrumb";
import Card, { CardBody } from "../../components/ui/Card";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex-1 bg-gray-50/50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: "Privacy Policy", href: "/privacy-policy" }]} />

        {/* Header */}
        <div className="mt-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-950 tracking-tight sm:text-3xl">
            Privacy Policy
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Last Updated: July 04, 2026
          </p>
        </div>

        {/* Content Card */}
        <Card className="bg-white">
          <CardBody className="p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-gray-600 leading-relaxed">
            <p>
              At Nearby Clothing Platform, we value the trust you place in us. This Privacy Policy describes how we collect, use, share, and protect your personal information when you use our hyperlocal clothing discovery directory website.
            </p>

            <div className="space-y-2">
              <h3 className="font-bold text-gray-950 text-sm">1. Information We Collect</h3>
              <p>
                We collect personal information that you provide to us directly, such as when you create a customer account, register as a store merchant vendor, submit inquiry contact forms, or claim active coupons. This information may include:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Name, email address, physical address, and contact numbers.</li>
                <li>For store vendors: store brand logo, banners, coordinates, and business registration details.</li>
                <li>Simulated coupon claim logs to track walk-in discounts.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-gray-950 text-sm">2. How We Use Your Information</h3>
              <p>
                Nearby Clothing is a hyperlocal directory. We do NOT run e-commerce checkouts. We use the collected data to:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Present nearby clothing stores and design collections to customers searching in their area.</li>
                <li>Notify vendors of customer coupon claims to allow discount verification.</li>
                <li>Process subscriptions, resolve customer queries, and prevent fraud.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-gray-950 text-sm">3. Location Information</h3>
              <p>
                Since Nearby Clothing is a hyperlocal platform, we may request your browser's location coordinates to display clothing shops closest to you. You can enable or disable location tracking anytime via your browser settings.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-gray-950 text-sm">4. Contact Information</h3>
              <p>
                If you have any questions or concerns regarding our privacy policies, please write to us at <span className="font-bold text-gray-950">privacy@nearbyclothing.com</span>.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
