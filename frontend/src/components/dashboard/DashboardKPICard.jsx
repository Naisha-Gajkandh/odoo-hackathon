import React from 'react';
import * as Icons from 'lucide-react';

const DashboardKPICard = ({ kpi }) => {
  const { label, value, borderColor, iconName } = kpi;
  const IconComponent = Icons[iconName] || Icons.HelpCircle;

  // Premium background & text color tokens for the icon circle
  let iconBg = 'bg-secondary-container text-on-secondary-container';
  if (borderColor.includes('success-green')) {
    iconBg = 'bg-success-green-container text-on-success-green';
  } else if (borderColor.includes('warning-orange')) {
    iconBg = 'bg-warning-orange-container text-on-warning-orange';
  } else if (borderColor.includes('primary')) {
    iconBg = 'bg-primary/5 text-primary';
  }

  return (
    <div
      className={`bg-white p-5 rounded-xl border-l-4 ${borderColor} soft-shadow border border-border/35 select-none hover:-translate-y-1 hover:shadow-md active:scale-[0.99] transition-all duration-300 flex justify-between items-start cursor-pointer group`}
    >
      <div className="space-y-1">
        <p className="text-[10px] font-bold text-secondary uppercase tracking-wider font-headline-md leading-none">
          {label}
        </p>
        <p className="font-headline-md font-black text-[28px] leading-tight tracking-tight text-primary">
          {value}
        </p>
      </div>
      <div className={`w-9 h-9 rounded-full flex items-center justify-center ${iconBg} transition-all duration-300 group-hover:scale-110 shadow-sm`}>
        <IconComponent size={18} strokeWidth={2.5} />
      </div>
    </div>
  );
};

export default DashboardKPICard;
