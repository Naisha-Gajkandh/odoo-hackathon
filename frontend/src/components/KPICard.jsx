import React from 'react';

const KPICard = ({ kpi }) => {
  const { title, value, change, trend, icon, iconBg } = kpi;

  // Trend badge — consistent font-headline-md (Manrope) + explicit pixel size
  let badgeClass = "font-headline-md font-bold text-[11px] flex items-center gap-1 px-2.5 py-1 rounded-full ";
  let trendIcon = "trending_up";

  if (trend === 'up') {
    badgeClass += "bg-success-green-container text-on-success-green";
    trendIcon = "trending_up";
  } else if (trend === 'down') {
    badgeClass += "bg-error-container text-error";
    trendIcon = "trending_down";
  } else {
    badgeClass += "bg-secondary-container text-on-secondary-container";
    trendIcon = "remove";
  }

  // Icon background mapped to project design tokens
  let appliedIconBg = "p-3 rounded-xl flex-shrink-0 ";
  if (iconBg.includes('bg-primary-fixed') || icon === 'payments') {
    appliedIconBg += "bg-transit-blue-container text-transit-blue";
  } else if (iconBg.includes('bg-surface-variant') || icon === 'local_shipping') {
    appliedIconBg += "bg-secondary-container text-on-secondary-container";
  } else if (iconBg.includes('bg-tertiary-fixed') || icon === 'timer') {
    appliedIconBg += "bg-warning-orange-container text-on-warning-orange";
  } else {
    appliedIconBg += "bg-success-green-container text-on-success-green";
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-border soft-shadow flex flex-col gap-5 select-none hover:scale-[1.02] transition-transform duration-200">
      <div className="flex justify-between items-start">
        <div className={appliedIconBg}>
          <span className="material-symbols-outlined text-[22px] block">
            {icon}
          </span>
        </div>

        <span className={badgeClass}>
          <span className="material-symbols-outlined text-[14px]">
            {trendIcon}
          </span>
          {change}
        </span>
      </div>

      <div>
        {/* KPI label — Manrope, 10px, uppercase, secondary colour */}
        <p className="font-headline-md font-bold text-[10px] text-secondary uppercase tracking-wider mb-1">
          {title}
        </p>
        {/* KPI value — Manrope Black, 22px — matches HTML prototype display-lg style */}
        <p className="font-headline-md font-black text-[22px] text-primary leading-tight tracking-tight">
          {value}
        </p>
      </div>
    </div>
  );
};

export default KPICard;
