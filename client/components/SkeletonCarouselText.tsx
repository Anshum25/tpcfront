import React from "react";

export default function SkeletonCarouselText({ className = "", style = {} }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded w-2/3 h-8 mx-auto my-4 ${className}`}
      style={{ minHeight: 32, ...style }}
    />
  );
}
