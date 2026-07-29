import React from "react";

export default function DashboardHeader({
  title,
  description,
  children,
  badge,
}) {
  return (
    <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden group">
      {/* Subtle Indigo Accent Bar on Left Border */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-linear-to-b from-indigo-600 via-indigo-500 to-teal-400 rounded-l-full" />

      {/* Title & Description Container */}
      <div className="space-y-1.5 pl-2 sm:pl-1">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-heading font-black text-slate-900 tracking-tight">
            {title}
          </h1>

          {badge && (
            <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-indigo-100/80 shadow-2xs backdrop-blur-md">
              {badge}
            </span>
          )}
        </div>

        {description && (
          <p className="text-xs sm:text-xs font-medium text-slate-500 max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Children Action Buttons / Filters */}
      {children && (
        <div className="shrink-0 flex flex-wrap items-center gap-3 pt-2 md:pt-0 pl-2 sm:pl-0 border-t md:border-t-0 border-slate-100">
          {children}
        </div>
      )}
    </div>
  );
}