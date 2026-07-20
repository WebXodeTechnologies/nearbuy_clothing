"use client";

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
        bg-white border border-gray-200/80 rounded-2xl shadow-xs overflow-hidden transition-all duration-300
        ${hoverable ? "hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 cursor-pointer" : ""}
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
    <div className={`px-6 py-4 border-b border-gray-100 flex items-center justify-between font-heading ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = "", ...props }) {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = "", ...props }) {
  return (
    <div className={`px-6 py-4 bg-gray-50/60 border-t border-gray-100 flex items-center justify-between ${className}`} {...props}>
      {children}
    </div>
  );
}
