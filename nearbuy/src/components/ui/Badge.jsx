import React from "react";

export default function Badge({
  children,
  className = "",
  variant = "gray", // blue, gray, green, red, yellow, emerald, indigo
  pill = false,
  ...props
}) {
  const baseStyles = "inline-flex items-center font-medium text-xs px-2 py-0.5 select-none transition-colors duration-150";
  const roundedStyle = pill ? "rounded-full" : "rounded";

  const variants = {
    blue: "bg-blue-50 text-blue-700 border border-blue-100",
    gray: "bg-gray-100 text-gray-700 border border-gray-200",
    green: "bg-green-50 text-green-700 border border-green-100",
    emerald: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    red: "bg-red-50 text-red-700 border border-red-100",
    yellow: "bg-yellow-50 text-yellow-800 border border-yellow-100",
    indigo: "bg-indigo-50 text-indigo-700 border border-indigo-100",
  };

  return (
    <span
      className={`${baseStyles} ${roundedStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
