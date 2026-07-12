import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="flex-1 flex flex-col gap-8 w-full animate-pulse select-none">
      {/* Header Skeleton */}
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-surface-container-high rounded-lg"></div>
          <div className="h-4 w-72 bg-surface-container-high rounded-md"></div>
        </div>
        <div className="h-10 w-32 bg-surface-container-high rounded-xl"></div>
      </div>

      {/* KPI Bento Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-surface p-6 rounded-xl border border-border/50 flex flex-col gap-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="h-12 w-12 bg-surface-container-high rounded-xl"></div>
              <div className="h-6 w-14 bg-surface-container-high rounded-full"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-28 bg-surface-container-high rounded"></div>
              <div className="h-8 w-20 bg-surface-container-high rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Row Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Growth Line Chart Skeleton */}
        <div className="lg:col-span-2 bg-surface p-8 rounded-xl border border-border/50 flex flex-col gap-6 shadow-sm">
          <div className="flex justify-between items-center">
            <div className="h-6 w-48 bg-surface-container-high rounded-lg"></div>
            <div className="h-8 w-32 bg-surface-container-high rounded-full"></div>
          </div>
          <div className="h-[280px] bg-surface-container rounded-xl flex items-end p-4">
            <div className="w-full h-full bg-gradient-to-t from-surface-container-high/20 to-transparent rounded-lg"></div>
          </div>
        </div>

        {/* Cost Breakdown Bar Chart Skeleton */}
        <div className="bg-surface p-8 rounded-xl border border-border/50 flex flex-col gap-6 shadow-sm">
          <div className="space-y-1">
            <div className="h-6 w-36 bg-surface-container-high rounded-lg"></div>
            <div className="h-4 w-48 bg-surface-container-high rounded-md"></div>
          </div>
          <div className="flex flex-col gap-5 mt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-4 w-20 bg-surface-container-high rounded"></div>
                  <div className="h-4 w-12 bg-surface-container-high rounded"></div>
                </div>
                <div className="h-2.5 bg-surface-container-high rounded-full w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lower Section Skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-surface rounded-xl border border-border/50 h-[400px] flex items-center justify-center">
          <div className="w-full h-full bg-surface-container rounded-xl"></div>
        </div>
        <div className="bg-surface p-8 rounded-xl border border-border/50 flex flex-col gap-6 h-[400px]">
          <div className="h-6 w-48 bg-surface-container-high rounded-lg"></div>
          <div className="flex-1 flex flex-col justify-around gap-6 py-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-8">
                <div className="w-48 h-24 bg-surface-container rounded-xl"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-5 w-40 bg-surface-container-high rounded"></div>
                  <div className="h-4 w-full bg-surface-container-high rounded"></div>
                  <div className="h-6 w-16 bg-surface-container-high rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
