import React from 'react';

const LocationCard = ({ location }) => {
  if (!location) return null;

  return (
    <div className="bg-white rounded-2xl p-2 border border-border shadow-sm flex flex-col h-full min-h-[300px]">
      <div className="p-4">
        <h3 className="font-bold text-sm text-primary mb-1">Current Location</h3>
        <p className="text-[10px] text-secondary uppercase font-bold tracking-wider">
          {location.description}
        </p>
      </div>
      
      <div className="flex-1 rounded-xl overflow-hidden relative group min-h-[200px] border border-border bg-surface-container">
        {/* Background Map Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url('${location.mapUrl}')` }}
        />
        
        {/* Floating Overlay for Modern Aesthetics */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        
        {/* Floating Telemetry Card */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white/90 backdrop-blur-md p-3.5 rounded-xl shadow-md border border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-transit-blue text-[20px] font-bold">speed</span>
              <span className="text-xs font-black text-primary">{location.speed}</span>
            </div>
            
            <div className="h-6 w-px bg-border/80" />
            
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-warning-orange text-[20px] font-bold">thermostat</span>
              <span className="text-xs font-black text-primary">{location.temp}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationCard;
