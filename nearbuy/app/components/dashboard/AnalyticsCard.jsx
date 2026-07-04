import React from "react";
import Card, { CardHeader, CardBody } from "../ui/Card";

export default function AnalyticsCard({ title, subtitle, metrics = [] }) {
  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900">{title}</h3>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-blue-600 rounded-full inline-block" />
            Store Views
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block" />
            Offer Clicks
          </span>
        </div>
      </CardHeader>

      <CardBody className="py-6 px-4">
        {/* Mockup Chart Grid */}
        <div className="h-64 relative flex flex-col justify-between">
          {/* Y-axis helper lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            <div className="border-t border-gray-100 w-full h-0" />
            <div className="border-t border-gray-100 w-full h-0" />
            <div className="border-t border-gray-100 w-full h-0" />
            <div className="border-t border-gray-100 w-full h-0" />
            <div className="border-t border-gray-150 w-full h-0" />
          </div>

          {/* SVG Line Charts */}
          <svg className="w-full h-full absolute inset-0 z-10" viewBox="0 0 500 200" preserveAspectRatio="none">
            {/* Store Views Path */}
            <path
              d="M 0 160 Q 75 140 150 90 T 300 120 T 450 40 T 500 20"
              fill="none"
              stroke="#2563EB"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Offer Clicks Path */}
            <path
              d="M 0 180 Q 75 160 150 120 T 300 150 T 450 80 T 500 50"
              fill="none"
              stroke="#10B981"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="4 2"
            />

            {/* Accent dots */}
            <circle cx="150" cy="90" r="5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="300" cy="120" r="5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="450" cy="40" r="5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />

            <circle cx="150" cy="120" r="4.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="300" cy="150" r="4.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="450" cy="80" r="4.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
          </svg>

          {/* Y-axis labels */}
          <div className="absolute left-2 inset-y-0 flex flex-col justify-between text-[9px] font-bold text-gray-400 select-none z-20">
            <span>2.5K</span>
            <span>1.8K</span>
            <span>1.2K</span>
            <span>600</span>
            <span>0</span>
          </div>
        </div>

        {/* X-axis Month labels */}
        <div className="mt-3 flex justify-between px-6 text-[10px] font-semibold text-gray-400 select-none">
          <span>Feb</span>
          <span>Mar</span>
          <span>Apr</span>
          <span>May</span>
          <span>Jun</span>
          <span>Jul (Current)</span>
        </div>
      </CardBody>
    </Card>
  );
}
