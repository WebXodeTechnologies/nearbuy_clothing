"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

// Default fallback data if dynamic backend analytics aren't loaded yet
const DEFAULT_ANALYTICS_DATA = [
  { label: "Feb", views: 800, enquiries: 350 },
  { label: "Mar", views: 1200, enquiries: 500 },
  { label: "Apr", views: 1650, enquiries: 720 },
  { label: "May", views: 1400, enquiries: 610 },
  { label: "Jun", views: 2100, enquiries: 890 },
  { label: "Jul", views: 2540, enquiries: 1120 },
  { label: "Aug", views: 2900, enquiries: 1350 },
];

// 🔒 DECLARED OUTSIDE OF RENDER TO PREVENT REACT COMPILER ERRORS
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-800 text-white p-3 rounded-2xl shadow-xl text-xs font-body space-y-1.5 backdrop-blur-md">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          {label} Performance
        </p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-slate-300 font-medium">
              {entry.name}:
            </span>
            <span className="font-extrabold text-white font-mono">
              {entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsCard({
  title = "Global Directory Traffic Trends",
  subtitle = "Comparing click conversions and lookbook impressions on the platform.",
  data = DEFAULT_ANALYTICS_DATA,
}) {
  const [timeRange, setTimeRange] = useState("6M"); // '7D' | '30D' | '6M'
  const [activeSeries, setActiveSeries] = useState({
    views: true,
    enquiries: true,
  });

  const toggleSeries = (key) => {
    setActiveSeries((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-6 font-body">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-heading font-black text-slate-900 tracking-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl self-start sm:self-auto">
          {["7D", "30D", "6M"].map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer ${timeRange === range
                  ? "bg-white text-indigo-600 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
                }`}
            >
              {range === "7D" ? "7 Days" : range === "30D" ? "30 Days" : "6 Months"}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Legend Toggles */}
      <div className="flex items-center gap-3 pt-1 border-t border-slate-100">
        <button
          type="button"
          onClick={() => toggleSeries("views")}
          className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${activeSeries.views
              ? "bg-indigo-50/80 text-indigo-700 border-indigo-200"
              : "bg-slate-50 text-slate-400 border-slate-200 line-through opacity-60"
            }`}
        >
          <span className="w-2.5 h-2.5 bg-indigo-600 rounded-full inline-block" />
          <span>Store Page Views</span>
        </button>

        <button
          type="button"
          onClick={() => toggleSeries("enquiries")}
          className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${activeSeries.enquiries
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-slate-50 text-slate-400 border-slate-200 line-through opacity-60"
            }`}
        >
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block" />
          <span>Lead Enquiries</span>
        </button>
      </div>

      {/* Dynamic Recharts Area Chart */}
      <div className="h-64 sm:h-72 w-full relative pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="indigoGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#4F46E5" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#F1F5F9"
            />

            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94A3B8", fontSize: 11, fontWeight: 700 }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: 700 }}
              tickFormatter={(val) => (val >= 1000 ? `${val / 1000}k` : val)}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Series 1: Store Page Views */}
            {activeSeries.views && (
              <Area
                type="monotone"
                dataKey="views"
                name="Store Page Views"
                stroke="#4F46E5"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#indigoGradient)"
                activeDot={{ r: 6, fill: "#4F46E5", stroke: "#FFFFFF", strokeWidth: 2 }}
              />
            )}

            {/* Series 2: Lead Enquiries */}
            {activeSeries.enquiries && (
              <Area
                type="monotone"
                dataKey="enquiries"
                name="Lead Enquiries"
                stroke="#10B981"
                strokeWidth={2.5}
                strokeDasharray="4 2"
                fillOpacity={1}
                fill="url(#emeraldGradient)"
                activeDot={{ r: 6, fill: "#10B981", stroke: "#FFFFFF", strokeWidth: 2 }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}