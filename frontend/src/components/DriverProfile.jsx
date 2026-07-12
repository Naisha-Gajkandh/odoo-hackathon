import React from 'react';
import StatusBadge from './StatusBadge';

const DriverProfile = ({ 
  driver, 
  activeTab, 
  setActiveTab 
}) => {
  if (!driver) return null;

  const isSuspended = driver.status?.toLowerCase() === 'suspended';

  // Dynamic safety score ring style
  const safetyRingStyle = {
    background: `conic-gradient(from 0deg, var(--color-transit-blue, #2563EB) 0% ${driver.safetyScore}%, var(--color-surface-container-high, #E5E7EB) ${driver.safetyScore}% 100%)`
  };

  return (
    <div className="bg-white rounded-2xl p-8 border border-border shadow-sm mb-8 relative overflow-hidden">
      {/* Top Right Actions */}
      <div className="absolute top-0 right-0 p-6 flex items-center gap-3">
        <button 
          onClick={() => alert(`Opening chat with ${driver.name}`)}
          className="bg-secondary-container text-on-secondary-container hover:text-transit-blue p-3 rounded-full hover:bg-transit-blue-container transition-all focus:outline-none"
          title="Message Driver"
        >
          <span className="material-symbols-outlined text-[20px] font-bold">chat</span>
        </button>
        <button 
          onClick={() => alert(`Calling ${driver.name} at ${driver.contactInfo?.phone}`)}
          className="bg-transit-blue text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-on-transit-blue active:scale-95 transition-all shadow-sm focus:outline-none"
          title="Call Driver"
        >
          <span className="material-symbols-outlined text-[18px] font-bold">call</span>
          <span>Call Driver</span>
        </button>
      </div>
      
      {/* Main Profile Info */}
      <div className="flex flex-col md:flex-row items-start gap-10">
        {/* Avatar & Conical Safety Ring */}
        <div className="relative flex-shrink-0">
          <div className="w-40 h-40 rounded-3xl overflow-hidden border border-border shadow-md relative z-10 bg-secondary-container">
            <img 
              className={`w-full h-full object-cover ${isSuspended ? 'grayscale' : ''}`}
              alt={driver.name}
              src={driver.avatarUrl}
            />
          </div>
          
          {/* Safety Score Conical Ring */}
          {!isSuspended && (
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white rounded-full p-1.5 shadow-lg z-20">
              <div 
                className="w-full h-full rounded-full flex flex-col items-center justify-center relative transition-all duration-1000"
                style={safetyRingStyle}
              >
                <div className="absolute inset-2 bg-white rounded-full flex flex-col items-center justify-center">
                  <span className="font-bold text-headline-md text-transit-blue leading-none">{driver.safetyScore}</span>
                  <span className="text-[8px] font-black text-secondary uppercase tracking-wider">Safety</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Details and Specs */}
        <div className="mt-2 flex-grow min-w-0">
          <div className="flex flex-wrap items-center gap-3.5 mb-2">
            <h2 className="font-headline-md text-headline-md text-primary text-2xl font-black">{driver.name}</h2>
            <StatusBadge status={driver.routeStatus || driver.status} />
          </div>
          
          <p className="text-secondary font-semibold text-xs mb-6">
            {driver.role} • <span className="font-bold text-primary">{driver.experience}</span>
          </p>
          
          {/* Specs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            <div className="min-w-0">
              <p className="text-[9px] text-secondary uppercase font-bold tracking-widest mb-1.5">Current Vehicle</p>
              <div className="flex items-center gap-2 text-primary font-bold text-xs truncate">
                <span className="material-symbols-outlined text-transit-blue text-[18px] flex-shrink-0">local_shipping</span>
                <span className="truncate">{driver.currentVehicle}</span>
              </div>
            </div>
            
            <div className="min-w-0">
              <p className="text-[9px] text-secondary uppercase font-bold tracking-widest mb-1.5">Last Inspection</p>
              <div className="flex items-center gap-2 text-primary font-bold text-xs truncate">
                <span className="material-symbols-outlined text-secondary text-[18px] flex-shrink-0">fact_check</span>
                <span className="truncate">{driver.lastInspection}</span>
              </div>
            </div>
            
            <div className="min-w-0">
              <p className="text-[9px] text-secondary uppercase font-bold tracking-widest mb-1.5">Emergency Contact</p>
              <div className="flex items-center gap-2 text-primary font-bold text-xs truncate">
                <span className="material-symbols-outlined text-secondary text-[18px] flex-shrink-0">contact_phone</span>
                <span className="truncate">{driver.emergencyContact}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex items-center gap-6 mt-12 border-b border-border">
        {['License & Docs', 'Trip History', 'Safety Analytics', 'Contact Info'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 font-bold text-xs tracking-wider uppercase transition-all duration-200 focus:outline-none ${
              activeTab === tab 
                ? 'border-b-2 border-transit-blue text-transit-blue' 
                : 'text-secondary hover:text-primary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DriverProfile;
