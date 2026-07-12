import React from 'react';
import ExportActions from './ExportActions';

const AnalyticsHeader = ({ reportType, dateRange }) => {
  const getSubText = () => {
    let typeLabel = 'Operational efficiency';
    if (reportType === 'Financials') typeLabel = 'Financial metrics and expense allocation';
    if (reportType === 'FuelEfficiency') typeLabel = 'Fuel economy and carbon emission metrics';
    if (reportType === 'FleetPerformance') typeLabel = 'Fleet utilization and dispatch timelines';

    let rangeLabel = 'this period';
    if (dateRange === 'This Month') rangeLabel = 'for June 2024';
    if (dateRange === 'Last 30 Days') rangeLabel = 'for the last 30 days';
    if (dateRange === 'Last 7 Days') rangeLabel = 'for the last 7 days';
    if (dateRange === 'This Quarter') rangeLabel = 'for Q2 2024';

    return `${typeLabel} overview ${rangeLabel}`;
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 select-none">
      <div>
        {/* Title — matches font-headline-md text-[18px] font-black pattern used by VehicleRegistry, DriverManagement */}
        <h2 className="font-headline-md text-headline-md text-primary font-black text-[18px] mb-1">
          Reports &amp; Analytics
        </h2>
        {/* Subtitle — Manrope, 12px, secondary colour */}
        <p className="font-headline-md text-[12px] font-bold text-secondary">
          {getSubText()}
        </p>
      </div>
      <ExportActions reportType={reportType} dateRange={dateRange} />
    </div>
  );
};

export default AnalyticsHeader;
