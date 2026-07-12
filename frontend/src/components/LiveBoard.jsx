import React, { useState } from 'react';
import TripCard from './TripCard';

const LiveBoard = ({ trips, selectedTrip, onSelectTrip, searchQuery }) => {
  const [filter, setFilter] = useState('ALL');

  // Filter logic based on tab selected (ALL, ACTIVE, DRAFTS)
  // ACTIVE matches "Dispatched" and "In-Transit"
  // DRAFTS matches "Draft"
  const filteredTrips = trips.filter(trip => {
    // 1. Filter by Status
    if (filter === 'ACTIVE') {
      if (trip.status !== 'Dispatched' && trip.status !== 'In-Transit') {
        return false;
      }
    } else if (filter === 'DRAFTS') {
      if (trip.status !== 'Draft') {
        return false;
      }
    }

    // 2. Filter by Search Query (ID, Source, Destination)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const codeMatch = trip.trip_code?.toLowerCase().includes(q);
      const sourceMatch = trip.source?.toLowerCase().includes(q);
      const destMatch = trip.destination?.toLowerCase().includes(q);
      return codeMatch || sourceMatch || destMatch;
    }

    return true;
  });

  const getTabClasses = (tabName) => {
    const base = "text-[11px] px-3.5 py-1.5 rounded-2xl font-bold transition-all duration-200 focus:outline-none active:scale-95";
    if (filter === tabName) {
      return `${base} bg-primary text-on-primary shadow-sm`;
    }
    return `${base} bg-secondary-container text-secondary hover:bg-secondary-container/80 hover:text-primary`;
  };

  return (
    <section className="w-[320px] lg:w-[380px] flex-shrink-0 bg-white border-r border-border flex flex-col h-full">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-headline-md text-headline-md text-primary text-[18px] font-black">Live Board</h2>
          <span className="bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
            Real-Time
          </span>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setFilter('ALL')}
            className={getTabClasses('ALL')}
          >
            ALL
          </button>
          <button 
            onClick={() => setFilter('ACTIVE')}
            className={getTabClasses('ACTIVE')}
          >
            ACTIVE
          </button>
          <button 
            onClick={() => setFilter('DRAFTS')}
            className={getTabClasses('DRAFTS')}
          >
            DRAFTS
          </button>
        </div>
      </div>
      
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-4 space-y-4 bg-background">
        {filteredTrips.length > 0 ? (
          filteredTrips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              isSelected={selectedTrip?.id === trip.id}
              onClick={() => onSelectTrip(trip)}
            />
          ))
        ) : (
          <div className="p-8 text-center text-secondary text-xs italic bg-white border border-border rounded-2xl shadow-sm mt-4">
            No matching trips found.
          </div>
        )}
      </div>
    </section>
  );
};

export default LiveBoard;
