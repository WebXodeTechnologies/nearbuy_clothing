import React from "react";

export default function Alert({
  children,
  className = "",
  variant = "info", // info, success, warning, danger
  title,
  onClose,
  ...props
}) {
  const styles = {
    info: {
      bg: "bg-blue-50 border-blue-200",
      text: "text-blue-800",
      titleText: "text-blue-900",
      iconColor: "text-blue-500",
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      )
    },
    success: {
      bg: "bg-emerald-50 border-emerald-200",
      text: "text-emerald-800",
      titleText: "text-emerald-900",
      iconColor: "text-emerald-500",
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )
    },
    warning: {
      bg: "bg-yellow-50 border-yellow-200",
      text: "text-yellow-800",
      titleText: "text-yellow-900",
      iconColor: "text-yellow-500",
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      )
    },
    danger: {
      bg: "bg-red-50 border-red-200",
      text: "text-red-800",
      titleText: "text-red-900",
      iconColor: "text-red-500",
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      )
    }
  };

  const current = styles[variant] || styles.info;

  return (
    <div
      className={`p-4 border rounded-xl flex items-start space-x-3 shadow-xs ${current.bg} ${className}`}
      {...props}
    >
      <div className={`shrink-0 ${current.iconColor}`}>{current.icon}</div>
      <div className="flex-1 text-sm">
        {title && <h5 className={`font-semibold mb-1 ${current.titleText}`}>{title}</h5>}
        <div className={current.text}>{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`shrink-0 rounded-lg p-1 cursor-pointer hover:bg-black/5 transition-colors ${current.iconColor}`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
