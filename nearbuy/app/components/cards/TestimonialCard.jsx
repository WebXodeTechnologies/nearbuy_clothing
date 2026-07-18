/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";

export default function TestimonialCard({ testimonial }) {
  const { text, avatar, name, role } = testimonial;

  return (
    <div className="border border-gray-200/80 p-6 rounded-2xl bg-white flex flex-col justify-between hover:shadow-lg hover:border-blue-200 transition-all duration-300">
      <p className="text-xs sm:text-sm text-gray-600 italic leading-relaxed font-body">
        &quot;{text}&quot;
      </p>
      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-3.5">
        <img
          src={avatar}
          alt={name}
          className="h-10 w-10 rounded-full object-cover border border-gray-200 shadow-2xs"
        />
        <div className="flex flex-col">
          <span className="font-heading font-bold text-gray-950 text-xs sm:text-sm">{name}</span>
          <span className="text-[11px] text-blue-600 font-semibold">{role}</span>
        </div>
      </div>
    </div>
  );
}
