import React, { useState } from 'react';
import EmptyState from './EmptyState';

const AnalyticsTable = ({ reportType = 'Overview', data = [], searchQuery, onReset }) => {
  const [sortField, setSortField] = useState('');
  const [sortAsc, setSortAsc] = useState(true);

  if (reportType === 'Overview' || reportType === 'FleetPerformance') {
    return null; // Don't render on Overview or FleetPerformance modes
  }

  const tableData = data || [];

  // 1. Filter by Search Query
  const filteredData = tableData.filter((row) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    
    // Check vehicleId
    if (row.vehicleId?.toLowerCase().includes(q)) return true;
    // Check type (for fuel efficiency)
    if (row.type?.toLowerCase().includes(q)) return true;
    // Check status
    if (row.status?.toLowerCase().includes(q)) return true;
    
    return false;
  });

  // Helper to parse numbers for sorting
  const parseNumericString = (str) => {
    if (!str) return 0;
    // Remove $, L, km, tons, %, and commas
    const cleaned = str.replace(/[$,L\s]|[km]|[tons]|%/g, '').replace(/,/g, '');
    return parseFloat(cleaned) || 0;
  };

  // 2. Sort Logic
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    
    let valA = a[sortField];
    let valB = b[sortField];
    
    // Parse numeric fields if they contain numbers
    if (
      sortField === 'distance' ||
      sortField === 'fuelCost' ||
      sortField === 'maintenance' ||
      sortField === 'tolls' ||
      sortField === 'driverWage' ||
      sortField === 'total' ||
      sortField === 'fuelConsumed' ||
      sortField === 'avgEfficiency' ||
      sortField === 'carbon'
    ) {
      valA = parseNumericString(valA);
      valB = parseNumericString(valB);
    }

    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return <span className="material-symbols-outlined text-[12px] opacity-40">swap_vert</span>;
    }
    return sortAsc 
      ? <span className="material-symbols-outlined text-[12px] text-primary">arrow_upward</span>
      : <span className="material-symbols-outlined text-[12px] text-primary">arrow_downward</span>;
  };

  return (
    <div className="bg-white rounded-xl border border-border soft-shadow overflow-hidden flex flex-col w-full animate-fade-in select-none">
      <div className="p-5 md:p-6 border-b border-border bg-white flex justify-between items-center">
        <h3 className="font-headline-md text-headline-md text-primary font-black">
          {reportType === 'Financials' ? 'Detailed Vehicle Expenditure' : 'Vehicle Efficiency Log'}
        </h3>
        
        {searchQuery && (
          <span className="text-[10px] bg-secondary-container text-on-secondary-container font-bold px-2 py-1 rounded-lg">
            Filtered: "{searchQuery}"
          </span>
        )}
      </div>

      {sortedData.length === 0 ? (
        <div className="p-6">
          <EmptyState 
            title="No Records Found" 
            message="We couldn't find any vehicles in this table matching your search criteria. Try modifying your search."
            onReset={onReset}
          />
        </div>
      ) : (
        <div className="w-full overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            {reportType === 'Financials' ? (
              <thead>
                <tr className="bg-secondary-container text-on-secondary-container font-bold border-b border-border uppercase tracking-wider">
                  <th onClick={() => handleSort('vehicleId')} className="py-4 px-6 cursor-pointer hover:bg-secondary-container/80 transition-colors select-none">
                    <span className="flex items-center gap-1.5">Vehicle ID {getSortIcon('vehicleId')}</span>
                  </th>
                  <th onClick={() => handleSort('distance')} className="py-4 px-6 cursor-pointer hover:bg-secondary-container/80 transition-colors select-none">
                    <span className="flex items-center gap-1.5">Distance {getSortIcon('distance')}</span>
                  </th>
                  <th onClick={() => handleSort('fuelCost')} className="py-4 px-6 cursor-pointer hover:bg-secondary-container/80 transition-colors select-none">
                    <span className="flex items-center gap-1.5">Fuel Expenses {getSortIcon('fuelCost')}</span>
                  </th>
                  <th onClick={() => handleSort('maintenance')} className="py-4 px-6 cursor-pointer hover:bg-secondary-container/80 transition-colors select-none">
                    <span className="flex items-center gap-1.5">Maintenance {getSortIcon('maintenance')}</span>
                  </th>
                  <th onClick={() => handleSort('tolls')} className="py-4 px-6 cursor-pointer hover:bg-secondary-container/80 transition-colors select-none">
                    <span className="flex items-center gap-1.5">Tolls & Fees {getSortIcon('tolls')}</span>
                  </th>
                  <th onClick={() => handleSort('driverWage')} className="py-4 px-6 cursor-pointer hover:bg-secondary-container/80 transition-colors select-none">
                    <span className="flex items-center gap-1.5">Driver Wages {getSortIcon('driverWage')}</span>
                  </th>
                  <th onClick={() => handleSort('total')} className="py-4 px-6 cursor-pointer hover:bg-secondary-container/80 transition-colors select-none">
                    <span className="flex items-center gap-1.5">Total Cost {getSortIcon('total')}</span>
                  </th>
                </tr>
              </thead>
            ) : (
              <thead>
                <tr className="bg-secondary-container text-on-secondary-container font-bold border-b border-border uppercase tracking-wider">
                  <th onClick={() => handleSort('vehicleId')} className="py-4 px-6 cursor-pointer hover:bg-secondary-container/80 transition-colors select-none">
                    <span className="flex items-center gap-1.5">Vehicle ID {getSortIcon('vehicleId')}</span>
                  </th>
                  <th onClick={() => handleSort('type')} className="py-4 px-6 cursor-pointer hover:bg-secondary-container/80 transition-colors select-none">
                    <span className="flex items-center gap-1.5">Type {getSortIcon('type')}</span>
                  </th>
                  <th onClick={() => handleSort('distance')} className="py-4 px-6 cursor-pointer hover:bg-secondary-container/80 transition-colors select-none">
                    <span className="flex items-center gap-1.5">Distance {getSortIcon('distance')}</span>
                  </th>
                  <th onClick={() => handleSort('fuelConsumed')} className="py-4 px-6 cursor-pointer hover:bg-secondary-container/80 transition-colors select-none">
                    <span className="flex items-center gap-1.5">Fuel Consumed {getSortIcon('fuelConsumed')}</span>
                  </th>
                  <th onClick={() => handleSort('avgEfficiency')} className="py-4 px-6 cursor-pointer hover:bg-secondary-container/80 transition-colors select-none">
                    <span className="flex items-center gap-1.5">Avg Efficiency {getSortIcon('avgEfficiency')}</span>
                  </th>
                  <th onClick={() => handleSort('carbon')} className="py-4 px-6 cursor-pointer hover:bg-secondary-container/80 transition-colors select-none">
                    <span className="flex items-center gap-1.5">Carbon Footprint {getSortIcon('carbon')}</span>
                  </th>
                  <th onClick={() => handleSort('status')} className="py-4 px-6 cursor-pointer hover:bg-secondary-container/80 transition-colors select-none">
                    <span className="flex items-center gap-1.5">Status {getSortIcon('status')}</span>
                  </th>
                </tr>
              </thead>
            )}

            <tbody className="divide-y divide-border text-primary font-bold">
              {reportType === 'Financials' ? (
                sortedData.map((row) => (
                  <tr key={row.vehicleId} className="hover:bg-secondary-container/30 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-2 text-secondary font-bold">
                      <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                      <span className="text-primary">{row.vehicleId}</span>
                    </td>
                    <td className="py-4 px-6">{row.distance}</td>
                    <td className="py-4 px-6">{row.fuelCost}</td>
                    <td className="py-4 px-6">{row.maintenance}</td>
                    <td className="py-4 px-6">{row.tolls}</td>
                    <td className="py-4 px-6">{row.driverWage}</td>
                    <td className="py-4 px-6 text-transit-blue font-black">{row.total}</td>
                  </tr>
                ))
              ) : (
                sortedData.map((row) => {
                  const isOptimal = row.status?.toLowerCase() === 'optimal';
                  return (
                    <tr key={row.vehicleId} className="hover:bg-secondary-container/30 transition-colors">
                      <td className="py-4 px-6 flex items-center gap-2 text-secondary font-bold">
                        <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                        <span className="text-primary">{row.vehicleId}</span>
                      </td>
                      <td className="py-4 px-6 text-secondary">{row.type}</td>
                      <td className="py-4 px-6">{row.distance}</td>
                      <td className="py-4 px-6">{row.fuelConsumed}</td>
                      <td className="py-4 px-6 text-transit-blue font-black">{row.avgEfficiency}</td>
                      <td className="py-4 px-6">{row.carbon}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center gap-1.5 uppercase max-w-max tracking-wide ${
                          isOptimal 
                            ? 'bg-success-green-container text-on-success-green' 
                            : 'bg-error-container text-error'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            isOptimal ? 'bg-success-green animate-pulse' : 'bg-error'
                          }`}></span>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AnalyticsTable;
