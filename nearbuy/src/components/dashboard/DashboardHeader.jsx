import React from "react";

export default function DashboardHeader({ title, description, children, badge }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {title}
          </h1>
          {badge && (
            <span className="bg-blue-50 text-blue-700 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border border-blue-100">
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p className="mt-1 text-xs font-medium text-gray-500 max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="shrink-0 flex items-center gap-3">
          {children}
        </div>
      )}
    </div>
  );
}
