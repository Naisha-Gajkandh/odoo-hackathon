import React, { useState } from 'react';
import EmptyState from './EmptyState';

const CostChart = ({ data, searchQuery, onViewAll }) => {
  const [sortBy, setSortBy] = useState('cost_desc'); // cost_desc, cost_asc, name_asc, name_desc

  // 1. Filter by Search Query
  const filteredData = data.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.id.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  // 2. Sort Data
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortBy === 'cost_desc') return b.cost - a.cost;
    if (sortBy === 'cost_asc') return a.cost - b.cost;
    if (sortBy === 'name_asc') return a.id.localeCompare(b.id);
    if (sortBy === 'name_desc') return b.id.localeCompare(a.id);
    return 0;
  });

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl border border-border soft-shadow flex flex-col gap-6 select-none h-full">
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-start">
          <h3 className="font-headline-md text-headline-md text-primary font-black">Cost Breakdown</h3>

          {/* Sorting Dropdown */}
          <div className="relative inline-block text-left">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="font-headline-md bg-secondary-container hover:bg-secondary-container/85 border-none text-on-secondary-container font-bold text-[11px] rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-0 cursor-pointer"
            >
              <option value="cost_desc">Cost (High → Low)</option>
              <option value="cost_asc">Cost (Low → High)</option>
              <option value="name_asc">Vehicle ID (A → Z)</option>
              <option value="name_desc">Vehicle ID (Z → A)</option>
            </select>
          </div>
        </div>
        <p className="font-headline-md text-[12px] text-secondary font-bold">Top cost-intensive vehicles this period</p>
      </div>

      {sortedData.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <EmptyState 
            title="No Cost Data Found" 
            message="No vehicles matching your query are recorded in our cost records." 
          />
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-between">
          <div className="flex flex-col gap-5">
            {sortedData.slice(0, 5).map((item) => {
              // Determine progress bar color based on amount
              let barColor = 'bg-error';
              if (item.cost < 5000) {
                barColor = 'bg-secondary-container';
              } else if (item.cost < 8000) {
                barColor = 'bg-warning-orange';
              }
              
              return (
                <div key={item.id} className="flex flex-col gap-2 group hover:scale-[1.01] transition-transform duration-200">
                  <div className="font-headline-md flex justify-between font-bold text-[12px] text-primary">
                    <span className="flex items-center gap-2 text-secondary group-hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                      {item.id}
                      <span className="font-headline-md text-[10px] bg-secondary-container text-on-secondary-container px-1.5 py-0.5 rounded font-bold uppercase">
                        {item.category}
                      </span>
                    </span>
                    <span className={item.cost >= 8000 ? "text-error" : item.cost >= 5000 ? "text-on-warning-orange" : "text-primary"}>
                      ${item.cost.toLocaleString()}
                    </span>
                  </div>
                  
                  {/* Progress Bar Container */}
                  <div className="h-2 w-full bg-secondary-container rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${barColor} rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-border flex justify-center">
            <button
              onClick={onViewAll}
              className="font-headline-md text-transit-blue hover:text-transit-blue/80 font-bold text-[12px] flex items-center gap-1.5 focus:outline-none hover:underline"
            >
              <span>View All Fleet Costs</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CostChart;
