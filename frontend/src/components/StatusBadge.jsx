import React from 'react';

const StatusBadge = ({ status }) => {
  const base = "px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-wide ";

  switch (status?.toLowerCase()) {
    case 'on duty':
    case 'on route':
    case 'active':
      return (
        <span className={`${base} bg-success-green-container text-on-success-green`}>
          <span className="w-1.5 h-1.5 bg-success-green rounded-full animate-pulse"></span>
          {status}
        </span>
      );
    case 'suspended':
    case 'expired':
      return (
        <span className={`${base} bg-error-container text-error`}>
          <span className="w-1.5 h-1.5 bg-error rounded-full"></span>
          {status}
        </span>
      );
    case 'off duty':
    default:
      return (
        <span className={`${base} bg-secondary-container text-on-secondary-container`}>
          <span className="w-1.5 h-1.5 bg-outline rounded-full"></span>
          {status}
        </span>
      );
  }
};

export default StatusBadge;
