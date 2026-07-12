import React, { useState } from 'react';
import toast from 'react-hot-toast';

const MapPanel = ({ selectedTrip }) => {
  const [isCentering, setIsCentering] = useState(false);
  
  const sourceName = selectedTrip ? selectedTrip.source : 'Jersey City';
  const distance = selectedTrip ? parseFloat(selectedTrip.planned_distance_km) : 45;
  const etaText = selectedTrip?.eta || (selectedTrip?.status === 'Draft' ? '--:--' : '14:30');
  const speedText = selectedTrip?.status === 'Draft' || selectedTrip?.status === 'Completed' || selectedTrip?.status === 'Cancelled' ? '0 mph' : '60 mph';

  const handleCenterMap = () => {
    setIsCentering(true);
    toast.success('Re-centering map to active terminal coordinates...', {
      id: 'map-recenter',
      icon: '🎯'
    });
    setTimeout(() => {
      setIsCentering(false);
    }, 800);
  };

  return (
    <div className="relative border-r border-border min-h-[400px] overflow-hidden group h-full bg-white shadow-sm hover:shadow-md transition-all duration-300">
      
      {/* Monochromatic background map simulation */}
      <div 
        className={`absolute inset-0 bg-surface-container bg-cover bg-center transition-all duration-[2000ms] ${
          isCentering ? 'scale-110 opacity-70 blur-[1px]' : 'group-hover:scale-105'
        }`} 
        style={{ 
          backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD3t67G_mGpwx38fRxqqxbgFsJTiVhRbO6guTv5SH6vYf-vkH143p8_tVtjQeNovIoYdHnT9Pf1vRW7nZrHntow4lclKaCdQ8PBUSaIgsOerYJdogpyqKOi9xucSnCn_q4BAnmlOR4DffDisX7AOCUh7h1_wjkqxw0OKums6E2I6tHv792Y3hgicGIrC9KaV9ElBwaS2N-tigSe8QkcLwzyxIF6cGcC9jCBBlFnta-jZFyhe0_Czm0M')" 
        }}
      ></div>
      
      {/* Route Layer Overlay (Simulation) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
        <path 
          d="M 50 350 L 150 200 L 250 250 L 350 50" 
          fill="none" 
          opacity="0.6" 
          stroke="black" 
          strokeDasharray="8 4" 
          strokeWidth="3"
          className={isCentering ? 'stroke-transit-blue' : 'stroke-black'}
        ></path>
        <circle cx="150" cy="200" fill={isCentering ? '#2563EB' : '#111111'} r="6" className="transition-colors duration-300"></circle>
      </svg>
      
      {/* Floating Chips */}
      <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none">
        
        {/* Top Chips */}
        <div className="flex flex-wrap gap-2 pointer-events-auto">
          <div className="bg-white/95 backdrop-blur-sm border border-border px-3.5 py-2.5 rounded-2xl flex items-center gap-2 shadow-md transition-all duration-200 hover:scale-102">
            <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
            <span className="text-xs font-bold text-primary truncate max-w-[150px]">{sourceName} Terminal</span>
          </div>
          <div className="bg-white/95 backdrop-blur-sm border border-border px-3.5 py-2.5 rounded-2xl flex items-center gap-2 shadow-md transition-all duration-200 hover:scale-102">
            <span className="material-symbols-outlined text-primary text-[18px]">speed</span>
            <span className="text-xs font-bold text-primary">{speedText}</span>
          </div>
        </div>
        
        {/* Bottom Chips */}
        <div className="flex justify-between items-end">
          <div className="bg-white/95 backdrop-blur-sm border border-border p-4 rounded-2xl shadow-lg pointer-events-auto flex items-center gap-4 transition-all duration-200 hover:scale-102">
            <div className="text-center border-r border-border pr-4">
              <p className="text-[10px] text-secondary uppercase font-bold tracking-wider">KM Left</p>
              <p className="text-xl font-black text-primary mt-0.5">{distance}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-secondary uppercase font-bold tracking-wider">ETA</p>
              <p className="text-xl font-black text-primary mt-0.5">{etaText}</p>
            </div>
          </div>
          
          <button 
            onClick={handleCenterMap}
            className={`pointer-events-auto w-12 h-12 bg-white rounded-full flex items-center justify-center border border-border shadow-lg hover:bg-secondary-container active:scale-95 transition-all duration-200 focus:outline-none ${
              isCentering ? 'animate-spin border-transit-blue' : ''
            }`} 
            title="Center Map"
          >
            <span className={`material-symbols-outlined text-[24px] ${isCentering ? 'text-transit-blue' : 'text-primary'}`}>
              {isCentering ? 'sync' : 'center_focus_strong'}
            </span>
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default MapPanel;
