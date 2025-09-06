import React, { useEffect, useState } from "react";
import SkeletonCarouselText from "./SkeletonCarouselText";

interface TimedCarouselTextProps {
  title: string;
  subtitle: string;
}

export default function TimedCarouselText({ title, subtitle }: TimedCarouselTextProps) {
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const skeletonTimeout = setTimeout(() => {
      setShowSkeleton(false);
    }, 1200); // Show skeleton for 1.2s
    return () => clearTimeout(skeletonTimeout);
  }, []);

  if (showSkeleton) {
    return <SkeletonCarouselText />;
  }
  return (
    <>
      <h1 className="text-4xl lg:text-7xl font-bold leading-tight">
        {title}
      </h1>
      <p className="text-lg lg:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
        {subtitle}
      </p>
    </>
  );
}
