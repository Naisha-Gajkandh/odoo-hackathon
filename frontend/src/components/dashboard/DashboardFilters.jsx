import React from 'react';

const DashboardFilters = ({
  filters,
  vehicleType,
  setVehicleType,
  status,
  setStatus,
  region,
  setRegion,
}) => {
  const selectClass =
    'bg-white border border-border/60 hover:border-success-green/30 hover:bg-surface-dim rounded-xl text-[12px] font-headline-md font-bold px-4 py-2.5 min-w-[160px] focus:border-success-green focus:ring-2 focus:ring-success-green/10 focus:outline-none text-primary cursor-pointer transition-all duration-300 appearance-auto shadow-sm';

  return (
    <section className="flex flex-wrap gap-4 items-center">
      <p className="text-[10px] font-bold text-secondary uppercase tracking-widest w-full mb-1 font-headline-md">
        Filters
      </p>

      <select
        className={selectClass}
        value={vehicleType}
        onChange={(e) => setVehicleType(e.target.value)}
      >
        {filters.vehicleTypes.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      <select
        className={selectClass}
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        {filters.statuses.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      <select
        className={selectClass}
        value={region}
        onChange={(e) => setRegion(e.target.value)}
      >
        {filters.regions.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </section>
  );
};

export default DashboardFilters;
