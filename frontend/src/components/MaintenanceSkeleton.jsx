import React from 'react';

const MaintenanceSkeleton = () => {
  return (
    <div className="flex-1 flex overflow-hidden bg-background animate-pulse">
      {/* Left panel skeleton */}
      <div className="w-[320px] lg:w-[380px] flex-shrink-0 bg-white border-r border-border flex flex-col h-full">
        <div className="p-6 border-b border-border space-y-4">
          <div className="h-6 bg-secondary-container rounded-lg w-2/3"></div>
          <div className="h-10 bg-secondary-container rounded-xl w-full"></div>
        </div>
        <div className="flex-1 p-4 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-border/40 space-y-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1.5 w-1/2">
                  <div className="h-3 bg-secondary-container rounded w-1/2"></div>
                  <div className="h-4 bg-secondary-container rounded w-3/4"></div>
                </div>
                <div className="h-5 bg-secondary-container rounded-full w-16"></div>
              </div>
              <div className="space-y-1.5">
                <div className="h-4 bg-secondary-container rounded w-5/6"></div>
                <div className="h-3 bg-secondary-container rounded w-1/2"></div>
              </div>
              <div className="h-3 bg-secondary-container rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel skeleton */}
      <div className="flex-1 min-h-0 bg-background flex flex-col overflow-y-auto p-8 space-y-8">
        <div className="flex justify-between items-start">
          <div className="space-y-2 w-1/2">
            <div className="flex items-center gap-3">
              <div className="h-8 bg-secondary-container rounded-lg w-40"></div>
              <div className="h-6 bg-secondary-container rounded-full w-20"></div>
            </div>
            <div className="h-4 bg-secondary-container rounded w-3/4"></div>
          </div>
          <div className="flex gap-3">
            <div className="h-10 bg-secondary-container rounded-2xl w-32"></div>
            <div className="h-10 bg-secondary-container rounded-2xl w-32"></div>
          </div>
        </div>

        <div className="h-8 border-b border-border flex gap-8">
          <div className="h-6 bg-secondary-container rounded w-16"></div>
          <div className="h-6 bg-secondary-container rounded w-24"></div>
          <div className="h-6 bg-secondary-container rounded w-24"></div>
        </div>

        {/* Canvas widgets */}
        <div className="bg-white rounded-3xl p-6 border border-border/40 h-48">
          <div className="h-full bg-secondary-container/40 rounded-2xl"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-border/40 h-40">
            <div className="h-full bg-secondary-container/40 rounded-2xl"></div>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-border/40 h-40">
            <div className="h-full bg-secondary-container/40 rounded-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceSkeleton;
