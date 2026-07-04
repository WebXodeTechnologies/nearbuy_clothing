import React from "react";

export default function Button({
  children,
  className = "",
  variant = "primary", // primary, secondary, outline, ghost, danger, success
  size = "md", // sm, md, lg
  isLoading = false,
  disabled = false,
  icon: Icon,
  iconPosition = "left",
  type = "button",
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm focus:ring-blue-500 border border-transparent",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-300 border border-transparent",
    outline: "bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 hover:text-gray-900 focus:ring-blue-500",
    ghost: "text-gray-600 hover:bg-gray-50 hover:text-gray-900 focus:ring-gray-300",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-sm focus:ring-red-500 border border-transparent",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm focus:ring-emerald-500 border border-transparent",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!isLoading && Icon && iconPosition === "left" && (
        <span className="mr-2 inline-flex"><Icon className="w-4 h-4" /></span>
      )}
      {children}
      {!isLoading && Icon && iconPosition === "right" && (
        <span className="ml-2 inline-flex"><Icon className="w-4 h-4" /></span>
      )}
    </button>
  );
}
