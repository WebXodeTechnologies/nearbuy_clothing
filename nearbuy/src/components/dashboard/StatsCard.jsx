import React from "react";

export default function StatsCard({ title, value, change, changeType = "increase", icon: Icon }) {
  const trendColor = {
    increase: "text-emerald-700 bg-emerald-50 border-emerald-200/60",
    decrease: "text-rose-700 bg-rose-50 border-rose-200/60",
    neutral: "text-slate-700 bg-slate-100 border-slate-200/60",
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden group">
      {/* Decorative subtle background gradient blob */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-linear-to-br from-blue-50/40 via-purple-50/20 to-transparent rounded-full blur-xl group-hover:scale-125 transition-transform duration-300 pointer-events-none" />

      <div className="flex items-center justify-between relative z-10">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className="h-10 w-10 bg-linear-to-br from-blue-50 to-indigo-50/80 rounded-xl text-blue-600 border border-blue-100/80 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all duration-200">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between relative z-10">
        <span className="text-2xl font-black text-gray-900 tracking-tight">
          {value}
        </span>
        {change && (
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-2xs ${trendColor[changeType]}`}>
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
