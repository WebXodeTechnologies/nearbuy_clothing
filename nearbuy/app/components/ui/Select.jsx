import React from "react";

export default function Select({
  label,
  name,
  options = [], // [{ value, label }]
  error = "",
  helperText = "",
  required = false,
  className = "",
  value,
  onChange,
  disabled = false,
  placeholder = "Select an option",
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
        <select
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`
            w-full block rounded-lg text-sm border transition-all duration-200 outline-hidden
            pl-3 pr-8 py-2 appearance-none bg-no-repeat bg-right
            ${disabled ? "bg-gray-50 text-gray-400 border-gray-200" : "bg-white text-gray-900 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"}
            ${error ? "border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500" : ""}
          `}
          style={{
            backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
            backgroundPosition: 'right 0.5rem center',
            backgroundSize: '1.25rem'
          }}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}
      {!error && helperText && <p className="text-xs text-gray-500">{helperText}</p>}
    </div>
  );
}
