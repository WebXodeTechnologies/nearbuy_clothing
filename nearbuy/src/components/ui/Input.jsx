"use client";

import React from "react";

export default function Input({
  label,
  name,
  type = "text",
  placeholder = "",
  error = "",
  helperText = "",
  required = false,
  className = "",
  value,
  onChange,
  disabled = false,
  icon: Icon,
  ...props
}) {
  return (
    <div className={`flex flex-col space-y-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={name} className="text-xs font-semibold text-gray-700 select-none">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative rounded-lg shadow-xs">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          className={`
            w-full block rounded-lg text-sm border transition-all duration-200 outline-hidden
            ${Icon ? "pl-9" : "pl-3"} pr-3 py-2
            ${disabled ? "bg-gray-50 text-gray-400 border-gray-200" : "bg-white text-gray-900 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"}
            ${error ? "border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500" : ""}
          `}
          {...props}
        />
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}
      {!error && helperText && <p className="text-xs text-gray-500">{helperText}</p>}
    </div>
  );
}
