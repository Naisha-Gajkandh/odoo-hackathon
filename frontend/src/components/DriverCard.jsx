import React from 'react';
import StatusBadge from './StatusBadge';

const DriverCard = ({ driver, isSelected, onClick }) => {
  const isSuspended = driver.status?.toLowerCase() === 'suspended';
  
  // Visual border classes
  let borderClass = 'border border-border hover:border-transit-blue hover:scale-[1.02] shadow-sm';
  if (isSelected) {
    borderClass = 'border-2 border-transit-blue shadow-md scale-[1.02]';
  } else if (isSuspended) {
    borderClass = 'border border-error hover:bg-error-container/5 hover:scale-[1.02] shadow-sm';
  }

  return (
    <div
      onClick={onClick}
      className={`bg-white p-4 rounded-2xl cursor-pointer transition-all duration-200 active:scale-[0.98] ${borderClass}`}
    >
      <div className="flex gap-4">
        {/* Avatar */}
        <div className={`w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ${isSuspended ? 'grayscale' : ''}`}>
          <img 
            className="w-full h-full object-cover animate-fade-in"
            alt={driver.name}
            src={driver.avatarUrl}
          />
        </div>
        
        {/* Details */}
        <div className="flex-grow min-w-0">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-sm text-primary truncate">{driver.name}</h3>
            <StatusBadge status={driver.routeStatus || driver.status} />
          </div>
          
          <p className="text-[10px] text-secondary mt-1 font-semibold">
            ID: {driver.id} • {driver.licenseDetails?.classType?.split(' ')[1] || 'Heavy Duty'}
          </p>
          
          <div className="mt-3 flex items-center justify-between gap-2">
            {isSuspended ? (
              <div className="flex items-center gap-1 text-error font-bold">
                <span className="material-symbols-outlined text-[14px]">warning</span>
                <span className="text-[11px]">Expired: {driver.licenseExpiration}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-secondary">
                <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                <span className="text-[11px]">Exp: {driver.licenseExpiration}</span>
              </div>
            )}
            
            {!isSuspended && (
              <div className="flex items-center gap-1 text-transit-blue font-bold">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                <span className="text-[11px]">{driver.safetyScore}% Safety</span>
              </div>
            )}
            
            {isSuspended && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  alert(`Renew flow for ${driver.name} initiated.`);
                }} 
                className="text-transit-blue hover:text-on-transit-blue text-[11px] font-bold hover:underline focus:outline-none"
              >
                Renew
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverCard;
