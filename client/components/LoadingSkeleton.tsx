import React from "react";

interface LoadingSkeletonProps {
  type: 'team' | 'city';
  count?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type, count = 6 }) => {
  if (type === 'team') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="flex flex-row items-center p-2 md:p-4 rounded-xl w-full h-[120px] md:w-[280px] md:h-[120px] mx-auto min-h-[100px] min-w-[140px] gap-3 bg-gray-100 animate-pulse"
          >
            {/* Avatar skeleton */}
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gray-300"></div>
            
            {/* Info skeleton */}
            <div className="flex flex-col justify-center h-full pl-3 md:pl-4 text-left flex-1">
              <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
              <div className="h-3 bg-gray-300 rounded mb-1 w-1/2"></div>
              <div className="h-3 bg-gray-300 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'city') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-lg bg-white shadow animate-pulse"
          >
            {/* Image skeleton */}
            <div className="h-48 bg-gray-300"></div>
            
            {/* Content skeleton */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-center">
                  <div className="h-8 w-12 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 w-20 bg-gray-300 rounded"></div>
                </div>
                <div className="w-px h-12 bg-gray-200"></div>
                <div className="text-center">
                  <div className="h-4 w-16 bg-gray-300 rounded mb-1"></div>
                  <div className="h-3 w-24 bg-gray-300 rounded"></div>
                </div>
              </div>
              
              <div className="h-10 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default LoadingSkeleton;