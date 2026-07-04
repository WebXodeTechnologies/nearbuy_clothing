import React from "react";

export default function Card({
  children,
  className = "",
  hoverable = false,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white border border-gray-100 rounded-xl shadow-xs overflow-hidden
        ${hoverable ? "hover:shadow-md hover:border-gray-200 transition-all duration-200 cursor-pointer hover:-translate-y-0.5" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "", ...props }) {
  return (
    <div className={`px-5 py-4 border-b border-gray-50 flex items-center justify-between ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = "", ...props }) {
  return (
    <div className={`p-5 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = "", ...props }) {
  return (
    <div className={`px-5 py-4 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between ${className}`} {...props}>
      {children}
    </div>
  );
}
