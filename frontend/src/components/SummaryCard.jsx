import React from 'react';

const SummaryCard = ({ reportType = 'Overview', _dateRange = 'This Month' }) => {
  const getFinancialSummaries = () => [
    { title: 'Total Fuel Cost',    value: '₹13,058', icon: 'local_gas_station', color: 'text-transit-blue bg-transit-blue-container' },
    { title: 'Total Maintenance',  value: '₹9,550',  icon: 'build',            color: 'text-success-green bg-success-green-container' },
    { title: 'Total Driver Wages', value: '₹10,600', icon: 'person',           color: 'text-warning-orange bg-warning-orange-container' },
    { title: 'Total Tolls & Fees', value: '₹2,592',  icon: 'payments',         color: 'text-error bg-error-container' }
  ];

  const getFuelSummaries = () => [
    { title: 'Total Carbon Saved', value: '14.2 tons',     icon: 'eco',     color: 'text-success-green bg-success-green-container' },
    { title: 'Fuel Economy Goal',  value: '22.0 L/100km',  icon: 'target',  color: 'text-transit-blue bg-transit-blue-container' },
    { title: 'Over-speed Alerts',  value: '12 events',     icon: 'warning', color: 'text-warning-orange bg-warning-orange-container' },
    { title: 'CO2 Emission Total', value: '20.7 tons',     icon: 'co2',     color: 'text-error bg-error-container' }
  ];

  const getFleetSummaries = () => [
    { title: 'Trips Completed',    value: '1,420 trips', icon: 'route',                    color: 'text-transit-blue bg-transit-blue-container' },
    { title: 'Average Idle Time',  value: '12%',         icon: 'timer',                    color: 'text-success-green bg-success-green-container' },
    { title: 'Driver Satisfaction',value: '96%',         icon: 'sentiment_very_satisfied', color: 'text-warning-orange bg-warning-orange-container' },
    { title: 'Incident Rate',      value: '0.04%',       icon: 'verified_user',            color: 'text-error bg-error-container' }
  ];

  let items = [];
  let heading = '';

  if (reportType === 'Financials') {
    items = getFinancialSummaries();
    heading = 'Expense Summary Breakdown';
  } else if (reportType === 'FuelEfficiency') {
    items = getFuelSummaries();
    heading = 'Fleet Environmental Impact';
  } else if (reportType === 'FleetPerformance') {
    items = getFleetSummaries();
    heading = 'Operational Efficiency Benchmarks';
  } else {
    return null;
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl border border-border soft-shadow flex flex-col gap-5 select-none w-full animate-fade-in">
      {/* Section heading — Manrope Black, consistent with other card titles */}
      <h3 className="font-headline-md text-headline-md text-primary font-black">
        {heading}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-background border border-border/50 hover:scale-[1.01] transition-transform duration-200">
            <div className={`p-3 rounded-lg flex-shrink-0 ${item.color}`}>
              <span className="material-symbols-outlined text-[20px] block">
                {item.icon}
              </span>
            </div>
            <div>
              {/* Metric label — Manrope, 10px uppercase */}
              <p className="font-headline-md text-[10px] font-bold text-secondary uppercase tracking-wider mb-0.5">
                {item.title}
              </p>
              {/* Metric value — Manrope Black, 14px */}
              <p className="font-headline-md text-[14px] font-black text-primary">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SummaryCard;
