import React, { useState } from 'react';

const MaintenanceTable = ({ history }) => {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort logic
  const sortedHistory = [...history].sort((a, b) => {
    if (!sortField) return 0;
    
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortField === 'cost') {
      aVal = parseFloat(aVal) || 0;
      bVal = parseFloat(bVal) || 0;
    } else {
      aVal = (aVal || '').toString().toLowerCase();
      bVal = (bVal || '').toString().toLowerCase();
    }

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHistory = sortedHistory.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status) => {
    const base = "px-2 py-0.5 rounded-full text-[9px] font-bold inline-flex items-center uppercase tracking-wide ";
    if (status?.toUpperCase() === 'COMPLETED') {
      return (
        <span className={`${base} bg-success-green-container text-on-success-green`}>
          COMPLETED
        </span>
      );
    }
    if (status?.toUpperCase() === 'IN SHOP') {
      return (
        <span className={`${base} bg-warning-orange-container text-on-warning-orange`}>
          IN SHOP
        </span>
      );
    }
    return (
      <span className={`${base} bg-surface-container-highest text-on-surface-variant`}>
        {status}
      </span>
    );
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <span className="material-symbols-outlined text-[12px] opacity-30 ml-0.5">unfold_more</span>;
    return sortDirection === 'asc' 
      ? <span className="material-symbols-outlined text-[12px] text-primary ml-0.5">expand_less</span>
      : <span className="material-symbols-outlined text-[12px] text-primary ml-0.5">expand_more</span>;
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-border/60 soft-shadow hover:shadow-md transition-all duration-300">
      <h3 className="font-headline-md text-base font-bold text-primary mb-4 uppercase tracking-tight">Service History</h3>
      
      {history.length === 0 ? (
        <div className="text-center py-8 text-secondary text-xs italic bg-background rounded-2xl border border-border/40">
          No service records found.
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-xl border border-border/50 mb-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead className="bg-secondary-container/40">
                  <tr className="border-b border-border">
                    <th 
                      onClick={() => handleSort('vehicleId')}
                      className="px-4 py-3 text-[10px] font-bold text-secondary uppercase tracking-wider cursor-pointer hover:bg-secondary-container/60 transition-colors select-none"
                    >
                      <div className="flex items-center">
                        Vehicle <SortIcon field="vehicleId" />
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('serviceType')}
                      className="px-4 py-3 text-[10px] font-bold text-secondary uppercase tracking-wider cursor-pointer hover:bg-secondary-container/60 transition-colors select-none"
                    >
                      <div className="flex items-center">
                        Service <SortIcon field="serviceType" />
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('cost')}
                      className="px-4 py-3 text-[10px] font-bold text-secondary uppercase tracking-wider cursor-pointer hover:bg-secondary-container/60 transition-colors select-none"
                    >
                      <div className="flex items-center">
                        Cost ($) <SortIcon field="cost" />
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('date')}
                      className="px-4 py-3 text-[10px] font-bold text-secondary uppercase tracking-wider cursor-pointer hover:bg-secondary-container/60 transition-colors select-none"
                    >
                      <div className="flex items-center">
                        Date <SortIcon field="date" />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-[10px] font-bold text-secondary uppercase tracking-wider select-none">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 bg-white">
                  {paginatedHistory.map((row) => (
                    <tr key={row.id} className="hover:bg-secondary-container/20 transition-colors">
                      <td className="px-4 py-3.5 text-xs font-bold text-primary">{row.vehicleId}</td>
                      <td className="px-4 py-3.5 text-xs text-primary">{row.serviceType}</td>
                      <td className="px-4 py-3.5 text-xs font-semibold text-primary">
                        {row.cost?.toLocaleString('en-US')}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-secondary">{row.date}</td>
                      <td className="px-4 py-3.5">{getStatusBadge(row.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-secondary">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, history.length)} of {history.length} records
              </span>
              <div className="flex gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="p-1.5 rounded-lg border border-border text-primary hover:bg-secondary-container/40 disabled:opacity-40 disabled:pointer-events-none transition-colors focus:outline-none flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="p-1.5 rounded-lg border border-border text-primary hover:bg-secondary-container/40 disabled:opacity-40 disabled:pointer-events-none transition-colors focus:outline-none flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MaintenanceTable;
