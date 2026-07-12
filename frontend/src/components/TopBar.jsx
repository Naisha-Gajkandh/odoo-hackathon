import React from 'react';

const TopBar = ({ searchQuery, setSearchQuery, currentRole }) => {
  return (
    <header className="fixed top-0 right-0 left-20 h-16 bg-surface border-b border-outline-variant flex items-center justify-between px-margin-lg z-40">
      <div className="flex items-center gap-4">
        <h1 className="font-headline-md text-headline-md font-black text-primary text-xl">Trip Dispatch</h1>
        <div className="h-6 w-[1px] bg-outline-variant mx-2"></div>
        <div className="flex items-center gap-2 text-secondary font-label-md text-sm">
          <span className="material-symbols-outlined text-[18px]">hub</span>
          <span>Console v5.4</span>
        </div>
        {currentRole && (
          <div className="ml-2 bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded text-xs font-bold uppercase">
            {currentRole}
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-6">
        <div className="relative focus-within:ring-2 focus-within:ring-primary rounded-lg bg-surface-container-low px-4 py-2 flex items-center gap-2 w-64 border border-outline-variant transition-all">
          <span className="material-symbols-outlined text-secondary text-[20px]">search</span>
          <input 
            className="bg-transparent border-none focus:ring-0 focus:outline-none p-0 text-sm w-full" 
            placeholder="Search trips or IDs..." 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="relative hover:bg-surface-container-low p-2 rounded-full transition-colors text-secondary">
          <span className="material-symbols-outlined text-[24px]">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
        </button>
        <button className="hover:bg-surface-container-low p-2 rounded-full transition-colors text-secondary">
          <span className="material-symbols-outlined text-[24px]">help</span>
        </button>
      </div>
    </header>
  );
};

export default TopBar;
