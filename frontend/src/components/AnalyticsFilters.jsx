import React, { useState } from 'react';

const AnalyticsFilters = ({
  reportType,
  setReportType,
  dateRange,
  setDateRange,
  startDate,
  setStartDate,
  endDate,
  setEndDate
}) => {
  const [showCustomDates, setShowCustomDates] = useState(false);

  const reportTabs = [
    { id: 'Overview',         label: 'Overview',         icon: 'dashboard'      },
    { id: 'Financials',       label: 'Financials',       icon: 'payments'       },
    { id: 'FuelEfficiency',   label: 'Fuel Efficiency',  icon: 'gas_meter'      },
    { id: 'FleetPerformance', label: 'Fleet Performance',icon: 'local_shipping' }
  ];

  const datePresets = ['Last 7 Days', 'Last 30 Days', 'This Month', 'This Quarter'];

  const handleDatePresetClick = (preset) => {
    setDateRange(preset);
    setShowCustomDates(false);
  };

  return (
    <div className="flex flex-col gap-5 bg-white p-5 md:p-6 rounded-xl border border-border soft-shadow select-none">
      <div className="flex flex-col xl:flex-row justify-between gap-5 xl:items-center">

        {/* Report Type Tabs — Manrope 12px bold */}
        <div className="flex overflow-x-auto no-scrollbar bg-secondary-container p-1 rounded-xl max-w-max">
          {reportTabs.map((tab) => {
            const isActive = reportType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setReportType(tab.id)}
                className={`font-headline-md flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Date Preset Buttons — Manrope 12px bold */}
        <div className="flex flex-wrap items-center gap-2">
          {datePresets.map((preset) => {
            const isActive = dateRange === preset && !showCustomDates;
            return (
              <button
                key={preset}
                onClick={() => handleDatePresetClick(preset)}
                className={`font-headline-md px-3.5 py-2 rounded-lg text-[12px] font-bold border transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-primary text-on-primary border-primary shadow-sm'
                    : 'bg-white text-secondary border-border hover:bg-secondary-container hover:text-primary'
                }`}
              >
                {preset}
              </button>
            );
          })}

          {/* Custom Date Range Button */}
          <button
            onClick={() => setShowCustomDates(!showCustomDates)}
            className={`font-headline-md px-3.5 py-2 rounded-lg text-[12px] font-bold border flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
              showCustomDates
                ? 'bg-primary text-on-primary border-primary shadow-sm'
                : 'bg-white text-secondary border-border hover:bg-secondary-container hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">calendar_month</span>
            <span>Custom</span>
          </button>
        </div>
      </div>

      {/* Custom Date Inputs */}
      {showCustomDates && (
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-border animate-fade-in">
          <div className="flex items-center gap-2.5">
            <label className="font-headline-md text-[11px] font-bold text-secondary uppercase tracking-wider">From</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setDateRange('Custom');
              }}
              className="font-headline-md bg-secondary-container border border-border rounded-lg text-[12px] text-primary font-bold px-3 py-2 focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2.5">
            <label className="font-headline-md text-[11px] font-bold text-secondary uppercase tracking-wider">To</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setDateRange('Custom');
              }}
              className="font-headline-md bg-secondary-container border border-border rounded-lg text-[12px] text-primary font-bold px-3 py-2 focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsFilters;
