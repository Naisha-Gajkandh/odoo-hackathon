import React, { useState } from 'react';

const FuelExpenseTable = ({ transactions, onReceiptClick }) => {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedTransactions = () => {
    if (!sortField) return transactions;
    return [...transactions].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === 'amount') {
        aVal = parseFloat(aVal) || 0;
        bVal = parseFloat(bVal) || 0;
      } else if (sortField === 'date') {
        aVal = a.rawDate || a.date;
        bVal = b.rawDate || b.date;
      } else {
        aVal = (aVal || '').toString().toLowerCase();
        bVal = (bVal || '').toString().toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const getCategoryBadge = (category) => {
    const base = "px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ";
    
    switch (category?.toUpperCase()) {
      case 'FUEL':
        return <span className={`${base} bg-blue-100 text-blue-700`}>FUEL</span>;
      case 'TOLLS':
        return <span className={`${base} bg-purple-100 text-purple-700`}>TOLLS</span>;
      case 'REPAIR':
        return <span className={`${base} bg-orange-100 text-orange-700`}>REPAIR</span>;
      default:
        return <span className={`${base} bg-secondary-container text-secondary`}>{category}</span>;
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <span className="material-symbols-outlined text-[12px] opacity-30 ml-0.5">unfold_more</span>;
    return sortDirection === 'asc' 
      ? <span className="material-symbols-outlined text-[12px] text-primary ml-0.5">expand_less</span>
      : <span className="material-symbols-outlined text-[12px] text-primary ml-0.5">expand_more</span>;
  };

  const sortedList = getSortedTransactions();

  return (
    <div className="bg-white rounded-2xl soft-shadow border border-border/40 overflow-hidden">
      <div className="p-6 border-b border-border/40 flex justify-between items-center">
        <h3 className="font-headline-md text-sm font-bold text-primary">Recent Transactions</h3>
        <button 
          onClick={() => alert('Viewing complete audit logs...')}
          className="text-transit-blue font-bold text-xs flex items-center gap-1 hover:underline focus:outline-none"
        >
          <span>View Audit Log</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead className="bg-secondary-container/30 text-secondary text-[10px] uppercase font-bold border-b border-border/40">
            <tr>
              <th 
                onClick={() => handleSort('vehicleId')}
                className="px-6 py-4 cursor-pointer hover:bg-secondary-container/50 transition-colors select-none"
              >
                <div className="flex items-center">
                  Vehicle ID <SortIcon field="vehicleId" />
                </div>
              </th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Category</th>
              <th 
                onClick={() => handleSort('date')}
                className="px-6 py-4 cursor-pointer hover:bg-secondary-container/50 transition-colors select-none"
              >
                <div className="flex items-center">
                  Date <SortIcon field="date" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('amount')}
                className="px-6 py-4 text-right cursor-pointer hover:bg-secondary-container/50 transition-colors select-none"
              >
                <div className="flex items-center justify-end">
                  Amount <SortIcon field="amount" />
                </div>
              </th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30 bg-white">
            {sortedList.length > 0 ? (
              sortedList.map((tx) => (
                <tr key={tx.id} className="hover:bg-secondary-container/10 transition-colors">
                  <td className="px-6 py-4 font-bold text-xs text-primary">{tx.vehicleId}</td>
                  <td className="px-6 py-4 text-xs text-primary">{tx.description}</td>
                  <td className="px-6 py-4">{getCategoryBadge(tx.category)}</td>
                  <td 
                    className="px-6 py-4 text-[11px] text-secondary"
                    dangerouslySetInnerHTML={{ __html: tx.date }}
                  />
                  <td className="px-6 py-4 text-right font-bold text-xs text-primary">
                    ${tx.amount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => onReceiptClick(tx)}
                      className="material-symbols-outlined text-secondary hover:text-primary transition-colors focus:outline-none text-[20px]"
                      title="View Receipt"
                    >
                      receipt_long
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-8 text-secondary text-xs italic">
                  No matching transaction records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FuelExpenseTable;
