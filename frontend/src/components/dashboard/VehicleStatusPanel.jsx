import React from 'react';

const VehicleStatusPanel = ({ statuses }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-border/40 p-6 hover:shadow-md transition-all duration-300">
      <h3 className="font-headline-md font-bold text-[11px] text-secondary uppercase tracking-widest mb-6">
        Vehicle Status
      </h3>
      <div className="space-y-6">
        {statuses.map((item) => (
          <div key={item.label} className="space-y-2 group cursor-default">
            <div className="flex justify-between items-end">
              <span className="text-[12px] font-bold font-headline-md text-primary group-hover:text-success-green transition-colors duration-300">
                {item.label}
              </span>
              <span className="text-[12px] text-secondary font-headline-md font-bold">
                {String(item.count).padStart(2, '0')}
              </span>
            </div>
            <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden border border-border/10">
              <div
                className={`${item.color} h-full rounded-full transition-all duration-1000 ease-out group-hover:brightness-105 shadow-sm`}
                style={{ width: `${item.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleStatusPanel;
