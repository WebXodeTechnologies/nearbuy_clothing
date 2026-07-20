import React from "react";

export default function AnalyticsCard({ title, subtitle }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-gray-900 tracking-tight">{title}</h3>
          {subtitle && <p className="text-xs text-gray-500 font-medium mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs font-bold text-gray-600 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
            <span className="w-2.5 h-2.5 bg-blue-600 rounded-full inline-block shadow-2xs" />
            Store Page Views
          </span>
          <span className="flex items-center gap-1.5 text-xs font-bold text-gray-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block shadow-2xs" />
            Lead Enquiries
          </span>
        </div>
      </div>

      {/* SVG Vector Chart Area */}
      <div className="h-64 relative flex flex-col justify-between pt-2">
        {/* Y-axis Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          <div className="border-t border-gray-100 w-full" />
          <div className="border-t border-gray-100 w-full" />
          <div className="border-t border-gray-100 w-full" />
          <div className="border-t border-gray-100 w-full" />
          <div className="border-t border-gray-200 w-full" />
        </div>

        {/* SVG Chart with Gradient Fills */}
        <svg className="w-full h-full absolute inset-0 z-10 overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area Fills */}
          <path
            d="M 0 160 Q 75 140 150 90 T 300 120 T 450 40 T 500 20 L 500 200 L 0 200 Z"
            fill="url(#blueGradient)"
          />
          <path
            d="M 0 180 Q 75 160 150 120 T 300 150 T 450 80 T 500 50 L 500 200 L 0 200 Z"
            fill="url(#emeraldGradient)"
          />

          {/* Lines */}
          <path
            d="M 0 160 Q 75 140 150 90 T 300 120 T 450 40 T 500 20"
            fill="none"
            stroke="#2563EB"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M 0 180 Q 75 160 150 120 T 300 150 T 450 80 T 500 50"
            fill="none"
            stroke="#10B981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="5 3"
          />

          {/* Data Points */}
          <circle cx="150" cy="90" r="5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2.5" />
          <circle cx="300" cy="120" r="5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2.5" />
          <circle cx="450" cy="40" r="6" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2.5" />

          <circle cx="150" cy="120" r="4" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="300" cy="150" r="4" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="450" cy="80" r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
        </svg>

        {/* Y-axis Labels */}
        <div className="absolute left-2 inset-y-0 flex flex-col justify-between text-[10px] font-mono font-bold text-gray-400 select-none z-20 pointer-events-none">
          <span>2,500</span>
          <span>1,800</span>
          <span>1,200</span>
          <span>600</span>
          <span>0</span>
        </div>
      </div>

      {/* X-axis Timeline */}
      <div className="flex justify-between px-8 text-[11px] font-bold text-gray-400 select-none border-t border-gray-100 pt-3">
        <span>Feb</span>
        <span>Mar</span>
        <span>Apr</span>
        <span>May</span>
        <span>Jun</span>
        <span className="text-blue-600 font-extrabold bg-blue-50 px-2 py-0.5 rounded-md">Jul (Live)</span>
      </div>
    </div>
  );
}
