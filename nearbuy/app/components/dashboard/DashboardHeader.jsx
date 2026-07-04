import React from "react";

export default function DashboardHeader({ title, description, children }) {
  return (
    <div className="border-b border-gray-150 pb-5 sm:flex sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight sm:text-2xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-xs text-gray-500">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="mt-4 sm:mt-0 shrink-0 flex items-center gap-2.5">
          {children}
        </div>
      )}
    </div>
  );
}
