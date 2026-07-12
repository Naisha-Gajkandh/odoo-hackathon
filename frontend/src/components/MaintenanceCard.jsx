import React from 'react';

const MaintenanceCard = ({ log, isSelected, onClick }) => {
  const getStatusBadge = (status) => {
    if (status?.toUpperCase() === 'IN SHOP') {
      return (
        <span className="px-2 py-0.5 bg-warning-orange-container text-on-warning-orange text-[10px] font-bold rounded-full uppercase tracking-wide">
          IN SHOP
        </span>
      );
    }
    if (status?.toUpperCase() === 'SCHEDULED') {
      return (
        <span className="px-2 py-0.5 bg-surface-container-highest text-on-surface-variant text-[10px] font-bold rounded-full uppercase tracking-wide">
          SCHEDULED
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 bg-success-green-container text-on-success-green text-[10px] font-bold rounded-full uppercase tracking-wide">
        {status}
      </span>
    );
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white p-4 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.01] ${
        isSelected
          ? 'border-2 border-primary soft-shadow'
          : 'border border-border/60 hover:border-primary/50'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-[10px] font-bold text-secondary uppercase tracking-wider">Vehicle ID</p>
          <h3 className="font-title-sm text-primary font-bold text-sm leading-tight">{log.vehicleId}</h3>
        </div>
        {getStatusBadge(log.status)}
      </div>
      
      {log.status?.toUpperCase() === 'SCHEDULED' ? (
        <div className="flex items-center gap-3 my-2.5">
          <div className="p-2 bg-secondary-container rounded-lg">
            <span className="material-symbols-outlined text-secondary text-[20px]">
              {log.icon || 'oil_barrel'}
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-primary">{log.serviceType}</p>
            <p className="text-[10px] text-secondary">{log.timeText}</p>
          </div>
        </div>
      ) : (
        <div className="mb-3">
          <p className="text-xs font-bold text-primary">{log.serviceType}</p>
          <p className="text-[10px] text-secondary">{log.vehicleType}</p>
        </div>
      )}

      {log.status?.toUpperCase() !== 'SCHEDULED' && (
        <div className="flex items-center gap-1 text-[10px] text-secondary">
          <span className="material-symbols-outlined text-[14px]">schedule</span>
          <span>{log.timeText}</span>
        </div>
      )}
    </div>
  );
};

export default MaintenanceCard;
