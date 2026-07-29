import React from "react";

export default function StatsCard({
  title,
  value,
  change,
  changeType = "increase",
  icon: Icon,
}) {
  const trendColor = {
    increase: "text-emerald-700 bg-emerald-50 border-emerald-200/80",
    decrease: "text-rose-700 bg-rose-50 border-rose-200/80",
    neutral: "text-slate-700 bg-slate-100 border-slate-200/80",
  };

  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between">
      {/* Subtle Background Glow Effect */}
      <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-linear-to-br from-indigo-50/60 via-indigo-50/20 to-transparent rounded-full blur-xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

      {/* Header Row: Dark Title & Icon */}
      <div className="flex items-center justify-between gap-3 relative z-10">
        <span className="text-xs font-black text-slate-800 uppercase tracking-wider line-clamp-1">
          {title}
        </span>

        {Icon && (
          <div className="h-10 w-10 bg-indigo-50/80 text-indigo-600 rounded-2xl border border-indigo-100 flex items-center justify-center shrink-0 shadow-2xs group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-105 transition-all duration-300">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* Value & Change Indicator Row */}
      <div className="mt-4 flex items-baseline justify-between gap-2 relative z-10">
        <span className="text-2xl sm:text-3xl font-heading font-black text-slate-900 tracking-tight">
          {value}
        </span>

        {change && (
          <span
            className={`text-[10px] font-black px-2.5 py-1 rounded-full border shadow-2xs whitespace-nowrap ${trendColor[changeType] || trendColor.increase
              }`}
          >
            {change}
          </span>
        )}
      </div>
    </div>
  );
}