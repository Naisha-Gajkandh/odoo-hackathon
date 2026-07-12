import React from 'react';
import DriverCard from './DriverCard';

const DriverSidebar = ({ 
  drivers, 
  selectedDriver, 
  onSelectDriver, 
  filter, 
  setFilter, 
  loading 
}) => {
  const countAll = drivers.length;
  const countOnDuty = drivers.filter(d => d.status === 'On Duty').length;
  const countOffDuty = drivers.filter(d => d.status === 'Off Duty').length;
  const countSuspended = drivers.filter(d => d.status === 'Suspended').length;

  return (
    <section className="w-[320px] lg:w-[380px] flex-shrink-0 bg-white border-r border-border flex flex-col h-full">
      {/* Sidebar Header: Title & Counts */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-headline-md text-headline-md text-primary text-[18px] font-black">Active Fleet</h2>
          <span className="bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
            {countAll} Total Drivers
          </span>
        </div>
        
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setFilter('ALL')}
            className={`text-[11px] px-3.5 py-1.5 rounded-2xl font-bold transition-all duration-200 focus:outline-none active:scale-95 ${
              filter === 'ALL' ? 'bg-primary text-on-primary shadow-sm' : 'bg-secondary-container text-secondary hover:bg-secondary-container/80'
            }`}
          >
            All {countAll}
          </button>
          
          <button 
            onClick={() => setFilter('ON_DUTY')}
            className={`text-[11px] px-3.5 py-1.5 rounded-2xl font-bold transition-all duration-200 focus:outline-none active:scale-95 ${
              filter === 'ON_DUTY' ? 'bg-transit-blue text-white shadow-sm' : 'bg-secondary-container text-secondary hover:bg-secondary-container/80'
            }`}
          >
            On Duty {countOnDuty}
          </button>
          
          <button 
            onClick={() => setFilter('OFF_DUTY')}
            className={`text-[11px] px-3.5 py-1.5 rounded-2xl font-bold transition-all duration-200 focus:outline-none active:scale-95 ${
              filter === 'OFF_DUTY' ? 'bg-secondary text-white shadow-sm' : 'bg-secondary-container text-secondary hover:bg-secondary-container/80'
            }`}
          >
            Off Duty {countOffDuty}
          </button>

          <button 
            onClick={() => setFilter('SUSPENDED')}
            className={`text-[11px] px-3.5 py-1.5 rounded-2xl font-bold transition-all duration-200 focus:outline-none active:scale-95 ${
              filter === 'SUSPENDED' ? 'bg-error text-white shadow-sm' : 'bg-secondary-container text-secondary hover:bg-secondary-container/80'
            }`}
          >
            Suspended {countSuspended}
          </button>
        </div>
      </div>

      {/* Driver Cards List */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-4 space-y-4 bg-background">
        {loading ? (
          // Loading skeletons
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white p-4 rounded-2xl border border-border shadow-sm animate-pulse flex gap-4">
                <div className="w-12 h-12 bg-secondary-container rounded-full flex-shrink-0"></div>
                <div className="flex-grow space-y-2.5">
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-secondary-container rounded w-1/2"></div>
                    <div className="h-4 bg-secondary-container rounded w-1/4"></div>
                  </div>
                  <div className="h-3 bg-secondary-container rounded w-3/4"></div>
                  <div className="flex justify-between mt-3">
                    <div className="h-3 bg-secondary-container rounded w-1/3"></div>
                    <div className="h-3 bg-secondary-container rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : drivers.length > 0 ? (
          drivers.map((d) => (
            <DriverCard
              key={d.id}
              driver={d}
              isSelected={selectedDriver?.id === d.id}
              onClick={() => onSelectDriver(d)}
            />
          ))
        ) : (
          // Empty State
          <div className="p-8 text-center text-secondary text-xs italic bg-white border border-border rounded-2xl shadow-sm mt-4">
            No matching drivers found.
          </div>
        )}
      </div>
    </section>
  );
};

export default DriverSidebar;
