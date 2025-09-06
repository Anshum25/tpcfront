import React, { useEffect, useState } from "react";
import SkeletonCarouselText from "./SkeletonCarouselText";
import { Badge } from "@/components/ui/badge";

interface TimedCarouselTextProps {
  badge: string;
  title: string;
}

export default function TimedCarouselText({ badge, title }: TimedCarouselTextProps) {
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
      <Badge variant="outline" className="border-primary text-primary">
        {badge}
      </Badge>
      <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold leading-tight mb-4">
        {title}
      </h2>
    </>
  );
}
