import React from "react";
import Link from "next/link";

export default function Breadcrumb({ items = [] }) {
  if (items.length === 0) return null;

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 flex-wrap">
        <li className="inline-flex items-center">
          <Link href="/" className="inline-flex items-center text-xs font-medium text-gray-500 hover:text-gray-700">
            <svg className="w-3.5 h-3.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Home
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index}>
              <div className="flex items-center">
                <svg className="w-3 h-3 text-gray-400 mx-1 md:mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
                {isLast ? (
                  <span className="text-xs font-semibold text-gray-800 truncate max-w-[160px] md:max-w-xs">
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.href} className="text-xs font-medium text-gray-500 hover:text-gray-700 truncate max-w-[120px] md:max-w-xs">
                    {item.label}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
